import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaQuoteImageSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import { ICL_COURSES, ICL_ROOMS, IU_COURSES, IU_ROOMS, IuIclCampus } from './iu-icl-quote';

const courseRows = (campus: IuIclCampus): CiaCourseContent[] =>
  (campus === 'IU' ? IU_COURSES : ICL_COURSES).map((item, sortOrder) => ({
    ...item,
    tuition2027: item.tuition,
    suitable: item.category,
    enabled: true,
    sortOrder,
  }));

const roomRows = (campus: IuIclCampus): CiaRoomContent[] =>
  (campus === 'IU' ? IU_ROOMS : ICL_ROOMS).map((item, sortOrder) => ({
    ...item,
    label: item.name,
    code: item.id,
    location: item.id.startsWith('off-campus') ? '校外' : '校内',
    group: item.accommodation === false ? '走读' : item.id.startsWith('off-campus') ? '校外住宿' : '校内住宿',
    enabled: true,
    sortOrder,
  }));

const feeRows = (): CiaLocalFeeRule[] => [
  { id: 'ssp', name: 'SSP特别学习许可', currency: 'PHP', amount: 7800, billingRule: 'once', includeInTotal: true, note: '一次性办理。', enabled: true, sortOrder: 0 },
  { id: 'ssp-e-card', name: 'SSP E-Card', currency: 'PHP', amount: 4500, billingRule: 'once', includeInTotal: true, note: '一次性办理。', enabled: true, sortOrder: 1 },
  { id: 'airport-pickup', name: '机场接机', currency: 'PHP', amount: 800, billingRule: 'once', includeInTotal: true, note: '校方价目表的一次性接机参考。', enabled: true, sortOrder: 2 },
  { id: 'textbooks', name: '教材费预估', currency: 'PHP', amount: 2000, billingRule: 'once', includeInTotal: true, note: '按每本250–600比索估算；实际以领取教材为准。', enabled: true, sortOrder: 3 },
  { id: 'room-deposit', name: '宿舍押金', currency: 'PHP', amount: 3000, billingRule: 'once', includeInTotal: true, note: '退房无损坏且无欠费时按学校规则退还；本表计入到校需准备金额。', enabled: true, sortOrder: 4 },
  { id: 'maintenance', name: '维护费', currency: 'PHP', amount: 400, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional', includeInTotal: true, note: '按实际住宿周数计算。', enabled: true, sortOrder: 5 },
  { id: 'electricity', name: '电费', currency: 'PHP', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional', includeInTotal: true, note: '含每周25千瓦时；超出部分按25比索／千瓦时收取，已付电费不退。', enabled: true, sortOrder: 6 },
  { id: 'laundry', name: '洗衣费', currency: 'PHP', amount: 300, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional', includeInTotal: true, note: '每周2次。', enabled: true, sortOrder: 7 },
  { id: 'visa-extension-1', name: '第1次签证延长', currency: 'PHP', amount: 5500, billingRule: 'first-visa-extension', includeInTotal: true, note: '5–8周参考，延长29天。', enabled: true, sortOrder: 8 },
  { id: 'visa-extension-2', name: '第2次签证延长', currency: 'PHP', amount: 6500, billingRule: 'visa-extension-schedule', includeInTotal: true, note: '9–12周参考，延长1个月。', enabled: true, sortOrder: 9 },
  { id: 'acr-i-card', name: 'ACR I-Card', currency: 'PHP', amount: 4500, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '停留超过59天时随第2次签证延长办理。', enabled: true, sortOrder: 10 },
  { id: 'visa-extension-3-5', name: '第3–5次签证延长', currency: 'PHP', amount: 5500, billingRule: 'visa-extension-schedule', includeInTotal: true, note: '每次延长1个月；24周内最多按3次估算。', enabled: true, sortOrder: 11 },
  { id: 'extra-night', name: '额外住宿（每人）', currency: 'PHP', amount: 1300, billingRule: 'optional', includeInTotal: false, note: '仅在超出标准周日入住、周六13:00退房安排时另计；需先确认空房。', enabled: true, sortOrder: 12 },
];

const imageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '一次性、不可退；符合校方淡季组合条件时免收。',
    course: '',
    accommodation: '',
    promotion: '只采用校方公布的组合价，不叠加思达启航或其它中介优惠。',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '学杂费抵达菲律宾后直接向学校缴纳，本报价按当前方案预估，具体以学校实收为准；宿舍押金计入准备金额，额外住宿另列。',
  localFeeNotes: {},
  serviceSectionTitle: '为什么选择思达启航？',
  benefits: [
    { title: '0中介费', text: '不额外加收报名服务费' },
    { title: '校方价格', text: '常规价或符合条件的校方淡季组合价' },
    { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
    { title: '宿务驻点售后', text: '学习期间持续跟进' },
  ],
  serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
  alumniBenefitTitle: '',
  alumniBenefitText: '',
  noteSectionTitle: '报价说明',
  footerNotes: [
    '全部费用须在抵达前28天付清；取消与改期按校方政策执行。',
    '入学/入住按周日，结业/退房按周六。',
    '人民币金额按报价日参考汇率估算，最终以实际兑换或支付汇率为准。',
    '最终以学校书面确认的价格、空房及政策为准。',
  ],
});

export const createDefaultIuIclContentConfig = (campus: IuIclCampus): CiaContentConfig => {
  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: campus,
    courses: courseRows(campus),
    rooms: roomRows(campus),
    localFees: feeRows(),
    quoteSettings: {
      registrationFee: 100,
      iuIclPackagePrices: {
        power4: { single: 1500, double: 1250, triple: 1150, quad: 1050 },
        power6: { single: 1650, double: 1400, triple: 1300, quad: 1200 },
        power8: { single: 1800, double: 1550, triple: 1450, quad: 1350 },
        light: { single: 1500, double: 1250, triple: 1150, quad: 1050 },
        junior: { single: 1550, double: 1300, triple: 1200, quad: 1100 },
        ielts: { single: 1650, double: 1350, triple: 1250, quad: 1150 },
        toeic: { single: 1650, double: 1350, triple: 1250, quad: 1150 },
        guarantee8: { single: 3700, double: 3100, triple: 2900, quad: 2700 },
        guarantee12: { single: 5349, double: 4449, triple: 4149, quad: 3849 },
      },
      futurePriceRegistrationStart: '',
      futurePriceArrivalStart: '',
      shortStayRatios: { '1': 0.4, '2': 0.6, '3': 0.8 },
      peakSeasonFeePerWeek: 0,
      peakSeasonRanges: [],
      promotions: [{
        id: 'iu-icl-low-season',
        name: '校方淡季组合价',
        description: '同日期课程与校内住宿满4周时，按校方组合价表计算并免一次注册费。',
        enabled: true,
        sortOrder: 0,
        priority: 1,
        stackable: false,
        newStudentsOnly: false,
        discountType: 'none',
        discountValue: 0,
        appliesTo: 'school-total',
        waiveRegistration: true,
        minimumCourseWeeks: 4,
        minimumAccommodationWeeks: 4,
        coverageStart: '2026-08-23',
        coverageEnd: '2027-01-09',
        coverageTarget: 'course-and-accommodation',
        ruleKind: 'iu-icl-low-season',
      }],
      localFeeIntro: '学杂费为抵达菲律宾后直接向学校缴纳的当地费用，按当前课程、住宿和停留周数预估；具体项目和金额以学校实际收取为准。',
      courseTableTitle: `${campus} 2026课程与4周学费`,
      courseTableNote: '1–3周按校方短期比例计算；4周以上按比例延长，保证班按固定周数收费。',
      groupClassNote: '课程安排以学校最终课表为准。',
      roomTableTitle: `${campus} 2026住宿费`,
      roomTableNote: campus === 'IU' ? 'IU双人房、三人房自2026/09/13起开放淡季名额。' : 'ICL三人房、四人房自2026/10/04起开放淡季名额。',
      stayPolicyTitle: '入住与退房规则',
      stayPolicies: [
        { label: '入住', value: '周日', note: '课程与住宿开始日期同步。' },
        { label: '退房', value: '周六', note: '结束日期按周数自动计算。' },
      ],
      extraNightRates: [{ label: '额外住宿（每人／晚）', amount: 1300 }],
    },
    quoteImageSettings: imageSettings(),
  };
  config.quoteImageSettings.localFeeNotes = Object.fromEntries(config.localFees.map(fee => [fee.id, fee.note]));
  return config;
};

export const createDefaultIuContentConfig = (): CiaContentConfig => createDefaultIuIclContentConfig('IU');
export const createDefaultIclContentConfig = (): CiaContentConfig => createDefaultIuIclContentConfig('ICL');

export const cloneIuIclContentConfig = (value: CiaContentConfig, campus: IuIclCampus): CiaContentConfig => {
  const defaults = createDefaultIuIclContentConfig(campus);
  const clone = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  clone.schoolCode = campus;
  clone.courses = (clone.courses ?? defaults.courses).map((item, index) => ({ ...defaults.courses.find(row => row.id === item.id), ...item, sortOrder: item.sortOrder ?? index }));
  clone.rooms = (clone.rooms ?? defaults.rooms).map((item, index) => ({ ...defaults.rooms.find(row => row.id === item.id), ...item, sortOrder: item.sortOrder ?? index }));
  clone.localFees = (clone.localFees ?? defaults.localFees).map((item, index) => ({ ...defaults.localFees.find(row => row.id === item.id), ...item, sortOrder: item.sortOrder ?? index }));
  clone.quoteSettings = { ...defaults.quoteSettings, ...(clone.quoteSettings ?? {}), promotions: clone.quoteSettings?.promotions ?? defaults.quoteSettings.promotions };
  const savedImage = clone.quoteImageSettings;
  clone.quoteImageSettings = {
    ...defaults.quoteImageSettings,
    ...(savedImage ?? {}),
    paymentNotes: { ...defaults.quoteImageSettings.paymentNotes, ...(savedImage?.paymentNotes ?? {}) },
    localFeeNotes: {
      ...defaults.quoteImageSettings.localFeeNotes,
      ...Object.fromEntries(clone.localFees.map(fee => [fee.id, fee.note])),
      ...(savedImage?.localFeeNotes ?? {}),
    },
  };
  return clone;
};

export const cloneIuContentConfig = (value: CiaContentConfig): CiaContentConfig => cloneIuIclContentConfig(value, 'IU');
export const cloneIclContentConfig = (value: CiaContentConfig): CiaContentConfig => cloneIuIclContentConfig(value, 'ICL');
