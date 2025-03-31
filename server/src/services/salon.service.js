const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const Salon = require('../models/Salon');

/**
 * Get all salons with optional filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} - List of salons
 */
const getAllSalons = async (filters = {}) => {
  try {
    let query = {};
    
    // Apply filters
    if (filters.location) {
      query['address.city'] = { $regex: new RegExp(filters.location, 'i') };
    }
    
    if (filters.rating) {
      query.rating = { $gte: parseFloat(filters.rating) };
    }
    
    if (filters.service) {
      query['services.name'] = { $regex: new RegExp(filters.service, 'i') };
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    const salons = await Salon.find(query)
      .select('name description address image rating reviewCount distance')
      .sort(filters.sort || { rating: -1 });
    
    return salons.map(salon => ({
      id: salon._id,
      name: salon.name,
      description: salon.description,
      address: `${salon.address.city}, ${salon.address.state}`,
      image: salon.image,
      rating: salon.rating,
      reviews: salon.reviewCount,
      distance: salon.distance || Math.random() * 10 // Fallback for testing
    }));
  } catch (error) {
    logger.error(`Error getting salons: ${error.message}`);
    throw new ApiError('Failed to fetch salons', 500);
  }
};

/**
 * Get salon by ID
 * @param {string} id - Salon ID
 * @returns {Promise<Object>} - Salon data
 */
const getSalonById = async (id) => {
  try {
    const salon = await Salon.findById(id);
    
    if (!salon) {
      throw new ApiError('Salon not found', 404);
    }
    
    return {
      id: salon._id,
      name: salon.name,
      description: salon.description,
      address: `${salon.address.street}, ${salon.address.city}, ${salon.address.state} ${salon.address.zipCode}`,
      image: salon.image,
      gallery: salon.gallery || [],
      rating: salon.rating,
      reviews: salon.reviews || [],
      reviewCount: salon.reviewCount,
      services: salon.services || [],
      packages: salon.packages || [],
      stylists: salon.stylists || [],
      operatingHours: salon.operatingHours || [],
      contactPhone: salon.contactPhone,
      contactEmail: salon.contactEmail
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error(`Error getting salon by ID: ${error.message}`);
    throw new ApiError('Failed to fetch salon', 500);
  }
};

/**
 * Get salon services
 * @param {string} id - Salon ID
 * @returns {Promise<Array>} - List of services
 */
const getSalonServices = async (id) => {
  try {
    const salon = await Salon.findById(id).select('services');
    
    if (!salon) {
      throw new ApiError('Salon not found', 404);
    }
    
    return salon.services || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error(`Error getting salon services: ${error.message}`);
    throw new ApiError('Failed to fetch salon services', 500);
  }
};

/**
 * Get salon packages
 * @param {string} id - Salon ID
 * @returns {Promise<Array>} - List of packages
 */
const getSalonPackages = async (id) => {
  try {
    const salon = await Salon.findById(id).select('packages');
    
    if (!salon) {
      throw new ApiError('Salon not found', 404);
    }
    
    return salon.packages || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error(`Error getting salon packages: ${error.message}`);
    throw new ApiError('Failed to fetch salon packages', 500);
  }
};

/**
 * Get salon stylists
 * @param {string} id - Salon ID
 * @returns {Promise<Array>} - List of stylists
 */
const getSalonStylists = async (id) => {
  try {
    const salon = await Salon.findById(id).select('stylists');
    
    if (!salon) {
      throw new ApiError('Salon not found', 404);
    }
    
    return salon.stylists || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error(`Error getting salon stylists: ${error.message}`);
    throw new ApiError('Failed to fetch salon stylists', 500);
  }
};

/**
 * Get popular salons
 * @param {number} limit - Number of salons to return
 * @returns {Promise<Array>} - List of popular salons
 */
const getPopularSalons = async (limit = 10) => {
  try {
    const salons = await Salon.find()
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit)
      .select('name description address image rating reviewCount distance');
    
    return salons.map(salon => ({
      id: salon._id,
      name: salon.name,
      description: salon.description,
      address: `${salon.address.city}, ${salon.address.state}`,
      image: salon.image,
      rating: salon.rating,
      reviews: salon.reviewCount,
      distance: salon.distance || Math.random() * 10 // Fallback for testing
    }));
  } catch (error) {
    logger.error(`Error getting popular salons: ${error.message}`);
    throw new ApiError('Failed to fetch popular salons', 500);
  }
};

/**
 * Get nearest salons
 * @param {Object} coordinates - User coordinates { lat, lng }
 * @param {number} limit - Number of salons to return
 * @returns {Promise<Array>} - List of nearest salons
 */
const getNearestSalons = async (coordinates, limit = 10) => {
  try {
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      // If no coordinates provided, return random salons
      return getAllSalons({ limit });
    }
    
    const salons = await Salon.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat]
          }
        }
      }
    })
    .limit(limit)
    .select('name description address image rating reviewCount location');
    
    return salons.map(salon => {
      // Calculate distance in kilometers
      const distance = calculateDistance(
        coordinates.lat, 
        coordinates.lng, 
        salon.location.coordinates[1], 
        salon.location.coordinates[0]
      );
      
      return {
        id: salon._id,
        name: salon.name,
        description: salon.description,
        address: `${salon.address.city}, ${salon.address.state}`,
        image: salon.image,
        rating: salon.rating,
        reviews: salon.reviewCount,
        distance: parseFloat(distance.toFixed(1))
      };
    });
  } catch (error) {
    logger.error(`Error getting nearest salons: ${error.message}`);
    throw new ApiError('Failed to fetch nearest salons', 500);
  }
};

/**
 * Search salons by name or location
 * @param {string} query - Search query
 * @returns {Promise<Array>} - List of matching salons
 */
const searchSalons = async (query) => {
  try {
    if (!query) {
      return [];
    }
    
    const salons = await Salon.find({
      $text: { $search: query }
    })
    .select('name description address image rating reviewCount distance');
    
    return salons.map(salon => ({
      id: salon._id,
      name: salon.name,
      description: salon.description,
      address: `${salon.address.city}, ${salon.address.state}`,
      image: salon.image,
      rating: salon.rating,
      reviews: salon.reviewCount,
      distance: salon.distance || Math.random() * 10 // Fallback for testing
    }));
  } catch (error) {
    logger.error(`Error searching salons: ${error.message}`);
    throw new ApiError('Failed to search salons', 500);
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} - Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

module.exports = {
  getAllSalons,
  getSalonById,
  getSalonServices,
  getSalonPackages,
  getSalonStylists,
  getPopularSalons,
  getNearestSalons,
  searchSalons
};