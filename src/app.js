const express = require("express");
require("dotenv").config();
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const schema = require("./graphql/schema");

// Import routes
const rootRoutes = require("./routes/rootRoutes");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const taskRoutes = require("./routes/taskRoutes");
const fileRoutes = require("./routes/fileRoutes");

// Initialize Express app
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Root route
app.use("/", rootRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// Notes routes (protected - requires authentication)
app.use("/api/notes", noteRoutes);

// Tasks routes (protected - requires authentication)
app.use("/api/tasks", taskRoutes);

// Files routes (protected - requires authentication)
app.use("/api/files", fileRoutes);

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true, // Enable GraphiQL interface
  })
);

// Health check endpoint (optional but recommended)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware (prepared for future use)
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
