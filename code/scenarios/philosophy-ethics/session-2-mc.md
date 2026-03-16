# Session 2 — Algorithmic Sentencing Tool Evaluation (Multiple Choice)

**Challenge:** Applied Ethics > Technology & AI Ethics > Algorithmic Bias & Fairness
**Mode:** Multiple Choice
**Student:** James W.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> A national justice ministry is piloting an algorithmic risk-assessment tool that predicts recidivism to assist judges in sentencing decisions. Critics say it is "biased against minorities." The ministry wants an independent ethical evaluation report (5-7 pages) that assesses the tool's fairness, recommends whether to continue the pilot, and proposes safeguards. The tool uses "dozens of variables" including age, employment history, prior convictions, and neighborhood characteristics. Its predictions are "about 70% accurate overall." Judges can "override" the recommendation but "rarely do." The report should address both the ethics of using the tool and the ethics of not using it.

### Framing Options Presented

Which assumptions and clarifications should you establish?

- **(A)** Assume the tool is biased because critics say so. Recommend discontinuing it immediately. No further analysis needed.
- **(B)** Define "biased" as disparate false positive rates across demographic groups. Assume procedural fairness is the relevant standard. Note that proxy variables (neighborhood, employment) may encode racial bias. Accept 70% accuracy as a given.
- **(C)** Question whether "biased" refers to disparate error rates, proxy variable discrimination, or the moral permissibility of predictive sentencing itself. Ask whether judges' low override rate means the tool is de facto determinative rather than advisory. Note that 70% overall accuracy may mask group-level disparities. Identify the missing comparison baseline — current judicial sentencing disparity data. Flag that the ethical analysis requires examining both the tool and plausible alternatives, not just tool-vs-no-tool.
- **(D)** Assume the tool is fair because it uses objective data rather than subjective judgment. The 70% accuracy rate is acceptable. Focus on technical improvements to increase accuracy.
- **(E)** Frame the problem as a pure data science question — audit the algorithm's statistical properties and ignore ethical frameworks.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

**ETHICAL EVALUATION: ALGORITHMIC RECIDIVISM RISK ASSESSMENT TOOL**

**Fairness Assessment:** Predictive parity concerns, false positive disparity risks, proxy variable issues (neighborhood, employment correlate with race).

**Ethical Analysis:** Utilitarian case for reducing recidivism vs Kantian concern about treating defendants as risk-category members rather than moral agents.

**Recommendation:** Continue pilot with modifications — audit for disparate rates, remove proxy variables, require documented judicial reasoning.

**Ethics of Non-use:** Judicial discretion is also biased; the question is whether the tool is better than the alternative.

### Framing Feedback

**Criticism:** Option (B) correctly operationalizes bias and identifies proxy variables, but it has three significant gaps compared to option (C). First, it does not question whether predictive sentencing is morally permissible — this is a foundational issue, not a refinement. Second, it accepts the judge-override structure at face value without asking whether the low override rate means the tool is de facto making the decision. Third, it accepts 70% accuracy as a given rather than questioning whether this is sufficient for criminal sentencing. Option (C) surfaces all three of these issues plus the missing comparison baseline.

**Better Alternative:** Option **(C)** — deeper questioning of foundational moral permissibility, override dynamics, and accuracy sufficiency.

**Grade: B** — Solid technical framing, missed foundational ethical questions.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's solution?

- **(A)** The tool should be approved without conditions — the AI is being too cautious
- **(B)** The Kantian analysis is underdeveloped — it states the concern but doesn't develop the argument; the "ethics of non-use" presents a false binary between the tool and unassisted discretion
- **(C)** The report needs more statistical analysis and less ethical reasoning
- **(D)** The Kantian analysis is underdeveloped; the "ethics of non-use" presents a false binary (ignoring structured guidelines, blinded review, retrospective audit); no measurable criteria for pilot success/failure; 70% accuracy is accepted without scrutiny
- **(E)** The proxy variable analysis is wrong — neighborhood data is legitimately relevant to sentencing

**Student selects: (D)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Make the report more concise"
- **(B)** "Fully develop the Kantian objection — argue that predictive sentencing treats defendants as risk-category members, not moral agents, and present the strongest consequentialist response. Add at least two alternatives beyond 'use tool vs pure discretion' and evaluate each against the same fairness criteria."
- **(C)** "Add more data tables and statistical tests"
- **(D)** "Remove all ethical frameworks and focus on technical accuracy metrics"
- **(E)** "Ask the ministry to provide more data before completing the evaluation"

**Student selects: (B)**

#### Updated AI Output

*(Report revised with fully developed Kantian argument including consequentialist response and rejoinder about individual vs statistical evidence. Alternatives section added: structured sentencing guidelines, blinded assessment, retrospective audit tool. Each evaluated against fairness criteria.)*

#### Judging Feedback

**Criticism:** The student made the strongest choice in judging — option (D) captures all four significant issues: the underdeveloped Kantian argument, the false binary, the missing pilot criteria, and the unexamined accuracy rate. This is the most comprehensive assessment available. In steering, option (B) addressed the two most philosophically significant issues (Kantian argument and alternatives beyond the binary) but did not address the pilot criteria or accuracy threshold. These would need to be caught in the next cycle.

**Better Alternative (Judging):** Option **(D)** was the best choice — well done.

**Grade (Judging): A-** — Comprehensive issue identification.

**Better Alternative (Steering):** Option (B) was the best available, though an ideal option would also address pilot thresholds and accuracy scrutiny.

**Grade (Steering): A-** — Strong direction on the most important issues.

---

### Cycle 2

**Current AI Output:** *(revised with Kantian argument and alternatives)*

#### Judging Sub-step

Which issues remain?

- **(A)** The recommendation lacks measurable evaluation criteria — no threshold for when disparate impact should trigger tool suspension; 70% accuracy is still accepted without scrutiny
- **(B)** The report is now complete and comprehensive
- **(C)** The structured alternatives section needs cost-benefit analysis with dollar figures
- **(D)** The recommendation lacks measurable criteria; 70% accuracy is unexamined; the disparate impact ratio, if proposed, should be calibrated to criminal justice (not borrowed from employment law without justification)
- **(E)** The Kantian argument is too strong — it should be removed to make the report more balanced

**Student selects: (A)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Define measurable pilot evaluation criteria: maximum acceptable false-positive disparity ratio across groups, minimum accuracy threshold, and override rate monitoring. Analyze whether 70% accuracy is ethically acceptable for criminal sentencing by comparing to standards in other high-stakes domains."
- **(B)** "Add a literature review section"
- **(C)** "Make the recommendation stronger — either fully support or fully oppose the tool"
- **(D)** "Remove the Kantian section to save space"
- **(E)** "Add a glossary of technical terms for the ministry staff"

**Student selects: (A)**

#### Updated AI Output

*(Report expanded with specific pilot criteria: 1.25x maximum false positive ratio, 80% minimum accuracy threshold, override rate monitoring with 15% floor. Analysis of 70% accuracy against medical and aviation standards. Ethical burden-of-proof argument for why tool proponents must demonstrate superiority over alternatives.)*

#### Judging Feedback

**Criticism:** The student correctly identified the two remaining practical gaps: no measurable pilot criteria and unexamined accuracy. Option (D) was marginally stronger because it also noted that borrowing the disparate impact ratio from employment law without adjusting for the higher stakes of criminal sentencing (liberty vs employment) deserves scrutiny. However, the student caught the essential issues.

**Better Alternative:** Option **(D)** — adds the calibration concern.

**Grade: A** — Caught the main issues, missed the calibration nuance.

#### Steering Feedback

**Criticism:** Option (A) was the best available and was well-matched to the identified issues. The instruction to compare accuracy against other high-stakes domains was particularly effective — it provided an objective framework for evaluating whether 70% is acceptable. The measurable criteria request transformed a vague recommendation into an actionable one.

**Grade: A** — Precise and productive.

---

### Cycle 3 (Final)

**Current AI Output:** *(final version with all revisions)*

#### Judging Sub-step

Which issues remain?

- **(A)** The report is comprehensive and well-structured for its scope
- **(B)** The 1.25x disparate impact threshold should be stricter for criminal sentencing
- **(C)** The report needs peer review by statisticians
- **(D)** The ethical frameworks should be replaced with a cost-benefit analysis
- **(E)** The alternatives section is too long

**Student selects: (A)**

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

The student showed strong and improving performance across the session. Framing was the weakest phase — the technical understanding of bias was solid, but missing the foundational question of predictive sentencing permissibility is a significant gap in ethical analysis. Judging was notably strong: the student selected the most comprehensive option in Cycle 1 (all four issues) and continued to identify meaningful gaps in subsequent cycles. Steering was excellent throughout — every choice was specific, well-targeted, and produced substantial improvement. The student's instinct to demand measurable criteria and cross-domain accuracy comparisons shows a mature understanding of how to make ethical recommendations actionable. To improve framing, practice asking "Should this practice exist at all?" before asking "How should this practice be improved?"
