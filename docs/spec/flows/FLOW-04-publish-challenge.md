# FLOW-04: Publish Challenge

**Actor:** Instructor
**Traces to:** REQ-VIS-01, REQ-COURSE-01, REQ-COURSE-02, REQ-COURSE-06

---

## Preconditions

- Instructor is signed in and has joined at least one course. *(REQ-COURSE-01)*
- A public challenge definition exists. *(REQ-VIS-01)*

## Steps

1. Instructor selects an existing challenge.
2. Instructor selects "Publish" and chooses the target course.
3. System associates the challenge with the course and marks it as published. *(REQ-COURSE-02)*
4. Subscribed students receive the challenge in their list with a visual cue. *(REQ-COURSE-06)*

## Postconditions

- Challenge is visible to all course subscribers.
