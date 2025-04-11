const express = require('express');
const { verifyToken, requireEmailVerified } = require('../middleware/auth.middleware');
const { 
  createBooking, 
  getBookings, 
  getBookingById, 
  updateBooking, 
  cancelBooking,
  getSalonistBookings,
  getBookingsByDate
} = require('../controllers/booking.controller');
const router = express.Router();

/**
 * @route POST /api/bookings
 * @desc Create a new booking
 * @access Private
 */
router.post('/', verifyToken, requireEmailVerified, createBooking);

/**
 * @route GET /api/bookings
 * @desc Get all bookings for the authenticated user
 * @access Private
 */
router.get('/', verifyToken, requireEmailVerified, getBookings);

/**
 * @route GET /api/bookings/salonist/:salonistId
 * @desc Get all bookings for a specific salonist
 * @access Private
 */
router.get('/salonist/:salonistId', verifyToken, getSalonistBookings);

/**
 * @route GET /api/bookings/date/:date
 * @desc Get all bookings for a specific date
 * @access Private
 */
router.get('/date/:date', verifyToken, getBookingsByDate);

/**
 * @route GET /api/bookings/:id
 * @desc Get a booking by ID
 * @access Private
 */
router.get('/:id', verifyToken, requireEmailVerified, getBookingById);

/**
 * @route PUT /api/bookings/:id
 * @desc Update a booking
 * @access Private
 */
router.put('/:id', verifyToken, requireEmailVerified, updateBooking);

/**
 * @route DELETE /api/bookings/:id
 * @desc Cancel a booking
 * @access Private
 */
router.delete('/:id', verifyToken, requireEmailVerified, cancelBooking);

module.exports = router;