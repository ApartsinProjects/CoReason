# FLOW-02: Create Challenge

**Actor:** Student or Instructor
**Traces to:** REQ-AUTH-04, REQ-VIS-01, REQ-VIS-02, REQ-PLAT-08, REQ-LIFE-01, REQ-LIFE-02, REQ-CTYPE-01, REQ-STEP-01–04, REQ-RESP-01–06, REQ-EVAL-01, REQ-MODEL-01–03

---

## Preconditions

- User is signed in.

## Steps

1. User selects "Create Challenge."
2. User specifies challenge metadata: title, course, one or more subject tree nodes (selected via a tree control with checkboxes — checking a parent node selects all its children), and description.
3. Challenge visibility is determined by actor:
   - **Instructor** → public challenge, publishable to course subscribers. *(REQ-VIS-01)*
   - **Student** → private challenge, visible only to the creating student. *(REQ-VIS-02)*
4. User selects challenge type: **Practice** or **Assessment**. *(REQ-CTYPE-01)*
5. User configures the two phases:
   - **Phase 1 — Framing:** defines the problem domain and complexity. *(REQ-STEP-02)*
   - **Phase 2 — Judge+Steer Cycles:** defines judging criteria scope and sets max cycles. *(REQ-STEP-03, REQ-STEP-04)*
6. For each configurable response point, user selects the response type (multiple-choice or open-ended): *(REQ-RESP-01)*
   - Phase 1 — Framing response type
   - Phase 2 — Judging sub-step response type *(REQ-RESP-05)*
   - Phase 2 — Steering sub-step response type *(REQ-RESP-04)*
7. For each phase, system presents default "instructions to students" text. Phase 2 has a single set of instructions covering both the judging and steering sub-steps. User may edit these instructions. *(REQ-LIFE-02)*
8. *(Optional — advanced settings)* User may override the **LLM model** for this challenge. Default is system-wide. *(REQ-MODEL-02, REQ-MODEL-03)*
9. System calls LLM to generate three evaluation rubrics (Framing, Judging, Steering), based on the selected subject tree and independent of any specific problem. Although Judging and Steering share Phase 2, each retains its own rubric. Rubrics may include typical student errors. *(REQ-LIFE-01, REQ-EVAL-01)*
10. System generates an example problem as a preview. *(REQ-LIFE-01)*
11. System generates the **best framing** (gold-standard ideal framing) for the example problem. The best framing starts from the raw problem and adds refinement sections chosen by the LLM based on relevance to this specific problem (e.g., assumptions, constraints, clarifications, success metrics). This artifact is stored internally and used by the framing evaluation prompt (prompt 08) — it is never shown to students. *(REQ-EVAL-03)*
12. System displays static hint texts for each response point (Framing, Judging, Steering) based on the configured response types. Hints are hard-coded per phase and response type. *(REQ-RESP-06)*
13. User reviews rubrics, examples, and instructions; adjusts configuration as needed.
14. User saves the challenge definition. All user-selected options are preserved. *(REQ-LIFE-01)*

## Postconditions

- Challenge is saved in definition state with rubrics, instructions, and configuration.
- Public challenges are ready to be published (→ FLOW-04). Private challenges are ready to be run.
