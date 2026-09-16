import {
  CiaContentConfig,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteImageSettings,
} from '../cia-school/cia-content-config';
import {
  CELLA_CAMPUS_NAMES,
  CELLA_COURSES,
  CELLA_LOW_SEASON_END,
  CELLA_LOW_SEASON_START,
  CELLA_PEAK_SEASON_WEEKLY_FEE,
  CELLA_REGISTRATION_FEE,
  CELLA_ROOMS,
  CellaCampus,
} from './cella-pricing';

const fee = (id: string, name: string, amount: number, billingRule: CiaLocalFeeRule['billingRule'], note: string, sortOrder: number): CiaLocalFeeRule => ({
  id, name, amount, billingRule, note, sortOrder,
  currency: 'PHP', enabled: true, includeInTotal: true,
});

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder' | 'ruleKind'>): CiaPromotionRule => ({
  enabled: true, priority: value.sortOrder * 10, stackable: true, newStudentsOnly: false,
  discountType: 'fixed', discountValue: 0, appliesTo: 'school-total', waiveRegistration: false,
  minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none',
  ...value,
});

const quoteImageSettings = (campus: CellaCampus): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '每名普通课程学生一次性收取；家庭套餐整包价已包含注册费。',
    course: '课程名称、课量、日期及金额按当前选择自动计算。',
    accommodation: '房型、日期及金额按当前选择自动计算；空房以学校确认为准。',
    promotion: '优惠金额和资格由当前报价规则自动计算。',
  },
  promotionNotes: {
    'cella-social-6-plus-2': '课程与四人房按6周收费、实际就读8周；须完成活动要求，不与其他优惠叠加。',
    'cella-social-9-plus-3': '课程与四人房按9周收费、实际就读12周；须完成活动要求，不与其他优惠叠加。',
    'cella-low-season': '活动期内每个完整4周优惠100美元，课程与住宿不重复扣减。',
    'cella-premium-six-person': 'Premium六人房活动期内按499美元／4周计算，不再叠加淡季100美元优惠。',
    'cella-long-stay': '符合活动期长期报名档位时自动计算，可与当前允许的住宿优惠叠加。',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '当地费用按每名学生实际就读周数预估；家庭套餐已包含的项目不重复计费。',
  localFeeNotes: {},
  supplementalFeeNotes: {
    'payment:暑期附加费': '40美元／周，按实际课程周与旺季重叠周数计算。',
    'payment:未成年人管理费': '25美元／周／人，仅在当前学生选择并符合条件时计入。',
    'optional:洗衣服务（价格参考）': '按实际重量和学校现场标准结算，不计入学杂费合计。',
    'optional:宿务麦克坦机场周日接机（价格参考）': '可选，须确认航班与车辆安排，不计入学杂费合计。',
    'optional:房间押金（可退参考）': '按住宿周数及学校规则收取；退房检查后按规定退还。',
    'optional:房间押金（需确认）': '家庭套餐资料未单列押金，是否另收及退还规则须向学校确认。',
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
    `${CELLA_CAMPUS_NAMES[campus]}课程与住宿按周日开始、周六结束。`,
    '当地费用及签证费用为预估，最终以学校及移民局实际收取为准。',
    '最终以学校价格、空房、活动名额及优惠资格确认为准。',
  ],
});

export const createDefaultCellaContentConfig = (campus: CellaCampus): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: campus === 'uni' ? 'CELLA-UNI' : 'CELLA-PREMIUM',
  courses: CELLA_COURSES.filter(item => item.campus === campus).map((item, sortOrder) => ({
    id: item.id, name: item.name, tuition: item.tuition, tuition2027: item.tuition,
    courseType: item.familyPackage ? '家庭套餐' : '英语课程',
    schedule: item.lessons, suitable: item.note, note: item.note,
    feeByWeeks: item.familyPackage ? Object.fromEntries(Object.entries(item.familyPackage.prices)) : undefined,
    allowedWeeks: item.familyPackage ? [4, 6, 8] : undefined,
    enabled: true, sortOrder,
  })),
  rooms: CELLA_ROOMS.filter(item => item.campus === campus).map((item, sortOrder) => ({
    id: item.id, name: item.name, label: item.name, code: item.id,
    location: '校内', group: CELLA_CAMPUS_NAMES[campus], fee: item.fee,
    note: item.note, enabled: true, sortOrder,
  })),
  localFees: [
    fee('ssp', 'SSP特殊学习许可证', 7800, 'once', '移民局收取；按报名学习时长办理，续费及换校需要重新办理。', 0),
    fee('ssp-e-card', 'SSP电子卡', 4500, 'once', '入学时与SSP同时办理，只收一次。', 1),
    fee('acr-i-card', '外国人身份证', 4000, 'first-visa-extension', '首次续签时办理；实际办理要求需向学校确认。', 2),
    fee('management', '管理费', 4000, 'per-accommodation-period', '校内教学楼及其他设施的维护费用。', 3),
    fee('electricity', '电费', 2000, 'per-accommodation-period', '每周含15度电，超出部分另收25比索／度。', 4),
    fee('water', '水费', 1200, 'per-accommodation-period', '公共用水和房间用水；校外宿舍计费口径需确认。', 5),
    fee('visa-extension', '签证续签', 5140, 'visa-extension-schedule', '按签证类型和停留时间预估，最终以实际收取为准。', 6),
    fee('books', '教材费', 2000, 'per-course-period', '不同课程教材不同，以实际购买为准。', 7),
    fee('student-id', '学生证', 200, 'once', '一次性费用。', 8),
  ],
  quoteSettings: {
    registrationFee: CELLA_REGISTRATION_FEE,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: CELLA_PEAK_SEASON_WEEKLY_FEE,
    peakSeasonRanges: [],
    promotions: [
      promotion({ id: 'cella-social-6-plus-2', name: '6+2限时活动', description: '按6周课程和四人房收费，实际就读8周。', sortOrder: 0, ruleKind: 'cella-social-6-plus-2', stackable: false, newStudentsOnly: true }),
      promotion({ id: 'cella-social-9-plus-3', name: '9+3限时活动', description: '按9周课程和四人房收费，实际就读12周。', sortOrder: 1, ruleKind: 'cella-social-9-plus-3', stackable: false, newStudentsOnly: true }),
      promotion({ id: 'cella-low-season', name: '淡季优惠', description: '活动期内每个完整4周优惠100美元。', sortOrder: 2, ruleKind: 'cella-low-season', discountValue: 100, coverageStart: CELLA_LOW_SEASON_START, coverageEnd: CELLA_LOW_SEASON_END, coverageTarget: 'course-and-accommodation' }),
      promotion({ id: 'cella-premium-six-person', name: 'Premium六人间特价', description: '活动期内六人房按499美元／4周计价。', sortOrder: 3, ruleKind: 'cella-premium-six-person' }),
      promotion({ id: 'cella-long-stay', name: '长期报名优惠', description: '8／12／16周长期报名分别按学校档位优惠。', sortOrder: 4, ruleKind: 'cella-long-stay' }),
    ],
    localFeeIntro: '当地费用按每名学生实际就读周数预估；家庭套餐已包含的项目不重复计费。',
    courseTableTitle: `${CELLA_CAMPUS_NAMES[campus]}课程与学费`,
    courseTableNote: '课程价格、课量和家庭套餐内容以当前学校资料为准。',
    groupClassNote: '课程、家庭组合、年龄与入学条件须按所选方案确认。',
    roomTableTitle: `${CELLA_CAMPUS_NAMES[campus]}住宿费`,
    roomTableNote: '住宿按每人计价；家庭套餐按整包价计算。',
    stayPolicyTitle: '入住与报价提醒',
    stayPolicies: [{ label: '入住日期', value: '周日入住', note: '离校和退房按周六计算。' }],
    extraNightRates: [],
  },
  quoteImageSettings: quoteImageSettings(campus),
  media: [],
});

export const cloneCellaContentConfig = (value: CiaContentConfig, campus: CellaCampus): CiaContentConfig => {
  const defaults = createDefaultCellaContentConfig(campus);
  const clone = structuredClone(value);
  if (clone?.schemaVersion !== 1 || clone.schoolCode !== defaults.schoolCode) return defaults;
  clone.quoteSettings = { ...defaults.quoteSettings, ...(clone.quoteSettings ?? {}) };
  clone.quoteSettings.promotions = clone.quoteSettings.promotions ?? structuredClone(defaults.quoteSettings.promotions);
  clone.quoteImageSettings = { ...structuredClone(defaults.quoteImageSettings), ...(clone.quoteImageSettings ?? {}) };
  clone.quoteImageSettings.paymentNotes = { ...defaults.quoteImageSettings.paymentNotes, ...(clone.quoteImageSettings.paymentNotes ?? {}) };
  clone.quoteImageSettings.promotionNotes = { ...defaults.quoteImageSettings.promotionNotes, ...(clone.quoteImageSettings.promotionNotes ?? {}) };
  clone.quoteImageSettings.localFeeNotes = { ...defaults.quoteImageSettings.localFeeNotes, ...(clone.quoteImageSettings.localFeeNotes ?? {}) };
  clone.quoteImageSettings.supplementalFeeNotes = { ...defaults.quoteImageSettings.supplementalFeeNotes, ...(clone.quoteImageSettings.supplementalFeeNotes ?? {}) };
  clone.courses ??= structuredClone(defaults.courses);
  clone.rooms ??= structuredClone(defaults.rooms);
  clone.localFees ??= structuredClone(defaults.localFees);
  clone.media ??= [];
  return clone;
};
