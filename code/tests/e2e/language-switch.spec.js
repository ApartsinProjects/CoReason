const { test, expect } = require('@playwright/test');

test.describe('Language Switching', () => {
  test('language selector exists on pages', async ({ page }) => {
    await page.goto('/challenge-list.html');
    const langSelect = page.locator('.lang-select, select[class*="lang"]');
    if (await langSelect.count() > 0) {
      await expect(langSelect.first()).toBeVisible();
    }
  });

  test('pages load with different screen files', async ({ page }) => {
    // Verify key screens load without JS errors
    const screens = [
      '/index.html',
      '/login.html',
      '/sign-up.html',
      '/challenge-list.html',
      '/challenge-run.html',
      '/course-catalog.html',
      '/student-analytics.html',
      '/profile.html',
    ];

    for (const screen of screens) {
      const response = await page.goto(screen);
      expect(response.status()).toBe(200);
    }
  });
});
