const express = require('express');
const { verifyToken, requireEmailVerified } = require('../middleware/auth.middleware');
const router = express.Router();

/**
 * @route GET /api/users/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    // User data is already available in req.user from the middleware
    res.status(200).json({
      success: true,
      data: {
        uid: req.user.uid,
        email: req.user.email,
        emailVerified: req.user.email_verified,
        displayName: req.user.name || req.user.display_name
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

/**
 * @route PUT /api/users/me
 * @desc Update current user profile
 * @access Private
 */
router.put('/me', verifyToken, requireEmailVerified, async (req, res) => {
  try {
    // This is a placeholder implementation
    // In a real implementation, you would update the user profile in Firestore
    res.status(200).json({
      success: true,
      data: {
        uid: req.user.uid,
        ...req.body,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile'
    });
  }
});

module.exports = router;