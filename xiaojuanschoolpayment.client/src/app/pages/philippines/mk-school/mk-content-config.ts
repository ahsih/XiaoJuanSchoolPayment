// MK Language Training Center's versioned content document: courses, rooms, local fees, offers and quote-image copy.
// The page (mk-school-page.component.ts), its calculator (mk-page-quote.ts), the local-fee table and the quote image
// all read this document (or a published revision of it). Sources: MK Curriculum & Cost 2027 (2027-01-01; the same
// prices as the 2026 list), the 2026 and 2027 promotion notices (MK_20260106, MK_20260801) with MK's own promotion
// cost sheets, the course guide and the 2025 brochure, all received 2026-11-23. Keep it pure data.
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

export const MK_SCHOOL_CODE = 'MK';
export const MK_IELTS_GUARANTEE_ID = 'ielts-guarantee';
/** Courses the price list limits to students aged 18 and over. */
export const MK_ADULT_ONLY_COURSE_IDS: readonly string[] = ['business', 'working-holiday'];
/** Courses TESOL may be added to (course guide: any ESL or IELTS course + TESOL). */
export const MK_TESOL_BASE_COURSE_IDS: readonly string[] = [
  'esl-basic', 'esl-standard', 'esl-premium', 'esl-intensive', 'ielts', MK_IELTS_GUARANTEE_ID,
];
/** TESOL at West Visayas State University: a four-week add-on, 350 dollars (price list and brochure). */
export const MK_TESOL_FEE = 350;
export const MK_TESOL_WEEKS = 4;

/** Calculator semantics of MK's two notices (CiaPromotionRule.ruleKind). */
export const MK_HALF_PRICE_RULE = 'mk-half-price';
export const MK_DORM_2027_RULE = 'mk-dorm-2027';
export const MK_RETURNING_RULE_ID = 'mk-returning-registration';
/** 思达启航 10% on the full course and room price, applied before MK's offers (user decision 2026-11-25). */
export const MK_SIDA_RULE = 'mk-sida';

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder, ...extra,
});

const room = (id: string, name: string, code: string, fee: number, note: string, sortOrder: number): CiaRoomContent => ({
  id, name, label: name, code, location: '校内', group: '校内宿舍', fee, note, enabled: true, sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: (value.sortOrder + 1) * 10,
  stackable: false,
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

const SELF_STUDY = '每天2小时晚自习';

const createCourses = (): CiaCourseContent[] => [
  course('esl-basic', '综合英语基础 ESL BASIC', 650, `3节一对一 + 2节1:5小组课 + ${SELF_STUDY}`, '预算优先、想先打好词汇和沟通基础的学生', '侧重词汇和基础沟通；结业时交一篇200字的菲律宾学习报告。', 0),
  course('esl-standard', '综合英语标准 ESL STANDARD', 730, `4节一对一 + 2节1:5小组课 + ${SELF_STUDY}`, '想全面提升听说读写的成人', '侧重阅读和理解；结业时交一篇书评或影评。', 1),
  course('esl-premium', '综合英语高级 ESL PREMIUM', 820, `5节一对一 + 2节1:5小组课 + ${SELF_STUDY}`, '想多练口语、提高日常沟通能力的学生', '侧重沟通和口语表达；结业时交一篇关于菲律宾人的评论。', 2),
  course('esl-intensive', '综合英语强化 ESL INTENSIVE', 930, `7节一对一 + ${SELF_STUDY}（没有小组课）`, '不想上小组课、想全部一对一的学生', '侧重语法和写作结构；结业时交一首关于菲律宾的英文诗。', 3),
  course(MK_IELTS_GUARANTEE_ID, '雅思保分班 IELTS GUARANTEE', 1050, `6节一对一 + 2节1:5小组课 + ${SELF_STUDY}`, '有明确目标分、能保证出勤的学生', '至少12周；送1次官方雅思考试，入学分数和保分条件见课程说明。', 4, { minimumWeeks: 12 }),
  course('ielts', '雅思常规 IELTS', 880, `4节一对一 + 2节1:5小组课 + ${SELF_STUDY}`, '准备雅思考试、想熟悉题型的学生', '每月2次雅思模考。', 5),
  course('business', '商务英语 BUSINESS', 880, `4节一对一 + 2节1:5小组课 + ${SELF_STUDY}`, '18岁以上、工作中要用英语的成人', '须达到中级水平；可选1–2周当地工作体验。', 6, { minimumWeeks: 4 }),
  course('working-holiday', '打工度假 WORKING HOLIDAY', 800, `4节一对一 + 2节1:5小组课 + ${SELF_STUDY}`, '18岁以上、准备去打工度假的学生', '学写求职信和简历；可选1–2周当地工作体验。', 7, { minimumWeeks: 4 }),
  course('internship', '英语实习 INTERNSHIP', 860, '前4周：4节一对一 + 3节1:5小组课；之后：4节一对一 + 3小时实习，另有每天2小时晚自习', '想边学英语边积累工作经验的学生', '实习单位有酒店、旅行社、学校、餐厅、办公室等，结业可获实习证书。', 8),
  course('survival', '生存英语 SURVIVAL ENGLISH', 800, `4节一对一 + 2节1:5小组课 + ${SELF_STUDY}`, '想出国旅行、享受退休生活的中老年人', '学机场、酒店、餐厅、问路等场景最常用的英语。', 9),
  course('junior-basic', '青少年基础 JUNIOR BASIC', 770, `4节一对一 + 1节1:5小组课 + ${SELF_STUDY}`, '跟家长来学习的孩子', '入学后按分级测试分班。', 10),
  course('junior-premium', '青少年高级 JUNIOR PREMIUM', 990, `6节一对一 + 1节1:5小组课 + ${SELF_STUDY}`, '想多上一对一的孩子', '入学后按分级测试分班。', 11),
  course('guardian', '家长课程 GUARDIAN', 570, `4节一对一 + ${SELF_STUDY}`, '陪孩子来、自己也想学一点的家长', '最多可把3节一对一转给孩子。', 12),
];

const ROOM_NOTE = '含打扫和一日三餐；水电费和洗衣另付。';
const createRooms = (): CiaRoomContent[] => [
  room('one-bed', '单人间', 'MK-1', 990, `一人一间。${ROOM_NOTE}`, 0),
  room('two-bed', '双人间', 'MK-2', 700, `两人一间。${ROOM_NOTE}`, 1),
  room('three-bed', '三人间', 'MK-3', 600, `三人一间。${ROOM_NOTE}`, 2),
  room('four-bed', '四人间（限家庭或团体）', 'MK-4', 520, `只接受家庭或团体入住。${ROOM_NOTE}`, 3),
];

const MONTHLY = '学校按月收取，这里按每4周计1个月估算。';
const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特殊学习许可', amount: 7500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，有效6个月。', sortOrder: 0 }),
  fee({ id: 'ssp-i-card', name: 'SSP I-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP一起办理，有效1年。', sortOrder: 1 }),
  fee({ id: 'acr-i-card', name: 'ACR I-CARD 外国人登记卡', amount: 4300, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次续签时办理一次，有效1年。', sortOrder: 2 }),
  fee({ id: 'visa-extension', name: '签证续签', amount: 5040, rates: [5040, 6420, 4330], tourist59Rates: [6420, 4330], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '30天签证依次约5,040／6,420比索，之后每次4,330比索；59天签证从6,420比索起。学校有时把两次续签合并办理，费用更低，以实际办理为准。', sortOrder: 3 }),
  fee({ id: 'management', name: '管理费', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: `约每月1,000比索；${MONTHLY}`, sortOrder: 4 }),
  fee({ id: 'water', name: '水费', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: `约每月1,000比索；${MONTHLY}`, sortOrder: 5 }),
  fee({ id: 'electricity', name: '电费', amount: 3000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: `约每月3,000比索，按实际用量结算；${MONTHLY}`, sortOrder: 6 }),
  fee({ id: 'student-id', name: 'MK学生证', amount: 300, billingRule: 'once', includeInTotal: true, note: '一次性费用。', sortOrder: 7 }),
  fee({ id: 'books', name: '教材费', amount: 500, billingRule: 'optional', includeInTotal: false, note: '每本约500比索，按所上课程实际购买。', sortOrder: 8 }),
  fee({ id: 'pickup', name: '机场接机', amount: 1700, secondaryAmount: 4000, secondaryLabel: '卡利博机场', billingRule: 'optional', includeInTotal: false, note: '按同车人数计总价：伊洛伊洛机场1–4人1,700／2,550／3,400／4,250比索，卡利博机场1–4人4,000／6,000／8,000／10,000比索。', sortOrder: 9 }),
  fee({ id: 'deposit', name: '房间押金', amount: 5000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '约合100美元，另收钥匙押金150比索；结业退房后退还。', sortOrder: 10 }),
  fee({ id: 'laundry', name: '洗衣券', amount: 150, billingRule: 'optional', includeInTotal: false, note: '每次最多洗8公斤。', sortOrder: 11 }),
];

/** Dormitory deductions of the 2027 notice for 1–7 weeks (dollars); from 8 weeks it is 150 per week (a 3-bed room is free). */
export const MK_DORM_2027_DEDUCTIONS: Readonly<Record<string, number>> = {
  '1': 48, '2': 210.6, '3': 346.8, '4': 444, '5': 615, '6': 783, '7': 966,
};

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: 'mk-sida-90', name: '思达启航折扣', description: '课程费和住宿费享9折', sortOrder: 0, ruleKind: MK_SIDA_RULE,
    discountType: 'percentage', discountValue: 10,
  }),
  promotion({
    id: 'mk-half-price-2026', name: '2026年学费住宿半价', sortOrder: 1, ruleKind: MK_HALF_PRICE_RULE,
    description: '2026/02/01–12/31抵达，学费和住宿费半价：报N周只付一半周数的价格（如4周付2周、5周付3周、8周付4周）',
    arrivalStart: '2026-02-01', arrivalEnd: '2026-12-31',
  }),
  promotion({
    id: 'mk-dorm-2027', name: '2027年住宿优惠', sortOrder: 2, ruleKind: MK_DORM_2027_RULE,
    description: '2027/01/01–12/31抵达，同时报课程和宿舍：读满8周三人间住宿免费，单人间、双人间只付与三人间的差价；不满8周按学校公布的住宿特价',
    appliesTo: 'accommodation', discountType: 'per-course-week', discountValue: 150,
    discountTiers: { ...MK_DORM_2027_DEDUCTIONS },
    arrivalStart: '2027-01-01', arrivalEnd: '2027-12-31',
  }),
  promotion({
    id: MK_RETURNING_RULE_ID, name: '老学员返校', description: '老学员返校免收一次性注册费。', sortOrder: 3,
    discountType: 'none', appliesTo: 'school-total', waiveRegistration: true,
  }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留时间预估；按菲律宾移民局规定，中国大陆、中国台湾和中国香港学员的签证相关费用可能不同。管理费、水费和电费学校按月收取。停留时间较长时，可能还要办理CRTV（1,800比索）和ECC（1,500比索），学校会按移民局规定通知。';

export const createDefaultMkContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  // The shared schoolCode list lives in the locked CIA folder; the page only compares the code with its own.
  schoolCode: MK_SCHOOL_CODE as CiaContentConfig['schoolCode'],
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
    courseTableTitle: 'MK 2027年4周课程费',
    courseTableNote: '每节课45分钟，课程费按4周计算；4周及以上按每周均价计，1–3周按4周价格的40%／65%／85%计。2027年价格与2026年相同。',
    groupClassNote: '1:5小组课每班最多5人。',
    roomTableTitle: 'MK 2027年4周住宿费',
    roomTableNote: '同时报课程和宿舍才提供一日三餐，不吃也不退餐费。四人间只接受家庭或团体入住。',
    stayPolicyTitle: 'MK 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '周六较难安排接机，建议周日抵达；课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '课程结束后的周六', note: '提前入住或延住须先由顾问向学校确认。' },
    ],
    extraNightRates: [],
  } as CiaQuoteSettings,
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
    footerNotes: ['到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

/** An MK content document (default or published revision). */
export function isMkContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && (content.schoolCode as string) === MK_SCHOOL_CODE
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

export const cloneMkContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultMkContentConfig();
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= copyJson(defaults.quoteSettings.extraNightRates);
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  clone.media ??= [];
  return clone;
};
