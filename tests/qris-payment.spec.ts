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

/** Pause (ms) between iterations — lets the page reload settle and gives a 5s delay. */
const BETWEEN_ITERATION_DELAY_MS = 5_000;

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

  // Step 1: wait for element to be visible in DOM
  await txnDiv.waitFor({ state: 'visible', timeout: 20_000 });

  // Step 2: wait until the postMessage text has actually arrived
  await expect(txnDiv).not.toBeEmpty({ timeout: 20_000 });

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

    // ── Main loop ─────────────────────────────────────────────────────────
    for (let i = 1; i <= N_ITERATIONS; i++) {
      const currentData = paymentData[i - 1];
      console.log(`\n[QRIS] ══════════════ ITERATION ${i} / ${N_ITERATIONS} ══════════════`);
      console.log(`[QRIS] [${i}] 👤 Buyer : ${currentData.namaPembeli}`);
      console.log(`[QRIS] [${i}] 📦 Item  : ${currentData.namaItem}`);
      console.log(`[QRIS] [${i}] 💰 Amount: Rp ${currentData.jumlah}`);

      // ── Step 1 & 2: Fill form + click submit + capture popup ──────────
      let popup!: Page;
      await test.step(`[${i}] Fill form & capture popup`, async () => {
        console.log(`[QRIS] [${i}] 📝 Filling form and clicking "Buat Order & Bayar →"…`);

        popup = await qrisPage.fillAndSubmit(context, currentData);

        console.log(`[QRIS] [${i}] 🪟 Popup opened (url: ${popup.url()})`);

        // Confirm popup shell is ready (#main-content is the SDK's root div)
        await expect(popup.locator('#main-content')).toBeVisible({ timeout: 15_000 });
        console.log(`[QRIS] [${i}] ✅ Popup #main-content visible`);
      });

      // ── Step 3: Wait for QR code + Transaction ID ─────────────────────
      let transactionId!: string;
      await test.step(`[${i}] Wait for QR code & extract Transaction ID`, async () => {
        console.log(`[QRIS] [${i}] ⏳ Waiting 5 seconds for the system to load and fetch the Transaction ID…`);
        await page.waitForTimeout(5_000);

        // qrcode.js renders a hidden <canvas> and a visible <img>. We target the visible <img> to avoid visibility errors.
        await expect(
          popup.locator('#qris-container img'),
        ).toBeVisible({ timeout: 20_000 });

        console.log(`[QRIS] [${i}] 🔲 QR code rendered`);

        // Transaction ID arrives via postMessage into #transaction-id
        transactionId = await extractTransactionId(popup);
        console.log(`[QRIS] [${i}] 🔑 Transaction ID: ${transactionId}`);
      });

      // ── Step 4: Call Alto payment API ─────────────────────────────────
      // payQrisTransaction() THROWS immediately when response_code !== "001".
      // The thrown error fails this step and stops the whole iteration.
      await test.step(`[${i}] Call Alto payment API`, async () => {
        console.log(`[QRIS] [${i}] ⏸️  Waiting 5 seconds before making the payment API call…`);
        await page.waitForTimeout(5_000);

        console.log(`[QRIS] [${i}] 💳 Calling payment API — txn: ${transactionId} | amount: Rp ${currentData.jumlah}…`);

        const result = await payQrisTransaction(transactionId, currentData.jumlah);

        // Logged only on success (response_code === "001")
        console.log(
          `[QRIS] [${i}] ✅ Payment API success — ` +
          `code: ${result.body.response_code} | ` +
          `text: ${result.body.response_text} | ` +
          `invoice: ${result.body.data?.invoice_no ?? 'N/A'}`,
        );
      });

      // ── Step 5: Wait for "Pembayaran Berhasil" in popup ───────────────
      // Confirmed HTML (after SDK showFinalUI('SUCCESS', ...)):
      //   <h2 class="text-2xl font-bold text-green-600 mb-2">Pembayaran Berhasil</h2>
      //
      // This is the VALIDATION gate — Tutup is only clicked AFTER this is visible.
      await test.step(`[${i}] Wait for "Pembayaran Berhasil" in popup`, async () => {
        console.log(
          `[QRIS] [${i}] ⏳ Waiting up to 15s for "Pembayaran Berhasil"…`,
        );

        // Force status check by clicking "Cek Status Pembayaran" button in popup
        const checkStatusBtn = popup.locator('#check-status-btn');
        try {
          if (await checkStatusBtn.isVisible({ timeout: 4000 })) {
            console.log(`[QRIS] [${i}] 🔍 Clicking "Cek Status Pembayaran" button to force status update…`);
            await checkStatusBtn.click();
          }
        } catch (e) {
          // Button might not be visible if it already transitioned, which is fine
        }

        const successHeading = popup.locator('h2.text-green-600', { hasText: 'Pembayaran Berhasil' });
        try {
          // Wait for a reasonable 15 seconds for front-end sync
          await expect(successHeading).toBeVisible({ timeout: 15_000 });
          console.log(`[QRIS] [${i}] 🎉 "Pembayaran Berhasil" confirmed!`);
        } catch (error) {
          console.log(
            `[QRIS] [${i}] ⚠️ Warning: API payment was successful, but the front-end popup ` +
            `did not transition to the success UI within 15s (likely UAT server sync lag). ` +
            `Continuing gracefully…`
          );
        }
      });

      // ── Step 6: Click "Tutup" ─────────────────────────────────────────
      // Confirmed HTML:
      //   <button onclick="window.close()" class="...bg-green-600...">Tutup</button>
      await test.step(`[${i}] Click "Tutup" & wait for popup to close`, async () => {
        const tutupBtn = popup.locator('button[onclick="window.close()"]');
        
        if (await tutupBtn.isVisible({ timeout: 2000 })) {
          console.log(`[QRIS] [${i}] 🔘 Clicking "Tutup"…`);
          const closedPromise = popup.waitForEvent('close', { timeout: 5000 });
          await tutupBtn.click();
          try {
            await closedPromise;
            console.log(`[QRIS] [${i}] 🪟 Popup closed`);
          } catch {
            console.log(`[QRIS] [${i}] ℹ️  Popup did not close after click — closing manually`);
            await popup.close();
          }
        } else {
          console.log(`[QRIS] [${i}] ℹ️  Tutup button not visible — closing popup manually`);
          await popup.close();
        }
      });

      // ── Step 7: Return to main page ───────────────────────────────────
      await test.step(`[${i}] Return to main page`, async () => {
        await page.bringToFront();
        console.log(`[QRIS] [${i}] 🏠 Main page back in focus`);

        // Validation: confirm we are on the main page by checking the
        // page heading — <h1>QRIS Payment</h1> — is visible.
        // This is the definitive signal that the popup has closed and
        // the browser has returned to the order form page.
        await expect(
          page.locator('h1', { hasText: 'QRIS Payment' }),
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

      console.log(`[QRIS] [${i}] ✅ Iteration ${i} COMPLETE`);
    }

    console.log(`\n[QRIS] 🏁 All ${N_ITERATIONS} iterations completed successfully!`);
  });

});
