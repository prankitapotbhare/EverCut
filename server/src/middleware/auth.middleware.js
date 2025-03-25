/**
 * Authentication Middleware
 * Verifies Firebase tokens and attaches user data to request
 */

const admin = require('firebase-admin');
const serviceAccount = require("serviceAccountKey.json");

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

/**
 * Middleware to verify Firebase authentication token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No token provided',
      });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user data to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      role: decodedToken.role || 'user',
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Invalid token',
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {String|Array} roles - Required role(s) for access
 */
const hasRole = (roles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Authentication required',
      });
    }
    
    const userRole = req.user.role || 'user';
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    if (requiredRoles.includes(userRole)) {
      return next();
    }
    
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden: Insufficient permissions',
    });
  };
};

module.exports = {
  verifyToken,
  hasRole,
};