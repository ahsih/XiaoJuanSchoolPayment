// What the CG Banilad and CG Sparta content documents share: the local-fee rows (the two campuses charge the same
// local fees), the quote-image company lines, and the one-time upgrade that brings a saved document onto the
// 2026-11 school pack (course lines from the 2026 brochure and orientation guides, 1–3 week prices, campus rooms
// only). Each campus keeps its own document, prices and offers. Keep this file pure data (no Angular, DOM or
// storage, no structuredClone), so the WeChat mini program can bundle it.
import type { CiaContentConfig, CiaLocalFeeRule, CiaQuoteSettings } from './cia-school/cia-content-config';

export const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Raised when saved CG documents must inherit a school pack once (version 1: the 2026-11 pack). The upgrade
 * replaces course and room wording, local-fee notes and the stay rules; prices an employee saved are kept.
 */
export const CG_POLICY_VERSION = 1;
export type CgQuoteSettings = CiaQuoteSettings & { cgPolicyVersion?: number };

/** 1–3 weeks cost 40/60/85% of the four-week price at both campuses (2026 price lists). */
export const CG_SHORT_STAY_RATIOS: Record<string, number> = { '1': 0.4, '2': 0.6, '3': 0.85 };

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({ ...value, currency: 'PHP', enabled: true });
/** The Sunday arrival for the first class day (Monday 2027-01-04) of the new weekly utility rates. */
const FUTURE_START = '2027-01-03';

/** Local fees both campuses charge, paid in pesos at school. Utilities switch to weekly rates from 2027-01-04. */
export const createCgLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特殊学习许可', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '所有学生都要办；有效期是第一次报名的周数，延期或重新报名要再交，报名25周以上交两次。', sortOrder: 0 }),
  fee({ id: 'ssp-i-card', name: 'ACR E-Card（学生卡）', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '所有学生都要办，和SSP一起办理，约2–3周，期间护照由学校保管；换学校要带证明，否则要重办。', sortOrder: 1 }),
  fee({ id: 'acr-i-card', name: 'ACR I-Card（旅游签证）', amount: 4500, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '旅游签证续签时办理一次。', sortOrder: 2 }),
  fee({ id: 'arp', name: '生物识别费', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '随首次旅游签证续签收一次；长期签证是否收取，由顾问向学校确认。', sortOrder: 3 }),
  fee({ id: 'management', name: '综合管理费', amount: 2000, futureEffectiveStart: FUTURE_START, futureName: '综合管理费', futureAmount: 750, futurePeriodWeeks: 1, futureRounding: 'proportional', billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '包括设施、日常用品和Wi-Fi，不含房间空调电费；每4周2,000比索。', futureNote: '2027年1月4日起每周750比索；包括设施、日常用品和Wi-Fi，不含房间空调电费。', sortOrder: 4 }),
  fee({ id: 'electricity', name: '公共电费', amount: 2000, futureEffectiveStart: FUTURE_START, futureName: '基础电费（不含空调）', futureAmount: 500, futurePeriodWeeks: 1, futureRounding: 'proportional', billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周2,000比索；房间空调按电表另收，每度25比索，从押金中结算。', futureNote: '2027年1月4日起每周500比索；房间空调按电表另收，每度25比索，从押金中结算。', sortOrder: 5 }),
  fee({ id: 'water', name: '水费', amount: 500, futureEffectiveStart: FUTURE_START, futureAmount: 300, futurePeriodWeeks: 1, futureRounding: 'proportional', billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周500比索。', futureNote: '2027年1月4日起每周300比索。', sortOrder: 6 }),
  fee({ id: 'visa-extension', name: '旅游签证续签', amount: 6390, rates: [6390, 4460, 4460, 4460, 4460], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '签证到期10天前到学校办公室办理；按所选签证和停留周数预估。', sortOrder: 7 }),
  fee({ id: 'books', name: '教材费', amount: 2000, billingRule: 'once', includeInTotal: true, note: '每种课程每开始8周约2,000比索；报名2周以上必须买教材，到校后和老师确认再买，按实际购买收费。', sortOrder: 8 }),
  fee({ id: 'pickup', name: '宿务机场接机', amount: 1200, billingRule: 'optional', includeInTotal: false, note: '到达当天由学校接机，每人1,200比索，到校后交。', sortOrder: 9 }),
  fee({ id: 'deposit', name: '宿舍押金（可退）', amount: 250, periodWeeks: 1, rounding: 'proportional', billingRule: 'optional', includeInTotal: false, note: '每住宿周250比索（每4周1,000比索）；先抵房间空调电费，离校时多退少补，损坏公物也从中扣。', sortOrder: 10 }),
];

export const CG_LOCAL_FEE_INTRO = '以下费用到校后用比索交给学校，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留时间预估；水费、综合管理费和公共电费从2027年1月4日起改为按周收取。接机和宿舍押金另列，不计入合计。';
export const CG_ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createCgQuoteImageSettings = (): CiaContentConfig['quoteImageSettings'] => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '', promotion: '' },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: CG_LOCAL_FEE_INTRO,
  localFeeNotes: {},
  serviceSectionTitle: '为什么选择思达启航？',
  benefits: [
    { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
    { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
    { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
    { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
  ],
  serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
  alumniBenefitTitle: '老学员专属优惠',
  alumniBenefitText: CG_ALUMNI_BENEFIT_TEXT,
  noteSectionTitle: '报价说明',
  footerNotes: ['到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
});

/** Older default lines a saved document may still carry; only these are replaced, edited lines stay. */
const OLD_COPY = {
  localFeeIntros: [
    '证件、签证、教材、接机和按周押金已按学校最新明细更新；仅水费、综合管理费和基础电费于2027年1月4日起切换新标准。',
    '学杂费为比索现金预估，具体以学校及相关部门到校实收为准。接机和可退押金另列，不计入合计。',
    '学杂费为比索现金预估，具体以学校及相关部门到校实收为准；系统按入学日期自动切换2027年1月4日起生效的新标准。',
    '学杂费由学校及相关部门到校收取；页面按当前选择预估，具体以学校现场实收为准。',
    '学杂费由学校及相关部门到校收取；系统按入学日期自动切换2027年1月4日起生效的新标准。',
    '学杂费均为预估金额，仅供准备比索现金参考，具体以学校及相关部门到校实收为准。',
    '学杂费均为预估金额，仅供准备比索现金参考；系统按入学日期自动切换2027年1月4日起生效的新标准。',
  ],
  paymentNotes: { course: '按所选课程、周数及日期计算', accommodation: '按所选房型、周数及日期计算', promotion: '优惠按当前有效规则自动计算' },
  alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
  footerNotes: [
    '课程、住宿、暑期附加费和优惠按当前选择及有效规则计算。',
    '教材按填写的数量和单价估算并计入学杂费合计，实际以课程及到校购买为准。',
  ],
};

/**
 * Brings a document saved before the 2026-11 pack onto it, once: course and room wording, new courses (Booster),
 * off-campus rooms switched off, local-fee notes, short-stay ratios, stay rules and promotion wording. Saved prices,
 * on/off switches and promotion amounts are kept.
 */
export function upgradeCgPolicy(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as CgQuoteSettings;
  if ((settings.cgPolicyVersion ?? 0) >= CG_POLICY_VERSION) return;
  const defaultCourses = new Map(defaults.courses.map(item => [item.id, item]));
  clone.courses = clone.courses.map(item => {
    const fresh = defaultCourses.get(item.id);
    if (!fresh) return item;
    return {
      ...copyJson(fresh),
      tuition: item.tuition > 0 ? item.tuition : fresh.tuition,
      tuition2027: item.tuition2027 > 0 ? item.tuition2027 : item.tuition > 0 ? item.tuition : fresh.tuition2027,
      enabled: item.enabled,
    };
  });
  for (const fresh of defaults.courses) {
    if (!clone.courses.some(item => item.id === fresh.id)) clone.courses.push(copyJson(fresh));
  }
  clone.courses.sort((a, b) => (defaultCourses.get(a.id)?.sortOrder ?? a.sortOrder) - (defaultCourses.get(b.id)?.sortOrder ?? b.sortOrder));

  const defaultRooms = new Map(defaults.rooms.map(item => [item.id, item]));
  clone.rooms = clone.rooms.map(item => {
    const fresh = defaultRooms.get(item.id);
    if (!fresh) return { ...item, enabled: false };
    return { ...copyJson(fresh), fee: item.fee > 0 ? item.fee : fresh.fee, enabled: fresh.enabled && item.enabled };
  });
  for (const fresh of defaults.rooms) {
    if (!clone.rooms.some(item => item.id === fresh.id)) clone.rooms.push(copyJson(fresh));
  }

  clone.localFees = clone.localFees.map(rule => {
    const fresh = defaults.localFees.find(item => item.id === rule.id);
    return fresh ? { ...rule, name: fresh.name, note: fresh.note, futureName: fresh.futureName, futureNote: fresh.futureNote } : rule;
  });

  settings.shortStayRatios = { ...defaults.quoteSettings.shortStayRatios };
  settings.promotions = settings.promotions.map(rule => {
    const fresh = defaults.quoteSettings.promotions.find(item => item.id === rule.id);
    return fresh ? { ...rule, name: fresh.name, description: fresh.description } : rule;
  });
  for (const key of ['localFeeIntro', 'courseTableTitle', 'courseTableNote', 'groupClassNote', 'roomTableTitle', 'roomTableNote', 'stayPolicyTitle'] as const) {
    settings[key] = defaults.quoteSettings[key];
  }
  settings.stayPolicies = copyJson(defaults.quoteSettings.stayPolicies);
  settings.cgPolicyVersion = CG_POLICY_VERSION;

  const image = clone.quoteImageSettings;
  if (!image) return;
  const notes = image.paymentNotes as unknown as Record<string, string>;
  for (const [key, old] of Object.entries(OLD_COPY.paymentNotes)) {
    if (notes[key] === old) notes[key] = '';
  }
  if (image.alumniBenefitText === OLD_COPY.alumniBenefitText) image.alumniBenefitText = CG_ALUMNI_BENEFIT_TEXT;
  if (OLD_COPY.localFeeIntros.includes(image.localFeeIntro)) image.localFeeIntro = CG_LOCAL_FEE_INTRO;
  image.footerNotes = image.footerNotes.filter(note => !OLD_COPY.footerNotes.includes(note));
  if (!image.footerNotes.length) image.footerNotes = copyJson(defaults.quoteImageSettings.footerNotes);
}

/** Shared filling of a saved or previewed document up to the current schema; returns a copy. */
export function cloneCgContent(value: CiaContentConfig, defaults: CiaContentConfig, offSeason2027Id: string): CiaContentConfig {
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= copyJson(defaults.quoteSettings.peakSeasonRanges);
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  clone.localFees ??= copyJson(defaults.localFees);
  // Every row except the three dated utilities follows the current fee sheet; the utilities keep employee edits.
  clone.localFees = clone.localFees.map(item => {
    const fallback = defaults.localFees.find(candidate => candidate.id === item.id);
    if (!fallback) return item;
    if (!['management', 'electricity', 'water'].includes(item.id)) {
      return {
        ...item,
        name: fallback.name, amount: fallback.amount, secondaryAmount: fallback.secondaryAmount, billingRule: fallback.billingRule,
        periodWeeks: fallback.periodWeeks, rounding: fallback.rounding, rates: fallback.rates ? [...fallback.rates] : undefined,
        waiveForLongTermVisa: fallback.waiveForLongTermVisa, includeInTotal: fallback.includeInTotal, note: fallback.note,
        futureEffectiveStart: undefined, futureName: undefined, futureAmount: undefined, futureSecondaryAmount: undefined,
        futurePeriodWeeks: undefined, futureRounding: undefined, futureRates: undefined, futureNote: undefined,
      };
    }
    return {
      ...item,
      futureEffectiveStart: item.futureEffectiveStart ?? fallback.futureEffectiveStart,
      futureName: item.futureName ?? fallback.futureName,
      futureAmount: item.futureAmount ?? fallback.futureAmount,
      futureSecondaryAmount: item.futureSecondaryAmount ?? fallback.futureSecondaryAmount,
      futurePeriodWeeks: item.futurePeriodWeeks ?? fallback.futurePeriodWeeks,
      futureRounding: item.futureRounding ?? fallback.futureRounding,
      futureRates: item.futureRates ?? (fallback.futureRates ? [...fallback.futureRates] : undefined),
      futureNote: item.futureNote ?? fallback.futureNote,
    };
  });
  const confirmedPromotion = defaults.quoteSettings.promotions.find(rule => rule.id === offSeason2027Id);
  if (confirmedPromotion && !clone.quoteSettings.promotions.some(rule => rule.id === confirmedPromotion.id)) {
    clone.quoteSettings.promotions.push(copyJson(confirmedPromotion));
  }
  upgradeCgPolicy(clone, defaults);
  clone.media ??= [];
  return clone;
}
