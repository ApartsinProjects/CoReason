# Developer Guide

Technical documentation for the AI CoReasoning Lab codebase: architecture, API reference, database schema, LLM integration, and testing strategy.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Codebase Structure](#codebase-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [LLM Integration](#llm-integration)
- [Authentication and Authorization](#authentication-and-authorization)
- [Internationalization](#internationalization)
- [Testing Strategy](#testing-strategy)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Key Design Decisions](#key-design-decisions)

---

## Architecture Overview

The application follows a layered architecture:

```
Client (Static HTML/JS/CSS)
    |
    v
Express Routes (/api/v1/*)         -- request parsing, validation, auth guards
    |
    v
Service Layer                       -- business logic, orchestration
    |
    +--> LLM Service                -- OpenAI/Groq API calls with fallback chain
    |       |
    |       v
    |    Prompt Engine              -- YAML template loading and variable substitution
    |
    v
Database (Knex.js)                  -- SQLite (dev) or PostgreSQL (prod)
```

### Request Flow

1. Client sends HTTP request to `/api/v1/*`
2. Express middleware chain: Helmet > CORS > compression > JSON parsing > session > Passport > request logger
3. Route handler validates input (Zod schemas), checks auth/role
4. Service layer executes business logic
5. LLM service called when AI content generation/evaluation is needed
6. Response returned as JSON
7. Error handler catches unhandled errors, logs them, returns structured error responses

---

## Codebase Structure

```
server/
  index.js                    # App entry point, middleware setup, route mounting
  routes/
    auth.routes.js            # Authentication endpoints
    user.routes.js            # User profile management
    institution.routes.js     # Institution listing
    course.routes.js          # Course CRUD, subscriptions, subject trees
    challenge.routes.js       # Challenge CRUD, publishing, previews
    run.routes.js             # Challenge run lifecycle
    analytics.routes.js       # Student and instructor analytics
    import.routes.js          # YAML batch import
    llm.routes.js             # LLM preview and model listing
    admin.routes.js           # Admin panel endpoints
  services/
    auth.service.js           # Registration, login, Google OAuth handling
    user.service.js           # Profile and stats
    institution.service.js    # Institution queries
    course.service.js         # Course management, subject tree operations
    challenge.service.js      # Challenge CRUD, publish/archive logic
    challenge-run.service.js  # Run lifecycle: start, submit phases, complete
    analytics.service.js      # Grade aggregation, student/instructor analytics
    import.service.js         # YAML import processing
    llm.service.js            # LLM provider management and prompt execution
    pdf.service.js            # PDF report generation
  middleware/
    auth.js                   # Passport config, requireAuth, requireRole, optionalAuth
    schemas.js                # Zod validation schemas
    validate.js               # Generic validation middleware
    error-handler.js          # Centralized error handler with LRU cache for stats
    request-logger.js         # HTTP request/response logging
  db/
    knexfile.js               # Database connection config (SQLite/PostgreSQL)
    migrations/               # Schema migrations
    seeds/                    # Seed data
  llm/
    prompt-engine.js          # YAML prompt loader, template variable substitution
  utils/
    constants.js              # All application constants (roles, statuses, grades, etc.)
    errors.js                 # Custom error classes (NotFoundError, ValidationError, etc.)
    helpers.js                # Utility functions (safeParse, etc.)
    logger.js                 # Winston logger factory
    trace.js                  # LLM call tracing/recording
    async-context.js          # AsyncLocalStorage for trace ID propagation
    config.js                 # Configuration loader

client/
  *.html                      # Static page files served by Express
  js/
    api-client.js             # Frontend API client module
    help-popups.js            # Help/tutorial popup system
    tooltips.js               # Tooltip initialization
    tour.js                   # Guided tour logic
    user-header.js            # User header component
  content-compiled/           # Build output: compiled i18n bundles
  content-loader.js           # Runtime i18n content loader
  styles.css                  # Application CSS

prompts/                      # LLM prompt templates (15 YAML files)
content/                      # i18n source content (5 languages)
```

---

## Database Schema

The database uses Knex.js migrations with UUID primary keys. Two migrations define the schema:

### Tables

#### `institutions`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key, auto-generated |
| name | string | Unique, not null |
| country | string | |
| departments | JSON | Array of department name strings |
| created_at, updated_at | timestamp | Auto-managed |

#### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| email | string | Unique, not null |
| password_hash | string | Null for SSO-only users |
| name | string | Not null |
| role | enum | `student` or `instructor` |
| institution_id | UUID | FK to institutions |
| profile_image | string | |
| google_id | string | Unique, for Google OAuth |
| microsoft_id | string | Unique, reserved for future use |
| preferred_language | string | Default `en` |
| tour_completed | boolean | Default false |
| settings | JSON | User preferences |

#### `courses`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | string | Not null |
| description | text | |
| institution_id | UUID | FK to institutions |
| department | string | Added in migration 002 |
| subject_tree | JSON | Hierarchical topic tree |
| steward_config | JSON | Model overrides |
| status | enum | `active` or `archived` |

#### `course_subscriptions`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK to users, cascade delete |
| course_id | UUID | FK to courses, cascade delete |
| subscribed_at | timestamp | |

Unique constraint on `(user_id, course_id)`.

#### `course_instructors`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK to users, cascade delete |
| course_id | UUID | FK to courses, cascade delete |
| joined_at | timestamp | |

Unique constraint on `(user_id, course_id)`.

#### `challenges`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| title | string | Not null |
| creator_id | UUID | FK to users |
| course_id | UUID | FK to courses |
| subject_path | JSON | Array of subject names in hierarchy |
| challenge_type | enum | `practice` or `assessment` |
| visibility | enum | `public` or `private` |
| response_config | JSON | `{ phase1: 'mc'\|'open-ended', phase2: 'mc'\|'open-ended' }` |
| max_cycles | integer | Default 5 |
| model_override | string | LLM model override |
| instructions | JSON | Per-phase custom instructions |
| rubrics | JSON | `{ framing: {...}, judging: {...}, steering: {...} }` |
| generated_content | JSON | Cached LLM content (problem, MC options, AI solution) |
| status | enum | `draft`, `published`, or `archived` |

Indexes on `creator_id`, `course_id`, `status`.

#### `challenge_runs`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| challenge_id | UUID | FK to challenges |
| user_id | UUID | FK to users |
| status | enum | `in_progress`, `completed`, `abandoned` |
| framing_response | JSON | Student's Phase 1 submission |
| framing_feedback | JSON | LLM evaluation of framing |
| framing_grade | string | A/B/C |
| ai_solution | text | Current AI-generated solution |
| current_cycle | integer | Default 0 |
| grades | JSON | Final `{ framing, judging, steering }` |
| started_at | timestamp | |
| completed_at | timestamp | |

Indexes on `challenge_id`, `user_id`, `status`.

#### `challenge_run_cycles`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| run_id | UUID | FK to challenge_runs, cascade delete |
| cycle_num | integer | Not null |
| judging_response | JSON | Student's judging submission |
| judging_feedback | JSON | LLM evaluation |
| judging_grade | string | A/B/C |
| steering_response | JSON | Student's steering submission |
| steering_feedback | JSON | LLM evaluation |
| steering_grade | string | A/B/C |
| ai_output | text | AI output after steering |
| mc_options | JSON | Cached MC options |

Unique constraint on `(run_id, cycle_num)`.

#### `prompt_templates`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| filename | string | Unique, not null |
| content | text | Not null |
| variables | JSON | List of `{{placeholder}}` names |
| config | JSON | Temperature, output_format, etc. |

#### `ui_labels`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| lang | string(5) | Language code |
| key | string | Label key |
| value | text | Translated text |

Unique constraint on `(lang, key)`.

#### `import_jobs`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| status | enum | `pending`, `running`, `completed`, `failed` |
| filename | string | |
| summary | JSON | `{ users: N, courses: N, ... }` |
| errors | JSON | Array of error messages |
| started_at, completed_at | timestamp | |

---

## API Reference

All endpoints are prefixed with `/api/v1/` unless noted otherwise. Authentication is session-based (cookie).

### Authentication (`/api/v1/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Register new user. Body: `{ email, password, name, role?, institutionId? }` |
| POST | `/login` | No | Login with email/password. Body: `{ email, password }` |
| GET | `/google` | No | Initiate Google OAuth flow |
| GET | `/google/callback` | No | Google OAuth callback (redirects to challenge list) |
| POST | `/logout` | Yes | End session |
| POST | `/test-login` | No | Dev-only: login as existing user without password. Body: `{ email }` |
| GET | `/test-users` | No | Dev-only: list available test users |
| GET | `/me` | Yes | Get current authenticated user |

### Users (`/api/v1/users`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/me` | Yes | Get user profile with institution details |
| PUT | `/me` | Yes | Update profile (name, preferred_language, tour_completed, etc.) |
| GET | `/me/stats` | Yes | Get user statistics (run counts, grade averages) |

### Institutions (`/api/v1/institutions`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | List all institutions (with parsed departments) |
| GET | `/:id` | No | Get institution by ID |

### Courses (`/api/v1/courses`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/` | No | -- | List courses (filter: `institutionId`, `search`) |
| POST | `/` | Yes | Instructor | Create course. Body: `{ name, description?, department?, institutionId?, subjectTree?, stewardConfig? }` |
| POST | `/generate-subject-tree` | Yes | Instructor | Generate subject tree without existing course. Body: `{ courseName, courseDescription?, instructions?, language? }` |
| GET | `/:id` | No | -- | Get course by ID |
| PUT | `/:id` | Yes | -- | Update course |
| POST | `/:id/subscribe` | Yes | -- | Subscribe to course (student) |
| DELETE | `/:id/subscribe` | Yes | -- | Unsubscribe from course |
| POST | `/:id/join` | Yes | Instructor | Join as co-instructor |
| DELETE | `/:id/leave` | Yes | -- | Leave as instructor |
| GET | `/:id/subjects` | No | -- | Get course subject tree |
| PUT | `/:id/subjects` | Yes | -- | Update subject tree |
| POST | `/:id/subjects/generate` | Yes | Instructor | Generate subject tree via LLM. Body: `{ instructions?, language?, autoSave? }` |

### Challenges (`/api/v1/challenges`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Optional | List challenges. Filters: `courseId`, `mine`, `type`, `visibility`, `status`, `search` |
| POST | `/` | Yes | Create challenge. Body: see Zod schema below |
| POST | `/preview-problem` | Yes | Generate problem preview. Body: `{ course, subjects[] }` |
| POST | `/preview-rubric` | Yes | Generate rubric preview. Body: `{ course, subjects[], language? }` |
| GET | `/:id` | Optional | Get challenge (private challenges require auth + ownership) |
| PUT | `/:id` | Yes | Update challenge |
| PUT | `/:id/rename` | Yes | Rename challenge. Body: `{ title }` |
| PUT | `/:id/archive` | Yes | Archive challenge |
| DELETE | `/:id` | Yes | Delete challenge |
| POST | `/:id/publish` | Yes | Publish draft challenge |
| POST | `/:id/runs` | Yes | Start a run for this challenge |

**Create Challenge Body Schema**:
```json
{
  "title": "string (1-200 chars, required)",
  "courseId": "UUID (optional)",
  "subjectPath": ["string array (optional)"],
  "challengeType": "practice | assessment (default: practice)",
  "visibility": "public | private (default: private)",
  "maxCycles": "integer 1-20 (default: 5)",
  "responseConfig": {
    "phase1": "mc | open-ended",
    "phase2": "mc | open-ended"
  },
  "instructions": "object (optional)",
  "rubrics": "object (optional)"
}
```

### Challenge Runs (`/api/v1/runs`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Yes | Start new run. Body: `{ challengeId }` |
| GET | `/:runId` | Yes | Get run state (problem, cycles, responses, feedback) |
| PUT | `/:runId/framing` | Yes | Submit framing response |
| PUT | `/:runId/cycles/:n/judging` | Yes | Submit judging for cycle N |
| PUT | `/:runId/cycles/:n/steering` | Yes | Submit steering for cycle N |
| PUT | `/:runId/complete` | Yes | Mark run as completed |
| GET | `/:runId/report` | Yes | Get completed run report |

#### Run Lifecycle State Machine

```
POST /runs                    --> status: in_progress, phase: framing
PUT  /runs/:id/framing        --> phase: judging (cycle 1)
PUT  /runs/:id/cycles/1/judging   --> phase: steering (cycle 1)
PUT  /runs/:id/cycles/1/steering  --> phase: judging (cycle 2) OR complete
  ...repeat for each cycle...
PUT  /runs/:id/complete       --> status: completed
```

### Analytics (`/api/v1/analytics`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/student` | Yes | -- | Student's own analytics overview |
| GET | `/student/challenge/:id` | Yes | -- | Student's analytics for specific challenge |
| GET | `/instructor/:courseId` | Yes | Instructor | Course-level analytics (requires course instructor membership) |
| GET | `/instructor/:courseId/export` | Yes | Instructor | Export analytics as JSON |
| GET | `/instructor/:courseId/export/pdf` | Yes | Instructor | Export analytics as PDF |

### Import (`/api/v1/import`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/batch` | Yes | Instructor | Import YAML data. Body: YAML content object |
| GET | `/status/:jobId` | Yes | Instructor | Check import job status |

### LLM (`/api/v1/llm`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/preview` | Yes | Generate LLM preview |
| GET | `/models` | Yes | List available LLM models |

### Admin (`/api/v1/admin`)

All admin routes require authentication with the `instructor` role.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/overview` | System statistics (user/course/run counts) |
| GET | `/users` | List all users |
| GET | `/institutions` | List all institutions |
| GET | `/courses` | List all courses with subscriber/challenge counts |
| GET | `/challenges` | List all challenges with creator and run counts |
| GET | `/runs` | Recent runs (limit 100) |
| GET | `/prompt-templates` | File-based and DB-stored prompt templates |
| GET | `/config` | Server configuration (sanitized, no secrets) |
| GET | `/db-tables` | Table row counts |
| GET | `/errors` | Recent error statistics |

### Health Check

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Returns `{ status, env, database, llm, uptime_seconds }` |

---

## LLM Integration

### Provider Architecture

The `LLMService` initializes all available providers from environment variables and calls them with automatic failover:

1. **OpenAI** (primary): `gpt-4o-mini` (default) or `gpt-4o` (full)
2. **Groq** (fallback): `llama-3.3-70b-versatile` via OpenAI-compatible API
3. **Google Gemini**: Key supported but not yet wired into the provider chain
4. **Cohere**: Key supported but not yet wired into the provider chain

If a provider fails, the service automatically tries the next one. If all providers fail, an `LLMError` is thrown. If no API keys are configured at startup, all LLM functions return hardcoded fallback responses.

### Prompt Templates

Prompts are defined as YAML files in the `prompts/` directory. Each template has:

```yaml
id: generate-problem
version: "1.0"
description: "What this prompt does"

system_prompt: |
  System instructions with {{variables}}...

user_prompt: |
  User message with {{course_name}} and {{subject_path}}...

parameters:
  temperature: 0.8
  max_tokens: 500
```

The `PromptEngine` loads all YAML files at startup, resolves `{{variable}}` placeholders at call time, and returns structured messages for the OpenAI chat completions API.

### Prompt Catalog

| File | ID | Purpose |
|------|----|---------|
| `01-generate-problem.yaml` | generate-problem | Create ill-defined raw problem |
| `02-generate-rubrics.yaml` | generate-rubrics | Generate evaluation rubrics |
| `03-generate-ai-solution.yaml` | generate-ai-solution | Produce AI solution based on student framing |
| `04-generate-ai-updated-output.yaml` | generate-ai-updated-output | Regenerate solution after steering |
| `05-generate-framing-mc.yaml` | generate-framing-mc | Generate framing multiple-choice options |
| `06-generate-judging-mc.yaml` | generate-judging-mc | Generate judging multiple-choice options |
| `07-generate-steering-mc.yaml` | generate-steering-mc | Generate steering multiple-choice options |
| `08-evaluate-framing.yaml` | evaluate-framing | Grade and provide feedback on framing |
| `09-evaluate-judging.yaml` | evaluate-judging | Grade and provide feedback on judging |
| `10-evaluate-steering.yaml` | evaluate-steering | Grade and provide feedback on steering |
| `11-grade.yaml` | grade | Final grading |
| `12-generate-example-preview.yaml` | generate-example-preview | Generate challenge preview for instructors |
| `13-generate-subject-tree.yaml` | generate-subject-tree | Generate course subject tree |
| `14-generate-rubric-preview.yaml` | generate-rubric-preview | Generate rubric preview |
| `14-generate-best-framing.yaml` | generate-best-framing | Generate ideal framing for evaluation |

### MC Option Normalization

LLM responses for multiple-choice options are normalized to a standard format:

```json
[
  { "letter": "A", "text": "Option text...", "correct": true },
  { "letter": "B", "text": "Option text...", "correct": false }
]
```

The normalizer handles various LLM response formats including `{ options: [...] }` wrappers and different boolean field names (`correct`, `is_real_issue`, `is_correct`).

### MC Parameters

| Phase | Total Options | Correct | Incorrect |
|-------|--------------|---------|-----------|
| Framing | 5 | 3 | 2 |
| Judging | 5 | 3 | 2 |
| Steering | 5 | 2 | 3 |

---

## Authentication and Authorization

### Authentication Methods

1. **Local** (Passport LocalStrategy): Email + bcrypt-hashed password (12 rounds)
2. **Google OAuth 2.0** (Passport GoogleStrategy): Requires `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET`
3. **Test Login** (dev only): Disabled when `NODE_ENV=production`

### Session Management

- Sessions stored in memory for SQLite, `connect-pg-simple` for PostgreSQL
- Session cookie: `coreason.sid`, httpOnly, secure in production, sameSite: lax
- Default max age: 30 days

### Authorization Middleware

| Middleware | Effect |
|-----------|--------|
| `requireAuth` | Returns 401 if not authenticated |
| `requireRole(...roles)` | Returns 403 if user's role not in allowed list |
| `optionalAuth` | Populates `req.user` if authenticated, passes through otherwise |

### Roles

| Role | Capabilities |
|------|-------------|
| `student` | Run challenges, view own analytics, subscribe to courses, create practice challenges |
| `instructor` | All student capabilities + create/manage courses, create any challenge type, view course analytics, import data, admin panel |
| `admin` | Planned but not yet in DB schema; instructor role used as proxy |

---

## Internationalization

### Architecture

The i18n system separates **UI language** (interface labels) from **content language** (LLM-generated text):

```
content/
  en/
    ui-labels.yaml      # UI strings: buttons, headers, form labels
    tooltips.yaml       # Help tooltips
    institutions.yaml   # Institution data
    scenarios.yaml      # Challenge scenario templates
    mockup-data.yaml    # Demo/mockup content
  he/                   # Hebrew (RTL)
  fr/                   # French
  de/                   # German
  es/                   # Spanish
```

### Build Process

`npm run build` (runs `build-content.js`) compiles YAML source files into JavaScript bundles under `client/content-compiled/`:
- `en.js`, `he.js`, `fr.js`, `de.js`, `es.js`

### Runtime Loading

The `content-loader.js` module loads the appropriate compiled bundle based on the user's `preferred_language` setting. The client reads labels via a global content object.

### LLM Language

When calling LLM prompts, the service resolves the user's language code to a full name using the `LANGUAGE_NAMES` map:
- `en` -> `English`
- `he` -> `Hebrew`
- `fr` -> `French`
- `de` -> `German`
- `es` -> `Spanish`

This name is passed as a `{{language}}` variable to prompt templates, instructing the LLM to generate content in the appropriate language.

---

## Testing Strategy

### Test Pyramid

```
            /  E2E  \          Playwright + Chromium
           /----------\
          / Integration \       Jest + Supertest
         /----------------\
        /    Unit Tests     \   Jest
       /--------------------\
```

### Unit Tests (`tests/unit/`)

- **Framework**: Jest
- **Location**: `tests/unit/services/` and `tests/unit/utils/`
- **Coverage**: `auth.service.test.js`, `challenge.service.test.js`, `course.service.test.js`, `config.test.js`, `errors.test.js`
- **Approach**: Test service methods in isolation with mocked database (Knex) and logger

### Integration Tests (`tests/integration/`)

- **Framework**: Jest + Supertest
- **Location**: `tests/integration/api.test.js`, `tests/integration/full-flows.test.js`
- **Approach**: Start the Express app with an in-memory SQLite database, make real HTTP requests, verify responses
- **Coverage**: Full API endpoint testing, multi-step flow testing (register -> create course -> create challenge -> run challenge)

### E2E Tests (`tests/e2e/`)

- **Framework**: Playwright
- **Browser**: Chromium (Desktop Chrome device profile)
- **Configuration** (`playwright.config.js`):
  - Base URL: `http://localhost:3000`
  - Timeout: 30 seconds per test
  - Retries: 1
  - Screenshots on failure
  - Trace on first retry
  - Auto-starts dev server if not running

### Test Configuration (`jest.config.js`)

- Environment: Node
- Coverage thresholds:
  - Branches: 70%
  - Functions: 80%
  - Lines: 80%
  - Statements: 80%
- Coverage excludes migrations and seeds
- Setup file: `tests/setup.js`

### Running Tests

```bash
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e           # E2E tests (starts dev server)
npm run test:all           # All three in sequence
npm test                   # All Jest tests (unit + integration)
```

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | `development`, `staging`, `production` |
| `PORT` | No | `3000` | Server port |
| `SESSION_SECRET` | Recommended | Config file value | Session encryption secret |
| `DATABASE_URL` | Prod only | SQLite file | PostgreSQL connection string |
| `OPENAI_API_KEY` | No | -- | OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | Default OpenAI model |
| `OPENAI_MODEL_FULL` | No | `gpt-4o` | Full-power OpenAI model |
| `GROQ_API_KEY` | No | -- | Groq API key |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | Groq model |
| `GROQ_BASE_URL` | No | `https://api.groq.com/openai/v1` | Groq API base URL |
| `GEMINI_API_KEY` | No | -- | Google Gemini API key (key only, not wired) |
| `COHERE_API_KEY` | No | -- | Cohere API key (key only, not wired) |
| `GOOGLE_OAUTH_CLIENT_ID` | No | -- | Google OAuth client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | No | -- | Google OAuth client secret |

### Constants (`server/utils/constants.js`)

All magic numbers, strings, and configuration values are centralized in this file. Key groups:

- `SERVER` -- Port, shutdown timeout, body limit, session cookie name
- `ROLES` -- User roles (`student`, `instructor`, `admin`)
- `CHALLENGE_STATUS` -- `draft`, `published`, `archived`
- `RUN_STATUS` -- `in_progress`, `completed`, `abandoned`
- `RUN_PHASE` -- `framing`, `judging`, `steering`, `complete`
- `RESPONSE_TYPE` -- `mc`, `open-ended`
- `GRADES` / `GRADE_SCORES` / `GRADE_THRESHOLDS` -- Grading system
- `MC_PARAMS` -- Number of correct/incorrect options per phase
- `VALIDATION` -- Min password length, max title length, etc.
- `LLM_MODELS` / `LLM_MODEL_CATALOG` -- Model IDs and display names
- `LLM_FALLBACK` -- Fallback messages when LLM is unavailable
- `DB_TABLES` -- Table names for admin endpoint

---

## Deployment

### Render.com (Primary)

The `render.yaml` blueprint configures:
- **Web service**: Node.js, free plan, Oregon region
- **PostgreSQL database**: Free plan, auto-linked via `DATABASE_URL`
- **Build command**: `npm install && npm run build && npm run db:setup`
- **Start command**: `node server/index.js`

Deploy by connecting the repository to Render and selecting the blueprint.

### Docker

**Development**:
```bash
npm run docker:dev
# Uses docker/docker-compose.dev.yml with SQLite and auto-reload
```

**Production**:
```bash
npm run docker:prod
# Uses docker/docker-compose.yml with PostgreSQL 16
```

The production Dockerfile uses a multi-stage build:
1. Builder stage: `node:20-alpine`, installs production deps, runs content build
2. Production stage: `node:20-alpine` with `tini` init process, copies only needed files

### Database Migration in Production

```bash
# Apply migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback

# Full reset (rollback + migrate + seed)
npm run db:reset
```

---

## Key Design Decisions

### Dual Database Support
SQLite is used for development and testing for zero-configuration setup. PostgreSQL is used in staging/production for reliability and concurrency. Knex.js abstracts the differences.

### LLM Fallback Chain
The system degrades gracefully: OpenAI -> Groq -> hardcoded fallbacks. The application is fully functional even without any LLM API keys, using static placeholder content.

### Response Config Normalization
The `response_config` field supports two naming conventions: `{ phase1, phase2 }` (from YAML import) and `{ framing, judging, steering }` (from the UI). The `_normalizeResponseConfig()` method handles both transparently.

### Content Caching
Generated LLM content (raw problems, MC options) is cached in the challenge's `generated_content` JSON column. Subsequent runs of the same challenge reuse cached content rather than making new LLM calls. Invalid cached options are automatically repaired.

### Stateless Frontend
The client is entirely static HTML/JS/CSS served by Express. There is no build step for the frontend itself (only for i18n content compilation). All dynamic behavior is handled via API calls from `api-client.js`.

### Grade Aggregation
Per-cycle grades (A=3, B=2, C=1) are averaged to produce final Judging and Steering grades. Thresholds: >= 2.5 = A, >= 1.5 = B, otherwise C. Framing has a single grade from Phase 1.
