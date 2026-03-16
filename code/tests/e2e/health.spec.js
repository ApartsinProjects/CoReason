const { test, expect } = require('@playwright/test');

test.describe('Smoke Tests', () => {
  test('health endpoint returns OK', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CoReason/i);
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login.html');
    await expect(page.locator('body')).toBeVisible();
  });
});
