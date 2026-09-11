import { QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { CiaLocalFeeRule } from '../cia-school/cia-content-config';
import {
  IMS_ADDITIONAL_CLASSES,
  IMS_COURSES,
  IMS_LONG_STAY_DISCOUNTS,
  IMS_OFF_SEASON_EXCLUDED_MONTHS,
  IMS_REGISTRATION_FEE,
  IMS_ROOMS,
  IMS_SIDA_RATE,
  IMS_WEEK_OPTIONS,
  ImsCourse,
  ImsRoom,
  ImsWeekOption,
} from './ims-pricing';

export type ImsEnrollmentStatus = 'new' | 'returning';
export type ImsTravelerRole = 'adult' | 'parent' | 'child';
export type ImsBlockPromotion = 'none' | 'two-plus-two' | 'low-season-300';
export type ImsOptionalService = 'none' | 'guardian' | 'school-management';

export interface ImsQuotePrices {
  courses: readonly ImsCourse[];
  rooms: readonly ImsRoom[];
  registrationFee: number;
  sidaRate: number;
  additionalClasses?: readonly { id: string; name: string; price4w: number }[];
  guardianServiceRate?: number;
  schoolManagementRate?: number;
  localFeeRules?: readonly CiaLocalFeeRule[];
  lowSeasonPerBlock?: number;
  longStayDiscounts?: readonly { min: number; max: number; amount: number }[];
}

export interface ImsPromotionBlock {
  key: string;
  rowId: number;
  index: number;
  startDate: string;
  endDate: string;
  promotion: ImsBlockPromotion;
  twoPlusTwoEligible: boolean;
  lowSeasonEligible: boolean;
  reason: string;
}

const DAY = 86_400_000;
const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const iso = (value: number) => new Date(value).toISOString().slice(0, 10);
const nextSunday = () => {
  const value = new Date();
  value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() + ((7 - value.getDay()) % 7));
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
};
const localToday = () => {
  const value = new Date();
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
};

/** IMS-only calculations. The component and quote image both consume this single result. */
export class ImsStudentQuote {
  constructor(private readonly catalog: ImsQuotePrices = {
    courses: IMS_COURSES,
    rooms: IMS_ROOMS,
    registrationFee: IMS_REGISTRATION_FEE,
    sidaRate: IMS_SIDA_RATE,
  }) {}

  name = '';
  age = 18;
  enrollmentStatus: ImsEnrollmentStatus = 'new';
  travelerRole: ImsTravelerRole = 'adult';
  selectedRegistrationDate = localToday();
  linkedStudentIndex = 0;
  transferParentOneToOne = false;
  attendParentGroupClass = true;
  includePickup = true;
  includeDropoff = false;
  includeWalkInLunch = false;
  optionalService: ImsOptionalService = 'none';
  readonly additionalClassQuantities: Record<string, number> = Object.fromEntries(IMS_ADDITIONAL_CLASSES.map((item) => [item.id, 0]));
  private readonly blockPromotionSelections = new Map<string, ImsBlockPromotion>();

  readonly quotePlan = new SchoolQuotePlan(
    'essential-esl-4',
    'quadruple',
    nextSunday(),
    IMS_WEEK_OPTIONS,
    (kind) => kind === 'course'
      ? this.catalog.courses.map((item) => ({ id: item.id, name: item.name, details: `${item.category}｜${item.schedule}`, group: item.category }))
      : this.catalog.rooms.map((item) => ({ id: item.id, name: item.name, details: item.note })),
    (kind, row) => kind === 'course' ? this.coursePrice(row) : this.roomPrice(row),
  );

  course(id: string) { return this.catalog.courses.find((item) => item.id === id); }
  room(id: string) { return this.catalog.rooms.find((item) => item.id === id); }

  coursePrice(row: QuotePlanRow): number {
    return this.course(row.optionId)?.prices[row.weeks as ImsWeekOption] ?? 0;
  }

  roomPrice(row: QuotePlanRow): number {
    return this.room(row.optionId)?.prices[row.weeks as ImsWeekOption] ?? 0;
  }

  get quoteError(): string {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (!Number.isInteger(this.age) || this.age < 3 || this.age > 100) return '请输入3–100岁的有效抵达年龄。';
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名日期。';
    for (const row of this.quotePlan.courses) {
      const selected = this.course(row.optionId);
      if (!selected || !selected.allowedWeeks.includes(row.weeks as ImsWeekOption)) {
        return `${selected?.name ?? '所选课程'}没有公布${row.weeks}周价格，不能生成报价。`;
      }
    }
    for (const block of this.promotionBlocks) {
      if (block.promotion === 'two-plus-two' && !block.twoPlusTwoEligible) return `2+2达人活动不适用于${block.startDate}开始的4周段：${block.reason}`;
      if (block.promotion === 'low-season-300' && !block.lowSeasonEligible) return `淡季立减300美元不适用于${block.startDate}开始的4周段：${block.reason}`;
    }
    if (this.promotionBlocks.filter((block) => block.promotion === 'two-plus-two').length > 1) {
      return '同一次连续学习最多只能选择一次2+2达人活动。';
    }
    if (this.optionalService !== 'none' && ![4, 8, 12, 16, 20, 24].includes(this.quotePlan.courseWeeks)) {
      return `${this.optionalService === 'guardian' ? 'Guardian Service' : '国际学生学校管理服务'}仅公布4、8、12、16、20、24周价格。`;
    }
    return '';
  }

  get tuition() { return this.quotePlan.total('course'); }
  get accommodation() { return this.quotePlan.total('room'); }
  get originalStudyStay() { return this.tuition + this.accommodation; }
  get registration() { return this.catalog.registrationFee; }
  get firstCourseStart(): string { return this.quotePlan.courses.map((row) => row.startDate).filter(Boolean).sort()[0] ?? ''; }

  promotionFor(rowId: number, index: number): ImsBlockPromotion {
    return this.blockPromotionSelections.get(`${rowId}:${index}`) ?? 'none';
  }

  setPromotion(rowId: number, index: number, promotion: ImsBlockPromotion): void {
    this.blockPromotionSelections.set(`${rowId}:${index}`, promotion);
  }

  get promotionBlocks(): ImsPromotionBlock[] {
    return this.quotePlan.courses.flatMap((row) => {
      const start = this.quotePlan.date(row.startDate);
      if (start === null) return [];
      return Array.from({ length: Math.floor(row.weeks / 4) }, (_, index) => {
        const blockStart = start + index * 28 * DAY;
        const blockEnd = blockStart + 27 * DAY;
        const months = Array.from({ length: 4 }, (__, week) => new Date(blockStart + week * 7 * DAY).getUTCMonth() + 1);
        const offSeason = months.every((month) => !(IMS_OFF_SEASON_EXCLUDED_MONTHS as readonly number[]).includes(month));
        const selectedCourse = this.course(row.optionId);
        const roomRow = this.roomRowCovering(blockStart, blockEnd);
        const twoWeekPricesAvailable = selectedCourse?.prices[2] !== undefined && !!roomRow && this.room(roomRow.optionId)?.prices[2] !== undefined;
        const twoPlusTwoEligible = offSeason && twoWeekPricesAvailable;
        const lowSeasonEligible = offSeason && this.quotePlan.courseWeeks >= 12;
        const reason = !offSeason
          ? '该4周段跨入1月、6月、7月或8月，属于活动排除月份。'
          : !twoWeekPricesAvailable
            ? '课程或对应住宿没有可用于2+2的明确2周价格。'
            : this.quotePlan.courseWeeks < 12
              ? '立减300美元要求总学习期至少12周；2+2资格本身不受此限制。'
              : '符合淡季月份与连续4周要求，可在2+2和立减300美元中二选一。';
        return {
          key: `${row.id}:${index}`,
          rowId: row.id,
          index,
          startDate: iso(blockStart),
          endDate: iso(blockEnd),
          promotion: this.promotionFor(row.id, index),
          twoPlusTwoEligible,
          lowSeasonEligible,
          reason,
        };
      });
    });
  }

  private roomRowCovering(start: number, end: number): QuotePlanRow | undefined {
    return this.quotePlan.rooms.find((row) => {
      const roomStart = this.quotePlan.date(row.startDate);
      const roomEnd = this.quotePlan.date(this.quotePlan.end(row));
      return roomStart !== null && roomEnd !== null && roomStart <= start && roomEnd >= end;
    });
  }

  private twoPlusTwoDiscount(block: ImsPromotionBlock): { course: number; room: number } {
    const courseRow = this.quotePlan.courses.find((row) => row.id === block.rowId)!;
    const selectedCourse = this.course(courseRow.optionId)!;
    const start = this.quotePlan.date(block.startDate)!;
    const end = this.quotePlan.date(block.endDate)!;
    const roomRow = this.roomRowCovering(start, end)!;
    const selectedRoom = this.room(roomRow.optionId)!;
    return {
      course: Math.max(0, (selectedCourse.prices[4] ?? 0) - (selectedCourse.prices[2] ?? 0)),
      room: Math.max(0, selectedRoom.prices[4] - selectedRoom.prices[2]),
    };
  }

  get twoPlusTwoDiscountAmount(): number {
    return this.promotionBlocks.filter((block) => block.promotion === 'two-plus-two' && block.twoPlusTwoEligible)
      .reduce((sum, block) => {
        const discount = this.twoPlusTwoDiscount(block);
        return sum + discount.course + discount.room;
      }, 0);
  }

  get lowSeasonDiscountAmount(): number {
    return this.promotionBlocks.filter((block) => block.promotion === 'low-season-300' && block.lowSeasonEligible).length * (this.catalog.lowSeasonPerBlock ?? 300);
  }

  get paidCourseWeeks(): number {
    return this.quotePlan.courseWeeks - this.promotionBlocks.filter((block) => block.promotion === 'two-plus-two' && block.twoPlusTwoEligible).length * 2;
  }

  get longStayDiscountAmount(): number {
    return (this.catalog.longStayDiscounts ?? IMS_LONG_STAY_DISCOUNTS).find((tier) => this.paidCourseWeeks >= tier.min && this.paidCourseWeeks <= tier.max)?.amount ?? 0;
  }

  get schoolDiscountAmount(): number {
    return Math.min(this.originalStudyStay, this.twoPlusTwoDiscountAmount + this.lowSeasonDiscountAmount + this.longStayDiscountAmount);
  }

  get studyStayAfterSchoolDiscount(): number { return Math.max(0, this.originalStudyStay - this.schoolDiscountAmount); }
  get sidaDiscountAmount(): number { return round(this.studyStayAfterSchoolDiscount * (1 - this.catalog.sidaRate)); }
  get additionalClassTotal(): number {
    const periods = Math.ceil(this.quotePlan.courseWeeks / 4);
    return (this.catalog.additionalClasses ?? IMS_ADDITIONAL_CLASSES).reduce((sum, item) => sum + item.price4w * Math.max(0, Math.floor(this.additionalClassQuantities[item.id] ?? 0)) * periods, 0);
  }
  get optionalServiceTotal(): number {
    const periods = this.quotePlan.courseWeeks / 4;
    return this.optionalService === 'guardian' ? (this.catalog.guardianServiceRate ?? 450) * periods : this.optionalService === 'school-management' ? (this.catalog.schoolManagementRate ?? 2100) * periods : 0;
  }
  get quoteUsd(): number {
    return round(this.registration + this.studyStayAfterSchoolDiscount - this.sidaDiscountAmount + this.additionalClassTotal + this.optionalServiceTotal);
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      ...(this.twoPlusTwoDiscountAmount ? [{
        icon: '2+2', label: 'IMS 2+2达人活动', value: -this.twoPlusTwoDiscountAmount,
        note: `按所选课程明确2周价与对应房型明确2周价计算；本次减少${this.twoPlusTwoDiscountAmount}美元，不减注册费。`, promotionKey: 'ims-two-plus-two',
      }] : []),
      ...(this.lowSeasonDiscountAmount ? [{
        icon: '淡', label: 'IMS淡季立减', value: -this.lowSeasonDiscountAmount,
        note: `总学习期不少于12周；${this.promotionBlocks.filter((block) => block.promotion === 'low-season-300' && block.lowSeasonEligible).length}个独立淡季4周段 × ${this.catalog.lowSeasonPerBlock ?? 300}美元，同段未与2+2叠加。`, promotionKey: 'ims-low-season-300',
      }] : []),
      ...(this.longStayDiscountAmount ? [{
        icon: '长', label: 'IMS长期优惠', value: -this.longStayDiscountAmount,
        note: `2+2折算后实际付费课程${this.paidCourseWeeks}周，按长期阶梯一次性从课程费减免。`, promotionKey: 'ims-long-stay',
      }] : []),
      { icon: '95', label: '思达95折', value: -this.sidaDiscountAmount, note: '先扣学校活动与固定减免，再对剩余课程费和住宿费按95折；注册费及比索费用不参加。', promotionKey: 'ims-sida-95' },
      ...(this.additionalClassTotal ? [{ icon: '加', label: '额外课程', value: this.additionalClassTotal, note: `按当地费用表美元价、每4周计费；共${Math.ceil(this.quotePlan.courseWeeks / 4)}个4周计费周期。` }] : []),
      ...(this.optionalServiceTotal ? [{ icon: '服', label: this.optionalService === 'guardian' ? 'Guardian Service' : '国际学生学校管理服务', value: this.optionalServiceTotal, note: '独立可选服务，不与免费晚间托管混为一项；是否需要由学校确认。' }] : []),
    ];
  }

  get stayWeeks(): number { return Math.max(this.quotePlan.courseWeeks, this.quotePlan.roomWeeks); }
  get visaExtensionFee(): number {
    const weeks = this.stayWeeks;
    if (weeks <= 4) return 0;
    const rule = this.catalog.localFeeRules?.find((item) => item.id === 'visa-extension' && item.enabled);
    const increments = rule?.rates?.length ? rule.rates : [5050, 6800, 4450, 4450, 4450];
    const stage = Math.min(increments.length, Math.ceil((weeks - 4) / 4));
    return increments.slice(0, stage).reduce((sum, amount) => sum + amount, 0);
  }

  get localFees(): SchoolLocalFee[] {
    const weeks = this.stayWeeks;
    const line = (item: string, unitLabel: string, quantity: number, total: number, note: string): SchoolLocalFee => ({ item, unitLabel, quantity, total, note });
    const fee = (id: string, fallback: number) => this.catalog.localFeeRules?.find((item) => item.id === id && item.enabled)?.amount ?? fallback;
    const ssp = fee('ssp', 8000), eCard = fee('e-card', 4000), books = fee('books', 3000), studentId = fee('student-id', 300);
    const deposit = fee('deposit', 3000), water = fee('water', 500), electricity = fee('electricity', 500), aircon = fee('aircon', 250);
    const acr = fee('acr-i-card', 4000), pickup = fee('pickup', 1000), dropoff = fee('dropoff', 1000), lunch = fee('walk-in-lunch', 6000);
    return [
      line('SSP特殊学习许可证', `${ssp.toLocaleString()}比索／次`, 1, ssp, '强制费用；按2026年7月1日起费用表估算。'),
      line('E-Card', `${eCard.toLocaleString()}比索／次`, 1, eCard, '强制费用；最终办理要求以学校及当期政策为准。'),
      line('教材费', `${books.toLocaleString()}比索／套`, 1, books, '费用表预估；教材因课程和级别不同，最终按实际购买确认。'),
      line('学生证', `${studentId.toLocaleString()}比索／次`, 1, studentId, '强制一次性费用。'),
      line('宿舍／钥匙押金（可退）', `${deposit.toLocaleString()}比索／人`, 1, deposit, '入住时支付；无损坏并归还钥匙后按学校规则退还。'),
      line('水费', `${water.toLocaleString()}比索／周`, weeks, water * weeks, '按住宿周数计算。'),
      line('基础电费', `${electricity.toLocaleString()}比索／周`, weeks, electricity * weeks, '按住宿周数计算。'),
      line('空调费', `${aircon.toLocaleString()}比索／周`, weeks, aircon * weeks, '包含100kW／4周；超额部分另按30比索／kW实收。'),
      ...(this.visaExtensionFee ? [line('签证延长累计费用', '按停留周数阶梯', 1, this.visaExtensionFee, '按费用表累计金额估算，不自行推定其他签证类型或法律结论。')] : []),
      ...(weeks >= 9 ? [line('ACR I-Card', `${acr.toLocaleString()}比索／次`, 1, acr, '从9周起按费用表计入一次。')] : []),
      ...(this.includePickup ? [line('宿务机场接机', `${pickup.toLocaleString()}比索／次`, 1, pickup, '费用表TOTAL AMOUNT包含一次接机；如自行前往可取消并重新计算。')] : []),
      ...(this.includeDropoff ? [line('宿务机场送机（可选）', `${dropoff.toLocaleString()}比索／次`, 1, dropoff, '可选服务，不在官方TOTAL AMOUNT内。')] : []),
      ...(this.includeWalkInLunch ? [line('走读午餐（可选）', `${lunch.toLocaleString()}比索／4周`, Math.ceil(weeks / 4), lunch * Math.ceil(weeks / 4), '仅走读学生选购；按每4周向上计费。')] : []),
    ];
  }

  get localFeeTotal(): number { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
}

/** Cross-person family validation stays outside each student so inactive group rows never affect the quote. */
export function validateImsFamily(students: readonly ImsStudentQuote[]): string {
  for (let index = 0; index < students.length; index++) {
    const student = students[index];
    if (student.travelerRole === 'parent' && student.quotePlan.courses.some((row) => row.optionId !== 'parents-esl')) {
      return `学生${index + 1}标记为家长，必须本人注册并购买Parents ESL。`;
    }
    if (!student.transferParentOneToOne) continue;
    if (student.travelerRole !== 'parent') return `学生${index + 1}只有在身份为家长时才能转送一对一课程。`;
    if (student.linkedStudentIndex < 0 || student.linkedStudentIndex >= students.length || student.linkedStudentIndex === index) {
      return `学生${index + 1}请选择同行的孩子作为转课对象。`;
    }
    const child = students[student.linkedStudentIndex];
    if (child.travelerRole !== 'child') return `学生${index + 1}的转课对象必须标记为孩子。`;
    if (child.quotePlan.courses.some((row) => row.optionId !== 'junior-esl-6')) {
      return `家长3节一对一只能转给Junior ESL 6学生；Junior ESL 8或9不能接收，请把学生${student.linkedStudentIndex + 1}改为Junior ESL 6。`;
    }
  }
  for (let childIndex = 0; childIndex < students.length; childIndex++) {
    const transferCount = students.filter((student) => student.transferParentOneToOne && student.linkedStudentIndex === childIndex).length;
    if (imsEffectiveDailyOneToOne(students, childIndex) > 9) return `学生${childIndex + 1}收到${transferCount}名家长转课后会超过每天9节一对一，最多只能接收一名家长的3节。`;
  }
  return '';
}

export function imsEffectiveDailyOneToOne(students: readonly ImsStudentQuote[], studentIndex: number): number {
  const student = students[studentIndex];
  if (!student) return 0;
  const baseByCourse: Record<string, number> = { 'junior-esl-6': 6, 'junior-esl-8': 8, 'junior-esl-9': 9 };
  const base = Math.max(0, ...student.quotePlan.courses.map((row) => baseByCourse[row.optionId] ?? 0));
  const transferred = students.filter((parent) => parent.transferParentOneToOne && parent.linkedStudentIndex === studentIndex).length * 3;
  return base + transferred;
}
