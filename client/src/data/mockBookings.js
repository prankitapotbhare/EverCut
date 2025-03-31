// Mock data for salonist bookings
// In a real app, this would come from a backend API

// Helper function to get current date
const getCurrentDate = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

// Helper function to format date to YYYY-MM-DD
const formatDateToString = (date) => {
  return date.toISOString().split('T')[0];
};

// Generate some mock bookings for the next 30 days
const generateMockBookings = () => {
  const bookings = [];
  const currentDate = getCurrentDate();
  let bookingId = 1;
  
  // Generate bookings for each salonist
  for (let salonistId = 1; salonistId <= 10; salonistId++) {
    // Generate 5-10 bookings per salonist
    const numBookings = 5 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < numBookings; i++) {
      // Random date within next 14 days
      const bookingDate = new Date(currentDate);
      bookingDate.setDate(bookingDate.getDate() + Math.floor(Math.random() * 14));
      
      // Random time slot
      const hour = 8 + Math.floor(Math.random() * 12); // 8 AM to 7 PM
      const minute = Math.random() > 0.5 ? 0 : 30; // Either on the hour or half past
      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const timeSlot = `${displayHour}:${minute === 0 ? '00' : minute} ${isPM ? 'PM' : 'AM'}`;
      
      // Duration (in 30-minute increments)
      const duration = (1 + Math.floor(Math.random() * 4)) * 30; // 30, 60, 90, or 120 minutes
      
      // Create booking object
      bookings.push({
        id: bookingId++,
        salonistId,
        salonId: 1 + Math.floor(Math.random() * 5), // Random salon ID between 1 and 5
        date: formatDateToString(bookingDate),
        timeSlot,
        duration, // in minutes
        status: 'confirmed', // confirmed, cancelled, completed
        customerId: 100 + Math.floor(Math.random() * 900), // Random customer ID
        services: [
          // Random services
          {
            id: 1 + Math.floor(Math.random() * 10),
            name: ['Haircut', 'Hair Coloring', 'Styling', 'Beard Trim', 'Facial', 'Hair Treatment'][Math.floor(Math.random() * 6)],
            price: 20 + Math.floor(Math.random() * 80)
          }
        ],
        createdAt: new Date().toISOString()
      });
    }
  }
  
  return bookings;
};

// Generate mock bookings
const mockBookings = generateMockBookings();

// Helper function to get bookings for a specific salonist
export const getBookingsForSalonist = (salonistId) => {
  return mockBookings.filter(booking => booking.salonistId === salonistId && booking.status === 'confirmed');
};

// Helper function to get bookings for a specific date
export const getBookingsForDate = (date) => {
  const dateString = date instanceof Date ? formatDateToString(date) : formatDateToString(new Date(date));
  return mockBookings.filter(booking => booking.date === dateString && booking.status === 'confirmed');
};

// Helper function to get bookings for a specific salonist on a specific date
export const getBookingsForSalonistOnDate = (salonistId, date) => {
  const dateString = date instanceof Date ? formatDateToString(date) : formatDateToString(new Date(date));
  return mockBookings.filter(booking => 
    booking.salonistId === salonistId && 
    booking.date === dateString && 
    booking.status === 'confirmed'
  );
};

// Helper function to check if a salonist is booked for a specific time slot
export const isSalonistBookedForTimeSlot = (salonistId, date, timeSlot) => {
  const bookings = getBookingsForSalonistOnDate(salonistId, date);
  
  // Convert time strings to comparable values (minutes since midnight)
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
  
  // Check if any booking overlaps with the requested time slot
  return bookings.some(booking => {
    const bookingStartMinutes = timeToMinutes(booking.timeSlot);
    const bookingEndMinutes = bookingStartMinutes + booking.duration;
    
    // Check if the requested time slot falls within the booking's time range
    // Assuming each time slot is 30 minutes
    const slotEndMinutes = slotMinutes + 30;
    
    // Overlap occurs if:
    // 1. The slot starts during the booking, or
    // 2. The slot ends during the booking, or
    // 3. The slot completely contains the booking
    return (slotMinutes >= bookingStartMinutes && slotMinutes < bookingEndMinutes) || 
           (slotEndMinutes > bookingStartMinutes && slotEndMinutes <= bookingEndMinutes) ||
           (slotMinutes <= bookingStartMinutes && slotEndMinutes >= bookingEndMinutes);
  });
};

// Helper function to get all booked time slots for a salonist on a specific date
export const getBookedTimeSlotsForSalonist = (salonistId, date) => {
  const bookings = getBookingsForSalonistOnDate(salonistId, date);
  const bookedSlots = [];
  
  // Generate all possible time slots
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
  
  const allTimeSlots = generateTimeSlots();
  
  // Check each time slot to see if it's booked
  allTimeSlots.forEach(timeSlot => {
    if (isSalonistBookedForTimeSlot(salonistId, date, timeSlot)) {
      bookedSlots.push(timeSlot);
    }
  });
  
  return bookedSlots;
};

// Export the mock bookings for testing
export const getAllBookings = () => mockBookings;