// MONOL Sparta's versioned employee content document: courses, rooms, local fees, offers and quote-image copy.
// Published revisions drive the page, its quote and the quote image together. Sources: the school's Google Drive
// pack (fee sheet and 2026 promotion poster, August 2026; student handbook 斯巴达校区学生手册_261019, October 2026).
// Never use MONOL main-campus prices or rules here.
import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaQuoteImageSettings,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import { ASSOCIATION_PEAK_POLICY_VERSION } from '../association-peak-surcharge';
import { copyContentData } from '../copy-content-data';

/**
 * 1 (2026-11-24): the October 2026 handbook. Chinese course names and lines, 豪华单人间, the 30-day visa sequence
 * 4,940 / 11,150 / 15,390 / 19,630 / 23,870, the deposit as 100美元或4,000比索, and the pending or penalty rows
 * (water and electricity, textbooks, Academic Admin Fee, unfinished study, weekend transport) switched off.
 */
export const MONOL_SPARTA_POLICY_VERSION = 1;
type MonolSpartaQuoteSettings = CiaQuoteSettings & { monolSpartaPolicyVersion?: number };

/** Rows the October handbook does not list; switched off once by the version-1 upgrade. */
const RETIRED_FEE_IDS = ['water-electricity', 'textbook-materials', 'academic-admin-fee', 'unfinished-penalty-study', 'weekend-trip-transport'];

/** Extension amounts in order: a 30-day entry from week 5, a 59-day entry from week 9 (handbook and visa sheet). */
export const MONOL_SPARTA_VISA_RATES_30 = [4940, 6210, 4240, 4240, 4240];
export const MONOL_SPARTA_VISA_RATES_59 = [6210, 4240, 4240, 4240];

const course = (id: string, name: string, schedule: string, suitable: string, note: string, sortOrder: number): CiaCourseContent => ({
  id, name, tuition: 950, tuition2027: 950, schedule, suitable, note, enabled: true, sortOrder,
});

const room = (id: string, name: string, code: string, fee: number, note: string, sortOrder: number): CiaRoomContent => ({
  id, name, label: name, code, location: '校内', group: name.includes('单人') ? '单人间' : '多人间', fee, note, enabled: true, sortOrder,
});

const COURSES = (): CiaCourseContent[] => [
  course(
    'booster-esl', 'Booster ESL 强化ESL',
    '6节一对一 + 3节选修团体课 + 晚间单词句型测验',
    '想在短时间内把听说读写一起提上来、能接受全天管理和每天测验的学生',
    '一对一：口语2节、听力2节、阅读1节、讨论1节；选修团体课：写作、文法，晚上商务英语或发音；每天背30个单字和10个句型，20:00测验；每4周评估一次。',
    0,
  ),
  course(
    'master-ielts', 'Master IELTS 雅思高分',
    '5节一对一 + 4节团体课（含必修雅思模考）+ 晚间单词句型测验',
    '有雅思目标分数、想靠每天模考和高强度练习冲分的学生',
    '一对一：口语、听力、阅读、写作Task 1、写作Task 2；团体课：雅思口语、雅思文法和每天的雅思模考（必修），晚上商务英语或发音；每天20个雅思单字和10个句型测验；每2周评估一次。',
    1,
  ),
];

const ROOMS = (): CiaRoomContent[] => [
  room('premium-single-room', '豪华单人间', 'PREMIUM-1', 1200, '房内有卫生间', 0),
  room('standard-single-room', '标准单人间', 'STANDARD-1', 1050, '房内有卫生间', 1),
  room('semi-single-room', '单人雅房', 'SEMI-1', 900, '一人一间', 2),
  room('double-room', '双人间', 'DOUBLE-2', 800, '两人一间', 3),
  room('triple-room', '三人间', 'TRIPLE-3', 700, '三人一间，最省预算', 4),
];

const LOCAL_FEES = (): CiaLocalFeeRule[] => [
  { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', includeInTotal: true, note: '自发放日起6个月有效。', enabled: true, sortOrder: 0 },
  { id: 'ssp-acr', name: 'SSP ACR I-CARD', currency: 'PHP', amount: 4500, billingRule: 'once', includeInTotal: true, note: '入学第一天缴纳。', enabled: true, sortOrder: 1 },
  {
    id: 'visa-extension', name: '签证延签', currency: 'PHP', amount: MONOL_SPARTA_VISA_RATES_30[0], billingRule: 'visa-extension-schedule',
    rates: [...MONOL_SPARTA_VISA_RATES_30], tourist59Rates: [...MONOL_SPARTA_VISA_RATES_59], includeInTotal: true,
    note: '按护照、入境停留天数和就读周数累计计算。', enabled: true, sortOrder: 2,
  },
  { id: 'manila-group-pickup', name: '马尼拉机场团体接机', currency: 'PHP', amount: 3000, billingRule: 'selected-manila-pickup', includeInTotal: true, note: '按学校团体接机班次。', enabled: true, sortOrder: 3 },
  { id: 'clark-group-pickup', name: '克拉克机场团体接机', currency: 'PHP', amount: 3000, billingRule: 'selected-clark-pickup', includeInTotal: true, note: '按学校团体接机班次。', enabled: true, sortOrder: 4 },
  { id: 'security-deposit', name: '宿舍押金', currency: 'USD', amount: 100, billingRule: 'once', includeInTotal: false, note: '100美元或4,000比索，原则上毕业当天退还；没补完的自习会先从押金扣。', enabled: true, sortOrder: 5 },
  { id: 'tvv-acr', name: 'TVV ACR I-CARD', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: false, note: '停留超过59天时产生；移民局目前未收取，暂不计入。', enabled: true, sortOrder: 6 },
  { id: 'manila-special-pickup', name: '马尼拉机场个人接机', currency: 'PHP', amount: 12000, billingRule: 'optional', includeInTotal: false, note: '单独派车的整车价格。', enabled: true, sortOrder: 7 },
  { id: 'clark-special-pickup', name: '克拉克机场个人接机', currency: 'PHP', amount: 7000, billingRule: 'optional', includeInTotal: false, note: '单独派车的整车价格。', enabled: true, sortOrder: 8 },
];

const SNS_DESCRIPTION = '2026/12/31前报名，在斯巴达校区学习并住宿；每满4周在小红书、TikTok、Facebook、Instagram、Google Map、Threads等平台发1条在校动态，减100美元；所有房型适用，活动可能随时结束';

const quoteImageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '',
    course: '',
    accommodation: '住宿含平日三餐，周末和假日一餐（早午餐）',
    promotion: '',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '到校后在学校用比索缴纳；学校费用表没有列出的费用，以到校后学校通知为准。',
  localFeeNotes: {},
  serviceSectionTitle: '为什么选择思达启航？',
  benefits: [
    { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
    { title: '资料核对', text: '课程、住宿、优惠和当地费用逐项核实' },
    { title: '报名协助', text: '选课、付款、签证和行前准备全程跟进' },
    { title: '在菲支持', text: '学习期间持续协助学校沟通' },
  ],
  serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
  alumniBenefitTitle: '老学员专属支持',
  alumniBenefitText: '结业后可继续咨询线上英语、菲律宾复学及爱尔兰与欧美留学方案。',
  noteSectionTitle: '报价说明',
  footerNotes: [],
});

export const createDefaultMonolSpartaContentConfig = (): CiaContentConfig => {
  const settings: MonolSpartaQuoteSettings = {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '', shortStayRatios: {}, peakSeasonFeePerWeek: 60,
    peakSeasonPolicyVersion: ASSOCIATION_PEAK_POLICY_VERSION,
    monolSpartaPolicyVersion: MONOL_SPARTA_POLICY_VERSION,
    peakSeasonRanges: [{ id: 'monol-sparta-peak-2027', label: '2027暑期旺季', start: '2027-06-27', end: '2027-08-22', enabled: true }],
    promotions: [
      { id: 'sparta-course-2026', name: '2026学费优惠', description: '2026/12/31前报名，在斯巴达校区学习并住宿，每满4周学费减100美元', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', ruleKind: 'monol-sparta-course' },
      { id: 'sparta-room-2026', name: '2026住宿优惠', description: '2026/12/31前报名，在斯巴达校区学习并住宿，每满4周住宿费减100美元', enabled: true, sortOrder: 1, priority: 11, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', ruleKind: 'monol-sparta-room' },
      { id: 'sparta-sns-2026', name: '2026 SNS活动', description: SNS_DESCRIPTION, enabled: true, sortOrder: 2, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', ruleKind: 'monol-sparta-sns-manual' },
    ],
    localFeeIntro: '按每位学生的护照、就读周数和接机选择估算；宿舍押金、个人接机和暂不收取的TVV ACR另列，不计入合计。学校费用表没有列出的费用，以到校后学校通知为准。',
    courseTableTitle: '课程费 / 4周',
    courseTableNote: '两门课程都是950美元／4周；1–3周请联系顾问向学校询价。',
    groupClassNote: '',
    roomTableTitle: '住宿费 / 4周（含餐）',
    roomTableNote: '住宿费含平日三餐，周末和假日一餐（早午餐9:00–11:00）。',
    stayPolicyTitle: '入住与在校规则',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '周一开课。' },
      { label: '离校日期', value: '课程结束后的周六', note: '住宿按周日至周六计算。' },
      { label: '平日外出', value: '周一至周四17:00–19:00', note: '次日无课可外出到午夜12:00，次日有课须在21:00前返校。' },
    ],
    extraNightRates: [],
  };
  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: 'MONOL-SPARTA',
    courses: COURSES(),
    rooms: ROOMS(),
    localFees: LOCAL_FEES(),
    quoteSettings: settings,
    quoteImageSettings: quoteImageSettings(),
    media: [],
  };
  config.quoteImageSettings.localFeeNotes = Object.fromEntries(config.localFees.map((fee: CiaLocalFeeRule) => [fee.id, fee.note]));
  config.quoteImageSettings.promotionNotes = Object.fromEntries(config.quoteSettings.promotions.map(rule => [rule.id, rule.description]));
  return config;
};

/** Version 1: the October 2026 handbook; only untouched older defaults are replaced, other edits stay. */
function upgradeToHandbook(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as MonolSpartaQuoteSettings;
  if ((settings.monolSpartaPolicyVersion ?? 0) >= MONOL_SPARTA_POLICY_VERSION) return;
  const oldCourseNames: Record<string, string> = { 'booster-esl': 'Booster ESL', 'master-ielts': 'Master IELTS' };
  for (const fresh of defaults.courses) {
    const saved = clone.courses.find(item => item.id === fresh.id);
    if (!saved) clone.courses.push(copyContentData(fresh));
    else if (saved.name === oldCourseNames[fresh.id]) Object.assign(saved, { name: fresh.name, schedule: fresh.schedule, suitable: fresh.suitable, note: fresh.note });
  }
  const oldRoomNames: Record<string, string> = {
    'premium-single-room': '高级单人间', 'standard-single-room': '标准单人间', 'semi-single-room': '单人雅房', 'double-room': '双人间', 'triple-room': '三人间',
  };
  for (const fresh of defaults.rooms) {
    const saved = clone.rooms.find(item => item.id === fresh.id);
    if (!saved) clone.rooms.push(copyContentData(fresh));
    else if (saved.name === oldRoomNames[fresh.id]) Object.assign(saved, { name: fresh.name, label: fresh.label, group: fresh.group, note: fresh.note });
  }
  for (const fresh of defaults.localFees) {
    const saved = clone.localFees.find(item => item.id === fresh.id);
    if (!saved) clone.localFees.push(copyContentData(fresh));
    else Object.assign(saved, { name: fresh.name, note: fresh.note, rates: fresh.rates, tourist59Rates: fresh.tourist59Rates, amount: saved.id === 'visa-extension' ? fresh.amount : saved.amount });
  }
  for (const fee of clone.localFees) if (RETIRED_FEE_IDS.includes(fee.id)) fee.enabled = false;
  for (const fresh of defaults.quoteSettings.promotions) {
    const saved = clone.quoteSettings.promotions.find(item => item.id === fresh.id);
    if (saved) Object.assign(saved, { name: fresh.name, description: fresh.description, stackable: fresh.stackable });
  }
  for (const key of ['localFeeIntro', 'courseTableTitle', 'courseTableNote', 'groupClassNote', 'roomTableTitle', 'roomTableNote', 'stayPolicies'] as const) {
    (settings as unknown as Record<string, unknown>)[key] = copyContentData(defaults.quoteSettings[key]);
  }
  clone.quoteImageSettings = copyContentData(defaults.quoteImageSettings);
  settings.monolSpartaPolicyVersion = MONOL_SPARTA_POLICY_VERSION;
}

export const cloneMonolSpartaContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const clone = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  const defaults = createDefaultMonolSpartaContentConfig();
  clone.courses ??= [];
  clone.rooms ??= [];
  clone.localFees ??= [];
  clone.quoteSettings.promotions ??= [];
  if ((clone.quoteSettings.peakSeasonPolicyVersion ?? 0) < ASSOCIATION_PEAK_POLICY_VERSION) {
    const confirmed = defaults.quoteSettings.peakSeasonRanges[0];
    const saved = clone.quoteSettings.peakSeasonRanges?.find(range => range.id === confirmed.id || range.label.includes('2027'));
    if (saved) Object.assign(saved, confirmed); else (clone.quoteSettings.peakSeasonRanges ??= []).push(copyContentData(confirmed));
    clone.quoteSettings.peakSeasonFeePerWeek = 60;
    clone.quoteSettings.peakSeasonPolicyVersion = ASSOCIATION_PEAK_POLICY_VERSION;
  }
  upgradeToHandbook(clone, defaults);
  const settings = clone.quoteImageSettings;
  clone.quoteImageSettings = {
    ...defaults.quoteImageSettings,
    ...(settings ?? {}),
    paymentNotes: { ...defaults.quoteImageSettings.paymentNotes, ...(settings?.paymentNotes ?? {}) },
    promotionNotes: { ...defaults.quoteImageSettings.promotionNotes, ...(settings?.promotionNotes ?? {}) },
    localFeeNotes: {
      ...defaults.quoteImageSettings.localFeeNotes,
      ...Object.fromEntries(clone.localFees.map(fee => [fee.id, fee.note])),
      ...(settings?.localFeeNotes ?? {}),
    },
  };
  return clone;
};
