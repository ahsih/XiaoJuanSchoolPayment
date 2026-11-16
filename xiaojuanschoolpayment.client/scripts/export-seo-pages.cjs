#!/usr/bin/env node
// Writes seo-pages.json next to the built index.html (runs after `ng build` via `npm run build`).
//
// The ASP.NET host reads it to put each route's <title>, description, Open Graph and canonical tags
// into the initial HTML, because Baidu and WeChat link previews usually do not run JavaScript and
// would otherwise see the homepage metadata on every URL. The data is the same SEO_PAGES /
// SECTION_SEO / DEFAULT_SEO exported by src/services/seo.service.ts, so there is one source.
//
// Usage: node scripts/export-seo-pages.cjs [outputDir]
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const clientDir = path.resolve(__dirname, '..');
const sourcePath = path.join(clientDir, 'src', 'services', 'seo.service.ts');
const outputDir = path.resolve(process.argv[2] || path.join(clientDir, 'dist', 'xiaojuanschoolpayment.client', 'browser'));

if (!fs.existsSync(path.join(outputDir, 'index.html'))) {
  console.error(`export-seo-pages: ${outputDir} has no index.html; run ng build first.`);
  process.exit(1);
}

const { outputText } = ts.transpileModule(fs.readFileSync(sourcePath, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    experimentalDecorators: true,
  },
});

// Angular and rxjs imports are only used by the SeoService class, which is never instantiated
// here; any decorator or function they provide becomes a no-op.
const noop = () => noop;
const stub = new Proxy({}, { get: () => noop });
const loaded = { exports: {} };
new Function('require', 'module', 'exports', outputText)(() => stub, loaded, loaded.exports);
const { SEO_PAGES, SECTION_SEO, DEFAULT_SEO, DEFAULT_IMAGE, SITE_NAME, seoTitle } = loaded.exports;

if (!SEO_PAGES || !SECTION_SEO || !DEFAULT_SEO || !DEFAULT_IMAGE || !SITE_NAME || typeof seoTitle !== 'function') {
  console.error('export-seo-pages: seo.service.ts no longer exports SEO_PAGES, SECTION_SEO, DEFAULT_SEO, DEFAULT_IMAGE, SITE_NAME and seoTitle.');
  process.exit(1);
}

const problems = [];
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

const data = {
  siteName: SITE_NAME,
  default: toEntry(DEFAULT_SEO, 'DEFAULT_SEO'),
  pages: Object.fromEntries(Object.entries(SEO_PAGES).map(([route, page]) => [route, toEntry(page, route)])),
  sections: SECTION_SEO.map(({ prefix, page }) => ({ prefix, ...toEntry(page, `section ${prefix}`) })),
};

if (problems.length > 0) {
  console.error(`export-seo-pages: ${problems.join('; ')}`);
  process.exit(1);
}

const outputPath = path.join(outputDir, 'seo-pages.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`export-seo-pages: wrote ${Object.keys(data.pages).length} pages and ${data.sections.length} sections to ${path.relative(clientDir, outputPath)}`);
