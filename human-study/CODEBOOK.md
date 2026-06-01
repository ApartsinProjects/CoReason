# CoReasoning Human-Rater Codebook (LLM-judge validation study)

**Purpose.** Establish how well the automated CoReasoning grader agrees with expert human judgment.
You will read co-reasoning transcripts and assign an independent grade (A/B/C) to each of three
skills: **Framing, Judging, Steering**. Your grades are compared against the automated grader's
grades to compute inter-rater agreement (Cohen's kappa, Fleiss' kappa, Krippendorff's alpha) and
LLM-vs-human agreement. Do **not** consult the automated grades; they are withheld by design.

## Who should rate
2-4 raters with domain familiarity (instructors, TAs, or graduate students in the relevant subject).
Each rater grades the **same** item set, presented in an **individually shuffled** order. Rate
independently; do not confer until all grading is complete and submitted.

## The three skills (what each grade is about)

### FRAMING — turning an ill-defined problem into a well-specified task (BEFORE the AI runs)
The student is shown a deliberately ambiguous problem and adds *refinement sections* (assumptions,
constraints, clarifications, success metrics, scope). Grade the quality of that specification.
- **A (Excellent):** Surfaces the problem's real gaps; assumptions/constraints are specific, justified,
  and domain-appropriate; the framing would let a competent solver proceed without further questions.
- **B (Medium):** Addresses some gaps but misses others, or stays generic ("consider edge cases")
  without grounding in this problem; adequate but not thorough. No fundamental errors.
- **C (Unsatisfactory):** Vague, off-target, or near-empty; misses the central ambiguities; would not
  meaningfully improve a solver's task.

### JUDGING — critically evaluating the AI output (detecting its real flaws)
The AI output contains seeded flaws (errors, missing cases, unstated assumptions). The student flags
the issues they detect. Grade detection quality (recall AND precision).
- **A:** Catches all or nearly all genuine flaws, with few or no false alarms (flagging things that
  are actually fine). If the student declared the output complete, that was correct.
- **B:** Catches some genuine flaws but misses others, or mixes in a false alarm or two; partial.
- **C:** Misses most genuine flaws, flags mostly false issues, or wrongly declares a flawed output
  complete.

### STEERING — iteratively correcting the AI (issuing effective commands)
After judging, the student issues correction commands. Grade whether the commands are specific,
target the most critical remaining issues, and would plausibly move the output toward correctness.
- **A:** Precise, prioritized commands that target the critical flaws; would drive real improvement.
- **B:** Some useful commands but vague, mis-prioritized, or incomplete; partial improvement likely.
- **C:** Generic ("make it better"), counterproductive, off-target, or gives up prematurely.

## Grading rules
1. Grade each skill **independently** — a student can be strong on one and weak on another. Do not let
   a strong Framing halo your Judging grade.
2. Grade against the *problem and rubric shown*, not your own ideal solution.
3. Weight critical criteria more heavily; a single serious miss on a critical point can pull a grade to C.
4. Use the full scale. If unsure between two grades, choose the lower and note your uncertainty.
5. Record a one-line justification per skill (used for adjudication of disagreements).

## What you will see per item
- The raw (ill-defined) problem.
- The per-challenge rubric for the skill (criteria + indicators).
- The student's response for that skill (framing sections / flagged issues / steering commands).
- For Judging/Steering: the AI output under review.
You will **not** see the automated grade or the seeded-flaw ground-truth list (that would bias you).

## Output
Fill the `grade_framing`, `grade_judging`, `grade_steering` columns (values: A, B, or C) and the
matching `note_*` columns in your assigned CSV. Submit the completed CSV unchanged in structure.

## After collection
Run `score_agreement.py` to compute: pairwise Cohen's kappa, Fleiss' kappa (multi-rater),
Krippendorff's alpha (ordinal, the headline number), and LLM-vs-human agreement per skill, with
bootstrap confidence intervals. Target: agreement in the field-typical range (kappa ~0.3-0.8); per-skill
breakdown reveals which construct the automated grader measures most reliably.
