// CampusTop（快酷英语, formerly QQEnglish）2027 catalogue for its two Cebu campuses: IT Park（ITP）and Beach Front
// （BFC, Mactan Newtown）. Sources (docs/qq-source-2026-11-26.md): the school's unit price sheet of 2026-10-30, the
// Savoy price notice of 2026-10-30, the Treewood price note, the 2027 meal and peak policy, the 2027 holiday list,
// the local-fee sheet of 2026-11-24 and the school's own quote system (offline.qqeng.com), which the user named as the
// final word on ESL prices. Each page shows and quotes its own campus only; the school bills campuses separately.
// Keep this file pure data and functions (no Angular, DOM or storage), so the WeChat mini program can bundle it.

export type QqCampus = 'itp' | 'bfc';

export const QQ_CAMPUS_NAMES: Readonly<Record<QqCampus, string>> = {
  itp: 'QQ English IT Park校区',
  bfc: 'QQ English Beach Front校区',
};

const DAY = 86400000;

/**
 * Course prices follow the school's quote system: a price for the number of class days (Monday to Friday, less the
 * school's closed holidays). 1–14 days have their own totals; from 15 days on every day costs the tier's day rate.
 * Checked against the system on 2026-11-26 for 1–24, 29–31, 35, 39–41, 45, 59–61, 80, 100, 120, 121 and 140 days.
 */
export interface QqCoursePackage {
  id: string;
  name: string;
  /** Daily lessons; under 15 only the one-to-one packages (no group classes). */
  schedule: string;
  oneToOne: number;
  groupClasses: number;
  /** Totals in dollars for 1–14 class days. */
  shortTotals: readonly number[];
  /** Day rates in dollars for 15–19, 20–39 and 40 or more class days. */
  rates: readonly [number, number, number];
  suitable: string;
}

export const QQ_COURSE_PACKAGES: readonly QqCoursePackage[] = [
  {
    id: 'one4', name: '4节一对一', schedule: '每天4节一对一', oneToOne: 4, groupClasses: 0,
    shortTotals: [160, 224, 252, 256, 276, 331.2, 386.4, 441.6, 486, 490, 528, 576, 572, 582.4],
    rates: [39.2, 39.2, 38], suitable: '想留出时间自习或在宿务生活的学生，也适合4–14岁的孩子',
  },
  {
    id: 'one4-group2', name: '4节一对一 + 2节小团课', schedule: '每天4节一对一、2节小团课', oneToOne: 4, groupClasses: 2,
    shortTotals: [180, 256, 288, 296, 315, 369.6, 431.2, 492.8, 543.6, 554, 583, 636, 637, 652.4],
    rates: [44.2, 44.2, 42.82], suitable: '15岁以上、想在一对一之外和同学一起练口语的学生',
  },
  {
    id: 'one6', name: '6节一对一', schedule: '每天6节一对一', oneToOne: 6, groupClasses: 0,
    shortTotals: [208.2, 240, 277.2, 369.6, 435, 522, 526.26, 601.44, 676.62, 690, 759, 792, 795.6, 798],
    rates: [55.38, 53.88, 53.88], suitable: '想多上一对一、集中提高的学生',
  },
  {
    id: 'one6-group2', name: '6节一对一 + 2节小团课', schedule: '每天6节一对一、2节小团课', oneToOne: 6, groupClasses: 2,
    shortTotals: [228.2, 272, 313.2, 409.6, 474, 560.4, 571.06, 652.64, 734.22, 754, 814, 852, 860.6, 868],
    rates: [60.38, 58.88, 58.7], suitable: '15岁以上、想把一天排满的学生',
  },
  {
    id: 'one8', name: '8节一对一', schedule: '每天8节一对一', oneToOne: 8, groupClasses: 0,
    shortTotals: [277.6, 320, 369.6, 492.8, 580, 696, 701.68, 801.92, 902.16, 920, 1012, 1056, 1060.8, 1064],
    rates: [73.84, 71.84, 71.84], suitable: '时间很短、想全部上一对一的学生',
  },
];

/** Packages with group classes; group classes are only for students 15 and older. */
export const QQ_GROUP_PACKAGE_IDS: readonly string[] = QQ_COURSE_PACKAGES.filter(item => item.groupClasses > 0).map(item => item.id);

const roundCents = (value: number): number => Math.round(value * 100) / 100;

/** The school's price for this many class days of a package. */
export function qqCoursePrice(packageId: string, classDays: number): number {
  const item = QQ_COURSE_PACKAGES.find(candidate => candidate.id === packageId);
  if (!item || classDays <= 0) return 0;
  if (classDays <= item.shortTotals.length) return item.shortTotals[classDays - 1];
  const rate = classDays >= 40 ? item.rates[2] : classDays >= 20 ? item.rates[1] : item.rates[0];
  return roundCents(rate * classDays);
}

/** Four-week (20 class days) price, the figure the course list shows. */
export const qqFourWeekPrice = (packageId: string): number => qqCoursePrice(packageId, 20);

/**
 * The school's closed holidays (no class, not charged), from its quote system and the 2027 holiday list (blue rows).
 * Other Philippine holidays are normal class days at CampusTop. Sinulog（ITP）falls on a Sunday in 2027.
 */
export const QQ_CLOSED_HOLIDAYS: Readonly<Record<QqCampus, readonly string[]>> = {
  itp: [
    '2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01', '2027-01-17', '2027-03-25', '2027-03-26', '2027-11-01',
    '2027-12-24', '2027-12-25', '2027-12-31', '2028-01-01', '2028-11-01', '2028-12-24', '2028-12-25', '2028-12-31',
  ],
  bfc: [
    '2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01', '2027-03-25', '2027-03-26', '2027-11-01',
    '2027-12-24', '2027-12-25', '2027-12-31', '2028-01-01', '2028-11-01', '2028-12-24', '2028-12-25', '2028-12-31',
  ],
};

const isoDay = (time: number): string => new Date(time).toISOString().slice(0, 10);

/** Class days (Monday to Friday, less closed holidays) in the weeks that start on this Sunday. */
export function qqClassDays(campus: QqCampus, startSunday: string, weeks: number): number {
  const start = Date.parse(`${startSunday}T00:00:00Z`);
  if (Number.isNaN(start) || weeks <= 0) return 0;
  const closed = new Set(QQ_CLOSED_HOLIDAYS[campus]);
  let days = 0;
  for (let week = 0; week < weeks; week++) {
    for (let weekday = 1; weekday <= 5; weekday++) {
      if (!closed.has(isoDay(start + (week * 7 + weekday) * DAY))) days++;
    }
  }
  return days;
}

/**
 * Philippine holidays on which the school holds class as usual: the day is a normal class day and the school's quote
 * system adds its Holiday Fee of 35 dollars for each one inside the course (school quote system, 2026-11-26). Dates
 * marked tentative on the 2027 holiday list (Eid al-Fitr, Eid al-Adha, Lapu-Lapu City Charter) are not in the system.
 */
export const QQ_HOLIDAY_CLASS_DAYS: Readonly<Record<QqCampus, readonly string[]>> = {
  itp: ['2026-12-08', '2026-12-30', '2027-02-24', '2027-04-09', '2027-08-06', '2027-08-30', '2027-09-09', '2027-11-02', '2027-11-30', '2027-12-08', '2027-12-30'],
  bfc: ['2026-12-08', '2026-12-30', '2027-04-09', '2027-04-27', '2027-08-06', '2027-08-30', '2027-09-09', '2027-11-02', '2027-11-30', '2027-12-08', '2027-12-30'],
};

/** Holidays with class (Holiday Fee) inside the weeks that start on this Sunday. */
export function qqHolidayClassDays(campus: QqCampus, startSunday: string, weeks: number): string[] {
  const start = Date.parse(`${startSunday}T00:00:00Z`);
  if (Number.isNaN(start) || weeks <= 0) return [];
  const end =isoDay(start + (weeks * 7 - 1) * DAY);
  return QQ_HOLIDAY_CLASS_DAYS[campus].filter(day => day > startSunday && day <= end);
}

/** Closed weekdays inside the weeks that start on this Sunday, for the quote's notes. */
export function qqClosedWeekdays(campus: QqCampus, startSunday: string, weeks: number): string[] {
  const start = Date.parse(`${startSunday}T00:00:00Z`);
  if (Number.isNaN(start) || weeks <= 0) return [];
  const closed = new Set(QQ_CLOSED_HOLIDAYS[campus]);
  const result: string[] = [];
  for (let week = 0; week < weeks; week++) {
    for (let weekday = 1; weekday <= 5; weekday++) {
      const day = isoDay(start + (week * 7 + weekday) * DAY);
      if (closed.has(day)) result.push(day);
    }
  }
  return result;
}

export interface QqRoom {
  id: string;
  name: string;
  campuses: readonly QqCampus[];
  group: '学校宿舍' | '合作酒店' | '走读';
  /** Nightly rate in dollars; a room is charged per room, the capsule per person. */
  nightly: number;
  note: string;
  /** Students under 15 may not stay here (the capsule dormitory). */
  fifteenPlus?: boolean;
}

/** Capsule: 17.15 dollars a night below 27 nights (1–3 weeks), 13 dollars from 27 nights (4 weeks and longer). */
export const QQ_CAPSULE_SHORT_NIGHTLY = 17.15;
export const QQ_CAPSULE_LONG_NIGHTLY = 13;
export const QQ_CAPSULE_LONG_FROM_NIGHTS = 27;

export const QQ_ROOMS: readonly QqRoom[] = [
  {
    id: 'capsule', name: '太空舱宿舍', campuses: ['itp', 'bfc'], group: '学校宿舍', nightly: QQ_CAPSULE_LONG_NIGHTLY, fifteenPlus: true,
    note: '学校的太空舱床位，按人收费；只收15岁以上学生；1–3周每晚17.15美元，4周以上每晚13美元。',
  },
  {
    id: 'treewood', name: 'Treewoods酒店客房', campuses: ['itp'], group: '合作酒店', nightly: 50,
    note: '学校合作酒店，步行到校约7–10分钟；每间每晚50美元（含水电），每间最多2人。',
  },
  {
    id: 'savoy-standard', name: 'Savoy酒店标准间', campuses: ['bfc'], group: '合作酒店', nightly: 55,
    note: '学校合作酒店，离校约50米；每间每晚55美元，1、7、8、12月60美元，8/7–8/9和12/31每晚105美元。',
  },
  {
    id: 'savoy-suite', name: 'Savoy酒店高级套房', campuses: ['bfc'], group: '合作酒店', nightly: 130,
    note: '学校合作酒店，离校约50米；每间每晚130美元，1、7、8、12月135美元，8/7–8/9和12/31每晚180美元。',
  },
  {
    id: 'commute', name: '走读（自己安排住宿）', campuses: ['itp', 'bfc'], group: '走读', nightly: 0,
    note: '不订学校的宿舍或合作酒店，自己安排住宿，每天到校上课；不收住宿费，餐食和到校学杂费照常。',
  },
];

/** Savoy's nightly rate for the night that starts on this date (price notice of 2026-10-30, valid until changed). */
export function qqSavoyNightly(roomId: 'savoy-standard' | 'savoy-suite', night: string): number {
  const [, month, day] = night.split('-').map(Number);
  const suite = roomId === 'savoy-suite';
  if ((month === 8 && day >= 7 && day <= 9) || (month === 12 && day === 31)) return suite ? 180 : 105;
  if ([1, 7, 8, 12].includes(month)) return suite ? 135 : 60;
  return suite ? 130 : 55;
}

/**
 * Room price for nights starting on `firstNight` (a Sunday). `capsuleNights` is the student's whole capsule stay,
 * which decides the capsule's nightly rate.
 */
export function qqRoomPrice(roomId: string, firstNight: string, nights: number, capsuleNights = nights): number {
  const start = Date.parse(`${firstNight}T00:00:00Z`);
  if (Number.isNaN(start) || nights <= 0) return 0;
  if (roomId === 'capsule') {
    const rate = capsuleNights >= QQ_CAPSULE_LONG_FROM_NIGHTS ? QQ_CAPSULE_LONG_NIGHTLY : QQ_CAPSULE_SHORT_NIGHTLY;
    return roundCents(rate * nights);
  }
  if (roomId === 'savoy-standard' || roomId === 'savoy-suite') {
    let total = 0;
    for (let night = 0; night < nights; night++) total += qqSavoyNightly(roomId, isoDay(start + night * DAY));
    return total;
  }
  const room = QQ_ROOMS.find(item => item.id === roomId);
  return roundCents((room?.nightly ?? 0) * nights);
}

/** Four-week room price (27 nights, Sunday to the fourth Saturday) at the usual rate, for the room table. */
export const qqFourWeekRoomPrice = (roomId: string): number => {
  const room = QQ_ROOMS.find(item => item.id === roomId);
  return roundCents((room?.nightly ?? 0) * 27);
};

/**
 * Meals (school canteen, three a day) are charged from the first class day to the last, calendar days: 105 dollars
 * for a one-week course, otherwise 10 dollars a day (2 weeks 120, 4 weeks 260 dollars).
 */
export const QQ_MEAL_ONE_WEEK = 105;
export const QQ_MEAL_DAILY = 10;
export const qqMealPrice = (courseWeeks: number, days: number): number =>
  courseWeeks <= 0 || days <= 0 ? 0 : courseWeeks === 1 ? QQ_MEAL_ONE_WEEK : QQ_MEAL_DAILY * days;

export const QQ_REGISTRATION_FEE = 150;
export const QQ_PICKUP_FEE = 30;
/** Holiday Fee for each holiday with class; weekend classes and classes on a closed day also cost 35 dollars a day. */
export const QQ_EXTRA_DAY_FEE = 35;

/** 2027 peak (meal and companion policy of 2026-11): 2027/07/11–08/14. */
export const QQ_PEAK_2027 = { start: '2027-07-11', end: '2027-08-14' } as const;
/** Arrivals 2027/07/25–08/07 book at least 2 weeks (10 class days). */
export const QQ_PEAK_MINIMUM = { start: '2027-07-25', end: '2027-08-07', weeks: 2 } as const;
/** Applications sent by this date follow the 2026 meal rules (meals optional) even for a 2027 start. */
export const QQ_2026_MEAL_RULE_UNTIL = '2026-12-31';

/** Days in the Philippines for the visa table: Sunday arrival to Saturday departure. */
export const qqStayDays = (weeks: number): number => weeks * 7;

/**
 * Visa extension fees in pesos for a Chinese passport, cumulative by days in the Philippines (school quote system,
 * 2026-11-26). Index 0: up to 30 days, 1: 31–59, 2: 60–89, 3: 90–119, 4: 120–149, 5: 150–179.
 */
export const QQ_VISA_FEES = {
  tourist30: [0, 7230, 9210, 13250, 15230, 19270],
  tourist59: [0, 0, 7230, 9210, 13250, 15230],
} as const;

export function qqVisaFee(visa: 'tourist30' | 'tourist59', days: number): number {
  const band = days <= 30 ? 0 : days <= 59 ? 1 : Math.min(5, Math.floor((days - 60) / 30) + 2);
  return QQ_VISA_FEES[visa][band] ?? QQ_VISA_FEES[visa][5];
}
