import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import {
  SchoolLocalFee,
  SchoolPaymentLine,
} from '../../../components/school-group-quote';

export interface BlueOceanCoursePrice {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  baseFourWeek: number;
  maxWeeks?: number;
  familyCourse?: boolean;
}

export interface BlueOceanRoomPrice {
  id: string;
  name: string;
  baseFourWeek: number;
  note: string;
  offCampus: boolean;
}

export interface BlueOceanLocalFeePrices {
  ssp: number;
  sspECard: number;
  acrICard: number;
  visaFirstCumulative: number;
  visaSecondCumulative: number;
  visaThirdCumulative: number;
  visaAdditional: number;
  accommodationDepositPerWeek: number;
  offCampusUtilitiesPerWeek: number;
  electiveMinimum: number;
  electiveMaximum: number;
  textbookMinimum: number;
  textbookMaximum: number;
  ieltsTextbook: number;
  laundryPerLoad: number;
  pickup: number;
  studentId: number;
  managementPerWeek: number;
}

export interface BlueOceanQuotePrices {
  courseOptions: BlueOceanCoursePrice[];
  dormOptions: BlueOceanRoomPrice[];
  registrationFee: number;
  sidaDiscountRate: number;
  offSeasonDiscountPerFourWeeks: number;
  twelveWeekMinimumWeeks: number;
  twelveWeekDiscount: number;
  longStayMinimumWeeks: number;
  longStayBaseDiscount: number;
  longStayIncrementWeeks: number;
  longStayIncrementDiscount: number;
  seasonalFeePerWeek: number;
  peakSeasonRanges: readonly { label: string; start: string; end: string }[];
  shortStayRatios: Record<string, number>;
  localFeePrices: BlueOceanLocalFeePrices;
}

export const BLUE_OCEAN_VISA_OPTIONS = [
  { value: 'tourist30', label: '30天旅游签证' },
  { value: 'tourist59', label: '59天旅游签证' },
] as const;

export type BlueOceanVisaType =
  (typeof BLUE_OCEAN_VISA_OPTIONS)[number]['value'];

const DAY = 86_400_000;
const rounded = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const localToday = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const nextSunday = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const blueOceanPriceMultiplier = (
  weeks: number,
  ratios: Record<string, number> = {
    '1': 0.4,
    '2': 0.65,
    '3': 0.85,
  },
): number => ratios[String(weeks)] ?? weeks / 4;

/**
 * Cebu Blue Ocean owns these calculations. The shared CIA-style components are
 * presentation only and do not contribute school prices or promotion rules.
 */
export class BlueOceanStudentQuote {
  constructor(private readonly prices: BlueOceanQuotePrices) {}

  selectedRegistrationDate = localToday();
  selectedAgeGroup: 'adult' | 'under15' = 'adult';
  readonly visaOptions = BLUE_OCEAN_VISA_OPTIONS;
  visaType: BlueOceanVisaType = 'tourist59';
  pickupRequested = false;
  readonly weekOptions = Array.from({ length: 24 }, (_, index) => index + 1);

  readonly quotePlan = new SchoolQuotePlan(
    'light-esl',
    'egi-triple-ocean',
    nextSunday(),
    this.weekOptions,
    (kind) =>
      kind === 'course'
        ? this.prices.courseOptions.map((course) => ({
            id: course.id,
            name: course.name,
            details: `${course.lessons}｜${course.suitable}`,
          }))
        : this.prices.dormOptions.map((room) => ({
            id: room.id,
            name: room.name,
            details: room.note,
          })),
    (kind, row) => {
      const fourWeekPrice =
        kind === 'course'
          ? this.prices.courseOptions.find(
              (course) => course.id === row.optionId,
            )?.baseFourWeek
          : this.prices.dormOptions.find(
              (room) => room.id === row.optionId,
            )?.baseFourWeek;

      return rounded(
        (fourWeekPrice ?? 0) *
          blueOceanPriceMultiplier(row.weeks, this.prices.shortStayRatios),
      );
    },
  );

  get quoteError(): string {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) {
      return '请选择有效的报名注册日期。';
    }
    if (!['adult', 'under15'].includes(this.selectedAgeGroup)) {
      return '请选择抵达时年龄段。';
    }
    if (!this.visaOptions.some((option) => option.value === this.visaType)) {
      return '请选择有效的入境签证。';
    }

    const overLimitCourse = this.quotePlan.courses.find((row) => {
      const course = this.prices.courseOptions.find(
        (candidate) => candidate.id === row.optionId,
      );
      return course?.maxWeeks !== undefined && row.weeks > course.maxWeeks;
    });
    if (overLimitCourse) {
      const course = this.prices.courseOptions.find(
        (candidate) => candidate.id === overLimitCourse.optionId,
      );
      return `${course?.name ?? '所选课程'}每段最多选择${course?.maxWeeks}周。`;
    }

    return '';
  }

  get visaLabel(): string {
    return (
      this.visaOptions.find((option) => option.value === this.visaType)?.label ??
      ''
    );
  }

  get tuition(): number {
    return this.quotePlan.total('course');
  }

  get accommodation(): number {
    return this.quotePlan.total('room');
  }

  get registration(): number {
    return this.prices.registrationFee;
  }

  get registrationDiscount(): number {
    return this.registration;
  }

  get sidaDiscount(): number {
    return rounded(
      (this.tuition + this.accommodation) *
        (1 - this.prices.sidaDiscountRate),
    );
  }

  private peakCourseWeekStarts(includeFamilyCourse: boolean): number[] {
    const eligibleRows = this.quotePlan.courses.filter((row) => {
      const course = this.prices.courseOptions.find(
        (candidate) => candidate.id === row.optionId,
      );
      return includeFamilyCourse || !course?.familyCourse;
    });

    return this.quotePlan.weekStarts(eligibleRows).filter((week) =>
      this.prices.peakSeasonRanges.some((range) => {
        const start = this.quotePlan.date(range.start);
        const end = this.quotePlan.date(range.end);
        return start !== null && end !== null && week <= end && week + 6 * DAY >= start;
      }),
    );
  }

  get peakWeeks(): number {
    return this.peakCourseWeekStarts(false).length;
  }

  get seasonalSurcharge(): number {
    return this.peakWeeks * this.prices.seasonalFeePerWeek;
  }

  get offSeasonBlocks(): number {
    // Family Course is exempt from the surcharge, but peak-season weeks still do
    // not earn the regular low-season discount.
    const peakWeekStarts = new Set(this.peakCourseWeekStarts(true));
    const eligibleWeeks = this.quotePlan
      .weekStarts(this.quotePlan.courses)
      .filter((week) => !peakWeekStarts.has(week));
    return Math.floor(eligibleWeeks.length / 4);
  }

  get offSeasonDiscount(): number {
    return this.offSeasonBlocks * this.prices.offSeasonDiscountPerFourWeeks;
  }

  get twelveWeekDiscount(): number {
    return this.quotePlan.courseWeeks >= this.prices.twelveWeekMinimumWeeks
      ? this.prices.twelveWeekDiscount
      : 0;
  }

  get longStayDiscount(): number {
    if (this.quotePlan.courseWeeks < this.prices.longStayMinimumWeeks) return 0;
    const increments = Math.floor(
      (this.quotePlan.courseWeeks - this.prices.longStayMinimumWeeks) /
        this.prices.longStayIncrementWeeks,
    );
    return (
      this.prices.longStayBaseDiscount +
      increments * this.prices.longStayIncrementDiscount
    );
  }

  get schoolPromotionDiscount(): number {
    return (
      this.offSeasonDiscount +
      this.twelveWeekDiscount +
      this.longStayDiscount
    );
  }

  get quoteUsd(): number {
    // The user selected the cheaper ordering: apply the 95% Sida rate first,
    // then deduct the school's fixed promotions.
    return Math.max(
      0,
      rounded(
        this.registration +
          this.tuition +
          this.accommodation +
          this.seasonalSurcharge -
          this.registrationDiscount -
          this.sidaDiscount -
          this.schoolPromotionDiscount,
      ),
    );
  }

  get paymentLines(): SchoolPaymentLine[] {
    const coveredRanges = this.prices.peakSeasonRanges.filter(
      (range) =>
        this.quotePlan.overlapWeeks(
          range.start,
          range.end,
          this.quotePlan.courses,
        ) > 0,
    );

    return [
      ...(this.seasonalSurcharge
        ? [
            {
              icon: '旺',
              label: '旺季附加费',
              value: this.seasonalSurcharge,
              note: `${this.prices.seasonalFeePerWeek}美元／重叠课程周 × ${this.peakWeeks}周；${coveredRanges
                .map(
                  (range) =>
                    `${range.start.replace(/-/g, '/')}–${range.end.replace(/-/g, '/')}`,
                )
                .join('；')}；Family Course除外`,
            },
          ]
        : []),
      {
        icon: '免',
        label: '思达启航免注册费',
        value: -this.registrationDiscount,
        note: '所有通过思达启航报名的学生均免收100美元注册费，不限学习周数。',
        promotionKey: 'registration-waiver',
      },
      ...(this.sidaDiscount
        ? [
            {
              icon: '折',
              label: '思达启航95折',
              value: -this.sidaDiscount,
              note: '课程费与住宿费先按95折计算，再扣除学校固定优惠。',
              promotionKey: 'sida-95',
            },
          ]
        : []),
      ...(this.offSeasonDiscount
        ? [
            {
              icon: '惠',
              label: '常规淡季优惠',
              value: -this.offSeasonDiscount,
              note: `每满4个非旺季课程周减150美元；本次符合${this.offSeasonBlocks}个完整周期。`,
              promotionKey: `off-season-${this.offSeasonBlocks}`,
            },
          ]
        : []),
      ...(this.twelveWeekDiscount
        ? [
            {
              icon: '惠',
              label: '12周额外优惠',
              value: -this.twelveWeekDiscount,
              note: '课程累计满12周额外减100美元一次；旺季期间仍可使用。',
              promotionKey: 'twelve-week',
            },
          ]
        : []),
      ...(this.longStayDiscount
        ? [
            {
              icon: '长',
              label: '长期优惠',
              value: -this.longStayDiscount,
              note: `16周减100美元，之后每增加2周多减25美元；本次课程累计${this.quotePlan.courseWeeks}周。`,
              promotionKey: `long-stay-${this.longStayDiscount}`,
            },
          ]
        : []),
    ];
  }

  get visaExtensionCount(): number {
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(
      0,
      Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30),
    );
  }

  get visaExtensionTotal(): number {
    const count = this.visaExtensionCount;
    const fees = this.prices.localFeePrices;
    if (count <= 0) return 0;
    if (count === 1) return fees.visaFirstCumulative;
    if (count === 2) return fees.visaSecondCumulative;
    if (count === 3) return fees.visaThirdCumulative;
    return (
      fees.visaThirdCumulative + (count - 3) * fees.visaAdditional
    );
  }

  get localFees(): SchoolLocalFee[] {
    const fees = this.prices.localFeePrices;
    const stayWeeks = this.quotePlan.stayWeeks;
    return [
      {
        item: 'SSP特殊学习许可证',
        unitLabel: `${fees.ssp.toLocaleString('en-US')}比索／次`,
        quantity: 1,
        total: fees.ssp,
        note: '与本次学习时间对应；续费需要重新办理。',
      },
      {
        item: 'SSP-E CARD',
        unitLabel: `${fees.sspECard.toLocaleString('en-US')}比索／次`,
        quantity: 1,
        total: fees.sspECard,
        note: '1年有效期。',
      },
      {
        item: 'ACR-I CARD',
        unitLabel: `${fees.acrICard.toLocaleString('en-US')}比索／次`,
        quantity: 1,
        total: fees.acrICard,
        note: '1年有效期。',
      },
      {
        item: '签证续签费用',
        unitLabel: '按累计续签档位',
        quantity: this.visaExtensionCount,
        total: this.visaExtensionTotal,
        note: `${this.visaLabel}；每次续签增加30天；${
          this.visaExtensionCount
            ? `本次预计续签${this.visaExtensionCount}次，金额按累计费用计算`
            : '本次预计无需续签'
        }。第4次起每增加一次暂加5,140比索。`,
      },
      {
        item: '学生证',
        unitLabel: `${fees.studentId.toLocaleString('en-US')}比索／次`,
        quantity: 1,
        total: fees.studentId,
        note: '每名学生一次。',
      },
      {
        item: '管理费',
        unitLabel: `${fees.managementPerWeek.toLocaleString('en-US')}比索／周`,
        quantity: stayWeeks,
        total: fees.managementPerWeek * stayWeeks,
        note: `按本次完整停留跨度${stayWeeks}周预估。`,
      },
    ];
  }

  get accommodationWeeks(): number {
    return this.quotePlan.roomWeeks;
  }

  get offCampusAccommodationWeeks(): number {
    return this.quotePlan.rooms.reduce((sum, row) => {
      const room = this.prices.dormOptions.find(
        (candidate) => candidate.id === row.optionId,
      );
      return sum + (room?.offCampus ? row.weeks : 0);
    }, 0);
  }

  get hasCampusAccommodation(): boolean {
    return this.quotePlan.rooms.some((row) => {
      const room = this.prices.dormOptions.find(
        (candidate) => candidate.id === row.optionId,
      );
      return room && !room.offCampus;
    });
  }

  get usesIeltsCourse(): boolean {
    return this.quotePlan.courses.some((row) => row.optionId === 'ielts');
  }

  get shortStayNotes(): string[] {
    return this.quotePlan.shortStayNotes((weeks) =>
      blueOceanPriceMultiplier(weeks, this.prices.shortStayRatios),
    );
  }
}
