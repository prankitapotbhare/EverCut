const Salon = require('../../models/Salon');

// Test data for salons
const salonData = [
  {
    name: 'Test Salon 1',
    description: 'A test salon for unit testing',
    address: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'Test Country'
    },
    location: {
      type: 'Point',
      coordinates: [40.7128, -74.0060]
    },
    contactPhone: '123-456-7890',
    contactEmail: 'test@testsalon.com',
    images: ['https://firebasestorage.example.com/test-image-1.jpg'],
    operatingHours: [
      {
        day: 1, // Monday
        open: '09:00',
        close: '18:00'
      },
      {
        day: 2, // Tuesday
        open: '09:00',
        close: '18:00'
      }
    ],
    averageRating: 4.5,
    reviewCount: 10
  },
  {
    name: 'Test Salon 2',
    description: 'Another test salon for unit testing',
    address: {
      street: '456 Test Avenue',
      city: 'Another City',
      state: 'Another State',
      zipCode: '67890',
      country: 'Test Country'
    },
    location: {
      type: 'Point',
      coordinates: [34.0522, -118.2437]
    },
    contactPhone: '987-654-3210',
    contactEmail: 'test2@testsalon.com',
    images: ['https://firebasestorage.example.com/test-image-2.jpg'],
    operatingHours: [
      {
        day: 1, // Monday
        open: '10:00',
        close: '19:00'
      },
      {
        day: 2, // Tuesday
        open: '10:00',
        close: '19:00'
      }
    ],
    averageRating: 4.2,
    reviewCount: 5
  }
];

// Function to seed the database with test data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Salon.deleteMany({});
    
    // Insert test data
    const salons = await Salon.insertMany(salonData);
    
    // Return the created data for use in tests
    return {
      salons
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = {
  seedDatabase,
  salonData
};