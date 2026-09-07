export type BeciCampus = 'eop' | 'sparta' | 'city';

export interface BeciCoursePrice {
  id: string;
  name: string;
  price: number;
  schedule: string;
  note?: string;
  minimumWeeks?: number;
}

export interface BeciRoomPrice {
  id: string;
  name: string;
  price: number;
  note: string;
  single: boolean;
}

export interface BeciCampusPricing {
  id: BeciCampus;
  code: string;
  name: string;
  shortName: string;
  hero: string;
  courses: readonly BeciCoursePrice[];
  rooms: readonly BeciRoomPrice[];
  defaultCourseId: string;
  defaultRoomId: string;
  campusNote: string;
}

const eopCourses: readonly BeciCoursePrice[] = [
  { id: 'eop-lite-esl', name: 'Lite ESL', price: 670, schedule: '2节一对一＋2节团体课＋2节夜间选修课' },
  { id: 'eop-speed-esl', name: 'Speed ESL', price: 870, schedule: '4节一对一＋2节团体课＋2节夜间选修课' },
  { id: 'eop-sparta-esl', name: '斯巴达 ESL', price: 900, schedule: '4节一对一＋1节SP口语课＋2节团体课＋2节必修晚课' },
  { id: 'eop-ielts', name: 'IELTS（雅思）', price: 900, schedule: '4节一对一＋2节团体课＋3节必修晚课及考试' },
  { id: 'eop-toeic', name: 'TOEIC（托业）', price: 850, schedule: '4节一对一＋2节团体课＋3节必修晚课及考试' },
  { id: 'eop-junior-esl', name: 'Junior ESL', price: 1300, schedule: '5节一对一＋1节SP口语课＋2节必修课', note: '目前不设置固定年龄拦截，报名时确认未成年入学及监护要求。' },
  { id: 'eop-junior-ielts', name: 'Junior IELTS', price: 1400, schedule: '4节一对一＋2节团体课＋3节必修晚课及考试', note: '目前不设置固定年龄拦截，报名时确认未成年入学及监护要求。' },
];

const spartaCourses: readonly BeciCoursePrice[] = [
  { id: 'sparta-24-esl', name: '24 ESL', price: 900, schedule: '4节一对一＋1节SP口语课＋2节团体课＋3节必修晚课' },
  { id: 'sparta-toeic', name: 'TOEIC（托业）', price: 850, schedule: '5节一对一＋2节团体课＋3节必修晚课' },
  { id: 'sparta-ielts', name: 'IELTS（雅思）', price: 900, schedule: '4节一对一＋2节团体课＋3节必修晚课' },
  { id: 'sparta-ielts-guarantee', name: 'IELTS保证班', price: 1100, schedule: '4节一对一＋2节团体课＋3节必修晚课', note: '12周起报。', minimumWeeks: 12 },
];

const cityCourses: readonly BeciCoursePrice[] = [
  { id: 'city-lite-esl', name: 'Lite ESL', price: 670, schedule: '2节一对一＋2节团体课＋2节选修课' },
  { id: 'city-native-esl', name: 'Native ESL', price: 900, schedule: '4节一对一＋2节团体课＋2节选修课' },
  { id: 'city-unlimited-esl', name: 'Unlimited ESL', price: 900, schedule: '最多8节一对一＋2节选修课' },
  { id: 'city-junior-esl', name: 'Junior ESL', price: 1300, schedule: '5节一对一＋1节SP口语课＋2节选修课', note: '目前不设置固定年龄拦截，报名时确认未成年入学及监护要求。' },
];

const eopRooms: readonly BeciRoomPrice[] = [
  { id: 'eop-master-single', name: '豪华单人间（Master校外）', price: 1100, note: '校外Master房型；40岁及以上学生可选。', single: true },
  { id: 'eop-regular-single', name: '常规单人间', price: 950, note: '40岁及以上学生可选。', single: true },
  { id: 'eop-twin', name: '双人间', price: 750, note: '40岁及以上学生不可选择。', single: false },
  { id: 'eop-triple', name: '三人间', price: 670, note: '40岁及以上学生不可选择。', single: false },
  { id: 'eop-quad-female', name: '四人间（女生）', price: 570, note: '仅限女生；40岁及以上学生不可选择。', single: false },
];

const spartaRooms: readonly BeciRoomPrice[] = [
  { id: 'sparta-3-plus-1', name: '3＋1宿舍', price: 800, note: '不同国籍学生与老师同住。', single: false },
  { id: 'sparta-quad', name: '普通四人间', price: 700, note: '按当期性别与床位确认空房。', single: false },
];

const cityRooms: readonly BeciRoomPrice[] = [
  { id: 'city-studio-single', name: 'Studio单人间', price: 1250, note: '独立Studio单人房。', single: true },
  { id: 'city-studio-twin', name: 'Studio双人间', price: 800, note: '标准价每人800美元／4周；两名夫妻共同选择时每人750美元／4周。', single: false },
  { id: 'city-studio-quad', name: 'Studio四人间（上下铺）', price: 600, note: '按当期性别与床位确认空房。', single: false },
  { id: 'city-semi-master-single', name: 'Semi Master单人间', price: 1050, note: '较高规格单人房。', single: true },
  { id: 'city-semi-single', name: 'Semi单人间', price: 900, note: '单人房。', single: true },
];

export const BECI_CAMPUS_PRICING: Readonly<Record<BeciCampus, BeciCampusPricing>> = {
  eop: {
    id: 'eop', code: 'BECI EOP', name: '菲律宾碧瑶BECI EOP校区', shortName: 'BECI EOP校区',
    hero: '/assets/philippines/beci-eop-campus.jpg', courses: eopCourses, rooms: eopRooms,
    defaultCourseId: 'eop-lite-esl', defaultRoomId: 'eop-quad-female',
    campusNote: 'EOP校区40岁及以上学生只能选择单人间；Junior课程目前不设置固定年龄拦截。',
  },
  sparta: {
    id: 'sparta', code: 'BECI SPARTA', name: '菲律宾碧瑶BECI斯巴达校区', shortName: 'BECI斯巴达校区',
    hero: '/assets/philippines/beci-campus-blue-roof.png', courses: spartaCourses, rooms: spartaRooms,
    defaultCourseId: 'sparta-24-esl', defaultRoomId: 'sparta-quad',
    campusNote: 'IELTS保证班12周起报；晚间必修课与考试安排以学校当期课表为准。',
  },
  city: {
    id: 'city', code: 'API BECI CITY', name: '菲律宾碧瑶API BECI City Campus', shortName: 'API BECI City校区',
    hero: '/assets/philippines/beci-city-study-lounge.png', courses: cityCourses, rooms: cityRooms,
    defaultCourseId: 'city-lite-esl', defaultRoomId: 'city-studio-quad',
    campusNote: '夜间一对一通常安排在17:00–21:00，每门夜间课程较常规日间安排少1节一对一；本项只作说明。',
  },
};

export const BECI_WEEK_OPTIONS = [1, 2, 3, 4, 6, 8, 12, 16, 20, 24] as const;
export const BECI_PEAK_RANGES = [
  { start: '2026-06-28', end: '2026-08-22', label: '2026/06/28–08/22' },
  { start: '2027-06-27', end: '2027-08-21', label: '2027/06/27–08/21（星期对齐估算）' },
] as const;
export const BECI_OFF_SEASON_RANGES = [
  { start: '2026-02-08', end: '2026-06-14' },
  { start: '2026-09-06', end: '2026-12-27' },
] as const;

export function beciPriceMultiplier(weeks: number): number {
  return ({ 1: 0.4, 2: 0.6, 3: 0.8 } as Record<number, number>)[weeks] ?? weeks / 4;
}

export function beciLongStayDiscount(weeks: number): number {
  if (weeks >= 24) return 400;
  if (weeks >= 20) return 300;
  if (weeks >= 16) return 200;
  if (weeks >= 12) return 100;
  if (weeks >= 8) return 50;
  return 0;
}
