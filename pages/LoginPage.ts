import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginSelector as S } from '../selectors/login.selector';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/login');
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

  async expectLoginError(message: string): Promise<void> {
    const error = this.page.locator(S.errorMessage);
    await expect(error).toBeVisible();
    await expect(error).toContainText(message);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(S.errorMessage);
  }
}