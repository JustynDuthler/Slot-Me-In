const puppeteer = require('puppeteer');
import 'regenerator-runtime/runtime'
// The browser instance created for each test
let browser;

// Create the browser before each test
beforeEach(async (done) => {
  browser = await puppeteer.launch({
    // headless: false
  });

  done();
});

// Close the browser after each test
afterEach(async (done) => {
  await browser.close();
  done();
});

/**
 * Tests if date picker works correctly
 */
test('Start Date Input', async () => {
  let page = await browser.newPage();
  // set up expected date value in mm/dd/yyyy format
  // https://stackoverflow.com/questions/46228846
  const now = new Date(Date.now());
  const ops = {year: 'numeric'};
  ops.month = ops.day = '2-digit';
  const expected = (new Intl.DateTimeFormat([], ops).format(now));

  // try to log in
  await page.goto('http://localhost:3000/login');
  await page.type('#email', 'contact@testinc.com', { delay: 100 });
  await page.type('#password', 'password', { delay: 100 });
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.goto('http://localhost:3000/events/create');
  // await page.click('#startdatetime');
  // await page.waitForTimeout(100);
  // await page.keyboard.press('Enter');
  const date = await page.$('#startdatetime');
  console.log(date);
  const content = await (await date.getProperty('value')).jsonValue();
  expect(content).toBe(expected);
});
