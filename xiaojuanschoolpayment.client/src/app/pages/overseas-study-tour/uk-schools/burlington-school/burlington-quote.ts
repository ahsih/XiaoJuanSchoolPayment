// Burlington School quote engine: form input -> shared UK quote sheet. Pure functions only
// (no Angular, DOM, storage or regex lookbehind) so the mini program can bundle it later.
// Three of the school's price structures are supported:
//   junior            Young Learner weekly packages (spring/summer/autumn/winter, ages 11-17)
//   adult-course      tiered Standard/Intensive tuition, one-to-one hours and accommodation (16+)
//   summer-residence  Adult Summer Premium Residence package at iQ Vega (16+, 27 Jun - 22 Aug 2027)
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
  BURLINGTON_ADULT_COURSES,
  BURLINGTON_AIRPORTS,
  BURLINGTON_APARTMENT_MIN_AGE,
  BURLINGTON_APARTMENT_ROOMS,
  BURLINGTON_BANK_HOLIDAYS_2027,
  BURLINGTON_CASTLE,
  BURLINGTON_CHRISTMAS_CLOSURE,
  BURLINGTON_COURSE_FOCUS,
  BURLINGTON_FEES,
  BURLINGTON_HOMESTAY_BOARDS,
  BURLINGTON_HOMESTAY_PRICES,
  BURLINGTON_HOMESTAY_SUPPLEMENTS,
  BURLINGTON_HOMESTAY_TIERS,
  BURLINGTON_JUNIOR,
  BURLINGTON_JUNIOR_PACKAGES,
  BURLINGTON_JUNIOR_SEASONS,
  BURLINGTON_MAX_COURSE_WEEKS,
  BURLINGTON_ONSITE_MINOR_SURCHARGE,
  BURLINGTON_ONSITE_ROOMS,
  BURLINGTON_SUMMER_RESIDENCE,
  BURLINGTON_TRANSFER_EXTRA_PERSON,
  BurlingtonAirportId,
  BurlingtonApartmentRoomId,
  BurlingtonCourseFocus,
  BurlingtonHomestayBoard,
  BurlingtonHomestayRoom,
  BurlingtonHomestayTier,
  BurlingtonJuniorPackageId,
  BurlingtonOnsiteRoomId,
  BurlingtonSeasonId,
  burlingtonCourseRate,
  burlingtonOneToOneRate,
  burlingtonSummerResidenceRate,
} from './burlington-pricing';

export type BurlingtonProgramme = 'junior' | 'adult-course' | 'summer-residence';
export type BurlingtonCourseChoice = 'standard' | 'intensive' | 'one-to-one';
export type BurlingtonAccommodation = 'none' | 'onsite' | 'apartment' | 'homestay';
export type BurlingtonAdultAge = 'adult' | 'minor';

/** Adult programmes come first: they are the school's main offer (user decision 2026-11-19). */
export const BURLINGTON_PROGRAMMES: Array<{ id: BurlingtonProgramme; name: string; note: string }> = [
  { id: 'adult-course', name: '成人课程（16岁以上）', note: '全年每周一开课，可加住宿' },
  { id: 'summer-residence', name: '成人暑期公寓套餐', note: '2027年6月27日–8月22日，16岁以上' },
  { id: 'junior', name: '青少年项目（11–17岁）', note: '春季、暑期、秋季、冬季全包套餐' },
];

export const BURLINGTON_MAX_PLANS = UK_QUOTE_MAX_PLANS;

export interface BurlingtonPlanInput {
  arrival: string;
  weeks: number;
  juniorSeason: BurlingtonSeasonId;
  juniorPackage: BurlingtonJuniorPackageId;
  juniorHomestayRoom: BurlingtonHomestayRoom;
  course: BurlingtonCourseChoice;
  courseFocus: BurlingtonCourseFocus;
  oneToOneHours: number;
  accommodation: BurlingtonAccommodation;
  accommodationWeeks: number;
  onsiteRoom: BurlingtonOnsiteRoomId;
  apartmentRoom: BurlingtonApartmentRoomId;
  homestayTier: BurlingtonHomestayTier;
  homestayRoom: BurlingtonHomestayRoom;
  homestayBoard: BurlingtonHomestayBoard;
  homestayPrivateBathroom: boolean;
  homestaySpecialDiet: boolean;
  intensiveUpgrade: boolean;
}

/** Optional services the student chose to include in the total. */
export interface BurlingtonExtras {
  arrivalTransfer: boolean;
  departureTransfer: boolean;
  /** Only used once a transfer is ticked. */
  airport: BurlingtonAirportId;
  travelCard: boolean;
  chaperone: boolean;
  saturdayTrip: boolean;
  castle: boolean;
  exam: boolean;
  bankCharge: boolean;
}

export interface BurlingtonQuoteInput {
  programme: BurlingtonProgramme;
  juniorAge: number;
  adultAge: BurlingtonAdultAge;
  extras: BurlingtonExtras;
  plans: BurlingtonPlanInput[];
}

export interface BurlingtonQuoteRate {
  gbpToCny: number | null;
  date: string;
}

interface PlanLine { key: string; label: string; note?: string; amount: UkQuoteAmount; optional?: boolean }
interface PlanOptional extends UkQuoteOptionalRow { key: string }

export interface BurlingtonPlanResult {
  title: string;
  weeks: number;
  dateText: string;
  /**
   * Required fees, each with what it covers, then the optional services the student ticked.
   * What a package or tuition already covers is listed as `included` (or `excluded`) lines.
   */
  required: PlanLine[];
  /** Optional services not ticked, listed as reference prices. */
  optional: PlanOptional[];
  issues: string[];
  warnings: string[];
  total: number | null;
}

/** First Sunday on or after `today` (YYYY-MM-DD). */
export function burlingtonNextSunday(today: string): string {
  const date = ukParseDate(today) ?? new Date(Date.UTC(2027, 0, 3));
  date.setUTCDate(date.getUTCDate() + ((7 - date.getUTCDay()) % 7));
  return date.toISOString().slice(0, 10);
}

/** Early July suits Chinese summer holidays better than the season's first Sunday (30 May). */
const JUNIOR_DEFAULT_ARRIVAL = '2027-07-04';

export function defaultBurlingtonPlan(programme: BurlingtonProgramme, today: string): BurlingtonPlanInput {
  return {
    arrival: programme === 'junior' ? JUNIOR_DEFAULT_ARRIVAL
      : programme === 'summer-residence' ? BURLINGTON_SUMMER_RESIDENCE.start : burlingtonNextSunday(today),
    weeks: 4,
    juniorSeason: 'summer',
    juniorPackage: 'residence',
    juniorHomestayRoom: 'single',
    course: 'standard',
    courseFocus: 'general',
    oneToOneHours: 0,
    accommodation: 'onsite',
    accommodationWeeks: 4,
    onsiteRoom: 'single-shared',
    apartmentRoom: 'single-shared',
    homestayTier: 'standard',
    homestayRoom: 'single',
    homestayBoard: 'hb',
    homestayPrivateBathroom: false,
    homestaySpecialDiet: false,
    intensiveUpgrade: false,
  };
}

export function defaultBurlingtonExtras(): BurlingtonExtras {
  return {
    arrivalTransfer: false,
    departureTransfer: false,
    airport: 'heathrow',
    travelCard: false,
    chaperone: false,
    saturdayTrip: false,
    castle: false,
    exam: false,
    bankCharge: false,
  };
}

export function defaultBurlingtonQuote(today: string, programme: BurlingtonProgramme = 'adult-course'): BurlingtonQuoteInput {
  return {
    programme,
    juniorAge: 15,
    adultAge: 'adult',
    extras: defaultBurlingtonExtras(),
    plans: [defaultBurlingtonPlan(programme, today)],
  };
}

/**
 * The next plan to compare: a copy of the last one with the most likely alternative changed, so
 * three plans compare, for example, school residence, homestay and apartment.
 */
export function nextBurlingtonPlan(input: BurlingtonQuoteInput): BurlingtonPlanInput {
  const last = input.plans[input.plans.length - 1];
  const next: BurlingtonPlanInput = { ...last };
  const unused = <T>(options: T[], current: (plan: BurlingtonPlanInput) => T) =>
    options.find(option => !input.plans.some(plan => current(plan) === option));
  if (input.programme === 'junior') {
    next.juniorPackage = unused<BurlingtonJuniorPackageId>(['residence', 'homestay', 'day'], plan => plan.juniorPackage) ?? last.juniorPackage;
  } else if (input.programme === 'adult-course') {
    const order: BurlingtonAccommodation[] = input.adultAge === 'minor'
      ? ['onsite', 'homestay', 'none', 'apartment'] : ['onsite', 'homestay', 'apartment', 'none'];
    next.accommodation = unused(order, plan => plan.accommodation) ?? last.accommodation;
    if (next.accommodation === 'homestay' && input.adultAge === 'minor') next.homestayBoard = 'hb';
  } else {
    const weeks = unused([4, 6, 2, 8], plan => plan.weeks);
    if (weeks !== undefined && ukAddDays(next.arrival, weeks * 7) <= BURLINGTON_SUMMER_RESIDENCE.end) next.weeks = weeks;
    else next.intensiveUpgrade = !last.intensiveUpgrade;
  }
  return next;
}

const pounds = (value: number) => `${value.toLocaleString('en-US')}英镑`;
const md = (value: string) => {
  const date = ukParseDate(value);
  return date ? `${date.getUTCMonth() + 1}月${date.getUTCDate()}日` : value;
};
const validWeeks = (weeks: number, max: number) => Number.isInteger(weeks) && weeks >= 1 && weeks <= max;

function stayDateText(arrival: string, weeks: number): string {
  return `${ukDateText(arrival)}入住 · ${md(ukAddDays(arrival, 1))}–${md(ukAddDays(arrival, weeks * 7 - 2))}上课 · `
    + `${md(ukAddDays(arrival, weeks * 7 - 1))}（周六）或${md(ukAddDays(arrival, weeks * 7))}（周日）离开`;
}

/** Plans without accommodation are described by their Monday course start and final Friday. */
function courseDateText(arrival: string, weeks: number): string {
  return `${ukDateText(ukAddDays(arrival, 1))}开课 · ${md(ukAddDays(arrival, weeks * 7 - 2))}（周五）结课`;
}

/** Plans store the arrival Sunday; a course-only plan shows and validates its Monday start instead. */
function arrivalIssues(arrival: string, courseOnly = false): string[] {
  if (!ukParseDate(arrival)) return [courseOnly ? '请选择开课日期。' : '请选择入住日期。'];
  if (ukIsSunday(arrival)) return [];
  return [courseOnly ? '开课日期需为周一。' : '入住日期需为周日（课程周一开始）。'];
}

function bankHolidayWarning(arrival: string): string[] {
  const monday = ukAddDays(arrival, 1);
  return BURLINGTON_BANK_HOLIDAYS_2027.includes(monday)
    ? [`${md(monday)}是英国法定假日，第一周课程从周二开始。`] : [];
}

/**
 * An optional service of one plan. `amount` null means a reference price that cannot be added
 * to the total (for example pay-as-you-go London transport); `forced` lines are added whenever
 * present (the unaccompanied-minor fee once a transfer is booked for a child under 14).
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

function transferExtras(input: BurlingtonQuoteInput): Extra[] {
  const extras = input.extras;
  const minor = input.programme === 'junior' && input.juniorAge < BURLINGTON_JUNIOR.unaccompaniedMinorAge;
  const minorNote = `14岁以下每程另加无人陪伴费${pounds(BURLINGTON_JUNIOR.unaccompaniedMinorFee)}（必须）`;
  if (!extras.arrivalTransfer && !extras.departureTransfer) {
    return [{
      key: 'transfer', label: '机场接送机', price: `单程${pounds(Math.min(...BURLINGTON_AIRPORTS.map(item => item.price)))}起`,
      note: `${BURLINGTON_AIRPORTS.map(item => `${item.name.replace(/机场$/, '')}${item.price}`).join('、')}英镑；`
        + (minor ? minorNote : `同行每多1人另加${pounds(BURLINGTON_TRANSFER_EXTRA_PERSON)}`),
      amount: null, selected: false,
    }];
  }
  const airport = BURLINGTON_AIRPORTS.find(item => item.id === extras.airport) ?? BURLINGTON_AIRPORTS[0];
  const ways = (extras.arrivalTransfer ? 1 : 0) + (extras.departureTransfer ? 1 : 0);
  const list: Extra[] = [
    { key: 'arrival', label: `接机（${airport.name}）`, price: `单程${pounds(airport.price)}`, lineNote: '单程1人',
      amount: airport.price, selected: extras.arrivalTransfer },
    { key: 'departure', label: `送机（${airport.name}）`, price: `单程${pounds(airport.price)}`, lineNote: '单程1人',
      amount: airport.price, selected: extras.departureTransfer },
  ];
  if (minor) {
    list.push({
      key: 'unaccompanied', label: '无人陪伴费', price: `${pounds(BURLINGTON_JUNIOR.unaccompaniedMinorFee)}/程`,
      lineNote: `${pounds(BURLINGTON_JUNIOR.unaccompaniedMinorFee)}/程 × ${ways}程，14岁以下接送机必须付`,
      amount: BURLINGTON_JUNIOR.unaccompaniedMinorFee * ways, selected: true,
    });
  }
  return list;
}

function bankExtra(input: BurlingtonQuoteInput): Extra {
  return { key: 'bank', label: '国际汇款手续费', price: pounds(BURLINGTON_FEES.bankCharge), note: '国际汇款付款时收取',
    lineNote: '国际汇款付款时收取', amount: BURLINGTON_FEES.bankCharge, selected: input.extras.bankCharge };
}

function examExtra(input: BurlingtonQuoteInput, plan: BurlingtonPlanInput): Extra[] {
  if (plan.courseFocus === 'general') return [];
  return [{ key: 'exam', label: '雅思／剑桥考试报名费', price: pounds(BURLINGTON_FEES.examFee), note: '需要在英国参加考试时',
    lineNote: '在英国参加雅思或剑桥考试', amount: BURLINGTON_FEES.examFee, selected: input.extras.exam }];
}

function adultCastleExtra(input: BurlingtonQuoteInput, castleFree: boolean, scope: string): Extra {
  return castleFree
    ? { key: 'castle', label: '巴斯城堡高级版升级', price: pounds(BURLINGTON_CASTLE.adultPremiumUpgrade),
      note: '多2项高级活动、2次特色餐和1份打包午餐', amount: BURLINGTON_CASTLE.adultPremiumUpgrade, selected: input.extras.castle }
    : { key: 'castle', label: '巴斯城堡2晚＋高级版', tag: `不在${scope}内`, price: pounds(BURLINGTON_CASTLE.adultShortStay),
      note: `报4周以上${scope}可免费参加标准版`, lineNote: '城堡住2晚，含高级版活动',
      amount: BURLINGTON_CASTLE.adultShortStay, selected: input.extras.castle };
}

function juniorPlan(input: BurlingtonQuoteInput, plan: BurlingtonPlanInput): BurlingtonPlanResult {
  const season = BURLINGTON_JUNIOR_SEASONS.find(item => item.id === plan.juniorSeason) ?? BURLINGTON_JUNIOR_SEASONS[1];
  const pkg = BURLINGTON_JUNIOR_PACKAGES.find(item => item.id === plan.juniorPackage) ?? BURLINGTON_JUNIOR_PACKAGES[0];
  const weeks = plan.weeks;
  const dayOnly = pkg.id === 'day';
  const issues = arrivalIssues(plan.arrival, dayOnly);
  if (!validWeeks(weeks, season.maxWeeks)) issues.push(`${season.name}项目可报1–${season.maxWeeks}周。`);
  if (!issues.length) {
    // Day students are told their Monday start; boarders their Sunday arrival.
    const startText = (sunday: string) => dayOnly ? `${ukDateText(ukAddDays(sunday, 1))}开课` : `${ukDateText(sunday)}入住`;
    if (plan.arrival < season.start) issues.push(`${season.name}项目最早${startText(season.start)}。`);
    if (ukAddDays(plan.arrival, weeks * 7) > season.end) {
      issues.push(`${season.name}项目${ukDateText(season.end)}结束，${weeks}周课程最晚${startText(ukAddDays(season.end, -weeks * 7))}。`);
    }
  }
  const age = input.juniorAge;
  if (!Number.isInteger(age) || age < BURLINGTON_JUNIOR.minAge || age > BURLINGTON_JUNIOR.maxAge) {
    issues.push('青少年项目适合11–17岁学生；16岁以上也可选成人课程。');
  } else if (age < pkg.minAge) {
    issues.push(`${pkg.name}需年满${pkg.minAge}岁，${age}岁学生请选学校宿舍或只上课不住宿。`);
  }

  const weekly = season.prices[pkg.id];
  const lodging = pkg.id !== 'day';
  const residence = pkg.id === 'residence';
  const homestayRoom = plan.juniorHomestayRoom === 'single' ? '单人间' : '双人间';
  // The package fee comes first, followed by everything it covers, so each line explains itself.
  const required: PlanLine[] = [
    { key: 'package', label: `${season.shortName}套餐费`, note: `${pounds(weekly)}/周 × ${weeks}周`, amount: weekly * weeks },
    { key: 'course', label: '英语课程', amount: 'included',
      note: `每周15节，每节45分钟，{{${weeks}周共${weeks * BURLINGTON_JUNIOR.lessonsPerWeek}节}}；周一至周五下午上课，项目式学习；入学分级测试，结业颁发证书` },
    { key: 'room', label: '住宿', amount: lodging ? 'included' : 'excluded',
      note: residence ? '学校宿舍3–6人间，上下铺，共用卫生间' : lodging ? `寄宿家庭${homestayRoom}，共用卫生间` : undefined },
    { key: 'meals', label: '餐食', amount: 'included',
      note: lodging ? '每天早、午、晚三餐，{{周一至周日都包含}}（入住当天只供晚餐，离开当天只供早餐）；全天出游时提供打包午餐'
        : '周一至周五午餐（不含早晚餐）' },
    { key: 'half-day', label: '半日游', amount: 'included',
      note: `周一至周五上午，每周5次，{{${weeks}周共${weeks * BURLINGTON_JUNIOR.halfDayTripsPerWeek}次}}` },
    { key: 'full-day', label: '全天出游', amount: lodging ? 'included' : 'excluded',
      note: lodging ? `每周六1次，{{${weeks}周共${weeks}次}}` : undefined },
    { key: 'evening', label: '晚间活动', amount: residence ? 'included' : 'excluded', note: residence ? '多数晚上安排' : undefined },
    { key: 'registration', label: '注册费', note: '一次性', amount: BURLINGTON_FEES.registration },
  ];
  const roomTitle = residence ? '学校宿舍 3–6人间' : lodging ? `寄宿家庭 ${homestayRoom}` : '只上课不住宿';
  const extras: Extra[] = [
    ...transferExtras(input),
    { key: 'travel-card', label: '伦敦交通卡（1–3区）', price: `${pounds(BURLINGTON_JUNIOR.travelCardPerWeek)}/周`,
      note: '外出活动乘坐公共交通，也可用非接触式支付',
      lineNote: `${pounds(BURLINGTON_JUNIOR.travelCardPerWeek)}/周 × ${weeks}周`,
      amount: BURLINGTON_JUNIOR.travelCardPerWeek * weeks, selected: input.extras.travelCard },
  ];
  if (pkg.id === 'homestay') {
    extras.push({ key: 'chaperone', label: '寄宿家庭往返学校陪同', price: `${pounds(BURLINGTON_JUNIOR.chaperonePerWeek)}/周`,
      lineNote: `${pounds(BURLINGTON_JUNIOR.chaperonePerWeek)}/周 × ${weeks}周`,
      amount: BURLINGTON_JUNIOR.chaperonePerWeek * weeks, selected: input.extras.chaperone });
  }
  if (pkg.id === 'day') {
    extras.push({ key: 'saturday-trip', label: '周六全天出游', price: `${pounds(BURLINGTON_JUNIOR.daySaturdayTrip)}/周`,
      lineNote: `${pounds(BURLINGTON_JUNIOR.daySaturdayTrip)}/周 × ${weeks}周`,
      amount: BURLINGTON_JUNIOR.daySaturdayTrip * weeks, selected: input.extras.saturdayTrip });
  }
  extras.push({
    key: 'castle', label: '巴斯城堡体验', tag: '不在套餐内', price: pounds(season.castleUpgrade),
    note: '城堡住2晚，含往返交通、巴斯导览、巨石阵门票、科茨沃尔德小镇游览等',
    lineNote: '城堡住2晚，含往返交通、巴斯导览、巨石阵门票等', amount: season.castleUpgrade, selected: input.extras.castle,
  });
  extras.push(bankExtra(input));
  // The school states the Tuesday start for adult courses only, so junior quotes carry no bank-holiday note.
  const dateText = issues.length ? '' : dayOnly ? courseDateText(plan.arrival, weeks) : stayDateText(plan.arrival, weeks);
  return finishPlan(roomTitle, weeks, dateText, required, extras, issues, []);
}

function adultAccommodation(input: BurlingtonQuoteInput, plan: BurlingtonPlanInput, issues: string[], warnings: string[]) {
  const weeks = plan.accommodationWeeks;
  const minor = input.adultAge === 'minor';
  const lines: PlanLine[] = [];
  let title = '';
  if (plan.accommodation === 'none') return { lines, title, weeks: 0 };
  if (!validWeeks(weeks, BURLINGTON_MAX_COURSE_WEEKS)) issues.push(`住宿可订1–${BURLINGTON_MAX_COURSE_WEEKS}周。`);
  // The accommodation line carries the room, what it includes and the meals.
  if (plan.accommodation === 'onsite') {
    const item = BURLINGTON_ONSITE_ROOMS.find(row => row.id === plan.onsiteRoom) ?? BURLINGTON_ONSITE_ROOMS[0];
    title = `校内宿舍${item.name.replace(/（.*$/, '')}`;
    lines.push({ key: 'accommodation', label: '住宿费', amount: item.price * weeks,
      note: `校内宿舍${item.name}，${pounds(item.price)}/周 × ${weeks}周\n提供床单，毛巾需自备或另付；每天清洁\n`
        + '餐食：校内食堂周一至周五早餐和晚餐，周六日早餐' });
    if (minor) {
      lines.push({ key: 'minor', label: '16/17岁附加费', note: `${pounds(BURLINGTON_ONSITE_MINOR_SURCHARGE)}/周 × ${weeks}周`,
        amount: BURLINGTON_ONSITE_MINOR_SURCHARGE * weeks });
    }
  } else if (plan.accommodation === 'apartment') {
    const item = BURLINGTON_APARTMENT_ROOMS.find(row => row.id === plan.apartmentRoom) ?? BURLINGTON_APARTMENT_ROOMS[0];
    if (minor) issues.push(`Wandsworth公寓只接受${BURLINGTON_APARTMENT_MIN_AGE}岁以上学生。`);
    title = `公寓${item.name.replace(/（.*$/, '')}`;
    lines.push({ key: 'accommodation', label: '住宿费', amount: item.price * weeks,
      note: `Wandsworth公寓${item.name}，${pounds(item.price)}/周 × ${weeks}周\n伦敦2区，坐公共交通到学校约30分钟；每周清洁\n`
        + '餐食：不含餐，可用公寓厨房自己做饭' });
    if (weeks < 2 || weeks > 24) warnings.push('Wandsworth 公寓一般可订2–24周，超出这个范围需学校确认。');
  } else {
    const tier = BURLINGTON_HOMESTAY_TIERS.find(row => row.id === plan.homestayTier) ?? BURLINGTON_HOMESTAY_TIERS[0];
    const board = BURLINGTON_HOMESTAY_BOARDS.find(row => row.id === plan.homestayBoard) ?? BURLINGTON_HOMESTAY_BOARDS[2];
    const roomName = plan.homestayRoom === 'single' ? '单人间' : '双人间';
    const price = BURLINGTON_HOMESTAY_PRICES[tier.id][plan.homestayRoom][board.id];
    const tierShort = tier.id === 'standard' ? '标准寄宿家庭' : '精选寄宿家庭';
    if (minor && board.id !== 'hb') issues.push('16/17岁学生住寄宿家庭必须选含早晚餐（Half Board）。');
    title = `${tierShort}${roomName}`;
    lines.push({ key: 'accommodation', label: '住宿费', amount: price * weeks,
      note: `${tierShort}${roomName}，${board.name}，${pounds(price)}/周 × ${weeks}周\n`
        + `${plan.homestayPrivateBathroom ? '独立卫生间' : '共用卫生间'}；提供床单和毛巾，每周清洁\n餐食：${board.meals}` });
    const supplements = BURLINGTON_HOMESTAY_SUPPLEMENTS;
    if (plan.homestayPrivateBathroom) {
      lines.push({ key: 'private-bath', label: '独立卫生间附加费', note: `${pounds(supplements.privateBathroom)}/周 × ${weeks}周`, amount: supplements.privateBathroom * weeks });
    }
    if (plan.homestaySpecialDiet) {
      lines.push({ key: 'diet', label: '特殊饮食附加费', note: `${pounds(supplements.specialDiet)}/周 × ${weeks}周`, amount: supplements.specialDiet * weeks });
    }
    const summerWeeks = ukParseDate(plan.arrival) ? ukOverlapWeeks(plan.arrival, weeks, supplements.summerStart, supplements.summerEnd) : 0;
    if (summerWeeks > 0) {
      lines.push({ key: 'summer', label: '寄宿家庭暑期附加费', note: `${pounds(supplements.summer)}/周 × ${summerWeeks}周（6月13日–8月29日期间）`, amount: supplements.summer * summerWeeks });
    }
    if (minor) {
      lines.push({ key: 'minor', label: '16/17岁附加费', note: `${pounds(supplements.minor)}/周 × ${weeks}周`, amount: supplements.minor * weeks });
    }
  }
  return { lines, title, weeks };
}

function adultPlan(input: BurlingtonQuoteInput, plan: BurlingtonPlanInput): BurlingtonPlanResult {
  const courseOnly = plan.accommodation === 'none';
  const issues = arrivalIssues(plan.arrival, courseOnly);
  const warnings: string[] = [];
  const focus = BURLINGTON_COURSE_FOCUS.find(item => item.id === plan.courseFocus) ?? BURLINGTON_COURSE_FOCUS[0];
  const groupCourse = BURLINGTON_ADULT_COURSES.find(item => item.id === plan.course);
  const weeks = plan.weeks;
  const hours = plan.oneToOneHours;
  if (!validWeeks(weeks, BURLINGTON_MAX_COURSE_WEEKS)) issues.push(`课程可报1–${BURLINGTON_MAX_COURSE_WEEKS}周。`);
  if (!Number.isInteger(hours) || hours < 0) issues.push('一对一课时需为整数。');
  if (!groupCourse && hours < 1) issues.push('只上一对一课程时，请填写一对一课时。');

  const required: PlanLine[] = [];
  let courseTitle = '一对一课程';
  if (groupCourse) {
    const rate = burlingtonCourseRate(groupCourse, weeks);
    courseTitle = groupCourse.name;
    required.push({ key: 'course', label: '学费', amount: rate * weeks,
      note: `${groupCourse.name}·${focus.name}，${pounds(rate)}/周 × ${weeks}周\n`
        + `${groupCourse.hoursText}：${groupCourse.schedule}；每节45分钟，每班最多18人（平均12人）；入学分级测试，结业颁发证书` });
  }
  if (hours > 0) {
    const rate = burlingtonOneToOneRate(hours);
    required.push({ key: 'one-to-one', label: '一对一课程', amount: rate * hours,
      note: `${pounds(rate)}/小时 × ${hours}小时（10小时以上每小时65英镑）\n按需安排上课时间` });
  }
  const stay = adultAccommodation(input, plan, issues, warnings);
  required.push(...stay.lines);
  required.push({ key: 'registration', label: '注册费', note: '一次性', amount: BURLINGTON_FEES.registration });
  if (plan.accommodation !== 'none') {
    required.push({ key: 'booking', label: '住宿预订费', note: '一次性', amount: BURLINGTON_FEES.accommodationBooking });
  }
  if (groupCourse) {
    const terms = Math.max(1, Math.ceil(weeks / BURLINGTON_FEES.coursebookTermWeeks));
    required.push({ key: 'coursebook', label: '教材费', note: `${pounds(BURLINGTON_FEES.coursebookPerTerm)}/学期 × ${terms}`, amount: BURLINGTON_FEES.coursebookPerTerm * terms });
  }

  const castleFree = !!groupCourse && weeks >= BURLINGTON_CASTLE.adultFreeFromWeeks;
  required.push(
    { key: 'social', label: '社交活动', amount: 'included',
      note: '周一至周五下午14:45起成人社交活动；部分门票（平均约20英镑）和外地一日游（平均约50英镑）另付' },
    castleLine(castleFree, '赠送'),
  );
  const extras: Extra[] = [
    adultCastleExtra(input, castleFree, '课程'),
    ...transferExtras(input),
    { key: 'transport', label: '伦敦市内交通', price: '按实际乘坐', note: '上学和外出乘坐公共交通，可用非接触式支付',
      amount: null, selected: false },
    ...examExtra(input, plan),
    bankExtra(input),
  ];

  if (!issues.length) {
    warnings.push(...bankHolidayWarning(plan.arrival));
    const lastDay = ukAddDays(plan.arrival, Math.max(weeks, stay.weeks) * 7);
    if (plan.arrival <= BURLINGTON_CHRISTMAS_CLOSURE.end && lastDay >= BURLINGTON_CHRISTMAS_CLOSURE.start) {
      warnings.push('学校2027年12月20日–31日圣诞停课，停课周如何安排以学校确认为准。');
    }
    const summer = BURLINGTON_JUNIOR_SEASONS.find(item => item.id === 'summer')!;
    if (plan.accommodation === 'onsite' && ukOverlapWeeks(plan.arrival, stay.weeks, summer.start, ukAddDays(summer.end, -1)) > 0) {
      warnings.push('暑期校内宿舍主要安排青少年项目，成人暑期住宿需学校确认空房；也可考虑成人暑期公寓套餐。');
    }
  }
  const title = stay.title ? `${courseTitle} ＋ ${stay.title}` : courseTitle;
  const dateText = issues.length ? ''
    : courseOnly ? `${courseDateText(plan.arrival, weeks)}，课程${weeks}周，不含住宿`
      : `${ukDateText(plan.arrival)}入住，${md(ukAddDays(plan.arrival, 1))}开课，课程${weeks}周，住宿${stay.weeks}周`;
  return finishPlan(title, weeks, dateText, required, extras, issues, warnings);
}

/** The Bath castle weekend: free with 4+ course weeks, otherwise only as an optional extra. */
function castleLine(included: boolean, verb: string): PlanLine {
  return included
    ? { key: 'castle', label: '巴斯城堡', amount: 'included',
      note: `{{${verb}2晚标准版}}：含往返交通、住宿早餐、巴斯和索尔兹伯里导览、城堡活动` }
    : { key: 'castle', label: '巴斯城堡', amount: 'excluded' };
}

function summerResidencePlan(input: BurlingtonQuoteInput, plan: BurlingtonPlanInput): BurlingtonPlanResult {
  const config = BURLINGTON_SUMMER_RESIDENCE;
  const weeks = plan.weeks;
  const issues = arrivalIssues(plan.arrival);
  const maxWeeks = Math.round((Date.parse(config.end) - Date.parse(config.start)) / (7 * 86400000));
  if (!validWeeks(weeks, maxWeeks) || weeks < config.minWeeks) issues.push(`公寓套餐可报${config.minWeeks}–${maxWeeks}周。`);
  if (!issues.length) {
    if (plan.arrival < config.start) issues.push(`公寓套餐最早${ukDateText(config.start)}入住。`);
    if (ukAddDays(plan.arrival, weeks * 7) > config.end) {
      issues.push(`公寓套餐${ukDateText(config.end)}结束，${weeks}周最晚${ukDateText(ukAddDays(config.end, -weeks * 7))}入住。`);
    }
  }
  const rate = burlingtonSummerResidenceRate(weeks) ?? config.tiers[0].rate;
  const tier = config.tiers.filter(item => weeks >= item.minWeeks).pop() ?? config.tiers[0];
  const castle = weeks >= BURLINGTON_CASTLE.adultFreeFromWeeks;
  const focus = BURLINGTON_COURSE_FOCUS.find(item => item.id === plan.courseFocus) ?? BURLINGTON_COURSE_FOCUS[0];
  // The package fee comes first, followed by everything it covers.
  const required: PlanLine[] = [
    { key: 'package', label: '公寓套餐费', note: `${pounds(rate)}/周 × ${weeks}周（${tier.minWeeks}周起档）`, amount: rate * weeks },
  ];
  if (plan.intensiveUpgrade) {
    required.push({ key: 'intensive', label: '强化课程升级', note: `${pounds(config.intensiveUpgradePerWeek)}/周 × ${weeks}周`, amount: config.intensiveUpgradePerWeek * weeks });
  }
  required.push(
    { key: 'course', label: '英语课程', amount: 'included',
      note: plan.intensiveUpgrade
        ? `强化课程每周22.5小时（${focus.name}）：主课08:45–11:15＋听说、读写、语法词汇工作坊；结业证书`
        : `标准课程每周15小时（${focus.name}）：主课08:45–11:15＋听说工作坊11:30–12:15；结业证书` },
    { key: 'room', label: '住宿', amount: 'included',
      note: 'iQ Vega公寓单人间；3间卧室共用1个厨房和2个卫生间；男女分开，18岁以上和16/17岁分开' },
    { key: 'meals', label: '餐食', amount: 'included', note: '周一至周五在学校食堂吃午餐；其他餐在公寓厨房自己做' },
    { key: 'social', label: '活动与服务', amount: 'included',
      note: '成人社交活动、健身房会员；公寓有自习室、游戏室、影音室和屋顶露台；学校员工住在公寓' },
    { key: 'transport', label: '上学交通', amount: 'included', note: '坐地铁到学校约25分钟，学校员工带学生上学' },
    castleLine(castle, '含'),
    { key: 'included-fees', label: '注册费、教材、住宿预订费、厨具床品包', amount: 'included' },
  );
  const extras: Extra[] = [
    adultCastleExtra(input, castle, '套餐'),
    ...transferExtras(input),
    ...examExtra(input, plan),
    bankExtra(input),
  ];
  const title = plan.intensiveUpgrade ? '公寓套餐 ＋ 强化课程' : '公寓套餐';
  return finishPlan(title, weeks, issues.length ? '' : stayDateText(plan.arrival, weeks), required,
    extras, issues, issues.length ? [] : bankHolidayWarning(plan.arrival));
}

function finishPlan(title: string, weeks: number, dateText: string, required: PlanLine[],
  extras: Extra[], issues: string[], warnings: string[]): BurlingtonPlanResult {
  const chosen = extras.filter(extra => extra.selected && extra.amount !== null);
  const lines: PlanLine[] = [
    ...required,
    ...chosen.map(extra => ({ key: extra.key, label: extra.label, note: extra.lineNote ?? extra.note, amount: extra.amount, optional: true })),
  ];
  const optional: PlanOptional[] = extras.filter(extra => !chosen.includes(extra))
    .map(extra => ({ key: extra.key, label: extra.label, price: extra.price, tag: extra.tag, note: extra.note }));
  const total = issues.length ? null : lines.reduce((sum, line) => sum + (typeof line.amount === 'number' ? line.amount : 0), 0);
  return { title, weeks, dateText, required: lines, optional, issues, warnings, total };
}

export function computeBurlingtonPlan(input: BurlingtonQuoteInput, plan: BurlingtonPlanInput): BurlingtonPlanResult {
  if (input.programme === 'junior') return juniorPlan(input, plan);
  if (input.programme === 'summer-residence') return summerResidencePlan(input, plan);
  return adultPlan(input, plan);
}

/** Every key in plan order; a key missing from earlier plans goes right after its predecessor. */
function unionKeys<T extends { key: string }>(lists: T[][]): string[] {
  const keys: string[] = [];
  lists.forEach(list => list.forEach((item, index) => {
    if (keys.includes(item.key)) return;
    // Keeps a homestay surcharge beside the accommodation row rather than after the included items.
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

export function buildBurlingtonSheet(input: BurlingtonQuoteInput, quoteDate: string, rate: BurlingtonQuoteRate,
  contacts: UkQuoteContact[]): UkQuoteSheet {
  const results = input.plans.slice(0, BURLINGTON_MAX_PLANS).map(plan => computeBurlingtonPlan(input, plan));
  const multiple = results.length > 1;
  const tags = multiple ? UK_QUOTE_PLAN_TAGS.slice(0, results.length) : [''];
  // Required rows first, then the optional services the student ticked, each in their own order.
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
  // Plans of different lengths name their weeks, so the column headers stay distinguishable.
  const planTitles = results.map(result => weeksText ? result.title : `${result.title}（${result.weeks}周）`);
  const season = BURLINGTON_JUNIOR_SEASONS.find(item => item.id === input.plans[0]?.juniorSeason) ?? BURLINGTON_JUNIOR_SEASONS[1];
  const sameSeason = input.plans.every(plan => plan.juniorSeason === season.id);
  // Compared plans are named in their column headers, so the subtitle only counts them.
  const plansText = multiple ? `${PLAN_COUNT_TEXT[results.length]}种方案对比` : planTitles[0];
  let title: string;
  let eyebrow: string;
  let subtitle: string;
  let requirement: string;
  if (input.programme === 'junior') {
    title = `Burlington School 伦敦${sameSeason ? season.shortName : '青少年'}${weeksText}报价`;
    eyebrow = `英国伦敦 · ${sameSeason ? season.name : '青少年项目'}`;
    subtitle = `${sameSeason ? season.name : ''}青少年课程（11–17岁）｜${plansText}`;
    requirement = `年龄11–17岁（寄宿家庭需14岁以上）\n英语水平需达到${BURLINGTON_JUNIOR.minLevel}`;
  } else if (input.programme === 'summer-residence') {
    title = `Burlington School 伦敦成人暑期公寓套餐${weeksText}报价`;
    eyebrow = '英国伦敦 · 2027 暑期';
    subtitle = `成人暑期公寓套餐（16岁以上）｜iQ Vega 公寓，2027年6月27日–8月22日${multiple ? `｜${plansText}` : ''}`;
    requirement = '16岁以上\n每周课程同标准课程，入学分级测试';
  } else {
    title = `Burlington School 伦敦成人课程${weeksText}报价`;
    eyebrow = '英国伦敦 · 成人英语课程';
    subtitle = `成人英语课程（16岁以上）｜${plansText}`;
    requirement = '16岁以上\n通用英语零基础可报，雅思备考需达到B1';
  }

  const dateValues = results.map(result => result.dateText || '日期待确认');
  const info: UkQuoteInfoItem[] = [
    { label: '学校', value: 'Burlington School（英国伦敦）\n1990年创办，英国文化协会认证' },
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
    '不含机票、英国签证、保险及个人零花钱。',
    '课程安排、活动和住宿规定仅供参考，学校可能随时调整；学位和房间以学校最终确认为准。',
  ];
  if (input.programme === 'adult-course') notes.push('课程每周一开课，遇英国法定假日改为周二；教材每学期（约12周）45英镑。');
  if (input.programme === 'summer-residence') notes.push('套餐已含注册费、教材、住宿预订费和厨具床品包，无其他额外费用。');
  notes.push(...warnings);

  return {
    fileName: `${title}.png`,
    schoolName: 'Burlington School',
    eyebrow,
    title,
    subtitle,
    quoteDate,
    currencyLabel: '英镑',
    info,
    plans: planTitles.map((title, index) => ({ tag: tags[index], title })),
    feesTitle: withExtras ? '费用明细' : '必付费用',
    totalLabel: withExtras ? '合计' : '必付合计',
    requiredRows,
    requiredTotals: totals,
    requiredTotalsCny: totals.map(total => ukCny(total, usableRate)),
    rateNote: usableRate
      ? `人民币按1英镑≈${usableRate.toFixed(4)}元估算（汇率日期${rate.date}），最终以实际支付汇率为准。`
      : '人民币汇率待更新，汇率更新后再保存报价图片。',
    examplesTitle: input.programme === 'junior' ? '活动示例（以学校当期安排为准）' : '',
    examples: input.programme === 'junior' ? [
      { label: '半日游', text: '威斯敏斯特、自然历史博物馆、伦敦塔和塔桥、国家美术馆、莎士比亚环球剧场、卡姆登市场等' },
      { label: '全天出游', text: '牛津、剑桥、布莱顿等' },
      { label: '晚间活动', text: '运动之夜、桌游、电影之夜、伦敦夜游等' },
    ] : [],
    optionalRows,
    optionalNote: withExtras ? '没有勾选的可选费用，不含在以上合计中' : '按需自选，不含在以上费用中',
    notes,
    contacts,
    website: UK_QUOTE_WEBSITE,
    issues,
    warnings,
  };
}
