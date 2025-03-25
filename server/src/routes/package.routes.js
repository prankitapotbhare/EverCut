/**
 * Package Routes
 * Defines API endpoints for package-related operations
 */

const express = require('express');
const router = express.Router();
const packageController = require('../controllers/package.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes (no authentication required)

// Get packages by salon ID
router.get('/salon/:salonId', packageController.getPackagesBySalon);

// Get package by ID
router.get('/:id', packageController.getPackageById);

// Protected routes (authentication required)
router.use(authMiddleware.verifyToken);

// Create a new package (requires salon owner role)
router.post('/', authMiddleware.hasRole('owner'), packageController.createPackage);

// Update a package (requires salon owner role)
router.put('/:id', authMiddleware.hasRole('owner'), packageController.updatePackage);

// Delete a package (requires salon owner role)
router.delete('/:id', authMiddleware.hasRole('owner'), packageController.deletePackage);

module.exports = router;