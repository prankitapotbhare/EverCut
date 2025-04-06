const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Operating hours schema (embedded)
const operatingHoursSchema = new Schema({
  day: { 
    type: Number, // 0-6 for Sunday-Saturday
    required: true 
  },
  open: { 
    type: String, 
    required: true 
  },
  close: { 
    type: String, 
    required: true 
  }
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
  amenities: [{
    type: String
  }],
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'Service'
  }],
  packages: [{
    type: Schema.Types.ObjectId,
    ref: 'Package'
  }],
  salonists: [{
    type: Schema.Types.ObjectId,
    ref: 'Salonist'
  }],
  operatingHours: [operatingHoursSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to update the updatedAt field
salonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual populate for services if not directly populated
salonSchema.virtual('virtualServices', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'salonId'
});

// Virtual populate for packages if not directly populated
salonSchema.virtual('virtualPackages', {
  ref: 'Package',
  localField: '_id',
  foreignField: 'salonId'
});

// Virtual populate for salonists if not directly populated
salonSchema.virtual('virtualSalonists', {
  ref: 'Salonist',
  localField: '_id',
  foreignField: 'salonId'
});

// Virtual populate for reviews if not directly populated
salonSchema.virtual('virtualReviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'salonId'
});

// Create indexes for common queries
salonSchema.index({ 'address.city': 1 });
salonSchema.index({ 'address.state': 1 });
salonSchema.index({ rating: -1 });
salonSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Salon', salonSchema);