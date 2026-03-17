'use strict';
const { Router } = require('express');
const { InstitutionService } = require('../services/institution.service');

function parseDepartments(departments) {
  if (Array.isArray(departments)) return departments;
  if (typeof departments === 'string') {
    try { return JSON.parse(departments); } catch (e) { return []; }
  }
  return [];
}

module.exports = function institutionRoutes(db, logger) {
  const router = Router();
  const institutionService = new InstitutionService(db, logger);

  // GET /api/v1/institutions
  router.get('/', async (req, res, next) => {
    try {
      const institutions = await institutionService.list();
      // Parse departments JSON strings for all institutions
      res.json(institutions.map(inst => ({
        ...inst,
        departments: parseDepartments(inst.departments),
      })));
    } catch (err) { next(err); }
  });

  // GET /api/v1/institutions/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const institution = await institutionService.getById(req.params.id);
      if (!institution) {
        return res.status(404).json({ error: 'Institution not found' });
      }
      res.json({
        ...institution,
        departments: parseDepartments(institution.departments),
      });
    } catch (err) { next(err); }
  });

  return router;
};
