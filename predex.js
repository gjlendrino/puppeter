// npm i puppeteer
// npm i puppeteer-lighthouse
// npm i lighthouse
/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview Script for running Lighthouse on an authenticated page.
 * See README.md for more.
 */

const fs = require('fs');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

/**
 * @param {import('puppeteer').Browser} browser
 * @param {string} origin
 */
async function login(browser, origin) {
  const page = await browser.newPage();
  await page.setViewport({width:0, height:0});
  await page.goto(origin);
  await page.waitForSelector('input[type="text"]', {visible: true});

  // Fill in and submit login form.
  const emailInput = await page.$('input[type="text"]');
  await emailInput.type('admin');
  const passwordInput = await page.$('input[type="password"]');
  await passwordInput.type('pr3d3x4dm1n');
  // await Promise.all([
  //   page.$eval('.login-form', form => form.submit()),
  //   page.waitForNavigation(),
  // ]);
  await page.click('#loginForm > div.field.submit > div > button');

  // Submit grant form.
  await page.click('#approve');
}

async function main() {
  // Direct Puppeteer to open Chrome with a specific debugging port.
  const browser = await puppeteer.launch({
    //args: ['--start-maximized'],
    // Optional, if you want to see the tests in action.
    //headless: false,
    slowMo: 50,
  });

  // Setup the browser session to be logged into our site.
  await login(browser, 'https://192.168.1.101/pwa/');

  // The local server is running on port 10632.
  const url = 'https://192.168.1.101/pwa/';
  // Direct Lighthouse to use the same port.
  //args = ["--emulated-form-factor=desktop", "--output-path=./lighthouse-report.html", "--chrome-flags=--headless --no-sandbox", "https://localhost" ]
  const report = await lighthouse(url, {
    port: (new URL(browser.wsEndpoint())).port,
    output: 'html',
    disableStorageReset: true,
    emulatedFormFactor: 'desktop',
    //chromeFlags: ['--disable-mobile-emulation', '--disable-storage-reset'],
    chromeFlags: ['--chrome-flags=--headless', '--no-sandbox'],

  });

  // Output the result.
  const html = reportGenerator.generateReport(report.lhr, 'html');
  fs.writeFileSync('lighthouse-report.html', html);

  // Direct Puppeteer to close the browser as we're done with it.
  await browser.close();
}

if (require.main === module) {
  main();
} else {
  module.exports = {
    login
  };
}
