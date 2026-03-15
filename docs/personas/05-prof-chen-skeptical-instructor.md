# Persona 5: Prof. Chen — The Skeptical Instructor

## Profile

| Field | Value |
|-------|-------|
| **Name** | Prof. Wei Chen |
| **Role** | Instructor |
| **Institution** | National University of Singapore |
| **Department** | Electrical Engineering |
| **Courses Joined** | Signal Processing |
| **Challenges Created** | 3 (all public, experimenting) |
| **Teaching Style** | Traditional lectures, cautious about AI tools |

## Background

Prof. Chen is a senior faculty member who is skeptical of AI in education. He worries that LLM-generated assessments lack the precision of hand-crafted exams and that automated grading cannot capture the nuance of engineering reasoning. He has agreed to pilot CoReasoning Lab for one semester at the urging of his department head, but he is watching for evidence that the system either helps or harms student learning.

## Behavioral Patterns

### Challenge Design
Prof. Chen creates challenges reluctantly and reviews every generated rubric with a critical eye. He is particularly concerned about:
- **Domain specificity:** Will the rubrics test signal processing reasoning, or just generic "identifies assumptions"?
- **Grading accuracy:** Will the A/B/C grades align with his expert assessment of student performance?
- **Problem quality:** Will the generated problems contain realistic engineering ambiguities, or will they feel artificial?

He prefers open-ended responses for all three points — he distrusts MC options as oversimplifying complex engineering analysis.

### Quality Concerns
Prof. Chen is likely to:
- Compare LLM-assigned grades against his own assessment of student responses
- Look for cases where the system grades a weak response as A or a strong response as C
- Question whether the "intentionally imperfect AI" produces realistic errors or obviously artificial ones
- Evaluate whether the feedback helps students or just provides generic platitudes

## Use Cases for System Evaluation

1. **Rubric domain specificity:** When the system generates rubrics for "Signal Processing > Frequency Domain Analysis > Aliasing," does the Judging rubric test whether the student can identify incorrect Nyquist rate assumptions? Or does it test generic "identifies errors in AI output"?

2. **Grading accuracy validation:** Prof. Chen reads student responses and assigns his own grades, then compares them to the system's grades. What is the agreement rate? Where do they diverge?

3. **Problem realism:** Do the generated signal processing problems contain the kinds of ambiguities that real engineers encounter (sampling rate unspecified, noise model unclear, hardware constraints absent)? Or do they feel like textbook exercises with a few words removed?

4. **Instructor trust building:** What features or evidence would shift Prof. Chen from skeptic to advocate? Rubric editing capability? Grade override? Side-by-side comparison view?

5. **Non-STEM applicability concerns:** Prof. Chen wonders whether the system's approach (framing an ill-defined problem, judging an AI solution, steering toward improvement) makes sense for engineering, where problems often have more constrained solution spaces than humanities. Does the two-phase model fit?

## Evaluation Scenarios

- **Scenario A:** Prof. Chen creates a challenge for "Signal Processing > Filter Design." The generated problem asks students to design a low-pass filter but omits the cutoff frequency, sampling rate, and passband ripple specification. Prof. Chen evaluates: is this a realistic engineering specification gap, or an unrealistic one?
- **Scenario B:** A student frames the filter design problem well (Grade: A from the system). Prof. Chen reads the framing and disagrees — the student missed a critical aliasing concern. Does the system's rubric include aliasing awareness? If not, is the rubric insufficiently domain-specific?
- **Scenario C:** Prof. Chen reads the "better alternative" feedback for a steering response. Does it demonstrate genuine signal processing expertise, or does it read like a generic "be more specific" suggestion?
