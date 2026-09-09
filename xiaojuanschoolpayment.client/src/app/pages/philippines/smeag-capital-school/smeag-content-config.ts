import { CiaContentConfig, CiaCourseContent, CiaLocalFeeRule } from '../cia-school/cia-content-config';

const course = (id: string, name: string, tuition: number, schedule: string, suitable: string, sortOrder: number): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note: suitable, enabled: true, sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});

const textbookNote = '每套约用4–6周，依学习进度购买；先计1套，后续按实另计。';

export const createDefaultSmeagContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'SMEAG',
  courses: [
    course('esl-regular-ket-pet-fce', 'ESL常规（KET/PET/FCE）', 840, '4节一对一 + 2节小组课 + 3小时选修 + 早晚斯巴达课', '适合综合英语基础提升与剑桥等级学习。', 0),
    course('esl-cae', 'ESL（CAE）', 1320, '4节一对一 + 2节小组课 + 3小时选修 + 早晚斯巴达课', '适合需要高阶剑桥英语训练的学生。', 1),
    course('speaking-master-ket-pet-fce', 'ESL / Speaking Master（KET/PET/FCE）', 1140, '4节一对一 + 2节四人小组 + 2节选修（演讲/口语/商务）+ 早晚斯巴达课', '适合集中加强口语输出、表达组织和反应速度。', 2),
    course('speaking-master-cae', 'ESL / Speaking Master（CAE）', 1620, '4节一对一 + 2节四人小组 + 2节特殊课（演讲/口语/商务）+ 早晚斯巴达课', '适合高阶英语使用者加强口语和专业表达。', 3),
    course('esl-junior-2', 'ESL Junior 2', 1140, '5节一对一 + 2节讨论团体课 + 电影团体课 + 团体作业辅导', '适合青少年强化一对一与讨论训练。', 4),
    course('toefl-ielts-pre', 'TOEFL / IELTS（预备班）', 1140, '4节一对一 + 2节四人小组 + 2节八人小组 + 早晚斯巴达课', '适合先建立托福或雅思基础的学生。', 5),
    course('toefl-ielts-regular-guarantee', 'TOEFL / IELTS（常规/12周保分）', 1260, '4节一对一 + 2节四人小组 + 2节八人小组 + 早晚斯巴达课', '保分班须满足入学、出勤和模考要求。', 6),
    course('toeic-pre', 'TOEIC（预备班）', 1080, '4节一对一 + 2节小组课 + 2节选修 + 早晚斯巴达课', '适合先建立托业考试基础。', 7),
    course('toeic-regular-guarantee', 'TOEIC（常规/保分）', 1140, '4节一对一 + 2节小组课 + 2节选修 + 早晚斯巴达课', '适合常规备考或满足条件的保分课程。', 8),
    course('business', 'Business', 1660, '8节一对一 + 选修课 + 早晚斯巴达课', '适合商务沟通、面试、会议与职场表达。', 9),
    course('esl-junior', 'ESL Junior', 840, '4节一对一 + 2节讨论团体课 + 电影团体课 + 团体作业辅导', '适合6至14岁学生，监护要求须另行确认。', 10),
    course('children', '儿童课程', 1540, '4节一对一 + 4节团体课 + 2.5小时活动课', '适合2至12岁儿童；年龄、陪同和住宿要求须确认。', 11),
    course('guardian', '监护人课程', 840, '4节一对一 + 2节小组课', '适合亲子同行的家长或监护人。', 12),
  ],
  rooms: [
    { id: 'campus-single', name: '校内单人间', label: '校内单人间', code: 'S-1', location: '校内', group: '校内住宿', fee: 1180, note: '数量有限，热门档期需尽早确认。', enabled: true, sortOrder: 0 },
    { id: 'campus-twin', name: '校内双人间', label: '校内双人间', code: 'D-2', location: '校内', group: '校内住宿', fee: 1020, note: '适合同伴同行或希望减少室友人数。', enabled: true, sortOrder: 1 },
    { id: 'campus-triple', name: '校内三人间', label: '校内三人间', code: 'D-3', location: '校内', group: '校内住宿', fee: 880, note: '预算与生活空间比较平衡。', enabled: true, sortOrder: 2 },
    { id: 'campus-quad', name: '校内四人间', label: '校内四人间', code: 'D-4', location: '校内', group: '校内住宿', fee: 780, note: '默认报价参考房型。', enabled: true, sortOrder: 3 },
    { id: 'campus-five', name: '校内五人间', label: '校内五人间', code: 'D-5', location: '校内', group: '校内住宿', fee: 720, note: '校内住宿中预算最低。', enabled: true, sortOrder: 4 },
    { id: 'hotel-single', name: '校外酒店单人间', label: '校外酒店单人间', code: 'H-1', location: '校外', group: '校外酒店', fee: 1420, note: '学校合作的校外酒店；校外住宿无折扣。', enabled: true, sortOrder: 5 },
    { id: 'hotel-twin', name: '校外酒店双人间', label: '校外酒店双人间', code: 'H-2', location: '校外', group: '校外酒店', fee: 1260, note: '学校合作的校外酒店；校外住宿无折扣。', enabled: true, sortOrder: 6 },
    { id: 'hotel-triple', name: '校外酒店三人间', label: '校外酒店三人间', code: 'H-3', location: '校外', group: '校外酒店', fee: 1120, note: '学校合作的校外酒店；校外住宿无折扣。', enabled: true, sortOrder: 7 },
    { id: 'hotel-quad', name: '校外酒店四人间', label: '校外酒店四人间', code: 'H-4', location: '校外', group: '校外酒店', fee: 1020, note: '学校合作的校外酒店；校外住宿无折扣。', enabled: true, sortOrder: 8 },
  ],
  localFees: [
    fee({ id: 'visa-extension', name: '旅游签证续签', amount: 5130, rates: [5130, 6400, 4430, 4430, 4430], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '按所选旅游签证及完整停留时间累计预估；以学校办理收费为准。', sortOrder: 0 }),
    fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '特殊学习许可；续期时可能需要重新缴纳SSP。', sortOrder: 1 }),
    fee({ id: 'ssp-i-card', name: 'SSP I-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP一并办理。', sortOrder: 2 }),
    fee({ id: 'visa-i-card', name: 'VISA I-CARD', amount: 4500, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '旅游签证首次续签时计入一次。', sortOrder: 3 }),
    fee({ id: 'arp', name: 'ARP外国人登记', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '首次续签或长期签证时计入一次，最终以学校最新政策为准。', sortOrder: 4 }),
    fee({ id: 'utilities', name: '设施使用费（Utilities）', amount: 3000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按每4周计算。', sortOrder: 5 }),
    fee({ id: 'water-electricity', name: '电费及水费', amount: 2400, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按每4周计算，超额使用另行收费。', sortOrder: 6 }),
    fee({ id: 'book-family', name: '教材费 · 亲子 Family Program', amount: 2500, billingRule: 'optional', includeInTotal: false, note: textbookNote, sortOrder: 7 }),
    fee({ id: 'book-toefl', name: '教材费 · 托福 TOEFL', amount: 1500, billingRule: 'optional', includeInTotal: false, note: textbookNote, sortOrder: 8 }),
    fee({ id: 'book-toeic', name: '教材费 · 托业 TOEIC', amount: 1300, billingRule: 'optional', includeInTotal: false, note: textbookNote, sortOrder: 9 }),
    fee({ id: 'book-business', name: '教材费 · 商务英语 Business English', amount: 400, billingRule: 'optional', includeInTotal: false, note: textbookNote, sortOrder: 10 }),
    fee({ id: 'book-esl', name: '教材费 · 综合英语 ESL', amount: 700, billingRule: 'optional', includeInTotal: false, note: textbookNote, sortOrder: 11 }),
    fee({ id: 'book-ielts', name: '教材费 · 雅思 IELTS', amount: 2500, billingRule: 'optional', includeInTotal: false, note: textbookNote, sortOrder: 12 }),
    fee({ id: 'book-speaking', name: '教材费 · 口语强化 Speaking Master', amount: 1500, billingRule: 'optional', includeInTotal: false, note: textbookNote, sortOrder: 13 }),
    fee({ id: 'pickup', name: '宿务马克坦机场团体接机（可选）', amount: 1200, billingRule: 'optional', includeInTotal: false, note: '学校团体接机，可能需在机场等候同批其他学生。', sortOrder: 14 }),
    fee({ id: 'deposit', name: '押金（可退）', amount: 2000, billingRule: 'optional', includeInTotal: false, note: '含房间押金、钥匙及电子钱包卡；无损坏及无欠费时可退。', sortOrder: 15 }),
  ],
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.45, '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: [
      { id: 'smeag-sida-90', name: '思达折扣', description: '课程费及校内住宿9折，校外酒店住宿不打折。', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'smeag-low-season', name: '淡季优惠', description: '2026/08/23–2027/01/01期间重叠学习周，每周优惠25美元。', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'per-course-week', discountValue: 25, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageStart: '2026-08-23', coverageEnd: '2027-01-01', coverageTarget: 'course' },
      { id: 'smeag-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: '以下费用以比索计价，由学校及相关部门收取；接机与可退押金另列。教材按所选课程类别各预估1套，同类不重复计入，每套约用4–6周，后续按实际购买另计。',
    courseTableTitle: 'SMEAG Capital 2026年课程费 / 4周',
    courseTableNote: '以下为2026参考价，币种为美元；短期比例、优惠和最终价格以学校确认结果为准。',
    groupClassNote: '课程安排、早晚斯巴达课和保证班条件须按所选课程确认。',
    roomTableTitle: '住宿费 / 4周',
    roomTableNote: '校外酒店住宿不参与思达折扣，热门档期请先确认空房。',
    stayPolicyTitle: 'SMEAG 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '按学校确认的周日抵达日期为准。' },
      { label: '退房日期', value: '课程结束后的周六', note: '延住需提前确认房型与费用。' },
      { label: '校外酒店', value: '不参与住宿折扣', note: '校外住宿价格、交通与空房须单独确认。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '按所选课程、周数及日期计算', accommodation: '按所选房型、周数及日期计算', promotion: '优惠按当前有效规则自动计算' },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: '学杂费由学校及相关部门到校收取；页面按当前选择预估，最终以学校现场实收为准。',
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

export const cloneSmeagContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultSmeagContentConfig();
  const clone = structuredClone(value);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.quoteSettings.promotions ??= defaults.quoteSettings.promotions.map(item => ({ ...item }));
  clone.quoteSettings.stayPolicies ??= defaults.quoteSettings.stayPolicies.map(item => ({ ...item }));
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteImageSettings ??= structuredClone(defaults.quoteImageSettings);
  clone.localFees ??= defaults.localFees.map(item => ({ ...item }));
  clone.media ??= [];
  return clone;
};
