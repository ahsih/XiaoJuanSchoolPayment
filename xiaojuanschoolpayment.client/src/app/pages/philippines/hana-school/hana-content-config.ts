// HANA Academy's content document: courses, rooms, local fees, offers and quote-image copy, from the
// school's 2026–2027 price list, promotion brochures and its confirmed message of 2026-11-23. The public
// page (hana-school-page.component.ts), its calculator (hana-page-quote.ts), the local-fee table and the
// quote image all read it. HANA is not in the employee editor yet, so these compiled defaults are the
// only price source. Keep it pure data (no Angular, DOM or storage).
import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import { upgradeAcrNotes } from '../acr-first-extension';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Peak seasons (school message 2026-11-23). There is no peak surcharge: the listed prices are peak prices,
 * and only weeks outside these ranges get the low-season discount. A week belongs to the season of its
 * Wednesday, as in the school's own calculator.
 */
export const HANA_PEAK_SEASONS: ReadonlyArray<{ start: string; end: string; label: string }> = [
  { start: '2026-06-28', end: '2026-08-29', label: '2026年暑期旺季' },
  { start: '2027-01-03', end: '2027-02-27', label: '2027年寒假旺季' },
  { start: '2027-06-27', end: '2027-08-28', label: '2027年暑期旺季' },
];

/** Study dates of the “付4周读8周” offer: Sunday arrival to Saturday departure. */
export const HANA_BIG_PROMO_WINDOWS: ReadonlyArray<{ start: string; end: string }> = [
  { start: '2026-08-30', end: '2027-01-02' },
  { start: '2027-02-28', end: '2027-06-26' },
];

/**
 * The school raises 2027 tuition from 2027-01-01; students who pay tuition in full by 2026-12-31 keep these
 * prices. From that day the quote stops until the new price list arrives.
 */
export const HANA_CURRENT_PRICES_PAY_BY = '2026-12-31';

export const HANA_LIGHT_ESL_ID = 'light-esl';
export const HANA_SENIOR_ID = 'senior';
export const HANA_NO_CLASS_ID = 'parent-no-class';
export const HANA_GOLF_IDS: readonly string[] = ['golf-leisure', 'golf-intensive'];
export const HANA_JUNIOR_IDS: readonly string[] = ['junior-a', 'junior-b', 'junior-c'];
export const HANA_KINDER_IDS: readonly string[] = ['kinder-half', 'kinder-full'];
export const HANA_CAMP_IDS: readonly string[] = ['camp-a', 'camp-b'];
export const HANA_GUARDIAN_IDS: readonly string[] = ['guardian', 'guardian-light', HANA_NO_CLASS_ID];
/** Adult courses: adults live in single or double rooms (school rule), or a family room with their children. */
export const HANA_ADULT_IDS: readonly string[] = [
  HANA_LIGHT_ESL_ID, 'general-esl', 'native-esl', 'native-only', 'toeic', 'ielts', ...HANA_GOLF_IDS, HANA_SENIOR_ID,
];

export const HANA_SINGLE_ROOM_ID = 'single';
export const HANA_DOUBLE_ROOM_ID = 'double';
export const HANA_TRIPLE_ROOM_ID = 'triple';
export const HANA_SENIOR_COUPLE_ROOM_ID = 'senior-couple';
export const HANA_FAMILY_ROOM_IDS: readonly string[] = ['family-2', 'family-3', 'family-4', 'family-5'];
/** The two-person family room is let only in these months; in January, February, July and August it needs 3+ people. */
export const HANA_FAMILY_2_MONTHS: readonly number[] = [3, 4, 5, 6, 9, 10, 11, 12];

/** Junior Camp, an all-inclusive package priced per week by season (school calculator rules). */
export const HANA_CAMP_RATES = {
  'camp-a': { low: 500, peak: 700, extraLow: 400, extraPeak: 600 },
  // Camp B has no extra-week rate of its own: weeks after the fourth cost its 4-week price ÷ 4 (user decision 2026-11-24).
  'camp-b': { low: 525, peak: 725, extraLow: 525, extraPeak: 725 },
} as const;
/** The camp's twin room is part of the package; it is a quote choice only, never on the room price list. */
export const HANA_CAMP_ROOM = { id: 'camp-twin', name: '营地双人间（已含在营地费用内）', fee: 0, note: '青少年英语营的2人一间宿舍，含三餐和24小时监护。' };

/** Weekly utility and electricity per person (pesos); family rooms are per room and split by the people in it. */
export const HANA_ROOM_WEEKLY_FEES: Readonly<Record<string, { utility: number; electricity: number; people: number }>> = {
  single: { utility: 750, electricity: 450, people: 1 },
  double: { utility: 625, electricity: 300, people: 1 },
  triple: { utility: 500, electricity: 200, people: 1 },
  'family-2': { utility: 1125, electricity: 600, people: 2 },
  'family-3': { utility: 1375, electricity: 600, people: 3 },
  'family-4': { utility: 1625, electricity: 600, people: 4 },
  'family-5': { utility: 1875, electricity: 600, people: 5 },
};

/** Low-season discount on tuition and room by the number of low-season weeks; senior courses always 10%. */
export const hanaLowSeasonRate = (courseId: string, lowWeeks: number): number => {
  if (courseId === HANA_SENIOR_ID) return 10;
  if (HANA_CAMP_IDS.includes(courseId) || lowWeeks <= 0) return 0;
  return lowWeeks <= 7 ? 10 : lowWeeks <= 11 ? 11.5 : lowWeeks <= 15 ? 13 : 14.5;
};

/** “付4周读8周”: share of the 4-week Light ESL + double room price paid for this many study weeks. */
export const hanaBigPromoRatio = (studyWeeks: number): number => {
  const table: Record<number, number> = { 1: 0.26, 2: 0.4, 3: 0.54, 4: 0.65, 5: 0.76, 6: 0.85, 7: 0.93, 8: 1 };
  return studyWeeks <= 0 ? 0 : studyWeeks <= 8 ? table[studyWeeks] ?? 0 : 1 + (studyWeeks - 8) * 0.125;
};

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder, ...extra,
});

const room = (id: string, name: string, group: string, fee: number, note: string, sortOrder: number): CiaRoomContent => ({
  id, name, label: name, code: '', location: '校内', group, fee, note, enabled: true, sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});

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

const createCourses = (): CiaCourseContent[] => [
  course(HANA_LIGHT_ESL_ID, 'Light ESL 轻松英语', 770, '菲师一对一4节 + 菲师小班1节 + 外教小班1节', '第一次游学、想轻松开口的成人', '每天6节课，课量适中，下午有时间复习和活动；淡季可参加“付4周读8周”。', 0),
  course('general-esl', 'General ESL 综合英语', 910, '菲师一对一5节 + 菲师小班1节 + 外教小班1节', '想全面提升听说读写的成人', '每天7节课，学校最受欢迎的课程。', 1),
  course('native-esl', 'Native ESL 菲师＋外教', 1050, '菲师一对一2节 + 外教一对一2节 + 菲师小班1节 + 外教小班1节', '想每天和美国外教一对一练口语的成人', '菲律宾老师打基础，美国外教练地道表达。', 2),
  course('native-only', 'Native Only 外教一对一', 1260, '外教一对一4节 + 外教小班1节', '有一定基础、想全程跟外教学习的成人', '一对一全部由美国外教上。', 3),
  course('toeic', 'TOEIC 托业', 1050, '菲师一对一3节 + 外教一对一1节 + 菲师小班1节 + 外教小班1节（ESL）', '准备托业考试的学生', '每周一次模拟测试。', 4),
  course('ielts', 'IELTS 雅思', 1050, '菲师一对一3节 + 外教一对一1节 + 菲师小班1节 + 外教小班1节（ESL）', '准备雅思考试的学生', '每周一次模拟测试。', 5),
  course('golf-leisure', '高尔夫休闲班', 700, '上午打高尔夫，下午上课：菲师一对一3节 + 菲师小班1节', '想学英语又想打高尔夫的成人', '含步行1分钟的EG GOLF练习场无限练球（平日6:00–22:00）；2周起，没有1周和3周。', 6),
  course('golf-intensive', '高尔夫强化班', 1000, '上午打高尔夫，下午上课：菲师一对一3节 + 菲师小班1节 + 每4周16次高尔夫私教', '想系统练球的高尔夫爱好者', '在休闲班基础上每4周加16次私人教练课；2周起，没有1周和3周。', 7),
  course(HANA_SENIOR_ID, '乐龄课程（50岁以上）', 900, '菲师一对一3节 + 菲师小班1节；周三、周五户外文化课；周六特别行程', '50岁以上、想边旅行边学实用英语的学员', '只在淡季开放，2周起。价格已含当地费用（SSP、水电杂费、电费80度内、接机等），只另付押金；周六行程满6人成行，可能另有费用。', 8, { minimumWeeks: 2 }),
  course('guardian', '家长陪读课程', 600, '菲师一对一3节 + 菲师小班1节', '陪孩子来、自己也想学的家长', '可把部分课程转给孩子上。', 9),
  course('guardian-light', '家长陪读 Light', 400, '菲师一对一2节', '想轻松学一点的陪读家长', '也可以全部转给孩子上。', 10),
  course(HANA_NO_CLASS_ID, '家长不上课（仅淡季）', 0, '不上课，只付住宿费', '只陪孩子、不想上课的家长', '只在淡季可选，不需要办理SSP；旺季家长须报名课程。', 11),
  course('junior-a', 'Junior A 活动型', 1100, '菲师一对一4节 + 菲师小班2节 + 活动课2节', '有家长陪同、喜欢活动的孩子', '到校后可改为Junior B（每4周加100美元）；淡季平日晚上有免费晚间课。', 12),
  course('junior-b', 'Junior B 学业型', 1200, '菲师一对一6节 + 菲师小班1节 + 外教小班1节', '有家长陪同、想多上课的孩子', '含1节美国外教小班；淡季平日晚上有免费晚间课。', 13),
  course('junior-c', 'Junior C 强化型', 1280, '菲师一对一8节', '有家长陪同、想全部上一对一的孩子', '每天8节一对一。', 14),
  course('kinder-half', '幼儿园 半日班', 600, '08:30–12:35 小班课（Nursery 3–4岁、Kinder 5–6岁）', '3岁（满3周岁）到6–7岁的孩子', '师生比1:3；淡季入读不需要办理SSP。', 15),
  course('kinder-full', '幼儿园 全日班', 1100, '08:30–12:35、13:30–16:45 小班课（Nursery 3–4岁、Kinder 5–6岁）', '3岁（满3周岁）到6–7岁的孩子', '师生比1:3；淡季入读不需要办理SSP。', 16),
  course('camp-a', '青少年英语营 A（无家长陪同）', 2000, '菲师一对一4节 + 菲师小班2节 + 活动课2节；2人一间，24小时监护', '7–17岁、独自来读的孩子', '全包：学费、住宿、三餐、当地费用、机场接送和周末活动；淡季4周2,000美元、旺季2,800美元，超过4周淡季每周加400、旺季每周加600美元；第5周起签证续签另付。', 17),
  course('camp-b', '青少年英语营 B（无家长陪同）', 2100, '菲师一对一6节 + 菲师小班1节 + 外教小班1节；2人一间，24小时监护', '7–17岁、独自来读、想多上课的孩子', '营地A的学业型版本，淡季4周2,100美元、旺季2,900美元；超过4周按4周均价每周加525美元（淡季）或725美元（旺季）；第5周起签证续签另付。', 18),
];

const createRooms = (): CiaRoomContent[] => [
  room(HANA_SINGLE_ROOM_ID, '单人间', '标准宿舍', 900, '一人一间，成人可选。', 0),
  room(HANA_DOUBLE_ROOM_ID, '双人间', '标准宿舍', 700, '两人一间；成人室友由学校安排，通常来自不同国家和地区。', 1),
  room(HANA_TRIPLE_ROOM_ID, '三人间', '标准宿舍', 600, '供家长和孩子或青少年入住。', 2),
  room('family-2', '2人家庭房（每人）', '家庭房', 850, '只在3–6月、9–12月开放给2人家庭。', 3),
  room('family-3', '3人家庭房（每人）', '家庭房', 700, '大房间，一家人同住。', 4),
  room('family-4', '4人家庭房（每人）', '家庭房', 600, '大房间，一家人同住。', 5),
  room('family-5', '5人家庭房（每人）', '家庭房', 550, '大房间，一家人同住。', 6),
  room(HANA_SENIOR_COUPLE_ROOM_ID, '乐龄夫妻房（每人）', '乐龄夫妻房', 600, '只供报名乐龄课程的夫妻，两人合计1,200美元／4周。', 7),
];

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特别学习许可', amount: 7500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '停留3周及以上办理；按申请的学习期间签发，最长24周。', sortOrder: 0 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-Card', amount: 4000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP一起办理。', sortOrder: 1 }),
  fee({ id: 'acr-i-card', name: 'ACR I-Card 外国人登记证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次签证续签时办理一次（30天签证第5周起，59天签证第9周起）。', sortOrder: 2 }),
  fee({ id: 'visa-extension', name: '签证续签', amount: 4630, rates: [4630, 5900, 4130, 4130, 4130], tourist59Rates: [5900, 4130, 4130, 4130], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '30天签证：第5–8周4,630比索，第9–12周再加5,900比索，之后每4周4,130比索；59天签证从第9周起按5,900比索起估算。以实际办理为准。', sortOrder: 3 }),
  fee({ id: 'student-id', name: '学生证', amount: 200, billingRule: 'once', includeInTotal: true, note: '一次性费用；附近部分商家凭学生证有5–10%折扣。', sortOrder: 4 }),
  fee({ id: 'utility', name: '水电杂费', amount: 2500, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '含水费、清洁、洗衣、安保、饮用水、泳池和维护；按住宿周数计：单人间每4周3,000、双人间2,500、三人间2,000比索／人，家庭房每间4,500／5,500／6,500／7,500比索（2–5人），按人数平均。', sortOrder: 5 }),
  fee({ id: 'electricity', name: '电费', amount: 1200, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '按住宿周数计：单人间每4周1,800比索；其他房间每间每4周2,400比索，按人数平均。每间每4周含80度，超出每度22比索，从押金结算。', sortOrder: 6 }),
  fee({ id: 'minor-care', name: '未成年人监护照护', amount: 12000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '无家长陪同的青少年（非英语营）每4周12,000比索，按周数计算。', sortOrder: 7 }),
  fee({ id: 'pickup', name: '机场接机', amount: 1000, secondaryAmount: 5500, secondaryLabel: '马尼拉机场', billingRule: 'optional', includeInTotal: false, note: '克拉克机场1,000比索、马尼拉机场5,500比索；家庭同行克拉克1,500、马尼拉6,500比索。请在抵达前至少1周预约。', sortOrder: 8 }),
  fee({ id: 'deposit', name: '宿舍押金', amount: 4000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人4,000比索，家庭房每间5,000比索；退房时扣除超额电费、教材费和损坏赔偿后退还。', sortOrder: 9 }),
  fee({ id: 'books', name: '教材', amount: 300, secondaryAmount: 400, secondaryLabel: '最高', billingRule: 'optional', includeInTotal: false, note: '每本300–400比索，按实际使用购买；第一周内保持干净可退换。', sortOrder: 10 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: 'hana-low-season', name: '淡季长住折扣', sortOrder: 0, ruleKind: 'hana-low-season',
    description: '淡季学习周的课程费和住宿费打折：淡季1–7周减10%、8–11周减11.5%、12–15周减13%、16周以上减14.5%；乐龄课程减10%。旺季周按原价。',
  }),
  promotion({
    id: 'hana-big-promo', name: '付4周读8周大优惠', sortOrder: 1, ruleKind: 'hana-big-promo',
    description: '成人Light ESL + 双人间（家庭课程的家长可住家庭房），付4周1,470美元读8周；2026/08/30–2027/01/02、2027/02/28–06/26就读。不可与淡季折扣同享；课程结束后须发布100词以上英文评价和5张以上照片；名额有限，以学校确认为准。',
  }),
  promotion({
    id: 'hana-returning-registration', name: '老学员返校', sortOrder: 2, waiveRegistration: true, appliesTo: 'school-total',
    description: '老学员返校免收一次性注册费。',
  }),
];

const LOCAL_FEE_INTRO = '以下费用到校后在学校用比索支付，仅供准备现金参考。签证费用按每位学生选择的签证和停留周数预估；水电杂费和电费按住宿周数计算，家庭房按入住人数平均。接机、押金和教材另列在下方。';

export const createDefaultHanaContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  // HANA is not in the schoolCode union, which lives in the locked CIA files (user decision 2026-11-20); add it
  // there when CIA is unlocked. Nothing reads the code for HANA: it has no employee content editor yet.
  schoolCode: 'HANA' as CiaContentConfig['schoolCode'],
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.35, '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'HANA 2026年4周学费',
    courseTableNote: '每节课45分钟，周一至周五上课。价格为旺季价格，淡季学习周按周数自动打折；1–3周为4周价格的35%、65%、85%。2026/12/31前付清学费可保留这些价格。',
    groupClassNote: '小班课每班最多4人；2节菲师小班可免费换成1节一对一。',
    roomTableTitle: 'HANA 2026年4周食宿费',
    roomTableNote: '宿舍在校园内，每间都有空调、WiFi、独立卫浴和书桌；住宿费含平日三餐、周末和假日一餐、每周2次清洁和洗衣。',
    stayPolicyTitle: 'HANA 入住与退房',
    stayPolicies: [
      { label: '入住', value: '周六17:00起可入住', note: '大多数学生周日抵达。' },
      { label: '退房', value: '最后一个周六中午12点前', note: '延住每晚1,500比索（家庭房2,000比索），视空房而定。' },
      { label: '室友', value: '成人住单人间或双人间', note: '双人间室友由学校安排，通常来自不同国家和地区；只有已婚或订婚的情侣可同住。' },
    ],
    extraNightRates: [
      { label: '普通房', amount: 1500 },
      { label: '家庭房', amount: 2000 },
    ],
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
    footerNotes: ['按2026年价格计算，2026/12/31前付清学费可保留此价格。', '到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

export const cloneHanaContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultHanaContentConfig();
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
  // ACR I-Card moved to the first visa extension (user rule 2026-11-24); an untouched old note follows once.
  upgradeAcrNotes(clone, defaults, { 'acr-i-card': ['停留9周及以上办理一次。'] });
  clone.media ??= [];
  return clone;
};
