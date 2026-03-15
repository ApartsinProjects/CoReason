# FLOW-01: Sign Up

**Actor:** Any user
**Traces to:** REQ-AUTH-01, REQ-AUTH-02, REQ-AUTH-03, REQ-PLAT-06

---

## Preconditions

- User has a Google account, Microsoft account, or an email address.

## Steps

1. User navigates to the application.
2. User chooses an authentication method: *(REQ-AUTH-01)*
   - **Google SSO** — authenticates via Google.
   - **Microsoft SSO** — authenticates via Microsoft.
   - **Email/password** — user enters email, creates a password, and registers.
3. User selects their **institution** from the pre-provisioned list. *(REQ-AUTH-03, REQ-PLAT-06)*
4. User selects a role: **Instructor** or **Student**. *(REQ-AUTH-02)*
5. User confirms.
6. System creates the user profile (with institution, role, and registration date) and redirects to the main screen.

## Postconditions

- User is authenticated and assigned the selected role and institution.
- Student users see the main screen with challenge alerts *(REQ-COURSE-05)*.
