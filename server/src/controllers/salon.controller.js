const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const salonService = require('../services/salon.service');

/**
 * @route GET /api/salons
 * @desc Get all salons with optional filtering
 * @access Public
 */
const getSalons = async (req, res, next) => {
  try {
    // Use database for all environments including test
    // Test environment will use the seeded mock data

    // Extract filters from query parameters
    const filters = {
      location: req.query.location,
      rating: req.query.rating ? parseFloat(req.query.rating) : null,
      service: req.query.service,
      search: req.query.search,
      sort: req.query.sort
    };
    
    // Get salons from service
    const salons = await salonService.getAllSalons(filters);
    
    res.status(200).json({
      success: true,
      count: salons.length,
      data: salons
    });
  } catch (error) {
    logger.error(`Error getting salons: ${error.message}`);
    next(new ApiError('Failed to fetch salons', 500));
  }
};

/**
 * @route GET /api/salons/:id
 * @desc Get salon details by ID
 * @access Public
 */
const getSalonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Log the requested ID for debugging
    logger.info(`Fetching salon with ID: ${id}`);
    
    // Get salon from service
    const salon = await salonService.getSalonById(id);
    
    res.status(200).json({
      success: true,
      data: salon
    });
  } catch (error) {
    logger.error(`Error getting salon by ID: ${error.message}`);
    
    // Pass the error to the error handler middleware
    if (error instanceof ApiError) {
      return next(error);
    }
    
    next(new ApiError('Failed to fetch salon details', 500));
  }
};

/**
 * @route POST /api/salons
 * @desc Create a new salon
 * @access Private (Admin)
 */
const createSalon = async (req, res, next) => {
  try {
    // Check if user has admin privileges
    if (!req.user.admin) {
      return next(new ApiError('Not authorized to create salons', 403));
    }
    
    // Create salon using service
    const salon = await salonService.createSalon(req.body);
    
    res.status(201).json({
      success: true,
      data: salon
    });
  } catch (error) {
    logger.error(`Error creating salon: ${error.message}`);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new ApiError(messages.join(', '), 400));
    }
    
    next(new ApiError('Failed to create salon', 500));
  }
};

/**
 * @route GET /api/salons/:id/services
 * @desc Get services offered by a salon
 * @access Public
 */
const getSalonServices = async (req, res, next) => {
  try {
    // For test environment, use mock data from database
    if (process.env.NODE_ENV === 'test') {
      // Use the database for tests as well, since we've seeded it with mock data
      // This ensures consistent behavior between test and production environments
    }
    
    // Get services from service
    const services = await salonService.getSalonServices(req.params.id);
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    logger.error(`Error getting salon services: ${error.message}`);
    
    if (error instanceof ApiError) {
      return next(error);
    }
    
    next(new ApiError('Failed to fetch salon services', 500));
  }
};

/**
 * @route GET /api/salons/:id/packages
 * @desc Get packages offered by a salon
 * @access Public
 */
const getSalonPackages = async (req, res, next) => {
  try {
    // Use database for all environments including test
    // Test environment will use the seeded mock data
    
    // Get packages from service
    const packages = await salonService.getSalonPackages(req.params.id);
    
    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    logger.error(`Error getting salon packages: ${error.message}`);
    
    if (error instanceof ApiError) {
      return next(error);
    }
    
    next(new ApiError('Failed to fetch salon packages', 500));
  }
};

/**
 * @route GET /api/salons/:id/stylists
 * @desc Get stylists working at a salon
 * @access Public
 */
const getSalonStylists = async (req, res, next) => {
  try {
    // Use database for all environments including test
    // Test environment will use the seeded mock data
    
    // Get stylists from service
    const stylists = await salonService.getSalonStylists(req.params.id);
    
    res.status(200).json({
      success: true,
      count: stylists.length,
      data: stylists
    });
  } catch (error) {
    logger.error(`Error getting salon stylists: ${error.message}`);
    
    if (error instanceof ApiError) {
      return next(error);
    }
    
    next(new ApiError('Failed to fetch salon stylists', 500));
  }
};

/**
 * @route GET /api/salons/popular
 * @desc Get popular salons
 * @access Public
 */
const getPopularSalons = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const salons = await salonService.getPopularSalons(limit);
    
    res.status(200).json({
      success: true,
      count: salons.length,
      data: salons
    });
  } catch (error) {
    logger.error(`Error getting popular salons: ${error.message}`);
    next(new ApiError('Failed to fetch popular salons', 500));
  }
};

/**
 * @route GET /api/salons/nearest
 * @desc Get nearest salons
 * @access Public
 */
const getNearestSalons = async (req, res, next) => {
  try {
    const { lat, lng, limit } = req.query;
    
    // Validate coordinates
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      
      if (isNaN(latNum) || isNaN(lngNum)) {
        return next(new ApiError('Invalid coordinates provided', 400));
      }
      
      const coordinates = { lat: latNum, lng: lngNum };
      const limitValue = limit ? parseInt(limit) : 10;
      
      const salons = await salonService.getNearestSalons(coordinates, limitValue);
      
      return res.status(200).json({
        success: true,
        count: salons.length,
        data: salons
      });
    } else {
      // If no coordinates, just return popular salons
      const limitValue = limit ? parseInt(limit) : 10;
      const salons = await salonService.getPopularSalons(limitValue);
      
      return res.status(200).json({
        success: true,
        count: salons.length,
        data: salons
      });
    }
  } catch (error) {
    logger.error(`Error getting nearest salons: ${error.message}`);
    next(new ApiError('Failed to fetch nearest salons', 500));
  }
};

/**
 * @route GET /api/salons/search
 * @desc Search salons
 * @access Public
 */
const searchSalons = async (req, res, next) => {
  try {
    const { query, limit, lat, lng } = req.query;
    
    if (!query) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    const limitValue = limit ? parseInt(limit) : 10;
    
    // Pass coordinates if provided
    const coordinates = (lat && lng) ? {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    } : null;
    
    const salons = await salonService.searchSalonsByQuery(query, limitValue, coordinates);
    
    return res.status(200).json({
      success: true,
      count: salons.length,
      data: salons
    });
  } catch (error) {
    logger.error(`Error searching salons: ${error.message}`);
    next(new ApiError('Failed to search salons', 500));
  }
};

module.exports = {
  getSalons,
  getSalonById,
  createSalon,
  getSalonServices,
  getSalonPackages,
  getSalonStylists,
  getPopularSalons,
  getNearestSalons,
  searchSalons
};