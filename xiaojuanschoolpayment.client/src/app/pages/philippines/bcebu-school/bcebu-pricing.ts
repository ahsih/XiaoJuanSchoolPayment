// B'Cebu's 2026 price list ("B' CEBU PRICE LIST 2026", registrations from 2026-01-01; no 2027 list yet),
// the 2027 off-season and summer notices and the 2026-10-19 Chinese orientation (received 2026-11-23).
// Course and room ids stay as before, so saved content revisions keep their rows. Keep this file pure data.

export interface BCebuCourse {
  id: string;
  name: string;
  tuition: number;
  /** Daily classes, shown under the course name. */
  schedule: string;
  /** Who the course is for. */
  suitable: string;
  note: string;
}
export interface BCebuRoom { id: string; name: string; group: string; fee: number; note: string; }

export const BCEBU_JUNIOR_COURSE_ID = 'junior-esl';
export const BCEBU_KIDS_COURSE_ID = 'kindergarten';
export const BCEBU_IELTS_GUARANTEE_ID = 'ielts-guarantee';
export const BCEBU_LITE_40_COURSE_ID = 'lite-esl2-40-plus';
/** The price list prices Kids Center only with these rooms. */
export const BCEBU_KIDS_ROOM_IDS = ['double-living-room', 'family-triple-extra-bed', 'double', 'triple-bunk'];

const OPTIONAL_NOTE = '选修课有词汇、听力、俚语、演讲和辩论，每天最多报2节，每周三16:00前在公告栏报名。';

export const BCEBU_COURSES: BCebuCourse[] = [
  { id: 'speed-esl', name: 'Speed ESL', tuition: 900, schedule: '4节一对一 + 2节小组课 + 2节选修课', suitable: '初级到高级学生', note: OPTIONAL_NOTE },
  { id: 'intensive-esl', name: 'Intensive ESL', tuition: 1050, schedule: '6节一对一 + 2节选修课', suitable: '想多上一对一的初级到高级学生', note: OPTIONAL_NOTE },
  { id: 'b-sparta', name: "B'Sparta 斯巴达", tuition: 1050, schedule: '4节一对一 + 2节小组课 + 3节斯巴达课程 + 2节晚自习', suitable: '想要严格管理、集中学习的学生', note: '每天早晚词汇课和晚自习必须参加；周一至周四不能外出，周五须本周全勤并通过至少3次每日词汇测试才能外出。' },
  { id: 'business-english', name: '商务英语', tuition: 1050, schedule: '4节一对一 + 2节小组课 + 2节选修课', suitable: '职场与商务英语', note: '' },
  { id: 'ielts', name: 'IELTS 雅思', tuition: 1000, schedule: '4节一对一 + 2节团体课 + 1节早间词汇／测试 + 2节模拟考试', suitable: '不熟悉雅思、准备系统学习的学生', note: '' },
  { id: 'ielts-sparta', name: 'IELTS Sparta 雅思斯巴达', tuition: 1050, schedule: '4节一对一 + 2节团体课 + 1节早间词汇／测试 + 2节模拟考试 + 2节晚自习', suitable: '想用斯巴达管理备考雅思的学生', note: '' },
  { id: BCEBU_IELTS_GUARANTEE_ID, name: 'IELTS Guarantee 雅思保证班', tuition: 1150, schedule: '4节一对一 + 2节团体课 + 1节早间词汇／测试 + 2节模拟考试', suitable: '已有雅思官方成绩、目标明确的学生', note: '每期12周，报名时需提供雅思官方成绩。' },
  { id: BCEBU_JUNIOR_COURSE_ID, name: 'Junior ESL 青少年英语', tuition: 1250, schedule: '6节一对一', suitable: '小学至初中学生', note: '不能参加选修课。高中生可报Junior ESL以外的课程，但学费按Junior ESL计算。' },
  { id: 'lite-esl4', name: 'Lite ESL 4', tuition: 750, schedule: '4节一对一', suitable: '喜欢慢节奏学习的学生', note: '不能参加选修课，不用参加月考。' },
  { id: BCEBU_LITE_40_COURSE_ID, name: 'Lite ESL 2（40岁以上）', tuition: 400, schedule: '2节一对一', suitable: '只限40岁以上学生', note: '不能参加选修课，不用参加月考。' },
  { id: BCEBU_KIDS_COURSE_ID, name: 'Kids Center 幼儿课程', tuition: 950, schedule: '08:30–12:20 / 13:30–17:00', suitable: '4–6岁、还没上小学的孩子', note: '须家长陪同，只可住双人间+客厅、双人间或三人间。' },
];

export const BCEBU_ROOMS: BCebuRoom[] = [
  { id: 'single-garden-view', name: '单人间（花园景）', group: '单人间', fee: 1350, note: '一人一间；50岁以上只可选单人间。' },
  { id: 'single-newtown-view', name: '单人间（外景）', group: '单人间', fee: 1400, note: '一人一间，窗外是马克坦新城方向；50岁以上只可选单人间。' },
  { id: 'double-living-room', name: '双人间+客厅', group: '双人间', fee: 1250, note: '旺季只接受家庭；夫妻、兄弟姐妹或朋友须同时报名，不接受个人入住。' },
  { id: 'family-triple-extra-bed', name: '双人间+客厅（亲子3人加床）', group: '双人间', fee: 1000, note: '亲子3人入住；旺季只接受家庭，不接受个人入住。' },
  { id: 'double', name: '双人间', group: '双人间', fee: 950, note: '两人一间。' },
  { id: 'two-plus-one', name: '2+1宿舍（女生）', group: '多人间', fee: 900, note: '两名女生和一位伙伴老师同住，周一至周四21:00–21:30在房间上宿舍课；只在淡季开放。' },
  { id: 'triple-bunk', name: '三人间', group: '多人间', fee: 750, note: '三人一间，上下铺。' },
];

/** Database course and room names (old content names) to ids, for the 4-week prices in the database. */
export const BCEBU_DATABASE_NAMES: Readonly<Record<string, string>> = {
  'Speed ESL': 'speed-esl',
  'Intensive ESL': 'intensive-esl',
  "B'SPARTA": 'b-sparta',
  '商务英语': 'business-english',
  'IELTS': 'ielts',
  'IELTS Sparta': 'ielts-sparta',
  'IELTS GUARANTEE': BCEBU_IELTS_GUARANTEE_ID,
  'Junior ESL': BCEBU_JUNIOR_COURSE_ID,
  'Lite ESL4': 'lite-esl4',
  'Lite ESL2（40岁以上）': BCEBU_LITE_40_COURSE_ID,
  '幼儿园': BCEBU_KIDS_COURSE_ID,
  '单人间外景（马克坦新城）': 'single-newtown-view',
  '单人间内景（校内花园）': 'single-garden-view',
  '双人间': 'double',
  '双人间+客厅': 'double-living-room',
  '双人间+客厅（加床亲子3人）': 'family-triple-extra-bed',
  '2+1宿舍（上下铺）': 'two-plus-one',
  '三人间（上下铺）': 'triple-bunk',
};

export const BCEBU_REGISTRATION_NOTE = '一次性费用，老学员返校免费';
/** The 2026 reporter offer, only for Monday entries inside the 2026 off-season windows. */
export const BCEBU_REPORTER_NOTE = '2026/2/16–6/29、8/17–12/28入学（周一），4周起，每周减25美元；每天多1节一对一。需有500粉丝以上的国内社交账号（小红书、抖音、快手等），每周发帖，每篇不少于100字；亲子家庭不参加。先按未减记者优惠的金额付款，完成活动毕业后退差价。';
export const BCEBU_LONG_STAY_TIERS: Readonly<Record<string, number>> = { 8: 50, 12: 100, 16: 200, 20: 300, 24: 400, 28: 500 };
export const BCEBU_LONG_STAY_NOTE = '按课程总周数：8–11周减50美元，12–15周100，16–19周200，20–23周300，24–27周400，28周起500美元；可与淡季折扣叠加。';
export const BCEBU_LOCAL_FEE_INTRO = '以下费用以比索计价，入学第一周周二至周五16:00前在二楼行政办公室缴纳；由学校及移民局收取，仅供准备现金参考，以到校实收为准。接机和可退押金另列，不计入合计。';
export const bcebuMultiplier = (weeks: number, ratios: Record<string, number> = { 1: 0.4, 2: 0.6, 3: 0.8 }): number =>
  ratios[String(weeks)] ?? weeks / 4;

/** Long-stay deduction for these course weeks: the largest tier the weeks reach. */
export const bcebuLongStay = (weeks: number, tiers: Readonly<Record<string, number>> = BCEBU_LONG_STAY_TIERS): number =>
  Object.entries(tiers)
    .map(([from, amount]) => ({ from: Number(from), amount }))
    .filter(tier => weeks >= tier.from)
    .reduce((best, tier) => tier.from > best.from ? tier : best, { from: 0, amount: 0 }).amount;
