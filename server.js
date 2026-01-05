require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const initSocket = require("./src/sockets/socket");

// Get port from environment variables or use default
const PORT = process.env.PORT || 5000;

/**
 * Start the Express server with Socket.io
 * Connects to MongoDB first, then starts listening on the specified port
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server with Express app
    const server = http.createServer(app);

    // Initialize Socket.io with HTTP server
    initSocket(server);

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔌 Socket.io initialized`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Promise Rejection:", error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});
