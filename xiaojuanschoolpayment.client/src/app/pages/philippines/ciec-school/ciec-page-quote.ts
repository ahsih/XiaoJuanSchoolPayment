// CIEC on the shared Philippine school quote and plan comparison. CIEC is a family and junior school: each person
// in a quote is a child with a parent, a parent, or a child without a parent, and a group quote is one family, so
// the low-season family offers look at the whole quote. Prices, offers and local fees are calculated here per
// person; PhSchoolQuote and PhPlanComparison only add them up and lay them out. Keep this file free of Angular,
// DOM and storage access, so the WeChat mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  CIEC_CIDEC_GRADE_TUITION,
  CIEC_CIDEC_ID,
  CIEC_DOUBLE_ROOM_ID,
  CIEC_FAMILY2_TRIPLE_ROOM_ID,
  CIEC_FAMILY4_ROOM_ID,
  CIEC_GROUP_CLASS_COURSE_IDS,
  CIEC_GUARDIAN_COURSE_IDS,
  CIEC_GUARDIAN_FEE_PER_4_WEEKS,
  CIEC_KINDERGARTEN_ID,
  CIEC_LOW_SEASON_WINDOWS,
  CIEC_NO_CLASS_ID,
  CIEC_PICKUP_USD,
  CIEC_PROMOTION_IDS,
  CIEC_TRIPLE_ROOM_ID,
  CiecLowSeasonWindow,
} from './ciec-content-config';

export const CIEC_QUOTE_IMAGE_HERO = '/assets/ciec/campus-entrance.webp';
const DAY = 86400000;

/** Everything CIEC's quote reads; the page component is one. */
export interface CiecQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

export type CiecRole = 'child' | 'guardian' | 'solo';
/** A child's age on arrival: up to 24 months, 25–47 months, or whole years from 4 to 17. */
export type CiecChildAge = 'm24' | 'm47' | number;

export const CIEC_NO_CLASS_NAME = '不上课（陪读家长或4岁以下婴幼儿）';

/** Courses a family usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const CIEC_COMPARE_COURSE_GROUPS = [
  { id: 'junior', label: '青少年课程', courseIds: ['junior-academic', 'junior-intensive', 'junior-ielts-toefl', 'school-preparation'] },
  { id: 'guardian', label: '家长课程', courseIds: [...CIEC_GUARDIAN_COURSE_IDS] },
] as const;

/** Price ratio of a 2–3 week row; four weeks and longer are proportional (one week is not offered). */
export const ciecPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const parseDay = (value: string): number => Date.parse(`${value}T00:00:00Z`);
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const money = (value: number): number => Math.round(value * 100) / 100;

/** Rooms in which a family gets the low-season room offer: 2 people in a double (or the upgrade triple), 3 in a triple. */
const familyRoomIds = (size: 2 | 3): readonly string[] =>
  size === 2 ? [CIEC_DOUBLE_ROOM_ID, CIEC_FAMILY2_TRIPLE_ROOM_ID] : [CIEC_TRIPLE_ROOM_ID];

/** The low-season window whose study days (Monday to Friday) hold this Sunday-start week, if any. */
export function ciecLowSeasonWindow(weekStart: number): CiecLowSeasonWindow | undefined {
  return CIEC_LOW_SEASON_WINDOWS.find(window =>
    weekStart + DAY >= parseDay(window.start) && weekStart + 5 * DAY <= parseDay(window.end));
}

interface CiecChoice<T> extends PhExtraChoice {
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

const AGE_OPTIONS: ReadonlyArray<{ value: CiecChildAge; label: string }> = [
  { value: 'm24', label: '24个月及以下' },
  { value: 'm47', label: '25–47个月' },
  ...Array.from({ length: 14 }, (_, index) => ({ value: index + 4, label: `${index + 4}岁` })),
];

/** One person of a CIEC quote: role, age, plan and every amount the template and quote image show. */
export class CiecPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  readonly hideAgeGroup = true;
  readonly minorNote = '';
  readonly extraChoices: readonly PhExtraChoice[];
  visaType = 'tourist30';
  returningStudent = false;
  pickup = false;
  private currentRole: CiecRole;
  private currentAge: CiecChildAge = 8;

  constructor(
    private readonly pricing: CiecQuotePricing,
    role: CiecRole = 'child',
    /** The family this person is quoted with; a single quote and 方案对比 quote one person. */
    private readonly householdOf: (student: CiecPageStudent) => readonly CiecPageStudent[] = student => [student],
  ) {
    this.currentRole = role;
    const student = this;
    this.quotePlan = new SchoolQuotePlan(
      role === 'guardian' ? 'guardian-esl' : 'junior-academic', CIEC_DOUBLE_ROOM_ID, nextQuoteSunday(), [2, 3],
      kind => kind === 'course'
        ? [
          ...pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule })),
          { id: CIEC_NO_CLASS_ID, name: CIEC_NO_CLASS_NAME, details: '' },
        ]
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const ratio = ciecPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
        if (kind === 'course') return (pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027 ?? 0) * ratio;
        return (pricing.roomFees.find(item => item.id === row.optionId)?.fee ?? 0) * ratio * student.roomRate;
      },
    );
    const roleChoice: CiecChoice<CiecRole> = {
      label: '身份',
      options: [
        { value: 'child', label: '孩子（有家长陪同）' },
        { value: 'guardian', label: '家长／监护人' },
        { value: 'solo', label: '孩子（无家长陪同）' },
      ],
      visible: true,
      get note() { return student.roleNote; },
      get value() { return student.role; },
      set value(value: CiecRole) { student.role = value; },
    };
    const ageChoice: CiecChoice<CiecChildAge> = {
      label: '孩子抵达时年龄',
      options: AGE_OPTIONS,
      get visible() { return student.role !== 'guardian'; },
      get note() { return student.ageNote; },
      get value() { return student.childAge; },
      set value(value: CiecChildAge) { student.childAge = value; },
    };
    const pickupChoice: CiecChoice<boolean> = {
      label: '宿务机场接机',
      options: [{ value: false, label: '不需要' }, { value: true, label: `需要（每人单程${CIEC_PICKUP_USD}美元）` }],
      visible: true,
      note: '',
      get value() { return student.pickup; },
      set value(value: boolean) { student.pickup = value; },
    };
    this.extraChoices = [roleChoice, ageChoice, pickupChoice];
  }

  // ---- who this person is -----------------------------------------------------------------------

  get role(): CiecRole { return this.currentRole; }
  /** A new role moves courses that no longer fit to a sensible default. */
  set role(value: CiecRole) {
    this.currentRole = value;
    if (value === 'solo' && this.isInfant) this.currentAge = 8;
    this.fitCourses();
  }

  get childAge(): CiecChildAge { return this.currentAge; }
  set childAge(value: CiecChildAge) {
    this.currentAge = value;
    this.fitCourses();
  }

  get isGuardian(): boolean { return this.role === 'guardian'; }
  get isInfant(): boolean { return !this.isGuardian && (this.childAge === 'm24' || this.childAge === 'm47'); }
  /** Age in whole years for children (infants count as 1 or 3); parents are adults. */
  get ageYears(): number {
    if (this.isGuardian) return 18;
    return this.childAge === 'm24' ? 1 : this.childAge === 'm47' ? 3 : this.childAge;
  }
  get selectedAgeGroup(): 'adult' | 'minor' { return this.isGuardian ? 'adult' : 'minor'; }
  set selectedAgeGroup(_value: 'adult' | 'minor') { /* CIEC asks for the role and the child's age instead. */ }

  /** Infants up to 24 months stay free, 25–47 months pay half, and neither counts as a room occupant. */
  get roomRate(): number { return this.isGuardian ? 1 : this.childAge === 'm24' ? 0 : this.childAge === 'm47' ? 0.5 : 1; }

  get household(): readonly CiecPageStudent[] { return this.householdOf(this); }

  private fitCourses(): void {
    for (const row of this.quotePlan.courses) {
      const guardianCourse = CIEC_GUARDIAN_COURSE_IDS.includes(row.optionId);
      if (this.isGuardian) {
        if (!guardianCourse && row.optionId !== CIEC_NO_CLASS_ID) row.optionId = 'guardian-esl';
      } else if (this.isInfant) {
        row.optionId = CIEC_NO_CLASS_ID;
      } else if (guardianCourse || row.optionId === CIEC_NO_CLASS_ID
        || (row.optionId === CIEC_KINDERGARTEN_ID && this.ageYears > 6)
        || (row.optionId !== CIEC_KINDERGARTEN_ID && this.ageYears < 6)) {
        row.optionId = this.ageYears < 6 || (this.ageYears === 6 && this.role !== 'solo') ? CIEC_KINDERGARTEN_ID : 'junior-academic';
      }
    }
  }

  private get roleNote(): string {
    const alone = this.household.length === 1;
    if (this.role === 'solo') {
      return `没有家长陪同的学生（斯巴达管理）另收监护费，每4周${CIEC_GUARDIAN_FEE_PER_4_WEEKS}美元；9岁及以上在淡季学习周免收。${this.ageYears < 9 ? '未满9岁单独就读，要先由顾问向学校确认能否接收。' : ''}`;
    }
    if (!alone) return '';
    return this.isGuardian
      ? '这里只算家长本人的费用。家长和孩子请用“多人报价”一起算，淡季家庭优惠和家长课程优惠才会自动计入。'
      : '这里只算孩子本人的费用。家长同行请用“多人报价”把家长加进来，淡季家庭优惠才会自动计入。';
  }

  private get ageNote(): string {
    if (this.childAge === 'm24') return '24个月及以下不收食宿费，管理费和水费照收；课程请选“不上课”。';
    if (this.childAge === 'm47') return '25–47个月食宿费收一半，不计入房间人数；课程请选“不上课”。';
    return '';
  }

  // ---- family -----------------------------------------------------------------------------------

  /** Children who study (4 and older) in this person's quote. */
  private get studyingChildren(): CiecPageStudent[] {
    return this.household.filter(member => member.role === 'child' && !member.isInfant);
  }
  private get guardians(): CiecPageStudent[] { return this.household.filter(member => member.isGuardian); }
  private get hasSolo(): boolean { return this.household.some(member => member.role === 'solo'); }
  /** 1 parent + 1 child (2-person family) or 1 parent + 2 children (3-person family); infants do not count. */
  get familySize(): 0 | 2 | 3 {
    if (this.guardians.length !== 1 || this.hasSolo) return 0;
    const children = this.studyingChildren.length;
    return children === 1 ? 2 : children === 2 ? 3 : 0;
  }

  /** The room type this person sleeps in during the week starting on this Sunday. */
  roomAt(weekStart: number): string | undefined {
    return this.quotePlan.rooms.find(row => this.quotePlan.weekStarts([row]).includes(weekStart))?.optionId;
  }
  studiesAt(weekStart: number): boolean {
    return this.quotePlan.courses.some(row => row.optionId !== CIEC_NO_CLASS_ID && this.quotePlan.weekStarts([row]).includes(weekStart));
  }

  private rule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }
  private roomFee(id: string): number { return this.pricing.roomFees.find(item => item.id === id)?.fee ?? 0; }
  private courseFee(id: string): number { return this.pricing.courseFees.find(item => item.id === id)?.tuition2027 ?? 0; }

  /** Every offer asks for at least 4 weeks of registration. */
  private get longEnough(): boolean { return this.quotePlan.courseWeeks >= 4; }

  /** The family room offer for this parent: weeks and dollars off, by the family's size. */
  get familyRoomOffer(): { weeks: number; amount: number; size: 2 | 3 } | undefined {
    const size = this.familySize;
    if (!this.isGuardian || !size || !this.longEnough) return undefined;
    if (!this.rule(size === 2 ? CIEC_PROMOTION_IDS.family2 : CIEC_PROMOTION_IDS.family3)) return undefined;
    const children = this.studyingChildren;
    if (!children.every(child => child.quotePlan.courseWeeks >= 4)) return undefined;
    let weeks = 0;
    let amount = 0;
    for (const start of this.quotePlan.weekStarts(this.quotePlan.rooms)) {
      const window = ciecLowSeasonWindow(start);
      const roomId = this.roomAt(start);
      if (!window || !roomId || !familyRoomIds(size).includes(roomId)) continue;
      if (!children.every(child => child.roomAt(start) === roomId && child.studiesAt(start))) continue;
      // A 2-person family's parent pays the low-season price instead of the double room (plus the upgrade in a triple).
      const weekly = size === 2
        ? Math.max(0, this.roomFee(CIEC_DOUBLE_ROOM_ID) - window.familyGuardianRoom) / 4
        : this.roomFee(roomId) / 4;
      weeks += 1;
      amount += weekly;
    }
    return weeks ? { weeks, amount: money(amount), size } : undefined;
  }

  /** The low-season price of a parent's one-to-one course while a child of the family studies. */
  get guardianCourseOffer(): { weeks: number; amount: number } | undefined {
    if (!this.isGuardian || !this.longEnough || !this.rule(CIEC_PROMOTION_IDS.guardianCourse)) return undefined;
    const children = this.studyingChildren;
    if (!children.length) return undefined;
    let weeks = 0;
    let amount = 0;
    for (const row of this.quotePlan.courses.filter(item => CIEC_GUARDIAN_COURSE_IDS.includes(item.optionId))) {
      for (const start of this.quotePlan.weekStarts([row])) {
        const window = ciecLowSeasonWindow(start);
        const price = window?.guardianCourse[row.optionId];
        if (price === undefined || !children.some(child => child.studiesAt(start))) continue;
        weeks += 1;
        amount += Math.max(0, this.courseFee(row.optionId) - price) / 4;
      }
    }
    return weeks ? { weeks, amount: money(amount) } : undefined;
  }

  /** Low-season study weeks free of the guardian fee (students 9 and older without a parent). */
  get guardianFeeWaiverWeeks(): number {
    if (this.role !== 'solo' || this.ageYears < 9 || !this.longEnough || !this.rule(CIEC_PROMOTION_IDS.soloGuardianFee)) return 0;
    return this.quotePlan.weekStarts(this.quotePlan.courses).filter(start => !!ciecLowSeasonWindow(start)).length;
  }

  /** 2026 low season: a free one-hour craft class for primary-school children (non-cash). */
  get craftClass(): boolean {
    if (this.isGuardian || this.ageYears < 6 || this.ageYears > 12 || !this.longEnough || !this.rule(CIEC_PROMOTION_IDS.craft)) return false;
    return this.quotePlan.weekStarts(this.quotePlan.courses).some(start => !!ciecLowSeasonWindow(start)?.craftClass);
  }

  // ---- checks -----------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number {
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  get courseLengthError(): string {
    for (const course of this.pricing.courseFees) {
      const minimum = course.minimumWeeks ?? 0;
      const weeks = this.quotePlan.courses.filter(row => row.optionId === course.id).reduce((sum, row) => sum + row.weeks, 0);
      if (minimum && weeks && weeks < minimum) return `${course.name}至少报名${minimum}周，请把周数改为${minimum}周或以上。`;
    }
    return '';
  }

  private get courseError(): string {
    const ids = this.quotePlan.courses.map(row => row.optionId);
    const guardianCourse = ids.some(id => CIEC_GUARDIAN_COURSE_IDS.includes(id));
    const noClass = ids.includes(CIEC_NO_CLASS_ID);
    if (this.isGuardian) {
      if (ids.some(id => id !== CIEC_NO_CLASS_ID && !CIEC_GUARDIAN_COURSE_IDS.includes(id))) return '家长请选家长课程，或选“不上课”。';
      if (noClass && !this.guardianMaySkipClass) {
        return '家长不上课只适用于：停留超过12周、带4岁以下的孩子，或淡季两人／三人家庭优惠的学习周。其他情况请选家长课程。';
      }
      return '';
    }
    if (guardianCourse) return '家长课程只适合18岁以上的家长，孩子请选青少年课程。';
    if (this.isInfant) return noClass && ids.every(id => id === CIEC_NO_CLASS_ID) ? '' : '未满4岁（48个月）的孩子请在课程里选“不上课”。';
    if (noClass) return '4岁及以上的孩子请选择课程。';
    if (ids.includes(CIEC_KINDERGARTEN_ID) && this.ageYears > 6) return '幼儿园课程只收4–6岁的孩子，请改选青少年课程。';
    if (ids.some(id => id !== CIEC_KINDERGARTEN_ID) && this.ageYears < 6) return '青少年课程从小学1年级（约6岁）开始，4–5岁请选幼儿园课程。';
    if (this.role === 'solo' && ids.includes(CIEC_KINDERGARTEN_ID)) return '幼儿园午休由家长看顾，读幼儿园须有家长陪同。';
    return '';
  }

  /** The school allows a parent not to study after 12 weeks, with a child under 4, or in the family offer. */
  get guardianMaySkipClass(): boolean {
    if (this.quotePlan.stayWeeks > 12) return true;
    if (this.household.some(member => member.isInfant)) return true;
    const size = this.familySize;
    if (!size || !this.longEnough) return false;
    return this.quotePlan.weekStarts(this.quotePlan.rooms)
      .some(start => !!ciecLowSeasonWindow(start) && familyRoomIds(size).includes(this.roomAt(start) ?? ''));
  }

  private get roomError(): string {
    const rooms = this.quotePlan.rooms.map(row => row.optionId);
    const occupants = this.household.filter(member => !member.isInfant);
    if (rooms.includes(CIEC_FAMILY4_ROOM_ID)
      && (occupants.length !== 4 || !occupants.every(member => member.quotePlan.rooms.every(row => row.optionId === CIEC_FAMILY4_ROOM_ID)))) {
      return '“三人间（4人家庭）”只适用于4位家人（婴幼儿不算）一起住一间三人间，请在多人报价里加齐4人，或改选其他房型。';
    }
    const twoPerson = this.familySize === 2 && occupants.length === 2;
    if (twoPerson && !this.isInfant && rooms.some(id => !familyRoomIds(2).includes(id))) {
      return '两人家庭请选双人间；淡季想住三人间，请选“三人间（2人家庭升级）”。';
    }
    return this.isInfant ? '' : this.upgradeRoomError(twoPerson, occupants);
  }

  /** The upgrade room: only a 2-person family, together, in low-season weeks, registered for at least 4 weeks. */
  private upgradeRoomError(twoPerson: boolean, occupants: readonly CiecPageStudent[]): string {
    const upgradeWeeks = this.quotePlan.weekStarts(this.quotePlan.rooms.filter(row => row.optionId === CIEC_FAMILY2_TRIPLE_ROOM_ID));
    if (!upgradeWeeks.length) return '';
    if (!twoPerson) {
      return '“三人间（2人家庭升级）”只适用于1位家长带1个孩子的两人家庭，请在多人报价里加上家人，或改选其他房型。';
    }
    if (upgradeWeeks.some(start => !ciecLowSeasonWindow(start))) {
      return `“三人间（2人家庭升级）”只在淡季提供（${CIEC_LOW_SEASON_WINDOWS.map(window => window.label).join('、')}），其他周请选双人间。`;
    }
    if (upgradeWeeks.some(start => occupants.some(member => member.roomAt(start) !== CIEC_FAMILY2_TRIPLE_ROOM_ID))) {
      return '升级三人间时家长和孩子住同一间，请把两人的住宿都选“三人间（2人家庭升级）”。';
    }
    if (!this.longEnough) return '淡季优惠和升级三人间至少要报名4周。';
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError || this.courseError || this.roomError;
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    return this.returningStudent && !!this.rule(CIEC_PROMOTION_IDS.returning) ? 0 : this.pricing.registrationFee;
  }
  get registrationWaiverName(): string | undefined { return undefined; }
  get tuition(): number { return money(this.quotePlan.total('course')); }
  get accommodation(): number { return money(this.quotePlan.total('room')); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  get cidecGradeTuition(): number {
    return this.quotePlan.courses.some(row => row.optionId === CIEC_CIDEC_ID) ? CIEC_CIDEC_GRADE_TUITION : 0;
  }
  /** Grade 1–12 students without a parent: 300 dollars per 4 weeks, by study weeks. */
  get guardianFee(): number {
    return this.role === 'solo' ? money(this.quotePlan.courseWeeks * CIEC_GUARDIAN_FEE_PER_4_WEEKS / 4) : 0;
  }
  get guardianFeeWaiver(): number { return money(this.guardianFeeWaiverWeeks * CIEC_GUARDIAN_FEE_PER_4_WEEKS / 4); }
  get pickupFee(): number { return this.pickup ? CIEC_PICKUP_USD : 0; }

  /** School offers on tuition and room and board, before the Sida rate. */
  private get schoolOfferTotal(): number {
    return (this.familyRoomOffer?.amount ?? 0) + (this.guardianCourseOffer?.amount ?? 0);
  }
  get sidaDiscount(): number {
    const rule = this.rule(CIEC_PROMOTION_IDS.sida);
    if (!rule) return 0;
    const base = this.tuition + this.accommodation + this.cidecGradeTuition - this.schoolOfferTotal;
    return money(Math.max(0, base) * rule.discountValue / 100);
  }

  get promotionDiscountTotal(): number {
    return money(this.schoolOfferTotal + this.guardianFeeWaiver + this.sidaDiscount);
  }

  get discountNames(): string {
    return this.discountLines.map(line => line.label).join('、');
  }

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation + this.cidecGradeTuition
      + this.guardianFee + this.pickupFee - this.promotionDiscountTotal;
    return Math.max(0, money(total));
  }

  private get discountLines(): SchoolPaymentLine[] {
    const lines: SchoolPaymentLine[] = [];
    const room = this.familyRoomOffer;
    if (room) {
      const rule = this.rule(room.size === 2 ? CIEC_PROMOTION_IDS.family2 : CIEC_PROMOTION_IDS.family3)!;
      lines.push({ icon: '惠', label: rule.name, value: -room.amount, note: `${rule.description}；本次${room.weeks}周`, promotionKey: rule.id });
    }
    const course = this.guardianCourseOffer;
    if (course) {
      const rule = this.rule(CIEC_PROMOTION_IDS.guardianCourse)!;
      lines.push({ icon: '惠', label: rule.name, value: -course.amount, note: `${rule.description}；本次${course.weeks}周`, promotionKey: rule.id });
    }
    if (this.guardianFeeWaiver > 0) {
      const rule = this.rule(CIEC_PROMOTION_IDS.soloGuardianFee)!;
      lines.push({ icon: '惠', label: rule.name, value: -this.guardianFeeWaiver, note: `${rule.description}；本次${this.guardianFeeWaiverWeeks}周`, promotionKey: rule.id });
    }
    if (this.sidaDiscount > 0) {
      const rule = this.rule(CIEC_PROMOTION_IDS.sida)!;
      lines.push({ icon: '折', label: rule.name, value: -this.sidaDiscount, note: rule.description, promotionKey: rule.id });
    }
    return lines;
  }

  get paymentLines(): SchoolPaymentLine[] {
    const craft = this.rule(CIEC_PROMOTION_IDS.craft);
    return [
      ...(this.cidecGradeTuition ? [{ icon: '学', label: 'CIDEC年级学费', value: this.cidecGradeTuition, note: '一次性，含项目材料和课程模块' }] : []),
      ...(this.guardianFee ? [{
        icon: '护', label: '监护费（无家长陪同）', value: this.guardianFee,
        note: `1–12年级没有家长陪同的学生，每4周${CIEC_GUARDIAN_FEE_PER_4_WEEKS}美元；本次${this.quotePlan.courseWeeks}周`,
      }] : []),
      ...(this.pickupFee ? [{ icon: '接', label: '宿务机场接机', value: this.pickupFee, note: '每人单程' }] : []),
      ...this.discountLines,
      ...(this.craftClass && craft ? [{ icon: '赠', label: craft.name, value: 0, note: `${craft.description}；非现金优惠`, promotionKey: craft.id }] : []),
    ];
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }

  /** e.g. 孩子8岁（家长陪同） · 家长 · 孩子12岁（无家长陪同） · 婴幼儿25–47个月. */
  get roleText(): string {
    if (this.isGuardian) return '家长';
    if (this.childAge === 'm24') return '婴幼儿24个月及以下';
    if (this.childAge === 'm47') return '婴幼儿25–47个月';
    return `孩子${this.childAge}岁（${this.role === 'solo' ? '无家长陪同' : '家长陪同'}）`;
  }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }
  private get stayDays(): number { return this.quotePlan.stayWeeks * 7; }

  /** A 30-day entry is first extended by 29 days (to day 59), then 30 days at a time; a 59-day entry starts with the second step. */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const days = this.stayDays;
    if (this.visaType === 'tourist30') return days <= 30 ? 0 : Math.max(0, Math.ceil((days - 59) / 30)) + 1;
    return days <= 59 ? 0 : Math.ceil((days - 59) / 30);
  }

  private feeRule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  private courseWeeksOf(ids: readonly string[]): number {
    return this.quotePlan.courses.filter(row => ids.includes(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const longTerm = this.longTermVisa;
    const visaLabel = this.visaLabel;
    const longTermNote = `${visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const studying = plan.courses.some(row => row.optionId !== CIEC_NO_CLASS_ID);
    const cidec = plan.courses.some(row => row.optionId === CIEC_CIDEC_ID);
    const periods = Math.max(1, Math.ceil(plan.roomWeeks / 4));
    const create = (id: string, quantity: number, options: { note?: string; total?: number; unit?: string; visa?: boolean } = {}): SchoolLocalFee[] => {
      const rule = this.feeRule(id);
      if (!rule) return [];
      const waived = !!options.visa && longTerm;
      const unit = options.unit ?? (rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{
        item: rule.name, unitLabel: unit,
        quantity: waived ? 0 : quantity,
        total: waived ? 0 : options.total ?? rule.amount * quantity,
        note: waived ? longTermNote : options.note ?? rule.note,
        ...(waived ? { waived: true } : {}),
      }];
    };
    const visaRule = this.feeRule('visa-extension');
    const visaAmounts = visaRule ? this.visaExtensionAmounts(visaRule) : [];
    const visaFirst = visaRule
      ? ((this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates)?.[0] ?? visaRule.amount) : 0;
    const extensions = this.visaExtensionCount;
    const visaNote = `${extensions ? `按${visaLabel}预估，本次${extensions}次` : `按${visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    const groupWeeks = this.courseWeeksOf(CIEC_GROUP_CLASS_COURSE_IDS);
    const kindergartenWeeks = this.courseWeeksOf([CIEC_KINDERGARTEN_ID]);
    return [
      ...(studying && !cidec ? [...create('ssp', 1, { visa: true }), ...create('ssp-e-card', 1, { visa: true })] : []),
      ...(cidec ? create('cidec-ssp', 1, { visa: true }) : []),
      ...create('i-card', this.stayDays > 59 ? 1 : 0, { visa: true }),
      ...create('visa-extension', extensions, {
        visa: true, note: visaNote, total: visaAmounts.reduce((sum, amount) => sum + amount, 0), unit: `${formatPhp(visaFirst)}起／次`,
      }),
      ...create('utility', periods),
      ...create('water', periods),
      ...(groupWeeks ? create('group-materials', Math.ceil(groupWeeks / 4)) : []),
      ...(kindergartenWeeks ? create('kindergarten-materials', Math.ceil(kindergartenWeeks / 4)) : []),
      ...create('student-id', 1),
    ];
  }
}

/** Reference rows below the local fees, outside every total. */
function ciecOptionalFees(students: readonly CiecPageStudent[], pricing: CiecQuotePricing): PhOptionalFeeItem[] {
  const phpPerCny = pricing.phpPerCny;
  const cny = (value: number) => Number.isFinite(phpPerCny) && phpPerCny > 0
    ? quoteCurrencyText(Math.round(value / phpPerCny), 'zh-CN') : '—';
  const kindergarten = students.some(student => student.quotePlan.courses.some(row => row.optionId === CIEC_KINDERGARTEN_ID));
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal && (rule.id !== 'kindergarten-kit' || kindergarten))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      if (rule.id === 'electricity') {
        return { label: rule.name, amount: `${rule.amount} 比索／千瓦时`, cnyAmount: '按实际用量结算', note: rule.note };
      }
      if (rule.secondaryAmount) {
        return {
          label: rule.name,
          amount: `${rule.amount.toLocaleString('en-US')}–${rule.secondaryAmount.toLocaleString('en-US')} 比索／本`,
          cnyAmount: `约人民币 ${cny(rule.amount)}–${cny(rule.secondaryAmount)} 元／本`,
          note: rule.note,
        };
      }
      const count = rule.multiplyByStudents ? students.length : 1;
      const total = rule.amount * count;
      return {
        label: rule.name,
        amount: formatPhp(total),
        cnyAmount: `约人民币 ${cny(total)} 元`,
        note: `${rule.note}${count > 1 ? `（${count}人）` : ''}`,
      };
    });
}

export class CiecQuote extends PhSchoolQuote<CiecPageStudent> {
  constructor(pricing: CiecQuotePricing) {
    const holder: { quote?: CiecQuote } = {};
    let created = 0;
    super(pricing, {
      // Student 2 is the parent by default, so a new group quote starts as a parent with a child.
      createStudent: () => new CiecPageStudent(pricing, created++ === 1 ? 'guardian' : 'child', student => {
        const family = holder.quote?.activeStudents ?? [];
        return family.includes(student) ? family : [student];
      }),
      headingPrefix: 'CIEC',
      image: { schoolCode: 'CIEC', schoolName: '菲律宾宿务CIEC语言学校', filePrefix: 'CIEC', heroSrc: CIEC_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => ciecPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: students => ciecOptionalFees(students, pricing),
      layoutVersion: 2,
    });
    holder.quote = this;
  }

  /** The 不上课 choice is not a course in the content document, so keep it when the content changes. */
  override retainValidSelections(): void {
    for (const student of this.students) {
      for (const row of student.quotePlan.courses) {
        if (row.optionId !== CIEC_NO_CLASS_ID && !this.pricing.courseFees.some(item => item.id === row.optionId)) {
          row.optionId = this.pricing.courseFees[0]?.id ?? row.optionId;
        }
      }
      for (const row of student.quotePlan.rooms) {
        if (!this.pricing.roomFees.some(item => item.id === row.optionId)) row.optionId = this.pricing.roomFees[0]?.id ?? row.optionId;
      }
    }
  }

  override studentConditionText(student: CiecPageStudent): string {
    return [student.returningStudent ? '老学员' : '新学员', student.roleText, student.visaLabel].filter(Boolean).join(' · ');
  }

  /** The craft class is a non-cash gift, so its row says 赠送 instead of “0 美元”. */
  override get schoolPaymentItems() { return super.schoolPaymentItems.map(giftAmount); }
  override get quoteImageData() {
    const data = super.quoteImageData;
    return { ...data, paymentItems: data.paymentItems.map(giftAmount) };
  }
}

const giftAmount = <T extends { icon: string; amount: string; accent?: boolean }>(item: T): T =>
  item.icon === '赠' ? { ...item, amount: '赠送', accent: false } : item;

/** The comparison prices one person, so it leaves out the family-only rooms (4-person triple, 2-person upgrade). */
const onePersonRooms = (pricing: CiecQuotePricing): CiecQuotePricing => new Proxy(pricing, {
  get: (target, key) => key === 'roomFees'
    ? target.roomFees.filter(room => room.id !== CIEC_FAMILY4_ROOM_ID && room.id !== CIEC_FAMILY2_TRIPLE_ROOM_ID)
    : Reflect.get(target, key),
});

export class CiecPlanComparison extends PhPlanComparison<CiecPageStudent> {
  constructor(page: CiecQuotePricing, conditions: () => CiecPageStudent) {
    const pricing = onePersonRooms(page);
    super(pricing, conditions, {
      createStudent: () => new CiecPageStudent(pricing),
      copyConditions: (from, to) => {
        to.role = from.role;
        to.childAge = from.childAge;
        to.visaType = from.visaType;
        to.returningStudent = from.returningStudent;
        to.pickup = from.pickup;
      },
      heading: 'CIEC 方案对比报价',
      courseGroups: CIEC_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      extraNotes: results => {
        const student = conditions();
        return [
          ...(results.some(result => result.courseId === CIEC_CIDEC_ID) ? [`CIDEC另收一次性年级学费${CIEC_CIDEC_GRADE_TUITION.toLocaleString('en-US')}美元，已计入学校费用合计。`] : []),
          ...(student.role === 'solo' ? [`没有家长陪同的学生另收监护费（每4周${CIEC_GUARDIAN_FEE_PER_4_WEEKS}美元），已计入学校费用合计；淡季9岁及以上免收。`] : []),
          ...(student.role !== 'solo' ? ['方案对比只算一个人的费用；家长和孩子的淡季家庭优惠请用多人报价计算。'] : []),
        ];
      },
      layoutVersion: 2,
    });
  }
}
