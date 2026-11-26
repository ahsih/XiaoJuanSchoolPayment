// Genius English Academy's content document: courses, rooms, local fees, offers and quote-image copy, from the
// school's September 2026–2027 price list, its 2026 family-program price list (updated 2026-10-30) and its two
// 2026 September–December offer posters. The public page (genius-school-page.component.ts), its calculator
// (genius-page-quote.ts), the local-fee table and the quote image all read it. Genius is not in the employee
// editor and has no lessons in the database, so these compiled defaults are the only price source.
// Keep it pure data (no Angular, DOM or storage).
import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const GENIUS_REGISTRATION_FEE = 125;

/** Courses: General English／Power Speaking A–D, Survival English A/B, Business／TOEIC／TOEFL／IELTS／ESP A/B. */
export const GENIUS_GE_A_ID = 'ge-a';
export const GENIUS_REGULAR_IDS: readonly string[] = ['ge-a', 'ge-b', 'ge-c', 'ge-d', 'survival-a', 'survival-b', 'exam-a', 'exam-b'];
/** Courses with 8 classes a day (6 one-to-one + 2 group), which use the B materials rate. */
export const GENIUS_B_IDS: readonly string[] = ['ge-b', 'survival-b', 'exam-b'];

/** Family program (2026 list): prices are per person and include tuition, accommodation and three meals. */
export const GENIUS_FAMILY_KID_ID = 'family-kid';
export const GENIUS_FAMILY_PARENT_ID = 'family-parent';
export const GENIUS_FAMILY_FREE_ID = 'family-parent-free';
export const GENIUS_FAMILY_IDS: readonly string[] = [GENIUS_FAMILY_KID_ID, GENIUS_FAMILY_PARENT_ID, GENIUS_FAMILY_FREE_ID];
/** One kid pays the course price; with two or more kids in the family each kid pays this 4-week price. */
export const GENIUS_FAMILY_KIDS_PRICE = { fourWeeks: 1900, short: { '1': 670, '2': 1145, '3': 1620 } } as const;
/** The family price list goes up to 12 weeks. */
export const GENIUS_FAMILY_MAX_WEEKS = 12;
/** The family room is part of the family price: a quote choice only, never on the room price list. */
export const GENIUS_FAMILY_ROOM = { id: 'family-room', name: '亲子家庭房（已含在亲子课程价格内）', note: '亲子课程价格已含住宿和三餐，房间按家庭人数安排。' };

export const GENIUS_ROOM_IDS = ['single', 'double', 'triple', 'quad'] as const;
export const GENIUS_QUAD_IDS: readonly string[] = ['quad', 'quad-sea'];
export const GENIUS_SEA_VIEW_FEE = 125;
export const isGeniusSeaView = (roomId: string): boolean => roomId.endsWith('-sea');

/**
 * Exact 1, 2 and 3-week prices of the price lists (dollars, whole stay); 4 weeks and longer are the 4-week price
 * ÷ 4 × weeks. Sea-view rooms add 125 dollars per 4 weeks, counted by the week for 1–3 weeks.
 */
export const GENIUS_SHORT_PRICES: Readonly<Record<string, Readonly<Record<string, number>>>> = {
  'ge-a': { '1': 352, '2': 633, '3': 896 },
  'ge-b': { '1': 440, '2': 792, '3': 1121 },
  'ge-c': { '1': 299, '2': 538, '3': 762 },
  'ge-d': { '1': 282, '2': 507, '3': 717 },
  'survival-a': { '1': 370, '2': 665, '3': 941 },
  'survival-b': { '1': 458, '2': 823, '3': 1165 },
  'exam-a': { '1': 458, '2': 823, '3': 1165 },
  'exam-b': { '1': 546, '2': 982, '3': 1389 },
  [GENIUS_FAMILY_KID_ID]: { '1': 740, '2': 1265, '3': 1790 },
  [GENIUS_FAMILY_PARENT_ID]: { '1': 494, '2': 844, '3': 1194 },
  [GENIUS_FAMILY_FREE_ID]: { '1': 317, '2': 542, '3': 767 },
  single: { '1': 335, '2': 542, '3': 766 },
  double: { '1': 265, '2': 421, '3': 596 },
  triple: { '1': 212, '2': 331, '3': 468 },
  quad: { '1': 177, '2': 271, '3': 383 },
};

/** Add-ons per 4 weeks (dollars), counted by the course week. */
export const GENIUS_ADD_ONS = {
  semiSparta: 100,
  sparta: 125,
  unaccompaniedMinor: 100,
  extraOneToOne: 125,
  extraGroup: 100,
} as const;

/** 9–12月特别优惠: regular courses, 200 dollars per complete four course weeks whose class Mondays fall in Sep–Dec 2026. */
export const GENIUS_FALL_OFFER = { id: 'genius-fall-2026', perFourWeeks: 200, from: '2026-09-01', to: '2026-12-31' } as const;
/**
 * 999美元推广价: General English or Power Speaking A with a four-person room (sea-view four-person room for 125 more),
 * exactly 4 weeks studied in September–December 2026, registered June–November 2026; registration and local fees
 * are extra and it cannot be combined with other offers.
 */
export const GENIUS_PROMO_999 = {
  id: 'genius-promo-999', price: 999, weeks: 4, registrationEnd: '2026-11-30', studyFrom: '2026-09-01', studyTo: '2026-12-31',
} as const;
export const GENIUS_RETURNING_RULE_ID = 'genius-returning';
/** 思达启航9折 (user 2026-11-25): course and room charges, before the school offers; stacks with every offer. */
export const GENIUS_SIDA_RULE_ID = 'genius-sida-90';
export const GENIUS_SIDA_RATE = 10;
export const GENIUS_SIDA_DESCRIPTION = '通过思达启航报名，课程费和住宿费打9折（亲子课程和海景房也打折）；先打折再减学校优惠，可以和9–12月特别优惠叠加；参加999美元推广价时按999美元打9折。注册费、管理费、加课费和学杂费不打折。';

/**
 * Visa costs of the price list (pesos, approximate). The extension amounts follow its cumulative table for a
 * 30-day entry (5–8 weeks 4,560, 9–12 weeks 10,900, 13–16 weeks 11,400, 17–20 weeks 15,260, 21–24 weeks 15,760);
 * a 59-day entry starts one step later.
 */
export const GENIUS_VISA_RATES = [4560, 6340, 500, 3860, 500];
export const GENIUS_VISA_RATES_59 = [6340, 500, 3860, 500];

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder,
  feeByWeeks: { ...GENIUS_SHORT_PRICES[id] }, ...extra,
});

const room = (id: string, name: string, group: string, fee: number, note: string, sortOrder: number): CiaRoomContent => ({
  id, name, label: name, code: '', location: '校内', group, fee, note, enabled: true, sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'enabled'>): CiaLocalFeeRule => ({ ...value, enabled: true });

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: (value.sortOrder + 1) * 10,
  stackable: false,
  newStudentsOnly: false,
  discountType: 'none',
  discountValue: 0,
  appliesTo: 'tuition-and-accommodation',
  waiveRegistration: false,
  minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'none',
  ...value,
});

const short = (id: string): string => {
  const prices = GENIUS_SHORT_PRICES[id];
  return `1周${prices['1'].toLocaleString('en-US')}、2周${prices['2'].toLocaleString('en-US')}、3周${prices['3'].toLocaleString('en-US')}美元`;
};

const A_SCHEDULE = '每天6节：一对一4节 + 小组课2节';
const B_SCHEDULE = '每天8节：一对一6节 + 小组课2节';

const createCourses = (): CiaCourseContent[] => [
  course('ge-a', '一般英语／强化口语 A', 1000, A_SCHEDULE, '想全面提升英语、或想练演讲和表达的学员', `报名时选一般英语或强化口语。短期：${short('ge-a')}。`, 0),
  course('ge-b', '一般英语／强化口语 B', 1250, B_SCHEDULE, '想多上一对一的学员', `报名时选一般英语或强化口语。短期：${short('ge-b')}。`, 1),
  course('ge-c', '一般英语／强化口语 C', 850, '每天4节：一对一4节', '只想上一对一、想留更多自由时间的学员', `报名时选一般英语或强化口语。短期：${short('ge-c')}。`, 2),
  course('ge-d', '一般英语／强化口语 D', 800, '每天4节：一对一2节 + 小组课2节', '想轻松学英语的学员', `报名时选一般英语或强化口语。短期：${short('ge-d')}。`, 3),
  course('survival-a', '生存英语 A', 1050, A_SCHEDULE, '英语基础较弱、想先学会日常交流的学员', `短期：${short('survival-a')}。`, 4),
  course('survival-b', '生存英语 B', 1300, B_SCHEDULE, '英语基础较弱、想多上一对一的学员', `短期：${short('survival-b')}。`, 5),
  course('exam-a', '商务英语／托业／托福／雅思／专项英语 A', 1300, A_SCHEDULE, '为工作或考试学英语的学员', `报名时选商务英语、托业、托福、雅思备考或专项英语（ESP）。短期：${short('exam-a')}。`, 6),
  course('exam-b', '商务英语／托业／托福／雅思／专项英语 B', 1550, B_SCHEDULE, '为工作或考试学英语、想多上一对一的学员', `报名时选商务英语、托业、托福、雅思备考或专项英语（ESP）。短期：${short('exam-b')}。`, 7),
  course(GENIUS_FAMILY_KID_ID, '亲子课程：孩子', 2100, '每天8节：一对一4节 + 小组课2节 + 特色课2节（音乐和美术）', '和家长一起来读的孩子', `价格含学费、住宿和三餐。一个孩子4周2,100美元；同一家庭2个及以上孩子，每个孩子4周1,900美元。短期：${short(GENIUS_FAMILY_KID_ID)}（2个及以上孩子每人670、1,145、1,620美元）。`, 8, { family: true }),
  course(GENIUS_FAMILY_PARENT_ID, '亲子课程：家长上课', 1400, '每天4节：一对一2节 + 小组课2节', '陪孩子来、自己也想学的家长', `价格含学费、住宿和三餐。短期：${short(GENIUS_FAMILY_PARENT_ID)}。`, 9, { family: true }),
  course(GENIUS_FAMILY_FREE_ID, '亲子课程：家长不上课', 900, '不上课，只住宿和用餐', '只陪孩子、不想上课的家长', `价格含住宿和三餐。短期：${short(GENIUS_FAMILY_FREE_ID)}。`, 10, { family: true }),
];

const createRooms = (): CiaRoomContent[] => [
  ...([
    ['single', '单人间', 950, '一人一间。'],
    ['double', '双人间', 750, '两人一间。'],
    ['triple', '三人间', 600, '三人一间。'],
    ['quad', '四人间', 500, '四人一间。'],
  ] as const).map(([id, name, price, text], index) => room(id, name, '普通房', price, `${text}房间有厨房、冰箱、空调、WiFi和阳台；含三餐。`, index)),
  ...([
    ['single-sea', '海景单人间', 950, '一人一间，能看到海。'],
    ['double-sea', '海景双人间', 750, '两人一间，能看到海。'],
    ['triple-sea', '海景三人间', 600, '三人一间，能看到海。'],
    ['quad-sea', '海景四人间', 500, '四人一间，能看到海。'],
  ] as const).map(([id, name, price, text], index) => room(id, name, '海景房', price + GENIUS_SEA_VIEW_FEE, `${text}比同类普通房每4周多125美元，视空房安排；含三餐。`, index + 4)),
];

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特别学习许可', currency: 'PHP', amount: 11800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '学校估算金额，以实际办理为准。', sortOrder: 0 }),
  fee({ id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 4560, rates: [...GENIUS_VISA_RATES], tourist59Rates: [...GENIUS_VISA_RATES_59], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '学校估算：30天签证停留5–8周4,560比索，9–12周累计10,900，13–16周11,400，17–20周15,260，21–24周15,760；59天签证从第9周起续签。以实际办理为准。', sortOrder: 1 }),
  fee({ id: 'acr-i-card', name: 'ACR I-Card 外国人登记证', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次签证续签时办理一次（30天签证第5周起，59天签证第9周起）；预估金额，以实际办理为准。', sortOrder: 2 }),
  fee({ id: 'materials', name: '教材', currency: 'USD', amount: 40, secondaryAmount: 60, secondaryLabel: 'B课程', billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每开始4周课程一次：每天8节的B课程和亲子课程的孩子60美元，其他课程40美元。', sortOrder: 3 }),
  fee({ id: 'maintenance', name: '维护费', currency: 'USD', amount: 10, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional', includeInTotal: true, note: '每周10美元，按住宿周数计。', sortOrder: 4 }),
  fee({ id: 'laundry', name: '洗衣费', currency: 'USD', amount: 6, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional', includeInTotal: true, note: '每周2次洗衣，每周6美元，按住宿周数计。', sortOrder: 5 }),
  fee({ id: 'water', name: '水费', currency: 'USD', amount: 6, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional', includeInTotal: true, note: '每周6美元，按住宿周数计。', sortOrder: 6 }),
  fee({ id: 'deposit', name: '押金', currency: 'USD', amount: 100, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人100美元；正式申请退房一周后退还，扣除损坏赔偿或未付款项。', sortOrder: 7 }),
  fee({ id: 'pickup', name: '机场接机', currency: 'USD', amount: 18, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人18美元。', sortOrder: 8 }),
  fee({ id: 'electricity', name: '电费', currency: 'PHP', amount: 18, billingRule: 'optional', includeInTotal: false, note: '按电表计，每度18比索，每周六支付。', sortOrder: 9 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: GENIUS_SIDA_RULE_ID, name: '思达启航折扣', sortOrder: 0, ruleKind: 'genius-sida',
    discountType: 'percentage', discountValue: GENIUS_SIDA_RATE, description: GENIUS_SIDA_DESCRIPTION,
  }),
  promotion({
    id: GENIUS_PROMO_999.id, name: '999美元推广价', sortOrder: 1, ruleKind: 'genius-promo-999',
    description: '一般英语或强化口语A课程＋四人间，4周999美元（可升级海景四人间，另加125美元）；2026年6–11月报名、9–12月就读；须每周在社交媒体点赞并分享学校帖子2次、每周在中国社交媒体发4条快拍，展示在学校的学习和生活；注册费和学杂费另付，不和学校其他优惠同享，可以再享思达启航9折。',
  }),
  promotion({
    id: GENIUS_FALL_OFFER.id, name: '9–12月特别优惠', sortOrder: 2, ruleKind: 'genius-fall-2026',
    discountType: 'fixed', discountValue: GENIUS_FALL_OFFER.perFourWeeks,
    description: '2026年9–12月就读正常课程，每满4周减200美元；亲子课程不适用，不和999美元推广价同享，可以和思达启航9折叠加。',
  }),
  promotion({
    id: GENIUS_RETURNING_RULE_ID, name: '老学员返校', sortOrder: 3, waiveRegistration: true, appliesTo: 'school-total',
    description: '老学员返校免收一次性注册费。',
  }),
];

const LOCAL_FEE_INTRO = '以下费用到校后在学校支付，仅供准备现金参考。签证费用为学校估算，按每位学生选择的签证和停留周数计算；教材、维护、洗衣和水费学校按美元收取，比索金额按参考汇率折算。押金、接机和电费另列在下方。';

export const createDefaultGeniusContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  // Genius is not in the schoolCode union, which lives in the locked CIA files (user decision 2026-11-20); add it
  // there when CIA is unlocked. Nothing reads the code for Genius: it has no employee content editor yet.
  schoolCode: 'GENIUS' as CiaContentConfig['schoolCode'],
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: GENIUS_REGISTRATION_FEE,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: {},
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'Genius 2026–2027年4周学费',
    courseTableNote: '每节课50分钟，周一至周五上课。1–3周按学校短期价格，4周及以上按4周价格折算。亲子课程价格已含住宿和三餐。',
    groupClassNote: '小组课由外教上（亲子课程的特色课为音乐和美术）。',
    roomTableTitle: 'Genius 4周住宿费',
    roomTableNote: '2026–2027年价格相同。宿舍在校园内，每间都有私人厨房、冰箱、空调、WiFi和阳台；住宿费含每天三餐、每周2次清洁和洗衣。',
    stayPolicyTitle: 'Genius 入住与换房',
    stayPolicies: [
      { label: '入住', value: '周日抵达', note: '周一分级测试和口语面试后开课。' },
      { label: '换房', value: '入住前4周原则上不换房', note: '须经经理和前台同意；换到不同房型按新房型价格计算，降级房型不退差价。' },
      { label: '退房', value: '钥匙交回前台', note: '钥匙遗失收2,000比索。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '', promotion: '' },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: LOCAL_FEE_INTRO,
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
    alumniBenefitText: '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。',
    noteSectionTitle: '报价说明',
    footerNotes: ['按学校2026–2027年价格计算。', '签证费用为学校估算；到校费用按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

export const cloneGeniusContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultGeniusContentConfig();
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= {};
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  clone.media ??= [];
  return clone;
};
