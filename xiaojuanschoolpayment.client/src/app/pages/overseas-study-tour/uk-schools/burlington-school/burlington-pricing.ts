// Burlington School (London) 2027 prices, copied from the school's "Price List 2027" (12 pages,
// received 2026-11-19). All amounts are pounds per student. Pure data: the page tables, the
// quote calculator and the quote image read only this module, so a price change is made once.
// Agent commission is internal and must never be added here or shown anywhere.

export type BurlingtonSeasonId = 'spring' | 'summer' | 'autumn' | 'winter';
export type BurlingtonJuniorPackageId = 'day' | 'residence' | 'homestay';

export interface BurlingtonJuniorSeason {
  id: BurlingtonSeasonId;
  name: string;
  shortName: string;
  /** First arrival Sunday and last departure Sunday. */
  start: string;
  end: string;
  maxWeeks: number;
  prices: Record<BurlingtonJuniorPackageId, number>;
  castleUpgrade: number;
}

export const BURLINGTON_JUNIOR_SEASONS: BurlingtonJuniorSeason[] = [
  { id: 'spring', name: '2027年春季', shortName: '春季', start: '2027-03-14', end: '2027-04-25', maxWeeks: 6,
    prices: { day: 625, residence: 1045, homestay: 1045 }, castleUpgrade: 395 },
  { id: 'summer', name: '2027年暑期', shortName: '暑期', start: '2027-05-30', end: '2027-08-29', maxWeeks: 13,
    prices: { day: 675, residence: 1195, homestay: 1195 }, castleUpgrade: 445 },
  { id: 'autumn', name: '2027年秋季', shortName: '秋季', start: '2027-10-10', end: '2027-11-07', maxWeeks: 4,
    prices: { day: 625, residence: 1045, homestay: 1045 }, castleUpgrade: 395 },
  { id: 'winter', name: '2028年冬季', shortName: '冬季', start: '2028-01-02', end: '2028-01-30', maxWeeks: 4,
    prices: { day: 625, residence: 1045, homestay: 1045 }, castleUpgrade: 395 },
];

export interface BurlingtonJuniorPackage {
  id: BurlingtonJuniorPackageId;
  name: string;
  room: string;
  minAge: number;
}

export const BURLINGTON_JUNIOR_PACKAGES: BurlingtonJuniorPackage[] = [
  { id: 'residence', name: '学校宿舍', room: '3–6人间（另有一间8人间），上下铺，共用卫生间', minAge: 11 },
  { id: 'homestay', name: '寄宿家庭', room: '单人间或双人间，共用卫生间', minAge: 14 },
  { id: 'day', name: '只上课不住宿', room: '不含住宿', minAge: 11 },
];

export const BURLINGTON_JUNIOR = {
  minAge: 11,
  maxAge: 17,
  lessonsPerWeek: 15,
  halfDayTripsPerWeek: 5,
  /** Day Programme students pay this per week to join the Saturday full-day excursion. */
  daySaturdayTrip: 80,
  chaperonePerWeek: 150,
  travelCardPerWeek: 60,
  unaccompaniedMinorFee: 50,
  unaccompaniedMinorAge: 14,
  minLevel: 'A2（初中级）',
};

export interface BurlingtonCourseTier {
  minWeeks: number;
  maxWeeks: number | null;
  rate: number;
}

export type BurlingtonCourseId = 'standard' | 'intensive';

export interface BurlingtonAdultCourse {
  id: BurlingtonCourseId;
  name: string;
  englishName: string;
  hoursText: string;
  schedule: string;
  tiers: BurlingtonCourseTier[];
}

export const BURLINGTON_ADULT_COURSES: BurlingtonAdultCourse[] = [
  {
    id: 'standard', name: '标准课程', englishName: 'Standard Course', hoursText: '每周15小时',
    schedule: '主课 08:45–11:15 + 听说工作坊 11:30–12:15',
    tiers: [
      { minWeeks: 1, maxWeeks: 4, rate: 315 },
      { minWeeks: 5, maxWeeks: 11, rate: 295 },
      { minWeeks: 12, maxWeeks: 23, rate: 275 },
      { minWeeks: 24, maxWeeks: 35, rate: 255 },
      { minWeeks: 36, maxWeeks: null, rate: 235 },
    ],
  },
  {
    id: 'intensive', name: '强化课程', englishName: 'Intensive Course', hoursText: '每周22.5小时',
    schedule: '标准课程 + 读写工作坊 13:00–13:45 + 语法词汇工作坊 13:50–14:35',
    tiers: [
      { minWeeks: 1, maxWeeks: 4, rate: 395 },
      { minWeeks: 5, maxWeeks: 11, rate: 375 },
      { minWeeks: 12, maxWeeks: 23, rate: 355 },
      { minWeeks: 24, maxWeeks: 35, rate: 335 },
      { minWeeks: 36, maxWeeks: null, rate: 315 },
    ],
  },
];

export type BurlingtonCourseFocus = 'general' | 'ielts' | 'cambridge';
export const BURLINGTON_COURSE_FOCUS: Array<{ id: BurlingtonCourseFocus; name: string; level: string }> = [
  { id: 'general', name: '通用英语', level: '零基础到C2都可报读' },
  { id: 'ielts', name: '雅思备考', level: '英语水平需达到B1' },
  { id: 'cambridge', name: '剑桥考试备考', level: 'PET / FCE / CAE / CPE，按水平分班' },
];

export const BURLINGTON_ONE_TO_ONE = { rate: 75, discountedRate: 65, discountFromHours: 10 };
/** Listed as £645 without a stated unit; shown on the page only, never auto-quoted. */
export const BURLINGTON_FAST_TRACK = 645;
export const BURLINGTON_MAX_COURSE_WEEKS = 52;

export type BurlingtonOnsiteRoomId = 'dorm' | 'twin-shared' | 'twin-private' | 'single-shared' | 'single-private' | 'deluxe';
export const BURLINGTON_ONSITE_ROOMS: Array<{ id: BurlingtonOnsiteRoomId; name: string; english: string; price: number }> = [
  { id: 'dorm', name: '3–6人间（上下铺，共用卫生间）', english: 'Dorm 3-6 per room', price: 235 },
  { id: 'twin-shared', name: '双人间（上下铺，共用卫生间）', english: 'Twin (bunk bed - shared bathroom)', price: 270 },
  { id: 'twin-private', name: '双人间（上下铺，独立卫生间）', english: 'Twin (bunk bed - private bathroom)', price: 295 },
  { id: 'single-shared', name: '单人间（共用卫生间）', english: 'Single (shared bathroom)', price: 370 },
  { id: 'single-private', name: '单人间（独立卫生间）', english: 'Single (private bathroom)', price: 395 },
  { id: 'deluxe', name: '豪华单人间（独立卫生间）', english: 'Deluxe Single (private bathroom)', price: 495 },
];
export const BURLINGTON_ONSITE_MINOR_SURCHARGE = 30;

export type BurlingtonApartmentRoomId = 'single-private' | 'single-shared' | 'twin-private' | 'twin-shared';
export const BURLINGTON_APARTMENT_ROOMS: Array<{ id: BurlingtonApartmentRoomId; name: string; price: number }> = [
  { id: 'single-private', name: '单人间（独立卫生间）', price: 375 },
  { id: 'single-shared', name: '单人间（共用卫生间）', price: 350 },
  { id: 'twin-private', name: '双人间（独立卫生间）', price: 275 },
  { id: 'twin-shared', name: '双人间（共用卫生间）', price: 250 },
];
export const BURLINGTON_APARTMENT_MIN_AGE = 18;

export type BurlingtonHomestayTier = 'standard' | 'collection';
export type BurlingtonHomestayRoom = 'single' | 'twin';
export type BurlingtonHomestayBoard = 'self' | 'bb' | 'hb';
export const BURLINGTON_HOMESTAY_TIERS: Array<{ id: BurlingtonHomestayTier; name: string; note: string }> = [
  { id: 'standard', name: '标准寄宿家庭', note: '舒适实惠的伦敦寄宿家庭，可能由合作住宿机构安排' },
  { id: 'collection', name: '精选寄宿家庭（Burlington Homestay Collection）', note: '学校精选房东，位置更方便' },
];
export const BURLINGTON_HOMESTAY_BOARDS: Array<{ id: BurlingtonHomestayBoard; name: string; meals: string }> = [
  { id: 'self', name: '不含餐（Self-Catering）', meals: '不含餐，可按房东规定使用厨房自己做饭' },
  { id: 'bb', name: '含早餐（Bed & Breakfast）', meals: '每天早餐（欧陆式，房东备好自取）' },
  { id: 'hb', name: '含早晚餐（Half Board）', meals: '每天早餐和晚餐，晚餐通常和房东一家一起吃' },
];
export const BURLINGTON_HOMESTAY_PRICES: Record<BurlingtonHomestayTier, Record<BurlingtonHomestayRoom, Record<BurlingtonHomestayBoard, number>>> = {
  standard: { single: { self: 240, bb: 250, hb: 280 }, twin: { self: 230, bb: 240, hb: 270 } },
  collection: { single: { self: 290, bb: 300, hb: 330 }, twin: { self: 280, bb: 290, hb: 320 } },
};
export const BURLINGTON_HOMESTAY_SUPPLEMENTS = {
  privateBathroom: 50,
  specialDiet: 35,
  summer: 25,
  summerStart: '2027-06-13',
  summerEnd: '2027-08-29',
  /** Students aged 16 or 17 must book Half Board and pay this extra per week. */
  minor: 30,
};

export const BURLINGTON_FEES = {
  registration: 55,
  accommodationBooking: 55,
  coursebookPerTerm: 45,
  /** General English terms run 12 or 13 weeks; one coursebook per started 12 weeks is an estimate. */
  coursebookTermWeeks: 12,
  bankCharge: 20,
  examFee: 300,
};

export type BurlingtonAirportId = 'heathrow' | 'gatwick' | 'luton' | 'stansted' | 'st-pancras';
export const BURLINGTON_AIRPORTS: Array<{ id: BurlingtonAirportId; name: string; price: number }> = [
  { id: 'heathrow', name: '希思罗机场', price: 150 },
  { id: 'gatwick', name: '盖特威克机场', price: 160 },
  { id: 'luton', name: '卢顿机场', price: 190 },
  { id: 'stansted', name: '斯坦斯特德机场', price: 190 },
  { id: 'st-pancras', name: '圣潘克拉斯火车站', price: 140 },
];
export const BURLINGTON_TRANSFER_EXTRA_PERSON = 55;

export const BURLINGTON_SUMMER_RESIDENCE = {
  start: '2027-06-27',
  end: '2027-08-22',
  minWeeks: 2,
  tiers: [
    { minWeeks: 2, rate: 845 },
    { minWeeks: 4, rate: 795 },
    { minWeeks: 6, rate: 745 },
  ],
  intensiveUpgradePerWeek: 80,
  roomOnlyPerWeek: 425,
  roomOnlyExtras: { kitchenBedding: 150, gym: 50, booking: 55 },
  minAge: 16,
};

export const BURLINGTON_CASTLE = {
  /** Adults booking 4+ course weeks receive the Standard Package free. */
  adultFreeFromWeeks: 4,
  adultPremiumUpgrade: 125,
  /** Adults staying under 4 weeks: two nights at the castle with the Premium Package. */
  adultShortStay: 395,
};

/** UK bank holidays listed by the school; a course then starts on the Tuesday. */
export const BURLINGTON_BANK_HOLIDAYS_2027 = ['2027-03-29', '2027-05-03', '2027-05-31', '2027-08-30'];
export const BURLINGTON_CHRISTMAS_CLOSURE = { start: '2027-12-20', end: '2027-12-31' };

export function burlingtonCourseRate(course: BurlingtonAdultCourse, weeks: number): number {
  const tier = course.tiers.find(item => weeks >= item.minWeeks && (item.maxWeeks === null || weeks <= item.maxWeeks));
  return (tier ?? course.tiers[course.tiers.length - 1]).rate;
}

export function burlingtonSummerResidenceRate(weeks: number): number | null {
  const tiers = BURLINGTON_SUMMER_RESIDENCE.tiers.filter(tier => weeks >= tier.minWeeks);
  return tiers.length ? tiers[tiers.length - 1].rate : null;
}

export function burlingtonOneToOneRate(hours: number): number {
  return hours >= BURLINGTON_ONE_TO_ONE.discountFromHours ? BURLINGTON_ONE_TO_ONE.discountedRate : BURLINGTON_ONE_TO_ONE.rate;
}
