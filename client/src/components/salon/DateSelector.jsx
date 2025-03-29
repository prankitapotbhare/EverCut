import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isTimeSlotInPast } from '@/services/schedulingService';

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
  
  // Generate dates when component mounts, month changes, or available dates change
  useEffect(() => {
    generateMonthDates();
  }, [currentMonth, today, availableDates]);
  
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
  
  // Generate all dates for the current month with real-time availability
  const generateMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dateRange = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      
      // Use isTimeSlotInPast from schedulingService to check if date is in past
      // For date comparison, we'll use midnight as the time
      const isBeforeToday = isTimeSlotInPast(currentDate, '12:00 AM');
      
      // Check if this date is in the availableDates array (from backend)
      const isAvailable = availableDates.length === 0 || 
        availableDates.some(availableDate => isSameDay(availableDate, currentDate));
      
      // Calculate availability level based on how many slots are available
      let availabilityLevel = 'high';
      if (availableDates.length > 0) {
        const matchingDate = availableDates.find(d => isSameDay(d, currentDate));
        if (matchingDate) {
          // In a real implementation, we would get this from the backend
          // For now, we'll use a simple algorithm based on the date
          const dayOfMonth = currentDate.getDate();
          if (dayOfMonth % 3 === 0) availabilityLevel = 'low';
          else if (dayOfMonth % 2 === 0) availabilityLevel = 'medium';
        } else {
          // If the date is not in availableDates, it's not available
          availabilityLevel = 'none';
        }
      }
      
      dateRange.push({
        date: currentDate,
        day: currentDate.getDate(),
        dayName: currentDate.toLocaleString('default', { weekday: 'short' }),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isSelectable: !isBeforeToday && (availableDates.length === 0 || isAvailable),
        isAvailable: isAvailable,
        availabilityLevel: availabilityLevel,
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
                <span 
                  className={`w-2 h-2 rounded-full mt-1 ${dateObj.availabilityLevel === 'high' ? 'bg-green-500' : 
                    dateObj.availabilityLevel === 'medium' ? 'bg-yellow-500' : 'bg-orange-500'}`}
                  title={`${dateObj.availabilityLevel === 'high' ? 'Many slots available' : 
                    dateObj.availabilityLevel === 'medium' ? 'Some slots available' : 'Few slots available'}`}
                ></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateSelector;