// Babel Academy of English quote engine. It turns the calculator's choices into the shared
// UkQuoteSheet (euros), which both the web table and the quote image render.
// Pure module: no Angular, DOM, storage or regex lookbehind.
import {
  UK_QUOTE_PLAN_TAGS,
  UK_QUOTE_WEBSITE,
  UkQuoteContact,
  UkQuoteInfoItem,
  UkQuoteMoneyRow,
  UkQuoteOptionalRow,
  UkQuoteSheet,
  UkQuoteTextRow,
  ukAddDays,
  ukCny,
  ukDateText,
  ukMoney,
  ukParseDate,
} from '../../../../components/uk-quote/uk-quote-sheet';
import {
  BABEL_ACCOMMODATIONS,
  BABEL_ACCOMMODATION_BOOKING_FEE,
  BABEL_CHRISTMAS_2027,
  BABEL_DIETS,
  BABEL_EXTRAS,
  BABEL_HOLIDAYS_2027,
  BABEL_SHORT_COURSES,
  BABEL_SHORT_FEES,
  BABEL_SHORT_MAX_WEEKS,
  BABEL_WORK_STUDY_COURSES,
  BABEL_WORK_STUDY_FEES,
  BABEL_WORK_STUDY_LAST_START,
  BABEL_WORK_STUDY_WEEKS,
  BabelAccommodationId,
  BabelDietId,
  BabelShortCourseId,
  BabelWorkStudyCourseId,
  babelIsBlackFriday,
} from './babel-pricing';

export type BabelProgramme = 'short' | 'work-study';

export const BABEL_PROGRAMMES: Array<{ id: BabelProgramme; name: string; note: string }> = [
  { id: 'short', name: '短期成人英语', note: '17岁以上，1周起，每周一开课' },
  { id: 'work-study', name: '半工半读（25周）', note: '18岁以上，长期英语课程' },
];

export interface BabelPlanInput {
  shortCourse: BabelShortCourseId;
  workStudyCourse: BabelWorkStudyCourseId;
  /** Course start, a Monday (YYYY-MM-DD). */
  start: string;
  /** Short-course weeks; Work & Study is always 25 weeks. */
  weeks: number;
  accommodation: BabelAccommodationId;
  accommodationWeeks: number;
  diet: BabelDietId;
}

export interface BabelQuoteInput {
  programme: BabelProgramme;
  studentName: string;
  age: 'adult' | 'seventeen';
  transfer: 'none' | 'one-way' | 'return';
  /** Transport card weeks, 0–4. */
  transportWeeks: number;
  socialWeeks: number;
  oneToOneHours: number;
  internship: boolean;
  ieltsExam: boolean;
  insurance: boolean;
  plans: BabelPlanInput[];
}

export interface BabelQuoteRate {
  eurToCny: number | null;
  date: string;
}

interface PlanLine {
  key: string;
  label: string;
  amount: number;
  note?: string;
}

interface PlanResult {
  title: string;
  dateText: string;
  required: PlanLine[];
  includes: Array<{ key: string; label: string; value: string }>;
  total: number | null;
  issues: string[];
  warnings: string[];
}

const CHRISTMAS_2027 = { start: ukAddDays(BABEL_CHRISTMAS_2027.lastClass, 1), end: ukAddDays(BABEL_CHRISTMAS_2027.restart, -1) };

function isMonday(value: string): boolean {
  return ukParseDate(value)?.getUTCDay() === 1;
}

/** The first Monday after `today`. */
export function babelNextMonday(today: string): string {
  let date = ukAddDays(today, 1);
  for (let index = 0; index < 7 && !isMonday(date); index += 1) date = ukAddDays(date, 1);
  return date;
}

/** Course-start Mondays the calculator offers; the 2027 Christmas break is left out. */
export function babelStartOptions(programme: BabelProgramme, today: string): string[] {
  const first = babelNextMonday(today);
  const last = programme === 'work-study'
    ? (babelIsBlackFriday(today) ? BABEL_WORK_STUDY_LAST_START.blackFriday : BABEL_WORK_STUDY_LAST_START.regular)
    : ukAddDays(first, 7 * 78);
  const list: string[] = [];
  for (let date = first; date <= last; date = ukAddDays(date, 7)) {
    if (date >= CHRISTMAS_2027.start && date <= CHRISTMAS_2027.end) continue;
    list.push(date);
  }
  return list.length ? list : [first];
}

export function babelHolidayOn(date: string): string | undefined {
  return BABEL_HOLIDAYS_2027.find(item => item.date === date)?.name;
}

export function defaultBabelPlan(programme: BabelProgramme, today: string): BabelPlanInput {
  const workStudy = programme === 'work-study';
  return {
    shortCourse: 'efl-am',
    workStudyCourse: 'efl-am',
    start: babelStartOptions(programme, today)[0],
    weeks: 4,
    accommodation: workStudy ? 'homestay-shared' : 'homestay-single',
    accommodationWeeks: 4,
    diet: 'none',
  };
}

export function defaultBabelQuote(today: string, programme: BabelProgramme = 'short'): BabelQuoteInput {
  return {
    programme,
    studentName: '',
    age: 'adult',
    transfer: 'none',
    transportWeeks: 0,
    socialWeeks: 0,
    oneToOneHours: 0,
    internship: false,
    ieltsExam: false,
    insurance: true,
    plans: [defaultBabelPlan(programme, today)],
  };
}

function wholeNumber(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

function weeksTouching(start: string, weeks: number, rangeStart: string, rangeEnd: string): boolean {
  const end = ukAddDays(start, weeks * 7 - 1);
  return start <= rangeEnd && end >= rangeStart;
}

function startText(start: string): string {
  const holiday = babelHolidayOn(start);
  return holiday ? `${ukDateText(start)}，逢${holiday}改为周二开课` : ukDateText(start);
}

function computePlan(input: BabelQuoteInput, plan: BabelPlanInput, blackFriday: boolean): PlanResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  const required: PlanLine[] = [];
  const includes: PlanResult['includes'] = [];
  const workStudy = input.programme === 'work-study';
  const priceLabel = blackFriday ? '黑五优惠价' : '学校价格';

  if (!ukParseDate(plan.start) || !isMonday(plan.start)) issues.push('开课日期需要选周一。');
  if (plan.start >= CHRISTMAS_2027.start && plan.start <= CHRISTMAS_2027.end) {
    issues.push('学校2027年12月18日至2028年1月3日圣诞放假，请选其他开课日期。');
  }

  let title = '';
  let dateText = '';
  if (workStudy) {
    const course = BABEL_WORK_STUDY_COURSES.find(item => item.id === plan.workStudyCourse) ?? BABEL_WORK_STUDY_COURSES[0];
    if (input.age !== 'adult') issues.push('半工半读项目需要年满18岁。');
    const lastStart = blackFriday ? BABEL_WORK_STUDY_LAST_START.blackFriday : BABEL_WORK_STUDY_LAST_START.regular;
    if (plan.start > lastStart) issues.push(`这个价格最晚${ukDateText(lastStart)}开课，请选更早的日期或联系顾问。`);
    if (!blackFriday) warnings.push('学校会在黑五活动后更新半工半读价格，此处按黑五前公布的价格计算，报名前以学校最新价格为准。');
    title = course.name;
    dateText = `${startText(plan.start)}开课`;
    required.push({ key: 'tuition', label: `学费（${BABEL_WORK_STUDY_WEEKS}周）`, amount: blackFriday ? course.blackFriday : course.regular, note: `${course.english}，${course.hours}，${priceLabel}` });
    required.push({ key: 'registration', label: '注册费', amount: BABEL_WORK_STUDY_FEES.registration, note: '一次性，不退' });
    required.push({ key: 'materials', label: '教材费', amount: BABEL_WORK_STUDY_FEES.materials });
    required.push({ key: 'tie', label: 'TIE英语考试费', amount: BABEL_WORK_STUDY_FEES.tieExam });
    required.push({ key: 'learner', label: '学生保障费（Learner Protection）', amount: BABEL_WORK_STUDY_FEES.learnerProtection });
    if (input.ieltsExam) required.push({ key: 'ielts-exam', label: '雅思考试费', amount: BABEL_WORK_STUDY_FEES.ieltsExam });
    if (input.insurance) required.push({ key: 'insurance', label: '医疗保险（学校代办）', amount: BABEL_WORK_STUDY_FEES.insurance });
    includes.push({ key: 'course', label: '课程', value: `{{${BABEL_WORK_STUDY_WEEKS}周}}${course.name}（${course.english}），${course.hours}` });
    if (course.id === 'plus') includes.push({ key: 'elective', label: '选修模块', value: '商务英语、雅思或口语强化三选一，每周5小时' });
  } else {
    const course = BABEL_SHORT_COURSES.find(item => item.id === plan.shortCourse) ?? BABEL_SHORT_COURSES[0];
    if (!wholeNumber(plan.weeks, 1, BABEL_SHORT_MAX_WEEKS)) issues.push(`短期课程周数需要是1–${BABEL_SHORT_MAX_WEEKS}周。`);
    const weeks = wholeNumber(plan.weeks, 1, BABEL_SHORT_MAX_WEEKS) ? plan.weeks : 0;
    const weekly = blackFriday ? course.blackFriday : course.regular;
    const tuition = weekly * weeks;
    title = `${course.name} ${weeks}周`;
    const lastFriday = ukAddDays(plan.start, weeks * 7 - 3);
    dateText = weeks ? `${startText(plan.start)}–${ukDateText(lastFriday)}` : startText(plan.start);
    required.push({ key: 'tuition', label: `学费（${weeks}周）`, amount: tuition, note: `${course.english}，每周${ukMoney(weekly)}欧元，${priceLabel}` });
    if (weeks >= BABEL_SHORT_FEES.longStayDiscountWeeks) {
      if (blackFriday) {
        warnings.push('12周以上学费85折未叠加在黑五优惠价上，能否叠加以学校确认为准。');
      } else {
        required.push({ key: 'discount', label: '12周以上学费85折', amount: -Math.round(tuition * BABEL_SHORT_FEES.longStayDiscountRate) });
      }
    }
    required.push({ key: 'registration', label: '注册费', amount: BABEL_SHORT_FEES.registration, note: '一次性，不退' });
    required.push({
      key: 'materials',
      label: '教材费',
      amount: weeks >= 12 ? BABEL_SHORT_FEES.materials12Plus : BABEL_SHORT_FEES.materialsUnder12,
      note: weeks >= 12 ? '12周及以上' : '1–11周',
    });
    includes.push({ key: 'course', label: '课程', value: `{{${weeks}周}}${course.name}（${course.english}），${course.hours}，${course.schedule}` });
    if (weeksTouching(plan.start, weeks, CHRISTMAS_2027.start, CHRISTMAS_2027.end)) {
      warnings.push('课程期间遇学校圣诞假期（2027年12月18日–2028年1月3日），假期周怎么安排以学校确认为准。');
    }
  }

  const maxAccommodationWeeks = workStudy ? BABEL_WORK_STUDY_WEEKS : BABEL_SHORT_MAX_WEEKS;
  const accommodation = BABEL_ACCOMMODATIONS.find(item => item.id === plan.accommodation);
  if (accommodation) {
    if (!wholeNumber(plan.accommodationWeeks, 1, maxAccommodationWeeks)) issues.push(`住宿周数需要是1–${maxAccommodationWeeks}周。`);
    const weeks = wholeNumber(plan.accommodationWeeks, 1, maxAccommodationWeeks) ? plan.accommodationWeeks : 0;
    required.push({ key: 'accommodation', label: `住宿（${weeks}周）`, amount: accommodation.price * weeks, note: `${accommodation.name}，${accommodation.detail}，每周${accommodation.price}欧元` });
    const diet = BABEL_DIETS.find(item => item.id === plan.diet);
    if (accommodation.id !== 'residence' && diet && diet.price) {
      required.push({ key: 'diet', label: '特殊饮食附加费', amount: diet.price * weeks, note: `${diet.name}，每周${diet.price}欧元` });
    }
    required.push({ key: 'booking', label: '住宿预订费', amount: BABEL_ACCOMMODATION_BOOKING_FEE, note: '一次性，不退' });
    includes.push({ key: 'accommodation', label: '住宿', value: `${accommodation.name}（${accommodation.detail}），{{${weeks}周}}` });
    title += ` · ${accommodation.name}`;
  } else {
    includes.push({ key: 'accommodation', label: '住宿', value: '不含，自行安排' });
    title += ' · 不订住宿';
  }

  if (input.transfer === 'one-way') required.push({ key: 'transfer', label: '机场接机（单程）', amount: BABEL_EXTRAS.transferOneWay });
  if (input.transfer === 'return') required.push({ key: 'transfer', label: '机场接送（往返）', amount: BABEL_EXTRAS.transferReturn });
  if (wholeNumber(input.transportWeeks, 1, 4)) {
    required.push({ key: 'transport', label: `交通卡（${input.transportWeeks}周）`, amount: BABEL_EXTRAS.transportAdult[input.transportWeeks - 1], note: '公交、火车、电车通用' });
  }
  if (input.socialWeeks > 0) {
    if (!wholeNumber(input.socialWeeks, 1, maxAccommodationWeeks)) issues.push('社交活动周数需要是整数。');
    else required.push({ key: 'social', label: `社交活动套餐（${input.socialWeeks}周）`, amount: BABEL_EXTRAS.socialPerWeek * input.socialWeeks, note: `每周${BABEL_EXTRAS.socialPerWeek}欧元` });
  }
  if (input.oneToOneHours > 0) {
    if (!wholeNumber(input.oneToOneHours, 1, 200)) issues.push('一对一课时需要是整数。');
    else required.push({ key: 'one-to-one', label: `一对一课（${input.oneToOneHours}小时）`, amount: BABEL_EXTRAS.oneToOnePerHour * input.oneToOneHours, note: `每小时${BABEL_EXTRAS.oneToOnePerHour}欧元` });
  }
  if (input.internship) required.push({ key: 'internship', label: '实习安排服务', amount: BABEL_EXTRAS.internship, note: '无薪工作体验' });

  includes.push({ key: 'service', label: '学生服务', value: '入学分级测试、每6周进度测试和老师一对一反馈、GELNET学习平台、中文工作人员、24小时紧急电话' });

  const total = issues.length ? null : Math.round(required.reduce((sum, line) => sum + line.amount, 0) * 100) / 100;
  return { title, dateText, required, includes, total, issues, warnings };
}

function unionKeys<T extends { key: string }>(lists: T[][]): string[] {
  const keys: string[] = [];
  lists.forEach(list => list.forEach(item => { if (!keys.includes(item.key)) keys.push(item.key); }));
  return keys;
}

function combined(values: Array<string | undefined>, tags: string[]): string | undefined {
  const present = values.filter((value): value is string => !!value);
  if (!present.length) return undefined;
  if (new Set(values).size === 1) return present[0];
  return values.map((value, index) => value ? `${tags[index]}：${value}` : '').filter(Boolean).join('；');
}

function optionalRows(input: BabelQuoteInput): UkQuoteOptionalRow[] {
  const rows: UkQuoteOptionalRow[] = [];
  if (input.transfer === 'none') {
    rows.push({ label: '机场接送', price: `单程${BABEL_EXTRAS.transferOneWay}欧元／往返${BABEL_EXTRAS.transferReturn}欧元` });
  }
  if (!input.transportWeeks) {
    rows.push({ label: '交通卡（1–4周）', price: BABEL_EXTRAS.transportAdult.map(price => `${price}`).join('／') + '欧元', note: '公交、火车、电车通用' });
  }
  if (!input.socialWeeks) rows.push({ label: '社交活动套餐', price: `每周${BABEL_EXTRAS.socialPerWeek}欧元` });
  if (!input.oneToOneHours) rows.push({ label: '一对一课', price: `每小时${BABEL_EXTRAS.oneToOnePerHour}欧元` });
  if (!input.internship) rows.push({ label: '实习安排服务', price: `${BABEL_EXTRAS.internship}欧元`, note: '无薪工作体验' });
  if (input.programme === 'work-study' && !input.ieltsExam) rows.push({ label: '雅思考试费', price: `${BABEL_WORK_STUDY_FEES.ieltsExam}欧元` });
  if (input.programme === 'work-study' && !input.insurance) rows.push({ label: '医疗保险（学校代办）', price: `${BABEL_WORK_STUDY_FEES.insurance}欧元` });
  return rows;
}

export function buildBabelSheet(input: BabelQuoteInput, today: string, quoteDate: string, rate: BabelQuoteRate,
  contact: Omit<UkQuoteContact, 'website'>): UkQuoteSheet {
  const blackFriday = babelIsBlackFriday(today);
  const results = input.plans.map(plan => computePlan(input, plan, blackFriday));
  const multiple = results.length > 1;
  const tags = multiple ? UK_QUOTE_PLAN_TAGS.slice(0, results.length) : [''];
  const workStudy = input.programme === 'work-study';

  const requiredRows: UkQuoteMoneyRow[] = unionKeys(results.map(result => result.required)).map(key => {
    const lines = results.map(result => result.required.find(line => line.key === key));
    const first = lines.find(Boolean)!;
    const labels = new Set(lines.filter(Boolean).map(line => line!.label));
    return {
      label: labels.size === 1 ? first.label : first.label.replace(/（.*）$/, ''),
      note: combined(lines.map(line => labels.size === 1 ? line?.note : line ? [line.label.match(/（(.*)）$/)?.[1], line.note].filter(Boolean).join('，') : undefined), tags),
      amounts: lines.map(line => line ? line.amount : null),
    };
  });
  const includeRows: UkQuoteTextRow[] = unionKeys(results.map(result => result.includes)).map(key => {
    const values = results.map(result => result.includes.find(item => item.key === key)?.value ?? '不含');
    const label = results.map(result => result.includes.find(item => item.key === key)).find(Boolean)!.label;
    return { label, values: new Set(values).size === 1 ? [values[0]] : values };
  });
  const issues = results.flatMap((result, index) => result.issues.map(issue => multiple ? `${tags[index]}：${issue}` : issue));
  const warnings = [...new Set(results.flatMap((result, index) =>
    result.warnings.map(warning => multiple && results.some(other => !other.warnings.includes(warning)) ? `${tags[index]}：${warning}` : warning)))];
  const totals = results.map(result => result.total);
  const usableRate = rate.eurToCny !== null && Number.isFinite(rate.eurToCny) && rate.eurToCny > 0 ? rate.eurToCny : null;

  const weeksList = [...new Set(input.plans.map(plan => plan.weeks))];
  const weeksText = workStudy ? '25周' : weeksList.length === 1 ? `${weeksList[0]}周` : '';
  const title = workStudy ? 'Babel 都柏林半工半读25周报价' : `Babel 都柏林成人英语${weeksText}报价`;
  const planNames = results.map(result => result.title).join('、');
  const offer = blackFriday ? '｜黑五优惠价（2026年11月30日前报名）' : '';
  const subtitle = `${workStudy ? '半工半读长期英语课程（18岁以上）' : '短期成人英语课程（17岁以上）'}｜${multiple ? `${planNames}两种方案` : planNames}${offer}`;

  const dateValues = results.map(result => result.dateText || '日期待确认');
  const info: UkQuoteInfoItem[] = [
    { label: '学校', value: 'Babel Academy of English（爱尔兰都柏林）\n市中心 Eden Quay 和 Capel Street 两个教学点' },
    { label: '入学要求', value: workStudy ? '18岁以上\n英语A1–C1，每周一开课' : '17岁以上，最短1周\n通用英语A1起，雅思课程B1+起' },
  ];
  if (input.studentName.trim()) info.push({ label: '学生', value: input.studentName.trim(), wide: true });
  info.push({
    label: workStudy ? '开课日期' : `日期（共${weeksText || '多种周数'}）`,
    value: new Set(dateValues).size === 1 ? dateValues[0] : dateValues.map((value, index) => `${tags[index]}：${value}`).join('\n'),
    wide: true,
  });

  const notes = [
    blackFriday ? '黑五优惠价需在2026年11月30日前报名，以学校最终确认为准。' : '以上为学校当前价格，报名前以学校最终确认为准。',
    '费用以欧元计，人民币按参考汇率估算，最终以实际支付汇率为准。',
    '不含机票、签证和个人零花钱。',
    '每周一开课，遇爱尔兰公共假期改为周二；课程和住宿安排仅供参考，学校可能随时调整，学位和房间以学校确认为准。',
  ];
  notes.push(...warnings);

  return {
    fileName: `${title}.png`,
    schoolName: 'Babel Academy of English',
    eyebrow: workStudy ? '爱尔兰都柏林 · 半工半读' : '爱尔兰都柏林 · 成人英语课程',
    title,
    subtitle,
    quoteDate,
    currencyLabel: '欧元',
    info,
    plans: results.map((result, index) => ({ tag: tags[index], title: result.title })),
    requiredRows,
    requiredTotals: totals,
    requiredTotalsCny: totals.map(total => ukCny(total, usableRate)),
    rateNote: usableRate
      ? `人民币按1欧元≈${usableRate.toFixed(4)}元估算（汇率日期${rate.date}），最终以实际支付汇率为准。`
      : '人民币汇率待更新，汇率更新后再保存报价图片。',
    includeRows,
    examplesTitle: '',
    examples: [],
    optionalRows: optionalRows(input),
    optionalNote: '按需自选，不含在以上费用中',
    notes,
    contact: { ...contact, website: UK_QUOTE_WEBSITE },
    issues,
    warnings,
  };
}
