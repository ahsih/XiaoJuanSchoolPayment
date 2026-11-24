// SMEAG Encanto on the shared Philippine school quote and plan comparison. Encanto sells two things that price
// differently: adult ESL/ESL2 in the off-season (course + room per person, 思达启航9折, resort fee, off-season and
// Christmas offers) and whole-family courses (Family Camp in January–February and July–August, Family Support
// in the other months). One quote "student" is one adult or one whole family. Prices and rules come from
// smeag-encanto-pricing.ts and the page's content document. Keep this file free of Angular, DOM and storage.
import type { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan, type QuotePlanKind, type QuotePlanOption, type QuotePlanRow } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhCompareFocus, PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import { ENCANTO_FAMILY_ROOM_ID } from './smeag-encanto-content-config';
import {
  ENCANTO_CHRISTMAS_OFFER,
  ENCANTO_COURSES,
  ENCANTO_FAMILY_CAMP_SIDA_PER_PERSON_WEEK,
  ENCANTO_FAMILY_MAX_WEEKS,
  ENCANTO_LAST_WEEK_START,
  ENCANTO_LOCAL_FEES,
  ENCANTO_OFF_SEASON_OFFERS,
  ENCANTO_RETURNING_MEMBER_DEDUCTION,
  ENCANTO_ROOMS,
  ENCANTO_SIDA_RATE,
  encantoDurationMultiple,
  encantoVisaExtensions,
  isEncantoPeakWeek,
  type EncantoCourse,
} from './smeag-encanto-pricing';

/** Everything the Encanto page quote reads; the page component is one. */
export interface EncantoQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
}

/** 思达启航折扣 rule of the content document; switching it off leaves the school price. */
export const ENCANTO_SIDA_RULE_ID = 'encanto-sida';
export const ENCANTO_QUOTE_IMAGE_HERO = '/assets/smeag-encanto/campus/campus-pool-building.webp';
const ADULT_ROOM_FALLBACK = 'triple';

const DAY = 86400000;
const round = (value: number) => Math.round(value * 100) / 100;
const slash = (value: string) => value.replace(/-/g, '/');
const iso = (time: number) => new Date(time).toISOString().slice(0, 10);
const peso = (value: number) => `${quoteCurrencyText(value, 'en-US')}比索`;

const VISA_OPTIONS = [
  { value: 'tourist59', label: '59天旅游签证' },
  { value: 'tourist30', label: '30天旅游签证' },
] as const;

/** The returning-member choice of a family of 2, 3 or 4; the same objects every check. */
const RETURNING_OPTIONS: Readonly<Record<number, ReadonlyArray<{ value: number; label: string }>>> = Object.fromEntries(
  [2, 3, 4].map(members => [members, Array.from({ length: members + 1 }, (_, count) => ({
    value: count,
    label: count === 0 ? '都是新学员' : count === members ? `${count}人（全家）` : `${count}人`,
  }))]),
);

export const isEncantoFamilyCourse = (courseId: string): boolean =>
  ENCANTO_COURSES.find(course => course.id === courseId)?.kind === 'family';

/** A course as the calculator reads it: compiled facts plus the page's (published) four-week prices. */
interface EncantoQuoteCourse {
  info: EncantoCourse;
  /** Four-week price in the Family Camp weeks (adult courses: their only price). */
  peak: number;
  /** Four-week price in the off-season weeks. */
  off: number;
}

/**
 * Course and room option lists for the quote form, rebuilt only when the page replaces its price lists, so the
 * form's selects stay stable. Adults see the adult rooms, a family only its family room.
 */
class EncantoCatalogView {
  private courseSource?: readonly CiaQuoteCourse[];
  private roomSource?: readonly CiaQuoteRoom[];
  private courseOptions: QuotePlanOption[] = [];
  private adultRoomOptions: QuotePlanOption[] = [];
  private familyRoomOptions: QuotePlanOption[] = [];

  constructor(private readonly pricing: EncantoQuotePricing) {}

  course(id: string): EncantoQuoteCourse | undefined {
    const info = ENCANTO_COURSES.find(course => course.id === id);
    if (!info) return undefined;
    const fee = this.pricing.courseFees?.find(course => course.id === id);
    const peak = fee?.tuition2027 ?? info.tuition ?? info.peakPrice ?? info.offPrice ?? 0;
    const off = fee?.tuition ?? info.tuition ?? info.offPrice ?? 0;
    return { info, peak, off };
  }

  roomFee(id: string): number {
    return this.pricing.roomFees?.find(room => room.id === id)?.fee ?? ENCANTO_ROOMS.find(room => room.id === id)?.fee ?? 0;
  }

  courses(): QuotePlanOption[] {
    this.refresh();
    return this.courseOptions;
  }

  rooms(family: boolean): QuotePlanOption[] {
    this.refresh();
    return family ? this.familyRoomOptions : this.adultRoomOptions;
  }

  private refresh(): void {
    // The page builds its quote before its price lists; until then the compiled catalog gives the options.
    const courses = this.pricing.courseFees;
    if (courses !== this.courseSource || !this.courseOptions.length) {
      this.courseSource = courses;
      const source = courses?.length ? courses : ENCANTO_COURSES.map(course => ({ id: course.id, name: course.name, schedule: course.schedule }));
      this.courseOptions = source
        .filter(course => ENCANTO_COURSES.some(item => item.id === course.id))
        .map(course => ({ id: course.id, name: course.name, details: course.schedule ?? '' }));
    }
    const rooms = this.pricing.roomFees;
    if (rooms !== this.roomSource || !this.adultRoomOptions.length) {
      this.roomSource = rooms;
      const source = rooms?.length ? rooms : ENCANTO_ROOMS.map(room => ({ id: room.id, name: room.name, note: room.note }));
      const options = source
        .filter(room => ENCANTO_ROOMS.some(item => item.id === room.id))
        .map(room => ({ id: room.id, name: room.name, details: room.note ?? '' }));
      this.adultRoomOptions = options.filter(room => room.id !== ENCANTO_FAMILY_ROOM_ID);
      this.familyRoomOptions = options.filter(room => room.id === ENCANTO_FAMILY_ROOM_ID);
    }
  }
}

/** One adult or one whole family, as the template binds it. */
export class EncantoPageStudent implements PhPageStudent {
  readonly visaOptions = VISA_OPTIONS;
  visaType = 'tourist59';
  readonly quotePlan: SchoolQuotePlan;
  /** Encanto's “家庭中老学员人数”, shown under 学生情况 for a family. */
  readonly extraChoices: readonly PhExtraChoice[];
  /** Encanto's course-length rules come through quoteError. */
  readonly courseLengthError = '';
  private ageGroup: 'adult' | 'minor' = 'adult';
  private returning = false;
  private returningMembers = 0;

  constructor(private readonly catalog: EncantoCatalogView, private readonly pricing: EncantoQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'esl', ADULT_ROOM_FALLBACK, nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course' ? catalog.courses() : catalog.rooms(this.isFamily),
      (kind, row) => this.rowPrice(kind, row),
      24, true, false,
    );
    const student = this;
    const returning: PhExtraChoice = {
      label: '家庭中老学员人数',
      inComparison: false,
      get options() { return RETURNING_OPTIONS[student.family?.members ?? 2] ?? RETURNING_OPTIONS[2]; },
      get visible() { return student.isFamily; },
      get note() {
        return student.isFamily && student.returningMembers > 0
          ? `整家价格已含每人注册费；${student.returningMembers}位老学员每人减${ENCANTO_RETURNING_MEMBER_DEDUCTION}美元。` : '';
      },
      get value() { return student.returningMembers; },
      set value(count: unknown) {
        student.returningMembers = Math.max(0, Math.min(Number(count) || 0, student.family?.members ?? 0));
        student.returning = student.returningMembers > 0;
      },
    };
    this.extraChoices = [returning];
  }

  // ---- what the plan holds ----------------------------------------------------------------------

  /** The family course of this quote, if the first course is one. */
  get family(): EncantoCourse | undefined {
    const info = this.catalog.course(this.quotePlan?.courses[0]?.optionId ?? '')?.info;
    return info?.kind === 'family' ? info : undefined;
  }
  get isFamily(): boolean { return !!this.family; }
  private get people(): number { return this.family?.members ?? 1; }

  /** Sunday week starts of the stay, split into Family Camp (peak) and other weeks. */
  private seasonWeeks(rows: readonly QuotePlanRow[]): { peak: number; off: number } {
    let peak = 0;
    let off = 0;
    for (const start of this.quotePlan.weekStarts([...rows])) {
      if (isEncantoPeakWeek(iso(start))) peak++;
      else off++;
    }
    return { peak, off };
  }
  get familyCampWeeks(): number { return this.seasonWeeks(this.quotePlan.courses).peak; }
  get offSeasonWeeks(): number { return this.seasonWeeks(this.quotePlan.courses).off; }

  /**
   * A row's price. Adults and the Family Camp: the four-week price at the tier of the total course weeks
   * (1/2/3 weeks: 45/65/85%, then proportional). A family stay with off-season weeks: Family Camp weeks at the
   * camp price ÷ 4 and the other weeks at the off-season price ÷ 4 (the school's cross-season rule).
   */
  private rowPrice(kind: QuotePlanKind, row: QuotePlanRow): number {
    const plan = this.quotePlan;
    const total = plan.courseWeeks;
    if (!Number.isInteger(total) || total < 1) return 0;
    const tier = Math.min(total, 4);
    const share = encantoDurationMultiple(tier) / tier;
    if (kind === 'room') return round(this.catalog.roomFee(row.optionId) * share * row.weeks);
    const course = this.catalog.course(row.optionId);
    if (!course) return 0;
    if (course.info.kind === 'adult' || this.offSeasonWeeks === 0) return round(course.peak * share * row.weeks);
    const weeks = this.seasonWeeks([row]);
    return round(course.peak / 4 * weeks.peak + course.off / 4 * weeks.off);
  }

  /** A family brings its family room; an adult course leaves it (template hook after a course or room pick). */
  planOptionChanged(): void {
    const family = this.family;
    for (const row of this.quotePlan.rooms) {
      if (family) row.optionId = ENCANTO_FAMILY_ROOM_ID;
      else if (row.optionId === ENCANTO_FAMILY_ROOM_ID) row.optionId = ADULT_ROOM_FALLBACK;
    }
    const members = family?.members ?? 0;
    this.returningMembers = family ? (this.returning ? members : Math.min(this.returningMembers, members)) : 0;
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return VISA_OPTIONS.find(option => option.value === this.visaType)?.label ?? ''; }
  private get entryDays(): 30 | 59 { return this.visaType === 'tourist30' ? 30 : 59; }

  get selectedAgeGroup(): 'adult' | 'minor' { return this.ageGroup; }
  set selectedAgeGroup(value: 'adult' | 'minor') { this.ageGroup = value; }

  get minorNote(): string {
    return this.isFamily
      ? '亲子课程按整家报价，孩子年龄不影响价格；2–4岁孩子上幼儿园课程，2岁以下婴儿请先让顾问向学校确认。'
      : '成人ESL／ESL2只收18岁及以上学生；未成年学生请和家长一起报亲子课程。';
  }

  /** Adults: waives the registration. Families: every member, or pick the number under 家庭中老学员人数. */
  get returningStudent(): boolean { return this.isFamily ? this.returningMembers > 0 : this.returning; }
  set returningStudent(value: boolean) {
    this.returning = value;
    this.returningMembers = value ? this.family?.members ?? 0 : 0;
  }
  /** Returning members of a family (0 for an adult). */
  get returningFamilyMembers(): number { return this.isFamily ? this.returningMembers : 0; }

  // ---- checks -----------------------------------------------------------------------------------

  minimumWeeks(_courseId: string): number { return 0; }

  get quoteError(): string {
    const plan = this.quotePlan;
    const kinds = new Set(plan.courses.map(row => this.catalog.course(row.optionId)?.info.kind));
    if (kinds.has('family') && kinds.has('adult')) return '亲子课程和成人课程请分开报价。';
    if (plan.error) return plan.error;
    const family = this.family;
    if (family) {
      if (new Set(plan.courses.map(row => row.optionId)).size > 1) return '同一个家庭请只选一种亲子课程。';
      if (!family.guardiansStudy && this.familyCampWeeks > 0) {
        return '“家长不上课”的淡季亲子只在3–6月和9–12月开设；1–2月、7–8月是亲子营，家长和孩子都要上课，请改选亲子课程或调整日期。';
      }
      if (plan.courseWeeks > ENCANTO_FAMILY_MAX_WEEKS) return `亲子课程最长报${ENCANTO_FAMILY_MAX_WEEKS}周；更长的安排请联系顾问向学校确认。`;
      // Off-season family prices are per four weeks; any 4–8 weeks is allowed (school answer 2026-11-24), 1–3 weeks
      // only inside the peak Family Camp. A stay across both seasons follows the school's example.
      if (this.offSeasonWeeks > 0 && plan.courseWeeks < 4) return '淡季的亲子课程至少报4周（只有寒暑假亲子营可以读1–3周）。';
    } else {
      if (this.ageGroup === 'minor') return '成人ESL／ESL2只收18岁及以上学生；未成年学生请和家长一起报亲子课程。';
      if (this.seasonWeeks([...plan.courses, ...plan.rooms]).peak > 0) {
        return '成人ESL／ESL2只在淡季开课（3–6月、9–12月）；1–2月和7–8月学校只开亲子营，请调整入学日期或周数。';
      }
    }
    const lastEnd = iso(Date.parse(`${ENCANTO_LAST_WEEK_START}T00:00:00Z`) + 6 * DAY);
    if (plan.endDate > lastEnd) return '学校目前只公布到2027年底的价格，更晚的日期请联系顾问确认。';
    return '';
  }

  // ---- school payment ---------------------------------------------------------------------------

  /** Family prices already hold each member's registration. */
  get registration(): number { return this.isFamily || this.returning ? 0 : this.pricing.registrationFee; }
  get registrationNote(): string | undefined {
    return this.isFamily ? '亲子课程整家价格已含每人注册费' : undefined;
  }
  get tuition(): number { return round(this.quotePlan.total('course')); }
  get accommodation(): number { return round(this.quotePlan.total('room')); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  /** Encanto's weekly resort fee for adult rooms; never discounted. */
  get resortFee(): number {
    if (this.isFamily) return 0;
    return this.quotePlan.rooms.reduce((sum, row) =>
      sum + (ENCANTO_ROOMS.find(room => room.id === row.optionId)?.resortFeePerWeek ?? 0) * row.weeks, 0);
  }

  private get sidaRate(): number {
    const rule = this.pricing.promotions?.find(item => item.id === ENCANTO_SIDA_RULE_ID);
    if (!rule) return ENCANTO_SIDA_RATE;
    return rule.enabled ? Math.max(0, 1 - rule.discountValue / 100) : 1;
  }

  private get discounts(): Array<{ label: string; key: string; amount: number; note: string }> {
    const plan = this.quotePlan;
    const family = this.family;
    // Adults and every family member alike (user answers 2026-11-24): 100 dollars per person.
    const christmasApplies = plan.courseWeeks >= ENCANTO_CHRISTMAS_OFFER.minimumWeeks
      && plan.overlapWeeks(ENCANTO_CHRISTMAS_OFFER.start, ENCANTO_CHRISTMAS_OFFER.end) > 0;
    const christmasPeople = family ? this.people : 1;
    const christmas = {
      label: '圣诞优惠', key: ENCANTO_CHRISTMAS_OFFER.id,
      amount: christmasApplies ? ENCANTO_CHRISTMAS_OFFER.amount * christmasPeople : 0,
      note: `学习期间涉及${slash(ENCANTO_CHRISTMAS_OFFER.start)}–${slash(ENCANTO_CHRISTMAS_OFFER.end)}且至少${ENCANTO_CHRISTMAS_OFFER.minimumWeeks}周${family ? `，每人${ENCANTO_CHRISTMAS_OFFER.amount}美元 × ${christmasPeople}人` : ''}；到校后延期不适用。`,
    };
    if (family) {
      const campWeeks = this.familyCampWeeks;
      return [
        {
          label: '思达启航亲子营优惠', key: 'encanto-family-camp-sida',
          amount: ENCANTO_FAMILY_CAMP_SIDA_PER_PERSON_WEEK * this.people * campWeeks,
          note: `旺季亲子营每人每周${ENCANTO_FAMILY_CAMP_SIDA_PER_PERSON_WEEK}美元：${this.people}人 × ${campWeeks}周；淡季周数没有折扣。`,
        },
        {
          label: '老学员注册费减免', key: 'encanto-returning',
          amount: ENCANTO_RETURNING_MEMBER_DEDUCTION * this.returningMembers,
          note: `整家价格已含注册费，${this.returningMembers}位老学员每人减${ENCANTO_RETURNING_MEMBER_DEDUCTION}美元。`,
        },
        christmas,
      ].filter(item => item.amount > 0);
    }
    const start = plan.startDate;
    const rate = this.sidaRate;
    const offers = ENCANTO_OFF_SEASON_OFFERS.map(offer => {
      const weeks = start >= offer.arrivalFrom ? plan.overlapWeeks(offer.start, offer.end) : 0;
      return {
        label: offer.label, key: offer.id, amount: weeks * offer.perWeek,
        note: `${slash(offer.start)}–${slash(offer.end)}期间每学习1周减${offer.perWeek}美元，本次${weeks}周；到校后延期不适用。`,
      };
    });
    return [
      {
        label: '思达启航折扣', key: ENCANTO_SIDA_RULE_ID, amount: round((this.tuition + this.accommodation) * (1 - rate)),
        note: `课程费和住宿费打${Math.round(rate * 100) / 10}折；注册费和度假村设施费不打折。`,
      },
      ...offers,
      christmas,
    ].filter(item => item.amount > 0);
  }

  get promotionDiscountTotal(): number { return round(this.discounts.reduce((sum, item) => sum + item.amount, 0)); }
  get discountNames(): string { return this.discounts.map(item => item.label).join('、'); }

  get quoteUsd(): number {
    return Math.max(0, round(this.registration + this.tuition + this.accommodation + this.resortFee - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const resort = this.resortFee;
    const rooms = this.quotePlan.rooms
      .map(row => {
        const room = ENCANTO_ROOMS.find(item => item.id === row.optionId);
        return room ? `${room.label}${room.resortFeePerWeek}美元 × ${row.weeks}周` : '';
      })
      .filter(Boolean)
      .join('＋');
    return [
      ...(resort ? [{
        icon: '度', label: '度假村设施费（Resort Fee）', value: resort,
        note: `${rooms}；海滨度假村校区的设施费，按住宿周数收取，不参与折扣。`,
      }] : []),
      ...this.discounts.map(item => ({ icon: '惠', label: item.label, value: -item.amount, note: item.note, promotionKey: item.key })),
    ];
  }

  // ---- local fees -------------------------------------------------------------------------------

  /** 2026 arrivals pay the 2025 local-fee sheet, 2027 arrivals the 2027 sheet (school rule). */
  private get feeSheet() {
    return ENCANTO_LOCAL_FEES[this.quotePlan.startDate >= '2027-01-01' ? 2027 : 2025];
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const family = this.family;
    const sheet = this.feeSheet;
    const people = this.people;
    const each = people > 1 ? `／人` : '';
    const perPeople = (amount: number) => `${peso(amount)}${each}`;
    if (family && this.offSeasonWeeks === 0) {
      return [{
        item: '到校学杂费', unitLabel: '已含', quantity: 0, total: 0, waived: true,
        note: '旺季亲子营整家价格已含SSP、SSP I-Card、5周以上签证续签、管理费、水电、每周清洁、洗衣和接机。',
      }];
    }
    // Weekly fees: adults by room weeks; a family only for its off-season weeks (the camp weeks are included).
    const weeks = family ? this.offSeasonWeeks : plan.roomWeeks;
    const blocks = Math.ceil(weeks / 4);
    const crossSeason = !!family && this.familyCampWeeks > 0;
    const stayDays = plan.stayWeeks * 7;
    const visa = encantoVisaExtensions(stayDays, this.entryDays);
    const card = stayDays >= 60 ? 1 : 0;
    const included = '旺季亲子营已含，跨季不重复收取。';
    const blockNote = `按${family ? '淡季' : '住宿'}${weeks}周计${blocks}期；不满4周按4周计，以学校结算为准。`;
    return [
      crossSeason
        ? { item: 'SSP学习许可', unitLabel: '已含', quantity: 0, total: 0, waived: true, note: included }
        : { item: 'SSP学习许可', unitLabel: perPeople(sheet.ssp), quantity: people, total: sheet.ssp * people, note: '每人一次。' },
      crossSeason
        ? { item: 'SSP I-Card', unitLabel: '已含', quantity: 0, total: 0, waived: true, note: included }
        : { item: 'SSP I-Card', unitLabel: perPeople(sheet.sspICard), quantity: people, total: sheet.sspICard * people, note: '每人一次。' },
      {
        item: '签证续签', unitLabel: `按次${each}`, quantity: visa.count * people, total: visa.total * people,
        note: `入境${this.entryDays}天签证，停留${plan.stayWeeks}周需续签${visa.count}次（${this.entryDays === 30 ? '5,130／6,400／之后每次4,430' : '6,400／之后每次4,430'}比索）。${crossSeason ? '跨季入读的签证费请让顾问向学校确认。' : ''}`,
      },
      {
        item: '签证I-Card（ACR）', unitLabel: perPeople(sheet.visaICard), quantity: card * people, total: sheet.visaICard * card * people,
        note: '停留60天及以上时办理一次。',
      },
      {
        item: sheet.upkeepName, unitLabel: `${peso(sheet.upkeep)}${each}／4周`, quantity: blocks * people, total: sheet.upkeep * blocks * people,
        note: blockNote,
      },
      {
        item: '水电费', unitLabel: `${peso(sheet.electricityWater)}${each}／4周`, quantity: blocks * people, total: sheet.electricityWater * blocks * people,
        note: `${blockNote}超额用电用水另付。`,
      },
    ];
  }

  /** Pickup and deposit references (outside the local-fee total). */
  get pickupIncluded(): boolean { return this.isFamily && this.familyCampWeeks > 0; }
  /** One person's deposit for a family: whether the school charges it per person or per family room is not stated. */
  get depositAmount(): number { return this.feeSheet.deposit * (this.isFamily ? 1 : this.people); }
  get depositNote(): string { return this.feeSheet.depositNote; }
  get pickupAmount(): number { return this.pickupIncluded ? 0 : this.feeSheet.pickup * this.people; }
  get personCount(): number { return this.people; }
}

/** Pickup, deposit and textbooks: references outside the local-fee total. */
function encantoOptionalFees(
  students: readonly EncantoPageStudent[], quote: PhSchoolQuote<EncantoPageStudent>, phpPerCny: number,
): PhOptionalFeeItem[] {
  const cny = (php: number) => `约人民币 ${quoteCurrencyText(Math.round(php / phpPerCny), 'zh-CN')} 元`;
  const pickup = students.reduce((sum, student) => sum + student.pickupAmount, 0);
  const deposit = students.reduce((sum, student) => sum + student.depositAmount, 0);
  const people = students.reduce((sum, student) => sum + student.personCount, 0);
  const allIncluded = students.every(student => student.pickupIncluded);
  const families = students.some(student => student.isFamily);
  const count = people > 1 ? `（${people}人）` : '';
  return [
    {
      label: '宿务麦克坦机场接机',
      amount: allIncluded ? '亲子营已含' : quote.formatPhp(pickup),
      cnyAmount: allIncluded ? '' : cny(pickup),
      note: `${allIncluded ? '' : `每人1,200比索${count}；可选，`}旺季亲子营已含接机。2027年3月起学校不再提供免费送机，需要送机请提前让顾问确认费用。`,
    },
    {
      label: '押金（离校时退还）',
      amount: quote.formatPhp(deposit),
      cnyAmount: cny(deposit),
      note: families
        ? `每人${students[0]?.depositNote ?? ''}；家庭按人数还是按房间收取以学校为准；离校退房检查后退还。`
        : `每人${students[0]?.depositNote ?? ''}${count}；离校退房检查后按学校规定退还。`,
    },
    {
      label: '教材',
      amount: '到校按实际购买',
      cnyAmount: '',
      note: families ? '按课程需要购买；亲子课程第一套教材免费。' : '按课程需要购买，以学校实际收费为准。',
    },
  ];
}

export class EncantoQuote extends PhSchoolQuote<EncantoPageStudent> {
  constructor(pricing: EncantoQuotePricing) {
    const catalog = new EncantoCatalogView(pricing);
    super(pricing, {
      createStudent: () => new EncantoPageStudent(catalog, pricing),
      headingPrefix: 'SMEAG Encanto',
      image: {
        schoolCode: 'SMEAG',
        schoolName: '菲律宾宿务SMEAG Encanto海滨校区',
        filePrefix: 'SMEAG-Encanto',
        heroSrc: ENCANTO_QUOTE_IMAGE_HERO,
      },
      priceMultiplier: encantoDurationMultiple,
      optionalFeeItems: (students, quote) => encantoOptionalFees(students, quote, pricing.phpPerCny),
      layoutVersion: 2,
    });
  }

  /** A family is one whole-family price, so families are quoted one at a time. */
  override get quoteError(): string {
    if (this.quoteMode === 'group' && this.activeStudents.some(student => student.isFamily)) {
      return '亲子课程按整家报价，请用单人报价，每个家庭单独报一份。';
    }
    return super.quoteError;
  }

  /** A family's conditions name the family instead of an age group. */
  override studentConditionText(student: EncantoPageStudent): string {
    const family = student.family;
    if (!family) return super.studentConditionText(student);
    const returning = student.returningFamilyMembers;
    return [
      returning === 0 ? '新学员' : returning === family.members ? '老学员' : `其中${returning}人是老学员`,
      family.guardiansStudy ? `${family.members}人家庭` : `${family.guardians}位家长＋${family.children}个孩子`,
      student.visaLabel,
    ].join(' · ');
  }
}

/**
 * The page's prices with only the adult courses and rooms: 方案对比 compares adult ESL/ESL2 plans, because a family
 * course is one whole-family price with its own family room.
 */
class EncantoAdultPricingView implements PhComparePricing {
  private courseSource?: readonly CiaQuoteCourse[];
  private roomSource?: readonly CiaQuoteRoom[];
  private courseCache: CiaQuoteCourse[] = [];
  private roomCache: CiaQuoteRoom[] = [];

  constructor(private readonly source: EncantoQuotePricing) {}

  get courseFees(): CiaQuoteCourse[] {
    if (this.courseSource !== this.source.courseFees) {
      this.courseSource = this.source.courseFees;
      this.courseCache = (this.source.courseFees ?? []).filter(course => !isEncantoFamilyCourse(course.id));
    }
    return this.courseCache;
  }
  get roomFees(): CiaQuoteRoom[] {
    if (this.roomSource !== this.source.roomFees) {
      this.roomSource = this.source.roomFees;
      this.roomCache = (this.source.roomFees ?? []).filter(room => room.id !== ENCANTO_FAMILY_ROOM_ID);
    }
    return this.roomCache;
  }
  get registrationFee() { return this.source.registrationFee; }
  get seasonalFeePerWeek() { return this.source.seasonalFeePerWeek; }
  get peakSeasonRanges() { return this.source.peakSeasonRanges; }
  get promotions() { return this.source.promotions; }
  get localFeeRules() { return this.source.localFeeRules; }
  get quoteImageSettings() { return this.source.quoteImageSettings; }
  get usdToCny() { return this.source.usdToCny; }
  get phpPerCny() { return this.source.phpPerCny; }
  get exchangeRateDate() { return this.source.exchangeRateDate; }
  get usingLiveExchangeRates() { return this.source.usingLiveExchangeRates; }
}

/** The first Sunday from this date whose study week is not a Family Camp week. */
function nextAdultSunday(date: string): string {
  let time = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(time)) return date;
  for (let guard = 0; guard < 20 && isEncantoPeakWeek(iso(time)); guard++) time += 7 * DAY;
  return iso(time);
}

export class EncantoPlanComparison extends PhPlanComparison<EncantoPageStudent> {
  constructor(pricing: EncantoQuotePricing, conditions: () => EncantoPageStudent) {
    const catalog = new EncantoCatalogView(pricing);
    super(new EncantoAdultPricingView(pricing), conditions, {
      createStudent: () => new EncantoPageStudent(catalog, pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        // A family's conditions do not describe one adult; the plans then compare a new adult student.
        to.selectedAgeGroup = from.isFamily ? 'adult' : from.selectedAgeGroup;
        to.returningStudent = from.isFamily ? false : from.returningStudent;
      },
      heading: 'SMEAG Encanto 方案对比报价',
      courseGroups: [{ id: 'esl', label: 'ESL和ESL2', courseIds: ['esl', 'esl2'] }],
      extraNotes: () => ['学校费用合计已含度假村设施费（单人间100、双人间75、三人间50美元／周），设施费不参与折扣。'],
      layoutVersion: 2,
    });
  }

  /** Plan A starts from the normal quote; a family quote becomes an adult ESL plan in the off-season. */
  override start(focus: PhCompareFocus = this.focus): void {
    super.start(focus);
    const first = this.plans[0];
    if (!first) return;
    const adult = !isEncantoFamilyCourse(this.courseId(first));
    const date = this.startDate(first);
    const offSeason = nextAdultSunday(date);
    if (adult && offSeason === date) return;
    if (!adult) {
      this.setCourse(first, 'esl');
      this.setRoom(first, ADULT_ROOM_FALLBACK);
    }
    if (offSeason !== date) this.setStartDate(first, offSeason);
    this.applyFocus(focus);
  }
}
