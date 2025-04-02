
const mongoose = require('mongoose');
const Salon = require('../models/Salon');
const Salonist = require('../models/Salonist');
const salons = require('./data/salons.json');
const logger = require('../utils/logger');
require('dotenv').config({ path: '../../.env' });

async function connectDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evercut';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

async function seedDatabase() {
  try {
    // Connect to the database
    await connectDatabase();
    
    // Clear existing data
    logger.info('Clearing existing salon and salonist data...');
    await Salon.deleteMany({});
    await Salonist.deleteMany({});
    
    // Insert salon data
    logger.info(`Inserting ${salons.length} salon records...`);
    const insertedSalons = await Salon.insertMany(salons);
    
    // Create salonists with proper references
    const salonists = [];
    for (const salon of insertedSalons) {
      const stylists = salon.stylists || [];
      for (const stylist of stylists) {
        salonists.push({
          name: stylist.name,
          salonId: salon._id,
          image: stylist.image,
          specialties: stylist.specialties || [],
          bio: stylist.bio || '',
          availability: stylist.availability || [],
          rating: stylist.rating || 0,
          reviewCount: stylist.reviewCount || 0,
          status: stylist.status || 'active',
          createdAt: stylist.createdAt || new Date(),
          updatedAt: stylist.updatedAt || new Date()
        });
      }
    }
    
    if (salonists.length > 0) {
      logger.info(`Inserting ${salonists.length} salonist records...`);
      await Salonist.insertMany(salonists);
    }
    
    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
}

seedDatabase();
