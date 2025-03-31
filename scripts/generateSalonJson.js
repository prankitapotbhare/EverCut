const fs = require('fs');
const path = require('path');

// Import the mock salons data
const mockSalonsPath = path.join(__dirname, '..', 'client', 'src', 'data', 'mockSalons.js');
const mockSalonsContent = fs.readFileSync(mockSalonsPath, 'utf8');

// Extract the salon data without using eval
let mockSalons = [];

try {
  // Create a temporary file with modified content
  const tempFilePath = path.join(__dirname, 'temp-mock-salons.js');
  
  // Replace export default with module.exports =
  const modifiedContent = mockSalonsContent
    .replace(/export\s+default\s+/g, 'module.exports = ')
    // Handle any ES6 imports by commenting them out
    .replace(/import\s+.*?from\s+['"].*?['"]/g, '// Import removed');
  
  fs.writeFileSync(tempFilePath, modifiedContent);
  
  // Require the temporary file
  mockSalons = require('./temp-mock-salons.js');
  
  // Clean up the temporary file
  fs.unlinkSync(tempFilePath);
  
} catch (error) {
  console.error('Error loading mockSalons.js:', error);
  process.exit(1);
}

if (!mockSalons || !Array.isArray(mockSalons)) {
  console.error('Failed to extract salon data from mockSalons.js');
  process.exit(1);
}

console.log(`Successfully loaded ${mockSalons.length} salons from mockSalons.js`);

// Function to generate salon data in the format expected by the server
function formatSalonForServer(salon) {
  // Convert the location format to match the server model
  const location = {
    type: 'Point',
    coordinates: [salon.location.coordinates.lng, salon.location.coordinates.lat]
  };

  // Convert opening hours to the format expected by the server
  const operatingHours = Object.entries(salon.openingHours).map(([day, hours], index) => {
    // Convert day names to numbers (0-6 for Sunday-Saturday)
    const dayMap = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6
    };

    // Handle "Closed" case
    const open = hours.open === 'Closed' ? 'Closed' : hours.open;
    const close = hours.close === 'Closed' ? 'Closed' : hours.close;

    return {
      day: dayMap[day],
      open,
      close
    };
  });

  // Convert services to match the server model
  const services = salon.services.map(service => ({
    id: service.id.toString(),
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration
  }));

  // Convert packages to match the server model
  const packages = salon.packages.map(pkg => ({
    id: pkg.id.toString(),
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    duration: pkg.duration,
    services: pkg.services
  }));

  // Convert reviews to match the server model
  const reviews = salon.customerReviews.map(review => ({
    id: review.id.toString(),
    userId: `user-${review.id}`, // Mock user ID
    userName: review.userName,
    userImage: review.userImage,
    rating: review.rating,
    comment: review.comment,
    date: new Date(review.date).toISOString()
  }));

  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  // Return the formatted salon object
  return {
    name: salon.name,
    description: salon.description,
    address: {
      street: salon.location.address,
      city: salon.location.city,
      state: salon.location.state,
      zipCode: salon.location.zip,
      country: 'USA'
    },
    location,
    contactPhone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    contactEmail: `info@${salon.name.toLowerCase().replace(/\s+/g, '')}.com`,
    image: salon.image,
    gallery: salon.gallery,
    services,
    packages,
    stylists: [], // We'll add stylists later
    reviews,
    rating: parseFloat(salon.rating),
    reviewCount: salon.reviews,
    operatingHours,
    featured: salon.featured || false,
    featuredReason: salon.featuredReason || null,
    specialOffer: salon.specialOffer || null,
    availability: salon.availability || []
  };
}

// Generate stylists for each salon
function generateStylists(salon) {
  const stylistCount = Math.floor(Math.random() * 5) + 2; // 2-6 stylists
  const stylists = [];

  const firstNames = [
    "Emma", "Olivia", "Ava", "Isabella", "Sophia", "Charlotte", "Mia", "Amelia",
    "Harper", "Evelyn", "Liam", "Noah", "William", "James", "Oliver", "Benjamin",
    "Elijah", "Lucas", "Mason", "Logan", "Alexander", "Ethan", "Jacob", "Michael",
    "Daniel", "Henry", "Jackson", "Sebastian", "Aiden", "Matthew", "Samuel", "David"
  ];

  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
    "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
    "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee",
    "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill"
  ];

  const specialties = salon.services.map(service => service.name);
  const userImagePool = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80",
    "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
  ];

  const bios = [
    "Experienced stylist with a passion for creating beautiful, personalized looks.",
    "Specializes in the latest cutting and coloring techniques for all hair types.",
    "Award-winning stylist with over 10 years of experience in the industry.",
    "Known for creating stunning transformations and attention to detail.",
    "Certified colorist who loves helping clients find their perfect shade.",
    "Passionate about creating styles that enhance each client's unique features.",
    "Trained in New York and Paris, bringing international techniques to every client.",
    "Specializes in natural-looking balayage and dimensional color.",
    "Expert in curly hair textures and specialized cutting techniques.",
    "Dedicated to continuing education to bring clients the latest trends and techniques."
  ];

  for (let i = 0; i < stylistCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Select 2-4 random specialties
    const specialtyCount = Math.floor(Math.random() * 3) + 2;
    const stylistSpecialties = [];
    for (let j = 0; j < specialtyCount; j++) {
      if (specialties.length > 0) {
        const randomIndex = Math.floor(Math.random() * specialties.length);
        stylistSpecialties.push(specialties[randomIndex]);
        // Remove to avoid duplicates
        specialties.splice(randomIndex, 1);
      }
    }

    // Generate availability for each day
    const availability = [];
    for (let day = 0; day < 7; day++) {
      // 80% chance of working on this day
      if (Math.random() < 0.8) {
        const slots = [];
        // Generate time slots from 9 AM to 5 PM in 30-minute increments
        for (let hour = 9; hour < 17; hour++) {
          for (let minute of [0, 30]) {
            // 70% chance of slot being available
            if (Math.random() < 0.7) {
              slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
            }
          }
        }
        availability.push({
          day,
          slots
        });
      }
    }

    stylists.push({
      id: `stylist-${salon.id}-${i + 1}`,
      name: `${firstName} ${lastName}`,
      image: userImagePool[Math.floor(Math.random() * userImagePool.length)],
      specialties: stylistSpecialties,
      bio: bios[Math.floor(Math.random() * bios.length)],
      availability
    });
  }

  return stylists;
}

// Process all salons
const formattedSalons = mockSalons.map(salon => {
  const formattedSalon = formatSalonForServer(salon);
  formattedSalon.stylists = generateStylists(salon);
  return formattedSalon;
});

// Write to JSON files
const outputDir = path.join(__dirname, '..', 'server', 'src', 'data');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write all salons to one file
fs.writeFileSync(
  path.join(outputDir, 'salons.json'),
  JSON.stringify(formattedSalons, null, 2)
);

console.log(`Generated ${formattedSalons.length} salon records in salons.json`);

// Also create individual salon files for easier access
const individualDir = path.join(outputDir, 'salons');
if (!fs.existsSync(individualDir)) {
  fs.mkdirSync(individualDir, { recursive: true });
}

formattedSalons.forEach((salon, index) => {
  fs.writeFileSync(
    path.join(individualDir, `salon-${index + 1}.json`),
    JSON.stringify(salon, null, 2)
  );
});

console.log(`Generated individual salon files in ${individualDir}`);

// Create a seed script that can be used to populate the database
const scriptsDir = path.join(__dirname, '..', 'server', 'src', 'scripts');
// Create scripts directory if it doesn't exist
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

const seedScript = `
const mongoose = require('mongoose');
const Salon = require('../models/Salon');
const salons = require('./salons.json');
const { connectDB } = require('../config/db');
const logger = require('../utils/logger');

async function seedDatabase() {
  try {
    // Connect to the database
    await connectDB();
    
    // Clear existing data
    logger.info('Clearing existing salon data...');
    await Salon.deleteMany({});
    
    // Insert new data
    logger.info(\`Inserting \${salons.length} salon records...\`);
    await Salon.insertMany(salons);
    
    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(\`Error seeding database: \${error.message}\`);
    process.exit(1);
  }
}

seedDatabase();
`;

fs.writeFileSync(
  path.join(scriptsDir, 'seedSalons.js'),
  seedScript
);

console.log('Generated database seed script at server/src/scripts/seedSalons.js');

// Update package.json to include the seed script
const packageJsonPath = path.join(__dirname, '..', 'server', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    if (!packageJson.scripts.seedSalons) {
      packageJson.scripts.seedSalons = 'node src/scripts/seedSalons.js';
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Added seedSalons script to package.json');
    }
  } catch (error) {
    console.error('Error updating package.json:', error.message);
    console.log('You may need to manually add the seedSalons script to your package.json');
  }
} else {
  console.log('package.json not found. You may need to manually add the seedSalons script.');
}

console.log('\nAll done! You can now run the following command to seed your database:');
console.log('npm run seedSalons');