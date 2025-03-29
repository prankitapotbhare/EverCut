// Scheduling utilities and mock data for salonist availability
import { mockSchedules } from '../data/mockSchedules';
import { isSalonistBookedForTimeSlot } from '../data/mockBookings';
import { isSalonistOnLeaveForTimeSlot } from '../data/mockLeaveSchedules';

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
// Moved from TimeSelector.jsx to centralize time slot generation logic
export const generateAvailableTimeSlots = (date = new Date()) => {
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
    
    // Otherwise, it's unavailable for other reasons
    unavailableWithReasons[timeSlot] = { reason: 'Unavailable', color: 'text-gray-500' };
  });
  
  return unavailableWithReasons;
};