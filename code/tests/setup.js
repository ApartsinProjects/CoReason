// Global test setup
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret';

// Suppress Winston console logs during tests
process.env.LOG_LEVEL = 'silent';
