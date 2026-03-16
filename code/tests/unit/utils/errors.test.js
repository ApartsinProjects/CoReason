'use strict';

const {
  AppError, NotFoundError, ValidationError, AuthError, ForbiddenError, ConflictError, LLMError
} = require('../../../server/utils/errors');

describe('Custom Errors', () => {
  it('AppError has correct properties', () => {
    const err = new AppError('TEST_CODE', 'test message', 418, { detail: 'x' });
    expect(err.code).toBe('TEST_CODE');
    expect(err.message).toBe('test message');
    expect(err.statusCode).toBe(418);
    expect(err.details).toEqual({ detail: 'x' });
    expect(err.toJSON().error.code).toBe('TEST_CODE');
  });

  it('NotFoundError is 404', () => {
    const err = new NotFoundError('User', '123');
    expect(err.statusCode).toBe(404);
    expect(err.message).toContain('User');
    expect(err.message).toContain('123');
  });

  it('ValidationError is 400', () => {
    const err = new ValidationError('Bad input', { field: 'email' });
    expect(err.statusCode).toBe(400);
  });

  it('AuthError is 401', () => {
    expect(new AuthError().statusCode).toBe(401);
  });

  it('ForbiddenError is 403', () => {
    expect(new ForbiddenError().statusCode).toBe(403);
  });

  it('ConflictError is 409', () => {
    expect(new ConflictError('Duplicate').statusCode).toBe(409);
  });

  it('LLMError is 502', () => {
    expect(new LLMError('API down').statusCode).toBe(502);
  });
});
