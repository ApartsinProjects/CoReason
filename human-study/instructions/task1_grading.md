# Task 1 instructions: re-grade the three CoReasoning skills

Thank you for serving as an expert rater. You will read co-reasoning transcripts and assign an
independent **A / B / C** grade to each of three skills: **Framing, Judging, Steering**. Your grades
are compared with two other raters and with the automated grader.

## Before you start
- Read the **codebook** (`../CODEBOOK.md`) once in full. It defines what A, B, and C mean for each
  skill, with examples. Keep it open while you grade.
- Work **independently**. Do not confer with the other raters until everyone has submitted.
- Do **not** open any file beginning with an underscore (e.g. `_truth.json`); those hold the automated
  grades and intended labels and must stay hidden from you.

## Your file
You received `rater_<X>.csv` (your letter). Each row is one transcript, with these columns to read:

| column | what it is |
|---|---|
| `subject` | the course/topic |
| `problem` | the deliberately ill-defined problem the learner was given |
| `framing_rubric` | the rubric for Framing |
| `learner_framing` | the learner's framing response (assumptions, constraints, etc.) |
| `ai_output` | the deliberately flawed AI solution |
| `seeded_issues` | the genuine flaws planted in the AI output (for your reference when grading Judging) |
| `judging_rubric` | the rubric for Judging |
| `learner_judging_flagged_real` / `_false` | which real issues the learner caught, and any false alarms |
| `steering_rubric` | the rubric for Steering |
| `learner_steering` | the learner's correction commands |

Fill **only** these three columns (leave them as `A`, `B`, or `C`):
`framing_grade`, `judging_grade`, `steering_grade`.

## How to grade each skill (summary; the codebook is authoritative)
- **Framing**: does the learner's specification surface the problem's real gaps with specific,
  justified, domain-appropriate assumptions and constraints? A = thorough and on-target, B = partial,
  C = vague or off-target.
- **Judging**: did the learner detect the genuine flaws (good recall) without raising false ones (good
  precision)? Compare `learner_judging_flagged_real/_false` against `seeded_issues` and your own read
  of `ai_output`. A = catches (nearly) all real flaws with few false alarms, C = misses most or
  invents flaws.
- **Steering**: are the commands specific, prioritized, and likely to move the output toward
  correctness? A = precise and well-prioritized, C = generic or off-target.

## Submitting
Save your completed file as `rater_<X>_complete.csv` and return it (it lands in
`../responses/task1/`). Keep your row order as delivered; the `item_id` column is the join key.
Budget roughly 40 transcripts, about 3 to 5 minutes each.
