import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import BookingSummary from '@/components/salon/BookingSummary';
import StylistSelector from '@/components/salon/StylistSelector';
import DateSelector from '@/components/salon/DateSelector';
import TimeSelector from '@/components/salon/TimeSelector';
import PaymentModal from '@/components/payment/PaymentModal';
import { useSalon } from '@/contexts/SalonContext';
import { useSalonist } from '@/contexts/SalonistContext';
import { usePayment } from '@/contexts/PaymentContext';
import { BookingPageSkeleton } from '@/components/common/SkeletonLoader';

const BookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState({
    salon: false,
    salonists: false,
    availability: false
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [salonists, setSalonists] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const { fetchSalonById, loading: salonLoading, error: salonError } = useSalon();
  const { 
    fetchSalonistsBySalonId, 
    fetchSalonistAvailability,
    loading: salonistLoading, 
    error: salonistError 
  } = useSalonist();
  const { resetPaymentState } = usePayment();

  // Memoize the fetchSalon function to prevent recreating it on every render
  const fetchSalon = useCallback(async () => {
    try {
      setLoadingData(prev => ({ ...prev, salon: true }));
      const salonData = await fetchSalonById(parseInt(id));
      setSalon(salonData);
    } catch (error) {
      console.error('Error fetching salon details:', error);
    } finally {
      setLoadingData(prev => ({ ...prev, salon: false }));
      setLoading(false);
    }
  }, [id, fetchSalonById]);

  useEffect(() => {
    // Get selected services from location state
    if (location.state?.selectedServices) {
      setSelectedServices(location.state.selectedServices);
    }

    // Check if salon data was passed from previous page
    if (location.state?.salonData) {
      setSalon(location.state.salonData);
      setLoading(false); // No need to fetch, we already have the data
    } else {
      // Fetch salon data only if not provided in location state
      fetchSalon();
    }
  }, [location.state, fetchSalon]);
  
  // Memoize the fetchSalonists function
  const fetchSalonists = useCallback(async () => {
    if (!salon) return;
    
    try {
      setLoadingData(prev => ({ ...prev, salonists: true }));
      const salonistsData = await fetchSalonistsBySalonId(salon.id);
      setSalonists(salonistsData);
    } catch (error) {
      console.error('Error fetching salonists:', error);
    } finally {
      setLoadingData(prev => ({ ...prev, salonists: false }));
    }
  }, [salon, fetchSalonistsBySalonId]);

  // Fetch salonists when salon data is available
  useEffect(() => {
    if (salon) {
      fetchSalonists();
    }
  }, [salon, fetchSalonists]);

  // Memoize the fetchAvailability function
  const fetchAvailability = useCallback(async () => {
    if (!selectedStylist || !selectedDate) return;
    
    try {
      setLoadingData(prev => ({ ...prev, availability: true }));
      const availabilityData = await fetchSalonistAvailability(selectedStylist.id, selectedDate);
      setAvailableTimeSlots(availabilityData);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoadingData(prev => ({ ...prev, availability: false }));
    }
  }, [selectedStylist, selectedDate, fetchSalonistAvailability]);

  // Fetch available time slots when stylist and date are selected
  // Use a debounced effect to prevent rapid re-renders
  useEffect(() => {
    if (selectedStylist && selectedDate) {
      // Add a small delay to prevent rapid re-renders
      const timeoutId = setTimeout(() => {
        fetchAvailability();
      }, 300); // Increased debounce time for better stability
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedStylist?.id, selectedDate?.toISOString?.()?.split('T')[0], fetchAvailability]);
  
  // Track combined loading state to prevent flickering
  // Use useMemo to prevent recalculating this value on every render
  const isLoading = useMemo(() => {
    // Only show loading state for initial salon data fetch
    // Don't trigger loading state for subsequent data fetches
    return loading && !salon;
    // Explicitly NOT using salonLoading or salonistLoading here to prevent flickering
    // These states are tracked separately in loadingData for component-specific loading indicators
  }, [loading, salon]);

  const handleStylistSelect = (stylist) => {
    setSelectedStylist(stylist);
    // Reset selected time when stylist changes
    setSelectedTime(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Reset selected time when date changes
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handlePayNow = () => {
    // Open payment modal
    setShowPaymentModal(true);
  };
  
  // Handle payment modal close
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    // No need to navigate to confirmation page anymore
    // Just reset the payment state when modal is closed
    resetPaymentState();
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return `${date.getDate()} ${date.toLocaleString('default', { weekday: 'long' })}`;
  };

  if (isLoading) {
    return <BookingPageSkeleton />;
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
              stylists={salonists}
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
              availableTimeSlots={availableTimeSlots}
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
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={handlePaymentModalClose}
        bookingDetails={{
          salon,
          services: selectedServices,
          stylist: selectedStylist,
          date: selectedDate,
          time: selectedTime
        }}
      />
    </div>
  );
};

export default BookingPage;