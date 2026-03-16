'use strict';
const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');

module.exports = function llmRoutes(db, logger, llmService) {
  const router = Router();

  // POST /api/v1/llm/preview
  router.post('/preview', requireAuth, async (req, res, next) => {
    try {
      const preview = await llmService.generatePreview(req.body);
      res.json({ preview });
    } catch (err) { next(err); }
  });

  // GET /api/v1/llm/models
  router.get('/models', requireAuth, async (req, res, next) => {
    try {
      const models = llmService.getAvailableModels();
      res.json({ models });
    } catch (err) { next(err); }
  });

  return router;
};
