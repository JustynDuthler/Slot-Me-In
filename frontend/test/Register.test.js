const puppeteer = require('puppeteer');

// The browser instance created for each test
let browser;

// Create the browser before each test
beforeEach(async (done) => {
  require("whatwg-fetch");
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

test('Create User Account', async () => {
  const expected = {

  };
  jest.spyOn(window, "fetch").mockImplementation(() => {
    const fetchResponse = {
      ok: true,
      json: () => Promise.resolve(expected)
    };
    return Promise.resolve(fetchResponse);
  });

  let page = await browser.newPage();
  await page.goto('http://localhost:3000/register');
  await page.type('#username', 'Test User');
  await page.type('#email', 'test@ucsc.edu');
  await page.click('#dob');
  await page.waitForTimeout(100);
  await page.keyboard.press('Enter');
  await page.type('#password', 'Pwd');
  await page.click('#submit');
});
