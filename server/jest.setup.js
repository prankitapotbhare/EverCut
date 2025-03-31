// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '5000';
process.env.MONGODB_URI = 'mongodb://localhost:27017/evercut-test';

// Increase Jest timeout for all tests
jest.setTimeout(30000);