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
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-6 py-2.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
      >
        <Calendar className="w-5 h-5 text-gray-600" />
        <span>Upcoming Schedule</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            showDropdown ? 'rotate-180' : ''
          }`}
        />
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