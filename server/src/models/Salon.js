const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    index: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  distance: { // Distance from user (calculated field)
    type: Number
  },
  contactPhone: { 
    type: String, 
    required: true 
  },
  contactEmail: { 
    type: String, 
    required: true 
  },
  image: { // Main salon image
    type: String,
    required: true
  },
  gallery: [{ // Additional salon images
    type: String 
  }],
  rating: { // Average rating
    type: Number, 
    default: 0 
  },
  reviewCount: { 
    type: Number, 
    default: 0 
  },
  operatingHours: [{
    day: { type: Number, required: true },  // 0-6 for Sunday-Saturday
    open: { type: String, required: true },  // "09:00"
    close: { type: String, required: true }  // "18:00"
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

// Add text search indexes
salonSchema.index({ name: 'text', 'address.city': 'text', 'address.state': 'text' });

// Virtual for full address
salonSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
});

// Virtual populate for services
salonSchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'salonId'
});

// Virtual populate for stylists
salonSchema.virtual('stylists', {
  ref: 'Salonist',
  localField: '_id',
  foreignField: 'salonId'
});

// Virtual populate for reviews
salonSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'salonId'
});

// Virtual populate for bookings
salonSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'salonId'
});

// Pre-save middleware to update the updatedAt field
salonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate average rating
salonSchema.methods.calculateAverageRating = async function() {
  const reviews = await mongoose.model('Review').find({ salonId: this._id });
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

// Ensure the 2dsphere index is created
salonSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Salon', salonSchema);