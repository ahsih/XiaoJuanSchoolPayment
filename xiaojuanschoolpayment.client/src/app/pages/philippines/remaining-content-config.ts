import { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule, CiaQuoteImageSettings } from './cia-school/cia-content-config';
import { BTES_COURSES, BTES_LOW_SEASON_PERIODS, BTES_REGISTRATION_FEE, BTES_ROOMS } from './btes-school/btes-pricing';
import { upgradeAcrNotes } from './acr-first-extension';
import { ASSOCIATION_PEAK_POLICY_VERSION } from './association-peak-surcharge';

type SchoolCode = Extract<CiaContentConfig['schoolCode'], 'BTES' | 'BLUE-OCEAN' | 'TARGET' | 'WALES'>;
type CourseSeed = { id: string; name: string; price: number; schedule: string; note: string };
type RoomSeed = { id: string; name: string; price: number; note: string; location?: '校内' | '校外' };

/** ACR I-Card comes with the first visa extension (user rule 2026-11-24, every Philippine school). */
const ACR_FIRST_EXTENSION_NOTE = '第一次签证续签时预估办理（30天签证第5周起，59天签证第9周起）。';

const fee = (id: string, name: string, amount: number, rule: CiaLocalFeeRule['billingRule'], note: string, sortOrder: number, includeInTotal = true): CiaLocalFeeRule => ({
  id, name, amount, billingRule: rule, note, sortOrder, includeInTotal, currency: 'PHP', enabled: true,
});
const promo = (id: string, name: string, description: string, sortOrder: number, ruleKind: string, extras: Partial<CiaPromotionRule> = {}): CiaPromotionRule => ({
  id, name, description, sortOrder, ruleKind, enabled: true, priority: sortOrder * 10,
  stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 0,
  appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 0,
  minimumAccommodationWeeks: 0, coverageTarget: 'none', ...extras,
});

const image = (school: string, promotionNotes: Record<string, string>, supplementalFeeNotes: Record<string, string> = {}): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '一次性费用；返校、套餐或免注册费规则由当前报价自动判断。',
    course: '课程、日期、周数和金额按当前选择自动计算。',
    accommodation: '住宿、日期、周数和金额按当前选择自动计算；空房须确认。',
    promotion: '优惠名称、金额和资格由当前报价规则自动计算。',
  },
  promotionNotes,
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '学杂费由学校及菲律宾相关部门到校收取；以下按当前选择预估，最终以实际收取为准。',
  localFeeNotes: {}, supplementalFeeNotes,
  serviceSectionTitle: '为什么选择思达启航？',
  benefits: [
    { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
    { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
    { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
    { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
  ],
  serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
  alumniBenefitTitle: '老学员专属优惠', alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
  noteSectionTitle: '报价说明',
  footerNotes: [`${school}课程与住宿日期、价格及优惠按当前选择自动计算。`, '到校费用、签证及教材按实际发生和学校最新政策确认。', '最终以学校价格、空房及优惠资格确认为准。'],
});

const base = (code: SchoolCode, courses: CourseSeed[], rooms: RoomSeed[], localFees: CiaLocalFeeRule[], promotions: CiaPromotionRule[], registrationFee: number, shortStayRatios: Record<string, number>, peakSeasonFeePerWeek: number, peakSeasonRanges: CiaContentConfig['quoteSettings']['peakSeasonRanges'], settings: CiaQuoteImageSettings): CiaContentConfig => ({
  schemaVersion: 1, schoolCode: code,
  courses: courses.map((item, sortOrder) => ({ id: item.id, name: item.name, tuition: item.price, tuition2027: item.price, schedule: item.schedule, suitable: item.note, note: item.note, enabled: true, sortOrder })),
  rooms: rooms.map((item, sortOrder) => ({ id: item.id, name: item.name, label: item.name, code: item.id, location: item.location ?? '校内', group: item.location === '校外' ? '校外住宿' : '校内住宿', fee: item.price, note: item.note, enabled: true, sortOrder })),
  localFees, quoteSettings: {
    registrationFee, futurePriceRegistrationStart: '', futurePriceArrivalStart: '', shortStayRatios,
    peakSeasonFeePerWeek, peakSeasonRanges, promotions,
    localFeeIntro: settings.localFeeIntro, courseTableTitle: `${code}课程与学费`, courseTableNote: '课程内容及价格以当前学校资料为准。',
    groupClassNote: '课程安排、入学资格和特殊规则须按所选课程确认。', roomTableTitle: `${code}住宿费`, roomTableNote: '住宿价格按每人计算，空房须确认。',
    stayPolicyTitle: '入住与报价提醒', stayPolicies: [{ label: '入住日期', value: '周日入住', note: '离校和退房按周六计算。' }], extraNightRates: [],
  }, quoteImageSettings: settings, media: [],
});

const clone = (value: CiaContentConfig, defaults: CiaContentConfig): CiaContentConfig => {
  const result = structuredClone(value);
  if (result?.schemaVersion !== 1 || result.schoolCode !== defaults.schoolCode) return defaults;
  result.courses ??= structuredClone(defaults.courses); result.rooms ??= structuredClone(defaults.rooms); result.localFees ??= structuredClone(defaults.localFees); result.media ??= [];
  result.quoteSettings = { ...defaults.quoteSettings, ...(result.quoteSettings ?? {}) };
  result.quoteSettings.promotions = result.quoteSettings.promotions ?? structuredClone(defaults.quoteSettings.promotions);
  result.quoteImageSettings = { ...structuredClone(defaults.quoteImageSettings), ...(result.quoteImageSettings ?? {}) };
  result.quoteImageSettings.paymentNotes = { ...defaults.quoteImageSettings.paymentNotes, ...(result.quoteImageSettings.paymentNotes ?? {}) };
  result.quoteImageSettings.promotionNotes = { ...defaults.quoteImageSettings.promotionNotes, ...(result.quoteImageSettings.promotionNotes ?? {}) };
  result.quoteImageSettings.localFeeNotes = { ...defaults.quoteImageSettings.localFeeNotes, ...(result.quoteImageSettings.localFeeNotes ?? {}) };
  result.quoteImageSettings.supplementalFeeNotes = { ...defaults.quoteImageSettings.supplementalFeeNotes, ...(result.quoteImageSettings.supplementalFeeNotes ?? {}) };
  return result;
};

export const createDefaultBtesContentConfig = (): CiaContentConfig => base(
  'BTES',
  BTES_COURSES.map(item => ({ id: item.id, name: `${item.name} ${item.chineseName}`, price: item.fee4w, schedule: item.lessons, note: item.suitable })),
  BTES_ROOMS.map(item => ({ id: item.id, name: item.name, price: item.fee4w, schedule: '', note: item.note } as RoomSeed)),
  [
    fee('ssp', 'SSP特殊学习许可证', 7800, 'once', '更换学校或超过许可期限时可能需要重新办理。', 0), fee('ssp-e-card', 'SSP E-Card', 4500, 'once', '入学时与SSP同时办理。', 1),
    fee('acr', 'ACR I-Card外国人身份证', 4000, 'first-visa-extension', ACR_FIRST_EXTENSION_NOTE, 2), fee('visa', '签证延期', 5130, 'visa-extension-schedule', '按签证类型和完整停留时间预估。', 3),
    fee('student-id', '学生证', 300, 'once', '一次性费用。', 4), fee('books', '教材费', 2000, 'per-course-period', '按课程周数和实际购买教材结算。', 5), fee('water', '水费', 300, 'per-accommodation-period', '按住宿周数计算。', 6),
    fee('management', '宿舍管理费', 500, 'per-accommodation-period', '按住宿周数计算。', 7), fee('electricity', '宿舍电费', 200, 'per-accommodation-period', '按房型和住宿周数计算，超额用电另计。', 8), fee('pickup', '宿务机场接机', 1200, 'optional', '按所选接机时段计算。', 9), fee('ecc', 'ECC费用', 700, 'long-term-or-first-extension', '超过6个月时按规定办理。', 10),
  ],
  [promo('btes-group-low-season', 'BTES多人淡季优惠', '3人或以上符合活动条件时按学校规则计算。', 0, 'btes-group-low-season'), promo('btes-individual-low-season', 'BTES个人淡季优惠', '个人3周或4周以上符合活动条件时计算。', 1, 'btes-individual-low-season'), promo('sida', '思达启航95折', '学校优惠后对普通课程与住宿计算95折。', 2, 'btes-sida-95', { discountType: 'percentage', discountValue: 5, appliesTo: 'tuition-and-accommodation' })],
  BTES_REGISTRATION_FEE, { '1': .4, '2': .65, '3': .85 }, 60,
  [{ id: 'btes-peak-2027', label: '2027暑期旺季', start: '2027-07-04', end: '2027-08-28', enabled: true }],
  image('BTES', { 'btes-group-low-season': '符合多人活动条件时按学校规则自动计算。', 'btes-individual-low-season': '符合个人淡季活动条件时按学校规则自动计算。', sida: '普通方案先扣学校活动，再对剩余课程与住宿计算思达启航95折。' }, { 'payment:未成年人管理费': '按学生年龄和实际课程周数自动计算。', 'payment:旺季附加费': '2027/07/04–08/28按每名学生实际重叠学习周收取60美元／周；同一周课程与住宿只计一次，不参与优惠。' }),
);
export const cloneBtesContentConfig = (value: CiaContentConfig) => {
  const defaults = createDefaultBtesContentConfig();
  const result = clone(value, defaults);
  upgradeAcrNotes(result, defaults, { acr: ['完整停留超过59天时预估办理。'] });
  if ((result.quoteSettings.peakSeasonPolicyVersion ?? 0) < ASSOCIATION_PEAK_POLICY_VERSION) {
    const confirmed = defaults.quoteSettings.peakSeasonRanges[0];
    const saved = result.quoteSettings.peakSeasonRanges?.find(range => range.id === confirmed.id || range.label.includes('2027'));
    if (saved) Object.assign(saved, confirmed);
    else (result.quoteSettings.peakSeasonRanges ??= []).push(structuredClone(confirmed));
    result.quoteSettings.peakSeasonFeePerWeek = 60;
    result.quoteSettings.peakSeasonPolicyVersion = ASSOCIATION_PEAK_POLICY_VERSION;
  }
  return result;
};

// Cebu Blue Ocean has its own dated document (2026 and 2027 prices); see cebu-blue-ocean-school/cboa-content-config.ts.
export { cloneBlueOceanContentConfig, createDefaultBlueOceanContentConfig } from './cebu-blue-ocean-school/cboa-content-config';

// TARGET has its own document on the shared template; see target-school/target-content-config.ts.
export { cloneTargetContentConfig, createDefaultTargetContentConfig } from './target-school/target-content-config';

const walesCourses:CourseSeed[]=[['eep-lite','EEP Lite',650,'3节一对一','轻量生活沟通英文'],['eep','EEP',800,'4节一对一＋1节团体课','生活口语与基础沟通'],['infinity-lite','Infinity Lite',750,'3节一对一＋1节团体课','听说读写基础提升'],['infinity-standard','Infinity Standard',880,'4节一对一＋2节团体课','综合英文标准强度'],['infinity-intensive','Infinity Intensive',1000,'5节一对一＋3节团体课','综合英文高强度训练'],['infinity-pro','Infinity Pro',1200,'4节一对一＋3节团体课','高阶目标课程'],['pte','PTE',1200,'5节一对一＋2节团体课','仅开放4、8、12周'],['ielts','IELTS',1200,'5节一对一＋2节团体课','雅思课程'],['ielts-guarantee','IELTS Guarantee',1300,'6节一对一＋2节团体课','8周起'],['junior-esl','Junior ESL',1300,'5节一对一＋3节团体课','青少年课程'],['junior-ielts','Junior IELTS',1400,'5节一对一＋2节团体课','青少年雅思']].map(([id,name,price,schedule,note])=>({id:String(id),name:String(name),price:Number(price),schedule:String(schedule),note:String(note)}));
const walesRooms:RoomSeed[]=[['lower-studio-single','Lower Studio｜单人房',1200],['lower-studio-family-2','Lower Studio｜家庭2人房',900],['upper-studio-single','Upper Studio｜单人房',1300],['upper-studio-family-2','Upper Studio｜家庭2人房',1000],['upper-premium-studio-single','Upper Premium Studio｜单人房',1700],['upper-premium-studio-double','Upper Premium Studio｜双人房',1200],['upper-premium-studio-family-3','Upper Premium Studio｜家庭3人房',1030],['condo-type-semi-single','Condo Type｜半单人房',1400],['condo-type-family-3','Condo Type｜家庭3人房',1080],['condo-type-family-4','Condo Type｜家庭4人房',1075],['share-type-single-veranda','Share Type｜单人房（露台）',1150],['share-type-single','Share Type｜单人房',1050],['share-type-double','Share Type｜双人房',950],['lower-premium-studio-single','Lower Premium Studio｜单人房',1600],['lower-premium-studio-double','Lower Premium Studio｜双人房',1100],['lower-premium-studio-family-3','Lower Premium Studio｜家庭3人房',930]].map(([id,name,price])=>({id:String(id),name:String(name),price:Number(price),note:'房型设施、床位和空房须由学校确认。'}));
export const createDefaultWalesContentConfig=():CiaContentConfig=>{
  const settings=image('WALES',{'wales-year-end-2026':'指定入学日期及周数的住宿按六折计算；限额及资格须确认。','wales-long-stay':'连续课程周按当前长期档位计算，旺季重叠会减少优惠。'},{'optional:教材费':'按课程类型和课程周数计算。','optional:机场接机':'按所选接机地点、团体或个人安排计算。'});
  settings.footerNotes=['价格、优惠名额、房型空位、实际上课天数和当地费用以WALES正式账单为准。'];
  const config=base('WALES',walesCourses,walesRooms,[fee('ssp','SSP特殊学习许可证',7800,'once','学校价表列示的一次性费用。',0),fee('ssp-card','SSP I-CARD',4500,'once','一次性身份卡费用。',1),fee('visa','签证续签',6410,'visa-extension-schedule','按初始签证与停留时间预估。',2),fee('acr','ACR I-CARD',4000,'first-visa-extension','首次需要续签时计入。',3),fee('management','管理费',1000,'per-accommodation-period','按住宿周数比例计算。',4),fee('utilities','水电费',3500,'per-accommodation-period','按住宿周数比例计算。',5),fee('student-id','学生证',300,'once','一次性费用。',6),fee('deposit','宿舍保证金',5000,'once','符合退还条件时按校方规定退回。',7)], [promo('wales-year-end-2026','2026年末住宿六折优惠','指定入学日期和周数的住宿按六折计算。',0,'wales-year-end'),promo('wales-long-stay','长周数优惠','连续课程周按8／12／16／20／24周档位优惠。',1,'wales-long-stay')],100,{},60,[{id:'wales-peak-2027',label:'2027暑期旺季',start:'2027-06-27',end:'2027-08-22',enabled:true}],settings);
  config.quoteSettings.peakSeasonPolicyVersion=ASSOCIATION_PEAK_POLICY_VERSION;
  return config;
};
export const cloneWalesContentConfig=(value:CiaContentConfig)=>{
  const defaults=createDefaultWalesContentConfig(); const result=clone(value,defaults);
  if((result.quoteSettings.peakSeasonPolicyVersion??0)<ASSOCIATION_PEAK_POLICY_VERSION){
    const confirmed=defaults.quoteSettings.peakSeasonRanges[0]; const saved=result.quoteSettings.peakSeasonRanges?.find(range=>range.id===confirmed.id||range.label.includes('2027'));
    if(saved) Object.assign(saved,confirmed); else (result.quoteSettings.peakSeasonRanges??=[]).push(structuredClone(confirmed));
    result.quoteSettings.peakSeasonFeePerWeek=60; result.quoteSettings.peakSeasonPolicyVersion=ASSOCIATION_PEAK_POLICY_VERSION;
  }
  return result;
};
