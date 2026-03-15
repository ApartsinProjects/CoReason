# FLOW-06: Subscribe / Unsubscribe (Student) — Join / Leave (Instructor)

**Actor:** Student or Instructor
**Traces to:** REQ-COURSE-01, REQ-COURSE-02, REQ-COURSE-03, REQ-COURSE-04, REQ-COURSE-05, REQ-COURSE-06, REQ-COURSE-07

---

## Preconditions

- User is signed in.

## Steps

### Student — Subscribe / Unsubscribe
1. Student navigates to course catalog.
2. **Subscribe:** Student selects a course and clicks "Subscribe." *(REQ-COURSE-04)*
   - System adds the student to the course's subscriber list.
   - Student's main screen now shows challenges published to that course. *(REQ-COURSE-05, REQ-COURSE-06)*
3. **Unsubscribe:** Student selects a subscribed course and clicks "Unsubscribe." *(REQ-COURSE-04)*
   - System removes the student from the course's subscriber list.
   - Published challenges for that course are no longer shown.

### Instructor — Join / Leave
1. Instructor navigates to course catalog.
2. **Join:** Instructor selects a course and clicks "Join as Instructor." *(REQ-COURSE-01)*
   - System grants instructor privileges for the course.
   - Instructor can now publish challenges and view analytics. *(REQ-COURSE-02, REQ-COURSE-03)*
3. **Leave:** Instructor selects a joined course and clicks "Leave Course." *(REQ-COURSE-01)*
   - System revokes instructor privileges for the course.
   - All content created by this instructor (published challenges, analytics data) is transferred to the **Course Steward**. *(REQ-COURSE-01)*

## Postconditions

- Student is subscribed/unsubscribed, or Instructor has joined/left the course.
- On instructor leave: all contributed content is preserved under the Course Steward.
