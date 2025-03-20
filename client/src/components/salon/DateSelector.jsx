import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateSelector = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dates, setDates] = useState([]);
  
  // Generate dates when component mounts or month changes
  useEffect(() => {
    generateDates();
  }, [currentMonth]);
  
  // Generate dates for the current month
  const generateDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    const newDates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      // Include all dates in the month, but disable past dates
      const isPastDate = date < new Date(today.setHours(0, 0, 0, 0));
      newDates.push({
        date,
        day: i,
        dayName: date.toLocaleString('default', { weekday: 'short' }).substring(0, 3),
        isSelectable: !isPastDate
      });
    }
    
    setDates(newDates);
  };
  
  // Handle previous month navigation
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  // Handle next month navigation
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  // Check if a date is selected
  const isDateSelected = (date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  // Get month name
  const getMonthName = () => {
    return currentMonth.toLocaleString('default', { month: 'long' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-medium">{getMonthName()}</span>
        <div className="flex space-x-1 bg-gray-100 rounded-lg">
          <button 
            className="p-2 rounded-l-lg hover:bg-gray-200"
            onClick={handlePrevMonth}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            className="p-2 rounded-r-lg hover:bg-gray-200"
            onClick={handleNextMonth}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {dates.map((dateObj, index) => (
          <button
            key={index}
            disabled={!dateObj.isSelectable}
            className={`flex flex-col items-center p-3 rounded-lg min-w-[60px] ${
              isDateSelected(dateObj.date) 
                ? 'bg-blue-600 text-white' 
                : dateObj.isSelectable 
                  ? 'bg-gray-100 hover:bg-gray-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            onClick={() => dateObj.isSelectable && onDateSelect(dateObj.date)}
          >
            <span className="text-xs">{dateObj.dayName}</span>
            <span className="text-lg font-medium">{dateObj.day}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;