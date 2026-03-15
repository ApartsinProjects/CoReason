# FLOW-03: Run Challenge

**Actor:** Student or Instructor (for validation)
**Traces to:** REQ-AUTH-05, REQ-VIS-01, REQ-VIS-02, REQ-PLAT-08, REQ-LIFE-03, REQ-STEP-01–04, REQ-CTYPE-02–05, REQ-RESP-01–06, REQ-EVAL-01–04, REQ-MODEL-01

---

## Preconditions

- A challenge definition exists (with rubrics and instructions already generated during definition).
- User is signed in.
- Instructors may run challenges belonging to their courses for validation. *(REQ-AUTH-05)*

## Steps

1. User selects a challenge to run.
2. System calls LLM to generate a new problem instance using the course, subject tree node(s), and a carefully crafted prompt from the prompt library (intentionally producing problems with missing/ambiguous parts). Pre-defined rubrics are loaded for evaluation. *(REQ-LIFE-03, REQ-STEP-01, REQ-MODEL-01)*

### Phase 1 — Framing *(REQ-STEP-02)*
3. System presents the phase instructions, a contextual hint text *(REQ-RESP-06)*, and the raw, incompletely defined problem.
4. Student formulates assumptions and translates the problem into a well-defined task, then sends the framed task to the AI.
   - If multiple-choice (select all that apply): LLM-generated options represent individual refinements (assumptions, constraints, clarifications); student selects ALL that are appropriate. Distractors are driven by the Framing rubric. *(REQ-RESP-02, REQ-EVAL-02)*
   - If open-ended: the response starts with a read-only copy of the raw problem as a base field; the student adds refinement sections (assumptions, constraints, clarifications, etc.) around it. The combined result is sent to the AI. *(REQ-RESP-03)*
5. AI produces a solution/output based on the student's framing.
6. **Practice:** system shows Framing feedback and improvement advice immediately. *(REQ-CTYPE-02)*
   Student may retry. *(REQ-CTYPE-03)*
   **Assessment:** response is recorded; no feedback shown. *(REQ-CTYPE-04, REQ-CTYPE-05)*

### Phase 2 — Judge+Steer Cycles *(REQ-STEP-03, REQ-STEP-04)*
7. System presents the phase instructions and the current AI output (initially the solution from Phase 1).

#### Each cycle consists of two sub-steps:

**Sub-step A — Judging *(REQ-STEP-03)*:**
8. Student reviews the current AI output and identifies gaps, errors, mismatches, or issues. A contextual hint text guides the student on what to look for. *(REQ-RESP-06)*
   - If multiple-choice (select all that apply): LLM-generated options describe possible issues in the AI output; student selects ALL issues they identify. A separate "Solution is complete — no modifications needed" button is always available; selecting it ends the judge+steer process (the evaluator assesses whether this was appropriate). *(REQ-RESP-05, REQ-EVAL-02)*
   - If open-ended: student adds and edits named **gaps** (each with a name and description). *(REQ-RESP-03)*
9. The student's judgement is recorded but **not** sent to the AI.

**Sub-step B — Steering:**
10. Based on their judgement, the student sends an update/correction request to the AI. A contextual hint text guides the student on effective steering. *(REQ-RESP-06)*
    - If multiple-choice (select all that apply): LLM generates possible correction directives as MC options based on the current AI response and previous interactions. Student selects ALL corrections to send. *(REQ-RESP-04)*
    - If open-ended: student adds and edits named **instructions** (each with a name and description); the combined list is sent to the AI. *(REQ-RESP-03)*
11. AI processes the steering command and produces updated output.

**Cycle control:**
12. During the Judging sub-step, a "Solution is complete — no modifications needed" button is always available alongside the MC options / open-ended sections. Clicking it (instead of selecting issues) ends the judge+steer process. The evaluator assesses whether ending was appropriate given remaining known issues. Otherwise, the cycle repeats from sub-step A with the updated AI output.
13. Cycles continue until student marks "done/ready" or max cycles (defined during challenge creation) are reached.
14. **Practice:** system shows separate feedback for Judging quality and Steering quality after each cycle. *(REQ-CTYPE-02)*
    Student may navigate back to prior cycles. *(REQ-CTYPE-03)*
    **Assessment:** responses are recorded; no feedback shown. *(REQ-CTYPE-04, REQ-CTYPE-05)*

### Completion
15. **Practice:** all per-phase feedback has already been shown.
    **Assessment:** system now reveals collected feedback, advice, and qualitative grades. *(REQ-EVAL-03, REQ-EVAL-04)*
16. System assigns qualitative grades (A–C) per rubric: one for Framing, one for Judging (aggregated across cycles), and one for Steering (aggregated across cycles). *(REQ-EVAL-04)*

## Postconditions

- Challenge run is recorded with all responses, feedback, and grades.
- For public challenges, results are available to the course instructor. *(REQ-VIS-01)*
- For private challenges, results are visible only to the student. *(REQ-VIS-02)*
