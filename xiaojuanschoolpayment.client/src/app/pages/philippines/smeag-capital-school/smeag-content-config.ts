// SMEAG Capital's versioned employee content document: courses, rooms, local fees, promotions and quote-image
// copy. The public page (smeag-capital-school-page.component.ts), its calculator (smeag-page-quote.ts), the
// local-fee table and the quote image all read the published version of this document. Keep it pure data.
// Sources: the school's Google Drive pack (Capital folders only), received 2026-11-23; see
// docs/smeag-capital-source-2026-11-23.md. The Encanto campus is a separate page and not covered here.
import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import { upgradeAcrNotes } from '../acr-first-extension';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Raised when saved documents must inherit a school notice once (cloneSmeagContentConfig):
 * 1 = the 2026-11-23 school pack: Chinese course names and class lines from the 2026 orientation, separate
 *     IELTS and TOEFL rows, partner-hotel rooms, the 2027 local-fee sheet and the 2026/2027 offers.
 * 2 = partner-hotel weeks pay a 2,000-peso management fee per 4 weeks instead of utilities and water and
 *     electricity (user confirmation 2026-11-24).
 */
export const SMEAG_POLICY_VERSION = 2;
type SmeagQuoteSettings = CiaQuoteSettings & { smeagPolicyVersion?: number };

export const SMEAG_SIDA_RULE_ID = 'smeag-sida-90';
export const SMEAG_RETURNING_RULE_ID = 'smeag-returning-registration';
export const SMEAG_CAMPUS_ROOM_IDS: readonly string[] = ['campus-single', 'campus-twin', 'campus-triple', 'campus-quad', 'campus-five'];
export const SMEAG_HOTEL_ROOM_IDS: readonly string[] = ['hotel-single', 'hotel-twin', 'hotel-triple', 'hotel-quad'];

/** Textbook set (local-fee rule id) for each course; one set per type, a type is never charged twice. */
export const SMEAG_TEXTBOOK_BY_COURSE: Readonly<Record<string, string>> = {
  'esl-regular-ket-pet-fce': 'book-esl', 'esl-cae': 'book-esl', 'esl-2': 'book-esl', 'esl-2-cae': 'book-esl',
  'esl-junior': 'book-esl', 'esl-junior-2': 'book-esl', guardian: 'book-esl',
  'speaking-master-ket-pet-fce': 'book-speaking', 'speaking-master-cae': 'book-speaking',
  'ielts-pre': 'book-ielts', 'ielts-regular': 'book-ielts',
  'toefl-pre': 'book-toefl', 'toefl-regular': 'book-toefl',
  'toeic-pre': 'book-toeic', 'toeic-regular': 'book-toeic',
  business: 'book-business', children: 'book-family',
};

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
): CiaCourseContent => ({ id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder });

const room = (
  id: string, name: string, code: string, group: string, location: '校内' | '校外', fee: number, note: string, sortOrder: number,
): CiaRoomContent => ({ id, name, label: name, code, location, group, fee, note, enabled: true, sortOrder });

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: (value.sortOrder + 1) * 10,
  stackable: true,
  newStudentsOnly: false,
  discountType: 'per-course-week',
  discountValue: 25,
  appliesTo: 'tuition',
  waiveRegistration: false,
  minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'course',
  ...value,
});

// Class lines from the 2026 new-student orientation (每节45分钟); “特别课” is the school's Special Class.
const ESL_LINE = '6节正课（一对一读写2节、一对一听说2节、1:4讨论课2节）+ 4节特别课';
const ESL2_LINE = 'ESL的全部课程 + 每天1节一对一口语课（安排在早上或晚上斯巴达时段）';
const SPEAKING_LINE = '6节正课（一对一综合口语2节、一对一学术口语2节、1:4强化讨论2节）+ 4节特别课';
const TOEIC_LINE = '6节正课（一对一基础2节、一对一阅读2节、1:4听力2节）+ 4节特别课';
const EXAM_LINE = '8节正课（一对一口语2节、一对一写作2节、1:4阅读2节、1:8听力2节）+ 2节特别课';
const LEVEL_NOTE = '入学分级测试后按级别分班，课程费按级别计算。';
const JUNIOR_NOTE = '课程安排报名时向学校确认；未满15岁须有监护人陪读。';

const createCourses = (): CiaCourseContent[] => [
  course('esl-regular-ket-pet-fce', 'ESL 综合英语（KET／PET／FCE级别）', 840, ESL_LINE, '想全面打好听说读写基础的成人', `按剑桥英语体系分级。${LEVEL_NOTE}`, 0),
  course('esl-cae', 'ESL 综合英语（CAE高级）', 1320, ESL_LINE, '已达高级水平、想继续提升的学生', `按剑桥英语体系分级。${LEVEL_NOTE}`, 1),
  course('esl-2', 'ESL 2 综合英语加强（入门至中高级）', 1140, ESL2_LINE, '想在ESL之外多练口语的学生', `每天比ESL多1节一对一口语课。${LEVEL_NOTE}`, 2),
  course('esl-2-cae', 'ESL 2 综合英语加强（高级）', 1620, ESL2_LINE, '高级水平、想多练口语的学生', `每天比ESL多1节一对一口语课。${LEVEL_NOTE}`, 3),
  course('speaking-master-ket-pet-fce', 'Speaking Master 口语强化（入门至中高级）', 1140, SPEAKING_LINE, '想集中提升口语和表达的学生', LEVEL_NOTE, 4),
  course('speaking-master-cae', 'Speaking Master 口语强化（高级）', 1620, SPEAKING_LINE, '高级水平、想练学术和专业表达的学生', LEVEL_NOTE, 5),
  course('ielts-pre', '雅思预备 Pre-IELTS', 1140, '6节一对一（口语、写作、阅读）+ 2节1:8听力课', '雅思基础较弱、想先打基础的学生', '打基础的课程，不含免费官方考试。', 6),
  course('ielts-regular', '雅思常规 IELTS（目标5.5–7.0分）', 1260, EXAM_LINE, '准备参加雅思考试的学生', '报名12周以上送1次官方雅思考试；符合条件可报保分班，见下方说明。', 7),
  course('toefl-pre', '托福预备 Pre-TOEFL', 1140, '4节一对一 + 2节1:4小组课 + 2节1:8团体课', '托福基础较弱、想先打基础的学生', '打基础的课程，不含免费官方考试。', 8),
  course('toefl-regular', '托福常规 TOEFL（目标3.5–5.0分）', 1260, EXAM_LINE, '准备参加托福考试的学生', '报名12周以上送1次官方托福考试；符合条件可报保分班，见下方说明。', 9),
  course('toeic-pre', '托业预备 Pre-TOEIC', 1080, TOEIC_LINE, '托业基础较弱的学生', '打基础的课程。', 10),
  course('toeic-regular', '托业常规 TOEIC（目标600–900分）', 1140, TOEIC_LINE, '准备参加托业考试的学生', '托业保分班目前暂停。', 11),
  course('business', '商务英语 Business', 1660, '8节一对一（口语、写作、阅读、听力各2节）+ 2节特别课', '工作中需要用英语沟通的学生', '全部正课都是一对一。', 12),
  course('esl-junior', 'ESL Junior 青少年综合英语', 840, '课程安排报名时向学校确认', '青少年学生', JUNIOR_NOTE, 13),
  course('esl-junior-2', 'ESL Junior 2 青少年综合英语加强', 1140, '课程安排报名时向学校确认', '想多上一对一的青少年学生', JUNIOR_NOTE, 14),
  course('children', '亲子课程·孩子（Family Program 5–12岁／Busy Bee 2–4岁）', 1540, '6节正课 + 下午活动课（讲故事、游泳、跳舞、烹饪、美术）+ 晚上1:4词汇课', '和家长一起来的2–12岁孩子', '须有一位监护人陪读并上课，家长可报家长课程。', 15),
  course('guardian', '亲子课程·家长 Parents', 840, '6节正课 + 4节特别课；早晚斯巴达课自愿参加', '陪孩子来、自己也想学英语的家长', '和孩子一起报名。', 16),
];

const DORM_NOTE = '校内宿舍：3楼男生，4楼女生和家庭，5楼女生。';
const HOTEL_NOTE = '学校合作酒店，步行约3分钟到学校；门禁23:00；房间没有冰箱，有Wi-Fi；不享受思达启航折扣。';

const createRooms = (): CiaRoomContent[] => [
  room('campus-single', '校内单人间', 'S-1', '校内宿舍', '校内', 1180, '两间独立卧室共用客厅、小厨房和两个卫生间。', 0),
  room('campus-twin', '校内双人间', 'D-2', '校内宿舍', '校内', 1020, '两张床，中间书架隔开，房内有卫生间。', 1),
  room('campus-triple', '校内三人间', 'D-3', '校内宿舍', '校内', 880, '三张床，书架隔开，房内有卫生间。', 2),
  room('campus-quad', '校内四人间', 'D-4', '校内宿舍', '校内', 780, '两个区域各两张床，共用卫生间。', 3),
  room('campus-five', '校内五人间', 'D-5', '校内宿舍', '校内', 720, '五人一间，费用最低。', 4),
  room('hotel-single', '合作酒店单人间', 'H-1', '校外合作酒店', '校外', 1420, '单人床。', 5),
  room('hotel-twin', '合作酒店双人间', 'H-2', '校外合作酒店', '校外', 1260, '标准间，两张床。', 6),
  room('hotel-triple', '合作酒店三人间', 'H-3', '校外合作酒店', '校外', 1120, '一张大床和一张单人床。', 7),
  room('hotel-quad', '合作酒店四人间', 'H-4', '校外合作酒店', '校外', 1020, '仅S Hotel有四人间。', 8),
];

const UTILITIES_NOTE = '住校内宿舍每4周收取，不足4周按4周预估；住合作酒店改收管理费。';
const HOTEL_MANAGEMENT_NOTE = '住合作酒店每4周收取，不足4周按4周预估；住酒店不收设施使用费和水电费。';
const TEXTBOOK_NOTE = '每套约用4–6周，按学习进度购买；同类课程先计1套，后续按实际购买另付。';

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'visa-extension', name: '签证续签', amount: 5130, rates: [5130, 6400, 4430], tourist59Rates: [6400, 4430], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '30天签证依次5,130／6,400／4,430比索，之后每次4,430；59天签证暂按6,400比索起预估；以实际办理为准。', sortOrder: 0 }),
  fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取；学习超过6个月续期时须再缴一次。', sortOrder: 1 }),
  fee({ id: 'ssp-i-card', name: 'SSP I-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP一起办理，只收一次。', sortOrder: 2 }),
  fee({ id: 'visa-i-card', name: 'VISA I-CARD', amount: 4500, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次签证续签时办理一次（30天签证第5周起，59天签证第9周起）。', sortOrder: 3 }),
  fee({ id: 'arp', name: 'ARP外国人登记', amount: 300, billingRule: 'long-term-or-first-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '59天签证入境、需要续签时办理一次。', sortOrder: 4 }),
  fee({ id: 'utilities', name: '设施使用费', amount: 3000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: UTILITIES_NOTE, sortOrder: 5 }),
  fee({ id: 'water-electricity', name: '水电费', amount: 2400, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '校内宿舍每4周收取，超出用量另付；住合作酒店不收水电费。', sortOrder: 6 }),
  fee({ id: 'hotel-management', name: '管理费（合作酒店）', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: HOTEL_MANAGEMENT_NOTE, sortOrder: 7 }),
  fee({ id: 'book-esl', name: '教材费 · 综合英语', amount: 700, billingRule: 'once', includeInTotal: true, note: TEXTBOOK_NOTE, sortOrder: 8 }),
  fee({ id: 'book-speaking', name: '教材费 · 口语强化', amount: 1500, billingRule: 'once', includeInTotal: true, note: TEXTBOOK_NOTE, sortOrder: 9 }),
  fee({ id: 'book-ielts', name: '教材费 · 雅思', amount: 2500, billingRule: 'once', includeInTotal: true, note: TEXTBOOK_NOTE, sortOrder: 10 }),
  fee({ id: 'book-toefl', name: '教材费 · 托福', amount: 1500, billingRule: 'once', includeInTotal: true, note: TEXTBOOK_NOTE, sortOrder: 11 }),
  fee({ id: 'book-toeic', name: '教材费 · 托业', amount: 1300, billingRule: 'once', includeInTotal: true, note: TEXTBOOK_NOTE, sortOrder: 12 }),
  fee({ id: 'book-business', name: '教材费 · 商务英语', amount: 400, billingRule: 'once', includeInTotal: true, note: TEXTBOOK_NOTE, sortOrder: 13 }),
  fee({ id: 'book-family', name: '教材费 · 亲子课程', amount: 2500, billingRule: 'once', includeInTotal: true, note: TEXTBOOK_NOTE, sortOrder: 14 }),
  fee({ id: 'pickup', name: '宿务机场接机', amount: 1200, billingRule: 'optional', includeInTotal: false, note: '学校接机，每人计费；也可以自己打车到校。', sortOrder: 15 }),
  fee({ id: 'deposit', name: '押金（可退）', amount: 2000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '含房间押金1,500、钥匙300、电子钱包卡200比索；无损坏、无欠费时退还。', sortOrder: 16 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({ id: SMEAG_SIDA_RULE_ID, name: '思达启航折扣', description: '课程费和校内住宿费享9折，合作酒店住宿不打折', sortOrder: 0, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', eligibleRoomIds: [...SMEAG_CAMPUS_ROOM_IDS], coverageTarget: 'none' }),
  promotion({ id: 'smeag-low-season', name: '2026下半年淡季优惠', description: '2026/08/23–2027/01/01期间每个学习周减25美元；到校后延期不适用', sortOrder: 1, arrivalStart: '2026-08-23', coverageStart: '2026-08-23', coverageEnd: '2027-01-02' }),
  promotion({ id: 'smeag-christmas-2026', name: '2026圣诞优惠', description: '学习至少4周、就读期间涉及12/20–1/2，减100美元；到校后延期不适用', sortOrder: 2, discountType: 'fixed', discountValue: 100, minimumCourseWeeks: 4, arrivalStart: '2026-08-23', coverageStart: '2026-12-20', coverageEnd: '2027-01-02' }),
  promotion({ id: 'smeag-low-season-2027-h1', name: '2027上半年淡季优惠', description: '2027/03/01起入学，03/01–06/25期间每个学习周减25美元；到校后延期不适用', sortOrder: 3, arrivalStart: '2027-02-28', coverageStart: '2027-02-28', coverageEnd: '2027-06-26' }),
  promotion({ id: SMEAG_RETURNING_RULE_ID, name: '老学员返校', description: '老学员返校免收一次性注册费。', sortOrder: 4, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, coverageTarget: 'none' }),
];

const HOTEL_FEE_NOTE = '合作酒店房费不打折；住酒店不收水电费，另收管理费每4周2,000比索。';
const LOCAL_FEE_INTRO = '以下费用由学校及移民局收取，到校后用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留时间预估；校内宿舍每4周收取设施使用费和水电费，住合作酒店只收管理费；教材按课程类别各计1套。请准备1张2×2英寸（5.08厘米）照片和1张护照照片；读满24周离境前办理ECC，需4张2×2照片。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultSmeagContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'SMEAG',
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.45, '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'SMEAG Capital 4周课程费',
    courseTableNote: '以下为周一至周五的每日课程安排，课程费按4周计算；1–3周按4周价的45%、65%、85%计算。',
    groupClassNote: '小组课为1:4，团体课为1:8；每节课45分钟。',
    roomTableTitle: 'SMEAG Capital 4周住宿费',
    roomTableNote: `${DORM_NOTE}${HOTEL_FEE_NOTE}`,
    stayPolicyTitle: 'SMEAG Capital 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '课程结束后的周六13:00前', note: '延住须提前向学校申请。' },
      { label: '合作酒店', value: '步行约3分钟到学校', note: HOTEL_NOTE },
    ],
    extraNightRates: [],
    smeagPolicyVersion: SMEAG_POLICY_VERSION,
  } as SmeagQuoteSettings,
  quoteImageSettings: {
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
    footerNotes: ['到校费用、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠确认为准。'],
  },
  media: [],
});

/** Course names saved before version 1, so only untouched rows are renamed (rows keep their ids). */
const OLD_COURSE_NAMES: Record<string, string> = {
  'esl-regular-ket-pet-fce': 'ESL常规（KET/PET/FCE）', 'esl-cae': 'ESL（CAE）',
  'speaking-master-ket-pet-fce': 'ESL / Speaking Master（KET/PET/FCE）', 'speaking-master-cae': 'ESL / Speaking Master（CAE）',
  'esl-junior-2': 'ESL Junior 2', business: 'Business', 'esl-junior': 'ESL Junior', children: '儿童课程', guardian: '监护人课程',
};
/** Rows the 2026-11-23 pack replaced: the combined TOEFL/IELTS rows and the suspended TOEIC guarantee. */
const REPLACED_COURSE_IDS: Record<string, string[]> = {
  'toefl-ielts-pre': ['ielts-pre', 'toefl-pre'],
  'toefl-ielts-regular-guarantee': ['ielts-regular', 'toefl-regular'],
  'toeic-regular-guarantee': ['toeic-regular'],
};
const OLD_ROOM_NOTES = new Set(['数量有限，热门档期需尽早确认。', '适合同伴同行或希望减少室友人数。', '预算与生活空间比较平衡。', '默认报价参考房型。', '校内住宿中预算最低。', '学校合作的校外酒店；校外住宿无折扣。']);
/** Version 1 text that version 2 replaces when nobody has edited it since. */
const V1_COPY = {
  utilitiesNote: '每4周收取，不足4周按4周预估。',
  localFeeIntro: '以下费用由学校及移民局收取，到校后用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留时间预估；设施使用费和水电费每4周收取，住合作酒店不收水电费；教材按课程类别各计1套。请准备1张2×2英寸（5.08厘米）照片和1张护照照片；读满24周离境前办理ECC，需4张2×2照片。',
  roomTableNote: `${DORM_NOTE}合作酒店房费不打折，住酒店不收水电费。`,
};
const OLD_IMAGE_COPY = {
  paymentNotes: { course: '按所选课程、周数及日期计算', accommodation: '按所选房型、周数及日期计算', promotion: '优惠按当前有效规则自动计算' } as Record<string, string>,
  alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
  footerNote: '课程、住宿和优惠按当前选择及有效规则计算。',
  localFeeIntro: '学杂费由学校及相关部门到校收取；页面按当前选择预估，最终以学校现场实收为准。',
};

/** Brings a saved document up to SMEAG_POLICY_VERSION, one step at a time; true when anything ran. */
function upgradeSmeagPolicy(clone: CiaContentConfig, defaults: CiaContentConfig): boolean {
  const settings = clone.quoteSettings as SmeagQuoteSettings;
  const version = settings.smeagPolicyVersion ?? 0;
  if (version >= SMEAG_POLICY_VERSION) return false;
  if (version < 1) upgradeToSchoolPack(clone, defaults);
  if (version < 2) upgradeHotelFees(clone, defaults);
  settings.smeagPolicyVersion = SMEAG_POLICY_VERSION;
  return true;
}

/**
 * Version 1: brings a document saved before the 2026-11-23 pack onto it. Untouched course and room text is
 * replaced, the combined TOEFL/IELTS rows become separate rows at the saved price, local-fee rules keep their
 * saved amounts, and the price-table titles and notes take the new defaults.
 */
function upgradeToSchoolPack(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as SmeagQuoteSettings;
  const defaultCourses = new Map(defaults.courses.map(item => [item.id, item]));
  const courses: CiaCourseContent[] = [];
  for (const item of clone.courses ?? []) {
    const replacements = REPLACED_COURSE_IDS[item.id];
    if (replacements) {
      for (const id of replacements) {
        const fresh = copyJson(defaultCourses.get(id)!);
        if (item.tuition > 0) Object.assign(fresh, { tuition: item.tuition, tuition2027: item.tuition2027 || item.tuition });
        courses.push(fresh);
      }
      continue;
    }
    const fresh = defaultCourses.get(item.id);
    if (fresh && item.name === OLD_COURSE_NAMES[item.id]) {
      Object.assign(item, { name: fresh.name, schedule: fresh.schedule, suitable: fresh.suitable, note: fresh.note });
    }
    courses.push(item);
  }
  for (const fresh of defaults.courses) {
    if (!courses.some(item => item.id === fresh.id)) courses.push(copyJson(fresh));
  }
  const order = (item: CiaCourseContent) => defaultCourses.get(item.id)?.sortOrder ?? item.sortOrder;
  clone.courses = courses.sort((a, b) => order(a) - order(b));
  const defaultRooms = new Map(defaults.rooms.map(item => [item.id, item]));
  for (const item of clone.rooms ?? []) {
    const fresh = defaultRooms.get(item.id);
    if (fresh && OLD_ROOM_NOTES.has(item.note)) Object.assign(item, { name: fresh.name, label: fresh.label, group: fresh.group, note: fresh.note });
  }
  const defaultFees = new Map(defaults.localFees.map(item => [item.id, item]));
  // Textbooks now count in the local-fee total; the visa rules gained the 59-day sequence and clearer notes.
  clone.localFees = (clone.localFees ?? []).map(rule => {
    const fresh = defaultFees.get(rule.id);
    return fresh ? { ...copyJson(fresh), amount: rule.amount, enabled: rule.enabled } : rule;
  });
  const replacedRules = ['smeag-low-season', SMEAG_SIDA_RULE_ID];
  settings.promotions = [
    ...settings.promotions.filter(rule => !replacedRules.includes(rule.id)),
    ...defaults.quoteSettings.promotions.filter(rule => replacedRules.includes(rule.id)).map(copyJson),
  ];
  for (const rule of defaults.quoteSettings.promotions) {
    if (!settings.promotions.some(item => item.id === rule.id)) settings.promotions.push(copyJson(rule));
  }
  settings.promotions.sort((a, b) => a.sortOrder - b.sortOrder);
  for (const key of ['localFeeIntro', 'courseTableTitle', 'courseTableNote', 'groupClassNote', 'roomTableTitle', 'roomTableNote', 'stayPolicyTitle'] as const) {
    settings[key] = defaults.quoteSettings[key];
  }
  settings.stayPolicies = copyJson(defaults.quoteSettings.stayPolicies);
}

/**
 * Version 2: adds the partner-hotel management fee and moves untouched version-1 notes onto the new wording.
 * Saved amounts and edited text stay.
 */
function upgradeHotelFees(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings;
  const defaultFees = new Map(defaults.localFees.map(item => [item.id, item]));
  const hotelFee = defaultFees.get('hotel-management');
  if (hotelFee && !clone.localFees.some(item => item.id === hotelFee.id)) clone.localFees.push(copyJson(hotelFee));
  for (const rule of clone.localFees) {
    const fresh = defaultFees.get(rule.id);
    if (!fresh) continue;
    rule.sortOrder = fresh.sortOrder;
    if (rule.id === 'utilities' && rule.note === V1_COPY.utilitiesNote) rule.note = fresh.note;
  }
  clone.localFees.sort((a, b) => a.sortOrder - b.sortOrder);
  if (settings.localFeeIntro === V1_COPY.localFeeIntro) settings.localFeeIntro = defaults.quoteSettings.localFeeIntro;
  if (settings.roomTableNote === V1_COPY.roomTableNote) settings.roomTableNote = defaults.quoteSettings.roomTableNote;
}

/** Replaces only image lines nobody has edited since they were the defaults. */
function upgradeSmeagImageCopy(settings: CiaContentConfig['quoteImageSettings']): void {
  const notes = settings.paymentNotes as unknown as Record<string, string>;
  for (const [key, old] of Object.entries(OLD_IMAGE_COPY.paymentNotes)) {
    if (notes[key] === old) notes[key] = '';
  }
  if (settings.alumniBenefitText === OLD_IMAGE_COPY.alumniBenefitText) settings.alumniBenefitText = ALUMNI_BENEFIT_TEXT;
  settings.footerNotes = settings.footerNotes.filter(note => note !== OLD_IMAGE_COPY.footerNote);
  if (settings.localFeeIntro === OLD_IMAGE_COPY.localFeeIntro || settings.localFeeIntro === V1_COPY.localFeeIntro) {
    settings.localFeeIntro = LOCAL_FEE_INTRO;
  }
}

/** A SMEAG Capital content document (default or published revision). */
export function isSmeagContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === 'SMEAG'
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

export const cloneSmeagContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultSmeagContentConfig();
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  const upgraded = upgradeSmeagPolicy(clone, defaults);
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  clone.quoteImageSettings.footerNotes = clone.quoteImageSettings.footerNotes.map(note => note.replace(/思达游学/g, '思达启航'));
  if (upgraded) upgradeSmeagImageCopy(clone.quoteImageSettings);
  // VISA I-CARD (ACR) moved to the first visa extension (user rule 2026-11-24); untouched old notes follow once.
  upgradeAcrNotes(clone, defaults, { 'visa-i-card': ['在菲停留60天及以上（第9周起）办理一次。'] });
  clone.media ??= [];
  return clone;
};
