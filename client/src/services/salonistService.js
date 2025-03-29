import mockSalonists from '../data/mockSalonists';
import { mockSchedules } from '../data/mockSchedules';
import { mockLeaveSchedules, isSalonistOnLeave, isSalonistOnLeaveForTimeSlot } from '../data/mockLeaveSchedules';
import { isTimeSlotInPast } from './schedulingService';
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

      // Get schedule for this salonist
      const salonistSchedule = mockSchedules[salonistId] || {};
      
      // Get available slots for this date
      let availableSlots = salonistSchedule[dateString] || [];
      
      // Filter out past time slots if the date is today
      const selectedDate = new Date(dateString);
      availableSlots = availableSlots.filter(timeSlot => !isTimeSlotInPast(selectedDate, timeSlot));
      
      // Check if salonist is on full-day leave for this date
      if (isSalonistOnLeave(salonistId, selectedDate)) {
        // If salonist is on full-day leave, they have no available slots
        const leaveSchedule = mockLeaveSchedules[salonistId] || [];
        const fullDayLeave = leaveSchedule.find(leave => 
          leave.type === 'FULL_DAY' && 
          selectedDate >= new Date(leave.startDate) && 
          selectedDate <= new Date(leave.endDate)
        );
        
        if (fullDayLeave) {
          resolve([]);
          return;
        }
      }
      
      // Filter out time slots when salonist is on partial-day leave
      availableSlots = availableSlots.filter(timeSlot => 
        !isSalonistOnLeaveForTimeSlot(salonistId, selectedDate, timeSlot)
      );
      
      // Get booked time slots for this salonist on this date
      const bookedTimeSlots = getBookedTimeSlotsForSalonist(salonistId, selectedDate);
      
      // Filter out time slots that are already booked
      availableSlots = availableSlots.filter(timeSlot => 
        !bookedTimeSlots.includes(timeSlot)
      );
      
      resolve(availableSlots);
    }, 300);
  });
};

// Get all available salonists for a specific date and time
export const getAvailableSalonists = (date, time, salonId = null, serviceTypes = []) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Format date to YYYY-MM-DD for lookup
      const dateString = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : new Date(date).toISOString().split('T')[0];
      
      const selectedDate = new Date(dateString);

      // Start with all salonists or filter by salon if salonId is provided
      let salonistsToCheck = mockSalonists;
      
      if (salonId) {
        // Get salonists for this salon (reusing the salon assignments from getSalonistsBySalonId)
        const salonAssignments = {
          1: [1, 3, 5],
          2: [2, 4, 6],
          3: [1, 2, 3],
          4: [4, 5, 6],
          5: [1, 4, 6]
        };
        
        const salonistIds = salonAssignments[salonId] || [];
        salonistsToCheck = mockSalonists.filter(salonist => salonistIds.includes(salonist.id));
      }
      
      // Filter by service types if provided
      if (serviceTypes.length > 0) {
        salonistsToCheck = salonistsToCheck.filter(salonist => {
          // Check if salonist specializes in at least one of the requested service types
          return salonist.specialization.some(specialization => 
            serviceTypes.includes(specialization)
          );
        });
      }

      // Check each salonist's availability
      const availableSalonists = salonistsToCheck.filter(salonist => {
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
        
        // Check if salonist is on partial-day leave that includes this time slot
        if (isSalonistOnLeaveForTimeSlot(salonist.id, selectedDate, time)) {
          return false; // Salonist is on partial-day leave during this time slot
        }
        
        // Check if salonist is already booked for this time slot
        if (isSalonistBookedForTimeSlot(salonist.id, selectedDate, time)) {
          return false; // Salonist is already booked during this time slot
        }
        
        // Check if the time slot is in the salonist's schedule
        const salonistSchedule = mockSchedules[salonist.id] || {};
        const availableSlots = salonistSchedule[dateString] || [];
        
        // Salonist is available if the requested time is in their available slots
        // and they are not on leave or booked during this time
        return availableSlots.includes(time);
      });
      
      resolve(availableSalonists);
    }, 300);
  });
};

// Get available dates for a specific salonist
export const getAvailableDatesForSalonist = (salonistId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get schedule for this salonist
      const salonistSchedule = mockSchedules[salonistId] || {};
      
      // Get dates with at least one available time slot
      const availableDatesData = Object.entries(salonistSchedule)
        .filter(([dateStr, timeSlots]) => {
          if (timeSlots.length === 0) return false;
          
          const date = new Date(dateStr);
          
          // Check if salonist is on full-day leave for this date
          if (isSalonistOnLeave(salonistId, date)) {
            const leaveSchedule = mockLeaveSchedules[salonistId] || [];
            const fullDayLeave = leaveSchedule.find(leave => 
              leave.type === 'FULL_DAY' && 
              date >= new Date(leave.startDate) && 
              date <= new Date(leave.endDate)
            );
            
            if (fullDayLeave) {
              return false; // Salonist is on full-day leave, not available
            }
          }
          
          // Filter out past time slots and slots when salonist is on partial leave
          const filteredSlots = timeSlots.filter(timeSlot => 
            !isTimeSlotInPast(date, timeSlot) && 
            !isSalonistOnLeaveForTimeSlot(salonistId, date, timeSlot)
          );
          
          return filteredSlots.length > 0; // Date is available if there's at least one available slot
        })
        .map(([date]) => new Date(date));
      
      resolve(availableDatesData);
    }, 300);
  });
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