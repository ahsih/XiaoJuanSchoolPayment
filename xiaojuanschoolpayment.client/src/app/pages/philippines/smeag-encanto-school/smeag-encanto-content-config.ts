// SMEAG Encanto's content document for the shared Philippine school page. Encanto has no employee editor and no
// database record yet, so these compiled defaults are the page's only source; the document has the same shape as
// every template school's so it can join the editors later. Prices come from smeag-encanto-pricing.ts.
// Keep this file pure data (no Angular, DOM or storage).
import type {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import { copyContentData } from '../copy-content-data';
import {
  ENCANTO_CHRISTMAS_OFFER,
  ENCANTO_COURSES,
  ENCANTO_FAMILY_CAMP_SIDA_PER_PERSON_WEEK,
  ENCANTO_LOCAL_FEES,
  ENCANTO_OFF_SEASON_OFFERS,
  ENCANTO_REGISTRATION_FEE,
  ENCANTO_ROOMS,
  ENCANTO_SHORT_STAY_RATIOS,
} from './smeag-encanto-pricing';

/**
 * The content document's school code. CiaContentConfig lists the codes in the locked CIA folder, so this one is
 * cast instead of added there; add 'SMEAG-ENCANTO' to that list the next time the user unlocks a CIA change.
 */
export const ENCANTO_SCHOOL_CODE = 'SMEAG-ENCANTO' as string as CiaContentConfig['schoolCode'];

/** Room price group of the adult rooms; the family room is quoted only with a family course. */
export const ENCANTO_ADULT_ROOM_GROUP = '成人宿舍（淡季成人课程）';
export const ENCANTO_FAMILY_ROOM_ID = 'family-room';

const LOCAL_FEE_INTRO = '以下费用以比索计价，到校后在学校缴纳；接机、押金和教材另列。旺季亲子营的学杂费已含在整家价格里。';
/** The company's own lines on the quote image, the same for every school (CIA's wording). */
const ALUMNI_BENEFIT_TEXT = '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。';
const FOOTER_NOTES = ['到校学杂费、签证与教材按实际发生和学校最新政策确认。', '最终以学校价格、空房、活动名额及优惠资格确认为准。'];

/**
 * Courses. Family courses keep two whole-family four-week prices: tuition is the off-season price and tuition2027
 * the Family Camp (peak) price; Family Support (parents not studying) runs off-season only, so both are equal.
 * Adult courses have one price in both fields.
 */
const courses = (): CiaCourseContent[] => ENCANTO_COURSES.map((course, index) => ({
  id: course.id,
  name: course.name,
  family: course.kind === 'family',
  tuition: course.kind === 'adult' ? course.tuition! : course.offPrice!,
  tuition2027: course.kind === 'adult' ? course.tuition! : course.peakPrice ?? course.offPrice!,
  suitable: course.suitable,
  schedule: course.schedule,
  note: course.note,
  enabled: true,
  sortOrder: index + 1,
}));

const rooms = (): CiaRoomContent[] => ENCANTO_ROOMS.map((room, index) => ({
  id: room.id,
  name: room.name,
  label: room.label,
  // Internal code, never shown (showRoomCodes is off); a price card finds its photos by it, so it must not be empty.
  code: room.id.toUpperCase(),
  location: '校内',
  group: room.family ? '亲子家庭房' : ENCANTO_ADULT_ROOM_GROUP,
  fee: room.fee,
  note: room.note,
  enabled: true,
  sortOrder: index + 1,
}));

const fee = (
  id: string, name: string, amount: number, billingRule: CiaLocalFeeRule['billingRule'], note: string, sortOrder: number,
  includeInTotal = true,
): CiaLocalFeeRule => ({ id, name, amount, billingRule, note, sortOrder, currency: 'PHP', enabled: true, includeInTotal });

/** The 2027 sheet, for the editors; the calculator reads both sheets from smeag-encanto-pricing.ts by arrival year. */
const localFees = (): CiaLocalFeeRule[] => {
  const sheet = ENCANTO_LOCAL_FEES[2027];
  return [
    fee('ssp', 'SSP学习许可', sheet.ssp, 'once', '每人一次。', 1),
    fee('ssp-icard', 'SSP I-Card', sheet.sspICard, 'once', '每人一次。', 2),
    fee('visa', '签证续签', 0, 'visa-extension-schedule', '按停留天数和入境签证计算。', 3),
    fee('visa-icard', '签证I-Card（ACR）', sheet.visaICard, 'once', '停留60天及以上时办理，每人一次。', 4),
    fee('upkeep', sheet.upkeepName, sheet.upkeep, 'per-accommodation-period', '每4周。', 5),
    fee('electricity-water', '水电费', sheet.electricityWater, 'per-accommodation-period', '每4周预付；超额使用另付。', 6),
    fee('pickup', '机场接机', sheet.pickup, 'optional', '可选；旺季亲子营已含。', 7, false),
    fee('deposit', '押金', sheet.deposit, 'optional', `${sheet.depositNote}；离校时退还房间押金。`, 8, false),
  ];
};

const promotion = (
  value: Partial<CiaPromotionRule> & Pick<CiaPromotionRule, 'id' | 'name' | 'description' | 'sortOrder'>,
): CiaPromotionRule => ({
  enabled: true, priority: value.sortOrder * 10, stackable: true, newStudentsOnly: false,
  discountType: 'fixed', discountValue: 0, appliesTo: 'school-total', waiveRegistration: false,
  minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none',
  ...value,
});

/** The offers, for the editors; the calculator applies them from smeag-encanto-pricing.ts. */
const promotions = (): CiaPromotionRule[] => [
  promotion({
    id: 'encanto-sida', name: '思达启航折扣', sortOrder: 1,
    description: '成人ESL／ESL2的课程费和住宿费9折；注册费和度假村设施费不打折。',
    discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation',
  }),
  ...ENCANTO_OFF_SEASON_OFFERS.map((offer, index) => promotion({
    id: offer.id, name: offer.label, sortOrder: 2 + index,
    description: `成人ESL／ESL2，${offer.arrivalFrom.replace(/-/g, '/')}起入学，${offer.start.replace(/-/g, '/')}–${offer.end.replace(/-/g, '/')}期间每学习1周优惠${offer.perWeek}美元。`,
    discountType: 'per-course-week', discountValue: offer.perWeek, appliesTo: 'tuition',
    coverageStart: offer.start, coverageEnd: offer.end,
  })),
  promotion({
    id: ENCANTO_CHRISTMAS_OFFER.id, name: '圣诞优惠', sortOrder: 5,
    description: `学习期间涉及2026/12/20–2027/01/02且至少${ENCANTO_CHRISTMAS_OFFER.minimumWeeks}周，成人ESL和亲子课程每人再减${ENCANTO_CHRISTMAS_OFFER.amount}美元。`,
    discountValue: ENCANTO_CHRISTMAS_OFFER.amount, minimumCourseWeeks: ENCANTO_CHRISTMAS_OFFER.minimumWeeks,
    coverageStart: ENCANTO_CHRISTMAS_OFFER.start, coverageEnd: ENCANTO_CHRISTMAS_OFFER.end,
  }),
  promotion({
    id: 'encanto-family-camp-sida', name: '亲子营思达启航优惠', sortOrder: 6,
    description: `旺季亲子营每人每周优惠${ENCANTO_FAMILY_CAMP_SIDA_PER_PERSON_WEEK}美元（每人每4周100美元）。淡季亲子不再打折（圣诞优惠除外）。`,
    discountType: 'per-course-week', discountValue: ENCANTO_FAMILY_CAMP_SIDA_PER_PERSON_WEEK, appliesTo: 'tuition',
  }),
];

export function createDefaultEncantoContentConfig(): CiaContentConfig {
  return {
    schemaVersion: 1,
    schoolCode: ENCANTO_SCHOOL_CODE,
    courses: courses(),
    rooms: rooms(),
    localFees: localFees(),
    quoteSettings: {
      registrationFee: ENCANTO_REGISTRATION_FEE,
      futurePriceRegistrationStart: '',
      futurePriceArrivalStart: '',
      shortStayRatios: { ...ENCANTO_SHORT_STAY_RATIOS },
      // Encanto charges no peak surcharge: January–February and July–August are the Family Camp instead.
      peakSeasonFeePerWeek: 0,
      peakSeasonRanges: [],
      promotions: promotions(),
      localFeeIntro: LOCAL_FEE_INTRO,
      courseTableTitle: '课程价格（每4周）',
      courseTableNote: '',
      groupClassNote: '',
      roomTableTitle: '成人课程住宿费（每4周）',
      roomTableNote: '淡季成人课程的住宿按每人4周计价，含三餐；1–3周按4周价格的45%／65%／85%计算。亲子课程的家庭房已含在整家价格里。',
      stayPolicyTitle: '入住与离校',
      stayPolicies: [
        { label: '入住', value: '周日', note: '周一上午分级测试后开课。' },
        { label: '离校', value: '周六13:00前', note: '周四下午到周五办理离校手续，周五晚上毕业典礼。' },
      ],
      extraNightRates: [
        { label: '因航班需提前到或延后走', amount: 1500 },
        { label: '访客住宿', amount: 2000 },
      ],
    },
    quoteImageSettings: {
      paymentSectionTitle: '学校费用明细',
      paymentNotes: { registration: '', course: '', accommodation: '', promotion: '' },
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
      footerNotes: [...FOOTER_NOTES],
    },
  };
}

/** No saved document exists yet; anything that is not Encanto's falls back to the defaults. */
export function cloneEncantoContentConfig(value: CiaContentConfig): CiaContentConfig {
  if (value?.schemaVersion !== 1 || value.schoolCode !== ENCANTO_SCHOOL_CODE) return createDefaultEncantoContentConfig();
  const defaults = createDefaultEncantoContentConfig();
  const copy = copyContentData(value);
  return {
    ...defaults,
    ...copy,
    quoteSettings: { ...defaults.quoteSettings, ...copy.quoteSettings },
    quoteImageSettings: { ...defaults.quoteImageSettings, ...copy.quoteImageSettings },
  };
}
