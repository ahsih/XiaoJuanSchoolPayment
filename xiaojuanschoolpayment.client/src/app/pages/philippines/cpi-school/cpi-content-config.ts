import { CiaContentConfig, CiaCourseContent, CiaLocalFeeRule } from '../cia-school/cia-content-config';

const course = (id: string, name: string, tuition: number, schedule: string, note: string, sortOrder: number): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable: note, note, enabled: true, sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});

export const createDefaultCpiContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'CPI',
  courses: [
    course('esl-general-15', 'ESL GENERAL（15岁以上）', 900, '4节一对一 + 2节小组课 + 1节小团体课', '适合15岁以上学生综合提升英语基础。', 0),
    course('esl-intensive', 'ESL INTENSIVE', 1020, '5节一对一 + 2节小组课 + 1节小团体课', '适合希望增加一对一课时的学生。', 1),
    course('toeic-preparatory', 'TOEIC PREPARATORY', 950, '4节一对一 + 2节小组课 + 1节小团体课', '托业预备课程。', 2),
    course('toefl-preparatory', 'TOEFL PREPARATORY', 950, '4节一对一 + 2节小组课 + 1节小团体课', '托福预备课程。', 3),
    course('ielts-preparatory', 'IELTS PREPARATORY', 950, '2节ESL一对一 + 2节雅思一对一 + 2节ESL团体课 + 1节雅思团体课', '雅思预备课程。', 4),
    course('toeic-general', 'TOEIC GENERAL', 1020, '4节一对一 + 2节小组课 + 2节考试课程', '托业常规备考。', 5),
    course('toefl-general', 'TOEFL GENERAL', 1020, '4节一对一 + 2节小组课 + 2节考试课程', '托福常规备考。', 6),
    course('ielts-general', 'IELTS GENERAL', 1020, '4节一对一 + 2节小组课 + 2节考试课程', '雅思常规备考。', 7),
    course('toeic-intensive', 'TOEIC INTENSIVE', 1070, '5节一对一 + 2节小组课 + 2节考试课程', '托业强化备考。', 8),
    course('toefl-intensive', 'TOEFL INTENSIVE', 1070, '5节一对一 + 2节小组课 + 2节考试课程', '托福强化备考。', 9),
    course('ielts-intensive', 'IELTS INTENSIVE', 1070, '5节一对一 + 2节小组课 + 2节考试课程', '雅思强化备考。', 10),
    course('ielts-guarantee', 'IELTS GUARANTEE', 1120, '5节一对一 + 2节小组课 + 2节考试课程', '保证班入学门槛、目标分数和最低周数需确认。', 11),
    course('toefl-guarantee', 'TOEFL GUARANTEE', 1120, '5节一对一 + 2节小组课 + 2节考试课程', '保证班条件需由学校确认。', 12),
    course('toeic-guarantee', 'TOEIC GUARANTEE', 1120, '5节一对一 + 2节小组课 + 2节考试课程', '保证班入学门槛、目标分数和最低周数需确认。', 13),
    course('junior-6-15', 'JUNIOR（6-15岁）', 1320, '5节一对一 + 1节小组课 + 1节小团体课', '可将1节一对一转给家长，可部分周期转课。', 14),
    course('parents', 'PARENTS', 780, '2节一对一 + 1节小组课 + 1节小团体课', '适合亲子同行家长。', 15),
    course('esp-bridge', 'ESP BRIDGE', 950, '2节ESL一对一 + 2节商务英语一对一 + 1节1:2课程 + 2节小组课', '初级商务英语课程。', 16),
    course('esp-general', 'ESP GENERAL', 1020, '4节一对一 + 1节1:2课程 + 2节小组课', '常规商务英语课程。', 17),
  ],
  rooms: [
    { id: 'building-a-single', name: 'A栋单人间', label: 'A栋单人间', code: 'A-1', location: '校内', group: 'A栋', fee: 1445, note: '隐私较高，热门档期需尽早确认。', enabled: true, sortOrder: 0 },
    { id: 'building-a-double', name: 'A栋双人间', label: 'A栋双人间', code: 'A-2', location: '校内', group: 'A栋', fee: 960, note: '适合朋友同行或兼顾预算与舒适度。', enabled: true, sortOrder: 1 },
    { id: 'building-a-triple', name: 'A栋三人间', label: 'A栋三人间', code: 'A-3', location: '校内', group: 'A栋', fee: 840, note: '多人房中预算较平衡。', enabled: true, sortOrder: 2 },
    { id: 'building-a-quad', name: 'A栋四人间（上下铺）', label: 'A栋四人间（上下铺）', code: 'A-4', location: '校内', group: 'A栋', fee: 770, note: '默认报价参考房型。', enabled: true, sortOrder: 3 },
    { id: 'building-b-single', name: 'B栋单人间', label: 'B栋单人间', code: 'B-1', location: '校内', group: 'B栋', fee: 1595, note: '隐私较高，热门档期需尽早确认。', enabled: true, sortOrder: 4 },
    { id: 'building-b-double-a', name: 'B栋双人间A', label: 'B栋双人间A', code: 'B-2A', location: '校内', group: 'B栋', fee: 1160, note: 'B栋双人房A。', enabled: true, sortOrder: 5 },
    { id: 'building-b-double-b', name: 'B栋双人间B', label: 'B栋双人间B', code: 'B-2B', location: '校内', group: 'B栋', fee: 1110, note: 'B栋双人房B。', enabled: true, sortOrder: 6 },
    { id: 'building-b-triple', name: 'B栋三人间', label: 'B栋三人间', code: 'B-3', location: '校内', group: 'B栋', fee: 950, note: 'B栋三人房。', enabled: true, sortOrder: 7 },
    { id: 'building-b-quad', name: 'B栋四人间（3张床）', label: 'B栋四人间（3张床）', code: 'B-4', location: '校内', group: 'B栋', fee: 890, note: '家庭房型；3张床。', enabled: true, sortOrder: 8 },
    { id: 'building-b-six', name: 'B栋六人间', label: 'B栋六人间', code: 'B-6', location: '校内', group: 'B栋', fee: 770, note: '仅限女生。', enabled: true, sortOrder: 9 },
  ],
  localFees: [
    fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取；按报名学习时长办理，续费及换校需重新办理。', sortOrder: 0 }),
    fee({ id: 'ssp-e-card', name: 'SSP E-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP同时办理，只收一次。', sortOrder: 1 }),
    fee({ id: 'acr-i-card', name: 'ACR-I CARD 外国人身份证', amount: 4500, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '持59天旅游签证时首次续签计入一次；若持30天签证，约第4周首次续签时可能提前产生，以实际办理为准。', sortOrder: 2 }),
    fee({ id: 'arp', name: 'ARP外国人登记', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '旅游签证首次续签或长期签证时计入一次；须由顾问确认。', sortOrder: 3 }),
    fee({ id: 'management', name: '管理费', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '校内教学楼及其他设施维护费。', sortOrder: 4 }),
    fee({ id: 'water', name: '水费', amount: 1500, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周计费，不足4周按4周计算。', sortOrder: 5 }),
    fee({ id: 'electricity', name: '电费', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '预估；超出固定用量按房型另收6–20比索／千瓦时。', sortOrder: 6 }),
    fee({ id: 'visa-extension', name: '签证续签', amount: 5140, billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '按所选旅游签证及完整停留时间预估；最终以实际办理为准。', sortOrder: 7 }),
    fee({ id: 'books', name: '教材费', amount: 2000, billingRule: 'per-course-period', periodWeeks: 8, rounding: 'ceil', includeInTotal: true, note: '按每次购买教材约可使用8周预估，按实际购买结算。', sortOrder: 8 }),
    fee({ id: 'student-id', name: '学生证', amount: 350, billingRule: 'once', includeInTotal: true, note: '一次性费用。', sortOrder: 9 }),
    fee({ id: 'pickup', name: '宿务马克坦机场周日团体接机', amount: 1000, secondaryAmount: 1500, secondaryLabel: '其他时间', billingRule: 'optional', includeInTotal: false, note: '每人计费；学校团体接机可能需等候同批学生。', sortOrder: 10 }),
    fee({ id: 'deposit', name: '房间押金', amount: 3000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '每人收取；无损坏及无欠费时可退。', sortOrder: 11 }),
    fee({ id: 'laundry', name: '洗衣服务', amount: 200, secondaryLabel: '5公斤／次', billingRule: 'optional', includeInTotal: false, note: '根据实际需要使用和付费。', sortOrder: 12 }),
  ],
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.375, '2': 0.65, '3': 0.9 },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: [
      { id: 'cpi-sida-90', name: '思达折扣', description: '课程费和住宿费享9折', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'cpi-off-season', name: '淡季优惠', description: '2026/08/24–2027/01/01期间注册，每周优惠25美元', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'per-course-week', discountValue: 25, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, registrationStart: '2026-08-24', registrationEnd: '2027-01-01', coverageTarget: 'none' },
      { id: 'cpi-december', name: '12月额外优惠', description: '学习期包含2026年12月，12月期间每个完整周额外优惠25美元', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'per-course-week', discountValue: 25, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageStart: '2026-12-01', coverageEnd: '2026-12-31', coverageTarget: 'course' },
      { id: 'cpi-extra-class', name: '限量一对一加课', description: '2026/08/24–2026/09/28入学，额外加一节一对一课程；限20个名额，须学校确认', enabled: true, sortOrder: 3, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, arrivalStart: '2026-08-24', arrivalEnd: '2026-09-28', coverageTarget: 'none' },
      { id: 'cpi-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', enabled: true, sortOrder: 4, priority: 50, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: '以下费用由学校、移民局及相关部门收取，仅供准备比索现金参考，最终以到校缴费为准。签证费用按每位学生当前选择的签证类型及停留时间预估；教材按每次约用8周预估；水费不足4周按4周计算。请准备2张5.1×5.1厘米、白色背景的美签规格照片。',
    courseTableTitle: 'CPI 2026年4周课程费',
    courseTableNote: '以下为周一至周五的每日课程安排，课程费按4周计算。具体课表及节假日安排以学校确认为准。',
    groupClassNote: '青少年课程（6–15岁）可将1节一对一转给家长，可部分周期转课。',
    roomTableTitle: 'CPI 2026年4周住宿费',
    roomTableNote: '默认报价使用A栋四人间。B栋、单人房和家庭房型建议先让顾问确认空房。',
    stayPolicyTitle: 'CPI 入住与管理提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '课程结束后的周六', note: '延住、提前入住或额外住宿需单独确认费用。' },
      { label: '管理模式', value: '半斯巴达', note: '门禁、晚间学习和未成年安排以学校当期通知为准。' },
    ],
    extraNightRates: [{ label: 'B区304套房（适合四人）', amount: 5000 }],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '按所选课程、周数及日期计算', accommodation: '按所选房型、周数及日期计算', promotion: '优惠按当前有效规则自动计算' },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: '以下费用由学校、移民局及相关部门收取，仅供准备比索现金参考，最终以到校缴费为准。签证费用按每位学生当前选择的签证类型及停留时间预估；教材按每次约用8周预估；水费不足4周按4周计算。请准备2张5.1×5.1厘米、白色背景的美签规格照片。',
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

export const cloneCpiContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultCpiContentConfig();
  const clone = structuredClone(value);
  clone.localFees ??= structuredClone(defaults.localFees);
  clone.quoteSettings ??= structuredClone(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.quoteSettings.promotions ??= structuredClone(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= structuredClone(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= structuredClone(defaults.quoteSettings.extraNightRates);
  clone.quoteImageSettings ??= structuredClone(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= structuredClone(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= structuredClone(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= structuredClone(defaults.quoteImageSettings.footerNotes);
  clone.media ??= [];
  return clone;
};
