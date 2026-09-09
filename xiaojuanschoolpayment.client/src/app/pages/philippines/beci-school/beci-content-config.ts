import { CiaContentConfig } from '../cia-school/cia-content-config';
import { BECI_CAMPUS_PRICING, BeciCampus, BeciCampusPricing } from '../beci-quote/beci-pricing';

const campusOrder: BeciCampus[] = ['eop', 'sparta', 'city'];

export const createDefaultBeciContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'BECI',
  courses: campusOrder.flatMap((campus, campusIndex) =>
    BECI_CAMPUS_PRICING[campus].courses.map((item, index) => ({
      id: item.id,
      name: item.name,
      tuition: item.price,
      tuition2027: item.price,
      campus,
      minimumWeeks: item.minimumWeeks,
      courseType: campus === 'eop' ? 'EOP课程' : campus === 'sparta' ? '斯巴达课程' : 'City课程',
      schedule: item.schedule,
      suitable: item.note ?? BECI_CAMPUS_PRICING[campus].campusNote,
      note: item.note ?? '',
      enabled: true,
      sortOrder: campusIndex * 100 + index,
    })),
  ),
  rooms: campusOrder.flatMap((campus, campusIndex) =>
    BECI_CAMPUS_PRICING[campus].rooms.map((item, index) => ({
      id: item.id,
      name: item.name,
      label: item.name,
      code: campus === 'eop' ? 'EOP' : campus === 'sparta' ? 'SPARTA' : 'CITY',
      location: campus === 'eop' && item.id === 'eop-master-single' ? '校外' as const : '校内' as const,
      group: BECI_CAMPUS_PRICING[campus].shortName,
      campus,
      fee: item.price,
      single: item.single,
      coupleRate: item.coupleRate,
      note: item.note,
      enabled: true,
      sortOrder: campusIndex * 100 + index,
    })),
  ),
  localFees: [
    { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', includeInTotal: true, note: '移民局收取；按报名学习时长办理，续费及换校需要重新确认。', enabled: true, sortOrder: 0 },
    { id: 'ssp-e-card', name: 'SSP E-CARD', currency: 'PHP', amount: 4500, billingRule: 'once', includeInTotal: true, note: '入学时与SSP同时办理，只收一次。', enabled: true, sortOrder: 1 },
    { id: 'acr-i-card', name: 'ACR-I CARD外国人身份证', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: true, note: '第一次需要签证续签时预估办理，最终以移民局实收为准。', enabled: true, sortOrder: 2 },
    { id: 'maintenance', name: '维护管理费', currency: 'PHP', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '校内教学楼及其他设施维护费，按每开始4周预估。', enabled: true, sortOrder: 3 },
    { id: 'utilities', name: '水电费', currency: 'PHP', amount: 3000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按每开始4周预估；超过学校额度后按实际用量另收。', enabled: true, sortOrder: 4 },
    { id: 'manila-pickup', name: '马尼拉机场接机', currency: 'PHP', amount: 3000, billingRule: 'selected-manila-pickup', includeInTotal: true, note: '选择指定周日团体接机时计入，最终航班和安排需确认。', enabled: true, sortOrder: 5 },
    { id: 'clark-pickup', name: '克拉克机场接机', currency: 'PHP', amount: 3000, billingRule: 'selected-clark-pickup', includeInTotal: true, note: '选择指定周日团体接机时计入，最终航班和安排需确认。', enabled: true, sortOrder: 6 },
    { id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 4940, billingRule: 'visa-extension-schedule', rates: [4940, 4940, 4940, 4940, 4940], includeInTotal: true, note: '按所选旅游签证与完整停留跨度预估，最终以移民局实际情况和实收金额为准。', enabled: true, sortOrder: 7 },
    { id: 'books', name: '教材费', currency: 'PHP', amount: 2000, billingRule: 'per-course-period', periodWeeks: 8, rounding: 'ceil', includeInTotal: true, note: '暂按每开始8个课程周一套预估，实际按课程和学校发放为准。', enabled: true, sortOrder: 8 },
    { id: 'student-card', name: '学生证', currency: 'PHP', amount: 200, billingRule: 'once', includeInTotal: true, note: '一次性费用，含照片。', enabled: true, sortOrder: 9 },
    { id: 'laundry', name: '洗衣服务', currency: 'PHP', amount: 1500, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按每开始4周预估；含洗涤、烘干和折叠。', enabled: true, sortOrder: 10 },
    { id: 'room-deposit', name: '房间押金（可退）', currency: 'PHP', amount: 3000, billingRule: 'optional', includeInTotal: false, note: '每人3,000比索；无损坏、无欠费并按学校规则完成退房后可退。', enabled: true, sortOrder: 11 },
  ],
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.6, '3': 0.8 },
    peakSeasonFeePerWeek: 40,
    peakSeasonRanges: [
      { id: 'beci-summer-2026', label: '2026暑期', start: '2026-06-28', end: '2026-08-22', enabled: true },
      { id: 'beci-summer-2027', label: '2027暑期（星期对齐估算）', start: '2027-06-27', end: '2027-08-21', enabled: true },
    ],
    promotions: [
      { id: 'beci-registration-waiver', name: '思达免注册费', description: '所有通过思达报名的学生免100美元注册费。', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'beci-off-season-1', name: '2026上半年淡季九折', description: '2026/02/08–06/14入学，整段课程费与住宿费减10%。', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, arrivalStart: '2026-02-08', arrivalEnd: '2026-06-14', coverageTarget: 'none' },
      { id: 'beci-off-season-2', name: '2026下半年淡季九折', description: '2026/09/06–12/27入学，整段课程费与住宿费减10%。', enabled: true, sortOrder: 2, priority: 21, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, arrivalStart: '2026-09-06', arrivalEnd: '2026-12-27', coverageTarget: 'none' },
      { id: 'beci-long-stay', name: '长期学习优惠', description: '8/12/16/20/24周分别减50/100/200/300/400美元；可与淡季优惠叠加。', enabled: true, sortOrder: 3, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 50, discountTiers: { '8': 50, '12': 100, '16': 200, '20': 300, '24': 400 }, ruleKind: 'beci-long-stay', appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 8, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: '学杂费按每名学生的课程、住宿、签证和接机选择分别计算后汇总；接机勾选后计入，房间押金不计入。',
    courseTableTitle: 'BECI 2026年课程费 / 4周',
    courseTableNote: '请先选择EOP、Sparta或City校区；三个校区课程不可混选，保证班最低周数需按规则确认。',
    groupClassNote: '1/2/3周按4周价的40%/60%/80%计算，4周以上按周数比例计算。',
    roomTableTitle: 'BECI 2026年住宿费 / 4周',
    roomTableNote: '房型按校区分别管理；EOP 40岁及以上学生仅可选择单人间，City夫妻双人房优惠需两人同行并选相同日期。',
    stayPolicyTitle: 'BECI入住与校区规则',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程和住宿均按完整周计算。' },
      { label: '退房日期', value: '周六退房', note: '延住需先确认空房和额外费用。' },
      { label: '三校区', value: 'EOP / Sparta / City', note: '课程、住宿和校区规则分别显示，不可跨校区混选。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '每名学生一次；思达学生免收', course: '', accommodation: '', promotion: '符合条件时由系统自动计算' },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: '以下费用以比索计价；接机按选择计入，房间押金另列且不计入学杂费合计。',
    localFeeNotes: {},
    serviceSectionTitle: '为什么选择思达启航？',
    benefits: [
      { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
      { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
      { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
      { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
    ],
    serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
    alumniBenefitTitle: '思达学员优惠',
    alumniBenefitText: '通过思达报名免一次性注册费；其他优惠按入学日期和课程周数自动核对。',
    noteSectionTitle: '报价说明',
    footerNotes: [
      '课程与住宿按完整周计算，周日入住、周六退房。',
      '三校区的课程、住宿和管理规则不同，最终以所选校区确认结果为准。',
      '人民币金额按生成当日参考汇率估算，最终以实际兑换或支付汇率为准。',
      '最终以学校价格、空房、优惠资格及顾问确认结果为准。',
    ],
  },
  media: [],
});

export const cloneBeciContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const cloned = structuredClone(value);
  if (!cloned.quoteImageSettings.localFeeNotes) cloned.quoteImageSettings.localFeeNotes = {};
  if (!cloned.media) cloned.media = [];
  return cloned;
};

export const beciCampusPricingFromContent = (content: CiaContentConfig, campus: BeciCampus): BeciCampusPricing => {
  const fallback = BECI_CAMPUS_PRICING[campus];
  const courses = content.courses
    .filter(item => item.enabled && (item.campus ?? campus) === campus)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(item => ({ id: item.id, name: item.name, price: item.tuition, schedule: item.schedule, note: item.note || item.suitable, minimumWeeks: item.minimumWeeks }));
  const rooms = content.rooms
    .filter(item => item.enabled && (item.campus ?? campus) === campus)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(item => ({ id: item.id, name: item.label || item.name, price: item.fee, note: item.note, single: item.single ?? item.name.includes('单人'), coupleRate: item.coupleRate }));
  return {
    ...fallback,
    courses: courses.length ? courses : fallback.courses,
    rooms: rooms.length ? rooms : fallback.rooms,
    defaultCourseId: courses.some(item => item.id === fallback.defaultCourseId) ? fallback.defaultCourseId : courses[0]?.id ?? fallback.defaultCourseId,
    defaultRoomId: rooms.some(item => item.id === fallback.defaultRoomId) ? fallback.defaultRoomId : rooms[0]?.id ?? fallback.defaultRoomId,
  };
};
