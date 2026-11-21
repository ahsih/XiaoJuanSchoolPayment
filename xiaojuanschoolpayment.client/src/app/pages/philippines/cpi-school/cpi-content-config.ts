// CPI's versioned employee content document: courses, rooms, local fees, promotions and quote-image copy.
// The public page (cpi-school-page.component.ts), its calculator (cpi-page-quote.ts), the local-fee table
// and the quote image all read the published version of this document. Keep it pure data.
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
 * Raised when saved documents must inherit a school notice once (cloneCpiContentConfig):
 * 1 = 2027 price list, Premium Residence and the 2026-11-04 promotion notice (added 2026-11-21).
 */
export const CPI_POLICY_VERSION = 1;
type CpiQuoteSettings = CiaQuoteSettings & { cpiPolicyVersion?: number };

export const CPI_IELTS_GUARANTEE_ID = 'ielts-guarantee';
export const CPI_JUNIOR_COURSE_ID = 'junior-6-15';
export const CPI_PARENTS_COURSE_ID = 'parents';
export const CPI_PREMIUM_ROOM_IDS: readonly string[] = ['premium-single', 'premium-double'];
/** Rooms the 2027 price list offers with the Junior and Diet (guardian) programs. */
export const CPI_FAMILY_COURSE_ROOM_IDS: readonly string[] = [
  'building-a-double', 'building-a-triple', 'building-b-double-a', 'building-b-double-b',
  'building-b-triple', 'building-b-quad', 'premium-double',
];
/**
 * Premium Residence stays the school accepts (school email, November 2026), as Sunday arrival to
 * Saturday departure: 2026/08/31–2027/01/01 and 2027/03/01–07/02. Later periods are not open yet.
 */
export const CPI_PREMIUM_STAY_WINDOWS: ReadonlyArray<{ start: string; end: string; label: string }> = [
  { start: '2026-08-30', end: '2027-01-02', label: '2026/08/31–2027/01/01' },
  { start: '2027-02-28', end: '2027-07-03', label: '2027/03/01–2027/07/02' },
];

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder, ...extra,
});

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
  discountType: 'per-course-week',
  discountValue: 25,
  appliesTo: 'tuition',
  waiveRegistration: false,
  minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'course',
  ...value,
});

const EXAM_PREP = '4节一对一（考试2节、ESL 2节）+ 2节ESL小组课（1:4）+ 1节团体课（1:8）';
const EXAM_GENERAL = '4节考试一对一 + 2节小组课（1:4，考试与ESL各1节）+ 2节考试团体课';
const EXAM_INTENSIVE = '5节考试一对一 + 2节小组课（1:4，考试与ESL各1节）+ 2节考试团体课';

const createCourses = (): CiaCourseContent[] => [
  course('esl-general-15', '一般英语 ESL GENERAL', 900, '4节一对一 + 2节小组课（1:4）+ 1节团体课（1:8）', '15岁以上、想全面打好英语基础的学生', '听说读写综合提升，适合第一次游学。', 0),
  course('esl-intensive', '密集英语 ESL INTENSIVE', 1020, '5节一对一 + 2节小组课（1:4）+ 1节团体课（1:8）', '想多上一对一、口语提升更快的学生', '比一般英语每天多1节一对一。', 1),
  course('ielts-preparatory', '雅思预备 IELTS PREPARATORY', 950, EXAM_PREP, '雅思基础较弱、想先打基础再备考的学生', '考试课与ESL各占一半。', 2),
  course('ielts-general', '雅思常规 IELTS GENERAL', 1020, EXAM_GENERAL, '已有基础、准备参加雅思考试的学生', '一对一全部为考试课，每天另有2节考试团体课。', 3),
  course('ielts-intensive', '雅思强化 IELTS INTENSIVE', 1070, EXAM_INTENSIVE, '考试日期临近、想加强冲刺的学生', '比雅思常规每天多1节一对一。', 4),
  course(CPI_IELTS_GUARANTEE_ID, '雅思保证班 IELTS GUARANTEE', 1120, EXAM_INTENSIVE, '有明确目标分、能保证出勤的学生', '至少12周；入学分数与目标分见下方保证班说明。', 5, { minimumWeeks: 12 }),
  course('toeic-preparatory', '托业预备 TOEIC PREPARATORY', 950, EXAM_PREP, '托业基础较弱的学生', '考试课与ESL各占一半。', 6),
  course('toeic-general', '托业常规 TOEIC GENERAL', 1020, EXAM_GENERAL, '准备参加托业考试的学生', '一对一全部为考试课。', 7),
  course('toeic-intensive', '托业强化 TOEIC INTENSIVE', 1070, EXAM_INTENSIVE, '想短期冲刺托业分数的学生', '比托业常规每天多1节一对一。', 8),
  course('toeic-guarantee', '托业保证班 TOEIC GUARANTEE', 1120, EXAM_INTENSIVE, '有托业目标分的学生', '入学门槛、目标分数和最低周数报名前向学校确认。', 9),
  course('toefl-preparatory', '托福预备 TOEFL PREPARATORY', 950, EXAM_PREP, '托福基础较弱的学生', '考试课与ESL各占一半。', 10),
  course('toefl-general', '托福常规 TOEFL GENERAL', 1020, EXAM_GENERAL, '准备参加托福考试的学生', '一对一全部为考试课。', 11),
  course('toefl-intensive', '托福强化 TOEFL INTENSIVE', 1070, EXAM_INTENSIVE, '想短期冲刺托福分数的学生', '比托福常规每天多1节一对一。', 12),
  course('toefl-guarantee', '托福保证班 TOEFL GUARANTEE', 1120, EXAM_INTENSIVE, '有托福目标分的学生', '入学门槛、目标分数和最低周数报名前向学校确认。', 13),
  course('esp-bridge', '初级商务英语 ESP BRIDGE', 950, '4节一对一（ESL与商务各2节）+ 2节小组课（1:4）+ 1节团体课（1:8）', '想从基础过渡到职场英语的学生', '面试、会议、邮件等职场场景。', 14),
  course('esp-general', '商务英语 ESP GENERAL', 1020, '4节商务一对一 + 2节小组课（1:4）+ 1节团体课（1:8）', '工作中需要用英语沟通的学生', '面试、会议、谈判与职场写作。', 15),
  course(CPI_JUNIOR_COURSE_ID, '青少年课程 JUNIOR（6–15岁）', 1320, '5节一对一 + 2节小组课（1:4）+ 1节团体课（1:8）', '6–15岁的孩子', '可将1节一对一转给同行家长；可选平日游泳或尤克里里课（每门500比索，满10人开课），晚间有作业辅导和才艺课。', 16),
  course(CPI_PARENTS_COURSE_ID, '家长课程 PARENTS（DIET）', 780, '2节一对一 + 1节小组课（1:4）+ 1节团体课（1:8）', '陪孩子来、自己也想学一点的家长', '课量较轻，方便照顾孩子。', 17),
];

const createRooms = (): CiaRoomContent[] => [
  room('building-a-single', 'A栋单人间', 'A-1', 'A栋', '校内', 1445, '一人一间，安静、隐私好。', 0),
  room('building-a-double', 'A栋双人间', 'A-2', 'A栋', '校内', 960, '两人一间，朋友同行常选。', 1),
  room('building-a-triple', 'A栋三人间', 'A-3', 'A栋', '校内', 840, '三人一间，预算和空间较平衡。', 2),
  room('building-a-quad', 'A栋四人间（上床下桌）', 'A-4', 'A栋', '校内', 770, '四张上床下桌，费用最低。', 3),
  room('building-b-single', 'B栋单人间', 'B-1', 'B栋', '校内', 1595, 'B栋房间更大，只有2间。', 4),
  room('building-b-double-a', 'B栋双人间A', 'B-2A', 'B栋', '校内', 1160, '两张加大床。', 5),
  room('building-b-double-b', 'B栋双人间B', 'B-2B', 'B栋', '校内', 1110, '两张单人床。', 6),
  room('building-b-triple', 'B栋三人间', 'B-3', 'B栋', '校内', 950, 'B栋三人房。', 7),
  room('building-b-quad', 'B栋家庭房（3张床）', 'B-4', 'B栋', '校内', 890, '仅限家庭：1张加大床和2张单人床。', 8),
  room('building-b-six', 'B栋六人间（女生）', 'B-6', 'B栋', '校内', 770, '仅限女生，带客厅。', 9),
  room('premium-single', 'Premium单人间', 'P-1', 'Premium公寓', '校外', 1595, '校外酒店式公寓，距学校约3分钟车程；限10间。', 10),
  room('premium-double', 'Premium双人间', 'P-2', 'Premium公寓', '校外', 1160, '校外酒店式公寓，适合夫妻、亲子或朋友；限10间。', 11),
];

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取；按报名学习时长办理，续费及换校需重新办理。', sortOrder: 0 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP同时办理，只收一次。', sortOrder: 1 }),
  fee({ id: 'acr-i-card', name: 'ACR-I CARD 外国人身份证', amount: 4500, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '旅游签证首次续签时计入一次（30天签证约第5周、59天签证约第9周起）；以实际办理为准。', sortOrder: 2 }),
  fee({ id: 'arp', name: 'ARP外国人登记', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '旅游签证首次续签或长期签证时计入一次。', sortOrder: 3 }),
  fee({ id: 'management', name: '管理费', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '教学楼及其他设施维护费，不足4周按4周计算。', sortOrder: 4 }),
  fee({ id: 'water', name: '水费', amount: 1500, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周计费，不足4周按4周计算。', sortOrder: 5 }),
  fee({ id: 'electricity', name: '基本电费', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '超出用量按房型每千瓦时另收：单人20、双人15、三人10、四人8、六人6比索，从押金结算。', sortOrder: 6 }),
  fee({ id: 'visa-extension', name: '签证续签', amount: 5140, rates: [5140, 6410, 4440], tourist59Rates: [6410, 4440], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '30天签证依次约5,140／6,410／4,440比索，59天签证从6,410比索起，之后每次约4,440比索；以实际办理为准。', sortOrder: 7 }),
  fee({ id: 'books', name: '教材费', amount: 2000, billingRule: 'per-course-period', periodWeeks: 8, rounding: 'ceil', includeInTotal: true, note: '每本约400比索，按每8周约2,000比索预估；按实际购买结算。', sortOrder: 8 }),
  fee({ id: 'student-id', name: '学生证', amount: 350, billingRule: 'once', includeInTotal: true, note: '一次性费用。', sortOrder: 9 }),
  fee({ id: 'pickup', name: '宿务机场接机', amount: 1000, secondaryAmount: 1500, secondaryLabel: '平日', billingRule: 'optional', includeInTotal: false, note: '周末1,000比索、平日1,500比索；每人计费，可能需等候同批学生。', sortOrder: 10 }),
  fee({ id: 'deposit', name: '房间押金', amount: 3000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人收取；超出的电费从押金结算，无损坏、无欠费时退还。', sortOrder: 11 }),
  fee({ id: 'laundry', name: '加急洗衣', amount: 200, secondaryLabel: '5公斤／次', billingRule: 'optional', includeInTotal: false, note: '常规洗衣免费；需要加急时另付。', sortOrder: 12 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({ id: 'cpi-sida-90', name: '思达启航折扣', description: '课程费和住宿费享9折', sortOrder: 0, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', coverageTarget: 'none' }),
  promotion({ id: 'cpi-off-season', name: '2026下半年淡季优惠', description: '2026/08/24–2027/01/01期间每个学习周减25美元，不限报名周数', sortOrder: 1, coverageStart: '2026-08-23', coverageEnd: '2027-01-02' }),
  promotion({ id: 'cpi-december', name: '2026年12月特别优惠', description: '2026/11/30–2027/01/01期间每个学习周再减25美元，可与淡季优惠同享', sortOrder: 2, coverageStart: '2026-11-29', coverageEnd: '2027-01-02' }),
  promotion({ id: 'cpi-off-season-2027-h1', name: '2027上半年淡季优惠', description: '2027/02/22–06/04期间每个学习周减25美元，不限报名周数', sortOrder: 3, coverageStart: '2027-02-21', coverageEnd: '2027-06-05' }),
  promotion({ id: 'cpi-off-season-2027-h2', name: '2027下半年淡季优惠', description: '2027/08/30–12/31期间每个学习周减25美元，不限报名周数', sortOrder: 4, coverageStart: '2027-08-29', coverageEnd: '2028-01-01' }),
  promotion({ id: 'cpi-december-2027', name: '2027年12月特别优惠', description: '2027/11/29–12/31期间每个学习周再减25美元，可与淡季优惠同享', sortOrder: 5, coverageStart: '2027-11-28', coverageEnd: '2028-01-01' }),
  promotion({ id: 'cpi-premium-opening-2026', name: 'Premium公寓开幕优惠', description: '入住Premium公寓每周减25美元（2026/08/31–2027/01/01），可与淡季优惠同享；限10间，先到先得', sortOrder: 6, appliesTo: 'accommodation', eligibleRoomIds: [...CPI_PREMIUM_ROOM_IDS], coverageTarget: 'course-and-accommodation', coverageStart: '2026-08-30', coverageEnd: '2027-01-02' }),
  promotion({ id: 'cpi-premium-opening-2027', name: 'Premium公寓开幕优惠', description: '入住Premium公寓每周减25美元（2027/02/01–07/02），可与淡季优惠同享；限10间，先到先得', sortOrder: 7, appliesTo: 'accommodation', eligibleRoomIds: [...CPI_PREMIUM_ROOM_IDS], coverageTarget: 'course-and-accommodation', coverageStart: '2027-01-31', coverageEnd: '2027-07-03' }),
  promotion({ id: 'cpi-extra-class', name: '限量一对一加课', description: '2027/02/22–03/29开课，前20名每天加1节一对一至课程结束；报名表须注明“One to One promotion”，名额须先向学校确认', sortOrder: 8, discountType: 'none', discountValue: 0, coverageTarget: 'none', arrivalStart: '2027-02-21', arrivalEnd: '2027-03-28' }),
  promotion({ id: 'cpi-extra-class-2027-h2', name: '限量一对一加课', description: '2027/08/30–09/20开课，前20名每天加1节一对一至课程结束；报名表须注明“One to One promotion”，名额须先向学校确认', sortOrder: 9, discountType: 'none', discountValue: 0, coverageTarget: 'none', arrivalStart: '2027-08-29', arrivalEnd: '2027-09-19' }),
  promotion({ id: 'cpi-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', sortOrder: 10, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, coverageTarget: 'none' }),
];

const LOCAL_FEE_INTRO = '以下费用由学校、移民局及相关部门收取，到校后用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留时间预估；教材按每8周约2,000比索预估；管理费、水费和基本电费不足4周按4周计算。请准备2张5.1×5.1厘米、白底的美签规格照片。';

const createExtraNightRates = () => [
  { label: '单人间', amount: 2000 },
  { label: '双人间', amount: 1800 },
  { label: '三人间', amount: 1500 },
  { label: '四人间', amount: 1200 },
];

export const createDefaultCpiContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'CPI',
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.375, '2': 0.65, '3': 0.9 },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'CPI 2027年4周课程费',
    courseTableNote: '以下为周一至周五的每日课程安排，课程费按4周计算。2027年价格与2026年相同；具体课表及节假日安排以学校确认为准。',
    groupClassNote: '1:4小组课每班3–5人，1:8团体课每班5–9人。',
    roomTableTitle: 'CPI 2027年4周住宿费',
    roomTableNote: 'Premium公寓是校外酒店式公寓，电费和管理费按到校学杂费另收。单人间、家庭房和Premium公寓房间少，建议先让顾问确认空房。',
    stayPolicyTitle: 'CPI 入住与管理提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '课程结束后的周六中午前', note: '延住或提前入住按晚另付，见下方额外住宿费用。' },
      { label: '管理模式', value: '半斯巴达（可选斯巴达）', note: '斯巴达学生周一至周四不能外出；门禁与外出规定以学校当期通知为准。' },
    ],
    extraNightRates: createExtraNightRates(),
    cpiPolicyVersion: CPI_POLICY_VERSION,
  } as CpiQuoteSettings,
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

/** The English names and schedules saved before version 1, so only untouched rows are renamed. */
const OLD_COURSE_NAMES: Record<string, string> = {
  'esl-general-15': 'ESL GENERAL（15岁以上）', 'esl-intensive': 'ESL INTENSIVE',
  'toeic-preparatory': 'TOEIC PREPARATORY', 'toefl-preparatory': 'TOEFL PREPARATORY', 'ielts-preparatory': 'IELTS PREPARATORY',
  'toeic-general': 'TOEIC GENERAL', 'toefl-general': 'TOEFL GENERAL', 'ielts-general': 'IELTS GENERAL',
  'toeic-intensive': 'TOEIC INTENSIVE', 'toefl-intensive': 'TOEFL INTENSIVE', 'ielts-intensive': 'IELTS INTENSIVE',
  'ielts-guarantee': 'IELTS GUARANTEE', 'toefl-guarantee': 'TOEFL GUARANTEE', 'toeic-guarantee': 'TOEIC GUARANTEE',
  'junior-6-15': 'JUNIOR（6-15岁）', parents: 'PARENTS', 'esp-bridge': 'ESP BRIDGE', 'esp-general': 'ESP GENERAL',
};
const OLD_ROOM_LABELS: Record<string, string> = {
  'building-a-quad': 'A栋四人间（上下铺）', 'building-b-quad': 'B栋四人间（3张床）', 'building-b-six': 'B栋六人间',
};
/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';
/** Image copy saved before version 1: filler lines CIA's template leaves out, and the older alumni line. */
const OLD_IMAGE_COPY = {
  paymentNotes: { course: '按所选课程、周数及日期计算', accommodation: '按所选房型、周数及日期计算', promotion: '优惠按当前有效规则自动计算' } as Record<string, string>,
  alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
  footerNote: '课程、住宿和优惠按当前选择及有效规则计算。',
};
/** Replaces only image lines nobody has edited since they were the defaults. */
function upgradeCpiImageCopy(settings: CiaContentConfig['quoteImageSettings']): void {
  const notes = settings.paymentNotes as unknown as Record<string, string>;
  for (const [key, old] of Object.entries(OLD_IMAGE_COPY.paymentNotes)) {
    if (notes[key] === old) notes[key] = '';
  }
  if (settings.alumniBenefitText === OLD_IMAGE_COPY.alumniBenefitText) settings.alumniBenefitText = ALUMNI_BENEFIT_TEXT;
  settings.footerNotes = settings.footerNotes.filter(note => note !== OLD_IMAGE_COPY.footerNote);
}
/** The older note under the course list; the junior room rule now sits in the junior course note. */
const OLD_GROUP_CLASS_NOTES = ['青少年课程（6–15岁）可将1节一对一转给家长，可部分周期转课。'];
/** Promotions the 2026-11-04 notice replaced; saved copies are swapped for the new defaults once. */
const REPLACED_PROMOTION_IDS = ['cpi-off-season', 'cpi-december', 'cpi-extra-class'];

/** Brings a document saved before the 2027 notice onto it, keeping every other employee edit. */
function upgradeCpiPolicy(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as CpiQuoteSettings;
  if ((settings.cpiPolicyVersion ?? 0) >= CPI_POLICY_VERSION) return;
  const defaultCourses = new Map(defaults.courses.map(item => [item.id, item]));
  for (const item of clone.courses ?? []) {
    const fresh = defaultCourses.get(item.id);
    if (!fresh) continue;
    if (item.name === OLD_COURSE_NAMES[item.id]) {
      item.name = fresh.name;
      item.schedule = fresh.schedule;
      item.suitable = fresh.suitable;
      item.note = fresh.note;
    }
    if (fresh.minimumWeeks) item.minimumWeeks ??= fresh.minimumWeeks;
  }
  const defaultRooms = new Map(defaults.rooms.map(item => [item.id, item]));
  for (const item of clone.rooms ?? []) {
    const fresh = defaultRooms.get(item.id);
    if (fresh && OLD_ROOM_LABELS[item.id] && item.label === OLD_ROOM_LABELS[item.id]) {
      Object.assign(item, { name: fresh.name, label: fresh.label, note: fresh.note });
    }
  }
  for (const id of CPI_PREMIUM_ROOM_IDS) {
    if (!clone.rooms.some(item => item.id === id)) clone.rooms.push(copyJson(defaultRooms.get(id)!));
  }
  const promotions = settings.promotions.filter(rule => !REPLACED_PROMOTION_IDS.includes(rule.id));
  for (const rule of defaults.quoteSettings.promotions) {
    if (!promotions.some(item => item.id === rule.id)) promotions.push(copyJson(rule));
  }
  settings.promotions = promotions.sort((a, b) => a.sortOrder - b.sortOrder);
  const defaultFees = new Map(defaults.localFees.map(item => [item.id, item]));
  for (const rule of clone.localFees ?? []) {
    const fresh = defaultFees.get(rule.id);
    if (!fresh) continue;
    if (rule.id === 'visa-extension') {
      rule.rates = [...fresh.rates!];
      rule.tourist59Rates = [...fresh.tourist59Rates!];
    }
    if (['acr-i-card', 'electricity', 'visa-extension', 'books', 'pickup', 'deposit', 'laundry', 'management'].includes(rule.id)) {
      Object.assign(rule, { name: fresh.name, note: fresh.note, secondaryLabel: fresh.secondaryLabel });
    }
  }
  settings.extraNightRates = createExtraNightRates();
  if (OLD_GROUP_CLASS_NOTES.includes(settings.groupClassNote)) settings.groupClassNote = defaults.quoteSettings.groupClassNote;
  settings.cpiPolicyVersion = CPI_POLICY_VERSION;
}

/** A CPI content document (default or published revision), as the mini program's calculator checks it. */
export function isCpiContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === 'CPI'
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

export const cloneCpiContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultCpiContentConfig();
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
  const upgrading = ((clone.quoteSettings as CpiQuoteSettings).cpiPolicyVersion ?? 0) < CPI_POLICY_VERSION;
  upgradeCpiPolicy(clone, defaults);
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  clone.quoteImageSettings.footerNotes = clone.quoteImageSettings.footerNotes.map(note => note.replace(/思达游学/g, '思达启航'));
  if (upgrading) upgradeCpiImageCopy(clone.quoteImageSettings);
  clone.media ??= [];
  return clone;
};
