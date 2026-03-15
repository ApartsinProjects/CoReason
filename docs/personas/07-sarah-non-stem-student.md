# Persona 7: Sarah K. — The Non-STEM Student

## Profile

| Field | Value |
|-------|-------|
| **Name** | Sarah Kaufman |
| **Role** | Student |
| **Institution** | Hebrew University |
| **Department** | Law |
| **Year** | 2nd year undergraduate |
| **Courses Subscribed** | Constitutional Law |
| **Challenges Completed** | 6 |
| **Typical Grades** | Framing: A, Judging: B, Steering: B |

## Background

Sarah is a law student with strong analytical writing skills and extensive experience with argumentation. She is encountering CoReasoning Lab for the first time in her Constitutional Law course, where the instructor uses it to develop students' ability to critique AI-generated legal analysis. Sarah is unfamiliar with the tech-oriented framing of the system but quickly adapts the framework to legal reasoning.

## Behavioral Patterns

### Framing
Sarah excels at framing because legal training inherently teaches students to identify ambiguity, question unstated assumptions, and establish the scope of analysis. When presented with a constitutional law problem, she naturally identifies missing jurisdictional context, unstated precedent, and ambiguous constitutional provisions.

**Typical grade: A** — legal training provides strong transfer to framing skills.

### Judging
Sarah is good at identifying logical flaws and unsupported assertions in AI-generated legal analysis, but sometimes misses technical constitutional doctrine errors because she's still building her substantive knowledge. She catches reasoning errors (e.g., "the AI assumes strict scrutiny applies without justifying it") but may miss that a cited precedent has been overturned.

**Typical grade: B** — strong analytical skills, still building domain depth.

### Steering
Sarah's steering commands are well-structured but sometimes too broad for the legal context. She writes instructions like "Apply the correct standard of review" instead of specifying "Apply intermediate scrutiny under the Craig v. Boren framework because this involves gender classification." Her legal writing training makes her specific by humanities standards, but the system rewards even more targeted instructions.

**Typical grade: B** — well-structured but could be more doctrinally specific.

## Use Cases for System Evaluation

1. **Non-STEM domain validity:** Does the two-phase model (framing → judge+steer) work naturally for legal analysis? Do law students find the structure intuitive or forced?

2. **Rubric quality for non-STEM:** Are the generated rubrics for Constitutional Law genuinely testing legal reasoning (e.g., "identifies the applicable standard of review") rather than generic critical thinking?

3. **Problem quality for non-STEM:** Do the generated constitutional law problems contain realistic legal ambiguities (vague statutory language, unclear jurisdictional scope, conflicting precedent), or do they feel like artificially deficient textbook problems?

4. **AI solution quality for non-STEM:** Does the LLM generate plausible but flawed legal analysis? Legal reasoning follows different structural patterns than engineering solutions — does the "intentionally imperfect AI" work in this domain?

5. **Language and terminology:** Do the system's labels ("framing," "judging," "steering") resonate with law students, or would domain-specific labels ("issue spotting," "analysis critique," "directed revision") be more natural?

## Evaluation Scenarios

- **Scenario A:** Sarah receives a constitutional law problem about government regulation of social media speech. The problem omits whether it's a state or federal regulation, what category of speech is affected, and what level of restriction is involved. Does the generated problem contain the kind of ambiguity that law professors would consider pedagogically valuable?
- **Scenario B:** The AI generates a legal analysis that applies the wrong standard of review (strict scrutiny instead of intermediate scrutiny). The judging rubric criterion is "Detects if AI applies an inappropriate doctrinal framework without justification." Does Sarah catch this? Does the feedback reference the correct doctrine by name?
- **Scenario C:** Sarah steers the AI with "Apply the correct standard of review." The feedback says this is a B-level steering command and suggests "Apply intermediate scrutiny as required by Craig v. Boren (1976) for gender-based classifications, and explain why strict scrutiny is inapplicable here." Does this level of doctrinal specificity in the feedback demonstrate genuine legal domain knowledge from the LLM?
