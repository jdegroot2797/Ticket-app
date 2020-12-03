import mongoose from 'mongoose';

import { app } from './app';

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY environment variable must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
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
