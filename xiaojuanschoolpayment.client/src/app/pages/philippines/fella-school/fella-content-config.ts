import { CiaContentConfig, CiaLocalFeeRule, CiaQuoteImageSettings } from '../cia-school/cia-content-config';
import { FELLA_COURSE_FEES, FELLA_ROOM_FEES, FellaCampus } from './fella-pricing';

const fee = (id: string, name: string, amount: number, billingRule: CiaLocalFeeRule['billingRule'], note: string, sortOrder: number): CiaLocalFeeRule => ({
  id, name, amount, billingRule, note, sortOrder,
  currency: 'PHP', enabled: true, includeInTotal: true,
});

const imageSettings = (campus: FellaCampus): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '新生一次性收取100美元；老生返校免收注册费。',
    course: '课程、校区、日期与金额按当前选择自动计算。',
    accommodation: '房型、校区、日期与金额按当前选择自动计算；空房须确认。',
    promotion: '优惠金额和资格由报价计算器自动判断。',
  },
  promotionNotes: {
    'fella-july-registration': '符合报名日期、入学日期、课程及房型条件时自动扣减。',
    'fella-sida-95': '先扣报名优惠，再对剩余课程费和住宿费计算思达启航95折。',
    'fella-christmas': '课程覆盖指定圣诞周时每周减100美元，可与报名优惠和95折叠加。',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '学杂费按学生独立计算；不含可退房间押金、接机费及挂锁押金。',
  localFeeNotes: {},
  supplementalFeeNotes: {
    'payment:未成年学生单独到校服务费': '18岁以下由员工按实际情况勾选，按课程周数每周25美元计算。',
    'optional:房间押金（可退）': '按住宿周数收取；退房时扣除损坏及未结费用后按学校规定退还。',
    'optional:挂锁押金（可退）': '无损坏及丢失时，毕业离校按学校规定退还。',
    'optional:周日宿务机场接机': '周日接机按每人计算；也可自行前往学校。',
    'optional:其他时间宿务机场接机': '非周日或其他时间接机按每人计算，须确认航班安排。',
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
    `当前为English Fella${campus === 'campus1' ? '第一校区（斯巴达）' : '第二校区（自律型／半斯巴达）'}报价。`,
    '学校费用需按账单时限支付；人民币金额按付款时实际汇率结算。',
    '到校费用、签证及教材按实际发生和学校最新政策确认。',
  ],
});

export const createDefaultFellaContentConfig = (): CiaContentConfig => {
  const campus1Settings = imageSettings('campus1');
  const campus2Settings = imageSettings('campus2');
  return {
    schemaVersion: 1,
    schoolCode: 'FELLA',
    courses: FELLA_COURSE_FEES.map((item, sortOrder) => ({
      id: item.id, name: item.name, tuition: item.tuition, tuition2027: item.tuition,
      campus: item.campuses.length === 1 ? item.campuses[0] : 'both',
      courseType: item.familyCourse ? '亲子课程' : '英语课程',
      schedule: item.schedule, suitable: item.requirement, note: item.requirement,
      enabled: true, sortOrder,
    })),
    rooms: FELLA_ROOM_FEES.map((item, sortOrder) => ({
      id: item.id, name: item.name, label: item.name, code: item.id,
      location: '校内', group: item.campuses.length === 1 ? item.campuses[0] : '两校区',
      campus: item.campuses.length === 1 ? item.campuses[0] : 'both',
      fee: item.fee, note: item.note, enabled: true, sortOrder,
    })),
    localFees: [
      fee('ssp', 'SSP特殊学习许可证', 7800, 'once', '入学时支付，续费及换校需要重新办理。', 0),
      fee('ssp-e-card', 'SSP E-CARD', 4100, 'once', '入学时与SSP同时办理，只收一次。', 1),
      fee('acr-i-card', 'ACR I-CARD 外国人身份证', 4100, 'first-visa-extension', '第一次续签时办理；按签证类型及停留周数判断。', 2),
      fee('arp', 'ARP外国人登记', 300, 'first-visa-extension', '跟随第一次续签办理。', 3),
      fee('visa-extension', '首次签证续签', 6440, 'visa-extension-schedule', '按签证类型和完整停留跨度预估。', 4),
      fee('management', '管理费', 1000, 'per-accommodation-period', '首周1,000比索，以后每周500比索。', 5),
      fee('books', '教材费', 2500, 'per-course-period', '每开始8周暂估一套，教材不同以实际购买为准。', 6),
      fee('student-id', '学生证', 200, 'once', '一次性费用。', 7),
    ],
    quoteSettings: {
      registrationFee: 100,
      minorManagementFeePerPeriod: 25,
      futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
      shortStayRatios: {}, peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
      promotions: [
        { id: 'fella-july-registration', name: '7月报名优惠', description: '符合指定报名与入学条件时扣减。', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: true, discountType: 'fixed', discountValue: 100, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4, coverageTarget: 'none' },
        { id: 'fella-sida-95', name: '思达启航95折', description: '对符合条件的课程与住宿计算95折。', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
        { id: 'fella-christmas', name: '圣诞优惠', description: '课程覆盖指定圣诞周时每周优惠100美元。', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'course' },
      ],
      localFeeIntro: '学杂费由学校及菲律宾相关部门到校收取；按每名学生课程、住宿和签证选择独立估算。',
      courseTableTitle: 'English Fella课程与学费',
      courseTableNote: '课程按第一、第二校区开放范围显示。',
      groupClassNote: '课程安排、入学条件和保证班规则以学校最终确认为准。',
      roomTableTitle: 'English Fella住宿费',
      roomTableNote: '房型按校区及空房情况确认。',
      stayPolicyTitle: '入住与报价提醒',
      stayPolicies: [{ label: '入住日期', value: '周日入住', note: '退房和离校按周六计算。' }],
      extraNightRates: [],
    },
    quoteImageSettings: campus1Settings,
    campusQuoteImageSettings: { campus1: campus1Settings, campus2: campus2Settings },
    media: [],
  };
};

export const cloneFellaContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultFellaContentConfig();
  const clone = structuredClone(value);
  if (clone?.schemaVersion !== 1 || clone.schoolCode !== 'FELLA') return defaults;
  clone.quoteSettings = { ...defaults.quoteSettings, ...(clone.quoteSettings ?? {}) };
  clone.quoteSettings.promotions = clone.quoteSettings.promotions ?? structuredClone(defaults.quoteSettings.promotions);
  clone.courses ??= structuredClone(defaults.courses);
  clone.rooms ??= structuredClone(defaults.rooms);
  clone.localFees ??= structuredClone(defaults.localFees);
  clone.media ??= [];
  clone.campusQuoteImageSettings ??= {};
  for (const campus of ['campus1', 'campus2']) {
    const base = defaults.campusQuoteImageSettings![campus];
    const saved = clone.campusQuoteImageSettings[campus] ?? (campus === 'campus1' ? clone.quoteImageSettings : undefined);
    clone.campusQuoteImageSettings[campus] = {
      ...structuredClone(base), ...(saved ?? {}),
      paymentNotes: { ...base.paymentNotes, ...(saved?.paymentNotes ?? {}) },
      promotionNotes: { ...base.promotionNotes, ...(saved?.promotionNotes ?? {}) },
      localFeeNotes: { ...base.localFeeNotes, ...(saved?.localFeeNotes ?? {}) },
      supplementalFeeNotes: { ...base.supplementalFeeNotes, ...(saved?.supplementalFeeNotes ?? {}) },
    };
  }
  clone.quoteImageSettings = clone.campusQuoteImageSettings['campus1'];
  return clone;
};

export const fellaQuoteImageSettings = (content: CiaContentConfig, campus: FellaCampus): CiaQuoteImageSettings =>
  content.campusQuoteImageSettings?.[campus] ?? content.quoteImageSettings;
