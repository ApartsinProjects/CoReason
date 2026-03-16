'use strict';

class AppError extends Error {
  constructor(code, message, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource.toUpperCase()}_NOT_FOUND`, `${resource} with ID ${id} not found`, 404, { id });
  }
}

class ValidationError extends AppError {
  constructor(message, details) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

class AuthError extends AppError {
  constructor(message = 'Authentication required') {
    super('AUTH_REQUIRED', message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super('FORBIDDEN', message, 403);
  }
}

class ConflictError extends AppError {
  constructor(message, details) {
    super('CONFLICT', message, 409, details);
  }
}

class LLMError extends AppError {
  constructor(message, details) {
    super('LLM_ERROR', message, 502, details);
  }
}

module.exports = { AppError, NotFoundError, ValidationError, AuthError, ForbiddenError, ConflictError, LLMError };
