import api from './api';

// Get all salons with optional filters
export const getSalons = async (filters = {}) => {
  try {
    const response = await api.get('/salons', { params: filters });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching salons:', error);
    throw error;
  }
};

// Get salon by ID
export const getSalonById = async (id) => {
  try {
    const response = await api.get(`/salons/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching salon with ID ${id}:`, error);
    throw error;
  }
};

// Get popular salons
export const getPopularSalons = async (limit = 10) => {
  try {
    const response = await api.get('/salons/popular', { params: { limit } });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching popular salons:', error);
    throw error;
  }
};

// Get nearest salons based on coordinates
export const getNearestSalons = async (coordinates, limit = 10) => {
  try {
    const params = { limit };
    if (coordinates && coordinates.lat && coordinates.lng) {
      params.lat = coordinates.lat;
      params.lng = coordinates.lng;
    }
    
    const response = await api.get('/salons/nearest', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching nearest salons:', error);
    throw error;
  }
};

// Search salons by query with advanced features
export const searchSalons = async (query, coordinates = null, limit = 10) => {
  try {
    // Handle empty queries
    if (!query || query.trim() === '') {
      return [];
    }
    
    const params = { 
      query: query.trim(),
      limit
    };
    
    // Add coordinates if available
    if (coordinates && coordinates.lat && coordinates.lng) {
      params.lat = coordinates.lat;
      params.lng = coordinates.lng;
    }
    
    const response = await api.get('/salons/search', { params });
    
    return response.data.data;
  } catch (error) {
    console.error('Error searching salons:', error);
    throw error;
  }
};

// Get salon services
export const getSalonServices = async (salonId) => {
  try {
    const response = await api.get(`/salons/${salonId}/services`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching services for salon ${salonId}:`, error);
    throw error;
  }
};

// Get salon packages
export const getSalonPackages = async (salonId) => {
  try {
    const response = await api.get(`/salons/${salonId}/packages`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching packages for salon ${salonId}:`, error);
    throw error;
  }
};

// Get salon stylists
export const getSalonStylists = async (salonId) => {
  try {
    const response = await api.get(`/salons/${salonId}/stylists`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching stylists for salon ${salonId}:`, error);
    throw error;
  }
};

// Create a new salon (admin only)
export const createSalon = async (salonData) => {
  try {
    const response = await api.post('/salons', salonData, { protected: true });
    return response.data.data;
  } catch (error) {
    console.error('Error creating salon:', error);
    throw error;
  }
};

export default {
  getSalons,
  getSalonById,
  getPopularSalons,
  getNearestSalons,
  searchSalons,
  getSalonServices,
  getSalonPackages,
  getSalonStylists,
  createSalon
};