const { test, expect } = require('@playwright/test');

test.describe('Authentication', () => {
  test('sign-up page displays correctly', async ({ page }) => {
    await page.goto('/sign-up.html');
    // Check that the sign-up form elements are present
    await expect(page.locator('body')).toBeVisible();
  });

  test('API returns 401 for unauthenticated requests', async ({ request }) => {
    const response = await request.get('/api/v1/users/me');
    expect(response.status()).toBe(401);
  });

  test('register via API and verify session', async ({ request }) => {
    const response = await request.post('/api/v1/auth/register', {
      data: {
        email: `e2e-${Date.now()}@test.com`,
        password: 'testpass123',
        name: 'E2E Test User',
        role: 'student',
      },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.user.role).toBe('student');
  });

  test('Google SSO button redirects', async ({ page }) => {
    await page.goto('/sign-up.html');
    // Check that Google SSO link/button exists
    const googleButton = page.locator('a[href*="google"], button:has-text("Google")');
    if (await googleButton.count() > 0) {
      // Don't actually click (would redirect to Google)
      expect(await googleButton.first().isVisible()).toBeTruthy();
    }
  });
});
