import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';

const DateSelector = ({ selectedDate, onDateSelect }) => {
  const scrollContainerRef = useRef(null);
  const { isSameDay, formatDate } = useBooking();
  
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  
  // Set current month based on the selected date or today's date
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  const [dates, setDates] = useState([]);
  
  // Update current month when selected date changes across months
  useEffect(() => {
    if (selectedDate && 
        (selectedDate.getMonth() !== currentMonth.getMonth() || 
         selectedDate.getFullYear() !== currentMonth.getFullYear())) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [selectedDate, currentMonth]);
  
  useEffect(() => {
    generateMonthDates();
  }, [currentMonth, today]);
  
  useEffect(() => {
    if (scrollContainerRef.current && dates.length > 0) {
      const selectedIndex = dates.findIndex(d => 
        selectedDate && isSameDay(d.date, selectedDate)
      );
      
      const todayIndex = dates.findIndex(d => d.isToday);
      
      // Scroll to selected date, today, or first available date
      const scrollToIndex = selectedIndex >= 0 ? selectedIndex : todayIndex >= 0 ? todayIndex : 0;
      
      if (scrollToIndex >= 0) {
        // Smoother scrolling with a slight delay
        setTimeout(() => {
          const buttonWidth = 68; // Width of each date button + margin
          const scrollPosition = Math.max(0, scrollToIndex * buttonWidth - 100); // Center selected date
          scrollContainerRef.current.scrollTo({ 
            left: scrollPosition, 
            behavior: 'smooth' 
          });
        }, 100);
      }
    }
  }, [dates, selectedDate, isSameDay]);
  
  const generateMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dateRange = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      
      const isBeforeToday = currentDate < today;
      
      const threeMonthsFromToday = new Date(today);
      threeMonthsFromToday.setMonth(today.getMonth() + 3);
      const isWithinRange = currentDate <= threeMonthsFromToday;
      
      const isTodayDate = isSameDay(currentDate, today);
      const isSelectable = (!isBeforeToday || isTodayDate) && isWithinRange;
      
      dateRange.push({
        date: currentDate,
        day: currentDate.getDate(),
        dayName: currentDate.toLocaleString('default', { weekday: 'short' }),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isSelectable: isSelectable,
        isToday: isTodayDate
      });
    }
    
    setDates(dateRange);
  };
  
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    if (prevMonth.getMonth() < today.getMonth() && prevMonth.getFullYear() <= today.getFullYear()) {
      return;
    }
    
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const threeMonthsFromToday = new Date(today);
    threeMonthsFromToday.setMonth(today.getMonth() + 3);
    
    if (nextMonth.getFullYear() > threeMonthsFromToday.getFullYear() || 
        (nextMonth.getFullYear() === threeMonthsFromToday.getFullYear() && 
         nextMonth.getMonth() > threeMonthsFromToday.getMonth())) {
      return;
    }
    
    setCurrentMonth(nextMonth);
  };
  
  const isDateSelected = (date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };
  
  const getMonthName = () => {
    return currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Format the selected date for display
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return '';
    return formatDate(selectedDate, { weekday: 'long', month: 'short', day: 'numeric' });
  }, [selectedDate, formatDate]);

  return (
    <div className="date-selector mb-6">
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
      
      <div className="flex items-center mb-3 bg-blue-50 p-2 rounded-lg">
        <Calendar size={18} className="text-blue-600 mr-2" />
        {selectedDate ? (
          <p className="text-sm text-blue-700 font-medium">
            Selected: {formattedSelectedDate}
          </p>
        ) : (
          <p className="text-sm text-amber-600">
            Please select a date to continue
          </p>
        )}
      </div>
      
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-1"
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
                    : dateObj.isSelectable 
                      ? 'bg-green-50 hover:bg-green-100 border border-green-200' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => dateObj.isSelectable && onDateSelect(dateObj.date)}
              aria-label={`Select ${dateObj.date.toLocaleDateString()}`}
            >
              <span className="text-xs font-medium">{dateObj.dayName}</span>
              <span className="text-lg font-medium">{dateObj.day}</span>

            </button>
          ))}
        </div>
        
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default DateSelector;