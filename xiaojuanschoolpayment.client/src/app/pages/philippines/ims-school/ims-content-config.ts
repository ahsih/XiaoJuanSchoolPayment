import { CiaContentConfig, CiaPromotionRule } from '../cia-school/cia-content-config';
import {
  IMS_ADDITIONAL_CLASSES,
  IMS_COURSES,
  IMS_OFF_SEASON_CLASS_EXCHANGE_PERIODS,
  IMS_OFF_SEASON_SOCIAL_REQUIREMENTS,
  IMS_REGISTRATION_FEE,
  IMS_ROOMS,
} from './ims-pricing';

const promotion = (id: string, name: string, description: string, sortOrder: number, ruleKind: string): CiaPromotionRule => ({
  id, name, description, enabled: true, sortOrder, priority: sortOrder, stackable: true,
  newStudentsOnly: false, discountType: 'fixed', discountValue: 0, appliesTo: 'tuition-and-accommodation',
  waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none', ruleKind,
});

/** Versioned IMS content used by the public page, calculator, image and employee workbench. */
export const createDefaultImsContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'IMS',
  courses: IMS_COURSES.map((item, index) => ({
    id: item.id,
    name: item.name,
    courseType: item.category,
    tuition: item.prices[4] ?? 0,
    tuition2027: item.prices[4] ?? 0,
    feeByWeeks: Object.fromEntries(Object.entries(item.prices).map(([weeks, amount]) => [weeks, amount ?? 0])),
    allowedWeeks: [...item.allowedWeeks],
    suitable: item.suitable,
    schedule: item.schedule,
    note: item.allowedWeeks.length < 9 ? `仅公布${item.allowedWeeks.join('、')}周价格；其他周数不可报价。` : '使用价目表中的明确周数价格；1–3周不按4周价倒算。',
    enabled: true,
    sortOrder: index,
  })),
  rooms: IMS_ROOMS.map((item, index) => ({
    id: item.id,
    name: item.name,
    label: item.name,
    code: item.id,
    location: '校内',
    group: '校内宿舍',
    fee: item.prices[4],
    feeByWeeks: Object.fromEntries(Object.entries(item.prices)),
    allowedWeeks: [1, 2, 3, 4, 8, 12, 16, 20, 24],
    note: item.note,
    enabled: true,
    sortOrder: index,
  })),
  localFees: [
    { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 8000, billingRule: 'once', includeInTotal: true, note: '强制费用；按2026年7月1日起当地费用表。', enabled: true, sortOrder: 0 },
    { id: 'e-card', name: 'E-Card', currency: 'PHP', amount: 4000, billingRule: 'once', includeInTotal: true, note: '强制费用；最终办理要求以学校及当期政策为准。', enabled: true, sortOrder: 1 },
    { id: 'books', name: '教材费', currency: 'PHP', amount: 3000, billingRule: 'once', includeInTotal: true, note: '费用表预估；因课程和级别不同，最终按实际购买确认。', enabled: true, sortOrder: 2 },
    { id: 'student-id', name: '学生证', currency: 'PHP', amount: 300, billingRule: 'once', includeInTotal: true, note: '强制一次性费用。', enabled: true, sortOrder: 3 },
    { id: 'deposit', name: '宿舍／钥匙押金（可退）', currency: 'PHP', amount: 3000, billingRule: 'once', includeInTotal: true, note: '费用表合计包含；无损坏并归还钥匙后按学校规则退还。', enabled: true, sortOrder: 4 },
    { id: 'water', name: '水费', currency: 'PHP', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional', includeInTotal: true, note: '500比索／住宿周。', enabled: true, sortOrder: 5 },
    { id: 'electricity', name: '基础电费', currency: 'PHP', amount: 500, billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional', includeInTotal: true, note: '500比索／住宿周。', enabled: true, sortOrder: 6 },
    { id: 'aircon', name: '空调费', currency: 'PHP', amount: 250, secondaryAmount: 30, secondaryLabel: '超额／kW', billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional', includeInTotal: true, note: '250比索／周，包含100kW／4周；超额30比索／kW。', enabled: true, sortOrder: 7 },
    { id: 'visa-extension', name: '签证延长累计费用', currency: 'PHP', amount: 5050, rates: [5050, 6800, 4450, 4450, 4450], billingRule: 'visa-extension-schedule', includeInTotal: true, note: '5–8周累计5,050；9–12周11,850；13–16周16,300；17–20周20,750；21–24周25,200比索。', enabled: true, sortOrder: 8 },
    { id: 'acr-i-card', name: 'ACR I-Card', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: true, note: '从9周起计入一次。', enabled: true, sortOrder: 9 },
    { id: 'pickup', name: '宿务机场接机', currency: 'PHP', amount: 1000, billingRule: 'once', includeInTotal: true, note: '费用表TOTAL AMOUNT包含一次；如自行前往可取消。', enabled: true, sortOrder: 10 },
    { id: 'dropoff', name: '宿务机场送机', currency: 'PHP', amount: 1000, billingRule: 'optional', includeInTotal: false, note: '可选服务，不在费用表TOTAL AMOUNT内。', enabled: true, sortOrder: 11 },
    { id: 'walk-in-lunch', name: '走读午餐', currency: 'PHP', amount: 6000, billingRule: 'optional', periodWeeks: 4, includeInTotal: false, note: '走读学生可选；6,000比索／4周。', enabled: true, sortOrder: 12 },
    ...IMS_ADDITIONAL_CLASSES.map((item, index) => ({ id: `additional-${item.id}`, name: item.name, currency: 'USD' as const, amount: item.price4w, billingRule: 'optional' as const, periodWeeks: 4, includeInTotal: false, note: '当地费用表公布的额外课程价格；每4周、按实际选择计入美元应付。', enabled: true, sortOrder: 13 + index })),
    { id: 'guardian-service', name: 'Guardian Service', currency: 'USD', amount: 450, billingRule: 'optional', periodWeeks: 4, includeInTotal: false, note: '独立可选服务；与免费晚间托管及国际学生学校管理服务不是同一项目。', enabled: true, sortOrder: 19 },
    { id: 'school-management', name: 'School Management for International Students', currency: 'USD', amount: 2100, billingRule: 'optional', periodWeeks: 4, includeInTotal: false, note: '独立可选服务；与免费晚间托管及Guardian Service不是同一项目。', enabled: true, sortOrder: 20 },
  ],
  quoteSettings: {
    registrationFee: IMS_REGISTRATION_FEE,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: {},
    peakSeasonFeePerWeek: 0,
    peakSeasonRanges: [],
    promotions: [
      promotion('ims-two-plus-two', '2+2达人活动', `淡季完整连续4周段按明确2周课程价和2周住宿价收费；每次连续学习最多一次。${IMS_OFF_SEASON_SOCIAL_REQUIREMENTS.join('')}`, 0, 'ims-two-plus-two'),
      { ...promotion('ims-low-season-300', '淡季立减300美元', '总学习期至少12周；每个符合淡季月份的连续4周段减300美元，不能与同段2+2叠加。', 1, 'ims-low-season-300'), minimumCourseWeeks: 12 },
      { ...promotion('ims-long-stay', '长期优惠', '全年适用；按2+2折算后的付费课程周数，一次性从课程费减50／100／200／300／400美元。', 2, 'ims-long-stay'), discountTiers: { 8: 50, 12: 100, 16: 200, 20: 300, 24: 400 }, appliesTo: 'tuition' },
      { ...promotion('ims-sida-95', '思达课程及住宿95折', '先扣学校活动和固定减免，再对剩余课程费与住宿费按95折；注册费、比索当地费和其他服务不参加。', 3, 'ims-sida-95'), discountType: 'percentage', discountValue: 5 },
    ],
    localFeeIntro: '2026年7月1日起当地费用；官方TOTAL AMOUNT包含一次接机和可退押金。可选送机、走读午餐、超额用电及额外课程另列。',
    courseTableTitle: 'IMS 2026课程费（美元）',
    courseTableNote: '课程费与住宿费分开；1、2、3、4、8、12、16、20、24周使用价目表明确价格。保证班空白周数不可报价。',
    groupClassNote: `淡季课程权益：2节团体课可换1节一对一，不直接改变学费。有效期${IMS_OFF_SEASON_CLASS_EXCHANGE_PERIODS.map((period) => `${period.start.replace(/-/g, '/')}–${period.end.replace(/-/g, '/')}`).join('；')}。`,
    roomTableTitle: 'IMS 2026住宿费（美元）',
    roomTableNote: '住宿费与课程费独立保存和计算；按价目表明确周数价格。',
    stayPolicyTitle: 'IMS入学与住宿日期规则',
    stayPolicies: [
      { label: '入学／入住', value: '周日', note: '每个课程和住宿段必须从周日开始。' },
      { label: '离校／退房', value: '周六', note: '结束日按开始日 + 周数 × 7 − 1天计算。' },
      { label: '分段报价', value: '各段不可重叠', note: '课程和住宿可以分段选择，但日期重叠会阻止生成报价。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '课程、住宿与优惠明细',
    paymentNotes: {
      registration: '每名注册学生一次性100美元，任何优惠或返校状态均不能减免。',
      course: '使用价目表中的明确周数课程价。',
      accommodation: '使用价目表中的明确周数住宿价。',
      promotion: '学校活动先计算，思达95折随后只作用于剩余课程费与住宿费。',
    },
    localFeeSectionTitle: '到校后比索费用明细',
    localFeeIntro: '按2026年7月1日起费用表估算；押金、接机、可选项目和实际购买类费用分别标注。',
    localFeeNotes: {},
    serviceSectionTitle: '为什么选择思达启航？',
    benefits: [
      { title: '价格逐项可核验', text: '课程、住宿、学校活动、95折和注册费分别列示' },
      { title: '报名与签证协助', text: '协助确认空房、材料、付款与行前安排' },
      { title: '亲子方案核对', text: '家长课程、孩子课量与转课关系逐人校验' },
      { title: '宿务驻点支持', text: '学习期间遇到问题可持续联系顾问' },
    ],
    serviceLocations: ['深圳总部', '菲律宾宿务驻点', '欧洲驻点'],
    alumniBenefitTitle: 'IMS优惠提醒',
    alumniBenefitText: '2+2、淡季立减和长期优惠均按每名学生及每个4周段独立判断，最终资格须由学校确认。',
    noteSectionTitle: '报价说明',
    footerNotes: [
      '课程和住宿按周日开始、周六结束；分段日期不得重叠。',
      '注册费100美元／人绝不参加学校活动、95折或返校减免。',
      '当地费用以学校和菲律宾当期政策实收为准；本报价不构成签证或法律结论。',
      '优惠资格、房型空位、课程安排及最终账单须由思达顾问向IMS复核。',
    ],
  },
  media: [],
});

export const cloneImsContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const cloned = structuredClone(value);
  if (!cloned.quoteImageSettings.localFeeNotes) cloned.quoteImageSettings.localFeeNotes = {};
  if (!cloned.media) cloned.media = [];
  return cloned;
};
