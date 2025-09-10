/**
 * Generate Salon JSON Data Script
 * 
 * This script processes mock salon data and converts it into the format
 * expected by the server, creating individual JSON files for each salon
 * and a combined salons.json file for backward compatibility.
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// CONFIGURATION AND CONSTANTS
// =============================================================================

const PATHS = {
  mockSalonsFile: path.join(__dirname, '..', 'client', 'src', 'data', 'mockSalons.js'),
  outputDir: path.join(__dirname, '..', 'server', 'src', 'scripts', 'data'),
  salonsDir: null, // Will be set after outputDir is created
  tempFile: path.join(__dirname, 'temp-mock-salons.js')
};

const DAY_MAP = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6
};

const STYLIST_DATA = {
  names: [
    "Anjali Sharma", "Priya Patel", "Kavya Reddy", "Sneha Gupta", "Riya Singh",
    "Meera Nair", "Pooja Agarwal", "Divya Joshi", "Neha Kumar", "Shreya Iyer"
  ],
  bios: [
    "Experienced stylist with a passion for creating beautiful, personalized looks.",
    "Specializes in the latest cutting and coloring techniques for all hair types.",
    "Award-winning stylist with over 10 years of experience in the industry.",
    "Known for creating stunning transformations and attention to detail.",
    "Certified colorist who loves helping clients find their perfect shade."
  ],
  defaultAvailability: [
    { day: 1, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
    { day: 2, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
    { day: 3, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
    { day: 4, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
    { day: 5, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] }
  ]
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Loads and processes the mock salons data from the client-side file
 * @returns {Array} Array of salon objects
 */
function loadMockSalonsData() {
  let mockSalons = [];
  let tempFilePath = null;

  try {
    // Read the original mock salons file
    const mockSalonsContent = fs.readFileSync(PATHS.mockSalonsFile, 'utf8');

    // Create temporary file path
    tempFilePath = PATHS.tempFile;

    // Convert ES6 module syntax to CommonJS for Node.js compatibility
    const modifiedContent = mockSalonsContent
      .replace(/export\s+default\s+mockSalons;?/g, 'module.exports = mockSalons;')
      .replace(/import\s+.*?from\s+['"'].*?['"'];?/g, '// Import removed');

    // Write temporary file
    fs.writeFileSync(tempFilePath, modifiedContent);

    // Clear require cache to avoid stale data
    delete require.cache[require.resolve('./temp-mock-salons.js')];

    // Load the processed data
    mockSalons = require('./temp-mock-salons.js');

    console.log(`Successfully loaded ${mockSalons.length} salons from mockSalons.js`);

  } catch (error) {
    console.error('Error loading mockSalons.js:', error);
    process.exit(1);
  } finally {
    // Clean up temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.warn('Warning: Could not clean up temporary file:', cleanupError.message);
      }
    }
  }

  // Validate loaded data
  if (!mockSalons || !Array.isArray(mockSalons)) {
    console.error('Failed to extract salon data from mockSalons.js');
    process.exit(1);
  }

  return mockSalons;
}

/**
 * Parses duration string and converts to minutes
 * @param {string|number} duration - Duration in various formats
 * @returns {number} Duration in minutes (minimum 5 minutes)
 */
function parseDuration(duration) {
  if (typeof duration === 'string') {
    if (duration.includes('min')) {
      return Math.max(5, parseInt(duration));
    } else if (duration.includes('hr')) {
      return Math.max(5, Math.round(parseFloat(duration) * 60));
    } else {
      return Math.max(5, parseInt(duration) || 30);
    }
  } else if (typeof duration === 'number') {
    return Math.max(5, duration);
  }
  return 30; // Default duration
}

/**
 * Ensures directories exist, creating them if necessary
 */
function ensureDirectoriesExist() {
  PATHS.salonsDir = path.join(PATHS.outputDir, 'salons');

  // Create main output directory
  if (!fs.existsSync(PATHS.outputDir)) {
    fs.mkdirSync(PATHS.outputDir, { recursive: true });
  }

  // Create salons subdirectory
  if (!fs.existsSync(PATHS.salonsDir)) {
    fs.mkdirSync(PATHS.salonsDir, { recursive: true });
  }
}

// =============================================================================
// DATA TRANSFORMATION FUNCTIONS
// =============================================================================

/**
 * Converts location data to GeoJSON Point format
 * @param {Object} location - Original location object
 * @returns {Object} GeoJSON Point object
 */
function transformLocation(location) {
  return {
    type: 'Point',
    coordinates: [location.coordinates.lng, location.coordinates.lat]
  };
}

/**
 * Converts opening hours to server format with day numbers
 * @param {Object} openingHours - Original opening hours object
 * @returns {Array} Array of operating hours objects
 */
function transformOperatingHours(openingHours) {
  return Object.entries(openingHours).map(([day, hours]) => ({
    day: DAY_MAP[day],
    open: hours.open === 'Closed' ? 'Closed' : hours.open,
    close: hours.close === 'Closed' ? 'Closed' : hours.close
  }));
}

/**
 * Converts services to server format
 * @param {Array} services - Original services array
 * @returns {Array} Transformed services array
 */
function transformServices(services) {
  return services.map(service => ({
    id: service.id.toString(),
    name: service.name,
    description: service.description,
    price: typeof service.price === 'string' ? parseInt(service.price, 10) : service.price,
    duration: parseDuration(service.duration)
  }));
}

/**
 * Converts packages to server format
 * @param {Array} packages - Original packages array
 * @returns {Array} Transformed packages array
 */
function transformPackages(packages) {
  return packages.map(pkg => ({
    id: pkg.id.toString(),
    name: pkg.name,
    description: pkg.description,
    price: typeof pkg.price === 'string' ? parseInt(pkg.price, 10) : pkg.price,
    duration: parseDuration(pkg.duration),
    services: pkg.services
  }));
}

/**
 * Converts customer reviews to server format
 * @param {Array} customerReviews - Original reviews array
 * @returns {Array} Transformed reviews array
 */
function transformReviews(customerReviews) {
  return customerReviews.map(review => ({
    id: review.id.toString(),
    userId: 'user-' + review.id,
    userName: review.userName,
    userImage: review.userImage,
    rating: review.rating,
    comment: review.comment,
    date: new Date(review.date).toISOString()
  }));
}

/**
 * Generates contact information for a salon
 * @param {Object} salon - Salon object
 * @returns {Object} Contact information object
 */
function generateContactInfo(salon) {
  const phoneNumber = '+91 ' + 
    (Math.floor(Math.random() * 90000) + 10000) + ' ' + 
    (Math.floor(Math.random() * 90000) + 10000);

  const email = 'info@' + salon.name.toLowerCase().replace(/\s+/g, '') + '.com';

  return { phoneNumber, email };
}

/**
 * Generates stylists for a salon
 * @param {Object} salon - Salon object
 * @returns {Array} Array of stylist objects
 */
function generateStylists(salon) {
  const stylistCount = Math.floor(Math.random() * 3) + 2; // 2-4 stylists
  const stylists = [];

  for (let i = 0; i < stylistCount; i++) {
    const name = STYLIST_DATA.names[Math.floor(Math.random() * STYLIST_DATA.names.length)];
    const bio = STYLIST_DATA.bios[Math.floor(Math.random() * STYLIST_DATA.bios.length)];
    const specialties = salon.services.slice(0, 3).map(service => service.name);

    stylists.push({
      id: (i + 1).toString(),
      name,
      image: `https://images.unsplash.com/photo-${1494790108377 + i}?w=500&q=80`,
      specialties,
      bio,
      availability: STYLIST_DATA.defaultAvailability,
      status: 'active'
    });
  }

  return stylists;
}

// =============================================================================
// MAIN TRANSFORMATION FUNCTION
// =============================================================================

/**
 * Transforms a single salon object to server format
 * @param {Object} salon - Original salon object
 * @returns {Object} Transformed salon object for server
 */
function formatSalonForServer(salon) {
  const contactInfo = generateContactInfo(salon);

  return {
    name: salon.name,
    description: salon.description,
    address: {
      street: salon.location.address,
      city: salon.location.city,
      state: salon.location.state,
      zipCode: salon.location.zip,
      country: 'India'
    },
    location: transformLocation(salon.location),
    contactPhone: contactInfo.phoneNumber,
    contactEmail: contactInfo.email,
    image: salon.image,
    gallery: salon.gallery,
    services: transformServices(salon.services),
    packages: transformPackages(salon.packages),
    stylists: generateStylists(salon),
    reviews: transformReviews(salon.customerReviews),
    rating: typeof salon.rating === 'string' ? parseFloat(salon.rating) : salon.rating,
    reviewCount: typeof salon.reviews === 'string' ? parseInt(salon.reviews, 10) : salon.reviews,
    operatingHours: transformOperatingHours(salon.openingHours),
    featured: salon.featured || false,
    featuredReason: salon.featuredReason || null,
    specialOffer: salon.specialOffer || null,
    availability: salon.availability || []
  };
}

// =============================================================================
// FILE OPERATIONS
// =============================================================================

/**
 * Writes individual salon JSON files
 * @param {Array} formattedSalons - Array of formatted salon objects
 */
function writeIndividualSalonFiles(formattedSalons) {
  let successCount = 0;
  let errorCount = 0;

  formattedSalons.forEach((salon, index) => {
    const salonFileName = `salon-${index + 1}.json`;
    const filePath = path.join(PATHS.salonsDir, salonFileName);

    try {
      fs.writeFileSync(filePath, JSON.stringify(salon, null, 2));
      successCount++;
    } catch (error) {
      console.error(`Error writing ${salonFileName}:`, error.message);
      errorCount++;
    }
  });

  if (errorCount > 0) {
    console.error(`Failed to write ${errorCount} salon files`);
    process.exit(1);
  }

  console.log(`Generated ${successCount} individual salon files in salons/ directory`);
}

/**
 * Writes the combined salons.json file
 * @param {Array} formattedSalons - Array of formatted salon objects
 */
function writeCombinedSalonsFile(formattedSalons) {
  const filePath = path.join(PATHS.outputDir, 'salons.json');

  try {
    fs.writeFileSync(filePath, JSON.stringify(formattedSalons, null, 2));
    console.log('Also created combined salons.json for backward compatibility');
  } catch (error) {
    console.error('Error writing salons.json:', error.message);
    process.exit(1);
  }
}

/**
 * Displays final instructions to the user
 */
function displayCompletionMessage() {
  console.log('\nTo seed the database, run: npm run seedSalons');
  console.log('Make sure your seedSalons.js script is properly configured in the server.');
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

/**
 * Main execution function that orchestrates the entire process
 */
function main() {
  try {
    console.log('Starting salon JSON generation process...\n');

    // Load mock salon data
    const mockSalons = loadMockSalonsData();

    // Ensure output directories exist
    ensureDirectoriesExist();

    // Transform all salons to server format
    console.log('Processing and transforming salon data...');
    const formattedSalons = mockSalons.map(salon => formatSalonForServer(salon));

    // Write individual salon files
    console.log('Writing individual salon JSON files...');
    writeIndividualSalonFiles(formattedSalons);

    // Write combined salons file
    console.log('Writing combined salons.json file...');
    writeCombinedSalonsFile(formattedSalons);

    // Display completion message
    displayCompletionMessage();

    console.log('\nSalon JSON generation completed successfully!');

  } catch (error) {
    console.error('Fatal error during salon JSON generation:', error);
    process.exit(1);
  }
}

// Execute main function if this script is run directly
if (require.main === module) {
  main();
}

// Export functions for testing or external use
module.exports = {
  loadMockSalonsData,
  formatSalonForServer,
  parseDuration,
  generateStylists,
  main
};