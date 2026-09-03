const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const watchdog = setTimeout(() => { console.error('Browser verification timed out'); process.exit(1); }, 90000);
  console.log('Starting real-browser verification');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cg-sparta-qa-'));
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=9331', `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
  chrome.stderr.on('data', data => process.stderr.write(data));
  chrome.on('exit', code => console.log('Browser exit', code));
  let ws;
  try {
    let pages;
    for (let i = 0; i < 80; i++) {
      try { pages = await (await fetch('http://127.0.0.1:9331/json/list')).json(); break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
    console.log('Browser connected');
    let id = 0;
    const pending = new Map();
    ws.addEventListener('message', event => {
      const response = JSON.parse(event.data);
      const request = pending.get(response.id);
      if (request) { pending.delete(response.id); response.error ? request.reject(response.error) : request.resolve(response.result); }
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      console.log('CDP', method);
      pending.set(++id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'http://127.0.0.1:4200/philippines-study/cebu/cg-academy-sparta-campus#quote' });
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`!!document.querySelector('.cg-quote-card') && !!window.ng`)) break;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    await evaluate(`window.qaSchool = ng.getOwningComponent(document.querySelector('.cg-quote-card')); true`);
    for (const [courses, rooms] of [[1,1],[2,2],[3,3],[4,4],[1,3],[3,1]]) {
      const result = await evaluate(`(async () => {
        const c = window.qaSchool;
        c.courseSelections = [{ ...c.courseSelections[0], weeks: 4, startDate: '2026-09-06', optionId: c.courseOptions[0].id }];
        c.roomSelections = [{ ...c.roomSelections[0], weeks: 4, startDate: '2026-09-06', optionId: c.roomOptions[0].id }];
        for (let n = 1; n < ${courses}; n++) { c.addSelection('course'); c.updateSelection('course', c.courseSelections[n].id, { optionId: c.courseOptions[n % c.courseOptions.length].id }); }
        for (let n = 1; n < ${rooms}; n++) { c.addSelection('room'); c.updateSelection('room', c.roomSelections[n].id, { optionId: c.roomOptions[n % c.roomOptions.length].id }); }
        if (${courses} === 1) c.updateSelection('course', c.courseSelections[0].id, { weeks: ${Math.max(courses,rooms)*4} });
        if (${rooms} === 1) c.updateSelection('room', c.roomSelections[0].id, { weeks: ${Math.max(courses,rooms)*4} });
        ng.applyChanges(c);
        const renderer = ng.getComponent(document.querySelector('#quote app-quote-image-download-button'));
        const blob = await renderer.createQuoteImageBlob(2);
        const data = await new Promise(resolve => { const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(blob); });
        const q = c.quoteImageData;
        return { data, heading: q.headingText, count: q.paymentItems.filter(r => r.detailTitle).length, titles: [q.paymentSectionTitle,q.localFeeTitle], error: c.planError, localNotesMatch: q.localFeeItems.every((r,i) => r.note === c.includedLocalFees[i].note), usdMatch: q.totalUsd === c.quoteUsdText };
      })()`);
      assert.equal(result.count, courses + rooms);
      assert.equal(result.error, '');
      assert.equal(result.usdMatch, true);
      assert.equal(result.localNotesMatch, true);
      assert.deepEqual(result.titles, ['学校费用明细', '到校后学杂费明细']);
      assert.equal(result.heading, `CG斯巴达校区${Math.max(courses,rooms)*4}周报价`);
      fs.writeFileSync(path.join(__dirname, `cg-sparta-unified-${courses}c-${rooms}r.png`), Buffer.from(result.data.split(',')[1], 'base64'));
      console.log(`PASS real-page image ${courses} courses / ${rooms} rooms`);
    }
    for (const width of [1440, 390]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width === 390 });
      await evaluate(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))`);
      const layout = await evaluate(`(() => {
        const rows = [...document.querySelectorAll('.cg-list-row')];
        const card = document.querySelector('.cg-quote-card');
        const r = card.getBoundingClientRect();
        return { overflow: rows.some(row => row.scrollWidth > row.clientWidth), pageOverflow: document.documentElement.scrollWidth > innerWidth, columnsVisible: getComputedStyle(document.querySelector('.cg-list-columns')).display !== 'none', rows: rows.length, clip: { x:r.x+scrollX, y:r.y+scrollY, width:r.width, height:r.height, scale:1 } };
      })()`);
      assert.equal(layout.overflow, false, `row overflow ${width}`);
      assert.equal(layout.pageOverflow, false, `page overflow ${width}`);
      assert.equal(layout.columnsVisible, width === 1440);
      const screenshot = await send('Page.captureScreenshot', { format:'png', captureBeyondViewport:true, clip:layout.clip });
      fs.writeFileSync(path.join(__dirname, `cg-sparta-web-${width}.png`), Buffer.from(screenshot.data,'base64'));
      console.log(`PASS real webpage ${width}px, ${layout.rows} rows`);
    }
  } finally { clearTimeout(watchdog); if (ws) ws.close(); chrome.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
