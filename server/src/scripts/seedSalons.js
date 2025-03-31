
const mongoose = require('mongoose');
const Salon = require('../models/Salon');
const salons = require('../data/salons.json');
const logger = require('../utils/logger');
require('dotenv').config({ path: '../../.env' }); // Load environment variables from root .env file

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
    logger.info('Clearing existing salon data...');
    await Salon.deleteMany({});
    
    // Insert new data
    logger.info(`Inserting ${salons.length} salon records...`);
    await Salon.insertMany(salons);
    
    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
}

seedDatabase();
