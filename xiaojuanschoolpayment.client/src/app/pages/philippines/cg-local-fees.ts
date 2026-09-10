import { CiaLocalFeeRule } from './cia-school/cia-content-config';

export interface CgLocalFee {
  id?: string;
  item: string;
  amount: string;
  note: string;
  quantity: number;
  total: number;
  excluded?: boolean;
}

/** Shared, user-confirmed estimates for CG Banilad and Sparta, not a final school bill. */
export type CgVisaType = 'tourist30' | 'tourist59' | 'student' | 'work' | 'srrv' | 'sirv';
export const CG_2027_LOCAL_FEE_EFFECTIVE_CLASS_DATE = '2027-01-04';
export const CG_2027_LOCAL_FEE_EFFECTIVE_ARRIVAL_DATE = '2027-01-03';
const CG_VISA_LABELS: Record<CgVisaType, string> = {
  tourist30:'30天旅游签证', tourist59:'59天旅游签证', student:'学生签证',
  work:'工作签证', srrv:'SRRV绿卡', sirv:'SIRV卡',
};

export function estimateCgLocalFees(
  weeks: number,
  includeAirportPickup = false,
  accommodationWeeks = weeks,
  visaType: CgVisaType = 'tourist59',
  editableRules?: CiaLocalFeeRule[],
  entryStartDate = '',
) {
  const configured = (id: string) => editableRules?.find(rule => rule.id === id && rule.enabled);
  // Only the three weekly utilities change on the published 2027 effective date.
  // All other rows in the supplied fee sheet apply to 2026 entries as well.
  const uses2027WeeklyFees = entryStartDate >= CG_2027_LOCAL_FEE_EFFECTIVE_ARRIVAL_DATE;
  const usesFutureRule = (rule?: CiaLocalFeeRule) => uses2027WeeklyFees
    && (!rule || (!!rule.futureEffectiveStart && entryStartDate >= rule.futureEffectiveStart));
  const ruleAmount = (id: string, fallback: number, futureFallback = fallback) => {
    const rule = configured(id);
    return usesFutureRule(rule) ? rule?.futureAmount ?? futureFallback : rule?.amount ?? fallback;
  };
  const ruleName = (id: string, fallback: string, futureFallback = fallback) => {
    const rule = configured(id);
    return usesFutureRule(rule) ? rule?.futureName ?? futureFallback : rule?.name ?? fallback;
  };
  const ruleNote = (id: string, fallback: string, futureFallback = fallback) => {
    const rule = configured(id);
    return usesFutureRule(rule) ? rule?.futureNote ?? futureFallback : rule?.note ?? fallback;
  };
  const periodQuantity = (id: string, futurePeriodWeeks = 1, futureRounding: 'proportional' | 'ceil' = 'proportional') => {
    const rule = configured(id);
    if (accommodationWeeks <= 0) return 0;
    const future = usesFutureRule(rule);
    const periodWeeks = Math.max(1, future ? rule?.futurePeriodWeeks ?? futurePeriodWeeks : rule?.periodWeeks ?? 4);
    const rounding = future ? rule?.futureRounding ?? futureRounding : rule?.rounding ?? 'ceil';
    return rounding === 'proportional' ? accommodationWeeks / periodWeeks : Math.max(1, Math.ceil(accommodationWeeks / periodWeeks));
  };
  const periods = periodQuantity('management');
  // An initial 59-day visa is assumed; each extension covers another 30 days.
  const longTermVisa = !['tourist30','tourist59'].includes(visaType);
  const initialDays = visaType === 'tourist30' ? 30 : 59;
  const published2027TierCount = visaType === 'tourist30'
    ? Math.ceil(Math.max(0, weeks - 4) / 4)
    : Math.ceil(Math.max(0, weeks - 8) / 4);
  const visaExtensionCount = longTermVisa ? 0 : weeks <= 24
    ? published2027TierCount
    : Math.ceil(Math.max(0, weeks * 7 - initialDays) / 30);
  // Public fee tiers are indexed by extension count, not by four-week study periods.
  const visaRule = configured('visa-extension');
  const configuredVisaRates = usesFutureRule(visaRule) ? visaRule?.futureRates : visaRule?.rates;
  const visaRates = configuredVisaRates?.length
    ? [...configuredVisaRates]
    : [6390, 4460, 4460, 4460, 4460];
  // The supplied 2027 table gives the fifth 30-day-visa extension as PHP 5,870;
  // a 59-day entry keeps PHP 4,460 for later extensions, including the approved >24-week estimate.
  if (visaType === 'tourist30') visaRates[4] = 5870;
  const visaExtensionFee = Array.from(
    { length: visaExtensionCount },
    (_, index) => visaRates[index] ?? (index >= 5 ? 4460 : visaRates.at(-1) ?? ruleAmount('visa-extension', 5160, 6390)),
  ).reduce((sum, value) => sum + value, 0);
  const visaRate = visaType === 'tourist30'
    ? visaExtensionCount <= 1
      ? `首次${visaRates[0].toLocaleString('zh-CN')} 比索`
      : `首次${visaRates[0].toLocaleString('zh-CN')}比索；第2${visaExtensionCount > 2 ? `–${Math.min(visaExtensionCount, 4)}` : ''}次4,460比索/次`
        + (visaExtensionCount >= 5 ? '；第5次5,870比索' : '')
        + (visaExtensionCount > 5 ? '；第6次起4,460比索/次' : '')
    : visaExtensionCount <= 1
      ? `首次${visaRates[0].toLocaleString('zh-CN')} 比索`
      : `首次${visaRates[0].toLocaleString('zh-CN')}比索；第2次${(visaRates[1] ?? visaRates[0]).toLocaleString('zh-CN')}比索`
        + (visaExtensionCount > 2 ? `；其余${(visaRates[2] ?? visaRates.at(-1) ?? visaRates[0]).toLocaleString('zh-CN')}比索/次` : '');
  const visaLabel = CG_VISA_LABELS[visaType];
  const confirmation = `${visaLabel}暂按免收预估；须由顾问向学校确认政策是否调整及是否免收。`;
  const visaNote = (visaExtensionCount === 0
    ? `按持${visaType==='tourist59'?'59天签证':visaLabel}预估，本次无需续签。`
    : `按持${visaType==='tourist59'?'59天签证':visaLabel}、每次续签延长30天预估。`)
    + (visaExtensionCount > 5 ? '第6次起沿用第5次费用估算。' : '')
    + (visaType==='tourist59'?'若持30天签证，需另行核算；':'') + '以实际办理及收费为准。';
  const acrQuantity = longTermVisa ? 0 : (visaExtensionCount > 0 ? 1 : 0);
  const arpQuantity = longTermVisa || visaExtensionCount > 0 ? 1 : 0;
  const note = '学杂费均为预估金额，仅供准备比索现金参考，具体以学校及相关部门到校实收为准。' +
    (uses2027WeeklyFees
      ? `本报价已按2027年1月4日起入学新生标准计算；报价中的${CG_2027_LOCAL_FEE_EFFECTIVE_ARRIVAL_DATE.replaceAll('-', '/')}周日入住对应次日开课。校方周数总额另含1,200比索接机及每周250比索可退押金，本站合计沿用既有口径不含这两项及按实际购买的教材。`
      : `证件、签证、教材、接机和按周押金已按学校最新明细计算；水费、综合管理费和基础电费仍按${CG_2027_LOCAL_FEE_EFFECTIVE_CLASS_DATE.replaceAll('-', '/')}前标准，届时自动切换为每周300、750和500比索；具体以学校及相关部门实际收费为准。`) +
    (!uses2027WeeklyFees && accommodationWeeks === 3 ? '3周管理费、电费和水费按4周预估。' : '') +
    (weeks !== accommodationWeeks ? `签证按${weeks}周停留跨度（含间隔）预估；管理费、电费和水费按${accommodationWeeks}周住宿预估。` : '') +
    (weeks > 24 ? '超过24周仅为延伸预估：后续签证按最近一档费用计算；SSP等许可本次先计一次，续办、更新及额外教材费用以学校确认为准。' : '');
  const ssp = ruleAmount('ssp', 7800), sspCard = ruleAmount('ssp-i-card', 4500);
  const acr = ruleAmount('acr-i-card', 4500), arp = ruleAmount('arp', 300);
  const managementPeriods = periodQuantity('management'), electricityPeriods = periodQuantity('electricity'), waterPeriods = periodQuantity('water');
  const management = ruleAmount('management', 2000, 750), electricity = ruleAmount('electricity', 2000, 500), water = ruleAmount('water', 500, 300);
  const books = ruleAmount('books', 250), pickup = ruleAmount('pickup', 1200), deposit = ruleAmount('deposit', 250);
  const booksRule = configured('books');
  const booksMaximum = usesFutureRule(booksRule)
    ? booksRule?.futureSecondaryAmount ?? booksRule?.secondaryAmount ?? 450
    : booksRule?.secondaryAmount ?? 450;
  const depositQuantity = accommodationWeeks;
  const periodLabel = (id: string) => usesFutureRule(configured(id))
    ? configured(id)?.futurePeriodWeeks ?? 1
    : configured(id)?.periodWeeks ?? 4;
  const acrDefaultNote = visaType==='tourist59'
    ? '按持59天签证预估，学习超过8周计入一次；若持30天签证，约第4周首次续签时可能提前产生，以实际办理为准'
    : `按${visaLabel}预估，首次续签时计入一次；以实际办理为准`;
  const acrRule = configured('acr-i-card'), arpRule = configured('arp');
  const configuredAcrNote = usesFutureRule(acrRule) ? acrRule?.futureNote : acrRule?.note;
  const configuredArpNote = usesFutureRule(arpRule) ? arpRule?.futureNote : arpRule?.note;
  const arpDefaultNote = longTermVisa
    ? '长期签证仍计收一次，暂按300比索预估；实际政策及收费须顾问向学校确认。'
    : '首次续签时计入一次，暂按300比索预估；实际政策及收费须顾问向学校确认。';
  const defaultArpNotes = [
    '首次续签或长期签证时计入一次；须顾问向学校确认。',
    '随首次旅游签证续签计入一次；长期签证是否收取须由顾问向学校确认。',
  ];
  const arpNote = configuredArpNote && !defaultArpNotes.includes(configuredArpNote)
    ? configuredArpNote
    : uses2027WeeklyFees
      ? longTermVisa
        ? '长期签证暂按一次300比索生物识别申请费预估；实际政策及收费须顾问向学校确认。'
        : '首次旅游签证续签时计入一次300比索生物识别申请费；以学校实际办理为准。'
      : arpDefaultNote;
  const fees: CgLocalFee[] = [
    { id: 'ssp', item: ruleName('ssp', 'SSP特殊学习许可证'), amount: `${ssp.toLocaleString('zh-CN')} 比索 / 次`, quantity: longTermVisa?0:1, total: longTermVisa?0:ssp, note: longTermVisa?`${ruleNote('ssp', confirmation)} ${confirmation}`:ruleNote('ssp', '移民局收取，按报名学习时长办理；续费或换校需重新办理') },
    { id: 'ssp-i-card', item: ruleName('ssp-i-card', 'ACR E-CARD（SSP）'), amount: `${sspCard.toLocaleString('zh-CN')} 比索 / 次`, quantity: longTermVisa?0:1, total: longTermVisa?0:sspCard, note: longTermVisa?`${ruleNote('ssp-i-card', confirmation)} ${confirmation}`:ruleNote('ssp-i-card', '校方最新明细列4,500比索，与SSP同时办理；换学校需携带证明，否则需要重新办理。') },
    { id: 'acr-i-card', item: ruleName('acr-i-card', 'ACR I-CARD（旅游签证）'), amount: `${acr.toLocaleString('zh-CN')} 比索 / 次`, quantity: acrQuantity, total: acr * acrQuantity, note: longTermVisa?`${ruleNote('acr-i-card', confirmation)} ${confirmation}`:(configuredAcrNote && configuredAcrNote !== '按持59天签证预估，学习超过8周计入一次；若持30天签证，约第4周首次续签时可能提前产生，以实际办理为准' ? configuredAcrNote : acrDefaultNote) },
    { id: 'arp', item: ruleName('arp', '生物识别申请费'), amount: `${arp.toLocaleString('zh-CN')} 比索 / 次`, quantity: arpQuantity, total: arp * arpQuantity, note: arpNote },
    { id: 'management', item: ruleName('management', '维护管理费', '综合管理费'), amount: `${management.toLocaleString('zh-CN')} 比索 / ${periodLabel('management')}周`, quantity: managementPeriods, total: management * managementPeriods, note: ruleNote('management', '每4周预估1份，具体以学校实收为准', '2027年1月4日起入学新生按每周750比索计算。') },
    { id: 'electricity', item: ruleName('electricity', '电费', '基础电费（不含空调）'), amount: `${electricity.toLocaleString('zh-CN')} 比索 / ${periodLabel('electricity')}周`, quantity: electricityPeriods, total: electricity * electricityPeriods, note: ruleNote('electricity', '预估金额；空调或超额用电按学校计量另收，参考25比索/度', '每周500比索；空调用电按实际使用另收25比索／千瓦时，并从押金中结算。') },
    { id: 'water', item: ruleName('water', '水费'), amount: `${water.toLocaleString('zh-CN')} 比索 / ${periodLabel('water')}周`, quantity: waterPeriods, total: water * waterPeriods, note: ruleNote('water', '每4周预估1份，具体以学校实收为准', '2027年1月4日起入学新生按每周300比索计算。') },
    { id: 'visa-extension', item: ruleName('visa-extension', '旅游签证续签'), amount: visaRate, quantity: visaExtensionCount, total: visaExtensionFee, note: longTermVisa?`${ruleNote('visa-extension', confirmation)} ${confirmation}`:visaNote },
    { id: 'books', item: ruleName('books', '教材费'), amount: `${books.toLocaleString('zh-CN')}–${booksMaximum.toLocaleString('zh-CN')} 比索 / 本`, quantity: 0, total: 0, note: ruleNote('books', '每本250–450比索，按课程及实际购买数量结算；校方周数总额未计教材。') },
    { id: 'pickup', item: ruleName('pickup', '宿务马克坦机场接机（可选）'), amount: `${pickup.toLocaleString('zh-CN')} 比索 / 次`, quantity: includeAirportPickup ? 1 : 0, total: includeAirportPickup ? pickup : 0, note: ruleNote('pickup', '校方最新明细列一次1,200比索接机；本站保留为可选参考，不计入默认合计。'), excluded: true },
    { id: 'deposit', item: ruleName('deposit', '住宿押金（可退）'), amount: `${deposit.toLocaleString('zh-CN')} 比索 / 住宿周`, quantity: depositQuantity, total: deposit * depositQuantity, note: ruleNote('deposit', '每住宿周250比索；离校时扣除空调等实际费用后按校规退还，本站不计入学杂费合计。'), excluded: true },
  ].filter(row => !editableRules || !!configured(row.id!));
  return { periods, visaExtensionCount, visaExtensionFee, note, fees };
}
