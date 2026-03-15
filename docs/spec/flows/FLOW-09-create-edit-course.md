# FLOW-09: Create / Edit Course

**Actor:** Instructor
**Traces to:** REQ-PLAT-04, REQ-PLAT-06, REQ-PLAT-07, REQ-COURSE-01, REQ-COURSE-07, REQ-MODEL-02

---

## Preconditions

- Instructor is signed in.
- The system already contains pre-shipped departments, courses, and subject trees. *(REQ-PLAT-06)*

## Steps

1. Instructor selects "Create Course" or edits an existing course (including pre-shipped ones).
2. Instructor specifies or updates course metadata: name, description, department, subject area.
3. Instructor adds, edits, or reorganizes subjects within the course's subject tree. *(REQ-PLAT-04 — stored in YAML)*
4. Instructor configures the **Course Steward** settings: *(REQ-COURSE-07)*
   - **Default LLM model** — applies to all public challenges in the course unless overridden at the challenge level. *(REQ-MODEL-02)*
   - Other course-wide defaults as applicable.
5. Instructor saves the course.
6. Course appears in the course catalog, available for student subscriptions and challenge publishing.
7. The Course Steward is created as the virtual owner of all course-level content and settings. *(REQ-COURSE-01)*

## Postconditions

- Course exists with a Course Steward, defined subjects, and course-wide settings.
- The Course Steward holds ownership of all published content and configuration.
- Course is visible in the catalog.
