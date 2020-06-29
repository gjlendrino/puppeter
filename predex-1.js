// npm i puppeteer

const puppeteer = require('puppeteer');

(async () => {
  // const browser = await puppeteer.launch({headless: false});
  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({headless: false, slowMo: 250}); // slow down by 250ms
  const page = await browser.newPage();
  await page.goto('https://192.168.1.101/pwa/');
  await page.screenshot({path: 'predex.png'});

  await browser.close();
})();