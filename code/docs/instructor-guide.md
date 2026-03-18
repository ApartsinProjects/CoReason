# Instructor Guide

This guide covers how instructors use the AI CoReasoning Lab to create courses, design challenges, manage students, and review analytics.

## Table of Contents

- [Getting Started](#getting-started)
- [Course Management](#course-management)
- [Creating Challenges](#creating-challenges)
- [Managing Challenge Runs](#managing-challenge-runs)
- [Analytics and Reporting](#analytics-and-reporting)
- [Bulk Import](#bulk-import)
- [Administration](#administration)

---

## Getting Started

### Registration

1. Navigate to the sign-up page (`sign-up.html`).
2. Enter your email, password (minimum 8 characters), and name.
3. Select the **Instructor** role.
4. Optionally select your institution from the dropdown.
5. Alternatively, sign in with **Google OAuth** if configured.

### Login

- **Email/Password**: Enter credentials on the login page (`login.html`).
- **Google OAuth**: Click the Google sign-in button.
- **Test Login (Development only)**: In non-production environments, a quick-login panel lets you select from pre-seeded demo users without entering a password.

### Profile Settings

Visit the Profile page (`profile.html`) to:
- Update your display name
- Change your preferred UI language (English, Hebrew, French, German, Spanish)
- Mark the guided tour as completed

---

## Course Management

### Viewing Courses

The Course Catalog (`course-catalog-instructor.html`) shows all available courses. Instructors see additional management controls compared to the student view.

### Creating a Course

1. Navigate to the Add Course page (`add-course.html`).
2. Fill in the required fields:
   - **Course Name** (required, max 200 characters)
   - **Description** (optional)
   - **Department** (optional)
   - **Institution** (selected from existing institutions)
3. Define the **Subject Tree** -- a hierarchical structure of topics covered by the course. Each node can have children.
4. Click **Create**.

### LLM-Generated Subject Trees

Instead of manually building a subject tree, you can use LLM generation:

1. Enter the course name and optional description.
2. Click the "Generate Subject Tree" button.
3. The AI will produce a hierarchical tree of topics appropriate for the course.
4. Review and edit the generated tree before saving.
5. You can regenerate with additional instructions (e.g., "focus on advanced topics" or "include more practical applications").

### Editing Subject Trees

The Subject Tree Editor (`edit-subject-tree.html`) provides:
- Drag-and-drop reordering of topics
- Add, rename, or remove nodes at any level
- LLM-assisted regeneration with custom instructions
- Auto-save option when generating via LLM

### Joining/Leaving Courses

Instructors can join existing courses as co-instructors or leave courses they are part of. This is done through the course catalog using the Join/Leave actions.

---

## Creating Challenges

### Challenge Creation Page

Navigate to `create-challenge.html` to design a new challenge.

### Required Settings

| Field | Description |
|-------|-------------|
| **Title** | Challenge name (1-200 characters) |
| **Course** | Associate the challenge with a course |
| **Subject Path** | Select topics from the course's subject tree |

### Optional Settings

| Field | Default | Description |
|-------|---------|-------------|
| **Challenge Type** | Practice | `practice` (feedback after each phase) or `assessment` (feedback at end only) |
| **Visibility** | Private | `public` (visible to all) or `private` (creator only) |
| **Max Cycles** | 5 | Number of judge+steer iterations (1-20) |
| **Phase 1 Response** | MC | `mc` (multiple choice) or `open-ended` for the Framing phase |
| **Phase 2 Response** | MC | `mc` or `open-ended` for the Judging and Steering phases |
| **Custom Instructions** | -- | Additional guidance for the LLM when generating problems |

### Preview Features

Before publishing, instructors can:

- **Preview Problem**: Generate a sample problem based on the selected course and subjects. The LLM creates an intentionally ill-defined problem for the student to frame.
- **Preview Rubric**: Generate evaluation rubrics that will guide the LLM's grading of student responses across all three phases.

### Publishing

Challenges start in **Draft** status. To make a challenge available to students:

1. Review all settings and previews.
2. Click **Publish** -- this changes the status to `published`.
3. Published challenges appear in the student challenge list.

Challenges can also be **Archived** to hide them without deletion.

### Student-Created Challenges

Students can also create challenges via `create-challenge-student.html`, though with a simplified interface. These are typically practice challenges for self-study.

---

## Managing Challenge Runs

### Monitoring Active Runs

The instructor challenge view (`challenge-run-instructor.html`) provides a read-only view of how students interact with challenges. Instructors can see:

- Which students have started runs
- Current phase and cycle for each run
- Completion status

### Challenge List (Instructor View)

The `challenge-list-instructor.html` page shows:
- All challenges you created
- Run counts per challenge
- Status indicators (draft/published/archived)
- Actions: rename, archive, delete

---

## Analytics and Reporting

### Course Analytics

Access instructor analytics at `instructor-analytics.html`. Select a course you teach to view:

- **Student Overview**: List of enrolled students with their run counts and average grades
- **Challenge Performance**: Per-challenge statistics showing completion rates and grade distributions
- **Grade Breakdown**: Aggregate grades across Framing, Judging, and Steering phases

### Grading Scale

Grades are assigned per phase using a letter scale:

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 3 | Excellent performance |
| B | 2 | Good performance |
| C | 1 | Needs improvement |

Aggregate grades for Judging and Steering are averaged across all cycles within a run:
- Average >= 2.5 = A
- Average >= 1.5 = B
- Otherwise = C

### Data Export

From the instructor analytics page, you can:

- **Export JSON**: Download all analytics data for a course as JSON
- **Export PDF**: Generate a formatted PDF report with student performance tables, grade distributions, and course summary

The PDF report includes:
- Course name and date
- Per-student grade table (Framing, Judging, Steering columns)
- Challenge completion statistics

---

## Bulk Import

Instructors can import data in bulk using YAML files. The import endpoint (`POST /api/v1/import/batch`) accepts a structured YAML payload that can include:

### Import Structure

```yaml
version: "1.0"
import:
  institutions:
    - name: "University Name"
      country: "Country"
      departments: ["Dept 1", "Dept 2"]

  users:
    - email: "user@university.edu"
      name: "User Name"
      role: student    # or instructor
      institution: "University Name"
      password: "password123"
      language: en     # or he, fr, de, es

  courses:
    - name: "Course Name"
      institution: "University Name"
      department: "Department Name"
      instructors: ["instructor@university.edu"]
      description: "Course description"
      subject_tree:
        - name: "Topic 1"
          children:
            - name: "Subtopic 1"
            - name: "Subtopic 2"

  challenges:
    - title: "Challenge Title"
      course: "Course Name"
      creator: "instructor@university.edu"
      type: practice           # or assessment
      visibility: public       # or private
      phase1_response: mc      # or open-ended
      phase2_response: mc      # or open-ended
      max_cycles: 5
      subject_path: ["Topic 1", "Subtopic 1"]
```

### Import Job Tracking

Imports run asynchronously. After submitting:

1. You receive a job ID.
2. Poll `GET /api/v1/import/status/:jobId` to check progress.
3. The response includes a summary of imported entities and any errors.

A sample import file is provided at `import/sample/full-import.yaml`.

---

## Administration

Instructors have access to the admin panel (`admin.html`) which provides:

- **System Overview**: Counts of users, institutions, courses, challenges, runs
- **User Management**: List all registered users with roles and institutions
- **Course Listing**: All courses with subscriber and challenge counts
- **Challenge Listing**: All challenges with creator info and run counts
- **Recent Runs**: Latest challenge runs with user and completion details
- **Prompt Templates**: View file-based and database-stored LLM prompt templates
- **Server Configuration**: Environment info, active LLM providers, memory usage
- **Database Tables**: Row counts for all tables
- **Error Statistics**: Recent server error frequency

> Note: Admin routes currently use the `instructor` role as a proxy. A dedicated `admin` role may be added in the future.
