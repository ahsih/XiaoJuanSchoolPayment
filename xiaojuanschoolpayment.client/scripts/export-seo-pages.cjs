#!/usr/bin/env node
// Writes the machine-readable copies of the site next to the built index.html and packs the prerendered
// pages (runs after `ng build` via `npm run build`):
//
// - Prerendered pages: the production build renders every route in prerender-routes.txt (angular.json
//   → prerender, src/main.server.ts) to <route>/index.html with the page body in the HTML, because Baidu,
//   WeChat link previews and most AI crawlers do not run JavaScript. This script checks each page (no
//   render error, real body text) and moves it into seo-pages.json, because the server treats a wwwroot
//   folder with its own index.html as a separate static site (FindStaticSiteIndex in Program.cs). "/"
//   stays as the prerendered index.html, which the server serves as a static file; index.csr.html is the
//   empty shell for every other route.
// - seo-pages.json: each route's title, description, Open Graph data and schema.org JSON-LD, plus the
//   prerendered pages. The ASP.NET host (SpaSeoHtmlRenderer) serves a route's prerendered page, or the
//   shell, with that route's own tags.
// - index.html: the home page's JSON-LD (the full Organization from the brand fact card), because "/"
//   is served as this static file.
// - llms.txt: the brand fact card as Markdown for AI tools.
//
// The data is SEO_PAGES / SECTION_SEO / DEFAULT_SEO / buildSeoStructuredData in
// src/services/seo.service.ts and the brand fact card in src/app/pages/about-sida/about/brand-facts.ts,
// so the browser and the server use one source.
//
// Usage: node scripts/export-seo-pages.cjs [outputDir]
const fs = require('fs');
const path = require('path');

const clientDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(process.argv[2] || path.join(clientDir, 'dist', 'xiaojuanschoolpayment.client', 'browser'));
const indexPath = path.join(outputDir, 'index.html');
const shellPath = path.join(outputDir, 'index.csr.html');
// Written by ng build next to the browser folder when it prerenders.
const prerenderedRoutesPath = path.join(outputDir, '..', 'prerendered-routes.json');

if (!fs.existsSync(indexPath)) {
  console.error(`export-seo-pages: ${outputDir} has no index.html; run ng build first.`);
  process.exit(1);
}

let esbuild;
try {
  esbuild = require('esbuild'); // ships with @angular/build
} catch {
  console.error('export-seo-pages: esbuild is not installed; run npm ci.');
  process.exit(1);
}

// Angular and rxjs are only used by the SeoService class, which is never instantiated here; every
// decorator or function they provide becomes a no-op.
const { outputFiles } = esbuild.buildSync({
  stdin: {
    contents: "export * from './services/seo.service';\nexport * from './app/pages/about-sida/about/brand-facts';\n",
    resolveDir: path.join(clientDir, 'src'),
    sourcefile: 'seo-export.ts',
    loader: 'ts',
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  external: ['@angular/*', 'rxjs', 'rxjs/*'],
  tsconfigRaw: { compilerOptions: { experimentalDecorators: true } },
  logLevel: 'silent',
});
const noop = () => noop;
const stub = new Proxy({}, { get: () => noop });
const loaded = { exports: {} };
new Function('require', 'module', 'exports', outputFiles[0].text)(() => stub, loaded, loaded.exports);
const {
  SEO_PAGES,
  SECTION_SEO,
  DEFAULT_SEO,
  DEFAULT_IMAGE,
  SITE_NAME,
  seoTitle,
  buildSeoStructuredData,
  BRAND_SITE_ORIGIN,
  BRAND_FORBIDDEN_PHRASES,
  renderBrandFactsHtml,
  renderBrandLlmsTxt,
} = loaded.exports;

if (
  !SEO_PAGES || !SECTION_SEO || !DEFAULT_SEO || !DEFAULT_IMAGE || !SITE_NAME || typeof seoTitle !== 'function'
  || typeof buildSeoStructuredData !== 'function' || !BRAND_SITE_ORIGIN || !Array.isArray(BRAND_FORBIDDEN_PHRASES)
  || typeof renderBrandFactsHtml !== 'function' || typeof renderBrandLlmsTxt !== 'function'
) {
  console.error('export-seo-pages: seo.service.ts or brand-facts.ts no longer exports the data this script needs.');
  process.exit(1);
}

const problems = [];

// JSON inside <script> must not contain "</script>"; escaping "<" keeps it valid JSON.
const jsonLd = (route, page) => JSON.stringify(buildSeoStructuredData(route, page)).replace(/</g, '\\u003c');

function checkForbidden(where, text) {
  for (const phrase of BRAND_FORBIDDEN_PHRASES) {
    if (text.includes(phrase)) {
      problems.push(`${where} contains the forbidden phrase "${phrase}" (see BRAND_FORBIDDEN_PHRASES)`);
    }
  }
}

function toEntry(page, where) {
  if (!page || !page.title || !page.description) {
    problems.push(`${where} is missing a title or description`);
  }
  return {
    title: seoTitle(page),
    description: page.description,
    keywords: page.keywords || '',
    image: page.image || DEFAULT_IMAGE,
    type: page.type || 'website',
  };
}

// A prerendered page must have rendered without errors (src/app/app.module.server.ts records them in
// this meta tag) and must have real body text inside its <main>, not only the menu.
const PRERENDER_ERROR_PATTERN = /<meta name="sida-prerender-error" content="([^"]*)"/g;
const MIN_BODY_CHINESE_CHARACTERS = 100;

function bodyChineseCharacters(html) {
  const start = html.indexOf('<main');
  const end = html.lastIndexOf('</main>');
  if (start < 0 || end < start) {
    return 0;
  }
  const text = html.slice(start, end).replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '');
  return (text.match(/[一-鿿]/g) || []).length;
}

function checkPrerendered(route, html) {
  for (const [, message] of html.matchAll(PRERENDER_ERROR_PATTERN)) {
    problems.push(`${route} threw while it was prerendered (${message}); guard browser-only code with isPlatformBrowser`);
  }
  const characters = bodyChineseCharacters(html);
  if (characters < MIN_BODY_CHINESE_CHARACTERS) {
    problems.push(`${route} was prerendered with only ${characters} Chinese characters in <main>`);
  }
}

function removeEmptyDirectories(directory) {
  for (let current = directory; current.startsWith(outputDir + path.sep); current = path.dirname(current)) {
    if (fs.readdirSync(current).length > 0) {
      return;
    }
    fs.rmdirSync(current);
  }
}

const prerenderedRoutes = fs.existsSync(prerenderedRoutesPath)
  ? Object.keys(JSON.parse(fs.readFileSync(prerenderedRoutesPath, 'utf8')).routes || {}).sort()
  : [];
if (prerenderedRoutes.length > 0 && !fs.existsSync(shellPath)) {
  problems.push('ng build prerendered pages but wrote no index.csr.html shell');
}

const prerendered = {};
const prerenderedFiles = [];
for (const route of prerenderedRoutes) {
  const file = route === '/' ? indexPath : path.join(outputDir, ...route.split('/').filter(Boolean), 'index.html');
  if (!fs.existsSync(file)) {
    problems.push(`${route} is listed in prerendered-routes.json but ${path.relative(outputDir, file)} is missing; run ng build again`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  checkPrerendered(route, html);
  if (route !== '/') {
    prerendered[route] = html;
    prerenderedFiles.push(file);
  }
}

const pages = {};
for (const [route, page] of Object.entries(SEO_PAGES)) {
  const entry = toEntry(page, route);
  entry.jsonLd = jsonLd(route, page);
  pages[route] = entry;
}

const data = {
  siteName: SITE_NAME,
  default: toEntry(DEFAULT_SEO, 'DEFAULT_SEO'),
  pages,
  sections: SECTION_SEO.map(({ prefix, page }) => ({ prefix, ...toEntry(page, `section ${prefix}`) })),
  prerendered,
};

checkForbidden('the 关于思达启航 page', renderBrandFactsHtml());
const llmsTxt = renderBrandLlmsTxt(BRAND_SITE_ORIGIN);
checkForbidden('llms.txt', llmsTxt);

if (problems.length > 0) {
  console.error(`export-seo-pages: ${problems.join('; ')}`);
  process.exit(1);
}

fs.writeFileSync(path.join(outputDir, 'seo-pages.json'), JSON.stringify(data, null, 2) + '\n', 'utf8');

// The pages now live in seo-pages.json; a folder left with its own index.html would be served as a
// separate static site instead of through the SEO renderer.
for (const file of prerenderedFiles) {
  fs.unlinkSync(file);
  removeEmptyDirectories(path.dirname(file));
}

// "/" is served as the static index.html, so its JSON-LD goes into that file (replacing an earlier run's).
const homeScript = `<script type="application/ld+json" id="seo-json-ld">${jsonLd('/', SEO_PAGES['/'])}</script>`;
const indexHtml = fs
  .readFileSync(indexPath, 'utf8')
  .replace(/\s*<script type="application\/ld\+json" id="seo-json-ld">[\s\S]*?<\/script>/, '');
const headEnd = indexHtml.indexOf('</head>');
if (headEnd < 0) {
  console.error('export-seo-pages: index.html has no </head>.');
  process.exit(1);
}
fs.writeFileSync(indexPath, `${indexHtml.slice(0, headEnd)}${homeScript}\n${indexHtml.slice(headEnd)}`, 'utf8');

fs.writeFileSync(path.join(outputDir, 'llms.txt'), llmsTxt, 'utf8');

console.log(
  `export-seo-pages: wrote ${Object.keys(pages).length} pages, ${data.sections.length} sections and `
  + `${Object.keys(prerendered).length} prerendered pages to seo-pages.json`
  + `${prerenderedRoutes.includes('/') ? ' (home page prerendered in index.html)' : ''}, `
  + `the home JSON-LD to index.html, and llms.txt (${Buffer.byteLength(llmsTxt)} bytes)`,
);
