const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ev-rate-preview-'));
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=9332', `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: 'ignore', windowsHide: true });
  const watchdog = setTimeout(() => { chrome.kill(); process.exit(1); }, 60000);
  let ws;
  try {
    let pages;
    for (let i = 0; i < 60; i++) {
      try { pages = await (await fetch('http://127.0.0.1:9332/json/list')).json(); break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, {once:true}); ws.addEventListener('error', reject, {once:true}); });
    let id = 0; const pending = new Map();
    ws.addEventListener('message', event => {
      const r = JSON.parse(event.data); const p = pending.get(r.id);
      if (p) { pending.delete(r.id); r.error ? p.reject(r.error) : p.resolve(r.result); }
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      pending.set(++id, {resolve,reject}); ws.send(JSON.stringify({id,method,params}));
    });
    const evaluate = async expression => {
      const r = await send('Runtime.evaluate', {expression, awaitPromise:true, returnByValue:true});
      if (r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails));
      return r.result.value;
    };
    await send('Page.navigate', {url:'http://127.0.0.1:4200/philippines-study/cebu/ev-academy#quote'});
    for (let i=0; i<80; i++) {
      if (await evaluate(`!!document.querySelector('app-ev-school-detail') && !!window.ng && !!ng.getComponent(document.querySelector('app-ev-school-detail'))?.exchangeRateLive`)) break;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    const result = await evaluate(`(async () => {
      const c = ng.getComponent(document.querySelector('app-ev-school-detail'));
      if (!c.exchangeRateLive) throw Error('No live reference-rate snapshot available');
      c.addSelection('course'); c.addSelection('room'); ng.applyChanges(c);
      const q = c.quoteImageData;
      if (!q.optionalFeeItems.find(r => r.label === '房间押金').note.includes('无损坏及无欠费时可退')) throw Error('Stale preview bundle');
      const renderer = ng.getComponent(document.querySelector('#quote app-quote-image-download-button'));
      const blob = await renderer.createQuoteImageBlob(2);
      const data = await new Promise(resolve => { const r = new FileReader(); r.onload=()=>resolve(r.result); r.readAsDataURL(blob); });
      return {data, heading:q.headingText, discount:q.paymentItems.find(r=>r.label==='思达折扣'), total:q.totalUsd, rates:q.conversionRates};
    })()`);
    assert.equal(result.heading, 'EV主校区8周报价');
    assert.equal(result.discount.amount, '− 188 美元');
    assert.equal(result.total, '3,672 美元');
    fs.writeFileSync(path.join(__dirname, 'ev-8weeks-corrected-deposit-preview.png'), Buffer.from(result.data.split(',')[1], 'base64'));
    console.log(JSON.stringify({heading:result.heading, discount:result.discount, total:result.total, rates:result.rates}));
  } finally { clearTimeout(watchdog); if (ws) ws.close(); chrome.kill(); }
})().catch(error => { console.error(error); process.exitCode=1; });
