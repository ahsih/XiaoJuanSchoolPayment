// Keep the insert-only server baseline identical to the frontend's fallback configuration.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = path.resolve(__dirname, '../src/app/pages/philippines/la-mer-school/la-mer-content-config.ts');
const target = path.resolve(__dirname, '../../XiaoJuanSchoolPayment.Server/Data/Seed/ev-la-mer-content.json');
const output = ts.transpileModule(fs.readFileSync(source, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(output, context, { filename: source });
const json = JSON.stringify(context.exports.createDefaultLaMerContentConfig(), null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n') !== json) {
    throw new Error('La Mer seed differs from the fallback. Run node scripts/generate-la-mer-seed.cjs.');
  }
  console.log('La Mer frontend fallback and server seed match.');
} else {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, json);
  console.log('Updated La Mer insert-only seed. Existing database revisions are not changed.');
}
