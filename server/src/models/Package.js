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
    type: String
  },
  regularPrice: {
    type: Number,
    required: true
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
    required: true
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  services: [includedServiceSchema],
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
packageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound indexes for common queries
packageSchema.index({ salonId: 1, isActive: 1 });
packageSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Package', packageSchema);