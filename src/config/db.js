const mongoose = require("mongoose");

/**
 * Connect to MongoDB database using Mongoose
 * Uses connection string from environment variables
 */
const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI;

    if (!connectionString) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const connectionOptions = {
      // Remove deprecated options, use modern defaults
    };

    const connection = await mongoose.connect(
      connectionString,
      connectionOptions
    );

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);

    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

/**
 * Handle MongoDB connection events
 */
mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB connection error:", error);
});

module.exports = connectDB;
