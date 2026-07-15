import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { TransactionSidebarSelector as S } from '../../selectors/transaction/transaction-sidebar.selector';

export type TransactionSubMenu = 'Incoming' | 'Outgoing';

export class TransactionSidebarPage extends BasePage {
  readonly menuTransaction: Locator;
  readonly subMenuIncoming: Locator;
  readonly subMenuOutgoing: Locator;

  constructor(page: Page) {
    super(page);
    this.menuTransaction = page.locator(S.menuTransaction);
    this.subMenuIncoming = page.locator(S.subMenuIncoming);
    this.subMenuOutgoing = page.locator(S.subMenuOutgoing);
  }

  async expandTransactionMenu(): Promise<void> {
    const isExpanded = await this.subMenuIncoming.isVisible().catch(() => false);
    if (!isExpanded) {
      await this.menuTransaction.click();
    }
  }

  async goToIncoming(): Promise<void> {
    await this.expandTransactionMenu();
    await this.subMenuIncoming.click();
    await this.waitForLoading();
    // Jeda 2.5 detik untuk memperlambat eksekusi secara visual sesuai permintaan
    await this.page.waitForTimeout(2500);
  }

  async goToOutgoing(): Promise<void> {
    await this.expandTransactionMenu();
    await this.subMenuOutgoing.click();
    await this.waitForLoading();
    // Jeda 2.5 detik untuk memperlambat eksekusi secara visual sesuai permintaan
    await this.page.waitForTimeout(2500);
  }

  async goTo(subMenu: TransactionSubMenu): Promise<void> {
    switch (subMenu) {
      case 'Incoming': await this.goToIncoming(); break;
      case 'Outgoing': await this.goToOutgoing(); break;
    }
  }

  async expectTransactionMenuVisible(): Promise<void> {
    await expect(this.menuTransaction).toBeVisible({ timeout: 10_000 });
  }

  async expectTransactionMenuExpanded(): Promise<void> {
    await expect(this.subMenuIncoming).toBeVisible({ timeout: 8_000 });
  }
}
