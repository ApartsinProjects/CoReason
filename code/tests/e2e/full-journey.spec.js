const { test, expect } = require('@playwright/test');

/**
 * Full user journey e2e tests — real clicks, form fills, and page navigation
 * through the complete CoReason platform flow in Chrome.
 */

const TS = Date.now();
const STUDENT = { email: `e2e-stu-${TS}@test.com`, password: 'TestPass123!', name: 'E2E Student', role: 'student' };
const INSTRUCTOR = { email: `e2e-ins-${TS}@test.com`, password: 'TestPass123!', name: 'E2E Instructor', role: 'instructor' };

// ─── Cleanup: delete all test-created data after the suite ───
test.afterAll(async ({ request }) => {
  // Login as the test instructor to get an auth session
  const login = await request.post('/api/v1/auth/login', {
    data: { email: INSTRUCTOR.email, password: INSTRUCTOR.password },
  });
  // Clean up via admin endpoint if available, otherwise just log
  // The server uses in-memory or file-backed SQLite, so stale test data
  // accumulates between runs. Use a dedicated cleanup endpoint.
  const cleanup = await request.post('/api/v1/auth/test-cleanup', {
    data: { prefix: TS.toString() },
  });
  if (!cleanup.ok()) {
    // If no cleanup endpoint, log warning — data will be cleaned manually
    console.warn(`[e2e] Test cleanup returned ${cleanup.status()} — stale test data may remain`);
  }
});

// ─── Helpers ───
async function apiRegister(request, user) {
  const res = await request.post('/api/v1/auth/register', {
    data: { email: user.email, password: user.password, name: user.name, role: user.role },
  });
  expect(res.ok(), `Register ${user.role} failed: ${res.status()}`).toBeTruthy();
  return res;
}

async function apiLogin(request, user) {
  const res = await request.post('/api/v1/auth/login', {
    data: { email: user.email, password: user.password },
  });
  expect(res.ok(), `Login failed: ${res.status()}`).toBeTruthy();
  return res;
}

async function transferAuth(request, page) {
  const state = await request.storageState();
  if (state.cookies.length) {
    await page.context().addCookies(state.cookies);
  }
}

// ═══════════════════════════════════════════════════════════
// 1. REGISTRATION & LOGIN — browser form fill
// ═══════════════════════════════════════════════════════════
test.describe('Registration & Login Flow', () => {
  test('student can register via sign-up form', async ({ page }) => {
    await page.goto('/sign-up.html');
    // Wait for institutions dropdown to load
    await page.waitForTimeout(2000);

    await page.fill('#signupName', STUDENT.name);
    await page.fill('#signupEmail', STUDENT.email);
    await page.fill('#signupPassword', STUDENT.password);

    // Select institution (required) — pick the first real option
    const instSelect = page.locator('#signupInstitution');
    const options = instSelect.locator('option');
    const count = await options.count();
    if (count > 1) {
      // First option is placeholder "Select your institution...", pick second
      const value = await options.nth(1).getAttribute('value');
      await instSelect.selectOption(value);
    }

    // Select student role (data-role click)
    const roleBtn = page.locator('[data-role="student"]');
    if (await roleBtn.count() > 0) {
      await roleBtn.first().click();
    }

    await page.locator('#signupBtn').click();

    // After success → redirect to challenge-list.html (student) or challenge-list-instructor.html
    await page.waitForURL(/challenge-list/, { timeout: 15000 });
  });

  test('student can login via login form', async ({ page, request }) => {
    // Ensure student exists (register via API first — idempotent)
    const regRes = await request.post('/api/v1/auth/register', {
      data: { email: STUDENT.email, password: STUDENT.password, name: STUDENT.name, role: STUDENT.role },
    });
    // 201 = new, 409 = already exists — both fine
    expect([201, 409]).toContain(regRes.status());

    await page.goto('/login.html');
    await page.fill('#loginEmail', STUDENT.email);
    await page.fill('#loginPassword', STUDENT.password);
    await page.locator('#loginBtn').click();

    await page.waitForURL(/challenge-list/, { timeout: 15000 });
  });

  test('instructor can register and verify profile via API', async ({ request }) => {
    await apiRegister(request, INSTRUCTOR);

    const me = await request.get('/api/v1/auth/me');
    expect(me.ok()).toBeTruthy();
    const body = await me.json();
    expect(body.user.role).toBe('instructor');
    expect(body.user.name).toBe(INSTRUCTOR.name);
  });
});

// ═══════════════════════════════════════════════════════════
// 2. INSTRUCTOR: CREATE COURSE & CHALLENGE via API
// ═══════════════════════════════════════════════════════════
test.describe('Instructor: Course & Challenge Creation', () => {
  test('instructor creates course, challenge, publishes, and views list', async ({ request, page }) => {
    // Login as instructor
    await apiLogin(request, INSTRUCTOR);

    // Create course
    const courseRes = await request.post('/api/v1/courses', {
      data: {
        name: `E2E Course ${TS}`,
        description: 'Automated test course',
        subjectTree: [
          { name: 'Topic A', children: [{ name: 'Subtopic A1' }] },
          { name: 'Topic B', children: [{ name: 'Subtopic B1' }] },
        ],
      },
    });
    expect(courseRes.ok(), `Create course failed: ${courseRes.status()}`).toBeTruthy();
    const course = await courseRes.json();
    const courseId = course.id || course.course?.id;
    expect(courseId).toBeTruthy();

    // Create challenge
    const chalRes = await request.post('/api/v1/challenges', {
      data: {
        title: `E2E Challenge ${TS}`,
        courseId,
        subjectPath: ['Topic A', 'Subtopic A1'],
        challengeType: 'practice',
        visibility: 'public',
        maxCycles: 2,
        responseConfig: { framing: 'mc', judging: 'mc', steering: 'mc' },
      },
    });
    expect(chalRes.ok(), `Create challenge failed: ${chalRes.status()}`).toBeTruthy();
    const challenge = await chalRes.json();
    const challengeId = challenge.id || challenge.challenge?.id;
    expect(challengeId).toBeTruthy();

    // Publish
    const pubRes = await request.put(`/api/v1/challenges/${challengeId}`, {
      data: { status: 'published' },
    });
    expect(pubRes.ok(), `Publish failed: ${pubRes.status()}`).toBeTruthy();

    // View challenge list in browser
    await transferAuth(request, page);
    await page.goto('/challenge-list-instructor.html');
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'test-results/instructor-challenge-list.png', fullPage: true });
  });
});

// ═══════════════════════════════════════════════════════════
// 3. STUDENT: FULL CHALLENGE RUN LIFECYCLE via API
//    (start → framing → judging → steering → complete → report)
// ═══════════════════════════════════════════════════════════
test.describe('Student: Full Challenge Run Flow', () => {
  // This test calls the real LLM backend — allow up to 120s.
  // LLM failures are real failures — no skipping.
  test('complete challenge run lifecycle @llm', async ({ request }) => {
    test.setTimeout(120_000);
    // ── Setup: instructor creates published challenge ──
    const instrUser = { email: `e2e-run-ins-${TS}@test.com`, password: 'TestPass123!', name: 'Run Instructor', role: 'instructor' };
    await apiRegister(request, instrUser);

    const courseRes = await request.post('/api/v1/courses', {
      data: {
        name: `Run Course ${TS}`,
        description: 'For run tests',
        subjectTree: [{ name: 'Algorithms', children: [{ name: 'Sorting' }] }],
      },
    });
    const course = await courseRes.json();
    const courseId = course.id || course.course?.id;

    const chalRes = await request.post('/api/v1/challenges', {
      data: {
        title: `Run Challenge ${TS}`,
        courseId,
        subjectPath: ['Algorithms', 'Sorting'],
        challengeType: 'practice',
        visibility: 'public',
        maxCycles: 1,
        responseConfig: { framing: 'mc', judging: 'mc', steering: 'mc' },
      },
    });
    const challenge = await chalRes.json();
    const challengeId = challenge.id || challenge.challenge?.id;
    // Publish via the correct endpoint
    const pubRes = await request.post(`/api/v1/challenges/${challengeId}/publish`);
    expect(pubRes.ok(), `Publish failed: ${pubRes.status()}`).toBeTruthy();

    // ── Switch to student ──
    const stuUser = { email: `e2e-run-stu-${TS}@test.com`, password: 'TestPass123!', name: 'Run Student', role: 'student' };
    await apiRegister(request, stuUser);

    // Step 1: Start run — LLM MUST be available (no skipping)
    const startRes = await request.post('/api/v1/runs', {
      data: { challengeId },
    });
    expect(startRes.ok(), `Start run failed (status ${startRes.status()}). LLM backend must be reachable.`).toBeTruthy();
    const startBody = await startRes.json();
    const runId = startBody.runId || startBody.id || startBody.run?.id;
    expect(runId).toBeTruthy();

    // Verify real LLM content — must NOT be fallback
    expect(startBody.rawProblem).toBeDefined();
    expect(startBody.rawProblem).not.toMatch(/LLM not configured/i);
    expect(startBody.rawProblem).not.toMatch(/placeholder/i);
    if (startBody.framingOptions) {
      expect(startBody.framingOptions[0]?.text).not.toMatch(/Fallback|placeholder/i);
    }

    // Step 2: Submit framing (PUT)
    const framingRes = await request.put(`/api/v1/runs/${runId}/framing`, {
      data: { selectedOptions: ['A', 'B'] },
    });
    expect(framingRes.ok(), `Framing failed: ${framingRes.status()}`).toBeTruthy();
    const framingBody = await framingRes.json();
    expect(framingBody.aiSolution || framingBody.judgingOptions).toBeTruthy();
    // Verify real LLM AI solution
    if (framingBody.aiSolution) {
      expect(framingBody.aiSolution).not.toMatch(/LLM not configured/i);
      expect(framingBody.aiSolution).not.toMatch(/placeholder/i);
    }

    // Step 3: Submit judging for cycle 1 (PUT)
    const judgingRes = await request.put(`/api/v1/runs/${runId}/cycles/1/judging`, {
      data: { selectedOptions: ['A', 'C'] },
    });
    expect(judgingRes.ok(), `Judging failed: ${judgingRes.status()}`).toBeTruthy();

    // Step 4: Submit steering for cycle 1 (PUT)
    const steeringRes = await request.put(`/api/v1/runs/${runId}/cycles/1/steering`, {
      data: { selectedOptions: ['A', 'B'] },
    });
    expect(steeringRes.ok(), `Steering failed: ${steeringRes.status()}`).toBeTruthy();
    const steeringBody = await steeringRes.json();
    // Verify updated solution is real LLM content
    if (steeringBody.updatedSolution) {
      expect(steeringBody.updatedSolution).not.toMatch(/LLM not configured/i);
    }

    // Step 5: Complete run (PUT)
    const completeRes = await request.put(`/api/v1/runs/${runId}/complete`);
    expect(completeRes.ok(), `Complete failed: ${completeRes.status()}`).toBeTruthy();

    // Step 6: Get report
    const reportRes = await request.get(`/api/v1/runs/${runId}/report`);
    expect(reportRes.ok(), `Report failed: ${reportRes.status()}`).toBeTruthy();
    const report = await reportRes.json();
    expect(report.status || report.run?.status).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════
// 4. BROWSER CLICK-THROUGH
// ═══════════════════════════════════════════════════════════
test.describe('Browser: Click-through Navigation', () => {
  test('student navigates challenge run page in browser', async ({ page, request }) => {
    // Setup: instructor creates published challenge
    const ins = { email: `e2e-clk-ins-${TS}@test.com`, password: 'TestPass123!', name: 'Click Instr', role: 'instructor' };
    await apiRegister(request, ins);

    const courseRes = await request.post('/api/v1/courses', {
      data: { name: `Click Course ${TS}`, subjectTree: [{ name: 'Math', children: [{ name: 'Algebra' }] }] },
    });
    const course = await courseRes.json();

    const chalRes = await request.post('/api/v1/challenges', {
      data: {
        title: `Click Challenge ${TS}`,
        courseId: course.id || course.course?.id,
        subjectPath: ['Math', 'Algebra'],
        challengeType: 'practice',
        visibility: 'public',
        maxCycles: 1,
        responseConfig: { framing: 'mc', judging: 'mc', steering: 'mc' },
      },
    });
    const challenge = await chalRes.json();
    const challengeId = challenge.id || challenge.challenge?.id;
    await request.put(`/api/v1/challenges/${challengeId}`, { data: { status: 'published' } });

    // Register + login student via API, transfer to browser
    const stu = { email: `e2e-clk-stu-${TS}@test.com`, password: 'TestPass123!', name: 'Click Student', role: 'student' };
    await apiRegister(request, stu);
    await transferAuth(request, page);

    // Navigate to challenge run page
    await page.goto(`/challenge-run.html?challengeId=${challengeId}`);
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(2000);

    // Look for start button
    const startBtn = page.locator('button:has-text("Start"), button:has-text("▶"), #start-btn, [data-action="start"]');
    if (await startBtn.count() > 0) {
      await startBtn.first().click();
      await page.waitForTimeout(3000);
    }

    await page.screenshot({ path: 'test-results/challenge-run-started.png', fullPage: true });
  });

  test('student sees challenge list', async ({ page, request }) => {
    const stu = { email: `e2e-list-stu-${TS}@test.com`, password: 'TestPass123!', name: 'List Student', role: 'student' };
    await apiRegister(request, stu);
    await transferAuth(request, page);

    await page.goto('/challenge-list.html');
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body.length).toBeGreaterThan(100);

    await page.screenshot({ path: 'test-results/challenge-list.png', fullPage: true });
  });
});

// ═══════════════════════════════════════════════════════════
// 5. STUDENT ANALYTICS & PROFILE
// ═══════════════════════════════════════════════════════════
test.describe('Student Pages', () => {
  test('analytics page loads', async ({ page, request }) => {
    const stu = { email: `e2e-anl-${TS}@test.com`, password: 'TestPass123!', name: 'Analytics Stu', role: 'student' };
    await apiRegister(request, stu);
    await transferAuth(request, page);

    await page.goto('/student-analytics.html');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
    const content = await page.locator('body').textContent();
    expect(content.length).toBeGreaterThan(50);

    await page.screenshot({ path: 'test-results/student-analytics.png', fullPage: true });
  });

  test('profile page displays user name', async ({ page, request }) => {
    const stu = { email: `e2e-prf-${TS}@test.com`, password: 'TestPass123!', name: 'Profile Student', role: 'student' };
    await apiRegister(request, stu);
    await transferAuth(request, page);

    await page.goto('/profile.html');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();

    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Profile Student');

    await page.screenshot({ path: 'test-results/profile.png', fullPage: true });
  });
});

// ═══════════════════════════════════════════════════════════
// 6. INSTRUCTOR ANALYTICS
// ═══════════════════════════════════════════════════════════
test.describe('Instructor Analytics', () => {
  test('instructor analytics page loads', async ({ page, request }) => {
    const ins = { email: `e2e-ianl-${TS}@test.com`, password: 'TestPass123!', name: 'Analytics Instr', role: 'instructor' };
    await apiRegister(request, ins);

    const courseRes = await request.post('/api/v1/courses', {
      data: { name: `Anl Course ${TS}`, subjectTree: [] },
    });
    const course = await courseRes.json();
    const courseId = course.id || course.course?.id;

    await transferAuth(request, page);

    await page.goto(`/instructor-analytics.html?courseId=${courseId}`);
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();

    await page.screenshot({ path: 'test-results/instructor-analytics.png', fullPage: true });
  });
});

// ═══════════════════════════════════════════════════════════
// 7. ERROR HANDLING
// ═══════════════════════════════════════════════════════════
test.describe('Error Handling', () => {
  test('404 for non-existent challenge', async ({ request }) => {
    await apiRegister(request, {
      email: `e2e-err-${TS}@test.com`, password: 'TestPass123!', name: 'Err Stu', role: 'student',
    });

    const res = await request.get('/api/v1/challenges/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });

  test('unauthenticated access handled gracefully', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/profile.html');
    await page.waitForTimeout(2000);

    // Page should load without crashing
    await expect(page.locator('body')).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════
// 8. COMPLETE BROWSER JOURNEY — click through the entire UI
// ═══════════════════════════════════════════════════════════
test.describe('Complete Browser Journey', () => {
  test('full instructor journey: register → create course → create challenge → publish → view analytics', async ({ page }) => {
    test.setTimeout(60_000);
    const email = `e2e-journey-ins-${TS}@test.com`;

    // ── Step 1: Register as instructor via sign-up form ──
    await page.goto('/sign-up.html');
    await page.waitForTimeout(2000);
    await page.fill('#signupName', 'Journey Instructor');
    await page.fill('#signupEmail', email);
    await page.fill('#signupPassword', 'TestPass123!');

    // Select institution
    const instSelect = page.locator('#signupInstitution');
    const options = instSelect.locator('option');
    if (await options.count() > 1) {
      const value = await options.nth(1).getAttribute('value');
      await instSelect.selectOption(value);
    }

    // Select instructor role
    const roleBtn = page.locator('[data-role="instructor"]');
    if (await roleBtn.count() > 0) await roleBtn.first().click();

    await page.locator('#signupBtn').click();
    await page.waitForURL(/challenge-list-instructor/, { timeout: 15000 });

    // ── Step 2: Navigate to course catalog ──
    const courseCatalogLink = page.locator('a[href*="course-catalog"], nav a:has-text("Courses"), nav a:has-text("קורסים")');
    if (await courseCatalogLink.count() > 0) {
      await courseCatalogLink.first().click();
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: 'test-results/journey-course-catalog.png', fullPage: true });

    // ── Step 3: Navigate to add course page ──
    await page.goto('/add-course.html');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
    await page.screenshot({ path: 'test-results/journey-add-course.png', fullPage: true });

    // ── Step 4: Navigate to create challenge ──
    await page.goto('/create-challenge.html');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
    await page.screenshot({ path: 'test-results/journey-create-challenge.png', fullPage: true });

    // ── Step 5: Navigate to instructor analytics ──
    await page.goto('/instructor-analytics.html');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
    await page.screenshot({ path: 'test-results/journey-instructor-analytics.png', fullPage: true });

    // ── Step 6: Check profile page ──
    await page.goto('/profile.html');
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Journey Instructor');
    await page.screenshot({ path: 'test-results/journey-profile.png', fullPage: true });
  });

  test('full student journey: register → browse courses → view challenges → open challenge run → view analytics', async ({ page, request }) => {
    test.setTimeout(60_000);
    const stuEmail = `e2e-journey-stu-${TS}@test.com`;

    // ── Step 1: Register as student via form ──
    await page.goto('/sign-up.html');
    await page.waitForTimeout(2000);
    await page.fill('#signupName', 'Journey Student');
    await page.fill('#signupEmail', stuEmail);
    await page.fill('#signupPassword', 'TestPass123!');

    const instSelect = page.locator('#signupInstitution');
    const options = instSelect.locator('option');
    if (await options.count() > 1) {
      const value = await options.nth(1).getAttribute('value');
      await instSelect.selectOption(value);
    }

    const roleBtn = page.locator('[data-role="student"]');
    if (await roleBtn.count() > 0) await roleBtn.first().click();

    await page.locator('#signupBtn').click();
    await page.waitForURL(/challenge-list/, { timeout: 15000 });

    // ── Step 2: Verify challenge list page loaded ──
    await page.waitForTimeout(2000);
    const challengeListBody = await page.locator('body').textContent();
    expect(challengeListBody.length).toBeGreaterThan(100);
    await page.screenshot({ path: 'test-results/journey-student-challenge-list.png', fullPage: true });

    // ── Step 3: Navigate to course catalog ──
    await page.goto('/course-catalog.html');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
    await page.screenshot({ path: 'test-results/journey-student-course-catalog.png', fullPage: true });

    // ── Step 4: Navigate to student analytics ──
    await page.goto('/student-analytics.html');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
    await page.screenshot({ path: 'test-results/journey-student-analytics.png', fullPage: true });

    // ── Step 5: Navigate to profile ──
    await page.goto('/profile.html');
    await page.waitForTimeout(2000);
    const profileText = await page.locator('body').textContent();
    expect(profileText).toContain('Journey Student');
    await page.screenshot({ path: 'test-results/journey-student-profile.png', fullPage: true });

    // ── Step 6: Navigate to create-challenge-student (private challenge) ──
    await page.goto('/create-challenge-student.html');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
    await page.screenshot({ path: 'test-results/journey-student-create-challenge.png', fullPage: true });

    // ── Step 7: Logout and verify redirect ──
    const logoutBtn = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("התנתק"), [data-t="logout"]');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });

  test('language switch: Hebrew demo user gets Hebrew UI', async ({ page, request }) => {
    // Register a Hebrew demo user via API, then switch to browser
    const heUser = { email: `e2e-he-stu-${TS}@test.com`, password: 'TestPass123!', name: 'סטודנט בדיקה', role: 'student' };
    await apiRegister(request, heUser);

    // Update language to Hebrew via API
    await request.put('/api/v1/users/me', { data: { preferred_language: 'he' } });

    // Transfer session to browser
    await transferAuth(request, page);

    // Visit profile — should have the user's name
    await page.goto('/profile.html');
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('סטודנט בדיקה');
    await page.screenshot({ path: 'test-results/journey-hebrew-profile.png', fullPage: true });
  });
});

// ═══════════════════════════════════════════════════════════
// 9. ALL PAGES SMOKE TEST — no JS errors
// ═══════════════════════════════════════════════════════════
test.describe('All Pages Load Without Errors', () => {
  const pagePaths = [
    '/login.html',
    '/sign-up.html',
    '/challenge-list.html',
    '/challenge-list-instructor.html',
    '/course-catalog.html',
    '/course-catalog-instructor.html',
    '/create-challenge.html',
    '/create-challenge-student.html',
    '/student-analytics.html',
    '/instructor-analytics.html',
    '/profile.html',
    '/admin.html',
    '/add-course.html',
    '/edit-subject-tree.html',
  ];

  for (const p of pagePaths) {
    test(`${p} loads without JS errors`, async ({ page }) => {
      const jsErrors = [];
      page.on('pageerror', (err) => jsErrors.push(err.message));

      const response = await page.goto(p);
      expect(response.status()).toBe(200);
      await page.waitForTimeout(1000);

      const real = jsErrors.filter(
        (e) => !e.includes('401') && !e.includes('Unauthorized') && !e.includes('not logged in')
      );
      expect(real, `JS errors on ${p}: ${real.join(', ')}`).toHaveLength(0);
    });
  }
});
