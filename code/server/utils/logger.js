'use strict';

const winston = require('winston');
const path = require('path');
const fs = require('fs');

function createLogger(config = {}) {
  const logDir = path.resolve(config.dir || './logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const level = process.env.LOG_LEVEL || config.level || 'info';

  // Custom format for structured JSON logging
  const structuredFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  );

  const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, service, traceId, ...meta }) => {
      const prefix = [service, traceId].filter(Boolean).join('|');
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} ${level} [${prefix || 'app'}] ${message}${metaStr}`;
    })
  );

  const transports = [];

  // Console transport
  if (config.console !== false) {
    transports.push(new winston.transports.Console({
      level,
      format: consoleFormat,
    }));
  }

  // File transports
  if (config.file !== false) {
    // Combined log
    transports.push(new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info',
      format: structuredFormat,
      maxsize: config.max_file_size || 10 * 1024 * 1024,
      maxFiles: config.max_files || 5,
    }));

    // Error log
    transports.push(new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: structuredFormat,
      maxsize: config.max_file_size || 10 * 1024 * 1024,
      maxFiles: config.max_files || 5,
    }));

    // Debug log
    transports.push(new winston.transports.File({
      filename: path.join(logDir, 'debug.log'),
      level: 'debug',
      format: structuredFormat,
      maxsize: config.max_file_size || 10 * 1024 * 1024,
      maxFiles: config.max_files || 5,
    }));
  }

  // Trace log (decision audit trail)
  if (config.trace !== false) {
    transports.push(new winston.transports.File({
      filename: path.join(logDir, 'trace.log'),
      level: 'verbose',
      format: structuredFormat,
      maxsize: config.max_file_size || 10 * 1024 * 1024,
      maxFiles: config.max_files || 5,
    }));
  }

  const logger = winston.createLogger({
    level: level === 'silent' ? 'error' : level,
    silent: level === 'silent',
    defaultMeta: { service: 'coreason' },
    transports,
  });

  // Convenience method for decision tracing
  logger.trace = (type, data) => {
    logger.verbose('TRACE', {
      service: 'trace',
      traceType: type,
      ...data,
      timestamp: new Date().toISOString(),
    });
  };

  return logger;
}

module.exports = { createLogger };
