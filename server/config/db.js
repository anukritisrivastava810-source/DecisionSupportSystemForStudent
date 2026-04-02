const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    // Harden connection options for cloud deployments
    const options = {
      serverSelectionTimeoutMS: 15000, // Wait 15s before giving up
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6 first
    };

    console.log(`[DB] 🔌 Internal: Targetting Mongo Cluster...`);
    const conn = await mongoose.connect(mongoUri, options);

    console.log(`[DB] ✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[DB] ❌ MongoDB Connection Error: ${error.message}`);
    // Only exit in production/CI. Re-throw to allow higher-level handling if desired
    process.exit(1);
  }
};

module.exports = connectDB;