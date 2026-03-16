'use strict';
const { Router } = require('express');
const { ChallengeRunService } = require('../services/challenge-run.service');
const { requireAuth } = require('../middleware/auth');

module.exports = function runRoutes(db, logger, llmService) {
  const router = Router();
  const runService = new ChallengeRunService(db, logger, llmService);

  // POST /api/v1/runs (start a new challenge run)
  router.post('/', requireAuth, async (req, res, next) => {
    try {
      const run = await runService.startRun(req.body.challengeId, req.user.id);
      res.status(201).json(run);
    } catch (err) { next(err); }
  });

  // GET /api/v1/runs/:runId
  router.get('/:runId', requireAuth, async (req, res, next) => {
    try {
      const run = await runService.getRunState(req.params.runId, req.user.id);
      res.json(run);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/runs/:runId/framing
  router.put('/:runId/framing', requireAuth, async (req, res, next) => {
    try {
      const result = await runService.submitFraming(req.params.runId, req.user.id, req.body);
      res.json(result);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/runs/:runId/cycles/:n/judging
  router.put('/:runId/cycles/:n/judging', requireAuth, async (req, res, next) => {
    try {
      const result = await runService.submitJudging(req.params.runId, req.user.id, req.params.n, req.body);
      res.json(result);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/runs/:runId/cycles/:n/steering
  router.put('/:runId/cycles/:n/steering', requireAuth, async (req, res, next) => {
    try {
      const result = await runService.submitSteering(req.params.runId, req.user.id, req.params.n, req.body);
      res.json(result);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/runs/:runId/complete
  router.put('/:runId/complete', requireAuth, async (req, res, next) => {
    try {
      const result = await runService.markComplete(req.params.runId, req.user.id);
      res.json(result);
    } catch (err) { next(err); }
  });

  // GET /api/v1/runs/:runId/report
  router.get('/:runId/report', requireAuth, async (req, res, next) => {
    try {
      const report = await runService.getReport(req.params.runId, req.user.id);
      res.json(report);
    } catch (err) { next(err); }
  });

  return router;
};
