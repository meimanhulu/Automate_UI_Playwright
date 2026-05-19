// pages/BasePage.ts

import { Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `results/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  async waitForLoading(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getText(selector: string): Promise<string> {
    const el = this.page.locator(selector);
    return (await el.textContent()) || '';
  }
}