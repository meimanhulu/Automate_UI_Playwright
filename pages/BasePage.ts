// pages/BasePage.ts

import { Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForLoading(): Promise<void> {
    // Hindari menggunakan 'networkidle' karena sering menyebabkan flaky test di SPA/VueJS
    // Tunggu hingga elemen loading spinner (jika ada) menghilang dari layar
    await this.page.locator('.loading-spinner').waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }
}