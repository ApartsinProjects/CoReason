'use strict';

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const { loadConfig } = require('./utils/config');
const { createLogger } = require('./utils/logger');
const { requestLogger } = require('./middleware/request-logger');
const { errorHandler } = require('./middleware/error-handler');
const { SERVER, LLM_FALLBACK, LLM_FALLBACK_FRAMING_OPTIONS, LLM_FALLBACK_JUDGING_OPTIONS, LLM_FALLBACK_STEERING_OPTIONS, LLM_STUB_SUBJECT_TREE, GRADES } = require('./utils/constants');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.all'), override: true });

async function startServer() {
  const config = loadConfig();
  const logger = createLogger(config.logging);
  const app = express();

  // --- Security headers ---
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],  // Allow inline scripts for vanilla JS frontend
        scriptSrcAttr: ["'unsafe-inline'"],         // Allow inline event handlers (onclick="...") the vanilla-JS UI relies on
        styleSrc: ["'self'", "'unsafe-inline'"],    // Allow inline styles
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  }));

  // --- CORS ---
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
    : (process.env.NODE_ENV === 'production' ? [] : [true]);  // Allow all in dev, restrict in prod
  app.use(cors({
    origin: allowedOrigins.length === 1 && allowedOrigins[0] === true ? true : allowedOrigins,
    credentials: true,
  }));

  // --- Rate limiting ---
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 300,                   // 300 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });
  app.use('/api/', apiLimiter);

  // Stricter rate limit for auth mutation endpoints (login, register, test-login)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,  // 20 auth attempts per 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts, please try again later.' },
  });
  // Apply only to auth mutation routes, NOT to GET /auth/me (called on every page load)
  app.use('/api/v1/auth/login', authLimiter);
  app.use('/api/v1/auth/register', authLimiter);
  app.use('/api/v1/auth/test-login', authLimiter);

  // Stricter rate limit for LLM endpoints (expensive operations)
  const llmLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 minute
    max: 10,                    // 10 LLM calls per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many AI requests, please wait before trying again.' },
  });
  app.use('/api/v1/llm/', llmLimiter);
  app.use('/api/v1/challenges/preview-problem', llmLimiter);
  app.use('/api/v1/challenges/preview-rubric', llmLimiter);

  // --- Parsing ---
  app.use(compression());
  app.use(express.json({ limit: SERVER.JSON_BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true }));

  // --- Session ---
  const sessionConfig = {
    secret: process.env.SESSION_SECRET || config.auth.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: config.auth.session_max_age || 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
    name: SERVER.SESSION_COOKIE_NAME,
  };

  // Use PostgreSQL session store in production
  if (config.database.client === 'pg') {
    const PgSession = require('connect-pg-simple')(session);
    sessionConfig.store = new PgSession({
      conString: process.env.DATABASE_URL || config.database.connection,
      tableName: SERVER.SESSION_TABLE_NAME,
      createTableIfMissing: true,
    });
  } else {
    // Use a file-based SQLite session store for development/test via knex
    const KnexSessionStore = require('./utils/knex-session-store')(session);
    sessionConfig.store = new KnexSessionStore({
      knex: require('./db/knexfile').createKnex(config),
      tableName: SERVER.SESSION_TABLE_NAME || 'sessions',
      createTable: true,
    });
  }

  app.use(session(sessionConfig));

  // --- Passport ---
  app.use(passport.initialize());
  app.use(passport.session());
  // Passport configured after DB init below

  // --- Request logging ---
  app.use(requestLogger(logger));

  // --- Database ---
  const db = require('./db/knexfile').createKnex(config);
  app.locals.db = db;
  app.locals.config = config;
  app.locals.logger = logger;

  // --- Configure Passport with DB access ---
  require('./middleware/auth').configurePassport(passport, config, logger, db);

  // --- Services that need shared instances ---
  const { TraceRecorder } = require('./utils/trace');
  const tracer = new TraceRecorder(logger);

  let llmService;
  try {
    const { LLMService } = require('./services/llm.service');
    llmService = new LLMService(config, logger, tracer);
  } catch (err) {
    logger.warn('Failed to initialize LLMService:', err.message);
    // Provide a stub so routes don't crash
    llmService = {
      generatePreview: async () => LLM_FALLBACK.SERVICE_NOT_AVAILABLE,
      getAvailableModels: () => [],
      generateProblem: async () => LLM_FALLBACK.SERVICE_NOT_AVAILABLE,
      generateAISolution: async () => LLM_FALLBACK.SERVICE_NOT_AVAILABLE,
      generateUpdatedOutput: async (data) => (data.currentSolution || '') + LLM_FALLBACK.NOT_AVAILABLE_SUFFIX,
      evaluateFraming: async () => ({ grade: GRADES.NA, feedback: { message: LLM_FALLBACK.SERVICE_NOT_AVAILABLE } }),
      evaluateJudging: async () => ({ grade: GRADES.NA, feedback: { message: LLM_FALLBACK.SERVICE_NOT_AVAILABLE } }),
      evaluateSteering: async () => ({ grade: GRADES.NA, feedback: { message: LLM_FALLBACK.SERVICE_NOT_AVAILABLE } }),
      generateFramingMC: async () => LLM_FALLBACK_FRAMING_OPTIONS,
      generateJudgingMC: async () => LLM_FALLBACK_JUDGING_OPTIONS,
      generateSteeringMC: async () => LLM_FALLBACK_STEERING_OPTIONS,
      generateRubrics: async () => null,
      generateRubricPreview: async () => null,
      generateSubjectTree: async () => LLM_STUB_SUBJECT_TREE,
    };
  }

  // --- API Routes ---
  app.use('/api/v1/auth', require('./routes/auth.routes')(db, passport, config, logger));
  app.use('/api/v1/users', require('./routes/user.routes')(db, logger));
  app.use('/api/v1/institutions', require('./routes/institution.routes')(db, logger));
  app.use('/api/v1/courses', require('./routes/course.routes')(db, logger, llmService));
  app.use('/api/v1/challenges', require('./routes/challenge.routes')(db, logger, llmService));
  app.use('/api/v1/runs', require('./routes/run.routes')(db, logger, llmService));
  app.use('/api/v1/analytics', require('./routes/analytics.routes')(db, logger));
  app.use('/api/v1/import', require('./routes/import.routes')(db, logger));
  app.use('/api/v1/llm', require('./routes/llm.routes')(db, logger, llmService));
  app.use('/api/v1/admin', require('./routes/admin.routes')(db, logger));

  // --- Health check ---
  app.get('/api/health', async (req, res) => {
    let dbOk = false;
    try { await db.raw('SELECT 1'); dbOk = true; } catch { /* db down */ }
    const llmOk = !!(llmService && llmService.providers && llmService.providers.length > 0);
    const status = dbOk ? 'ok' : 'degraded';
    res.status(dbOk ? 200 : 503).json({
      status,
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      database: dbOk ? 'connected' : 'error',
      llm: llmOk ? 'available' : 'fallback',
      uptime_seconds: Math.floor(process.uptime()),
    });
  });

  // --- Static files ---
  const staticDir = path.resolve(__dirname, config.server.static_dir || '../client');
  app.use(express.static(staticDir));

  // SPA fallback: serve index.html for non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(staticDir, 'index.html'));
    }
  });

  // --- Error handling ---
  app.use(errorHandler(logger));

  // --- Start ---
  const port = process.env.PORT || config.server.port || SERVER.DEFAULT_PORT;
  const server = app.listen(port, () => {
    logger.info(`CoReason server started`, {
      port,
      env: process.env.NODE_ENV || 'development',
      database: config.database.client,
      static: staticDir,
    });
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    server.close(async () => {
      await db.destroy();
      logger.info('Server shut down complete');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), SERVER.GRACEFUL_SHUTDOWN_TIMEOUT_MS);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return { app, server, db };
}

// Start if run directly
if (require.main === module) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

module.exports = { startServer };
