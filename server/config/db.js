const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;

  if (!primaryUri) {
    console.error('MongoDB connection error: MONGO_URI is not set in .env');
    process.exit(1);
  }

  try {
    // Attempt connection to MONGO_URI
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (err) {
    console.warn(`Direct MongoDB connection to ${primaryUri} failed: ${err.message}`);
    console.log('Attempting in-memory MongoDB development server fallback...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log('MongoDB connected successfully');
      return mongoose.connection;
    } catch (fallbackErr) {
      console.error('MongoDB connection failed:', fallbackErr.message);
      process.exit(1);
    }
  }
};

const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, isDBConnected };
