const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment variables or JSON file
 */
const initializeFirebaseAdmin = () => {
  try {
    // Skip initialization if we're in a test environment and admin is already initialized
    if (process.env.NODE_ENV === 'test') {
      // For tests, we'll use the mock implementation
      console.log('Test environment detected, using mock Firebase Admin');
      return;
    }

    // Check if Firebase Admin is already initialized
    if (admin.apps.length > 0) {
      console.log('Firebase Admin already initialized');
      return;
    }

    // Check if service account is provided via environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized with environment credentials');
        return;
      } catch (parseError) {
        console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', parseError);
        console.log('Falling back to service account file...');
      }
    }

    // Otherwise, use the service account file
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error('Service account file not found');
    }
    
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('Firebase Admin initialized with service account file');
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
    
    // Don't exit the process during tests
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = {
  initializeFirebaseAdmin
};