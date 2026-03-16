# Session 1 — Designing an LMS Module for a Graduate Seminar (Open-Ended)

**Challenge:** Learning Management Systems > Course Design in LMS > Module Sequencing & Navigation
**Mode:** Open-Ended (Structured Sections)
**Student:** Priya M.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a complete LMS module structure for a 10-week graduate seminar on "Global Health Policy" that will be taught in a hybrid format. The professor has "lots of readings" (journal articles, WHO reports, case studies) and wants students to "engage deeply" with the material before each live session. The class has "around 25 students" from different time zones. The professor currently dumps all readings into a single folder and "students complain they don't know what to focus on." Deliver a module map showing the weekly structure, content sequencing, and activity flow, plus a configuration guide specifying which LMS features to activate (release conditions, completion tracking, discussion forums). The professor wants to "see who's actually doing the work."

### Student's Framing Response

> **Assumption: The LMS is Canvas, since Stanford uses it — so features like Modules, Assignments, SpeedGrader, and Analytics are available.**
>
> **Assumption: "Lots of readings" means roughly 3-5 readings per week, and "engage deeply" means students should demonstrate comprehension before class, not just open the file.**
>
> **Constraint: With students in different time zones, synchronous deadlines within a single day are problematic — I'll assume a 24-hour pre-class window for asynchronous submissions.**
>
> **Constraint: "See who's actually doing the work" means the professor wants analytics on completion and engagement, not just attendance.**

### AI Solution (Generated from Student's Framing)

**Module Map (Weekly Template):**

```
Week [N]: [Topic Title]
├── Pre-Class (Due 24 hrs before live session)
│   ├── Reading Package (3-5 articles, tagged as Required vs Recommended)
│   ├── Reading Quiz (5 MC questions, auto-graded, 2 attempts allowed)
│   └── Discussion Post (250-word response to a prompt)
├── Live Session (Synchronous, recorded)
│   ├── Case Discussion
│   └── Small Group Activity
└── Post-Class (Due end of week)
    ├── Peer Response (reply to 2 classmates' discussion posts)
    └── Reflection Journal (150 words)
```

**LMS Configuration Guide:**
- Enable Module Prerequisites: students must complete Reading Quiz before accessing Live Session materials
- Completion Tracking: mark items complete when viewed (readings), submitted (quiz, discussion), or graded (reflection)
- Release Conditions: each week's module unlocks on Monday 9 AM ET
- Discussion Forums: one threaded forum per week, sorted by recent activity
- Analytics: use Canvas Analytics to track page views, submission times, quiz scores

### Framing Feedback

**Criticism:** The student made reasonable platform and scale assumptions. However, the student did not question the pedagogical model driving the sequencing — why readings before discussion before live session? Is there evidence this sequence maximizes "deep engagement"? The student also did not address what happens when students have different levels of background knowledge in global health (some may be MPH students, others from political science) or whether the reading load is appropriate (3-5 articles per week for a graduate seminar could mean 20 pages or 200). The student assumed analytics means page views and submission tracking but did not question whether these metrics actually indicate engagement or merely compliance.

**Better Alternative Framing:**
> "Assumption: Canvas is the LMS. Constraint: Readings per week need a time-on-task estimate — 'lots of readings' could overload students if not bounded to roughly 3-4 hours of reading per week. Question: What are the learning outcomes for 'deep engagement' — is it recall, analysis, or application? This determines whether quizzes, discussions, or written analyses are the right pre-class activity. Question: Do students have varied disciplinary backgrounds? If so, some readings may need scaffolding (glossaries, guiding questions) that others can skip."

**Grade: B** — Good practical assumptions, but missed learning outcomes alignment and learner variability.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap: The module structure treats all 10 weeks identically"
    description: "Gap: The module structure treats all 10 weeks identically — no progression in complexity, scaffolding, or assignment type across the semester. Week 1 and Week 10 look the same. Error: Release conditions gate the live session materials behind the reading quiz, which penalizes students who engage with readings but perform poorly on a quiz — quiz performance is not the same as reading engagement. Gap: The configuration guide says"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Revise: Replace the flat weekly template with a semester"
    description: "Revise: Replace the flat weekly template with a semester arc that shows how activities evolve — early weeks should have more scaffolding (guided reading questions, vocabulary support), middle weeks should shift toward independent analysis, and final weeks should involve student-led facilitation. Show at least 3 distinct weekly templates for these phases."
  - name: "Fix: Replace the reading quiz as a gating mechanism with"
    description: "Fix: Replace the reading quiz as a gating mechanism with a low-stakes"

#### Updated AI Output

**Semester Arc — Three Phases:**

**Phase 1 (Weeks 1-3): Scaffolded Engagement**
```
Week [N]: [Topic Title]
├── Pre-Class
│   ├── Reading Package with Guided Questions (annotations highlighting key arguments)
│   ├── Vocabulary & Concept Glossary for unfamiliar policy terms
│   ├── Reading Response (150 words: "What is the author's central claim and one point of evidence?")
│   └── Self-Check Quiz (ungraded, formative, unlimited attempts)
├── Live Session
│   ├── Instructor-led case walkthrough
│   └── Structured small group discussion (provided prompts)
└── Post-Class
    ├── Peer Response (reply to 2 classmates)
    └── Weekly Reflection (200 words connecting readings to session)
```

**Phase 2 (Weeks 4-7): Independent Analysis**
```
Week [N]: [Topic Title]
├── Pre-Class
│   ├── Reading Package (Required + Recommended, no guided questions)
│   ├── Analytical Response (300 words: compare two readings' frameworks)
│   └── Self-Check Quiz (optional)
├── Live Session
│   ├── Student-initiated questions drive discussion
│   └── Small group case analysis (open-ended)
└── Post-Class
    ├── Peer Response with constructive critique
    └── Policy Brief Draft section (building toward final project)
```

**Phase 3 (Weeks 8-10): Student-Led Facilitation**
```
Week [N]: [Topic Title]
├── Pre-Class
│   ├── Student-curated reading list (facilitation team selects 2 readings)
│   ├── Discussion questions posted by facilitation team
│   └── Pre-class response to student-generated prompt
├── Live Session
│   ├── Student-led facilitation (25 min presentation + discussion)
│   └── Peer feedback on facilitation
└── Post-Class
    ├── Facilitation team reflection
    └── Final project workshop
```

**Revised Gating:**
- Reading Response (not quiz) is the prerequisite for unlocking live session materials
- Self-check quizzes are available but optional and ungraded
- Completion tracked by submission of reading response, not page views

#### Judging Feedback

**Criticism:** The student identified two significant issues — the flat structure problem and the quiz-as-gate concern. Both are pedagogically important. However, the student did not flag that the discussion forum design was generic ("one threaded forum per week, sorted by recent activity") and lacked structure for productive peer interaction. The student also missed that the AI never addressed time-zone equity: the 24-hour pre-class window may fall during working hours for some students and sleeping hours for others.

**Better Alternative Judgement:**
> "Gap: The flat weekly structure shows no pedagogical progression. Error: Gating live session materials behind a quiz conflates recall performance with engagement. Gap: The discussion forum has no structural features to promote quality interaction (roles, required evidence, peer rating). Gap: The 24-hour pre-class window does not account for time-zone inequity across the global student cohort."

**Grade: A** — Caught the two most important structural issues but missed discussion design and time-zone equity.

#### Steering Feedback

**Criticism:** The steering was well-directed. Asking for three distinct phase templates and replacing the quiz gate with a reading response were both specific and pedagogically sound. The student could have also addressed the discussion forum structure and time-zone accommodation.

**Better Alternative Steering:**
> "Revise: Show three semester phases with distinct weekly templates that scaffold toward student autonomy. Fix: Replace quiz-gating with a reading response requirement. Add: Redesign discussion forums with structured roles (e.g., summarizer, questioner, connector) that rotate weekly. Add: Provide two deadline options per activity to accommodate time-zone differences."

**Grade: A** — Effective corrections on the main issues, missed secondary design elements.

---

### Cycle 2

**Current AI Output:** *(three-phase semester arc as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "Phase 3 facilitation lacks evaluation criteria"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "The dashboard design request was specific and practical"
    description: "The dashboard design request was specific and practical — the intervention trigger column is particularly useful for a professor new to analytics. The facilitation rubric request was well-scoped. The "
  - name: "Add: Include a facilitation evaluation rubric for Phase"
    description: "Add: Include a facilitation evaluation rubric for Phase 3 with 4 criteria scored on a 4-point scale."

#### Updated AI Output

*(Previous three-phase structure retained, with additions below)*

**Professor's Weekly Dashboard:**

| Metric | Data Source | What It Indicates | Intervention Trigger |
|--------|-----------|-------------------|---------------------|
| Reading Response submission rate | LMS Assignments | Basic compliance | < 2 consecutive submissions missed → check-in email |
| Reading Response word count & depth | SpeedGrader quick scan | Engagement quality | Responses consistently under 50 words or surface-level → office hours invitation |
| Discussion reply count & timing | Discussion Analytics | Peer engagement pattern | No replies by 48 hrs post-deadline → nudge message |
| Self-check quiz attempts | Quiz Statistics | Self-regulated learning | Zero attempts for 3+ weeks → suggest study strategies |
| Live session attendance | Zoom/recording logs | Synchronous participation | 2+ missed sessions → schedule meeting |

**Engagement Quality vs Compliance:**
- Compliance = submitted on time, met word count, clicked required items
- Engagement Quality = demonstrated analysis (not just summary), connected readings to prior knowledge, posed substantive questions
- Recommendation: spot-check 5 reading responses per week for quality (rotate students), use rubric rather than reading all 25 in full

**Phase 3 Facilitation Rubric:**

| Criterion | 4 (Excellent) | 3 (Proficient) | 2 (Developing) | 1 (Beginning) |
|-----------|--------------|----------------|----------------|---------------|
| Reading Selection & Curation | Readings are relevant, appropriately challenging, and represent diverse perspectives | Readings are relevant and appropriately challenging | Readings are relevant but not well-matched to audience level | Readings are tangential or inappropriately difficult |
| Discussion Facilitation | Poses probing questions, manages airtime equitably, builds on contributions | Poses good questions and manages discussion flow | Relies on prepared questions without adapting to discussion | Reads questions from a script with minimal interaction |
| Content Mastery | Demonstrates deep understanding, addresses questions with nuance | Demonstrates solid understanding of core arguments | Shows familiarity but struggles with follow-up questions | Shows surface-level understanding only |
| Peer Engagement | Creates activities that require active participation from all students | Invites participation and responds to contributions | Allows participation but does not actively elicit it | Presents without inviting peer input |

#### Judging Feedback

**Criticism:** The student identified a genuine gap — the analytics section needed updating for the new design, and the facilitation rubric was indeed missing. The distinction between compliance and engagement quality is a sophisticated observation. However, the student did not notice that the entire configuration guide (release conditions, discussion forum settings, specific Canvas feature toggles) was never updated for the three-phase model. The Phase 1 guided questions and glossary features may require specific LMS plugins or page designs that were not specified.

**Better Alternative Judgement:**
> "Gap: The analytics section needs redesign to match the three-phase model and distinguish compliance from engagement quality. Gap: Phase 3 facilitation lacks evaluation criteria. Gap: The LMS configuration guide was never updated — Phase 1 guided questions and glossaries may require specific Canvas features (Pages, embedded annotations) that need to be specified."

**Grade: A** — Strong pedagogical observations, missed the technical configuration gap.

#### Steering Feedback

**Criticism:** The dashboard design request was specific and practical — the intervention trigger column is particularly useful for a professor new to analytics. The facilitation rubric request was well-scoped. The student could have also asked for an updated configuration guide.

**Grade: A** — Specific, practical, and pedagogically grounded steering.

---

### Cycle 3 (Final)

**Current AI Output:** *(three-phase model with dashboard and facilitation rubric)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Minor gap: The configuration guide still references the"
    description: "Minor gap: The configuration guide still references the original flat model. But the overall module map, dashboard, and rubric are solid and actionable for a professor. Observation: The deliverable is now comprehensive enough to hand to an instructor — it has the semester arc, weekly templates, analytics dashboard, and facilitation rubric."

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

The student showed strong practical instincts — the Canvas assumption, time-zone awareness, and reading load concerns were all relevant. Framing would have been stronger with explicit attention to learning outcomes and learner variability, which drive all downstream design decisions. In judging, the student consistently identified the most impactful structural issues (flat template, quiz-as-gate, missing analytics depth) but missed secondary design elements like discussion forum structure, time-zone accommodation, and LMS configuration updates. Steering was the strongest skill: requests were specific, pedagogically grounded, and produced meaningful improvements — the dashboard with intervention triggers and the facilitation rubric both added substantial value. To improve, the student should practice tracing every design decision back to a stated learning outcome and checking whether the technical configuration section stays consistent with structural changes.
