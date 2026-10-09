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
  note: string,
  sortOrder: number,
): CiaCourseContent => ({
  id,
  name,
  tuition,
  tuition2027: tuition,
  schedule,
  suitable,
  note,
  enabled: true,
  sortOrder,
});

const room = (
  id: string,
  name: string,
  label: string,
  code: string,
  group: string,
  fee: number,
  note: string,
  sortOrder: number,
): CiaRoomContent => ({
  id,
  name,
  label,
  code,
  location: '校内',
  group,
  fee,
  note,
  enabled: true,
  sortOrder,
});

const quoteImageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '一次性费用；通过思达报名可按当前优惠规则减免',
    course: '课程日期、周数和课程安排以学生当前选择为准',
    accommodation: '住宿费不含餐费，房型最终以学校空房确认为准',
    promotion: '系统按报名日期、学习日期、房型及活动条件自动计算',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '学杂费由学生抵达菲律宾后直接向学校或有关部门缴纳；本报价按当前方案预估，最终以学校实际收取为准。',
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
    '课程与住宿按周日入住、周六离校计算；住宿不含餐费。',
    '最终以MONOL正式账单、空房、房型及优惠资格确认为准。',
  ],
});

export const createDefaultMonolContentConfig = (): CiaContentConfig => {
  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: 'MONOL',
    courses: [
      course('esl-4', 'ESL 4', 750, '4节一对一 + 4节团体选修课 + 健身选修课', '轻量综合英文｜预算与自习时间优先', '适合希望保留复习和生活弹性，同时维持一对一训练的学生。', 0),
      course('general-esl', 'General ESL', 900, '5节一对一 + 4节团体选修课 + 健身选修课', '基础与综合英文｜系统提升', '覆盖听说读写、语法和发音，适合打基础和稳定提升。', 1),
      course('ielts', 'IELTS', 1000, '5节一对一 + 4节团体选修课 + 健身选修课', '雅思备考｜升学、就业或移民方向', '按当期安排进行模拟考试，报名时需确认英语基础和目标分数。', 2),
      course('leap-english', 'LEAP English', 1150, '5节一对一 + 4节团体选修课 + 健身选修课', '客制化英文｜职业或专项目标', '先做学习目标分析，再按General ESL、IELTS、TOEIC、Business或其他科目组合课程。', 3),
    ],
    rooms: [
      room('premium-single-room', '高级单人间', '高级单人间', 'PREMIUM-1', '单人间', 1100, '独立空间与生活设备较完整，适合重视住宿舒适度的学生。', 0),
      room('standard-single-room', '标准单人间', '标准单人间', 'STANDARD-1', '单人间', 750, '标准单人房型，需按当期空房确认。', 1),
      room('small-single-room', '小单间', '小单间', 'SMALL-1', '单人间', 650, '由大单间改造为两个小房间，两人共用一个洗手间。', 2),
      room('triple-room', '三人间', '三人间', 'TRIPLE-3', '多人间', 500, '适合希望兼顾预算和住宿人数的学生。', 3),
      room('quad-room', '四人间（胶囊式上下铺）', '四人间', 'QUAD-4', '多人间', 400, '胶囊式上下铺，为默认预算参考房型。', 4),
    ],
    localFees: [
      { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', includeInTotal: true, note: '移民局收取，有效期6个月；更换学校需重新办理。', enabled: true, sortOrder: 0 },
      { id: 'ssp-e-card', name: 'SSP-I Card', currency: 'PHP', amount: 4500, billingRule: 'once', includeInTotal: true, note: '入学时与SSP同时办理，只收一次。', enabled: true, sortOrder: 1 },
      { id: 'acr-i-card', name: 'ACR-I Card 外国人身份证', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: true, note: '第一次签证续签时办理；以学校及移民局要求为准。', enabled: true, sortOrder: 2 },
      { id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 4940, rates: [4940], billingRule: 'visa-extension-schedule', includeInTotal: true, note: '每次按30天预估；实际以移民局及学校办理为准。', enabled: true, sortOrder: 3 },
      { id: 'books', name: '教材费', currency: 'PHP', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按每个开始的4周课程周期预估；使用电子教材免费，需自带电子设备。', enabled: true, sortOrder: 4 },
      { id: 'student-id', name: '学生证', currency: 'PHP', amount: 130, billingRule: 'once', includeInTotal: true, note: '一次性费用。', enabled: true, sortOrder: 5 },
      { id: 'manila-pickup', name: '马尼拉机场接机', currency: 'PHP', amount: 3000, billingRule: 'optional', includeInTotal: true, note: '学生自由选择；指定周日固定时间团体接机。', enabled: true, sortOrder: 6 },
      { id: 'clark-pickup', name: '克拉克机场接机', currency: 'PHP', amount: 3000, billingRule: 'optional', includeInTotal: true, note: '学生自由选择；指定周日固定时间团体接机。', enabled: true, sortOrder: 7 },
      { id: 'room-deposit', name: '房间押金', currency: 'PHP', amount: 4000, billingRule: 'once', includeInTotal: false, multiplyByStudents: true, note: '可退；无损坏及欠费时按学校规定退还，不计入学杂费合计。', enabled: true, sortOrder: 8 },
      { id: 'meals', name: '餐费', currency: 'PHP', amount: 14000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: false, note: '参考约150–250比索／餐，按实际点餐付费；不计入学杂费合计。', enabled: true, sortOrder: 9 },
    ],
    quoteSettings: {
      monolPromotionPolicyVersion: 20261008,
      registrationFee: 100,
      futurePriceRegistrationStart: '',
      futurePriceArrivalStart: '',
      shortStayRatios: { '2': 0.5, '3': 0.75 },
      peakSeasonFeePerWeek: 0,
      peakSeasonRanges: [],
      promotions: [
        { id: 'monol-registration-waiver', name: '思达注册费优惠', description: '所有通过思达报名的学生免收100美元注册费', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
        ...(['course', 'room'] as const).map((kind, index) => ({ id: `monol-off-season-${kind}-2026`, name: kind === 'course' ? '淡季课程优惠' : '淡季住宿优惠', description: '2026年12月31日或之前报名并在MONOL主校区学习及住宿，每完整4周减100美元；2027年6月27日至8月21日不适用。' + (kind === 'course' ? 'IELTS的100美元及LEAP的250美元学术费不减免。' : ''), enabled: true, sortOrder: index + 1, priority: 20 + index, stackable: true, newStudentsOnly: false, discountType: 'fixed' as const, discountValue: 100, appliesTo: kind === 'course' ? 'tuition' as const : 'accommodation' as const, waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation' as const })),
        { id: 'monol-sns', name: 'SNS特别活动', description: '2026年12月31日或之前报名，仅标准单人间及小单间（Semi-single）每完整4周减100美元；须在Instagram、个人博客、Facebook、Threads、小红书或TikTok等一个平台发布一篇在校故事。2027年6月27日至8月21日不适用；活动可能提前关闭，报名时须确认。', enabled: true, sortOrder: 3, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', eligibleRoomIds: ['standard-single-room', 'small-single-room'] },
        { id: 'monol-long-term', name: '长住优惠', description: '2026年9月7日至12月31日报名，学习及住宿16／20／24周分别减150／200／300美元；取消或缩短学习期间则失效。', enabled: true, sortOrder: 4, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 0, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 16, minimumAccommodationWeeks: 16, registrationStart: '2026-09-07', registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation' },
        { id: 'monol-christmas', name: '圣诞新年优惠', description: '2026年11月29日至2027年1月10日周日抵达，在主校区学习及住宿至少4周，每人一次减100美元；学校保障假日期间学习日。', enabled: true, sortOrder: 5, priority: 50, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, arrivalStart: '2026-11-29', arrivalEnd: '2027-01-10', coverageTarget: 'none' },
      ],
      localFeeIntro: '已按每位学生各自的完整停留跨度、签证与接机选择估算；不同签证说明按学生分别保留。房间押金与餐费另行准备，不计入学杂费和人民币预估合计。',
      courseTableTitle: 'MONOL 2026年课程费 / 4周',
      courseTableNote: '注册费为100美元；课程费以4周为基础价格，其他周数按比例估算。',
      groupClassNote: '课程节数、团体选修课和模拟考试以学校当期课表为准。',
      roomTableTitle: 'MONOL 2026年住宿费 / 4周（不含餐费）',
      roomTableNote: '住宿费不含餐费；房型、床位及设备最终以学校当期空房确认为准。',
      stayPolicyTitle: 'MONOL入住与离校提醒',
      stayPolicies: [
        { label: '入住日期', value: '周日入住', note: '按学校公布的周日入学档期入住，并提前确认接机和空房。' },
        { label: '离校日期', value: '课程结束后的周六', note: '课程与住宿按完整周日至周六计算。' },
        { label: '餐费', value: '住宿费不含餐费', note: '餐费按实际选择另行准备，上课日免费早餐有效至2027/12/31，周末及节假日除外。' },
      ],
      extraNightRates: [],
    },
    quoteImageSettings: quoteImageSettings(),
    media: [],
  };

  config.quoteImageSettings.localFeeNotes = Object.fromEntries(
    config.localFees.map((fee: CiaLocalFeeRule) => [fee.id, fee.note]),
  );
  return config;
};

export const cloneMonolContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const clone = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  const defaults = createDefaultMonolContentConfig();
  // Upgrade superseded poster rules without overwriting other employee content.
  const versioned = clone.quoteSettings;
  if ((versioned.monolPromotionPolicyVersion ?? 0) < 20261008) {
    clone.quoteSettings.promotions = [
      ...clone.quoteSettings.promotions.filter(rule => !rule.id.startsWith('monol-off-season-') && !['monol-sns', 'monol-long-term', 'monol-christmas'].includes(rule.id)),
      ...defaults.quoteSettings.promotions.filter(rule => rule.id !== 'monol-registration-waiver'),
    ];
    if (clone.quoteImageSettings?.promotionNotes) {
      for (const key of Object.keys(clone.quoteImageSettings.promotionNotes)) {
        if (key.startsWith('monol-off-season-') || ['monol-sns', 'monol-long-term', 'monol-christmas'].includes(key)) {
          delete clone.quoteImageSettings.promotionNotes[key];
        }
      }
    }
    versioned.monolPromotionPolicyVersion = 20261008;
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
  return clone;
};
