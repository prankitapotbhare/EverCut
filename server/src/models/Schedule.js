const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Time slot schema (embedded)
const timeSlotSchema = new Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    default: ''
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  }
});

const scheduleSchema = new Schema({
  salonistId: {
    type: Schema.Types.ObjectId,
    ref: 'Salonist',
    required: true,
    index: true
  },
  salonId: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
    index: true
  },
  dayOfWeek: {
    type: Number, // 0-6 for Sunday-Saturday
    required: true,
    min: 0,
    max: 6
  },
  date: {
    type: Date, // Specific date if this is a date-specific schedule
    index: true
  },
  timeSlots: [timeSlotSchema],
  isActive: {
    type: Boolean,
    default: true
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
scheduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound indexes for common queries
scheduleSchema.index({ salonistId: 1, dayOfWeek: 1 });
scheduleSchema.index({ salonId: 1, dayOfWeek: 1 });
scheduleSchema.index({ salonId: 1, date: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);