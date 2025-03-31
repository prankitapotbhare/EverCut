import api from './api';

// ===== Salon Services =====
export const salonService = {
  // Get all salons with optional filters
  getAll: async (filters = {}) => {
    const response = await api.get('/salons', { params: filters });
    return response.data.data;
  },
  
  // Get salon by ID
  getById: async (id) => {
    const response = await api.get(`/salons/${id}`);
    return response.data.data;
  },
  
  // Get popular salons
  getPopular: async (limit = 10) => {
    const response = await api.get('/salons/popular', { params: { limit } });
    return response.data.data;
  },
  
  // Get nearest salons
  getNearest: async (coordinates, limit = 10) => {
    const params = { limit };
    if (coordinates && coordinates.lat && coordinates.lng) {
      params.lat = coordinates.lat;
      params.lng = coordinates.lng;
    }
    const response = await api.get('/salons/nearest', { params });
    return response.data.data;
  },
  
  // Search salons
  search: async (query) => {
    const response = await api.get('/salons/search', { params: { query } });
    return response.data.data;
  },
  
  // Get salon services
  getServices: async (salonId) => {
    const response = await api.get(`/salons/${salonId}/services`);
    return response.data.data;
  },
  
  // Get salon packages
  getPackages: async (salonId) => {
    const response = await api.get(`/salons/${salonId}/packages`);
    return response.data.data;
  },
  
  // Get salon stylists
  getStylists: async (salonId) => {
    const response = await api.get(`/salons/${salonId}/stylists`);
    return response.data.data;
  },
  
  // Create a new salon (admin only)
  create: async (salonData) => {
    const response = await api.post('/salons', salonData, { protected: true });
    return response.data.data;
  }
};

// ===== Booking Services =====
export const bookingService = {
  // Create a new booking
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData, { protected: true });
    return response.data.data;
  },
  
  // Get user's bookings
  getUserBookings: async () => {
    const response = await api.get('/bookings/my', { protected: true });
    return response.data.data;
  },
  
  // Get booking by ID
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`, { protected: true });
    return response.data.data;
  },
  
  // Cancel booking
  cancel: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`, {}, { protected: true });
    return response.data.data;
  },
  
  // Update booking
  update: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData, { protected: true });
    return response.data.data;
  }
};

// ===== User Services =====
export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile', { protected: true });
    return response.data.data;
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData, { protected: true });
    return response.data.data;
  },
  
  // Get user favorites
  getFavorites: async () => {
    const response = await api.get('/users/favorites', { protected: true });
    return response.data.data;
  },
  
  // Add salon to favorites
  addFavorite: async (salonId) => {
    const response = await api.post('/users/favorites', { salonId }, { protected: true });
    return response.data.data;
  },
  
  // Remove salon from favorites
  removeFavorite: async (salonId) => {
    const response = await api.delete(`/users/favorites/${salonId}`, { protected: true });
    return response.data.data;
  }
};

// ===== Review Services =====
export const reviewService = {
  // Create a review
  create: async (salonId, reviewData) => {
    const response = await api.post(`/salons/${salonId}/reviews`, reviewData, { protected: true });
    return response.data.data;
  },
  
  // Get salon reviews
  getSalonReviews: async (salonId) => {
    const response = await api.get(`/salons/${salonId}/reviews`);
    return response.data.data;
  },
  
  // Update a review
  update: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData, { protected: true });
    return response.data.data;
  },
  
  // Delete a review
  delete: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`, { protected: true });
    return response.data.success;
  }
};

// Export all services
export default {
  salon: salonService,
  booking: bookingService,
  user: userService,
  review: reviewService
};