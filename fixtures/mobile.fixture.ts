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

    await use(context);
    await context.close();
  },

  mobilePage: async ({ mobileContext }, use) => {
    const page = await mobileContext.newPage();

    // Attach listener to the page AFTER creation
    attachBlankTabAutoClose(page, 150);

    await use(page);
    await page.close();
  },
});