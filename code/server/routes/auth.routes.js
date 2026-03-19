'use strict';
const { Router } = require('express');
const { AuthService } = require('../services/auth.service');
const { AUTH_REDIRECTS } = require('../utils/constants');

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
    passport.authenticate('google', { failureRedirect: AUTH_REDIRECTS.GOOGLE_FAILURE }),
    (req, res) => {
      logger.info('Google login successful', { userId: req.user.id });
      res.redirect(AUTH_REDIRECTS.GOOGLE_SUCCESS);
    }
  );

  // POST /api/v1/auth/logout
  router.post('/logout', (req, res) => {
    const userId = req.user?.id || null;
    const email = req.user?.email || null;
    req.logout(function(err) {
      if (err) logger.warn('Logout error', { error: err.message });
      // Destroy the session to ensure clean logout
      if (req.session) {
        req.session.destroy(function(sessionErr) {
          if (sessionErr) logger.warn('Session destroy error', { error: sessionErr.message });
          res.clearCookie('connect.sid');
          logger.info('User logged out', { userId, email });
          res.json({ message: 'Logged out' });
        });
      } else {
        res.clearCookie('connect.sid');
        logger.info('User logged out', { userId, email });
        res.json({ message: 'Logged out' });
      }
    });
  });

  // POST /api/v1/auth/test-login — login as test user (no password, dev only)
  router.post('/test-login', (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Test login disabled in production' } });
    }
    next();
  }, async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: { code: 'MISSING_EMAIL', message: 'Email is required' } });
      }
      const user = await authService.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'Test user not found' } });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.json({ user });
      });
    } catch (err) { next(err); }
  });

  // GET /api/v1/auth/test-users — list available test users (dev only)
  router.get('/test-users', (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Test users disabled in production' } });
    }
    next();
  }, async (req, res, next) => {
    try {
      const users = await db('users')
        .leftJoin('institutions', 'users.institution_id', 'institutions.id')
        .select('users.id', 'users.email', 'users.name', 'users.role',
                'users.preferred_language', 'institutions.name as institution')
        .whereNotNull('users.institution_id')        // Only show real demo users (with institution)
        .where('users.email', 'not like', 'e2e-%')   // Exclude Playwright test artifacts
        .orderBy('users.preferred_language')
        .orderBy('users.role')
        .orderBy('users.name');
      res.json(users);
    } catch (err) { next(err); }
  });

  // POST /api/v1/auth/test-cleanup — delete test-generated data (dev/test only)
  router.post('/test-cleanup', (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Test cleanup disabled in production' } });
    }
    next();
  }, async (req, res, next) => {
    try {
      const { prefix } = req.body;
      if (!prefix) {
        return res.status(400).json({ error: { code: 'MISSING_PREFIX', message: 'Timestamp prefix is required' } });
      }

      // Delete test users, courses, challenges, and runs matching the timestamp prefix
      const testUserEmails = [`e2e-stu-${prefix}@test.com`, `e2e-ins-${prefix}@test.com`];
      const testUserIds = (await db('users').whereIn('email', testUserEmails).select('id')).map(r => r.id);

      const testCoursePatterns = [`E2E Course ${prefix}`, `Run Course ${prefix}`, `Click Course ${prefix}`, `Anl Course ${prefix}`, `Analytics Course ${prefix}`];
      const testCourseIds = (await db('courses').where(function() {
        for (const name of testCoursePatterns) this.orWhere('name', name);
      }).select('id')).map(r => r.id);

      const testChallengeIds = (await db('challenges').where('title', 'like', `%${prefix}%`).select('id')).map(r => r.id);

      // Delete in FK-safe order
      const allChallengeIds = [...testChallengeIds];
      if (testCourseIds.length > 0) {
        const courseChals = (await db('challenges').whereIn('course_id', testCourseIds).select('id')).map(r => r.id);
        allChallengeIds.push(...courseChals);
      }

      if (allChallengeIds.length > 0) {
        const runIds = (await db('challenge_runs').whereIn('challenge_id', allChallengeIds).select('id')).map(r => r.id);
        if (runIds.length > 0) await db('challenge_run_cycles').whereIn('run_id', runIds).del();
        await db('challenge_runs').whereIn('challenge_id', allChallengeIds).del();
        await db('challenges').whereIn('id', allChallengeIds).del();
      }

      if (testUserIds.length > 0) {
        const userRunIds = (await db('challenge_runs').whereIn('user_id', testUserIds).select('id')).map(r => r.id);
        if (userRunIds.length > 0) await db('challenge_run_cycles').whereIn('run_id', userRunIds).del();
        await db('challenge_runs').whereIn('user_id', testUserIds).del();
        await db('course_subscriptions').whereIn('user_id', testUserIds).del();
        await db('course_instructors').whereIn('user_id', testUserIds).del();
      }

      if (testCourseIds.length > 0) {
        await db('course_subscriptions').whereIn('course_id', testCourseIds).del();
        await db('course_instructors').whereIn('course_id', testCourseIds).del();
        await db('courses').whereIn('id', testCourseIds).del();
      }

      if (testUserIds.length > 0) {
        await db('users').whereIn('id', testUserIds).del();
      }

      logger.info('Test cleanup completed', { prefix, users: testUserIds.length, courses: testCourseIds.length, challenges: allChallengeIds.length });
      res.json({ cleaned: { users: testUserIds.length, courses: testCourseIds.length, challenges: allChallengeIds.length } });
    } catch (err) { next(err); }
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
