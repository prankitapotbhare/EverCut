const mongoose = require('mongoose');

/**
 * Booking Schema
 * Represents a customer booking/appointment at a salon
 */
const bookingSchema = new mongoose.Schema({
  user: {
    type: String, // Firebase UID of the customer
    required: true,
    index: true
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
    index: true
  },
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    name: String, // Store the name at time of booking
    price: Number, // Store the price at time of booking
    duration: Number // Store the duration at time of booking
  }],
  staff: {
    id: mongoose.Schema.Types.Mixed,
    name: String
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  startTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/ // HH:MM format (24-hour)
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/ // HH:MM format (24-hour)
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending',
    index: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'cash', 'other'],
    default: 'credit_card'
  },
  paymentId: {
    type: String, // Reference to payment processor ID
    sparse: true
  },
  notes: {
    type: String,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancellationDate: {
    type: Date
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  customerContact: {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for common queries
bookingSchema.index({ salon: 1, date: 1, status: 1 });
bookingSchema.index({ user: 1, date: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;