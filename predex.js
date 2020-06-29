// npm i puppeteer
// npm i puppeteer-lighthouse
/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview Example script for running Lighthouse on an authenticated page.
 * See docs/recipes/auth/README.md for more.
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');

// This port will be used by Lighthouse later. The specific port is arbitrary.
const PORT = 8041;
const USERNAME = 'admin';
const PASSWORD = 'pr3d3x4dm1n';

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
  await emailInput.type(USERNAME);
  const passwordInput = await page.$('input[type="password"]');
  await passwordInput.type(PASSWORD);
  await page.click('#loginForm > div.field.submit > div > button');

  // Submit grant form.
  page.waitForSelector('#approve', {visible: true})
  await page.click('#approve');
  
  await page.waitFor(14000);
  // await page.waitForSelector('#approve', {visible: true});

  await page.close();
}

/**
 * @param {puppeteer.Browser} browser
 * @param {string} origin
 */
async function logout(browser, origin) {
  await page.click('body > app-root > mat-sidenav-container > mat-sidenav > div > div > div.user-more > button > span > i');

  page.waitForSelector('#mat-menu-panel-0 > div > button:nth-child(3)', {visible: true})
  await page.click('#mat-menu-panel-0 > div > button:nth-child(3)');
  
  await page.close();
}

async function main() {
  // Direct Puppeteer to open Chrome with a specific debugging port.
  const browser = await puppeteer.launch({
    //args: ['--remote-debugging-port=${PORT}', '--start-maximized'],
    args: ['--start-maximized'],
    // Optional, if you want to see the tests in action.
    headless: false,
    slowMo: 50,
  });

  // Setup the browser session to be logged into our site.
  await login(browser, 'https://192.168.1.101/pwa/');

  // The local server is running on port 10632.
  const url = 'https://192.168.1.101/pwa/';
  // Direct Lighthouse to use the same port.
  // const result = await lighthouse(url, {port: PORT, disableStorageReset: true});
  // Direct Puppeteer to close the browser as we're done with it.
  await browser.close();

  // Output the result.
  // console.log(JSON.stringify(result.lhr, null, 2));
}

if (require.main === module) {
  main();
} else {
  module.exports = {
    login,
    logout
  };
}
