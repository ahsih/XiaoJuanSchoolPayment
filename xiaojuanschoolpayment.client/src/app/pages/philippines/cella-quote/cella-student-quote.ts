import {
  CELLA_CAMPUS_NAMES,
  CELLA_LOW_SEASON_END,
  CELLA_LOW_SEASON_START,
  CellaCampus,
  CellaCourse,
  CellaEnrollmentStatus,
  CellaPromotionMode,
  CellaRoom,
  cellaDurationPrice,
} from './cella-pricing';

const DAY_MS = 86_400_000;

export interface CellaQuoteCatalog {
  courses: CellaCourse[];
  rooms: CellaRoom[];
  registrationFee: number;
  peakSeasonWeeklyFee: number;
}

export interface CellaCalculatedLocalFee {
  item: string;
  unit: string;
  quantity: string;
  total: number;
  note: string;
}

export function cellaDefaultSunday(now = new Date()): string {
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysUntilSunday = (7 - local.getDay()) % 7;
  local.setDate(local.getDate() + daysUntilSunday);
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`;
}

/** One student's independent CELLA selection and all derived prices. */
export class CellaStudentQuote {
  campus: CellaCampus;
  courseId = '';
  roomId = '';
  weeks = 4;
  startDate = cellaDefaultSunday();
  enrollmentStatus: CellaEnrollmentStatus = 'new';
  promotionMode: CellaPromotionMode = 'standard';
  initialVisaDays: 30 | 59 = 59;
  minorManagementSelected = false;

  constructor(readonly catalog: CellaQuoteCatalog, campus: CellaCampus) {
    this.campus = campus;
    this.resetCampusSelections();
  }

  get campusName(): string { return CELLA_CAMPUS_NAMES[this.campus]; }
  get courseOptions(): CellaCourse[] { return this.catalog.courses.filter((item) => item.campus === this.campus); }
  get roomOptions(): CellaRoom[] { return this.catalog.rooms.filter((item) => item.campus === this.campus); }
  get selectedCourse(): CellaCourse | undefined { return this.courseOptions.find((item) => item.id === this.courseId); }
  get selectedRoom(): CellaRoom | undefined { return this.roomOptions.find((item) => item.id === this.roomId); }
  get isFamilyPackage(): boolean { return !!this.selectedCourse?.familyPackage; }
  get familyPackagePrice(): number {
    const familyPackage = this.selectedCourse?.familyPackage;
    if (!familyPackage || ![4, 6, 8].includes(this.actualWeeks)) return 0;
    return familyPackage.prices[this.actualWeeks as 4 | 6 | 8];
  }

  get actualWeeks(): number {
    if (this.promotionMode === 'social-6-plus-2') return 8;
    if (this.promotionMode === 'social-9-plus-3') return 12;
    return Number.isFinite(this.weeks) ? Math.trunc(this.weeks) : 0;
  }

  get paidWeeks(): number {
    if (this.promotionMode === 'social-6-plus-2') return 6;
    if (this.promotionMode === 'social-9-plus-3') return 9;
    return this.actualWeeks;
  }

  get giftWeeks(): number { return this.actualWeeks - this.paidWeeks; }
  get isSocialPromotion(): boolean { return !this.isFamilyPackage && this.promotionMode !== 'standard'; }

  get endDate(): string {
    const start = this.dateValue(this.startDate);
    if (start === null || this.actualWeeks <= 0) return '';
    return new Date(start + (this.actualWeeks * 7 - 1) * DAY_MS).toISOString().slice(0, 10);
  }

  get coursePriceBeforePromotions(): number {
    if (this.isFamilyPackage) return this.familyPackagePrice;
    return cellaDurationPrice(this.selectedCourse?.tuition ?? 0, this.actualWeeks);
  }

  get roomPriceBeforePromotions(): number {
    if (this.isFamilyPackage) return 0;
    return cellaDurationPrice(this.selectedRoom?.fee ?? 0, this.actualWeeks);
  }

  get socialPromotionDiscount(): number {
    if (!this.isSocialPromotion) return 0;
    const courseSavings = this.coursePriceBeforePromotions - cellaDurationPrice(this.selectedCourse?.tuition ?? 0, this.paidWeeks);
    const roomSavings = this.roomPriceBeforePromotions - cellaDurationPrice(this.selectedRoom?.fee ?? 0, this.paidWeeks);
    return this.roundMoney(courseSavings + roomSavings);
  }

  get lowSeasonBlocks(): number {
    if (this.isFamilyPackage || this.isSocialPromotion || !this.selectedRoom?.lowSeasonEligible) return 0;
    return this.countLowSeasonBlocks();
  }

  private countLowSeasonBlocks(): number {
    const start = this.dateValue(this.startDate);
    const campaignStart = this.dateValue(CELLA_LOW_SEASON_START);
    const campaignEnd = this.dateValue(CELLA_LOW_SEASON_END);
    if (start === null || campaignStart === null || campaignEnd === null) return 0;
    let eligibleWeeks = 0;
    for (let week = 0; week < this.actualWeeks; week++) {
      const weekStart = start + week * 7 * DAY_MS;
      const weekEnd = weekStart + 6 * DAY_MS;
      if (weekStart >= campaignStart && weekEnd <= campaignEnd) eligibleWeeks++;
    }
    return Math.floor(eligibleWeeks / 4);
  }

  get lowSeasonDiscount(): number { return this.lowSeasonBlocks * 100; }

  get premiumSixPersonDiscount(): number {
    if (this.isFamilyPackage || this.isSocialPromotion || !this.selectedRoom?.premiumSixPerson) return 0;
    return this.lowSeasonBlocksForAnyRoom * (this.selectedRoom.fee - 499);
  }

  get longStayDiscount(): number {
    if (this.isFamilyPackage || this.isSocialPromotion || !this.fullStayInsideLowSeason) return 0;
    if (this.actualWeeks >= 16) return 150;
    if (this.actualWeeks >= 12) return 100;
    if (this.actualWeeks >= 8) return 50;
    return 0;
  }

  get peakSeasonWeeks(): number {
    if (this.isFamilyPackage) return 0;
    return this.countOverlappingWeeks('2026-07-05', '2026-08-29')
      + this.countOverlappingWeeks('2027-07-04', '2027-08-28');
  }

  get peakSeasonSurcharge(): number { return this.peakSeasonWeeks * this.catalog.peakSeasonWeeklyFee; }
  get minorManagementFee(): number { return !this.isFamilyPackage && this.minorManagementSelected ? this.actualWeeks * 25 : 0; }

  get schoolTotal(): number {
    if (this.isFamilyPackage) return this.familyPackagePrice;
    return Math.max(0, this.roundMoney(
      this.catalog.registrationFee
      + this.coursePriceBeforePromotions
      + this.roomPriceBeforePromotions
      + this.peakSeasonSurcharge
      + this.minorManagementFee
      - this.socialPromotionDiscount
      - this.lowSeasonDiscount
      - this.premiumSixPersonDiscount
      - this.longStayDiscount,
    ));
  }

  get visaExtensionCount(): number {
    return Math.max(0, Math.ceil((this.actualWeeks * 7 - this.initialVisaDays) / 30));
  }

  get localFees(): CellaCalculatedLocalFee[] {
    if (this.isFamilyPackage) return [];
    const periods = Math.max(1, Math.ceil(this.actualWeeks / 4));
    const extensions = this.visaExtensionCount;
    const laterExtensionWarning = extensions > 1
      ? `本次预计需续签${extensions}次；附件只确认首次续签5,140比索，后续续签金额未计入合计，需向学校确认。`
      : extensions === 1
        ? '首次续签参考；最终以学校及移民局实收为准。'
        : `按${this.initialVisaDays}天旅游签证预估，本次无需续签。`;
    return [
      { item: 'SSP特殊学习许可证', unit: '7,800比索／次', quantity: '1', total: 7800, note: '移民局收取；按报名学习时长办理，续费及换校需要重新办理。' },
      { item: 'SSP电子卡', unit: '4,500比索／次', quantity: '1', total: 4500, note: '入学时与SSP同时办理，只收一次。' },
      { item: '外国人身份证', unit: '4,000比索／次', quantity: extensions > 0 ? '1' : '0', total: extensions > 0 ? 4000 : 0, note: '首次续签时办理；实际办理要求需向学校确认。' },
      { item: '管理费', unit: '4,000比索／4周', quantity: String(periods), total: 4000 * periods, note: '校内教学楼及其他设施的维护费用。' },
      { item: '电费', unit: '2,000比索／4周', quantity: String(periods), total: 2000 * periods, note: '每周含15度电，超出部分另收25比索／度；校外宿舍计费口径需确认。' },
      { item: '水费', unit: '1,200比索／4周', quantity: String(periods), total: 1200 * periods, note: '公共用水和房间用水；校外宿舍计费口径需确认。' },
      { item: '签证续签', unit: '首次5,140比索', quantity: extensions > 0 ? '1' : '0', total: extensions > 0 ? 5140 : 0, note: laterExtensionWarning },
      { item: '教材费', unit: '2,000比索／套', quantity: '1', total: 2000, note: '不同课程教材不同，学习完成后是否购买新教材按实际进度确定。' },
      { item: '学生证', unit: '200比索／张', quantity: '1', total: 200, note: '一次性费用。' },
    ];
  }

  get localFeeTotal(): number { return this.localFees.reduce((sum, item) => sum + item.total, 0); }

  get depositAmount(): number | null {
    if (this.isFamilyPackage) return null;
    if (this.actualWeeks < 4) return 2000;
    if (this.actualWeeks <= 8) return 5000;
    if (this.actualWeeks <= 12) return 8000;
    if (this.actualWeeks < 16) return null;
    return 10000;
  }

  get exchangeConfirmationNote(): string {
    if (this.selectedCourse?.needsConfirmation) return this.selectedCourse.note;
    return '';
  }

  get error(): string {
    if (!Number.isInteger(this.actualWeeks) || this.actualWeeks < 1 || this.actualWeeks > 24) return '学习周数请输入1–24周的整数。';
    const start = this.dateValue(this.startDate);
    if (start === null || new Date(start).getUTCDay() !== 0) return '入学和入住日期请选择周日。';
    if (!this.selectedCourse) return '请选择当前校区的有效课程。';
    if (this.isFamilyPackage && ![4, 6, 8].includes(this.actualWeeks)) return '家庭套餐仅有附件确认的4周、6周或8周整包价格。';
    if (this.isFamilyPackage && this.promotionMode !== 'standard') return '家庭套餐与其他优惠能否叠加未确认，请按附件整包价报价。';
    if (this.isFamilyPackage) return '';
    if (!this.selectedRoom) return '请选择当前校区的有效房型。';
    if (this.isSocialPromotion && this.enrollmentStatus !== 'new') return '6+2／9+3仅限首次报名新生，不适用于转校或延期学生。';
    if (this.isSocialPromotion && !this.selectedRoom.socialEligible) return '6+2／9+3仅适用于Uni或Premium校区四人间。';
    return '';
  }

  get fullStayInsideLowSeason(): boolean {
    return this.startDate >= CELLA_LOW_SEASON_START && !!this.endDate && this.endDate <= CELLA_LOW_SEASON_END;
  }

  setCampus(campus: CellaCampus): void {
    this.campus = campus;
    this.resetCampusSelections();
  }

  selectCourse(courseId: string): void {
    this.courseId = courseId;
    if (!this.isFamilyPackage) return;
    this.promotionMode = 'standard';
    this.minorManagementSelected = false;
    if (![4, 6, 8].includes(this.weeks)) this.weeks = 4;
  }

  selectPromotion(mode: CellaPromotionMode): void {
    if (this.isFamilyPackage) {
      this.promotionMode = 'standard';
      return;
    }
    this.promotionMode = mode;
    if (mode === 'social-6-plus-2') this.weeks = 8;
    if (mode === 'social-9-plus-3') this.weeks = 12;
    if (mode !== 'standard' && !this.selectedRoom?.socialEligible) {
      this.roomId = this.roomOptions.find((item) => item.socialEligible)?.id ?? this.roomId;
    }
  }

  private resetCampusSelections(): void {
    const courses = this.courseOptions;
    const rooms = this.roomOptions;
    if (!courses.some((item) => item.id === this.courseId)) this.courseId = courses[0]?.id ?? '';
    if (!rooms.some((item) => item.id === this.roomId)) {
      const preferredRoom = this.isSocialPromotion
        ? rooms.find((item) => item.socialEligible)
        : this.campus === 'premium'
          ? rooms.find((item) => item.premiumSixPerson)
          : rooms.find((item) => item.socialEligible);
      this.roomId = preferredRoom?.id ?? rooms[0]?.id ?? '';
    }
  }

  private get lowSeasonBlocksForAnyRoom(): number {
    return this.isSocialPromotion ? 0 : this.countLowSeasonBlocks();
  }

  private countOverlappingWeeks(from: string, to: string): number {
    const start = this.dateValue(this.startDate);
    const rangeStart = this.dateValue(from);
    const rangeEnd = this.dateValue(to);
    if (start === null || rangeStart === null || rangeEnd === null) return 0;
    let count = 0;
    for (let week = 0; week < this.actualWeeks; week++) {
      const weekStart = start + week * 7 * DAY_MS;
      const weekEnd = weekStart + 6 * DAY_MS;
      if (weekStart <= rangeEnd && weekEnd >= rangeStart) count++;
    }
    return count;
  }

  private dateValue(value: string): number | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const parsed = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value ? parsed : null;
  }

  private roundMoney(value: number): number { return Math.round(value * 100) / 100; }
}
