import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, of, switchMap } from 'rxjs';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { applySchoolQuoteImageLayout, QuotePlanRow } from '../../../components/school-quote-plan';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import {
  ANJ_BIRTHDAY_DISCOUNT,
  ANJ_BIRTHDAY_REGISTRATION_START,
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
  AnjContinuationPeriod,
  AnjCourse,
  AnjPromotionPeriod,
  AnjRoom,
} from './anj-pricing';
import { AnjStudentQuote } from './anj-student-quote';
import { CiaContentConfig, CiaLocalFeeRule, CiaQuoteImageSettings } from '../cia-school/cia-content-config';
import { CiaPreviewTarget, isCiaPreviewTarget, resolveCiaPreviewTarget, revealCiaPreviewElement, scrollCiaPreviewElement } from '../cia-school/cia-content-preview';
import { cloneAnjContentConfig, createDefaultAnjContentConfig } from './anj-content-config';

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
  contentType?: string;
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
export class AnjSchoolComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly schoolService = inject(SchoolService);
  private readonly schoolContentService = inject(SchoolContentService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly route = inject(ActivatedRoute);
  private readonly previewHost = inject(ElementRef<HTMLElement>);
  private readonly initialContent = createDefaultAnjContentConfig();
  private currentContentConfig = cloneAnjContentConfig(this.initialContent);
  readonly contentConfig = () => this.currentContentConfig;
  private previewContent?: CiaContentConfig;
  readonly isEditorPreview = typeof window !== 'undefined' && window.parent !== window
    && this.route.snapshot.queryParamMap.get('contentPreview') === '1';
  private previewTarget?: CiaPreviewTarget;
  private previewHighlightTarget?: CiaPreviewTarget;
  private previewFocusTimer?: ReturnType<typeof setTimeout>;
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly weekOptions = ANJ_WEEK_OPTIONS;
  courses: AnjCourse[] = ANJ_COURSES.map(item => ({ ...item, feeByWeeks: item.feeByWeeks ? { ...item.feeByWeeks } : undefined, allowedWeeks: item.allowedWeeks ? [...item.allowedWeeks] : undefined }));
  rooms: AnjRoom[] = ANJ_ROOMS.map(item => ({ ...item }));
  get roomOptions() { return this.rooms; }
  newPromotionPeriods: AnjPromotionPeriod[] = ANJ_NEW_PROMOTION_PERIODS.map(item => ({ ...item, regularDiscounts: { ...item.regularDiscounts } }));
  continuationPeriods: AnjContinuationPeriod[] = ANJ_CONTINUATION_PERIODS.map(item => ({ ...item, discounts: { ...item.discounts } }));
  registrationFee = ANJ_REGISTRATION_FEE;
  registrationWaiverEnabled = true;
  birthdayPromotionEnabled = true;
  birthdayDiscount = ANJ_BIRTHDAY_DISCOUNT;
  birthdayRegistrationStart = ANJ_BIRTHDAY_REGISTRATION_START;
  sidaDiscountRate = ANJ_SIDA_DISCOUNT_RATE;
  seasonalFeePerWeek = ANJ_SEASONAL_FEE_PER_WEEK;
  peakSeasonRanges: Array<{ label: string; start: string; end: string }> = ANJ_PEAK_SEASON_RANGES.map(item => ({ ...item }));
  localFeeRules: CiaLocalFeeRule[] = structuredClone(this.currentContentConfig.localFees);
  localFeeIntro = this.currentContentConfig.quoteSettings.localFeeIntro;
  quoteImageSettings: CiaQuoteImageSettings = structuredClone(this.currentContentConfig.quoteImageSettings);
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

  private readonly builtInGalleryImages: GalleryImage[] = [
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
  galleryImages: GalleryImage[] = this.builtInGalleryImages.map(item => ({ ...item }));

  ngOnInit(): void {
    this.applyContentConfig(this.readSessionPreview() ?? this.initialContent);
    this.loadPublishedContent();
    this.loadExchangeRate();
  }

  ngAfterViewInit(): void {
    if (!this.isEditorPreview) return;
    this.previewHost.nativeElement.classList.add('anj-editor-preview');
    window.parent.postMessage({ type: 'anj-content-ready' }, window.location.origin);
  }

  ngOnDestroy(): void { clearTimeout(this.previewFocusTimer); }

  @HostListener('window:message', ['$event'])
  applyEditorPreview(event: MessageEvent): void {
    if (!this.isEditorPreview || event.origin !== window.location.origin || event.source !== window.parent) return;
    const message = event.data as { type?: string; content?: CiaContentConfig; target?: CiaPreviewTarget; scroll?: boolean };
    if (message?.type !== 'anj-content-preview' || !message.content) return;
    this.applyContentConfig(message.content);
    if (isCiaPreviewTarget(message.target)) this.previewTarget = message.target;
    this.queuePreviewFocus(message.scroll === true);
  }

  @HostListener('click', ['$event'])
  selectPreviewEditorItem(event: MouseEvent): void {
    if (!this.isEditorPreview || !(event.target instanceof Element)) return;
    const element = event.target.closest<HTMLElement>('[data-cia-preview-kind]');
    const target = { kind: element?.dataset['ciaPreviewKind'], id: element?.dataset['ciaPreviewId'] };
    if (!isCiaPreviewTarget(target)) return;
    this.previewTarget = target;
    this.queuePreviewFocus(false);
    window.parent.postMessage({ type: 'anj-content-select', ...target }, window.location.origin);
  }

  isPreviewHighlighted(kind: string | undefined, id: string | undefined): boolean {
    return this.isEditorPreview && !!kind && !!id && this.previewHighlightTarget?.kind === kind && this.previewHighlightTarget?.id === id;
  }

  private queuePreviewFocus(scroll: boolean): void {
    if (!this.isEditorPreview || !this.previewTarget) return;
    clearTimeout(this.previewFocusTimer);
    this.previewFocusTimer = setTimeout(() => {
      const target = this.previewTarget!;
      const result = resolveCiaPreviewTarget(this.previewHost.nativeElement, target);
      const fallback = result.elements[0]?.dataset;
      this.previewHighlightTarget = result.exact ? target : fallback ? { kind: 'section', id: fallback['ciaPreviewId'] ?? '' } : undefined;
      for (const element of result.elements) if (scroll) revealCiaPreviewElement(element);
      if (scroll && result.elements[0]) scrollCiaPreviewElement(result.elements[0]);
      const item = target.kind === 'course' ? this.previewContent?.courses.find(entry => entry.id === target.id)
        : target.kind === 'room' ? this.previewContent?.rooms.find(entry => entry.id === target.id)
          : target.kind === 'fee' ? this.previewContent?.localFees.find(entry => entry.id === target.id)
            : target.kind === 'promotion' ? this.previewContent?.quoteSettings.promotions.find(entry => entry.id === target.id) : undefined;
      const status = item?.enabled === false ? '此项已隐藏或停用，官网不会显示；已定位到所属板块。'
        : !result.exact && target.kind === 'promotion' ? '当前试算未产生此优惠；已定位到优惠规则区域。'
          : result.exact ? '橙色框内就是对应的官网内容，修改会在这里即时显示。' : '当前试算未显示此项，已定位到所属板块。';
      window.parent.postMessage({ type: 'anj-content-located', target, status }, window.location.origin);
    }, 80);
  }

  private readSessionPreview(): CiaContentConfig | null {
    if (typeof sessionStorage === 'undefined' || !this.isEditorPreview) return null;
    try {
      const raw = sessionStorage.getItem('anj-content-preview');
      if (!raw) return null;
      const value = JSON.parse(raw) as CiaContentConfig;
      return value?.schemaVersion === 1 && value.schoolCode === 'ANJ' ? value : null;
    } catch { return null; }
  }

  private loadPublishedContent(): void {
    this.schoolService.getSchools({ name: 'A&J' }).pipe(
      switchMap((schools) => {
        const school = schools.find(item => item.name === '菲律宾碧瑶A&J e-Edu English Academy')
          ?? schools.find(item => item.name.toLowerCase().includes('a&j'))
          ?? schools[0];
        if (!school?.id) return EMPTY;
        return forkJoin({
          published: this.schoolContentService.getPublished<CiaContentConfig>(school.id).pipe(catchError(() => of(null))),
          photos: this.schoolService.getSchoolPhotos({ schoolId: school.id, isActive: true }).pipe(catchError(() => of([]))),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ published, photos }) => {
      const preview = this.readSessionPreview();
      if (preview) this.applyContentConfig(preview);
      else if (published?.content) this.applyContentConfig(published.content);
      this.applyGalleryPhotos(photos);
    });
  }

  private applyContentConfig(value: CiaContentConfig): void {
    if (value?.schemaVersion !== 1 || value.schoolCode !== 'ANJ') return;
    const content = cloneAnjContentConfig(value);
    this.currentContentConfig = content;
    this.previewContent = content;
    this.courses = content.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder).map(item => ({
      id: item.id,
      name: item.name,
      type: item.courseType || '英语课程',
      lessons: item.schedule,
      suitable: item.suitable || item.note,
      fee4w: item.feeByWeeks ? undefined : item.tuition,
      feeByWeeks: item.feeByWeeks ? { ...item.feeByWeeks } as AnjCourse['feeByWeeks'] : undefined,
      allowedWeeks: item.allowedWeeks ? [...item.allowedWeeks] as AnjCourse['allowedWeeks'] : undefined,
    }));
    this.rooms = content.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder).map(item => ({
      id: item.id,
      name: item.label || item.name,
      note: item.note,
      fee4w: item.fee,
      priceMode: item.priceMode ?? 'per-person',
      minOccupancy: item.minOccupancy ?? 1,
      maxOccupancy: item.maxOccupancy ?? 1,
      waterFee4w: item.waterFee4w ?? 0,
      waterGroup: (item.waterGroup ?? item.group ?? 'Premium / Villa') as AnjRoom['waterGroup'],
      deposit: item.deposit ?? 0,
    }));
    const activePromotions = content.quoteSettings.promotions.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    this.newPromotionPeriods = activePromotions.filter(item => item.ruleKind === 'anj-new-period').map(item => ({
      label: item.name,
      start: item.arrivalStart ?? '',
      end: item.arrivalEnd ?? '',
      regularDiscounts: { ...(item.discountTiers ?? {}) } as AnjPromotionPeriod['regularDiscounts'],
      lowSeasonPerFourWeeks: item.incrementValue ?? 0,
    }));
    this.continuationPeriods = activePromotions.filter(item => item.ruleKind === 'anj-continuation-period').map(item => ({
      label: item.name,
      start: item.arrivalStart ?? '',
      end: item.arrivalEnd ?? '',
      discounts: { ...(item.discountTiers ?? {}) } as AnjContinuationPeriod['discounts'],
    }));
    const registrationRule = activePromotions.find(item => item.id === 'registration-waiver');
    const birthdayRule = activePromotions.find(item => item.ruleKind === 'anj-birthday' || item.id === 'anj-birthday');
    const sidaRule = activePromotions.find(item => item.id === 'sida-discount');
    this.registrationFee = content.quoteSettings.registrationFee;
    this.registrationWaiverEnabled = !!registrationRule?.waiveRegistration;
    this.birthdayPromotionEnabled = !!birthdayRule;
    this.birthdayDiscount = birthdayRule?.discountValue ?? 0;
    this.birthdayRegistrationStart = birthdayRule?.registrationStart || ANJ_BIRTHDAY_REGISTRATION_START;
    this.sidaDiscountRate = sidaRule?.discountType === 'percentage' ? Math.max(0, 1 - sidaRule.discountValue / 100) : 1;
    this.seasonalFeePerWeek = content.quoteSettings.peakSeasonFeePerWeek;
    this.peakSeasonRanges = content.quoteSettings.peakSeasonRanges.filter(item => item.enabled).map(item => ({ label: item.label, start: item.start, end: item.end }));
    this.localFeeRules = content.localFees.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    this.localFeeIntro = content.quoteSettings.localFeeIntro;
    this.quoteImageSettings = structuredClone(content.quoteImageSettings);
    this.galleryImages = [
      ...this.builtInGalleryImages.map(item => ({ ...item })),
      ...(content.media ?? []).filter(item => item.isActive && !!item.url).sort((a, b) => a.displayOrder - b.displayOrder).map(item => ({
        category: this.resolveMediaCategory(item.category),
        title: item.caption || item.altText || item.originalFileName || 'A&J学校媒体',
        description: item.altText || item.caption || 'A&J学校实景内容',
        src: item.url,
        contentType: item.contentType,
      })),
    ];
    for (const student of this.students) {
      for (const row of student.quotePlan.courses) if (!this.courses.some(item => item.id === row.optionId)) row.optionId = this.courses[0]?.id ?? '';
      for (const row of student.quotePlan.rooms) if (!this.rooms.some(item => item.id === row.optionId)) row.optionId = this.rooms[0]?.id ?? '';
    }
  }

  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    const existing = new Set(this.galleryImages.map(item => item.src));
    const uploaded = (photos ?? []).filter(photo => !!photo.url && !existing.has(photo.url)).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)).map(photo => ({
      category: this.resolveMediaCategory(photo.category),
      title: photo.caption || photo.altText || photo.originalFileName || 'A&J学校媒体',
      description: photo.altText || photo.caption || 'A&J学校实景内容',
      src: photo.url ?? '',
      contentType: photo.contentType,
    }));
    if (uploaded.length) this.galleryImages = [...this.galleryImages, ...uploaded];
  }

  private resolveMediaCategory(category?: string): Exclude<GalleryCategory, '全部'> {
    const value = (category ?? '').toLowerCase();
    if (value.includes('class') || value.includes('教室')) return '教室';
    if (value.includes('room') || value.includes('dorm') || value.includes('住宿')) return '住宿';
    return '校园';
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
      id: course.id,
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
        id: course.id,
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
  get courseTableTitle() { return this.currentContentConfig.quoteSettings.courseTableTitle; }
  get courseTableNote() { return this.currentContentConfig.quoteSettings.courseTableNote; }
  get roomTableTitle() { return this.currentContentConfig.quoteSettings.roomTableTitle; }
  get roomTableNote() { return this.currentContentConfig.quoteSettings.roomTableNote; }
  get stayPolicyTitle() { return this.currentContentConfig.quoteSettings.stayPolicyTitle; }
  get stayPolicies() { return this.currentContentConfig.quoteSettings.stayPolicies; }
  promotionDescription(id: string): string {
    return this.currentContentConfig.quoteSettings.promotions.find(item => item.id === id)?.description ?? '';
  }

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
        note: `一次性费用，${this.formatUsd(this.registrationFee)}美元／人；${this.registrationWaiverEnabled ? '通过思达报名全部免收' : '当前未启用免注册费优惠'}，本次原价共${this.formatUsd(this.activeStudents.length * this.registrationFee)}美元。`,
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
    const laundry = this.localFeeRules.find(item => item.id === 'laundry' && item.enabled);
    return [
      {
        label: '住宿押金（可退）', amount: this.formatPhp(depositTotal), cnyAmount: cny(depositTotal),
        note: `押金按所选房型计算；整间总价房型按房间计一次。无损坏及额外扣费时按学校规定退还，不计入学杂费合计。`,
      },
      ...(laundry ? [{
        label: laundry.name,
        amount: laundry.secondaryAmount
          ? `${this.formatPhp(laundry.amount)}／${laundry.secondaryLabel ?? '另一服务'} ${this.formatPhp(laundry.secondaryAmount)}`
          : this.formatPhp(laundry.amount),
        cnyAmount: '不计入预估合计',
        note: laundry.note,
      }] : []),
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
    const course = this.courses.find(item => item.id === 'eco-relax-lite')?.fee4w ?? 0;
    const room = this.rooms.find(item => item.id === 'deluxe-triple')?.fee4w ?? 0;
    return `${this.formatUsd((course + room) * this.sidaDiscountRate)} 美元`;
  }

  get ecoHubPremiumTwinText() {
    const course = this.courses.find(item => item.id === 'eco-hub')?.fee4w ?? 0;
    const room = this.rooms.find(item => item.id === 'premium-twin')?.fee4w ?? 0;
    return `${this.formatUsd((course + room) * this.sidaDiscountRate)} 美元`;
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
    const settings = this.quoteImageSettings;
    const paymentItems = [
      { ...this.schoolPaymentItems[0], note: this.joinNotes(this.schoolPaymentItems[0].note, settings.paymentNotes.registration) },
      ...this.planPaymentItems.map(item => ({
        ...item,
        note: this.joinNotes(item.note, item.icon === '课' ? settings.paymentNotes.course : settings.paymentNotes.accommodation),
      })),
      ...groupPaymentLines(this.activeStudents.map((student) => ({ paymentLines: student.applicablePaymentLines })), true)
        .map(item => ({ ...item, note: this.joinNotes(item.note, settings.paymentNotes.promotion) })),
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
        note: settings.localFeeNotes[this.previewFeeId(fee.item)] ?? fee.note,
      })),
      localFeeTotal: this.estimatedLocalFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.estimatedLocalFeeCny,
      localFeeNote: settings.localFeeIntro,
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: [],
    });
    const result = applySchoolQuoteImageLayout({
      ...quote,
      importantNotes: [...warnings, ...this.priceYearWarnings, ...settings.footerNotes],
    }, 'A&J', this.selectedWeeks, this.quoteStartDate, this.quoteUsd, this.usdToCny);
    return {
      ...result,
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${this.quoteStartDate.replace(/-/g, '')}.png`,
      paymentSectionTitle: settings.paymentSectionTitle,
      localFeeTitle: settings.localFeeSectionTitle,
      serviceSectionTitle: settings.serviceSectionTitle,
      benefitItems: settings.benefits,
      serviceLocations: settings.serviceLocations,
      alumniBenefitTitle: settings.alumniBenefitTitle,
      alumniBenefitItems: [{ title: settings.alumniBenefitTitle, subtitle: '', text: settings.alumniBenefitText }],
      noteTitle: settings.noteSectionTitle,
      conversionRates: {
        usdToCny: this.usdToCny,
        phpPerCny: this.phpPerCny,
        date: this.usingLiveExchangeRate ? this.exchangeRateDate : undefined,
      },
    };
  }

  previewFeeId(name: string): string {
    const normalized = name.replace(/^学生[\d、]+ · /, '');
    return this.localFeeRules.find(item => item.name === normalized)?.id
      ?? (normalized.startsWith('水电费') ? 'local-fees' : 'local-fees');
  }

  previewPromotionId(label: string): string {
    return this.currentContentConfig.quoteSettings.promotions.find(item => item.name === label)?.id ?? 'quote-breakdown';
  }

  previewPaymentTarget(item: { label: string }): CiaPreviewTarget {
    const label = item.label.replace(/^学生[\d、]+ · /, '');
    if (label.includes('注册费')) return { kind: 'section', id: 'quote-registration' };
    if (label.includes('课程名称')) return { kind: 'course', id: this.activeStudents[0]?.quotePlan.courses[0]?.optionId ?? this.courses[0]?.id ?? '' };
    if (label.includes('住宿名称')) return { kind: 'room', id: this.activeStudents[0]?.quotePlan.rooms[0]?.optionId ?? this.rooms[0]?.id ?? '' };
    if (label.includes('常规')) return { kind: 'promotion', id: this.currentPromotionId('anj-new-period') };
    if (label.includes('淡季')) return { kind: 'promotion', id: this.currentPromotionId('anj-new-period') };
    if (label.includes('续课')) return { kind: 'promotion', id: this.currentPromotionId('anj-continuation-period') };
    if (label.includes('生日')) return { kind: 'promotion', id: 'anj-birthday' };
    if (label.includes('思达') && label.includes('折')) return { kind: 'promotion', id: 'sida-discount' };
    if (label.includes('免注册费')) return { kind: 'promotion', id: 'registration-waiver' };
    return { kind: 'section', id: 'quote-breakdown' };
  }

  private currentPromotionId(ruleKind: string): string {
    return this.currentContentConfig.quoteSettings.promotions.find(item => item.ruleKind === ruleKind
      && this.quoteStartDate >= (item.arrivalStart ?? '') && this.quoteStartDate <= (item.arrivalEnd ?? '9999-12-31'))?.id
      ?? this.currentContentConfig.quoteSettings.promotions.find(item => item.ruleKind === ruleKind)?.id
      ?? 'quote-breakdown';
  }

  private joinNotes(...parts: Array<string | undefined>): string {
    return parts.map(part => part?.trim()).filter(Boolean).join('；');
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
