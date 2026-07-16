const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://uat.pg-poppay.com/login');
  
  await page.fill('input[name="email"]', 'ryland@manjo.co.id');
  await page.fill('input[name="password"]', 'Ryland2026');
  await page.click('button:has-text("Login")');
  
  await page.waitForSelector('text="Transaction"', { timeout: 30000 });
  const html = await page.innerHTML('ul'); // Get the main sidebar UL
  console.log('--- SIDEBAR UL ---');
  console.log(html);
  await browser.close();
})();
