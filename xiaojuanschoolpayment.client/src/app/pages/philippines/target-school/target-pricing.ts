export type TargetRoomId = 'single' | 'twin' | 'triple' | 'quad' | 'six';
export type TargetPriceGroup = 'lite4' | 'target4' | 'target5' | 'target6' | 'ultimate8';
export type TargetCourseId =
  | 'lite4'
  | 'target4'
  | 'target5'
  | 'working-holiday'
  | 'target6'
  | 'ultimate8'
  | 'ielts-regular'
  | 'ielts-guarantee';

export interface TargetCourseOption {
  id: TargetCourseId;
  priceGroup: TargetPriceGroup;
  name: string;
  type: string;
  arrangement: string;
  suitable: string;
  note: string;
}

export interface TargetRoomOption {
  id: TargetRoomId;
  name: string;
  note: string;
}

export const TARGET_OFFICIAL_PRICE_WEEKS = [1, 2, 3, 4, 6, 8, 12] as const;
export const TARGET_QUOTE_WEEK_OPTIONS = Array.from({ length: 52 }, (_, index) => index + 1);

export const TARGET_COURSES: readonly TargetCourseOption[] = [
  {
    id: 'lite4', priceGroup: 'lite4', name: 'Lite 4', type: 'ESL／亲子监护人可报名',
    arrangement: '一对一课程 × 4节',
    suitable: '适合希望控制预算、以一对一课程为主的学生，也可用于亲子游学监护人报名。',
    note: '亲子课程仅接受6岁及以上学生；如没有足够的团体课同学，学校会提供相应节数的一对一课程。',
  },
  {
    id: 'target4', priceGroup: 'target4', name: 'TARGET 4', type: 'ESL／均衡安排',
    arrangement: '一对一课程 × 4节＋团体课 × 3节＋自习课 × 1节',
    suitable: '适合希望兼顾一对一输入、团体输出和自习时间的学生。',
    note: '课程与Working Holiday、TARGET 5等分类分开选择，避免相同价格造成课程混淆。',
  },
  {
    id: 'target5', priceGroup: 'target5', name: 'TARGET 5', type: 'ESL／热门标准',
    arrangement: '一对一课程 × 5节＋团体课 × 2节＋自习课 × 1节',
    suitable: '适合希望增加一对一课程，同时保留团体课和自习时间的学生。',
    note: '与Working Holiday共用学校套餐价，但仍作为独立课程显示和选择。',
  },
  {
    id: 'working-holiday', priceGroup: 'target5', name: 'Working Holiday', type: '打工度假准备',
    arrangement: '一对一课程 × 5节＋团体课 × 2节＋自习课 × 1节',
    suitable: '适合准备英语面试、英文履历和海外工作生活沟通的学生。',
    note: '与TARGET 5共用学校套餐价，但课程方向不同，报价时单独选择。',
  },
  {
    id: 'target6', priceGroup: 'target6', name: 'TARGET 6', type: 'ESL／短期强化',
    arrangement: '一对一课程 × 6节＋团体课 × 2节',
    suitable: '适合短期学习、希望提高一对一课程密度的学生。',
    note: '限时升级活动列明可由TARGET 6升级至ULTIMATE 8或符合条件的IELTS课程。',
  },
  {
    id: 'ultimate8', priceGroup: 'ultimate8', name: 'TARGET ULTIMATE 8', type: '全一对一强化',
    arrangement: '一对一课程 × 8节',
    suitable: '适合短期集中学习、希望最大化一对一课程数量的学生。',
    note: '与IELTS课程共用学校套餐价，但课程内容和资格要求不同。',
  },
  {
    id: 'ielts-regular', priceGroup: 'ultimate8', name: 'IELTS Regular', type: '雅思常规班',
    arrangement: '一对一课程 × 5节＋团体课 × 2节＋自习课 × 1节',
    suitable: '适合希望系统提升雅思成绩、但不参加分数保证方案的学生。',
    note: '与ULTIMATE 8及IELTS Guarantee共用学校套餐价，报价时单独选择。',
  },
  {
    id: 'ielts-guarantee', priceGroup: 'ultimate8', name: 'IELTS Guarantee', type: '雅思保证班',
    arrangement: '一对一课程 × 5节＋团体课 × 2节＋自习课 × 1节',
    suitable: '适合满足学校入学等级并参加12周雅思分数保证方案的学生。',
    note: '仅按12周方案报价；入学等级、出勤、考试及保证条件须由学校审核确认。',
  },
];

export const TARGET_ROOMS: readonly TargetRoomOption[] = [
  { id: 'single', name: '单人房', note: '隐私较高，房位需尽早确认。' },
  { id: 'twin', name: '双人房', note: '适合同行朋友或希望减少室友人数的学生。' },
  { id: 'triple', name: '三人房', note: '预算和住宿人数较均衡。' },
  { id: 'quad', name: '四人房（上下铺）', note: '多人房，采用上下铺。' },
  { id: 'six', name: '六人房（上下铺）', note: '学校价目表中价格最低的多人房。' },
];

type OfficialWeek = typeof TARGET_OFFICIAL_PRICE_WEEKS[number];
type PriceRow = Record<OfficialWeek, number>;
type PriceGrid = Record<TargetRoomId, PriceRow>;

const row = (one: number, two: number, three: number, four: number, six: number, eight: number, twelve: number): PriceRow => ({
  1: one, 2: two, 3: three, 4: four, 6: six, 8: eight, 12: twelve,
});

/** School package prices effective for applications from 2026-07-10. */
export const TARGET_PACKAGE_PRICES: Record<TargetPriceGroup, PriceGrid> = {
  lite4: {
    single: row(712, 1068, 1424, 1780, 2670, 3560, 5340),
    twin: row(608, 912, 1216, 1520, 2280, 3040, 4560),
    triple: row(568, 852, 1136, 1420, 2130, 2840, 4260),
    quad: row(544, 816, 1088, 1360, 2040, 2720, 4080),
    six: row(512, 768, 1024, 1280, 1920, 2560, 3840),
  },
  target4: {
    single: row(736, 1104, 1472, 1840, 2760, 3680, 5520),
    twin: row(632, 948, 1264, 1580, 2370, 3160, 4740),
    triple: row(592, 888, 1184, 1480, 2220, 2960, 4440),
    quad: row(568, 852, 1136, 1420, 2130, 2840, 4260),
    six: row(536, 804, 1072, 1340, 2010, 2680, 4020),
  },
  target5: {
    single: row(760, 1140, 1520, 1900, 2850, 3800, 5700),
    twin: row(656, 984, 1312, 1640, 2460, 3280, 4920),
    triple: row(616, 924, 1232, 1540, 2310, 3080, 4620),
    quad: row(592, 888, 1184, 1480, 2220, 2960, 4440),
    six: row(560, 840, 1120, 1400, 2100, 2800, 4200),
  },
  target6: {
    single: row(808, 1212, 1616, 2020, 3030, 4040, 6060),
    twin: row(704, 1056, 1408, 1760, 2640, 3520, 5280),
    triple: row(664, 996, 1328, 1660, 2490, 3320, 4980),
    quad: row(640, 960, 1280, 1600, 2400, 3200, 4800),
    six: row(608, 912, 1216, 1520, 2280, 3040, 4560),
  },
  ultimate8: {
    single: row(872, 1308, 1744, 2180, 3270, 4360, 6540),
    twin: row(768, 1152, 1536, 1920, 2880, 3840, 5760),
    triple: row(728, 1092, 1456, 1820, 2730, 3640, 5460),
    quad: row(704, 1056, 1408, 1760, 2640, 3520, 5280),
    six: row(672, 1008, 1344, 1680, 2520, 3360, 5040),
  },
};

export function targetCourse(id: string): TargetCourseOption | undefined {
  return TARGET_COURSES.find((course) => course.id === id);
}

export function targetRoom(id: string): TargetRoomOption | undefined {
  return TARGET_ROOMS.find((roomOption) => roomOption.id === id);
}

export function targetOfficialPackagePrice(courseId: TargetCourseId, roomId: TargetRoomId, weeks: number): number {
  const course = targetCourse(courseId);
  if (!course) return 0;
  const grid = TARGET_PACKAGE_PRICES[course.priceGroup][roomId];
  if ((TARGET_OFFICIAL_PRICE_WEEKS as readonly number[]).includes(weeks)) return grid[weeks as OfficialWeek];
  return grid[4] * weeks / 4;
}

/**
 * When a student changes course or room, the school uses the price tier for the
 * student's total duration and prorates that tier across each package segment.
 */
export function targetPackageSegmentPrice(
  courseId: TargetCourseId,
  roomId: TargetRoomId,
  totalWeeks: number,
  segmentWeeks: number,
): number {
  const tierWeeks = totalWeeks <= 1 ? 1 : totalWeeks === 2 ? 2 : totalWeeks === 3 ? 3 : 4;
  return targetOfficialPackagePrice(courseId, roomId, tierWeeks) / tierWeeks * segmentWeeks;
}

export function targetCampaignRate(totalWeeks: number): number {
  if (totalWeeks === 3) return 20;
  if (totalWeeks >= 4 && totalWeeks <= 11) return 30;
  if (totalWeeks >= 12) return 35;
  return 0;
}
