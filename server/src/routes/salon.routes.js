/**
 * Salon Routes
 * Defines API endpoints for salon-related operations
 */

const express = require('express');
const router = express.Router();
const salonController = require('../controllers/salon.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes (no authentication required)

// Get all salons
router.get('/', salonController.getSalons);

// Get salon by ID
router.get('/:id', salonController.getSalonById);

// Get popular salons
router.get('/popular/list', salonController.getPopularSalons);

// Get nearest salons
router.get('/nearest/list', salonController.getNearestSalons);

// Search salons
router.get('/search/query', salonController.searchSalons);

// Protected routes (authentication required)
router.use(authMiddleware.verifyToken);