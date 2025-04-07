import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';
import { Calendar, Clock, CreditCard, ChevronDown } from 'lucide-react';

const UpcomingSchedule = () => {
  const navigate = useNavigate();
  const { getUpcomingBookings } = useBooking();
  const [showDropdown, setShowDropdown] = useState(false);
  const [upcomingBooking, setUpcomingBooking] = useState({
    salon: {
      name: 'InStyle Stylizt',
      image: 'https://i.imgur.com/jMR0mEO.jpg'
    },
    stylist: {
      name: 'Kiran',
      role: 'Barber'
    },
    formattedDate: 'Monday, 26 May',
    formattedTime: '09:00 - 10:00'
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-full sm:w-auto" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 w-full 
                   sm:w-auto mx-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-full 
                   bg-white text-gray-700 shadow-md hover:shadow-lg transition-all 
                   duration-300 cursor-pointer border-2 border-transparent hover:border-purple-200"
      >
        <>
        <Calendar size={18} className="text-purple-500 flex-shrink-0" />
        <span className="font-medium text-sm sm:text-base truncate flex-grow">Upcoming Schedule</span>
        <ChevronDown 
          size={18}
          className={`text-purple-400 transition-transform duration-300 flex-shrink-0 ${
            showDropdown ? 'rotate-180' : ''
          }`}
        />
        </>
      </button>

      {showDropdown && (
        <div className="absolute z-50 mt-2 right-0 bg-white rounded-2xl shadow-xl w-[380px]">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Upcoming Schedule</h2>
            
            {/* Salon Image */}
            <div className="w-full h-[200px] rounded-xl overflow-hidden mb-4">
              <img 
                src={upcomingBooking.salon.image}
                alt={upcomingBooking.salon.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Salon and Stylist Info */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {upcomingBooking.salon.name}
              </h3>
              
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="font-medium">
                  {upcomingBooking.stylist.name}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {upcomingBooking.stylist.role}
                </span>
              </div>
            </div>
            
            {/* Appointment Details */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1.5 rounded-full">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <span>{upcomingBooking.formattedDate}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="bg-white p-1.5 rounded-full">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <span>{upcomingBooking.formattedTime}</span>
              </div>
              
              <div className="bg-white p-1.5 rounded-full">
                <CreditCard className="w-4 h-4 text-gray-600" />
              </div>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => navigate('/bookings')}
              className="w-full mt-4 py-2 text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              View All Appointments
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSchedule;