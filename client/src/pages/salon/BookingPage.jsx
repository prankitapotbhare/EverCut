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
         {/* Implement booking page components here */}
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;