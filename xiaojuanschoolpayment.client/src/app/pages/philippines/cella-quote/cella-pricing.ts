export type CellaCampus = 'uni' | 'premium';
export type CellaEnrollmentStatus = 'new' | 'transfer' | 'extension';
export type CellaPromotionMode = 'standard' | 'social-6-plus-2' | 'social-9-plus-3';
export type CellaRoomKind = 'single' | 'semi-single' | 'twin' | 'triple' | 'quad' | 'six' | 'family';

export interface CellaCourse {
  id: string;
  campus: CellaCampus;
  name: string;
  tuition: number;
  lessons: string;
  note: string;
  needsConfirmation?: boolean;
  familyPackage?: CellaFamilyPackage;
  /** Durations the school price list offers for this course (IELTS Guarantee 8/12, TESOL 4). */
  allowedWeeks?: readonly number[];
  /** Fixed 2027 start Sundays (TESOL). */
  startDates2027?: readonly string[];
}

export interface CellaRoom {
  id: string;
  campus: CellaCampus;
  name: string;
  fee: number;
  note: string;
  kind: CellaRoomKind;
  /** 2026/08/30–2027/01/02 offer (all rooms except the six-person room). */
  lowSeasonEligible: boolean;
  socialEligible: boolean;
  premiumSixPerson?: boolean;
  /** Premium outside dormitory STACIA HOTEL: own 2027 local fees. */
  stacia?: boolean;
}

export interface CellaFamilyPackage {
  id: string;
  /** Premium campus dormitory, or the STACIA HOTEL outside dormitory (no guardian class). */
  dormitory: 'premium' | 'stacia';
  room: string;
  occupants: string;
  /** Whole-family dollar totals of the 2027 table; there is no published price beyond four weeks. */
  prices: Record<1 | 2 | 3 | 4, number>;
}

export const CELLA_CAMPUS_NAMES: Record<CellaCampus, string> = {
  uni: 'CELLA Uni Sparta Campus',
  premium: 'CELLA Premium Campus',
};

export const CELLA_REGISTRATION_FEE = 150;
export const CELLA_PEAK_SEASON_WEEKLY_FEE = 60;
/** 2026 second-half offer, kept for stays inside its window (user decision 2026-11-20). */
export const CELLA_LOW_SEASON_START = '2026-08-30';
export const CELLA_LOW_SEASON_END = '2027-01-02';

/** CELLA 2027 promotion poster (CHN-2027 Promotion). */
export const CELLA_2027_PROMOTION = {
  arrivalStart: '2027-02-14',
  arrivalEnd: '2027-12-31',
  summerStart: '2027-05-30',
  summerEnd: '2027-08-28',
  lowSeasonPerWeek: 25,
  sixPersonRate: 0.75,
  sixPersonWeeks: [4, 8, 12] as readonly number[],
  longStayTiers: [
    { weeks: 24, amount: 250 },
    { weeks: 20, amount: 200 },
    { weeks: 16, amount: 150 },
    { weeks: 12, amount: 100 },
  ] as ReadonlyArray<{ weeks: number; amount: number }>,
} as const;

/** 2027 local payment sheets; the STACIA and water changes apply from 2027-01-01. */
export const CELLA_LOCAL_FEES_2027 = {
  effectiveFrom: '2027-01-01',
  ssp: 7800,
  sspECard: 4500,
  arp: 300,
  acrICard: 4000,
  /** Cumulative extension stages by study week: 5–8, 9–12, then every further four weeks. */
  extensionStages: [5140, 6410, 4440, 4440, 4440] as readonly number[],
  maintenancePerWeek: 1000,
  electricityPerWeek: 500,
  staciaElectricityPerWeek: 1000,
  waterPerWeek: 500,
  waterPerWeekBefore2027: 300,
  studentId: 200,
  pickupWeekend: 1500,
  pickupWeekday: 2000,
  pickupFamilyWeekend: 3000,
  pickupFamilyWeekday: 4000,
} as const;

/**
 * 思达启航折扣 (user decision 2026-11-21, following CELLA's own formula for the six-person offer): course and room
 * 10% off after every school offer; registration, the summer surcharge and the minor fee are not discounted.
 */
export const CELLA_SIDA_RATE = 0.9;
/** The family registration inside every family package price; it stays out of the 思达启航折扣 (user decision 2026-11-21). */
export const CELLA_FAMILY_REGISTRATION_FEE = 500;

export const CELLA_FAMILY_PACKAGE_NOTE = '全家整包价，已含每户500美元注册费、课程、住宿、三餐，以及SSP、电子卡、电费、水费、管理费、洗衣、接机、学生证和教材；不含汇款手续费和超额电费。价格只有1–4周；家庭成员年龄和空房须由顾问向学校确认。';

/** Durations of the 2027 family package table (school answer 2026-11-21: the price is the whole amount). */
export const CELLA_FAMILY_PACKAGE_WEEKS: readonly number[] = [1, 2, 3, 4];

const familyPackage = (
  dormitory: CellaFamilyPackage['dormitory'], beds: 'twin' | 'triple' | 'quad', guardians: number, juniors: number,
  [one, two, three, four]: readonly [number, number, number, number],
): CellaFamilyPackage => ({
  id: `premium-${dormitory === 'stacia' ? 'stacia-' : ''}family-${beds}${beds === 'twin' ? '' : `-${guardians}-${juniors}`}`,
  dormitory,
  room: `${dormitory === 'stacia' ? 'STACIA校外' : '校内'}${{ twin: '双', triple: '三', quad: '四' }[beds]}人家庭房`,
  occupants: `${guardians}位家长＋${juniors}位孩子`,
  prices: { 1: one, 2: two, 3: three, 4: four },
});

/** 2027 CELLA Family Package (Premium campus): whole-family totals for 1/2/3/4 weeks. */
export const CELLA_FAMILY_PACKAGES: readonly CellaFamilyPackage[] = [
  familyPackage('premium', 'twin', 1, 1, [2360, 3835, 5015, 5900]),
  familyPackage('premium', 'triple', 2, 1, [3320, 5395, 7055, 8300]),
  familyPackage('premium', 'triple', 1, 2, [3560, 5785, 7565, 8900]),
  familyPackage('premium', 'quad', 2, 2, [4400, 7150, 9350, 11000]),
  familyPackage('premium', 'quad', 1, 3, [4640, 7540, 9860, 11600]),
  familyPackage('stacia', 'twin', 1, 1, [1960, 3185, 4165, 4900]),
  familyPackage('stacia', 'triple', 2, 1, [2520, 4095, 5355, 6300]),
  familyPackage('stacia', 'triple', 1, 2, [3160, 5135, 6715, 7900]),
  familyPackage('stacia', 'quad', 2, 2, [3600, 5850, 7650, 9000]),
  familyPackage('stacia', 'quad', 1, 3, [4240, 6890, 9010, 10600]),
];

const FAMILY_LESSONS: Record<CellaFamilyPackage['dormitory'], string> = {
  premium: '孩子和家长都上课；含注册费、住宿、三餐和到校学杂费，不含汇款手续费和超额电费',
  stacia: '只含孩子课程，家长上课须另付课程费、SSP和电子卡；含注册费、住宿、三餐和到校学杂费，不含汇款手续费和超额电费',
};

const PRICE_NOTE = '2027年4周课程费。';
const TESOL_START_DATES_2027 = ['2027-01-03', '2027-01-31', '2027-02-28', '2027-03-28', '2027-04-25', '2027-05-23', '2027-06-20', '2027-07-18', '2027-08-15', '2027-09-05', '2027-10-03', '2027-10-31'];

export const CELLA_COURSES: readonly CellaCourse[] = [
  {
    id: 'uni-power-speaking-1', campus: 'uni', name: 'Power Speaking 1', tuition: 930,
    lessons: '4节一对一课程＋3节小组课＋1节大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: PRICE_NOTE,
  },
  {
    id: 'uni-power-speaking-2', campus: 'uni', name: 'Power Speaking 2', tuition: 1180,
    lessons: '6节一对一课程＋1节小组课＋1节大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: PRICE_NOTE,
  },
  {
    id: 'uni-toeic-pre', campus: 'uni', name: 'TOEIC Pre', tuition: 1080,
    lessons: '4节一对一课程＋3节ESL小组课＋1节ESL大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: PRICE_NOTE,
  },
  {
    id: 'uni-toeic-intensive', campus: 'uni', name: 'TOEIC Intensive', tuition: 1180,
    lessons: '4节一对一课程＋3节小组课＋1节大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: PRICE_NOTE,
  },
  {
    id: 'uni-ielts-pre', campus: 'uni', name: 'IELTS Pre', tuition: 1080,
    lessons: '4节一对一课程＋3节ESL小组课＋1节ESL大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: PRICE_NOTE,
  },
  {
    id: 'uni-ielts-intensive', campus: 'uni', name: 'IELTS Intensive', tuition: 1180,
    lessons: '4节一对一课程＋3节小组课＋1节大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: PRICE_NOTE,
  },
  {
    id: 'uni-ielts-guarantee', campus: 'uni', name: 'IELTS Guarantee', tuition: 1380,
    lessons: '6节一对一课程＋1节小组课＋1节大团体课＋晚课＋跟读训练＋选修课＋自习',
    note: '只开8周或12周；保证班入学条件、保证分数及指定入学日需向学校确认。', needsConfirmation: true,
    allowedWeeks: [8, 12],
  },
  {
    id: 'uni-tesol', campus: 'uni', name: 'TESOL', tuition: 1730,
    lessons: '6节2:8课程＋2节线上学习＋晚课＋跟读训练＋选修课＋自习',
    note: '每期4周，须先通过线上面试；2027开课日：1/3、1/31、2/28、3/28、4/25、5/23、6/20、7/18、8/15、9/5、10/3、10/31。', needsConfirmation: true,
    allowedWeeks: [4], startDates2027: TESOL_START_DATES_2027,
  },
  {
    id: 'premium-light-esl', campus: 'premium', name: 'Light ESL', tuition: 830,
    lessons: '3节一对一课程＋1节8人大团体课＋自习课（上午班或下午班）',
    note: PRICE_NOTE,
  },
  {
    id: 'premium-power-speaking-1', campus: 'premium', name: 'Power Speaking 1', tuition: 930,
    lessons: '4节一对一课程＋3节4人小组课＋1节8人大团体课＋2节自习课',
    note: PRICE_NOTE,
  },
  {
    id: 'premium-power-speaking-2', campus: 'premium', name: 'Power Speaking 2', tuition: 1180,
    lessons: '6节一对一课程＋1节4人小组课＋1节8人大团体课＋2节自习课',
    note: PRICE_NOTE,
  },
  {
    id: 'premium-business-preparation', campus: 'premium', name: 'Business Preparation', tuition: 1080,
    lessons: '4节一对一课程＋3节4人ESL小组课＋1节8人ESL团体课＋2节自习课',
    note: PRICE_NOTE,
  },
  {
    id: 'premium-business-intensive', campus: 'premium', name: 'Business Intensive', tuition: 1180,
    lessons: '4节一对一课程＋4节4人小组课＋2节自习课',
    note: PRICE_NOTE,
  },
  {
    id: 'premium-ace', campus: 'premium', name: 'ACE 空乘英语', tuition: 1180,
    lessons: '4节一对一课程＋3节4人小组课＋1节8人大团体课＋2节自习课',
    note: '2027年起含外部专业培训中心的空乘及安全培训；带实习课程同价，2027实习开始日：1/10、2/7、3/7、4/4、5/2、5/30、6/27、7/25、8/22、9/19、10/17、11/14、12/12。入学条件需向学校确认。', needsConfirmation: true,
  },
  {
    id: 'premium-working-holiday', campus: 'premium', name: 'Working Holiday 1', tuition: 930,
    lessons: '3节一对一课程＋4节小组课＋可选实习训练',
    note: PRICE_NOTE,
  },
  {
    id: 'premium-working-holiday-2', campus: 'premium', name: 'Working Holiday 2', tuition: 1080,
    lessons: '课表以学校最新课程介绍为准',
    note: PRICE_NOTE,
  },
  ...CELLA_FAMILY_PACKAGES.map((familyPackage) => ({
    id: familyPackage.id,
    campus: 'premium' as const,
    name: `家庭套餐｜${familyPackage.room}｜${familyPackage.occupants}`,
    tuition: familyPackage.prices[4],
    lessons: FAMILY_LESSONS[familyPackage.dormitory],
    note: CELLA_FAMILY_PACKAGE_NOTE,
    familyPackage,
  })),
];

/** The only room choice while a family package is selected: the package already includes its family room. */
export const CELLA_FAMILY_ROOM: CellaRoom = {
  id: 'premium-family-room', campus: 'premium', name: '家庭房（含在家庭套餐内）', fee: 0, kind: 'family',
  note: '房型和入住人数按所选家庭套餐安排。', lowSeasonEligible: false, socialEligible: false,
};

const room = (value: Omit<CellaRoom, 'lowSeasonEligible' | 'socialEligible'> & Partial<Pick<CellaRoom, 'lowSeasonEligible' | 'socialEligible'>>): CellaRoom => ({
  lowSeasonEligible: value.kind !== 'six',
  socialEligible: value.kind === 'quad',
  ...value,
});

export const CELLA_ROOMS: readonly CellaRoom[] = [
  room({ id: 'uni-single', campus: 'uni', name: 'Uni单人间', fee: 1370, kind: 'single', note: 'Uni校内单人间。' }),
  room({ id: 'uni-twin', campus: 'uni', name: 'Uni双人间', fee: 970, kind: 'twin', note: 'Uni校内双人间。' }),
  room({ id: 'uni-triple', campus: 'uni', name: 'Uni三人间', fee: 870, kind: 'triple', note: 'Uni校内三人间。' }),
  room({ id: 'uni-quad', campus: 'uni', name: 'Uni四人间', fee: 770, kind: 'quad', note: 'Uni校内四人间；6+2／9+3活动指定房型。' }),
  room({ id: 'uni-jdn-single', campus: 'uni', name: 'JDN校外单人间', fee: 1370, kind: 'single', note: 'JDN校外宿舍；空房与接驳需确认。' }),
  room({ id: 'uni-jdn-twin', campus: 'uni', name: 'JDN校外双人间', fee: 970, kind: 'twin', note: 'JDN校外宿舍；空房与接驳需确认。' }),
  room({ id: 'uni-jdn-triple', campus: 'uni', name: 'JDN校外三人间', fee: 870, kind: 'triple', note: 'JDN校外宿舍；空房与接驳需确认。' }),
  room({ id: 'premium-single', campus: 'premium', name: 'Premium单人间', fee: 1670, kind: 'single', note: 'Premium校内单人间。' }),
  room({ id: 'premium-semi-single', campus: 'premium', name: 'Premium半单人间', fee: 1270, kind: 'semi-single', note: 'Premium校内半单人间。' }),
  room({ id: 'premium-twin', campus: 'premium', name: 'Premium双人间', fee: 1070, kind: 'twin', note: 'Premium校内双人间。' }),
  room({ id: 'premium-quad', campus: 'premium', name: 'Premium四人间', fee: 870, kind: 'quad', note: 'Premium校内四人间；6+2／9+3活动指定房型。' }),
  room({ id: 'premium-six', campus: 'premium', name: 'Premium六人间', fee: 670, kind: 'six', premiumSixPerson: true, note: '2027/02/14–12/31入学并就读4／8／12周，课程和住宿七五折（暑期周除外）；2027/01/02前按活动价499美元／4周。' }),
  room({ id: 'premium-alicia-single', campus: 'premium', name: 'STACIA校外单人间', fee: 1670, kind: 'single', stacia: true, note: 'STACIA HOTEL校外宿舍；空房与通勤需确认。' }),
  room({ id: 'premium-alicia-twin', campus: 'premium', name: 'STACIA校外双人间', fee: 1070, kind: 'twin', stacia: true, note: 'STACIA HOTEL校外宿舍；空房与通勤需确认。' }),
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

/** Visa extension stages a stay of `weeks` reaches: 0 up to 4 weeks, 1 at 5–8, 2 at 9–12, … */
export function cellaExtensionStages(weeks: number): number {
  return weeks <= 4 ? 0 : Math.min(CELLA_LOCAL_FEES_2027.extensionStages.length, Math.ceil((weeks - 4) / 4));
}
