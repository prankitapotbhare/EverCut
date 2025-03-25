/**
 * Server Entry Point
 * Initializes the Express application and handles server lifecycle
 */

const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config();

// Import the Express application
const app = require('./src/app');

// Environment variables with defaults
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evercut';

// Create HTTP server
const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Handle server shutdown gracefully
const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
  
  // Force shutdown after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging
});