// GLC (Global Language Cebu) versioned employee content document: courses, rooms, local fees, offers and quote-image
// copy. The public page (glc-school-page.component.ts), its calculator (glc-page-quote.ts), the local-fee table and
// the quote image all read the published version of this document. Keep it pure data (no Angular, DOM or storage).
// Sources: GLC's 2026-11 school pack (2027 price list, 2027 winter/summer notice, Chinese brochure, orientation,
// 2025 school rules, new-student guide); see docs/glc-update-2026-11-25.md. Prices are stored per 4 weeks
// (the school lists them per week; 4-week price = weekly price × 4).
import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Raised when saved documents must inherit a school notice once (cloneGlcContentConfig):
 * 1 = the 2026-11 school pack: 4-week prices instead of weekly ones, the 2027 price list (TOEIC courses, the main
 *     quad room and the partner hotel), the 2027 local fees, pickup paid with the school fees, the winter and summer
 *     2027 rules (no offers in those weeks) and the move onto the shared Philippine school template.
 */
export const GLC_POLICY_VERSION = 1;
type GlcQuoteSettings = CiaQuoteSettings & { glcPolicyVersion?: number };

export const GLC_SIDA_RULE_ID = 'glc-sida';
export const GLC_RETURNING_RULE_ID = 'glc-returning-registration';
export const GLC_REGISTRATION_PICKUP_RULE_ID = 'glc-registration-pickup';
export const GLC_SCHOOL_WINDOW_PREFIX = 'glc-school-window-';

/** 2027 winter and summer (school notice): adults 18+ and limited family places only, no offers, no surcharge. */
export const GLC_PEAK_SEASONS: ReadonlyArray<{ start: string; end: string; label: string; minimumWeeks: number }> = [
  { start: '2027-01-03', end: '2027-02-27', label: '2027寒假', minimumWeeks: 0 },
  { start: '2027-07-04', end: '2027-08-28', label: '2027暑假', minimumWeeks: 4 },
];

export type GlcCourseKind = 'adult' | 'family' | 'kids' | 'junior';
export type GlcTextbookType = 'esl' | 'ielts' | 'toeic' | 'business';

/** Facts the quote needs about each course; ids are stable, names and prices come from the document. */
export interface GlcCourseFacts {
  kind: GlcCourseKind;
  /** Youngest age on the entry date (Business 18; ESL and exam courses 15). */
  minimumAge?: number;
  /** Sparta courses: only the Annex2 single or twin room. */
  sparta?: boolean;
  /** Family package: number of family members sharing the package and one room. */
  familySize?: number;
  textbook: GlcTextbookType;
}

export const GLC_COURSE_FACTS: Readonly<Record<string, GlcCourseFacts>> = {
  'light-power-speaking': { kind: 'adult', minimumAge: 15, textbook: 'esl' },
  'power-speaking': { kind: 'adult', minimumAge: 15, textbook: 'esl' },
  'intensive-power-speaking': { kind: 'adult', minimumAge: 15, textbook: 'esl' },
  'ultra7-power-speaking': { kind: 'adult', minimumAge: 15, textbook: 'esl' },
  'ultra-sparta-esl': { kind: 'adult', minimumAge: 15, sparta: true, textbook: 'esl' },
  'family-package-2': { kind: 'family', familySize: 2, textbook: 'esl' },
  'family-package-3': { kind: 'family', familySize: 3, textbook: 'esl' },
  'family-package-4': { kind: 'family', familySize: 4, textbook: 'esl' },
  'kids-english-6': { kind: 'kids', textbook: 'esl' },
  'kids-english-7': { kind: 'kids', textbook: 'esl' },
  'kids-english-8': { kind: 'kids', textbook: 'esl' },
  'junior-power-speaking-6': { kind: 'junior', textbook: 'esl' },
  'junior-power-speaking-7': { kind: 'junior', textbook: 'esl' },
  'junior-power-speaking-8': { kind: 'junior', textbook: 'esl' },
  'general-ielts': { kind: 'adult', minimumAge: 15, textbook: 'ielts' },
  'intensive-ielts': { kind: 'adult', minimumAge: 15, textbook: 'ielts' },
  'ultra8-ielts': { kind: 'adult', minimumAge: 15, textbook: 'ielts' },
  'ultra-ielts-sparta': { kind: 'adult', minimumAge: 15, sparta: true, textbook: 'ielts' },
  'general-toeic': { kind: 'adult', minimumAge: 15, textbook: 'toeic' },
  'intensive-toeic': { kind: 'adult', minimumAge: 15, textbook: 'toeic' },
  'ultra8-toeic': { kind: 'adult', minimumAge: 15, textbook: 'toeic' },
  'ultra-toeic-sparta': { kind: 'adult', minimumAge: 15, sparta: true, textbook: 'toeic' },
  'business-course': { kind: 'adult', minimumAge: 18, textbook: 'business' },
  'ultra7-business': { kind: 'adult', minimumAge: 18, textbook: 'business' },
};

export const glcCourseFacts = (courseId: string): GlcCourseFacts =>
  GLC_COURSE_FACTS[courseId] ?? { kind: 'adult', minimumAge: 15, textbook: 'esl' };

/** Sparta students live in Annex2 single or twin rooms only. */
export const GLC_SPARTA_ROOM_IDS: readonly string[] = ['annex-single', 'annex-double'];
export const GLC_HOTEL_ROOM_IDS: readonly string[] = ['hotel-twin', 'hotel-single'];
/** A family shares one room: twin rooms for two, the main triple for three and the main quad for four. */
export const GLC_FAMILY_ROOM_IDS: Readonly<Record<number, readonly string[]>> = {
  2: ['main-double', 'annex-double', 'hotel-twin'],
  3: ['main-triple'],
  4: ['main-quad'],
};
/** Unaccompanied 12–14-year-olds pay the guardian fee and stay in a triple room (price list). */
export const GLC_GUARDIAN_ROOM_ID = 'main-triple';
export const GLC_GUARDIAN_FEE_PER_WEEK = 150;
/** 1–3-week stays pay a short-term extra charge per week (price list). */
export const GLC_SHORT_STAY_FEE_PER_WEEK = 60;

/** Airport pickup, paid in dollars with the school fees (price list: Payment in your country). */
export const GLC_PICKUP_OPTIONS: ReadonlyArray<{ value: string; label: string; amount: number; sunday: boolean; roundTrip: boolean }> = [
  { value: 'sunday-one-way', label: '周日接机（单程35美元）', amount: 35, sunday: true, roundTrip: false },
  { value: 'sunday-round-trip', label: '周日接机＋周六送机（往返70美元）', amount: 70, sunday: true, roundTrip: true },
  { value: 'weekday-one-way', label: '周一至周六接机（单程55美元）', amount: 55, sunday: false, roundTrip: false },
  { value: 'weekday-round-trip', label: '周一至周六接送机（往返110美元）', amount: 110, sunday: false, roundTrip: true },
  { value: 'none', label: '不需要接机', amount: 0, sunday: false, roundTrip: false },
];
/** The free pickup offers cover one Sunday one-way pickup. */
export const GLC_FREE_PICKUP_AMOUNT = 35;

/** Courses the school's annual offer covers: every adult course except Light Power Speaking. */
export const GLC_SCHOOL_OFFER_COURSE_IDS: readonly string[] = Object.entries(GLC_COURSE_FACTS)
  .filter(([id, facts]) => facts.kind === 'adult' && id !== 'light-power-speaking')
  .map(([id]) => id);

const course = (
  id: string, name: string, weekly: number, schedule: string, suitable: string, note: string, sortOrder: number,
): CiaCourseContent => ({
  id, name, tuition: weekly * 4, tuition2027: weekly * 4, schedule, suitable, note, enabled: true, sortOrder,
});

const room = (
  id: string, name: string, group: string, location: '校内' | '校外', weekly: number, note: string, sortOrder: number,
): CiaRoomContent => ({ id, name, label: name, code: id, location, group, fee: weekly * 4, note, enabled: true, sortOrder });

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: (value.sortOrder + 1) * 10,
  stackable: true,
  newStudentsOnly: false,
  discountType: 'fixed',
  discountValue: 0,
  appliesTo: 'tuition',
  waiveRegistration: false,
  minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'none',
  ...value,
});

// Class lines from the 2027 price list and the Chinese brochure (每节50分钟).
const ELECTIVES = '免费选修课';
const EXAM_ONLINE = '线上模考与讲评 + 线上自学';
const LEVEL_ESL = '从入门（Level 1）到高级（Level 12）都可报，入学测试后分级。';
const IELTS_NOTE = '学术类（Academic）雅思；入学须4级（约雅思3.0）至10级（约雅思6.5），用 Global Exam 线上题库备考。';
const TOEIC_NOTE = '入学须4级（约托业400分）至10级（约托业850分），用 Global Exam 线上题库备考。';
const SPARTA_NOTE = '斯巴达管理：周一至周五不能外出，每天单词测验和自习必须参加，周六上午上课；只能住副楼 Annex2 单人间或双人间。';
const FAMILY_NOTE = '全家就读日期相同、同住一间房；只限 ESL；家长可以不上课；未满15岁的孩子只上一对一课。';
const KIDS_NOTE = '一对一课程，用影片、歌曲等互动方式上课；部分儿童课程使用纸本教材。';

const createCourses = (): CiaCourseContent[] => [
  course('light-power-speaking', '轻量口语 Light Power Speaking', 165, `一对一3节 + 团体课2节 + ${ELECTIVES}（只在下午和晚上上课）`, '15岁以上；想课量轻一些、上午自由安排的学生', `以口语和日常沟通为主。${LEVEL_ESL}不参加学校年度优惠。`, 0),
  course('power-speaking', '标准口语 Power Speaking', 215, `一对一4节 + 团体课2节 + ${ELECTIVES}`, '15岁以上；想全面提高口语和日常沟通的学生', `以口语和日常沟通为主。${LEVEL_ESL}`, 1),
  course('intensive-power-speaking', '强化口语 Intensive Power Speaking', 270, `一对一5节 + 团体课2节 + ${ELECTIVES}`, '15岁以上；想多上一对一的学生', `以口语和日常沟通为主。${LEVEL_ESL}`, 2),
  course('ultra7-power-speaking', '高强度口语7 Ultra7 Power Speaking', 375, `一对一7节 + 团体课1节 + ${ELECTIVES}`, '15岁以上；想短时间集中练口语的学生', `以口语和日常沟通为主。${LEVEL_ESL}`, 3),
  course('ultra-sparta-esl', '斯巴达英语 Ultra Sparta ESL', 280, '一对一5节 + 团体课3节 + 晚间团体课2节 + 单词与写作测验 + 自习1节 + 周六上午课程', '15岁以上；需要严格管理、自律性不强的学生', `${SPARTA_NOTE}${LEVEL_ESL}`, 4),
  course('family-package-2', '亲子套餐2人 Family Package 2', 410, '一对一8节（家长和孩子分着上）+ 团体课2节 + 免费选修课', '一位家长带一个5–14岁孩子', `价格为全家合用的课程费；住宿、注册费和学杂费按人数另计。${FAMILY_NOTE}`, 5),
  course('family-package-3', '亲子套餐3人 Family Package 3', 590, '一对一12节（家人分着上）+ 团体课2节 + 免费选修课', '三人家庭，同住主楼三人间', `价格为全家合用的课程费；住宿、注册费和学杂费按人数另计。${FAMILY_NOTE}`, 6),
  course('family-package-4', '亲子套餐4人 Family Package 4', 775, '一对一16节（家人分着上）+ 团体课2节 + 免费选修课', '四人家庭，同住主楼四人间', `价格为全家合用的课程费；住宿、注册费和学杂费按人数另计。${FAMILY_NOTE}`, 7),
  course('kids-english-6', '儿童英语6 Kids English 6', 335, '一对一6节', '5–11岁儿童', KIDS_NOTE, 8),
  course('kids-english-7', '儿童英语7 Kids English 7', 400, '一对一7节', '5–11岁儿童', KIDS_NOTE, 9),
  course('kids-english-8', '儿童英语8 Kids English 8', 465, '一对一8节', '5–11岁儿童', KIDS_NOTE, 10),
  course('junior-power-speaking-6', '青少年口语6 Junior Power Speaking 6', 325, '一对一6节', '12–14岁青少年', KIDS_NOTE, 11),
  course('junior-power-speaking-7', '青少年口语7 Junior Power Speaking 7', 375, '一对一7节', '12–14岁青少年', KIDS_NOTE, 12),
  course('junior-power-speaking-8', '青少年口语8 Junior Power Speaking 8', 430, '一对一8节', '12–14岁青少年', KIDS_NOTE, 13),
  course('general-ielts', '标准雅思 General IELTS', 240, `雅思一对一4节 + 团体课2节（ESL）+ ${ELECTIVES} + ${EXAM_ONLINE}`, '15岁以上；准备雅思考试的学生', IELTS_NOTE, 14),
  course('intensive-ielts', '强化雅思 Intensive IELTS', 300, `雅思一对一5节 + 团体课2节（ESL）+ ${ELECTIVES} + ${EXAM_ONLINE}`, '15岁以上；想多上一对一的雅思考生', IELTS_NOTE, 15),
  course('ultra8-ielts', '高强度雅思8 Ultra8 IELTS', 430, `雅思一对一8节 + ${ELECTIVES} + ${EXAM_ONLINE}`, '15岁以上；想全部上一对一的雅思考生', IELTS_NOTE, 16),
  course('ultra-ielts-sparta', '斯巴达雅思 Ultra Sparta IELTS', 355, '雅思一对一5节 + 雅思团体课3节 + 晚间团体课2节 + 单词与写作测验 + 自习1节 + 周六上午模考', '15岁以上；需要严格管理的雅思考生', `${SPARTA_NOTE}${IELTS_NOTE}`, 17),
  course('general-toeic', '标准托业 General TOEIC', 240, `托业一对一4节 + 团体课2节（ESL）+ ${ELECTIVES} + ${EXAM_ONLINE}`, '15岁以上；准备托业考试的学生', TOEIC_NOTE, 18),
  course('intensive-toeic', '强化托业 Intensive TOEIC', 300, `托业一对一5节 + 团体课2节（ESL）+ ${ELECTIVES} + ${EXAM_ONLINE}`, '15岁以上；想多上一对一的托业考生', TOEIC_NOTE, 19),
  course('ultra8-toeic', '高强度托业8 Ultra8 TOEIC', 430, `托业一对一8节 + ${ELECTIVES} + ${EXAM_ONLINE}`, '15岁以上；想全部上一对一的托业考生', TOEIC_NOTE, 20),
  course('ultra-toeic-sparta', '斯巴达托业 Ultra Sparta TOEIC', 355, '托业一对一5节 + 托业团体课3节 + 晚间团体课2节 + 单词与写作测验 + 自习1节 + 周六上午模考', '15岁以上；需要严格管理的托业考生', `${SPARTA_NOTE}${TOEIC_NOTE}`, 21),
  course('business-course', '商务英语 Business English', 300, `一对一4节 + 团体课2节（ESL）+ ${ELECTIVES}`, '18岁以上；工作中要用英语或计划海外就业的学生', '学习会议、市场营销等商务场景的正确表达；入学须5级（A2）至12级（C2）。', 22),
  course('ultra7-business', '高强度商务7 Ultra7 Business', 465, `一对一7节 + 团体课1节（ESL）+ ${ELECTIVES}`, '18岁以上；想集中练商务英语的学生', '学习会议、市场营销等商务场景的正确表达；入学须5级（A2）至12级（C2）。', 23),
];

const MAIN_GROUP = '主楼宿舍';
const ANNEX_GROUP = '副楼 Annex2 宿舍';
const HOTEL_GROUP = '校外合作酒店';
const DORM_NOTE = '房内有空调、电扇、热水淋浴、卫生间、小冰箱、烧水壶和Wi-Fi。';

const createRooms = (): CiaRoomContent[] => [
  room('main-deluxe-single', '主楼豪华单人间', MAIN_GROUP, '校内', 645, `空间更大的单人间。${DORM_NOTE}`, 0),
  room('main-single', '主楼单人间', MAIN_GROUP, '校内', 385, DORM_NOTE, 1),
  room('main-double', '主楼双人间', MAIN_GROUP, '校内', 270, DORM_NOTE, 2),
  room('main-triple', '主楼三人间', MAIN_GROUP, '校内', 220, DORM_NOTE, 3),
  room('main-quad', '主楼四人间', MAIN_GROUP, '校内', 215, `上下铺。${DORM_NOTE}`, 4),
  room('annex-single', '副楼单人间', ANNEX_GROUP, '校内', 360, `斯巴达课程学生只能住副楼。${DORM_NOTE}`, 5),
  room('annex-double', '副楼双人间', ANNEX_GROUP, '校内', 250, `斯巴达课程学生只能住副楼。${DORM_NOTE}`, 6),
  room('hotel-single', '合作酒店单人间', HOTEL_GROUP, '校外', 590, '学校合作的校外酒店；具体酒店报名时向学校确认。', 7),
  room('hotel-twin', '合作酒店双人间', HOTEL_GROUP, '校外', 430, '学校合作的校外酒店；具体酒店报名时向学校确认。', 8),
];

const BOOK_ESL_NOTE = 'ESL为线上教材（平板或笔记本电脑使用）：1–8周3,000、9–16周5,000、17–24周7,000比索，之后每4周加1,000；中途升级不另收。';
const BOOK_EXAM_NOTE = '1–4周5,000、5–12周7,500、13–24周10,000、25–48周15,000比索；雅思、托业和商务英语按各自周数分别计算。';

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'visa-extension', name: '签证续签', amount: 4670, rates: [4670, 5740, 3970], tourist59Rates: [5740, 3970], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '30天签证第5–8周4,670比索，第9–12周5,740比索，之后每4周3,970比索；59天签证第9周起5,740比索，之后每4周3,970比索；以实际办理为准。', sortOrder: 0 }),
  fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 8000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取，入学时办理；续读或换校须重新办理。', sortOrder: 1 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP一起办理，只收一次。', sortOrder: 2 }),
  fee({ id: 'acr-i-card', name: 'ACR I-CARD外国人身份证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '第一次签证续签时办理一次（30天签证第5周起，59天签证第9周起）。', sortOrder: 3 }),
  fee({ id: 'management', name: '管理费', amount: 6000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '含学生证、三餐、洗衣和打扫等；每4周6,000比索（4周以上按每周1,500计），1–3周分别3,000／4,000／5,000比索。', sortOrder: 4 }),
  fee({ id: 'electricity', name: '水电费（宿舍）', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'ceil', includeInTotal: true, note: '住宿舍每周500比索，另按房间电表每度20比索结算；住合作酒店不收。', sortOrder: 5 }),
  fee({ id: 'books-esl', name: '教材费 · 英语课程', amount: 3000, billingRule: 'per-course-period', periodWeeks: 8, rounding: 'ceil', includeInTotal: true, note: BOOK_ESL_NOTE, sortOrder: 6 }),
  fee({ id: 'books-exam', name: '教材费 · 雅思／托业／商务', amount: 5000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: BOOK_EXAM_NOTE, sortOrder: 7 }),
  fee({ id: 'deposit', name: '押金（可退）', amount: 3000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '3,000比索或60美元，无损坏、无欠费时退房退还；住合作酒店不收。', sortOrder: 8 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: `${GLC_SCHOOL_WINDOW_PREFIX}1`, name: '学校年度优惠', sortOrder: 0,
    description: '就读期间在2026/06/01–2027/01/02，适用课程每满连续4周减150美元；轻量口语、亲子、儿童和青少年课程不适用；寒暑假学习周不计入。',
    discountValue: 150, minimumCourseWeeks: 4, incrementWeeks: 4, incrementValue: 150,
    eligibleCourseIds: [...GLC_SCHOOL_OFFER_COURSE_IDS], coverageStart: '2026-06-01', coverageEnd: '2027-01-02', coverageTarget: 'course',
  }),
  promotion({
    id: `${GLC_SCHOOL_WINDOW_PREFIX}2`, name: '学校年度优惠', sortOrder: 1,
    description: '就读期间在2027/02/28–2027/07/03，适用课程每满连续4周减150美元；轻量口语、亲子、儿童和青少年课程不适用。',
    discountValue: 150, minimumCourseWeeks: 4, incrementWeeks: 4, incrementValue: 150,
    eligibleCourseIds: [...GLC_SCHOOL_OFFER_COURSE_IDS], coverageStart: '2027-02-28', coverageEnd: '2027-07-03', coverageTarget: 'course',
  }),
  promotion({
    id: `${GLC_SCHOOL_WINDOW_PREFIX}3`, name: '学校年度优惠', sortOrder: 2,
    description: '就读期间在2027/08/29–2028/01/01，适用课程每满连续4周减150美元；轻量口语、亲子、儿童和青少年课程不适用。',
    discountValue: 150, minimumCourseWeeks: 4, incrementWeeks: 4, incrementValue: 150,
    eligibleCourseIds: [...GLC_SCHOOL_OFFER_COURSE_IDS], coverageStart: '2027-08-29', coverageEnd: '2028-01-01', coverageTarget: 'course',
  }),
  promotion({
    id: GLC_SIDA_RULE_ID, name: '思达启航专属优惠', sortOrder: 3,
    description: '课程每满连续4周减50美元，所有课程适用；寒暑假学习周不计入。',
    discountValue: 50, minimumCourseWeeks: 4, incrementWeeks: 4, incrementValue: 50,
  }),
  promotion({
    id: GLC_REGISTRATION_PICKUP_RULE_ID, name: '周日免费接机', sortOrder: 4,
    description: '2026/04/05–2027/01/02报名、课程满4周，或享受学校年度优惠的学生，送一次周日接机；寒暑假入学不送。',
    discountType: 'none', appliesTo: 'school-total', minimumCourseWeeks: 4,
    registrationStart: '2026-04-05', registrationEnd: '2027-01-02',
  }),
  promotion({
    id: GLC_RETURNING_RULE_ID, name: '老学员返校', sortOrder: 5,
    description: '老学员返校免收一次性注册费。',
    discountType: 'none', appliesTo: 'school-total', waiveRegistration: true,
  }),
];

const LOCAL_FEE_INTRO = '以下费用由学校及移民局收取，到校后用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证和停留时间预估；管理费和水电费按住宿周数计算；教材按课程类别分别计算。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultGlcContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'GLC',
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 120,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: {},
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'GLC 4周课程费',
    courseTableNote: '以下为周一至周五的每日课程，课程费按4周计算（学校按周报价，4周价＝每周价×4）；1–3周按周计算，另收每周60美元短期附加费。',
    groupClassNote: '每节课50分钟；未满15岁的学生不上团体课。',
    roomTableTitle: 'GLC 4周住宿费',
    roomTableNote: '以下为每人4周住宿费，含三餐；斯巴达课程学生只能住副楼 Annex2 单人间或双人间。',
    stayPolicyTitle: 'GLC 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日14:00以后', note: '课程每周一开课，课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '课程结束后的周六12:00前', note: '延迟退房另收房费；退房后可以把行李寄放在办公室旁。' },
      { label: '斯巴达课程', value: '只能住副楼', note: '斯巴达英语、斯巴达雅思和斯巴达托业的学生住副楼 Annex2 单人间或双人间。' },
    ],
    extraNightRates: [
      { label: '主楼豪华单人间', amount: 5500 },
      { label: '单人间', amount: 3000 },
      { label: '双人间', amount: 2550 },
      { label: '三人间', amount: 2300 },
      { label: '四人间', amount: 2000 },
      { label: '合作酒店单人间', amount: 3500 },
      { label: '合作酒店双人间', amount: 2800 },
    ],
    glcPolicyVersion: GLC_POLICY_VERSION,
  } as GlcQuoteSettings,
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

/** Image lines saved by the old GLC page that the template replaces when nobody has edited them. */
const OLD_IMAGE_COPY = {
  paymentNotes: {
    course: '按所选课程的每周价格、周数及日期计算。',
    accommodation: '按每位学生所选房型的每周价格、周数及日期计算。',
    promotion: '按当前有效日期、课程资格与连续周数自动计算。',
  } as Record<string, string>,
  alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
  footerNotes: [
    '学费需到校前2周交齐，可由思达启航代收或自行转美元给学校。',
    '所有学生不收取寒暑假附加费。',
    '课程与住宿按周日入学、周六离校计算，最终以学校价格、空房及优惠确认为准。',
  ],
  localFeeIntro: '学杂费由学校及相关部门直接收取，和思达启航无关；均为预估金额，仅供准备比索现金参考，具体以到校实收为准。',
  serviceLocations: ['深圳总部', '宿务驻点', '欧洲驻点'],
};

/**
 * Version 1: the old page stored weekly prices and the 2026 catalogue. The 2027 price list replaces courses, rooms,
 * local fees, offers and table copy (switches an employee turned off stay off); media and edited image lines stay.
 */
function upgradeToSchoolPack(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const enabledById = (items: ReadonlyArray<{ id: string; enabled: boolean }>) => new Map(items.map(item => [item.id, item.enabled]));
  const keepSwitches = <T extends { id: string; enabled: boolean }>(fresh: T[], saved: ReadonlyArray<{ id: string; enabled: boolean }>): T[] => {
    const enabled = enabledById(saved);
    return fresh.map(item => enabled.get(item.id) === false ? { ...item, enabled: false } : item);
  };
  clone.courses = keepSwitches(copyJson(defaults.courses), clone.courses ?? []);
  clone.rooms = keepSwitches(copyJson(defaults.rooms), clone.rooms ?? []);
  clone.localFees = copyJson(defaults.localFees);
  const saved = clone.quoteSettings;
  const fresh = copyJson(defaults.quoteSettings) as GlcQuoteSettings;
  fresh.promotions = keepSwitches(fresh.promotions, saved?.promotions ?? []);
  clone.quoteSettings = fresh;
  const image = clone.quoteImageSettings;
  if (!image) return;
  const notes = image.paymentNotes as unknown as Record<string, string>;
  for (const [key, old] of Object.entries(OLD_IMAGE_COPY.paymentNotes)) {
    if (notes?.[key] === old) notes[key] = '';
  }
  if (image.alumniBenefitText === OLD_IMAGE_COPY.alumniBenefitText) image.alumniBenefitText = ALUMNI_BENEFIT_TEXT;
  if (image.localFeeIntro === OLD_IMAGE_COPY.localFeeIntro) image.localFeeIntro = LOCAL_FEE_INTRO;
  if (JSON.stringify(image.serviceLocations) === JSON.stringify(OLD_IMAGE_COPY.serviceLocations)) {
    image.serviceLocations = copyJson(defaults.quoteImageSettings.serviceLocations);
  }
  if (JSON.stringify(image.footerNotes) === JSON.stringify(OLD_IMAGE_COPY.footerNotes)) {
    image.footerNotes = copyJson(defaults.quoteImageSettings.footerNotes);
  }
  // The old page copied every local-fee note into the image; the new fees bring their own notes.
  image.localFeeNotes = {};
}

/** A GLC content document (default or published revision). */
export function isGlcContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === 'GLC'
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

export const cloneGlcContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultGlcContentConfig();
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  const settings = clone.quoteSettings as GlcQuoteSettings;
  if ((settings.glcPolicyVersion ?? 0) < 1) upgradeToSchoolPack(clone, defaults);
  (clone.quoteSettings as GlcQuoteSettings).glcPolicyVersion = GLC_POLICY_VERSION;
  clone.quoteSettings.shortStayRatios ??= {};
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  clone.quoteImageSettings.footerNotes = clone.quoteImageSettings.footerNotes.map(note => note.replace(/思达游学/g, '思达启航'));
  // GLC has one price list for 2026 and 2027; the editor edits `tuition`, the page and quote read the list price.
  for (const item of clone.courses) item.tuition2027 = item.tuition;
  clone.media ??= [];
  return clone;
};
