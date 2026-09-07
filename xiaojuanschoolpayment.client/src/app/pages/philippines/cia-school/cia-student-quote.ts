import { SchoolQuotePlan, quoteMoney } from '../../../components/school-quote-plan';
import {
  SCHOOL_VISA_OPTIONS,
  SchoolVisaType,
  SchoolLocalFee,
  SchoolPaymentLine,
} from '../../../components/school-group-quote';
import {
  CiaLocalFeeRule,
  CiaPromotionRule,
} from './cia-content-config';

interface CiaQuotePrices {
  courseFees: { id: string; name: string; schedule: string; tuition: number; tuition2027: number }[];
  roomFees: { id: string; name: string; fee: number }[];
  registrationFee: number;
  futurePriceRegistrationStart: string;
  futurePriceArrivalStart: string;
  shortTermPriceRatios: Readonly<Record<string, number>>;
  seasonalFeePerWeek: number;
  peakSeasonRanges: readonly { label: string; start: string; end: string; enabled?: boolean }[];
  promotions: CiaPromotionRule[];
  localFeeRules: CiaLocalFeeRule[];
}

export interface CiaPromotionResult {
  rule: CiaPromotionRule;
  amount: number;
}

const defaultRatios: Readonly<Record<string, number>> = { '1': 0.4, '2': 0.6, '3': 0.8 };

export const ciaPriceMultiplier = (
  weeks: number,
  ratios: Readonly<Record<string, number>> = defaultRatios,
) => ratios[String(weeks)] ?? weeks / 4;

const rounded = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/** CIA policy only; independent people can study on the same dates. */
export class CiaStudentQuote {
  constructor(private readonly prices: CiaQuotePrices) {}

  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  selectedRegistrationDate = today();
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  visaType: SchoolVisaType = 'tourist59';
  readonly weekOptions = [1, 2, 3, 4, 6, 8, 12, 16, 20, 24];

  readonly quotePlan = new SchoolQuotePlan(
    'regular-esl',
    'd4',
    '2026-09-06',
    this.weekOptions,
    (kind) =>
      kind === 'course'
        ? this.prices.courseFees.map((course) => ({
            id: course.id,
            name: course.name,
            details: course.schedule,
          }))
        : this.prices.roomFees.map((room) => ({
            id: room.id,
            name: room.name,
            details: '',
          })),
    (kind, row) => {
      const course = this.prices.courseFees.find((item) => item.id === row.optionId);
      const usesFuturePrice =
        this.selectedRegistrationDate >= this.prices.futurePriceRegistrationStart &&
        row.startDate >= this.prices.futurePriceArrivalStart;
      const rate =
        kind === 'course'
          ? usesFuturePrice
            ? course?.tuition2027
            : course?.tuition
          : this.prices.roomFees.find((room) => room.id === row.optionId)?.fee;
      return (rate ?? 0) * ciaPriceMultiplier(row.weeks, this.prices.shortTermPriceRatios);
    },
  );

  get quoteError() {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) {
      return '请选择有效的报名注册日期。';
    }
    if (!['adult', 'minor'].includes(this.selectedAgeGroup)) {
      return '请选择抵达时年龄段。';
    }
    return this.visaOptions.some((option) => option.value === this.visaType)
      ? ''
      : '请选择有效的签证类型。';
  }

  get isLongTermVisa() {
    return !['tourist30', 'tourist59'].includes(this.visaType);
  }

  get visaLabel() {
    return this.visaOptions.find((option) => option.value === this.visaType)?.label ?? '';
  }

  get visaExemptionNote() {
    return `${this.visaLabel}暂按免收预估；须由顾问向学校确认政策是否调整及是否免收。`;
  }

  get visaExtensionCount() {
    return this.isLongTermVisa
      ? 0
      : Math.max(
          0,
          Math.ceil(
            (this.quotePlan.stayWeeks * 7 - (this.visaType === 'tourist30' ? 30 : 59)) / 30,
          ),
        );
  }

  get visaRates() {
    const configuredRates = this.prices.localFeeRules.find(
      (rule) => rule.enabled && rule.billingRule === 'visa-extension-schedule',
    )?.rates ?? [6410, 4540, 4540, 4540, 5650];
    const fallback = configuredRates.at(-1) ?? 0;
    return Array.from(
      { length: this.visaExtensionCount },
      (_, index) => configuredRates[index] ?? fallback,
    );
  }

  get tuition() {
    return this.quotePlan.total('course');
  }

  get accommodation() {
    return this.quotePlan.total('room');
  }

  get promotionResults(): CiaPromotionResult[] {
    const eligible = this.prices.promotions
      .filter((rule) => rule.enabled && this.isPromotionEligible(rule))
      .map((rule) => ({ rule, amount: this.promotionAmount(rule) }))
      .filter((result) => result.amount > 0 || result.rule.waiveRegistration)
      .sort(
        (a, b) =>
          b.rule.priority - a.rule.priority ||
          a.rule.sortOrder - b.rule.sortOrder,
      );

    const exclusive = eligible.filter((result) => !result.rule.stackable);
    return exclusive.length > 0 ? [exclusive[0]] : eligible;
  }

  get christmasEligible() {
    return this.promotionResults.some((result) => result.rule.id === 'christmas-2026');
  }

  get registration() {
    const waivedByPromotion = this.promotionResults.some(
      (result) => result.rule.waiveRegistration,
    );
    return this.returningStudent || waivedByPromotion ? 0 : this.prices.registrationFee;
  }

  get sidaDiscount() {
    return this.promotionResults.find((result) => result.rule.id === 'sida-discount')?.amount ?? 0;
  }

  get christmasDiscount() {
    return this.promotionResults.find((result) => result.rule.id === 'christmas-2026')?.amount ?? 0;
  }

  get promotionDiscountTotal() {
    return rounded(this.promotionResults.reduce((sum, result) => sum + result.amount, 0));
  }

  get peakWeeks() {
    const enabledRanges = this.prices.peakSeasonRanges.filter(
      (range) => range.enabled !== false,
    );
    return this.quotePlan
      .weekStarts([...this.quotePlan.courses, ...this.quotePlan.rooms])
      .filter((week) =>
        enabledRanges.some(
          (range) =>
            week <= this.quotePlan.date(range.end)! &&
            week + 6 * 86400000 >= this.quotePlan.date(range.start)!,
        ),
      ).length;
  }

  get seasonalSurcharge() {
    return this.peakWeeks * this.prices.seasonalFeePerWeek;
  }

  get iauNote() {
    return this.quotePlan.courses.some((row) => row.optionId === 'college-immersion')
      ? 'IAU一次性注册费50美元另计（未计入上述合计）。'
      : '';
  }

  get quoteUsd() {
    return Math.max(
      0,
      rounded(
        this.registration +
          this.tuition +
          this.accommodation +
          this.seasonalSurcharge -
          this.promotionDiscountTotal,
      ),
    );
  }

  get paymentLines(): SchoolPaymentLine[] {
    const ranges = this.prices.peakSeasonRanges.filter(
      (range) =>
        range.enabled !== false &&
        this.quotePlan.overlapWeeks(
          range.start,
          range.end,
          [...this.quotePlan.courses, ...this.quotePlan.rooms],
        ) > 0,
    );

    return [
      ...(this.seasonalSurcharge
        ? [
            {
              icon: '旺',
              label: '旺季附加费',
              value: this.seasonalSurcharge,
              note: `${this.prices.seasonalFeePerWeek}美元／周 × ${this.peakWeeks}周；${ranges
                .map(
                  (range) =>
                    `${range.start.replace(/-/g, '/')}–${range.end.replace(/-/g, '/')}`,
                )
                .join('；')}；不参与折扣`,
            },
          ]
        : []),
      ...this.promotionResults.map((result) => ({
        icon: '惠',
        label: result.rule.name,
        value: -result.amount,
        note: result.rule.description,
        promotionKey: result.rule.id,
      })),
    ];
  }

  get localFees(): SchoolLocalFee[] {
    return this.prices.localFeeRules
      .filter((rule) => rule.enabled && rule.includeInTotal)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((rule) => this.calculateLocalFee(rule));
  }

  private isPromotionEligible(rule: CiaPromotionRule): boolean {
    if (rule.newStudentsOnly && this.returningStudent) return false;
    if (rule.registrationStart && this.selectedRegistrationDate < rule.registrationStart) {
      return false;
    }
    if (rule.registrationEnd && this.selectedRegistrationDate > rule.registrationEnd) {
      return false;
    }

    const firstCourseStart = [...this.quotePlan.courses]
      .map((row) => row.startDate)
      .sort()[0] ?? '';
    if (rule.arrivalStart && firstCourseStart < rule.arrivalStart) return false;
    if (rule.arrivalEnd && firstCourseStart > rule.arrivalEnd) return false;
    if (this.quotePlan.courseWeeks < rule.minimumCourseWeeks) return false;
    if (this.quotePlan.roomWeeks < rule.minimumAccommodationWeeks) return false;

    if (
      rule.coverageTarget !== 'none' &&
      rule.coverageStart &&
      rule.coverageEnd
    ) {
      const courseCovers = this.quotePlan.covers(
        rule.coverageStart,
        rule.coverageEnd,
        this.quotePlan.courses,
      );
      const accommodationCovers = this.quotePlan.covers(
        rule.coverageStart,
        rule.coverageEnd,
        this.quotePlan.rooms,
      );
      if (rule.coverageTarget === 'course' && !courseCovers) return false;
      if (
        rule.coverageTarget === 'course-and-accommodation' &&
        (!courseCovers || !accommodationCovers)
      ) return false;
    }

    return true;
  }

  private promotionAmount(rule: CiaPromotionRule): number {
    const base =
      rule.appliesTo === 'tuition'
        ? this.tuition
        : rule.appliesTo === 'accommodation'
          ? this.accommodation
          : this.tuition + this.accommodation;

    if (rule.discountType === 'percentage') {
      return rounded(base * (rule.discountValue / 100));
    }
    if (rule.discountType === 'fixed') {
      return rounded(rule.discountValue);
    }
    if (rule.discountType === 'per-course-week') {
      return rounded(rule.discountValue * this.quotePlan.courseWeeks);
    }
    return 0;
  }

  private calculateLocalFee(rule: CiaLocalFeeRule): SchoolLocalFee {
    const longTermWaiver = this.isLongTermVisa && rule.waiveForLongTermVisa;
    let quantity = 0;
    let total = 0;
    let unitLabel = `${quoteMoney(rule.amount)} 比索／次`;

    if (!longTermWaiver) {
      switch (rule.billingRule) {
        case 'once':
          quantity = 1;
          total = rule.amount;
          break;
        case 'per-accommodation-period': {
          const periodWeeks = Math.max(1, rule.periodWeeks ?? 4);
          const rawQuantity = this.quotePlan.roomWeeks / periodWeeks;
          quantity = rule.rounding === 'ceil' ? Math.ceil(rawQuantity) : rawQuantity;
          total = rule.amount * quantity;
          unitLabel = `${quoteMoney(rule.amount)} 比索／${periodWeeks}周`;
          break;
        }
        case 'per-course-period': {
          const periodWeeks = Math.max(1, rule.periodWeeks ?? 4);
          const rawQuantity = this.quotePlan.courseWeeks / periodWeeks;
          quantity = rule.rounding === 'ceil' ? Math.ceil(rawQuantity) : rawQuantity;
          total = rule.amount * quantity;
          unitLabel = `${quoteMoney(rule.amount)} 比索／套`;
          break;
        }
        case 'first-visa-extension':
          quantity = this.visaExtensionCount > 0 ? 1 : 0;
          total = rule.amount * quantity;
          break;
        case 'long-term-or-first-extension':
          quantity = this.isLongTermVisa || this.visaExtensionCount > 0 ? 1 : 0;
          total = rule.amount * quantity;
          break;
        case 'visa-extension-schedule':
          quantity = this.visaExtensionCount;
          total = this.visaRates.reduce((sum, value) => sum + value, 0);
          unitLabel = quantity > 1 ? '按续签次数累计' : `首续${quoteMoney(rule.amount)} 比索`;
          break;
      }
    }

    const note = longTermWaiver
      ? this.visaExemptionNote
      : rule.billingRule === 'visa-extension-schedule'
        ? `按${this.visaLabel}预估，${quantity ? `本次${quantity}次：${this.visaRates.map(quoteMoney).join('、')}比索` : '本次无需续签'}；${rule.note}`
        : rule.note;

    return {
      item: rule.name,
      unitLabel,
      quantity,
      total: rounded(total),
      note,
    };
  }
}
