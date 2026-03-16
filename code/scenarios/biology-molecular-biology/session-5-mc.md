# Session 5 — Enzyme Inhibition Kinetics Characterization Workflow (Multiple Choice)

**Challenge Type:** Practice
**Subject:** Proteins > Enzymes > Inhibition
**Response Mode:** Multiple Choice (5 options per question)

---

## Raw Problem

> Write a complete experimental workflow to determine the inhibition constant (Ki) and mechanism (competitive, uncompetitive, or mixed) of a novel small-molecule inhibitor against recombinant human cyclooxygenase-2 (COX-2) using a spectrophotometric arachidonic acid oxidation assay. Deliver a protocol covering substrate and inhibitor concentration series, a data-collection spreadsheet template, and a step-by-step kinetic analysis guide that produces Lineweaver-Burk and Dixon plots. The compound's solubility, whether the inhibition is time-dependent, and the assay buffer composition are not given.

---

## PHASE 1 — FRAMING

### Student Response (Multiple Choice)

**Question 1: What is the MOST critical unspecified compound property that affects the experimental design?**

A) The molecular weight of the inhibitor
B) The inhibitor's solubility in aqueous buffer and its stability at assay temperature — if poorly soluble, a co-solvent (DMSO) is required with matched vehicle controls, and instability would produce artifactual kinetics
C) The inhibitor's color
D) The inhibitor's melting point
E) The inhibitor's pKa

**Student selects: B**

**Question 2: What mechanistic question MUST be answered before proceeding with standard initial-rate kinetics?**

A) Whether the inhibitor binds covalently to the active site
B) Whether the inhibition is time-dependent (slow-binding, tight-binding, or irreversible), since many COX-2 inhibitors show time-dependent inhibition that requires a fundamentally different assay design (pre-incubation experiments, progress curve analysis) than standard initial-rate measurements
C) Whether the inhibitor is a prodrug
D) Whether the inhibitor crosses cell membranes
E) Whether the inhibitor is chiral

**Student selects: B**

**Question 3: What assay condition is critically unspecified?**

A) The temperature display format (Celsius vs. Fahrenheit)
B) The buffer composition — specifically, COX-2 requires hematin for heme reconstitution as an essential cofactor, and the pH, ionic strength, and presence of peroxidase co-substrates directly affect catalytic activity and apparent kinetic parameters
C) The brand of cuvettes
D) The spectrophotometer manufacturer
E) The lab bench height

**Student selects: B**

**Question 4: What preliminary experiment is needed before the inhibition study?**

A) A pilot experiment to test different spectrophotometer settings
B) Determination of the enzyme's Km and Vmax for arachidonic acid under the actual assay conditions, since the inhibitor substrate concentration series must bracket Km (typically 0.2x to 5x Km) for proper kinetic analysis
C) A test to determine the optimal enzyme storage conditions
D) A control to verify the spectrophotometer is calibrated
E) A pilot to determine the best plate reader

**Student selects: B**

### AI Solution (with intentional issues)

**AI Output:**

**Protocol:** 100 mM Tris pH 8.0, 25C. Substrate: 1-100 uM AA. Inhibitor: 0-50 uM. Add COX-2 (50 nM), add inhibitor, start with substrate, monitor A234 for 5 min. Plot Lineweaver-Burk, determine Ki from slope replot.

**Issues:** No hematin in buffer, no baseline Km determination, no time-dependence check, no DMSO controls, no IC50 pilot, substrate range not justified relative to Km, Lineweaver-Burk only (no nonlinear regression), no compound interference check.

### Framing Feedback

**Assessment:** The student correctly identified all four critical gaps: compound solubility and stability (B), time-dependent inhibition (B), buffer/cofactor requirements (B), and the prerequisite Km determination (B). All selections were the most scientifically rigorous option in each case. The student showed particular strength in recognizing that COX-2 inhibitors often exhibit time-dependent behavior, which would invalidate the standard approach. However, the MC format did not allow the student to flag potential compound interference with the 234 nm readout wavelength.

**Framing Grade: A**
All correct selections demonstrating strong understanding of enzyme kinetics experimental design prerequisites.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**AI Output (from Phase 1 above):**

**Question 5 (Judging): What is the MOST fundamental flaw in the AI's experimental design?**

A) The reaction time is too long
B) The AI proceeds directly to inhibition characterization without first determining the enzyme's baseline Km and Vmax, AND the buffer lacks hematin (an essential cofactor for COX-2) — meaning the enzyme may have minimal activity and the substrate concentrations are not rationally designed around Km
C) The substrate concentrations should be in molar instead of micromolar
D) The enzyme concentration is too high
E) The assay should be run at 37C instead of 25C

**Student selects: B**

**Question 6 (Steering): What is the BEST prompt to establish proper assay conditions?**

A) "Please determine Km first."
B) "Please add hematin to the buffer."
C) "Please add three preliminary steps: (1) Include 10 uM hematin in the buffer for COX-2 heme reconstitution and 0.5 mM phenol as peroxidase co-substrate. (2) Determine Km and Vmax using 8-10 arachidonic acid concentrations (0.2x to 5x expected Km of ~5 uM) by nonlinear regression. (3) Test for time-dependent inhibition by comparing activity with and without 30-min enzyme-inhibitor pre-incubation."
D) "Please optimize the buffer pH."
E) "Please increase the enzyme concentration."

**Student selects: C**

**Updated AI Output:**

**Revised Buffer:** 100 mM Tris-HCl pH 8.0, 10 uM hematin, 0.5 mM phenol, 25C

**Step 1 — Km/Vmax:** 10 substrate concentrations (1-100 uM AA), nonlinear regression fit, report Km, Vmax, R-squared.

**Step 2 — Time-dependence check:** Compare IC50 with/without 30-min pre-incubation. If shifted, use progress curve analysis; if unchanged, proceed with initial-rate Ki.

**Step 3 — Inhibition experiment:** Substrate at 6 concentrations around Km; inhibitor at 0, 1, 5, 10, 50 uM.

**Judging Feedback:**
Correct identification of the two most fundamental problems — missing cofactor and absent baseline kinetics. Without hematin, COX-2 is catalytically inactive, and without knowing Km, the substrate concentrations are arbitrary. The combined answer was the strongest option.

**Judging Grade: A**

**Steering Feedback:**
Option C was comprehensive, specifying the cofactor concentration, the Km determination protocol, and the time-dependence test in a single prompt. This correctly prioritizes the prerequisite experiments that must be done before any inhibition characterization.

**Steering Grade: A**

---

### Cycle 2

**Question 7 (Judging): What important experimental design elements are STILL missing?**

A) The experiment needs more substrate concentrations
B) The inhibitor concentration range has no rational basis (no IC50 pilot to guide it), there is no DMSO vehicle control despite the inhibitor likely requiring DMSO for solubility, and the analysis relies solely on Lineweaver-Burk plots without global nonlinear regression for statistical mechanism discrimination
C) The reaction volumes should be specified
D) The cuvette path length should be stated
E) The spectrophotometer bandwidth should be defined

**Student selects: B**

**Question 8 (Steering): What prompt best addresses the IC50, vehicle control, and analysis gaps?**

A) "Please add controls and better analysis."
B) "Please improve three aspects: (1) Add an IC50 pilot — 8-10 inhibitor concentrations in half-log spacing at [S] = Km, fit to a 4-parameter logistic to estimate potency, then set the full Ki experiment inhibitor range to 0.3x-3x IC50. (2) Include DMSO vehicle controls: fix DMSO at 0.5% in all wells and verify 0.5% DMSO does not affect COX-2 activity. (3) Add global nonlinear regression fitting to competitive, uncompetitive, and mixed models with AICc model comparison alongside the graphical Lineweaver-Burk and Dixon plots."
C) "Please test more inhibitor concentrations."
D) "Please add a positive control inhibitor."
E) "Please calculate IC50 from the Ki experiment data."

**Student selects: B**

**Updated AI Output:**

**Step 3 (revised) — IC50 Pilot:**
- 10 concentrations: 0.01-100 uM, half-log spacing, [S] = Km, 0.5% DMSO in all wells
- Fit: 4-parameter logistic (GraphPad Prism)
- Report: IC50, 95% CI, Hill slope

**DMSO Controls:**
- All wells: 0.5% DMSO final
- Verify: vehicle-only control retains >95% activity vs. no-DMSO control

**Step 4 — Full Ki Experiment:**
- Substrate: 6 concentrations (0.5x-5x Km)
- Inhibitor: 0, 0.3x IC50, 1x IC50, 3x IC50 (+ optional 0.1x, 10x)
- Triplicate per condition

**Revised Analysis:**
- Part A: Lineweaver-Burk (1/v vs. 1/[S]) and Dixon (1/v vs. [I]) — graphical mechanism diagnosis
- Part B: Global nonlinear regression to competitive, uncompetitive, and mixed models; AICc comparison; delta-AICc > 2 for model selection; report Ki with 95% CI

**Judging Feedback:**
The student correctly identified three distinct gaps in a single answer: the unsupported inhibitor concentration range, the absent vehicle control, and the reliance on graphical methods without statistical model comparison. The IC50 pilot is essential for practical experimental design — without it, the Ki experiment may use concentrations that are all too high or too low to observe the inhibition curve properly.

**Judging Grade: A**

**Steering Feedback:**
Option B was the strongest choice, addressing all three issues with specific protocols, quantitative criteria, and named analytical methods. The combination of graphical (Lineweaver-Burk, Dixon) and statistical (global regression, AICc) analysis methods provides both visual interpretation and rigorous mechanism discrimination. Well-constructed.

**Steering Grade: A**

---

### Cycle 3

**Question 9 (Judging): What practical assay controls are STILL absent?**

A) A positive control with a known COX-2 inhibitor
B) A compound spectral interference check (the inhibitor may absorb at 234 nm, confounding the readout) AND an enzyme stability control (COX-2 may lose activity over the assay time course, producing artifactual rate differences between early and late measurements)
C) A negative control with a compound that does not inhibit COX-2
D) A control for temperature fluctuation during the assay
E) A control for evaporation during the assay

**Student selects: A**

**Question 10 (Steering): What prompt best addresses remaining practical concerns?**

A) "Please add a celecoxib positive control."
B) "Please add practical controls: (1) Include a known COX-2 inhibitor (e.g., celecoxib, expected Ki ~40 nM) as a positive control to validate the assay. (2) Scan the compound's absorbance from 220-350 nm to check for interference at 234 nm — if absorbance is significant, switch to an Amplex Red fluorescence assay. (3) Test enzyme stability by measuring COX-2 activity at 0, 30, 60, and 120 min post-reconstitution."
C) "Please check if the assay is working properly."
D) "Please run a known inhibitor as a control."
E) "Please verify the spectrophotometer readings."

**Student selects: B**

**Updated AI Output:**

**Positive Control:**
- Include celecoxib (Sigma, catalog C7353) at 3 concentrations (10, 100, 1000 nM)
- Expected IC50: ~40 nM (literature value)
- If measured IC50 deviates >3-fold from expected: troubleshoot assay conditions

**Compound Spectral Interference:**
- Scan inhibitor (100 uM) in buffer without enzyme: 220-350 nm
- If A234 > 0.05: subtract compound blank from inhibitor-containing wells
- If A234 > 0.3: switch to Amplex Red/HRP fluorescence assay (Ex 560/Em 590)

**Enzyme Stability:**
- Measure COX-2 activity (at [S] = Km) at t = 0, 30, 60, 90, 120 min post-hematin reconstitution
- Acceptance: >90% residual activity at end of experimental window
- If unstable: add 0.1% BSA, prepare fresh enzyme per plate, or reduce experiment duration

**Judging Feedback:**
The student selected option A (positive control), which is a valid and important addition but is not the most critical remaining gap. The spectral interference check (option B) and enzyme stability control are more fundamental — spectral interference can produce false inhibition signals, and enzyme instability can produce artifactual differences between conditions measured at different times. Choosing the positive control over these two issues shows a preference for assay validation over systematic error prevention. The correct answer was B.

**Judging Grade: B**

**Steering Feedback:**
Despite the suboptimal judging selection, the student recovered by choosing option B for steering, which comprehensively addresses the positive control AND the spectral interference and enzyme stability controls. This is a good example of the steering prompt compensating for an imperfect judging diagnosis. The prompt was specific and actionable, with contingency plans (Amplex Red switch) and quantitative criteria (>90% stability, A234 thresholds).

**Steering Grade: A**

---

## COMPLETION

### Final Grades

| Skill | Grade | Rationale |
|-------|-------|-----------|
| **Framing** | **A-** | Correctly identified solubility, time-dependence, cofactor, and Km prerequisites through all four MC questions. |
| **Judging** | **B+/A-** | Strong in first two cycles (baseline kinetics, IC50/DMSO/statistics). Misjudged the final cycle by prioritizing positive control over spectral interference and stability controls. |
| **Steering** | **A-/A** | Consistently selected the most comprehensive prompts. Recovered well in the final cycle despite the judging miss. |

### Summary

The student (Rafael Torres) performed well overall, with particular strength in framing and steering. The framing questions were all answered correctly, showing solid understanding of enzyme kinetics prerequisites. Steering was consistently strong — the student reliably chose the most specific, multi-component prompts that drove substantial improvements in the AI output. The one notable weakness was in the final judging cycle, where the student prioritized a positive control (important but not the most critical gap) over spectral interference and enzyme stability controls (which address systematic errors that could invalidate all results). This suggests a tendency to think about assay validation (does the assay work?) before systematic error prevention (could the assay give wrong answers?). The recovery in steering — selecting the comprehensive option that covered all three controls — partially compensated for the judging miss.
