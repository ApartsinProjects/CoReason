# UX Validation Skill — CoReason Application

## Application Overview
CoReason is an AI Co-Reasoning Lab — a web application for university courses where students practice framing, judging, and steering AI-generated solutions. It has instructor and student roles, challenge creation/running, analytics, and multi-language support (English, Hebrew).

## How to Run the App

### Backend (Node.js + Express + SQLite)
```bash
cd E:\Projects\CoReason\code
node server/index.js
```
Server starts on port 3000 (configurable via `PORT` env var).

### Frontend
Static files served by Express from `E:\Projects\CoReason\code\client\`.
No separate frontend build step needed (vanilla HTML/CSS/JS).

### Content Compilation
If YAML content files are modified:
```bash
node E:\Projects\CoReason\code\build-content.js
```

## Base URL
```
http://localhost:3000
```

## How to Log In

### Test Users (Development Mode)
The app has test login endpoints when `NODE_ENV !== 'production'`. **`test-login` keys
off `email`, NOT `role`** — posting `{"role":"student"}` returns `400 MISSING_EMAIL`.
Get a real seeded email from `GET /api/v1/auth/test-users` (or the DB) first.

```bash
# WRONG (returns 400 MISSING_EMAIL):
#   curl ... -d '{"role":"student"}'

# RIGHT — log in by seeded email:
curl -X POST http://localhost:3000/api/v1/auth/test-login \
  -H "Content-Type: application/json" \
  -d '{"email": "ahmed.hassan@tau.ac.il"}'   # student
# instructor example: dr.shapira@tau.ac.il
```

Seeded students after `npm run db:setup`: `noa.cohen@tau.ac.il`,
`ahmed.hassan@tau.ac.il`, `maria.garcia@mit.edu`, `li.wei@tsinghua.edu.cn`,
`sarah.miller@oxford.ac.uk`. Instructor: `dr.shapira@tau.ac.il`.

### Browser Login
1. Navigate to `http://localhost:3000/login.html`
2. Use test credentials or Google OAuth
3. Test users can be listed via `GET /api/v1/auth/test-users`

## How to Seed/Reset Data
```bash
# List test users
curl http://localhost:3000/api/v1/auth/test-users

# Clean up test data
curl -X POST http://localhost:3000/api/v1/auth/test-cleanup
```

The SQLite database is at `E:\Projects\CoReason\code\data\coreason.db` (or as configured).

## Pages to Test

| Page | URL | Role | Description |
|------|-----|------|-------------|
| Login | `/login.html` | Public | Authentication |
| Register | `/register.html` | Public | Account creation |
| Student Challenges | `/challenges.html` | Student | Browse available challenges |
| Challenge Run | `/challenge-run.html?challengeId=X` | Student | Execute a challenge (framing, judging, steering) |
| Student Analytics | `/student-analytics.html` | Student | View personal results |
| Challenge Report | `/challenge-report.html?runId=X` | Student | View run report |
| Instructor Challenges | `/instructor-challenges.html` | Instructor | Manage challenges |
| Create Challenge | `/create-challenge.html` | Instructor | Create/edit challenges |
| Instructor Analytics | `/instructor-analytics.html` | Instructor | Course analytics |
| Courses | `/courses.html` | Both | Browse/manage courses |
| Profile | `/profile.html` | Both | User profile |
| Admin | `/admin.html` | Admin | System administration |
| Interactive Guide | `/interactive-guide.html` | Both | Tutorial/help |

## Key Flows to Validate

### Student Flow
1. Login → Browse challenges → Start challenge run
2. Phase 1: Read raw problem → Submit framing (MC or OE)
3. Phase 2: Judge AI solution → Submit judging → Steer corrections → Submit steering
4. Repeat cycles until max or "solution complete"
5. View completion grades and feedback
6. View analytics dashboard

### Instructor Flow
1. Login → Create/manage courses
2. Create challenge (set type, response type, subjects, rubric, instructions)
3. Preview problem and rubric
4. Publish challenge
5. View student analytics

### Cross-Cutting
1. Language switching (EN ↔ HE)
2. Tooltips (hover ? icons, verify formatted HTML with WHY/WHAT/HOW sections)
3. Responsive layout
4. Error handling (network failures, validation errors)

## Where to Store Artifacts
```
E:\Projects\CoReason\code\artifacts\
  ux_inventory.json      # Discovered UX elements
  ux_findings.json       # Machine-readable issues
  ux_findings.md         # Human-readable report
  screenshots\           # Failure screenshots
E:\Projects\CoReason\code\tests\ux-generated\
  *.spec.js              # Generated Playwright tests
```

## Assumptions
- Server is running on `http://localhost:3000` before browser tests start
- SQLite database exists and has been initialized (migrations run on startup)
- LLM API keys may or may not be configured (test both paths)
- Test users are available via `/api/v1/auth/test-login`
- Application uses vanilla JS (no framework) — DOM inspection via standard selectors
- The app uses `data-t` attributes for i18n translations
- The app uses `data-tooltip` attributes for tooltip content
- Forms use standard HTML validation plus custom JS validation

## Gotchas learned (hard-won, from running the app for real screenshots)

These cost real time to rediscover. Read before driving the app headlessly.

1. **CSP blocks inline `onclick` handlers.** `server/index.js` sets helmet
   `contentSecurityPolicy.scriptSrc` but NOT `scriptSrcAttr`, so helmet applies its
   default `script-src-attr 'none'`. Every inline `onclick="..."` (Start Challenge,
   add-section, submit buttons) is silently refused — the button does nothing and the
   console logs "Refused to execute inline event handler". To drive the UI either
   (a) add `scriptSrcAttr: ["'unsafe-inline'"]` to the CSP block, or (b) call the
   handler directly with `page.evaluate(() => startRun())`. (This is also a real
   product bug worth fixing in the app, not just a test workaround.)

2. **LLM provider selection + env loading.** The app loads env via
   `dotenv.config({ path: '../.env.all', override: true })` resolved from `server/`,
   i.e. it reads **`code/.env.all`** (NOT `code/.env`, NOT the repo root). `override:true`
   means file values win, but a key absent from the file falls back to the OS env — so
   an `OPENAI_API_KEY` in the Windows user env still registers OpenAI. Providers register
   in order OpenAI → Groq → … and `providers[0]` is primary. If the OpenAI project is
   out of quota (`429 exceeded your current quota` → the run endpoint returns `502`),
   force Groq by writing `code/.env.all` with `OPENAI_API_KEY=` (empty, to clear the OS
   one), `GROQ_API_KEY=…`, `GROQ_MODEL=llama-3.3-70b-versatile`. Confirm the startup log
   says `LLM provider registered: Groq`.

3. **DB setup + seed.** Dev DB is `code/data/coreason-dev.sqlite3` (better-sqlite3). The
   `data/` dir must exist first or migrate fails with "directory does not exist". Run
   `npm run db:setup` (= `db:migrate` + `db:seed`) — the seed imports **77 challenges,
   33 users, 16 prompts** across 12 disciplines, so you do NOT need to author a challenge
   to get a runnable, published one. List published ones via
   `GET /api/v1/challenges?status=published`.

4. **better-sqlite3 native build is flaky on Windows.** Don't fight a fresh `npm install`
   rebuild. Reuse an already-built `node_modules` by junctioning it into the worktree:
   `New-Item -ItemType Junction -Path <worktree>/code/node_modules -Target <built>/code/node_modules`.

5. **Playwright scripts must live inside `code/`** so Node resolves `code/node_modules`
   (`playwright` is there, plus chromium in the user ms-playwright cache). A script at the
   repo root fails with `Cannot find module 'playwright'`.

6. **Suppress the first-run tour modal** or it covers every screenshot:
   `context.addInitScript(() => localStorage.setItem('coreason_tour_completed','true'))`.

7. **Challenge-run DOM (for scripted runs).** Start: a `<button onclick="startRun()">`
   inside `#start-card`. The Framing input is NOT a plain textarea: `#framing-input` is a
   `<div>` wrapping structured **refinement sections** (`#framing-sections`) — fill the
   `textarea` inside it (`#framing-sections textarea`), then click `#submit-framing-btn`.
   The Judge phase renders the flawed solution in `#ai-solution-content`. Generation calls
   take ~10-90s on Groq, so use generous `waitForSelector` timeouts (90-150s).
