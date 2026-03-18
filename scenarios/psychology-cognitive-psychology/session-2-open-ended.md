# Session 2 — Cognitive Bias in Clinical Diagnosis (Open-Ended)

**Challenge:** Decision-Making & Reasoning > Heuristics & Biases > Anchoring & Adjustment
**Mode:** Open-Ended (Structured Sections)
**Student:** Daan W.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> A hospital network has noticed that emergency physicians "tend to fixate on the first diagnosis that comes to mind" and want to reduce diagnostic errors. Prepare a diagnostic audit report analyzing how cognitive biases affect clinical decision-making in the ER, plus a debiasing intervention plan. The report should cover "the most common biases," propose "practical fixes," and include a way to "measure whether the intervention works." The ER sees "thousands of patients monthly" with conditions ranging from "minor complaints to life-threatening emergencies." Some physicians have "30 years of experience" while others are residents.

### Student's Framing Response

> **Assumption: "Fixating on the first diagnosis" describes anchoring bias — the initial hypothesis disproportionately influences subsequent reasoning.**
>
> **Assumption: "Diagnostic error" means a discrepancy between the ER diagnosis and a later confirmed diagnosis (e.g., from follow-up or autopsy).**
>
> **Question: The problem says "most common biases" but doesn't specify how commonness is determined. I'll focus on biases with the strongest empirical evidence in medical decision-making: anchoring, confirmation bias, availability bias, and premature closure.**
>
> **Constraint: Any intervention must be implementable without adding more than 2-3 minutes per patient encounter, given ER time pressure.**

### AI Solution (Generated from Student's Framing)

**Diagnostic Audit Report: Cognitive Biases in Emergency Medicine**

**Section 1: Bias Identification**

| Bias | Mechanism | ER Example |
|------|-----------|------------|
| Anchoring | First piece of information disproportionately weights diagnosis | Triage note says "chest pain — cardiac" and physician pursues cardiac workup despite atypical presentation |
| Confirmation bias | Seeking evidence that confirms initial hypothesis, ignoring disconfirming evidence | Ordering tests that confirm suspected diagnosis, not ordering tests that could rule it out |
| Availability bias | Overweighting diagnoses that come easily to mind (recent cases, dramatic outcomes) | After treating a rare aortic dissection, over-diagnosing it in subsequent chest pain patients |
| Premature closure | Accepting a diagnosis before sufficient evidence, stopping the search | Patient with abdominal pain diagnosed with gastritis; missed appendicitis |

**Section 2: Debiasing Intervention Plan**
1. **Diagnostic time-out:** Before finalizing diagnosis, physician states: "What else could this be?" and lists 2 alternative diagnoses (30 seconds)
2. **Structured checklist:** Red-flag symptoms checklist for high-risk presentations (chest pain, abdominal pain, headache)
3. **Monthly case review:** Retrospective review of cases where initial ER diagnosis was later changed

**Section 3: Measurement Plan**
- Outcome: Diagnostic discrepancy rate (ER diagnosis vs confirmed diagnosis at discharge/follow-up)
- Comparison: 6-month pre-intervention baseline vs 6-month post-intervention period
- Data source: Electronic health records, linked ER and inpatient diagnoses

### Framing Feedback

**Criticism:** The student correctly identified anchoring as the primary bias described in the prompt and selected a defensible set of biases with good empirical support. The time constraint recognition was practical and important. However, the student did not question whether diagnostic error is always the result of bias — some errors arise from information unavailability, atypical disease presentation, or system failures, not cognitive shortcuts. The student also did not address the interaction between expertise and bias: experienced physicians may rely on pattern recognition (System 1) that is usually accurate but fails in atypical cases, while residents may anchor because they have fewer competing hypotheses. Finally, the student defined "diagnostic error" without acknowledging that many ER diagnoses are intentionally provisional — a discrepancy with a later diagnosis does not necessarily indicate an error.

**Better Alternative Framing:**
> "Assumption: Anchoring is the primary bias described, but the audit should also screen for confirmation bias, availability, and premature closure. Question: Does 'diagnostic error' mean any discrepancy between ER and final diagnosis, or only cases where available information at the time should have led to a different conclusion? This distinction matters because ER diagnoses are often provisional by design. Question: How does expertise interact with bias? Veterans may anchor via entrenched pattern recognition; residents may anchor via limited differential diagnosis range. Constraint: Intervention must add < 3 minutes per encounter."

**Grade: B** — Solid bias identification and practical awareness, but did not question the error definition or expertise-bias interaction.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error"
    description: "Measurement plan has no control group"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Revise: For each debiasing intervention, cite at least"
    description: "Revise: For each debiasing intervention, cite at least one empirical study that tested it in a clinical setting and state the effect size or outcome. If no direct evidence exists, acknowledge this and state the theoretical rationale."
  - name: "Fix: Redesign the measurement plan to include a comparison"
    description: "Fix: Redesign the measurement plan to include a comparison — either a stepped-wedge design across hospitals or a concurrent control site. Address how you'll control for Hawthorne effects and seasonal variation."

#### Updated AI Output

**Revised Debiasing Intervention Plan:**

| Intervention | Evidence | Effect |
|-------------|----------|--------|
| Diagnostic time-out ("What else could this be?") | Mamede et al. (2010): forced consideration of alternatives reduced diagnostic error by 40% in a case-vignette study with residents | Lab-based; limited real-world ER validation |
| Structured checklist | Sibbald et al. (2013): analytical checklists improved diagnostic accuracy for skin lesions by 10% but slowed decisions | Domain-specific; may not generalize across ER presentations |
| Monthly case review | Trowbridge (2008): cognitive autopsies of error cases improved self-reported diagnostic awareness, no controlled outcome data | No RCT evidence; relies on self-report |

**Revised Measurement Plan:**
- Design: Stepped-wedge cluster RCT across 4 hospitals
- Phase-in: Intervention introduced sequentially to one hospital per quarter
- Primary outcome: Rate of diagnostic revision within 48 hours (proxy for initial diagnostic error)
- Controls for: seasonal variation (time fixed effects), Hawthorne effect (attention control at non-intervention sites), case-mix (severity-adjusted analysis)
- Data: EHR linkage of ER diagnosis codes to subsequent inpatient or follow-up diagnosis codes

#### Judging Feedback

**Criticism:** The student identified two critical weaknesses — the evidence gap for interventions and the uncontrolled measurement design. Both are serious issues that would undermine the report's credibility. However, the student did not notice that the AI's bias table describes each bias in isolation without discussing how biases interact. In clinical reasoning, anchoring often triggers confirmation bias (anchored on a diagnosis, then selectively seeking confirming evidence). The student also missed that the AI describes premature closure separately from anchoring, but in practice premature closure is often the downstream consequence of anchoring. The conceptual overlap between these biases needs to be addressed.

**Better Alternative Judgement:**
> "Gap: Interventions lack evidence citations. Error: Measurement plan has no control group. Gap: Biases are described in isolation — anchoring triggers confirmation bias, and premature closure is often the consequence of anchoring. The report should map the causal chain between biases, not list them independently."

**Grade: A** — Caught the two most actionable problems, missed the bias-interaction issue.

#### Steering Feedback

**Criticism:** The steering was excellent — requesting evidence citations with effect sizes and a controlled measurement design are exactly the right improvements. The specification of a stepped-wedge design was particularly sophisticated. The student could have also asked for a bias interaction analysis.

**Grade: A** — Specific, methodologically sophisticated, and productive.

---

### Cycle 2

**Current AI Output:** *(revised version with evidence citations and stepped-wedge design)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "Diagnostic revision measure conflates error with new information — need to distinguish types"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Revise: Restructure the bias section to show how biases"
    description: "Revise: Restructure the bias section to show how biases interact in a diagnostic reasoning chain — e.g., anchoring → confirmation bias → premature closure — rather than listing them independently. Use a flowchart or staged model."
  - name: "Clarify: Discuss the limitations of"
    description: "Clarify: Discuss the limitations of"

#### Updated AI Output

**Revised Bias Section: Diagnostic Reasoning Cascade**

```
Stage 1: Hypothesis Generation
  → Availability bias: hypotheses that come to mind easily dominate
  → Anchoring: first hypothesis receives disproportionate weight

Stage 2: Information Gathering
  → Confirmation bias: tests ordered to confirm anchor, not to disconfirm
  → Anchoring persists: new information assimilated into existing frame

Stage 3: Hypothesis Evaluation
  → Premature closure: search stops once anchor reaches subjective threshold
  → Base-rate neglect: rare diagnoses dismissed despite fitting evidence

Stage 4: Final Diagnosis
  → Outcome bias (retrospective): if patient improves, initial diagnosis
    "confirmed" regardless of accuracy
```

Each debiasing intervention maps to a specific stage:
- Diagnostic time-out → targets Stage 3 (forces continued search)
- Structured checklist → targets Stage 2 (expands information gathering)
- Case review → targets Stage 4 (retrospective calibration)

**Outcome Measure Refinement:**
"Diagnostic revision" is classified into:
- **Type A revision (error-indicating):** Initial diagnosis changed despite all relevant information being available at time of ER visit (e.g., missed fracture visible on initial X-ray)
- **Type B revision (information-dependent):** Diagnosis changed because of new information unavailable at ER visit (e.g., culture results, specialist consultation)
- Primary outcome: Type A revision rate only
- Classification: Two independent physician reviewers with blinding to intervention status; inter-rater reliability (Cohen's kappa) reported

#### Judging Feedback

**Criticism:** The student now addressed the bias-interaction problem and the outcome measure validity — both important improvements. The cascade model request was particularly insightful. However, the student did not question whether the debiasing interventions might have differential effects across expertise levels — the "diagnostic time-out" might help residents (who have limited differentials) but annoy or slow down experts (whose pattern recognition is usually accurate). The report should acknowledge this moderation.

**Better Alternative Judgement:**
> "Gap: Biases described independently — need a cascade model. Gap: Diagnostic revision measure conflates error with new information — need to distinguish types. Gap: Interventions may work differently for experienced physicians vs residents — expertise should moderate the effect."

**Grade: A** — Strong conceptual improvement requests. Missed the expertise moderation.

#### Steering Feedback

**Criticism:** The steering was highly effective — the cascade model request produced a much richer analysis, and the outcome measure refinement with Type A/B classification was methodologically sophisticated. Well-specified and directly actionable.

**Grade: A** — Excellent conceptual and methodological direction.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with cascade model and refined outcome measure)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor: The report could discuss how expertise moderates"
    description: "Minor: The report could discuss how expertise moderates bias susceptibility, but the current version is comprehensive and well-structured for the scope of the problem."

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

The student showed strong analytical reasoning, particularly in the later cycles. Framing correctly identified the relevant biases and practical constraints but missed the provisional nature of ER diagnoses and the expertise-bias interaction. Judging improved markedly across cycles — starting with evidence gaps and control issues, then progressing to the more subtle bias-interaction and outcome-validity concerns. The cascade model request was a highlight. Steering was consistently excellent, with each instruction being specific, methodologically grounded, and driving substantial improvements. The student's main area for growth is questioning assumptions at the framing stage — particularly interrogating whether the problem's implicit causal model (bias → error) is complete.
