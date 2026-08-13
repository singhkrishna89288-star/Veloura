const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\n[Veloura] ERROR: MONGODB_URI is not set in your .env file.');
    console.error('Copy .env.example to .env and set MONGODB_URI before starting the server.\n');
    process.exit(1);
  }

  try {
    console.log('DEBUG MONGODB URI:', JSON.stringify(uri));
    await mongoose.connect(uri);
    console.log(`[Veloura] MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('[Veloura] MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
