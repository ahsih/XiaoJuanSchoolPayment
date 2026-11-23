// ATC Language Schools quote engine. Builds the shared UkQuoteSheet (in euros), so the web table and the
// quote image show the same rows. Pure module: no Angular, DOM, storage or regex lookbehind.
import {
  UK_QUOTE_PLAN_TAGS,
  UK_QUOTE_WEBSITE,
  UkQuoteAmount,
  UkQuoteContact,
  UkQuoteInfoItem,
  UkQuoteMoneyRow,
  UkQuoteOptionalRow,
  UkQuoteSheet,
  UkQuoteTextRow,
  ukAddDays,
  ukCny,
  ukDateText,
  ukParseDate,
  ukShortDateText,
} from '../../../../components/uk-quote/uk-quote-sheet';
import {
  ATC_BLACK_NOVEMBER,
  ATC_CAMBRIDGE_SESSIONS,
  ATC_CAMPUSES,
  ATC_CHRISTMAS_BREAK,
  ATC_COURSES,
  ATC_EXAMS,
  ATC_FEES,
  ATC_FIRST_START,
  ATC_GE16_CONFIRM_BELOW,
  ATC_IELTS_FULL_WEEKS,
  ATC_LAST_START,
  ATC_MAX_COURSE_WEEKS,
  ATC_MEDIPEL_FROM_WEEKS,
  ATC_PUBLIC_HOLIDAYS_2027,
  ATC_RENEWAL,
  ATC_STUDY_WORK_WEEKS,
  ATC_TIE_FREE_WEEKS,
  AtcCampusId,
  AtcCourseId,
  AtcExamId,
  AtcRenewalCourse,
  AtcRoomId,
  AtcStayType,
  atcStayOption,
  atcStayRooms,
  atcWeeklyPrice,
} from './atc-pricing';

export type AtcProgramme = 'course' | 'renewal';
export type AtcAge = 'adult' | '17' | '16';
export type AtcTransfer = 'none' | 'arrival' | 'return';

export interface AtcPlanInput {
  campus: AtcCampusId;
  course: AtcCourseId;
  renewalCourse: AtcRenewalCourse;
  /** Course start Monday (YYYY-MM-DD). */
  start: string;
  weeks: number;
  stayType: AtcStayType;
  room: AtcRoomId;
  stayWeeks: number;
  exam: AtcExamId;
  privateHours: number;
  transfer: AtcTransfer;
}

export interface AtcQuoteInput {
  programme: AtcProgramme;
  /** Quote date (YYYY-MM-DD); offers are judged on it. */
  today: string;
  studentName: string;
  age: AtcAge;
  /** Former or current ATC student (renewal package only). */
  returningStudent: boolean;
  /** Two students on the same flight share the transfer (75 euros each way per person). */
  sharedTransfer: boolean;
  plans: AtcPlanInput[];
}

export interface AtcQuoteRate {
  eurToCny: number | null;
  date: string;
}

interface PlanLine {
  key: string;
  label: string;
  note?: string;
  amount: UkQuoteAmount;
}

interface PlanText {
  key: string;
  label: string;
  value: string;
}

interface PlanOptional extends UkQuoteOptionalRow {
  key: string;
}

export interface AtcPlanResult {
  title: string;
  weeks: number;
  required: PlanLine[];
  includes: PlanText[];
  optional: PlanOptional[];
  issues: string[];
  warnings: string[];
  total: number | null;
  dateText: string;
}

export const ATC_PROGRAMMES: Array<{ id: AtcProgramme; name: string; note: string }> = [
  { id: 'course', name: '语言课程', note: '1周起，每周一开课，可选住宿' },
  { id: 'renewal', name: '续签套餐', note: '已在爱尔兰、续签Stamp 2的学生' },
];

function isMonday(value: string): boolean {
  return ukParseDate(value)?.getUTCDay() === 1;
}

function monthOf(value: string): number {
  return Number(value.slice(5, 7));
}

/** Mondays from `from` to `to`, leaving out the given closed Mondays. */
export function atcMondays(from: string, to: string, skip: string[] = []): string[] {
  const list: string[] = [];
  let date = from;
  const first = ukParseDate(from);
  if (first) date = ukAddDays(from, (8 - first.getUTCDay()) % 7);
  for (; date <= to; date = ukAddDays(date, 7)) if (!skip.includes(date)) list.push(date);
  return list;
}

/** Mondays on which no course starts: public holidays and the Christmas closure. */
const ATC_NO_START_MONDAYS = [...ATC_CHRISTMAS_BREAK.closedMondays, ...ATC_PUBLIC_HOLIDAYS_2027.map(holiday => holiday.date)];

/** Start Mondays of an ordinary 2027 course (any Monday except public and Christmas holidays). */
export function atcCourseStarts(): string[] {
  return atcMondays(ATC_FIRST_START, ATC_LAST_START, ATC_NO_START_MONDAYS);
}

/** Start Mondays of the renewal package: from the next Monday until the latest start. */
export function atcRenewalStarts(today: string): string[] {
  return atcMondays(ukAddDays(today, 1), ATC_RENEWAL.startBy, ATC_RENEWAL.unconfirmedMondays);
}

export function atcBlackNovemberActive(today: string): boolean {
  return today <= ATC_BLACK_NOVEMBER.until;
}

export function atcRenewalActive(today: string): boolean {
  return today <= ATC_RENEWAL.bookBy;
}

/** Study Mondays of a course, skipping the weeks the school is closed for Christmas. */
export function atcStudyMondays(start: string, weeks: number): { mondays: string[]; skipped: string[] } {
  const mondays: string[] = [];
  const skipped: string[] = [];
  let date = start;
  while (mondays.length < weeks && mondays.length + skipped.length < 200) {
    if (ATC_CHRISTMAS_BREAK.closedMondays.includes(date)) skipped.push(date);
    else mondays.push(date);
    date = ukAddDays(date, 7);
  }
  return { mondays, skipped };
}

export function defaultAtcPlan(programme: AtcProgramme, today: string): AtcPlanInput {
  if (programme === 'renewal') {
    return {
      campus: 'dublin', course: 'ge20', renewalCourse: 'ge20', start: atcRenewalStarts(today)[0] ?? '',
      weeks: ATC_RENEWAL.courseWeeks, stayType: 'none', room: 'single', stayWeeks: ATC_RENEWAL.courseWeeks,
      exam: 'none', privateHours: 0, transfer: 'none',
    };
  }
  const starts = atcCourseStarts();
  const start = starts.find(date => date >= ukAddDays(today, 28)) ?? starts[0];
  return {
    campus: 'dublin', course: 'ge20', renewalCourse: 'ge20', start, weeks: 4, stayType: 'homestay', room: 'single',
    stayWeeks: 4, exam: 'none', privateHours: 0, transfer: 'arrival',
  };
}

export function defaultAtcQuote(today: string, programme: AtcProgramme = 'course'): AtcQuoteInput {
  return {
    programme, today, studentName: '', age: 'adult', returningStudent: false, sharedTransfer: false,
    plans: [defaultAtcPlan(programme, today)],
  };
}

/** Weeks of accommodation that cover the whole course, including the Christmas closure. */
export function atcCourseSpanWeeks(plan: Pick<AtcPlanInput, 'start' | 'weeks'>): number {
  return plan.weeks + atcStudyMondays(plan.start, plan.weeks).skipped.length;
}

function money(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

function ageLabel(age: AtcAge): string {
  return age === 'adult' ? '18岁及以上' : `${age}岁`;
}

function stayLines(input: AtcQuoteInput, plan: AtcPlanInput, result: AtcPlanResult, minor: boolean): void {
  if (plan.stayType === 'none') {
    result.includes.push({ key: 'stay', label: '住宿', value: '不含' });
    return;
  }
  const option = atcStayOption(plan.campus, plan.stayType, plan.room);
  if (!option) {
    result.issues.push('请重新选择房型');
    return;
  }
  const weeks = Math.max(0, Math.floor(plan.stayWeeks));
  if (weeks < 1) result.issues.push('住宿至少1周');
  if (option.type === 'self-catering' && minor) result.issues.push('学校公寓只接受18岁以上学生，16–17岁请选寄宿家庭双人间');
  else if (option.minAge > 16 && minor) result.issues.push('单人间只接受18岁以上学生，16–17岁请选寄宿家庭双人间');
  result.required.push({
    key: 'stay', label: `住宿：${option.name}`, note: `每周${option.price}欧元 × ${weeks}周（每周7晚）`, amount: option.price * weeks,
  });
  result.required.push({ key: 'stay-fee', label: '住宿安排费', note: '一次性', amount: ATC_FEES.accommodation });
  result.includes.push({
    key: 'stay', label: '住宿',
    value: option.type === 'homestay'
      ? `寄宿家庭${option.room === 'single' ? '单人间' : '双人间'}，{{${option.meals}}}`
      : `${option.shortName}，${option.meals}；床单毛巾已备`,
  });
  if (option.type === 'homestay') {
    result.optional.push({
      key: 'diet', label: '特殊饮食（寄宿家庭）', price: `每周最多加${ATC_FEES.dietMax}欧元`, note: '素食、清真或过敏等饮食要求，报名时告诉顾问',
    });
  }
  if (minor && plan.transfer === 'none') result.issues.push('16–17岁学生住学校安排的住宿，必须预订接机');
}

function transferLine(input: AtcQuoteInput, plan: AtcPlanInput, result: AtcPlanResult): void {
  const each = input.sharedTransfer ? ATC_FEES.transferShared : ATC_FEES.transferOne;
  if (plan.transfer === 'none') {
    result.optional.push({
      key: 'transfer', label: '都柏林机场接送', tag: '不在报价内',
      price: `每程${ATC_FEES.transferOne}欧元`, note: `2人同一航班每人每程${ATC_FEES.transferShared}欧元`,
    });
    return;
  }
  const trips = plan.transfer === 'return' ? 2 : 1;
  result.required.push({
    key: 'transfer', label: plan.transfer === 'return' ? '接机＋送机' : '接机',
    note: `${input.sharedTransfer ? '2人同航班，' : ''}每程${each}欧元 × ${trips}程`, amount: each * trips,
  });
}

function privateLine(plan: AtcPlanInput, result: AtcPlanResult): void {
  const hours = Math.max(0, Math.floor(plan.privateHours || 0));
  if (hours > 0) {
    result.required.push({ key: 'private', label: '一对一私教', note: `每小时${ATC_FEES.privateOne}欧元 × ${hours}小时`, amount: hours * ATC_FEES.privateOne });
  } else {
    result.optional.push({
      key: 'private', label: '一对一私教', price: `每小时${ATC_FEES.privateOne}欧元`, note: `2人小班每小时${ATC_FEES.privateTwo}欧元`,
    });
  }
}

function socialOptional(result: AtcPlanResult): void {
  result.optional.push({ key: 'social', label: '课外活动和出游', price: '0–70欧元', note: '半日0–25欧元，全天0–70欧元；部分活动免费，自愿报名' });
}

function computeRenewal(input: AtcQuoteInput, plan: AtcPlanInput, result: AtcPlanResult): void {
  const course = ATC_RENEWAL.courses.find(item => item.id === plan.renewalCourse) ?? ATC_RENEWAL.courses[1];
  const campus = ATC_CAMPUSES.find(item => item.id === plan.campus) ?? ATC_CAMPUSES[0];
  result.title = `${campus.shortName}·续签套餐·${course.id === 'ge16' ? '16课时' : '20课时'}`;
  result.weeks = ATC_RENEWAL.courseWeeks;
  if (!atcRenewalActive(input.today)) result.issues.push('续签套餐已于2026年11月30日截止报名');
  if (input.age !== 'adult') result.issues.push('续签套餐只接受18岁以上学生');
  if (!plan.start || !isMonday(plan.start) || plan.start > ATC_RENEWAL.startBy) result.issues.push('续签套餐须在2027年1月31日前开课，请重新选择开课日期');
  result.required.push({
    key: 'renewal', label: `续签套餐：${course.name}`,
    note: `原价${money(course.was)}欧元，25周课程＋8周假期`, amount: course.price,
  });
  if (input.returningStudent) {
    result.required.push({ key: 'returning', label: 'ATC老学员优惠', note: '曾在或正在ATC学习', amount: -ATC_RENEWAL.returningDiscount });
  }
  result.required.push({ key: 'registration', label: '注册费', amount: 'included' });
  result.required.push({ key: 'elearning', label: '电子学习平台和第一本教材', amount: 'included' });
  result.required.push({ key: 'medipel', label: '医疗保险和学费保障（MediPel）', amount: 'included' });
  result.includes.push(
    { key: 'course', label: '课程', value: `{{25周课程＋8周假期}}，${course.name}` },
    { key: 'class', label: '班级', value: '每班最多16人，平均10–12人；开课前在线分级测试' },
    { key: 'platform', label: '学习平台', value: '{{第一本教材和ATC Online学习平台}}' },
    { key: 'exam', label: '考试', value: '{{含TIE考试}}，可另付费改考剑桥或雅思' },
    { key: 'insurance', label: '保险', value: '{{医疗保险和学费保障（MediPel／PEL）}}' },
    { key: 'free', label: '免费活动', value: '入学导览、求职俱乐部（Job Club）、一对一导师面谈等' },
  );
  if (plan.stayType === 'none') result.includes.push({ key: 'stay', label: '住宿', value: '不含（已在爱尔兰的学生通常自行安排）' });
  else stayLines(input, plan, result, false);
  transferLine(input, plan, result);
  privateLine(plan, result);
  socialOptional(result);
  result.dateText = plan.start ? `${ukDateText(plan.start)}开课，25周课程＋8周假期` : '开课日期待选';
}

function computeCourse(input: AtcQuoteInput, plan: AtcPlanInput, result: AtcPlanResult): void {
  const campus = ATC_CAMPUSES.find(item => item.id === plan.campus) ?? ATC_CAMPUSES[0];
  const course = ATC_COURSES.find(item => item.id === plan.course) ?? ATC_COURSES[0];
  const minor = input.age !== 'adult';
  const ageYears = input.age === 'adult' ? 18 : Number(input.age);
  let weeks = Math.max(0, Math.floor(plan.weeks));
  let tuition: number | null = null;
  let tuitionNote = '';
  let start = plan.start;

  if (course.id === 'cambridge') {
    const session = ATC_CAMBRIDGE_SESSIONS.find(item => item.start === plan.start);
    if (!session) {
      result.issues.push('剑桥备考只在2027年1月4日、3月15日、9月20日开课，请重新选择开课日期');
    } else {
      weeks = session.weeks;
      tuition = session.prices[campus.id];
      tuitionNote = `固定开课，${session.weeks}周，每周20课时`;
      start = session.start;
    }
    result.warnings.push('剑桥纸笔考试日期可能在结课后，或需多住一周，请向顾问确认');
  } else {
    if (!start || !isMonday(start) || start < ATC_FIRST_START || start > ATC_LAST_START) {
      result.issues.push('请选择2027年的开课日期（每周一）');
    } else if (ATC_NO_START_MONDAYS.includes(start)) {
      result.issues.push('公共假日和圣诞假期不开课，请选其他周一');
    }
    if (weeks < 1 || weeks > ATC_MAX_COURSE_WEEKS) result.issues.push(`课程周数需在1–${ATC_MAX_COURSE_WEEKS}周之间`);
    if (weeks < course.minWeeks) result.issues.push(`${course.shortName}至少报${course.minWeeks}周`);
    const weekly = course.priceKey && weeks >= 1 ? atcWeeklyPrice(campus.id, course.priceKey, weeks) : null;
    if (weekly !== null && weeks >= course.minWeeks) {
      tuition = weekly * weeks;
      tuitionNote = `${weeks}周价格档，每周${weekly}欧元 × ${weeks}周`;
    }
    if (course.id === 'ge16' && weeks >= course.minWeeks && weeks < ATC_GE16_CONFIRM_BELOW) {
      result.warnings.push('16课时课程报8–11周需学校确认能否开班');
    }
    if (course.id === 'ielts' && weeks >= 1 && weeks < ATC_IELTS_FULL_WEEKS) {
      result.warnings.push('雅思完整备考课程为8周，少于8周学不完全部备考内容');
    }
  }

  result.weeks = weeks;
  result.title = `${campus.shortName}·${course.shortName}·${weeks}周`;

  if (ageYears < campus.minAge) result.issues.push(`${campus.shortName}最低入学年龄${campus.minAge}岁`);
  if (course.minAge && ageYears < course.minAge) result.issues.push(`${course.shortName}只接受${course.minAge}岁以上学生`);

  const study = start && weeks > 0 ? atcStudyMondays(start, weeks) : { mondays: [], skipped: [] };
  if (minor && weeks > 4 && study.mondays.some(monday => {
    const months = [monthOf(monday), monthOf(ukAddDays(monday, 4))];
    return months.some(month => month >= 9 || month <= 5);
  })) {
    result.issues.push('16–17岁学生9月至次年5月最多学习4周');
  }
  if (study.skipped.length) {
    result.warnings.push('课程跨圣诞假期（2027年12月18日–2028年1月3日学校放假），结课日已顺延2周；假期如需住宿，按周计费');
  }

  if (tuition !== null) result.required.push({ key: 'tuition', label: `课程学费：${course.name}`, note: tuitionNote, amount: tuition });
  if (tuition !== null && atcBlackNovemberActive(input.today)) {
    result.required.push({
      key: 'black-november', label: '黑色11月优惠：学费9折', note: '2026年11月30日前报名',
      amount: -Math.round(tuition * ATC_BLACK_NOVEMBER.rate),
    });
  }
  result.required.push({ key: 'registration', label: '注册费', note: '一次性', amount: ATC_FEES.registration });
  result.required.push({ key: 'elearning', label: '电子学习平台和第一本教材', note: '一次性', amount: ATC_FEES.elearning });
  if (weeks >= ATC_MEDIPEL_FROM_WEEKS) {
    result.required.push({ key: 'medipel', label: '医疗保险和学费保障（MediPel）', note: '非欧盟学生约3个月以上必买', amount: ATC_FEES.medipel });
  } else {
    result.optional.push({
      key: 'medipel', label: '医疗保险和学费保障（MediPel）', price: `${ATC_FEES.medipel}欧元`, note: '保期3个月起；短期学生也可自备旅行保险',
    });
  }

  const tieFree = weeks >= ATC_TIE_FREE_WEEKS;
  const exam = ATC_EXAMS.find(item => item.id === plan.exam);
  if (exam) {
    result.required.push({
      key: 'exam', label: `考试报名：${exam.name}`, note: '含报名、协助和寄送', amount: exam.id === 'tie' && tieFree ? 'included' : exam.price,
    });
  } else {
    const exams = ATC_EXAMS.filter(item => !(item.id === 'tie' && tieFree));
    const prices = exams.map(item => item.price);
    result.optional.push({
      key: 'exam', label: '考试报名', price: `${Math.min(...prices)}–${Math.max(...prices)}欧元`,
      note: exams.map(item => `${item.name} ${item.price}欧元`).join('；'),
    });
  }

  result.includes.push(
    { key: 'course', label: '课程', value: `每周${course.hoursPerWeek}课时，${course.timetable}，每课60分钟` },
    { key: 'class', label: '班级', value: '每班最多16人，平均10–12人；开课前在线分级测试' },
    { key: 'platform', label: '学习平台', value: '第一本教材和ATC Online（开课前1个月开通，结课后还能用3个月）' },
    { key: 'free', label: '免费活动', value: '入学导览、求职俱乐部（Job Club）、一对一导师面谈等' },
  );
  if (tieFree) result.includes.push({ key: 'tie', label: '考试', value: '{{含TIE考试}}（25周以上课程赠送）' });

  stayLines(input, plan, result, minor);
  transferLine(input, plan, result);
  privateLine(plan, result);
  socialOptional(result);

  if (study.mondays.length === weeks && weeks > 0) {
    const last = study.mondays[study.mondays.length - 1];
    const end = ukAddDays(last, course.id === 'ge16' ? 3 : 4);
    const stayWeeks = Math.max(0, Math.floor(plan.stayWeeks));
    const stayText = plan.stayType === 'none' || stayWeeks < 1
      ? ''
      : `\n住宿：${ukShortDateText(ukAddDays(start, -1))}入住，共${stayWeeks}周（${stayWeeks * 7}晚）`;
    result.dateText = `课程：${ukDateText(start)}–${ukShortDateText(end)}${stayText}`;
  } else {
    result.dateText = '日期待选';
  }
}

export function computeAtcPlan(input: AtcQuoteInput, plan: AtcPlanInput): AtcPlanResult {
  const result: AtcPlanResult = {
    title: '', weeks: 0, required: [], includes: [], optional: [], issues: [], warnings: [], total: null, dateText: '',
  };
  if (input.programme === 'renewal') computeRenewal(input, plan, result);
  else computeCourse(input, plan, result);
  const numbers = result.required.map(line => line.amount).filter((amount): amount is number => typeof amount === 'number');
  result.total = result.issues.length || !result.required.some(line => line.key === 'tuition' || line.key === 'renewal')
    ? null
    : numbers.reduce((sum, amount) => sum + amount, 0);
  return result;
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

export function buildAtcSheet(input: AtcQuoteInput, quoteDate: string, rate: AtcQuoteRate,
  contact: Omit<UkQuoteContact, 'website'>): UkQuoteSheet {
  const results = input.plans.map(plan => computeAtcPlan(input, plan));
  const multiple = results.length > 1;
  const tags = multiple ? UK_QUOTE_PLAN_TAGS.slice(0, results.length) : [''];

  const requiredRows: UkQuoteMoneyRow[] = unionKeys(results.map(result => result.required)).map(key => {
    const lines = results.map(result => result.required.find(line => line.key === key));
    const labels = lines.map(line => line?.label);
    const first = lines.find(Boolean)!;
    const sameLabel = new Set(labels.filter(Boolean)).size === 1;
    const label = sameLabel ? first.label : first.label.split('：')[0];
    const notes = sameLabel ? lines.map(line => line?.note) : lines.map(line => line ? [line.label.split('：')[1], line.note].filter(Boolean).join('，') : undefined);
    return { label, note: combined(notes, tags), amounts: lines.map(line => line ? line.amount : null) };
  });
  const includeRows: UkQuoteTextRow[] = unionKeys(results.map(result => result.includes)).map(key => {
    const values = results.map(result => result.includes.find(item => item.key === key)?.value ?? '不含');
    const label = results.map(result => result.includes.find(item => item.key === key)).find(Boolean)!.label;
    return { label, values: new Set(values).size === 1 ? [values[0]] : values };
  });
  const optionalRows: UkQuoteOptionalRow[] = unionKeys(results.map(result => result.optional)).map(key => {
    const rows = results.map(result => result.optional.find(item => item.key === key));
    const first = rows.find(Boolean)!;
    const only = multiple && rows.some(row => !row) ? rows.map((row, index) => row ? tags[index] : '').filter(Boolean).join('、') : '';
    const note = [first.note, only ? `仅${only}` : ''].filter(Boolean).join('；');
    return { label: first.label, price: first.price, tag: first.tag, note: note || undefined };
  });
  const issues = results.flatMap((result, index) => result.issues.map(issue => multiple ? `${tags[index]}：${issue}` : issue));
  const warnings = [...new Set(results.flatMap((result, index) =>
    result.warnings.map(warning => multiple && results.some(other => !other.warnings.includes(warning)) ? `${tags[index]}：${warning}` : warning)))];
  const totals = results.map(result => result.total);
  const usableRate = rate.eurToCny !== null && Number.isFinite(rate.eurToCny) && rate.eurToCny > 0 ? rate.eurToCny : null;

  const renewal = input.programme === 'renewal';
  const campuses = [...new Set(input.plans.map(plan => plan.campus))];
  const campusName = campuses.length === 1 ? (ATC_CAMPUSES.find(item => item.id === campuses[0])?.shortName ?? '') : '';
  const weeksList = [...new Set(results.map(result => result.weeks))];
  const weeksText = weeksList.length === 1 && weeksList[0] > 0 ? `${weeksList[0]}周` : '';
  const courseIds = [...new Set(input.plans.map(plan => renewal ? plan.renewalCourse : plan.course))];
  const course = ATC_COURSES.find(item => item.id === courseIds[0]);

  const title = renewal
    ? `ATC ${campusName || '爱尔兰'} 续签套餐报价`
    : `ATC ${campusName || '爱尔兰'} ${weeksText}报价`;
  const eyebrow = campuses.length === 1
    ? (campuses[0] === 'bray' ? '爱尔兰 · 布雷（海边小镇）' : '爱尔兰 · 都柏林市中心')
    : '爱尔兰 · 布雷／都柏林';
  const subtitle = renewal
    ? `25周课程＋8周假期（已在爱尔兰续签的学生）${multiple ? '｜两种方案' : ''}`
    : `${courseIds.length === 1 && course ? course.name : '成人英语课程'}${multiple ? '｜两种方案对比' : ''}`;

  let requirement = '布雷校区16岁以上，都柏林校区17岁以上\n零基础到C1都可报';
  if (renewal) requirement = '18岁以上非欧盟学生\n在爱尔兰续签Stamp 2或打工度假（WHA）';
  else if (courseIds.length === 1 && course?.id === 'ielts') requirement = '18岁以上\n英语B2以上';
  else if (courseIds.length === 1 && course?.id === 'cambridge') requirement = '18岁以上\nB2 First需B2，C1 Advanced需C1';

  const info: UkQuoteInfoItem[] = [
    { label: '学校', value: 'ATC Language Schools（爱尔兰）\n1973年创办，ACELS、Eaquals认证' },
    { label: '入学要求', value: requirement },
  ];
  const student = [input.studentName.trim(), renewal ? '' : ageLabel(input.age)].filter(Boolean).join('，');
  if (student) info.push({ label: '学生', value: student, wide: true });
  const dateValues = results.map(result => result.dateText || '日期待选');
  info.push({
    label: weeksText ? `日期（课程${weeksText}）` : '日期',
    value: new Set(dateValues).size === 1 ? dateValues[0] : dateValues.map((value, index) => `${tags[index]}：${value}`).join('\n'),
    wide: true,
  });

  const notes = [
    '以上为2027年价格，报名前以学校最终确认为准。',
    '费用以欧元计，人民币按参考汇率估算，最终以实际支付汇率为准。',
    '不含机票、签证、个人零花钱和自费活动。',
  ];
  if (!renewal) notes.push('课程每周一开课（公共假日和圣诞假期除外）；公共假日停课，缺课不退费。');
  if (input.plans.some(plan => plan.stayType !== 'none')) notes.push('住宿按每周7晚计，周六或周日入住和离开；房间以学校最终确认为准。');
  notes.push('课程安排、活动和住宿规定仅供参考，学校可能随时调整。');
  if (renewal) {
    notes.push('续签套餐须2026年11月30日前报名、2027年1月31日前开课，所有费用一次付清；名额有限。');
    notes.push('续签需提供IRP卡复印件、护照复印件和在爱尔兰的完整住址。');
  } else {
    if (atcBlackNovemberActive(input.today)) notes.push('黑色11月优惠：2026年11月30日前报名，课程学费9折，以学校确认为准。');
    if (input.age === 'adult' && results.some(result => result.weeks >= ATC_STUDY_WORK_WEEKS)) {
      notes.push('25周及以上课程可申请爱尔兰学生签证（Stamp 2），上课期间每周最多打工20小时、假期最多40小时；以爱尔兰移民局最新规定为准。');
    }
  }
  notes.push(...warnings);

  return {
    fileName: `${title}.png`,
    schoolName: 'ATC Language Schools',
    eyebrow,
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
    examplesTitle: '课外活动示例（以学校当期安排为准）',
    examples: [
      { label: '每周', text: '周一城市徒步导览，周二求职俱乐部，周三英语角，周四爱尔兰舞蹈，周末徒步俱乐部' },
      { label: '每月', text: '圣帕特里克节、格兰达洛一日游、布卢姆日、夏日节、戈尔韦一日游、万圣节、圣诞颂歌等' },
    ],
    optionalRows,
    optionalNote: '按需自选，不含在以上费用中',
    notes,
    contact: { ...contact, website: UK_QUOTE_WEBSITE },
    issues,
    warnings,
  };
}

/** Room choices for the calculator. */
export function atcRoomsFor(plan: Pick<AtcPlanInput, 'campus' | 'stayType'>) {
  return plan.stayType === 'none' ? [] : atcStayRooms(plan.campus, plan.stayType);
}
