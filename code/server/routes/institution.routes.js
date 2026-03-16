'use strict';
const { Router } = require('express');
const { InstitutionService } = require('../services/institution.service');

module.exports = function institutionRoutes(db, logger) {
  const router = Router();
  const institutionService = new InstitutionService(db, logger);

  // GET /api/v1/institutions
  router.get('/', async (req, res, next) => {
    try {
      const institutions = await institutionService.list();
      res.json(institutions);
    } catch (err) { next(err); }
  });

  return router;
};
