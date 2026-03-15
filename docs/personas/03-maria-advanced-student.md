# Persona 3: Maria S. — The Advanced Student

## Profile

| Field | Value |
|-------|-------|
| **Name** | Maria Santos |
| **Role** | Student |
| **Institution** | Tel Aviv University |
| **Department** | Computer Science |
| **Year** | 3rd year undergraduate / graduate-track |
| **Courses Subscribed** | Introduction to Algorithms, Deep Learning 101, Software Engineering |
| **Challenges Completed** | 22 |
| **Typical Grades** | Framing: A, Judging: A, Steering: B |

## Background

Maria is a top-performing student with strong domain knowledge and analytical habits. She consistently identifies all major gaps in problems and catches most issues in AI output. Her weakness is a subtle one: she tends to over-specify in steering, sending multiple corrections at once rather than prioritizing the most critical issue. This "shotgun" approach sometimes confuses the AI or addresses minor issues while a more targeted correction would yield better results.

## Behavioral Patterns

### Framing
Maria excels at framing. She systematically identifies missing information, questions implicit assumptions, and establishes well-justified constraints. Her framings typically cover stability, edge cases, output format, and performance requirements — the full design space. She often identifies gaps that other students miss entirely.

**Typical grade: A** — comprehensive, specific, well-justified.

### Judging
Maria's judging is thorough and accurate. She catches both primary and secondary issues, including subtle logical errors and unjustified assumptions. She rarely flags correct content as wrong. Her judgments are well-articulated with clear descriptions of *why* something is an issue.

**Typical grade: A** — complete issue identification with accurate analysis.

### Steering
Maria's steering is her relative weakness — not because her corrections are wrong, but because they lack prioritization. She tends to send multi-part corrections ("fix the complexity analysis, also consider the edge case, and the variable naming is inconsistent") instead of targeting the most impactful issue first. The AI sometimes addresses the minor concern and partially addresses the major one, leading to suboptimal improvement per cycle.

**Typical grade: B** — correct but under-prioritized, diluting impact.

## Use Cases for System Evaluation

1. **Ceiling effects:** Does the system provide meaningful differentiation for top students? Is there enough challenge to keep Maria engaged, or does she quickly hit all-A performance?

2. **Steering nuance:** Does the feedback help Maria understand *prioritization* as a steering skill? Does "address the most critical issue first" feedback change her behavior?

3. **Private challenge creation:** Maria creates her own challenges for self-study. Does the private challenge creation flow serve advanced students? Are the generated rubrics sophisticated enough for her level?

4. **Cross-discipline breadth:** Maria is subscribed to 3 courses. Does her framing skill transfer across domains, or does she need to rebuild it for each subject area?

5. **Assessment vs. Practice distinction:** Does Maria perform differently on Assessment challenges (where she can't retry and feedback is deferred)? Does the pressure of a single-shot attempt affect her normally strong performance?

## Evaluation Scenarios

- **Scenario A:** Maria creates a private practice challenge in Deep Learning. The system generates rubrics for "Neural Networks > Backpropagation > Debugging." Are the rubrics domain-specific enough to challenge her, or are they generic critical thinking criteria?
- **Scenario B:** In a steering-focused challenge, Maria sends a 3-part correction. The AI partially addresses items 1 and 3 but misses item 2. Does the steering feedback correctly identify the prioritization issue?
- **Scenario C:** Compare Maria's Performance across Practice (with retries) and Assessment (single-shot). Hypothesis: her grades should be similar because she rarely needs retries — if Assessment grades are lower, it suggests the retry mechanism masks underlying skill gaps even for strong students.
