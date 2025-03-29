import React, { useMemo } from 'react';
import { 
  generateAvailableTimeSlots, 
  getUnavailableTimeSlots, 
  generateTimeSlots,
  getSalonistRealTimeAvailability,
  isTimeSlotInPast,
  isSalonistAvailableForDateTime
} from '@/services/schedulingService';

const TimeSelector = ({ selectedTime, onTimeSelect, availableTimeSlots = [], selectedStylist, selectedDate }) => {
  // Use memoization to prevent unnecessary recalculations
  const defaultTimeSlots = useMemo(() => generateAvailableTimeSlots(), []);
  
  // Get all possible time slots for the day (8 AM to 8 PM)
  const allPossibleTimeSlots = useMemo(() => generateTimeSlots(), []);
  
  // Update the timeSlots memoization logic
  const timeSlots = useMemo(() => {
    // If no stylist or date is selected, return empty array
    if (!selectedStylist || !selectedDate) return [];
    
    // If explicit available time slots are provided, use them
    if (Array.isArray(availableTimeSlots) && availableTimeSlots.length > 0) {
      return availableTimeSlots;
    }
    
    // Otherwise, get real-time availability
    return getSalonistRealTimeAvailability(selectedStylist.id, selectedDate);
  }, [availableTimeSlots, selectedStylist, selectedDate]);
  
  // Update the unavailable slots calculation
  const unavailableSlots = useMemo(() => {
    if (!selectedStylist || !selectedDate) return {};
    
    return getUnavailableTimeSlots(
      selectedStylist,
      selectedDate, 
      timeSlots,
      allPossibleTimeSlots
    );
  }, [selectedStylist, selectedDate, timeSlots, allPossibleTimeSlots]);
  
  // Check if the selected time is still available
  // This handles the case where a time slot becomes unavailable after selection
  useMemo(() => {
    if (selectedTime && !timeSlots.includes(selectedTime)) {
      // If the selected time is no longer available, notify parent component
      onTimeSelect(null);
    }
  }, [selectedTime, timeSlots, onTimeSelect]);
  
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
                  <span className={`absolute bottom-0 left-0 right-0 text-[8px] ${unavailableInfo?.color || 'text-gray-400'}`}>
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