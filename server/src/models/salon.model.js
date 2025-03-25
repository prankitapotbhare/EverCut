/**
 * Salon Schema
 * Represents a salon/barbershop in the application
 */

const mongoose = require('mongoose');

// Staff member schema (embedded document)
const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  specialties: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Review schema (embedded document)
const reviewSchema = new mongoose.Schema({
  user: {
    type: String, // Firebase UID
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userImage: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

// Main salon schema
const salonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  owner: {
    type: String, // Firebase UID of the salon owner
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  gallery: [{
    type: String
  }],
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'USA'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    }
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  website: {
    type: String,
    trim: true
  },
  hours: {
    monday: {
      open: String,
      close: String,
      isClosed: Boolean
    },
    tuesday: {
      open: String,
      close: String,
      isClosed: Boolean
    },
    wednesday: {
      open: String,
      close: String,
      isClosed: Boolean
    },
    thursday: {
      open: String,
      close: String,
      isClosed: Boolean
    },
    friday: {
      open: String,
      close: String,
      isClosed: Boolean
    },
    saturday: {
      open: String,
      close: String,
      isClosed: Boolean
    },
    sunday: {
      open: String,
      close: String,
      isClosed: Boolean
    }
  },
  staff: [staffSchema],
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  packages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  reviewsData: [reviewSchema],
  distance: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
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

// Create a geospatial index for location-based queries
salonSchema.index({ 'address.location': '2dsphere' });

// Update the updatedAt field on save
salonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Salon', salonSchema);