# FLOW-12: View / Edit User Profile

**Actor:** Any user (Student or Instructor)
**Traces to:** REQ-PROF-01, REQ-PROF-02, REQ-PROF-03, REQ-AUTH-03

---

## Preconditions

- User is signed in.

## Steps

### View Profile
1. User navigates to the profile screen.
2. System displays: *(REQ-PROF-01)*
   - Name, email, profile image.
   - Institution. *(REQ-AUTH-03)*
   - Role (Instructor / Student).
   - Date of registration.
   - Course subscriptions (student) or joined courses (instructor).
3. System displays basic statistics: *(REQ-PROF-02)*
   - Number of challenges created.
   - Number of challenges executed (runs completed).

### Edit Profile
4. User selects "Edit Profile."
5. User can modify: *(REQ-PROF-03)*
   - **Name** — free-text edit.
   - **Profile image** — upload or change image.
6. User saves changes.
7. System updates the profile. Updated name is reflected across all views (challenge list creator name, analytics, etc.).

## Postconditions

- Profile is displayed with current data, or edits have been saved.
