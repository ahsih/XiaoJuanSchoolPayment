import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaQuoteImageSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

const course = (id: string, name: string, schedule: string, suitable: string, note: string, sortOrder: number): CiaCourseContent => ({
  id, name, tuition: 950, tuition2027: 950, schedule, suitable, note, enabled: true, sortOrder,
});

const room = (id: string, name: string, label: string, code: string, fee: number, note: string, sortOrder: number): CiaRoomContent => ({
  id, name, label, code, location: '校内', group: name.includes('单人') || name.includes('雅房') ? '单人房' : '多人房', fee, note, enabled: true, sortOrder,
});

const quoteImageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '学校原价100美元／人；通过思达启航报名的学生全部免注册费',
    course: '课程日期、周数和课程安排以当前选择为准',
    accommodation: '住宿含平日三餐及周末、节假日一餐；房型以空房确认为准',
    promotion: '系统仅按活动海报可确认的报名截止日、课程及住宿周数计算',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '按国籍对应的入境停留天数和完整住宿周期估算；最终以学校与菲律宾移民局实际收取为准。',
  localFeeNotes: {},
  serviceSectionTitle: '为什么选择思达启航？',
  benefits: [
    { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
    { title: '资料核对', text: '课程、住宿、优惠和当地费用逐项核实' },
    { title: '报名协助', text: '选课、付款、签证和行前准备全程跟进' },
    { title: '在菲支持', text: '学习期间持续协助学校沟通' },
  ],
  serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
  alumniBenefitTitle: '老学员专属支持',
  alumniBenefitText: '结业后可继续咨询线上英语、菲律宾复学及爱尔兰与欧美留学方案。',
  noteSectionTitle: '报价说明',
  footerNotes: [
    '课程与住宿按周日入住、周六离校计算；1–3周可由顾问向学校单独询价，页面不自动套用未公布的短期比例。',
    'SNS活动要求每完整4周在小红书、TikTok、Facebook、Messenger、Instagram、Google Map、Threads等平台发布1条在校故事；活动开放与优惠叠加须由学校确认。',
    '最终以MONOL斯巴达校区正式账单、空房及优惠资格确认为准。',
  ],
});

export const createDefaultMonolSpartaContentConfig = (): CiaContentConfig => {
  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: 'MONOL-SPARTA',
    courses: [
      course('booster-esl', 'Booster ESL', '6节一对一 + 2节选修团体课 + 1节晚间选修团体课 + 1节单词与句子测试', '需要密集提升综合英语，并能适应强制自习与每日测试的学生', '每4周进行一次学习评估。', 0),
      course('master-ielts', 'Master IELTS', '5节一对一 + 3节团体课（含必修模拟考试）+ 1节晚间选修团体课 + 1节单词与句子测试', '有雅思备考目标，并希望用高密度训练与频繁模拟测试推进的学生', '每2周进行一次学习评估；周一至周五按科目安排每日模拟考试。', 1),
    ],
    rooms: [
      room('premium-single-room', '高级单人间', '高级单人间', 'PREMIUM-1', 1200, '校内单人房，具体设备与空房以学校确认为准。', 0),
      room('standard-single-room', '标准单人间', '标准单人间', 'STANDARD-1', 1050, '校内单人房，具体设备与空房以学校确认为准。', 1),
      room('semi-single-room', '单人雅房', '单人雅房', 'SEMI-1', 900, 'Semi Single Room；具体格局与空房以学校确认为准。', 2),
      room('double-room', '双人间', '双人间', 'DOUBLE-2', 800, '校内双人房。', 3),
      room('triple-room', '三人间', '三人间', 'TRIPLE-3', 700, '校内三人房，为当前最低住宿费参考房型。', 4),
    ],
    localFees: [
      { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', includeInTotal: true, note: '适用于1–24周。', enabled: true, sortOrder: 0 },
      { id: 'ssp-acr', name: 'SSP ACR I-CARD', currency: 'PHP', amount: 4500, billingRule: 'once', includeInTotal: true, note: '所有学生均须办理，不因学习周数改变。', enabled: true, sortOrder: 1 },
      { id: 'visa-extension', name: '签证延签', currency: 'PHP', amount: 0, billingRule: 'visa-extension-schedule', includeInTotal: true, note: '按护照地区、入境停留天数和住宿周数套用学校签证表。', enabled: true, sortOrder: 2 },
      { id: 'manila-group-pickup', name: '马尼拉机场常规团体接机', currency: 'PHP', amount: 3000, billingRule: 'selected-manila-pickup', includeInTotal: true, note: '按学校常规团体接机安排；班次与时间须确认。', enabled: true, sortOrder: 3 },
      { id: 'clark-group-pickup', name: '克拉克机场常规团体接机', currency: 'PHP', amount: 3000, billingRule: 'selected-clark-pickup', includeInTotal: true, note: '按学校常规团体接机安排；班次与时间须确认。', enabled: true, sortOrder: 4 },
      { id: 'security-deposit', name: '宿舍押金', currency: 'USD', amount: 100, billingRule: 'once', includeInTotal: false, note: '可退押金；退还以房间无损坏、无欠费及校规为准。', enabled: true, sortOrder: 5 },
      { id: 'tvv-acr', name: 'TVV ACR I-CARD', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: false, note: '学校签证表说明：目前持有效SSP ACR时系统无法重复收费，故暂不计入；政策恢复时可能收取。', enabled: true, sortOrder: 6 },
      { id: 'manila-special-pickup', name: '马尼拉机场特别个人接机', currency: 'PHP', amount: 12000, billingRule: 'optional', includeInTotal: false, note: '车辆总价，可由同车乘客分摊；须另行确认。', enabled: true, sortOrder: 7 },
      { id: 'clark-special-pickup', name: '克拉克机场特别个人接机', currency: 'PHP', amount: 7000, billingRule: 'optional', includeInTotal: false, note: '车辆总价，可由同车乘客分摊；须另行确认。', enabled: true, sortOrder: 8 },
      { id: 'water-electricity', name: '水电费', currency: 'PHP', amount: 0, billingRule: 'optional', includeInTotal: false, note: '本次学校费用表与手册未列金额及计费方式，待学校确认，不计入预估合计。', enabled: true, sortOrder: 9 },
      { id: 'textbook-materials', name: '教材费', currency: 'PHP', amount: 0, billingRule: 'optional', includeInTotal: false, note: '手册说明使用MONOL自编教材，但未提供教材价格，待学校确认，不计入预估合计。', enabled: true, sortOrder: 10 },
      { id: 'academic-admin-fee', name: 'Academic Admin Fee', currency: 'PHP', amount: 0, billingRule: 'optional', includeInTotal: false, note: '费用表退款条款提及该费用，但未提供金额与收取条件，待学校确认。', enabled: true, sortOrder: 11 },
      { id: 'unfinished-penalty-study', name: '未完成补自习扣款', currency: 'PHP', amount: 25, billingRule: 'optional', includeInTotal: false, note: '离校前仍未完成的补自习，每25分钟从宿舍押金扣25比索；仅在实际发生时收取。', enabled: true, sortOrder: 12 },
      { id: 'weekend-trip-transport', name: '周末活动交通费', currency: 'PHP', amount: 350, secondaryAmount: 1200, secondaryLabel: '每次参考范围', billingRule: 'optional', includeInTotal: false, note: '学校手册参考为每次350–1,200比索，按实际参加的行程支付。', enabled: true, sortOrder: 13 },
    ],
    quoteSettings: {
      registrationFee: 100,
      futurePriceRegistrationStart: '', futurePriceArrivalStart: '', shortStayRatios: {}, peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
      promotions: [
        { id: 'sparta-course-2026', name: '2026课程优惠', description: '2026年12月31日或之前报名，且在斯巴达校区学习与住宿，每完整4周课程费减100美元', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', ruleKind: 'monol-sparta-course' },
        { id: 'sparta-room-2026', name: '2026住宿优惠', description: '2026年12月31日或之前报名，且在斯巴达校区学习与住宿，每完整4周住宿费减100美元', enabled: true, sortOrder: 1, priority: 11, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', ruleKind: 'monol-sparta-room' },
        { id: 'sparta-sns-2026', name: '2026 SNS活动', description: '2026年12月31日或之前报名并在MONOL斯巴达校区学习、住宿；每完整4周在小红书、TikTok、Facebook、Messenger、Instagram、Google Map、Threads等SNS发布1条在校故事，可减100美元；所有房型适用，活动会按报名人数随时结束且不另行通知', enabled: true, sortOrder: 2, priority: 20, stackable: false, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', ruleKind: 'monol-sparta-sns-manual' },
      ],
      localFeeIntro: '按每位学生的护照地区、住宿跨度和接机选择估算。宿舍押金、特别个人接机、暂缓收取的TVV ACR，以及资料未列金额的水电费、教材费和Academic Admin Fee另行展示，不计入学杂费合计。',
      courseTableTitle: 'MONOL斯巴达校区课程费 / 4周',
      courseTableNote: 'Booster ESL与Master IELTS均为950美元／4周；1–3周可联系顾问向学校单独询价，页面不套用未公布的短期比例。',
      groupClassNote: '每天至少10节学习安排；未参加选修团体课的时段须在固定座位强制自习。',
      roomTableTitle: 'MONOL斯巴达校区住宿费 / 4周（含餐）',
      roomTableNote: '住宿费包含平日三餐，以及周末和节假日一餐；房型以空房确认结果为准。',
      stayPolicyTitle: '入住与在校规则',
      stayPolicies: [
        { label: '入住日期', value: '周日入住', note: '报价按菲律宾学校周日入住规则计算。' },
        { label: '离校日期', value: '课程结束后的周六', note: '住宿按完整周日至周六计算。' },
        { label: '平日外出', value: '周一至周四17:00–19:00', note: '次日无课可外出至午夜；次日有课须在21:00前返校。' },
      ],
      extraNightRates: [],
    },
    quoteImageSettings: quoteImageSettings(),
    media: [],
  };
  config.quoteImageSettings.localFeeNotes = Object.fromEntries(config.localFees.map((fee: CiaLocalFeeRule) => [fee.id, fee.note]));
  config.quoteImageSettings.promotionNotes = Object.fromEntries(config.quoteSettings.promotions.map(rule => [rule.id, rule.description]));
  return config;
};

export const cloneMonolSpartaContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const clone = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  const defaults = createDefaultMonolSpartaContentConfig();
  const existingFeeIds = new Set((clone.localFees ?? []).map(fee => fee.id));
  clone.localFees = [
    ...(clone.localFees ?? []),
    ...defaults.localFees.filter(fee => !existingFeeIds.has(fee.id)).map(fee => ({ ...fee })),
  ];
  const snsPromotion = clone.quoteSettings.promotions.find(rule => rule.id === 'sparta-sns-2026');
  const defaultSnsPromotion = defaults.quoteSettings.promotions.find(rule => rule.id === 'sparta-sns-2026');
  if (snsPromotion && defaultSnsPromotion && !snsPromotion.description.includes('小红书')) {
    snsPromotion.description = defaultSnsPromotion.description;
  }
  if (clone.quoteSettings.courseTableNote === 'Booster ESL与Master IELTS均为950美元／4周；现有资料未提供短期或非4周比例。') {
    clone.quoteSettings.courseTableNote = defaults.quoteSettings.courseTableNote;
  }
  if (clone.quoteSettings.localFeeIntro === '按每位学生的护照地区、住宿跨度和接机选择估算。宿舍押金、特别个人接机及暂缓收取的TVV ACR不计入学杂费合计。') {
    clone.quoteSettings.localFeeIntro = defaults.quoteSettings.localFeeIntro;
  }
  const settings = clone.quoteImageSettings;
  clone.quoteImageSettings = {
    ...defaults.quoteImageSettings,
    ...(settings ?? {}),
    paymentNotes: { ...defaults.quoteImageSettings.paymentNotes, ...(settings?.paymentNotes ?? {}) },
    promotionNotes: { ...defaults.quoteImageSettings.promotionNotes, ...(settings?.promotionNotes ?? {}) },
    localFeeNotes: {
      ...defaults.quoteImageSettings.localFeeNotes,
      ...Object.fromEntries((clone.localFees ?? []).map(fee => [fee.id, fee.note])),
      ...(settings?.localFeeNotes ?? {}),
    },
  };
  if (clone.quoteImageSettings.paymentNotes.registration === '一次性注册费；现有资料没有注册费减免') {
    clone.quoteImageSettings.paymentNotes.registration = defaults.quoteImageSettings.paymentNotes.registration;
  }
  const promotionNotes = clone.quoteImageSettings.promotionNotes ?? {};
  if (!promotionNotes['sparta-sns-2026']?.includes('小红书') && snsPromotion) {
    promotionNotes['sparta-sns-2026'] = snsPromotion.description;
  }
  clone.quoteImageSettings.promotionNotes = promotionNotes;
  clone.quoteImageSettings.footerNotes = clone.quoteImageSettings.footerNotes.map(note => {
    if (note === '课程与住宿按周日入住、周六离校计算；当前资料只提供完整4周价格。') return defaults.quoteImageSettings.footerNotes[0];
    if (note === 'SNS活动是否开放、是否可与课程及住宿优惠叠加，须由学校书面确认。') return defaults.quoteImageSettings.footerNotes[1];
    return note;
  });
  return clone;
};
