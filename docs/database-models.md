# Database Models Documentation

This document outlines the database models used in the EverCut application. The application uses a hybrid database approach:

1. **Firebase Authentication & Firestore**: For user authentication and profile management
2. **MongoDB**: For all other application data (salons, stylists, bookings, etc.)

## Database Overview

EverCut's database is structured to support:

1. User authentication and profile management (Firebase/Firestore)
2. Salon and stylist discovery (MongoDB)
3. Service selection and booking (MongoDB)
4. Availability management (MongoDB)
5. Payment processing (MongoDB)

## Firestore Collections

### Users Collection

Stores user account information and profile data in Firestore.

#### Schema

```javascript
// Firestore User Document
{
  uid: String,                // Firebase Auth UID
  email: String,              // User's email address
  displayName: String,        // User's display name
  photoURL: String,           // Profile photo URL
  phoneNumber: String,        // User's phone number (optional)
  location: String,           // User's general location
  createdAt: Timestamp,       // Account creation date
  lastLogin: Timestamp,       // Last login timestamp
  emailVerified: Boolean,     // Whether email is verified
  provider: String,           // Authentication provider (email, google)
  role: String,               // User role (customer, admin, salonOwner)
  termsAccepted: Boolean,     // Whether terms were accepted
  termsAcceptedAt: Timestamp, // When terms were accepted
  settings: {                 // User preferences
    notifications: {
      email: Boolean,         // Email notification preference
      sms: Boolean,           // SMS notification preference
      app: Boolean            // In-app notification preference
    },
    language: String,         // Preferred language
    theme: String             // UI theme preference
  }
}
```

#### Security Rules

```javascript
// Firestore Security Rules
match /users/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if request.auth != null && request.auth.uid == userId;
  allow read, write: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

## MongoDB Models

### User Model (Lightweight Mirror)

A lightweight version of the user profile is maintained in MongoDB for ease of reference from other collections.

```javascript
// MongoDB Schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'salonOwner', 'admin'],
    default: 'customer'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
```

### Salon Model

Stores information about salon businesses.

```javascript
// MongoDB Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Service Category Schema (Embedded)
const serviceCategorySchema = new Schema({
  name: {
    type: String,
    required: true
  }
}, { _id: true });

// Service Schema (Embedded)
const serviceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceCategory'
  }
}, { _id: true });

// Operating Hours Schema (Embedded)
const hoursSchema = new Schema({
  open: {
    type: String,
    required: true
  },
  close: {
    type: String,
    required: true
  }
});

// Salon Schema
const salonSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  ownerId: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  phoneNumber: {
    type: String
  },
  email: {
    type: String
  },
  website: {
    type: String
  },
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
  images: [String],
  hours: {
    monday: hoursSchema,
    tuesday: hoursSchema,
    wednesday: hoursSchema,
    thursday: hoursSchema,
    friday: hoursSchema,
    saturday: hoursSchema,
    sunday: hoursSchema
  },
  serviceCategories: [serviceCategorySchema],
  services: [serviceSchema],
  amenities: [String],
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  }
}, { timestamps: true });

// Index for geospatial queries
salonSchema.index({ 'location.coordinates': '2dsphere' });
// Index for popular salons
salonSchema.index({ rating: -1, reviewCount: -1 });
// Index for filtering by tags
salonSchema.index({ tags: 1 });

const Salon = mongoose.model('Salon', salonSchema);
module.exports = Salon;
```

### Salonist (Stylist) Model

Stores information about stylists.

```javascript
// MongoDB Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Time Range Schema (Embedded)
const timeRangeSchema = new Schema({
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  }
});

// Salonist Schema
const salonistSchema = new Schema({
  salonId: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  photoURL: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  specialties: [String],
  experience: {
    type: Number,
    default: 0
  },
  services: [{
    type: Schema.Types.ObjectId
  }],
  availability: {
    monday: [timeRangeSchema],
    tuesday: [timeRangeSchema],
    wednesday: [timeRangeSchema],
    thursday: [timeRangeSchema],
    friday: [timeRangeSchema],
    saturday: [timeRangeSchema],
    sunday: [timeRangeSchema]
  },
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
  status: {
    type: String,
    enum: ['active', 'inactive', 'on leave'],
    default: 'active'
  }
}, { timestamps: true });

// Indexes
salonistSchema.index({ salonId: 1 });
salonistSchema.index({ services: 1 });
salonistSchema.index({ status: 1 });

const Salonist = mongoose.model('Salonist', salonistSchema);
module.exports = Salonist;
```

### Booking Model

Stores appointment booking information.

```javascript
// MongoDB Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Service Booking Schema (Embedded)
const serviceBookingSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }
});

// Booking Schema
const bookingSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  salonId: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  salonistId: {
    type: Schema.Types.ObjectId,
    ref: 'Salonist',
    required: true
  },
  services: [serviceBookingSchema],
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'confirmed'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  paymentMethod: {
    type: String
  },
  notes: {
    type: String
  },
  cancellationReason: {
    type: String
  }
}, { timestamps: true });

// Indexes
bookingSchema.index({ userId: 1, date: 1 });
bookingSchema.index({ salonId: 1, salonistId: 1, date: 1 });
bookingSchema.index({ status: 1, date: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
```

### Leave Model

Stores information about stylist leaves and time off.

```javascript
// MongoDB Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
  salonistId: {
    type: Schema.Types.ObjectId,
    ref: 'Salonist',
    required: true
  },
  salonId: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  type: {
    type: String,
    enum: ['vacation', 'sick', 'personal', 'blocked'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  allDay: {
    type: Boolean,
    default: true
  },
  reason: {
    type: String
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: String
  }
}, { timestamps: true });

// Indexes
leaveSchema.index({ salonistId: 1, startDate: 1 });
leaveSchema.index({ status: 1 });

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
```

### Payment Model

Stores payment transaction information.

```javascript
// MongoDB Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd'
  },
  status: {
    type: String,
    enum: ['succeeded', 'pending', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntent: {
    type: String
  },
  paymentMethod: {
    type: String
  },
  receiptUrl: {
    type: String
  },
  refundReason: {
    type: String
  },
  metadata: {
    type: Object
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

// Indexes
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
```

## Database Relationships

The following diagram illustrates the key relationships between collections:

```
Firebase Auth/Firestore         MongoDB Collections
-------------------             -------------------
       User ─────────────────┐  User (mirror)
                             │      │
                             │      ▼
                             └─► Bookings ──── Payments
                                    │
                                    │
                                    ▼
                              Salon ─────── Salonists
                                │              │
                                │              │
                                ▼              ▼
                             Services        Leaves
```

## Data Synchronization

Since the application uses both Firestore (for user profiles) and MongoDB (for all other data), we need a synchronization strategy for user data.

### User Data Sync

```javascript
/**
 * Synchronizes essential user data from Firestore to MongoDB
 * This is called when a user logs in, registers, or updates their profile
 */
const syncUserToMongoDB = async (uid) => {
  try {
    // Get user data from Firestore
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    const userData = userDoc.data();
    
    // Find or update user in MongoDB
    const mongoUser = await User.findOneAndUpdate(
      { uid },
      {
        uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role || 'customer',
        emailVerified: userData.emailVerified
      },
      { upsert: true, new: true }
    );
    
    return mongoUser;
  } catch (error) {
    console.error('Error syncing user to MongoDB:', error);
    throw error;
  }
};
```

## Querying Patterns

### Common Queries with MongoDB

1. **Get all salons with filtering**
   ```javascript
   // MongoDB query
   const getSalons = async (filters = {}, page = 1, limit = 20) => {
     const query = {};
     
     if (filters.city) {
       query['location.city'] = filters.city;
     }
     
     if (filters.service) {
       query['services.name'] = { $regex: filters.service, $options: 'i' };
     }
     
     const options = {
       skip: (page - 1) * limit,
       limit,
       sort: { rating: -1 }
     };
     
     const [salons, total] = await Promise.all([
       Salon.find(query, null, options),
       Salon.countDocuments(query)
     ]);
     
     return {
       salons,
       pagination: {
         total,
         pages: Math.ceil(total / limit),
         page,
         limit
       }
     };
   };
   ```

2. **Get available stylists for a date**
   ```javascript
   // MongoDB query
   const getAvailableStylists = async (salonId, date) => {
     // Find all stylists at the salon
     const stylists = await Salonist.find({
       salonId,
       status: 'active'
     });
     
     // Find all bookings for the date
     const dayStart = new Date(date);
     const dayEnd = new Date(date);
     dayEnd.setHours(23, 59, 59);
     
     const bookings = await Booking.find({
       salonId,
       date: { $gte: dayStart, $lte: dayEnd },
       status: { $in: ['confirmed', 'rescheduled'] }
     });
     
     // Find all leaves for the date
     const leaves = await Leave.find({
       salonId,
       $or: [
         { startDate: { $lte: dayEnd }, endDate: { $gte: dayStart } }
       ],
       status: 'approved'
     });
     
     // Filter available stylists
     const availableStylists = stylists.filter(stylist => {
       // Check if stylist has any leaves on this date
       const onLeave = leaves.some(leave => 
         leave.salonistId.toString() === stylist._id.toString()
       );
       
       if (onLeave) return false;
       
       // Get day of week
       const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayStart.getDay()];
       
       // Check if stylist works on this day
       return stylist.availability[dayOfWeek] && stylist.availability[dayOfWeek].length > 0;
     });
     
     return availableStylists;
   };
   ```

3. **Get user's upcoming bookings**
   ```javascript
   // MongoDB query
   const getUpcomingBookings = async (userId) => {
     const today = new Date();
     
     return Booking.find({
       userId,
       date: { $gte: today },
       status: { $in: ['confirmed', 'rescheduled'] }
     })
     .sort({ date: 1 })
     .populate('salonId', 'name address')
     .populate('salonistId', 'name photoURL');
   };
   ```

## Performance Optimizations

1. **Indexing Strategy**

   All MongoDB models include appropriate indexes for common query patterns:
   - Single field indexes for frequent filters (status, userId)
   - Compound indexes for common query combinations (salonId + date)
   - Geospatial indexes for location-based queries
   - Text indexes for search functionality

2. **Denormalization**

   Some data is denormalized across collections to minimize the need for complex joins:
   - Service information is duplicated in bookings
   - Basic salon info is duplicated in stylists 

3. **Projection**

   Use projection to limit returned fields in queries:
   ```javascript
   Salon.find({}, 'name location.city rating images')
   ```

4. **Batch Operations**

   Use bulk operations for better performance:
   ```javascript
   // Batch insert example
   const bulkOps = stylists.map(stylist => ({
     insertOne: {
       document: stylist
     }
   }));
   
   await Salonist.bulkWrite(bulkOps);
   ```

## Data Migration Strategy

### Migrating from Mock Data to MongoDB

The current implementation uses mock data in JavaScript files. Migration to MongoDB should follow these steps:

```javascript
const migrateSalonsToMongoDB = async () => {
  try {
    const mockSalons = require('../data/mockSalons');
    
    // First, clean up existing data
    await Salon.deleteMany({});
    
    // Convert mock data to MongoDB model format
    const salonDocs = mockSalons.map(salon => ({
      name: salon.name,
      description: salon.description,
      ownerId: salon.ownerId,
      location: {
        address: salon.address,
        city: salon.city,
        state: salon.state,
        zip: salon.zip,
        coordinates: {
          type: 'Point',
          coordinates: [salon.longitude, salon.latitude]
        }
      },
      rating: salon.rating,
      reviewCount: salon.reviewCount,
      images: salon.images,
      hours: salon.hours,
      services: salon.services,
      serviceCategories: salon.categories,
      amenities: salon.amenities,
      tags: salon.tags,
      status: 'active'
    }));
    
    // Insert in batches
    const batchSize = 100;
    for (let i = 0; i < salonDocs.length; i += batchSize) {
      const batch = salonDocs.slice(i, i + batchSize);
      await Salon.insertMany(batch);
    }
    
    console.log(`Migrated ${salonDocs.length} salons to MongoDB`);
  } catch (error) {
    console.error('Error migrating salons to MongoDB:', error);
    throw error;
  }
};
```

## Access Control

Since we're using MongoDB instead of Firestore for most collections, we need to implement access control in our application code rather than using Firestore security rules.

### Access Control Implementation

```javascript
// Example middleware for controlling access to salon data
const canAccessSalon = async (req, res, next) => {
  try {
    const { salonId } = req.params;
    const { uid } = req.user;
    
    // Public read access for salon data
    if (req.method === 'GET') {
      return next();
    }
    
    // Only salon owner or admin can modify salon data
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' });
    }
    
    // Check if user is the salon owner
    if (salon.ownerId === uid) {
      return next();
    }
    
    // Check if user is an admin
    const user = await User.findOne({ uid });
    if (user && user.role === 'admin') {
      return next();
    }
    
    return res.status(403).json({ error: 'Insufficient permissions' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
```

## Validation

MongoDB models include validation using Mongoose schema validation:

```javascript
const salonSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Salon name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  // ...other fields with validation
});
```

## MongoDB Configuration

### Connection Setup

```javascript
// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Environment Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/evercut
MONGODB_TEST_URI=mongodb+srv://username:password@cluster.mongodb.net/evercut_test
``` 