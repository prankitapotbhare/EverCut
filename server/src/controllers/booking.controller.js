/**
 * Booking Controller
 * Handles booking-related operations
 */

const Booking = require('../models/booking.model');
const Salon = require('../models/salon.model');
const Service = require('../models/service.model');

/**
 * Create a new booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createBooking = async (req, res, next) => {
  try {
    const { salonId, services, date, startTime, endTime, notes, staffId } = req.body;
    
    // Validate salon exists
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({
        status: 'error',
        message: 'Salon not found'
      });
    }
    
    // Validate services exist
    const serviceIds = services.map(service => service.serviceId);
    const foundServices = await Service.find({ _id: { $in: serviceIds }, salon: salonId });
    
    if (foundServices.length !== serviceIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'One or more services are invalid'
      });
    }
    
    // Calculate total price and prepare services array
    let totalPrice = 0;
    const bookingServices = foundServices.map(service => {
      totalPrice += service.price;
      return {
        service: service._id,
        name: service.name,
        price: service.price,
        duration: service.duration
      };
    });
    
    // Find staff member if provided
    let staffMember = null;
    if (staffId) {
      staffMember = salon.staff.find(staff => staff._id.toString() === staffId);
      if (!staffMember) {
        return res.status(400).json({
          status: 'error',
          message: 'Staff member not found'
        });
      }
    }
    
    // Create new booking
    const booking = new Booking({
      user: req.user.uid,
      salon: salonId,
      services: bookingServices,
      staff: staffMember ? {
        id: staffMember._id,
        name: staffMember.name
      } : undefined,
      date: new Date(date),
      startTime,
      endTime,
      totalPrice,
      notes,
      customerContact: {
        email: req.user.email,
        phone: req.userData?.phone || ''
      }
    });
    
    await booking.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bookings for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getUserBookings = async (req, res, next) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = { user: req.user.uid };
    if (status) {
      query.status = status;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find bookings
    const bookings = await Booking.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('salon', 'name address contactPhone images');
    
    // Get total count
    const total = await Booking.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: {
        bookings,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single booking by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('salon', 'name address contactPhone images operatingHours');
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }
    
    // Check if user is authorized to view this booking
    if (booking.user !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to view this booking'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        booking
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update booking status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;
    
    const booking = await Booking.findById(id);
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }
    
    // Check if user is authorized to update this booking
    if (booking.user !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this booking'
      });
    }
    
    // Update booking status
    booking.status = status;
    
    // If cancelling, add reason and date
    if (status === 'cancelled') {
      booking.cancellationReason = cancellationReason || 'No reason provided';
      booking.cancellationDate = new Date();
    }
    
    await booking.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Booking status updated successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get salon bookings (for salon owners/admins)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getSalonBookings = async (req, res, next) => {
  try {
    // This endpoint would require additional authorization to verify the user is a salon owner
    const { salonId } = req.params;
    const { status, date, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = { salon: salonId };
    if (status) {
      query.status = status;
    }
    if (date) {
      // If date is provided, find bookings for that specific date
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find bookings
    const bookings = await Booking.find(query)
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Booking.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: {
        bookings,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getSalonBookings
};