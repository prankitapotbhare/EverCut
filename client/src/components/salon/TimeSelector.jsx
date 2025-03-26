import React from 'react';

const TimeSelector = ({ selectedTime, onTimeSelect }) => {
  // Generate realistic time slots from 8:00 AM to 8:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8:00 AM
    const endHour = 20; // 8:00 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const isPM = hour >= 12;
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinute = minute === 0 ? '00' : minute;
        const timeString = `${displayHour}:${displayMinute} ${isPM ? 'PM' : 'AM'}`;
        
        slots.push(timeString);
      }
    }
    
    return slots;
  };
  
  const timeSlots = generateTimeSlots();

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
        {timeSlots.map((time, index) => (
          <button
            key={index}
            className={`py-2 px-1 text-sm rounded-lg cursor-pointer transition-all ${
              time === selectedTime 
                ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => onTimeSelect(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSelector;