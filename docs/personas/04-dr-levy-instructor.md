# Persona 4: Dr. Levy — The Active Instructor

## Profile

| Field | Value |
|-------|-------|
| **Name** | Dr. Dana Levy |
| **Role** | Instructor |
| **Institution** | Tel Aviv University |
| **Department** | Computer Science |
| **Courses Joined** | Introduction to Algorithms, Deep Learning 101 |
| **Challenges Created** | 12 (all public) |
| **Teaching Style** | Active learning, frequent low-stakes assessments |

## Background

Dr. Levy is a mid-career faculty member who embraces educational technology. She uses CoReasoning Lab as a complement to her lectures, publishing 2-3 challenges per week to give students practice in reasoning about algorithmic problems. She actively monitors analytics to identify struggling students and adjust her teaching focus.

## Behavioral Patterns

### Challenge Design
Dr. Levy prefers a mix of response types: MC for framing (to expose students to well-framed alternatives they might not generate), open-ended for judging (to force genuine analysis), and MC for steering (to demonstrate what actionable corrections look like). She sets max cycles to 3-5 depending on problem complexity.

She carefully reviews generated rubrics to ensure they test domain-specific reasoning, not generic critical thinking. She occasionally adjusts the "instructions to students" text to emphasize specific aspects of the current topic.

### Analytics Usage
Dr. Levy checks analytics weekly, focusing on:
- **Grade distributions** — Is the B peak where she expects it? Too many As might mean the challenge was too easy; too many Cs might mean the subject needs more lecture time.
- **Per-student patterns** — She identifies students like Ahmed who consistently score C and reaches out proactively.
- **Skill-specific gaps** — If the entire class scores well on steering but poorly on judging, she adds a lecture segment on critical analysis techniques.

### Assessment Strategy
Dr. Levy uses Practice challenges for weekly exercises (3 per course) and Assessment challenges for mid-term and final evaluations (2 per course). She values that Assessment mode prevents retries, giving her a cleaner signal of student ability.

## Use Cases for System Evaluation

1. **Challenge creation efficiency:** How long does it take Dr. Levy to create and publish a challenge? Is the rubric review step meaningful or perfunctory?

2. **Analytics actionability:** Can Dr. Levy identify struggling students quickly? Does the per-student breakdown provide enough signal to intervene?

3. **Rubric quality assurance:** When Dr. Levy reviews generated rubrics for "Sorting & Searching > Comparison-based Sorting," do the criteria genuinely test sorting-specific reasoning? Or are they generic?

4. **Multi-course management:** Dr. Levy manages two courses. Does the Course Steward model simplify this? Can she context-switch efficiently?

5. **PDF export utility:** When Dr. Levy exports results for department review, is the PDF format useful for administrative reporting?

## Evaluation Scenarios

- **Scenario A:** Dr. Levy creates a new Assessment challenge for "Graph Algorithms > Shortest Paths > Dijkstra." She reviews the generated rubrics. The Judging rubric criterion says "Detects if AI applies textbook Dijkstra without adapting edge weights to reflect the problem's real-world complications." Does she find this specific enough, or does she wish she could edit it?
- **Scenario B:** After publishing a challenge, Dr. Levy views analytics and sees that 38/45 students have completed it. She filters to see only C-grade students and notices a cluster of 5. She needs to decide whether to re-teach the topic or provide individual support. Does the analytics view give her the information she needs?
- **Scenario C:** Dr. Levy leaves the university at the end of the year. Her colleague Dr. Cohen joins the course. Are all of Dr. Levy's challenges, analytics, and student data still accessible through the Course Steward?
