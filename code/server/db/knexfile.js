'use strict';

const path = require('path');

// Configuration for different environments
const configs = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(__dirname, '../../data/coreason-dev.sqlite3'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.resolve(__dirname, 'seeds'),
    },
  },

  test: {
    client: 'better-sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.resolve(__dirname, 'seeds'),
    },
  },

  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.resolve(__dirname, 'seeds'),
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 20 },
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.resolve(__dirname, 'seeds'),
    },
  },
};

function createKnex(appConfig) {
  const env = process.env.NODE_ENV || 'development';
  const knexConfig = configs[env] || configs.development;

  // Override with app config if provided
  if (appConfig?.database?.client === 'pg' && process.env.DATABASE_URL) {
    knexConfig.client = 'pg';
    knexConfig.connection = process.env.DATABASE_URL;
    delete knexConfig.useNullAsDefault;
  }

  const knex = require('knex')(knexConfig);
  return knex;
}

// Export for Knex CLI
module.exports = configs[process.env.NODE_ENV || 'development'];
module.exports.createKnex = createKnex;
