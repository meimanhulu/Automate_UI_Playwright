/**
 * @file qris-payment.spec.ts
 * @description End-to-end QRIS Payment flow test using QrisPaymentPage POM.
 *
 * Flow (repeated N_ITERATIONS times):
 *  1. Fill the order form via QrisPaymentPage.fillAndSubmit()
 *  2. Capture popup (window.open via PgScriptSDK)
 *  3. Wait for Transaction ID in popup #transaction-id (via postMessage)
 *  4. Call Alto payment API — throws & stops test immediately on failure
 *  5. Wait for "Pembayaran Berhasil" in popup #main-content
 *  6. Click "Tutup" → wait for popup to close
 *  7. Bring main page to front, wait for reload, repeat
 *
 * URL: https://uat-manjo.mitrapembayaran.com/ (no login required)
 * Selectors verified against live DOM + PgScriptSDK source (2026-05-26).
 */

import { test, expect, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import { QrisPaymentPage } from '../pages/QrisPaymentPage';
import { payQrisTransaction } from './helpers/qris-api.helper';
import paymentData from '../data/qris-payment-data.json';

dotenv.config();

// ─── Configuration ────────────────────────────────────────────────────────────

/** Number of payment iterations dynamically based on JSON test data. */
const N_ITERATIONS = paymentData.length;

/**
 * Max time (ms) to wait for "Pembayaran Berhasil" after the payment API call.
 * The SDK polls /check-status/<id> until status === 5, then calls showFinalUI().
 */
const PAYMENT_SUCCESS_TIMEOUT_MS = 60_000;

/**
 * Time (ms) to wait between iterations — lets the main page settle
 * after the SDK's onSuccess triggers window.location.reload().
 */
const BETWEEN_ITERATION_DELAY_MS = 3_000;

// ─── Helper: extract Transaction ID from the SDK popup ────────────────────────

/**
 * Waits for and extracts the Transaction ID from the SDK popup window.
 *
 * The SDK writes the popup via document.write() with:
 *   <div id="transaction-id"></div>   ← starts empty
 *
 * After startProcess() resolves, it sends a postMessage to the popup:
 *   { type: 'SET_TRANSACTION_ID', transactionId: '...' }
 *
 * The popup script fills the div:
 *   txIdElement.innerHTML = 'ID Transaksi: ' + transactionId;
 *
 * We wait for the div to be non-empty, then parse the ID after the colon.
 */
async function extractTransactionId(popup: Page): Promise<string> {
  // Confirmed HTML:
  //   <div id="transaction-id" class="mt-4 text-center text-xs text-gray-500">
  //     ID Transaksi: z091ek6qq8kq4d3h9k6rfzcd
  //   </div>
  // The div exists in DOM from the start but is EMPTY until the SDK sends
  // a postMessage { type: 'SET_TRANSACTION_ID', transactionId: '...' }.
  const txnDiv = popup.locator('#transaction-id');

  // Step 1: wait for element to be attached (it starts hidden/empty)
  await txnDiv.waitFor({ state: 'attached', timeout: 30_000 });

  // Step 2: wait until the postMessage text has actually arrived
  await expect(txnDiv).not.toBeEmpty({ timeout: 30_000 });

  const fullText = (await txnDiv.innerText()).trim();
  // Expected: "ID Transaksi: <id>"
  const colonIdx = fullText.indexOf(':');
  if (colonIdx === -1) {
    throw new Error(
      `Cannot parse Transaction ID from popup text: "${fullText}". ` +
      'Expected "ID Transaksi: <id>"',
    );
  }

  const transactionId = fullText.substring(colonIdx + 1).trim();
  if (!transactionId) {
    throw new Error(`Transaction ID is empty. Full popup text: "${fullText}"`);
  }
  return transactionId;
}

// ─── Test ─────────────────────────────────────────────────────────────────────

test.describe('QRIS Payment Flow', () => {

  test(`Run ${N_ITERATIONS} QRIS payment iterations`, async ({ page, context }) => {

    const qrisPage = new QrisPaymentPage(page);

    // ── Navigate ──────────────────────────────────────────────────────────
    await test.step('Navigate to QRIS Payment page', async () => {
      console.log(`\n[QRIS] 🌐 Opening ${process.env['APP_URL'] ?? 'https://uat-manjo.mitrapembayaran.com/'}`);
      await qrisPage.goto();
      await qrisPage.expectFormVisible();
      console.log('[QRIS] ✅ Page loaded — form visible');
    });

    interface ActiveTransaction {
      i: number;
      data: any;
      popup: Page;
      transactionId: string;
    }
    const activeTransactions: ActiveTransaction[] = [];

    // ── Phase 1: Batch Generation ─────────────────────────────────────────────
    for (let i = 1; i <= N_ITERATIONS; i++) {
      const currentData = paymentData[i - 1];
      console.log(`\n[QRIS] ════════ PHASE 1: GENERATION - ITERATION ${i} / ${N_ITERATIONS} ════════`);
      console.log(`[QRIS] [${i}] 👤 Buyer : ${currentData.namaPembeli}`);
      console.log(`[QRIS] [${i}] 📦 Item  : ${currentData.namaItem}`);
      console.log(`[QRIS] [${i}] 💰 Amount: Rp ${currentData.jumlah}`);

      // ── Step 1: Fill form & capture popup ──────────
      let popup!: Page;
      await test.step(`[${i}] Phase 1: Fill form & capture popup`, async () => {
        await page.bringToFront();
        console.log(`[QRIS] [${i}] 📝 Filling form and clicking "Buat Order & Bayar →"…`);
        popup = await qrisPage.fillAndSubmit(context, currentData);
        console.log(`[QRIS] [${i}] 🪟 Popup opened (url: ${popup.url()})`);

        // Confirm popup shell is ready (#main-content is the SDK's root div)
        await expect(popup.locator('#main-content')).toBeVisible({ timeout: 15_000 });
        console.log(`[QRIS] [${i}] ✅ Popup #main-content visible`);
      });

      // ── Step 2: Wait for QR code to render ──────────────────────────────────
      await test.step(`[${i}] Phase 1: Wait for QR code to render`, async () => {
        // Bring popup to front so its JS timers are NOT throttled
        // while other browser windows are open in parallel.
        await popup.bringToFront();
        console.log(`[QRIS] [${i}] ⏳ Waiting 3 seconds for the system to load and fetch the Transaction ID.`);
        // Brief pause so the SDK finishes calling startProcess() and the QR
        // is fully rendered before we capture the transaction ID.
        await popup.waitForTimeout(3_000);

        // Verify the QR code container is present
        const qrContainer = popup.locator('#qris-container img, #qris-container canvas').first();
        await expect(qrContainer).toBeAttached({ timeout: 15_000 });
        console.log(`[QRIS] [${i}] 🔲 QR code rendered`);
      });

      // ── Step 3: Extract Transaction ID ──────────────────────────────────────
      let transactionId!: string;
      await test.step(`[${i}] Phase 1: Extract Transaction ID`, async () => {
        transactionId = await extractTransactionId(popup);
        console.log(`[QRIS] [${i}] 🔑 Transaction ID: ${transactionId}`);
      });

      activeTransactions.push({ i, data: currentData, popup, transactionId });

      // Return to main page for the next generation iteration
      if (i < N_ITERATIONS) {
        await test.step(`[${i}] Phase 1: Return to main page`, async () => {
          await page.bringToFront();
          console.log(`[QRIS] [${i}] 🏠 Main page back in focus`);
          await expect(page.locator('h1', { hasText: 'QRIS Payment' })).toBeVisible({ timeout: 10_000 });
          
          console.log(`[QRIS] [${i}] ⏸️  Waiting ${BETWEEN_ITERATION_DELAY_MS}ms before generating next QR…`);
          await page.waitForTimeout(BETWEEN_ITERATION_DELAY_MS);
          
          await qrisPage.waitForForm();
        });
      }
    }

    // ── Phase 2: Batch Payment ────────────────────────────────────────────────
    for (const txn of activeTransactions) {
      const { i, data: currentData, popup, transactionId } = txn;
      console.log(`\n[QRIS] ════════ PHASE 2: PAYMENT - ITERATION ${i} / ${N_ITERATIONS} ════════`);

      // ── Step 4: Call Alto payment API ──────────────────────────────────────
      await test.step(`[${i}] Phase 2: Call Alto payment API`, async () => {
        console.log(`[QRIS] [${i}] ⏸️  Waiting 3 seconds before making the payment API call.`);
        await page.waitForTimeout(3_000);

        console.log(`[QRIS] [${i}] 💳 Calling payment API — txn: ${transactionId} | amount: Rp ${currentData.jumlah}.`);

        const result = await payQrisTransaction(transactionId, currentData.jumlah);

        // Logged only on success (response_code === "001")
        console.log(
          `[QRIS] [${i}] ✅ Payment API success — ` +
          `code: ${result.body.response_code} | ` +
          `text: ${result.body.response_text} | ` +
          `invoice: ${result.body.data?.invoice_no ?? 'N/A'}`
        );
      });

      // ── Step 5: Wait for "Pembayaran Berhasil" in popup ───────────────────
      await test.step(`[${i}] Phase 2: Wait for "Pembayaran Berhasil" in popup`, async () => {
        // Keep the popup window in focus so its JS polling timers
        // are NOT throttled by the OS/browser while running multi-browser.
        await popup.bringToFront();

        // Record start time
        const startTime = Date.now();
        console.log(`[QRIS] [${i}] ⏳ Waiting dynamically for SDK to detect payment & show "Pembayaran Berhasil"…`);

        // Wait for the success heading
        await expect(
          popup.locator('h2.text-green-600', { hasText: 'Pembayaran Berhasil' })
        ).toBeVisible({ timeout: PAYMENT_SUCCESS_TIMEOUT_MS });

        const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[QRIS] [${i}] ✅ "Pembayaran Berhasil" confirmed! SDK responded dynamically in ${elapsedSec}s`);
      });

      // ── Step 6: Click "Tutup" ──────────────────────────────────────────────
      await test.step(`[${i}] Phase 2: Click "Tutup" & wait for popup to close`, async () => {
        // Confirmed selector (from live DOM):
        const tutupBtn = popup.locator('button[onclick="window.close()"]');

        if (await tutupBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
          console.log(`[QRIS] [${i}] 🔘 Clicking "Tutup"…`);
          const startTime = Date.now();
          try {
            const closedPromise = popup.waitForEvent('close', { timeout: 10_000 });
            await tutupBtn.click();
            await closedPromise;
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`[QRIS] [${i}] 🪟 Popup closed after ${elapsed}s`);
          } catch {
            console.log(`[QRIS] [${i}] ⚠️  Popup did not close after click — closing manually`);
            await popup.close();
          }
        } else {
          console.log(`[QRIS] [${i}] ⚠️  Tutup button not visible — closing popup manually`);
          await popup.close();
        }
      });

      // ── Step 7: Return to main page ───────────────────────────────────────
      await test.step(`[${i}] Phase 2: Return to main page`, async () => {
        await page.bringToFront();
        console.log(`[QRIS] [${i}] 🏠 Main page back in focus`);

        // Validation: confirm we are on the main page by checking the page heading
        await expect(
          page.locator('h1', { hasText: 'QRIS Payment' })
        ).toBeVisible({ timeout: 10_000 });
        console.log(`[QRIS] [${i}] ✅ Back on main page — <h1>QRIS Payment</h1> visible`);

        if (i < N_ITERATIONS) {
          console.log(`[QRIS] [${i}] ⏸️  Waiting ${BETWEEN_ITERATION_DELAY_MS}ms before next iteration…`);
          await page.waitForTimeout(BETWEEN_ITERATION_DELAY_MS);

          // SDK's onSuccess triggers window.location.reload() on the main page
          await page.waitForLoadState('networkidle');
          await qrisPage.waitForForm();
          console.log(`[QRIS] [${i}] ✅ Main page reloaded — ready for next iteration`);
        }
      });

      console.log(`[QRIS] [${i}] ✅ Phase 2 Iteration ${i} COMPLETE`);
    }

    console.log(`\n[QRIS] 🏁 All ${N_ITERATIONS} iterations completed successfully!`);
  });

});
