const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Availability Schema (Embedded)
const availabilitySchema = new Schema({
  day: {
    type: Number, // 0-6 for Sunday-Saturday
    required: true
  },
  slots: [{
    type: String // Format: "9:00 AM", "9:30 AM", etc.
  }]
});

// Salonist Schema
const salonistSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  salonId: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
    index: true
  },
  image: {
    type: String
  },
  specialties: [{
    type: String
  }],
  bio: {
    type: String
  },
  availability: [availabilitySchema],
  availabilityStatus: {
    type: String,
    enum: ['available', 'unavailable', 'partially-booked', 'mostly-booked', 'booked', 'on-leave'],
    default: 'available'
  },
  availabilityReason: {
    type: String
  },
  bookedPercentage: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active',
    index: true
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
salonistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound indexes for efficient querying
salonistSchema.index({ salonId: 1, status: 1 });
salonistSchema.index({ name: 'text' });

module.exports = mongoose.model('Salonist', salonistSchema);