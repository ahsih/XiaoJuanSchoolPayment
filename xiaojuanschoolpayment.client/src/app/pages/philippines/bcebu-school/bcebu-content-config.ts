import { CiaContentConfig, CiaCourseContent, CiaLocalFeeRule } from '../cia-school/cia-content-config';
import {
  BCEBU_COURSES,
  BCEBU_LOCAL_FEE_INTRO,
  BCEBU_LONG_STAY_NOTE,
  BCEBU_PROMOTION_DATES,
  BCEBU_REGISTRATION_NOTE,
  BCEBU_REPORTER_NOTE,
  BCEBU_ROOMS,
} from './bcebu-pricing';

const course = (value: typeof BCEBU_COURSES[number], sortOrder: number): CiaCourseContent => ({
  id: value.id,
  name: value.name,
  tuition: value.tuition,
  tuition2027: value.tuition,
  schedule: value.suitable,
  suitable: value.note,
  note: value.note,
  enabled: true,
  sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value,
  currency: 'PHP',
  enabled: true,
});

export const createDefaultBCebuContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'BCEBU',
  courses: BCEBU_COURSES.map(course),
  rooms: BCEBU_ROOMS.map((room, sortOrder) => ({
    id: room.id,
    name: room.name,
    label: room.name,
    code: room.id,
    location: '校内',
    group: room.name.includes('单人') ? '单人间' : room.name.includes('亲子') || room.name.includes('客厅') ? '家庭与套房' : '多人间',
    fee: room.fee,
    note: room.note,
    enabled: true,
    sortOrder,
  })),
  localFees: [
    fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，按报名学习时长办理；续费及换校需要重新办理。', sortOrder: 0 }),
    fee({ id: 'ssp-e-card', name: 'SSP-E CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学和SSP同时办理，只收一次。', sortOrder: 1 }),
    fee({ id: 'acr-i-card', name: 'ACR-I CARD 外国人身份证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，学校统一办理；首次旅游签证续签时计入一次。', sortOrder: 2 }),
    fee({ id: 'arp', name: 'ARP外国人登记', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '旅游签证首次续签或长期签证时计入一次；须由顾问确认。', sortOrder: 3 }),
    fee({ id: 'management', name: '维护管理费', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '校内教学楼及其他设施维护费；按住宿周数每4周计算，不足4周先按1份预估。', sortOrder: 4 }),
    fee({ id: 'utilities', name: '水电费', amount: 4000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按住宿周数每4周计算，不足4周先按1份预估。', sortOrder: 5 }),
    fee({ id: 'visa-extension', name: '签证续签', amount: 5130, billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '每次延长30天；学校统一办理，实际以学校及移民局收费为准。', sortOrder: 6 }),
    fee({ id: 'books', name: '教材费', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '预估金额，按课程周数每4周预估1份；不同课程所需教材不同，以实际购买为准。', sortOrder: 7 }),
    fee({ id: 'student-id', name: '学生证', amount: 200, billingRule: 'once', includeInTotal: true, note: '一次性费用。', sortOrder: 8 }),
    fee({ id: 'pickup', name: '宿务马克坦机场团体接机', amount: 1000, secondaryAmount: 1500, secondaryLabel: '工作日', billingRule: 'optional', includeInTotal: false, note: '周日团体接机每人1,000比索，工作日每人1,500比索；可能需等候同批学生。', sortOrder: 9 }),
    fee({ id: 'deposit', name: '房间押金（参考）', amount: 3000, secondaryAmount: 5000, secondaryLabel: '5周以上', billingRule: 'optional', includeInTotal: false, note: '1–4周3,000比索，5–24周5,000比索；多人同住计费单位需学校确认，无损坏及无欠费时可退。', sortOrder: 10 }),
  ],
  quoteSettings: {
    registrationFee: 100,
    minorManagementFeeUnder15PerWeek: 100,
    minorManagementFeeAge15To17PerWeek: 50,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.6, '3': 0.8 },
    peakSeasonFeePerWeek: 40,
    peakSeasonRanges: [{ id: 'bcebu-summer-2026', label: '2026暑假旺季', start: '2026-07-05', end: '2026-08-15', enabled: true }],
    promotions: [
      { id: 'bcebu-registration-waiver', name: '思达免注册费', description: '通过思达报名免收新生一次性注册费。', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: true, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'bcebu-reporter', name: '记者活动优惠', description: `${BCEBU_PROMOTION_DATES}；${BCEBU_REPORTER_NOTE}`, enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'per-course-week', discountValue: 25, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'bcebu-off-season-spring', name: '春季淡季优惠', description: '2026/2/16–6/29入学；成人课程及住宿85折，亲子9折。', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 15, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, arrivalStart: '2026-02-16', arrivalEnd: '2026-06-29', coverageTarget: 'none' },
      { id: 'bcebu-off-season-fall', name: '秋冬淡季优惠', description: '2026/8/17–12/28入学；成人课程及住宿85折，亲子9折。', enabled: true, sortOrder: 3, priority: 31, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 15, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, arrivalStart: '2026-08-17', arrivalEnd: '2026-12-28', coverageTarget: 'none' },
      { id: 'bcebu-family-off-season', name: '亲子淡季比例', description: '符合淡季入学日期的亲子方案按课程及住宿9折。', enabled: true, sortOrder: 4, priority: 32, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'bcebu-sida-90', name: '思达启航专属折扣', description: '课程及住宿在记者、淡季优惠后再享9折。', enabled: true, sortOrder: 5, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'bcebu-long-stay', name: '长期优惠', description: BCEBU_LONG_STAY_NOTE, enabled: true, sortOrder: 6, priority: 50, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 50, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 8, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 100, coverageTarget: 'none' },
      { id: 'bcebu-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', enabled: true, sortOrder: 7, priority: 60, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: BCEBU_LOCAL_FEE_INTRO,
    courseTableTitle: "B'Cebu 2026年4周课程费",
    courseTableNote: '以下课程费以美元计价，住宿费另计；课程资格、年龄条件和正式课表以学校确认为准。',
    groupClassNote: 'IELTS保证班需雅思官方成绩，12周起报；40岁以上轻量课、青少年与幼儿园课程须按年龄确认。',
    roomTableTitle: "B'Cebu 2026年4周住宿费",
    roomTableNote: '以下住宿费以美元计价；50岁以上、亲子、同行关系和淡季开放条件会影响可选房型。',
    stayPolicyTitle: "B'Cebu 入住与管理提醒",
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程从周一开始；周六下午4点后可免费提前入住。' },
      { label: '退房日期', value: '课程结束后的周六', note: '延住、提前入住及额外住宿费用需学校确认。' },
      { label: '未成年管理', value: '按年龄和住宿周数计算', note: '15岁以下与15–17岁费率不同；旺季独自入学限制需确认。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: BCEBU_REGISTRATION_NOTE, course: '按所选课程、周数及日期计算', accommodation: '按所选房型、周数及日期计算', promotion: '按当前有效规则及学生条件自动计算' },
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
    alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
    noteSectionTitle: '报价说明',
    footerNotes: ['课程、住宿和优惠按当前选择及有效规则计算。', '到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

export const cloneBCebuContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultBCebuContentConfig();
  const clone = structuredClone(value);
  clone.localFees ??= structuredClone(defaults.localFees);
  clone.quoteSettings ??= structuredClone(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= structuredClone(defaults.quoteSettings.peakSeasonRanges);
  clone.quoteSettings.promotions ??= structuredClone(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= structuredClone(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteImageSettings ??= structuredClone(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= structuredClone(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= structuredClone(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= structuredClone(defaults.quoteImageSettings.footerNotes);
  clone.media ??= [];
  return clone;
};
