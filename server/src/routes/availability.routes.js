const express = require('express');
const { 
  getAvailableSalonists, 
  getAvailableTimeSlots,
  getSalonistAvailabilityStatus,
  getAllTimeSlots,
  checkRealTimeAvailability
} = require('../controllers/availability.controller');
const router = express.Router();

/**
 * @route GET /api/availability/salonists
 * @desc Get all available salonists for a specific date
 * @access Public
 */
router.get('/salonists', getAvailableSalonists);

/**
 * @route GET /api/availability/time-slots
 * @desc Get all available time slots for a specific salonist on a specific date
 * @access Public
 */
router.get('/time-slots', getAvailableTimeSlots);

/**
 * @route GET /api/availability/status
 * @desc Get availability status for a specific salonist on a specific date
 * @access Public
 */
router.get('/status', getSalonistAvailabilityStatus);

/**
 * @route GET /api/availability/all-time-slots
 * @desc Get all possible time slots
 * @access Public
 */
router.get('/all-time-slots', getAllTimeSlots);

/**
 * @route GET /api/availability/check-real-time
 * @desc Check real-time availability of a salonist for a specific date and time
 * @access Public
 */
router.get('/check-real-time', checkRealTimeAvailability);

module.exports = router; 