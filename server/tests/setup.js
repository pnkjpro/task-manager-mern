const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Use a separate test database
const TEST_URI = process.env.MONGO_URI.replace(
  '?appName=',
  'taskmanager_test?appName='
);

beforeAll(async () => {
  await mongoose.connect(TEST_URI);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
