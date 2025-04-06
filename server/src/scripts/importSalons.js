const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Load environment variables
dotenv.config();

// Import models
const Salon = require('../models/Salon');
const Service = require('../models/Service');
const Package = require('../models/Package');
const Salonist = require('../models/Salonist');
const Schedule = require('../models/Schedule');

async function connectDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evercut';
    await mongoose.connect(mongoURI);
    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

async function importSalons() {
  try {
    // Read the salons directory
    const salonsDir = path.join(__dirname, 'data', 'salons');
    const salonFiles = fs.readdirSync(salonsDir).filter(file => file.endsWith('.json'));
    
    logger.info(`Found ${salonFiles.length} salon files to import`);
    
    // Clear existing data (optional - remove if you want to keep existing data)
    await Salon.deleteMany({});
    await Service.deleteMany({});
    await Package.deleteMany({});
    await Salonist.deleteMany({});
    await Schedule.deleteMany({});
    
    logger.info('Cleared existing data');
    
    // Import each salon
    for (const [index, salonFile] of salonFiles.entries()) {
      try {
        // Read salon data from file
        const salonData = JSON.parse(fs.readFileSync(path.join(salonsDir, salonFile), 'utf8'));
        
        // Create the salon
        const salon = new Salon({
          name: salonData.name,
          description: salonData.description,
          address: salonData.address,
          location: salonData.location,
          contactPhone: salonData.contactPhone,
          contactEmail: salonData.contactEmail,
          image: salonData.image,
          gallery: salonData.gallery || [],
          amenities: salonData.amenities || [],
          operatingHours: salonData.operatingHours || [
            { day: 0, open: '11:00 AM', close: '5:00 PM' },
            { day: 1, open: '9:00 AM', close: '7:00 PM' },
            { day: 2, open: '9:00 AM', close: '7:00 PM' },
            { day: 3, open: '9:00 AM', close: '7:00 PM' },
            { day: 4, open: '9:00 AM', close: '7:00 PM' },
            { day: 5, open: '9:00 AM', close: '7:00 PM' },
            { day: 6, open: '10:00 AM', close: '6:00 PM' }
          ]
        });
        
        // Save the salon to get an _id
        await salon.save();
        
        // Create services for this salon
        const serviceIds = [];
        const serviceMap = {}; // Map service IDs to MongoDB IDs
        
        if (salonData.services && salonData.services.length > 0) {
          for (const serviceData of salonData.services) {
            // Ensure duration is at least 5 minutes
            let duration = serviceData.duration;
            if (typeof duration === 'string') {
              if (duration.includes('min')) {
                duration = Math.max(5, parseInt(duration));
              } else if (duration.includes('hr')) {
                duration = Math.max(5, Math.round(parseFloat(duration) * 60));
              } else {
                duration = Math.max(5, parseInt(duration) || 30);
              }
            } else if (typeof duration === 'number') {
              duration = Math.max(5, duration);
            } else {
              duration = 30; // Default
            }
            
            const service = new Service({
              salonId: salon._id,
              name: serviceData.name,
              description: serviceData.description,
              price: serviceData.price,
              duration: duration,
              category: serviceData.category || 'General',
              image: serviceData.image || salon.image,
              isActive: true
            });
            
            await service.save();
            serviceIds.push(service._id);
            
            // Store the mapping from service ID to MongoDB ID
            if (serviceData.id) {
              serviceMap[serviceData.id] = service._id;
            }
          }
        }
        
        // Create packages for this salon
        const packageIds = [];
        if (salonData.packages && salonData.packages.length > 0) {
          for (const packageData of salonData.packages) {
            // Ensure duration is at least 15 minutes
            let duration = packageData.duration;
            if (typeof duration === 'string') {
              if (duration.includes('min')) {
                duration = Math.max(15, parseInt(duration));
              } else if (duration.includes('hr')) {
                duration = Math.max(15, Math.round(parseFloat(duration) * 60));
              } else {
                duration = Math.max(15, parseInt(duration) || 60);
              }
            } else if (typeof duration === 'number') {
              duration = Math.max(15, duration);
            } else {
              duration = 60; // Default
            }
            
            const includedServices = [];
            
            // Create included services
            if (packageData.services && packageData.services.length > 0) {
              for (const includedService of packageData.services) {
                // Handle both object and string formats
                if (typeof includedService === 'object') {
                  includedServices.push({
                    name: includedService.name || 'Unnamed Service',
                    description: includedService.description || '',
                    regularPrice: includedService.price || 0
                  });
                } else if (typeof includedService === 'string') {
                  // Find a matching service by name
                  const matchingService = salonData.services?.find(s => 
                    s.name.toLowerCase() === includedService.toLowerCase());
                  
                  includedServices.push({
                    name: includedService,
                    description: matchingService?.description || '',
                    regularPrice: matchingService?.price || 0
                  });
                }
              }
            }
            
            // Ensure we have at least one service if array is empty
            if (includedServices.length === 0) {
              includedServices.push({
                name: 'Package Service',
                description: 'Included in package',
                regularPrice: 0
              });
            }
            
            const packageObj = new Package({
              salonId: salon._id,
              name: packageData.name,
              description: packageData.description,
              price: packageData.price,
              discountPercentage: packageData.discountPercentage || 10,
              duration: duration,
              services: includedServices,
              isActive: true
            });
            
            await packageObj.save();
            packageIds.push(packageObj._id);
          }
        }
        
        // Create stylists (salonists) for this salon
        const salonistIds = [];
        if (salonData.stylists && salonData.stylists.length > 0) {
          for (const stylistData of salonData.stylists) {
            const salonist = new Salonist({
              name: stylistData.name,
              salonId: salon._id,
              image: stylistData.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80',
              specialties: stylistData.specialties || [],
              bio: stylistData.bio || `Experienced stylist at ${salonData.name}`,
              availability: stylistData.availability || [
                { day: 1, slots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] },
                { day: 2, slots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] },
                { day: 3, slots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] },
                { day: 4, slots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] },
                { day: 5, slots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] }
              ],
              status: 'active'
            });
            
            await salonist.save();
            salonistIds.push(salonist._id);
            
            // Create schedule for this salonist
            for (let day = 0; day <= 6; day++) {
              // Skip days where the stylist doesn't work
              const availabilityForDay = salonist.availability.find(a => a.day === day);
              if (!availabilityForDay) continue;
              
              const schedule = new Schedule({
                salonistId: salonist._id,
                salonId: salon._id,
                dayOfWeek: day,
                timeSlots: availabilityForDay.slots.map(slot => ({
                  startTime: slot,
                  endTime: '' // Will be calculated based on service duration
                }))
              });
              
              await schedule.save();
            }
          }
        } else {
          // Create default stylists if none provided
          const defaultStylistNames = ['Alex Johnson', 'Jamie Smith', 'Taylor Williams'];
          
          for (const name of defaultStylistNames) {
            const salonist = new Salonist({
              name: name,
              salonId: salon._id,
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80',
              specialties: ['Haircut', 'Styling', 'Color'],
              bio: `Experienced stylist at ${salonData.name}`,
              availability: [
                { day: 1, slots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] },
                { day: 2, slots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] },
                { day: 3, slots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] },
                { day: 4, slots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] },
                { day: 5, slots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] }
              ],
              status: 'active'
            });
            
            await salonist.save();
            salonistIds.push(salonist._id);
            
            // Create schedule for this salonist
            for (let day = 1; day <= 5; day++) {
              const schedule = new Schedule({
                salonistId: salonist._id,
                salonId: salon._id,
                dayOfWeek: day,
                timeSlots: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"].map(slot => ({
                  startTime: slot,
                  endTime: '' // Will be calculated based on service duration
                }))
              });
              
              await schedule.save();
            }
          }
        }
        
        // Update salon with references to services, packages, and salonists
        salon.services = serviceIds;
        salon.packages = packageIds;
        salon.salonists = salonistIds;
        
        // Save the updated salon
        await salon.save();
        
        logger.info(`Imported salon ${index + 1}/${salonFiles.length}: ${salon.name}`);
      } catch (error) {
        const salonName = salonFile.replace('.json', '').replace('salon-', '');
        logger.error(`Error importing salon ${salonName}: ${error.message}`);
      }
    }
    
    logger.info('Import completed successfully');
  } catch (error) {
    logger.error(`Import failed: ${error.message}`);
  }
}

async function run() {
  try {
    await connectDatabase();
    await importSalons();
    logger.info('Script completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error(`Script failed: ${error.message}`);
    process.exit(1);
  }
}

run();