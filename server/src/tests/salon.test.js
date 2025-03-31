const request = require('supertest');
const mongoose = require('mongoose');

// Set NODE_ENV to test before requiring app
process.env.NODE_ENV = 'test';

// Mock Firebase Admin before requiring app
jest.mock('firebase-admin', () => {
  const mockAuth = {
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: 'test-user-id',
      email: 'test@example.com',
      email_verified: true
    }),
    getUser: jest.fn().mockResolvedValue({
      customClaims: { admin: true }
    })
  };

  const mockFirestore = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      empty: false,
      docs: [
        {
          id: 'salon-1',
          data: () => ({
            name: 'Test Salon',
            description: 'A test salon',
            rating: 4.5
          }),
          exists: true
        }
      ]
    })
  };

  return {
    initializeApp: jest.fn(),
    apps: ['mockApp'], // Simulate that Firebase is already initialized
    auth: jest.fn().mockReturnValue(mockAuth),
    firestore: jest.fn().mockReturnValue(mockFirestore),
    credential: {
      cert: jest.fn().mockReturnValue({})
    }
  };
});

// Mock MongoDB connection
jest.mock('../config/database', () => ({
  connectDatabase: jest.fn().mockResolvedValue(true)
}));

// Now require the app after mocking
const app = require('../app');

// Clean up after all tests
afterAll(async () => {
  // Add this to ensure Jest exits properly
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('Salon API', () => {
  // Test for getting all salons
  describe('GET /api/salons', () => {
    it('should get all salons', async () => {
      const res = await request(app).get('/api/salons');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // Test for getting a salon by ID
  describe('GET /api/salons/:id', () => {
    it('should get a salon by ID', async () => {
      // Use the exact ID that our mock controller is expecting
      const res = await request(app).get('/api/salons/salon-1');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Salon');
    });

    it('should return 404 for non-existent salon', async () => {
      const res = await request(app).get('/api/salons/non-existent-id');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });
});