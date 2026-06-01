# Experiment Index

All experiments for the CoReasoning feasibility demonstration. Detail and chronology in
[PROJECT_LOG.md](PROJECT_LOG.md). Engine: llama-3.3-70b (deployed) / gpt-4o (evaluation grader) /
gpt-4o-mini (learner simulator + robustness grader). Honesty: instrument feasibility only, no
learning-outcome claims; simulated learners; human-rater study prepared-not-run.

| ID | Experiment | Design | Headline result | Status |
|----|-----------|--------|-----------------|--------|
| C0 | Asset audit + data-quality | Profile the surviving DB + prompts | Deployed response data is synthetic seed junk; prompts + challenge content reusable | done |
| E3-gate | Discrimination gate | 1 challenge, expert vs careless | Expert B/A/B vs careless C/C/C; instrument discriminates | done |
| E3 | Crossed dissociation | 2^3 per-skill profiles x 5 then 10 challenges | **N=80**: own +1.02 vs cross +0.008; F-J ρ=-0.03 (ns) | done |
| E1 | Construct validity | Inter-skill correlations + PCA on E3 data | F-J/F-S ns; J-S ρ=+0.25 (P2); 1st PC 43% | done |
| E2 | Grader test-retest reliability | Re-grade fixed transcripts N=5 | 92% self-consistent (precision); judging deterministic | done |
| Robustness | Grader-backend robustness | Re-grade same 40 with gpt-4o-mini | Dissociation replicates (ratio 7.0); J own-effect 2.00→0.65 | done |
| Ablation-S | Harsher-Steering ablation | Strict steering rubric re-grade | Steering own-effect +0.40 (not higher) → not a leniency artifact | done |
| E4 | Ground-truth ablation | Strip gold-framing + seeded issues | (quantifies scaffolding contribution) | running |
| Human | Human-rater agreement (κ/α) | Blind experts re-grade a sample | prepared; needs human raters | prepared, not run |

## Artifacts
- Grades: `research/results/e3_dissociation_grades.csv` (N=80), `_n40.csv`, `_gpt4omini.csv`,
  `_strictsteer.csv`, `_noGT.csv`, `e3_dissociation_grades_expand.csv`.
- Reliability: `research/results/e2_reliability.csv`. Construct validity: `e1_construct_validity.json`.
- Figures: `docs/assets/fig_dissociation_heatmap.{png,svg}`, `fig_contrasts.{png,svg}`.
- Scripts: `research/scripts/` (harness.py, e3_pilot.py, e3_dissociation.py, e3_expand.py,
  e2_reliability.py, e1_analysis.py, make_figures.py, render_bib.py, batch_openai.py).
- Human study: `human-study/` (CODEBOOK.md, score_agreement.py). Datasheet: `research/DATASHEET.md`.
