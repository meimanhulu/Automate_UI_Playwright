// fixtures/base.fixture.ts  ← Gabungan semua fixture

import { test as base, devices } from '@playwright/test';
import type { Page, BrowserContext } from '@playwright/test';
import { LoginLogoutPage } from '../pages/LoginLogoutPage';
import { DashboardPage } from '../pages/DashboardPage';
import { QRGeneratePage } from '../pages/QRGeneratePage';

/**
 * Global helper: Auto-close truly-blank popup tabs from window.open(),
 * WITHOUT killing tabs that are being used for a file download.
 *
 * Uses page.on('popup') — more reliable than context.on('page') because
 * it only fires for window.open() triggered from this page, not for
 * context.newPage() calls we make ourselves.
 *
 * A popup is kept alive if EITHER of these happens within `timeoutMs`:
 *   1. It navigates to a real URL (legitimate new tab), OR
 *   2. A `download` event fires on it (S3 presigned-URL download tab).
 *
 * Only if NEITHER happens within the timeout is the popup considered a
 * genuinely blank/orphaned tab and closed.
 *
 * @param page - Playwright Page to attach the popup listener to
 * @param timeoutMs - How long to wait for navigation/download before closing (default: 2000ms)
 */
export function attachPopupAutoClose(
  page: Page,
  timeoutMs: number = 2_000
): void {
  page.on('popup', async (popup) => {
    try {
      const reason = await Promise.race([
        popup
          .waitForURL(
            (url) => url.href !== 'about:blank' && url.href !== '',
            { timeout: timeoutMs }
          )
          .then(() => 'navigated' as const),
        popup
          .waitForEvent('download', { timeout: timeoutMs })
          .then(() => 'download' as const),
      ]);
      // 'navigated' or 'download' → keep the popup alive
      void reason;
    } catch {
      // Neither navigation nor download happened in time → truly blank tab → close it
      if (!popup.isClosed()) {
        await popup.close().catch(() => {});
      }
    }
  });
}

/** @deprecated Use {@link attachPopupAutoClose} — download-aware replacement. */
export const attachBlankTabAutoClose = attachPopupAutoClose;

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

    // Attach listener to the page AFTER creation
    attachBlankTabAutoClose(page, 150);

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

    // Attach listener to the page AFTER creation
    attachBlankTabAutoClose(page, 150);

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