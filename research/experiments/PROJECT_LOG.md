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

## Current standing + next
- E1-on-DB abandoned (data invalid). E1 re-scoped to run on E3-generated controlled data.
- BLOCKER/GATE: all remaining experiments need the Groq API (llama-3.3-70b). Next action: verify the key works; if dead, fall back to OpenRouter/OpenAI (keys present).
- Then: build prompt-runner harness → regenerate a controlled challenge set with full ground truth → generate simulated learners (strong/weak/adversarial) → grade → run E1+E3 → E2 reliability → E4 ablation.
