/**
 * Firestore Data Models
 * 
 * These are not actual schema definitions since Firestore is schemaless,
 * but they serve as documentation for the expected data structure.
 */

/**
 * User Model
 * Collection: 'users'
 */
const UserModel = {
  uid: String,                // Firebase Auth UID
  email: String,              // User email
  displayName: String,        // User display name
  photoURL: String,           // Profile picture URL
  emailVerified: Boolean,     // Email verification status
  provider: String,           // Auth provider (email/password, google, etc.)
  location: String,           // User location
  termsAccepted: Boolean,     // Terms acceptance status
  termsAcceptedAt: Timestamp, // Terms acceptance timestamp
  createdAt: Timestamp,       // Account creation timestamp
  lastSeen: Timestamp,        // Last activity timestamp
  phoneNumber: String,        // Optional phone number
  preferences: {              // User preferences
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    },
    theme: String             // UI theme preference
  }
};

/**
 * Salon Model
 * Collection: 'salons'
 */
const SalonModel = {
  id: String,                 // Salon ID
  name: String,               // Salon name
  description: String,        // Salon description
  address: {                  // Salon address
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {            // Geolocation for maps
      latitude: Number,
      longitude: Number
    }
  },
  contact: {                  // Contact information
    phone: String,
    email: String,
    website: String
  },
  businessHours: [            // Operating hours
    {
      day: Number,            // 0-6 (Sunday-Saturday)
      open: String,           // HH:MM format
      close: String,          // HH:MM format
      isClosed: Boolean       // If salon is closed on this day
    }
  ],
  services: [String],         // References to service IDs
  stylists: [String],         // References to stylist IDs
  photos: [String],           // Photo URLs
  rating: Number,             // Average rating
  reviewCount: Number,        // Number of reviews
  createdAt: Timestamp,       // Creation timestamp
  updatedAt: Timestamp        // Last update timestamp
};

/**
 * Service Model
 * Collection: 'services'
 */
const ServiceModel = {
  id: String,                 // Service ID
  salonId: String,            // Reference to salon
  name: String,               // Service name
  description: String,        // Service description
  duration: Number,           // Duration in minutes
  price: Number,              // Price in cents
  category: String,           // Service category
  photos: [String],           // Photo URLs
  isActive: Boolean,          // Whether service is currently offered
  createdAt: Timestamp,       // Creation timestamp
  updatedAt: Timestamp        // Last update timestamp
};

/**
 * Stylist Model
 * Collection: 'stylists'
 */
const StylistModel = {
  id: String,                 // Stylist ID
  salonId: String,            // Reference to salon
  name: String,               // Stylist name
  bio: String,                // Stylist biography
  specialties: [String],      // Areas of expertise
  photo: String,              // Profile photo URL
  services: [String],         // Services offered (references)
  availability: [             // Working hours
    {
      day: Number,            // 0-6 (Sunday-Saturday)
      slots: [
        {
          start: String,      // HH:MM format
          end: String         // HH:MM format
        }
      ]
    }
  ],
  rating: Number,             // Average rating
  reviewCount: Number,        // Number of reviews
  isActive: Boolean,          // Whether stylist is currently working
  createdAt: Timestamp,       // Creation timestamp
  updatedAt: Timestamp        // Last update timestamp
};

/**
 * Booking Model
 * Collection: 'bookings'
 */
const BookingModel = {
  id: String,                 // Booking ID
  userId: String,             // Reference to user
  salonId: String,            // Reference to salon
  stylistId: String,          // Reference to stylist
  serviceId: String,          // Reference to service
  date: Timestamp,            // Appointment date and time
  duration: Number,           // Duration in minutes
  status: String,             // Status (confirmed, cancelled, completed)
  price: Number,              // Price in cents
  paymentStatus: String,      // Payment status
  paymentId: String,          // Reference to payment
  notes: String,              // Customer notes
  createdAt: Timestamp,       // Creation timestamp
  updatedAt: Timestamp        // Last update timestamp
};

/**
 * Review Model
 * Collection: 'reviews'
 */
const ReviewModel = {
  id: String,                 // Review ID
  userId: String,             // Reference to user
  salonId: String,            // Reference to salon
  stylistId: String,          // Optional reference to stylist
  serviceId: String,          // Optional reference to service
  bookingId: String,          // Reference to booking
  rating: Number,             // Rating (1-5)
  comment: String,            // Review text
  photos: [String],           // Photo URLs
  createdAt: Timestamp,       // Creation timestamp
  updatedAt: Timestamp        // Last update timestamp
};

module.exports = {
  UserModel,
  SalonModel,
  ServiceModel,
  StylistModel,
  BookingModel,
  ReviewModel
};