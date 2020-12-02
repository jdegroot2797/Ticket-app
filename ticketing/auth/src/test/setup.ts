import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

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
        useUnifiedTopology: true
    });
});

// Hook that runs before each test
// reaches into mongo db and deletes all collections
// this allows a fresh slate of data before each test that is run
beforeEach(async () =>{
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

// Hook that runs after all tests are completed
// cleans up server and shuts down server and connection
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});