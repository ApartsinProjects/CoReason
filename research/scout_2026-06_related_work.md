# Scout: related work, datasets, and method ideas (June 2026)

Web-researcher scouting for strengthening the CoReasoning paper. Preserved so future
sessions don't redo the scout. Tiers map to the agreed work plan.

## Direct competitor / positioning (cite + contrast)
- **Collaborative AI Literacy + Collaborative AI Metacognition scales** (Int. J. Human-Computer
  Interaction, 2025). Independently decomposes human-AI collaboration into critically-evaluate /
  communicate / coordinate, with metacognition as a separate factor. Their evaluate/communicate map onto
  Judging/Steering. Cite as convergent external evidence the trichotomy isn't idiosyncratic; contrast
  that CoReasoning is performance-assessed, not self-report.
  https://www.tandfonline.com/doi/full/10.1080/10447318.2025.2543997
- **"Can students judge like experts? ... pedagogical quality of AI vs human feedback"** (Computers &
  Education: AI, 2025). Non-experts systematically misjudge feedback quality vs experts. Motivates the
  Judging construct AND warns our 3 human raters need expert calibration. Same target venue.
  https://www.sciencedirect.com/science/article/pii/S2666920X25001730

## Validated instruments (benchmark/cite; all measure LITERACY, not task-performance skill = our white space)
- **AICOS** (AI Competency Objective Scale), objective MCQ not self-report (CAEAI 2025; arXiv 2503.12921).
- **GLAT** (GenAI Literacy Assessment Test), 20-item MCQ (arXiv 2411.00283). [already cited]
- **GenAIComp** (Technology in Society 2026). [already cited as Lee et al.]
- **SAIL4ALL** (Nature HSS Communications 2025), 56 items.
Action: add a discriminant-validity contrast of FJS grades against a GenAI-literacy proxy.

## Datasets for EXTERNAL validation (real student-AI transcripts, no new human labels)
- **StudyChat** (arXiv 2503.07928): 16,851 real student-ChatGPT messages, a semester university AI
  course, dialogue-act annotated. HIGHEST-VALUE idea: score real transcripts with the FJS rubric to
  escape the simulated-only critique. Caveat: free-chat format lacks seeded ground-truth flaws, so it
  validates Framing/Steering construct presence strongly and Judging only partially.
  https://arxiv.org/abs/2503.07928
- **"Do Students Rely on AI?"** real student-ChatGPT transcripts (arXiv 2508.20244): reliance analysis,
  usable for the Judging/over-reliance dimension.
- **ConvoLearn / MRBench** (arXiv 2601.08950): tutoring conversations, 8 pedagogical dimensions.

## Method upgrades WITHOUT human data (LLM-judge validity)
1. Full Campbell-Fiske MTMM matrix (traits x grader-backends): convergent vs HALO (heterotrait-monomethod).
   **DONE** (`research/scripts/e7_mtmm.py`): convergent r=+0.49 >> halo r=+0.08, all 3 criteria pass.
2. IRT-on-judges (arXiv 2602.00521): per-rubric-item difficulty/discrimination; flag non-diagnostic items.
3. Self-inconsistency control / "Rating Roulette" ~25% flip on hard cases (arXiv 2510.27106): frames our
   92% self-consistency favorably.
4. Grading-scale ablation: human-LLM alignment peaks at 0-5 (arXiv 2601.03444); add a 0-5 arm + QWK.
5. Ill-defined-task scoring conflates failure modes (arXiv 2603.17067): design rubric items so Framing-
   vs Judging-failures can't both load on one score.
6. Fluency-confound adversarial arm: fluent-but-wrong personas; if scored C, the instrument tracks
   substance not style.

## Reliability-target template for the planned human study
Springer "LLM-as-judge vs human ratings for large-scale assessment" (2026): rubric calibrated by 3 human
raters, report QWK, thresholds kappa>0.6, alpha~0.8.
https://link.springer.com/article/10.1186/s40536-026-00287-w

## Forward directions (future work / next papers)
- Longitudinal development + booster sessions (retention; medRxiv AI-literacy RCT shows 22% loss at 12wk).
- Instructional-intervention RCT for trainability (maps "question the machine", Clerc et al. 2026 [cited]).
- Domain transfer of Framing (tests P4).
- Metacognition mediation: monitoring accuracy predicts Judging (Educ. Psych. Review 2026; BJET 2025).

## Note
No source applies Campbell-Fiske MTMM to LLM-judge graders specifically: our Section 3.1 + Table 3 +
e7_mtmm framing is a genuinely novel, citable contribution, not a borrowed method.
