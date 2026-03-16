# Session 4 — Interpreting fMRI Data on Attentional Selection (Open-Ended)

**Challenge:** Cognitive Neuroscience Methods > Neuroimaging > fMRI (Spatial Resolution)
**Mode:** Open-Ended (Structured Sections)
**Student:** Anika T.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> A research lab has collected fMRI data from 28 participants performing a visual search task where they had to find a target letter among distractors. The lab found "strong activation" in the frontal eye fields and "some activation" in the parietal cortex, but "surprisingly no activation" in primary visual cortex. They want you to write a critical interpretation memo evaluating what these results mean for theories of attentional selection. The memo should address whether the data support "top-down" or "bottom-up" models of attention. The task used "colored letters on a gray background" and the contrasts were "target-present minus target-absent trials." Some participants "moved their eyes a lot" despite instructions to fixate.

### Student's Framing Response

> **Assumption: "Strong activation" and "no activation" are relative to an unspecified statistical threshold — I need to know the p-value threshold, correction method, and whether the analysis was whole-brain or ROI-based.**
>
> **Question: The contrast "target-present minus target-absent" subtracts trials where the target was found from trials where it was absent. But both conditions involve visual search — the difference might not isolate attentional selection specifically.**
>
> **Constraint: N=28 is moderate. The null result in V1 could reflect low power rather than true absence of activation.**
>
> **Question: Participants who "moved their eyes" — were these participants excluded? Eye movements confound FEF activation because the frontal eye fields are involved in both saccade planning and attentional selection.**

### AI Solution (Generated from Student's Framing)

**Critical Interpretation Memo: fMRI Findings on Visual Search and Attentional Selection**

**1. Summary of Findings**
- Frontal eye fields (FEF): significant activation in target-present > target-absent contrast
- Parietal cortex (likely IPS/SPL): moderate activation
- Primary visual cortex (V1): no significant activation

**2. Interpretation Challenges**

*Contrast logic:* The target-present minus target-absent subtraction removes visual stimulation common to both conditions (the letter array on gray background). What remains is the cognitive difference: target detection, response preparation, and any differential eye movement patterns. This contrast does not cleanly isolate attentional selection from these co-occurring processes.

*FEF activation:* Consistent with top-down attentional control (Corbetta & Shulman, 2002, dorsal attention network). However, FEF is also the primary cortical region for saccade generation. If participants moved their eyes more on target-present trials, the FEF activation may reflect oculomotor activity rather than attentional selection.

*V1 null result:* Several interpretations are possible:
- The subtraction removed V1 activity because visual stimulation was equivalent across conditions
- V1 does show attentional modulation but the effect is small and the study is underpowered
- Attentional effects in V1 occur in narrow retinotopic regions that are diluted in a whole-brain analysis

**3. Conclusion**
The data are consistent with a top-down attentional control account (FEF → parietal) but the FEF activation cannot be attributed to attention without controlling for eye movements. The V1 null result does not rule out bottom-up or recurrent models — it may reflect methodological limitations rather than a true absence of effect.

### Framing Feedback

**Criticism:** The student asked four well-targeted questions that address the most important methodological concerns: statistical thresholds, contrast logic, power for null results, and the eye movement confound. This is an unusually strong framing. The main gap is that the student did not question the reverse inference problem — even if FEF activation is "real" and not due to eye movements, concluding it reflects top-down attention is a reverse inference (activation in FEF → top-down attention) that ignores the many other cognitive functions FEF supports. The student also did not ask whether the parietal activation was in the intraparietal sulcus (dorsal attention network, more consistent with top-down) or the temporoparietal junction (ventral attention network, more consistent with bottom-up reorienting).

**Better Alternative Framing:**
> "All of the above, plus: Question: Interpreting FEF activation as 'top-down attention' is a reverse inference — FEF supports multiple functions. What additional evidence would be needed to make this attribution? Question: Where exactly in parietal cortex — IPS/SPL (dorsal) vs TPJ (ventral)? This distinction is critical for the top-down vs bottom-up question."

**Grade: A** — Unusually strong methodological questioning. Missed the reverse inference and parietal localization issues.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "Top-down/bottom-up dichotomy is oversimplified"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Propose three specific analytical approaches to"
    description: "Add: Propose three specific analytical approaches to disentangle the eye movement confound from the attentional selection interpretation of FEF activation: (1) parametric regressor for saccade count, (2) exclusion of high-movement participants with sensitivity analysis, (3) correlation between per-participant FEF activation magnitude and saccade frequency."
  - name: "Revise: Reframe the top-down vs bottom-up discussion as"
    description: "Revise: Reframe the top-down vs bottom-up discussion as a continuum or interaction rather than a dichotomy. Reference biased competition models (Desimone & Duncan, 1995) or priority map frameworks that integrate both signals."

#### Updated AI Output

**Section 2 (Revised): Addressing the Eye Movement Confound**

Three complementary approaches to disentangle oculomotor from attentional contributions to FEF activation:

1. **Parametric regressor analysis:** Re-run the GLM with trial-by-trial saccade count as a parametric modulator. If FEF activation persists after regressing out saccade-related variance, the residual activation is more attributable to attentional processes.

2. **Exclusion sensitivity analysis:** Identify participants whose saccade rate exceeds a threshold (e.g., >2 saccades/trial). Re-run the target-present > target-absent contrast without these participants. If FEF activation is substantially reduced, it was likely oculomotor.

3. **Brain-behavior correlation:** Correlate per-participant FEF beta values with mean saccade count. A strong positive correlation suggests oculomotor driving; a weak or absent correlation supports an attentional interpretation.

**Section 3 (Revised): Beyond the Top-Down / Bottom-Up Dichotomy**

The top-down vs bottom-up framing is an oversimplification. Current models propose integrated mechanisms:

- **Biased competition** (Desimone & Duncan, 1995): Top-down signals (from FEF, PFC) bias competition among representations in sensory cortex. Bottom-up salience and top-down goals jointly determine which representation wins.
- **Priority maps** (Itti & Koch, 2001; Fecteau & Munoz, 2006): FEF and parietal cortex compute integrated priority signals that combine bottom-up salience with top-down goals. Activation in these regions does not uniquely implicate either source.

The present data — FEF and parietal activation without V1 modulation — are consistent with a priority-map account where attentional selection occurs at the map level without needing to modulate early sensory representations on every trial.

#### Judging Feedback

**Criticism:** The student identified two important gaps — the missing analytical remedies for the eye movement confound and the oversimplified top-down/bottom-up framing. Both corrections were conceptually sophisticated and improved the memo substantially. However, the student did not address the reverse inference issue: even after controlling for eye movements, concluding that FEF activation reflects "attention" is still a reverse inference. The memo should explicitly state this limitation. The student also did not question the V1 null result more deeply — specifically, whether the whole-brain analysis with standard smoothing kernels might dilute retinotopically specific attentional effects in V1.

**Better Alternative Judgement:**
> "Gap: No analytical remedy for eye movement confound. Gap: Top-down/bottom-up dichotomy is oversimplified. Error: Even after eye movement control, attributing FEF activation to 'attention' is a reverse inference — FEF supports many functions. Gap: V1 null may reflect dilution of retinotopically specific effects in whole-brain analysis — an ROI analysis of retinotopically defined V1 might recover the effect."

**Grade: A** — Two strong conceptual catches, missed reverse inference and V1 analytical refinement.

#### Steering Feedback

**Criticism:** The steering was excellent — three specific analytical approaches for the eye movement confound, each clearly described and testable, plus a reframing grounded in the right theoretical models. Both instructions were precise and drove substantial improvements.

**Grade: A** — Specific, theoretically grounded, and highly productive.

---

### Cycle 2

**Current AI Output:** *(revised version with eye movement remedies and interactive attention framework)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: The memo still implicitly commits a reverse inference"
    description: "Gap: The memo still implicitly commits a reverse inference — it interprets FEF activation as reflecting attentional processes. The memo should explicitly acknowledge that FEF activation alone cannot confirm an attentional mechanism, since FEF is involved in many cognitive functions beyond spatial attention. Gap: The V1 null result discussion could be strengthened by proposing an ROI-based reanalysis of retinotopically defined V1 — standard whole-brain analysis with typical smoothing may wash out spatially specific attentional modulation in V1."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Include an explicit section on the reverse inference problem"
    description: "Add: Include an explicit section on the reverse inference problem — interpreting activation in a region as evidence for a specific cognitive process. State that FEF activation is consistent with, but does not uniquely support, an attentional selection account. List what additional evidence would be needed (e.g., connectivity analysis, TMS disruption, convergent task manipulations)."
  - name: "Add: Propose an ROI-based reanalysis of V1 using"
    description: "Add: Propose an ROI-based reanalysis of V1 using functionally or retinotopically defined ROIs. Explain why this might recover attentional modulation that a whole-brain analysis misses — smaller region, higher signal-to-noise, no dilution from non-stimulated cortex."

#### Updated AI Output

**New Section: The Reverse Inference Problem**

Interpreting FEF activation as evidence for top-down attention involves a reverse inference: observing brain activation and inferring the underlying cognitive process. This is logically weak because:
- FEF is implicated in saccade planning, spatial working memory, decision-making, and motor preparation — not exclusively attention
- The inference would be strengthened by convergent evidence:
  1. **Effective connectivity analysis (DCM/PPI):** Does FEF exert top-down influence on visual cortex during search, or does it receive bottom-up drive?
  2. **TMS disruption:** Does disrupting FEF impair attentional selection on this task?
  3. **Parametric manipulation:** Does FEF activation scale with set size (attentional load) after controlling for eye movements?
- Without such convergent evidence, the memo should state that FEF activation is "consistent with" attentional selection but does not uniquely support it.

**Revised V1 Analysis Proposal:**

The null result in V1 should not be over-interpreted. Proposed reanalysis:
1. Define V1 ROI using retinotopic mapping or anatomical atlas (e.g., Juelich atlas)
2. Extract mean beta values within V1 ROI for the target-present > target-absent contrast
3. Restrict the ROI to the retinotopic representation of the stimulus locations (if retinotopic mapping data available)
4. Report effect size and Bayesian analysis (BF₀₁) to distinguish "no evidence of effect" from "evidence of no effect"
5. Expected outcome: V1 modulation may be detectable in an ROI analysis even when not visible at whole-brain corrected thresholds

#### Judging Feedback

**Criticism:** The student now addressed both remaining gaps — the reverse inference problem and the V1 ROI analysis proposal. The reverse inference section correctly identifies the logical weakness and proposes convergent evidence strategies. The V1 reanalysis proposal with Bayesian analysis to assess the null result is methodologically sophisticated. One remaining gap: the memo does not discuss the temporal ambiguity of fMRI — even if FEF activation is attentional, fMRI cannot determine whether FEF activity precedes or follows parietal and sensory cortex activity. This temporal ordering is critical for the top-down vs bottom-up question, and the memo should acknowledge that fMRI's temporal resolution (~2s) cannot resolve it.

**Better Alternative Judgement:**
> "Gap: Reverse inference not acknowledged — FEF activation is ambiguous. Gap: V1 null needs ROI reanalysis proposal. Gap: fMRI's poor temporal resolution (~2s) means we cannot determine whether FEF activation precedes sensory cortex activation (top-down) or follows it (bottom-up). Recommend acknowledging this and suggesting EEG/MEG follow-up."

**Grade: A** — Strong catches on both issues. Missed the temporal resolution limitation.

#### Steering Feedback

**Criticism:** The steering was precise and produced exactly the right additions. The reverse inference section with convergent evidence proposals and the ROI reanalysis with Bayesian null assessment were both high-quality improvements. The student could have also pushed for a temporal resolution discussion.

**Grade: A** — Specific, methodologically sophisticated, and effective.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with reverse inference discussion, V1 ROI proposal, and interactive attention framework)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor: The memo does not discuss fMRI's temporal resolution limitation"
    description: "Minor: The memo does not discuss fMRI's temporal resolution limitation — we cannot determine the temporal order of FEF vs V1 activation, which matters for the top-down vs bottom-up question. But this is a standard limitation of fMRI studies and the memo is already comprehensive."

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

The student demonstrated strong neuroscience methodology knowledge throughout. Framing was unusually thorough, questioning statistical thresholds, contrast logic, power for null results, and the eye movement confound — missing only reverse inference and parietal localization specificity. Judging was consistently strong, progressing from the eye movement confound and theoretical framing (Cycle 1) to reverse inference and V1 reanalysis (Cycle 2), though the temporal resolution limitation was noted but not acted on. Steering was excellent in every cycle, producing specific analytical proposals that substantially strengthened the memo. The student's main growth area is remembering to evaluate the limitations of the imaging modality itself (temporal resolution, BOLD signal interpretation) in addition to the specific study design.
