# EverCut Backend Architecture

This document provides a comprehensive overview of the EverCut backend architecture, explaining how the authentication middleware, API routes, and database models work together to create a robust and scalable system.

## Architecture Overview

EverCut uses a modern, decoupled architecture with a secure and scalable backend that leverages Firebase services for authentication and user profiles while using MongoDB for core application data.

### High-Level Architecture

```
Frontend (React) ───────┐              ┌───── Firebase Services
                        │              │       ├── Authentication
                        ▼              │       └── Firestore (Users only)
                API Gateway            │
                        │              │       ┌───── MongoDB
                        │              │       │      ├── Salons
                        │              │       │      ├── Salonists
                        │              │       │      ├── Bookings
                        │              │       │      ├── Payments
                        ▼              ▼       ▼      └── etc.
        ┌───────────────────────────────────────────────┐
        │                Backend Server                 │
        │  ┌─────────┐  ┌─────────┐  ┌────────────────┐ │
        │  │   Auth  │  │   API   │  │ Data Services  │ │
        │  │Middleware│  │ Routes  │  │ └── Firebase  │ │
        │  └─────────┘  └─────────┘  │ └── MongoDB   │ │
        │                            └────────────────┘ │
        └───────────────────────────────────────────────┘
```

### Key Components

1. **Authentication System**: Firebase Authentication with custom middleware for route protection
2. **Dual Database Approach**:
   - **Firestore**: For user profiles and authentication-related data
   - **MongoDB**: For all other application data (salons, stylists, bookings, etc.)
3. **API Layer**: Express.js REST API with controllers and services
4. **Business Logic**: Service layer for domain operations

## Authentication Flow

### User Authentication

1. Users authenticate through Firebase Auth on the frontend (email/password or Google OAuth)
2. Frontend stores authentication tokens in memory/local storage
3. Tokens are included in API requests as Bearer tokens
4. Backend middleware verifies tokens before granting access to protected routes

### Token Verification Process

```
Client Request                Express Server
     │                              │
     │  Authorization: Bearer xyz   │
     │ ─────────────────────────────▶
     │                              │
     │                              │  verifyFirebaseToken
     │                              │ ◀──────────────────▶ Firebase Admin SDK
     │                              │
     │                              │  (if verified)
     │                              │  Attach user data to request
     │                              │
     │                              │  Continue to route handler
     │                              │  or return error
     │                              │
     │      Response (200/401)      │
     │ ◀─────────────────────────────
```

## API Structure

The backend API is organized by domain resources, following RESTful principles:

```
/api/v1/
├── /salons             # Salon management
├── /salonists          # Stylist management
├── /bookings           # Booking operations
├── /scheduling         # Availability and time management
├── /payments           # Payment processing
└── /users              # User profile management
```

### Request Processing Flow

```
Client Request → API Gateway → Auth Middleware → Route Handler → Controller → Service → Database → Response
```

## Database Design

### Hybrid Database Architecture

EverCut uses a hybrid database approach combining Firebase and MongoDB:

```
Firebase Services                MongoDB Database
├── Authentication               ├── salons/             # Salon information
└── Firestore                    ├── salonists/          # Stylist profiles
    └── users/                   ├── bookings/           # Appointment bookings
                                 ├── services/           # Service definitions
                                 ├── leaves/             # Time-off periods
                                 ├── payments/           # Payment transactions
                                 └── users/              # Mirror of essential user data
```

### User Data Synchronization

Since user profiles are stored in Firestore while application data is in MongoDB, we implement a synchronization strategy:

```javascript
// Example of data synchronization between Firestore and MongoDB
const syncUserToMongoDB = async (uid) => {
  // Get user data from Firestore
  const db = admin.firestore();
  const userDoc = await db.collection('users').doc(uid).get();
  
  if (!userDoc.exists) {
    return null;
  }
  
  const userData = userDoc.data();
  
  // Create or update lightweight user record in MongoDB
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
};
```

### Data Flow Between Components

```
┌──────────────┐      ┌─────────────┐      ┌───────────────┐
│ API Routes   │ ───▶ │ Controllers │ ───▶ │ Data Services │
└──────────────┘      └─────────────┘      └───────────────┘
       ▲                                           │
       │                                           ▼
       │                                  ┌─────────────────┐
       │                                  │  Firestore for  │
       │                                  │  User Profiles  │
       │                                  └─────────────────┘
       │                                           │
       │                                           ▼
       │                                  ┌─────────────────┐
       └──────────────────────────────── │  MongoDB for    │
                                         │  App Data       │
                                         └─────────────────┘
```

## Key Features Implementation

### Booking System

1. **Service Selection**: Users select services from salon catalog
2. **Stylist Selection**: Available stylists are filtered based on service and date
3. **Date/Time Selection**: Available time slots calculated based on:
   - Stylist's regular availability
   - Existing bookings
   - Approved time-off/leaves
4. **Booking Creation**: Creates booking record with status "pending"
5. **Payment Processing**: Integrates with Stripe for payment handling
6. **Confirmation**: Updates booking status to "confirmed" after payment

### Availability Engine

The availability system combines several data points to determine when stylists are available:

1. **Regular Schedule**: Stylist's weekly working hours
2. **Existing Bookings**: Already booked time slots
3. **Time Off/Leaves**: Vacation, sick time, or blocked periods
4. **Salon Hours**: Operating hours of the salon

```javascript
// Pseudocode for availability calculation using MongoDB
function getAvailableTimeSlots(salonistId, date, serviceDuration) {
  // Get stylist's regular availability pattern for this day of week
  const salonist = await Salonist.findById(salonistId);
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
  const regularAvailability = salonist.availability[dayOfWeek];
  
  // Get existing bookings for this date
  const existingBookings = await Booking.find({
    salonistId,
    date: {
      $gte: startOfDay(date),
      $lte: endOfDay(date)
    },
    status: { $in: ['confirmed', 'rescheduled'] }
  });
  
  // Get approved leaves
  const leaves = await Leave.find({
    salonistId,
    startDate: { $lte: endOfDay(date) },
    endDate: { $gte: startOfDay(date) },
    status: 'approved'
  });
  
  // Get salon hours
  const salon = await Salon.findById(salonist.salonId);
  const salonHours = salon.hours[dayOfWeek];
  
  // Generate available time slots based on all constraints
  let availableSlots = generateTimeSlots(regularAvailability, serviceDuration);
  availableSlots = removeConflictingSlots(availableSlots, existingBookings);
  availableSlots = removeConflictingSlots(availableSlots, leaves);
  availableSlots = filterSlotsWithinHours(availableSlots, salonHours);
  
  return availableSlots;
}
```

## Security Implementation

### Authentication Security

1. **Token Validation**: All tokens verified with Firebase Admin SDK
2. **Role-Based Access**: Different permissions for customers, salon owners, and admins
3. **Resource-Based Access**: Owners can only modify their own salons and salonists

### API Security

1. **Input Validation**: All requests validated before processing
2. **Rate Limiting**: Prevents abuse through request throttling
3. **HTTPS Only**: Secure transport for all API communication
4. **CORS Protection**: Configured to allow only trusted origins

### Database Security

1. **Firestore Rules**: Fine-grained access control for user documents
2. **MongoDB Access Control**: Implemented through application-level middleware
3. **Data Validation**: Schema validation on write operations
4. **Principle of Least Privilege**: Minimal permissions needed for operations

## Error Handling Strategy

The backend implements a consistent error handling approach:

1. **Structured Error Responses**: Consistent format for all errors
2. **Error Codes**: Specific codes for different error types
3. **Logging**: All errors logged for monitoring and debugging
4. **Graceful Degradation**: System remains functional even with partial failures

```javascript
// Example of centralized error handler
const errorHandler = (err, req, res, next) => {
  // Log error for internal monitoring
  console.error('API Error:', err);
  
  // MongoDB-specific error handling
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    });
  }
  
  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: 'Duplicate entry',
        field: Object.keys(err.keyValue)[0]
      }
    });
  }
  
  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Format response
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
};
```

## Performance Optimization

### Database Optimization

1. **MongoDB Indexing**: Strategic indexes for common query patterns
2. **Denormalization**: Strategic data duplication for read efficiency
3. **Batch Operations**: Group writes for better performance
4. **Query Optimization**: Limit fields and document count in queries

### API Optimization

1. **Pagination**: All list endpoints support pagination
2. **Caching**: Response caching for frequently accessed resources
3. **Compression**: gzip/deflate compression for response payloads
4. **Field Selection**: Support for selecting specific fields in responses

## Scalability Considerations

The architecture is designed for horizontal scalability:

1. **Stateless Design**: All API requests are independent and can be load-balanced
2. **Firebase Scalability**: Leverages Firebase's built-in scaling for authentication
3. **MongoDB Scalability**: Supports sharding and replica sets for scaling
4. **Service Isolation**: Independent services can scale separately
5. **Future Microservices Path**: Architecture supports breaking into microservices

## Integration Points

### Frontend Integration

The backend integrates with the frontend through:

1. **REST API**: Well-defined endpoints for all operations
2. **Authentication**: Firebase Auth token management
3. **Real-time Updates**: Potential for real-time booking updates

### External Integrations

1. **Stripe**: Payment processing integration
2. **Email Service**: Notification emails for bookings and updates
3. **SMS Gateway**: Optional SMS notifications (planned)

## Deployment Strategy

The backend is designed for deployment on modern cloud platforms:

1. **Containerization**: Docker-based deployment
2. **Serverless Option**: Can be deployed as serverless functions
3. **CI/CD Pipeline**: Automated testing and deployment
4. **Environment Separation**: Dev, staging, and production environments

## Development Workflow

### Code Organization

```
server/
├── src/
│   ├── config/             # Configuration files
│   │   ├── firebase-admin.js
│   │   ├── mongodb.js
│   │   └── ...
│   ├── middleware/         # Express middleware
│   │   ├── auth.middleware.js
│   │   └── ...
│   ├── controllers/        # Request handlers
│   │   ├── salon.controller.js
│   │   └── ...
│   ├── services/           # Business logic
│   │   ├── salon.service.js
│   │   └── ...
│   ├── models/             # Data models
│   │   ├── mongoose/       # MongoDB models
│   │   │   ├── salon.model.js
│   │   │   └── ...
│   │   └── firestore/      # Firestore schemas (TypeScript interfaces)
│   │       └── user.model.ts
│   ├── routes/             # API routes
│   │   ├── salon.routes.js
│   │   └── ...
│   ├── utils/              # Utility functions
│   │   ├── errors.js
│   │   └── ...
│   └── app.js              # Main application file
├── tests/                  # Test files
└── package.json            # Dependencies and scripts
```

### Best Practices

1. **Code Style**: Consistent formatting and naming conventions
2. **Documentation**: JSDocs for all functions and API endpoints
3. **Testing**: Unit and integration tests for all components
4. **Version Control**: Feature branches and pull requests
5. **Code Reviews**: Mandatory review before merging

## Monitoring and Logging

### Monitoring Strategy

1. **Health Checks**: Endpoints to verify system health
2. **Performance Metrics**: Track response times and resource usage
3. **Error Tracking**: Monitor error rates and types
4. **Usage Analytics**: Track API usage patterns

### Logging

1. **Structured Logging**: JSON-formatted logs for easier parsing
2. **Log Levels**: Different severity levels (debug, info, warn, error)
3. **Request Logging**: Log all incoming requests and responses
4. **Error Logging**: Detailed error information for troubleshooting

## Conclusion

The EverCut backend architecture provides a solid foundation for a modern salon booking application. By leveraging Firebase services for authentication and user profiles while using MongoDB for core application data, the system achieves a balance of security, scalability, and developer productivity.

The hybrid database approach offers the best of both worlds - Firebase's seamless authentication and user management with MongoDB's flexibility and powerful querying capabilities for business data.

The architecture is designed to evolve with the application's needs, supporting additional features and scaling to handle increased load as the user base grows. 