// WE Academy's (Clark) versioned employee content document: courses, rooms, local fees, promotions and
// quote-image copy. The public page (we-school-page.component.ts), its calculator (we-page-quote.ts), the
// local-fee table and the quote image all read the published version of this document. Keep it pure data.
// Sources (received 2026-11-23): the 2026 dormitory price list (prices unchanged for 2027), the WE Residence
// agency notice (November 2026), the 2027 off-season promotion (March–June), the 2026–2027 brochure, the
// January 2026 rules and the 2026 program guide.
import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const WE_GUARDIAN_COURSE_ID = 'esl-3';
/** WE Residence parents may stay without a class; dormitory parents must take one (ESL 3 or another course). */
export const WE_NO_CLASS_COURSE_ID = 'guardian-no-class';
export const WE_KINDER_COURSE_ID = 'kinder-esl';
export const WE_JUNIOR_COURSE_IDS: readonly string[] = ['junior-esl', 'junior-esl-native'];
export const WE_GOLF_COURSE_IDS: readonly string[] = ['esl-golf', 'esl-golf-round'];
export const WE_DORM_SINGLE_ID = 'dorm-single';
export const WE_RESIDENCE_ROOM_IDS: readonly string[] = [
  'residence-one-queen-1', 'residence-one-queen-2',
  'residence-two-queen-2', 'residence-two-queen-3', 'residence-two-queen-4',
];
export const WE_FAMILY_ROOM_IDS: readonly string[] = ['big-room-3', 'big-room-4', 'green-house-3', 'green-house-4'];
/** The price list offers ESL 3, Junior and Kinder only with twin, triple and quad dormitory rooms (no single). */
export const WE_NO_DORM_SINGLE_COURSE_IDS: readonly string[] = [WE_GUARDIAN_COURSE_ID, ...WE_JUNIOR_COURSE_IDS, WE_KINDER_COURSE_ID];

/** Busy season (school notice): December, January, February, June, July and August. */
export const WE_BUSY_MONTHS: readonly number[] = [12, 1, 2, 6, 7, 8];
/** The busy-season deposit the school collects with the registration fee, per student. */
export const WE_BUSY_SEASON_DEPOSIT_USD = 300;

/** The 2027 off-season promotion: stays from Sunday 2027/02/28; weeks after Saturday 2027/06/26 pay regular rates. */
export const WE_PROMOTION_2027 = { start: '2027-02-28', end: '2027-06-26', minimumWeeks: 2 } as const;
export const WE_PROMO_COURSE_ID = 'we-2027-course';
export const WE_PROMO_GUARDIAN_ID = 'we-2027-guardian';
export const WE_PROMO_ROOM_ID = 'we-2027-room';
export const WE_PROMO_NATIVE_CLASS_ID = 'we-2027-native-class';
export const WE_SIDA_RULE_ID = 'we-sida';
export const WE_RETURNING_RULE_ID = 'we-returning-registration';

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
): CiaCourseContent => ({ id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder });

const room = (
  id: string, name: string, group: string, fee: number, note: string, sortOrder: number,
): CiaRoomContent => ({ id, name, label: name, code: id.toUpperCase(), location: '校内', group, fee, note, enabled: true, sortOrder });

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value, currency: 'PHP', enabled: true,
});

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: (value.sortOrder + 1) * 10,
  stackable: true,
  newStudentsOnly: false,
  discountType: 'per-course-week',
  discountValue: 50,
  appliesTo: 'tuition',
  waiveRegistration: false,
  minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'course',
  ...value,
});

const OPTION = '1节晚间选修课';
const createCourses = (): CiaCourseContent[] => [
  course('esl-4', '一般英语 ESL 4', 750, `4节菲教一对一 + 2节菲教小组课（1:6）+ ${OPTION}`, '想全面提升听说读写的成人', '一对一练阅读、词汇、写作和口语，小组课练听力和会话。', 0),
  course('esl-5', '一般英语 ESL 5', 850, `5节菲教一对一 + 2节菲教小组课（1:6）+ ${OPTION}`, '想多上一对一、兼顾语法的成人', '比ESL 4每天多1节一对一，加练语法。', 1),
  course('esl-6', '一般英语 ESL 6', 950, `6节菲教一对一 + 2节菲教小组课（1:6）+ ${OPTION}`, '想每天多练、进步更快的成人', '比ESL 5每天再多1节一对一，加练阅读和词汇。', 2),
  course('native-mix-light', '外教混合 NATIVE MIX LIGHT', 900, `3节菲教一对一 + 2节菲教小组课（1:6）+ 1节外教一对一 + ${OPTION}`, '想先体验外教课的成人', '每天1节外教一对一练口语。', 3),
  course('native-mix-general', '外教混合 NATIVE MIX GENERAL', 1100, `3节菲教一对一 + 2节菲教小组课（1:6）+ 2节外教一对一 + ${OPTION}`, '准备打工度假、海外实习或留学的学生', '每天2节外教一对一，练口语和写作。', 4),
  course('native-mix-intensive', '外教混合 NATIVE MIX INTENSIVE', 1300, `3节菲教一对一 + 2节菲教小组课（1:6）+ 3节外教一对一 + ${OPTION}`, '想多和外教练习的学生', '每天3节外教一对一，外教课最多。', 5),
  course('toeic', '托业 TOEIC', 1050, `6节托业一对一 + 1节ESL听力小组课 + ${OPTION}`, '准备参加托业考试的学生', '一对一：阅读3节、听力2节、词汇1节。', 6),
  course('toefl', '托福 TOEFL', 1050, `6节托福一对一 + 1节ESL听力小组课 + ${OPTION}`, '准备参加托福考试的学生', '一对一：写作2节，阅读、听力、口语、词汇各1节。', 7),
  course('ielts', '雅思 IELTS', 1050, `6节雅思一对一 + 1节ESL听力小组课 + ${OPTION}`, '准备参加雅思考试的学生', '一对一：写作2节，阅读、听力、口语、词汇各1节。', 8),
  course('business', '商务英语 BUSINESS', 1050, `6节商务英语一对一 + 1节ESL听力小组课 + ${OPTION}`, '工作中需要用英语沟通的学生', '一对一：口语2节，阅读、写作、听力、词汇各1节；练会议、演讲、邮件和谈判。', 9),
  course('junior-esl', '青少年英语 JUNIOR ESL', 950, '5节菲教一对一 + 1节菲教小组课', '小学到初中的孩子', '一对一练阅读、词汇、写作和口语，小组课练听力。须由监护人陪同。', 10),
  course('junior-esl-native', '青少年外教英语 JUNIOR ESL + NATIVE', 1250, '3节菲教一对一 + 1节菲教小组课 + 2节外教一对一', '想上外教课的小学到初中孩子', '每天2节外教一对一，练会话和词汇。须由监护人陪同。', 11),
  course(WE_KINDER_COURSE_ID, '幼儿园英语 KINDER ESL', 1150, '每天8节小组课（08:50–16:15，上午和下午各有1次点心）', '4–6岁的孩子', '唱歌、自然拼读、手工、故事和户内外活动；每4周轮换英语、数学、科学地理、思维和美术主题。须由监护人陪同。', 12),
  course('esl-golf', 'ESL + 高尔夫 GOLF', 1100, '3节菲教一对一 + 1小时高尔夫课和自主练习 + 1节晚间选修课', '想边学英语边练高尔夫的成人', '高尔夫课由持证菲律宾教练在校内练习场上课，周一至周五每天1小时；初学者可借用学校球杆。', 13),
  course('esl-golf-round', 'ESL + 高尔夫下场 GOLF & ROUND', 1700, '3节菲教一对一 + 1小时高尔夫课和自主练习 + 每周1次球场实地课 + 1节晚间选修课', '想每周下场打球的高尔夫爱好者', '学费含实地课和交通；果岭费、球童费和球车费另付，按球场和季节不同。', 14),
  course(WE_GUARDIAN_COURSE_ID, '家长英语 ESL 3', 650, '3节菲教一对一', '陪孩子来、自己也想学一点的家长', '仅限陪读家长；课时可以转给孩子上。住宿舍的家长须报一门课程。', 15),
  course(WE_NO_CLASS_COURSE_ID, '只陪读不上课（仅限WE公寓家长）', 0, '不上课', '住WE公寓、只陪孩子的家长', '不收学费，也不用办SSP学习许可；注册费和学生证照常收取。', 16),
];

const createRooms = (): CiaRoomContent[] => [
  room(WE_DORM_SINGLE_ID, '宿舍单人间', '宿舍', 1100, '一人一间。', 0),
  room('dorm-twin', '宿舍双人间', '宿舍', 850, '两人一间。', 1),
  room('dorm-triple', '宿舍三人间', '宿舍', 750, '三人一间。', 2),
  room('dorm-quad', '宿舍四人间', '宿舍', 650, '四人一间，费用最低。', 3),
  room('big-room-3', '大号家庭房（3人入住）', '家庭房', 900, '仅限家庭；共3间，有独立浴室。', 4),
  room('big-room-4', '大号家庭房（4–6人入住）', '家庭房', 800, '仅限家庭；共3间，有独立浴室。', 5),
  room('green-house-3', 'Green House独栋家庭屋（3人入住）', '家庭房', 950, '仅限家庭，只有1栋；可以自己做饭。', 6),
  room('green-house-4', 'Green House独栋家庭屋（4人入住）', '家庭房', 850, '仅限家庭，只有1栋；可以自己做饭。', 7),
  room('residence-one-queen-1', 'WE公寓大床房（1人入住）', 'WE公寓', 1700, '新建公寓，含餐；一人一间。', 8),
  room('residence-one-queen-2', 'WE公寓大床房（2人入住）', 'WE公寓', 1150, '一张大床，适合夫妻、亲子或朋友；不与陌生人合住。', 9),
  room('residence-two-queen-2', 'WE公寓双大床房（2人入住）', 'WE公寓', 1400, '两张大床；不与陌生人合住。', 10),
  room('residence-two-queen-3', 'WE公寓双大床房（3人入住）', 'WE公寓', 1000, '两张大床，适合家庭或朋友；不与陌生人合住。', 11),
  room('residence-two-queen-4', 'WE公寓双大床房（4人入住）', 'WE公寓', 850, '两张大床，适合家庭或朋友；不与陌生人合住。', 12),
];

const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({ id: 'ssp', name: 'SSP特殊学习许可', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取；最长6个月，延长学习或换校须重新办理。不上课的陪读家长不用办。', sortOrder: 0 }),
  fee({ id: 'ssp-e-card', name: 'SSP E-CARD', amount: 4000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '与SSP一起办理，只收一次。', sortOrder: 1 }),
  fee({ id: 'acr-i-card', name: 'ACR I-CARD 外国人身份证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '在菲律宾停留超过59天（约第9周起）时办理，有效期1年。', sortOrder: 2 }),
  fee({ id: 'dorm-service', name: '宿舍服务费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每周500比索，含饮用水、洗衣、打扫和公共电费。', sortOrder: 3 }),
  fee({ id: 'residence-service', name: 'WE公寓服务费', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每周1,000比索，含洗衣、打扫、水、网络、维护和公共电费。', sortOrder: 4 }),
  fee({ id: 'visa-extension', name: '签证续签', amount: 4800, rates: [4800, 6000, 4500], tourist59Rates: [6000, 4500], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '30天签证依次约4,800／6,000／4,500比索，59天签证从6,000比索起，之后每次约4,500比索；以实际办理为准。', sortOrder: 5 }),
  fee({ id: 'student-id', name: '学生证', amount: 300, billingRule: 'once', includeInTotal: true, note: '一次性费用，进出校门用；不上课的家长也须办理。', sortOrder: 6 }),
  fee({ id: 'books', name: '教材费', amount: 250, secondaryAmount: 500, secondaryLabel: '每本最高', billingRule: 'optional', includeInTotal: false, note: '每本250–500比索，按水平和课程不同；在办公室确认后购买，可从押金扣除。', sortOrder: 7 }),
  fee({ id: 'electricity', name: '房间电费', amount: 22, secondaryLabel: '每千瓦时', billingRule: 'optional', includeInTotal: false, note: '每间房有独立电表，按用电量22比索／千瓦时，室友平分；从押金结算。', sortOrder: 8 }),
  fee({ id: 'pickup', name: '克拉克机场接机', amount: 1000, secondaryAmount: 1500, secondaryLabel: '每个家庭', billingRule: 'optional', includeInTotal: false, note: '单人1,000比索；每个家庭1,500比索，超过4人每人加250比索。', sortOrder: 9 }),
  fee({ id: 'pickup-manila', name: '马尼拉机场接机', amount: 5000, secondaryAmount: 6000, secondaryLabel: '每个家庭', billingRule: 'optional', includeInTotal: false, note: '单人5,000比索；每个家庭6,000比索，超过4人每人加500比索。', sortOrder: 10 }),
  fee({ id: 'dorm-deposit', name: '宿舍押金', amount: 3000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '住宿舍每人3,000比索，另付钥匙押金500比索；扣除电费和教材费后，无损坏时退还。', sortOrder: 11 }),
  fee({ id: 'residence-deposit', name: 'WE公寓押金', amount: 1000, secondaryLabel: '每周', billingRule: 'optional', includeInTotal: false, note: '住WE公寓每人每周1,000比索，另付每间房钥匙押金1,000比索；退房时结算退还。', sortOrder: 12 }),
];

const createPromotions = (): CiaPromotionRule[] => [
  promotion({ id: WE_SIDA_RULE_ID, name: '思达启航折扣', description: '课程费和住宿费按原价享9折，再减学校优惠；住WE公寓且在旺季入住时为95折', sortOrder: 0, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', coverageTarget: 'none' }),
  promotion({
    id: WE_PROMO_COURSE_ID, name: '2027淡季课程优惠', sortOrder: 1,
    description: '2027/02/28–06/26期间每个学习周减50美元（每4周减200美元）；至少2周在优惠期内',
    eligibleCourseIds: ['esl-4', 'esl-5', 'esl-6', 'native-mix-light', 'native-mix-general', 'native-mix-intensive', 'toeic', 'toefl', 'ielts', 'business', ...WE_JUNIOR_COURSE_IDS],
    arrivalStart: WE_PROMOTION_2027.start, coverageStart: WE_PROMOTION_2027.start, coverageEnd: WE_PROMOTION_2027.end,
  }),
  promotion({
    id: WE_PROMO_GUARDIAN_ID, name: '2027淡季家长课程优惠', sortOrder: 2, discountValue: 25,
    description: '家长英语ESL 3在2027/02/28–06/26期间每个学习周减25美元（每4周减100美元）',
    eligibleCourseIds: [WE_GUARDIAN_COURSE_ID],
    arrivalStart: WE_PROMOTION_2027.start, coverageStart: WE_PROMOTION_2027.start, coverageEnd: WE_PROMOTION_2027.end,
  }),
  promotion({
    id: WE_PROMO_ROOM_ID, name: '2027淡季住宿优惠', sortOrder: 3, appliesTo: 'accommodation', coverageTarget: 'course-and-accommodation',
    description: 'WE公寓、宿舍单人间、双人间和家庭房在2027/02/28–06/26期间每周减50美元（每4周减200美元）',
    eligibleRoomIds: [...WE_RESIDENCE_ROOM_IDS, WE_DORM_SINGLE_ID, 'dorm-twin', ...WE_FAMILY_ROOM_IDS],
    arrivalStart: WE_PROMOTION_2027.start, coverageStart: WE_PROMOTION_2027.start, coverageEnd: WE_PROMOTION_2027.end,
  }),
  promotion({
    id: WE_PROMO_NATIVE_CLASS_ID, name: '免费外教选修小组课', sortOrder: 4, discountType: 'none', discountValue: 0, coverageTarget: 'none',
    description: '2027/02/28–06/26期间每天加1节外教选修小组课（1小时，08:00–17:00随机安排，不按水平分班）；家长英语ESL 3、高尔夫和幼儿园课程除外',
    eligibleCourseIds: ['esl-4', 'esl-5', 'esl-6', 'native-mix-light', 'native-mix-general', 'native-mix-intensive', 'toeic', 'toefl', 'ielts', 'business', ...WE_JUNIOR_COURSE_IDS],
    arrivalStart: WE_PROMOTION_2027.start, coverageStart: WE_PROMOTION_2027.start, coverageEnd: WE_PROMOTION_2027.end,
  }),
  promotion({ id: WE_RETURNING_RULE_ID, name: '老学员返校', description: '老学员返校免收一次性注册费。', sortOrder: 5, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, coverageTarget: 'none' }),
];

const LOCAL_FEE_INTRO = '以下费用由学校、移民局及相关部门收取，到校后用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留时间预估；服务费按住宿周数计算。请带4–6张2×2英寸证件照（也可到校后在商场拍）。';

const createExtraNightRates = () => [
  { label: '宿舍（单人间除外）', amount: 1500 },
  { label: '宿舍单人间', amount: 2000 },
  { label: 'WE公寓', amount: 2000 },
];

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
/**
 * WE is not in the employee editors yet, so its code is not in `CiaContentConfig`'s school-code list. That list
 * lives in the locked CIA folder, so the code is cast here instead.
 */
const WE_SCHOOL_CODE = 'WE' as string as CiaContentConfig['schoolCode'];

const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

export const createDefaultWeContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: WE_SCHOOL_CODE,
  courses: createCourses(),
  rooms: createRooms(),
  localFees: createLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.35, '2': 0.6, '3': 0.8 },
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'WE 2027年4周课程费',
    courseTableNote: '以下为周一至周五的每日课程安排，课程费按4周计算；2027年价格与2026年相同。每节课45分钟，小组课最多6人。',
    groupClassNote: '小组课最多6人（1:6）；晚间选修课周一至周四19:00–21:00，按水平选1小时。',
    roomTableTitle: 'WE 2027年4周住宿费',
    roomTableNote: '每人价格，含餐：平日三餐，周末和假日两餐。WE公寓同住的人须同一天入住，不与陌生人合住。',
    stayPolicyTitle: 'WE 入住与管理提醒',
    stayPolicies: [
      { label: '入住日期', value: '周六15:00后或周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
      { label: '退房日期', value: '宿舍周六13:00前；WE公寓毕业周周五16:00前', note: '提前到或延住按晚另付，见下方额外住宿费用。' },
      { label: '管理模式', value: '自由型，成人无门禁', note: '未成年学生须由监护人陪同外出。' },
    ],
    extraNightRates: createExtraNightRates(),
  },
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

/** A WE content document (default or published revision). */
export function isWeContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === WE_SCHOOL_CODE
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

export const cloneWeContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultWeContentConfig();
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= copyJson(defaults.quoteSettings.extraNightRates);
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  clone.quoteImageSettings.footerNotes = clone.quoteImageSettings.footerNotes.map(note => note.replace(/思达游学/g, '思达启航'));
  clone.media ??= [];
  return clone;
};
