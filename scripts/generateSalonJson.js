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

console.log('Successfully loaded ' + mockSalons.length + ' salons from mockSalons.js');

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
    userId: 'user-' + review.id, // Mock user ID
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
    contactPhone: '(' + (Math.floor(Math.random() * 900) + 100) + ') ' + (Math.floor(Math.random() * 900) + 100) + '-' + (Math.floor(Math.random() * 9000) + 1000),
    contactEmail: 'info@' + salon.name.toLowerCase().replace(/\s+/g, '') + '.com',
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
              slots.push(hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0'));
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
      id: 'stylist-' + salon.id + '-' + (i + 1),
      name: firstName + ' ' + lastName,
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
const outputDir = path.join(__dirname, '..', 'server', 'src', 'scripts', 'data');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write all salons to one file
fs.writeFileSync(
  path.join(outputDir, 'salons.json'),
  JSON.stringify(formattedSalons, null, 2)
);

console.log('Generated ' + formattedSalons.length + ' salon records in salons.json');

// Also create individual salon files for easier access
const individualDir = path.join(outputDir, 'salons');
if (!fs.existsSync(individualDir)) {
  fs.mkdirSync(individualDir, { recursive: true });
}

formattedSalons.forEach((salon, index) => {
  fs.writeFileSync(
    path.join(individualDir, 'salon-' + (index + 1) + '.json'),
    JSON.stringify(salon, null, 2)
  );
});

console.log('Generated individual salon files in ' + individualDir);

// Create a seed script that can be used to populate the database
const scriptsDir = path.join(__dirname, '..', 'server', 'src', 'scripts');
// Create scripts directory if it doesn't exist
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

const seedScript = `const mongoose = require('mongoose');
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
const Review = require('../models/Review'); // Add Review model import

async function connectDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evercut';
    await mongoose.connect(mongoURI);
    logger.info('MongoDB Connected: ' + mongoose.connection.host);
  } catch (error) {
    logger.error('Error connecting to MongoDB: ' + error.message);
    process.exit(1);
  }
}

async function seedSalons() {
  try {
    // Read the salons directory
    const salonsDir = path.join(__dirname, 'data', 'salons');
    const salonFiles = fs.readdirSync(salonsDir).filter(file => file.endsWith('.json'));
    
    logger.info('Found ' + salonFiles.length + ' salon files to import');
    
    // Clear existing data (optional - remove if you want to keep existing data)
    await Salon.deleteMany({});
    await Service.deleteMany({});
    await Package.deleteMany({});
    await Salonist.deleteMany({});
    await Schedule.deleteMany({});
    await Review.deleteMany({});
    
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
          operatingHours: salonData.operatingHours || [],
          rating: 0, // Initialize with 0, will update after reviews are imported
          reviewCount: 0, // Initialize with 0, will update after reviews are imported
          reviews: [], // Initialize with empty array, will update after reviews are imported
          featured: salonData.featured || false,
          featuredReason: salonData.featuredReason || null,
          specialOffer: salonData.specialOffer || null,
          availability: salonData.availability || []
        });
        
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
                  const matchingService = salonData.services && salonData.services.find(s => 
                    s.name.toLowerCase() === includedService.toLowerCase());
                  
                  includedServices.push({
                    name: includedService,
                    description: matchingService && matchingService.description || '',
                    regularPrice: matchingService && matchingService.price || 0
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
              bio: stylistData.bio || 'Experienced stylist at ' + salonData.name,
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
              bio: 'Experienced stylist at ' + salonData.name,
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

        // Import reviews if they exist in the salon data
        if (salonData.reviews && salonData.reviews.length > 0) {
          const reviewPromises = salonData.reviews.map(async (reviewData) => {
            try {
              // Create dummy IDs for required fields - using 'new' with ObjectId constructor
              const userId = new mongoose.Types.ObjectId();
              const bookingId = new mongoose.Types.ObjectId();
              
              // Create a new review
              const review = new Review({
                userId: userId,
                salonId: salon._id,
                salonistId: reviewData.salonistId || null,
                bookingId: bookingId,
                rating: reviewData.rating || 5, // Default to 5 if not provided
                comment: reviewData.comment || '',
                images: reviewData.images || [],
                createdAt: reviewData.date ? new Date(reviewData.date) : new Date(),
                updatedAt: reviewData.date ? new Date(reviewData.date) : new Date()
              });
              
              await review.save();
              return review;
            } catch (error) {
              logger.error('Error creating review: ' + error.message);
              return null;
            }
          });
          
          // Wait for all reviews to be created
          const savedReviews = (await Promise.all(reviewPromises)).filter(review => review !== null);
          
          if (savedReviews.length > 0) {
            // Calculate average rating
            const totalRating = savedReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = parseFloat((totalRating / savedReviews.length).toFixed(1));
            
            // Update salon with review data
            salon.rating = salonData.rating || averageRating; // Use provided rating or calculate
            salon.reviewCount = salonData.reviewCount || savedReviews.length; // Use provided count or actual count
            salon.reviews = savedReviews.map(review => review._id);
          }
        } else {
          // If no reviews in JSON, check if there's a rating and reviewCount directly in the salon data
          if (salonData.rating || salonData.reviewCount) {
            salon.rating = salonData.rating || 0;
            salon.reviewCount = salonData.reviewCount || 0;
          }
        }
        
        // Update salon with references to services, packages, and salonists
        salon.services = serviceIds;
        salon.packages = packageIds;
        salon.salonists = salonistIds;
        
        // Save the updated salon with all references
        await salon.save();
        
        logger.info('Imported salon ' + (index + 1) + '/' + salonFiles.length + ': ' + salon.name);
        if (salon.reviews && salon.reviews.length > 0) {
          logger.info('Imported ' + salon.reviews.length + ' reviews for salon: ' + salon.name);
          logger.info('Updated salon rating to ' + salon.rating + ' with ' + salon.reviewCount + ' reviews');
        }
      } catch (error) {
        const salonName = salonFile.replace('.json', '').replace('salon-', '');
        logger.error('Error importing salon ' + salonName + ': ' + error.message);
      }
    }
    
    logger.info('Import completed successfully');
  } catch (error) {
    logger.error('Import failed: ' + error.message);
  }
}

async function run() {
  try {
    await connectDatabase();
    await seedSalons();
    logger.info('Script completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Script failed: ' + error.message);
    process.exit(1);
  }
}

run();`;

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

// node scripts/generateSalonJson.js