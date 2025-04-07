// Unified booking service that combines salonist and booking functionality
import { apiClient } from './apiClient';

// ==================== TIME AND DATE UTILITIES ====================

// Helper function to convert time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  // Handle empty or invalid time strings
  if (!timeStr) return 0;
  
  const [hourStr, minuteStr] = timeStr.split(':');
  const [minuteWithAmPm, amPm] = minuteStr ? minuteStr.split(' ') : [0, 'AM'];
  
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteWithAmPm);
  
  // Convert to 24-hour format
  if (amPm === 'PM' && hour < 12) {
    hour += 12;
  } else if (amPm === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return hour * 60 + minute;
};

// Helper function to get current date and time
const getCurrentDateTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  return { now, currentHour, currentMinute };
};

// Helper function to check if a time slot is in the past
const isTimeSlotInPast = (date, timeSlot) => {
  if (!date) return true; // If no date, consider it in the past
  
  const { now, currentHour, currentMinute } = getCurrentDateTime();
  
  // Clone the date to avoid modifying the original
  const dateToCheck = new Date(date);
  const nowDate = new Date(now);
  
  // If the date is in the past, all its time slots are in the past
  if (dateToCheck.setHours(0, 0, 0, 0) < nowDate.setHours(0, 0, 0, 0)) {
    return true;
  }
  
  // If the date is today, check if the time slot is in the past
  if (dateToCheck.setHours(0, 0, 0, 0) === nowDate.setHours(0, 0, 0, 0)) {
    const slotMinutes = timeToMinutes(timeSlot);
    const currentMinutes = currentHour * 60 + currentMinute;
    
    // Add a buffer of 30 minutes (can't book less than 30 min in advance)
    return slotMinutes <= (currentMinutes + 30);
  }
  
  return false;
};

// Helper function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Format date for display
const formatDate = (date, format = 'long') => {
  if (!date) return '';
  
  const options = format === 'long' 
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { weekday: 'short', month: 'short', day: 'numeric' };
  
  return new Date(date).toLocaleDateString('en-US', options);
};

// Format date for API requests (YYYY-MM-DD)
const formatDateForApi = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// ==================== SALONIST AVAILABILITY ====================

// Get all salonists for a salon
const getSalonistsForSalon = async (salonId) => {
  try {
    const response = await apiClient.get(`/salons/${salonId}/salonists`);
    return response.data;
  } catch (error) {
    console.error('Error fetching salonists:', error);
    throw error;
  }
};

// Get available dates for a salonist within the next 3 months
const getAvailableDatesForSalonist = async (salonistId, startDate = new Date()) => {
  try {
    const formattedStartDate = formatDateForApi(startDate);
    
    // Calculate end date (3 months from start date)
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 3);
    const formattedEndDate = formatDateForApi(endDate);
    
    const response = await apiClient.get(`/salonists/${salonistId}/available-dates`, {
      params: {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      }
    });
    
    // Convert string dates to Date objects
    return response.data.map(dateStr => new Date(dateStr));
  } catch (error) {
    console.error('Error fetching available dates:', error);
    throw error;
  }
};

// Get available salonists for a specific date
const getAvailableSalonistsForDate = async (salonId, date) => {
  try {
    const formattedDate = formatDateForApi(date);
    
    const response = await apiClient.get(`/salons/${salonId}/available-salonists`, {
      params: {
        date: formattedDate
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching available salonists:', error);
    throw error;
  }
};

// Get available time slots for a salonist on a specific date
const getAvailableTimeSlotsForSalonistOnDate = async (salonistId, date, serviceIds = []) => {
  try {
    const formattedDate = formatDateForApi(date);
    
    const response = await apiClient.get(`/salonists/${salonistId}/availability`, {
      params: {
        date: formattedDate,
        serviceIds: serviceIds.join(',')
      }
    });
    
    return response.data.map(slot => slot.time);
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }
};

// Generate all possible time slots (8 AM to 8 PM in 30-minute increments)
const generateTimeSlots = () => {
  const timeSlots = [];
  
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const amPm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      timeSlots.push(`${hour12}:${minute.toString().padStart(2, '0')} ${amPm}`);
    }
  }
  
  return timeSlots;
};

// Get unavailable time slots with reasons
const getUnavailableTimeSlots = (salonist, date, availableTimeSlots) => {
  if (!salonist || !date) return {};
  
  const allTimeSlots = generateTimeSlots();
  const unavailableSlots = {};
  
  allTimeSlots.forEach(timeSlot => {
    if (!availableTimeSlots.includes(timeSlot)) {
      // Determine why the slot is unavailable
      if (isTimeSlotInPast(date, timeSlot)) {
        unavailableSlots[timeSlot] = {
          reason: 'Past',
          color: 'text-gray-400'
        };
      } else {
        // Default to "Unavailable" for API-based implementation
        unavailableSlots[timeSlot] = {
          reason: 'Unavailable',
          color: 'text-gray-400'
        };
      }
    }
  });
  
  return unavailableSlots;
};

// Get stylist availability status with reason
const getStylistAvailabilityStatus = async (stylist, date) => {
  if (!stylist?.id || !date) {
    return { status: 'unknown', reason: '' };
  }
  
  try {
    const formattedDate = formatDateForApi(date);
    
    const response = await apiClient.get(`/salonists/${stylist.id}/status`, {
      params: {
        date: formattedDate
      }
    });
    
    const { status, availabilityPercentage, reason } = response.data;
    
    // Map API status to UI status
    let uiStatus = 'unavailable';
    let uiReason = reason || 'Not available';
    
    switch (status) {
      case 'available':
        if (availabilityPercentage >= 70) {
          uiStatus = 'available';
          uiReason = 'Available';
        } else if (availabilityPercentage >= 30) {
          uiStatus = 'partially-booked';
          uiReason = 'Some slots available';
        } else {
          uiStatus = 'mostly-booked';
          uiReason = 'Few slots available';
        }
        break;
      case 'fully-booked':
        uiStatus = 'booked';
        uiReason = 'Fully booked';
        break;
      case 'on-leave':
        uiStatus = 'on-leave';
        uiReason = 'On leave today';
        break;
      case 'not-working':
        uiStatus = 'unavailable';
        uiReason = 'Not scheduled today';
        break;
      default:
        uiStatus = 'unavailable';
        uiReason = reason || 'Not available';
    }
    
    return { status: uiStatus, reason: uiReason };
  } catch (error) {
    console.error('Error fetching stylist status:', error);
    return { status: 'unknown', reason: 'Error checking availability' };
  }
};

// ==================== BOOKING UTILITIES ====================

// Calculate total duration of selected services
const calculateTotalDuration = (services) => {
  if (!services || services.length === 0) return 0;
  
  return services.reduce((total, service) => total + (service.duration || 0), 0);
};

// Calculate total price of selected services
const calculateTotalPrice = (services) => {
  if (!services || services.length === 0) return 0;
  
  return services.reduce((total, service) => total + (service.price || 0), 0);
};

// Validate booking data
const validateBookingData = (bookingData) => {
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

// Create booking object for submission
const createBookingObject = (bookingData) => {
  const { salon, services, stylist, date, time } = bookingData;
  
  if (!salon || !services || !stylist || !date || !time) {
    return null;
  }
  
  return {
    salonId: salon.id,
    salonName: salon.name,
    salonistId: stylist.id,
    salonistName: stylist.name,
    services: services.map(service => ({
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.duration
    })),
    date: formatDateForApi(date),
    time,
    totalPrice: calculateTotalPrice(services),
    totalDuration: calculateTotalDuration(services)
  };
};

// Generate dates for the next 3 months
const generateDatesForThreeMonths = (startDate = new Date()) => {
  const dates = [];
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 3);
  
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Export all functions
export {
  // Time and date utilities
  timeToMinutes,
  getCurrentDateTime,
  isTimeSlotInPast,
  isSameDay,
  formatDate,
  formatDateForApi,
  
  // Salonist availability
  getSalonistsForSalon,
  getAvailableDatesForSalonist,
  getAvailableSalonistsForDate,
  getAvailableTimeSlotsForSalonistOnDate,
  generateTimeSlots,
  getUnavailableTimeSlots,
  getStylistAvailabilityStatus,
  
  // Booking utilities
  calculateTotalDuration,
  calculateTotalPrice,
  validateBookingData,
  createBookingObject,
  generateDatesForThreeMonths
};

// For backward compatibility
export default {
  // Time and date utilities
  timeToMinutes,
  getCurrentDateTime,
  isTimeSlotInPast,
  isSameDay,
  formatDate,
  formatDateForApi,
  
  // Salonist availability
  getSalonistsForSalon,
  getAvailableDatesForSalonist,
  getAvailableSalonistsForDate,
  getAvailableTimeSlotsForSalonistOnDate,
  generateTimeSlots,
  getUnavailableTimeSlots,
  getStylistAvailabilityStatus,
  
  // Booking utilities
  calculateTotalDuration,
  calculateTotalPrice,
  validateBookingData,
  createBookingObject,
  generateDatesForThreeMonths
};