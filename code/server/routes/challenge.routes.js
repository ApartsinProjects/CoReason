'use strict';
const { Router } = require('express');
const { ChallengeService } = require('../services/challenge.service');
const { requireAuth } = require('../middleware/auth');

module.exports = function challengeRoutes(db, logger, llmService) {
  const router = Router();
  const challengeService = new ChallengeService(db, logger);

  // GET /api/v1/challenges
  router.get('/', async (req, res, next) => {
    try {
      const filters = {
        courseId: req.query.courseId,
        creatorId: req.query.creatorId,
        status: req.query.status,
      };
      const challenges = await challengeService.list(filters);
      res.json(challenges);
    } catch (err) { next(err); }
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
  router.post('/', requireAuth, async (req, res, next) => {
    try {
      const challenge = await challengeService.create(req.body, req.user.id);
      res.status(201).json(challenge);
    } catch (err) { next(err); }
  });

  // GET /api/v1/challenges/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const challenge = await challengeService.getById(req.params.id);
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

  return router;
};
