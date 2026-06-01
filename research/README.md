# CoReasoning: Research & Reproducibility

This directory contains the empirical feasibility material for the CoReasoning paper: a
controlled-generation harness over the surviving 16-prompt instrument, the experiments, and the
released data. **No learning-outcome claims are made**; the experiments demonstrate that the three
skills (Framing, Judging, Steering) are *separable* and *automatically measurable*.

## Why generated data (not the deployed app's data)
The deployed prototype's database survives, but its stored "student" responses are synthetic seed
placeholders (e.g. literally `"Demo framing response for analytics seeding."`), so its grades carry
no construct signal. The prompts and challenge content are genuine. We therefore generate controlled
simulated-learner transcripts over the real prompt engine, which is fully reproducible and gives known
ground truth.

## Layout
```
research/
  scripts/
    harness.py        # loads the 16 production prompts, runs them via OpenRouter/Groq (cached)
    e3_pilot.py       # E3: simulated-learner discrimination (4 competence levels x N challenges)
    e3_gate_min.py    # minimal synchronous discrimination gate (expert vs careless)
    e1_analysis.py    # E1: construct validity (inter-skill correlation + factor analysis)
    e1_extract.py     # DB profiling (documents why the deployed data is unusable)
  data/
    llm_cache/        # deterministic per-call cache (reproducible LLM outputs)
    e1_grade_triples.csv
  results/            # grades CSVs + analysis JSONs
  experiments/
    PROJECT_LOG.md    # chronological experiment registry
```

## Reproduce
```bash
# Keys live OUTSIDE the repo (never committed):
#   ~/.config/coreason/.env.all   (or set COREASON_ENV_FILE)
#   requires OPENROUTER_API_KEY (primary) and/or GROQ_API_KEY (fallback)
python research/scripts/e3_gate_min.py      # fast discrimination gate
python research/scripts/e3_pilot.py         # full demo -> results/e3_pilot_grades.csv
python research/scripts/e1_analysis.py research/results/e3_pilot_grades.csv
```
The `llm_cache/` makes runs deterministic and free on re-run. Delete a cache file to force a fresh call.

## Model
Engine: `llama-3.3-70b` (the deployed prototype's model), accessed via OpenRouter
(`meta-llama/llama-3.3-70b-instruct`) with Groq (`llama-3.3-70b-versatile`) as fallback.

## Instrument prompts
The 16 production prompts are at `code/artifacts/prompt-debug/originals/*.yaml`. Key ones:
problem generation (01), rubric generation (02), imperfect-solution generation (03), best-framing gold
(14), the three skill evaluators (08/09/10), and the generic grader (11).
