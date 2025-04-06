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
    // Read the salons.json file
    const salonsFilePath = path.join(__dirname, 'data', 'salons.json');
    const salonsData = JSON.parse(fs.readFileSync(salonsFilePath, 'utf8'));
    
    logger.info(`Found ${salonsData.length} salons to import`);
    
    // Clear existing data (optional - remove if you want to keep existing data)
    await Salon.deleteMany({});
    await Service.deleteMany({});
    await Package.deleteMany({});
    await Salonist.deleteMany({});
    await Schedule.deleteMany({});
    
    logger.info('Cleared existing data');
    
    // Import each salon
    for (const salonData of salonsData) {
      // Create the salon
      const salon = new Salon({
        name: salonData.name,
        description: salonData.description,
        address: salonData.address,
        location: salonData.location,
        contactPhone: salonData.contactPhone,
        contactEmail: salonData.contactEmail,
        image: salonData.image,
        gallery: salonData.gallery,
        operatingHours: salonData.operatingHours || []
      });
      
      await salon.save();
      logger.info(`Imported salon: ${salon.name}`);
      
      // Import services
      if (salonData.services && salonData.services.length > 0) {
        for (const serviceData of salonData.services) {
          const service = new Service({
            salonId: salon._id,
            name: serviceData.name,
            description: serviceData.description,
            price: serviceData.price,
            duration: parseDuration(serviceData.duration),
            category: serviceData.category || 'General',
            image: serviceData.image
          });
          
          await service.save();
        }
        logger.info(`Imported ${salonData.services.length} services for ${salon.name}`);
      }
      
      // Import packages
      if (salonData.packages && salonData.packages.length > 0) {
        for (const packageData of salonData.packages) {
          const packageDoc = new Package({
            salonId: salon._id,
            name: packageData.name,
            description: packageData.description,
            price: packageData.price,
            duration: parseDuration(packageData.duration),
            services: packageData.services.map(service => ({
              name: service,
              description: '',
              regularPrice: 0
            }))
          });
          
          await packageDoc.save();
        }
        logger.info(`Imported ${salonData.packages.length} packages for ${salon.name}`);
      }
      
      // Import stylists
      if (salonData.stylists && salonData.stylists.length > 0) {
        for (const stylistData of salonData.stylists) {
          const salonist = new Salonist({
            salonId: salon._id,
            name: stylistData.name,
            image: stylistData.image,
            specialties: stylistData.specialties || [],
            bio: stylistData.bio,
            status: stylistData.status || 'active',
            rating: stylistData.rating || 0,
            reviewCount: stylistData.reviewCount || 0
          });
          
          await salonist.save();
          
          // Import availability as schedules
          if (stylistData.availability && stylistData.availability.length > 0) {
            for (const availabilityData of stylistData.availability) {
              const schedule = new Schedule({
                salonistId: salonist._id,
                salonId: salon._id,
                dayOfWeek: availabilityData.day,
                timeSlots: availabilityData.slots || []
              });
              
              await schedule.save();
            }
          }
        }
        logger.info(`Imported ${salonData.stylists.length} stylists for ${salon.name}`);
      }
    }
    
    logger.info('Salon data import completed successfully');
  } catch (error) {
    logger.error(`Error importing salon data: ${error.message}`);
    console.error(error);
  }
}

// Helper function to parse duration strings like "1 hr", "30 min", "2.5 hrs" to minutes
function parseDuration(durationStr) {
  if (!durationStr) return 60; // Default to 60 minutes
  
  const hours = durationStr.match(/(\d+(\.\d+)?)\s*hr/);
  const minutes = durationStr.match(/(\d+)\s*min/);
  
  let totalMinutes = 0;
  
  if (hours) {
    totalMinutes += parseFloat(hours[1]) * 60;
  }
  
  if (minutes) {
    totalMinutes += parseInt(minutes[1]);
  }
  
  return totalMinutes || 60; // Default to 60 minutes if parsing fails
}

// Run the import process
async function run() {
  await connectDatabase();
  await importSalons();
  process.exit(0);
}

run();