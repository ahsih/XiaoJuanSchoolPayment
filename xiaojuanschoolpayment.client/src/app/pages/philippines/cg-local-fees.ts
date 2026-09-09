import { CiaLocalFeeRule } from './cia-school/cia-content-config';

export interface CgLocalFee {
  item: string;
  amount: string;
  note: string;
  quantity: number;
  total: number;
  excluded?: boolean;
}

/** Shared, user-confirmed estimates for CG Banilad and Sparta, not a final school bill. */
export type CgVisaType = 'tourist30' | 'tourist59' | 'student' | 'work' | 'srrv' | 'sirv';
const CG_VISA_LABELS: Record<CgVisaType, string> = {
  tourist30:'30天旅游签证', tourist59:'59天旅游签证', student:'学生签证',
  work:'工作签证', srrv:'SRRV绿卡', sirv:'SIRV卡',
};

export function estimateCgLocalFees(weeks: number, includeAirportPickup = false, accommodationWeeks = weeks, visaType: CgVisaType = 'tourist59', editableRules?: CiaLocalFeeRule[]) {
  const configured = (id: string) => editableRules?.find(rule => rule.id === id && rule.enabled);
  const ruleAmount = (id: string, fallback: number) => configured(id)?.amount ?? fallback;
  const ruleName = (id: string, fallback: string) => configured(id)?.name ?? fallback;
  const ruleNote = (id: string, fallback: string) => configured(id)?.note ?? fallback;
  const periodQuantity = (id: string) => {
    const rule = configured(id);
    if (!rule) return accommodationWeeks > 0 && accommodationWeeks < 3 ? accommodationWeeks / 4 : Math.max(1, Math.ceil(accommodationWeeks / 4));
    if (accommodationWeeks <= 0) return 0;
    const periodWeeks = Math.max(1, rule.periodWeeks ?? 4);
    return rule.rounding === 'proportional' ? accommodationWeeks / periodWeeks : Math.max(1, Math.ceil(accommodationWeeks / periodWeeks));
  };
  const periods = accommodationWeeks > 0 && accommodationWeeks < 3 ? accommodationWeeks / 4 : Math.max(1, Math.ceil(accommodationWeeks / 4));
  // An initial 59-day visa is assumed; each extension covers another 30 days.
  const longTermVisa = !['tourist30','tourist59'].includes(visaType);
  const initialDays = visaType === 'tourist30' ? 30 : 59;
  const visaExtensionCount = longTermVisa ? 0 : Math.ceil(Math.max(0, weeks * 7 - initialDays) / 30);
  // Public fee tiers are indexed by extension count, not by four-week study periods.
  const visaRule = configured('visa-extension');
  const visaRates = visaRule?.rates?.length ? visaRule.rates : [5160, 6390, 4460, 4460, 4460];
  const visaExtensionFee = visaRule
    ? Array.from({ length: visaExtensionCount }, (_, index) => visaRates[index] ?? visaRates.at(-1) ?? visaRule.amount).reduce((sum, value) => sum + value, 0)
    : ([0, 5160, 11550, 16010, 20470, 24930][visaExtensionCount] ?? 24930 + (visaExtensionCount - 5) * 4460);
  const visaRate = visaExtensionCount <= 1
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
    (accommodationWeeks === 3 ? '3周管理费、电费和水费按4周预估。' : '') +
    (weeks !== accommodationWeeks ? `签证按${weeks}周停留跨度（含间隔）预估；管理费、电费和水费按${accommodationWeeks}周住宿预估。` : '') +
    (weeks > 24 ? '超过24周仅为延伸预估：后续签证按最近一档费用计算；SSP等许可本次先计一次，续办、更新及额外教材费用以学校确认为准。' : '');
  const ssp = ruleAmount('ssp', 7800), sspCard = ruleAmount('ssp-i-card', 4500);
  const acr = ruleAmount('acr-i-card', 4500), arp = ruleAmount('arp', 300);
  const managementPeriods = periodQuantity('management'), electricityPeriods = periodQuantity('electricity'), waterPeriods = periodQuantity('water');
  const management = ruleAmount('management', 2000), electricity = ruleAmount('electricity', 2000), water = ruleAmount('water', 500);
  const books = ruleAmount('books', 2000), pickup = ruleAmount('pickup', 1200), deposit = ruleAmount('deposit', 1000);
  const acrDefaultNote = visaType==='tourist59'
    ? '按持59天签证预估，学习超过8周计入一次；若持30天签证，约第4周首次续签时可能提前产生，以实际办理为准'
    : `按${visaLabel}预估，首次续签时计入一次；以实际办理为准`;
  const configuredAcrNote = configured('acr-i-card')?.note;
  const configuredArpNote = configured('arp')?.note;
  const arpDefaultNote = longTermVisa
    ? '长期签证仍计收一次，暂按300比索预估；实际政策及收费须顾问向学校确认。'
    : '首次续签时计入一次，暂按300比索预估；实际政策及收费须顾问向学校确认。';
  const fees: CgLocalFee[] = [
    { item: ruleName('ssp', 'SSP特殊学习许可证'), amount: `${ssp.toLocaleString('zh-CN')} 比索 / 次`, quantity: longTermVisa?0:1, total: longTermVisa?0:ssp, note: longTermVisa?`${ruleNote('ssp', confirmation)} ${confirmation}`:ruleNote('ssp', '移民局收取，按报名学习时长办理；续费或换校需重新办理') },
    { item: ruleName('ssp-i-card', 'SSP E-CARD'), amount: `${sspCard.toLocaleString('zh-CN')} 比索 / 次`, quantity: longTermVisa?0:1, total: longTermVisa?0:sspCard, note: longTermVisa?`${ruleNote('ssp-i-card', confirmation)} ${confirmation}`:ruleNote('ssp-i-card', '入学时与SSP同时办理，本次按一次预估；换学校需要携带证明，否则需要重新办理') },
    { item: ruleName('acr-i-card', 'ACR-I CARD 外国人身份证'), amount: `${acr.toLocaleString('zh-CN')} 比索 / 次`, quantity: acrQuantity, total: acr * acrQuantity, note: longTermVisa?`${ruleNote('acr-i-card', confirmation)} ${confirmation}`:(configuredAcrNote && configuredAcrNote !== '按持59天签证预估，学习超过8周计入一次；若持30天签证，约第4周首次续签时可能提前产生，以实际办理为准' ? configuredAcrNote : acrDefaultNote) },
    { item: ruleName('arp', 'ARP外国人登记'), amount: `${arp.toLocaleString('zh-CN')} 比索 / 次`, quantity: arpQuantity, total: arp * arpQuantity, note: configuredArpNote && configuredArpNote !== '首次续签或长期签证时计入一次；须顾问向学校确认。' ? configuredArpNote : arpDefaultNote },
    { item: ruleName('management', '维护管理费'), amount: `${management.toLocaleString('zh-CN')} 比索 / ${configured('management')?.periodWeeks ?? 4}周`, quantity: managementPeriods, total: management * managementPeriods, note: ruleNote('management', '每4周预估1份，具体以学校实收为准') },
    { item: ruleName('electricity', '电费'), amount: `${electricity.toLocaleString('zh-CN')} 比索 / ${configured('electricity')?.periodWeeks ?? 4}周`, quantity: electricityPeriods, total: electricity * electricityPeriods, note: ruleNote('electricity', '预估金额；空调或超额用电按学校计量另收，参考25比索/度') },
    { item: ruleName('water', '水费'), amount: `${water.toLocaleString('zh-CN')} 比索 / ${configured('water')?.periodWeeks ?? 4}周`, quantity: waterPeriods, total: water * waterPeriods, note: ruleNote('water', '每4周预估1份，具体以学校实收为准') },
    { item: ruleName('visa-extension', '旅游签证续签'), amount: visaRate, quantity: visaExtensionCount, total: visaExtensionFee, note: longTermVisa?`${ruleNote('visa-extension', confirmation)} ${confirmation}`:(visaRule?.note && visaRule.note !== '按签证类型和停留时间预估；以实际办理及收费为准。' ? visaRule.note : visaNote) },
    { item: ruleName('books', '书本教材费'), amount: `${books.toLocaleString('zh-CN')} 比索 / 次预估`, quantity: 1, total: books, note: ruleNote('books', '先预估2,000比索；不同课程教材不同，按实际购买结算，学完后另购新教材') },
    { item: ruleName('pickup', '宿务马克坦机场接机（可选）'), amount: `${pickup.toLocaleString('zh-CN')} 比索 / 次`, quantity: includeAirportPickup ? 1 : 0, total: includeAirportPickup ? pickup : 0, note: ruleNote('pickup', '可选择接机，也可自行打车；不计入学杂费合计'), excluded: true },
    { item: ruleName('deposit', '押金（可退）'), amount: `${deposit.toLocaleString('zh-CN')} 比索 / 次预估`, quantity: 1, total: deposit, note: ruleNote('deposit', '预估1,000比索，具体以学校为准；无损坏或额外扣费时按规定退还，不计入学杂费合计'), excluded: true },
  ].filter(row => !editableRules || editableRules.some(rule => rule.enabled && rule.name === row.item));
  return { periods, visaExtensionCount, visaExtensionFee, note, fees };
}
