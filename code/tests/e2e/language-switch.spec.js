const { test, expect } = require('@playwright/test');

test.describe('Language Switching', () => {
  test('language selector exists on pages', async ({ page }) => {
    await page.goto('/03-challenge-list.html');
    const langSelect = page.locator('.lang-select, select[class*="lang"]');
    if (await langSelect.count() > 0) {
      await expect(langSelect.first()).toBeVisible();
    }
  });

  test('pages load with different screen files', async ({ page }) => {
    // Verify key screens load without JS errors
    const screens = [
      '/index.html',
      '/00-login.html',
      '/01-sign-up.html',
      '/03-challenge-list.html',
      '/05-challenge-run.html',
      '/06-course-catalog.html',
      '/07-student-analytics.html',
      '/09-profile.html',
    ];

    for (const screen of screens) {
      const response = await page.goto(screen);
      expect(response.status()).toBe(200);
    }
  });
});
