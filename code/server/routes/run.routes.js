'use strict';
const { Router } = require('express');
const { ChallengeRunService } = require('../services/challenge-run.service');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { startRunBody } = require('../middleware/schemas');

module.exports = function runRoutes(db, logger, llmService) {
  const router = Router();
  const runService = new ChallengeRunService(db, logger, llmService);

  // POST /api/v1/runs (start a new challenge run)
  router.post('/', requireAuth, validate({ body: startRunBody }), async (req, res, next) => {
    try {
      logger.info('Run started', { userId: req.user.id, challengeId: req.body.challengeId });
      const run = await runService.startRun(req.body.challengeId, req.user.id);
      res.status(201).json(run);
    } catch (err) {
      logger.error('Run start failed', { userId: req.user.id, challengeId: req.body.challengeId, error: err.message });
      next(err);
    }
  });

  // GET /api/v1/runs/:runId
  router.get('/:runId', requireAuth, async (req, res, next) => {
    try {
      const run = await runService.getRunState(req.params.runId, req.user.id);
      res.json(run);
    } catch (err) {
      logger.error('Get run state failed', { userId: req.user.id, runId: req.params.runId, error: err.message });
      next(err);
    }
  });

  // PUT /api/v1/runs/:runId/framing
  router.put('/:runId/framing', requireAuth, async (req, res, next) => {
    try {
      logger.info('Framing submitted', { userId: req.user.id, runId: req.params.runId });
      const result = await runService.submitFraming(req.params.runId, req.user.id, req.body);
      res.json(result);
    } catch (err) {
      logger.error('Framing submission failed', { userId: req.user.id, runId: req.params.runId, error: err.message });
      next(err);
    }
  });

  // PUT /api/v1/runs/:runId/cycles/:n/judging
  router.put('/:runId/cycles/:n/judging', requireAuth, async (req, res, next) => {
    try {
      logger.info('Judging submitted', { userId: req.user.id, runId: req.params.runId, cycle: req.params.n });
      const result = await runService.submitJudging(req.params.runId, req.user.id, req.params.n, req.body);
      res.json(result);
    } catch (err) {
      logger.error('Judging submission failed', { userId: req.user.id, runId: req.params.runId, cycle: req.params.n, error: err.message });
      next(err);
    }
  });

  // PUT /api/v1/runs/:runId/cycles/:n/steering
  router.put('/:runId/cycles/:n/steering', requireAuth, async (req, res, next) => {
    try {
      logger.info('Steering submitted', { userId: req.user.id, runId: req.params.runId, cycle: req.params.n });
      const result = await runService.submitSteering(req.params.runId, req.user.id, req.params.n, req.body);
      res.json(result);
    } catch (err) {
      logger.error('Steering submission failed', { userId: req.user.id, runId: req.params.runId, cycle: req.params.n, error: err.message });
      next(err);
    }
  });

  // PUT /api/v1/runs/:runId/complete
  router.put('/:runId/complete', requireAuth, async (req, res, next) => {
    try {
      logger.info('Run completion requested', { userId: req.user.id, runId: req.params.runId });
      const result = await runService.markComplete(req.params.runId, req.user.id);
      res.json(result);
    } catch (err) {
      logger.error('Run completion failed', { userId: req.user.id, runId: req.params.runId, error: err.message });
      next(err);
    }
  });

  // GET /api/v1/runs/:runId/report
  router.get('/:runId/report', requireAuth, async (req, res, next) => {
    try {
      logger.info('Report retrieved', { userId: req.user.id, runId: req.params.runId });
      const report = await runService.getReport(req.params.runId, req.user.id);
      res.json(report);
    } catch (err) {
      logger.error('Report retrieval failed', { userId: req.user.id, runId: req.params.runId, error: err.message });
      next(err);
    }
  });

  return router;
};
