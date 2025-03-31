const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { initializeFirebaseAdmin } = require('./config/firebase-admin');
const { connectDatabase } = require('./config/database');
const { errorHandler } = require('./utils/errors');

// Import routes
const protectedRoutes = require('./routes/protected.routes');
const bookingRoutes = require('./routes/booking.routes');
const salonRoutes = require('./routes/salon.routes');
const paymentRoutes = require('./routes/payment.routes');
const userRoutes = require('./routes/user.routes');

// Initialize Firebase Admin
initializeFirebaseAdmin();

// Connect to MongoDB (skip in test environment if needed)
if (process.env.NODE_ENV !== 'test') {
  connectDatabase();
}

// Create Express app
const app = express();

// Apply security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
// app.use(limiter);

// HTTP request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply routes
app.use('/api', protectedRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found'
    }
  });
});

module.exports = app;