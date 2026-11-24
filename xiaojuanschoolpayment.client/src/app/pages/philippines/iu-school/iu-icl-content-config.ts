// IU and ICL are two separate schools of the same group, each with its own versioned employee content document:
// courses, rooms, local fees, offers and quote-image copy. The public pages (iu-school / icl-school on the shared
// Philippine template), their calculator (iu-icl-page-quote.ts), the local-fee table and the quote image all read
// the published version of that document. Never let one campus read the other's prices or rooms. Keep it pure data.
// Sources: each school's 2026 price list, the joint IU & ICL low-season package table (PROM PRICE AND PLAN) and
// the low-season poster, the IU 2026 brochure (IU course lines) and the 2026 refund policy, received 2026-11-24;
// see docs/iu-icl-page-2026-11-24.md.
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteImageSettings,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

export type IuIclCampus = 'IU' | 'ICL';
export type IuIclPromoCourse = NonNullable<CiaCourseContent['promoCourse']>;
export type IuIclPromoRoom = NonNullable<CiaRoomContent['promoRoom']>;

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Raised when saved documents must inherit a school notice once (cloneIuIclContentConfig):
 * 2 = the 2026-11-24 pack: the low-season window 2026/09/01–2027/01/16, room openings from 2026/11/29, the
 *     思达启航9折 and returning-student rules as offers, one visa-extension row with the 30-day and 59-day
 *     sequences, ACR I-Card with the first visa extension, course lines from the IU brochure and no agency payment rules.
 */
export const IU_ICL_POLICY_VERSION = 2;
type IuIclQuoteSettings = CiaQuoteSettings & { iuIclPolicyVersion?: number };

export const IU_ICL_LOW_SEASON_RULE_ID = 'iu-icl-low-season';
export const IU_ICL_SIDA_RULE_ID = 'iu-icl-sida-90';
export const IU_ICL_RETURNING_RULE_ID = 'iu-icl-returning-registration';
/** Course start (Sunday arrival) on or after this day and last departure (Saturday) on or before the end. */
export const IU_ICL_LOW_SEASON_START = '2026-09-01';
export const IU_ICL_LOW_SEASON_END = '2027-01-16';

/** The joint package table: 4-week totals per course and campus room (course + room + registration waived). */
export const IU_ICL_PACKAGE_PRICES: Record<IuIclPromoCourse, Record<IuIclPromoRoom, number>> = {
  power4: { single: 1500, double: 1250, triple: 1150, quad: 1050 },
  power6: { single: 1650, double: 1400, triple: 1300, quad: 1200 },
  power8: { single: 1800, double: 1550, triple: 1450, quad: 1350 },
  light: { single: 1500, double: 1250, triple: 1150, quad: 1050 },
  junior: { single: 1550, double: 1300, triple: 1200, quad: 1100 },
  ielts: { single: 1650, double: 1350, triple: 1250, quad: 1150 },
  toeic: { single: 1650, double: 1350, triple: 1250, quad: 1150 },
  // Guarantee courses: whole 8-week and 12-week totals.
  guarantee8: { single: 3700, double: 3100, triple: 2900, quad: 2700 },
  guarantee12: { single: 5349, double: 4449, triple: 4149, quad: 3849 },
};

const ESL_GROUP = 'Power Speaking 口语课程';

const course = (
  id: string, name: string, tuition: number, category: string, schedule: string, suitable: string, note: string,
  extra: Partial<CiaCourseContent> = {},
): Omit<CiaCourseContent, 'sortOrder'> => ({
  id, name, tuition, tuition2027: tuition, category, schedule, suitable, note, enabled: true, ...extra,
});

const SPEAKING_TEST = '每周四参加口语测验。';
const IELTS_MOCK = '每周二、周四参加雅思模考。';

const IU_COURSES = [
  course('light-esl', 'Light Speaking 轻松口语', 750, ESL_GROUP, '一对一4节，没有团体课', '16岁以上，A1–C1，想轻松练口语、留出自由时间',
    '以发音、流利度和基础表达为主，适合想快速提升开口信心的学生。', { promoCourse: 'light' }),
  course('power-speaking-4', 'Power Speaking 4 口语强化', 850, ESL_GROUP, '一对一4节 + 团体课4节', '16岁以上，A1–C1，想一对一和团体课兼顾',
    `一对一做个人指导，团体课在模拟真实场景中练沟通。${SPEAKING_TEST}`, { promoCourse: 'power4' }),
  course('power-speaking-6', 'Power Speaking 6 口语强化', 1000, ESL_GROUP, '一对一6节 + 团体课2节', '16岁以上，A1–C1，想多上一对一',
    `更偏重个别指导，适合有明确个人目标的学生。${SPEAKING_TEST}`, { promoCourse: 'power6' }),
  course('power-speaking-8', 'Power Speaking 8 全一对一', 1150, ESL_GROUP, '一对一8节', '16岁以上，A1–C1，想短期密集提升',
    `全部是一对一，完全按个人需要安排。${SPEAKING_TEST}`, { promoCourse: 'power8' }),
  course('ielts-guarantee-8', 'IELTS Guarantee 8周雅思保分班', 1200, '雅思与托业', '一对一6节 + 团体课2节，固定8周', '15岁以上，A2–C1，入学雅思3.5–5.5',
    `8周保分：入学3.5保5.0，4.5保5.5，5.5保6.5。${IELTS_MOCK}`, { promoCourse: 'guarantee8', fixedWeeks: 8, minimumWeeks: 8 }),
  course('ielts-guarantee-12', 'IELTS Guarantee 12周雅思保分班', 1133, '雅思与托业', '一对一6节 + 团体课2节，固定12周', '15岁以上，A2–C1，入学雅思3.5–6.0',
    `12周保分：入学3.5保5.5，4.5保6.0，6.0保7.0。${IELTS_MOCK}`, { promoCourse: 'guarantee12', fixedWeeks: 12, minimumWeeks: 12 }),
  course('ielts', 'IELTS 雅思', 1000, '雅思与托业', '一对一4节 + 团体课4节', '14岁以上，A2–C1，入学须雅思3.0或以上',
    `模考成绩两次达到6.5或以上，学校提供1次官方考试。${IELTS_MOCK}`, { promoCourse: 'ielts' }),
  course('toeic', 'TOEIC 托业', 950, '雅思与托业', '一对一4节 + 团体课4节', '14岁以上，A2–C1，入学须托业350分或以上',
    '每周四参加托业模考；想短期冲目标分，一对一建议选2节听力和2节阅读。', { promoCourse: 'toeic' }),
  course('kids', 'KIDS 儿童英语', 900, '儿童和青少年', '一对一4节 + 团体课2节 + 活动课2节', '12岁以下儿童，Pre A1起',
    '团体课有STEAM和数学游戏；16:00–18:00的体育活动自由参加。最小年龄报名时向学校确认。', { promoCourse: 'junior' }),
  course('junior', 'JUNIOR 青少年英语', 900, '儿童和青少年', '一对一4节 + 团体课4节', '13–15岁，Pre A1起',
    '一对一练听说读写，团体课练文法、新闻、演讲和发音。', { promoCourse: 'junior' }),
  course('beginner-4', 'Beginner 4 初学者英语', 850, '初学者、商务和健身', '一对一4节 + 团体课2节', '16岁以上，零基础到Pre A1',
    '12个日常主题（问候、家庭、食物、数字、方向、天气等），结业后能自我介绍、做简单交流。'),
  course('beginner-6', 'Beginner 6 初学者英语', 1000, '初学者、商务和健身', '一对一6节 + 团体课2节', '16岁以上，零基础到Pre A1',
    '内容同Beginner 4，一对一更多。'),
  course('business-4', 'Business 4 商务英语', 950, '初学者、商务和健身', '一对一4节 + 团体课4节', '22岁以上，B1–C1',
    '职场沟通、商务复习和商务演讲。'),
  course('business-6', 'Business 6 商务英语', 1100, '初学者、商务和健身', '一对一6节 + 团体课2节', '22岁以上，B1–C1',
    '内容同Business 4，一对一更多。'),
  course('fitness', 'Fitness English 健身英语', 1050, '初学者、商务和健身', '一对一4节 + 每周3次健身课', '13岁以上，Pre A1–C1',
    '健身课可选有氧拳击、飞轮、Zumba、重量训练、有氧和瑜伽；周一至周五有营养师搭配的健身餐。'),
];

const ICL_SCHEDULE_TBC = '具体课时以ICL课表为准';
const ICL_COURSES = [
  course('light-speaking', 'Light Speaking 轻松口语', 750, ESL_GROUP, ICL_SCHEDULE_TBC, '想轻松练口语、留出自由时间',
    '口语课程，具体课时报名时向学校确认。', { promoCourse: 'light' }),
  course('power-speaking-4', 'Power Speaking 4 口语强化', 850, ESL_GROUP, '一对一4节 + 团体课4节', '想一对一和团体课兼顾',
    '一对一和团体课各半。', { promoCourse: 'power4' }),
  course('power-speaking-6', 'Power Speaking 6 口语强化', 1000, ESL_GROUP, '一对一6节 + 团体课2节', '想多上一对一',
    '一对一为主，团体课较少。', { promoCourse: 'power6' }),
  course('power-speaking-8', 'Power Speaking 8 全一对一', 1150, ESL_GROUP, '一对一8节', '想短期密集提升',
    '全部是一对一。', { promoCourse: 'power8' }),
  course('ielts-guarantee-8', 'IELTS Guarantee 8周雅思保分班', 1200, '雅思与托业', '一对一6节 + 团体课2节，固定8周', '有明确雅思目标分',
    '入学和目标分数段报名时向学校确认。', { promoCourse: 'guarantee8', fixedWeeks: 8, minimumWeeks: 8 }),
  course('ielts-guarantee-12', 'IELTS Guarantee 12周雅思保分班', 1133, '雅思与托业', '一对一6节 + 团体课2节，固定12周', '有明确雅思目标分',
    '入学和目标分数段报名时向学校确认。', { promoCourse: 'guarantee12', fixedWeeks: 12, minimumWeeks: 12 }),
  course('ielts', 'IELTS 雅思', 1000, '雅思与托业', '一对一4节 + 团体课4节', '准备雅思考试',
    '雅思备考课程。', { promoCourse: 'ielts' }),
  course('toeic', 'TOEIC 托业', 950, '雅思与托业', '一对一4节 + 团体课4节', '准备托业考试',
    '托业备考课程。', { promoCourse: 'toeic' }),
  course('kids', 'KIDS 儿童英语', 900, '儿童和青少年', ICL_SCHEDULE_TBC, '儿童，年龄报名时向学校确认',
    '儿童课程。', { promoCourse: 'junior' }),
  course('junior', 'JUNIOR 青少年英语', 900, '儿童和青少年', '一对一4节 + 团体课4节', '青少年，年龄报名时向学校确认',
    '青少年课程。', { promoCourse: 'junior' }),
  course('business-4', 'Business 4 商务英语', 950, '商务英语', ICL_SCHEDULE_TBC, '职场人士',
    '商务英语课程。'),
  course('business-6', 'Business 6 商务英语', 1100, '商务英语', ICL_SCHEDULE_TBC, '职场人士，想多上一对一',
    '商务英语课程，一对一比Business 4多。'),
];

const CAMPUS = '校内宿舍';
const OFF_CAMPUS = '校外住宿';
const WALK_IN = '走读';

const room = (
  id: string, name: string, fee: number, group: string, note: string, promoRoom?: IuIclPromoRoom,
): Omit<CiaRoomContent, 'sortOrder'> => ({
  id, name, label: name, code: id, location: group === OFF_CAMPUS ? '校外' : '校内', group, fee, note,
  enabled: true, accommodation: group !== WALK_IN, ...(promoRoom ? { promoRoom } : {}),
});

const NO_PACKAGE = '不参加淡季套餐价，可享思达启航9折。';
const IU_ROOMS = [
  room('campus-single', '校内单人间', 950, CAMPUS, '独立卫浴，私密性最好。', 'single'),
  room('campus-double', '校内双人间', 800, CAMPUS, '独立卫浴。', 'double'),
  room('campus-triple', '校内三人间', 700, CAMPUS, '独立卫浴。', 'triple'),
  room('campus-quad', '校内家庭四人间', 600, CAMPUS, '只接受家庭入住，在2楼亲子楼层。', 'quad'),
  room('off-campus-single', '校外单人间', 1400, OFF_CAMPUS, NO_PACKAGE),
  room('off-campus-double', '校外双人间', 950, OFF_CAMPUS, NO_PACKAGE),
  room('walk-in', '走读（不住宿）', 0, WALK_IN, '只收课程费；到校只交签证、SSP和教材相关费用。'),
];
const ICL_ROOMS = [
  room('campus-single', '校内单人间', 850, CAMPUS, '独立卫浴，私密性最好。', 'single'),
  room('campus-double', '校内双人间', 750, CAMPUS, '独立卫浴。', 'double'),
  room('campus-triple', '校内三人间', 700, CAMPUS, '独立卫浴。', 'triple'),
  room('campus-quad', '校内四人间', 600, CAMPUS, '独立卫浴。', 'quad'),
  room('off-campus-single', '校外单人间', 1450, OFF_CAMPUS, NO_PACKAGE),
  room('off-campus-double', '校外双人间', 1050, OFF_CAMPUS, NO_PACKAGE),
  room('off-campus-triple', '校外三人间', 950, OFF_CAMPUS, NO_PACKAGE),
  room('walk-in', '走读（不住宿）', 0, WALK_IN, '只收课程费；到校只交签证、SSP和教材相关费用。'),
];

/** Room ids that pay the dormitory fees (pickup, deposit, maintenance, electricity, laundry). */
export const iuIclStaysAtSchool = (roomId: string): boolean => roomId !== 'walk-in';

const fee = (rule: Omit<CiaLocalFeeRule, 'currency' | 'enabled' | 'sortOrder'>): Omit<CiaLocalFeeRule, 'sortOrder'> =>
  ({ currency: 'PHP', enabled: true, ...rule });

const LOCAL_FEES = [
  fee({ id: 'ssp', name: 'SSP 特别学习许可', amount: 7800, billingRule: 'once', includeInTotal: true, note: '一次性办理。' }),
  fee({ id: 'ssp-e-card', name: 'SSP E-Card', amount: 4500, billingRule: 'once', includeInTotal: true, note: '一次性办理。' }),
  fee({
    id: 'visa-extension', name: '签证延期', amount: 5500, billingRule: 'visa-extension-schedule', includeInTotal: true,
    rates: [5500, 6500, 5500], tourist59Rates: [6500, 5500],
    note: '30天签证：第1次延期5,500比索（读5–8周），第2次6,500比索（9–12周），之后每次5,500比索；59天签证从第9周起延期，首次6,500比索，之后每次5,500比索。',
  }),
  fee({ id: 'acr-i-card', name: 'ACR I-Card', amount: 4500, billingRule: 'once', includeInTotal: true, note: '随第1次签证延期办理（30天签证第5周起，59天签证第9周起），只收一次。' }),
  fee({ id: 'textbooks', name: '教材费（预估）', amount: 2000, billingRule: 'once', includeInTotal: true, note: '每种课程预估2,000比索（每本250–600比索）；教材用完需另买。' }),
  fee({ id: 'airport-pickup', name: '机场接机', amount: 800, billingRule: 'once', includeInTotal: true, note: '一次性。' }),
  fee({ id: 'room-deposit', name: '宿舍押金', amount: 3000, billingRule: 'once', includeInTotal: true, note: '最后一周退还（无损坏、无欠费）。' }),
  fee({ id: 'maintenance', name: '维护费', amount: 400, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '按住宿周数。' }),
  fee({ id: 'electricity', name: '电费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每周含25度电，超出每度25比索；电费不退。' }),
  fee({ id: 'laundry', name: '洗衣费', amount: 300, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每周洗2次。' }),
  fee({ id: 'extra-night', name: '额外住宿', amount: 1300, billingRule: 'optional', includeInTotal: false, note: '每人每晚；周日入住、周六13:00退房以外加住时收取，需先确认空房。' }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索向学校缴纳，按每位学生的停留周数和签证类型预估，仅供准备现金参考。走读学生不交接机、押金、维护费、电费和洗衣费。';
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

const promotion = (rule: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: rule.sortOrder,
  stackable: true,
  newStudentsOnly: false,
  discountType: 'none',
  discountValue: 0,
  appliesTo: 'tuition-and-accommodation',
  waiveRegistration: false,
  minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'none',
  ...rule,
});

const promotions = (): CiaPromotionRule[] => [
  promotion({
    id: IU_ICL_LOW_SEASON_RULE_ID, ruleKind: IU_ICL_LOW_SEASON_RULE_ID, name: '校方淡季套餐价', sortOrder: 0,
    description: '2026/09/01–2027/01/16期间，口语、轻松、青少年、雅思、托业或保分课程，配同日期的校内宿舍读满4周，按校方套餐价收费并免注册费；套餐部分不再打折。',
    waiveRegistration: true, stackable: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 4,
    coverageStart: IU_ICL_LOW_SEASON_START, coverageEnd: IU_ICL_LOW_SEASON_END, coverageTarget: 'course-and-accommodation',
  }),
  promotion({
    id: IU_ICL_SIDA_RULE_ID, ruleKind: IU_ICL_SIDA_RULE_ID, name: '思达启航9折', sortOrder: 1,
    description: '课程费和住宿费9折（校方淡季套餐部分除外）；注册费和到校学杂费不打折。',
    discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation',
  }),
  promotion({
    id: IU_ICL_RETURNING_RULE_ID, ruleKind: 'returning-registration', name: '老学员免注册费', sortOrder: 2,
    description: '回校就读的老学员免100美元注册费。', waiveRegistration: true, appliesTo: 'school-total',
  }),
];

const imageSettings = (): CiaQuoteImageSettings => ({
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
});

const ROOM_OPENING: Record<IuIclCampus, string> = {
  IU: 'IU双人间、三人间的淡季名额2026/11/29起开放，房间有限，以学校确认为准。',
  ICL: 'ICL三人间、四人间的淡季名额2026/11/29起开放，房间有限，以学校确认为准。',
};

export const createDefaultIuIclContentConfig = (campus: IuIclCampus): CiaContentConfig => {
  const courses = (campus === 'IU' ? IU_COURSES : ICL_COURSES).map((item, sortOrder) => ({ ...copyJson(item), sortOrder }));
  const rooms = (campus === 'IU' ? IU_ROOMS : ICL_ROOMS).map((item, sortOrder) => ({ ...copyJson(item), sortOrder }));
  const settings: IuIclQuoteSettings = {
    registrationFee: 100,
    iuIclPackagePrices: copyJson(IU_ICL_PACKAGE_PRICES),
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.6, '3': 0.8 },
    peakSeasonFeePerWeek: 0,
    peakSeasonRanges: [],
    promotions: promotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: `${campus} 2026课程价格`,
    courseTableNote: '1–3周按4周价格的40%／60%／80%收费，4周以上按周数比例计算；保分班只能读8周或12周。',
    groupClassNote: '团体课按学生程度分班，课程安排以学校课表为准。',
    roomTableTitle: `${campus} 2026住宿价格`,
    roomTableNote: ROOM_OPENING[campus],
    stayPolicyTitle: '入住与退房',
    stayPolicies: [
      { label: '入住', value: '周日', note: '课程和住宿同一天开始。' },
      { label: '退房', value: '周六13:00前', note: '结束日期按周数自动计算。' },
    ],
    extraNightRates: [{ label: '额外住宿（每人／晚）', amount: 1300 }],
    iuIclPolicyVersion: IU_ICL_POLICY_VERSION,
  };
  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: campus,
    courses,
    rooms,
    localFees: LOCAL_FEES.map((item, sortOrder) => ({ ...copyJson(item), sortOrder })),
    quoteSettings: settings,
    quoteImageSettings: imageSettings(),
    media: [],
  };
  return config;
};

export const createDefaultIuContentConfig = (): CiaContentConfig => createDefaultIuIclContentConfig('IU');
export const createDefaultIclContentConfig = (): CiaContentConfig => createDefaultIuIclContentConfig('ICL');

/**
 * Version 2 rebuilds the catalogue around the new school files once. It keeps each saved course's and room's price,
 * on/off switch and order (by id), uploaded media and the package table, and replaces names, class lines, notes, local
 * fees, offers and image copy, which were written from the old poster (and carried an agency payment rule).
 */
function upgradeIuIclPolicy(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as IuIclQuoteSettings;
  if ((settings.iuIclPolicyVersion ?? 0) >= IU_ICL_POLICY_VERSION) return;
  const keepCourse = new Map((clone.courses ?? []).map(item => [item.id, item]));
  const keepRoom = new Map((clone.rooms ?? []).map(item => [item.id, item]));
  clone.courses = defaults.courses.map(item => {
    const saved = keepCourse.get(item.id);
    return saved ? { ...item, tuition: saved.tuition, tuition2027: saved.tuition, enabled: saved.enabled } : item;
  });
  clone.rooms = defaults.rooms.map(item => {
    const saved = keepRoom.get(item.id);
    return saved ? { ...item, fee: saved.fee, enabled: saved.enabled } : item;
  });
  clone.localFees = copyJson(defaults.localFees);
  clone.quoteSettings = {
    ...copyJson(defaults.quoteSettings),
    registrationFee: settings.registrationFee ?? defaults.quoteSettings.registrationFee,
    iuIclPackagePrices: settings.iuIclPackagePrices ?? defaults.quoteSettings.iuIclPackagePrices,
  };
  clone.quoteImageSettings = copyJson(defaults.quoteImageSettings);
}

/** An IU or ICL content document (default or published revision) of the given campus. */
export function isIuIclContentConfig(value: unknown, campus: IuIclCampus): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === campus
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions) && !!content.quoteImageSettings;
}

export const cloneIuIclContentConfig = (value: CiaContentConfig, campus: IuIclCampus): CiaContentConfig => {
  const defaults = createDefaultIuIclContentConfig(campus);
  const clone = copyJson(value);
  clone.schoolCode = campus;
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings ??= copyJson(defaults.quoteSettings);
  upgradeIuIclPolicy(clone, defaults);
  clone.quoteSettings.shortStayRatios ??= { ...defaults.quoteSettings.shortStayRatios };
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteSettings.iuIclPackagePrices ??= copyJson(IU_ICL_PACKAGE_PRICES);
  clone.quoteImageSettings ??= copyJson(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= copyJson(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes ??= {};
  clone.quoteImageSettings.benefits ??= copyJson(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= copyJson(defaults.quoteImageSettings.footerNotes);
  clone.quoteImageSettings.footerNotes = clone.quoteImageSettings.footerNotes.map(note => note.replace(/思达游学/g, '思达启航'));
  clone.media ??= [];
  return clone;
};

export const cloneIuContentConfig = (value: CiaContentConfig): CiaContentConfig => cloneIuIclContentConfig(value, 'IU');
export const cloneIclContentConfig = (value: CiaContentConfig): CiaContentConfig => cloneIuIclContentConfig(value, 'ICL');
