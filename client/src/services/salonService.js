import { get } from '@/utils/api';

/**
 * Get all salons with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise} - Salon data
 */
export const getSalons = async (params = {}) => {
  try {
    const response = await get('/salons', params);
    return response.data.salons;
  } catch (error) {
    console.error('Error fetching salons:', error);
    throw error;
  }
};

/**
 * Get salon by ID
 * @param {string} id - Salon ID
 * @returns {Promise} - Salon data
 */
export const getSalonById = async (id) => {
  try {
    const response = await get(`/salons/${id}`);
    return response.data.salon;
  } catch (error) {
    console.error('Error fetching salon details:', error);
    throw error;
  }
};

/**
 * Get popular salons
 * @param {Object} params - Query parameters (limit, page)
 * @returns {Promise} - Popular salons data
 */
export const getPopularSalons = async (params = {}) => {
  try {
    const response = await get('/salons/popular/list', params);
    return response.data.salons;
  } catch (error) {
    console.error('Error fetching popular salons:', error);
    throw error;
  }
};

/**
 * Get nearest salons based on user location
 * @param {Object} userLocation - User location data (latitude, longitude)
 * @param {Object} params - Additional query parameters
 * @returns {Promise} - Nearest salons data
 */
export const getNearestSalons = async (userLocation, params = {}) => {
  try {
    const queryParams = {
      ...params,
      ...userLocation
    };
    const response = await get('/salons/nearest/list', queryParams);
    return response.data.salons;
  } catch (error) {
    console.error('Error fetching nearest salons:', error);
    throw error;
  }
};

/**
 * Search salons by query
 * @param {string} query - Search query
 * @param {Object} params - Additional query parameters
 * @returns {Promise} - Search results
 */
export const searchSalons = async (query, params = {}) => {
  try {
    const queryParams = {
      ...params,
      q: query
    };
    const response = await get('/salons/search/query', queryParams);
    return response.data.salons;
  } catch (error) {
    console.error('Error searching salons:', error);
    throw error;
  }
};