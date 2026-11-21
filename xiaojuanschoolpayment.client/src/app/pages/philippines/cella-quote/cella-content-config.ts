import {
  CiaContentConfig,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteImageSettings,
  CiaQuoteSettings,
} from '../cia-school/cia-content-config';
import { ASSOCIATION_PEAK_POLICY_VERSION } from '../association-peak-surcharge';
import {
  CELLA_2027_PROMOTION,
  CELLA_CAMPUS_NAMES,
  CELLA_COURSES,
  CELLA_FAMILY_PACKAGE_WEEKS,
  CELLA_LOCAL_FEES_2027,
  CELLA_LOW_SEASON_END,
  CELLA_LOW_SEASON_START,
  CELLA_PEAK_SEASON_WEEKLY_FEE,
  CELLA_REGISTRATION_FEE,
  CELLA_ROOMS,
  CELLA_SIDA_RATE,
  CellaCampus,
  CellaRoom,
} from './cella-pricing';

/** Bumped when CELLA's school price list changes; older saved documents take the new prices once. */
export const CELLA_POLICY_VERSION = 20271101;
type CellaQuoteSettings = CiaQuoteSettings & { cellaPolicyVersion?: number };
const CELLA_POLICY_MARK = { cellaPolicyVersion: CELLA_POLICY_VERSION };

/** Rooms renamed in 2027 (the Alicia outside dormitory became STACIA HOTEL). */
const CELLA_RENAMED_ROOMS = new Set(['premium-alicia-single', 'premium-alicia-twin']);

/**
 * Bumped when the page copy defaults change with the move onto the shared school template (2026-11-21); a saved
 * document then takes the new defaults once, but only for lines nobody has edited.
 */
export const CELLA_PAGE_VERSION = 1;
type CellaPageSettings = { cellaPageVersion?: number };

/**
 * Bumped with the 2027 family package table and the 思达启航折扣 (2026-11-21): a saved document takes the new family
 * packages (the 2026 ones are removed) and any missing default offer once; other courses and edits stay as saved.
 */
export const CELLA_FAMILY_VERSION = 2027;
type CellaFamilySettings = { cellaFamilyVersion?: number };

const LOCAL_FEE_INTRO = '以下费用以比索计价，到校后在学校缴纳；接机、洗衣和可退押金另列。';
/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';
const FOOTER_NOTES = ['到校学杂费、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房、活动名额及优惠资格确认为准。'];
const SHORT_STAY_NOTE = '住宿按每人4周计价；1–3周按4周价格的40%／65%／85%计算。';
// Short titles: the page already names its campus, and a 375px phone cuts off longer ones.
const tableCopy = (campus: CellaCampus) => ({
  courseTableTitle: '2027年4周课程费',
  courseTableNote: '2027年课程价格；课量以学校最新资料为准。',
  groupClassNote: campus === 'premium' ? '小组课每班最多4人，大团体课每班最多8人。' : '',
  roomTableTitle: '2027年4周住宿费',
  roomTableNote: campus === 'uni'
    ? `${SHORT_STAY_NOTE}JDN是校外宿舍，到校上课需通勤，空房和接驳请先让顾问确认。`
    : `${SHORT_STAY_NOTE}STACIA HOTEL是校外宿舍，空房和通勤请先让顾问确认。`,
});

/** Defaults saved before CELLA_PAGE_VERSION 1, so only untouched lines are replaced. */
const OLD_PAGE_COPY = {
  localFeeIntro: '当地费用按每名学生实际就读周数预估；家庭套餐已包含的项目不重复计费。',
  paymentNotes: {
    registration: '每名普通课程学生一次性收取；家庭套餐整包价已包含注册费。',
    course: '课程名称、课量、日期及金额按当前选择自动计算。',
    accommodation: '房型、日期及金额按当前选择自动计算；空房以学校确认为准。',
    promotion: '优惠金额和资格由当前报价规则自动计算。',
  } as Record<string, string>,
  alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
  footerNotes: (campus: CellaCampus) => [
    `${CELLA_CAMPUS_NAMES[campus]}课程与住宿按周日开始、周六结束。`,
    '当地费用及签证费用为预估，最终以学校及移民局实际收取为准。',
    '最终以学校价格、空房、活动名额及优惠资格确认为准。',
  ],
  table: (campus: CellaCampus) => ({
    courseTableTitle: `${CELLA_CAMPUS_NAMES[campus]}课程与学费`,
    courseTableNote: '2027年课程价格；课量和家庭套餐内容以学校最新资料为准。',
    groupClassNote: '课程、家庭组合、年龄与入学条件须按所选方案确认。',
    roomTableTitle: `${CELLA_CAMPUS_NAMES[campus]}住宿费`,
    roomTableNote: '住宿按每人计价；家庭套餐按整包价计算。',
  }) as Record<string, string>,
};

/** Moves a document saved before the template page onto its copy defaults; edited lines stay as saved. */
function upgradePageCopy(clone: CiaContentConfig, defaults: CiaContentConfig, campus: CellaCampus): void {
  const settings = clone.quoteSettings as CiaQuoteSettings & CellaPageSettings;
  const oldGroup = CELLA_CAMPUS_NAMES[campus];
  const rooms = new Map(defaults.rooms.map(item => [item.id, item]));
  for (const room of clone.rooms) {
    const fresh = rooms.get(room.id);
    if (fresh && room.group === oldGroup) Object.assign(room, { group: fresh.group, location: fresh.location });
  }
  if (settings.localFeeIntro === OLD_PAGE_COPY.localFeeIntro) settings.localFeeIntro = LOCAL_FEE_INTRO;
  const table = settings as unknown as Record<string, string>;
  const freshTable = tableCopy(campus) as Record<string, string>;
  for (const [key, old] of Object.entries(OLD_PAGE_COPY.table(campus))) {
    if (table[key] === old) table[key] = freshTable[key];
  }
  const image = clone.quoteImageSettings;
  const notes = image.paymentNotes as unknown as Record<string, string>;
  for (const [key, old] of Object.entries(OLD_PAGE_COPY.paymentNotes)) {
    if (notes[key] === old) notes[key] = (defaults.quoteImageSettings.paymentNotes as unknown as Record<string, string>)[key];
  }
  if (image.localFeeIntro === OLD_PAGE_COPY.localFeeIntro) image.localFeeIntro = LOCAL_FEE_INTRO;
  if (image.alumniBenefitText === OLD_PAGE_COPY.alumniBenefitText) image.alumniBenefitText = ALUMNI_BENEFIT_TEXT;
  if (JSON.stringify(image.footerNotes) === JSON.stringify(OLD_PAGE_COPY.footerNotes(campus))) image.footerNotes = [...FOOTER_NOTES];
  if (image.supplementalFeeNotes) delete image.supplementalFeeNotes['optional:房间押金（需确认）'];
  settings.cellaPageVersion = CELLA_PAGE_VERSION;
}

const fee = (id: string, name: string, amount: number, billingRule: CiaLocalFeeRule['billingRule'], note: string, sortOrder: number): CiaLocalFeeRule => ({
  id, name, amount, billingRule, note, sortOrder,
  currency: 'PHP', enabled: true, includeInTotal: true,
});

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder' | 'ruleKind'>): CiaPromotionRule => ({
  enabled: true, priority: value.sortOrder * 10, stackable: true, newStudentsOnly: false,
  discountType: 'fixed', discountValue: 0, appliesTo: 'school-total', waiveRegistration: false,
  minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none',
  ...value,
});

/** CELLA (2026-11-21): 6+2／9+3 combine only with the agent 9折 (思达启航折扣) and the Christmas offer. */
const SOCIAL_NOTES: Record<string, string> = {
  'cella-social-6-plus-2': '课程与四人房按6周收费、实际就读8周；须完成活动要求，只可与思达启航9折和圣诞优惠同享。',
  'cella-social-9-plus-3': '课程与四人房按9周收费、实际就读12周；须完成活动要求，只可与思达启航9折和圣诞优惠同享。',
};
/** The image notes saved before CELLA_FAMILY_VERSION; untouched ones take the wording above. */
const OLD_SOCIAL_NOTES: Record<string, string> = {
  'cella-social-6-plus-2': '课程与四人房按6周收费、实际就读8周；须完成活动要求，不与其他优惠叠加。',
  'cella-social-9-plus-3': '课程与四人房按9周收费、实际就读12周；须完成活动要求，不与其他优惠叠加。',
};

const quoteImageSettings = (campus: CellaCampus): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '一次性费用，老学员返校免费',
    course: '',
    accommodation: '',
    promotion: '',
  },
  promotionNotes: {
    'cella-social-6-plus-2': SOCIAL_NOTES['cella-social-6-plus-2'],
    'cella-social-9-plus-3': SOCIAL_NOTES['cella-social-9-plus-3'],
    'cella-low-season': '活动期内每个完整4周优惠100美元，课程与住宿不重复扣减。',
    'cella-premium-six-person': 'Premium六人房活动期内按499美元／4周计算，不再叠加淡季100美元优惠。',
    'cella-long-stay': '符合活动期长期报名档位时自动计算，可与当前允许的住宿优惠叠加。',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: LOCAL_FEE_INTRO,
  localFeeNotes: {},
  supplementalFeeNotes: {
    'payment:暑期附加费': '2026年40美元／周，2027年起60美元／周；同一周课程与住宿只计一次，不参与优惠。',
    'payment:未成年人管理费': '25美元／周／人，仅在当前学生选择并符合条件时计入。',
    'optional:洗衣服务（价格参考）': '按实际重量和学校现场标准结算，不计入学杂费合计。',
    'optional:宿务麦克坦机场接机（价格参考）': '可选，须确认航班与车辆安排，不计入学杂费合计。',
    'optional:房间押金（可退参考）': '按住宿周数及学校规则收取；退房检查后按规定退还。',
  },
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
  footerNotes: [...FOOTER_NOTES],
});

/** Rooms by building: campus dormitory first, then the outside dormitory (JDN for Uni, STACIA HOTEL for Premium). */
/** Price-list groups by occupancy, as CIA's; each card's 校内／校外 badge tells the JDN and STACIA rooms apart. */
const roomGroup = (room: CellaRoom): { group: string; location: '校内' | '校外' } => ({
  group: room.id.includes('single') ? '单人间' : '多人间',
  location: room.stacia || room.id.startsWith('uni-jdn-') ? '校外' : '校内',
});

export const createDefaultCellaContentConfig = (campus: CellaCampus): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: campus === 'uni' ? 'CELLA-UNI' : 'CELLA-PREMIUM',
  courses: CELLA_COURSES.filter(item => item.campus === campus).map((item, sortOrder) => ({
    id: item.id, name: item.name, tuition: item.tuition, tuition2027: item.tuition,
    courseType: item.familyPackage ? '家庭套餐' : '英语课程',
    schedule: item.lessons, suitable: item.note, note: item.note,
    feeByWeeks: item.familyPackage ? Object.fromEntries(Object.entries(item.familyPackage.prices)) : undefined,
    allowedWeeks: item.familyPackage ? [...CELLA_FAMILY_PACKAGE_WEEKS] : undefined,
    enabled: true, sortOrder,
  })),
  rooms: CELLA_ROOMS.filter(item => item.campus === campus).map((item, sortOrder) => ({
    id: item.id, name: item.name, label: item.name, code: item.id,
    ...roomGroup(item), fee: item.fee,
    note: item.note, enabled: true, sortOrder,
  })),
  localFees: [
    fee('ssp', 'SSP特殊学习许可证', CELLA_LOCAL_FEES_2027.ssp, 'once', '移民局收取，有效期6个月；换校需重新办理。', 0),
    fee('ssp-e-card', 'SSP电子卡', CELLA_LOCAL_FEES_2027.sspECard, 'once', '入学时与SSP同时办理，只收一次。', 1),
    { ...fee('visa-extension', '签证续签', 5140, 'visa-extension-schedule', '30天签证第5周起续签，59天签证第9周起续签；以学校及移民局实收为准。', 2), rates: [...CELLA_LOCAL_FEES_2027.extensionStages] },
    fee('arp', 'ARP加急费', CELLA_LOCAL_FEES_2027.arp, 'long-term-or-first-extension', '首次续签时与签证一起办理。', 3),
    fee('acr-i-card', '外国人身份证', CELLA_LOCAL_FEES_2027.acrICard, 'first-visa-extension', '停留超过59天（第9周起）时办理。', 4),
    fee('management', '管理费', CELLA_LOCAL_FEES_2027.maintenancePerWeek, 'per-accommodation-period', '1,000比索／周，按住宿周数计算。', 5),
    fee('electricity', '电费', CELLA_LOCAL_FEES_2027.electricityPerWeek, 'per-accommodation-period', '500比索／周，每周含15度电，超出部分另收25比索／度；STACIA校外宿舍2027年起1,000比索／周。', 6),
    fee('water', '水费', CELLA_LOCAL_FEES_2027.waterPerWeek, 'per-accommodation-period', '2027/01/01起500比索／周，此前300比索／周。', 7),
    fee('books', '教材费', 2000, 'per-course-period', '不同课程教材不同（每本200–600比索），以实际购买为准。', 8),
    fee('student-id', '学生证', CELLA_LOCAL_FEES_2027.studentId, 'once', '一次性费用。', 9),
  ],
  quoteSettings: {
    ...CELLA_POLICY_MARK,
    ...{ cellaPageVersion: CELLA_PAGE_VERSION, cellaFamilyVersion: CELLA_FAMILY_VERSION },
    registrationFee: CELLA_REGISTRATION_FEE,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: CELLA_PEAK_SEASON_WEEKLY_FEE,
    peakSeasonPolicyVersion: ASSOCIATION_PEAK_POLICY_VERSION,
    peakSeasonRanges: [
      { id: 'cella-peak-2026', label: '2026暑期旺季', start: '2026-07-05', end: '2026-08-29', enabled: true },
      { id: 'cella-peak-2027', label: '2027暑期旺季', start: '2027-07-04', end: '2027-08-28', enabled: true },
      { id: 'cella-peak-2028', label: '2028暑期旺季', start: '2028-07-02', end: '2028-08-26', enabled: true },
    ],
    promotions: [
      promotion({ id: 'cella-social-6-plus-2', name: '6+2限时活动', description: '按6周课程和四人房收费，实际就读8周。', sortOrder: 0, ruleKind: 'cella-social-6-plus-2', stackable: false, newStudentsOnly: true }),
      promotion({ id: 'cella-social-9-plus-3', name: '9+3限时活动', description: '按9周课程和四人房收费，实际就读12周。', sortOrder: 1, ruleKind: 'cella-social-9-plus-3', stackable: false, newStudentsOnly: true }),
      promotion({ id: 'cella-low-season', name: '淡季优惠', description: '活动期内每个完整4周优惠100美元。', sortOrder: 2, ruleKind: 'cella-low-season', discountValue: 100, coverageStart: CELLA_LOW_SEASON_START, coverageEnd: CELLA_LOW_SEASON_END, coverageTarget: 'course-and-accommodation' }),
      promotion({ id: 'cella-premium-six-person', name: 'Premium六人间特价', description: '活动期内六人房按499美元／4周计价。', sortOrder: 3, ruleKind: 'cella-premium-six-person' }),
      promotion({ id: 'cella-long-stay', name: '长期报名优惠', description: '8／12／16周长期报名分别按学校档位优惠。', sortOrder: 4, ruleKind: 'cella-long-stay' }),
      promotion({ id: 'cella-low-season-2027', name: '2027淡季优惠', description: '2027/02/14–12/31入学，双人、三人、四人间每周优惠25美元（每4周100美元）；2027/05/30–08/28暑期周除外。', sortOrder: 5, ruleKind: 'cella-low-season-2027', coverageStart: CELLA_2027_PROMOTION.arrivalStart, coverageEnd: CELLA_2027_PROMOTION.arrivalEnd }),
      promotion({ id: 'cella-premium-six-person-2027', name: '2027 Premium六人间七五折', description: '2027/02/14–12/31入学并就读4／8／12周，课程和六人间住宿七五折；暑期周除外，不与2027长期优惠同用。', sortOrder: 6, ruleKind: 'cella-premium-six-person-2027', stackable: false }),
      promotion({ id: 'cella-long-stay-2027', name: '2027长期优惠', description: '2027年入学满12／16／20／24周分别优惠100／150／200／250美元；全年适用。', sortOrder: 7, ruleKind: 'cella-long-stay-2027' }),
      promotion({ id: 'cella-sida', name: '思达启航折扣', description: '课程费、住宿费和家庭套餐在学校优惠后再打9折；注册费（含家庭套餐内的500美元）、暑期附加费和未成年人管理费不打折。', sortOrder: 8, ruleKind: 'cella-sida', discountType: 'percentage', discountValue: Math.round((1 - CELLA_SIDA_RATE) * 100), appliesTo: 'tuition-and-accommodation' }),
    ],
    localFeeIntro: LOCAL_FEE_INTRO,
    ...tableCopy(campus),
    stayPolicyTitle: '入住与报价提醒',
    stayPolicies: [{ label: '入住日期', value: '周日入住', note: '离校和退房按周六计算。' }],
    extraNightRates: [],
  },
  quoteImageSettings: quoteImageSettings(campus),
  media: [],
});

export const cloneCellaContentConfig = (value: CiaContentConfig, campus: CellaCampus): CiaContentConfig => {
  const upgrade = ((value?.quoteSettings as CellaQuoteSettings | undefined)?.cellaPolicyVersion ?? 0) < CELLA_POLICY_VERSION;
  const pageUpgrade = ((value?.quoteSettings as CellaPageSettings | undefined)?.cellaPageVersion ?? 0) < CELLA_PAGE_VERSION;
  const familyUpgrade = ((value?.quoteSettings as CellaFamilySettings | undefined)?.cellaFamilyVersion ?? 0) < CELLA_FAMILY_VERSION;
  const needsPeakMigration = (value.quoteSettings?.peakSeasonPolicyVersion ?? 0) < ASSOCIATION_PEAK_POLICY_VERSION;
  const defaults = createDefaultCellaContentConfig(campus);
  const clone = structuredClone(value);
  if (clone?.schemaVersion !== 1 || clone.schoolCode !== defaults.schoolCode) return defaults;
  clone.quoteSettings = { ...defaults.quoteSettings, ...(clone.quoteSettings ?? {}) };
  if (!clone.quoteSettings.peakSeasonRanges?.length) {
    clone.quoteSettings.peakSeasonRanges = structuredClone(defaults.quoteSettings.peakSeasonRanges);
  }
  if (needsPeakMigration) {
    const official2027 = defaults.quoteSettings.peakSeasonRanges.find(range => range.id === 'cella-peak-2027')!;
    const saved2027 = clone.quoteSettings.peakSeasonRanges.find(range => range.id === 'cella-peak-2027' || range.label.includes('2027'));
    if (saved2027) Object.assign(saved2027, { start: official2027.start, end: official2027.end, enabled: true });
    else clone.quoteSettings.peakSeasonRanges.push(structuredClone(official2027));
    clone.quoteSettings.peakSeasonPolicyVersion = ASSOCIATION_PEAK_POLICY_VERSION;
  }
  clone.quoteSettings.promotions = clone.quoteSettings.promotions ?? structuredClone(defaults.quoteSettings.promotions);

  clone.quoteImageSettings = { ...structuredClone(defaults.quoteImageSettings), ...(clone.quoteImageSettings ?? {}) };
  clone.quoteImageSettings.paymentNotes = { ...defaults.quoteImageSettings.paymentNotes, ...(clone.quoteImageSettings.paymentNotes ?? {}) };
  clone.quoteImageSettings.promotionNotes = { ...defaults.quoteImageSettings.promotionNotes, ...(clone.quoteImageSettings.promotionNotes ?? {}) };
  clone.quoteImageSettings.localFeeNotes = { ...defaults.quoteImageSettings.localFeeNotes, ...(clone.quoteImageSettings.localFeeNotes ?? {}) };
  clone.quoteImageSettings.supplementalFeeNotes = { ...defaults.quoteImageSettings.supplementalFeeNotes, ...(clone.quoteImageSettings.supplementalFeeNotes ?? {}) };
  if (clone.quoteImageSettings.supplementalFeeNotes?.['payment:暑期附加费'] === '40美元／周，按实际课程周与旺季重叠周数计算。') {
    clone.quoteImageSettings.supplementalFeeNotes['payment:暑期附加费'] = defaults.quoteImageSettings.supplementalFeeNotes!['payment:暑期附加费'];
  }
  clone.courses ??= structuredClone(defaults.courses);
  clone.rooms ??= structuredClone(defaults.rooms);
  clone.localFees ??= structuredClone(defaults.localFees);
  clone.media ??= [];
  if (upgrade) upgradeTo2027(clone, defaults);
  if (pageUpgrade) upgradePageCopy(clone, defaults, campus);
  if (familyUpgrade) upgradeFamilyPackages(clone, defaults);
  return clone;
};

/** Replaces the 2026 family packages with the 2027 table, adds the 思达启航折扣 rule and updates untouched 6+2／9+3 notes once. */
function upgradeFamilyPackages(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const isFamily = (course: CiaContentConfig['courses'][number]) => course.courseType === '家庭套餐' || course.id.includes('-family-');
  clone.courses = [...clone.courses.filter(course => !isFamily(course)), ...structuredClone(defaults.courses.filter(isFamily))];
  for (const promotion of defaults.quoteSettings.promotions) {
    if (!clone.quoteSettings.promotions.some(item => item.id === promotion.id)) clone.quoteSettings.promotions.push(structuredClone(promotion));
  }
  const notes = (clone.quoteImageSettings.promotionNotes ??= {});
  for (const [id, old] of Object.entries(OLD_SOCIAL_NOTES)) {
    if (notes[id] === old) notes[id] = SOCIAL_NOTES[id];
  }
  (clone.quoteSettings as CellaFamilySettings).cellaFamilyVersion = CELLA_FAMILY_VERSION;
}

/** Moves a saved 2026 document onto the 2027 price list once; other employee copy and media stay as saved. */
function upgradeTo2027(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const courses = new Map(defaults.courses.map(item => [item.id, item]));
  for (const course of clone.courses) {
    const current = courses.get(course.id);
    if (current) Object.assign(course, { name: current.name, tuition: current.tuition, tuition2027: current.tuition2027, schedule: current.schedule, suitable: current.suitable, note: current.note });
  }
  for (const course of defaults.courses) {
    if (!clone.courses.some(item => item.id === course.id)) clone.courses.push(structuredClone(course));
  }
  const rooms = new Map(defaults.rooms.map(item => [item.id, item]));
  for (const room of clone.rooms) {
    const current = rooms.get(room.id);
    if (!current) continue;
    Object.assign(room, { fee: current.fee, note: current.note });
    if (CELLA_RENAMED_ROOMS.has(room.id)) Object.assign(room, { name: current.name, label: current.label });
  }
  const books = clone.localFees.find(item => item.id === 'books');
  clone.localFees = structuredClone(defaults.localFees).map(item => item.id === 'books' && books ? books : item);
  const ranges = clone.quoteSettings.peakSeasonRanges;
  for (const range of defaults.quoteSettings.peakSeasonRanges) {
    if (!ranges.some(item => item.id === range.id)) ranges.push(structuredClone(range));
  }
  for (const promotion of defaults.quoteSettings.promotions) {
    if (!clone.quoteSettings.promotions.some(item => item.id === promotion.id)) clone.quoteSettings.promotions.push(structuredClone(promotion));
  }
  clone.quoteSettings.registrationFee = defaults.quoteSettings.registrationFee;
  clone.quoteSettings.courseTableNote = defaults.quoteSettings.courseTableNote;
  const notes = clone.quoteImageSettings.supplementalFeeNotes;
  if (notes) delete notes['optional:宿务麦克坦机场周日接机（价格参考）'];
  (clone.quoteSettings as CellaQuoteSettings).cellaPolicyVersion = CELLA_POLICY_VERSION;
}
