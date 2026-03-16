'use strict';

const path = require('path');
const { ImportService } = require('../../services/import.service');
const { InstitutionService } = require('../../services/institution.service');
const { CourseService } = require('../../services/course.service');
const { createLogger } = require('../../utils/logger');

exports.seed = async function (knex) {
  const logger = createLogger({ level: 'info', console: true, file: false, trace: false });
  const institutionService = new InstitutionService(knex, logger);
  const courseService = new CourseService(knex, logger);
  const importService = new ImportService(knex, logger, institutionService, courseService);

  // Check if data already exists
  const existingUsers = await knex('users').count('id as count').first();
  if (existingUsers.count > 0) {
    logger.info('Database already has data, skipping seed');
    return;
  }

  // Import from sample YAML
  const importFile = path.resolve(__dirname, '../../../import/sample/full-import.yaml');
  try {
    const result = await importService.importFromFile(importFile);
    logger.info('Seed completed', result.summary);
    if (result.errors.length) {
      logger.warn('Seed errors:', result.errors);
    }
  } catch (err) {
    logger.error('Seed failed:', err.message);
  }
};
