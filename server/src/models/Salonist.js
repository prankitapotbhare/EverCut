const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Availability Schema (Embedded)
const availabilitySchema = new Schema({
  day: {
    type: Number, // 0-6 for Sunday-Saturday
    required: true,
    min: 0,
    max: 6
  },
  slots: [{
    type: String // Format: "9:00", "9:30", etc.
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
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
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

// Virtual for getting all schedules for this salonist
salonistSchema.virtual('schedules', {
  ref: 'Schedule',
  localField: '_id',
  foreignField: 'salonistId'
});

// Create compound indexes for common queries
salonistSchema.index({ salonId: 1, status: 1 });
salonistSchema.index({ name: 'text' });

module.exports = mongoose.model('Salonist', salonistSchema);