# EverCut API Documentation

This document provides details on all available API endpoints for the EverCut application. Use this as a reference for testing with Postman.

## Base URL

```
http://localhost:5000
```

## Authentication

Most endpoints require authentication using Firebase Authentication. Include the following header with your requests:

```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

To get a token for testing, you can use the Firebase Authentication SDK in your client application.

## Health Check

### Check API Status

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "environment": "development"
}
```

## User Routes

### Get Current User Profile

```
GET /api/users/me
```

Headers:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

Response:
```json
{
  "success": true,
  "data": {
    "uid": "user123",
    "email": "user@example.com",
    "emailVerified": true,
    "displayName": "John Doe"
  }
}
```

### Update Current User Profile

```
PUT /api/users/me
```

Headers:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "displayName": "Updated Name",
  "phoneNumber": "123-456-7890"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "uid": "user123",
    "displayName": "Updated Name",
    "phoneNumber": "123-456-7890",
    "updatedAt": "2023-12-15T12:00:00.000Z"
  }
}
```

## Salon Routes

### Get All Salons

```
GET /api/salons
```

Query Parameters:
- `location` (optional): Filter by city
- `rating` (optional): Filter by minimum rating

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "salon1",
      "name": "Elegant Cuts",
      "description": "Premium salon services",
      "address": {
        "city": "New York",
        "state": "NY",
        "street": "123 Broadway",
        "zipCode": "10001",
        "country": "USA"
      },
      "rating": 4.8
    },
    {
      "id": "salon2",
      "name": "Style Studio",
      "description": "Modern styling for everyone",
      "address": {
        "city": "Los Angeles",
        "state": "CA",
        "street": "456 Hollywood Blvd",
        "zipCode": "90028",
        "country": "USA"
      },
      "rating": 4.5
    }
  ]
}
```

### Get Salon by ID

```
GET /api/salons/:id
```

Path Parameters:
- `id`: Salon ID

Response:
```json
{
  "success": true,
  "data": {
    "id": "salon1",
    "name": "Elegant Cuts",
    "description": "Premium salon services",
    "address": {
      "city": "New York",
      "state": "NY",
      "street": "123 Broadway",
      "zipCode": "10001",
      "country": "USA"
    },
    "rating": 4.8,
    "contactPhone": "123-456-7890",
    "contactEmail": "info@elegantcuts.com"
  }
}
```

### Create New Salon

```
POST /api/salons
```

Headers:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "name": "New Salon",
  "description": "A brand new salon",
  "address": {
    "street": "789 Main St",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601",
    "country": "USA"
  },
  "contactPhone": "555-123-4567",
  "contactEmail": "info@newsalon.com",
  "operatingHours": [
    {
      "day": 1,
      "open": "09:00",
      "close": "18:00"
    },
    {
      "day": 2,
      "open": "09:00",
      "close": "18:00"
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "salon3",
    "name": "New Salon",
    "description": "A brand new salon",
    "address": {
      "street": "789 Main St",
      "city": "Chicago",
      "state": "IL",
      "zipCode": "60601",
      "country": "USA"
    }
  }
}
```

### Get Salon Services

```
GET /api/salons/:id/services
```

Path Parameters:
- `id`: Salon ID

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "service1",
      "name": "Haircut",
      "price": 30,
      "duration": 30
    },
    {
      "id": "service2",
      "name": "Hair Coloring",
      "price": 60,
      "duration": 60
    }
  ]
}
```

### Get Salon Stylists

```
GET /api/salons/:id/stylists
```

Path Parameters:
- `id`: Salon ID

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "stylist1",
      "name": "John Doe",
      "specialties": ["Haircut", "Styling"]
    },
    {
      "id": "stylist2",
      "name": "Jane Smith",
      "specialties": ["Hair Coloring", "Styling"]
    }
  ]
}
```

## Booking Routes

### Create Booking

```
POST /api/bookings
```

Headers:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "salonId": "salon1",
  "stylistId": "stylist1",
  "serviceId": "service1",
  "date": "2023-12-20T14:00:00.000Z",
  "notes": "First time customer"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "booking1",
    "salonId": "salon1",
    "stylistId": "stylist1",
    "serviceId": "service1",
    "date": "2023-12-20T14:00:00.000Z",
    "status": "confirmed",
    "price": 30,
    "paymentStatus": "pending",
    "notes": "First time customer",
    "createdAt": "2023-12-15T12:00:00.000Z"
  }
}
```

### Get User Bookings

```
GET /api/bookings
```

Headers:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

Query Parameters:
- `status` (optional): Filter by booking status (confirmed, cancelled, completed)

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "booking1",
      "salonId": "salon1",
      "stylistId": "stylist1",
      "serviceId": "service1",
      "date": "2023-12-20T14:00:00.000Z",
      "status": "confirmed",
      "price": 30,
      "paymentStatus": "pending"
    },
    {
      "id": "booking2",
      "salonId": "salon2",
      "stylistId": "stylist2",
      "serviceId": "service2",
      "date": "2023-12-25T15:00:00.000Z",
      "status": "confirmed",
      "price": 60,
      "paymentStatus": "pending"
    }
  ]
}
```

### Get Booking by ID

```
GET /api/bookings/:id
```

Headers:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

Path Parameters:
- `id`: Booking ID

Response:
```json
{
  "success": true,
  "data": {
    "id": "booking1",
    "salonId": "salon1",
    "stylistId": "stylist1",
    "serviceId": "service1",
    "date": "2023-12-20T14:00:00.000Z",
    "status": "confirmed",
    "price": 30,
    "paymentStatus": "pending",
    "notes": "First time customer",
    "createdAt": "2023-12-15T12:00:00.000Z"
  }
}
```

### Update Booking

```
PUT /api/bookings/:id
```

Headers:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
Content-Type: application/json
```

Path Parameters:
- `id`: Booking ID

Body:
```json
{
  "date": "2023-12-21T16:00:00.000Z",
  "notes": "Rescheduled appointment"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "booking1",
    "salonId": "salon1",
    "stylistId": "stylist1",
    "serviceId": "service1",
    "date": "2023-12-21T16:00:00.000Z",
    "status": "confirmed",
    "price": 30,
    "paymentStatus": "pending",
    "notes": "Rescheduled appointment",
    "updatedAt": "2023-12-15T14:00:00.000Z"
  }
}
```

### Cancel Booking

```
DELETE /api/bookings/:id
```

Headers:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

Path Parameters:
- `id`: Booking ID

Response:
```json
{
  "success": true,
  "data": {
    "id": "booking1",
    "status": "cancelled",
    "updatedAt": "2023-12-15T14:30:00.000Z"
  }
}
```

## Payment Routes

### Create Payment Intent

```
POST /api/payments/create-payment-intent
```

Headers:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "bookingId": "booking1",
  "amount": 3000
}
```

Response:
```json
{
  "success": true,
  "clientSecret": "test_client_secret"
}
```

### Stripe Webhook (Server-to-Server)

```
POST /api/payments/webhook
```

Headers:
```
Content-Type: application/json
Stripe-Signature: YOUR_STRIPE_SIGNATURE
```

Body: Stripe Event Object

Response:
```json
{
  "received": true
}
```

## Protected Routes

### Get User Profile (Protected)

```
GET /api/user/profile
```

Headers:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

Response:
```json
{
  "success": true,
  "data": {
    "uid": "user123",
    "email": "user@example.com",
    "emailVerified": true,
    "displayName": "John Doe"
  }
}
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

Common HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
