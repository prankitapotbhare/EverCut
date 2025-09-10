const fs = require('fs');
const path = require('path');

// Import the mock salons data
const mockSalonsPath = path.join(__dirname, '..', 'client', 'src', 'data', 'mockSalons.js');
const mockSalonsContent = fs.readFileSync(mockSalonsPath, 'utf8');

// Simple extraction of salon data
let mockSalons = [];
let tempFilePath = null;
try {
  // Create a temporary file with modified content for Node.js compatibility
  tempFilePath = path.join(__dirname, 'temp-mock-salons.js');
  
  // Replace export default with module.exports and handle ES6 syntax
  const modifiedContent = mockSalonsContent
    .replace(/export\s+default\s+mockSalons;?/g, 'module.exports = mockSalons;')
    .replace(/import\s+.*?from\s+['"'].*?['"'];?/g, '// Import removed');
  
  fs.writeFileSync(tempFilePath, modifiedContent);
  
  // Clear require cache to avoid stale data
  delete require.cache[require.resolve('./temp-mock-salons.js')];
  
  // Require the temporary file
  mockSalons = require('./temp-mock-salons.js');
  
} catch (error) {
  console.error('Error loading mockSalons.js:', error);
  process.exit(1);
} finally {
  // Clean up the temporary file
  if (tempFilePath && fs.existsSync(tempFilePath)) {
    try {
      fs.unlinkSync(tempFilePath);
    } catch (cleanupError) {
      console.warn('Warning: Could not clean up temporary file:', cleanupError.message);
    }
  }
}

if (!mockSalons || !Array.isArray(mockSalons)) {
  console.error('Failed to extract salon data from mockSalons.js');
  process.exit(1);
}

console.log('Successfully loaded ' + mockSalons.length + ' salons from mockSalons.js');

// Utility function to parse duration
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
  return 30; // Default
}

// Function to generate salon data in the format expected by the server
function formatSalonForServer(salon) {
  // Convert the location format to match the server model
  const location = {
    type: 'Point',
    coordinates: [salon.location.coordinates.lng, salon.location.coordinates.lat]
  };

  // Convert opening hours to the format expected by the server
  const dayMap = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };

  const operatingHours = Object.entries(salon.openingHours).map(([day, hours]) => ({
    day: dayMap[day],
    open: hours.open === 'Closed' ? 'Closed' : hours.open,
    close: hours.close === 'Closed' ? 'Closed' : hours.close
  }));

  // Convert services to match the server model
  const services = salon.services.map(service => ({
    id: service.id.toString(),
    name: service.name,
    description: service.description,
    price: typeof service.price === 'string' ? parseInt(service.price, 10) : service.price,
    duration: parseDuration(service.duration)
  }));

  // Convert packages to match the server model
  const packages = salon.packages.map(pkg => ({
    id: pkg.id.toString(),
    name: pkg.name,
    description: pkg.description,
    price: typeof pkg.price === 'string' ? parseInt(pkg.price, 10) : pkg.price,
    duration: parseDuration(pkg.duration),
    services: pkg.services
  }));

  // Convert reviews to match the server model
  const reviews = salon.customerReviews.map(review => ({
    id: review.id.toString(),
    userId: 'user-' + review.id,
    userName: review.userName,
    userImage: review.userImage,
    rating: review.rating,
    comment: review.comment,
    date: new Date(review.date).toISOString()
  }));

  // Generate stylists for the salon
  const stylists = generateStylists(salon);

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
    location,
    contactPhone: '+91 ' + (Math.floor(Math.random() * 90000) + 10000) + ' ' + (Math.floor(Math.random() * 90000) + 10000),
    contactEmail: 'info@' + salon.name.toLowerCase().replace(/\s+/g, '') + '.com',
    image: salon.image,
    gallery: salon.gallery,
    services,
    packages,
    stylists,
    reviews,
    rating: typeof salon.rating === 'string' ? parseFloat(salon.rating) : salon.rating,
    reviewCount: typeof salon.reviews === 'string' ? parseInt(salon.reviews, 10) : salon.reviews,
    operatingHours,
    featured: salon.featured || false,
    featuredReason: salon.featuredReason || null,
    specialOffer: salon.specialOffer || null,
    availability: salon.availability || []
  };
}

// Generate stylists for each salon
function generateStylists(salon) {
  const stylistCount = Math.floor(Math.random() * 3) + 2; // 2-4 stylists
  const stylists = [];

  const names = [
    "Anjali Sharma", "Priya Patel", "Kavya Reddy", "Sneha Gupta", "Riya Singh",
    "Meera Nair", "Pooja Agarwal", "Divya Joshi", "Neha Kumar", "Shreya Iyer"
  ];

  const bios = [
    "Experienced stylist with a passion for creating beautiful, personalized looks.",
    "Specializes in the latest cutting and coloring techniques for all hair types.",
    "Award-winning stylist with over 10 years of experience in the industry.",
    "Known for creating stunning transformations and attention to detail.",
    "Certified colorist who loves helping clients find their perfect shade."
  ];

  const defaultAvailability = [
    { day: 1, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
    { day: 2, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
    { day: 3, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
    { day: 4, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] },
    { day: 5, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] }
  ];

  for (let i = 0; i < stylistCount; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const bio = bios[Math.floor(Math.random() * bios.length)];
    const specialties = salon.services.slice(0, 3).map(service => service.name);

    stylists.push({
      id: (i + 1).toString(),
      name,
      image: `https://images.unsplash.com/photo-${1494790108377 + i}?w=500&q=80`,
      specialties,
      bio,
      availability: defaultAvailability,
      status: 'active'
    });
  }

  return stylists;
}

// Process all salons
const formattedSalons = mockSalons.map(salon => {
  const formatted = formatSalonForServer(salon);
  return formatted;
});

// Create output directories
const outputDir = path.join(__dirname, '..', 'server', 'src', 'scripts', 'data');
const salonsDir = path.join(outputDir, 'salons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create salons directory if it doesn't exist
if (!fs.existsSync(salonsDir)) {
  fs.mkdirSync(salonsDir, { recursive: true });
}

// Write individual salon files
formattedSalons.forEach((salon, index) => {
  const salonFileName = `salon-${index + 1}.json`;
  try {
    fs.writeFileSync(
      path.join(salonsDir, salonFileName),
      JSON.stringify(salon, null, 2)
    );
  } catch (error) {
    console.error(`Error writing ${salonFileName}:`, error.message);
    process.exit(1);
  }
});

// Also write the combined salons.json file for backward compatibility
try {
  fs.writeFileSync(
    path.join(outputDir, 'salons.json'),
    JSON.stringify(formattedSalons, null, 2)
  );
} catch (error) {
  console.error('Error writing salons.json:', error.message);
  process.exit(1);
}

console.log('Generated ' + formattedSalons.length + ' individual salon files in salons/ directory');
console.log('Also created combined salons.json for backward compatibility');
console.log('\nTo seed the database, run: npm run seedSalons');
console.log('Make sure your seedSalons.js script is properly configured in the server.');