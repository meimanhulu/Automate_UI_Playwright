/**
 * @file TenantSidebarPage.ts
 * @description Page Object Model untuk navigasi sidebar modul Tenant di Poppay.
 *
 * Struktur sidebar (dari UI screenshot):
 *   ├── Dashboard
 *   ├── Master
 *   ├── Integration
 *   ├── Access Management
 *   ├── Tenant  ← collapsible parent
 *   │   ├── Aggregate
 *   │   ├── Merchant          ← navigasi utama untuk Create Merchant flow
 *   │   ├── Account Recipient
 *   │   └── Merchant Account
 *   ├── User Management
 *   ├── Transaction
 *   ├── Log
 *   └── Settings
 *
 * Penggunaan:
 *   const tenantNav = new TenantSidebarPage(page);
 *   await tenantNav.goToMerchant();   // expand Tenant → klik Merchant
 *
 * Locator priority (COPILOT_INSTRUCTIONS.md):
 *   getByRole > getByLabel > getByTestId > CSS (last resort)
 *
 * ⚠️  Isi selector di:
 *       selectors/tenant/tenant-sidebar.selector.ts
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { TenantSidebarSelector as S } from '../../selectors/tenant/tenant-sidebar.selector';

// ── Tipe sub-menu Tenant ───────────────────────────────────────────────────────
export type TenantSubMenu =
  | 'Aggregate'
  | 'Merchant'
  | 'Account Recipient'
  | 'Merchant Account';

// ── Page Object ────────────────────────────────────────────────────────────────

export class TenantSidebarPage extends BasePage {

  // ── Locators ───────────────────────────────────────────────────────────────

  /** Item menu "Tenant" di sidebar (collapsible) */
  readonly menuTenant: Locator;

  /** Sub-menu "Aggregate" */
  readonly subMenuAggregate: Locator;

  /** Sub-menu "Merchant" — navigasi utama dalam Create Merchant flow */
  readonly subMenuMerchant: Locator;

  /** Sub-menu "Account Recipient" */
  readonly subMenuAccountRecipient: Locator;

  /** Sub-menu "Merchant Account" */
  readonly subMenuMerchantAccount: Locator;

  // ── Constructor ────────────────────────────────────────────────────────────

  constructor(page: Page) {
    super(page);

    // Menu parent "Tenant"
    this.menuTenant = S.menuTenant
      ? page.locator(S.menuTenant)
      : page.getByRole('menuitem', { name: /^tenant$/i })
          .or(page.locator('nav').getByText('Tenant', { exact: true }))
          .or(page.locator('li').filter({ hasText: /^Tenant$/ }).first());

    // Sub-menu items
    this.subMenuAggregate = S.subMenuAggregate
      ? page.locator(S.subMenuAggregate)
      : page.getByRole('link', { name: /^aggregate$/i })
          .or(page.locator('a').filter({ hasText: /^Aggregate$/ }));

    this.subMenuMerchant = S.subMenuMerchant
      ? page.locator(S.subMenuMerchant)
      : page.getByRole('link', { name: /^merchant$/i })
          .or(page.locator('a').filter({ hasText: /^Merchant$/ }));

    this.subMenuAccountRecipient = S.subMenuAccountRecipient
      ? page.locator(S.subMenuAccountRecipient)
      : page.getByRole('link', { name: /account recipient/i });

    this.subMenuMerchantAccount = S.subMenuMerchantAccount
      ? page.locator(S.subMenuMerchantAccount)
      : page.getByRole('link', { name: /merchant account/i });
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Klik menu "Tenant" untuk expand sub-menu.
   * Jika sudah expand, tidak ada efek negatif (idempotent).
   */
  async expandTenantMenu(): Promise<void> {
    // Cek apakah sub-menu Merchant sudah visible — jika sudah, skip klik
    const isAlreadyExpanded = await this.subMenuMerchant.isVisible().catch(() => false);
    if (!isAlreadyExpanded) {
      await this.menuTenant.click();
    }
  }

  /**
   * Navigasi ke sub-menu "Merchant" di bawah Tenant.
   * Method ini:
   *   1. Expand menu Tenant (jika belum)
   *   2. Klik sub-menu "Merchant"
   *   3. Tunggu navigasi selesai
   */
  async goToMerchant(): Promise<void> {
    await this.expandTenantMenu();
    await this.expectSubMenuMerchantVisible();
    await this.subMenuMerchant.click();
    await this.waitForLoading();
    // Jeda 2.5 detik untuk memperlambat eksekusi secara visual
    await this.page.waitForTimeout(2500);
  }

  /**
   * Navigasi ke sub-menu "Aggregate" di bawah Tenant.
   */
  async goToAggregate(): Promise<void> {
    await this.expandTenantMenu();
    await this.subMenuAggregate.click();
    await this.waitForLoading();
    // Jeda 2.5 detik untuk memperlambat eksekusi secara visual
    await this.page.waitForTimeout(2500);
  }

  /**
   * Navigasi ke sub-menu "Account Recipient" di bawah Tenant.
   */
  async goToAccountRecipient(): Promise<void> {
    await this.expandTenantMenu();
    await this.subMenuAccountRecipient.click();
    await this.waitForLoading();
    // Jeda 2.5 detik untuk memperlambat eksekusi secara visual
    await this.page.waitForTimeout(2500);
  }

  /**
   * Navigasi ke sub-menu "Merchant Account" di bawah Tenant.
   */
  async goToMerchantAccount(): Promise<void> {
    await this.expandTenantMenu();
    await this.subMenuMerchantAccount.click();
    await this.waitForLoading();
    // Jeda 2.5 detik untuk memperlambat eksekusi secara visual
    await this.page.waitForTimeout(2500);
  }

  /**
   * Navigasi ke sub-menu Tenant tertentu berdasarkan nama.
   *
   * @param subMenu - nama sub-menu Tenant yang dituju
   */
  async goTo(subMenu: TenantSubMenu): Promise<void> {
    switch (subMenu) {
      case 'Aggregate':         await this.goToAggregate();        break;
      case 'Merchant':          await this.goToMerchant();         break;
      case 'Account Recipient': await this.goToAccountRecipient(); break;
      case 'Merchant Account':  await this.goToMerchantAccount();  break;
    }
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Pastikan menu "Tenant" terlihat di sidebar.
   */
  async expectTenantMenuVisible(): Promise<void> {
    await expect(
      this.menuTenant,
      'Sidebar: menu "Tenant" harus tampil di sidebar navigasi',
    ).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Pastikan sub-menu "Merchant" tampil setelah Tenant di-expand.
   */
  async expectSubMenuMerchantVisible(): Promise<void> {
    await expect(
      this.subMenuMerchant,
      'Sidebar Tenant: sub-menu "Merchant" harus tampil setelah menu Tenant di-expand',
    ).toBeVisible({ timeout: 8_000 });
  }

  /**
   * Pastikan sub-menu Tenant sudah expand (semua sub-item terlihat).
   */
  async expectTenantMenuExpanded(): Promise<void> {
    await expect(
      this.subMenuMerchant,
      'Sidebar Tenant: sub-menu harus expand dan Merchant terlihat',
    ).toBeVisible({ timeout: 8_000 });
  }
}
