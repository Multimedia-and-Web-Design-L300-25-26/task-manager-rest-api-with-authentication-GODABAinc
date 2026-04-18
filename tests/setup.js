import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Set JWT_SECRET for testing
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test_secret";
}

let mongoServer;

// Setup MongoDB in-memory for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  await mongoose.connect(mongoUri);
}, 60000);

// Clear database before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const collection of collections) {
    await mongoose.connection.db.collection(collection.name).deleteMany({});
  }
});

// Close database after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 60000);

export default null;