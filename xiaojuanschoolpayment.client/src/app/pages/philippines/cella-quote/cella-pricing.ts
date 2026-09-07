export type CellaCampus = 'uni' | 'premium';
export type CellaEnrollmentStatus = 'new' | 'transfer' | 'extension';
export type CellaPromotionMode = 'standard' | 'social-6-plus-2' | 'social-9-plus-3';

export interface CellaCourse {
  id: string;
  campus: CellaCampus;
  name: string;
  tuition: number;
  lessons: string;
  note: string;
  needsConfirmation?: boolean;
  familyPackage?: CellaFamilyPackage;
}

export interface CellaRoom {
  id: string;
  campus: CellaCampus;
  name: string;
  fee: number;
  note: string;
  lowSeasonEligible: boolean;
  socialEligible: boolean;
  premiumSixPerson?: boolean;
}

export interface CellaFamilyPackage {
  id: string;
  room: string;
  occupants: string;
  prices: Record<4 | 6 | 8, number>;
}

export const CELLA_CAMPUS_NAMES: Record<CellaCampus, string> = {
  uni: 'CELLA Uni Sparta Campus',
  premium: 'CELLA Premium Campus',
};

export const CELLA_REGISTRATION_FEE = 150;
export const CELLA_PEAK_SEASON_WEEKLY_FEE = 40;
export const CELLA_LOW_SEASON_START = '2026-08-30';
export const CELLA_LOW_SEASON_END = '2027-01-02';

export const CELLA_FAMILY_PACKAGE_NOTE = '整包价包含注册费、课程费、住宿费，以及SSP、电子卡、电费、水费、管理费、洗衣、周日接机、学生证和教材等附件列明的当地费用；不含汇款手续费及额外电费。家庭成员年龄、课程组合、床位、Main／Alicia安排和空房需向学校确认。';

export const CELLA_FAMILY_PACKAGES: readonly CellaFamilyPackage[] = [
  { id: 'premium-family-twin', room: 'Main／Alicia双人家庭房', occupants: '家庭组合需确认', prices: { 4: 5600, 6: 8400, 8: 11000 } },
  { id: 'premium-family-triple', room: 'Main／Alicia三人家庭房', occupants: '家庭组合需确认', prices: { 4: 8750, 6: 13125, 8: 17300 } },
  { id: 'premium-family-quad-2-2', room: 'Main／Alicia四人家庭房', occupants: '2位监护人＋2位青少年', prices: { 4: 10700, 6: 16050, 8: 21200 } },
  { id: 'premium-family-quad-1-3', room: 'Main／Alicia四人家庭房', occupants: '1位监护人＋3位青少年', prices: { 4: 11200, 6: 16800, 8: 22200 } },
];

export const CELLA_COURSES: readonly CellaCourse[] = [
  {
    id: 'uni-power-speaking-1', campus: 'uni', name: 'Power Speaking 1', tuition: 930,
    lessons: '4节一对一课程＋3节小组课＋1节大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: '2026年4周课程费。',
  },
  {
    id: 'uni-power-speaking-2', campus: 'uni', name: 'Power Speaking 2', tuition: 1080,
    lessons: '6节一对一课程＋1节小组课＋1节大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: '2026年4周课程费。',
  },
  {
    id: 'uni-toeic-pre', campus: 'uni', name: 'TOEIC Pre', tuition: 1080,
    lessons: '4节一对一课程＋3节ESL小组课＋1节ESL大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: '2026年4周课程费。',
  },
  {
    id: 'uni-toeic-intensive', campus: 'uni', name: 'TOEIC Intensive', tuition: 1180,
    lessons: '4节一对一课程＋3节小组课＋1节大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: '2026年4周课程费。',
  },
  {
    id: 'uni-ielts-pre', campus: 'uni', name: 'IELTS Pre', tuition: 1080,
    lessons: '4节一对一课程＋3节ESL小组课＋1节ESL大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: '2026年4周课程费。',
  },
  {
    id: 'uni-ielts-intensive', campus: 'uni', name: 'IELTS Intensive', tuition: 1180,
    lessons: '4节一对一课程＋3节小组课＋1节大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: '2026年4周课程费。',
  },
  {
    id: 'uni-ielts-guarantee', campus: 'uni', name: 'IELTS Guarantee', tuition: 1380,
    lessons: '6节一对一课程＋1节小组课＋1节大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: '保证班入学条件、保证分数及指定入学日需向学校确认。', needsConfirmation: true,
  },
  {
    id: 'uni-tesol', campus: 'uni', name: 'TESOL', tuition: 1730,
    lessons: '6节2:8课程＋2节线上学习＋晚课＋跟读训练＋选修课＋自习',
    note: '有固定入学时间，报名前需向学校确认。', needsConfirmation: true,
  },
  {
    id: 'premium-light-esl', campus: 'premium', name: 'Light ESL', tuition: 830,
    lessons: '3节一对一课程＋1节8人大团体课＋自习课',
    note: '2026年4周课程费。',
  },
  {
    id: 'premium-power-speaking-1', campus: 'premium', name: 'Power Speaking 1', tuition: 930,
    lessons: '4节一对一课程＋3节4人小组课＋1节8人大团体课＋2节自习课',
    note: '2026年4周课程费。',
  },
  {
    id: 'premium-power-speaking-2', campus: 'premium', name: 'Power Speaking 2', tuition: 1080,
    lessons: '6节一对一课程＋1节4人小组课＋1节8人大团体课＋2节自习课',
    note: '2026年4周课程费。',
  },
  {
    id: 'premium-business-preparation', campus: 'premium', name: 'Business Preparation', tuition: 1080,
    lessons: '4节一对一课程＋3节4人ESL小组课＋1节8人ESL团体课＋2节自习课',
    note: '2026年4周课程费。',
  },
  {
    id: 'premium-business-intensive', campus: 'premium', name: 'Business Intensive', tuition: 1180,
    lessons: '4节一对一课程＋4节4人小组课＋2节自习课',
    note: '2026年4周课程费。',
  },
  {
    id: 'premium-ace', campus: 'premium', name: 'ACE 空乘英语', tuition: 1180,
    lessons: '4节一对一课程＋3节4人小组课＋1节8人大团体课＋2节自习课',
    note: '空乘类课程；入学条件及开课日期需向学校确认。', needsConfirmation: true,
  },
  {
    id: 'premium-working-holiday', campus: 'premium', name: 'Working Holiday', tuition: 930,
    lessons: '3节一对一课程＋4节小组课＋可选实习训练',
    note: '本次附件未列2026课程价格，暂保留页面现有参考价；正式报价需向学校确认。', needsConfirmation: true,
  },
  ...CELLA_FAMILY_PACKAGES.map((familyPackage) => ({
    id: familyPackage.id,
    campus: 'premium' as const,
    name: `Family Package｜${familyPackage.room}｜${familyPackage.occupants}`,
    tuition: familyPackage.prices[4],
    lessons: '家庭成员课程、家庭房及附件列明的当地费用整包报价',
    note: CELLA_FAMILY_PACKAGE_NOTE,
    needsConfirmation: true,
    familyPackage,
  })),
];

export const CELLA_ROOMS: readonly CellaRoom[] = [
  { id: 'uni-single', campus: 'uni', name: 'Uni单人间', fee: 1300, lowSeasonEligible: true, socialEligible: false, note: 'Uni校内单人间。' },
  { id: 'uni-twin', campus: 'uni', name: 'Uni双人间', fee: 900, lowSeasonEligible: true, socialEligible: false, note: 'Uni校内双人间。' },
  { id: 'uni-triple', campus: 'uni', name: 'Uni三人间', fee: 800, lowSeasonEligible: true, socialEligible: false, note: 'Uni校内三人间。' },
  { id: 'uni-quad', campus: 'uni', name: 'Uni四人间', fee: 700, lowSeasonEligible: true, socialEligible: true, note: '6+2／9+3活动指定房型。' },
  { id: 'uni-jdn-single', campus: 'uni', name: 'JDN校外单人间', fee: 1300, lowSeasonEligible: true, socialEligible: false, note: 'JDN校外宿舍；空房与接驳需确认。' },
  { id: 'uni-jdn-twin', campus: 'uni', name: 'JDN校外双人间', fee: 900, lowSeasonEligible: true, socialEligible: false, note: 'JDN校外宿舍；空房与接驳需确认。' },
  { id: 'uni-jdn-triple', campus: 'uni', name: 'JDN校外三人间', fee: 800, lowSeasonEligible: true, socialEligible: false, note: 'JDN校外宿舍；空房与接驳需确认。' },
  { id: 'premium-single', campus: 'premium', name: 'Premium单人间', fee: 1600, lowSeasonEligible: true, socialEligible: false, note: 'Premium校内单人间。' },
  { id: 'premium-semi-single', campus: 'premium', name: 'Premium半单人间', fee: 1200, lowSeasonEligible: true, socialEligible: false, note: '附件列入淡季优惠适用房型。' },
  { id: 'premium-twin', campus: 'premium', name: 'Premium双人间', fee: 1000, lowSeasonEligible: true, socialEligible: false, note: 'Premium校内双人间。' },
  { id: 'premium-quad', campus: 'premium', name: 'Premium四人间', fee: 800, lowSeasonEligible: true, socialEligible: true, note: '6+2／9+3活动指定房型。' },
  { id: 'premium-six', campus: 'premium', name: 'Premium六人间', fee: 600, lowSeasonEligible: false, socialEligible: false, premiumSixPerson: true, note: '原价600美元／4周；活动期特价499美元／4周。' },
  { id: 'premium-alicia-single', campus: 'premium', name: 'Alicia校外单人间', fee: 1600, lowSeasonEligible: true, socialEligible: false, note: 'Alicia校外宿舍；空房与通勤需确认。' },
  { id: 'premium-alicia-twin', campus: 'premium', name: 'Alicia校外双人间', fee: 1000, lowSeasonEligible: true, socialEligible: false, note: 'Alicia校外宿舍；空房与通勤需确认。' },
];

export const CELLA_SOCIAL_PROMOTION_NOTES = [
  '报名前须通过小红书账号活跃度审核。',
  '入学后第一个月内发布4篇内容，并同时发布至小红书及抖音。',
  '内容围绕菲律宾游学、英语学习、校园生活或宿务生活体验，并使用真实、美观的照片或视频。',
  '所有内容须先发送给CELLA中文经理审核确认后方可发布。',
  '已发布内容不得删除、隐藏或设置为仅自己可见。',
  '未按规定完成分享，学校有权取消优惠资格或追回相应优惠金额。',
] as const;

export function cellaCourses(campus: CellaCampus): CellaCourse[] {
  return CELLA_COURSES.filter((course) => course.campus === campus && !course.familyPackage).map((course) => ({ ...course }));
}

export function cellaRooms(campus: CellaCampus): CellaRoom[] {
  return CELLA_ROOMS.filter((room) => room.campus === campus).map((room) => ({ ...room }));
}

export function cellaDurationPrice(fourWeekPrice: number, weeks: number): number {
  const safeWeeks = Math.max(0, Math.min(24, Math.trunc(weeks)));
  const fullPeriods = Math.floor(safeWeeks / 4);
  const remainder = safeWeeks % 4;
  const remainderMultiplier = [0, 0.4, 0.65, 0.85][remainder];
  return Math.round((fullPeriods + remainderMultiplier) * fourWeekPrice * 100) / 100;
}
