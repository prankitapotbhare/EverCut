import mockSalonists from '../data/mockSalonists';
import { mockSchedules } from '../data/mockSchedules';
import { mockLeaveSchedules, isSalonistOnLeave, isSalonistOnLeaveForTimeSlot } from '../data/mockLeaveSchedules';
import { isTimeSlotInPast, getSalonistRealTimeAvailability, isSalonistAvailableForDateTime } from './schedulingService';
import { isSalonistBookedForTimeSlot, getBookedTimeSlotsForSalonist } from '../data/mockBookings';

// Filter salonists by service type
export const getSalonistsByServiceType = (serviceType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredSalonists = mockSalonists.filter(salonist => 
        salonist.specialization.includes(serviceType)
      );
      resolve(filteredSalonists);
    }, 300);
  });
};

// Get salonist ratings and reviews
export const getSalonistRatings = (salonistId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const salonist = mockSalonists.find(s => s.id === salonistId);
      if (!salonist) {
        reject(new Error('Salonist not found'));
        return;
      }
      
      // In a real app, this would fetch detailed ratings and reviews from a database
      // For now, just return the summary data we have
      resolve({
        salonistId,
        averageRating: salonist.rating,
        totalReviews: salonist.reviews,
        // Mock some detailed ratings distribution
        ratingDistribution: {
          5: Math.floor(salonist.reviews * 0.7), // 70% 5-star ratings
          4: Math.floor(salonist.reviews * 0.2), // 20% 4-star ratings
          3: Math.floor(salonist.reviews * 0.05), // 5% 3-star ratings
          2: Math.floor(salonist.reviews * 0.03), // 3% 2-star ratings
          1: Math.floor(salonist.reviews * 0.02)  // 2% 1-star ratings
        }
      });
    }, 300);
  });
};

// Helper function to get availability status with reason based on real-time data
// Enhanced to provide more detailed availability information
// Add validation at top of functions
export const getStylistAvailabilityStatus = (stylist, isAvailable, selectedDate) => {
  if (!stylist?.id || !selectedDate) {
    throw new Error('Invalid parameters for availability check');
  }
  // If no date is selected or availableStylists is empty, we can't determine detailed status
  if (!selectedDate) {
    return { status: isAvailable ? 'available' : 'unavailable', reason: '' };
  }
  
  // Format date for consistency
  const dateString = selectedDate instanceof Date 
    ? selectedDate.toISOString().split('T')[0] 
    : new Date(selectedDate).toISOString().split('T')[0];
  
  // 1. Check if stylist is on full-day leave
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
  
  // 2. Check if stylist has partial-day leave
  const leaveSchedule = mockLeaveSchedules[stylist.id] || [];
  const partialDayLeave = leaveSchedule.find(leave => 
    leave.type === 'PARTIAL_DAY' && 
    leave.date.getDate() === selectedDate.getDate() &&
    leave.date.getMonth() === selectedDate.getMonth() &&
    leave.date.getFullYear() === selectedDate.getFullYear()
  );
  
  // 3. Get the stylist's schedule for this date
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
  
  // 4. Get booked time slots for this stylist on this date
  const bookedTimeSlots = getBookedTimeSlotsForSalonist(stylist.id, selectedDate);
  
  // 5. Filter available time slots (not in the past, not on leave, not booked)
  const availableTimeSlots = allTimeSlots.filter(timeSlot => 
    !isTimeSlotInPast(selectedDate, timeSlot) && 
    !(partialDayLeave && isSalonistOnLeaveForTimeSlot(stylist.id, selectedDate, timeSlot)) &&
    !bookedTimeSlots.includes(timeSlot)
  );
  
  // Calculate total valid slots (excluding past slots)
  const totalValidSlots = allTimeSlots.filter(timeSlot => !isTimeSlotInPast(selectedDate, timeSlot)).length;
  
  // Calculate percentage of available slots
  const percentAvailable = totalValidSlots > 0 ? Math.round((availableTimeSlots.length / totalValidSlots) * 100) : 0;
  const percentBooked = totalValidSlots > 0 ? Math.round((bookedTimeSlots.length / totalValidSlots) * 100) : 0;
  
  // Determine availability level based on percentage
  let availabilityLevel = 'high';
  if (percentAvailable <= 25) {
    availabilityLevel = 'low';
  } else if (percentAvailable <= 60) {
    availabilityLevel = 'medium';
  }
  
  // 6. Determine availability status based on filtered slots
  if (!isAvailable) {
    // If they're marked as unavailable by the backend
    if (bookedTimeSlots.length > 0) {
      // If they have bookings, show how many slots are booked
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
    
    // If they have partial day leave
    if (partialDayLeave) {
      return { 
        status: 'partial-leave', 
        reason: `On leave: ${partialDayLeave.startTime} - ${partialDayLeave.endTime}`,
        availabilityLevel: 'medium'
      };
    }
    
    // If they're not available but not on leave or booked, they must be unavailable for other reasons
    return { 
      status: 'unavailable', 
      reason: 'Not available today',
      availabilityLevel: 'none'
    };
  }
  
  // If they're marked as available by the backend
  if (partialDayLeave) {
    return { 
      status: 'partial-leave', 
      reason: `Available except ${partialDayLeave.startTime} - ${partialDayLeave.endTime}`,
      availabilityLevel: 'medium',
      availableSlots: availableTimeSlots.length
    };
  }
  
  if (bookedTimeSlots.length > 0) {
    // Determine status based on booking percentage
    let bookingStatus = 'partially-booked';
    if (percentBooked >= 75) {
      bookingStatus = 'mostly-booked';
      availabilityLevel = 'low';
    }
    
    return { 
      status: bookingStatus, 
      reason: `${bookedTimeSlots.length} slots booked (${percentBooked}% of day)`,
      availabilityLevel,
      availableSlots: availableTimeSlots.length
    };
  }
  
  // Fully available
  return { 
    status: 'available', 
    reason: `${availableTimeSlots.length} slots available`,
    availabilityLevel: 'high',
    availableSlots: availableTimeSlots.length
  };
};

// Get all salonists
export const getSalonists = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSalonists);
    }, 300); // Simulate network delay
  });
};

// Get a specific salonist by ID
export const getSalonistById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const salonist = mockSalonists.find(salonist => salonist.id === id);
      if (salonist) {
        resolve(salonist);
      } else {
        reject(new Error('Salonist not found'));
      }
    }, 300);
  });
};

// Get salonists for a specific salon
// In a real app, this would filter by salon ID from the database
export const getSalonistsBySalonId = (salonId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate filtering salonists by salon ID
      // In a real app, this would be a database query
      // For now, we'll just simulate by assigning salonists to specific salons
      // We'll assume each salonist can work at multiple salons
      const salonAssignments = {
        1: [1, 3, 5], // Salon 1 has salonists 1, 3, 5
        2: [2, 4, 6], // Salon 2 has salonists 2, 4, 6
        3: [1, 2, 3], // Salon 3 has salonists 1, 2, 3
        4: [4, 5, 6], // Salon 4 has salonists 4, 5, 6
        5: [1, 4, 6]  // Salon 5 has salonists 1, 4, 6
      };
      
      // Get the salonist IDs for this salon
      const salonistIds = salonAssignments[salonId] || [];
      
      // Filter the salonists by ID
      const filteredSalonists = mockSalonists.filter(salonist => 
        salonistIds.includes(salonist.id)
      );
      
      resolve(filteredSalonists);
    }, 300);
  });
};

// Get available time slots for a specific salonist on a specific date
export const getSalonistAvailability = (salonistId, date) => {
  const bookedSlots = getBookedTimeSlotsForSalonist(salonistId, date);
  const schedule = mockSchedules[salonistId] || {};
  const dateString = date.toISOString().split('T')[0];
  return schedule[dateString]?.filter(slot => !bookedSlots.includes(slot)) || [];
};

export const getAvailableSalonists = async (date) => {
  return mockSalonists.filter(salonist => {
    const availability = getSalonistAvailability(salonist.id, date);
    return availability.length > 0 && !isSalonistOnLeave(salonist.id, date);
  });
};

// Remove unused imports and implement missing functions
export const getAvailableDatesForSalonist = async (salonistId, startDate, endDate) => {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    if (!isTimeSlotInPast(date, '12:00 AM') && 
        !isSalonistOnLeave(salonistId, date) &&
        getSalonistAvailability(salonistId, new Date(date)).length > 0) {
      dates.push(new Date(date));
    }
  }
  
  return dates;
};

// Get available salonists for a specific date (without time)
export const getAvailableSalonistsForDate = async (date, salonId = null) => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const dateString = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : new Date(date).toISOString().split('T')[0];
      
      const selectedDate = new Date(dateString);
      
      // Start with all salonists or filter by salon if salonId is provided
      let salonistsToCheck = [];
      
      if (salonId) {
        // Get salonists for this salon
        salonistsToCheck = await getSalonistsBySalonId(salonId);
      } else {
        salonistsToCheck = await getSalonists();
      }
      
      // Filter salonists who have availability on this date
      const availableSalonistsData = salonistsToCheck.filter(salonist => {
        // First check if salonist is on full-day leave for this date
        if (isSalonistOnLeave(salonist.id, selectedDate)) {
          const leaveSchedule = mockLeaveSchedules[salonist.id] || [];
          const fullDayLeave = leaveSchedule.find(leave => 
            leave.type === 'FULL_DAY' && 
            selectedDate >= new Date(leave.startDate) && 
            selectedDate <= new Date(leave.endDate)
          );
          
          if (fullDayLeave) {
            return false; // Salonist is on full-day leave, not available
          }
        }
        
        // Get the salonist's schedule
        const salonistSchedule = mockSchedules[salonist.id] || {};
        const availableSlots = salonistSchedule[dateString] || [];
        
        // Get booked time slots for this salonist on this date
        const bookedTimeSlots = getBookedTimeSlotsForSalonist(salonist.id, selectedDate);
        
        // Filter out past time slots, slots when salonist is on partial leave, and booked slots
        const filteredSlots = availableSlots.filter(timeSlot => 
          !isTimeSlotInPast(selectedDate, timeSlot) && 
          !isSalonistOnLeaveForTimeSlot(salonist.id, selectedDate, timeSlot) &&
          !bookedTimeSlots.includes(timeSlot)
        );
        
        return filteredSlots.length > 0; // Salonist is available if they have at least one available slot
      });
      
      resolve(availableSalonistsData);
    }, 300);
  });
};

// Book an appointment with a salonist
// In a real app, this would update a database
// For now, we'll just simulate a successful booking
export const bookSalonistAppointment = (salonistId, date, time, services, salonId, customerInfo) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if salonist exists
      const salonist = mockSalonists.find(s => s.id === salonistId);
      if (!salonist) {
        reject(new Error('Salonist not found'));
        return;
      }

      // Format date to YYYY-MM-DD for lookup
      const dateString = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : new Date(date).toISOString().split('T')[0];
      
      const selectedDate = new Date(dateString);

      // Check if salonist is on leave for this date/time
      if (isSalonistOnLeave(salonistId, selectedDate)) {
        const leaveSchedule = mockLeaveSchedules[salonistId] || [];
        const fullDayLeave = leaveSchedule.find(leave => 
          leave.type === 'FULL_DAY' && 
          selectedDate >= new Date(leave.startDate) && 
          selectedDate <= new Date(leave.endDate)
        );
        
        if (fullDayLeave) {
          reject(new Error('The salonist is on leave for this date'));
          return;
        }
      }
      
      // Check if salonist is on partial-day leave that includes this time slot
      if (isSalonistOnLeaveForTimeSlot(salonistId, selectedDate, time)) {
        reject(new Error('The salonist is on leave during this time slot'));
        return;
      }

      // Get schedule for this salonist
      const salonistSchedule = mockSchedules[salonistId] || {};
      
      // Get available slots for this date
      const availableSlots = salonistSchedule[dateString] || [];
      
      // Check if the requested time slot is available
      if (!availableSlots.includes(time)) {
        reject(new Error('The requested time slot is not available'));
        return;
      }
      
      // Check if the salonist works at this salon
      const salonAssignments = {
        1: [1, 3, 5],
        2: [2, 4, 6],
        3: [1, 2, 3],
        4: [4, 5, 6],
        5: [1, 4, 6]
      };
      
      const salonistIds = salonAssignments[salonId] || [];
      if (!salonistIds.includes(salonistId)) {
        reject(new Error('This salonist does not work at the selected salon'));
        return;
      }
      
      // Check if the salonist can perform all the requested services
      const canPerformAllServices = services.every(service => 
        salonist.specialization.includes(service.type)
      );
      
      if (!canPerformAllServices) {
        reject(new Error('This salonist cannot perform all the requested services'));
        return;
      }

      // In a real app, update the database to mark this slot as booked
      // For now, just simulate a successful booking
      resolve({
        success: true,
        bookingId: Math.floor(Math.random() * 1000000),
        salonist,
        salon: { id: salonId },
        date: dateString,
        time,
        services,
        customer: customerInfo,
        totalAmount: services.reduce((sum, service) => sum + service.price, 0),
        createdAt: new Date().toISOString()
      });
    }, 300);
  });
};