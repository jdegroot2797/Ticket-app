// import is lowercase for natsWrapper since this is
// indicating this an instance of the natsWrapper
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const startUp = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID environment variable must be defined');
  }

  if (!process.env.NATS_URI) {
    throw new Error('NATS_URI environment variable must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID environment variable must be defined');
  }

  // initialize the nats client through the natsWrapper singleton class
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI,
    );

    // event handler if client is closed or disconnected from NATS
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed successfully');
      process.exit();
    });

    // sig handler to check if listener is interupted or killed
    // this allows for graceful stan client shutdown
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // Listeners
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

// listen for traffic after app is live
startUp();
