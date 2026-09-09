import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaQuoteImageSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

const course = (
  id: string,
  name: string,
  tuition: number,
  schedule: string,
  suitable: string,
  sortOrder: number,
): CiaCourseContent => ({
  id,
  name,
  tuition,
  tuition2027: tuition,
  schedule,
  suitable,
  note: 'EV 2026年4周课程费；最终以学校正式报价为准。',
  enabled: true,
  sortOrder,
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

const quoteImageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '一次性费用；老学员返校可按当前规则免收',
    course: '课程日期、周数和每日课表以学生当前选择为准',
    accommodation: '住宿日期、房型及金额由当前方案自动生成，最终以空房确认为准',
    promotion: '',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '以下费用以比索计价，本报价仅供学生参考，具体以到校后实际产生及学校收取为准；接机与可退押金另列。',
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
    '1、学费部分需在到校前2周交齐，可交由思达游学代收，或自行直接向学校转付美元；本报价单所列学校费用即为最终价格，人民币支付时按照支付宝实时汇率将美元换算为人民币结算。',
    '最终以学校价格、空房及优惠确认为准。',
  ],
});

export const createDefaultEvContentConfig = (): CiaContentConfig => {
  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: 'EV',
    courses: [
      course('sparta-intensive-esl', '斯巴达 Intensive ESL', 1030, '4节一对一 + 2节小团体课 + 2节大团体课 + 选修课', '斯巴达综合英语｜适合希望加强纪律和学习强度的学生', 0),
      course('sparta-power-speaking-6', '强化口说6（斯巴达）', 1230, '6节一对一 + 1节小团体课 + 1节大团体课 + 选修课', '高一对一口语训练｜斯巴达管理', 1),
      course('sparta-power-speaking-8', '强化口说8（斯巴达）', 1410, '8节一对一 + 自习 + 选修课', '最高一对一课时｜斯巴达管理', 2),
      course('sparta-ielts-regular', '常规雅思（斯巴达）', 1150, '4节一对一 + 2节小团体课 + 2节大团体课 + 选修课', '雅思常规备考｜斯巴达管理', 3),
      course('sparta-ielts-guarantee', '雅思保证班（斯巴达）', 1290, '1节早课 + 4节一对一 + 4节团体课 + 1节晚课 + 选修课；入学需提交雅思官方成绩', '雅思目标分数保证班｜最低12周', 4),
      course('sparta-toeic', '多益（斯巴达）', 1150, '4节一对一 + 4节团体课 + 自习 + 选修课', 'TOEIC考试准备｜斯巴达管理', 5),
      course('sparta-social-media-english', '社交媒体英语（斯巴达）', 1150, '4节一对一 + 4节团体课 + 自习 + 选修课', '数字沟通与内容表达｜斯巴达管理', 6),
      course('sparta-business', '商务英语（斯巴达）', 1150, '4节一对一 + 4节团体课 + 自习 + 选修课', '职场英语与商务沟通｜斯巴达管理', 7),
      course('semi-sparta-esl', '半斯巴达 ESL', 980, '4节一对一 + 2节小团体课 + 2节大团体课 + 选修课', '综合英语｜兼顾学习与宿务生活', 8),
      course('semi-sparta-power-speaking-6', '强化口说6（半斯巴达）', 1180, '6节一对一 + 1节小团体课 + 1节大团体课 + 选修课', '高一对一口语训练｜半斯巴达管理', 9),
      course('semi-sparta-power-speaking-8', '强化口说8（半斯巴达）', 1360, '8节一对一 + 选修课', '最高一对一课时｜半斯巴达管理', 10),
      course('semi-sparta-toeic', '多益（半斯巴达）', 1100, '4节一对一 + 4节团体课 + 选修课', 'TOEIC考试准备｜半斯巴达管理', 11),
      course('semi-sparta-business', '商务英语（半斯巴达）', 1100, '4节一对一 + 4节团体课 + 选修课', '职场英语与商务沟通｜半斯巴达管理', 12),
      course('semi-sparta-social-media-english', '社交媒体英语（半斯巴达）', 1100, '4节一对一 + 4节团体课 + 选修课', '数字沟通与内容表达｜半斯巴达管理', 13),
    ],
    rooms: [
      room('single', '单人间', 1400, '热门房型建议提前6个月预定。', '校内', 0),
      room('double', '双人间', 1030, '热门房型建议提前6个月预定。', '校内', 1),
      room('triple', '三人间', 950, '校内住宿。', '校内', 2),
      room('quad-bunk', '四人间（上下铺）', 900, '校内四人间，上下铺房型。', '校内', 3),
      room('off-campus-single', '校外公寓单人间', 1550, '校外公寓，另计校外公寓管理费。', '校外', 4),
      room('off-campus-double', '校外公寓双人间', 1150, '仅限两人同时预定，另计校外公寓管理费。', '校外', 5),
    ],
    localFees: [
      { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，按报名学习时长办理；续费或换校需重新办理。', enabled: true, sortOrder: 0 },
      { id: 'ssp-e-card', name: 'SSP E-CARD', currency: 'PHP', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP同时办理，只收一次。', enabled: true, sortOrder: 1 },
      { id: 'acr-i-card', name: 'ACR-I Card 外国人身份证', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: true, note: '旅游签证首次续签时办理，由学校统一处理。', enabled: true, sortOrder: 2 },
      { id: 'arp', name: 'ARP外国人登记', currency: 'PHP', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '长期签证或旅游签证首次续签时计入一次；须由顾问确认学校最新政策。', enabled: true, sortOrder: 3 },
      { id: 'on-campus-management', name: '校内管理费', currency: 'PHP', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '仅校内住宿计收；每4周计算，不足4周按4周预估。', enabled: true, sortOrder: 4 },
      { id: 'off-campus-management', name: '校外宿舍管理费', currency: 'PHP', amount: 4000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '仅校外住宿计收；每4周计算，不足4周按4周预估。', enabled: true, sortOrder: 5 },
      { id: 'electricity', name: '电费', currency: 'PHP', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按住宿周数预估；每周超过15kW用电量，超出部分另收20比索／kW。', enabled: true, sortOrder: 6 },
      { id: 'water', name: '水费', currency: 'PHP', amount: 1200, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按住宿周数预估；包含公共用水和房间用水。', enabled: true, sortOrder: 7 },
      { id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 5430, rates: [5430, 4700], billingRule: 'visa-extension-schedule', includeInTotal: true, note: '首次约5,430比索，后续约4,700比索／次，以移民局实收为准。', enabled: true, sortOrder: 8 },
      { id: 'books', name: '教材费', currency: 'PHP', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按累计课程周数预估；换课或实际购买不同教材时调整。', enabled: true, sortOrder: 9 },
      { id: 'student-id', name: '学生证', currency: 'PHP', amount: 500, billingRule: 'once', includeInTotal: true, note: '一次性费用。', enabled: true, sortOrder: 10 },
      { id: 'cebu-pickup', name: '宿务马克坦机场团体接机', currency: 'PHP', amount: 1200, billingRule: 'optional', includeInTotal: false, note: '学校周日团体接机，按实际选择人数计费；可能需等候同批学生。', enabled: true, sortOrder: 11 },
      { id: 'room-deposit', name: '房间押金', currency: 'PHP', amount: 3000, secondaryAmount: 5000, secondaryLabel: '9至24周', billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '1至8周3,000比索，9至24周5,000比索；无损坏及无欠费时可退', enabled: true, sortOrder: 12 },
    ],
    quoteSettings: {
      registrationFee: 100,
      minorManagementFeePerPeriod: 100,
      futurePriceRegistrationStart: '',
      futurePriceArrivalStart: '',
      shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.85 },
      peakSeasonFeePerWeek: 40,
      peakSeasonRanges: [
        { id: 'ev-peak-2027', label: '2027暑期旺季', start: '2027-07-04', end: '2027-08-28', enabled: true },
      ],
      promotions: [
        { id: 'ev-sida-95', name: '思达折扣', description: '课程费、住宿费和旺季附加费享95折', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
        { id: 'ev-returning-registration', name: '老学员注册费减免', description: '老学员返校免收一次性注册费', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      ],
      localFeeIntro: '以下费用以比索计价，本报价仅供学生参考，具体以到校后实际产生及学校收取为准；接机与可退押金另列。',
      courseTableTitle: 'EV 2026年4周课程费',
      courseTableNote: '以下为4周课程费参考，币种为美元。最终以学校当期报价、空房和优惠为准。',
      groupClassNote: '课程按斯巴达与半斯巴达分组；每日课表和选修课以学校当期安排为准。',
      roomTableTitle: 'EV 2026年4周食宿费',
      roomTableNote: '默认报价使用四人间；热门房型建议提前确认空房。',
      stayPolicyTitle: 'EV入住与离校提醒',
      stayPolicies: [
        { label: '入住日期', value: '周日入住', note: '课程和住宿按周日开始，并提前确认接机和空房。' },
        { label: '离校日期', value: '课程结束后的周六', note: '每条课程和住宿按照完整周日至周六计算。' },
        { label: '未成年学生', value: '提前确认陪同规则', note: '未满18岁按当前规则计收管理费；15岁以下通常需要家长陪同。' },
      ],
      extraNightRates: [],
    },
    quoteImageSettings: quoteImageSettings(),
  };

  config.quoteImageSettings.localFeeNotes = Object.fromEntries(
    config.localFees.map((fee: CiaLocalFeeRule) => [fee.id, fee.note]),
  );
  return config;
};

export const cloneEvContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const clone = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  const defaults = createDefaultEvContentConfig();
  const savedSettings = clone.quoteImageSettings;
  clone.quoteSettings.minorManagementFeePerPeriod ??= defaults.quoteSettings.minorManagementFeePerPeriod;
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
  return clone;
};
