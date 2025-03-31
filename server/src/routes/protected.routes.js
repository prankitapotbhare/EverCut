const express = require('express');
const { verifyToken, requireEmailVerified } = require('../middleware/auth.middleware');
const router = express.Router();

/**
 * @route GET /api/user/profile
 * @desc Get user profile data
 * @access Private
 */
router.get('/user/profile', verifyToken, requireEmailVerified, async (req, res) => {
  try {
    // User data is already available in req.user from the middleware
    // You can fetch additional user data from Firestore if needed
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

module.exports = router;