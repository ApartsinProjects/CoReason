# CoReasoning Lab — Implementation Plan

**Version:** 1.0
**Date:** 2026-03-16
**Status:** Approved for implementation

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Deployment Configurations](#4-deployment-configurations)
5. [Backend Services](#5-backend-services)
6. [Frontend Integration](#6-frontend-integration)
7. [ModelMesh LLM Integration](#7-modelmesh-llm-integration)
8. [Database Design](#8-database-design)
9. [API Contract](#9-api-contract)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Content Import Pipeline](#11-content-import-pipeline)
12. [Multi-Language Support](#12-multi-language-support)
13. [Logging, Tracing & Error Handling](#13-logging-tracing--error-handling)
14. [Testing Strategy](#14-testing-strategy)
15. [Documentation Suite](#15-documentation-suite)
16. [Product Tour & Guided Onboarding](#16-product-tour--guided-onboarding)
17. [Environments & CI/CD](#17-environments--cicd)
18. [Implementation Phases](#18-implementation-phases)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Static)                     │
│  HTML/CSS/JS mockups → enhanced with fetch() API calls  │
│  Served via Express static / CDN / Cloudflare Pages     │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────────────┐
│                  Backend (Node.js/Express)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Auth     │ │ Challenge│ │ Course   │ │ Analytics  │ │
│  │ Service  │ │ Service  │ │ Service  │ │ Service    │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬───────┘ │
│       │            │            │             │         │
│  ┌────▼────────────▼────────────▼─────────────▼───────┐ │
│  │              Data Access Layer (Knex.js)            │ │
│  └────────────────────┬───────────────────────────────┘ │
│                       │                                 │
│  ┌────────────────────▼───────────────────────────────┐ │
│  │         ModelMesh (LLM Abstraction)                │ │
│  │  OpenAI │ Anthropic │ Gemini │ Groq │ Cohere │... │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Database                                    │
│  Local: SQLite  │  Staging/Prod: PostgreSQL (free tier) │
└─────────────────────────────────────────────────────────┘
```

**Design Principles:**
- **Mockup-first**: Every screen in `screens/` is the source of truth for UX. Backend APIs are wired into existing HTML/JS — no rewrite.
- **Contract-driven**: Every service exposes a typed API contract (OpenAPI spec). Frontend and backend are independently testable.
- **Config-driven**: All behavior switchable via YAML config + environment variables.
- **Observable**: Structured JSON logs, request tracing, decision audit trails.

---

## 2. Technology Stack

### Backend
| Component | Technology | Why |
|-----------|-----------|-----|
| Runtime | Node.js 20 LTS | Matches existing JS ecosystem |
| Framework | Express.js 4.x | Lightweight, well-tested, free-tier friendly |
| Database ORM | Knex.js | Supports SQLite (local) + PostgreSQL (prod) |
| LLM Access | @nistrapa/modelmesh-core | Unified OpenAI-compatible API across providers |
| Auth | Passport.js + express-session | Google/Microsoft SSO + email/password |
| Validation | Zod | Runtime schema validation for API contracts |
| Config | dotenv + js-yaml | Environment + YAML configuration |
| Logging | Winston | Structured JSON logging with transports |
| Testing | Jest + Supertest | Unit + integration API testing |

### Frontend
| Component | Technology | Why |
|-----------|-----------|-----|
| UI | Existing HTML/CSS/JS mockups | 100% mockup alignment guaranteed |
| API Client | Vanilla fetch() wrapper | No framework overhead |
| Tour | Shepherd.js | Lightweight product tour library |
| Testing | Playwright | E2E browser testing |

### Infrastructure
| Component | Technology | Why |
|-----------|-----------|-----|
| Containerization | Docker + docker-compose | Consistent across all environments |
| CI/CD | GitHub Actions | Free for public repos, integrates with Render |
| Free-tier hosting | Render.com (Web Service + PostgreSQL) | Free tier with auto-deploy from GitHub |
| CDN/Static | Cloudflare Pages (optional) | Free tier, global CDN |
| Secrets | .env.all (local) / GitHub Secrets (deploy) | Per user requirement |

---

## 3. Project Structure

```
CoReason/
├── server/                          # Backend application
│   ├── index.js                     # Express app entry point
│   ├── config/
│   │   ├── default.yaml             # Default system configuration
│   │   ├── staging.yaml             # Staging overrides
│   │   ├── production.yaml          # Production overrides
│   │   └── local.yaml               # Local dev overrides (gitignored)
│   ├── middleware/
│   │   ├── auth.js                  # Authentication middleware
│   │   ├── error-handler.js         # Global error handler + logging
│   │   ├── request-logger.js        # Request/response logging
│   │   └── validate.js              # Zod schema validation middleware
│   ├── routes/
│   │   ├── auth.routes.js           # /api/auth/*
│   │   ├── challenge.routes.js      # /api/challenges/*
│   │   ├── course.routes.js         # /api/courses/*
│   │   ├── user.routes.js           # /api/users/*
│   │   ├── analytics.routes.js      # /api/analytics/*
│   │   ├── import.routes.js         # /api/import/*
│   │   └── llm.routes.js            # /api/llm/* (internal)
│   ├── services/
│   │   ├── auth.service.js          # Auth business logic
│   │   ├── challenge.service.js     # Challenge CRUD + lifecycle
│   │   ├── challenge-run.service.js # Challenge execution engine
│   │   ├── course.service.js        # Course + subscription logic
│   │   ├── user.service.js          # User profile management
│   │   ├── analytics.service.js     # Grade aggregation + reports
│   │   ├── llm.service.js           # ModelMesh wrapper + prompt engine
│   │   └── import.service.js        # YAML batch import
│   ├── models/                      # Knex model definitions
│   │   ├── user.model.js
│   │   ├── challenge.model.js
│   │   ├── challenge-run.model.js
│   │   ├── course.model.js
│   │   ├── institution.model.js
│   │   └── subject.model.js
│   ├── db/
│   │   ├── knexfile.js              # Knex configuration (SQLite/PostgreSQL)
│   │   ├── migrations/              # Database migrations
│   │   └── seeds/                   # Seed data from mockup content
│   ├── llm/
│   │   ├── modelmesh-config.yaml    # ModelMesh provider configuration
│   │   ├── prompt-engine.js         # Template renderer ({{placeholders}})
│   │   └── prompt-loader.js         # Load prompts from prompts/ YAML
│   └── utils/
│       ├── logger.js                # Winston logger setup
│       ├── errors.js                # Custom error classes
│       └── trace.js                 # Decision trace recorder
│
├── screens/                         # Frontend (existing mockups — enhanced)
│   ├── js/
│   │   ├── api-client.js            # Unified fetch() wrapper for all APIs
│   │   ├── auth.js                  # Login/signup API integration
│   │   ├── challenge-api.js         # Challenge CRUD + run API
│   │   ├── course-api.js            # Course subscription API
│   │   ├── analytics-api.js         # Analytics data fetching
│   │   ├── tour.js                  # Product tour (Shepherd.js)
│   │   └── help-popups.js           # Contextual help tooltips
│   ├── help/                        # Linked HTML help files
│   │   ├── framing-help.html
│   │   ├── judging-help.html
│   │   ├── steering-help.html
│   │   ├── rubric-help.html
│   │   └── analytics-help.html
│   ├── tour/                        # Tour step definitions
│   │   ├── student-tour.js
│   │   └── instructor-tour.js
│   └── (existing files preserved)
│
├── content/                         # Multilingual YAML (existing)
├── prompts/                         # LLM prompt templates (existing)
├── scenarios/                       # Course curriculum (existing)
├── docs/                            # Documentation (existing + new)
│   ├── IMPLEMENTATION-PLAN.md       # This file
│   ├── user-manual.md
│   ├── developer-manual.md
│   ├── admin-manual.md
│   └── CONOPS.md                    # Existing
│
├── tests/
│   ├── unit/                        # Jest unit tests
│   │   ├── services/               # Service-level tests
│   │   ├── models/                  # Model-level tests
│   │   └── utils/                   # Utility tests
│   ├── integration/                 # API integration tests (Supertest)
│   │   ├── auth.test.js
│   │   ├── challenge.test.js
│   │   ├── course.test.js
│   │   └── analytics.test.js
│   ├── e2e/                         # Playwright E2E tests
│   │   ├── signup.spec.js
│   │   ├── challenge-run.spec.js
│   │   ├── course-catalog.spec.js
│   │   ├── analytics.spec.js
│   │   └── language-switch.spec.js
│   └── fixtures/                    # Test data
│       ├── users.json
│       ├── challenges.json
│       └── courses.json
│
├── import/                          # Batch import YAML files
│   ├── schema/                      # Import YAML schemas (Zod)
│   │   ├── users.schema.js
│   │   ├── institutions.schema.js
│   │   ├── courses.schema.js
│   │   └── challenges.schema.js
│   └── sample/                      # Sample import files
│       └── full-import.yaml
│
├── docker/
│   ├── Dockerfile                   # Multi-stage build
│   ├── Dockerfile.dev               # Development with hot-reload
│   └── docker-compose.yml           # Full stack (app + db)
│   └── docker-compose.dev.yml       # Dev stack (SQLite + hot-reload)
│
├── .github/
│   └── workflows/
│       ├── ci.yml                   # Test + lint on PR
│       ├── deploy-staging.yml       # Auto-deploy to staging
│       └── deploy-production.yml    # Manual deploy to production
│
├── .env.all                         # All API keys (local only, gitignored)
├── .env.example                     # Template for required env vars
├── package.json                     # Unified package.json
├── knexfile.js                      # Root-level Knex config
├── jest.config.js                   # Jest configuration
├── playwright.config.js             # Playwright configuration
└── build-content.js                 # Existing content compiler
```

---

## 4. Deployment Configurations

### 4.1 Local Development
```yaml
# server/config/local.yaml
server:
  port: 3000
  static_dir: ../screens
database:
  client: sqlite3
  filename: ./data/coreason-dev.sqlite3
llm:
  config: ./llm/modelmesh-config.yaml
  env_file: ../.env.all
auth:
  session_secret: dev-secret-change-me
  google_callback: http://localhost:3000/api/auth/google/callback
  microsoft_callback: http://localhost:3000/api/auth/microsoft/callback
logging:
  level: debug
  file: ./logs/coreason.log
  console: true
```

### 4.2 Render Free Tier (Staging & Production)
```yaml
# server/config/staging.yaml
server:
  port: ${PORT}               # Render sets this
  static_dir: ../screens
database:
  client: pg
  connection: ${DATABASE_URL}  # Render PostgreSQL
llm:
  config: ./llm/modelmesh-config.yaml
  # Keys from GitHub Secrets → Render env vars
auth:
  session_secret: ${SESSION_SECRET}
  google_callback: https://coreason-staging.onrender.com/api/auth/google/callback
  microsoft_callback: https://coreason-staging.onrender.com/api/auth/microsoft/callback
logging:
  level: info
  file: /tmp/coreason.log
  console: true
```

### 4.3 Future AWS/Azure (Not This Release)
```yaml
# server/config/production-aws.yaml (placeholder)
# Architecture notes for future scaling:
# - ECS Fargate for containers
# - RDS PostgreSQL
# - ElastiCache Redis for sessions
# - CloudFront for static assets
# - S3 for file storage
# - CloudWatch for logs
```

### 4.4 Docker
```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env.all
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://coreason:coreason@db:5432/coreason
    depends_on: [db]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: coreason
      POSTGRES_USER: coreason
      POSTGRES_PASSWORD: coreason
    volumes: [pgdata:/var/lib/postgresql/data]
volumes:
  pgdata:
```

---

## 5. Backend Services

### 5.1 Service Architecture

Each service follows this pattern:
```javascript
// Every service method:
// 1. Validates input (Zod schema)
// 2. Executes business logic
// 3. Logs structured trace
// 4. Returns typed result or throws typed error

class ChallengeService {
  async create(data, userId)      // → Challenge
  async get(id, userId)           // → Challenge (with auth check)
  async list(filters, userId)     // → { items, total, page }
  async update(id, data, userId)  // → Challenge
  async archive(id, userId)       // → void
  async delete(id, userId)        // → void
  async publish(id, userId)       // → void
}
```

### 5.2 Challenge Run Engine (Core)

Maps directly to mockup screen `05-challenge-run.html`:

```
ChallengeRunService
├── startRun(challengeId, userId)
│   ├── Load challenge definition
│   ├── LLM: generate problem (prompt 01)
│   ├── LLM: generate MC options if needed (prompt 05)
│   └── Return: { runId, rawProblem, framingOptions? }
│
├── submitFraming(runId, response)
│   ├── LLM: generate AI solution (prompt 03)
│   ├── LLM: evaluate framing (prompt 08) → grade
│   ├── LLM: generate judging MC options (prompt 06)
│   └── Return: { aiSolution, framingFeedback?, judgingOptions? }
│
├── submitJudging(runId, cycleNum, response)
│   ├── Record judging (NOT sent to AI)
│   ├── LLM: generate steering MC options (prompt 07)
│   └── Return: { steeringOptions? }
│
├── submitSteering(runId, cycleNum, response)
│   ├── LLM: generate updated AI output (prompt 04)
│   ├── LLM: evaluate judging (prompt 09) → grade
│   ├── LLM: evaluate steering (prompt 10) → grade
│   ├── LLM: generate next judging MC options (prompt 06)
│   └── Return: { updatedSolution, feedback?, nextJudgingOptions? }
│
├── markComplete(runId)
│   ├── LLM: final grading (prompt 11)
│   └── Return: { finalGrades: {framing, judging, steering} }
│
└── getRunState(runId)
    └── Return: full run state for resume/display
```

### 5.3 Service Contracts (Zod Schemas)

Every API endpoint has input/output schemas:

```javascript
// Example: Create Challenge
const CreateChallengeInput = z.object({
  title: z.string().min(1).max(200),
  courseId: z.string().uuid(),
  subjectPath: z.array(z.string()),
  phase1ResponseType: z.enum(['mc', 'open-ended']),
  phase2ResponseType: z.enum(['mc', 'open-ended']),
  maxCycles: z.number().int().min(1).max(10).default(5),
  challengeType: z.enum(['practice', 'assessment']),
  visibility: z.enum(['public', 'private']),
  instructions: z.object({
    phase1: z.string().optional(),
    phase2: z.string().optional(),
  }).optional(),
  modelOverride: z.string().optional(),
});
```

---

## 6. Frontend Integration

### 6.1 Mockup Preservation Strategy

**Rule: Zero visual changes to mockup HTML/CSS.** Backend is wired via:

1. **api-client.js** — Thin fetch() wrapper with auth headers, error handling, base URL config
2. **Per-screen JS modules** — Each screen gets a companion `*-api.js` that replaces mock data with live API calls
3. **Progressive enhancement** — Screens work with mock data when offline, switch to API when backend available

### 6.2 Screen → API Mapping

| Screen | File | API Endpoints |
|--------|------|---------------|
| Login | 00-login.html | POST /api/auth/login, GET /api/auth/google, GET /api/auth/microsoft |
| Sign Up | 01-sign-up.html | POST /api/auth/register, GET /api/institutions |
| Challenge List | 03-challenge-list.html | GET /api/challenges?filters, DELETE /api/challenges/:id |
| Challenge List (Instructor) | 03-challenge-list-instructor.html | GET /api/challenges?role=instructor |
| Create Challenge | 04-create-challenge.html | POST /api/challenges, GET /api/courses, GET /api/subjects/:courseId |
| Create Challenge (Student) | 04b-create-challenge-student.html | POST /api/challenges (visibility=private) |
| Challenge Run | 05-challenge-run.html | POST /api/runs, PUT /api/runs/:id/framing, PUT /api/runs/:id/judging, PUT /api/runs/:id/steering |
| Challenge Run (Instructor) | 05-challenge-run-instructor.html | Same as above (preview mode) |
| Challenge Run (Open-ended) | 05b-challenge-run-open-ended.html | Same endpoints, different response format |
| Course Catalog | 06-course-catalog.html | GET /api/courses, POST /api/courses/:id/subscribe |
| Course Catalog (Instructor) | 06-course-catalog-instructor.html | GET /api/courses?role=instructor, POST /api/courses/:id/join |
| Student Analytics | 07-student-analytics.html | GET /api/analytics/student |
| Challenge Report | 07b-challenge-report.html | GET /api/analytics/challenge/:id |
| Instructor Analytics | 08-instructor-analytics.html | GET /api/analytics/instructor/:courseId |
| Profile | 09-profile.html | GET /api/users/me, PUT /api/users/me |
| Edit Subject Tree | 10-edit-subject-tree.html | GET/PUT /api/subjects/:courseId/tree |
| Add Course | 10b-add-course.html | POST /api/courses |

### 6.3 API Client Pattern

```javascript
// screens/js/api-client.js
const API = {
  baseUrl: window.location.origin + '/api',

  async request(method, path, body) {
    const res = await fetch(this.baseUrl + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // session cookie
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new ApiError(err.code, err.message, err.details);
    }
    return res.json();
  },

  get: (path) => API.request('GET', path),
  post: (path, body) => API.request('POST', path, body),
  put: (path, body) => API.request('PUT', path, body),
  delete: (path) => API.request('DELETE', path),
};
```

---

## 7. ModelMesh LLM Integration

### 7.1 Configuration

```yaml
# server/llm/modelmesh-config.yaml
providers:
  openai.llm.v1:
    connector: openai.llm.v1
    config:
      api_key: "${secrets:OPENAI_API_KEY}"
  anthropic.claude.v1:
    connector: anthropic.claude.v1
    config:
      api_key: "${secrets:ANTHROPIC_API_KEY}"
  gemini.v1:
    connector: google.gemini.v1
    config:
      api_key: "${secrets:GEMINI_API_KEY}"
  groq.v1:
    connector: groq.v1
    config:
      api_key: "${secrets:GROQ_API_KEY}"
  cohere.v1:
    connector: cohere.v1
    config:
      api_key: "${secrets:COHERE_API_KEY}"

models:
  openai.gpt-4o:
    provider: openai.llm.v1
    capabilities: [generation.text-generation.chat-completion]
  anthropic.claude-sonnet:
    provider: anthropic.claude.v1
    capabilities: [generation.text-generation.chat-completion]
  gemini.gemini-2.0-flash:
    provider: gemini.v1
    capabilities: [generation.text-generation.chat-completion]

pools:
  chat:
    capability: generation.text-generation.chat-completion
    strategy: stick-until-failure

# System-wide defaults (REQ-MODEL-01)
defaults:
  model: chat                    # Use pool-based routing by default
  retry:
    max_retries: 3
    backoff_ms: 1000
  budget:
    max_cost_per_run: 0.50       # USD per challenge run
```

### 7.2 Prompt Engine

```javascript
// server/llm/prompt-engine.js
class PromptEngine {
  constructor(modelMeshClient, promptLoader, logger) { ... }

  // Load YAML prompt template, fill placeholders, call LLM
  async execute(promptId, variables, options = {}) {
    const template = this.promptLoader.get(promptId);
    const filled = this.fillTemplate(template, variables);

    const model = options.modelOverride || this.defaultModel;

    this.logger.trace('llm-call', {
      promptId, model, variables: Object.keys(variables)
    });

    const response = await this.client.chat.completions.create({
      model,
      messages: filled.messages,
      temperature: template.temperature || 0.7,
    });

    this.logger.trace('llm-response', {
      promptId, model,
      tokens: response.usage,
      cost: response.usage?.total_cost
    });

    return this.parseResponse(response, template.output_format);
  }
}
```

### 7.3 Model Override Hierarchy (REQ-MODEL-02)

```
System default (config YAML)
  → Course Steward override (database)
    → Challenge-level override (database)
```

Resolved at run time in `llm.service.js`:
```javascript
getModelForRun(challenge) {
  return challenge.modelOverride
    || challenge.course?.stewardModelOverride
    || this.config.defaults.model;
}
```

---

## 8. Database Design

### 8.1 Entity-Relationship Summary

```
institutions ──< users ──< challenge_runs
     │              │              │
     │              ├──< challenges ──< challenge_run_cycles
     │              │       │
     │              │       ├── course_id → courses
     │              │       └── subject_path
     │              │
     │              └──< course_subscriptions >── courses
     │                                              │
     └──< courses ──< course_instructors            │
              │                                     │
              └── course_steward (JSON config)      │
                                                    │
subjects (tree, per course) ────────────────────────┘
```

### 8.2 Key Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| institutions | Pre-loaded list | id, name, country, departments (JSON) |
| users | All users | id, email, name, role, institution_id, profile_image, created_at |
| courses | Course catalog | id, institution_id, name, steward_config (JSON), subject_tree (JSON) |
| course_subscriptions | Student↔Course | user_id, course_id, subscribed_at |
| course_instructors | Instructor↔Course | user_id, course_id, joined_at |
| challenges | Challenge definitions | id, title, creator_id, course_id, type, visibility, response_config (JSON), max_cycles, model_override, instructions (JSON), rubrics (JSON), status |
| challenge_runs | Per-student execution | id, challenge_id, user_id, status, started_at, completed_at, grades (JSON) |
| challenge_run_cycles | Individual cycles | id, run_id, cycle_num, judging_response (JSON), steering_response (JSON), ai_output (TEXT), grades (JSON) |
| subjects | Subject trees | id, course_id, parent_id, name, depth |
| prompt_templates | LLM prompts (from YAML) | id, filename, content (TEXT), variables (JSON) |

---

## 9. API Contract

### 9.1 REST API Overview

All endpoints prefixed with `/api/v1/`.

```
Authentication:
  POST   /auth/register              # Email/password signup
  POST   /auth/login                 # Email/password login
  GET    /auth/google                # Google SSO redirect
  GET    /auth/google/callback       # Google SSO callback
  GET    /auth/microsoft             # Microsoft SSO redirect
  GET    /auth/microsoft/callback    # Microsoft SSO callback
  POST   /auth/logout                # End session
  GET    /auth/me                    # Current user info

Users:
  GET    /users/me                   # Get profile
  PUT    /users/me                   # Update name/image
  GET    /users/me/stats             # Challenge counts

Institutions:
  GET    /institutions               # List all institutions

Courses:
  GET    /courses                    # List courses (with filters)
  POST   /courses                    # Create course (instructor)
  GET    /courses/:id                # Course details
  PUT    /courses/:id                # Update course
  POST   /courses/:id/subscribe      # Student subscribe
  DELETE /courses/:id/subscribe      # Student unsubscribe
  POST   /courses/:id/join           # Instructor join
  DELETE /courses/:id/leave          # Instructor leave
  GET    /courses/:id/subjects       # Subject tree

Subjects:
  GET    /subjects/:courseId/tree     # Get subject tree
  PUT    /subjects/:courseId/tree     # Update subject tree (instructor)

Challenges:
  GET    /challenges                  # List with filters
  POST   /challenges                  # Create challenge
  GET    /challenges/:id              # Get challenge details
  PUT    /challenges/:id              # Update challenge
  PUT    /challenges/:id/rename       # Rename
  PUT    /challenges/:id/archive      # Archive
  DELETE /challenges/:id              # Delete (or archive if has runs)
  POST   /challenges/:id/publish      # Publish to course

Challenge Runs:
  POST   /challenges/:id/runs         # Start a new run
  GET    /runs/:runId                  # Get run state
  PUT    /runs/:runId/framing          # Submit framing response
  PUT    /runs/:runId/cycles/:n/judging   # Submit judging
  PUT    /runs/:runId/cycles/:n/steering  # Submit steering
  PUT    /runs/:runId/complete         # Mark complete
  GET    /runs/:runId/report           # Get final report

Analytics:
  GET    /analytics/student            # Student's own analytics
  GET    /analytics/student/challenge/:id  # Per-challenge detail
  GET    /analytics/instructor/:courseId    # Instructor course analytics
  GET    /analytics/instructor/:courseId/export  # PDF export

Import:
  POST   /import/batch                 # YAML batch import
  GET    /import/status/:jobId         # Import job status

LLM (Internal):
  POST   /llm/preview                  # Preview problem during creation
  GET    /llm/models                   # Available models
```

### 9.2 Error Response Format

```json
{
  "error": {
    "code": "CHALLENGE_NOT_FOUND",
    "message": "Challenge with ID abc-123 not found",
    "details": { "challengeId": "abc-123" },
    "traceId": "req-2026-03-16-abc123"
  }
}
```

---

## 10. Authentication & Authorization

### 10.1 Auth Flow

```
Browser → GET /api/auth/google → Google OAuth → Callback → Session cookie
Browser → POST /api/auth/register → { email, password, role, institutionId } → Session cookie
```

### 10.2 Session Management
- express-session with `connect-pg-simple` (PostgreSQL) or `better-sqlite3-session-store` (SQLite)
- Session cookie: `coreason.sid`, httpOnly, secure in production
- 30-day expiry

### 10.3 Authorization Rules

| Resource | Student | Instructor |
|----------|---------|------------|
| Create challenge | Private only | Public + Private |
| Run challenge | Own + subscribed public | Course challenges (preview) |
| View analytics | Own results only | Course-wide (public challenges) |
| Manage courses | Subscribe/unsubscribe | Create/edit/join/leave |
| Edit subject tree | No | Own courses |

---

## 11. Content Import Pipeline

### 11.1 On-Deployment Seed

When deployed, the system seeds the database from existing YAML content:

```
content/en/institutions.yaml  → institutions table
content/en/mockup-data.yaml   → users, challenges (demo data)
content/*/ui-labels.yaml      → ui_labels table (or served as static JS)
scenarios/*/course.md          → courses table
prompts/*.yaml                 → prompt_templates table
```

### 11.2 Batch Import via YAML

```yaml
# import/sample/full-import.yaml
version: "1.0"
import:
  institutions:
    - name: "Tel Aviv University"
      country: "Israel"
      departments: ["Computer Science", "Mathematics", "Physics"]

  users:
    - email: "instructor@tau.ac.il"
      name: "Dr. Sarah Levy"
      role: instructor
      institution: "Tel Aviv University"

  courses:
    - name: "Introduction to Algorithms"
      institution: "Tel Aviv University"
      instructors: ["instructor@tau.ac.il"]
      subject_tree:
        - name: "Sorting & Searching"
          children:
            - name: "Comparison-based Sorting"
            - name: "Hash-based Searching"

  challenges:
    - title: "Sorting Pipeline for Sensor Data"
      course: "Introduction to Algorithms"
      creator: "instructor@tau.ac.il"
      type: assessment
      visibility: public
      phase1_response: mc
      phase2_response: mc
      max_cycles: 5
```

CLI tool:
```bash
node server/cli/import.js --file import/sample/full-import.yaml --env staging
```

---

## 12. Multi-Language Support

### 12.1 Architecture

```
Existing system (preserved):
  content/{lang}/ui-labels.yaml → build-content.js → screens/content-compiled/{lang}.js
  content-loader.js → C(), t(), translatePage()

New backend additions:
  - API responses include translated content based on Accept-Language header
  - LLM prompts include target language parameter
  - All user-facing strings come from the translation system
  - RTL support preserved for Hebrew (and future Arabic)
```

### 12.2 LLM Language Support

Prompt templates include `{{language}}` placeholder:
```yaml
# prompts/01-generate-problem.yaml
system: |
  Generate the problem statement in {{language}}.
  Use academic terminology appropriate for the target language.
```

---

## 13. Logging, Tracing & Error Handling

### 13.1 Structured Logging (Winston)

```javascript
// Every log entry includes:
{
  timestamp: "2026-03-16T10:30:00.000Z",
  level: "info",
  service: "challenge-run",
  traceId: "req-abc123",
  userId: "user-456",
  message: "Framing submitted",
  data: { runId: "run-789", responseType: "mc", selectCount: 3 }
}
```

### 13.2 Log Levels & Files

| Level | File | Content |
|-------|------|---------|
| error | logs/error.log | Uncaught errors, LLM failures, DB errors |
| warn | logs/combined.log | Retries, slow queries, budget warnings |
| info | logs/combined.log | API requests, state transitions, grades |
| debug | logs/debug.log | LLM prompts/responses, SQL queries |
| trace | logs/trace.log | Decision audit trail (model selection, routing) |

### 13.3 Decision Tracing

Every LLM call creates a trace record:
```json
{
  "traceId": "run-789-framing",
  "type": "llm-decision",
  "timestamp": "2026-03-16T10:30:05Z",
  "input": { "promptId": "01-generate-problem", "model": "gpt-4o", "variables": ["course", "subject"] },
  "output": { "tokens": 450, "latency_ms": 2100, "cost_usd": 0.008 },
  "decision": "Model selected via hierarchy: challenge override → course steward → system default"
}
```

### 13.4 Error Caching

```javascript
// Errors are cached in-memory (LRU, max 1000) to:
// 1. Detect repeated failures (circuit breaker)
// 2. Provide error history in admin dashboard
// 3. Aggregate for monitoring alerts
const errorCache = new LRUCache({ max: 1000, ttl: 3600000 });
```

---

## 14. Testing Strategy

### 14.1 Test Pyramid

```
        ┌──────────┐
        │   E2E    │  Playwright (10-15 tests)
        │ Browser  │  Full user flows
        ├──────────┤
        │  Integr. │  Supertest (30-40 tests)
        │   API    │  Route → Service → DB
        ├──────────┤
        │   Unit   │  Jest (100+ tests)
        │ Services │  Isolated with mocked deps
        └──────────┘
```

### 14.2 Unit Tests (Jest)

```javascript
// tests/unit/services/challenge.service.test.js
describe('ChallengeService', () => {
  describe('create', () => {
    it('creates private challenge for student role');
    it('creates public challenge for instructor role');
    it('rejects public challenge from student');
    it('validates max_cycles range');
  });
  describe('archive', () => {
    it('archives challenge and preserves run data');
    it('prevents execution of archived challenge');
  });
});
```

### 14.3 Integration Tests (Supertest)

```javascript
// tests/integration/challenge.test.js
describe('POST /api/v1/challenges', () => {
  it('201: creates challenge with valid input', async () => {
    const res = await request(app)
      .post('/api/v1/challenges')
      .send(validChallengeData)
      .expect(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('draft');
  });
  it('400: rejects invalid response type');
  it('403: student cannot create public challenge');
});
```

### 14.4 E2E Tests (Playwright)

```javascript
// tests/e2e/challenge-run.spec.js
test('student completes a practice challenge with MC', async ({ page }) => {
  await page.goto('/01-sign-up.html');
  // Sign up as student
  // Navigate to challenge list
  // Start a challenge run
  // Complete framing phase
  // Complete judge+steer cycles
  // Verify grades displayed
  // Verify analytics updated
});
```

### 14.5 LLM Testing

- **Mock client**: ModelMesh provides `mock_client(responses=[...])` for zero-cost testing
- **Prompt snapshot tests**: Compare prompt template outputs against golden files
- **Integration tests**: Run against real LLM API in CI with budget cap

### 14.6 Test Coverage Targets

| Layer | Target |
|-------|--------|
| Services | 90% line coverage |
| Routes | 85% line coverage |
| Models | 80% line coverage |
| E2E | All 12 user flows covered |

---

## 15. Documentation Suite

### 15.1 Documents to Create

| Document | Audience | Content |
|----------|----------|---------|
| **User Manual** | Students & Instructors | How to use every screen, challenge workflow, analytics interpretation |
| **Developer Manual** | Engineers | Architecture, API reference, local setup, testing, contributing |
| **Administrator Manual** | Ops/Admins | Deployment, configuration, YAML import, monitoring, troubleshooting |
| **Concept of Operations** | Stakeholders | Already exists: `docs/CONOPS.md` (v2.0) |

### 15.2 Linked HTML Help Files

Embedded in complex UI elements via `?` icon → popup:

| Help File | Linked From | Content |
|-----------|-------------|---------|
| framing-help.html | Phase 1 panel (05-challenge-run.html) | What is framing? How to add refinement sections |
| judging-help.html | Judging sub-step (05-challenge-run.html) | How to identify issues in AI output |
| steering-help.html | Steering sub-step (05-challenge-run.html) | How to write effective corrections |
| rubric-help.html | Rubric preview (04-create-challenge.html) | Understanding A/B/C grading criteria |
| analytics-help.html | Analytics charts (07/08-analytics.html) | How to interpret grade distributions |

### 15.3 Implementation

```html
<!-- In mockup HTML -->
<h3>Phase 1 — Framing
  <a href="#" class="help-link" data-help="framing">
    <span class="help-icon">?</span>
  </a>
</h3>

<!-- help-popups.js loads and displays as modal overlay -->
```

---

## 16. Product Tour & Guided Onboarding

### 16.1 Technology: Shepherd.js

Lightweight, zero-dependency tour library with:
- Step-by-step popups anchored to UI elements
- Next/Back/Skip navigation
- Progress indicator
- Responsive positioning
- Customizable themes

### 16.2 Tour Definitions

**Student Tour** (triggered on first login):
```javascript
const studentTour = [
  { element: '.topnav', title: 'Welcome!', text: 'This is your CoReasoning Lab dashboard.' },
  { element: '.challenge-table', title: 'Your Challenges', text: 'Browse and start challenges here.' },
  { element: '.filter-bar', title: 'Filter & Search', text: 'Find challenges by course, type, or status.' },
  { element: '.lang-select', title: 'Language', text: 'Switch the interface language anytime.' },
  { element: '.user-area', title: 'Your Profile', text: 'View your profile and statistics.' },
  // ... continues for key screens
];
```

**Instructor Tour** (triggered on first login):
```javascript
const instructorTour = [
  { element: '.topnav', title: 'Welcome, Instructor!', text: 'Manage courses and create challenges.' },
  { element: '[data-t="createChallenge"]', title: 'Create Challenges', text: 'Define new challenges for your students.' },
  { element: '.analytics-link', title: 'Analytics', text: 'Track student performance across your courses.' },
  // ... continues
];
```

### 16.3 Tour Persistence

- Tour completion stored in `localStorage` (offline) + user profile (server)
- "Restart tour" button in profile/settings
- Tour can be skipped at any step
- Tour adapts based on user role

---

## 17. Environments & CI/CD

### 17.1 Two Environments

| Environment | Purpose | URL | Deploy Trigger |
|-------------|---------|-----|----------------|
| **Staging** | Test all changes | coreason-staging.onrender.com | Auto on push to `staging` branch |
| **Production** | Live users | coreason.onrender.com | Manual via GitHub Actions workflow_dispatch |

### 17.2 Git Branch Strategy

```
main (production) ←── staging ←── feature branches
                          │
                          └── PR merges trigger staging deploy
```

### 17.3 GitHub Actions Workflows

**CI (on every PR):**
```yaml
jobs:
  test:
    - npm ci
    - npm run build           # Compile content
    - npm run test:unit       # Jest unit tests
    - npm run test:integration # Supertest API tests
    - npm run lint
  e2e:
    - Start server
    - npx playwright test
```

**Deploy to Staging (on push to staging):**
```yaml
jobs:
  deploy:
    - Run tests
    - Deploy to Render via API
    - Run smoke tests against staging URL
    - Run database migrations
    - Seed data if fresh deploy
```

**Deploy to Production (manual):**
```yaml
on: workflow_dispatch
jobs:
  deploy:
    - Confirm staging tests pass
    - Deploy to Render production
    - Run migrations
    - Smoke test production
    - Notify team
```

### 17.4 Secrets Management

| Context | Method |
|---------|--------|
| Local development | `.env.all` file (gitignored) |
| GitHub Actions | GitHub Secrets (repository settings) |
| Render deployment | Render Environment Variables (synced from GitHub Secrets) |

---

## 18. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [x] Implementation plan (this document)
- [ ] Project structure setup
- [ ] Install all dependencies
- [ ] Database schema + migrations (SQLite + PostgreSQL)
- [ ] Express server skeleton with middleware
- [ ] Auth service (email/password + Google SSO)
- [ ] Basic CRUD: users, institutions, courses
- [ ] Content import pipeline (YAML → database)
- [ ] Logging infrastructure (Winston)
- [ ] Unit test framework (Jest)

### Phase 2: Core Engine (Week 3-4)
- [ ] Challenge CRUD service
- [ ] ModelMesh integration + prompt engine
- [ ] Challenge Run Engine (all 14 prompt templates)
- [ ] Course subscription logic
- [ ] Subject tree management
- [ ] API integration tests (Supertest)

### Phase 3: Frontend Wiring (Week 5-6)
- [ ] api-client.js + per-screen API modules
- [ ] Wire all 14 mockup screens to backend APIs
- [ ] Product tour (Shepherd.js)
- [ ] Help popups
- [ ] E2E tests (Playwright)

### Phase 4: Analytics & Polish (Week 7-8)
- [ ] Student analytics service + API
- [ ] Instructor analytics service + API
- [ ] PDF export
- [ ] Batch import CLI
- [ ] Documentation suite (user/dev/admin manuals)

### Phase 5: Deployment (Week 9)
- [ ] Docker configuration
- [ ] GitHub Actions CI/CD
- [ ] Render staging deployment
- [ ] Render production deployment
- [ ] Smoke tests
- [ ] Final UAT against all 12 user flows

---

## Appendix A: Dependency List

### Backend (npm)
```
express                    # Web framework
express-session            # Session management
connect-pg-simple          # PostgreSQL session store
better-sqlite3             # SQLite driver
knex                       # SQL query builder / migrations
@nistrapa/modelmesh-core   # LLM abstraction
passport                   # Authentication framework
passport-google-oauth20    # Google SSO
passport-microsoft         # Microsoft SSO
bcryptjs                   # Password hashing
zod                        # Schema validation
winston                    # Structured logging
js-yaml                    # YAML parsing
dotenv                     # Environment variables
cors                       # CORS middleware
helmet                     # Security headers
compression                # Response compression
multer                     # File uploads (profile images)
lru-cache                  # Error caching
uuid                       # ID generation
```

### Frontend (npm)
```
shepherd.js                # Product tour
```

### Dev / Testing (npm devDependencies)
```
jest                       # Unit test runner
supertest                  # HTTP assertion library
@playwright/test           # E2E browser testing
nodemon                    # Dev server hot-reload
eslint                     # Linting
prettier                   # Code formatting
```

---

*End of Implementation Plan*
