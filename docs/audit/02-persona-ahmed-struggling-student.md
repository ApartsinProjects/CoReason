# Persona Audit: Ahmed Hassan — The Struggling Student

**Audit Date:** March 15, 2026
**Persona File:** `docs/personas/02-ahmed-struggling-student.md`
**Key Screens Evaluated:** 03-challenge-list, 05-challenge-run, 07-student-analytics, 07b-challenge-report, 08-instructor-analytics

---

## Persona Summary

| Field | Value |
|-------|-------|
| Name | Ahmed Hassan |
| Role | Student |
| Institution | Tel Aviv University |
| Department | Computer Science |
| Courses | Introduction to Algorithms, Software Engineering |
| Challenges Completed | 8 |
| Typical Grades | Framing: C, Judging: C, Steering: C |
| Key Trait | Accepts AI output at face value; vague, non-specific corrections |

---

## Inconsistencies Found

### 1. Ahmed Appears in Instructor Analytics but Has No Student View
**Severity:** High — Representation gap

Ahmed appears as a row in `08-instructor-analytics.html`:
```
Ahmed Hassan | Mar 12, 2026 | C | C | C | C
```

This correctly matches his persona grades. However, there is **no mockup showing Ahmed's student experience**. What does an all-C analytics page look like? Is the stacked-bar chart entirely red? Does the "Most Common Grade" circle show a large red "C"? The persona specifically asks whether this is discouraging.

### 2. Course Subscription Contradiction
**Severity:** Medium — Data conflict

| Source | Courses |
|--------|---------|
| Persona | Introduction to Algorithms, Software Engineering |
| Instructor analytics (08) | Shows Ahmed in "Neural Network Debugging" under "Deep Learning 101" |

Ahmed is not subscribed to Deep Learning 101 per his persona. He shouldn't appear as a student in that course's analytics.

### 3. No Scaffolding or Adaptive UI for Struggling Students
**Severity:** High — Intent loss

The persona explicitly raises the question: "Does Ahmed need more scaffolding (e.g., worked examples, progressive difficulty)?" The mockups show **zero adaptive elements**:

- The challenge run page (05) is identical for A-students and C-students
- No "try an easier challenge first" suggestion
- No progressive hint reveal system
- No worked-example mode
- No "getting started" guidance for new/struggling users
- No difficulty indication on challenges

### 4. Feedback Volume Not Managed
**Severity:** High — Intent loss

Persona Scenario A asks: "His grades are C/C/C. The end-of-challenge feedback reveals all three critiques at once. Does the volume of feedback overwhelm him?"

The challenge report page (`07b-challenge-report.html`) shows all phases expanded simultaneously:
- Phase 1 Framing: submission + feedback + grade
- Phase 2 cycles: each with judging + steering + AI output toggle
- Final grades: all three cards visible

There is no progressive disclosure — no "start with your strongest area" guidance, no priority ordering of feedback. For Ahmed, this is a wall of criticism.

### 5. Grade Floor Psychology Not Addressed
**Severity:** Medium — Intent loss

The persona asks: "Is a C grade too discouraging? Does the system's feedback help Ahmed understand it's about skill development, not punishment?"

The mockup grade badges use red coloring for C grades (`var(--grade-c)` = red). Combined with the large circle display in analytics, an all-C student sees three large red circles. There is:
- No encouraging messaging
- No "progress from your starting point" indicator
- No growth mindset framing
- No differentiation between "you're learning" vs "you failed"

---

## Intent Loss: Persona Use Cases Not Testable

### Use Case 1: Feedback Pedagogical Value for Weak Students
> "Does the critique + better alternative format help Ahmed understand what he should have done?"

**Status:** ⚠️ Partially shown

The feedback blocks in 07b show criticism + better alternative structure, which is correct per CONOPS. However, the mockup uses advanced language ("Strong identification of missing constraints," "complexity proof gap") that may not resonate with Ahmed's level. No mockup shows what C-level feedback looks like — the examples are all from an A/B student perspective.

### Use Case 2: MC as Scaffolding
> "Do MC options help Ahmed learn by exposing him to expert-level analysis?"

**Status:** ❌ Not testable

The challenge run page shows MC options but doesn't show what happens after Ahmed selects a wrong option. Does he see why the correct option was better? Is the correct answer revealed with explanation? The feedback structure for MC in practice mode is not demonstrated.

### Use Case 3: Hint Text Effectiveness
> "Do the static hint texts provide enough guidance for Ahmed?"

**Status:** ⚠️ Partially shown

The challenge run page shows an instructions bar but the hint text is generic: "Read the problem statement carefully. Identify missing information..." For Ahmed, who doesn't know what "missing information" looks like, this may be insufficient. No domain-specific or skill-level-adapted hints are shown.

### Use Case 4: Progress Tracking Over 8 Challenges
> "Has Ahmed's performance improved? Can the instructor identify the pattern?"

**Status:** ❌ Not testable (from instructor side: ⚠️)

From student side: No Ahmed analytics mockup exists.
From instructor side: The per-student table (08) shows a single row with grades but no history. The instructor can't see whether Ahmed's latest C is his 8th consecutive C or whether he showed improvement mid-semester before regressing.

---

## Evaluation Scenarios Not Supported

| Scenario | Support | Gap |
|----------|---------|-----|
| A: C/C/C assessment — feedback volume overwhelm? | ❌ | No progressive disclosure in report page; no C-student mockup |
| B: Practice mode retry after C feedback — does second attempt improve? | ❌ | No retry tracking; no before/after comparison view |
| C: MC vs OE performance comparison | ❌ | Response mode not shown in analytics |

---

## Recommendations for Ahmed

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Create a C-student analytics mockup variant showing all-C distributions with encouraging messaging | Critical |
| 2 | Add progressive disclosure to challenge report — show summary first, let student expand one dimension at a time with a "start here" recommendation | High |
| 3 | Add difficulty/complexity indicators to challenge cards so Ahmed can choose appropriate challenges | High |
| 4 | Design a "getting started" empty state for new/struggling students with guided first-challenge flow | High |
| 5 | Rethink C-grade visual treatment — consider warm/neutral colors instead of red, or add growth framing ("Building skills") | Medium |
| 6 | Show MC post-submission feedback in practice mode — reveal correct option with explanation of why it's better | Medium |
| 7 | Add per-student history view in instructor analytics — show grade trajectory over time, not just latest grades | Medium |
| 8 | Add retry tracking — distinguish first-attempt grades from retry grades in analytics | Low |
