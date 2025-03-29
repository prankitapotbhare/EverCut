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
    availability: false,
    availableDates: false,
    availableSalonists: false
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
    fetchAvailableSalonistsForDate,
    fetchAvailableDatesForSalonist,
    availableSalonists,
    availableDates,
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
  // Using salon?.id instead of the entire salon object to prevent unnecessary re-renders
  useEffect(() => {
    if (salon?.id) {
      fetchSalonists();
    }
  }, [salon?.id, fetchSalonists]);

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
  
  // Fetch available dates for a selected stylist
  const fetchAvailableDatesForSelectedStylist = useCallback(async () => {
    if (!selectedStylist) return;
    
    try {
      setLoadingData(prev => ({ ...prev, availableDates: true }));
      await fetchAvailableDatesForSalonist(selectedStylist.id);
      // Note: We don't need to update state here as it's handled in the context
    } catch (error) {
      console.error('Error fetching available dates:', error);
    } finally {
      setLoadingData(prev => ({ ...prev, availableDates: false }));
    }
  }, [selectedStylist, fetchAvailableDatesForSalonist]);
  
  // Fetch available stylists for a selected date
  const fetchAvailableStylistsForSelectedDate = useCallback(async () => {
    if (!selectedDate || !salon) return;
    
    try {
      setLoadingData(prev => ({ ...prev, availableSalonists: true }));
      const availableStylistsData = await fetchAvailableSalonistsForDate(selectedDate, salon.id);
      
      // If current selected stylist is not available on this date, reset selection
      if (selectedStylist && !availableStylistsData.some(stylist => stylist.id === selectedStylist.id)) {
        setSelectedStylist(null);
        setSelectedTime(null);
      }
    } catch (error) {
      console.error('Error fetching available stylists:', error);
    } finally {
      setLoadingData(prev => ({ ...prev, availableSalonists: false }));
    }
  }, [selectedDate, salon, selectedStylist, fetchAvailableSalonistsForDate]);

  // When stylist changes, fetch their available dates and time slots
  useEffect(() => {
    if (selectedStylist) {
      // Fetch available dates for this stylist
      fetchAvailableDatesForSelectedStylist();
      
      // If date is already selected, fetch availability for that date
      if (selectedDate) {
        // Add a small delay to prevent rapid re-renders
        const timeoutId = setTimeout(() => {
          fetchAvailability();
          // Reset selected time when stylist changes
          setSelectedTime(null);
        }, 300);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [selectedStylist?.id, fetchAvailableDatesForSelectedStylist]);
  
  // Separate effect for date changes to avoid dependency conflicts
  useEffect(() => {
    if (selectedStylist && selectedDate) {
      const timeoutId = setTimeout(() => {
        fetchAvailability();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedDate, selectedStylist?.id, fetchAvailability]);
  
  // When date changes, fetch available stylists for that date
  useEffect(() => {
    if (selectedDate && salon) {
      // Fetch available stylists for this date
      fetchAvailableStylistsForSelectedDate();
      
      // If stylist is already selected, check if they're still available on this date
      // This will be handled by the separate effect for time slot fetching
      if (selectedStylist) {
        // Reset selected time when date changes
        setSelectedTime(null);
      }
    }
  }, [selectedDate?.toISOString?.()?.split('T')[0], salon?.id, fetchAvailableStylistsForSelectedDate]);
  
  // Separate effect to handle time slot availability when both date and stylist are selected
  useEffect(() => {
    if (selectedDate && selectedStylist && salon) {
      // Add a small delay to prevent rapid re-renders
      const timeoutId = setTimeout(() => {
        fetchAvailability();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedDate?.toISOString?.()?.split('T')[0], selectedStylist?.id, salon?.id, fetchAvailability]);
  
  // Effect to clear selected time if it's no longer available
  useEffect(() => {
    if (selectedTime && availableTimeSlots.length > 0 && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime(null);
    }
  }, [availableTimeSlots, selectedTime]);
  
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
    // If selecting the same stylist, do nothing
    if (selectedStylist?.id === stylist.id) return;
    
    setSelectedStylist(stylist);
    // Reset selected time when stylist changes
    setSelectedTime(null);
    
    // The useEffect will handle fetching available dates and time slots
  };

  const handleDateSelect = (date) => {
    // If selecting the same date, do nothing
    if (selectedDate && date.getTime() === selectedDate.getTime()) return;
    
    setSelectedDate(date);
    // Reset selected time when date changes
    setSelectedTime(null);
    
    // The useEffect will handle fetching available stylists and time slots
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
      <div className="max-w-8xl mx-auto py-4 sm:py-6 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{salon.name}</h1>
          <p className="text-sm sm:text-base text-gray-600">
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
              availableStylists={selectedDate ? availableSalonists : []}
              selectedDate={selectedDate}
            />
          </div>

          {/* Middle section - Date & Time Selection */}
          <div className="md:w-[40%] mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">Select Date & Time!</h2>
            
            {/* Date Selector */}
            <DateSelector 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              availableDates={selectedStylist ? availableDates : []}
            />
            
            {/* Time Selector */}
            <TimeSelector 
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              availableTimeSlots={availableTimeSlots}
              selectedStylist={selectedStylist}
              selectedDate={selectedDate}
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