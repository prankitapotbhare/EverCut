/**
 * Service Schema
 * Represents a service offered by a salon
 */

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
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
    required: true,
    trim: true,
    index: true
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
serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema);