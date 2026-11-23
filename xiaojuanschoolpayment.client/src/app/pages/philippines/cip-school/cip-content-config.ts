// CIP English Kepos's content document: courses, rooms, local fees, offers and quote-image copy. The public page
// (cip-school-page.component.ts), its calculator (cip-page-quote.ts), the local-fee table and the quote image all
// read it. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can bundle it later.
// Sources: the school's Google Drive pack received 2026-11-24 (June 2026 USD price list for 2027 arrivals, June 2026
// dormitory local-fee sheet, 2026–2027 off-season poster, course summary and rules, 2025–2026 student handbook);
// see docs/cip-page-2026-11-24.md. Never publish the school's contacts, website or the Drive links.
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** CIP is not in CIA's schoolCode list (a locked file), so the code is cast here, as CIEC does. */
export const CIP_SCHOOL_CODE = 'CIP' as CiaContentConfig['schoolCode'];

/**
 * The school quotes students who start from 2027 in dollars (school message 2026-11-24); earlier arrivals use
 * its renminbi list, which this page does not quote. Sunday arrival of the first 2027 class week.
 */
export const CIP_USD_FROM = '2027-01-03';

export const CIP_RETURNING_RULE_ID = 'cip-returning-registration';
export const CIP_OFF_SEASON_RULE_ID = 'cip-off-season-2027';
export const CIP_LONG_STAY_RULE_ID = 'cip-long-stay';

/** Off-season offer: study days in June, July and August never count (2026–2027 poster). */
export const CIP_PEAK_MONTHS: readonly number[] = [6, 7, 8];
/** Last class day the 2026–2027 off-season poster covers. */
export const CIP_OFF_SEASON_END = '2027-12-31';
/** Long stays: the price list's 16/20/24-week totals are 50/100/150 dollars below four times the 4-week price. */
export const CIP_LONG_STAY_TIERS: ReadonlyArray<{ weeks: number; amount: number }> = [
  { weeks: 24, amount: 150 },
  { weeks: 20, amount: 100 },
  { weeks: 16, amount: 50 },
];

export const CIP_DORM_ROOM_IDS: readonly string[] = ['single-a', 'single-b', 'double', 'triple', 'quad'];
export const CIP_HOTEL_ROOM_IDS: readonly string[] = [
  'hotel-king-single', 'hotel-king-double', 'hotel-twin-double', 'hotel-twin-triple', 'hotel-suite-triple', 'hotel-suite-quad',
];

export type CipCourseLevel = 'light' | 'short' | 'semi-sparta' | 'sparta' | 'junior';

/**
 * Course rules the content document does not hold (the shared course schema keeps only names and prices):
 * the course type, which decides who may take it, and the lengths the price list offers.
 */
export interface CipCourseRule {
  level: CipCourseLevel;
  /** Most weeks the price list offers for the course. */
  maxWeeks?: number;
  /** Only these lengths (IELTS Basic 4 weeks, IELTS Guarantee 8 or 12 weeks). */
  allowedWeeks?: number[];
  /** Minor age band that may take a junior course. */
  juniorBand?: CipMinorBand;
}

export type CipMinorBand = 'primary' | 'junior' | 'senior';

export const CIP_COURSE_RULES: Readonly<Record<string, CipCourseRule>> = {
  'light-esl': { level: 'light' },
  'premium-native-light': { level: 'light' },
  'speak-up': { level: 'short', maxWeeks: 2 },
  'regular-esl': { level: 'semi-sparta' },
  'power-esl': { level: 'semi-sparta' },
  'native-esl': { level: 'semi-sparta' },
  'speaking-master': { level: 'semi-sparta', maxWeeks: 16 },
  'native-master': { level: 'semi-sparta', maxWeeks: 16 },
  'advanced-business': { level: 'semi-sparta', maxWeeks: 12 },
  'toeic-regular': { level: 'semi-sparta', maxWeeks: 16 },
  'intensive-esl': { level: 'sparta' },
  'ielts-basic': { level: 'sparta', allowedWeeks: [4] },
  'ielts-intensive': { level: 'sparta', maxWeeks: 16 },
  'ielts-native': { level: 'sparta', maxWeeks: 16 },
  'ielts-guarantee': { level: 'sparta', allowedWeeks: [8, 12] },
  'primary-english': { level: 'junior', juniorBand: 'primary' },
  'junior-esl': { level: 'junior', juniorBand: 'junior' },
  'junior-native': { level: 'junior', juniorBand: 'junior' },
};

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
): CiaCourseContent => ({ id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder });

const room = (
  id: string, name: string, code: string, group: string, location: '校内' | '校外', fee: number, note: string, sortOrder: number,
): CiaRoomContent => ({ id, name, label: name, code, location, group, fee, note, enabled: true, sortOrder });

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});

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

// Class lines from the 2026 course summary; every class is 45 minutes, small groups are 1:5 and big groups 1:10.
const EVENING_SPARTA = '周一至周四晚上19:00–21:00必上晚课';
const EVENING_IELTS = '周一至周四晚上19:00–22:00、周五19:00–20:00必上晚课';
const SPARTA_NOTE = '全斯巴达课程：平日不能外出，周六上午上课，第2周起每周小考。';
const SEMI_NOTE = '半斯巴达课程：平日下课后可以外出，晚上可自愿参加晚课。';
const LIGHT_NOTE = '轻量课程：课少、下午空闲多，适合兼顾工作或陪孩子的家长。';
const JUNIOR_NOTE = '生活导师每天给家长发学习报告（课程内容和作业）；未成年外出须由20岁以上的成人陪同。';

const createCourses = (): CiaCourseContent[] => [
  course('light-esl', 'Light ESL 轻量综合英语', 720, '4节菲律宾老师一对一 + 1节小组课', '想轻松学习、留出时间工作或陪孩子的成人', LIGHT_NOTE, 0),
  course('premium-native-light', 'PNL 外教轻量课程', 1370, '4节外籍老师一对一 + 1节小组课', '只想跟外籍老师上课、课量不想太多的成人', LIGHT_NOTE, 1),
  course('speak-up', 'Speak Up 短期口语冲刺', 1270, '7节菲律宾老师一对一 + 1节外籍老师一对一', '只有1–2周、想集中练口语的成人', '只能报1–2周。', 2),
  course('regular-esl', 'Regular ESL 综合英语', 820, '3节菲律宾老师一对一 + 3节小组课 + 2节大班课', '想全面打好听说读写基础的成人', SEMI_NOTE, 3),
  course('power-esl', 'Power ESL 一对一强化', 1020, '5节菲律宾老师一对一 + 1节小组课 + 2节大班课', '想多上一对一、进步更快的成人', SEMI_NOTE, 4),
  course('native-esl', 'Native ESL 外教综合英语', 1070, '3节菲律宾老师一对一 + 1节外籍老师一对一 + 3节小组课 + 1节大班课', '想每天都有外籍老师一对一的成人', SEMI_NOTE, 5),
  course('speaking-master', 'Speaking Master 口语强化', 1200, '5节菲律宾老师一对一 + 1节外籍老师一对一 + 1节小组课 + 1节大班课', '想集中提升口语和表达的成人', `最多报16周。${SEMI_NOTE}`, 6),
  course('native-master', 'Native Master 外教口语强化', 1370, '4节菲律宾老师一对一 + 2节外籍老师一对一 + 1节小组课 + 1节大班课', '想多跟外籍老师练口语的成人', `最多报16周。${SEMI_NOTE}`, 7),
  course('advanced-business', 'Advanced Business 高级商务英语', 1160, '3节菲律宾老师一对一 + 1节外籍老师一对一 + 2节小组课 + 1节大班课', '工作中要用英语开会、写邮件和做简报的成人', `入学须达到B1（雅思4.5或托业690）并通过线上面试；最多报12周。${SEMI_NOTE}`, 8),
  course('toeic-regular', 'TOEIC Regular 托业常规', 880, '5节菲律宾老师一对一 + 2节小组课 + 1节大班课', '准备考托业的成人', `入学须达到托业250分并通过线上面试；周六下午托业模考；最多报16周。${SEMI_NOTE}`, 9),
  course('intensive-esl', 'Intensive ESL 斯巴达综合英语', 940, `5节菲律宾老师一对一 + 2节小组课 + 1节大班课；${EVENING_SPARTA}`, '自律性不强、想被严格管理的学生', SPARTA_NOTE, 10),
  course('ielts-basic', 'IELTS Basic 雅思基础', 970, `4节菲律宾老师一对一 + 3节小组课 + 1节大班课；${EVENING_IELTS}`, '雅思2.5–3.0分、想先打基础的学生', `只能报4周；到校后笔试分班，无线上面试。${SPARTA_NOTE}`, 11),
  course('ielts-intensive', 'IELTS Intensive 雅思强化', 1030, `4节菲律宾老师一对一 + 4节小组课；${EVENING_IELTS}`, '雅思3.5分以上、准备考试的学生', `入学须达到雅思3.5分并通过线上面试；周六下午雅思模考；最多报16周。${SPARTA_NOTE}`, 12),
  course('ielts-native', 'IELTS Native 雅思外教强化', 1200, `3节菲律宾老师一对一 + 1节外籍老师一对一 + 4节小组课；${EVENING_IELTS}`, '雅思3.5分以上、想跟外籍老师练口语和写作的学生', `入学须达到雅思3.5分并通过线上面试；最多报16周。${SPARTA_NOTE}`, 13),
  // The price list's fee box gives 1,320 per 4 weeks for 8 weeks and 1,200 for 12 weeks; its 12-week totals use
  // 1,320, which looks like a formula slip, so 12 weeks are quoted at 1,200 (3,600 in all) until the school confirms.
  {
    ...course('ielts-guarantee', 'IELTS Guarantee 雅思保分班', 1320, `4节菲律宾老师一对一 + 4节小组课；${EVENING_IELTS}`, '有明确目标分数、能保证全勤的学生', `只能报8周或12周：8周按1,320美元／4周，12周按1,200美元／4周（共3,600美元）。按目标分数有入学要求，保分条件见下方说明。${SPARTA_NOTE}`, 14),
    feeByWeeks: { '12': 3600 },
  },
  course('primary-english', 'Primary English 儿童英语（7–11岁）', 1230, '5节菲律宾老师一对一 + 1节小组课；晚上可选课', '7–11岁的孩子', JUNIOR_NOTE, 15),
  course('junior-esl', 'Junior ESL 青少年英语（12–15岁）', 1320, '5节菲律宾老师一对一 + 2节小组课', '12–15岁的青少年', JUNIOR_NOTE, 16),
  course('junior-native', 'Junior Native 青少年外教英语（12–15岁）', 1490, '4节菲律宾老师一对一 + 1节外籍老师一对一 + 2节小组课', '12–15岁、想跟外籍老师上课的青少年', JUNIOR_NOTE, 17),
];

const DORM_GROUP = '校内宿舍';
const HOTEL_GROUP = '校外酒店 Clover Hotel';
const HOTEL_NOTE = '车程约5分钟，学校免费接送；斯巴达课程不能住酒店。';
const SHARED_HOTEL_NOTE = `每人价格，须和同行的人同住。${HOTEL_NOTE}`;

const createRooms = (): CiaRoomContent[] => [
  room('single-a', '单人间A', 'SA', DORM_GROUP, '校内', 1080, '较大的单人间。', 0),
  room('single-b', '单人间B', 'SB', DORM_GROUP, '校内', 930, '较小的单人间。', 1),
  room('double', '双人间', 'D', DORM_GROUP, '校内', 780, '两张单人床，房内有卫生间。', 2),
  room('triple', '三人间', 'T', DORM_GROUP, '校内', 670, '三张单人床，房内有卫生间。', 3),
  room('quad', '四人间', 'Q', DORM_GROUP, '校内', 570, '三张床加一张抽拉床，适合家庭或4人同行，床位安排以学校确认为准。', 4),
  room('hotel-king-single', '豪华大床房（1人住）', 'KS', HOTEL_GROUP, '校外', 2026, `约28平方米，一张大床。${HOTEL_NOTE}未成年学生不能单独入住。`, 5),
  room('hotel-king-double', '豪华大床房（2人住）', 'KD', HOTEL_GROUP, '校外', 1325, `约28平方米，一张大床。${SHARED_HOTEL_NOTE}`, 6),
  room('hotel-twin-double', '豪华双床房（2人住）', 'TD', HOTEL_GROUP, '校外', 1430, `约28平方米，两张床。${SHARED_HOTEL_NOTE}`, 7),
  room('hotel-twin-triple', '豪华双床房（3人住）', 'TT', HOTEL_GROUP, '校外', 1149, `约28平方米，两张床。${SHARED_HOTEL_NOTE}`, 8),
  room('hotel-suite-triple', '行政套房（3人住）', 'ST', HOTEL_GROUP, '校外', 1535, `约63平方米，两间卧室、两个卫生间、厨房和沙发床。${SHARED_HOTEL_NOTE}`, 9),
  room('hotel-suite-quad', '行政套房（4人住）', 'SQ', HOTEL_GROUP, '校外', 1289, `约63平方米，两间卧室、两个卫生间、厨房和沙发床。${SHARED_HOTEL_NOTE}`, 10),
];

/** Visa extensions add up as the June 2026 sheet's cumulative totals (5,640／13,060／18,000／23,450／29,400). */
const VISA_RATES_30 = [5640, 7420, 4940, 5450, 5950];

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({
    id: 'visa-extension', name: '签证续签', amount: 5640, rates: VISA_RATES_30, tourist59Rates: VISA_RATES_30.slice(1),
    billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true,
    note: '30天签证依次5,640／7,420／4,940／5,450／5,950比索；59天签证从第2次的7,420比索算起；以实际办理为准。', sortOrder: 0,
  }),
  fee({ id: 'acr-i-card', name: 'ACR I-CARD', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '需要续签时办理一次。', sortOrder: 1 }),
  fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 6800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取；读满24周须再缴一次。', sortOrder: 2 }),
  fee({ id: 'ssp-i-card', name: 'SSP I-CARD', amount: 4000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP一起办理；读满24周须再缴一次。', sortOrder: 3 }),
  fee({ id: 'electricity', name: '电费', amount: 600, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '住校内宿舍每周收取，每周含16度电，超出部分每度25比索、同房分摊；住酒店不收。', sortOrder: 4 }),
  fee({ id: 'utility', name: '设施使用费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每周收取，住宿舍和酒店都收。', sortOrder: 5 }),
  fee({ id: 'id-card', name: '学生证', amount: 250, billingRule: 'once', includeInTotal: true, note: '入学时办理一次。', sortOrder: 6 }),
  fee({ id: 'textbooks', name: '教材费', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周约1,500–2,500比索，按课程不同，暂按2,000预估；以实际购买为准。', sortOrder: 7 }),
  fee({ id: 'deposit', name: '宿舍押金（可退）', amount: 2000, billingRule: 'optional', includeInTotal: false, note: '住2周以内2,000、3–4周3,000、5–8周4,000、9周以上5,000比索；毕业时扣除电费后退还；住酒店不收。', sortOrder: 8 }),
  fee({ id: 'pickup', name: '机场接机', amount: 1000, billingRule: 'optional', includeInTotal: false, note: '克拉克机场每人1,000比索（2人共1,500、3人以上共2,000）；马尼拉机场4,500／5,500／6,500比索；淡季优惠期间克拉克接机免费。', sortOrder: 9 }),
  fee({ id: 'laundry', name: '外包洗衣', amount: 150, billingRule: 'optional', includeInTotal: false, note: '5公斤以内150、6–8公斤200、9–10公斤300比索；也可免费用自助洗衣机（10:00–21:00，自备洗衣液）。', sortOrder: 10 }),
  fee({ id: 'extra-night', name: '提前入住或延后退房', amount: 3000, billingRule: 'optional', includeInTotal: false, note: '每晚3,000比索，须提前向学校申请。', sortOrder: 11 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: CIP_OFF_SEASON_RULE_ID, name: '2027淡季优惠', sortOrder: 0, discountValue: 50, appliesTo: 'tuition',
    description: '6–8月以外的学习周每满4周减50美元，不足4周不折算；6–8月的学习周不计入',
    coverageStart: CIP_USD_FROM, coverageEnd: CIP_OFF_SEASON_END,
  }),
  promotion({
    id: CIP_LONG_STAY_RULE_ID, name: '长期报名优惠', sortOrder: 1, discountValue: 50,
    description: '课程满16周减50美元，满20周减100美元，满24周减150美元',
    minimumCourseWeeks: 16, discountTiers: { '16': 50, '20': 100, '24': 150 },
  }),
  promotion({
    id: CIP_RETURNING_RULE_ID, name: '老学员返校', sortOrder: 2, discountType: 'none', appliesTo: 'school-total',
    description: '老学员返校免收一次性注册费。', waiveRegistration: true,
  }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留时间预估；电费只在住校内宿舍时收，设施使用费按住宿周数收；教材按课程周数预估。押金、接机和洗衣另外准备。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultCipContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: CIP_SCHOOL_CODE,
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'CIP 4周课程费',
    courseTableNote: '以下为周一至周五的每日课程安排，课程费按4周计算；1–3周按4周价的40%、65%、85%计算。',
    groupClassNote: '小组课为1:5，大班课为1:10；每节课45分钟。',
    roomTableTitle: 'CIP 4周住宿费',
    roomTableNote: '住宿费含三餐和每1–2周一次的打扫、换床单；酒店价格为每人价格。',
    stayPolicyTitle: 'CIP 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算；酒店周日14:00起入住。' },
      { label: '退房日期', value: '课程结束后的周六13:00前', note: '酒店周六12:00前退房；延住每晚3,000比索。' },
      { label: '校外酒店', value: 'Clover Hotel，车程约5分钟', note: HOTEL_NOTE },
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
    alumniBenefitText: ALUMNI_BENEFIT_TEXT,
    noteSectionTitle: '报价说明',
    footerNotes: ['到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

/** A CIP content document (default or a later published revision). */
export function isCipContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === CIP_SCHOOL_CODE
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

export const cloneCipContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultCipContentConfig();
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
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
