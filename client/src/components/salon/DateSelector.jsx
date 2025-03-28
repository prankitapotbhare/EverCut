import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateSelector = ({ selectedDate, onDateSelect, availableDates = [] }) => {
  const scrollContainerRef = useRef(null);
  
  // Initialize with today's date
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [dates, setDates] = useState([]);
  
  // Generate dates when component mounts or month changes
  useEffect(() => {
    generateMonthDates();
  }, [currentMonth, today]);
  
  // Scroll to today or selected date when dates change
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedIndex = dates.findIndex(d => 
        selectedDate && isSameDay(d.date, selectedDate)
      );
      
      const todayIndex = dates.findIndex(d => d.isToday);
      
      // Scroll to selected date or today
      const scrollToIndex = selectedIndex >= 0 ? selectedIndex : todayIndex >= 0 ? todayIndex : 0;
      
      if (scrollToIndex >= 0) {
        const buttonWidth = 68; // width + margin (60px + 8px)
        scrollContainerRef.current.scrollLeft = scrollToIndex * buttonWidth;
      }
    }
  }, [dates, selectedDate]);
  
  // Generate all dates for the current month
  const generateMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dateRange = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      
      const isBeforeToday = currentDate < today;
      
      // Check if this date is in the availableDates array
      const isAvailable = availableDates.length === 0 || 
        availableDates.some(availableDate => isSameDay(availableDate, currentDate));
      
      dateRange.push({
        date: currentDate,
        day: currentDate.getDate(),
        dayName: currentDate.toLocaleString('default', { weekday: 'short' }),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isSelectable: !isBeforeToday && (availableDates.length === 0 || isAvailable),
        isAvailable: isAvailable,
        isToday: isSameDay(currentDate, today)
      });
    }
    
    setDates(dateRange);
  };
  
  // Helper function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };
  
  // Navigate to previous month
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    // Don't allow navigating to months before the current month if today is in current month
    if (prevMonth.getMonth() < today.getMonth() && prevMonth.getFullYear() <= today.getFullYear()) {
      // If we're trying to go before the current month and today is in the current month,
      // just stay in the current month
      if (today.getMonth() === new Date().getMonth() && today.getFullYear() === new Date().getFullYear()) {
        return;
      }
    }
    
    setCurrentMonth(prevMonth);
  };
  
  // Navigate to next month
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  // Check if a date is selected
  const isDateSelected = (date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };
  
  // Get month name for display
  const getMonthName = () => {
    return currentMonth.toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="date-selector">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-lg">{getMonthName()}</span>
        <div className="flex space-x-1 bg-gray-100 rounded-lg">
          <button 
            className="p-2 rounded-l-lg hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            className="p-2 rounded-r-lg hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">
        {selectedDate ? 
          `Selected: ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}` : 
          'Please select a date'}
      </p>
      
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dates.map((dateObj, index) => (
            <button
              key={index}
              disabled={!dateObj.isSelectable}
              className={`flex flex-col items-center p-3 rounded-lg min-w-[60px] transition-all cursor-pointer ${
                isDateSelected(dateObj.date) 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : dateObj.isToday
                    ? 'bg-blue-100 hover:bg-blue-200'
                    : dateObj.isSelectable && dateObj.isAvailable
                      ? 'bg-green-50 hover:bg-green-100 border border-green-200' 
                      : dateObj.isSelectable 
                        ? 'bg-gray-100 hover:bg-gray-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => dateObj.isSelectable && onDateSelect(dateObj.date)}
              aria-label={`Select ${dateObj.date.toLocaleDateString()}`}
            >
              <span className="text-xs font-medium">{dateObj.dayName}</span>
              <span className="text-lg font-medium">{dateObj.day}</span>
              {dateObj.isAvailable && availableDates.length > 0 && (
                <span className="w-2 h-2 bg-green-500 rounded-full mt-1"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateSelector;