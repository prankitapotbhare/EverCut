import React, { useMemo } from 'react';
import { isSalonistBookedForTimeSlot } from '../../data/mockBookings';
import { isSalonistOnLeaveForTimeSlot } from '../../data/mockLeaveSchedules';

const TimeSelector = ({ selectedTime, onTimeSelect, availableTimeSlots = [], selectedStylist, selectedDate }) => {
  // Generate realistic time slots from 8:00 AM to 8:00 PM if no available slots provided
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8:00 AM
    const endHour = 20; // 8:00 PM
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip time slots in the past for today
        if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
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
  
  // Use memoization to prevent unnecessary recalculations
  const defaultTimeSlots = useMemo(() => generateTimeSlots(), []);
  
  // Get all possible time slots for the day
  const allPossibleTimeSlots = useMemo(() => generateTimeSlots(), []);
  
  // Use available time slots if provided, otherwise generate default slots
  // But only show default slots if no specific availability data is provided
  const timeSlots = useMemo(() => {
    // If we have explicit availability data (even if empty), use it
    if (Array.isArray(availableTimeSlots)) {
      return availableTimeSlots;
    }
    // Otherwise fall back to default slots (when component is first rendered)
    return defaultTimeSlots;
  }, [availableTimeSlots, defaultTimeSlots]);
  
  // Get unavailable time slots with reasons
  const unavailableSlots = useMemo(() => {
    if (!selectedStylist || !selectedDate) return {};
    
    const unavailableWithReasons = {};
    
    // Check each possible time slot
    allPossibleTimeSlots.forEach(timeSlot => {
      // Skip if the slot is available
      if (timeSlots.includes(timeSlot)) return;
      
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
  }, [selectedStylist, selectedDate, timeSlots, allPossibleTimeSlots]);

  return (
    <div className="border rounded-lg p-4 mt-6">
      <div className="mb-3 flex justify-between items-center">
        <h3 className="font-medium">Available Time Slots</h3>
        {selectedTime ? (
          <span className="text-sm text-green-600 font-medium">Selected: {selectedTime}</span>
        ) : (
          <span className="text-sm text-amber-600 font-medium">Please select a time</span>
        )}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {timeSlots.length > 0 ? (
          // Show all possible time slots, but disable unavailable ones
          allPossibleTimeSlots.map((time, index) => {
            const isAvailable = timeSlots.includes(time);
            const unavailableInfo = !isAvailable ? unavailableSlots[time] : null;
            
            return (
              <button
                key={index}
                disabled={!isAvailable}
                className={`py-2 px-1 text-sm rounded-lg transition-all relative group ${
                  time === selectedTime 
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                    : isAvailable
                      ? 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => isAvailable && onTimeSelect(time)}
                title={!isAvailable ? unavailableInfo?.reason : 'Available'}
              >
                {time}
                {!isAvailable && (
                  <span className="absolute bottom-0 left-0 right-0 text-[8px] ${unavailableInfo?.color || 'text-gray-400'}">
                    {unavailableInfo?.reason}
                  </span>
                )}
              </button>
            );
          })
        ) : (
          <div className="col-span-5 text-center py-4 text-gray-500">
            No available time slots for the selected date and stylist.
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSelector;