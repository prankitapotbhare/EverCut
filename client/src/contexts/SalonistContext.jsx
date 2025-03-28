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
  loading: false,
  error: null,
  fetchAllSalonists: () => {},
  fetchSalonistById: () => {},
  fetchSalonistsBySalonId: () => {},
  fetchSalonistAvailability: () => {},
  fetchAvailableSalonists: () => {},
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache for salonist data to avoid refetching
  const [salonistCache, setSalonistCache] = useState({});
  const [availabilityCache, setAvailabilityCache] = useState({});
  // Add a cache for salon salonists to prevent infinite loops
  const [salonSalonistsCache, setSalonSalonistsCache] = useState({});

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
  const fetchAvailableSalonists = async (date, time) => {
    try {
      setLoading(true);
      const availableSalonistsData = await getAvailableSalonists(date, time);
      setAvailableSalonists(availableSalonistsData);
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

  // Clear all caches
  const clearCaches = () => {
    setSalonistCache({});
    setAvailabilityCache({});
    setSalonSalonistsCache({});
  };

  const value = {
    allSalonists,
    currentSalonist,
    salonSalonists,
    availableSalonists,
    availableTimeSlots,
    loading,
    error,
    fetchAllSalonists,
    fetchSalonistById,
    fetchSalonistsBySalonId,
    fetchSalonistAvailability,
    fetchAvailableSalonists,
    clearCaches
  };

  return (
    <SalonistContext.Provider value={value}>
      {children}
    </SalonistContext.Provider>
  );
};