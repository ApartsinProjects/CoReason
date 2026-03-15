# Persona 1: Noa R. — The Diligent Student

## Profile

| Field | Value |
|-------|-------|
| **Name** | Noa Reshef |
| **Role** | Student |
| **Institution** | Tel Aviv University |
| **Department** | Computer Science |
| **Year** | 2nd year undergraduate |
| **Courses Subscribed** | Introduction to Algorithms, Database Systems |
| **Challenges Completed** | 14 |
| **Typical Grades** | Framing: B, Judging: B, Steering: A |

## Background

Noa is a conscientious CS student who consistently completes assignments on time. She has strong programming skills and understands algorithms well enough to implement them, but her analytical habits are still developing. She tends to find the most obvious issue in a problem and stop looking — a "satisficing" pattern that consistently costs her in judging.

## Behavioral Patterns

### Framing
Noa quantifies well — she estimates scale, sets reasonable bounds, and defines vague terms with numbers. However, she tends to accept the problem's implicit structure without questioning it. She rarely asks "what format does the output need to be?" or "are there edge cases in the data model itself?" She addresses the *parameters* of the problem but not its *assumptions*.

**Typical grade: B** — solid quantitative reasoning, misses structural and design-level concerns.

### Judging
Noa reliably catches the most critical issue in each AI output — the O(n) bottleneck, the wrong arithmetic, the missing parameter. But she stops after finding one or two problems. She doesn't systematically scan the entire solution surface: I/O interfaces, operational costs, edge cases, and implicit assumptions all tend to escape her review.

**Typical grade: B** — catches the primary issue, misses secondary and tertiary ones.

### Steering
This is Noa's strongest skill. Once she identifies an issue, her corrections are specific, actionable, and well-structured. She tells the AI exactly what to fix and how, often including the analytical framework for verification. Her steering commands consistently drive meaningful improvements in the AI's output.

**Typical grade: A** — precise, actionable, and effective.

## Use Cases for System Evaluation

1. **Practice mode effectiveness:** Does Noa's judging improve over multiple practice runs? Does the feedback ("you caught the main issue but missed secondary concerns") actually change her behavior in subsequent challenges?

2. **Skill gap visibility:** Do the three separate grades clearly surface her pattern (strong steering, weak comprehensive judging)? Would a single composite grade hide this?

3. **MC vs. open-ended impact:** Does Noa perform differently when judging options are presented as MC (where she can be prompted by the options to notice issues she'd miss on her own) vs. open-ended (where she must generate her own gap list)?

4. **Cross-course transfer:** Does her improvement in judging depth in Algorithms transfer to Database Systems, or is it domain-specific?

## Evaluation Scenarios

- **Scenario A:** Run the same challenge type 3 times in Practice mode. Measure whether judging grade improves from B to A as Noa internalizes the "what else could be wrong?" feedback.
- **Scenario B:** Compare MC judging (where the comprehensive option is visible) vs. open-ended judging (where Noa must generate her own list). Expect MC grades to be higher — the question is whether MC practice transfers to open-ended improvement.
- **Scenario C:** Present a challenge where the AI's output has no critical issues but several minor ones. Does Noa mark "Done" too early, or does she catch the minor issues?
