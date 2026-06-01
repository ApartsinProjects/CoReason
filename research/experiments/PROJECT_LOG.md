# CoReasoning Lab — Instrument Validation: PROJECT LOG

Core setting (one line): Validate an automated rubric-driven LLM instrument that scores three
AI-collaboration skills (Framing / Judging / Steering) from intentionally-imperfect LLM outputs.
Target: arXiv preprint → journal (Computers & Education: AI / IJAIED). Honesty: instrument paper
only, NO learning-outcome claims; human-rater study prepared-not-run.

## Chronological log

| Cycle | Date | Experiment | Result / numbers | Sanity | Finding |
|------|------|-----------|------------------|--------|---------|
| C0 | 2026-06-01 | Asset audit + DB profiling | App source GONE; 16 prompt YAMLs survive; DB has 67 challenges/126 runs/205 cycles | OK | Prompts + content are the load-bearing surviving assets |
| C0 | 2026-06-01 | Data-quality profile (e1_extract.py) | **98% of runs have degenerate responses**: 100 `submitted` = literal "Demo framing response for analytics seeding."; judging = `{markedComplete:true}`; steering = `"A"` | RED FLAG confirmed real | **Existing response data is synthetic seed junk → E1-on-DB is DEAD.** Grades carry no construct signal |
| C0 | 2026-06-01 | Challenge-content audit | 43/67 challenges have real `rawProblem`+`framingOptions`; 64 runs have real `ai_solution` (>200 chars); rubrics NOT stored (null), seeded `internal_issues` NOT stored | OK | Challenge SUBSTRATE is partially real and reusable; ground-truth pieces must be regenerated via prompts 02/03/05/06/07 |
| C0 | 2026-06-01 | API gate | Groq llama-3.3-70b-versatile **OK** (exact original engine); OpenRouter llama-3.3-70b **OK** (fallback); OpenAI dead (archived project) | OK | Compute program UNBLOCKED; use Groq, OpenRouter backup |

## Key findings (consolidated)
1. **The deployed app's response data cannot support any empirical claim** (it is seed/demo placeholder text). Anything built on the DB's grade triples directly would be invalid.
2. **The challenge problems + AI solutions are genuine LLM content** and can serve as a fixed substrate.
3. **Pivot:** the empirical core (E1 construct validity, E2 reliability, E3 discrimination, E4 ablation) must run on **freshly generated, controlled simulated-learner data** produced by the surviving prompt engine over the real (or regenerated) challenge substrate. This is cleaner and more reproducible than the demo DB anyway.

## C1 (2026-06-01): STRATEGIC PIVOT — theory-forward conceptual paper
User redirect: prioritize a THEORETICAL/CONCEPTUAL framework paper (publishable without primary
empirical data), with the compute experiments repurposed as a **feasibility demonstration**.
- Conceptual papers are publishable in EdTech: Computers & Education: AI has an explicit **Position
  Paper** type ("not necessarily required to include data"); AIED **Blue Sky** track ("do not
  require new empirical results"); IJAIED position papers; Frontiers Conceptual Analysis / Hypothesis & Theory.
- **The empirical work is NOT wasted**: all three lit scouts independently concluded the strongest
  defense against "this is just relabeling" is to **show the 3 skills empirically DISSOCIATE**.
  => E1 (construct validity) + E3 (discrimination) ARE the feasibility demo. Integration is clean.
- **Novelty boundary (must confront head-on):** Dakan & Feller 2025 *4D AI Fluency* (Anthropic:
  Delegation/Description/Discernment/Diligence) and Tankelevitch et al. CHI 2024 *Metacognitive
  Demands of GenAI*. Our wedge: **temporal separation of Framing (pre-generation) from Steering
  (post-generation)** — every prior framework fuses both under "prompting/iteration" — plus
  grounding in metacognition + appropriate-reliance theory as an *assessable competency model*.
- Theory anchors: metacognition (Nelson&Narens monitor=Judge/control=Steer), SRL (Winne&Hadwin
  task-definition=Framing), epistemic vigilance + critical thinking (Judging), productive struggle
  (anti-speed stance). See paper/FRAMEWORK_DESIGN.md.

## C2 (2026-06-01): E3 discrimination GATE — PASSED
Minimal synchronous gate (1 challenge, expert vs careless), OpenRouter llama-3.3-70b:
| learner | Framing | Judging | Steering | judging recall/precision |
|---------|:---:|:---:|:---:|---|
| expert   | B | A | B | 4/4 real flagged, 0 false |
| careless | C | C | C | 0/4 real, 2 false |
Every skill drops expert→careless; judging behaves exactly per design (perfect recall/precision→A;
zero recall + false positives→C). **The instrument discriminates competence** => feasibility signal
for the conceptual paper secured. Infra note: Groq free-tier TPM unusable (calls hang/timeout);
OpenRouter primary fixes it (~10s/call, ~85s for the 8-call per-learner chain). Keys moved out of
repo to ~/.config/coreason/.env.all (git history verified clean).

## C3 (2026-06-01): Sanity/bug audit + DECONTAMINATION
Bugs found & fixed: (1) `_chat` returned None content unguarded -> crash; now retries/failovers.
(2) Demo crashed mid-run on a transient OpenRouter error falling through to TPD-exhausted Groq;
fixed with provider chain [OpenRouter-llama x7, OpenAI gpt-4o-mini x3 fallback, Groq x2].
Validity improvements: (a) **DECONTAMINATION** — learners now simulated by gpt-4o-mini (OpenAI),
graded by llama-3.3-70b (different model) -> removes self-grading bias. (b) **Faithful steering**:
replaced hand-coded remaining-issues with actually re-running prompt 04 on the student's commands.
Grader sanity (cache inspection): per-criterion notes reference the student's actual text; judging
recall/precision logic operates; justifications specific; confidence varies; NO competence-label leakage.
Decontaminated gate result (1 challenge): expert F=B/J=A/S=B vs careless F=C/J=C/S=C — **discrimination
survives cross-model decontamination**. Grader mix: 5 OpenRouter-llama, 1 OpenAI fallback.
Infra: Groq free-tier daily token limit (100k TPD) exhausted; OpenRouter primary + OpenAI fallback.

## C4 (2026-06-01): DISSOCIATION experiment (reviewer's central ask) + bug sweep
Reviewer round 1 = Major Revision. Central point: uniform-competence personas (expert->careless)
canNOT show dissociation (P3) — monotone-on-all-skills is consistent with ONE competence factor.
Fix = CROSSED per-skill profiles (full 2^3 factorial: each skill independently strong/weak).
Smoke (1 challenge, 8 profiles, sim=gpt-4o-mini, grade=gpt-4o):
  own-effect (grade delta strong-weak) diagonal mean = +0.92; off-diagonal (cross) = -0.08;
  **DISSOCIATION RATIO = 11.0**. Judging dissociates perfectly (+2.00 own / 0.00 cross — but note
  judging selection is PROGRAMMATIC, so this is the controlled anchor). Framing/steering own-effects
  positive but noisier at n=1 (LLM-graded). Designed contrasts: strong-framer/weak-judge -> F=B,J=C;
  weak-framer/strong-judge -> F=B,J=A (skills decouple as designed).
Sanity (per standing directive): judging_grade clean by level (expert->A, novice->C); framing varies
  realistically (expert [B,B,A,B] vs novice [C,B,B,B]); NO cross-skill leakage path. No bug.
Bugs fixed this cycle (4): (1) prompt 04 JSON TRUNCATION at max_tokens -> raised to 3500 + JSON
  salvage + faithful-steering try/except fail-safe. (2) schema-ECHO (model returned the schema, not
  data) -> augmentation now demands content+lists keys + echo-retry guard. (3) PROSE fallback (llama
  ignores json_mode on prompt 01) -> wrap prose into primary string field. (4) provider None-guard.
Full run (5 challenges x 8 profiles = 40 learners, gpt-4o grader) launched for stable estimates + CIs.

## C5 (2026-06-01): Review round 2 = MINOR REVISION + analyses
Round-1 structural blockers RESOLVED (dissociation run + novelty defense + J/S boundary). Round-2
must-dos addressed: (1) fixed Sec 11 model-family contradiction (gpt-4o-mini learners / gpt-4o grader;
deployed engine llama noted as future robustness); (2) figure-numbering collision (Sec 7 screens ->
Figures A1/A2); (3) reinterpreted weak steering own-effect as grader-leniency floor + added bootstrap
CIs; (4) re-scoped propositions (P3 demo-supported, P2 partial, P1/P4/P5 = validation hypotheses with
named falsifiers); (5) named the recursive "who grades the grader" threat + committed to human-verified
seeded-issue subset; bib count 43->50.
Supporting analyses (no API): inter-skill Spearman correlations (N=40): F~J rho=0.00, F~S=-0.22,
J~S=+0.17 (all p>0.17); 1st principal factor = 42% variance (=> separable). Bootstrap 95% CI on
diagonal own-effects: Framing +0.60 [+0.38,+0.81], Steering +0.50 [+0.18,+0.82], Judging +2.00 (det).
E2 grader reliability run in progress (re-grade fixed transcripts N=5, bypass cache on 08/09/10/11).

## C6 (2026-06-01): Review round 3 = ACCEPT (with one production fix, now applied)
Round 3: "effectively Accept; science is done, no new computation needed." 4/5 round-2 must-dos fully
resolved; the one BLOCKER (B-1): figures referenced `assets/...` but lived only in `docs/assets/`
(raw-markdown/source links broken). FIXED: figures now also in `paper/assets/` (markdown source +
docx resolve from paper/; HTML uses docs/assets); make_figures.py writes both; docx regenerated with
--resource-path=paper (central evidence PNGs embed; 3 SVG diagrams show alt-text in docx only, a
no-cairo tooling limit, HTML renders them natively). Non-blocking polish applied: ratio stated precisely
(diag +1.03 / offdiag -0.017 ~ 60:1); 255-call decomposition added; bib note says 50.
E2 reliability (92% self-consistent) + inter-skill correlations + bootstrap CIs all verified internally
consistent by the reviewer. **Review loop converged at Accept.**

## Current standing + next
- E1-on-DB abandoned (data invalid). E1 re-scoped to run on E3-generated controlled data.
- BLOCKER/GATE: all remaining experiments need the Groq API (llama-3.3-70b). Next action: verify the key works; if dead, fall back to OpenRouter/OpenAI (keys present).
- Then: build prompt-runner harness → regenerate a controlled challenge set with full ground truth → generate simulated learners (strong/weak/adversarial) → grade → run E1+E3 → E2 reliability → E4 ablation.

## C7 (2026-06-01): Round-4 line-by-line reviews + grader robustness
Both journal reviews (education-sciences + computers-&-education) line-by-line: **Minor Revision,
leaning Accept**; numbers re-verified exactly from CSVs. Grader-backend robustness COMPLETED:
re-graded the same 40 transcripts with gpt-4o-mini (vs gpt-4o): dissociation REPLICATES (diag +0.47
vs off-diag +0.07, ratio 7.0); Judging own-effect falls +2.00->+0.65 (so the +2.00 was gpt-4o-specific,
not a construct artifact) -> separation more balanced across skills under a 2nd backend; designed
contrasts replicate. Fixes applied: purge em-dashes (0 remain) + en-dash compounds standardized;
abstract softened (strongest not decisive) + precision-not-accuracy + released-artifact sentence +
cross-grader replication; integrate robustness paragraph in Sec 8; blind-graded flip-rate ~0.12 noted;
255-vs-280 caching reconciled; Judging ground-truth flagged machine-generated/contingent; learner->
simulated/model-assigned slips fixed; "metacognitive laziness" now cites Fan et al. 2025 (BJET).
Bibliography 55 refs, 54 valid (Acar HBR verified live, HTTP 200). HTML+docx rebuilt.
