// St Giles quote engine: form input -> shared UK quote sheet. Pure functions only (no Angular,
// DOM, storage or regex lookbehind) so the mini program can bundle it later.
// Each year-round campus page quotes three programmes:
//   adult   tiered group or one-to-one tuition plus homestay or residence (14+ or 16+ by campus)
//   junior  all-inclusive summer centre packages (8–17); the St Giles overview page quotes all centres
//   family  summer family courses: children's packages plus accompanying adults
// Up to three plans are compared side by side. Optional services stay reference prices until the
// student ticks them (input.extras); a ticked service is added to every plan it applies to.
import {
  UK_QUOTE_MAX_PLANS,
  UK_QUOTE_PLAN_TAGS,
  UK_QUOTE_WEBSITE,
  UkQuoteAmount,
  UkQuoteContact,
  UkQuoteInfoItem,
  UkQuoteMoneyRow,
  UkQuoteOptionalRow,
  UkQuoteSheet,
  ukAddDays,
  ukCny,
  ukDateText,
  ukIsSunday,
  ukOverlapWeeks,
  ukParseDate,
} from '../../../../components/uk-quote/uk-quote-sheet';
import {
  ST_GILES_CAMPUSES,
  ST_GILES_FAMILY_COMMON,
  ST_GILES_FEES,
  ST_GILES_HOMESTAY_LUNCH,
  ST_GILES_JUNIOR,
  ST_GILES_JUNIOR_CENTRES,
  StGilesAgeBand,
  StGilesAirport,
  StGilesAirportId,
  StGilesCampusId,
  StGilesCampusPricing,
  StGilesCourseId,
  StGilesHomestayBoard,
  StGilesHomestayTier,
  StGilesJuniorCentre,
  StGilesJuniorCentreId,
  StGilesOneToOneId,
  StGilesResidence,
  StGilesRoom,
  stGilesCourseRate,
  stGilesHomestayPrice,
  stGilesOneToOneRate,
} from './st-giles-pricing';

export type StGilesProgramme = 'adult' | 'junior' | 'family';
export type StGilesCourseChoice = StGilesCourseId | StGilesOneToOneId;
export type StGilesAccommodation = 'none' | 'homestay' | 'residence';

export const ST_GILES_MAX_PLANS = UK_QUOTE_MAX_PLANS;

export const ST_GILES_AGE_BANDS: Array<{ id: StGilesAgeBand; name: string; min: number; max: number }> = [
  { id: 'adult', name: '18岁及以上', min: 18, max: 99 },
  { id: 'minor16', name: '16–17岁', min: 16, max: 17 },
  { id: 'minor14', name: '14–15岁', min: 14, max: 15 },
];

export const ST_GILES_ONE_TO_ONE: Array<{ id: StGilesOneToOneId; name: string; short: string; lessons: number }> = [
  { id: 'one-to-one-20', name: '一对一课程（每周20节）', short: '一对一20节', lessons: 20 },
  { id: 'one-to-one-15', name: '一对一课程（每周15节）', short: '一对一15节', lessons: 15 },
];

export const ST_GILES_HOMESTAY_BOARDS: Array<{ id: StGilesHomestayBoard; name: string; meals: string }> = [
  { id: 'hb', name: '含早晚餐', meals: '每天早餐和晚餐' },
  { id: 'bb', name: '只含早餐', meals: '每天早餐' },
  { id: 'self', name: '不含餐（可用厨房）', meals: '不含餐，可用房东厨房自己做饭' },
];

export interface StGilesPlanInput {
  /** The arrival Sunday; course-only plans show the Monday after it. */
  arrival: string;
  weeks: number;
  course: StGilesCourseChoice;
  focus: string;
  addOneToOne: boolean;
  accommodation: StGilesAccommodation;
  residence: string;
  accommodationWeeks: number;
  homestayTier: StGilesHomestayTier;
  homestayBoard: StGilesHomestayBoard;
  homestayRoom: StGilesRoom;
  juniorCentre: StGilesJuniorCentreId;
  juniorPackage: 'residential' | 'day';
  juniorSport: string;
  familyHomestay: boolean;
  childOption: 'day-plus' | 'day-only';
  adultOption: 'no-homestay' | 'social';
  familyHalfBoard: boolean;
}

/** Optional services the student chose to include in the total. */
export interface StGilesExtras {
  arrivalTransfer: boolean;
  departureTransfer: boolean;
  /** Only used once a transfer is ticked. */
  airport: StGilesAirportId;
  specialDiet: boolean;
  breakfast: boolean;
}

export interface StGilesQuoteInput {
  /** Null on the St Giles overview page, which quotes the junior summer centres only. */
  campus: StGilesCampusId | null;
  programme: StGilesProgramme;
  ageBand: StGilesAgeBand;
  juniorAge: number;
  children: number;
  adults: number;
  extras: StGilesExtras;
  plans: StGilesPlanInput[];
}

export interface StGilesQuoteRate {
  gbpToCny: number | null;
  date: string;
}

interface PlanLine { key: string; label: string; note?: string; amount: UkQuoteAmount; optional?: boolean }
interface PlanOptional extends UkQuoteOptionalRow { key: string }

export interface StGilesPlanResult {
  title: string;
  weeks: number;
  dateText: string;
  required: PlanLine[];
  optional: PlanOptional[];
  issues: string[];
  warnings: string[];
  total: number | null;
}

/** First arrival Sunday covered by the 2027 prices (Monday 28 Dec 2026 is a holiday; lessons start Tuesday 29 Dec). */
export const ST_GILES_FIRST_ARRIVAL = ukAddDays(ST_GILES_FEES.firstCourseMonday, -1);

/** Minimum English level of a course choice. */
export function stGilesCourseLevel(campus: StGilesCampusId | null, course: StGilesCourseChoice, focus: string): string {
  if (course === 'one-to-one-20' || course === 'one-to-one-15') return '任何水平';
  if (['职场英语', '雅思备考', '大学预备英语'].includes(focus)) return 'B1以上';
  if (focus === '30岁以上通用英语') return campus === 'brighton' ? 'B1以上' : 'A2以上';
  return 'A1以上';
}

/** The focus actually quoted: the chosen one when the course offers it, otherwise the course's first. */
function courseFocus(campus: StGilesCampusPricing, plan: StGilesPlanInput): string {
  const group = campus.courses.find(course => course.id === plan.course);
  if (!group) return '';
  return group.focuses.includes(plan.focus) ? plan.focus : group.focuses[0];
}
/** Last arrival Sunday whose one-week course still ends by Friday 24 December 2027. */
export const ST_GILES_LAST_ARRIVAL = ukAddDays(ST_GILES_FEES.lastCourseFriday, -5);

/** Programmes offered on a page: the overview page quotes the junior centres only. */
export function stGilesProgrammes(campus: StGilesCampusId | null): Array<{ id: StGilesProgramme; name: string; note: string }> {
  if (!campus) return [{ id: 'junior', name: '青少年夏校（8–17岁）', note: '5个城市的夏校，含课程、住宿、三餐、活动和出游' }];
  const pricing = ST_GILES_CAMPUSES[campus];
  const list: Array<{ id: StGilesProgramme; name: string; note: string }> = [
    { id: 'adult', name: `成人课程（${pricing.minAge}岁以上）`, note: '全年每周一开课，可加住宿' },
  ];
  if (pricing.juniorCentres.length) {
    list.push({ id: 'junior', name: '青少年夏校', note: juniorCentresFor(campus).map(centre => `${centre.name}（${centre.ages}）`).join('、') });
  }
  list.push({ id: 'family', name: `亲子课程（孩子${pricing.family.ages}）`, note: `${md(pricing.family.start)}–${md(pricing.family.end)}，家长陪同` });
  return list;
}

export function juniorCentresFor(campus: StGilesCampusId | null): StGilesJuniorCentre[] {
  if (!campus) return ST_GILES_JUNIOR_CENTRES;
  const ids = ST_GILES_CAMPUSES[campus].juniorCentres;
  return ST_GILES_JUNIOR_CENTRES.filter(centre => ids.includes(centre.id));
}

export function stGilesJuniorCentre(id: StGilesJuniorCentreId): StGilesJuniorCentre {
  return ST_GILES_JUNIOR_CENTRES.find(centre => centre.id === id) ?? ST_GILES_JUNIOR_CENTRES[0];
}

/** First Sunday on or after `today`, never before the first 2027 arrival. */
export function stGilesNextSunday(today: string): string {
  const date = ukParseDate(today) ?? new Date(Date.UTC(2027, 0, 3));
  date.setUTCDate(date.getUTCDate() + ((7 - date.getUTCDay()) % 7));
  const sunday = date.toISOString().slice(0, 10);
  return sunday < ST_GILES_FIRST_ARRIVAL ? ST_GILES_FIRST_ARRIVAL : sunday;
}

/** Early July suits Chinese summer holidays; it falls back to the window's first Sunday. */
const SUMMER_DEFAULT_ARRIVAL = '2027-07-04';

function summerArrival(start: string, end: string, weeks: number): string {
  return SUMMER_DEFAULT_ARRIVAL >= start && ukAddDays(SUMMER_DEFAULT_ARRIVAL, weeks * 7) <= end ? SUMMER_DEFAULT_ARRIVAL : start;
}

export function defaultStGilesPlan(campus: StGilesCampusId | null, programme: StGilesProgramme, today: string): StGilesPlanInput {
  const centre = juniorCentresFor(campus)[0] ?? ST_GILES_JUNIOR_CENTRES[0];
  const family = ST_GILES_CAMPUSES[campus ?? 'london-central'].family;
  const juniorWeeks = centre.fixedWeeks ?? 2;
  return {
    arrival: programme === 'junior' ? summerArrival(centre.start, centre.end, juniorWeeks)
      : programme === 'family' ? summerArrival(family.start, family.end, 2) : stGilesNextSunday(today),
    weeks: programme === 'adult' ? 4 : programme === 'junior' ? juniorWeeks : 2,
    course: 'intensive28',
    focus: '',
    addOneToOne: false,
    accommodation: 'homestay',
    residence: '',
    accommodationWeeks: 4,
    homestayTier: 'standard',
    homestayBoard: 'hb',
    homestayRoom: 'single',
    juniorCentre: centre.id,
    juniorPackage: 'residential',
    juniorSport: '',
    familyHomestay: true,
    childOption: 'day-plus',
    adultOption: 'no-homestay',
    familyHalfBoard: false,
  };
}

export function defaultStGilesExtras(campus: StGilesCampusId | null): StGilesExtras {
  return {
    arrivalTransfer: false,
    departureTransfer: false,
    airport: campus ? ST_GILES_CAMPUSES[campus].transfers[0].id : 'heathrow',
    specialDiet: false,
    breakfast: false,
  };
}

export function defaultStGilesQuote(campus: StGilesCampusId | null, today: string, programme?: StGilesProgramme): StGilesQuoteInput {
  const chosen = programme ?? stGilesProgrammes(campus)[0].id;
  return {
    campus,
    programme: chosen,
    ageBand: 'adult',
    juniorAge: 14,
    children: 1,
    adults: 1,
    extras: defaultStGilesExtras(campus),
    plans: [defaultStGilesPlan(campus, chosen, today)],
  };
}

/** Residences a student of this age band may book on this campus. */
export function stGilesResidencesFor(campus: StGilesCampusPricing, band: StGilesAgeBand): StGilesResidence[] {
  const range = ST_GILES_AGE_BANDS.find(item => item.id === band) ?? ST_GILES_AGE_BANDS[0];
  return campus.residences.filter(item => range.min >= item.minAge && range.max <= (item.maxAge ?? 99));
}

/** Group courses and one-to-one options open to this age band. */
export function stGilesCoursesFor(campus: StGilesCampusPricing, band: StGilesAgeBand): Array<{ id: StGilesCourseChoice; name: string }> {
  const range = ST_GILES_AGE_BANDS.find(item => item.id === band) ?? ST_GILES_AGE_BANDS[0];
  const groups = campus.courses.filter(course => range.min >= course.minAge && range.max <= (course.maxAge ?? 99))
    .map(course => ({ id: course.id as StGilesCourseChoice, name: `${course.name}（${course.schedule}）` }));
  return [...groups, ...ST_GILES_ONE_TO_ONE.map(item => ({ id: item.id as StGilesCourseChoice, name: item.name }))];
}

/**
 * The next plan to compare: a copy of the last one with the most likely alternative changed, so
 * three plans compare, for example, homestay, a residence and no accommodation.
 */
export function nextStGilesPlan(input: StGilesQuoteInput): StGilesPlanInput {
  const last = input.plans[input.plans.length - 1];
  const next: StGilesPlanInput = { ...last };
  const used = <T>(value: (plan: StGilesPlanInput) => T) => input.plans.map(value);
  if (input.programme === 'junior') {
    const centres = juniorCentresFor(input.campus);
    const unusedCentre = centres.find(centre => !used(plan => plan.juniorCentre).includes(centre.id));
    if (unusedCentre && centres.length > 1) {
      next.juniorCentre = unusedCentre.id;
      next.weeks = unusedCentre.fixedWeeks ?? Math.min(last.weeks, maxWeeksIn(unusedCentre.start, unusedCentre.end));
      next.arrival = summerArrival(unusedCentre.start, unusedCentre.end, next.weeks);
      next.juniorSport = '';
    } else {
      next.juniorPackage = last.juniorPackage === 'residential' ? 'day' : 'residential';
      const centre = centres.find(item => item.id === next.juniorCentre) ?? centres[0];
      if (centre && !centre.fixedWeeks) otherWeeks(input.plans, next, centre.start, centre.end,
        plan => plan.juniorCentre === next.juniorCentre && plan.juniorPackage === next.juniorPackage);
    }
  } else if (input.programme === 'family') {
    next.familyHomestay = !last.familyHomestay;
    const family = ST_GILES_CAMPUSES[input.campus ?? 'london-central'].family;
    otherWeeks(input.plans, next, family.start, family.end, plan => plan.familyHomestay === next.familyHomestay);
  } else {
    const campus = ST_GILES_CAMPUSES[input.campus ?? 'london-central'];
    const residences = stGilesResidencesFor(campus, input.ageBand).filter(item => !item.window);
    // First one room of each residence, so plans compare different places before different rooms.
    const firstRooms = residences.filter((item, index) => residences.findIndex(other => other.name === item.name) === index);
    const otherRooms = residences.filter(item => !firstRooms.includes(item));
    const options: Array<{ accommodation: StGilesAccommodation; residence: string }> = [
      { accommodation: 'homestay', residence: '' },
      ...firstRooms.map(item => ({ accommodation: 'residence' as StGilesAccommodation, residence: item.id })),
      { accommodation: 'none', residence: '' },
      ...otherRooms.map(item => ({ accommodation: 'residence' as StGilesAccommodation, residence: item.id })),
    ];
    const option = options.find(candidate => !input.plans.some(plan => plan.accommodation === candidate.accommodation
      && (candidate.accommodation !== 'residence' || plan.residence === candidate.residence)));
    if (option) {
      next.accommodation = option.accommodation;
      next.residence = option.residence;
    } else {
      next.weeks = last.weeks + 4;
      next.accommodationWeeks = last.accommodationWeeks + 4;
    }
  }
  return next;
}

const pounds = (value: number) => `${(Math.round(value * 100) / 100).toLocaleString('en-US')}英镑`;
const md = (value: string) => {
  const date = ukParseDate(value);
  return date ? `${date.getUTCMonth() + 1}月${date.getUTCDate()}日` : value;
};
const validWeeks = (weeks: number, max: number) => Number.isInteger(weeks) && weeks >= 1 && weeks <= max;
const roundMoney = (value: number) => Math.round(value * 100) / 100;

/** When a summer plan would repeat an earlier one, give it another length that still fits the period. */
function otherWeeks(plans: StGilesPlanInput[], next: StGilesPlanInput, start: string, end: string,
  same: (plan: StGilesPlanInput) => boolean): void {
  const taken = plans.filter(same).map(plan => plan.weeks);
  if (!taken.includes(next.weeks)) return;
  const max = maxWeeksIn(start, end);
  const weeks = [next.weeks + 1, next.weeks + 2, next.weeks - 1, next.weeks + 3, next.weeks - 2]
    .find(value => value >= 1 && value <= max && !taken.includes(value));
  if (!weeks) return;
  next.weeks = weeks;
  if (ukAddDays(next.arrival, weeks * 7) > end) next.arrival = summerArrival(start, end, weeks);
}

function maxWeeksIn(start: string, end: string): number {
  return Math.round((Date.parse(end) - Date.parse(start)) / (7 * 86400000));
}

/** Sunday arrival, Monday–Friday lessons, Saturday or Sunday departure. */
function stayDateText(arrival: string, weeks: number, sundayDeparture = false): string {
  const leave = sundayDeparture ? `${md(ukAddDays(arrival, weeks * 7))}（周日）离开`
    : `${md(ukAddDays(arrival, weeks * 7 - 1))}（周六）或${md(ukAddDays(arrival, weeks * 7))}（周日）离开`;
  return `${ukDateText(arrival)}入住 · ${md(ukAddDays(arrival, 1))}–${md(ukAddDays(arrival, weeks * 7 - 2))}上课 · ${leave}`;
}

/** Plans without accommodation are described by their Monday course start and final Friday. */
function courseDateText(arrival: string, weeks: number): string {
  return `${ukDateText(ukAddDays(arrival, 1))}开课 · ${md(ukAddDays(arrival, weeks * 7 - 2))}（周五）结课`;
}

function arrivalIssues(arrival: string, courseOnly = false): string[] {
  if (!ukParseDate(arrival)) return [courseOnly ? '请选择开课日期。' : '请选择入住日期。'];
  if (ukIsSunday(arrival)) return [];
  return [courseOnly ? '开课日期需为周一。' : '入住日期需为周日（课程周一开始）。'];
}

/** A summer window: the plan must arrive on or after `start` and leave by `end`. */
function windowIssues(name: string, arrival: string, weeks: number, start: string, end: string, courseOnly = false): string[] {
  const startText = (sunday: string) => courseOnly ? `${ukDateText(ukAddDays(sunday, 1))}开课` : `${ukDateText(sunday)}入住`;
  const issues: string[] = [];
  if (arrival < start) issues.push(`${name}最早${startText(start)}。`);
  if (ukAddDays(arrival, weeks * 7) > end) {
    const latest = ukAddDays(end, -weeks * 7);
    issues.push(latest >= start ? `${name}${ukDateText(end)}结束，${weeks}周最晚${startText(latest)}。`
      : `${name}最多${maxWeeksIn(start, end)}周。`);
  }
  return issues;
}

/**
 * An optional service of one plan. `amount` null means a reference price that cannot be added to
 * the total (for example coursebooks bought at school).
 */
interface Extra {
  key: string;
  label: string;
  price: string;
  note?: string;
  lineNote?: string;
  tag?: string;
  amount: number | null;
  selected: boolean;
}

function transferExtras(input: StGilesQuoteInput, airports: StGilesAirport[], perPassenger: boolean, minor: boolean, scope = ''): Extra[] {
  const extras = input.extras;
  const unit = perPassenger ? '单程1人' : scope || '单程每车';
  const minorNote = `13岁以下每程另加无人陪伴费${pounds(ST_GILES_JUNIOR.unaccompaniedMinorFee)}`;
  if (!airports.length) {
    return [{ key: 'transfer', label: '机场接送机', price: '请顾问确认', note: '接送机价格以学校当期报价为准', amount: null, selected: false }];
  }
  if (!extras.arrivalTransfer && !extras.departureTransfer) {
    return [{
      key: 'transfer', label: '机场接送机', price: `单程${pounds(Math.min(...airports.map(item => item.price)))}起`,
      note: `${airports.map(item => `${item.name.replace(/机场$|火车站$/, '')}${item.price}`).join('、')}英镑（${unit}）`
        + (minor ? `；${minorNote}` : ''),
      amount: null, selected: false,
    }];
  }
  const airport = airports.find(item => item.id === extras.airport) ?? airports[0];
  const ways = (extras.arrivalTransfer ? 1 : 0) + (extras.departureTransfer ? 1 : 0);
  const list: Extra[] = [
    { key: `arrival-${airport.id}`, label: `接机（${airport.name}）`, price: `单程${pounds(airport.price)}`, lineNote: unit,
      amount: airport.price, selected: extras.arrivalTransfer },
    { key: `departure-${airport.id}`, label: `送机（${airport.name}）`, price: `单程${pounds(airport.price)}`, lineNote: unit,
      amount: airport.price, selected: extras.departureTransfer },
  ];
  if (minor) {
    list.push({
      key: 'unaccompanied', label: '无人陪伴费', price: `${pounds(ST_GILES_JUNIOR.unaccompaniedMinorFee)}/程`,
      lineNote: `${pounds(ST_GILES_JUNIOR.unaccompaniedMinorFee)}/程 × ${ways}程，13岁以下独自接送机必须付`,
      amount: ST_GILES_JUNIOR.unaccompaniedMinorFee * ways, selected: true,
    });
  }
  return list;
}

/** Weekday public holidays and Christmas closure days during the lessons. */
function holidaysIn(arrival: string, weeks: number): string[] {
  const first = ukAddDays(arrival, 1);
  const last = ukAddDays(arrival, weeks * 7 - 2);
  return ST_GILES_FEES.holidays.filter(day => day >= first && day <= last);
}

function holidayWarning(arrival: string, weeks: number, proRated: boolean): string[] {
  const days = holidaysIn(arrival, weeks);
  if (!days.length) return [];
  return [`${days.map(md).join('、')}是英国公共假日或圣诞停课，当天不上课，${proRated ? '1周通用英语课程这几天不收学费' : '缺的课不补也不退费'}。`];
}

function homestayLines(campus: StGilesCampusPricing, input: StGilesQuoteInput, plan: StGilesPlanInput, weeks: number,
  issues: string[], warnings: string[]): { lines: PlanLine[]; title: string } {
  const minor = input.ageBand !== 'adult';
  const board = ST_GILES_HOMESTAY_BOARDS.find(item => item.id === plan.homestayBoard) ?? ST_GILES_HOMESTAY_BOARDS[0];
  const price = stGilesHomestayPrice(campus, plan.homestayTier, plan.homestayBoard, minor);
  const tierName = plan.homestayTier === 'superior' ? '精选寄宿家庭' : '标准寄宿家庭';
  const roomName = plan.homestayRoom === 'single' ? '单人间' : '双人间';
  if (!price) {
    issues.push(minor && plan.homestayBoard !== 'hb' ? '18岁以下学生住寄宿家庭必须选含早晚餐。'
      : minor ? `${campus.name}的${tierName}只接受18岁以上学生，请换一种。` : `${campus.name}没有这种寄宿家庭，请换一种。`);
    return { lines: [], title: `${tierName}${roomName}` };
  }
  const prices = plan.homestayRoom === 'single' ? price.single : price.twin;
  if (!prices) {
    issues.push(`${tierName}只有单人间。`);
    return { lines: [], title: `${tierName}${roomName}` };
  }
  const peakWeeks = ukParseDate(plan.arrival)
    ? ukOverlapWeeks(plan.arrival, weeks, ST_GILES_FEES.accommodationPeakStart, ST_GILES_FEES.accommodationPeakEnd) : 0;
  const offWeeks = weeks - peakWeeks;
  const [off, peak] = prices;
  const calc = off === peak ? `${pounds(off)}/周 × ${weeks}周`
    : [offWeeks ? `${pounds(off)}/周 × ${offWeeks}周` : '', peakWeeks ? `暑期${pounds(peak)}/周 × ${peakWeeks}周` : '']
      .filter(Boolean).join(' ＋ ');
  const bathroom = plan.homestayTier === 'superior' ? '独立卫浴' : '共用卫浴';
  if (plan.homestayRoom === 'twin') warnings.push(campus.twinRule);
  if (minor && plan.homestayRoom === 'single' && campus.summerMinorSharing && summerMonthsTouched(plan.arrival, weeks)) {
    warnings.push(campus.summerMinorSharing === 'will'
      ? '6–8月伊斯特本单人间很少，18岁以下学生会安排与同龄、不同国籍的学生同住双人间。'
      : '6–8月18岁以下学生订寄宿家庭单人间，可能安排与同龄、不同国籍的学生同住双人间。');
  }
  const lines: PlanLine[] = [{
    key: 'accommodation', label: '住宿费', amount: off * offWeeks + peak * peakWeeks,
    note: `${tierName}${roomName}（${bathroom}），${board.name}，${calc}\n${campus.homestayTravel}；周日入住、周日离开\n餐食：${board.meals}`,
  }];
  const christmas = ST_GILES_FEES.christmasDay;
  if (plan.homestayBoard === 'hb' && ukParseDate(plan.arrival) && plan.arrival <= christmas && ukAddDays(plan.arrival, weeks * 7) > christmas) {
    lines.push({ key: 'christmas', label: '圣诞节全餐附加费', amount: ST_GILES_FEES.christmasSupplement,
      note: '12月25日和26日寄宿家庭提供一日三餐' });
  }
  return { title: `${tierName}${roomName}`, lines };
}

/** Whether a stay touches June, July or August. */
function summerMonthsTouched(arrival: string, weeks: number): boolean {
  if (!ukParseDate(arrival)) return false;
  for (let day = 0; day < weeks * 7; day += 1) {
    if (['06', '07', '08'].includes(ukAddDays(arrival, day).slice(5, 7))) return true;
  }
  return false;
}

function residenceLines(campus: StGilesCampusPricing, input: StGilesQuoteInput, plan: StGilesPlanInput, weeks: number,
  issues: string[]): { lines: PlanLine[]; title: string; residence?: StGilesResidence } {
  const allowed = stGilesResidencesFor(campus, input.ageBand);
  const residence = campus.residences.find(item => item.id === plan.residence);
  if (!residence) {
    issues.push('请选择学生公寓或宿舍。');
    return { lines: [], title: '' };
  }
  const title = `${residence.name}${residence.room.replace(/（.*$/, '')}`;
  if (!allowed.includes(residence)) {
    issues.push(`${residence.name}只接受${residence.ageText}学生，请换一种住宿。`);
    return { lines: [], title };
  }
  if (residence.window && ukParseDate(plan.arrival)) {
    issues.push(...windowIssues(residence.name, plan.arrival, weeks, residence.window.start, residence.window.end));
  }
  const peakWeeks = ukParseDate(plan.arrival)
    ? ukOverlapWeeks(plan.arrival, weeks, ST_GILES_FEES.accommodationPeakStart, ST_GILES_FEES.accommodationPeakEnd) : 0;
  const offWeeks = residence.window ? 0 : weeks - peakWeeks;
  const peakCount = residence.window ? weeks : peakWeeks;
  const off = residence.offPeakLong !== undefined && weeks >= (residence.offPeakLongWeeks ?? 99) ? residence.offPeakLong : residence.offPeak;
  if (offWeeks > 0 && off === null) {
    issues.push(`${residence.name}${residence.room}在6月20日–8月22日以外的价格需学校单独报价，请咨询顾问或换一种住宿。`);
    return { lines: [], title };
  }
  if (peakCount > 0 && residence.peak === null) {
    issues.push(`${residence.name}暑期价格需学校单独报价，请换一种住宿。`);
    return { lines: [], title };
  }
  const offPrice = off ?? 0;
  const peakPrice = residence.peak ?? 0;
  const calc = offWeeks && peakCount && offPrice !== peakPrice
    ? `${pounds(offPrice)}/周 × ${offWeeks}周 ＋ 暑期${pounds(peakPrice)}/周 × ${peakCount}周`
    : `${pounds(offWeeks ? offPrice : peakPrice)}/周 × ${weeks}周`
      + (off !== residence.offPeak && offWeeks ? `（满${residence.offPeakLongWeeks}周优惠价）` : '');
  return {
    title,
    residence,
    lines: [{
      key: 'accommodation', label: '住宿费', amount: offPrice * offWeeks + peakPrice * peakCount,
      note: `${residence.name}${residence.room}，${calc}\n${residence.distance}；周日入住、周日离开\n餐食：${residence.meals}`,
    }],
  };
}

function adultPlan(input: StGilesQuoteInput, plan: StGilesPlanInput): StGilesPlanResult {
  const campus = ST_GILES_CAMPUSES[input.campus ?? 'london-central'];
  const courseOnly = plan.accommodation === 'none';
  const issues = arrivalIssues(plan.arrival, courseOnly);
  const warnings: string[] = [];
  const band = ST_GILES_AGE_BANDS.find(item => item.id === input.ageBand) ?? ST_GILES_AGE_BANDS[0];
  const group = campus.courses.find(course => course.id === plan.course);
  const oneToOne = ST_GILES_ONE_TO_ONE.find(item => item.id === plan.course);
  const weeks = plan.weeks;
  const maxWeeks = group?.maxWeeks ?? ST_GILES_FEES.maxCourseWeeks;
  const focus = courseFocus(campus, plan);

  if (band.min < campus.minAge) issues.push(`${campus.name}成人课程${campus.minAge}岁以上才能报。`);
  if (!group && !oneToOne) issues.push('请选择课程。');
  if (group && (band.min < group.minAge || band.max > (group.maxAge ?? 99))) {
    issues.push(group.id === 'under16' ? '16岁以下强化课程只接受14–15岁学生。' : '14–15岁学生请选16岁以下强化课程或一对一课程。');
  }
  if (group && focus === '30岁以上通用英语') {
    if (input.ageBand !== 'adult') issues.push('30岁以上通用英语只接受30岁以上学生。');
    else warnings.push('30岁以上通用英语只接受30岁以上学生。');
  }
  if (!validWeeks(weeks, maxWeeks)) issues.push(`${group?.name ?? '课程'}可报1–${maxWeeks}周。`);
  if (!issues.length) {
    if (plan.arrival < ST_GILES_FIRST_ARRIVAL) {
      issues.push(`2027年价格的课程最早${ukDateText(ukAddDays(ST_GILES_FEES.firstCourseMonday, 1))}开始。`);
    }
    if (ukAddDays(plan.arrival, weeks * 7 - 2) > ST_GILES_FEES.lastCourseFriday) {
      issues.push('学校尚未公布2028年价格，课程需在2027年12月24日前结束。');
    }
  }

  const required: PlanLine[] = [];
  let courseTitle = '';
  // A one-week General English course is not charged for public holidays (IELTS preparation is not General English).
  const holidayDays = group && weeks === 1 && focus !== '雅思备考' && ukParseDate(plan.arrival) ? holidaysIn(plan.arrival, 1).length : 0;
  if (group) {
    const rate = stGilesCourseRate(group, weeks);
    courseTitle = group.short;
    const lessonDays = 5 - holidayDays;
    required.push({ key: 'course', label: '学费', amount: holidayDays ? roundMoney(rate * lessonDays / 5) : rate * weeks,
      note: (holidayDays
        ? `${group.name}·${focus}，${pounds(rate)}/周；本周${holidayDays}天公共假日不收学费，按${lessonDays}天计`
        : `${group.name}·${focus}，${pounds(rate)}/周 × ${weeks}周`) + '\n'
        + `${group.hoursText}，${group.schedule}；每节50分钟，每班最多12人（平均10人）；入学分级测试，结业颁发证书` });
    // The General English Plus options (here English for University Studies) pay no high-season supplement.
    const highWeeks = focus !== '大学预备英语' && ukParseDate(plan.arrival)
      ? ukOverlapWeeks(plan.arrival, weeks, ST_GILES_FEES.highSeasonStart, ST_GILES_FEES.highSeasonEnd) : 0;
    if (highWeeks > 0) {
      required.push({ key: 'high-season', label: '暑期课程附加费', amount: ST_GILES_FEES.highSeasonSupplement * highWeeks,
        note: `6月21日–8月20日上课，${pounds(ST_GILES_FEES.highSeasonSupplement)}/周 × ${highWeeks}周` });
    }
    if (plan.addOneToOne) {
      required.push({ key: 'add-on', label: '加一对一课程', amount: campus.oneToOne.addOnFive * weeks,
        note: `每周加5节一对一，${pounds(campus.oneToOne.addOnFive)}/周 × ${weeks}周` });
    }
  } else if (oneToOne) {
    const prices = oneToOne.lessons === 20 ? campus.oneToOne.twenty : campus.oneToOne.fifteen;
    const rate = stGilesOneToOneRate(prices, weeks);
    courseTitle = oneToOne.short;
    required.push({ key: 'course', label: '学费', amount: rate * weeks,
      note: `${oneToOne.name}，${pounds(rate)}/周 × ${weeks}周\n老师按学生目标单独安排内容，每节50分钟；结业颁发证书` });
  }
  required.push({ key: 'registration', label: '注册费', note: '一次性', amount: ST_GILES_FEES.registration });

  let stayTitle = '';
  let stayWeeks = 0;
  let residence: StGilesResidence | undefined;
  if (!courseOnly) {
    stayWeeks = plan.accommodationWeeks;
    if (!validWeeks(stayWeeks, ST_GILES_FEES.maxCourseWeeks)) issues.push(`住宿可订1–${ST_GILES_FEES.maxCourseWeeks}周。`);
    const stay: { lines: PlanLine[]; title: string; residence?: StGilesResidence } = plan.accommodation === 'homestay'
      ? homestayLines(campus, input, plan, stayWeeks, issues, warnings)
      : residenceLines(campus, input, plan, stayWeeks, issues);
    residence = stay.residence;
    stayTitle = stay.title;
    required.push(...stay.lines);
    required.push({ key: 'placement', label: '住宿安排费', note: '一次性', amount: ST_GILES_FEES.accommodationPlacement });
    if (validWeeks(stayWeeks, ST_GILES_FEES.maxCourseWeeks) && ukParseDate(plan.arrival)) {
      if (ukAddDays(plan.arrival, stayWeeks * 7) > ST_GILES_FEES.lastAccommodationSunday) {
        issues.push('学校尚未公布2028年住宿价格，住宿需在2027年12月26日（周日）前退房。');
      }
      if (stayWeeks > weeks) {
        const extraStart = ukAddDays(plan.arrival, weeks * 7);
        if (ukOverlapWeeks(extraStart, stayWeeks - weeks, ST_GILES_FEES.accommodationPeakStart, ST_GILES_FEES.accommodationPeakEnd) > 0) {
          issues.push('6月20日–8月22日不能只订住宿不上课，请把课程延长到和住宿一样长。');
        } else {
          warnings.push('课程结束后单独续住，需学校确认是否有房。');
        }
      }
    }
  }
  required.push({ key: 'social', label: '社交活动', amount: 'included',
    note: '学校每周安排下午、晚上和周末活动，部分免费，部分门票和外地出游另付' });

  const extras: Extra[] = [
    ...transferExtras(input, campus.transfers, campus.transferPerPassenger, false),
    { key: 'materials', label: '教材', price: campus.materials, note: '按实际使用的教材购买', amount: null, selected: false },
  ];
  if (plan.accommodation === 'homestay') {
    extras.push({ key: 'diet', label: '寄宿家庭特殊饮食', price: `${pounds(ST_GILES_FEES.specialDiet)}/周`,
      note: '素食以外的特殊饮食要求', lineNote: `${pounds(ST_GILES_FEES.specialDiet)}/周 × ${stayWeeks}周`,
      amount: ST_GILES_FEES.specialDiet * stayWeeks, selected: input.extras.specialDiet });
    if (campus.homestayLunch && plan.homestayBoard === 'hb') {
      const lunch = ST_GILES_HOMESTAY_LUNCH;
      extras.push({ key: 'lunch', label: '寄宿家庭加午餐', price: `工作日${pounds(lunch.weekday)}/周`,
        note: `周末午餐${pounds(lunch.weekend)}/周，工作日加周末共${pounds(lunch.fullBoard)}/周`
          + (input.ageBand === 'minor14' ? '；14–15岁建议加工作日午餐' : ''),
        amount: null, selected: false });
    }
  }
  if (residence?.breakfastPerWeek) {
    extras.push({ key: 'breakfast', label: '学校咖啡厅早餐', price: `${pounds(residence.breakfastPerWeek)}/周`,
      lineNote: `${pounds(residence.breakfastPerWeek)}/周 × ${stayWeeks}周`,
      amount: roundMoney(residence.breakfastPerWeek * stayWeeks), selected: input.extras.breakfast });
  }
  if (focus === '雅思备考') {
    extras.push({ key: 'ielts', label: '雅思考试报名费', price: `${pounds(ST_GILES_FEES.ieltsExamFrom)}起`, note: '在英国参加考试时，按考点实际收费',
      amount: null, selected: false });
  }

  if (!issues.length) {
    warnings.push(...holidayWarning(plan.arrival, weeks, holidayDays > 0));
    if (input.ageBand === 'minor14' && campus.assistedCheckIn) {
      warnings.push(`16岁以下学生抵达和离开都必须订学校接送机${campus.id === 'cambridge' ? '（由成年亲友接送的除外）' : ''}，`
        + `并随身携带家长出行同意书；航空公司要求协助值机时，另付${pounds(campus.assistedCheckIn)}。`);
    }
  }
  const title = stayTitle ? `${courseTitle} ＋ ${stayTitle}` : courseTitle;
  const dateText = issues.length ? ''
    : courseOnly ? `${courseDateText(plan.arrival, weeks)}，课程${weeks}周，不含住宿`
      : `${ukDateText(plan.arrival)}入住，${md(ukAddDays(plan.arrival, 1))}开课，课程${weeks}周，住宿${stayWeeks}周`;
  return finishPlan(title, weeks, dateText, required, extras, issues, warnings);
}

function juniorPlan(input: StGilesQuoteInput, plan: StGilesPlanInput): StGilesPlanResult {
  const centre = stGilesJuniorCentre(plan.juniorCentre);
  const dayOnly = plan.juniorPackage === 'day';
  const weeks = plan.weeks;
  const issues = arrivalIssues(plan.arrival, dayOnly);
  const max = centre.fixedWeeks ?? maxWeeksIn(centre.start, centre.end);
  if (centre.fixedWeeks ? weeks !== centre.fixedWeeks : !validWeeks(weeks, max)) {
    issues.push(centre.fixedWeeks ? `${centre.name}固定${centre.fixedWeeks}周。` : `${centre.name}可报1–${max}周。`);
  }
  if (!issues.length) issues.push(...windowIssues(centre.name, plan.arrival, weeks, centre.start, centre.end, dayOnly));
  const age = input.juniorAge;
  if (!Number.isInteger(age) || age < centre.minAge || age > centre.maxAge) issues.push(`${centre.name}只接受${centre.ages}学生。`);

  const weekly = dayOnly ? centre.dayOnly : centre.residential;
  const required: PlanLine[] = [
    { key: 'package', label: dayOnly ? '走读套餐费' : '全包套餐费', note: `${pounds(weekly)}/周 × ${weeks}周`, amount: weekly * weeks },
    { key: 'course', label: '英语课程', amount: 'included',
      note: `每周${ST_GILES_JUNIOR.lessonsPerWeek}节，{{${weeks}周共${weeks * ST_GILES_JUNIOR.lessonsPerWeek}节}}；每班最多${ST_GILES_JUNIOR.maxClass}人，`
        + '每周一个主题和小项目；结业颁发证书和老师评语' },
    { key: 'room', label: '住宿', amount: dayOnly ? 'excluded' : 'included', note: dayOnly ? undefined : `${centre.venue}，${centre.stay}` },
  ];
  if (!dayOnly) {
    required.push({ key: 'meals', label: '餐食', amount: 'included',
      note: centre.id === 'brighton-homestay' ? '一日三餐：早晚餐在寄宿家庭，工作日午餐在学校' : '一日三餐，特殊饮食可提前申请' });
  }
  if (!dayOnly) required.push({ key: 'activities', label: '活动和出游', amount: 'included', note: centre.excursions });
  required.push(
    { key: 'care', label: '保险和照看', amount: dayOnly ? 'excluded' : 'included',
      note: dayOnly ? undefined : centre.id === 'brighton-homestay'
        ? '含旅行和医疗保险、24小时紧急电话；课程和活动时间由工作人员照看，其余时间在寄宿家庭'
        : '含旅行和医疗保险、24小时紧急电话；工作人员住校照看，13岁以上经家长同意才可3人结伴短时外出' },
  );
  const sport = centre.sports?.find(item => item.id === plan.juniorSport);
  if (sport) {
    required.push({ key: 'sport', label: sport.name.replace(/（.*$/, ''), amount: sport.price * weeks,
      note: `${sport.name}，${pounds(sport.price)}/周 × ${weeks}周，含器材` });
  } else if (plan.juniorSport) {
    issues.push('这个夏校没有这项运动训练。');
  }
  const extras: Extra[] = [...transferExtras(input, centre.transfers, true, age < ST_GILES_JUNIOR.unaccompaniedMinorAge)];
  const warnings: string[] = dayOnly ? ['走读具体包含哪些活动、出游和餐食，请顾问向学校确认。'] : [];
  if (centre.transfers.length && (input.extras.arrivalTransfer || input.extras.departureTransfer)) {
    warnings.push(`同一航班的学生会拼车；想单独用车，每程另付${pounds(ST_GILES_JUNIOR.soleOccupancy)}。`);
    if (age >= ST_GILES_JUNIOR.unaccompaniedMinorAge) warnings.push('航空公司按无人陪伴儿童安排的学生，也需付学校无人陪伴费。');
  }
  const title = `${centre.name} ${dayOnly ? '走读' : '全包'}`;
  const dateText = issues.length ? '' : dayOnly ? courseDateText(plan.arrival, weeks) : stayDateText(plan.arrival, weeks, true);
  return finishPlan(title, weeks, dateText, required, extras, issues, warnings);
}

function familyPlan(input: StGilesQuoteInput, plan: StGilesPlanInput): StGilesPlanResult {
  const campus = ST_GILES_CAMPUSES[input.campus ?? 'london-central'];
  const family = campus.family;
  const common = ST_GILES_FAMILY_COMMON;
  const weeks = plan.weeks;
  const homestay = plan.familyHomestay;
  const issues = arrivalIssues(plan.arrival, !homestay);
  const max = maxWeeksIn(family.start, family.end);
  if (!validWeeks(weeks, max)) issues.push(`${campus.name}亲子课程可报1–${max}周。`);
  if (!issues.length) issues.push(...windowIssues(`${campus.name}亲子课程`, plan.arrival, weeks, family.start, family.end, !homestay));
  const children = input.children;
  const adults = input.adults;
  if (!Number.isInteger(children) || children < 1 || children > 3) issues.push('孩子人数可选1–3人。');
  if (!Number.isInteger(adults) || adults < 1 || adults > 2) issues.push('陪同家长可选1–2人。');

  const childRate = homestay ? family.childFull : plan.childOption === 'day-only' ? family.childDayOnly : family.childDayPlus;
  const adultRate = homestay ? family.adultHomestay : common.adultNoHomestay;
  const childName = homestay ? '孩子全包套餐' : plan.childOption === 'day-only' ? '孩子课程和活动' : '孩子课程、活动和午餐';
  const adultName = homestay ? '家长套餐（不上课）' : '家长活动和午餐';
  // Without homestay one adult always joins lessons, lunches and activities; a second may join the activities only.
  const socialAdults = !homestay && plan.adultOption === 'social' && adults > 1 ? adults - 1 : 0;
  const fullAdults = adults - socialAdults;
  const persons = children + adults;
  const lunch = homestay || plan.childOption === 'day-plus';
  const required: PlanLine[] = [
    { key: 'children', label: childName, amount: childRate * children * weeks,
      note: `${pounds(childRate)}/人/周 × ${children}人 × ${weeks}周` },
    { key: 'adults', label: adultName, amount: adultRate * fullAdults * weeks,
      note: `${pounds(adultRate)}/人/周 × ${fullAdults}人 × ${weeks}周` },
  ];
  if (socialAdults) {
    required.push({ key: 'social-adults', label: '第二位家长只参加活动', amount: common.adultSocialOnly * socialAdults * weeks,
      note: `${pounds(common.adultSocialOnly)}/人/周 × ${socialAdults}人 × ${weeks}周，不含午餐` });
  }
  if (persons > 4 && (input.extras.arrivalTransfer || input.extras.departureTransfer)) {
    issues.push('接送机每车最多4人、3件行李，5人以上请顾问确认用车和价格。');
  }
  if (homestay && plan.familyHalfBoard) {
    required.push({ key: 'half-board', label: '寄宿家庭升级早晚餐', amount: common.halfBoardPerPerson * persons * weeks,
      note: `${pounds(common.halfBoardPerPerson)}/人/周 × ${persons}人 × ${weeks}周` });
  }
  required.push(
    { key: 'registration', label: '注册费', note: '每个家庭一次', amount: common.registrationPerFamily },
  );
  if (homestay) required.push({ key: 'placement', label: '住宿安排费', note: '每个家庭一次', amount: common.placementPerFamily });
  required.push(
    { key: 'course', label: '孩子英语课程', amount: 'included',
      note: `每周20节，09:00–13:00；按年龄或水平分班，每班最多15人；孩子年龄${family.ages}` },
    { key: 'activities', label: '家庭活动和出游', amount: 'included',
      note: `每周3个下午活动＋1次全天出游，和其他家庭一起；例如${family.activities}` },
    { key: 'lunch', label: '午餐', amount: lunch ? 'included' : 'excluded', note: lunch ? '周一至周五午餐' : undefined },
    { key: 'room', label: '住宿', amount: homestay ? 'included' : 'excluded',
      note: homestay ? `寄宿家庭双人间；含每天早餐${plan.familyHalfBoard ? '和晚餐' : ''}；${campus.homestayTravel}` : undefined },
  );
  const extras: Extra[] = [
    ...transferExtras(input, family.transfers, false, false, '单程每个家庭，每车最多4人3件行李'),
    { key: 'diet', label: '特殊饮食', price: `${pounds(common.specialDiet)}/人/周`, note: '素食以外的特殊饮食要求',
      lineNote: `${pounds(common.specialDiet)}/人/周 × ${persons}人 × ${weeks}周`,
      amount: common.specialDiet * persons * weeks, selected: input.extras.specialDiet },
    { key: 'parent-course', label: '家长英语课程', price: '请顾问报价', note: '家长也可同时在成人部上课', amount: null, selected: false },
  ];
  const title = homestay ? '住寄宿家庭' : '不住宿';
  const dateText = issues.length ? '' : homestay ? stayDateText(plan.arrival, weeks, true) : courseDateText(plan.arrival, weeks);
  return finishPlan(title, weeks, dateText, required, extras, issues, []);
}

function finishPlan(title: string, weeks: number, dateText: string, required: PlanLine[],
  extras: Extra[], issues: string[], warnings: string[]): StGilesPlanResult {
  const chosen = extras.filter(extra => extra.selected && extra.amount !== null);
  const lines: PlanLine[] = [
    ...required,
    ...chosen.map(extra => ({ key: extra.key, label: extra.label, note: extra.lineNote ?? extra.note, amount: extra.amount, optional: true })),
  ];
  const optional: PlanOptional[] = extras.filter(extra => !chosen.includes(extra))
    .map(extra => ({ key: extra.key, label: extra.label, price: extra.price, tag: extra.tag, note: extra.note }));
  const total = issues.length ? null
    : roundMoney(lines.reduce((sum, line) => sum + (typeof line.amount === 'number' ? line.amount : 0), 0));
  return { title, weeks, dateText, required: lines, optional, issues, warnings: [...new Set(warnings)], total };
}

export function computeStGilesPlan(input: StGilesQuoteInput, plan: StGilesPlanInput): StGilesPlanResult {
  if (input.programme === 'junior') return juniorPlan(input, plan);
  if (input.programme === 'family') return familyPlan(input, plan);
  return adultPlan(input, plan);
}

/** Every key in plan order; a key missing from earlier plans goes right after its predecessor. */
function unionKeys<T extends { key: string }>(lists: T[][]): string[] {
  const keys: string[] = [];
  lists.forEach(list => list.forEach((item, index) => {
    if (keys.includes(item.key)) return;
    const after = index > 0 ? keys.indexOf(list[index - 1].key) : -1;
    keys.splice(after + 1, 0, item.key);
  }));
  return keys;
}

/** One shared note, or one 方案一：… line per plan when the plans differ. */
function combined(values: Array<string | undefined>, tags: string[]): string | undefined {
  const present = values.filter((value): value is string => !!value);
  if (!present.length) return undefined;
  if (new Set(values).size === 1) return present[0];
  return values.map((value, index) => value ? `${tags[index]}：${value.split('\n').join('；')}` : '').filter(Boolean).join('\n');
}

const PLAN_COUNT_TEXT = ['', '一', '两', '三'];

export function buildStGilesSheet(input: StGilesQuoteInput, quoteDate: string, rate: StGilesQuoteRate,
  contacts: UkQuoteContact[]): UkQuoteSheet {
  const results = input.plans.slice(0, ST_GILES_MAX_PLANS).map(plan => computeStGilesPlan(input, plan));
  const multiple = results.length > 1;
  const tags = multiple ? UK_QUOTE_PLAN_TAGS.slice(0, results.length) : [''];
  const mandatoryKeys = unionKeys(results.map(result => result.required.filter(line => !line.optional)));
  const optionalKeys = unionKeys(results.map(result => result.required.filter(line => line.optional)));
  const requiredRows: UkQuoteMoneyRow[] = [...mandatoryKeys, ...optionalKeys].map(key => {
    const lines = results.map(result => result.required.find(line => line.key === key));
    const first = lines.find(Boolean)!;
    return {
      label: first.label,
      note: combined(lines.map(line => line?.note), tags),
      amounts: lines.map(line => line ? line.amount : null),
      optional: first.optional || undefined,
    };
  });
  const optionalRows: UkQuoteOptionalRow[] = unionKeys(results.map(result => result.optional)).map(key => {
    const rows = results.map(result => result.optional.find(item => item.key === key));
    const first = rows.find(Boolean)!;
    const only = multiple && rows.some(row => !row)
      ? rows.map((row, index) => row ? tags[index] : '').filter(Boolean).join('、') : '';
    const note = [first.note, only ? `仅${only}` : ''].filter(Boolean).join('；');
    return { label: first.label, price: first.price, tag: first.tag, note: note || undefined };
  });
  const issues = results.flatMap((result, index) => result.issues.map(issue => multiple ? `${tags[index]}：${issue}` : issue));
  const warnings = [...new Set(results.flatMap((result, index) =>
    result.warnings.map(warning => multiple && results.some(other => !other.warnings.includes(warning)) ? `${tags[index]}：${warning}` : warning)))];
  const totals = results.map(result => result.total);
  const usableRate = rate.gbpToCny !== null && Number.isFinite(rate.gbpToCny) && rate.gbpToCny > 0 ? rate.gbpToCny : null;
  const withExtras = requiredRows.some(row => row.optional);

  const weeksList = [...new Set(results.map(result => result.weeks))];
  const weeksText = weeksList.length === 1 && Number.isInteger(weeksList[0]) && weeksList[0] > 0 ? `${weeksList[0]}周` : '';
  const planTitles = results.map(result => weeksText ? result.title : `${result.title}（${result.weeks}周）`);
  const plansText = multiple ? `${PLAN_COUNT_TEXT[results.length]}种方案对比` : planTitles[0];
  const campus = input.campus ? ST_GILES_CAMPUSES[input.campus] : null;
  const centres = [...new Set(input.plans.map(plan => plan.juniorCentre))];
  const centre = stGilesJuniorCentre(input.plans[0]?.juniorCentre ?? 'london-ucl');

  let title: string;
  let eyebrow: string;
  let subtitle: string;
  let school: string;
  let requirement: string;
  if (input.programme === 'junior') {
    const oneCentre = centres.length === 1;
    title = `St Giles ${oneCentre ? centre.name : '英国青少年夏校'}${weeksText}报价`;
    eyebrow = `英国${oneCentre ? centre.city : ''} · 2027 暑期`;
    subtitle = `青少年夏校（${oneCentre ? centre.ages : '8–17岁'}）｜${plansText}`;
    school = oneCentre ? `St Giles ${centre.name}\n${centre.venue}` : 'St Giles International 青少年夏校';
    requirement = `${input.juniorAge}岁学生\n${oneCentre ? `${centre.ages}，英语${centre.level}` : '各夏校年龄和英语要求不同'}`;
  } else if (input.programme === 'family') {
    title = `St Giles ${campus?.name ?? ''}亲子课程${weeksText}报价`;
    eyebrow = `英国${campus?.city ?? ''} · 2027 暑期亲子课程`;
    subtitle = `${input.children}个孩子＋${input.adults}位家长｜${plansText}`;
    school = `St Giles International ${campus?.name ?? ''}（英国${campus?.city ?? ''}）\n1955年创办，英国文化协会认证`;
    requirement = `孩子${campus?.family.ages ?? ''}\n至少一位家长陪同上下课、午餐和活动`;
  } else {
    title = `St Giles ${campus?.name ?? ''}成人课程${weeksText}报价`;
    eyebrow = `英国${campus?.city ?? ''} · 成人英语课程`;
    subtitle = `成人英语课程（${campus?.minAge ?? 16}岁以上）｜${plansText}`;
    school = `St Giles International ${campus?.name ?? ''}（英国${campus?.city ?? ''}）\n1955年创办，英国文化协会认证`;
    const band = ST_GILES_AGE_BANDS.find(item => item.id === input.ageBand) ?? ST_GILES_AGE_BANDS[0];
    const levels = input.plans.slice(0, ST_GILES_MAX_PLANS).map(plan =>
      stGilesCourseLevel(input.campus, plan.course, campus ? courseFocus(campus, plan) : plan.focus));
    const levelText = new Set(levels).size === 1 ? `英语${levels[0]}`
      : levels.map((level, index) => `${tags[index]}英语${level}`).join('，');
    requirement = `${band.name}\n${levelText}，入学分级测试${levels.includes('A1以上') ? '；零基础请咨询顾问' : ''}`;
  }

  const dateValues = results.map(result => result.dateText || '日期待确认');
  const info: UkQuoteInfoItem[] = [
    { label: '学校', value: school },
    { label: '入学要求', value: requirement },
    {
      label: weeksText ? `日期（共${weeksText}）` : '日期',
      value: new Set(dateValues).size === 1 ? dateValues[0] : dateValues.map((value, index) => `${tags[index]}：${value}`).join('\n'),
      wide: true,
    },
  ];

  const notes = [
    '以上为2027年价格，报名前以学校最终确认为准。',
    '费用以英镑计，人民币按参考汇率估算，最终以实际支付汇率为准。',
    input.programme === 'junior' && input.plans.some(plan => plan.juniorPackage !== 'day')
      ? '不含机票、英国签证及个人零花钱；全包套餐已含旅行和医疗保险，走读不含保险。'
      : '不含机票、英国签证、保险及个人零花钱。',
    '课程安排、活动和住宿规定仅供参考，学校可能随时调整；学位和房间以学校最终确认为准。',
  ];
  if (input.programme === 'adult') notes.push('课程每周一开课；住宿周日入住、周日离开，6月20日–8月22日按暑期价格计。');
  if (input.programme === 'junior') {
    notes.push(`周日入住、周日离开；到校当天所有学生交${pounds(ST_GILES_JUNIOR.breakageDeposit)}现金押金，用于损坏赔偿和医疗保险自付部分，`
      + '丢失钥匙会从中扣除，其余离开时退还。');
  }
  if (input.programme === 'family') notes.push('孩子和家长按人每周计价，注册费和住宿安排费每个家庭只收一次。');
  notes.push(...warnings);

  const examples = input.programme === 'junior' && centres.length === 1 ? [
    { label: '每周示例', text: centre.sampleWeek },
    { label: '晚间活动', text: centre.evenings },
  ] : [];

  return {
    fileName: `${title}.png`,
    schoolName: 'St Giles International',
    eyebrow,
    title,
    subtitle,
    quoteDate,
    currencyLabel: '英镑',
    info,
    plans: planTitles.map((planTitle, index) => ({ tag: tags[index], title: planTitle })),
    feesTitle: withExtras ? '费用明细' : '必付费用',
    totalLabel: withExtras ? '合计' : '必付合计',
    requiredRows,
    requiredTotals: totals,
    requiredTotalsCny: totals.map(total => ukCny(total, usableRate)),
    rateNote: usableRate
      ? `人民币按1英镑≈${usableRate.toFixed(4)}元估算（汇率日期${rate.date}），最终以实际支付汇率为准。`
      : '人民币汇率待更新，汇率更新后再保存报价图片。',
    examplesTitle: examples.length ? '活动示例（以学校当期安排为准）' : '',
    examples,
    optionalRows,
    optionalNote: withExtras ? '没有勾选的可选费用，不含在以上合计中' : '按需自选，不含在以上费用中',
    notes,
    contacts,
    website: UK_QUOTE_WEBSITE,
    issues,
    warnings,
  };
}
