# Persona Audit: Maria Santos — The Advanced Student

**Audit Date:** March 15, 2026
**Persona File:** `docs/personas/03-maria-advanced-student.md`
**Key Screens Evaluated:** 03-challenge-list, 04-create-challenge, 05-challenge-run, 07-student-analytics, 08-instructor-analytics

---

## Persona Summary

| Field | Value |
|-------|-------|
| Name | Maria Santos |
| Role | Student |
| Institution | Tel Aviv University |
| Department | Computer Science |
| Year | 3rd year / graduate-track |
| Courses | Introduction to Algorithms, Deep Learning 101, Software Engineering |
| Challenges Completed | 22 (highest among student personas) |
| Typical Grades | Framing: A, Judging: A, Steering: B |
| Key Trait | Over-specifies in steering — "shotgun" multi-part corrections that dilute impact |

---

## Inconsistencies Found

### 1. Maria Appears Only in Instructor Analytics
**Severity:** Medium — Representation gap

Maria appears as a row in `08-instructor-analytics.html`:
```
Maria Santos | Mar 13, 2026 | A | A | B | A
```

This correctly matches her persona grades (F:A, J:A, S:B, Overall:A). However, like Ahmed, there's no student-view mockup showing what an A-dominant analytics page looks like. The current mockup (07) shows a mixed A/B/C profile that doesn't match any persona exactly.

### 2. Private Challenge Creation Flow Missing
**Severity:** Critical — Feature gap

The persona states: "Maria creates her own challenges for self-study" and specifically asks: "Does the private challenge creation flow serve advanced students?"

The student challenge list (`03-challenge-list.html`) has a "+ Create Challenge" button, but it links to `04-create-challenge.html` which:
- Shows **instructor** navigation (Challenges/Courses/Analytics links go to instructor pages)
- Shows **"Sarah Cohen"** as an instructor (wrong role)
- Title says **"Create a Public Challenge"** (not private)
- Has **no private/visibility option** (visibility is locked to "Public" with an info alert)

There is **no student-facing private challenge creation flow** in the mockups. This is a critical omission given that:
- Maria uses it for self-study
- Li Wei creates 1-2 private challenges per week
- The CONOPS explicitly supports student-created private challenges

### 3. No Ceiling Effect Mitigation
**Severity:** High — Intent loss

The persona asks: "Does the system provide meaningful differentiation for top students? Is there enough challenge to keep Maria engaged?"

The mockups show no mechanism for:
- Difficulty progression (easy → medium → hard)
- Achievement/mastery indicators
- "Suggested harder challenge" after scoring A/A/A
- Advanced analytics views (e.g., "your steering improved but here's a pattern you could work on")
- Peer comparison or benchmarking

A student who consistently scores A has no UI telling them what to work on next.

### 4. Steering Prioritization Feedback Not Demonstrated
**Severity:** Medium — Intent loss

Maria's key weakness is sending multi-part corrections without prioritizing. The mockup feedback in 07b shows generic text like "Specific, actionable corrections that improved the solution significantly" — this is A-level feedback that doesn't address the prioritization nuance.

No mockup shows B-level steering feedback that says something like: "Your corrections were all valid, but sending 3 at once caused the AI to partially address items 1 and 3 while missing item 2. Focus on the highest-impact issue first."

---

## Intent Loss: Persona Use Cases Not Testable

### Use Case 1: Ceiling Effects
> "Is there enough challenge to keep Maria engaged, or does she quickly hit all-A performance?"

**Status:** ❌ Not testable

No difficulty scaling, mastery tracking, or "what's next" recommendations exist.

### Use Case 2: Steering Nuance
> "Does the feedback help Maria understand prioritization as a steering skill?"

**Status:** ❌ Not shown

No B-level steering feedback example exists in the mockups. All feedback examples are either generic or from an A-level perspective.

### Use Case 3: Private Challenge Creation
> "Does the private challenge creation flow serve advanced students?"

**Status:** ❌ Flow doesn't exist

No student-facing creation screen.

### Use Case 4: Cross-Discipline Breadth
> "Does her framing skill transfer across domains?"

**Status:** ⚠️ Partially testable

Course filter exists in analytics but no cross-course comparison view is available.

### Use Case 5: Assessment vs Practice Distinction
> "Does Maria perform differently on Assessment challenges?"

**Status:** ⚠️ Partially testable

Type filter exists in analytics table, but no side-by-side comparison of Practice vs Assessment grades.

---

## Evaluation Scenarios Not Supported

| Scenario | Support | Gap |
|----------|---------|-----|
| A: Private challenge creation + rubric quality for Deep Learning | ❌ | No student creation flow exists |
| B: Multi-part steering correction → AI partially addresses → feedback on prioritization | ❌ | No B-level steering feedback shown |
| C: Practice vs Assessment grade comparison | ⚠️ | Filter exists but no comparative visualization |

---

## Recommendations for Maria

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Create a student-facing private challenge creation screen with visibility locked to "Private," student nav, and simplified form | Critical |
| 2 | Add a "suggested next challenge" or "areas to develop" section in analytics for students who score mostly A | High |
| 3 | Show a B-level steering feedback example that specifically addresses prioritization (the persona's key weakness) | High |
| 4 | Add mastery indicators per subject tree node — show which topics the student has mastered vs still developing | Medium |
| 5 | Add Practice vs Assessment grade comparison in analytics (side-by-side or filter toggle) | Medium |
| 6 | Add a "cross-course performance" view showing if skills transfer across domains | Low |
