import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

// Required for typescript to recognize testing authentication helper
declare global {
  namespace NodeJS {
    interface Global {
      testSignin(): string[];
      testMongoId(): string[];
    }
  }
}

// utilize the fake implementation
jest.mock('../nats-wrapper');

let mongo: any;

// Hook that runs before all tests
// sets up in memory mongo db server
beforeAll(async () => {
  // env variable is defined in pod, for testing purposes
  // declaring env variable here
  process.env.JWT_KEY = 'asdassdadsa';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Hook that runs before each test
// reaches into mongo db and deletes all collections
// this allows a fresh slate of data before each test that is run
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Hook that runs after all tests are completed
// cleans up server and shuts down server and connection
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Global auth testing helper
// since all test must be self contained for each service
// and when testing we don't want to interact with auth
// we need to make our own testing JWT for auth testing in tickets service

global.testSignin = () => {
  // Build a JWT paylod {id, email, iat}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build a sesson object { jwt: JWT}
  // then use it in a session
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);

  // take JSON and encode in base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string with cookie and encoded data
  // supertest requires string to be in an array
  return [`express:sess=${base64}`];
};

global.testMongoId = () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  return [id];
};
