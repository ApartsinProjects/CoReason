# Session 2 — Evaluating Adaptive Learning Platforms for Undergraduate STEM (Open-Ended)

**Challenge:** Adaptive & Personalized Learning > Adaptive Learning Systems > Content Sequencing Algorithms
**Mode:** Open-Ended (Structured Sections)
**Student:** Marcus J.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Prepare an evaluation report comparing three adaptive learning platforms for use in a large-enrollment introductory chemistry course (800+ students across four sections). The department chair wants a platform that "personalizes the learning path" and "reduces the DFW rate." Faculty have "mixed feelings" about giving up control of content sequencing to an algorithm. The current course uses a traditional textbook and weekly problem sets. Budget is "tight but we can make a case if the evidence is strong." Deliver an evaluation matrix scoring each platform on at least eight criteria, a summary of the evidence base for adaptive learning in STEM, and a recommendation memo with implementation risks. The platforms to evaluate are "the major ones—you know which."

### Student's Framing Response

> **Assumption: The three platforms to compare are ALEKS (McGraw-Hill), Realizeit, and Knewton Alta — these are widely used adaptive platforms in STEM courses.**
>
> **Assumption: "Reduces the DFW rate" means the department wants evidence of improved pass rates, not just engagement metrics. I'll look for peer-reviewed studies, not just vendor white papers.**
>
> **Constraint: Budget is tight — I'll need to include per-student licensing cost as a criterion and compare against the current textbook cost.**
>
> **Question: "Mixed feelings about giving up control" suggests faculty autonomy is a key concern — I'll evaluate how much each platform allows instructors to override, resequence, or supplement the adaptive path.**

### AI Solution (Generated from Student's Framing)

**Evaluation Matrix:**

| Criterion | ALEKS | Realizeit | Knewton Alta |
|-----------|-------|-----------|-------------|
| Adaptive Model | Knowledge Space Theory | Rule-based mastery | Bayesian knowledge tracing |
| Content Coverage (Gen Chem) | Full course, publisher-aligned | Customizable, BYO content | Full course, OER-integrated |
| Instructor Override | Limited — preset knowledge map | High — instructor can modify paths | Moderate — can adjust topic weights |
| LMS Integration | Canvas, Blackboard (LTI) | LTI 1.3, full gradebook sync | LTI 1.3, Canvas native |
| Per-Student Cost | ~$45/semester | ~$35/semester (varies by contract) | ~$40/semester (with OER) |
| Evidence Base | Multiple published RCTs in STEM | Limited peer-reviewed studies | Some quasi-experimental studies |
| Analytics Dashboard | Student-level knowledge state | Detailed learning path visualization | Aggregate and individual reports |
| Accessibility (WCAG 2.1) | Partial compliance | Full compliance claimed | Partial compliance |

**Evidence Summary:**
Adaptive learning in STEM has shown modest improvements in pass rates (2-7 percentage points) in several quasi-experimental studies. ALEKS has the strongest evidence base with multiple published studies in chemistry. However, most studies have methodological limitations including selection bias, Hawthorne effects, and confounds with other course redesign changes implemented simultaneously.

**Recommendation:** ALEKS is recommended based on the strongest evidence base and full general chemistry content coverage, despite higher cost and limited instructor override capability.

### Framing Feedback

**Criticism:** The student made a strong move by naming specific platforms and demanding peer-reviewed evidence rather than vendor claims. The faculty autonomy concern was well-identified. However, the student did not question what "personalization" means in each platform — is it content sequencing, difficulty adjustment, pacing, or all three? Without defining this, the evaluation compares platforms on different dimensions. The student also did not address implementation risks beyond cost: faculty training time, student onboarding, technical support, and what happens if the platform is discontinued. Additionally, the student did not ask about the current DFW rate baseline — without knowing whether it's 15% or 40%, the feasibility of "reducing" it changes dramatically.

**Better Alternative Framing:**
> "Assumption: Platforms are ALEKS, Realizeit, and Knewton Alta. Constraint: 'Personalization' needs to be decomposed — does it mean content sequencing, difficulty adaptation, pacing, or remediation routing? Each platform may do different things. Question: What is the current DFW rate? A 30% DFW rate has more room for improvement than a 12% rate. Constraint: Evidence must be peer-reviewed with adequate comparison groups. Question: What faculty training and support infrastructure exists? Adoption failure is more often a people problem than a technology problem."

**Grade: A** — Strong platform selection and evidence standards, but missed key definitional and implementation questions.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "Evidence summary is too vague — need specific studies, sample sizes, effect sizes"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Fix: Add a footnote to all cost figures indicating they"
    description: "Fix: Add a footnote to all cost figures indicating they are estimates subject to institutional negotiation, and add a column for"
  - name: "Revise: Expand the evidence summary to cite at least 3"
    description: "Revise: Expand the evidence summary to cite at least 3 specific studies with sample sizes, effect sizes, and methodological limitations. Clearly distinguish vendor-funded from independent research."
  - name: "Revise: The recommendation must address the ALEKS"
    description: "Revise: The recommendation must address the ALEKS instructor-override limitation directly, since faculty autonomy was identified as a key concern. Either propose mitigation strategies or reconsider the recommendation."

#### Updated AI Output

**Revised Evaluation Matrix (cost section):**

| Criterion | ALEKS | Realizeit | Knewton Alta |
|-----------|-------|-----------|-------------|
| Per-Student Cost* | ~$45/semester | ~$35/semester | ~$40/semester |
| Total Cost (800 students/sem)* | ~$36,000 | ~$28,000 | ~$32,000 |
| Current Textbook Cost | ~$120/student (~$96,000/sem) | Same baseline | Same baseline |
| Net Savings vs Textbook* | ~$60,000/sem | ~$68,000/sem | ~$64,000/sem |

*All costs are estimates; actual pricing depends on institutional contract negotiation, multi-year commitments, and bundling with other publisher products.*

**Expanded Evidence Summary:**

1. **Falmagne et al. (2013)** — ALEKS in general chemistry at a large public university. N = 1,200 (600 ALEKS, 600 traditional). DFW rate dropped from 28% to 22% (6 pp). Quasi-experimental, non-randomized. Funded by McGraw-Hill.

2. **Griff & Matter (2013)** — ALEKS in introductory chemistry. N = 450. Pass rate improved by 4 percentage points. Single-institution, no control for instructor effects. Independent study.

3. **Essa & Ayad (2012)** — Realizeit platform in a STEM course. N = 280. Students using adaptive pathway scored 8% higher on final exam. Small sample, single section, platform-developer as co-author.

**Methodological caution:** No large-scale RCTs exist for any platform in general chemistry specifically. Most studies confound platform effects with concurrent course redesign efforts (flipped classroom, increased practice problems, etc.).

**Revised Recommendation:**

ALEKS has the strongest evidence base but presents a faculty autonomy risk. Two mitigation strategies:
1. **Hybrid model:** Use ALEKS for homework/practice (where algorithmic sequencing adds value) but retain instructor control over lecture sequencing, exam content, and supplementary materials.
2. **Pilot before full adoption:** Run a one-section pilot (200 students) alongside three traditional sections to generate institution-specific evidence before committing all 800 students.

If faculty autonomy is the overriding concern, Realizeit offers the most instructor control but has the weakest evidence base — a tradeoff the department must weigh explicitly.

#### Judging Feedback

**Criticism:** The student identified three genuine issues: the cost precision problem, the vague evidence summary, and the recommendation-autonomy contradiction. These are all important for a document going to a department chair. However, the student did not flag that the AI's evaluation matrix treats "Adaptive Model" as a criterion but never explains what the differences between Knowledge Space Theory, rule-based mastery, and Bayesian knowledge tracing mean for student experience or outcomes. A department chair reading "Bayesian knowledge tracing" gains no useful information. The student also missed that accessibility compliance ("partial" vs "full") is a legal requirement, not just a nice-to-have criterion, and should be weighted differently.

**Better Alternative Judgement:**
> "Error: Cost figures presented as fixed; need ranges and contract context. Gap: Evidence summary is too vague — need specific studies, sample sizes, effect sizes. Gap: Recommendation ignores the faculty autonomy concern despite ALEKS scoring lowest on override. Gap: 'Adaptive Model' row lists technical names without explaining what they mean for teaching and learning. Error: Accessibility compliance is a legal requirement and should be a pass/fail gate, not a scored criterion."

**Grade: A** — Caught three important issues, missed technical jargon problem and accessibility legal concern.

#### Steering Feedback

**Criticism:** The steering was precise and well-structured — three distinct corrections, each targeting a specific identified issue. The cost footnote, cited evidence, and autonomy-aware recommendation were all specific enough to produce actionable AI output. The student could have also addressed the jargon and accessibility issues.

**Grade: A** — Well-targeted corrections that drove substantive improvement.

---

### Cycle 2

**Current AI Output:** *(revised matrix with costs, cited evidence, and autonomy-aware recommendation)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "No student experience or satisfaction criterion"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "The plain-language rewrite request was the right"
    description: "The plain-language rewrite request was the right instinct, and the example provided ('Diagnoses what students know...') gave the AI a clear model to follow. Adding student satisfaction data was a prac"
  - name: "The plain-language rewrite request was the right"
    description: "The plain-language rewrite request was the right instinct, and the example provided ('Diagnoses what students know...') gave the AI a clear model to follow. Adding student satisfaction data was a prac"

#### Updated AI Output

**Revised Rows:**

| Criterion | ALEKS | Realizeit | Knewton Alta |
|-----------|-------|-----------|-------------|
| How It Adapts (Student View) | Diagnoses knowledge gaps with an initial assessment, then assigns targeted problems to fill gaps; students work on individualized problem queues that update as mastery is demonstrated | Instructor defines learning paths with branching; system routes students through alternative explanations and practice based on quiz performance at each node | Estimates what each student knows using response patterns, then selects the next problem to maximize learning efficiency; feels like a smart problem set that adjusts difficulty |
| Student Experience | Primarily drill-and-practice with progress pie chart; students report it feels "repetitive but effective" | More varied — includes readings, videos, and practice in instructor-designed sequences; interface varies by implementation | Clean interface with textbook integration; adaptive problem sets embedded in reading flow; students report it feels "like homework with hints" |
| Student Satisfaction Data | Mixed reviews in published studies; some students value self-pacing, others find the pie chart discouraging when progress is slow | Limited published data; one study reports 72% positive ratings | One study reports students preferred it to traditional homework (68% vs 45% satisfaction) |

#### Judging Feedback

**Criticism:** The student's identification of the jargon problem and the missing student experience dimension were both excellent observations — these directly affect whether a department chair can make an informed decision and whether students will actually use the platform. The student is showing growth from Cycle 1 by looking beyond the data quality issues to the communication and adoption concerns. However, the student did not flag that the accessibility row still says "partial compliance" for two platforms without specifying which WCAG criteria fail or what accommodations would be needed for students with disabilities.

**Better Alternative Judgement:**
> "Gap: Adaptive model descriptions are jargon-heavy and meaningless to a non-technical audience. Gap: No student experience or satisfaction criterion. Gap: Accessibility 'partial compliance' needs specifics — which WCAG 2.1 criteria fail, and what does that mean for students using screen readers or other assistive technology?"

**Grade: A** — Strong observations on communication and adoption, missed accessibility specifics.

#### Steering Feedback

**Criticism:** The plain-language rewrite request was the right instinct, and the example provided ("Diagnoses what students know...") gave the AI a clear model to follow. Adding student satisfaction data was a practical addition. The student is steering toward a more usable document.

**Grade: A** — Effective and well-exemplified steering.

---

### Cycle 3 (Final)

**Current AI Output:** *(complete evaluation with plain-language descriptions and student experience data)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor gap: Accessibility details could be more specific"
    description: "Minor gap: Accessibility details could be more specific, but the matrix and recommendation are now comprehensive and readable by a department chair. The deliverable includes: evaluation matrix with costs, plain-language adaptive model descriptions, student experience, cited evidence summary with methodological caveats, and a nuanced recommendation addressing faculty autonomy. This is ready for review."

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

The student demonstrated strong critical thinking about evidence quality — insisting on peer-reviewed studies over vendor claims and catching the vague evidence summary were standout moves. Framing was solid with specific platform identification and faculty autonomy awareness, but missed key definitional questions (what does "personalization" mean in each platform?) and baseline data needs (current DFW rate). In judging, the student consistently found important issues — cost precision, evidence vagueness, jargon inaccessibility, missing student perspective — but repeatedly missed the accessibility dimension, which is both a legal requirement and an equity concern. Steering was effective throughout: corrections were specific, well-exemplified (especially the plain-language rewrite), and drove meaningful improvements in each cycle. To improve, the student should develop a mental checklist that includes accessibility and equity considerations alongside evidence quality and usability concerns.
