// User service for Firebase Firestore operations
import { auth, db } from '@/firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp 
} from 'firebase/firestore';
import mockSalons from '../data/mockSalons'; // Keep for fallback/demo purposes

// Helper function to convert Firestore timestamp to ISO string
const convertTimestampToString = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// Helper function to format user data from Firestore
const formatUserData = (userData) => {
  if (!userData) return null;
  
  return {
    ...userData,
    createdAt: convertTimestampToString(userData.createdAt),
    lastSeen: convertTimestampToString(userData.lastSeen),
    termsAcceptedAt: convertTimestampToString(userData.termsAcceptedAt)
  };
};

// Mock favorite salons
const mockFavorites = [
  mockSalons[0],
  mockSalons[2],
  mockSalons[5]
].map(salon => ({
  id: salon.id,
  name: salon.name,
  address: salon.address,
  rating: salon.rating,
  reviewCount: salon.reviews,
  imageUrl: salon.image
}));

// Mock user settings
const mockSettings = {
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  privacy: {
    shareLocation: true,
    shareBookingHistory: false
  },
  preferences: {
    language: 'en',
    currency: 'EUR',
    theme: 'light'
  }
};

// Get user profile from Firestore
export const getUserProfile = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('User document not found in Firestore');
    }

    return formatUserData(userSnap.data());
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile in Firestore
export const updateUserProfile = async (updates) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const userRef = doc(db, 'users', currentUser.uid);
    
    // Add lastUpdated timestamp to updates
    const updatedData = {
      ...updates,
      lastUpdated: serverTimestamp()
    };
    
    await updateDoc(userRef, updatedData);
    
    // Get the updated user document
    const updatedUserSnap = await getDoc(userRef);
    return formatUserData(updatedUserSnap.data());
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get user's favorite salons from Firestore
export const getFavoriteSalons = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('User document not found in Firestore');
    }

    const userData = userSnap.data();
    
    // If user has favorites, fetch the salon details
    if (userData.favorites && userData.favorites.length > 0) {
      const salonPromises = userData.favorites.map(async (salonId) => {
        const salonRef = doc(db, 'salons', salonId);
        const salonSnap = await getDoc(salonRef);
        
        if (salonSnap.exists()) {
          const salonData = salonSnap.data();
          return {
            id: salonId,
            name: salonData.name,
            address: salonData.address,
            rating: salonData.rating,
            reviewCount: salonData.reviews,
            imageUrl: salonData.image
          };
        }
        return null;
      });
      
      const salons = await Promise.all(salonPromises);
      return salons.filter(salon => salon !== null);
    }
    
    // If no favorites found, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching favorite salons:', error);
    // Return mock data for demo purposes if Firestore fails
    console.warn('Falling back to mock favorites data');
    return mockFavorites;
  }
};

// Add salon to favorites in Firestore
export const addToFavorites = async (salon) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const userRef = doc(db, 'users', currentUser.uid);
    
    // Add salon ID to user's favorites array
    await updateDoc(userRef, {
      favorites: arrayUnion(salon.id),
      lastUpdated: serverTimestamp()
    });
    
    return { success: true, message: 'Salon added to favorites' };
  } catch (error) {
    console.error('Error adding salon to favorites:', error);
    throw error;
  }
};

// Remove salon from favorites in Firestore
export const removeFromFavorites = async (salonId) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const userRef = doc(db, 'users', currentUser.uid);
    
    // Remove salon ID from user's favorites array
    await updateDoc(userRef, {
      favorites: arrayRemove(salonId),
      lastUpdated: serverTimestamp()
    });
    
    return { success: true, message: 'Salon removed from favorites' };
  } catch (error) {
    console.error('Error removing salon from favorites:', error);
    throw error;
  }
};

// Get user settings from Firestore
export const getUserSettings = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('User document not found in Firestore');
    }

    const userData = userSnap.data();
    
    // If user has settings, return them
    if (userData.settings) {
      return userData.settings;
    }
    
    // If no settings found, create default settings
    const defaultSettings = {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        shareLocation: true,
        shareBookingHistory: false
      },
      preferences: {
        language: 'en',
        currency: 'EUR',
        theme: 'light'
      }
    };
    
    // Save default settings to Firestore
    await updateDoc(userRef, {
      settings: defaultSettings,
      lastUpdated: serverTimestamp()
    });
    
    return defaultSettings;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    // Return mock settings for demo purposes if Firestore fails
    console.warn('Falling back to mock settings data');
    return mockSettings;
  }
};

// Update user settings in Firestore
export const updateUserSettings = async (updates) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('User document not found in Firestore');
    }

    const userData = userSnap.data();
    const currentSettings = userData.settings || {};
    
    // Merge current settings with updates
    const updatedSettings = {
      ...currentSettings,
      ...updates
    };
    
    // Update settings in Firestore
    await updateDoc(userRef, {
      settings: updatedSettings,
      lastUpdated: serverTimestamp()
    });
    
    return updatedSettings;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};