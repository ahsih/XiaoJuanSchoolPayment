import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { applyEditableQuoteImageCopy, applyEditableQuotePaymentItems, applySchoolQuoteImageLayout, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import { CiaContentConfig } from '../cia-school/cia-content-config';
import { connectUnifiedSchoolContent, notifyUnifiedPreviewLocated, notifyUnifiedPreviewReady, unifiedPreviewContent } from '../unified-school-content-bridge';
import { cloneMintContentConfig, createDefaultMintContentConfig } from './mint-content-config';
import {
  isSunday,
  MINT_PRICE_WEEKS,
  MINT_COURSES,
  MINT_FAMILY_PRICES,
  MINT_FAMILY_UPGRADES,
  MINT_LOCAL_FEES,
  MINT_LOCAL_TOTALS,
  MINT_PHP_PER_CNY,
  MINT_REGISTRATION_FEE,
  MINT_ROOMS,
  MINT_WEEK_OPTIONS,
  MintLocalFeeWeeks,
  mintEndDate,
  mintFamilyNoCourseDeduction,
  mintLowSeasonCashDiscount,
  MintQuoteWeeks,
} from './mint-pricing';

type MintQuoteMode = 'standard' | 'two-week-adult' | 'two-week-family' | 'family';
type GalleryCategory = '全部' | '校园' | '教室' | '公共区域' | '住宿' | '餐食' | '宣传资料';
type FamilyCombination = 'one-one' | 'one-two' | 'two-two';
type FamilyUpgrade = 'none' | 'premium-twin' | 'premium-single';

interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; group?: string; }

const mintGallerySeries = (
  category: Exclude<GalleryCategory, '全部'>,
  prefix: string,
  count: number,
  title: string,
  description: string,
  group?: string,
): GalleryImage[] => Array.from({ length: count }, (_, index) => ({
  category,
  title: `${title} · 角度${index + 1}`,
  description,
  src: `/assets/english-mint/gallery/${prefix}-${String(index + 1).padStart(2, '0')}.webp`,
  group,
}));

const MINT_COMPLETE_GALLERY: GalleryImage[] = [
  ...mintGallerySeries('校园', 'campus', 10, '校园实景', '学校文件中的校园实拍；教学、住宿与生活区域集中在邦劳校园。'),
  ...mintGallerySeries('教室', 'classroom', 7, '教学空间', '学校文件中的教室实拍，包含一对一、团体、视听及MTM教学空间。'),
  ...mintGallerySeries('公共区域', 'public-area', 4, '公共区域', '学校文件中的咖啡区、走廊及公共学习空间实拍。'),
  ...mintGallerySeries('住宿', 'room-deluxe', 6, '标准双人间', 'Deluxe Twin房间多角度实拍；实际房间和空房以学校确认为准。', '标准双人间'),
  ...mintGallerySeries('住宿', 'room-deluxe-balcony', 4, '标准双人间阳台', 'Deluxe住宿楼阳台与户外空间实拍。', '标准双人间'),
  ...mintGallerySeries('住宿', 'room-deluxe-bathroom', 4, '标准双人间浴室', 'Deluxe Twin浴室细节实拍。', '标准双人间'),
  ...mintGallerySeries('住宿', 'room-premium-single', 17, '高级单人间', 'Premium Single房间及卫浴多角度实拍。', '高级单人间'),
  ...mintGallerySeries('住宿', 'room-premium-twin', 9, '高级双人间', 'Premium Twin房间多角度实拍。', '高级双人间'),
  ...mintGallerySeries('餐食', 'meal-curry-beef', 2, '咖喱牛肉饭套餐', '学校提供的真实餐食照片；菜单按当期安排变化。', '咖喱牛肉饭'),
  ...mintGallerySeries('餐食', 'meal-pork-cutlet', 2, '香酥炸猪排套餐', '学校提供的真实餐食照片；菜单按当期安排变化。', '香酥炸猪排'),
  ...mintGallerySeries('餐食', 'meal-boiled-pork', 3, '白切肉与肉饼套餐', '学校提供的真实餐食照片；菜单按当期安排变化。', '白切肉与肉饼'),
  ...mintGallerySeries('餐食', 'meal-western-breakfast', 2, '西式早餐套餐', '学校提供的真实餐食照片；菜单按当期安排变化。', '西式早餐'),
  ...mintGallerySeries('餐食', 'meal-sweet-sour-ribs', 3, '甜辣排骨套餐', '学校提供的真实餐食照片；菜单按当期安排变化。', '甜辣排骨'),
  ...mintGallerySeries('餐食', 'meal-seafood', 3, '蟹虾海鲜套餐', '学校提供的真实餐食照片；菜单按当期安排变化。', '蟹虾海鲜'),
  ...mintGallerySeries('餐食', 'meal-chicken', 3, '酱汁鸡腿套餐', '学校提供的真实餐食照片；菜单按当期安排变化。', '酱汁鸡腿'),
  ...mintGallerySeries('餐食', 'meal-korean-bbq', 2, '韩式烤肉套餐', '学校提供的真实餐食照片；菜单按当期安排变化。', '韩式烤肉'),
  ...mintGallerySeries('餐食', 'meal-tofu-beef-soup', 3, '豆腐牛肉汤套餐', '学校提供的真实餐食照片；菜单按当期安排变化。', '豆腐牛肉汤'),
  ...mintGallerySeries('餐食', 'meal-seafood-noodles', 3, '香辣海鲜炒面套餐', '学校提供的真实餐食照片；菜单按当期安排变化。', '香辣海鲜炒面'),
  ...mintGallerySeries('餐食', 'meal-overview', 1, '学校套餐合照', '学校提供的五款套餐合照；实际菜单以到校安排为准。', '套餐合照'),
  { category: '宣传资料', group: '官方项目海报', title: '2周成人及亲子全包项目', description: '学校提供的官方项目海报，不作为校园实景。', src: '/assets/english-mint/promo-two-week.webp' },
  { category: '宣传资料', group: '官方项目海报', title: '冬季家庭项目', description: '学校提供的官方家庭项目海报，不作为校园实景。', src: '/assets/english-mint/promo-family.webp' },
  { category: '宣传资料', group: '官方项目海报', title: '2026下半年淡季优惠', description: '学校提供的官方优惠海报，不作为校园实景。', src: '/assets/english-mint/promo-low-season.webp' },
  ...Array.from({ length: 13 }, (_, index): GalleryImage => {
    const titles = ['Deluxe Twin宣传照', '宿舍走廊宣传图', '浴室宣传图', '餐厅宣传图', 'GC宣传照1', 'GC宣传照2', 'Gemini宣传图1', 'Gemini宣传图2', '图书馆宣传照', 'MTM宣传照', '前台宣传照', '房间宣传照1', '房间宣传照2'];
    const aiIndexes = new Set([1, 2, 3, 6, 7]);
    const generated = aiIndexes.has(index);
    return {
      category: '宣传资料',
      group: generated ? 'AI处理宣传图' : '学校宣传照片',
      title: titles[index],
      description: generated ? '学校文件中的Firefly或Gemini处理宣传图，不作为校园实景。' : '学校文件中的宣传照片，与未修图校园实拍分开展示。',
      src: `/assets/english-mint/gallery/promotional-${String(index + 1).padStart(2, '0')}.webp`,
    };
  }),
];

@Component({
  selector: 'app-english-mint-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, ExpandableImageComponent, SidaWhySectionComponent, QuoteImageDownloadButtonComponent, SchoolQuotePlanComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './english-mint-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../philippines-local-fee-table.css',
    './english-mint-school.component.css',
  ],
})
export class EnglishMintSchoolComponent implements OnInit, AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly schoolService = inject(SchoolService);
  private readonly contentService = inject(SchoolContentService);
  private contentConfig = createDefaultMintContentConfig();

  readonly quoteOnly = this.route.snapshot.data['quoteOnly'] === true;
  readonly allWeeks = MINT_PRICE_WEEKS;
  readonly quoteWeeks = MINT_WEEK_OPTIONS;
  readonly localFeeWeeks = [4, 8, 12, 16, 20, 24] as const;
  readonly localFeeReferenceRows = MINT_LOCAL_FEES;
  readonly localFeeReferenceTotals = MINT_LOCAL_TOTALS;
  readonly familyWeeks = [4, 6, 8, 10, 12];
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '公共区域', '住宿', '餐食', '宣传资料'];
  readonly galleryAlbumCategories: Exclude<GalleryCategory, '全部'>[] = ['校园', '教室', '公共区域', '住宿', '餐食', '宣传资料'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedGalleryGroup = '全部';
  selectedGalleryImageIndex = 0;

  quoteMode: MintQuoteMode = 'standard';
  readonly quotePlan = new SchoolQuotePlan('lite-esl', 'deluxe-twin', '2026-09-20', MINT_WEEK_OPTIONS,
    kind => kind === 'course'
      ? this.courses.map(course => ({ id: course.id, name: course.name, details: course.schedule }))
      : this.rooms.map(room => ({ id: room.id, name: room.name, details: room.note })),
    (kind, row) => (kind === 'course' ? this.coursePrice(row.optionId, row.weeks) : this.roomPrice(row.optionId, row.weeks)) ?? 0);
  get selectedCourseId() { return this.quotePlan.courses[0].optionId; }
  set selectedCourseId(value: string) { this.quotePlan.courses[0].optionId = value; }
  get selectedRoomId() { return this.quotePlan.rooms[0].optionId; }
  set selectedRoomId(value: string) { this.quotePlan.rooms[0].optionId = value; }
  get selectedWeeks(): MintQuoteWeeks { return this.quotePlan.courseWeeks as MintQuoteWeeks; }
  set selectedWeeks(value: MintQuoteWeeks) { this.quotePlan.updateWeeks('course', this.quotePlan.courses[0].id, value - this.quotePlan.courseWeeks + this.quotePlan.courses[0].weeks); }
  private packageStart = '2026-09-20';
  get startDate() { return this.quoteMode === 'standard' ? this.quotePlan.startDate : this.packageStart; }
  set startDate(value: string) { if (this.quoteMode === 'standard') this.quotePlan.updateStartDate('course', this.quotePlan.courses[0].id, value); else this.packageStart = value; }
  registrationDate = '2026-09-17';
  selectedBenefit: 'ssp' | 'ow' = 'ssp';
  familyCombination: FamilyCombination = 'one-one';
  selectedFamilyWeeks = 4;
  familyUpgrade: FamilyUpgrade = 'none';
  nonStudyingGuardians = 0;
  quoteCalculated = false;
  usdToCny = 7.2;
  phpPerCny = MINT_PHP_PER_CNY;
  exchangeRateDate = '';
  usingLiveExchangeRate = false;

  readonly fallbackGallery: GalleryImage[] = MINT_COMPLETE_GALLERY;

  readonly quickInfo = [
    { icon: 'location_on', label: '学校位置', value: '薄荷岛邦劳', text: '距邦劳国际机场约10分钟、阿罗娜海滩约10分钟。' },
    { icon: 'apartment', label: '校园面积', value: '约2,200㎡', text: '资料列有72间一对一教室与60间宿舍。' },
    { icon: 'schedule', label: '单节时长', value: '45分钟', text: '课间5分钟，正式课程08:45开始，最晚18:00结束。' },
    { icon: 'family_restroom', label: '成人与青少年', value: 'A1-C2 / Pre-A1-B1', text: '成人及青少年使用不同级别体系。' },
    { icon: 'restaurant', label: '校内供餐', value: '每日三餐', text: '早餐7:45-9:00、午餐12:00-13:00、晚餐17:45-19:00。' },
    { icon: 'payments', label: '计价币种', value: '美元＋比索', text: '课程住宿以美元，当地费用以菲律宾比索。' },
  ];

  readonly highlights = [
    { title: '薄荷岛学习与海岛生活结合', text: '学校位于邦劳，距机场、阿罗娜海滩和多尔霍海滩均约10分钟车程。' },
    { title: '一对一为核心的课程结构', text: '四类课程均包含每天4节一对一；Adult ESL另含1:2与1:8互动课。' },
    { title: '成人、青少年与家庭项目', text: '常规成人与Junior课程之外，另有2周成人/亲子全包和冬季家庭项目。' },
  ];

  readonly suitableFor = [
    { title: '希望在薄荷岛集中学习', text: '校内教室、住宿、餐厅、泳池与自习空间集中，日常通勤较少。' },
    { title: '想兼顾口语输出和自由时间', text: '可在Adult ESL、Speaking Master与Lite ESL之间按课量选择。' },
    { title: '亲子或家庭同行', text: '资料提供青少年课程、2周亲子全包及4至12周家庭项目。' },
  ];

  readonly lessSuitableFor = [
    { title: '只想参加考试保证班', text: '现有资料没有提供IELTS、TOEIC等考试保证课程与完整价格，本页不展示。' },
    { title: '不接受住宿门禁', text: '成人门禁23:00；未成年人门禁22:00，18:00后外出须有成年人同行。' },
  ];

  readonly schedule = [
    { time: '07:45–09:00', title: '早餐', text: '餐厅开放时间；有08:45课程的学生需提前完成用餐。' },
    { time: '08:45–12:00', title: '上午课程', text: '四节45分钟课程，每节之间休息5分钟；内容按个人课程与课表安排。' },
    { time: '12:00–13:00', title: '午餐', text: '在校内餐厅用餐并休息。' },
    { time: '13:05–16:20', title: '下午正式课程', text: '四节45分钟课程，每节之间休息5分钟；一对一或团体课按所选课程配置。' },
    { time: '16:25–18:00', title: '特别课程或自主学习', text: '学校课表列有两节特别课程时段；是否参加及具体内容以个人课表为准。' },
    { time: '17:45–19:00', title: '晚餐', text: '餐厅开放时间与最后一节课程部分重叠，请按个人课表安排用餐。' },
  ];

  readonly sideNavItems = [
    { label: '学校亮点', target: 'highlights', icon: 'stars' },
    { label: '课程住宿', target: 'courses', icon: 'menu_book' },
    { label: '套餐优惠', target: 'packages', icon: 'sell' },
    { label: '费用报价', target: 'quote', icon: 'calculate' },
    { label: '相册视频', target: 'gallery', icon: 'photo_library' },
  ];

  ngOnInit(): void {
    this.loadExchangeRate();
    connectUnifiedSchoolContent({
      code: 'MINT', schoolService: this.schoolService, contentService: this.contentService,
      matchesSchool: name => /english\s*mint|薄荷岛.*mint|mint.*international/i.test(name),
      clone: cloneMintContentConfig, apply: content => this.applyContentConfig(content),
    });
  }

  ngAfterViewInit(): void {
    notifyUnifiedPreviewReady('MINT');
    if (this.quoteOnly) setTimeout(() => document.getElementById('quote')?.scrollIntoView({ block: 'start' }));
  }

  @HostListener('window:message', ['$event'])
  onContentPreviewMessage(event: MessageEvent): void {
    const content = unifiedPreviewContent(event, 'MINT');
    if (!content) return;
    this.applyContentConfig(cloneMintContentConfig(content));
    notifyUnifiedPreviewLocated('MINT', event.data?.target);
  }

  private applyContentConfig(content: CiaContentConfig): void { this.contentConfig = content; }
  private loadExchangeRate(): void {
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe(rates => {
      if (rates.usdToCny <= 0) return;
      this.usdToCny = rates.usdToCny; this.exchangeRateDate = rates.date; this.usingLiveExchangeRate = true;
    });
  }

  get courses() { return this.contentConfig.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder); }
  get rooms() { return this.contentConfig.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder); }
  get course() { return this.courses.find(item => item.id === this.selectedCourseId) ?? this.courses[0]; }
  get room() { return this.rooms.find(item => item.id === this.selectedRoomId) ?? this.rooms[0]; }

  coursePrice(courseId: string, weeks: number): number | undefined {
    const item = this.courses.find(row => row.id === courseId);
    if (!item) return undefined;
    return weeks === 4 ? item.feeByWeeks?.['4'] ?? item.tuition : item.feeByWeeks?.[String(weeks)];
  }
  roomPrice(roomId: string, weeks: number): number | undefined {
    const item = this.rooms.find(row => row.id === roomId);
    if (!item) return undefined;
    return weeks === 4 ? item.feeByWeeks?.['4'] ?? item.fee : item.feeByWeeks?.[String(weeks)];
  }

  get effectiveGallery(): GalleryImage[] {
    const uploaded = (this.contentConfig.media ?? []).filter(item => item.isActive && item.contentType.startsWith('image/')).map(item => ({
      category: (this.galleryCategories.includes(item.category as GalleryCategory) && item.category !== '全部' ? item.category : '校园') as Exclude<GalleryCategory, '全部'>,
      title: item.caption || item.originalFileName || 'English MINT校园照片', description: item.altText || '学校已发布的校园素材。', src: item.url,
    }));
    return uploaded.length ? [...uploaded, ...this.fallbackGallery] : this.fallbackGallery;
  }
  get displayedGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') return this.effectiveGallery;
    return this.effectiveGallery.filter(item => item.category === this.selectedGalleryCategory && (this.selectedGalleryGroup === '全部' || item.group === this.selectedGalleryGroup));
  }
  get galleryGroups(): string[] {
    if (this.selectedGalleryCategory === '全部') return [];
    const groups = [...new Set(this.effectiveGallery.filter(item => item.category === this.selectedGalleryCategory).map(item => item.group).filter((group): group is string => !!group))];
    return groups.length > 1 ? ['全部', ...groups] : [];
  }
  get selectedGalleryImage(): GalleryImage {
    return this.displayedGalleryImages[this.selectedGalleryImageIndex] ?? this.effectiveGallery[0];
  }
  get displayedGalleryImageSources(): string[] { return this.displayedGalleryImages.map(item => item.src); }
  get displayedGalleryImageAlts(): string[] { return this.displayedGalleryImages.map(item => item.title); }
  get displayedGalleryImageTitles(): string[] { return this.displayedGalleryImages.map(item => item.title); }
  get displayedGalleryImageCaptions(): string[] { return this.displayedGalleryImages.map(item => item.description); }
  get uploadedVideos() { return (this.contentConfig.media ?? []).filter(item => item.isActive && item.contentType.startsWith('video/')); }

  setQuoteMode(mode: MintQuoteMode): void {
    this.quoteMode = mode;
    if (mode === 'two-week-adult' || mode === 'two-week-family') this.startDate ||= '2026-09-20';
    if (mode === 'family') { this.startDate = '2026-12-06'; this.selectedFamilyWeeks = 4; }
    this.quoteCalculated = false;
  }
  get activeWeeks(): number { return this.quoteMode === 'family' ? this.selectedFamilyWeeks : this.quoteMode.startsWith('two-week') ? 2 : this.selectedWeeks; }
  get endDate(): string { return mintEndDate(this.startDate, this.activeWeeks); }
  get parentCount(): number { return this.familyCombination === 'two-two' ? 2 : 1; }
  get childCount(): number { return this.familyCombination === 'one-two' || this.familyCombination === 'two-two' ? 2 : 1; }
  get familyLabel(): string { return this.familyCombination === 'one-one' ? '1位家长＋1位孩子' : this.familyCombination === 'one-two' ? '1位家长＋2位孩子' : '2位家长＋2位孩子'; }

  get lowSeasonEligible(): boolean {
    return this.quoteMode === 'standard'
      && this.registrationDate >= '2026-08-15' && this.registrationDate <= '2026-11-30'
      && this.startDate <= '2026-12-31' && this.startDate >= this.registrationDate
      && this.quotePlan.rooms.every(row => row.optionId === 'premium-twin' || row.optionId === 'deluxe-twin');
  }
  get cashDiscount(): number { return this.lowSeasonEligible ? mintLowSeasonCashDiscount(this.selectedWeeks) : 0; }
  get benefitEligible(): boolean { return this.lowSeasonEligible && this.selectedWeeks >= 5; }

  get standardSubtotal(): number {
    return MINT_REGISTRATION_FEE + this.quotePlan.total('course') + this.quotePlan.total('room');
  }
  get familyBase(): number { return MINT_FAMILY_PRICES[this.familyCombination][this.selectedFamilyWeeks] ?? 0; }
  get familyUpgradeAmount(): number {
    return this.familyCombination === 'one-one' && this.familyUpgrade !== 'none' ? MINT_FAMILY_UPGRADES[this.familyUpgrade][this.selectedFamilyWeeks] ?? 0 : 0;
  }
  get guardianDeduction(): number { return Math.min(this.parentCount, Math.max(0, this.nonStudyingGuardians)) * mintFamilyNoCourseDeduction(this.selectedFamilyWeeks); }
  get quoteUsd(): number {
    if (this.quoteMode === 'standard') return this.standardSubtotal - this.cashDiscount;
    if (this.quoteMode === 'two-week-adult') return 1050 + 100;
    if (this.quoteMode === 'two-week-family') return 1850 + 200;
    return this.familyBase + this.familyUpgradeAmount - this.guardianDeduction;
  }
  get quoteHeading(): string {
    if (this.quoteMode === 'two-week-adult') return 'English MINT成人2周全包报价';
    if (this.quoteMode === 'two-week-family') return 'English MINT亲子2周全包报价';
    if (this.quoteMode === 'family') return `English MINT ${this.selectedFamilyWeeks}周家庭项目报价`;
    return `English MINT ${this.selectedWeeks}周报价`;
  }
  get hasConfirmedLocalFees(): boolean { return MINT_WEEK_OPTIONS.includes(this.selectedWeeks); }
  get quoteError(): string {
    if (this.quoteMode === 'standard' && this.quotePlan.error) return this.quotePlan.error;
    if (this.quoteMode === 'standard' && !this.hasConfirmedLocalFees) return '当前周数的完整学杂费尚未确认，请联系顾问。';
    if (this.quoteMode === 'family' && !this.familyWeeks.includes(this.selectedFamilyWeeks)) return '请选择已公布的家庭套餐周数。';
    if (!this.startDate || !isSunday(this.startDate)) return '入学及入住日期请选择周日。';
    if (this.quoteMode === 'standard' && this.registrationDate > this.startDate) return '报名注册日不能晚于入学日期。';
    if (this.quoteMode === 'family' && (this.startDate < '2026-12-01' || this.endDate > '2027-02-28')) return '家庭项目须完整安排在2026年12月1日至2027年2月28日项目期内。';
    if (this.quoteMode === 'family' && this.nonStudyingGuardians > this.parentCount) return '不参加课程的家长人数不能超过当前家庭组合中的家长人数。';
    if (!this.quoteUsd) return '当前选择没有完整价格，不能生成报价。';
    return '';
  }

  get localFeeRows() {
    if (this.quoteMode !== 'standard' || !this.hasConfirmedLocalFees) return [];
    return MINT_LOCAL_FEES.map(row => {
      const configured = this.contentConfig.localFees.find(item => item.id === row.id);
      const amount = row.amounts[this.selectedWeeks as MintLocalFeeWeeks] ?? 0;
      return { ...row, name: configured?.name ?? row.name, note: configured?.note ?? row.note, amount };
    });
  }
  get localFeeTotal(): number { return this.localFeeRows.reduce((sum, row) => sum + row.amount, 0); }
  get localFeeCny(): number { return Math.round(this.localFeeTotal / this.phpPerCny); }

  get paymentItems(): QuoteImagePaymentItem[] {
    let items: QuoteImagePaymentItem[];
    if (this.quoteMode === 'standard') {
      items = [
        { icon: '注', label: '注册费', amount: `${this.formatMoney(MINT_REGISTRATION_FEE)} 美元`, note: '一次性费用。' },
        ...this.quotePlan.paymentItems().map(item => ({ ...item, label: item.label.replace('课程费', '课程名称').replace('住宿费', '住宿名称') })),
      ];
      if (this.cashDiscount) items.push({ icon: '惠', label: '2026下半年淡季现金优惠', amount: `−${this.formatMoney(this.cashDiscount)} 美元`, note: '双人房且报名、最迟入学日期符合，按当前周数档位扣减。', promotionKey: 'mint-low-season', accent: true });
      if (this.benefitEligible) items.push({ icon: '礼', label: this.selectedBenefit === 'ssp' ? '首次SSP权益' : 'OW潜水课程权益', amount: '报名时确认', note: this.selectedBenefit === 'ssp' ? '官方学杂费表仍按原额展示；符合资格后的减免以学校账单为准。' : '年龄、健康、保险、监护与合作潜店条件须确认；不可折现或转让。', promotionKey: 'mint-ssp-benefit' });
    } else if (this.quoteMode === 'two-week-adult') {
      items = [
        { icon: '注', label: '注册费', amount: '100 美元', note: '成人1人。' },
        { icon: '套', label: '成人2周全包方案', amount: '1,050 美元', note: '含课程、Deluxe双人间、餐食、当地费用和机场接机。' },
      ];
    } else if (this.quoteMode === 'two-week-family') {
      items = [
        { icon: '注', label: '注册费', amount: '200 美元', note: '1位家长＋1位孩子，共2人。' },
        { icon: '套', label: '亲子2周全包方案', amount: '1,850 美元', note: '孩子须满10岁；含两人课程、1间Deluxe双人间、餐食、当地费用和机场接机。' },
      ];
    } else {
      items = [{ icon: '套', label: `${this.familyLabel}家庭套餐`, amount: `${this.formatMoney(this.familyBase)} 美元`, note: '已含海报列明的课程、住宿、餐食、签证当地费用、教材、接机和家庭活动。' }];
      if (this.familyUpgradeAmount) items.push({ icon: '宿', label: this.familyUpgrade === 'premium-twin' ? '升级高级双人间' : '升级高级单人间', amount: `${this.formatMoney(this.familyUpgradeAmount)} 美元`, note: '仅1位家长＋1位孩子组合可选。' });
      if (this.guardianDeduction) items.push({ icon: '减', label: '家长不参加课程减免', amount: `−${this.formatMoney(this.guardianDeduction)} 美元`, note: '须报名时确定，之后不可恢复、加回或转让课程。', accent: true });
    }
    return applyEditableQuotePaymentItems(items, this.contentConfig.quoteImageSettings, this.contentConfig.quoteSettings.promotions);
  }

  get optionalFeeItems() {
    if (this.quoteMode !== 'standard') return [];
    return [
      { label: '教材费', amount: '按实际购买', cnyAmount: '未计入预估', note: '普通课程教材费未列入学校当地费表。' },
      { label: '离校送机或码头送站', amount: '机场500／码头1,200比索／人', cnyAmount: '按实际选择', note: '离校交通不计入当前当地费合计。' },
      { label: '超额用电', amount: '20比索／千瓦时', cnyAmount: '按实际使用', note: '每周基础额度20千瓦时，超额在离校时结算。' },
    ];
  }

  get quoteImageData() {
    const localItems = this.quoteMode === 'standard'
      ? this.localFeeRows.map(row => ({ label: row.name, unit: '当前周数', quantity: '1', amount: `${this.formatMoney(row.amount)} 比索`, note: row.note }))
      : [{ label: '套餐所列当地费用', unit: '套餐内', quantity: '1', amount: '已包含', note: '本页不重复加收；未列明的个人费用按实际发生。' }];
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'MINT', schoolName: '菲律宾薄荷岛English MINT International Academy', filePrefix: 'English-MINT',
      heroSrc: '/assets/english-mint/campus-building.webp', weeks: this.activeWeeks, startDate: this.startDate,
      usdToCny: this.usdToCny, totalUsd: this.quoteUsd, paymentItems: this.paymentItems,
      localFeeItems: localItems, localFeeTotal: this.localFeeTotal, localCurrencyName: '比索', localFeeCny: this.localFeeCny,
      localFeeNote: this.quoteMode === 'standard' ? '直接引用学校对应周数学杂费表；教材和超额用电另计。' : '套餐已包含海报列明的当地费用，本栏不重复计费。',
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: [
        `周日入住，周六离校；当前日期为${this.startDate.replaceAll('-', '/')}–${this.endDate.replaceAll('-', '/')}。`,
        this.quoteMode === 'standard' ? '常规报价开放4、8、12、16、20、24周，学杂费直接使用学校对应周数表格金额。' : '全包价格只按学校海报列明的固定组合计算。',
        ...(this.benefitEligible ? ['5周起权益为首次SSP减免或OW潜水课程二选一；须报名时确认，不能折现、转让或事后更改。'] : []),
      ], fullFeeDetails: true, localFeeTableLayout: 'web',
    });
    const laidOut = applySchoolQuoteImageLayout({
      ...quote, headingText: this.quoteHeading, fileName: `${this.quoteHeading}-${this.startDate.replaceAll('-', '')}.png`,
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.usingLiveExchangeRate ? this.exchangeRateDate : undefined },
      paymentSectionTitle: this.contentConfig.quoteImageSettings.paymentSectionTitle,
      localFeeTitle: this.contentConfig.quoteImageSettings.localFeeSectionTitle,
      serviceSectionTitle: this.contentConfig.quoteImageSettings.serviceSectionTitle,
      benefitItems: this.contentConfig.quoteImageSettings.benefits,
      serviceLocations: this.contentConfig.quoteImageSettings.serviceLocations,
      alumniBenefitItems: [{ title: this.contentConfig.quoteImageSettings.alumniBenefitTitle, subtitle: '', text: this.contentConfig.quoteImageSettings.alumniBenefitText }],
    }, 'MINT', this.activeWeeks, this.startDate, this.quoteUsd, this.usdToCny);
    return applyEditableQuoteImageCopy(laidOut, this.contentConfig.quoteImageSettings, this.contentConfig.quoteSettings.promotions, this.contentConfig.localFees);
  }

  calculateQuote(): void { if (!this.quoteError) this.quoteCalculated = true; }
  scrollToSection(id: string, event?: Event): void { event?.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  galleryImagesForCategory(category: Exclude<GalleryCategory, '全部'>): GalleryImage[] {
    return this.effectiveGallery.filter(item => item.category === category);
  }
  galleryAlbumDescription(category: Exclude<GalleryCategory, '全部'>): string {
    const descriptions: Record<Exclude<GalleryCategory, '全部'>, string> = {
      校园: '校舍、泳池与校园动线',
      教室: '一对一、团体与视听教室',
      公共区域: '餐厅、咖啡区与学习空间',
      住宿: '40张Deluxe与Premium房型细节',
      餐食: '27张真实餐食与菜单照片',
      宣传资料: '官方海报、宣传照片与AI处理图',
    };
    return descriptions[category];
  }
  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
    this.selectedGalleryGroup = '全部';
    this.selectedGalleryImageIndex = 0;
  }
  setGalleryGroup(group: string): void {
    this.selectedGalleryGroup = group;
    this.selectedGalleryImageIndex = 0;
  }
  selectGalleryImage(index: number): void { this.selectedGalleryImageIndex = index; }
  previousGalleryImage(): void {
    const count = this.displayedGalleryImages.length;
    if (count) this.selectedGalleryImageIndex = (this.selectedGalleryImageIndex - 1 + count) % count;
  }
  nextGalleryImage(): void {
    const count = this.displayedGalleryImages.length;
    if (count) this.selectedGalleryImageIndex = (this.selectedGalleryImageIndex + 1) % count;
  }
  formatMoney(value: number): string { return value.toLocaleString('en-US', { maximumFractionDigits: 0 }); }
  formatDate(value: string): string { return value ? value.replaceAll('-', '/') : ''; }
}
