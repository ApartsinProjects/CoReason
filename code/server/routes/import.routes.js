'use strict';
const { Router } = require('express');
const { ImportService } = require('../services/import.service');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');

module.exports = function importRoutes(db, logger) {
  const router = Router();
  const importService = new ImportService(db, logger);

  // POST /api/v1/import/batch
  router.post('/batch', requireAuth, requireRole(ROLES.INSTRUCTOR), async (req, res, next) => {
    try {
      const result = await importService.importFromYAML(req.body);
      res.status(202).json(result);
    } catch (err) { next(err); }
  });

  // GET /api/v1/import/status/:jobId
  router.get('/status/:jobId', requireAuth, requireRole(ROLES.INSTRUCTOR), async (req, res, next) => {
    try {
      const status = await importService.getJobStatus(req.params.jobId);
      res.json(status);
    } catch (err) { next(err); }
  });

  return router;
};
