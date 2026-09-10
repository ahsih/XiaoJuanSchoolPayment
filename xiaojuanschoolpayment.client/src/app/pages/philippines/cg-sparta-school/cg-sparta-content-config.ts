import { CiaContentConfig, CiaCourseContent, CiaLocalFeeRule } from '../cia-school/cia-content-config';

const course = (id: string, name: string, tuition: number, schedule: string, suitable: string, sortOrder: number): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note: suitable, enabled: true, sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});
const futureStart = '2027-01-03';

export const createDefaultCgSpartaContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'CG-SPARTA',
  courses: [
    course('sparta', '斯巴达课程（Sparta Course）', 800, '一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节', '适合想用高强度课表提升口语、听力、阅读和写作基础的学生。', 0),
    course('premier-sparta', '高阶斯巴达（Premier Sparta）', 850, '一对一5课时 + 小组3课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节', '适合想比标准斯巴达多一节一对一反馈的人。', 1),
    course('toeic-sparta', '托业斯巴达（TOEIC Sparta）', 850, '托业一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节', '适合想兼顾TOEIC分数和一般英语基础的学生。', 2),
    course('toeic-premier', '托业强化（TOEIC Premier）', 900, '一对一5课时 + 小组3课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节', '适合TOEIC目标更明确、希望增加一对一备考比例的人。', 3),
    course('ielts-basic', '雅思基础（IELTS Basic）', 850, '一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节', '适合未达到保证班门槛、想先熟悉IELTS题型的人。', 4),
    course('ielts-guarantee', '雅思保证班（IELTS Guarantee）', 1100, '一对一4课时 + 小组4课时 + 晚课雅思 + 雅思词汇 + 自习2节课', '适合达到入学门槛、需要保证班学习规则推动的学生。', 5),
    course('ielts-intensive', '雅思密集（IELTS Intensive）', 950, '一对一4课时 + 小组4课时 + 雅思晚课 + 雅思词汇 + 自习2节课', '适合有明确IELTS分数需求、想集中冲刺听说读写的人。', 6),
    course('business-english', '商务英语（Business English）', 850, '一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节', '适合需要会议、简报、面试和职场沟通英语的学生，4周起报。', 7),
  ],
  rooms: [
    { id: 'quad', name: '斯巴达 4人房', label: '斯巴达 4人房', code: 'D-4', location: '校内', group: '校内宿舍', fee: 650, note: '校内预算最低房型。', enabled: true, sortOrder: 0 },
    { id: 'triple', name: '斯巴达 3人房', label: '斯巴达 3人房', code: 'D-3', location: '校内', group: '校内宿舍', fee: 700, note: '比4人房更舒适，费用仍相对可控。', enabled: true, sortOrder: 1 },
    { id: 'twin', name: '斯巴达 2人房', label: '斯巴达 2人房', code: 'D-2', location: '校内', group: '校内宿舍', fee: 750, note: '隐私和预算较平衡。', enabled: true, sortOrder: 2 },
    { id: 'single', name: '斯巴达 1人房', label: '斯巴达 1人房', code: 'D-1', location: '校内', group: '校内宿舍', fee: 900, note: '最安静，但热门档期需尽早确认。', enabled: true, sortOrder: 3 },
    { id: 'external-single', name: '校外1人房', label: '校外1人房', code: 'M&J-1', location: '校外', group: 'M&J Pension', fee: 1200, note: '校外住宿参考，通勤、空房和校规需单独确认。', enabled: true, sortOrder: 4 },
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
    shortStayRatios: { '1': 0.4, '2': 0.6, '3': 0.85 },
    peakSeasonFeePerWeek: 40,
    peakSeasonRanges: [{ id: 'summer-2026', label: '2026暑期', start: '2026-07-05', end: '2026-08-30', enabled: true }],
    promotions: [
      { id: 'cg-sparta-sida-90', name: '思达折扣', description: '课程费和住宿费享9折', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'cg-sparta-off-season', name: '淡季优惠', description: '2026/08/30–2026/12/27入学，每满4周优惠150美元', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 150, coverageStart: '2026-08-30', coverageEnd: '2026-12-27', coverageTarget: 'course' },
      { id: 'cg-sparta-long-stay', name: '长期优惠', description: '12周优惠50美元；16周100美元；20周150美元；24周及以上最高200美元', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 50, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 12, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 50, coverageTarget: 'none' },
      { id: 'cg-sparta-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', enabled: true, sortOrder: 3, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: '证件、签证、教材、接机和按周押金已按学校最新明细更新；仅水费、综合管理费和基础电费于2027年1月4日起切换新标准。',
    courseTableTitle: 'CG斯巴达校区 2026课程费 / 4周',
    courseTableNote: '每行1/2/3周分别按4周价的40%/60%/85%预估；4周及以上按4周单价按周折算。',
    groupClassNote: '雅思保证班、雅思密集和商务英语的入学门槛与最短周期请按课程确认。',
    roomTableTitle: 'CG斯巴达校区 2026住宿费 / 4周',
    roomTableNote: '校内房型与校外M&J Pension分开计价，热门档期请先确认空房。',
    stayPolicyTitle: 'CG斯巴达校区入住与管理提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '课程结束后的周六', note: '延住、提前入住或额外住宿需单独确认费用。' },
      { label: '斯巴达管理', value: '平日外出受限', note: 'EOP、单词测试、作文与强制自习规则以学校当期通知为准。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '', promotion: '' },
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
    footerNotes: ['最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

export const cloneCgSpartaContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultCgSpartaContentConfig();
  const clone = structuredClone(value);
  const legacyFeeIntros = new Set([
    '学杂费均为预估金额，仅供准备比索现金参考，具体以学校及相关部门到校实收为准。',
    '学杂费均为预估金额，仅供准备比索现金参考；系统按入学日期自动切换2027年1月4日起生效的新标准。',
  ]);
  if (legacyFeeIntros.has(clone.quoteSettings.localFeeIntro)) clone.quoteSettings.localFeeIntro = defaults.quoteSettings.localFeeIntro;
  clone.localFees ??= structuredClone(defaults.localFees);
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
  clone.quoteSettings ??= structuredClone(defaults.quoteSettings);
  clone.quoteSettings.promotions ??= structuredClone(defaults.quoteSettings.promotions);
  clone.quoteSettings.peakSeasonRanges ??= structuredClone(defaults.quoteSettings.peakSeasonRanges);
  clone.quoteSettings.stayPolicies ??= structuredClone(defaults.quoteSettings.stayPolicies);
  clone.quoteImageSettings ??= structuredClone(defaults.quoteImageSettings);
  if (legacyFeeIntros.has(clone.quoteImageSettings.localFeeIntro)) clone.quoteImageSettings.localFeeIntro = defaults.quoteImageSettings.localFeeIntro;
  clone.quoteImageSettings.paymentNotes ??= structuredClone(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= structuredClone(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= structuredClone(defaults.quoteImageSettings.footerNotes);
  clone.media ??= [];
  return clone;
};
