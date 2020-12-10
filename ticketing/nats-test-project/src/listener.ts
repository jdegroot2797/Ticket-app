import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
console.clear();

// randomly generate client id so we can have multiple listener clients
const stan = nats.connect('tix', randomBytes(6).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // options for node nats is done by chained function calls instead of object
  const options = stan
    .subscriptionOptions()
    // default nats behavior is to automatically process incoming event
    // issue is if we want to save this to our DB but db goes down the event is lost
    // if manual ack mode is set it is up to developers to process and acknowledgement
    .setManualAckMode(true)
    // ensures when subscription is created, for the first time only it
    // will grab all past events and pass them to the newly online service
    .setDeliverAllAvailable()
    // ensures events that have been delivered in the pass will be marked as delivered
    // as long as the subscription has a queue group if service disconnects or restarts
    // it will continue to persist and will not be dumped
    .setDurableName('order-service');

  // state object to listen to
  const subscription = stan.subscribe(
    'ticket:created', // name of channel
    'order-service-queue-group', // name of queue group, used if multiple listeners for a service
    options,
  );

  // NATS community refers to event as message
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`received event #:${msg.getSequence()}, with data: ${data}`);
    }

    // at this point with manualAckMode on we tell NATS server we got the message
    msg.ack();
  });

  // event handler if client is closed or disconnected from NATS
  stan.on('close', () => {
    console.log('NATS connection closed successfully');
    process.exit();
  });
});

// sig handler to check if listener is interupted or killed
// this allows for graceful stan client shutdown
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;
  protected ackWait = 5000; // milliseconds

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions(),
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
