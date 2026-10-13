const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..', 'src');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item =>
  item.isDirectory() ? walk(path.join(dir, item.name)) : [path.join(dir, item.name)]);
const files = walk(root).filter(file => /\.(ts|html)$/.test(file) && !file.endsWith('.spec.ts'));
let pageCount = 0;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  assert(!/BaiduExchangeRates|parseBaiduRates|\/currency\/exchange-rates|百度汇率/.test(source), file + ': obsolete paid source');
  if (!file.endsWith('.component.ts')) continue;
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  let ownsRates = false;
  const visit = node => {
    if (ts.isPropertyDeclaration(node) && ['usdToCny', 'phpPerCny'].includes(node.name?.getText(ast))) {
      ownsRates = true;
      assert(node.initializer?.getText(ast) === 'Number.NaN', file + ': fixed/default conversion rate');
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  if (file.includes(path.sep + 'pages' + path.sep) && ownsRates) {
    assert(source.includes('connectQuoteRates'), file + ': page bypasses shared rates');
    pageCount++;
  }
}
assert(pageCount >= 44, 'quote coverage unexpectedly decreased');
const service = fs.readFileSync(path.join(root, 'services', 'exchange-rate.service.ts'), 'utf8');
assert(service.includes('https://api.frankfurter.dev/v1/latest?base=CNY&providers=ECB'));
assert(!service.includes('AppCode'));
const exporter = fs.readFileSync(path.join(root, 'app', 'components', 'philippines-quote-image-exporter.component.ts'), 'utf8');
assert(exporter.includes('Math.round(totalMoney.value * this.usdToCny)'));
assert(!exporter.includes('this.parseFirstNumber(displayedCny)'));
console.log(`${pageCount} public/employee quote components use shared free currency rates; La Mer uses the same service through its rates adapter.`);
