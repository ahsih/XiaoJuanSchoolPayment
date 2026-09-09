export const BTES_WEEK_OPTIONS = Array.from({ length: 24 }, (_, index) => index + 1);

export interface BtesCourse {
  id: string;
  name: string;
  chineseName: string;
  category: 'General ESL' | 'Family' | '考试课程' | '商务英语' | '限时套餐';
  fee4w: number;
  walkInFee1w: number;
  lessons: string;
  suitable: string;
  minWeeks?: number;
  maxWeeks?: number;
  minimumScore?: string;
  ageMin?: number;
  ageMax?: number;
  allInOne?: boolean;
}

export interface BtesRoom {
  id: string;
  name: string;
  fee4w: number;
  electricityPerWeek: number;
  note: string;
  walkIn?: boolean;
}

export interface BtesLowSeasonPeriod {
  label: string;
  start: string;
  end: string;
}

export const BTES_COURSES: readonly BtesCourse[] = [
  {
    id: 'chill', name: 'Chill', chineseName: '轻量综合英语', category: 'General ESL', fee4w: 740, walkInFee1w: 230,
    lessons: '一对一4节：口说、听力、阅读、写作各1节；每日4节',
    suitable: '适合希望保留较多休息、自由活动或远程工作时间的成人。',
    ageMin: 15,
  },
  {
    id: 'speak-up', name: 'Speak Up', chineseName: '标准综合英语', category: 'General ESL', fee4w: 800, walkInFee1w: 250,
    lessons: '一对一4节＋小团体2节＋大团体2节；每日8节',
    suitable: '听、说、读、写均衡训练，是第一次菲律宾游学的标准选择。',
    ageMin: 15,
  },
  {
    id: 'speak-more', name: 'Speak More', chineseName: '口语强化英语', category: 'General ESL', fee4w: 900, walkInFee1w: 280,
    lessons: '一对一6节＋小团体1节＋大团体1节；每日8节',
    suitable: '适合想增加个人纠音、表达和弱项训练的一对一课量。',
    ageMin: 15,
  },
  {
    id: 'talkative', name: 'Talkative', chineseName: '密集一对一英语', category: 'General ESL', fee4w: 1000, walkInFee1w: 315,
    lessons: '一对一8节：口说4节、听力1节、阅读2节、写作1节；每日8节',
    suitable: '适合短期集中提升开口量、需要完全个别化学习节奏的成人。',
    ageMin: 15,
  },
  {
    id: 'junior-5-9', name: 'Junior (5-9Y)', chineseName: '儿童英语', category: 'Family', fee4w: 900, walkInFee1w: 280,
    lessons: '一对一4节＋团体课4节；每日8节',
    suitable: '5至9岁儿童基础ESL，采用互动和趣味教学；须配合监护与住宿规定。',
    ageMin: 5, ageMax: 9,
  },
  {
    id: 'junior-10-14', name: 'Junior (10-14Y)', chineseName: '青少年英语', category: 'Family', fee4w: 900, walkInFee1w: 280,
    lessons: '一对一4节＋团体课4节；每日8节',
    suitable: '10至14岁青少年课程，兼顾四项核心技能与团体互动。',
    ageMin: 10, ageMax: 14,
  },
  {
    id: 'parents', name: 'Parents / Guardian', chineseName: '家长／监护人英语', category: 'Family', fee4w: 740, walkInFee1w: 230,
    lessons: '一对一4节：口说、听力、阅读、写作各1节；每日4节',
    suitable: '供陪同孩子入学的家长或监护人选择；校内住宿不能选择单人房。',
    ageMin: 18,
  },
  {
    id: 'pre-toeic', name: 'Pre-TOEIC', chineseName: '托业预备班', category: '考试课程', fee4w: 980, walkInFee1w: 310,
    lessons: 'TOEIC一对一4节＋ESL团体课4节；每日8节',
    suitable: '适合尚未达到正规班门槛、需要先补听力阅读和基础能力的学生。',
    ageMin: 15,
  },
  {
    id: 'toeic', name: 'TOEIC', chineseName: '托业正规班', category: '考试课程', fee4w: 980, walkInFee1w: 310,
    lessons: 'TOEIC一对一4节＋大团体2节＋Clinic考题诊察2节；每日8节',
    suitable: '专注听力、阅读、文法词汇和题型分析；须至少报名4周。',
    minWeeks: 4, minimumScore: '入学门槛：TOEIC 500分；350-495分建议Pre-TOEIC。', ageMin: 15,
  },
  {
    id: 'pre-ielts', name: 'Pre-IELTS', chineseName: '雅思预备班', category: '考试课程', fee4w: 980, walkInFee1w: 310,
    lessons: 'IELTS一对一4节＋ESL团体课4节；每日8节',
    suitable: '适合雅思3.5分以下或需要先建立四项基础能力的学生。',
    ageMin: 15,
  },
  {
    id: 'ielts', name: 'IELTS', chineseName: '雅思正规班', category: '考试课程', fee4w: 980, walkInFee1w: 310,
    lessons: 'IELTS一对一4节＋团体课2节＋Clinic考题诊察2节；每日8节',
    suitable: '训练四项核心技能、文法词汇及应试策略；须至少报名4周。',
    minWeeks: 4, minimumScore: '入学门槛：IELTS 4.0；3.5分以下建议Pre-IELTS。', ageMin: 15,
  },
  {
    id: 'business', name: 'Business English', chineseName: '商务英语', category: '商务英语', fee4w: 980, walkInFee1w: 310,
    lessons: '一对一5节＋商务新闻、商务文法、演讲团体课各1节；每日8节',
    suitable: '适合职场沟通、国际行销、正式与非正式商业情境训练；4至12周。',
    minWeeks: 4, maxWeeks: 12, ageMin: 15,
  },
  {
    id: 'all-in-one', name: 'BTES ESL ALL IN ONE', chineseName: '四周全包限时套餐', category: '限时套餐', fee4w: 1000, walkInFee1w: 0,
    lessons: '一对一4节＋团体课2节；固定4周',
    suitable: '2026/08/23至2027/01/16完整就学、四人房；1,000美元包含课程、住宿、注册费及海报列明的当地费用。',
    minWeeks: 4, maxWeeks: 4, ageMin: 15, allInOne: true,
  },
] as const;

export const BTES_ROOMS: readonly BtesRoom[] = [
  { id: 'single', name: '单人房 / Single', fee4w: 1000, electricityPerWeek: 500, note: '独立空间；每间宿舍均有卫浴、空调、个人衣柜、书桌、全身镜等基本设备。' },
  { id: 'double', name: '双人房 / Twin', fee4w: 800, electricityPerWeek: 400, note: '双人入住；现有资料提示部分房间窗户朝向走廊，空房和实际采光须确认。' },
  { id: 'triple', name: '三人房 / Triple', fee4w: 750, electricityPerWeek: 300, note: '三人入住；房内有一张上下铺，实际床位安排须以学校分房为准。' },
  { id: 'quad', name: '四人房 / Quadruple', fee4w: 650, electricityPerWeek: 200, note: '四人入住，2026公开价中住宿成本最低的校内房型。' },
  { id: 'walk-in', name: '走读 / Walk-in（不住宿）', fee4w: 0, electricityPerWeek: 0, note: '只参加课程，不使用学校宿舍；按2026走读每周学费计算。', walkIn: true },
] as const;

export const BTES_LOW_SEASON_PERIODS: readonly BtesLowSeasonPeriod[] = [
  { label: '2026第一段淡季', start: '2026-01-30', end: '2026-06-13' },
  { label: '2026-2027第二段淡季', start: '2026-08-23', end: '2027-01-16' },
] as const;

export const BTES_ALL_IN_ONE_START = '2026-08-23';
export const BTES_ALL_IN_ONE_END = '2027-01-16';
export const BTES_REGISTRATION_FEE = 100;
export const BTES_SIDA_DISCOUNT_RATE = 0.95;
export const BTES_PHP_PER_CNY = 9;
export const BTES_SHORT_STAY_MULTIPLIERS: Readonly<Record<number, number>> = { 1: 0.4, 2: 0.65, 3: 0.85 };

export const BTES_HOLIDAYS_2026 = [
  ['2026/01/01', '元旦'], ['2026/02/17', '农历新年'], ['2026/02/24', '宿务市宪章日'],
  ['2026/03/20', '开斋节'], ['2026/04/02', '濯足节'], ['2026/04/03', '耶稣受难日'],
  ['2026/04/09', '勇士日'], ['2026/05/01', '劳动节'], ['2026/05/27', '宰牲节'],
  ['2026/06/12', '菲律宾独立日'], ['2026/08/06', '宿务省宪章日'], ['2026/08/21', '尼诺·阿基诺日'],
  ['2026/08/31', '国家英雄日'], ['2026/09/09', '奥斯梅尼亚日'], ['2026/11/02', '追思亡者节'],
  ['2026/11/30', '博尼法西奥日'], ['2026/12/08', '圣母无原罪日'], ['2026/12/24', '平安夜'],
  ['2026/12/25', '圣诞节'], ['2026/12/30', '黎刹日'], ['2026/12/31', '除夕'],
] as const;
