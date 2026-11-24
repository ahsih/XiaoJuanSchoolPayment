// PINES's versioned employee content document: courses, rooms, local fees, promotions and quote-image copy.
// The school pack of 2026-11 (2027 price list, promotions, local fees) is applied once to older saved documents
// through PINES_POLICY_VERSION. Prices follow the student's registration date (2026 prices before 2027-02-01,
// 2027 prices from then on); local fees follow the arrival date (2027 fees from 2027-02-01). Keep this file free
// of Angular, DOM and storage access.
import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaQuoteImageSettings,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

/** User-confirmed PINES 2027 summer range; newer than the association-wide migration. */
export const PINES_PEAK_POLICY_VERSION = 20271123;
/** The 2026-11 school pack: one main building, 2027 prices, promotions and local fees. */
export const PINES_POLICY_VERSION = 20271123;
type PinesQuoteSettings = CiaQuoteSettings & { pinesPolicyVersion?: number; pinesFeeNoteVersion?: number };

/** Registrations from this date pay 2027 tuition, rooms and promotions; earlier ones keep the 2026 policy. */
export const PINES_2027_PRICE_REGISTRATION_START = '2027-02-01';
/** Students arriving from this date pay 2027 local fees, whenever they registered. */
export const PINES_2027_LOCAL_FEE_ARRIVAL_START = '2027-02-01';

export const PINES_GLOBAL_YOUTH_COURSE_ID = 'global-youth-ielts';
export const PINES_GLOBAL_YOUTH_ROOM_ID = 'youth-4br';
export const PINES_JUNIOR_COURSE_ID = 'junior-family-course';
export const PINES_PARENTS_COURSE_ID = 'parents-course';
/** Courses priced as one fixed-length package (whole price in feeByWeeks / feeByWeeks2027). */
export const PINES_FIXED_WEEK_COURSES: Readonly<Record<string, number>> = {
  'toeic-guarantee-8-weeks': 8,
  'ielts-guarantee-8-weeks-5-5-6-0': 8,
  'ielts-guarantee-8-weeks-6-5-7-0': 8,
  'ielts-guarantee-12-weeks-5-5-6-0': 12,
  'ielts-guarantee-12-weeks-6-5-7-0': 12,
};
/** 2027 textbook price index per course: 0 up to 5 books, 1 six books or more, 2 IELTS (materials rule's futureRates). */
export const PINES_MATERIAL_TIERS: Readonly<Record<string, 0 | 1 | 2>> = {
  'light-esl-4': 0,
  'power-esl-5': 0,
  'business-english-executive': 0,
  'parents-course': 0,
  'power-speaking': 1,
  'intensive-esl': 1,
  'power-esl-7': 1,
  'business-english-practical': 1,
  'toeic-toeic-speaking': 1,
  'toeic-guarantee-8-weeks': 1,
  'junior-family-course': 1,
  'pre-ielts': 2,
  'ielts-regular': 2,
  'ielts-intensive': 2,
  'ielts-guarantee-8-weeks-5-5-6-0': 2,
  'ielts-guarantee-8-weeks-6-5-7-0': 2,
  'ielts-guarantee-12-weeks-5-5-6-0': 2,
  'ielts-guarantee-12-weeks-6-5-7-0': 2,
  'global-youth-ielts': 2,
};
/** Weeks one textbook set lasts, by tier (user answer 2026-11-24: 1,500/1,900 sets about 4–8 weeks, IELTS about 12). */
export const PINES_MATERIAL_SET_WEEKS: Readonly<Record<0 | 1 | 2, number>> = { 0: 8, 1: 8, 2: 12 };

const course = (
  id: string,
  name: string,
  tuition: number,
  tuition2027: number,
  schedule: string,
  suitable: string,
  note: string,
  sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({ id, name, tuition, tuition2027, schedule, suitable, note, enabled: true, sortOrder, ...extra });

const room = (
  id: string,
  name: string,
  label: string,
  group: string,
  fee: number,
  fee2027: number,
  note: string,
  sortOrder: number,
): CiaRoomContent => ({ id, name, label, code: '', location: '校内', group, fee, fee2027, note, enabled: true, sortOrder });

const localFee = (value: CiaLocalFeeRule): CiaLocalFeeRule => value;

const GUARANTEE_NOTE = '入学须达到学校要求的雅思分数并通过线上面试；出勤、作业和每周六模考须达标，课程期间有1次免费官方雅思考试。满足全部条件仍未达到目标分数，可免费再读4周课程（住宿和学杂费自付）。';
const LOCAL_FEE_INTRO = '以下费用到校后用比索直接交给学校，仅供准备现金参考。2027年2月1日起入学按2027年学杂费标准，之前入学按2026年标准；签证费用按所选签证和停留时间预估。接机、预存积分、房间押金和洗衣另列在下方，不计入合计。';
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';
const ACR_NOTE = '第一次续签时办理（30天签证第5周起，59天签证第9周起），只收一次。';
const MATERIALS_NOTE_2027 = '2027年2月1日起入学：参考价，按学习进度到校实际购买。5本以内1,500、6本以上1,900比索一套，约用4–8周（按8周预估）；雅思2,700比索一套，约用12周。';

/** 2026-11-24 user answers: ACR comes with the first visa extension; textbook sets last about 4–8 weeks (IELTS 12). */
export const PINES_FEE_NOTE_VERSION = 20271124;
const OLD_FEE_NOTES: Readonly<Record<string, { note?: string; futureNote: string }>> = {
  'acr-i-card': { note: '停留超过59天时办理，只收一次。', futureNote: '2027年2月1日起入学：停留超过59天（第9周起）办理，只收一次。' },
  materials: { futureNote:'2027年2月1日起入学：每4周按课程预估，5本以内1,500、6本以上1,900、雅思2,700比索；以实际购买为准。' },
};

const quoteImageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '', promotion: '' },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: LOCAL_FEE_INTRO,
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
  alumniBenefitText: ALUMNI_BENEFIT_TEXT,
  noteSectionTitle: '报价说明',
  footerNotes: ['2027年1月31日前报名按2026年学费和房费，2月1日起报名按2027年价格；学杂费按入学日期计算。', '最终以学校价格、空房及优惠确认为准。'],
});

export const createDefaultPinesContentConfig = (): CiaContentConfig => {
  const settings: PinesQuoteSettings = {
    registrationFee: 100,
    futurePriceRegistrationStart: PINES_2027_PRICE_REGISTRATION_START,
    futurePriceArrivalStart: '',
    shortStayRatios: { '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: 40,
    peakSeasonPolicyVersion: PINES_PEAK_POLICY_VERSION,
    pinesPolicyVersion: PINES_POLICY_VERSION,
    pinesFeeNoteVersion: PINES_FEE_NOTE_VERSION,
    peakSeasonRanges: [
      { id: 'pines-peak-2026', label: '2026暑期旺季', start: '2026-06-28', end: '2026-08-22', enabled: true },
      { id: 'pines-peak-2027', label: '2027暑期旺季', start: '2027-06-27', end: '2027-08-21', enabled: true },
    ],
    promotions: [
      { id: 'pines-registration-waiver', name: '通过思达启航报名', description: '通过思达启航报名的学生免收100美元注册费', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'pines-off-season', name: '常规优惠', description: '2027年1月31日前报名：暑期旺季以外的课程每满4周减150美元', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, registrationEnd: '2027-01-31', coverageTarget: 'none' },
      { id: 'pines-twelve-week', name: '12周优惠', description: '2027年1月31日前报名：课程满12周减100美元', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 12, minimumAccommodationWeeks: 0, registrationEnd: '2027-01-31', coverageTarget: 'none' },
      { id: 'pines-long-stay', name: '长期优惠', description: '2027年1月31日前报名：课程满16周减100美元，之后每多2周再减25美元', enabled: true, sortOrder: 3, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, incrementWeeks: 2, incrementValue: 25, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 16, minimumAccommodationWeeks: 0, registrationEnd: '2027-01-31', coverageTarget: 'none' },
      { id: 'pines-regular-2027', name: '2027常规优惠', description: '2027年2月1日至6月30日报名、2月1日起入学：暑期旺季以外的每个学习周减25美元（课程4周起）', enabled: true, sortOrder: 4, priority: 50, stackable: true, newStudentsOnly: false, discountType: 'per-course-week', discountValue: 25, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, registrationStart: '2027-02-01', registrationEnd: '2027-06-30', arrivalStart: '2027-02-01', coverageTarget: 'none' },
      { id: 'pines-long-term-2027', name: '2027长期优惠', description: '2027年2月1日至6月30日报名：课程满12周减100美元，之后每多1周再减25美元，旺季周也计入', enabled: true, sortOrder: 5, priority: 60, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, incrementWeeks: 1, incrementValue: 25, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 12, minimumAccommodationWeeks: 0, registrationStart: '2027-02-01', registrationEnd: '2027-06-30', arrivalStart: '2027-02-01', coverageTarget: 'none' },
      { id: 'pines-sida-discount', name: '思达启航95折', description: '课程和住宿按原价95折，再减学校优惠', enabled: true, sortOrder: 6, priority: 70, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'PINES课程费 / 4周',
    courseTableNote: '2027年1月31日前报名按列表价格；2027年2月1日起报名按2027年价格，展开课程可见。',
    groupClassNote: '4:1小组课每班最多4人；没有同级别同学时，2节小组课改为1节一对一。',
    roomTableTitle: 'PINES住宿费 / 4周',
    roomTableNote: '单人间、Twin A和亲子房在学校的Condo公寓楼，其他房型在主楼；口语和雅思课程的学生都可以选。住宿含周一至周五三餐和周六早餐。',
    stayPolicyTitle: 'PINES入住与离校',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '按学校的周日入学日入住，并提前确认接机。' },
      { label: '离校日期', value: '课程结束后的周六', note: '每个学习周按周日至周六计算。' },
      { label: '餐食', value: '工作日三餐和周六早餐', note: '周六午餐、晚餐和周日餐食在系统里提前申请，每餐179比索（当天申请250比索）。' },
    ],
    extraNightRates: [
      { label: '多住一晚（多人间）', amount: 1500 },
      { label: '多住一晚（单人房）', amount: 2500 },
    ],
  };

  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: 'PINES',
    courses: [
      course('power-speaking', 'Power Speaking 口语强化', 930, 980, '4节一对一 + 4节4:1小组课', '想大量开口、提高日常沟通', '一对一练口语、词汇、阅读和发音、语法；小组课练听力、句型表达和讨论。', 0),
      course('intensive-esl', 'Intensive ESL 密集英语', 1020, 1070, '5节一对一 + 2节4:1小组课', '想听说读写一起提高', '一对一练口语、词汇、阅读和发音、语法、句型表达；小组课练听力。', 1),
      course('light-esl-4', 'Light ESL 4 轻松英语', 850, 900, '每天4节一对一', '想留出自习和休息时间，也适合年长学员', '一对一练情景口语、听力、阅读和发音、习语表达；可加报小组课。', 2),
      course('power-esl-5', 'Power ESL 5 一对一5节', 980, 1030, '每天5节一对一', '想把时间集中在一对一纠错', '一对一练情景口语、听力、阅读和发音、习语表达、实用写作；可加报小组课。', 3),
      course('power-esl-7', 'Power ESL 7 一对一7节', 1220, 1270, '每天7节一对一', '短期冲刺、想要最多一对一', '在Power ESL 5的科目外，再从口语、听力、语法、发音、句型、阅读、讨论中选2科。', 4),
      course('business-english-practical', 'Practical Business English 实用商务英语', 1080, 1130, '4节一对一 + 3节4:1小组课', '工作中要用英语沟通、写邮件', '一对一练商务口语、商务词汇、商务句型、语法和写作；小组课练听力和商务英语基础。', 5),
      course('business-english-executive', 'Executive Business English 高级商务英语', 1080, 1130, '每天5节一对一', '中高级水平，需要开会、谈判和演讲', '一对一练商务口语、词汇、写作、讨论、公众演讲和听力。', 6),
      course('toeic-toeic-speaking', 'TOEIC / TOS 托业与托业口语', 980, 1030, '4节一对一 + 4节4:1小组课', '求职或公司要求托业成绩', '托业：语法、阅读和听力训练；托业口语（TOS）：按题型分段练习。教材可按需要选择。', 7),
      course('toeic-guarantee-8-weeks', 'TOEIC Guarantee 托业保分班（8周）', 0, 1120, '4节一对一 + 4节4:1小组课；固定8周', '有明确托业目标分数', '一对一练托业词汇、阅读速度、推理和语法；小组课练听力、阅读理解和词汇。2027年2月1日起报名开设，具体目标分数和条件以学校确认为准。', 8, { minimumWeeks: 8, allowedWeeks: [8], feeByWeeks2027: { '8': 2240 } }),
      course('ielts-guarantee-8-weeks-5-5-6-0', 'IELTS Guarantee 雅思保分班8周（目标5.5／6.0）', 1450, 1500, '5节一对一 + 2节4:1小组课；固定8周', '已有雅思基础、8周内要拿到5.5或6.0', `${GUARANTEE_NOTE}8周班只在第8周考试。`, 9, { minimumWeeks: 8, allowedWeeks: [8], feeByWeeks: { '8': 2900 }, feeByWeeks2027: { '8': 3000 } }),
      course('ielts-guarantee-8-weeks-6-5-7-0', 'IELTS Guarantee 雅思保分班8周（目标6.5／7.0）', 1450, 1500, '每天6节一对一；固定8周', '雅思6.0以上、8周内要拿到6.5或7.0', `${GUARANTEE_NOTE}8周班只在第8周考试。`, 10, { minimumWeeks: 8, allowedWeeks: [8], feeByWeeks: { '8': 2900 }, feeByWeeks2027: { '8': 3000 } }),
      course('ielts-guarantee-12-weeks-5-5-6-0', 'IELTS Guarantee 雅思保分班12周（目标5.5／6.0）', 1350, 1383.33, '5节一对一 + 2节4:1小组课；固定12周', '雅思4.0左右、需要更长时间冲5.5或6.0', `${GUARANTEE_NOTE}12周班在第10至12周之间考试。`, 11, { minimumWeeks: 12, allowedWeeks: [12], feeByWeeks: { '12': 4050 }, feeByWeeks2027: { '12': 4150 } }),
      course('ielts-guarantee-12-weeks-6-5-7-0', 'IELTS Guarantee 雅思保分班12周（目标6.5／7.0）', 1350, 1383.33, '每天6节一对一；固定12周', '雅思5.0以上、要冲6.5或7.0', `${GUARANTEE_NOTE}12周班在第10至12周之间考试。`, 12, { minimumWeeks: 12, allowedWeeks: [12], feeByWeeks: { '12': 4050 }, feeByWeeks2027: { '12': 4150 } }),
      course('pre-ielts', 'Pre-IELTS 雅思预科', 1050, 1100, '4节一对一 + 4节4:1小组课', '雅思1.0–3.5，先打基础再进雅思', '分Head Start（雅思1.0–2.5）和Jump Start（3.0–3.5）两级，建议读4–8周。', 13),
      course('ielts-regular', 'IELTS 常规雅思', 1100, 1150, '4节一对一 + 3节4:1小组课', '雅思4.0以上，系统备考', '分Builder（4.0–5.5）和Enhancer（6.0以上）两级；每4周一个学习周期。', 14),
      course('ielts-intensive', 'IELTS Speaking & Writing Intensive 雅思口语写作密集', 1200, 1250, '每天6节一对一', '口语和写作拖分、想集中突破', '6节一对一以口语和写作为主；最长可读12周。', 15),
      course(PINES_PARENTS_COURSE_ID, 'Parents Course 家长课程', 750, 800, '每天3节一对一', '陪孩子来读亲子课程的家长', '一对一练口语、阅读和发音、句型表达；可加报小组课。须与孩子的亲子青少年课程一起报名。', 16),
      course(PINES_JUNIOR_COURSE_ID, 'Junior Family Course 亲子青少年课程（7–15岁）', 1500, 1550, '5节一对一 + 2节4:1小组课', '7–15岁、由家长陪同的孩子', '一对一练互动口语、语法、阅读和发音、句型表达和英语演讲；小组课练听力和讨论，晚上有词汇和朗读选修课。家长须同时报家长课程；暑期旺季价格不变，另加旺季附加费。', 17),
      course(PINES_GLOBAL_YOUTH_COURSE_ID, 'Global Youth IELTS 青少年雅思营（13–17岁）', 1200, 1250, '6节一对一 + 2节晚间小组课；晚自习到22:00', '13–17岁、没有家长陪同的学生', '听说读写均衡训练，适合初级到中级；菲律宾老师与学生同住管理，工作日不外出，周六上午词汇或模拟考试。4周起读，须住青少年宿舍。', 18, { minimumWeeks: 4 }),
    ],
    rooms: [
      room('single-a', 'Single A 单人房A', '单人房A', '单人间', 1250, 1300, 'Condo公寓楼的独立单人房，房内有卫生间和淋浴。', 0),
      room('single-b', 'Single B 单人房B', '单人房B', '单人间', 1150, 1200, 'Condo公寓楼套间：和C房共用客厅，B房有自己的卫生间。', 1),
      room('single-c', 'Single C 单人房C', '单人房C', '单人间', 970, 1020, 'Condo公寓楼套间：和B房共用客厅，用客厅的卫生间；价格最低的单人房。', 2),
      room('twin-a', 'Twin A 双人房A', '双人房A', '多人间', 870, 900, 'Condo公寓楼的双人房，房内有卫生间和淋浴。', 3),
      room('twin-b', 'Twin B 双人房B', '双人房B', '多人间', 840, 870, '主楼双人房，两人同住。', 4),
      room('family-3br', 'Family 3BR 亲子房', '亲子房', '多人间', 780, 810, 'Condo公寓楼的三床房，家长和孩子同住，按每人计价。', 5),
      room('five-br-solo', '5-BR Solo 五人间（床位分隔）', '五人间（床位分隔）', '多人间', 650, 700, '主楼新房型：五人共用一套房，每人一个带门的小隔间（床在上层、书桌在下层），共用客厅和卫浴。', 7),
      room('quad', '4 Beds 四人间', '四人间', '多人间', 700, 700, '主楼四人间：床在上层、书桌在下层。', 8),
      room('sextuple', '6 Beds 六人间', '六人间', '多人间', 570, 570, '主楼六人间：床在上层、书桌在下层；价格最低。', 9),
      room(PINES_GLOBAL_YOUTH_ROOM_ID, 'Global Youth 青少年宿舍', '青少年宿舍', '多人间', 700, 700, '只限青少年雅思营：学生和一位菲律宾老师同住。', 10),
    ],
    localFees: [
      localFee({ id: 'ssp', name: 'SSP特殊学习许可', currency: 'PHP', amount: 7800, billingRule: 'once', includeInTotal: true, note: '移民局收取，有效6个月。', enabled: true, sortOrder: 0 }),
      localFee({ id: 'ssp-e-card', name: 'SSP I-Card', currency: 'PHP', amount: 4500, billingRule: 'once', includeInTotal: true, note: '与SSP一起办理，只收一次。', enabled: true, sortOrder: 1 }),
      localFee({ id: 'acr-i-card', name: 'ACR I-Card 外国人登记卡', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: true, note: ACR_NOTE, enabled: true, sortOrder: 2, futureEffectiveStart: PINES_2027_LOCAL_FEE_ARRIVAL_START, futureAmount: 4000, futureNote: ACR_NOTE }),
      localFee({ id: 'utilities', name: '水电费', currency: 'PHP', amount: 3000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '按住宿周数计算，每4周3,000比索。', enabled: true, sortOrder: 3, futureEffectiveStart: PINES_2027_LOCAL_FEE_ARRIVAL_START, futureAmount: 3800, futureNote: '2027年2月1日起入学：按住宿周数计算，每4周3,800比索。' }),
      localFee({ id: 'maintenance', name: '宿舍维护费', currency: 'PHP', amount: 0, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional', includeInTotal: true, note: '2027年2月1日起入学收取。', enabled: true, sortOrder: 4, futureEffectiveStart: PINES_2027_LOCAL_FEE_ARRIVAL_START, futureAmount: 500, futureNote: '2027年2月1日起入学：按住宿周数，每周500比索。' }),
      localFee({ id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 6210, rates: [6210], billingRule: 'visa-extension-schedule', includeInTotal: true, note: '按所选签证和停留时间预估，每次6,210比索。', enabled: true, sortOrder: 5, futureEffectiveStart: PINES_2027_LOCAL_FEE_ARRIVAL_START, futureAmount: 4940, futureRates: [4940, 6210, 4240], futureNote: '2027年2月1日起入学：30天签证第5–8周累计4,940、第9–12周11,150、第13–16周15,390比索，之后每4周加4,240；59天签证从第9周起续签。' }),
      localFee({ id: 'materials', name: '教材费', currency: 'PHP', amount: 0, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '2026年入学的教材从预存积分里按实际购买扣除。', enabled: true, sortOrder: 6, futureEffectiveStart: PINES_2027_LOCAL_FEE_ARRIVAL_START, futureAmount: 1500, futureRates: [1500, 1900, 2700], futureNote: MATERIALS_NOTE_2027 }),
      localFee({ id: 'student-id', name: '学生证', currency: 'PHP', amount: 200, billingRule: 'once', includeInTotal: true, note: '一次性费用。', enabled: true, sortOrder: 7 }),
      localFee({ id: 'pickup', name: '机场接机（马尼拉或克拉克）', currency: 'PHP', amount: 3000, billingRule: 'optional', includeInTotal: false, note: '学校周日团体接机，按需要选择；周日19:00以后到达的航班不接。', enabled: true, sortOrder: 8 }),
      localFee({ id: 'campus-deposit', name: 'Points 校内预存积分', currency: 'PHP', amount: 4000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: false, note: '每4周4,000比索，用于学生证、洗衣、咖啡厅、活动等；没用完的毕业时退还。', enabled: true, sortOrder: 9 }),
      localFee({ id: 'room-deposit', name: '房间押金（可退）', currency: 'PHP', amount: 4000, billingRule: 'once', includeInTotal: false, multiplyByStudents: true, note: '无损坏、无欠费时毕业退还；2027年2月1日起入学为100美元。', enabled: true, sortOrder: 10 }),
      localFee({ id: 'laundry', name: '洗衣', currency: 'PHP', amount: 200, billingRule: 'optional', includeInTotal: false, note: '洗加烘每次200比索（最多7公斤），只洗或只烘130比索；按实际使用。', enabled: true, sortOrder: 11 }),
      localFee({ id: 'eb-pro', name: 'EB Pro 自选斯巴达管理', currency: 'PHP', amount: 5000, billingRule: 'optional', includeInTotal: false, note: '自愿参加：早上词汇课和19:00–22:00晚间学习，每4周5,000比索（2周2,500）。', enabled: true, sortOrder: 12 }),
    ],
    quoteSettings: settings,
    quoteImageSettings: quoteImageSettings(),
    media: [],
  };

  config.quoteImageSettings.localFeeNotes = Object.fromEntries(config.localFees.map(fee => [fee.id, fee.note]));
  return config;
};

const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * The 2026-11 school pack replaces the catalogue, fees, promotions and table copy of a document saved before it:
 * the two campuses became one main building with one room list, and the 2027 prices, promotions and local fees
 * are new. Uploaded media and edited company lines of the quote image stay.
 */
function upgradeToSchoolPack2027(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  clone.courses = copyJson(defaults.courses);
  clone.rooms = copyJson(defaults.rooms);
  clone.localFees = copyJson(defaults.localFees);
  clone.quoteSettings = copyJson(defaults.quoteSettings);
  const image = clone.quoteImageSettings;
  if (image) {
    image.paymentNotes = copyJson(defaults.quoteImageSettings.paymentNotes);
    image.localFeeIntro = defaults.quoteImageSettings.localFeeIntro;
    image.localFeeNotes = copyJson(defaults.quoteImageSettings.localFeeNotes);
    image.footerNotes = copyJson(defaults.quoteImageSettings.footerNotes);
    image.alumniBenefitText = ALUMNI_BENEFIT_TEXT;
  }
}

export const clonePinesContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const clone = copyJson(value);
  const defaults = createDefaultPinesContentConfig();
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  if (((clone.quoteSettings as PinesQuoteSettings).pinesPolicyVersion ?? 0) < PINES_POLICY_VERSION) {
    upgradeToSchoolPack2027(clone, defaults);
  }
  const noteSettings = clone.quoteSettings as PinesQuoteSettings;
  if ((noteSettings.pinesFeeNoteVersion ?? 0) < PINES_FEE_NOTE_VERSION) {
    // Replace only the ACR and textbook notes nobody edited since the school-pack release.
    for (const [id, old] of Object.entries(OLD_FEE_NOTES)) {
      const saved = clone.localFees.find(fee => fee.id === id);
      const fresh = defaults.localFees.find(fee => fee.id === id)!;
      if (!saved) continue;
      if (old.note !== undefined && saved.note === old.note) saved.note = fresh.note;
      if (saved.futureNote === old.futureNote) saved.futureNote = fresh.futureNote;
      const imageNotes = clone.quoteImageSettings?.localFeeNotes;
      if (old.note !== undefined && imageNotes?.[id] === old.note) imageNotes[id] = fresh.note;
    }
    noteSettings.pinesFeeNoteVersion = PINES_FEE_NOTE_VERSION;
  }
  clone.quoteSettings.peakSeasonRanges ??= [];
  if ((clone.quoteSettings.peakSeasonPolicyVersion ?? 0) < PINES_PEAK_POLICY_VERSION) {
    // The school's 2027 price list confirms the summer peak; later employee edits are kept.
    const confirmed2027 = defaults.quoteSettings.peakSeasonRanges.find(range => range.id === 'pines-peak-2027')!;
    const saved2027 = clone.quoteSettings.peakSeasonRanges.find(range => range.id === 'pines-peak-2027' || range.label.includes('2027'));
    if (saved2027) Object.assign(saved2027, confirmed2027);
    else clone.quoteSettings.peakSeasonRanges.push({ ...confirmed2027 });
    clone.quoteSettings.peakSeasonPolicyVersion = PINES_PEAK_POLICY_VERSION;
  }
  const savedSettings = clone.quoteImageSettings;
  clone.quoteImageSettings = {
    ...defaults.quoteImageSettings,
    ...(savedSettings ?? {}),
    paymentNotes: {
      ...defaults.quoteImageSettings.paymentNotes,
      ...(savedSettings?.paymentNotes ?? {}),
    },
    localFeeNotes: {
      ...defaults.quoteImageSettings.localFeeNotes,
      ...Object.fromEntries((clone.localFees ?? []).map(fee => [fee.id, fee.note])),
      ...(savedSettings?.localFeeNotes ?? {}),
    },
  };
  clone.media ??= [];
  return clone;
};
