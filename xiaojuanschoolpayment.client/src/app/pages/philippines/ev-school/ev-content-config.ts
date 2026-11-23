import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaQuoteImageSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import { ASSOCIATION_PEAK_POLICY_VERSION } from '../association-peak-surcharge';
import { copyContentData } from '../copy-content-data';

/**
 * 1: 2026-08-10 local-fee sheet and the 2026 brochure course catalogue.
 * 2: condo shuttle runs on weekdays only, condo check-in rules, 2,000-peso extra night,
 *    and no school promotion besides the agent 95% rate (user decision 2026-11-20).
 * 3: 2026-11 school pack: check-in from Saturday 15:00 for every student, no students under 15,
 *    and the student pays any electricity beyond the deposit (2026-10 orientation guide).
 * 4: colleague review 2026-11-24: ACR I-Card with the first tourist-visa extension (2026-10 orientation guide),
 *    the condo shuttle also runs at weekends, and a condo double needs two students who enrol together.
 */
export const EV_POLICY_VERSION = 4;
export const EV_IELTS_GUARANTEE_ID = 'sparta-ielts-guarantee';
const EV_ELECTRICITY_NOTE = '每周含15度电；超出部分每度20比索，从押金中扣除，超过押金须补交差额。';
const EV_ACR_NOTE = '旅游签证首次续签时办理（30天签证第5周起，59天签证第9周起），只收一次。';
const EV_V3_ACR_NOTE = '在菲律宾停留超过59天（第9周起）须办理，只收一次。';
const EV_V3_CONDO_NOTE = '仅限半斯巴达课程；无门禁，平日有接驳车往返学校';
const EV_CONDO_NOTES: Record<string, string> = {
  'off-campus-single': '仅限半斯巴达课程；无门禁，有接驳车往返学校',
  'off-campus-double': '仅限半斯巴达课程；须两位学生同时报名一起入住（如夫妻或朋友）；无门禁，有接驳车往返学校',
};

const course = (
  id: string,
  name: string,
  tuition: number,
  schedule: string,
  suitable: string,
  sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({
  id,
  name,
  tuition,
  tuition2027: tuition,
  schedule,
  suitable,
  note: 'EV 2026年4周课程费；最终以学校确认为准。',
  enabled: true,
  sortOrder,
  ...extra,
});

const room = (
  id: string,
  name: string,
  fee: number,
  note: string,
  location: '校内' | '校外',
  sortOrder: number,
): CiaRoomContent => ({
  id,
  name,
  label: name,
  code: id.toUpperCase(),
  location,
  group: location === '校外' ? '校外公寓' : '校内宿舍',
  fee,
  note,
  enabled: true,
  sortOrder,
});

const ESL_CLASSES = '4节一对一 + 2节小团体 + 2节大团体 + 2节选修或自习';
const SPECIFIC_CLASSES = '4节一对一 + 4节团体 + 2节选修或自习';

const quoteImageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '一次性费用；老学员返校可按当前规则免收',
    course: '课程日期、周数和每日课表以学生当前选择为准',
    accommodation: '住宿日期、房型及金额由当前方案自动生成，最终以空房确认为准',
    promotion: '',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '以下费用以比索计价，入学第一天在学校前台缴纳；本报价仅供学生参考，具体以到校后实际产生及学校收取为准；接机与可退押金另列。',
  localFeeNotes: {},
  serviceSectionTitle: '为什么选择思达启航？',
  benefits: [
    { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
    { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
    { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
    { title: '宿务驻点售后', text: '学习期间持续跟进，问题有人协助' },
  ],
  serviceLocations: ['深圳总部', '宿务驻点', '欧洲驻点'],
  alumniBenefitTitle: '老学员专属优惠',
  alumniBenefitText: '老学员返校可按学校当前规则免收注册费；其他课程或留学优惠由顾问另行确认。',
  noteSectionTitle: '报价说明',
  footerNotes: [
    '1、学费部分需在到校前2周交齐，可交由思达启航代收，或自行直接向学校转付美元；本报价单所列学校费用即为最终价格，人民币支付时按照支付宝最新参考汇率将美元换算为人民币结算。',
    '最终以学校价格、空房及优惠确认为准。',
  ],
});

const defaultCourses = (): CiaCourseContent[] => [
  course('sparta-intensive-esl', '密集ESL（斯巴达）', 1030, ESL_CLASSES, '综合英语｜听说读写全面提升', 0),
  course('sparta-power-speaking-6', '口语强化6（斯巴达）', 1230, '6节一对一 + 1节小团体 + 1节大团体 + 2节选修或自习', '口语为主｜会话、词汇与表达', 1),
  course('sparta-power-speaking-8', '口语强化8（斯巴达）', 1410, '8节一对一 + 2节选修或自习', '一对一最多｜流利口语与公众演讲', 2),
  course('sparta-ielts-regular', '雅思（斯巴达）', 1150, ESL_CLASSES, '雅思备考｜仅开设斯巴达', 3),
  course(EV_IELTS_GUARANTEE_ID, '雅思保分班（斯巴达）', 1290, '1节早课 + 4节一对一 + 4节团体 + 1节晚课 + 2节强化辅导', '学术类雅思｜8周起，按入学分数定目标分', 4, {
    minimumWeeks: 8,
    // Whole guarantee-course tuition for 8–11 weeks; from 12 weeks it is 1,290 per 4 weeks.
    feeByWeeks: { '8': 2700, '9': 2987.5, '10': 3275, '11': 3562.5 },
  }),
  course('sparta-toeic', '托业（斯巴达）', 1150, SPECIFIC_CLASSES, 'TOEIC备考', 5),
  course('sparta-social-media-english', '社交媒体英语（斯巴达）', 1150, SPECIFIC_CLASSES, 'Digital English｜Vlog、播客与内容创作', 6),
  course('sparta-business', '商务英语（斯巴达）', 1150, SPECIFIC_CLASSES, '商务讨论、演示与谈判', 7),
  course('semi-sparta-esl', '经典ESL（半斯巴达）', 980, ESL_CLASSES, '综合英语｜学习与宿务生活平衡', 8),
  course('semi-sparta-power-speaking-6', '口语强化6（半斯巴达）', 1180, '6节一对一 + 1节小团体 + 1节大团体 + 2节选修或自习', '口语为主｜会话、词汇与表达', 9),
  course('semi-sparta-power-speaking-8', '口语强化8（半斯巴达）', 1360, '8节一对一 + 2节选修或自习', '一对一最多｜流利口语与公众演讲', 10),
  course('semi-sparta-toeic', '托业（半斯巴达）', 1100, SPECIFIC_CLASSES, 'TOEIC备考', 11),
  course('semi-sparta-business', '商务英语（半斯巴达）', 1100, SPECIFIC_CLASSES, '商务讨论、演示与谈判', 12),
  course('semi-sparta-social-media-english', '社交媒体英语（半斯巴达）', 1100, SPECIFIC_CLASSES, 'Digital English｜Vlog、播客与内容创作', 13),
];

const defaultRooms = (): CiaRoomContent[] => [
  room('single', '单人间', 1400, '一人一间，安静私密', '校内', 0),
  room('double', '双人间', 1030, '两人一间', '校内', 1),
  room('triple', '三人间', 950, '三人一间', '校内', 2),
  room('quad-bunk', '四人间（上下铺）', 900, '上下铺，预算较低', '校内', 3),
  room('off-campus-single', '校外公寓单人间', 1550, EV_CONDO_NOTES['off-campus-single'], '校外', 4),
  room('off-campus-double', '校外公寓双人间', 1150, EV_CONDO_NOTES['off-campus-double'], '校外', 5),
];

const defaultLocalFees = (): CiaLocalFeeRule[] => [
  { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '有效期至课程结束；延长课程需重新办理。', enabled: true, sortOrder: 0 },
  { id: 'ssp-e-card', name: 'SSP E-CARD', currency: 'PHP', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP一起办理，有效期1年。', enabled: true, sortOrder: 1 },
  { id: 'acr-i-card', name: 'ACR-I Card 外国人身份证', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: true, note: EV_ACR_NOTE, enabled: true, sortOrder: 2 },
  { id: 'arp', name: 'ARP外国人登记', currency: 'PHP', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '旅游签证首次续签时收取一次；长期签证也收取一次。', enabled: true, sortOrder: 3 },
  { id: 'on-campus-management', name: '校内管理费', currency: 'PHP', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '仅校内住宿计收，按住宿周数。', enabled: true, sortOrder: 4 },
  { id: 'off-campus-management', name: '校外公寓管理费', currency: 'PHP', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '仅校外公寓计收，按住宿周数。', enabled: true, sortOrder: 5 },
  { id: 'electricity', name: '电费', currency: 'PHP', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: EV_ELECTRICITY_NOTE, enabled: true, sortOrder: 6 },
  { id: 'water', name: '水费', currency: 'PHP', amount: 300, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '按住宿周数。', enabled: true, sortOrder: 7 },
  { id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 5430, rates: [5430, 6400, 4430, 4430, 4430], tourist59Rates: [6700, 4430, 4430, 4430], billingRule: 'visa-extension-schedule', includeInTotal: true, note: '30天签证第5周起、59天签证第9周起需续签，之后每4周一次；以移民局实收为准。', enabled: true, sortOrder: 8 },
  { id: 'books', name: '教材费', currency: 'PHP', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按课程实际购买，每本约150–500比索；此处按每4周2,000比索预估。', enabled: true, sortOrder: 9 },
  { id: 'student-id', name: '学生证', currency: 'PHP', amount: 500, billingRule: 'once', includeInTotal: true, note: '一次性费用；遗失补办500比索。', enabled: true, sortOrder: 10 },
  { id: 'cebu-pickup', name: '宿务马克坦机场接机', currency: 'PHP', amount: 1200, billingRule: 'optional', includeInTotal: false, note: '学校周末接机，可选。', enabled: true, sortOrder: 11 },
  { id: 'room-deposit', name: '房间押金', currency: 'PHP', amount: 2000, rates: [2000, 3000, 5000], billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '1至3周2,000比索，4至8周3,000比索，9周以上5,000比索；无损坏、无欠费时退还。', enabled: true, sortOrder: 12 },
];

/** Fee rows replaced by the 2026-08-10 sheet; ARP (user-confirmed, not on the sheet) stays charged. */
const EV_UPGRADED_FEE_IDS = ['ssp', 'ssp-e-card', 'acr-i-card', 'arp', 'on-campus-management', 'off-campus-management', 'electricity', 'water', 'visa-extension', 'books', 'student-id', 'cebu-pickup', 'room-deposit'];

const defaultStayPolicies = () => [
  { label: '入住日期', value: '周六15:00后或周日入住', note: '其他时间不能入住；周一上午分级测试和新生说明会。' },
  { label: '离校日期', value: '最后一周周六12:00前退房', note: '毕业典礼在最后一个周五；延住须提前一周申请，视空房而定。' },
  { label: '未成年学生', value: '15至17岁可报名，外出须监护人陪同', note: '未满15岁学校不接收；平日不可外出，周末无监护人不可外出，门禁21:00。' },
];

/** Version-2 stay rules; version 3 replaces them only where staff left them unchanged. */
const EV_V2_STAY_POLICIES: Record<string, { value: string; note: string }> = {
  入住日期: { value: '周六或周日入住', note: '校外公寓周六15:00后入住；周一上午分级测试和新生说明会。' },
  未成年学生: { value: '外出须监护人陪同', note: '平日不可外出，周末无监护人不可外出，门禁21:00。' },
};
const EV_V2_ELECTRICITY_NOTE = '每周含15度电；超出部分每度20比索，从押金中扣除。';

const defaultExtraNightRates = () => [{ label: '延住（所有房型）', amount: 2000 }];

/** Promotions the main campus may show: the agent 95% rate and the returning-student registration waiver. */
const EV_ALLOWED_PROMOTION_IDS = ['ev-sida-95', 'ev-returning-registration'];

export const createDefaultEvContentConfig = (): CiaContentConfig => {
  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: 'EV',
    courses: defaultCourses(),
    rooms: defaultRooms(),
    localFees: defaultLocalFees(),
    quoteSettings: {
      registrationFee: 100,
      minorManagementFeePerPeriod: 100,
      futurePriceRegistrationStart: '',
      futurePriceArrivalStart: '',
      shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.85 },
      peakSeasonFeePerWeek: 40,
      peakSeasonPolicyVersion: ASSOCIATION_PEAK_POLICY_VERSION,
      evPolicyVersion: EV_POLICY_VERSION,
      peakSeasonRanges: [
        { id: 'ev-peak-2027', label: '2027暑期旺季', start: '2027-07-04', end: '2027-08-28', enabled: true },
      ],
      promotions: [
        { id: 'ev-sida-95', name: '思达启航折扣', description: '课程费和住宿费享95折；旺季附加费不参与折扣', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
        { id: 'ev-returning-registration', name: '老学员注册费减免', description: '老学员返校免收一次性注册费', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      ],
      localFeeIntro: '以下费用以比索计价，入学第一天在学校前台缴纳；本报价仅供学生参考，具体以到校后实际产生及学校收取为准；接机与可退押金另列。',
      courseTableTitle: 'EV 2026年4周课程费',
      courseTableNote: '以下为4周课程费（美元）。',
      groupClassNote: '每节课45分钟；小团体课最多5人，大团体课最多8人。',
      roomTableTitle: 'EV 2026年4周食宿费',
      roomTableNote: '校内宿舍费含住宿、一日三餐和房间清洁；校外公寓仅限半斯巴达课程。',
      stayPolicyTitle: 'EV入住与离校',
      stayPolicies: defaultStayPolicies(),
      extraNightRates: defaultExtraNightRates(),
    },
    quoteImageSettings: quoteImageSettings(),
  };

  config.quoteImageSettings.localFeeNotes = Object.fromEntries(
    config.localFees.map((fee: CiaLocalFeeRule) => [fee.id, fee.note]),
  );
  return config;
};

/** Brings older saved documents up to the current EV policy once per version, keeping edited prices. */
const upgradeEvPolicy = (clone: CiaContentConfig, defaults: CiaContentConfig): void => {
  const saved = clone.quoteSettings.evPolicyVersion ?? 0;
  if (saved < 1) upgradeEvFeeSheet(clone, defaults);
  if (saved < 2) upgradeEvStayRules(clone, defaults);
  if (saved < 3) upgradeEvSchoolPack2026Nov(clone);
  if (saved < 4) upgradeEvReview2026Nov(clone);
  clone.quoteSettings.evPolicyVersion = EV_POLICY_VERSION;
};

/** Version 4: replaces only the version-3 ACR and condo wording that staff left unchanged. */
const upgradeEvReview2026Nov = (clone: CiaContentConfig): void => {
  for (const item of clone.rooms ?? []) {
    if (EV_CONDO_NOTES[item.id] && item.note === EV_V3_CONDO_NOTE) item.note = EV_CONDO_NOTES[item.id];
  }
  const acr = (clone.localFees ?? []).find(fee => fee.id === 'acr-i-card');
  if (acr?.note === EV_V3_ACR_NOTE) acr.note = EV_ACR_NOTE;
  const imageNotes = clone.quoteImageSettings?.localFeeNotes;
  if (imageNotes?.['acr-i-card'] === EV_V3_ACR_NOTE) imageNotes['acr-i-card'] = EV_ACR_NOTE;
};

/** Version 3: replaces only the version-2 wording that staff left unchanged. */
const upgradeEvSchoolPack2026Nov = (clone: CiaContentConfig): void => {
  const current = defaultStayPolicies();
  clone.quoteSettings.stayPolicies = (clone.quoteSettings.stayPolicies ?? []).map(policy => {
    const old = EV_V2_STAY_POLICIES[policy.label];
    const next = current.find(entry => entry.label === policy.label);
    return old && next && policy.value === old.value && policy.note === old.note ? { ...next } : policy;
  });
  const electricity = (clone.localFees ?? []).find(fee => fee.id === 'electricity');
  if (electricity?.note === EV_V2_ELECTRICITY_NOTE) electricity.note = EV_ELECTRICITY_NOTE;
  const imageNotes = clone.quoteImageSettings?.localFeeNotes;
  if (imageNotes?.['electricity'] === EV_V2_ELECTRICITY_NOTE) imageNotes['electricity'] = EV_ELECTRICITY_NOTE;
};

/** Version 1: the 2026-08-10 fee sheet and corrected course facts. */
const upgradeEvFeeSheet = (clone: CiaContentConfig, defaults: CiaContentConfig): void => {
  const kept = (clone.localFees ?? []).filter(fee => !EV_UPGRADED_FEE_IDS.includes(fee.id));
  clone.localFees = [...defaults.localFees.map(fee => copyContentData(fee)), ...kept];
  for (const item of clone.courses ?? []) {
    const fallback = defaults.courses.find(entry => entry.id === item.id);
    if (!fallback) continue;
    Object.assign(item, { name: fallback.name, schedule: fallback.schedule, suitable: fallback.suitable, note: fallback.note });
    if (fallback.feeByWeeks) item.feeByWeeks = { ...fallback.feeByWeeks };
    if (fallback.minimumWeeks) item.minimumWeeks = fallback.minimumWeeks;
  }
  for (const item of clone.rooms ?? []) {
    const fallback = defaults.rooms.find(entry => entry.id === item.id);
    if (fallback) item.note = fallback.note;
  }
  const settings = clone.quoteSettings;
  settings.localFeeIntro = defaults.quoteSettings.localFeeIntro;
  settings.courseTableNote = defaults.quoteSettings.courseTableNote;
  settings.groupClassNote = defaults.quoteSettings.groupClassNote;
  settings.roomTableNote = defaults.quoteSettings.roomTableNote;
  settings.stayPolicyTitle = defaults.quoteSettings.stayPolicyTitle;
  settings.stayPolicies = defaultStayPolicies();
  if (clone.quoteImageSettings) {
    clone.quoteImageSettings.localFeeIntro = defaults.quoteImageSettings.localFeeIntro;
    const notes = { ...(clone.quoteImageSettings.localFeeNotes ?? {}) };
    for (const id of EV_UPGRADED_FEE_IDS) delete notes[id];
    clone.quoteImageSettings.localFeeNotes = notes;
  }
};

/** Version 2: weekday-only condo shuttle, stay rules, extra-night rate, and only the agent 95% offer. */
const upgradeEvStayRules = (clone: CiaContentConfig, defaults: CiaContentConfig): void => {
  for (const item of clone.rooms ?? []) {
    const fallback = defaults.rooms.find(entry => entry.id === item.id);
    if (fallback) item.note = fallback.note;
  }
  const settings = clone.quoteSettings;
  settings.stayPolicies = defaultStayPolicies();
  settings.extraNightRates = defaultExtraNightRates();
  for (const rule of settings.promotions ?? []) {
    if (!EV_ALLOWED_PROMOTION_IDS.includes(rule.id)) rule.enabled = false;
  }
};

export const cloneEvContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const clone = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  const defaults = createDefaultEvContentConfig();
  clone.quoteSettings.minorManagementFeePerPeriod ??= defaults.quoteSettings.minorManagementFeePerPeriod;
  clone.quoteSettings.peakSeasonRanges ??= [];
  if ((clone.quoteSettings.peakSeasonPolicyVersion ?? 0) < ASSOCIATION_PEAK_POLICY_VERSION) {
    const official2027 = defaults.quoteSettings.peakSeasonRanges.find(range => range.id === 'ev-peak-2027')!;
    const saved2027 = clone.quoteSettings.peakSeasonRanges.find(range => range.id === 'ev-peak-2027' || range.label.includes('2027'));
    if (saved2027) Object.assign(saved2027, { start: official2027.start, end: official2027.end, enabled: true });
    else clone.quoteSettings.peakSeasonRanges.push(copyContentData(official2027));
    clone.quoteSettings.peakSeasonPolicyVersion = ASSOCIATION_PEAK_POLICY_VERSION;
  }
  upgradeEvPolicy(clone, defaults);
  const sidaRule = clone.quoteSettings.promotions.find(rule => rule.id === 'ev-sida-95');
  if (sidaRule) {
    sidaRule.appliesTo = 'tuition-and-accommodation';
    // The brand is always written in full (user rule 2026-11-20).
    if (sidaRule.name === '思达折扣') sidaRule.name = '思达启航折扣';
    if (sidaRule.description === '课程费、住宿费和旺季附加费享95折') {
      sidaRule.description = '课程费和住宿费享95折；旺季附加费不参与折扣';
    }
  }
  const savedSettings = clone.quoteImageSettings;
  clone.quoteImageSettings = {
    ...defaults.quoteImageSettings,
    ...(savedSettings ?? {}),
    paymentNotes: {
      ...defaults.quoteImageSettings.paymentNotes,
      ...(savedSettings?.paymentNotes ?? {}),
    },
    localFeeNotes: {
      ...defaults.quoteImageSettings.localFeeNotes,
      ...Object.fromEntries((clone.localFees ?? []).map(fee => [fee.id, fee.note])),
      ...(savedSettings?.localFeeNotes ?? {}),
    },
  };
  clone.quoteImageSettings.footerNotes = clone.quoteImageSettings.footerNotes.map(note => note.replace(/思达游学/g, '思达启航'));
  return clone;
};
