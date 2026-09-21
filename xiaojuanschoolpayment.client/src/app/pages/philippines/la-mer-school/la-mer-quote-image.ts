import { CiaContentConfig } from '../cia-school/cia-content-config';
import { QuoteImageCardData, QuoteImageOptionalFeeItem } from '../../../components/quote-image-download-button.component';
import { groupLocalFees, groupPaymentLines, moneyLine } from '../../../components/school-group-quote';
import { applyEditableQuoteImageCopy, quoteMoney } from '../../../components/school-quote-plan';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { LaMerFamilyQuote, LaMerStudentQuote, laMerMoney } from './la-mer-quote';
import { LA_MER_HERO, LA_MER_SCHOOL_NAME } from './la-mer-content-config';

export interface LaMerRates { usdToCny: number; phpPerCny: number; date?: string; source: string; }
export const LA_MER_FALLBACK_RATES: LaMerRates = { usdToCny: 7.2, phpPerCny: 9, source: '备用汇率' };
export function buildLaMerQuoteImage(c: CiaContentConfig, students: LaMerStudentQuote[], family: LaMerFamilyQuote | null, rates: LaMerRates): QuoteImageCardData {
  const results = family ? [family.result] : students.map(s => s.result), first = results[0];
  const total = laMerMoney(results.reduce((n, r) => n + r.total, 0)), people = family ? family.people : students.length;
  const settings = c.quoteImageSettings;
  const fees = family ? groupLocalFees(family.memberFees) : groupLocalFees(results);
  const localTotal = fees.reduce((n, f) => n + f.total, 0);
  const heading = `EV La Mer ${family ? `亲子${people}人${family.weeks}周` : people > 1 ? `${people}人` : `${first.weeks}周`}报价`;
  const optional: QuoteImageOptionalFeeItem[] = [];
  const deposit = results.reduce((n, r) => n + r.deposit, 0);
  if (deposit) optional.push({ label: '住宿押金（可退）', amount: `${quoteMoney(deposit)} 比索`, cnyAmount: `约人民币 ${Math.round(deposit / rates.phpPerCny)} 元`, note: `${people}人合计；${c.localFees.find(f => f.id === 'deposit')?.note ?? ''}` });
  if (first.pickup) optional.push({ label: '机场接机', amount: `${quoteMoney(first.pickup)} 比索／参考`, cnyAmount: `约人民币 ${Math.round(first.pickup / rates.phpPerCny)} 元`, note: c.localFees.find(f => f.id === 'pickup')?.note ?? '' });
  for (const reference of [...new Set(results.flatMap(r => r.references))]) optional.push({ label: reference.split('：')[0], amount: '按实际发生另付', note: reference.split('：').slice(1).join('：') });
  if (family) {
    optional.unshift({ label: '亲子报名订金（预付款）', amount: `${quoteMoney(first.bookingDeposit)} 美元`, cnyAmount: `约人民币 ${Math.round(first.bookingDeposit * rates.usdToCny)} 元`, note: `${people}人；已计入套餐总价，付款后抵扣，不重复加收。` },
      { label: '抵扣订金后的套餐余款', amount: `${quoteMoney(first.balance)} 美元`, cnyAmount: `约人民币 ${Math.round(first.balance * rates.usdToCny)} 元`, note: `须于${first.paymentDue}前付清；套餐外费用另付。` });
    optional.push({ label: '亲子已包含项目', amount: '已含在套餐内', note: `${first.included.join('、')}，以及套餐课程、住宿、三餐、清洁及学校安排的校内活动。超额用电每千瓦时20比索另付。` });
  }
  const payment = family ? first.paymentLines.map((line, i) => ({ ...moneyLine(line), ...(i === 0 ? { detailTitle: family.selected?.name, detailSubtitle: `${first.start}–${first.end} · ${first.weeks}周`, note: `${family.version?.name}；${family.guardians}名监护人＋${family.children}名儿童（${family.childAges.slice(0, family.children).join('、')}岁）。儿童：${c.laMerPage?.familyChildSchedule}；监护人：${c.laMerPage?.familyGuardianSchedule}。` } : {}) })) : [
    ...students.flatMap((s, i) => s.plan.paymentItems().map(p => ({ ...p, label: people > 1 ? `学生${i + 1} · ${p.label}` : p.label,
      note: [p.note, p.icon === '课' ? settings.paymentNotes.course : settings.paymentNotes.accommodation].filter(Boolean).join('；') }))),
    ...groupPaymentLines(results, true).map(item => item.icon === '注' ? { ...item, note: settings.paymentNotes.registration } : item),
  ];
  const rateNote = `${rates.source}${rates.date ? `（${rates.date}）` : ''}；1美元＝${rates.usdToCny}人民币，1人民币＝${rates.phpPerCny}比索。支付时以实际汇率为准。`;
  const notes = [...settings.footerNotes.filter(n => !!family || !n.includes('亲子报名订金')),
    ...(family ? [`亲子套餐：${family.version?.name}，${family.seasonAt(family.start) === 'peak' ? '旺季' : '普通档期'}；${first.start}入住，${first.courseStart}开课，${first.end}离校。`, '报名不可转让或延至其他日期；出发前取消退还除订金外的剩余费用。儿童课余照护与外出由监护人负责。'] : []),
    ...(family ? ['距出发不足四周报名，请先与学校核对付款安排。'] : results.some(r => r.end >= '2027-01-01') ? ['2027普通课程旺季附加费档期尚未提供，涉及旺季时须另行核对；本次美元金额未计入未公布的附加费。'] : []),
    '签证费用按各成员所选签证及停留时间估算；教材、自选活动、超额用电和实际发生的服务按学校结算。', rateNote];
  const base = buildPhilippinesDetailedQuote({ schoolCode: 'EV-LAMER', schoolName: LA_MER_SCHOOL_NAME, filePrefix: 'EV-La-Mer', heroSrc: c.laMerPage?.gallery.find(g => g.enabled && g.category === '校园与泳池')?.url || LA_MER_HERO,
    weeks: first.weeks, startDate: first.start, usdToCny: rates.usdToCny, totalUsd: total, paymentItems: payment,
    localFeeItems: fees.map(f => ({ label: f.item, unit: f.unitLabel, quantity: String(f.quantity), amount: `${quoteMoney(f.total)} 比索`, note: f.note })),
    localFeeTotal: localTotal, localCurrencyName: '比索', localFeeCny: Math.round(localTotal / rates.phpPerCny), localFeeNote: settings.localFeeIntro,
    optionalFeeItems: optional, ruleNotes: notes, fullFeeDetails: true, localFeeTableLayout: 'web' });
  const quote = applyEditableQuoteImageCopy({ ...base,
    compactDetailedSections: true,
    headingText: heading, fileName: `${heading}-${first.start}.png`, totalCny: `人民币预计金额：约 ${Math.round(total * rates.usdToCny).toLocaleString('zh-CN')} 元`,
    studentItems: [...base.studentItems.filter(i => i.icon === '价'), { icon: '校', label: '学校', value: LA_MER_SCHOOL_NAME },
      { icon: '人', label: family ? '家庭成员' : '同行人数', value: family ? `${family.guardians}名监护人＋${family.children}名儿童` : `${people}人` },
      ...(family ? [{ icon: '房', label: '房型与日期', value: `${family.selected?.name}；${first.start}–${first.end}，${first.weeks}周` }] :
        results.map((r, i) => ({ icon: '日', label: people > 1 ? `学生${i + 1}` : '学习日期', value: `${r.start}入住 · ${r.courseStart}开课 · ${r.end}离校 · ${r.weeks}周` })))],
    totalNote: family ? `套餐订金${quoteMoney(first.bookingDeposit)}美元已计入总价，抵扣后余款${quoteMoney(first.balance)}美元。套餐外费用另列。` : '以上为应付学校美元金额，当地比索费用与可退押金另列。', expandTotalNote: true,
    exchangeRateText: rateNote, conversionRates: { usdToCny: rates.usdToCny, phpPerCny: rates.phpPerCny, date: rates.date },
    paymentSectionTitle: settings.paymentSectionTitle, localFeeTitle: settings.localFeeSectionTitle, serviceSectionTitle: settings.serviceSectionTitle,
    benefitItems: settings.benefits, serviceLocations: settings.serviceLocations, alumniBenefitTitle: settings.alumniBenefitTitle,
    alumniBenefitItems: [{ title: settings.alumniBenefitTitle, subtitle: '', text: settings.alumniBenefitText }],
    noteTitle: settings.noteSectionTitle, importantNotes: notes, note: '学校费用与到校费用分别支付；房型、名额及入学安排以学校确认为准。',
  }, settings, c.quoteSettings.promotions, c.localFees);
  return { ...quote, paymentItems: quote.paymentItems.map(item => item.promotionKey && settings.paymentNotes.promotion
    ? { ...item, note: [item.note, settings.paymentNotes.promotion].filter(Boolean).join('；') } : item) };
}
