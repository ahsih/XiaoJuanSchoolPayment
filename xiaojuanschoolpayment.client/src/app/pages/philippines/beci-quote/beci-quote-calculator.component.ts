import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { applySchoolQuoteImageLayout, quoteMoney } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { BECI_CAMPUS_PRICING, BeciCampus, BeciCampusPricing, beciPriceMultiplier } from './beci-pricing';
import { BeciStudentQuote } from './beci-student-quote';

@Component({
  selector: 'app-beci-quote-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent],
  templateUrl: './beci-quote-calculator.component.html',
  styleUrls: [
    '../school-quote-rollout.css',
    '../../../components/school-group-quote.css',
    './beci-quote-calculator.component.css',
  ],
})
export class BeciQuoteCalculatorComponent implements OnInit {
  private readonly exchangeRateService = inject(ExchangeRateService);
  private selectedCampus: BeciCampus = 'eop';

  @Input({ required: true })
  set campus(value: BeciCampus) {
    if (!value || value === this.selectedCampus && this.students.length) return;
    this.selectedCampus = value;
    this.students = [new BeciStudentQuote(this.config)];
    this.requestedStudentCount = 2;
    this.quoteMode = 'single';
  }
  get campus(): BeciCampus { return this.selectedCampus; }
  get config(): BeciCampusPricing { return BECI_CAMPUS_PRICING[this.selectedCampus]; }

  students: BeciStudentQuote[] = [new BeciStudentQuote(BECI_CAMPUS_PRICING.eop)];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  usdToCny = 7.2;
  phpPerCny = 9;
  exchangeRateDate = '';
  usingLiveExchangeRates = false;
  quoteCalculated = false;

  ngOnInit(): void {
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((rates) => {
      if (rates.usdToCny <= 0 || rates.phpPerCny <= 0) return;
      this.usdToCny = rates.usdToCny;
      this.phpPerCny = rates.phpPerCny;
      this.exchangeRateDate = rates.date;
      this.usingLiveExchangeRates = true;
    });
  }

  get studentCount(): number { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new BeciStudentQuote(this.config));
    }
  }

  setQuoteMode(value: 'single' | 'group'): void {
    this.quoteMode = value;
    if (value === 'group') this.studentCount = this.requestedStudentCount;
    if (value === 'single') this.students[0].cityCoupleRateSelected = false;
  }

  get activeStudents(): BeciStudentQuote[] {
    if (this.quoteMode === 'single') return this.students.slice(0, 1);
    return this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2)));
  }

  get displayWeeks(): number { return this.activeStudents[0]?.quotePlan.courseWeeks ?? 0; }
  get firstEntryDate(): string {
    return this.activeStudents.map((student) => student.entryDate).filter(Boolean).sort()[0] ?? '';
  }
  get quoteHeading(): string {
    return this.quoteMode === 'single'
      ? `${this.config.shortName}${this.displayWeeks}周报价`
      : `${this.config.shortName} ${this.activeStudents.length}人报价`;
  }

  private get cityCoupleError(): string {
    if (this.campus !== 'city') return '';
    const selected = this.activeStudents.filter((student) => student.cityCoupleRateSelected);
    if (!selected.length) return '';
    if (this.quoteMode !== 'group' || this.activeStudents.length !== 2 || selected.length !== 2) {
      return 'City夫妻同行价仅限两名夫妻共同报价，且两名学生都要勾选夫妻同行。';
    }
    if (selected.some((student) => student.quotePlan.rooms.some((row) => row.optionId !== 'city-studio-twin'))) {
      return 'City夫妻同行价仅适用于两名学生共同选择Studio双人间。';
    }
    const signatures = selected.map((student) => student.quotePlan.rooms
      .map((row) => `${row.startDate}|${row.weeks}|${row.optionId}`)
      .sort().join(';'));
    return signatures[0] === signatures[1] ? '' : '夫妻同行的两名学生须选择相同的Studio双人间入住日期和周数。';
  }

  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) {
      return '多人报价人数请选择2–20人的整数。';
    }
    const studentIndex = this.activeStudents.findIndex((student) => !!student.quoteError);
    if (studentIndex >= 0) {
      return `${this.quoteMode === 'group' ? `学生${studentIndex + 1}：` : ''}${this.activeStudents[studentIndex].quoteError}`;
    }
    return this.cityCoupleError;
  }

  get quoteUsd(): number { return this.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0); }
  get quoteUsdText(): string { return `${quoteMoney(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string { return `人民币预计金额：约 ${Math.round(this.quoteUsd * this.usdToCny).toLocaleString('zh-CN')} 元`; }
  get exchangeRateSummary(): string {
    const source = this.usingLiveExchangeRates && this.exchangeRateDate ? this.exchangeRateDate.replace(/-/g, '/') : '备用参考值';
    return `参考汇率：1美元 ≈ ${this.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元人民币（${source}）`;
  }

  get schoolPaymentItems(): QuoteImagePaymentItem[] {
    return [
      ...(['课', '宿'] as const).flatMap((icon) => this.activeStudents.flatMap((student, index) =>
        student.quotePlan.paymentItems().filter((item) => item.icon === icon).map((item) => ({
          ...item,
          label: `${this.quoteMode === 'group' ? `学生${index + 1} · ` : ''}${item.label.replace(/^课程费/, '课程名称').replace(/^住宿费/, '住宿名称')}`,
        })),
      )),
      ...groupPaymentLines(this.activeStudents, true),
    ];
  }

  get estimatedLocalFees() { return groupLocalFees(this.activeStudents); }
  get estimatedLocalFeeTotal(): number { return this.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0); }
  get estimatedLocalFeeCny(): number { return Math.round(this.estimatedLocalFeeTotal / this.phpPerCny); }
  get depositTotal(): number { return this.activeStudents.length * 3000; }
  get depositCny(): number { return Math.round(this.depositTotal / this.phpPerCny); }

  calculateQuote(): void { this.quoteCalculated = true; }
  formatUsd(value: number): string { return quoteMoney(value); }
  formatPhp(value: number): string { return `${Math.round(value).toLocaleString('en-US')} 比索`; }
  formatQuantity(value: number): string { return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }); }
  trackIndex(index: number): number { return index; }

  get quoteImageData() {
    const shortStayNotes = [...new Set(this.activeStudents.flatMap((student) =>
      student.quotePlan.shortStayNotes(beciPriceMultiplier),
    ))];
    const warnings = this.activeStudents.flatMap((student, index) => student.quotePlan.warning
      ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.quotePlan.warning}`]
      : []);
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: this.config.code,
      schoolName: this.config.name,
      filePrefix: this.config.code.replace(/\s+/g, '-'),
      heroSrc: this.config.hero,
      weeks: this.displayWeeks,
      startDate: this.firstEntryDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
      paymentItems: this.schoolPaymentItems,
      localFeeItems: this.estimatedLocalFees.map((fee) => ({
        label: fee.item,
        unit: fee.unitLabel,
        quantity: this.formatQuantity(fee.quantity),
        amount: this.formatPhp(fee.total),
        note: fee.note,
      })),
      localFeeTotal: this.estimatedLocalFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.estimatedLocalFeeCny,
      localFeeNote: '学杂费按每名学生的课程、住宿、签证和接机选择分别计算后汇总；接机勾选后计入，房间押金不计入。',
      optionalFeeItems: [{
        label: '房间押金',
        amount: this.formatPhp(this.depositTotal),
        cnyAmount: `约人民币 ${this.depositCny.toLocaleString('zh-CN')} 元`,
        note: `${this.activeStudents.length}人 × 3,000比索；无损坏、无欠费并按学校规则完成退房后可退，不计入学杂费合计。`,
      }],
      ruleNotes: [
        ...warnings,
        ...shortStayNotes,
        '2026/02/08–06/14或2026/09/06–12/27入学，整段课程费与住宿费九折；之后再扣长期优惠。',
        '旺季费按课程实际覆盖2026/06/28–08/22或2027/06/27–08/21的重叠周数，每周40美元。',
        this.config.campusNote,
      ],
    });
    const result = applySchoolQuoteImageLayout(
      quote,
      this.config.shortName,
      this.displayWeeks,
      this.firstEntryDate,
      this.quoteUsd,
      this.usdToCny,
    );
    return {
      ...result,
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${this.firstEntryDate.replace(/-/g, '')}.png`,
      localFeeTitle: '到校后学杂费明细（按每名学生方案汇总）',
      conversionRates: {
        usdToCny: this.usdToCny,
        phpPerCny: this.phpPerCny,
        date: this.usingLiveExchangeRates ? this.exchangeRateDate : undefined,
      },
    };
  }
}
