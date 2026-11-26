// JIC (Baguio) school-issued prices and dates: the 2026-05 price list (unchanged for 2027), the 2026-06-19 offer table,
// the 2027 school calendar and the 2025-07 local-fee sheets. Text the page shows about each course lists class counts only.
// Keep this file pure data (no Angular, DOM or storage).
export type JicCampus = 'challenger' | 'premium';
export type JicRoomCategory = 'single' | 'twin' | 'quad';
export type JicAirportPickup = 'none' | 'manila' | 'clark';

export interface JicCourseFee {
  id: string;
  campus: JicCampus;
  /** Customer-facing label shared by the webpage, quote selector and quote image. */
  displayName: string;
  /** Stable database lookup name. */
  name: string;
  tuition: number;
  /** Latest school-published textbook/material estimate per started four course weeks. */
  materialFee?: number;
  /** Daily classes, e.g. 每天4节一对一＋2节团体课，共6节. */
  schedule: string;
  /** Who the course suits. */
  suitable: string;
  note: string;
  /** Guarantee course: weeks it must run without a break. */
  minimumWeeks?: number;
}

export interface JicRoomFee {
  id: string;
  campus: JicCampus;
  category: JicRoomCategory;
  name: string;
  fee: number;
  note: string;
  /** The 2027 off-season offer gives Premium singles 50 dollars only in the semi-single (单人雅房). */
  premium2027SingleEligible?: boolean;
}

export const JIC_WEEK_OPTIONS = [1, 2, 3, 4, 6, 8, 12, 16, 20, 24] as const;
export const JIC_REGISTRATION_FEE = 100;
export const JIC_PEAK_FEE_PER_WEEK = 40;
/** Kept for older callers; new quotes start on the next term Sunday (nextJicTermStart). */
export const JIC_DEFAULT_START_DATE = '2026-09-06';
export const JIC_IELTS_GUARANTEE_ID = 'challenger-ielts-guarantee';
/** Odd-week arrival or graduation (not on a term start or end), each time. */
export const JIC_ODD_WEEK_FEE = 8000;

/**
 * Bumped with the 2026-11 school pack: saved documents take the new course text, room names, exact holiday-offer
 * arrival dates, the 3,000-peso Clark pickup and the new page copy once; other edits stay as saved.
 */
export const JIC_POLICY_VERSION = 20261123;

/**
 * School-pack facts (course and room names, prices, schedules and notes, the local-fee rows, the short-stay ratios
 * and the course-table note) move into a saved document once; after that an employee's edits in the content editor
 * stay (2026-11-26; before, every load restored them, so edited JIC course prices never reached the page). Bump this
 * only when a new school pack changes those facts.
 */
export const JIC_SCHOOL_PACK_VERSION = 20261126;

const DAY = 86400000;
/** JIC starts a term every second Sunday (2027 calendar: 1/10, 1/24 … 12/26; 2026: 11/29, 12/13, 12/27). */
const TERM_ANCHOR = Date.parse('2026-11-29T00:00:00Z');

/** Whether a date (YYYY-MM-DD) is a JIC term-start Sunday. */
export function isJicTermStart(date: string): boolean {
  const value = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(value)) return false;
  const days = Math.round((value - TERM_ANCHOR) / DAY);
  return days % 14 === 0;
}

/** The first term-start Sunday after today (local date), for a new quote. */
export function nextJicTermStart(now = new Date()): string {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.floor((today - TERM_ANCHOR) / DAY);
  const next = TERM_ANCHOR + (Math.floor(days / 14) + 1) * 14 * DAY;
  return new Date(next).toISOString().slice(0, 10);
}

/** Term-start Sundays of one year, e.g. for the calendar note. */
export function jicTermStarts(year: number): string[] {
  const starts: string[] = [];
  const first = Date.UTC(year, 0, 1);
  const offset = ((Math.round((first - TERM_ANCHOR) / DAY) % 14) + 14) % 14;
  for (let day = first + (offset ? 14 - offset : 0) * DAY; new Date(day).getUTCFullYear() === year; day += 14 * DAY) {
    starts.push(new Date(day).toISOString().slice(0, 10));
  }
  return starts;
}

const ESL_NOTE = '一对一练听说读写；斯巴达或半斯巴达入学第一天自选，之后每两周可以换。';
const IELTS_NOTE = '一对一练雅思听说读写；斯巴达每周六模考，半斯巴达每两周一次。';

export const JIC_COURSE_FEES: JicCourseFee[] = [
  {
    id: 'challenger-esl-lite', campus: 'challenger', displayName: 'ESL Lite 综合英语', name: 'Challenger ESL Lite', tuition: 760, materialFee: 1500,
    schedule: '每天4节一对一＋2节团体课，共6节', suitable: '零基础或想先打好基础的学生', note: ESL_NOTE,
  },
  {
    id: 'challenger-esl-core', campus: 'challenger', displayName: 'ESL Core 综合英语', name: 'Challenger ESL Core', tuition: 860, materialFee: 1600,
    schedule: '每天5节一对一＋2节团体课，共7节', suitable: '想多练口语、短期见效的学生', note: ESL_NOTE,
  },
  {
    id: 'challenger-esl-standard', campus: 'challenger', displayName: 'ESL Standard 综合英语', name: 'Challenger ESL Standard', tuition: 960, materialFee: 1700,
    schedule: '每天6节一对一＋2节团体课，共8节', suitable: '想每天上满一对一的学生', note: ESL_NOTE,
  },
  {
    id: 'challenger-ielts-guarantee', campus: 'challenger', displayName: 'IELTS Guarantee 雅思保分班', name: 'Challenger IELTS Guarantee 雅思保分班', tuition: 1060, materialFee: 1900,
    schedule: '每天6节一对一＋2节团体课，共8节', suitable: '有明确雅思目标分、能全程斯巴达的学生',
    note: '连续8周，全程斯巴达；到校符合条件后申请，另交18,000比索保分班费用。', minimumWeeks: 8,
  },
  {
    id: 'challenger-ielts-lite', campus: 'challenger', displayName: 'IELTS Lite 雅思', name: 'Challenger IELTS Lite', tuition: 960, materialFee: 1900,
    schedule: '每天4节一对一＋2节团体课，共6节', suitable: '准备雅思、想留时间自习的学生', note: IELTS_NOTE,
  },
  {
    id: 'challenger-ielts-core', campus: 'challenger', displayName: 'IELTS Core 雅思', name: 'Challenger IELTS Core', tuition: 1010, materialFee: 1900,
    schedule: '每天5节一对一＋2节团体课，共7节', suitable: '有雅思目标分的学生', note: IELTS_NOTE,
  },
  {
    id: 'challenger-ielts-standard', campus: 'challenger', displayName: 'IELTS Standard 雅思', name: 'Challenger IELTS Standard', tuition: 1060, materialFee: 1900,
    schedule: '每天6节一对一＋2节团体课，共8节', suitable: '想集中冲刺雅思的学生', note: IELTS_NOTE,
  },
  {
    id: 'premium-speaking-starter-7', campus: 'premium', displayName: 'Speaking Starter 口语基础', name: 'Premium Speaking Starter 7', tuition: 800, materialFee: 1500,
    schedule: '每天4节一对一＋1节团体课＋2节选修课，共7节', suitable: '初学者，想从单词表达过渡到日常对话（建议程度PreA1–A2）',
    note: '每两周一次简报；初学者可以不做简报。',
  },
  {
    id: 'premium-speaking-pro-8', campus: 'premium', displayName: 'Speaking Pro 口语进阶', name: 'Premium Speaking Pro 8', tuition: 975,
    schedule: '每天5节一对一＋1节团体课＋2节选修课，共8节', suitable: '读完口语基础课约4–8周、想继续提升口语的学生',
    note: '每两周一次简报，需要自备笔记本电脑做PPT。',
  },
  {
    id: 'premium-speaking-master-8', campus: 'premium', displayName: 'Speaking Master 口语大师', name: 'Premium Speaking Master 8', tuition: 1150, materialFee: 1900,
    schedule: '每天6节一对一＋1节团体课＋2节选修课，共9节', suitable: '想练逻辑表达和发音的学生（建议程度A2–C2）',
    note: '每两周一次简报，需要自备笔记本电脑做PPT。',
  },
  {
    id: 'premium-tep-8', campus: 'premium', displayName: 'TEP 8 主题英语', name: 'Premium 主题英语 TEP 8', tuition: 800, materialFee: 1500,
    schedule: '每天3节一对一（含2节主题课）＋3节团体课＋2节选修课，共8节', suitable: '对旅游、烹饪、艺术、IT等主题感兴趣的学生（建议程度PreA1–B2）',
    note: '25种主题自选，每两周换一次。',
  },
  {
    id: 'premium-tep-9', campus: 'premium', displayName: 'TEP 9 主题英语', name: 'Premium 主题英语 TEP 9', tuition: 900, materialFee: 1600,
    schedule: '每天4节一对一（含2节主题课）＋3节团体课＋2节选修课，共9节', suitable: '对旅游、烹饪、艺术、IT等主题感兴趣的学生（建议程度PreA1–B2）',
    note: '25种主题自选，每两周换一次。',
  },
  {
    id: 'premium-tep-10', campus: 'premium', displayName: 'TEP 10 主题英语', name: 'Premium 主题英语 TEP 10', tuition: 1000, materialFee: 1700,
    schedule: '每天5节一对一（含2节主题课）＋3节团体课＋2节选修课，共10节', suitable: '对旅游、烹饪、艺术、IT等主题感兴趣的学生（建议程度PreA1–B2）',
    note: '25种主题自选，每两周换一次。',
  },
  {
    id: 'premium-toeic', campus: 'premium', displayName: 'TOEIC 8 托业', name: 'Premium 托业 TOEIC', tuition: 900, materialFee: 1600,
    schedule: '每天3节一对一＋3节团体课＋2节选修课，共8节', suitable: '准备托业考试的学生（建议程度A2–C1）', note: '',
  },
  {
    id: 'premium-business-master-8', campus: 'premium', displayName: 'Business Master 8 商务英语', name: 'Premium Business Master 8', tuition: 1150, materialFee: 1900,
    schedule: '每天6节一对一＋2节选修课，共8节', suitable: '想学商务英语的职场人士（建议程度A2–C2）',
    note: '每两周一次商务简报，需要自备笔记本电脑做PPT。',
  },
  {
    id: 'premium-working-holiday-8', campus: 'premium', displayName: 'Working Holiday 8 打工度假', name: 'Premium Working Holiday 8', tuition: 900, materialFee: 1600,
    schedule: '每天3节一对一＋3节团体课＋2节选修课，共8节', suitable: '准备去英语国家打工度假的学生（建议程度A2–B2）', note: '',
  },
  {
    id: 'premium-active-senior-5', campus: 'premium', displayName: 'Active Senior 5 银发课程', name: 'Premium Active Senior 5', tuition: 600, materialFee: 1100,
    schedule: '每天3节一对一＋2节选修课，共5节', suitable: '40岁及以上、想边学英语边享受生活的学生', note: '限40岁及以上。',
  },
  {
    id: 'premium-active-senior-6', campus: 'premium', displayName: 'Active Senior 6 银发课程', name: 'Premium Active Senior 6', tuition: 700, materialFee: 1200,
    schedule: '每天4节一对一＋2节选修课，共6节', suitable: '40岁及以上、想边学英语边享受生活的学生', note: '限40岁及以上。',
  },
];

export const JIC_ROOM_FEES: JicRoomFee[] = [
  { id: 'challenger-single', campus: 'challenger', category: 'single', name: '单人间', fee: 1300, note: '一人一间，独立卫浴。' },
  { id: 'challenger-twin', campus: 'challenger', category: 'twin', name: '双人间', fee: 800, note: '两人一间，独立卫浴。' },
  { id: 'challenger-quad-duplex', campus: 'challenger', category: 'quad', name: '四人间（楼中楼）', fee: 750, note: '上下两层的四人间。' },
  { id: 'challenger-quad-bunk', campus: 'challenger', category: 'quad', name: '四人间（上下铺）', fee: 600, note: '上下铺四人间，费用最低。' },
  { id: 'premium-single-balcony', campus: 'premium', category: 'single', name: '单人阳台房', fee: 1450, note: '一人一间带阳台；有两种格局，由学校安排。' },
  {
    id: 'premium-single-no-balcony', campus: 'premium', category: 'single', name: '单人雅房', fee: 1250,
    note: '第二宿舍的单人房，卫浴、客厅和冰箱共用；男生一楼、女生二楼。', premium2027SingleEligible: true,
  },
  { id: 'premium-twin-balcony', campus: 'premium', category: 'twin', name: '双人间（阳台）', fee: 950, note: '两人一间带阳台。' },
  { id: 'premium-twin-no-balcony', campus: 'premium', category: 'twin', name: '双人间（无阳台）', fee: 850, note: '两人一间，没有阳台。' },
  { id: 'premium-quad-balcony', campus: 'premium', category: 'quad', name: '四人间（阳台）', fee: 750, note: '上下铺四人间，带阳台。' },
  { id: 'premium-quad-no-balcony', campus: 'premium', category: 'quad', name: '四人间（无阳台）', fee: 650, note: '上下铺四人间，费用最低。' },
];

export const JIC_PROMOTION_COPY = {
  peak: '2026/06/28–08/22每周40美元，2027/06/27–08/22每周60美元；同一周课程和住宿只算一次，不参与任何优惠。',
  offSeason: '按学习周计算：落在活动期内、又不在旺季的学习周每满4周减一次；最少读4周，在校延长不适用，可以和长期、圣诞优惠同用。2026/08/23–2027/01/09：四人间减150美元，单人、双人间减50美元；2027/02/21–06/26和2027/08/22–2028/01/08：四人间减100美元，双人间减50美元，单人间只有Premium单人雅房减50美元。',
  longTerm: '2026/03/08起报名并入学、读12周以上：12／16／20／24周分别减300／400／500／600美元，之后每多4周再多减100美元；旺季和在校延长也可以用，可以和其他优惠同用。',
  besa: 'BESA优惠要求报名日为2026/04/01–06/30、到校日为2026/08/23–12/13且至少4周；每完整4周减100美元，6周仅减100美元；不适用于在校延长，可叠加淡季优惠。',
  holiday: '在指定开学日入学、住双人或四人间并读满4周：2026/11/29、12/13、12/27和2027/01/10入学一次减200美元；2027/11/28、12/12、12/26和2028/01/09入学一次减150美元。在校延长不适用；旺季也可以用，可以和其他优惠同用。',
} as const;

export const JIC_LOCAL_FEE_COPY = {
  intro: '以下费用以比索计价，到校后在学校缴纳（每两周收一次）；可退押金另列，不计入合计。',
  deposit: '3,000比索／人，退房时没有损坏和扣分罚款可以全额退还；不计入学杂费合计。',
} as const;
