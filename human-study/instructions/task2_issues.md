# Task 2 instructions: verify the seeded issues are genuine flaws

The CoReasoning instrument scores Judging against a set of machine-generated "issues" planted in the
AI output. This task checks that those seeded issues are, in fact, genuine flaws. You will read a
problem and an AI solution, then judge whether a stated issue is a real defect in that solution.

## Before you start
- Skim the codebook (`../CODEBOOK.md`), Judging section.
- Work independently; do not confer until all raters submit.
- Do not open files beginning with an underscore.

## Your file
`rater_<X>.csv`. Each row has:

| column | what it is |
|---|---|
| `problem` | the problem statement |
| `ai_output` | the AI solution |
| `issue` | a stated issue about the AI solution |

Fill the column `is_genuine_flaw` with exactly one of:
- `genuine` : the issue identifies a real defect in this AI output;
- `not_genuine` : the issue is not actually a defect (the output is fine in that respect, or the issue
  is irrelevant or wrong);
- `unclear` : you cannot tell from the problem and output alone. Use this sparingly.

Some items are deliberate distractors (not real flaws); do not try to guess which, just judge each on
its merits. Budget about 40 items, roughly 1 to 2 minutes each.

## Submitting
Save as `rater_<X>_complete.csv` and return it (lands in `../responses/task2/`). Keep the row order;
`item_id` is the join key.
