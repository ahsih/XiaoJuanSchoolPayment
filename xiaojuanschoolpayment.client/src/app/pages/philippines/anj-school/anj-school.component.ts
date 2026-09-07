import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { applySchoolQuoteImageLayout, QuotePlanRow } from '../../../components/school-quote-plan';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import {
  ANJ_COURSES,
  ANJ_CONTINUATION_PERIODS,
  ANJ_NEW_PROMOTION_PERIODS,
  ANJ_PEAK_SEASON_RANGES,
  ANJ_PHP_PER_CNY,
  ANJ_REGISTRATION_FEE,
  ANJ_ROOMS,
  ANJ_SEASONAL_FEE_PER_WEEK,
  ANJ_SIDA_DISCOUNT_RATE,
  ANJ_WEEK_OPTIONS,
  AnjRoom,
} from './anj-pricing';
import { AnjStudentQuote } from './anj-student-quote';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿';

interface QuickInfo {
  icon: string;
  label: string;
  value: string;
  note: string;
}

interface GalleryImage {
  category: Exclude<GalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
}

interface BasicInfoRow {
  label: string;
  value: string;
}

interface TextCard {
  title: string;
  text: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
}

interface SideNavItem {
  label: string;
  target: string;
  icon: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-anj-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SidaWhySectionComponent, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './anj-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../philippines-local-fee-table.css',
    '../../../components/school-group-quote.css',
    './anj-school.component.css',
  ],
})
export class AnjSchoolComponent implements OnInit {
  private readonly exchangeRateService = inject(ExchangeRateService);
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly weekOptions = ANJ_WEEK_OPTIONS;
  readonly courses = ANJ_COURSES;
  readonly rooms = ANJ_ROOMS;
  readonly roomOptions = this.rooms;
  readonly newPromotionPeriods = ANJ_NEW_PROMOTION_PERIODS;
  readonly continuationPeriods = ANJ_CONTINUATION_PERIODS;
  readonly registrationFee = ANJ_REGISTRATION_FEE;
  readonly sidaDiscountRate = ANJ_SIDA_DISCOUNT_RATE;
  readonly seasonalFeePerWeek = ANJ_SEASONAL_FEE_PER_WEEK;
  readonly peakSeasonRanges = ANJ_PEAK_SEASON_RANGES;
  readonly students: AnjStudentQuote[] = [new AnjStudentQuote(this)];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  quoteCalculated = false;

  usdToCny = 7.2;
  readonly phpPerCny = ANJ_PHP_PER_CNY;
  exchangeRateDate = '';
  usingLiveExchangeRate = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'terrain',
      label: '学校定位',
      value: '碧瑶ECO Campus',
      note: 'A&J位于Baguio Irisan，主打自然型一体校园、住宿学习集中和英语沉浸生活。',
    },
    {
      icon: 'school',
      label: '主力课程',
      value: 'ESL / Test / Junior',
      note: 'Eco Relax Lite、Eco Relax Plus、Eco Hub、Eco Sparta，也有IELTS、TOEIC和Junior方向。',
    },
    {
      icon: 'record_voice_over',
      label: '课程特色',
      value: '一对一比例清楚',
      note: '从每天3节一对一到Eco Sparta 6节一对一，可按强度和体力选择。',
    },
    {
      icon: 'home_work',
      label: '住宿',
      value: 'Deluxe / Premium / Villa',
      note: '公开资料列Deluxe、Premium、Premium Studio、Suite和Eco Villa等住宿类别。',
    },
    {
      icon: 'forest',
      label: '生活设施',
      value: '健身房 / 高尔夫 / 咖啡厅',
      note: '校内有Dining Hall、Cafe、Eco Mart、Fitness Gym、Golf Driving Range和BBQ/Camping Zone。',
    },
    {
      icon: 'paid',
      label: '公开费用',
      value: '2026年美元费用',
      note: '本页按2026费用表估算，报名仍需以学校正式账单和空房回复为准。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'A&J Admin Building',
      description: '官方首页展示的Admin Building，是到校接待和学生服务中心。',
      src: 'https://www.anjedudc.com/assets/img/slider/Admin.jpg',
    },
    {
      category: '校园',
      title: 'Main Building',
      description: 'Main Building集中住宿与主要学习生活空间，适合希望上课住宿步行完成的学生。',
      src: 'https://www.anjedudc.com/assets/img/slider/Main-Building.webp',
    },
    {
      category: '住宿',
      title: 'Eco Villa',
      description: 'Eco Villa偏自然和家庭式住宿，适合想要更安静、更独立空间的学生或家庭。',
      src: 'https://www.anjedudc.com/assets/img/slider/Eco-Villa.jpg',
    },
    {
      category: '住宿',
      title: 'Suite Room',
      description: 'Premium与Suite房型预算更高，但舒适度和隐私度也更好。',
      src: 'https://www.anjedudc.com/assets/img/slider/Suite.webp',
    },
    {
      category: '教室',
      title: 'Man to Man Class',
      description: 'A&J课程以一对一为核心，适合开口、发音、写作和考试弱项逐项补强。',
      src: 'https://www.anjedudc.com/assets/img/slider/Man-to-Man.webp',
    },
    {
      category: '教室',
      title: 'Group Class',
      description: 'Eco Relax Plus、Eco Hub等课程加入团体课，帮助学生练习输出和互动表达。',
      src: 'https://www.anjedudc.com/assets/img/slider/Group-Class.webp',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾碧瑶A&J e-Edu English Academy' },
    { label: '英文名称', value: 'A&J e-Edu Academy / A&J e-Edu DC Academy ECO Campus' },
    { label: '地址', value: '001, BMI Compound, Purok 4 Irisan, Baguio, 2600 Benguet' },
    { label: '认证与合作', value: '官网列BESA、DOT、British Council、Immigration、TESDA、PECA等认证与伙伴。' },
    { label: '课程方向', value: 'ESL、IELTS、TOEIC、TOEFL、PTE、Guarantee Course、Junior、Working Holiday。' },
    { label: '设施', value: 'Admin Building、Main Building、Dining Hall、Cafe、Eco Mart、Fitness Gym、Golf Driving Range、Indoor Gymnasium、BBQ & Camping Zone。' },
    { label: '4周起价', value: '思达折后1,377.5美元起：Eco Relax Lite + Deluxe三人房，已免100美元注册费；当地比索费用另计。' },
  ];

  readonly highlights: TextCard[] = [
    {
      title: 'ECO Campus，一体式生活学习环境',
      text: '官网强调classes、dorms、dining和study spaces都在步行范围内，适合想把通勤和日常杂事压低的人。',
    },
    {
      title: '课程强度跨度大',
      text: 'Eco Relax Lite适合轻量口语，Eco Relax Plus加入团体课，Eco Hub可按Speaking Accelerator、Work Booster或Navigator方向聚焦，Eco Sparta则偏高强度。',
    },
    {
      title: '适合放进碧瑶“自然+学习”候选组',
      text: 'A&J不是市中心便利型小校，更像自然校园和集中生活路线，可和PINES、JIC、MONOL按学习强度与住宿偏好比较。',
    },
  ];

  readonly suitableFor: TextCard[] = [
    {
      title: '想在碧瑶安静环境长期学习',
      text: '自然型校园、校内住宿、餐厅和学习空间集中，适合4-24周ESL、考试或青少年学习安排。',
    },
    {
      title: '希望从低压ESL逐步加到强度课程',
      text: '可以从Eco Relax Lite/Plus开始，再按基础和目标转到Eco Hub、Eco Sparta或考试方向。',
    },
    {
      title: '家庭或青少年也在比较住宿环境',
      text: 'Premium、Suite、Studio和Eco Villa等房型选择较多，适合对住宿舒适度和校园配套有要求的人。',
    },
  ];

  readonly lessSuitableFor: TextCard[] = [
    {
      title: '必须住宿务或海边城市',
      text: 'A&J在碧瑶山城，不是宿务海岛路线。周末活动、机场交通和气候体验都要按Baguio逻辑看。',
    },
    {
      title: '只想看最低价',
      text: 'A&J的住宿差价明显，Premium、Suite或Villa会拉高总价，预算应同时看课程、房型和当地费用。',
    },
    {
      title: '不想遵守门禁和校园规则',
      text: '官网规则列出门禁、外宿/旅行申报、宿舍管理和违规则罚款，报名之前要确认自己能接受。',
    },
  ];

  readonly scheduleItems: ScheduleItem[] = [
    {
      time: '上午核心课',
      title: '一对一核心课',
      text: '按Eco Relax、Eco Hub或考试方向安排口说、听力、发音、语法、写作或弱项训练。',
    },
    {
      time: '日间团体课',
      title: '团体课与目标主题',
      text: 'Eco Relax Plus和Eco Hub加入团体课，帮助学生练习互动表达、商务或生活场景英语。',
    },
    {
      time: '晚间课程',
      title: '夜间课 / 单词测试',
      text: '部分课程可选，Eco Sparta和保证班方向会更严格；报名时要确认当前课程规则。',
    },
    {
      time: '周末',
      title: '活动、出行与规则',
      text: '周末可安排Baguio周边活动，但跨城市旅行需按学校规定提前提交waiver并保持联系。',
    },
  ];

  readonly faqs: TextCard[] = [
    {
      title: 'A&J是在宿务还是碧瑶？',
      text: 'A&J e-Edu Academy官网地址在Baguio, Benguet，本页放在碧瑶学校路线下。它适合和PINES、JIC、MONOL、WALES等碧瑶学校一起比较。',
    },
    {
      title: '页面报价包含所有费用吗？',
      text: '不包含全部当地费用。美元报价已自动计入思达免注册费、95折、A&J适用优惠和按入学日判定的旺季附加费；SSP、签证、教材、水电、接机等比索费用在下方单独估算，押金和洗衣不计入学杂费合计。',
    },
    {
      title: 'Eco Relax Lite和Eco Sparta怎么选？',
      text: 'Eco Relax Lite每天一对一课少，适合轻量ESL或陪读家长；Eco Sparta一对一课更多，夜课和词汇测试更严格，适合需要外部推动的人。',
    },
    {
      title: 'A&J适合亲子或青少年吗？',
      text: '有Junior课程和多种住宿类型，但实际可报名年龄、监护、房型、营队与普通课程规则要按当期学校回复确认。',
    },
  ];

  readonly sideNavItems: SideNavItem[] = [
    { label: '校区亮点', target: 'highlights', icon: 'stars' },
    { label: '课程费用', target: 'courses', icon: 'payments' },
    { label: '快速报价', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'receipt' },
    { label: '优惠规则', target: 'promotions', icon: 'sell' },
    { label: '资料来源', target: 'sources', icon: 'link' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '图片', target: 'gallery', icon: 'photo_library' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'local-fees', icon: 'receipt_long' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'A&J官方首页', url: 'https://www.anjedudc.com/' },
    { label: 'A&J官方ESL课程页', url: 'https://www.anjedudc.com/esl-course/' },
    { label: 'A&J官方保证班页', url: 'https://www.anjedudc.com/guarantee-course/' },
    { label: 'A&J官方TOEIC保证班页', url: 'https://www.anjedudc.com/toeic-guarantee/' },
    { label: 'A&J官方Junior课程页', url: 'https://www.anjedudc.com/junior-course/' },
    { label: 'A&J官方校园规则页', url: 'https://www.anjedudc.com/school-regulation/' },
    { label: 'A&J官方学生宿舍页', url: 'https://www.anjedudc.com/facilities/dormitory-rooms/' },
    { label: 'A&J官方其他费用与接机说明', url: 'https://www.anjedudc.com/additional-information/' },
    { label: 'Fujiyama A&J ECO Campus 2026费用参考', url: 'https://www.fujiyama-international.com/philippines/anj-eco.html' },
    { label: 'Cebu Buddy A&J ECO Campus费用参考', url: 'https://cebu-buddy.com/school/aj-eco/' },
  ];

  ngOnInit(): void {
    this.loadExchangeRate();
  }

  private loadExchangeRate(): void {
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((rates) => {
      if (rates.usdToCny <= 0) return;
      this.usdToCny = rates.usdToCny;
      this.exchangeRateDate = rates.date;
      this.usingLiveExchangeRate = true;
    });
  }

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') {
      return this.galleryImages;
    }

    return this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get courseFeeRows() {
    return this.courses.filter((course) => course.fee4w !== undefined).map((course) => ({
      course: course.name,
      tuition: `${this.formatUsd(course.fee4w ?? 0)} 美元`,
      lessons: course.lessons,
      suitable: course.suitable,
    }));
  }

  get guaranteeFeeRows() {
    return this.courses
      .filter((course) => course.feeByWeeks)
      .flatMap((course) => Object.entries(course.feeByWeeks ?? {}).map(([weeks, tuition]) => ({
        course: course.name,
        weeks: `${weeks}周`,
        tuition: `${this.formatUsd(tuition)} 美元`,
        lessons: course.lessons,
      })));
  }

  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = Number(value);
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new AnjStudentQuote(this));
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

  get selectedWeeks() { return this.activeStudents[0]?.quotePlan.courseWeeks ?? 4; }
  get quoteStartDate() { return this.activeStudents.map((student) => student.firstCourseStart).filter(Boolean).sort()[0] ?? ''; }
  get peakSeasonWeeks() { return this.activeStudents.reduce((sum, student) => sum + student.peakWeeks, 0); }
  get seasonalSurcharge() { return this.activeStudents.reduce((sum, student) => sum + student.seasonalSurcharge, 0); }
  get registrationDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.registrationDiscount, 0); }
  get regularDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.regularDiscount, 0); }
  get birthdayDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.birthdayDiscount, 0); }
  get lowSeasonDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.lowSeasonDiscount, 0); }
  get continuationDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.continuationDiscount, 0); }
  get sidaDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.sidaDiscount, 0); }
  get totalDiscountAmount() {
    return this.registrationDiscountAmount + this.regularDiscountAmount + this.birthdayDiscountAmount
      + this.lowSeasonDiscountAmount + this.continuationDiscountAmount + this.sidaDiscountAmount;
  }
  get quoteBeforeDiscounts() {
    return this.activeStudents.reduce((sum, student) => sum + student.registration + student.tuition + student.accommodation + student.seasonalSurcharge, 0);
  }
  get quoteUsd() { return this.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0); }
  get quoteUsdText() { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText() { return `人民币预计金额：约 ${Math.round(this.quoteUsd * this.usdToCny).toLocaleString('zh-CN')} 元`; }

  get quoteHeading() {
    return this.quoteMode === 'single'
      ? `A&J ${this.activeStudents[0].quotePlan.courseWeeks}周报价`
      : `A&J ${this.activeStudents.length}人报价`;
  }

  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) {
      return '多人报价人数请选择2–20人的整数。';
    }
    const index = this.activeStudents.findIndex((student) => !!student.quoteError);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quoteError}`;
  }

  get schoolPaymentItems(): QuoteImagePaymentItem[] {
    return [
      {
        icon: '注', label: '注册费', amount: `${this.formatUsd(this.activeStudents.length * this.registrationFee)} 美元`,
        note: `一次性费用，100美元／人；通过思达报名全部免收，本次原价共${this.formatUsd(this.activeStudents.length * this.registrationFee)}美元。`,
      },
      ...this.planPaymentItems,
      ...groupPaymentLines(this.activeStudents, false),
    ];
  }

  get planPaymentItems(): QuoteImagePaymentItem[] {
    const courseItems = this.activeStudents.flatMap((student, studentIndex) => [...student.quotePlan.courses]
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((row, rowIndex) => {
        const course = this.courses.find((item) => item.id === row.optionId);
        return {
          icon: '课',
          label: `${this.quoteMode === 'group' ? `学生${studentIndex + 1} · ` : ''}课程名称${student.quotePlan.courses.length > 1 ? rowIndex + 1 : ''}`,
          amount: `${this.formatUsd(student.quotePlan.price('course', row))} 美元`,
          detailTitle: course?.name ?? '请选择课程',
          detailSubtitle: `${row.startDate.replace(/-/g, '/')}–${student.quotePlan.end(row).replace(/-/g, '/')} · ${row.weeks}周`,
          note: course?.lessons ?? '',
        };
      }));

    const standardRoomItems = this.activeStudents.flatMap((student, studentIndex) => [...student.quotePlan.rooms]
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .filter((row) => this.room(row.optionId)?.priceMode === 'per-person')
      .map((row, rowIndex) => {
        const room = this.room(row.optionId);
        return {
          icon: '宿',
          label: `${this.quoteMode === 'group' ? `学生${studentIndex + 1} · ` : ''}住宿名称${student.quotePlan.rooms.length > 1 ? rowIndex + 1 : ''}`,
          amount: `${this.formatUsd(student.quotePlan.price('room', row))} 美元`,
          detailTitle: room?.name ?? '请选择房型',
          detailSubtitle: `${row.startDate.replace(/-/g, '/')}–${student.quotePlan.end(row).replace(/-/g, '/')} · ${row.weeks}周`,
          note: room?.note ?? '',
        };
      }));

    const sharedRoomItems = this.sharedRoomReservations.map((reservation) => ({
      icon: '宿',
      label: `${this.quoteMode === 'group' ? `学生${reservation.people.map((index) => index + 1).join('、')} · ` : ''}住宿名称`,
      amount: `${this.formatUsd(reservation.fullPrice)} 美元`,
      detailTitle: reservation.room.name,
      detailSubtitle: `${reservation.row.startDate.replace(/-/g, '/')}–${this.activeStudents[reservation.people[0]].quotePlan.end(reservation.row).replace(/-/g, '/')} · ${reservation.row.weeks}周`,
      note: `${reservation.room.note}；本行按整间总价计收一次。`,
    }));

    return [...courseItems, ...standardRoomItems, ...sharedRoomItems];
  }

  get estimatedLocalFees() { return groupLocalFees(this.activeStudents); }
  get estimatedLocalFeeTotal() { return this.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0); }
  get estimatedLocalFeeCny() { return Math.round(this.estimatedLocalFeeTotal / this.phpPerCny); }
  get localFeeIntro() { return '学杂费为到校后以比索支付的预估，按每名学生的签证、课程、住宿和接机分别计算；押金与洗衣服务另列，不计入合计。'; }

  get optionalFeeItems() {
    const standardDepositTotal = this.activeStudents.reduce((sum, student) => {
      const deposits = student.quotePlan.rooms
        .map((row) => this.room(row.optionId))
        .filter((room): room is AnjRoom => !!room && room.priceMode === 'per-person')
        .map((room) => room.deposit);
      return sum + (deposits.length ? Math.max(...deposits) : 0);
    }, 0);
    const sharedDepositTotal = this.sharedRoomReservations.reduce((sum, reservation) => sum + reservation.room.deposit, 0);
    const depositTotal = standardDepositTotal + sharedDepositTotal;
    const cny = (value: number) => `约人民币 ${Math.round(value / this.phpPerCny).toLocaleString('zh-CN')} 元`;
    return [
      {
        label: '住宿押金（可退）', amount: this.formatPhp(depositTotal), cnyAmount: cny(depositTotal),
        note: `Deluxe房型3,000比索，Premium、Suite及Villa房型5,000比索；整间总价房型按房间计一次。无损坏及额外扣费时按学校规定退还，不计入学杂费合计。`,
      },
      {
        label: '洗衣服务', amount: '按次支付', cnyAmount: '不计入预估合计',
        note: '洗衣加烘干150比索／7kg／次；只洗或只烘100比索／7kg／次，按实际使用支付。',
      },
    ];
  }

  get priceYearWarnings() {
    return [...new Set(this.activeStudents.map((student, index) => student.priceYearWarning
      ? `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.priceYearWarning}` : '').filter(Boolean))];
  }

  get exchangeRateSummary() {
    const dollarRate = this.usingLiveExchangeRate && this.exchangeRateDate
      ? `美元按${this.exchangeRateDate.replace(/-/g, '/')}参考汇率` : '美元按备用参考汇率';
    return `${dollarRate}1美元≈${this.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元人民币；当地费固定按1元人民币≈9比索参考。`;
  }

  get fourWeekStartingText() {
    return `${this.formatUsd((650 + 800) * this.sidaDiscountRate)} 美元`;
  }

  get ecoHubPremiumTwinText() {
    return `${this.formatUsd((850 + 1150) * this.sidaDiscountRate)} 美元`;
  }

  sharedRoomShare(student: AnjStudentQuote, row: QuotePlanRow, room: AnjRoom, fullPrice: number): number {
    const group = this.sharedRoomGroup(student, row, room);
    if (!group.length) return fullPrice;
    const position = group.findIndex((entry) => entry.student === student && entry.row === row);
    const totalCents = Math.round(fullPrice * 100);
    const baseCents = Math.floor(totalCents / group.length);
    const remainder = totalCents - baseCents * group.length;
    return (baseCents + (position >= 0 && position < remainder ? 1 : 0)) / 100;
  }

  sharedRoomFactor(student: AnjStudentQuote, row: QuotePlanRow, room: AnjRoom): number {
    const group = this.sharedRoomGroup(student, row, room);
    return group.length ? 1 / group.length : 1;
  }

  sidaDiscountShare(student: AnjStudentQuote, exactDiscount: number): number {
    const entries = this.activeStudents.map((candidate, index) => {
      const exact = Math.max(0, candidate.tuition + candidate.accommodation - candidate.fixedSchoolDiscounts)
        * (1 - this.sidaDiscountRate);
      return { candidate, index, exact, cents: Math.floor((exact + Number.EPSILON) * 100) };
    });
    const targetCents = Math.round(entries.reduce((sum, entry) => sum + entry.exact, 0) * 100);
    let remainder = targetCents - entries.reduce((sum, entry) => sum + entry.cents, 0);
    const priority = [...entries].sort((a, b) =>
      (b.exact * 100 - Math.floor(b.exact * 100)) - (a.exact * 100 - Math.floor(a.exact * 100)) || a.index - b.index);
    for (const entry of priority) {
      if (remainder-- <= 0) break;
      entry.cents += 1;
    }
    const allocation = entries.find((entry) => entry.candidate === student);
    return allocation ? allocation.cents / 100 : Math.round(exactDiscount * 100) / 100;
  }

  sharedRoomError(student: AnjStudentQuote, row: QuotePlanRow, room: AnjRoom): string {
    const matches = this.sharedRoomMatches(row, room);
    if (room.minOccupancy === 1) return '';
    if (matches.length % room.maxOccupancy === 0) return '';
    const missing = room.maxOccupancy - (matches.length % room.maxOccupancy);
    return `${room.name}按整间总价计算；还需${missing}名学生选择相同房型、周数和入住日期。`;
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    if (!this.quoteError) this.quoteCalculated = true;
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  get quoteImageData() {
    const paymentItems = [
      this.schoolPaymentItems[0],
      ...this.planPaymentItems,
      ...groupPaymentLines(this.activeStudents, true),
    ];
    const warnings = this.activeStudents.flatMap((student, index) => student.quotePlan.warning
      ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.quotePlan.warning}`]
      : []);
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'A&J',
      schoolName: '菲律宾碧瑶A&J语言学校',
      filePrefix: 'AJ',
      heroSrc: '/assets/philippines/anj-campus-hero.jpg',
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
        '普通课程和住宿仅提供4/8/12/16/20/24周报价；TOEIC及IELTS保分班只按各自固定周数报价。',
        '2026旺季为2026/06/28–08/22；2027按相同8周星期推算为2027/06/27–08/21，按实际重叠课程周每周加收40美元。',
        'A&J新生优惠与续课优惠互斥；固定优惠先扣减，再对剩余课程费和住宿费享思达95折。',
        '当地费用人民币统一按1元约9比索参考；最终以学校、移民局、空房和正式账单为准。',
      ],
    }, 'A&J', this.selectedWeeks, this.quoteStartDate, this.quoteUsd, this.usdToCny);
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

  formatDiscountTiers(discounts: Readonly<Partial<Record<number, number>>>): string {
    return this.weekOptions.map((weeks) => `${weeks}周减${discounts[weeks] ?? 0}美元`).join('、');
  }

  formatRoomFee(room: AnjRoom): string {
    return `${this.formatUsd(room.fee4w)} 美元${room.priceMode === 'per-room' ? '（整间总价）' : '／人'}`;
  }

  private room(id: string) { return this.roomOptions.find((room) => room.id === id); }

  private sharedRoomMatches(row: QuotePlanRow, room: AnjRoom) {
    return this.activeStudents.flatMap((student, studentIndex) => student.quotePlan.rooms
      .filter((candidate) => candidate.optionId === room.id && candidate.startDate === row.startDate && candidate.weeks === row.weeks)
      .map((candidate) => ({ student, studentIndex, row: candidate })));
  }

  private sharedRoomGroup(student: AnjStudentQuote, row: QuotePlanRow, room: AnjRoom) {
    const matches = this.sharedRoomMatches(row, room);
    const index = matches.findIndex((entry) => entry.student === student && entry.row === row);
    if (index < 0) return [];
    const start = Math.floor(index / room.maxOccupancy) * room.maxOccupancy;
    return matches.slice(start, start + room.maxOccupancy);
  }

  private get sharedRoomReservations() {
    const reservations: { room: AnjRoom; row: QuotePlanRow; people: number[]; fullPrice: number }[] = [];
    const seen = new Set<string>();
    this.activeStudents.forEach((student) => student.quotePlan.rooms.forEach((row) => {
      const room = this.room(row.optionId);
      if (!room || room.priceMode !== 'per-room') return;
      const group = this.sharedRoomGroup(student, row, room);
      const key = `${room.id}|${row.startDate}|${row.weeks}|${group.map((entry) => entry.studentIndex).join(',')}`;
      if (seen.has(key)) return;
      seen.add(key);
      reservations.push({
        room,
        row,
        people: group.map((entry) => entry.studentIndex),
        fullPrice: room.fee4w * (row.weeks / 4),
      });
    }));
    return reservations.sort((a, b) => a.row.startDate.localeCompare(b.row.startDate) || a.room.name.localeCompare(b.room.name));
  }
}
