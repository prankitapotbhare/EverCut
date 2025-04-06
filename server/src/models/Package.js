const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Included Service Schema (Embedded)
const includedServiceSchema = new Schema({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  regularPrice: {
    type: Number,
    required: true,
    default: 0
  }
});

const packageSchema = new Schema({
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
  discountPercentage: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
    min: 15
  },
  services: [includedServiceSchema],
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
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
packageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to parse duration string if needed
packageSchema.pre('save', function(next) {
  // If duration is already a number, ensure it's at least 15
  if (typeof this.duration === 'number') {
    this.duration = Math.max(15, this.duration);
    return next();
  }
  
  // Try to parse duration string like "30 min" or "1.5 hrs"
  try {
    const durationStr = String(this.duration).toLowerCase();
    
    if (durationStr.includes('min')) {
      // Extract minutes: "30 min" -> 30
      const minutes = parseInt(durationStr);
      this.duration = Math.max(15, minutes); // Ensure minimum 15 minutes
    } else if (durationStr.includes('hr')) {
      // Extract hours: "1.5 hrs" -> 90
      const hours = parseFloat(durationStr);
      this.duration = Math.max(15, Math.round(hours * 60)); // Ensure minimum 15 minutes
    } else {
      // Default to the string value as a number
      const minutes = parseInt(durationStr) || 60;
      this.duration = Math.max(15, minutes); // Ensure minimum 15 minutes
    }
  } catch (error) {
    // Default to 60 minutes if parsing fails
    this.duration = 60;
  }
  
  next();
});

// Create compound indexes for common queries
packageSchema.index({ salonId: 1, isActive: 1 });
packageSchema.index({ name: 'text', description: 'text' });
packageSchema.index({ price: 1 }); // For price-based sorting and filtering

module.exports = mongoose.model('Package', packageSchema);