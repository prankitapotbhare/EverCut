# Backend Services Documentation

This document provides detailed information about the implementation of service layers in the EverCut backend application, which handle business logic between the API routes and data models.

## Service Layer Architecture

The backend uses a service-oriented architecture to separate business logic from route handlers and data models:

```
API Routes → Controllers → Services → Database Models
```

Services provide an abstraction layer over database operations, allowing for:
- Complex business logic
- Transaction handling
- Integration with multiple data sources (Firebase and MongoDB)
- Error handling standardization
- Validation and data transformation

## Core Services

### User Service

Handles user authentication, profile management, and role-based operations.

```javascript
// src/services/user.service.js
const admin = require('firebase-admin');
const User = require('../models/mongoose/user.model');

class UserService {
  /**
   * Get user profile from Firestore
   * @param {string} uid - Firebase User ID
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile(uid) {
    try {
      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      
      return userDoc.data();
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update user profile in Firestore and sync to MongoDB
   * @param {string} uid - Firebase User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated user profile
   */
  async updateUserProfile(uid, profileData) {
    try {
      // Update in Firestore
      const db = admin.firestore();
      await db.collection('users').doc(uid).update({
        ...profileData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Sync to MongoDB (lightweight user record)
      await this.syncUserToMongoDB(uid);
      
      // Return updated profile
      return this.getUserProfile(uid);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Sync essential user data from Firestore to MongoDB
   * @param {string} uid - Firebase User ID
   * @returns {Promise<Object>} MongoDB user record
   */
  async syncUserToMongoDB(uid) {
    try {
      const userProfile = await this.getUserProfile(uid);
      
      // Update or create MongoDB user record
      const mongoUser = await User.findOneAndUpdate(
        { uid },
        {
          uid,
          email: userProfile.email,
          displayName: userProfile.displayName,
          role: userProfile.role || 'customer',
          emailVerified: userProfile.emailVerified
        },
        { upsert: true, new: true }
      );
      
      return mongoUser;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Validate and update user role
   * @param {string} uid - Firebase User ID
   * @param {string} role - New role (customer, salonOwner, admin)
   * @returns {Promise<Object>} Updated user profile
   */
  async updateUserRole(uid, role) {
    try {
      // Validate role
      if (!['customer', 'salonOwner', 'admin'].includes(role)) {
        throw new Error('Invalid role');
      }
      
      // Update role in Firestore
      const db = admin.firestore();
      await db.collection('users').doc(uid).update({
        role,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Set custom claims in Firebase Auth
      await admin.auth().setCustomUserClaims(uid, { role });
      
      // Sync to MongoDB
      await this.syncUserToMongoDB(uid);
      
      return this.getUserProfile(uid);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
```

### Salon Service

Manages salon information and services.

```javascript
// src/services/salon.service.js
const Salon = require('../models/mongoose/salon.model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

class SalonService {
  /**
   * Get all salons with filtering and pagination
   * @param {Object} filters - Filter criteria
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @returns {Promise<Object>} Salons and pagination data
   */
  async getSalons(filters = {}, page = 1, limit = 20) {
    try {
      const query = {};
      
      // Apply filters
      if (filters.city) {
        query['location.city'] = filters.city;
      }
      
      if (filters.service) {
        query['services.name'] = { $regex: filters.service, $options: 'i' };
      }
      
      if (filters.tags) {
        const tagList = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
        query.tags = { $in: tagList };
      }
      
      if (filters.rating) {
        query.rating = { $gte: parseFloat(filters.rating) };
      }
      
      // Execute query with pagination
      const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
        sort: { rating: -1 }
      };
      
      const [salons, total] = await Promise.all([
        Salon.find(query, null, options),
        Salon.countDocuments(query)
      ]);
      
      return {
        salons,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page: parseInt(page),
          limit: parseInt(limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get salon by ID
   * @param {string} salonId - Salon ID
   * @returns {Promise<Object>} Salon data
   */
  async getSalonById(salonId) {
    try {
      const salon = await Salon.findById(salonId);
      
      if (!salon) {
        throw new Error('Salon not found');
      }
      
      return salon;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Create new salon
   * @param {Object} salonData - Salon data
   * @param {string} ownerId - Firebase User ID of the owner
   * @returns {Promise<Object>} Created salon
   */
  async createSalon(salonData, ownerId) {
    try {
      // Validate salon data
      if (!salonData.name || !salonData.location) {
        throw new Error('Salon name and location are required');
      }
      
      // Create salon
      const salon = new Salon({
        ...salonData,
        ownerId,
        status: 'active'
      });
      
      await salon.save();
      return salon;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update existing salon
   * @param {string} salonId - Salon ID
   * @param {Object} updateData - Data to update
   * @param {string} ownerId - Firebase User ID (for verification)
   * @returns {Promise<Object>} Updated salon
   */
  async updateSalon(salonId, updateData, ownerId) {
    try {
      // Find salon
      const salon = await Salon.findById(salonId);
      
      if (!salon) {
        throw new Error('Salon not found');
      }
      
      // Verify ownership (unless admin - checked in controller)
      if (salon.ownerId !== ownerId) {
        throw new Error('Not authorized to update this salon');
      }
      
      // Update salon
      Object.keys(updateData).forEach(key => {
        salon[key] = updateData[key];
      });
      
      await salon.save();
      return salon;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Add service to salon
   * @param {string} salonId - Salon ID
   * @param {Object} serviceData - Service data
   * @param {string} ownerId - Firebase User ID (for verification)
   * @returns {Promise<Object>} Updated salon with new service
   */
  async addService(salonId, serviceData, ownerId) {
    try {
      // Find salon
      const salon = await Salon.findById(salonId);
      
      if (!salon) {
        throw new Error('Salon not found');
      }
      
      // Verify ownership
      if (salon.ownerId !== ownerId) {
        throw new Error('Not authorized to update this salon');
      }
      
      // Add service with new ObjectId
      salon.services.push({
        _id: new ObjectId(),
        ...serviceData
      });
      
      await salon.save();
      return salon;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SalonService();
```

### Salonist (Stylist) Service

Manages stylist profiles, availability, and services.

```javascript
// src/services/salonist.service.js
const Salonist = require('../models/mongoose/salonist.model');
const Salon = require('../models/mongoose/salon.model');
const Booking = require('../models/mongoose/booking.model');
const Leave = require('../models/mongoose/leave.model');

class SalonistService {
  /**
   * Get salonists by salon ID
   * @param {string} salonId - Salon ID
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Salonists for the salon
   */
  async getSalonistsBySalon(salonId, filters = {}) {
    try {
      const query = { salonId };
      
      // Apply filters
      if (filters.service) {
        query.services = { $in: [filters.service] };
      }
      
      if (filters.status) {
        query.status = filters.status;
      }
      
      return Salonist.find(query);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get salonist by ID
   * @param {string} salonistId - Salonist ID
   * @returns {Promise<Object>} Salonist data
   */
  async getSalonistById(salonistId) {
    try {
      const salonist = await Salonist.findById(salonistId);
      
      if (!salonist) {
        throw new Error('Salonist not found');
      }
      
      return salonist;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get available time slots for a salonist on a specific date
   * @param {string} salonistId - Salonist ID
   * @param {Date} date - Date to check
   * @param {Array} serviceIds - Service IDs (for duration calculation)
   * @returns {Promise<Array>} Available time slots
   */
  async getAvailableTimeSlots(salonistId, date, serviceIds = []) {
    try {
      // Get salonist
      const salonist = await Salonist.findById(salonistId);
      
      if (!salonist) {
        throw new Error('Salonist not found');
      }
      
      // Get day of week
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
      
      // Get salonist's regular availability for this day
      const dayAvailability = salonist.availability[dayOfWeek] || [];
      
      if (dayAvailability.length === 0) {
        return []; // Not working this day
      }
      
      // Get salon for operating hours
      const salon = await Salon.findById(salonist.salonId);
      const salonHours = salon.hours[dayOfWeek];
      
      // Calculate service duration
      let serviceDuration = 30; // Default 30 minutes
      
      if (serviceIds.length > 0) {
        // Look up services from salon
        const services = salon.services.filter(service => 
          serviceIds.includes(service._id.toString())
        );
        
        if (services.length > 0) {
          // Extract duration in minutes from "X hr Y min" format
          serviceDuration = services.reduce((total, service) => {
            const durationStr = service.duration;
            let minutes = 0;
            
            if (durationStr.includes('hr')) {
              const hours = parseInt(durationStr.split('hr')[0].trim());
              minutes += hours * 60;
            }
            
            if (durationStr.includes('min')) {
              const mins = parseInt(durationStr.split('min')[0].split('hr')[1].trim());
              minutes += mins;
            }
            
            return total + (minutes || 30); // Default to 30 if parsing fails
          }, 0);
        }
      }
      
      // Get existing bookings for this date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const bookings = await Booking.find({
        salonistId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['confirmed', 'rescheduled'] }
      });
      
      // Get leaves/time-off
      const leaves = await Leave.find({
        salonistId,
        startDate: { $lte: endOfDay },
        endDate: { $gte: startOfDay },
        status: 'approved'
      });
      
      // Generate available time slots
      // This is a simplified algorithm - a real implementation would be more complex
      const timeSlots = [];
      const slotDuration = 30; // 30-minute slots
      
      // Convert availability timeRanges to slots
      dayAvailability.forEach(range => {
        let startHour = parseInt(range.start.split(':')[0]);
        let startMinute = parseInt(range.start.split(':')[1]);
        
        let endHour = parseInt(range.end.split(':')[0]);
        let endMinute = parseInt(range.end.split(':')[1]);
        
        // Adjust for AM/PM if needed
        if (range.start.includes('PM') && startHour < 12) startHour += 12;
        if (range.start.includes('AM') && startHour === 12) startHour = 0;
        if (range.end.includes('PM') && endHour < 12) endHour += 12;
        if (range.end.includes('AM') && endHour === 12) endHour = 0;
        
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        
        // Generate 30-minute slots
        for (let time = startMinutes; time <= endMinutes - serviceDuration; time += slotDuration) {
          const hour = Math.floor(time / 60);
          const minute = time % 60;
          
          const slotStart = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Check if slot overlaps with any booking
          const isBooked = bookings.some(booking => {
            const bookingStart = booking.startTime;
            const bookingEnd = booking.endTime;
            
            // Parse booking times to minutes
            const bookingStartParts = bookingStart.split(':');
            const bookingStartHour = parseInt(bookingStartParts[0]);
            const bookingStartMinute = parseInt(bookingStartParts[1]);
            const bookingStartMinutes = bookingStartHour * 60 + bookingStartMinute;
            
            const bookingEndParts = bookingEnd.split(':');
            const bookingEndHour = parseInt(bookingEndParts[0]);
            const bookingEndMinute = parseInt(bookingEndParts[1]);
            const bookingEndMinutes = bookingEndHour * 60 + bookingEndMinute;
            
            // Check if slot overlaps with booking
            const slotEnd = time + serviceDuration;
            return (time < bookingEndMinutes && slotEnd > bookingStartMinutes);
          });
          
          // Check if slot overlaps with any leave
          const isOnLeave = leaves.some(leave => {
            if (leave.allDay) return true;
            
            // Only check time if not an all-day leave
            const leaveStart = leave.startTime;
            const leaveEnd = leave.endTime;
            
            if (!leaveStart || !leaveEnd) return false;
            
            // Parse leave times to minutes
            const leaveStartParts = leaveStart.split(':');
            const leaveStartHour = parseInt(leaveStartParts[0]);
            const leaveStartMinute = parseInt(leaveStartParts[1]);
            const leaveStartMinutes = leaveStartHour * 60 + leaveStartMinute;
            
            const leaveEndParts = leaveEnd.split(':');
            const leaveEndHour = parseInt(leaveEndParts[0]);
            const leaveEndMinute = parseInt(leaveEndParts[1]);
            const leaveEndMinutes = leaveEndHour * 60 + leaveEndMinute;
            
            // Check if slot overlaps with leave
            const slotEnd = time + serviceDuration;
            return (time < leaveEndMinutes && slotEnd > leaveStartMinutes);
          });
          
          // Add slot if available
          if (!isBooked && !isOnLeave) {
            const slotHour = Math.floor(time / 60);
            const slotMinute = time % 60;
            const ampm = slotHour >= 12 ? 'PM' : 'AM';
            const hour12 = slotHour % 12 || 12;
            
            timeSlots.push({
              time: `${hour12}:${slotMinute.toString().padStart(2, '0')} ${ampm}`,
              rawTime: slotStart,
              available: true
            });
          }
        }
      });
      
      return timeSlots.sort((a, b) => {
        return a.rawTime.localeCompare(b.rawTime);
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SalonistService();
```

### Booking Service

Manages booking creation, updates, and queries.

```javascript
// src/services/booking.service.js
const Booking = require('../models/mongoose/booking.model');
const Salonist = require('../models/mongoose/salonist.model');
const Salon = require('../models/mongoose/salon.model');
const Payment = require('../models/mongoose/payment.model');
const { getAvailableTimeSlots } = require('./salonist.service');

class BookingService {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @param {string} userId - Firebase User ID
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData, userId) {
    try {
      const { salonId, salonistId, services, date, startTime, notes } = bookingData;
      
      // Validate required fields
      if (!salonId || !salonistId || !services || !date || !startTime) {
        throw new Error('Missing required booking information');
      }
      
      // Validate date format
      const bookingDate = new Date(date);
      if (isNaN(bookingDate.getTime())) {
        throw new Error('Invalid date format');
      }
      
      // Check if salonist exists
      const salonist = await Salonist.findById(salonistId);
      if (!salonist) {
        throw new Error('Salonist not found');
      }
      
      // Check if salon exists
      const salon = await Salon.findById(salonId);
      if (!salon) {
        throw new Error('Salon not found');
      }
      
      // Validate services exist in salon
      const serviceIds = services.map(s => s.toString());
      const validServices = salon.services.filter(s => 
        serviceIds.includes(s._id.toString())
      );
      
      if (validServices.length !== serviceIds.length) {
        throw new Error('One or more services are invalid');
      }
      
      // Check salonist availability
      const availableSlots = await getAvailableTimeSlots(salonistId, bookingDate, serviceIds);
      const isTimeAvailable = availableSlots.some(slot => slot.rawTime === startTime);
      
      if (!isTimeAvailable) {
        throw new Error('Selected time slot is not available');
      }
      
      // Calculate total amount and end time
      let totalAmount = 0;
      let totalDurationMinutes = 0;
      
      const bookingServices = validServices.map(service => {
        // Extract duration in minutes from "X hr Y min" format
        const durationStr = service.duration;
        let durationMinutes = 0;
        
        if (durationStr.includes('hr')) {
          const hours = parseInt(durationStr.split('hr')[0].trim());
          durationMinutes += hours * 60;
        }
        
        if (durationStr.includes('min')) {
          const mins = parseInt(durationStr.split('min')[0].split('hr')[1].trim());
          durationMinutes += mins;
        }
        
        totalDurationMinutes += durationMinutes;
        totalAmount += service.price;
        
        return {
          id: service._id,
          name: service.name,
          price: service.price,
          duration: durationMinutes
        };
      });
      
      // Calculate end time
      const [startHour, startMinute] = startTime.split(':').map(Number);
      let endHour = startHour + Math.floor((startMinute + totalDurationMinutes) / 60);
      const endMinute = (startMinute + totalDurationMinutes) % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      // Create booking
      const booking = new Booking({
        userId,
        salonId,
        salonistId,
        services: bookingServices,
        date: bookingDate,
        startTime,
        endTime,
        status: 'confirmed',
        totalAmount,
        paymentStatus: 'pending',
        notes
      });
      
      await booking.save();
      
      // Create pending payment record
      const payment = new Payment({
        bookingId: booking._id,
        userId,
        amount: totalAmount,
        status: 'pending'
      });
      
      await payment.save();
      
      return booking;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get user's bookings
   * @param {string} userId - Firebase User ID
   * @param {Object} filters - Filter criteria
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @returns {Promise<Object>} Bookings and pagination data
   */
  async getUserBookings(userId, filters = {}, page = 1, limit = 10) {
    try {
      const query = { userId };
      
      // Apply filters
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.upcoming === 'true') {
        const now = new Date();
        query.date = { $gte: now };
      }
      
      // Execute query with pagination
      const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
        sort: { date: 1 } // Sort by date ascending (upcoming first)
      };
      
      const [bookings, total] = await Promise.all([
        Booking.find(query, null, options)
          .populate('salonId', 'name location')
          .populate('salonistId', 'name photoURL'),
        Booking.countDocuments(query)
      ]);
      
      return {
        bookings,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page: parseInt(page),
          limit: parseInt(limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update booking status
   * @param {string} bookingId - Booking ID
   * @param {string} status - New status
   * @param {string} reason - Reason for status change
   * @param {string} userId - Firebase User ID (for verification)
   * @returns {Promise<Object>} Updated booking
   */
  async updateBookingStatus(bookingId, status, reason, userId) {
    try {
      // Validate status
      if (!['confirmed', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
        throw new Error('Invalid booking status');
      }
      
      // Find booking
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Verify ownership (user is either the customer or salon owner)
      const salon = await Salon.findById(booking.salonId);
      const isCustomerOrOwner = (booking.userId === userId || salon.ownerId === userId);
      
      if (!isCustomerOrOwner) {
        throw new Error('Not authorized to modify this booking');
      }
      
      // Update status
      booking.status = status;
      
      // Add reason for cancellation
      if (status === 'cancelled' && reason) {
        booking.cancellationReason = reason;
      }
      
      await booking.save();
      
      // Handle payment status updates if needed (in a real app, this would integrate with Stripe)
      if (status === 'cancelled') {
        // Find payment and mark for refund if needed
        const payment = await Payment.findOne({ bookingId: booking._id });
        
        if (payment && payment.status === 'succeeded') {
          payment.status = 'refunded';
          payment.refundReason = reason;
          await payment.save();
        }
      }
      
      return booking;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BookingService();
```

### Payment Service

Handles payment processing and management.

```javascript
// src/services/payment.service.js
const Payment = require('../models/mongoose/payment.model');
const Booking = require('../models/mongoose/booking.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  /**
   * Create a payment intent with Stripe
   * @param {string} bookingId - Booking ID
   * @param {string} userId - Firebase User ID (for verification)
   * @param {string} paymentMethodId - Optional Stripe payment method ID
   * @returns {Promise<Object>} Payment intent data
   */
  async createPaymentIntent(bookingId, userId, paymentMethodId = null) {
    try {
      // Find booking
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Verify user owns the booking
      if (booking.userId !== userId) {
        throw new Error('Not authorized to pay for this booking');
      }
      
      // Check if payment already exists
      let payment = await Payment.findOne({ bookingId });
      
      // Create payment if it doesn't exist
      if (!payment) {
        payment = new Payment({
          bookingId,
          userId,
          amount: booking.totalAmount,
          status: 'pending',
          currency: 'usd'
        });
      }
      
      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.totalAmount * 100), // Stripe needs amount in cents
        currency: 'usd',
        metadata: {
          bookingId: booking._id.toString(),
          userId
        },
        payment_method: paymentMethodId || undefined,
        confirm: paymentMethodId ? true : false
      });
      
      // Update payment record with payment intent ID
      payment.paymentIntent = paymentIntent.id;
      await payment.save();
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntent: paymentIntent.id,
        amount: booking.totalAmount
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Confirm a payment
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @param {string} userId - Firebase User ID (for verification)
   * @returns {Promise<Object>} Confirmation result
   */
  async confirmPayment(paymentIntentId, userId) {
    try {
      // Find payment
      const payment = await Payment.findOne({ paymentIntent: paymentIntentId });
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // Verify user owns the payment
      if (payment.userId !== userId) {
        throw new Error('Not authorized to confirm this payment');
      }
      
      // Check payment intent status with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not successful');
      }
      
      // Update payment record
      payment.status = 'succeeded';
      payment.paymentMethod = paymentIntent.payment_method;
      payment.completedAt = new Date();
      payment.receiptUrl = paymentIntent.charges.data[0]?.receipt_url;
      await payment.save();
      
      // Update booking payment status
      const booking = await Booking.findById(payment.bookingId);
      booking.paymentStatus = 'paid';
      booking.paymentMethod = 'credit_card';
      booking.paymentId = payment._id;
      await booking.save();
      
      return {
        success: true,
        payment,
        booking
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Process a refund
   * @param {string} paymentId - Payment ID
   * @param {string} userId - Firebase User ID (for verification)
   * @param {number} amount - Refund amount (defaults to full amount)
   * @param {string} reason - Reason for refund
   * @returns {Promise<Object>} Refund result
   */
  async processRefund(paymentId, userId, amount = null, reason = 'Customer requested') {
    try {
      // Find payment
      const payment = await Payment.findById(paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // Find booking to check ownership/permissions
      const booking = await Booking.findById(payment.bookingId);
      
      if (!booking) {
        throw new Error('Associated booking not found');
      }
      
      // Only the customer or salon owner can request refunds
      // This would be checked in the controller in a real app
      
      // Check if payment was successful
      if (payment.status !== 'succeeded') {
        throw new Error('Cannot refund an unsuccessful payment');
      }
      
      // Process refund with Stripe
      const refund = await stripe.refunds.create({
        payment_intent: payment.paymentIntent,
        amount: amount ? Math.round(amount * 100) : undefined, // Stripe needs amount in cents
        reason: 'requested_by_customer'
      });
      
      // Update payment record
      payment.status = 'refunded';
      payment.refundReason = reason;
      payment.metadata = {
        ...payment.metadata,
        refundId: refund.id
      };
      await payment.save();
      
      // Update booking payment status
      booking.paymentStatus = 'refunded';
      await booking.save();
      
      return {
        success: true,
        refund,
        payment
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PaymentService();
```

## Service Integration with Routes

Services are used in controller files to handle the business logic for routes:

```javascript
// Example controller using services
const SalonService = require('../services/salon.service');

// Salon controller
const SalonController = {
  // Get all salons
  getAllSalons: async (req, res, next) => {
    try {
      const { page, limit, city, service, tags, rating } = req.query;
      const filters = { city, service, tags, rating };
      
      const result = await SalonService.getSalons(filters, page, limit);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
  
  // More controller methods...
};
```

## Error Handling in Services

All services implement consistent error handling patterns:

1. **Try-Catch Blocks**: All service methods use try-catch for error handling
2. **Error Propagation**: Errors are thrown up to be handled by controllers
3. **Validation**: Input validation happens before database operations
4. **Custom Errors**: Descriptive error messages are used for different error conditions

## Service Testing

Services should be tested independently of controllers and API routes:

```javascript
// Example test for salon service (using Jest)
const SalonService = require('../services/salon.service');
const Salon = require('../models/mongoose/salon.model');

// Mock the Salon model
jest.mock('../models/mongoose/salon.model');

describe('SalonService', () => {
  describe('getSalons', () => {
    it('should return salons and pagination data', async () => {
      // Setup mocks
      const mockSalons = [{ name: 'Test Salon' }];
      Salon.find.mockResolvedValue(mockSalons);
      Salon.countDocuments.mockResolvedValue(1);
      
      // Call service
      const result = await SalonService.getSalons();
      
      // Assert
      expect(result.salons).toEqual(mockSalons);
      expect(result.pagination.total).toBe(1);
    });
  });
});
```

## Service Layer Best Practices

1. **Single Responsibility**: Each service handles one domain of business logic
2. **Transaction Management**: Use sessions for multi-step operations
3. **Validation**: Perform all input validation before database operations
4. **Error Handling**: Use descriptive error messages and consistent error patterns
5. **Testability**: Design services to be easily testable in isolation 