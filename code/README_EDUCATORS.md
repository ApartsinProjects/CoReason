# Using CoReasoning to assess a student (no web app required)

This is the educator/researcher entry point to the CoReasoning scoring engine: the same
sixteen prompts the CoReasoning Lab prototype used. It lets you run a full co-reasoning
challenge and get three independent, rubric-driven grades (Framing, Judging, Steering) for a
real student, from the command line.

## What it does
For any subject you name, the engine:
1. generates a deliberately ill-defined problem (the student must specify it: **Framing**);
2. produces a plausible but deliberately flawed AI solution (the student must critique it: **Judging**);
3. accepts the student's correction commands and revises the output (the student must redirect it: **Steering**);
4. scores each skill A/B/C against an auto-generated rubric and returns per-criterion feedback.

The three skills are scored **apart**, so a report tells you not just *that* a student's AI use was
weak but *which* of the three competencies to teach next.

## Setup (one time)
- Python 3.11+ with `pip install pyyaml openai` (the harness uses these).
- API keys in `~/.config/coreason/.env.all`:
  ```
  OPENAI_API_KEY=sk-...
  # optional, for a non-OpenAI grader:
  OPENROUTER_API_KEY=sk-or-...
  ```
  Pick the grader with `COREASON_GRADER=openai:gpt-4o` (default) or
  `COREASON_GRADER=openrouter:meta-llama/llama-3.3-70b-instruct`.

## Three ways to run

**1. See it work (demo):**
```bash
python code/run_session.py --subject "Algorithms > Sorting & Searching" --demo
```

**2. Live with a student at the console:**
```bash
python code/run_session.py --subject "Statistics > Hypothesis Testing" --interactive
```
The tool prints the problem, then the flawed AI solution, and prompts the student for their
framing sections, the flaws they spot, and their steering commands.

**3. Batch / experimenting (score saved responses):**
```bash
python code/run_session.py --subject "Microeconomics > Supply & Demand" \
       --responses student.json -o report.json
```
where `student.json` is:
```json
{
  "framing":  [{"section_type": "Assumptions", "content": "..."},
               {"section_type": "Constraints", "content": "..."}],
  "judging":  ["a flaw the student found", "another flaw"],
  "steering": ["a precise correction command", "another command"]
}
```

## Output
A per-skill report: each skill's grade (A/B/C), the per-criterion scores and feedback, and, for
Judging, which seeded flaws the student missed or falsely raised. With `-o`, the same report is
written as JSON for record-keeping or class analytics.

## Notes for researchers
- The scoring engine (`code/artifacts/prompt-debug/originals/*.yaml`) is run verbatim; this runner is
  thin orchestration around it. To reproduce the paper's dissociation study instead, see
  `research/scripts/` and `research/experiments/INDEX.md`.
- Runs are cached deterministically under `research/data/llm_cache/`, so re-scoring identical inputs is
  free and reproducible.
- To validate the automated grades against human experts before high-stakes use, the prepared 3-rater
  agreement package is in `human-study/`.
