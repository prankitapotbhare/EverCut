// Mock data for salonist leave schedules

// Leave types
export const LEAVE_TYPES = {
  FULL_DAY: 'FULL_DAY',
  PARTIAL_DAY: 'PARTIAL_DAY'
};

// Mock leave schedules for salonists
// In a real app, this would come from a backend API
export const mockLeaveSchedules = {
  // Salonist ID 1 - Situ
  1: [
    {
      id: 1,
      startDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
      type: LEAVE_TYPES.FULL_DAY,
      reason: 'Vacation'
    },
    {
      id: 2,
      date: new Date(new Date().setDate(new Date().getDate() + 10)), // 10 days from now
      startTime: '10:00 AM',
      endTime: '2:00 PM',
      type: LEAVE_TYPES.PARTIAL_DAY,
      reason: 'Personal appointment'
    }
  ],
  
  // Salonist ID 2 - Arman
  2: [
    {
      id: 3,
      startDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
      endDate: new Date(new Date().setDate(new Date().getDate() + 4)), // 4 days from now
      type: LEAVE_TYPES.FULL_DAY,
      reason: 'Family event'
    }
  ],
  
  // Salonist ID 3 - Ram
  3: [
    {
      id: 4,
      date: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
      startTime: '2:00 PM',
      endTime: '6:00 PM',
      type: LEAVE_TYPES.PARTIAL_DAY,
      reason: 'Training session'
    }
  ],
  
  // Salonist ID 4 - Gitu
  4: [
    {
      id: 5,
      startDate: new Date(new Date().setDate(new Date().getDate() + 8)), // 8 days from now
      endDate: new Date(new Date().setDate(new Date().getDate() + 12)), // 12 days from now
      type: LEAVE_TYPES.FULL_DAY,
      reason: 'Vacation'
    }
  ],
  
  // Salonist ID 5 - Rahul
  5: [
    {
      id: 6,
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
      startTime: '9:00 AM',
      endTime: '11:00 AM',
      type: LEAVE_TYPES.PARTIAL_DAY,
      reason: 'Doctor appointment'
    }
  ],
  
  // Salonist ID 6 - Roman
  6: [
    {
      id: 7,
      startDate: new Date(new Date().setDate(new Date().getDate() + 15)), // 15 days from now
      endDate: new Date(new Date().setDate(new Date().getDate() + 20)), // 20 days from now
      type: LEAVE_TYPES.FULL_DAY,
      reason: 'Vacation'
    }
  ]
};

// Helper function to check if a salonist is on leave for a specific date
export const isSalonistOnLeave = (salonistId, date) => {
  const leaveSchedule = mockLeaveSchedules[salonistId] || [];
  const checkDate = date instanceof Date ? date : new Date(date);
  
  // Check if the salonist has any leave that includes this date
  return leaveSchedule.some(leave => {
    if (leave.type === LEAVE_TYPES.FULL_DAY) {
      // For full-day leave, check if the date falls within the leave period
      const startDate = new Date(leave.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(leave.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      const dateToCheck = new Date(checkDate);
      dateToCheck.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      
      return dateToCheck >= startDate && dateToCheck <= endDate;
    } else if (leave.type === LEAVE_TYPES.PARTIAL_DAY) {
      // For partial-day leave, check if the date matches the leave date
      const leaveDate = new Date(leave.date);
      
      return (
        checkDate.getDate() === leaveDate.getDate() &&
        checkDate.getMonth() === leaveDate.getMonth() &&
        checkDate.getFullYear() === leaveDate.getFullYear()
      );
    }
    
    return false;
  });
};

// Helper function to check if a salonist is on leave for a specific time slot
export const isSalonistOnLeaveForTimeSlot = (salonistId, date, timeSlot) => {
  const leaveSchedule = mockLeaveSchedules[salonistId] || [];
  const checkDate = date instanceof Date ? date : new Date(date);
  
  // Check if the salonist has any leave that includes this date and time
  return leaveSchedule.some(leave => {
    if (leave.type === LEAVE_TYPES.FULL_DAY) {
      // For full-day leave, check if the date falls within the leave period
      const startDate = new Date(leave.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(leave.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      const dateToCheck = new Date(checkDate);
      dateToCheck.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      
      return dateToCheck >= startDate && dateToCheck <= endDate;
    } else if (leave.type === LEAVE_TYPES.PARTIAL_DAY) {
      // For partial-day leave, check if the date matches and time falls within leave hours
      const leaveDate = new Date(leave.date);
      
      const isDateMatch = (
        checkDate.getDate() === leaveDate.getDate() &&
        checkDate.getMonth() === leaveDate.getMonth() &&
        checkDate.getFullYear() === leaveDate.getFullYear()
      );
      
      if (!isDateMatch) {
        return false;
      }
      
      // Check if the time slot falls within the leave hours
      // Convert time strings to comparable values
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
      
      const slotMinutes = timeToMinutes(timeSlot);
      const leaveStartMinutes = timeToMinutes(leave.startTime);
      const leaveEndMinutes = timeToMinutes(leave.endTime);
      
      return slotMinutes >= leaveStartMinutes && slotMinutes < leaveEndMinutes;
    }
    
    return false;
  });
};