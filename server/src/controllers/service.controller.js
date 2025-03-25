/**
 * Service Controller
 * Handles service-related operations
 */

const Service = require('../models/service.model');
const Salon = require('../models/salon.model');

/**
 * Get services by salon ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getServicesBySalon = async (req, res, next) => {
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
    
    // Get services for the salon
    const services = await Service.find({ salon: salonId, isActive: true })
      .sort({ category: 1, price: 1 });
    
    res.status(200).json({
      status: 'success',
      results: services.length,
      data: {
        services
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get service by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        service
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new service
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createService = async (req, res, next) => {
  try {
    const { salonId, name, description, price, duration, category, image, isPopular } = req.body;
    
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
        message: 'You are not authorized to add services to this salon'
      });
    }
    
    // Create new service
    const service = new Service({
      salon: salonId,
      name,
      description,
      price,
      duration,
      category,
      image,
      isPopular: isPopular || false
    });
    
    await service.save();
    
    // Add service to salon's services array
    salon.services.push(service._id);
    await salon.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Service created successfully',
      data: {
        service
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a service
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateService = async (req, res, next) => {
  try {
    const serviceId = req.params.id;
    const updateData = req.body;
    
    // Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }
    
    // Verify user is the salon owner
    const salon = await Salon.findById(service.salon);
    if (!salon || salon.owner !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this service'
      });
    }
    
    // Update service
    Object.keys(updateData).forEach(key => {
      if (key !== 'salon') { // Prevent changing salon association
        service[key] = updateData[key];
      }
    });
    
    await service.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Service updated successfully',
      data: {
        service
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a service
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const deleteService = async (req, res, next) => {
  try {
    const serviceId = req.params.id;
    
    // Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }
    
    // Verify user is the salon owner
    const salon = await Salon.findById(service.salon);
    if (!salon || salon.owner !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this service'
      });
    }
    
    // Remove service from salon's services array
    salon.services = salon.services.filter(id => id.toString() !== serviceId);
    await salon.save();
    
    // Delete service
    await Service.findByIdAndDelete(serviceId);
    
    res.status(200).json({
      status: 'success',
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServicesBySalon,
  getServiceById,
  createService,
  updateService,
  deleteService
};