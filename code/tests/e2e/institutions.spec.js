const { test, expect } = require('@playwright/test');

test.describe('Institutions API', () => {
  test('returns list of institutions', async ({ request }) => {
    const response = await request.get('/api/v1/institutions');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });
});
