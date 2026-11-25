// ELSA's content document: courses, rooms, local fees, offers and quote-image copy. The public page
// (elsa-school-page.component.ts), its calculator (elsa-page-quote.ts), the local-fee table and the quote image all
// read it. Keep it pure data. Sources: 思达启航's ELSA 2026–2027 price list (user decision 2026-11-25: quotes stay on
// this 2026 version), the school's Google Drive pack (2026 brochures, adult ESL brochure, Oct 2026 pre-departure
// guide and local-fee sheet, Feb 2026 orientation, 2027 ESL calendar); see docs/elsa-source-2026-11-25.md.
//
// ELSA prices a course together with its room and three meals (课程＋食宿). The course price here is the
// five-person-room package; each room adds a fixed amount per four weeks (四人间+50, 三人间+100, 双人间+150,
// 单人间 = 双人间+500), which reproduces every cell of the school's price list exactly.
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** Not in the CIA school-code union: ELSA has no employee editor yet. */
export const ELSA_SCHOOL_CODE = 'ELSA' as CiaContentConfig['schoolCode'];

export const ELSA_SIDA_RULE_ID = 'elsa-sida-90';
export const ELSA_ADULT_OFF_SEASON_RULE_ID = 'elsa-off-season-adult-2026';
export const ELSA_KIDS_OFF_SEASON_RULE_ID = 'elsa-off-season-kids-2026';
export const ELSA_RETURNING_RULE_ID = 'elsa-returning-registration';

/** The 2026 off-season: study weeks inside 2026/08/30 (Sunday) – 12/26 (Saturday). */
export const ELSA_OFF_SEASON_2026 = { start: '2026-08-30', end: '2026-12-26' } as const;

/** Adult ESL courses (成人ESL类课程), the ones the off-season half price covers. */
export const ELSA_ADULT_COURSE_IDS: readonly string[] = ['super-basic', 'basic', 'general', 'intensive', 'super-intensive'];
/** Courses for an accompanying parent; adults only. */
export const ELSA_GUARDIAN_COURSE_IDS: readonly string[] = ['guardian-group', 'guardian-relax', 'guardian-esl', 'guardian-golf'];
/** A parent who only stays: the price already holds registration, no classes, no discount, triple to five-person rooms. */
export const ELSA_GUARDIAN_STAY_ID = 'guardian-stay';
/** Junior and kindergarten courses (青少年、幼儿园课程), the ones the off-season free weeks cover; under 18 only. */
export const ELSA_KIDS_COURSE_IDS: readonly string[] = ['junior-esl', 'schooling-half', 'schooling-all', 'kinder', 'nursery'];
export const ELSA_SCHOOLING_IDS: readonly string[] = ['schooling-half', 'schooling-all'];
/** Rooms a guardian who does not study may book (the price list has no twin or single for them). */
export const ELSA_GUARDIAN_STAY_ROOM_IDS: readonly string[] = ['room-3', 'room-4', 'room-5'];

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
  minimumWeeks?: number,
): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder,
  ...(minimumWeeks ? { minimumWeeks } : {}),
});

const room = (
  id: string, name: string, label: string, code: string, group: string, fee: number, note: string, sortOrder: number,
): CiaRoomContent => ({ id, name, label, code, location: '校内', group, fee, note, enabled: true, sortOrder });

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

// Class lines from the 2026 brochures; every class is 50 minutes.
const createCourses = (): CiaCourseContent[] => [
  course('general', 'General ESL 综合英语', 1750, '每天4节一对一 + 3节小组课', '想把听说读写一起打好基础的成人', '口语和综合能力兼顾；适合A1–B2水平。', 0),
  course('intensive', 'Intensive ESL 密集英语', 1850, '每天5节一对一 + 2节小组课', '想在短时间内多练口语的成人', '一对一更多，短期集中提高口语。', 1),
  course('super-intensive', 'Super Intensive ESL 超密集英语', 1950, '每天6节一对一 + 1节小组课', '目标明确、想尽快提高口语的成人', '一对一最多的成人课程。', 2),
  course('basic', 'Basic ESL 基础英语', 1650, '每天3节一对一 + 3节小组课', '想打基础、也想多和同学练习的成人', '一对一打基础，小组课练习表达。', 3),
  course('super-basic', 'Super Basic ESL 零基础英语', 1750, '每天5节一对一', '零基础、不想上小组课的成人', '全部是一对一，按自己的速度学。', 4),
  course('guardian-relax', '家长轻松课程', 1450, '每天2节一对一', '陪孩子来、想轻松学一点英语的家长', '课少，有时间照顾孩子。', 5),
  course('guardian-esl', '家长ESL课程', 1500, '每天2节一对一 + 2节小组课', '陪孩子来、自己也想系统学英语的家长', '照顾孩子和自己学习两不误。', 6),
  course('guardian-group', '家长陪同课程', 1350, '每天3节小组课', '陪孩子来、只想上小组课的家长', '只有小组课，没有一对一。', 7),
  course('guardian-golf', '家长高尔夫课程', 2150, '每天3节小组课 + 每周2次高尔夫球场实地课', '陪孩子来、想边学英语边打高尔夫的家长', '球场实地课每周2次；球童小费等现场费用另付。', 8),
  course('guardian-stay', '家长陪读（不上课）', 850, '不上课，只住宿和用餐', '只陪孩子、自己不上课的家长', '价格已含注册费，不参加优惠和折扣；只能住三人间、四人间或五人间。', 9),
  course('junior-esl', 'Junior ESL 青少年英语', 1850, '每天4节一对一 + 3节小组课（每班最多8人）', '7–14岁的孩子', '小组课按级别分班，练口语、写作和单词。', 10),
  course('schooling-half', '半天学校课程', 1850, '上午和本地学生一起上正规课，下午4节一对一', '想体验菲律宾本地学校、英语还需要加强的孩子', '影子老师陪孩子进课堂；学校放假期间只有半天课程，可能改上ESL。', 11),
  course('schooling-all', '全天学校课程', 1850, '全天和本地学生一起上正规课；菲律宾语课时间改上1节一对一ESL', '英语有一定基础、想完整体验学校生活的孩子', '至少读4周；年纪大、英语较弱的孩子可能跟不上，建议先读半天。', 12, 4),
  course('kinder', '幼儿园课程', 1950, '每天3节一对一 + 4节小组活动课，含点心', '4–7岁的孩子', '小组课有编程、科学实验、烹饪、美术和音乐剧等活动。', 13),
  course('nursery', '幼儿托管', 1350, '每天4节小组课，保姆陪同', '42–47个月的孩子', '到校后由学校评估后安排。', 14),
];

const SUPPLEMENT = (amount: number) => `+${amount}美元／4周`;

const createRooms = (): CiaRoomContent[] => [
  room('room-1', `单人间（${SUPPLEMENT(650)}）`, '单人间', 'R-1', '单人间', 650, '一人住两人或三人房（B栋或C栋），比双人间每4周多500美元。', 0),
  room('room-2', `双人间（${SUPPLEMENT(150)}）`, '双人间', 'R-2', '多人间', 150, 'B栋或C栋，每间住2–3人的房间。', 1),
  room('room-3', `三人间（${SUPPLEMENT(100)}）`, '三人间', 'R-3', '多人间', 100, 'B栋或C栋，每间住2–3人的房间。', 2),
  room('room-4', `四人间（${SUPPLEMENT(50)}）`, '四人间', 'R-4', '多人间', 50, 'A栋，每间住4–5人的大房间。', 3),
  room('room-5', '五人间（课程价已含）', '五人间', 'R-5', '多人间', 0, 'A栋，每间住4–5人的大房间；课程价按五人间计算。', 4),
];

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'visa-extension', name: '签证续签', amount: 5160, rates: [5160, 6400, 4440], tourist59Rates: [6400, 4440], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '30天签证依次5,160／6,400／4,440比索，之后每次按4,440预估；59天签证从6,400起；以实际办理为准。', sortOrder: 0 }),
  fee({ id: 'ssp', name: 'SSP特别学习许可', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，有效期最长6个月；只陪读不上课的家长不用办。', sortOrder: 1 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '和SSP一起办理，只收一次。', sortOrder: 2 }),
  fee({ id: 'acr-i-card', name: 'ACR I-CARD', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次续签时办理一次。', sortOrder: 3 }),
  fee({ id: 'facility', name: '设施费（水电和管理）', amount: 1500, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每人每周1,500比索，含水费、基本用电和管理费；空调电费另算。', sortOrder: 4 }),
  fee({ id: 'books', name: '教材费', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '预估每4周2,000比索，不同课程用的教材不同，以实际购买为准。', sortOrder: 5 }),
  fee({ id: 'schooling-uniform', name: '学校课程校服', amount: 4000, billingRule: 'once', includeInTotal: true, note: '全天学校约4,000比索；半天学校只需上衣和体育服上衣，约1,885比索；按尺码不同。', sortOrder: 6 }),
  fee({ id: 'schooling-copies', name: '学校课程讲义复印费', amount: 1500, billingRule: 'once', includeInTotal: true, note: '学校课程不买整套课本，按需复印装订；全天约1,500比索，半天约500–700比索（按700预估），按年级不同。', sortOrder: 7 }),
  fee({ id: 'air-conditioning', name: '空调电费', amount: 4000, billingRule: 'optional', includeInTotal: false, note: '按实际使用收取：使用小时×1.8度×25比索；不过度使用时平均每月约4,000比索，每4周结算一次。', sortOrder: 8 }),
  fee({ id: 'deposit', name: '押金（可退）', amount: 5000, billingRule: 'optional', includeInTotal: false, note: '每个家庭5,000比索，退房时无损坏、无欠费退还。', sortOrder: 9 }),
  fee({ id: 'pickup', name: '宿务机场接机', amount: 1000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人1,000比索，车程约30分钟。', sortOrder: 10 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: ELSA_ADULT_OFF_SEASON_RULE_ID, name: '2026淡季成人ESL半价', sortOrder: 0, discountType: 'percentage', discountValue: 50,
    description: '2026/08/30–12/26期间上课的周，成人ESL课程的课程和食宿费半价；名额有限，报满即止',
    arrivalStart: ELSA_OFF_SEASON_2026.start, arrivalEnd: ELSA_OFF_SEASON_2026.end,
  }),
  promotion({
    id: ELSA_KIDS_OFF_SEASON_RULE_ID, name: '2026淡季青少年和幼儿课程送周', sortOrder: 1, discountType: 'fixed',
    description: '课程全部在2026/08/30–12/26期间：读4周付3周，读12周付8周；名额有限，报满即止',
    arrivalStart: ELSA_OFF_SEASON_2026.start, arrivalEnd: ELSA_OFF_SEASON_2026.end,
  }),
  promotion({
    id: ELSA_SIDA_RULE_ID, name: '思达启航折扣', sortOrder: 2, discountType: 'percentage', discountValue: 10,
    description: '课程和食宿费先享9折，再扣学校优惠（家长陪读不上课除外）',
  }),
  promotion({
    id: ELSA_RETURNING_RULE_ID, name: '老学员返校', sortOrder: 3, discountType: 'none', appliesTo: 'school-total', waiveRegistration: true,
    description: '老学员返校免收一次性注册费。',
  }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索现金缴纳，仅供准备现金参考。签证费用按每位学生选择的签证和停留时间预估；设施费按住宿周数每人每周收取；教材每4周预估一次。空调电费、押金和接机另付，不计入合计。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultElsaContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: ELSA_SCHOOL_CODE,
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.25, '2': 0.5, '3': 0.75 },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'ELSA 4周课程＋食宿价',
    courseTableNote: '课程价含课程、住宿和三餐，按五人间计算；换其他房型按住宿部分加价。不足4周按周数比例计算。2027年价格学校尚未公布，暂按2026年价格报价。',
    groupClassNote: '每节课50分钟；青少年小组课每班最多8人。',
    roomTableTitle: 'ELSA 房型加价（每4周）',
    roomTableNote: '课程价已含五人间住宿和三餐；住其他房型时，每4周加上下面的金额。全部是校内宿舍，周日入住、周六退房。',
    stayPolicyTitle: 'ELSA 入住与退房提醒',
    stayPolicies: [
      { label: '入住', value: '周日00:00以后', note: '周一不上课，是入学说明会和商场采购日；周二开始上课。' },
      { label: '退房', value: '周六11:00前', note: '订机票前请先确认日期。' },
      { label: '提前入住或延住', value: '每人每天2,000比索（含餐和水电）', note: '视空房而定，须提前向学校申请。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '含五人间住宿和三餐', accommodation: '比五人间多出的房型加价', promotion: '' },
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
    footerNotes: [
      '课程价含课程、住宿和三餐；到校费用、签证与教材按实际发生和学校最新政策确认。',
      '2027年价格和淡季优惠学校尚未公布，暂按2026年价格预估；2027年寒假旺季已满，暑假旺季另有附加费，金额待学校公布。',
    ],
  },
  media: [],
});

/** An ELSA content document (default or published revision). */
export function isElsaContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === ELSA_SCHOOL_CODE
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

/** Fills a saved document up to the current schema; there is no older ELSA document to upgrade. */
export const cloneElsaContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultElsaContentConfig();
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
