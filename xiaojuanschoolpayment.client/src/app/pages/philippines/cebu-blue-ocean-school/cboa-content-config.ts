// Cebu Blue Ocean Academy (蓝海CBOA): the versioned employee content document. Courses and rooms carry both price
// years (`tuition`/`fee` = 2026, `tuition2027`/`fee2027` = the 2027 price list); the public page, its quote
// (cboa-page-quote.ts), the local-fee table and the quote image all read the published version of this document.
// Source: the school's November 2026 pack (2027 price list, 2027 promotions, price notes and minor policy).
// Keep it pure data (no Angular, DOM or storage). Never add the school's phone, address, website or social accounts.
import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Raised when saved documents must take a school notice once (cloneBlueOceanContentConfig):
 * 1 = the 2027 price list, 2027 promotions, 2027 local fees and the school's own 2027 peak dates (2026-11-23).
 */
export const CBOA_POLICY_VERSION = 1;
type CboaQuoteSettings = CiaQuoteSettings & { cboaPolicyVersion?: number };

/**
 * The school's price notes: tuition, rooms, registration and offers follow the registration date (before this day the
 * 2026 prices and offers, from it the 2027 ones); local fees follow the entry date in the same way.
 */
export const CBOA_PRICE_SWITCH = '2027-02-01';
/** The 2027 offers need registration 2027/02/01–06/30 and entry from 2027/02/01. */
export const CBOA_2027_PROMOTION_REGISTRATION_END = '2027-06-30';
/** Students entering from this day must be 18 or older for every course except the Junior family course. */
export const CBOA_ADULT_ONLY_FROM = '2026-08-23';

export const CBOA_JUNIOR_COURSE_ID = 'junior';
export const CBOA_PARENT_COURSE_ID = 'parents';
export const CBOA_SURVIVAL_COURSE_ID = 'survival-esl';
export const CBOA_SENIOR_COURSE_ID = 'senior';
export const CBOA_FAMILY_COURSE_IDS: readonly string[] = [CBOA_JUNIOR_COURSE_ID, CBOA_PARENT_COURSE_ID];
export const CBOA_COUPLE_ROOM_ID = 'ocean-suite-couple';
export const CBOA_OCEAN_SUITES_ROOM_IDS: readonly string[] = [
  'ocean-suite-ocean', 'ocean-suite-deluxe', 'ocean-suite-superior', CBOA_COUPLE_ROOM_ID,
];

const course = (
  id: string, name: string, tuition: number, tuition2027: number, schedule: string, suitable: string, note: string, sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({ id, name, tuition, tuition2027, schedule, suitable, note, enabled: true, sortOrder, ...extra });

const room = (
  id: string, name: string, code: string, group: string, location: '校内' | '校外', fee: number, fee2027: number, note: string, sortOrder: number,
): CiaRoomContent => ({ id, name, label: name, code, location, group, fee, fee2027, note, enabled: true, sortOrder });

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({ ...value, currency: 'PHP', enabled: true });

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: (value.sortOrder + 1) * 10,
  stackable: true,
  newStudentsOnly: false,
  discountType: 'fixed',
  discountValue: 0,
  appliesTo: 'tuition-and-accommodation',
  waiveRegistration: false,
  minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'none',
  ...value,
});

// Class lines from the brochure's course table and the 2027 price list (classes per day, 1:1 and 4:1).
const createCourses = (): CiaCourseContent[] => [
  course('light-esl', '基础ESL Light ESL', 870, 920, '每天4节一对一',
    '想轻松一点、留时间自习或出游的学生', '一对一：口语、句型、阅读与发音、听力。', 0),
  course('intensive-esl', '强化口语 Intensive ESL', 970, 1020, '5节一对一 + 2节小组课（4:1）',
    '想全面提升口语的学生', '一对一：口语、句型、阅读与发音、语法、词汇；小组课：讨论、听力。', 1),
  course(CBOA_SURVIVAL_COURSE_ID, '生存ESL Survival ESL', 1050, 1100, '4节一对一 + 2节小组课（4:1）',
    '基础较弱、想先学会日常沟通的学生', '一对一：句型、会话练习、阅读、语法；小组课：口语。最多读4周。', 2, { allowedWeeks: [1, 2, 3, 4] }),
  course('power-esl-5', '进阶ESL 5 Power ESL 5', 930, 980, '每天5节一对一',
    '只想上一对一、口语提升更快的学生', '一对一：口语、阅读与发音、听力、词汇、句型。', 3),
  course('power-esl-7', '进阶ESL 7 Power ESL 7', 1170, 1220, '每天7节一对一',
    '时间短、想高强度一对一的学生', '一对一：口语、阅读与发音、听力、词汇、句型、语法、讨论。', 4),
  course(CBOA_SENIOR_COURSE_ID, '40岁以上课程 Senior Course', 1050, 1100, '4节一对一 + 1节小组提升课（4:1）',
    '40岁及以上的学生', '只接受40岁及以上的学生报名。', 5),
  course('toeic', '托业 TOEIC', 1050, 1100, '5节一对一 + 2节小组课（4:1）',
    '准备托业考试的学生', '一对一：阅读理解（Part 7）、语法练习、听力（Part 3–4）、阅读，另有1节可选教材；小组课：听力（Part 1–4）。', 6),
  course('ielts', '雅思 IELTS', 1130, 1180, '5节一对一 + 2节小组课（4:1）',
    '准备雅思考试的学生', '一对一：雅思阅读、口语、写作Task 1和Task 2，另有1节可选教材；小组课：听力。', 7),
  course('business', '商务英语 Business English', 1200, 1250, '5节一对一 + 2节小组课（4:1）',
    '工作中要用英语沟通的学生', '一对一：口语、阅读与发音、商务讨论、商务词汇、写作；小组课：听力、公开演讲。', 8),
  course('ebe', '高管商务英语 EBE', 0, 1250, '每天6节一对一',
    '需要高强度商务英语的职场人士', 'English for Business Executives，2027年新课程，2027/02/01起报名才可选。', 9),
  course(CBOA_JUNIOR_COURSE_ID, '青少年家庭课程 Family Course（Juniors）', 1500, 1550, '5节一对一 + 2节小组课（4:1）',
    '7–15岁的孩子', '一对一：互动口语、阅读与发音、语法、句型与表达、词汇；小组课：听力、讨论和选修课。暑期旺季不按此价格。', 10),
  course(CBOA_PARENT_COURSE_ID, '家长家庭课程 Family Course（Parents）', 750, 800, '每天3节一对一',
    '陪孩子来、自己也想学一点的家长', '一对一：口语、阅读与发音、句型与表达；可另加小组课。暑期旺季不按此价格。', 11),
];

const EGI = 'EGI 校内宿舍';
const SUITES = 'Ocean Suites 校外单人公寓';
const createRooms = (): CiaRoomContent[] => [
  room('egi-twin-ocean', '海景双人间', 'EGI-TO', EGI, '校内', 1120, 1170, '两人一间，窗外是海。', 0),
  room('egi-twin-city', '城景双人间', 'EGI-TC', EGI, '校内', 900, 950, '两人一间，窗外是城区。', 1),
  room('egi-triple-ocean', '三人间', 'EGI-3', EGI, '校内', 850, 850, '三人一间，费用最低。', 2),
  room('ocean-suite-ocean', '海景单人间', 'OS-OV', SUITES, '校外', 1600, 1700, '一人一间，正对海景；共10间。', 3),
  room('ocean-suite-deluxe', '豪华单人间', 'OS-DX', SUITES, '校外', 1400, 1500, '一人一间，大床；共15间。', 4),
  room('ocean-suite-superior', '高级单人间', 'OS-SP', SUITES, '校外', 1250, 1350, '一人一间，双人床；共29间。', 5),
  room(CBOA_COUPLE_ROOM_ID, '情侣房（每人）', 'OS-CP', SUITES, '校外', 0, 950, '每人价格；须两人一起报名、同住一间；2027/02/01起报名才可选。', 6),
];

const VISA_NOTE = '30天签证从第5周起续签：第5–8周累计5,140、第9–12周11,550、第13–16周15,990、第17–20周20,430、第21–24周24,870比索；59天签证从第9周起续签。';

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学时办理。', sortOrder: 0 }),
  fee({ id: 'ssp-i-card', name: 'SSP I-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP一起办理。', sortOrder: 1 }),
  fee({ id: 'acr-i-card', name: 'ACR I-CARD 外国人身份证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次续签时办理一次：30天签证约第5周起，59天签证约第9周起。', sortOrder: 2 }),
  fee({ id: 'visa-extension', name: '签证续签', amount: 5140, rates: [5140, 6410, 4440, 4440, 4440], tourist59Rates: [6410, 4440, 4440, 4440], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: VISA_NOTE, sortOrder: 3 }),
  fee({ id: 'maintenance', name: '管理费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每周500比索，按停留周数计算。', futureEffectiveStart: CBOA_PRICE_SWITCH, futureAmount: 700, futureNote: '每周700比索，按停留周数计算。', sortOrder: 4 }),
  fee({ id: 'suites-utilities', name: 'Ocean Suites 电费水费', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '住Ocean Suites每周1,000比索，按整个学习期提前缴纳。', sortOrder: 5 }),
  fee({ id: 'books-general', name: '教材费', amount: 1500, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '一般课程每4周1,100–1,500比索，按上限预估；按实际购买结算。', futureEffectiveStart: CBOA_PRICE_SWITCH, futureNote: '一般课程每4周约1,500比索（5本以内）；按实际购买结算。', sortOrder: 6 }),
  fee({ id: 'books-toeic', name: '托业教材费', amount: 1500, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周约1,500比索预估；按实际购买结算。', futureEffectiveStart: CBOA_PRICE_SWITCH, futureAmount: 2000, futureNote: '每4周约2,000比索预估；按实际购买结算。', sortOrder: 7 }),
  fee({ id: 'books-business', name: '商务英语教材费', amount: 1500, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周约1,500比索预估；按实际购买结算。', futureEffectiveStart: CBOA_PRICE_SWITCH, futureAmount: 2500, futureNote: '每4周约2,500比索预估；按实际购买结算。', sortOrder: 8 }),
  fee({ id: 'books-ielts', name: '雅思教材费', amount: 2500, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周约2,500比索预估；按实际购买结算。', futureEffectiveStart: CBOA_PRICE_SWITCH, futureAmount: 3000, futureNote: '每4周约3,000比索预估；按实际购买结算。', sortOrder: 9 }),
  fee({ id: 'student-id', name: '学生证', amount: 300, billingRule: 'once', includeInTotal: true, note: '一次性费用；补办170比索。', sortOrder: 10 }),
  fee({ id: 'deposit', name: '押金', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: false, note: '每周1,000比索，按住宿周数收取；EGI宿舍的电费水费每月从押金扣除，无损坏、无欠费时退还余额。', sortOrder: 11 }),
  fee({ id: 'egi-utilities', name: 'EGI宿舍电费水费', amount: 0, billingRule: 'optional', includeInTotal: false, note: '按宿舍电表计算，每月从押金扣除。', sortOrder: 12 }),
  fee({ id: 'pickup', name: '宿务机场接机', amount: 1200, secondaryAmount: 1500, secondaryLabel: '单独接机', billingRule: 'optional', includeInTotal: false, note: '一般接机1,200比索、单独接机1,500比索；周六10:00至周日凌晨2:00之间接机。', sortOrder: 13 }),
  fee({ id: 'sending', name: '送机', amount: 1000, billingRule: 'optional', includeInTotal: false, note: '离校时需要送机再付。', sortOrder: 14 }),
  fee({ id: 'laundry', name: '洗衣烘干', amount: 200, billingRule: 'optional', includeInTotal: false, note: '每次200比索，最多7公斤。', sortOrder: 15 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({ id: 'registration-waiver', name: '思达启航免注册费', description: '通过思达启航报名免收100美元注册费。', sortOrder: 0, waiveRegistration: true, discountType: 'none', appliesTo: 'school-total', ruleKind: 'blue-registration-waiver' }),
  promotion({ id: 'sida-95', name: '思达启航95折', description: '课程费和住宿费享95折。', sortOrder: 1, discountType: 'percentage', discountValue: 5, ruleKind: 'blue-sida-95' }),
  promotion({ id: 'off-season', name: '常规淡季优惠', description: '2027/01/31前报名：每满4个非暑期旺季课程周减150美元。', sortOrder: 2, discountValue: 150, incrementWeeks: 4, registrationEnd: '2027-01-31', ruleKind: 'blue-off-season' }),
  promotion({ id: 'twelve-week', name: '12周额外优惠', description: '2027/01/31前报名：课程满12周再减100美元。', sortOrder: 3, discountValue: 100, minimumCourseWeeks: 12, registrationEnd: '2027-01-31', ruleKind: 'blue-twelve-week' }),
  promotion({ id: 'long-stay', name: '长期优惠', description: '2027/01/31前报名：课程满16周减100美元，之后每多2周再减25美元。', sortOrder: 4, discountValue: 100, minimumCourseWeeks: 16, incrementWeeks: 2, incrementValue: 25, registrationEnd: '2027-01-31', ruleKind: 'blue-long-stay' }),
  promotion({ id: 'regular-2027', name: '2027常规优惠', description: '2027/02/01–06/30报名、2027/02/01起入学：每个学习周减25美元，暑期旺季周除外。', sortOrder: 5, discountType: 'per-course-week', discountValue: 25, coverageTarget: 'course', registrationStart: CBOA_PRICE_SWITCH, registrationEnd: CBOA_2027_PROMOTION_REGISTRATION_END, arrivalStart: CBOA_PRICE_SWITCH, ruleKind: 'blue-regular-2027' }),
  promotion({ id: 'long-term-2027', name: '2027长期优惠', description: '2027/02/01–06/30报名、2027/02/01起入学：课程满12周减100美元，之后每多1周再减25美元，旺季也可用。', sortOrder: 6, discountValue: 100, minimumCourseWeeks: 12, incrementWeeks: 1, incrementValue: 25, registrationStart: CBOA_PRICE_SWITCH, registrationEnd: CBOA_2027_PROMOTION_REGISTRATION_END, arrivalStart: CBOA_PRICE_SWITCH, ruleKind: 'blue-long-term-2027' }),
];

/**
 * The school's own 2027 summer peak (its 2027 promotion sheet: until 21 Aug, 8 peak weeks, 60 dollars a week).
 * The 2026 peak has passed, so only the 60-dollar 2027 range is listed (user decision 2026-11-24).
 */
const createPeakRanges = (): CiaQuoteSettings['peakSeasonRanges'] => [
  { id: '2027', label: '2027暑期旺季', start: '2027-06-27', end: '2027-08-21', enabled: true },
];

const LOCAL_FEE_INTRO = '以下费用由学校和菲律宾相关部门收取，到校后用比索缴纳，仅供准备现金参考。2027/02/01前入学按2026年标准，之后按2027年标准；签证费用按每位学生选择的签证类型和停留时间预估。';

const createStayPolicies = () => [
  { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
  { label: '离校日期', value: '课程结束后的周六', note: '提前入住或延住按晚另付，见下方额外住宿费用。' },
  { label: 'Ocean Suites', value: '校外单人公寓', note: '每天免费早餐，周一至周五有免费校车往返校区。' },
];

const createExtraNightRates = () => [
  { label: '三人间', amount: 1500 },
  { label: '双人间', amount: 2500 },
  { label: '单人间', amount: 3000 },
];

/** The company's own line on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

/** One editable image note per promotion, empty by default (the employee quote-image editor fills them). */
const promotionNoteFields = (promotions: CiaPromotionRule[]): Record<string, string> =>
  Object.fromEntries(promotions.map(rule => [rule.id, '']));

export const createDefaultBlueOceanContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'BLUE-OCEAN',
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: CBOA_PRICE_SWITCH,
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: 60,
    peakSeasonRanges: createPeakRanges(),
    peakSeasonPolicyVersion: 20271109,
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: '蓝海CBOA 4周课程费',
    courseTableNote: '2027/02/01前报名按2026年价格，之后按2027年价格；课程费按4周计算，1–3周按4周价格的40%／65%／85%计算。',
    groupClassNote: '小组课为4:1（最多4名学生）。',
    roomTableTitle: '蓝海CBOA 4周住宿费',
    roomTableNote: 'EGI宿舍在校内；Ocean Suites是校外单人公寓，含每天早餐，平日有免费校车。住宿费按每人计算，空房须先确认。',
    stayPolicyTitle: '蓝海CBOA 入住提醒',
    stayPolicies: createStayPolicies(),
    extraNightRates: createExtraNightRates(),
    cboaPolicyVersion: CBOA_POLICY_VERSION,
  } as CboaQuoteSettings,
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '', promotion: '' },
    promotionNotes: promotionNoteFields(createPromotions()),
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: LOCAL_FEE_INTRO,
    localFeeNotes: {},
    supplementalFeeNotes: {},
    serviceSectionTitle: '为什么选择思达启航？',
    benefits: [
      { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
      { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
      { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
      { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
    ],
    serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
    alumniBenefitTitle: '老学员专属优惠',
    alumniBenefitText: ALUMNI_BENEFIT_TEXT,
    noteSectionTitle: '报价说明',
    footerNotes: ['到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

/**
 * Version 1: the November 2026 school pack replaces the whole catalogue (2027 prices, EBE, the Couple Room), the
 * local fees, the offers and the peak dates; table texts and image lines that were still the old defaults follow.
 * Media and every other edited image line stay.
 */
function upgradeToVersion1(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  clone.courses = copyJson(defaults.courses);
  clone.rooms = copyJson(defaults.rooms);
  clone.localFees = copyJson(defaults.localFees);
  const saved = clone.quoteSettings;
  clone.quoteSettings = { ...copyJson(defaults.quoteSettings) } as CboaQuoteSettings;
  // Keep the registration fee only if someone set a different one on purpose.
  if (typeof saved?.registrationFee === 'number' && saved.registrationFee !== 100) clone.quoteSettings.registrationFee = saved.registrationFee;
  const image = clone.quoteImageSettings;
  if (image) {
    image.localFeeIntro = defaults.quoteImageSettings.localFeeIntro;
    image.footerNotes = copyJson(defaults.quoteImageSettings.footerNotes);
    image.promotionNotes = copyJson(defaults.quoteImageSettings.promotionNotes);
    image.supplementalFeeNotes = {};
    image.paymentNotes = copyJson(defaults.quoteImageSettings.paymentNotes);
    image.alumniBenefitText = ALUMNI_BENEFIT_TEXT;
  }
}

/** A Blue Ocean content document (default or published revision). */
export function isBlueOceanContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === 'BLUE-OCEAN'
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions) && !!content.quoteImageSettings;
}

export const cloneBlueOceanContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultBlueOceanContentConfig();
  if (!isBlueOceanContentConfig(value)) return defaults;
  const clone = copyJson(value);
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  if (((clone.quoteSettings as CboaQuoteSettings).cboaPolicyVersion ?? 0) < 1) upgradeToVersion1(clone, defaults);
  const settings = clone.quoteSettings as CboaQuoteSettings;
  settings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  settings.peakSeasonRanges ??= copyJson(defaults.quoteSettings.peakSeasonRanges);
  settings.stayPolicies ??= createStayPolicies();
  settings.extraNightRates ??= createExtraNightRates();
  settings.cboaPolicyVersion = CBOA_POLICY_VERSION;
  const image = clone.quoteImageSettings;
  image.paymentNotes = { ...defaults.quoteImageSettings.paymentNotes, ...(image.paymentNotes ?? {}) };
  image.promotionNotes = { ...promotionNoteFields(settings.promotions), ...(image.promotionNotes ?? {}) };
  image.localFeeNotes ??= {};
  image.supplementalFeeNotes ??= {};
  image.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  image.footerNotes = (image.footerNotes ?? copyJson(defaults.quoteImageSettings.footerNotes)).map(note => note.replace(/思达游学/g, '思达启航'));
  clone.media ??= [];
  return clone;
};
