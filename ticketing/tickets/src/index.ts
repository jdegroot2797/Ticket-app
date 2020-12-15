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

  try {
    await natsWrapper.connect('tix', 'asdsadas', 'http://nats-srv:4222');

    // event handler if client is closed or disconnected from NATS
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed successfully');
      process.exit();
    });

    // sig handler to check if listener is interupted or killed
    // this allows for graceful stan client shutdown
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

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
