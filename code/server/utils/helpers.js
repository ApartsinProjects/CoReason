'use strict';

const logger = require('./logger');

/**
 * Safely parse a JSON string; returns fallback on malformed input.
 * Works for database fields that may be stored as JSON strings or already-parsed objects.
 *
 * @param {*} value - The value to parse (string, object, null, undefined)
 * @param {*} fallback - Value to return if parsing fails (default: null)
 * @returns {*} Parsed value or fallback
 */
function safeParse(value, fallback = null) {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    logger.warn('Malformed JSON in database field', { preview: value.slice(0, 80) });
    return fallback;
  }
}

module.exports = { safeParse };
