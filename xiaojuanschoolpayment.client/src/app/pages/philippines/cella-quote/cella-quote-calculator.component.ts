import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import {
  QuoteImageDownloadButtonComponent,
  QuoteImageLocalFeeItem,
  QuoteImagePaymentItem,
} from '../../../components/quote-image-download-button.component';
import { applySchoolQuoteImageLayout, quoteMoney } from '../../../components/school-quote-plan';
import {
  CELLA_CAMPUS_NAMES,
  CELLA_COURSES,
  CELLA_LOW_SEASON_END,
  CELLA_LOW_SEASON_START,
  CELLA_PEAK_SEASON_WEEKLY_FEE,
  CELLA_REGISTRATION_FEE,
  CELLA_ROOMS,
  CELLA_SOCIAL_PROMOTION_NOTES,
  CellaCampus,
  CellaCourse,
  CellaPromotionMode,
} from './cella-pricing';
import { CellaQuoteCatalog, CellaStudentQuote } from './cella-student-quote';

type QuoteMode = 'single' | 'group';

@Component({
  selector: 'app-cella-quote-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent],
  templateUrl: './cella-quote-calculator.component.html',
  styleUrls: [
    '../../../components/school-group-quote.css',
    '../philippines-local-fee-table.css',
    './cella-quote-calculator.component.css',
  ],
})
export class CellaQuoteCalculatorComponent implements OnInit {
  private readonly exchangeRateService = inject(ExchangeRateService);

  @Input() initialCampus: CellaCampus = 'uni';

  readonly lowSeasonStart = CELLA_LOW_SEASON_START;
  readonly lowSeasonEnd = CELLA_LOW_SEASON_END;
  readonly socialPromotionNotes = CELLA_SOCIAL_PROMOTION_NOTES;
  readonly catalog: CellaQuoteCatalog = {
    courses: CELLA_COURSES.map((item) => ({ ...item })),
    rooms: CELLA_ROOMS.map((item) => ({ ...item })),
    registrationFee: CELLA_REGISTRATION_FEE,
    peakSeasonWeeklyFee: CELLA_PEAK_SEASON_WEEKLY_FEE,
  };

  quoteMode: QuoteMode = 'single';
  studentCount = 2;
  students: CellaStudentQuote[] = [];
  quoteCalculated = false;
  usdToCny = 7.2;
  phpPerCny = 9;
  exchangeRateDate = '';
  exchangeRateLive = false;

  ngOnInit(): void {
    this.ensureStudents(2);
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((snapshot) => {
      this.usdToCny = snapshot.usdToCny;
      this.phpPerCny = snapshot.phpPerCny;
      this.exchangeRateDate = snapshot.date;
      this.exchangeRateLive = true;
    });
  }

  get activeStudents(): CellaStudentQuote[] {
    const count = this.quoteMode === 'single' ? 1 : this.normalizedStudentCount;
    this.ensureStudents(count);
    return this.students.slice(0, count);
  }

  get normalizedStudentCount(): number {
    const value = Number.isFinite(this.studentCount) ? Math.trunc(this.studentCount) : 2;
    return Math.max(2, Math.min(20, value));
  }

  get quoteHeading(): string {
    if (this.quoteMode === 'group') return `${CELLA_CAMPUS_NAMES[this.initialCampus]} ${this.normalizedStudentCount}人报价`;
    const student = this.activeStudents[0];
    return `${student?.campusName ?? 'CELLA'} ${student?.actualWeeks ?? 0}周报价`;
  }

  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) {
      return '多人报价人数请选择2–20人的整数。';
    }
    const index = this.activeStudents.findIndex((student) => !!student.error);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].error}`;
  }

  get schoolTotal(): number { return this.activeStudents.reduce((sum, student) => sum + student.schoolTotal, 0); }
  get localFeeTotal(): number { return this.activeStudents.reduce((sum, student) => sum + student.localFeeTotal, 0); }
  get hasFamilyPackages(): boolean { return this.activeStudents.some((student) => student.isFamilyPackage); }
  get hasRegularQuotes(): boolean { return this.activeStudents.some((student) => !student.isFamilyPackage); }
  get schoolTotalCny(): number { return Math.round(this.schoolTotal * this.usdToCny); }
  get localFeeTotalCny(): number { return Math.round(this.localFeeTotal / this.phpPerCny); }
  get localFeeIntro(): string {
    if (!this.hasRegularQuotes) return '家庭套餐整包价已包含附件列明的当地费用，下表标示为“已包含”；汇款手续费、额外电费、签证续签及未列项目仍需向学校确认。';
    if (this.hasFamilyPackages) return '普通课程按每名学生的实际就读总周数预估当地费用；家庭套餐已包含附件列明的当地费用。合计不重复加入家庭套餐所含项目。';
    return '当地费用按每名学生的实际就读总周数计算。合计不含接机、洗衣、可退押金和附件未确认的后续签证续签金额。';
  }
  get localFeeTotalText(): string { return this.hasRegularQuotes ? `${this.formatMoney(this.localFeeTotal)}比索` : '套餐已包含'; }
  get localFeeTotalNote(): string { return this.hasRegularQuotes ? '仅汇总已有明确金额且未包含在家庭套餐内的项目' : '不再重复计入学校费用'; }
  get exchangeRateText(): string {
    return this.exchangeRateLive && this.exchangeRateDate
      ? `汇率日期：${this.exchangeRateDate}；1美元≈${this.usdToCny.toFixed(4)}人民币，1人民币≈${this.phpPerCny.toFixed(4)}比索`
      : '实时汇率暂不可用，本次采用备用汇率：1美元≈7.2人民币，1人民币≈9比索';
  }

  setQuoteMode(mode: QuoteMode): void {
    this.quoteMode = mode;
    this.ensureStudents(mode === 'single' ? 1 : this.normalizedStudentCount);
  }

  updateStudentCount(): void { this.ensureStudents(this.normalizedStudentCount); }

  updateCourse(student: CellaStudentQuote, courseId: string): void {
    student.selectCourse(courseId);
  }

  updatePromotion(student: CellaStudentQuote, promotion: CellaPromotionMode): void {
    student.selectPromotion(promotion);
  }

  calculateQuote(): void { this.quoteCalculated = !this.quoteError; }

  paymentItemsFor(student: CellaStudentQuote, index: number): QuoteImagePaymentItem[] {
    const prefix = this.quoteMode === 'group' ? `学生${index + 1} · ` : '';
    if (student.isFamilyPackage) {
      const familyPackage = student.selectedCourse?.familyPackage;
      return [{
        icon: '家',
        label: `${prefix}家庭套餐`,
        amount: `${this.formatMoney(student.familyPackagePrice)} 美元`,
        detailTitle: student.selectedCourse?.name ?? 'Family Package',
        detailSubtitle: `${this.formatDate(student.startDate)}–${this.formatDate(student.endDate)} · ${student.actualWeeks}周 · ${familyPackage?.occupants ?? '成员组合需确认'}`,
        note: student.selectedCourse?.note ?? '',
      }];
    }
    const items: QuoteImagePaymentItem[] = [
      {
        icon: '注', label: `${prefix}注册费`, amount: `${this.formatMoney(this.catalog.registrationFee)} 美元`,
        note: '每名学生一次性收取；转校或延期学生是否再次收取需向学校确认。',
      },
      {
        icon: '课', label: `${prefix}课程名称`, amount: `${this.formatMoney(student.coursePriceBeforePromotions)} 美元`,
        detailTitle: student.selectedCourse?.name ?? '请选择课程',
        detailSubtitle: `${this.formatDate(student.startDate)}–${this.formatDate(student.endDate)} · 实际就读${student.actualWeeks}周`,
        note: `${student.selectedCourse?.lessons ?? ''}。4周课程费${this.formatMoney(student.selectedCourse?.tuition ?? 0)}美元。`,
      },
      {
        icon: '宿', label: `${prefix}住宿名称`, amount: `${this.formatMoney(student.roomPriceBeforePromotions)} 美元`,
        detailTitle: student.selectedRoom?.name ?? '请选择房型',
        detailSubtitle: `${this.formatDate(student.startDate)}–${this.formatDate(student.endDate)} · 实际住宿${student.actualWeeks}周`,
        note: `${student.selectedRoom?.note ?? ''} 4周住宿费${this.formatMoney(student.selectedRoom?.fee ?? 0)}美元。`,
      },
    ];

    if (student.peakSeasonSurcharge) {
      items.push({ icon: '附', label: `${prefix}暑期附加费`, amount: `${this.formatMoney(student.peakSeasonSurcharge)} 美元`, note: `40美元／周，本次覆盖${student.peakSeasonWeeks}周；按实际课程周计算。` });
    }
    if (student.minorManagementFee) {
      items.push({ icon: '监', label: `${prefix}未成年人管理费`, amount: `${this.formatMoney(student.minorManagementFee)} 美元`, note: `25美元／周／人，本次按${student.actualWeeks}周计算。` });
    }
    if (student.socialPromotionDiscount) {
      items.push({ icon: '惠', label: `${prefix}${student.promotionMode === 'social-6-plus-2' ? '6+2限时活动' : '9+3限时活动'}`, amount: `− ${this.formatMoney(student.socialPromotionDiscount)} 美元`, note: `${student.paidWeeks}周课程和四人间收费，赠送${student.giftWeeks}周；当地费用按实际${student.actualWeeks}周收取。须完成社交媒体分享，且不可与其他优惠叠加。`, accent: true });
    }
    if (student.lowSeasonDiscount) {
      items.push({ icon: '惠', label: `${prefix}淡季优惠`, amount: `− ${this.formatMoney(student.lowSeasonDiscount)} 美元`, note: `活动期内每个完整4周优惠100美元，本次${student.lowSeasonBlocks}个计费周期；课程与住宿不重复扣减。`, accent: true });
    }
    if (student.premiumSixPersonDiscount) {
      items.push({ icon: '惠', label: `${prefix}Premium六人间特价`, amount: `− ${this.formatMoney(student.premiumSixPersonDiscount)} 美元`, note: `活动期内住宿费由600美元／4周调整为499美元／4周；不可再叠加淡季100美元优惠。`, accent: true });
    }
    if (student.longStayDiscount) {
      items.push({ icon: '惠', label: `${prefix}长期报名优惠`, amount: `− ${this.formatMoney(student.longStayDiscount)} 美元`, note: `${student.actualWeeks}周符合活动期长期报名档位；可与当前淡季或六人间优惠同时使用。`, accent: true });
    }
    return items;
  }

  get schoolPaymentItems(): QuoteImagePaymentItem[] {
    return this.activeStudents.flatMap((student, index) => this.paymentItemsFor(student, index));
  }

  get localFeeRows(): Array<QuoteImageLocalFeeItem & { totalValue: number }> {
    return this.activeStudents.flatMap((student, index) => {
      const prefix = this.quoteMode === 'group' ? `学生${index + 1} · ` : '';
      if (student.isFamilyPackage) {
        return [{
          label: `${prefix}家庭套餐所含当地费用`,
          unit: '套餐已含',
          quantity: '1套',
          amount: '已包含',
          totalValue: 0,
          note: '已含SSP、电子卡、电费、水费、管理费、洗衣、周日接机、学生证和教材；不重复计费。',
        }];
      }
      return student.localFees.map((fee) => ({
        label: `${prefix}${fee.item}`,
        unit: fee.unit,
        quantity: fee.quantity,
        amount: `${this.formatMoney(fee.total)} 比索`,
        totalValue: fee.total,
        note: fee.note,
      }));
    });
  }

  get optionalFeeItems() {
    const regularStudents = this.activeStudents.filter((student) => !student.isFamilyPackage);
    const deposits = regularStudents.map((student, index) => ({ index, amount: student.depositAmount }));
    const knownDeposits = [...new Set(deposits.map((item) => item.amount).filter((value): value is number => value !== null))];
    const depositNeedsConfirmation = this.hasFamilyPackages || deposits.some((item) => item.amount === null);
    const depositText = depositNeedsConfirmation
      ? '部分学生需向学校确认'
      : `${knownDeposits.map((value) => this.formatMoney(value)).join('／')} 比索`;
    const depositCny = depositNeedsConfirmation
      ? ''
      : `约人民币 ${knownDeposits.map((value) => Math.round(value / this.phpPerCny).toLocaleString('zh-CN')).join('／')} 元`;
    const items = [];
    if (this.hasRegularQuotes) {
      items.push(
        { label: '洗衣服务（价格参考）', amount: '最低100比索（50比索／公斤）', cnyAmount: `最低约人民币${Math.round(100 / this.phpPerCny)}元`, note: '最少2公斤；自由选择是否使用，按实际重量和学校现场标准结算，不计入学杂费合计。' },
        { label: '宿务麦克坦机场周日接机（价格参考）', amount: '1,200比索／次', cnyAmount: `约人民币${Math.round(1200 / this.phpPerCny)}元`, note: this.quoteMode === 'group' ? '多人接机按车辆和实际安排确认，不按人数自动累加。' : '可选，也可自行前往；不计入学杂费合计。' },
      );
    }
    if (this.hasFamilyPackages) {
      items.push({ label: '家庭套餐已含项目', amount: '套餐已包含', cnyAmount: '', note: '附件列明的洗衣和周日接机已包含在整包价内，不再作为可选费用重复收取。' });
    }
    items.push({
      label: this.hasFamilyPackages ? '房间押金（需确认）' : '房间押金（可退参考）',
      amount: depositText,
      cnyAmount: depositCny,
      note: this.hasFamilyPackages
        ? '家庭套餐附件未单列房间押金，是否另收及退还规则需向学校确认；普通方案参考4–8周5,000比索、9–12周8,000比索、16–24周10,000比索。'
        : '4–8周5,000比索，9–12周8,000比索，16–24周10,000比索；13–15周附件未列，需向学校确认。多人或共住房间不得直接按人数累加。',
    });
    return items;
  }

  get quoteImageData() {
    const first = this.activeStudents[0];
    const earliest = this.activeStudents.map((student) => student.startDate).sort()[0] ?? '';
    const socialSelected = this.activeStudents.some((student) => student.isSocialPromotion);
    const ruleNotes = [
      `淡季活动期：${this.formatDate(this.lowSeasonStart)}–${this.formatDate(this.lowSeasonEnd)}；入学和入住按周日，离校和退房按周六。`,
      ...(this.hasRegularQuotes ? ['1／2／3周暂沿用现有4周价格的40%／65%／85%估算；本次附件未确认短期比例，需向学校确认。'] : []),
      ...(socialSelected ? [`6+2／9+3仅限首次报名新生及${CELLA_CAMPUS_NAMES[this.initialCampus]}四人间；课程和住宿按6／9周收费、实际就读8／12周，当地费用按实际周数，不与任何其他优惠叠加。`] : []),
      ...(socialSelected ? [...this.socialPromotionNotes] : []),
      ...this.activeStudents.flatMap((student, index) => student.exchangeConfirmationNote
        ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.exchangeConfirmationNote}`]
        : []),
    ];
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'CELLA',
      schoolName: `菲律宾宿务${CELLA_CAMPUS_NAMES[this.initialCampus]}`,
      filePrefix: this.initialCampus === 'uni' ? 'CELLA-Uni-Sparta' : 'CELLA-Premium',
      // Quote export must stay same-origin; remote campus photos can taint the canvas.
      heroSrc: '/assets/philippines/cebu-study-hero.jpg',
      weeks: first?.actualWeeks ?? 4,
      startDate: earliest,
      usdToCny: this.usdToCny,
      totalUsd: this.schoolTotal,
      paymentItems: this.schoolPaymentItems,
      localFeeItems: this.localFeeRows,
      localFeeTotal: this.localFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.localFeeTotalCny,
      localFeeNote: this.localFeeIntro,
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
    });
    const result = applySchoolQuoteImageLayout(quote, 'CELLA', first?.actualWeeks ?? 4, earliest, this.schoolTotal, this.usdToCny);
    return {
      ...result,
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${earliest.replace(/-/g, '')}.png`,
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateLive ? this.exchangeRateDate : undefined },
    };
  }

  formatMoney(value: number): string { return quoteMoney(value); }
  formatDate(value: string): string { return value ? value.replace(/-/g, '/') : '待确认'; }
  courseOptionLabel(course: CellaCourse): string {
    const familyPackage = course.familyPackage;
    if (!familyPackage) return `${course.name} · ${this.formatMoney(course.tuition)}美元／4周`;
    return `${course.name} · 4周${this.formatMoney(familyPackage.prices[4])}／6周${this.formatMoney(familyPackage.prices[6])}／8周${this.formatMoney(familyPackage.prices[8])}美元整包`;
  }

  private ensureStudents(count: number): void {
    while (this.students.length < count) this.students.push(new CellaStudentQuote(this.catalog, this.initialCampus));
  }
}
