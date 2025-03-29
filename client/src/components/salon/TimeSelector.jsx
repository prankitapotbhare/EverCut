import React, { useMemo } from 'react';
import { generateAvailableTimeSlots, getUnavailableTimeSlots } from '../../services/schedulingService';

const TimeSelector = ({ selectedTime, onTimeSelect, availableTimeSlots = [], selectedStylist, selectedDate }) => {
  // Use memoization to prevent unnecessary recalculations
  const defaultTimeSlots = useMemo(() => generateAvailableTimeSlots(), []);
  
  // Get all possible time slots for the day
  const allPossibleTimeSlots = useMemo(() => generateAvailableTimeSlots(), []);
  
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
    return getUnavailableTimeSlots(selectedStylist, selectedDate, timeSlots, allPossibleTimeSlots);
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