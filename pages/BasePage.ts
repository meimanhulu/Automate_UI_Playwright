// pages/BasePage.ts

import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = (process.env.APP_URL || 'https://uat.pg-poppay.com').replace(/\/$/, '');
  }

  async navigate(pathOrUrl: string): Promise<void> {
    const fullUrl = pathOrUrl.startsWith('http')
      ? pathOrUrl
      : `${this.baseUrl}${pathOrUrl}`;

    await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
  }

  async waitForLoading(): Promise<void> {
    const spinner = this.page.locator('.loading-spinner');
    await spinner.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }
}