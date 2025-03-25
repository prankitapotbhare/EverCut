/**
 * Booking Routes
 * Defines API endpoints for booking-related operations
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All booking routes require authentication
router.use(authMiddleware.verifyToken);

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings for the current user
router.get('/user', bookingController.getUserBookings);

// Get a single booking by ID
router.get('/:id', bookingController.getBookingById);

// Update booking status (cancel, etc.)
router.patch('/:id/status', bookingController.updateBookingStatus);

// Get all bookings for a salon (requires salon owner/admin role)
// This would typically have additional authorization middleware
router.get('/salon/:salonId', bookingController.getSalonBookings);

module.exports = router;