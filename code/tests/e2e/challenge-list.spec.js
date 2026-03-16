const { test, expect } = require('@playwright/test');

test.describe('Challenge List', () => {
  test('challenge list page loads', async ({ page }) => {
    await page.goto('/03-challenge-list.html');
    await expect(page.locator('body')).toBeVisible();
  });

  test('challenge list instructor page loads', async ({ page }) => {
    await page.goto('/03-challenge-list-instructor.html');
    await expect(page.locator('body')).toBeVisible();
  });
});
