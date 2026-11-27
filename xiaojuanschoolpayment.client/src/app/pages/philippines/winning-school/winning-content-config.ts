// Winning English Academy's content document: both campuses' courses and rooms (tagged by campus), local fees, offers,
// the 2027 peak and quote-image copy, one school record and one document (code WINNING). Each campus page reads its own
// part through winningCampusContent. Keep it pure data (no Angular, DOM, storage or structuredClone), so the WeChat mini
// program can bundle it. Sources: winning-pricing.ts and docs/winning-source-2026-11-26.md.
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaQuoteImageSettings,
  CiaQuoteSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import { CALA_PEAK_RANGE_2027 } from '../association-peak-surcharge';
import {
  WINNING_AYALA_OFFER_REGISTRATION_END,
  WINNING_CAMPUS_LABELS,
  WINNING_COURSE_FEES,
  WINNING_ROOM_FEES,
  WINNING_SHORT_STAY_RATIOS,
  WINNING_VISA_APPOINTMENT_FEE,
  WINNING_VISA_RATES,
  type WinningCampus,
} from './winning-pricing';

/** Deep copy of plain content data. Not structuredClone, which the WeChat mini program runtime lacks. */
const copyJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** Not in the locked CIA file's schoolCode list; cast like QQ's code. */
export const WINNING_SCHOOL_CODE = 'WINNING' as CiaContentConfig['schoolCode'];
export const WINNING_AYALA_OFFER_RULE_ID = 'winning-ayala-opening';
export const WINNING_SIDA_RULE_ID = 'winning-sida-95';
export const WINNING_RETURNING_RULE_ID = 'winning-returning-registration';

/** Version 1 (2026-11-26): the first template document. */
export const WINNING_POLICY_VERSION = 1;
type WinningQuoteSettings = CiaQuoteSettings & { winningPolicyVersion?: number };

const course = (item: (typeof WINNING_COURSE_FEES)[number], sortOrder: number): CiaCourseContent => ({
  id: item.id,
  name: item.name,
  tuition: item.tuition,
  tuition2027: item.tuition,
  campus: item.campuses.length === 1 ? item.campuses[0] : 'both',
  courseType: item.familyCourse ? '亲子家庭英语' : '英语课程',
  schedule: item.schedule,
  suitable: item.suitable,
  note: item.note,
  enabled: true,
  sortOrder,
});

const room = (item: (typeof WINNING_ROOM_FEES)[number], sortOrder: number): CiaRoomContent => ({
  id: item.id,
  name: item.name,
  label: item.name,
  code: item.code,
  location: item.location,
  group: item.group,
  campus: item.campus,
  fee: item.fee,
  note: item.note,
  enabled: true,
  sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({ ...value, currency: 'PHP', enabled: true });
const withAppointment = (rates: readonly number[]) => rates.map(rate => rate + WINNING_VISA_APPOINTMENT_FEE);

/** The local-fee rows of the school's price tables, paid at school in pesos. */
const createLocalFees = (): CiaLocalFeeRule[] => [
  fee({
    id: 'visa-extension', name: '签证续签', amount: WINNING_VISA_RATES[0] + WINNING_VISA_APPOINTMENT_FEE,
    rates: withAppointment(WINNING_VISA_RATES), tourist59Rates: withAppointment(WINNING_VISA_RATES.slice(1)),
    billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, sortOrder: 0,
    note: '学校价格表：第1次5,140、第2次6,920、第3次4,440、第4次4,950、第5次5,450比索，每次另加300比索预约费（已计入）；以移民局实际收费为准。',
  }),
  fee({ id: 'ssp', name: 'SSP特别学习许可', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局规定，在菲律宾上课须办理；从其他学校转来也要重新办理。', sortOrder: 1 }),
  fee({ id: 'student-e-card', name: '学生电子卡 Student E-Card', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '和SSP一起办理，到校第一周缴纳。', sortOrder: 2 }),
  fee({ id: 'acr-i-card', name: 'ACR I-Card', amount: 4500, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '停留超过59天须办理，和第一次续签一起缴纳一次。', sortOrder: 3 }),
  fee({ id: 'utilities', name: '水电费', amount: 900, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每住宿周900比索，含教学楼、宿舍和公共区域。', sortOrder: 4 }),
  fee({ id: 'management', name: '管理维护费', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, includeInTotal: true, note: '每住宿周500比索。', sortOrder: 5 }),
  fee({
    id: 'books', name: '教材费', amount: 2600, billingRule: 'per-course-period', includeInTotal: true, sortOrder: 6,
    note: '学校教材费表（2026年6月起）：按课程和报名周数包周计算，不按本数；不论是否用完都要缴，不退费。表中没有的周数按较长一档估算。',
  }),
  fee({ id: 'student-id', name: '学生证', amount: 200, billingRule: 'once', includeInTotal: true, note: '入学时办理一次。', sortOrder: 7 }),
  fee({ id: 'deposit', name: '押金（可退）', amount: 3500, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, sortOrder: 8, note: '毕业周的周四退还（特殊毕业周除外），扣除损坏等费用。' }),
  fee({ id: 'pickup', name: '机场接机', amount: 1000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, sortOrder: 9, note: '每次1,000比索，须在报名时申请；毕业送机同为1,000比索。' }),
  fee({ id: 'laundry', name: '洗衣', amount: 200, billingRule: 'optional', includeInTotal: false, multiplyByStudents: false, sortOrder: 10, note: '每次200比索（洗衣加烘干，每袋最多7公斤），到校后按需购买。' }),
];

const promotion = (value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>): CiaPromotionRule => ({
  enabled: true,
  priority: (value.sortOrder + 1) * 10,
  stackable: true,
  newStudentsOnly: false,
  discountType: 'percentage',
  discountValue: 0,
  appliesTo: 'tuition-and-accommodation',
  waiveRegistration: false,
  minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'none',
  ...value,
});

const createPromotions = (): CiaPromotionRule[] => [
  promotion({
    id: WINNING_AYALA_OFFER_RULE_ID, name: 'Ayala校区开业淡季优惠', sortOrder: 0, discountValue: 15, ruleKind: 'winning-ayala-opening',
    registrationEnd: WINNING_AYALA_OFFER_REGISTRATION_END,
    description: '2026年12月31日前报名、只限Ayala校区淡季周：课程费和食宿费85折，不限周数；ESL和雅思课程读4周以上，另可免费升级到下一级课程（如付ESL2的价格读ESL4）。2027/01/24–02/28寒假旺季和2027年暑假旺季不适用，不与学校其他优惠同时使用',
  }),
  promotion({
    id: WINNING_SIDA_RULE_ID, name: '思达启航折扣', sortOrder: 1, discountValue: 5,
    description: '课程费和食宿费（扣除学校优惠后）再享95折',
  }),
  promotion({
    id: WINNING_RETURNING_RULE_ID, name: '老学员返校', sortOrder: 2, discountType: 'none', appliesTo: 'school-total', waiveRegistration: true,
    description: '老学员返校免收一次性注册费。',
  }),
];

const LOCAL_FEE_INTRO = '以下费用到校后用比索缴纳，仅供准备现金参考。签证费用按每位学生选择的签证类型和停留时间预估；水电费和管理维护费按住宿周数计算；教材费按课程和周数计算。押金、接机和洗衣另付，不计入合计。';

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';

const imageSettings = (campus: WinningCampus): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '含平日三餐', promotion: '' },
  promotionNotes: {},
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: LOCAL_FEE_INTRO,
  localFeeNotes: {},
  supplementalFeeNotes: {},
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
  footerNotes: [
    `本报价只含${WINNING_CAMPUS_LABELS[campus]}的课程和房型。`,
    '到校费用、签证与教材按实际发生和学校最新政策确认。',
    campus === 'ayala'
      ? '价格为学校2026年9月22日价格表（2026年10月3日起）；2027年价格学校尚未公布，暂按此价格预估。'
      : '价格为学校2026年价格表；2027年价格学校尚未公布，暂按此价格预估；最终以学校价格、空房及优惠确认为准。',
  ],
});

export const createDefaultWinningContentConfig = (): CiaContentConfig => {
  const ayala = imageSettings('ayala');
  const ocean = imageSettings('ocean');
  const quoteSettings: WinningQuoteSettings = {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { ...WINNING_SHORT_STAY_RATIOS },
    peakSeasonFeePerWeek: 60,
    peakSeasonRanges: [{ id: 'cala-2027-summer', label: '2027/07/04–08/28暑假旺季', ...CALA_PEAK_RANGE_2027, enabled: true }],
    promotions: createPromotions(),
    localFeeIntro: LOCAL_FEE_INTRO,
    courseTableTitle: 'Winning 4周课程费',
    courseTableNote: '课程费按4周计算；1–3周按4周价的40%、60%、80%计算，5周以上按比例。2027年价格学校尚未公布，暂按现行价格预估。',
    groupClassNote: '每节课50分钟，周一至周五上课。',
    roomTableTitle: 'Winning 4周食宿费',
    roomTableNote: '每人4周的房费和餐费；平日三餐，周六不供餐，周日只供晚餐。周日14:00后入住、周六12:00前退房。',
    stayPolicyTitle: 'Winning 入住与退房提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日14:00后入住', note: '周一新生说明会和分级测试后开课。' },
      { label: '退房日期', value: '课程结束后的周六12:00前', note: '押金在毕业周的周四退还。' },
      { label: '提前入住和延后退房', value: '按晚另付，须提前预约', note: '只接受短期加住，按空房安排。' },
    ],
    extraNightRates: [],
    winningPolicyVersion: WINNING_POLICY_VERSION,
  };
  return {
    schemaVersion: 1,
    schoolCode: WINNING_SCHOOL_CODE,
    courses: WINNING_COURSE_FEES.map(course),
    rooms: WINNING_ROOM_FEES.map(room),
    localFees: createLocalFees(),
    quoteSettings,
    quoteImageSettings: ayala,
    campusQuoteImageSettings: { ayala, ocean },
    media: [],
  };
};

/** Fills a saved or previewed document up to the current schema; returns a copy. */
export const cloneWinningContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultWinningContentConfig();
  if (value?.schemaVersion !== 1 || value.schoolCode !== WINNING_SCHOOL_CODE) return defaults;
  const clone = copyJson(value);
  clone.courses ??= copyJson(defaults.courses);
  clone.rooms ??= copyJson(defaults.rooms);
  clone.localFees ??= copyJson(defaults.localFees);
  clone.quoteSettings = { ...copyJson(defaults.quoteSettings), ...(clone.quoteSettings ?? {}) };
  clone.quoteSettings.promotions ??= copyJson(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= copyJson(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteSettings.peakSeasonRanges ??= copyJson(defaults.quoteSettings.peakSeasonRanges);
  (clone.quoteSettings as WinningQuoteSettings).winningPolicyVersion = WINNING_POLICY_VERSION;
  clone.media ??= [];
  clone.campusQuoteImageSettings ??= {};
  for (const campus of ['ayala', 'ocean']) {
    const base = defaults.campusQuoteImageSettings![campus];
    const saved = clone.campusQuoteImageSettings[campus];
    clone.campusQuoteImageSettings[campus] = {
      ...copyJson(base), ...(saved ?? {}),
      paymentNotes: { ...base.paymentNotes, ...(saved?.paymentNotes ?? {}) },
      promotionNotes: { ...base.promotionNotes, ...(saved?.promotionNotes ?? {}) },
      localFeeNotes: { ...base.localFeeNotes, ...(saved?.localFeeNotes ?? {}) },
      supplementalFeeNotes: { ...base.supplementalFeeNotes, ...(saved?.supplementalFeeNotes ?? {}) },
    };
  }
  clone.quoteImageSettings = clone.campusQuoteImageSettings['ayala'];
  return clone;
};

export const winningQuoteImageSettings = (content: CiaContentConfig, campus: WinningCampus): CiaQuoteImageSettings =>
  content.campusQuoteImageSettings?.[campus] ?? content.quoteImageSettings;

/** Whether a course or room of the shared document belongs to this campus ('both' or untagged: both campuses). */
export const winningOnCampus = (item: { campus?: string }, campus: WinningCampus): boolean =>
  !item.campus || item.campus === 'both' || item.campus === campus;

/** One campus's part of the shared document: its courses, rooms and quote-image copy. */
export function winningCampusContent(value: CiaContentConfig, campus: WinningCampus): CiaContentConfig {
  const content = cloneWinningContentConfig(value);
  content.courses = content.courses.filter(item => winningOnCampus(item, campus));
  content.rooms = content.rooms.filter(item => winningOnCampus(item, campus));
  content.quoteImageSettings = winningQuoteImageSettings(content, campus);
  return content;
}
