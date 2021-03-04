import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

// view only NATS related logs
console.clear();

// stan is instance of NATS client
// community convention is to call the client stan

// use cmd: kubectl port-forward <Pod containing nats service> <outside-port>:<pod-port>
// to allow a connection of local test project to talk to k8s NATS pod.
const stan = nats.connect('tix', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connection to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '2033',
      title: 'concert',
      price: 30,
    });
  } catch (err) {
    console.log(err);
  }
});
