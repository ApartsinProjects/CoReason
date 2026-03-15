# Persona Audit: Noa Reshef — The Diligent Student

**Audit Date:** March 15, 2026
**Persona File:** `docs/personas/01-noa-diligent-student.md`
**Key Screens Evaluated:** 03-challenge-list, 05-challenge-run, 07-student-analytics, 07b-challenge-report, 06-course-catalog, 09-profile

---

## Persona Summary

| Field | Value |
|-------|-------|
| Name | Noa Reshef |
| Role | Student |
| Institution | Tel Aviv University |
| Department | Computer Science |
| Courses | Introduction to Algorithms, Database Systems |
| Challenges Completed | 14 |
| Typical Grades | Framing: B, Judging: B, Steering: A |
| Key Trait | "Satisficing" — catches primary issue but stops looking |

---

## Inconsistencies Found

### 1. Noa Is Not the Mockup Protagonist
**Severity:** High — Identity loss

All student mockup screens show "Sarah Cohen" as the logged-in student. Noa R. appears only in the challenge-run simulator (`<span id="user-name">Noa R.</span>` in `05-challenge-run.html`). Despite Noa being the **primary student persona** used in the CONOPS scenario walkthrough (§7 — "Sorting Pipeline for Sensor Data"), she is not the face of the student experience in any static screen.

**Impact:** Reviewers and stakeholders cannot trace Noa's journey through the mockups without mentally substituting identities.

### 2. Grade Profile Does Not Match
**Severity:** High — Data contradiction

| Dimension | Persona Spec | Mockup (07-student-analytics, Sarah's data) |
|-----------|-------------|----------------------------------------------|
| Framing | B (typical) | A (most common: 4 out of 6) |
| Judging | B (typical) | B (most common: 3 out of 6) |
| Steering | A (typical) | A (most common: 3 out of 6) |

Noa's signature pattern — strong steering, weaker framing — is **inverted** in the mockup. The mockup student has A-level framing, which obscures Noa's key behavioral characteristic: she "addresses the parameters of the problem but not its assumptions."

### 3. Course Subscription Mismatch
**Severity:** Medium — Data contradiction

| Source | Courses |
|--------|---------|
| Persona | Introduction to Algorithms, Database Systems |
| Mockup profile (09) | Deep Learning 101, Database Systems, Software Engineering, Signal Processing, Algorithms |
| Mockup course catalog (06) | Deep Learning 101 ✓, Database Systems ✓, Signal Processing ✓ (subscribed) |

Noa subscribes to 2 courses; the mockup student subscribes to 5. The canonical CONOPS challenge — "Sorting Pipeline for Sensor Data" in Introduction to Algorithms — doesn't appear by that name in any challenge list.

### 4. Challenge Count Mismatch
**Severity:** Medium — Data contradiction

| Source | Completed Challenges |
|--------|---------------------|
| Persona | 14 |
| Profile (09) | 12 (Challenges Executed) |
| Analytics table (07) | 4 rows shown |
| Analytics timeline (07) | 6 data points |

None of these numbers match Noa's 14.

### 5. "Satisficing" Pattern Not Surfaced in UI
**Severity:** High — Intent loss

Noa's defining behavioral trait is that she "reliably catches the most critical issue... but stops after finding one or two problems." The mockups provide no way to visualize this pattern:

- No "issues found per cycle" metric
- No "cycles used vs max available" indicator
- No "depth of analysis" score
- The grade alone (B) doesn't distinguish "caught 1 of 4 issues" from "caught 3 of 4 issues poorly"

Without this, Noa's analytics page looks identical to any other B-student.

---

## Intent Loss: Persona Use Cases Not Testable

### Use Case 1: Practice Mode Effectiveness
> "Does Noa's judging improve over multiple practice runs?"

**Status:** ❌ Not testable

The analytics page shows grades per challenge but no trend analysis per skill. There's no "judging improvement over time" chart or directional indicator. The timeline shows dots but no connecting trend line.

### Use Case 2: Skill Gap Visibility
> "Do the three separate grades clearly surface her pattern (strong steering, weak comprehensive judging)?"

**Status:** ⚠️ Partially testable

The three-column grade display (07, 07b) does separate the dimensions, which is good. However, the distribution cards show aggregate counts, not the student's consistent pattern. A "your strengths and areas for growth" summary would make the pattern explicit.

### Use Case 3: MC vs Open-Ended Impact
> "Does Noa perform differently when judging options are presented as MC vs. open-ended?"

**Status:** ❌ Not testable

The analytics table shows challenge type (Practice/Assessment) but not response mode (MC/OE). There's no way to filter or compare performance by response mode.

### Use Case 4: Cross-Course Transfer
> "Does her improvement in Algorithms transfer to Database Systems?"

**Status:** ⚠️ Partially testable

The course filter exists in analytics (07) but the trend timeline doesn't filter by course. Cross-course comparison would require side-by-side filtered views.

---

## Evaluation Scenarios Not Supported

| Scenario | Support | Gap |
|----------|---------|-----|
| A: Same challenge type 3x in Practice — measure judging improvement | ❌ | No per-challenge-type trend view; no retry tracking |
| B: Compare MC vs OE judging grades | ❌ | Response mode not shown in analytics |
| C: Challenge with only minor issues — does Noa mark "Done" too early? | ⚠️ | Challenge run page has "Solution is complete" button but analytics don't track false-positive "Done" marking |

---

## Recommendations for Noa

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Add a "depth of analysis" metric (issues found / issues available) visible in analytics | High |
| 2 | Add per-skill trend indicators (↑ improving, → stable, ↓ declining) to analytics | High |
| 3 | Add response mode (MC/OE) as a column or filter in analytics table | Medium |
| 4 | Show "cycles used vs max" in challenge report (07b) to surface early-exit pattern | Medium |
| 5 | Align mockup grade profile with Noa's spec (Framing: B, Judging: B, Steering: A) or document that Sarah Cohen is a separate composite persona | Medium |
| 6 | Add cross-course comparison view or per-course trend filtering | Low |
