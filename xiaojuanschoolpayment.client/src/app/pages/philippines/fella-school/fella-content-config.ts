// English Fella's content document: both campuses' courses and rooms (tagged by campus), local fees, offers and
// quote-image copy, one school record and one document (code FELLA). Each campus page reads its own part through
// fellaCampusContent; the employee editors read the whole document. Keep it pure data (no Angular, DOM, storage or
// structuredClone), so the WeChat mini program can bundle it. Sources: see fella-pricing.ts and
// docs/fella-update-2026-11-25.md.
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteImageSettings,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import {
  FELLA_CAMPUS_NAMES,
  FELLA_COURSE_FEES,
  FELLA_ROOM_FEES,
  FELLA_SHORT_STAY_RATIOS,
  type FellaCampus,
} from './fella-pricing';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const FELLA_SIDA_RULE_ID = 'fella-sida-95';
export const FELLA_CHRISTMAS_RULE_ID = 'fella-christmas';
export const FELLA_RETURNING_RULE_ID = 'fella-returning-registration';
/** The July and August 2026 early-bird offers; both ended, so an older saved document has this switched off. */
const ENDED_PROMOTION_IDS = ['fella-july-registration'];

/**
 * Version 1 (2026-11-25): the 2026 school pack. Moves an older saved document once onto the Chinese course names
 * and lines, the campus of each room (1A and 1B are first-campus rooms), the 30/60/90% short stays, the 2026 local-fee
 * sheet and the Christmas and 思达启航 offer terms; saved prices, switches, media and edited image lines are kept.
 */
export const FELLA_POLICY_VERSION = 1;
type FellaQuoteSettings = CiaQuoteSettings & { fellaPolicyVersion?: number };

const course = (item: (typeof FELLA_COURSE_FEES)[number], sortOrder: number): CiaCourseContent => ({
  id: item.id,
  name: item.name,
  tuition: item.tuition,
  tuition2027: item.tuition,
  campus: item.campuses.length === 1 ? item.campuses[0] : 'both',
  courseType: item.familyCourse ? '亲子课程' : '英语课程',
  schedule: item.schedule,
  suitable: item.suitable,
  note: item.note,
  ...(item.allowedWeeks ? { allowedWeeks: [...item.allowedWeeks], minimumWeeks: Math.min(...item.allowedWeeks) } : {}),
  enabled: true,
  sortOrder,
});

const room = (item: (typeof FELLA_ROOM_FEES)[number], sortOrder: number): CiaRoomContent => ({
  id: item.id,
  name: item.name,
  label: item.name,
  code: item.code,
  location: '校内',
  group: item.group,
  campus: item.campuses.length === 1 ? item.campuses[0] : 'both',
  fee: item.fee,
  note: item.note,
  enabled: true,
  sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({ ...value, currency: 'PHP', enabled: true });

/** The 2026 local-fee sheet (paid on the Monday of the first week); amounts in pesos. */
const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({
    id: 'visa-extension', name: '签证续签', amount: 6440, rates: [6440, 4480, 4480, 4480, 5890], tourist59Rates: [6440, 4480, 4480, 4480],
    billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, sortOrder: 0,
    note: '含手续费；30天签证累计6,440／10,920／15,400／19,880／25,770比索，59天签证累计6,440／10,920／15,400／19,880比索；以实际办理为准。',
  }),
  fee({ id: 'ssp', name: 'SSP特别学习许可', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学时办理。', sortOrder: 1 }),
  fee({
    id: 'ssp-e-card', name: 'SSP E-CARD', amount: 4100, secondaryAmount: 4600, secondaryLabel: '只读1周', billingRule: 'once',
    waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP一起办理，只收一次；只读1周时为4,600比索。', sortOrder: 2,
  }),
  fee({ id: 'acr-i-card', name: 'ACR I-CARD', amount: 4100, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次续签时办理一次。', sortOrder: 3 }),
  fee({ id: 'arp', name: 'ARP外国人登记', amount: 500, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '和第一次续签一起办理一次。', sortOrder: 4 }),
  fee({
    id: 'management', name: '综合管理费（含水电和网络）', amount: 500, secondaryAmount: 1000, secondaryLabel: '首周',
    billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, sortOrder: 5,
    note: '按住宿周数收取：首周1,000比索，之后每周500比索；冷气用电另从押金扣，每度20比索。',
  }),
  fee({
    id: 'books', name: '教材费', amount: 2500, secondaryAmount: 1500, secondaryLabel: '读1–2周', billingRule: 'per-course-period',
    includeInTotal: true, sortOrder: 6,
    note: '每种课程先买一套：读1–2周1,500比索，3周以上2,500比索（家长课程1,500）；换课程要买新教材，以实际购买为准。',
  }),
  fee({ id: 'student-id', name: '学生证', amount: 200, billingRule: 'once', includeInTotal: true, note: '入学时办理一次。', sortOrder: 7 }),
  fee({
    id: 'deposit', name: '房间押金（可退）', amount: 3000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, sortOrder: 8,
    note: '按停留周数：1周1,000、2周2,000、3–11周3,000、12周以上4,000比索；扣除冷气电费和损坏后退还。',
  }),
  fee({ id: 'padlock-deposit', name: '挂锁押金（可退）', amount: 100, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '归还挂锁后退还。', sortOrder: 9 }),
  fee({
    id: 'pickup', name: '宿务机场接机', amount: 1000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, sortOrder: 10,
    note: '每人1,000比索，到校后付；亲子课程的家庭成员每人700比索。',
  }),
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

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: FELLA_CHRISTMAS_RULE_ID, name: '2026圣诞优惠', sortOrder: 0, discountType: 'per-course-week', discountValue: 100,
    appliesTo: 'school-total', coverageTarget: 'course', ruleKind: 'fella-christmas-week',
    description: '在读期间包含2026/12/21–12/27或12/28–2027/01/03，每周减100美元，最多200美元；不限课程和房型',
  }),
  promotion({
    id: FELLA_SIDA_RULE_ID, name: '思达启航折扣', sortOrder: 1, discountType: 'percentage', discountValue: 5, minimumCourseWeeks: 4,
    description: '读4周以上（亲子课程除外）：课程费和住宿费扣除圣诞优惠后再享95折',
  }),
  promotion({
    id: FELLA_RETURNING_RULE_ID, name: '老学员返校', sortOrder: 2, discountType: 'none', appliesTo: 'school-total', waiveRegistration: true,
    description: '老学员返校免收一次性注册费。',
  }),
];

const LOCAL_FEE_INTRO = '以下费用入学当周周一在学校用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留时间预估；综合管理费含水电和网络，首周1,000比索、之后每周500比索；教材每种课程买一套。押金、挂锁押金和接机另付，不计入合计。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

const imageSettings = (campus: FellaCampus): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '', promotion: '' },
  promotionNotes: {},
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: LOCAL_FEE_INTRO,
  localFeeNotes: {},
  supplementalFeeNotes: {},
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
    `本报价只含${FELLA_CAMPUS_NAMES[campus]}的课程和房型。`,
    '到校费用、签证与教材按实际发生和学校最新政策确认。',
    '2027年价格学校尚未公布，暂按2026年价格预估；最终以学校价格、空房及优惠确认为准。',
  ],
});

export const createDefaultFellaContentConfig = (): CiaContentConfig => {
  const campus1 = imageSettings('campus1');
  const campus2 = imageSettings('campus2');
  const quoteSettings: FellaQuoteSettings = {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { ...FELLA_SHORT_STAY_RATIOS },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'English Fella 4周课程费',
    courseTableNote: '课程费按4周计算；1–3周按4周价的30%、60%、90%计算，4周以上按比例。2027年价格学校尚未公布，暂按2026年价格预估。',
    groupClassNote: '每节课50分钟；小组课为四人和八人小组。',
    roomTableTitle: 'English Fella 4周住宿费',
    roomTableNote: '全部是校内宿舍，含一日三餐；周日入住、周六退房。',
    stayPolicyTitle: 'English Fella 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '每周日都可以入学，周一开课。' },
      { label: '退房日期', value: '课程结束后的周六12:00前', note: '押金在离校前结算退还。' },
      { label: '提前入住', value: '周五14:00至周六06:00入住加2,000比索，周六06:00–14:00加1,000比索', note: '须提前申请，按空房安排。' },
      { label: '延后退房', value: '每晚2,000比索', note: '须提前申请，按空房安排。' },
    ],
    extraNightRates: [],
    fellaPolicyVersion: FELLA_POLICY_VERSION,
  };
  return {
    schemaVersion: 1,
    schoolCode: 'FELLA',
    courses: FELLA_COURSE_FEES.map(course),
    rooms: FELLA_ROOM_FEES.map(room),
    localFees: createLocalFees(),
    quoteSettings,
    quoteImageSettings: campus1,
    campusQuoteImageSettings: { campus1, campus2 },
    media: [],
  };
};

/** Old default lines of the image copy, replaced once by the policy upgrade when an employee did not edit them. */
const OLD_IMAGE_LINES = {
  registration: '新生一次性收取100美元；老生返校免收注册费。',
  alumni: '老学员结业后可享线上课程及后续留学服务相关优惠。',
  footer: '当前为English Fella',
  localFeeIntro: '学杂费按学生独立计算；不含可退房间押金、接机费及挂锁押金。',
} as const;

function upgradeImageSettings(saved: CiaQuoteImageSettings, base: CiaQuoteImageSettings): CiaQuoteImageSettings {
  const next = { ...saved };
  if (saved.paymentNotes?.registration === OLD_IMAGE_LINES.registration) next.paymentNotes = copyJson(base.paymentNotes);
  if (!saved.alumniBenefitText || saved.alumniBenefitText === OLD_IMAGE_LINES.alumni) next.alumniBenefitText = base.alumniBenefitText;
  if (!saved.footerNotes?.length || saved.footerNotes[0].startsWith(OLD_IMAGE_LINES.footer)) next.footerNotes = [...base.footerNotes];
  if (!saved.localFeeIntro || saved.localFeeIntro === OLD_IMAGE_LINES.localFeeIntro) next.localFeeIntro = base.localFeeIntro;
  // The old notes described the ended July offer and the former order of discounts; the payment rows now say it.
  next.promotionNotes = {};
  next.supplementalFeeNotes = {};
  return next;
}

/** Moves an older saved document onto the 2026 pack once (see FELLA_POLICY_VERSION). */
function upgradeFellaPolicy(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as FellaQuoteSettings;
  if ((settings.fellaPolicyVersion ?? 0) >= FELLA_POLICY_VERSION) return;
  const savedCourses = new Map(clone.courses.map(item => [item.id, item]));
  clone.courses = [
    ...defaults.courses.map(item => {
      const saved = savedCourses.get(item.id);
      return saved ? { ...item, tuition: saved.tuition, tuition2027: saved.tuition2027 ?? saved.tuition, enabled: saved.enabled } : item;
    }),
    ...clone.courses.filter(item => !defaults.courses.some(base => base.id === item.id)),
  ];
  const savedRooms = new Map(clone.rooms.map(item => [item.id, item]));
  clone.rooms = [
    ...defaults.rooms.map(item => {
      const saved = savedRooms.get(item.id);
      return saved ? { ...item, fee: saved.fee, enabled: saved.enabled } : item;
    }),
    ...clone.rooms.filter(item => !defaults.rooms.some(base => base.id === item.id)),
  ];
  clone.localFees = [
    ...copyJson(defaults.localFees),
    ...clone.localFees.filter(item => !defaults.localFees.some(base => base.id === item.id)),
  ];
  const builtIn = new Set(defaults.quoteSettings.promotions.map(rule => rule.id));
  settings.promotions = [
    ...defaults.quoteSettings.promotions.map(rule => {
      const saved = settings.promotions.find(item => item.id === rule.id);
      return saved ? { ...copyJson(rule), enabled: saved.enabled } : copyJson(rule);
    }),
    ...settings.promotions
      .filter(rule => !builtIn.has(rule.id))
      .map(rule => ENDED_PROMOTION_IDS.includes(rule.id) ? { ...rule, enabled: false } : rule),
  ];
  settings.shortStayRatios = { ...defaults.quoteSettings.shortStayRatios };
  settings.minorManagementFeePerPeriod = undefined;
  for (const key of ['localFeeIntro', 'courseTableTitle', 'courseTableNote', 'groupClassNote', 'roomTableTitle', 'roomTableNote', 'stayPolicyTitle'] as const) {
    settings[key] = defaults.quoteSettings[key];
  }
  settings.stayPolicies = copyJson(defaults.quoteSettings.stayPolicies);
  for (const campus of ['campus1', 'campus2']) {
    const saved = clone.campusQuoteImageSettings?.[campus];
    if (saved) clone.campusQuoteImageSettings![campus] = upgradeImageSettings(saved, defaults.campusQuoteImageSettings![campus]);
  }
  settings.fellaPolicyVersion = FELLA_POLICY_VERSION;
}

/** Fills a saved or previewed document up to the current schema and policy; returns a copy. */
export const cloneFellaContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultFellaContentConfig();
  if (value?.schemaVersion !== 1 || value.schoolCode !== 'FELLA') return defaults;
  const clone = copyJson(value);
  const savedVersion = (clone.quoteSettings as FellaQuoteSettings | undefined)?.fellaPolicyVersion ?? 0;
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings = { ...copyJson(defaults.quoteSettings), ...(clone.quoteSettings ?? {}) };
  // The defaults carry the current version; a saved document keeps its own, so an older one is upgraded below.
  (clone.quoteSettings as FellaQuoteSettings).fellaPolicyVersion = savedVersion;
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.media ??= [];
  clone.campusQuoteImageSettings ??= {};
  for (const campus of ['campus1', 'campus2']) {
    const base = defaults.campusQuoteImageSettings![campus];
    const saved = clone.campusQuoteImageSettings[campus] ?? (campus === 'campus1' ? clone.quoteImageSettings : undefined);
    clone.campusQuoteImageSettings[campus] = {
      ...copyJson(base), ...(saved ?? {}),
      paymentNotes: { ...base.paymentNotes, ...(saved?.paymentNotes ?? {}) },
      promotionNotes: { ...base.promotionNotes, ...(saved?.promotionNotes ?? {}) },
      localFeeNotes: { ...base.localFeeNotes, ...(saved?.localFeeNotes ?? {}) },
      supplementalFeeNotes: { ...base.supplementalFeeNotes, ...(saved?.supplementalFeeNotes ?? {}) },
    };
  }
  upgradeFellaPolicy(clone, defaults);
  clone.quoteImageSettings = clone.campusQuoteImageSettings['campus1'];
  return clone;
};

export const fellaQuoteImageSettings = (content: CiaContentConfig, campus: FellaCampus): CiaQuoteImageSettings =>
  content.campusQuoteImageSettings?.[campus] ?? content.quoteImageSettings;

/** Whether a course or room of the shared document belongs to this campus ('both' or untagged: both campuses). */
export const fellaOnCampus = (item: { campus?: string }, campus: FellaCampus): boolean =>
  !item.campus || item.campus === 'both' || item.campus === campus;

/** One campus's part of the shared document: its courses, rooms and quote-image copy. */
export function fellaCampusContent(value: CiaContentConfig, campus: FellaCampus): CiaContentConfig {
  const content = cloneFellaContentConfig(value);
  content.courses = content.courses.filter(item => fellaOnCampus(item, campus));
  content.rooms = content.rooms.filter(item => fellaOnCampus(item, campus));
  content.quoteImageSettings = fellaQuoteImageSettings(content, campus);
  return content;
}
