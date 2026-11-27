// GITC College (Green International Technological College) language center: the versioned employee content document
// shared by its two campus pages, Iloilo and Cebu (Lapu-Lapu). Courses and rooms carry their campus; each page shows
// and quotes only its own campus (gitcCampusContent). Keep it pure data (no Angular, DOM or storage), so the WeChat
// mini program can bundle it.
// Sources (GITC Drive pack, read 2026-11-26): the 2026 brochure (2026-09-03, prices for courses starting before
// 2027-02-15), the 2027 brochure (2026-11-11, “From 15 Feb 2027”), the 2026 local-fee sheet (2026-09-16, “effective for
// applications from 2026-10-01”) and the 2026 orientation guides of both campuses; see docs/gitc-source-2026-11-26.md.
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

export type GitcCampus = 'iloilo' | 'cebu';

/**
 * The content document's school code. `CiaContentConfig['schoolCode']` lists codes in the locked CIA folder, so GITC is
 * cast instead of added there (as SMEAG Encanto); add 'GITC' to that list the next time the user unlocks a CIA change.
 */
export const GITC_SCHOOL_CODE = 'GITC' as string as CiaContentConfig['schoolCode'];

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Courses starting on or after this Monday pay the 2027 price list (the school's “From 15 Feb 2027”); the student
 * arrives the Sunday before, 2027-02-14. Earlier courses pay the 2026 list.
 */
export const GITC_2027_COURSE_START = '2027-02-15';
export const GITC_2027_ARRIVAL_START = '2027-02-14';

/** The longest stay the school's local-fee sheet covers. */
export const GITC_MAX_WEEKS = 24;

/** Visa extension totals (pesos) by months of stay (index 0 = up to 4 weeks), after a 30-day or a 59-day entry. */
export const GITC_VISA_TOTALS_30 = [0, 4170, 9580, 13020, 16460, 19900] as const;
export const GITC_VISA_TOTALS_59 = [0, 0, 5410, 8850, 12290, 15730] as const;

/** Facility fee and on-campus electricity/water of the 2026 local-fee sheet: a 4-week amount, 1–3 weeks by this table. */
export const GITC_FACILITY_PARTIAL = [0, 2000, 3750, 4500] as const;
export const GITC_UTILITY_PARTIAL = [0, 2800, 5250, 6300] as const;

/**
 * GITC-only course field: `tuition` is the 2026 list price and `tuition2027` the 2027 one; 0 means the course is not
 * offered in that period (Iloilo Junior ESL is on the 2026 list only).
 */
export type GitcCourseContent = CiaCourseContent;
/**
 * GITC-only room fields: `fee` is the 2026 price and `fee2027` the 2027 one; 0 means not offered in that period.
 * `price2027Pending` marks a 2027 price the school gives only as a range (“confirmed after a check”), shown as
 * 待学校确认 and never quoted. `shareCount` is how many students of one household must book it together (twin 2,
 * family triple 3; Iloilo only).
 */
export type GitcRoomContent = CiaRoomContent & { price2027Pending?: boolean; pendingRange2027?: string; shareCount?: number };

const course = (
  campus: GitcCampus, key: string, name: string, courseType: string, tuition: number, tuition2027: number, schedule: string,
  suitable: string, note: string, sortOrder: number, extra: Partial<GitcCourseContent> = {},
): GitcCourseContent => ({
  id: `${campus === 'iloilo' ? 'il' : 'cb'}-${key}`, name, courseType, tuition, tuition2027, schedule, suitable, note, campus,
  enabled: true, sortOrder, ...extra,
});

const GUARANTEE_NOTE = '最低报名12周；保分的起点分数、目标分数和周数按学校的保分表，须满足出勤、作业、夜间自习和月考等全部条件，考试费由学生自付。';

function campusCourses(campus: GitcCampus, base: number): GitcCourseContent[] {
  const label = campus === 'iloilo' ? 'Iloilo课程' : 'Cebu课程';
  return [
    course(campus, 'basic', 'Basic ESL 基础英语', label, 700, 700, '每天3节一对一 + 2节小组课', '英语零基础或想轻松打基础的学生', '课程安排较轻，课后时间较多。', base),
    course(campus, 'regular', 'Regular ESL 标准英语', label, 800, 850, '每天4节一对一 + 3节小组课', '想均衡提高听说读写的学生', '一对一和小组课比例均衡的综合英语课程。', base + 1),
    course(campus, 'power', 'Power Speaking 口语强化', label, 900, 1000, '每天7节一对一', '想集中提高口语、减少小组课的学生', '全部为一对一课程。', base + 2),
    course(campus, 'pre-ielts', 'Pre-IELTS 雅思入门', label, 800, 1200, '每天3节一对一 + 4节小组课', '准备雅思、需要先打基础的学生', '每周模考、每月模考；夜间自习可选。', base + 3),
    course(campus, 'pre-toeic', 'Pre-TOEIC 托业入门', label, 800, 1200, '每天3节一对一 + 4节小组课', '准备托业、需要先打基础的学生', '每周模考、每月模考；夜间自习可选。', base + 4),
    course(campus, 'ielts-guarantee', 'IELTS Guarantee 雅思保分', label, 900, 1300, '每天4节一对一 + 4节小组课（2027/02/15前开课为3节一对一 + 4节小组课）', '有明确雅思目标分数、能遵守保分条件的学生', GUARANTEE_NOTE, base + 5, { minimumWeeks: 12 }),
    course(campus, 'toeic-guarantee', 'TOEIC Guarantee 托业保分', label, 900, 1300, '每天4节一对一 + 4节小组课（2027/02/15前开课为3节一对一 + 4节小组课）', '有明确托业目标分数、能遵守保分条件的学生', GUARANTEE_NOTE, base + 6, { minimumWeeks: 12 }),
  ];
}

const createCourses = (): GitcCourseContent[] => [
  ...campusCourses('iloilo', 0),
  course('iloilo', 'junior', 'Junior ESL 青少年英语', 'Iloilo课程', 800, 0, '每天4节一对一 + 2节小组课', '青少年学生（须监护人陪同）', '只在2026年价目表中开设：2027/02/15起开课的学生请选其他课程或学校的青少年营地。', 7),
  ...campusCourses('cebu', 100),
];

const room = (
  campus: GitcCampus, key: string, name: string, group: string, location: '校内' | '校外', fee: number, fee2027: number, note: string,
  sortOrder: number, extra: Partial<GitcRoomContent> = {},
): GitcRoomContent => ({
  id: `${campus === 'iloilo' ? 'il' : 'cb'}-${key}`, name, label: name, code: campus === 'iloilo' ? 'ILOILO' : 'CEBU', location, group,
  fee, fee2027, note, campus, enabled: true, sortOrder, single: false, ...extra,
});

const IL_SINGLE = 'Iloilo 单人房（Studio）';
const IL_SINGLE_B = 'Iloilo 两居室单间（Single B）';
const IL_TWIN = 'Iloilo 双人房（亲友同住）';
const IL_TRIPLE = 'Iloilo 家庭三人（2026年价目）';
const CONDO = '校外公寓，含三餐和到校班车；水电按实际用量另付。';
const TWIN_NOTE = '一间Studio两人同住的每人价格，适合家人或朋友同行；请用多人报价，由同住的两人选同一房型和日期。';
const TRIPLE_NOTE = '两居室由家庭3人同住（一间单人、一间双人）的每人价格；2027年价目表不再列出。请用多人报价，三人选同一房型和日期。';

const createRooms = (): GitcRoomContent[] => [
  // Iloilo: every student lives in an off-campus condo (no campus dormitory).
  room('iloilo', 'one-spatial-single', 'One Spatial 单人房', IL_SINGLE, '校外', 610, 750, `Single A，一人一间Studio。${CONDO}`, 0, { single: true }),
  room('iloilo', 'avida-single', 'Avida 单人房', IL_SINGLE, '校外', 650, 800, `一人一间Studio。${CONDO}`, 1, { single: true }),
  room('iloilo', 'smdc-single', 'SMDC 单人房', IL_SINGLE, '校外', 650, 0, `一人一间Studio，步行约5分钟到SM商场。${CONDO}`, 2,
    { single: true, price2027Pending: true, pendingRange2027: '约900–1,500' }),
  room('iloilo', 'megaworld-single', 'Mega World 单人房', IL_SINGLE, '校外', 750, 0, `一人一间Studio。${CONDO}`, 3,
    { single: true, price2027Pending: true, pendingRange2027: '约900–1,500' }),
  room('iloilo', 'one-spatial-single-b', 'One Spatial Single B 两居室单间', IL_SINGLE_B, '校外', 510, 600,
    `两居室公寓里每人一间卧室，厨房和卫生间共用。${CONDO}`, 4, { single: true }),
  room('iloilo', 'one-spatial-twin', 'One Spatial 双人房', IL_TWIN, '校外', 430, 530, `${TWIN_NOTE}${CONDO}`, 5, { shareCount: 2 }),
  room('iloilo', 'avida-twin', 'Avida 双人房', IL_TWIN, '校外', 450, 580, `${TWIN_NOTE}${CONDO}`, 6, { shareCount: 2 }),
  room('iloilo', 'smdc-twin', 'SMDC 双人房', IL_TWIN, '校外', 450, 0, `${TWIN_NOTE}${CONDO}`, 7,
    { shareCount: 2, price2027Pending: true, pendingRange2027: '约700–900' }),
  room('iloilo', 'megaworld-twin', 'Mega World 双人房', IL_TWIN, '校外', 500, 0, `${TWIN_NOTE}${CONDO}`, 8,
    { shareCount: 2, price2027Pending: true, pendingRange2027: '约700–900' }),
  room('iloilo', 'one-spatial-triple', 'One Spatial 家庭三人', IL_TRIPLE, '校外', 420, 0, `${TRIPLE_NOTE}${CONDO}`, 9, { shareCount: 3 }),
  room('iloilo', 'avida-triple', 'Avida 家庭三人', IL_TRIPLE, '校外', 560, 0, `${TRIPLE_NOTE}${CONDO}`, 10, { shareCount: 3 }),
  room('iloilo', 'smdc-triple', 'SMDC 家庭三人', IL_TRIPLE, '校外', 560, 0, `${TRIPLE_NOTE}${CONDO}`, 11, { shareCount: 3 }),
  room('iloilo', 'megaworld-triple', 'Mega World 家庭三人', IL_TRIPLE, '校外', 685, 0, `${TRIPLE_NOTE}${CONDO}`, 12, { shareCount: 3 }),
  // Cebu: single capsule rooms on campus, or condos nearby.
  room('cebu', 'capsule-regular', '校内胶囊单人间 Regular Size', 'Cebu 校内宿舍', '校内', 300, 450, '校内胶囊式单人间（标准尺寸），含三餐和水电。', 100, { single: true }),
  room('cebu', 'capsule-big', '校内胶囊单人间 Big Size', 'Cebu 校内宿舍', '校内', 320, 550, '校内胶囊式单人间（大尺寸），含三餐和水电。', 101, { single: true }),
  room('cebu', 'condo-single', '校外公寓单人房', 'Cebu 校外公寓', '校外', 850, 980, '校外公寓一人一间，含三餐和到校班车（约10分钟）；水电按实际用量另付。', 102, { single: true }),
  room('cebu', 'condo-twin', '校外公寓双人房', 'Cebu 校外公寓', '校外', 600, 750, '校外公寓两人一间的每人价格，含三餐和到校班车（约10分钟）；水电按实际用量另付。', 103),
];

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({ ...value, currency: 'PHP', enabled: true });

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'pickup-iloilo', name: 'Iloilo机场接机', amount: 1000, billingRule: 'optional', includeInTotal: true, note: 'Iloilo机场到住宿，选择接机时计入。', sortOrder: 0 }),
  fee({ id: 'pickup-kalibo', name: 'Kalibo机场接机', amount: 5000, billingRule: 'optional', includeInTotal: true, note: 'Kalibo（长滩岛）机场到Iloilo，选择时计入。', sortOrder: 1 }),
  fee({ id: 'pickup-cebu', name: '麦克坦机场接机', amount: 1000, billingRule: 'optional', includeInTotal: true, note: '宿务麦克坦机场到学校，选择接机时计入。', sortOrder: 2 }),
  fee({ id: 'facility', name: '设施费', amount: 5000, billingRule: 'per-accommodation-period', periodWeeks: 4, includeInTotal: true, note: '每4周5,000比索；1周2,000、2周3,750、3周4,500比索。', sortOrder: 3 }),
  fee({ id: 'utilities-cebu', name: '水电费（Cebu校内宿舍）', amount: 7000, billingRule: 'per-accommodation-period', periodWeeks: 4, includeInTotal: true, note: '住校内宿舍：每4周7,000比索；1周2,800、2周5,250、3周6,300比索。住校外公寓按实际用量另付。', sortOrder: 4 }),
  fee({ id: 'ssp', name: 'SSP特殊学习许可', amount: 7500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，有效6个月，入学时办理。', sortOrder: 5 }),
  fee({ id: 'ssp-i-card', name: 'SSP I-Card', amount: 4000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: 'SSP签发后办理，只收一次。', sortOrder: 6 }),
  fee({
    id: 'visa-extension', name: '签证延期', amount: 4170, rates: [...GITC_VISA_TOTALS_30], tourist59Rates: [...GITC_VISA_TOTALS_59],
    billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true,
    note: '按入境签证和停留月数合计：30天签证5–8周4,170、9–12周9,580、13–16周13,020、17–20周16,460、21–24周19,900比索。', sortOrder: 7,
  }),
  fee({ id: 'acr-i-card', name: 'ACR I-Card 外国人居留证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '与第一次签证延期一起办理，只收一次。', sortOrder: 8 }),
  fee({ id: 'student-id', name: '学生证', amount: 500, billingRule: 'once', includeInTotal: true, note: '一次性费用，可享GITC合作商家优惠。', sortOrder: 9 }),
  fee({ id: 'books', name: '教材费（预估）', amount: 500, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按实际购买，每本约500比索；按每4周1本预估。', sortOrder: 10 }),
  fee({ id: 'deposit', name: '押金（可退）', amount: 2000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '遵守规定、物品无损坏时离校前退还。', sortOrder: 11 }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索现金缴纳（学校2026年10月起报名的学杂费表），按每位学生的签证、周数和住宿预估；押金另列，不计入合计。';
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultGitcContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: GITC_SCHOOL_CODE,
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: GITC_2027_ARRIVAL_START,
    shortStayRatios: { '1': 0.4, '2': 0.75, '3': 0.9 },
    peakSeasonFeePerWeek: 0,
    peakSeasonRanges: [],
    promotions: [],
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'GITC 课程费 / 4周',
    courseTableNote: '2027/02/15前开课按列表价格；2027/02/15起开课按2027年价格，展开课程可见。每节课45分钟；1/2/3周按4周价的40%、75%、90%计算。',
    groupClassNote: '小组课人数和分班以学校安排为准。',
    roomTableTitle: 'GITC 住宿费 / 4周',
    roomTableNote: '住宿费含三餐；2027/02/15起开课按2027年价格。房间、楼层和室友由学校安排。',
    stayPolicyTitle: 'GITC 入住与退房',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '周一开课；课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '课程结束后的周六', note: '延住请提前向顾问确认。' },
      { label: '两个校区', value: 'Iloilo / Cebu', note: '课程相同，住宿和学杂费不同，按校区分别报价。' },
    ],
    extraNightRates: [],
  } as CiaQuoteSettings,
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '含三餐', promotion: '' },
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
    footerNotes: ['到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房确认为准。'],
  },
  media: [],
});

export const cloneGitcContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultGitcContentConfig();
  const cloned = copyJson(value);
  cloned.courses ??= copyJson(defaults.courses);
  cloned.rooms ??= copyJson(defaults.rooms);
  cloned.localFees ??= copyJson(defaults.localFees);
  cloned.quoteSettings ??= copyJson(defaults.quoteSettings);
  cloned.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  cloned.quoteSettings.peakSeasonRanges ??= [];
  cloned.quoteSettings.promotions ??= [];
  cloned.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  cloned.quoteSettings.extraNightRates ??= [];
  cloned.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  cloned.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  cloned.quoteImageSettings.localFeeNotes ??= {};
  cloned.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  cloned.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  cloned.media ??= [];
  return cloned;
};

/** Local-fee rows that belong to one campus only. */
const CAMPUS_ONLY_FEES: Readonly<Record<string, GitcCampus>> = {
  'pickup-iloilo': 'iloilo',
  'pickup-kalibo': 'iloilo',
  'pickup-cebu': 'cebu',
  'utilities-cebu': 'cebu',
};

/** One campus's part of the document: its courses and rooms, and only the local fees that apply there. */
export function gitcCampusContent(value: CiaContentConfig, campus: GitcCampus): CiaContentConfig {
  const content = cloneGitcContentConfig(value);
  content.courses = content.courses.filter(item => (item.campus ?? 'iloilo') === campus);
  content.rooms = content.rooms.filter(item => (item.campus ?? 'iloilo') === campus);
  content.localFees = content.localFees.filter(rule => !CAMPUS_ONLY_FEES[rule.id] || CAMPUS_ONLY_FEES[rule.id] === campus);
  return content;
}
