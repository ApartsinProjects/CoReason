# Session 4 — Interpreting fMRI Data on Attentional Selection (Multiple Choice)

**Challenge:** Cognitive Neuroscience Methods > Neuroimaging > fMRI (Spatial Resolution)
**Mode:** Multiple Choice
**Student:** Joris M.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> A research lab has collected fMRI data from 28 participants performing a visual search task where they had to find a target letter among distractors. The lab found "strong activation" in the frontal eye fields and "some activation" in the parietal cortex, but "surprisingly no activation" in primary visual cortex. They want you to write a critical interpretation memo evaluating what these results mean for theories of attentional selection. The memo should address whether the data support "top-down" or "bottom-up" models of attention. The task used "colored letters on a gray background" and the contrasts were "target-present minus target-absent trials." Some participants "moved their eyes a lot" despite instructions to fixate.

### Framing Options Presented

Which assumptions and clarifications should you establish?

- **(A)** Accept the results at face value — "strong activation" means the effect is real. Focus on interpreting the theoretical implications without questioning the methodology.
- **(B)** Question the statistical threshold and correction method. Note that the contrast may not isolate attention. Recognize N=28 may be underpowered for null results. Flag the eye movement confound.
- **(C)** Question the statistical threshold, correction method, and whole-brain vs ROI analysis. Assess whether the contrast isolates attentional selection or confounds it with motor and decision processes. Note N=28 is underpowered for null V1 result. Flag eye movement confound for FEF interpretation. Question the reverse inference from FEF activation to "top-down attention." Ask about parietal localization (IPS vs TPJ).
- **(D)** The study has too many problems to interpret — recommend the lab re-collect data with a better design before writing any memo.
- **(E)** Focus exclusively on the V1 null result — this is the most surprising finding and the only one worth interpreting.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

**Critical Interpretation Memo**

**1. Summary:** FEF activation (strong), parietal (moderate), V1 (null) in target-present > target-absent.

**2. Interpretation:**
- FEF activation consistent with top-down attentional control (Corbetta & Shulman, 2002). However, eye movements confound this — FEF also generates saccades.
- V1 null result: Could be power issue (N=28), or subtraction removed V1 (equivalent visual input in both conditions), or attention doesn't modulate V1 in this task.
- Contrast logic concern: target-present minus target-absent removes shared visual stimulation but leaves target detection, response preparation, and differential eye movements.

**3. Conclusion:** Data consistent with top-down control but the eye movement confound prevents strong attribution. V1 null is ambiguous — could be real or methodological.

### Framing Feedback

**Criticism:** Option (B) covers the most important methodological concerns — thresholds, contrast logic, power, and eye movements. However, option (C) was more thorough: it also questioned reverse inference (FEF activation does not uniquely imply attention), asked about parietal localization (IPS for dorsal/top-down vs TPJ for ventral/bottom-up), and distinguished whole-brain from ROI analysis, which matters for the V1 interpretation. These are not minor issues — reverse inference and parietal localization directly affect the top-down vs bottom-up question the memo is supposed to address.

**Better Alternative:** Option **(C)** — adds reverse inference, parietal localization, and analysis type — all directly relevant to the interpretation.

**Grade: B** — Good methodological instincts, missed some interpretation-critical issues.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's memo?

- **(A)** The memo is too short — it needs to be at least 10 pages with full literature review
- **(B)** The memo acknowledges the eye movement confound but proposes no analytical remedy; the top-down/bottom-up question is treated as binary; the V1 null interpretation is shallow
- **(C)** The memo proposes no remedy for eye movements; treats top-down/bottom-up as binary; V1 null interpretation is shallow; commits reverse inference (FEF → attention); does not specify where in parietal cortex
- **(D)** The memo incorrectly identifies the frontal eye fields — FEF is not involved in visual attention
- **(E)** The memo is well-balanced and complete — no significant issues

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Make the memo longer and add more references"
- **(B)** "Propose specific analytical approaches to address the eye movement confound: parametric regressor for saccade count, exclusion of high-movement participants, brain-behavior correlation. Reframe top-down vs bottom-up as interactive (cite biased competition / priority map models). For V1, propose an ROI reanalysis and Bayesian analysis to distinguish no evidence from evidence of no effect."
- **(C)** "Remove the discussion of eye movements — it's a distraction"
- **(D)** "Add a section on the default mode network"
- **(E)** "Replace the fMRI interpretation with an EEG-based analysis proposal"

**Student selects: (B)**

#### Updated AI Output

**Revised Memo**

**Eye Movement Confound — Analytical Remedies:**
1. Parametric regressor: include saccade count in GLM to partial out oculomotor variance
2. Exclusion analysis: remove participants with >2 saccades/trial; check if FEF activation survives
3. Correlation: plot per-participant FEF beta vs mean saccade count — strong correlation suggests oculomotor, weak suggests attentional

**Attentional Selection Framework (Revised):**
- Top-down vs bottom-up is a false dichotomy in current models
- Biased competition (Desimone & Duncan, 1995): top-down signals bias competition in sensory cortex; both sources contribute
- Priority maps (Fecteau & Munoz, 2006): FEF/parietal compute integrated salience + goal signals
- Present data: FEF + parietal without V1 modulation is consistent with priority map computation without mandatory sensory-level modulation

**V1 Null — Refined Interpretation:**
- Propose ROI analysis of retinotopically defined V1 (higher sensitivity than whole-brain)
- Bayesian analysis: compute BF₀₁ to test whether V1 null is "evidence of absence" or "absence of evidence"
- If BF₀₁ > 3: meaningful evidence against V1 modulation in this task
- If BF₀₁ < 3: inconclusive — power insufficient to interpret null

#### Judging Feedback

**Criticism:** The student caught three important issues and the steering produced a much stronger memo. However, option (C) was more comprehensive — it also identified the reverse inference problem (FEF activation does not uniquely support an attentional account) and the unspecified parietal localization (IPS vs TPJ matters for the dorsal vs ventral attention network distinction). These were available in the framing feedback but the student did not carry them forward.

**Better Alternative:** Option **(C)** — includes everything in (B) plus reverse inference and parietal localization.

**Grade: B** — Caught the most actionable issues, missed two conceptual ones.

#### Steering Feedback

**Criticism:** Option (B) was the best available — packed with specific, actionable remedies across all three problem areas. The parametric regressor, Bayesian analysis, and theoretical reframing were all precisely specified.

**Grade: A** — Excellent, comprehensive, and technically specific.

---

### Cycle 2

**Current AI Output:** *(revised memo with eye movement remedies, interactive framework, V1 reanalysis)*

#### Judging Sub-step

Which issues remain?

- **(A)** The memo still commits reverse inference — interpreting FEF activation as evidence for attention without acknowledging FEF's multiple functions
- **(B)** The memo commits reverse inference; does not specify IPS vs TPJ for parietal activation; does not acknowledge fMRI's temporal resolution limitation for the top-down vs bottom-up question
- **(C)** The Bayesian analysis threshold (BF > 3) is too lenient — should be BF > 10
- **(D)** The biased competition model is outdated and should be replaced with predictive coding
- **(E)** No significant issues remain

**Student selects: (A)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Add an explicit section on reverse inference. State that FEF activation is consistent with, but does not uniquely support, attentional selection — FEF is implicated in saccade planning, spatial working memory, and decision-making. List convergent evidence needed to strengthen the inference: effective connectivity analysis, TMS disruption, parametric attention load manipulation."
- **(B)** "Just add a disclaimer at the end"
- **(C)** "Remove all theoretical interpretation — just report the data"
- **(D)** "Replace the entire memo with a methods critique"
- **(E)** "Add a section on individual differences in attention"

**Student selects: (A)**

#### Updated AI Output

**New Section: Reverse Inference Limitations**

This memo interprets FEF activation as consistent with attentional selection, but this involves a reverse inference: observing regional activation and inferring a specific cognitive process. This inference is weak because FEF is functionally heterogeneous:

- Saccade planning and execution (Bruce & Goldberg, 1985)
- Covert spatial attention (Moore & Fallah, 2004)
- Visual working memory maintenance (Kastner & Ungerleider, 2000)
- Decision-making under spatial uncertainty (Schall, 2004)

The present data cannot distinguish these contributions. Convergent evidence to strengthen or refute the attentional interpretation:
1. **Dynamic causal modeling (DCM):** Test whether FEF → V1 connectivity increases during target-present trials (top-down influence) or V1 → FEF increases (bottom-up drive)
2. **TMS:** If transient FEF disruption impairs search accuracy (not just saccade metrics), this supports an attentional, not merely oculomotor, role
3. **Parametric set-size manipulation:** If FEF activation scales with attentional load (number of distractors) after controlling for eye movements, this links activation to attentional demand specifically

#### Judging Feedback

**Criticism:** The student correctly identified the reverse inference problem and the steering produced a rigorous treatment. However, option (B) was more comprehensive — it also noted the unspecified parietal localization (IPS vs TPJ) and the temporal resolution limitation. The parietal issue matters because IPS activation supports dorsal attention network involvement (top-down spatial selection) while TPJ activation supports ventral reorienting (bottom-up salience detection). Without specifying the location, the top-down vs bottom-up interpretation is underdetermined. The temporal resolution issue matters because fMRI cannot determine whether FEF activation precedes or follows sensory cortex, which is critical for determining directionality of attention.

**Better Alternative:** Option **(B)** — also catches parietal localization and temporal resolution.

**Grade: A** — Caught the reverse inference problem, missed parietal specificity and temporal limitations.

#### Steering Feedback

**Criticism:** Option (A) was the best available — precise about the reverse inference logic, specific about FEF's multiple functions with citations, and proposing three concrete convergent evidence strategies. Well-chosen.

**Grade: A** — Specific, well-cited, and actionable.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with reverse inference section, eye movement remedies, interactive framework, V1 reanalysis)*

#### Judging Sub-step

Which issues remain?

- **(A)** The parietal activation is unspecified (IPS vs TPJ) and fMRI temporal resolution prevents determining directionality of attention
- **(B)** The priority map model is computationally intractable
- **(C)** The memo is sufficiently comprehensive for the scope of this problem
- **(D)** The Bayesian analysis should use informative priors based on prior V1 attention studies
- **(E)** The study should have used PET instead of fMRI

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

The student showed solid neuroimaging literacy, catching the eye movement confound and contrast logic issues early. Framing covered the most important methodological concerns but missed reverse inference and parietal localization — issues that recurred as gaps in later judging cycles. Judging caught significant issues in every cycle (eye movement remedies, top-down/bottom-up oversimplification, reverse inference) but consistently chose the less comprehensive option, missing parietal localization and temporal resolution limitations throughout. Steering was the strongest skill — every selection was technically specific and produced substantial improvements. The student should practice a systematic checklist approach: for any neuroimaging interpretation, always check (1) statistical thresholds, (2) contrast logic, (3) reverse inference, (4) anatomical specificity, (5) temporal resolution, and (6) power for null results.
