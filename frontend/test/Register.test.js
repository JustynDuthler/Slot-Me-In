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

/**
 * Tests if business form shows appropriate fields
 */
test('Business Account Register Form', async () => {
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/register');
  expect(await page.$('#phonenumber')).toBeNull();
  expect(await page.$('#description')).toBeNull();
  expect(await page.$('#dob')).toBeDefined();
  await page.click('#businessCheckbox');
  await page.waitForTimeout(100);
  expect(await page.$('#phonenumber')).toBeDefined();
  expect(await page.$('#description')).toBeDefined();
  expect(await page.$('#dob')).toBeNull();
});
