// MONOL main campus's versioned employee content document: courses, rooms, local fees, offers and quote-image copy.
// Published revisions drive the page, its quote and the quote image together. Sources: the school's Google Drive
// pack (fee sheet updated 2026-09-07, the October 2026 student handbook, the 2026-10-23 campus overview and the
// 2026 promotion poster). Never use MONOL Sparta's prices or rules here.
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
 * 1 (2026-11-25): the school's November 2026 pack. Light ESL and the other Chinese course names and lines, 1/2/3
 * weeks at 40/60/80% of four weeks, Premium Single A and B as two rooms (same price), 单人雅房 and 胶囊四人间, the
 * fee sheet's local fees (SSP ACR I-CARD, visa extensions 6,210 then 4,240, no textbook or ID fee, deposit 100
 * dollars), the TVV ACR reference, individual pickups, the poster's offers not counting 2027/06/27–08/21, and the
 * 2027 room prices (each room 50 dollars more per four weeks for registrations from 2027/01/01, user 2026-11-25).
 */
export const MONOL_POLICY_VERSION = 1;
type MonolQuoteSettings = CiaQuoteSettings & { monolPromotionPolicyVersion?: number; monolPolicyVersion?: number };

/** Rows of the 2026 document that the fee sheet replaced; dropped once by the version-1 upgrade. */
const RETIRED_FEE_IDS = ['ssp-e-card', 'acr-i-card', 'books', 'student-id', 'manila-pickup', 'clark-pickup', 'room-deposit'];

/** Rooms cost this much more per four weeks for registrations from 2027/01/01 (user 2026-11-25); courses stay the same. */
export const MONOL_2027_ROOM_INCREASE = 50;
/** First registration day of the 2027 room prices; registrations up to 2026/12/31 keep the current prices. */
export const MONOL_2027_PRICE_REGISTRATION_START = '2027-01-01';

/** Extension amounts in order (fee sheet): the first 30-day extension 6,210, then 4,240 each, for both entry visas. */
export const MONOL_VISA_RATES = [6210, 4240, 4240, 4240, 4240];

const course = (id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder,
});

const room = (id: string, name: string, code: string, group: string, fee: number, note: string, sortOrder: number): CiaRoomContent => ({
  id, name, label: name, code, location: '校内', group, fee, fee2027: fee + MONOL_2027_ROOM_INCREASE, note, enabled: true, sortOrder,
});

const COURSES = (): CiaCourseContent[] => [
  course(
    'esl-4', 'Light ESL 轻量ESL', 750,
    '4节一对一 + 4节团体课（选修）+ 健身课（选修）',
    '想多留时间复习、休息或远程工作，又想每天练口语的学生',
    '一对一：口语2节、听力1节、阅读1节；团体课：写作、文法、发音、讨论。教材和 General ESL 相同。',
    0,
  ),
  course(
    'general-esl', 'General ESL 综合ESL', 900,
    '5节一对一 + 4节团体课（选修）+ 健身课（选修）',
    '从零基础到中级，想全面提高日常英语会话的学生',
    '一对一：口语2节、听力2节、阅读1节；团体课：写作、文法、发音、讨论。初级到高级共5级，每级2册学校自编教材。',
    1,
  ),
  course(
    'ielts', 'IELTS 雅思', 1000,
    '5节一对一 + 4节团体课（选修）+ 每两周模考',
    '要考雅思、需要目标分数去留学、工作或移民的学生',
    '一对一：口语、听力、阅读、写作Task 1、写作Task 2；团体课：雅思口语、文法、听力和发音。学费含100美元／4周学术管理费。',
    2,
  ),
  course(
    'leap-english', 'LEAP English 客制化课程', 1150,
    '5节自选一对一 + 4节团体课（选修）+ 健身课（选修）',
    '有明确目标、想自己组合科目（商务、托业、面试、空乘等）的学生',
    '先做测试和目标分析，导师制定学习计划；一对一从ESL、雅思、托业、商务英语等科目任选。学费含250美元／4周学术管理费。',
    3,
  ),
];

const SHARE_NOTE = '两张双人床尺寸的床，可2–4人同住（同进同出）；每多1人加200美元／4周，加的部分不享受住宿优惠';

const ROOMS = (): CiaRoomContent[] => [
  room('premium-single-room', '高级单人间A型', 'PREMIUM-A', '单人间', 1100, `房内有按摩椅。${SHARE_NOTE}`, 0),
  room('premium-single-b', '高级单人间B型', 'PREMIUM-B', '单人间', 1100, `房内有厨房区。${SHARE_NOTE}`, 1),
  room('standard-single-room', '标准单人间', 'STANDARD-1', '单人间', 750, '一人一间，卫浴在房内', 2),
  room('small-single-room', '单人雅房', 'SEMI-1', '单人间', 650, '一人一间的小房间，两间共用卫浴', 3),
  room('triple-room', '三人间', 'TRIPLE-3', '多人间', 500, '三张双人床尺寸的床', 4),
  room('quad-room', '胶囊四人间', 'CAPSULE-4', '多人间', 400, '每人一个胶囊床位，最省预算', 5),
];

const LOCAL_FEES = (): CiaLocalFeeRule[] => [
  { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', includeInTotal: true, note: '有效期6个月。', enabled: true, sortOrder: 0 },
  { id: 'ssp-acr', name: 'SSP ACR I-CARD', currency: 'PHP', amount: 4500, billingRule: 'once', includeInTotal: true, note: '和SSP一起办理。', enabled: true, sortOrder: 1 },
  {
    id: 'visa-extension', name: '签证延签', currency: 'PHP', amount: MONOL_VISA_RATES[0], billingRule: 'visa-extension-schedule',
    rates: [...MONOL_VISA_RATES], tourist59Rates: [...MONOL_VISA_RATES], includeInTotal: true,
    note: '每次延30天，第一次6,210比索，之后每次4,240比索。', enabled: true, sortOrder: 2,
  },
  { id: 'manila-group-pickup', name: '马尼拉机场团体接机', currency: 'PHP', amount: 3000, billingRule: 'selected-manila-pickup', includeInTotal: true, note: '按BESA团体接机日和班次。', enabled: true, sortOrder: 3 },
  { id: 'clark-group-pickup', name: '克拉克机场团体接机', currency: 'PHP', amount: 3000, billingRule: 'selected-clark-pickup', includeInTotal: true, note: '按BESA团体接机日和班次。', enabled: true, sortOrder: 4 },
  { id: 'security-deposit', name: '宿舍押金', currency: 'USD', amount: 100, billingRule: 'once', includeInTotal: false, note: '100美元或4,000比索，离校前退还。', enabled: true, sortOrder: 5 },
  { id: 'meals', name: '餐费', currency: 'PHP', amount: 14000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: false, note: '按实际点餐付费，每餐约150–250比索；上课日早餐免费到2027/12/31。', enabled: true, sortOrder: 6 },
  { id: 'tvv-acr', name: 'TVV ACR I-CARD', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: false, note: '停留超过59天时产生；移民局目前不向持SSP ACR I-CARD的学生收取，暂不计入。', enabled: true, sortOrder: 7 },
  { id: 'manila-special-pickup', name: '马尼拉机场个人接机', currency: 'PHP', amount: 12000, billingRule: 'optional', includeInTotal: false, note: '单独派车的整车价格。', enabled: true, sortOrder: 8 },
  { id: 'clark-special-pickup', name: '克拉克机场个人接机', currency: 'PHP', amount: 7000, billingRule: 'optional', includeInTotal: false, note: '单独派车的整车价格。', enabled: true, sortOrder: 9 },
];

const BLACKOUT = '2027/06/27–08/21的周数不算';

const quoteImageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '',
    course: '',
    accommodation: '住宿费不含餐；洗衣、房间清洁和水电不另收费',
    promotion: '',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '到校后在学校用比索缴纳；MONOL不另收教材费（电子教材免费）和水电费。',
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

export const createDefaultMonolContentConfig = (): CiaContentConfig => {
  const settings: MonolQuoteSettings = {
    monolPromotionPolicyVersion: 20261008,
    monolPolicyVersion: MONOL_POLICY_VERSION,
    registrationFee: 100,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.6, '3': 0.8 },
    peakSeasonFeePerWeek: 60,
    peakSeasonPolicyVersion: ASSOCIATION_PEAK_POLICY_VERSION,
    peakSeasonRanges: [{ id: 'monol-peak-2027', label: '2027暑期旺季', start: '2027-06-27', end: '2027-08-22', enabled: true }],
    promotions: [
      { id: 'monol-registration-waiver', name: '思达启航免注册费', description: '通过思达启航报名，免收100美元注册费', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'monol-off-season-course-2026', name: '2026学费优惠', description: `2026/12/31前报名，在主校区学习并住宿，每满4周学费减100美元；学术管理费不减，${BLACKOUT}`, enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation' },
      { id: 'monol-off-season-room-2026', name: '2026住宿优惠', description: `2026/12/31前报名，在主校区学习并住宿，每满4周住宿费减100美元；${BLACKOUT}`, enabled: true, sortOrder: 2, priority: 21, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation' },
      { id: 'monol-sns', name: 'SNS活动', description: `2026/12/31前报名，住标准单人间或单人雅房，在小红书、Instagram、TikTok等任一平台发1篇在校故事，每满4周减100美元；活动可能随时结束，${BLACKOUT}`, enabled: true, sortOrder: 3, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', eligibleRoomIds: ['standard-single-room', 'small-single-room'] },
      { id: 'monol-long-term', name: '长住优惠', description: '2026/09/07–12/31报名，学习并住宿16／20／24周分别减150／200／300美元；取消或缩短周数则不适用', enabled: true, sortOrder: 4, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 0, discountTiers: { '16': 150, '20': 200, '24': 300 }, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 16, minimumAccommodationWeeks: 16, registrationStart: '2026-09-07', registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation' },
      { id: 'monol-christmas', name: '圣诞新年优惠', description: '2026/11/29–2027/01/10之间的周日入学，学习并住宿至少4周，每人减100美元', enabled: true, sortOrder: 5, priority: 50, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, arrivalStart: '2026-11-29', arrivalEnd: '2027-01-10', coverageTarget: 'none' },
    ],
    localFeeIntro: '按每位学生的签证、停留周数和接机选择估算；押金、餐费、个人接机和暂不收取的TVV ACR另列，不计入合计。',
    courseTableTitle: '课程费 / 4周',
    courseTableNote: '1周按4周价格的40%、2周60%、3周80%；4周以上按实际周数计算。',
    groupClassNote: '团体课和健身课免费、自由参加。',
    roomTableTitle: '住宿费 / 4周（不含餐）',
    roomTableNote: '住宿费不含餐；洗衣、房间清洁和水电不另收费。',
    stayPolicyTitle: '入住与在校规则',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '周一分级测试和新生说明会。' },
      { label: '离校日期', value: '课程结束后的周六', note: '住宿按周日至周六计算。' },
      { label: '门禁', value: '第二天有课21:00，没课24:00', note: '周五17:00到周日21:00可以外出旅行。' },
    ],
    extraNightRates: [],
  };
  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: 'MONOL',
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

/** The 2026 document's own default names, so only untouched ones are renamed. */
const OLD_COURSE_NAMES: Record<string, string> = { 'esl-4': 'ESL 4', 'general-esl': 'General ESL', ielts: 'IELTS', 'leap-english': 'LEAP English' };
const OLD_ROOM_NAMES: Record<string, string> = {
  'premium-single-room': '高级单人间', 'standard-single-room': '标准单人间', 'small-single-room': '小单间', 'triple-room': '三人间', 'quad-room': '四人间（胶囊式上下铺）',
};

/** Version 1: the November 2026 pack; untouched older defaults are replaced, edited prices and other edits stay. */
function upgradeToNovemberPack(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as MonolQuoteSettings;
  if ((settings.monolPolicyVersion ?? 0) >= MONOL_POLICY_VERSION) return;
  for (const fresh of defaults.courses) {
    const saved = clone.courses.find(item => item.id === fresh.id);
    if (!saved) clone.courses.push(copyContentData(fresh));
    else if (saved.name === OLD_COURSE_NAMES[fresh.id]) Object.assign(saved, { name: fresh.name, schedule: fresh.schedule, suitable: fresh.suitable, note: fresh.note });
  }
  const premium = clone.rooms.find(item => item.id === 'premium-single-room');
  for (const fresh of defaults.rooms) {
    const saved = clone.rooms.find(item => item.id === fresh.id);
    if (!saved) {
      // Premium B is new: it costs what the saved Premium Single costs.
      clone.rooms.push({
        ...copyContentData(fresh),
        ...(fresh.id === 'premium-single-b' && premium ? { fee: premium.fee, fee2027: premium.fee + MONOL_2027_ROOM_INCREASE, enabled: premium.enabled } : {}),
      });
    } else if (saved.name === OLD_ROOM_NAMES[fresh.id]) {
      Object.assign(saved, { name: fresh.name, label: fresh.label, code: fresh.code, group: fresh.group, note: fresh.note });
    }
  }
  // The 2027 price of every room: its saved price plus 50 dollars.
  for (const room of clone.rooms) room.fee2027 ??= room.fee + MONOL_2027_ROOM_INCREASE;
  clone.localFees = [
    ...defaults.localFees.map(fee => copyContentData(fee)),
    ...clone.localFees.filter(fee => !RETIRED_FEE_IDS.includes(fee.id) && !defaults.localFees.some(item => item.id === fee.id)),
  ];
  for (const fresh of defaults.quoteSettings.promotions) {
    const saved = clone.quoteSettings.promotions.find(item => item.id === fresh.id);
    if (!saved) clone.quoteSettings.promotions.push(copyContentData(fresh));
    else Object.assign(saved, { name: fresh.name, description: fresh.description, discountTiers: fresh.discountTiers });
  }
  for (const key of ['shortStayRatios', 'localFeeIntro', 'courseTableTitle', 'courseTableNote', 'groupClassNote', 'roomTableTitle', 'roomTableNote', 'stayPolicyTitle', 'stayPolicies'] as const) {
    (settings as unknown as Record<string, unknown>)[key] = copyContentData(defaults.quoteSettings[key]);
  }
  clone.quoteImageSettings = copyContentData(defaults.quoteImageSettings);
  settings.monolPromotionPolicyVersion = 20261008;
  settings.monolPolicyVersion = MONOL_POLICY_VERSION;
}

export const cloneMonolContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const clone = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  const defaults = createDefaultMonolContentConfig();
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
  upgradeToNovemberPack(clone, defaults);
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
