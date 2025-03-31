const mongoose = require('mongoose');

// Define the service schema
const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  services: [{ type: String }] // For packages that include multiple services
});

// Define the stylist schema
const stylistSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  specialties: [{ type: String }],
  bio: { type: String },
  availability: [{
    day: { type: Number }, // 0-6 for Sunday-Saturday
    slots: [{ type: String }] // Time slots like "09:00", "09:30"
  }]
});

// Define the review schema
const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userImage: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

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
  services: [serviceSchema], // Individual services
  packages: [serviceSchema], // Service packages
  stylists: [stylistSchema], // Salon stylists
  reviews: [reviewSchema], // Customer reviews
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

// Pre-save middleware to update the updatedAt field
salonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate average rating
salonSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
};

// Ensure the 2dsphere index is created
salonSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Salon', salonSchema);