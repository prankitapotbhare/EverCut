const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const Salon = require('../models/Salon');
const mongoose = require('mongoose'); // Add this import

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
    
    // Instead of using $near which might not work if geospatial index isn't set up correctly,
    // we'll fetch all salons and calculate distances manually
    const salons = await Salon.find()
      .select('name description address image rating reviewCount location')
      .limit(limit * 3); // Fetch more than needed to sort by distance
    
    // Calculate distance for each salon and add it to the salon object
    const salonsWithDistance = salons.map(salon => {
      // Default coordinates if location isn't set
      const salonLat = salon.location?.coordinates?.[1] || 0;
      const salonLng = salon.location?.coordinates?.[0] || 0;
      
      // Calculate distance in kilometers
      const distance = calculateDistance(
        coordinates.lat, 
        coordinates.lng, 
        salonLat,
        salonLng
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
    
    // Sort by distance and limit to requested number
    return salonsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
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
 * Search salons by query with fuzzy matching
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} - List of matching salons
 */
const searchSalonsByQuery = async (query, limit = 10) => {
  try {
    if (!query) {
      return [];
    }

    // First attempt: try using existing text index
    let salons = [];
    if (query.length > 1) {
      try {
        salons = await Salon.find(
          { $text: { $search: query } },
          { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .limit(limit);
      } catch (error) {
        logger.warn(`Text search error: ${error.message}. Falling back to regex search.`);
        // If text search fails, we'll continue to regex search
      }
    }

    // Second attempt: regex search for partial matches (works with single letters)
    if (salons.length === 0) {
      const regexPattern = new RegExp(query, 'i');
      salons = await Salon.find({
        $or: [
          { name: regexPattern },
          { description: regexPattern },
          { 'services.name': regexPattern },
          { 'address.city': regexPattern },
          { 'address.state': regexPattern }
        ]
      }).limit(limit);
    }

    // Third attempt: fuzzy matching for spelling mistakes
    if (salons.length === 0) {
      // Get all salons and filter in memory for fuzzy matching
      const allSalons = await Salon.find({}).limit(100); // Limit to prevent performance issues
      
      // Simple fuzzy matching function
      const calculateSimilarity = (str1, str2) => {
        if (!str1 || !str2) return 0;
        
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();
        
        // Calculate Levenshtein distance
        const track = Array(str2.length + 1).fill(null).map(() => 
          Array(str1.length + 1).fill(null));
        
        for (let i = 0; i <= str1.length; i += 1) {
          track[0][i] = i;
        }
        
        for (let j = 0; j <= str2.length; j += 1) {
          track[j][0] = j;
        }
        
        for (let j = 1; j <= str2.length; j += 1) {
          for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
              track[j][i - 1] + 1, // deletion
              track[j - 1][i] + 1, // insertion
              track[j - 1][i - 1] + indicator, // substitution
            );
          }
        }
        
        return 1 - (track[str2.length][str1.length] / Math.max(str1.length, str2.length));
      };
      
      // Score each salon based on similarity to query
      const scoredSalons = allSalons.map(salon => {
        const nameScore = calculateSimilarity(salon.name, query);
        const descScore = salon.description ? calculateSimilarity(salon.description, query) : 0;
        
        // Check services for matches
        let serviceScore = 0;
        if (salon.services && salon.services.length > 0) {
          const serviceScores = salon.services.map(service => 
            calculateSimilarity(service.name, query));
          serviceScore = Math.max(...serviceScores, 0);
        }
        
        // Calculate overall score (weighted)
        const totalScore = (nameScore * 0.6) + (descScore * 0.2) + (serviceScore * 0.2);
        
        return {
          salon,
          score: totalScore
        };
      });
      
      // Sort by score and take top results
      scoredSalons.sort((a, b) => b.score - a.score);
      salons = scoredSalons
        .filter(item => item.score > 0.3) // Only include reasonably similar results
        .slice(0, limit)
        .map(item => item.salon);
    }

    // Format the results
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
  searchSalons,
  searchSalonsByQuery
};