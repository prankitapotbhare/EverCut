const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const Booking = require('../models/Booking');
const Salonist = require('../models/Salonist');
const Salon = require('../models/Salon');

/**
 * @route POST /api/bookings
 * @desc Create a new booking
 * @access Private
 */
const createBooking = async (req, res, next) => {
  try {
    const { salonId, salonistId, services, date, startTime, endTime, totalDuration, totalPrice, notes } = req.body;
    
    // Validate required fields
    if (!salonId || !salonistId || !services || !date || !startTime || !endTime) {
      return next(new ApiError('Missing required booking information', 400));
    }
    
    // Verify salon and salonist exist
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return next(new ApiError('Salon not found', 404));
    }
    
    const salonist = await Salonist.findById(salonistId);
    if (!salonist) {
      return next(new ApiError('Salonist not found', 404));
    }
    
    // Create new booking
    const booking = new Booking({
      userId: req.user.uid,
      salonId,
      salonName: salon.name,
      salonistId,
      salonistName: salonist.name,
      services,
      date: new Date(date),
      startTime,
      endTime,
      totalDuration,
      totalPrice,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    // Save booking to database
    const savedBooking = await booking.save();
    
    logger.info(`Booking created: ${savedBooking._id} for user: ${req.user.uid}`);
    
    res.status(201).json({
      success: true,
      data: savedBooking
    });
  } catch (error) {
    logger.error(`Error creating booking: ${error.message}`);
    next(new ApiError('Failed to create booking', 500));
  }
};

/**
 * @route GET /api/bookings
 * @desc Get all bookings for the authenticated user
 * @access Private
 */
const getBookings = async (req, res, next) => {
  try {
    // Get query parameters for filtering
    const { status, date, salonId, salonistId } = req.query;
    
    // Build query object
    const query = { userId: req.user.uid };
    
    if (status) query.status = status;
    if (salonId) query.salonId = salonId;
    if (salonistId) query.salonistId = salonistId;
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: searchDate,
        $lt: nextDay
      };
    }
    
    // Find bookings
    const bookings = await Booking.find(query)
      .sort({ date: -1, startTime: 1 })
      .populate('salonId', 'name image')
      .populate('salonistId', 'name image');
    
    logger.info(`Retrieved ${bookings.length} bookings for user: ${req.user.uid}`);
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    logger.error(`Error fetching bookings: ${error.message}`);
    next(new ApiError('Failed to fetch bookings', 500));
  }
};

/**
 * @route GET /api/bookings/:id
 * @desc Get a booking by ID
 * @access Private
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('salonId', 'name image address contactPhone contactEmail')
      .populate('salonistId', 'name image specialties');
    
    if (!booking) {
      return next(new ApiError('Booking not found', 404));
    }
    
    // Check if the booking belongs to the authenticated user
    if (booking.userId !== req.user.uid) {
      return next(new ApiError('Not authorized to access this booking', 403));
    }
    
    logger.info(`Retrieved booking ${req.params.id} for user: ${req.user.uid}`);
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    logger.error(`Error fetching booking: ${error.message}`);
    next(new ApiError('Failed to fetch booking', 500));
  }
};

/**
 * @route PUT /api/bookings/:id
 * @desc Update a booking
 * @access Private
 */
const updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return next(new ApiError('Booking not found', 404));
    }
    
    // Check if the booking belongs to the authenticated user
    if (booking.userId !== req.user.uid) {
      return next(new ApiError('Not authorized to update this booking', 403));
    }
    
    // Check if booking can be updated (not completed or cancelled)
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return next(new ApiError(`Cannot update a ${booking.status} booking`, 400));
    }
    
    // Update booking
    const { services, date, startTime, endTime, totalDuration, totalPrice, notes, status } = req.body;
    
    if (services) booking.services = services;
    if (date) booking.date = new Date(date);
    if (startTime) booking.startTime = startTime;
    if (endTime) booking.endTime = endTime;
    if (totalDuration) booking.totalDuration = totalDuration;
    if (totalPrice) booking.totalPrice = totalPrice;
    if (notes) booking.notes = notes;
    if (status && ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
      booking.status = status;
    }
    
    booking.updatedAt = Date.now();
    
    // Save updated booking
    booking = await booking.save();
    
    logger.info(`Updated booking ${req.params.id} for user: ${req.user.uid}`);
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    logger.error(`Error updating booking: ${error.message}`);
    next(new ApiError('Failed to update booking', 500));
  }
};

/**
 * @route DELETE /api/bookings/:id
 * @desc Cancel a booking
 * @access Private
 */
const cancelBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return next(new ApiError('Booking not found', 404));
    }
    
    // Check if the booking belongs to the authenticated user
    if (booking.userId !== req.user.uid) {
      return next(new ApiError('Not authorized to cancel this booking', 403));
    }
    
    // Check if booking can be cancelled (not completed or already cancelled)
    if (booking.status === 'completed') {
      return next(new ApiError('Cannot cancel a completed booking', 400));
    }
    
    if (booking.status === 'cancelled') {
      return next(new ApiError('Booking is already cancelled', 400));
    }
    
    // Update booking status to cancelled
    booking.status = 'cancelled';
    booking.updatedAt = Date.now();
    
    // Save updated booking
    booking = await booking.save();
    
    logger.info(`Cancelled booking ${req.params.id} for user: ${req.user.uid}`);
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    logger.error(`Error cancelling booking: ${error.message}`);
    next(new ApiError('Failed to cancel booking', 500));
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking
};