#!/usr/bin/env node
// Writes the machine-readable copies of the site next to the built index.html (runs after `ng build`
// via `npm run build`):
//
// - seo-pages.json: each route's title, description, Open Graph data, schema.org JSON-LD and, for a few
//   routes, the page body as static HTML. The ASP.NET host (SpaSeoHtmlRenderer) puts these into the
//   initial HTML, because Baidu, WeChat link previews and most AI crawlers do not run JavaScript.
// - index.html: the home page's JSON-LD (the full Organization from the brand fact card), because "/"
//   is served as this static file.
// - llms.txt: the brand fact card as Markdown for AI tools.
//
// The data is SEO_PAGES / SECTION_SEO / DEFAULT_SEO / buildSeoStructuredData / PRERENDERED_PAGE_HTML in
// src/services/seo.service.ts and the brand fact card in src/app/pages/about-sida/about/brand-facts.ts,
// so the browser and the server use one source.
//
// Usage: node scripts/export-seo-pages.cjs [outputDir]
const fs = require('fs');
const path = require('path');

const clientDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(process.argv[2] || path.join(clientDir, 'dist', 'xiaojuanschoolpayment.client', 'browser'));
const indexPath = path.join(outputDir, 'index.html');

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
  PRERENDERED_PAGE_HTML,
  BRAND_SITE_ORIGIN,
  BRAND_FORBIDDEN_PHRASES,
  renderBrandLlmsTxt,
} = loaded.exports;

if (
  !SEO_PAGES || !SECTION_SEO || !DEFAULT_SEO || !DEFAULT_IMAGE || !SITE_NAME || typeof seoTitle !== 'function'
  || typeof buildSeoStructuredData !== 'function' || !PRERENDERED_PAGE_HTML || !BRAND_SITE_ORIGIN
  || !Array.isArray(BRAND_FORBIDDEN_PHRASES) || typeof renderBrandLlmsTxt !== 'function'
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

const pages = {};
for (const [route, page] of Object.entries(SEO_PAGES)) {
  const entry = toEntry(page, route);
  entry.jsonLd = jsonLd(route, page);
  const render = PRERENDERED_PAGE_HTML[route];
  if (render) {
    const html = render();
    checkForbidden(`the static HTML of ${route}`, html);
    entry.bodyHtml = html;
  }
  pages[route] = entry;
}
for (const route of Object.keys(PRERENDERED_PAGE_HTML)) {
  if (!SEO_PAGES[route]) {
    problems.push(`PRERENDERED_PAGE_HTML has ${route}, which needs an SEO_PAGES entry`);
  }
}

const data = {
  siteName: SITE_NAME,
  default: toEntry(DEFAULT_SEO, 'DEFAULT_SEO'),
  pages,
  sections: SECTION_SEO.map(({ prefix, page }) => ({ prefix, ...toEntry(page, `section ${prefix}`) })),
};

const llmsTxt = renderBrandLlmsTxt(BRAND_SITE_ORIGIN);
checkForbidden('llms.txt', llmsTxt);

if (problems.length > 0) {
  console.error(`export-seo-pages: ${problems.join('; ')}`);
  process.exit(1);
}

fs.writeFileSync(path.join(outputDir, 'seo-pages.json'), JSON.stringify(data, null, 2) + '\n', 'utf8');

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

const prerendered = Object.keys(PRERENDERED_PAGE_HTML).join(', ');
console.log(
  `export-seo-pages: wrote ${Object.keys(pages).length} pages and ${data.sections.length} sections to seo-pages.json `
  + `(static body: ${prerendered}), the home JSON-LD to index.html, and llms.txt (${Buffer.byteLength(llmsTxt)} bytes)`,
);
