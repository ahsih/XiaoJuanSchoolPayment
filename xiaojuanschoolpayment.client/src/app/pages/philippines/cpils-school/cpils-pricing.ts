import { CiaContentConfig, CiaCourseContent, CiaPromotionRule } from '../cia-school/cia-content-config';
import { QuotePlanKind, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';

const DAY = 86400000;
export const CPILS_POLICY_VERSION = 1;
export const cpilsMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
export const cpilsMonday = (sunday: string) => {
  const time = Date.parse(`${sunday}T00:00:00Z`);
  return Number.isFinite(time) ? new Date(time + DAY).toISOString().slice(0, 10) : '';
};

// Exact school rows. Ordinary stays >= 4 weeks still use the user-confirmed
// per-student four-week tier; the longer rounded source rows are not substitutes.
const short = (one: number | null, two: number | null, three: number | null) =>
  Object.fromEntries([one, two, three].flatMap((value, i) => value === null ? [] : [[String(i + 1), value]]));
const course2027: Record<string, { price: number; prices: Record<string, number>; weeks?: number[] }> = {
  'general-esl-light': { price: 700, prices: short(287, 455, 595) },
  'general-esl': { price: 982, prices: short(403, 638, 834) },
  'general-esl-plus': { price: 982, prices: short(403, 638, 834) },
  'esl-premium': { price: 1092, prices: short(448, 710, 928) },
  'premier-sparta': { price: 1092, prices: short(448, 710, 928) },
  'toeic-course': { price: 1092, prices: short(448, 710, 928) },
  'toefl-course': { price: 1092, prices: short(448, 710, 928) },
  'ielts-course': { price: 1152, prices: {} },
  'toeic-guarantee': { price: 0, prices: { '12': 3566 }, weeks: [12] },
  'ielts-guarantee-8-weeks': { price: 0, prices: { '8': 2750 }, weeks: [8] },
  'ielts-guarantee-12-weeks': { price: 0, prices: { '12': 3569 }, weeks: [12] },
  'business-english': { price: 1092, prices: {}, weeks: [4, 8] },
  'power-speaking-and-modern-communication': { price: 1092, prices: {}, weeks: [4, 8] },
  'tesol': { price: 1092, prices: {}, weeks: [4, 8, 12] },
  'medical-english': { price: 1092, prices: {}, weeks: [4, 8, 12] },
  'hotel-hospitality': { price: 1092, prices: {}, weeks: [4, 8, 12] },
  'barista-beverage': { price: 1092, prices: {}, weeks: [4, 8, 12] },
  'working-holiday': { price: 1092, prices: {}, weeks: [4, 8, 12] },
  'practicum': { price: 105, prices: {}, weeks: [4, 8, 12] },
  // The new school sheet does not quote Pre-IELTS separately.
  'pre-ielts-course': { price: 0, prices: {}, weeks: [] },
};
const room2027: Record<string, [number, number | null, number, number]> = {
  'regular-single': [1045, 428, 679, 888], 'regular-twin': [882, 362, 573, 750],
  'regular-triple': [814, 334, 529, 692], 'regular-quad': [735, null, 478, 625],
  'no-window-single': [1045, 428, 679, 888], 'no-window-twin': [882, 362, 573, 750],
  'premium-single': [1139, 467, 741, 968], 'premium-twin': [956, 392, 621, 812],
  'premium-triple': [893, 366, 580, 759], 'premium-quad': [819, null, 532, 696],
};
const additions = [
  ['esl-premium', 'ESL Premium'], ['tesol', 'TESOL'], ['medical-english', '医学英语'],
  ['hotel-hospitality', '酒店与服务业'], ['barista-beverage', '咖啡师与饮品'],
  ['working-holiday', '打工度假'], ['practicum', '实习'],
];

/** Adds the dated notice once; subsequent employee edits remain authoritative. */
export function upgradeCpils2027(config: CiaContentConfig): void {
  if ((config.quoteSettings.cpilsPolicy?.version ?? 0) >= CPILS_POLICY_VERSION) return;
  const settings = config.quoteSettings;
  settings.cpilsPolicy = {
    version: CPILS_POLICY_VERSION, grandfatherCourseStartEnd: '2027-05-29',
    promotionBlackoutStart: '2027-05-31', promotionBlackoutEnd: '2027-08-29',
    earlySummerRegistrationEnd: '2026-12-31', earlySummerMinimumWeeks: 8,
  };
  settings.futurePriceRegistrationStart = '2026-09-29';
  settings.futurePriceArrivalStart = '2027-01-01';
  for (const [id, name] of additions) if (!config.courses.some(item => item.id === id)) {
    config.courses.push({ id, name, tuition: 0, tuition2027: 0, schedule: '课程安排与入学要求请向顾问确认。', suitable: '', note: '2027年新增价格项目；2026年价格须确认。', enabled: true, sortOrder: config.courses.length });
  }
  for (const item of config.courses) {
    const next = course2027[item.id];
    if (!next) continue;
    item.tuition2027 = next.price;
    item.feeByWeeks2027 = { ...next.prices };
    item.allowedWeeks2027 = next.weeks;
    if (item.id.includes('guarantee')) {
      item.allowedWeeks = item.id === 'ielts-guarantee-8-weeks' ? [8] : [12];
      item.feeByWeeks = { [item.allowedWeeks[0]]: cpilsMoney(item.tuition * item.allowedWeeks[0] / 4) };
      item.note = item.suitable = `须一次注册${item.allowedWeeks[0]}周；入学门槛及保分条件请向顾问确认。`;
    }
    if (item.id === 'pre-ielts-course') item.note = item.suitable = '2027年价目表未单列雅思预备课程价格，请向顾问确认。';
  }
  for (const item of config.rooms) {
    const next = room2027[item.id];
    if (!next) continue;
    item.fee2027 = next[0];
    item.feeByWeeks2027 = short(next[1], next[2], next[3]);
    if (item.id.startsWith('no-window')) item.note = '窗户面向走廊，无对外窗；按所选日期确认空房及优惠。';
    if (item.id === 'regular-quad') item.note = '经济型校内住宿；一周短住未列价格。';
  }
  const datedFees: Record<string, Partial<CiaContentConfig['localFees'][number]>> = {
    management: { futureAmount: 600, futurePeriodWeeks: 1, futureRounding: 'proportional', futureNote: '2027/01/01起每周600比索；跨年住宿按生效日期分段预估。' },
    arp: { futureAmount: 200, futureNote: '2027年ARP参考200比索；首次续签或长期签证按学校要求办理。' },
    pickup: { futureAmount: 1200, futureNote: '2027年接机参考1,200比索；学校团体接机及同行收费单位须确认。' },
    'student-id': { futureName: 'ID照片', futureAmount: 100, futureNote: '2027年价目表列为ID照片，一次100比索。' },
    'fan-prepayment': { futureName: 'ID-Load预存', futureAmount: 1000, futureNote: '2027年价目表列为ID-Load预存1,000比索；用途及退还条件须由学校确认。' },
    'visa-extension': { futureRates: [5130, 6400, 4440, 4440, 4440, 4400], futureNote: '按学校30天续签收费方案预估；第二次59天方案6,900比索，第三至第六次59天方案各4,940比索，需学校确认办理方案。' },
  };
  for (const item of config.localFees) {
    const oldNote = item.note;
    const next = datedFees[item.id];
    if (next) Object.assign(item, { futureEffectiveStart: '2027-01-01', ...next });
    if (item.id === 'electricity') item.note = '电费按22比索／千瓦时实际用量结算；当前暂按每4周2,000比索准备。';
    if (item.id === 'books') item.note = '学校教材参考1,500–2,500比索，按实际购买结算；当前暂按每4周2,500比索准备。';
    if (item.note !== oldNote && config.quoteImageSettings.localFeeNotes?.[item.id] === oldNote) config.quoteImageSettings.localFeeNotes[item.id] = item.note;
  }
  if (!config.localFees.some(item => item.id === 'crtv')) config.localFees.push({ id: 'crtv', name: 'CRTV（超过24周）', amount: 1400, currency: 'PHP', billingRule: 'optional', includeInTotal: false, note: '2027年超过24周参考1,400比索；当前报价最多24周，不计入合计。', enabled: true, sortOrder: 13 });
  const terms = '报名2026/09/29–2027/12/27，开课2027/01/01–12/27；不适用于2027/05/31–08/29开课。';
  const promotion = (id: string, name: string, description: string, sortOrder: number, extra: Partial<CiaPromotionRule>): CiaPromotionRule => ({
    id, name, description, enabled: true, sortOrder, priority: sortOrder * 10, stackable: true, newStudentsOnly: false,
    discountType: 'none', discountValue: 0, appliesTo: 'tuition-and-accommodation', waiveRegistration: false,
    minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, coverageTarget: 'none',
    registrationStart: '2026-09-29', registrationEnd: '2027-12-27', arrivalStart: '2027-01-01', arrivalEnd: '2027-12-27', ...extra,
  });
  const promos = [
    promotion('cpils-scholarship-2027', '2027年奖学金优惠', `${terms}至少注册4周，学费及住宿费减免5%，可与思达优惠叠加。`, 7, { discountType: 'percentage', discountValue: 5 }),
    promotion('cpils-no-window-2027', '2027年无对外窗房优惠', `${terms}无对外窗单人／双人房：4–7周50美元、8–11周100美元、12–15周150美元、16–19周200美元、20–23周250美元、24周300美元；可与其他优惠同享。`, 8, { discountType: 'fixed', discountValue: 50, appliesTo: 'accommodation', eligibleRoomIds: ['no-window-single', 'no-window-twin'], minimumAccommodationWeeks: 4, incrementWeeks: 4, incrementValue: 50 }),
    promotion('cpils-ielts-exam-2027', '2027年雅思官方考试赠送', `${terms}雅思课程一次注册12周及以上，赠1次官方考试，可与其他优惠同享。`, 9, { minimumCourseWeeks: 12, eligibleCourseIds: ['ielts-course', 'ielts-guarantee-12-weeks'], discountValue: 1 }),
    promotion('cpils-toeic-exam-2027', '2027年托业官方考试赠送', `${terms}托业课程4–7周赠1次，每满4周增加1次，24周赠6次；可与其他优惠同享。`, 10, { eligibleCourseIds: ['toeic-course', 'toeic-guarantee'], discountValue: 1, incrementWeeks: 4, incrementValue: 1 }),
  ];
  for (const rule of promos) if (!settings.promotions.some(item => item.id === rule.id)) settings.promotions.push(rule);
  if (!settings.peakSeasonRanges.some(item => item.id === 'cpils-summer-2027')) settings.peakSeasonRanges.push({ id: 'cpils-summer-2027', label: '2027暑假旺季', start: '2027-07-04', end: '2027-08-28', enabled: true });
  settings.courseTableTitle = 'CPILS 2027年课程价格';
  settings.roomTableTitle = 'CPILS 2027年住宿价格';
  settings.courseTableNote = '2026/09/29起报名且2027年开课适用新价；2026/09/28及之前报名、2027/01/01–05/29开课保留2026标准价，不适用2027学校优惠。';
  settings.roomTableNote = '2027年住宿价格与学费按同一报名政策执行；房费按人报价，空房须按入住日期确认。';
  settings.groupClassNote = '保分班为固定8周或12周项目；商务／PMC为4周或8周，TESOL及职业课程为4周、8周或12周。降级换课不退差价（课程资格不符除外）。';
  settings.stayPolicies.push({ label: '2027暑期报名', value: '提前报名至少8周', note: '2026/12/31及之前报名、学习涉及2027/07/05–08/29旺季，至少注册8周；4周名额另行通知。' });
  settings.localFeeIntro = '当地费用以比索计价。2027/01/01起执行新标准，包括跨年在校学生；水电、教材及跨年分段金额为预算参考，最终按学校账单结算。';
  config.quoteImageSettings.localFeeIntro = settings.localFeeIntro;
}

export interface CpilsPlanContext { quotePlan: SchoolQuotePlan; selectedRegistrationDate: string; }
export type CpilsPriceYear = 2026 | 2027 | 'unconfirmed';
export function cpilsPriceYear(config: CiaContentConfig, student: CpilsPlanContext): CpilsPriceYear {
  const start = cpilsMonday(student.quotePlan.courses[0]?.startDate ?? '');
  const settings = config.quoteSettings;
  if (!start || !student.selectedRegistrationDate) return 'unconfirmed';
  if (start < settings.futurePriceArrivalStart) return 2026;
  if (start > '2027-12-31') return 'unconfirmed';
  if (student.selectedRegistrationDate >= settings.futurePriceRegistrationStart) return 2027;
  return start <= settings.cpilsPolicy!.grandfatherCourseStartEnd ? 2026 : 'unconfirmed';
}

export function cpilsMergedCourses(plan: SchoolQuotePlan): QuotePlanRow[] {
  const merged: QuotePlanRow[] = [];
  for (const row of plan.courses) {
    const last = merged.at(-1);
    if (last?.optionId === row.optionId && Date.parse(row.startDate) === Date.parse(plan.end(last)) + DAY) last.weeks += row.weeks;
    else merged.push({ ...row });
  }
  return merged;
}

export function cpilsRowPrice(config: CiaContentConfig, student: CpilsPlanContext, kind: QuotePlanKind, row: QuotePlanRow): number {
  const year = cpilsPriceYear(config, student);
  if (year === 'unconfirmed') return 0;
  const item = (kind === 'course' ? config.courses : config.rooms).find(option => option.id === row.optionId && option.enabled);
  if (!item) return 0;
  const course = item as CiaCourseContent;
  const exact = year === 2027 ? item.feeByWeeks2027 : item.feeByWeeks;
  if (kind === 'course' && row.optionId.includes('guarantee')) {
    const merged = cpilsMergedCourses(student.quotePlan).find(group => group.optionId === row.optionId && row.startDate >= group.startDate && row.startDate <= student.quotePlan.end(group));
    if (!merged || exact?.[merged.weeks] === undefined) return 0;
    const offset = (Date.parse(row.startDate) - Date.parse(merged.startDate)) / (7 * DAY);
    return cpilsMoney(cpilsMoney(exact[merged.weeks] * (offset + row.weeks) / merged.weeks) - cpilsMoney(exact[merged.weeks] * offset / merged.weeks));
  }
  const tier = student.quotePlan.courseWeeks < 4 ? student.quotePlan.courseWeeks : 4;
  if (tier < 4) return exact?.[tier] === undefined ? 0 : cpilsMoney(exact[tier] / tier * row.weeks);
  const price = 'tuition' in item ? year === 2027 ? course.tuition2027 : course.tuition : year === 2027 ? item.fee2027 ?? 0 : item.fee;
  return cpilsMoney(price / 4 * row.weeks);
}

export function cpilsPolicyError(config: CiaContentConfig, student: CpilsPlanContext): string {
  const plan = student.quotePlan;
  if (plan.date(student.selectedRegistrationDate) === null) return '请选择有效的预计报名日。';
  if (student.selectedRegistrationDate > cpilsMonday(plan.courses[0]?.startDate ?? '')) return '预计报名日不能晚于开课日。';
  const year = cpilsPriceYear(config, student);
  if (year === 'unconfirmed') return '所选报名日与开课日的价格尚未确认，请联系顾问报价。';
  for (const row of cpilsMergedCourses(plan)) {
    const item = config.courses.find(course => course.id === row.optionId);
    if (!item) continue;
    const weeks = year === 2027 ? item.allowedWeeks2027 : item.allowedWeeks;
    if (weeks && !weeks.includes(row.weeks)) return weeks.length ? `${item.name}须一次注册${weeks.join('／')}周，请调整课程安排。` : `${item.name}的2027年价格尚未确认，请联系顾问。`;
    if (cpilsRowPrice(config, student, 'course', row) <= 0) return `${item.name}暂无所选年份及周数价格，请联系顾问。`;
  }
  for (const row of plan.rooms) if (cpilsRowPrice(config, student, 'room', row) <= 0) return '所选房型暂无该年份及短住周数价格，请联系顾问。';
  const policy = config.quoteSettings.cpilsPolicy!;
  const summer = config.quoteSettings.peakSeasonRanges.find(range => range.id === 'cpils-summer-2027' && range.enabled);
  if (summer && student.selectedRegistrationDate <= policy.earlySummerRegistrationEnd && plan.overlapWeeks(summer.start, summer.end) > 0 && plan.courseWeeks < policy.earlySummerMinimumWeeks) return `2027暑期提前报名须至少${policy.earlySummerMinimumWeeks}周；短期名额待学校通知，请联系顾问。`;
  return '';
}

export function cpils2027Eligible(config: CiaContentConfig, student: CpilsPlanContext, rule: CiaPromotionRule | undefined): boolean {
  if (!rule?.enabled || cpilsPriceYear(config, student) !== 2027) return false;
  const start = cpilsMonday(student.quotePlan.courses[0]?.startDate ?? '');
  const policy = config.quoteSettings.cpilsPolicy!;
  return !(start >= policy.promotionBlackoutStart && start <= policy.promotionBlackoutEnd)
    && (!rule.registrationStart || student.selectedRegistrationDate >= rule.registrationStart)
    && (!rule.registrationEnd || student.selectedRegistrationDate <= rule.registrationEnd)
    && (!rule.arrivalStart || start >= rule.arrivalStart) && (!rule.arrivalEnd || start <= rule.arrivalEnd)
    && student.quotePlan.courseWeeks >= rule.minimumCourseWeeks && student.quotePlan.roomWeeks >= rule.minimumAccommodationWeeks;
}
