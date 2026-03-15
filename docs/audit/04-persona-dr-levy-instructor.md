# Persona Audit: Dr. Dana Levy — The Active Instructor

**Audit Date:** March 15, 2026
**Persona File:** `docs/personas/04-dr-levy-instructor.md`
**Key Screens Evaluated:** 03-challenge-list-instructor, 04-create-challenge, 06-course-catalog-instructor, 08-instructor-analytics, 09-profile

---

## Persona Summary

| Field | Value |
|-------|-------|
| Name | Dr. Dana Levy |
| Role | Instructor |
| Institution | Tel Aviv University |
| Department | Computer Science |
| Courses Joined | Introduction to Algorithms, Deep Learning 101 |
| Challenges Created | 12 (all public) |
| Teaching Style | Active learning, frequent low-stakes assessments |
| Key Trait | Uses analytics weekly to identify struggling students and adjust teaching |

---

## Inconsistencies Found

### 1. Wrong User Identity on Create Challenge Page
**Severity:** Critical — Mockup error

`04-create-challenge.html` shows:
- Name: **"Sarah Cohen"** (should be "Dr. Levy")
- Avatar: **"SC"** (should be "DL")
- Role badge: **"Instructor"** (correct role, wrong person)

All other instructor screens correctly show "Dr. Levy" / "DL". This is a direct copy-paste error that breaks the instructor experience narrative.

### 2. Grade Scale Violation: B+ and A- in Instructor Tables
**Severity:** Critical — CONOPS violation

`03-challenge-list-instructor.html` Avg Grade column shows:
- "B+" for Sorting Algorithm Analysis
- "A-" for SQL Query Optimization
- "B" for Neural Network Debugging and CNN Architecture Review

CONOPS §5.1 explicitly states: **"There are no plus/minus modifiers."** The grading scale is A/B/C only. Showing B+ and A- contradicts a fundamental design decision and implies a granularity the system doesn't provide.

### 3. Challenge Count Mismatch
**Severity:** Medium — Data contradiction

| Source | Challenges |
|--------|-----------|
| Persona | 12 created (all public) |
| Instructor challenge list (03-instructor) | 5 shown (4 published + 1 draft) |

Dr. Levy's "2-3 per week" publishing frequency would produce far more than 5 challenges. The mockup should show more challenges or include pagination indicating additional pages.

### 4. Course Mismatch
**Severity:** Medium — Data gap

| Source | Courses |
|--------|---------|
| Persona | Introduction to Algorithms, Deep Learning 101 |
| Instructor challenge list | Software Engineering, Deep Learning 101, Database Systems |
| Instructor analytics (08) | Deep Learning 101, Database Systems |

"Introduction to Algorithms" is Dr. Levy's primary course in the CONOPS walkthrough (§7) but doesn't appear in any instructor screen. "Software Engineering" and "Database Systems" appear but aren't listed in her persona.

### 5. No Grade Filter in Instructor Analytics
**Severity:** High — Intent loss

The persona states Dr. Levy's key analytics behavior: "She identifies students like Ahmed who consistently score C and reaches out proactively."

`08-instructor-analytics.html` has filters for:
- Course ✓
- Challenge ✓
- Student ✓

But **no grade filter**. She can't filter the per-student table to show "only C students" or "students below B." She must scan all rows manually — impractical with 45+ students.

### 6. No Per-Student Drill-Down
**Severity:** High — Feature gap

Persona Scenario B: "She sees that 38/45 students have completed it. She filters to see only C-grade students and notices a cluster of 5. She needs to decide whether to re-teach the topic or provide individual support."

The instructor analytics table shows student names and grades but:
- No clickable links to individual student reports
- No student challenge report view accessible to instructors
- No way to see *why* a student scored C (what they missed, what feedback they received)

Dr. Levy can see the grades but can't investigate the root cause.

### 7. No Course Steward Management UI
**Severity:** Medium — Feature gap

The persona asks about the "Course Steward model" and Scenario C explicitly tests instructor departure: "Dr. Levy leaves the university. Are all of Dr. Levy's challenges, analytics, and student data still accessible through the Course Steward?"

No mockup shows:
- Course Steward settings panel
- "Add/remove instructor" flow
- Content ownership transfer
- Multi-instructor collaboration view

---

## Intent Loss: Persona Use Cases Not Testable

### Use Case 1: Challenge Creation Efficiency
> "How long does it take Dr. Levy to create and publish a challenge?"

**Status:** ✓ Testable (with caveats)

The `04-create-challenge.html` form is well-structured with clear sections. However, the rubric generation is a single "Generate Rubrics" button with no progress indicator or preview of generation time.

### Use Case 2: Analytics Actionability
> "Can Dr. Levy identify struggling students quickly?"

**Status:** ❌ Not actionable

She can see the table but can't filter by grade or drill into individual submissions. Identification is possible; action-taking is not supported.

### Use Case 3: Rubric Quality Assurance
> "When Dr. Levy reviews generated rubrics, do the criteria genuinely test domain-specific reasoning?"

**Status:** ⚠️ Partially testable

The rubric preview in 04 shows generic criteria ("Detects logical errors in AI solution"). The persona specifically worries about rubrics being "generic critical thinking criteria" rather than domain-specific. The mockup examples lean generic, which would not satisfy Dr. Levy.

### Use Case 4: Multi-Course Management
> "Dr. Levy manages two courses. Can she context-switch efficiently?"

**Status:** ⚠️ Partially testable

The course dropdown in analytics (08) allows switching. But no "dashboard" view shows both courses at a glance with key metrics.

### Use Case 5: PDF Export Utility
> "Is the PDF format useful for administrative reporting?"

**Status:** ❌ Not testable

The "Export PDF" button exists but no PDF output mockup is shown.

---

## Evaluation Scenarios Not Supported

| Scenario | Support | Gap |
|----------|---------|-----|
| A: Create challenge for "Graph Algorithms > Shortest Paths > Dijkstra" + review rubric specificity | ⚠️ | Form exists but rubric examples are generic; no Algorithms subject tree shown |
| B: View analytics → filter C students → decide re-teach or individual support | ❌ | No grade filter; no drill-down to submission details |
| C: Instructor departure → colleague joins → content preserved via Course Steward | ❌ | No Course Steward management UI exists |

---

## Recommendations for Dr. Levy

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Fix user identity on 04-create-challenge.html — change "Sarah Cohen" / "SC" to "Dr. Levy" / "DL" | Critical |
| 2 | Remove B+ and A- from instructor tables — replace with pure A/B/C per CONOPS | Critical |
| 3 | Add a grade filter to instructor analytics per-student table (filter by A, B, C, or "below B") | High |
| 4 | Add clickable student names in instructor analytics that drill down to student submission details | High |
| 5 | Show domain-specific rubric examples in 04 (e.g., "Detects if AI applies textbook Dijkstra without adapting edge weights") | Medium |
| 6 | Add Course Steward management UI — add/remove instructors, view ownership, transfer settings | Medium |
| 7 | Add pagination or "showing 5 of 12" indicator to instructor challenge list | Medium |
| 8 | Add rubric generation progress indicator (loading spinner, estimated time) | Low |
| 9 | Add PDF export preview mockup showing what the exported report looks like | Low |
