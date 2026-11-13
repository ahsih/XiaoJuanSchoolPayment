/** User-supplied official January 2027 tables. A missing duration is deliberately not priced. */
const prices = (values: number[]): Record<string, number> => Object.fromEntries(
  [1, 2, 3, 4, 8, 12, 16, 24].flatMap((weeks, index) => values[index] > 0 ? [[String(weeks), values[index]]] : []),
);

export const IBREEZE_TUITION_2027: Record<string, Record<string, number>> = {
  'power-esl': prices([400, 650, 860, 1040, 2080, 3120, 4160, 6240]),
  'intensive-beginner': prices([400, 650, 860, 1040, 2080, 3120, 4160, 6240]),
  'light-esl': prices([340, 550, 720, 890, 1780, 2670, 3560, 5340]),
  'intensive-speaking': prices([320, 520, 650, 770, 1540, 2310, 3080, 4620]),
  'ielts-starter': prices([0, 0, 890, 1040, 2080, 0, 0, 0]),
  'ielts-target': prices([0, 0, 0, 1190, 2380, 3570, 4760, 7140]),
  'toeic-target': prices([0, 0, 900, 1020, 2040, 3060, 4080, 6120]),
  'junior-english': prices([570, 850, 1090, 1290, 2580, 3870, 5160, 7740]),
  'general-business-and-bec': prices([370, 570, 750, 890, 0, 0, 0, 0]),
};

export const IBREEZE_ROOMS_2027: Record<string, Record<string, number>> = {
  'single-main': prices([550, 850, 1090, 1350, 2700, 4050, 5400, 8100]),
  'twin-main': prices([370, 595, 770, 950, 1900, 2850, 3800, 5700]),
  'triple-main': prices([330, 510, 680, 790, 1580, 2370, 3160, 4740]),
  'quad-main': prices([300, 480, 620, 720, 1440, 2160, 2880, 4320]),
  'single-ib2': prices([570, 870, 1120, 1390, 2780, 4170, 5560, 8340]),
  'twin-ib2': prices([410, 640, 810, 990, 1980, 2970, 3960, 5940]),
  'quad-ib2': prices([320, 500, 640, 750, 1500, 2250, 3000, 4500]),
  'off-campus-standard-single': prices([590, 890, 1140, 1450, 2900, 4350, 5800, 8700]),
  'off-campus-superior-single': prices([610, 910, 1170, 1490, 2980, 4470, 5960, 8940]),
  'off-campus-standard-twin': prices([450, 680, 870, 1050, 2100, 3150, 4200, 6300]),
  'off-campus-superior-twin': prices([470, 700, 890, 1100, 2200, 3300, 4400, 6600]),
  'off-campus-family': prices([370, 550, 740, 890, 1780, 2670, 3560, 5340]),
};

export const IBREEZE_POLICY_VERSION = 20261110;
export const IBREEZE_PRICE_REGISTRATION_START = '2027-01-01';
export const IBREEZE_PROMOTION_BLACKOUT = { start: '2027-01-03', end: '2027-01-23' };
