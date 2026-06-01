# CoReasoning

![CoReasoning hero](docs/assets/hero-gemini-coreasoning.png)

**Teaching and assessing the skill of working with generative AI**, decomposed into three
independently-assessable competencies: **Framing**, **Judging**, and **Steering**.

> Most AI-in-education tools optimize for speed-to-answer. CoReasoning optimizes for
> quality-of-thinking: learners improve intentionally imperfect AI output through structured reasoning
> loops, and the three skills are scored separately.

## 📄 Paper (open-source, MIT)

**"Framing, Judging, Steering: An Assessable Competency Model for Teaching Students to Reason With
Generative AI"** by Alexander Apartsin (Holon Institute of Technology) and Yehudit Aperstein (Afeka
College of Engineering).

A theoretically-grounded competency model with a proof-of-concept instrument and a feasibility
demonstration that the three skills **dissociate**: own-skill grade effects average +1.02 versus +0.01
for cross-skill effects (N=80 across 10 subjects; the cleanest pair, Framing and Judging, is
uncorrelated, ρ=−0.03 ns), the result replicates across grader backends, and the grader is 92%
self-consistent. No learning-outcome claims are made; a human-rater validation study is prepared.

- 📖 **Read it (HTML + KaTeX):** <https://apartsinprojects.github.io/CoReason/>
- 📝 **Word:** [`docs/coreasoning.docx`](docs/coreasoning.docx) · **Source:** [`paper/coreasoning.md`](paper/coreasoning.md)
- 📚 **Bibliography:** [`paper/references.bib`](paper/references.bib) (55 entries, validated)
- ✉️ **Submission package:** [`paper/SUBMISSION/`](paper/SUBMISSION/) (cover letter + anticipated reviewer response)

## The framework

- **Framing**: turn an ill-defined problem into a well-specified task *before* invoking AI.
- **Judging**: critically evaluate AI output for errors, gaps, unstated assumptions, and risk.
- **Steering**: iteratively redirect the AI toward a better solution across cycles.

The defining move is separating the *pre-generation* skill (Framing) from the *post-generation*
corrective skill (Steering), which prior frameworks fuse under "prompting." Each skill is grounded in
established theory (metacognitive monitoring and control, self-regulated learning, epistemic vigilance,
productive struggle), and the model states five testable propositions about how the skills relate.

## The instrument and CoReasoning Lab

CoReasoning Lab is a prototype learning platform that auto-generates ill-defined problems with seeded
flaws, presents deliberately-imperfect AI output, runs judge-and-steer cycles, and scores the three
skills with rubric-driven LLM evaluators. **What this repository releases and evaluates is the scoring
engine**: the sixteen prompts at `code/artifacts/prompt-debug/originals/*.yaml` plus the
controlled-generation harness in `research/`. The interface figures in the paper are representative
mockups; static UI mockups live in `screens/`.

## Repository map

```text
paper/            manuscript (coreasoning.md), references.bib, figures, build_html.py, SUBMISSION/, reviews/
docs/             rendered site: index.html (KaTeX), coreasoning.docx, assets/ (served via GitHub Pages)
research/
  scripts/        reproducible harness: harness.py, e3_dissociation.py, e3_expand.py,
                  e2_reliability.py, e1_analysis.py, make_figures.py, render_bib.py, batch_openai.py
  results/        grades CSVs + analysis JSONs (N=80 + ablations + robustness)
  experiments/    registry: PROJECT_LOG.md, INDEX.md
  DATASHEET.md    dataset documentation (Gebru-style)
human-study/      prepared human-rater study: CODEBOOK.md, score_agreement.py
code/artifacts/prompt-debug/originals/   the sixteen-prompt scoring instrument (YAML)
screens/          static UI mockups of the prototype
```

## Reproduce

API keys live outside the repo (never committed). Provide them in `~/.config/coreason/.env.all` (or set
`COREASON_ENV_FILE`), with `OPENAI_API_KEY` and/or `OPENROUTER_API_KEY` / `GROQ_API_KEY`.

```bash
# dissociation (N=80 across 10 subjects) + analyses
COREASON_GRADER=openai:gpt-4o python research/scripts/e3_dissociation.py 5   # 5 subjects
COREASON_GRADER=openai:gpt-4o python research/scripts/e3_expand.py           # +5 subjects -> N=80
python research/scripts/e1_analysis.py research/results/e3_dissociation_grades.csv
COREASON_GRADER=openai:gpt-4o python research/scripts/e2_reliability.py      # grader test-retest
python research/scripts/make_figures.py                                     # regenerate figures
python paper/build_html.py                                                  # rebuild docs/index.html
```

A deterministic disk cache (`research/data/llm_cache/`) makes runs reproducible and free on re-run.
See [`research/README.md`](research/README.md) and [`research/experiments/INDEX.md`](research/experiments/INDEX.md)
for the full experiment list.

## Status

The conceptual paper and the feasibility demonstration (E1 construct validity, E2 reliability, E3
dissociation at N=80, E4 ground-truth ablation, grader-backend robustness, a harsher-steering ablation,
and per-subject breakdowns) are complete. The one open item is the **human-rater agreement study**,
fully prepared in [`human-study/`](human-study/CODEBOOK.md) and requiring human graders. No
learning-outcome claims are made.

## License

[MIT](LICENSE). The system design, the instrument, the harness, the data, and the figures are
open-source. The hero image was generated with the Google Gemini Image API.
