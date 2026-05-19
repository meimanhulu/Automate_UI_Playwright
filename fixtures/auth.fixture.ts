// fixtures/auth.fixture.ts

import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type AuthFixture = {
  loggedInPage: Page;
};

export const authTest = base.extend<AuthFixture>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_EMAIL || 'merchant@test.com',
      process.env.TEST_PASSWORD || 'password123',
    );
    await loginPage.expectLoginSuccess();
    await use(page);
  },
});