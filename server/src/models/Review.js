const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  salonId: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
    index: true
  },
  salonistId: {
    type: Schema.Types.ObjectId,
    ref: 'Salonist',
    index: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  images: [{
    type: String
  }],
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
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound indexes for efficient querying
reviewSchema.index({ salonId: 1, createdAt: -1 });
reviewSchema.index({ salonistId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);