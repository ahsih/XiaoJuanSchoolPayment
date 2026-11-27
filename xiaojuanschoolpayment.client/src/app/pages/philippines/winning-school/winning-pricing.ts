// Winning English Academy's catalogue for its two Cebu campuses, from the school's Feishu drive (read 2026-11-26):
// the New City (Ayala) price table of 2026-09-22 (valid from 2026-10-03, when the old City campus moved to Ayala), the
// school-wide price table of 2026-06-03 for the Ocean campus, the material-fee table (from June 2026), the Ayala
// grand-opening offer and the BESA/CALA 2027 peak notice. Each page shows and quotes its own campus only.
// Source record: docs/winning-source-2026-11-26.md. Keep this file pure data, so the WeChat mini program can bundle it.

export type WinningCampus = 'ayala' | 'ocean';

export interface WinningCourseFee {
  id: string;
  name: string;
  /** Four-week tuition in dollars; 1/2/3 weeks are 40/60/80% of it, longer stays proportional. */
  tuition: number;
  campuses: readonly WinningCampus[];
  /** Classes a day only (AGENTS rule 10): the school sets subjects and teachers after the level test. */
  schedule: string;
  suitable: string;
  note: string;
  familyCourse?: boolean;
  /** Material fee in pesos for 2/4/8/12/16/20/24 weeks (material-fee table, from June 2026). */
  books: readonly number[];
}

export interface WinningRoomFee {
  id: string;
  name: string;
  code: string;
  group: string;
  location: '校内' | '校外';
  /** Four-week room and meals per person in dollars. */
  fee: number;
  campus: WinningCampus;
  note: string;
  /** Lyf hotel: at least two weeks. */
  minimumWeeks?: number;
}

export const WINNING_CAMPUS_NAMES: Readonly<Record<WinningCampus, string>> = {
  ayala: 'Winning Ayala校区',
  ocean: 'Winning Ocean校区',
};

/** Longer names in titles and the quote image. */
export const WINNING_CAMPUS_LABELS: Readonly<Record<WinningCampus, string>> = {
  ayala: 'Winning 新城市Ayala校区',
  ocean: 'Winning Ocean海滨校区',
};

const BOTH: readonly WinningCampus[] = ['ayala', 'ocean'];
const AYALA: readonly WinningCampus[] = ['ayala'];

/** Courses for children (6–17) and the preschool course; for students under 18. */
export const WINNING_CHILD_COURSE_IDS: readonly string[] = ['jep-kids', 'jep-junior', 'preschool'];
/** Courses of the 亲子家庭英语 group (children and their guardian). */
export const WINNING_FAMILY_COURSE_IDS: readonly string[] = ['guardian', 'jep-kids', 'jep-junior', 'preschool'];
/** Courses the Ayala grand-opening offer upgrades for free, each to the next level (ESL and IELTS, 4+ weeks). */
export const WINNING_UPGRADES: Readonly<Record<string, string>> = {
  esl4: 'esl2',
  ps6: 'esl4',
  sf8: 'ps6',
  ielts: 'pre-ielts',
};

export const WINNING_COURSE_FEES: WinningCourseFee[] = [
  {
    id: 'esl2', name: 'Cambridge ESL2 剑桥英语', tuition: 672, campuses: BOTH,
    schedule: '每天2节一对一 + 2节小组课 + 2节选修课',
    suitable: '想留出自由时间、或陪读之余轻松学英语的学生',
    note: '每天课最少的ESL课程；入学测试后分级。',
    books: [1500, 1900, 2700, 3500, 4300, 5100, 5900],
  },
  {
    id: 'esl4', name: 'Cambridge ESL4 剑桥英语', tuition: 777, campuses: BOTH,
    schedule: '每天4节一对一 + 2节小组课 + 2节选修课',
    suitable: '大多数想全面提高英语的成人学生',
    note: '学校最常报的ESL课程；入学测试后分级。',
    books: [2200, 2600, 3400, 4200, 5000, 5800, 6600],
  },
  {
    id: 'ps6', name: 'Power Speaking 6 口语强化', tuition: 935, campuses: BOTH,
    schedule: '每天6节一对一 + 2节小组课 + 2节选修课',
    suitable: '想多上一对一、集中练口语的学生',
    note: '比ESL4每天多2节一对一。',
    books: [2800, 3200, 4000, 4800, 5600, 6400, 7200],
  },
  {
    id: 'sf8', name: 'Speaking Focus 8 口语强化', tuition: 1095, campuses: BOTH,
    schedule: '每天8节一对一 + 2节选修课',
    suitable: '短期想把时间都用在一对一口语上的学生',
    note: '一对一最多的课程，没有小组课。',
    books: [3100, 3500, 4300, 5100, 5900, 6700, 7500],
  },
  {
    id: 'pre-toeic', name: 'Pre-TOEIC 托业入门', tuition: 882, campuses: AYALA,
    schedule: '每天4节一对一 + 2节小组课 + 2节选修课',
    suitable: '12岁以上、想先打基础再备考托业的学生',
    note: '学校参考的目标是托业550–750分；只在Ayala校区开设。',
    books: [2000, 2400, 3200, 4000, 4800, 5600, 6400],
  },
  {
    id: 'toeic', name: 'TOEIC Intensive 托业实战', tuition: 935, campuses: AYALA,
    schedule: '每天4节一对一 + 4节小组课 + 2节选修课',
    suitable: '12岁以上、准备托业考试的学生',
    note: '学校参考的目标是托业750–880分；每周一次模考；只在Ayala校区开设。',
    books: [2600, 3200, 4400, 5600, 6800, 8000, 9200],
  },
  {
    id: 'pre-ielts', name: 'Pre-IELTS 雅思入门', tuition: 987, campuses: AYALA,
    schedule: '每天4节一对一 + 2节小组课 + 2节选修课',
    suitable: '12岁以上、雅思目标4.5–6.0分的学生',
    note: '须先通过学校的报名测试；只在Ayala校区开设。',
    books: [2050, 2450, 3250, 4050, 4850, 5650, 6450],
  },
  {
    id: 'ielts', name: 'IELTS Intensive 雅思实战', tuition: 1092, campuses: AYALA,
    schedule: '每天4节一对一 + 4节小组课 + 2节选修课',
    suitable: '12岁以上、雅思目标6.5–7.5分的学生',
    note: '须先通过学校的报名测试；每周一次模考；只在Ayala校区开设。',
    books: [2250, 2850, 4050, 5250, 6450, 7650, 8850],
  },
  {
    id: 'business', name: 'Business 商务英语', tuition: 835, campuses: AYALA,
    schedule: '每天4节一对一 + 2节小组课 + 2节选修课',
    suitable: '16岁以上、工作中要用英语沟通的学生',
    note: '只在Ayala校区开设。',
    books: [2350, 2750, 3550, 4350, 5150, 5950, 6750],
  },
  {
    id: 'travel', name: 'Travel English 旅游英语', tuition: 935, campuses: BOTH,
    schedule: '每天4节一对一 + 2节小组课 + 2节选修课',
    suitable: '想练旅行和日常生活英语的学生',
    note: 'Ayala校区12岁以上、Ocean校区16岁以上可报（学校册子）。',
    books: [2050, 2450, 3250, 4050, 4850, 5650, 6450],
  },
  {
    id: 'jep-kids', name: 'JEP 儿童英语', tuition: 935, campuses: BOTH, familyCourse: true,
    schedule: '每天4节一对一 + 2节小组课 + 2节选修课',
    suitable: '6–17岁、由家长陪同来读书的孩子',
    note: '亲子家庭英语课程；儿童班和青少年班由学校按年龄和程度安排。',
    books: [4050, 4650, 5850, 7050, 8250, 9450, 10650],
  },
  {
    id: 'jep-junior', name: 'JEP 青少年英语', tuition: 935, campuses: BOTH, familyCourse: true,
    schedule: '每天4节一对一 + 2节小组课 + 2节选修课',
    suitable: '6–17岁、由家长陪同来读书的青少年',
    note: '亲子家庭英语课程；儿童班和青少年班由学校按年龄和程度安排。',
    books: [2050, 2450, 3250, 4050, 4850, 5650, 6450],
  },
  {
    id: 'preschool', name: 'Preschool English 幼儿英语', tuition: 1135, campuses: BOTH, familyCourse: true,
    schedule: '每天2节一对一 + 4节小组课 + 2节选修小组课',
    suitable: '6岁以下、由家长陪同来读书的幼儿',
    note: '亲子家庭英语课程，只在淡季开放（学校价格表）。',
    books: [3150, 3750, 4950, 6150, 7350, 8550, 9750],
  },
  {
    id: 'guardian', name: 'Guardian ESL Lite 监护人课程', tuition: 410, campuses: BOTH, familyCourse: true,
    schedule: '每天2节一对一',
    suitable: '陪孩子来读书、自己也想学英语的家长',
    note: '亲子家庭英语课程；监护人也可以改报学校的其他课程。',
    books: [1150, 1550, 2350, 3150, 3950, 4750, 5550],
  },
];

const room = (
  campus: WinningCampus, group: string, location: '校内' | '校外', id: string, name: string, code: string, fee: number,
  note: string, minimumWeeks?: number,
): WinningRoomFee => ({ id, name, code, group, location, fee, campus, note, ...(minimumWeeks ? { minimumWeeks } : {}) });

const CQH = '校内 CQH';
const GEORGE = 'Hotel George';
const LYF = 'Lyf Hotel';
const OCEAN = 'Ocean 校内宿舍';

/** Four-week prices per person, room and weekday meals (2026-09-22 Ayala table; 2026-06-03 table for Ocean). */
export const WINNING_ROOM_FEES: WinningRoomFee[] = [
  room('ayala', CQH, '校内', 'cqh-2p', '校内双人房 2P', '2P', 950, '两张单人床，两人一间。'),
  room('ayala', CQH, '校内', 'cqh-family-3p', '校内三人家庭房 Family 3P', 'F3P', 800, '两张单人床加一张加床，供一家人入住。'),
  room('ayala', CQH, '校内', 'cqh-bp4', '校内背包客4人房', 'BP4', 750, '两张上下铺，四人一间。'),
  room('ayala', CQH, '校内', 'cqh-bp6', '校内背包客6人房', 'BP6', 650, '三张上下铺，六人一间。'),
  room('ayala', GEORGE, '校外', 'george-deluxe-1p', 'Hotel George 豪华单人房', 'G1PD', 1600, '一张大床，约18平方米，有窗；步行到校区约10分钟。'),
  room('ayala', GEORGE, '校外', 'george-standard-1p', 'Hotel George 标准单人房', 'G1PS', 1300, '一张单人床，约14平方米，没有窗；步行到校区约10分钟。'),
  room('ayala', GEORGE, '校外', 'george-family-2p', 'Hotel George 家庭双人房', 'GF2', 1100, '两张单人床或一张大床，约18平方米，供一家人入住。'),
  room('ayala', GEORGE, '校外', 'george-family-3p', 'Hotel George 家庭三人房', 'GF3', 800, '两张单人床加一张加床，约21平方米，供一家人入住。'),
  room('ayala', GEORGE, '校外', 'george-family-4p', 'Hotel George 家庭四人房', 'GF4', 1000, '两张单人床加一张大床，约50平方米，供一家人入住。'),
  room('ayala', LYF, '校外', 'lyf-1p', 'Lyf Hotel 单人房', 'L1P', 1800, '一张大床；至少住2周。', 2),
  room('ayala', LYF, '校外', 'lyf-family-2p', 'Lyf Hotel 家庭双人房', 'LF2', 1400, '一张大床或两张单人床，供一家人入住；至少住2周。', 2),
  room('ayala', LYF, '校外', 'lyf-family-3p', 'Lyf Hotel 家庭三人房', 'LF3', 1200, '两个卧室（一张大床、两张单人床），供一家人入住；至少住2周。', 2),
  room('ayala', LYF, '校外', 'lyf-family-4p', 'Lyf Hotel 家庭四人房', 'LF4', 1000, '两个卧室（一张大床、两张单人床），供一家人入住；至少住2周。', 2),
  room('ayala', LYF, '校外', 'lyf-family-5p', 'Lyf Hotel 家庭五人房', 'LF5', 950, '四个卧室（两间单人床、两间大床），供一家人入住；至少住2周。', 2),
  room('ayala', LYF, '校外', 'lyf-family-6p', 'Lyf Hotel 家庭六人房', 'LF6', 850, '四个卧室（两间单人床、两间大床），供一家人入住；至少住2周。', 2),
  room('ocean', OCEAN, '校内', 'ocean-1p', '单人房 1P', '1P', 1200, '一张单人床，一人一间。'),
  room('ocean', OCEAN, '校内', 'ocean-2p', '双人房 2P', '2P', 900, '两张单人床，两人一间。'),
  room('ocean', OCEAN, '校内', 'ocean-family-3p', '家庭三人房 Family 3P', 'F3P', 750, '双人房加一张床，只接受两位成人加一个孩子。'),
  room('ocean', OCEAN, '校内', 'ocean-bp4', '女生背包客4人房', 'BP4', 550, '两张上下铺，只收女生。'),
  room('ocean', OCEAN, '校内', 'ocean-bp8', '男生背包客8人房', 'BP8', 423, '四张上下铺，只收男生。'),
];

/** Short stays: 1/2/3 weeks are 40/60/80% of the four-week price (tuition and rooms); five weeks and longer pro rata. */
export const WINNING_SHORT_STAY_RATIOS: Readonly<Record<string, number>> = { '1': 0.4, '2': 0.6, '3': 0.8 };

/** Material-fee table columns (weeks). */
const BOOK_COLUMNS = [2, 4, 8, 12, 16, 20, 24] as const;

/**
 * Material fee in pesos for one course over its total weeks: the table's column at or above the length (1 week reads
 * the 2-week column); beyond 24 weeks each further 4 weeks adds the table's last 4-week step.
 */
export function winningBookFee(books: readonly number[], weeks: number): number {
  if (weeks <= 0 || !books.length) return 0;
  const column = BOOK_COLUMNS.findIndex(limit => weeks <= limit);
  if (column >= 0) return books[column];
  const last = books[books.length - 1];
  const step = last - books[books.length - 2];
  return last + Math.ceil((weeks - 24) / 4) * step;
}

/** Ayala grand-opening offer: registration within 2026, off-peak weeks only (school's 2026-09-22 table and poster). */
export const WINNING_AYALA_OFFER_REGISTRATION_END = '2026-12-31';
/** Peak weeks the Ayala offer leaves out: the 2027 winter peak, and the CALA summer peak (school: dates announced later). */
export const WINNING_OFFER_BLACKOUTS: ReadonlyArray<{ start: string; end: string; label: string }> = [
  { start: '2027-01-24', end: '2027-02-28', label: '2027/01/24–02/28寒假旺季' },
  { start: '2027-07-04', end: '2027-08-28', label: '2027/07/04–08/28暑假旺季' },
];

/** Ocean registrations are paused for November and December 2026 arrivals (school-wide table, 2026-06-03). */
export const WINNING_OCEAN_PAUSE = { start: '2026-11-01', end: '2026-12-31' } as const;

/** Visa extensions (school tables), plus the 300-peso appointment fee each time (2026-09-22 table). */
export const WINNING_VISA_RATES = [5140, 6920, 4440, 4950, 5450] as const;
export const WINNING_VISA_APPOINTMENT_FEE = 300;
