// St Giles International 2027 prices (UK year-round schools, junior summer centres and family
// courses), all in pounds. Tuition is valid for courses from 29 Dec 2026 to 24 Dec 2027.
// Pure data only: no Angular, DOM, storage or regex lookbehind (mini program compatible).
// Internal agent terms are deliberately not stored here.

export type StGilesCampusId = 'london-central' | 'london-highgate' | 'brighton' | 'cambridge' | 'eastbourne';
export type StGilesCourseId = 'intensive28' | 'morning20' | 'morning15' | 'afternoon20' | 'under16';
export type StGilesOneToOneId = 'one-to-one-20' | 'one-to-one-15';
export type StGilesAgeBand = 'adult' | 'minor16' | 'minor14';
export type StGilesHomestayTier = 'standard' | 'superior';
export type StGilesHomestayBoard = 'hb' | 'bb' | 'self';
export type StGilesRoom = 'single' | 'twin';
export type StGilesAirportId = 'heathrow' | 'gatwick' | 'stansted' | 'luton' | 'city' | 'st-pancras';
export type StGilesJuniorCentreId = 'brighton-homestay' | 'cambridge-st-marys' | 'cambridge-stem' | 'canterbury' | 'london-ucl' | 'oxford';

/** Weekly tuition by total course weeks: 1–3, 4–7, 8–11, 12–23, 24+ (Under 16s: 1–3, 4–7, 8–11, 12–16). */
export const ST_GILES_TIER_LABELS = ['1–3周', '4–7周', '8–11周', '12–23周', '24周以上'];
/** One-to-one weekly prices: 1, 2, 3, 4+ weeks. */
export const ST_GILES_ONE_TO_ONE_TIER_LABELS = ['1周', '2周', '3周', '4周以上'];

export const ST_GILES_FEES = {
  registration: 88,
  accommodationPlacement: 52,
  /** Group courses, weeks touching Monday 21 Jun – Friday 20 Aug. */
  highSeasonSupplement: 31,
  highSeasonStart: '2027-06-21',
  highSeasonEnd: '2027-08-20',
  /** Accommodation peak nights 20 Jun – 22 Aug: Sunday-to-Sunday weeks starting 20 Jun … 15 Aug. */
  accommodationPeakStart: '2027-06-20',
  accommodationPeakEnd: '2027-08-21',
  specialDiet: 34,
  ieltsExamFrom: 250,
  /** Cambridge English exam fees at the St Giles exam centres (B2 First £218; C1 Advanced £222–£265). */
  cambridgeExamFees: '约218–265英镑',
  /**
   * First Monday and last Friday covered by 2027 tuition prices. Monday 28 Dec 2026 is a bank
   * holiday, so the first 2027-price week starts on Tuesday 29 Dec.
   */
  firstCourseMonday: '2026-12-28',
  lastCourseFriday: '2027-12-24',
  /** Last Sunday departure covered by 2027 accommodation prices. */
  lastAccommodationSunday: '2027-12-26',
  /** Public holidays without lessons and the Christmas closure. */
  holidays: ['2026-12-28', '2027-01-01', '2027-03-26', '2027-03-29', '2027-05-03', '2027-05-31', '2027-08-30', '2027-12-27', '2027-12-28'],
  /** Full-board supplement for half-board homestay students on 25 and 26 December. */
  christmasSupplement: 40,
  christmasDay: '2027-12-25',
  maxCourseWeeks: 50,
};

/** Optional lunches for half-board homestay students (London Highgate, Cambridge, Eastbourne). */
export const ST_GILES_HOMESTAY_LUNCH = { weekday: 48, weekend: 15, fullBoard: 63 };

export interface StGilesGroupCourse {
  id: StGilesCourseId;
  name: string;
  short: string;
  lessons: number;
  hoursText: string;
  schedule: string;
  /** Weekly prices by tier; the Under 16s course has four tiers and at most 16 weeks. */
  prices: number[];
  /** Options for the extra lessons or the course focus, shown under the course name. */
  focuses: string[];
  minAge: number;
  maxAge?: number;
  maxWeeks?: number;
  note?: string;
}

export interface StGilesOneToOne {
  /** 20 or 15 lessons a week, by 1 / 2 / 3 / 4+ weeks. */
  twenty: number[];
  fifteen: number[];
  perLesson: number;
  /** Add-on to a group course: 5 one-to-one lessons a week, then each further lesson. */
  addOnFive: number;
  addOnExtra: number;
}

export interface StGilesHomestayPrice {
  tier: StGilesHomestayTier;
  board: StGilesHomestayBoard;
  age: 'adult' | 'minor';
  /** [off-peak, peak] per week; twin null when not offered. */
  single: [number, number];
  twin: [number, number] | null;
}

export interface StGilesResidence {
  id: string;
  name: string;
  room: string;
  /** Who may book it, for example 18岁以上. */
  ageText: string;
  minAge: number;
  maxAge?: number;
  /** Off-peak weekly price (null when only available or priced in summer). */
  offPeak: number | null;
  /** Off-peak weekly price from `offPeakLongWeeks` weeks. */
  offPeakLong?: number;
  offPeakLongWeeks?: number;
  peak: number | null;
  meals: string;
  distance: string;
  /** Summer-only residences: first arrival Sunday and last departure Sunday. */
  window?: { start: string; end: string };
  /** Optional weekly breakfast at the school café. */
  breakfastPerWeek?: number;
}

export interface StGilesAirport {
  id: StGilesAirportId;
  name: string;
  price: number;
}

export interface StGilesFamilyCourse {
  ages: string;
  minAge: number;
  maxAge: number;
  start: string;
  end: string;
  childFull: number;
  childDayPlus: number;
  childDayOnly: number;
  adultHomestay: number;
  transfers: StGilesAirport[];
  /** Examples of the weekly family activities and excursions. */
  activities: string;
  children: number;
}

export interface StGilesCampusPricing {
  id: StGilesCampusId;
  name: string;
  city: string;
  minAge: number;
  courses: StGilesGroupCourse[];
  oneToOne: StGilesOneToOne;
  materials: string;
  homestay: StGilesHomestayPrice[];
  homestayTravel: string;
  /** Twin homestay rule: only students travelling together, or also when a suitable roommate books the same dates. */
  twinRule: string;
  /** Under-18 homestay singles in June–August may be shared: 'may' share or 'will' share with another nationality. */
  summerMinorSharing?: 'may' | 'will';
  /** Weekday / weekend lunches can be added to half-board homestays. */
  homestayLunch?: boolean;
  /** Assisted airport check-in for under-16s, when the airline requires it. */
  assistedCheckIn?: number;
  residences: StGilesResidence[];
  /** Airport transfers: per car (one way), or per passenger in London. */
  transfers: StGilesAirport[];
  transferPerPassenger: boolean;
  transferNote: string;
  family: StGilesFamilyCourse;
  juniorCentres: StGilesJuniorCentreId[];
}

const hb = (tier: StGilesHomestayTier, age: 'adult' | 'minor', single: [number, number], twin: [number, number] | null,
  board: StGilesHomestayBoard = 'hb'): StGilesHomestayPrice => ({ tier, board, age, single, twin });

const LONDON_FAMILY_TRANSFERS: StGilesAirport[] = [
  { id: 'heathrow', name: '希思罗机场', price: 110 },
  { id: 'city', name: '伦敦城市机场', price: 110 },
  { id: 'gatwick', name: '盖特威克机场', price: 145 },
  { id: 'stansted', name: '斯坦斯特德机场', price: 135 },
  { id: 'luton', name: '卢顿机场', price: 135 },
];

const IQ_LONDON_CITY = (distance: string): StGilesResidence[] => [
  { id: 'iq-single', name: 'iQ London City学生公寓', room: '单人间（独立卫浴）', ageText: '18岁以上', minAge: 18,
    offPeak: 467, peak: 488, meals: '不含餐，可用公寓厨房', distance },
  { id: 'iq-studio', name: 'iQ London City学生公寓', room: '开间（带小厨房）', ageText: '18岁以上', minAge: 18,
    offPeak: 501, peak: 521, meals: '不含餐，房内有小厨房', distance },
];

const UCL_SUMMER = (minAge: number, distance: string): StGilesResidence => ({
  id: 'ucl', name: 'UCL暑期宿舍', room: '单人间（共用卫浴）', ageText: `${minAge}–17岁`, minAge, maxAge: 17,
  offPeak: null, peak: 617, meals: '含早餐和晚餐', distance, window: { start: '2027-06-27', end: '2027-08-01' },
});

export const ST_GILES_CAMPUSES: Record<StGilesCampusId, StGilesCampusPricing> = {
  'london-central': {
    id: 'london-central',
    name: '伦敦中心校区',
    city: '伦敦',
    minAge: 16,
    courses: [
      { id: 'intensive28', name: '强化课程28节', short: '强化28节', lessons: 28, hoursText: '每周28节（约23小时）', schedule: '09:00–15:35',
        prices: [558, 503, 473, 445, 380], focuses: ['生活英语', '职场英语', '雅思备考', '大学预备英语'], minAge: 16 },
      { id: 'morning20', name: '上午课程20节', short: '上午20节', lessons: 20, hoursText: '每周20节（约17小时）', schedule: '09:00–12:50',
        prices: [441, 399, 376, 354, 311], focuses: ['通用英语', '雅思备考', '30岁以上通用英语'], minAge: 16 },
      { id: 'morning15', name: '上午课程15节', short: '上午15节', lessons: 15, hoursText: '每周15节（约12.5小时）', schedule: '09:00–12:00',
        prices: [364, 329, 310, 292, 257], focuses: ['通用英语'], minAge: 16 },
      { id: 'afternoon20', name: '下午课程20节', short: '下午20节', lessons: 20, hoursText: '每周20节（约17小时）', schedule: '13:55–17:45',
        prices: [353, 319, 301, 283, 249], focuses: ['通用英语'], minAge: 16 },
    ],
    oneToOne: { twenty: [1682, 1631, 1584, 1535], fifteen: [1080, 1048, 1013, 984], perLesson: 88, addOnFive: 340, addOnExtra: 68 },
    materials: '每本35–50英镑',
    homestay: [
      hb('standard', 'adult', [285, 323], [245, 283]),
      hb('standard', 'minor', [300, 343], [260, 303]),
      hb('standard', 'adult', [226, 261], [186, 221], 'bb'),
      hb('superior', 'adult', [492, 492], [452, 452]),
      hb('superior', 'adult', [420, 420], [380, 380], 'bb'),
    ],
    homestayTravel: '坐公交或地铁到学校约45–60分钟',
    twinRule: '寄宿家庭双人间只限一起报名、同行的两位学生。',
    residences: [
      { id: 'onsite-single-private', name: '校内宿舍', room: '单人间（独立卫浴）', ageText: '18岁以上', minAge: 18,
        offPeak: 500, peak: 523, meals: '含早餐', distance: '就在学校楼上' },
      { id: 'onsite-twin-private', name: '校内宿舍', room: '双人间（独立卫浴）', ageText: '18岁以上', minAge: 18,
        offPeak: 405, peak: 415, meals: '含早餐', distance: '就在学校楼上' },
      { id: 'onsite-single-shared', name: '校内宿舍', room: '单人间（共用卫浴）', ageText: '18岁以上', minAge: 18,
        offPeak: 455, peak: 471, meals: '含早餐', distance: '就在学校楼上' },
      { id: 'onsite-twin-shared', name: '校内宿舍', room: '双人间（共用卫浴）', ageText: '18岁以上', minAge: 18,
        offPeak: 370, peak: 391, meals: '含早餐', distance: '就在学校楼上' },
      ...IQ_LONDON_CITY('坐公交或骑电动单车约10分钟到学校').map(item => ({ ...item, breakfastPerWeek: 42.4 })),
      UCL_SUMMER(16, '步行约30分钟到学校'),
    ],
    transfers: [
      { id: 'heathrow', name: '希思罗机场', price: 116 },
      { id: 'city', name: '伦敦城市机场', price: 116 },
      { id: 'gatwick', name: '盖特威克机场', price: 154 },
      { id: 'stansted', name: '斯坦斯特德机场', price: 144 },
      { id: 'luton', name: '卢顿机场', price: 144 },
      { id: 'st-pancras', name: '圣潘克拉斯火车站', price: 94 },
    ],
    transferPerPassenger: true,
    transferNote: '单程每人价格；两人同行每人更便宜',
    family: { ages: '9–15岁', minAge: 9, maxAge: 15, start: '2027-06-20', end: '2027-08-08',
      childFull: 852, childDayPlus: 631, childDayOnly: 576, adultHomestay: 411, activities: '伦敦眼、泰晤士河游船、圣詹姆斯公园自然探索；全天出游如剑桥、牛津、布莱顿', children: 60,
      transfers: LONDON_FAMILY_TRANSFERS },
    juniorCentres: ['london-ucl'],
  },
  'london-highgate': {
    id: 'london-highgate',
    name: '伦敦海格特校区',
    city: '伦敦',
    minAge: 14,
    courses: [
      { id: 'intensive28', name: '强化课程28节', short: '强化28节', lessons: 28, hoursText: '每周28节（约23小时）', schedule: '09:00–15:50',
        prices: [518, 467, 440, 414, 353], focuses: ['生活英语', '职场英语', '雅思备考'], minAge: 16 },
      { id: 'under16', name: '16岁以下强化课程', short: '16岁以下课程', lessons: 28, hoursText: '每周28节＋3次活动', schedule: '09:00–15:50',
        prices: [602, 551, 523, 496], focuses: ['通用英语'], minAge: 14, maxAge: 15, maxWeeks: 16 },
      { id: 'morning20', name: '上午课程20节', short: '上午20节', lessons: 20, hoursText: '每周20节（约17小时）', schedule: '09:00–13:00',
        prices: [410, 371, 350, 329, 289], focuses: ['通用英语', '雅思备考'], minAge: 16 },
      { id: 'afternoon20', name: '下午课程20节', short: '下午20节', lessons: 20, hoursText: '每周20节（约17小时）', schedule: '14:10–18:00',
        prices: [328, 297, 280, 263, 231], focuses: ['通用英语'], minAge: 16 },
    ],
    oneToOne: { twenty: [1562, 1515, 1472, 1425], fifteen: [1003, 973, 941, 914], perLesson: 81, addOnFive: 315, addOnExtra: 63 },
    materials: '每本35–55英镑',
    homestay: [
      hb('standard', 'adult', [279, 316], [239, 276]),
      hb('standard', 'minor', [294, 336], [254, 296]),
      hb('standard', 'adult', [223, 258], [183, 218], 'bb'),
      hb('standard', 'adult', [223, 258], [183, 218], 'self'),
    ],
    homestayTravel: '坐公交或地铁到学校约45–60分钟',
    twinRule: '寄宿家庭双人间只限一起报名、同行的两位学生。',
    homestayLunch: true,
    assistedCheckIn: 80,
    residences: [
      ...IQ_LONDON_CITY('坐公共交通约40分钟到学校'),
      UCL_SUMMER(14, '坐公共交通约30分钟到学校'),
    ],
    transfers: [
      { id: 'heathrow', name: '希思罗机场', price: 110 },
      { id: 'city', name: '伦敦城市机场', price: 110 },
      { id: 'gatwick', name: '盖特威克机场', price: 145 },
      { id: 'stansted', name: '斯坦斯特德机场', price: 135 },
      { id: 'luton', name: '卢顿机场', price: 135 },
      { id: 'st-pancras', name: '圣潘克拉斯火车站', price: 90 },
    ],
    transferPerPassenger: true,
    transferNote: '单程每人价格；16岁以下抵达和离开都必须订学校接送机',
    family: { ages: '5–11岁', minAge: 5, maxAge: 11, start: '2027-06-20', end: '2027-08-08',
      childFull: 818, childDayPlus: 600, childDayOnly: 545, adultHomestay: 408, activities: '乐高乐园全天、儿童剧场、魔术表演、公园划船；全天出游如布莱顿、剑桥、伦敦动物园', children: 45,
      transfers: LONDON_FAMILY_TRANSFERS },
    juniorCentres: ['london-ucl'],
  },
  brighton: {
    id: 'brighton',
    name: '布莱顿校区',
    city: '布莱顿',
    minAge: 16,
    courses: [
      { id: 'intensive28', name: '强化课程28节', short: '强化28节', lessons: 28, hoursText: '每周28节（约23小时）', schedule: '09:00–15:40',
        prices: [541, 489, 460, 433, 367], focuses: ['生活英语', '职场英语', '雅思备考'], minAge: 16 },
      { id: 'morning20', name: '上午课程20节', short: '上午20节', lessons: 20, hoursText: '每周20节（约17小时）', schedule: '09:00–13:00',
        prices: [428, 388, 364, 343, 302], focuses: ['通用英语', '雅思备考', '30岁以上通用英语'], minAge: 16 },
      { id: 'afternoon20', name: '下午课程20节', short: '下午20节', lessons: 20, hoursText: '每周20节（约17小时）', schedule: '13:45–17:40',
        prices: [343, 310, 291, 275, 241], focuses: ['通用英语'], minAge: 16 },
    ],
    oneToOne: { twenty: [1631, 1582, 1537, 1489], fifteen: [1048, 1017, 983, 954], perLesson: 86, addOnFive: 330, addOnExtra: 66 },
    materials: '每本35–50英镑',
    homestay: [
      hb('standard', 'adult', [244, 279], [196, 217]),
      hb('standard', 'minor', [259, 299], [232, 237]),
      hb('standard', 'adult', [192, 225], [159, 178], 'bb'),
      hb('standard', 'adult', [192, 225], [159, 178], 'self'),
      hb('superior', 'adult', [361, 361], [361, 361]),
      hb('superior', 'minor', [361, 361], [361, 361]),
    ],
    homestayTravel: '坐公交到学校约10–40分钟',
    twinRule: '寄宿家庭双人间只限一起报名、同行的两位学生，或同日期有合适的室友。',
    residences: [
      { id: 'george-street', name: 'George Street学生公寓', room: '单人间（独立卫浴）', ageText: '18岁以上', minAge: 18,
        offPeak: 375, offPeakLong: 340, offPeakLongWeeks: 12, peak: 410, meals: '不含餐，可用公寓厨房',
        distance: '步行约4分钟到学校', breakfastPerWeek: 37 },
      { id: 'pavilion-single', name: 'Pavilion Point学生公寓', room: '单人间（独立卫浴）', ageText: '18岁以上', minAge: 18,
        offPeak: null, peak: 410, meals: '不含餐，可用公寓厨房', distance: '步行约10分钟到学校', breakfastPerWeek: 37 },
      { id: 'pavilion-studio', name: 'Pavilion Point学生公寓', room: '开间（带小厨房）', ageText: '18岁以上', minAge: 18,
        offPeak: 410, peak: 445, meals: '不含餐，房内有小厨房', distance: '步行约10分钟到学校', breakfastPerWeek: 37 },
    ],
    transfers: [
      { id: 'gatwick', name: '盖特威克机场', price: 121 },
      { id: 'heathrow', name: '希思罗机场', price: 209 },
      { id: 'stansted', name: '斯坦斯特德机场', price: 283 },
      { id: 'luton', name: '卢顿机场', price: 283 },
      { id: 'city', name: '伦敦城市机场', price: 283 },
    ],
    transferPerPassenger: false,
    transferNote: '单程每车价格',
    family: { ages: '5–15岁', minAge: 5, maxAge: 15, start: '2027-06-20', end: '2027-08-08',
      childFull: 796, childDayPlus: 618, childDayOnly: 563, adultHomestay: 368,
      activities: '布莱顿英皇阁、七姐妹白崖、陶艺彩绘；全天出游如汉普顿宫、伦敦', children: 55,
      transfers: [
        { id: 'gatwick', name: '盖特威克机场', price: 121 },
        { id: 'heathrow', name: '希思罗机场', price: 209 },
        { id: 'stansted', name: '斯坦斯特德机场', price: 283 },
        { id: 'luton', name: '卢顿机场', price: 283 },
        { id: 'city', name: '伦敦城市机场', price: 283 },
      ] },
    juniorCentres: ['brighton-homestay'],
  },
  cambridge: {
    id: 'cambridge',
    name: '剑桥校区',
    city: '剑桥',
    minAge: 14,
    courses: [
      { id: 'intensive28', name: '强化课程28节', short: '强化28节', lessons: 28, hoursText: '每周28节（约23小时）', schedule: '09:00–15:40',
        prices: [502, 453, 426, 400, 342], focuses: ['生活英语', '职场英语', '雅思备考'], minAge: 16 },
      { id: 'under16', name: '16岁以下强化课程', short: '16岁以下课程', lessons: 28, hoursText: '每周28节＋3次活动', schedule: '09:00–15:40',
        prices: [572, 523, 496, 470], focuses: ['通用英语'], minAge: 14, maxAge: 15, maxWeeks: 16 },
      { id: 'morning20', name: '上午课程20节', short: '上午20节', lessons: 20, hoursText: '每周20节（约17小时）', schedule: '09:00–13:00',
        prices: [397, 360, 338, 318, 280], focuses: ['通用英语', '雅思备考'], minAge: 16 },
      { id: 'morning15', name: '上午课程15节', short: '上午15节', lessons: 15, hoursText: '每周15节（约12.5小时）', schedule: '09:00–12:00',
        prices: [328, 297, 279, 262, 231], focuses: ['通用英语'], minAge: 16 },
      { id: 'afternoon20', name: '下午课程20节', short: '下午20节', lessons: 20, hoursText: '每周20节（约17小时）', schedule: '13:45–17:40',
        prices: [318, 288, 270, 255, 224], focuses: ['通用英语'], minAge: 16 },
    ],
    oneToOne: { twenty: [1514, 1469, 1426, 1382], fifteen: [972, 943, 912, 886], perLesson: 79, addOnFive: 305, addOnExtra: 61 },
    materials: '每本35–45英镑',
    homestay: [
      hb('standard', 'adult', [269, 294], [226, 240]),
      hb('standard', 'minor', [284, 314], [241, 260]),
      hb('standard', 'adult', [214, 238], [177, 190], 'bb'),
      hb('superior', 'adult', [322, 348], [280, 294]),
      hb('superior', 'minor', [337, 368], [295, 314]),
      hb('superior', 'adult', [268, 292], [230, 243], 'bb'),
    ],
    homestayTravel: '坐公共交通到学校约20–45分钟',
    twinRule: '寄宿家庭双人间只限一起报名、同行的两位学生，或同日期有合适的室友。',
    summerMinorSharing: 'may',
    homestayLunch: true,
    assistedCheckIn: 63,
    residences: [
      { id: 'st-marys', name: "St Mary's School暑期宿舍", room: '单人间、双人间或多人间（共用卫浴）', ageText: '14–17岁', minAge: 14, maxAge: 17,
        offPeak: null, peak: 617, meals: '一日三餐', distance: '步行约3分钟到学校', window: { start: '2027-07-11', end: '2027-08-08' } },
      { id: 'cb-studio', name: '私人开间公寓', room: '开间（独立卫浴和厨房）', ageText: '18岁以上', minAge: 18,
        offPeak: 356, peak: 405, meals: '不含餐，房内有厨房', distance: '步行约10–30分钟到学校' },
      { id: 'cherry-hinton', name: 'Cherry Hinton公寓', room: '公寓单人入住', ageText: '18岁以上', minAge: 18,
        offPeak: 341, peak: 385, meals: '不含餐，可用公寓厨房', distance: '步行约10–30分钟到学校' },
      { id: 'queensway', name: 'Queensway公寓', room: '公寓单人入住', ageText: '18岁以上', minAge: 18,
        offPeak: 341, peak: 385, meals: '不含餐，可用公寓厨房', distance: '步行约10–30分钟到学校' },
    ],
    transfers: [
      { id: 'stansted', name: '斯坦斯特德机场', price: 133 },
      { id: 'luton', name: '卢顿机场', price: 158 },
      { id: 'city', name: '伦敦城市机场', price: 182 },
      { id: 'heathrow', name: '希思罗机场', price: 225 },
      { id: 'gatwick', name: '盖特威克机场', price: 236 },
      { id: 'st-pancras', name: '圣潘克拉斯火车站', price: 225 },
    ],
    transferPerPassenger: false,
    transferNote: '单程每车价格；16岁以下抵达和离开都必须订学校接送机（由成年亲友接送的除外）',
    family: { ages: '5–13岁', minAge: 5, maxAge: 13, start: '2027-07-04', end: '2027-08-08',
      childFull: 777, childDayPlus: 587, childDayOnly: 532, adultHomestay: 380,
      activities: '康河撑篙、小门寻宝步道、剑桥学院参观；全天出游如伦敦、斯特拉特福', children: 60,
      transfers: [
        { id: 'stansted', name: '斯坦斯特德机场', price: 133 },
        { id: 'luton', name: '卢顿机场', price: 158 },
        { id: 'city', name: '伦敦城市机场', price: 182 },
        { id: 'heathrow', name: '希思罗机场', price: 225 },
        { id: 'gatwick', name: '盖特威克机场', price: 236 },
      ] },
    juniorCentres: ['cambridge-st-marys', 'cambridge-stem'],
  },
  eastbourne: {
    id: 'eastbourne',
    name: '伊斯特本校区',
    city: '伊斯特本',
    minAge: 14,
    courses: [
      { id: 'intensive28', name: '强化课程28节', short: '强化28节', lessons: 28, hoursText: '每周28节（约23小时）', schedule: '09:00–15:30',
        prices: [498, 449, 422, 397, 338], focuses: ['生活英语', '职场英语', '雅思备考', '大学预备英语'], minAge: 16 },
      { id: 'under16', name: '16岁以下强化课程', short: '16岁以下课程', lessons: 28, hoursText: '每周28节＋3次活动', schedule: '09:00–15:30',
        prices: [568, 519, 492, 467], focuses: ['通用英语'], minAge: 14, maxAge: 15, maxWeeks: 16 },
      { id: 'morning20', name: '上午课程20节', short: '上午20节', lessons: 20, hoursText: '每周20节（约17小时）', schedule: '09:00–12:45',
        prices: [394, 356, 335, 315, 277], focuses: ['通用英语', '雅思备考'], minAge: 16 },
      { id: 'afternoon20', name: '下午课程20节', short: '下午20节', lessons: 20, hoursText: '每周20节（约17小时）', schedule: '13:45–17:40',
        prices: [315, 285, 268, 252, 221], focuses: ['通用英语'], minAge: 16 },
    ],
    oneToOne: { twenty: [1514, 1469, 1426, 1382], fifteen: [972, 943, 912, 886], perLesson: 79, addOnFive: 300, addOnExtra: 60 },
    materials: '每本30–37英镑',
    homestay: [
      hb('standard', 'adult', [197, 230], [161, 180]),
      hb('standard', 'minor', [212, 250], [176, 200]),
      hb('standard', 'adult', [152, 183], [126, 144], 'bb'),
    ],
    homestayTravel: '坐公交到学校约15–60分钟',
    twinRule: '寄宿家庭双人间只限一起报名、同行的两位学生。',
    summerMinorSharing: 'will',
    homestayLunch: true,
    assistedCheckIn: 55,
    residences: [
      { id: 'south-cliff', name: 'South Cliff Avenue学生屋', room: '双人床房（独立卫浴）', ageText: '18岁以上', minAge: 18,
        offPeak: 215, peak: 215, meals: '不含餐，可用厨房', distance: '步行约2分钟到学校' },
      { id: 'south-cliff-hb', name: 'South Cliff Avenue学生屋', room: '双人床房（独立卫浴，含早晚餐）', ageText: '18岁以上', minAge: 18,
        offPeak: 245, peak: 245, meals: '含早餐和晚餐', distance: '步行约2分钟到学校' },
      { id: 'havelock', name: 'Havelock Road学生屋', room: '单人间（共用卫浴）', ageText: '18岁以上', minAge: 18,
        offPeak: 215, peak: 215, meals: '不含餐，可用厨房', distance: '步行约25–30分钟到学校' },
    ],
    transfers: [
      { id: 'gatwick', name: '盖特威克机场', price: 150 },
      { id: 'heathrow', name: '希思罗机场', price: 190 },
      { id: 'city', name: '伦敦城市机场', price: 195 },
      { id: 'stansted', name: '斯坦斯特德机场', price: 255 },
      { id: 'luton', name: '卢顿机场', price: 255 },
      { id: 'st-pancras', name: '圣潘克拉斯火车站', price: 240 },
    ],
    transferPerPassenger: false,
    transferNote: '单程每车价格；16岁以下抵达和离开都必须订学校接送机',
    family: { ages: '5–13岁', minAge: 5, maxAge: 13, start: '2027-07-04', end: '2027-08-08',
      childFull: 728, childDayPlus: 584, childDayOnly: 529, adultHomestay: 334,
      activities: '迷你高尔夫、冒险乐园、烧烤；全天出游如布莱顿、伦敦、Drusillas动物园', children: 45,
      transfers: [
        { id: 'gatwick', name: '盖特威克机场', price: 150 },
        { id: 'heathrow', name: '希思罗机场', price: 190 },
        { id: 'city', name: '伦敦城市机场', price: 195 },
        { id: 'stansted', name: '斯坦斯特德机场', price: 255 },
        { id: 'luton', name: '卢顿机场', price: 255 },
      ] },
    juniorCentres: [],
  },
};

export const ST_GILES_CAMPUS_ORDER: StGilesCampusId[] = ['london-central', 'london-highgate', 'brighton', 'cambridge', 'eastbourne'];

/** Family courses: adults who do not study and do not need homestay, or who only join the social programme. */
export const ST_GILES_FAMILY_COMMON = {
  adultNoHomestay: 190,
  adultSocialOnly: 145,
  registrationPerFamily: 88,
  placementPerFamily: 52,
  halfBoardPerPerson: 52,
  specialDiet: 34,
};

export interface StGilesJuniorCentre {
  id: StGilesJuniorCentreId;
  name: string;
  city: string;
  venue: string;
  ages: string;
  minAge: number;
  maxAge: number;
  level: string;
  start: string;
  end: string;
  /** Fixed-length course (STEM is exactly two weeks). */
  fixedWeeks?: number;
  residential: number;
  dayOnly: number;
  stay: string;
  bathroom: string;
  capacity: string;
  excursions: string;
  sampleWeek: string;
  evenings: string;
  /** Transfers per student, one way, travelling alone (group rates are lower). */
  transfers: StGilesAirport[];
  /** Optional weekly sports coaching. */
  sports?: Array<{ id: string; name: string; price: number }>;
  campus?: StGilesCampusId;
  isNew?: boolean;
}

export const ST_GILES_JUNIOR = {
  lessonsPerWeek: 20,
  maxClass: 15,
  unaccompaniedMinorAge: 13,
  unaccompaniedMinorFee: 63,
  breakageDeposit: 80,
  /** Sole use of the transfer car, per journey (students on the same flight otherwise share). */
  soleOccupancy: 38,
  nonSundaySupplement: 112,
};

export const ST_GILES_JUNIOR_CENTRES: StGilesJuniorCentre[] = [
  {
    id: 'london-ucl', name: '伦敦青少年夏校', city: '伦敦', venue: '伦敦大学学院（UCL）宿舍', ages: '12–17岁', minAge: 12, maxAge: 17,
    level: 'A1以上', start: '2027-06-27', end: '2027-08-01', residential: 1607, dayOnly: 931,
    stay: '单人间，共用卫浴', bathroom: '约6–10人共用1个卫生间', capacity: '约150名学生',
    excursions: '每周至少1次全天和3次半天出游，例如伦敦眼、泰晤士河游船、伦敦塔',
    sampleWeek: '泰晤士河游船、莎士比亚环球剧场、9¾站台、卡姆登市场、威斯敏斯特徒步、布莱顿一日游',
    evenings: '舞蹈工作坊、英国美食问答、舞会',
    transfers: [{ id: 'heathrow', name: '希思罗机场', price: 118 }, { id: 'gatwick', name: '盖特威克机场', price: 158 }],
    campus: 'london-central',
  },
  {
    id: 'cambridge-st-marys', name: '剑桥青少年夏校', city: '剑桥', venue: "St Mary's School寄宿学校", ages: '8–17岁', minAge: 8, maxAge: 17,
    level: 'A1以上', start: '2027-07-04', end: '2027-08-08', residential: 1477, dayOnly: 886,
    stay: '单人间、双人间或多人间', bathroom: '约5人共用1个卫生间', capacity: '约120名学生',
    excursions: '每周至少1次全天和3次半天出游，例如伦敦、剑桥植物园、莎士比亚故乡斯特拉特福',
    sampleWeek: '康河撑篙、国王学院参观、剑桥植物园、伦敦一日游、英语加强课和运动',
    evenings: '夺旗游戏、舞会、披萨派对、保龄球、才艺表演、结业典礼',
    transfers: [{ id: 'stansted', name: '斯坦斯特德机场', price: 133 }, { id: 'heathrow', name: '希思罗机场', price: 225 },
      { id: 'gatwick', name: '盖特威克机场', price: 236 }],
    campus: 'cambridge',
  },
  {
    id: 'cambridge-stem', name: '剑桥STEM夏校', city: '剑桥', venue: "St Mary's School寄宿学校", ages: '14–17岁', minAge: 14, maxAge: 17,
    level: 'B2以上', start: '2027-07-18', end: '2027-08-01', fixedWeeks: 2, residential: 1800, dayOnly: 1211,
    stay: '单人间、双人间或多人间', bathroom: '约5人共用1个卫生间', capacity: '约120名学生',
    excursions: '每周至少1次全天和3次半天出游',
    sampleWeek: '每周课程主题和活动安排请咨询顾问',
    evenings: '和剑桥青少年夏校在同一所寄宿学校，晚间活动请咨询顾问',
    transfers: [{ id: 'stansted', name: '斯坦斯特德机场', price: 133 }, { id: 'heathrow', name: '希思罗机场', price: 225 },
      { id: 'gatwick', name: '盖特威克机场', price: 236 }],
    campus: 'cambridge',
  },
  {
    id: 'brighton-homestay', name: '布莱顿寄宿家庭夏校', city: '布莱顿', venue: 'St Giles布莱顿校区＋寄宿家庭', ages: '12–17岁', minAge: 12, maxAge: 17,
    level: 'A1以上', start: '2027-06-20', end: '2027-08-01', residential: 925, dayOnly: 695,
    stay: '寄宿家庭双人间，共用卫浴；一日三餐（工作日午餐在学校吃）', bathroom: '与寄宿家庭共用', capacity: '约50名学生',
    excursions: '每周5次下午活动、3次晚间活动、1次全天和1次半天出游，例如伦敦、七姐妹白崖',
    sampleWeek: '陶艺彩绘、迷你奥运会、海滨骑行、才艺表演、英国知识问答、全天出游',
    evenings: '寄宿家庭休息、18岁以下国际派对、海滩炸鱼薯条、结业典礼',
    transfers: [],
    campus: 'brighton',
    isNew: true,
  },
  {
    id: 'canterbury', name: '坎特伯雷青少年夏校', city: '坎特伯雷', venue: "The King's School寄宿学校", ages: '8–17岁', minAge: 8, maxAge: 17,
    level: 'A1以上', start: '2027-07-04', end: '2027-08-08', residential: 1595, dayOnly: 956,
    stay: '单人间、双人间或多人间', bathroom: '约5人共用1个卫生间', capacity: '约150名学生',
    excursions: '每周至少1次全天和3次半天出游，例如伦敦、剑桥、黑斯廷斯和拉伊古镇',
    sampleWeek: '撑篙、宝莱坞舞蹈、陶艺彩绘、射箭和猎鹰体验、伦敦一日游',
    evenings: '水上运动会、电影俱乐部、僵尸之夜、现场音乐、舞会',
    transfers: [{ id: 'gatwick', name: '盖特威克机场', price: 151 }, { id: 'heathrow', name: '希思罗机场', price: 221 }],
    sports: [{ id: 'fencing', name: '击剑训练（每周5小时）', price: 194 }, { id: 'tennis', name: '网球训练（每周5小时）', price: 159 }],
  },
  {
    id: 'oxford', name: '牛津青少年夏校', city: '牛津', venue: '牛津布鲁克斯大学', ages: '12–17岁', minAge: 12, maxAge: 17,
    level: 'A1以上', start: '2027-07-04', end: '2027-08-08', residential: 1410, dayOnly: 801,
    stay: '单人间', bathroom: '约3人共用1个卫生间', capacity: '约90名学生',
    excursions: '每周至少1次全天和3次半天出游，例如牛津各学院、伦敦、剑桥',
    sampleWeek: '撑篙、手工、牛津城堡、牛津大学参观、巴斯一日游',
    evenings: '纸杯蛋糕装饰、时装秀、戏剧游戏、电影之夜、运动之夜',
    transfers: [{ id: 'heathrow', name: '希思罗机场', price: 149 }, { id: 'gatwick', name: '盖特威克机场', price: 263 }],
  },
];

/** Weekly group tuition for the total number of course weeks. */
export function stGilesCourseRate(course: StGilesGroupCourse, weeks: number): number {
  const tier = weeks >= 24 ? 4 : weeks >= 12 ? 3 : weeks >= 8 ? 2 : weeks >= 4 ? 1 : 0;
  return course.prices[Math.min(tier, course.prices.length - 1)];
}

/** Weekly one-to-one price for 1 / 2 / 3 / 4+ weeks. */
export function stGilesOneToOneRate(prices: number[], weeks: number): number {
  return prices[Math.min(Math.max(weeks, 1), 4) - 1];
}

export function stGilesHomestayPrice(campus: StGilesCampusPricing, tier: StGilesHomestayTier, board: StGilesHomestayBoard,
  minor: boolean): StGilesHomestayPrice | undefined {
  return campus.homestay.find(item => item.tier === tier && item.board === board && item.age === (minor ? 'minor' : 'adult'));
}
