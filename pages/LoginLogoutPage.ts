import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginLogoutSelector as S } from '../selectors/login-logout.selector';

export class LoginLogoutPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly btnProfile: Locator;
  readonly btnLogout: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator(S.emailInput);
    this.passwordInput = page.locator(S.passwordInput);
    this.submitButton = page.locator(S.submitButton);
    this.btnProfile = page.locator(S.btnProfile).first();
    this.btnLogout = page.locator(S.btnLogout).last();
  }

  // ─── LOGIN ─────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/login');
  }

  async open(): Promise<void> {
    await this.goto();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    await this.submitButton.click();

    // Fix #2: Detect login error SEBELUM timeout habis (fail fast)
    const errorLocator = this.page.locator('text=Failed to store the permission');

    await Promise.race([
      // Happy path: navigasi keluar dari /login
      this.page.waitForURL(
        (url) => !url.pathname.includes('login'),
        { timeout: 20_000 }
      ),

      // Fail fast: kalau muncul error message, langsung throw
      errorLocator.waitFor({ state: 'visible', timeout: 15_000 }).then(() => {
        throw new Error(
          `[Login Failed] App menampilkan error: "Failed to store the permission" — ` +
          `kemungkinan browser permission/storage issue atau credentials salah.`
        );
      }),
    ]);

    // Wait for session to be fully committed before proceeding
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 });
  }

  async expectLoginSuccess(): Promise<void> {
    // URL change is already handled in login(), just wait for DOM readiness
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ─── LOGOUT ────────────────────────────────────────────────────────────

  /**
   * Melakukan logout dari aplikasi
   */
  async logout(): Promise<void> {
    // Click profile to open dropdown
    await this.btnProfile.evaluate((el) => (el as HTMLElement).click());
    
    // Wait for logout button to appear and click it
    await this.btnLogout.waitFor({ state: 'visible', timeout: 5000 });
    await this.btnLogout.evaluate((el) => (el as HTMLElement).click());
    
    // Wait for redirect to login page (confirms logout succeeded)
    await this.page.waitForURL('**/login', { timeout: 10_000 });
  }
}
