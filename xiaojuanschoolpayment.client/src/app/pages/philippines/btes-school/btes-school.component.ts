import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import {
  BTES_ALL_IN_ONE_END,
  BTES_ALL_IN_ONE_START,
  BTES_COURSES,
  BTES_HOLIDAYS_2026,
  BTES_LOW_SEASON_PERIODS,
  BTES_PHP_PER_CNY,
  BTES_REGISTRATION_FEE,
  BTES_ROOMS,
  BTES_SIDA_DISCOUNT_RATE,
  BTES_WEEK_OPTIONS,
  BtesRoom,
} from './btes-pricing';
import { BtesStudentQuote } from './btes-student-quote';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '生活';

interface GalleryImage {
  category: Exclude<GalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
}

interface InfoCard {
  icon?: string;
  label?: string;
  value?: string;
  title?: string;
  text?: string;
}

interface SideNavItem {
  label: string;
  target: string;
  icon: string;
}

@Component({
  selector: 'app-btes-school',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    SidaWhySectionComponent,
    SchoolQuotePlanComponent,
    QuoteImageDownloadButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './btes-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../philippines-local-fee-table.css',
    '../../../components/school-group-quote.css',
    './btes-school.component.css',
  ],
})
export class BtesSchoolComponent implements OnInit {
  private readonly exchangeRateService = inject(ExchangeRateService);

  readonly courses = BTES_COURSES;
  readonly rooms = BTES_ROOMS;
  readonly roomOptions = this.rooms.filter((room) => !room.walkIn);
  readonly weekOptions = BTES_WEEK_OPTIONS;
  readonly registrationFee = BTES_REGISTRATION_FEE;
  readonly sidaDiscountRate = BTES_SIDA_DISCOUNT_RATE;
  readonly lowSeasonPeriods = BTES_LOW_SEASON_PERIODS;
  readonly holidays = BTES_HOLIDAYS_2026;

  readonly students: BtesStudentQuote[] = [new BtesStudentQuote(this)];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  quoteCalculated = false;

  usdToCny = 7.2;
  readonly phpPerCny = BTES_PHP_PER_CNY;
  exchangeRateDate = '';
  usingLiveExchangeRate = false;

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'BTES独立校区', description: '位于宿务市Kasambagan生活圈，上课、住宿和主要生活设施集中。', src: '/assets/philippines/btes/campus-gate.webp' },
    { category: '校园', title: '校园建筑与活动区', description: '市区一体校园，减少日常通勤，适合第一次独立海外学习。', src: '/assets/philippines/btes/campus-building.webp' },
    { category: '校园', title: '一楼大厅', description: '新生报到、学生服务和校内公告的主要公共区域。', src: '/assets/philippines/btes/campus-lobby.webp' },
    { category: '教室', title: '一对一课堂', description: '课程以客制化一对一训练为核心，按课程安排4至8节一对一。', src: '/assets/philippines/btes/one-to-one-class.webp' },
    { category: '教室', title: '教学区', description: '学校资料列有120间一对一教室与12间团体教室。', src: '/assets/philippines/btes/classroom-hall.webp' },
    { category: '住宿', title: '单人房', description: '独立空间，住宿费1,000美元／4周。', src: '/assets/philippines/btes/single-room.webp' },
    { category: '住宿', title: '双人房', description: '住宿费800美元／4周；部分房间窗户朝走廊，须按实际空房确认。', src: '/assets/philippines/btes/double-room.webp' },
    { category: '住宿', title: '三人房', description: '住宿费750美元／4周；房内有一张上下铺。', src: '/assets/philippines/btes/triple-room.webp' },
    { category: '住宿', title: '四人房', description: '住宿费650美元／4周，是2026价目表中最低的校内房型。', src: '/assets/philippines/btes/quad-room.webp' },
    { category: '生活', title: '室内游泳池', description: '学校设有两座室内游泳池，并有羽毛球、桌球和撞球等设施。', src: '/assets/philippines/btes/indoor-pool.webp' },
    { category: '生活', title: '健身房', description: '校内健身与休闲设施，让学习以外的生活更集中。', src: '/assets/philippines/btes/fitness-room.webp' },
    { category: '生活', title: '教师团队', description: '学校资料说明教师需具备教师证照或教学相关背景，并接受持续培训。', src: '/assets/philippines/btes/teacher-team.webp' },
  ];

  readonly quickInfo: InfoCard[] = [
    { icon: 'location_city', label: '学校位置', value: '宿务市 Kasambagan', text: '市区独立校园，距机场约12公里，公开资料参考车程约30分钟。' },
    { icon: 'calendar_month', label: '创立年份', value: '2022年', text: '校舍面积约5,888平方米，教学与住宿区域约3,120平方米。' },
    { icon: 'groups', label: '学校规模', value: '约220人', text: '学校资料列有120间一对一教室、12间团体教室及80间宿舍。' },
    { icon: 'record_voice_over', label: '课程强度', value: '每日4-8节', text: '从Chill轻量课程到Talkative八节一对一，成人、考试和亲子路线齐全。' },
    { icon: 'family_restroom', label: '最低年龄', value: '5岁', text: '5-9岁与10-14岁分别使用Junior课程；低龄入学须同步确认监护安排。' },
    { icon: 'payments', label: '2026公开价格', value: '美元＋比索', text: '课程住宿以美元计，当地费用以菲律宾比索计；走读按每周课程费计算。' },
  ];

  readonly basicInfo = [
    { label: '学校名称', value: 'BTES English Academy / Brainy Tutelage English School' },
    { label: '位置', value: '菲律宾宿务市 Kasambagan' },
    { label: '认证', value: '学校资料列TESDA、宿务政府商业许可、消防安全检查及市卫生许可。' },
    { label: '课程', value: 'General ESL、Junior、Parents、TOEIC、IELTS、Business English及限时ALL IN ONE套餐。' },
    { label: '住宿', value: '单人、双人、三人及四人校内宿舍；也可选择走读（Walk-in）。' },
    { label: '设施', value: '食堂、健身房、桌球、撞球、羽毛球、篮球、室内游泳池、自习室、医护室及校区Wi-Fi。' },
  ];

  readonly highlights: InfoCard[] = [
    { title: '一对一课量从4节到8节', text: 'Chill适合轻量学习，Speak Up较均衡，Speak More增加个别训练，Talkative则把每日8节全部安排为一对一。' },
    { title: '成人、考试与亲子路线齐全', text: 'TOEIC与IELTS分预备及正规班；Junior按5-9岁与10-14岁分组，家长可选择Parents / Guardian课程。' },
    { title: '住宿型与走读型分开计费', text: '住宿型按课程和房型组合计算；走读就是Walk-in，只收课程及适用当地费用，不计宿舍、水费、管理费和电费。' },
  ];

  readonly suitableFor: InfoCard[] = [
    { title: '重视一对一课量与价格透明', text: '课程、住宿、短期比例和当地费用均有2026正式价目，可按周数拆分核算。' },
    { title: '希望住在宿务市区一体校园', text: '学习、住宿、餐厅和休闲设施集中，不需要每天跨区通勤。' },
    { title: '亲子、青少年或家长同行', text: 'Junior和Parents课程可分别安排，报价器会按每位学生年龄和房型检查。' },
  ];

  readonly lessSuitableFor: InfoCard[] = [
    { title: '想住海边度假村型校园', text: 'BTES是宿务市区校，不是麦克坦海滨度假型学校。' },
    { title: '不想遵守门禁和外宿申报', text: '平日及周日门禁23:00，周五、周六及假日前一日01:00；外宿旅行须按校规申请。' },
    { title: '要求节假日一定补课', text: '2026入学指南明确：按菲律宾政府公告的国定假日放假，不另行补课。' },
  ];

  readonly scheduleItems = [
    { time: '07:00-08:00', title: '早餐', text: '平日早餐时段；假日用餐时间以校内公告为准。' },
    { time: '08:00-12:25', title: '上午课程', text: '每节45分钟、课间10分钟；按个人课表安排一对一或团体课。' },
    { time: '12:25-14:05', title: '午餐与休息', text: '午餐后安排休息，再进入下午课程。' },
    { time: '14:15-17:45', title: '下午课程', text: '第6至第9节课；实际节数按Chill、Speak Up、Speak More等课程决定。' },
    { time: '18:00-19:00', title: '晚餐', text: '校内食堂供餐；课程、用餐和设施开放以学校当期安排为准。' },
  ];

  readonly additionalNights = [
    { room: '单人房', fee: 2000 }, { room: '双人房', fee: 1800 },
    { room: '三人房', fee: 1500 }, { room: '四人房', fee: 1500 },
  ];

  readonly faqs: InfoCard[] = [
    { title: 'Walk-in是什么意思？', text: 'Walk-in在本页统一翻译为“走读”：学生只到校上课，不住学校宿舍。走读课程按2026走读价目表的每周学费计算。' },
    { title: '1、2、3周怎么收费？', text: '住宿型课程与住宿分别按对应4周价的40%、65%、85%计算；4周以上按4周价÷4×实际周数。走读按官方每周课程费×周数。' },
    { title: '淡季优惠怎样判断？', text: '课程和住宿须完整落在学校公布的淡季就学期间。个人3周减25%，个人4周及以上减30%；3人以上同时报名、同时入学及结业减40%，三档不叠加。' },
    { title: '思达95折会和淡季优惠一起计算吗？', text: '会。普通方案先计算BTES个人或团体淡季优惠，再对优惠后的课程费与住宿费计算思达95折；只有1,000美元ALL IN ONE套餐不再计算95折。' },
    { title: '节假日停课会补课吗？', text: '学校2026入学指南写明，政府公告国定假日放假且不另行补课；临时调整以校内公告为准。' },
  ];

  readonly sideNavItems: SideNavItem[] = [
    { label: '学校亮点', target: 'highlights', icon: 'stars' },
    { label: '课程住宿', target: 'courses', icon: 'payments' },
    { label: '费用报价', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'receipt_long' },
    { label: '淡季优惠', target: 'promotions', icon: 'sell' },
    { label: '校历与规则', target: 'holidays', icon: 'event_busy' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '图片', target: 'gallery', icon: 'photo_library' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'local-fees', icon: 'receipt_long' },
  ];

  ngOnInit(): void { this.loadExchangeRate(); }

  private loadExchangeRate(): void {
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((rates) => {
      if (rates.usdToCny <= 0) return;
      this.usdToCny = rates.usdToCny;
      this.exchangeRateDate = rates.date;
      this.usingLiveExchangeRate = true;
    });
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get courseFeeRows() { return this.courses.filter((course) => !course.allInOne); }
  get walkInCourseRows() { return this.courses.filter((course) => !course.allInOne); }

  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = Number(value);
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new BtesStudentQuote(this));
    }
  }

  setQuoteMode(value: 'single' | 'group') {
    this.quoteMode = value;
    if (value === 'group') this.studentCount = this.requestedStudentCount;
  }

  get activeStudents() {
    return this.quoteMode === 'single'
      ? this.students.slice(0, 1)
      : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2)));
  }

  groupDiscountRate(student: BtesStudentQuote): number {
    if (this.quoteMode !== 'group' || this.activeStudents.length < 3 || student.isAllInOne || !student.promotionPeriod) return 0;
    const start = this.activeStudents[0].firstCourseStart;
    const end = this.activeStudents[0].lastCourseEnd;
    const allEligible = this.activeStudents.every((candidate) =>
      !candidate.isAllInOne && !!candidate.promotionPeriod
      && candidate.firstCourseStart === start && candidate.lastCourseEnd === end);
    return allEligible ? 0.4 : 0;
  }

  get selectedWeeks() { return this.activeStudents[0]?.quotePlan.courseWeeks ?? 4; }
  get quoteStartDate() { return this.activeStudents.map((student) => student.firstCourseStart).filter(Boolean).sort()[0] ?? ''; }
  get quoteBeforeDiscounts() {
    return this.activeStudents.reduce((sum, student) => sum + student.registration + student.tuition + student.accommodation + student.minorCareFee, 0);
  }
  get totalDiscountAmount() {
    return this.activeStudents.reduce((sum, student) => sum + student.registrationDiscount + student.btesDiscount + student.sidaDiscount, 0);
  }
  get quoteUsd() { return this.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0); }
  get quoteUsdText() { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText() { return `人民币预计金额：约 ${Math.round(this.quoteUsd * this.usdToCny).toLocaleString('zh-CN')} 元`; }
  get quoteHeading() { return this.quoteMode === 'single' ? `BTES ${this.selectedWeeks}周报价` : `BTES ${this.activeStudents.length}人报价`; }

  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) {
      return '多人报价人数请选择2-20人的整数。';
    }
    const index = this.activeStudents.findIndex((student) => !!student.quoteError);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quoteError}`;
  }

  get schoolPaymentItems(): QuoteImagePaymentItem[] {
    return [
      {
        icon: '注', label: '注册费', amount: `${this.formatUsd(this.activeStudents.length * this.registrationFee)} 美元`,
        note: '一次性100美元／人；老学员免费，ALL IN ONE套餐已经包含。',
      },
      ...this.planPaymentItems,
      ...groupPaymentLines(this.activeStudents, false),
    ];
  }

  get planPaymentItems(): QuoteImagePaymentItem[] {
    const courseItems = this.activeStudents.flatMap((student, studentIndex) => [...student.quotePlan.courses]
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((row, rowIndex) => {
        const course = student.course(row.optionId);
        return {
          icon: '课',
          label: `${this.quoteMode === 'group' ? `学生${studentIndex + 1} · ` : ''}${course?.allInOne ? 'ALL IN ONE套餐' : `课程名称${student.quotePlan.courses.length > 1 ? rowIndex + 1 : ''}`}`,
          amount: `${this.formatUsd(student.quotePlan.price('course', row))} 美元`,
          detailTitle: course ? `${course.name}｜${course.chineseName}` : '请选择课程',
          detailSubtitle: `${row.startDate.replace(/-/g, '/')}–${student.quotePlan.end(row).replace(/-/g, '/')} · ${row.weeks}周`,
          note: course?.allInOne ? '固定四周1,000美元全包套餐；四人房及海报列明费用已包含。' : course?.lessons ?? '',
        };
      }));

    const roomItems = this.activeStudents.flatMap((student, studentIndex) => [...student.quotePlan.rooms]
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((row, rowIndex) => {
        const room = student.room(row.optionId);
        const pairedCourse = student.quotePlan.courses.find((courseRow) => courseRow.startDate === row.startDate && courseRow.weeks === row.weeks);
        const included = pairedCourse ? student.course(pairedCourse.optionId)?.allInOne : false;
        return {
          icon: room?.walkIn ? '走' : '宿',
          label: `${this.quoteMode === 'group' ? `学生${studentIndex + 1} · ` : ''}${room?.walkIn ? '走读安排' : `住宿名称${student.quotePlan.rooms.length > 1 ? rowIndex + 1 : ''}`}`,
          amount: included ? '已包含' : `${this.formatUsd(student.quotePlan.price('room', row))} 美元`,
          detailTitle: room?.name ?? '请选择住宿或走读',
          detailSubtitle: `${row.startDate.replace(/-/g, '/')}–${student.quotePlan.end(row).replace(/-/g, '/')} · ${row.weeks}周`,
          note: included ? '四人房已包含在ALL IN ONE套餐总价内。' : room?.note ?? '',
        };
      }));
    return [...courseItems, ...roomItems];
  }

  get estimatedLocalFees() { return groupLocalFees(this.activeStudents); }
  get estimatedLocalFeeTotal() { return this.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0); }
  get estimatedLocalFeeCny() { return Math.round(this.estimatedLocalFeeTotal / this.phpPerCny); }
  get localFeeIntro() {
    return '当地费用按每名学生的完整停留、30/59天旅游签证、住宿房型和接机选择自动估算。ALL IN ONE套餐已包含的项目保留为0行说明；可退押金与额外住宿参考不计入合计。';
  }

  get optionalFeeItems() {
    const deposit = this.activeStudents.length * 2000;
    const cny = (value: number) => `约人民币 ${Math.round(value / this.phpPerCny).toLocaleString('zh-CN')} 元`;
    return [
      {
        label: '学校押金（可退）', amount: this.formatPhp(deposit), cnyAmount: cny(deposit),
        note: `2,000比索／人 × ${this.activeStudents.length}人；毕业前按学校检查和扣费规则退还，不计入当地费用合计。`,
      },
      {
        label: '额外住宿一晚参考', amount: '单人2,000／双人1,800／三人及四人1,500比索', cnyAmount: '按实际夜数结算',
        note: '仅在学校有空房时安排，包含餐食、宿舍管理及电费；标准入住周日、退房周六，入住14:00、退房12:00。',
      },
      {
        label: '额外电量与其他损坏', amount: '按实际发生', cnyAmount: '不计入预估合计',
        note: '每周用电超过20kW的部分按25比索／kW；财物损坏等费用可从押金中扣除。',
      },
    ];
  }

  get priceYearWarnings() {
    return [...new Set(this.activeStudents.map((student, index) => student.priceYearWarning
      ? `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.priceYearWarning}` : '').filter(Boolean))];
  }

  get exchangeRateSummary() {
    const dollarRate = this.usingLiveExchangeRate && this.exchangeRateDate
      ? `美元按${this.exchangeRateDate.replace(/-/g, '/')}参考汇率`
      : '美元按备用参考汇率';
    return `${dollarRate}1美元≈${this.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元人民币；当地费按1元人民币≈${this.phpPerCny}比索参考。`;
  }

  get fourWeekStartingText() { return '1,000 美元'; }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  calculateQuote(): void { if (!this.quoteError) this.quoteCalculated = true; }
  applyAllInOneOffer(): void {
    this.setQuoteMode('single');
    const student = this.students[0];
    const currentStart = student.quotePlan.courses[0]?.startDate ?? '';
    const candidate = { id: 0, optionId: 'all-in-one', weeks: 4, startDate: currentStart };
    const currentTimestamp = student.quotePlan.date(currentStart);
    const eligibleCurrentStart = currentTimestamp !== null
      && new Date(currentTimestamp).getUTCDay() === 0
      && currentStart >= BTES_ALL_IN_ONE_START
      && student.quotePlan.end(candidate) <= BTES_ALL_IN_ONE_END;
    const startDate = eligibleCurrentStart ? currentStart : BTES_ALL_IN_ONE_START;
    const courseId = student.quotePlan.courses[0]?.id ?? 1;
    const roomId = student.quotePlan.rooms[0]?.id ?? 2;

    student.quotePlan.courses.splice(0, student.quotePlan.courses.length, {
      id: courseId, optionId: 'all-in-one', weeks: 4, startDate,
    });
    student.quotePlan.rooms.splice(0, student.quotePlan.rooms.length, {
      id: roomId, optionId: 'quad', weeks: 4, startDate,
    });
    this.quoteCalculated = true;
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  get quoteImageData() {
    const paymentItems = [
      this.schoolPaymentItems[0],
      ...this.planPaymentItems,
      ...groupPaymentLines(this.activeStudents.map((student) => ({ paymentLines: student.applicablePaymentLines })), true),
    ];
    const warnings = this.activeStudents.flatMap((student, index) => student.quotePlan.warning
      ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.quotePlan.warning}`]
      : []);
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'BTES',
      schoolName: '菲律宾宿务BTES英语学校',
      filePrefix: 'BTES',
      heroSrc: '/assets/philippines/btes/campus-gate.webp',
      weeks: this.selectedWeeks,
      startDate: this.quoteStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
      paymentItems,
      localFeeItems: this.estimatedLocalFees.map((fee) => ({
        label: fee.item,
        unit: fee.unitLabel,
        quantity: this.formatFeeQuantity(fee.quantity),
        amount: this.formatPhp(fee.total),
        note: fee.note,
      })),
      localFeeTotal: this.estimatedLocalFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.estimatedLocalFeeCny,
      localFeeNote: this.localFeeIntro,
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: [],
    });
    const result = applySchoolQuoteImageLayout({
      ...quote,
      importantNotes: [
        ...warnings,
        ...this.priceYearWarnings,
        '住宿型1/2/3周分别按对应4周课程与住宿价的40%/65%/85%；4周以上按周比例；走读按每周课程价。',
        '淡季须完整就学于2026/01/30–06/13或2026/08/23–2027/01/16；个人3周75折、个人4周以上7折、3人以上同步入学结业6折，三档不叠加。',
        '普通方案先扣除BTES淡季优惠，再对优惠后的课程与住宿金额计算思达95折；只有1,000美元ALL IN ONE套餐不再计算95折。注册、未成年管理和当地费用不参与折扣。',
        '当地费用按2026正式价目与当前选择估算；最终以学校、移民局、空房及正式账单为准。',
      ],
    }, 'BTES', this.selectedWeeks, this.quoteStartDate, this.quoteUsd, this.usdToCny);
    return {
      ...result,
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${this.quoteStartDate.replace(/-/g, '')}.png`,
      conversionRates: {
        usdToCny: this.usdToCny,
        phpPerCny: this.phpPerCny,
        date: this.usingLiveExchangeRate ? this.exchangeRateDate : undefined,
      },
    };
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 2 });
  }
  formatPhp(value: number): string { return `${Math.round(value).toLocaleString('en-US')} 比索`; }
  formatFeeQuantity(value: number): string { return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }); }
  formatRoomFee(room: BtesRoom): string { return `${this.formatUsd(room.fee4w)} 美元／人／4周`; }
}
