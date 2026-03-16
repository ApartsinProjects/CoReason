# Session 3 — False Memory Susceptibility Study for Eyewitness Testimony Reform (Multiple Choice)

**Challenge:** Memory > False Memory & Misinformation Effect
**Mode:** Multiple Choice
**Student:** Erik B.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> A national law reform commission wants a research proposal to investigate how false memories form during police interviews and whether current interviewing practices "make things worse." Design a study and deliver a full research proposal including hypotheses, method, stimuli, procedure, and analysis plan. The commission mentions that witnesses "often change their stories between interviews" and wonders whether this indicates "unreliable witnesses or bad interview techniques." They want results that are "admissible as scientific evidence" in court. The study should somehow be "ethical" while still testing how easily false memories can be implanted.

### Framing Options Presented

Which assumptions and constraints should you establish?

- **(A)** Use the DRM word-list paradigm since it has the strongest experimental control. Admissibility is not a methodological concern — courts will accept any peer-reviewed study. Ethics boards will approve anything if the debrief is adequate.
- **(B)** Use the misinformation paradigm (Loftus) with a mock crime video. Apply Daubert criteria for admissibility. Cannot implant traumatic memories — use peripheral details. Ecological validity matters since the commission cares about real interviews.
- **(C)** Use the misinformation paradigm with mock crime video. Apply Daubert criteria. Cannot implant traumatic memories. Question whether "story changes" might reflect normal forgetting or retrieval variability rather than false memory. Identify key moderators (age, stress, delay, confidence). Address demand characteristics. Note ecological validity constraints.
- **(D)** Focus on interviewer behavior only — use a field study observing real police interviews. No lab study needed since the commission wants real-world answers.
- **(E)** The commission is asking a legal question, not a scientific one. Recommend they consult legal scholars instead of running a study.

**Student selects: (C)**

### AI Solution (Generated from Student's Framing)

**Research Proposal: Misinformation and Interview Practice Effects on Witness Memory**

**Hypotheses:**
1. Misleading post-event information increases false detail reports
2. Suggestive interview questions amplify the misinformation effect beyond neutral questions
3. Story changes across interviews are partly attributable to misinformation exposure, not solely to unreliable witnesses

**Method:**
- Design: 2 (misinformation: present/absent) x 2 (interview: suggestive/neutral) between-subjects
- Participants: 200 community volunteers (age 18-65), stratified by age
- Stimuli: 5-minute mock crime video
- Moderators: age (continuous), encoding stress (manipulated via instructions), delay interval (48h vs 1 week)

**Procedure:**
1. Watch mock crime video
2. Delay period (48h or 1 week)
3. Misinformation group reads misleading "witness statement"; control reads accurate version
4. Interview (suggestive or neutral protocol)
5. Recognition test with source monitoring ("video," "summary," "both," "guessing")
6. Confidence rating (1-5) per item

**Analysis:**
- ANOVA on source-misattributed false memories (primary)
- Confidence-accuracy calibration curves
- Signal detection (d', criterion c) on source judgments
- Moderator analyses via hierarchical regression
- Pre-registered on OSF

### Framing Feedback

**Criticism:** The student selected the most comprehensive option. Option (C) correctly identifies the misinformation paradigm, applies Daubert criteria, raises the competing-explanation question (story changes may not indicate false memory), identifies moderators, flags demand characteristics, and notes ecological validity constraints. This framing would produce the most rigorous and commission-relevant proposal.

**Better Alternative:** Option **(C)** was the best available.

**Grade: A** — Comprehensive framing that addresses theoretical, methodological, ethical, and legal dimensions.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's solution?

- **(A)** The mock crime video is unrealistic — real witnesses experience live events, not videos
- **(B)** The design adds delay and stress as factors, expanding the factorial to an underpowered 2x2x2x(continuous age) design; the demand characteristics concern from framing is not addressed in the procedure
- **(C)** The design is underpowered for the expanded factorial; demand characteristics are unaddressed; the "encoding stress" manipulation via instructions has low ecological validity; the study lacks a no-interview control condition to measure baseline story change
- **(D)** The study should use within-subjects design for more power
- **(E)** The proposal is complete and well-designed — no significant issues

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Just increase the sample size to 1,000"
- **(B)** "Run a power analysis for the primary 2x2 effect. If the expanded factorial is underpowered, simplify — keep misinformation x interview as the core design and treat delay and stress as secondary. Add a demand characteristics check: post-experiment questionnaire asking participants what they think the study was about."
- **(C)** "Switch to a within-subjects design"
- **(D)** "Drop the moderator analyses entirely to simplify"
- **(E)** "Replace the mock crime video with real crime footage from police archives"

**Student selects: (B)**

#### Updated AI Output

**Power Analysis:**
- Primary 2x2 interaction (misinformation x interview): expected d = 0.50
- Required: n = 64 per cell (256 total) for 80% power
- Expanded factorial (adding delay as 2-level factor): 8 cells, n = 32/cell = 256 total for main effects only — underpowered for three-way interaction
- **Simplification:** Core design 2x2 (misinformation x interview), N = 260. Delay (48h vs 1 week) tested in a separate between-subjects comparison with the control condition only (N = 80, 40 per delay level)

**Demand Characteristics Check:**
- Post-experiment funnel debriefing questionnaire:
  1. "What do you think this study was about?"
  2. "Did you notice anything unusual about the written witness statement?"
  3. "Do you think any information in the statement was different from what you saw in the video?"
- Participants who correctly identify the misinformation manipulation flagged for sensitivity analysis (exclude and re-run main analysis)

#### Judging Feedback

**Criticism:** The student caught the power problem and the unaddressed demand characteristics — both important. However, option (C) was more thorough: it also identified that the "encoding stress" manipulation (via instructions) has low ecological validity — telling participants to "imagine this is stressful" is not the same as experiencing stress. Option (C) also noted the absence of a no-interview control condition, which is needed to measure how much story change occurs even without any misinformation or suggestive questions (the baseline rate the commission is asking about).

**Better Alternative:** Option **(C)** — also catches the stress manipulation weakness and the missing baseline condition.

**Grade: B** — Caught the power and demand issues, missed the stress validity and baseline condition.

#### Steering Feedback

**Criticism:** Option (B) was the best available — well-specified with a clear power analysis request, a sensible simplification strategy, and a specific demand characteristics check procedure. Excellent choice.

**Grade: A** — Precise, structured, and productive.

---

### Cycle 2

**Current AI Output:** *(revised version with power analysis, simplified design, demand check)*

#### Judging Sub-step

Which issues remain?

- **(A)** The encoding stress manipulation is still "via instructions" which has low ecological validity; there is no baseline (no-interview, no-misinformation) condition to measure natural story change rates
- **(B)** The power analysis used the wrong effect size — it should be larger
- **(C)** The encoding stress manipulation has low validity; no baseline condition for natural story change; the funnel debriefing should also assess whether participants altered their responses due to perceived experimenter expectations
- **(D)** The study needs a longitudinal component following participants for 6 months
- **(E)** The remaining issues are minor — the proposal is ready

**Student selects: (A)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Drop the stress manipulation — it has low ecological validity via instructions alone. Instead, note stress as a limitation and recommend future research with physiological stress induction. Add a no-misinformation, no-suggestive-interview control condition to establish the baseline rate of story change across two interviews — this directly answers the commission's question about whether changes indicate unreliable witnesses or bad techniques."
- **(B)** "Add a VR simulation to increase stress realism"
- **(C)** "The stress manipulation is fine — keep it as is"
- **(D)** "Add physiological measures (cortisol, heart rate) as stress indicators"
- **(E)** "Remove all moderator analyses and focus only on the main effect"

**Student selects: (A)**

#### Updated AI Output

**Design Revision:**
- Dropped: encoding stress manipulation (acknowledged as limitation; recommended for future research with validated stress induction protocols, e.g., Trier Social Stress Test)
- Added: No-manipulation control condition — participants watch video, experience 48h delay, and are interviewed with neutral questions and no misinformation exposure

**Final Design:**
- Condition 1: Misinformation + Suggestive interview (n = 65)
- Condition 2: Misinformation + Neutral interview (n = 65)
- Condition 3: No misinformation + Suggestive interview (n = 65)
- Condition 4: No misinformation + Neutral interview (n = 65)
- Condition 5: **Baseline control** — no misinformation + neutral interview + no misleading items in recognition test (n = 40)

Baseline condition answers the commission's core question: How much do witness accounts change between interviews even in the absence of any external influence?

**Revised Analysis:**
- Primary: 2x2 ANOVA (conditions 1-4) on source-misattributed false memories
- Secondary: Compare Condition 4 (best-practice interview) vs Condition 5 (baseline) to quantify the floor rate of apparent story change
- Moderators: age and delay as covariates in regression

#### Judging Feedback

**Criticism:** The student correctly identified both remaining issues — the weak stress manipulation and the missing baseline condition. Dropping stress and adding a baseline were the right decisions. However, option (C) also noted that the funnel debriefing should check not just whether participants guessed the study's purpose but also whether they adjusted their responses because of perceived experimenter expectations — a finer-grained demand characteristics assessment.

**Better Alternative:** Option **(C)** — also refines the demand characteristics check.

**Grade: A** — Caught the key design issues, missed the debriefing refinement.

#### Steering Feedback

**Criticism:** Option (A) was the best choice — it made two decisive design decisions (drop stress, add baseline), both well-justified, and directly connected the baseline condition to the commission's core question. Excellent strategic reasoning.

**Grade: A** — Clear, decisive, and well-connected to the applied goal.

---

### Cycle 3 (Final)

**Current AI Output:** *(final version with simplified design, baseline condition, demand check)*

#### Judging Sub-step

Which issues remain?

- **(A)** The funnel debriefing should also assess response adjustment, not just study purpose identification
- **(B)** The mock crime video is fundamentally flawed as a paradigm
- **(C)** The proposal is sufficiently complete for the scope of this problem
- **(D)** The analysis should use Bayesian statistics instead of frequentist
- **(E)** The study needs IRB approval documentation included in the proposal

**Student selects: (C)**

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

The student demonstrated strong performance, starting with the best framing option which set up a methodologically rigorous proposal. Judging was good but not comprehensive — the student caught the power issue and demand characteristics (Cycle 1), then the stress validity and baseline condition (Cycle 2), but consistently chose the less thorough option when a more complete one was available, missing secondary issues like the encoding stress validity in Cycle 1 and the debriefing refinement in Cycle 2. Steering was excellent throughout, with every selection being precisely targeted and driving clear improvements. The final proposal — with its simplified factorial, baseline condition, source monitoring, and confidence calibration — is well-suited to the commission's needs. To improve judging, practice selecting the option that catches the most issues, not just the most salient ones.
