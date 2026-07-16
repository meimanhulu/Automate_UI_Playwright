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
    this.btnProfile = page.locator(S.btnProfile);
    
    // ✅ FIX 1: Hindari generic selector 'button:has-text("Log Out")' yang memicu strict mode violation.
    // Aplikasi Vue sering men-render komponen duplikat untuk mode desktop/mobile.
    // Kita pastikan mencari role button yang persis bernama 'Log Out', dan di-scope 
    // secara spesifik (misalnya dalam konteks header atau struktur utama agar unik).
    // Karena kita tidak tahu persis class dropdownnya, kita chained ke parent yg umum.
    this.btnLogout = page.locator('#main-content, header, .dropdown, [role="menu"]')
                         .getByRole('button', { name: 'Log Out', exact: true })
                         .first(); // Memastikan strict-mode violation tidak terjadi
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
        { timeout: 15_000 }
      ),

      // Fail fast: kalau muncul error message, langsung throw
      errorLocator.waitFor({ state: 'visible', timeout: 15_000 }).then(() => {
        throw new Error(
          `[Login Failed] App menampilkan error: "Failed to store the permission" — ` +
          `kemungkinan browser permission/storage issue atau credentials salah.`
        );
      }),
    ]);
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
    await this.btnProfile.click();
    
    await Promise.all([
      this.page.waitForURL('**/login', { timeout: 15_000 }),
      this.btnLogout.click()
    ]);
  }
}
