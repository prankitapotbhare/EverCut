import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSalons, getSalonById, getPopularSalons, getNearestSalons, searchSalons } from '@/services/salonService';

const SalonContext = createContext();

export const useSalon = () => {
  return useContext(SalonContext);
};

export const SalonProvider = ({ children }) => {
  const [allSalons, setAllSalons] = useState([]);
  const [popularSalons, setPopularSalons] = useState([]);
  const [nearestSalons, setNearestSalons] = useState([]);
  const [currentSalon, setCurrentSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all salons on initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const salonsData = await getSalons();
        setAllSalons(salonsData);
        
        // Also fetch popular salons
        const popularData = await getPopularSalons();
        setPopularSalons(popularData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching salon data:', err);
        setError('Failed to load salon data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Add a salon cache to avoid refetching
  const [salonCache, setSalonCache] = useState({});

  // Function to fetch a specific salon by ID
  const fetchSalonById = async (id) => {
    try {
      // Check if we already have this salon in cache
      if (salonCache[id]) {
        setCurrentSalon(salonCache[id]);
        return salonCache[id];
      }

      setLoading(true);
      const salonData = await getSalonById(id);
      setCurrentSalon(salonData);
      
      // Update the cache
      setSalonCache(prev => ({
        ...prev,
        [id]: salonData
      }));
      
      setError(null);
      return salonData;
    } catch (err) {
      console.error('Error fetching salon details:', err);
      setError('Failed to load salon details. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch nearest salons based on user location
  const fetchNearestSalons = async (userLocation) => {
    try {
      setLoading(true);
      const nearestData = await getNearestSalons(userLocation);
      setNearestSalons(nearestData);
      setError(null);
      return nearestData;
    } catch (err) {
      console.error('Error fetching nearest salons:', err);
      setError('Failed to load nearest salons. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to search salons by query
  const searchSalonsByQuery = async (query) => {
    try {
      setLoading(true);
      const results = await searchSalons(query);
      setError(null);
      return results;
    } catch (err) {
      console.error('Error searching salons:', err);
      setError('Failed to search salons. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear current salon data
  const clearCurrentSalon = () => {
    setCurrentSalon(null);
  };

  const value = {
    allSalons,
    popularSalons,
    nearestSalons,
    currentSalon,
    loading,
    error,
    fetchSalonById,
    fetchNearestSalons,
    searchSalonsByQuery,
    clearCurrentSalon
  };

  return (
    <SalonContext.Provider value={value}>
      {children}
    </SalonContext.Provider>
  );
};