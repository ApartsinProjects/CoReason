#!/usr/bin/env node
'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.all') });

const { loadConfig } = require('../utils/config');
const { createLogger } = require('../utils/logger');
const { InstitutionService } = require('../services/institution.service');
const { CourseService } = require('../services/course.service');
const { ImportService } = require('../services/import.service');

async function main() {
  const args = process.argv.slice(2);
  const config = loadConfig();
  const logger = createLogger({ ...config.logging, console: true });

  // Parse args
  let filePath = null;
  let seedMode = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) {
      filePath = path.resolve(args[++i]);
    } else if (args[i] === '--seed') {
      seedMode = true;
    } else if (args[i] === '--help') {
      console.log(`
CoReason Import CLI

Usage:
  node server/cli/import.js --file <path-to-yaml>    Import from YAML file
  node server/cli/import.js --seed                    Seed from content/ directory
  node server/cli/import.js --help                    Show this help

Examples:
  node server/cli/import.js --file import/sample/full-import.yaml
  node server/cli/import.js --seed
`);
      process.exit(0);
    }
  }

  if (!filePath && !seedMode) {
    console.error('Error: Provide --file <path> or --seed');
    process.exit(1);
  }

  // Initialize database
  const knexConfig = require('../db/knexfile');
  const knex = require('knex')(knexConfig);

  // Run migrations first
  console.log('Running migrations...');
  await knex.migrate.latest();

  const institutionService = new InstitutionService(knex, logger);
  const courseService = new CourseService(knex, logger);
  const importService = new ImportService(knex, logger, institutionService, courseService);

  try {
    let result;
    if (seedMode) {
      console.log('Seeding from content directory...');
      result = await importService.seedFromContent();
    } else {
      console.log(`Importing from: ${filePath}`);
      result = await importService.importFromFile(filePath);
    }

    console.log('\n=== Import Results ===');
    console.log('Summary:', JSON.stringify(result.summary, null, 2));
    if (result.errors.length) {
      console.log(`\nWarnings (${result.errors.length}):`);
      result.errors.forEach(e => console.log(`  - ${e}`));
    }
    console.log('\nDone!');
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
}

main();
