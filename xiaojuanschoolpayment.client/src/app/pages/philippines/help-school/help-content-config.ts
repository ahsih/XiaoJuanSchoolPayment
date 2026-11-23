// HELP Clark's content document: courses, rooms, local fees, offers and quote-image copy. The public page
// (help-school-page.component.ts), its calculator (help-page-quote.ts), the local-fee table and the quote image
// all read it. Keep it pure data. Sources: the school's Google Drive pack received 2026-11-24 (2026 price list,
// Clark local-fee sheet, 2026 second-half off-season offer, admission calendar, pickup sheet, Clark handbook,
// family camp and junior camp brochures); see docs/help-clark-source-2026-11-24.md. Only the Clark campus is
// covered; HELP's Baguio campuses are separate schools.
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** Not in the CIA school-code union: HELP Clark has no employee editor yet. */
export const HELP_SCHOOL_CODE = 'HELP-CLARK' as CiaContentConfig['schoolCode'];

export const HELP_SIDA_RULE_ID = 'help-sida-95';
export const HELP_OFF_SEASON_RULE_ID = 'help-off-season-2026';
export const HELP_SNS_RULE_ID = 'help-sns-2026';
export const HELP_REGISTRATION_RULE_ID = 'help-registration-8-weeks';
export const HELP_RETURNING_RULE_ID = 'help-returning-registration';

/** Family camp courses; a family with a child under 18 takes only these (no adult course for the parent). */
export const HELP_FAMILY_COURSE_IDS: readonly string[] = ['family-guardian', 'family-kindergarten', 'family-kid-1', 'family-kid-2'];
export const HELP_KINDERGARTEN_ID = 'family-kindergarten';

/** The special management fee for a 15–17-year-old on an adult course in the off-season (school FAQ), once. */
export const HELP_MINOR_MANAGEMENT_FEE = 200;

/**
 * Sunday arrivals of the 2026 admission calendar (every second Sunday; classes start the next day).
 * The 2027 calendar has not been supplied.
 */
export const HELP_ARRIVAL_DATES_2026: readonly string[] = Array.from({ length: 26 }, (_, index) =>
  new Date(Date.UTC(2026, 0, 4 + index * 14)).toISOString().slice(0, 10));

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
): CiaCourseContent => ({ id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder });

const room = (id: string, name: string, code: string, group: string, fee: number, note: string, sortOrder: number): CiaRoomContent =>
  ({ id, name, label: name, code, location: '校内', group, fee, note, enabled: true, sortOrder });

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

// Class lines from the Clark curriculum (每节40分钟). 早读课 is the Morning Reading Class (MRC), 特别课 the Special Class.
const EXTRA_LINE = '早读课和特别课各1节；另有每天的单词测试和晚自习';
const EXAM_LINE = `4节一对一 + 2节小组课 + ${EXTRA_LINE}`;

const createCourses = (): CiaCourseContent[] => [
  course('esl', 'ESL 综合英语', 900, `4节一对一 + 2节小组课 + ${EXTRA_LINE}`, '想全面打好听说读写基础的成人', '共9个级别，每4周一次级别测试。', 0),
  course('esl-intensive', 'ESL Intensive 密集综合英语', 1050, `5节一对一 + 2节小组课 + ${EXTRA_LINE}`, '想多上一对一、进步更快的成人', '比ESL每天多1节一对一。', 1),
  course('business', '商务英语 Business English', 1050, `5节一对一 + ${EXTRA_LINE}`, '工作中需要用英语沟通的学生', '入学英语约托业500分。', 2),
  course('ielts-basic', '雅思 IELTS（基础·中级）', 1050, EXAM_LINE, '准备雅思考试、基础一般的学生', '入学约雅思3.5（基础）／4.5（中级）；每4周模考一次。入学低于3.0分须先读4周ESL。', 3),
  course('ielts-advanced', '雅思 IELTS（高级）', 1150, EXAM_LINE, '想冲刺高分的雅思学生', '入学约雅思5.5；每2周模考一次。', 4),
  course('toeic-basic', '托业 TOEIC（基础·中级）', 1050, EXAM_LINE, '准备托业考试的学生', '入学约托业350（基础）／500（中级）；每4周模考一次。', 5),
  course('toeic-advanced', '托业 TOEIC（高级）', 1150, EXAM_LINE, '想冲刺托业高分的学生', '入学约托业750；每2周模考一次。', 6),
  course('family-guardian', '亲子营·家长课程', 1000, '5节一对一（听力1、阅读1、写作1、口语2）+ 早读课和特别课', '陪孩子来、自己也想学英语的家长', '和孩子一起报名；家长最多可把3节课转给孩子，到校前一周申请。', 7),
  course('family-kindergarten', '亲子营·幼儿园（GIS国际学校）', 1000, '在校内的GIS国际幼儿园上课，08:30–14:00，每班10–15人', '3–6岁、和家长一起来的孩子', '随时可以入学；活动材料费每月500比索，到校另付。', 8),
  course('family-kid-1', '亲子营·孩子 方案1', 1000, '5节一对一', '7岁以上、和家长一起来的孩子', '须家长陪读。', 9),
  course('family-kid-2', '亲子营·孩子 方案2', 1400, '4节一对一 + 2节小组课（发音、听力）+ 2节活动课 + 2节演讲与美术；含晚上写作和单词课', '10岁以上、和家长一起来的孩子', '须家长陪读；孩子满10岁时，家长可免费参加早读课、特别课和单词测试。', 10),
];

const ROOM_NOTE = '照片为学校2026年提供的新房间实拍，具体房间以学校安排为准。';

const createRooms = (): CiaRoomContent[] => [
  room('room-1', '单人间', 'R-1', '单人间', 1030, '一人一间，数量少，需尽早确认。', 0),
  room('room-2', '双人间', 'R-2', '多人间', 780, `两张单人床，房内有卫生间。${ROOM_NOTE}`, 1),
  room('room-3', '三人间', 'R-3', '多人间', 680, `三张单人床，房内有卫生间。${ROOM_NOTE}`, 2),
  room('room-4', '四人间', 'R-4', '多人间', 600, `四张单人床，房内有卫生间。${ROOM_NOTE}`, 3),
];

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'visa-extension', name: '签证续签', amount: 4940, rates: [4940, 6210, 4240], tourist59Rates: [6210, 4210], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '30天签证依次4,940／6,210／4,240比索，之后每次4,240；59天签证第1次6,210，之后每次4,210；以实际办理为准。', sortOrder: 0 }),
  fee({ id: 'ssp', name: 'SSP特别学习许可', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学时办理。', sortOrder: 1 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP一起办理，只收一次。', sortOrder: 2 }),
  fee({ id: 'acr-i-card', name: 'ACR I-CARD', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次续签时办理一次。', sortOrder: 3 }),
  fee({ id: 'books', name: '教材费', amount: 1700, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周一套，不足4周按4周计。', sortOrder: 4 }),
  fee({ id: 'id-card', name: '学生证', amount: 200, billingRule: 'once', includeInTotal: true, note: '入学时办理一次。', sortOrder: 5 }),
  fee({ id: 'water', name: '水费', amount: 250, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '按住宿周数每周收取。', sortOrder: 6 }),
  fee({ id: 'electricity', name: '电费', amount: 250, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每周预收250比索，按每度15比索结算、同房间平分，多退少补。', sortOrder: 7 }),
  fee({ id: 'laundry', name: '洗衣费', amount: 250, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '按住宿周数每周收取；每4周可洗16公斤。', sortOrder: 8 }),
  fee({ id: 'maintenance', name: '宿舍维护费', amount: 250, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '按住宿周数每周收取。', sortOrder: 9 }),
  fee({ id: 'kindergarten-materials', name: '幼儿园活动材料费', amount: 500, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '学校每月收取500比索，这里按每4周一次预估。', sortOrder: 10 }),
  fee({ id: 'deposit', name: '押金（可退）', amount: 3000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '到校时缴纳，无损坏、无欠费时在最后一周周五17:00后退还。', sortOrder: 11 }),
  fee({ id: 'pickup-manila', name: '马尼拉机场接机', amount: 5500, billingRule: 'optional', includeInTotal: false, note: '单独接机每人5,500比索；2–3人同行每人2,800，4人以上每人1,700。', sortOrder: 12 }),
  fee({ id: 'pickup-clark', name: '克拉克机场接机', amount: 1000, billingRule: 'optional', includeInTotal: false, note: '单独接机每人1,000比索；2人以上每人600。', sortOrder: 13 }),
];

const OFF_SEASON_WINDOW = { arrivalStart: '2026-08-16', arrivalEnd: '2026-12-06' } as const;

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: HELP_OFF_SEASON_RULE_ID, name: '2026下半年淡季优惠', sortOrder: 0, ruleKind: 'per-complete-four-weeks', discountValue: 100,
    description: '2026/08/17–12/07期间开课，每读满4周减100美元', ...OFF_SEASON_WINDOW,
  }),
  promotion({
    id: HELP_SNS_RULE_ID, name: 'SNS优惠', sortOrder: 1, ruleKind: 'per-complete-four-weeks', discountValue: 200,
    description: '2026/08/17–12/07期间开课，每读满4周减200美元；每4周在个人社交平台发2篇文章并@学校，把链接交给学校', ...OFF_SEASON_WINDOW,
  }),
  promotion({
    id: HELP_REGISTRATION_RULE_ID, name: '淡季读8周以上免注册费', sortOrder: 2, discountType: 'none', waiveRegistration: true, minimumCourseWeeks: 8,
    description: '2026/08/17–12/07期间开课、读8周以上，免注册费', ...OFF_SEASON_WINDOW,
  }),
  promotion({
    id: HELP_SIDA_RULE_ID, name: '思达启航折扣', sortOrder: 3, discountType: 'percentage', discountValue: 5,
    description: '课程费和住宿费扣除学校优惠后再享95折',
  }),
  promotion({
    id: HELP_RETURNING_RULE_ID, name: '老学员返校', sortOrder: 4, discountType: 'none', appliesTo: 'school-total', waiveRegistration: true,
    description: '老学员返校免收一次性注册费。',
  }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留时间预估；水费、电费、洗衣费和宿舍维护费按住宿周数每周收取，电费按实际用量多退少补；教材每4周一套。押金和接机另付，不计入合计。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultHelpContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: HELP_SCHOOL_CODE,
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.8 },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'HELP 克拉克 4周课程费',
    courseTableNote: '课程费按4周计算；1–3周按4周价的40%、65%、80%计算。2027年价格学校尚未公布，暂按2026年价格预估。',
    groupClassNote: '每节课40分钟；小组课为1:4–5。',
    roomTableTitle: 'HELP 克拉克 4周住宿费',
    roomTableNote: '全部是校内宿舍；按周日入住、周六退房计算。',
    stayPolicyTitle: 'HELP 克拉克入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '开课日前一天（周日）12:00后', note: '学校按固定开课日入学，2026年每两周一次。' },
      { label: '退房日期', value: '课程结束后的周六12:00前', note: '押金在最后一周周五17:00后退还。' },
      { label: '提前入住或延住', value: '每晚2,000比索', note: '须提前向学校申请，按空房安排。' },
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
    footerNotes: ['到校费用、签证与教材按实际发生和学校最新政策确认。', '2027年价格学校尚未公布，暂按2026年价格预估；最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

/** A HELP Clark content document (default or published revision). */
export function isHelpContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === HELP_SCHOOL_CODE
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

/** Fills a saved document up to the current schema; there is no older HELP Clark document to upgrade. */
export const cloneHelpContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultHelpContentConfig();
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
