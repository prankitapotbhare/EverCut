// Scheduling utilities and mock data for salonist availability
import { mockSchedules } from '../data/mockSchedules';

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
  
  // If the date is in the past, all its time slots are in the past
  if (date.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
    return true;
  }
  
  // If the date is today, check if the time slot is in the past
  if (date.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0)) {
    const [hourStr, minuteStr] = timeSlot.split(':');
    const [minuteWithAmPm, amPm] = minuteStr.split(' ');
    
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteWithAmPm);
    
    // Convert to 24-hour format
    if (amPm === 'PM' && hour < 12) {
      hour += 12;
    } else if (amPm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    // Check if the time slot is in the past
    if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
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