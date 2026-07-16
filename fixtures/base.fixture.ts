// fixtures/base.fixture.ts  ← Gabungan semua fixture

import { test as base, devices } from '@playwright/test';
import type { Page, BrowserContext } from '@playwright/test';
import { LoginLogoutPage } from '../pages/LoginLogoutPage';
import { DashboardPage } from '../pages/DashboardPage';
import { QRGeneratePage } from '../pages/QRGeneratePage';

/**
 * Global helper: Auto-close blank tabs dalam 150ms (event-driven)
 * 
 * Logic:
 * - Tab baru terbuka → listen URL change
 * - Jika URL berubah dari about:blank → legitimate tab → biarkan
 * - Jika masih about:blank setelah timeout → blank tab dari download → close
 * 
 * @param context - Browser context yang akan di-attach listener
 * @param timeoutMs - Timeout dalam ms (default: 150ms)
 */
export function attachBlankTabAutoClose(
  context: BrowserContext,
  timeoutMs: number = 150
): void {
  context.on('page', async (newPage) => {
    try {
      // Event-driven: resolve SEGERA saat URL berubah dari about:blank
      await newPage.waitForURL(
        (url) => url.href !== 'about:blank' && url.href !== '',
        { timeout: timeoutMs }
      );
      // URL berubah → legitimate tab → biarkan hidup
    } catch {
      // Masih about:blank setelah timeout → close
      if (!newPage.isClosed()) {
        await newPage.close().catch(() => {});
      }
    }
  });
}

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
    // Create page FIRST
    const page = await mobileContext.newPage();

    // Attach listener AFTER - won't close main page
    attachBlankTabAutoClose(mobileContext, 150);

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
    // Create page FIRST
    const page = await mobileContext.newPage();

    // Attach listener AFTER
    attachBlankTabAutoClose(mobileContext, 150);

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