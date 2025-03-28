import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getSalonists, 
  getSalonistById, 
  getSalonistsBySalonId, 
  getSalonistAvailability,
  getAvailableSalonists
} from '@/services/salonistService';

const SalonistContext = createContext({
  allSalonists: [],
  currentSalonist: null,
  salonSalonists: [],
  availableSalonists: [],
  availableTimeSlots: [],
  availableDates: [],
  loading: false,
  error: null,
  fetchAllSalonists: () => {},
  fetchSalonistById: () => {},
  fetchSalonistsBySalonId: () => {},
  fetchSalonistAvailability: () => {},
  fetchAvailableSalonists: () => {},
  fetchAvailableDatesForSalonist: () => {},
  fetchAvailableSalonistsForDate: () => {},
  clearCaches: () => {}
});

export const useSalonist = () => {
  const context = useContext(SalonistContext);
  if (context === undefined) {
    throw new Error('useSalonist must be used within a SalonistProvider');
  }
  return context;
};

export const SalonistProvider = ({ children }) => {
  const [allSalonists, setAllSalonists] = useState([]);
  const [currentSalonist, setCurrentSalonist] = useState(null);
  const [salonSalonists, setSalonSalonists] = useState([]);
  const [availableSalonists, setAvailableSalonists] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache for salonist data to avoid refetching
  const [salonistCache, setSalonistCache] = useState({});
  const [availabilityCache, setAvailabilityCache] = useState({});
  // Add a cache for salon salonists to prevent infinite loops
  const [salonSalonistsCache, setSalonSalonistsCache] = useState({});
  // Add caches for available dates and salonists by date
  const [availableDatesCache, setAvailableDatesCache] = useState({});
  const [salonistsByDateCache, setSalonistsByDateCache] = useState({});

  // Fetch all salonists
  const fetchAllSalonists = async () => {
    try {
      setLoading(true);
      const salonistsData = await getSalonists();
      setAllSalonists(salonistsData);
      setError(null);
      return salonistsData;
    } catch (err) {
      console.error('Error fetching salonists:', err);
      setError('Failed to load salonists. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific salonist by ID
  const fetchSalonistById = async (id) => {
    try {
      // Check if we already have this salonist in cache
      if (salonistCache[id]) {
        setCurrentSalonist(salonistCache[id]);
        return salonistCache[id];
      }

      setLoading(true);
      const salonistData = await getSalonistById(id);
      setCurrentSalonist(salonistData);
      
      // Update the cache
      setSalonistCache(prev => ({
        ...prev,
        [id]: salonistData
      }));
      
      setError(null);
      return salonistData;
    } catch (err) {
      console.error('Error fetching salonist details:', err);
      setError('Failed to load salonist details. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch salonists for a specific salon
  const fetchSalonistsBySalonId = async (salonId) => {
    try {
      // Check if we already have this salon's salonists in cache
      if (salonSalonistsCache[salonId]) {
        setSalonSalonists(salonSalonistsCache[salonId]);
        return salonSalonistsCache[salonId];
      }
      
      setLoading(true);
      const salonistsData = await getSalonistsBySalonId(salonId);
      setSalonSalonists(salonistsData);
      
      // Update the cache
      setSalonSalonistsCache(prev => ({
        ...prev,
        [salonId]: salonistsData
      }));
      
      setError(null);
      return salonistsData;
    } catch (err) {
      console.error('Error fetching salon salonists:', err);
      setError('Failed to load salon salonists. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch available time slots for a specific salonist on a specific date
  const fetchSalonistAvailability = async (salonistId, date) => {
    try {
      // Format date to YYYY-MM-DD for cache key
      const dateString = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : new Date(date).toISOString().split('T')[0];
      
      const cacheKey = `${salonistId}-${dateString}`;
      
      // Check if we already have this availability in cache
      if (availabilityCache[cacheKey]) {
        // Don't update state if we're just returning cached data
        // This prevents unnecessary re-renders
        return availabilityCache[cacheKey];
      }

      setLoading(true);
      const availabilityData = await getSalonistAvailability(salonistId, date);
      setAvailableTimeSlots(availabilityData);
      
      // Update the cache
      setAvailabilityCache(prev => ({
        ...prev,
        [cacheKey]: availabilityData
      }));
      
      setError(null);
      return availabilityData;
    } catch (err) {
      console.error('Error fetching salonist availability:', err);
      setError('Failed to load salonist availability. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available salonists for a specific date and time
  const fetchAvailableSalonists = async (date, time, salonId = null) => {
    try {
      // Create a cache key that includes salon ID if provided
      const dateString = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : new Date(date).toISOString().split('T')[0];
      const cacheKey = `${dateString}-${time}${salonId ? `-${salonId}` : ''}`;
      
      // Check cache first
      if (salonistsByDateCache[cacheKey]) {
        return salonistsByDateCache[cacheKey];
      }
      
      setLoading(true);
      const availableSalonistsData = await getAvailableSalonists(date, time, salonId);
      setAvailableSalonists(availableSalonistsData);
      
      // Update cache
      setSalonistsByDateCache(prev => ({
        ...prev,
        [cacheKey]: availableSalonistsData
      }));
      
      setError(null);
      return availableSalonistsData;
    } catch (err) {
      console.error('Error fetching available salonists:', err);
      setError('Failed to load available salonists. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch available dates for a specific salonist
  const fetchAvailableDatesForSalonist = async (salonistId) => {
    try {
      // Check cache first
      if (availableDatesCache[salonistId]) {
        return availableDatesCache[salonistId];
      }
      
      setLoading(true);
      
      // In a real app, this would be an API call to get available dates
      // For now, we'll simulate by checking the mockSchedules
      const salonistSchedule = mockSchedules[salonistId] || {};
      
      // Get dates with at least one available time slot
      const availableDatesData = Object.entries(salonistSchedule)
        .filter(([date, timeSlots]) => timeSlots.length > 0)
        .map(([date]) => new Date(date));
      
      setAvailableDates(availableDatesData);
      
      // Update cache
      setAvailableDatesCache(prev => ({
        ...prev,
        [salonistId]: availableDatesData
      }));
      
      setError(null);
      return availableDatesData;
    } catch (err) {
      console.error('Error fetching available dates:', err);
      setError('Failed to load available dates. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch available salonists for a specific date (without time)
  const fetchAvailableSalonistsForDate = async (date, salonId = null) => {
    try {
      const dateString = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : new Date(date).toISOString().split('T')[0];
      
      const cacheKey = `${dateString}${salonId ? `-${salonId}` : ''}`;
      
      // Check cache first
      if (salonistsByDateCache[cacheKey]) {
        return salonistsByDateCache[cacheKey];
      }
      
      setLoading(true);
      
      // Start with all salonists or filter by salon if salonId is provided
      let salonistsToCheck = [];
      
      if (salonId) {
        // Get salonists for this salon
        salonistsToCheck = await fetchSalonistsBySalonId(salonId);
      } else {
        salonistsToCheck = await fetchAllSalonists();
      }
      
      // Filter salonists who have availability on this date
      const availableSalonistsData = salonistsToCheck.filter(salonist => {
        const salonistSchedule = mockSchedules[salonist.id] || {};
        const availableSlots = salonistSchedule[dateString] || [];
        return availableSlots.length > 0;
      });
      
      // Update state and cache
      setAvailableSalonists(availableSalonistsData);
      setSalonistsByDateCache(prev => ({
        ...prev,
        [cacheKey]: availableSalonistsData
      }));
      
      setError(null);
      return availableSalonistsData;
    } catch (err) {
      console.error('Error fetching available salonists for date:', err);
      setError('Failed to load available salonists. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear all caches
  const clearCaches = () => {
    setSalonistCache({});
    setAvailabilityCache({});
    setSalonSalonistsCache({});
    setAvailableDatesCache({});
    setSalonistsByDateCache({});
  };

  const value = {
    allSalonists,
    currentSalonist,
    salonSalonists,
    availableSalonists,
    availableTimeSlots,
    availableDates,
    loading,
    error,
    fetchAllSalonists,
    fetchSalonistById,
    fetchSalonistsBySalonId,
    fetchSalonistAvailability,
    fetchAvailableSalonists,
    fetchAvailableDatesForSalonist,
    fetchAvailableSalonistsForDate,
    clearCaches
  };

  return (
    <SalonistContext.Provider value={value}>
      {children}
    </SalonistContext.Provider>
  );
};