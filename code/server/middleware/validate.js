'use strict';

const { ValidationError } = require('../utils/errors');

/**
 * Express middleware factory for Zod schema validation.
 * @param {object} schemas - { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }
 */
function validate(schemas) {
  return (req, res, next) => {
    const errors = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(...result.error.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message,
          location: 'body',
        })));
      } else {
        req.body = result.data;  // Use parsed/coerced values
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(...result.error.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message,
          location: 'query',
        })));
      } else {
        req.query = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(...result.error.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message,
          location: 'params',
        })));
      } else {
        req.params = result.data;
      }
    }

    if (errors.length > 0) {
      return next(new ValidationError('Validation failed', errors));
    }

    next();
  };
}

module.exports = { validate };
