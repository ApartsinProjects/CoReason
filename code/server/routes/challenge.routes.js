'use strict';
const { Router } = require('express');
const { ChallengeService } = require('../services/challenge.service');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createChallengeBody } = require('../middleware/schemas');
const { VISIBILITY } = require('../utils/constants');
const { ForbiddenError, AuthError } = require('../utils/errors');

module.exports = function challengeRoutes(db, logger, llmService) {
  const router = Router();
  const challengeService = new ChallengeService(db, logger);

  // GET /api/v1/challenges
  router.get('/', optionalAuth, async (req, res, next) => {
    try {
      const userId = req.user ? req.user.id : null;
      const filters = {
        courseId: req.query.courseId,
        creatorId: req.query.mine === 'true' && userId ? userId : req.query.creatorId,
        type: req.query.type,
        visibility: req.query.visibility,
        status: req.query.status,
        search: req.query.search,
      };
      const challenges = await challengeService.list(filters, userId);
      res.json({ challenges });
    } catch (err) { next(err); }
  });

  // POST /api/v1/challenges/preview-problem — Generate sample problem preview
  // Must be BEFORE /:id routes to avoid being caught as an ID
  router.post('/preview-problem', requireAuth, async (req, res, next) => {
    try {
      const { course, subjects } = req.body;
      if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        return res.json({ problem: null });
      }
      const problem = await llmService.generateProblem({
        course: course || 'General',
        subject: subjects.join(', '),
        instructions: '',
      });
      res.json({ problem });
    } catch (err) {
      logger.warn('Problem preview generation failed:', err.message);
      res.json({ problem: null, error: err.message });
    }
  });

  // POST /api/v1/challenges/preview-rubric — Generate rubric preview asynchronously
  // Must be BEFORE /:id routes to avoid being caught as an ID
  router.post('/preview-rubric', requireAuth, async (req, res, next) => {
    try {
      const { course, subjects } = req.body;
      if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        return res.json({ rubrics: null });
      }
      const rubrics = await llmService.generateRubricPreview({
        course: course || 'General',
        subjects,
        language: req.body.language || 'English',
      });
      res.json({ rubrics });
    } catch (err) {
      logger.warn('Rubric preview generation failed:', err.message);
      res.json({ rubrics: null, error: err.message });
    }
  });

  // POST /api/v1/challenges
  router.post('/', requireAuth, validate({ body: createChallengeBody }), async (req, res, next) => {
    try {
      const challenge = await challengeService.create(req.body, req.user.id, req.user.role);
      res.status(201).json(challenge);
    } catch (err) { next(err); }
  });

  // GET /api/v1/challenges/:id
  router.get('/:id', optionalAuth, async (req, res, next) => {
    try {
      const challenge = await challengeService.getById(req.params.id);
      // Private challenges require auth and must be accessed by their creator
      if (challenge.visibility === VISIBILITY.PRIVATE) {
        if (!req.user) {
          return next(new AuthError('Authentication required to view private challenges'));
        }
        if (challenge.creator_id !== req.user.id) {
          return next(new ForbiddenError('You do not have access to this private challenge'));
        }
      }
      res.json(challenge);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/challenges/:id
  router.put('/:id', requireAuth, async (req, res, next) => {
    try {
      const challenge = await challengeService.update(req.params.id, req.body, req.user.id);
      res.json(challenge);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/challenges/:id/rename
  router.put('/:id/rename', requireAuth, async (req, res, next) => {
    try {
      const challenge = await challengeService.rename(req.params.id, req.body.title, req.user.id);
      res.json(challenge);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/challenges/:id/archive
  router.put('/:id/archive', requireAuth, async (req, res, next) => {
    try {
      const result = await challengeService.archive(req.params.id, req.user.id);
      res.json(result);
    } catch (err) { next(err); }
  });

  // DELETE /api/v1/challenges/:id
  router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
      const result = await challengeService.delete(req.params.id, req.user.id);
      res.json(result);
    } catch (err) { next(err); }
  });

  // POST /api/v1/challenges/:id/publish
  router.post('/:id/publish', requireAuth, async (req, res, next) => {
    try {
      const challenge = await challengeService.publish(req.params.id, req.user.id);
      res.json(challenge);
    } catch (err) { next(err); }
  });

  // POST /api/v1/challenges/:id/runs — Start a challenge run (alias for POST /runs)
  router.post('/:id/runs', requireAuth, async (req, res, next) => {
    try {
      const { ChallengeRunService } = require('../services/challenge-run.service');
      const runService = new ChallengeRunService(db, logger, llmService);
      const run = await runService.startRun(req.params.id, req.user.id);
      res.status(201).json(run);
    } catch (err) { next(err); }
  });

  return router;
};
