import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';
import { Calendar, Clock, CreditCard, ChevronDown } from 'lucide-react';

const UpcomingSchedule = () => {
  const navigate = useNavigate();
  const { getUpcomingBookings } = useBooking();
  const [showDropdown, setShowDropdown] = useState(false);
  const [upcomingBooking, setUpcomingBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUpcomingBooking = async () => {
      try {
        setLoading(true);
        const bookings = await getUpcomingBookings();
        if (bookings && bookings.length > 0) {
          setUpcomingBooking(bookings[0]);
        } else {
          setUpcomingBooking(null);
        }
      } catch (error) {
        console.error('Error fetching upcoming booking:', error);
        setUpcomingBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingBooking();
  }, [getUpcomingBookings]);

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
                   sm:w-auto mx-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-full transition-all 
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
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ) : !upcomingBooking ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming appointments</p>
                <button 
                  onClick={() => navigate('/salons')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Book an Appointment
                </button>
              </div>
            ) : (
              <>
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
                  <h3 className="text-lg font-semibold text-left">
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
                  <div className="flex items-center">
                    <div className="bg-white p-1.5 rounded-full">
                      <Calendar className="w-4 h-4 text-gray-600" />
                    </div>
                    <span>{upcomingBooking.formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-white p-1.5 rounded-full">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <span>{upcomingBooking.formattedTime}</span>
                  </div>
                  
                  {/* <div className="bg-white p-1.5 rounded-full">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                  </div> */}
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => navigate('/bookings')}
                  className="w-full mt-4 py-2 text-center text-sm text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                >
                  View All Appointments
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSchedule;