const puppeteer = require('puppeteer');

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
test('Date of Birth Input', async () => {
  let page = await browser.newPage();
  // set up expected date value in mm/dd/yyyy format
  // https://stackoverflow.com/questions/46228846
  const now = new Date(Date.now());
  const ops = {year: 'numeric'};
  ops.month = ops.day = '2-digit';
  const expected = (new Intl.DateTimeFormat([], ops).format(now));

  // set date picker to today by just pressing enter
  await page.goto('http://localhost:3000/register');
  await page.click('#dob');
  await page.waitForTimeout(100);
  await page.keyboard.press('Enter');
  const date = await page.$('#dob');
  const content = await (await date.getProperty('value')).jsonValue();
  expect(content).toBe(expected);
});

