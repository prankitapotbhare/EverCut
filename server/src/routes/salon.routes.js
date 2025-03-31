const express = require('express');
const { verifyToken, requireEmailVerified } = require('../middleware/auth.middleware');
const { 
  getSalons, 
  getSalonById, 
  createSalon,
  getSalonServices,
  getSalonPackages,
  getSalonStylists,
  getPopularSalons,
  getNearestSalons,
  searchSalons
} = require('../controllers/salon.controller');
const router = express.Router();

/**
 * @route GET /api/salons
 * @desc Get all salons with optional filtering
 * @access Public
 */
router.get('/', getSalons);

/**
 * @route GET /api/salons/popular
 * @desc Get popular salons
 * @access Public
 */
router.get('/popular', getPopularSalons);

/**
 * @route GET /api/salons/nearest
 * @desc Get nearest salons
 * @access Public
 */
router.get('/nearest', getNearestSalons);

/**
 * @route GET /api/salons/search
 * @desc Search salons
 * @access Public
 */
router.get('/search', searchSalons);

/**
 * @route GET /api/salons/:id
 * @desc Get salon details by ID
 * @access Public
 */
router.get('/:id', getSalonById);

/**
 * @route POST /api/salons
 * @desc Create a new salon
 * @access Private (Admin)
 */
router.post('/', verifyToken, requireEmailVerified, createSalon);

/**
 * @route GET /api/salons/:id/services
 * @desc Get services offered by a salon
 * @access Public
 */
router.get('/:id/services', getSalonServices);

/**
 * @route GET /api/salons/:id/packages
 * @desc Get packages offered by a salon
 * @access Public
 */
router.get('/:id/packages', getSalonPackages);

/**
 * @route GET /api/salons/:id/stylists
 * @desc Get stylists working at a salon
 * @access Public
 */
router.get('/:id/stylists', getSalonStylists);

module.exports = router;