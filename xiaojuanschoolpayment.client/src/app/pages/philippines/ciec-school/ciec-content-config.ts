// CIEC's content document: courses, rooms, local fees, promotions and quote-image copy, from the school's
// 2027 pack (price list v.270101, the 2027 low-season notice, the 2027 Chinese brochure and the entry guide,
// received 2026-11-23). The page (ciec-school-page.component.ts), its calculator (ciec-page-quote.ts), the
// local-fee table and the quote image read this document, or a published revision of it. Keep it pure data.
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

/** CIEC is not in CIA's schoolCode list (a locked file), so the code is cast here. */
export const CIEC_SCHOOL_CODE = 'CIEC' as CiaContentConfig['schoolCode'];

export const CIEC_KINDERGARTEN_ID = 'kindergarten';
export const CIEC_CIDEC_ID = 'cidec';
export const CIEC_GUARDIAN_COURSE_IDS: readonly string[] = ['guardian-esl', 'guardian-business-ielts'];
/** Quote-only choice for a parent who does not study or a child under 4; never in the course list. */
export const CIEC_NO_CLASS_ID = 'none';
/** Courses with ESL group classes, which use copied group-class material (1,000 pesos per 4 weeks). */
export const CIEC_GROUP_CLASS_COURSE_IDS: readonly string[] = ['junior-academic', 'junior-intensive', 'junior-ielts-toefl'];
export const CIEC_DOUBLE_ROOM_ID = 'double';
export const CIEC_TRIPLE_ROOM_ID = 'triple';
/** Four family members sharing one triple room (brochure price list: 4人（可使用3人间）770美元). */
export const CIEC_FAMILY4_ROOM_ID = 'triple-family4';
/**
 * Low season only, when a room is free: a 2-person family (1 parent + 1 child) in a triple room. Each person pays
 * the double-room price plus 200 dollars per 4 weeks; the parent keeps the low-season room price (2026 and 2027 notices).
 */
export const CIEC_FAMILY2_TRIPLE_ROOM_ID = 'triple-family2';
export const CIEC_FAMILY2_UPGRADE_PER_4_WEEKS = 200;

/** One-time CIDEC grade-level tuition, charged once with the first 4-week CIDEC period. */
export const CIEC_CIDEC_GRADE_TUITION = 3000;
/** Guardian fee for Grade 1–12 students without a parent, per 4 weeks. */
export const CIEC_GUARDIAN_FEE_PER_4_WEEKS = 300;
/** Airport pickup, per person, one way (in the school's dollar price list). */
export const CIEC_PICKUP_USD = 20;

/**
 * Low-season offers by study date (Monday to Friday): 2026 notice (Taiwan edition) and the 2027 notice.
 * familyGuardianRoom: a 2-person family's guardian room and board instead of 930 dollars per 4 weeks.
 * guardianCourse: the guardian's one-to-one course price per 4 weeks instead of 700 / 800 dollars.
 * craftClass: 2026 only, a free one-hour craft class for primary-school children.
 */
export interface CiecLowSeasonWindow {
  start: string;
  end: string;
  label: string;
  familyGuardianRoom: number;
  guardianCourse: Record<string, number>;
  craftClass: boolean;
}
export const CIEC_LOW_SEASON_WINDOWS: readonly CiecLowSeasonWindow[] = [
  { start: '2026-08-31', end: '2027-01-01', label: '2026/08/31–2027/01/01', familyGuardianRoom: 300, guardianCourse: { 'guardian-esl': 400, 'guardian-business-ielts': 500 }, craftClass: true },
  { start: '2027-03-01', end: '2027-05-21', label: '2027/03/01–05/21', familyGuardianRoom: 400, guardianCourse: { 'guardian-esl': 400, 'guardian-business-ielts': 500 }, craftClass: false },
  { start: '2027-08-30', end: '2027-12-31', label: '2027/08/30–12/31', familyGuardianRoom: 400, guardianCourse: { 'guardian-esl': 400, 'guardian-business-ielts': 500 }, craftClass: false },
];

/** Promotion ids; the amounts and dates are the constants above, the rules only switch them on or off. */
export const CIEC_PROMOTION_IDS = {
  sida: 'ciec-sida-95',
  soloGuardianFee: 'ciec-low-season-solo',
  family2: 'ciec-low-season-family2',
  family3: 'ciec-low-season-family3',
  guardianCourse: 'ciec-low-season-guardian-course',
  craft: 'ciec-craft-2026',
  returning: 'ciec-returning-registration',
} as const;

/** The Sida 95% comes off the full course and room price first, then the school offers (user rule 2026-11-24:
 * CIEC's files give no order, so the order that is cheaper for the student applies). */
export const CIEC_SIDA_DESCRIPTION = '课程费和住宿费（含CIDEC年级学费）按原价享95折，学校优惠另减';
const CIEC_SIDA_DESCRIPTION_BEFORE = '课程费和住宿费（含CIDEC年级学费）在学校优惠后再享95折';

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder, ...extra,
});

const room = (id: string, name: string, fee: number, note: string, sortOrder: number): CiaRoomContent => ({
  id, name, label: name, code: '', location: '校内', group: 'CIEC校内宿舍', fee, note, enabled: true, sortOrder,
});

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
  appliesTo: 'tuition-and-accommodation',
  waiveRegistration: false,
  minimumCourseWeeks: 4,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'none',
  ...value,
});

const createCourses = (): CiaCourseContent[] => [
  course(CIEC_KINDERGARTEN_ID, '幼儿园课程 KINDERGARTEN', 1050, '3小时小班课 + 1小时午休 + 2节一对一',
    '满4–6岁（48个月起）的孩子，不看英语水平',
    '上午小班课：晨会、体育、讲故事、英语／科学／数学；午休由家长看顾；下午2节一对一（字母与自然拼读、基础读写或听说）。须有家长陪同。', 0),
  course('junior-academic', '青少年学术课程 JUNIOR ACADEMIC', 1100, '4节一对一 + 3节小组课（最多1:7）',
    '小学1年级到高中3年级，想打好英语基础的孩子',
    '一对一练阅读、词汇和写作，小组课练演讲、听力和写作；下午有空堂，可自习或做寒暑假作业。', 1),
  course('junior-intensive', '青少年密集课程 JUNIOR INTENSIVE', 1400, '4节一对一 + 4节小组课（最多1:7）+ 1小时晚自习',
    '小学1年级到高中3年级，想多上课的孩子',
    '比学术课程每天多1节小组课（IEC），晚上18:20–19:55另有小组课和自习。', 2),
  course('junior-ielts-toefl', '青少年雅思／托福 JUNIOR IELTS／TOEFL', 1400, '4节一对一 + 3节英语小组课',
    '英语中级（Intermediate）以上、准备雅思或托福的中学生',
    '一对一练考试的阅读、写作、听力和口语；小组课练听力语法和写作，晚上有模考。', 3),
  course('school-preparation', '入学准备班 SCHOOL PREPARATION', 1400, '6节一对一 + 自习',
    '准备考宿务国际学校、私立学校或海外学校的学生',
    '一对一阅读、数学、科学、英语学科、口语和面试，按目标学校准备入学考试和面试。', 4),
  course('overseas-school', '留学课程 OVERSEAS SCHOOL', 1100, '在宿务国际学校或私立学校上课 + 放学后3小时辅导',
    '在宿务就读国际学校或私立学校、想由CIEC管理生活和课后学习的学生',
    '含CIEC的午餐盒、放学后英语、数学和科学辅导及生活管理；国际学校或私立学校的学费等所有费用另付。', 5),
  course(CIEC_CIDEC_ID, 'CIDEC 学历课程', 1350, '4节一对一 + 3节小组课 + 自习',
    '想在游学期间同时读菲律宾正规学年（1–12年级）的学生',
    '菲律宾教育部认可的12年制学校课程（2000年成立）。另收一次性年级学费3,000美元（含项目材料和课程模块）；毕业费、研究费等按年级另收。至少4周。', 6,
    { minimumWeeks: 4 }),
  course('guardian-esl', '家长英语 GUARDIAN ESL', 700, '3节一对一',
    '陪孩子来的家长（18岁以上）', '读写、口语、词汇和语法，按家长的目标安排。', 7),
  course('guardian-business-ielts', '家长商务／雅思 GUARDIAN BUSINESS／IELTS', 800, '3节一对一',
    '想学商务英语或准备雅思的家长', '商务英语，或雅思阅读、口语、听力和写作一对一。', 8),
];

const ROOM_NOTE = '含工作日三餐、周末两餐，每周2次洗衣和打扫。';
const createRooms = (): CiaRoomContent[] => [
  room(CIEC_DOUBLE_ROOM_ID, '双人间', 930, `两人一间；${ROOM_NOTE}`, 0),
  room(CIEC_TRIPLE_ROOM_ID, '三人间', 850, `三人一间；${ROOM_NOTE}`, 1),
  room(CIEC_FAMILY4_ROOM_ID, '三人间（4人家庭）', 770, `4位家人同住一间三人间时的每人价格，婴幼儿不计人数；${ROOM_NOTE}`, 2),
  room(CIEC_FAMILY2_TRIPLE_ROOM_ID, '三人间（2人家庭升级）', 930 + CIEC_FAMILY2_UPGRADE_PER_4_WEEKS,
    `淡季有空房时，1位家长带1个孩子可以升级住三人间，每人每4周比双人间多${CIEC_FAMILY2_UPGRADE_PER_4_WEEKS}美元，家长的淡季食宿优惠照样有；${ROOM_NOTE}`, 3),
];

const VISA_RATES = [4800, 5800, 5300, 5500, 5500, 4000];
const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 8000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '上课的学生和家长都要办；不上课的家长和婴幼儿不用办。', sortOrder: 0 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP同时办理，只收一次。', sortOrder: 1 }),
  fee({ id: 'cidec-ssp', name: 'CIDEC SSP + E-CARD', amount: 15000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: 'CIDEC学生的SSP和E-CARD合计，有效6个月。', sortOrder: 2 }),
  fee({ id: 'i-card', name: 'I-CARD 外国人身份证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次签证续签时办理一次（30天签证第5周起，59天签证第9周起），婴幼儿也要办。', sortOrder: 3 }),
  fee({ id: 'utility', name: '综合管理费', amount: 2400, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每人每4周，婴幼儿也收；不足4周按4周估算。', sortOrder: 4 }),
  fee({ id: 'water', name: '水费', amount: 1200, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每人每4周，婴幼儿也收；不足4周按4周估算。', sortOrder: 5 }),
  fee({ id: 'visa-extension', name: '签证续签', amount: 4800, rates: VISA_RATES, tourist59Rates: VISA_RATES.slice(1), billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '按每次续30天预估：第1次4,800（续29天）、第2次5,800、第3次5,300、第4和第5次各5,500、第6次4,000比索；部分国籍每次另加500比索。', sortOrder: 6 }),
  fee({ id: 'group-materials', name: '小组课资料（复印）', amount: 1000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '有英语小组课的课程，每4周。', sortOrder: 7 }),
  fee({ id: 'kindergarten-materials', name: '幼儿园资料（复印）', amount: 1000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '幼儿园课程，每4周。', sortOrder: 8 }),
  fee({ id: 'student-id', name: '学生证', amount: 200, billingRule: 'once', includeInTotal: true, note: '每人一张。', sortOrder: 9 }),
  fee({ id: 'books', name: '一对一原版教材', amount: 600, secondaryAmount: 1500, billingRule: 'optional', includeInTotal: false, note: '按级别和课程购买，每本600–1,500比索；第一天先用复印资料试课。', sortOrder: 10 }),
  fee({ id: 'electricity', name: '电费', amount: 23, billingRule: 'optional', includeInTotal: false, note: '每千瓦时23比索，按房间电表实际用量结算；无家长陪同的学生按同房人数平分。', sortOrder: 11 }),
  fee({ id: 'deposit', name: '宿舍押金（可退）', amount: 5000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人5,000比索或100美元，结业时扣除电费等费用后退还。', sortOrder: 12 }),
  fee({ id: 'kindergarten-kit', name: '幼儿园文具套装', amount: 2000, billingRule: 'optional', includeInTotal: false, note: '彩色笔、黏土和学习用品，自愿购买。', sortOrder: 13 }),
  fee({ id: 'sending', name: '送机', amount: 2000, billingRule: 'optional', includeInTotal: false, note: '每户2,000比索（4人以内，超过每人加500比索）；旺季不提供送机。', sortOrder: 14 }),
  fee({ id: 'extra-night', name: '额外住宿', amount: 1500, billingRule: 'optional', includeInTotal: false, note: '每人每晚1,500比索，最多5晚；周日凌晨到校也要付一晚。', sortOrder: 15 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({ id: CIEC_PROMOTION_IDS.sida, name: '思达启航折扣', description: CIEC_SIDA_DESCRIPTION, sortOrder: 0, discountType: 'percentage', discountValue: 5, minimumCourseWeeks: 0 }),
  promotion({ id: CIEC_PROMOTION_IDS.soloGuardianFee, name: '淡季免监护费', description: '9岁及以上、没有家长陪同的学生，淡季学习周免收监护费（每4周300美元）', sortOrder: 1 }),
  promotion({ id: CIEC_PROMOTION_IDS.family2, name: '两人家庭家长食宿优惠', description: '1位家长 + 1个孩子住双人间，淡季家长食宿每4周930美元降到300美元（2026）／400美元（2027）；家长可以不上课', sortOrder: 2, appliesTo: 'accommodation' }),
  promotion({ id: CIEC_PROMOTION_IDS.family3, name: '三人家庭家长食宿免费', description: '1位家长 + 2个孩子住三人间，淡季家长食宿免费（原价每4周850美元）；家长可以不上课', sortOrder: 3, appliesTo: 'accommodation' }),
  promotion({ id: CIEC_PROMOTION_IDS.guardianCourse, name: '淡季家长课程优惠', description: '陪孩子来的家长上一对一课，每4周ESL 700→400美元、商务／雅思 800→500美元', sortOrder: 4, appliesTo: 'tuition' }),
  promotion({ id: CIEC_PROMOTION_IDS.craft, name: '小学生手作体验课', description: '2026淡季（2026/08/31–2027/01/01）小学生免费1小时手作体验课，与英语水平无关', sortOrder: 5, coverageStart: '2026-08-31', coverageEnd: '2027-01-01' }),
  promotion({ id: CIEC_PROMOTION_IDS.returning, name: '老学员返校', description: '老学员返校免收一次性注册费。', sortOrder: 6, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0 }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索缴纳，仅供准备现金参考，最终以学校收取为准。签证费用按每位家人选择的签证和停留时间预估；综合管理费和水费每人每4周，婴幼儿也要交；到校一周内要交清。请准备2张证件照，用于SSP和签证。';

export const createDefaultCiecContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: CIEC_SCHOOL_CODE,
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'CIEC 2027年4周课程费',
    courseTableNote: '课程费按4周计算，2027年价格与2026年相同；2周、3周分别按4周价格的65%和85%计算，不接受只读1周。',
    groupClassNote: '小组课最多7人，按英语水平和年龄分班。',
    roomTableTitle: 'CIEC 2027年4周食宿费',
    roomTableNote: '食宿费按每人每4周计算。24个月及以下的婴幼儿不收食宿费，25–47个月收一半，都不计入房间人数。',
    stayPolicyTitle: 'CIEC 入住与离校提醒',
    stayPolicies: [
      { label: '入住', value: '周日10:00以后', note: '周日凌晨到校要另付一晚额外住宿费（每人1,500比索）。' },
      { label: '离校', value: '最后一周的周六14:00前', note: '押金和护照在结算费用后退还。' },
      { label: '旺季订位', value: '每户500美元押金', note: '6–8月、12–2月报名，每户先交500美元押金；取消时不退、也不能延期。' },
    ],
    extraNightRates: [{ label: '每人每晚', amount: 1500 }],
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
    footerNotes: ['到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

/** A CIEC content document (default or published revision). */
export function isCiecContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === CIEC_SCHOOL_CODE
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

/** Copies a saved or previewed document and fills anything it lacks from the defaults. */
export const cloneCiecContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultCiecContentConfig();
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  // The 2-person family upgrade room was added after the first CIEC document (2026-11-24).
  const upgrade = defaults.rooms.find(room => room.id === CIEC_FAMILY2_TRIPLE_ROOM_ID);
  if (upgrade && !clone.rooms.some(room => room.id === upgrade.id)) clone.rooms.push(copyJson(upgrade));
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  for (const rule of clone.quoteSettings.promotions) {
    if (rule.id === CIEC_PROMOTION_IDS.sida && rule.description === CIEC_SIDA_DESCRIPTION_BEFORE) rule.description = CIEC_SIDA_DESCRIPTION;
  }
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= copyJson(defaults.quoteSettings.extraNightRates);
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  // I-CARD (ACR) moved to the first visa extension (user rule 2026-11-24); untouched old notes follow once.
  upgradeAcrNotes(clone, defaults, { 'i-card': ['停留超过59天时办理一次，婴幼儿也要办。'] });
  clone.media ??= [];
  return clone;
};
