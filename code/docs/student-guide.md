# Student Guide

This guide explains how students use the AI CoReasoning Lab to browse courses, run challenges, and track their performance.

## Table of Contents

- [Getting Started](#getting-started)
- [Browsing Courses](#browsing-courses)
- [Running Challenges](#running-challenges)
- [Understanding Challenge Phases](#understanding-challenge-phases)
- [Viewing Reports](#viewing-reports)
- [Analytics Dashboard](#analytics-dashboard)
- [Profile and Settings](#profile-and-settings)

---

## Getting Started

### Registration

1. Navigate to the sign-up page (`sign-up.html`).
2. Enter your email, password (minimum 8 characters), and name.
3. Select the **Student** role (this is the default).
4. Optionally select your institution from the dropdown.
5. You can also sign in with **Google** if your institution has it configured.

### Login

- **Email/Password**: Enter your credentials on the login page (`login.html`).
- **Google**: Click the Google sign-in button for single sign-on.
- **Quick Login (Development only)**: In test environments, a panel of demo users is available for quick access without passwords.

### First-Time Tour

On your first login, a guided tour walks you through the main interface elements. You can dismiss it and mark it as completed in your profile settings.

---

## Browsing Courses

### Course Catalog

The Course Catalog (`course-catalog.html`) lists all available courses. Each course card shows:

- Course name and description
- Institution and department
- Number of available challenges

### Subscribing to Courses

Click **Subscribe** on any course to add it to your dashboard. Subscribing lets you:
- Filter challenges by your enrolled courses
- Appear in instructor analytics for that course
- Receive course-specific recommendations

You can unsubscribe at any time from the course catalog.

### Viewing Subject Trees

Each course has a hierarchical subject tree showing the topics covered. When browsing challenges, you can see which specific topic a challenge targets within the tree.

---

## Running Challenges

### Challenge List

The Challenge List (`challenge-list.html`) displays all published challenges you can attempt. You can filter by:
- Course
- Challenge type (Practice or Assessment)
- Visibility (Public or Private)
- Search by title

Each challenge card shows:
- Title and associated course
- Challenge type badge (Practice / Assessment)
- Response type (Multiple Choice or Open-Ended)
- Maximum number of judge+steer cycles

### Challenge Types

| Type | Feedback Timing | Best For |
|------|----------------|----------|
| **Practice** | After each phase | Learning and self-improvement |
| **Assessment** | At completion only | Graded evaluations |

### Starting a Run

1. Click on a challenge to open it.
2. Click the **Start** button to begin your run.
3. The system generates a raw, intentionally ill-defined problem via the LLM.

---

## Understanding Challenge Phases

Every challenge run proceeds through three phases:

### Phase 1: Framing

**Goal**: Identify gaps, ambiguities, and missing information in the raw problem, then refine the problem definition before the AI produces a solution.

The raw problem is deliberately vague or incomplete. Your task is to:
- Spot what information is missing
- Identify unstated assumptions
- Clarify ambiguous requirements
- Define scope and constraints

**Response formats**:
- **Multiple Choice**: Select all refinements that apply from a list of options (some are correct, some are distractors).
- **Open-Ended**: Write a free-text response explaining how you would frame the problem.

After you submit your framing, the system:
1. Evaluates your framing quality (Grade: A/B/C)
2. Generates an AI solution based on your framing
3. Moves to Phase 2

In **Practice mode**, you see your framing grade and feedback immediately. In **Assessment mode**, feedback is withheld until completion.

### Phase 2: Judging + Steering Cycles

Phase 2 consists of repeating cycles (up to the challenge's maximum). Each cycle has two sub-phases:

#### Judging

**Goal**: Critically evaluate the current AI-generated solution.

- Review the AI's output
- Identify strengths, weaknesses, errors, or gaps
- Assess whether the solution adequately addresses the problem

**Response formats**:
- **Multiple Choice**: Select statements that correctly identify issues or qualities in the AI output.
- **Open-Ended**: Write your assessment of the AI solution.

#### Steering

**Goal**: Direct the AI to improve its solution based on your judgment.

- Tell the AI what to fix, expand, or revise
- Provide specific corrections or additional constraints
- Guide the output toward a better result

**Response formats**:
- **Multiple Choice**: Select improvement actions for the AI to take.
- **Open-Ended**: Write specific steering instructions.

After each steering submission:
1. The AI regenerates an updated solution incorporating your feedback
2. Your judging and steering are evaluated (Grade: A/B/C each)
3. If more cycles remain, you return to Judging with the updated output
4. If at the maximum cycle count, the run moves to completion

### Completing a Run

You can end the run in two ways:
- **Maximum cycles reached**: The run completes automatically after the last steering submission.
- **Early completion**: Click "Complete" if you are satisfied with the solution before reaching the maximum cycles.

Upon completion, final grades are aggregated:
- **Framing**: Your Phase 1 grade
- **Judging**: Average of all cycle judging grades
- **Steering**: Average of all cycle steering grades

---

## Viewing Reports

### Challenge Report

After completing a run, visit the Challenge Report (`challenge-report.html`) to review:

- **Final Grades**: Framing, Judging, and Steering letter grades
- **Problem Statement**: The original raw problem
- **Your Framing Response**: What you submitted in Phase 1
- **Framing Feedback**: LLM evaluation of your framing (with grade)
- **Cycle-by-Cycle Breakdown**:
  - Your judging response and feedback for each cycle
  - Your steering response and feedback for each cycle
  - The AI's output after each cycle
- **AI Solution Evolution**: How the AI's output changed across cycles based on your steering

Reports are only available for completed runs. In-progress runs show the current state via `challenge-run.html` or `challenge-run-open-ended.html`.

---

## Analytics Dashboard

### Student Analytics

The Student Analytics page (`student-analytics.html`) provides an overview of your performance:

- **Runs Completed**: Total number of finished challenge runs
- **Grade Distribution**: Breakdown of your grades across all three phases
- **Per-Challenge Performance**: How you performed on each challenge you attempted
- **Trends**: Improvement over time across Framing, Judging, and Steering skills

### Per-Challenge Analytics

Click on any completed challenge to see detailed analytics:
- All your runs for that challenge
- Grade progression if you attempted it multiple times
- Comparison of your framing approach across attempts

---

## Profile and Settings

### Profile Page

Visit `profile.html` to manage your account:

- **Name**: Update your display name
- **Preferred Language**: Choose your UI language
  - English
  - Hebrew (with full RTL support)
  - French
  - German
  - Spanish
- **Tour Status**: Reset or mark the guided tour as completed
- **Institution**: View your associated institution

### Language Behavior

The platform separates two language concepts:
- **UI Language**: Controls menu labels, buttons, and interface text (set in your profile)
- **Content Language**: The language used by the LLM for generating problems, solutions, and feedback (automatically matched to your preferred language)

This means you can receive AI-generated content in Hebrew while navigating an English interface, or vice versa.

---

## Creating Your Own Challenges

Students can create their own practice challenges via `create-challenge-student.html`. This simplified interface lets you:

1. Choose a course and subject
2. Set a title
3. Configure response types (MC or open-ended)
4. Set the number of cycles
5. Publish for your own practice

Student-created challenges default to `practice` type and `private` visibility.
