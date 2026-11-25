// PINES (碧瑶; Main Campus and IELTS Campus) as a cross-school comparison entry. Every amount comes
// from PinesStudentQuote, the same per-student calculator the PINES page, its group quote and its
// quote image use; this adapter only hands it one course row, one room row and the shared
// conditions, and reads the results back.
// The pricing object below mirrors the page component's fields the calculator reads, filled the way
// the page fills them (applyContentConfig): compiled defaults first, then a published revision.
// PINES charges the same nine room types on both campuses, but a course and its room must be on the
// same campus (IELTS courses on the IELTS Campus, all others on the Main Campus). The comparison
// therefore sees one campus-neutral room list (“twin-b”), and each plan books that room type on its
// course's campus (“main-twin-b” or “ielts-twin-b”).
// Keep this file free of Angular, DOM and storage access.
import type { CiaContentConfig } from '../../philippines/cia-school/cia-content-config';
import { clonePinesContentConfig, createDefaultPinesContentConfig } from '../../philippines/pines-school/pines-content-config';
import { PinesStudentQuote } from '../../philippines/pines-school/pines-student-quote';
import {
  compareRoomFacts,
  type CompareConditions,
  type CompareCourseOption,
  type CompareGoal,
  type CompareRoomOption,
  type CompareSchool,
  type CompareSchoolPlan,
  type CompareSchoolResult,
  type CompareSchoolSource,
} from '../school-compare';

type PinesPricing = ConstructorParameters<typeof PinesStudentQuote>[0];
type PinesCampus = 'main' | 'ielts';

const SCHOOL_CODE = 'PINES';
const TAG = 'PINES';

const CAMPUS_LABELS: Readonly<Record<PinesCampus, string>> = { main: '主校区', ielts: '雅思校区' };

/** The calculator's own campus rule: IELTS course ids belong to the IELTS Campus, all others to the Main Campus. */
const courseCampus = (courseId: string): PinesCampus => courseId.includes('ielts') ? 'ielts' : 'main';
const roomCampus = (roomId: string): PinesCampus | null => /^main-/.test(roomId) ? 'main' : /^ielts-/.test(roomId) ? 'ielts' : null;
const neutralRoomId = (roomId: string) => roomId.replace(/^(main|ielts)-/, '');
const neutralRoomName = (name: string) => name.replace(/^(主校区|雅思校区)\s*/u, '');

const GOALS: Partial<Record<CompareGoal, { ids: readonly string[]; closest?: boolean }>> = {
  // Intensive ESL is PINES's general English course; Light ESL 4 and Power ESL 5/7 follow.
  general: { ids: ['intensive-esl', 'light-esl-4', 'power-esl-5', 'power-esl-7'] },
  speaking: { ids: ['power-speaking'] },
  ielts: { ids: ['ielts-regular', 'pre-ielts', 'ielts-intensive'] },
  // The 8-week guarantee (5.5/6.0) has the lowest entry length; the 12-week ones are cheaper per 4 weeks.
  'ielts-guarantee': {
    ids: ['ielts-guarantee-8-weeks-5-5-6-0', 'ielts-guarantee-12-weeks-5-5-6-0', 'ielts-guarantee-8-weeks-6-5-7-0', 'ielts-guarantee-12-weeks-6-5-7-0'],
  },
  toeic: { ids: ['toeic-toeic-speaking'] },
  business: { ids: ['business-english-practical', 'business-english-executive'] },
};

const isPinesContent = (value: unknown): value is CiaContentConfig => {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && typeof content === 'object' && content.schemaVersion === 1 && content.schoolCode === SCHOOL_CODE
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions);
};

/** People per room: 1–4 from the shared reader, plus PINES's 5B Solo and six-bed rooms; family rooms say no number. */
const roomFacts = (name: string, note: string): Omit<CompareRoomOption, 'id' | 'name' | 'fee'> => {
  const facts = compareRoomFacts(name);
  const beds = facts.beds || (/5B|五人/i.test(name) ? 5 : /六人/.test(name) ? 6 : 0);
  // Single B shares a living room with a second bedroom (“套间”); keep the plain rooms first.
  return { beds, offCampus: facts.offCampus, suite: facts.suite || note.includes('套间') };
};

const formatPeso = (value: number) => Math.round(value).toLocaleString('en-US');

class PinesCompareSchool implements CompareSchool {
  readonly id = 'pines';
  readonly tag = TAG;
  readonly name = '菲律宾碧瑶 PINES 语言学校';
  readonly country = '菲律宾';
  readonly city = '碧瑶';
  readonly location = '碧瑶市 主校区／雅思校区';
  readonly pagePath = '/philippines-study/baguio/pines-international-academy';
  readonly schoolCurrency = 'USD' as const;
  readonly localCurrency = 'PHP' as const;

  /** The fields PinesStudentQuote reads, named as on the page; updated in place so existing plans see a new revision. */
  readonly pricing: PinesPricing = {
    courseFees: [],
    roomFees: [],
    registrationFee: 0,
    registrationWaiverEnabled: false,
    sidaDiscountRate: 1,
    offSeasonDiscountPerFourWeeks: 0,
    offSeasonRegistrationEnd: '',
    twelveWeekMinimumWeeks: Number.MAX_SAFE_INTEGER,
    twelveWeekDiscount: 0,
    longStayMinimumWeeks: Number.MAX_SAFE_INTEGER,
    longStayBaseDiscount: 0,
    longStayIncrementWeeks: 1,
    longStayIncrementDiscount: 0,
    seasonalFeePerWeek: 0,
    peakSeasonRanges: [],
    shortStayRatios: {},
    localFeeRules: [],
    promotionRules: [],
  };
  /** Daily lessons per course id, from the content document (the page joins them into `suitable`). */
  private schedules = new Map<string, string>();
  private courseCache?: { source: PinesPricing['courseFees']; list: CompareCourseOption[] };
  private roomCache?: { source: PinesPricing['roomFees']; list: CompareRoomOption[] };

  constructor() {
    this.applyContent(createDefaultPinesContentConfig());
  }

  get courses(): CompareCourseOption[] {
    const source = this.pricing.courseFees;
    if (this.courseCache?.source !== source) {
      this.courseCache = {
        source,
        list: source.map(course => ({ id: course.id, name: this.courseName(course.id), schedule: this.schedules.get(course.id) ?? '' })),
      };
    }
    return this.courseCache.list;
  }

  /** One entry per room type, whichever campus offers it; a type on one campus only says so. */
  get rooms(): CompareRoomOption[] {
    const source = this.pricing.roomFees;
    if (this.roomCache?.source !== source) {
      const types = new Map<string, { name: string; fee: number; note: string; campuses: Set<PinesCampus | null> }>();
      for (const room of source) {
        const id = neutralRoomId(room.id);
        const entry = types.get(id);
        if (entry) entry.campuses.add(roomCampus(room.id));
        else types.set(id, { name: neutralRoomName(room.name), fee: room.fee, note: room.note, campuses: new Set([roomCampus(room.id)]) });
      }
      const list = [...types.entries()].map(([id, type]) => {
        const only = type.campuses.size === 1 ? [...type.campuses][0] : null;
        const name = only ? `${type.name}（仅${CAMPUS_LABELS[only]}）` : type.name;
        return { id, name, fee: type.fee, ...roomFacts(type.name, type.note) };
      });
      this.roomCache = { source, list };
    }
    return this.roomCache.list;
  }

  goalCourses(goal: CompareGoal): { ids: string[]; closest?: boolean } {
    const entry = GOALS[goal];
    return { ids: [...(entry?.ids ?? [])], ...(entry?.closest ? { closest: true } : {}) };
  }

  /** The calculator's own guarantee-length rule (pines-student-quote.ts quoteError). */
  minimumWeeks(courseId: string): number {
    if (courseId.includes('guarantee-12-weeks')) return 12;
    if (courseId.includes('guarantee-8-weeks')) return 8;
    return 0;
  }

  createPlan(courseId: string, roomId: string): CompareSchoolPlan {
    return new PinesComparePlan(this, courseId, roomId);
  }

  /** Course name with its campus, as the page's course selector shows it. */
  courseName(courseId: string): string {
    const course = this.pricing.courseFees.find(item => item.id === courseId);
    return course ? `${CAMPUS_LABELS[courseCampus(course.id)]}｜${course.name}` : '';
  }

  /** The same steps as PinesSchoolDetailComponent.applyContentConfig, on the fields the calculator reads. */
  applyContent(value: CiaContentConfig): void {
    const content = clonePinesContentConfig(value);
    const pricing = this.pricing;
    const courses = content.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    const rooms = content.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    if (courses.length) {
      this.schedules = new Map(courses.map(item => [item.id, item.schedule ?? '']));
      pricing.courseFees = courses.map(item => ({
        id: item.id,
        name: item.name,
        tuition: item.tuition,
        suitable: `${item.suitable}${item.schedule ? `｜${item.schedule}` : ''}`,
      }));
    }
    if (rooms.length) {
      pricing.roomFees = rooms.map(item => ({ id: item.id, name: item.name, fee: item.fee, note: item.note }));
    }

    const settings = content.quoteSettings;
    pricing.registrationFee = settings.registrationFee;
    pricing.shortStayRatios = { ...settings.shortStayRatios };
    pricing.seasonalFeePerWeek = settings.peakSeasonFeePerWeek;
    pricing.peakSeasonRanges = settings.peakSeasonRanges
      .filter(item => item.enabled)
      .map(({ label, start, end }) => ({ label, start, end }));
    pricing.localFeeRules = content.localFees.map(item => ({ ...item }));
    pricing.promotionRules = settings.promotions.map(item => ({ ...item }));
    const promotion = (id: string) => pricing.promotionRules.find(item => item.id === id && item.enabled);
    const registration = promotion('pines-registration-waiver');
    const offSeason = promotion('pines-off-season');
    const twelveWeek = promotion('pines-twelve-week');
    const longStay = promotion('pines-long-stay');
    const sida = promotion('pines-sida-discount');
    pricing.registrationWaiverEnabled = !!registration?.waiveRegistration;
    pricing.offSeasonDiscountPerFourWeeks = offSeason?.discountValue ?? 0;
    pricing.offSeasonRegistrationEnd = offSeason?.registrationEnd ?? '';
    pricing.twelveWeekMinimumWeeks = twelveWeek?.minimumCourseWeeks ?? Number.MAX_SAFE_INTEGER;
    pricing.twelveWeekDiscount = twelveWeek?.discountValue ?? 0;
    pricing.longStayMinimumWeeks = longStay?.minimumCourseWeeks ?? Number.MAX_SAFE_INTEGER;
    pricing.longStayBaseDiscount = longStay?.discountValue ?? 0;
    pricing.longStayIncrementWeeks = Math.max(1, longStay?.incrementWeeks ?? 2);
    pricing.longStayIncrementDiscount = longStay?.incrementValue ?? 0;
    pricing.sidaDiscountRate = sida?.discountType === 'percentage' ? 1 - sida.discountValue / 100 : 1;
  }
}

class PinesComparePlan implements CompareSchoolPlan {
  private readonly student: PinesStudentQuote;
  private rowsKey = '';

  constructor(private readonly school: PinesCompareSchool, public courseId: string, public roomId: string) {
    this.student = new PinesStudentQuote(school.pricing);
  }

  result(conditions: CompareConditions): CompareSchoolResult {
    const { weeks, startDate } = conditions;
    const pricing = this.school.pricing;
    const campus = courseCampus(this.courseId);
    const roomType = neutralRoomId(this.roomId);
    const campusRoom = pricing.roomFees.find(room => room.id === `${campus}-${roomType}`);
    // A room type the other campus has but this course's campus has not cannot be booked.
    const otherCampusRoom = campusRoom ? undefined : pricing.roomFees.find(room => neutralRoomId(room.id) === roomType);
    const roomOptionId = campusRoom?.id ?? this.roomId;

    const key = [this.courseId, roomOptionId, weeks, startDate].join('|');
    const plan = this.student.quotePlan;
    if (key !== this.rowsKey) {
      plan.courses = [{ id: 1, optionId: this.courseId, weeks, startDate }];
      plan.rooms = [{ id: 2, optionId: roomOptionId, weeks, startDate }];
      this.rowsKey = key;
    }
    const student = this.student;
    student.selectedAgeGroup = conditions.ageGroup;
    student.visaType = conditions.visaType;
    student.selectedRegistrationDate = conditions.registrationDate;
    student.returningStudent = false;
    student.pickupAirport = 'none';

    const error = otherCampusRoom
      ? `${CAMPUS_LABELS[campus]}没有${neutralRoomName(otherCampusRoom.name)}，请改选其他房型。`
      : student.quoteError;
    const discountNames = student.paymentLines
      .filter(line => line.value < 0 && line.promotionKey !== 'registration')
      .map(line => line.label)
      .join('、');

    return {
      courseName: this.school.courseName(this.courseId) || '请选择课程',
      courseSchedule: this.school.courses.find(course => course.id === this.courseId)?.schedule ?? '',
      roomName: campusRoom?.name ?? (otherCampusRoom ? neutralRoomName(otherCampusRoom.name) : '请选择房型'),
      error,
      tuition: student.tuition,
      accommodation: student.accommodation,
      registration: student.registration - student.registrationDiscount,
      discount: student.fixedCourseRoomDiscounts + student.sidaDiscount,
      discountNames,
      surcharge: student.seasonalSurcharge,
      schoolTotal: student.quoteUsd,
      localTotal: student.localFees.reduce((sum, fee) => sum + fee.total, 0),
      notes: error ? [] : this.notes(),
    };
  }

  /** PINES-only facts a student needs beside the totals. */
  private notes(): string[] {
    const notes: string[] = [];
    if (this.school.minimumWeeks(this.courseId) > 0) {
      notes.push(`${TAG}：IELTS保证班有入学分数、出勤率和模考要求，报名前需逐项确认。`);
    }
    const deposit = this.school.pricing.localFeeRules.find(rule => rule.id === 'campus-deposit' && rule.enabled);
    const depositTotal = this.student.campusDeposit.total;
    if (deposit && depositTotal > 0) {
      notes.push(`${TAG}：到校另需校内预存款${formatPeso(deposit.amount)}比索／${deposit.periodWeeks ?? 4}周（本方案约${formatPeso(depositTotal)}比索），用于教材、洗衣等并按实际扣费，未计入到校学杂费。`);
    }
    return notes;
  }
}

export function createPinesCompareSource(): CompareSchoolSource {
  const school = new PinesCompareSchool();
  return {
    school,
    pricingSchoolName: '菲律宾碧瑶PINES语言学校',
    applyPublished: content => {
      if (isPinesContent(content)) school.applyContent(content);
    },
  };
}
