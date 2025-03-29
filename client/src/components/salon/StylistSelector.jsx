import React from 'react';
import { mockLeaveSchedules, isSalonistOnLeave, isSalonistOnLeaveForTimeSlot } from '../../data/mockLeaveSchedules';
import { getBookedTimeSlotsForSalonist, isSalonistBookedForTimeSlot } from '../../data/mockBookings';
import { mockSchedules } from '../../data/mockSchedules';
import { isTimeSlotInPast } from '../../services/schedulingService';

const StylistSelector = ({ stylists, selectedStylist, onStylistSelect, availableStylists = [], selectedDate }) => {
  // Helper function to get availability status with reason based on real-time data
  const getStylistAvailabilityStatus = (stylist, isAvailable, selectedDate) => {
    // If no date is selected or availableStylists is empty, we can't determine detailed status
    if (!selectedDate || availableStylists.length === 0) {
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
          reason: fullDayLeave.reason ? `On leave: ${fullDayLeave.reason}` : 'On leave' 
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
    
    // 4. Get booked time slots for this stylist on this date
    const bookedTimeSlots = getBookedTimeSlotsForSalonist(stylist.id, selectedDate);
    
    // 5. Filter available time slots (not in the past, not on leave, not booked)
    const availableTimeSlots = allTimeSlots.filter(timeSlot => 
      !isTimeSlotInPast(selectedDate, timeSlot) && 
      !(partialDayLeave && isSalonistOnLeaveForTimeSlot(stylist.id, selectedDate, timeSlot)) &&
      !bookedTimeSlots.includes(timeSlot)
    );
    
    // 6. Determine availability status based on filtered slots
    if (!isAvailable) {
      // If they're marked as unavailable by the backend
      if (bookedTimeSlots.length > 0) {
        // If they have bookings, show how many slots are booked
        const totalSlots = allTimeSlots.filter(timeSlot => !isTimeSlotInPast(selectedDate, timeSlot)).length;
        const percentBooked = Math.round((bookedTimeSlots.length / totalSlots) * 100);
        
        if (percentBooked >= 90) {
          return { 
            status: 'booked', 
            reason: 'Fully booked' 
          };
        } else {
          return { 
            status: 'booked', 
            reason: `${bookedTimeSlots.length} slots booked (${percentBooked}% of day)` 
          };
        }
      }
      
      // If they have partial day leave
      if (partialDayLeave) {
        return { 
          status: 'partial-leave', 
          reason: `On leave: ${partialDayLeave.startTime} - ${partialDayLeave.endTime}` 
        };
      }
      
      // If they're not available but not on leave or booked, they must be unavailable for other reasons
      return { status: 'unavailable', reason: 'Not available today' };
    }
    
    // If they're marked as available by the backend
    if (partialDayLeave) {
      return { 
        status: 'partial-leave', 
        reason: `Available except ${partialDayLeave.startTime} - ${partialDayLeave.endTime}` 
      };
    }
    
    if (bookedTimeSlots.length > 0) {
      const totalSlots = allTimeSlots.filter(timeSlot => !isTimeSlotInPast(selectedDate, timeSlot)).length;
      const percentBooked = Math.round((bookedTimeSlots.length / totalSlots) * 100);
      
      return { 
        status: 'partially-booked', 
        reason: `${bookedTimeSlots.length} slots booked (${percentBooked}% of day)` 
      };
    }
    
    // Fully available
    return { 
      status: 'available', 
      reason: `${availableTimeSlots.length} slots available` 
    };
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Select your Salonist!</h2>
      <p className="text-sm text-gray-600 mb-4">
        {selectedStylist ? 
          `You selected ${selectedStylist.name}` : 
          'Please select a stylist to continue'}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {stylists.map(stylist => {
          // Only consider a stylist available if they're in the availableStylists array
          // If availableStylists is empty, all stylists are considered available
          const isAvailable = availableStylists.length === 0 || availableStylists.some(s => s.id === stylist.id);
          const isSelected = selectedStylist?.id === stylist.id;
          
          // Get detailed availability status
          const { status, reason } = getStylistAvailabilityStatus(stylist, isAvailable, selectedDate);
          
          // Determine styling based on availability status
          let statusColor = '';
          let statusBgColor = '';
          let statusBorder = '';
          let statusText = '';
          
          switch(status) {
            case 'available':
              statusColor = 'text-green-600';
              statusBgColor = 'bg-green-50';
              statusBorder = 'border-green-200';
              statusText = 'Available';
              break;
            case 'on-leave':
              statusColor = 'text-amber-600';
              statusBgColor = 'bg-amber-50';
              statusBorder = 'border-amber-200';
              statusText = 'On Leave';
              break;
            case 'partial-leave':
              statusColor = 'text-blue-600';
              statusBgColor = 'bg-blue-50';
              statusBorder = 'border-blue-200';
              statusText = 'Partially Available';
              break;
            case 'partially-booked':
              statusColor = 'text-purple-600';
              statusBgColor = 'bg-purple-50';
              statusBorder = 'border-purple-200';
              statusText = 'Partially Booked';
              break;
            case 'booked':
              statusColor = 'text-red-600';
              statusBgColor = 'bg-red-50';
              statusBorder = 'border-red-200';
              statusText = 'Fully Booked';
              break;
            default:
              statusColor = 'text-red-600';
              statusBgColor = 'bg-red-50';
              statusBorder = 'border-red-200';
              statusText = 'Unavailable';
          }
          
          return (
            <div 
              key={stylist.id}
              className={`relative bg-gray-100 rounded-lg p-4 flex flex-col items-center ${isAvailable ? 'cursor-pointer hover:bg-gray-200' : 'cursor-not-allowed'} transition-all ${
                isSelected
                  ? 'ring-2 ring-green-500 bg-green-50' 
                  : availableStylists.length > 0
                    ? `${statusBgColor} border ${statusBorder}`
                    : ''
              }`}
              onClick={() => {
                // Only allow selection if stylist is available
                if (isAvailable) {
                  onStylistSelect(stylist);
                }
              }}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full"></div>
              )}
              {availableStylists.length > 0 && isAvailable && !isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full"></div>
              )}
              {availableStylists.length > 0 && !isAvailable && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              <img 
                src={stylist.image} 
                alt={stylist.name}
                className={`w-16 h-16 rounded-full object-cover mb-2 ${
                  availableStylists.length > 0 && !isAvailable
                    ? 'opacity-50 grayscale'
                    : ''
                }`}
              />
              <span className="text-sm font-medium">{stylist.name}</span>
              {availableStylists.length > 0 && (
                <span className={`text-xs ${statusColor} mt-1`}>{statusText}</span>
              )}
              {reason && (
                <span className="text-xs text-gray-500 mt-0.5">{reason}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StylistSelector;