import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

// Required for typescript to recognize testing authentication helper
declare global {
  namespace NodeJS {
    interface Global {
      testSignup(): Promise<string[]>;
    }
  }
}

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
// for use in test environment so when testing authentication services
// put into the global space so an import isn't needed each timers

global.testSignup = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = res.get('Set-Cookie');

  return cookie;
};
