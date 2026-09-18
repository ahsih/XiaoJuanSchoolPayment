export const MINT_WEEK_OPTIONS = [4, 8, 12, 16, 20, 24] as const;
export const MINT_LOCAL_FEE_WEEKS = [4, 8, 12, 16, 20, 24] as const;
export const MINT_PRICE_WEEKS = [1, 2, 3, 4, 8, 12, 16, 20, 24] as const;
export type MintQuoteWeeks = typeof MINT_WEEK_OPTIONS[number];
export type MintLocalFeeWeeks = typeof MINT_LOCAL_FEE_WEEKS[number];

export interface MintCourse {
  id: string;
  name: string;
  chineseName: string;
  schedule: string;
  suitable: string;
  prices: Record<number, number>;
}

export interface MintRoom {
  id: string;
  name: string;
  description: string;
  prices: Record<number, number>;
}

const price = (values: number[]) => Object.fromEntries(
  MINT_PRICE_WEEKS.map((weeks, index) => [weeks, values[index]]),
) as Record<number, number>;

export const MINT_COURSES: MintCourse[] = [
  { id: 'adult-esl', name: 'Adult ESL', chineseName: '成人综合英语', schedule: '每天4节一对一＋2节1:2 Speak-Up Duo＋2节1:8 Debate / Roundtable', suitable: '希望均衡训练听、说、读、写，并增加口语互动的成人学生。', prices: price([420, 625, 800, 950, 1900, 2850, 3800, 4750, 5700]) },
  { id: 'junior-esl', name: 'Junior ESL', chineseName: '青少年英语', schedule: '每天4节一对一＋4节团体课', suitable: 'Pre-A1至B1的青少年；具体分班按年龄和英语水平安排。', prices: price([550, 825, 1055, 1250, 2500, 3750, 5000, 6250, 7500]) },
  { id: 'speaking-master', name: 'Speaking Master', chineseName: '口语强化', schedule: '每天4节一对一＋2节1:2 Speak-Up Duo', suitable: '希望集中训练表达、互动与口语反应的学生。', prices: price([400, 600, 760, 900, 1800, 2700, 3600, 4500, 5400]) },
  { id: 'lite-esl', name: 'Lite ESL', chineseName: '轻量综合英语', schedule: '每天4节一对一；可参加开放的视听课和图书馆自习', suitable: '希望保留更多自由时间、以一对一训练为主的学生。', prices: price([370, 560, 720, 850, 1700, 2550, 3400, 4250, 5100]) },
];

export const MINT_ROOMS: MintRoom[] = [
  { id: 'premium-single', name: '高级单人间（Premium Single）', description: '独立空间；实际房间、楼层与空房以学校确认结果为准。', prices: price([540, 810, 1080, 1350, 2700, 4050, 5400, 6750, 8100]) },
  { id: 'premium-twin', name: '高级双人间（Premium Twin）', description: '两人入住；2026下半年淡季现金优惠仅适用于双人间。', prices: price([400, 600, 800, 1000, 2000, 3000, 4000, 5000, 6000]) },
  { id: 'deluxe-single', name: '标准单人间（Deluxe Single）', description: '标准房型的单人入住方案；实际空房须确认。', prices: price([480, 720, 960, 1200, 2400, 3600, 4800, 6000, 7200]) },
  { id: 'deluxe-twin', name: '标准双人间（Deluxe Twin）', description: '两人入住；2周成人及亲子全包方案使用此房型。', prices: price([380, 570, 760, 950, 1900, 2850, 3800, 4750, 5700]) },
];

export interface MintLocalFeeRow {
  id: string;
  name: string;
  amounts: Record<MintLocalFeeWeeks, number>;
  note: string;
}

const local = (values: number[]) => Object.fromEntries(
  MINT_LOCAL_FEE_WEEKS.map((weeks, index) => [weeks, values[index]]),
) as Record<MintLocalFeeWeeks, number>;

export const MINT_LOCAL_FEES: MintLocalFeeRow[] = [
  { id: 'deposit', name: '房间押金（可退）', amounts: local([3000, 3000, 3000, 3000, 3000, 3000]), note: '无损坏、无欠费时按学校规则结算退还；官方当地费总额包含此项。' },
  { id: 'visa', name: '签证延期累计费用', amounts: local([0, 5140, 11550, 15990, 21030, 25470]), note: '按学校公布的对应周数累计金额估算，最终以移民局和学校实收为准。' },
  { id: 'ssp', name: 'SSP特殊学习许可证', amounts: local([7800, 7800, 7800, 7800, 7800, 7800]), note: '本次学习期间的一次性费用。' },
  { id: 'ssp-e-card', name: 'SSP E-Card', amounts: local([4500, 4500, 4500, 4500, 4500, 4500]), note: '与SSP相关的证件费用。' },
  { id: 'acr', name: 'ACR I-Card', amounts: local([0, 0, 4000, 4000, 4000, 4000]), note: '12周及以上按学校表格计入。' },
  { id: 'pickup', name: '薄荷岛机场接机', amounts: local([500, 500, 500, 500, 500, 500]), note: '按薄荷岛邦劳国际机场（TAG）接机计算。' },
  { id: 'maintenance', name: '综合管理费', amounts: local([4000, 8000, 12000, 16000, 20000, 24000]), note: '按1,000比索／周计算。' },
  { id: 'water', name: '水费', amounts: local([1000, 2000, 3000, 4000, 5000, 6000]), note: '按250比索／周计算。' },
  { id: 'electricity', name: '基础电费', amounts: local([2000, 4000, 6000, 8000, 10000, 12000]), note: '每周包含20千瓦时；超出部分按20比索／千瓦时结算。' },
];

export const MINT_LOCAL_TOTALS: Record<MintLocalFeeWeeks, number> = {
  4: 22800, 8: 34940, 12: 52350, 16: 63790, 20: 75830, 24: 87270,
};

export const MINT_REGISTRATION_FEE = 100;
export const MINT_PHP_PER_CNY = 8;

export const MINT_FAMILY_PRICES: Record<'one-one' | 'one-two' | 'two-two', Record<number, number>> = {
  'one-one': { 4: 5000, 6: 7500, 8: 10000, 10: 12500, 12: 15000 },
  'one-two': { 4: 6500, 6: 9750, 8: 13000, 10: 16250, 12: 19500 },
  'two-two': { 4: 10000, 6: 15000, 8: 20000, 10: 25000, 12: 30000 },
};

export const MINT_FAMILY_UPGRADES: Record<'premium-twin' | 'premium-single', Record<number, number>> = {
  'premium-twin': { 4: 250, 6: 375, 8: 500, 10: 625, 12: 750 },
  'premium-single': { 4: 400, 6: 600, 8: 800, 10: 1000, 12: 1200 },
};

export const mintFamilyNoCourseDeduction = (weeks: number): number => weeks >= 12 ? 500 : weeks >= 8 ? 375 : 250;
export const mintLowSeasonCashDiscount = (weeks: number): number => weeks >= 20 ? 1250 : weeks >= 16 ? 900 : weeks >= 12 ? 600 : weeks >= 8 ? 350 : weeks >= 4 ? 150 : 0;

export const mintEndDate = (startDate: string, weeks: number): string => {
  const date = new Date(`${startDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== startDate || !Number.isInteger(weeks) || weeks <= 0) return '';
  date.setUTCDate(date.getUTCDate() + weeks * 7 - 1);
  return date.toISOString().slice(0, 10);
};

export const isSunday = (value: string): boolean => {
  const date = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && date.getUTCDay() === 0;
};
