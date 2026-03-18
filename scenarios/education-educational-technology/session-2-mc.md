# Session 2 — Evaluating Adaptive Learning Platforms for Undergraduate STEM (Multiple Choice)

**Challenge:** Adaptive & Personalized Learning > Adaptive Learning Systems > Content Sequencing Algorithms
**Mode:** Multiple Choice
**Student:** Marcus J.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Prepare an evaluation report comparing three adaptive learning platforms for use in a large-enrollment introductory chemistry course (800+ students across four sections). The department chair wants a platform that "personalizes the learning path" and "reduces the DFW rate." Faculty have "mixed feelings" about giving up control of content sequencing to an algorithm. The current course uses a traditional textbook and weekly problem sets. Budget is "tight but we can make a case if the evidence is strong." Deliver an evaluation matrix scoring each platform on at least eight criteria, a summary of the evidence base for adaptive learning in STEM, and a recommendation memo with implementation risks. The platforms to evaluate are "the major ones—you know which."

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates a solution?

- **(A)** Don't name specific platforms — just ask the AI to compare "adaptive learning" in general. Assume all platforms work the same way and focus on price.
- **(B)** Name three platforms (ALEKS, Realizeit, Knewton Alta), require peer-reviewed evidence for efficacy claims, include per-student cost, and evaluate instructor override capability as a criterion.
- **(C)** Name three platforms, decompose "personalization" into distinct mechanisms (sequencing, difficulty, pacing, remediation), require peer-reviewed evidence with effect sizes, ask for current DFW baseline to contextualize improvement claims, evaluate instructor override and training requirements, and assess implementation risks beyond cost (adoption resistance, data privacy, vendor lock-in).
- **(D)** Just pick whichever platform is cheapest — budget is tight, so cost is the only criterion that matters.
- **(E)** Recommend against adaptive learning entirely — faculty should maintain full control of content sequencing.

**Student selects: (C)**

### AI Solution (Generated from Student's Framing)

**Evaluation Matrix:**

| Criterion | ALEKS | Realizeit | Knewton Alta |
|-----------|-------|-----------|-------------|
| Adaptive Mechanism | Knowledge Space Theory (gap diagnosis + targeted practice) | Rule-based mastery (instructor-defined branching paths) | Bayesian knowledge tracing (probabilistic skill estimation) |
| Content Coverage | Full Gen Chem, publisher-aligned | Customizable, BYO content | Full course, OER-integrated |
| Instructor Override | Limited — preset knowledge map | High — instructor modifies paths | Moderate — adjustable topic weights |
| LMS Integration | LTI 1.1, Canvas/Blackboard | LTI 1.3, full gradebook sync | LTI 1.3, Canvas native |
| Per-Student Cost* | ~$45/sem (~$36K for 800) | ~$35/sem (~$28K for 800) | ~$40/sem (~$32K for 800) |
| Evidence Base | Multiple RCTs, strongest in STEM | Limited peer-reviewed studies | Some quasi-experimental |
| Faculty Training Needed | 8-10 hrs initial setup | 15-20 hrs (path design) | 5-8 hrs |
| Data Privacy | FERPA compliant, data on vendor servers | FERPA compliant, on-prem option | FERPA compliant, cloud only |
| Vendor Lock-in Risk | High — proprietary content format | Moderate — supports content export | Moderate — OER content portable |

*Costs are estimates subject to institutional negotiation.*

**Evidence Summary (with specific studies):**
1. Falmagne et al. (2013) — ALEKS in Gen Chem. N=1,200. DFW dropped 28% to 22%. Quasi-experimental. McGraw-Hill funded.
2. Griff & Matter (2013) — ALEKS in intro chem. N=450. Pass rate +4 pp. Independent.
3. Essa & Ayad (2012) — Realizeit in STEM. N=280. Final exam +8%. Developer co-authored.

**Note:** Current DFW baseline not provided in the problem — the department should establish this before interpreting any platform's claimed improvement.

**Recommendation:** Pilot ALEKS in one section (200 students) alongside traditional sections. Use ALEKS for homework/practice while instructors retain control of lectures and exams. If faculty autonomy is the priority, Realizeit offers more control but weaker evidence.

**Implementation Risks:** Faculty resistance to algorithmic sequencing, student frustration with drill-based interfaces, vendor price increases after adoption, data portability if switching platforms.

### Framing Feedback

**Criticism:** Option (C) was the strongest available choice. It decomposed "personalization" into distinct mechanisms, demanded peer-reviewed evidence with effect sizes, identified the missing DFW baseline, and addressed implementation risks beyond cost. This framing produced a substantially more nuanced and useful evaluation than the alternatives.

**Better Alternative:** Option **(C)** was the best choice.

**Grade: A** — Comprehensive framing that addressed definitional precision, evidence standards, and implementation realism.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The matrix has too many criteria — simplify to just cost and content coverage
- **(B)** The evidence summary cites only 3 studies and doesn't discuss effect sizes or methodological threats (selection bias, Hawthorne effects); the adaptive mechanism descriptions use technical jargon
- **(C)** The evidence summary is thin and uses jargon; the matrix lacks accessibility compliance and student experience criteria; the recommendation should include a decision framework for weighing evidence strength against faculty autonomy rather than simply presenting two options
- **(D)** The solution should recommend all three platforms equally
- **(E)** The matrix is complete and the recommendation is well-balanced — no issues

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Add more platforms to the comparison"
- **(B)** "Make the report shorter"
- **(C)** "Expand the evidence summary with methodological critique (selection bias, confounds with course redesign, Hawthorne effects). Add accessibility compliance (WCAG 2.1) and student experience/satisfaction rows to the matrix. Replace the two-option recommendation with a decision framework that helps the department weigh evidence strength, faculty autonomy, cost, and risk systematically."
- **(D)** "Just recommend the cheapest option"
- **(E)** "Add a section about blockchain-based credentials"

**Student selects: (C)**

#### Updated AI Output

**Additional Matrix Rows:**

| Criterion | ALEKS | Realizeit | Knewton Alta |
|-----------|-------|-----------|-------------|
| Accessibility (WCAG 2.1) | Partial — known issues with screen readers in graphing tools | Full compliance claimed, third-party audit available | Partial — limited keyboard navigation in some modules |
| Student Experience | Drill-and-practice, progress pie chart; satisfaction studies show mixed reviews (~60% positive) | Varied modalities, instructor-curated paths; limited satisfaction data | Textbook-integrated problem sets; 68% preferred over traditional homework |

**Expanded Evidence Critique:**
All three cited studies share common limitations: (1) none are true RCTs with random assignment to condition, (2) adaptive platform adoption typically co-occurs with other course changes (flipped format, more practice), making it impossible to isolate the platform's effect, (3) sample sizes are small relative to the heterogeneity of student populations, (4) the two strongest studies have vendor involvement. The department should treat claimed effect sizes as upper bounds.

**Decision Framework:**

| Priority | Recommended Platform | Rationale |
|----------|---------------------|-----------|
| Evidence strength is paramount | ALEKS (pilot first) | Strongest evidence base, but limited instructor control |
| Faculty autonomy is paramount | Realizeit | Most customizable, but weakest evidence and highest training cost |
| Cost minimization is paramount | Realizeit | Lowest per-student cost and potential OER pairing |
| Balanced approach | ALEKS for practice + instructor-controlled lectures and exams | Hybrid model preserves faculty role while leveraging adaptive practice |

#### Judging Feedback

**Criticism:** The student selected the most comprehensive option in both judging and steering, demonstrating strong analytical range. The evidence critique expansion, accessibility addition, and decision framework were all well-targeted. No significant issues were missed at this stage.

**Better Alternative:** Option **(C)** was the best choice.

**Grade: A** — Comprehensive issue identification and well-structured steering.

#### Steering Feedback

**Criticism:** Option (C) was excellent — it targeted three distinct issues with specific, actionable requests. The decision framework approach was particularly strong, as it moves the deliverable from "here's our pick" to "here's how to decide based on your priorities." This is more useful for a department chair who must build consensus.

**Grade: A** — Specific, strategic, and audience-aware steering.

---

### Cycle 2

**Current AI Output:** *(complete evaluation with decision framework)*

#### Judging Sub-step

Which issues remain?

- **(A)** The decision framework should include a timeline — when should the department make each decision, and what data should they collect during a pilot?
- **(B)** The report is too long and should be condensed
- **(C)** No significant issues remain — the evaluation matrix, evidence critique, and decision framework are comprehensive
- **(D)** The adaptive mechanism descriptions still need plain-language rewriting
- **(E)** The cost analysis should include hidden costs (IT support, faculty time, student help desk)

**Student selects: (A)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "The report is done, no changes needed"
- **(B)** "Add a pilot implementation timeline: specify what to measure during the pilot semester (DFW rate, student satisfaction, faculty experience, technical issues), when to collect each data point, and decision criteria for scaling up or abandoning the platform after the pilot."
- **(C)** "Rewrite the entire report in bullet points"
- **(D)** "Add a section comparing LMS platforms instead"
- **(E)** "Remove the evidence critique — it's too negative"

**Student selects: (B)**

#### Updated AI Output

*(Previous content retained, with addition:)*

**Pilot Implementation Timeline:**

| Phase | Timeframe | Activities | Data Collection |
|-------|-----------|-----------|-----------------|
| Preparation | 8 weeks before semester | Vendor contract, faculty training (2 instructors), LMS integration testing | Training completion, technical readiness checklist |
| Launch | Weeks 1-2 | Student onboarding, help desk setup, baseline DFW data from prior semesters | Student initial survey (technology comfort, expectations) |
| Midpoint Check | Week 7-8 | Faculty check-in, student focus group, usage analytics review | Platform usage rates, student satisfaction pulse survey, early grade distributions |
| End of Semester | Week 15-16 | Final grade comparison, full student survey, faculty debrief | DFW rates (pilot vs control sections), student satisfaction, faculty willingness to continue |
| Decision Point | 4 weeks post-semester | Department meeting with data presentation | Scale-up criteria: DFW reduction ≥ 3 pp, student satisfaction ≥ 65% positive, faculty willingness to continue |

#### Judging Feedback

**Criticism:** Identifying the missing timeline was a good instinct — a recommendation without an implementation path is incomplete. The student correctly recognized that the report needed to bridge from analysis to action. However, the student did not flag that the "adaptive mechanism" descriptions (Knowledge Space Theory, Bayesian knowledge tracing) are still somewhat jargon-heavy for a non-technical department chair. Option (D) addressed this.

**Better Alternative:** Options **(A)** and **(D)** both had merit — the timeline was more important for the overall deliverable, but the jargon issue affects readability.

**Grade: A** — Good strategic thinking about implementation planning, missed the jargon cleanup.

#### Steering Feedback

**Criticism:** Option (B) was well-structured and actionable. Specifying measurement points, data types, and decision criteria transforms the recommendation from "try a pilot" to a concrete plan with accountability. This is the kind of specificity a department chair needs to approve budget.

**Grade: A** — Strategic, specific, and practical steering.

---

### Cycle 3 (Final)

**Current AI Output:** *(complete evaluation with decision framework and pilot timeline)*

#### Judging Sub-step

Which issues remain?

- **(A)** The adaptive mechanism descriptions could use plainer language, but the overall report is comprehensive and actionable
- **(B)** The entire evaluation methodology is flawed
- **(C)** No issues remain — the report is ready for the department chair
- **(D)** The report needs more graphs and visuals
- **(E)** The pilot should be longer than one semester

**Student selects: (A)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | A     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The student demonstrated consistently strong performance across all three skills. Framing was excellent — decomposing "personalization," demanding peer-reviewed evidence, identifying the missing baseline, and anticipating implementation risks produced a comprehensive foundation. Judging was thorough: the student identified evidence quality concerns, missing criteria (accessibility, student experience), and the need for a decision framework rather than a single recommendation. The one recurring gap was attention to technical jargon and audience readability — the student consistently caught substantive issues but sometimes overlooked whether the document communicates clearly to its intended non-technical audience. Steering was the strongest skill: every correction was specific, actionable, and strategically targeted. The pilot timeline addition was particularly strong, transforming an analytical report into an actionable implementation plan. To improve, the student should add "Can my audience understand every term in this document?" as a standard review criterion.
