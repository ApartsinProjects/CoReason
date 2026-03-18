# Session 5 — Cognitive Load Management System for Online Learning (Open-Ended)

**Challenge:** Decision-Making & Reasoning > Dual-Process Theories > Cognitive Load & Depletion
**Mode:** Open-Ended (Structured Sections)
**Student:** Yuki N.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> An online university wants to redesign its learning platform to "reduce cognitive overload" in students taking statistics courses. Build a design specification for an adaptive learning system that monitors student cognitive load in real time and adjusts content delivery accordingly. Deliver a system architecture document with the sensing strategy, adaptation rules, and a pilot study plan. The platform serves "tens of thousands of students" worldwide with "varying math backgrounds." Students complain that the current system "dumps too much information at once" and that they "zone out" during video lectures. The university wants something "evidence-based" and "scalable."

### Student's Framing Response

> **Assumption: "Cognitive overload" refers to extraneous cognitive load — load caused by poor instructional design rather than by the inherent complexity of the material.**
>
> **Question: "Real-time monitoring" — I'll assume this means browser-based behavioral indicators only (no special hardware), since the platform must scale to tens of thousands of students.**
>
> **Assumption: "Evidence-based" means grounded in Cognitive Load Theory (Sweller, 1988) and the Cognitive Theory of Multimedia Learning (Mayer, 2009).**
>
> **Constraint: "Scalable" means the system must work with automated indicators and rules, not human tutors monitoring each student.**

### AI Solution (Generated from Student's Framing)

**System Architecture: Adaptive Cognitive Load Management**

**1. Sensing Strategy (Browser-based Behavioral Indicators)**

| Indicator | Measurement | Load Signal |
|-----------|-------------|-------------|
| Video pause/rewind rate | Event tracking | High frequency → overload |
| Time on practice problems | Timer | Very fast (guessing) or very slow (struggling) |
| Quiz error rate | Accuracy tracking | High errors → overload |
| Scroll speed on text content | Scroll event tracking | Very fast → skimming/disengagement |
| Session duration before voluntary break | Timer | Short sessions → fatigue/overload |

**2. Adaptation Rules**

| Trigger | Adaptation |
|---------|------------|
| Rewind rate > 2x per segment | Break video into shorter segments; offer text summary |
| Quiz error > 60% | Insert prerequisite review module |
| Time on problem > 2 SD above mean | Offer worked example |
| Scroll speed > threshold | Insert interactive checkpoint question |
| Session < 5 min for 3 consecutive days | Suggest schedule adjustment; simplify next session |

**3. Pilot Study Plan**
- A/B test: Adaptive system (treatment) vs current platform (control)
- Participants: 500 students in introductory statistics
- Duration: One semester (14 weeks)
- Outcomes: Course completion rate, final exam score, self-reported cognitive load (NASA-TLX), engagement metrics

### Framing Feedback

**Criticism:** The student correctly identified extraneous load as the primary target and made practical choices about browser-based sensing and scalability. The theoretical grounding in CLT and CTML was appropriate. However, the student did not distinguish between intrinsic, extraneous, and germane load — reducing all load is not the goal, since germane load (effortful schema construction) is beneficial for learning. The system must preserve or increase germane load while reducing extraneous load. The student also did not question the validity and reliability of browser-based behavioral indicators as proxies for cognitive load — these indicators are indirect and noisy, and the assumption that rewind rate or scroll speed maps to cognitive load has weak empirical support. Finally, the student did not address the cold-start problem: the system needs data from each student to personalize, but the first sessions are when overload is most likely.

**Better Alternative Framing:**
> "Assumption: The goal is to reduce extraneous load while preserving or increasing germane load — not all load reduction improves learning. Question: Are browser-based behavioral indicators valid proxies for cognitive load? The relationship between pause rate, scroll speed, and experienced load is not well-established. Constraint: Cold-start problem — the system cannot personalize until it has baseline data from each student, but early sessions are when overload risk is highest. Framework: CLT (Sweller) + CTML (Mayer) + element interactivity for defining intrinsic load levels of statistics topics."

**Grade: B** — Good practical constraints, but missed the germane load distinction, indicator validity concern, and cold-start problem.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "Indicators unvalidated as load proxies"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Revise: Add adaptation rules for under-load conditions"
    description: "Revise: Add adaptation rules for under-load conditions — when behavioral indicators suggest the student is performing easily (high accuracy, fast completion, no rewinds), the system should increase challenge by advancing to harder material, reducing scaffolding, or offering extension problems. This preserves germane load."
  - name: "Add: Propose a validation study for the behavioral indicators"
    description: "Add: Propose a validation study for the behavioral indicators — before deploying them as sensing signals, they need to be correlated with established cognitive load measures (NASA-TLX, dual-task performance, pupillometry in a lab subset) to establish which indicators are valid proxies and which are noise."

#### Updated AI Output

**Revised Adaptation Rules (Bidirectional)**

| Trigger | Interpretation | Adaptation |
|---------|---------------|------------|
| Quiz error > 60% | Likely overloaded | Insert prerequisite review; offer worked example |
| Quiz error < 20% for 3 consecutive quizzes | Likely under-loaded | Skip to next topic; reduce scaffolding; offer challenge problem |
| Rewind rate > 2x per segment | Possible overload OR note-taking | Flag for multi-signal check |
| Problem completion < 0.5 SD below mean time with >90% accuracy | Under-loaded | Advance difficulty level |
| Video speed set to 2x by student | Self-paced mastery | Offer skip-to-quiz option |
| Session duration > 45 min continuous | Fatigue risk | Suggest break; insert low-load activity |

**Under-load adaptations:**
- Advance to next topic, skipping review material
- Replace worked examples with problem-solving-first approach (productive failure)
- Offer optional extension problems with real-world statistical applications

**Indicator Validation Study:**
Phase 0 (pre-deployment, lab-based, N=60):
1. Students complete statistics modules in lab while behavioral indicators are logged
2. Concurrent measures:
   - NASA-TLX self-report after each module
   - Dual-task performance (respond to auditory probes during learning — slower RT = higher load)
   - Pupillometry (pupil dilation as physiological load index)
3. Analysis: Correlate each behavioral indicator with NASA-TLX, dual-task RT, and pupil dilation
4. Retain only indicators with r > 0.30 (medium effect) and significant correlation with at least 2 of 3 criterion measures
5. Build multi-signal classifier using validated indicators

#### Judging Feedback

**Criticism:** The student caught two critical issues — the unidirectional adaptation and the unvalidated indicators. The germane load concern (system only reduces difficulty) was the single most important design flaw, and the validation study proposal was methodologically sound. However, the student did not address the cold-start problem: for a new student with no behavioral baseline, the system cannot classify load state. The student also did not question the thresholds in the adaptation rules — where do numbers like "60% error," "2x rewind rate," and "0.5 SD below mean time" come from? Without empirical calibration, these are arbitrary.

**Better Alternative Judgement:**
> "Error: System only reduces load, never increases — misses germane load. Gap: Indicators unvalidated as load proxies. Gap: Cold-start problem — no baseline data for new students. Gap: Adaptation thresholds (60%, 2x, 0.5 SD) are arbitrary and need empirical calibration."

**Grade: A** — Two strong catches, missed cold-start and threshold calibration.

#### Steering Feedback

**Criticism:** The steering was well-targeted — bidirectional adaptation directly fixes the germane load problem, and the validation study with multi-modal concurrent measures was methodologically sophisticated. The retention criterion (r > 0.30 with 2 of 3 measures) was a nice touch.

**Grade: A** — Specific, methodologically sound, and directly addressed the identified issues.

---

### Cycle 2

**Current AI Output:** *(revised version with bidirectional adaptation and validation study)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "Thresholds are arbitrary — need empirical calibration"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Propose a cold-start strategy"
    description: "Add: Propose a cold-start strategy — for new students, use a brief diagnostic assessment (5-minute math prerequisite quiz + self-reported statistics familiarity) to set initial difficulty level. During the first 3 sessions, use conservative adaptation (default to easier content, gradually calibrate from behavioral data). After 3 sessions, switch to personalized thresholds."
  - name: "Revise: State that adaptation thresholds should be"
    description: "Revise: State that adaptation thresholds should be empirically derived from the Phase 0 validation study rather than set a priori. The pilot study should include a threshold-tuning phase."

#### Updated AI Output

**Cold-Start Strategy:**

1. **Onboarding assessment (5 minutes):**
   - 10-item math prerequisite quiz (algebra, basic probability)
   - Self-reported familiarity: "I have never studied statistics" / "I took a statistics course before" / "I use statistics regularly"
   - Assign initial difficulty tier: Foundational / Standard / Advanced

2. **Conservative first 3 sessions:**
   - Default to lower-difficulty content within the assigned tier
   - Collect behavioral data without triggering adaptations (observation phase)
   - End of session 3: compute personal baselines for rewind rate, time-on-task, quiz accuracy

3. **Personalized mode (session 4+):**
   - Thresholds computed relative to student's own baselines (z-scores within personal distribution)
   - Population norms used only when personal data insufficient (< 10 data points for a given indicator)

**Threshold Calibration:**
- Phase 0 validation study provides initial population-level thresholds
- Pilot study (Phase 1) includes threshold optimization:
  - Grid search across threshold combinations
  - Optimize for learning outcome (quiz performance gain) while minimizing false alarms (unnecessary adaptations)
  - Report precision/recall for load state detection at each threshold setting

#### Judging Feedback

**Criticism:** The student identified both remaining gaps — cold-start and threshold calibration. The cold-start strategy request was well-conceived, and linking thresholds to empirical calibration was the right move. However, the student did not address the gaming problem: students might learn that low quiz performance triggers easier content and deliberately underperform to reduce difficulty. The system needs anti-gaming safeguards. The student also did not question whether the A/B test pilot design (adaptive vs current platform) confounds the adaptation algorithm with other design changes (e.g., shorter video segments, checkpoint questions) that are part of the adaptive system's response repertoire.

**Better Alternative Judgement:**
> "Gap: No cold-start strategy for new students. Gap: Thresholds are arbitrary — need empirical calibration. Gap: Students could game the system by deliberately underperforming to trigger easier content. Gap: Pilot A/B test confounds adaptation algorithm with content redesign — need to isolate the adaptive component."

**Grade: A** — Good catches, missed gaming and confound issues.

#### Steering Feedback

**Criticism:** The steering was specific and productive — the onboarding assessment, observation phase, and personal baseline approach are a well-structured cold-start solution. The threshold calibration with grid search and precision/recall optimization was methodologically sound.

**Grade: A** — Clear, detailed, and directly actionable.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with cold-start strategy, empirical thresholds, bidirectional adaptation, validation study)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor: A student could potentially game the system by"
    description: "Minor: A student could potentially game the system by underperforming to get easier content, but this risk exists in any adaptive system and can be monitored via inconsistency detection (high accuracy on easy content immediately after triggering adaptation). The system architecture is otherwise comprehensive."

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

The student showed strong practical design thinking and progressively identified important system-level issues across cycles. Framing correctly identified extraneous load and scalability constraints but missed the germane load distinction and indicator validity concern — both of which became the most important issues in later cycles. Judging was good, catching unidirectional adaptation, unvalidated indicators, cold-start, and threshold calibration, but consistently missed secondary issues (gaming vulnerability, pilot confounds). Steering was the strongest skill — every instruction was detailed, actionable, and produced substantial design improvements. The cold-start solution and validation study protocol were highlights. To improve, the student should practice adversarial thinking: "how could a user exploit or undermine this system?"
