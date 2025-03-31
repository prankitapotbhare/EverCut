# API Routes Documentation

This document outlines the API routes available in the EverCut backend. The application uses Firebase Authentication for user management and MongoDB for data storage (except user profiles, which are stored in Firestore).

## API Base URL

All API endpoints are prefixed with: `/api/v1`

## Authentication

Most endpoints require authentication via Firebase. The authentication middleware validates the Firebase JWT token and attaches the user information to the request object.

Include the Firebase authentication token in the request headers:

```
Authorization: Bearer [Firebase_JWT_Token]
```

## Response Format

All API responses follow a standard format:

```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Optional success message"
}
```

For errors:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Standard HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Authenticated but not authorized for the resource
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Routes Overview

### Salon Routes

#### Get All Salons
```
GET /api/v1/salons
```
- **Description**: Retrieves a list of salons with optional filtering
- **Auth Required**: No
- **Query Parameters**:
  - `city`: Filter by city (string)
  - `service`: Filter by service name (string)
  - `tags`: Filter by tags (array)
  - `rating`: Minimum rating (number)
  - `page`: Page number for pagination (default: 1)
  - `limit`: Results per page (default: 20)
- **Implementation**:
  - Uses MongoDB query with pagination
  - Returns salon details with counts

#### Get Salon by ID
```
GET /api/v1/salons/:salonId
```
- **Description**: Retrieves detailed information about a specific salon
- **Auth Required**: No
- **Implementation**:
  - Fetches salon by ID from MongoDB
  - Includes services, categories, and basic stylist information

#### Create Salon
```
POST /api/v1/salons
```
- **Description**: Creates a new salon
- **Auth Required**: Yes (requires salon owner or admin role)
- **Request Body**: Salon details (name, location, services, etc.)
- **Implementation**:
  - Validates request data
  - Creates salon document in MongoDB
  - Links salon to owner's UID (from Firebase Auth)

#### Update Salon
```
PUT /api/v1/salons/:salonId
```
- **Description**: Updates an existing salon
- **Auth Required**: Yes (requires salon owner or admin role)
- **Request Body**: Updated salon details
- **Implementation**:
  - Verifies ownership via MongoDB-stored ownerId matching Firebase UID
  - Validates and updates salon document

#### Delete Salon
```
DELETE /api/v1/salons/:salonId
```
- **Description**: Deletes a salon
- **Auth Required**: Yes (requires salon owner or admin role)
- **Implementation**:
  - Verifies ownership/admin status
  - Performs soft delete (status update) rather than hard delete

### Salonist (Stylist) Routes

#### Get Salonists by Salon
```
GET /api/v1/salons/:salonId/salonists
```
- **Description**: Retrieves all stylists for a specific salon
- **Auth Required**: No
- **Query Parameters**:
  - `service`: Filter by service offered (string)
  - `status`: Filter by status (active, inactive, on leave)
- **Implementation**:
  - Queries MongoDB for salonists with matching salonId
  - Returns salonist details with service information

#### Get Salonist by ID
```
GET /api/v1/salonists/:salonistId
```
- **Description**: Retrieves detailed information about a specific stylist
- **Auth Required**: No
- **Implementation**:
  - Fetches salonist document from MongoDB
  - Includes availability, specialties, and services

#### Create Salonist
```
POST /api/v1/salons/:salonId/salonists
```
- **Description**: Adds a new stylist to a salon
- **Auth Required**: Yes (requires salon owner or admin role)
- **Request Body**: Stylist details (name, specialties, services, availability)
- **Implementation**:
  - Verifies salon ownership
  - Creates salonist document in MongoDB with reference to salon

#### Update Salonist
```
PUT /api/v1/salonists/:salonistId
```
- **Description**: Updates an existing stylist
- **Auth Required**: Yes (requires salon owner or admin role)
- **Request Body**: Updated stylist details
- **Implementation**:
  - Verifies ownership via salon reference
  - Updates salonist document in MongoDB

#### Delete Salonist
```
DELETE /api/v1/salonists/:salonistId
```
- **Description**: Removes a stylist
- **Auth Required**: Yes (requires salon owner or admin role)
- **Implementation**:
  - Verifies ownership/admin status
  - Performs soft delete (status update)

#### Get Available Time Slots
```
GET /api/v1/salonists/:salonistId/availability
```
- **Description**: Gets available time slots for a stylist on a specific date
- **Auth Required**: No
- **Query Parameters**:
  - `date`: Date to check (YYYY-MM-DD)
  - `serviceIds`: IDs of requested services (affects duration)
- **Implementation**:
  - Queries MongoDB for salonist's availability pattern
  - Checks for bookings that might overlap
  - Checks for approved leaves
  - Returns available time slots

### Booking Routes

#### Get User Bookings
```
GET /api/v1/bookings
```
- **Description**: Retrieves all bookings for the authenticated user
- **Auth Required**: Yes
- **Query Parameters**:
  - `status`: Filter by status (confirmed, completed, cancelled, rescheduled)
  - `upcoming`: Boolean to filter only upcoming bookings
  - `page`: Page number
  - `limit`: Results per page
- **Implementation**:
  - Uses MongoDB to query bookings with user's Firebase UID
  - Populates salon and salonist information

#### Get Booking by ID
```
GET /api/v1/bookings/:bookingId
```
- **Description**: Retrieves detailed information about a specific booking
- **Auth Required**: Yes (user must be the booking owner, salon owner, or admin)
- **Implementation**:
  - Verifies user has permissions to access the booking
  - Returns booking details with salon and stylist information

#### Create Booking
```
POST /api/v1/bookings
```
- **Description**: Creates a new booking
- **Auth Required**: Yes
- **Request Body**:
  - `salonId`: ID of the salon
  - `salonistId`: ID of the stylist
  - `services`: Array of service IDs
  - `date`: Booking date
  - `startTime`: Start time
  - `notes`: Optional booking notes
- **Implementation**:
  - Validates booking data (service availability, stylist availability, etc.)
  - Calculates end time based on service durations
  - Creates booking document in MongoDB
  - Creates pending payment record

#### Update Booking Status
```
PATCH /api/v1/bookings/:bookingId/status
```
- **Description**: Updates the status of a booking
- **Auth Required**: Yes (user must be the booking owner, salon owner, or admin)
- **Request Body**:
  - `status`: New status (confirmed, completed, cancelled, rescheduled)
  - `reason`: Reason for status change (required for cancellations)
- **Implementation**:
  - Verifies permissions based on status change requested
  - Updates booking document in MongoDB
  - For rescheduling, validates new time slot
  - For cancellations, handles payment refund process if needed

#### Delete Booking
```
DELETE /api/v1/bookings/:bookingId
```
- **Description**: Deletes a booking (only allowed for admins)
- **Auth Required**: Yes (admin only)
- **Implementation**:
  - Verifies admin status
  - Performs hard delete of booking record

### Service Management Routes

#### Get Services by Salon
```
GET /api/v1/salons/:salonId/services
```
- **Description**: Retrieves all services offered by a salon
- **Auth Required**: No
- **Query Parameters**:
  - `category`: Filter by category (string)
- **Implementation**:
  - Queries MongoDB for salon document
  - Returns services array from salon document

#### Add Service to Salon
```
POST /api/v1/salons/:salonId/services
```
- **Description**: Adds a new service to a salon
- **Auth Required**: Yes (requires salon owner or admin role)
- **Request Body**: Service details (name, description, price, duration, category)
- **Implementation**:
  - Verifies salon ownership
  - Updates salon document in MongoDB to add the service
  - Optionally adds a new service category if specified

#### Update Service
```
PUT /api/v1/salons/:salonId/services/:serviceId
```
- **Description**: Updates an existing service
- **Auth Required**: Yes (requires salon owner or admin role)
- **Request Body**: Updated service details
- **Implementation**:
  - Verifies salon ownership
  - Updates the service within the salon document

#### Delete Service
```
DELETE /api/v1/salons/:salonId/services/:serviceId
```
- **Description**: Removes a service from a salon
- **Auth Required**: Yes (requires salon owner or admin role)
- **Implementation**:
  - Verifies salon ownership
  - Removes the service from the salon document
  - Checks for and updates any salonists offering this service

### Payment Routes

#### Get Payment by ID
```
GET /api/v1/payments/:paymentId
```
- **Description**: Retrieves payment details
- **Auth Required**: Yes (user must be the payment owner, salon owner, or admin)
- **Implementation**:
  - Verifies user has permissions to access the payment
  - Returns payment details from MongoDB

#### Create Payment Intent
```
POST /api/v1/payments/create-intent
```
- **Description**: Creates a payment intent for a booking
- **Auth Required**: Yes
- **Request Body**:
  - `bookingId`: ID of the booking
  - `paymentMethodId`: ID of the payment method (optional)
- **Implementation**:
  - Retrieves booking details from MongoDB
  - Creates payment intent with payment processor
  - Creates or updates payment record in MongoDB

#### Confirm Payment
```
POST /api/v1/payments/confirm
```
- **Description**: Confirms a payment
- **Auth Required**: Yes
- **Request Body**:
  - `paymentIntentId`: ID of the payment intent
- **Implementation**:
  - Verifies payment intent status with payment processor
  - Updates payment record in MongoDB
  - Updates booking payment status

#### Process Refund
```
POST /api/v1/payments/:paymentId/refund
```
- **Description**: Processes a refund for a payment
- **Auth Required**: Yes (requires salon owner or admin role)
- **Request Body**:
  - `amount`: Refund amount (defaults to full amount)
  - `reason`: Reason for refund
- **Implementation**:
  - Verifies permissions
  - Processes refund with payment processor
  - Updates payment and booking records in MongoDB

### User Routes

#### Get User Profile
```
GET /api/v1/users/profile
```
- **Description**: Retrieves the authenticated user's profile
- **Auth Required**: Yes
- **Implementation**:
  - Retrieves user data from Firestore using Firebase UID
  - Returns user profile information

#### Update User Profile
```
PUT /api/v1/users/profile
```
- **Description**: Updates the authenticated user's profile
- **Auth Required**: Yes
- **Request Body**: Updated profile details
- **Implementation**:
  - Validates and updates user document in Firestore
  - Updates MongoDB mirror user document

#### Get Salon Owner Dashboard
```
GET /api/v1/users/dashboard/salon-owner
```
- **Description**: Retrieves dashboard data for salon owners
- **Auth Required**: Yes (requires salon owner role)
- **Implementation**:
  - Queries MongoDB for salon data, bookings, and revenue metrics
  - Aggregates statistics for dashboard display

#### Get Admin Dashboard
```
GET /api/v1/users/dashboard/admin
```
- **Description**: Retrieves dashboard data for administrators
- **Auth Required**: Yes (requires admin role)
- **Implementation**:
  - Queries MongoDB for platform-wide statistics and metrics
  - Aggregates data for admin dashboard

## Webhook Routes

#### Payment Webhooks
```
POST /api/v1/webhooks/payment-processor
```
- **Description**: Processes webhooks from payment processor
- **Auth Required**: No (verified by webhook signature)
- **Implementation**:
  - Verifies webhook signature
  - Processes event based on type (payment_succeeded, payment_failed, etc.)
  - Updates relevant MongoDB records

## Implementation Details

### Controller Structure

Each route is implemented in a controller following the MVC pattern:

```javascript
// Example controller for salon routes
const SalonController = {
  // Get all salons with filtering
  getAllSalons: async (req, res) => {
    try {
      const { page = 1, limit = 20, city, service } = req.query;
      
      // Build MongoDB query
      const query = {};
      if (city) query['location.city'] = city;
      if (service) query['services.name'] = { $regex: service, $options: 'i' };
      
      // Execute query with pagination
      const options = {
        skip: (page - 1) * limit,
        limit: Number(limit),
        sort: { rating: -1 }
      };
      
      const [salons, total] = await Promise.all([
        Salon.find(query, null, options),
        Salon.countDocuments(query)
      ]);
      
      return res.status(200).json({
        success: true,
        data: {
          salons,
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            page: Number(page),
            limit: Number(limit)
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server error',
        message: error.message
      });
    }
  },
  
  // More controller methods...
};
```

### Error Handling

Consistent error handling is implemented across all routes:

```javascript
// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // MongoDB validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry',
      field: Object.keys(err.keyValue)[0]
    });
  }
  
  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server error',
    code: err.code || 'INTERNAL_ERROR'
  });
};
```

### Rate Limiting

Rate limiting is implemented to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// Apply to all routes
app.use('/api/', apiLimiter);
```

## API Versioning

The API uses versioning to ensure backward compatibility:

```javascript
// Routes for API v1
app.use('/api/v1', v1Routes);

// Routes for future API v2
app.use('/api/v2', v2Routes);
``` 