import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import BookingSummary from '@/components/salon/BookingSummary';
import StylistSelector from '@/components/salon/StylistSelector';
import DateSelector from '@/components/salon/DateSelector';
import TimeSelector from '@/components/salon/TimeSelector';
import { useSalon } from '@/contexts/SalonContext';

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

  const { fetchSalonById, loading: contextLoading, error: contextError } = useSalon();

  useEffect(() => {
    // Get selected services from location state
    if (location.state?.selectedServices) {
      setSelectedServices(location.state.selectedServices);
    }

    // Fetch salon data
    const fetchSalon = async () => {
      try {
        setLoading(true);
        const salonData = await fetchSalonById(parseInt(id));
        setSalon(salonData);
      } catch (error) {
        console.error('Error fetching salon details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [id, location.state, fetchSalonById]);

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
      <div className="max-w-8xl mx-auto py-6 px-12">
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
          {/* <div className="hidden md:block w-px bg-gray-200 mx-4"></div> */}

          {/* Middle section - Date & Time Selection */}
          <div className="md:w-[40%] mb-6 md:mb-0">
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
            <BookingSummary
              salon={salon}
              selectedServices={selectedServices}
              selectedStylist={selectedStylist}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onPayNow={handlePayNow}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;