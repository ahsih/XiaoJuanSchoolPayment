// IMS Academy's content document: courses, rooms, local fees, offers and quote-image copy. The public page
// (ims-school-page.component.ts), its calculator (ims-page-quote.ts), the local-fee table, the quote image and the
// employee editors all read it. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can bundle
// it. Sources: IMS's IMS-CHINA Drive pack and the 2026-11-19 notice on the off-season 2+2 offer, received 2026-11-25
// (2026 China price list, 2026-07-01 local-fee sheet, 2026 Chinese brochure, stay-in and walk-in regulations, the
// 2026-09-30 off-season and long-stay offers, the 2027 calendar); see docs/ims-update-2026-11-25.md.
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import { IMS_ADDITIONAL_CLASSES, IMS_COURSES, IMS_REGISTRATION_FEE, IMS_ROOMS } from './ims-pricing';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** Version 1 (2026-11-25): moves a saved document onto the template page's names, notes, fees and offers once. */
export const IMS_POLICY_VERSION = 1;
type ImsQuoteSettings = CiaQuoteSettings & { imsPolicyVersion?: number };

export const IMS_SIDA_RULE_ID = 'ims-sida-95';
export const IMS_TWO_PLUS_TWO_RULE_ID = 'ims-two-plus-two';
export const IMS_LOW_SEASON_RULE_ID = 'ims-low-season-300';
export const IMS_LONG_STAY_RULE_ID = 'ims-long-stay';
export const IMS_CLASS_EXCHANGE_RULE_ID = 'ims-class-exchange';

/** Guarantee courses are fixed packages of 12, 16, 20 or 24 weeks with their own prices. */
export const IMS_GUARANTEE_COURSE_IDS: readonly string[] = ['ielts-guarantee', 'toeic-guarantee'];
export const IMS_JUNIOR_COURSE_IDS: readonly string[] = ['junior-esl-6', 'junior-esl-8', 'junior-esl-9'];
export const IMS_PARENTS_COURSE_ID = 'parents-esl';
export const IMS_WALK_IN_ROOM_ID = 'walk-in';
/** IMS charges registration to every student, returning students too (2026-10-16 notice). */
export const IMS_REGISTRATION_NOTE = '每位学生一次性费用，老学员也收';

/** Months that are never off-season for the 2+2 and 300-dollar offers (school offer sheet 2026-09-30). */
export const IMS_PEAK_MONTHS: readonly number[] = [1, 6, 7, 8];

interface ImsCourseText { name: string; schedule: string; suitable: string; note: string; minimumWeeks?: number }

const EXAM_NIGHT = '晚间课和自习必须参加';

/** Names and class lines from the brochure's course table (2026); prices stay in ims-pricing.ts. */
const COURSE_TEXT: Readonly<Record<string, ImsCourseText>> = {
  'premium-esl': { name: 'Premium ESL 精品通用英语', schedule: '每天4节一对一 + 4节小组课', suitable: '想兼顾一对一纠错和小组互动的学生', note: '所有级别；15岁以上。' },
  'intensive-esl': { name: 'Intensive ESL 强化通用英语', schedule: '每天6节一对一 + 3节小组课', suitable: '想短期多上课、快速提高的学生', note: '所有级别；15岁以上。IMS课量最多的ESL课程。' },
  'essential-esl-6': { name: 'Essential ESL 6 基础英语', schedule: '每天6节一对一', suitable: '只想上一对一的学生', note: '所有级别；15岁以上。' },
  'essential-esl-5': { name: 'Essential ESL 5 基础英语', schedule: '每天5节一对一', suitable: '只想上一对一、课量适中的学生', note: '所有级别；15岁以上。' },
  'essential-esl-4': { name: 'Essential ESL 4 基础英语', schedule: '每天4节一对一', suitable: '想留出自习和休息时间的学生', note: '所有级别；15岁以上。' },
  'senior-esl': { name: 'Senior ESL（50岁以上）', schedule: '每天5节一对一，或4节一对一 + 1节小组课', suitable: '50岁以上、想按自己节奏学习的学员', note: '两种课表同一价格，报名时选一种。' },
  'power-speaking': { name: 'Power Speaking 口语专项', schedule: '每天4节一对一 + 4节小组课', suitable: '想提升口语表达、演讲和汇报能力的学生', note: '入学须达到IMS 3级；15岁以上。每月一次测评。' },
  'business-english': { name: 'Business English 商务英语', schedule: '每天4节一对一 + 4节小组课', suitable: '工作中要用英语开会、汇报和写邮件的学生', note: '入学须达到IMS 4级；15岁以上。' },
  'working-holiday': { name: 'Working Holiday 打工度假英语', schedule: '每天4节一对一 + 4节小组课', suitable: '准备打工度假、求职面试的学生', note: '入学须达到IMS 4级；15岁以上。' },
  'toeic-speaking': { name: 'TOEIC Speaking 托业口语', schedule: '每天4节一对一 + 4节小组课', suitable: '准备托业口语考试的学生', note: '入学须达到IMS 4级；20岁以上。' },
  opic: { name: 'OPIc 职业口语', schedule: '每天4节一对一 + 4节小组课', suitable: '准备OPIc口语考试的学生', note: '20岁以上；最后有完整的OPIc模拟考试和分析。' },
  'pre-ielts': { name: 'Pre-IELTS 雅思预备班', schedule: `每天4节一对一 + 4节小组课；${EXAM_NIGHT}`, suitable: '想先打好雅思基础的学生', note: '所有级别；15岁以上。' },
  ielts: { name: 'IELTS 标准雅思班', schedule: `每天4节一对一 + 4节小组课；${EXAM_NIGHT}`, suitable: '有明确雅思目标分的学生', note: '所有级别；15岁以上。定期模考。' },
  'ielts-guarantee': { name: 'IELTS Guarantee 雅思保分班', schedule: `每天4节一对一 + 4节小组课；${EXAM_NIGHT}`, suitable: '雅思4.0以上、想读满12周冲目标分的学生', note: '须读12、16、20或24周；入学须达到雅思4.0。', minimumWeeks: 12 },
  'pre-toeic': { name: 'Pre-TOEIC 托业预备班', schedule: `每天4节一对一 + 4节小组课；${EXAM_NIGHT}`, suitable: '想先打好托业基础的学生', note: '所有级别；15岁以上。' },
  toeic: { name: 'TOEIC 标准托业班', schedule: `每天4节一对一 + 4节小组课；${EXAM_NIGHT}`, suitable: '有明确托业目标分的学生', note: '所有级别；15岁以上。' },
  'toeic-guarantee': { name: 'TOEIC Guarantee 托业保分班', schedule: `每天4节一对一 + 4节小组课；${EXAM_NIGHT}`, suitable: '托业400以上、想读满12周冲目标分的学生', note: '须读12、16、20或24周；入学须达到托业400。', minimumWeeks: 12 },
  'pre-toefl': { name: 'Pre-TOEFL 托福预备班', schedule: '每天4节一对一 + 4节小组课', suitable: '想先打好托福基础的学生', note: '所有级别；15岁以上。' },
  'intensive-toefl': { name: 'Intensive TOEFL 强化托福班', schedule: '每天4节一对一 + 4节小组课，另有托福晚课', suitable: '有明确托福目标分的学生', note: '入学须达到IMS 4级；15岁以上；至少读4周。', minimumWeeks: 4 },
  sat: { name: 'SAT 考试班', schedule: '每天6节一对一，另有SAT晚课', suitable: '准备SAT考试的学生', note: '入学须达到IMS 4级；15岁以上；至少读4周。', minimumWeeks: 4 },
  'mommy-tesol': { name: 'Mommy TESOL 父母TESOL', schedule: '每天4节一对一', suitable: '想学习怎样在家教孩子英语的父母', note: '所有级别；20岁以上；至少读4周。', minimumWeeks: 4 },
  'tesol-light': { name: 'TESOL Light 轻量TESOL', schedule: '每天5节一对一', suitable: '想了解英语教学方法的学生', note: '入学须达到IMS 4级；20岁以上；至少读4周。', minimumWeeks: 4 },
  'junior-esl-6': { name: 'Junior ESL 6 少儿英语', schedule: '每天6节一对一 + 3节团体游戏', suitable: '7–14岁、和家长一起来的孩子', note: '家长报Parents ESL时，可把家长的3节一对一转给孩子，孩子每天最多9节。' },
  'junior-esl-8': { name: 'Junior ESL 8 少儿英语', schedule: '每天8节一对一 + 1节团体游戏', suitable: '7–14岁、想多上一对一的孩子', note: '不能再接收家长转来的课。' },
  'junior-esl-9': { name: 'Junior ESL 9 少儿英语', schedule: '每天9节一对一', suitable: '7–14岁、想多上一对一的孩子', note: '每天9节是学校上限，不能再接收家长转来的课。' },
  'parents-esl': { name: 'Parents ESL 家长英语', schedule: '每天3节一对一 + 1节小组课', suitable: '陪孩子来、自己也想学英语的家长（20岁以上）', note: '陪孩子来的家长须本人报名这门课；3节一对一可转给一起来的Junior ESL 6孩子。' },
};

/** Display order of the course list and quote select. */
const COURSE_ORDER = [
  'premium-esl', 'intensive-esl', 'essential-esl-6', 'essential-esl-5', 'essential-esl-4', 'senior-esl',
  'power-speaking', 'business-english', 'working-holiday', 'toeic-speaking', 'opic',
  'ielts-guarantee', 'ielts', 'pre-ielts', 'toeic-guarantee', 'toeic', 'pre-toeic',
  'intensive-toefl', 'pre-toefl', 'sat', 'mommy-tesol', 'tesol-light',
  'parents-esl', 'junior-esl-6', 'junior-esl-8', 'junior-esl-9',
];

const createCourses = (): CiaCourseContent[] => COURSE_ORDER.map((id, sortOrder) => {
  const source = IMS_COURSES.find(item => item.id === id)!;
  const text = COURSE_TEXT[id];
  const guarantee = IMS_GUARANTEE_COURSE_IDS.includes(id);
  const tuition = guarantee ? source.prices[12] ?? 0 : source.prices[4] ?? 0;
  return {
    id,
    name: text.name,
    courseType: source.category,
    tuition,
    tuition2027: tuition,
    ...(guarantee ? {
      feeByWeeks: Object.fromEntries(Object.entries(source.prices).map(([weeks, amount]) => [weeks, amount ?? 0])),
      allowedWeeks: [12, 16, 20, 24],
    } : {}),
    ...(text.minimumWeeks ? { minimumWeeks: text.minimumWeeks } : {}),
    suitable: text.suitable,
    schedule: text.schedule,
    note: text.note,
    enabled: true,
    sortOrder,
  };
});

const ROOM_TEXT: Readonly<Record<string, { name: string; group: string; note: string }>> = {
  single: { name: '单人间', group: '单人间', note: '一人一间，数量少，需尽早确认。' },
  double: { name: '双人间', group: '多人间', note: '两人一间，适合朋友或家人同行。' },
  triple: { name: '三人间', group: '多人间', note: '三人一间。' },
  quadruple: { name: '四人间', group: '多人间', note: 'IMS最省钱的房型。' },
};

const createRooms = (): CiaRoomContent[] => [
  ...IMS_ROOMS.map((item, sortOrder): CiaRoomContent => ({
    id: item.id,
    name: ROOM_TEXT[item.id].name,
    label: ROOM_TEXT[item.id].name,
    code: item.id,
    location: '校内',
    group: ROOM_TEXT[item.id].group,
    fee: item.prices[4],
    note: ROOM_TEXT[item.id].note,
    enabled: true,
    sortOrder,
  })),
  {
    id: IMS_WALK_IN_ROOM_ID, name: '走读（不住宿）', label: '走读（不住宿）', code: IMS_WALK_IN_ROOM_ID, location: '校内', group: '走读',
    fee: 0, accommodation: false, note: '只收课程费；到校只交签证、SSP、E-CARD、学生证和教材费。', enabled: true, sortOrder: IMS_ROOMS.length,
  },
];

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'> & { currency?: 'PHP' | 'USD' }): CiaLocalFeeRule => ({
  currency: 'PHP', enabled: true, ...value,
});

/** The 2026-07-01 local-fee sheet; each rule keeps its former id so employee edits stay attached. */
const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'visa-extension', name: '签证续签', amount: 5050, rates: [5050, 6800, 4450, 4450, 4450, 5850], tourist59Rates: [6800, 4450, 4450, 4450, 5850], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '30天签证第5周起续签，依次5,050／6,800／4,450比索，之后每4周一次；59天签证第9周起，依次6,800／4,450比索；实际费用按移民局政策可能浮动。', sortOrder: 0 }),
  fee({ id: 'ssp', name: 'SSP特别学习许可', amount: 8000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学时办理一次。', sortOrder: 1 }),
  fee({ id: 'e-card', name: 'SSP E-CARD', amount: 4000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP一起办理，只收一次。', sortOrder: 2 }),
  fee({ id: 'acr-i-card', name: 'ACR I-CARD', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次续签时办理一次。', sortOrder: 3 }),
  fee({ id: 'books', name: '教材费', amount: 3000, billingRule: 'once', includeInTotal: true, note: '每种课程预估一套；教材按级别和课程不同，按实际购买结算。', sortOrder: 4 }),
  fee({ id: 'student-id', name: '学生证', amount: 300, billingRule: 'once', includeInTotal: true, note: '入学时办理一次；遗失补办同价。', sortOrder: 5 }),
  fee({ id: 'water', name: '水费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '按住宿周数每周收取；走读不收。', sortOrder: 6 }),
  fee({ id: 'electricity', name: '电费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '按住宿周数每周收取；走读不收。', sortOrder: 7 }),
  fee({ id: 'aircon', name: '空调费', amount: 250, secondaryAmount: 30, secondaryLabel: '超额／度', billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每周250比索，含每4周100度；超出部分每度30比索，退房时同房间平摊，从押金扣除。', sortOrder: 8 }),
  fee({ id: 'deposit', name: '宿舍押金（可退）', amount: 3000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '入住时缴纳；毕业结算时先扣教材和超额空调费，无损坏、交还钥匙后退还余额。', sortOrder: 9 }),
  fee({ id: 'pickup', name: '宿务机场接机', amount: 1000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人1,000比索；至少提前一天取消才可退款。', sortOrder: 10 }),
  fee({ id: 'dropoff', name: '宿务机场送机', amount: 1000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人1,000比索；读完课程并填写反馈的学生，学校免费送机。', sortOrder: 11 }),
  fee({ id: 'walk-in-lunch', name: '走读午餐', amount: 6000, billingRule: 'optional', periodWeeks: 4, includeInTotal: false, note: '走读学生可选，每4周6,000比索。', sortOrder: 12 }),
  ...IMS_ADDITIONAL_CLASSES.map((item, index) => fee({
    id: `additional-${item.id}`, name: item.name, currency: 'USD', amount: item.price4w, billingRule: 'optional', periodWeeks: 4,
    includeInTotal: false, note: '每4周的加课价格；专项课程指雅思、托业等ESL以外的课程。', sortOrder: 13 + index,
  })),
  fee({ id: 'guardian-service', name: '监护服务 Guardian Service', currency: 'USD', amount: 450, billingRule: 'optional', periodWeeks: 4, includeInTotal: false, note: '未成年学生可选，每4周450美元；只在淡季（1、6、7、8月以外）提供。', sortOrder: 19 }),
  fee({ id: 'school-management', name: '国际学生管理服务 School Management', currency: 'USD', amount: 2100, billingRule: 'optional', periodWeeks: 4, includeInTotal: false, note: '未成年学生可选，每4周2,100美元；具体服务内容请顾问向学校确认。', sortOrder: 20 }),
];

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

/** What a 2+2 student must post, from IMS's notice of 2026-11-19. */
export const IMS_TWO_PLUS_TWO_TASKS: readonly string[] = [
  '在小红书或抖音发3篇图文笔记和1条1–2分钟的视频，都要带IMS的信息',
  '内容要正面、真实，写自己的学习体验；负面内容不算',
  '第3周的周五12:00前发完',
  '最后一周配合学校拍3–5分钟的采访视频，要本人出镜',
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: IMS_SIDA_RULE_ID, name: '思达启航折扣', sortOrder: 0, discountType: 'percentage', discountValue: 5,
    description: '课程费和住宿费95折，参加2+2达人活动的4周不打折',
  }),
  promotion({
    id: IMS_TWO_PLUS_TWO_RULE_ID, name: '2+2达人活动', sortOrder: 1, ruleKind: 'ims-two-plus-two', minimumCourseWeeks: 4,
    description: `淡季（1、6、7、8月以外）的前4周只付2周的课程费和住宿费；要求：${IMS_TWO_PLUS_TWO_TASKS.join('；')}`,
  }),
  promotion({
    id: IMS_LOW_SEASON_RULE_ID, name: '淡季优惠', sortOrder: 2, ruleKind: 'ims-low-season-300', discountType: 'per-course-week', discountValue: 75, minimumCourseWeeks: 4,
    description: '读4周以上，淡季（1、6、7、8月以外）每4周减300美元，不满4周的淡季周每周减75美元；参加2+2的4周不再减',
  }),
  promotion({
    id: IMS_LONG_STAY_RULE_ID, name: '长期优惠', sortOrder: 3, ruleKind: 'ims-long-stay', appliesTo: 'tuition',
    discountTiers: { 8: 50, 12: 100, 16: 200, 20: 300, 24: 400 },
    description: '全年适用；按付费课程周数（2+2的4周算2周）一次减50／100／200／300／400美元（8／12／16／20／24周起）',
  }),
  promotion({
    id: IMS_CLASS_EXCHANGE_RULE_ID, name: '小组课换一对一', sortOrder: 4, discountType: 'none', ruleKind: 'ims-class-exchange',
    description: '2026/12/31前和2027/02/01–05/30，2节小组课可换1节一对一，学费不变',
    coverageStart: '2026-01-01', coverageEnd: '2027-05-30',
  }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留周数预估；水费、电费和空调费按住宿周数每周收取，走读学生不收；教材按实际购买结算。押金、接机和送机另付，不计入合计；住满6个月以上另有ECC、CRTV等移民局费用。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultImsContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'IMS',
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: IMS_REGISTRATION_FEE,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.3, '2': 0.6, '3': 0.8 },
    peakSeasonFeePerWeek: 0,
    peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'IMS 4周课程费',
    courseTableNote: '课程费按4周计算；1–3周按4周价的30%、60%、80%计算。保分班是12、16、20、24周的整期价。2027年价格学校尚未公布，暂按2026年价格预估。',
    groupClassNote: '每节课45分钟，课间休息10分钟。',
    roomTableTitle: 'IMS 4周住宿费',
    roomTableNote: '全部是校内宿舍，含一日三餐（周末也有）；按周日入住、周六退房计算。',
    stayPolicyTitle: 'IMS 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日', note: '宿舍统一周日办理入住。' },
      { label: '退房日期', value: '课程结束后的周六11:00前', note: '退房当天不含午餐；毕业结算在周五16:30–17:30办理。' },
      { label: '提前入住或延住', value: '每晚1,000比索（含餐）', note: '须提前向学校申请。' },
    ],
    extraNightRates: [],
    imsPolicyVersion: IMS_POLICY_VERSION,
  } as ImsQuoteSettings,
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: IMS_REGISTRATION_NOTE, course: '', accommodation: '', promotion: '' },
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

/** An IMS content document (default or published revision). */
export function isImsContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === 'IMS'
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

/** Image lines of the former page's defaults; a saved document still holding them takes the new ones. */
const OLD_IMAGE_COPY = {
  paymentSectionTitle: '课程、住宿与优惠明细',
  registration: '每名注册学生一次性100美元，任何优惠或返校状态均不能减免。',
  localFeeSectionTitle: '到校后比索费用明细',
  localFeeIntro: '按2026年7月1日起费用表估算；押金、接机、可选项目和实际购买类费用分别标注。',
  alumniBenefitTitle: 'IMS优惠提醒',
  serviceLocations: ['深圳总部', '菲律宾宿务驻点', '欧洲驻点'],
  benefitTitle: '价格逐项可核验',
} as const;

/**
 * Version 1: brings a document saved for the former page onto the template page. Courses and rooms take the new
 * names, class lines and notes (a saved four-week price is kept, guarantee packages keep their saved package prices),
 * the walk-in choice is added, local fees and offers are replaced by the 2026-07-01 sheet and the 2026-11-19 notice,
 * and table texts and untouched image lines take the new defaults. Rows an employee added stay.
 */
function upgradeImsPolicy(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as ImsQuoteSettings;
  if ((settings.imsPolicyVersion ?? 0) >= IMS_POLICY_VERSION) return;
  const merge = <T extends { id: string; sortOrder: number }>(saved: T[], fresh: T[], keep: (from: T, to: T) => void): T[] => {
    const rows = fresh.map(item => {
      const old = saved.find(row => row.id === item.id);
      const next = copyJson(item);
      if (old) keep(old, next);
      return next;
    });
    const extra = saved.filter(row => !fresh.some(item => item.id === row.id));
    return [...rows, ...extra.map((row, index) => ({ ...row, sortOrder: rows.length + index }))];
  };
  clone.courses = merge(clone.courses ?? [], defaults.courses, (old, next) => {
    next.enabled = old.enabled;
    if (IMS_GUARANTEE_COURSE_IDS.includes(next.id)) {
      if (old.feeByWeeks?.['12']) {
        next.feeByWeeks = Object.fromEntries(Object.entries(next.feeByWeeks ?? {}).map(([weeks, amount]) => [weeks, old.feeByWeeks?.[weeks] || amount]));
        next.tuition = next.feeByWeeks['12'];
        next.tuition2027 = next.tuition;
      }
    } else if (old.tuition > 0) {
      next.tuition = old.tuition;
      next.tuition2027 = old.tuition;
    }
  });
  clone.rooms = merge(clone.rooms ?? [], defaults.rooms, (old, next) => {
    next.enabled = old.enabled;
    if (old.fee > 0) next.fee = old.fee;
  });
  clone.localFees = [
    ...copyJson(defaults.localFees),
    ...(clone.localFees ?? []).filter(rule => !defaults.localFees.some(item => item.id === rule.id)),
  ];
  settings.promotions = [
    ...copyJson(defaults.quoteSettings.promotions),
    ...(settings.promotions ?? []).filter(rule => !rule.id.startsWith('ims-') && !defaults.quoteSettings.promotions.some(item => item.id === rule.id)),
  ];
  settings.shortStayRatios = { ...defaults.quoteSettings.shortStayRatios };
  for (const key of ['localFeeIntro', 'courseTableTitle', 'courseTableNote', 'groupClassNote', 'roomTableTitle', 'roomTableNote', 'stayPolicyTitle'] as const) {
    settings[key] = defaults.quoteSettings[key];
  }
  settings.stayPolicies = copyJson(defaults.quoteSettings.stayPolicies);
  const image = clone.quoteImageSettings;
  const fresh = defaults.quoteImageSettings;
  if (image) {
    if (image.paymentSectionTitle === OLD_IMAGE_COPY.paymentSectionTitle) image.paymentSectionTitle = fresh.paymentSectionTitle;
    if (image.paymentNotes?.registration === OLD_IMAGE_COPY.registration) image.paymentNotes = copyJson(fresh.paymentNotes);
    if (image.localFeeSectionTitle === OLD_IMAGE_COPY.localFeeSectionTitle) image.localFeeSectionTitle = fresh.localFeeSectionTitle;
    if (image.localFeeIntro === OLD_IMAGE_COPY.localFeeIntro) image.localFeeIntro = fresh.localFeeIntro;
    if (image.alumniBenefitTitle === OLD_IMAGE_COPY.alumniBenefitTitle) {
      image.alumniBenefitTitle = fresh.alumniBenefitTitle;
      image.alumniBenefitText = fresh.alumniBenefitText;
    }
    if (JSON.stringify(image.serviceLocations) === JSON.stringify(OLD_IMAGE_COPY.serviceLocations)) image.serviceLocations = [...fresh.serviceLocations];
    if (image.benefits?.[0]?.title === OLD_IMAGE_COPY.benefitTitle) image.benefits = copyJson(fresh.benefits);
    if (image.footerNotes?.some(note => note.includes('注册费100美元／人绝不参加'))) image.footerNotes = copyJson(fresh.footerNotes);
    if (image.promotionNotes) {
      for (const id of [IMS_TWO_PLUS_TWO_RULE_ID, IMS_LOW_SEASON_RULE_ID, IMS_LONG_STAY_RULE_ID, IMS_SIDA_RULE_ID]) delete image.promotionNotes[id];
    }
  }
  settings.imsPolicyVersion = IMS_POLICY_VERSION;
}

/**
 * IMS has one price year, and the employee editor edits only the current price (`tuition`), while the page and
 * quote read `tuition2027`; keep the two equal. A guarantee course is listed at its 12-week package price.
 */
function syncImsPrices(clone: CiaContentConfig): void {
  for (const course of clone.courses) {
    const price = IMS_GUARANTEE_COURSE_IDS.includes(course.id) ? course.feeByWeeks?.['12'] || course.tuition : course.tuition;
    course.tuition = price;
    course.tuition2027 = price;
  }
}

/** Fills a saved document up to the current schema and applies the one-time policy upgrade. */
export const cloneImsContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultImsContentConfig();
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
  upgradeImsPolicy(clone, defaults);
  syncImsPrices(clone);
  clone.media ??= [];
  return clone;
};
