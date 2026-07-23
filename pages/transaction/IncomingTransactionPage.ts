import { Page, Locator } from '@playwright/test';
import { BaseTransactionPage } from './BaseTransactionPage';
import { TransactionSidebarPage } from './TransactionSidebarPage';
import { IncomingTransactionSelector as S } from '../../selectors/transaction/incoming-transaction.selector';

export class IncomingTransactionPage extends BaseTransactionPage {
  
  readonly pageHeading: Locator;
  readonly tableContainer: Locator;
  readonly btnExportIcon: Locator;
  readonly menuExportThisPage: Locator;
  readonly menuExportAllPage: Locator;
  readonly toastExportStarted: Locator;
  readonly btnFilter: Locator;
  readonly filterStatus: Locator;
  readonly btnApplyFilter: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.locator(S.pageHeading);
    
    this.tableContainer = page.locator(S.tableContainer);

    this.btnExportIcon = page.locator(S.btnExportIcon);

    this.menuExportThisPage = page.locator(S.menuExportThisPage);

    this.menuExportAllPage = page.locator(S.menuExportAllPage);

    this.toastExportStarted = page.locator(S.toastExportStarted);

    this.btnFilter = page.locator(S.btnFilter);

    this.filterStatus = page.locator('[role="combobox"], .ant-select-selector, select, input[type="search"]').first();

    this.btnApplyFilter = page.locator(S.btnApplyFilter);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async gotoViaSidebar(): Promise<void> {
    const transactionNav = new TransactionSidebarPage(this.page);
    await transactionNav.expandTransactionMenu();
    await transactionNav.goToIncoming();
    await this.expectPageLoaded('Incoming Transaction');
  }
}
