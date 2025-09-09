const request = require('supertest');
const mongoose = require('mongoose');

// Set NODE_ENV to test before requiring app
process.env.NODE_ENV = 'test';

// Firebase Admin mocking removed since authentication is no longer used

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