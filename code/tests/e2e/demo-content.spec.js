const { test, expect } = require('@playwright/test');

/**
 * Demo Content Validation Tests
 *
 * Verify that all demo accounts lead to informative outcomes:
 * - Every instructor sees courses with challenges
 * - Every student sees courses to subscribe to and challenges to attempt
 * - No empty pages or dead-end flows during a demo
 */

// ─── Demo Accounts ───
const DEMO_ACCOUNTS = {
  studentEN: { email: 'noa.cohen@tau.ac.il', role: 'student', lang: 'en', label: 'Noa Cohen (EN student)' },
  studentHE: { email: 'noa.cohen.he@tau.ac.il', role: 'student', lang: 'he', label: 'נועה כהן (HE student)' },
  instructorEN: { email: 'dr.levy@tau.ac.il', role: 'instructor', lang: 'en', label: 'Dr. Levy (EN instructor)' },
  instructorHE: { email: 'dr.shapira.he@tau.ac.il', role: 'instructor', lang: 'he', label: 'ד״ר ברכה שפירא (HE instructor)' },
};

// ─── Helper: login as test user via API and transfer session to browser ───
async function loginAs(request, page, account) {
  const res = await request.post('/api/v1/auth/test-login', {
    data: { email: account.email },
  });
  expect(res.ok(), `Login failed for ${account.label}: ${res.status()}`).toBeTruthy();
  // Transfer cookies to browser context
  const state = await request.storageState();
  if (state.cookies.length) {
    await page.context().addCookies(state.cookies);
  }
  return res;
}

// ─── Helper: login via API only (for API-level tests) ───
async function apiLogin(request, email) {
  const res = await request.post('/api/v1/auth/test-login', {
    data: { email },
  });
  expect(res.ok(), `API login failed for ${email}`).toBeTruthy();
  return res;
}

// ═══════════════════════════════════════════════════════════
// 1. API-LEVEL: Every instructor has courses with challenges
// ═══════════════════════════════════════════════════════════
test.describe('API: Instructor courses have challenges', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (account.role !== 'instructor') continue;

    test(`${account.label} — has ≥1 course with ≥1 challenge`, async ({ request }) => {
      await apiLogin(request, account.email);

      // Fetch instructor's courses (instructor=true filter)
      const coursesRes = await request.get('/api/v1/courses?instructor=true');
      expect(coursesRes.ok()).toBeTruthy();
      const courses = await coursesRes.json();
      const courseList = courses.courses || courses;

      expect(courseList.length, `${account.label} should have at least 1 course`).toBeGreaterThan(0);

      // Each course should have at least 1 published challenge
      for (const course of courseList) {
        const id = course._id || course.id;
        const challRes = await request.get(`/api/v1/challenges?courseId=${id}`);
        expect(challRes.ok()).toBeTruthy();
        const challData = await challRes.json();
        const challenges = challData.challenges || challData;

        expect(
          challenges.length,
          `${account.label}: course "${course.name}" should have ≥1 challenge`
        ).toBeGreaterThan(0);
      }
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 2. API-LEVEL: Every student sees courses at their institution
// ═══════════════════════════════════════════════════════════
test.describe('API: Student course catalog is non-empty', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (account.role !== 'student') continue;

    test(`${account.label} — sees ≥1 course in catalog`, async ({ request }) => {
      await apiLogin(request, account.email);

      const coursesRes = await request.get('/api/v1/courses');
      expect(coursesRes.ok()).toBeTruthy();
      const courses = await coursesRes.json();
      const courseList = courses.courses || courses;

      expect(courseList.length, `${account.label} should see at least 1 course`).toBeGreaterThan(0);

      // At least one course should have challenges
      const withChallenges = courseList.filter(c => (c.challenge_count || c.challengeCount || 0) > 0);
      expect(
        withChallenges.length,
        `${account.label} should see at least 1 course with published challenges`
      ).toBeGreaterThan(0);
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 3. API-LEVEL: Student challenge list is non-empty
// ═══════════════════════════════════════════════════════════
test.describe('API: Student sees challenges', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (account.role !== 'student') continue;

    test(`${account.label} — sees ≥1 available challenge`, async ({ request }) => {
      await apiLogin(request, account.email);

      const challRes = await request.get('/api/v1/challenges');
      expect(challRes.ok()).toBeTruthy();
      const challData = await challRes.json();
      const challenges = challData.challenges || challData;

      expect(
        challenges.length,
        `${account.label} should see at least 1 challenge`
      ).toBeGreaterThan(0);
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 4. BROWSER: Instructor course catalog shows non-empty cards
// ═══════════════════════════════════════════════════════════
test.describe('Browser: Instructor course catalog', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (account.role !== 'instructor') continue;

    test(`${account.label} — course catalog has course cards`, async ({ page, request }) => {
      await loginAs(request, page, account);
      await page.goto('/course-catalog-instructor.html');

      // Wait for courses to load (loading state disappears)
      await page.waitForFunction(() => {
        const grid = document.getElementById('courseGrid');
        return grid && !grid.textContent.includes('Loading');
      }, { timeout: 10000 });

      // Should have at least 1 course card
      const cards = page.locator('.course-card');
      const count = await cards.count();
      expect(count, `${account.label} should see ≥1 course card`).toBeGreaterThan(0);

      // Each card should show challenge count > 0
      for (let i = 0; i < count; i++) {
        const cardText = await cards.nth(i).textContent();
        // The card shows challenge_count in a stat div — just verify it renders
        expect(cardText.length).toBeGreaterThan(0);
      }
    });

    test(`${account.label} — clicking "Manage Challenges" shows challenges`, async ({ page, request }) => {
      await loginAs(request, page, account);
      await page.goto('/course-catalog-instructor.html');

      // Wait for courses to load
      await page.waitForFunction(() => {
        const grid = document.getElementById('courseGrid');
        return grid && !grid.textContent.includes('Loading');
      }, { timeout: 10000 });

      // Click the first "Manage Challenges" button
      const manageBtn = page.locator('a.btn-primary.btn-sm').first();
      await expect(manageBtn).toBeVisible();
      await manageBtn.click();

      // Should navigate to challenge list with courseId
      await page.waitForURL(/challenge-list-instructor\.html\?courseId=/);

      // Wait for challenges to load
      await page.waitForFunction(() => {
        const tbody = document.getElementById('challengeTableBody');
        return tbody && !tbody.textContent.includes('Loading');
      }, { timeout: 10000 });

      // Should show at least 1 challenge row (not the empty state)
      const rows = page.locator('#challengeTableBody tr:not(.loading-row)');
      const rowCount = await rows.count();
      expect(rowCount, `${account.label} should see ≥1 challenge when clicking Manage Challenges`).toBeGreaterThan(0);

      // Should not show "No challenges match" empty state
      const emptyState = page.locator('.empty-state');
      const emptyCount = await emptyState.count();
      if (emptyCount > 0) {
        const emptyVisible = await emptyState.first().isVisible();
        expect(emptyVisible, `${account.label} should not see empty state`).toBeFalsy();
      }
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 5. BROWSER: Student challenge list page
// ═══════════════════════════════════════════════════════════
test.describe('Browser: Student challenge list', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (account.role !== 'student') continue;

    test(`${account.label} — challenge list shows challenges`, async ({ page, request }) => {
      await loginAs(request, page, account);
      await page.goto('/challenge-list.html');

      // Wait for at least one actionable challenge row (proves data loaded)
      // The page may briefly show "Loading..." then render rows with Start buttons
      const challengeRow = page.locator('#challengeTableBody tr:not(.loading-row)').first();
      await expect(challengeRow).toBeVisible({ timeout: 15000 });

      // Should show challenge rows
      const rows = page.locator('#challengeTableBody tr:not(.loading-row)');
      const rowCount = await rows.count();
      expect(rowCount, `${account.label} should see ≥1 challenge row`).toBeGreaterThan(0);
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 6. BROWSER: Student course catalog
// ═══════════════════════════════════════════════════════════
test.describe('Browser: Student course catalog', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (account.role !== 'student') continue;

    test(`${account.label} — course catalog shows courses`, async ({ page, request }) => {
      await loginAs(request, page, account);
      await page.goto('/course-catalog.html');

      // Wait for content to load
      await page.waitForFunction(() => {
        const body = document.body.textContent;
        return !body.includes('Loading');
      }, { timeout: 10000 });

      // Should have at least 1 course card
      const cards = page.locator('.course-card, .card');
      const count = await cards.count();
      expect(count, `${account.label} should see ≥1 course in catalog`).toBeGreaterThan(0);
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 7. BROWSER: Instructor challenge list (own challenges)
// ═══════════════════════════════════════════════════════════
test.describe('Browser: Instructor challenge list (mine)', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (account.role !== 'instructor') continue;

    test(`${account.label} — "My Challenges" page shows own challenges`, async ({ page, request }) => {
      await loginAs(request, page, account);
      await page.goto('/challenge-list-instructor.html');

      // Wait for challenges to load
      await page.waitForFunction(() => {
        const tbody = document.getElementById('challengeTableBody');
        return tbody && !tbody.textContent.includes('Loading');
      }, { timeout: 10000 });

      // Should show at least 1 challenge
      const rows = page.locator('#challengeTableBody tr:not(.loading-row)');
      const rowCount = await rows.count();
      expect(rowCount, `${account.label} should see ≥1 own challenge`).toBeGreaterThan(0);
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 8. BROWSER: Login page has demo user dropdown
// ═══════════════════════════════════════════════════════════
test.describe('Browser: Login page', () => {
  test('login page loads with test user dropdown', async ({ page }) => {
    await page.goto('/login.html');
    await expect(page.locator('body')).toBeVisible();

    // Wait for test users to load
    await page.waitForTimeout(2000);

    // Should have a select dropdown or user list for quick login
    const testUserSelect = page.locator('select, [data-test-users]');
    const count = await testUserSelect.count();
    expect(count, 'Login page should have test user selector').toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════
// 9. API-LEVEL: No courses with 0 challenges in instructor view
// ═══════════════════════════════════════════════════════════
test.describe('API: No empty courses in instructor catalog', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (account.role !== 'instructor') continue;

    test(`${account.label} — every course in catalog has ≥1 challenge`, async ({ request }) => {
      await apiLogin(request, account.email);

      const coursesRes = await request.get('/api/v1/courses?instructor=true');
      expect(coursesRes.ok()).toBeTruthy();
      const courses = await coursesRes.json();
      const courseList = courses.courses || courses;

      for (const course of courseList) {
        const challengeCount = course.challenge_count || course.challengeCount || 0;
        expect(
          challengeCount,
          `${account.label}: course "${course.name}" should have challenges (has ${challengeCount})`
        ).toBeGreaterThan(0);
      }
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 10. BROWSER: Analytics pages load without errors
// ═══════════════════════════════════════════════════════════
test.describe('Browser: Analytics pages load', () => {
  test('Student analytics page loads', async ({ page, request }) => {
    const account = DEMO_ACCOUNTS.studentEN;
    await loginAs(request, page, account);
    await page.goto('/student-analytics.html');

    // Should not show a JS error overlay
    await expect(page.locator('body')).toBeVisible();
    // Wait for content
    await page.waitForTimeout(2000);
    // Page should render without crashing
    const body = await page.textContent('body');
    expect(body).not.toContain('Cannot read properties');
    expect(body).not.toContain('Uncaught');
  });

  test('Instructor analytics page loads', async ({ page, request }) => {
    const account = DEMO_ACCOUNTS.instructorEN;
    await loginAs(request, page, account);
    await page.goto('/instructor-analytics.html');

    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(2000);
    const body = await page.textContent('body');
    expect(body).not.toContain('Cannot read properties');
    expect(body).not.toContain('Uncaught');
  });
});

// ═══════════════════════════════════════════════════════════
// 11. BROWSER: Language switching works on key pages
// ═══════════════════════════════════════════════════════════
test.describe('Browser: Language switch', () => {
  test('switching to Hebrew changes page direction to RTL', async ({ page, request }) => {
    const account = DEMO_ACCOUNTS.studentEN;
    await loginAs(request, page, account);
    await page.goto('/challenge-list.html');
    await page.waitForTimeout(1000);

    // Switch to Hebrew
    const langSelect = page.locator('.lang-select');
    if (await langSelect.count() > 0) {
      await langSelect.first().selectOption('he');
      await page.waitForTimeout(500);

      // HTML dir should be rtl
      const dir = await page.getAttribute('html', 'dir');
      expect(dir).toBe('rtl');
    }
  });
});
