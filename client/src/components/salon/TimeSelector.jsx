import React, { useMemo, useEffect } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

const TimeSelector = ({ selectedTime, onTimeSelect, availableTimeSlots = [], selectedStylist, selectedDate }) => {
  const { 
    generateTimeSlots, 
    getUnavailableTimeSlots,
    loadingData
  } = useBooking();
  
  const allPossibleTimeSlots = useMemo(() => generateTimeSlots(), [generateTimeSlots]);

  const timeSlots = useMemo(() => {
    if (!selectedStylist || !selectedDate) return [];

    if (Array.isArray(availableTimeSlots) && availableTimeSlots.length > 0) {
      return availableTimeSlots;
    }
    return [];
  }, [availableTimeSlots, selectedStylist, selectedDate]);

  const unavailableSlots = useMemo(() => {
    if (!selectedStylist || !selectedDate) return {};
    
    return getUnavailableTimeSlots(
      selectedStylist,
      selectedDate, 
      timeSlots,
      allPossibleTimeSlots
    );
  }, [selectedStylist, selectedDate, timeSlots, allPossibleTimeSlots, getUnavailableTimeSlots]);

  // Reset selected time when available time slots change and selected time is not available
  useEffect(() => {
    if (selectedTime && !timeSlots.includes(selectedTime)) {
      onTimeSelect(null);
    }
  }, [selectedTime, timeSlots, onTimeSelect]);
  
  return (
    <div className="border rounded-lg p-4 mt-6">
      <div className="flex items-center mb-3">
        <Clock size={18} className="text-blue-600 mr-2" />
        <h3 className="font-medium">Available Time Slots</h3>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-center">
        {selectedTime ? (
          <>
            <CheckCircle size={16} className="text-green-600 mr-2 flex-shrink-0" />
            <span className="text-sm text-green-700 font-medium">Selected time: {selectedTime}</span>
          </>
        ) : (
          <>
            <AlertCircle size={16} className="text-amber-500 mr-2 flex-shrink-0" />
            <span className="text-sm text-amber-600 font-medium">
              {selectedStylist ? 'Please select a time slot' : 'Select a stylist first'}
            </span>
          </>
        )}
      </div>
      
      {!selectedStylist ? (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
          Please select a stylist first
        </div>
      ) : loadingData.availability ? (
        <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
          <div className="flex justify-center items-center h-16">
            <p className="text-gray-500">Loading available time slots...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {timeSlots.length > 0 ? (
            allPossibleTimeSlots.map((time, index) => {
              const isAvailable = timeSlots.includes(time);
              const unavailableInfo = !isAvailable ? unavailableSlots[time] : null;
              
              return (
                <button
                  key={index}
                  disabled={!isAvailable}
                  className={`py-2 px-1 text-sm rounded-lg transition-all relative group ${
                    time === selectedTime 
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300 transform scale-105' 
                      : isAvailable
                        ? 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => isAvailable && onTimeSelect(time)}
                  title={!isAvailable ? unavailableInfo?.reason : 'Available'}
                >
                  {time}
                  {!isAvailable && unavailableInfo && (
                    <span className={`absolute bottom-0 left-0 right-0 text-[8px] ${unavailableInfo?.color || 'text-gray-400'} truncate px-1`}>
                      {unavailableInfo?.reason}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="col-span-4 sm:col-span-5 text-center py-6 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle size={18} className="text-amber-500 mx-auto mb-2" />
              <p className="text-amber-600 font-medium">No available time slots</p>
              <p className="text-sm text-gray-600 mt-1">
                Please try selecting a different date or stylist
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSelector;