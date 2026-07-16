/**
 * DIAGNOSTIC TEST - Download Flow Instrumentation
 * 
 * Purpose: Identify the root cause of blank tabs during download operations
 * 
 * This test instruments all browser events to understand:
 * 1. How the frontend triggers downloads
 * 2. Whether window.open() is actually called
 * 3. What events fire in what order
 * 4. The actual download mechanism used
 * 
 * DO NOT use this test in production - it's for diagnosis only.
 */

import { test, expect } from '@playwright/test';
import { LoginLogoutPage } from '../../pages/LoginLogoutPage';
import { IncomingTransactionPage } from '../../pages/transaction/IncomingTransactionPage';
import { TopbarPage } from '../../pages/layout/TopbarPage';
import { DownloadsListPage } from '../../pages/downloads/DownloadsListPage';

test.describe('Download Flow Instrumentation @diagnostic', () => {
  let logs: string[] = [];

  function log(event: string, details?: any) {
    const timestamp = new Date().toISOString().split('T')[1];
    const message = `[${timestamp}] ${event}`;
    console.log(message, details || '');
    logs.push(message + (details ? ` | ${JSON.stringify(details)}` : ''));
  }

  test('Instrument all download scenarios', async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: 'https://uat.pg-poppay.com',
      acceptDownloads: true,
    });

    // ═══════════════════════════════════════════════════════════════════
    // INSTRUMENTATION LAYER 1: Context Events
    // ═══════════════════════════════════════════════════════════════════
    
    context.on('page', async (newPage) => {
      log('🔵 context.on("page") fired', {
        url: newPage.url(),
        isClosed: newPage.isClosed(),
      });

      // Track if this page changes URL
      newPage.on('framenavigated', (frame) => {
        if (frame === newPage.mainFrame()) {
          log('  ↳ New page navigated', { url: frame.url() });
        }
      });
    });

    const page = await context.newPage();
    log('✅ Main page created');

    // ═══════════════════════════════════════════════════════════════════
    // INSTRUMENTATION LAYER 2: Page Events
    // ═══════════════════════════════════════════════════════════════════

    page.on('popup', async (popup) => {
      log('🟢 page.on("popup") fired', {
        url: popup.url(),
        isClosed: popup.isClosed(),
      });

      // Track popup lifecycle
      popup.on('close', () => {
        log('  ↳ Popup closed', { finalUrl: popup.url() });
      });

      popup.on('framenavigated', (frame) => {
        if (frame === popup.mainFrame()) {
          log('  ↳ Popup navigated', { url: frame.url() });
        }
      });
    });

    page.on('download', (download) => {
      log('📥 page.on("download") fired', {
        filename: download.suggestedFilename(),
        url: download.url(),
      });
    });

    page.on('request', (request) => {
      const url = request.url();
      // Only log relevant requests (S3, download endpoints)
      if (
        url.includes('.csv') ||
        url.includes('download') ||
        url.includes('export') ||
        url.includes('amazonaws.com')
      ) {
        log('📤 Request', {
          method: request.method(),
          url: url.substring(0, 100),
          headers: request.headers()['content-disposition'],
        });
      }
    });

    page.on('response', (response) => {
      const url = response.url();
      // Only log relevant responses
      if (
        url.includes('.csv') ||
        url.includes('download') ||
        url.includes('export') ||
        url.includes('amazonaws.com')
      ) {
        log('📥 Response', {
          status: response.status(),
          url: url.substring(0, 100),
          contentType: response.headers()['content-type'],
          contentDisposition: response.headers()['content-disposition'],
        });
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // INSTRUMENTATION LAYER 3: window.open() Wrapper
    // ═══════════════════════════════════════════════════════════════════

    await page.addInitScript(() => {
      const originalOpen = window.open;
      
      // @ts-ignore - temporary diagnostic code
      window.open = function (url?: string | URL, target?: string, features?: string) {
        console.log('🔴 window.open() CALLED FROM APP', {
          url: url?.toString(),
          target,
          features,
          stack: new Error().stack?.split('\n')[2], // Capture caller
        });
        
        // Call original
        return originalOpen.call(window, url, target, features);
      };
    });

    // ═══════════════════════════════════════════════════════════════════
    // TEST SCENARIO 1: Login
    // ═══════════════════════════════════════════════════════════════════

    log('\n━━━ SCENARIO 1: Login ━━━');
    const loginPage = new LoginLogoutPage(page);
    await loginPage.navigate('https://uat.pg-poppay.com/login');
    await loginPage.login(
      process.env.POPPAY_USERNAME || 'ryland@manjo.co.id',
      process.env.POPPAY_PASSWORD || 'Ryland2026'
    );
    await loginPage.expectLoginSuccess();
    log('✅ Login successful');

    // ═══════════════════════════════════════════════════════════════════
    // TEST SCENARIO 2: Export This Page
    // ═══════════════════════════════════════════════════════════════════

    log('\n━━━ SCENARIO 2: Export This Page ━━━');
    const incomingPage = new IncomingTransactionPage(page);
    await incomingPage.gotoViaSidebar();
    log('✅ Navigated to Incoming Transaction page');

    await page.waitForTimeout(2000); // Let page stabilize
    log('⏳ Clicking "Export This Page"...');
    
    await incomingPage.exportThisPage();
    
    await page.waitForTimeout(3000); // Observe what happens
    log('✅ Export This Page completed');

    // ═══════════════════════════════════════════════════════════════════
    // TEST SCENARIO 3: Download from Recent Downloads
    // ═══════════════════════════════════════════════════════════════════

    log('\n━━━ SCENARIO 3: Download from Recent Downloads ━━━');
    const topbarPage = new TopbarPage(page);
    
    await page.waitForTimeout(5000); // Wait for export to process
    log('⏳ Opening Recent Downloads popup...');
    
    await topbarPage.openDownloads();
    await page.waitForTimeout(1000);
    log('✅ Recent Downloads popup opened');

    log('⏳ Clicking download button in Recent Downloads...');
    const downloadBtn = page.locator('button[title="Download"]').first();
    await downloadBtn.waitFor({ state: 'visible' });
    
    // THIS IS THE CRITICAL MOMENT - observe all events
    await downloadBtn.click();
    
    await page.waitForTimeout(3000); // Observe what happens
    log('✅ Download button clicked');

    // ═══════════════════════════════════════════════════════════════════
    // TEST SCENARIO 4: Download from Show All Downloads page
    // ═══════════════════════════════════════════════════════════════════

    log('\n━━━ SCENARIO 4: Show All Downloads page ━━━');
    await topbarPage.goToShowAllDownloads();
    await page.waitForTimeout(2000);
    log('✅ Navigated to Show All Downloads page');

    const downloadsPage = new DownloadsListPage(page);
    await downloadsPage.expectPageLoaded();
    
    log('⏳ Waiting for report to be Ready...');
    const readyReport = downloadsPage.getLatestReadyReport('INBOUND Transaction Report');
    await expect(readyReport).toBeVisible({ timeout: 30_000 });
    log('✅ Report is Ready');

    log('⏳ Clicking download button on /download page...');
    const downloadIconOnPage = readyReport.locator('button[title="Download"]');
    
    // THIS IS ANOTHER CRITICAL MOMENT
    await downloadIconOnPage.click();
    
    await page.waitForTimeout(3000); // Observe what happens
    log('✅ Download from page completed');

    // ═══════════════════════════════════════════════════════════════════
    // ANALYSIS: Output All Collected Logs
    // ═══════════════════════════════════════════════════════════════════

    console.log('\n\n');
    console.log('═'.repeat(80));
    console.log('COMPLETE EVENT LOG');
    console.log('═'.repeat(80));
    logs.forEach((logEntry) => console.log(logEntry));
    console.log('═'.repeat(80));

    // Cleanup
    await page.close();
    await context.close();
  });
});
