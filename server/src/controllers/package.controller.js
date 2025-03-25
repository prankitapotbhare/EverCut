/**
 * Package Controller
 * Handles package-related operations
 */

const Package = require('../models/package.model');
const Salon = require('../models/salon.model');
const Service = require('../models/service.model');

/**
 * Get packages by salon ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getPackagesBySalon = async (req, res, next) => {
  try {
    const { salonId } = req.params;
    
    // Validate salon exists
    const salonExists = await Salon.exists({ _id: salonId });
    if (!salonExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Salon not found'
      });
    }
    
    // Get packages for the salon
    const packages = await Package.find({ salon: salonId, isActive: true })
      .sort({ price: 1 });
    
    res.status(200).json({
      status: 'success',
      results: packages.length,
      data: {
        packages
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get package by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getPackageById = async (req, res, next) => {
  try {
    const packageItem = await Package.findById(req.params.id);
    
    if (!packageItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Package not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        package: packageItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new package
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createPackage = async (req, res, next) => {
  try {
    const { 
      salonId, 
      name, 
      description, 
      services, 
      price, 
      discountPercentage,
      totalDuration,
      image, 
      isPopular 
    } = req.body;
    
    // Validate salon exists and user is the owner
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({
        status: 'error',
        message: 'Salon not found'
      });
    }
    
    // Verify user is the salon owner
    if (salon.owner !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to add packages to this salon'
      });
    }
    
    // Validate services exist
    const serviceIds = services.map(service => service.serviceId);
    const foundServices = await Service.find({ _id: { $in: serviceIds }, salon: salonId });
    
    if (foundServices.length !== serviceIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'One or more services are invalid'
      });
    }
    
    // Prepare services array with details
    const packageServices = foundServices.map(service => {
      return {
        service: service._id,
        name: service.name,
        price: service.price,
        duration: service.duration
      };
    });
    
    // Create new package
    const packageItem = new Package({
      salon: salonId,
      name,
      description,
      services: packageServices,
      price,
      discountPercentage: discountPercentage || 0,
      totalDuration,
      image,
      isPopular: isPopular || false
    });
    
    await packageItem.save();
    
    // Add package to salon's packages array
    salon.packages.push(packageItem._id);
    await salon.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Package created successfully',
      data: {
        package: packageItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a package
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updatePackage = async (req, res, next) => {
  try {
    const packageId = req.params.id;
    const updateData = req.body;
    
    // Find package
    const packageItem = await Package.findById(packageId);
    if (!packageItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Package not found'
      });
    }
    
    // Verify user is the salon owner
    const salon = await Salon.findById(packageItem.salon);
    if (!salon || salon.owner !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this package'
      });
    }
    
    // Handle services update if provided
    if (updateData.services && updateData.services.length > 0) {
      const serviceIds = updateData.services.map(service => service.serviceId);
      const foundServices = await Service.find({ _id: { $in: serviceIds }, salon: packageItem.salon });
      
      if (foundServices.length !== serviceIds.length) {
        return res.status(400).json({
          status: 'error',
          message: 'One or more services are invalid'
        });
      }
      
      // Prepare services array with details
      updateData.services = foundServices.map(service => {
        return {
          service: service._id,
          name: service.name,
          price: service.price,
          duration: service.duration
        };
      });
    }
    
    // Update package
    Object.keys(updateData).forEach(key => {
      if (key !== 'salon') { // Prevent changing salon association
        packageItem[key] = updateData[key];
      }
    });
    
    await packageItem.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Package updated successfully',
      data: {
        package: packageItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a package
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const deletePackage = async (req, res, next) => {
  try {
    const packageId = req.params.id;
    
    // Find package
    const packageItem = await Package.findById(packageId);
    if (!packageItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Package not found'
      });
    }
    
    // Verify user is the salon owner
    const salon = await Salon.findById(packageItem.salon);
    if (!salon || salon.owner !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this package'
      });
    }
    
    // Remove package from salon's packages array
    salon.packages = salon.packages.filter(id => id.toString() !== packageId);
    await salon.save();
    
    // Delete package
    await Package.findByIdAndDelete(packageId);
    
    res.status(200).json({
      status: 'success',
      message: 'Package deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPackagesBySalon,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
};