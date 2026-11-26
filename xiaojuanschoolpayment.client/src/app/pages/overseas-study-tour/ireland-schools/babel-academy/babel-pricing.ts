// Babel Academy of English (Dublin, Ireland): every price from the school's 2027 price lists
// (short-term, Work & Study 25 weeks, accommodation and extras) and its Black Friday 2026 offer.
// All amounts are euros. Pure data: no Angular, DOM, storage or regex lookbehind, so the
// WeChat mini program can bundle it later.

/** Last day of the Black Friday offer (inclusive). Quotes made after it use the regular prices. */
export const BABEL_BLACK_FRIDAY_END = '2026-11-30';

export function babelIsBlackFriday(today: string): boolean {
  return today <= BABEL_BLACK_FRIDAY_END;
}

export type BabelShortCourseId = 'efl-am' | 'efl-pm' | 'ielts-am' | 'intensive' | 'plus-work' | 'plus-ielts' | 'plus-conversation';

export interface BabelShortCourse {
  id: BabelShortCourseId;
  name: string;
  english: string;
  hours: string;
  schedule: string;
  level: string;
  regular: number;
  blackFriday: number;
}

export const BABEL_SHORT_COURSES: BabelShortCourse[] = [
  { id: 'efl-am', name: '通用英语 上午班', english: 'English for Life (AM)', hours: '每周15小时', schedule: '周一至周五 09:00–12:15', level: 'A1起', regular: 240, blackFriday: 180 },
  { id: 'efl-pm', name: '通用英语 下午班', english: 'English for Life (PM)', hours: '每周16小时', schedule: '周一至周四 13:00–17:00', level: 'A1起', regular: 210, blackFriday: 150 },
  { id: 'ielts-am', name: '雅思备考', english: 'IELTS Exam Preparation', hours: '每周15小时', schedule: '周一至周五 09:00–12:15', level: 'B1+起，建议雅思5.0', regular: 240, blackFriday: 180 },
  { id: 'intensive', name: '通用英语 强化班', english: 'English for Life Intensive', hours: '每周30小时', schedule: '上午班＋下午班', level: 'A1起', regular: 395, blackFriday: 315 },
  { id: 'plus-work', name: '通用英语＋商务英语', english: 'English for Life Plus: English for Work', hours: '每周20小时', schedule: '上午通用英语；周二、周四 14:00–16:30 商务英语', level: 'B1起', regular: 295, blackFriday: 220 },
  { id: 'plus-ielts', name: '通用英语＋雅思模块', english: 'English for Life Plus: English for IELTS', hours: '每周20小时', schedule: '上午通用英语；周一至周五 12:30–13:30 雅思', level: 'B1起', regular: 295, blackFriday: 220 },
  { id: 'plus-conversation', name: '通用英语＋口语强化', english: 'English for Life Plus: Conversation and Fluency', hours: '每周20小时', schedule: '上午通用英语；周一、周三 14:00–16:30 口语', level: 'A2起', regular: 295, blackFriday: 220 },
];

export const BABEL_SHORT_FEES = {
  registration: 50,
  materialsUnder12: 50,
  materials12Plus: 85,
  /** Regular price list: 15% off tuition for bookings of 12 weeks or more. */
  longStayDiscountWeeks: 12,
  longStayDiscountRate: 0.15,
};

export const BABEL_SHORT_MAX_WEEKS = 24;

export type BabelWorkStudyCourseId = 'efl-am' | 'efl-pm' | 'ielts-am' | 'plus';

export interface BabelWorkStudyCourse {
  id: BabelWorkStudyCourseId;
  name: string;
  english: string;
  hours: string;
  regular: number;
  blackFriday: number;
  /** Black Friday renewal total for current Babel students; the plus course has two prices. */
  renewal: string;
}

export const BABEL_WORK_STUDY_WEEKS = 25;

export const BABEL_WORK_STUDY_COURSES: BabelWorkStudyCourse[] = [
  { id: 'efl-am', name: '通用英语 上午班', english: 'English for Life 15H AM', hours: '每周15小时', regular: 2890, blackFriday: 2750, renewal: '1,870欧元' },
  { id: 'ielts-am', name: '雅思强化 上午班', english: 'IELTS Intensive 15H AM', hours: '每周15小时', regular: 2890, blackFriday: 2750, renewal: '1,870欧元' },
  { id: 'efl-pm', name: '通用英语 下午班', english: 'English for Life 15H PM', hours: '每周15小时', regular: 2595, blackFriday: 2300, renewal: '1,620欧元' },
  { id: 'plus', name: '通用英语＋选修模块', english: 'English for Life Plus', hours: '每周20小时', regular: 3550, blackFriday: 3150, renewal: '商务或口语 2,310欧元；雅思 2,420欧元' },
];

export const BABEL_WORK_STUDY_FEES = {
  registration: 80,
  materials: 85,
  tieExam: 140,
  learnerProtection: 30,
  ieltsExam: 230,
  insurance: 70,
};

/** Latest course start allowed by each price list (Mondays). */
export const BABEL_WORK_STUDY_LAST_START = { blackFriday: '2028-02-28', regular: '2027-09-27' };

export type BabelAccommodationId = 'homestay-shared' | 'homestay-single' | 'residence' | 'none';

export interface BabelAccommodation {
  id: Exclude<BabelAccommodationId, 'none'>;
  name: string;
  detail: string;
  price: number;
}

export const BABEL_ACCOMMODATIONS: BabelAccommodation[] = [
  { id: 'homestay-shared', name: '寄宿家庭 合住房间', detail: '半膳（含早晚餐）', price: 260 },
  { id: 'homestay-single', name: '寄宿家庭 单人间', detail: '半膳（含早晚餐）', price: 290 },
  { id: 'residence', name: '学生公寓 独立卫浴单间', detail: '自己做饭', price: 420 },
];

export type BabelDietId = 'none' | 'vegetarian' | 'vegan';

export const BABEL_DIETS: Array<{ id: BabelDietId; name: string; price: number }> = [
  { id: 'none', name: '普通饮食', price: 0 },
  { id: 'vegetarian', name: '素食或乳糖不耐受', price: 20 },
  { id: 'vegan', name: '纯素或麸质不耐受（乳糜泻）', price: 30 },
];

export const BABEL_ACCOMMODATION_BOOKING_FEE = 75;

export const BABEL_EXTRAS = {
  transferOneWay: 90,
  transferReturn: 160,
  socialPerWeek: 90,
  oneToOnePerHour: 95,
  internship: 450,
  /** Transport card (bus, train and tram) for 1–4 weeks. */
  transportAdult: [45, 80, 105, 130],
};

/** 2027 public holidays (no classes). Monday holidays move that week's start to Tuesday. */
export const BABEL_HOLIDAYS_2027: Array<{ date: string; name: string }> = [
  { date: '2027-01-01', name: '元旦' },
  { date: '2027-02-01', name: '圣布里吉德节' },
  { date: '2027-03-17', name: '圣帕特里克节' },
  { date: '2027-03-29', name: '复活节星期一' },
  { date: '2027-05-03', name: '五月公共假期' },
  { date: '2027-06-07', name: '六月公共假期' },
  { date: '2027-08-02', name: '八月公共假期' },
  { date: '2027-10-25', name: '十月公共假期' },
  { date: '2027-12-25', name: '圣诞节' },
  { date: '2027-12-26', name: '圣斯蒂芬节' },
];

/** Christmas break 2027: last class Friday 17 December, classes restart Tuesday 4 January 2028. */
export const BABEL_CHRISTMAS_2027 = { lastClass: '2027-12-17', restart: '2028-01-04' };
