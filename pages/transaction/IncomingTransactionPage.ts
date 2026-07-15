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
  readonly filterStatus: Locator;
  readonly btnApplyFilter: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = S.pageHeading
      ? page.locator(S.pageHeading)
      : page.getByRole('heading', { name: /incoming transaction/i });
      
    this.tableContainer = S.tableContainer
      ? page.locator(S.tableContainer)
      : page.locator('table').first();

    // Menggunakan Web-First Assertions & Accessible locators untuk menghindari kerapuhan (brittle tests)
    this.btnExportIcon = S.btnExportIcon
      ? page.locator(S.btnExportIcon)
      : page.locator('button').filter({ has: page.locator('svg.iconify--ph') }).first();

    this.menuExportThisPage = S.menuExportThisPage
      ? page.locator(S.menuExportThisPage)
      : page.getByText(/download this page/i);

    this.menuExportAllPage = S.menuExportAllPage
      ? page.locator(S.menuExportAllPage)
      : page.getByText(/download all page/i);

    this.toastExportStarted = S.toastExportStarted
      ? page.locator(S.toastExportStarted)
      : page.getByText(/export started/i);

    this.filterStatus = S.filterStatus
      ? page.locator(S.filterStatus)
      : page.getByRole('combobox', { name: /status/i });

    this.btnApplyFilter = S.btnApplyFilter
      ? page.locator(S.btnApplyFilter)
      : page.getByRole('button', { name: /apply/i });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async gotoViaSidebar(): Promise<void> {
    const transactionNav = new TransactionSidebarPage(this.page);
    await transactionNav.expandTransactionMenu();
    await transactionNav.goToIncoming();
    await this.expectPageLoaded('Incoming Transaction');
  }
}
