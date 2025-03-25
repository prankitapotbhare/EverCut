/**
 * Package Service
 * Handles API requests for salon package-related operations
 */

import { get, post, put, del } from '@/utils/api';

/**
 * Get packages by salon ID
 * @param {string} salonId - Salon ID
 * @param {Object} params - Query parameters
 * @returns {Promise} - Packages data
 */
export const getPackagesBySalon = async (salonId, params = {}) => {
  try {
    const response = await get(`/packages/salon/${salonId}`, params);
    return response.data.packages;
  } catch (error) {
    console.error('Error fetching salon packages:', error);
    throw error;
  }
};

/**
 * Get package by ID
 * @param {string} id - Package ID
 * @returns {Promise} - Package data
 */
export const getPackageById = async (id) => {
  try {
    const response = await get(`/packages/${id}`);
    return response.data.package;
  } catch (error) {
    console.error('Error fetching package details:', error);
    throw error;
  }
};

/**
 * Create a new package (requires salon owner role)
 * @param {Object} packageData - Package data
 * @returns {Promise} - Created package data
 */
export const createPackage = async (packageData) => {
  try {
    const response = await post('/packages', packageData);
    return response.data.package;
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

/**
 * Update a package (requires salon owner role)
 * @param {string} id - Package ID
 * @param {Object} packageData - Updated package data
 * @returns {Promise} - Updated package data
 */
export const updatePackage = async (id, packageData) => {
  try {
    const response = await put(`/packages/${id}`, packageData);
    return response.data.package;
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
};

/**
 * Delete a package (requires salon owner role)
 * @param {string} id - Package ID
 * @returns {Promise} - Deletion result
 */
export const deletePackage = async (id) => {
  try {
    const response = await del(`/packages/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
};