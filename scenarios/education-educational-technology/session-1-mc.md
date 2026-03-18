# Session 1 — Designing an LMS Module for a Graduate Seminar (Multiple Choice)

**Challenge:** Learning Management Systems > Course Design in LMS > Module Sequencing & Navigation
**Mode:** Multiple Choice
**Student:** Priya M.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Design a complete LMS module structure for a 10-week graduate seminar on "Global Health Policy" that will be taught in a hybrid format. The professor has "lots of readings" (journal articles, WHO reports, case studies) and wants students to "engage deeply" with the material before each live session. The class has "around 25 students" from different time zones. The professor currently dumps all readings into a single folder and "students complain they don't know what to focus on." Deliver a module map showing the weekly structure, content sequencing, and activity flow, plus a configuration guide specifying which LMS features to activate (release conditions, completion tracking, discussion forums). The professor wants to "see who's actually doing the work."

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates a solution?

- **(A)** Assume any LMS will work, "deep engagement" means students highlight PDFs, and "seeing who's doing the work" means tracking page views. Focus on organizing readings into weekly folders.
- **(B)** Assume Canvas is the LMS, estimate 3-5 readings per week, define "deep engagement" as pre-class comprehension activities, require a 24-hour pre-class submission window, and use completion tracking for analytics.
- **(C)** Assume Canvas is the LMS, but question what learning outcomes define "deep engagement" (recall vs analysis vs application), estimate time-on-task per reading (not just count), ask whether students have varied disciplinary backgrounds requiring scaffolding, define analytics as engagement quality indicators not just compliance metrics, and address time-zone equity for deadlines.
- **(D)** Skip the LMS and recommend the professor use email to distribute readings with a spreadsheet to track submissions.
- **(E)** Assume the professor should reduce readings to one per week since students complain, and replace all asynchronous work with in-class activities.

**Student selects: (B)**

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

**LMS Configuration:**
- Module Prerequisites: complete Reading Quiz to unlock Live Session materials
- Completion Tracking: viewed (readings), submitted (quiz, discussion), graded (reflection)
- Release Conditions: modules unlock Monday 9 AM ET
- Discussion Forums: one threaded forum per week
- Analytics: Canvas page views, submission times, quiz scores

### Framing Feedback

**Criticism:** Option (B) is reasonable but incomplete. It correctly identifies the LMS, estimates reading volume, and defines engagement activities. However, it does not question the learning outcomes behind "deep engagement," does not address learner variability (MPH students vs political science students in a global health seminar), and treats analytics as completion tracking rather than engagement quality. Option (C) was stronger because it questioned what cognitive level constitutes "deep engagement," estimated time-on-task, addressed scaffolding needs, distinguished compliance from quality, and raised time-zone equity.

**Better Alternative:** Option **(C)** — it covers everything in (B) plus learning outcomes alignment, time-on-task estimation, learner variability, and analytics quality.

**Grade: B** — Solid practical assumptions but missed pedagogical depth.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The weekly template is too detailed — the professor only needs a folder of readings and a quiz
- **(B)** The module structure treats all 10 weeks identically with no progression; the reading quiz gates access unfairly (conflates recall with engagement)
- **(C)** The module structure is flat with no semester progression; the quiz gates access based on recall rather than engagement; the discussion forum lacks structure for quality interaction; time-zone differences are not accommodated in the release schedule
- **(D)** The template should include video lectures instead of readings
- **(E)** The solution is well-designed and ready for implementation

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Add more readings to each week to increase rigor"
- **(B)** "Make it look nicer with better formatting"
- **(C)** "Replace the flat weekly template with three semester phases (scaffolded, independent, student-led) that show pedagogical progression. Replace quiz-gating with a reading response requirement that demonstrates engagement without penalizing comprehension gaps."
- **(D)** "Remove all quizzes and just have students read"
- **(E)** "Add gamification badges for completing readings"

**Student selects: (C)**

#### Updated AI Output

**Semester Arc — Three Phases:**

**Phase 1 (Weeks 1-3): Scaffolded Engagement**
```
├── Pre-Class: Readings with guided questions, glossary, reading response (150 words)
├── Live: Instructor-led case walkthrough, structured group discussion
└── Post-Class: Peer response, weekly reflection connecting readings to session
```

**Phase 2 (Weeks 4-7): Independent Analysis**
```
├── Pre-Class: Readings without scaffolding, analytical response (300 words comparing frameworks)
├── Live: Student-initiated questions, open-ended case analysis
└── Post-Class: Peer critique, policy brief section draft
```

**Phase 3 (Weeks 8-10): Student-Led Facilitation**
```
├── Pre-Class: Student-curated readings, student-generated discussion prompts
├── Live: Student-led facilitation (25 min + discussion), peer feedback
└── Post-Class: Facilitation reflection, final project workshop
```

**Revised Gating:** Reading response (not quiz) is the prerequisite. Self-check quizzes are optional and ungraded.

#### Judging Feedback

**Criticism:** The student correctly identified the flat structure and quiz-gating issues, which are the two most important problems. However, option (C) was more comprehensive — it also caught the unstructured discussion forum and time-zone inequity. These are meaningful design issues: without discussion structure, posts tend toward superficial "I agree" responses, and without time-zone accommodation, some students are systematically disadvantaged.

**Better Alternative:** Option **(C)** — includes everything in (B) plus discussion structure and time-zone equity.

**Grade: B** — Caught the main issues, missed secondary design concerns.

#### Steering Feedback

**Criticism:** Option (C) was excellent — specific, pedagogically grounded, and targeted exactly at the identified issues. The three-phase structure and reading response replacement were both well-specified. This was the best available option.

**Grade: A** — Precise, actionable, and pedagogically sound steering.

---

### Cycle 2

**Current AI Output:** *(three-phase semester arc as shown above)*

#### Judging Sub-step

Which issues remain in the AI's updated solution?

- **(A)** The three-phase model is wrong — all weeks should be identical for consistency
- **(B)** The analytics section was not updated for the new model; the Phase 3 facilitation has no evaluation rubric
- **(C)** The analytics section was not updated; Phase 3 facilitation lacks an evaluation rubric; the LMS configuration guide still reflects the original flat model and needs specific Canvas feature settings for each phase
- **(D)** The solution needs more technology tools — add VR and AR components
- **(E)** No significant issues remain

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Add a section about VR integration"
- **(B)** "Create a Professor's Weekly Dashboard with specific metrics, interpretation guidance, and intervention triggers (e.g., 2 missed responses triggers a check-in). Include a 4-criterion facilitation rubric for Phase 3. Update the LMS configuration guide with phase-specific Canvas settings."
- **(C)** "Just add a rubric somewhere"
- **(D)** "Remove Phase 3 — student-led facilitation is too risky"
- **(E)** "The solution is complete, no changes needed"

**Student selects: (B)**

#### Updated AI Output

*(Previous three-phase structure retained, with additions:)*

**Professor's Weekly Dashboard:**

| Metric | Source | Indicates | Intervention Trigger |
|--------|--------|-----------|---------------------|
| Reading Response submission | Assignments | Compliance | 2 missed → check-in email |
| Response depth (spot-check 5/week) | SpeedGrader | Engagement quality | Surface-level → office hours invite |
| Discussion reply timing | Forum Analytics | Peer engagement | No replies by 48 hrs → nudge |
| Self-check quiz attempts | Quiz Stats | Self-regulation | Zero for 3+ weeks → suggest strategies |
| Session attendance | Zoom logs | Participation | 2+ missed → schedule meeting |

**Phase 3 Facilitation Rubric (4-point scale):**
- Reading Selection & Curation: relevance, challenge level, diverse perspectives
- Discussion Facilitation: question quality, airtime management, adaptiveness
- Content Mastery: depth of understanding, ability to handle follow-ups
- Peer Engagement: activities requiring active participation from all

**Updated LMS Configuration by Phase:**
- Phase 1: Enable guided question pages, glossary tool, prerequisite = reading response submission
- Phase 2: Disable scaffolding pages, enable peer review tool, prerequisite = analytical response
- Phase 3: Enable student Pages creation for curated reading lists, group assignment for facilitation teams

#### Judging Feedback

**Criticism:** The student selected option (C), which was the most comprehensive choice — it identified the analytics gap, the missing facilitation rubric, and the outdated configuration guide. This is a strong improvement over Cycle 1, where the student selected the partial option. The student is demonstrating growth in identifying the full scope of issues.

**Better Alternative:** Option **(C)** was the best available choice.

**Grade: A** — Comprehensive issue identification.

#### Steering Feedback

**Criticism:** Option (B) was specific, actionable, and covered all three identified gaps with concrete specifications (intervention triggers, 4-criterion rubric, phase-specific settings). This was the strongest available option.

**Grade: A** — Thorough, specific, and well-targeted steering.

---

### Cycle 3 (Final)

**Current AI Output:** *(complete three-phase model with dashboard, rubric, and configuration)*

#### Judging Sub-step

Which issues remain?

- **(A)** The entire approach should use a different LMS
- **(B)** The discussion forum still lacks structured roles (summarizer, questioner, connector)
- **(C)** No significant issues remain for the stated scope — the deliverable covers module structure, analytics, evaluation, and configuration
- **(D)** The solution needs a mobile app component
- **(E)** The reading response word counts are too low

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

The student demonstrated clear growth across the session. Framing was adequate but missed pedagogical depth — learning outcomes, learner variability, and analytics quality were not questioned. In judging, the student improved from partial identification in Cycle 1 (catching two of four issues) to comprehensive identification in Cycle 2 (selecting the most complete option). This shows developing ability to scan the full solution surface. Steering was consistently strong throughout — every selected correction was specific, pedagogically grounded, and drove meaningful improvements. The dashboard with intervention triggers and the facilitation rubric both added substantial practical value. To improve, the student should bring the same thoroughness shown in later judging cycles to the initial framing phase, where questioning learning outcomes and learner variability would have produced a stronger foundation from the start.
