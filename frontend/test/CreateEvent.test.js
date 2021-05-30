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
  await page.click('#businesscheckbox');
  await page.$eval('#businesscheckbox', el => el.click());
  await page.keyboard.press('Enter', { delay: 100 });
  await page.keyboard.press('Enter', { delay: 100 });
  await page.goto('http://localhost:3000/events/create');
  // await page.click('#businesscheckbox');
  await page.waitForTimeout(100);
  // await page.keyboard.press('Enter');
  const date = await page.$('#businesscheckbox');
  await page.waitForTimeout(100);
  console.log(page.mainFrame());
  console.log(date);
  console.log("is checked?", await date.getProperty('checked'));
  page.on('error', (msg) => {
    const myObject = {};
    Error.captureStackTrace(myObject);
    console.log(myObject,msg);
  });
  const content = await (await date.getProperty('value')).jsonValue();
  expect(content).toBe(expected);
});
