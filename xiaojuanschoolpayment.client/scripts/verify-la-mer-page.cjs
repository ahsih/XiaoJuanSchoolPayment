const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('fs'), path = require('path');
const out = path.resolve(__dirname, '../../docs/qa/ev-la-mer'), base = process.env.LA_MER_BASE_URL || 'http://127.0.0.1:4200', route = '/philippines-study/cebu/ev-la-mer';
fs.mkdirSync(out, { recursive: true });
const report = { checks: [], errors: [], images: [] };
function check(name, okay) { if (!okay) throw Error(name); report.checks.push(name); }
async function quoteImage(page, name) {
  await page.getByRole('button', { name: '预览并保存报价图片', exact: true }).click();
  const image = page.getByRole('img', { name: '完整报价单，长按可保存图片' });
  await image.waitFor({ timeout: 45000 });
  const dimensions = await image.evaluate(e => ({ width: e.naturalWidth, height: e.naturalHeight }));
  check(name + ' has a complete PNG preview', dimensions.width > 600 && dimensions.height > 1000);
  const download = page.waitForEvent('download', { timeout: 15000 });
  await page.getByRole('button', { name: '下载图片', exact: true }).click();
  await (await download).saveAs(path.join(out, name + '.png'));
  report.images.push({ name, ...dimensions });
  await page.getByRole('button', { name: '关闭图片预览' }).click();
}
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    page.setDefaultTimeout(30000); page.on('pageerror', e => report.errors.push(e.message));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.locator('app-la-mer-school h1').waitFor();
    check('public SEO and exact route', (await page.title()).includes('EV Academy La Mer'));
    check('ordinary sample equals 1791 USD', (await page.locator('.total-panel').innerText()).includes('1,791 美元'));
    check('public page has no editor highlights', await page.locator('.preview-highlight').count() === 0);
    await page.screenshot({ path: path.join(out, 'desktop-page.png') });
    await quoteImage(page, 'quote-single-4w');
    await page.getByLabel('普通报价人数').selectOption({ label: '3人' });
    await page.locator('.student-card').nth(1).getByLabel('课程1类型', { exact: true }).selectOption('power-speaking-6');
    await page.locator('.student-card').nth(2).getByLabel('住宿1类型', { exact: true }).selectOption('single');
    await page.getByLabel('普通报价人数').selectOption({ label: '1人' });
    check('inactive people are excluded', (await page.locator('.total-panel').innerText()).includes('1,791 美元'));
    await page.getByLabel('普通报价人数').selectOption({ label: '3人' });
    check('inactive choices are preserved', await page.locator('.student-card').nth(1).getByLabel('课程1类型', { exact: true }).inputValue() === 'power-speaking-6');
    await quoteImage(page, 'quote-group-3');
    await page.getByRole('tab', { name: '亲子整包', exact: true }).click();
    await page.locator('.family-form').waitFor();
    check('family 2-person reference equals 3800 USD', (await page.locator('.total-panel').innerText()).includes('3,800 美元'));
    await page.getByLabel('家庭总人数', { exact: true }).selectOption({ label: '3人' });
    await page.getByLabel('监护人人数').selectOption({ label: '2人' });
    check('two guardians plus child are accepted', await page.locator('.error-message').count() === 0);
    await quoteImage(page, 'quote-family-3-4w');
    await page.getByLabel('亲子入住日期').fill('2026-12-20');
    await page.locator('.error-message').waitFor();
    check('cross-season quote blocks image export', await page.locator('.error-message').count() === 1 && await page.getByRole('button', { name: '预览并保存报价图片', exact: true }).count() === 0);
    await page.getByLabel('亲子入住日期').fill('2026-09-20');
    await page.getByRole('tab', { name: '教室', exact: true }).click();
    await page.locator('.gallery-thumbs button').nth(1).click();
    await page.waitForFunction(() => document.querySelector('.gallery-caption')?.innerText.includes('团体教室'));
    check('gallery category and thumbnail navigation', (await page.locator('.gallery-caption').innerText()).includes('团体教室'));
    await page.getByRole('tab', { name: '全部', exact: true }).click();
    for (const width of [768, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      check(width + 'px no page overflow', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(out, width === 768 ? 'tablet-page.png' : width === 390 ? 'mobile-page.png' : 'mobile-small-page.png') });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.family-form').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, 'mobile-family-calculator.png') });
    await quoteImage(page, 'quote-family-mobile');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole('tab', { name: '普通课程 · 单人 / 多人', exact: true }).click();
    await page.getByLabel('普通报价人数').selectOption({ label: '20人' });
    await page.locator('.student-card').nth(19).waitFor();
    check('20 independent students remain operable', await page.locator('.student-card').count() === 20 && await page.locator('.error-message').count() === 0);
    await quoteImage(page, 'quote-group-20');
    await page.getByLabel('普通报价人数').selectOption({ label: '1人' });
    await page.evaluate(async () => { document.querySelectorAll('app-la-mer-school img').forEach(img => img.loading = 'eager'); await Promise.all([...document.querySelectorAll('app-la-mer-school img')].map(img => img.decode().catch(() => {}))); window.scrollTo(0, 0); });
    check('all campus page images load', await page.locator('app-la-mer-school img').evaluateAll(imgs => imgs.every(i => i.naturalWidth > 0)));
    await page.screenshot({ path: path.join(out, 'desktop-full-page.png'), fullPage: true });
    const directory = await browser.newPage();
    await directory.goto(base + '/philippines-study/cebu', { waitUntil: 'networkidle' });
    const entry = directory.locator('a[href="' + route + '"]:visible').first();
    await entry.click();
    await directory.locator('app-la-mer-school h1').waitFor();
    check('Cebu directory entry opens independent La Mer route', directory.url().endsWith(route));
    check('SEO share image belongs to La Mer', (await directory.locator('meta[property="og:image"]').getAttribute('content')).includes('/la-mer/'));
    check('navigation configuration contains the independent campus', await directory.locator('app-navbar').evaluate((element, route) => { const visit = items => items.some(item => item.route === route || visit(item.children || [])); return visit(ng.getComponent(element).navItems); }, route));
    await directory.close();
    check('no browser exceptions', report.errors.length === 0);
    fs.writeFileSync(path.join(out, 'public-ui-checks.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report));
  } finally { await browser.close(); }
})().catch(e => { console.error(e.message); fs.writeFileSync(path.join(out, 'public-ui-checks.json'), JSON.stringify({ ...report, failure: e.message }, null, 2)); process.exit(1); });
