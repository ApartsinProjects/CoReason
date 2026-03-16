# Session 5 — Cognitive Load Management System for Online Learning (Multiple Choice)

**Challenge:** Decision-Making & Reasoning > Dual-Process Theories > Cognitive Load & Depletion
**Mode:** Multiple Choice
**Student:** Clara H.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> An online university wants to redesign its learning platform to "reduce cognitive overload" in students taking statistics courses. Build a design specification for an adaptive learning system that monitors student cognitive load in real time and adjusts content delivery accordingly. Deliver a system architecture document with the sensing strategy, adaptation rules, and a pilot study plan. The platform serves "tens of thousands of students" worldwide with "varying math backgrounds." Students complain that the current system "dumps too much information at once" and that they "zone out" during video lectures. The university wants something "evidence-based" and "scalable."

### Framing Options Presented

Which assumptions and constraints should you establish?

- **(A)** Cognitive overload is caused by video lectures being too long. Solution: cut all videos to 5 minutes. No adaptive system needed.
- **(B)** Target extraneous load reduction. Use browser-based behavioral indicators (no special hardware). Ground in Cognitive Load Theory. System must scale to tens of thousands without human tutors.
- **(C)** Distinguish intrinsic, extraneous, and germane load — system should reduce extraneous, preserve germane. Question whether browser-based behavioral indicators validly proxy cognitive load. Address cold-start problem for new students. Ground in CLT + CTML. Require scalable, automated sensing.
- **(D)** Use EEG headsets for each student to measure cognitive load directly — this is the only valid approach.
- **(E)** Cognitive load is not a useful construct — focus on motivation and engagement instead.

**Student selects: (C)**

### AI Solution (Generated from Student's Framing)

**System Architecture: Adaptive Cognitive Load Management**

**1. Sensing Strategy (Browser-based, with validity caveats)**

| Indicator | Measurement | Load Signal | Validity Concern |
|-----------|-------------|-------------|------------------|
| Video pause/rewind rate | Event tracking | High → possible overload | Could be note-taking |
| Quiz error rate | Accuracy | High → overload | Could be carelessness |
| Time on problems | Timer | Extreme values → over/under-load | Context-dependent |
| Scroll speed | Scroll events | Very fast → disengagement | Could be prior knowledge |
| Voluntary break timing | Session timer | Short sessions → fatigue | Could be external interruption |

**2. Adaptation Rules (Bidirectional)**

| Condition | Adaptation |
|-----------|------------|
| Overload signals (high error + slow problems + rewinds) | Break content into smaller chunks; insert worked examples; offer prerequisite review |
| Under-load signals (high accuracy + fast completion + no pauses) | Skip review material; advance to harder problems; offer extension challenges |
| Ambiguous signals | No adaptation; continue collecting data |

**3. Cold-Start Protocol**
- Onboarding: 5-minute math prerequisite quiz + self-reported familiarity
- First 3 sessions: observation mode (no adaptations, establish baselines)
- Session 4+: personalized thresholds based on individual baselines

**4. Pilot Study Plan**
- A/B test: Adaptive (n=250) vs Current platform (n=250)
- 14-week semester of introductory statistics
- Outcomes: completion rate, final exam, NASA-TLX, engagement metrics

### Framing Feedback

**Criticism:** The student selected the most comprehensive option. Option (C) correctly distinguishes the three types of cognitive load (and the crucial point that germane load should be preserved), questions indicator validity, addresses the cold-start problem, and cites the right theoretical frameworks. This produced a noticeably richer AI solution than option (B) would have — the solution already includes validity caveats, bidirectional adaptation, and a cold-start protocol.

**Better Alternative:** Option **(C)** was the best available.

**Grade: A** — Comprehensive framing that produced a strong initial solution.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's solution?

- **(A)** The system should use wearable biosensors, not browser-based indicators
- **(B)** The behavioral indicators lack empirical validation as load proxies; the adaptation thresholds are unspecified; the pilot study cannot isolate the adaptive algorithm from the content redesign it triggers
- **(C)** Indicators lack validation; thresholds unspecified; pilot confounds adaptation with content changes; the system has no anti-gaming safeguard (students could underperform to get easier content); the "ambiguous signals" rule means the system often does nothing, reducing its utility
- **(D)** The system needs more indicators — at least 15-20 behavioral signals
- **(E)** The solution is well-designed — no significant issues

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Add more behavioral indicators"
- **(B)** "Design a Phase 0 validation study: have 60 students complete modules in a lab while logging behavioral indicators alongside NASA-TLX, dual-task probe RT, and pupillometry. Retain indicators with r > 0.30 correlated with at least 2 criterion measures. Use validated indicators to build a multi-signal classifier. Derive thresholds empirically rather than setting them a priori. Add an anti-gaming check: flag students whose performance drops sharply after receiving easier content and revert their difficulty level. For the pilot, include a 'content-redesign-only' control arm (shorter videos, checkpoints, but no adaptive algorithm) to isolate the adaptation effect."
- **(C)** "Just increase the sample size"
- **(D)** "Replace browser-based sensing with eye tracking"
- **(E)** "Remove the cold-start protocol — it's unnecessary complexity"

**Student selects: (B)**

#### Updated AI Output

**Phase 0: Indicator Validation Study (Lab-based, N=60)**

Protocol:
1. Students complete 4 statistics modules in controlled lab setting
2. Behavioral indicators logged concurrently with:
   - NASA-TLX (self-report, after each module)
   - Dual-task auditory probe RT (slower RT = higher load)
   - Pupillometry (tonic pupil dilation)
3. Validation criterion: retain indicators with r > 0.30 correlated with >= 2 criterion measures
4. Build multi-signal load classifier (logistic regression or random forest) using validated indicators

**Empirical Threshold Derivation:**
- Phase 0 data used to set initial population thresholds
- Pilot (Phase 1) includes threshold optimization via grid search
- Optimize for learning outcome (pre-post quiz gain) with constraint on false alarm rate < 20%

**Anti-Gaming Safeguard:**
- Monitor for inconsistency pattern: sharp performance drop followed by high accuracy on easier content
- If detected: freeze adaptation for 2 sessions, then re-assess
- Flag pattern for instructor review in dashboard

**Revised Pilot Design (3-arm):**
- Arm 1: Full adaptive system (sensing + adaptation rules)
- Arm 2: Content redesign only (shorter segments, checkpoints, worked examples available, but NO adaptive triggering — all students get same sequence)
- Arm 3: Current platform (no changes)
- Comparison: Arm 1 vs Arm 2 isolates the adaptive algorithm; Arm 1 vs Arm 3 measures total effect; Arm 2 vs Arm 3 measures content redesign effect

#### Judging Feedback

**Criticism:** The student selected the most comprehensive option and the steering produced a substantially improved design. The five-issue identification was thorough, and the steering packed multiple precise improvements into a coherent instruction. The 3-arm pilot design was a particularly strong addition. One gap remains: the student did not question whether the current content has been analyzed for element interactivity — in CLT, element interactivity determines intrinsic load, and without a task analysis of the statistics curriculum, the system cannot distinguish intrinsic from extraneous load at the content level.

**Better Alternative Judgement:** Option **(C)** was already the best available.

**Grade: A** — Comprehensive issue identification.

#### Steering Feedback

**Criticism:** Option (B) was the best available and was excellently specified — validation study protocol, threshold derivation, anti-gaming safeguard, and 3-arm pilot design were all precise and actionable. This was an unusually strong steering response.

**Grade: A** — Comprehensive, specific, and methodologically sophisticated.

---

### Cycle 2

**Current AI Output:** *(revised version with validation study, empirical thresholds, anti-gaming, 3-arm pilot)*

#### Judging Sub-step

Which issues remain?

- **(A)** The system needs to incorporate student affect detection (facial expression analysis via webcam)
- **(B)** The statistics content has not been analyzed for element interactivity — without knowing which topics have high intrinsic load (e.g., conditional probability, hypothesis testing) vs low (descriptive statistics, data visualization), the system cannot distinguish intrinsic from extraneous load sources
- **(C)** The content lacks element interactivity analysis; the system should incorporate prerequisite knowledge graphs to sequence content optimally; the Phase 0 sample (N=60) may not generalize to the diverse global student population
- **(D)** The random forest classifier will overfit on 60 participants
- **(E)** No significant issues remain — the system is well-specified

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Add facial expression detection via webcam"
- **(B)** "Conduct an element interactivity analysis of the statistics curriculum: rate each topic for element interactivity (number of elements that must be processed simultaneously). High-interactivity topics (e.g., conditional probability, ANOVA interpretation) have high intrinsic load and need more aggressive extraneous load reduction. Low-interactivity topics (e.g., reading graphs, computing means) tolerate more germane load challenge. Use this analysis to parameterize the adaptation rules per topic."
- **(C)** "Replace the statistics course with a simpler subject"
- **(D)** "Add more arms to the pilot study"
- **(E)** "Switch from random forest to deep learning for the classifier"

**Student selects: (B)**

#### Updated AI Output

**Element Interactivity Analysis (Statistics Curriculum)**

| Topic | Element Interactivity | Intrinsic Load | Adaptation Implication |
|-------|----------------------|----------------|----------------------|
| Descriptive statistics (mean, median) | Low (2-3 elements) | Low | Tolerate higher challenge; use productive failure |
| Data visualization (reading charts) | Low (2-3 elements) | Low | Advance quickly if mastered |
| Probability (single events) | Medium (3-5 elements) | Medium | Standard adaptation rules |
| Conditional probability | High (5-7 elements) | High | Aggressive scaffolding; worked examples first |
| Hypothesis testing (full procedure) | Very high (7+ elements) | Very high | Break into sub-steps; multiple worked examples before practice |
| ANOVA interpretation | Very high (7+ elements) | Very high | Sequential element introduction; mastery gates between components |

**Adaptation Rule Parameterization:**
- High-intrinsic-load topics: lower overload detection threshold (intervene sooner), more scaffolding in response
- Low-intrinsic-load topics: higher overload threshold (allow productive struggle), less scaffolding, more challenge-up triggers
- Mapping: each topic tagged with interactivity rating; adaptation rule thresholds adjusted by rating

#### Judging Feedback

**Criticism:** The student correctly identified the missing element interactivity analysis — this is the foundational content analysis that CLT requires before any adaptive system can be designed. The steering produced a useful curriculum analysis with appropriate adaptation implications. However, option (C) was more complete: it also noted that the Phase 0 validation sample (N=60 in a lab) may not generalize to the diverse global student population (different languages, devices, internet speeds), and suggested incorporating prerequisite knowledge graphs to sequence content. The student caught the most theoretically important gap but missed practical generalizability concerns.

**Better Alternative:** Option **(C)** — also addresses sample generalizability and content sequencing.

**Grade: A** — Caught the key theoretical gap, missed the generalizability and sequencing issues.

#### Steering Feedback

**Criticism:** Option (B) was the best available — the element interactivity analysis with per-topic load ratings and differentiated adaptation rules was precisely what was needed. The parameterization approach (adjusting thresholds by interactivity rating) was a sophisticated design decision.

**Grade: A** — Specific, theoretically grounded, and directly actionable.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with element interactivity analysis, validation study, cold-start, anti-gaming, 3-arm pilot)*

#### Judging Sub-step

Which issues remain?

- **(A)** The Phase 0 lab sample may not generalize to the global student population using different devices and connections
- **(B)** The element interactivity ratings are subjective and should be validated
- **(C)** The system architecture is sufficiently complete for the scope of this problem
- **(D)** The system should also adapt based on student emotional state
- **(E)** The pilot study is too short at 14 weeks

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

The student performed strongly across all phases, starting with the best framing option which set up a comprehensive initial solution. Judging was thorough in Cycle 1 (catching all five issues including anti-gaming and pilot confounds) and identified the critical element interactivity gap in Cycle 2, though the less comprehensive option was chosen both times, missing generalizability and sequencing concerns. Steering was consistently excellent — the Phase 0 validation study, 3-arm pilot, and element interactivity analysis were all precisely specified and methodologically sound. The final system architecture is well-grounded in CLT, addresses cold-start, includes empirical validation, distinguishes load types, and has a rigorous evaluation plan. To improve further, the student should check whether laboratory validation results will generalize to the target deployment environment.
