
# API Routes Documentation

## Availability API

### 1. Get Available Salonists

Retrieves all salonists available for a specific date.

**Endpoint:** `/api/availability/salonists`  
**Method:** `GET`  
**Access:** Public

**Query Parameters:**
- `salonId` (required): The ID of the salon
- `date` (optional): Date in ISO format (YYYY-MM-DD). Defaults to today if not provided.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/availability/salonists?salonId=67f2628f913847bf066652e5&date=2025-05-15"
```

**Success Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "John Smith",
      "salonId": "67f2628f913847bf066652e5",
      "image": "https://example.com/image.jpg",
      "specialties": ["Haircut", "Coloring"],
      "availability": [...],
      "status": "active",
      "leave": null
    },
    {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "Jane Doe",
      "salonId": "67f2628f913847bf066652e5",
      "image": "https://example.com/image2.jpg",
      "specialties": ["Styling", "Treatments"],
      "availability": [...],
      "status": "active",
      "leave": {
        "type": "PARTIAL_DAY",
        "reason": "Dentist appointment",
        "startTime": "2:00 PM",
        "endTime": "4:00 PM"
      }
    }
  ]
}
```

**Error Responses:**

1. Missing salon ID:
```json
{
  "success": false,
  "error": {
    "message": "Salon ID is required",
    "statusCode": 400
  }
}
```

2. Salon not found:
```json
{
  "success": false,
  "error": {
    "message": "Salon not found",
    "statusCode": 404
  }
}
```

### 2. Get Available Time Slots

Retrieves all available time slots for a specific salonist on a specific date.

**Endpoint:** `/api/availability/time-slots`  
**Method:** `GET`  
**Access:** Public

**Query Parameters:**
- `salonistId` (required): The ID of the salonist
- `date` (optional): Date in ISO format (YYYY-MM-DD). Defaults to today if not provided.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/availability/time-slots?salonistId=60d21b4667d0d8992e610c86&date=2025-05-15"
```

**Success Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM"
  ]
}
```

**Error Responses:**

1. Missing salonist ID:
```json
{
  "success": false,
  "error": {
    "message": "Salonist ID is required",
    "statusCode": 400
  }
}
```

2. Salonist not found:
```json
{
  "success": false,
  "error": {
    "message": "Salonist not found",
    "statusCode": 404
  }
}
```

### 3. Get Salonist Availability Status

Retrieves detailed availability status for a specific salonist on a specific date.

**Endpoint:** `/api/availability/status`  
**Method:** `GET`  
**Access:** Public

**Query Parameters:**
- `salonistId` (required): The ID of the salonist
- `date` (optional): Date in ISO format (YYYY-MM-DD). Defaults to today if not provided.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/availability/status?salonistId=60d21b4667d0d8992e610c86&date=2025-05-15"
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "status": "partially-booked",
    "reason": "8 slots available (40% of day)",
    "availabilityLevel": "medium",
    "availableSlots": 8,
    "totalSlots": 20
  }
}
```

**Possible Status Values:**
- `available` - Fully or mostly available
- `partially-booked` - Some slots are booked
- `mostly-booked` - Most slots are booked
- `booked` - All slots are booked
- `on-leave` - Salonist is on full-day leave
- `partial-leave` - Salonist is on partial-day leave
- `unavailable` - Not scheduled to work on this day

**Error Responses:**
Similar to the time-slots endpoint.

### 4. Get All Time Slots

Retrieves all possible time slots based on business hours.

**Endpoint:** `/api/availability/all-time-slots`  
**Method:** `GET`  
**Access:** Public

**Query Parameters:**
- `startHour` (optional): Start hour in 24-hour format (default: 8)
- `endHour` (optional): End hour in 24-hour format (default: 20)
- `interval` (optional): Interval in minutes (default: 30)

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/availability/all-time-slots?startHour=9&endHour=18&interval=60"
```

**Success Response:**
```json
{
  "success": true,
  "count": 9,
  "data": [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM"
  ]
}
```

### 5. Check Real-Time Availability

Checks if a specific time slot is available for a salonist on a specific date.

**Endpoint:** `/api/availability/check-real-time`  
**Method:** `GET`  
**Access:** Public

**Query Parameters:**
- `salonistId` (required): The ID of the salonist
- `date` (required): Date in ISO format (YYYY-MM-DD)
- `timeSlot` (required): Time slot to check (e.g., "9:00 AM")

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/availability/check-real-time?salonistId=60d21b4667d0d8992e610c86&date=2025-05-15&timeSlot=9:00%20AM"
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "timeSlot": "9:00 AM",
    "date": "2025-05-15"
  }
}
```

## Booking API

### 1. Create Booking

Creates a new booking.

**Endpoint:** `/api/bookings`  
**Method:** `POST`  
**Access:** Private (requires authentication)

**Request Body:**
```json
{
  "salonId": "67f2628f913847bf066652e5",
  "salonistId": "60d21b4667d0d8992e610c86",
  "services": [
    {
      "id": "60d21b4667d0d8992e610c88",
      "name": "Haircut",
      "price": 30,
      "duration": 60
    }
  ],
  "date": "2025-05-15",
  "startTime": "9:00 AM",
  "endTime": "10:00 AM",
  "totalDuration": 60,
  "totalPrice": 30,
  "notes": "First time customer"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "salonId": "67f2628f913847bf066652e5",
    "salonistId": "60d21b4667d0d8992e610c86",
    "services": [
      {
        "id": "60d21b4667d0d8992e610c88",
        "name": "Haircut",
        "price": 30,
        "duration": 60
      }
    ],
    "date": "2025-05-15",
    "startTime": "9:00 AM",
    "endTime": "10:00 AM",
    "totalDuration": 60,
    "totalPrice": 30,
    "notes": "First time customer"
  }'
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c89",
    "userId": "user123",
    "salonId": "67f2628f913847bf066652e5",
    "salonName": "Shear Elegance",
    "salonistId": "60d21b4667d0d8992e610c86",
    "salonistName": "John Smith",
    "services": [
      {
        "id": "60d21b4667d0d8992e610c88",
        "name": "Haircut",
        "price": 30,
        "duration": 60
      }
    ],
    "date": "2025-05-15T00:00:00.000Z",
    "startTime": "9:00 AM",
    "endTime": "10:00 AM",
    "totalDuration": 60,
    "totalPrice": 30,
    "notes": "First time customer",
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2023-11-10T12:00:00.000Z",
    "updatedAt": "2023-11-10T12:00:00.000Z"
  }
}
```

**Error Responses:**

1. Missing required fields:
```json
{
  "success": false,
  "error": {
    "message": "Missing required booking information",
    "statusCode": 400
  }
}
```

2. Time slot no longer available:
```json
{
  "success": false,
  "error": {
    "message": "Selected time slot is no longer available",
    "statusCode": 400
  }
}
```

### 2. Get User Bookings

Retrieves all bookings for the authenticated user.

**Endpoint:** `/api/bookings`  
**Method:** `GET`  
**Access:** Private (requires authentication)

**Query Parameters:**
- `status` (optional): Filter by booking status (e.g., "pending", "confirmed", "cancelled")
- `date` (optional): Filter by date (YYYY-MM-DD)
- `salonId` (optional): Filter by salon ID
- `salonistId` (optional): Filter by salonist ID

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/bookings?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c89",
      "userId": "user123",
      "salonId": {
        "_id": "67f2628f913847bf066652e5",
        "name": "Shear Elegance",
        "image": "https://example.com/salon.jpg"
      },
      "salonistId": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "John Smith",
        "image": "https://example.com/image.jpg"
      },
      "services": [...],
      "date": "2025-05-15T00:00:00.000Z",
      "status": "pending",
      "startTime": "9:00 AM",
      "endTime": "10:00 AM"
    },
    {
      "_id": "60d21b4667d0d8992e610c90",
      "userId": "user123",
      "salonId": {
        "_id": "67f2628f913847bf066652e5",
        "name": "Shear Elegance",
        "image": "https://example.com/salon.jpg"
      },
      "salonistId": {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "Jane Doe",
        "image": "https://example.com/image2.jpg"
      },
      "services": [...],
      "date": "2023-11-20T00:00:00.000Z",
      "status": "pending",
      "startTime": "2:00 PM",
      "endTime": "3:00 PM"
    }
  ]
}
```

### 3. Get Salonist Bookings

Retrieves all bookings for a specific salonist.

**Endpoint:** `/api/bookings/salonist/:salonistId`  
**Method:** `GET`  
**Access:** Private (requires authentication)

**Path Parameters:**
- `salonistId` (required): The ID of the salonist

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD)
- `status` (optional): Filter by booking status

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/bookings/salonist/60d21b4667d0d8992e610c86?date=2025-05-15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c89",
      "salonId": {
        "_id": "67f2628f913847bf066652e5",
        "name": "Shear Elegance",
        "image": "https://example.com/salon.jpg"
      },
      "salonistId": "60d21b4667d0d8992e610c86",
      "userId": {
        "displayName": "John Customer",
        "email": "john@example.com"
      },
      "date": "2025-05-15T00:00:00.000Z",
      "startTime": "9:00 AM",
      "endTime": "10:00 AM",
      "status": "confirmed"
    },
    // Additional bookings...
  ]
}
```

### 4. Get Bookings by Date

Retrieves all bookings for a specific date.

**Endpoint:** `/api/bookings/date/:date`  
**Method:** `GET`  
**Access:** Private (requires authentication)

**Path Parameters:**
- `date` (required): Date in ISO format (YYYY-MM-DD)

**Query Parameters:**
- `salonId` (optional): Filter by salon ID
- `status` (optional): Filter by booking status

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/bookings/date/2025-05-15?salonId=67f2628f913847bf066652e5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response:**
```json
{
  "success": true,
  "count": 5,
  "date": "2025-05-15",
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c89",
      "salonId": {
        "_id": "67f2628f913847bf066652e5",
        "name": "Shear Elegance",
        "image": "https://example.com/salon.jpg"
      },
      "salonistId": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "John Smith",
        "image": "https://example.com/image.jpg"
      },
      "startTime": "9:00 AM",
      "endTime": "10:00 AM",
      "status": "confirmed"
    },
    // Additional bookings...
  ]
}
```

### 5. Get Booking by ID

Retrieves a specific booking by its ID.

**Endpoint:** `/api/bookings/:id`  
**Method:** `GET`  
**Access:** Private (requires authentication)

**Path Parameters:**
- `id` (required): The ID of the booking

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/bookings/60d21b4667d0d8992e610c89" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c89",
    "userId": "user123",
    "salonId": {
      "_id": "67f2628f913847bf066652e5",
      "name": "Shear Elegance",
      "image": "https://example.com/salon.jpg",
      "address": "123 Main St",
      "contactPhone": "+1234567890",
      "contactEmail": "contact@example.com"
    },
    "salonistId": {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "John Smith",
      "image": "https://example.com/image.jpg",
      "specialties": ["Haircut", "Coloring"]
    },
    "services": [
      {
        "id": "60d21b4667d0d8992e610c88",
        "name": "Haircut",
        "price": 30,
        "duration": 60
      }
    ],
    "date": "2025-05-15T00:00:00.000Z",
    "startTime": "9:00 AM",
    "endTime": "10:00 AM",
    "totalDuration": 60,
    "totalPrice": 30,
    "notes": "First time customer",
    "status": "confirmed",
    "paymentStatus": "paid",
    "createdAt": "2023-11-10T12:00:00.000Z",
    "updatedAt": "2023-11-10T12:00:00.000Z"
  }
}
```

### 6. Update Booking

Updates an existing booking.

**Endpoint:** `/api/bookings/:id`  
**Method:** `PUT`  
**Access:** Private (requires authentication)

**Path Parameters:**
- `id` (required): The ID of the booking to update

**Request Body:** (Only include fields to update)
```json
{
  "date": "2023-11-16",
  "startTime": "10:00 AM",
  "endTime": "11:00 AM",
  "notes": "Updated notes"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:5000/api/bookings/60d21b4667d0d8992e610c89" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "date": "2023-11-16",
    "startTime": "10:00 AM",
    "endTime": "11:00 AM",
    "notes": "Updated notes"
  }'
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c89",
    "userId": "user123",
    "salonId": "67f2628f913847bf066652e5",
    "salonistId": "60d21b4667d0d8992e610c86",
    "date": "2023-11-16T00:00:00.000Z",
    "startTime": "10:00 AM",
    "endTime": "11:00 AM",
    "notes": "Updated notes",
    "status": "rescheduled",
    "updatedAt": "2023-11-11T12:00:00.000Z"
    // Other booking fields...
  }
}
```

**Error Responses:**

1. Time slot no longer available:
```json
{
  "success": false,
  "error": {
    "message": "Selected time slot is no longer available",
    "statusCode": 400
  }
}
```

2. Cannot update completed/cancelled booking:
```json
{
  "success": false,
  "error": {
    "message": "Cannot update a completed booking",
    "statusCode": 400
  }
}
```

### 7. Cancel Booking

Cancels a booking.

**Endpoint:** `/api/bookings/:id`  
**Method:** `DELETE`  
**Access:** Private (requires authentication)

**Path Parameters:**
- `id` (required): The ID of the booking to cancel

**Example Request:**
```bash
curl -X DELETE "http://localhost:5000/api/bookings/60d21b4667d0d8992e610c89" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c89",
    "status": "cancelled",
    "updatedAt": "2023-11-11T12:00:00.000Z"
    // Other booking fields...
  }
}
```

**Error Responses:**

1. Cannot cancel completed booking:
```json
{
  "success": false,
  "error": {
    "message": "Cannot cancel a completed booking",
    "statusCode": 400
  }
}
```

2. Already cancelled:
```json
{
  "success": false,
  "error": {
    "message": "Booking is already cancelled",
    "statusCode": 400
  }
}
```
