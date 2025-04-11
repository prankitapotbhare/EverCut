const Salonist = require('../models/Salonist');
const Schedule = require('../models/Schedule');
const Booking = require('../models/Booking');
const Leave = require('../models/Leave');
const logger = require('../utils/logger');

/**
 * Generate all possible time slots for a day
 * @param {number} startHour - Start hour (24-hour format)
 * @param {number} endHour - End hour (24-hour format)
 * @param {number} interval - Interval in minutes
 * @returns {Array} Array of time slots
 */
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

/**
 * Normalize time format for consistent comparisons
 * @param {string} timeStr - Time string in any format
 * @returns {string} Normalized time in 24-hour format (HH:MM)
 */
const normalizeTimeFormat = (timeStr) => {
  if (!timeStr) return null;
  
  // Remove all spaces, convert to lowercase
  const normalized = timeStr.trim().replace(/\s+/g, '').toLowerCase();
  
  // Handle time format with AM/PM
  if (normalized.includes('am') || normalized.includes('pm')) {
    const justTime = normalized.replace(/am|pm/g, '');
    let [hour, minute] = justTime.split(':').map(num => parseInt(num, 10));
    
    // Handle 12-hour format conversion
    const isPM = normalized.includes('pm');
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    
    // Return in standardized format HH:MM (24-hour)
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
  
  // Handle time format without AM/PM (already in 24-hour format)
  const [hour, minute] = normalized.split(':').map(num => parseInt(num, 10));
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

/**
 * Convert time string to minutes since midnight
 * @param {string} timeStr - Time string (e.g., "9:30 AM" or "09:30")
 * @returns {number} Minutes since midnight
 */
const timeToMinutes = (timeStr) => {
  // Normalize to 24-hour format first
  const normalizedTime = normalizeTimeFormat(timeStr);
  
  // Split into hours and minutes
  const [hourStr, minuteStr] = normalizedTime.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  
  return hour * 60 + minute;
};

/**
 * Check if a time slot is in the past
 * @param {Date} date - Date to check
 * @param {string} timeSlot - Time slot to check
 * @returns {boolean} True if the time slot is in the past
 */
const isTimeSlotInPast = (date, timeSlot) => {
  const now = new Date();
  const checkDate = new Date(date);
  
  // If the date is in the past, all its time slots are in the past
  if (checkDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
    return true;
  }
  
  // If the date is today, check if the time slot is in the past
  if (new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
    const slotMinutes = timeToMinutes(timeSlot);
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentMinutes = currentHour * 60 + currentMinute;
    
    if (slotMinutes <= currentMinutes) {
      return true;
    }
  }
  
  return false;
};

/**
 * Check if a time slot is within a leave period
 * @param {Object} leave - Leave object
 * @param {Date} date - Date to check
 * @param {string} timeSlot - Time slot to check
 * @returns {boolean} True if the time slot is within the leave period
 */
const isTimeSlotInLeave = (leave, date, timeSlot) => {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  if (leave.type === 'FULL_DAY') {
    const startDate = new Date(leave.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(leave.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    return checkDate >= startDate && checkDate <= endDate;
  } else if (leave.type === 'PARTIAL_DAY') {
    const leaveDate = new Date(leave.date);
    leaveDate.setHours(0, 0, 0, 0);
    
    // Only check time if the date matches
    if (checkDate.getTime() !== leaveDate.getTime()) {
      return false;
    }
    
    const slotMinutes = timeToMinutes(timeSlot);
    const startMinutes = timeToMinutes(leave.startTime);
    const endMinutes = timeToMinutes(leave.endTime);
    
    return slotMinutes >= startMinutes && slotMinutes < endMinutes;
  }
  
  return false;
};

/**
 * Get all available salonists for a specific date
 * @param {string} salonId - Salon ID
 * @param {Date} date - Date to check
 * @returns {Promise<Array>} Array of available salonists
 */
const getAvailableSalonistsForDate = async (salonId, date) => {
  try {
    // Get all active salonists for the salon
    const salonists = await Salonist.find({ 
      salonId, 
      status: 'active' 
    });
    
    if (!salonists.length) {
      return [];
    }
    
    const checkDate = new Date(date);
    const dayOfWeek = checkDate.getDay(); // 0-6 for Sunday-Saturday
    
    // Get available salonists with their availability
    const availableSalonists = await Promise.all(
      salonists.map(async (salonist) => {
        // Check if salonist has leave for this date
        const leave = await Leave.findOne({
          salonistId: salonist._id,
          $or: [
            // Full day leave
            {
              type: 'FULL_DAY',
              startDate: { $lte: checkDate },
              endDate: { $gte: checkDate }
            },
            // Partial day leave with completely booked day
            {
              type: 'PARTIAL_DAY',
              date: {
                $gte: new Date(checkDate).setHours(0, 0, 0, 0),
                $lte: new Date(checkDate).setHours(23, 59, 59, 999)
              },
              // If all time slots are affected, it's effectively a full-day leave
              affectedTimeSlots: { $size: generateTimeSlots().length }
            }
          ]
        });
        
        // If salonist has full-day leave, they're not available
        if (leave && leave.type === 'FULL_DAY') {
          return null;
        }
        
        // Check salonist's regular schedule for this day of the week
        const hasAvailabilityForDay = salonist.availability.some(
          avail => avail.day === dayOfWeek && avail.slots.length > 0
        );
        
        if (!hasAvailabilityForDay) {
          return null;
        }
        
        // Check if there are any time slots available (not booked)
        const formattedDate = checkDate.toISOString().split('T')[0];
        
        // Get bookings for this salonist on this date
        const bookings = await Booking.find({
          salonistId: salonist._id,
          date: {
            $gte: new Date(checkDate).setHours(0, 0, 0, 0),
            $lte: new Date(checkDate).setHours(23, 59, 59, 999)
          },
          status: { $nin: ['cancelled'] }
        });
        
        // If all slots are booked, salonist is not available
        const daySchedule = salonist.availability.find(avail => avail.day === dayOfWeek);
        const allSlots = daySchedule ? daySchedule.slots : [];
        
        // Check if there's at least one available time slot
        const availableTimeSlot = allSlots.some(slot => {
          // Skip slots in the past
          if (isTimeSlotInPast(checkDate, slot)) {
            return false;
          }
          
          // Skip slots during partial leave
          if (leave && leave.type === 'PARTIAL_DAY' && isTimeSlotInLeave(leave, checkDate, slot)) {
            return false;
          }
          
          // Check if slot is booked
          const isBooked = bookings.some(booking => booking.startTime === slot);
          
          return !isBooked;
        });
        
        if (!availableTimeSlot) {
          return null;
        }
        
        // Salonist is available for this date
        return {
          ...salonist.toObject(),
          leave: leave ? {
            type: leave.type,
            reason: leave.reason,
            startTime: leave.type === 'PARTIAL_DAY' ? leave.startTime : null,
            endTime: leave.type === 'PARTIAL_DAY' ? leave.endTime : null
          } : null
        };
      })
    );
    
    // Filter out null values (unavailable salonists)
    return availableSalonists.filter(Boolean);
  } catch (error) {
    logger.error(`Error in getAvailableSalonistsForDate: ${error.message}`);
    throw error;
  }
};

/**
 * Get salonist availability for a specific date
 * @param {string} salonistId - Salonist ID
 * @param {Date} date - Date to check
 * @returns {Promise<Array>} Array of available time slots
 */
const getSalonistAvailabilityForDate = async (salonistId, date) => {
  try {
    const salonist = await Salonist.findById(salonistId);
    if (!salonist) {
      throw new Error('Salonist not found');
    }
    
    const checkDate = new Date(date);
    const dayOfWeek = checkDate.getDay(); // 0-6 for Sunday-Saturday
    
    // Get salonist's regular schedule for this day of the week
    const daySchedule = salonist.availability.find(avail => avail.day === dayOfWeek);
    
    if (!daySchedule || !daySchedule.slots.length) {
      console.log(`No availability for salonist ${salonistId} on day ${dayOfWeek}`);
      return []; // No availability for this day
    }
    
    // Get all time slots for this day
    const allSlots = [...daySchedule.slots];
    console.log(`Found ${allSlots.length} slots in schedule for salonist ${salonistId} on day ${dayOfWeek}:`, allSlots);
    
    // Check for leave
    const leave = await Leave.findOne({
      salonistId,
      $or: [
        // Full day leave
        {
          type: 'FULL_DAY',
          startDate: { $lte: checkDate },
          endDate: { $gte: checkDate }
        },
        // Partial day leave
        {
          type: 'PARTIAL_DAY',
          date: {
            $gte: new Date(checkDate).setHours(0, 0, 0, 0),
            $lte: new Date(checkDate).setHours(23, 59, 59, 999)
          }
        }
      ]
    });
    
    // If full-day leave, no availability
    if (leave && leave.type === 'FULL_DAY') {
      console.log(`Salonist ${salonistId} is on full-day leave for ${checkDate}`);
      return [];
    }
    
    // Get bookings for this salonist on this date
    const bookings = await Booking.find({
      salonistId,
      date: {
        $gte: new Date(checkDate).setHours(0, 0, 0, 0),
        $lte: new Date(checkDate).setHours(23, 59, 59, 999)
      },
      status: { $nin: ['cancelled'] }
    });
    
    console.log(`Found ${bookings.length} existing bookings for salonist ${salonistId} on ${checkDate}:`, 
      bookings.map(b => ({ startTime: b.startTime, endTime: b.endTime })));
    
    // Filter out unavailable time slots
    const availableSlots = allSlots.filter(slot => {
      // Skip slots in the past
      if (isTimeSlotInPast(checkDate, slot)) {
        console.log(`Slot ${slot} is in the past`);
        return false;
      }
      
      // Skip slots during partial leave
      if (leave && leave.type === 'PARTIAL_DAY' && isTimeSlotInLeave(leave, checkDate, slot)) {
        console.log(`Slot ${slot} is during partial leave`);
        return false;
      }
      
      // Check if slot is booked
      const normalizedSlot = normalizeTimeFormat(slot);
      const isBooked = bookings.some(booking => {
        const normalizedBookingTime = normalizeTimeFormat(booking.startTime);
        return normalizedBookingTime === normalizedSlot;
      });
      
      if (isBooked) {
        console.log(`Slot ${slot} is already booked`);
      }
      
      return !isBooked;
    });
    
    console.log(`Available slots for salonist ${salonistId} on ${checkDate}:`, availableSlots);
    return availableSlots;
  } catch (error) {
    logger.error(`Error in getSalonistAvailabilityForDate: ${error.message}`);
    throw error;
  }
};

/**
 * Get salonist availability status with detailed information
 * @param {string} salonistId - Salonist ID
 * @param {Date} date - Date to check
 * @returns {Promise<Object>} Availability status object
 */
const getSalonistAvailabilityStatus = async (salonistId, date) => {
  try {
    const salonist = await Salonist.findById(salonistId);
    if (!salonist) {
      throw new Error('Salonist not found');
    }
    
    const checkDate = new Date(date);
    const dayOfWeek = checkDate.getDay(); // 0-6 for Sunday-Saturday
    
    // Get salonist's regular schedule for this day of the week
    const daySchedule = salonist.availability.find(avail => avail.day === dayOfWeek);
    
    // Check if salonist works on this day
    if (!daySchedule || !daySchedule.slots.length) {
      return {
        status: 'unavailable',
        reason: 'Not scheduled to work today',
        availabilityLevel: 'none'
      };
    }
    
    // Check for leave
    const leave = await Leave.findOne({
      salonistId,
      $or: [
        // Full day leave
        {
          type: 'FULL_DAY',
          startDate: { $lte: checkDate },
          endDate: { $gte: checkDate }
        },
        // Partial day leave
        {
          type: 'PARTIAL_DAY',
          date: {
            $gte: new Date(checkDate).setHours(0, 0, 0, 0),
            $lte: new Date(checkDate).setHours(23, 59, 59, 999)
          }
        }
      ]
    });
    
    // If full-day leave, no availability
    if (leave && leave.type === 'FULL_DAY') {
      return { 
        status: 'on-leave', 
        reason: leave.reason ? `On leave: ${leave.reason}` : 'On leave',
        availabilityLevel: 'none'
      };
    }
    
    // Get all time slots for this day
    const allTimeSlots = [...daySchedule.slots];
    
    // Get available time slots
    const availableSlots = await getSalonistAvailabilityForDate(salonistId, date);
    
    // Calculate total valid slots (not in the past)
    const totalValidSlots = allTimeSlots.filter(slot => !isTimeSlotInPast(checkDate, slot)).length;
    
    // Calculate percentages
    const percentAvailable = totalValidSlots > 0 ? Math.round((availableSlots.length / totalValidSlots) * 100) : 0;
    const percentBooked = totalValidSlots > 0 ? 100 - percentAvailable : 0;
    
    // If partial-day leave
    if (leave && leave.type === 'PARTIAL_DAY') {
      return { 
        status: 'partial-leave', 
        reason: `Available except ${leave.startTime} - ${leave.endTime}`,
        availabilityLevel: 'medium',
        availableSlots: availableSlots.length,
        totalSlots: totalValidSlots
      };
    }
    
    // Determine availability level
    let availabilityLevel = 'high';
    if (percentAvailable <= 25) {
      availabilityLevel = 'low';
    } else if (percentAvailable <= 60) {
      availabilityLevel = 'medium';
    }
    
    // Determine status based on percentage available
    if (percentAvailable === 0) {
      return { 
        status: 'booked', 
        reason: 'Fully booked',
        availabilityLevel: 'none',
        availableSlots: 0,
        totalSlots: totalValidSlots
      };
    } else if (percentAvailable < 25) {
      return { 
        status: 'mostly-booked', 
        reason: `${availableSlots.length} slots available (${percentAvailable}% of day)`,
        availabilityLevel: 'low',
        availableSlots: availableSlots.length,
        totalSlots: totalValidSlots
      };
    } else if (percentAvailable < 50) {
      return { 
        status: 'partially-booked', 
        reason: `${availableSlots.length} slots available (${percentAvailable}% of day)`,
        availabilityLevel: 'medium',
        availableSlots: availableSlots.length,
        totalSlots: totalValidSlots
      };
    } else {
      return { 
        status: 'available', 
        reason: `${availableSlots.length} slots available (${percentAvailable}% of day)`,
        availabilityLevel: 'high',
        availableSlots: availableSlots.length,
        totalSlots: totalValidSlots
      };
    }
  } catch (error) {
    logger.error(`Error in getSalonistAvailabilityStatus: ${error.message}`);
    throw error;
  }
};

module.exports = {
  generateTimeSlots,
  getAvailableSalonistsForDate,
  getSalonistAvailabilityForDate,
  getSalonistAvailabilityStatus,
  isTimeSlotInPast,
  timeToMinutes,
  normalizeTimeFormat
}; 