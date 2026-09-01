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
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface CourseFee { id: string; name: string; tuition: number; suitable: string; }
interface RoomFee { id: string; name: string; fee: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; quantity: number; total: number; excluded?: boolean; }
interface SideNavItem { label: string; target: string; icon: string; }

@Component({
  selector: 'app-bcebu-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bcebu-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './bcebu-school.component.css',
  ],
})
export class BCebuSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolNames = ["菲律宾宿务B'Cebu语言学校", "BECI B'Cebu", "B'Cebu"];
  private readonly shortTermRatios: Record<number, number> = { 1: 0.4, 2: 0.6, 3: 0.8 };
  private readonly courseFeeOrder = [
    'speed-esl', 'intensive-esl', 'ielts', 'ielts-sparta', 'ielts-guarantee', 'b-sparta',
    'business-english', 'junior-esl', 'lite-esl4', 'lite-esl2-40-plus', 'kindergarten',
  ];
  private readonly roomFeeOrder = [
    'single-newtown-view', 'single-garden-view', 'double', 'double-living-room',
    'family-triple-extra-bed', 'two-plus-one', 'triple-bunk',
  ];

  registrationFee = 100;
  readonly sidaDiscountRate = 0.9;
  readonly offSeasonRate = 0.85;
  readonly reporterDiscountPerWeek = 25;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48];
  selectedWeeks = 4;
  selectedCourseId = 'speed-esl';
  selectedRoomId = 'triple-bunk';
  selectedStartDate = '2026-09-07';
  includeReporterActivity = false;
  includeAirportPickup = false;
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '地区', value: '宿务 / 麦克坦', note: '房型资料包含马克坦新城与校内花园方向' },
    { icon: 'school', label: '课程', value: 'ESL / IELTS / Business', note: '另有Junior、40岁以上轻量课与幼儿园' },
    { icon: 'rule', label: '学习强度', value: '弹性到斯巴达', note: "Speed ESL、Intensive、IELTS Sparta与B'SPARTA可选" },
    { icon: 'family_restroom', label: '年龄方向', value: '3岁起 / 成人 / 亲子', note: '课程与房型均需按年龄和同行关系确认' },
    { icon: 'bed', label: '住宿', value: '单人至三人房', note: '另有客厅套房、亲子加床和2+1房型' },
    { icon: 'percent', label: '短期比例', value: '40% / 60% / 80%', note: '对应1周 / 2周 / 3周' },
  ];

  courseFees: CourseFee[] = [
    { id: 'speed-esl', name: 'Speed ESL', tuition: 900, suitable: '4节一对一 + 2节小组课 + 2节晚课（选修）' },
    { id: 'intensive-esl', name: 'Intensive ESL', tuition: 1050, suitable: '6节一对一 + 2节晚课（选修）' },
    { id: 'ielts', name: 'IELTS', tuition: 1000, suitable: '4节一对一 + 2节团体课 + 1节选修早课 + 2节模拟测试（选修）' },
    { id: 'ielts-sparta', name: 'IELTS Sparta', tuition: 1050, suitable: '强制早课、模拟测试与自习；22:00结束' },
    { id: 'ielts-guarantee', name: 'IELTS GUARANTEE', tuition: 1150, suitable: '4节一对一 + 2节团体课 + 1节早课 + 2节模拟测试；需提交雅思成绩，12周起报' },
    { id: 'b-sparta', name: "B'SPARTA", tuition: 1050, suitable: '按2026价目表：5节一对一 + 2节小组课 + 3节强制晚课 + 2小时强制自习' },
    { id: 'business-english', name: '商务英语', tuition: 1050, suitable: '4节一对一 + 2节小组课 + 2节必修课' },
    { id: 'junior-esl', name: 'Junior ESL', tuition: 1250, suitable: '6节一对一；适合6-16岁' },
    { id: 'lite-esl4', name: 'Lite ESL4', tuition: 750, suitable: '4节一对一；适合慢节奏学习' },
    { id: 'lite-esl2-40-plus', name: 'Lite ESL2（40岁以上）', tuition: 400, suitable: '2节一对一；仅适用于40岁以上学生' },
    { id: 'kindergarten', name: '幼儿园', tuition: 950, suitable: '08:30-12:20 / 13:30-17:00；适合3-6岁' },
  ];

  roomFees: RoomFee[] = [
    { id: 'single-newtown-view', name: '单人间外景（马克坦新城）', fee: 1400, note: '50岁以上学生只能选择单人间' },
    { id: 'single-garden-view', name: '单人间内景（校内花园）', fee: 1350, note: '50岁以上学生只能选择单人间' },
    { id: 'double', name: '双人间', fee: 950, note: '标准双人房' },
    { id: 'double-living-room', name: '双人间+客厅', fee: 1250, note: '仅限夫妻、兄弟姐妹或同行朋友共同报名，不接受个人入住' },
    { id: 'family-triple-extra-bed', name: '双人间+客厅（加床亲子3人）', fee: 1000, note: '亲子三人入住参考房型' },
    { id: 'two-plus-one', name: '2+1宿舍（上下铺）', fee: 900, note: '只限女生，仅在淡季开放' },
    { id: 'triple-bunk', name: '三人间（上下铺）', fee: 750, note: '周六下午4点后可免费入住' },
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
    const databaseCourses = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => ({
        id: this.createCourseId(lesson.name), name: lesson.name, tuition: lesson.price,
        suitable: lesson.description || lesson.note || '请联系顾问确认课程安排',
      }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourses.length > 0) {
      this.courseFees = databaseCourses;
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees[0].id;
    }

    const databaseRooms = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRooms.length > 0) {
      this.roomFees = databaseRooms;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'triple-bunk')?.id ?? this.roomFees[0].id;
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
  }

  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[0]; }
  get billingMultiplier(): number { return this.shortTermRatios[this.selectedWeeks] ?? (this.selectedWeeks / 4); }
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * this.billingMultiplier; }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * this.billingMultiplier; }
  get courseAndRoomBase(): number { return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get isAdultCourse(): boolean { return !['junior-esl', 'kindergarten'].includes(this.selectedCourseId); }
  get isOffSeasonEntry(): boolean {
    return this.isDateBetween(this.selectedStartDate, '2026-02-16', '2026-06-29') ||
      this.isDateBetween(this.selectedStartDate, '2026-08-17', '2026-12-28');
  }
  get offSeasonEligible(): boolean { return this.isAdultCourse && this.isOffSeasonEntry; }
  get reporterEligible(): boolean {
    return this.isAdultCourse && this.selectedWeeks >= 4 &&
      this.isDateBetween(this.selectedStartDate, '2026-08-17', '2026-12-28');
  }
  get reporterDiscount(): number {
    return this.includeReporterActivity && this.reporterEligible
      ? this.reporterDiscountPerWeek * this.selectedWeeks
      : 0;
  }
  get baseAfterReporter(): number { return Math.max(0, this.courseAndRoomBase - this.reporterDiscount); }
  get offSeasonDiscountAmount(): number {
    return this.offSeasonEligible ? this.baseAfterReporter * (1 - this.offSeasonRate) : 0;
  }
  get baseAfterOffSeason(): number { return this.baseAfterReporter - this.offSeasonDiscountAmount; }
  get sidaDiscountAmount(): number { return this.baseAfterOffSeason * (1 - this.sidaDiscountRate); }
  get registrationDiscount(): number { return this.registrationFee; }
  get longStayDiscount(): number {
    if (this.selectedWeeks < 8) return 0;
    if (this.selectedWeeks === 8) return 50;
    return 100 + Math.floor((this.selectedWeeks - 12) / 4) * 100;
  }
  get quoteUsd(): number {
    return Math.max(0, this.baseAfterOffSeason * this.sidaDiscountRate - this.longStayDiscount);
  }
  get quoteUsdText(): string { return `USD ${this.formatUsd(this.quoteUsd)}`; }
  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    return `约 ${rounded.toLocaleString('zh-CN')} 元`;
  }
  get exchangeRateText(): string {
    return this.exchangeRateLive && this.exchangeRateDate
      ? `汇率日期 ${this.exchangeRateDate}`
      : '暂按备用汇率估算';
  }
  get billingRuleText(): string {
    const percentage = this.shortTermRatios[this.selectedWeeks];
    return percentage
      ? `${this.selectedWeeks}周按4周课程费和住宿费的${percentage * 100}%计算`
      : `${this.selectedWeeks}周按4周价格的${this.billingMultiplier}倍计算`;
  }

  get localFeePeriods(): number { return Math.max(1, Math.ceil(this.selectedWeeks / 4)); }
  get visaExtensionCount(): number { return Math.max(0, Math.ceil((this.selectedWeeks - 4) / 4)); }
  get roomDeposit(): number { return this.selectedWeeks <= 4 ? 3000 : 5000; }
  get localFees(): LocalFee[] {
    const periods = this.localFeePeriods;
    const acrQuantity = this.selectedWeeks > 8 ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', amount: 'PHP 7,800 / 次', quantity: 1, total: 7800, note: '移民局收取；续费或换校需重新办理' },
      { item: 'SSP E-CARD', amount: 'PHP 4,500 / 次', quantity: 1, total: 4500, note: '入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I CARD 外国人身份证', amount: 'PHP 4,000 / 次', quantity: acrQuantity, total: 4000 * acrQuantity, note: '长周期学习或首次续签时通常需要办理' },
      { item: '维护管理费', amount: 'PHP 2,000 / 4周', quantity: periods, total: 2000 * periods, note: '校内教学楼及其他设施维护费' },
      { item: '水电费', amount: 'PHP 4,000 / 4周', quantity: periods, total: 4000 * periods, note: '按每4周计算' },
      { item: '签证续签', amount: 'PHP 5,130 / 次', quantity: this.visaExtensionCount, total: 5130 * this.visaExtensionCount, note: '首次续签预估；后续金额按移民局及停留时长调整' },
      { item: '教材费', amount: 'PHP 2,000 / 4周', quantity: periods, total: 2000 * periods, note: '按课程和实际购买教材调整' },
      { item: '学生证', amount: 'PHP 200 / 次', quantity: 1, total: 200, note: '一次性费用' },
      { item: '宿务机场团体接机', amount: 'PHP 1,000 / 次', quantity: this.includeAirportPickup ? 1 : 0, total: this.includeAirportPickup ? 1000 : 0, note: '可选；工作日接机PHP 1,500，默认不计入合计', excluded: true },
      { item: '房间押金', amount: `PHP ${this.roomDeposit.toLocaleString('en-US')} / 次`, quantity: 1, total: this.roomDeposit, note: '1-4周PHP 3,000；5周以上暂按PHP 5,000估算；无欠费或损坏时可退', excluded: true },
    ];
  }
  get localFeesTotal(): number {
    return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0);
  }
  get localFeesCnyText(): string {
    return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`;
  }

  get quoteImageData() {
    const includedFees = this.localFees.filter((fee) => !fee.excluded);
    const optionalFees = this.localFees.filter((fee) => fee.excluded);
    return buildPhilippinesDetailedQuote({
      schoolCode: "B'CEBU",
      schoolName: "菲律宾宿务B'Cebu语言学校",
      filePrefix: 'BCEBU',
      heroSrc: '/assets/philippines/bcebu-campus-hero.webp',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems: [
        { icon: '注', label: '注册费', amount: '0 美元', note: `原价USD ${this.formatUsd(this.registrationFee)}，通过思达报名全免`, accent: true },
        { icon: '课', label: '课程费', amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`, note: `${this.selectedCourse.name}；以上单价以4周为基准` },
        { icon: '宿', label: '住宿费', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`, note: this.selectedRoom.name },
        { icon: '淡', label: '活动及淡季优惠', amount: `- ${this.formatUsd(this.reporterDiscount + this.offSeasonDiscountAmount)} 美元`, note: `记者活动减USD ${this.formatUsd(this.reporterDiscount)}；成人淡季减USD ${this.formatUsd(this.offSeasonDiscountAmount)}` },
        { icon: '折', label: '思达折扣', amount: '9折', note: `淡季后课程住宿费用再优惠${this.formatUsd(this.sidaDiscountAmount)}美元`, accent: true },
        { icon: '长', label: '长周期优惠', amount: `- ${this.formatUsd(this.longStayDiscount)} 美元`, note: '8/12/16/20/24周分别优惠USD 50/100/200/300/400，可叠加' },
      ],
      localFeeItems: includedFees.map((fee) => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal,
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: '接机和可退房间押金单独列示；未成年监护管理费金额需按年龄向学校确认。',
      optionalFeeItems: optionalFees.map((fee) => ({ label: fee.item, amount: this.formatPhp(fee.total), note: fee.note })),
      ruleNotes: [
        '思达免USD 100注册费，并在符合条件的淡季优惠后对课程住宿费再打9折。',
        `记者活动优惠${this.reporterDiscount > 0 ? `已计入USD ${this.formatUsd(this.reporterDiscount)}` : '未计入'}；长期优惠可叠加。`,
      ],
    });
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

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }
  formatPhp(value: number): string { return `PHP ${value.toLocaleString('en-US')}`; }
  private isDateBetween(value: string, start: string, end: string): boolean { return value >= start && value <= end; }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private createCourseId(name: string): string {
    if (name === '商务英语') return 'business-english';
    if (name === '幼儿园') return 'kindergarten';
    if (name.includes('Lite ESL2')) return 'lite-esl2-40-plus';
    if (name === "B'SPARTA") return 'b-sparta';
    return this.slugifyPriceKey(name);
  }
  private createRoomId(name: string): string {
    if (name.includes('单人间外景')) return 'single-newtown-view';
    if (name.includes('单人间内景')) return 'single-garden-view';
    if (name === '双人间') return 'double';
    if (name.includes('加床亲子')) return 'family-triple-extra-bed';
    if (name.includes('双人间+客厅')) return 'double-living-room';
    if (name.includes('2+1')) return 'two-plus-one';
    if (name.includes('三人间')) return 'triple-bunk';
    return this.slugifyPriceKey(name);
  }
}
