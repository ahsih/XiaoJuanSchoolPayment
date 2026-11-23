// B'Cebu's versioned employee content document: courses, rooms, local fees, promotions and quote-image copy.
// The public page (bcebu-school-page.component.ts), its calculator (bcebu-page-quote.ts), the local-fee table and
// the quote image all read the published version of this document. Keep it pure data.
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPeakSeasonRange,
  CiaPromotionRule,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import { copyContentData } from '../copy-content-data';
import {
  BCEBU_COURSES,
  BCEBU_IELTS_GUARANTEE_ID,
  BCEBU_LOCAL_FEE_INTRO,
  BCEBU_LONG_STAY_NOTE,
  BCEBU_LONG_STAY_TIERS,
  BCEBU_REGISTRATION_NOTE,
  BCEBU_REPORTER_NOTE,
  BCEBU_ROOMS,
} from './bcebu-pricing';

/**
 * Raised when saved documents must inherit a school notice once (cloneBCebuContentConfig):
 * 2 = the 2026 price list read again, the 2026-10-19 orientation's local fees and the 2027 off-season and summer
 *     notices (added 2026-11-23, when the page moved onto the shared template).
 */
export const BCEBU_POLICY_VERSION = 2;
type BCebuQuoteSettings = CiaQuoteSettings & { bcebuPolicyVersion?: number };

export const BCEBU_SIDA_RULE_ID = 'bcebu-sida-90';
export const BCEBU_LONG_STAY_RULE_ID = 'bcebu-long-stay';
export const BCEBU_REPORTER_RULE_ID = 'bcebu-reporter';
export const BCEBU_FAMILY_RULE_ID = 'bcebu-family-off-season';
export const BCEBU_REGISTRATION_RULE_ID = 'bcebu-registration-waiver';
export const BCEBU_RETURNING_RULE_ID = 'bcebu-returning-registration';
/** Off-season windows: the percentage rules whose Monday entry dates decide them. */
export const BCEBU_OFF_SEASON_RULE_IDS: readonly string[] = [
  'bcebu-off-season-spring', 'bcebu-off-season-fall', 'bcebu-off-season-2027-spring', 'bcebu-off-season-2027-fall',
];

const course = (value: typeof BCEBU_COURSES[number], sortOrder: number): CiaCourseContent => ({
  id: value.id,
  name: value.name,
  tuition: value.tuition,
  tuition2027: value.tuition,
  schedule: value.schedule,
  suitable: value.suitable,
  note: value.note,
  enabled: true,
  sortOrder,
  ...(value.id === BCEBU_IELTS_GUARANTEE_ID ? { minimumWeeks: 12, allowedWeeks: [12] } : {}),
});

const room = (value: typeof BCEBU_ROOMS[number], sortOrder: number): CiaRoomContent => ({
  id: value.id,
  name: value.name,
  label: value.name,
  code: value.id,
  location: '校内',
  group: value.group,
  fee: value.fee,
  note: value.note,
  enabled: true,
  sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value,
  currency: 'PHP',
  enabled: true,
});

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: (value.sortOrder + 1) * 10,
  stackable: true,
  newStudentsOnly: false,
  discountType: 'percentage',
  discountValue: 10,
  appliesTo: 'tuition-and-accommodation',
  waiveRegistration: false,
  minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'none',
  ...value,
});

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取；1–24周只办一次。', sortOrder: 0 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP同时办理，每位学生都要办，只收一次。', sortOrder: 1 }),
  fee({ id: 'acr-i-card', name: 'ACR I-CARD 外国人身份证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '在菲律宾停留超过59天（约第9周起）须办理，须本人到移民局拍照和录指纹，学校统一安排。', sortOrder: 2 }),
  fee({ id: 'arp', name: 'ARP外国人登记', amount: 200, futureEffectiveStart: '2027-01-01', futureAmount: 700, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '首次续签前须本人到移民局登记；加急服务费200比索，2027年1月1日起入学另收ARP费500比索（共700比索）。', sortOrder: 3 }),
  fee({ id: 'management', name: '维护管理费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '含清洁和公共设施维护；按住宿周数，每周500比索。', sortOrder: 4 }),
  fee({ id: 'electricity', name: '电费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '每周含15千瓦时，超出部分每千瓦时20比索（多人间按人数均摊），从押金结算。', sortOrder: 5 }),
  fee({ id: 'water', name: '水费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '按住宿周数，每周500比索。', sortOrder: 6 }),
  fee({ id: 'visa-extension', name: '签证续签', amount: 5130, rates: [5130, 6400, 4430], tourist59Rates: [6400, 4430], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '每次延长约30天：30天签证依次5,130／6,400／4,430比索，59天签证从6,400比索起，之后每次4,430比索；学校统一办理，续签时护照交移民局约3天。', sortOrder: 7 }),
  fee({ id: 'books', name: '教材费', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周约1,500–2,500比索（每本300–500比索），按每4周2,000比索预估；按实际购买结算。', sortOrder: 8 }),
  fee({ id: 'student-id', name: '学生证', amount: 200, billingRule: 'once', includeInTotal: true, note: '一次性费用；丢失补办500比索。', sortOrder: 9 }),
  fee({ id: 'pickup', name: '宿务马克坦机场接机', amount: 1000, secondaryAmount: 1500, secondaryLabel: '其他时间', billingRule: 'optional', includeInTotal: false, note: '周六16:00至周一01:00抵达每人1,000比索，其他时间每人1,500比索；毕业送机每人1,000比索。', sortOrder: 10 }),
  fee({ id: 'deposit', name: '宿舍押金', amount: 3000, secondaryAmount: 5000, secondaryLabel: '5周及以上', billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人收取，4周以内3,000比索，5周及以上5,000比索；超额电费和损坏从押金扣除，毕业当天下午退还。', sortOrder: 11 }),
];

const createPeakSeasonRanges = (): CiaPeakSeasonRange[] => [
  { id: 'bcebu-summer-2026', label: '2026暑假旺季', start: '2026-07-05', end: '2026-08-15', enabled: true },
  { id: 'bcebu-summer-2027', label: '2027暑假旺季', start: '2027-06-27', end: '2027-08-21', enabled: true },
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({ id: BCEBU_REGISTRATION_RULE_ID, name: '思达启航免注册费', description: '通过思达启航报名，免收新生一次性注册费。', sortOrder: 0, newStudentsOnly: true, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true }),
  promotion({ id: BCEBU_LONG_STAY_RULE_ID, name: '长期优惠', description: BCEBU_LONG_STAY_NOTE, sortOrder: 1, discountType: 'fixed', discountValue: 50, minimumCourseWeeks: 8, discountTiers: { ...BCEBU_LONG_STAY_TIERS } }),
  promotion({ id: BCEBU_REPORTER_RULE_ID, name: '记者活动优惠', description: BCEBU_REPORTER_NOTE, sortOrder: 2, discountType: 'per-course-week', discountValue: 25, appliesTo: 'tuition', minimumCourseWeeks: 4, arrivalStart: '2026-02-16', arrivalEnd: '2026-12-28' }),
  promotion({ id: 'bcebu-off-season-spring', name: '2026春季淡季优惠', description: '2026/2/16–6/29入学（周一），课程和住宿85折，亲子家庭9折。', sortOrder: 3, discountValue: 15, arrivalStart: '2026-02-16', arrivalEnd: '2026-06-29' }),
  promotion({ id: 'bcebu-off-season-fall', name: '2026秋冬淡季优惠', description: '2026/8/17–12/28入学（周一），课程和住宿85折，亲子家庭9折。', sortOrder: 4, discountValue: 15, arrivalStart: '2026-08-17', arrivalEnd: '2026-12-28' }),
  promotion({ id: 'bcebu-off-season-2027-spring', name: '2027上半年淡季优惠', description: '2027/2/15–6/21入学（周一），课程和住宿9折，亲子家庭同样9折；可与长期优惠叠加。', sortOrder: 5, discountValue: 10, arrivalStart: '2027-02-15', arrivalEnd: '2027-06-21' }),
  promotion({ id: 'bcebu-off-season-2027-fall', name: '2027下半年淡季优惠', description: '2027/8/23–12/27入学（周一），课程和住宿9折，亲子家庭同样9折；可与长期优惠叠加。', sortOrder: 6, discountValue: 10, arrivalStart: '2027-08-23', arrivalEnd: '2027-12-27' }),
  promotion({ id: BCEBU_FAMILY_RULE_ID, name: '亲子淡季折扣上限', description: '亲子家庭在淡季入学时，课程和住宿最多9折。', sortOrder: 7, discountValue: 10 }),
  promotion({ id: BCEBU_SIDA_RULE_ID, name: '思达启航折扣', description: '课程和住宿在长期、记者活动和淡季优惠后再享9折。', sortOrder: 8 }),
  promotion({ id: BCEBU_RETURNING_RULE_ID, name: '老学员返校', description: '老学员返校免收一次性注册费。', sortOrder: 9, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true }),
];

/** Extra nights before check-in or after check-out (price list footnote), per night. */
const createExtraNightRates = () => [
  { label: '单人间、双人间+客厅', amount: 2500 },
  { label: '双人间、2+1宿舍', amount: 2000 },
  { label: '三人间', amount: 1500 },
];

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultBCebuContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'BCEBU',
  courses: BCEBU_COURSES.map(course),
  rooms: BCEBU_ROOMS.map(room),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    minorManagementFeeUnder15PerWeek: 100,
    minorManagementFeeAge15To17PerWeek: 50,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.6, '3': 0.8 },
    peakSeasonFeePerWeek: 40,
    peakSeasonRanges: createPeakSeasonRanges(),
    promotions: createPromotions(),
    localFeeIntro: BCEBU_LOCAL_FEE_INTRO,
    courseTableTitle: "B'Cebu 2026年4周课程费",
    courseTableNote: '以下为周一至周五的每日课程，课程费按4周计算；学校尚未公布2027年价格，暂按2026年价格报价。',
    groupClassNote: '小组课每班最多6人；选修课每天最多2节。雅思课程可加选斯巴达管理，每4周另付3,000比索（到校缴纳）。',
    roomTableTitle: "B'Cebu 2026年4周住宿费",
    roomTableNote: '住宿含一日三餐；宿舍每周打扫2次（前一天在一楼接待室预约）；学校不提供洗衣，一楼有付费洗衣房。50岁以上只可选单人间。',
    stayPolicyTitle: "B'Cebu 入住与管理提醒",
    stayPolicies: [
      { label: '入住日期', value: '周六或周日入住', note: '课程从周一开始，周一上午分级测试。' },
      { label: '退房日期', value: '课程结束后的周六13:00前', note: '提前入住或延住按晚另付，见下方额外住宿费用。' },
      { label: '未成年学生', value: '无家长陪同另收管理费', note: '高中生每周50美元，小学和初中生每周100美元；暑假不单独接收16岁以下学生。' },
    ],
    extraNightRates: createExtraNightRates(),
    bcebuPolicyVersion: BCEBU_POLICY_VERSION,
  } as BCebuQuoteSettings,
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: BCEBU_REGISTRATION_NOTE, course: '', accommodation: '', promotion: '' },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: BCEBU_LOCAL_FEE_INTRO,
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

// ---- upgrade of documents saved before version 2 --------------------------------------------------------------

/** Course and room text saved by version 1; only rows nobody has edited since are replaced. */
const V1_COURSE_NAMES: Record<string, string> = {
  'speed-esl': 'Speed ESL', 'intensive-esl': 'Intensive ESL', ielts: 'IELTS', 'ielts-sparta': 'IELTS Sparta',
  'ielts-guarantee': 'IELTS GUARANTEE', 'b-sparta': "B'SPARTA", 'business-english': '商务英语', 'junior-esl': 'Junior ESL',
  'lite-esl4': 'Lite ESL4', 'lite-esl2-40-plus': 'Lite ESL2（40岁以上）', kindergarten: '幼儿园',
};
const V1_ROOM_NAMES: Record<string, string> = {
  'single-newtown-view': '单人间外景（马克坦新城）', 'single-garden-view': '单人间内景（校内花园）', double: '双人间',
  'double-living-room': '双人间+客厅', 'family-triple-extra-bed': '双人间+客厅（加床亲子3人）',
  'two-plus-one': '2+1宿舍（上下铺）', 'triple-bunk': '三人间（上下铺）',
};
const V1_ROOM_GROUPS = ['单人间', '家庭与套房', '多人间'];
/** Local fees whose amounts or billing the 2026-10-19 orientation changed; saved copies become the new rows. */
const REPLACED_FEE_IDS = ['acr-i-card', 'arp', 'management', 'utilities', 'electricity', 'water', 'visa-extension', 'books', 'student-id', 'pickup', 'deposit'];
const V1_INTROS = [
  '学杂费为到校后学校及相关部门收取的费用，与思达启航无关，仅供参考，以到校比索现金实收为准。接机费和可退房间押金另列，不计入学杂费合计。',
];
const V1_TABLE_TEXT: Record<string, string> = {
  courseTableNote: '以下课程费以美元计价，住宿费另计；课程资格、年龄条件和正式课表以学校确认为准。',
  groupClassNote: 'IELTS保证班需雅思官方成绩，12周起报；40岁以上轻量课、青少年与幼儿园课程须按年龄确认。',
  roomTableNote: '以下住宿费以美元计价；50岁以上、亲子、同行关系和淡季开放条件会影响可选房型。',
};
const V1_STAY_POLICY_LABELS = '入住日期|退房日期|未成年管理';
const V1_IMAGE_COPY = {
  paymentNotes: { course: '按所选课程、周数及日期计算', accommodation: '按所选房型、周数及日期计算', promotion: '按当前有效规则及学生条件自动计算' } as Record<string, string>,
  alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
  footerNote: '课程、住宿和优惠按当前选择及有效规则计算。',
};
const V1_PROMOTION_TEXT: Record<string, string[]> = {
  [BCEBU_SIDA_RULE_ID]: ['课程及住宿在长期、记者活动和淡季优惠后再享9折。', '课程及住宿在记者、淡季优惠后再享9折。'],
  [BCEBU_LONG_STAY_RULE_ID]: ['8周50美元、12周100美元、16周200美元、20周300美元、24周400美元；之后每满4周增加100美元，可与其他符合条件的优惠叠加。'],
  'bcebu-off-season-spring': ['2026/2/16–6/29入学；成人课程及住宿85折，亲子9折。'],
  'bcebu-off-season-fall': ['2026/8/17–12/28入学；成人课程及住宿85折，亲子9折。'],
  [BCEBU_FAMILY_RULE_ID]: ['符合淡季入学日期的亲子方案按课程及住宿9折。'],
};
const V1_PROMOTION_NAMES: Record<string, string> = {
  [BCEBU_SIDA_RULE_ID]: '思达启航专属折扣', 'bcebu-off-season-spring': '春季淡季优惠', 'bcebu-off-season-fall': '秋冬淡季优惠',
  [BCEBU_FAMILY_RULE_ID]: '亲子淡季比例',
};

/** Brings a document saved before version 2 onto the 2026-11 school pack, keeping every other employee edit. */
function upgradeBCebuPolicy(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as BCebuQuoteSettings;
  if ((settings.bcebuPolicyVersion ?? 0) >= BCEBU_POLICY_VERSION) return;
  const defaultCourses = new Map(defaults.courses.map(item => [item.id, item]));
  for (const item of clone.courses ?? []) {
    const fresh = defaultCourses.get(item.id);
    if (!fresh) continue;
    if (item.name === V1_COURSE_NAMES[item.id]) {
      Object.assign(item, { name: fresh.name, schedule: fresh.schedule, suitable: fresh.suitable, note: fresh.note });
    }
    if (fresh.minimumWeeks) item.minimumWeeks ??= fresh.minimumWeeks;
    if (fresh.allowedWeeks) item.allowedWeeks ??= [...fresh.allowedWeeks];
  }
  const defaultRooms = new Map(defaults.rooms.map(item => [item.id, item]));
  for (const item of clone.rooms ?? []) {
    const fresh = defaultRooms.get(item.id);
    if (!fresh) continue;
    if (item.name === V1_ROOM_NAMES[item.id]) Object.assign(item, { name: fresh.name, label: fresh.label, note: fresh.note });
    if (V1_ROOM_GROUPS.includes(item.group)) item.group = fresh.group;
  }
  const kept = (clone.localFees ?? []).filter(rule => !REPLACED_FEE_IDS.includes(rule.id));
  for (const rule of defaults.localFees) {
    if (!kept.some(item => item.id === rule.id)) kept.push(copyContentData(rule));
  }
  clone.localFees = kept.sort((a, b) => a.sortOrder - b.sortOrder);
  const promotions = settings.promotions;
  for (const rule of promotions) {
    const fresh = defaults.quoteSettings.promotions.find(item => item.id === rule.id);
    if (!fresh) continue;
    if (V1_PROMOTION_TEXT[rule.id]?.includes(rule.description)) rule.description = fresh.description;
    if (V1_PROMOTION_NAMES[rule.id] === rule.name) rule.name = fresh.name;
    if (rule.id === BCEBU_LONG_STAY_RULE_ID) {
      rule.discountTiers ??= { ...BCEBU_LONG_STAY_TIERS };
      delete rule.incrementWeeks;
      delete rule.incrementValue;
    }
    if (rule.id === BCEBU_REPORTER_RULE_ID) {
      if (rule.description.startsWith('2026/2/16–6/29、2026/8/17–12/28入学；记者活动折扣')) rule.description = fresh.description;
      rule.arrivalStart ??= fresh.arrivalStart;
      rule.arrivalEnd ??= fresh.arrivalEnd;
    }
    if (rule.sortOrder !== fresh.sortOrder) rule.sortOrder = fresh.sortOrder;
  }
  for (const rule of defaults.quoteSettings.promotions) {
    if (!promotions.some(item => item.id === rule.id)) promotions.push(copyContentData(rule));
  }
  promotions.sort((a, b) => a.sortOrder - b.sortOrder);
  for (const range of defaults.quoteSettings.peakSeasonRanges) {
    if (!settings.peakSeasonRanges.some(item => item.id === range.id)) settings.peakSeasonRanges.push({ ...range });
  }
  for (const [key, old] of Object.entries(V1_TABLE_TEXT)) {
    const record = settings as unknown as Record<string, string>;
    if (record[key] === old) record[key] = (defaults.quoteSettings as unknown as Record<string, string>)[key];
  }
  if (V1_INTROS.includes(settings.localFeeIntro)) settings.localFeeIntro = BCEBU_LOCAL_FEE_INTRO;
  if (settings.stayPolicies?.map(item => item.label).join('|') === V1_STAY_POLICY_LABELS) {
    settings.stayPolicies = copyContentData(defaults.quoteSettings.stayPolicies);
  }
  if (!settings.extraNightRates?.length) settings.extraNightRates = createExtraNightRates();
  settings.bcebuPolicyVersion = BCEBU_POLICY_VERSION;
}

/** Replaces only image lines nobody has edited since they were the version 1 defaults. */
function upgradeBCebuImageCopy(settings: CiaContentConfig['quoteImageSettings']): void {
  const notes = settings.paymentNotes as unknown as Record<string, string>;
  for (const [key, old] of Object.entries(V1_IMAGE_COPY.paymentNotes)) {
    if (notes[key] === old) notes[key] = '';
  }
  if (settings.alumniBenefitText === V1_IMAGE_COPY.alumniBenefitText) settings.alumniBenefitText = ALUMNI_BENEFIT_TEXT;
  settings.footerNotes = settings.footerNotes.filter(note => note !== V1_IMAGE_COPY.footerNote);
  if (V1_INTROS.includes(settings.localFeeIntro)) settings.localFeeIntro = BCEBU_LOCAL_FEE_INTRO;
}

export const cloneBCebuContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultBCebuContentConfig();
  const clone = copyContentData(value);
  clone.courses ??= copyContentData(defaults.courses);
  clone.rooms ??= copyContentData(defaults.rooms);
  clone.localFees ??= copyContentData(defaults.localFees);
  clone.quoteSettings ??= copyContentData(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= copyContentData(defaults.quoteSettings.peakSeasonRanges);
  clone.quoteSettings.promotions ??= [];
  clone.quoteSettings.stayPolicies ??= copyContentData(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  const upgrading = ((clone.quoteSettings as BCebuQuoteSettings).bcebuPolicyVersion ?? 0) < BCEBU_POLICY_VERSION;
  upgradeBCebuPolicy(clone, defaults);
  clone.quoteImageSettings ??= copyContentData(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyContentData(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyContentData(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyContentData(defaults.quoteImageSettings.footerNotes);
  if (upgrading) upgradeBCebuImageCopy(clone.quoteImageSettings);
  clone.media ??= [];
  return clone;
};
