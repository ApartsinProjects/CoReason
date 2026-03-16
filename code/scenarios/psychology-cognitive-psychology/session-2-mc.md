# Session 2 — Cognitive Bias in Clinical Diagnosis (Multiple Choice)

**Challenge:** Decision-Making & Reasoning > Heuristics & Biases > Anchoring & Adjustment
**Mode:** Multiple Choice
**Student:** Priya S.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> A hospital network has noticed that emergency physicians "tend to fixate on the first diagnosis that comes to mind" and want to reduce diagnostic errors. Prepare a diagnostic audit report analyzing how cognitive biases affect clinical decision-making in the ER, plus a debiasing intervention plan. The report should cover "the most common biases," propose "practical fixes," and include a way to "measure whether the intervention works." The ER sees "thousands of patients monthly" with conditions ranging from "minor complaints to life-threatening emergencies." Some physicians have "30 years of experience" while others are residents.

### Framing Options Presented

Which assumptions and clarifications should you establish?

- **(A)** Focus only on anchoring bias since the problem statement describes it. Assume all physicians are equally affected. Propose a simple training workshop as the fix.
- **(B)** Cover anchoring, confirmation bias, availability bias, and premature closure. Define "diagnostic error" as any discrepancy between ER and final diagnosis. Constrain interventions to < 3 minutes per patient. No control group needed — just compare before and after.
- **(C)** Cover anchoring, confirmation bias, availability, and premature closure. Question whether "diagnostic error" includes provisional diagnoses that are revised with new information vs genuine errors given available data. Ask how expertise moderates bias. Constrain interventions to ER time pressure. Require controlled measurement design.
- **(D)** Cognitive biases are not the real problem — focus instead on system-level factors like staffing ratios and information technology. Biases are a distraction from the structural issues.
- **(E)** Don't define which biases to cover — let the AI determine the most relevant ones based on the ER context.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

**Diagnostic Audit Report**

**Bias Identification:**

| Bias | Mechanism | ER Example |
|------|-----------|------------|
| Anchoring | First information disproportionately weights diagnosis | Triage note "cardiac chest pain" locks in cardiac workup |
| Confirmation bias | Seeking confirming, ignoring disconfirming evidence | Ordering cardiac enzymes but not imaging for pulmonary embolism |
| Availability | Overweighting recently encountered diagnoses | Over-diagnosing flu during flu season when other causes fit |
| Premature closure | Stopping diagnostic search once a plausible hypothesis found | Abdominal pain → gastritis, missed appendicitis |

**Debiasing Interventions:**
1. Diagnostic time-out: "What else could this be?" — list 2 alternatives before finalizing
2. Red-flag symptom checklist for high-risk presentations
3. Monthly retrospective case review of diagnostic discrepancies

**Measurement:** Pre-post comparison of diagnostic discrepancy rate over 6 months

### Framing Feedback

**Criticism:** Option (B) covers the right biases and adds a practical time constraint, which is good. However, it defines diagnostic error too broadly (any discrepancy includes cases revised due to new information, not just genuine errors), does not question the expertise-bias interaction, and does not require a controlled design. Option (C) was stronger because it distinguished genuine errors from information-dependent revisions, raised the expertise moderation question, and demanded methodological rigor in the measurement plan.

**Better Alternative:** Option **(C)** — addresses the error definition ambiguity, expertise effects, and controlled measurement.

**Grade: B** — Right biases and practical constraints, but weak on measurement rigor and error definition.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's solution?

- **(A)** The four biases are wrong — the ER context is better explained by cognitive fatigue, not biases
- **(B)** The interventions lack evidence citations; the measurement is pre-post with no control; the biases are listed independently but actually form a cascade
- **(C)** The interventions lack evidence; the measurement has no control; biases are listed independently; the outcome measure conflates new-information revisions with genuine errors; no discussion of expertise moderation
- **(D)** The report needs more biases — at least 8-10 should be covered
- **(E)** The solution is comprehensive — no significant issues

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Add more biases to the list"
- **(B)** "Cite evidence for each intervention. Use a stepped-wedge RCT design instead of pre-post. Show how biases interact as a cascade through the diagnostic process. Distinguish error types: genuine errors (information available but missed) vs information-dependent revisions."
- **(C)** "Just add a control group"
- **(D)** "Replace the debiasing approach with an AI diagnostic system"
- **(E)** "Add a section on physician wellness and burnout"

**Student selects: (B)**

#### Updated AI Output

**Revised Bias Section — Diagnostic Reasoning Cascade:**

```
Hypothesis Generation → Availability + Anchoring
    ↓
Information Gathering → Confirmation bias
    ↓
Hypothesis Evaluation → Premature closure + base-rate neglect
    ↓
Final Diagnosis → Outcome bias (retrospective)
```

**Evidence-Based Interventions:**

| Intervention | Evidence | Limitation |
|-------------|----------|------------|
| Diagnostic time-out | Mamede et al. (2010): 40% error reduction in vignette study | Lab setting, not ER |
| Checklist | Sibbald et al. (2013): 10% accuracy gain for skin lesions | Domain-specific |
| Case review | Trowbridge (2008): improved self-reported awareness | No controlled outcome data |

**Revised Measurement: Stepped-Wedge RCT**
- 4 hospitals, intervention introduced sequentially
- Outcome: Type A revisions only (error given available information)
- Controls: seasonal variation, Hawthorne effect, case-mix severity

#### Judging Feedback

**Criticism:** The student selected the most comprehensive option — catching all five major issues. This was the strongest available choice and demonstrated thorough reading of the solution. Well done.

**Better Alternative:** Option **(C)** was already the best available.

**Grade: A** — Comprehensive issue identification.

#### Steering Feedback

**Criticism:** Option (B) was the best available — specific about the cascade structure, evidence citations, controlled design, and error type distinction. It packed multiple precise improvements into one well-organized instruction.

**Grade: A** — Excellent, multi-faceted correction.

---

### Cycle 2

**Current AI Output:** *(revised version with cascade, evidence, stepped-wedge design)*

#### Judging Sub-step

Which issues remain?

- **(A)** The cascade model is theoretically wrong — biases don't form chains
- **(B)** The interventions may affect experienced physicians and residents differently; the stepped-wedge design doesn't specify inter-rater reliability for error classification
- **(C)** The interventions may affect different expertise levels differently; error classification needs inter-rater reliability; debiasing interventions target only Stages 2-4 of the cascade with no intervention for Stage 1 (hypothesis generation)
- **(D)** The stepped-wedge design is too complex — a simple pre-post is fine
- **(E)** No remaining issues — the solution is complete

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Simplify the design to a pre-post comparison"
- **(B)** "Discuss whether the interventions affect experienced physicians and residents differently — expertise may moderate the debiasing effect. Specify inter-rater reliability (Cohen's kappa) for the Type A/B error classification, with blinded independent reviewers."
- **(C)** "Add a neuroimaging study to measure bias at the neural level"
- **(D)** "Replace the checklist with an AI-assisted diagnosis tool"
- **(E)** "Extend the follow-up period to 5 years"

**Student selects: (B)**

#### Updated AI Output

**Expertise Moderation Analysis:**
- Experienced physicians (>10 years): likely anchor via automated pattern recognition (System 1). Diagnostic time-out may be most beneficial — forces deliberate (System 2) review of initial pattern match. Risk: perceived as patronizing; compliance may be low.
- Residents (<3 years): likely anchor due to limited differential diagnosis repertoire. Structured checklists may be most beneficial — expands hypothesis space. Risk: over-reliance on checklist may inhibit development of pattern recognition.
- Recommendation: Stratify analysis by experience level; consider tailored intervention packages.

**Error Classification Reliability:**
- Two independent physician reviewers classify each revision as Type A or Type B
- Reviewers blinded to intervention status and hospital identity
- Inter-rater reliability: Cohen's kappa, target >= 0.70 (substantial agreement)
- Disagreements resolved by third reviewer

#### Judging Feedback

**Criticism:** The student caught the expertise moderation gap and the reliability specification — both important for the report's credibility. However, option (C) also identified that the current interventions only target Stages 2-4 of the diagnostic cascade, with nothing explicitly targeting Stage 1 (hypothesis generation, where availability bias operates). A structured differential diagnosis prompt at triage could address this gap.

**Better Alternative:** Option **(C)** — also catches the untargeted cascade stage.

**Grade: A** — Good catches, missed the intervention coverage gap.

#### Steering Feedback

**Criticism:** Option (B) was well-targeted — the expertise moderation discussion produced a nuanced analysis, and the reliability specification made the measurement plan more rigorous. Solid choices.

**Grade: A** — Specific and productive.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with expertise moderation and reliability specification)*

#### Judging Sub-step

Which issues remain?

- **(A)** No intervention targets Stage 1 of the cascade (hypothesis generation / availability bias)
- **(B)** The entire cascade model is wrong and needs to be replaced
- **(C)** The solution is sufficiently complete for the scope of this problem
- **(D)** The sample size across the 4 hospitals is too small
- **(E)** The report should include cost-effectiveness analysis

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

The student performed well across all phases, with particular strength in Cycle 1 judging where the most comprehensive option was correctly selected. Framing was reasonable but missed the error definition nuance and expertise moderation that were available in the stronger option. Judging was strong early and slightly declined — in Cycle 2 the student missed the untargeted cascade stage and in Cycle 3 accepted the solution without catching that gap. Steering was consistently excellent, with precise, multi-faceted corrections that drove substantial improvements. The student missed the Stage 1 intervention gap throughout — a reminder to check whether proposed solutions cover all stages of a model they themselves helped create.
