import { test as base } from '@playwright/test';
import { LoginLogoutPage } from '../pages/LoginLogoutPage';

/**
 * Fixture khusus untuk menguji aplikasi Poppay UAT.
 * URL di-hardcode ke https://uat.pg-poppay.com/login agar tidak berbenturan
 * dengan env APP_URL milik aplikasi Manjo / aplikasi lainnya.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // ─── SETUP: Auto Login ──────────────────────────────────────────────────
    const loginLogoutPage = new LoginLogoutPage(page);
    
    // Arahkan spesifik ke URL Poppay
    await loginLogoutPage.navigate('https://uat.pg-poppay.com/login');
    
    // Gunakan kredensial (bisa diatur via environment jika mau dinamis)
    const email = process.env.POPPAY_USERNAME || 'ryland@manjo.co.id';
    const password = process.env.POPPAY_PASSWORD || 'Ryland2026';
    
    await loginLogoutPage.login(email, password);
    await loginLogoutPage.expectLoginSuccess();

    // ─── EXECUTE: Jalankan Skenario Test Utama ──────────────────────────────
    await use(page);

    // ─── TEARDOWN: Auto Logout ──────────────────────────────────────────────
    try {
      // Jeda 3 detik sebelum logout agar bisa diamati
      await page.waitForTimeout(3000);
      const loginLogoutPage = new LoginLogoutPage(page);
      await loginLogoutPage.logout();
      // Jeda 2 detik agar user dapat melihat layar berhasil kembali ke halaman Login
      await page.waitForTimeout(2000);
      // Tutup browser secara eksplisit setelah semuanya selesai
      await page.close();
    } catch (e) {
      console.warn('Auto-logout failed during teardown:', e);
    }
  },
});

export { expect } from '@playwright/test';
