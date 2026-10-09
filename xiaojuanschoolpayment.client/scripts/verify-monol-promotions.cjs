const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, file);
const { createDefaultMonolContentConfig, cloneMonolContentConfig } = require('../src/app/pages/philippines/monol-school/monol-content-config.ts');
const { MonolStudentQuote } = require('../src/app/pages/philippines/monol-school/monol-student-quote.ts');
const { groupPaymentLines } = require('../src/app/components/school-group-quote.ts');
function student() {
  const config = createDefaultMonolContentConfig();
  const quote = new MonolStudentQuote({ courseFees: config.courses.map(c => ({...c, suitable: c.suitable})), roomFees: config.rooms, registrationFee: 100, shortStayRatios: config.quoteSettings.shortStayRatios, promotionRules: config.quoteSettings.promotions, localFeeRules: config.localFees });
  // The adapter names accommodation prices 'fee', matching the versioned catalog.
  quote.selectedRegistrationDate = '2026-10-08';
  setStay(quote, '2026-10-11', 4);
  return quote;
}
function setStay(q, startDate, weeks) { for (const row of [...q.quotePlan.courses, ...q.quotePlan.rooms]) Object.assign(row, {startDate, weeks}); }
let q = student();
assert.equal(q.quoteUsd, 950);
setStay(q, '2027-06-13', 12);
assert.equal(q.offSeasonCourseDiscount, 100);
assert.equal(q.offSeasonRoomDiscount, 100);
q.applySnsPromotion = true;
q.quotePlan.rooms[0].optionId = 'premium-single-room';
assert.equal(q.snsDiscount, 0);
q.quotePlan.rooms[0].optionId = 'standard-single-room';
assert.equal(q.snsDiscount, 100);
q.selectedRegistrationDate = '2027-01-01';
assert.equal(q.offSeasonCourseDiscount, 0);
assert.equal(q.snsDiscount, 0);
q = student();
for (const [weeks, amount] of [[16, 150], [20, 200], [24, 300]]) {
  setStay(q, '2026-11-29', weeks);
  assert.equal(q.longTermDiscount, amount);
  assert.equal(q.christmasDiscount, 100);
  assert.equal(q.quoteUsd, q.quoteBeforeDiscounts - q.registrationDiscount - q.offSeasonCourseDiscount - q.offSeasonRoomDiscount - amount - 100);
}
q.selectedRegistrationDate = '2026-09-06';
assert.equal(q.longTermDiscount, 0);
setStay(q, '2027-01-10', 4);
assert.equal(q.christmasDiscount, 100);
setStay(q, '2027-01-17', 4);
assert.equal(q.christmasDiscount, 0);
setStay(q, '2026-11-29', 3);
assert.equal(q.christmasDiscount, 0);
setStay(q, '2028-01-02', 4);
assert.equal(q.isBreakfastEligible, false);
const a = student(), b = student();
setStay(a, '2026-11-29', 16); setStay(b, '2026-11-29', 20);
assert.equal(groupPaymentLines([a,b], true).find(line => line.label === '长住优惠').amount, '− 350 美元');
assert.equal(groupPaymentLines([a,b], true).find(line => line.label === '圣诞新年优惠').amount, '− 200 美元');
const old = createDefaultMonolContentConfig(); delete old.quoteSettings.monolPromotionPolicyVersion;
old.quoteSettings.promotions = old.quoteSettings.promotions.filter(rule => rule.id === 'monol-registration-waiver');
const upgraded = cloneMonolContentConfig(old);
assert(upgraded.quoteSettings.promotions.some(rule => rule.id === 'monol-christmas'));
upgraded.quoteSettings.promotions.find(rule => rule.id === 'monol-sns').enabled = false;
assert.equal(cloneMonolContentConfig(upgraded).quoteSettings.promotions.find(rule => rule.id === 'monol-sns').enabled, false);
console.log('MONOL poster calculation, date boundaries, group image payment lines and published-config upgrade checks passed.');
