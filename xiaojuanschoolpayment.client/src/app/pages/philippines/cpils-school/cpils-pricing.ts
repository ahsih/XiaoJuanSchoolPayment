import { CiaContentConfig, CiaCourseContent, CiaPromotionRule } from '../cia-school/cia-content-config';
import { QuotePlanKind, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';

const DAY = 86400000;
export const CPILS_POLICY_VERSION = 5;

/** ACR I-CARD comes with the first tourist-visa extension (user rule 2026-11-24); ARP stays with the second. */
export const CPILS_ACR_NOTE = '第一次续签时办理（30天签证第5周起，59天签证第9周起），学校统一带队到移民局。';
export const CPILS_ARP_NOTE = '第二次续签时办理一次（59天签证的首次续签即为第二次）；长期签证另行确认。';
/** The version-2 notes that said ACR I-CARD came with the second extension; untouched copies are replaced once. */
export const CPILS_OLD_ACR_NOTES: Readonly<Record<string, readonly string[]>> = {
  'acr-i-card': ['第二次续签时办理（59天签证的首次续签即为第二次），学校统一带队到移民局。'],
  arp: ['与ACR I-CARD同时办理一次；长期签证另行确认。'],
};
export const cpilsMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
export const cpilsMonday = (sunday: string) => {
  const time = Date.parse(`${sunday}T00:00:00Z`);
  return Number.isFinite(time) ? new Date(time + DAY).toISOString().slice(0, 10) : '';
};

// Exact school rows. Ordinary stays >= 4 weeks still use the user-confirmed
// per-student four-week tier; the longer rounded source rows are not substitutes.
const short = (one: number | null, two: number | null, three: number | null) =>
  Object.fromEntries([one, two, three].flatMap((value, i) => value === null ? [] : [[String(i + 1), value]]));
const course2027: Record<string, { price: number; prices: Record<string, number>; weeks?: number[] }> = {
  'general-esl-light': { price: 700, prices: short(287, 455, 595) },
  'general-esl': { price: 982, prices: short(403, 638, 834) },
  'general-esl-plus': { price: 982, prices: short(403, 638, 834) },
  'esl-premium': { price: 1092, prices: short(448, 710, 928) },
  'premier-sparta': { price: 1092, prices: short(448, 710, 928) },
  'toeic-course': { price: 1092, prices: short(448, 710, 928) },
  'toefl-course': { price: 1092, prices: short(448, 710, 928) },
  'ielts-course': { price: 1152, prices: {} },
  'toeic-guarantee': { price: 0, prices: { '12': 3566 }, weeks: [12] },
  'ielts-guarantee-8-weeks': { price: 0, prices: { '8': 2750 }, weeks: [8] },
  'ielts-guarantee-12-weeks': { price: 0, prices: { '12': 3569 }, weeks: [12] },
  'business-english': { price: 1092, prices: {}, weeks: [4, 8] },
  'power-speaking-and-modern-communication': { price: 1092, prices: {}, weeks: [4, 8] },
  'tesol': { price: 1092, prices: {}, weeks: [4, 8, 12] },
  'medical-english': { price: 1092, prices: {}, weeks: [4, 8, 12] },
  'hotel-hospitality': { price: 1092, prices: {}, weeks: [4, 8, 12] },
  'barista-beverage': { price: 1092, prices: {}, weeks: [4, 8, 12] },
  'working-holiday': { price: 1092, prices: {}, weeks: [4, 8, 12] },
  'practicum': { price: 105, prices: {}, weeks: [4, 8, 12] },
  // The new school sheet does not quote Pre-IELTS separately.
  'pre-ielts-course': { price: 0, prices: {}, weeks: [] },
};
const room2027: Record<string, [number, number | null, number, number]> = {
  'regular-single': [1045, 428, 679, 888], 'regular-twin': [882, 362, 573, 750],
  'regular-triple': [814, 334, 529, 692], 'regular-quad': [735, null, 478, 625],
  'no-window-single': [1045, 428, 679, 888], 'no-window-twin': [882, 362, 573, 750],
  'premium-single': [1139, 467, 741, 968], 'premium-twin': [956, 392, 621, 812],
  'premium-triple': [893, 366, 580, 759], 'premium-quad': [819, null, 532, 696],
};
const additions = [
  ['esl-premium', 'ESL Premium'], ['tesol', 'TESOL'], ['medical-english', '医学英语'],
  ['hotel-hospitality', '酒店与服务业'], ['barista-beverage', '咖啡师与饮品'],
  ['working-holiday', '打工度假'], ['practicum', '实习'],
];

/** Adds the dated notice once; subsequent employee edits remain authoritative. */
export function upgradeCpils2027(config: CiaContentConfig): void {
  const version = config.quoteSettings.cpilsPolicy?.version ?? 0;
  if (version < 1) addCpils2027Notice(config);
  if (version < 2) addCpilsVersion2(config);
  if (version < 3) addCpilsVersion3(config);
  if (version < 4) addCpilsVersion4(config);
  if (version < 5) addCpilsVersion5(config);
}

// The school's 2026 price list (received 2026-11-24): 1-3-week prices and the courses it prices for 2026.
const course2026: Record<string, { price?: number; prices?: Record<string, number>; weeks?: number[] }> = {
  'general-esl-light': { prices: short(246, 390, 510) },
  'general-esl': { prices: short(383, 608, 795) },
  'general-esl-plus': { prices: short(383, 608, 795) },
  'esl-premium': { price: 1040, prices: short(426, 676, 884) },
  'premier-sparta': { prices: short(426, 676, 884) },
  'toeic-course': { prices: short(426, 676, 884) },
  'toefl-course': { prices: short(426, 676, 884) },
  'business-english': { weeks: [4, 8] },
  'power-speaking-and-modern-communication': { weeks: [4, 8] },
  ...Object.fromEntries(['medical-english', 'tesol', 'barista-beverage', 'hotel-hospitality', 'working-holiday']
    .map(id => [id, { price: 1040, weeks: [4, 8, 12] }])),
};
const room2026: Record<string, [number | null, number, number]> = {
  'regular-single': [408, 647, 846], 'regular-twin': [344, 546, 714],
  'regular-triple': [318, 504, 659], 'regular-quad': [null, 455, 595],
  'no-window-single': [408, 647, 846], 'no-window-twin': [344, 546, 714],
  'premium-single': [445, 705, 922], 'premium-twin': [373, 592, 774],
  'premium-triple': [348, 552, 722], 'premium-quad': [null, 507, 663],
};
const DISCOUNT_TEXT_V4: Record<string, [string, string]> = {
  'cpils-sida': ['课程费和住宿费享9折。', '学校优惠之后，课程费和住宿费再享9折。'],
  'cpils-off-season-spring': ['思达启航9折后再享95折；单个课程或住宿项目须满4周。', '课程费和住宿费减去学校立减后享95折；单个课程或住宿项目须满4周。'],
  'cpils-off-season-fall': ['思达启航9折后再享95折；单个课程或住宿项目须满4周。', '课程费和住宿费减去学校立减后享95折；单个课程或住宿项目须满4周。'],
  'cpils-no-window': ['淡季入住无对外窗单人房或双人房，每满4周优惠50美元。', '淡季入住无对外窗单人房或双人房，每满4周优惠50美元，最多300美元。'],
};

/**
 * The school's 2026 price list and its formula (user 2026-11-24): 2026 short stays, the 2026 prices of
 * ESL Premium and the career courses, weekly management, and wording for the school's order of the
 * discounts, which version 5 replaced. Only untouched values change.
 */
function addCpilsVersion4(config: CiaContentConfig): void {
  for (const item of config.courses) {
    const next = course2026[item.id];
    if (next?.price && !item.tuition) item.tuition = next.price;
    if (next?.prices) item.feeByWeeks = { ...next.prices, ...(item.feeByWeeks ?? {}) };
    if (next?.weeks && !item.allowedWeeks) item.allowedWeeks = [...next.weeks];
    if (item.id === 'ielts-guarantee-12-weeks' && item.feeByWeeks?.['12'] === 3569.1) item.feeByWeeks['12'] = 3569;
  }
  for (const item of config.rooms) {
    const next = room2026[item.id];
    if (next && !Object.keys(item.feeByWeeks ?? {}).length) item.feeByWeeks = short(...next);
  }
  const management = config.localFees.find(item => item.id === 'management');
  if (management?.amount === 2000 && management.periodWeeks === 4 && management.note === '每4周2,000比索。') {
    Object.assign(management, { amount: 500, periodWeeks: 1, rounding: 'proportional', note: '每周500比索。' });
    if (config.quoteImageSettings.localFeeNotes?.['management'] === '每4周2,000比索。') config.quoteImageSettings.localFeeNotes['management'] = management.note;
  }
  for (const rule of config.quoteSettings.promotions) {
    const text = DISCOUNT_TEXT_V4[rule.id];
    if (text && rule.description === text[0]) rule.description = text[1];
  }
  config.quoteSettings.cpilsPolicy = { ...config.quoteSettings.cpilsPolicy!, version: 4 };
}

/** Version-4 wording and the wording of the order that costs the student least (user decision 2026-11-24). */
const DISCOUNT_TEXT_V5: Record<string, [string, string]> = {
  'cpils-sida': [DISCOUNT_TEXT_V4['cpils-sida'][1], '课程费和住宿费按原价享9折，学校优惠在此之后叠加。'],
  'cpils-off-season-spring': [DISCOUNT_TEXT_V4['cpils-off-season-spring'][1], DISCOUNT_TEXT_V4['cpils-off-season-spring'][0]],
  'cpils-off-season-fall': [DISCOUNT_TEXT_V4['cpils-off-season-fall'][1], DISCOUNT_TEXT_V4['cpils-off-season-fall'][0]],
};

/**
 * The order that costs the student least (user decision 2026-11-24): 思达启航's 10% on the full price, then
 * the school's 5%, then the fixed school deductions. Only untouched version-4 wording changes.
 */
function addCpilsVersion5(config: CiaContentConfig): void {
  for (const rule of config.quoteSettings.promotions) {
    const text = DISCOUNT_TEXT_V5[rule.id];
    if (text && rule.description === text[0]) rule.description = text[1];
  }
  config.quoteSettings.cpilsPolicy = { ...config.quoteSettings.cpilsPolicy!, version: 5 };
}

/**
 * Every CPILS IELTS course; their weeks together count toward the 12-week official IELTS exam gift
 * (school answer 2026-11-23: Pre-IELTS too), and an IELTS Guarantee of either length gets it as well.
 */
export const CPILS_IELTS_COURSE_IDS = ['pre-ielts-course', 'ielts-course', 'ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks'];

/** The five career-training courses of the 2027 career offer (school poster, 2026-11-23). */
export const CPILS_CAREER_COURSE_IDS = ['medical-english', 'tesol', 'barista-beverage', 'hotel-hospitality', 'working-holiday'];

/**
 * The school's four 2027 posters (received 2026-11-23): Easter and Christmas / New Year deductions for a
 * study period covering the holiday week, a career-course deduction by course weeks, and two free weekend
 * activities. All stack with the other offers; the activities and deductions cannot be cashed or transferred.
 */
function addCpilsVersion3(config: CiaContentConfig): void {
  const settings = config.quoteSettings;
  const rule = (id: string, name: string, description: string, sortOrder: number, extra: Partial<CiaPromotionRule>): CiaPromotionRule => ({
    id, name, description, enabled: true, sortOrder, priority: sortOrder * 10, stackable: true, newStudentsOnly: false,
    discountType: 'fixed', discountValue: 0, appliesTo: 'school-total', waiveRegistration: false,
    minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none', ...extra,
  });
  const holidays = { registrationStart: '2026-11-23', coverageTarget: 'course' as const };
  const rules = [
    rule('cpils-easter-2027', '2027复活节优惠', '2026/11/23–2027/03/21报名，至少4周，学习期涵盖2027/03/21–03/27。', 11, {
      ...holidays, discountValue: 75, minimumCourseWeeks: 4, registrationEnd: '2027-03-21', coverageStart: '2027-03-21', coverageEnd: '2027-03-27',
    }),
    rule('cpils-christmas-2027', '2027圣诞优惠', '2026/11/23–2027/12/26报名，学习期涵盖2027/12/19–12/25。', 12, {
      ...holidays, discountValue: 50, registrationEnd: '2027-12-26', coverageStart: '2027-12-19', coverageEnd: '2027-12-25',
    }),
    rule('cpils-new-year-2027', '2027圣诞及新年优惠', '2026/11/23–2027/12/26报名，学习期涵盖2027/12/19–2028/01/01。', 13, {
      ...holidays, discountValue: 100, registrationEnd: '2027-12-26', coverageStart: '2027-12-19', coverageEnd: '2028-01-01',
    }),
    rule('cpils-career-2027', '2027职业培训课程优惠', '2027年开课的职业培训课程：4–7周减50美元，8–11周减100美元，12–15周减150美元，16周及以上减200美元。', 14, {
      appliesTo: 'tuition', minimumCourseWeeks: 4, eligibleCourseIds: [...CPILS_CAREER_COURSE_IDS],
      discountValue: 50, discountTiers: { '4': 50, '8': 100, '12': 150, '16': 200 }, arrivalStart: '2027-01-01', arrivalEnd: '2027-12-31',
    }),
    rule('cpils-weekend-2027', '2027周末活动赠送', '2027/01/02–05/29开课、至少报名8周：免费参加奥斯洛布观鲸鲨1次、跳岛游1次（均含餐饮）。', 15, {
      discountType: 'none', discountValue: 2, minimumCourseWeeks: 8, arrivalStart: '2027-01-02', arrivalEnd: '2027-05-29',
    }),
  ];
  for (const item of rules) if (!settings.promotions.some(existing => existing.id === item.id)) settings.promotions.push(item);
  // Every IELTS course, Pre-IELTS included, counts toward the 12-week exam gift, and the 8-week
  // IELTS Guarantee gets the exam too (school answers 2026-11-23).
  const ielts = settings.promotions.find(item => item.id === 'cpils-ielts-exam-2027');
  if (ielts) {
    ielts.eligibleCourseIds = [...new Set([...(ielts.eligibleCourseIds ?? []), ...CPILS_IELTS_COURSE_IDS])];
    ielts.description = ielts.description.replace('雅思课程一次注册12周及以上，', '雅思课程（含预备雅思）一次注册12周及以上，或雅思保分班一次性注册8周，');
  }
  settings.cpilsPolicy = { ...settings.cpilsPolicy!, version: 3 };
}

/** Courses of a family (PCP) quote; they may only use the premium twin, triple or quad rooms. */
const NEW_2027 = '2027年新增价格项目；2026年价格须确认。';
const guaranteeNote = (weeks: number) => `须一次注册${weeks}周；入学门槛及保分条件请向顾问确认。`;
const COURSE_TEXT_V2: Record<string, { oldNote: string; name?: [string, string]; schedule?: string; suitable: string; note: string }> = {
  'general-esl': { oldNote: '适合基础到进阶综合提升。', name: ['General ESL', '普通ESL'], suitable: '想全面提升听说读写、晚上想自由安排的学生', note: '每天9小时，含2小时选修课，没有强制晚自习。' },
  'general-esl-light': { oldNote: '仅限淡季入学。', name: ['General ESL Light', '轻松ESL（Light）'], suitable: '只想轻松学、下午想自由安排的学生', note: '每天5节课，13:15下课；7、8月不开课。' },
  'general-esl-plus': { oldNote: '适合希望增加一对一课时的学生。', name: ['General ESL Plus', '普通ESL Plus'], suitable: '想多上一对一的学生', note: '每天9小时，比普通ESL多1节1:1。' },
  'esl-premium': { oldNote: NEW_2027, schedule: '5堂1:1 + 2堂1:4 + 2堂1:12 + 3堂选修课', suitable: '想多上课、但不想被强制晚自习的学生', note: '每天12小时，第10–12节为选修课。' },
  'premier-sparta': { oldNote: '适合需要明确管理和高强度学习节奏的学生。', suitable: '自律较弱、需要学校管住节奏的学生', note: '每天12小时，含2小时强制自习。' },
  'pre-ielts-course': { oldNote: '2027年价目表未单列雅思预备课程价格，请向顾问确认。', suitable: '雅思基础较弱（约1.0–2.5分）、想先打好基础的学生', note: '每天12小时，含3小时强制自习；每两周一次模考，4周起报。' },
  'ielts-course': { oldNote: '每月2次模拟考试，4周起报。', suitable: '准备雅思、入学约3.0分以上的学生', note: '每天12小时，含3小时强制自习；每月2次模考，4周起报。' },
  'ielts-guarantee-8-weeks': { oldNote: guaranteeNote(8), name: ['雅思保证班（8周）', '雅思保分班（8周）'], suitable: '入学雅思4.0–5.0分、想8周保分的学生', note: '须一次注册8周；保分目标见下方课程细节。' },
  'ielts-guarantee-12-weeks': { oldNote: guaranteeNote(12), name: ['雅思保证班（12周）', '雅思保分班（12周）'], suitable: '入学雅思5.5–6.5分、想冲6.5–7.5分的学生', note: '须一次注册12周；保分目标见下方课程细节。' },
  'toeic-course': { oldNote: '每月2次模拟考试。', suitable: '准备托业考试的学生', note: '每天12小时，含3小时强制自习；每月2次模考。' },
  'toeic-guarantee': { oldNote: guaranteeNote(12), name: ['托业保证班', '托业保分班（12周）'], suitable: '入学托业400分以上、想12周保分的学生', note: '须一次注册12周；保分目标见下方课程细节。' },
  'toefl-course': { oldNote: '每月1次模拟考试。', name: ['TOEFL Course', '托福课程'], suitable: '准备托福、已有中级水平的学生', note: '入学需约雅思5.0或托业600分；每月1次模考。' },
  'business-english': { oldNote: '4周起报。', name: ['Business English', '商务英语'], suitable: '工作中需要英语汇报和沟通的学生', note: '4周或8周；每两周开课，须自带笔记本电脑。' },
  'power-speaking-and-modern-communication': { oldNote: '4周起报。', name: ['PMC演讲课程', 'PMC演讲与沟通'], suitable: '想练演讲、提升表达自信的学生', note: '4周或8周；每天12小时，含2小时强制自习。' },
  tesol: { oldNote: NEW_2027, schedule: '4堂1:1（含3堂TESOL理论）+ 2堂1:4 + 1堂1:12 + 2堂大团体', suitable: '以后想教英语的学生', note: '需准中级以上水平；含导师指导下的实习教学。' },
  'medical-english': { oldNote: NEW_2027, schedule: '4堂1:1 + 2堂1:4 + 1堂1:12 + 1堂1:15听力 + 1堂大团体', suitable: '医护相关专业或工作的学生', note: '需初级以上水平；4周起。' },
  'hotel-hospitality': { oldNote: NEW_2027, schedule: '4堂1:1 + 2堂1:4 + 1堂1:12 + 2堂大团体', suitable: '想从事酒店和服务业的学生', note: '需初级以上水平；4周起，可选本地酒店实习。' },
  'barista-beverage': { oldNote: NEW_2027, schedule: '4堂1:1 + 2堂1:4 + 1堂1:12 + 1堂1:15商务新闻 + 1堂大团体', suitable: '想学咖啡和饮品行业英语的学生', note: '需初级以上水平；4周起，可选实习。' },
  'working-holiday': { oldNote: NEW_2027, schedule: '4堂1:1 + 2堂1:4 + 1堂1:12 + 2堂大团体', suitable: '准备去打工度假的学生', note: '需初级以上水平；4周起。' },
};

export const CPILS_PARENT_CHILD_COURSE_IDS =['pcp-intensive-parent', 'pcp-intensive-child', 'pcp-basic'];
/**
 * 2027 courses with a separate summer-peak price. The PCP child course costs 1,092 dollars per 4 weeks in the
 * peak weeks (the weeks the CALA peak surcharge counts) and the content document's off-season price (1,197)
 * in every other week (user decision 2026-11-21); a stay across both is split by week.
 */
export const CPILS_PEAK_COURSE_PRICES: Readonly<Record<string, { price: number; prices: Record<string, number> }>> = {
  'pcp-intensive-child': { price: 1092, prices: short(448, 710, 928) },
};
/** Weeks over this need a second SSP and the CRTV (user decision 2026-11-21); quotes go up to CPILS_MAX_WEEKS. */
export const CPILS_SSP_WEEKS = 24;
export const CPILS_MAX_WEEKS = 48;
/** ESL Light is not offered in July and August (orientation handbook; user decision 2026-11-21). */
export const CPILS_LIGHT_COURSE_ID = 'general-esl-light';
export const CPILS_PARENT_CHILD_ROOM_IDS = ['premium-twin', 'premium-triple', 'premium-quad'];

/** 2027 PCP price list (no 2026 PCP prices, so those registrations need an adviser) and handbook fee corrections. */
function addCpilsVersion2(config: CiaContentConfig): void {
  const pcp: Array<[string, string, number, Record<string, number>, string, string, string]> = [
    ['pcp-intensive-parent', '亲子强化课程（家长）', 982, short(403, 638, 834),
      '4堂1:1 + 2堂1:4 + 1堂1:12，每天7小时',
      '陪孩子一起学习、自己也想认真学的家长',
      '家长与孩子同校学习；须入住高级双人、三人或四人房。'],
    // Off-season price and timetable; the summer peak weeks use CPILS_PEAK_COURSE_PRICES.
    ['pcp-intensive-child', '亲子强化课程（孩子）', 1197, short(491, 778, 1017),
      '7堂1:1，不设团体课（淡季）',
      '9岁及以上、和家长同行的孩子',
      '旺季（2027/07/04–08/28）每天9小时：5堂1:1 + 1堂1:4 + 2堂1:12 + 1堂艺术音乐团体课，4周1,092美元；其余日期都是淡季。'],
    ['pcp-basic', '亲子基础课程', 700, short(287, 455, 595),
      '3堂1:1 + 1堂1:4 + 1堂1:12，每天5小时',
      '想轻松一起学的家长和9岁及以上的孩子',
      '家长和孩子同价；须入住高级双人、三人或四人房。'],
  ];
  for (const [id, name, price, prices, schedule, suitable, note] of pcp) {
    if (config.courses.some(item => item.id === id)) continue;
    config.courses.push({
      id, name, tuition: 0, tuition2027: price, feeByWeeks2027: { ...prices },
      schedule, suitable, note, enabled: true, sortOrder: config.courses.length,
    });
  }
  // Chinese names, separate fit and note texts, and full schedules for the courses the 2027 notice
  // added. A course changes only while its note is still the earlier default.
  for (const item of config.courses) {
    const text = COURSE_TEXT_V2[item.id];
    if (!text || item.note !== text.oldNote) continue;
    if (text.name && item.name === text.name[0]) item.name = text.name[1];
    if (text.schedule && item.schedule === '课程安排与入学要求请向顾问确认。') item.schedule = text.schedule;
    item.suitable = text.suitable;
    item.note = text.note;
  }
  // Pre-IELTS costs the same as the IELTS course (user decision 2026-11-21); the 2027 sheet does not
  // list it, so it takes the IELTS course's 2027 price while it still has none of its own.
  const preIelts = config.courses.find(item => item.id === 'pre-ielts-course');
  const ielts = config.courses.find(item => item.id === 'ielts-course');
  if (preIelts && ielts && !preIelts.tuition2027) {
    preIelts.tuition2027 = ielts.tuition2027;
    preIelts.feeByWeeks2027 = { ...(ielts.feeByWeeks2027 ?? {}) };
    preIelts.allowedWeeks2027 = ielts.allowedWeeks2027 ? [...ielts.allowedWeeks2027] : undefined;
  }
  if (preIelts?.schedule === '5堂1:1 + 1堂1:4 + 1堂1:8 + 2堂大团体 + 3堂强制自修') preIelts.schedule = '5堂1:1 + 4堂大团体 + 3堂强制自修';
  const settings = config.quoteSettings;
  if (settings.courseTableNote.startsWith('课程覆盖综合英语、斯巴达')) {
    settings.courseTableNote = '列表为2027年开课的4周价格，点开课程可看2026年内开课的价格；2026/09/28及之前报名、2027/05/29前开课仍按2026年价格。';
  }
  if (settings.groupClassNote.startsWith('雅思保证班按8周或12周起报')) {
    settings.groupClassNote = '1:4为小组课，1:12为团体课，1:15为大团体课；每节课45分钟。';
  }
  for (const rule of settings.stayPolicies ?? []) {
    if (rule.note === '斯巴达、保证班、未成年及考试要求以学校当期通知为准。') rule.note = '斯巴达、保分班、未成年及考试要求以学校当期通知为准。';
  }
  // The June 2026 orientation handbook: ARP is 200 pesos and comes with the second immigration extension
  // (the first one a 59-day visa needs). ACR I-CARD comes with the first extension of either visa (user rule
  // 2026-11-24, replacing the handbook's second extension). Only untouched defaults change.
  const notes: Record<string, [string, string]> = {
    'acr-i-card': ['首次旅游签证续签时办理，学校统一带队到移民局。', CPILS_ACR_NOTE],
    arp: ['旅游签证首次续签或长期签证时计入一次，须由顾问确认。', CPILS_ARP_NOTE],
    'visa-extension': ['按所选签证和完整停留时间预估，最终以移民局收费为准。', '30天签证首次续签5,130比索，第二次6,400比索；59天签证首次续签按第二次计；之后每次4,440比索。最终以移民局收费为准。'],
  };
  for (const item of config.localFees) {
    const oldNote = item.note;
    if (item.id === 'arp' && item.amount === 300) item.amount = 200;
    if (item.id === 'ssp' && item.note === '移民局收取；按报名学习时长办理，续费及换校需重新办理。') item.note = '入学时办理；学习超过24周须重新办理，再交一次。';
    if (item.id === 'crtv' && item.note === '2027年超过24周参考1,400比索；当前报价最多24周，不计入合计。') {
      Object.assign(item, { billingRule: 'once', includeInTotal: true, waiveForLongTermVisa: true, note: '学习超过24周时交一次。' });
    }
    const change = notes[item.id];
    if (change && item.note === change[0]) item.note = change[1];
    if (item.id === 'visa-extension' && item.futureNote?.startsWith('按学校30天续签收费方案预估')) {
      item.futureNote = '2027年续签：30天签证首次5,130比索，第二次6,400比索，之后每次4,440比索；59天签证首次续签按第二次计。最终以移民局收费为准。';
    }
    if (item.note !== oldNote && config.quoteImageSettings.localFeeNotes?.[item.id] === oldNote) config.quoteImageSettings.localFeeNotes[item.id] = item.note;
  }
  config.quoteSettings.cpilsPolicy = { ...config.quoteSettings.cpilsPolicy!, version: 2 };
}

function addCpils2027Notice(config: CiaContentConfig): void {
  const settings = config.quoteSettings;
  settings.cpilsPolicy = {
    version: 1, grandfatherCourseStartEnd: '2027-05-29',
    promotionBlackoutStart: '2027-05-31', promotionBlackoutEnd: '2027-08-29',
    earlySummerRegistrationEnd: '2026-12-31', earlySummerMinimumWeeks: 8,
  };
  settings.futurePriceRegistrationStart = '2026-09-29';
  settings.futurePriceArrivalStart = '2027-01-01';
  for (const [id, name] of additions) if (!config.courses.some(item => item.id === id)) {
    config.courses.push({ id, name, tuition: 0, tuition2027: 0, schedule: '课程安排与入学要求请向顾问确认。', suitable: '', note: '2027年新增价格项目；2026年价格须确认。', enabled: true, sortOrder: config.courses.length });
  }
  for (const item of config.courses) {
    const next = course2027[item.id];
    if (!next) continue;
    item.tuition2027 = next.price;
    item.feeByWeeks2027 = { ...next.prices };
    item.allowedWeeks2027 = next.weeks;
    if (item.id.includes('guarantee')) {
      item.allowedWeeks = item.id === 'ielts-guarantee-8-weeks' ? [8] : [12];
      item.feeByWeeks = { [item.allowedWeeks[0]]: cpilsMoney(item.tuition * item.allowedWeeks[0] / 4) };
      item.note = item.suitable = `须一次注册${item.allowedWeeks[0]}周；入学门槛及保分条件请向顾问确认。`;
    }
    if (item.id === 'pre-ielts-course') item.note = item.suitable = '2027年价目表未单列雅思预备课程价格，请向顾问确认。';
  }
  for (const item of config.rooms) {
    const next = room2027[item.id];
    if (!next) continue;
    item.fee2027 = next[0];
    item.feeByWeeks2027 = short(next[1], next[2], next[3]);
    if (item.id.startsWith('no-window')) item.note = '窗户面向走廊，无对外窗；按所选日期确认空房及优惠。';
    if (item.id === 'regular-quad') item.note = '经济型校内住宿；一周短住未列价格。';
  }
  const datedFees: Record<string, Partial<CiaContentConfig['localFees'][number]>> = {
    management: { futureAmount: 600, futurePeriodWeeks: 1, futureRounding: 'proportional', futureNote: '2027/01/01起每周600比索；跨年住宿按生效日期分段预估。' },
    arp: { futureAmount: 200, futureNote: '2027年ARP参考200比索；首次续签或长期签证按学校要求办理。' },
    pickup: { futureAmount: 1200, futureNote: '2027年接机参考1,200比索；学校团体接机及同行收费单位须确认。' },
    'student-id': { futureName: 'ID照片', futureAmount: 100, futureNote: '2027年价目表列为ID照片，一次100比索。' },
    'fan-prepayment': { futureName: 'ID-Load预存', futureAmount: 1000, futureNote: '2027年价目表列为ID-Load预存1,000比索；用途及退还条件须由学校确认。' },
    'visa-extension': { futureRates: [5130, 6400, 4440, 4440, 4440, 4400], futureNote: '按学校30天续签收费方案预估；第二次59天方案6,900比索，第三至第六次59天方案各4,940比索，需学校确认办理方案。' },
  };
  for (const item of config.localFees) {
    const oldNote = item.note;
    const next = datedFees[item.id];
    if (next) Object.assign(item, { futureEffectiveStart: '2027-01-01', ...next });
    if (item.id === 'electricity') item.note = '电费按22比索／千瓦时实际用量结算；当前暂按每4周2,000比索准备。';
    if (item.id === 'books') item.note = '学校教材参考1,500–2,500比索，按实际购买结算；当前暂按每4周2,500比索准备。';
    if (item.note !== oldNote && config.quoteImageSettings.localFeeNotes?.[item.id] === oldNote) config.quoteImageSettings.localFeeNotes[item.id] = item.note;
  }
  if (!config.localFees.some(item => item.id === 'crtv')) config.localFees.push({ id: 'crtv', name: 'CRTV（超过24周）', amount: 1400, currency: 'PHP', billingRule: 'optional', includeInTotal: false, note: '2027年超过24周参考1,400比索；当前报价最多24周，不计入合计。', enabled: true, sortOrder: 13 });
  const terms = '报名2026/09/29–2027/12/27，开课2027/01/01–12/27；不适用于2027/05/31–08/29开课。';
  const promotion = (id: string, name: string, description: string, sortOrder: number, extra: Partial<CiaPromotionRule>): CiaPromotionRule => ({
    id, name, description, enabled: true, sortOrder, priority: sortOrder * 10, stackable: true, newStudentsOnly: false,
    discountType: 'none', discountValue: 0, appliesTo: 'tuition-and-accommodation', waiveRegistration: false,
    minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, coverageTarget: 'none',
    registrationStart: '2026-09-29', registrationEnd: '2027-12-27', arrivalStart: '2027-01-01', arrivalEnd: '2027-12-27', ...extra,
  });
  const promos = [
    promotion('cpils-scholarship-2027', '2027年奖学金优惠', `${terms}至少注册4周，学费及住宿费减免5%，可与思达启航优惠叠加。`, 7, { discountType: 'percentage', discountValue: 5 }),
    promotion('cpils-no-window-2027', '2027年无对外窗房优惠', `${terms}无对外窗单人／双人房：4–7周50美元、8–11周100美元、12–15周150美元、16–19周200美元、20–23周250美元、24周300美元；可与其他优惠同享。`, 8, { discountType: 'fixed', discountValue: 50, appliesTo: 'accommodation', eligibleRoomIds: ['no-window-single', 'no-window-twin'], minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 50 }),
    promotion('cpils-ielts-exam-2027', '2027年雅思官方考试赠送', `${terms}雅思课程（含预备雅思）一次注册12周及以上，或雅思保分班一次性注册8周，赠1次官方考试，可与其他优惠同享。`, 9, { minimumCourseWeeks: 12, eligibleCourseIds: [...CPILS_IELTS_COURSE_IDS], discountValue: 1 }),
    promotion('cpils-toeic-exam-2027', '2027年托业官方考试赠送', `${terms}托业课程4–7周赠1次，每满4周增加1次，24周赠6次；可与其他优惠同享。`, 10, { eligibleCourseIds: ['toeic-course', 'toeic-guarantee'], discountValue: 1, incrementWeeks: 4, incrementValue: 1 }),
  ];
  for (const rule of promos) if (!settings.promotions.some(item => item.id === rule.id)) settings.promotions.push(rule);
  if (!settings.peakSeasonRanges.some(item => item.id === 'cpils-summer-2027')) settings.peakSeasonRanges.push({ id: 'cpils-summer-2027', label: '2027暑假旺季', start: '2027-07-04', end: '2027-08-28', enabled: true });
  settings.courseTableTitle = 'CPILS 2027年课程价格';
  settings.roomTableTitle = 'CPILS 2027年住宿价格';
  settings.courseTableNote = '2026/09/29起报名且2027年开课适用新价；2026/09/28及之前报名、2027/01/01–05/29开课保留2026标准价，不适用2027学校优惠。';
  settings.roomTableNote = '2027年住宿价格与学费按同一报名政策执行；房费按人报价，空房须按入住日期确认。';
  settings.groupClassNote = '保分班为固定8周或12周项目；商务／PMC为4周或8周，TESOL及职业课程为4周、8周或12周。降级换课不退差价（课程资格不符除外）。';
  settings.stayPolicies.push({ label: '2027暑期报名', value: '提前报名至少8周', note: '2026/12/31及之前报名、学习涉及2027/07/05–08/29旺季，至少注册8周；4周名额另行通知。' });
  settings.localFeeIntro = '当地费用以比索计价。2027/01/01起执行新标准，包括跨年在校学生；水电、教材及跨年分段金额为预算参考，最终按学校账单结算。';
  config.quoteImageSettings.localFeeIntro = settings.localFeeIntro;
}

export interface CpilsPlanContext { quotePlan: SchoolQuotePlan; selectedRegistrationDate: string; }
export type CpilsPriceYear = 2026 | 2027 | 'unconfirmed';
export function cpilsPriceYear(config: CiaContentConfig, student: CpilsPlanContext): CpilsPriceYear {
  const start = cpilsMonday(student.quotePlan.courses[0]?.startDate ?? '');
  const settings = config.quoteSettings;
  if (!start || !student.selectedRegistrationDate) return 'unconfirmed';
  if (start < settings.futurePriceArrivalStart) return 2026;
  if (start > '2027-12-31') return 'unconfirmed';
  if (student.selectedRegistrationDate >= settings.futurePriceRegistrationStart) return 2027;
  return start <= settings.cpilsPolicy!.grandfatherCourseStartEnd ? 2026 : 'unconfirmed';
}

export function cpilsMergedCourses(plan: SchoolQuotePlan): QuotePlanRow[] {
  const merged: QuotePlanRow[] = [];
  for (const row of plan.courses) {
    const last = merged.at(-1);
    if (last?.optionId === row.optionId && Date.parse(row.startDate) === Date.parse(plan.end(last)) + DAY) last.weeks += row.weeks;
    else merged.push({ ...row });
  }
  return merged;
}

export function cpilsRowPrice(config: CiaContentConfig, student: CpilsPlanContext, kind: QuotePlanKind, row: QuotePlanRow): number {
  const year = cpilsPriceYear(config, student);
  if (year === 'unconfirmed') return 0;
  const item = (kind === 'course' ? config.courses : config.rooms).find(option => option.id === row.optionId && option.enabled);
  if (!item) return 0;
  const course = item as CiaCourseContent;
  const exact = year === 2027 ? item.feeByWeeks2027 : item.feeByWeeks;
  if (kind === 'course' && row.optionId.includes('guarantee')) {
    const merged = cpilsMergedCourses(student.quotePlan).find(group => group.optionId === row.optionId && row.startDate >= group.startDate && row.startDate <= student.quotePlan.end(group));
    if (!merged || exact?.[merged.weeks] === undefined) return 0;
    const offset = (Date.parse(row.startDate) - Date.parse(merged.startDate)) / (7 * DAY);
    return cpilsMoney(cpilsMoney(exact[merged.weeks] * (offset + row.weeks) / merged.weeks) - cpilsMoney(exact[merged.weeks] * offset / merged.weeks));
  }
  const tier = student.quotePlan.courseWeeks < 4 ? student.quotePlan.courseWeeks : 4;
  const peak = kind === 'course' && year === 2027 ? CPILS_PEAK_COURSE_PRICES[row.optionId] : undefined;
  const peakWeeks = peak ? cpilsPeakWeeks(config, student.quotePlan, row) : 0;
  const offWeeks = row.weeks - peakWeeks;
  if (tier < 4) {
    if (exact?.[tier] === undefined) return 0;
    return cpilsMoney(exact[tier] / tier * offWeeks + (peak ? peak.prices[tier] / tier * peakWeeks : 0));
  }
  const price = 'tuition' in item ? year === 2027 ? course.tuition2027 : course.tuition : year === 2027 ? item.fee2027 ?? 0 : item.fee;
  return cpilsMoney(price / 4 * offWeeks + (peak ? peak.price / 4 * peakWeeks : 0));
}

/** Weeks of a row that touch an enabled peak range, counted like the peak surcharge. */
export function cpilsPeakWeeks(config: CiaContentConfig, plan: SchoolQuotePlan, row: QuotePlanRow): number {
  const ranges = config.quoteSettings.peakSeasonRanges.filter(range => range.enabled)
    .map(range => [Date.parse(`${range.start}T00:00:00Z`), Date.parse(`${range.end}T00:00:00Z`)]);
  return plan.weekStarts([row]).filter(week => ranges.some(([start, end]) => week <= end && week + 6 * DAY >= start)).length;
}

/** Whether a row has a class day (Monday to Friday) in July or August. */
function cpilsTouchesSummerMonths(plan: SchoolQuotePlan, row: QuotePlanRow): boolean {
  return plan.weekStarts([row]).some(sunday => [1, 2, 3, 4, 5].some(day => [6, 7].includes(new Date(sunday + day * DAY).getUTCMonth())));
}

export function cpilsPolicyError(config: CiaContentConfig, student: CpilsPlanContext): string {
  const plan = student.quotePlan;
  if (plan.date(student.selectedRegistrationDate) === null) return '请选择有效的预计报名日。';
  if (student.selectedRegistrationDate > cpilsMonday(plan.courses[0]?.startDate ?? '')) return '预计报名日不能晚于开课日。';
  const year = cpilsPriceYear(config, student);
  if (year === 'unconfirmed') return '所选报名日与开课日的价格尚未确认，请联系顾问报价。';
  for (const row of cpilsMergedCourses(plan)) {
    const item = config.courses.find(course => course.id === row.optionId);
    if (!item) continue;
    const weeks = year === 2027 ? item.allowedWeeks2027 : item.allowedWeeks;
    if (weeks && !weeks.includes(row.weeks)) return weeks.length ? `${item.name}须一次注册${weeks.join('／')}周，请调整课程安排。` : `${item.name}的2027年价格尚未确认，请联系顾问。`;
    if (cpilsRowPrice(config, student, 'course', row) <= 0) return `${item.name}暂无所选年份及周数价格，请联系顾问。`;
  }
  for (const row of plan.rooms) if (cpilsRowPrice(config, student, 'room', row) <= 0) return '所选房型暂无该年份及短住周数价格，请联系顾问。';
  const light = plan.courses.find(row => row.optionId === CPILS_LIGHT_COURSE_ID && cpilsTouchesSummerMonths(plan, row));
  if (light) return `${config.courses.find(course => course.id === CPILS_LIGHT_COURSE_ID)?.name ?? '轻松ESL（Light）'}7、8月不开课，请改选其他课程或调整日期。`;
  if (plan.courses.some(row => CPILS_PARENT_CHILD_COURSE_IDS.includes(row.optionId))
    && plan.rooms.some(row => !CPILS_PARENT_CHILD_ROOM_IDS.includes(row.optionId))) return '亲子课程须入住高级双人、三人或四人房，请调整房型。';
  const policy = config.quoteSettings.cpilsPolicy!;
  const summer = config.quoteSettings.peakSeasonRanges.find(range => range.id === 'cpils-summer-2027' && range.enabled);
  if (summer && student.selectedRegistrationDate <= policy.earlySummerRegistrationEnd && plan.overlapWeeks(summer.start, summer.end) > 0 && plan.courseWeeks < policy.earlySummerMinimumWeeks) return `2027暑期提前报名须至少${policy.earlySummerMinimumWeeks}周；短期名额待学校通知，请联系顾问。`;
  return '';
}

export function cpils2027Eligible(config: CiaContentConfig, student: CpilsPlanContext, rule: CiaPromotionRule | undefined): boolean {
  if (!rule?.enabled || cpilsPriceYear(config, student) !== 2027) return false;
  const start = cpilsMonday(student.quotePlan.courses[0]?.startDate ?? '');
  const policy = config.quoteSettings.cpilsPolicy!;
  return !(start >= policy.promotionBlackoutStart && start <= policy.promotionBlackoutEnd)
    && (!rule.registrationStart || student.selectedRegistrationDate >= rule.registrationStart)
    && (!rule.registrationEnd || student.selectedRegistrationDate <= rule.registrationEnd)
    && (!rule.arrivalStart || start >= rule.arrivalStart) && (!rule.arrivalEnd || start <= rule.arrivalEnd)
    && student.quotePlan.courseWeeks >= rule.minimumCourseWeeks && student.quotePlan.roomWeeks >= rule.minimumAccommodationWeeks;
}

/** Courses kept off the page and out of the quote: Practicum is an add-on that cannot stand alone. */
export const CPILS_HIDDEN_COURSE_IDS = ['practicum'];

/** Courses the page and the quote offer: enabled, priced for 2027 (a 4-week price or an exact package) and not hidden. */
export function cpilsVisibleCourses<T extends { id: string }>(content: CiaContentConfig, courses: readonly T[]): T[] {
  return courses.filter(course => {
    if (CPILS_HIDDEN_COURSE_IDS.includes(course.id)) return false;
    const source = content.courses.find(item => item.id === course.id);
    return !!source && (source.tuition2027 > 0 || Object.values(source.feeByWeeks2027 ?? {}).some(value => value > 0));
  });
}

/** Rooms in the quote and the price list carry their 2027 four-week price. */
export function cpilsRooms2027<T extends { id: string; fee: number }>(content: CiaContentConfig, rooms: readonly T[]): T[] {
  return rooms.map(room => {
    const source = content.rooms.find(item => item.id === room.id);
    return source?.fee2027 ? { ...room, fee: source.fee2027 } : room;
  });
}

/** 1/2/3-week share of the 4-week price shown above the room list (CPILS lists exact short-stay prices). */
export function cpilsShortStayRatios(content: CiaContentConfig): Record<string, number> {
  const course = content.courses.find(item => item.id === 'general-esl');
  const four = course?.tuition2027 ?? 0;
  const rows = course?.feeByWeeks2027 ?? {};
  if (!four) return { ...content.quoteSettings.shortStayRatios };
  return Object.fromEntries(['1', '2', '3'].filter(week => rows[week]).map(week => [week, rows[week] / four]));
}
