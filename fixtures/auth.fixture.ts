import { test as base } from '@playwright/test';
import { LoginLogoutPage } from '../pages/LoginLogoutPage';

/**
 * Fixture ini menimpa (override) fixture `page` bawaan Playwright.
 * Secara otomatis:
 * 1. Menjalankan Login sebelum skenario test dieksekusi.
 * 2. Menjalankan Logout setelah skenario test dieksekusi (berjalan meskipun test error).
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // ─── SETUP: Auto Login ──────────────────────────────────────────────────
    const loginLogoutPage = new LoginLogoutPage(page);
    await loginLogoutPage.goto();
    
    // Gunakan kredensial yang diberikan, atau fallback ke default
    const email = process.env.E2E_USERNAME || 'ryland@manjo.co.id';
    const password = process.env.E2E_PASSWORD || 'Ryland2026';
    
    await loginLogoutPage.login(email, password);
    await loginLogoutPage.expectLoginSuccess();

    // ─── EXECUTE: Jalankan Skenario Test Utama ──────────────────────────────
    await use(page);

    // ─── TEARDOWN: Auto Logout ──────────────────────────────────────────────
    // Bagian ini SELALU dieksekusi setelah test selesai/gagal.
    // Tambahkan block try-catch agar jika logout gagal (karena session expire duluan, dll), 
    // test utama tidak tercatat sebagai error tambahan yang menyesatkan.
    try {
      const loginLogoutPage = new LoginLogoutPage(page);
      await loginLogoutPage.logout();
    } catch (e) {
      console.warn('Auto-logout failed during teardown:', e);
    }
  },
});

export { expect } from '@playwright/test';