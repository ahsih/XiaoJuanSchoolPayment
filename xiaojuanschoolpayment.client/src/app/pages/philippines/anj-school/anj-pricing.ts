export const ANJ_WEEK_OPTIONS = [4, 8, 12, 16, 20, 24] as const;
export type AnjWeekOption = typeof ANJ_WEEK_OPTIONS[number];

export interface AnjCourse {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  fee4w?: number;
  feeByWeeks?: Partial<Record<AnjWeekOption, number>>;
  allowedWeeks?: readonly AnjWeekOption[];
}

export type AnjRoomPriceMode = 'per-person' | 'per-room';

export interface AnjRoom {
  id: string;
  name: string;
  note: string;
  fee4w: number;
  priceMode: AnjRoomPriceMode;
  minOccupancy: number;
  maxOccupancy: number;
  waterFee4w: number;
  waterGroup: 'Deluxe' | 'Premium / Villa' | 'Suite';
  deposit: number;
}

export interface AnjPromotionPeriod {
  label: string;
  start: string;
  end: string;
  regularDiscounts: Readonly<Partial<Record<AnjWeekOption, number>>>;
  lowSeasonPerFourWeeks: number;
}

export interface AnjContinuationPeriod {
  label: string;
  start: string;
  end: string;
  discounts: Readonly<Partial<Record<AnjWeekOption, number>>>;
}

export const ANJ_COURSES: readonly AnjCourse[] = [
  {
    id: 'eco-relax-lite',
    name: 'Eco Relax Lite',
    type: 'ESL / 轻量口语',
    lessons: '3节一对一课程 + 1次可选词汇测试 + 1节可选课程',
    suitable: '适合陪读家长、成人轻量学习、第一次游学或希望保留更多自习和生活时间的学生。',
    fee4w: 650,
  },
  {
    id: 'eco-relax-plus',
    name: 'Eco Relax Plus',
    type: 'ESL / 标准平衡',
    lessons: '3节一对一课程 + 2节团体课 + 前4周强制词汇测试 + 1节选修课程',
    suitable: '适合想兼顾一对一纠正和团体输出，强度适中但希望保持稳定学习节奏的学生。',
    fee4w: 750,
  },
  {
    id: 'eco-hub',
    name: 'Eco Hub（Speaking Accelerator / Work Booster / Navigator）',
    type: 'ESL / 目标轨道',
    lessons: '4节一对一课程 + 2节团体课 + 前4周强制词汇测试 + 1节选修课程',
    suitable: '可按Speaking Accelerator、Work Booster或Navigator方向选课，适合有明确使用场景的学生。',
    fee4w: 850,
  },
  {
    id: 'eco-sparta',
    name: 'Eco Sparta',
    type: 'ESL / 高强度',
    lessons: '6节一对一课程 + 1次强制词汇测试 + 1节选修课程',
    suitable: '适合想短期增加一对一训练量，并能接受密集日程和学习管理的学生。',
    fee4w: 1150,
  },
  {
    id: 'test-course',
    name: 'Test Course（IELTS / TOEIC / TOEFL / PTE）',
    type: '考试课程',
    lessons: '4节一对一课程 + 2节团体课 + 前4周强制词汇测试 + 1节选修课程 + 月考',
    suitable: '适合已有考试目标，希望通过专项训练、模考和弱项强化提升成绩的学生。',
    fee4w: 950,
  },
  {
    id: 'junior-esl',
    name: 'Junior ESL（7–15岁）',
    type: 'Junior / 标准',
    lessons: '4节一对一课程 + 2节团体课 + 强制词汇测试 + 1节选修课程',
    suitable: '适合7–15岁青少年；实际入学年龄、监护与住宿要求须由顾问向学校确认。',
    fee4w: 1300,
  },
  {
    id: 'junior-lite',
    name: 'Junior Lite（4–6岁）',
    type: 'Junior / 轻量',
    lessons: '3节一对一课程 + 1节选修课程',
    suitable: '适合4–6岁低龄学生先适应英文环境，课程强度相对轻。',
    fee4w: 900,
  },
  {
    id: 'junior-test',
    name: 'Junior Test Course（12–16岁，IELTS / TOEIC / TOEFL）',
    type: 'Junior / 考试',
    lessons: '4节一对一课程 + 2节团体课 + 强制词汇测试 + 1节选修课程',
    suitable: '适合准备IELTS、TOEIC或TOEFL的12–16岁学生；报名资格须由顾问向学校确认。',
    fee4w: 1350,
  },
  {
    id: 'toeic-guarantee',
    name: 'TOEIC保分班',
    type: '保证班 / TOEIC',
    lessons: '4节一对一课程 + 2节团体课 + 强制词汇测试 + 每天模拟测试',
    suitable: '12周课程费2,850美元；16周课程费3,800美元。保证条件、入学分数和出勤要求须另行确认。',
    feeByWeeks: { 12: 2850, 16: 3800 },
    allowedWeeks: [12, 16],
  },
  {
    id: 'ielts-guarantee',
    name: 'IELTS保分班',
    type: '保证班 / IELTS',
    lessons: '5节一对一课程 + 2节团体课 + 强制词汇测试 + 周考',
    suitable: '12/20/24周课程费分别为3,150/5,250/6,300美元；保证条件、入学分数和出勤要求须另行确认。',
    feeByWeeks: { 12: 3150, 20: 5250, 24: 6300 },
    allowedWeeks: [12, 20, 24],
  },
] as const;

const perPersonRoom = (
  id: string,
  name: string,
  fee4w: number,
  note: string,
  waterFee4w: number,
  waterGroup: AnjRoom['waterGroup'],
  deposit: number,
): AnjRoom => ({ id, name, fee4w, note, waterFee4w, waterGroup, deposit, priceMode: 'per-person', minOccupancy: 1, maxOccupancy: 1 });

const perRoom = (
  id: string,
  name: string,
  fee4w: number,
  note: string,
  minOccupancy: number,
  maxOccupancy: number,
  waterFee4w: number,
  waterGroup: AnjRoom['waterGroup'],
  deposit: number,
): AnjRoom => ({ id, name, fee4w, note, minOccupancy, maxOccupancy, waterFee4w, waterGroup, deposit, priceMode: 'per-room' });

export const ANJ_ROOMS: readonly AnjRoom[] = [
  perPersonRoom('deluxe-single', '单人房（Deluxe）', 1450, 'Deluxe单人房，适合重视隐私与独立学习空间的学生。', 2500, 'Deluxe', 3000),
  perPersonRoom('deluxe-twin', '双人房（Deluxe）', 950, 'Deluxe双人房，适合朋友同行或希望兼顾预算与舒适度的学生。', 2500, 'Deluxe', 3000),
  perPersonRoom('deluxe-triple', '三人房（Deluxe）', 800, 'Deluxe三人房，属于本期住宿价格最低的每人房型。', 2500, 'Deluxe', 3000),
  perPersonRoom('premium-single', '单人房（Pre）', 1650, 'Premium单人房，适合长期学习或需要安静恢复空间的学生。', 3500, 'Premium / Villa', 5000),
  perPersonRoom('premium-twin', '双人房（Pre）', 1150, 'Premium双人房，适合对房间舒适度要求更高的同行学生。', 3500, 'Premium / Villa', 5000),
  perRoom('premium-suite', '套房（Pre，1–2人）', 2100, '可住1–2人，限同性居住；配有空调、浴缸和吹风机，按整间总价计算。', 1, 2, 4000, 'Suite', 5000),
  perPersonRoom('premium-studio-single', '单人房（Pre Studio）', 1650, 'Premium Studio单人房，适合重视隐私与独立空间的学生。', 3500, 'Premium / Villa', 5000),
  perPersonRoom('premium-studio-twin', '双人房（Pre Studio）', 1150, 'Premium Studio双人房，适合同行学生。', 3500, 'Premium / Villa', 5000),
  perRoom('premium-studio-triple-use', '三人入住（Pre Studio）', 3700, '三人共同入住的整间4周总价，仅在三名学生选择相同日期时计收一次。', 3, 3, 3500, 'Premium / Villa', 5000),
  perRoom('premium-studio-quad-use', '四人入住（Pre Studio）', 4600, '四人共同入住的整间4周总价，仅在四名学生选择相同日期时计收一次。', 4, 4, 3500, 'Premium / Villa', 5000),
  perPersonRoom('eco-villa-single', '单人房（别墅）', 2300, '独栋别墅单人房，适合重视独立性和自然住宿体验的学生。', 3500, 'Premium / Villa', 5000),
  perRoom('eco-villa-exclusive-twin', '独栋别墅双人入住', 2700, '双人独享整栋别墅的4周总价，仅在两名学生选择相同日期时计收一次。', 2, 2, 3500, 'Premium / Villa', 5000),
  perRoom('eco-villa-exclusive-triple', '独栋别墅三人入住', 3700, '三人独享整栋别墅的4周总价，仅在三名学生选择相同日期时计收一次。', 3, 3, 3500, 'Premium / Villa', 5000),
] as const;

const julyRates = { 4: 0, 8: 0, 12: 200, 16: 300, 20: 400, 24: 500 } as const;
const augustRates = { 4: 50, 8: 150, 12: 300, 16: 450, 20: 600, 24: 750 } as const;
const winterRates = { 4: 0, 8: 100, 12: 200, 16: 300, 20: 400, 24: 500 } as const;

export const ANJ_NEW_PROMOTION_PERIODS: readonly AnjPromotionPeriod[] = [
  { label: '2026年7月常规优惠', start: '2026-07-01', end: '2026-07-31', regularDiscounts: julyRates, lowSeasonPerFourWeeks: 0 },
  { label: '2026年8月1–22日常规优惠', start: '2026-08-01', end: '2026-08-22', regularDiscounts: augustRates, lowSeasonPerFourWeeks: 0 },
  { label: '2026年8月23–31日常规及淡季优惠', start: '2026-08-23', end: '2026-08-31', regularDiscounts: augustRates, lowSeasonPerFourWeeks: 100 },
  { label: '2026年9月常规及淡季优惠', start: '2026-09-01', end: '2026-09-30', regularDiscounts: augustRates, lowSeasonPerFourWeeks: 100 },
  { label: '2026年10月常规及淡季优惠', start: '2026-10-01', end: '2026-10-31', regularDiscounts: augustRates, lowSeasonPerFourWeeks: 100 },
  { label: '2026年11月常规及淡季优惠', start: '2026-11-01', end: '2026-11-30', regularDiscounts: augustRates, lowSeasonPerFourWeeks: 100 },
  { label: '2026年12月常规及淡季优惠', start: '2026-12-01', end: '2026-12-31', regularDiscounts: winterRates, lowSeasonPerFourWeeks: 100 },
  { label: '2027年1月1–9日常规及淡季优惠', start: '2027-01-01', end: '2027-01-09', regularDiscounts: winterRates, lowSeasonPerFourWeeks: 100 },
  { label: '2027年1月10日–2月28日常规优惠', start: '2027-01-10', end: '2027-02-28', regularDiscounts: winterRates, lowSeasonPerFourWeeks: 0 },
  { label: '2027年3月1日–6月20日淡季优惠', start: '2027-03-01', end: '2027-06-20', regularDiscounts: {}, lowSeasonPerFourWeeks: 300 },
] as const;

export const ANJ_CONTINUATION_PERIODS: readonly AnjContinuationPeriod[] = [
  { label: '2026/07/01–2027/02/28续课优惠', start: '2026-07-01', end: '2027-02-28', discounts: { 4: 50, 8: 100, 12: 200, 16: 300, 20: 400, 24: 500 } },
  { label: '2027/03/01–06/20续课优惠', start: '2027-03-01', end: '2027-06-20', discounts: { 4: 300, 8: 600, 12: 900, 16: 1200, 20: 1500, 24: 1800 } },
] as const;

export const ANJ_PEAK_SEASON_RANGES = [
  { label: '2026旺季', start: '2026-06-28', end: '2026-08-22' },
  { label: '2027旺季（按相同8周星期推算）', start: '2027-06-27', end: '2027-08-21' },
] as const;

export const ANJ_REGISTRATION_FEE = 100;
export const ANJ_SIDA_DISCOUNT_RATE = 0.95;
export const ANJ_SEASONAL_FEE_PER_WEEK = 40;
export const ANJ_BIRTHDAY_DISCOUNT = 100;
export const ANJ_BIRTHDAY_REGISTRATION_START = '2025-12-15';
export const ANJ_PHP_PER_CNY = 9;
