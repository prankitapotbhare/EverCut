/**
 * Service Service
 * Handles API requests for salon service-related operations
 */

import { get, post, put, del } from '@/utils/api';

/**
 * Get services by salon ID
 * @param {string} salonId - Salon ID
 * @param {Object} params - Query parameters
 * @returns {Promise} - Services data
 */
export const getServicesBySalon = async (salonId, params = {}) => {
  try {
    const response = await get(`/services/salon/${salonId}`, params);
    return response.data.services;
  } catch (error) {
    console.error('Error fetching salon services:', error);
    throw error;
  }
};

/**
 * Get service by ID
 * @param {string} id - Service ID
 * @returns {Promise} - Service data
 */
export const getServiceById = async (id) => {
  try {
    const response = await get(`/services/${id}`);
    return response.data.service;
  } catch (error) {
    console.error('Error fetching service details:', error);
    throw error;
  }
};

/**
 * Create a new service (requires salon owner role)
 * @param {Object} serviceData - Service data
 * @returns {Promise} - Created service data
 */
export const createService = async (serviceData) => {
  try {
    const response = await post('/services', serviceData);
    return response.data.service;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

/**
 * Update a service (requires salon owner role)
 * @param {string} id - Service ID
 * @param {Object} serviceData - Updated service data
 * @returns {Promise} - Updated service data
 */
export const updateService = async (id, serviceData) => {
  try {
    const response = await put(`/services/${id}`, serviceData);
    return response.data.service;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

/**
 * Delete a service (requires salon owner role)
 * @param {string} id - Service ID
 * @returns {Promise} - Deletion result
 */
export const deleteService = async (id) => {
  try {
    const response = await del(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};