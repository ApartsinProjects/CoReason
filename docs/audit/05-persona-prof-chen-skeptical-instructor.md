# Persona Audit: Prof. Wei Chen — The Skeptical Instructor

**Audit Date:** March 15, 2026
**Persona File:** `docs/personas/05-prof-chen-skeptical-instructor.md`
**Key Screens Evaluated:** 01-sign-up, 04-create-challenge, 06-course-catalog-instructor, 08-instructor-analytics

---

## Persona Summary

| Field | Value |
|-------|-------|
| Name | Prof. Wei Chen |
| Role | Instructor |
| Institution | National University of Singapore |
| Department | Electrical Engineering |
| Courses Joined | Signal Processing |
| Challenges Created | 3 (all public, experimenting) |
| Teaching Style | Traditional lectures, cautious about AI tools |
| Key Trait | Skeptical of AI in education; wants to validate grading accuracy; demands domain-specific rubrics |

---

## Inconsistencies Found

### 1. Institution Not Represented
**Severity:** High — Environment gap

All mockups are locked to "Tel Aviv University." Prof. Chen is at **National University of Singapore (NUS)**.

The sign-up page (`01-sign-up.html`) institution dropdown lists:
- MIT, Stanford University, Tel Aviv University, Technion, University of Oxford, ETH Zurich

**NUS is not listed.** No Asian or Southeast Asian university appears. The course catalog shows "Showing courses from your institution: Tel Aviv University" — no mockup demonstrates what a non-TAU institution experience looks like.

### 2. No Signal Processing Subject Tree
**Severity:** High — Domain gap

The only subject tree shown in `04-create-challenge.html` is for **Deep Learning 101**:
- Neural Networks → Backpropagation, Architectures, Optimization
- Loss Functions
- Model Evaluation

Prof. Chen teaches **Signal Processing**. The persona expects subject nodes like:
- Frequency Domain Analysis → Aliasing, Nyquist Rate
- Filter Design → Low-pass, High-pass, Bandpass
- Sampling → ADC, Quantization

No Signal Processing subject tree exists in any YAML file (`content/*/subjects/` only has `computer-science.yaml`). The mockup cannot demonstrate whether the system works for EE courses.

### 3. No Rubric Editing Capability
**Severity:** High — Intent loss

The persona explicitly asks: "Does she find this specific enough, or does she wish she could edit it?"

Prof. Chen is described as someone who "reviews every generated rubric with a critical eye" and is concerned about:
- Domain specificity
- Grading accuracy
- Problem quality

`04-create-challenge.html` shows rubrics as **read-only preview text** with only a "Generate Rubrics" button. There is:
- No inline editing of rubric criteria
- No "adjust this criterion" button
- No ability to add/remove rubric items
- No save/export of edited rubrics

For a skeptical instructor, the inability to fine-tune rubrics is a dealbreaker.

### 4. No Grade Override or Comparison View
**Severity:** High — Intent loss

The persona's core use case is validating system accuracy: "Prof. Chen reads student responses and assigns his own grades, then compares them to the system's grades."

No mockup shows:
- A grade override button or annotation field
- Side-by-side comparison of system grade vs instructor grade
- Agreement rate statistics
- Any mechanism for the instructor to record their own assessment

This is the single most important feature for building Prof. Chen's trust, and it doesn't exist.

### 5. No Non-STEM Validation
**Severity:** Medium — Cross-concern

Prof. Chen wonders "whether the system's approach makes sense for engineering, where problems often have more constrained solution spaces than humanities."

The mockups show only CS/ML content. Without at least one non-CS example (even within STEM — e.g., EE/Signal Processing), the system cannot demonstrate that the framing/judging/steering model works across disciplines.

---

## Intent Loss: Persona Use Cases Not Testable

### Use Case 1: Rubric Domain Specificity
> "Does the Judging rubric test whether the student can identify incorrect Nyquist rate assumptions?"

**Status:** ❌ Not testable

No Signal Processing rubrics exist. The shown rubrics are generic ("Detects logical errors in AI solution") rather than domain-specific. Prof. Chen would find these insufficient.

### Use Case 2: Grading Accuracy Validation
> "What is the agreement rate between system grades and expert assessment?"

**Status:** ❌ Not supported

No grade override, annotation, or comparison feature exists.

### Use Case 3: Problem Realism
> "Do the generated signal processing problems contain realistic engineering ambiguities?"

**Status:** ❌ Not testable

No Signal Processing problems exist in the mockups or YAML content.

### Use Case 4: Instructor Trust Building
> "What features would shift Prof. Chen from skeptic to advocate?"

**Status:** ❌ None of the trust-building features exist

The persona identifies: rubric editing, grade override, side-by-side comparison. None are shown.

---

## Evaluation Scenarios Not Supported

| Scenario | Support | Gap |
|----------|---------|-----|
| A: Create challenge for "Signal Processing > Filter Design" — evaluate problem quality | ❌ | No EE subject tree; no Signal Processing content |
| B: System grades student A, Prof. Chen disagrees — rubric lacks aliasing criteria | ❌ | No grade override; no rubric editing |
| C: Read "better alternative" feedback — does it show genuine signal processing expertise? | ❌ | No EE-domain feedback examples |

---

## Recommendations for Prof. Chen

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Add NUS and other international institutions to the signup dropdown | High |
| 2 | Create an Electrical Engineering subject tree YAML with Signal Processing, Filter Design, Sampling topics | High |
| 3 | Add rubric inline editing to 04-create-challenge.html — editable criteria text, add/remove items | High |
| 4 | Add a grade override/annotation feature in instructor analytics — "my assessment" column next to system grade | High |
| 5 | Show a non-CS subject tree in the create challenge form (even as a second example mockup) | Medium |
| 6 | Add domain-specific rubric examples for Signal Processing (e.g., "Detects incorrect Nyquist rate assumptions") | Medium |
| 7 | Show an agreement rate dashboard — system grade vs instructor override across all students | Medium |
| 8 | Add a "flag for review" button on individual student submissions that Prof. Chen finds questionable | Low |
