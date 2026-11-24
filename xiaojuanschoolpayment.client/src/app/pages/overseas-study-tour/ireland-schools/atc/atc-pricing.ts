// ATC Language Schools (Ireland): 2027 adult prices, all in euros (Adult Pricing & General Information 2027,
// the 2027 adult brochure, the Bray residence sheet and the Dublin "From Here" residence sheet, received
// 2026-11-24). Pure data: no Angular, DOM, storage or regex lookbehind (mini program compatible).

export type AtcCampusId = 'bray' | 'dublin';
export type AtcCourseId = 'ge20' | 'ge16' | 'ie26' | 'ielts' | 'cambridge';
export type AtcPriceKey = 'ge16' | 'ge20' | 'ie26';
export type AtcStayType = 'none' | 'homestay' | 'self-catering';
export type AtcRoomId = 'twin' | 'single' | 'ensuite';
export type AtcExamId = 'none' | 'b2' | 'c1' | 'ielts' | 'tie';

export interface AtcCampus {
  id: AtcCampusId;
  name: string;
  shortName: string;
  minAge: number;
}

export const ATC_CAMPUSES: AtcCampus[] = [
  { id: 'bray', name: 'ATC布雷校区（Bray，海边小镇）', shortName: '布雷校区', minAge: 16 },
  { id: 'dublin', name: 'ATC都柏林校区（Dublin，市中心）', shortName: '都柏林校区', minAge: 17 },
];

/** Weekly course price by total course weeks; every week is charged at the tier of the total. */
export interface AtcPriceTier {
  minWeeks: number;
  maxWeeks: number;
  ge16: number | null;
  ge20: number;
  ie26: number;
}

export const ATC_COURSE_TIERS: Record<AtcCampusId, AtcPriceTier[]> = {
  bray: [
    { minWeeks: 1, maxWeeks: 4, ge16: null, ge20: 320, ie26: 415 },
    { minWeeks: 5, maxWeeks: 8, ge16: 265, ge20: 295, ie26: 390 },
    { minWeeks: 9, maxWeeks: 12, ge16: 250, ge20: 275, ie26: 370 },
    { minWeeks: 13, maxWeeks: 16, ge16: 225, ge20: 250, ie26: 345 },
    { minWeeks: 17, maxWeeks: 20, ge16: 210, ge20: 230, ie26: 325 },
    { minWeeks: 21, maxWeeks: 24, ge16: 200, ge20: 220, ie26: 315 },
    { minWeeks: 25, maxWeeks: 999, ge16: 190, ge20: 210, ie26: 305 },
  ],
  dublin: [
    { minWeeks: 1, maxWeeks: 4, ge16: null, ge20: 365, ie26: 460 },
    { minWeeks: 5, maxWeeks: 8, ge16: 310, ge20: 345, ie26: 440 },
    { minWeeks: 9, maxWeeks: 12, ge16: 290, ge20: 325, ie26: 420 },
    { minWeeks: 13, maxWeeks: 16, ge16: 260, ge20: 285, ie26: 380 },
    { minWeeks: 17, maxWeeks: 20, ge16: 235, ge20: 260, ie26: 355 },
    { minWeeks: 21, maxWeeks: 24, ge16: 210, ge20: 235, ie26: 330 },
    { minWeeks: 25, maxWeeks: 999, ge16: 195, ge20: 220, ie26: 315 },
  ],
};

export interface AtcCourse {
  id: AtcCourseId;
  name: string;
  shortName: string;
  englishName: string;
  hoursPerWeek: number;
  timetable: string;
  /** Tier column; null for the fixed-date Cambridge courses. */
  priceKey: AtcPriceKey | null;
  minWeeks: number;
  /** 0 means the campus minimum applies. */
  minAge: number;
  level: string;
}

export const ATC_COURSES: AtcCourse[] = [
  {
    id: 'ge20', name: '综合英语（每周20课时）', shortName: '综合英语20课时', englishName: 'General English for Communication',
    hoursPerWeek: 20, timetable: '周一至周五 9:00–13:20', priceKey: 'ge20', minWeeks: 1, minAge: 0, level: 'A1–C1，零基础可报',
  },
  {
    id: 'ge16', name: '综合英语（每周16课时）', shortName: '综合英语16课时', englishName: 'General English for Communication (16 hours)',
    hoursPerWeek: 16, timetable: '周一至周四 9:00–13:20', priceKey: 'ge16', minWeeks: 8, minAge: 0, level: 'A1–C1，零基础可报',
  },
  {
    id: 'ie26', name: '强化英语（每周26课时）', shortName: '强化英语26课时', englishName: 'Intensive English for Communication',
    hoursPerWeek: 26, timetable: '周一至周五 9:00–13:20，另加周二、周四 14:15–17:15', priceKey: 'ie26', minWeeks: 1, minAge: 0,
    level: 'A1–C1，零基础可报',
  },
  {
    id: 'ielts', name: '雅思备考', shortName: '雅思备考', englishName: 'IELTS Preparation',
    hoursPerWeek: 20, timetable: '周一至周五 9:00–13:20', priceKey: 'ge20', minWeeks: 1, minAge: 18, level: 'B2以上',
  },
  {
    id: 'cambridge', name: '剑桥 B2 First／C1 Advanced 备考', shortName: '剑桥考试备考', englishName: 'Cambridge B2 First & C1 Advanced',
    hoursPerWeek: 20, timetable: '周一至周五 9:00–13:20', priceKey: null, minWeeks: 10, minAge: 18,
    level: 'B2 First需B2，C1 Advanced需C1',
  },
];

/** Full IELTS course length; shorter courses do not cover all preparation material. */
export const ATC_IELTS_FULL_WEEKS = 8;
/** 16-hour course: weeks 8–11 are listed in the price table but need school confirmation. */
export const ATC_GE16_CONFIRM_BELOW = 12;

export interface AtcCambridgeSession {
  start: string;
  weeks: number;
  prices: Record<AtcCampusId, number>;
}

/** 2027 Cambridge start Mondays (the 2027 price list printed the 2026 dates). */
export const ATC_CAMBRIDGE_SESSIONS: AtcCambridgeSession[] = [
  { start: '2027-01-04', weeks: 10, prices: { bray: 2950, dublin: 3450 } },
  { start: '2027-03-15', weeks: 12, prices: { bray: 3540, dublin: 4140 } },
  { start: '2027-09-20', weeks: 12, prices: { bray: 3540, dublin: 4140 } },
];

export interface AtcStayOption {
  campus: AtcCampusId;
  type: Exclude<AtcStayType, 'none'>;
  room: AtcRoomId;
  name: string;
  shortName: string;
  /** Euros per 7 nights. */
  price: number;
  minAge: number;
  meals: string;
}

export const ATC_STAY_OPTIONS: AtcStayOption[] = [
  { campus: 'bray', type: 'homestay', room: 'twin', name: '寄宿家庭 双人间', shortName: '寄宿家庭双人间', price: 260, minAge: 16, meals: '周一至周五早晚餐，周末三餐' },
  { campus: 'bray', type: 'homestay', room: 'single', name: '寄宿家庭 单人间', shortName: '寄宿家庭单人间', price: 300, minAge: 18, meals: '周一至周五早晚餐，周末三餐' },
  { campus: 'bray', type: 'self-catering', room: 'twin', name: '学校公寓／宿舍 双人间（自己做饭）', shortName: '学校公寓双人间', price: 270, minAge: 18, meals: '不含餐，可用共用厨房' },
  { campus: 'bray', type: 'self-catering', room: 'single', name: '学校公寓／宿舍 单人间（自己做饭）', shortName: '学校公寓单人间', price: 325, minAge: 18, meals: '不含餐，可用共用厨房' },
  { campus: 'dublin', type: 'homestay', room: 'twin', name: '寄宿家庭 双人间', shortName: '寄宿家庭双人间', price: 260, minAge: 16, meals: '周一至周五早晚餐，周末三餐' },
  { campus: 'dublin', type: 'homestay', room: 'single', name: '寄宿家庭 单人间', shortName: '寄宿家庭单人间', price: 300, minAge: 18, meals: '周一至周五早晚餐，周末三餐' },
  { campus: 'dublin', type: 'self-catering', room: 'ensuite', name: 'From Here 学生公寓 带卫浴单人间（自己做饭）', shortName: '学生公寓带卫浴单人间', price: 410, minAge: 18, meals: '不含餐，公寓有厨房' },
];

export const ATC_FEES = {
  registration: 70,
  elearning: 85,
  accommodation: 65,
  medipel: 140,
  privateOne: 75,
  privateTwo: 100,
  transferOne: 130,
  transferShared: 75,
  dietMax: 30,
};

export interface AtcExam {
  id: Exclude<AtcExamId, 'none'>;
  name: string;
  price: number;
}

export const ATC_EXAMS: AtcExam[] = [
  { id: 'b2', name: '剑桥 B2 First', price: 225 },
  { id: 'c1', name: '剑桥 C1 Advanced', price: 230 },
  { id: 'ielts', name: '雅思', price: 245 },
  { id: 'tie', name: 'TIE（Test of Interactive English）', price: 130 },
];

/** Courses of this many weeks or more include the TIE exam. */
export const ATC_TIE_FREE_WEEKS = 25;
/** MediPel is compulsory for non-EU students from about three months. */
export const ATC_MEDIPEL_FROM_WEEKS = 13;
/** Weeks of study for the Irish student visa that allows part-time work (Stamp 2). */
export const ATC_STUDY_WORK_WEEKS = 25;
export const ATC_MAX_COURSE_WEEKS = 52;

/** 2027 Mondays on which a course can start (2027 prices). */
export const ATC_FIRST_START = '2027-01-04';
export const ATC_LAST_START = '2027-12-13';

export interface AtcHoliday {
  date: string;
  name: string;
}

export const ATC_PUBLIC_HOLIDAYS_2027: AtcHoliday[] = [
  { date: '2027-02-01', name: '圣布里吉德节（St Brigid’s Day）' },
  { date: '2027-03-17', name: '圣帕特里克节（St Patrick’s Day）' },
  { date: '2027-03-29', name: '复活节周一' },
  { date: '2027-05-03', name: '五月公共假日' },
  { date: '2027-06-07', name: '六月公共假日' },
  { date: '2027-08-02', name: '八月公共假日' },
  { date: '2027-10-25', name: '十月公共假日' },
];

/** School closed 2027-12-18 to 2028-01-03 inclusive; classes restart Tuesday 2028-01-04. */
export const ATC_CHRISTMAS_BREAK = {
  start: '2027-12-18',
  end: '2028-01-03',
  closedMondays: ['2027-12-20', '2027-12-27'],
};

/** Black November: 10% off the full course price for bookings made by 30 November 2026. */
export const ATC_BLACK_NOVEMBER = {
  until: '2026-11-30',
  rate: 0.1,
};

export type AtcRenewalCourse = 'ge16' | 'ge20';

/** 2026 Renewal Visa package for non-EU students already in Ireland renewing Stamp 2 or WHA. */
export const ATC_RENEWAL = {
  bookBy: '2026-11-30',
  startBy: '2027-01-31',
  courseWeeks: 25,
  holidayWeeks: 8,
  returningDiscount: 50,
  /** Mondays the 2026 Christmas closure may cover; left out of the start list until the school confirms. */
  unconfirmedMondays: ['2026-12-21', '2026-12-28'],
  courses: [
    { id: 'ge16' as AtcRenewalCourse, name: '综合英语16课时（周一至周四）', price: 2250, was: 2475 },
    { id: 'ge20' as AtcRenewalCourse, name: '综合英语20课时（周一至周五）', price: 2450, was: 2750 },
  ],
};

export function atcTier(campus: AtcCampusId, weeks: number): AtcPriceTier | undefined {
  return ATC_COURSE_TIERS[campus].find(tier => weeks >= tier.minWeeks && weeks <= tier.maxWeeks);
}

export function atcWeeklyPrice(campus: AtcCampusId, key: AtcPriceKey, weeks: number): number | null {
  const tier = atcTier(campus, weeks);
  return tier ? tier[key] : null;
}

export function atcStayOption(campus: AtcCampusId, type: AtcStayType, room: AtcRoomId): AtcStayOption | undefined {
  return ATC_STAY_OPTIONS.find(option => option.campus === campus && option.type === type && option.room === room);
}

export function atcStayRooms(campus: AtcCampusId, type: AtcStayType): AtcStayOption[] {
  return ATC_STAY_OPTIONS.filter(option => option.campus === campus && option.type === type);
}
