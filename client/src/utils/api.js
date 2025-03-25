/**
 * API Utility
 * Handles HTTP requests to the backend API
 */

import { getAuthToken } from './auth';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Response data
 */
async function fetchApi(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add auth token if available
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    
    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * HTTP GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response data
 */
export const get = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return fetchApi(url, { method: 'GET' });
};

/**
 * HTTP POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} - Response data
 */
export const post = async (endpoint, data = {}) => {
  return fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * HTTP PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} - Response data
 */
export const put = async (endpoint, data = {}) => {
  return fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * HTTP DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Response data
 */
export const del = async (endpoint) => {
  return fetchApi(endpoint, { method: 'DELETE' });
};