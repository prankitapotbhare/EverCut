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
    required: true
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
    index: true
  },
  timeSlots: [{
    type: String, // Format: "9:00 AM", "9:30 AM", etc.
    required: true
  }],
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

// Create compound indexes for efficient querying
scheduleSchema.index({ salonistId: 1, dayOfWeek: 1 }, { unique: true });
scheduleSchema.index({ salonId: 1, dayOfWeek: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);