/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

// Import routes
const bookingRoutes = require('./routes/booking.routes');
const salonRoutes = require('./routes/salon.routes');

// Initialize express app
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // HTTP request logging
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// API routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/salons', salonRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to EverCut API' });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error for server-side debugging
  console.error(`Error ${statusCode}: ${message}`);
  if (statusCode === 500) {
    console.error(err.stack);
  }
  
  // Send error response to client
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Include stack trace in development environment only
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;