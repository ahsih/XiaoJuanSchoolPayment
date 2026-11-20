#!/usr/bin/env node
// Keeps every consultant's avatar and WeChat QR code fixed (user decision 2026-11-21).
// SIDA_CONSULTANT_MEDIA in src/app/components/sida-consultants.ts is the only place that names
// those files. This check runs before `ng build` and fails when:
//   - a file listed there is missing from public/,
//   - any other source file points at a consultant picture under /assets/contact/ directly,
//   - public/assets holds another picture named after a consultant (an old or duplicate copy),
//   - the study60 page's QR code (public/study60/img/qr.png) is not the same file as Jenny's.
// Run alone with `node scripts/check-consultant-media.cjs`.
'use strict';

const fs = require('fs');
const path = require('path');

const clientRoot = path.resolve(__dirname, '..');
const publicRoot = path.join(clientRoot, 'public');
const mediaFile = path.join(clientRoot, 'src', 'app', 'components', 'sida-consultants.ts');
const errors = [];

const mediaSource = fs.readFileSync(mediaFile, 'utf8');
const block = /SIDA_CONSULTANT_MEDIA[^=]*=\s*\{([\s\S]*?)\n\};/.exec(mediaSource);
if (!block) {
  console.error('check-consultant-media: SIDA_CONSULTANT_MEDIA was not found in sida-consultants.ts.');
  process.exit(1);
}
const media = {};
for (const match of block[1].matchAll(/(\w+):\s*\{\s*avatarSrc:\s*'([^']+)',\s*qrSrc:\s*'([^']+)'\s*\}/g)) {
  media[match[1]] = { avatarSrc: match[2], qrSrc: match[3] };
}
const names = Object.keys(media);
if (names.length === 0) errors.push('SIDA_CONSULTANT_MEDIA lists no consultants.');

const allowed = new Set();
for (const [name, files] of Object.entries(media)) {
  for (const src of [files.avatarSrc, files.qrSrc]) {
    if (!src.startsWith('/assets/contact/') || src.includes('?')) {
      errors.push(`${name}: ${src} must be a plain /assets/contact/ path.`);
    }
    if (!fs.existsSync(path.join(publicRoot, src))) errors.push(`${name}: ${src} is missing from public/.`);
    allowed.add(path.basename(src).toLowerCase());
  }
}

// Old spellings stay in the pattern so a stale reference to them is caught too.
const keys = [...new Set([...names.map(name => name.toLowerCase()), 'penin'])];
const keyPattern = keys.join('|');
const pictureName = new RegExp(`^(${keyPattern})[-_.]`, 'i');
const directPath = new RegExp(`/assets/(contact/)?(${keyPattern})[-_][^'"\\s)]*`, 'gi');

for (const dir of [path.join(publicRoot, 'assets'), path.join(publicRoot, 'assets', 'contact')]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !pictureName.test(entry.name)) continue;
    if (dir.endsWith('contact') && allowed.has(entry.name.toLowerCase())) continue;
    errors.push(`public/${path.relative(publicRoot, path.join(dir, entry.name)).replace(/\\/g, '/')} is an extra consultant picture; use the files in SIDA_CONSULTANT_MEDIA.`);
  }
}

const scanRoots = [path.join(clientRoot, 'src'), path.join(publicRoot, 'content'), path.join(publicRoot, 'study60', 'index.html')];
const scanExtensions = new Set(['.ts', '.html', '.css', '.scss', '.json', '.js']);
function scan(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target)) scan(path.join(target, entry));
    return;
  }
  if (!scanExtensions.has(path.extname(target)) || path.resolve(target) === mediaFile) return;
  const text = fs.readFileSync(target, 'utf8');
  for (const match of text.matchAll(directPath)) {
    const line = text.slice(0, match.index).split('\n').length;
    errors.push(`${path.relative(clientRoot, target).replace(/\\/g, '/')}:${line} points at ${match[0]} directly; use SIDA_CONSULTANT_MEDIA.`);
  }
}
scanRoots.forEach(scan);

const jenny = media.Jenny;
const study60Qr = path.join(publicRoot, 'study60', 'img', 'qr.png');
if (jenny && fs.existsSync(study60Qr) && fs.existsSync(path.join(publicRoot, jenny.qrSrc))
  && !fs.readFileSync(study60Qr).equals(fs.readFileSync(path.join(publicRoot, jenny.qrSrc)))) {
  errors.push(`public/study60/img/qr.png differs from ${jenny.qrSrc}; copy Jenny's QR code over it.`);
}

if (errors.length) {
  console.error('check-consultant-media: consultant avatars and QR codes must come from SIDA_CONSULTANT_MEDIA.');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(`check-consultant-media: ${names.length} consultants, avatars and QR codes fixed.`);
