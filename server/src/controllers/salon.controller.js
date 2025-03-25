/**
 * Salon Controller
 * Handles salon-related operations
 */

const Salon = require('../models/salon.model');

/**
 * Get all salons
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getSalons = async (req, res, next) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Query parameters for filtering
    const filter = {};
    
    if (req.query.city) {
      filter['address.city'] = new RegExp(req.query.city, 'i');
    }
    
    // Execute query with pagination
    const salons = await Salon.find(filter)
      .skip(skip)
      .limit(limit)
      .select('-reviewsData') // Exclude detailed reviews for performance
      .sort({ rating: -1 });
    
    // Get total count for pagination metadata
    const total = await Salon.countDocuments(filter);
    
    res.status(200).json({
      status: 'success',
      results: salons.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: {
        salons
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get salon by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getSalonById = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.id)
      .populate('services')
      .populate('packages');
    
    if (!salon) {
      return res.status(404).json({
        status: 'error',
        message: 'Salon not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        salon
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular salons
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getPopularSalons = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get salons with highest rating * reviews (popularity metric)
    const salons = await Salon.aggregate([
      {
        $addFields: {
          popularity: { $multiply: ['$rating', '$reviews'] }
        }
      },
      { $sort: { popularity: -1 } },
      { $limit: limit },
      { $project: { reviewsData: 0 } } // Exclude detailed reviews
    ]);
    
    res.status(200).json({
      status: 'success',
      results: salons.length,
      data: {
        salons
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get nearest salons based on user location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getNearestSalons = async (req, res, next) => {
  try {
    // Get coordinates from query parameters
    const { longitude, latitude } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({
        status: 'error',
        message: 'Longitude and latitude are required'
      });
    }
    
    const coordinates = [
      parseFloat(longitude),
      parseFloat(latitude)
    ];
    
    // Maximum distance in meters (default: 10km)
    const maxDistance = parseInt(req.query.distance) || 10000;
    const limit = parseInt(req.query.limit) || 10;
    
    // Find salons near the provided coordinates
    const salons = await Salon.find({
      'address.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: maxDistance
        }
      }
    })
    .limit(limit)
    .select('-reviewsData');
    
    res.status(200).json({
      status: 'success',
      results: salons.length,
      data: {
        salons
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search salons by query
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const searchSalons = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }
    
    // Create text search query
    const searchQuery = {
      $or: [
        { name: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { 'address.city': new RegExp(q, 'i') },
        { 'address.state': new RegExp(q, 'i') }
      ]
    };
    
    const salons = await Salon.find(searchQuery)
      .limit(20)
      .select('-reviewsData');
    
    res.status(200).json({
      status: 'success',
      results: salons.length,
      data: {
        salons
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalons,
  getSalonById,
  getPopularSalons,
  getNearestSalons,
  searchSalons
};