// fixtures/base.fixture.ts  ← Gabungan semua fixture

import { test as base, devices } from '@playwright/test';
import type { Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { QRGeneratePage } from '../pages/QRGeneratePage';

type AllFixtures = {
  // ── Mobile ──
  mobileContext: BrowserContext;
  mobilePage: Page;

  // ── Pages (POM) ──
  loginPage: LoginPage;
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
  loginPage: async ({ mobilePage }, use) => {
    await use(new LoginPage(mobilePage));
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
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_EMAIL || 'merchant@test.com',
      process.env.TEST_PASSWORD || 'password123',
    );
    await loginPage.expectLoginSuccess();
    await use(page);
    await page.close();
  },
});

export { expect } from '@playwright/test';