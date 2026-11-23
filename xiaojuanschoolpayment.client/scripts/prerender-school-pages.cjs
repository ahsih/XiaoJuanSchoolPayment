#!/usr/bin/env node
// Prerenders the school pages (prerender-school-routes.txt) with their latest published prices, after
// `ng build` (runs via `npm run build`):
//
// - Like the content pages that `ng build` prerenders (prerender-routes.txt), each school page is rendered
//   once in Node with the build's server bundle (dist/.../server/main.server.mjs), so its body text is in
//   the page source for crawlers and AI tools that do not run JavaScript.
// - School pages show prices from published content revisions and the database, which the build cannot
//   read. So the site's own read requests go to the live site named by SIDA_PRERENDER_API_ORIGIN (the
//   Dockerfile sets https://sidaqihang.com); without it nothing is prerendered here. Each page records the
//   schools whose data it loaded and the time it was rendered; the server (SpaSeoHtmlRenderer) serves the
//   empty shell instead once any of those schools has newer published content, prices or photos, so the
//   page source never shows an old price.
// - Each page renders in its own worker with a time limit. A page that throws, times out, could not load
//   its data or has too little body text is left out with a warning (it still works as before, rendered
//   in the browser), so one broken school page never stops a deploy.
//
// Output: prerendered-school-pages.json next to the browser folder; scripts/export-seo-pages.cjs adds the
// pages to seo-pages.json.
//
// Usage: node scripts/prerender-school-pages.cjs [outputDir]
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const ORIGIN_VARIABLE = 'SIDA_PRERENDER_API_ORIGIN';

async function renderInWorker() {
  const { route, serverDir, origin } = workerData;
  process.env[ORIGIN_VARIABLE] = origin;
  const server = await import(pathToFileURL(path.join(serverDir, 'main.server.mjs')).href);
  const app = server['ɵgetOrCreateAngularServerApp']({ allowStaticRouteRender: true });
  const renderedAt = new Date().toISOString(); // Before any data is loaded.
  const response = await app.handle(new Request(new URL(route, 'http://localhost')));
  if (!response) {
    return { error: 'the server bundle returned no page' };
  }
  return { html: await response.text(), renderedAt };
}

const clientDir = path.resolve(__dirname, '..');
const routesFile = path.join(clientDir, 'prerender-school-routes.txt');
const MIN_BODY_CHINESE_CHARACTERS = 100;
const ROUTE_TIMEOUT_MS = 60_000;
const SCHOOL_META_PATTERN = /<meta name="sida-prerender-school" content="([0-9a-f-]{36})">/g;
const DATA_MISSING_PATTERN = /<meta name="sida-prerender-data-missing" content="([^"]*)">/g;
const ERROR_PATTERN = /<meta name="sida-prerender-error" content="([^"]*)">/g;

function bodyChineseCharacters(html) {
  const start = html.indexOf('<main');
  const end = html.lastIndexOf('</main>');
  if (start < 0 || end < start) {
    return 0;
  }
  const text = html.slice(start, end).replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '');
  return (text.match(/[一-鿿]/g) || []).length;
}

async function isReachable(origin) {
  try {
    const response = await fetch(`${origin}/school/get-schools?name=prerender-check`, { signal: AbortSignal.timeout(15_000) });
    return response.ok;
  } catch {
    return false;
  }
}

function render(route, serverDir, origin) {
  return new Promise(resolve => {
    const worker = new Worker(__filename, { workerData: { route, serverDir, origin } });
    let settled = false;
    const finish = result => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        worker.terminate();
        resolve(result);
      }
    };
    const timer = setTimeout(() => finish({ error: `did not finish within ${ROUTE_TIMEOUT_MS / 1000} seconds` }), ROUTE_TIMEOUT_MS);
    worker.on('message', finish);
    worker.on('error', error => finish({ error: `${error.name}: ${error.message}` }));
    worker.on('exit', code => finish({ error: `the render worker exited with code ${code}` }));
  });
}

/** The page to keep, or the reason it is left out. */
function check(route, result) {
  if (result.error) {
    return { reason: result.error };
  }
  const html = result.html;
  const errors = [...html.matchAll(ERROR_PATTERN)].map(match => match[1]);
  if (errors.length > 0) {
    return { reason: `threw while rendering (${errors.join('; ')})` };
  }
  const missing = [...html.matchAll(DATA_MISSING_PATTERN)].map(match => match[1]);
  if (missing.length > 0) {
    return { reason: `could not load ${missing.join(', ')}` };
  }
  const characters = bodyChineseCharacters(html);
  if (characters < MIN_BODY_CHINESE_CHARACTERS) {
    return { reason: `only ${characters} Chinese characters in <main>` };
  }
  const schools = [...new Set([...html.matchAll(SCHOOL_META_PATTERN)].map(match => match[1]))].sort();
  return {
    page: {
      html: html.replace(SCHOOL_META_PATTERN, ''),
      schools,
      renderedAt: result.renderedAt,
    },
  };
}

async function main() {
  const outputDir = path.resolve(process.argv[2] || path.join(clientDir, 'dist', 'xiaojuanschoolpayment.client', 'browser'));
  const serverDir = path.join(outputDir, '..', 'server');
  const resultPath = path.join(outputDir, '..', 'prerendered-school-pages.json');
  fs.rmSync(resultPath, { force: true });

  const origin = (process.env[ORIGIN_VARIABLE] || '').trim();
  if (!origin) {
    console.log(`prerender-school-pages: ${ORIGIN_VARIABLE} is not set, so school pages are not prerendered.`);
    return;
  }
  if (!/^https?:\/\/[^/?#]+$/.test(origin)) {
    throw new Error(`${ORIGIN_VARIABLE} must be an origin such as https://sidaqihang.com, not "${origin}"`);
  }
  if (!fs.existsSync(path.join(serverDir, 'main.server.mjs'))) {
    throw new Error(`${serverDir} has no main.server.mjs; build with the production configuration (ssr) first`);
  }

  // The Docker build runs on the server itself; if it cannot reach the live site, skip quickly instead of
  // letting every page wait for its requests to time out.
  if (!(await isReachable(origin))) {
    console.warn(`prerender-school-pages: ${origin} cannot be reached, so school pages are not prerendered this time.`);
    return;
  }

  const routes = fs.readFileSync(routesFile, 'utf8').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const pages = {};
  const skipped = {};
  const queue = [...routes];
  const concurrency = Math.max(1, Math.min(4, (os.availableParallelism?.() ?? os.cpus().length) - 1));
  const started = Date.now();

  await Promise.all(Array.from({ length: concurrency }, async () => {
    for (let route = queue.shift(); route; route = queue.shift()) {
      const { page, reason } = check(route, await render(route, serverDir, origin));
      if (page) {
        pages[route] = page;
      } else {
        skipped[route] = reason;
        console.warn(`prerender-school-pages: left out ${route}: ${reason}`);
      }
    }
  }));

  fs.writeFileSync(resultPath, JSON.stringify({ origin, pages, skipped }) + '\n', 'utf8');
  console.log(
    `prerender-school-pages: prerendered ${Object.keys(pages).length} of ${routes.length} school pages from ${origin} `
    + `in ${Math.round((Date.now() - started) / 1000)} seconds`
    + (Object.keys(skipped).length > 0 ? ` (${Object.keys(skipped).length} left out, see the warnings above)` : ''),
  );
}

if (!isMainThread) {
  renderInWorker().then(
    result => parentPort.postMessage(result),
    error => parentPort.postMessage({ error: error instanceof Error ? `${error.name}: ${error.message}` : String(error) }),
  );
} else {
  main().catch(error => {
    console.error(`prerender-school-pages: ${error instanceof Error ? error.stack : error}`);
    process.exit(1);
  });
}
