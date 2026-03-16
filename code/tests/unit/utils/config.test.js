'use strict';

const { deepMerge, resolveEnvVars } = require('../../../server/utils/config');

describe('Config Utils', () => {
  describe('deepMerge', () => {
    it('merges flat objects', () => {
      expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
    });

    it('overrides values', () => {
      expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
    });

    it('merges nested objects', () => {
      const result = deepMerge(
        { db: { host: 'localhost', port: 5432 } },
        { db: { port: 3306 } }
      );
      expect(result.db.host).toBe('localhost');
      expect(result.db.port).toBe(3306);
    });

    it('does not merge arrays (replaces)', () => {
      expect(deepMerge({ a: [1, 2] }, { a: [3] })).toEqual({ a: [3] });
    });
  });

  describe('resolveEnvVars', () => {
    beforeAll(() => {
      process.env.TEST_VAR = 'hello';
    });

    it('resolves ${VAR} in strings', () => {
      expect(resolveEnvVars('prefix-${TEST_VAR}-suffix')).toBe('prefix-hello-suffix');
    });

    it('resolves in nested objects', () => {
      const result = resolveEnvVars({ db: { url: '${TEST_VAR}' } });
      expect(result.db.url).toBe('hello');
    });

    it('returns empty string for missing vars', () => {
      expect(resolveEnvVars('${NONEXISTENT}')).toBe('');
    });

    it('passes through non-string values', () => {
      expect(resolveEnvVars(42)).toBe(42);
      expect(resolveEnvVars(null)).toBe(null);
    });
  });
});
