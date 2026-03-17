'use strict';

const { v4: uuidv4 } = require('uuid');
const asyncContext = require('../utils/async-context');

function requestLogger(logger) {
  return (req, res, next) => {
    const traceId = uuidv4().slice(0, 8);
    req.traceId = traceId;
    const start = Date.now();

    // Log after response
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        traceId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration_ms: duration,
        userId: req.user?.id || null,
        ip: req.ip,
      };

      if (res.statusCode >= 500) {
        logger.error('Request failed', logData);
      } else if (res.statusCode >= 400) {
        logger.warn('Request error', logData);
      } else if (!req.path.startsWith('/api/')) {
        // Don't log static file requests at info level
        logger.debug('Static request', logData);
      } else {
        logger.info('Request completed', logData);
      }
    });

    // Propagate traceId through async context so services can access it
    asyncContext.run({ traceId, userId: req.user?.id }, next);
  };
}

module.exports = { requestLogger };
