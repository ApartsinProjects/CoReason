'use strict';
const { Router } = require('express');
const { UserService } = require('../services/user.service');
const { requireAuth } = require('../middleware/auth');

module.exports = function userRoutes(db, logger) {
  const router = Router();
  const userService = new UserService(db, logger);

  // GET /api/v1/users/me
  router.get('/me', requireAuth, async (req, res, next) => {
    try {
      const profile = await userService.getProfile(req.user.id);
      res.json(profile);
    } catch (err) { next(err); }
  });

  // PUT /api/v1/users/me
  router.put('/me', requireAuth, async (req, res, next) => {
    try {
      const updated = await userService.updateProfile(req.user.id, req.body);
      res.json(updated);
    } catch (err) { next(err); }
  });

  // GET /api/v1/users/me/stats
  router.get('/me/stats', requireAuth, async (req, res, next) => {
    try {
      const stats = await userService.getStats(req.user.id);
      res.json(stats);
    } catch (err) { next(err); }
  });

  return router;
};
