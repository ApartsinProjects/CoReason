# CoReasoning Lab — General Mockup Audit

**Audit Date:** March 15, 2026
**Scope:** All 14 HTML screens, styles.css, content-loader.js, 85 YAML content files across 5 languages
**Method:** Systematic cross-screen analysis against CONOPS v2.0 and persona specifications

---

## 1. Screen Inventory

| # | File | Purpose | Role |
|---|------|---------|------|
| 00 | 00-login.html | Sign in (SSO + email) | Both |
| 01 | 01-sign-up.html | Account creation with role selection | Both |
| 02 | 02-dashboard.html | Post-login landing (stats, pending challenges) | Student |
| 03a | 03-challenge-list.html | Browse/filter/run challenges | Student |
| 03b | 03-challenge-list-instructor.html | Manage created challenges | Instructor |
| 04 | 04-create-challenge.html | Challenge creation form | Instructor |
| 05a | 05-challenge-run.html | Interactive challenge simulator (MC) | Student |
| 05b | 05-challenge-run-instructor.html | Challenge preview with rubric overlay | Instructor |
| 05c | 05b-challenge-run-open-ended.html | Static OE challenge layout | Student |
| 06a | 06-course-catalog.html | Browse/subscribe to courses | Student |
| 06b | 06-course-catalog-instructor.html | Manage courses, subject trees | Instructor |
| 07a | 07-student-analytics.html | Personal grade distributions & trends | Student |
| 07b | 07b-challenge-report.html | Detailed per-challenge run report | Student |
| 08 | 08-instructor-analytics.html | Course-wide analytics & per-student breakdown | Instructor |
| 09 | 09-profile.html | User profile & settings | Both |

---

## 2. Navigation Flow Issues

### 2.1 Orphaned Dashboard
`02-dashboard.html` exists but **no page links to it**. After login (00), the user would expect to land here, but the login button has no `href`. The dashboard shows pending challenges, stats, and course subscriptions — useful content that is otherwise inaccessible.

**Recommendation:** Either integrate as the post-login landing page or remove from the mockup set.

### 2.2 Challenge List → Create Challenge (Student)
`03-challenge-list.html` (student view) has a "+ Create Challenge" button linking to `04-create-challenge.html`, which is an instructor-only page. Students can create private challenges per the CONOPS, but the creation form shows instructor navigation and says "Create a Public Challenge."

**Recommendation:** Create a dedicated student private-challenge creation screen or add role-aware conditional rendering to the existing form.

### 2.3 No Post-Login Routing
No screen shows how the system routes users after login. Students and instructors share the same login page but need different navigation. No redirect logic or role-based routing is indicated.

---

## 3. Data Consistency Issues

### 3.1 User Identity Inconsistencies

| Screen | Name | Role | Avatar |
|--------|------|------|--------|
| 00-login | (pre-filled: s.cohen@tau.ac.il) | — | — |
| 01-sign-up | Sarah Cohen | Student | — |
| 03-challenge-list | Sarah Cohen | Student | SC |
| **04-create-challenge** | **Sarah Cohen** | **Instructor** | **SC** |
| 03-challenge-list-instructor | Dr. Levy | Instructor | DL |
| 06-course-catalog-instructor | Dr. Levy | Instructor | DL |
| 08-instructor-analytics | Dr. Levy | Instructor | DL |
| 05-challenge-run | Noa R. | Student | NR |

**Critical:** `04-create-challenge.html` shows "Sarah Cohen" as an instructor, but all other instructor screens show "Dr. Levy." This is a direct mockup error.

### 3.2 Challenge Data Mismatches

| Challenge | Screen A | Screen B | Conflict |
|-----------|----------|----------|----------|
| Sorting challenge | "Sorting Pipeline for Sensor Data" (CONOPS §7) | "Sorting Algorithm Analysis" (03, 07, 07b) | Title differs |
| Neural Network | Assessment (03-student) | Practice (03-instructor) | Type differs |
| SQL Query | "SQL Query Optimization" (03) | "Query Optimization for E-Commerce" (05 picker) | Title differs |

### 3.3 Grade Scale Violation
CONOPS §5.1 states: "There are no plus/minus modifiers." The A/B/C scale is explicitly compact.

`03-challenge-list-instructor.html` shows "B+" and "A-" in the Avg Grade column. This directly contradicts the design decision.

### 3.4 Challenge Count Mismatches

| Source | Value |
|--------|-------|
| 02-dashboard: Challenges Completed | 12 |
| 09-profile: Challenges Executed | 12 |
| 07-student-analytics: Table rows | 4 (only 4 completed shown) |
| 07-student-analytics: Timeline points | 6 |

The analytics page should show 12 completed challenges but displays far fewer.

### 3.5 Course Subscription Mismatches

| Source | Courses |
|--------|---------|
| 09-profile | Deep Learning 101, Database Systems, Software Engineering, Signal Processing, Algorithms |
| 06-course-catalog | Deep Learning 101 ✓, Database Systems ✓, Signal Processing ✓ (subscribed). Software Engineering, Linear Algebra, Statistical Inference (not subscribed) |
| 03-challenge-list filter | Deep Learning 101, Database Systems, Software Engineering |

Profile shows 5 subscribed courses but the catalog shows only 3 as subscribed.

---

## 4. Accessibility Issues

### 4.1 Missing ARIA Attributes
- **Avatar links:** `<a href="09-profile.html"><div class="avatar">SC</div></a>` — no `aria-label`
- **Help icons:** `data-tooltip` used but no `role="tooltip"` or `aria-describedby`
- **Expandable rows (07):** No `aria-expanded`, `aria-controls`, or `role="button"`
- **Toggle buttons:** No `aria-pressed` state
- **Grade badges:** Color-only differentiation with no text labels for screen readers

### 4.2 Missing Dynamic Region Announcements
- Challenge run simulator renders content dynamically with no `aria-live` region
- LLM status indicator (fixed bottom bar) should have `aria-live="polite"`

### 4.3 Keyboard Navigation Gaps
- Subject tree multi-select uses `onclick` handlers; keyboard trap prevention unclear
- Collapsible sections use `onclick`; `Enter`/`Space` key support not specified
- Table row expansion (07) uses `onclick` on `<tr>` — no `tabindex` or keyboard handler

### 4.4 Form Validation
- No `aria-invalid`, `aria-required`, or `aria-errormessage` attributes
- No inline validation error styling
- No required field indicators
- No confirm-password field on signup

---

## 5. Mobile Responsiveness

### 5.1 Current State
- Single breakpoint at 768px (desktop-first approach)
- Grid layouts collapse to 1 column ✓
- Filter bars flex to column layout ✓
- Tables have `overflow-x: auto` for scrolling ✓

### 5.2 Gaps
- No mobile-optimized table layout (challenge list with 10 columns will require significant horizontal scrolling)
- Two-column layouts (challenge run, create challenge) lack explicit mobile stacking rules
- Font sizes (13px labels) may be small on mobile
- No hamburger menu for mobile navigation (topnav hides nav links at 768px but shows no alternative)

---

## 6. Missing UI States

### 6.1 Empty States (None Shown)
- Empty challenge list (new student, no subscribed courses)
- Empty course catalog (filtered with no results)
- Empty analytics (no completed challenges yet)
- Empty search results

### 6.2 Loading States (None Shown)
- No skeleton loaders for challenge run content
- No loading indicator for rubric generation
- No progress indicator for AI output generation

### 6.3 Error States (None Shown)
- No form validation error UI
- No network error banner
- No submission failure handling
- No 403/permission denied page
- No timeout handling for LLM calls

### 6.4 Confirmation Dialogs (None Shown)
- Delete challenge: no confirmation
- Archive challenge: no confirmation
- Unsubscribe from course: no confirmation
- Publish challenge: no confirmation

---

## 7. YAML Content Issues

### 7.1 Missing Translations

| File | Issue |
|------|-------|
| es/users.yaml | Missing Sarah Cohen student + both instructors |
| fr/users.yaml | Missing Sarah Cohen student + both instructors |
| de/users.yaml | Missing Sarah Cohen student + both instructors |

### 7.2 Incomplete Course Structures

| Language | Issue |
|----------|-------|
| Spanish courses | Missing fields: department, institution, instructors, studentCount, challengeCount |
| French courses | Missing fields: department, institution, instructors, studentCount, challengeCount |

### 7.3 Prompt Type Field Inconsistency

| Language | framing-hint-mc.yaml type value |
|----------|--------------------------------|
| English | `type: mc` |
| German | `type: multiple-choice` |
| French | `type: multiple-choice` |

---

## 8. Design System Issues

### 8.1 Unlisted Colors
- Draft row background `#fffde7` is hardcoded, not in CSS variables
- Instructor avatar background `#e3f2fd` is hardcoded

### 8.2 Inconsistent Component Patterns
- Status badges use two different patterns: `.status-*` classes (03-student) vs `.status-published`/`.status-draft` classes (03-instructor)
- Grade display uses `.grade` class in most places but inline font-size overrides in final-grade cards (07b)

---

## 9. CONOPS Compliance Gaps

| CONOPS Requirement | Status | Detail |
|-------------------|--------|--------|
| 12 courses across 6 STEM + 6 non-STEM | ❌ Missing | Only STEM courses exist |
| 5 challenges per course | ❌ Partial | Instructor list shows 5, student list shows 6, catalog shows varying counts |
| 10 session transcripts per course | ❌ Missing | No transcript viewer in mockups |
| Rubrics never shown to students | ✓ Correct | Student views hide rubric criteria |
| A/B/C scale with no modifiers | ❌ Violated | B+ and A- appear in instructor table |
| Course Steward management | ❌ Missing | No Course Steward UI in any mockup |
| LLM model override hierarchy | ✓ Shown | Create challenge form shows override dropdown |
| PDF export | ⚠️ Partial | Button exists in instructor analytics but no PDF preview mockup |

---

## 10. Summary: Top 10 General Issues

| # | Issue | Severity |
|---|-------|----------|
| 1 | Student private-challenge creation flow missing | Critical |
| 2 | 04-create-challenge shows wrong user identity (Sarah Cohen as instructor) | Critical |
| 3 | B+/A- grades violate A/B/C-only CONOPS spec | Critical |
| 4 | Zero non-STEM course/challenge content despite CONOPS promise | Critical |
| 5 | 02-dashboard.html is orphaned (no incoming links) | High |
| 6 | No empty/loading/error states across any screen | High |
| 7 | Missing ARIA accessibility attributes throughout | High |
| 8 | YAML translations incomplete for ES/FR/DE (users + courses) | High |
| 9 | Challenge title/type/course data conflicts across screens | Medium |
| 10 | No Course Steward management UI despite CONOPS requirement | Medium |
