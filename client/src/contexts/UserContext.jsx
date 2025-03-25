import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserProfile,
  updateUserProfile,
  getFavoriteSalons,
  addToFavorites,
  removeFromFavorites,
  getUserSettings,
  updateUserSettings
} from '@/services/userService';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const { currentUser: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [favoriteSalons, setFavoriteSalons] = useState([]);
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile and related data when auth user changes
  useEffect(() => {
    if (authUser) {
      fetchUserData();
    } else {
      // Reset state when user logs out
      setUserProfile(null);
      setFavoriteSalons([]);
      setUserSettings(null);
      setLoading(false);
    }
  }, [authUser]);

  // Fetch all user-related data
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch user profile, favorites, and settings in parallel
      const [profileData, favoritesData, settingsData] = await Promise.all([
        getUserProfile(),
        getFavoriteSalons(),
        getUserSettings()
      ]);
      
      setUserProfile(profileData);
      setFavoriteSalons(favoritesData);
      setUserSettings(settingsData);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await updateUserProfile(updates);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a salon to favorites
  const addSalonToFavorites = async (salon) => {
    try {
      const result = await addToFavorites(salon);
      if (result.success) {
        setFavoriteSalons(prev => [...prev, salon]);
      }
      return result;
    } catch (err) {
      console.error('Error adding salon to favorites:', err);
      throw err;
    }
  };

  // Remove a salon from favorites
  const removeSalonFromFavorites = async (salonId) => {
    try {
      const result = await removeFromFavorites(salonId);
      if (result.success) {
        setFavoriteSalons(prev => prev.filter(salon => salon.id !== salonId));
      }
      return result;
    } catch (err) {
      console.error('Error removing salon from favorites:', err);
      throw err;
    }
  };

  // Update user settings
  const updateSettings = async (updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedSettings = await updateUserSettings(updates);
      setUserSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUserData = () => {
    return fetchUserData();
  };

  const value = {
    userProfile,
    favoriteSalons,
    userSettings,
    loading,
    error,
    updateProfile,
    addSalonToFavorites,
    removeSalonFromFavorites,
    updateSettings,
    refreshUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};