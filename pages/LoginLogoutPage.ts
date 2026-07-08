import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginLogoutSelector as S } from '../selectors/login-logout.selector';

export class LoginLogoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── LOGIN ─────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    const baseUrl = process.env.APP_URL || 'https://uat.pg-poppay.com/';
    const loginUrl = baseUrl.endsWith('/') ? baseUrl + 'login' : baseUrl + '/login';
    await this.navigate(loginUrl);
  }

  async open(): Promise<void> {
    await this.goto();
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.fill(S.emailInput, email);
    await this.page.fill(S.passwordInput, password);
    await this.page.click(S.submitButton);
  }

  async expectLoginSuccess(): Promise<void> {
    await this.page.waitForURL('**/dashboard');
  }

  // ─── LOGOUT ────────────────────────────────────────────────────────────

  /**
   * Melakukan logout dari aplikasi:
   * 1. Klik tombol Profile
   * 2. Klik Log Out
   * 3. Tunggu hingga kembali ke halaman login
   */
  async logout(): Promise<void> {
    // 1. Buka dropdown menu profile
    await this.page.click(S.btnProfile);
    
    // 2. Klik Log Out
    await this.page.click(S.btnLogout);
    
    // 3. Pastikan dikembalikan ke halaman login
    await this.page.waitForURL('**/login');
  }
}
