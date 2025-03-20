import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import mockSalons from '@/data/mockSalons';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import BookingSummary from '@/components/salon/BookingSummary';
import StylistSelector from '@/components/salon/StylistSelector';
import DateSelector from '@/components/salon/DateSelector';
import TimeSelector from '@/components/salon/TimeSelector';

// Mock stylists data
const mockStylists = [
  { id: 1, name: 'Situ', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: 2, name: 'Arman', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' },
  { id: 3, name: 'Ram', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: 4, name: 'Gitu', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80' },
  { id: 5, name: 'Rahul', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
  { id: 6, name: 'Roman', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' }
];

const BookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    // Get selected services from location state
    if (location.state?.selectedServices) {
      setSelectedServices(location.state.selectedServices);
    }

    // Fetch salon data
    const fetchSalon = async () => {
      try {
        // Find salon by id from mockSalons
        setTimeout(() => {
          const foundSalon = mockSalons.find(salon => salon.id === parseInt(id));
          setSalon(foundSalon || null);
          setLoading(false);
        }, 500); // Simulate network delay
      } catch (error) {
        console.error('Error fetching salon details:', error);
        setLoading(false);
      }
    };

    fetchSalon();
  }, [id, location.state]);

  const handleStylistSelect = (stylist) => {
    setSelectedStylist(stylist);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handlePayNow = () => {
    // Handle payment logic
    console.log('Processing payment for:', {
      salon,
      services: selectedServices,
      stylist: selectedStylist,
      date: selectedDate,
      time: selectedTime
    });
    
    // Navigate to confirmation page
    // navigate(`/salon/${id}/confirmation`, { 
    //   state: { 
    //     salon, 
    //     services: selectedServices, 
    //     stylist: selectedStylist, 
    //     date: selectedDate, 
    //     time: selectedTime 
    //   } 
    // });
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return `${date.getDate()} ${date.toLocaleString('default', { weekday: 'long' })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading booking page...</div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl mb-4">Salon not found</div>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium"
        >
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">{salon.name}</h1>
          <p className="text-gray-600">
            Closed opens at 11:00 am • Pillar number 106, opposite to corner bar address maker, Bengaluru, Karnataka 560008
          </p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left section - Stylist Selection */}
          <div className="md:w-1/3 pr-0 md:pr-6 mb-6 md:mb-0">
            <StylistSelector 
              stylists={mockStylists}
              selectedStylist={selectedStylist}
              onStylistSelect={handleStylistSelect}
            />
          </div>

          {/* Vertical divider */}
          <div className="hidden md:block w-px bg-gray-200 mx-4"></div>

          {/* Middle section - Date & Time Selection */}
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">Select Date & Time!</h2>
            
            {/* Date Selector */}
            <DateSelector 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
            
            {/* Time Selector */}
            <TimeSelector 
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
            />
          </div>

          {/* Right section - Booking Summary */}
          <div className="md:w-1/3 md:pl-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="mb-4">
                <img 
                  src={salon.image} 
                  alt={salon.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="text-xl font-bold">{salon.name}</h3>
                <p className="text-sm text-gray-600">Closed opens at 11:00 am • Pillar number 106, opposite to corner bar address maker, Bengaluru, Karnataka 560008</p>
              </div>

              {selectedStylist && selectedDate && selectedTime && (
                <div className="mb-3 text-sm">
                  <div className="font-medium">
                    {selectedStylist.name} • {formatDate(selectedDate)} • {selectedTime}
                  </div>
                </div>
              )}

              {selectedServices.map((service, index) => (
                <div key={index} className="py-3">
                  <div className="flex justify-between font-medium">
                    <span>{service.name}</span>
                    <span>{service.price} ₹</span>
                  </div>
                  <div className="text-sm text-gray-600">{service.duration}</div>
                </div>
              ))}

              <div className="border-t border-gray-200 mt-2 pt-3">
                <div className="flex justify-between font-bold mb-4">
                  <span>Total</span>
                  <span>{selectedServices.reduce((sum, service) => sum + service.price, 0)} ₹</span>
                </div>
                <button 
                  onClick={handlePayNow}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600"
                  disabled={!selectedStylist || !selectedDate || !selectedTime}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;