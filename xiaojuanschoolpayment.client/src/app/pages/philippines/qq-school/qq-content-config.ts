// CampusTop's content document: both campuses' courses and rooms (rooms tagged by campus), local fees, offers and
// quote-image copy; one school record and one document (code QQ). Each campus page reads its own part through
// qqCampusContent. The quote prices courses by class days and rooms by nights (qq-pricing.ts); the four-week figures
// here are what the course and room tables show. Keep it pure data (no Angular, DOM, storage or structuredClone),
// so the WeChat mini program can bundle it. Sources: docs/qq-source-2026-11-26.md.
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
  QQ_CAMPUS_NAMES,
  QQ_COURSE_PACKAGES,
  QQ_REGISTRATION_FEE,
  QQ_ROOMS,
  qqFourWeekPrice,
  qqFourWeekRoomPrice,
  type QqCampus,
} from './qq-pricing';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const QQ_SCHOOL_CODE = 'QQ' as CiaContentConfig['schoolCode'];
export const QQ_RETURNING_RULE_ID = 'qq-returning-registration';

const course = (item: (typeof QQ_COURSE_PACKAGES)[number], sortOrder: number): CiaCourseContent => ({
  id: item.id,
  name: item.name,
  tuition: qqFourWeekPrice(item.id),
  tuition2027: qqFourWeekPrice(item.id),
  campus: 'both',
  courseType: '英语课程',
  schedule: item.schedule,
  suitable: item.suitable,
  note: item.groupClasses
    ? '小团课只收15岁以上学生；每节课50分钟，入学后按分级测试和所选课时由学校排课。'
    : '每节课50分钟；4–14岁的孩子只能报一对一课程。入学后按分级测试和所选课时由学校排课。',
  enabled: true,
  sortOrder,
});

const room = (item: (typeof QQ_ROOMS)[number], sortOrder: number): CiaRoomContent => ({
  id: item.id,
  name: item.name,
  label: item.name,
  code: '',
  location: item.group === '学校宿舍' ? '校内' : '校外',
  group: item.group,
  campus: item.campuses.length === 1 ? item.campuses[0] : 'both',
  fee: qqFourWeekRoomPrice(item.id),
  note: item.note,
  enabled: true,
  sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({ ...value, currency: 'PHP', enabled: true });

/** The local-fee sheet of 2026-11-24 and the school's quote system; amounts in pesos, paid at school. */
const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({
    id: 'visa-extension', name: '签证续签', amount: 7230, billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true,
    includeInTotal: true, sortOrder: 0,
    note: '按在菲律宾的总天数累计：30天签证31–59天7,230、60–89天9,210、90–119天13,250、120–149天15,230、150–179天19,270比索；59天签证60–89天7,230、90–119天9,210、120–149天13,250、150–179天15,230比索；按移民局实际收费。',
  }),
  fee({ id: 'ssp', name: 'SSP特别学习许可', amount: 12000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学时办理。', sortOrder: 1 }),
  fee({
    id: 'acr-i-card', name: 'ACR I-Card', amount: 4000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true,
    note: '在菲律宾停留59天以上才需要办理，只收一次。', sortOrder: 2,
  }),
  fee({ id: 'student-id', name: '学生证', amount: 420, billingRule: 'once', includeInTotal: true, note: '入学时办理一次。', sortOrder: 3 }),
  fee({
    id: 'electricity', name: '宿舍电费', amount: 110, billingRule: 'per-accommodation-period', includeInTotal: true, sortOrder: 4,
    note: '只有住太空舱宿舍的学生收取，每晚110比索。',
  }),
  fee({
    id: 'books', name: '教材费', amount: 2000, secondaryAmount: 1000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true,
    note: '按实际课程需要购买，约1,000–2,000比索；学校提供大部分电子教材。', sortOrder: 5,
  }),
];

const createPromotions = (): CiaPromotionRule[] => [
  {
    id: QQ_RETURNING_RULE_ID, name: '老学员返校', enabled: true, priority: 10, stackable: true, newStudentsOnly: false,
    discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true,
    minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none', sortOrder: 0,
    description: '2022年7月1日以后在QQ English读过书的老学员免收注册费。',
  },
];

const LOCAL_FEE_INTRO = '以下费用到校后在学校用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和在菲律宾的天数预估；宿舍电费只有住太空舱的学生收取；教材按实际课程购买，不计入合计。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

const imageSettings = (campus: QqCampus): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: { registration: '一次性费用，2022年7月1日以后读过的老学员免收', course: '', accommodation: '', promotion: '' },
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
    `本报价只含${QQ_CAMPUS_NAMES[campus]}的课程和住宿；两个校区分开报价和收费。`,
    '课程费按实际上课天数计算，学校停课的假期不收课程费；到校费用、签证与教材按实际发生和学校最新政策确认。',
    '最终以学校报价系统、空房及账单为准。',
  ],
});

export const createDefaultQqContentConfig = (): CiaContentConfig => {
  const itp = imageSettings('itp');
  const bfc = imageSettings('bfc');
  const quoteSettings: CiaQuoteSettings = {
    registrationFee: QQ_REGISTRATION_FEE,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: {},
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'QQ English 4周课程费',
    courseTableNote: '表中是4周（20个上课日）的价格。学校按实际上课天数收费：1周276美元起，读3–7周和8周以上每天的单价不同，学校停课的假期不收费；报价器会按你的日期算。',
    groupClassNote: '每节课50分钟；小团课一般最多8人，只收15岁以上学生。',
    roomTableTitle: 'QQ English 4周住宿费',
    roomTableNote: '按晚计算，周日入住、课程结束后的周六退房，4周共27晚；酒店按间收费，太空舱按人收费；也可以走读，自己安排住宿，不收住宿费。餐食另付。',
    stayPolicyTitle: 'QQ English 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '开课前一天（周日）入住', note: '周一开课。' },
      { label: '退房日期', value: '课程结束后的周六', note: '酒店退房时间按酒店规定。' },
      { label: '酒店房间', value: '按间收费', note: 'Treewoods每间最多2人；两人同住只付一间房费。' },
    ],
    extraNightRates: [],
  };
  return {
    schemaVersion: 1,
    schoolCode: QQ_SCHOOL_CODE,
    courses: QQ_COURSE_PACKAGES.map(course),
    rooms: QQ_ROOMS.map(room),
    localFees: createLocalFees(),
    quoteSettings,
    quoteImageSettings: itp,
    campusQuoteImageSettings: { itp, bfc },
    media: [],
  };
};

/** Fills a saved or previewed document up to the current schema; returns a copy. */
export const cloneQqContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultQqContentConfig();
  if (value?.schemaVersion !== 1 || value.schoolCode !== QQ_SCHOOL_CODE) return defaults;
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings = { ...copyJson(defaults.quoteSettings), ...(clone.quoteSettings ?? {}) };
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.media ??= [];
  clone.campusQuoteImageSettings ??= {};
  for (const campus of ['itp', 'bfc']) {
    const base = defaults.campusQuoteImageSettings![campus];
    const saved = clone.campusQuoteImageSettings[campus];
    clone.campusQuoteImageSettings[campus] = {
      ...copyJson(base), ...(saved ?? {}),
      paymentNotes: { ...base.paymentNotes, ...(saved?.paymentNotes ?? {}) },
      promotionNotes: { ...base.promotionNotes, ...(saved?.promotionNotes ?? {}) },
      localFeeNotes: { ...base.localFeeNotes, ...(saved?.localFeeNotes ?? {}) },
      supplementalFeeNotes: { ...base.supplementalFeeNotes, ...(saved?.supplementalFeeNotes ?? {}) },
    };
  }
  clone.quoteImageSettings = clone.campusQuoteImageSettings['itp'];
  return clone;
};

export const qqQuoteImageSettings = (content: CiaContentConfig, campus: QqCampus): CiaQuoteImageSettings =>
  content.campusQuoteImageSettings?.[campus] ?? content.quoteImageSettings;

/** Whether a course or room of the shared document belongs to this campus ('both' or untagged: both campuses). */
export const qqOnCampus = (item: { campus?: string }, campus: QqCampus): boolean =>
  !item.campus || item.campus === 'both' || item.campus === campus;

/** One campus's part of the shared document: its courses, rooms and quote-image copy. */
export function qqCampusContent(value: CiaContentConfig, campus: QqCampus): CiaContentConfig {
  const content = cloneQqContentConfig(value);
  content.courses = content.courses.filter(item => qqOnCampus(item, campus));
  content.rooms = content.rooms.filter(item => qqOnCampus(item, campus));
  content.quoteImageSettings = qqQuoteImageSettings(content, campus);
  return content;
}
