const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  salonId: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
    min: 5
  },
  category: {
    type: String,
    default: 'General',
    index: true
  },
  image: {
    type: String
  },
  popularityScore: {
    type: Number,
    default: 0,
    min: 0
  },
  bookingCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true,
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
serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to parse duration string if needed
serviceSchema.pre('save', function(next) {
  // If duration is already a number, ensure it's at least 5
  if (typeof this.duration === 'number') {
    this.duration = Math.max(5, this.duration);
    return next();
  }
  
  // Try to parse duration string like "30 min" or "1.5 hrs"
  try {
    const durationStr = String(this.duration).toLowerCase();
    
    if (durationStr.includes('min')) {
      // Extract minutes: "30 min" -> 30
      const minutes = parseInt(durationStr);
      this.duration = Math.max(5, minutes); // Ensure minimum 5 minutes
    } else if (durationStr.includes('hr')) {
      // Extract hours: "1.5 hrs" -> 90
      const hours = parseFloat(durationStr);
      this.duration = Math.max(5, Math.round(hours * 60)); // Ensure minimum 5 minutes
    } else {
      // Default to the string value as a number
      const minutes = parseInt(durationStr) || 30;
      this.duration = Math.max(5, minutes); // Ensure minimum 5 minutes
    }
  } catch (error) {
    // Default to 30 minutes if parsing fails
    this.duration = 30;
  }
  
  next();
});

// Create compound indexes for common queries
serviceSchema.index({ salonId: 1, category: 1 });
serviceSchema.index({ salonId: 1, isActive: 1 });
serviceSchema.index({ name: 'text', description: 'text' });
serviceSchema.index({ price: 1 }); // For price-based sorting and filtering

module.exports = mongoose.model('Service', serviceSchema);