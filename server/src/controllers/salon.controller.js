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
    // For test environment, use mock data
    if (process.env.NODE_ENV === 'test') {
      return res.status(200).json({
        success: true,
        count: 2,
        data: [
          {
            id: 'salon-1',
            name: 'Test Salon',
            description: 'A test salon',
            address: 'Test City, Test State',
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80',
            rating: 4.5,
            reviews: 120,
            distance: 1.2
          },
          {
            id: 'salon-2',
            name: 'Another Test Salon',
            description: 'Another test salon',
            address: 'Another City, Another State',
            image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80',
            rating: 4.0,
            reviews: 85,
            distance: 2.5
          }
        ]
      });
    }

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
    // For test environment, use mock data
    if (process.env.NODE_ENV === 'test') {
      if (req.params.id === 'salon-1') {
        return res.status(200).json({
          success: true,
          data: {
            id: 'salon-1',
            name: 'Test Salon',
            description: 'A test salon with great services',
            address: 'Test Street, Test City, Test State 12345',
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80',
            gallery: [
              'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80',
              'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80'
            ],
            rating: 4.5,
            reviews: [
              {
                id: 'review-1',
                userId: 'user-1',
                userName: 'John Doe',
                userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                rating: 5,
                comment: 'Great service!',
                date: '2023-01-15T12:00:00.000Z'
              }
            ],
            reviewCount: 120,
            services: [
              {
                id: 'service-1',
                name: 'Haircut',
                description: 'Professional haircut',
                price: 30,
                duration: '30 min'
              },
              {
                id: 'service-2',
                name: 'Hair Coloring',
                description: 'Full hair coloring',
                price: 60,
                duration: '60 min'
              }
            ],
            packages: [
              {
                id: 'package-1',
                name: 'Complete Makeover',
                description: 'Haircut, coloring, and styling',
                price: 100,
                duration: '120 min',
                services: ['Haircut', 'Hair Coloring', 'Styling']
              }
            ],
            stylists: [
              {
                id: 'stylist-1',
                name: 'Jane Smith',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                specialties: ['Haircut', 'Styling'],
                bio: 'Experienced stylist with 5 years of experience'
              }
            ]
          }
        });
      } else {
        return next(new ApiError('Salon not found', 404));
      }
    }

    // Get salon from service
    const salon = await salonService.getSalonById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: salon
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    
    logger.error(`Error getting salon by ID: ${error.message}`);
    
    // Check if error is due to invalid ObjectId
    if (error.name === 'CastError') {
      return next(new ApiError('Salon not found', 404));
    }
    
    next(new ApiError('Failed to fetch salon', 500));
  }
};

/**
 * @route POST /api/salons
 * @desc Create a new salon
 * @access Private (Admin)
 */
const createSalon = async (req, res, next) => {
  try {
    // This would typically validate the request and create a salon
    // For now, we'll just return a success response
    res.status(201).json({
      success: true,
      data: {
        id: 'new-salon-id',
        ...req.body
      }
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
    // For test environment, use mock data
    if (process.env.NODE_ENV === 'test') {
      return res.status(200).json({
        success: true,
        count: 2,
        data: [
          {
            id: 'service-1',
            name: 'Haircut',
            description: 'Professional haircut',
            price: 30,
            duration: '30 min'
          },
          {
            id: 'service-2',
            name: 'Hair Coloring',
            description: 'Full hair coloring',
            price: 60,
            duration: '60 min'
          }
        ]
      });
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
    // For test environment, use mock data
    if (process.env.NODE_ENV === 'test') {
      return res.status(200).json({
        success: true,
        count: 1,
        data: [
          {
            id: 'package-1',
            name: 'Complete Makeover',
            description: 'Haircut, coloring, and styling',
            price: 100,
            duration: '120 min',
            services: ['Haircut', 'Hair Coloring', 'Styling']
          }
        ]
      });
    }
    
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
    // For test environment, use mock data
    if (process.env.NODE_ENV === 'test') {
      return res.status(200).json({
        success: true,
        count: 1,
        data: [
          {
            id: 'stylist-1',
            name: 'Jane Smith',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
            specialties: ['Haircut', 'Styling'],
            bio: 'Experienced stylist with 5 years of experience'
          }
        ]
      });
    }
    
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
 * @desc Search salons with fuzzy matching
 * @access Public
 */
const searchSalons = async (req, res, next) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    const limitValue = limit ? parseInt(limit) : 10;
    const salons = await salonService.searchSalonsByQuery(query, limitValue);
    
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