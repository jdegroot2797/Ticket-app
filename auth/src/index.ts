import mongoose from 'mongoose';

import { app } from './app';

const startUp = async () => {
  console.log('starting up...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY environment variable must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable must be defined');
  }

  try {
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
