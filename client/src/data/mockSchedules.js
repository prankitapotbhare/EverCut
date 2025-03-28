// Mock data for salonist schedules and availability

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

// Generate all possible time slots
const allTimeSlots = generateTimeSlots();

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

// Helper function to generate available time slots for a specific date
const generateAvailableTimeSlots = (date, unavailableSlots = []) => {
  const { now } = getCurrentDateTime();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  // Clone the date to avoid modifying the original
  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);
  
  // If the date is in the past, return empty array
  if (dateToCheck < today) {
    return [];
  }
  
  // Filter out unavailable and past time slots
  return allTimeSlots.filter(timeSlot => {
    // Skip if the slot is in the unavailable list
    if (unavailableSlots.includes(timeSlot)) {
      return false;
    }
    
    // Skip if the slot is in the past (for today)
    if (isTimeSlotInPast(dateToCheck, timeSlot)) {
      return false;
    }
    
    return true;
  });
};

// Generate a 30-day schedule starting from today
const generateSalonistSchedule = (salonistId, unavailableDays = [], bookedSlots = {}) => {
  const { now } = getCurrentDateTime();
  const schedule = {};
  
  // Generate schedule for the next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
    
    // Skip if the day is in the unavailable days list
    if (unavailableDays.includes(dayOfWeek)) {
      schedule[dateString] = [];
      continue;
    }
    
    // Get booked slots for this date if any
    const dateBookedSlots = bookedSlots[dateString] || [];
    
    // Generate available time slots for this date
    schedule[dateString] = generateAvailableTimeSlots(date, dateBookedSlots);
  }
  
  return schedule;
};

// Mock data for salonist schedules
const mockSchedules = {
  // Salonist 1 - Situ (works all days except Sunday, some slots already booked)
  1: generateSalonistSchedule(1, [0], {
    // Some pre-booked slots for specific dates
    [new Date().toISOString().split('T')[0]]: ['10:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'],
    [(new Date(new Date().setDate(new Date().getDate() + 1))).toISOString().split('T')[0]]: ['11:00 AM', '3:30 PM']
  }),
  
  // Salonist 2 - Arman (works all days except Monday and Tuesday)
  2: generateSalonistSchedule(2, [1, 2], {
    // Some pre-booked slots
    [new Date().toISOString().split('T')[0]]: ['9:00 AM', '1:00 PM', '5:30 PM'],
    [(new Date(new Date().setDate(new Date().getDate() + 2))).toISOString().split('T')[0]]: ['2:00 PM', '2:30 PM', '3:00 PM']
  }),
  
  // Salonist 3 - Ram (works all days except Saturday)
  3: generateSalonistSchedule(3, [6], {
    // Some pre-booked slots
    [(new Date(new Date().setDate(new Date().getDate() + 1))).toISOString().split('T')[0]]: ['9:30 AM', '10:00 AM', '4:00 PM']
  }),
  
  // Salonist 4 - Gitu (works all days except Wednesday and Sunday)
  4: generateSalonistSchedule(4, [0, 3], {
    // Some pre-booked slots
    [new Date().toISOString().split('T')[0]]: ['11:30 AM', '12:00 PM', '3:30 PM'],
    [(new Date(new Date().setDate(new Date().getDate() + 3))).toISOString().split('T')[0]]: ['1:30 PM', '2:00 PM']
  }),
  
  // Salonist 5 - Rahul (works all days except Thursday and Friday)
  5: generateSalonistSchedule(5, [4, 5], {
    // Some pre-booked slots
    [(new Date(new Date().setDate(new Date().getDate() + 2))).toISOString().split('T')[0]]: ['10:30 AM', '11:00 AM', '5:00 PM']
  }),
  
  // Salonist 6 - Roman (works all days except Saturday and Sunday)
  6: generateSalonistSchedule(6, [0, 6], {
    // Some pre-booked slots
    [new Date().toISOString().split('T')[0]]: ['9:00 AM', '12:30 PM', '4:00 PM'],
    [(new Date(new Date().setDate(new Date().getDate() + 4))).toISOString().split('T')[0]]: ['2:30 PM', '3:00 PM', '3:30 PM']
  })
};

export { 
  mockSchedules, 
  generateTimeSlots, 
  getCurrentDateTime, 
  isTimeSlotInPast, 
  generateAvailableTimeSlots 
};