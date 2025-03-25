/**
 * Booking Service
 * Handles API requests for booking-related operations
 */

import { get, post, put, del } from '@/utils/api';

/**
 * Get bookings for the current user
 * @param {Object} params - Query parameters
 * @returns {Promise} - Bookings data
 */
export const getUserBookings = async (params = {}) => {
  try {
    const response = await get('/bookings/user', params);
    return response.data.bookings;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

/**
 * Get booking by ID
 * @param {string} id - Booking ID
 * @returns {Promise} - Booking data
 */
export const getBookingById = async (id) => {
  try {
    const response = await get(`/bookings/${id}`);
    return response.data.booking;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking data
 * @returns {Promise} - Created booking data
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await post('/bookings', bookingData);
    return response.data.booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Update a booking
 * @param {string} id - Booking ID
 * @param {Object} bookingData - Updated booking data
 * @returns {Promise} - Updated booking data
 */
export const updateBooking = async (id, bookingData) => {
  try {
    const response = await put(`/bookings/${id}`, bookingData);
    return response.data.booking;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

/**
 * Cancel a booking
 * @param {string} id - Booking ID
 * @returns {Promise} - Cancellation result
 */
export const cancelBooking = async (id) => {
  try {
    const response = await del(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};