import { QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import {
  BTES_ALL_IN_ONE_END,
  BTES_ALL_IN_ONE_START,
  BTES_COURSES,
  BTES_LOW_SEASON_PERIODS,
  BTES_REGISTRATION_FEE,
  BTES_ROOMS,
  BTES_SHORT_STAY_MULTIPLIERS,
  BTES_SIDA_DISCOUNT_RATE,
  BTES_WEEK_OPTIONS,
  BtesCourse,
  BtesRoom,
} from './btes-pricing';

export type BtesEnrollmentStatus = 'new' | 'returning';
export type BtesVisaType = 'tourist30' | 'tourist59';
export type BtesPickupType = 'none' | 'weekend' | 'weekday';

export const BTES_VISA_OPTIONS = [
  { value: 'tourist59', label: '59天旅游签证' },
  { value: 'tourist30', label: '30天旅游签证' },
] as const;

export interface BtesQuotePrices {
  courses?: readonly BtesCourse[];
  rooms?: readonly BtesRoom[];
  registrationFee?: number;
  sidaDiscountRate?: number;
  groupDiscountRate?: (student: BtesStudentQuote) => number;
}

const DAY = 86_400_000;
const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const localToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const nextSunday = () => {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/** BTES-only 2026 pricing, discount, visa and local-fee rules. */
export class BtesStudentQuote {
  private readonly courses: readonly BtesCourse[];
  private readonly rooms: readonly BtesRoom[];
  private readonly registrationFee: number;
  private readonly sidaDiscountRate: number;
  readonly quotePlan: SchoolQuotePlan;

  constructor(private readonly prices: BtesQuotePrices = {}) {
    this.courses = prices.courses ?? BTES_COURSES;
    this.rooms = prices.rooms ?? BTES_ROOMS;
    this.registrationFee = prices.registrationFee ?? BTES_REGISTRATION_FEE;
    this.sidaDiscountRate = prices.sidaDiscountRate ?? BTES_SIDA_DISCOUNT_RATE;
    this.quotePlan = new SchoolQuotePlan(
      'speak-up',
      'quad',
      nextSunday(),
      this.weekOptions,
      (kind) => kind === 'course'
        ? this.courses.map((course) => ({
            id: course.id,
            name: `${course.name}｜${course.chineseName}`,
            details: `${course.lessons}${course.minimumScore ? `｜${course.minimumScore}` : ''}`,
            group: course.category,
          }))
        : this.rooms.map((room) => ({ id: room.id, name: room.name, details: room.note })),
      (kind, row) => kind === 'course' ? this.coursePrice(row) : this.roomPrice(row),
    );
  }

  selectedRegistrationDate = localToday();
  age = 18;
  enrollmentStatus: BtesEnrollmentStatus = 'new';
  visaType: BtesVisaType = 'tourist59';
  pickupType: BtesPickupType = 'none';
  guardianAccompanied = true;
  readonly visaOptions = BTES_VISA_OPTIONS;
  readonly weekOptions = BTES_WEEK_OPTIONS;

  get quoteError(): string {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (!Number.isInteger(this.age) || this.age < 5 || this.age > 99) return '年龄请输入5至99岁的整数。';
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日期。';
    if (!['new', 'returning'].includes(this.enrollmentStatus)) return '请选择新生或老学员。';
    if (!this.visaOptions.some((option) => option.value === this.visaType)) return '请选择有效的入境签证。';
    if (!['none', 'weekend', 'weekday'].includes(this.pickupType)) return '请选择有效的接机安排。';
    if (this.age < 8 && !this.guardianAccompanied) return '5至7岁学生须由家长或监护人同行。';

    if (!this.hasPairedPeriods) {
      return 'BTES课程与住宿（或走读）须逐段使用相同周数和日期，请补齐对应安排。';
    }

    for (const row of this.quotePlan.courses) {
      const course = this.course(row.optionId);
      if (!course) return '请选择有效的BTES课程。';
      if (course.minWeeks && row.weeks < course.minWeeks) return `${course.name}须至少报名${course.minWeeks}周。`;
      if (course.maxWeeks && row.weeks > course.maxWeeks) return `${course.name}最多报名${course.maxWeeks}周。`;
      if (course.ageMin !== undefined && this.age < course.ageMin) return `${course.name}适用年龄从${course.ageMin}岁起。`;
      if (course.ageMax !== undefined && this.age > course.ageMax) return `${course.name}仅适用于${course.ageMin}-${course.ageMax}岁。`;

      const room = this.pairedRoom(row);
      if (course.id === 'junior-5-9' && room?.id === 'single') return 'Junior (5-9Y)官方价格表不提供校内单人房组合。';
      if (course.id === 'parents' && room?.id === 'single') return 'Parents / Guardian官方价格表不提供校内单人房组合。';
      if (course.allInOne) {
        if (this.quotePlan.courses.length !== 1 || this.quotePlan.rooms.length !== 1) return 'ALL IN ONE套餐不能与其他课程或住宿段混用。';
        if (row.weeks !== 4 || room?.id !== 'quad') return 'ALL IN ONE套餐固定4周并须选择四人房。';
        if (row.startDate < BTES_ALL_IN_ONE_START || this.quotePlan.end(row) > BTES_ALL_IN_ONE_END) {
          return 'ALL IN ONE套餐须完整就学于2026/08/23至2027/01/16。';
        }
      }
    }

    if (this.quotePlan.courses.some((row) => !this.course(row.optionId)?.allInOne) && this.quotePlan.courses.some((row) => this.course(row.optionId)?.allInOne)) {
      return 'ALL IN ONE套餐不能与普通课程混合报价。';
    }

    return '';
  }

  get firstCourseStart(): string {
    return this.quotePlan.courses.map((row) => row.startDate).filter((value) => this.quotePlan.date(value) !== null).sort()[0] ?? '';
  }

  get lastCourseEnd(): string {
    return this.quotePlan.courses.map((row) => this.quotePlan.end(row)).filter(Boolean).sort().at(-1) ?? '';
  }

  get isAllInOne(): boolean {
    return this.quotePlan.courses.length === 1 && this.course(this.quotePlan.courses[0].optionId)?.allInOne === true;
  }

  get isWalkInOnly(): boolean {
    return this.quotePlan.rooms.every((row) => this.room(row.optionId)?.walkIn);
  }

  get tuition() { return this.quotePlan.total('course'); }
  get accommodation() { return this.quotePlan.total('room'); }
  get registration() { return this.registrationFee; }

  get registrationDiscount(): number {
    return this.enrollmentStatus === 'returning' || this.isAllInOne ? this.registrationFee : 0;
  }

  get minorCareFee(): number {
    if (this.age < 8 || this.age > 17 || this.guardianAccompanied) return 0;
    return Math.ceil(this.quotePlan.courseWeeks / 4) * 100;
  }

  get promotionPeriod() {
    return BTES_LOW_SEASON_PERIODS.find((period) => this.firstCourseStart >= period.start && this.lastCourseEnd <= period.end);
  }

  get groupDiscountRate(): number {
    if (this.isAllInOne || !this.promotionPeriod) return 0;
    return this.prices.groupDiscountRate?.(this) ?? 0;
  }

  get individualDiscountRate(): number {
    if (this.isAllInOne || !this.promotionPeriod || this.groupDiscountRate) return 0;
    if (this.quotePlan.courseWeeks === 3) return 0.25;
    return this.quotePlan.courseWeeks >= 4 ? 0.3 : 0;
  }

  get btesDiscountRate(): number {
    return this.groupDiscountRate || this.individualDiscountRate;
  }

  get btesDiscount(): number {
    return rounded((this.tuition + this.accommodation) * this.btesDiscountRate);
  }

  get sidaDiscount(): number {
    if (this.isAllInOne) return 0;
    return rounded(Math.max(0, this.tuition + this.accommodation - this.btesDiscount) * (1 - this.sidaDiscountRate));
  }

  get quoteUsd(): number {
    return Math.max(0, rounded(
      this.registration + this.tuition + this.accommodation + this.minorCareFee
      - this.registrationDiscount - this.btesDiscount - this.sidaDiscount,
    ));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const lines: SchoolPaymentLine[] = [];
    if (this.minorCareFee) {
      lines.push({
        icon: '未', label: '未成年管理费', value: this.minorCareFee,
        note: `8-17岁且无家长同行，100美元／每开始4课程周；本次${Math.ceil(this.quotePlan.courseWeeks / 4)}段。`,
      });
    }
    if (this.registrationDiscount) {
      lines.push({
        icon: '免',
        label: this.isAllInOne ? 'ALL IN ONE已含注册费' : '老学员免注册费',
        value: -this.registrationDiscount,
        note: this.isAllInOne ? '100美元注册费已包含在四周全包套餐内，不重复收取。' : '老学员免收一次性100美元注册费。',
        promotionKey: 'registration',
      });
    }
    if (this.btesDiscount) {
      lines.push({
        icon: this.groupDiscountRate ? '团' : '淡',
        label: this.groupDiscountRate ? 'BTES淡季三人团体6折' : `BTES淡季${this.individualDiscountRate === 0.25 ? '三周75折' : '四周以上7折'}`,
        value: -this.btesDiscount,
        note: this.promotionNote,
        promotionKey: this.groupDiscountRate ? 'btes-group-low-season' : 'btes-individual-low-season',
      });
    }
    if (this.sidaDiscount) {
      lines.push({
        icon: '折', label: '思达启航95折', value: -this.sidaDiscount,
        note: '普通方案的课程费与住宿费按95折计算；如同时符合BTES活动，先扣除BTES优惠，再对优惠后金额计算95折。注册费、未成年管理费及当地费用不参与。',
        promotionKey: 'sida',
      });
    }
    return lines;
  }

  get applicablePaymentLines(): SchoolPaymentLine[] { return this.paymentLines; }

  get promotionNote(): string {
    if (!this.promotionPeriod) return '当前课程未完整落在BTES公布的淡季就学期间。';
    const period = `${this.promotionPeriod.start.replace(/-/g, '/')}–${this.promotionPeriod.end.replace(/-/g, '/')}`;
    if (this.groupDiscountRate) return `${period}内完整就学；3人或以上同时报名、同时入学及结业，课程费与住宿费先减40%（付6折），优惠后再计算思达95折。`;
    if (this.individualDiscountRate === 0.25) return `${period}内完整就学；个人3周课程与住宿先减25%（付75折），优惠后再计算思达95折。`;
    if (this.individualDiscountRate === 0.3) return `${period}内完整就学；个人4周及以上课程与住宿先减30%（付7折），优惠后再计算思达95折。`;
    return `${period}为淡季活动期；当前周数不符合3周或4周以上优惠，普通课程与住宿仍计算思达95折。`;
  }

  get visaLabel() { return this.visaOptions.find((option) => option.value === this.visaType)?.label ?? ''; }

  get visaExtensionCount(): number {
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }

  get visaExtensionFee(): number {
    const fees = [5130, 6400];
    let total = 0;
    for (let index = 0; index < this.visaExtensionCount; index += 1) total += fees[index] ?? 4430;
    return total;
  }

  get localFees(): SchoolLocalFee[] {
    const stayDays = this.quotePlan.stayWeeks * 7;
    const sspCount = stayDays > 183 ? 2 : 1;
    const acrCount = stayDays > 59 ? 1 : 0;
    const eccCount = stayDays > 183 ? 1 : 0;
    const campusRooms = this.quotePlan.rooms.filter((row) => !this.room(row.optionId)?.walkIn);
    const accommodationWeeks = campusRooms.reduce((sum, row) => sum + row.weeks, 0);
    const water = accommodationWeeks * 300;
    const maintenance = accommodationWeeks * 500;
    const electricity = campusRooms.reduce((sum, row) => sum + (this.room(row.optionId)?.electricityPerWeek ?? 0) * row.weeks, 0);
    const books = this.quotePlan.courseWeeks <= 1 ? 1000 : this.quotePlan.courseWeeks === 2 ? 1400 : this.quotePlan.courseWeeks === 3 ? 1700 : 2000;
    const pickup = this.pickupType === 'weekend' ? 1200 : this.pickupType === 'weekday' ? 1500 : 0;
    const included = (value: number, allInOneIncluded: boolean) => this.isAllInOne && allInOneIncluded ? 0 : value;
    const includedNote = (note: string, allInOneIncluded: boolean) => this.isAllInOne && allInOneIncluded
      ? `ALL IN ONE四周套餐已包含，本行不重复计费。${note}`
      : note;

    return [
      {
        item: 'SSP特殊学习许可证', unitLabel: '7,800 比索／6个月', quantity: sspCount,
        total: included(7800 * sspCount, true),
        note: includedNote('更换学校通常需要重新办理；超过6个月按学校要求再次办理。', true),
      },
      {
        item: 'SSP E-Card', unitLabel: '4,500 比索／次', quantity: 1,
        total: included(4500, true), note: includedNote('按2026正式价目表列示。', true),
      },
      {
        item: 'ACR I-Card外国人身份证', unitLabel: '4,000 比索／次', quantity: acrCount,
        total: acrCount * 4000, note: `完整停留超过59天时预估办理；当前${acrCount ? '计入' : '无需计入'}。`,
      },
      {
        item: '签证延期', unitLabel: '首延5,130；二延6,400；其后4,430 比索／次', quantity: this.visaExtensionCount,
        total: this.visaExtensionFee,
        note: `按${this.visaLabel}和完整停留${this.quotePlan.stayWeeks}周预估；实际费用与办理次数以学校及移民局为准。`,
      },
      {
        item: '学生证', unitLabel: '300 比索／次', quantity: 1,
        total: included(300, true), note: includedNote('一次性费用；遗失补办另收300比索。', true),
      },
      {
        item: '教材费', unitLabel: this.quotePlan.courseWeeks >= 5 ? '前4周2,000比索；后续教材实付' : `${books.toLocaleString('en-US')} 比索／本次`, quantity: 1,
        total: included(books, true),
        note: includedNote(this.quotePlan.courseWeeks >= 5 ? '5周起可按需要购买教材，每本约250-500比索；本页先计入前4周2,000比索。' : '官方表：1/2/3/4周分别为1,000/1,400/1,700/2,000比索。', true),
      },
      {
        item: '水费', unitLabel: '300 比索／住宿周', quantity: accommodationWeeks,
        total: included(water, true), note: includedNote('仅校内住宿期间收取；走读不收。', true),
      },
      {
        item: '宿舍管理费', unitLabel: '500 比索／住宿周', quantity: accommodationWeeks,
        total: included(maintenance, true), note: includedNote('仅校内住宿期间收取；走读不收。', true),
      },
      {
        item: '宿舍电费', unitLabel: '按房型／住宿周', quantity: accommodationWeeks,
        total: electricity,
        note: '单人/双人/三人/四人房每周分别500/400/300/200比索；每周超过20kW的部分另收25比索/kW。ALL IN ONE海报未列明包含电费，本页仍计入。',
      },
      {
        item: '宿务机场接机', unitLabel: this.pickupType === 'weekday' ? '1,500 比索／次' : '1,200 比索／周末次', quantity: pickup ? 1 : 0,
        total: pickup, note: this.pickupType === 'none' ? '当前未选择；周末1,200比索，工作日1,500比索／人／次。' : `${this.pickupType === 'weekday' ? '工作日' : '周末'}接机；送机1,500比索另计。`,
      },
      {
        item: 'ECC费用', unitLabel: '700 比索／次', quantity: eccCount,
        total: eccCount * 700, note: '超过6个月时按官方表预留；24周以内通常不触发，实际以移民局要求为准。',
      },
    ];
  }

  get priceYearWarning(): string {
    return this.lastCourseEnd > BTES_ALL_IN_ONE_END
      ? '本页采用BTES 2026正式价目表；2027/01/16以后方案仅作暂估，须以学校后续价格确认。'
      : '';
  }

  get pickupLabel(): string {
    if (this.pickupType === 'weekend') return '宿务机场周末接机';
    if (this.pickupType === 'weekday') return '宿务机场工作日接机';
    return '不需要学校接机';
  }

  course(id: string) { return this.courses.find((course) => course.id === id); }
  room(id: string) { return this.rooms.find((room) => room.id === id); }

  pairedRoom(row: QuotePlanRow): BtesRoom | undefined {
    const roomRow = this.quotePlan.rooms.find((room) => room.startDate === row.startDate && room.weeks === row.weeks);
    return roomRow ? this.room(roomRow.optionId) : undefined;
  }

  private get hasPairedPeriods(): boolean {
    if (this.quotePlan.courses.length !== this.quotePlan.rooms.length) return false;
    const coursePeriods = this.quotePlan.courses.map((row) => `${row.startDate}|${row.weeks}`).sort();
    const roomPeriods = this.quotePlan.rooms.map((row) => `${row.startDate}|${row.weeks}`).sort();
    return coursePeriods.every((period, index) => period === roomPeriods[index]);
  }

  private durationMultiplier(weeks: number): number {
    return BTES_SHORT_STAY_MULTIPLIERS[weeks] ?? weeks / 4;
  }

  private coursePrice(row: QuotePlanRow): number {
    const course = this.course(row.optionId);
    if (!course) return 0;
    if (course.allInOne) return row.weeks === 4 ? 1000 : 0;
    const room = this.pairedRoom(row);
    if (room?.walkIn) return rounded(course.walkInFee1w * row.weeks);
    const value = course.fee4w * this.durationMultiplier(row.weeks);
    return row.weeks < 4 ? Math.round(value) : rounded(value);
  }

  private roomPrice(row: QuotePlanRow): number {
    const room = this.room(row.optionId);
    if (!room || room.walkIn) return 0;
    const courseRow = this.quotePlan.courses.find((course) => course.startDate === row.startDate && course.weeks === row.weeks);
    if (courseRow && this.course(courseRow.optionId)?.allInOne) return 0;
    const value = room.fee4w * this.durationMultiplier(row.weeks);
    return row.weeks < 4 ? Math.round(value) : rounded(value);
  }
}
