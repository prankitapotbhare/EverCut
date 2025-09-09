const express = require('express');
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
router.post('/', createBooking);

/**
 * @route GET /api/bookings
 * @desc Get all bookings for the authenticated user
 * @access Private
 */
router.get('/', getBookings);

/**
 * @route GET /api/bookings/salonist/:salonistId
 * @desc Get all bookings for a specific salonist
 * @access Private
 */
router.get('/salonist/:salonistId', getSalonistBookings);

/**
 * @route GET /api/bookings/date/:date
 * @desc Get all bookings for a specific date
 * @access Private
 */
router.get('/date/:date', getBookingsByDate);

/**
 * @route GET /api/bookings/:id
 * @desc Get a booking by ID
 * @access Private
 */
router.get('/:id', getBookingById);

/**
 * @route PUT /api/bookings/:id
 * @desc Update a booking
 * @access Private
 */
router.put('/:id', updateBooking);

/**
 * @route DELETE /api/bookings/:id
 * @desc Cancel a booking
 * @access Private
 */
router.delete('/:id', cancelBooking);

module.exports = router;