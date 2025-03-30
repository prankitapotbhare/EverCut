import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useSalon } from './SalonContext';
import { useSalonist } from './SalonistContext';
import { usePayment } from './PaymentContext';

// Create the context
const BookingContext = createContext({
  // Booking state
  selectedServices: [],
  selectedStylist: null,
  selectedDate: null,
  selectedTime: null,
  salon: null,
  availableTimeSlots: [],
  
  // Loading states
  loadingData: {
    salon: false,
    salonists: false,
    availability: false,
    availableDates: false,
    availableSalonists: false
  },
  
  // Actions
  setSelectedServices: () => {},
  setSelectedStylist: () => {},
  setSelectedDate: () => {},
  setSelectedTime: () => {},
  setSalon: () => {},
  
  // Fetch functions
  fetchSalon: () => {},
  fetchSalonists: () => {},
  fetchAvailability: () => {},
  fetchAvailableDatesForSelectedStylist: () => {},
  fetchAvailableStylistsForSelectedDate: () => {},
  
  // Reset function
  resetBookingState: () => {}
});

// Custom hook to use the booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// Provider component
export const BookingProvider = ({ children }) => {
  // State for booking data
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [salon, setSalon] = useState(null);
  const [salonists, setSalonists] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  
  // Loading states
  const [loadingData, setLoadingData] = useState({
    salon: false,
    salonists: false,
    availability: false,
    availableDates: false,
    availableSalonists: false
  });
  
  // Get context hooks
  const { fetchSalonById } = useSalon();
  const { 
    fetchSalonistsBySalonId, 
    fetchSalonistAvailability,
    fetchAvailableSalonistsForDate,
    fetchAvailableDatesForSalonist,
    availableSalonists,
    availableDates
  } = useSalonist();
  const { resetPaymentState } = usePayment();
  
  // Fetch salon data
  const fetchSalon = useCallback(async (id) => {
    if (!id) return;
    
    try {
      setLoadingData(prev => ({ ...prev, salon: true }));
      const salonData = await fetchSalonById(parseInt(id));
      setSalon(salonData);
      return salonData;
    } catch (error) {
      console.error('Error fetching salon details:', error);
      throw error;
    } finally {
      setLoadingData(prev => ({ ...prev, salon: false }));
    }
  }, [fetchSalonById]);
  
  // Fetch salonists for a salon
  const fetchSalonists = useCallback(async () => {
    if (!salon) return;
    
    try {
      setLoadingData(prev => ({ ...prev, salonists: true }));
      const salonistsData = await fetchSalonistsBySalonId(salon.id);
      setSalonists(salonistsData);
      return salonistsData;
    } catch (error) {
      console.error('Error fetching salonists:', error);
      throw error;
    } finally {
      setLoadingData(prev => ({ ...prev, salonists: false }));
    }
  }, [salon, fetchSalonistsBySalonId]);
  
  // Fetch availability for a stylist on a date
  const fetchAvailability = useCallback(async () => {
    if (!selectedStylist || !selectedDate) return [];
    
    try {
      setLoadingData(prev => ({ ...prev, availability: true }));
      const availabilityData = await fetchSalonistAvailability(selectedStylist.id, selectedDate);
      setAvailableTimeSlots(availabilityData);
      return availabilityData;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    } finally {
      setLoadingData(prev => ({ ...prev, availability: false }));
    }
  }, [selectedStylist, selectedDate, fetchSalonistAvailability]);
  
  // Fetch available dates for a selected stylist
  const fetchAvailableDatesForSelectedStylist = useCallback(async () => {
    if (!selectedStylist) return [];
    
    try {
      setLoadingData(prev => ({ ...prev, availableDates: true }));
      const dates = await fetchAvailableDatesForSalonist(selectedStylist.id);
      return dates;
    } catch (error) {
      console.error('Error fetching available dates:', error);
      throw error;
    } finally {
      setLoadingData(prev => ({ ...prev, availableDates: false }));
    }
  }, [selectedStylist, fetchAvailableDatesForSalonist]);
  
  // Fetch available stylists for a selected date
  const fetchAvailableStylistsForSelectedDate = useCallback(async () => {
    if (!selectedDate || !salon) return [];
    
    try {
      setLoadingData(prev => ({ ...prev, availableSalonists: true }));
      const availableStylistsData = await fetchAvailableSalonistsForDate(selectedDate, salon.id);
      
      // If current selected stylist is not available on this date, reset selection
      if (selectedStylist && !availableStylistsData.some(stylist => stylist.id === selectedStylist.id)) {
        setSelectedStylist(null);
        setSelectedTime(null);
      }
      
      return availableStylistsData;
    } catch (error) {
      console.error('Error fetching available stylists:', error);
      throw error;
    } finally {
      setLoadingData(prev => ({ ...prev, availableSalonists: false }));
    }
  }, [selectedDate, salon, selectedStylist, fetchAvailableSalonistsForDate]);
  
  // When stylist changes, fetch their available dates
  useEffect(() => {
    if (selectedStylist) {
      fetchAvailableDatesForSelectedStylist();
    }
  }, [selectedStylist, fetchAvailableDatesForSelectedStylist]);
  
  // When date changes, fetch available stylists for that date
  useEffect(() => {
    if (selectedDate && salon) {
      fetchAvailableStylistsForSelectedDate();
    }
  }, [selectedDate, salon, fetchAvailableStylistsForSelectedDate]);
  
  // When both stylist and date change, fetch availability
  useEffect(() => {
    if (selectedStylist && selectedDate) {
      const timeoutId = setTimeout(() => {
        fetchAvailability();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedStylist, selectedDate, fetchAvailability]);
  
  // Effect to clear selected time if it's no longer available
  useEffect(() => {
    if (selectedTime && availableTimeSlots.length > 0 && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime(null);
    }
  }, [availableTimeSlots, selectedTime]);
  
  // Reset booking state
  const resetBookingState = useCallback(() => {
    setSelectedServices([]);
    setSelectedStylist(null);
    setSelectedDate(new Date());
    setSelectedTime(null);
    setSalon(null);
    setSalonists([]);
    setAvailableTimeSlots([]);
    resetPaymentState();
  }, [resetPaymentState]);
  
  // Handle stylist selection
  const handleStylistSelect = useCallback((stylist) => {
    // If selecting the same stylist, do nothing
    if (selectedStylist?.id === stylist.id) return;
    
    setSelectedStylist(stylist);
    // Reset selected time when stylist changes
    setSelectedTime(null);
  }, [selectedStylist]);
  
  // Handle date selection
  const handleDateSelect = useCallback((date) => {
    // If selecting the same date, do nothing
    if (selectedDate && date.getTime() === selectedDate.getTime()) return;
    
    setSelectedDate(date);
    // Reset selected time when date changes
    setSelectedTime(null);
  }, [selectedDate]);
  
  // Context value
  const value = {
    // State
    selectedServices,
    selectedStylist,
    selectedDate,
    selectedTime,
    salon,
    salonists,
    availableTimeSlots,
    availableSalonists,
    availableDates,
    loadingData,
    
    // Setters
    setSelectedServices,
    setSelectedStylist: handleStylistSelect,
    setSelectedDate: handleDateSelect,
    setSelectedTime,
    setSalon,
    
    // Fetch functions
    fetchSalon,
    fetchSalonists,
    fetchAvailability,
    fetchAvailableDatesForSelectedStylist,
    fetchAvailableStylistsForSelectedDate,
    
    // Reset function
    resetBookingState
  };
  
  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};