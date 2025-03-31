const admin = require('firebase-admin');
const { getErrorResponse } = require('../utils/errors');

/**
 * Middleware to verify Firebase authentication tokens
 * Extracts the token from the Authorization header and verifies it
 * Sets the decoded user information on the request object
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(getErrorResponse('Unauthorized: No token provided'));
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json(getErrorResponse('Unauthorized: Invalid token'));
  }
};

/**
 * Middleware to check if user's email is verified
 * Must be used after verifyToken middleware
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(getErrorResponse('Unauthorized: Authentication required'));
  }

  if (!req.user.email_verified) {
    return res.status(403).json(getErrorResponse('Forbidden: Email not verified'));
  }

  next();
};

/**
 * Middleware to check if user has admin role
 * Must be used after verifyToken middleware
 */
const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(getErrorResponse('Unauthorized: Authentication required'));
  }

  try {
    // Get user claims or check Firestore for admin role
    const userRecord = await admin.auth().getUser(req.user.uid);
    const customClaims = userRecord.customClaims || {};
    
    if (customClaims.admin !== true) {
      return res.status(403).json(getErrorResponse('Forbidden: Admin access required'));
    }
    
    next();
  } catch (error) {
    console.error('Admin verification failed:', error);
    return res.status(500).json(getErrorResponse('Server error during authorization'));
  }
};

module.exports = {
  verifyToken,
  requireEmailVerified,
  requireAdmin
};