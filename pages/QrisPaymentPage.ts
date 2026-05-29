// pages/QrisPaymentPage.ts

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for https://uat-manjo.mitrapembayaran.com/
 *
 * Selectors are verified against the live DOM (fetched 2026-05-26):
 *
 *   <form id="order-form" action="/orders" method="POST">
 *     <input id="customer_name"  type="text"   placeholder="Budi Santoso">
 *     <input id="customer_email" type="email"  placeholder="budi@example.com">
 *     <input id="item_name"      type="text"   placeholder="Paket Premium 1 Bulan">
 *     <input id="total_amount"   type="number" placeholder="50000" min="1000" required>
 *     <textarea id="notes"                     placeholder="Catatan tambahan...">
 *     <button type="submit" class="btn">Buat Order & Bayar →</button>
 *   </form>
 *
 * No login required — the page is publicly accessible.
 */
export class QrisPaymentPage extends BasePage {

  // ── Form locators (IDs from live DOM) ──────────────────────────────────────
  /** Text input: Nama Pembeli — id="customer_name" */
  readonly inputNamaPembeli: Locator;

  /** Email input: Email Pembeli — id="customer_email" */
  readonly inputEmailPembeli: Locator;

  /** Text input: Nama Item — id="item_name" */
  readonly inputNamaItem: Locator;

  /** Number input: Jumlah (Rp) — id="total_amount" min="1000" required */
  readonly inputJumlah: Locator;

  /** Textarea: Catatan (opsional) — id="notes" */
  readonly textareaCatatan: Locator;

  /** Submit button inside #order-form — type="submit" class="btn" */
  readonly btnBuatOrder: Locator;

  /** The form container itself — id="order-form" */
  readonly form: Locator;

  // ── Order list locators ────────────────────────────────────────────────────
  /** Scrollable list of recent orders — class="order-list" */
  readonly orderList: Locator;

  constructor(page: Page) {
    super(page);

    // Form fields
    this.inputNamaPembeli = page.locator('#customer_name');
    this.inputEmailPembeli = page.locator('#customer_email');
    this.inputNamaItem    = page.locator('#item_name');
    this.inputJumlah      = page.locator('#total_amount');
    this.textareaCatatan  = page.locator('#notes');
    this.btnBuatOrder     = page.locator('#order-form button[type="submit"]');
    this.form             = page.locator('#order-form');

    // Order list
    this.orderList = page.locator('.order-list');
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /**
   * Navigates to the QRIS payment page and waits until the form is ready.
   * No login required.
   *
   * @param url - Override the default URL (reads from APP_URL env if omitted)
   */
  async goto(url?: string): Promise<void> {
    const target = url
      ?? process.env['APP_URL']
      ?? 'https://uat-manjo.mitrapembayaran.com/';

    await this.page.goto(target);
    await this.waitForLoading();
    await this.waitForForm();
  }

  /**
   * Waits until the order form is visible — confirms the page is fully loaded.
   */
  async waitForForm(): Promise<void> {
    await expect(this.form).toBeVisible({ timeout: 10_000 });
  }

  // ── Form actions ───────────────────────────────────────────────────────────

  /**
   * Fills all fields of the "Buat Order Baru" form.
   *
   * @param data.namaPembeli  - Buyer name (default: "Budi Santoso")
   * @param data.emailPembeli - Buyer email (default: "budi@example.com")
   * @param data.namaItem     - Item name (default: "Paket Premium 1 Bulan")
   * @param data.jumlah       - Amount in Rp as string, min 1000 (default: "50000")
   * @param data.catatan      - Optional notes (default: "")
   */
  async fillForm(data: {
    namaPembeli?: string;
    emailPembeli?: string;
    namaItem?: string;
    jumlah?: string;
    catatan?: string;
  } = {}): Promise<void> {
    const {
      namaPembeli  = 'Budi Santoso',
      emailPembeli = 'budi@example.com',
      namaItem     = 'Paket Premium 1 Bulan',
      jumlah       = '50000',
      catatan      = '',
    } = data;

    await this.inputNamaPembeli.fill(namaPembeli);
    await this.inputEmailPembeli.fill(emailPembeli);
    await this.inputNamaItem.fill(namaItem);
    await this.inputJumlah.fill(jumlah);
    await this.textareaCatatan.fill(catatan);
  }

  /**
   * Clicks "Buat Order & Bayar →" and returns a Promise that resolves to the
   * popup Page when it opens.
   *
   * The SDK calls `window.open('', 'QRIS_Payment', ...)` on form submit, so
   * we use `context.waitForEvent('page')` — registered BEFORE the click to
   * avoid any race condition.
   *
   * @example
   * const popupPromise = qrisPage.submitAndWaitForPopup(context);
   * await qrisPage.btnBuatOrder.click();  // ← NOT needed, submitForm() does it
   * const popup = await popupPromise;
   */
  submitAndWaitForPopup(
    context: import('@playwright/test').BrowserContext,
  ): Promise<Page> {
    return context.waitForEvent('page');
  }

  /**
   * Fills the form with `data` and clicks submit, returning the popup Page.
   * This is the single combined action for one payment iteration.
   *
   * @param context - Playwright BrowserContext (needed for waitForEvent('page'))
   * @param data    - Form field values (all optional, defaults used if omitted)
   */
  async fillAndSubmit(
    context: import('@playwright/test').BrowserContext,
    data: Parameters<QrisPaymentPage['fillForm']>[0] = {},
  ): Promise<Page> {
    await this.fillForm(data);

    // Register BEFORE click — avoids race condition
    const popupPromise = this.submitAndWaitForPopup(context);
    await this.btnBuatOrder.click();

    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded');
    return popup;
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Asserts the form is visible (page loaded correctly).
   */
  async expectFormVisible(): Promise<void> {
    await expect(this.form).toBeVisible();
    await expect(this.btnBuatOrder).toBeVisible();
  }

  /**
   * Asserts the order list panel is visible.
   */
  async expectOrderListVisible(): Promise<void> {
    await expect(this.orderList).toBeVisible();
  }
}
