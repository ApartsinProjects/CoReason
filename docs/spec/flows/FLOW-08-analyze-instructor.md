# FLOW-08: Analyze Assessments (Instructor)

**Actor:** Instructor
**Traces to:** REQ-COURSE-03, REQ-VIS-01, REQ-EVAL-04

---

## Preconditions

- Instructor has joined a course. *(REQ-COURSE-01)*
- At least one subscriber has completed a public challenge. *(REQ-VIS-01)*

## Steps

1. Instructor navigates to course analytics.
2. System displays an aggregated view of results for **public challenges only** across all course subscribers. *(REQ-COURSE-03, REQ-VIS-01)*
3. Instructor selects a specific challenge to drill down.
4. System shows per-student grades (A–C) and aggregated statistics per rubric dimension (Framing, Judging, Steering — three separate grades even though Judging and Steering are within the same phase). *(REQ-EVAL-04)*
5. Instructor can filter by student, challenge, or date range.

## Postconditions

- Instructor has reviewed aggregated and per-student performance data for public challenges.
