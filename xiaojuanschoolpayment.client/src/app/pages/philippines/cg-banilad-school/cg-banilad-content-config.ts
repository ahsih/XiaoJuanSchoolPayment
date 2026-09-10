import { CiaContentConfig, CiaCourseContent, CiaLocalFeeRule } from '../cia-school/cia-content-config';

const course = (id: string, name: string, tuition: number, schedule: string, suitable: string, sortOrder: number): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note: suitable, enabled: true, sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});
const futureStart = '2027-01-03';

export const createDefaultCgBaniladContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'CG-BANILAD',
  courses: [
    course('light-esl', 'Light ESL', 650, '一对一4节 + 选修2节', '想保留自习、工作或陪读时间的成人学生。', 0),
    course('general-esl', 'General ESL', 700, '一对一4节 + 小组课2节 + 选修2节', '第一次菲律宾游学、想平衡口语和小班互动的学生。', 1),
    course('intensive-esl', 'Intensive ESL', 750, '一对一5节 + 小组课1节 + 选修2节', '想提高一对一比例、短期冲刺口语输出的学生。', 2),
    course('power-esl', 'Power ESL', 800, '一对一6节 + 选修2节', '想把每天主要时间都放在一对一纠错和输出的人。', 3),
    course('semi-sparta', 'Semi-Sparta', 800, '一对一4节 + 小组课4节 + 单词测试（强制）+ 选修1节（强制）+ 选修2节', '希望学习节奏更紧、但仍保留市区生活弹性的学生。', 4),
    course('premier-semi-sparta', 'Premier Semi-Sparta', 850, '一对一5节 + 小组课3节 + 单词测试（强制）+ 选修1节（强制）+ 选修2节', '想提高一对一比例，同时保留半斯巴达管理的人。', 5),
    course('ielts-basic', '雅思基础', 850, '一对一4节（雅思、ESL）+ 团体课4节（雅思、ESL）+ 单词测试（强制）+ 选修1节（强制）+ 选修2节', '准备进入雅思学习，但还需要基础英文支撑的学生。', 6),
    course('toeic', '托业基础', 850, '一对一4节（托业3节 + ESL1节）+ 团体课4节（托业2节 + ESL2节）+ 单词测试（强制）+ 选修1节（强制）+ 选修2节', '以托业分数、求职或升学要求为目标的学生。', 7),
    course('business', 'Business English', 850, '一对一4节 + 小组课4节 + 晚课或自习1节 + 词汇测试1节 + 自习2节', '需要会议、简报、邮件和职场沟通英文的成人学生。', 8),
    course('guardian', 'Family ESL（监护人）', 750, '一对一4节', '陪同孩子游学，同时想安排轻量英文学习的家长。', 9),
    course('junior', 'Family ESL（青少年）', 1150, '一对一4节 + 小组课2节', '小学、初中、高中学生配合监护人同行。', 10),
  ],
  rooms: [
    { id: 'quad', name: 'Banilad 4人房', label: 'Banilad 4人房', code: 'B-4', location: '校内', group: 'Banilad 校内宿舍', fee: 650, note: '校内预算最低房型。', enabled: true, sortOrder: 0 },
    { id: 'triple', name: 'Banilad 3人房', label: 'Banilad 3人房', code: 'B-3', location: '校内', group: 'Banilad 校内宿舍', fee: 700, note: '校内多人房，兼顾预算与舒适度。', enabled: true, sortOrder: 1 },
    { id: 'twin', name: 'Banilad 2人房', label: 'Banilad 2人房', code: 'B-2', location: '校内', group: 'Banilad 校内宿舍', fee: 750, note: '校内双人房，适合朋友同行。', enabled: true, sortOrder: 2 },
    { id: 'single', name: 'Banilad 1人房', label: 'Banilad 1人房', code: 'B-1', location: '校内', group: 'Banilad 校内宿舍', fee: 1000, note: '校内隐私最高，旺季建议提前确认。', enabled: true, sortOrder: 3 },
    { id: 'alicia-quad', name: 'Alicia校外4人房', label: 'Alicia校外4人房', code: 'A-4', location: '校外', group: 'Alicia 校外住宿', fee: 850, note: '距离校区步行约3分钟。', enabled: true, sortOrder: 4 },
    { id: 'alicia-triple', name: 'Alicia校外3人房', label: 'Alicia校外3人房', code: 'A-3', location: '校外', group: 'Alicia 校外住宿', fee: 900, note: '距离校区步行约3分钟。', enabled: true, sortOrder: 5 },
    { id: 'alicia-twin', name: 'Alicia校外2人房', label: 'Alicia校外2人房', code: 'A-2', location: '校外', group: 'Alicia 校外住宿', fee: 1000, note: '距离校区步行约3分钟。', enabled: true, sortOrder: 6 },
    { id: 'alicia-single', name: 'Alicia校外1人房', label: 'Alicia校外1人房', code: 'A-1', location: '校外', group: 'Alicia 校外住宿', fee: 1500, note: '校外单人房，距离校区步行约3分钟。', enabled: true, sortOrder: 7 },
    { id: '88th-quad', name: '88th Avenue 4人房', label: '88th Avenue 4人房', code: '88-4', location: '校外', group: '88th Avenue', fee: 1000, note: '邻近原Noble、靠近IT Park，生活便利，提供接送服务。', enabled: true, sortOrder: 8 },
    { id: '88th-triple', name: '88th Avenue 3人房', label: '88th Avenue 3人房', code: '88-3', location: '校外', group: '88th Avenue', fee: 1100, note: '邻近原Noble、靠近IT Park，生活便利，提供接送服务。', enabled: true, sortOrder: 9 },
    { id: '88th-twin', name: '88th Avenue 2人房', label: '88th Avenue 2人房', code: '88-2', location: '校外', group: '88th Avenue', fee: 1200, note: '邻近原Noble、靠近IT Park，生活便利，提供接送服务。', enabled: true, sortOrder: 10 },
    { id: '88th-single', name: '88th Avenue 1人房', label: '88th Avenue 1人房', code: '88-1', location: '校外', group: '88th Avenue', fee: 1700, note: '邻近原Noble、靠近IT Park，生活便利，提供接送服务。', enabled: true, sortOrder: 11 },
  ],
  localFees: [
    fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '校方最新明细列7,800比索；按报名学习时长办理，续费或换校需重新确认。', sortOrder: 0 }),
    fee({ id: 'ssp-i-card', name: 'ACR E-CARD（SSP）', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '校方最新明细列4,500比索，与SSP同时办理；换学校需携带证明，否则需要重新办理。', sortOrder: 1 }),
    fee({ id: 'acr-i-card', name: 'ACR I-CARD（旅游签证）', amount: 4500, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '旅游签证首次续签时计入一次；59天签证按9周起预估，30天签证按首次续签时预估。', sortOrder: 2 }),
    fee({ id: 'arp', name: '生物识别申请费', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '随首次旅游签证续签计入一次；长期签证是否收取须由顾问向学校确认。', sortOrder: 3 }),
    fee({ id: 'management', name: '维护管理费', amount: 2000, futureEffectiveStart: futureStart, futureName: '综合管理费', futureAmount: 750, futurePeriodWeeks: 1, futureRounding: 'proportional', billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周预估1份，具体以学校实收为准', futureNote: '2027年1月4日起入学新生按每周750比索计算。', sortOrder: 4 }),
    fee({ id: 'electricity', name: '电费', amount: 2000, futureEffectiveStart: futureStart, futureName: '基础电费（不含空调）', futureAmount: 500, futurePeriodWeeks: 1, futureRounding: 'proportional', billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '预估金额；空调或超额用电按学校计量另收，参考25比索/度', futureNote: '每周500比索；空调用电按实际使用另收25比索／千瓦时，并从押金中结算。', sortOrder: 5 }),
    fee({ id: 'water', name: '水费', amount: 500, futureEffectiveStart: futureStart, futureAmount: 300, futurePeriodWeeks: 1, futureRounding: 'proportional', billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周预估1份，具体以学校实收为准', futureNote: '2027年1月4日起入学新生按每周300比索计算。', sortOrder: 6 }),
    fee({ id: 'visa-extension', name: '旅游签证续签', amount: 6390, rates: [6390, 4460, 4460, 4460, 4460], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '59天签证：9–12周6,390比索，之后每增加30天按4,460比索预估；30天签证第5次续签按5,870比索。', sortOrder: 7 }),
    fee({ id: 'books', name: '教材费', amount: 250, secondaryAmount: 450, billingRule: 'once', includeInTotal: false, note: '每本250–450比索，按课程及实际购买数量结算；校方周数总额未计教材。', sortOrder: 8 }),
    fee({ id: 'pickup', name: '宿务马克坦机场接机（可选）', amount: 1200, billingRule: 'optional', includeInTotal: false, note: '校方最新明细列一次1,200比索接机；本站保留为可选参考，不计入默认合计。', sortOrder: 9 }),
    fee({ id: 'deposit', name: '住宿押金（可退）', amount: 250, periodWeeks: 1, rounding: 'proportional', billingRule: 'optional', includeInTotal: false, note: '每住宿周250比索；离校时扣除空调等实际费用后按校规退还，本站不计入学杂费合计。', sortOrder: 10 }),
  ],
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '3': 0.85 },
    peakSeasonFeePerWeek: 40,
    peakSeasonRanges: [{ id: 'summer-2026', label: '2026暑期', start: '2026-07-05', end: '2026-08-30', enabled: true }],
    promotions: [
      { id: 'cg-banilad-sida-90', name: '思达折扣', description: '课程费和住宿费享9折。', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'cg-banilad-off-season', name: '淡季优惠', description: '2026/08/30–2026/12/27入学，每满4周优惠150美元。', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 150, coverageStart: '2026-08-30', coverageEnd: '2026-12-27', coverageTarget: 'course' },
      { id: 'cg-banilad-long-stay', name: '长期优惠', description: '12/16/20/24周分别优惠50/100/150/200美元。', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 50, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 12, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 50, coverageTarget: 'none' },
      { id: 'cg-banilad-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', enabled: true, sortOrder: 3, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: '证件、签证、教材、接机和按周押金已按学校最新明细更新；仅水费、综合管理费和基础电费于2027年1月4日起切换新标准。',
    courseTableTitle: 'CG Banilad 2026课程与4周主费用',
    courseTableNote: '课程按4周美元价格列示；3周按4周课程费和住宿费的85%估算。',
    groupClassNote: '课程课节、考试规则和亲子课程要求须按所选课程确认。',
    roomTableTitle: 'CG Banilad 2026住宿费 / 4周',
    roomTableNote: '校内、Alicia和88th Avenue房型分别计价，热门档期请先确认空房。',
    stayPolicyTitle: 'CG Banilad 入住与住宿提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '课程结束后的周六', note: '延住及额外住宿需提前确认房型与费用。' },
      { label: '校外住宿', value: '规则分别确认', note: 'Alicia与88th Avenue的接送、门禁和服务以当期通知为准。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '按所选课程、周数及日期计算', accommodation: '按所选房型、周数及日期计算', promotion: '优惠按当前有效规则自动计算' },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: '证件、签证、教材、接机和按周押金已按学校最新明细更新；仅水费、综合管理费和基础电费于2027年1月4日起切换新标准。',
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
    footerNotes: ['课程、住宿、暑期附加费和优惠按当前选择及有效规则计算。', '到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

export const cloneCgBaniladContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultCgBaniladContentConfig();
  const clone = structuredClone(value);
  const legacyPageIntros = new Set([
    '学杂费为比索现金预估，具体以学校及相关部门到校实收为准。接机和可退押金另列，不计入合计。',
    '学杂费为比索现金预估，具体以学校及相关部门到校实收为准；系统按入学日期自动切换2027年1月4日起生效的新标准。',
  ]);
  if (legacyPageIntros.has(clone.quoteSettings.localFeeIntro)) {
    clone.quoteSettings.localFeeIntro = defaults.quoteSettings.localFeeIntro;
  }
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= defaults.quoteSettings.peakSeasonRanges.map(item => ({ ...item }));
  clone.quoteSettings.promotions ??= defaults.quoteSettings.promotions.map(item => ({ ...item }));
  clone.quoteSettings.stayPolicies ??= defaults.quoteSettings.stayPolicies.map(item => ({ ...item }));
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteImageSettings ??= structuredClone(defaults.quoteImageSettings);
  const legacyImageIntros = new Set([
    '学杂费由学校及相关部门到校收取；页面按当前选择预估，具体以学校现场实收为准。',
    '学杂费由学校及相关部门到校收取；系统按入学日期自动切换2027年1月4日起生效的新标准。',
  ]);
  if (legacyImageIntros.has(clone.quoteImageSettings.localFeeIntro)) {
    clone.quoteImageSettings.localFeeIntro = defaults.quoteImageSettings.localFeeIntro;
  }
  clone.localFees ??= defaults.localFees.map(item => ({ ...item }));
  clone.localFees = clone.localFees.map(item => {
    const fallback = defaults.localFees.find(candidate => candidate.id === item.id);
    if (!fallback) return item;
    if (!['management', 'electricity', 'water'].includes(item.id)) {
      return {
        ...item,
        name: fallback.name,
        amount: fallback.amount,
        secondaryAmount: fallback.secondaryAmount,
        billingRule: fallback.billingRule,
        periodWeeks: fallback.periodWeeks,
        rounding: fallback.rounding,
        rates: fallback.rates ? [...fallback.rates] : undefined,
        waiveForLongTermVisa: fallback.waiveForLongTermVisa,
        includeInTotal: fallback.includeInTotal,
        note: fallback.note,
        futureEffectiveStart: undefined,
        futureName: undefined,
        futureAmount: undefined,
        futureSecondaryAmount: undefined,
        futurePeriodWeeks: undefined,
        futureRounding: undefined,
        futureRates: undefined,
        futureNote: undefined,
      };
    }
    return {
      ...item,
      futureEffectiveStart: item.futureEffectiveStart ?? fallback.futureEffectiveStart,
      futureName: item.futureName ?? fallback.futureName,
      futureAmount: item.futureAmount ?? fallback.futureAmount,
      futureSecondaryAmount: item.futureSecondaryAmount ?? fallback.futureSecondaryAmount,
      futurePeriodWeeks: item.futurePeriodWeeks ?? fallback.futurePeriodWeeks,
      futureRounding: item.futureRounding ?? fallback.futureRounding,
      futureRates: item.futureRates ?? (fallback.futureRates ? [...fallback.futureRates] : undefined),
      futureNote: item.futureNote ?? fallback.futureNote,
    };
  });
  clone.media ??= [];
  return clone;
};
