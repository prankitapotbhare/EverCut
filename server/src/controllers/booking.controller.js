const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const Booking = require('../models/Booking');
const Salonist = require('../models/Salonist');
const Salon = require('../models/Salon');
const Service = require('../models/Service');
const Package = require('../models/Package');
const availabilityService = require('../services/availability.service');

/**
 * @route POST /api/bookings
 * @desc Create a new booking
 * @access Private
 */
const createBooking = async (req, res, next) => {
  try {
    const { salonId, salonistId, serviceIds, packageIds, date, notes } = req.body;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    
    // Validate required fields
    if (!salonId || !salonistId || (!serviceIds && !packageIds) || !date || !startTime || !endTime) {
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
    
    // Fetch services by IDs if serviceIds provided
    let services = [];
    let totalDuration = 0;
    let totalPrice = 0;
    
    if (serviceIds && serviceIds.length > 0) {
      const fetchedServices = await Service.find({
        _id: { $in: serviceIds },
        salonId: salonId,
        isActive: true
      });
      
      if (fetchedServices.length !== serviceIds.length) {
        return next(new ApiError('One or more services not found or not active', 404));
      }
      
      services = fetchedServices.map(service => ({
        serviceId: service._id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        category: service.category
      }));
      
      // Calculate total duration and price from services
      totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
      totalPrice = services.reduce((sum, service) => sum + service.price, 0);
    }
    
    // Fetch packages by IDs if packageIds provided
    if (packageIds && packageIds.length > 0) {
      const fetchedPackages = await Package.find({
        _id: { $in: packageIds },
        salonId: salonId,
        isActive: true
      });
      
      if (fetchedPackages.length !== packageIds.length) {
        return next(new ApiError('One or more packages not found or not active', 404));
      }
      
      // Add package services to the services array
      fetchedPackages.forEach(pkg => {
        // Add package as a service
        services.push({
          serviceId: pkg._id,
          name: pkg.name + ' (Package)',
          price: pkg.price,
          duration: pkg.duration,
          category: 'Package'
        });
        
        // Update totals
        totalDuration += pkg.duration;
        totalPrice += pkg.price;
      });
    }
    
    // Check if the time slot is still available (real-time check)
    const checkDate = new Date(date);
    const availableTimeSlots = await availabilityService.getSalonistAvailabilityForDate(salonistId, checkDate);
    
    // Add debugging logs
    console.log('Booking request details:', {
      salonistId,
      date: checkDate,
      requestedStartTime: startTime,
      availableTimeSlots
    });
    
    // Normalize the requested time for flexible matching
    const normalizeTime = (timeStr) => {
      // Remove all spaces, convert to lowercase, and remove am/pm for comparison
      const normalized = timeStr.replace(/\s+/g, '').toLowerCase();
      const justTime = normalized.replace(/am|pm/g, '');
      
      // Parse hour and minute
      let [hour, minute] = justTime.split(':').map(num => parseInt(num, 10));
      
      // Handle 12-hour format conversion
      const isPM = normalized.includes('pm');
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      
      // Return in standardized format HH:MM (24-hour)
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };
    
    // Try to find a matching time slot
    const normalizedRequestedTime = normalizeTime(startTime);
    console.log('Normalized requested time:', normalizedRequestedTime);
    
    // Check if any of the available slots match when normalized
    const matchingSlot = availableTimeSlots.find(slot => {
      const normalizedSlot = normalizeTime(slot);
      console.log(`Comparing normalized: ${normalizedRequestedTime} with ${normalizedSlot}`);
      return normalizedRequestedTime === normalizedSlot;
    });
    
    if (!matchingSlot) {
      console.log('Time slot mismatch:', {
        requestedTimeSlot: startTime,
        normalizedRequestedTime,
        availableSlots: availableTimeSlots,
        normalizedAvailableSlots: availableTimeSlots.map(slot => normalizeTime(slot))
      });
      return next(new ApiError('Selected time slot is no longer available', 400));
    }
    
    // Use the exact format from the available slots for consistency
    startTime = matchingSlot;
    console.log('Using matching time slot format:', startTime);
    
    // Also normalize endTime to match the required HH:MM format
    endTime = normalizeTime(endTime);
    console.log('Normalized end time:', endTime);
    
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
 * @route GET /api/bookings/salonist/:salonistId
 * @desc Get all bookings for a specific salonist
 * @access Private
 */
const getSalonistBookings = async (req, res, next) => {
  try {
    const { salonistId } = req.params;
    const { date, status } = req.query;
    
    // Validate salonist exists
    const salonist = await Salonist.findById(salonistId);
    if (!salonist) {
      return next(new ApiError('Salonist not found', 404));
    }
    
    // Build query
    const query = { salonistId };
    
    if (status) {
      query.status = status;
    } else {
      // By default, exclude cancelled bookings
      query.status = { $ne: 'cancelled' };
    }
    
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: searchDate,
        $lt: nextDay
      };
    }
    
    // Get bookings
    const bookings = await Booking.find(query)
      .sort({ date: 1, startTime: 1 })
      .populate('salonId', 'name image')
      .populate('userId', 'displayName email');
    
    logger.info(`Retrieved ${bookings.length} bookings for salonist: ${salonistId}`);
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    logger.error(`Error fetching salonist bookings: ${error.message}`);
    next(new ApiError('Failed to fetch salonist bookings', 500));
  }
};

/**
 * @route GET /api/bookings/date/:date
 * @desc Get all bookings for a specific date
 * @access Private
 */
const getBookingsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const { salonId, status } = req.query;
    
    if (!date) {
      return next(new ApiError('Date is required', 400));
    }
    
    // Build query
    const query = {};
    
    // Validate and set date range
    const searchDate = new Date(date);
    if (isNaN(searchDate.getTime())) {
      return next(new ApiError('Invalid date format', 400));
    }
    
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    query.date = {
      $gte: searchDate,
      $lt: nextDay
    };
    
    if (salonId) {
      query.salonId = salonId;
    }
    
    if (status) {
      query.status = status;
    } else {
      // By default, exclude cancelled bookings
      query.status = { $ne: 'cancelled' };
    }
    
    // Get bookings
    const bookings = await Booking.find(query)
      .sort({ startTime: 1 })
      .populate('salonId', 'name image')
      .populate('salonistId', 'name image');
    
    logger.info(`Retrieved ${bookings.length} bookings for date: ${date}`);
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      date: searchDate.toISOString().split('T')[0],
      data: bookings
    });
  } catch (error) {
    logger.error(`Error fetching bookings by date: ${error.message}`);
    next(new ApiError('Failed to fetch bookings by date', 500));
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
    
    // Extract variables from request
    const { serviceIds, packageIds, date, notes, status } = req.body;
    let { startTime, endTime } = req.body;
    
    // Define time normalization function
    const normalizeTime = (timeStr) => {
      if (!timeStr) return null;
      
      // Remove all spaces, convert to lowercase, and remove am/pm for comparison
      const normalized = timeStr.replace(/\s+/g, '').toLowerCase();
      const justTime = normalized.replace(/am|pm/g, '');
      
      // Parse hour and minute
      let [hour, minute] = justTime.split(':').map(num => parseInt(num, 10));
      
      // Handle 12-hour format conversion
      const isPM = normalized.includes('pm');
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      
      // Return in standardized format HH:MM (24-hour)
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };
    
    // If changing date or time, check availability
    if ((date && new Date(date).toDateString() !== booking.date.toDateString()) || 
        (startTime && startTime !== booking.startTime)) {
      
      const newDate = date ? new Date(date) : booking.date;
      
      // Normalize startTime if provided
      if (startTime) {
        startTime = normalizeTime(startTime);
      }
      
      const newStartTime = startTime || booking.startTime;
      
      // Check if the new time slot is available
      const availableTimeSlots = await availabilityService.getSalonistAvailabilityForDate(
        booking.salonistId,
        newDate
      );
      
      // Compare using normalized formats
      const isAvailable = availableTimeSlots.some(slot => 
        normalizeTime(slot) === normalizeTime(newStartTime)
      );
      
      if (!isAvailable) {
        return next(new ApiError('Selected time slot is no longer available', 400));
      }
    }
    
    // Normalize endTime if provided
    if (endTime) {
      endTime = normalizeTime(endTime);
    }
    
    // Update services and packages if provided
    let totalDuration = booking.totalDuration;
    let totalPrice = booking.totalPrice;
    let services = [...booking.services];
    
    // If services or packages are being updated
    if (serviceIds || packageIds) {
      // Reset services array, duration and price
      services = [];
      totalDuration = 0;
      totalPrice = 0;
      
      // Fetch services by IDs if serviceIds provided
      if (serviceIds && serviceIds.length > 0) {
        const fetchedServices = await Service.find({
          _id: { $in: serviceIds },
          salonId: booking.salonId,
          isActive: true
        });
        
        if (fetchedServices.length !== serviceIds.length) {
          return next(new ApiError('One or more services not found or not active', 404));
        }
        
        const servicesData = fetchedServices.map(service => ({
          serviceId: service._id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          category: service.category
        }));
        
        services = [...servicesData];
        totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
        totalPrice = services.reduce((sum, service) => sum + service.price, 0);
      }
      
      // Fetch packages by IDs if packageIds provided
      if (packageIds && packageIds.length > 0) {
        const fetchedPackages = await Package.find({
          _id: { $in: packageIds },
          salonId: booking.salonId,
          isActive: true
        });
        
        if (fetchedPackages.length !== packageIds.length) {
          return next(new ApiError('One or more packages not found or not active', 404));
        }
        
        // Add package services to the services array
        fetchedPackages.forEach(pkg => {
          // Add package as a service
          services.push({
            serviceId: pkg._id,
            name: pkg.name + ' (Package)',
            price: pkg.price,
            duration: pkg.duration,
            category: 'Package'
          });
          
          // Update totals
          totalDuration += pkg.duration;
          totalPrice += pkg.price;
        });
      }
      
      // Update the booking with the new services array and totals
      booking.services = services;
      booking.totalDuration = totalDuration;
      booking.totalPrice = totalPrice;
    }
    
    // Update other fields if provided
    if (date) booking.date = new Date(date);
    if (startTime) booking.startTime = startTime;
    if (endTime) booking.endTime = endTime;
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
  cancelBooking,
  getSalonistBookings,
  getBookingsByDate
};