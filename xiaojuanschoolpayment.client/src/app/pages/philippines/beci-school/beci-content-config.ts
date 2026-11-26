// BECI (Baguio): the versioned employee content document shared by the three campus pages (EOP, City, Sparta).
// Courses and rooms carry their campus; each page shows and quotes only its own campus (beciCampusContent). The
// pages, their calculator (beci-page-quote.ts), the local-fee table and the quote image all read the published
// version of this document. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can bundle it.
// Sources: the school's 2027 info update (2026-11-25), the 2026 price list (2026-03-13 update), the 2027 early-bird
// notice, the 2026 off-season notice, the 2026 orientation guides of the three campuses and the 2027 BESA calendar;
// see docs/beci-2027-update-2026-11-26.md.
import { ASSOCIATION_PEAK_POLICY_VERSION } from '../association-peak-surcharge';
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

export type BeciCampus = 'eop' | 'sparta' | 'city';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Raised when saved documents must take a school notice once (cloneBeciContentConfig):
 * 1 = the 2027 info update (2026-11-25): 2027 courses, rooms and prices, the 2026 prices kept for registrations
 *     until 2026-12-31, the 2027 off-season, long-stay and early-bird offers and the 2027 local fees.
 */
export const BECI_POLICY_VERSION = 1;
type BeciQuoteSettings = CiaQuoteSettings & { beciPolicyVersion?: number };

/** Registrations from this date pay the 2027 price list; earlier ones keep the 2026 list (the school's transition rule). */
export const BECI_2027_PRICE_REGISTRATION_START = '2027-01-01';

/**
 * BECI-only course fields: `price2026` is the 2026 list price where the 2027 list raised it (used for registrations
 * before BECI_2027_PRICE_REGISTRATION_START); `textbookPer4w` is the textbook fee in pesos per started 4 course weeks.
 */
export type BeciCourseContent = CiaCourseContent & { price2026?: number; textbookPer4w?: number };
/**
 * BECI-only room fields: `price2026` as for courses; `pairRoom` marks a per-person price that two students (a couple
 * or friends) get only when they book the same room for the same weeks.
 */
export type BeciRoomContent = CiaRoomContent & { price2026?: number; pairRoom?: boolean };

export const BECI_PROMOTION_IDS = {
  registration: 'beci-registration-waiver',
  offSeason2026First: 'beci-off-season-1',
  offSeason2026Second: 'beci-off-season-2',
  offSeason2027First: 'beci-off-season-2027-1',
  offSeason2027Second: 'beci-off-season-2027-2',
  longStay: 'beci-long-stay',
  earlyBird: 'beci-early-bird-2027',
} as const;
export const BECI_OFF_SEASON_RULE_KIND = 'beci-off-season';
export const BECI_LONG_STAY_RULE_KIND = 'beci-long-stay';
export const BECI_EARLY_BIRD_RULE_KIND = 'beci-peak-early-bird';

/** BESA summer peak: 40 dollars a week in 2026, 60 in 2027 (the rate comes from association-peak-surcharge.ts). */
export const BECI_PEAK_2026_RANGE = { label: '2026暑期旺季', start: '2026-06-28', end: '2026-08-22' } as const;
export const BECI_PEAK_2027_RANGE = { label: '2027暑期旺季', start: '2027-06-27', end: '2027-08-21' } as const;

/** Visa extension totals (pesos) by months of study (index 0 = up to 4 weeks), after a 30-day or a 59-day entry. */
export const BECI_VISA_TOTALS_30 = [0, 4940, 11150, 15390, 19630, 23870] as const;
export const BECI_VISA_TOTALS_59 = [0, 0, 6210, 10450, 14690, 18930] as const;
/** The longest stay the 2027 fee table covers (one SSP covers 1–24 weeks). */
export const BECI_MAX_WEEKS = 24;

const course = (
  campus: BeciCampus, id: string, name: string, courseType: string, tuition: number, schedule: string, suitable: string, note: string,
  sortOrder: number, extra: Partial<BeciCourseContent> = {},
): BeciCourseContent => ({
  id, name, courseType, tuition, tuition2027: tuition, schedule, suitable, note, campus, enabled: true, sortOrder, textbookPer4w: 2000, ...extra,
});

const JUNIOR_NOTE = '如有相同程度的学生，其中1节一对一课程会改为2节团体课程。';
const JUNIOR_AGE = '14岁及以下的学生须由监护人陪同入学。';

const createCourses = (): BeciCourseContent[] => [
  // EOP campus (2027 price list).
  course('eop', 'eop-lite-esl', 'Lite ESL 轻松课程', 'EOP课程', 670, '每天2节一对一 + 2节团体课 + 2节夜间选修课', '想兼顾学习、放松或工作的学生', '学习之余留有较多自己的时间。', 0, { textbookPer4w: 1000 }),
  course('eop', 'eop-speed-esl', 'Speed ESL 综合课程', 'EOP课程', 870, '每天4节一对一 + 2节团体课 + 2节夜间选修课', '想均衡提升听说读写的学生', '一对一为主的综合ESL课程。', 1, { textbookPer4w: 1500 }),
  course('eop', 'eop-sparta-esl', 'Sparta ESL 斯巴达课程', 'EOP课程', 900, '每天4节一对一 + 1节SP口语诊断课 + 2节团体课 + 2节夜间必修课', '想在规律、自律的环境里集中学习的学生', '夜间课为必修；SP口语诊断课为必修，不可取消或替换。', 2),
  course('eop', 'eop-toeic', 'TOEIC 托业课程', 'EOP课程', 850, '每天4节一对一 + 3节团体课 + 2小时模拟考', '准备托业考试的学生', '以托业考试能力提升为主要方向。', 3),
  course('eop', 'eop-ielts', 'IELTS 雅思课程', 'EOP课程', 900, '每天4节一对一 + 3节团体课 + 2小时模拟考', '准备雅思考试的学生', '以雅思考试能力提升为主要方向。', 4),
  course('eop', 'eop-junior-esl', 'Junior ESL 青少年英语', 'EOP课程', 1300, '每天5节一对一 + 1节SP口语诊断课 + 2节必修课', '青少年学生', `${JUNIOR_NOTE}${JUNIOR_AGE}`, 5),
  course('eop', 'eop-junior-ielts', 'Junior IELTS 青少年雅思', 'EOP课程', 1400, '每天5节一对一 + 3节必修课及考试', '准备雅思的青少年学生', `${JUNIOR_NOTE}${JUNIOR_AGE}`, 6),
  // City campus (2027 price list; Native and Unlimited ESL rose for registrations from 2027-01-01).
  course('city', 'city-lite-esl', 'Lite ESL 轻松课程', 'City课程', 670, '每天2节一对一 + 2节团体课 + 2节选修课', '想兼顾学习、放松或工作的学生', '学习之余留有较多自己的时间。', 100, { textbookPer4w: 1000 }),
  course('city', 'city-native-esl', 'Native ESL 外教课程', 'City课程', 950, '每天4节一对一 + 2节团体课 + 2节选修课', '想上外教课的学生', '包含外教课程的英语学习组合。', 101, { price2026: 900 }),
  course('city', 'city-unlimited-esl', 'Unlimited ESL 自选一对一', 'City课程', 1000, '每天最多8节一对一 + 2节选修课', '有明确学习需求、想自己组合一对一科目的学生', '一对一可选 ESL、IELTS、TOEIC、Business 等方向。', 102, { price2026: 900 }),
  course('city', 'city-junior-esl', 'Junior ESL 青少年英语', 'City课程', 1300, '每天5节一对一 + 1节SP口语诊断课 + 2节选修课', '青少年学生', `${JUNIOR_AGE}每日课时按2026年价目表；2027年资料未列，以学校确认为准。`, 103),
  // Sparta campus (2027 price list).
  course('sparta', 'sparta-24-esl', '24 ESL 斯巴达课程', '斯巴达课程', 900, '每天4节一对一 + 1节SP口语诊断课 + 2节团体课 + 3节必修课及考试', '想在高强度、统一日程里集中学习的学生', 'SP口语诊断课为必修，不可取消或替换。', 200),
  course('sparta', 'sparta-toeic', 'TOEIC 托业课程', '斯巴达课程', 850, '每天4节一对一 + 3节团体课 + 2小时模拟考', '准备托业考试的学生', '以托业考试能力提升为主要方向。', 201),
  course('sparta', 'sparta-ielts', 'IELTS 雅思课程', '斯巴达课程', 900, '每天4节一对一 + 3节团体课 + 2小时模拟考', '准备雅思考试的学生', '以雅思考试能力提升为主要方向。', 202),
  course('sparta', 'sparta-ielts-guarantee', 'IELTS Guarantee 雅思保分班', '斯巴达课程', 1100, '每天课时待学校确认（2026年价目表为4节一对一 + 2节团体课 + 3节必修课及考试）', '需要雅思成绩、能按学校要求完成全部课程和考试的学生',
    '最低报名12周，不适用1–3周短期价格；保分条件以学校书面规定为准。', 203, { minimumWeeks: 12 }),
];

const room = (
  campus: BeciCampus, id: string, name: string, group: string, location: '校内' | '校外', fee: number, note: string, sortOrder: number,
  extra: Partial<BeciRoomContent> = {},
): BeciRoomContent => ({
  id, name, label: name, code: campus.toUpperCase(), location, group, fee, note, campus, enabled: true, sortOrder,
  single: name.includes('单人'), ...extra,
});

const PAIR = '两名学生（情侣或朋友）同住同一间、日期相同时的每人价格；请用多人报价，由两人选同一房型和日期。';

const createRooms = (): BeciRoomContent[] => [
  // EOP campus rooms.
  room('eop', 'eop-regular-single', 'Regular Single 单人间（限女生）', 'EOP 校内宿舍', '校内', 950, '校内单人间，仅限女生。', 0),
  room('eop', 'eop-twin', 'Twin 双人间（限男生）', 'EOP 校内宿舍', '校内', 750, '校内双人间，仅限男生。', 1),
  room('eop', 'eop-triple', 'Triple 三人间', 'EOP 校内宿舍', '校内', 670, '校内三人间，男生、女生分房安排。', 2),
  room('eop', 'eop-quad-female', 'Quad 四人间（限女生）', 'EOP 校内宿舍', '校内', 570, '校内四人间，仅限女生。', 3),
  room('eop', 'eop-master-single', 'Mansion Master Single 豪华单人间', 'Mansion 校外宿舍', '校外', 1150, 'Mansion宿舍（距校区步行约40秒），男生、女生均可。', 4, { price2026: 1100 }),
  room('eop', 'eop-mansion-regular-single', 'Mansion Regular Single 单人间（限男生）', 'Mansion 校外宿舍', '校外', 950, 'Mansion宿舍单人间，仅限男生。', 5),
  room('eop', 'eop-mansion-twin', 'Mansion Twin 双人间（限女生）', 'Mansion 校外宿舍', '校外', 750, 'Mansion宿舍双人间，仅限女生。', 6),
  room('eop', 'eop-mansion-triple', 'Mansion Triple 三人间（限女生）', 'Mansion 校外宿舍', '校外', 670, 'Mansion宿舍三人间，仅限女生。', 7),
  room('eop', 'eop-mansion-quad', 'Mansion Quad 四人间（限女生）', 'Mansion 校外宿舍', '校外', 570, 'Mansion宿舍四人间，仅限女生。', 8),
  // City campus rooms.
  room('city', 'city-studio-single', 'Studio Single 单人房', 'City Studio 房型', '校内', 1250, 'Studio单人房，一人入住。', 100),
  room('city', 'city-studio-single-pair', 'Studio Single 两人合住（情侣或朋友）', 'City Studio 房型', '校内', 800, PAIR, 101, { pairRoom: true, single: false }),
  room('city', 'city-studio-twin', 'Studio Double 双人房', 'City Studio 房型', '校内', 800, 'Studio双人房，室友由学校安排。', 102),
  room('city', 'city-studio-twin-pair', 'Studio Double 两人同住（情侣或朋友）', 'City Studio 房型', '校内', 750, PAIR, 103, { pairRoom: true }),
  room('city', 'city-studio-quad', 'Studio Quad 四人房', 'City Studio 房型', '校内', 600, 'Studio四人房，室友由学校安排。', 104),
  room('city', 'city-semi-master-single', 'Semi Master Single 单人房', 'City Semi 公寓', '校内', 1100, 'Semi公寓里的Master单人房，公寓有客厅。', 105, { price2026: 1050 }),
  room('city', 'city-semi-single', 'Semi Regular Single 单人房', 'City Semi 公寓', '校内', 950, 'Semi公寓里的单人房，公寓有客厅。', 106, { price2026: 900 }),
  // Sparta campus rooms.
  room('sparta', 'sparta-3-plus-1', '3+1 Room（3名学生 + 1名菲律宾老师）', 'Sparta 宿舍', '校内', 800, '3名不同国家和地区的学生与1名菲律宾老师同住。', 200),
  room('sparta', 'sparta-quad', 'Quad 四人间', 'Sparta 宿舍', '校内', 700, '无老师同住；同一房间一般最多2名同一国家或地区的学生。', 201),
];

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({ ...value, currency: 'PHP', enabled: true });

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特殊学习许可', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学时办理，适用1–24周。', sortOrder: 0 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-Card', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP一起办理，只收一次。', sortOrder: 1 }),
  fee({
    id: 'visa-extension', name: '签证延期', amount: 4940, rates: [...BECI_VISA_TOTALS_30], tourist59Rates: [...BECI_VISA_TOTALS_59],
    billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true,
    note: '按入境签证（30天／59天）和停留月数合计：30天签证2个月4,940、3个月11,150、4个月15,390、5个月19,630、6个月23,870比索；59天签证2个月0、3个月6,210、4个月10,450、5个月14,690、6个月18,930比索。', sortOrder: 2,
  }),
  fee({ id: 'acr-i-card', name: 'ACR I-Card 外国人居留证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '停留超过59天的学生办理。', sortOrder: 3 }),
  fee({ id: 'student-id', name: '学生证', amount: 200, billingRule: 'once', includeInTotal: true, note: '一次性费用，含拍照。', sortOrder: 4 }),
  fee({ id: 'books', name: '教材费', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周：Lite ESL 1,000比索，Speed ESL 1,500比索，其他课程2,000比索；不足4周按4周。', sortOrder: 5 }),
  fee({ id: 'utilities', name: '水电费', amount: 3000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '按住宿周数计算，每4周3,000比索（每周750）。', sortOrder: 6 }),
  fee({ id: 'maintenance', name: '维护费', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '校内教学楼及其他设施维护，每4周1,000比索（每周250）。', sortOrder: 7 }),
  fee({ id: 'laundry', name: '洗衣费', amount: 1500, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周1,500比索，不足4周按4周；周一至周四可送洗（含洗涤、烘干和折叠）。', sortOrder: 8 }),
  fee({ id: 'besa-pickup', name: 'BESA周日团体接机', amount: 3000, billingRule: 'selected-manila-pickup', includeInTotal: true, note: '马尼拉或克拉克机场，指定周日统一接机；选择接机时计入。', sortOrder: 9 }),
  fee({ id: 'sparta-upgrade', name: '小组课升级一对一（Sparta）', amount: 500, billingRule: 'optional', includeInTotal: true, note: '把其中1节小组课升级为一对一：每周500比索，按月4周2,000比索；选择时计入。', sortOrder: 10 }),
  fee({ id: 'deposit', name: '押金（可退）', amount: 3000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '无违规、无设施损坏时离校前全额退还。', sortOrder: 11 }),
];

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: (value.sortOrder + 1) * 10,
  stackable: true,
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

const EOP_CITY_COURSE_IDS = createCourses().filter(item => item.campus !== 'sparta').map(item => item.id);

const createPromotions = (): CiaPromotionRule[] => [
  promotion({ id: BECI_PROMOTION_IDS.registration, name: '思达启航免注册费', description: '通过思达启航报名，每位学生免100美元注册费。', sortOrder: 0, appliesTo: 'school-total', waiveRegistration: true }),
  promotion({
    id: BECI_PROMOTION_IDS.offSeason2026First, name: '淡季优惠九折', description: '2026/02/08–06/14入学，学费和住宿费9折。', sortOrder: 1,
    ruleKind: BECI_OFF_SEASON_RULE_KIND, discountType: 'percentage', discountValue: 10, arrivalStart: '2026-02-08', arrivalEnd: '2026-06-14',
  }),
  promotion({
    id: BECI_PROMOTION_IDS.offSeason2026Second, name: '淡季优惠九折', description: '2026/09/06–12/27入学，学费和住宿费9折。', sortOrder: 2,
    ruleKind: BECI_OFF_SEASON_RULE_KIND, discountType: 'percentage', discountValue: 10, arrivalStart: '2026-09-06', arrivalEnd: '2026-12-27',
  }),
  promotion({
    id: BECI_PROMOTION_IDS.offSeason2027First, name: '淡季优惠九折', description: 'EOP、City校区2027/02/07–06/13入学，学费和住宿费9折（Sparta不适用）。', sortOrder: 3,
    ruleKind: BECI_OFF_SEASON_RULE_KIND, discountType: 'percentage', discountValue: 10, arrivalStart: '2027-02-07', arrivalEnd: '2027-06-13', eligibleCourseIds: EOP_CITY_COURSE_IDS,
  }),
  promotion({
    id: BECI_PROMOTION_IDS.offSeason2027Second, name: '淡季优惠九折', description: 'EOP、City校区2027/09/05–12/26入学，学费和住宿费9折（Sparta不适用）。', sortOrder: 4,
    ruleKind: BECI_OFF_SEASON_RULE_KIND, discountType: 'percentage', discountValue: 10, arrivalStart: '2027-09-05', arrivalEnd: '2027-12-26', eligibleCourseIds: EOP_CITY_COURSE_IDS,
  }),
  promotion({
    id: BECI_PROMOTION_IDS.longStay, name: '长期学习优惠', description: '课程8周减50、12周100、16周200、20周300、24周400美元；可与淡季优惠同时使用。', sortOrder: 5,
    ruleKind: BECI_LONG_STAY_RULE_KIND, discountType: 'fixed', discountValue: 50, discountTiers: { 8: 50, 12: 100, 16: 200, 20: 300, 24: 400 }, appliesTo: 'school-total', minimumCourseWeeks: 8,
  }),
  promotion({
    id: BECI_PROMOTION_IDS.earlyBird, name: '早鸟免旺季附加费', description: '2026/11/30及之前确认报名，2027暑期旺季（06/27–08/21）附加费全免。', sortOrder: 6,
    ruleKind: BECI_EARLY_BIRD_RULE_KIND, appliesTo: 'school-total', registrationEnd: '2026-11-30',
  }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索现金缴纳，按每位学生的签证、课程和住宿预估；押金另列，不计入合计。';
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultBeciContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'BECI',
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: BECI_2027_PRICE_REGISTRATION_START,
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.6, '3': 0.8 },
    peakSeasonFeePerWeek: 60,
    peakSeasonPolicyVersion: ASSOCIATION_PEAK_POLICY_VERSION,
    peakSeasonRanges: [
      { id: 'beci-summer-2026', ...BECI_PEAK_2026_RANGE, enabled: true },
      { id: 'beci-summer-2027', ...BECI_PEAK_2027_RANGE, enabled: true },
    ],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'BECI 2027年课程费 / 4周',
    courseTableNote: '每节课50分钟；1/2/3周按4周价的40%、60%、80%计算，4周以上按周数计算；雅思保分班最低12周，不适用短期价格。',
    groupClassNote: '团体课人数和分班以学校安排为准。',
    roomTableTitle: 'BECI 2027年住宿费 / 4周',
    roomTableNote: '住宿费按周日入住、周六退房的完整周计算，1/2/3周按4周价的40%、60%、80%计算；房间和室友由学校分配。',
    stayPolicyTitle: 'BECI 入住与退房',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算；BESA团体接机在指定周日。' },
      { label: '退房日期', value: '课程结束后的周六中午', note: '原则上不延住；学校同意时每晚1,000比索。' },
      { label: '三个校区', value: 'EOP / City / Sparta', note: '课程、住宿和管理规定各不相同，按校区分别报价。' },
    ],
    extraNightRates: [],
    beciPolicyVersion: BECI_POLICY_VERSION,
  } as BeciQuoteSettings,
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
    alumniBenefitText: ALUMNI_BENEFIT_TEXT,
    noteSectionTitle: '报价说明',
    footerNotes: ['到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

/** Promotion ids the 2027 update replaced; employee-added rules are kept. */
const REPLACED_PROMOTION = (rule: CiaPromotionRule): boolean => rule.id.startsWith('beci-');
/** Local-fee ids of the older document; the 2027 list replaces them. */
const OLD_LOCAL_FEE_IDS = new Set(['ssp', 'ssp-e-card', 'acr-i-card', 'maintenance', 'utilities', 'manila-pickup', 'clark-pickup', 'visa-extension', 'books', 'student-card', 'laundry', 'room-deposit']);

/**
 * Version 1: brings a document saved before the 2027 update onto it. Courses, rooms, local fees and the BECI offers
 * take the school's 2027 list (prices included: the 2027 list is authoritative over the older 2026 copy); rows an
 * employee added stay. Table texts and stay policies take the new defaults.
 */
function upgradeBeciPolicy(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as BeciQuoteSettings;
  if ((settings.beciPolicyVersion ?? 0) >= BECI_POLICY_VERSION) return;
  const keepExtra = <T extends { id: string; sortOrder: number }>(saved: T[] | undefined, fresh: T[]): T[] => [
    ...copyJson(fresh),
    ...(saved ?? []).filter(row => !fresh.some(item => item.id === row.id)).map((row, index) => ({ ...row, sortOrder: 1000 + index })),
  ];
  clone.courses = keepExtra(clone.courses, defaults.courses);
  clone.rooms = keepExtra(clone.rooms, defaults.rooms);
  clone.localFees = [
    ...copyJson(defaults.localFees),
    ...(clone.localFees ?? []).filter(rule => !OLD_LOCAL_FEE_IDS.has(rule.id) && !defaults.localFees.some(item => item.id === rule.id)),
  ];
  settings.promotions = [
    ...copyJson(defaults.quoteSettings.promotions),
    ...(settings.promotions ?? []).filter(rule => !REPLACED_PROMOTION(rule)),
  ];
  settings.peakSeasonRanges = copyJson(defaults.quoteSettings.peakSeasonRanges);
  settings.peakSeasonFeePerWeek = defaults.quoteSettings.peakSeasonFeePerWeek;
  settings.shortStayRatios = { ...defaults.quoteSettings.shortStayRatios };
  settings.futurePriceRegistrationStart = defaults.quoteSettings.futurePriceRegistrationStart;
  for (const key of ['localFeeIntro', 'courseTableTitle', 'courseTableNote', 'groupClassNote', 'roomTableTitle', 'roomTableNote', 'stayPolicyTitle'] as const) {
    settings[key] = defaults.quoteSettings[key];
  }
  settings.stayPolicies = copyJson(defaults.quoteSettings.stayPolicies);
  settings.beciPolicyVersion = BECI_POLICY_VERSION;
  // The older document's image lines named the 2026 offers; take the current company lines once.
  clone.quoteImageSettings = copyJson(defaults.quoteImageSettings);
}

export const cloneBeciContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultBeciContentConfig();
  const cloned = copyJson(value);
  cloned.courses ??= copyJson(defaults.courses);
  cloned.rooms ??= copyJson(defaults.rooms);
  cloned.localFees ??= copyJson(defaults.localFees);
  cloned.quoteSettings ??= copyJson(defaults.quoteSettings);
  cloned.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  cloned.quoteSettings.peakSeasonRanges ??= copyJson(defaults.quoteSettings.peakSeasonRanges);
  cloned.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  cloned.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  cloned.quoteSettings.extraNightRates ??= [];
  cloned.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  upgradeBeciPolicy(cloned, defaults);
  cloned.quoteSettings.peakSeasonPolicyVersion = Math.max(cloned.quoteSettings.peakSeasonPolicyVersion ?? 0, ASSOCIATION_PEAK_POLICY_VERSION);
  cloned.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  cloned.quoteImageSettings.localFeeNotes ??= {};
  cloned.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  cloned.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  cloned.media ??= [];
  return cloned;
};

/** One campus's part of the document: its courses and rooms, and only the local fees that apply there. */
export function beciCampusContent(value: CiaContentConfig, campus: BeciCampus): CiaContentConfig {
  const content = cloneBeciContentConfig(value);
  content.courses = content.courses.filter(item => (item.campus ?? 'eop') === campus);
  content.rooms = content.rooms.filter(item => (item.campus ?? 'eop') === campus);
  if (campus !== 'sparta') content.localFees = content.localFees.filter(rule => rule.id !== 'sparta-upgrade');
  return content;
}
