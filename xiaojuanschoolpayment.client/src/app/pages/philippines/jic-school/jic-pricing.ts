export type JicCampus = 'challenger' | 'premium';
export type JicRoomCategory = 'single' | 'twin' | 'quad';
export type JicAirportPickup = 'none' | 'manila' | 'clark';

export interface JicCourseFee {
  id: string;
  campus: JicCampus;
  /** Bilingual customer-facing label shared by the webpage, quote selector and quote image. */
  displayName: string;
  /** Stable database lookup name. */
  name: string;
  tuition: number;
  suitable: string;
}

export interface JicRoomFee {
  id: string;
  campus: JicCampus;
  category: JicRoomCategory;
  name: string;
  fee: number;
  note: string;
  /** The 2027 Premium offer is limited to the no-balcony single room. */
  premium2027SingleEligible?: boolean;
}

export const JIC_WEEK_OPTIONS = [4, 6, 8, 12, 16, 20, 24] as const;
export const JIC_REGISTRATION_FEE = 100;
export const JIC_PEAK_FEE_PER_WEEK = 40;
export const JIC_DEFAULT_START_DATE = '2026-09-06';

export const JIC_COURSE_FEES: JicCourseFee[] = [
  { id: 'challenger-esl-lite', campus: 'challenger', displayName: 'ESL Lite · 轻量英语课程', name: 'Challenger ESL Lite', tuition: 760, suitable: '4节一对一 + 2节小组课' },
  { id: 'challenger-esl-core', campus: 'challenger', displayName: 'ESL Core · 核心英语课程', name: 'Challenger ESL Core', tuition: 860, suitable: '5节一对一 + 2节小组课' },
  { id: 'challenger-esl-standard', campus: 'challenger', displayName: 'ESL Standard · 标准英语课程', name: 'Challenger ESL Standard', tuition: 960, suitable: '6节一对一 + 2节小组课' },
  { id: 'challenger-ielts-lite', campus: 'challenger', displayName: 'IELTS Lite · 雅思轻量课程', name: 'Challenger IELTS Lite', tuition: 960, suitable: '4节一对一 + 2节小组课；每周六强制模拟考试' },
  { id: 'challenger-ielts-core', campus: 'challenger', displayName: 'IELTS Core · 雅思核心课程', name: 'Challenger IELTS Core', tuition: 1010, suitable: '5节一对一 + 2节小组课；每周六强制模拟考试' },
  { id: 'challenger-ielts-standard', campus: 'challenger', displayName: 'IELTS Standard · 雅思标准课程', name: 'Challenger IELTS Standard', tuition: 1060, suitable: '6节一对一 + 2节小组课 + 强制自习及30分钟词汇测试；每周六强制模拟考试' },
  { id: 'challenger-ielts-guarantee', campus: 'challenger', displayName: 'IELTS Guarantee · 雅思保分班', name: 'Challenger IELTS Guarantee 雅思保分班', tuition: 1060, suitable: '6节一对一 + 2节小组课 + 强制自习及30分钟词汇测试；每周六强制模拟考试，保分班另付18,000比索' },
  { id: 'premium-speaking-starter-7', campus: 'premium', displayName: 'Speaking Starter 7 · 口语入门课程', name: 'Premium Speaking Starter 7', tuition: 800, suitable: '4节一对一 + 1节团体课 + 2节选修课；适合初学者到中级ESL学习者' },
  { id: 'premium-speaking-pro-8', campus: 'premium', displayName: 'Speaking Pro 8 · 口语进阶课程', name: 'Premium Speaking Pro 8', tuition: 975, suitable: '5节一对一 + 1节团体课 + 2节选修课；适合初学者到中级ESL学习者' },
  { id: 'premium-speaking-master-8', campus: 'premium', displayName: 'Speaking Master 8 · 口语大师课程', name: 'Premium Speaking Master 8', tuition: 1150, suitable: '6节一对一 + 1节团体课 + 2节选修课；适合初学者到中级ESL学习者' },
  { id: 'premium-tep-8', campus: 'premium', displayName: 'TEP 8 · 主题英语课程8', name: 'Premium 主题英语 TEP 8', tuition: 800, suitable: '3节一对一 + 3节团体课 + 2节选修课' },
  { id: 'premium-tep-9', campus: 'premium', displayName: 'TEP 9 · 主题英语课程9', name: 'Premium 主题英语 TEP 9', tuition: 900, suitable: '4节一对一 + 3节团体课 + 2节选修课' },
  { id: 'premium-tep-10', campus: 'premium', displayName: 'TEP 10 · 主题英语课程10', name: 'Premium 主题英语 TEP 10', tuition: 1000, suitable: '5节一对一 + 3节团体课 + 2节选修课' },
  { id: 'premium-active-senior-5', campus: 'premium', displayName: 'Active Senior 5 · 活力银发课程5', name: 'Premium Active Senior 5', tuition: 600, suitable: '3节一对一 + 2节选修课；适合40岁以上学生，兼顾旅游与休闲' },
  { id: 'premium-active-senior-6', campus: 'premium', displayName: 'Active Senior 6 · 活力银发课程6', name: 'Premium Active Senior 6', tuition: 700, suitable: '4节一对一 + 2节选修课；适合40岁以上学生，兼顾旅游与休闲' },
  { id: 'premium-working-holiday-8', campus: 'premium', displayName: 'Working Holiday 8 · 打工度假英语课程', name: 'Premium Working Holiday 8', tuition: 900, suitable: '3节一对一 + 3节团体课 + 2节选修课' },
  { id: 'premium-toeic', campus: 'premium', displayName: 'TOEIC · 托业课程', name: 'Premium 托业 TOEIC', tuition: 900, suitable: '3节一对一 + 3节团体课 + 2节选修课' },
  { id: 'premium-business-master-8', campus: 'premium', displayName: 'Business Master 8 · 商务英语大师课程', name: 'Premium Business Master 8', tuition: 1150, suitable: '6节一对一 + 2节选修课' },
  { id: 'premium-junior', campus: 'premium', displayName: 'Junior · 青少年课程', name: 'Premium 青少年课程 Junior', tuition: 1200, suitable: '4节一对一 + 2节团体课 + 1小时写作活动 + 2小时监控晚自习' },
  { id: 'premium-guardian', campus: 'premium', displayName: 'Guardian · 监护人课程', name: 'Premium 监护人课程 Guardian', tuition: 600, suitable: '2节一对一' },
];

export const JIC_ROOM_FEES: JicRoomFee[] = [
  { id: 'challenger-single', campus: 'challenger', category: 'single', name: 'Challenger 单人间（标准）', fee: 1300, note: '主校区标准单人间' },
  { id: 'challenger-twin', campus: 'challenger', category: 'twin', name: 'Challenger 双人间（标准）', fee: 800, note: '主校区标准双人间' },
  { id: 'challenger-quad-duplex', campus: 'challenger', category: 'quad', name: 'Challenger 四人间（复式）', fee: 750, note: '主校区复式四人间' },
  { id: 'challenger-quad-bunk', campus: 'challenger', category: 'quad', name: 'Challenger 四人间（上下铺）', fee: 600, note: '主校区上下铺四人间；默认预算参考' },
  { id: 'premium-single-no-balcony', campus: 'premium', category: 'single', name: 'Premium 单人间（无阳台）', fee: 1250, note: '高级校区无阳台单人间；属于2027淡季优惠指定单人雅房', premium2027SingleEligible: true },
  { id: 'premium-single-balcony', campus: 'premium', category: 'single', name: 'Premium 单人间（带阳台）', fee: 1450, note: '高级校区带阳台单人间；不属于2027淡季指定单人雅房' },
  { id: 'premium-twin-no-balcony', campus: 'premium', category: 'twin', name: 'Premium 双人间（无阳台）', fee: 850, note: '高级校区无阳台双人间' },
  { id: 'premium-twin-balcony', campus: 'premium', category: 'twin', name: 'Premium 双人间（带阳台）', fee: 950, note: '高级校区带阳台双人间' },
  { id: 'premium-quad-no-balcony', campus: 'premium', category: 'quad', name: 'Premium 四人间（无阳台）', fee: 650, note: '高级校区无阳台上下铺四人间' },
  { id: 'premium-quad-balcony', campus: 'premium', category: 'quad', name: 'Premium 四人间（带阳台）', fee: 750, note: '高级校区带阳台上下铺四人间' },
];

export const JIC_PROMOTION_COPY = {
  peak: '旺季附加费：仅2026/06/28–08/22实际就读的课程周按40美元／周收取。',
  offSeason: '淡季优惠按到校日判断，最低4周且不适用于在校延长；2026下半年四人房每4周减150美元、单人／双人房减50美元；2027两段档期四人房减100美元、单人／双人房减50美元（Premium单人房仅无阳台雅房）。',
  longTerm: '长期优惠适用于2026/03/08及以后报名并到校的12周以上学生：12／16／20／24周分别减300／400／500／600美元，可用于在校延长并与其他优惠叠加。',
  besa: 'BESA优惠要求报名日为2026/04/01–06/30、到校日为2026/08/23–12/13且至少4周；每完整4周减100美元，6周仅减100美元；不适用于在校延长，可叠加淡季优惠。',
  holiday: '双人或四人房节日优惠按到校日判断：2026两段档期一次减200美元，2027两段档期一次减150美元；最低4周，不适用于在校延长，可与其他优惠叠加。',
} as const;

export const JIC_LOCAL_FEE_COPY = {
  intro: '学杂费由学校及菲律宾相关部门到校收取，与思达游学无关；页面仅按附件金额预估，最终以学校现场实收为准。',
  deposit: '3,000比索／人，退房时无损坏且无其他欠费可按校规退还；不计入学杂费合计。',
} as const;
