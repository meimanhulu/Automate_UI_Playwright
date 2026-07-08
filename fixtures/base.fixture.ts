// fixtures/base.fixture.ts  ← Gabungan semua fixture

import { test as base, devices } from '@playwright/test';
import type { Page, BrowserContext } from '@playwright/test';
import { LoginLogoutPage } from '../pages/LoginLogoutPage';
import { DashboardPage } from '../pages/DashboardPage';
import { QRGeneratePage } from '../pages/QRGeneratePage';

type AllFixtures = {
  // ── Mobile ──
  mobileContext: BrowserContext;
  mobilePage: Page;

  // ── Pages (POM) ──
  loginLogoutPage: LoginLogoutPage;
  dashboardPage: DashboardPage;
  qrGeneratePage: QRGeneratePage;

  // ── Auth ──
  loggedInMobilePage: Page;
};

export const test = base.extend<AllFixtures>({

  // ── Mobile Context ──
  mobileContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      ...devices['Pixel 7'],
      recordVideo: { dir: 'results/videos/' },
    });
    await use(context);
    await context.close();
  },

  // ── Mobile Page ──
  mobilePage: async ({ mobileContext }, use) => {
    const page = await mobileContext.newPage();
    await use(page);
    await page.close();
  },

  // ── Page Objects ──
  loginLogoutPage: async ({ mobilePage }, use) => {
    await use(new LoginLogoutPage(mobilePage));
  },

  dashboardPage: async ({ mobilePage }, use) => {
    await use(new DashboardPage(mobilePage));
  },

  qrGeneratePage: async ({ mobilePage }, use) => {
    await use(new QRGeneratePage(mobilePage));
  },

  // ── Logged In Mobile Page ──
  loggedInMobilePage: async ({ mobileContext }, use) => {
    const page = await mobileContext.newPage();
    const loginLogoutPage = new LoginLogoutPage(page);
    await loginLogoutPage.goto();
    await loginLogoutPage.login(
      process.env.TEST_EMAIL || 'merchant@test.com',
      process.env.TEST_PASSWORD || 'password123',
    );
    await loginLogoutPage.expectLoginSuccess();
    await use(page);
    await page.close();
  },
});

export { expect } from '@playwright/test';