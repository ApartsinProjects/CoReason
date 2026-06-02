# CoReasoning human-rater study (3 raters): design and run-book

A pre-built, reproducible inter-rater agreement study that validates the automated CoReasoning grader
against human experts. Designed for **at most 3 raters**. Stages 1 to 4 (design, codebook,
instructions, sampling) are complete; stages 5 to 7 (provision, collect, score) run when raters are
available. Built with the `human-labeling` skill.

## What the study establishes
1. **Instrument validity (Task 1).** Do expert humans agree with the automated per-skill grades?
   This supplies the *extrapolation* inference in the Messick/Kane validity case (Section 10 of the
   paper) that the simulated feasibility demonstration cannot.
2. **Ground-truth validity (Task 2).** Are the machine-seeded Judging issues genuine flaws? The
   Judging construct is scored against them, so a human confirmation rate is required before the
   recall/precision signal is trusted.

## Design

| | Task 1: per-skill re-grading | Task 2: seeded-issue verification |
|---|---|---|
| pattern (skill taxonomy) | ordinal re-rating | per-item genuine/not decision |
| items | 40 transcripts, stratified to cover all 8 competence profiles | 40 issues (20 real + 20 distractor controls) |
| each item rated by | all 3 raters | all 3 raters |
| rater decision | A/B/C per skill (Framing, Judging, Steering) | genuine / not_genuine / unclear |
| hidden ground truth | the automated LLM grades (`_truth.json`) | intended real-vs-distractor label |
| per-rater load | ~40 transcripts x 3 skills | ~40 items |

**Why N=40 per task.** With 3 raters all rating the same items, the agreement statistics need at least
~30 items per rater pair for a usable estimate; 40 clears that and covers every one of the 8 crossed
competence profiles (5 transcripts each). The sample is stratified by profile (round-robin) and drawn
reproducibly (seed 42); each rater receives the same items in an independently shuffled order.

## Metrics (computed by the scoring scripts)
- **Primary: ordinal Krippendorff's alpha** across the 3 raters per skill (the grades are ordinal
  A>B>C, and alpha handles 3 raters and any missing data).
- **Fleiss' kappa** and the table of **pairwise Cohen's kappa** across raters, plus percent agreement.
- **Human-vs-LLM agreement**: human majority vote vs the automated grade, as Cohen's kappa, ordinal
  alpha, and percent agreement, per skill. This is the headline validity number.
- **Task 2**: inter-rater Fleiss kappa on genuine/not, the **confirmation rate** of seeded real issues
  (validity of the Judging ground truth), and the false-flaw rate on distractor controls.

**Interpretation targets** (field-typical for rubric grading): alpha / kappa in the **0.6 to 0.8**
band is the goal for the human-vs-LLM comparison; below ~0.4 would say the automated grade needs
rubric revision before deployment. With N=40 the agreement estimate has a bootstrap half-width on the
order of +/-0.1, enough to place the estimate in or out of the target band.

## File layout
```
human-study/
  README.md              <- this file
  CODEBOOK.md            <- canonical A/B/C definitions per skill (authoritative)
  instructions/
    task1_grading.md     <- rater brief for Task 1
    task2_issues.md      <- rater brief for Task 2
  scripts/
    _common.py           <- stats (Cohen, Fleiss, ordinal Krippendorff alpha) + sampling helpers
    sample_task1_grading.py  sample_task2_issues.py   <- seeded reproducible samplers
    score_task1_grading.py   score_task2_issues.py    <- agreement + human-vs-LLM scoring
  tasks/
    task1/ task2/        <- manifest.csv, _truth.json (hidden), rater_A/B/C.csv (blank decisions)
  responses/             <- drop rater_<X>_complete.csv here, then run the score_* scripts
```

## Run-book
1. **Sample** (already run; regenerate any time, deterministic):
   ```bash
   python human-study/scripts/sample_task1_grading.py    # -> human-study/tasks/task1/
   python human-study/scripts/sample_task2_issues.py     # -> human-study/tasks/task2/
   ```
2. **Provision.** Bare-CSV route: send each rater their `tasks/task<N>/rater_<X>.csv` plus the
   matching `instructions/` brief and `CODEBOOK.md`. (A Label Studio or Argilla route can be added
   via the human-labeling skill if a platform is preferred.)
3. **Collect.** Place returned `rater_<X>_complete.csv` files in `responses/task<N>/`.
4. **Score:**
   ```bash
   python human-study/scripts/score_task1_grading.py
   python human-study/scripts/score_task2_issues.py
   ```

## Ethics and scope
No personal data: transcripts are model-generated simulated learners. Raters judge AI outputs and
simulated responses, not human subjects, so the study is minimal-risk; institutional sign-off should
still be confirmed before recruiting. Recruitment, payment, and IRB are out of scope for this package.
