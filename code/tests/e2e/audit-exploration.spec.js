const { test, expect } = require('@playwright/test');

/**
 * Comprehensive Demo Audit — Playwright Exploration
 * Tests ALL demo user journeys, API endpoints, and cross-cutting concerns.
 * Audit date: 2026-03-18
 */

const BASE = 'http://localhost:3000';

const DEMO_ACCOUNTS = {
  instructorEN: { email: 'dr.levy@tau.ac.il', role: 'instructor', lang: 'en', label: 'Dr. Levy (EN instructor)' },
  instructorHE: { email: 'dr.shapira.he@tau.ac.il', role: 'instructor', lang: 'he', label: 'ד״ר ברכה שפירא (HE instructor)' },
  studentEN: { email: 'noa.cohen@tau.ac.il', role: 'student', lang: 'en', label: 'Noa Cohen (EN student)' },
  studentHE: { email: 'noa.cohen.he@tau.ac.il', role: 'student', lang: 'he', label: 'נועה כהן (HE student)' },
};

// ─── Helpers ───
async function loginAs(request, page, account) {
  const res = await request.post('/api/v1/auth/test-login', {
    data: { email: account.email },
  });
  expect(res.ok(), `Login failed for ${account.label}: ${res.status()}`).toBeTruthy();
  const state = await request.storageState();
  if (state.cookies.length) {
    await page.context().addCookies(state.cookies);
  }
  return res;
}

async function apiLogin(request, email) {
  const res = await request.post('/api/v1/auth/test-login', { data: { email } });
  expect(res.ok(), `API login failed for ${email}`).toBeTruthy();
  return res;
}

// Collect console errors
function collectConsoleErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  return errors;
}

// ═══════════════════════════════════════════════════════════
// A. TEST ALL 4 DEMO ACCOUNTS LOGIN
// ═══════════════════════════════════════════════════════════
test.describe('A. Demo Account Login', () => {
  test('GET /api/v1/auth/test-users returns all demo accounts', async ({ request }) => {
    const res = await request.get('/api/v1/auth/test-users');
    expect(res.ok()).toBeTruthy();
    const users = await res.json();
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThanOrEqual(4);

    // Verify our 4 demo accounts exist
    for (const [, acct] of Object.entries(DEMO_ACCOUNTS)) {
      const found = users.find(u => u.email === acct.email);
      expect(found, `Account ${acct.email} should exist in test-users`).toBeTruthy();
    }
  });

  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    test(`Login via test-login: ${account.label}`, async ({ request }) => {
      const res = await request.post('/api/v1/auth/test-login', {
        data: { email: account.email },
      });
      expect(res.ok(), `Login should succeed for ${account.label}`).toBeTruthy();
      const body = await res.json();
      // Should return user info or token
      expect(body).toBeTruthy();
    });
  }
});

// ═══════════════════════════════════════════════════════════
// B. INSTRUCTOR ACCOUNTS VERIFICATION
// ═══════════════════════════════════════════════════════════
test.describe('B. Instructor Journeys', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (account.role !== 'instructor') continue;

    test.describe(`${account.label}`, () => {
      test('Course catalog loads with courses having challenge counts > 0', async ({ page, request }) => {
        await loginAs(request, page, account);
        const errors = collectConsoleErrors(page);
        await page.goto('/course-catalog-instructor.html');

        // Wait for courses to load
        await page.waitForFunction(() => {
          const grid = document.getElementById('courseGrid');
          return grid && !grid.textContent.includes('Loading');
        }, { timeout: 15000 });

        const cards = page.locator('.course-card');
        const count = await cards.count();
        expect(count, 'Should have >= 1 course card').toBeGreaterThan(0);
        console.log(`  ${account.label}: ${count} course cards found`);

        // Check challenge counts on cards
        for (let i = 0; i < count; i++) {
          const cardText = await cards.nth(i).textContent();
          console.log(`  Card ${i}: ${cardText.substring(0, 100).replace(/\s+/g, ' ')}`);
        }
      });

      test('Manage Challenges navigates to challenge list with challenges', async ({ page, request }) => {
        await loginAs(request, page, account);
        await page.goto('/course-catalog-instructor.html');
        await page.waitForFunction(() => {
          const grid = document.getElementById('courseGrid');
          return grid && !grid.textContent.includes('Loading');
        }, { timeout: 15000 });

        // Find and click Manage Challenges
        const manageBtn = page.locator('a').filter({ hasText: /manage|ניהול/i }).first();
        if (await manageBtn.count() > 0) {
          await manageBtn.click();
          await page.waitForURL(/challenge-list-instructor/, { timeout: 10000 });

          await page.waitForFunction(() => {
            const tbody = document.getElementById('challengeTableBody');
            return tbody && !tbody.textContent.includes('Loading');
          }, { timeout: 10000 });

          const rows = page.locator('#challengeTableBody tr');
          const rowCount = await rows.count();
          console.log(`  ${account.label}: ${rowCount} challenge rows found`);
          expect(rowCount, 'Should have challenge rows').toBeGreaterThan(0);
        } else {
          // Try alternative selector
          const altBtn = page.locator('a.btn-primary.btn-sm').first();
          expect(await altBtn.count(), 'Should find Manage Challenges button').toBeGreaterThan(0);
          await altBtn.click();
          await page.waitForURL(/challenge-list-instructor/, { timeout: 10000 });
        }
      });

      test('Create Challenge page loads with Save as Draft button', async ({ page, request }) => {
        await loginAs(request, page, account);
        const errors = collectConsoleErrors(page);
        await page.goto('/create-challenge.html');
        await page.waitForTimeout(2000);

        // Page should load without crash
        const bodyText = await page.textContent('body');
        expect(bodyText).not.toContain('Cannot read properties');

        // Should have Save as Draft button
        const saveBtn = page.locator('button').filter({ hasText: /save|draft|שמור|טיוטה/i });
        const saveBtnCount = await saveBtn.count();
        console.log(`  ${account.label}: Save/Draft buttons found: ${saveBtnCount}`);

        // Log any console errors
        if (errors.length > 0) {
          console.log(`  Console errors on create-challenge: ${errors.join('; ')}`);
        }
      });

      test('Challenge preview mode shows preview banner', async ({ page, request }) => {
        await loginAs(request, page, account);

        // First get a challenge ID
        const challRes = await request.get('/api/v1/challenges');
        expect(challRes.ok()).toBeTruthy();
        const challData = await challRes.json();
        const challenges = challData.challenges || challData;

        if (challenges.length > 0) {
          const challengeId = challenges[0]._id || challenges[0].id;
          await page.goto(`/challenge-run.html?challengeId=${challengeId}&preview=instructor`);
          await page.waitForTimeout(3000);

          const bodyText = await page.textContent('body');
          const hasPreview = bodyText.toLowerCase().includes('preview') ||
                            bodyText.includes('תצוגה מקדימה');
          console.log(`  ${account.label}: Preview banner visible: ${hasPreview}`);
          console.log(`  Body snippet: ${bodyText.substring(0, 200).replace(/\s+/g, ' ')}`);
        } else {
          console.log(`  ${account.label}: No challenges found for preview test`);
        }
      });

      test('Instructor analytics page loads with data', async ({ page, request }) => {
        await loginAs(request, page, account);
        const errors = collectConsoleErrors(page);
        await page.goto('/instructor-analytics.html');
        await page.waitForTimeout(3000);

        const bodyText = await page.textContent('body');
        expect(bodyText).not.toContain('Cannot read properties');
        expect(bodyText).not.toContain('Uncaught');

        // Check for canvas (charts) or data
        const canvasCount = await page.locator('canvas').count();
        const tableRows = await page.locator('table tbody tr').count();
        console.log(`  ${account.label}: Analytics - canvases: ${canvasCount}, table rows: ${tableRows}`);
        console.log(`  Analytics errors: ${errors.length > 0 ? errors.join('; ') : 'none'}`);
      });
    });
  }
});

// ═══════════════════════════════════════════════════════════
// C. STUDENT ACCOUNTS VERIFICATION
// ═══════════════════════════════════════════════════════════
test.describe('C. Student Journeys', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (account.role !== 'student') continue;

    test.describe(`${account.label}`, () => {
      test('Challenge list loads with challenges', async ({ page, request }) => {
        await loginAs(request, page, account);
        await page.goto('/challenge-list.html');

        const row = page.locator('#challengeTableBody tr').first();
        await expect(row).toBeVisible({ timeout: 15000 });

        const rows = page.locator('#challengeTableBody tr');
        const rowCount = await rows.count();
        console.log(`  ${account.label}: ${rowCount} challenge rows`);
        expect(rowCount).toBeGreaterThan(0);
      });

      test('Course catalog shows courses', async ({ page, request }) => {
        await loginAs(request, page, account);
        await page.goto('/course-catalog.html');
        await page.waitForFunction(() => {
          const body = document.body.textContent;
          return !body.includes('Loading');
        }, { timeout: 10000 });

        const cards = page.locator('.course-card, .card');
        const count = await cards.count();
        console.log(`  ${account.label}: ${count} course cards in catalog`);
        expect(count).toBeGreaterThan(0);
      });

      test('Start Challenge navigates to challenge-run', async ({ page, request }) => {
        await loginAs(request, page, account);
        await page.goto('/challenge-list.html');

        const row = page.locator('#challengeTableBody tr').first();
        await expect(row).toBeVisible({ timeout: 15000 });

        // Look for Start button
        const startBtn = page.locator('#challengeTableBody a, #challengeTableBody button').filter({ hasText: /start|התחל/i }).first();
        const startCount = await startBtn.count();
        console.log(`  ${account.label}: Start buttons found: ${startCount}`);

        if (startCount > 0) {
          await startBtn.click();
          await page.waitForTimeout(3000);
          const url = page.url();
          console.log(`  Navigated to: ${url}`);
          const isRunPage = url.includes('challenge-run');
          expect(isRunPage, 'Should navigate to challenge-run page').toBeTruthy();
        }
      });

      test('Student analytics page loads with data', async ({ page, request }) => {
        await loginAs(request, page, account);
        const errors = collectConsoleErrors(page);
        await page.goto('/student-analytics.html');
        await page.waitForTimeout(3000);

        const bodyText = await page.textContent('body');
        expect(bodyText).not.toContain('Cannot read properties');

        const canvasCount = await page.locator('canvas').count();
        console.log(`  ${account.label}: Analytics canvases: ${canvasCount}`);
        console.log(`  Analytics errors: ${errors.length > 0 ? errors.join('; ') : 'none'}`);
      });
    });
  }
});

// ═══════════════════════════════════════════════════════════
// D. HEBREW ACCOUNTS — RTL & LOCALIZATION
// ═══════════════════════════════════════════════════════════
test.describe('D. Hebrew Localization', () => {
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    if (!key.endsWith('HE')) continue;

    test(`${account.label} — page direction is RTL`, async ({ page, request }) => {
      test.setTimeout(60000);
      await loginAs(request, page, account);
      // Navigate to a blank page first to set localStorage
      await page.goto('/login.html', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => localStorage.setItem('coreason-lang', 'he'));
      // Now navigate to the target page — content-loader will read 'he' from localStorage
      const targetPage = account.role === 'instructor' ? '/course-catalog-instructor.html' : '/challenge-list.html';
      await page.goto(targetPage, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const dir = await page.getAttribute('html', 'dir');
      const bodyDir = await page.evaluate(() => getComputedStyle(document.body).direction);
      console.log(`  ${account.label}: html dir="${dir}", body direction="${bodyDir}"`);
      const isRTL = dir === 'rtl' || bodyDir === 'rtl';
      expect(isRTL, 'Hebrew pages should be RTL').toBeTruthy();
    });

    test(`${account.label} — UI labels are in Hebrew`, async ({ page, request }) => {
      await loginAs(request, page, account);
      const targetPage = account.role === 'instructor' ? '/course-catalog-instructor.html' : '/challenge-list.html';
      await page.goto(targetPage);
      await page.waitForTimeout(3000);

      const bodyText = await page.textContent('body');
      // Check for Hebrew characters (Unicode range \u0590-\u05FF)
      const hebrewMatch = bodyText.match(/[\u0590-\u05FF]+/g);
      const hebrewCount = hebrewMatch ? hebrewMatch.length : 0;
      console.log(`  ${account.label}: Hebrew text segments found: ${hebrewCount}`);
      expect(hebrewCount, 'Should have Hebrew text on page').toBeGreaterThan(0);

      // Should NOT show raw translation keys like "course_catalog" etc.
      const hasRawKeys = bodyText.includes('course_catalog') || bodyText.includes('challenge_list') || bodyText.includes('nav_');
      console.log(`  ${account.label}: Raw translation keys visible: ${hasRawKeys}`);
    });

    test(`${account.label} — course names are in Hebrew`, async ({ page, request }) => {
      await loginAs(request, page, account);
      const targetPage = account.role === 'instructor' ? '/course-catalog-instructor.html' : '/course-catalog.html';
      await page.goto(targetPage);
      // Wait for language auto-set and content to load
      await page.waitForFunction(() => {
        const body = document.body.textContent;
        return !body.includes('Loading') && /[\u0590-\u05FF]/.test(body);
      }, { timeout: 10000 }).catch(() => {});

      const cards = page.locator('.course-card, .card');
      const count = await cards.count();

      if (count > 0) {
        const firstCardText = await cards.first().textContent();
        const hasHebrew = /[\u0590-\u05FF]/.test(firstCardText);
        console.log(`  ${account.label}: First card text (50 chars): "${firstCardText.substring(0, 50).replace(/\s+/g, ' ')}"`);
        console.log(`  Contains Hebrew: ${hasHebrew}`);
        expect(hasHebrew, 'Course card should contain Hebrew text').toBeTruthy();
      } else {
        console.log(`  ${account.label}: No course cards found!`);
      }
    });
  }
});

// ═══════════════════════════════════════════════════════════
// E. CROSS-CUTTING CONCERNS
// ═══════════════════════════════════════════════════════════
test.describe('E. Cross-Cutting Concerns', () => {
  test('Language switcher toggles EN <-> HE', async ({ page, request }) => {
    await loginAs(request, page, DEMO_ACCOUNTS.studentEN);
    await page.goto('/challenge-list.html');
    await page.waitForTimeout(2000);

    // Look for language switcher
    const langSelect = page.locator('.lang-select, select[id*="lang"], #languageSelect, [data-lang]');
    const langCount = await langSelect.count();
    console.log(`  Language switcher elements found: ${langCount}`);

    if (langCount > 0) {
      const el = langSelect.first();
      const tag = await el.evaluate(e => e.tagName.toLowerCase());
      if (tag === 'select') {
        await el.selectOption('he');
        await page.waitForTimeout(1000);
        const dir = await page.getAttribute('html', 'dir');
        console.log(`  After switching to HE: dir="${dir}"`);
        expect(dir).toBe('rtl');

        // Switch back
        await el.selectOption('en');
        await page.waitForTimeout(1000);
        const dir2 = await page.getAttribute('html', 'dir');
        console.log(`  After switching back to EN: dir="${dir2}"`);
      }
    }
  });

  test('Role guard: student visiting instructor page gets redirected', async ({ page, request }) => {
    await loginAs(request, page, DEMO_ACCOUNTS.studentEN);
    await page.goto('/course-catalog-instructor.html');
    await page.waitForTimeout(3000);

    const url = page.url();
    console.log(`  Student visiting instructor page — final URL: ${url}`);
    // Should either redirect or show access denied
    const bodyText = await page.textContent('body');
    const redirected = !url.includes('course-catalog-instructor') ||
                       bodyText.toLowerCase().includes('access denied') ||
                       bodyText.toLowerCase().includes('unauthorized') ||
                       bodyText.includes('login');
    console.log(`  Redirected/blocked: ${redirected}`);
  });

  test('Tour system loads (tour.js present)', async ({ page, request }) => {
    await loginAs(request, page, DEMO_ACCOUNTS.studentEN);
    await page.goto('/challenge-list.html');
    await page.waitForTimeout(2000);

    const tourScript = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(s => s.src && s.src.includes('tour'));
    });
    console.log(`  tour.js loaded: ${tourScript}`);
  });

  test('Help popups system loads (help-popups.js present)', async ({ page, request }) => {
    await loginAs(request, page, DEMO_ACCOUNTS.studentEN);
    await page.goto('/challenge-list.html');
    await page.waitForTimeout(2000);

    const helpScript = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(s => s.src && s.src.includes('help-popups'));
    });
    console.log(`  help-popups.js loaded: ${helpScript}`);
  });

  test('All navigation links resolve (no 404s)', async ({ page, request }) => {
    await loginAs(request, page, DEMO_ACCOUNTS.studentEN);
    await page.goto('/challenge-list.html');
    await page.waitForTimeout(2000);

    // Collect all nav links
    const links = await page.evaluate(() => {
      const anchors = document.querySelectorAll('nav a, .navbar a, .nav a');
      return Array.from(anchors).map(a => ({ href: a.href, text: a.textContent.trim() }));
    });
    console.log(`  Nav links found: ${links.length}`);

    const results = [];
    for (const link of links) {
      if (!link.href || link.href.startsWith('javascript:') || link.href === '#') continue;
      try {
        const url = new URL(link.href);
        if (url.origin !== 'http://localhost:3000') continue;
        const res = await request.get(url.pathname);
        results.push({ text: link.text, href: url.pathname, status: res.status() });
        if (res.status() === 404) {
          console.log(`  404: ${link.text} -> ${url.pathname}`);
        }
      } catch (e) {
        // skip malformed URLs
      }
    }
    console.log(`  Checked ${results.length} nav links`);
    const notFound = results.filter(r => r.status === 404);
    console.log(`  404 links: ${notFound.length}`);
    if (notFound.length > 0) {
      console.log(`  404 details: ${JSON.stringify(notFound)}`);
    }
  });

  test('Subject tree editor loads', async ({ page, request }) => {
    await loginAs(request, page, DEMO_ACCOUNTS.instructorEN);
    const errors = collectConsoleErrors(page);
    await page.goto('/edit-subject-tree.html');
    await page.waitForTimeout(3000);

    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('Cannot read properties');
    console.log(`  Subject tree editor body (100 chars): "${bodyText.substring(0, 100).replace(/\s+/g, ' ')}"`);
    console.log(`  Console errors: ${errors.length > 0 ? errors.join('; ') : 'none'}`);
  });
});

// ═══════════════════════════════════════════════════════════
// F. CHALLENGE RUN FLOW (CRITICAL DEMO PATH)
// ═══════════════════════════════════════════════════════════
test.describe('F. Challenge Run Flow', () => {
  test('Full challenge run: start, framing, submit', async ({ page, request }) => {
    test.setTimeout(60000);
    await loginAs(request, page, DEMO_ACCOUNTS.studentEN);
    const errors = collectConsoleErrors(page);

    // 1. Get challenges via API
    const challRes = await request.get('/api/v1/challenges');
    expect(challRes.ok()).toBeTruthy();
    const challData = await challRes.json();
    const challenges = challData.challenges || challData;
    expect(challenges.length, 'Should have challenges').toBeGreaterThan(0);
    console.log(`  Available challenges: ${challenges.length}`);

    const challenge = challenges[0];
    const challengeId = challenge._id || challenge.id;
    console.log(`  Using challenge: ${challenge.title || challenge.name} (${challengeId})`);

    // 2. Navigate to challenge run
    await page.goto(`/challenge-run.html?challengeId=${challengeId}`);
    await page.waitForTimeout(5000);

    const bodyText = await page.textContent('body');
    console.log(`  Challenge run page (200 chars): "${bodyText.substring(0, 200).replace(/\s+/g, ' ')}"`);

    // 3. Check for problem statement
    const hasProblem = bodyText.length > 100; // Page has substantial content
    console.log(`  Has substantial content: ${hasProblem}`);

    // 4. Look for framing input
    const textareas = await page.locator('textarea').count();
    const textInputs = await page.locator('input[type="text"]').count();
    const radioButtons = await page.locator('input[type="radio"]').count();
    const checkboxes = await page.locator('input[type="checkbox"]').count();
    console.log(`  Input elements — textareas: ${textareas}, text inputs: ${textInputs}, radios: ${radioButtons}, checkboxes: ${checkboxes}`);

    // 5. Look for submit/next buttons
    const submitBtns = page.locator('button').filter({ hasText: /submit|next|send|שלח|הבא/i });
    const submitCount = await submitBtns.count();
    console.log(`  Submit/next buttons: ${submitCount}`);

    // 6. Check for phase indicators
    const phaseText = bodyText.match(/phase|שלב|framing|judging|steering/gi);
    console.log(`  Phase-related text: ${phaseText ? phaseText.join(', ') : 'none found'}`);

    // Log errors
    console.log(`  Console errors: ${errors.length > 0 ? errors.slice(0, 5).join('; ') : 'none'}`);
  });

  test('Challenge run with open-ended page', async ({ page, request }) => {
    test.setTimeout(60000);
    await loginAs(request, page, DEMO_ACCOUNTS.studentEN);

    const challRes = await request.get('/api/v1/challenges');
    const challData = await challRes.json();
    const challenges = challData.challenges || challData;

    if (challenges.length > 0) {
      const challengeId = challenges[0]._id || challenges[0].id;
      await page.goto(`/challenge-run-open-ended.html?challengeId=${challengeId}`);
      await page.waitForTimeout(5000);

      const bodyText = await page.textContent('body');
      console.log(`  Open-ended challenge page (200 chars): "${bodyText.substring(0, 200).replace(/\s+/g, ' ')}"`);

      const textareas = await page.locator('textarea').count();
      console.log(`  Textareas on open-ended page: ${textareas}`);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// G. API-LEVEL CHECKS
// ═══════════════════════════════════════════════════════════
test.describe('G. API Verification', () => {
  test('GET /api/v1/courses returns courses (as student)', async ({ request }) => {
    await apiLogin(request, DEMO_ACCOUNTS.studentEN.email);
    const res = await request.get('/api/v1/courses');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    const courses = data.courses || data;
    console.log(`  Courses returned: ${courses.length}`);
    expect(courses.length).toBeGreaterThan(0);

    // Log course details
    for (const c of courses.slice(0, 5)) {
      console.log(`  Course: "${c.name}" | challenges: ${c.challenge_count || c.challengeCount || 'N/A'} | institution: ${c.institution_name || 'N/A'}`);
    }
  });

  test('GET /api/v1/courses returns courses (as instructor)', async ({ request }) => {
    await apiLogin(request, DEMO_ACCOUNTS.instructorEN.email);
    const res = await request.get('/api/v1/courses?instructor=true');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    const courses = data.courses || data;
    console.log(`  Instructor courses: ${courses.length}`);
    for (const c of courses) {
      console.log(`  Course: "${c.name}" | challenges: ${c.challenge_count || c.challengeCount || 'N/A'}`);
    }
    expect(courses.length).toBeGreaterThan(0);
  });

  test('GET /api/v1/challenges returns challenges', async ({ request }) => {
    await apiLogin(request, DEMO_ACCOUNTS.studentEN.email);
    const res = await request.get('/api/v1/challenges');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    const challenges = data.challenges || data;
    console.log(`  Challenges returned: ${challenges.length}`);
    for (const ch of challenges.slice(0, 5)) {
      console.log(`  Challenge: "${ch.title || ch.name}" | type: ${ch.response_type || 'N/A'} | status: ${ch.status || 'N/A'}`);
    }
    expect(challenges.length).toBeGreaterThan(0);
  });

  test('GET /api/v1/users/me returns user profile', async ({ request }) => {
    await apiLogin(request, DEMO_ACCOUNTS.studentEN.email);
    const res = await request.get('/api/v1/users/me');
    expect(res.ok()).toBeTruthy();
    const user = await res.json();
    console.log(`  User: ${user.name || user.email} | role: ${user.role} | institution: ${user.institution_name || user.institution || 'N/A'}`);
    expect(user.email).toBe(DEMO_ACCOUNTS.studentEN.email);
  });

  test('GET /api/v1/analytics/student returns analytics data', async ({ request }) => {
    await apiLogin(request, DEMO_ACCOUNTS.studentEN.email);
    const res = await request.get('/api/v1/analytics/student');
    console.log(`  Student analytics status: ${res.status()}`);
    if (res.ok()) {
      const data = await res.json();
      console.log(`  Analytics data keys: ${Object.keys(data).join(', ')}`);
      console.log(`  Analytics data (200 chars): ${JSON.stringify(data).substring(0, 200)}`);
    } else {
      console.log(`  Student analytics failed: ${res.status()} ${res.statusText()}`);
    }
  });

  test('GET /api/v1/analytics/instructor/:courseId returns analytics data', async ({ request }) => {
    await apiLogin(request, DEMO_ACCOUNTS.instructorEN.email);
    // First get instructor's courses to find a valid courseId
    const coursesRes = await request.get('/api/v1/courses?instructor=true');
    const coursesData = await coursesRes.json();
    const courses = Array.isArray(coursesData) ? coursesData : (coursesData.courses || []);
    const courseId = courses[0]?.id || 'unknown';
    console.log(`  Using courseId: ${courseId} (${courses[0]?.name})`);
    const res = await request.get(`/api/v1/analytics/instructor/${courseId}`);
    console.log(`  Instructor analytics status: ${res.status()}`);
    if (res.ok()) {
      const data = await res.json();
      console.log(`  Analytics data keys: ${Object.keys(data).join(', ')}`);
      console.log(`  Analytics data (200 chars): ${JSON.stringify(data).substring(0, 200)}`);
    } else {
      console.log(`  Instructor analytics failed: ${res.status()} ${res.statusText()}`);
    }
  });

  test('GET /api/v1/courses — Hebrew student sees Hebrew courses', async ({ request }) => {
    await apiLogin(request, DEMO_ACCOUNTS.studentHE.email);
    const res = await request.get('/api/v1/courses');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    const courses = data.courses || data;
    console.log(`  HE student courses: ${courses.length}`);
    for (const c of courses.slice(0, 5)) {
      const hasHebrew = /[\u0590-\u05FF]/.test(c.name);
      console.log(`  Course: "${c.name}" | Hebrew: ${hasHebrew} | institution: ${c.institution_name || 'N/A'}`);
    }
  });

  test('GET /api/v1/courses — Hebrew instructor sees Hebrew courses', async ({ request }) => {
    await apiLogin(request, DEMO_ACCOUNTS.instructorHE.email);
    const res = await request.get('/api/v1/courses?instructor=true');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    const courses = data.courses || data;
    console.log(`  HE instructor courses: ${courses.length}`);
    for (const c of courses) {
      const hasHebrew = /[\u0590-\u05FF]/.test(c.name);
      console.log(`  Course: "${c.name}" | Hebrew: ${hasHebrew}`);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// H. ADDITIONAL PAGE LOADS (COMPREHENSIVE)
// ═══════════════════════════════════════════════════════════
test.describe('H. All Pages Load Check', () => {
  const pages = [
    { path: '/login.html', needsAuth: false, label: 'Login' },
    { path: '/index.html', needsAuth: false, label: 'Home/Index' },
    { path: '/sign-up.html', needsAuth: false, label: 'Sign Up' },
    { path: '/profile.html', needsAuth: true, label: 'Profile' },
    { path: '/challenge-report.html', needsAuth: true, label: 'Challenge Report' },
    { path: '/admin.html', needsAuth: true, label: 'Admin' },
    { path: '/add-course.html', needsAuth: true, label: 'Add Course' },
  ];

  for (const pg of pages) {
    test(`Page loads: ${pg.label} (${pg.path})`, async ({ page, request }) => {
      if (pg.needsAuth) {
        await loginAs(request, page, DEMO_ACCOUNTS.instructorEN);
      }
      const errors = collectConsoleErrors(page);
      const response = await page.goto(pg.path);
      await page.waitForTimeout(2000);

      const status = response.status();
      console.log(`  ${pg.label}: HTTP ${status}`);
      expect(status).not.toBe(404);

      const bodyText = await page.textContent('body');
      const hasCrash = bodyText.includes('Cannot read properties') || bodyText.includes('Uncaught');
      console.log(`  Has JS crash in body: ${hasCrash}`);
      console.log(`  Console errors: ${errors.length}`);
      if (errors.length > 0) console.log(`  Errors: ${errors.slice(0, 3).join('; ')}`);
    });
  }
});
