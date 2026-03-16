'use strict';
const { Router } = require('express');
const { ImportService } = require('../services/import.service');
const { requireAuth } = require('../middleware/auth');

module.exports = function importRoutes(db, logger) {
  const router = Router();
  const importService = new ImportService(db, logger);

  // POST /api/v1/import/batch
  router.post('/batch', requireAuth, async (req, res, next) => {
    try {
      const result = await importService.batchImport(req.body, req.user.id);
      res.status(202).json(result);
    } catch (err) { next(err); }
  });

  // GET /api/v1/import/status/:jobId
  router.get('/status/:jobId', requireAuth, async (req, res, next) => {
    try {
      const status = await importService.getJobStatus(req.params.jobId);
      res.json(status);
    } catch (err) { next(err); }
  });

  return router;
};
