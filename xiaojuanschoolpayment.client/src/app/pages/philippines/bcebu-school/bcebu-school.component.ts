import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { BCebuQuote } from './bcebu-quote';
import { BCEBU_COURSES, BCEBU_ROOMS, BCEBU_LOCAL_FEE_INTRO, bcebuMultiplier } from './bcebu-pricing';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { SCHOOL_VISA_OPTIONS, groupLocalFees } from '../../../components/school-group-quote';
import { QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { applySchoolQuoteImageLayout, quoteMoney } from '../../../components/school-quote-plan';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface BCebuStudentQuote { calculator: BCebuQuote; }

@Component({
  selector: 'app-bcebu-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent, SchoolQuotePlanComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bcebu-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../philippines-local-fee-table.css',
    '../school-quote-rollout.css',
    '../../../components/school-group-quote.css',
    './bcebu-school.component.css',
  ],
})
export class BCebuSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolNames = ["菲律宾宿务B'Cebu语言学校", "BECI B'Cebu", "B'Cebu"];
  registrationFee = 100;
  usdToCny = 7.2;
  phpPerCny = 9;
  exchangeRateDate = '';
  exchangeRateLive = false;
  quoteCalculated = false;
  courseFees = BCEBU_COURSES.map(course => ({ ...course }));
  roomFees = BCEBU_ROOMS.map(room => ({ ...room }));
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly students: BCebuStudentQuote[] = [this.createStudent()];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) { this.requestedStudentCount = value; if (Number.isInteger(value) && value >= 2 && value <= 20) while (this.students.length < value) this.students.push(this.createStudent()); }
  setQuoteMode(value: 'single' | 'group') { this.quoteMode = value; if (value === 'group') this.studentCount = this.requestedStudentCount; }
  get activeStudents() { return this.quoteMode === 'single' ? this.students.slice(0, 1) : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2))); }
  private createStudent(): BCebuStudentQuote { return { calculator: new BCebuQuote(() => this.courseFees, () => this.roomFees, () => this.registrationFee, this.nextSunday()) }; }
  get calculator() { return this.students[0].calculator; }
  readonly quotePlan = this.calculator.plan;
  readonly localFeeIntro = BCEBU_LOCAL_FEE_INTRO;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '地区', value: '宿务 / 麦克坦', note: '房型资料包含马克坦新城与校内花园方向' },
    { icon: 'school', label: '课程', value: 'ESL / IELTS / Business', note: '另有Junior、40岁以上轻量课与幼儿园' },
    { icon: 'rule', label: '学习强度', value: '弹性到斯巴达', note: "Speed ESL、Intensive、IELTS Sparta与B'SPARTA可选" },
    { icon: 'family_restroom', label: '年龄方向', value: '3岁起 / 成人 / 亲子', note: '课程与房型均需按年龄和同行关系确认' },
    { icon: 'bed', label: '住宿', value: '单人至三人房', note: '另有客厅套房、亲子加床和2+1房型' },
    { icon: 'percent', label: '短期比例', value: '40% / 60% / 80%', note: '对应1周 / 2周 / 3周' },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '2026课程费', target: 'course-fees', icon: 'menu_book' },
    { label: '2026住宿费', target: 'room-fees', icon: 'bed' },
    { label: '费用计算器', target: 'quote', icon: 'calculate' },
    { label: '当地学杂费', target: 'local-fees', icon: 'receipt_long' },
    { label: '价格说明', target: 'price-note', icon: 'info' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
    this.exchangeRateService.getLatestCnyRates().pipe(
      catchError(() => EMPTY),
    ).subscribe((snapshot) => {
      if (!Number.isFinite(snapshot.usdToCny) || snapshot.usdToCny <= 0 || !Number.isFinite(snapshot.phpPerCny) || snapshot.phpPerCny <= 0) return;
      this.usdToCny = snapshot.usdToCny;
      this.phpPerCny = snapshot.phpPerCny;
      this.exchangeRateDate = snapshot.date;
      this.exchangeRateLive = true;
    });
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: "B'Cebu" }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toUpperCase().includes('CEBU')) ??
          schools[0];
        if (!school?.id) return EMPTY;
        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees }) => this.applyPricingData(lessons, rooms, fees));
  }

  private applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    // Keep the confirmed full catalog and notes when an API response is partial or older.
    this.courseFees = this.courseFees.map(course => {
      const row = lessons.find(item => item.week === 4 && item.name === course.name);
      return row && Number.isFinite(row.price) && row.price > 0 ? { ...course, tuition: row.price } : course;
    });
    this.roomFees = this.roomFees.map(room => {
      const row = rooms.find(item => item.week === 4 && item.name === room.name);
      return row && Number.isFinite(row.price) && row.price > 0 ? { ...room, fee: row.price } : room;
    });
    const registration = fees.find(fee => fee.name === '注册费');
    if (registration && Number.isFinite(registration.fee) && registration.fee >= 0) this.registrationFee = registration.fee;
  }

  get selectedWeeks() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.plan.courseWeeks, 0); }
  get selectedCoursesText() { return this.activeStudents.flatMap(student => student.calculator.plan.courses.map(row => this.courseFees.find(course => course.id === row.optionId)?.name)).filter(Boolean).join(' / '); }
  get selectedRoomsText() { return this.activeStudents.flatMap(student => student.calculator.plan.rooms.map(row => this.roomFees.find(room => room.id === row.optionId)?.name)).filter(Boolean).join(' / '); }
  get quoteTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.total, 0); }
  get quoteUsdText() { return `${this.formatUsd(this.quoteTotal)} 美元`; }
  get quoteCnyText() { return `人民币预计约 ${Math.round(this.quoteTotal * this.usdToCny).toLocaleString('zh-CN')} 元`; }
  get exchangeRateText() {
    return `${this.exchangeRateLive ? `参考汇率日期 ${this.exchangeRateDate}` : '备用汇率估算'}：1美元≈${this.formatUsd(this.usdToCny)}人民币，1人民币≈${this.formatUsd(this.phpPerCny)}比索；以支付当日汇率为准。`;
  }
  get quoteHeading() { return `B'Cebu${this.selectedWeeks}周报价`; }
  get quoteError() {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex(student => !!student.calculator.error);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].calculator.error}`;
  }
  get localFees() {
    return groupLocalFees(this.activeStudents.map(student => ({ localFees: student.calculator.localFees.map(fee => ({ item: fee.item, unitLabel: fee.amount, quantity: fee.quantity, total: fee.total, note: fee.note })) })))
      .map(fee => ({ item: fee.item, amount: fee.unitLabel, quantity: fee.quantity, total: fee.total, note: fee.note }));
  }
  get localTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get optionalFees() {
    const pickupTotal = this.activeStudents.reduce((sum, student) => sum + student.calculator.optionalFees[0].total, 0);
    const pickupCount = this.activeStudents.filter(student => student.calculator.pickup !== 'none').length;
    const firstDeposit = this.activeStudents[0].calculator.optionalFees[1];
    return [
      { item: '宿务马克坦机场团体接机', total: pickupTotal, note: `${pickupCount ? `本次${pickupCount}人选择接机，按各自抵达条件计费` : '本次无人选择接机'}；学校团体接机，可能需在机场等候同批其他学生。` },
      { item: '房间押金（参考）', total: firstDeposit.total, note: '1–4周3,000比索，5–24周5,000比索；现有资料未明确多人同住时按人或按房，暂只列一份参考金额，不自动乘人数；无损坏及无欠费时可退。' },
    ];
  }
  get newStudentCount() { return this.activeStudents.filter(student => !student.calculator.returningStudent).length; }
  get registrationCharge() { return this.registrationFee * this.newStudentCount; }
  get tuitionTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.plan.total('course'), 0); }
  get accommodationTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.plan.total('room'), 0); }
  get paymentItems() {
    const total = (key: 'reporterDiscount' | 'offSeasonDiscount' | 'sidaDiscount' | 'longStayDiscount' | 'peakFee' | 'minorFee') => this.activeStudents.reduce((sum, student) => sum + student.calculator[key], 0);
    return [
      { label: '注册费', amount: `${this.formatUsd(this.registrationCharge)} 美元`, note: `一次性费用，老学员返校免费；本次${this.newStudentCount}名新生。` },
      { label: '免注册费优惠', amount: `− ${this.formatUsd(this.registrationCharge)} 美元`, note: '通过思达报名，新生注册费免收。' },
      { label: '课程费合计', amount: `${this.formatUsd(this.tuitionTotal)} 美元`, note: '按每位学生实际选择的课程和日期计算。' },
      { label: '住宿费合计', amount: `${this.formatUsd(this.accommodationTotal)} 美元`, note: '按每位学生实际选择的房型和日期计算。' },
      ...(total('reporterDiscount') ? [{ label: '记者活动优惠', amount: `− ${this.formatUsd(total('reporterDiscount'))} 美元`, note: '只合并实际参加且符合条件学生的优惠金额。' }] : []),
      ...(total('offSeasonDiscount') ? [{ label: '淡季优惠', amount: `− ${this.formatUsd(total('offSeasonDiscount'))} 美元`, note: '成人85折、亲子9折；按各学生实际方案分别计算。' }] : []),
      ...(total('sidaDiscount') ? [{ label: '思达启航专属折扣', amount: `− ${this.formatUsd(total('sidaDiscount'))} 美元`, note: '课程及住宿在适用优惠后再享9折。' }] : []),
      ...(total('longStayDiscount') ? [{ label: '长期优惠', amount: `− ${this.formatUsd(total('longStayDiscount'))} 美元`, note: '按各学生累计课程周数分别计算。' }] : []),
      ...(total('peakFee') ? [{ label: '旺季附加费', amount: `${this.formatUsd(total('peakFee'))} 美元`, note: '按各学生实际覆盖的旺季周数计算。' }] : []),
      ...(total('minorFee') ? [{ label: '未成年单独在校管理费', amount: `${this.formatUsd(total('minorFee'))} 美元`, note: '按各未成年学生年龄和住宿周数分别计算。' }] : []),
    ];
  }
  get quoteImageData() {
    const courseItems: QuoteImagePaymentItem[] = [], roomItems: QuoteImagePaymentItem[] = [];
    this.activeStudents.forEach((student, index) => student.calculator.plan.paymentItems().forEach(item => {
      const target = item.icon === '课' ? courseItems : roomItems;
      target.push({ ...item, label: `${this.quoteMode === 'group' ? `学生${index + 1} · ` : ''}${item.label.replace(/^课程费/, '课程').replace(/^住宿费/, '住宿')}` });
    }));
    const rows: QuoteImagePaymentItem[] = [
      { icon: '注', label: '注册费', amount: `${quoteMoney(this.registrationCharge)} 美元`, note: this.paymentItems[0].note },
      { icon: '免', label: '免注册费优惠', amount: `− ${quoteMoney(this.registrationCharge)} 美元`, note: this.paymentItems[1].note, accent: true },
      ...courseItems, ...roomItems,
      ...this.paymentItems.slice(4).map(item => ({ icon: item.amount.startsWith('−') ? '惠' : '附', label: item.label, amount: item.amount, note: item.note, accent: item.amount.startsWith('−') })),
    ];
    const start = this.activeStudents.map(student => student.calculator.plan.startDate).filter(Boolean).sort()[0] ?? '';
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: "B'Cebu", schoolName: "B'Cebu", filePrefix: 'BCEBU', heroSrc: '/assets/philippines/bcebu-campus-hero.webp',
      weeks: this.selectedWeeks, startDate: start, usdToCny: this.usdToCny, totalUsd: this.quoteTotal,
      fullFeeDetails: true, localFeeTableLayout: 'web', paymentItems: rows,
      localFeeItems: this.localFees.map(fee => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: `${quoteMoney(fee.total)} 比索`, note: fee.note })),
      localFeeTotal: this.localTotal, localCurrencyName: '比索', localFeeCny: Math.round(this.localTotal / this.phpPerCny), localFeeNote: this.localFeeIntro,
      optionalFeeItems: this.optionalFees.map(fee => ({ label: fee.item, amount: `${quoteMoney(fee.total)} 比索`, cnyAmount: `人民币预计约 ${Math.round(fee.total / this.phpPerCny).toLocaleString('zh-CN')} 元`, note: fee.note })), ruleNotes: [],
    });
    const warnings = this.activeStudents.flatMap((student, index) => student.calculator.plan.warning ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.calculator.plan.warning}`] : []);
    const shortNotes = [...new Set(this.activeStudents.flatMap(student => student.calculator.plan.shortStayNotes(bcebuMultiplier)))];
    const result = applySchoolQuoteImageLayout({ ...quote, importantNotes: [...warnings, ...shortNotes, '最终以学校价格、空房及优惠确认为准。'] }, "B'Cebu", this.selectedWeeks, start, this.quoteTotal, this.usdToCny);
    return { ...result, headingText: this.quoteHeading, fileName: `${this.quoteHeading}-${start.replace(/-/g, '')}.png`, conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateLive ? this.exchangeRateDate : undefined } };
  }
  formatUsd(value: number) { return value.toLocaleString('en-US', { maximumFractionDigits: 2 }); }
  formatPhp(value: number) { return `${this.formatUsd(value)} 比索`; }
  phpCny(value: number) { return `人民币预计约 ${Math.round(value / this.phpPerCny).toLocaleString('zh-CN')} 元`; }
  private nextSunday() {
    const now = new Date();
    now.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  calculateQuote(): void { this.quoteCalculated = true; }
  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();
    const targetElement = document.getElementById(target);
    if (!targetElement) return;
    const headerOffset = window.innerWidth <= 680 ? 132 : 92;
    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`);
  }

}
