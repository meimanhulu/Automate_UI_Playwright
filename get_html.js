const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://uat.pg-poppay.com/login');
  
  await page.fill('input[name="email"]', 'ryland@manjo.co.id');
  await page.fill('input[name="password"]', 'Ryland2026');
  await page.click('button:has-text("Login")');
  await page.waitForURL('**/dashboard');
  
  const html = await page.innerHTML('li[role="presentation"]:has(p:text-is("Transaction"))');
  console.log('--- Transaction LI ---');
  console.log(html);
  await browser.close();
})();
