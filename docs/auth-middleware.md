# Firebase Authentication Middleware

This document outlines the implementation of Firebase authentication middleware for protecting API routes in the EverCut backend.

## Overview

The authentication middleware acts as a security layer that verifies Firebase JWT tokens before allowing access to protected routes. It works in tandem with the frontend `AuthContext` which handles user authentication, token management, and profile updates. While authentication and user profiles are managed in Firebase/Firestore, the application uses MongoDB for all other data models (salons, stylists, bookings, etc.).

## Implementation

### File Structure

```
server/
├── src/
│   ├── middleware/
│   │   ├── auth.middleware.js    # Firebase token verification
│   │   └── ...
```

### auth.middleware.js

```javascript
const admin = require('firebase-admin');
const { getFirebaseAdmin } = require('../config/firebase-admin');
const User = require('../models/user.model'); // MongoDB model reference for additional checks

/**
 * Middleware to verify Firebase authentication token
 * 
 * This middleware extracts the token from the Authorization header,
 * verifies it using Firebase Admin SDK, and attaches the decoded user
 * information to the request object.
 */
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    }
    
    // Verify the token using Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
    // Attach user data to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      displayName: decodedToken.name,
      // Add any other needed user information
    };
    
    // Check if user's email is verified (if required)
    if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true' && !req.user.emailVerified) {
      return res.status(403).json({ error: 'Forbidden: Email not verified' });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({ error: 'Unauthorized: Token revoked' });
    }
    
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Middleware to verify admin role
 * 
 * This middleware verifies if the authenticated user has admin privileges
 * by checking both Firestore and MongoDB user data.
 */
const verifyAdmin = async (req, res, next) => {
  try {
    // Ensure user is authenticated first
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }
    
    // Option 1: Check Firebase custom claims for admin role
    const userRecord = await admin.auth().getUser(req.user.uid);
    const customClaims = userRecord.customClaims || {};
    
    if (customClaims.admin === true) {
      return next();
    }
    
    // Option 2: Check Firestore for admin role
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (userDoc.exists && userDoc.data().role === 'admin') {
      return next();
    }
    
    // Option 3: Check MongoDB for admin role (if user data is synced to MongoDB)
    const mongoUser = await User.findOne({ uid: req.user.uid });
    if (mongoUser && mongoUser.role === 'admin') {
      return next();
    }
    
    // User is not an admin
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Middleware to verify salon owner role
 * 
 * This middleware verifies if the authenticated user is the owner
 * of a specific salon by checking MongoDB records.
 */
const verifySalonOwner = (salonIdParam = 'salonId') => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated first
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }
      
      const salonId = req.params[salonIdParam] || req.body[salonIdParam];
      
      if (!salonId) {
        return res.status(400).json({ error: 'Bad request: Salon ID not provided' });
      }
      
      // Check if user owns this salon using MongoDB
      const Salon = require('../models/salon.model');
      const salon = await Salon.findById(salonId);
      
      if (!salon) {
        return res.status(404).json({ error: 'Not found: Salon does not exist' });
      }
      
      if (salon.ownerId !== req.user.uid) {
        return res.status(403).json({ error: 'Forbidden: Not the salon owner' });
      }
      
      next();
    } catch (error) {
      console.error('Salon owner verification error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = {
  verifyFirebaseToken,
  verifyAdmin,
  verifySalonOwner
};
```

## Usage

### Protecting Routes

To protect API routes, apply the middleware to Express routes:

```javascript
const express = require('express');
const router = express.Router();
const { verifyFirebaseToken, verifyAdmin, verifySalonOwner } = require('../middleware/auth.middleware');

// Protected route - requires authentication
router.get('/bookings', verifyFirebaseToken, bookingController.getUserBookings);

// Admin route - requires admin privileges
router.get('/users', verifyFirebaseToken, verifyAdmin, userController.getAllUsers);

// Salon owner route - requires salon ownership
router.put('/salons/:salonId', verifyFirebaseToken, verifySalonOwner('salonId'), salonController.updateSalon);

module.exports = router;
```

### Integration with Frontend

The frontend `AuthContext.jsx` handles:
1. User authentication (login, signup, Google OAuth)
2. Token management
3. User profile updates
4. Email verification

When making API requests from the frontend, the authentication token is included in the headers:

```javascript
// Example API call from frontend service
const fetchUserBookings = async () => {
  try {
    const token = await getAuthToken(); // From auth.js utility
    
    const response = await fetch('/api/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};
```

## Database Integration

### User Data Synchronization

Since user authentication data is handled by Firebase while application data is in MongoDB, we implement a synchronization strategy:

1. When a user is created/updated in Firebase Auth, we also update the corresponding Firestore profile document.
2. For key user information that's needed for MongoDB operations (uid, role, etc.), we maintain a lightweight MongoDB user collection that mirrors essential profile data.
3. The sync process is triggered by user authentication and profile update events.

```javascript
// Example synchronization between Firestore and MongoDB
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

## Error Handling

The middleware includes comprehensive error handling for various token-related issues:
- Missing or malformed tokens
- Expired tokens
- Revoked tokens
- Invalid tokens
- Server errors

Each error returns an appropriate HTTP status code and error message to help with debugging and provide a good user experience.

## Security Considerations

1. **Token Expiration**: Firebase tokens expire after 1 hour by default. Consider implementing token refresh logic.

2. **CORS Protection**: Ensure proper CORS settings to prevent unauthorized domains from accessing your API.

3. **Rate Limiting**: Implement rate limiting to prevent brute force attacks.

4. **HTTPS**: Always use HTTPS in production to encrypt token transmission.

5. **Error Messaging**: Keep error messages generic in production to avoid leaking sensitive information.

## Environment Variables

Configure the following environment variables:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
REQUIRE_EMAIL_VERIFICATION=true
MONGODB_URI=your-mongodb-connection-string
``` 