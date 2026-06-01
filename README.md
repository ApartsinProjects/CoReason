# CoReasoning Lab

![CoReasoning Lab hero](docs/assets/hero-gemini-coreasoning.png)

An AI-native learning platform where students do not just get answers from AI, they learn to reason with it.

CoReasoning Lab trains three core skills:
- Framing: turn ambiguous problems into precise, solvable tasks.
- Judging: critique AI output and spot gaps, risks, and mistakes.
- Steering: guide AI iteratively toward better results.

## 📄 Research paper (open-source, MIT)

**"Framing, Judging, Steering: An Assessable Competency Model for Reasoning With Generative AI"** — a
theoretically-grounded competency model with a proof-of-concept instrument and a feasibility
demonstration that the three skills *dissociate* (own-skill grade effects dominate cross-skill effects
≈60:1, N=40).

- 📖 **Read it (HTML + KaTeX):** <https://apartsinprojects.github.io/CoReason/>
- 📝 Source: [`paper/coreasoning.md`](paper/coreasoning.md) · Bibliography: [`paper/references.bib`](paper/references.bib) (50 refs, validated)
- 🔬 Experiments + reproducible harness: [`research/`](research/README.md) · registry: [`research/experiments/PROJECT_LOG.md`](research/experiments/PROJECT_LOG.md)
- 🧑‍🤝‍🧑 Human-rater validation package: [`human-study/`](human-study/CODEBOOK.md)

Everything in this repository (system design, the sixteen-prompt instrument, the controlled-generation
harness, data, and figures) is open-source under the [MIT License](LICENSE).

## Why This Project Exists

Most AI-in-education products optimize for speed-to-answer.
CoReasoning Lab optimizes for quality-of-thinking.

Learners interact with intentionally imperfect AI outputs, then improve them through structured reasoning loops. The platform measures progress across separate cognitive skills instead of a single score.

## Learning Flow

1. Framing phase: student refines a raw problem with assumptions, constraints, and clarifications.
2. AI generates an initial solution (with realistic issues to inspect).
3. Judge + Steer cycles: student evaluates quality, then sends targeted corrections.
4. Platform grades Framing, Judging, and Steering independently with feedback.

## Feature Snapshot

- Challenge modes: practice and assessment.
- Response modes: multiple-choice or open-ended per phase.
- LLM-backed generation and evaluation with fallback behavior.
- Multi-language content and UI assets (`en`, `he`, `fr`, `de`, `es`).
- Role-based workflows: student, instructor, admin.
- Course/challenge management, analytics, and PDF reporting.
- Bulk YAML import for institutions, users, courses, and challenges.

## Tech Stack

- Runtime: Node.js 20+
- Backend: Express, Knex, Zod, Passport
- DB: SQLite (dev/test) and PostgreSQL (production)
- AI: OpenAI/Groq integrations with pluggable provider config
- Testing: Jest, Supertest, Playwright
- Deployment: Docker and Render blueprint

## Architecture At A Glance

```text
Static Client (HTML/CSS/JS)
        |
        v
Express API Routes (/api/v1/*)
        |
        v
Service Layer (business logic)
        |
  +-----+------------------+
  |                        |
  v                        v
LLM Service + Prompt      Database (Knex)
Engine (YAML prompts)     SQLite / PostgreSQL
```

## Quick Start (Repo Root)

Set environment variables in `code/.env.all` (copy from `.env.example` and fill required keys).

```bash
npm install
npm run build
npm run db:migrate
npm run db:seed
npm run dev
```

Then open:
- App: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`

## Useful Commands

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:all
npm run lint
npm run docker:dev
```

## Project Map

```text
code/
  client/        static web UI
  server/        API routes, services, middleware, DB, auth
  prompts/       LLM prompt templates
  content/       i18n source data
  tests/         unit/integration/e2e tests
docs/            concept of operations, spec, audits
scenarios/       course scenario content
```

## Deep Docs

- Product concept: [`docs/CONOPS.md`](docs/CONOPS.md)
- System spec: [`docs/spec/SPEC.md`](docs/spec/SPEC.md)
- Full technical README: [`code/README.md`](code/README.md)
- Developer guide: [`code/docs/developer-guide.md`](code/docs/developer-guide.md)

## Notes

- The hero image in this README was generated with Google Gemini Image API.
