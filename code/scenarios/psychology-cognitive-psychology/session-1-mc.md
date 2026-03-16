# Session 1 — Working Memory Training App for Air Traffic Controllers (Multiple Choice)

**Challenge:** Memory > Working Memory > Capacity Limits & Chunking
**Mode:** Multiple Choice
**Student:** Mika J.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a cognitive training application for air traffic controllers that "improves their working memory." The app should run daily sessions of "about 15 minutes." Controllers currently struggle with "holding multiple flight paths in mind" during peak hours. The aviation authority wants evidence the training "actually transfers to job performance." Deliver a training protocol document specifying the cognitive tasks, difficulty progression, and a measurement plan to test transfer. Some controllers are "experienced veterans" while others are "fresh out of training school."

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates a solution?

- **(A)** Assume working memory is a single general capacity. Train it with any cognitively demanding task (e.g., Sudoku, crosswords). Measure improvement with a general IQ test.
- **(B)** Assume the relevant component is visuospatial working memory. Train with spatial n-back. Measure with operation span and a simulated ATC scenario. Session length ~15 minutes.
- **(C)** Assume the bottleneck is visuospatial updating (central executive), not raw storage. Question whether n-back far transfer evidence is strong enough. Note that experienced controllers may already be at WM ceiling via domain-specific chunking. Ask what specific ATC errors are WM-related. Require a control group design.
- **(D)** Assume working memory cannot be trained — focus instead on designing external memory aids (checklists, display enhancements) that offload WM demands.
- **(E)** Skip framing — the problem is clear enough. Ask the AI to design a brain training app.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

**Training Protocol: ATC Working Memory Enhancement Program**

**Core Training Task:** Spatial n-back with flight path elements
- Participants view a simulated radar screen with aircraft icons appearing at grid positions
- Indicate when current position matches position n steps back
- Start at 2-back, adapt upward when accuracy > 85%

**Difficulty Progression:**

| Level | n-back | Distractors | Update rule |
|-------|--------|-------------|-------------|
| 1     | 2-back | None        | Position only |
| 2     | 3-back | Static icons | Position only |
| 3     | 3-back | Moving icons | Position + heading |
| 4     | 4-back | Moving icons | Position + heading + altitude |

**Measurement Plan:**
- Pre-test: OSPAN + simulated ATC scenario
- Training: 20 sessions over 4 weeks
- Post-test: OSPAN + different ATC scenario
- Follow-up: Job performance ratings at 3 months

### Framing Feedback

**Criticism:** Option (B) correctly targets visuospatial WM and proposes reasonable measures. However, it does not distinguish storage from updating, does not question the transfer evidence base, ignores individual differences between experts and novices, and does not require a control group. Option (C) was stronger because it identified the specific subcomponent (central executive updating), questioned the far transfer literature, raised the expertise ceiling issue, and demanded controlled comparison.

**Better Alternative:** Option **(C)** — it addresses the storage-vs-updating distinction, transfer skepticism, expertise effects, and experimental control.

**Grade: B** — Correct general direction, but missed critical methodological and theoretical nuances.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The n-back task is too easy — it should start at 5-back for air traffic controllers
- **(B)** No control group in the measurement plan; far transfer from n-back is poorly supported by meta-analyses; OSPAN is a verbal-numerical measure being used for visuospatial training
- **(C)** No control group; far transfer is poorly supported; OSPAN is a measure mismatch; supervisor ratings at follow-up are subjective and insensitive; the protocol does not specify the adaptive algorithm
- **(D)** The training should use dual n-back instead of spatial n-back for stronger effects
- **(E)** The protocol is well-designed and scientifically sound — no major issues

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Make the training harder and longer"
- **(B)** "Add a control group and address the transfer problem. The control group should do a visually similar task without WM updating. Cite meta-analytic evidence on n-back transfer and explain what design features of this protocol might overcome typical limitations."
- **(C)** "Replace n-back with a dual-task paradigm"
- **(D)** "Add more dependent variables to the measurement plan"
- **(E)** "Switch to EEG-based neurofeedback instead of behavioral training"

**Student selects: (B)**

#### Updated AI Output

**Revised Training Protocol**

**Training Group:** Adaptive spatial n-back on radar-style display
**Active Control Group:** Visual search on identical display — locate specified target among distractors, no WM updating required

**Transfer Justification:**
Meta-analyses (Melby-Lervåg & Hulme, 2013; Soveri et al., 2017) show near transfer from n-back but limited far transfer. This protocol addresses limitations by:
1. Domain-specific stimuli (ATC radar configurations)
2. Process overlap (spatial updating under time pressure in both training and transfer)
3. Adaptive difficulty maintaining near-capacity training

**Revised Measurement Plan:**
- RCT: Training (n=40) vs Active Control (n=40)
- Pre/post: OSPAN, Symmetry Span, ATC simulation error rate
- Primary outcome: ATC simulation error rate
- Secondary: WM span change
- Follow-up: Supervisor job ratings at 3 months
- Analysis: Mixed ANOVA, effect sizes, CIs

#### Judging Feedback

**Criticism:** The student caught three important issues — the missing control group, the weak transfer evidence, and the OSPAN mismatch. However, option (C) was more comprehensive: it also identified the unspecified adaptive algorithm (making the protocol non-replicable) and the subjective supervisor ratings at follow-up. The student captured the biggest issues but missed these secondary gaps.

**Better Alternative:** Option **(C)** — includes all of (B)'s catches plus the adaptive algorithm gap and follow-up measure quality.

**Grade: A** — Caught the most critical problems, missed the replicability and follow-up issues.

#### Steering Feedback

**Criticism:** Option (B) was the best available — specific about the control group design, requested engagement with the transfer literature, and targeted the identified issues. Well-chosen.

**Grade: A** — Precise, well-specified, and productive.

---

### Cycle 2

**Current AI Output:** *(revised version with control group and transfer justification)*

#### Judging Sub-step

Which issues remain in the AI's updated solution?

- **(A)** The sample size (n=40 per group) is likely underpowered for far transfer effects; the adaptive algorithm is unspecified
- **(B)** The control group design is flawed — visual search also uses working memory
- **(C)** The sample size is underpowered; the adaptive algorithm is unspecified; OSPAN should be secondary not co-primary; supervisor ratings need supplementation with objective metrics
- **(D)** The study needs a placebo control instead of an active control
- **(E)** No significant issues remain

**Student selects: (A)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Run a power analysis for the primary outcome. If far transfer d=0.3, calculate required n for 80% power. Also specify the adaptive algorithm: accuracy thresholds, block sizes, and step rules."
- **(B)** "Just increase the sample to n=200 per group"
- **(C)** "Add a neuroimaging component to the study"
- **(D)** "Switch to a within-subjects design to increase power"
- **(E)** "Remove the follow-up assessment to save resources"

**Student selects: (A)**

#### Updated AI Output

**Power Analysis:**
- Expected d = 0.30 for far transfer; alpha = .05, power = .80
- Required: n = 176 per group (352 total)
- With 80 available controllers: underpowered for far transfer; recommend near transfer as primary (d = 0.60, n = 45/group)

**Adaptive Algorithm:**
```
After each block of 20 trials:
  accuracy >= 85%: n-back level + 1
  accuracy <= 65%: n-back level - 1
  else: maintain
Range: 2-back to 6-back
Session 1 starts at 2-back
Subsequent sessions: start at previous session's modal level
```

#### Judging Feedback

**Criticism:** The student correctly identified the power and algorithm gaps. However, option (C) was more thorough — it also noted that OSPAN should be demoted from co-primary status (since training is visuospatial) and that supervisor ratings need objective supplementation. The student consistently catches the top-tier issues but misses measurement hierarchy concerns.

**Better Alternative:** Option **(C)** — also addresses measure prioritization and follow-up quality.

**Grade: A** — Solid but incomplete issue identification.

#### Steering Feedback

**Criticism:** Option (A) was excellent — requesting a specific power analysis with parameters and a fully specified adaptive algorithm. Both requests were precise and produced actionable improvements.

**Grade: A** — Specific, well-parameterized, and effective.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with power analysis and adaptive algorithm)*

#### Judging Sub-step

Which issues remain?

- **(A)** The power analysis reveals a fatal feasibility problem — the study should be abandoned
- **(B)** OSPAN should be secondary rather than co-primary since training is visuospatial
- **(C)** The protocol is sufficiently complete for the scope of this problem
- **(D)** The adaptive algorithm is too aggressive — 20 trials is too few for a stable accuracy estimate
- **(E)** The entire approach is wrong — WM training doesn't work

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

The student showed good knowledge of the WM training literature and consistently selected corrections that drove substantial improvements. Framing identified the right WM component but lacked depth on the storage-updating distinction and individual differences. Judging caught the most critical issues in every cycle (missing control, underpowered sample, unspecified algorithm) but repeatedly missed measurement validity concerns — specifically, whether the chosen instruments matched the construct being trained. Steering was the strongest skill throughout, with every selection being specific, well-justified, and productive. To improve judging, practice asking "does this measure actually tap the construct that was trained?" after identifying the primary issues.
