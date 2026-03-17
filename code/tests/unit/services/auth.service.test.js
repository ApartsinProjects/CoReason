'use strict';

const knex = require('knex');
const { AuthService } = require('../../../server/services/auth.service');

const silentLogger = { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} };

describe('AuthService', () => {
  let db, authService;

  beforeAll(async () => {
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    });
    // Run migrations
    const migration001 = require('../../../server/db/migrations/001_initial_schema');
    const migration002 = require('../../../server/db/migrations/002_add_department_and_indexes');
    await migration001.up(db);
    await migration002.up(db);
    authService = new AuthService(db, silentLogger);
  });

  afterAll(async () => { await db.destroy(); });

  afterEach(async () => {
    await db('users').del();
    await db('institutions').del();
  });

  describe('register', () => {
    it('registers a new student successfully', async () => {
      const user = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'student',
      });
      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('student');
      expect(user.password_hash).toBeUndefined(); // should not expose hash
    });

    it('registers a new instructor successfully', async () => {
      const user = await authService.register({
        email: 'prof@example.com',
        password: 'password123',
        name: 'Professor',
        role: 'instructor',
      });
      expect(user.role).toBe('instructor');
    });

    it('rejects duplicate email', async () => {
      await authService.register({
        email: 'dup@example.com', password: 'pass123', name: 'First', role: 'student',
      });
      await expect(authService.register({
        email: 'dup@example.com', password: 'pass456', name: 'Second', role: 'student',
      })).rejects.toThrow('Email already registered');
    });

    it('rejects invalid role', async () => {
      await expect(authService.register({
        email: 'bad@example.com', password: 'pass123', name: 'Bad', role: 'admin',
      })).rejects.toThrow('Invalid role');
    });

    it('normalizes email to lowercase', async () => {
      const user = await authService.register({
        email: 'UPPER@EXAMPLE.COM', password: 'pass123', name: 'Upper', role: 'student',
      });
      expect(user.email).toBe('upper@example.com');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await authService.register({
        email: 'login@example.com', password: 'correct123', name: 'Login Test', role: 'student',
      });
    });

    it('logs in with correct credentials', async () => {
      const user = await authService.login('login@example.com', 'correct123');
      expect(user.email).toBe('login@example.com');
      expect(user.password_hash).toBeUndefined();
    });

    it('rejects wrong password', async () => {
      await expect(authService.login('login@example.com', 'wrong'))
        .rejects.toThrow('Invalid email or password');
    });

    it('rejects non-existent email', async () => {
      await expect(authService.login('nobody@example.com', 'pass'))
        .rejects.toThrow('Invalid email or password');
    });
  });

  describe('findOrCreateByGoogle', () => {
    it('creates new user from Google profile', async () => {
      const user = await authService.findOrCreateByGoogle({
        id: 'google-123',
        displayName: 'Google User',
        emails: [{ value: 'google@example.com' }],
        photos: [{ value: 'https://photo.url' }],
      });
      expect(user.email).toBe('google@example.com');
      expect(user.google_id).toBe('google-123');
      expect(user.role).toBe('student'); // default role
    });

    it('finds existing user by google_id', async () => {
      // Create first
      await authService.findOrCreateByGoogle({
        id: 'google-456',
        displayName: 'Existing',
        emails: [{ value: 'existing@example.com' }],
        photos: [],
      });
      // Find again
      const user = await authService.findOrCreateByGoogle({
        id: 'google-456',
        displayName: 'Existing',
        emails: [{ value: 'existing@example.com' }],
        photos: [],
      });
      expect(user.email).toBe('existing@example.com');
    });
  });
});
