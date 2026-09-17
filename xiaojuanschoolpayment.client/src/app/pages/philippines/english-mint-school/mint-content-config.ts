import { CiaContentConfig, CiaLocalFeeRule, CiaQuoteImageSettings } from '../cia-school/cia-content-config';
import { MINT_COURSES, MINT_LOCAL_FEES, MINT_REGISTRATION_FEE, MINT_ROOMS } from './mint-pricing';

const imageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '常规课程一次性100美元／人；全包项目按项目列明的人数计算。',
    course: '课程、日期、周数和金额按当前选择自动计算。',
    accommodation: '住宿、日期、周数和金额按当前选择自动计算；房型空位须确认。',
    promotion: '优惠金额与资格按当前报名日、入学日、周数和房型自动判断。',
  },
  promotionNotes: {
    'mint-low-season': '双人房、报名日和最迟入学日期均符合时，按学校档位自动扣减。',
    'mint-ssp-benefit': '5周起可在首次SSP减免与OW潜水课程之间二选一，须报名时确认。',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '学杂费直接引用学校4、8、12、16、20、24周对应表格；促销权益另列，不改写学校参考总额。',
  localFeeNotes: Object.fromEntries(MINT_LOCAL_FEES.map(row => [row.id, row.note])),
  supplementalFeeNotes: {
    'optional:教材费': '普通课程教材费未列入学校当地费表，按实际购买结算。',
    'optional:离校送机或码头送站': '薄荷岛机场500比索／人，塔比拉兰码头1,200比索／人。',
  },
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
  footerNotes: [
    '课程、住宿、全包项目和优惠仅按English MINT已公布资料计算。',
    '当地费用、签证、教材、房型和优惠资格最终以学校正式账单确认为准。',
  ],
});

export const createDefaultMintContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'MINT',
  courses: MINT_COURSES.map((item, sortOrder) => ({
    id: item.id, name: `${item.name}｜${item.chineseName}`, tuition: item.prices[4], tuition2027: item.prices[4],
    feeByWeeks: Object.fromEntries(Object.entries(item.prices).map(([weeks, amount]) => [weeks, amount])),
    allowedWeeks: Object.keys(item.prices).map(Number), schedule: item.schedule, suitable: item.suitable,
    note: item.suitable, enabled: true, sortOrder,
  })),
  rooms: MINT_ROOMS.map((item, sortOrder) => ({
    id: item.id, name: item.name, label: item.name, code: item.id, location: '校内', group: '校内住宿',
    fee: item.prices[4], feeByWeeks: Object.fromEntries(Object.entries(item.prices).map(([weeks, amount]) => [weeks, amount])),
    allowedWeeks: Object.keys(item.prices).map(Number), note: item.description, enabled: true, sortOrder,
  })),
  localFees: MINT_LOCAL_FEES.map((row, sortOrder): CiaLocalFeeRule => ({
    id: row.id, name: row.name, currency: 'PHP', amount: row.amounts[4], billingRule: 'once',
    includeInTotal: true, note: row.note, enabled: true, sortOrder,
  })),
  quoteSettings: {
    registrationFee: MINT_REGISTRATION_FEE,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '', shortStayRatios: {},
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: [
      { id: 'mint-low-season', name: '2026下半年淡季现金优惠', description: '双人房且报名、入学日期符合时按周数档位减免。', enabled: true, sortOrder: 0, priority: 10, stackable: false, newStudentsOnly: false, discountType: 'fixed', discountValue: 0, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, registrationStart: '2026-08-15', registrationEnd: '2026-11-30', arrivalEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', ruleKind: 'mint-low-season' },
      { id: 'mint-ssp-benefit', name: '5周起二选一权益', description: '首次SSP减免或OW潜水课程二选一。', enabled: true, sortOrder: 1, priority: 20, stackable: false, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 5, minimumAccommodationWeeks: 5, registrationStart: '2026-08-15', registrationEnd: '2026-11-30', arrivalEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', ruleKind: 'mint-ssp-or-ow' },
    ],
    localFeeIntro: '学校公布了4、8、12、16、20、24周的完整当地费用；教材费和超额用电另结。',
    courseTableTitle: 'English MINT课程费用', courseTableNote: '1/2/3/4/8/12/16/24周采用学校原价；20周按已确认的4周平均价计算。',
    groupClassNote: '实际分班、教师和团体人数按学校测评及当期安排。',
    roomTableTitle: 'English MINT住宿费用', roomTableNote: '住宿按人计价；实际房型、室友和空房须确认。',
    stayPolicyTitle: '入住与离校提醒', stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '报价按周日作为入学及入住日期。' },
      { label: '退房日期', value: '周六12:00前', note: '报价按周六作为结业及退房日期。' },
    ], extraNightRates: [{ label: '额外住宿一晚', amount: 1000 }],
  },
  quoteImageSettings: imageSettings(),
  media: [],
});

export const cloneMintContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultMintContentConfig();
  if (value?.schemaVersion !== 1 || value.schoolCode !== 'MINT') return defaults;
  const result = structuredClone(value);
  result.courses ??= structuredClone(defaults.courses);
  result.rooms ??= structuredClone(defaults.rooms);
  result.localFees ??= structuredClone(defaults.localFees);
  result.media ??= [];
  result.quoteSettings = { ...defaults.quoteSettings, ...(result.quoteSettings ?? {}) };
  result.quoteSettings.promotions ??= structuredClone(defaults.quoteSettings.promotions);
  result.quoteImageSettings = { ...structuredClone(defaults.quoteImageSettings), ...(result.quoteImageSettings ?? {}) };
  result.quoteImageSettings.paymentNotes = { ...defaults.quoteImageSettings.paymentNotes, ...(result.quoteImageSettings.paymentNotes ?? {}) };
  result.quoteImageSettings.promotionNotes = { ...defaults.quoteImageSettings.promotionNotes, ...(result.quoteImageSettings.promotionNotes ?? {}) };
  result.quoteImageSettings.localFeeNotes = { ...defaults.quoteImageSettings.localFeeNotes, ...(result.quoteImageSettings.localFeeNotes ?? {}) };
  result.quoteImageSettings.supplementalFeeNotes = { ...defaults.quoteImageSettings.supplementalFeeNotes, ...(result.quoteImageSettings.supplementalFeeNotes ?? {}) };
  return result;
};
