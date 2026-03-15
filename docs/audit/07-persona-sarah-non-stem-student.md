# Persona Audit: Sarah Kaufman — The Non-STEM Student

**Audit Date:** March 15, 2026
**Persona File:** `docs/personas/07-sarah-non-stem-student.md`
**Key Screens Evaluated:** All student screens (03, 05, 06, 07, 07b, 09), YAML content files

---

## Persona Summary

| Field | Value |
|-------|-------|
| Name | Sarah Kaufman |
| Role | Student |
| Institution | Hebrew University |
| Department | Law |
| Year | 2nd year |
| Courses | Constitutional Law |
| Challenges Completed | 6 |
| Typical Grades | Framing: A, Judging: B, Steering: B |
| Key Trait | Strong legal analytical skills; unfamiliar with tech-oriented framing; questions whether system labels ("framing/judging/steering") fit legal education |

---

## Inconsistencies Found

### 1. Identity Collision: Two Sarahs
**Severity:** High — Confusing

The mockup protagonist is **"Sarah Cohen"** (Tel Aviv University, Computer Science). The non-STEM persona is **"Sarah Kaufman"** (Hebrew University, Law).

These are entirely different people:

| Attribute | Mockup Student | Non-STEM Persona |
|-----------|---------------|-----------------|
| Full Name | Sarah Cohen | Sarah Kaufman |
| Email | s.cohen@tau.ac.il | (not specified) |
| Institution | Tel Aviv University | **Hebrew University** |
| Department | Computer Science | **Law** |
| Courses | Deep Learning, DB Systems, etc. | **Constitutional Law** |

The name overlap creates confusion when discussing mockup fidelity. Stakeholders may assume the mockup represents this persona when it does not.

### 2. Hebrew University Not Represented
**Severity:** High — Environment gap

The sign-up page (`01-sign-up.html`) institution dropdown lists:
- MIT, Stanford University, Tel Aviv University, Technion, University of Oxford, ETH Zurich

**Hebrew University is not listed.** This is Israel's second-largest university and the institution of a defined persona.

The course catalog shows "Showing courses from your institution: Tel Aviv University" — no mockup demonstrates what the Hebrew University experience looks like.

### 3. Zero Non-STEM Content in Entire Prototype
**Severity:** Critical — Content gap

The CONOPS (§6.1) promises: "12 courses across 6 STEM and 6 non-STEM disciplines (Computer Science, Physics, Mathematics, Biology, Electrical Engineering, Economics, Psychology, Education, Business, Law, Philosophy, Political Science)"

**Actual content:**

| Category | What Exists |
|----------|------------|
| Courses in mockups | Deep Learning 101, Database Systems, Software Engineering, Linear Algebra for ML, Statistical Inference, Signal Processing |
| Courses in YAML | deep-learning-101, database-systems, software-engineering, intro-algorithms |
| Subject trees in YAML | computer-science.yaml only |
| Non-STEM courses | **None** |
| Non-STEM challenges | **None** |
| Non-STEM subject trees | **None** |

Sarah Kaufman's "Constitutional Law" course doesn't exist anywhere. No law-specific challenge, rubric, or subject tree has been created. The system's claim of cross-discipline support is entirely unvalidated by the mockups.

### 4. System Terminology May Not Fit Legal Education
**Severity:** High — Intent loss

The persona explicitly asks: "Do the system's labels ('framing,' 'judging,' 'steering') resonate with law students, or would domain-specific labels ('issue spotting,' 'analysis critique,' 'directed revision') be more natural?"

The UI uses fixed labels throughout:
- Phase 1: "Framing" → Law equivalent: "Issue Spotting"
- Phase 2a: "Judging" → Law equivalent: "Analysis Critique"
- Phase 2b: "Steering" → Law equivalent: "Directed Revision"

No mockup shows:
- Customizable phase labels per course
- Domain-specific terminology settings
- Any non-STEM language adaptation

The labels are hardcoded in `data-t` attributes and YAML `ui-labels.yaml` files across all 5 languages, making them globally fixed.

### 5. Legal Reasoning Patterns Not Demonstrated
**Severity:** High — Domain gap

Sarah's persona describes specific legal reasoning patterns:
- "Identifying missing jurisdictional context"
- "Unstated precedent"
- "Ambiguous constitutional provisions"
- "The AI assumes strict scrutiny applies without justifying it"
- "Apply intermediate scrutiny under Craig v. Boren framework"

All mockup examples use CS/ML content:
- Sorting algorithms, neural networks, SQL queries
- Technical vocabulary: "O(n) bottleneck," "cache locality," "median-of-three partitioning"

No mockup demonstrates whether the system can handle legal analysis, case citations, doctrinal frameworks, or statutory interpretation.

---

## Intent Loss: Persona Use Cases Not Testable

### Use Case 1: Non-STEM Domain Validity
> "Does the two-phase model (framing → judge+steer) work naturally for legal analysis?"

**Status:** ❌ Not testable

No legal content exists in the prototype.

### Use Case 2: Rubric Quality for Non-STEM
> "Are the generated rubrics for Constitutional Law genuinely testing legal reasoning?"

**Status:** ❌ Not testable

No non-STEM rubrics exist. All rubric examples are generic CS/ML criteria.

### Use Case 3: Problem Quality for Non-STEM
> "Do the generated constitutional law problems contain realistic legal ambiguities?"

**Status:** ❌ Not testable

No law problems exist.

### Use Case 4: AI Solution Quality for Non-STEM
> "Does the LLM generate plausible but flawed legal analysis?"

**Status:** ❌ Not testable

No law-domain AI output exists in the challenge scenarios.

### Use Case 5: Language and Terminology
> "Do the labels resonate with law students?"

**Status:** ❌ Not addressed

Labels are fixed; no customization mechanism exists.

---

## Evaluation Scenarios Not Supported

| Scenario | Support | Gap |
|----------|---------|-----|
| A: Constitutional law problem about government regulation of social media speech | ❌ | No law content exists |
| B: AI applies wrong standard of review → student catches it → rubric includes doctrinal criteria? | ❌ | No law rubrics exist |
| C: Student steers with "Apply correct standard of review" → feedback suggests Craig v. Boren specificity? | ❌ | No law-domain feedback exists |

**All three evaluation scenarios are completely unsupported.** This persona has zero representation in the mockup content.

---

## Recommendations for Sarah Kaufman

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Create a "Constitutional Law" course with at least one challenge, rubric, and subject tree to prove non-STEM viability | Critical |
| 2 | Add Hebrew University to the institution dropdown | Critical |
| 3 | Create a Law subject tree YAML (e.g., Constitutional Law → Standards of Review, Equal Protection, Due Process, First Amendment) | Critical |
| 4 | Add configurable phase labels per course — allow instructors to set custom terminology (e.g., "Issue Spotting" instead of "Framing") | High |
| 5 | Create a law-domain challenge scenario showing legal analysis with intentional doctrinal errors | High |
| 6 | Show law-specific rubric examples (e.g., "Detects if AI applies an inappropriate doctrinal framework without justification") | High |
| 7 | Resolve the two-Sarahs naming collision — rename the mockup student or the persona to avoid confusion | Medium |
| 8 | Add at least one non-STEM course to the course catalog mockup (06) to demonstrate cross-discipline support | Medium |
