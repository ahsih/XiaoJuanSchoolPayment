export const IMS_WEEK_OPTIONS = [1, 2, 3, 4, 8, 12, 16, 20, 24] as const;
export type ImsWeekOption = typeof IMS_WEEK_OPTIONS[number];

export interface ImsCourse {
  id: string;
  name: string;
  category: 'ESL' | '专项课程' | 'TOEIC' | 'IELTS' | 'TOEFL' | 'SAT' | '亲子课程';
  schedule: string;
  suitable: string;
  prices: Partial<Record<ImsWeekOption, number>>;
  allowedWeeks: readonly ImsWeekOption[];
}

export interface ImsRoom {
  id: string;
  name: string;
  note: string;
  prices: Record<ImsWeekOption, number>;
}

const all = (...prices: number[]): Record<ImsWeekOption, number> => Object.fromEntries(
  IMS_WEEK_OPTIONS.map((weeks, index) => [weeks, prices[index]]),
) as Record<ImsWeekOption, number>;

const course = (
  id: string,
  name: string,
  category: ImsCourse['category'],
  schedule: string,
  suitable: string,
  prices: Partial<Record<ImsWeekOption, number>>,
): ImsCourse => ({ id, name, category, schedule, suitable, prices, allowedWeeks: IMS_WEEK_OPTIONS.filter((week) => prices[week] !== undefined) });

const price850 = all(255, 510, 680, 850, 1700, 2550, 3400, 4250, 5100);
const price1000 = all(300, 600, 800, 1000, 2000, 3000, 4000, 5000, 6000);
const price1100 = all(330, 660, 880, 1100, 2200, 3300, 4400, 5500, 6600);
const price1400 = all(420, 840, 1120, 1400, 2800, 4200, 5600, 7000, 8400);

/** Authoritative transcription of the September 2026 IMS China USD price list. */
export const IMS_COURSES: readonly ImsCourse[] = [
  course('premium-esl', 'Premium ESL', 'ESL', '每天4节一对一 + 4节团体课', '希望兼顾个别纠正、互动输出和全天学习节奏的成人学生。', price850),
  course('intensive-esl', 'Intensive ESL', 'ESL', '每天6节一对一 + 3节团体课', '短期希望增加一对一密度、强化口语输出的成人学生。', price1000),
  course('essential-esl-4', 'Essential ESL 4', 'ESL', '每天4节一对一', '希望以一对一基础训练为主，同时保留自习和生活时间。', all(210, 420, 560, 700, 1400, 2100, 2800, 3500, 4200)),
  course('essential-esl-5', 'Essential ESL 5', 'ESL', '每天5节一对一', '希望提高一对一课量、但不参加固定团体课的成人学生。', price850),
  course('essential-esl-6', 'Essential ESL 6', 'ESL', '每天6节一对一', '喜欢纯一对一密集训练、希望按弱项灵活排课的成人学生。', price1000),
  course('senior-esl', 'Senior ESL', 'ESL', '每天5节一对一，或4节一对一 + 1节团体课', '50岁以上熟龄学生、旅行英语或较温和学习节奏。', all(240, 480, 640, 800, 1600, 2400, 3200, 4000, 4800)),
  course('working-holiday', 'Working Holiday', '专项课程', '每天4节一对一 + 4节团体课', '准备打工度假、求职面试和职场沟通的学生。', price1000),
  course('business-english', 'Business English', '专项课程', '每天4节一对一 + 4节团体课', '商务沟通、会议、演示和职场写作需求。', price1000),
  course('power-speaking', 'Power Speaking', '专项课程', '每天4节一对一 + 4节团体课', '希望集中提升表达组织和开口流利度的学生。', all(315, 630, 840, 1050, 2100, 3150, 4200, 5250, 6300)),
  course('mommy-tesol', 'Mommy TESOL', '专项课程', '每天4节一对一', '希望学习亲子英语教学方法和家庭英文引导的家长。', price850),
  course('tesol-light', 'TESOL Light', '专项课程', '每天5节一对一', '希望接触英语教学方法、以一对一课程为主的学生。', all(270, 540, 720, 900, 1800, 2700, 3600, 4500, 5400)),
  course('toeic-speaking', 'TOEIC Speaking', '专项课程', '每天4节一对一 + 4节团体课', '准备TOEIC Speaking专项训练的学生。', price1100),
  course('opic', 'OPIC', '专项课程', '每天4节一对一 + 4节团体课', '准备OPIc口语考试和情景表达的学生。', price1100),
  course('pre-toeic', 'Pre-TOEIC', 'TOEIC', '每天4节一对一 + 4节团体课', '需要先建立TOEIC词汇、题型和基础能力的学生。', price1100),
  course('toeic', 'TOEIC', 'TOEIC', '每天4节一对一 + 4节团体课', '有明确TOEIC备考目标的学生。', price1100),
  course('toeic-guarantee', 'TOEIC Guarantee', 'TOEIC', '每天4节一对一 + 4节团体课', '至少12周；入学成绩、出勤和保分条件须由学校确认。', { 12: 3450, 16: 4550, 20: 5650, 24: 6900 }),
  course('pre-ielts', 'Pre-IELTS', 'IELTS', '每天4节一对一 + 4节团体课', '需要先建立雅思基础和题型认识的学生。', price1100),
  course('ielts', 'IELTS', 'IELTS', '每天4节一对一 + 4节团体课', '有明确雅思备考目标的学生。', price1100),
  course('ielts-guarantee', 'IELTS Guarantee', 'IELTS', '每天4节一对一 + 4节团体课', '至少12周；入学成绩、出勤和保分条件须由学校确认。', { 12: 3600, 16: 4700, 20: 5800, 24: 7200 }),
  course('pre-toefl', 'Pre-TOEFL', 'TOEFL', '每天4节一对一 + 4节团体课', '需要先建立TOEFL基础和题型认识的学生。', price1400),
  course('intensive-toefl', 'Intensive TOEFL', 'TOEFL', '每天4节一对一 + 4节团体课', '有明确TOEFL备考目标、需要密集训练的学生。', price1400),
  course('sat', 'SAT', 'SAT', '每天6节一对一', '准备SAT考试、需要学术英语与题型训练的学生。', price1400),
  course('junior-esl-6', 'Junior ESL 6', '亲子课程', '每天6节一对一', '青少年标准课程；可接收一名家长转来的3节一对一，最终最多9节。', all(390, 780, 1040, 1300, 2600, 3900, 5200, 6500, 7800)),
  course('junior-esl-8', 'Junior ESL 8', '亲子课程', '每天8节一对一', '需要更高一对一课量的青少年；不能再接收家长转课。', all(510, 1020, 1360, 1700, 3400, 5100, 6800, 8500, 10200)),
  course('junior-esl-9', 'Junior ESL 9', '亲子课程', '每天9节一对一', '每天一对一课量已达学校上限；不能再接收家长转课。', all(570, 1140, 1520, 1900, 3800, 5700, 7600, 9500, 11400)),
  course('parents-esl', 'Parents ESL', '亲子课程', '每天3节一对一 + 1节团体课', '亲子报名家长必须本人注册并购买；一对一可按规则转给Junior ESL 6孩子。', all(240, 480, 640, 800, 1600, 2400, 3200, 4000, 4800)),
] as const;

export const IMS_ROOMS: readonly ImsRoom[] = [
  { id: 'single', name: '单人房', note: '校内单人住宿；实际空房按入学日期与性别确认。', prices: all(300, 600, 800, 1000, 2000, 3000, 4000, 5000, 6000) },
  { id: 'double', name: '双人房', note: '校内双人住宿；适合朋友或家人同行。', prices: all(255, 510, 680, 850, 1700, 2550, 3400, 4250, 5100) },
  { id: 'triple', name: '三人房', note: '兼顾预算与空间的校内多人房。', prices: all(210, 420, 560, 700, 1400, 2100, 2800, 3500, 4200) },
  { id: 'quadruple', name: '四人房', note: '价目表中预算最低的校内多人房。', prices: all(195, 390, 520, 650, 1300, 1950, 2600, 3250, 3900) },
] as const;

export const IMS_REGISTRATION_FEE = 100;
export const IMS_SIDA_RATE = 0.95;
export const IMS_PHP_PER_CNY = 8;

export const IMS_LONG_STAY_DISCOUNTS = [
  { min: 8, max: 11, amount: 50 },
  { min: 12, max: 15, amount: 100 },
  { min: 16, max: 19, amount: 200 },
  { min: 20, max: 23, amount: 300 },
  { min: 24, max: 27, amount: 400 },
] as const;

export const IMS_OFF_SEASON_EXCLUDED_MONTHS = [1, 6, 7, 8] as const;

export const IMS_OFF_SEASON_SOCIAL_REQUIREMENTS = [
  '制作并发布在校4周生活合集视频。',
  '在小红书等主流媒体发布3篇符合学校要求的帖子。',
  '配合学校安排拍摄采访视频。',
  '发布内容须使用学校指定的官方话题标签；具体账号、发布时间和审核要求由学校确认。',
] as const;

export const IMS_OFF_SEASON_CLASS_EXCHANGE_PERIODS = [
  { start: '2026-09-11', end: '2026-12-31' },
  { start: '2027-02-01', end: '2027-05-30' },
] as const;

export const IMS_OFFICIAL_LOCAL_TOTALS: Readonly<Record<number, number>> = {
  1: 20550, 2: 21800, 3: 23050, 4: 24300, 5: 30600, 6: 31850,
  7: 33100, 8: 34350, 9: 46400, 10: 47650, 11: 48900, 12: 50150,
  13: 55850, 14: 57100, 15: 58350, 16: 59600, 17: 65300, 18: 66550,
  19: 67800, 20: 69050, 21: 74750, 22: 76000, 23: 77250, 24: 78500,
};

export const IMS_ADDITIONAL_CLASSES = [
  { id: 'esl-one-to-one', name: 'ESL额外一对一', price4w: 150 },
  { id: 'esl-group', name: 'ESL额外团体课', price4w: 120 },
  { id: 'esl-group-to-one', name: 'ESL团体课转一对一', price4w: 100 },
  { id: 'special-one-to-one', name: 'Special额外一对一', price4w: 200 },
  { id: 'special-group', name: 'Special额外团体课', price4w: 150 },
  { id: 'special-group-to-one', name: 'Special团体课转一对一', price4w: 130 },
] as const;
