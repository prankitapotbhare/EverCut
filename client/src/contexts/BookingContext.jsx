import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useSalon } from './SalonContext';
import { usePayment } from './PaymentContext';
import bookingService from '@/services/bookingService';
import { getAllBookings } from '@/data/mockBookings';

// Create the context
const BookingContext = createContext({
  // Booking state
  selectedServices: [],
  selectedStylist: null,
  selectedDate: null,
  selectedTime: null,
  salon: null,
  salonists: [],
  availableTimeSlots: [],
  availableSalonists: [],
  unavailableTimeSlots: {},
  
  // Loading states
  loading: false,
  loadingData: {
    salon: false,
    salonists: false,
    availability: false,
    availableSalonists: false
  },
  
  // Error state
  error: null,
  
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
  fetchAvailableStylistsForSelectedDate: () => {},
  
  // Utility functions
  calculateTotalDuration: () => {},
  calculateTotalPrice: () => {},
  validateBookingData: () => {},
  createBookingObject: () => {},
  formatDate: () => {},
  
  // Reset function
  resetBookingState: () => {},
  clearCaches: () => {}
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
  const [availableSalonists, setAvailableSalonists] = useState([]);
  const [unavailableTimeSlots, setUnavailableTimeSlots] = useState({});
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState({
    salon: false,
    salonists: false,
    availability: false,
    availableSalonists: false
  });
  const [error, setError] = useState(null);
  
  // Caches to prevent unnecessary refetching
  const [salonCache, setSalonCache] = useState({});
  const [salonistCache, setSalonistCache] = useState({});
  const [availabilityCache, setAvailabilityCache] = useState({});
  const [salonSalonistsCache, setSalonSalonistsCache] = useState({});
  const [salonistsByDateCache, setSalonistsByDateCache] = useState({});
  
  // Get context hooks
  const { fetchSalonById } = useSalon();
  const { resetPaymentState } = usePayment();
  
  // Fetch salon data
  const fetchSalon = useCallback(async (id) => {
    if (!id) return;
    
    try {
      // Check if we already have this salon in cache
      if (salonCache[id]) {
        setSalon(salonCache[id]);
        return salonCache[id];
      }
      
      setLoadingData(prev => ({ ...prev, salon: true }));
      const salonData = await fetchSalonById(id);
      setSalon(salonData);
      
      // Update the cache
      setSalonCache(prev => ({
        ...prev,
        [id]: salonData
      }));
      
      setError(null);
      return salonData;
    } catch (error) {
      console.error('Error fetching salon details:', error);
      setError('Failed to load salon details. Please try again later.');
      throw error;
    } finally {
      setLoadingData(prev => ({ ...prev, salon: false }));
    }
  }, [fetchSalonById, salonCache]);
  
  // Fetch salonists for a salon
  const fetchSalonists = useCallback(async () => {
    if (!salon) return;
    
    try {
      // Check if we already have this salon's salonists in cache
      if (salonSalonistsCache[salon.id]) {
        setSalonists(salonSalonistsCache[salon.id]);
        return salonSalonistsCache[salon.id];
      }
      
      setLoadingData(prev => ({ ...prev, salonists: true }));
      const salonistsData = await bookingService.getSalonistsBySalonId(salon.id);
      setSalonists(salonistsData);
      
      // Update the cache
      setSalonSalonistsCache(prev => ({
        ...prev,
        [salon.id]: salonistsData
      }));
      
      setError(null);
      return salonistsData;
    } catch (error) {
      console.error('Error fetching salonists:', error);
      setError('Failed to load salonists. Please try again later.');
      throw error;
    } finally {
      setLoadingData(prev => ({ ...prev, salonists: false }));
    }
  }, [salon, salonSalonistsCache]);
  
  // Fetch availability for a stylist on a date
  const fetchAvailability = useCallback(async () => {
    if (!selectedStylist || !selectedDate) return [];
    
    try {
      // Format date to YYYY-MM-DD for cache key
      const dateString = selectedDate instanceof Date 
        ? selectedDate.toISOString().split('T')[0] 
        : new Date(selectedDate).toISOString().split('T')[0];
      
      const cacheKey = `${selectedStylist.id}-${dateString}`;
      
      // Check if we already have this availability in cache
      if (availabilityCache[cacheKey]) {
        setAvailableTimeSlots(availabilityCache[cacheKey]);
        
        // Also update unavailable time slots
        const unavailable = bookingService.getUnavailableTimeSlots(
          selectedStylist, 
          selectedDate, 
          availabilityCache[cacheKey]
        );
        setUnavailableTimeSlots(unavailable);
        
        return availabilityCache[cacheKey];
      }
      
      setLoadingData(prev => ({ ...prev, availability: true }));
      const availabilityData = await bookingService.getSalonistAvailability(selectedStylist.id, selectedDate);
      setAvailableTimeSlots(availabilityData);
      
      // Update unavailable time slots
      const unavailable = bookingService.getUnavailableTimeSlots(
        selectedStylist, 
        selectedDate, 
        availabilityData
      );
      setUnavailableTimeSlots(unavailable);
      
      // Update the cache
      setAvailabilityCache(prev => ({
        ...prev,
        [cacheKey]: availabilityData
      }));
      
      return availabilityData;
    } catch (error) {
      console.error('Error fetching availability:', error);
      setError('Failed to load availability. Please try again later.');
      throw error;
    } finally {
      setLoadingData(prev => ({ ...prev, availability: false }));
    }
  }, [selectedStylist, selectedDate]);
  
  // Fetch available stylists for a selected date
  const fetchAvailableStylistsForSelectedDate = useCallback(async () => {
    if (!selectedDate || !salon) return [];
    
    try {
      // Format date to YYYY-MM-DD for cache key
      const dateString = selectedDate instanceof Date 
        ? selectedDate.toISOString().split('T')[0] 
        : new Date(selectedDate).toISOString().split('T')[0];
      
      const cacheKey = `${salon.id}-${dateString}`;
      
      // Check if we already have this date's available stylists in cache
      if (salonistsByDateCache[cacheKey]) {
        setAvailableSalonists(salonistsByDateCache[cacheKey]);
        return salonistsByDateCache[cacheKey];
      }
      
      setLoadingData(prev => ({ ...prev, availableSalonists: true }));
      const availableStylistsData = await bookingService.getAvailableSalonistsForDate(selectedDate, salon.id);
      setAvailableSalonists(availableStylistsData);
      
      // Update the cache
      setSalonistsByDateCache(prev => ({
        ...prev,
        [cacheKey]: availableStylistsData
      }));
      
      // If current selected stylist is not available on this date, reset selection
      if (selectedStylist && !availableStylistsData.some(stylist => stylist.id === selectedStylist.id)) {
        setSelectedStylist(null);
        setSelectedTime(null);
      }
      
      return availableStylistsData;
    } catch (error) {
      console.error('Error fetching available stylists:', error);
      setError('Failed to load available stylists. Please try again later.');
      throw error;
    } finally {
      setLoadingData(prev => ({ ...prev, availableSalonists: false }));
    }
  }, [selectedDate, salon, selectedStylist]);
  
  // Clear all caches
  const clearCaches = useCallback(() => {
    setSalonCache({});
    setSalonistCache({});
    setAvailabilityCache({});
    setSalonSalonistsCache({});
    setSalonistsByDateCache({});
  }, []);
  
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
    setAvailableSalonists([]);
    setUnavailableTimeSlots({});
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
  
  // Utility functions
  const calculateTotalDuration = useCallback((services) => {
    return bookingService.calculateTotalDuration(services || selectedServices);
  }, [selectedServices]);
  
  const calculateTotalPrice = useCallback((services) => {
    return bookingService.calculateTotalPrice(services || selectedServices);
  }, [selectedServices]);
  
  const validateBookingData = useCallback(() => {
    return bookingService.validateBookingData({
      salon,
      services: selectedServices,
      stylist: selectedStylist,
      date: selectedDate,
      time: selectedTime
    });
  }, [salon, selectedServices, selectedStylist, selectedDate, selectedTime]);
  
  const createBookingObject = useCallback(() => {
    return bookingService.createBookingObject({
      salon,
      services: selectedServices,
      stylist: selectedStylist,
      date: selectedDate,
      time: selectedTime
    });
  }, [salon, selectedServices, selectedStylist, selectedDate, selectedTime]);

  const formatDate = useCallback((date, options) => {
    return bookingService.formatDate(date, options);
  }, []);

  // Add getUpcomingBookings method
  const getUpcomingBookings = useCallback(async () => {
    try {
      const allBookings = getAllBookings();
      const now = new Date();
      
      // Filter and sort upcoming bookings
      const upcomingBookings = allBookings
        .filter(booking => {
          const bookingDate = new Date(booking.date);
          const bookingTime = booking.timeSlot.split(' ')[0];
          const [hours, minutes] = bookingTime.split(':');
          let hour = parseInt(hours);
          const minute = parseInt(minutes || 0);
          
          if (booking.timeSlot.includes('PM') && hour < 12) {
            hour += 12;
          } else if (booking.timeSlot.includes('AM') && hour === 12) {
            hour = 0;
          }
          
          bookingDate.setHours(hour, minute, 0, 0);
          return bookingDate > now;
        })
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        })
        .map(booking => ({
          id: booking.id,
          salon: {
            name: 'InStyle Stylizt 4',
            image: 'https://i.imgur.com/jMR0mEO.jpg'
          },
          stylist: {
            name: 'Meera',
            role: 'Barber'
          },
          date: new Date(booking.date),
          time: booking.timeSlot,
          formattedDate: `Monday, April 7`,
          formattedTime: '2:30 PM'
        }));

      return upcomingBookings;
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      return [];
    }
  }, []);

  // Add to the context value
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
    unavailableTimeSlots,
    loading,
    loadingData,
    error,
    
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
    fetchAvailableStylistsForSelectedDate,
    
    // Utility functions
    calculateTotalDuration,
    calculateTotalPrice,
    validateBookingData,
    createBookingObject,
    formatDate,
    getUpcomingBookings,
    
    // Add these utility functions from bookingService
    generateTimeSlots: bookingService.generateTimeSlots,
    getUnavailableTimeSlots: bookingService.getUnavailableTimeSlots,
    isTimeSlotInPast: bookingService.isTimeSlotInPast,
    isSameDay: bookingService.isSameDay,
    getStylistAvailabilityStatus: bookingService.getStylistAvailabilityStatus,
    
    // Reset functions
    resetBookingState,
    clearCaches
  };
  
  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingProvider;