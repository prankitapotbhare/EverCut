# Frontend Modifications for Backend Integration

This document outlines the changes required in the frontend application to integrate with the EverCut backend API. The frontend currently uses mock data for development, which needs to be replaced with actual API calls.

## Overview of Required Changes

The EverCut frontend needs to transition from using mock data files in `/client/src/data/` to making real API calls to the backend. This involves:

1. Replacing mock service implementations with actual API clients
2. Implementing Firebase authentication integration
3. Updating components to work with MongoDB data structures

## Service Layer Modifications

### API Client Implementation

Create a base API client with authentication token handling:

```javascript
// src/services/apiClient.js
import { getAuth } from "firebase/auth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1';

export const apiClient = async (endpoint, options = {}) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  let headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add auth token if user is logged in
  if (user) {
    const token = await user.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // Handle non-200 responses
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
};
```

### Service Implementations

Replace each mock service with API-based implementation:

#### Salon Service

```javascript
// src/services/salonService.js
import { apiClient } from './apiClient';

export const getSalons = async (filters = {}, page = 1, limit = 20) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters
  });
  
  return apiClient(`/salons?${queryParams}`);
};

export const getSalonById = async (salonId) => {
  return apiClient(`/salons/${salonId}`);
};

export const getSalonServices = async (salonId, category) => {
  const params = category ? `?category=${category}` : '';
  return apiClient(`/salons/${salonId}/services${params}`);
};
```

#### Salonist Service

```javascript
// src/services/salonistService.js
import { apiClient } from './apiClient';

export const getSalonistsBySalon = async (salonId, filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  return apiClient(`/salons/${salonId}/salonists?${queryParams}`);
};

export const getSalonistById = async (salonistId) => {
  return apiClient(`/salonists/${salonistId}`);
};

export const getSalonistAvailability = async (salonistId, date, serviceIds = []) => {
  const queryParams = new URLSearchParams({
    date,
    ...(serviceIds.length > 0 && { serviceIds: serviceIds.join(',') })
  });
  
  return apiClient(`/salonists/${salonistId}/availability?${queryParams}`);
};
```

#### Booking Service

```javascript
// src/services/bookingService.js
import { apiClient } from './apiClient';

export const createBooking = async (bookingData) => {
  return apiClient('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
};

export const getUserBookings = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  return apiClient(`/bookings?${queryParams}`);
};

export const getBookingById = async (bookingId) => {
  return apiClient(`/bookings/${bookingId}`);
};

export const updateBookingStatus = async (bookingId, status, reason) => {
  return apiClient(`/bookings/${bookingId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason })
  });
};
```

#### Payment Service

```javascript
// src/services/paymentService.js
import { apiClient } from './apiClient';

export const createPaymentIntent = async (bookingId, paymentMethodId) => {
  return apiClient('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify({
      bookingId,
      paymentMethodId
    })
  });
};

export const confirmPayment = async (paymentIntentId) => {
  return apiClient('/payments/confirm', {
    method: 'POST',
    body: JSON.stringify({
      paymentIntentId
    })
  });
};
```

## Component Updates

### Data Display Components

Update data display components to handle MongoDB data structures:

1. `SalonList.jsx` - Use salon API data with pagination
2. `SalonDetail.jsx` - Fetch salon details and services from API
3. `StylistList.jsx` - Display stylists from API with filtering
4. `BookingForm.jsx` - Submit booking data to API endpoints

## Context Provider Updates

### Auth Context

Implement Firebase Auth integration in the Auth Context:

```javascript
// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  const value = {
    currentUser,
    userProfile,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
```

## API Error Handling

Implement consistent error handling for API requests:

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  // Log error for monitoring
  console.error("API Error:", error);
  
  // Determine user-friendly message
  let userMessage = "Something went wrong. Please try again.";
  
  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 401:
        userMessage = "Please login to continue.";
        break;
      case 403:
        userMessage = "You don't have permission to perform this action.";
        break;
      case 404:
        userMessage = "The requested resource was not found.";
        break;
      default:
        userMessage = error.response.data.error || userMessage;
    }
  }
  
  return {
    message: userMessage,
    originalError: error
  };
};
```

## Environment Configuration

Update environment variables for different environments:

```
# .env.development
REACT_APP_API_BASE_URL=/api/v1
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx
REACT_APP_FIREBASE_PROJECT_ID=xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=xxx
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx
REACT_APP_FIREBASE_APP_ID=xxx
```

## Testing Considerations

1. Update test mocks to match the new API structure
2. Create Firebase Auth mocks for testing authenticated routes
3. Implement test utilities for MongoDB data structures

## Migration Strategy

1. Implement changes in phases, starting with authentication
2. Create API service layer while keeping mock data as fallback
3. Update components one by one to use real API data
4. Update contexts to manage Firebase Auth state
5. Remove mock data files after successful migration 