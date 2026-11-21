import { textbookGroups, textbookPeriods } from '../school-textbook-estimate';
import {
  CELLA_2027_PROMOTION,
  CELLA_CAMPUS_NAMES,
  CELLA_FAMILY_PACKAGE_WEEKS,
  CELLA_FAMILY_ROOM,
  CELLA_LOCAL_FEES_2027,
  CELLA_LOW_SEASON_END,
  CELLA_LOW_SEASON_START,
  CELLA_FAMILY_REGISTRATION_FEE,
  CELLA_SIDA_RATE,
  CellaCampus,
  CellaCourse,
  CellaEnrollmentStatus,
  CellaPromotionMode,
  CellaRoom,
  cellaDurationPrice,
  cellaExtensionStages,
} from './cella-pricing';
import { SchoolQuotePlan, QuotePlanRow } from '../../../components/school-quote-plan';

import type { CiaLocalFeeRule } from '../cia-school/cia-content-config';
import { associationPeakBreakdownText, calculateAssociationPeakSurcharge } from '../association-peak-surcharge';

const DAY_MS = 86_400_000;

export interface CellaQuoteCatalog {
  localFeeRules?: CiaLocalFeeRule[];
  courses: CellaCourse[];
  rooms: CellaRoom[];
  registrationFee: number;
  peakSeasonWeeklyFee: number;
  peakSeasonRanges?: ReadonlyArray<{ start: string; end: string; enabled?: boolean }>;
  /** Share of course and room the student pays after the 思达启航 discount; default CELLA_SIDA_RATE (0.9). */
  sidaRate?: number;
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
  readonly quotePlan: SchoolQuotePlan;
  get courseId() { return this.quotePlan.courses[0].optionId; }
  set courseId(value: string) { this.quotePlan.courses[0].optionId = value; }
  get roomId() { return this.quotePlan.rooms[0].optionId; }
  set roomId(value: string) { this.quotePlan.rooms[0].optionId = value; }
  get weeks() { return this.quotePlan.courseWeeks; }
  set weeks(value: number) { this.quotePlan.updateWeeks('course', this.quotePlan.courses[0].id, value - this.weeks + this.quotePlan.courses[0].weeks); }
  get startDate() { return this.quotePlan.courses[0].startDate; }
  set startDate(value: string) { this.quotePlan.updateStartDate('course', this.quotePlan.courses[0].id, value); }
  enrollmentStatus: CellaEnrollmentStatus = 'new';
  promotionMode: CellaPromotionMode = 'standard';
  initialVisaDays: 30 | 59 = 59;
  minorManagementSelected = false;

  constructor(readonly catalog: CellaQuoteCatalog, campus: CellaCampus) {
    this.campus = campus;
    this.quotePlan = new SchoolQuotePlan('', '', cellaDefaultSunday(), Array.from({ length: 24 }, (_, i) => i + 1),
      kind => kind === 'course'
        ? this.courseOptions.map(course => ({ id: course.id, name: course.name, details: course.lessons }))
        : this.roomOptions.map(room => ({ id: room.id, name: room.name, details: room.note })),
      (kind, row) => cellaDurationPrice(kind === 'course'
        ? this.courseOptions.find(course => course.id === row.optionId)?.tuition ?? 0
        : this.roomOptions.find(room => room.id === row.optionId)?.fee ?? 0, row.weeks));
    this.resetCampusSelections();
  }

  get campusName(): string { return CELLA_CAMPUS_NAMES[this.campus]; }
  get courseOptions(): CellaCourse[] { return this.catalog.courses.filter((item) => item.campus === this.campus); }
  /** A family package includes its family room, so the room list then holds only that choice. */
  get roomOptions(): CellaRoom[] {
    return this.isFamilyPackage ? [CELLA_FAMILY_ROOM] : this.catalog.rooms.filter((item) => item.campus === this.campus);
  }
  get selectedCourse(): CellaCourse | undefined { return this.courseOptions.find((item) => item.id === this.courseId); }
  get selectedRoom(): CellaRoom | undefined { return this.roomOptions.find((item) => item.id === this.roomId); }
  get isFamilyPackage(): boolean { return !!this.selectedCourse?.familyPackage; }
  /** Whole-family total: 1–3 weeks are 40/65/85% of the four-week package, exactly as the 2027 table lists them. */
  get familyPackagePrice(): number {
    if (!this.isFamilyPackage || !CELLA_FAMILY_PACKAGE_WEEKS.includes(this.actualWeeks)) return 0;
    return this.roundMoney(this.quotePlan.total('course'));
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
    return this.quotePlan.total('course');
  }

  get roomPriceBeforePromotions(): number {
    if (this.isFamilyPackage) return 0;
    return this.quotePlan.total('room');
  }

  get socialPromotionDiscount(): number {
    if (!this.isSocialPromotion) return 0;
    const courseSavings = this.coursePriceBeforePromotions - cellaDurationPrice(this.selectedCourse?.tuition ?? 0, this.paidWeeks);
    const roomSavings = this.roomPriceBeforePromotions - cellaDurationPrice(this.selectedRoom?.fee ?? 0, this.paidWeeks);
    return this.roundMoney(courseSavings + roomSavings);
  }

  get lowSeasonBlocks(): number {
    if (this.isFamilyPackage || this.isSocialPromotion) return 0;
    return this.quotePlan.mergedRows('room').filter(row => this.roomOptions.find(room => room.id === row.optionId)?.lowSeasonEligible)
      .reduce((sum, row) => sum + this.countLowSeasonBlocks(row), 0);
  }

  private countLowSeasonBlocks(row?: QuotePlanRow): number {
    const start = this.dateValue(row?.startDate ?? this.startDate);
    const campaignStart = this.dateValue(CELLA_LOW_SEASON_START);
    const campaignEnd = this.dateValue(CELLA_LOW_SEASON_END);
    if (start === null || campaignStart === null || campaignEnd === null) return 0;
    let eligibleWeeks = 0;
    for (let week = 0; week < (row?.weeks ?? this.actualWeeks); week++) {
      const weekStart = start + week * 7 * DAY_MS;
      const weekEnd = weekStart + 6 * DAY_MS;
      if (weekStart >= campaignStart && weekEnd <= campaignEnd) eligibleWeeks++;
    }
    return Math.floor(eligibleWeeks / 4);
  }

  get lowSeasonDiscount(): number { return this.lowSeasonBlocks * 100; }

  get premiumSixPersonDiscount(): number {
    if (this.isFamilyPackage || this.isSocialPromotion) return 0;
    return this.quotePlan.mergedRows('room').reduce((sum, row) => {
      const room = this.roomOptions.find(item => item.id === row.optionId);
      return sum + (room?.premiumSixPerson ? this.countLowSeasonBlocks(row) * (room.fee - 499) : 0);
    }, 0);
  }

  get longStayDiscount(): number {
    if (this.isFamilyPackage || this.isSocialPromotion || !this.fullStayInsideLowSeason) return 0;
    if (this.actualWeeks >= 16) return 150;
    if (this.actualWeeks >= 12) return 100;
    if (this.actualWeeks >= 8) return 50;
    return 0;
  }

  /** 2027 offers need an arrival from 2027/02/14 to 2027/12/31. */
  get arrivesIn2027PromotionWindow(): boolean {
    return this.startDate >= CELLA_2027_PROMOTION.arrivalStart && this.startDate <= CELLA_2027_PROMOTION.arrivalEnd;
  }

  /** 2027 low season: 25 dollars per twin/triple/quad accommodation week outside 2027/05/30–08/28. */
  get lowSeason2027Weeks(): number {
    if (this.isFamilyPackage || this.isSocialPromotion || !this.arrivesIn2027PromotionWindow) return 0;
    return this.accommodationWeeks
      .filter(week => ['twin', 'triple', 'quad'].includes(week.room?.kind ?? '') && !this.inSummer2027(week.start)).length;
  }

  get lowSeason2027Discount(): number { return this.lowSeason2027Weeks * CELLA_2027_PROMOTION.lowSeasonPerWeek; }

  /** 2027 Premium six-person offer before the long-stay comparison: course and room 25% off for 4/8/12-week stays. */
  private get sixPerson2027Candidate(): number {
    if (this.isFamilyPackage || this.isSocialPromotion || !this.arrivesIn2027PromotionWindow
      || !CELLA_2027_PROMOTION.sixPersonWeeks.includes(this.actualWeeks)) return 0;
    const eligible = this.accommodationWeeks.filter(week => week.room?.premiumSixPerson && !this.inSummer2027(week.start));
    const base = eligible.reduce((sum, week) => sum + week.price + this.coursePriceForWeek(week.start), 0);
    return this.roundMoney(base * (1 - CELLA_2027_PROMOTION.sixPersonRate));
  }

  /** 2027 long-stay offer (12/16/20/24 weeks) for arrivals during 2027, all year. */
  private get longStay2027Candidate(): number {
    if (this.isFamilyPackage || this.isSocialPromotion || this.startDate < '2027-01-01' || this.startDate > '2027-12-31') return 0;
    return CELLA_2027_PROMOTION.longStayTiers.find(tier => this.actualWeeks >= tier.weeks)?.amount ?? 0;
  }

  /** The poster forbids combining the six-person and long-stay offers; the student keeps the larger one. */
  get premiumSixPerson2027Discount(): number {
    const six = this.sixPerson2027Candidate;
    return six > 0 && six >= this.longStay2027Candidate ? six : 0;
  }

  get longStay2027Discount(): number {
    const longStay = this.longStay2027Candidate;
    return longStay > 0 && longStay > this.sixPerson2027Candidate ? longStay : 0;
  }

  get peakSeasonCalculation() {
    if (this.isFamilyPackage) return { weeks: 0, total: 0, breakdown: [] };
    const start = this.dateValue(this.startDate);
    const weekStarts = start === null ? [] : Array.from({ length: this.actualWeeks }, (_, index) => start + index * 7 * DAY_MS);
    return calculateAssociationPeakSurcharge(
      this.campus === 'uni' ? 'CELLA-UNI' : 'CELLA-PREMIUM',
      weekStarts,
      this.catalog.peakSeasonRanges ?? [
        { start: '2026-07-05', end: '2026-08-29' },
        { start: '2027-07-04', end: '2027-08-28' },
        { start: '2028-07-02', end: '2028-08-26' },
      ],
      this.catalog.peakSeasonWeeklyFee,
    );
  }
  get peakSeasonWeeks(): number { return this.peakSeasonCalculation.weeks; }
  get peakSeasonSurcharge(): number { return this.peakSeasonCalculation.total; }
  get peakSeasonNote(): string { return associationPeakBreakdownText(this.peakSeasonCalculation); }
  /**
   * 思达启航折扣: course and room after every school offer (fixed amounts first, then the six-person 25%), as in
   * CELLA's own formula. Registration, the summer surcharge and the minor fee stay at full price. A family
   * package takes it on the package price less the 500-dollar registration it already holds (user decision 2026-11-21).
   */
  get sidaDiscount(): number {
    const rate = 1 - (this.catalog.sidaRate ?? CELLA_SIDA_RATE);
    if (this.isFamilyPackage) {
      return this.familyPackagePrice > 0 ? this.roundMoney(Math.max(0, this.familyPackagePrice - CELLA_FAMILY_REGISTRATION_FEE) * rate) : 0;
    }
    const base = this.coursePriceBeforePromotions + this.roomPriceBeforePromotions
      - this.socialPromotionDiscount
      - this.lowSeasonDiscount
      - this.premiumSixPersonDiscount
      - this.longStayDiscount
      - this.lowSeason2027Discount
      - this.premiumSixPerson2027Discount
      - this.longStay2027Discount;
    return this.roundMoney(Math.max(0, base) * rate);
  }

  get minorManagementFee(): number { return !this.isFamilyPackage && this.minorManagementSelected ? this.actualWeeks * 25 : 0; }

  get schoolTotal(): number {
    if (this.isFamilyPackage) return this.roundMoney(this.familyPackagePrice - this.sidaDiscount);
    return Math.max(0, this.roundMoney(
      this.catalog.registrationFee
      + this.coursePriceBeforePromotions
      + this.roomPriceBeforePromotions
      + this.peakSeasonSurcharge
      + this.minorManagementFee
      - this.socialPromotionDiscount
      - this.lowSeasonDiscount
      - this.premiumSixPersonDiscount
      - this.longStayDiscount
      - this.lowSeason2027Discount
      - this.premiumSixPerson2027Discount
      - this.longStay2027Discount
      - this.sidaDiscount,
    ));
  }

  /** Extension stages reached by the stay: 5–8 weeks, 9–12 weeks, then every further four weeks. */
  get visaStages(): number { return cellaExtensionStages(this.actualWeeks); }

  /** A 59-day entry already covers the first stage, so it starts at the 6,410-peso second stage. */
  get visaExtensionCount(): number {
    return this.initialVisaDays === 59 ? Math.max(0, this.visaStages - 1) : this.visaStages;
  }

  get visaExtensionTotal(): number {
    return CELLA_LOCAL_FEES_2027.extensionStages
      .slice(this.initialVisaDays === 59 ? 1 : 0, this.visaStages)
      .reduce((sum, amount) => sum + amount, 0);
  }

  get localFees(): CellaCalculatedLocalFee[] {
    if (this.isFamilyPackage) return [];
    const fees = CELLA_LOCAL_FEES_2027;
    const bookRule = this.catalog.localFeeRules?.find(fee => fee.id === 'books');
    const bookAmount = bookRule?.amount ?? 2000;
    const bookQuantity = bookRule?.periodWeeks ? textbookPeriods(this.quotePlan.courses, bookRule.periodWeeks, bookRule.rounding === 'proportional' ? 'proportional' : 'ceil') : textbookGroups(this.quotePlan.courses).length;
    const includeBooks = !bookRule || (bookRule.enabled && bookRule.includeInTotal);
    const weeks = this.accommodationWeeks;
    const effectiveFrom = this.dateValue(fees.effectiveFrom) ?? Number.POSITIVE_INFINITY;
    const water = weeks.map(week => week.start < effectiveFrom ? fees.waterPerWeekBefore2027 : fees.waterPerWeek);
    const electricity = weeks.map(week => week.room?.stacia && week.start >= effectiveFrom ? fees.staciaElectricityPerWeek : fees.electricityPerWeek);
    const staciaWeeks = weeks.filter(week => week.room?.stacia && week.start >= effectiveFrom).length;
    const extensions = this.visaExtensionCount;
    const visaNote = extensions
      ? `按${this.initialVisaDays}天旅游签证、就读${this.actualWeeks}周预估续签${extensions}次；以学校及移民局实收为准。`
      : `按${this.initialVisaDays}天旅游签证预估，本次无需续签。`;
    return [
      { item: 'SSP特殊学习许可证', unit: '7,800比索／次', quantity: '1', total: fees.ssp, note: '移民局收取，有效期6个月；换校需重新办理。' },
      { item: 'SSP电子卡', unit: '4,500比索／次', quantity: '1', total: fees.sspECard, note: '入学时与SSP同时办理，只收一次。' },
      { item: '签证续签', unit: '5,140／6,410／4,440比索', quantity: `${extensions}次`, total: this.visaExtensionTotal, note: visaNote },
      { item: 'ARP加急费', unit: '300比索／次', quantity: extensions ? '1' : '0', total: extensions ? fees.arp : 0, note: '首次续签时与签证一起办理。' },
      { item: '外国人身份证', unit: '4,000比索／次', quantity: this.visaStages >= 2 ? '1' : '0', total: this.visaStages >= 2 ? fees.acrICard : 0, note: '停留超过59天（第9周起）时办理。' },
      { item: '管理费', unit: '1,000比索／周', quantity: `${weeks.length}周`, total: fees.maintenancePerWeek * weeks.length, note: '公共区域、设施维护等费用，按住宿周数计算。' },
      {
        item: '电费', unit: this.rateText(electricity), quantity: `${weeks.length}周`, total: electricity.reduce((sum, value) => sum + value, 0),
        note: staciaWeeks === weeks.length && weeks.length
          ? 'STACIA校外宿舍2027年起固定收费，不另收超额电费。'
          : `每周含15度电，超出部分另收25比索／度${staciaWeeks ? '；STACIA校外宿舍2027年起1,000比索／周、不另收超额电费' : ''}。`,
      },
      {
        item: '水费', unit: this.rateText(water), quantity: `${weeks.length}周`, total: water.reduce((sum, value) => sum + value, 0),
        note: water.some(value => value === fees.waterPerWeekBefore2027) ? '公共用水和房间用水；2027/01/01起500比索／周，此前300比索／周。' : '公共用水和房间用水。',
      },
      ...(includeBooks ? [{ item: bookRule?.name ?? '教材费', unit: bookAmount.toLocaleString('en-US') + (bookRule?.periodWeeks ? '比索／' + bookRule.periodWeeks + '课程周' : '比索／课程类型预估'), quantity: String(bookQuantity), total: bookAmount * bookQuantity, note: bookRule?.note || '每种课程类型分别预估教材费用；后续更新教材按实际进度购买。' }] : []),
      { item: '学生证', unit: '200比索／张', quantity: '1', total: fees.studentId, note: '一次性费用。' },
    ];
  }

  get localFeeTotal(): number { return this.localFees.reduce((sum, item) => sum + item.total, 0); }

  /** Refundable deposit reference; STACIA charges none from 2027/01/01. */
  get depositAmount(): number | null {
    if (this.isFamilyPackage) return null;
    const weeks = this.accommodationWeeks;
    const effectiveFrom = this.dateValue(CELLA_LOCAL_FEES_2027.effectiveFrom) ?? Number.POSITIVE_INFINITY;
    if (weeks.length && weeks.every(week => week.room?.stacia && week.start >= effectiveFrom)) return 0;
    if (this.actualWeeks < 4) return 2000;
    if (this.actualWeeks <= 8) return 5000;
    if (this.actualWeeks <= 12) return 8000;
    return 10000;
  }

  get exchangeConfirmationNote(): string {
    if (this.selectedCourse?.needsConfirmation) return this.selectedCourse.note;
    return '';
  }

  get error(): string {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (this.quotePlan.courses.some(row => this.courseOptions.find(course => course.id === row.optionId)?.familyPackage)
      && (this.quotePlan.courses.length !== 1 || this.quotePlan.rooms.length !== 1)) return '家庭套餐须使用完整方案，请单独报价。';
    if (this.isSocialPromotion && (this.quotePlan.courses.length !== 1 || this.quotePlan.rooms.length !== 1)) return '6+2／9+3换课换房方案须由顾问确认。';
    if (!Number.isInteger(this.actualWeeks) || this.actualWeeks < 1 || this.actualWeeks > 24) return '学习周数请输入1–24周的整数。';
    const start = this.dateValue(this.startDate);
    if (start === null || new Date(start).getUTCDay() !== 0) return '入学和入住日期请选择周日。';
    if (!this.selectedCourse) return '请选择当前校区的有效课程。';
    if (this.isFamilyPackage && !CELLA_FAMILY_PACKAGE_WEEKS.includes(this.actualWeeks)) return '家庭套餐只有1–4周的整包价，更长时间请联系思达启航顾问。';
    if (this.isFamilyPackage && this.promotionMode !== 'standard') return '家庭套餐与其他优惠能否叠加未确认，请按附件整包价报价。';
    if (this.isFamilyPackage) return '';
    if (!this.selectedRoom) return '请选择当前校区的有效房型。';
    for (const row of this.quotePlan.mergedRows('course')) {
      const course = this.courseOptions.find(item => item.id === row.optionId);
      if (course?.allowedWeeks && !course.allowedWeeks.includes(row.weeks)) return `${course.name}只开${course.allowedWeeks.join('／')}周，请调整周数。`;
      if (course?.startDates2027 && row.startDate.startsWith('2027') && !course.startDates2027.includes(row.startDate)) {
        return `${course.name}须在学校指定开课日入学：${course.startDates2027.map(date => date.slice(5).replace('-', '/').replace(/^0/, '').replace('/0', '/')).join('、')}。`;
      }
    }
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
    if (this.isFamilyPackage && this.weeks > 4) this.weeks = 4;
    this.syncFamilyRoom();
  }

  /** After a course change: a family package takes its family room and drops the student-only choices; leaving one restores a normal room. */
  syncFamilyRoom(): void {
    const family = this.isFamilyPackage;
    if (family) {
      this.promotionMode = 'standard';
      this.minorManagementSelected = false;
    }
    for (const row of this.quotePlan.rooms) {
      if (family && row.optionId !== CELLA_FAMILY_ROOM.id) row.optionId = CELLA_FAMILY_ROOM.id;
      if (!family && !this.roomOptions.some(room => room.id === row.optionId)) row.optionId = this.defaultRoomId();
    }
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
    if (!rooms.some((item) => item.id === this.roomId)) this.roomId = this.defaultRoomId();
  }

  private defaultRoomId(): string {
    const rooms = this.roomOptions;
    const preferredRoom = this.isSocialPromotion
      ? rooms.find((item) => item.socialEligible)
      : this.campus === 'premium'
        ? rooms.find((item) => item.premiumSixPerson)
        : rooms.find((item) => item.socialEligible);
    return preferredRoom?.id ?? rooms[0]?.id ?? '';
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

  /** Every accommodation week with its room and that week's share of the row price. */
  private get accommodationWeeks(): Array<{ start: number; room?: CellaRoom; price: number }> {
    return this.quotePlan.rooms.flatMap(row => {
      const start = this.dateValue(row.startDate);
      if (start === null || !Number.isInteger(row.weeks) || row.weeks < 1) return [];
      const room = this.roomOptions.find(item => item.id === row.optionId);
      const price = this.quotePlan.price('room', row) / row.weeks;
      return Array.from({ length: row.weeks }, (_, index) => ({ start: start + index * 7 * DAY_MS, room, price }));
    });
  }

  private coursePriceForWeek(weekStart: number): number {
    for (const row of this.quotePlan.courses) {
      const start = this.dateValue(row.startDate);
      if (start !== null && weekStart >= start && weekStart < start + row.weeks * 7 * DAY_MS) return this.quotePlan.price('course', row) / row.weeks;
    }
    return 0;
  }

  private inSummer2027(weekStart: number): boolean {
    const from = this.dateValue(CELLA_2027_PROMOTION.summerStart)!;
    const to = this.dateValue(CELLA_2027_PROMOTION.summerEnd)!;
    return weekStart <= to && weekStart + 6 * DAY_MS >= from;
  }

  private rateText(rates: number[]): string {
    const distinct = [...new Set(rates)].sort((a, b) => a - b);
    return `${(distinct.length ? distinct : [0]).map(value => value.toLocaleString('en-US')).join('／')}比索／周`;
  }

  private dateValue(value: string): number | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const parsed = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value ? parsed : null;
  }

  private roundMoney(value: number): number { return Math.round(value * 100) / 100; }
}
