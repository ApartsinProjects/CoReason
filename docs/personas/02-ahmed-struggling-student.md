# Persona 2: Ahmed H. — The Struggling Student

## Profile

| Field | Value |
|-------|-------|
| **Name** | Ahmed Hassan |
| **Role** | Student |
| **Institution** | Tel Aviv University |
| **Department** | Computer Science |
| **Year** | 2nd year undergraduate |
| **Courses Subscribed** | Introduction to Algorithms, Software Engineering |
| **Challenges Completed** | 8 |
| **Typical Grades** | Framing: C, Judging: C, Steering: C |

## Background

Ahmed transferred into CS from a different program and is still building foundational knowledge. He understands concepts at a surface level but lacks the depth to identify subtle errors or question unstated assumptions. He often accepts the AI's output at face value and struggles to articulate specific corrections when he does notice something is wrong.

## Behavioral Patterns

### Framing
Ahmed tends to accept problems as stated without questioning implicit assumptions. His framings are either too vague ("I assume the data is normal") or copy surface-level constraints without adding insight. He rarely identifies what information is *missing* — he focuses on what is present.

**Typical grade: C** — accepts the problem at face value, doesn't identify gaps or ambiguities.

### Judging
Ahmed has difficulty distinguishing real issues from non-issues in the AI's output. He sometimes flags correct parts as wrong (over-criticism driven by uncertainty) or misses obvious errors because he doesn't fully understand the domain. When using MC, he tends to select the option that "sounds smart" rather than the one that accurately describes actual issues.

**Typical grade: C** — misses key issues or misidentifies non-issues as problems.

### Steering
Ahmed's steering commands are characteristically vague: "Make it better," "Fix the algorithm," "Use a more efficient approach." He struggles to translate a perceived issue into a specific, actionable instruction. Even when he identifies a real problem, his correction doesn't give the AI enough information to improve meaningfully.

**Typical grade: C** — vague, non-specific commands that don't drive improvement.

## Use Cases for System Evaluation

1. **Feedback pedagogical value for weak students:** Does the critique + better alternative format help Ahmed understand *what* he should have done? Or does he need more scaffolding (e.g., worked examples, progressive difficulty)?

2. **Grade floor calibration:** Is a C grade too discouraging? Does the system's feedback help Ahmed understand it's about skill development, not punishment?

3. **MC as scaffolding:** Do MC options help Ahmed learn by exposing him to expert-level analysis he wouldn't generate on his own? Does seeing the "best" judging option after submission improve his mental model?

4. **Hint text effectiveness:** Do the static hint texts provide enough guidance for Ahmed to structure his responses? Or does he need more domain-specific hints?

5. **Progress tracking:** Over 8 challenges, has Ahmed's performance improved? Can the instructor identify the pattern and provide targeted support?

## Evaluation Scenarios

- **Scenario A:** Ahmed completes an Assessment challenge. His grades are C/C/C. The end-of-challenge feedback reveals all three critiques at once. Does the volume of feedback overwhelm him, or does he find actionable takeaways?
- **Scenario B:** Ahmed uses Practice mode with retries. After getting a C on framing, he reads the feedback and retries. Does his second attempt improve? What does the improvement (or lack thereof) tell us about feedback quality?
- **Scenario C:** Compare Ahmed's MC performance vs. open-ended. Hypothesis: MC judging may yield B (the options prompt him toward correct analysis) while open-ended judging yields C. If confirmed, this suggests MC mode serves as effective scaffolding for struggling students.
