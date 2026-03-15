# FLOW-11: Manage Challenge (Rename / Archive / Delete)

**Actor:** Challenge creator (Student for private, Instructor for public)
**Traces to:** REQ-MGMT-01, REQ-MGMT-02, REQ-MGMT-03, REQ-VIS-01, REQ-VIS-02

---

## Preconditions

- User is signed in.
- User is the creator of the challenge.

## Steps

### Rename
1. User navigates to the challenge list (→ FLOW-05) and selects a challenge they created.
2. User selects "Rename."
3. User enters a new title and confirms. *(REQ-MGMT-01)*
4. System updates the challenge title.

### Archive
1. User selects an active challenge they created.
2. User selects "Archive." *(REQ-MGMT-02)*
3. System marks the challenge as archived.
4. The challenge is hidden from the active challenge list and can no longer be executed.
5. Definition and all run results are preserved for analytics and reporting.

### Delete
1. User selects an **active** (non-archived) challenge they created. *(REQ-MGMT-03)*
2. User selects "Delete."
3. **Private challenge:** System prompts for confirmation (warning that all associated run results will be removed). User confirms. System removes the challenge definition and all associated run results.
4. **Public challenge with existing student runs:** System informs the user that the challenge will be **archived** instead of deleted (to preserve student data). System archives the challenge per the Archive flow above. *(REQ-MGMT-02)*
5. **Public challenge with no student runs:** System prompts for confirmation. User confirms. System removes the challenge definition.

## Postconditions

- **Rename:** challenge title is updated across all views (challenge list, analytics, reports).
- **Archive:** challenge is no longer executable but remains in analytics/reports.
- **Delete (private):** challenge and its run results no longer exist.
- **Delete (public with runs):** challenge is archived; all content and run results are preserved.
- **Delete (public without runs):** challenge definition is removed from the course and subscriber lists.
