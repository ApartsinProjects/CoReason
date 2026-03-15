# FLOW-10: Export Challenge Report (PDF)

**Actor:** Instructor
**Traces to:** REQ-COURSE-03, REQ-VIS-01, REQ-EVAL-04

---

## Preconditions

- Instructor has joined a course with completed public challenge runs. *(REQ-VIS-01)*

## Steps

1. Instructor navigates to course analytics (→ FLOW-08).
2. Instructor selects a challenge and clicks "Export Report."
3. System generates a PDF report containing:
   - Challenge metadata (title, type, course, date range).
   - Aggregated grades and statistics per rubric criterion. *(REQ-EVAL-04)*
   - Per-student breakdown (grades and feedback summary).
4. System downloads the PDF to the instructor's device.

## Postconditions

- Instructor has a PDF report of challenge results.
