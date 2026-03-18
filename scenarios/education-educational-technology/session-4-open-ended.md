# Session 4 — Designing Technology-Enhanced Assessments for Critical Thinking (Open-Ended)

**Challenge:** Assessment & Evaluation with Technology > Digital Assessment Design > Item Types & Constructive Alignment
**Mode:** Open-Ended (Structured Sections)
**Student:** David C.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a suite of technology-enhanced assessment items for a first-year undergraduate "Introduction to Environmental Science" course. The course coordinator wants to move beyond multiple-choice exams and "actually measure whether students can think critically about environmental data." The course has 350 students, two TAs, and exams are currently administered on paper in a large lecture hall. The coordinator wants assessments that "use technology meaningfully, not just digitize paper tests." Students should analyze real datasets, interpret graphs, and construct evidence-based arguments. Deliver a set of 10 prototype assessment items across at least four different technology-enhanced item types, a scoring guide for each, and a feasibility analysis covering platform requirements, grading workload, and academic integrity considerations.

### Student's Framing Response

> **Assumption: The assessment platform is something like Canvas Quizzes or a dedicated tool like Respondus — whatever the university already uses for large-enrollment courses.**
>
> **Assumption: "Critical thinking about environmental data" means students should be able to interpret data visualizations, identify trends, evaluate claims against evidence, and construct short arguments — corresponding roughly to Bloom's Analyze and Evaluate levels.**
>
> **Constraint: 350 students with 2 TAs means grading capacity is severely limited. Any constructed-response items need to be short (1-3 sentences) or semi-automated.**
>
> **Question: What datasets are available? I'll assume publicly available environmental datasets (EPA, NOAA, World Bank) can be used in assessment items.**

### AI Solution (Generated from Student's Framing)

**10 Prototype Assessment Items:**

**Type 1: Interactive Data Interpretation (3 items)**

*Item 1:* Students view an interactive graph of CO2 emissions by country (2000-2023). They can filter by region and toggle per-capita vs absolute views. Question: "Which region shows the largest increase in per-capita emissions since 2010? Select the region and provide one sentence explaining what the data shows." (Select + short text)

*Item 2:* Students receive a scatter plot of GDP vs carbon emissions for 50 countries. An outlier country is highlighted. Question: "Explain why this country might be an outlier. Name at least two factors not visible in the data that could explain the pattern." (Short constructed response)

*Item 3:* Students view a time-series of ocean temperature anomalies. Question: "A climate skeptic claims this data shows 'no real warming trend.' Evaluate this claim using the data. Identify at least one statistical feature of the graph that supports or refutes the claim." (Constructed response)

**Type 2: Drag-and-Drop Causal Mapping (2 items)**

*Item 4:* Students drag environmental factors (deforestation, urbanization, agricultural runoff, etc.) onto a causal web connecting them to observed outcomes (biodiversity loss, water quality decline). Scoring: correct placements counted. (Auto-scored)

*Item 5:* Students arrange steps in an environmental impact assessment process into the correct sequence. (Auto-scored)

**Type 3: Simulation-Based Scenario (2 items)**

*Item 6:* Students use a simplified ecosystem simulation. They adjust parameters (fishing quotas, pollution levels) and observe outcomes over 10 simulated years. Question: "Set parameters to achieve a sustainable fish population. Record your final settings and explain why you chose them." (Settings + constructed response)

*Item 7:* Students run a water treatment simulation, selecting filtration methods for different contaminants. Question: "Which combination achieves the regulatory standard at the lowest cost? Show your reasoning." (Selections + short justification)

**Type 4: Evidence-Based Argumentation (3 items)**

*Item 8:* Students receive two conflicting studies about pesticide impacts on pollinators. Question: "Which study provides stronger evidence? Evaluate each study's methodology and identify one strength and one limitation of each." (Structured response: 4 boxes)

*Item 9:* Students read a policy proposal for a carbon tax and a dataset of economic projections. Question: "Write a 150-word evidence-based argument for or against the policy, citing at least two data points." (Constructed response)

*Item 10:* Students review an environmental impact statement with a data table. Question: "The report concludes the project will have 'minimal environmental impact.' Identify two weaknesses in the report's reasoning or data that undermine this conclusion." (Constructed response)

**Scoring Guides:**
- Auto-scored items (4, 5): correct placement/sequence = full credit
- Short constructed response items (1, 2, 6, 7): rubric with 3 levels (complete, partial, inadequate) — TA grading ~2 min per response
- Extended constructed response items (3, 8, 9, 10): rubric with 4 levels — TA grading ~4 min per response

**Feasibility Analysis:**
- Platform: Canvas Quizzes for auto-scored items; separate submission portal for constructed responses
- Grading workload: 6 constructed-response items x 350 students x ~3 min avg = ~105 hours of TA grading per exam
- Academic integrity: items use unique dataset views to reduce copying; time limits per section

### Framing Feedback

**Criticism:** The student made important practical observations — the Bloom's alignment, grading capacity constraint, and data source question were all relevant. However, the student did not address constructive alignment: before designing items, the course learning outcomes need to be stated explicitly, and each item should map to a specific outcome. The student also did not question accessibility — 350 students will include some with disabilities requiring screen reader compatibility, extended time, or alternative input methods, and not all technology-enhanced item types work with assistive technology. Finally, the student assumed a platform ("whatever the university uses") without considering whether the required item types (simulations, interactive graphs) exceed the capabilities of standard LMS quiz tools.

**Better Alternative Framing:**
> "Constraint: Before designing items, I need the course learning outcomes — each item must map to a specific outcome at a specific Bloom's level to ensure constructive alignment. Question: Which assessment platform supports interactive data visualizations and simulations? Standard LMS quizzes (Canvas, Blackboard) may not support these item types natively. Constraint: Accessibility is non-negotiable for 350 students — I need to verify that each item type is compatible with screen readers, keyboard navigation, and extended time accommodations. Constraint: With 350 students and 2 TAs, constructed response grading time must be calculated explicitly and kept under [X] hours per exam."

**Grade: B** — Good scale awareness, but missed constructive alignment, accessibility, and platform capability questions.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "AI-response risk is unaddressed for constructed-response items"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Fix: Rebalance the item mix to reduce TA grading to"
    description: "Fix: Rebalance the item mix to reduce TA grading to under 20 hours per exam total. Increase auto-scored items (more drag-and-drop, data selection, matching). Keep no more than 3 constructed-response items, and make those short (1-3 sentences) with structured rubrics that allow for rapid scoring."
  - name: "Fix: Address AI-generated response risk specifically"
    description: "Fix: Address AI-generated response risk specifically. For constructed-response items, propose at least one design feature that makes AI generation harder or detectable (e.g., requiring reference to specific data points visible only in the assessment, in-class vs take-home administration)."
  - name: "Fix: Either specify a platform that supports simulation"
    description: "Fix: Either specify a platform that supports simulation embedding (e.g., external tool like PhET with LTI integration, or a purpose-built assessment platform like Möbius) or redesign the simulation items as static scenario-based questions that work in a standard quiz tool."

#### Updated AI Output

**Rebalanced Item Mix (10 items):**

| # | Item Type | Scoring | Est. Grading Time (per student) |
|---|-----------|---------|-------------------------------|
| 1 | Interactive graph selection + 1-sentence explanation | Semi-auto (selection auto, sentence = 1 min TA) | 1 min |
| 2 | Drag-and-drop causal web | Auto-scored | 0 min |
| 3 | Sequence ordering (EIA process) | Auto-scored | 0 min |
| 4 | Data matching (pollutant → environmental effect) | Auto-scored | 0 min |
| 5 | Multi-select: identify valid conclusions from a data table | Auto-scored | 0 min |
| 6 | Hotspot: click on the graph feature that supports/refutes a claim | Auto-scored | 0 min |
| 7 | Scenario-based MC: given simulation parameters, predict the outcome | Auto-scored | 0 min |
| 8 | Two conflicting studies: structured response (4 boxes, 1 sentence each) | TA-graded, ~2 min | 2 min |
| 9 | Evidence-based argument (100 words, must cite 2 specific data points from the provided table) | TA-graded, ~3 min | 3 min |
| 10 | Identify 2 weaknesses in a report's reasoning (structured: 2 boxes, 2 sentences each) | TA-graded, ~2 min | 2 min |

**Total TA Grading Time:** Items 1, 8, 9, 10 = ~8 min per student x 350 students = 46.7 hours / 2 TAs = **23.3 hours each per exam.** (Further reducible by grading item 1 auto with keyword matching.)

**AI-Response Mitigation:**
1. Constructed-response items require reference to specific data points visible ONLY in the assessment-embedded dataset (not publicly searchable) — AI tools cannot access this data during the exam.
2. Item 9's argument must cite row/column numbers from the provided table — fabricated citations are immediately identifiable.
3. In-class administration with lockdown browser for the auto-scored portion; constructed responses can be take-home but require an in-class oral defense for a random 10% sample.

**Platform Recommendation:**
- Auto-scored items: Canvas New Quizzes (supports hotspot, drag-and-drop, matching, multi-select)
- Constructed response: Canvas Assignments with SpeedGrader rubrics
- Simulation items redesigned as static scenarios: instead of running a simulation, students read the simulation output (a table of results for 5 parameter combinations) and answer questions about it

#### Judging Feedback

**Criticism:** The student identified three critical issues — the grading workload infeasibility, AI-response risk, and platform capability gap for simulations. Each was a genuine showstopper that the AI glossed over. This is strong practical reasoning. However, the student did not flag that the item scoring guides lack exemplar responses — without examples of what a "complete," "partial," and "inadequate" response looks like, TA grading will be inconsistent across 350 students. The student also did not raise accessibility, which remains unaddressed.

**Better Alternative Judgement:**
> "Error: 105 hours of TA grading per exam is infeasible — need to rebalance toward auto-scored items. Gap: AI-response risk is unaddressed for constructed-response items. Gap: Simulations require a platform not available in standard LMS tools. Gap: Scoring guides lack exemplar responses for TA calibration. Gap: No accessibility analysis for any item type."

**Grade: A** — Strong feasibility analysis, missed scoring exemplars and accessibility.

#### Steering Feedback

**Criticism:** The steering was excellent — three specific, actionable corrections that each addressed a genuine problem. The grading time target ("under 20 hours per exam total") was concrete. The AI-response mitigation suggestion (reference to assessment-embedded data) was creative and practical. Redesigning simulations as static scenarios was a pragmatic solution. The student could have also addressed scoring consistency and accessibility.

**Grade: A** — Precise, practical, and well-targeted corrections.

---

### Cycle 2

**Current AI Output:** *(rebalanced items, AI mitigation, platform recommendation)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: The 3 TA-graded items (8, 9, 10) have rubric levels"
    description: "Gap: The 3 TA-graded items (8, 9, 10) have rubric levels (complete, partial, inadequate) but no exemplar student responses. Without exemplars, two TAs grading 350 students will apply the rubric inconsistently. Need anchor examples at each scoring level. Gap: The grading time is now 23.3 hours per TA per exam — still high but more reasonable. However, there's no mention of a TA calibration session where both TAs grade the same sample and compare scores before starting."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: For each of the 3 TA-graded items, provide one"
    description: "Add: For each of the 3 TA-graded items, provide one exemplar student response at each rubric level (complete, partial, inadequate) with annotations explaining why it receives that score. These exemplars will serve as anchor points for TA calibration."
  - name: "Add: Include a TA calibration protocol"
    description: "Add: Include a TA calibration protocol — before grading begins, both TAs independently grade the same 10 student responses, compare scores, discuss discrepancies, and align on scoring standards. Estimate: 2 hours for calibration session."

#### Updated AI Output

**Exemplar Responses for Item 9 (Evidence-Based Argument):**

*Complete (Full Credit):*
> "The proposed carbon tax would likely reduce emissions by 12-18% based on the elasticity estimates in Table 2 (rows 3-4). However, the economic projections in Column D show GDP impact varies from -0.3% to -1.2% depending on revenue recycling — the tax should include rebates to offset regressive effects on lower-income groups (Table 3, row 7)."
*Annotation: Cites two specific data points by table/row, connects data to a reasoned conclusion, addresses a counterargument.*

*Partial (Half Credit):*
> "The carbon tax would reduce emissions because it makes pollution more expensive. The data shows other countries had lower emissions after implementing similar taxes."
*Annotation: Makes a relevant claim but references are vague ('the data shows') without citing specific data points. No counterargument addressed.*

*Inadequate (No Credit):*
> "Carbon taxes are bad for the economy and hurt businesses. The government shouldn't interfere with the free market."
*Annotation: Opinion without evidence. No reference to the provided dataset. Does not meet the requirement to cite data points.*

*(Similar exemplars provided for items 8 and 10.)*

**TA Calibration Protocol:**
1. Both TAs independently grade the same 10 responses for each of the 3 constructed-response items (30 total responses)
2. Compare scores — target: 80%+ exact agreement
3. Discuss all discrepancies and document resolution decisions
4. Re-grade 5 responses to verify alignment
5. Estimated time: 2 hours (recommended: week before grading begins)
6. Mid-grading check: after each TA has graded 50 responses, swap 10 for cross-checking

#### Judging Feedback

**Criticism:** The student identified two genuine quality concerns — exemplar responses and TA calibration. Both are essential for reliable scoring at scale. The exemplar request was specific enough to produce useful anchor responses. The calibration protocol request was well-scoped. However, the student still has not addressed accessibility. For a 350-student course, this is not optional — it is a legal and institutional requirement. The student should have flagged that hotspot items (Item 6) are inaccessible to screen reader users and require an alternative format.

**Better Alternative Judgement:**
> "Gap: No exemplar responses for TA calibration. Gap: No inter-rater reliability protocol. Gap: Item 6 (hotspot) is inaccessible to screen reader users. Gap: No mention of extended-time accommodations for timed items."

**Grade: B** — Good scoring quality concerns, but accessibility remains a persistent blind spot.

#### Steering Feedback

**Criticism:** The exemplar request was well-specified — asking for one response at each rubric level with annotations. The calibration protocol request included a concrete agreement target (80%) and a mid-grading cross-check, showing awareness of real-world grading drift. These were effective corrections.

**Grade: A** — Specific and practical, missed accessibility.

---

### Cycle 3 (Final)

**Current AI Output:** *(rebalanced items, AI mitigation, exemplars, calibration protocol)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Remaining gap: Accessibility has not been addressed"
    description: "Remaining gap: Accessibility has not been addressed. Item 6 (hotspot) won't work for screen reader users, and timed sections need extended-time accommodation options. But the core deliverable — 10 items, scoring guides with exemplars, feasibility analysis, AI mitigation — is comprehensive. Overall the assessment suite is substantially improved and feasible for the stated scale."

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

The student demonstrated strong practical reasoning — the grading workload calculation catch was the session's standout moment, identifying a genuine showstopper that would have made the assessment suite unimplementable. The AI-response risk identification and platform capability gap were also well-observed. Framing was the weakest area: the student did not establish constructive alignment (mapping items to learning outcomes) or raise accessibility, both of which are fundamental to assessment design. Accessibility remained a blind spot throughout all three cycles, surfacing only in the final reflection. In judging, the student found critical issues reliably but consistently missed this dimension. Steering was strong — corrections were specific, quantified (grading time targets, calibration agreement rates), and produced actionable improvements. The exemplar responses and calibration protocol significantly improved the deliverable's practical value. To improve, the student should internalize accessibility as a default review criterion for any technology-enhanced design, not an afterthought.
