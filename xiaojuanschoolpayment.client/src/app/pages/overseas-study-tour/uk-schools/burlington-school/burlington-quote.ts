// Burlington School quote engine: form input -> shared UK quote sheet. Pure functions only
// (no Angular, DOM, storage or regex lookbehind) so the mini program can bundle it later.
// Three of the school's price structures are supported:
//   junior            Young Learner weekly packages (spring/summer/autumn/winter, ages 11-17)
//   adult-course      tiered Standard/Intensive tuition, one-to-one hours and accommodation (16+)
//   summer-residence  Adult Summer Premium Residence package at iQ Vega (16+, 27 Jun - 22 Aug 2027)
// Optional services are listed as reference prices and never added to the required total.
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

export const BURLINGTON_PROGRAMMES: Array<{ id: BurlingtonProgramme; name: string; note: string }> = [
  { id: 'junior', name: '青少年项目（11–17岁）', note: '春季、暑期、秋季、冬季全包套餐' },
  { id: 'adult-course', name: '成人课程（16岁以上）', note: '标准课／强化课，可加住宿' },
  { id: 'summer-residence', name: '成人暑期公寓套餐', note: '2027年6月27日–8月22日，16岁以上' },
];

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

export interface BurlingtonQuoteInput {
  programme: BurlingtonProgramme;
  studentName: string;
  juniorAge: number;
  adultAge: BurlingtonAdultAge;
  airport: BurlingtonAirportId;
  plans: BurlingtonPlanInput[];
}

export interface BurlingtonQuoteRate {
  gbpToCny: number | null;
  date: string;
}

interface PlanLine { key: string; label: string; note?: string; amount: UkQuoteAmount }
interface PlanText { key: string; label: string; value: string }
interface PlanOptional extends UkQuoteOptionalRow { key: string }

export interface BurlingtonPlanResult {
  title: string;
  weeks: number;
  dateText: string;
  required: PlanLine[];
  includes: PlanText[];
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

export function defaultBurlingtonQuote(today: string, programme: BurlingtonProgramme = 'junior'): BurlingtonQuoteInput {
  return {
    programme,
    studentName: '',
    juniorAge: 15,
    adultAge: 'adult',
    airport: 'heathrow',
    plans: [defaultBurlingtonPlan(programme, today)],
  };
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

function arrivalIssues(arrival: string): string[] {
  if (!ukParseDate(arrival)) return ['请选择入住日期。'];
  return ukIsSunday(arrival) ? [] : ['入住日期需为周日（课程周一开始）。'];
}

function bankHolidayWarning(arrival: string): string[] {
  const monday = ukAddDays(arrival, 1);
  return BURLINGTON_BANK_HOLIDAYS_2027.includes(monday)
    ? [`${md(monday)}是英国法定假日，第一周课程从周二开始。`] : [];
}

function transferRow(input: BurlingtonQuoteInput): PlanOptional {
  const airport = BURLINGTON_AIRPORTS.find(item => item.id === input.airport) ?? BURLINGTON_AIRPORTS[0];
  const minor = input.programme === 'junior' && input.juniorAge < BURLINGTON_JUNIOR.unaccompaniedMinorAge;
  return {
    key: 'transfer',
    label: `机场接送机（${airport.name.replace(/机场$/, '')}）`,
    price: `单程${pounds(airport.price)}`,
    note: minor
      ? `14岁以下每程另加无人陪伴费${pounds(BURLINGTON_JUNIOR.unaccompaniedMinorFee)}（必须）`
      : `同行每多1人另加${pounds(BURLINGTON_TRANSFER_EXTRA_PERSON)}`,
  };
}

function juniorPlan(input: BurlingtonQuoteInput, plan: BurlingtonPlanInput): BurlingtonPlanResult {
  const season = BURLINGTON_JUNIOR_SEASONS.find(item => item.id === plan.juniorSeason) ?? BURLINGTON_JUNIOR_SEASONS[1];
  const pkg = BURLINGTON_JUNIOR_PACKAGES.find(item => item.id === plan.juniorPackage) ?? BURLINGTON_JUNIOR_PACKAGES[0];
  const weeks = plan.weeks;
  const issues = arrivalIssues(plan.arrival);
  if (!validWeeks(weeks, season.maxWeeks)) issues.push(`${season.name}项目可报1–${season.maxWeeks}周。`);
  if (!issues.length) {
    if (plan.arrival < season.start) issues.push(`${season.name}项目最早${ukDateText(season.start)}入住。`);
    if (ukAddDays(plan.arrival, weeks * 7) > season.end) {
      issues.push(`${season.name}项目${ukDateText(season.end)}结束，${weeks}周课程最晚${ukDateText(ukAddDays(season.end, -weeks * 7))}入住。`);
    }
  }
  const age = input.juniorAge;
  if (!Number.isInteger(age) || age < BURLINGTON_JUNIOR.minAge || age > BURLINGTON_JUNIOR.maxAge) {
    issues.push('青少年项目适合11–17岁学生；16岁以上也可选成人课程。');
  } else if (age < pkg.minAge) {
    issues.push(`${pkg.name}需年满${pkg.minAge}岁，${age}岁学生请选学校宿舍或只上课不住宿。`);
  }

  const weekly = season.prices[pkg.id];
  const packageAmount = weekly * weeks;
  const lodging = pkg.id !== 'day';
  const required: PlanLine[] = [
    {
      key: 'package', label: `${season.shortName}套餐费`,
      note: `${pounds(weekly)}/周 × ${weeks}周，包含课程、${lodging ? '住宿、三餐' : '午餐'}和出游活动`,
      amount: packageAmount,
    },
    { key: 'registration', label: '注册费', note: '一次性', amount: BURLINGTON_FEES.registration },
  ];
  const roomTitle = pkg.id === 'residence' ? '学校宿舍 3–6人间'
    : pkg.id === 'homestay' ? `寄宿家庭 ${plan.juniorHomestayRoom === 'single' ? '单人间' : '双人间'}` : '只上课不住宿';
  const includes: PlanText[] = [
    { key: 'course', label: '英语课程',
      value: `每周15节，每节45分钟，{{${weeks}周共${weeks * BURLINGTON_JUNIOR.lessonsPerWeek}节}}；周一至周五下午上课，项目式学习；入学分级测试，结业颁发证书` },
    { key: 'room', label: '住宿',
      value: pkg.id === 'residence' ? '学校宿舍 3–6人间\n上下铺，共用卫生间'
        : pkg.id === 'homestay' ? `寄宿家庭 ${plan.juniorHomestayRoom === 'single' ? '单人间' : '双人间'}\n共用卫生间` : '不含住宿' },
    { key: 'meals', label: '三餐',
      value: lodging ? '每天早、午、晚三餐，{{周一至周日都包含}}（入住当天只供晚餐，离开当天只供早餐）；全天出游时提供打包午餐' : '周一至周五午餐（不含早晚餐）' },
    { key: 'half-day', label: '半日游',
      value: `周一至周五上午，每周5次，{{${weeks}周共${weeks * BURLINGTON_JUNIOR.halfDayTripsPerWeek}次}}` },
    { key: 'full-day', label: '全天出游',
      value: lodging ? `每周六1次，{{${weeks}周共${weeks}次}}` : `不含（可另付${pounds(BURLINGTON_JUNIOR.daySaturdayTrip)}/周参加）` },
    { key: 'evening', label: '晚间活动', value: pkg.id === 'residence' ? '多数晚上安排' : '不含' },
  ];
  const optional: PlanOptional[] = [transferRow(input), {
    key: 'travel-card', label: '伦敦交通卡（1–3区）', price: `${pounds(BURLINGTON_JUNIOR.travelCardPerWeek)}/周`,
    note: '外出活动乘坐公共交通，也可用非接触式支付',
  }];
  if (pkg.id === 'homestay') {
    optional.push({ key: 'chaperone', label: '寄宿家庭往返学校陪同', price: `${pounds(BURLINGTON_JUNIOR.chaperonePerWeek)}/周` });
  }
  if (pkg.id === 'day') {
    optional.push({ key: 'saturday-trip', label: '周六全天出游', price: `${pounds(BURLINGTON_JUNIOR.daySaturdayTrip)}/周` });
  }
  optional.push({
    key: 'castle', label: '巴斯城堡体验', tag: '不在套餐内', price: pounds(season.castleUpgrade),
    note: '城堡住2晚，含往返交通、巴斯导览、巨石阵门票、科茨沃尔德小镇游览等',
  });
  // The school states the Tuesday start for adult courses only, so junior quotes carry no bank-holiday note.
  return finishPlan(roomTitle, weeks, issues.length ? '' : stayDateText(plan.arrival, weeks),
    required, includes, optional, issues, []);
}

function adultAccommodation(input: BurlingtonQuoteInput, plan: BurlingtonPlanInput, issues: string[], warnings: string[]) {
  const weeks = plan.accommodationWeeks;
  const minor = input.adultAge === 'minor';
  const lines: PlanLine[] = [];
  let title = '';
  let room = '不含住宿';
  let meals = '不含';
  if (plan.accommodation === 'none') return { lines, title, room, meals, weeks: 0 };
  if (!validWeeks(weeks, BURLINGTON_MAX_COURSE_WEEKS)) issues.push(`住宿可订1–${BURLINGTON_MAX_COURSE_WEEKS}周。`);
  if (plan.accommodation === 'onsite') {
    const item = BURLINGTON_ONSITE_ROOMS.find(row => row.id === plan.onsiteRoom) ?? BURLINGTON_ONSITE_ROOMS[0];
    title = `校内宿舍${item.name.replace(/（.*$/, '')}`;
    room = `校内宿舍 ${item.name}\n提供床单，毛巾需自备或另付；每天清洁`;
    meals = '周一至周五早餐和晚餐，周六日早餐';
    lines.push({ key: 'accommodation', label: '住宿费', note: `校内宿舍${item.name}，${pounds(item.price)}/周 × ${weeks}周`, amount: item.price * weeks });
    if (minor) {
      lines.push({ key: 'minor', label: '16/17岁附加费', note: `${pounds(BURLINGTON_ONSITE_MINOR_SURCHARGE)}/周 × ${weeks}周`,
        amount: BURLINGTON_ONSITE_MINOR_SURCHARGE * weeks });
    }
  } else if (plan.accommodation === 'apartment') {
    const item = BURLINGTON_APARTMENT_ROOMS.find(row => row.id === plan.apartmentRoom) ?? BURLINGTON_APARTMENT_ROOMS[0];
    if (minor) issues.push(`Wandsworth公寓只接受${BURLINGTON_APARTMENT_MIN_AGE}岁以上学生。`);
    title = `公寓${item.name.replace(/（.*$/, '')}`;
    room = `Wandsworth 公寓 ${item.name}\n伦敦2区，坐公共交通到学校约30分钟；每周清洁`;
    meals = '不含餐，可用公寓厨房自己做饭';
    lines.push({ key: 'accommodation', label: '住宿费', note: `Wandsworth公寓${item.name}，${pounds(item.price)}/周 × ${weeks}周`, amount: item.price * weeks });
    if (weeks < 2 || weeks > 24) warnings.push('Wandsworth 公寓一般可订2–24周，超出这个范围需学校确认。');
  } else {
    const tier = BURLINGTON_HOMESTAY_TIERS.find(row => row.id === plan.homestayTier) ?? BURLINGTON_HOMESTAY_TIERS[0];
    const board = BURLINGTON_HOMESTAY_BOARDS.find(row => row.id === plan.homestayBoard) ?? BURLINGTON_HOMESTAY_BOARDS[2];
    const roomName = plan.homestayRoom === 'single' ? '单人间' : '双人间';
    const price = BURLINGTON_HOMESTAY_PRICES[tier.id][plan.homestayRoom][board.id];
    const tierShort = tier.id === 'standard' ? '标准寄宿家庭' : '精选寄宿家庭';
    if (minor && board.id !== 'hb') issues.push('16/17岁学生住寄宿家庭必须选含早晚餐（Half Board）。');
    title = `${tierShort}${roomName}`;
    room = `${tierShort} ${roomName}\n${plan.homestayPrivateBathroom ? '独立卫生间' : '共用卫生间'}；提供床单和毛巾，每周清洁`;
    meals = board.meals;
    lines.push({ key: 'accommodation', label: '住宿费', note: `${tierShort}${roomName}，${board.name}，${pounds(price)}/周 × ${weeks}周`, amount: price * weeks });
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
  return { lines, title, room, meals, weeks };
}

function adultPlan(input: BurlingtonQuoteInput, plan: BurlingtonPlanInput): BurlingtonPlanResult {
  const issues = arrivalIssues(plan.arrival);
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
  let courseValue = `一对一课程${hours}小时，按需安排上课时间`;
  if (groupCourse) {
    const rate = burlingtonCourseRate(groupCourse, weeks);
    courseTitle = groupCourse.name;
    required.push({ key: 'course', label: '学费', note: `${groupCourse.name}·${focus.name}，${pounds(rate)}/周 × ${weeks}周`, amount: rate * weeks });
    courseValue = `${groupCourse.hoursText}：${groupCourse.schedule}；{{共${weeks}周}}；每节45分钟，每班最多18人（平均12人）；入学分级测试，结业颁发证书`
      + (hours > 0 ? `；另加一对一${hours}小时` : '');
  }
  if (hours > 0) {
    const rate = burlingtonOneToOneRate(hours);
    required.push({ key: 'one-to-one', label: '一对一课程', note: `${pounds(rate)}/小时 × ${hours}小时（10小时以上每小时65英镑）`, amount: rate * hours });
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
  const includes: PlanText[] = [
    { key: 'course', label: '英语课程', value: courseValue },
    { key: 'room', label: '住宿', value: stay.room },
    { key: 'meals', label: '餐食', value: stay.meals },
    { key: 'social', label: '社交活动', value: '周一至周五下午14:45起成人社交活动；部分门票（平均约20英镑）和外地一日游（平均约50英镑）另付' },
    { key: 'castle', label: '巴斯城堡',
      value: castleFree ? '{{赠送巴斯城堡2晚标准版}}：含往返交通、住宿早餐、巴斯和索尔兹伯里导览、城堡活动'
        : `不含（可另付${pounds(BURLINGTON_CASTLE.adultShortStay)}参加城堡2晚＋高级版）` },
  ];
  const optional: PlanOptional[] = [
    castleFree
      ? { key: 'castle', label: '巴斯城堡高级版升级', price: pounds(BURLINGTON_CASTLE.adultPremiumUpgrade), note: '多2项高级活动、2次特色餐和1份打包午餐' }
      : { key: 'castle', label: '巴斯城堡2晚＋高级版', tag: '不在课程内', price: pounds(BURLINGTON_CASTLE.adultShortStay), note: '报4周以上课程可免费参加标准版' },
    transferRow(input),
    { key: 'transport', label: '伦敦市内交通', price: '按实际乘坐', note: '上学和外出乘坐公共交通，可用非接触式支付' },
  ];
  if (plan.courseFocus !== 'general') {
    optional.push({ key: 'exam', label: '雅思／剑桥考试报名费', price: pounds(BURLINGTON_FEES.examFee), note: '需要在英国参加考试时' });
  }
  optional.push({ key: 'bank', label: '国际汇款手续费', price: pounds(BURLINGTON_FEES.bankCharge), note: '国际汇款付款时收取' });

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
  const dateText = issues.length ? '' : `${ukDateText(plan.arrival)}入住，${md(ukAddDays(plan.arrival, 1))}开课，课程${weeks}周`
    + (plan.accommodation === 'none' ? '，不含住宿' : `，住宿${stay.weeks}周`);
  return finishPlan(title, weeks, dateText, required, includes, optional, issues, warnings);
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
  const required: PlanLine[] = [
    { key: 'package', label: '公寓套餐费', note: `${pounds(rate)}/周 × ${weeks}周（${tier.minWeeks}周起档），含课程、住宿、午餐和活动`, amount: rate * weeks },
  ];
  if (plan.intensiveUpgrade) {
    required.push({ key: 'intensive', label: '强化课程升级', note: `${pounds(config.intensiveUpgradePerWeek)}/周 × ${weeks}周`, amount: config.intensiveUpgradePerWeek * weeks });
  }
  required.push({ key: 'included-fees', label: '注册费、教材、住宿预订费、厨具床品包', note: '套餐已含', amount: 'included' });
  const castle = weeks >= BURLINGTON_CASTLE.adultFreeFromWeeks;
  const focus = BURLINGTON_COURSE_FOCUS.find(item => item.id === plan.courseFocus) ?? BURLINGTON_COURSE_FOCUS[0];
  const includes: PlanText[] = [
    { key: 'course', label: '英语课程',
      value: plan.intensiveUpgrade
        ? `强化课程每周22.5小时（${focus.name}）：主课08:45–11:15＋听说、读写、语法词汇工作坊；{{共${weeks}周}}；结业证书`
        : `标准课程每周15小时（${focus.name}）：主课08:45–11:15＋听说工作坊11:30–12:15；{{共${weeks}周}}；结业证书` },
    { key: 'room', label: '住宿', value: 'iQ Vega 公寓单人间\n3间卧室共用1个厨房和2个卫生间；男女分开，18岁以上和16/17岁分开' },
    { key: 'meals', label: '餐食', value: '周一至周五学校午餐；其他餐在公寓厨房自己做' },
    { key: 'social', label: '活动与服务', value: '成人社交活动、健身房会员；公寓有自习室、游戏室、影音室和屋顶露台；学校员工住在公寓' },
    { key: 'transport', label: '上学交通', value: '坐地铁到学校约25分钟，学校员工带学生上学' },
    { key: 'castle', label: '巴斯城堡',
      value: castle ? '{{含巴斯城堡2晚标准版}}：含往返交通、住宿早餐、巴斯和索尔兹伯里导览、城堡活动'
        : `不含（可另付${pounds(BURLINGTON_CASTLE.adultShortStay)}参加城堡2晚＋高级版）` },
  ];
  const optional: PlanOptional[] = [
    castle
      ? { key: 'castle', label: '巴斯城堡高级版升级', price: pounds(BURLINGTON_CASTLE.adultPremiumUpgrade), note: '多2项高级活动、2次特色餐和1份打包午餐' }
      : { key: 'castle', label: '巴斯城堡2晚＋高级版', tag: '不在套餐内', price: pounds(BURLINGTON_CASTLE.adultShortStay), note: '报4周以上套餐可免费参加标准版' },
    transferRow(input),
  ];
  if (plan.courseFocus !== 'general') {
    optional.push({ key: 'exam', label: '雅思／剑桥考试报名费', price: pounds(BURLINGTON_FEES.examFee), note: '需要在英国参加考试时' });
  }
  const title = plan.intensiveUpgrade ? '公寓套餐 ＋ 强化课程' : '公寓套餐';
  return finishPlan(title, weeks, issues.length ? '' : stayDateText(plan.arrival, weeks), required, includes, optional, issues,
    issues.length ? [] : bankHolidayWarning(plan.arrival));
}

function finishPlan(title: string, weeks: number, dateText: string, required: PlanLine[], includes: PlanText[],
  optional: PlanOptional[], issues: string[], warnings: string[]): BurlingtonPlanResult {
  const total = issues.length ? null : required.reduce((sum, line) => sum + (typeof line.amount === 'number' ? line.amount : 0), 0);
  return { title, weeks, dateText, required, includes, optional, issues, warnings, total };
}

export function computeBurlingtonPlan(input: BurlingtonQuoteInput, plan: BurlingtonPlanInput): BurlingtonPlanResult {
  if (input.programme === 'junior') return juniorPlan(input, plan);
  if (input.programme === 'summer-residence') return summerResidencePlan(input, plan);
  return adultPlan(input, plan);
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

export function buildBurlingtonSheet(input: BurlingtonQuoteInput, quoteDate: string, rate: BurlingtonQuoteRate,
  contact: Omit<UkQuoteContact, 'website'>): UkQuoteSheet {
  const results = input.plans.map(plan => computeBurlingtonPlan(input, plan));
  const multiple = results.length > 1;
  const tags = multiple ? UK_QUOTE_PLAN_TAGS.slice(0, results.length) : [''];
  const requiredRows: UkQuoteMoneyRow[] = unionKeys(results.map(result => result.required)).map(key => {
    const lines = results.map(result => result.required.find(line => line.key === key));
    const first = lines.find(Boolean)!;
    return {
      label: first.label,
      note: combined(lines.map(line => line?.note), tags),
      amounts: lines.map(line => line ? line.amount : null),
    };
  });
  const includeRows: UkQuoteTextRow[] = unionKeys(results.map(result => result.includes)).map(key => {
    const values = results.map(result => result.includes.find(item => item.key === key)?.value ?? '不含');
    const label = results.map(result => result.includes.find(item => item.key === key)).find(Boolean)!.label;
    return { label, values: new Set(values).size === 1 ? [values[0]] : values };
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

  const weeksList = [...new Set(results.map(result => result.weeks))];
  const weeksText = weeksList.length === 1 && Number.isInteger(weeksList[0]) && weeksList[0] > 0 ? `${weeksList[0]}周` : '';
  const season = BURLINGTON_JUNIOR_SEASONS.find(item => item.id === input.plans[0]?.juniorSeason) ?? BURLINGTON_JUNIOR_SEASONS[1];
  const sameSeason = input.plans.every(plan => plan.juniorSeason === season.id);
  const planNames = results.map(result => result.title).join('、');
  let title: string;
  let eyebrow: string;
  let subtitle: string;
  let requirement: string;
  if (input.programme === 'junior') {
    title = `Burlington School 伦敦${sameSeason ? season.shortName : '青少年'}${weeksText}报价`;
    eyebrow = `英国伦敦 · ${sameSeason ? season.name : '青少年项目'}`;
    subtitle = `${sameSeason ? season.name : ''}青少年课程（11–17岁）${multiple ? `｜${planNames}两种方案` : `｜${planNames}`}`;
    requirement = `年龄11–17岁（寄宿家庭需14岁以上）\n英语水平需达到${BURLINGTON_JUNIOR.minLevel}`;
  } else if (input.programme === 'summer-residence') {
    title = `Burlington School 伦敦成人暑期公寓套餐${weeksText}报价`;
    eyebrow = '英国伦敦 · 2027 暑期';
    subtitle = `成人暑期公寓套餐（16岁以上）｜iQ Vega 公寓，2027年6月27日–8月22日${multiple ? `｜${planNames}两种方案` : ''}`;
    requirement = '16岁以上\n每周课程同标准课程，入学分级测试';
  } else {
    title = `Burlington School 伦敦成人课程${weeksText}报价`;
    eyebrow = '英国伦敦 · 成人英语课程';
    subtitle = `成人英语课程（16岁以上）｜${multiple ? `${planNames}两种方案` : planNames}`;
    requirement = '16岁以上\n通用英语零基础可报，雅思备考需达到B1';
  }

  const dateValues = results.map(result => result.dateText || '日期待确认');
  const info: UkQuoteInfoItem[] = [
    { label: '学校', value: 'Burlington School（英国伦敦）\n1990年创办，英国文化协会认证' },
    { label: '入学要求', value: requirement },
  ];
  if (input.studentName.trim()) info.push({ label: '学生', value: input.studentName.trim(), wide: true });
  info.push({
    label: weeksText ? `日期（共${weeksText}）` : '日期',
    value: new Set(dateValues).size === 1 ? dateValues[0] : dateValues.map((value, index) => `${tags[index]}：${value}`).join('\n'),
    wide: true,
  });

  const notes = [
    '以上为2027年价格，报名前以学校最终确认为准。',
    '费用以英镑计，人民币按参考汇率估算，最终以实际支付汇率为准。',
    '不含机票、英国签证、保险及个人零花钱。',
    '课程安排、活动和住宿规定仅供参考，学校可能随时调整；学位和房间以学校最终确认为准。',
  ];
  if (input.programme === 'adult-course') notes.push('课程每周一开课，遇英国法定假日改为周二；教材每学期45英镑，按每12周一学期预估。');
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
    plans: results.map((result, index) => ({ tag: tags[index], title: result.title })),
    requiredRows,
    requiredTotals: totals,
    requiredTotalsCny: totals.map(total => ukCny(total, usableRate)),
    rateNote: usableRate
      ? `人民币按1英镑≈${usableRate.toFixed(4)}元估算（汇率日期${rate.date}），最终以实际支付汇率为准。`
      : '人民币汇率待更新，汇率更新后再保存报价图片。',
    includeRows,
    examplesTitle: input.programme === 'junior' ? '活动示例（以学校当期安排为准）' : '',
    examples: input.programme === 'junior' ? [
      { label: '半日游', text: '威斯敏斯特、自然历史博物馆、伦敦塔和塔桥、国家美术馆、莎士比亚环球剧场、卡姆登市场等' },
      { label: '全天出游', text: '牛津、剑桥、布莱顿等' },
      { label: '晚间活动', text: '运动之夜、桌游、电影之夜、伦敦夜游等' },
    ] : [],
    optionalRows,
    optionalNote: '按需自选，不含在以上费用中',
    notes,
    contact: { ...contact, website: UK_QUOTE_WEBSITE },
    issues,
    warnings,
  };
}
