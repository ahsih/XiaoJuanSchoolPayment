// A&J e-Edu Academy ECO Campus (Baguio): the versioned employee content document with courses, rooms, local fees,
// offers and quote-image copy. The public page (anj-school-page.component.ts), its calculator (anj-page-quote.ts),
// the local-fee table and the quote image all read the published version of this document. Keep it pure data.
// Sources: the school's Google Drive pack, received 2026-11-24 (price list effective 2026-11-01, 2027 course guide,
// local-fee notice, offer posters, 2027 peak-season notice, refund rules, 2027 holidays, new-student handbook);
// see docs/anj-eco-campus-2026-11-24.md.
import { ASSOCIATION_PEAK_POLICY_VERSION } from '../association-peak-surcharge';
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
 * Raised when saved documents must inherit a school notice once (cloneAnjContentConfig):
 * 1 = the 2026-11-24 school pack: 2027 course guide (IELTS and Working Holiday rows, Chinese names and class
 *     lines), Suite twin and Villa for-4 whole rooms, the new local-fee list, short stays and the 2026–2027 offers.
 */
export const ANJ_POLICY_VERSION = 1;
type AnjQuoteSettings = CiaQuoteSettings & { anjPolicyVersion?: number };

export const ANJ_PROMOTION_IDS = {
  registration: 'registration-waiver',
  sida: 'sida-discount',
  birthday: 'anj-birthday',
  ieltsExam: 'anj-ielts-exam',
} as const;
/** ruleKind of the regular offers (tiers by course weeks) and of the low-season offers (per complete 4 weeks). */
export const ANJ_REGULAR_RULE_KIND = 'anj-new-period';
export const ANJ_LOW_SEASON_RULE_KIND = 'anj-low-season';

/** Courses whose textbooks are the test-course books (1,500 pesos per 4 weeks); every other course uses ESL books. */
export const ANJ_TEST_BOOK_COURSE_IDS: readonly string[] = ['test-ielts', 'test-course', 'toeic-guarantee', 'ielts-guarantee', 'junior-test'];
export const ANJ_JUNIOR_COURSE_IDS: readonly string[] = ['junior-lite', 'junior-esl', 'junior-test'];

/** Summer peak (BESA): 40 dollars a week in 2026, 60 from 2027; a stay touching it must be at least 4 weeks. */
export const ANJ_PEAK_SEASON_RANGES = [{ label: '2026暑期旺季', start: '2026-06-28', end: '2026-08-22' }] as const;
export const ANJ_PEAK_2027_RANGE = { label: '2027暑期旺季', start: '2027-06-27', end: '2027-08-22' } as const;
export const ANJ_PEAK_MINIMUM_WEEKS = 4;

/**
 * Birthday offer, 2026 arrivals: the last digit of the birth day that qualifies, by arrival quarter
 * (from 2027 the birth month must equal the arrival month instead).
 */
export const ANJ_BIRTHDAY_DAY_ENDINGS_2026: Readonly<Record<number, readonly number[]>> = {
  1: [3, 6, 9], 2: [3, 6, 9], 3: [3, 6, 9],
  4: [2, 4, 8], 5: [2, 4, 8], 6: [2, 4, 8],
  7: [7], 8: [7], 9: [7],
  10: [0, 1, 5], 11: [0, 1, 5], 12: [0, 1, 5],
};

const course = (
  id: string, name: string, courseType: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({ id, name, courseType, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder, ...extra });

type WaterGroup = 'Deluxe' | 'Premium / Villa' | 'Suite';
const UTILITY: Record<WaterGroup, number> = { Deluxe: 3000, 'Premium / Villa': 4000, Suite: 4500 };
const DEPOSIT: Record<WaterGroup, number> = { Deluxe: 3000, 'Premium / Villa': 5000, Suite: 5000 };

const room = (
  id: string, name: string, code: string, group: string, waterGroup: WaterGroup, fee: number, note: string, sortOrder: number,
  occupancy = 1,
): CiaRoomContent => ({
  id, name, label: name, code, location: '校内', group, fee, note, enabled: true, sortOrder,
  priceMode: occupancy > 1 ? 'per-room' : 'per-person', minOccupancy: occupancy, maxOccupancy: occupancy,
  waterFee4w: UTILITY[waterGroup], waterGroup, deposit: DEPOSIT[waterGroup],
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({ ...value, currency: 'PHP', enabled: true });

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

// Class lines from the 2027 course guide (for arrivals from 2027-01-01).
const WORD_TEST_FIRST_4 = '前4周须参加单词测试';
const createCourses = (): CiaCourseContent[] => [
  course('eco-relax-lite', 'Eco Relax Lite 轻松课程', 'ESL', 650, '每天3节一对一 + 1节选修课；单词测试自愿参加', '想轻松学习的成人、长者和陪读家长', '半斯巴达管理；16岁以上可报名。', 0),
  course('eco-relax-plus', 'Eco Relax Plus 轻松加强课程', 'ESL', 750, `每天3节一对一 + 2节小组课 + 1节选修课；${WORD_TEST_FIRST_4}`, '想轻松学习、也想和同学多练口语的成人和家长', '半斯巴达管理；16岁以上可报名。', 1),
  course('eco-hub', 'Eco Hub 主题课程（口语／商务／旅游）', 'ESL', 850, `每天5节一对一 + 2节小组课 + 1节选修课；${WORD_TEST_FIRST_4}`, '目标明确的学生：口语、商务英语或旅游英语三选一', '三个方向任选一个，小组课按方向分开上；半斯巴达管理，16岁以上可报名。', 2),
  course('eco-sparta', 'Eco Sparta 斯巴达课程', 'ESL', 1150, '每天6节一对一 + 2节小组课 + 1节选修课；全程单词测试', '想在短时间内高强度提升的学生', '斯巴达管理：周一至周四不能外出，全程英语（EOP），选修课必须参加；16岁以上可报名。', 3),
  course('test-ielts', '雅思课程 IELTS', '考试课程', 950, `每天5节一对一 + 2节小组课 + 1节选修课；${WORD_TEST_FIRST_4}；每月月考和双周考`, '准备雅思考试的17岁以上学生', '入学测试和模拟考都是机考；未满17岁请报青少年考试课程。', 4),
  course('test-course', '考试课程（托业／托福／PTE）', '考试课程', 950, `每天5节一对一 + 2节小组课 + 1节选修课；${WORD_TEST_FIRST_4}；每月月考和双周考`, '准备托业、托福或PTE考试的17岁以上学生', '报名时选托业、托福或PTE其中一门；未满17岁请报青少年考试课程。', 5),
  course('ielts-guarantee', '雅思保分班 IELTS Guarantee', '保分班', 3150, '每天5节一对一 + 2节小组课 + 1节选修课；全程单词测试；每周考试', '需要雅思成绩、入学达到4.0分的学生',
    '12周保证5.5分、20周保证6.0分、24周保证6.5分；入学门槛4.0分，以学校入学考试为准，未达标先读4周ESL（学费50%）。毕业前送1次官方考试；官方考试未达保证分数，免50%学费继续学习，直到达标。', 6,
    { feeByWeeks: { 12: 3150, 20: 5250, 24: 6300 }, allowedWeeks: [12, 20, 24], minimumWeeks: 12 }),
  course('toeic-guarantee', '托业保分班 TOEIC Guarantee', '保分班', 2850, '每天4节一对一 + 2节小组课 + 1节选修课；全程单词测试；每天模拟考', '需要托业成绩、能保证出勤的学生',
    '12周：入学0–295分保证300分以上，300–595分保证提高200分以上，600分以上保证提高100分以上；16周保证800分以上。毕业前送1次官方考试；未达保证分数续读4周托业，学费减半；第二次考试自费。', 7,
    { feeByWeeks: { 12: 2850, 16: 3800 }, allowedWeeks: [12, 16], minimumWeeks: 12 }),
  course('working-holiday', '打工度假课程 Working Holiday', '打工度假', 900, `每天4节一对一 + 2节小组课 + 1节选修课；${WORD_TEST_FIRST_4}；每月月考`, '准备去海外打工度假、想先练工作英语的学生',
    '含实习（OJT）：4周10小时、8周20小时、12周40小时；实习不支薪，结业发证书。最后一周有结业评估：面试、实务任务和简报。', 8,
    { allowedWeeks: [4, 8, 12] }),
  course('junior-lite', '少儿轻松课程 Junior Lite（4–6岁）', '青少年课程', 900, '每天3节一对一 + 1节选修课；单词测试自愿参加', '4–6岁的孩子', '未满18岁须填家长同意书。', 9),
  course('junior-esl', '青少年英语 Junior ESL（7–15岁）', '青少年课程', 1300, '每天5节一对一 + 2节小组课 + 1节选修课；全程单词测试', '7–15岁的孩子', '未满18岁须填家长同意书。', 10),
  course('junior-test', '青少年考试课程 Junior Test（12–16岁）', '青少年课程', 1350, '每天5节一对一 + 2节小组课 + 1节选修课；全程单词测试', '准备托业、托福或雅思的12–16岁学生', '托业、托福、雅思任选一门；未满18岁须填家长同意书。', 11),
];

const FAMILY_ONLY = '限家庭入住：须以家庭身份报名并同住。';
const WHOLE_ROOM = '整间4周价；在多人报价里由同住的人选同一房型和日期，按人数平分。';

const createRooms = (): CiaRoomContent[] => [
  room('deluxe-single', 'Deluxe 单人间', 'D-1', 'Deluxe 主楼', 'Deluxe', 1450, '主楼Deluxe房，一人一间。', 0),
  room('deluxe-twin', 'Deluxe 双人间', 'D-2', 'Deluxe 主楼', 'Deluxe', 950, '主楼Deluxe房，两人一间。', 1),
  room('deluxe-triple', 'Deluxe 三人间', 'D-3', 'Deluxe 主楼', 'Deluxe', 800, '主楼Deluxe房，三人一间，住宿费最低。', 2),
  room('premium-single', 'Premium 单人间', 'P-1', 'Premium 公寓', 'Premium / Villa', 1650, 'Premium公寓里的单人房；公寓有客厅和小厨房，可以做饭。', 3),
  room('premium-twin', 'Premium 双人间（限家庭）', 'P-2', 'Premium 公寓', 'Premium / Villa', 1150, `Premium公寓里的双人房，按每人计价。${FAMILY_ONLY}`, 4),
  room('premium-suite', 'Suite 套房（单人入住）', 'S-1', 'Suite 套房', 'Suite', 2100, '主楼套房，一人入住。', 5),
  room('premium-suite-twin', 'Suite 套房（两人入住）', 'S-2', 'Suite 套房', 'Suite', 2700, `两人同住一间套房，限家人或同性；${WHOLE_ROOM}`, 6, 2),
  room('premium-studio-single', 'Premium Studio 单人入住', 'ST-1', 'Premium Studio', 'Premium / Villa', 1650, 'Studio一人入住；房内有小厨房和餐桌。', 7),
  room('premium-studio-twin', 'Premium Studio 双人入住（限家庭）', 'ST-2', 'Premium Studio', 'Premium / Villa', 1150, `Studio两人入住，按每人计价。${FAMILY_ONLY}`, 8),
  room('premium-studio-triple-use', 'Premium Studio 三人入住', 'ST-3', 'Premium Studio', 'Premium / Villa', 3700, `三人同住一间Studio；${WHOLE_ROOM}`, 9, 3),
  room('premium-studio-quad-use', 'Premium Studio 四人入住', 'ST-4', 'Premium Studio', 'Premium / Villa', 4600, `四人同住一间Studio；${WHOLE_ROOM}`, 10, 4),
  room('eco-villa-single', 'Eco Villa 别墅单人入住', 'V-1', 'Eco Villa 别墅', 'Premium / Villa', 2300, '独栋别墅一人入住；有客厅、小厨房和阳台。', 11),
  room('eco-villa-exclusive-twin', 'Eco Villa 别墅两人入住（限家庭）', 'V-2', 'Eco Villa 别墅', 'Premium / Villa', 2700, `${FAMILY_ONLY}${WHOLE_ROOM}`, 12, 2),
  room('eco-villa-exclusive-triple', 'Eco Villa 别墅三人入住（限家庭）', 'V-3', 'Eco Villa 别墅', 'Premium / Villa', 3700, `${FAMILY_ONLY}${WHOLE_ROOM}`, 13, 3),
  room('eco-villa-quad-use', 'Eco Villa 别墅四人入住（限家庭）', 'V-4', 'Eco Villa 别墅', 'Premium / Villa', 4600, `${FAMILY_ONLY}${WHOLE_ROOM}`, 14, 4),
];

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学时办理。', sortOrder: 0 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-Card', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP一起办理，只收一次。', sortOrder: 1 }),
  fee({ id: 'visa-extension', name: '签证续签', amount: 4940, rates: [4940, 6210, 4240], tourist59Rates: [6210, 4240], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '30天签证依次4,940／6,210比索，之后每次4,240；59天签证第1次6,210比索，之后每次4,240；以实际办理为准。', sortOrder: 2 }),
  fee({ id: 'acr-i-card', name: 'ACR I-Card', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '停留超过59天要办理；学校目前不向学生收取。', sortOrder: 3 }),
  fee({ id: 'utility', name: '水电费', amount: 3000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '按住宿周数计算，整间入住按人数平分；每4周Deluxe 3,000比索，Premium、Studio和别墅4,000，套房4,500。', sortOrder: 4 }),
  fee({ id: 'maintenance', name: '管理费', amount: 1500, secondaryAmount: 2000, secondaryLabel: 'Premium／套房／Studio／别墅', billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '按住宿周数计算，整间入住按人数平分；每4周Deluxe 1,500比索，Premium、套房、Studio和别墅2,000。', sortOrder: 5 }),
  fee({ id: 'books-esl', name: '教材费 · ESL课程', amount: 1000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周课程1,000比索，不足4周按4周预估；按实际购买为准。', sortOrder: 6 }),
  fee({ id: 'books-test', name: '教材费 · 考试课程', amount: 1500, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '考试、保分班和青少年考试课程每4周1,500比索，不足4周按4周预估；按实际购买为准。', sortOrder: 7 }),
  fee({ id: 'academy-id', name: '学生证', amount: 200, billingRule: 'once', includeInTotal: true, note: '一次性费用。', sortOrder: 8 }),
  fee({ id: 'besa-pickup', name: 'BESA周日团体接机', amount: 3000, billingRule: 'once', includeInTotal: true, note: '马尼拉或克拉克机场，指定周日统一接机；自行到校不收。', sortOrder: 9 }),
  fee({ id: 'deposit', name: '押金（可退）', amount: 3000, secondaryAmount: 5000, secondaryLabel: 'Premium／套房／Studio／别墅', billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '无损坏、无欠费时离校退还；整间入住的房型每间收一次。', sortOrder: 10 }),
  fee({ id: 'laundry', name: '洗衣服务', amount: 180, billingRule: 'optional', includeInTotal: false, note: '每3公斤180比索，每多1公斤加60；内衣每件10、帽子每顶50、毛巾每公斤47比索；按实际使用付费。', sortOrder: 11 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({ id: ANJ_PROMOTION_IDS.registration, name: '思达启航免注册费', description: '通过思达启航报名，每位学生免收100美元注册费。', sortOrder: 0, discountType: 'none', appliesTo: 'school-total', waiveRegistration: true }),
  promotion({ id: ANJ_PROMOTION_IDS.sida, name: '思达启航95折', description: '课程费和住宿费按原价先打95折，再减学校优惠；旺季附加费不打折。', sortOrder: 1, discountType: 'percentage', discountValue: 5 }),
  promotion({ id: 'anj-new-1', name: '常规优惠', description: '2026/08/01–11/30入学，按课程周数：4周减50、8周150、12周300、16周450、20周600、24周750美元。', sortOrder: 2, ruleKind: ANJ_REGULAR_RULE_KIND, discountTiers: { 4: 50, 8: 150, 12: 300, 16: 450, 20: 600, 24: 750 }, arrivalStart: '2026-08-01', arrivalEnd: '2026-11-30' }),
  promotion({ id: 'anj-new-2', name: '常规优惠', description: '2026/12/01–2027/02/28入学，按课程周数：8周减100、12周200、16周300、20周400、24周500美元。', sortOrder: 3, ruleKind: ANJ_REGULAR_RULE_KIND, discountTiers: { 4: 0, 8: 100, 12: 200, 16: 300, 20: 400, 24: 500 }, arrivalStart: '2026-12-01', arrivalEnd: '2027-02-28' }),
  promotion({ id: 'anj-low-2026', name: '淡季优惠', description: '2026/10/01–2027/01/09入学，每满4周课程减100美元。', sortOrder: 4, ruleKind: ANJ_LOW_SEASON_RULE_KIND, incrementWeeks: 4, incrementValue: 100, arrivalStart: '2026-10-01', arrivalEnd: '2027-01-09' }),
  promotion({ id: 'anj-low-2027-1', name: '2027淡季优惠', description: '2027/02/28–06/26入学，每满4周课程减300美元；暑期旺季的课程周不计。', sortOrder: 5, ruleKind: ANJ_LOW_SEASON_RULE_KIND, incrementWeeks: 4, incrementValue: 300, arrivalStart: '2027-02-28', arrivalEnd: '2027-06-26' }),
  promotion({ id: 'anj-low-2027-2', name: '2027淡季优惠', description: '2027/08/22–12/26入学，每满4周课程减300美元。', sortOrder: 6, ruleKind: ANJ_LOW_SEASON_RULE_KIND, incrementWeeks: 4, incrementValue: 300, arrivalStart: '2027-08-22', arrivalEnd: '2027-12-26' }),
  promotion({ id: ANJ_PROMOTION_IDS.birthday, name: '生日优惠', description: '课程至少4周，入学时提交生日证明：2026年入学按入学季度看出生日期尾数，2027年起出生月份与入学月份相同。', sortOrder: 7, ruleKind: 'anj-birthday', discountValue: 100, minimumCourseWeeks: 4 }),
  promotion({ id: ANJ_PROMOTION_IDS.ieltsExam, name: '送雅思官方考试', description: '报名雅思课程12周以上，送1次雅思官方考试（考点在碧瑶）。', sortOrder: 8, ruleKind: 'anj-ielts-exam', discountType: 'none', appliesTo: 'school-total', minimumCourseWeeks: 12, eligibleCourseIds: ['test-ielts'], arrivalStart: '2026-11-29' }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索缴纳，按每位学生的签证、课程和住宿预估；押金和洗衣费另列，不计入合计。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultAnjContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'ANJ',
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.9 },
    peakSeasonFeePerWeek: 40,
    peakSeasonPolicyVersion: ASSOCIATION_PEAK_POLICY_VERSION,
    peakSeasonRanges: [
      ...ANJ_PEAK_SEASON_RANGES.map((range, index) => ({ id: `anj-peak-${index + 1}`, ...range, enabled: true })),
      { id: 'anj-peak-2027', ...ANJ_PEAK_2027_RANGE, enabled: true },
    ],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'A&J 4周课程费',
    courseTableNote: '课表为2027年1月1日起入学的版本；课程费按4周计算，1–3周按4周价的40%、65%、90%计算；保分班和打工度假课程只能按规定周数报名。',
    groupClassNote: '小组课每班最多6人；不足2人或没有合适级别时，2节小组课改为1节一对一。',
    roomTableTitle: 'A&J 4周住宿费',
    roomTableNote: '住宿费含餐（平日三餐，周末和假日两餐）；整间入住的房型按整间4周价计算，由同住的人平分；标“限家庭”的房型须以家庭身份报名并同住。',
    stayPolicyTitle: 'A&J 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算；BESA团体接机在指定周日。' },
      { label: '退房日期', value: '课程结束后的周六', note: '延住和提前入住须提前向学校申请。' },
      { label: '整间房型', value: '人数和日期一致', note: '套房两人、Studio三人或四人、别墅两人以上入住，按整间价由同住的人平分。' },
    ],
    extraNightRates: [],
    anjPolicyVersion: ANJ_POLICY_VERSION,
  } as AnjQuoteSettings,
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

/** Promotion ids the 2026-11-24 pack replaced; other (employee-added) rules are kept. */
const REPLACED_PROMOTION = (rule: CiaPromotionRule): boolean =>
  rule.id === ANJ_PROMOTION_IDS.sida || rule.id === ANJ_PROMOTION_IDS.registration || rule.id === ANJ_PROMOTION_IDS.birthday
  || rule.id.startsWith('anj-new-') || rule.id.startsWith('anj-continuation-') || rule.id.startsWith('anj-low-');
/** Local-fee ids of the older notice; the new list replaces them. */
const OLD_LOCAL_FEE_IDS = new Set(['ssp', 'ssp-e-card', 'acr-i-card', 'visa-extension', 'books', 'student-card', 'manila-pickup', 'clark-pickup', 'laundry']);
const OLD_IMAGE_COPY = {
  registration: '一次性费用；通过思达启航报名免收',
  alumniBenefitTitle: 'A&J优惠提醒',
  alumniBenefitText: '新生、生日、淡季和续课优惠按所选入学日及周数自动匹配；最终资格以学校确认为准。',
  footerNotes: [
    '课程和住宿按完整周计算，周日入住、周六退房。',
    '2027价格目前沿用2026价目表预估，公布新价后需重新确认。',
    '人民币金额按参考汇率估算，最终以实际兑换或支付汇率为准。',
    '最终以学校价格、空房、优惠资格、移民局政策及顾问确认结果为准。',
  ],
  localFeeIntro: '以下为按当前签证、课程、住宿与接机选择计算的比索费用预估，最终以学校和移民局实收为准。',
};

/**
 * Version 1: brings a document saved before the 2026-11-24 pack onto it. Courses and rooms of the pack take the new
 * names, class lines, notes and room metadata (a saved price is kept); rooms and courses the pack added are inserted;
 * the older local-fee notice, the A&J offers and the table texts take the new defaults. Employee-added rows stay.
 */
function upgradeAnjPolicy(clone: CiaContentConfig, defaults: CiaContentConfig): boolean {
  const settings = clone.quoteSettings as AnjQuoteSettings;
  if ((settings.anjPolicyVersion ?? 0) >= ANJ_POLICY_VERSION) return false;
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
    if (!old.feeByWeeks && old.tuition > 0) Object.assign(next, { tuition: old.tuition, tuition2027: old.tuition2027 || old.tuition });
  });
  clone.rooms = merge(clone.rooms ?? [], defaults.rooms, (old, next) => {
    next.enabled = old.enabled;
    // The old Suite row was a 1–2 person whole room; the pack prices one person at the same 2,100 dollars.
    if (old.fee > 0) next.fee = old.fee;
  });
  clone.localFees = [
    ...copyJson(defaults.localFees),
    ...(clone.localFees ?? []).filter(rule => !OLD_LOCAL_FEE_IDS.has(rule.id) && !defaults.localFees.some(item => item.id === rule.id)),
  ];
  settings.promotions = [
    ...copyJson(defaults.quoteSettings.promotions),
    ...(settings.promotions ?? []).filter(rule => !REPLACED_PROMOTION(rule) && !defaults.quoteSettings.promotions.some(item => item.id === rule.id)),
  ];
  settings.shortStayRatios = { ...defaults.quoteSettings.shortStayRatios };
  settings.futurePriceArrivalStart = '';
  for (const key of ['localFeeIntro', 'courseTableTitle', 'courseTableNote', 'groupClassNote', 'roomTableTitle', 'roomTableNote', 'stayPolicyTitle'] as const) {
    settings[key] = defaults.quoteSettings[key];
  }
  settings.stayPolicies = copyJson(defaults.quoteSettings.stayPolicies);
  settings.anjPolicyVersion = ANJ_POLICY_VERSION;
  return true;
}

/** Replaces only image lines nobody has edited since they were the defaults. */
function upgradeAnjImageCopy(settings: CiaContentConfig['quoteImageSettings'], defaults: CiaContentConfig['quoteImageSettings']): void {
  if (settings.paymentNotes.registration === OLD_IMAGE_COPY.registration) settings.paymentNotes.registration = defaults.paymentNotes.registration;
  if (settings.alumniBenefitTitle === OLD_IMAGE_COPY.alumniBenefitTitle) settings.alumniBenefitTitle = defaults.alumniBenefitTitle;
  if (settings.alumniBenefitText === OLD_IMAGE_COPY.alumniBenefitText) settings.alumniBenefitText = defaults.alumniBenefitText;
  if (settings.localFeeIntro === OLD_IMAGE_COPY.localFeeIntro) settings.localFeeIntro = defaults.localFeeIntro;
  if (JSON.stringify(settings.footerNotes) === JSON.stringify(OLD_IMAGE_COPY.footerNotes)) settings.footerNotes = copyJson(defaults.footerNotes);
}

/** An A&J content document (default or published revision). */
export function isAnjContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === 'ANJ'
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

export const cloneAnjContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultAnjContentConfig();
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
  if ((cloned.quoteSettings.peakSeasonPolicyVersion ?? 0) < ASSOCIATION_PEAK_POLICY_VERSION) {
    const confirmed = { id: 'anj-peak-2027', ...ANJ_PEAK_2027_RANGE, enabled: true };
    const saved = cloned.quoteSettings.peakSeasonRanges.find(range => range.id.includes('2027') || range.label.includes('2027') || range.label.includes('星期推算'));
    if (saved) Object.assign(saved, confirmed);
    else cloned.quoteSettings.peakSeasonRanges.push(confirmed);
    cloned.quoteSettings.peakSeasonPolicyVersion = ASSOCIATION_PEAK_POLICY_VERSION;
  }
  const upgraded = upgradeAnjPolicy(cloned, defaults);
  cloned.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  cloned.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  cloned.quoteImageSettings.localFeeNotes ??= {};
  cloned.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  cloned.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  cloned.quoteImageSettings.footerNotes = cloned.quoteImageSettings.footerNotes.map(note => note.replace(/思达游学/g, '思达启航'));
  if (upgraded) upgradeAnjImageCopy(cloned.quoteImageSettings, defaults.quoteImageSettings);
  cloned.media ??= [];
  return cloned;
};
