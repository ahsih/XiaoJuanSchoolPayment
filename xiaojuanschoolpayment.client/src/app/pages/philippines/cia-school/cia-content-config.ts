export interface CiaCourseContent {
  id: string;
  name: string;
  /** Optional bilingual/group metadata used by weekly-price catalogs such as GLC. */
  englishName?: string;
  chineseName?: string;
  group?: string;
  offSeasonEligible?: boolean;
  annexOnly?: boolean;
  family?: boolean;
  textbook?: 'esl' | 'ielts';
  tuition: number;
  tuition2027: number;
  /** Optional fixed-duration prices used by guarantee courses such as A&J. */
  feeByWeeks?: Record<string, number>;
  /** Optional duration restriction paired with feeByWeeks. */
  allowedWeeks?: number[];
  /** Optional public course grouping/type label. */
  courseType?: string;
  /** Campus partition for one school brand with multiple independently displayed campuses. */
  campus?: string;
  /** Minimum duration used by guarantee courses. */
  minimumWeeks?: number;
  suitable: string;
  schedule: string;
  note: string;
  enabled: boolean;
  sortOrder: number;
}

export interface CiaRoomContent {
  id: string;
  name: string;
  label: string;
  code: string;
  location: '校内' | '校外';
  group: string;
  fee: number;
  /** Optional occupancy and utility metadata used by A&J total-price rooms. */
  priceMode?: 'per-person' | 'per-room';
  minOccupancy?: number;
  maxOccupancy?: number;
  waterFee4w?: number;
  waterGroup?: string;
  deposit?: number;
  /** Campus partition for one school brand with multiple independently displayed campuses. */
  campus?: string;
  /** Whether this room satisfies campus rules that restrict older students to single rooms. */
  single?: boolean;
  /** Optional reduced per-person price when a qualifying couple shares this room. */
  coupleRate?: number;
  note: string;
  enabled: boolean;
  sortOrder: number;
}

export type CiaLocalFeeBillingRule =
  | 'once'
  | 'per-accommodation-period'
  | 'per-course-period'
  | 'first-visa-extension'
  | 'long-term-or-first-extension'
  | 'visa-extension-schedule'
  | 'selected-manila-pickup'
  | 'selected-clark-pickup'
  | 'optional';

export interface CiaLocalFeeRule {
  id: string;
  name: string;
  currency: 'PHP';
  amount: number;
  secondaryAmount?: number;
  secondaryLabel?: string;
  billingRule: CiaLocalFeeBillingRule;
  periodWeeks?: number;
  rounding?: 'proportional' | 'ceil';
  rates?: number[];
  /** Optional dated replacement values. CG uses the Sunday arrival that corresponds to the published Monday effective date. */
  futureEffectiveStart?: string;
  futureName?: string;
  futureAmount?: number;
  futureSecondaryAmount?: number;
  futurePeriodWeeks?: number;
  futureRounding?: 'proportional' | 'ceil';
  futureRates?: number[];
  futureNote?: string;
  waiveForLongTermVisa?: boolean;
  includeInTotal: boolean;
  multiplyByStudents?: boolean;
  note: string;
  enabled: boolean;
  sortOrder: number;
}

export type CiaPromotionDiscountType = 'none' | 'percentage' | 'fixed' | 'per-course-week';
export type CiaPromotionAppliesTo = 'tuition' | 'accommodation' | 'tuition-and-accommodation' | 'school-total';
export type CiaPromotionCoverageTarget = 'none' | 'course' | 'course-and-accommodation';

export interface CiaPromotionRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  sortOrder: number;
  priority: number;
  stackable: boolean;
  newStudentsOnly: boolean;
  discountType: CiaPromotionDiscountType;
  discountValue: number;
  appliesTo: CiaPromotionAppliesTo;
  waiveRegistration: boolean;
  minimumCourseWeeks: number;
  minimumAccommodationWeeks: number;
  /** Optional repeating tier used by schools such as PINES long-stay offers. */
  incrementWeeks?: number;
  incrementValue?: number;
  /** Optional exact duration tiers used by A&J new-student and continuation offers. */
  discountTiers?: Record<string, number>;
  /** Identifies calculator-specific rule semantics while retaining one editable schema. */
  ruleKind?: string;
  /** Optional room restriction for offers such as MONOL's SNS promotion. */
  eligibleRoomIds?: string[];
  /** Optional course restriction for offers such as GLC's annual study promotion. */
  eligibleCourseIds?: string[];
  registrationStart?: string;
  registrationEnd?: string;
  arrivalStart?: string;
  arrivalEnd?: string;
  coverageStart?: string;
  coverageEnd?: string;
  coverageTarget: CiaPromotionCoverageTarget;
}

export interface CiaPeakSeasonRange {
  id: string;
  label: string;
  start: string;
  end: string;
  enabled: boolean;
}

export interface CiaStayPolicyCard {
  label: string;
  value: string;
  note: string;
}

export interface CiaExtraNightRate {
  label: string;
  amount: number;
}

export interface CiaQuoteSettings {
  registrationFee: number;
  /** Optional school-payment fee used by EV for unaccompanied minors. */
  minorManagementFeePerPeriod?: number;
  /** Optional I.BREEZE calculator values that remain outside the peso local-fee total. */
  airportPickupSundayUsd?: number;
  airportPickupSaturdayUsd?: number;
  roomDepositUnder8Weeks?: number;
  roomDeposit8WeeksOrMore?: number;
  courseChangeFeePerPeriod?: number;
  /** Optional weekly unaccompanied-minor rates used by B'Cebu. */
  minorManagementFeeUnder15PerWeek?: number;
  minorManagementFeeAge15To17PerWeek?: number;
  futurePriceRegistrationStart: string;
  futurePriceArrivalStart: string;
  shortStayRatios: Record<string, number>;
  peakSeasonFeePerWeek: number;
  peakSeasonRanges: CiaPeakSeasonRange[];
  promotions: CiaPromotionRule[];
  localFeeIntro: string;
  courseTableTitle: string;
  courseTableNote: string;
  groupClassNote: string;
  roomTableTitle: string;
  roomTableNote: string;
  stayPolicyTitle: string;
  stayPolicies: CiaStayPolicyCard[];
  extraNightRates: CiaExtraNightRate[];
}

export interface CiaQuoteImageBenefit {
  title: string;
  text: string;
}

export interface CiaQuoteImagePaymentNotes {
  registration: string;
  course: string;
  accommodation: string;
  promotion: string;
}

/** Image-only copy. Prices, promotions and quantities always come from the website calculator. */
export interface CiaQuoteImageSettings {
  paymentSectionTitle: string;
  paymentNotes: CiaQuoteImagePaymentNotes;
  localFeeSectionTitle: string;
  localFeeIntro: string;
  /** Image-only note overrides keyed by the stable CiaLocalFeeRule id. */
  localFeeNotes: Record<string, string>;
  serviceSectionTitle: string;
  benefits: CiaQuoteImageBenefit[];
  serviceLocations: string[];
  alumniBenefitTitle: string;
  alumniBenefitText: string;
  noteSectionTitle: string;
  footerNotes: string[];
}

export interface CiaMediaContent {
  id: string;
  schoolId: string;
  url: string;
  originalFileName?: string;
  contentType: string;
  category?: string;
  caption?: string;
  altText?: string;
  displayOrder: number;
  /** Optional campus partition for brands that publish several campus pages from one school record. */
  campus?: string;
  /** Desired website visibility. The database is updated only when an administrator publishes. */
  isActive: boolean;
}

export interface CiaContentConfig {
  schemaVersion: 1;
  schoolCode: 'CIA' | 'PINES' | 'MONOL' | 'EV' | 'SMEAG' | 'PHILINTER' | 'CG-BANILAD' | 'CG-SPARTA' | 'CPI' | 'BCEBU' | 'CPILS' | 'GLC' | 'IBREEZE' | 'ANJ' | 'BECI' | 'JIC';
  courses: CiaCourseContent[];
  rooms: CiaRoomContent[];
  localFees: CiaLocalFeeRule[];
  quoteSettings: CiaQuoteSettings;
  quoteImageSettings: CiaQuoteImageSettings;
  /** Optional for backwards compatibility with revisions created before media review was introduced. */
  media?: CiaMediaContent[];
}

const course = (
  id: string,
  name: string,
  tuition: number,
  tuition2027: number,
  schedule: string,
  suitable: string,
  note: string,
  sortOrder: number,
): CiaCourseContent => ({
  id,
  name,
  tuition,
  tuition2027,
  schedule,
  suitable,
  note,
  enabled: true,
  sortOrder,
});

export const createDefaultCiaContentConfig = (): CiaContentConfig => {
  const config: CiaContentConfig = {
  schemaVersion: 1,
  schoolCode: 'CIA',
  courses: [
    course('regular-esl', 'Regular ESL', 900, 1000, '一对一4节 + 小组1节 + 中组1节 + 大组1节 + 选修1节 + 写作1节 + 自习1节', '基础综合提升 / 可申请 Light ESL', 'Regular ESL 均衡提升听说读写；Light ESL 需在出发前申请，可按学校规则减少部分课程。', 0),
    course('intensive-esl', 'Intensive ESL', 1000, 1100, '一对一5节 + 小组1节 + 中组1节 + 选修1节 + 写作1节 + 自习1节', '想增加一对一课时', '比 Regular ESL 多1节一对一，适合短期加强口语输出和老师纠音。', 1),
    course('power-intensive', 'Power Intensive', 1100, 1200, '一对一6节 + 小组1节 + 选修1节 + 写作1节 + 自习1节', '短期高强度口语突破', '一对一比例最高，适合时间有限、希望集中补弱项的学生。', 2),
    course('pre-toeic', 'Pre-TOEIC', 1000, 1100, '托业一对一4节 + ESL小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节', '托业预备 / 无入学分数要求', '4周为一个学习单元，每2周安排一次模拟考试，适合先建立托业基础。', 3),
    course('toeic-regular', 'TOEIC Regular', 1000, 1100, '托业一对一4节 + 托业小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节', '托业常规备考', '4周为一个学习单元，每2周安排一次模拟考试。', 4),
    course('toeic-guarantee', 'TOEIC Guarantee', 1000, 1100, '托业一对一4节 + 托业小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节', '托业600 / 700 / 800 / 900分保证班', '12周课程；入学参考分数为400 / 500 / 650 / 790分，并有出勤、每周模考和官方考试要求。', 5),
    course('pre-ielts', 'Pre-IELTS', 1050, 1150, '雅思一对一4节 + ESL小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节', '雅思预备 / 无入学分数要求', '4周为一个学习单元，每2周安排一次模拟考试，适合先补齐雅思基础。', 6),
    course('ielts-regular', 'IELTS Regular', 1050, 1150, '雅思一对一4节 + 雅思小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节', '雅思常规备考', '建议雅思3.5分以上，4周为一个学习单元，每2周安排一次模拟考试。', 7),
    course('ielts-guarantee', 'IELTS Guarantee', 1050, 1150, '雅思一对一4节 + 雅思小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节；周一至周三另有强化晚课', '雅思5.5 / 6.0 / 6.5 / 7.0分保证班', '12周课程；入学参考分数为3.5–4.5 / 5.0–5.5 / 6.0 / 6.5分，并有出勤、每周四模考和官方考试要求。', 8),
    course('business', 'Business', 1050, 1150, '商务一对一5节 + 商务小组1节 + 综合中组1节 + 选修1节 + 写作1节 + 自习2节', '商务沟通、演示与职场写作', '入学参考为 CIA Level 4 或 TOEIC 400分；4或8周为一个单元，4周以上学生需完成商务PPT发表。', 9),
    course('working-holiday', 'Working Holiday', 950, 1050, 'ESL一对一4节 + ESL小组1节 + 综合中组1节 + 外教/CNN大组1节 + 选修1节 + 写作1节 + 自习2节', '海外生活与面试沟通', '4周为一个学习单元，内容覆盖生存英语、求职准备和海外生活沟通。', 10),
    course('callan-esl', 'Callan ESL', 1050, 1050, 'Callan一对一3节 + ESL一对一2节 + ESL小组1节 + 综合中组1节 + 选修1节 + 写作1节 + 自习2节', '高频问答与快速口语反应', '4周为一个学习单元，通过快速问答、即时纠错和系统复习训练英语反应速度。', 11),
    course('college-immersion', 'College Immersion（IAU大学沉浸）', 1000, 1100, 'ESL一对一4节 + ESL小组1节 + 综合中组1节 + 外教/CNN大组1节 + 选修1节 + 写作1节 + 自习2节', '想参加IAU航空大学体验，报名时应选择此课程', '不是Regular ESL的临时加选课；4周为一个学习单元，另收IAU一次性注册费50美元。', 12),
  ],
  rooms: [
    { id: 'p1', name: '豪华单人间 P-1', label: '豪华单人间', code: 'P-1', location: '校内', group: '单人间', fee: 1700, note: '豪华单人间多了一个电磁炉，可以简单加热食物', enabled: true, sortOrder: 0 },
    { id: 'pn1', name: '校外单人间 PN-1', label: '校外单人间', code: 'PN-1', location: '校外', group: '单人间', fee: 1700, note: '在学校对面的4号楼', enabled: true, sortOrder: 1 },
    { id: 's1', name: '标准单人间 S-1', label: '标准单人间', code: 'S-1', location: '校内', group: '单人间', fee: 1500, note: '适合重视独立空间的学生', enabled: true, sortOrder: 2 },
    { id: 'd2', name: '双人间 D-2', label: '双人间', code: 'D-2', location: '校内', group: '普通多人间', fee: 1100, note: '适合朋友同行或希望平衡预算', enabled: true, sortOrder: 3 },
    { id: 'd3', name: '三人间 D-3', label: '三人间', code: 'D-3', location: '校内', group: '普通多人间', fee: 850, note: '预算比双人间更低', enabled: true, sortOrder: 4 },
    { id: 'd4', name: '四人间 D-4', label: '四人间', code: 'D-4', location: '校内', group: '普通多人间', fee: 750, note: '默认报价参考，预算压力较低', enabled: true, sortOrder: 5 },
    { id: 'sr1', name: '单人套房 SR-1', label: '单人套房', code: 'SR-1', location: '校内', group: '家庭精致套房', fee: 2500, note: '套房房型，空间更完整', enabled: true, sortOrder: 6 },
    { id: 'sr2', name: '双人套房 SR-2', label: '双人套房', code: 'SR-2', location: '校内', group: '家庭精致套房', fee: 1400, note: '套房房型，适合两人入住', enabled: true, sortOrder: 7 },
    { id: 'sr3', name: '三人套房 SR-3', label: '三人套房', code: 'SR-3', location: '校内', group: '家庭精致套房', fee: 1200, note: '套房房型，适合小组同行', enabled: true, sortOrder: 8 },
    { id: 'sr4', name: '四人套房 SR-4', label: '四人套房', code: 'SR-4', location: '校内', group: '家庭精致套房', fee: 1100, note: '套房房型，预算和空间较平衡', enabled: true, sortOrder: 9 },
  ],
  localFees: [
    { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 8000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '按报名学习时长办理；续费或换校须学校确认。', enabled: true, sortOrder: 0 },
    { id: 'ssp-e-card', name: 'SSP-E Card', currency: 'PHP', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP同时办理，按一次性费用估算。', enabled: true, sortOrder: 1 },
    { id: 'acr-i-card', name: 'ACR-I Card 外国人身份证', currency: 'PHP', amount: 4500, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '首次续签时计入一次；以学校办理要求为准。', enabled: true, sortOrder: 2 },
    { id: 'arp', name: 'ARP外国人登记', currency: 'PHP', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '首次续签或长期签证计入一次；实际政策及收费须向学校确认。', enabled: true, sortOrder: 3 },
    { id: 'management', name: '综合管理费', currency: 'PHP', amount: 4000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '按每4周4,000比索／人计算。', enabled: true, sortOrder: 4 },
    { id: 'electricity', name: '电费', currency: 'PHP', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '超过基本用电额度时另行收费，单价可能按当地电力公司调整。', enabled: true, sortOrder: 5 },
    { id: 'water', name: '水费', currency: 'PHP', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '按每4周1,000比索／人计算。', enabled: true, sortOrder: 6 },
    { id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 6410, rates: [6410, 4540, 4540, 4540, 5650], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '按签证类型和实际停留天数累计；最终以办理要求为准。', enabled: true, sortOrder: 7 },
    { id: 'books', name: '教材费', currency: 'PHP', amount: 2000, billingRule: 'per-course-period', periodWeeks: 8, rounding: 'ceil', includeInTotal: true, note: '每套约使用8周；实际按课程与学习进度发放。', enabled: true, sortOrder: 8 },
    { id: 'photo', name: '照片费', currency: 'PHP', amount: 200, billingRule: 'once', includeInTotal: true, note: '一次性费用。', enabled: true, sortOrder: 9 },
    { id: 'pickup', name: '宿务马克坦机场接机', currency: 'PHP', amount: 1000, secondaryAmount: 1500, secondaryLabel: '工作日', billingRule: 'optional', includeInTotal: false, note: '周末1,000比索／工作日1,500比索；可选，也可自行前往。', enabled: true, sortOrder: 10 },
    { id: 'deposit', name: '房间押金（可退）', currency: 'PHP', amount: 2500, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '2,500比索／人；无损坏及无欠费时可退；不计入学杂费合计。', enabled: true, sortOrder: 11 },
  ],
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '2026-09-01',
    futurePriceArrivalStart: '2027-01-01',
    shortStayRatios: { '1': 0.4, '2': 0.6, '3': 0.8 },
    peakSeasonFeePerWeek: 40,
    peakSeasonRanges: [
      { id: 'summer-2026', label: '2026暑期', start: '2026-06-14', end: '2026-08-08', enabled: true },
      { id: 'winter-2027', label: '2027寒假', start: '2027-01-17', end: '2027-02-13', enabled: true },
      { id: 'summer-2027', label: '2027暑假', start: '2027-06-13', end: '2027-08-07', enabled: true },
    ],
    promotions: [
      {
        id: 'sida-discount', name: '思达折扣', description: '课程费和住宿费享95折', enabled: true, sortOrder: 0,
        priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5,
        appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0,
        minimumAccommodationWeeks: 0, coverageTarget: 'none',
      },
      {
        id: 'christmas-2026', name: '圣诞新年优惠', description: '课程及住宿完整覆盖指定日期，减200美元且免注册费', enabled: true, sortOrder: 1,
        priority: 20, stackable: true, newStudentsOnly: true, discountType: 'fixed', discountValue: 200,
        appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0,
        minimumAccommodationWeeks: 0, coverageStart: '2026-12-20', coverageEnd: '2027-01-02',
        coverageTarget: 'course-and-accommodation',
      },
    ],
    localFeeIntro: '以下费用以比索计价，由学校及相关部门收取；接机与可退押金另列。',
    courseTableTitle: 'CIA 2027课程费 / 4周',
    courseTableNote: '2027新价从2026年9月1日开始接受报名，但需同时在2027年1月1日或之后入学；2026年内入学仍按原价，因此下表保留必要对照。',
    groupClassNote: '小团体1–6人，中团体6–15人，大团体15–20人。',
    roomTableTitle: '住宿费 / 4周',
    roomTableNote: '学校2027价目表显示住宿费未调整；仅PN-1明确标注为校外，其余房型按校内宿舍体系展示，最终以报名时空房为准。',
    stayPolicyTitle: 'CIA入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日 15:00 起', note: '以学校确认的周日抵达日为准；如需提前入住，须先确认空房，最多仅可提前1天。' },
      { label: '退房日期', value: '结业后周六 12:00 前', note: '超过中午12点未按时退房，学校可按实际房型收取1晚住宿费。' },
      { label: '额外住宿晚数', value: '额外留宿须提前确认', note: '延长住宿最多1天，以下费用包含住宿与餐食，最终以学校空房和批准为准。' },
    ],
    extraNightRates: [
      { label: '单人房', amount: 2500 },
      { label: '双人房', amount: 2000 },
      { label: '三人房', amount: 1500 },
      { label: '四人房', amount: 1000 },
    ],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: {
      registration: '一次性费用，老学员返校免费',
      course: '',
      accommodation: '',
      promotion: '',
    },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: '以下费用以比索计价，由学校及相关部门收取；接机与可退押金另列。',
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
    footerNotes: [
      '课程费按报名日期及各段课程开始日期匹配2026或2027价格；改期需重新确认。',
      '最终以学校价格、空房及优惠确认为准。',
    ],
  },
  };
  config.quoteImageSettings.localFeeNotes = Object.fromEntries(
    config.localFees.map(fee => [fee.id, fee.note]),
  );
  return config;
};

export const cloneCiaContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const clone = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  // Older saved revisions predate image-only copy; merge defaults without changing their prices or rules.
  const defaults = createDefaultCiaContentConfig().quoteImageSettings;
  const saved = clone.quoteImageSettings;
  clone.quoteImageSettings = {
    ...defaults,
    ...(saved ?? {}),
    paymentNotes: {
      ...defaults.paymentNotes,
      ...(saved?.paymentNotes ?? {}),
    },
    localFeeNotes: {
      ...defaults.localFeeNotes,
      ...Object.fromEntries((clone.localFees ?? []).map(fee => [fee.id, fee.note])),
      ...(saved?.localFeeNotes ?? {}),
    },
  };
  return clone;
};
