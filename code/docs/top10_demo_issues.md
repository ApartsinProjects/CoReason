# Top 10 Demo Issues & Improvements

> Audit date: 2026-03-18 | Status: NOT FIXED — review list only

---

### 1. 🔴 Broken Links — Missing Client Pages
**Severity:** Critical (404 during demo)
**Details:** Two buttons link to pages that don't exist in `code/client/`:
- Student challenge list → `create-challenge-student.html` (the "+ Create Challenge" button)
- Instructor course catalog → `add-course.html` (the "+ Add New Course" button)

**Fix:** Either create these pages or hide/disable the buttons until the pages are implemented.

---

### 2. 🔴 Instructor Preview Mode Broken
**Severity:** Critical (instructor demo flow)
**Details:** In `challenge-list-instructor.html`, the "Preview" action links to `challenge-run.html?challengeId=...&preview=1`, but `challenge-run.html` checks for `preview=instructor` (not `preview=1`). The preview banner and instructor nav swap never activate.

**Fix:** Change the link to use `preview=instructor` or update the run page to accept `preview=1`.

---

### 3. 🟡 Tour & Help Systems Are Dead Code
**Severity:** Medium (missed demo opportunity)
**Details:** `js/tour.js` defines a step-by-step onboarding tour for both student and instructor roles. `js/help-popups.js` defines modal help for framing/judging/steering. Neither is loaded via `<script>` on any page, and no HTML elements use the `data-help` attribute. These could significantly improve the demo experience.

**Fix:** Add `<script src="js/tour.js"></script>` to the main pages and wire up `data-help` attributes on key elements.

---

### 4. 🟡 ~40 Missing Translation Keys
**Severity:** Medium (untranslated strings in Hebrew demo)
**Details:** Multiple `data-t` keys referenced in code don't exist in `ui-labels.yaml`:
`profileDesc`, `loading`, `retry`, `noCourses`, `saving`, `saved`, `confirmDeleteChallenge`, `noCoursesFound`, `totalChallenges`, `runsCompleted`, `review`, `startChallenge`, `generatingProblem`, `instructorPreview`, `leadInstructor`, `coInstructor`, `addNewCourse`, `editSubjectTree`, `unsavedChanges`, `importExport`, `newTopic`, `addChild`, and ~15 more.

The fallback behavior shows the raw key as English text, so it doesn't break — but Hebrew users see mixed English/Hebrew UI.

**Fix:** Add all missing keys to both `en/ui-labels.yaml` and `he/ui-labels.yaml`.

---

### 5. 🟡 No Client-Side Role Guards
**Severity:** Medium (security/UX)
**Details:** Students can manually navigate to `challenge-list-instructor.html`, `instructor-analytics.html`, etc. — the pages load (with no data or errors). Similarly, instructors can visit student pages. API endpoints enforce authorization, but the client doesn't redirect.

**Fix:** Add a role check in `user-header.js` that redirects if the current page doesn't match the user's role (e.g., student on an instructor page → redirect to student equivalent).

---

### 6. 🟡 Student Analytics Trend Legend Is Misleading
**Severity:** Medium (confusing visualization)
**Details:** The trend timeline legend uses grade colors (grade-a = green, grade-b = blue, grade-c = orange) as labels for skills (Framing, Judging, Steering). This implies Framing is always "A", which is wrong. The dots inside use the correct per-grade colors, but the legend confuses the viewer.

**Fix:** Change the legend to show skill names with neutral colors, and use the dot colors only for grade values.

---

### 7. 🟡 Hardcoded English Strings Bypass i18n
**Severity:** Medium (Hebrew demo polish)
**Details:** Several UI strings are hardcoded and not wrapped in `data-t`:
- Login page: "Quick Login — Test Users", "Sign In as Test User"
- Challenge run page: "Logout" button text
- Instructor analytics: "All Challenges" filter option
- Create challenge: multiple inline `data-tooltip` strings
- Various `placeholder` attributes without `data-t-placeholder`

**Fix:** Wrap all user-facing strings in `data-t` attributes and add corresponding YAML entries.

---

### 8. 🟢 No Demo Data Pre-Population (Completed Runs)
**Severity:** Low-Medium (analytics pages are empty)
**Details:** The analytics pages (student + instructor) require completed challenge runs to display meaningful data. Currently, the demo database has only 2 runs (from integration tests with specific test challenges). When logging in as a demo student, the analytics pages show empty or minimal data.

**Fix:** Create a seed script that generates 5–10 completed runs per demo student with realistic grade distributions, so analytics pages show rich data during demos.

---

### 9. 🟢 Subject Tree Drag-and-Drop Is Visual-Only
**Severity:** Low (misleading UX)
**Details:** The subject tree editor (`edit-subject-tree.html`) shows drag handles (`.drag-handle` with `cursor: grab`) on every node, but no drag event listeners are attached. Users will try to drag nodes and nothing will happen.

**Fix:** Either implement drag-and-drop reordering or remove the drag handle icons.

---

### 10. 🟢 Create Challenge: Save as Draft Button Missing
**Severity:** Low (instructor flow gap)
**Details:** `create-challenge.html` has a `saveDraft()` JavaScript function but no corresponding button in the HTML. The only action is "Save & Publish". Instructors cannot save work-in-progress challenges.

**Fix:** Add a "Save as Draft" button next to "Save & Publish" that calls the existing `saveDraft()` function.

---

## Summary

| # | Issue | Severity | Category |
|---|-------|----------|----------|
| 1 | Broken links (missing pages) | 🔴 Critical | Navigation |
| 2 | Preview mode param mismatch | 🔴 Critical | Instructor flow |
| 3 | Tour & help are dead code | 🟡 Medium | Onboarding |
| 4 | ~40 missing translation keys | 🟡 Medium | i18n |
| 5 | No client-side role guards | 🟡 Medium | Security/UX |
| 6 | Trend legend misleading | 🟡 Medium | Analytics |
| 7 | Hardcoded English strings | 🟡 Medium | i18n |
| 8 | No pre-populated demo runs | 🟢 Low-Med | Demo readiness |
| 9 | Drag handles non-functional | 🟢 Low | UX polish |
| 10 | Save as Draft button missing | 🟢 Low | Instructor flow |
