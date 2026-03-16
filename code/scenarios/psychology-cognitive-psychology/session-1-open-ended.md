# Session 1 — Working Memory Training App for Air Traffic Controllers (Open-Ended)

**Challenge:** Memory > Working Memory > Capacity Limits & Chunking
**Mode:** Open-Ended (Structured Sections)
**Student:** Lena V.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a cognitive training application for air traffic controllers that "improves their working memory." The app should run daily sessions of "about 15 minutes." Controllers currently struggle with "holding multiple flight paths in mind" during peak hours. The aviation authority wants evidence the training "actually transfers to job performance." Deliver a training protocol document specifying the cognitive tasks, difficulty progression, and a measurement plan to test transfer. Some controllers are "experienced veterans" while others are "fresh out of training school."

### Student's Framing Response

> **Assumption: "Working memory" here refers to visuospatial working memory, since flight path tracking is fundamentally spatial.**
>
> **Assumption: "Improvement" means an increase in the number of items that can be simultaneously maintained and updated, measurable via complex span tasks.**
>
> **Constraint: The 15-minute daily session limits how many training trials can fit — I'll estimate roughly 30-40 adaptive trials per session.**
>
> **Question: "Transfer to job performance" — I'll assume this means measurable improvement on simulated ATC scenarios, not just lab-based WM tests.**

### AI Solution (Generated from Student's Framing)

**Training Protocol: ATC Working Memory Enhancement Program**

**Core Training Task:** Spatial n-back with flight path elements
- Participants view a simulated radar screen with aircraft icons appearing at different grid positions
- They must indicate when the current position matches the position n steps back
- Sessions start at 2-back and adapt upward when accuracy > 85% across 20 trials

**Difficulty Progression:**
| Level | n-back | Distractors | Update rule |
|-------|--------|-------------|-------------|
| 1     | 2-back | None        | Position only |
| 2     | 3-back | Static icons | Position only |
| 3     | 3-back | Moving icons | Position + heading |
| 4     | 4-back | Moving icons | Position + heading + altitude |

**Measurement Plan:**
- Pre-test: Operation Span Task (OSPAN) + simulated ATC scenario
- Training: 20 sessions over 4 weeks
- Post-test: OSPAN + different simulated ATC scenario
- Follow-up: Job performance ratings at 3 months

### Framing Feedback

**Criticism:** The student correctly identified visuospatial WM as the relevant component and quantified sessions per day — both useful. However, the student did not distinguish between the visuospatial sketchpad (storage) and the central executive (updating/manipulation), which matters because n-back primarily trains updating, not storage capacity. The student also assumed transfer to simulated ATC scenarios without questioning whether the training task's surface features overlap enough with ATC demands to produce transfer, or whether any transfer effect found would generalize beyond the specific simulation used. Finally, the student did not address individual differences — experienced controllers may already be at ceiling on basic WM capacity.

**Better Alternative Framing:**
> "Assumption: The bottleneck is most likely visuospatial updating via the central executive, not raw storage capacity — controllers need to revise, not just hold, flight path representations. Question: Does the evidence base support transfer from n-back training to complex real-world tasks? Meta-analyses are mixed — I need to address this directly. Constraint: Experienced controllers may already have high WM capacity through domain-specific chunking; the training may benefit novices more. Question: What specific ATC error types are attributed to WM failures — this determines which WM component to target."

**Grade: B** — Good identification of the visuospatial component, but missed the storage-vs-updating distinction and the fragile evidence base for far transfer.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: The AI uses n-back as the sole training task, but"
    description: "Gap: The AI uses n-back as the sole training task, but meta-analyses (e.g., Melby-Lervåg & Hulme, 2013) show that n-back training produces near transfer to untrained n-back tasks but weak or no far transfer to complex cognition. The protocol needs to justify why this time it would be different. Error: The measurement plan has no control group — without a comparison condition (active control or waitlist), any improvement could be due to practice effects, motivation, or familiarity with the ATC simulation."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Revise: Add an active control group that trains on a"
    description: "Revise: Add an active control group that trains on a visually similar task that does not tax working memory updating (e.g., visual search without a memory component). Justify why this control isolates WM training effects from general practice or motivation."
  - name: "Add: Address the far transfer problem explicitly"
    description: "Add: Address the far transfer problem explicitly — cite at least one meta-analytic finding on n-back transfer and explain what design features of your protocol might overcome the typical limitation."

#### Updated AI Output

**Revised Training Protocol**

**Training Group:** Adaptive spatial n-back (as described above)
**Active Control Group:** Visual search task — same radar-screen display, participants locate a specified target icon among distractors. Visually matched, engages attention, but no WM updating component.

**Transfer Justification:**
Prior meta-analyses (Melby-Lervåg & Hulme, 2013; Soveri et al., 2017) find that standard n-back produces near transfer but limited far transfer. This protocol addresses this by:
1. **Domain-specific stimuli:** Training uses ATC-relevant spatial configurations rather than abstract grids, increasing representational overlap with the transfer task
2. **Process overlap:** Both training and transfer tasks require continuous spatial updating under time pressure — the core cognitive process is shared
3. **Adaptive difficulty:** Continuous calibration ensures participants train near their capacity limit, which theoretical accounts (Klingberg, 2010) suggest is necessary for capacity expansion

**Revised Measurement Plan:**
- Randomized controlled design: Training group (n=40) vs Active control (n=40)
- Pre/post: OSPAN, Symmetry Span, ATC simulation (standardized scenario set)
- Primary outcome: ATC simulation error rate (far transfer)
- Secondary outcome: WM span score change (near transfer)
- Follow-up: Supervisor-rated job performance at 3 months
- Analysis: Mixed ANOVA (Group x Time), with effect sizes and confidence intervals

#### Judging Feedback

**Criticism:** The student identified the two most critical scientific problems — the weak transfer evidence and the absence of a control group. These are the issues that would undermine the study's conclusions. However, the student missed that the measurement plan still relies on supervisor-rated job performance at follow-up, which is a subjective measure vulnerable to rater bias and unlikely to be sensitive enough to detect WM-specific changes. The student also did not question whether the OSPAN (a verbal-numerical task) is the right near-transfer measure for a visuospatially focused training program.

**Better Alternative Judgement:**
> "Gap: No control group — cannot distinguish training effects from practice or motivation. Gap: Far transfer from n-back is poorly supported — protocol needs theoretical justification. Error: OSPAN is a verbal-numerical measure being used to assess visuospatial training transfer — Symmetry Span or Corsi Blocks would be more appropriate near-transfer measures. Gap: Supervisor ratings at follow-up are too subjective and insensitive."

**Grade: A** — Caught the two most important methodological flaws but missed the measure-mismatch and subjective outcome issues.

#### Steering Feedback

**Criticism:** The steering was well-targeted — requesting an active control group and a transfer justification directly addressed the identified issues. The specification of what the control task should look like (visually similar, no WM updating) was particularly precise. The student could have also pushed for more appropriate near-transfer measures.

**Better Alternative Steering:**
> "Revise: Add an active control group with a visually matched non-WM task. Address the far transfer evidence directly. Also replace or supplement OSPAN with a visuospatial WM measure (Symmetry Span, Corsi Blocks) since the training is visuospatial."

**Grade: A** — Good direction, missed one measurement issue.

---

### Cycle 2

**Current AI Output:** *(revised version with control group and transfer justification)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: The sample size (n=40 per group) is stated without"
    description: "Gap: The sample size (n=40 per group) is stated without a power analysis. For a far transfer effect, which meta-analyses suggest is d=0.2-0.3 at best, n=40 would be underpowered. Gap: The protocol does not specify how adaptive difficulty is calibrated — what algorithm adjusts the n-back level? Without this, the protocol is not replicable."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Include a power analysis for the primary outcome"
    description: "Add: Include a power analysis for the primary outcome (ATC simulation error rate). If the expected effect size is d=0.3 based on meta-analytic estimates, calculate the required sample size for 80% power at alpha=.05."
  - name: "Specify: Define the adaptive algorithm"
    description: "Specify: Define the adaptive algorithm — what accuracy threshold triggers level increase/decrease, over how many trials, and what is the step size?"

#### Updated AI Output

**Power Analysis:**
- Expected effect size: d = 0.30 (based on Soveri et al., 2017, upper bound for process-overlap transfer)
- Alpha: .05, Power: .80, two-tailed independent-samples test
- Required n: 176 per group (352 total)
- Feasibility note: With 80 controllers available, the study is underpowered for far transfer. Recommendation: treat ATC simulation as exploratory; power the study for near transfer (expected d = 0.60, requiring n = 45 per group)

**Adaptive Algorithm:**
```
After each block of 20 trials:
  if accuracy >= 85%: increase n-back level by 1
  if accuracy <= 65%: decrease n-back level by 1
  else: maintain current level
Minimum level: 2-back
Maximum level: 6-back
First session always starts at 2-back
Subsequent sessions start at the previous session's modal level
```

#### Judging Feedback

**Criticism:** The student identified two genuine gaps — the missing power analysis and the unspecified adaptive algorithm. The power analysis request was particularly mature, showing understanding that small expected effect sizes require large samples. However, the student did not notice that the AI's revised measurement plan now includes both OSPAN and Symmetry Span, but the training is visuospatial — the student should have questioned why OSPAN is still included as a primary measure rather than relegated to a secondary discriminant validity check. The student also did not address the 3-month follow-up relying solely on supervisor ratings.

**Better Alternative Judgement:**
> "Gap: No power analysis — need to size the study for the expected (small) effect. Gap: Adaptive algorithm not specified — not replicable. Gap: OSPAN should be secondary, not co-primary, since training is visuospatial. Gap: 3-month follow-up uses only supervisor ratings — add objective performance metrics from ATC simulation logs."

**Grade: A** — Good statistical sophistication, missed measure hierarchy and follow-up measurement quality.

#### Steering Feedback

**Criticism:** The steering was precise and productive — the power analysis request surfaced a critical feasibility constraint, and the adaptive algorithm specification made the protocol replicable. Both instructions were specific enough that the AI could act on them without ambiguity.

**Grade: A** — Clear, specific, and drove meaningful methodological improvements.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with power analysis and adaptive algorithm)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor: The protocol is now well-specified"
    description: "Minor: The protocol is now well-specified. The power analysis honestly acknowledges the feasibility constraint. The adaptive algorithm is clear and replicable. Remaining gap: The 3-month follow-up still relies on supervisor ratings, which is subjective, but this may be acceptable given practical constraints."

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

The student demonstrated solid knowledge of the WM training literature, catching the far transfer problem and missing control group early. Framing was reasonable but missed the storage-vs-updating distinction and individual difference concerns. Judging consistently targeted the most important methodological issues (no control, no power analysis, unspecified algorithm) but repeatedly overlooked measurement validity questions — whether the right constructs were being measured with the right instruments. Steering was the strongest skill, with each correction being specific, actionable, and driving genuine improvements. To improve, the student should practice asking "is this measure actually measuring the construct I care about?" at each stage.
