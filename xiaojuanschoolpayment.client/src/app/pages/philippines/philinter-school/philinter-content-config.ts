import { CiaContentConfig, CiaCourseContent, CiaLocalFeeRule } from '../cia-school/cia-content-config';
import { PHILINTER_COURSES, PHILINTER_ROOMS } from './philinter-catalog';
import { PHILINTER_AGE_RULE, PHILINTER_FAMILY_RULE, PHILINTER_PROMOTION } from './philinter-quote';

const course = (item: typeof PHILINTER_COURSES[number], sortOrder: number): CiaCourseContent => ({
  id: item.id,
  name: item.name,
  tuition: item.tuition,
  tuition2027: item.tuition,
  schedule: item.suitable,
  suitable: item.suitable,
  note: item.suitable,
  enabled: true,
  sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value,
  currency: 'PHP',
  enabled: true,
});

export const createDefaultPhilinterContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'PHILINTER',
  courses: PHILINTER_COURSES.map(course),
  rooms: PHILINTER_ROOMS.map((room, sortOrder) => ({
    id: room.id,
    name: room.name,
    label: room.name,
    code: room.id,
    location: room.id.startsWith('azon-') ? '校外' : '校内',
    group: room.id.startsWith('azon-') ? 'Azon 校外公寓' : '校内宿舍',
    fee: room.fee,
    note: room.note,
    enabled: true,
    sortOrder,
  })),
  localFees: [
    fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，按报名学习时长办理；续费及换校需重新办理。', sortOrder: 0 }),
    fee({ id: 'ssp-i-card', name: 'SSP I-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学与SSP同时办理，只收一次。', sortOrder: 1 }),
    fee({ id: 'acr-i-card', name: 'ACR-I CARD 外国人身份证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '旅游签证首次续签时办理，只收一次。', sortOrder: 2 }),
    fee({ id: 'arp', name: 'ARP外国人登记', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '旅游签证首次续签或持长期签证时计入一次；须由顾问确认学校最新政策。', sortOrder: 3 }),
    fee({ id: 'management', name: '管理费', amount: 2200, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按住宿周数预估，不足4周暂按一期，须学校确认。', sortOrder: 4 }),
    fee({ id: 'electricity', name: '电费', amount: 2800, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按住宿周数预估；超出基础用电另计。', sortOrder: 5 }),
    fee({ id: 'water', name: '水费', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按住宿周数预估，不足4周暂按一期。', sortOrder: 6 }),
    fee({ id: 'visa-extension', name: '旅游签续签', amount: 6920, rates: [6920, 6920, 6920, 6920, 6920], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '按签证类型和完整停留时间预估；实际以学校及移民局收费为准。', sortOrder: 7 }),
    fee({ id: 'books', name: '书本教材费', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每个课程暂计一套；课程所需教材不同，以实际购买为准。', sortOrder: 8 }),
    fee({ id: 'student-id', name: '学生证', amount: 400, billingRule: 'once', includeInTotal: true, note: '一次性费用。', sortOrder: 9 }),
    fee({ id: 'pickup', name: '宿务马克坦机场团体接机', amount: 1200, secondaryAmount: 1500, secondaryLabel: '其他时间', billingRule: 'optional', includeInTotal: false, note: '周末06:00–24:00为1,200比索／人，其他时间1,500比索／人；学校团体接机可能需要等候同批学生。', sortOrder: 10 }),
    fee({ id: 'deposit', name: '宿舍押金', amount: 2000, secondaryAmount: 5000, secondaryLabel: '12–24周', billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '按停留周数分档计收，退房检查后可退。', sortOrder: 11 }),
  ],
  quoteSettings: {
    registrationFee: 120,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.45, '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: 40,
    peakSeasonRanges: [
      { id: 'summer-2026', label: '2026暑期', start: '2026-07-05', end: '2026-08-29', enabled: true },
      { id: 'summer-2027', label: '2027暑期预估', start: '2027-07-04', end: '2027-08-28', enabled: true },
    ],
    promotions: [
      { id: 'philinter-sida-90', name: '思达启航折扣', description: '课程费及住宿费9折；注册费、附加费不打折。', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'philinter-low-season', name: '淡季优惠', description: PHILINTER_PROMOTION, enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 300, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 8, minimumAccommodationWeeks: 8, eligibleRoomIds: ['in-campus-triple', 'azon-single', 'azon-twin'], coverageStart: '2026-08-16', coverageEnd: '2026-12-25', coverageTarget: 'course-and-accommodation' },
      { id: 'philinter-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: '学杂费为到校后由学校及相关部门收取的当地费用，与思达游学无关；以下为预估，以到校实收为准。',
    courseTableTitle: 'Philinter 2026年4周课程费',
    courseTableNote: '以下为4周课程费参考，币种为美元。短期比例、课程规则和最终价格以学校当期确认为准。',
    groupClassNote: '课程安排、考试保证班、年龄与监护条件须按所选课程确认。',
    roomTableTitle: 'Philinter 2026年4周住宿费',
    roomTableNote: '住宿按每人计价；校外公寓需确认空房、接送和门禁规则。',
    stayPolicyTitle: 'Philinter 入住与住宿提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按完整周日至周六计算。' },
      { label: '青少年学生', value: '与成年监护人同房', note: `${PHILINTER_AGE_RULE}${PHILINTER_FAMILY_RULE}` },
      { label: '暑期／寒假', value: '最低周数需确认', note: '暑期、寒假和校外公寓最低入住周数以学校当期通知为准。' },
    ],
    extraNightRates: [{ label: '额外住宿', amount: 3000 }],
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
    footerNotes: ['课程、住宿、暑期附加费和优惠按当前选择及有效规则计算。', '到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

export const clonePhilinterContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultPhilinterContentConfig();
  const clone = structuredClone(value);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= defaults.quoteSettings.peakSeasonRanges.map(item => ({ ...item }));
  clone.quoteSettings.promotions ??= defaults.quoteSettings.promotions.map(item => ({ ...item }));
  clone.quoteSettings.stayPolicies ??= defaults.quoteSettings.stayPolicies.map(item => ({ ...item }));
  clone.quoteSettings.extraNightRates ??= defaults.quoteSettings.extraNightRates.map(item => ({ ...item }));
  clone.quoteImageSettings ??= structuredClone(defaults.quoteImageSettings);
  clone.localFees ??= defaults.localFees.map(item => ({ ...item }));
  clone.media ??= [];
  return clone;
};
