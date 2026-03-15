# CoReasoning Lab — System Specification

**Source:** `docs/CoReasoningLab.md`
**Version:** 2.0

---

## 1. System Overview

An AI Co-Reasoning web application for skills assessment and practice. Students and instructors create and execute co-reasoning challenges backed by LLM-generated content, evaluation rubrics, and feedback.

---

## 2. Requirements

### 2.1 Platform & Deployment

| ID | Requirement |
|----|-------------|
| REQ-PLAT-01 | Web application deployable on any web platform, prioritizing free-tier hosting (e.g., Cloudflare R2 + Renderer). |
| REQ-PLAT-02 | Configurable LLM API provider via the ModelMesh library with a uniform OpenAI-compatible interface (see REQ-MODEL-01). |
| REQ-PLAT-03 | Intuitive UI with minimal screens. |
| REQ-PLAT-04 | Fully configurable via individual YAML files: prompt library, courses, subjects, and other settings. |
| REQ-PLAT-05 | Multi-language support including English (default), Hebrew, Arabic, and all European languages — both UI and LLM interactions. |
| REQ-PLAT-06 | The system ships with rich pre-loaded content: institutions, departments, courses, and subject trees. Instructors can extend courses and subjects via FLOW-09. |
| REQ-PLAT-07 | A **subject tree** is a hierarchy of subjects and sub-subjects within a course. The tree depth is configurable, with a default maximum depth of 5. |
| REQ-PLAT-08 | LLM API calls include a configurable retry policy (number of retries, backoff interval) defined at the system level in YAML configuration. Applies to all LLM invocations. |

### 2.2 Authentication & Roles

| ID | Requirement |
|----|-------------|
| REQ-AUTH-01 | Authentication via Google SSO, Microsoft SSO, or email/password registration. |
| REQ-AUTH-02 | User selects a **fixed** role (instructor or student) during sign-up. The role cannot be changed after registration. |
| REQ-AUTH-03 | During sign-up, the user selects their **institution** from a pre-provisioned list (REQ-PLAT-06). The institution is stored on the user profile. |
| REQ-AUTH-04 | Both instructors and students can create challenges. Challenges created by students are always private (REQ-VIS-02). |
| REQ-AUTH-05 | Students execute (run) challenges. Instructors can also run challenges belonging to their courses for validation purposes. |

### 2.3 User Profile

| ID | Requirement |
|----|-------------|
| REQ-PROF-01 | Each user has a profile displaying: name, email, profile image, institution, role, date of registration, list of course subscriptions (student) or joined courses (instructor). |
| REQ-PROF-02 | The profile shows basic statistics: number of challenges created and number of challenges executed (runs completed). |
| REQ-PROF-03 | Users can edit their **name** and **profile image** from the profile screen. All other profile fields are read-only. |

### 2.4 Challenge Visibility

| ID | Requirement |
|----|-------------|
| REQ-VIS-01 | **Public challenges** are created by instructors and published to course subscribers. Instructor analytics (REQ-COURSE-03) apply only to public challenges. |
| REQ-VIS-02 | **Private challenges** are created by students for their own use. Private challenge results are visible only to the student who created them. Private challenges cannot be promoted to public or shared with other users. |

### 2.5 Courses & Subscriptions

| ID | Requirement |
|----|-------------|
| REQ-COURSE-01 | Each course has a **Course Steward** — a virtual entity that owns all course-level content and configuration. When an instructor joins a course, they gain instructor privileges. When an instructor leaves, all their published challenges, analytics data, and contributions are transferred to the Course Steward, ensuring nothing is lost. Multiple instructors may join the same course; all have equal access to all instructor content through the Course Steward. |
| REQ-COURSE-02 | An instructor can publish/share public challenges to course subscribers. Published challenges are owned by the Course Steward. |
| REQ-COURSE-03 | An instructor can view results/analytics for all course subscribers, limited to public challenges. Analytics and public challenges are anchored to the Course Steward — any instructor who joins the course can see them. |
| REQ-COURSE-04 | Students can subscribe to and unsubscribe from courses. Unsubscribing retains the student's existing challenge run results. |
| REQ-COURSE-05 | The student main screen shows alerts for current (pending) challenges. |
| REQ-COURSE-06 | When an instructor publishes a challenge, subscribed students see it added to their challenge list with a visual cue (icon). The visual cue is cleared when the student completes/submits the challenge. |
| REQ-COURSE-07 | The **Course Steward** holds course-wide settings that apply to all public challenges unless overridden at the challenge level. Course-wide settings include: default LLM model for evaluation (see REQ-MODEL-02), and other course-level defaults. Any instructor in the course can edit the Course Steward's settings. |

### 2.6 Challenge List Display

| ID | Requirement |
|----|-------------|
| REQ-LIST-01 | The challenge list displays the following attributes per challenge: visibility (public/private), type (Practice/Assessment), course, creation date, creator name, and last attempt date. |
| REQ-LIST-02 | Challenge type and visibility are indicated with distinct icons. Newly published challenges show a visual cue (icon) to distinguish them from previously seen entries. *(REQ-COURSE-06)* |
| REQ-LIST-03 | **Instructor view:** each public challenge additionally shows a completion counter — number of subscribers who have completed the challenge out of total course subscribers (X/Y). |
| REQ-LIST-04 | Users can filter and search the challenge list by course, type (Practice/Assessment), visibility (public/private), and status. Challenge statuses are: **Not Started** (no runs), **In Progress** (started but not completed), **Completed** (at least one run submitted), and **Archived** (hidden from active list). |

### 2.7 Challenge Management

| ID | Requirement |
|----|-------------|
| REQ-MGMT-01 | A challenge creator can **rename** a challenge at any time. |
| REQ-MGMT-02 | A challenge creator can **archive** a challenge. Archived challenges are hidden from the active challenge list and can no longer be executed, but their definition and run results are preserved for analytics and reporting. |
| REQ-MGMT-03 | A challenge creator can **delete** a challenge only if it is in an active (non-archived) state. For **private challenges**, deleting removes the definition and all associated run results. For **public challenges** with existing student run data, the system **archives** the challenge instead of deleting — all content and run results are preserved (see REQ-MGMT-02). |

### 2.8 Challenge Types

| ID | Requirement |
|----|-------------|
| REQ-CTYPE-01 | Two challenge types: **Practice** and **Assessment**. |
| REQ-CTYPE-02 | Practice: feedback and improvement advice shown after the Framing phase and after each Judge+Steer cycle. |
| REQ-CTYPE-03 | Practice: student may retry the Framing phase and navigate back to prior Judge+Steer cycles. |
| REQ-CTYPE-04 | Assessment: feedback and advice withheld until the entire challenge is submitted. |
| REQ-CTYPE-05 | Assessment: student cannot retry the Framing phase or individual cycles. |

### 2.9 Challenge Lifecycle

| ID | Requirement |
|----|-------------|
| REQ-LIFE-01 | **Definition phase:** all user-selected options are preserved; LLM-generated examples are shown as previews. Three evaluation rubrics are generated per REQ-EVAL-01 (one each for Frame, Judge, and Steer, even though Judge and Steer operate within the same phase). |
| REQ-LIFE-02 | **Definition phase:** each phase includes editable "instructions to students" text. Phase 2 (Judge+Steer) has a single set of instructions covering both sub-steps. Instructions have sensible defaults but can be modified by the challenge creator. |
| REQ-LIFE-03 | **Execution phase:** new LLM-generated problems and feedback are produced per student run. |
| REQ-LIFE-04 | **Definition phase:** the challenge creator (instructor or student) can preview the generated rubrics during challenge definition to review and verify rubric quality before saving. |

### 2.10 Challenge Content — Two Phases

| ID | Requirement |
|----|-------------|
| REQ-STEP-01 | Each challenge run begins with LLM task generation; the generated task is used across both phases. Generation inputs: the course, selected subject tree node(s), and a carefully crafted prompt from the prompt library (REQ-PLAT-04). The prompt is designed to produce problems with intentionally missing or ambiguous parts, so that the framing phase requires genuine effort and the AI-generated solution will contain non-trivial issues for the judging sub-step. |
| REQ-STEP-02 | **Phase 1 — Framing:** The system presents a raw, incompletely defined problem. The student's framing response starts with a read-only copy of the original raw problem text as a base field, and the student adds refinement sections (assumptions, constraints, clarifications, etc.) around it. The combined result — original problem plus refinements — is sent to the AI as the framed task. The AI produces a solution/output based on this framed task. |
| REQ-STEP-03 | **Judging (sub-step within each Phase 2 cycle):** The student reviews the current AI output and identifies gaps, errors, mismatches, or issues. This is an analytical step — the student's judgement is recorded but **not** sent to the AI. |
| REQ-STEP-04 | **Phase 2 — Judge+Steer Cycles:** Iterative paired cycles, each consisting of a judging sub-step (REQ-STEP-03) followed by a steering sub-step where the student sends an update/correction request to the AI. The AI processes the steering command and produces updated output for the next cycle. Student can mark "done/ready" at any cycle (including the first, if no issues are identified); max cycles defined during challenge creation. |

### 2.11 Student Response Types

| ID | Requirement |
|----|-------------|
| REQ-RESP-01 | Response type (multiple-choice or open-ended) is independently configurable for: (a) the Framing phase, (b) the Judging sub-step within each cycle, and (c) the Steering sub-step within each cycle. Configured during challenge creation. |
| REQ-RESP-02 | **Multiple-choice (select all that apply):** LLM generates a configurable number of options (default: 6), including challenging/non-trivial distractors. The student selects ALL options they believe are correct/relevant. Each option has an associated explanation revealed only **after** submission (as part of feedback). Feedback identifies correctly selected items, missed items, and incorrectly selected items. |
| REQ-RESP-03 | **Open-ended:** student provides a structured response as a list of user-named sections (each section has a name and description text). The structure is phase-specific: **(a) Framing:** the response includes a read-only copy of the raw problem as a base field; the student adds refinement sections around it (e.g., "Assumptions", "Performance Metric", "Constraints"). **(b) Judging:** the student adds and edits **gaps** — each gap has a user-given name and description (e.g., name: "Missing edge case", description: "AI doesn't handle empty input arrays"). The student can add, remove, and rename gaps freely. **(c) Steering:** the student adds and edits **instructions** — each instruction has a user-given name and description (e.g., name: "Handle edge cases", description: "Add input validation for empty arrays and null values"). The combined list of instructions is sent to the AI as the steering command. The student can add, remove, and rename instructions freely. |
| REQ-RESP-04 | **Steering with multiple-choice (select all that apply):** at each steering sub-step, the LLM generates possible correction directives as MC options based on the current AI response and previous interactions. The student selects ALL corrections they want to send to the AI in this cycle. |
| REQ-RESP-05 | **Judging with multiple-choice (select all that apply):** at each judging sub-step, the LLM generates MC options describing possible issues, gaps, or errors in the current AI output. The student selects ALL issues they identify. In addition, a separate "Solution is complete — no modifications needed" button is always available; selecting it ends the judge+steer cycle. The evaluator assesses whether the "complete" declaration was appropriate given remaining known issues. Judging responses are recorded but not sent to the AI. |
| REQ-RESP-06 | **Hint texts:** At each response point, the system displays a contextual hint explaining what kind of input the student can provide and what constitutes a strong response. Hints are phase-specific: Framing hints guide students to add refinement sections (assumptions, constraints, metrics, clarifications); Judging hints guide students to add named gaps with descriptions; Steering hints guide students to add named instructions with descriptions (open-ended) or select all applicable corrections (MC). Hints are informational and always visible — they are not part of the evaluation. **Hint texts are static** (hard-coded in the UI per response type and phase) — they are NOT generated by the LLM. |

### 2.12 Evaluation & Feedback

| ID | Requirement |
|----|-------------|
| REQ-EVAL-01 | During challenge definition, the LLM generates three rich evaluation rubrics — one each for **Framing**, **Judging**, and **Steering** — based on the selected subject tree and independent of any specific problem. Although Judging and Steering operate within the same phase (Phase 2), each retains its own rubric for separate grading. Rubrics include explanations and may incorporate typical student errors. |
| REQ-EVAL-02 | Rubric criteria drive multiple-choice distractor generation to probe specific student skills. Applies to Framing MC options (REQ-RESP-02), Judging MC options (REQ-RESP-05), and Steering MC options (REQ-RESP-04). |
| REQ-EVAL-03 | Rubric criteria drive per-phase feedback (Practice) or end-of-challenge report (Assessment). Within Phase 2, separate feedback is provided for judging quality and steering quality. Feedback text includes: (a) criticism of the student's choice/response, and (b) a better alternative. The rubric itself is not revealed to the student — it is used internally by the LLM to produce the feedback. |
| REQ-EVAL-04 | Qualitative grade per rubric criterion: **A** (excellent — no improvements needed), **B** (medium — a few minor improvements needed), **C** (unsatisfactory — many improvements needed or a serious point is missed). Three separate grades are assigned: Framing, Judging (across all cycles), and Steering (across all cycles). Shown to the student and aggregated for instructor analytics (public challenges only). Grading criteria are defined by a configurable, generic prompt (from the prompt library, REQ-PLAT-04) that describes what constitutes excellent, medium, and unsatisfactory performance — independent of any specific rubric. |

### 2.13 LLM Model Configuration

| ID | Requirement |
|----|-------------|
| REQ-MODEL-01 | All LLM functions in the system (problem generation, rubric generation, distractor generation, solution/output generation, feedback, grading, steering options) are served by a **single configurable model**. |
| REQ-MODEL-02 | The model follows a three-level override hierarchy: **(1) system-wide default** → **(2) Course Steward default** (REQ-COURSE-07, applies to all public challenges in the course) → **(3) challenge-level override** (set by the challenge creator in advanced settings). Each level overrides the one above it. For private challenges (no Course Steward), the hierarchy is system default → challenge override. |
| REQ-MODEL-03 | The model selection is stored as part of the challenge definition and applies to all runs of that challenge. If no challenge-level override is set, the Course Steward's model (for public) or system default (for private) is used at run time. |

---

## 3. User Flows

Each flow is documented in a separate file under `docs/spec/flows/`. Cross-references to requirements use the IDs above.

| Flow | Document | Primary Actor |
|------|----------|---------------|
| FLOW-01 | [Sign Up](flows/FLOW-01-sign-up.md) | Any user |
| FLOW-02 | [Create Challenge](flows/FLOW-02-create-challenge.md) | Student / Instructor |
| FLOW-03 | [Run Challenge](flows/FLOW-03-run-challenge.md) | Student / Instructor |
| FLOW-04 | [Publish Challenge](flows/FLOW-04-publish-challenge.md) | Instructor |
| FLOW-05 | [Browse Challenges](flows/FLOW-05-browse-challenges.md) | Student / Instructor |
| FLOW-06 | [Subscribe / Unsubscribe / Join / Leave Course](flows/FLOW-06-subscribe-claim-course.md) | Student / Instructor |
| FLOW-07 | [Analyze Assessments (Student)](flows/FLOW-07-analyze-student.md) | Student |
| FLOW-08 | [Analyze Assessments (Instructor)](flows/FLOW-08-analyze-instructor.md) | Instructor |
| FLOW-09 | [Create / Edit Course](flows/FLOW-09-create-edit-course.md) | Instructor |
| FLOW-10 | [Export Challenge Report](flows/FLOW-10-export-report.md) | Instructor |
| FLOW-11 | [Manage Challenge (Rename / Archive / Delete)](flows/FLOW-11-manage-challenge.md) | Challenge creator |
| FLOW-12 | [View / Edit User Profile](flows/FLOW-12-user-profile.md) | Any user |
