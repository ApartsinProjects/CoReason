# FLOW-05: Browse Challenges

**Actor:** Student or Instructor
**Traces to:** REQ-COURSE-05, REQ-COURSE-06, REQ-LIST-01, REQ-LIST-02, REQ-LIST-03, REQ-LIST-04

---

## Preconditions

- User is signed in.

## Steps

1. User navigates to the challenges screen.
2. System displays the challenge list. Each entry shows: *(REQ-LIST-01)*
   - Visibility icon (public / private). *(REQ-LIST-02)*
   - Type icon (Practice / Assessment). *(REQ-LIST-02)*
   - Course name.
   - Creation date.
   - Creator name.
   - Last attempt date (if any).
3. Newly published challenges are marked with a distinct icon. *(REQ-LIST-02, REQ-COURSE-06)*
4. **Student view:**
   - Shows challenges from subscribed courses (public) and own private challenges.
   - Alerts highlight current/pending challenges. *(REQ-COURSE-05)*
5. **Instructor view:**
   - Shows own challenges and all published challenges for joined courses.
   - Each public challenge displays a completion counter: X/Y (completed / total subscribers). *(REQ-LIST-03)*
6. User can filter/search by course, type (Practice/Assessment), visibility (public/private), and status. *(REQ-LIST-04)*
7. User selects a challenge to run (→ FLOW-03) or view details.

## Postconditions

- User has navigated to the desired challenge.
