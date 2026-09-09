import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import {
  QuoteImageDownloadButtonComponent,
  QuoteImageOptionalFeeItem,
  QuoteImagePaymentItem,
} from '../../../components/quote-image-download-button.component';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import {
  TARGET_COURSES,
  TARGET_OFFICIAL_PRICE_WEEKS,
  TARGET_ROOMS,
  TargetCourseId,
  TargetRoomId,
  targetCourse,
  targetOfficialPackagePrice,
  targetRoom,
} from './target-pricing';
import { TargetPackageRow, TargetStudentQuote } from './target-student-quote';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '生活';

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
  selector: 'app-target-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SidaWhySectionComponent, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './target-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../../../components/school-group-quote.css',
    '../philippines-local-fee-table.css',
    './target-school.component.css',
  ],
})
export class TargetSchoolComponent implements OnInit {
  private readonly exchangeRateService = inject(ExchangeRateService);
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly courses = TARGET_COURSES;
  readonly roomOptions = TARGET_ROOMS;
  readonly officialPriceWeeks = TARGET_OFFICIAL_PRICE_WEEKS;
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  readonly students: TargetStudentQuote[] = [new TargetStudentQuote(), new TargetStudentQuote()];
  usdToCny = 7.2;
  phpPerCny = 9;
  exchangeRateDate = '';
  usingLiveExchangeRate = false;
  quoteCalculated = false;

  readonly registrationFeeUsd = 150;
  readonly quoteGeneralNotes = [
    '学费部分需到校前2周交齐，可以交由思达游学代收或直接自行转美元给学校；报价以最终确认金额及付款时实际汇率为准。',
    '学杂费为到菲律宾当地需要缴纳的费用，由学校直接收取；报价仅供参考，具体以学校实际收取为准。',
    '课程与住宿作为同一套餐计价，不拆分金额；入学／入住按周日，离校／退房按周六。',
    '课程、房型、名额、升级活动及最终账单以TARGET书面确认为准。',
  ];
  readonly quoteImageFooterNotes = this.quoteGeneralNotes.slice(0, 2);

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'school',
      label: '学校定位',
      value: '日系成人友好ESL',
      note: 'TARGET主打面向成人、初学者和中长期学生的高性价比英文学习。',
    },
    {
      icon: 'location_city',
      label: '所在区域',
      value: 'Talamban / Cebu City',
      note: '学校位于宿务市Talamban，离市中心稍远但环境安静，适合专心学习。',
    },
    {
      icon: 'groups',
      label: '学校规模',
      value: '约140人容量',
      note: '官方公司资料列最大学生容量约140名、老师约100名。',
    },
    {
      icon: 'menu_book',
      label: '主力课程',
      value: 'Lite 4 / TARGET 4 / 5 / 6 / ULTIMATE 8',
      note: '课程按一对一课量区分，也有IELTS和Working Holiday方向。',
    },
    {
      icon: 'home_work',
      label: '住宿',
      value: '校内1-6人房',
      note: '1-3人房为床型房，4/6人房为上下铺，校内住宿与教学空间同一校园。',
    },
    {
      icon: 'paid',
      label: '公开价格',
      value: '2026年7月后美元价格',
      note: '官方页面说明2026年7月10日后使用新价格；本页报价器按该公开表估算。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'TARGET泳池与休息区',
      description: 'Talamban校区带泳池和户外休息区，学习之外也保留轻松交流空间。',
      src: '/assets/philippines/target-campus-hero.jpg',
    },
    {
      category: '校园',
      title: '校区中庭',
      description: '官方住宿页介绍校园有泳池、休息区、篮球、台球、乒乓和Wi-Fi等设施。',
      src: 'https://target-english.org/wp-content/uploads/Outside03-1-200x200.jpg',
    },
    {
      category: '生活',
      title: '泳池区域',
      description: '适合课后放松与国际学生交流，也是TARGET校区辨识度较高的空间。',
      src: 'https://target-english.org/wp-content/uploads/Pool01-1-200x200.jpg',
    },
    {
      category: '生活',
      title: 'Pool & Rest Area',
      description: '学校在学习之外保留开放休息空间，比较适合不想纯高压斯巴达的人。',
      src: 'https://target-english.org/wp-content/uploads/RestSpace02-1-200x200.jpg',
    },
    {
      category: '住宿',
      title: '3人房参考',
      description: '1-3人房使用床型房，适合想在预算和舒适度之间平衡的人。',
      src: 'https://www.ryugaku-onebridge.com/api/pict/7478?s=750x500',
    },
    {
      category: '住宿',
      title: '多人房参考',
      description: '4人房和6人房为上下铺，预算更低，适合想控制总费用的学生。',
      src: 'https://cebu21.jp/include/schoolno2/target/Dormitory/Quad03.png',
    },
    {
      category: '教室',
      title: '一对一课堂',
      description: 'TARGET课程以一对一为核心，可按General English、TOEIC、Business、旅行英文等方向组合。',
      src: 'https://www.lastresort.co.jp/study_abroad/school_search/school_library/1503/700/1on1_class_03.jpg',
    },
    {
      category: '生活',
      title: '餐厅参考',
      description: '官方说明平日提供3餐，土曜/祝日1餐，日曜2餐，并有日本人支持与生活服务。',
      src: 'https://cebu21.jp/include/schoolno2/target/Dining%26Kiosk/Dining01.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务TARGET Global English Academy' },
    { label: '英文名称', value: 'TARGET Global English Academy / TARGET GLOBAL ENGLISH ACADEMY, INC.' },
    { label: '地址', value: 'LOT10249 Across Maryville Subdivision, Tigbao Talamban, Cebu City 6000, Philippines' },
    { label: '认证', value: 'TESDA认证校；SSP发给申请认可校 AAFS No. SBM-2013-004。' },
    { label: '学校规模', value: '最大容量约140名学生，约100名老师。' },
    { label: '设施', value: '一对一教室、小组教室、自习室、餐厅、泳池、篮球、台球、乒乓、Wi-Fi、警卫室。' },
    { label: '4周起价', value: '1,430美元起：Lite 4＋六人房＋150美元注册费。' },
  ];

  readonly highlights: TextCard[] = [
    {
      title: '一对一课量清楚，适合按体力选择',
      text: 'Lite 4、TARGET 4、5、6和ULTIMATE 8按课程结构与一对一课数区分，学生可以在预算、体力和学习密度之间做清楚取舍。',
    },
    {
      title: '初学者和成人支持较完整',
      text: '官方课程资料强调初学者、旅行、TOEIC、Business和Working Holiday等半固定课程设计，也有日本人学习支持。',
    },
    {
      title: '校内住宿和生活服务集中',
      text: '校内宿舍、餐食、清洁、洗衣、警卫和学习空间集中，适合想把日常杂事降到最低、专心上课的人。',
    },
  ];

  readonly suitableFor: TextCard[] = [
    {
      title: '预算敏感但想保证一对一课量',
      text: '6人房或4人房搭配Lite 4、TARGET 4/5，可以把总价压得比较稳，同时保留足够一对一课。',
    },
    {
      title: '英语基础弱或多年没开口',
      text: '一对一课可以从发音、听力、词汇、语法和会话基础开始拆，较适合需要老师带着练的人。',
    },
    {
      title: '计划TOEIC、商务或Working Holiday',
      text: '课程可把一对一内容组合到TOEIC、Business、旅行英文和Working Holiday准备上。',
    },
  ];

  readonly lessSuitableFor: TextCard[] = [
    {
      title: '想住Mactan海边或市中心商圈',
      text: 'TARGET在Talamban安静区域，不是海边度假型或Mabolo/Ayala旁边的市中心生活路线。',
    },
    {
      title: '想要最严格高压斯巴达',
      text: 'TARGET有门禁和学习规则，但整体更偏成人友好和半自律学习；高压备考可比较EV、CG斯巴达校区或SMEAG。',
    },
    {
      title: '只看促销价做决定',
      text: '官方页面说明活动折扣有申请时机和旺季限制，正式预算一定要按开课日、周数和房型确认。',
    },
  ];

  readonly scheduleItems: ScheduleItem[] = [
    {
      time: 'Morning',
      title: '一对一基础输入',
      text: '按课程选择Voca、Grammar、Listening Master、Speaking Master、General English等一对一内容。',
    },
    {
      time: 'Daytime',
      title: '小组课与输出训练',
      text: 'Conversation、Pattern English、Daily Vocabulary或TOEIC Preparation等小组课帮助学生练习实际使用。',
    },
    {
      time: 'Self-study',
      title: '必修自习与复习',
      text: 'TARGET 4/5等课程包含自习安排，适合中长期稳定累积。',
    },
    {
      time: 'Evening',
      title: '自主复习与校园生活',
      text: '完成当天课程后，可按个人学习计划复习，并使用学校开放的生活设施。',
    },
  ];

  readonly faqs: TextCard[] = [
    {
      title: 'TARGET和CIA怎么选？',
      text: 'CIA偏大型综合半斯巴达和Mactan新校区；TARGET偏日系成人友好、Talamban安静校区、预算控制和一对一课量。预算和基础口语优先可看TARGET，设施和考试资源综合度优先可看CIA。',
    },
    {
      title: '页面报价包含所有费用吗？',
      text: '不包含。报价器按学校公开的美元课程住宿套餐和注册费估算；SSP、签证、教材、水电、共益费、押金、接机、洗衣、机票和保险另计。',
    },
    {
      title: '促销折扣可以直接使用吗？',
      text: '报价器会按所选日期自动排除旺季重叠周并计算学校现金优惠；限时升级仍受报名日、入学日、课程、房型空位和名额限制，最终要由学校确认。',
    },
    {
      title: '初学者可以去TARGET吗？',
      text: '可以。官方FAQ说明0基础也可报名，课程和一对一内容可从基础开始；如果需要中文或日文支持，也要在报名时确认当前工作人员安排。',
    },
  ];

  readonly sideNavItems: SideNavItem[] = [
    { label: '校区亮点', target: 'highlights', icon: 'stars' },
    { label: '课程费用', target: 'courses', icon: 'payments' },
    { label: '快速报价', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'receipt' },
    { label: '资料来源', target: 'sources', icon: 'link' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '图片', target: 'gallery', icon: 'photo_library' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'local-fees', icon: 'receipt_long' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'TARGET官方首页', url: 'https://target-english.org/' },
    { label: 'TARGET官方费用页', url: 'https://target-english.org/tuition/' },
    { label: 'TARGET官方课程页', url: 'https://target-english.org/academic/course/' },
    { label: 'TARGET官方公司/校区资料', url: 'https://target-english.org/company/' },
    { label: 'TARGET官方学校设施页', url: 'https://target-english.org/life/accommodation/' },
    { label: 'TARGET官方生活支持页', url: 'https://target-english.org/life/support/' },
    { label: 'TARGET官方FAQ', url: 'https://target-english.org/zh-CN/faq/' },
    { label: 'CEBU English TARGET 2026费用参考', url: 'https://cebu-english.com/school/target/' },
  ];

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') {
      return this.galleryImages;
    }

    return this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  ngOnInit(): void {
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((rates) => {
      if (rates.usdToCny <= 0 || rates.phpPerCny <= 0) return;
      this.usdToCny = rates.usdToCny;
      this.phpPerCny = rates.phpPerCny;
      this.exchangeRateDate = rates.date;
      this.usingLiveExchangeRate = true;
    });
  }

  get studentCount(): number { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new TargetStudentQuote());
    }
  }

  setQuoteMode(mode: 'single' | 'group'): void {
    this.quoteMode = mode;
    if (mode === 'group') this.studentCount = this.requestedStudentCount;
  }

  get activeStudents(): TargetStudentQuote[] {
    return this.quoteMode === 'single'
      ? this.students.slice(0, 1)
      : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2)));
  }

  get selectedCourseId(): TargetCourseId { return this.students[0].packages[0].courseId; }
  set selectedCourseId(value: TargetCourseId) { this.students[0].packages[0].courseId = value; }
  get selectedRoomId(): TargetRoomId { return this.students[0].packages[0].roomId; }
  set selectedRoomId(value: TargetRoomId) { this.students[0].packages[0].roomId = value; }
  get selectedWeeks(): number { return this.students[0].packageWeeks; }
  get selectedStartDate(): string { return this.students[0].startDate; }
  get selectedCourse() { return targetCourse(this.selectedCourseId) ?? this.courses[0]; }
  get selectedRoom() { return targetRoom(this.selectedRoomId) ?? this.roomOptions[0]; }

  get packageUsd(): number { return this.students[0].packageTotal; }
  get quoteUsd(): number { return this.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0); }
  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex((student) => !!student.quoteError);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quoteError}`;
  }

  get packageUsdText(): string { return `${this.formatUsd(this.packageUsd)}美元`; }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)}美元`; }
  get quoteCnyText(): string { return `人民币预计金额：约 ${Math.round(this.quoteUsd * this.usdToCny).toLocaleString('zh-CN')} 元`; }
  get exchangeRateSummary(): string {
    return this.usingLiveExchangeRate
      ? `人民币金额按${this.exchangeRateDate.replace(/-/g, '/')}参考汇率估算，最终以付款当日汇率为准`
      : `美元金额暂按1美元≈${this.usdToCny}元人民币估算，最终以付款当日汇率为准`;
  }

  get fourWeekStartingText(): string {
    const lowestPackageUsd = Math.min(...this.courses.map((course) => targetOfficialPackagePrice(course.id, 'six', 4)));
    return `${this.formatUsd(this.registrationFeeUsd + lowestPackageUsd)}美元`;
  }

  get targetFiveFourWeekText(): string {
    return `${this.formatUsd(this.registrationFeeUsd + targetOfficialPackagePrice('target5', 'six', 4))}美元`;
  }

  officialPackagePrice(courseId: TargetCourseId, roomId: TargetRoomId, weeks: number): string {
    return `${this.formatUsd(targetOfficialPackagePrice(courseId, roomId, weeks))}美元`;
  }

  packageCourse(row: TargetPackageRow) { return targetCourse(row.courseId) ?? this.courses[0]; }
  packageRoom(row: TargetPackageRow) { return targetRoom(row.roomId) ?? this.roomOptions[0]; }

  private packagePaymentItems(): QuoteImagePaymentItem[] {
    return this.activeStudents.flatMap((student, studentIndex) => [...student.packages]
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((row, rowIndex) => {
        const course = this.packageCourse(row);
        const room = this.packageRoom(row);
        const numberLabel = student.packages.length > 1 ? `${rowIndex + 1}` : '';
        return {
          icon: '套',
          label: `${this.quoteMode === 'group' ? `学生${studentIndex + 1} · ` : ''}课程住宿套餐${numberLabel}`,
          amount: `${this.formatUsd(student.packagePrice(row))} 美元`,
          detailTitle: `${course.name}｜${room.name}`,
          detailSubtitle: `${row.startDate.replace(/-/g, '/')}–${student.end(row).replace(/-/g, '/')} · ${row.weeks}周`,
          note: `${course.arrangement}；课程与住宿按学校套餐合并计价，不拆分金额。`,
        };
      }));
  }

  private groupedStatusItems(includeInapplicable: boolean): QuoteImagePaymentItem[] {
    const entries = this.activeStudents.flatMap((student, index) => student.statusLines
      .filter((line) => includeInapplicable || !['当前未适用', '未减免'].includes(line.amount))
      .map((line) => ({ line, studentNumber: index + 1 })));
    if (this.quoteMode === 'single') return entries.map(({ line }) => line);
    return entries.map(({ line, studentNumber }) => ({ ...line, label: `学生${studentNumber} · ${line.label}` }));
  }

  get schoolPaymentItems(): QuoteImagePaymentItem[] {
    return [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationFeeUsd * this.activeStudents.length)} 美元`, note: `150美元／人，一次性费用；本次共${this.activeStudents.length}人。` },
      ...this.packagePaymentItems(),
      ...groupPaymentLines(this.activeStudents, true),
      ...this.groupedStatusItems(true),
    ];
  }

  get estimatedLocalFees() { return groupLocalFees(this.activeStudents); }
  get localFeeTotal(): number { return this.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0); }
  get localFeeCny(): number { return Math.round(this.localFeeTotal / this.phpPerCny); }
  get localFeeCnyText(): string { return `约 ${this.localFeeCny.toLocaleString('zh-CN')} 元`; }

  get optionalFeeItems(): QuoteImageOptionalFeeItem[] {
    const studentCount = this.activeStudents.length;
    const pickupStudents = this.activeStudents.filter((student) => student.pickupRequested).length;
    const pickupGroups = Math.ceil(pickupStudents / 2);
    const pickupEstimate = pickupGroups * 1200;
    const deposit = studentCount * 2500;
    return [
      {
        label: '房间押金（可退）', amount: this.formatPhp(deposit),
        cnyAmount: `约 ${Math.round(deposit / this.phpPerCny).toLocaleString('zh-CN')} 元`,
        note: `2,500比索／人 × ${studentCount}；退宿时设施和物品无损坏、遗失时退还，不计入学杂费合计。`,
      },
      {
        label: '宿务机场接机', amount: pickupStudents ? this.formatPhp(pickupEstimate) : '未选择',
        cnyAmount: pickupStudents ? `约 ${Math.round(pickupEstimate / this.phpPerCny).toLocaleString('zh-CN')} 元` : undefined,
        note: pickupStudents
          ? `${pickupStudents}人选择；基本费1,200比索、每组最多2人，当前按${pickupGroups}组参考，实际拼车和安排由学校确认。指定时段外或临近报名可能各加1,000比索。`
          : '基本费1,200比索，每组最多2人；指定时段外或临近报名可能各加1,000比索，不计入学杂费合计。',
      },
      {
        label: '洗衣服务', amount: '150比索／次',
        cnyAmount: `约 ${Math.round(150 / this.phpPerCny).toLocaleString('zh-CN')} 元／次`,
        note: '每次最多6公斤，学校列明每周最多使用3天；按实际次数支付，不计入学杂费合计。',
      },
    ];
  }

  get quoteHeading(): string {
    return this.quoteMode === 'single' ? `TARGET ${this.selectedWeeks}周报价` : `TARGET ${this.activeStudents.length}人报价`;
  }
  get quoteStartDate(): string { return this.activeStudents.map((student) => student.startDate).filter(Boolean).sort()[0] ?? this.selectedStartDate; }

  get quoteImageData() {
    const warnings = this.activeStudents.map((student, index) => student.warning ? `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.warning}` : '').filter(Boolean);
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'TARGET',
      schoolName: '菲律宾宿务TARGET Global English Academy',
      filePrefix: 'TARGET',
      heroSrc: this.galleryImages[0].src,
      weeks: this.selectedWeeks,
      startDate: this.quoteStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems: [
        this.schoolPaymentItems[0],
        ...this.packagePaymentItems(),
        ...groupPaymentLines(this.activeStudents, true),
        ...this.groupedStatusItems(false),
      ],
      localFeeItems: this.estimatedLocalFees.map((fee) => ({
        label: fee.item,
        unit: fee.unitLabel,
        quantity: this.formatFeeQuantity(fee.quantity),
        amount: this.formatPhp(fee.total),
        note: fee.note,
      })),
      localFeeTotal: this.localFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.localFeeCny,
      localFeeNote: '房间押金、接机和洗衣服务另行准备，不计入学杂费及人民币预估合计。',
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: [...warnings, ...this.quoteImageFooterNotes],
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
    });
    return {
      ...applySchoolQuoteImageLayout(quote, 'TARGET', this.selectedWeeks, this.quoteStartDate, this.quoteUsd, this.usdToCny),
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading.replace(/\s+/g, '')}-${this.quoteStartDate.replace(/-/g, '')}.png`,
      noteTitle: '报价说明',
      importantNotes: [...warnings, ...this.quoteImageFooterNotes],
      finalConfirmationText: '最终以学校价格、空房及优惠确认为准。',
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateDate || undefined },
      exchangeRateText: `学杂费按1元人民币≈${this.phpPerCny.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}比索估算`,
    };
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 2 });
  }
  formatPhp(value: number): string { return `${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}比索`; }
  formatFeeQuantity(value: number): string {
    return value.toLocaleString('zh-CN', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 2 });
  }
}
