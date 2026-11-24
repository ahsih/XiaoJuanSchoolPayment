// EV Academy La Mer's versioned content document: courses, rooms, local fees, offers, family packages and
// quote-image copy. The page text lives in la-mer-page-content.ts. Published revisions override these defaults;
// LA_MER_POLICY_VERSION moves older saved documents onto the current defaults once, keeping edited values.
import { CiaContentConfig, CiaCourseContent, CiaLocalFeeRule, CiaQuoteImageSettings, CiaRoomContent } from '../cia-school/cia-content-config';
import { LaMerFamilyPrice, LaMerFamilyVersion } from './la-mer-types';

export const LA_MER_SCHOOL_ID = '578d438f-2974-4cf9-872c-e67e8253e8da';
export const LA_MER_SCHOOL_NAME = 'EV Academy La Mer';
export const LA_MER_PATH = '/philippines-study/cebu/ev-la-mer';
export const LA_MER_FAMILY_WEEKS = [1, 2, 3, 4, 6, 8];
export const isLaMerSchool = (name: string): boolean => /\bev\b.*la\s*mer/i.test(name);

/**
 * 1 (2026-11-23): Chinese course names and lines from the 2026 course guide, rooms grouped into 单人间 and 多人间,
 * the ARP row, the company's quote-image lines, and the old page text (now in la-mer-page-content.ts) dropped.
 * 2 (2026-11-25): family packages take neither the school offer nor the 思达启航 rate; untouched offer wording follows.
 */
export const LA_MER_POLICY_VERSION = 2;
type LaMerQuoteSettings = CiaContentConfig['quoteSettings'] & { laMerPolicyVersion?: number };

const familyPrice = (id: string, name: string, people: number, season: LaMerFamilyPrice['season'], values: number[]): LaMerFamilyPrice => ({
  id, name, people, season, enabled: true, prices: Object.fromEntries(LA_MER_FAMILY_WEEKS.map((weeks, i) => [String(weeks), values[i]])),
});

export const laMerFamilyVersions = (): LaMerFamilyVersion[] => [
  {
    id: 'family-2026', name: '2026亲子方案', start: '2026-01-25', end: '2026-12-31', priority: 1, enabled: true,
    exclusions: [{ start: '2026-06-14', end: '2026-08-09' }], peakRanges: [],
    packages: [
      familyPrice('pool-double', '直通泳池双人间', 2, 'all', [2280, 3575, 4675, 5500, 8050, 10600]),
      familyPrice('double', '标准双人间', 2, 'all', [2040, 3315, 4335, 5100, 7450, 9800]),
      familyPrice('pool-triple', '直通泳池三人间', 3, 'all', [3160, 5135, 6715, 7900, 11650, 15400]),
      familyPrice('triple', '标准三人间', 3, 'all', [2920, 4745, 6205, 7300, 10750, 14200]),
    ],
  },
  {
    id: 'family-2027', name: '2026–2027亲子方案', start: '2026-08-23', end: '2027-12-18', priority: 2, enabled: true,
    exclusions: [], peakRanges: [{ start: '2027-01-03', end: '2027-02-27' }, { start: '2027-06-27', end: '2027-08-28' }],
    packages: [
      familyPrice('pool-double', '直通泳池双人间', 2, 'off', [1960, 3185, 4165, 4900, 7150, 9400]),
      familyPrice('double', '标准双人间', 2, 'off', [1760, 2860, 3740, 4400, 6400, 8400]),
      familyPrice('pool-triple', '直通泳池三人间', 3, 'off', [2840, 4615, 6035, 7100, 10450, 13800]),
      familyPrice('triple', '标准三人间', 3, 'off', [2560, 4160, 5440, 6400, 9400, 12400]),
      familyPrice('quad', '标准四人间', 4, 'off', [3280, 5330, 6970, 8200, 12100, 16000]),
      familyPrice('pool-double', '直通泳池双人间', 2, 'peak', [2320, 3770, 4930, 5800, 8500, 11200]),
      familyPrice('double', '标准双人间', 2, 'peak', [2080, 3380, 4420, 5200, 7600, 10000]),
      familyPrice('pool-triple', '直通泳池三人间', 3, 'peak', [3360, 5460, 7140, 8400, 12400, 16400]),
      familyPrice('triple', '标准三人间', 3, 'peak', [3000, 4875, 6375, 7500, 11050, 14600]),
      familyPrice('quad', '标准四人间', 4, 'peak', [3840, 6240, 8160, 9600, 14200, 18800]),
    ],
  },
];

const course = (id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number): CiaCourseContent => ({
  id, name, tuition, tuition2027: tuition, schedule, suitable, note, sortOrder, enabled: true,
});

const defaultCourses = (): CiaCourseContent[] => [
  course('esl-classic', '经典ESL', 930, '4节一对一＋2节小组课＋2节大组课', '想全面提升听说读写、打好基础的学生',
    '一对一：听力、口语、阅读、写作；小组课：语法、听力；大组课：演讲、口语。', 0),
  course('senior', '熟龄英语（50岁以上）', 1120, '4节一对一＋2节小组课＋2节大组课', '50岁以上、想边学英语边交朋友的学员',
    '一对一：流利口语、会话、有效沟通、词汇；团体课：语法、听力、演讲、口语；另有适合熟龄学员的休闲活动。', 1),
  course('power-speaking-6', '口语强化6', 1120, '6节一对一＋1节小组课＋1节大组课', '工作常要开口、想多练口语和发音的大学生与上班族',
    '一对一全部练口语：流利口语、会话、有效沟通、词汇、时事讨论、阅读；小组演讲课，大组口语课。', 2),
  course('power-speaking-8', '口语强化8', 1300, '8节一对一', '想把正课都用来一对一练口语的学生',
    '在口语强化6的6节一对一之外，再加 Northstar 口语和公众演讲，共8节一对一。', 3),
];

const room = (id: string, name: string, label: string, group: string, fee: number, note: string, sortOrder: number): CiaRoomContent => ({
  id, name, label, code: id, location: '校内', group, fee, note, sortOrder, enabled: true,
});

const defaultRooms = (): CiaRoomContent[] => [
  room('single', '单人间', '单人间', '单人间', 1750, '一人一间，带浴缸；含三餐和清洁。', 0),
  room('pool-double', '直通泳池双人间', '泳池双人间', '多人间', 1150, '两人一间，房门外就是泳池；按每人计价，含三餐和清洁。', 1),
  room('double', '标准双人间', '双人间', '多人间', 1050, '两人一间；按每人计价，含三餐和清洁。', 2),
  room('triple', '三人间', '三人间', '多人间', 910, '三人一间；按每人计价，含三餐和清洁。', 3),
  room('quad', '四人间', '四人间', '多人间', 860, '四人一间；按每人计价，含三餐和清洁。', 4),
];

const fee = (id: string, name: string, amount: number, note: string, sortOrder: number, extra: Partial<CiaLocalFeeRule> = {}): CiaLocalFeeRule => ({
  id, name, currency: 'PHP', amount, note, sortOrder, enabled: true, billingRule: 'once', includeInTotal: true, ...extra,
});

const ARP_FEE = (): CiaLocalFeeRule =>
  fee('arp', 'ARP外国人登记', 300, '旅游签证需要续签时收取一次。', 3, { billingRule: 'long-term-or-first-extension' });

const defaultLocalFees = (): CiaLocalFeeRule[] => [
  fee('ssp', 'SSP特殊学习许可证', 7800, '一次办理；学习延期时重新办理要求以学校确认为准。', 0),
  fee('ssp-e-card', 'SSP E-CARD', 4500, '学校费用表列为一次性费用。', 1),
  fee('acr-i-card', 'ACR I-CARD', 4000, '第一次签证续签时办理（30天签证第5周起，59天签证第9周起），只收一次。', 2, { billingRule: 'first-visa-extension' }),
  ARP_FEE(),
  fee('student-id', '学生证', 500, '一次性费用。', 4),
  fee('electricity', '基础电费', 500, '每人每周含15度电，超出部分每度20比索，退房时从押金扣。', 5, { billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional' }),
  fee('management', '管理费', 500, '按每人住宿周数收取。', 6, { billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional' }),
  fee('water', '水费', 300, '按每人住宿周数收取。', 7, { billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional' }),
  fee('visa-30', '签证续签', 5430, '30天旅游签证：读满5周起续签，按学校费用表累计。', 8, { billingRule: 'visa-extension-schedule', rates: [5430, 11830, 16260, 20690, 25120] }),
  fee('visa-59', '59天签证续签', 6700, '59天旅游签证：读满9周起续签，按学校费用表累计。', 9, { billingRule: 'visa-extension-schedule', rates: [6700, 11130, 15560, 19990] }),
  fee('books', '教材费', 0, '入学测试后按书单实购，每本约150–500比索；不计入学杂费合计。', 10, { billingRule: 'optional', includeInTotal: false }),
  fee('deposit', '住宿押金（可退）', 2000, '1–3周2,000比索，4–8周3,000比索，9周以上5,000比索；退房检查后退还。', 11, { rates: [2000, 3000, 5000], billingRule: 'optional', includeInTotal: false, multiplyByStudents: true }),
  fee('pickup', '机场接机', 1200, '可选，也可自行前往；亲子套餐已含接机。', 12, { billingRule: 'optional', includeInTotal: false }),
];

/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';
const LOCAL_FEE_INTRO = '以下费用以比索计价，入学第一天在学校办公室缴纳；本报价仅供学生参考，具体以到校后实际产生及学校收取为准；教材、接机与可退押金另列。';

const defaultQuoteImageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: { registration: '一次性费用，老学员返校免费', course: '', accommodation: '', promotion: '' },
  promotionNotes: {},
  supplementalFeeNotes: {},
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: LOCAL_FEE_INTRO,
  localFeeNotes: {},
  serviceSectionTitle: '为什么选择思达启航？',
  benefits: [
    { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
    { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
    { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
    { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
  ],
  serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
  alumniBenefitTitle: '老学员专属优惠',
  alumniBenefitText: ALUMNI_BENEFIT_TEXT,
  noteSectionTitle: '报价说明',
  footerNotes: ['周日入住，最后一周周六中午12点前退房；房型和亲子名额以学校确认为准。', '最终以学校价格、空房及优惠确认为准。'],
});

export function createDefaultLaMerContentConfig(): CiaContentConfig {
  return {
    schemaVersion: 1, schoolCode: 'EV-LAMER',
    courses: defaultCourses(),
    rooms: defaultRooms(),
    localFees: defaultLocalFees(),
    quoteSettings: {
      registrationFee: 100, futurePriceRegistrationStart: '', futurePriceArrivalStart: '', shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.85 },
      peakSeasonFeePerWeek: 40,
      peakSeasonRanges: [{ id: 'summer-2026', label: '2026暑期旺季', start: '2026-07-05', end: '2026-08-29', enabled: true }],
      promotions: [
        { id: 'lamer-school-2026', name: '学校优惠', description: '2026年8月24日至12月31日期间开课（以周一开课日计），每人每周减50美元；所有普通课程和住宿适用，亲子套餐不参与。', enabled: true, sortOrder: 0, priority: 1, stackable: true, newStudentsOnly: false, discountType: 'per-course-week', discountValue: 50, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 1, minimumAccommodationWeeks: 1, arrivalStart: '2026-08-24', arrivalEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', ruleKind: 'lamer-course-start' },
        { id: 'lamer-sida', name: '思达启航折扣', description: '普通课程和住宿在学校优惠后享95折；亲子套餐、注册费、旺季附加费和到校学杂费不参与。', enabled: true, sortOrder: 1, priority: 2, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 1, minimumAccommodationWeeks: 1, coverageTarget: 'none', ruleKind: 'lamer-after-school' },
      ],
      localFeeIntro: LOCAL_FEE_INTRO,
      courseTableTitle: 'EV La Mer 4周课程费',
      courseTableNote: '以下为4周课程费（美元）。',
      groupClassNote: '每节课45分钟；小组课最多4人，大组课最多8人。',
      roomTableTitle: 'EV La Mer 4周食宿费',
      roomTableNote: '住宿费含住宿、一日三餐（周末也有）和房间清洁，按每人计价；亲子家庭请在报价里选亲子套餐。',
      stayPolicyTitle: 'La Mer 入住与离校',
      stayPolicies: [
        { label: '入住', value: '周日', note: '亲子家庭也可周六15点后入住，请提前告诉顾问。' },
        { label: '退房', value: '最后一周周六中午12点前', note: '退房后可在一楼大厅等候，行李可放警卫室。' },
        { label: '短期住宿', value: '1／2／3周按4周价的40%／65%／85%', note: '4周以上按周数折算。' },
      ],
      extraNightRates: [{ label: '提前入住或延住', amount: 2000 }],
      laMerPolicyVersion: LA_MER_POLICY_VERSION,
      laMer: { familyDepositPerPerson: 500, minimumChildAge: 7, familyComposition: 'any-guardian-child', familyExtras: 'separate', familyIncludedFeeIds: ['ssp', 'ssp-e-card', 'student-id', 'electricity', 'management', 'water', 'books', 'pickup'], familyVersions: laMerFamilyVersions() },
    } as LaMerQuoteSettings,
    quoteImageSettings: defaultQuoteImageSettings(),
    media: [],
  };
}

/** Course lines saved before version 1; only rows that still hold them are renamed. */
const OLD_COURSES: Record<string, { name: string; schedule: string; suitable: string; note: string }> = {
  'esl-classic': { name: 'ESL Classic｜综合英语', schedule: '4节一对一＋2节小组课＋2节大组课', suitable: '希望均衡提升听说读写', note: '一对一覆盖听力、口语、阅读、写作；团课含语法、听力、发表与口语。' },
  senior: { name: 'Senior｜熟龄英语', schedule: '4节一对一＋2节小组课＋2节大组课', suitable: '面向50岁以上的英语学习者', note: '综合语言能力结合休闲体验，活动按学校当期安排。' },
  'power-speaking-6': { name: 'Power Speaking 6｜强化口语', schedule: '6节一对一＋1节小组课＋1节大组课', suitable: '希望增加开口机会的学生与职场人士', note: '侧重日常对话、沟通表达和即时反馈。' },
  'power-speaking-8': { name: 'Power Speaking 8｜密集口语', schedule: '8节一对一', suitable: '希望集中进行个性化口语训练', note: '以一对一训练沟通、表达及口语流利度。' },
};
const OLD_ROOM_NOTES: Record<string, string> = {
  single: '独立居住空间，学校资料标注单人房浴缸。',
  'pool-double': 'Double A；直通泳池房型，按每人计价。',
  double: 'Double B；两人共住房型，按每人计价。',
  triple: '三人共住房型，按每人计价。',
  quad: '四人共住房型，按每人计价。',
};
const OLD_IMAGE_BENEFITS = ['0中介费', '报名协助', '费用核对', '学习期间支持'];
const OLD_FEE_NOTES: Record<string, string> = {
  'acr-i-card': '学校表格从9周起计入一次。',
  'student-id': '一次性费用。',
  electricity: '每人每周包含15千瓦时，超额每千瓦时20比索另付。',
  'visa-30': '使用学校费用表的累计金额，按所选初始签证及完整住宿周数判断。',
  'visa-59': '59天旅游签证从9周起按学校表格累计。',
  books: '入学测试后按书单实购，手册参考每本150–500比索；不含在普通固定费用合计中。',
  deposit: '按人另付：1–3周2,000比索，4–8周3,000比索，9–24周5,000比索；扣除欠费或损坏后退还。',
  pickup: '学校表列参考金额；多人共车的实际收费单位须确认，家庭套餐已含接机。',
};
const OLD_SETTINGS_TEXT: Partial<Record<keyof CiaContentConfig['quoteSettings'], string>> = {
  localFeeIntro: '以下为学校及相关部门收取的到校费用参考。普通教材按书单实购；机场接机与可退住宿押金另列，不计入固定学杂费合计。亲子已含项目不重复收费，续签及住宿押金按每位成员另付。',
  courseTableTitle: '普通课程费用 / 每人4周',
  courseTableNote: '以下为学校课程原价，住宿、注册费和当地费用另列。',
  groupClassNote: '每节45分钟，具体课表和选修开放情况以入学安排为准。',
  roomTableTitle: '普通住宿费用 / 每人4周',
  roomTableNote: '校内住宿含每日三餐和房间清洁；亲子家庭使用独立整包价。',
  stayPolicyTitle: '入住与退房',
};
/** Untouched older offer names and descriptions: version 0, then version 1 (which still discounted family packages). */
const OLD_PROMOTIONS: Record<string, { names: string[]; descriptions: string[] }> = {
  'lamer-school-2026': {
    names: ['学校优惠'],
    descriptions: [
      '2026年8月24日至12月31日期间开课，每位学员每周减50美元；所有课程和住宿适用。',
      '2026年8月24日至12月31日期间开课（以周一开课日计），每人每周减50美元；所有课程和住宿适用。',
    ],
  },
  'lamer-sida': {
    names: ['思达启航95折优惠'],
    descriptions: [
      '普通课程住宿在学校优惠后享95折；亲子套餐在学校优惠后整体享95折。注册费及套餐外另付项目不参与。',
      '课程和住宿在学校优惠后享95折；亲子套餐在学校优惠后整包享95折。注册费、旺季附加费和到校学杂费不参与。',
    ],
  },
};

/** Moves a document saved before LA_MER_POLICY_VERSION onto the current defaults, keeping what was edited. */
function upgradeLaMerContent(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as LaMerQuoteSettings;
  const version = settings.laMerPolicyVersion ?? 0;
  if (version >= LA_MER_POLICY_VERSION) return;
  for (const promotion of settings.promotions ?? []) {
    const old = OLD_PROMOTIONS[promotion.id];
    const fresh = defaults.quoteSettings.promotions.find(entry => entry.id === promotion.id);
    if (!old || !fresh) continue;
    if (old.names.includes(promotion.name)) promotion.name = fresh.name;
    if (old.descriptions.includes(promotion.description)) promotion.description = fresh.description;
  }
  settings.laMerPolicyVersion = LA_MER_POLICY_VERSION;
  if (version >= 1) return;
  for (const item of clone.courses) {
    const old = OLD_COURSES[item.id];
    const fresh = defaults.courses.find(entry => entry.id === item.id);
    if (!old || !fresh) continue;
    for (const key of ['name', 'schedule', 'suitable', 'note'] as const) {
      if (item[key] === old[key]) item[key] = fresh[key];
    }
  }
  for (const item of clone.rooms) {
    const fresh = defaults.rooms.find(entry => entry.id === item.id);
    if (!fresh) continue;
    if (item.group === '校内住宿') item.group = fresh.group;
    if (item.label === item.name || item.label === fresh.name) item.label = fresh.label;
    if (item.note === OLD_ROOM_NOTES[item.id]) item.note = fresh.note;
  }
  for (const item of clone.localFees) {
    const fresh = defaults.localFees.find(entry => entry.id === item.id);
    if (fresh && item.note === OLD_FEE_NOTES[item.id]) item.note = fresh.note;
  }
  if (!clone.localFees.some(item => item.id === 'arp')) {
    clone.localFees.push(ARP_FEE());
    clone.localFees.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  const textSettings = settings as unknown as Record<string, unknown>;
  const freshSettings = defaults.quoteSettings as unknown as Record<string, unknown>;
  for (const [key, old] of Object.entries(OLD_SETTINGS_TEXT)) {
    if (textSettings[key] === old) textSettings[key] = freshSettings[key];
  }
  if (settings.stayPolicies?.length === 2 && settings.stayPolicies[0]?.note === '非标准抵达时间请提前确认。') {
    settings.stayPolicies = defaults.quoteSettings.stayPolicies!.map(item => ({ ...item }));
  }
  if (!settings.extraNightRates?.length) settings.extraNightRates = defaults.quoteSettings.extraNightRates!.map(item => ({ ...item }));
  for (const range of settings.peakSeasonRanges ?? []) {
    if (range.id === 'summer-2026' && range.label === '2026普通课程暑期') range.label = '2026暑期旺季';
  }
  const image = clone.quoteImageSettings;
  const freshImage = defaults.quoteImageSettings;
  if (image.benefits.map(item => item.title).join() === OLD_IMAGE_BENEFITS.join()) {
    image.benefits = freshImage.benefits.map(item => ({ ...item }));
    image.serviceLocations = [...freshImage.serviceLocations];
    image.alumniBenefitTitle = freshImage.alumniBenefitTitle;
    image.alumniBenefitText = freshImage.alumniBenefitText;
  }
  if (image.paymentNotes.registration === '报名时按人一次收取。') image.paymentNotes.registration = freshImage.paymentNotes.registration;
  if (image.paymentNotes.accommodation === '含每日三餐和房间清洁') image.paymentNotes.accommodation = '';
  if (image.footerNotes.includes('周日入住，最后一周周六中午12点前退房；房型与名额以学校确认为准。')) image.footerNotes = [...freshImage.footerNotes];
  delete clone.laMerPage;
}

export function cloneLaMerContentConfig(value: CiaContentConfig): CiaContentConfig {
  const defaults = createDefaultLaMerContentConfig();
  if (value?.schemaVersion !== 1 || value.schoolCode !== 'EV-LAMER') return defaults;
  const copy = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  const clone: CiaContentConfig = {
    ...defaults, ...copy,
    quoteSettings: { ...defaults.quoteSettings, ...copy.quoteSettings, laMer: { ...defaults.quoteSettings.laMer!, ...copy.quoteSettings?.laMer } },
    quoteImageSettings: { ...defaults.quoteImageSettings, ...copy.quoteImageSettings, paymentNotes: { ...defaults.quoteImageSettings.paymentNotes, ...copy.quoteImageSettings?.paymentNotes } },
  };
  // A document saved without the version field predates version 1.
  if (copy.quoteSettings && (copy.quoteSettings as LaMerQuoteSettings).laMerPolicyVersion === undefined) {
    (clone.quoteSettings as LaMerQuoteSettings).laMerPolicyVersion = 0;
  }
  upgradeLaMerContent(clone, defaults);
  upgradeLaMerAcrNote(clone, defaults);
  return clone;
}

/**
 * ACR I-CARD moved to the first visa extension (user rule 2026-11-24); an untouched old note follows once.
 * Same version stamp as `acr-first-extension.ts` (ACR_NOTE_VERSION), written out here because the server-seed
 * script runs this file on its own, without other modules.
 */
const LA_MER_ACR_NOTE_VERSION = 20261124;
const LA_MER_OLD_ACR_NOTE = '停留满9周（超过59天）时办理一次。';
function upgradeLaMerAcrNote(clone: CiaContentConfig, defaults: CiaContentConfig): void {
  const settings = clone.quoteSettings as LaMerQuoteSettings & { acrNoteVersion?: number };
  if ((settings.acrNoteVersion ?? 0) >= LA_MER_ACR_NOTE_VERSION) return;
  const fresh = defaults.localFees.find(fee => fee.id === 'acr-i-card')!.note;
  const saved = clone.localFees.find(fee => fee.id === 'acr-i-card');
  if (saved?.note === LA_MER_OLD_ACR_NOTE) saved.note = fresh;
  const imageNotes = clone.quoteImageSettings.localFeeNotes;
  if (imageNotes?.['acr-i-card'] === LA_MER_OLD_ACR_NOTE) imageNotes['acr-i-card'] = fresh;
  settings.acrNoteVersion = LA_MER_ACR_NOTE_VERSION;
}
