# CoReasoning Lab — Concept of Operations

**Version:** 2.0
**Date:** March 2026

---

## 1. Purpose and Intent

### 1.1 Why CoReasoning Lab Exists

The rapid adoption of AI assistants in education creates a paradox: students who rely on AI for answers lose the ability to reason critically about those answers. A student who asks an LLM to "solve this problem" and copies the output has learned nothing about whether the solution is correct, complete, or appropriate for the context.

**CoReasoning Lab** addresses this gap by putting the student *in partnership with* an AI — not as a passive consumer of AI output, but as an active co-reasoner who must **frame** ambiguous problems, **judge** AI-generated solutions for errors, and **steer** the AI toward better results. The system measures and develops three distinct metacognitive skills:

1. **Framing** — Can the student take a vague, real-world problem and convert it into a well-defined task by identifying gaps, making justified assumptions, and establishing constraints?
2. **Judging** — Can the student critically evaluate an AI's output, detecting errors, unjustified assumptions, and missing considerations?
3. **Steering** — Can the student provide specific, actionable corrections that drive the AI toward a better solution?

These skills are discipline-agnostic in structure but discipline-specific in content. A framing exercise in signal processing requires different domain expertise than one in constitutional law — but both require the same underlying ability to question, analyze, and direct.

### 1.2 Design Philosophy

The system is built on four principles:

- **The AI is deliberately imperfect.** The LLM-generated solutions intentionally contain subtle errors and gaps. This is not a bug — it is the pedagogical core. Students who cannot find these issues are not yet ready to use AI tools professionally.
- **The rubric is invisible.** Students never see the evaluation criteria. They receive feedback in the form of criticism and a better alternative — not a checklist. This prevents "rubric gaming" and encourages genuine critical thinking.
- **Every skill is graded separately.** A student may be excellent at steering but weak at framing. Three independent grades (A/B/C) reveal this pattern, enabling targeted improvement.
- **Content is generated, not curated.** Problems, solutions, MC options, and feedback are all LLM-generated at run time from a library of carefully crafted prompts. This means no two challenge runs are identical, and the system scales across any discipline with a subject tree.

---

## 2. Operational Concept

### 2.1 The Two-Phase Challenge Model

Every challenge run follows a fixed two-phase structure:

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1 — FRAMING                                              │
│                                                                  │
│  System presents a raw, ill-defined problem                      │
│  ↓                                                               │
│  Student adds refinement sections:                               │
│    • Assumptions  • Constraints  • Clarifications  • Metrics     │
│  ↓                                                               │
│  Combined (raw problem + refinements) sent to AI                 │
│  ↓                                                               │
│  AI generates a solution (with intentional issues embedded)      │
│  ↓                                                               │
│  Framing graded: A / B / C                                       │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 2 — JUDGE + STEER CYCLES  (up to N cycles)              │
│                                                                  │
│  For each cycle:                                                 │
│    ┌──────────────────────────────────┐                          │
│    │ A. JUDGING                       │                          │
│    │    Student identifies gaps/errors │                          │
│    │    (NOT sent to AI)              │                          │
│    ├──────────────────────────────────┤                          │
│    │ B. STEERING                      │                          │
│    │    Student sends correction to AI │                          │
│    │    AI produces updated output     │                          │
│    └──────────────────────────────────┘                          │
│    ↓                                                             │
│    Student marks "Done" or continues to next cycle               │
│                                                                  │
│  Judging graded: A / B / C  (aggregated across all cycles)      │
│  Steering graded: A / B / C (aggregated across all cycles)      │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Why Two Phases, Three Grades

The split into Framing vs. Judge+Steer reflects two fundamentally different cognitive activities:

- **Framing** is a *design* activity: the student imposes structure on an ambiguous situation *before* seeing any solution. It tests foresight, assumption-making, and requirements analysis.
- **Judging** is an *analytical* activity: the student evaluates an existing artifact for flaws. It tests critical reading, domain knowledge application, and error detection.
- **Steering** is a *communication* activity: the student must translate their analysis into actionable instructions for another agent (the AI). It tests specificity, prioritization, and iterative refinement.

These three skills are independent — a student may frame well but steer poorly, or judge accurately but fail to translate judgments into effective corrections. Separate grades expose these patterns.

### 2.3 Response Types

At each response point (Framing, Judging, Steering), the challenge creator chooses between two response modes:

| Mode | Student Experience | Evaluation Approach |
|------|-------------------|---------------------|
| **Multiple Choice** | LLM generates options including carefully crafted distractors that probe specific rubric criteria. Student selects. | Selection compared against best option; distractors designed to expose common misconceptions. |
| **Open-Ended** | Student creates structured named sections (Framing: refinement sections; Judging: named gaps; Steering: named instructions). | Free-form response evaluated against rubric and gold-standard reference. |

The response type is independently configurable per response point — a challenge can use MC for framing but open-ended for judging and steering, or any combination.

### 2.4 The Intentionally Imperfect AI

A critical design decision: the AI solution presented to students is *designed to contain errors*. The LLM is prompted to:

1. Produce a plausible, well-structured solution that looks correct on the surface
2. Embed 2–4 non-trivial issues (incorrect assumptions, missing edge cases, logical errors, over-simplifications)
3. Mix correct and incorrect elements so the student must evaluate each part
4. Not flag or hint at the errors

This transforms the AI from a answer-provider into a *reasoning partner* that the student must critically evaluate. The difficulty lies not in getting an answer, but in determining whether the answer is right.

---

## 3. Actors and Roles

### 3.1 Students

Students are the primary users. They:

- Subscribe to courses and receive published challenges
- Run challenges (both public assignments and private self-practice)
- Create private challenges for self-study
- Review their grade history and per-criterion feedback

Students see three views: a dashboard with pending challenges and stats, a challenge list with filtering, and a results/analytics page showing their performance across all three skills.

### 3.2 Instructors

Instructors create and publish challenges to courses. They:

- Join courses and gain access to the Course Steward
- Create and configure challenges (response types, cycle limits, instructions)
- Publish challenges to course subscribers
- View aggregate analytics: grade distributions, per-student breakdowns, completion rates
- Export results as PDF reports

Instructors do NOT manually grade — all evaluation is automated via the LLM and rubrics. The instructor's role is challenge design and performance monitoring.

### 3.3 The Course Steward

The Course Steward is a *virtual entity* that owns all course-level content. This solves a common institutional problem: when an instructor leaves, their challenges, analytics, and student data should not disappear.

The Course Steward:
- Owns all published challenges and their run data
- Holds course-wide settings (default LLM model, etc.)
- Survives instructor departures — content is transferred, never lost
- Is accessible to any instructor who joins the course

### 3.4 The LLM

The LLM is not a user but a core system component. It performs 12 distinct functions, each driven by a dedicated prompt template:

| Function | Prompt | When Used |
|----------|--------|-----------|
| Generate raw problem | 01 | Each challenge run |
| Generate evaluation rubrics (×3) | 02 | Challenge definition |
| Generate AI solution | 03 | After student framing |
| Generate updated AI output | 04 | After each steering |
| Generate framing MC options | 05 | Framing (if MC mode) |
| Generate judging MC options | 06 | Each judging sub-step (if MC) |
| Generate steering MC options | 07 | Each steering sub-step (if MC) |
| Evaluate framing | 08 | After framing submission |
| Evaluate judging | 09 | After judging submission |
| Evaluate steering | 10 | After steering submission |
| Assign grade | 11 | Per dimension (Framing/Judging/Steering) |
| Generate example preview | 12 | Challenge definition |
| Generate best framing | 14 | Challenge definition |

All prompts are YAML-configured and use a single, configurable LLM model with a three-level override hierarchy: system default → course default → challenge override.

---

## 4. Challenge Lifecycle

### 4.1 Definition

The challenge creator (instructor or student) defines a challenge through these steps:

1. **Metadata** — Title, course, one or more subject tree nodes (multi-select via tree control with checkboxes), description
2. **Visibility** — Public (instructor only) or private (student-created, always private)
3. **Type** — Practice (immediate feedback, retries allowed) or Assessment (feedback at end, no retries)
4. **Phase configuration** — Response types (MC or open-ended) for each of the three response points; max cycles for Phase 2
5. **Instructions** — Editable text shown to students at each phase
6. **Rubric generation** — LLM generates three rubrics (Framing, Judging, Steering) based on the subject tree, with domain-specific criteria
7. **Best framing generation** — LLM generates a gold-standard framing for the example problem, selecting relevant refinement sections (assumptions, constraints, clarifications, metrics) based on the specific problem's gaps
8. **Preview** — Creator reviews generated rubrics and an example problem with annotated gaps

Rubrics are generated *independently of any specific problem* — they describe what good framing, judging, and steering look like for the chosen subject area. This means the same rubric applies across all runs of the challenge, even though each run generates a different problem.

### 4.2 Execution

Each run generates fresh content:
- A new problem instance (with different gaps and ambiguities)
- A new AI solution (with different embedded issues)
- New MC options (if applicable, driven by the current AI output and rubric)
- New feedback (specific to the student's actual responses)

This prevents memorization and ensures each student encounters a genuinely novel challenge.

### 4.3 Practice vs. Assessment

| Aspect | Practice | Assessment |
|--------|----------|------------|
| Feedback timing | After each phase/cycle | After full submission |
| Retries | Allowed (framing and cycles) | Not allowed |
| Navigation | Can go back to earlier cycles | Forward-only |
| Purpose | Learning and skill building | Formal evaluation |

Both types use the same underlying rubrics and grading scale. The difference is purely in feedback timing and retry policy.

---

## 5. Evaluation Model

### 5.1 The A/B/C Grading Scale

Every dimension (Framing, Judging, Steering) receives one of three grades:

| Grade | Meaning | Criteria |
|-------|---------|----------|
| **A** (Excellent) | No improvements needed | Student demonstrates comprehensive understanding. Identifies all or nearly all key issues. Response is specific, well-justified, and shows domain expertise. Minor omissions only. |
| **B** (Medium) | A few minor improvements needed | Student demonstrates partial understanding. Identifies some key issues but misses others. Adequate but not thorough analysis. Some gaps in depth or justification, but no fundamental errors. |
| **C** (Unsatisfactory) | Many improvements needed or a serious point missed | Student demonstrates insufficient understanding. Misses most key issues, identifies them incorrectly, or provides vague/unjustified responses. Fundamental gaps or misconceptions present. |

The scale is intentionally compact — three levels force meaningful differentiation without false precision. There are no plus/minus modifiers.

### 5.2 Feedback Structure

Every feedback instance contains two components:

1. **Criticism** — Specific, constructive critique referencing the student's actual response. Not generic — it names what the student did or missed.
2. **Better alternative** — Describes what a stronger response would look like, without revealing the rubric criteria directly.

The rubric is *never shown* to students. It drives the evaluation internally, but the feedback is expressed in domain-specific language that helps the student learn the subject, not game the assessment.

### 5.3 Analytics

**Student view:** History of all challenge runs with per-dimension grades and expandable detailed feedback. Filterable by course, type, and date.

**Instructor view:** Aggregate analytics across all course subscribers for public challenges:
- Grade distribution histograms per dimension (Framing, Judging, Steering)
- Per-student breakdown table with completion status and grades
- Completion rate (X/Y subscribers)
- PDF export for reporting

---

## 6. Content Architecture

### 6.1 Pre-Loaded Content

The system ships with:
- **12 courses** across 6 STEM and 6 non-STEM disciplines (Computer Science, Physics, Mathematics, Biology, Electrical Engineering, Economics, Psychology, Education, Business, Law, Philosophy, Political Science)
- **Subject trees** for each course (hierarchical, up to 5 levels deep)
- **5 challenges per course** (3 Practice + 2 Assessment), each with domain-specific rubrics
- **10 session transcripts per course** (5 MC mode + 5 open-ended mode) demonstrating realistic student interactions

### 6.2 Prompt Library

All LLM interactions are governed by a library of 13 YAML-configured prompt templates. Each prompt specifies:
- System prompt (behavioral rules for the LLM)
- User prompt template (with variable placeholders)
- Output schema (structured JSON response format)
- Parameters (temperature, max tokens)

The prompt library is the system's "pedagogical engine" — it encodes the design decisions about what makes a good problem, a good rubric, a good distractor, and good feedback.

### 6.3 Multi-Language Support

All LLM interactions accept a `{{language}}` parameter. The system supports English (default), Hebrew, Arabic, and all European languages for both UI elements and LLM-generated content. Hint texts are static and localized in the UI; all dynamic content (problems, feedback, grades) is generated in the requested language.

---

## 7. Typical Usage Scenario

### Instructor Workflow

1. Dr. Levy teaches "Introduction to Algorithms" at Tel Aviv University
2. She joins the course and accesses the Course Steward
3. She creates a new Practice challenge: "Sorting Pipeline for Sensor Data"
   - Subject: Sorting & Searching > Comparison-based Sorting
   - Framing: Multiple Choice (5 options)
   - Judging: Multiple Choice (5 options)
   - Steering: Multiple Choice (5 options)
   - Max cycles: 5
4. The system generates three domain-specific rubrics (e.g., Framing rubric tests whether the student identifies sort key ambiguity, questions scale, notes missing constraints, and considers static vs. dynamic input)
5. She reviews the rubrics, previews an example problem, and saves
6. She publishes the challenge to course subscribers

### Student Workflow

1. Noa R. logs in and sees a notification: "1 new challenge in Introduction to Algorithms"
2. She opens "Sorting Pipeline for Sensor Data" and starts
3. **Phase 1 (Framing):** She reads a raw problem about a warehouse sensor sorting module. Key information is missing — sort key, buffer size, what "spikes" means. She selects option (B) which identifies the sort key as timestamp, estimates sensor count, and defines spike behavior. She gets a B: good quantification, but missed stability concerns and output format.
4. **Phase 2, Cycle 1:** The AI's solution uses insertion sort with O(n) shift per item. Noa identifies the shift bottleneck (judging) and sends a precise steering command asking the AI to analyze burst costs and propose batch-merge. She gets B for judging (caught the main issue, missed secondary ones) and A for steering (specific and actionable).
5. **Phase 2, Cycle 2:** The AI's updated solution has a batch-merge approach but the arithmetic is wrong and BATCH_THRESHOLD is unspecified. Noa catches both and steers the AI to fix them. Again B for judging, A for steering.
6. **Phase 2, Cycle 3:** Noa judges the solution as complete and marks "Done."
7. **Final grades:** Framing: B, Judging: B, Steering: A. Summary feedback notes her pattern: strong at targeting the primary issue but consistently missing secondary concerns.

### Instructor Analytics

Dr. Levy views the analytics dashboard:
- 38 of 45 students have completed the challenge
- Framing grade distribution: A(12), B(18), C(8) — most students partially identified the gaps
- Steering grades are generally higher than judging — students are better at correcting than detecting
- She identifies Ahmed Hassan as consistently scoring C — he may need additional support

---

## 8. System Boundaries

### What CoReasoning Lab IS

- A platform for developing and assessing **critical reasoning skills in AI-assisted contexts**
- A tool that makes students **better collaborators with AI**, not more dependent on it
- A system where **every interaction is pedagogically designed** — nothing is random
- A scalable platform that works across **any academic discipline** via subject trees and domain-specific rubrics

### What CoReasoning Lab is NOT

- Not a chatbot or conversational AI interface
- Not a coding platform or IDE
- Not a traditional quiz/exam system with fixed questions and answers
- Not a substitute for instruction — it complements teaching by developing metacognitive skills
- Not a content management system — all educational content is LLM-generated at run time

---

## 9. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Rubrics are generated, not hand-written | Scales across disciplines; ensures domain specificity; reduces instructor burden |
| Problems are generated per run | Prevents memorization; ensures fairness across students |
| Judging responses are NOT sent to the AI | Separates analysis from communication; prevents the AI from "helping" the student judge |
| Three independent grades instead of one composite | Enables targeted skill development; reveals individual strengths and weaknesses |
| A/B/C scale with no modifiers | Prevents false precision; forces meaningful grade distinctions |
| Hint texts are static, not LLM-generated | Ensures consistency; avoids generating hints that reveal rubric criteria |
| Best framing is generated but never shown | Provides evaluation anchor without giving students the answer |
| Course Steward owns all public content | Prevents data loss on instructor departure; enables multi-instructor courses |
