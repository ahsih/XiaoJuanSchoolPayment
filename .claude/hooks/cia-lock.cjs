#!/usr/bin/env node
// CIA page lock (user decision 2026-11-20).
// The CIA page is finished. Any change to its files needs the user's explicit approval, so editing
// another school can never change CIA by accident. Claude Code runs this before Edit/Write/
// MultiEdit/NotebookEdit and before shell commands; for a CIA file it returns "ask", which shows the
// user a permission prompt. Allowing that prompt unlocks only that one change.
// To change what is locked, edit LOCKED_PATH / LOCKED_WORD below (this file is locked too).

const LOCKED_PATH = [
  /\/pages\/philippines\/cia-school\//,
  /\/pages\/philippines\/cia-student-review\//,
  /\/public\/assets\/cia\//,
  /\/public\/assets\/cia-video\//,
  /\/\.claude\/hooks\/cia-lock\.cjs$/,
  /\/\.claude\/settings(\.local)?\.json$/,
];

// Shell commands: a CIA path or CIA file name together with a write operation.
const LOCKED_WORD = /cia-school|cia-student-review|assets[\\/]+cia(?:[\\/]|-video)|cia-lock\.cjs|\.claude[\\/]+settings(?:\.local)?\.json|\bcia-[a-z0-9-]+(?:\.[a-z0-9]+)*\.(?:ts|html|css|scss|json|webp|png|jpe?g|mp4|webm|m4v)\b/i;
const WRITE_OP = new RegExp([
  String.raw`\bsed\b[^|;&]*\s-i`,
  String.raw`\bperl\b[^|;&]*\s-i`,
  String.raw`\b(?:tee|rm|rmdir|mv|cp|truncate|touch|unlink|install|ffmpeg|cwebp|magick|convert|patch)\b`,
  String.raw`\bgit\s+(?:rm|mv|checkout|restore|apply|reset|stash|revert|cherry-pick|merge|rebase|am)\b`,
  String.raw`\b(?:Set-Content|Add-Content|Out-File|Clear-Content|Remove-Item|Move-Item|Copy-Item|Rename-Item|New-Item)\b`,
  String.raw`\b(?:writeFile|appendFile|copyFile|rename|unlink|rmSync|rm)(?:Sync)?\s*\(`,
  String.raw`\bWriteAll(?:Text|Bytes|Lines)\b`,
  String.raw`\bopen\([^)]*['"][wa]b?\+?['"]`,
].join('|'), 'i');

// A redirect into a real file (not 2>&1, >/dev/null or >$null).
function redirectsToFile(command) {
  const pattern = /(?<![=\-<>])>{1,2}(?!>)\s*(\S*)/g;
  let match;
  while ((match = pattern.exec(command))) {
    const target = match[1];
    if (!target || target.startsWith('&') || /^(?:\/dev\/null|\$null|nul)$/i.test(target)) continue;
    return true;
  }
  return false;
}

function normalise(path) {
  return '/' + String(path || '').replace(/\\/g, '/').replace(/^\/+/, '');
}

function isLockedPath(path) {
  const value = normalise(path);
  return LOCKED_PATH.some(pattern => pattern.test(value));
}

function isLockedCommand(command) {
  const text = String(command || '');
  if (!LOCKED_WORD.test(text)) return false;
  return WRITE_OP.test(text) || redirectsToFile(text);
}

function decide(input) {
  const tool = input.tool_name || '';
  const args = input.tool_input || {};
  if (tool === 'Bash' || tool === 'PowerShell') return isLockedCommand(args.command);
  return isLockedPath(args.file_path || args.notebook_path || args.path);
}

function readHookInput() {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { raw += chunk; });
  process.stdin.on('end', () => {
    let input = {};
    try { input = JSON.parse(raw || '{}'); } catch { return; }
    if (!decide(input)) return;
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: 'CIA页面已锁定：这一步会修改CIA的文件。只有你明确同意解锁时才允许；允许本次操作只解锁这一处修改。',
      },
    }));
  });
}

function selfTest() {
  // Manual check: node .claude/hooks/cia-lock.cjs --self-test
  const cases = [
    [{ tool_name: 'Edit', tool_input: { file_path: 'C:\\repo\\xiaojuanschoolpayment.client\\src\\app\\pages\\philippines\\cia-school\\cia-page-content.ts' } }, true],
    [{ tool_name: 'Write', tool_input: { file_path: '/repo/xiaojuanschoolpayment.client/public/assets/cia/new.webp' } }, true],
    [{ tool_name: 'Edit', tool_input: { file_path: '/repo/xiaojuanschoolpayment.client/src/app/pages/philippines/ev-school/ev-page-profile.ts' } }, false],
    [{ tool_name: 'Edit', tool_input: { file_path: '/repo/xiaojuanschoolpayment.client/public/assets/ciec/a.webp' } }, false],
    [{ tool_name: 'Bash', tool_input: { command: 'cat xiaojuanschoolpayment.client/src/app/pages/philippines/cia-school/cia-page-content.ts | head' } }, false],
    [{ tool_name: 'Bash', tool_input: { command: 'grep -n x cia-school/cia-quote-engine.ts 2>&1 >/dev/null' } }, false],
    [{ tool_name: 'Bash', tool_input: { command: 'sed -i "s/a/b/" cia-page-content.ts' } }, true],
    [{ tool_name: 'Bash', tool_input: { command: 'echo x > public/assets/cia/a.txt' } }, true],
    [{ tool_name: 'PowerShell', tool_input: { command: 'Set-Content -Path .\\cia-school\\x.ts -Value 1' } }, true],
    [{ tool_name: 'Bash', tool_input: { command: 'sed -i "s/a/b/" ev-page-profile.ts' } }, false],
    [{ tool_name: 'Bash', tool_input: { command: 'git diff -- xiaojuanschoolpayment.client/src/app/pages/philippines/cia-school' } }, false],
  ];
  const failed = cases.filter(([input, expected]) => decide(input) !== expected);
  console.log(failed.length ? `FAILED ${failed.length}: ${JSON.stringify(failed.map(([input]) => input.tool_input))}` : `ok ${cases.length}`);
  process.exitCode = failed.length ? 1 : 0;
}

if (process.argv[2] === '--self-test') selfTest();
else readHookInput();
