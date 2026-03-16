'use strict';

const { AppError } = require('../utils/errors');
const { LRUCache } = require('lru-cache');

// Cache recent errors for monitoring
const errorCache = new LRUCache({ max: 1000, ttl: 3600000 }); // 1 hour TTL

function errorHandler(logger) {
  return (err, req, res, next) => {
    // Cache the error
    const errorKey = `${err.code || err.name}:${err.message}`;
    const cached = errorCache.get(errorKey) || { count: 0, first: new Date().toISOString() };
    cached.count++;
    cached.last = new Date().toISOString();
    errorCache.set(errorKey, cached);

    // Log the error
    const logData = {
      traceId: req.traceId,
      code: err.code || 'INTERNAL_ERROR',
      message: err.message,
      path: req.path,
      method: req.method,
      userId: req.user?.id || null,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
      occurrences: cached.count,
    };

    if (err instanceof AppError) {
      if (err.statusCode >= 500) {
        logger.error('Application error', logData);
      } else {
        logger.warn('Client error', logData);
      }
      return res.status(err.statusCode).json({
        ...err.toJSON(),
        traceId: req.traceId,
      });
    }

    // Unexpected errors
    logger.error('Unexpected error', { ...logData, stack: err.stack });
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'production'
          ? 'An internal error occurred'
          : err.message,
        traceId: req.traceId,
      },
    });
  };
}

// Export error cache for admin/monitoring endpoints
function getErrorStats() {
  const errors = [];
  errorCache.forEach((value, key) => {
    errors.push({ error: key, ...value });
  });
  return errors.sort((a, b) => b.count - a.count);
}

module.exports = { errorHandler, getErrorStats };
