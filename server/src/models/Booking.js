const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Service Booking Schema (Embedded)
const serviceBookingSchema = new Schema({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String
  }
});

// Booking Schema
const bookingSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String
  },
  userName: {
    type: String
  },
  userPhone: {
    type: String
  },
  salonId: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
    index: true
  },
  salonName: {
    type: String
  },
  salonistId: {
    type: Schema.Types.ObjectId,
    ref: 'Salonist',
    required: true,
    index: true
  },
  salonistName: {
    type: String
  },
  services: [serviceBookingSchema],
  date: {
    type: Date,
    required: true,
    index: true
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use HH:MM format.`
    }
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use HH:MM format.`
    }
  },
  totalDuration: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no-show'],
    default: 'pending',
    index: true
  },
  cancellationReason: {
    type: String
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'salon', 'system']
  },
  notes: {
    type: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  feedbackRequested: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound indexes for efficient querying
bookingSchema.index({ salonId: 1, date: 1 });
bookingSchema.index({ salonistId: 1, date: 1 });
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ date: 1, status: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);