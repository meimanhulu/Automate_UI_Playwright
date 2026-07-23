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
    const container = this.page.locator('li[role="presentation"]:has(> div p:text-is("Transaction")) > ul');
    const isCollapsed = await container.evaluate((el) => el.classList.contains('max-h-0')).catch(() => false);
    
    if (isCollapsed) {
      // Scroll the sidebar menu item into view within its scrollable parent
      const menuItem = this.page.locator('li[role="presentation"]:has(p:text-is("Transaction"))');
      await menuItem.evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      
      // Click via JS evaluation to bypass viewport/visibility checks
      // (sidebar buttons can be outside viewport inside scrollable containers)
      await this.menuTransaction.evaluate((el) => (el as HTMLElement).click());
      await this.page.waitForTimeout(500); // Tunggu animasi expand
    }
  }

  async goToIncoming(): Promise<void> {
    await this.expandTransactionMenu();
    await this.subMenuIncoming.evaluate((el) => (el as HTMLElement).click());
    await this.page.waitForURL('**/incoming**', { timeout: 15_000 });
    await this.waitForLoading();
  }

  async goToOutgoing(): Promise<void> {
    await this.expandTransactionMenu();
    await this.subMenuOutgoing.evaluate((el) => (el as HTMLElement).click());
    await this.page.waitForURL('**/outgoing**', { timeout: 15_000 });
    await this.waitForLoading();
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
