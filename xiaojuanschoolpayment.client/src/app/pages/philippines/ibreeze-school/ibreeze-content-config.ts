import { CiaContentConfig, CiaLocalFeeRule } from '../cia-school/cia-content-config';
import { copyContentData } from '../copy-content-data';
import { IBREEZE_COURSES, IBREEZE_ROOMS } from './ibreeze-catalog';
import {
  IBREEZE_NOVEMBER_POLICY_VERSION, IBREEZE_POLICY_VERSION, IBREEZE_PRICE_REGISTRATION_START, IBREEZE_ROOMS_2026, IBREEZE_ROOMS_2027,
  IBREEZE_TUITION_2026, IBREEZE_TUITION_2027,
} from './ibreeze-pricing-2027';

/**
 * Local fees from the school's 2026 and 2027 price lists (2026-11-20 pack): management, campus electricity and water
 * are weekly; the condo charges its own electricity and includes water. The deposit and pickup stay reference rows.
 */
export const createIbreezeLocalFees = (): CiaLocalFeeRule[] => [
  { id: 'ssp', name: 'SSP特殊学习许可', currency: 'PHP', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '持旅游签证学习必须办理，入学时办理一次。', enabled: true, sortOrder: 0 },
  { id: 'ssp-e-card', name: 'SSP E-CARD', currency: 'PHP', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP同时办理，只收一次。', enabled: true, sortOrder: 1 },
  { id: 'acr-i-card', name: 'ACR-I CARD 外国人身份证', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '到校后首次续签时办理一次。', enabled: true, sortOrder: 2 },
  { id: 'arp', name: 'ARP外国人登记', currency: 'PHP', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '学校价目表未列此项；如学校另行收取，由顾问确认。', enabled: false, sortOrder: 3 },
  { id: 'management', name: '公共管理费', currency: 'PHP', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '按住宿周数计算；校外公寓称公共设施费，同为1,000比索／周。', enabled: true, sortOrder: 4 },
  { id: 'electricity', name: '校内电费', currency: 'PHP', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '仅校内宿舍计收；每周含20度电，超出部分23比索／度，到校结算。', enabled: true, sortOrder: 5 },
  { id: 'condo-electricity', name: '校外公寓电费', currency: 'PHP', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '仅校外公寓计收，每人每周1,000比索；公寓含水费和Wi-Fi。', enabled: true, sortOrder: 6 },
  { id: 'water', name: '水费', currency: 'PHP', amount: 250, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '仅校内宿舍计收。', enabled: true, sortOrder: 7 },
  { id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 6410, rates: [6410, 4440, 5040, 4440, 5040], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '抵达满签证天数后每30天续签一次，按所选旅游签证及停留天数累计；长期签证暂按免收预估并由顾问确认。', enabled: true, sortOrder: 8 },
  { id: 'books', name: '教材费', currency: 'PHP', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '每4周约2,000–3,000比索，先按2,000比索预估；按课程实际购买。', enabled: true, sortOrder: 9 },
  { id: 'student-card', name: '学生证及照片', currency: 'PHP', amount: 600, billingRule: 'once', includeInTotal: true, note: '一次性费用。', enabled: true, sortOrder: 10 },
];

/** Course and room notes of the 2026-11-10 defaults; saved copies still equal to them take the new text. */
const OLD_COURSE_TABLE_NOTE = '以下为4周课程费，币种为美元。2027/01/01起报名使用2027价，此前报名使用2026价；注册费和住宿费另计。';
const OLD_GROUP_CLASS_NOTE = '提前安排多种课程不收换课费；到校后更换课程另收100美元／4周。';
const IBREEZE_COURSE_TABLE_NOTE = '课程费按报名日期计价：2026/12/31前报名按2026年价格，2027/01/01起报名按2027年价格（点开课程可看）；注册费和住宿费另计。';
const IBREEZE_GROUP_CLASS_NOTE = '小组课每班最多6人，特色小组课最多10人；商务和托业小组课不足3人时改上ESL小组课。';
const IBREEZE_ROOM_TABLE_NOTE = '以下为4周住宿费，按报名日期计价：2027/01/01起报名，部分单人间和双人间调价，报价会自动换算。校外公寓含水费和Wi-Fi，电费另计。';

const IBREEZE_LOCAL_FEE_INTRO = '以下费用以比索计价，到校后交给学校，最终以学校实收为准。校外公寓含水费和Wi-Fi，电费另计；接机和可退押金另列。';
const IBREEZE_STAY_POLICIES = [
  { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
  { label: '退房日期', value: '课程结束后的周六中午前', note: '提前到或延住须由学校确认空房和费用。' },
  { label: '校外公寓', value: '步行约5分钟', note: '周一至周五有接送；含水费和Wi-Fi，电费和公共设施费另计。' },
];

export const createDefaultIbreezeContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'IBREEZE',
  courses: IBREEZE_COURSES.map((item, index) => ({
    id: item.id,
    name: item.name,
    tuition: item.tuition,
    feeByWeeks: { ...IBREEZE_TUITION_2026[item.id] },
    tuition2027: IBREEZE_TUITION_2027[item.id]['4'],
    feeByWeeks2027: { ...IBREEZE_TUITION_2027[item.id] },
    schedule: item.lessons,
    suitable: item.suitable,
    note: item.note,
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
    feeByWeeks: { ...IBREEZE_ROOMS_2026[item.id] },
    fee2027: IBREEZE_ROOMS_2027[item.id]['4'],
    feeByWeeks2027: { ...IBREEZE_ROOMS_2027[item.id] },
    note: item.note,
    enabled: true,
    sortOrder: index,
  })),
  localFees: createIbreezeLocalFees(),
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
      { id: 'september-twin', name: '9月双人间住宿优惠', description: '2026年9月1日–30日报名、12月27日前抵达；IB1/IB2双人间每完整4周减120美元。', enabled: false, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 120, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 120, eligibleRoomIds: ['twin-main', 'twin-ib2'], registrationStart: '2026-09-01', registrationEnd: '2026-09-30', arrivalEnd: '2026-12-26', coverageTarget: 'none' },
      { id: 'september-multi', name: '9月三/四人间住宿优惠', description: '2026年9月1日–30日报名、12月27日前抵达；IB1三人间及IB1/IB2四人间每完整4周减200美元。', enabled: false, sortOrder: 2, priority: 21, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 200, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 200, eligibleRoomIds: ['triple-main', 'quad-main', 'quad-ib2'], registrationStart: '2026-09-01', registrationEnd: '2026-09-30', arrivalEnd: '2026-12-26', coverageTarget: 'none' },
      { id: 'christmas-2026', name: '圣诞特别优惠', description: '2026/12/27–2027/01/02期间在读，每位学生减100美元；课程须连续覆盖，只有住宿覆盖或课程间断不适用。', enabled: true, sortOrder: 3, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageStart: '2026-12-27', coverageEnd: '2027-01-02', coverageTarget: 'course' },
      { id: 'returning-registration', name: '老学员免注册费', description: '老学员返校免一次性注册费。', enabled: true, sortOrder: 4, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'november-twin', name: '11月双人间住宿优惠', description: '2026/11/01–12/31报名，最晚2027/05/02入学；IB1/IB2双人间优惠100美元／4周，2027/01/03–01/23住宿不计优惠。', enabled: true, sortOrder: 5, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 100, eligibleRoomIds: ['twin-main', 'twin-ib2'], registrationStart: '2026-11-01', registrationEnd: '2026-12-31', arrivalEnd: '2027-05-02', coverageTarget: 'none' },
      { id: 'november-multi', name: '11月三/四人间住宿优惠', description: '2026/11/01–12/31报名，最晚2027/05/02入学；IB1三人间及IB1/IB2四人间优惠200美元／4周，2027/01/03–01/23住宿不计优惠。', enabled: true, sortOrder: 6, priority: 21, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 200, appliesTo: 'accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 200, eligibleRoomIds: ['triple-main', 'quad-main', 'quad-ib2'], registrationStart: '2026-11-01', registrationEnd: '2026-12-31', arrivalEnd: '2027-05-02', coverageTarget: 'none' },
    ],
    localFeeIntro: IBREEZE_LOCAL_FEE_INTRO,
    courseTableTitle: 'I.BREEZE 2026 / 2027年课程费',
    courseTableNote: IBREEZE_COURSE_TABLE_NOTE,
    groupClassNote: IBREEZE_GROUP_CLASS_NOTE,
    roomTableTitle: 'I.BREEZE 2026 / 2027年住宿费',
    roomTableNote: IBREEZE_ROOM_TABLE_NOTE,
    stayPolicyTitle: 'I.BREEZE入住与住宿提醒',
    stayPolicies: IBREEZE_STAY_POLICIES.map(item => ({ ...item })),
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '', promotion: '' },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: IBREEZE_LOCAL_FEE_INTRO,
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

/** Text the 2026-11-10 defaults shipped with. Saved content still equal to it was never edited and takes the new text. */
const LEGACY_COURSE_TEXT: Record<string, { name: string; schedule: string; suitable: string }> = {
  'intensive-speaking': { name: '密集口语 Intensive Speaking', schedule: '4节一对一 + 1节活动课', suitable: '以表达和辩论技巧为主。' },
  'light-esl': { name: '轻度ESL Light ESL', schedule: '4节一对一 + 2节团体课 + 1节选修活动课', suitable: '适合综合英语提升。' },
  'general-business-and-bec': { name: '商务英语 General Business & BEC', schedule: '4节一对一 + 2节小组课 + 1节活动课', suitable: '入学参考：雅思3.5、托业350或校内A2。未达要求可转密集口语，不退差价；第4周月考后可重新评估。商务团体课至少3人，不足时安排ESL团体课。' },
  'power-esl': { name: '强化ESL Power ESL', schedule: '5节一对一 + 2节团体课 + 1节特殊课 + 1节选修活动课', suitable: '团体课最多6人，特殊课最多10人，由高级菲律宾教师或母语教师授课；A1级特殊课由高级菲律宾教师授课。' },
  'intensive-beginner': { name: '初学者加强 Intensive Beginner', schedule: '5节一对一 + 3节团体课 + 1节活动课 + 词汇测试', suitable: '小组课最多6人；须参加每日词汇测试、完成作业，教师每周反馈。Pre-A1学生须参加4周夜间活动。' },
  'ielts-starter': { name: '雅思初学者 IELTS Starter', schedule: '4节一对一 + 3节团体课 + 1节活动课 + 每4周2次模考及解析', suitable: '入学参考：雅思2.5、托业250或校内A1。未达要求可转初学者ESL，不退差价；第4周月考后可重新评估。' },
  'ielts-target': { name: '雅思目标 IELTS Target', schedule: '5节一对一 + 3节团体课 + 2节晚课 + 每周四模考 + 周三解析', suitable: '第一周制定目标学习计划，雅思教师提供每日及每周反馈。' },
  'toeic-target': { name: '托业目标 TOEIC Target', schedule: '5节一对一 + 2节团体课 + 1节选修课 + 每周五模考', suitable: '入学参考：雅思3.5、托业351或校内A2。未达要求可转强化ESL，不退差价，第4周月考后可重新评估。托业小组课至少3人，不足时安排ESL小组课。报名12周及以上，毕业前3周出勤率达90%且模考达550分，可获一次官方考试。' },
  'junior-english': { name: '青少年英语 Junior English', schedule: '4节一对一 + 2节词汇及写作课 + 1节活动课', suitable: '5–14岁青少年可与家长同行；未成年报名政策见下方说明。' },
};
const LEGACY_ROOM_TEXT: Record<string, { name: string; note: string }> = {
  'quad-main': { name: 'IB1四人间（上下铺）', note: '' },
  'triple-main': { name: 'IB1三人间', note: '' },
  'twin-main': { name: 'IB1双人间', note: '' },
  'single-main': { name: 'IB1单人间', note: '' },
  'quad-ib2': { name: 'IB2四人间', note: '' },
  'twin-ib2': { name: 'IB2双人间', note: '' },
  'single-ib2': { name: 'IB2单人间', note: '' },
  'off-campus-superior-single': { name: '校外公寓超级单人间', note: '1张大床，含卧室及客厅；包含水电' },
  'off-campus-standard-single': { name: '校外公寓标准单人间', note: '2张单人床；包含水电' },
  'off-campus-standard-twin': { name: '校外公寓标准双人间', note: '2张单人床；包含水电' },
  'off-campus-superior-twin': { name: '校外公寓超级双人间', note: '2间卧室，1张大床及2张单人床，可住3–5人；包含水电' },
  'off-campus-family': { name: '校外公寓家庭房（3–5人）', note: '包含水电' },
};

/** One-time move onto the school's 2026-11-20 pack; keeps prices and text an employee changed. */
const upgradeToSchoolPack = (cloned: CiaContentConfig, defaults: CiaContentConfig) => {
  for (const course of cloned.courses) {
    const next = defaults.courses.find(item => item.id === course.id);
    if (!next) continue;
    if (!course.feeByWeeks && IBREEZE_TUITION_2026[course.id]?.['4'] === course.tuition) course.feeByWeeks = { ...IBREEZE_TUITION_2026[course.id] };
    const legacy = LEGACY_COURSE_TEXT[course.id];
    if (!legacy) continue;
    if (course.name === legacy.name) course.name = next.name;
    if (course.schedule === legacy.schedule) course.schedule = next.schedule;
    if (course.suitable === legacy.suitable) course.suitable = next.suitable;
    if (course.note === legacy.suitable || !course.note) course.note = next.note;
  }
  for (const room of cloned.rooms) {
    const next = defaults.rooms.find(item => item.id === room.id);
    if (!next) continue;
    if (!room.feeByWeeks && IBREEZE_ROOMS_2026[room.id]?.['4'] === room.fee) room.feeByWeeks = { ...IBREEZE_ROOMS_2026[room.id] };
    const legacy = LEGACY_ROOM_TEXT[room.id];
    if (!legacy) continue;
    if (room.name === legacy.name) room.name = next.name;
    if (room.label === legacy.name) room.label = next.label;
    if (room.note === legacy.note) room.note = next.note;
  }
  // The school's new fee sheet replaces every built-in fee rule; rows an employee added stay.
  const builtIn = new Set(defaults.localFees.map(item => item.id));
  cloned.localFees = [...copyContentData(defaults.localFees), ...cloned.localFees.filter(item => !builtIn.has(item.id))];
  for (const id of ['september-twin', 'september-multi']) {
    const rule = cloned.quoteSettings.promotions.find(item => item.id === id);
    if (rule) rule.enabled = false;
  }
  cloned.quoteSettings.localFeeIntro = defaults.quoteSettings.localFeeIntro;
  cloned.quoteImageSettings.localFeeIntro = defaults.quoteImageSettings.localFeeIntro;
  // The old room note said the condo includes electricity; the 2026-11 sheets charge it, so it is always replaced.
  cloned.quoteSettings.roomTableNote = defaults.quoteSettings.roomTableNote;
  if (cloned.quoteSettings.courseTableNote === OLD_COURSE_TABLE_NOTE) cloned.quoteSettings.courseTableNote = defaults.quoteSettings.courseTableNote;
  if (cloned.quoteSettings.groupClassNote === OLD_GROUP_CLASS_NOTE) cloned.quoteSettings.groupClassNote = defaults.quoteSettings.groupClassNote;
  cloned.quoteSettings.stayPolicies = copyContentData(defaults.quoteSettings.stayPolicies);
};

export const cloneIbreezeContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const cloned = copyContentData(value);
  if (!cloned.quoteImageSettings.localFeeNotes) cloned.quoteImageSettings.localFeeNotes = {};
  if (!cloned.media) cloned.media = [];
  const defaults = createDefaultIbreezeContentConfig();
  const version = cloned.quoteSettings.ibreezePolicyVersion ?? 0;
  if (version < IBREEZE_NOVEMBER_POLICY_VERSION) {
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
      if (index >= 0) cloned.quoteSettings.promotions[index] = copyContentData(rule);
      else cloned.quoteSettings.promotions.push(copyContentData(rule));
    }
    const summer = defaults.quoteSettings.peakSeasonRanges.find(item => item.id === 'summer-2027')!;
    cloned.quoteSettings.peakSeasonRanges = [...cloned.quoteSettings.peakSeasonRanges.filter(item => item.id !== summer.id), summer];
    cloned.quoteSettings.futurePriceRegistrationStart = IBREEZE_PRICE_REGISTRATION_START;
    cloned.quoteSettings.futurePriceArrivalStart = '';
    cloned.quoteSettings.courseTableTitle = defaults.quoteSettings.courseTableTitle;
    cloned.quoteSettings.courseTableNote = defaults.quoteSettings.courseTableNote;
    cloned.quoteSettings.roomTableTitle = defaults.quoteSettings.roomTableTitle;
  }
  if (version < IBREEZE_POLICY_VERSION) {
    upgradeToSchoolPack(cloned, defaults);
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
