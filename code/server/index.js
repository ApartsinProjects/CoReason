'use strict';

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const { loadConfig } = require('./utils/config');
const { createLogger } = require('./utils/logger');
const { requestLogger } = require('./middleware/request-logger');
const { errorHandler } = require('./middleware/error-handler');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.all') });

async function startServer() {
  const config = loadConfig();
  const logger = createLogger(config.logging);
  const app = express();

  // --- Security & parsing ---
  app.use(helmet({
    contentSecurityPolicy: false,  // Allow inline scripts for frontend pages
  }));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
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
    name: 'coreason.sid',
  };

  // Use PostgreSQL session store in production
  if (config.database.client === 'pg') {
    const PgSession = require('connect-pg-simple')(session);
    sessionConfig.store = new PgSession({
      conString: process.env.DATABASE_URL || config.database.connection,
      tableName: 'user_sessions',
      createTableIfMissing: true,
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
      generatePreview: async () => 'LLM service not available',
      getAvailableModels: () => [],
      generateProblem: async () => 'LLM service not available',
      generateAISolution: async () => 'LLM service not available',
      generateUpdatedOutput: async (data) => (data.currentSolution || '') + '\n\n[LLM not available]',
      evaluateFraming: async () => ({ grade: 'N/A', feedback: { message: 'LLM not available' } }),
      evaluateJudging: async () => ({ grade: 'N/A', feedback: { message: 'LLM not available' } }),
      evaluateSteering: async () => ({ grade: 'N/A', feedback: { message: 'LLM not available' } }),
    };
  }

  // --- API Routes ---
  app.use('/api/v1/auth', require('./routes/auth.routes')(db, passport, config, logger));
  app.use('/api/v1/users', require('./routes/user.routes')(db, logger));
  app.use('/api/v1/institutions', require('./routes/institution.routes')(db, logger));
  app.use('/api/v1/courses', require('./routes/course.routes')(db, logger));
  app.use('/api/v1/challenges', require('./routes/challenge.routes')(db, logger));
  app.use('/api/v1/runs', require('./routes/run.routes')(db, logger, llmService));
  app.use('/api/v1/analytics', require('./routes/analytics.routes')(db, logger));
  app.use('/api/v1/import', require('./routes/import.routes')(db, logger));
  app.use('/api/v1/llm', require('./routes/llm.routes')(db, logger, llmService));

  // --- Health check ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() });
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
  const port = process.env.PORT || config.server.port || 3000;
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
    setTimeout(() => process.exit(1), 10000);
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
