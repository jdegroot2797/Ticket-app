import mongoose from 'mongoose';

import { app } from './app';
// import is lowercase for natsWrapper since this is
// indicating this an instance of the natsWrapper
import { natsWrapper } from './nats-wrapper';

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY environment variable must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable must be defined');
  }

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

    // initalize listeners and call listen

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

// listen for traffic after app is live
startUp();
