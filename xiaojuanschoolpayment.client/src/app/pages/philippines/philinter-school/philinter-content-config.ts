// Philinter's versioned employee content document: courses, rooms, local fees, promotions and quote-image copy.
// The public page (philinter-school-page.component.ts), its calculator (philinter-page-quote.ts), the local-fee
// table and the quote image all read the published version of this document. Keep it pure data (no Angular,
// DOM or storage), so the WeChat mini program can bundle it later.
// Sources: the school's Google Drive pack “Philinter 2026-2027” (2026 and 2027 price lists, the 2026-10-19
// local-fee sheet, 2026 brochure, 2026-10-19 student handbook, 2027 holiday poster) and the 2025 Chinese
// brochure; see docs/philinter-source-2026-11-24.md.
import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import { ASSOCIATION_PEAK_POLICY_VERSION } from '../association-peak-surcharge';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Raised when saved documents must inherit a school notice once (clonePhilinterContentConfig):
 * 1 = the 2026-11-24 school pack: Chinese course names and class lines from the 2026 brochure, the 2027 room
 *     prices and registration fee, the new courses (TOEIC Guarantee, IELTS 16 weeks, Booster Speaking, PTE),
 *     the 2026-10-19 local-fee sheet and the 2027 summer peak dates.
 */
export const PHILINTER_POLICY_VERSION = 1;

/** Philinter-only settings carried in quoteSettings. */
export type PhilinterQuoteSettings = CiaQuoteSettings & {
  philinterPolicyVersion?: number;
  /** Registration fee for stays whose first arrival is on or after priceSwitchArrival (150 dollars in 2027). */
  registrationFee2027?: number;
  /**
   * First Sunday arrival that pays the 2027 price list (rooms `fee2027`, registrationFee2027); earlier arrivals keep
   * the 2026 prices for the whole stay. Empty while Philinter has not said when the 2027 list takes effect, so
   * every student pays the 2026 prices whatever the arrival date (user decision 2026-11-24).
   */
  priceSwitchArrival?: string;
};

/** Booster Speaking and PTE are new courses that run from this Sunday arrival. */
export const PHILINTER_NEW_COURSE_START = '2027-01-03';
export const PHILINTER_SIDA_RULE_ID = 'philinter-sida-90';
export const PHILINTER_LOW_SEASON_RULE_ID = 'philinter-low-season';
export const PHILINTER_RETURNING_RULE_ID = 'philinter-returning-registration';
export const PHILINTER_AZON_ROOM_IDS: readonly string[] = ['azon-single', 'azon-twin', 'azon-triple'];
/** Courses for 12–17 (Junior ESL also 7–11); every other course is for adults (18 in the study year). */
export const PHILINTER_JUNIOR_COURSE_IDS: readonly string[] = ['junior-esl-12-17-years', 'junior-ielts-12-17-years', 'junior-speaking'];
/** Courses on the 2027 price list only. */
export const PHILINTER_2027_ONLY_COURSE_IDS: readonly string[] = ['booster-speaking', 'pte'];
/** Courses run as a fixed block: exactly these total weeks (Premium Junior Speaking 4–6). */
export const PHILINTER_FIXED_WEEKS: Readonly<Record<string, readonly number[]>> = {
  'ielts-guarantee-8-weeks': [8],
  'ielts-guarantee-12-weeks': [12],
  'ielts-16-weeks-6-5': [16],
  'ielts-16-weeks-5-5': [16],
  speaking: [8],
  'junior-speaking': [4, 5, 6],
  'booster-speaking': [4],
};

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({ id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder, ...extra });

const room = (
  id: string, name: string, group: string, location: '校内' | '校外', fee: number, fee2027: number, note: string, sortOrder: number,
): CiaRoomContent => ({ id, name, label: name, code: id, location, group, fee, fee2027, note, enabled: true, sortOrder });

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: (value.sortOrder + 1) * 10,
  stackable: true,
  newStudentsOnly: false,
  discountType: 'none',
  discountValue: 0,
  appliesTo: 'school-total',
  waiveRegistration: false,
  minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'none',
  ...value,
});

// Class lines from the 2026 brochure's course table (一对一 / 小组课1:4–6 / 大班课1:10–15 / 晚自习).
const EVENING = '周一至周四19:00–21:00必修晚自习';
const IELTS_LINE = `4节一对一 + 4节小组课 + ${EVENING} + 每周六上午雅思模考`;
const TOEIC_LINE = '4节一对一 + 2节小组课 + 2节大班课 + 每周五上午托业模考';
const BUSINESS_LINE = '3节一对一 + 4节小组课 + 1节大班课';

const createCourses = (): CiaCourseContent[] => [
  course('intensive-esl', '强化ESL Intensive ESL', 1030, `4节一对一 + 3节小组课 + 1节大班课 + ${EVENING}`,
    '想用斯巴达节奏全面提高听说读写的学生', '斯巴达课程；周三有单词、句型和语法周考（第1周不考）。', 0),
  course('intensive-power-speaking', '强化口语 IPS（Intensive Power Speaking）', 1170, '4节一对一 + 4节小组课 + 选斯巴达时另有周一至周四晚自习',
    '想集中练口语流利度和发音的学生', '入学程度约Elementary 201（雅思3分左右）；报名时选斯巴达或半斯巴达。', 1),
  course('general-esl', '综合ESL General ESL', 900, '3节一对一 + 3节小组课 + 2节大班课',
    '想打好英语基础、课后时间自己安排的学生', '半斯巴达课程，没有必修晚自习。', 2),
  course('light-esl', '轻松ESL Light ESL', 790, '2节一对一 + 1节小组课 + 2节大班课',
    '想边学英语边体验宿务生活的学生，或陪孩子来的家长', '半斯巴达课程；青少年学生的陪读家长只能报这门课。', 3),
  course('booster-speaking', '口语冲刺 Booster Speaking', 1400, '课程安排报名时向学校确认',
    '想用4周集中突破口语的学生', '2027年新课程，固定4周，可单独报名；课程细节以学校公布为准。', 4),
  course('speaking', '精品口语小班 Premium Speaking', 1400, '2节一对一 + 6节精品小组课（1:4–6）+ 周一至周四晚自习',
    '中级以上、想在小班里大量开口的成人', '团报课程，固定8周；入学程度Intermediate 301+；由雅思7.5–8.0分的老师授课。', 5),
  course('ielts-guarantee-8-weeks', '雅思8周保分班 IELTS Guarantee', 1580, IELTS_LINE,
    '雅思4.0／5.5／6.5分起、想8周达到5.5／6.5／7.0分的学生', '固定8周，第8周参加官方雅思（学术类纸笔考试，学校安排1次免费）；条件见课程说明。', 6),
  course('ielts-guarantee-12-weeks', '雅思12周保分班 IELTS Guarantee', 1420, IELTS_LINE,
    '雅思4.0／5.5／6.5分起、想12周达到5.5／6.5／7.0分的学生', '固定12周，第10或11周参加官方雅思（学术类纸笔考试，学校安排1次免费）；条件见课程说明。', 7),
  course('ielts-intensive', '雅思强化 IELTS Intensive', 1200, IELTS_LINE,
    '雅思3.0分起、想系统备考雅思的学生', '斯巴达课程，周数可自选；可自费在校内参加官方雅思考试。', 8),
  course('ielts-16-weeks-6-5', '雅思16周冲6.5 IELTS 16 Weeks for 6.5', 1107.5, IELTS_LINE,
    '雅思4.0分左右、想用16周冲6.5分的学生', '固定16周：先上4周强化ESL打基础，再上12周雅思课程；不是保分班；16周学费合计4,430美元。', 9,
    { feeByWeeks: { '16': 4430 } }),
  course('ielts-16-weeks-5-5', '雅思16周冲5.5 IELTS 16 Weeks for 5.5', 1065, IELTS_LINE,
    '雅思2.0分左右、基础较弱、想用16周冲5.5分的学生', '固定16周：先上8周强化ESL打基础，再上8周雅思课程；不是保分班；16周学费合计4,260美元。', 10,
    { feeByWeeks: { '16': 4260 } }),
  course('pte', 'PTE 备考 Pearson Test of English', 1170, '课程安排报名时向学校确认',
    '准备参加PTE考试的学生', '2027年新课程；课程细节以学校公布为准。', 11),
  course('toeic-guarantee-12-weeks', '托业12周保分班 TOEIC Guarantee', 1260, TOEIC_LINE,
    '托业550／670／800分起、想12周达到700／800／900分的学生', '至少12周，入学日期按官方托业考试日期倒推安排；条件见课程说明。', 12, { minimumWeeks: 12 }),
  course('toeic-regular', '托业常规 TOEIC Regular', 1100, TOEIC_LINE,
    '托业225分起、想提高托业分数的学生', '半斯巴达课程；最多3节托业课可改为商务课。', 13),
  course('basic-business', '基础商务英语 Basic Business', 1150, BUSINESS_LINE,
    '想打好职场英语沟通基础的学生', '入学程度Upper Elementary 201+。', 14),
  course('advanced-business', '进阶商务英语 Advanced Business', 1200, BUSINESS_LINE,
    '中级以上、工作中要用英语开会和做简报的学生', '入学程度Intermediate 301+；所有学生须上台做商务简报。', 15),
  course('focus-industry', '行业英语 Focus Industry', 1280, '3节一对一 + 4节小组课 + 1节大班课',
    '到校后想转学自己行业英语的学生', '不能直接报名，须到校后经教务处面谈确认后再转课。', 16, { enabled: false }),
  course('junior-esl-12-17-years', '青少年ESL Junior ESL（7–17岁）', 1340, '3节一对一 + 4节小组课',
    '7–11岁小学生和12–17岁中学生', '须与监护人同住，监护人只能报轻松ESL；周三有周考（第1周不考）。', 17),
  course('junior-ielts-12-17-years', '青少年雅思 Junior IELTS（12–17岁）', 1490, IELTS_LINE,
    '12–17岁、雅思3.0分起的中学生', '须与监护人同住，监护人只能报轻松ESL。', 18),
  course('junior-speaking', '青少年精品口语 Premium Junior Speaking（12–17岁）', 1400, '2节一对一 + 5节精品小组课（1:4–6）+ 周一至周四晚自习',
    '12–17岁、想在小班里大量开口的中学生', '团报课程，固定4–6周；入学程度Upper Elementary 201+。', 19),
];

const DORM = '校内宿舍';
const AZON = 'Azon 校外公寓';
const createRooms = (): CiaRoomContent[] => [
  room('in-campus-single', '校内单人间', DORM, '校内', 1400, 1600, '一人一间，上课最方便。', 0),
  room('in-campus-twin', '校内双人间', DORM, '校内', 970, 1030, '两人一间，预算和隐私比较平衡。', 1),
  room('in-campus-triple', '校内三人间', DORM, '校内', 810, 830, '三人一间，校内住宿中费用最低。', 2),
  room('azon-single', 'Azon公寓单人间', AZON, '校外', 1690, 1690, '校外公寓，没有门禁，可以自己做饭；上课日有接送车。', 3),
  room('azon-twin', 'Azon公寓双人间', AZON, '校外', 1100, 1100, '校外公寓，没有门禁，可以自己做饭；上课日有接送车。', 4),
  room('azon-triple', 'Azon公寓三人间', AZON, '校外', 890, 890, '校外公寓，没有门禁，可以自己做饭；上课日有接送车。', 5),
];

const VISA_NOTE = '30天签证入境第5周起续签，59天签证入境第9周起续签；累计6,920／11,360／16,310／21,760／27,210比索，以实际办理为准。';

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特殊学习许可', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学时办理一次。', sortOrder: 0 }),
  fee({ id: 'ssp-i-card', name: 'SSP ACR E-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP一起办理，只收一次。', sortOrder: 1 }),
  fee({ id: 'acr-i-card', name: '旅游签ACR I-CARD', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次续签时办理一次。', sortOrder: 2 }),
  fee({ id: 'arp', name: 'ARP', amount: 300, billingRule: 'long-term-or-first-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次续签时办理一次。', sortOrder: 3 }),
  fee({ id: 'visa-extension', name: '旅游签续签', amount: 6920, rates: [6920, 4440, 4950, 5450, 5450], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: VISA_NOTE, sortOrder: 4 }),
  fee({ id: 'management', name: '维护费', amount: 600, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '每周600比索，按住宿周数收取。', sortOrder: 5 }),
  fee({ id: 'water', name: '水费', amount: 250, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '每周250比索；Azon公寓只住1–3周时为450／650／850比索。', sortOrder: 6 }),
  fee({ id: 'electricity', name: '电费', amount: 1000, secondaryAmount: 1500, secondaryLabel: 'Azon公寓另加一次', billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '每周1,000比索。校内宿舍含每人每周20度，超出每度25比索；Azon公寓另加1,500比索，每月账单超过每人5,500比索须补交。', sortOrder: 7 }),
  fee({ id: 'books', name: '教材费', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每种课程按每开始4周约2,000比索预估；周三起到办公室按实际购买。', sortOrder: 8 }),
  fee({ id: 'student-id', name: '学生证', amount: 400, billingRule: 'once', includeInTotal: true, note: '一次性费用。', sortOrder: 9 }),
  fee({ id: 'pickup', name: '宿务机场接机', amount: 1200, secondaryAmount: 1500, secondaryLabel: '平日或红眼航班', billingRule: 'optional', includeInTotal: false, note: '周末06:00–24:00为1,200比索／人，平日或红眼航班1,500比索／人。', sortOrder: 10 }),
  fee({ id: 'deposit', name: '宿舍押金（可退）', amount: 2000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '1–2周2,000，3–7周3,000，8–11周4,000，12周以上5,000比索；退房检查后退还。', sortOrder: 11 }),
];

/** The low-season offer's text; the 8-week block rule is in philinter-page-quote.ts. */
export const PHILINTER_LOW_SEASON_TEXT = '2026/08/16–12/25期间，入住校内三人间或Azon单人间、双人间，每连续读满8周减300美元；保分班不参加，不能与学校其他优惠同用。';

const createPromotions = (): CiaPromotionRule[] => [
  promotion({ id: PHILINTER_SIDA_RULE_ID, name: '思达启航折扣', description: '课程费和住宿费享9折；注册费和旺季附加费不打折。', sortOrder: 0, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation' }),
  promotion({
    id: PHILINTER_LOW_SEASON_RULE_ID, name: '2026下半年淡季优惠', description: PHILINTER_LOW_SEASON_TEXT, sortOrder: 1,
    discountType: 'fixed', discountValue: 300, minimumCourseWeeks: 8, minimumAccommodationWeeks: 8,
    eligibleRoomIds: ['in-campus-triple', 'azon-single', 'azon-twin'], coverageStart: '2026-08-16', coverageEnd: '2026-12-25', coverageTarget: 'course-and-accommodation',
  }),
  promotion({ id: PHILINTER_RETURNING_RULE_ID, name: '老学员返校', description: '老学员返校免收一次性注册费。', sortOrder: 2, waiveRegistration: true }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索交给学校，按每位学生选择的签证和住宿周数预估。维护费、水费和电费按住宿周数收取，Azon公寓的水电另有标准；押金和接机不计入合计。请准备4张2×2英寸照片。';
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultPhilinterContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'PHILINTER',
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 120,
    registrationFee2027: 150,
    priceSwitchArrival: '',
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.45, '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: 40,
    peakSeasonPolicyVersion: ASSOCIATION_PEAK_POLICY_VERSION,
    peakSeasonRanges: [
      { id: 'summer-2026', label: '2026暑期旺季', start: '2026-07-05', end: '2026-08-29', enabled: true },
      { id: 'summer-2027', label: '2027暑期旺季', start: '2027-07-04', end: '2027-08-28', enabled: true },
    ],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'Philinter 4周课程费',
    courseTableNote: '1–3周按4周价的45%、65%、85%计算。',
    groupClassNote: '小组课1:4–6，大班课1:10–15；每节课40–45分钟。',
    roomTableTitle: 'Philinter 4周住宿费',
    roomTableNote: '2026年和2027年入学目前都按以上价格。',
    stayPolicyTitle: 'Philinter 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日08:00起入住', note: '课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '周六10:00前退房', note: '提早入住或延后退房每人每天3,500比索（含三餐），须提前申请。' },
      { label: '暑期与寒假', value: '有最低周数', note: '暑假校内宿舍至少8周、Azon至少4周；寒假校内宿舍至少6周、Azon至少4周；以学校当期通知为准。' },
    ],
    extraNightRates: [{ label: '提早入住／延后退房', amount: 3500 }],
    philinterPolicyVersion: PHILINTER_POLICY_VERSION,
  } as PhilinterQuoteSettings,
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '', promotion: '' },
    promotionNotes: {},
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

/** Course names saved before version 1 (philinter-catalog.ts), so only untouched rows take the new text. */
const OLD_COURSE_NAMES: Record<string, string> = {
  'light-esl': '轻量综合英语 Light ESL', 'general-esl': '常规综合英语 General ESL', 'intensive-esl': '强化综合英语 Intensive ESL',
  'intensive-power-speaking': '强化口语 Intensive Power Speaking', 'ielts-intensive': '雅思强化 IELTS Intensive',
  'ielts-guarantee-8-weeks': '雅思8周保证班 IELTS Guarantee 8 Weeks', 'ielts-guarantee-12-weeks': '雅思12周保证班 IELTS Guarantee 12 Weeks',
  'toeic-regular': '常规托业 TOEIC Regular', 'focus-industry': '行业英语 Focus Industry（可定制）', 'basic-business': '基础商务英语 Basic Business',
  'advanced-business': '进阶商务英语 Advanced Business', 'junior-esl-12-17-years': '青少年综合英语 Junior ESL（12–17岁）',
  'junior-ielts-12-17-years': '青少年雅思 Junior IELTS（12–17岁）', speaking: '口语 Speaking', 'junior-speaking': '青少年口语 Junior Speaking',
};
const OLD_ROOM_NAMES = new Set(['校内三人房', '校内双人房', '校内单人房', '校外公寓三人房', '校外公寓双人房', '校外公寓单人房']);
const OLD_IMAGE_COPY = {
  paymentNotes: { course: '按所选课程、周数及日期计算', accommodation: '按所选房型、周数及日期计算', promotion: '优惠按当前有效规则自动计算' } as Record<string, string>,
  alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
  footerNotes: ['课程、住宿、暑期附加费和优惠按当前选择及有效规则计算。', '到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  localFeeIntro: '学杂费由学校及相关部门到校收取；页面按当前选择预估，最终以学校现场实收为准。',
};

/**
 * Version 1: brings a document saved before the 2026-11-24 pack onto it. Untouched course and room text is
 * replaced; every saved price stays; the 2027 room prices, new courses, the 2026-10-19 local-fee rules (saved
 * amounts of rules whose basis did not change are kept) and the confirmed 2027 summer dates are added.
 */
function upgradePhilinterPolicy(clone: CiaContentConfig, defaults: CiaContentConfig): boolean {
  const settings = clone.quoteSettings as PhilinterQuoteSettings;
  if ((settings.philinterPolicyVersion ?? 0) >= PHILINTER_POLICY_VERSION) return false;
  const defaultCourses = new Map(defaults.courses.map(item => [item.id, item]));
  for (const item of clone.courses ?? []) {
    const fresh = defaultCourses.get(item.id);
    if (!fresh) continue;
    if (item.name === OLD_COURSE_NAMES[item.id]) {
      Object.assign(item, { name: fresh.name, schedule: fresh.schedule, suitable: fresh.suitable, note: fresh.note });
    }
    // Fixed-length packages and the guarantee minimum come with the course, not from the editor.
    if (fresh.feeByWeeks) item.feeByWeeks = { ...fresh.feeByWeeks };
    if (fresh.minimumWeeks) item.minimumWeeks = fresh.minimumWeeks;
    if (item.id === 'focus-industry') item.enabled = false;
  }
  for (const fresh of defaults.courses) {
    if (!clone.courses.some(item => item.id === fresh.id)) clone.courses.push(copyJson(fresh));
  }
  const courseOrder = (item: CiaCourseContent) => defaultCourses.get(item.id)?.sortOrder ?? item.sortOrder;
  clone.courses.sort((a, b) => courseOrder(a) - courseOrder(b));
  clone.courses.forEach((item, index) => { item.sortOrder = index; });
  const defaultRooms = new Map(defaults.rooms.map(item => [item.id, item]));
  for (const item of clone.rooms ?? []) {
    const fresh = defaultRooms.get(item.id);
    if (!fresh) continue;
    item.fee2027 ??= fresh.fee2027;
    if (OLD_ROOM_NAMES.has(item.name)) Object.assign(item, { name: fresh.name, label: fresh.label, group: fresh.group, note: fresh.note });
  }
  for (const fresh of defaults.rooms) {
    if (!clone.rooms.some(item => item.id === fresh.id)) clone.rooms.push(copyJson(fresh));
  }
  // The 2026-10-19 sheet bills water, electricity and maintenance by the week and adds a visa sequence, so these
  // rules are replaced; the once-only rules keep a saved amount.
  const keepAmount = new Set(['ssp', 'ssp-i-card', 'acr-i-card', 'arp', 'student-id']);
  const savedFees = new Map((clone.localFees ?? []).map(rule => [rule.id, rule]));
  clone.localFees = defaults.localFees.map(rule => {
    const saved = savedFees.get(rule.id);
    const next = copyJson(rule);
    if (saved && keepAmount.has(rule.id)) next.amount = saved.amount;
    if (saved) next.enabled = saved.enabled;
    return next;
  });
  const savedPromotions = new Map(settings.promotions.map(rule => [rule.id, rule]));
  settings.promotions = defaults.quoteSettings.promotions.map(rule => {
    const saved = savedPromotions.get(rule.id);
    return saved ? { ...copyJson(rule), enabled: saved.enabled } : copyJson(rule);
  });
  settings.peakSeasonRanges = copyJson(defaults.quoteSettings.peakSeasonRanges);
  settings.peakSeasonPolicyVersion = ASSOCIATION_PEAK_POLICY_VERSION;
  const defaultSettings = defaults.quoteSettings as PhilinterQuoteSettings;
  settings.registrationFee2027 ??= defaultSettings.registrationFee2027;
  settings.priceSwitchArrival ??= defaultSettings.priceSwitchArrival;
  for (const key of ['localFeeIntro', 'courseTableTitle', 'courseTableNote', 'groupClassNote', 'roomTableTitle', 'roomTableNote', 'stayPolicyTitle'] as const) {
    settings[key] = defaults.quoteSettings[key];
  }
  settings.stayPolicies = copyJson(defaults.quoteSettings.stayPolicies);
  settings.extraNightRates = copyJson(defaults.quoteSettings.extraNightRates);
  settings.philinterPolicyVersion = PHILINTER_POLICY_VERSION;
  return true;
}

/** Replaces only image lines nobody has edited since they were the defaults. */
function upgradePhilinterImageCopy(settings: CiaContentConfig['quoteImageSettings']): void {
  const notes = settings.paymentNotes as unknown as Record<string, string>;
  for (const [key, old] of Object.entries(OLD_IMAGE_COPY.paymentNotes)) {
    if (notes[key] === old) notes[key] = '';
  }
  if (settings.alumniBenefitText === OLD_IMAGE_COPY.alumniBenefitText) settings.alumniBenefitText = ALUMNI_BENEFIT_TEXT;
  if (settings.footerNotes.join('\n') === OLD_IMAGE_COPY.footerNotes.join('\n')) settings.footerNotes = OLD_IMAGE_COPY.footerNotes.slice(1);
  if (settings.localFeeIntro === OLD_IMAGE_COPY.localFeeIntro) settings.localFeeIntro = LOCAL_FEE_INTRO;
  // The old defaults described the offers inside the image; the payment rows now carry their own notes.
  settings.promotionNotes = {};
  settings.supplementalFeeNotes = {};
}

/** A Philinter content document (default or published revision). */
export function isPhilinterContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === 'PHILINTER'
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

export const clonePhilinterContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultPhilinterContentConfig();
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= copyJson(defaults.quoteSettings.peakSeasonRanges);
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= copyJson(defaults.quoteSettings.extraNightRates);
  const upgraded = upgradePhilinterPolicy(clone, defaults);
  if ((clone.quoteSettings.peakSeasonPolicyVersion ?? 0) < ASSOCIATION_PEAK_POLICY_VERSION) {
    clone.quoteSettings.peakSeasonRanges = copyJson(defaults.quoteSettings.peakSeasonRanges);
    clone.quoteSettings.peakSeasonPolicyVersion = ASSOCIATION_PEAK_POLICY_VERSION;
  }
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  clone.quoteImageSettings.footerNotes = clone.quoteImageSettings.footerNotes.map(note => note.replace(/思达游学/g, '思达启航'));
  if (upgraded) upgradePhilinterImageCopy(clone.quoteImageSettings);
  clone.media ??= [];
  return clone;
};
