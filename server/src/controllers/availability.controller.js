const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const availabilityService = require('../services/availability.service');
const Salonist = require('../models/Salonist');
const Salon = require('../models/Salon');

/**
 * @route GET /api/availability/salonists
 * @desc Get all available salonists for a specific date
 * @access Public
 */
const getAvailableSalonists = async (req, res, next) => {
  try {
    const { salonId, date } = req.query;
    
    if (!salonId) {
      return next(new ApiError('Salon ID is required', 400));
    }
    
    // Set default date to today if not provided
    const checkDate = date ? new Date(date) : new Date();
    
    // Validate salon exists
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return next(new ApiError('Salon not found', 404));
    }
    
    const availableSalonists = await availabilityService.getAvailableSalonistsForDate(salonId, checkDate);
    
    res.status(200).json({
      success: true,
      count: availableSalonists.length,
      data: availableSalonists
    });
  } catch (error) {
    logger.error(`Error fetching available salonists: ${error.message}`);
    next(new ApiError('Failed to fetch available salonists', 500));
  }
};

/**
 * @route GET /api/availability/time-slots
 * @desc Get all available time slots for a specific salonist on a specific date
 * @access Public
 */
const getAvailableTimeSlots = async (req, res, next) => {
  try {
    const { salonistId, date } = req.query;
    
    if (!salonistId) {
      return next(new ApiError('Salonist ID is required', 400));
    }
    
    // Set default date to today if not provided
    const checkDate = date ? new Date(date) : new Date();
    
    // Validate salonist exists
    const salonist = await Salonist.findById(salonistId);
    if (!salonist) {
      return next(new ApiError('Salonist not found', 404));
    }
    
    const availableTimeSlots = await availabilityService.getSalonistAvailabilityForDate(salonistId, checkDate);
    
    res.status(200).json({
      success: true,
      count: availableTimeSlots.length,
      data: availableTimeSlots
    });
  } catch (error) {
    logger.error(`Error fetching available time slots: ${error.message}`);
    next(new ApiError('Failed to fetch available time slots', 500));
  }
};

/**
 * @route GET /api/availability/status
 * @desc Get availability status for a specific salonist on a specific date
 * @access Public
 */
const getSalonistAvailabilityStatus = async (req, res, next) => {
  try {
    const { salonistId, date } = req.query;
    
    if (!salonistId) {
      return next(new ApiError('Salonist ID is required', 400));
    }
    
    // Set default date to today if not provided
    const checkDate = date ? new Date(date) : new Date();
    
    // Validate salonist exists
    const salonist = await Salonist.findById(salonistId);
    if (!salonist) {
      return next(new ApiError('Salonist not found', 404));
    }
    
    const availabilityStatus = await availabilityService.getSalonistAvailabilityStatus(salonistId, checkDate);
    
    res.status(200).json({
      success: true,
      data: availabilityStatus
    });
  } catch (error) {
    logger.error(`Error fetching salonist availability status: ${error.message}`);
    next(new ApiError('Failed to fetch salonist availability status', 500));
  }
};

/**
 * @route GET /api/availability/all-time-slots
 * @desc Get all possible time slots
 * @access Public
 */
const getAllTimeSlots = async (req, res, next) => {
  try {
    const { startHour, endHour, interval } = req.query;
    
    const allTimeSlots = availabilityService.generateTimeSlots(
      startHour ? parseInt(startHour) : undefined,
      endHour ? parseInt(endHour) : undefined,
      interval ? parseInt(interval) : undefined
    );
    
    res.status(200).json({
      success: true,
      count: allTimeSlots.length,
      data: allTimeSlots
    });
  } catch (error) {
    logger.error(`Error generating time slots: ${error.message}`);
    next(new ApiError('Failed to generate time slots', 500));
  }
};

/**
 * @route GET /api/availability/check-real-time
 * @desc Check real-time availability of a salonist for a specific date and time
 * @access Public
 */
const checkRealTimeAvailability = async (req, res, next) => {
  try {
    const { salonistId, date, timeSlot } = req.query;
    
    if (!salonistId || !date || !timeSlot) {
      return next(new ApiError('Salonist ID, date, and time slot are required', 400));
    }
    
    // Validate salonist exists
    const salonist = await Salonist.findById(salonistId);
    if (!salonist) {
      return next(new ApiError('Salonist not found', 404));
    }
    
    const checkDate = new Date(date);
    
    // Get available time slots
    const availableTimeSlots = await availabilityService.getSalonistAvailabilityForDate(salonistId, checkDate);
    
    // Check if the requested time slot is available
    const isAvailable = availableTimeSlots.includes(timeSlot);
    
    res.status(200).json({
      success: true,
      data: {
        isAvailable,
        timeSlot,
        date: checkDate.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    logger.error(`Error checking real-time availability: ${error.message}`);
    next(new ApiError('Failed to check real-time availability', 500));
  }
};

module.exports = {
  getAvailableSalonists,
  getAvailableTimeSlots,
  getSalonistAvailabilityStatus,
  getAllTimeSlots,
  checkRealTimeAvailability
}; 