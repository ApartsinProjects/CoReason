# Session 4 — Designing Technology-Enhanced Assessments for Critical Thinking (Multiple Choice)

**Challenge:** Assessment & Evaluation with Technology > Digital Assessment Design > Item Types & Constructive Alignment
**Mode:** Multiple Choice
**Student:** David C.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a suite of technology-enhanced assessment items for a first-year undergraduate "Introduction to Environmental Science" course. The course coordinator wants to move beyond multiple-choice exams and "actually measure whether students can think critically about environmental data." The course has 350 students, two TAs, and exams are currently administered on paper in a large lecture hall. The coordinator wants assessments that "use technology meaningfully, not just digitize paper tests." Students should analyze real datasets, interpret graphs, and construct evidence-based arguments. Deliver a set of 10 prototype assessment items across at least four different technology-enhanced item types, a scoring guide for each, and a feasibility analysis covering platform requirements, grading workload, and academic integrity considerations.

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates a solution?

- **(A)** Just convert the existing paper MC exam to an online MC exam — it's faster and easier to grade.
- **(B)** Assume the platform is Canvas Quizzes, define "critical thinking" as Bloom's Analyze and Evaluate levels, note that 350 students with 2 TAs limits grading capacity, and use public environmental datasets.
- **(C)** Map each item to a specific course learning outcome and Bloom's level before designing, verify that the assessment platform supports the required item types (interactive graphs, simulations, drag-and-drop), calculate explicit grading time per item type at the 350-student scale, address accessibility (screen readers, keyboard navigation, extended time) as a design requirement, and plan for AI-generated response risks in constructed-response items.
- **(D)** Design all items as essays to maximize critical thinking measurement, regardless of grading workload.
- **(E)** Use only auto-graded item types — critical thinking can be fully measured through multiple-choice questions if they are well-designed.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

**10 Prototype Items across 4 types:**

*Type 1 — Interactive Data Interpretation (3 items):* Students view graphs, filter data, answer selection + short-text questions.

*Type 2 — Drag-and-Drop Causal Mapping (2 items):* Arrange environmental factors on causal webs or process sequences. Auto-scored.

*Type 3 — Simulation-Based Scenario (2 items):* Adjust ecosystem parameters, observe outcomes, explain reasoning.

*Type 4 — Evidence-Based Argumentation (3 items):* Evaluate conflicting studies, write evidence-based arguments citing data.

**Scoring:** Auto-scored (items 2-5), TA-graded 2-4 min each (items 1, 6-10).

**Feasibility:** 6 TA-graded items x 350 students x ~3 min = 105 hours TA grading per exam. Items use unique dataset views for integrity. Platform: Canvas Quizzes + separate submission.

### Framing Feedback

**Criticism:** Option (B) is practical and addresses key concerns — Bloom's alignment, grading constraint, and data sources. However, it does not require constructive alignment (mapping items to specific learning outcomes), does not verify platform capability for the proposed item types, does not address accessibility, and does not anticipate AI-response risks. Option (C) was stronger on all these dimensions and would have produced a more feasible and inclusive assessment design from the start.

**Better Alternative:** Option **(C)** — it addresses everything in (B) plus constructive alignment, platform verification, accessibility, and AI-risk planning.

**Grade: B** — Reasonable but missed several fundamental assessment design considerations.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The items should all be multiple-choice for consistency
- **(B)** The 105-hour TA grading workload is infeasible; the simulation items require a platform that Canvas Quizzes doesn't support
- **(C)** The 105-hour grading workload is infeasible (52.5 hrs per TA per exam); simulation items require a platform Canvas can't provide; AI-response risk is unaddressed for constructed-response items; no accessibility analysis for any item type; scoring guides lack exemplar responses for TA calibration
- **(D)** The items are too difficult for first-year students
- **(E)** The item mix is well-balanced and feasible as designed

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Remove all constructed-response items to eliminate TA grading"
- **(B)** "Just add more time for TAs"
- **(C)** "Rebalance to max 3 TA-graded items (keep grading under 25 hours per TA). Redesign simulation items as static scenarios using pre-computed output tables. For AI-response mitigation: require citation of specific data points from assessment-embedded datasets not publicly searchable. Add accessibility notes for each item type (screen reader compatibility, keyboard navigation, extended time)."
- **(D)** "Make all items harder to challenge the students more"
- **(E)** "Add a plagiarism detection tool"

**Student selects: (C)**

#### Updated AI Output

**Rebalanced Item Mix:**

| # | Type | Scoring | Time/Student |
|---|------|---------|-------------|
| 1-2 | Interactive graph (select + 1-sentence) | Semi-auto | 1 min each |
| 3-5 | Drag-and-drop / matching / sequence | Auto | 0 min |
| 6 | Hotspot (click graph feature) | Auto | 0 min |
| 7 | Scenario-based MC (predict simulation outcome) | Auto | 0 min |
| 8 | Structured response: evaluate 2 studies (4 boxes) | TA, 2 min | 2 min |
| 9 | Evidence-based argument (100 words, cite data) | TA, 3 min | 3 min |
| 10 | Identify report weaknesses (2 boxes) | TA, 2 min | 2 min |

**Total TA time:** ~8 min/student x 350 = 46.7 hrs / 2 TAs = **23.3 hrs each**

**AI Mitigation:** Items 8-10 require citation of specific rows/columns from embedded data tables not publicly available. Random 10% oral defense for take-home constructed responses.

**Accessibility Notes:**
- Hotspot (Item 6): provide text-based alternative for screen reader users (describe the graph feature in a dropdown)
- Drag-and-drop: ensure keyboard-operable; provide list-based ordering alternative
- Extended time: configure 1.5x and 2x time accommodations in Canvas
- All images: include alt text and data tables as text alternatives

**Simulation redesign:** Items present pre-computed output tables for 5 parameter combinations; students analyze results rather than running the simulation.

#### Judging Feedback

**Criticism:** The student selected the most comprehensive option in both judging and steering, identifying all five major issues. This is strong analytical coverage. The steering was specific and actionable, with concrete targets (25 hours per TA) and creative solutions (assessment-embedded datasets, static simulation redesign). Selecting option (C) in both steps drove the most complete improvement possible in one cycle.

**Better Alternative:** Option **(C)** was the best choice in both judging and steering.

**Grade: A** — Comprehensive issue identification covering feasibility, platform, integrity, accessibility, and scoring.

#### Steering Feedback

**Criticism:** Option (C) was excellent — it addressed all identified issues with specific, implementable solutions. The grading time target, AI mitigation strategy, accessibility notes, and simulation redesign were all well-specified. This was clearly the strongest option.

**Grade: A** — Specific, comprehensive, and well-structured steering.

---

### Cycle 2

**Current AI Output:** *(rebalanced items with AI mitigation and accessibility)*

#### Judging Sub-step

Which issues remain?

- **(A)** The TA-graded items need exemplar responses at each rubric level for scoring calibration, and there should be an inter-rater reliability protocol
- **(B)** The entire assessment should be oral instead of written
- **(C)** The items need exemplar responses for TA calibration; an inter-rater reliability protocol is needed; the constructive alignment table (item → learning outcome → Bloom's level) is still missing
- **(D)** No issues remain — the assessment suite is complete
- **(E)** The auto-scored items are too easy

**Student selects: (A)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "The assessment is done, submit as is"
- **(B)** "For each TA-graded item (8, 9, 10), provide one exemplar student response at each rubric level (complete, partial, inadequate) with scoring annotations. Include a TA calibration protocol: both TAs grade the same 10 responses independently, compare scores (target 80%+ agreement), discuss discrepancies, and re-calibrate before full grading."
- **(C)** "Rewrite all items to be easier"
- **(D)** "Add a peer grading component where students grade each other"
- **(E)** "Replace rubrics with holistic grading"

**Student selects: (B)**

#### Updated AI Output

**Exemplar for Item 9 (Evidence-Based Argument):**

*Complete:*
> "Based on Table 2, the proposed carbon tax would reduce industrial emissions by 12-18% (rows 3-4). However, Table 3 row 7 shows regressive effects on lower-income groups, suggesting revenue recycling through rebates is necessary."
*Why full credit: Cites specific data points, connects evidence to a reasoned conclusion, addresses a counterargument.*

*Partial:*
> "A carbon tax would reduce emissions because pollution becomes more expensive. Other countries have seen reductions."
*Why partial: Relevant claim but no specific data citations. Vague reference to evidence.*

*Inadequate:*
> "Carbon taxes hurt businesses and the economy. The government shouldn't interfere."
*Why no credit: Opinion without evidence, no data references.*

*(Similar exemplars for items 8 and 10.)*

**TA Calibration Protocol:**
1. Both TAs grade same 10 responses per item (30 total) independently
2. Compare: target 80%+ exact agreement
3. Discuss all discrepancies, document resolution
4. Re-grade 5 to verify alignment
5. Mid-grading cross-check after 50 responses each
6. Time: ~2 hours before grading begins

#### Judging Feedback

**Criticism:** The student correctly identified the need for exemplars and calibration — both essential for reliable scoring. However, option (C) was more complete, as it also flagged the missing constructive alignment table. Without a table mapping each item to a specific learning outcome and Bloom's level, the assessment coordinator cannot verify that the items collectively cover the course objectives. This is a design documentation gap.

**Better Alternative:** Option **(C)** — includes exemplars, calibration, and the missing alignment table.

**Grade: A** — Caught scoring quality issues, missed the alignment documentation gap.

#### Steering Feedback

**Criticism:** Option (B) was well-specified — exemplars at three levels with annotations, plus a calibration protocol with concrete agreement targets and a mid-grading check. These additions significantly improve the practical utility of the deliverable.

**Grade: A** — Specific and actionable, minor gap on alignment.

---

### Cycle 3 (Final)

**Current AI Output:** *(complete assessment suite with exemplars and calibration)*

#### Judging Sub-step

Which issues remain?

- **(A)** A constructive alignment table mapping each item to a learning outcome and Bloom's level would strengthen the documentation
- **(B)** The assessment is fundamentally flawed and needs complete redesign
- **(C)** The assessment suite is comprehensive and ready for pilot testing
- **(D)** More item types should be added
- **(E)** The exemplar responses need revision

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | B     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The student showed significant growth across the session. Framing was the weakest area — missing constructive alignment, platform verification, and accessibility, all of which are foundational to assessment design. However, in judging, the student demonstrated strong recovery: Cycle 1 showed comprehensive issue identification (all five major problems), which was the session's strongest analytical moment. The pattern across cycles was catching the most critical practical issues while sometimes missing documentation gaps (constructive alignment table). Steering was consistently effective — corrections were quantified (grading time targets, calibration agreement percentages), creative (assessment-embedded datasets for AI mitigation), and produced meaningful improvements. The exemplar responses with scoring annotations and the TA calibration protocol both added substantial practical value. To improve, the student should develop the habit of starting every assessment design with a constructive alignment table and an accessibility checklist — these should be non-negotiable starting points, not afterthoughts.
