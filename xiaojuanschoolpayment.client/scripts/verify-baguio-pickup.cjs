const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/app/pages/philippines/baguio-pickup/baguio-pickup.component.ts'), 'utf8');
const pure = source.slice(source.indexOf('export const'), source.indexOf('@Component'));
const sandbox = { exports: {} };
vm.runInNewContext(ts.transpileModule(pure, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, sandbox);
const { pickupDates, followingMonday, philippinesToday } = sandbox.exports;
for (const year of [2026, 2027]) {
  const dates = pickupDates(year);
  assert.equal(dates.length, 26);
  assert.equal(new Set(dates).size, 26);
  for (const [i, date] of dates.entries()) {
    const value = new Date(date + 'T00:00:00Z');
    assert.equal(value.toISOString().slice(0, 10), date);
    assert.equal(value.getUTCDay(), 0);
    const monday = new Date(followingMonday(date) + 'T00:00:00Z');
    assert.equal(monday.getUTCDay(), 1);
    assert.equal(monday - value, 86400_000);
    if (i) assert.equal(value - new Date(dates[i - 1] + 'T00:00:00Z'), 14 * 86400_000);
  }
}
assert.equal(followingMonday('2026-10-18'), '2026-10-19');
assert.equal(followingMonday('2027-01-10'), '2027-01-11');
assert.equal(philippinesToday(new Date('2026-10-17T15:59:59Z')), '2026-10-17');
assert.equal(philippinesToday(new Date('2026-10-17T16:00:00Z')), '2026-10-18');
console.log('PASS: 52 dates, Sunday/Monday boundaries, 14-day intervals, UTC+8 midnight.');
if (!process.env.PLAYWRIGHT_MODULE) process.exit(0);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:4300/philippines-study/baguio/airport-pickup');
    const main = page.locator('app-baguio-pickup');
    await main.locator('h1').waitFor();
    assert.match(await page.title(), /接机指南/);
    assert.match(await page.locator('link[rel=canonical]').getAttribute('href'), /airport-pickup$/);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 950 });
      assert.equal(await main.locator('.year-calendar').count(), 2);
      assert.equal(await main.locator('.year-calendar').nth(1).locator('.date-row').count(), 26);
      const visible2026 = await main.locator('.year-calendar').first().locator('time').evaluateAll(els => els.map(el => el.getAttribute('datetime')));
      assert.deepEqual(visible2026, Array.from(pickupDates(2026)).filter(date => date >= philippinesToday()));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      for (const detail of await main.locator('details').all()) await detail.evaluate(el => el.open = true);
      for (const img of await main.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await page.waitForFunction(el => el.complete && el.naturalWidth > 0, await img.elementHandle());
      }
      await main.locator('app-expandable-image button').first().click();
      await main.locator('.expandable-image__overlay').waitFor();
      assert.equal(await main.locator('.expandable-image__overlay').count(), 1);
      await page.keyboard.press('Escape');
      await main.locator('.expandable-image__overlay').waitFor({ state: 'detached' });
      await page.screenshot({ path: path.join(root, '../docs/baguio-pickup-image-references/qa-' + width + '.png'), fullPage: true });
    }
    assert.deepEqual(errors, []);
    console.log('PASS: desktop/mobile route, SEO, both visible years, images, zoom, no overflow or runtime errors.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
