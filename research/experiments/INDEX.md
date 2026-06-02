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
| E4 | Ground-truth ablation | Strip gold-framing + seeded issues | Judging collapses (+2.00→+0.45); Framing unaffected (+0.75); separability survives (ratio 29) | done |
| Robustness-XV | Cross-vendor replication | Re-grade same 40 with Meta llama-3.3-70b (3rd backend, 2nd vendor) | Replicates: diag +0.65, off +0.02, ratio 39; J own-effect 0.75 (balanced across skills) | done |
| E6 | Convergent/discriminant validity | Inter-skill ρ: independent vs shared-ability population; cross-grader agreement | Discriminant mean\|ρ\|=0.13 vs convergent +0.41; cross-grader F+0.57/J+0.67/S+0.21 | done |
| E7 | Campbell-Fiske MTMM | Traits × 3 grader backends matrix; halo check | Convergent +0.49 >> halo +0.08 >> hetero-hetero +0.06; all 3 criteria pass, no halo | done |
| Human | Human-rater agreement (κ/α) | 3 raters re-grade 40 transcripts + verify 40 seeded issues | prepared; needs human raters | prepared, not run |

## Artifacts (every run kept under a unique name; never overwritten)
- Grades: `research/results/e3_dissociation_grades.csv` (N=80), `_n40.csv`, `_gpt4omini.csv`,
  `_strictsteer.csv`, `_noGT.csv`, `_xvendor.csv` (cross-vendor llama), `e3_dissociation_grades_expand.csv`.
  Complete transcripts: `e3_dissociation_complete{,_gpt4omini,_noGT,_strictsteer,_xvendor}.json`.
- Reliability: `research/results/e2_reliability.csv`. Construct validity: `e1_construct_validity.json`.
- Figures: `docs/assets/fig_dissociation_heatmap.{png,svg}`, `fig_contrasts.{png,svg}`.
- Scripts: `research/scripts/` (harness.py, e3_pilot.py, e3_dissociation.py [untagged-overwrite guard],
  e3_expand.py, e2_reliability.py, e1_analysis.py, e6_validity.py, e7_mtmm.py, make_figures.py,
  render_bib.py, batch_openai.py). Scout: `research/scout_2026-06_related_work.md`.
- Human study: `human-study/` (README, CODEBOOK, scripts/, tasks/). Datasheet: `research/DATASHEET.md`.
- **Result-preservation rule**: every experiment writes a unique tagged/timestamped file; superseded runs
  are marked `superseded-by-#N`, never deleted or overwritten (see `e3_dissociation.py` guard).
