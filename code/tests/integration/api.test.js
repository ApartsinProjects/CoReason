'use strict';

const request = require('supertest');
const { startServer } = require('../../server/index');

let app, server, db;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
  process.env.PORT = '0'; // Use random available port
  const result = await startServer();
  app = result.app;
  server = result.server;
  db = result.db;

  // Run migrations
  await db.migrate.latest();
});

afterAll(async () => {
  server.close();
  await db.destroy();
});

describe('Health Check', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth API', () => {
  it('GET /api/v1/auth/me returns 401 when not logged in', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/auth/register creates a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'integration@test.com',
        password: 'password123',
        name: 'Integration Test',
        role: 'student',
      });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('integration@test.com');
  });

  it('POST /api/v1/auth/register rejects duplicate email', async () => {
    await request(app).post('/api/v1/auth/register').send({
      email: 'dup-int@test.com', password: 'pass123', name: 'First', role: 'student',
    });
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'dup-int@test.com', password: 'pass456', name: 'Second', role: 'student',
    });
    expect(res.status).toBe(409);
  });
});

describe('Institutions API', () => {
  it('GET /api/v1/institutions returns list', async () => {
    // Seed an institution
    await db('institutions').insert({
      id: require('uuid').v4(),
      name: 'Test Uni',
      departments: '["CS"]',
    });
    const res = await request(app).get('/api/v1/institutions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('Protected endpoints require auth', () => {
  const protectedEndpoints = [
    ['GET', '/api/v1/users/me'],
    ['GET', '/api/v1/analytics/student'],
  ];

  test.each(protectedEndpoints)('%s %s returns 401', async (method, path) => {
    const res = await request(app)[method.toLowerCase()](path);
    expect(res.status).toBe(401);
  });
});
