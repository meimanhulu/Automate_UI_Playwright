import { test, expect } from '../fixtures/base.fixture';

test('login (template)', async ({ loginLogoutPage, dashboardPage }) => {
  // NOTE: adjust path/selector to match your app.
  await loginLogoutPage.open();

  const username = process.env.E2E_USERNAME || 'demo';
  const password = process.env.E2E_PASSWORD || 'demo';

  await loginLogoutPage.login(username, password);

  // This expects your app has data-testid="dashboard-page" after login.
  await dashboardPage.assertLoaded();
  await expect(true).toBeTruthy();
});
