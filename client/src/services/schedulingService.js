// Scheduling utilities and mock data for salonist availability
import { mockSchedules } from '../data/mockSchedules';
import { isSalonistBookedForTimeSlot, getBookedTimeSlotsForSalonist } from '../data/mockBookings';
import { isSalonistOnLeaveForTimeSlot, isSalonistOnLeave } from '../data/mockLeaveSchedules';

// Helper function to convert time string to minutes since midnight
export const timeToMinutes = (timeStr) => {
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
export const getCurrentDateTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  return { now, currentHour, currentMinute };
};

// Helper function to check if a time slot is in the past
export const isTimeSlotInPast = (date, timeSlot) => {
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
export const generateTimeSlots = (startHour = 8, endHour = 20, interval = 30) => {
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

// Generate realistic time slots from 8:00 AM to 8:00 PM, skipping past time slots for today
// This function generates available time slots based on real-time data
export const generateAvailableTimeSlots = (date = new Date(), salonistId = null) => {
  // If salonistId is provided, use the real-time availability function
  if (salonistId) {
    return getSalonistRealTimeAvailability(salonistId, date);
  }
  
  // If no salonistId is provided, generate generic time slots (not salonist-specific)
  const slots = [];
  const startHour = 8; // 8:00 AM
  const endHour = 20; // 8:00 PM
  const { currentHour, currentMinute } = getCurrentDateTime();
  const isToday = new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip time slots in the past for today
      if (isToday && (hour < currentHour || (hour === currentHour && minute <= currentMinute))) {
        continue;
      }
      
      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const displayMinute = minute === 0 ? '00' : minute;
      const timeString = `${displayHour}:${displayMinute} ${isPM ? 'PM' : 'AM'}`;
      
      slots.push(timeString);
    }
  }
  
  return slots;
};

// Get unavailable time slots with reasons
// Moved from TimeSelector.jsx to centralize time slot availability logic
export const getUnavailableTimeSlots = (selectedStylist, selectedDate, availableTimeSlots, allPossibleTimeSlots) => {
  if (!selectedStylist || !selectedDate) return {};
  
  const unavailableWithReasons = {};
  
  // Check each possible time slot
  allPossibleTimeSlots.forEach(timeSlot => {
    // Skip if the slot is available
    if (availableTimeSlots.includes(timeSlot)) return;
    
    // Check if the slot is unavailable due to booking
    if (isSalonistBookedForTimeSlot(selectedStylist.id, selectedDate, timeSlot)) {
      unavailableWithReasons[timeSlot] = { reason: 'Booked', color: 'text-red-500' };
      return;
    }
    
    // Check if the slot is unavailable due to leave
    if (isSalonistOnLeaveForTimeSlot(selectedStylist.id, selectedDate, timeSlot)) {
      unavailableWithReasons[timeSlot] = { reason: 'On leave', color: 'text-amber-500' };
      return;
    }
    
    // Check if the time slot is in the past
    if (isTimeSlotInPast(selectedDate, timeSlot)) {
      unavailableWithReasons[timeSlot] = { reason: 'Past', color: 'text-gray-400' };
      return;
    }
    
    // Otherwise, it's unavailable for other reasons
    unavailableWithReasons[timeSlot] = { reason: 'Unavailable', color: 'text-gray-500' };
  });
  
  return unavailableWithReasons;
};

// Function to determine a salonist's real-time availability for a specific date
// This implementation generates time slots dynamically and filters them based on
// bookings, leaves, and past time slots to ensure accurate availability
export const getSalonistRealTimeAvailability = (salonistId, date) => {
  if (!salonistId || !date) return [];
  
  // Format date to YYYY-MM-DD for lookup
  const dateString = date instanceof Date 
    ? date.toISOString().split('T')[0] 
    : new Date(date).toISOString().split('T')[0];
  
  const selectedDate = new Date(dateString);
  
  // Check if salonist is on full-day leave for this date
  if (isSalonistOnLeave(salonistId, selectedDate)) {
    // If salonist is on full-day leave, they have no available slots
    return [];
  }
  
  // Get schedule for this salonist to check their working days
  const salonistSchedule = mockSchedules[salonistId] || {};
  
  // Check if the salonist works on this day (if the date has an entry in their schedule)
  // If they don't work on this day, return empty array
  if (salonistSchedule[dateString] === undefined || salonistSchedule[dateString].length === 0) {
    return [];
  }
  
  // Generate all possible time slots for the day
  const startHour = 8; // 8:00 AM
  const endHour = 20; // 8:00 PM
  const interval = 30; // 30-minute intervals
  const allPossibleSlots = [];
  const isToday = new Date(selectedDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  const { currentHour, currentMinute } = getCurrentDateTime();
  
  // Generate all possible time slots
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      // Skip time slots in the past for today
      if (isToday && (hour < currentHour || (hour === currentHour && minute <= currentMinute))) {
        continue;
      }
      
      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const displayMinute = minute === 0 ? '00' : minute;
      const timeString = `${displayHour}:${displayMinute} ${isPM ? 'PM' : 'AM'}`;
      
      allPossibleSlots.push(timeString);
    }
  }
  
  // Get all booked slots for this salonist on this date
  const bookedSlots = getBookedTimeSlotsForSalonist(salonistId, selectedDate);
  
  // Filter out time slots based on real-time availability conditions:
  // 1. Not in the past (already handled during generation)
  // 2. Not on leave (partial-day)
  // 3. Not already booked
  const availableSlots = allPossibleSlots.filter(timeSlot => {
    // Check if the salonist is on partial-day leave for this time slot
    if (isSalonistOnLeaveForTimeSlot(salonistId, selectedDate, timeSlot)) {
      return false;
    }
    
    // Check if the salonist is already booked for this time slot
    if (isSalonistBookedForTimeSlot(salonistId, selectedDate, timeSlot)) {
      return false;
    }
    
    // If we've passed all checks, the time slot is available
    return true;
  });
  
  return availableSlots;
};

// Function to check if a salonist is available for a specific date and time
// This implementation checks all availability conditions: past time, leaves, bookings
// and working schedule to ensure accurate availability status
export const isSalonistAvailableForDateTime = (salonistId, date, time) => {
  if (!salonistId || !date || !time) return false;
  
  // Format date to YYYY-MM-DD for lookup
  const dateString = date instanceof Date 
    ? date.toISOString().split('T')[0] 
    : new Date(date).toISOString().split('T')[0];
  
  const selectedDate = new Date(dateString);
  
  // 1. Check if the time slot is in the past
  if (isTimeSlotInPast(selectedDate, time)) {
    return false;
  }
  
  // 2. Check if salonist is on full-day leave for this date
  if (isSalonistOnLeave(salonistId, selectedDate)) {
    return false;
  }
  
  // 3. Check if salonist is on partial-day leave for this time slot
  if (isSalonistOnLeaveForTimeSlot(salonistId, selectedDate, time)) {
    return false;
  }
  
  // 4. Check if salonist is already booked for this time slot
  if (isSalonistBookedForTimeSlot(salonistId, selectedDate, time)) {
    return false;
  }
  
  // 5. Check if the salonist works on this day
  const salonistSchedule = mockSchedules[salonistId] || {};
  
  // If the salonist doesn't have a schedule for this day, they're not available
  if (salonistSchedule[dateString] === undefined || salonistSchedule[dateString].length === 0) {
    return false;
  }
  
  // If we've passed all checks, the salonist is available for this date and time
  return true;
};