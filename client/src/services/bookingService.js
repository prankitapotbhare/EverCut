// Unified booking service that combines salonist and booking functionality
import { 
  getAllBookings, 
  getBookingsForSalonist, 
  getBookingsForDate, 
  getBookingsForSalonistOnDate,
  isSalonistBookedForTimeSlot,
  getBookedTimeSlotsForSalonist
} from '@/data/mockBookings';

import { 
  mockLeaveSchedules, 
  isSalonistOnLeave, 
  isSalonistOnLeaveForTimeSlot 
} from '@/data/mockLeaveSchedules';

import mockSalonists from '@/data/mockSalonists';
import { mockSchedules } from '@/data/mockSchedules';

// ==================== TIME AND DATE UTILITIES ====================

// Helper function to convert time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  const [hourStr, minuteStr] = timeStr.split(':');
  const [minuteWithAmPm, amPm] = minuteStr.split(' ');
  
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
    
    // Check if the time slot is in the past
    if (slotMinutes <= currentMinutes) {
      return true;
    }
  }
  
  return false;
};

// Helper function to generate time slots
const generateTimeSlots = (startHour = 8, endHour = 20, interval = 30) => {
  const slots = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const displayMinute = minute === 0 ? '00' : minute;
      const timeString = `${displayHour}:${displayMinute} ${isPM ? 'PM' : 'AM'}`;
      
      slots.push(timeString);
    }
  }
  
  return slots;
};

// Formats a date for display
const formatDate = (date, options = { weekday: 'long', month: 'short', day: 'numeric' }) => {
  if (!date) return '';
  
  return date.toLocaleDateString('en-US', options);
};

// Checks if two dates are the same day
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

// ==================== SALONIST FUNCTIONS ====================

// Get all salonists
const getSalonists = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSalonists);
    }, 300);
  });
};

// Get salonist by ID
const getSalonistById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const salonist = mockSalonists.find(s => s.id === parseInt(id));
      if (salonist) {
        resolve(salonist);
      } else {
        reject(new Error(`Salonist with ID ${id} not found`));
      }
    }, 300);
  });
};

// Get salonists for a specific salon
const getSalonistsBySalonId = async (salonId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would filter by salon ID
      // For mock data, we'll just return all salonists
      resolve(mockSalonists);
    }, 300);
  });
};

// Get salonist ratings and reviews
const getSalonistRatings = async (salonistId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const salonist = mockSalonists.find(s => s.id === parseInt(salonistId));
      if (!salonist) {
        reject(new Error('Salonist not found'));
        return;
      }
      
      resolve({
        salonistId,
        averageRating: salonist.rating,
        totalReviews: salonist.reviews,
        ratingDistribution: {
          5: Math.floor(salonist.reviews * 0.7),
          4: Math.floor(salonist.reviews * 0.2),
          3: Math.floor(salonist.reviews * 0.05),
          2: Math.floor(salonist.reviews * 0.03),
          1: Math.floor(salonist.reviews * 0.02)
        }
      });
    }, 300);
  });
};

// Get salonist availability for a specific date
const getSalonistAvailability = async (salonistId, date) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Don't redefine salonistId - use the parameter directly
      const stylistId = parseInt(salonistId);
      
      // Format date to YYYY-MM-DD for lookup
      const dateString = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : new Date(date).toISOString().split('T')[0];
      
      // Get the salonist's schedule for this date
      const salonistSchedule = mockSchedules[stylistId] || {};
      const allTimeSlots = salonistSchedule[dateString] || [];
      
      // Filter out time slots that are:
      // 1. In the past
      // 2. During the salonist's leave time
      // 3. Already booked
      const availableTimeSlots = allTimeSlots.filter(timeSlot => 
        !isTimeSlotInPast(date, timeSlot) && 
        !isSalonistOnLeaveForTimeSlot(stylistId, date, timeSlot) &&
        !isSalonistBookedForTimeSlot(stylistId, date, timeSlot)
      );
      
      resolve(availableTimeSlots);
    }, 300);
  });
};

// Get available salonists for a specific date and time
const getAvailableSalonists = async (date, time, salonId = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter salonists who are:
      // 1. Not on leave for this date/time
      // 2. Not already booked for this time
      // 3. Have this time slot in their schedule
      const availableSalonists = mockSalonists.filter(salonist => {
        // Format date to YYYY-MM-DD for lookup
        const dateString = date instanceof Date 
          ? date.toISOString().split('T')[0] 
          : new Date(date).toISOString().split('T')[0];
        
        // Get the salonist's schedule for this date
        const salonistSchedule = mockSchedules[salonist.id] || {};
        const timeSlots = salonistSchedule[dateString] || [];
        
        // Check if this time slot is in their schedule
        const hasTimeSlot = timeSlots.includes(time);
        
        // Check if they're not on leave
        const notOnLeave = !isSalonistOnLeaveForTimeSlot(salonist.id, date, time);
        
        // Check if they're not already booked
        const notBooked = !isSalonistBookedForTimeSlot(salonist.id, date, time);
        
        return hasTimeSlot && notOnLeave && notBooked;
      });
      
      resolve(availableSalonists);
    }, 300);
  });
};

// Get available salonists for a specific date (any time)
const getAvailableSalonistsForDate = async (date, salonId = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter salonists who have at least one available time slot on this date
      const availableSalonists = mockSalonists.filter(async salonist => {
        const availableTimeSlots = await getSalonistAvailability(salonist.id, date);
        return availableTimeSlots.length > 0;
      });
      
      resolve(availableSalonists);
    }, 300);
  });
};

// Get available dates for a specific salonist
const getAvailableDatesForSalonist = async (salonistId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const salonistId = parseInt(salonistId);
      const availableDates = [];
      
      // Get the salonist's schedule
      const salonistSchedule = mockSchedules[salonistId] || {};
      
      // Check each date in the schedule
      for (const dateString in salonistSchedule) {
        const timeSlots = salonistSchedule[dateString] || [];
        
        // If there are time slots available on this date, add it to the list
        if (timeSlots.length > 0) {
          availableDates.push(new Date(dateString));
        }
      }
      
      resolve(availableDates);
    }, 300);
  });
};

// Get unavailable time slots with detailed reasons
const getUnavailableTimeSlots = (selectedStylist, selectedDate, availableTimeSlots) => {
  if (!selectedStylist || !selectedDate) return {};
  
  const allPossibleTimeSlots = generateTimeSlots();
  const unavailableWithReasons = {};
  
  // Check each possible time slot
  allPossibleTimeSlots.forEach(timeSlot => {
    // Skip if the slot is available
    if (availableTimeSlots.includes(timeSlot)) return;
    
    // Check if the slot is unavailable due to booking
    if (isSalonistBookedForTimeSlot(selectedStylist.id, selectedDate, timeSlot)) {
      // Get booking details if available
      const bookings = getBookingsForSalonistOnDate(selectedStylist.id, selectedDate);
      const matchingBooking = bookings.find(booking => {
        const bookingTimeSlot = booking.timeSlot;
        return bookingTimeSlot === timeSlot;
      });
      
      if (matchingBooking && matchingBooking.services && matchingBooking.services.length > 0) {
        const serviceName = matchingBooking.services[0].name;
        unavailableWithReasons[timeSlot] = { 
          reason: `Booked (${serviceName})`, 
          color: 'text-red-500',
          type: 'booking'
        };
      } else {
        unavailableWithReasons[timeSlot] = { 
          reason: 'Booked', 
          color: 'text-red-500',
          type: 'booking'
        };
      }
      return;
    }
    
    // Check if the slot is unavailable due to leave
    if (isSalonistOnLeaveForTimeSlot(selectedStylist.id, selectedDate, timeSlot)) {
      // Get leave details if available
      const leaveSchedule = mockLeaveSchedules[selectedStylist.id] || [];
      const partialDayLeave = leaveSchedule.find(leave => 
        leave.type === 'PARTIAL_DAY' && 
        leave.date.getDate() === selectedDate.getDate() &&
        leave.date.getMonth() === selectedDate.getMonth() &&
        leave.date.getFullYear() === selectedDate.getFullYear()
      );
      
      if (partialDayLeave && partialDayLeave.reason) {
        unavailableWithReasons[timeSlot] = { 
          reason: `On leave: ${partialDayLeave.reason}`, 
          color: 'text-amber-500',
          type: 'leave'
        };
      } else {
        unavailableWithReasons[timeSlot] = { 
          reason: 'On leave', 
          color: 'text-amber-500',
          type: 'leave'
        };
      }
      return;
    }
    
    // Check if the slot is in the past
    if (isTimeSlotInPast(selectedDate, timeSlot)) {
      unavailableWithReasons[timeSlot] = { 
        reason: 'Past time', 
        color: 'text-gray-400',
        type: 'past'
      };
      return;
    }
    
    // If none of the above, it's just not in the stylist's schedule
    unavailableWithReasons[timeSlot] = { 
      reason: 'Not available', 
      color: 'text-gray-500',
      type: 'unavailable'
    };
  });
  
  return unavailableWithReasons;
};

// ==================== BOOKING FUNCTIONS ====================

// Validates booking data to ensure all required fields are present
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

// Calculates the total duration of selected services
const calculateTotalDuration = (services) => {
  if (!services || services.length === 0) return 0;
  
  return services.reduce((total, service) => {
    // Extract duration in minutes from string like "30 min" or convert number
    let duration = service.duration;
    if (typeof duration === 'string') {
      duration = parseInt(duration.split(' ')[0]);
    }
    return total + (duration || 0);
  }, 0);
};

// Calculates the total price of selected services
const calculateTotalPrice = (services) => {
  if (!services || services.length === 0) return 0;
  
  return services.reduce((total, service) => total + (service.price || 0), 0);
};

// Checks if a stylist is available for the selected date and time
const checkStylistAvailability = async (stylist, date, time) => {
  if (!stylist || !date || !time) return false;
  
  try {
    const availableTimeSlots = await getSalonistAvailability(stylist.id, date);
    return availableTimeSlots.includes(time);
  } catch (error) {
    console.error('Error checking stylist availability:', error);
    return false;
  }
};

// Creates a booking object with all necessary data
const createBookingObject = (bookingData) => {
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

// Get stylist availability status with reason
const getStylistAvailabilityStatus = (stylist, isAvailable, selectedDate) => {
  if (!stylist?.id || !selectedDate) {
    return { status: 'unknown', reason: 'Invalid parameters', availabilityLevel: 'none' };
  }
  
  // Format date for consistency
  const dateString = selectedDate instanceof Date 
    ? selectedDate.toISOString().split('T')[0] 
    : new Date(selectedDate).toISOString().split('T')[0];
  
  // Check if stylist is on full-day leave
  if (isSalonistOnLeave(stylist.id, selectedDate)) {
    const leaveSchedule = mockLeaveSchedules[stylist.id] || [];
    const fullDayLeave = leaveSchedule.find(leave => 
      leave.type === 'FULL_DAY' && 
      selectedDate >= new Date(leave.startDate) && 
      selectedDate <= new Date(leave.endDate)
    );
    
    if (fullDayLeave) {
      return { 
        status: 'on-leave', 
        reason: fullDayLeave.reason ? `On leave: ${fullDayLeave.reason}` : 'On leave',
        availabilityLevel: 'none'
      };
    }
  }
  
  // Check if stylist has partial-day leave
  const leaveSchedule = mockLeaveSchedules[stylist.id] || [];
  const partialDayLeave = leaveSchedule.find(leave => 
    leave.type === 'PARTIAL_DAY' && 
    leave.date.getDate() === selectedDate.getDate() &&
    leave.date.getMonth() === selectedDate.getMonth() &&
    leave.date.getFullYear() === selectedDate.getFullYear()
  );
  
  // Get the stylist's schedule for this date
  const salonistSchedule = mockSchedules[stylist.id] || {};
  const allTimeSlots = salonistSchedule[dateString] || [];
  
  // Check if the stylist works on this day at all
  if (allTimeSlots.length === 0) {
    return {
      status: 'unavailable',
      reason: 'Not scheduled to work today',
      availabilityLevel: 'none'
    };
  }
  
  // Get booked time slots for this stylist on this date
  const bookedTimeSlots = getBookedTimeSlotsForSalonist(stylist.id, selectedDate);
  
  // Filter available time slots
  const availableTimeSlots = allTimeSlots.filter(timeSlot => 
    !isTimeSlotInPast(selectedDate, timeSlot) && 
    !(partialDayLeave && isSalonistOnLeaveForTimeSlot(stylist.id, selectedDate, timeSlot)) &&
    !bookedTimeSlots.includes(timeSlot)
  );
  
  // Calculate availability metrics
  const totalValidSlots = allTimeSlots.filter(timeSlot => !isTimeSlotInPast(selectedDate, timeSlot)).length;
  const percentAvailable = totalValidSlots > 0 ? Math.round((availableTimeSlots.length / totalValidSlots) * 100) : 0;
  const percentBooked = totalValidSlots > 0 ? Math.round((bookedTimeSlots.length / totalValidSlots) * 100) : 0;
  
  // Determine availability level
  let availabilityLevel = 'high';
  if (percentAvailable <= 25) {
    availabilityLevel = 'low';
  } else if (percentAvailable <= 60) {
    availabilityLevel = 'medium';
  }
  
  // Determine status and reason
  if (!isAvailable) {
    if (bookedTimeSlots.length > 0) {
      if (percentBooked >= 90) {
        return { 
          status: 'booked', 
          reason: 'Fully booked',
          availabilityLevel: 'none'
        };
      } else {
        return { 
          status: 'booked', 
          reason: `${bookedTimeSlots.length} slots booked (${percentBooked}% of day)`,
          availabilityLevel: 'low'
        };
      }
    }
    
    if (partialDayLeave) {
      return { 
        status: 'partial-leave', 
        reason: `On leave: ${partialDayLeave.startTime} - ${partialDayLeave.endTime}`,
        availabilityLevel: 'medium'
      };
    }
    
    return { 
      status: 'unavailable', 
      reason: 'Not available today',
      availabilityLevel: 'none'
    };
  }
  
  // For available stylists
  if (partialDayLeave) {
    return { 
      status: 'partial-leave', 
      reason: `Available except ${partialDayLeave.startTime} - ${partialDayLeave.endTime}`,
      availabilityLevel: 'medium',
      availableSlots: availableTimeSlots.length
    };
  }
  
  if (bookedTimeSlots.length > 0) {
    return { 
      status: 'limited', 
      reason: `${availableTimeSlots.length} slots available (${percentAvailable}% of day)`,
      availabilityLevel,
      availableSlots: availableTimeSlots.length
    };
  }
  
  return { 
    status: 'available', 
    reason: `Fully available (${availableTimeSlots.length} slots)`,
    availabilityLevel: 'high',
    availableSlots: availableTimeSlots.length
  };
};

// Create and export the bookingService object with all functions
const bookingService = {
  // Salonist functions
  getSalonists,
  getSalonistById,
  getSalonistsBySalonId,
  getSalonistRatings,
  getSalonistAvailability,
  getAvailableSalonists,
  getAvailableSalonistsForDate,
  getAvailableDatesForSalonist,
  getStylistAvailabilityStatus,
  getUnavailableTimeSlots,
  
  // Booking functions
  validateBookingData,
  calculateTotalDuration,
  calculateTotalPrice,
  checkStylistAvailability,
  createBookingObject,
  
  // Utility functions
  formatDate,
  isSameDay,
  generateTimeSlots,
  isTimeSlotInPast,
  timeToMinutes,
  getCurrentDateTime
};

export default bookingService;
