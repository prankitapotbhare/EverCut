/**
 * Service Routes
 * Defines API endpoints for service-related operations
 */

const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes (no authentication required)

// Get services by salon ID
router.get('/salon/:salonId', serviceController.getServicesBySalon);

// Get service by ID
router.get('/:id', serviceController.getServiceById);

// Protected routes (authentication required)
router.use(authMiddleware.verifyToken);

// Create a new service (requires salon owner role)
router.post('/', authMiddleware.hasRole('owner'), serviceController.createService);

// Update a service (requires salon owner role)
router.put('/:id', authMiddleware.hasRole('owner'), serviceController.updateService);

// Delete a service (requires salon owner role)
router.delete('/:id', authMiddleware.hasRole('owner'), serviceController.deleteService);

module.exports = router;