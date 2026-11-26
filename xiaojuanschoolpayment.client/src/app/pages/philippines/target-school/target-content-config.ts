// TARGET Global English Academy (宿务): the versioned employee content document. The public page
// (target-school-page.component.ts), its quote (target-page-quote.ts), the local-fee table and the quote image all read
// the published version of this document. Keep it pure data (no Angular, DOM or storage).
// Sources: the school's price list for applications from 2026/07/10 (2026 TARGET最新学费.pdf), the November 2026
// partner notice (upgrade offer extended to entries until 2027/04/04, 2027 peak surcharge) and the offer poster; see
// docs/target-source-2026-11-26.md. Never add the school's address, phone, website, Wi-Fi or social accounts, or any
// agency term (commission and the like).
//
// TARGET prices a course together with its campus room (课程＋住宿套餐). The course price here is the six-person-room
// package; each room adds a fixed amount per four weeks (四人房+80, 三人房+140, 双人房+240, 单人房+500), which
// reproduces every cell of the school's price list exactly. Short stays follow the school's own 1/2/3-week columns
// (0.4, 0.6 and 0.8 of the four-week price); longer stays are the four-week price ÷ 4 × weeks.
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const TARGET_SCHOOL_CODE: CiaContentConfig['schoolCode'] = 'TARGET';

/**
 * Raised when saved documents must take a school notice once (cloneTargetContentConfig):
 * 1 = the shared-template catalogue (room supplements), the 2026-07-10 visa table, the 2027 peak and the extended
 * upgrade offer (2026-11-26).
 */
export const TARGET_POLICY_VERSION = 1;
type TargetQuoteSettings = CiaQuoteSettings & { targetPolicyVersion?: number };

export const TARGET_SIDA_RULE_ID = 'sida-90-percent';
export const TARGET_CAMPAIGN_RULE_ID = 'target-campaign';
export const TARGET_UPGRADE_RULE_ID = 'target-upgrade';
export const TARGET_RETURNING_RULE_ID = 'target-returning-registration';

/** 限时尊享升级计划: register by 2026/11/30 (the card leaves the page the next day), enter 2026/08/23–2027/04/04. */
export const TARGET_UPGRADE_OFFER = {
  registrationEnd: '2026-11-30',
  hideFrom: '2026-12-01',
  entryStart: '2026-08-23',
  entryEnd: '2027-04-04',
} as const;

/**
 * Weeks without the school's campaign discount. 2026 from the price list; 2027 from the November 2026 notice
 * (peak 2027/06/27–08/14, seven weeks; from 08/15 no longer peak), which replaces the price list's 2027/06/28–08/21.
 */
export const TARGET_NO_CAMPAIGN_RANGES = [
  { start: '2026-06-28', end: '2026-08-22' },
  { start: '2027-06-27', end: '2027-08-14' },
] as const;

/** A student whose courses add up to this many weeks or more pays no peak surcharge (still no campaign discount). */
export const TARGET_PEAK_WAIVER_WEEKS = 8;

/** Courses the upgrade offer moves one step up (the poster's paths); the other courses have no upgrade. */
export const TARGET_UPGRADE_PATHS: Readonly<Record<string, string>> = {
  target4: 'TARGET 4 → TARGET 5',
  target5: 'TARGET 5 → TARGET 6',
  target6: 'TARGET 6 → ULTIMATE 8 或雅思课程',
};
/** One room step up, for 8 weeks and more; a single room has no higher type. */
export const TARGET_ROOM_UPGRADES: Readonly<Record<string, string>> = {
  six: '六人房 → 四人房',
  quad: '四人房 → 三人房',
  triple: '三人房 → 双人房',
  twin: '双人房 → 单人房',
};

export const TARGET_IELTS_GUARANTEE_ID = 'ielts-guarantee';
export const TARGET_IELTS_COURSE_IDS: readonly string[] = ['ielts-regular', TARGET_IELTS_GUARANTEE_ID];
/** Courses a child (6 and older) may take with a parent (亲子课程可报名). */
export const TARGET_FAMILY_COURSE_IDS: readonly string[] = ['lite4', 'target4'];

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

// Classes per day from the price list; every class is 45 minutes. The school sets subjects after the level test.
const createCourses = (): CiaCourseContent[] => [
  course('lite4', 'LITE 4', 1280, '每天4节一对一', '想控制预算、留出自由时间，或陪孩子来的家长', '课少、自由时间多；可报亲子课程（孩子6岁以上）。', 0),
  course('target4', 'TARGET 4', 1340, '每天4节一对一 + 3节小组课 + 1节自习课', '想兼顾一对一和同学互动的学生', '学校说大部分学生的入门选择；可报亲子课程（孩子6岁以上）。', 1),
  course('target5', 'TARGET 5', 1400, '每天5节一对一 + 2节小组课 + 1节自习课', '想多上一对一、又保留小组课的学生', '学校的标准课程，学习和生活比较平衡。', 2),
  course('working-holiday', 'Working Holiday 打工度假准备', 1400, '每天5节一对一 + 2节小组课 + 1节自习课', '准备去海外打工度假的学生', '和TARGET 5同价，侧重英语面试和英文简历等实用技能。', 3),
  course('target6', 'TARGET 6', 1520, '每天6节一对一 + 2节小组课', '短期集中学习的学生', '一对一更多，适合短期强化。', 4),
  course('ultimate8', 'TARGET ULTIMATE 8', 1680, '每天8节一对一', '想全部上一对一、短期冲刺的学生', '一对一最多的课程。', 5),
  course('ielts-regular', 'IELTS 雅思常规班', 1680, '每天5节一对一 + 2节小组课 + 1节必修自习', '想系统准备雅思考试的学生', '需雅思3.5左右的英语水平，抵达后测试确认；每周五模考，每天单词测试。', 6),
  course(TARGET_IELTS_GUARANTEE_ID, 'IELTS 雅思保分班（12周）', 1680, '每天5节一对一 + 2节小组课 + 1节必修自习', '有官方雅思成绩、想按学校保分条件学12周的学生', '只按12周报名；第10周参加官方机考（考试费学校承担），按学校条件未达标可免学费续读4周，住宿等费用另付。', 7, 12),
];

const SUPPLEMENT = (amount: number) => `+${amount}美元／4周`;

const createRooms = (): CiaRoomContent[] => [
  room('single', `单人房（${SUPPLEMENT(500)}）`, '单人房', 'S', '单人房', 500, '一人住一间；单人房和双人房是同一种房间。', 0),
  room('twin', `双人房（${SUPPLEMENT(240)}）`, '双人房', 'D', '多人房', 240, '两张单人床。', 1),
  room('triple', `三人房（${SUPPLEMENT(140)}）`, '三人房', 'T', '多人房', 140, '三张单人床，房间带阳台。', 2),
  room('quad', `四人房·上下铺（${SUPPLEMENT(80)}）`, '四人房（上下铺）', 'Q', '多人房', 80, '两组上下铺，床位有帘子。', 3),
  room('six', '六人房·上下铺（课程价已含）', '六人房（上下铺）', 'X', '多人房', 0, '三组上下铺，床位有帘子；课程价按六人房计算。', 4),
];

/**
 * The 2026-07-10 local-fee sheet. Its visa table counts from a 59-day entry (9–12 weeks 6,410; 13–16 weeks 12,240;
 * 17–20 weeks 18,070; 21–24 weeks 23,870 cumulative). The same steps start at the first extension of either entry
 * visa (user decision 2026-11-26: a 30-day entry pays nothing for 4 weeks and its first extension from the 5th week).
 * Extensions past the table are estimated at the last step (5,800) until the school confirms; a stay over 24 weeks
 * adds the 5,000-peso exit clearance.
 */
const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({
    id: 'visa', name: '签证续签', amount: 6410, rates: [6410, 5830, 5830, 5800],
    billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true,
    note: '学校表：读9–12周累计6,410、13–16周12,240、17–20周18,070、21–24周23,870比索（按59天签证入境）；30天签证读4周不用续签，读5周以上从第一次续签起按同样档位计算；以实际办理为准。',
    sortOrder: 0,
  }),
  fee({ id: 'ssp', name: 'SSP特殊学习许可', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '新生入学时由学校代办。', sortOrder: 1 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '和SSP一起办理的外国人证件，只收一次。', sortOrder: 2 }),
  fee({ id: 'acr', name: 'ACR I-CARD', amount: 4300, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次签证续签时办理一次（30天签证第5周起，59天签证第9周起）。', sortOrder: 3 }),
  fee({ id: 'ecc', name: '离境清关（ECC）', amount: 5000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '在菲律宾停留超过24周时另付。', sortOrder: 4 }),
  fee({ id: 'books', name: '教材费', amount: 3000, billingRule: 'per-course-period', includeInTotal: true, note: '1周500、2周1,000、3–4周2,000、5–8周3,000比索，之后每多4周加1,000比索；以实际购买为准。', sortOrder: 5 }),
  fee({ id: 'electricity', name: '电费', amount: 600, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每周基本电费；房间用电超过学校设定的额度要另付。', sortOrder: 6 }),
  fee({ id: 'water', name: '水费', amount: 200, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '按住宿周数计算。', sortOrder: 7 }),
  fee({ id: 'management', name: '管理费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '按住宿周数计算。', sortOrder: 8 }),
  fee({ id: 'deposit', name: '房间押金（可退）', amount: 2500, billingRule: 'optional', includeInTotal: false, note: '退房时没有损坏，毕业时全额退还。', sortOrder: 9 }),
  fee({ id: 'pickup', name: '宿务机场接机', amount: 1200, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '周日08:00–24:00到达；周六08:00–周日07:55或周一00:05–06:00到达另加1,000比索。', sortOrder: 10 }),
  fee({ id: 'send-off', name: '送机', amount: 1800, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '成人1,800比索；独自留学的未成年人1,200比索。', sortOrder: 11 }),
  fee({ id: 'laundry', name: '洗衣', amount: 150, billingRule: 'optional', includeInTotal: false, note: '每次150比索（6公斤），每周最多3次。', sortOrder: 12 }),
  fee({ id: 'extra-night', name: '提前入住或延住', amount: 1500, billingRule: 'optional', includeInTotal: false, note: '每天1,500比索；原则上前后各限1天，须提前预约。', sortOrder: 13 }),
  fee({ id: 'minor-care', name: '未成年人安心服务费', amount: 2000, billingRule: 'optional', includeInTotal: false, note: '每周2,000比索；独自留学的未成年人（含18岁高中生）适用。', sortOrder: 14 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: TARGET_CAMPAIGN_RULE_ID, name: '学校长期优惠', sortOrder: 0, discountType: 'per-course-week',
    description: '3周每周减20美元，4–11周每周减30美元，12周及以上每周减35美元；旺季的周不减',
  }),
  promotion({
    id: TARGET_SIDA_RULE_ID, name: '思达启航9折', sortOrder: 1, discountType: 'percentage', discountValue: 10,
    description: '课程＋住宿套餐减去学校长期优惠后打9折；旺季附加费也打9折；注册费和比索学杂费不打折',
  }),
  promotion({
    id: TARGET_UPGRADE_RULE_ID, name: '限时尊享升级计划', sortOrder: 2, discountType: 'none',
    description: '2026/11/30前报名、2027/04/04前入学：4周以上升1档课程，8周以上再升1档房型，12周以上另选最后4周升ULTIMATE 8或雅思、或2次周末旅游；名额有限',
    registrationEnd: TARGET_UPGRADE_OFFER.registrationEnd, arrivalStart: TARGET_UPGRADE_OFFER.entryStart, arrivalEnd: TARGET_UPGRADE_OFFER.entryEnd,
  }),
  promotion({
    id: TARGET_RETURNING_RULE_ID, name: '复课生免注册费', sortOrder: 3, discountType: 'none', appliesTo: 'school-total', waiveRegistration: true,
    description: '复课生免收注册费。',
  }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索现金缴纳，仅供准备现金参考。签证费用按每位学生选择的签证和停留时间预估；水电和管理费按住宿周数收取；教材按学习周数预估。押金、接送机和洗衣另付，不计入合计。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

/** The two image footer lines the user confirmed for TARGET; keep them word for word. */
const FOOTER_NOTES = [
  '学费部分需到校前2周交齐，可以交由思达启航代收或直接自行转美元给学校；报价以最终确认金额及付款时实际汇率为准。',
  '学杂费为到菲律宾当地需要缴纳的费用，由学校直接收取；报价仅供参考，具体以学校实际收取为准。',
];

export const createDefaultTargetContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: TARGET_SCHOOL_CODE,
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 150,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.6, '3': 0.8 },
    peakSeasonFeePerWeek: 40,
    peakSeasonRanges: [{ id: 'summer-2027', label: '2027暑期旺季', start: '2027-06-27', end: '2027-08-14', enabled: true }],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'TARGET 4周课程＋住宿套餐价',
    courseTableNote: '自2026/07/10起报名适用。套餐价含课程和校内住宿，按六人房计算；住其他房型按下方房型加价。1–3周按学校短期价，4周以上按4周价÷4×周数。',
    groupClassNote: '每节课45分钟；小组课的同学人数和老师由学校安排。',
    roomTableTitle: 'TARGET 房型加价（每4周）',
    roomTableNote: '课程价已含六人房住宿；住其他房型时，每4周加上下面的金额。全部是校内宿舍，周日入住、周六退房。',
    stayPolicyTitle: 'TARGET 入住与退房',
    stayPolicies: [
      { label: '入住', value: '周日至周一早上06:00', note: '以抵达宿务机场的时间为准；周一上午入学测试。' },
      { label: '退房', value: '周六12:00前', note: '订机票前请先确认日期。' },
      { label: '提前入住或延住', value: '每天1,500比索', note: '原则上前后各限1天，须提前预约；房间不够时可能安排其他房型或校外住宿。' },
    ],
    extraNightRates: [],
    targetPolicyVersion: TARGET_POLICY_VERSION,
  } as TargetQuoteSettings,
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，复课生免收', course: '含六人房住宿', accommodation: '比六人房多出的房型加价', promotion: '' },
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
    footerNotes: copyJson(FOOTER_NOTES),
  },
  media: [],
});

/** A TARGET content document (default or published revision). */
export function isTargetContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === TARGET_SCHOOL_CODE
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

/**
 * Version 1: the older TARGET document priced every room at 0 inside per-course package grids and used the old visa
 * table, so the catalogue, local fees and quote settings are replaced once. Media and edited image lines stay.
 */
function upgradeToVersion1(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  clone.courses = copyJson(defaults.courses);
  clone.rooms = copyJson(defaults.rooms);
  clone.localFees = copyJson(defaults.localFees);
  const saved = clone.quoteSettings;
  clone.quoteSettings = { ...copyJson(defaults.quoteSettings) };
  // Keep the registration fee only if someone set a different one on purpose.
  if (typeof saved?.registrationFee === 'number' && saved.registrationFee !== 150) clone.quoteSettings.registrationFee = saved.registrationFee;
  const image = clone.quoteImageSettings;
  if (image) {
    image.localFeeIntro = defaults.quoteImageSettings.localFeeIntro;
    image.paymentNotes = copyJson(defaults.quoteImageSettings.paymentNotes);
    image.localFeeNotes = {};
    image.promotionNotes = {};
    image.supplementalFeeNotes = {};
  }
}

/** Fills a saved or previewed document up to the current schema; returns a copy. */
export const cloneTargetContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultTargetContentConfig();
  const clone = copyJson(value);
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  if (!clone.quoteSettings || ((clone.quoteSettings as TargetQuoteSettings).targetPolicyVersion ?? 0) < 1) {
    upgradeToVersion1(clone, defaults);
  }
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  const settings = clone.quoteSettings as TargetQuoteSettings;
  settings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  settings.peakSeasonRanges ??= copyJson(defaults.quoteSettings.peakSeasonRanges);
  settings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  settings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  settings.extraNightRates ??= [];
  settings.targetPolicyVersion = TARGET_POLICY_VERSION;
  const image = clone.quoteImageSettings;
  image.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  image.localFeeNotes ??= {};
  image.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  image.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  clone.media ??= [];
  return clone;
};
