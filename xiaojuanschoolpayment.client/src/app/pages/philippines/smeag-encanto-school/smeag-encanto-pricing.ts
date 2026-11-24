// SMEAG Encanto (Mactan seaside campus): the school's prices, seasons, offers and local fees, from the school
// pack received 2026-11-23 (2027 Family Camp guide, 2026/2027 Family Support posters, 2025 Encanto ESL price
// chart, 2025/2027 SMEAG local-fee sheets, the 2026 H2 and 2027 H1 off-season posters and the school's
// Chinese guides). Sources and open questions: docs/smeag-encanto-source-2026-11-23.md.
// Agent commission in those files is internal and is never used here. Keep this file pure data and pure
// functions (no Angular, DOM or storage), so the WeChat mini program can bundle it later.

export type EncantoCourseKind = 'adult' | 'family';

export interface EncantoCourse {
  id: string;
  kind: EncantoCourseKind;
  name: string;
  /** Adult courses: four-week tuition in dollars. */
  tuition?: number;
  /** Family courses: people in the family, guardians and children. */
  members?: number;
  guardians?: number;
  children?: number;
  /** Family courses: whether the guardians study too (always in the peak family camp). */
  guardiansStudy?: boolean;
  /** Family courses: whole-family four-week price in the peak family camp (all-inclusive). */
  peakPrice?: number;
  /** Family courses: whole-family four-week price in the off-season (Family Support). */
  offPrice?: number;
  schedule: string;
  suitable: string;
  note: string;
}

export interface EncantoRoom {
  id: string;
  name: string;
  label: string;
  /** Four-week room price in dollars; 0 for the family room, which the family price already holds. */
  fee: number;
  /** Encanto's weekly resort fee for this room (adult rooms only). */
  resortFeePerWeek: number;
  family: boolean;
  note: string;
}

export const ENCANTO_SCHOOL_NAME = 'SMEAG Encanto';

/** One-time adult registration; family prices already hold it. */
export const ENCANTO_REGISTRATION_FEE = 100;
/** 思达启航折扣 on adult course and room (the school's agent rate: (住宿费＋课程费)×0.9, resort fee excluded). */
export const ENCANTO_SIDA_RATE = 0.9;
/** 思达启航优惠 in the peak family camp: 25 dollars per person per peak week. */
export const ENCANTO_FAMILY_CAMP_SIDA_PER_PERSON_WEEK = 25;
/** Returning family members each save the 100-dollar registration the family price holds. */
export const ENCANTO_RETURNING_MEMBER_DEDUCTION = 100;
/** 1/2/3 weeks cost 45/65/85% of the four-week price (adult courses, rooms and the peak family camp). */
export const ENCANTO_SHORT_STAY_RATIOS: Readonly<Record<number, number>> = { 1: 0.45, 2: 0.65, 3: 0.85 };
/** Family quotes: 4 to 8 weeks, any length (peak camp also 1–3 weeks); longer stays need the school. */
export const ENCANTO_FAMILY_MAX_WEEKS = 8;
/** The last study week the school has published prices for (2027/12/26–2028/01/01). */
export const ENCANTO_LAST_WEEK_START = '2027-12-26';

/**
 * Family Camp weeks (peak season: January–February and July–August 2027), as Sunday-to-Saturday study weeks.
 * Every other week is off-season: Family Support for families, ESL/ESL2 for adults.
 */
export const ENCANTO_PEAK_RANGES: ReadonlyArray<{ id: string; label: string; start: string; end: string }> = [
  { id: 'winter-2027', label: '2027年寒假亲子营', start: '2027-01-03', end: '2027-02-27' },
  { id: 'summer-2027', label: '2027年暑假亲子营', start: '2027-06-27', end: '2027-08-28' },
];

/**
 * The school's off-season offer for adult ESL and ESL2. The poster also names Speaking Master, but Encanto's
 * price chart and course flyer list only ESL and ESL2, so Speaking Master is not offered here.
 */
export interface EncantoOffSeasonOffer {
  id: string;
  label: string;
  /** First Sunday arrival from which the offer applies. */
  arrivalFrom: string;
  start: string;
  end: string;
  perWeek: number;
}

export const ENCANTO_OFF_SEASON_OFFERS: readonly EncantoOffSeasonOffer[] = [
  { id: 'encanto-off-season-2026', label: '2026下半年淡季优惠', arrivalFrom: '2026-08-23', start: '2026-08-23', end: '2027-01-01', perWeek: 25 },
  { id: 'encanto-off-season-2027', label: '2027上半年淡季优惠', arrivalFrom: '2027-02-28', start: '2027-03-01', end: '2027-06-25', perWeek: 25 },
];

/**
 * 2026 Christmas offer: 100 dollars once when the study touches 2026/12/20–2027/01/02 and runs at least 4 weeks.
 * Adults and every family member get it, 100 dollars per person (user answers 2026-11-24).
 */
export const ENCANTO_CHRISTMAS_OFFER = { id: 'encanto-christmas-2026', start: '2026-12-20', end: '2027-01-02', amount: 100, minimumWeeks: 4 } as const;

const ADULT_SCHEDULE = '4节一对一（听说读写）＋2节1:4小组讨论＋下午免费特别课程';

export const ENCANTO_COURSES: readonly EncantoCourse[] = [
  {
    id: 'esl', kind: 'adult', name: '成人ESL', tuition: 840,
    schedule: ADULT_SCHEDULE,
    suitable: '想在海边校园轻松学英语、晚上自由安排的成年人',
    note: '只在淡季开课（3–6月、9–12月），仅限成年人。没有早晚自习（斯巴达）；每周四晚上有模拟考试。',
  },
  {
    id: 'esl2', kind: 'adult', name: '成人ESL2', tuition: 1140,
    schedule: `${ADULT_SCHEDULE}＋周一至周三晚上2节一对一口语`,
    suitable: '想多一些一对一口语练习的成年人',
    note: '比ESL每天晚上多1.5小时一对一口语（19:00–20:35；周四模拟考试、周五毕业典礼，这两晚没有）。只在淡季开课，仅限成年人。',
  },
  ...([2, 3, 4] as const).map((members): EncantoCourse => ({
    id: `family-${members}`, kind: 'family', members, guardiansStudy: true,
    name: `亲子课程 ${members}人家庭`,
    peakPrice: { 2: 5600, 3: 8100, 4: 10400 }[members],
    offPrice: { 2: 4000, 3: 5600, 4: 7000 }[members],
    schedule: '孩子：4节一对一＋2节1:4＋2节1:8＋每日活动课；家长：2节一对一＋2节1:8',
    suitable: members === 2 ? '一位家长带一个孩子、两人都想上课' : `${members}口之家（家长和孩子人数不限），全家都想上课`,
    note: '整家价格。旺季亲子营（1–2月、7–8月）是全包价：含注册、课程、宿舍、三餐、管理费、每周清洁、洗衣、SSP、SSP I-Card、5周以上签证、水电和接机。淡季整家价格含注册、课程、宿舍和三餐，到校学杂费按每人另付。2–4岁孩子上幼儿园课程。',
  })),
  ...([
    ['1g1c', 1, 1, 3550],
    ['2g1c', 2, 1, 4490],
    ['1g2c', 1, 2, 5350],
    ['2g2c', 2, 2, 6100],
    ['1g3c', 1, 3, 6950],
  ] as const).map(([code, guardians, children, offPrice]): EncantoCourse => ({
    id: `support-${code}`, kind: 'family', members: guardians + children, guardians, children, guardiansStudy: false, offPrice,
    name: `淡季亲子 ${guardians}位家长＋${children}个孩子`,
    schedule: '孩子：4节一对一＋2节1:4＋2节1:8＋每日活动课；家长不上课，可免费参加特别课程',
    suitable: '淡季来、只想让孩子上课的家庭',
    note: '只在淡季开设（3–6月、9–12月），整家价格，含注册、孩子课程、宿舍和三餐；到校学杂费按每人另付。旺季家长须一起上课。',
  })),
];

export const ENCANTO_ROOMS: readonly EncantoRoom[] = [
  { id: 'single', name: '单人间', label: '单人间', fee: 1180, resortFeePerWeek: 100, family: false, note: '一人一间。另收度假村设施费100美元／周。' },
  { id: 'twin', name: '双人间', label: '双人间', fee: 1020, resortFeePerWeek: 75, family: false, note: '两人一间。另收度假村设施费75美元／周。' },
  { id: 'triple', name: '三人间', label: '三人间', fee: 880, resortFeePerWeek: 50, family: false, note: '三人一间。另收度假村设施费50美元／周。' },
  { id: 'family-room', name: '家庭房（含在亲子课程价格内）', label: '家庭房', fee: 0, resortFeePerWeek: 0, family: true, note: '亲子课程的家庭房，费用已含在整家价格里。' },
];

/** Local fees by the year of the first arrival: 2026 arrivals use the 2025 sheet, 2027 arrivals the 2027 sheet. */
export interface EncantoLocalFeeTable {
  year: 2025 | 2027;
  ssp: number;
  sspICard: number;
  visaICard: number;
  /** Management fee (2025 sheet) or utilities (2027 sheet), per started four weeks. */
  upkeepName: string;
  upkeep: number;
  /** Electricity and water prepayment per started four weeks; extra use is settled at school. */
  electricityWater: number;
  deposit: number;
  depositNote: string;
  pickup: number;
}

export const ENCANTO_LOCAL_FEES: Readonly<Record<2025 | 2027, EncantoLocalFeeTable>> = {
  2025: {
    year: 2025, ssp: 7800, sspICard: 4300, visaICard: 4300,
    upkeepName: '管理费', upkeep: 2000, electricityWater: 2400,
    deposit: 3000, depositNote: '含房间押金2,500、钥匙300和E-money卡200比索',
    pickup: 1200,
  },
  2027: {
    year: 2027, ssp: 7800, sspICard: 4500, visaICard: 4500,
    upkeepName: '设施使用费（Utilities）', upkeep: 3000, electricityWater: 2400,
    deposit: 2000, depositNote: '含房间押金1,500、钥匙300和E-money卡200比索',
    pickup: 1200,
  },
};

/** Tourist-visa extensions after a 30-day entry: 5,130, then 6,400, then 4,430 each (SMEAG local-fee sheets). */
export const ENCANTO_VISA_RATES_30 = [5130, 6400, 4430];
/** After a 59-day entry the first extension is the 30-day visa's second one. */
export const ENCANTO_VISA_RATES_59 = [6400, 4430];

const DAY = 86400000;
const parse = (value: string): number | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) ? time : null;
};
const iso = (time: number) => new Date(time).toISOString().slice(0, 10);

/** Whether the Sunday-to-Saturday study week starting on this Sunday is a Family Camp (peak) week. */
export function isEncantoPeakWeek(weekStart: string): boolean {
  const start = parse(weekStart);
  if (start === null) return false;
  const end = iso(start + 6 * DAY);
  return ENCANTO_PEAK_RANGES.some(range => weekStart <= range.end && end >= range.start);
}

/** Price multiple of the four-week price for a stay of this many total weeks: 1/2/3 weeks 45/65/85%, then weeks ÷ 4. */
export function encantoDurationMultiple(weeks: number): number {
  return weeks >= 4 ? weeks / 4 : ENCANTO_SHORT_STAY_RATIOS[weeks] ?? 0;
}

/** Tourist-visa extension fees for a stay of this many days after a 30- or 59-day entry. */
export function encantoVisaExtensions(stayDays: number, entryDays: 30 | 59): { count: number; total: number } {
  const count = Math.max(0, Math.ceil((stayDays - entryDays) / 30));
  const rates = entryDays === 30 ? ENCANTO_VISA_RATES_30 : ENCANTO_VISA_RATES_59;
  let total = 0;
  for (let index = 0; index < count; index++) total += rates[Math.min(index, rates.length - 1)];
  return { count, total };
}
