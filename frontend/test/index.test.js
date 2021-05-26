const puppeteer = require('puppeteer');
import 'regenerator-runtime/runtime'
// The browser instance created for each test
let browser;

// Create the browser before each test
beforeAll(async (done) => {
  browser = await puppeteer.launch({
    // headless: false
  });
  done();
});

// Close the browser after each test
afterAll(async (done) => {
  await browser.close();
  done();
});

/**
 * Page title is correct
 */
 test('Title', async () => {
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  expect(title).toBe('SlotMeIn');
});
