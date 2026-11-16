#!/usr/bin/env node
// Writes content/schools/<id>.json next to the built index.html (runs after `ng build` via
// `npm run build`). The WeChat mini program renders these files as native school pages, so the
// website and mini program show the same text from one source. The builders live in
// src/app/mini-program/school-pages.ts; the format is src/app/mini-program/school-mini-page.ts.
//
// Usage: node scripts/export-mini-program-content.cjs [outputDir]
const fs = require('fs');
const path = require('path');

const clientDir = path.resolve(__dirname, '..');
const entry = path.join(clientDir, 'src', 'app', 'mini-program', 'school-pages.ts');
const outputDir = path.resolve(process.argv[2] || path.join(clientDir, 'dist', 'xiaojuanschoolpayment.client', 'browser'));

if (!fs.existsSync(path.join(outputDir, 'index.html'))) {
  console.error(`export-mini-program-content: ${outputDir} has no index.html; run ng build first.`);
  process.exit(1);
}

let esbuild;
try {
  esbuild = require('esbuild'); // ships with @angular/build
} catch {
  console.error('export-mini-program-content: esbuild is not installed; run npm ci.');
  process.exit(1);
}

// The page builders are pure data code, so bundle them for Node and evaluate the result.
const { outputFiles } = esbuild.buildSync({
  entryPoints: [entry],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  logLevel: 'silent',
});
const loaded = { exports: {} };
new Function('require', 'module', 'exports', outputFiles[0].text)(require, loaded, loaded.exports);
const pages = loaded.exports.MINI_PROGRAM_SCHOOL_PAGES;
if (!pages || typeof pages !== 'object') {
  console.error('export-mini-program-content: school-pages.ts no longer exports MINI_PROGRAM_SCHOOL_PAGES.');
  process.exit(1);
}

const schoolsDir = path.join(outputDir, 'content', 'schools');
fs.mkdirSync(schoolsDir, { recursive: true });
const problems = [];
const written = [];
for (const [id, build] of Object.entries(pages)) {
  const page = build();
  if (page.schemaVersion !== 1 || page.id !== id) problems.push(`${id}: schemaVersion must be 1 and id must be "${id}"`);
  if (!page.hero || !page.hero.title || !Array.isArray(page.sections) || page.sections.length === 0) problems.push(`${id}: missing hero or sections`);
  // Sections must belong to a standard template part (MiniSectionKind); the mini program orders them.
  const kinds = new Set(['overview', 'fit', 'courses', 'rooms', 'fees', 'packages', 'features', 'campus', 'videos', 'calendar', 'policies', 'reviews', 'faq', 'contact']);
  for (const section of page.sections || []) {
    if (!kinds.has(section.kind)) problems.push(`${id}: section kind "${section.kind}" is not a template part`);
  }
  const json = JSON.stringify(page);
  // Images and videos are loaded from the website; a relative path without a leading slash would 404 there.
  for (const match of json.matchAll(/"(?:src|image|poster|avatar|qr)":"([^"]*)"/g)) {
    if (!/^(\/[^/]|https:\/\/)/.test(match[1])) problems.push(`${id}: asset "${match[1]}" must start with / or https://`);
  }
  fs.writeFileSync(path.join(schoolsDir, `${id}.json`), json, 'utf8');
  written.push(`${id}.json (${Math.round(Buffer.byteLength(json) / 1024)} KB)`);
}

if (problems.length > 0) {
  console.error(`export-mini-program-content: ${problems.join('; ')}`);
  process.exit(1);
}
console.log(`export-mini-program-content: wrote ${written.join(', ')} to ${path.relative(clientDir, schoolsDir)}`);
