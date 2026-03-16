'use strict';
const { Router } = require('express');
const { AuthService } = require('../services/auth.service');

module.exports = function authRoutes(db, passport, config, logger) {
  const router = Router();
  const authService = new AuthService(db, logger);

  // POST /api/v1/auth/register
  router.post('/register', async (req, res, next) => {
    try {
      const { email, password, name, role, institutionId } = req.body;
      const user = await authService.register({ email, password, name, role, institutionId });
      // Auto-login after registration
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ user });
      });
    } catch (err) { next(err); }
  });

  // POST /api/v1/auth/login
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: { code: 'AUTH_FAILED', message: info?.message || 'Invalid credentials' } });
      }
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.json({ user });
      });
    })(req, res, next);
  });

  // GET /api/v1/auth/google
  router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

  // GET /api/v1/auth/google/callback
  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/00-login.html' }),
    (req, res) => {
      logger.info('Google login successful', { userId: req.user.id });
      res.redirect('/03-challenge-list.html');
    }
  );

  // POST /api/v1/auth/logout
  router.post('/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Logged out' });
    });
  });

  // GET /api/v1/auth/me
  router.get('/me', async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { code: 'NOT_AUTHENTICATED', message: 'Not logged in' } });
      }
      const user = await authService.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ error: { code: 'NOT_AUTHENTICATED', message: 'User not found' } });
      }
      res.json({ user });
    } catch (err) { next(err); }
  });

  return router;
};
