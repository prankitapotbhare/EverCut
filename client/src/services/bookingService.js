// Centralized booking service for handling all booking-related operations
import { getSalonistAvailability, getAvailableSalonistsForDate, getAvailableDatesForSalonist } from './salonistService';
import { generateTimeSlots, getUnavailableTimeSlots, isTimeSlotInPast } from './schedulingService';

/**
 * Validates booking data to ensure all required fields are present
 * @param {Object} bookingData - The booking data to validate
 * @returns {Object} - Object with isValid flag and any error messages
 */
export const validateBookingData = (bookingData) => {
  const { salon, services, stylist, date, time } = bookingData;
  const errors = {};
  
  if (!salon) errors.salon = 'Salon is required';
  if (!services || services.length === 0) errors.services = 'At least one service is required';
  if (!stylist) errors.stylist = 'Stylist is required';
  if (!date) errors.date = 'Date is required';
  if (!time) errors.time = 'Time is required';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Calculates the total duration of selected services
 * @param {Array} services - Array of selected services
 * @returns {number} - Total duration in minutes
 */
export const calculateTotalDuration = (services) => {
  if (!services || services.length === 0) return 0;
  
  return services.reduce((total, service) => total + (service.duration || 0), 0);
};

/**
 * Calculates the total price of selected services
 * @param {Array} services - Array of selected services
 * @returns {number} - Total price
 */
export const calculateTotalPrice = (services) => {
  if (!services || services.length === 0) return 0;
  
  return services.reduce((total, service) => total + (service.price || 0), 0);
};

/**
 * Checks if a stylist is available for the selected date and time
 * @param {Object} stylist - The stylist to check
 * @param {Date} date - The selected date
 * @param {string} time - The selected time
 * @returns {Promise<boolean>} - Whether the stylist is available
 */
export const checkStylistAvailability = async (stylist, date, time) => {
  if (!stylist || !date || !time) return false;
  
  try {
    const availableTimeSlots = await getSalonistAvailability(stylist.id, date);
    return availableTimeSlots.includes(time);
  } catch (error) {
    console.error('Error checking stylist availability:', error);
    return false;
  }
};

/**
 * Fetches available time slots for a stylist on a specific date
 * @param {Object} stylist - The stylist to check
 * @param {Date} date - The selected date
 * @returns {Promise<Array>} - Array of available time slots
 */
export const getAvailableTimeSlotsForStylist = async (stylist, date) => {
  if (!stylist || !date) return [];
  
  try {
    return await getSalonistAvailability(stylist.id, date);
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return [];
  }
};

/**
 * Fetches available stylists for a specific date
 * @param {Date} date - The selected date
 * @param {number} salonId - The salon ID
 * @returns {Promise<Array>} - Array of available stylists
 */
export const getAvailableStylistsForSelectedDate = async (date, salonId) => {
  if (!date || !salonId) return [];
  
  try {
    return await getAvailableSalonistsForDate(date, salonId);
  } catch (error) {
    console.error('Error fetching available stylists:', error);
    return [];
  }
};

/**
 * Fetches available dates for a specific stylist
 * @param {Object} stylist - The stylist to check
 * @returns {Promise<Array>} - Array of available dates
 */
export const getAvailableDatesForSelectedStylist = async (stylist) => {
  if (!stylist) return [];
  
  try {
    return await getAvailableDatesForSalonist(stylist.id);
  } catch (error) {
    console.error('Error fetching available dates:', error);
    return [];
  }
};

/**
 * Formats a date for display
 * @param {Date} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = { weekday: 'long', month: 'short', day: 'numeric' }) => {
  if (!date) return '';
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Checks if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} - Whether the dates are the same day
 */
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

/**
 * Creates a booking object with all necessary data
 * @param {Object} bookingData - The booking data
 * @returns {Object} - Complete booking object
 */
export const createBookingObject = (bookingData) => {
  const { salon, services, stylist, date, time } = bookingData;
  
  return {
    salonId: salon?.id,
    salonName: salon?.name,
    salonistId: stylist?.id,
    salonistName: stylist?.name,
    services: services || [],
    date: date ? date.toISOString() : null,
    time,
    totalDuration: calculateTotalDuration(services),
    totalPrice: calculateTotalPrice(services),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
};