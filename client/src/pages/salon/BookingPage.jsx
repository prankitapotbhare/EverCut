import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import BookingSummary from '@/components/salon/BookingSummary';
import StylistSelector from '@/components/salon/StylistSelector';
import DateSelector from '@/components/salon/DateSelector';
import TimeSelector from '@/components/salon/TimeSelector';
import PaymentModal from '@/components/payment/PaymentModal';
import { useBooking } from '@/contexts/BookingContext';
import { usePayment } from '@/contexts/PaymentContext';
import { BookingPageSkeleton } from '@/components/common/SkeletonLoader';

const BookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Use the booking context instead of local state
  const { 
    selectedServices, setSelectedServices,
    selectedStylist, setSelectedStylist,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    salon, setSalon,
    salonists,
    availableTimeSlots,
    availableSalonists,
    loadingData,
    fetchSalon,
    fetchSalonists,
    fetchAvailability,
    fetchAvailableStylistsForSelectedDate
  } = useBooking();
  
  const { resetPaymentState } = usePayment();
  
  // Track if we're still loading the initial salon data
  const [initialLoading, setInitialLoading] = useState(true);

  // Initialize with salon data and selected services
  useEffect(() => {
    // Get selected services from location state
    if (location.state?.selectedServices) {
      setSelectedServices(location.state.selectedServices);
    }

    // Check if salon data was passed from previous page
    if (location.state?.salonData) {
      setSalon(location.state.salonData);
      setInitialLoading(false); // No need to fetch, we already have the data
    } else {
      // Fetch salon data only if not provided in location state
      fetchSalon(parseInt(id))
        .finally(() => setInitialLoading(false));
    }
  }, [location.state, fetchSalon, id, setSelectedServices, setSalon]);
  
  // Fetch salonists when salon data is available
  useEffect(() => {
    if (salon?.id) {
      fetchSalonists();
    }
  }, [salon?.id, fetchSalonists]);
  
  // Fetch available stylists for the selected date
  useEffect(() => {
    if (salon?.id && selectedDate) {
      fetchAvailableStylistsForSelectedDate();
    }
  }, [salon?.id, selectedDate, fetchAvailableStylistsForSelectedDate]);
  
  // Fetch availability when stylist and date are selected
  useEffect(() => {
    if (selectedStylist && selectedDate) {
      fetchAvailability();
    }
  }, [selectedStylist, selectedDate, fetchAvailability]);
  
  // Track loading state to prevent flickering
  const isLoading = useMemo(() => {
    // Only show loading state for initial salon data fetch
    return initialLoading && !salon;
  }, [initialLoading, salon]);

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
            {salon.address || "Address information not available"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left section - Stylist Selection */}
          <div className="md:w-1/3 pr-0 md:pr-6 mb-6 md:mb-0">
            <StylistSelector 
              stylists={salonists}
              selectedStylist={selectedStylist}
              onStylistSelect={setSelectedStylist}
              availableStylists={availableSalonists}
              selectedDate={selectedDate}
            />
          </div>

          {/* Middle section - Date & Time Selection */}
          <div className="md:w-[40%] mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">Select Date & Time!</h2>
            
            {/* Date Selector */}
            <DateSelector 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
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