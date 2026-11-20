import { CiaContentConfig } from '../cia-school/cia-content-config';
import { IBREEZE_COURSES, IBREEZE_OFF_CAMPUS_INFO, IBREEZE_ROOMS } from './ibreeze-catalog';
import { IBREEZE_POLICY_VERSION, IBREEZE_PRICE_REGISTRATION_START, IBREEZE_ROOMS_2027, IBREEZE_TUITION_2027 } from './ibreeze-pricing-2027';

export const createDefaultIbreezeContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'IBREEZE',
  courses: IBREEZE_COURSES.map((item, index) => ({
    id: item.id,
    name: item.name,
    tuition: item.tuition,
    tuition2027: IBREEZE_TUITION_2027[item.id]['4'],
    feeByWeeks2027: { ...IBREEZE_TUITION_2027[item.id] },
    schedule: item.lessons,
    suitable: item.suitable,
    note: item.suitable,
    enabled: true,
    sortOrder: index,
  })),
  rooms: IBREEZE_ROOMS.map((item, index) => ({
    id: item.id,
    name: item.name,
    label: item.name,
    code: item.id.startsWith('off-campus-') ? '校外公寓' : item.id.startsWith('quad-') ? '四人间' : item.id.startsWith('triple-') ? '三人间' : item.id.startsWith('twin-') ? '双人间' : '单人间',
    location: item.id.startsWith('off-campus-') ? '校外' : '校内',
    group: item.id.startsWith('off-campus-') ? '校外公寓' : item.id.includes('ib2') ? 'IB2宿舍' : 'IB1宿舍',
    fee: item.fee,
    fee2027: IBREEZE_ROOMS_2027[item.id]['4'],
    feeByWeeks2027: { ...IBREEZE_ROOMS_2027[item.id] },
    note: item.note,
    enabled: true,
    sortOrder: index,
  })),
  localFees: [
    { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取；按报名学习时长办理，续费及换校需重新办理。', enabled: true, sortOrder: 0 },
    { id: 'ssp-e-card', name: 'SSP E-CARD', currency: 'PHP', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP同时办理，只收一次。', enabled: true, sortOrder: 1 },
    { id: 'acr-i-card', name: 'ACR-I CARD 外国人身份证', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '首次续签时计入一次，实际以学校办理要求为准。', enabled: true, sortOrder: 2 },
    { id: 'arp', name: 'ARP外国人登记', currency: 'PHP', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '旅游签证首次续签或长期签证时计入一次，须由顾问确认学校最新政策。', enabled: true, sortOrder: 3 },
    { id: 'management', name: '维护管理费', currency: 'PHP', amount: 4000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '校内教学楼及其他设施维护费，按住宿周期计算。', enabled: true, sortOrder: 4 },
    { id: 'electricity', name: '校内电费', currency: 'PHP', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '仅校内住宿计收；每周含20度电，超额另收23比索／度。', enabled: true, sortOrder: 5 },
    { id: 'water', name: '水费', currency: 'PHP', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '仅校内住宿计收。', enabled: true, sortOrder: 6 },
    { id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 5140, rates: [5140, 6410, 4440, 5040, 4440], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '按所选旅游签证及实际停留天数累计；长期签证暂按免收预估并由顾问确认。', enabled: true, sortOrder: 7 },
    { id: 'books', name: '教材费', currency: 'PHP', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周约2,000–3,000比索，先按2,000比索预估；依课程及学习进度实际购买。', enabled: true, sortOrder: 8 },
    { id: 'student-card', name: '学生证', currency: 'PHP', amount: 400, billingRule: 'once', includeInTotal: true, note: '一次性费用。', enabled: true, sortOrder: 9 },
  ],
  quoteSettings: {
    registrationFee: 150,
    minorManagementFeePerPeriod: 100,
    airportPickupSundayUsd: 30,
    airportPickupSaturdayUsd: 50,
    roomDepositUnder8Weeks: 3000,
    roomDeposit8WeeksOrMore: 5000,
    courseChangeFeePerPeriod: 100,
    ibreezePolicyVersion: IBREEZE_POLICY_VERSION,
    futurePriceRegistrationStart: IBREEZE_PRICE_REGISTRATION_START,
    futurePriceArrivalStart: '',
    shortStayRatios: {},
    peakSeasonFeePerWeek: 40,
    peakSeasonRanges: [
      { id: 'summer-2026', label: '2026暑期', start: '2026-06-28', end: '2026-08-15', enabled: true },
      { id: 'summer-2027', label: '2027暑期', start: '2027-06-27', end: '2027-08-14', enabled: true },
    ],
    promotions: [
      { id: 'sida-discount', name: '思达启航折扣', description: '官方课程费和住宿费合计优惠5%；注册费、当地费用及其他费用不参与。', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'september-twin', name: '9月双人间住宿优惠', description: '2026年9月1日–30日报名、12月27日前抵达；IB1/IB2双人间每完整4周减120美元。', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 120, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 120, eligibleRoomIds: ['twin-main', 'twin-ib2'], registrationStart: '2026-09-01', registrationEnd: '2026-09-30', arrivalEnd: '2026-12-26', coverageTarget: 'none' },
      { id: 'september-multi', name: '9月三/四人间住宿优惠', description: '2026年9月1日–30日报名、12月27日前抵达；IB1三人间及IB1/IB2四人间每完整4周减200美元。', enabled: true, sortOrder: 2, priority: 21, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 200, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 200, eligibleRoomIds: ['triple-main', 'quad-main', 'quad-ib2'], registrationStart: '2026-09-01', registrationEnd: '2026-09-30', arrivalEnd: '2026-12-26', coverageTarget: 'none' },
      { id: 'christmas-2026', name: '圣诞特别优惠', description: '2026/12/27–2027/01/02期间在读，每位学生减100美元；课程须连续覆盖，只有住宿覆盖或课程间断不适用。', enabled: true, sortOrder: 3, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageStart: '2026-12-27', coverageEnd: '2027-01-02', coverageTarget: 'course' },
      { id: 'returning-registration', name: '老学员免注册费', description: '老学员返校免一次性注册费。', enabled: true, sortOrder: 4, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'november-twin', name: '11月双人间住宿优惠', description: '2026/11/01–12/31报名，最晚2027/05/02入学；IB1/IB2双人间优惠100美元／4周，2027/01/03–01/23住宿不计优惠。', enabled: true, sortOrder: 5, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 100, eligibleRoomIds: ['twin-main', 'twin-ib2'], registrationStart: '2026-11-01', registrationEnd: '2026-12-31', arrivalEnd: '2027-05-02', coverageTarget: 'none' },
      { id: 'november-multi', name: '11月三/四人间住宿优惠', description: '2026/11/01–12/31报名，最晚2027/05/02入学；IB1三人间及IB1/IB2四人间优惠200美元／4周，2027/01/03–01/23住宿不计优惠。', enabled: true, sortOrder: 6, priority: 21, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 200, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 200, eligibleRoomIds: ['triple-main', 'quad-main', 'quad-ib2'], registrationStart: '2026-11-01', registrationEnd: '2026-12-31', arrivalEnd: '2027-05-02', coverageTarget: 'none' },
    ],
    localFeeIntro: '以下费用以比索计价，由学校及相关部门收取，最终以到校实收为准。校外住宿已含水电；接机与可退押金另列。',
    courseTableTitle: 'I.BREEZE 2026 / 2027年课程费',
    courseTableNote: '以下为4周课程费，币种为美元。2027/01/01起报名使用2027价，此前报名使用2026价；注册费和住宿费另计。',
    groupClassNote: '提前安排多种课程不收换课费；到校后更换课程另收100美元／4周。',
    roomTableTitle: 'I.BREEZE 2026 / 2027年住宿费',
    roomTableNote: `以下为4周住宿费。${IBREEZE_OFF_CAMPUS_INFO}`,
    stayPolicyTitle: 'I.BREEZE入住与住宿提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '课程结束后的周六', note: '前后泊或延住需由学校确认空房和费用。' },
      { label: '校外公寓', value: '步行约6分钟', note: '包含水电、有线电视、Wi-Fi及厨房，周一至周五提供定时接送。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '', promotion: '' },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: '以下费用以比索计价，由学校及相关部门收取，最终以到校实收为准。校外住宿已含水电；接机与可退押金另列。',
    localFeeNotes: {},
    serviceSectionTitle: '为什么选择思达启航？',
    benefits: [
      { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
      { title: '费用透明', text: '学费、住宿与当地费用逐项列明' },
      { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
      { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
    ],
    serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
    alumniBenefitTitle: '老学员专属优惠',
    alumniBenefitText: '返校资格与学校注册费安排由顾问核实；学习规划和在校跟进持续提供。',
    noteSectionTitle: '报价说明',
    footerNotes: [
      '课程和住宿按完整周计算，周日入住、周六退房。',
      '人民币金额按生成当日参考汇率估算，最终以实际兑换或支付汇率为准。',
      '最终以学校价格、空房、优惠资格及顾问确认结果为准。',
    ],
  },
  media: [],
});

export const cloneIbreezeContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const cloned = structuredClone(value);
  if (!cloned.quoteImageSettings.localFeeNotes) cloned.quoteImageSettings.localFeeNotes = {};
  if (!cloned.media) cloned.media = [];
  const defaults = createDefaultIbreezeContentConfig();
  if ((cloned.quoteSettings.ibreezePolicyVersion ?? 0) < IBREEZE_POLICY_VERSION) {
    for (const course of cloned.courses) {
      if (!IBREEZE_TUITION_2027[course.id]) continue;
      course.tuition2027 = IBREEZE_TUITION_2027[course.id]['4'];
      course.feeByWeeks2027 = { ...IBREEZE_TUITION_2027[course.id] };
    }
    for (const room of cloned.rooms) {
      if (!IBREEZE_ROOMS_2027[room.id]) continue;
      room.fee2027 = IBREEZE_ROOMS_2027[room.id]['4'];
      room.feeByWeeks2027 = { ...IBREEZE_ROOMS_2027[room.id] };
    }
    for (const rule of defaults.quoteSettings.promotions.filter(item => item.id.startsWith('november-'))) {
      const index = cloned.quoteSettings.promotions.findIndex(item => item.id === rule.id);
      if (index >= 0) cloned.quoteSettings.promotions[index] = structuredClone(rule);
      else cloned.quoteSettings.promotions.push(structuredClone(rule));
    }
    const summer = defaults.quoteSettings.peakSeasonRanges.find(item => item.id === 'summer-2027')!;
    cloned.quoteSettings.peakSeasonRanges = [...cloned.quoteSettings.peakSeasonRanges.filter(item => item.id !== summer.id), summer];
    cloned.quoteSettings.futurePriceRegistrationStart = IBREEZE_PRICE_REGISTRATION_START;
    cloned.quoteSettings.futurePriceArrivalStart = '';
    cloned.quoteSettings.courseTableTitle = defaults.quoteSettings.courseTableTitle;
    cloned.quoteSettings.courseTableNote = defaults.quoteSettings.courseTableNote;
    cloned.quoteSettings.roomTableTitle = defaults.quoteSettings.roomTableTitle;
    cloned.quoteSettings.ibreezePolicyVersion = IBREEZE_POLICY_VERSION;
  }
  // A legacy employee revision must not re-enable the superseded 10% agency offer.
  const sida = cloned.quoteSettings.promotions.find(item => item.id === 'sida-discount');
  if (sida) {
    sida.discountValue = Math.min(5, Math.max(0, Number.isFinite(sida.discountValue) ? sida.discountValue : 5));
    sida.description = `官方课程费和住宿费合计优惠${sida.discountValue}%；注册费、当地费用及其他费用不参与。`;
    sida.waiveRegistration = false;
    if (cloned.quoteImageSettings.promotionNotes) delete cloned.quoteImageSettings.promotionNotes['sida-discount'];
  }
  const prohibitedBenefit = /退差价|返现|返款|现金补贴|机票补贴|免费机票|签证补贴|保险补贴|赠送|礼品|奖品|奖学金/;
  cloned.quoteImageSettings.benefits = cloned.quoteImageSettings.benefits.map(item => prohibitedBenefit.test(item.title + item.text)
    ? { title: '费用透明', text: '学费、住宿与当地费用逐项列明' } : item);
  if (prohibitedBenefit.test(cloned.quoteImageSettings.alumniBenefitText)) cloned.quoteImageSettings.alumniBenefitText = defaults.quoteImageSettings.alumniBenefitText;
  return cloned;
};
