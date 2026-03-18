# AI CoReasoning Lab

A co-reasoning assessment platform where students develop critical thinking skills by collaborating with AI. Students frame ill-defined problems, judge AI-generated solutions, and steer the AI toward better outputs -- all while receiving LLM-evaluated feedback.

## Key Features

- **Three-Phase Challenge Runs** -- Framing, Judging, and Steering phases that assess co-reasoning skills
- **Multiple Response Types** -- Multiple choice (MC) or open-ended responses per phase
- **LLM-Powered Evaluation** -- Automated grading and feedback via OpenAI, Groq, or other providers
- **Practice & Assessment Modes** -- Practice shows feedback after each phase; assessment reveals results only at completion
- **Multilingual Support** -- English, Hebrew, French, German, and Spanish UI with separate content language for LLM prompts
- **Role-Based Access** -- Student, Instructor, and Admin roles with appropriate permissions
- **Course Management** -- Hierarchical subject trees, course subscriptions, instructor assignments
- **Analytics & Reporting** -- Per-student and per-course analytics with PDF export
- **Bulk Import** -- YAML-based import of institutions, users, courses, and challenges

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js >= 20 |
| **Framework** | Express 4.x |
| **Database** | SQLite (dev/test) / PostgreSQL 16 (staging/prod) |
| **ORM** | Knex.js 3.x |
| **Auth** | Passport.js (local email/password + Google OAuth 2.0) |
| **LLM** | OpenAI SDK (gpt-4o-mini default, gpt-4o full) + Groq (llama-3.3-70b fallback) |
| **Validation** | Zod |
| **Sessions** | express-session (memory store for SQLite, connect-pg-simple for PostgreSQL) |
| **PDF** | PDFKit |
| **Logging** | Winston |
| **Security** | Helmet, CORS, bcryptjs |
| **Tests** | Jest + Supertest (unit/integration), Playwright + Chromium (e2e) |

## Project Structure

```
code/
  client/               # Static frontend (HTML pages, JS, CSS)
    js/                 # Client-side JavaScript modules
    content-compiled/   # Compiled i18n bundles (en.js, he.js, etc.)
    styles.css          # Application stylesheet
    *.html              # Page templates (SPA-style, served statically)
  server/
    index.js            # Express app entry point
    routes/             # API route handlers
    services/           # Business logic layer
    middleware/         # Auth, validation, error handling, logging
    db/
      knexfile.js       # Database configuration
      migrations/       # Schema migrations
      seeds/            # Seed data
    llm/
      prompt-engine.js  # YAML prompt template loader and renderer
    utils/              # Constants, errors, helpers, logger, tracing
  prompts/              # LLM prompt templates (YAML)
  content/              # i18n content source files (YAML)
    en/                 # English UI labels, tooltips, scenarios
    he/                 # Hebrew
    fr/ de/ es/         # French, German, Spanish
  import/
    sample/             # Sample import YAML files
  tests/
    unit/               # Jest unit tests
    integration/        # Jest + Supertest API tests
    e2e/                # Playwright browser tests
    setup.js            # Test environment setup
  docker/               # Docker and docker-compose files
  render.yaml           # Render.com deployment blueprint
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm
- (Optional) PostgreSQL 16 for production-like setup
- (Optional) Docker and Docker Compose

### Installation

```bash
cd code
npm install
```

### Environment Variables

Create a `.env.all` file in the `code/` directory:

```env
# Required
SESSION_SECRET=your-random-secret-string

# LLM Providers (at least one recommended)
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...

# Optional: Override default models
OPENAI_MODEL=gpt-4o-mini
OPENAI_MODEL_FULL=gpt-4o
GROQ_MODEL=llama-3.3-70b-versatile

# Optional: Google OAuth
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...

# Optional: PostgreSQL (defaults to SQLite for development)
DATABASE_URL=postgres://user:password@localhost:5432/coreason

# Optional: Other LLM providers
GEMINI_API_KEY=...
COHERE_API_KEY=...
```

If no LLM API keys are set, the application runs with fallback placeholder responses for all LLM features.

### Database Setup

```bash
# Run migrations and seed data
npm run db:setup

# Or step by step:
npm run db:migrate
npm run db:seed
```

### Build Content

Compile i18n YAML content into JavaScript bundles:

```bash
npm run build
```

### Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:3000` by default.

### Import Sample Data

```bash
npm run import -- import/sample/full-import.yaml
```

This populates the database with demo institutions, users, courses (with subject trees), and challenges in both English and Hebrew.

## Running Tests

```bash
# All tests
npm run test:all

# Unit tests only
npm run test:unit

# Integration tests (API tests with supertest)
npm run test:integration

# End-to-end tests (requires running server)
npm run test:e2e
```

### Test Configuration

- **Unit tests**: Jest with Node environment, coverage thresholds at 80% lines/functions/statements and 70% branches
- **Integration tests**: Jest + Supertest against in-memory SQLite
- **E2E tests**: Playwright with Chromium, auto-starts dev server on port 3000

### Linting & Formatting

```bash
npm run lint
npm run lint:fix
npm run format
```

## Docker

```bash
# Development (SQLite, auto-reload)
npm run docker:dev

# Production (PostgreSQL)
npm run docker:prod
```

The production Docker setup uses a multi-stage build (Node 20 Alpine) with `tini` as the init process and PostgreSQL 16 Alpine as the database.

## Deployment

### Render.com

The project includes a `render.yaml` blueprint for one-click deployment to Render:

- **Web service**: Free plan, Oregon region, Node runtime
- **Database**: PostgreSQL (free plan)
- **Build**: `npm install && npm run build && npm run db:setup`
- **Start**: `node server/index.js`

Required environment variables on Render:
- `OPENAI_API_KEY` or `GROQ_API_KEY` (for LLM features)
- `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` (for Google login)
- `SESSION_SECRET` (auto-generated by Render)
- `DATABASE_URL` (auto-linked from Render PostgreSQL)

## API Overview

All API endpoints are prefixed with `/api/v1/`. See the [Developer Guide](docs/developer-guide.md) for the complete API reference.

| Route Group | Base Path | Description |
|------------|-----------|-------------|
| Auth | `/api/v1/auth` | Register, login, logout, Google OAuth, test-login |
| Users | `/api/v1/users` | Profile management, stats |
| Institutions | `/api/v1/institutions` | List and retrieve institutions |
| Courses | `/api/v1/courses` | CRUD, subscriptions, subject trees, LLM generation |
| Challenges | `/api/v1/challenges` | CRUD, publish, archive, preview |
| Runs | `/api/v1/runs` | Start runs, submit phases, complete, reports |
| Analytics | `/api/v1/analytics` | Student and instructor analytics, PDF export |
| Import | `/api/v1/import` | YAML batch import |
| LLM | `/api/v1/llm` | Preview generation, model listing |
| Admin | `/api/v1/admin` | System overview, user/course/challenge management |
| Health | `/api/health` | Health check (database + LLM status) |

## License

Proprietary. All rights reserved.
