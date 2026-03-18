# Session 2 — Algorithmic Sentencing Tool Evaluation (Open-Ended)

**Challenge:** Applied Ethics > Technology & AI Ethics > Algorithmic Bias & Fairness
**Mode:** Open-Ended (Structured Sections)
**Student:** James W.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> A national justice ministry is piloting an algorithmic risk-assessment tool that predicts recidivism to assist judges in sentencing decisions. Critics say it is "biased against minorities." The ministry wants an independent ethical evaluation report (5-7 pages) that assesses the tool's fairness, recommends whether to continue the pilot, and proposes safeguards. The tool uses "dozens of variables" including age, employment history, prior convictions, and neighborhood characteristics. Its predictions are "about 70% accurate overall." Judges can "override" the recommendation but "rarely do." The report should address both the ethics of using the tool and the ethics of not using it.

### Student's Framing Response

> **Assumption: "Biased against minorities" means the tool's false positive rate (incorrectly predicting recidivism) is higher for minority defendants than for non-minority defendants.**
>
> **Assumption: The relevant ethical standard is procedural fairness — every defendant should be assessed by the same criteria.**
>
> **Question: "About 70% accurate overall" — is this accuracy the same across demographic groups? Overall accuracy can mask group-level disparities.**
>
> **Constraint: I'll assume the legal system requires that sentencing criteria be individually relevant — a person should not be punished for characteristics of their neighborhood or demographic group.**

### AI Solution (Generated from Student's Framing)

**ETHICAL EVALUATION: ALGORITHMIC RECIDIVISM RISK ASSESSMENT TOOL**

**1. Fairness Assessment:**
The tool raises fairness concerns along three dimensions:
- **Predictive parity:** Does the tool have the same positive predictive value across groups? If 70% accuracy differs by race, the tool treats groups unequally.
- **False positive disparity:** If minority defendants face higher false positive rates, they receive harsher sentences for crimes they would not have committed.
- **Input variable concerns:** Neighborhood characteristics and employment history correlate with race and socioeconomic status. Even without an explicit race variable, the tool may use proxies.

**2. Ethical Analysis:**
From a utilitarian perspective, the tool may reduce overall recidivism by targeting interventions, improving public safety. From a deontological perspective, sentencing individuals partly on the basis of group-level statistical patterns (neighborhood, demographics) treats them as means rather than ends — violating Kantian respect for persons.

**3. Recommendation:**
Continue the pilot with modifications:
- Audit the tool for disparate false positive rates across racial groups
- Remove or down-weight variables that serve as racial proxies
- Require judges to document reasons when they follow the tool's recommendation, not just when they override it
- Publish accuracy metrics disaggregated by demographic group

**4. Ethics of Non-use:**
Not using the tool means relying entirely on judicial discretion, which research shows is also subject to racial bias, inconsistency, and anchoring effects. The ethical question is not "is the tool perfect?" but "is it better than the alternative?"

### Framing Feedback

**Criticism:** The student made several strong moves: operationalizing "biased" as a false-positive disparity, flagging that overall accuracy can mask group-level differences, and noting that proxy variables create indirect discrimination. However, the student defined fairness purely in procedural terms ("same criteria for everyone") without recognizing that procedural fairness and substantive fairness can conflict — applying the same criteria equally can produce systematically unequal outcomes if the criteria themselves encode historical injustice. The student also did not question the moral permissibility of predictive sentencing itself: is it ethically defensible to punish someone based on a statistical prediction of future behavior, regardless of accuracy? This is a deontological objection that the framing should have surfaced. Finally, the student did not ask what "override" means in practice — whether judges see the score before or after forming their own assessment changes whether the tool serves as information or as an anchor.

**Better Alternative Framing:**
> "Assumption: 'Biased' likely means disparate error rates across groups, but could also mean the tool encodes structurally unjust input variables. Both need examination. Question: Is predictive sentencing morally permissible at all? Punishing individuals based on statistical group predictions may violate individual moral responsibility regardless of accuracy. Question: When judges 'rarely override,' is this because the tool is persuasive or because institutional pressure discourages override? This affects whether the tool is advisory or de facto determinative. Missing: No information about what the comparison baseline is — are current sentences without the tool more or less racially disparate?"

**Grade: B** — Strong technical framing of bias, but missed the foundational question about predictive sentencing and the override dynamics.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "False binary between tool and pure discretion"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Expand: Develop the Kantian objection fully"
    description: "Expand: Develop the Kantian objection fully — argue that sentencing based on statistical predictions about future behavior (rather than past actions) treats defendants as members of a risk category rather than as morally autonomous individuals. Then present the best consequentialist response to this objection."
  - name: "The steering was philosophically sophisticated"
    description: "The steering was philosophically sophisticated. Requesting a full development of the Kantian objection with a consequentialist response demonstrated mature ethical reasoning. The instruction to presen"

#### Updated AI Output

**ETHICAL EVALUATION (Revised)**

**1. Fairness Assessment:** *(unchanged)*

**2. The Kantian Objection to Predictive Sentencing:**
Sentencing individuals based on algorithmic predictions of future behavior raises a fundamental deontological concern. The tool assigns risk scores based on characteristics shared with a statistical reference class — people of a similar age, neighborhood, employment history, and criminal record. Even if these predictions are actuarially accurate, they treat the defendant not as a unique moral agent responsible for their own choices, but as a representative of a risk category. This violates the Kantian imperative to treat persons as ends in themselves: the defendant is being partly sentenced for what people *like them* have done, not solely for what *they* have done.

*Consequentialist response:* The Kantian objection, if applied strictly, would also prohibit many accepted sentencing considerations — prior convictions are themselves a statistical predictor of future behavior. The question is not whether prediction is used, but whether the predictions are accurate enough and the variables individually relevant enough to justify their influence on sentencing. A tool that reduces overall recidivism and uses only individually relevant variables may cause less aggregate harm than the alternative.

*Rejoinder:* The consequentialist response conflates individual history (prior convictions) with group-level statistics (neighborhood characteristics). Prior convictions reflect the defendant's own past actions; neighborhood characteristics do not. The morally relevant distinction is between individual and statistical evidence.

**3. Alternative Approaches (Beyond the Binary):**
- **Structured sentencing guidelines:** Fixed sentencing ranges based on offense severity and criminal history, reducing judicial discretion without algorithmic prediction. Reduces inconsistency but may be inflexible.
- **Blinded assessment:** Judges receive case files with demographic and neighborhood information redacted. Reduces proxy bias but may remove legitimately relevant context.
- **Tool as post-decision audit:** Rather than informing individual sentences, use the algorithm to audit sentencing patterns retrospectively, flagging judges whose sentencing shows statistical disparities. Preserves individual judgment while using data to detect system-level bias.

**4. Recommendation:** *(revised to incorporate alternatives analysis)*

#### Judging Feedback

**Criticism:** The student identified two genuinely important issues. The underdeveloped Kantian argument was the most philosophically significant gap in the original output, and the false binary in the "non-use" section was a structural weakness. However, the student did not flag that the AI's recommendation to "continue the pilot with modifications" lacks a threshold — what level of disparate impact would warrant discontinuing the tool? Without a measurable criterion for failure, the recommendation is unfalsifiable. The student also did not note that the AI treats the tool's 70% accuracy as a neutral fact rather than examining whether 70% accuracy is sufficient for a tool that influences criminal sentencing.

**Better Alternative Judgement:**
> "Gap: Kantian argument underdeveloped — predictive sentencing treats defendants as risk-category members, not moral agents. Gap: False binary between tool and pure discretion. Gap: No threshold for when disparate impact should trigger discontinuation. Gap: 70% accuracy is presented neutrally — is 70% acceptable for criminal sentencing? What is the cost of the 30% error rate?"

**Grade: A** — Strong philosophical insight on the two issues identified, but missed the threshold and accuracy-sufficiency questions.

#### Steering Feedback

**Criticism:** The steering was philosophically sophisticated. Requesting a full development of the Kantian objection with a consequentialist response demonstrated mature ethical reasoning. The instruction to present alternatives beyond the binary and evaluate them against the same fairness criteria was well-structured and produced a much richer analysis. The steering could have also addressed the accuracy threshold question.

**Grade: A** — Excellent philosophical direction with a minor gap.

---

### Cycle 2

**Current AI Output:** *(revised version with Kantian argument and alternatives)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "70% accuracy accepted uncritically. Minor: If the tool functions as a de facto decision-maker due to low override rates, the ethical analysis should treat it as such rather than as advisory"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Define specific measurable criteria for evaluating the pilot"
    description: "Add: Define specific measurable criteria for evaluating the pilot — for example, the maximum acceptable ratio of false positive rates across groups, and the minimum accuracy threshold below which the tool should be suspended. Justify these thresholds on ethical grounds."
  - name: "Expand: Analyze whether 70% accuracy is ethically"
    description: "Expand: Analyze whether 70% accuracy is ethically sufficient for a tool influencing criminal sentencing. Compare this to accuracy standards in other high-stakes domains (medical diagnostics, engineering safety margins) and argue for what the minimum acceptable standard should be."

#### Updated AI Output

**ETHICAL EVALUATION (Final Revision)**

*(Previous sections retained, plus:)*

**5. Pilot Evaluation Criteria:**

The pilot should be evaluated against measurable thresholds:

- **Disparate impact ratio:** The false positive rate for any racial or ethnic group should not exceed 1.25x the rate for the lowest-error group (adapted from the EEOC's four-fifths rule for employment discrimination). If this threshold is exceeded after corrective measures, the tool should be suspended.
- **Minimum accuracy:** Overall predictive accuracy should exceed 80% for continued use in sentencing contexts. The current 70% rate means that for every 10 defendants assessed, 3 receive a sentence influenced by an incorrect prediction. In criminal justice, where liberty is at stake, the standard should be higher than in lower-stakes domains.
- **Override rate monitoring:** If fewer than 15% of judges override the tool's recommendation, this suggests the tool is functioning as a de facto decision-maker rather than an advisory input, and its role should be re-examined.

**6. Is 70% Accuracy Ethically Sufficient?**

In medical diagnostics, a screening test with 70% accuracy would be considered inadequate for making treatment decisions without confirmatory testing. In aviation safety, components are engineered to failure rates of less than one in a million. Criminal sentencing falls between these domains — it involves fundamental liberty interests but operates under unavoidable uncertainty.

A 30% error rate means that in a cohort of 1,000 defendants assessed as high-risk, approximately 300 would not actually reoffend. If these 300 receive longer sentences on the basis of the tool's recommendation, this constitutes a systematic deprivation of liberty based on a statistical error. The ethical burden of proof should fall on the tool's proponents: they must demonstrate that the tool's use produces sufficiently better outcomes than alternatives to justify this error rate.

*Recommended minimum:* 80% overall accuracy with no group falling below 75%, combined with a requirement that the tool's recommendation never be the sole factor in sentencing.

#### Judging Feedback

**Criticism:** The student identified the two most important remaining gaps: the missing evaluation threshold and the unexamined accuracy rate. Both are crucial for making the recommendation actionable and ethically grounded. The student could have pushed further on one point: the 1.25x disparate impact ratio is borrowed from employment law, but criminal sentencing involves liberty rather than employment — arguably a higher threshold should apply. However, identifying the need for any measurable threshold was the critical insight.

**Better Alternative Judgement:**
> "Gap: No failure criteria for the pilot. Gap: 70% accuracy accepted uncritically. Minor: If the tool functions as a de facto decision-maker due to low override rates, the ethical analysis should treat it as such rather than as advisory."

**Grade: A** — Precise identification of the two key remaining issues.

#### Steering Feedback

**Criticism:** The steering was strong and well-structured. Asking for specific measurable thresholds grounded in ethical reasoning transformed a vague recommendation into a testable one. The comparison to accuracy standards in other high-stakes domains was particularly effective — it provided a framework for evaluating whether 70% is acceptable without relying on intuition alone. This was the best steering in the session.

**Grade: A** — Rigorous and productive.

---

### Cycle 3 (Final)

**Current AI Output:** *(final version with thresholds and accuracy analysis)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "The report is now substantially complete"
    description: "The report is now substantially complete. One minor observation: the disparate impact threshold of 1.25x is borrowed from employment law but criminal sentencing involves liberty — arguably the threshold should be stricter. However, this is a judgment call rather than an error."

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

The student demonstrated strong analytical skills that improved across the session. The framing correctly operationalized bias as disparate error rates and identified proxy variables, but missed the foundational question of whether predictive sentencing is morally permissible and the dynamics of judicial override. Judging improved significantly: Cycle 1 identified philosophical gaps (underdeveloped Kantian argument, false binary), and Cycle 2 shifted to practical accountability gaps (no evaluation threshold, unexamined accuracy). Steering was consistently excellent — every instruction was specific, produced measurable improvement, and demonstrated the ability to translate philosophical insight into concrete directives. To improve, the student should practice asking foundational permission questions ("Is this practice morally permissible at all?") before proceeding to refinement questions ("How can this practice be made fairer?").
