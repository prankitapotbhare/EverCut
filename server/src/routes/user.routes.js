const express = require('express');
const router = express.Router();

/**
 * @route GET /api/users/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', async (req, res) => {
  try {
    // Return mock user data since authentication is removed
    res.status(200).json({
      success: true,
      data: {
        uid: 'anonymous-user',
        email: 'anonymous@example.com',
        emailVerified: true,
        displayName: 'Anonymous User'
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
router.put('/me', async (req, res) => {
  try {
    // This is a placeholder implementation without authentication
    res.status(200).json({
      success: true,
      data: {
        uid: 'anonymous-user',
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