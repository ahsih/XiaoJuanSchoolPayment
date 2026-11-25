// English Fella's 2026 catalogue (school pack received 2026-11-25: 2026 tuition and room sheet, local-fee sheet,
// Christmas offer, both campus orientations and the agency orientation of 2026-10-02). First Campus (Fella1) is the
// Sparta campus; Second Campus (Fella2) offers the 自律型 (Classic) and 半斯巴达 (J-Sparta) modes. Each page shows and
// quotes its own campus only. Keep this file pure data, so the WeChat mini program can bundle it later.

export type FellaCampus = 'campus1' | 'campus2';

export interface FellaCourseFee {
  id: string;
  name: string;
  /** Four-week tuition in dollars; 1/2/3 weeks are 30/60/90% of it, longer stays proportional. */
  tuition: number;
  campuses: readonly FellaCampus[];
  schedule: string;
  suitable: string;
  note: string;
  familyCourse?: boolean;
  /** Only these whole lengths (the guarantee courses: one 12-week set). */
  allowedWeeks?: readonly number[];
}

export interface FellaRoomFee {
  id: string;
  name: string;
  code: string;
  group: '单人间' | '多人间';
  fee: number;
  campuses: readonly FellaCampus[];
  note: string;
}

export const FELLA_CAMPUS_LABELS: Readonly<Record<FellaCampus, string>> = {
  campus1: '第一校区（斯巴达）',
  campus2: '第二校区（自律型／半斯巴达）',
};

/** Short campus names in headings and the quote image. */
export const FELLA_CAMPUS_NAMES: Readonly<Record<FellaCampus, string>> = {
  campus1: 'English Fella 第一校区',
  campus2: 'English Fella 第二校区',
};

const BOTH: readonly FellaCampus[] = ['campus1', 'campus2'];
const FIRST: readonly FellaCampus[] = ['campus1'];
const SECOND: readonly FellaCampus[] = ['campus2'];

/** Family courses (Fella2): no 思达启航 discount on them (school offer terms). */
export const FELLA_FAMILY_COURSE_IDS: readonly string[] = ['p-jec', 'jec', 'gec'];
/** Children's courses; only for students under 18. */
export const FELLA_CHILD_COURSE_IDS: readonly string[] = ['p-jec', 'jec'];
/** 12-week guarantee sets, Fella1 only. */
export const FELLA_GUARANTEE_COURSE_IDS: readonly string[] = ['toeic-guarantee', 'pigi'];
/** Courses whose first textbook set costs 1,500 pesos whatever the length (local-fee sheet). */
export const FELLA_SMALL_BOOK_COURSE_IDS: readonly string[] = ['gec'];

export const FELLA_COURSE_FEES: FellaCourseFee[] = [
  {
    id: 'pic-4', name: 'PIC-4 综合英语', tuition: 950, campuses: BOTH,
    schedule: '4节一对一 + 2节四人小组课 + 1节八人小组课',
    suitable: '想全面打好听说读写基础的学生', note: '共9个级别，入学测试后分班；每4周一次级别测试。',
  },
  {
    id: 'pic-5', name: 'PIC-5 综合英语', tuition: 1000, campuses: BOTH,
    schedule: '5节一对一 + 1节四人小组课 + 1节八人小组课',
    suitable: '想多上一对一的学生', note: '共9个级别，入学测试后分班；比PIC-4每天多1节一对一。',
  },
  {
    id: 'pic-6', name: 'PIC-6 口语强化', tuition: 1050, campuses: BOTH,
    schedule: '6节一对一 + 1节八人小组课',
    suitable: '想集中练口语、一对一最多的学生', note: '学校课程名 Power Speaking；共9个级别，入学测试后分班。',
  },
  {
    id: 'toeic-esl', name: 'TOEIC+ESL 托业入门', tuition: 1050, campuses: BOTH,
    schedule: '2节托业一对一 + 2节ESL一对一 + 2节ESL四人小组课 + 1节ESL八人小组课',
    suitable: '托业250分以上、想边打基础边准备托业的学生', note: '入学参考托业250分以上。',
  },
  {
    id: 'toeic-practice', name: 'TOEIC 托业', tuition: 1050, campuses: BOTH,
    schedule: '4节托业一对一 + 2节托业四人小组课 + 1节ESL八人小组课',
    suitable: '托业300分以上、准备考试的学生', note: '入学参考托业300分以上。',
  },
  {
    id: 'toeic-guarantee', name: 'TOEIC 托业保分班', tuition: 1100, campuses: FIRST, allowedWeeks: [12],
    schedule: '4节托业一对一 + 2节托业四人小组课 + 1节ESL八人小组课',
    suitable: '有明确托业目标、能按斯巴达规定学习的学生', note: '12周为一期，只在第一校区开设；在读期间提供2次托业官方考试。',
  },
  {
    id: 'pift-e', name: 'PIFT-E 雅思入门', tuition: 1050, campuses: BOTH,
    schedule: '4节ESL一对一 + 2节雅思四人小组课 + 1节ESL八人小组课',
    suitable: '雅思1.0–2.0、想先打英语基础的学生', note: '入学参考雅思1.0–2.0。',
  },
  {
    id: 'pift', name: 'PIFT 雅思', tuition: 1050, campuses: BOTH,
    schedule: '4节雅思一对一 + 2节雅思四人小组课 + 1节雅思八人小组课',
    suitable: '雅思2.5分以上、准备考试的学生', note: '入学参考雅思2.5分以上。',
  },
  {
    id: 'pirc', name: 'PIRC 雅思冲刺', tuition: 1100, campuses: BOTH,
    schedule: '5节雅思一对一 + 2节雅思四人小组课',
    suitable: '想按自己的弱项安排一对一的雅思学生', note: '入学参考雅思2.5分以上；一对一老师雅思官方成绩7.5分以上，可按弱项选上课内容，周数灵活。',
  },
  {
    id: 'pigi', name: 'PIGI 雅思保分班', tuition: 1100, campuses: FIRST, allowedWeeks: [12],
    schedule: '4节雅思一对一 + 2节雅思四人小组课 + 1节雅思八人小组课',
    suitable: '有明确雅思目标、能按斯巴达规定学习的学生', note: '12周为一期，只在第一校区开设；指定日期入学，入学后第9周前后参加1次雅思官方考试（不含UKVI）。',
  },
  {
    id: 'ppt', name: 'PPT 托福入门', tuition: 1050, campuses: BOTH,
    schedule: '2节托福一对一 + 2节ESL一对一 + 2节ESL四人小组课 + 1节ESL八人小组课',
    suitable: '托福30分以上、想边打基础边准备托福的学生', note: '入学参考托福30分以上。',
  },
  {
    id: 'ptft', name: 'PTFT 托福', tuition: 1050, campuses: BOTH,
    schedule: '4节托福一对一 + 2节ESL四人小组课 + 1节ESL八人小组课',
    suitable: '托福40分以上、准备考试的学生', note: '入学参考托福40分以上。',
  },
  {
    id: 'ebc', name: 'EBC 商务英语', tuition: 1050, campuses: SECOND,
    schedule: '5节一对一 + 2节四人小组课',
    suitable: '工作中需要用英语沟通的学生', note: '入学参考2级以上；只在第二校区开设。',
  },
  {
    id: 'ssc', name: 'SSC 乐龄会话（40岁以上）', tuition: 1100, campuses: SECOND,
    schedule: '6节一对一',
    suitable: '40岁以上、想轻松练会话的学生', note: '只在第二校区开设，按自律型生活模式管理。',
  },
  {
    id: 'gec', name: 'GEC 家长课程', tuition: 800, campuses: SECOND, familyCourse: true,
    schedule: '3节一对一',
    suitable: '陪孩子来读书、自己也想学英语的家长', note: '亲子课程，和孩子一起报名；只在第二校区开设。',
  },
  {
    id: 'p-jec', name: 'P-JEC 幼儿课程（5–6岁）', tuition: 1100, campuses: SECOND, familyCourse: true,
    schedule: '4节一对一',
    suitable: '5–6岁、和家长一起来的孩子', note: '亲子课程，须家长陪读；只在第二校区开设。',
  },
  {
    id: 'jec', name: 'JEC 儿童课程（7–15岁）', tuition: 1100, campuses: SECOND, familyCourse: true,
    schedule: '4节一对一 + 2节四人小组课',
    suitable: '7–15岁的孩子', note: '亲子课程，未满15岁须家长陪读；只在第二校区开设。',
  },
];

export const FELLA_ROOM_FEES: FellaRoomFee[] = [
  { id: 'premium-1p', name: '豪华单人间 1P', code: '1P', group: '单人间', fee: 1200, campuses: BOTH, note: '一人一间，房内有卫生间。' },
  { id: 'single-1a', name: '标准单人间 1A', code: '1A', group: '单人间', fee: 1000, campuses: FIRST, note: '一人一间，房内有卫生间；只在第一校区。' },
  { id: 'single-1b', name: '单人雅房 1B', code: '1B', group: '单人间', fee: 950, campuses: FIRST, note: '一人一间卧室，和邻房共用客厅和卫生间；只在第一校区。' },
  { id: 'twin-2a', name: '双人间 2A', code: '2A', group: '多人间', fee: 850, campuses: BOTH, note: '两人一间。' },
  { id: 'triple-3a', name: '三人间 3A', code: '3A', group: '多人间', fee: 750, campuses: BOTH, note: '三人一间。' },
];

/** Short stays: 1/2/3 weeks are 30/60/90% of the four-week price (tuition and rooms). */
export const FELLA_SHORT_STAY_RATIOS: Readonly<Record<string, number>> = { '1': 0.3, '2': 0.6, '3': 0.9 };

/** The 2026 Christmas offer: a course week touching either study week earns 100 dollars, at most 200. */
export const FELLA_CHRISTMAS_WEEKS: ReadonlyArray<{ start: string; end: string }> = [
  { start: '2026-12-21', end: '2026-12-27' },
  { start: '2026-12-28', end: '2027-01-03' },
];
export const FELLA_CHRISTMAS_PER_WEEK = 100;
export const FELLA_CHRISTMAS_MAX = 200;

/**
 * Fella1's fee for a 15–17-year-old studying without a parent (Guardian Fee on the 2026 sheet):
 * 50 dollars for 1–2 weeks, 100 for 3–4 weeks, then 25 dollars a course week.
 */
export function fellaGuardianFee(courseWeeks: number): number {
  if (courseWeeks <= 0) return 0;
  if (courseWeeks <= 2) return 50;
  if (courseWeeks <= 4) return 100;
  return 25 * courseWeeks;
}

/** Room deposit on the local-fee sheet by stay length (refundable, outside the total). */
export function fellaRoomDeposit(stayWeeks: number): number {
  if (stayWeeks <= 1) return 1000;
  if (stayWeeks === 2) return 2000;
  return stayWeeks >= 12 ? 4000 : 3000;
}
