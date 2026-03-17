'use strict';
const { Router } = require('express');
const path = require('path');
const fs = require('fs');
const { requireAuth, requireRole } = require('../middleware/auth');
const { getErrorStats } = require('../middleware/error-handler');
const { RUN_STATUS, PAGINATION, DB_TABLES, PATHS, SERVER, ROLES } = require('../utils/constants');

module.exports = function adminRoutes(db, logger) {
  const router = Router();

  // All admin routes require authentication and instructor role.
  // NOTE: DB schema only supports 'student'/'instructor' roles — using 'instructor' as admin proxy until an 'admin' role is added.
  router.use(requireAuth, requireRole(ROLES.INSTRUCTOR));

  // GET /api/v1/admin/overview — System overview
  router.get('/overview', async (req, res, next) => {
    try {
      const [users] = await db('users').count('id as count');
      const [institutions] = await db('institutions').count('id as count');
      const [courses] = await db('courses').count('id as count');
      const [challenges] = await db('challenges').count('id as count');
      const [runs] = await db('challenge_runs').count('id as count');
      const [completedRuns] = await db('challenge_runs').where({ status: RUN_STATUS.COMPLETED }).count('id as count');
      const [subscriptions] = await db('course_subscriptions').count('id as count');
      const [promptTemplates] = await db('prompt_templates').count('id as count');

      res.json({
        users: users.count,
        institutions: institutions.count,
        courses: courses.count,
        challenges: challenges.count,
        runs: runs.count,
        completed_runs: completedRuns.count,
        subscriptions: subscriptions.count,
        prompt_templates_db: promptTemplates.count,
      });
    } catch (err) { next(err); }
  });

  // GET /api/v1/admin/users — List all users
  router.get('/users', async (req, res, next) => {
    try {
      const users = await db('users')
        .leftJoin('institutions', 'users.institution_id', 'institutions.id')
        .select('users.id', 'users.email', 'users.name', 'users.role',
          'users.preferred_language', 'users.tour_completed',
          'users.created_at', 'institutions.name as institution_name')
        .orderBy('users.created_at', 'desc');
      res.json({ users });
    } catch (err) { next(err); }
  });

  // GET /api/v1/admin/institutions
  router.get('/institutions', async (req, res, next) => {
    try {
      const institutions = await db('institutions').select('*').orderBy('name');
      res.json({ institutions });
    } catch (err) { next(err); }
  });

  // GET /api/v1/admin/courses
  router.get('/courses', async (req, res, next) => {
    try {
      const courses = await db('courses')
        .leftJoin('institutions', 'courses.institution_id', 'institutions.id')
        .select('courses.*', 'institutions.name as institution_name')
        .orderBy('courses.name');
      // Count per course
      const subs = await db('course_subscriptions')
        .select('course_id')
        .count('id as count')
        .groupBy('course_id');
      const subMap = {};
      subs.forEach(s => { subMap[s.course_id] = s.count; });
      const challCounts = await db('challenges')
        .select('course_id')
        .count('id as count')
        .groupBy('course_id');
      const challMap = {};
      challCounts.forEach(c => { challMap[c.course_id] = c.count; });

      res.json({
        courses: courses.map(c => ({
          ...c,
          subscribers: subMap[c.id] || 0,
          challenges_count: challMap[c.id] || 0,
        })),
      });
    } catch (err) { next(err); }
  });

  // GET /api/v1/admin/challenges
  router.get('/challenges', async (req, res, next) => {
    try {
      const challenges = await db('challenges')
        .leftJoin('users', 'challenges.creator_id', 'users.id')
        .leftJoin('courses', 'challenges.course_id', 'courses.id')
        .select('challenges.*', 'users.name as creator_name', 'courses.name as course_name')
        .orderBy('challenges.created_at', 'desc');
      const runCounts = await db('challenge_runs')
        .select('challenge_id')
        .count('id as count')
        .groupBy('challenge_id');
      const runMap = {};
      runCounts.forEach(r => { runMap[r.challenge_id] = r.count; });

      res.json({
        challenges: challenges.map(c => ({ ...c, runs_count: runMap[c.id] || 0 })),
      });
    } catch (err) { next(err); }
  });

  // GET /api/v1/admin/runs
  router.get('/runs', async (req, res, next) => {
    try {
      const runs = await db('challenge_runs')
        .leftJoin('users', 'challenge_runs.user_id', 'users.id')
        .leftJoin('challenges', 'challenge_runs.challenge_id', 'challenges.id')
        .select('challenge_runs.*', 'users.name as user_name', 'users.email as user_email',
          'challenges.title as challenge_title')
        .orderBy('challenge_runs.created_at', 'desc')
        .limit(PAGINATION.ADMIN_RUNS_LIMIT);
      res.json({ runs });
    } catch (err) { next(err); }
  });

  // GET /api/v1/admin/prompt-templates — File-based prompts
  router.get('/prompt-templates', async (req, res, next) => {
    try {
      const promptDir = path.resolve(__dirname, PATHS.PROMPTS_DIR_FROM_ROUTES);
      const files = fs.readdirSync(promptDir).filter(f => f.endsWith('.yaml')).sort();
      const templates = files.map(f => {
        const content = fs.readFileSync(path.join(promptDir, f), 'utf-8');
        return { filename: f, content };
      });
      // Also get DB-stored templates
      const dbTemplates = await db('prompt_templates').select('*').orderBy('filename');
      res.json({ file_templates: templates, db_templates: dbTemplates });
    } catch (err) { next(err); }
  });

  // GET /api/v1/admin/config — Server configuration (sanitized)
  router.get('/config', async (req, res, next) => {
    try {
      const config = {
        node_env: process.env.NODE_ENV || 'development',
        database_client: db.client.config.client,
        llm_providers: [],
        port: process.env.PORT || SERVER.DEFAULT_PORT,
        has_openai: !!process.env.OPENAI_API_KEY,
        has_groq: !!process.env.GROQ_API_KEY,
        has_gemini: !!process.env.GEMINI_API_KEY,  // Note: Gemini not yet implemented in LLMService
        has_google_oauth: !!process.env.GOOGLE_OAUTH_CLIENT_ID,
        has_database_url: !!process.env.DATABASE_URL,
        session_secret_set: !!process.env.SESSION_SECRET,
        uptime_seconds: Math.floor(process.uptime()),
        memory_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      };
      if (process.env.OPENAI_API_KEY) config.llm_providers.push('OpenAI');
      if (process.env.GROQ_API_KEY) config.llm_providers.push('Groq');
      if (process.env.GEMINI_API_KEY) config.llm_providers.push('Gemini (key only, not wired)');
      res.json(config);
    } catch (err) { next(err); }
  });

  // GET /api/v1/admin/db-tables — Table row counts
  router.get('/db-tables', async (req, res, next) => {
    try {
      const tables = DB_TABLES;
      const counts = {};
      for (const table of tables) {
        try {
          const [row] = await db(table).count('* as count');
          counts[table] = row.count;
        } catch (e) {
          counts[table] = 'error: ' + e.message;
        }
      }
      res.json({ tables: counts });
    } catch (err) { next(err); }
  });

  // GET /api/v1/admin/errors — Recent error statistics
  router.get('/errors', async (req, res) => {
    res.json({ errors: getErrorStats() });
  });

  return router;
};
