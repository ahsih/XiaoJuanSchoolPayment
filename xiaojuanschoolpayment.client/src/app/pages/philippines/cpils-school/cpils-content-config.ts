import { CiaContentConfig, CiaCourseContent, CiaLocalFeeRule } from '../cia-school/cia-content-config';

const course = (id: string, name: string, tuition: number, schedule: string, note: string, sortOrder: number): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable: note, note, enabled: true, sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({ ...value, currency: 'PHP', enabled: true });

export const createDefaultCpilsContentConfig = (): CiaContentConfig => {
  const config: CiaContentConfig = {
  schemaVersion: 1,
  schoolCode: 'CPILS',
  courses: [
    course('general-esl', 'General ESL', 935, '3堂1:1 + 2堂1:4 + 2堂1:12 + 选修课', '适合基础到进阶综合提升。', 0),
    course('general-esl-light', 'General ESL Light', 600, '4节1:1 + 1节团体课', '仅限淡季入学。', 1),
    course('general-esl-plus', 'General ESL Plus', 935, '4堂1:1 + 2堂1:4 + 1堂1:12 + 选修课', '适合希望增加一对一课时的学生。', 2),
    course('premier-sparta', '斯巴达ESL', 1040, '5堂1:1 + 2堂1:4 + 2堂1:12 + 2堂强制自修 + 选修课', '适合需要明确管理和高强度学习节奏的学生。', 3),
    course('toeic-course', '托业课程', 1040, '4堂1:1 + 2堂1:4 + 2堂大团体 + 3堂强制自修 + 选修课', '每月2次模拟考试。', 4),
    course('toeic-guarantee', '托业保证班', 1132, '4堂1:1 + 2堂1:4 + 2堂大团体 + 3堂强制自修 + 选修课', '保证班入学门槛与目标分数须确认。', 5),
    course('pre-ielts-course', '雅思预备课程', 1097, '5堂1:1 + 1堂1:4 + 1堂1:8 + 2堂大团体 + 3堂强制自修', '雅思3分以下，4周起报。', 6),
    course('ielts-course', '雅思课程', 1097, '4堂1:1 + 5堂大团体 + 3堂强制自修', '每月2次模拟考试，4周起报。', 7),
    course('ielts-guarantee-8-weeks', '雅思保证班（8周）', 1247.5, '4堂1:1 + 5堂大团体 + 3堂强制自修', '8周起报，赠机考。', 8),
    course('ielts-guarantee-12-weeks', '雅思保证班（12周）', 1189.7, '4堂1:1 + 5堂大团体 + 3堂强制自修', '12周起报，赠机考。', 9),
    course('toefl-course', 'TOEFL Course', 1040, '3堂1:1 + 2堂1:4 + 2堂1:12 + 2堂大团体 + 3堂强制自修', '每月1次模拟考试。', 10),
    course('business-english', 'Business English', 1040, '4堂1:1 + 2堂1:4 + 1堂1:12 + 2堂大团体', '4周起报。', 11),
    course('power-speaking-and-modern-communication', 'PMC演讲课程', 1040, '4堂1:1 + 3堂1:4 + 1堂1:12 + 2堂大团体 + 2堂强制自修', '4周起报。', 12),
  ],
  rooms: [
    { id: 'regular-single', name: '单人房', label: '单人房', code: 'R-1', location: '校内', group: 'Regular', fee: 995, note: '隐私最好，热门档期需早确认。', enabled: true, sortOrder: 0 },
    { id: 'regular-twin', name: '双人房', label: '双人房', code: 'R-2', location: '校内', group: 'Regular', fee: 840, note: '适合朋友同行或兼顾预算与舒适度。', enabled: true, sortOrder: 1 },
    { id: 'regular-triple', name: '三人房', label: '三人房', code: 'R-3', location: '校内', group: 'Regular', fee: 775, note: '多人房中预算较平衡。', enabled: true, sortOrder: 2 },
    { id: 'regular-quad', name: '四人房', label: '四人房', code: 'R-4', location: '校内', group: 'Regular', fee: 700, note: '默认报价参考，预算压力较低。', enabled: true, sortOrder: 3 },
    { id: 'no-window-single', name: '无对外窗单人房', label: '无对外窗单人房', code: 'NW-1', location: '校内', group: '无对外窗', fee: 995, note: '空房、采光及优惠条件需提前确认。', enabled: true, sortOrder: 4 },
    { id: 'no-window-twin', name: '无对外窗双人房', label: '无对外窗双人房', code: 'NW-2', location: '校内', group: '无对外窗', fee: 840, note: '适合两人同行，优惠条件需提前确认。', enabled: true, sortOrder: 5 },
    { id: 'premium-single', name: '高级单人房', label: '高级单人房', code: 'P-1', location: '校内', group: 'Premium', fee: 1085, note: '高级房型，隐私和住宿规格更高。', enabled: true, sortOrder: 6 },
    { id: 'premium-twin', name: '高级双人房', label: '高级双人房', code: 'P-2', location: '校内', group: 'Premium', fee: 910, note: '适合重视住宿舒适度的学生。', enabled: true, sortOrder: 7 },
    { id: 'premium-triple', name: '高级三人房', label: '高级三人房', code: 'P-3', location: '校内', group: 'Premium', fee: 850, note: '兼顾预算与住宿规格。', enabled: true, sortOrder: 8 },
    { id: 'premium-quad', name: '高级四人房', label: '高级四人房', code: 'P-4', location: '校内', group: 'Premium', fee: 780, note: '高级多人房中预算压力较低。', enabled: true, sortOrder: 9 },
  ],
  localFees: [
    fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取；按报名学习时长办理，续费及换校需重新办理。', sortOrder: 0 }),
    fee({ id: 'ssp-i-card', name: 'SSP I-CARD', amount: 4000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP同时办理，只收一次。', sortOrder: 1 }),
    fee({ id: 'acr-i-card', name: 'ACR-I CARD 外国人身份证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '首次旅游签证续签时办理，学校统一带队到移民局。', sortOrder: 2 }),
    fee({ id: 'arp', name: 'ARP外国人登记', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '旅游签证首次续签或长期签证时计入一次，须由顾问确认。', sortOrder: 3 }),
    fee({ id: 'management', name: '管理费', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周2,000比索。', sortOrder: 4 }),
    fee({ id: 'water', name: '水费', amount: 800, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周800比索。', sortOrder: 5 }),
    fee({ id: 'electricity', name: '电费', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '预估每4周2,000比索；实际按用电量结算，参考22比索／kW。', sortOrder: 6 }),
    fee({ id: 'visa-extension', name: '续签费用', amount: 5130, rates: [5130, 6400, 4440, 4440, 4440], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '按所选签证和完整停留时间预估，最终以移民局收费为准。', sortOrder: 7 }),
    fee({ id: 'books', name: '书本教材费', amount: 2500, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '预估；不同课程教材不同，按实际购买结算。', sortOrder: 8 }),
    fee({ id: 'student-id', name: '学生证', amount: 100, billingRule: 'once', includeInTotal: true, note: '含ID照片，一次性费用。', sortOrder: 9 }),
    fee({ id: 'pickup', name: '宿务麦克坦机场团体接机', amount: 1000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人计费；学校团体接机可能需等候同批学生。', sortOrder: 10 }),
    fee({ id: 'deposit', name: '宿舍押金', amount: 2000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人收取；无损坏及无欠费时可退。', sortOrder: 11 }),
    fee({ id: 'fan-prepayment', name: '风扇／学生证预存', amount: 1000, billingRule: 'optional', includeInTotal: false, note: '可选；资料备注含风扇租借200比索／4周及风扇押金500比索，未使用部分可退。', sortOrder: 12 }),
  ],
  quoteSettings: {
    registrationFee: 125,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.25, '2': 0.5, '3': 0.75 },
    peakSeasonFeePerWeek: 40,
    peakSeasonRanges: [{ id: 'cpils-summer-2026', label: '2026暑假旺季', start: '2026-07-05', end: '2026-08-29', enabled: true }],
    promotions: [
      { id: 'cpils-sida', name: '思达折扣', description: '课程费和住宿费享9折。', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'cpils-off-season-spring', name: '上半年淡季优惠', description: '思达9折后再享95折；单个课程或住宿项目须满4周。', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, arrivalStart: '2026-01-01', arrivalEnd: '2026-05-31', coverageTarget: 'none' },
      { id: 'cpils-off-season-fall', name: '下半年淡季优惠', description: '思达9折后再享95折；单个课程或住宿项目须满4周。', enabled: true, sortOrder: 2, priority: 21, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, arrivalStart: '2026-08-27', arrivalEnd: '2026-12-27', coverageTarget: 'none' },
      { id: 'cpils-no-window', name: '无对外窗房优惠', description: '淡季入住无对外窗单人房或双人房，每满4周优惠50美元。', enabled: true, sortOrder: 3, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 50, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 50, coverageTarget: 'none' },
      { id: 'cpils-holiday-christmas', name: '圣诞优惠', description: '注册日在2026/06/29–12/31，学习期完整覆盖2026/12/21–12/26，优惠75美元。', enabled: true, sortOrder: 4, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 75, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, registrationStart: '2026-06-29', registrationEnd: '2026-12-31', coverageStart: '2026-12-21', coverageEnd: '2026-12-26', coverageTarget: 'course-and-accommodation' },
      { id: 'cpils-holiday-new-year', name: '圣诞／新年优惠', description: '注册日在2026/06/29–12/31，学习期完整覆盖2026/12/21–2027/01/01，优惠150美元。', enabled: true, sortOrder: 5, priority: 41, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 150, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, registrationStart: '2026-06-29', registrationEnd: '2026-12-31', coverageStart: '2026-12-21', coverageEnd: '2027-01-01', coverageTarget: 'course-and-accommodation' },
      { id: 'cpils-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', enabled: true, sortOrder: 6, priority: 60, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: '以下费用以比索计价，数量随学习周数自动更新。费用由学校及相关部门收取，仅供准备现金时参考，最终以到校缴费为准。',
    courseTableTitle: 'CPILS 2026年4周课程费',
    courseTableNote: '课程覆盖综合英语、斯巴达、雅思、托业、托福、商务与演讲方向；具体课表和资格以学校确认为准。',
    groupClassNote: '雅思保证班按8周或12周起报；考试赠送与入学门槛按所选课程和周数判断。',
    roomTableTitle: 'CPILS 2026年4周住宿费',
    roomTableNote: '单人、双人、三人、四人及Premium房型的实际空房需按入学日期确认。',
    stayPolicyTitle: 'CPILS 入住与管理提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '课程结束后的周六', note: '延住或提前入住费用须由学校确认。' },
      { label: '管理与考试', value: '按课程规则执行', note: '斯巴达、保证班、未成年及考试要求以学校当期通知为准。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '按所选课程、周数及日期计算', accommodation: '按所选房型、周数及日期计算', promotion: '按当前有效规则和学生条件自动计算' },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: '以下费用以比索计价，数量随学习周数自动更新；最终以学校及相关部门现场收费为准。',
    localFeeNotes: {},
    serviceSectionTitle: '为什么选择思达启航？',
    benefits: [
      { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
      { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
      { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
      { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
    ],
    serviceLocations: ['深圳总部', '宿务驻点', '欧洲驻点'],
    alumniBenefitTitle: '老学员专属优惠',
    alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
    noteSectionTitle: '报价说明',
    footerNotes: ['课程、住宿和优惠按当前选择及有效规则计算。', '到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
  };
  config.quoteImageSettings.localFeeNotes = Object.fromEntries(config.localFees.map(item => [item.id, item.note]));
  return config;
};

export const cloneCpilsContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultCpilsContentConfig();
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
  clone.quoteImageSettings.localFeeNotes = {
    ...defaults.quoteImageSettings.localFeeNotes,
    ...Object.fromEntries((clone.localFees ?? []).map(item => [item.id, item.note])),
    ...(clone.quoteImageSettings.localFeeNotes ?? {}),
  };
  clone.quoteImageSettings.benefits ??= structuredClone(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= structuredClone(defaults.quoteImageSettings.footerNotes);
  clone.media ??= [];
  return clone;
};
