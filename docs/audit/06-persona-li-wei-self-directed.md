# Persona Audit: Li Wei — The Self-Directed Learner

**Audit Date:** March 15, 2026
**Persona File:** `docs/personas/06-li-wei-self-directed-student.md`
**Key Screens Evaluated:** 03-challenge-list, 04-create-challenge, 07-student-analytics, 07b-challenge-report, 08-instructor-analytics

---

## Persona Summary

| Field | Value |
|-------|-------|
| Name | Li Wei |
| Role | Student |
| Institution | Tel Aviv University |
| Department | Computer Science |
| Year | 3rd year |
| Courses | Introduction to Algorithms, Database Systems, Software Engineering |
| Challenges Completed | 18 (10 public, 8 private) |
| Typical Grades | Framing: B, Judging: C→B (improving), Steering: B |
| Key Trait | Creates private challenges for self-study; tracks own improvement; prefers open-ended mode |

---

## Inconsistencies Found

### 1. Li Wei Appears in Instructor Analytics with Wrong Grades
**Severity:** Medium — Data contradiction

`08-instructor-analytics.html` shows:
```
Li Wei | Mar 12, 2026 | B | C | B | B
```

This matches his **current** grades (F:B, J:C→B, S:B). However, this represents him at the start of his improvement journey. His judging should be B now (persona says he improved from C to B by weeks 4-6). The instructor analytics snapshot should either show his latest grades (B/B/B) or document the date range.

### 2. Private Challenge Creation Flow Missing
**Severity:** Critical — Feature gap

Li Wei creates **1-2 private challenges per week** targeting specific subject tree nodes. This is his primary use pattern.

As documented for Maria, the student challenge list (`03-challenge-list.html`) has a "+ Create Challenge" button linking to the instructor form (`04-create-challenge.html`), which shows:
- Instructor navigation
- "Create a Public Challenge" title
- No visibility toggle (locked to Public)

**There is no student-facing private challenge creation screen.** This is the most critical missing feature for Li Wei's persona.

### 3. Improvement Trajectory Not Visible
**Severity:** High — Intent loss

Li Wei's story is explicitly about improvement over time:
- Weeks 1-3: C in judging
- Weeks 4-6: B in judging (after repeated "what else could be wrong?" feedback)
- Current: stable B, working toward A in framing

The student analytics page (`07-student-analytics.html`) shows:
- Grade dots on a timeline ✓ (good)
- But **no trend line** connecting the dots
- No directional indicator (↑ improving)
- No "your judging improved from C to B over 6 challenges" message
- No goal-setting feature ("reach A in judging")

The persona explicitly asks: "Is this improvement visible and motivating?"

### 4. No Public vs Private Filtering in Analytics
**Severity:** High — Feature gap

Li Wei has 10 public + 8 private challenges. He would want to:
- See if his private practice is actually improving his public performance
- Compare private challenge grades (self-study) vs public challenge grades (assigned work)
- Track which subject tree nodes he's practiced privately

The analytics page (07) has a Type filter (Practice/Assessment) but **no Visibility filter** (Public/Private). Li Wei can't isolate his self-study results.

### 5. Subject Tree Navigation Not Optimized for Student Self-Study
**Severity:** Medium — Intent loss

The persona describes Li Wei "targeting specific subject tree nodes where he scored poorly on public challenges." This implies a workflow:

1. Look at analytics → identify weak subject area
2. Create private challenge on that specific topic
3. Practice until improvement

The mockups don't connect analytics to challenge creation. There's no:
- "Create practice challenge" link from a weak-grade analytics row
- Subject tree nodes linked to performance data
- "Suggested topics to practice" based on grade history

---

## Intent Loss: Persona Use Cases Not Testable

### Use Case 1: Private Challenge Pedagogical Value
> "Do private challenges support genuine self-directed learning?"

**Status:** ❌ Not testable

No private challenge creation flow exists for students.

### Use Case 2: Improvement Tracking
> "Can Li Wei see his own improvement trajectory?"

**Status:** ⚠️ Partially visible

Timeline dots show historical grades but no trend analysis, no directional indicators, and no milestone markers.

### Use Case 3: Challenge Creation for Students
> "Is the challenge creation flow intuitive enough for students?"

**Status:** ❌ Not testable

The only creation form is instructor-facing.

### Use Case 4: Subject Tree Navigation
> "Does Li Wei find it easy to target specific subject tree nodes for his weaknesses?"

**Status:** ⚠️ Partially shown

The subject tree multi-select in 04 is well-designed but lives on an instructor page. No student-facing tree selection is shown.

### Use Case 5: Open-Ended Response Structure
> "Does the named-sections format help Li Wei organize his thinking?"

**Status:** ✓ Shown

`05b-challenge-run-open-ended.html` demonstrates the named-sections approach with add/remove buttons. This matches Li Wei's preference for open-ended mode.

---

## Evaluation Scenarios Not Supported

| Scenario | Support | Gap |
|----------|---------|-----|
| A: Create private challenge on "Dynamic Programming > Knapsack" → C → retry → improve? | ❌ | No student creation flow; no retry tracking |
| B: Review "My Results" → filter by course → see judging C→B improvement over 6 challenges | ⚠️ | Course filter exists but no trend line or improvement indicator |
| C: Create OE challenge with 5 named gaps → mixed quality → grading handles correctly? | ⚠️ | OE interface shown (05b) but grading of mixed-quality responses not demonstrated |

---

## Recommendations for Li Wei

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Create a student-facing private challenge creation screen with simplified form and visibility locked to "Private" | Critical |
| 2 | Add per-skill trend indicators to analytics — directional arrows (↑↗→↘↓) and/or sparkline mini-charts | High |
| 3 | Add a Visibility filter (Public/Private) to student analytics | High |
| 4 | Add "your improvement" summary message to analytics: "Your judging improved from C to B over the last 6 challenges" | High |
| 5 | Link analytics weak areas to challenge creation — "Practice this topic" button next to low-grade entries | Medium |
| 6 | Add goal-setting feature — "My goal: reach A in Framing by end of semester" with progress tracking | Medium |
| 7 | Show subject tree performance map — which nodes the student has practiced and their grades per node | Low |
| 8 | Add a "study plan" or "recommended practice sequence" based on grade patterns | Low |
