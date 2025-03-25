/**
 * Package Schema
 * Represents a package of services offered by a salon
 */

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    name: String, // Store the name at time of creation
    price: Number, // Store the price at time of creation
    duration: Number // Store the duration at time of creation
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalDuration: {
    type: Number, // Total duration in minutes
    required: true,
    min: 5
  },
  image: {
    type: String,
    default: ''
  },
  isPopular: {
    type: Boolean,
    default: false
  },
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

// Update the updatedAt field on save
packageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Package', packageSchema);