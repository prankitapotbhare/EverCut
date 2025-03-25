import React, { useState } from "react";

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"];

const TimeSelector = ({ selectedTime, setSelectedTime }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {timeSlots.map((time, index) => (
        <button
          key={index}
          className={`p-2 rounded-lg border ${
            selectedTime === time ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedTime(time)}
        >
          {time}
        </button>
      ))}
    </div>
  );
};

export default TimeSelector;
