// fixtures/mobile.fixture.ts

import { test as base, devices } from '@playwright/test';
import type { Page, BrowserContext } from '@playwright/test';
import { attachBlankTabAutoClose } from './base.fixture';

type MobileFixture = {
  mobilePage: Page;
  mobileContext: BrowserContext;
};

export const mobileTest = base.extend<MobileFixture>({
  mobileContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      ...devices['Pixel 7'],
      recordVideo: { dir: 'results/videos/' },
    });

    // Auto-close blank tabs globally
    attachBlankTabAutoClose(context, 150);

    await use(context);
    await context.close();
  },

  mobilePage: async ({ mobileContext }, use) => {
    // Create page FIRST
    const page = await mobileContext.newPage();

    // Attach listener AFTER - won't close main page
    attachBlankTabAutoClose(mobileContext, 150);

    await use(page);
    await page.close();
  },
});