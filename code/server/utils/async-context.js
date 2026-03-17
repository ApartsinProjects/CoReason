'use strict';

/**
 * AsyncLocalStorage-based request context propagation.
 * Allows services and LLM calls to access the current request's traceId
 * without passing it through every function parameter.
 *
 * Usage in middleware: asyncContext.run({ traceId }, next)
 * Usage in services:  asyncContext.getTraceId()
 */
const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

module.exports = {
  /**
   * Run a callback within an async context carrying request metadata.
   * @param {object} store - Context data (e.g. { traceId, userId })
   * @param {Function} fn - Callback to run within the context
   */
  run(store, fn) {
    return asyncLocalStorage.run(store, fn);
  },

  /**
   * Get the current traceId from async context.
   * Returns null if called outside a request context.
   */
  getTraceId() {
    const store = asyncLocalStorage.getStore();
    return store?.traceId || null;
  },

  /**
   * Get the full async context store.
   */
  getStore() {
    return asyncLocalStorage.getStore() || {};
  },
};
