import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    errors.push(`[Page Error] ${error.message}`);
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' }).catch(e => {
    errors.push(`[Navigation Error] ${e.message}`);
  });
  
  console.log(JSON.stringify(errors, null, 2));
  await browser.close();
})();
