import { connectQuoteRates, quoteCurrencyText } from '../../../../services/quote-exchange-rates';
import { CommonModule } from '@angular/common';
import { CiaQuote, applyCiaQuoteContent } from './cia-quote-engine';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import {
  Component,
  AfterViewInit,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, forkJoin, of, switchMap } from 'rxjs';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import {
  QuoteImageDownloadButtonComponent,
} from '../../../components/quote-image-download-button.component';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { CIA_STUDENT_REVIEWS } from './cia-student-reviews.data';
import {
  CiaContentConfig,
  CiaLocalFeeRule,
  CiaPeakSeasonRange,
  CiaPromotionRule,
  CiaQuoteImageSettings,
  CiaStayPolicyCard,
  CiaExtraNightRate,
  cloneCiaContentConfig,
  createDefaultCiaContentConfig,
} from './cia-content-config';
import { CiaPreviewTarget, isCiaPreviewTarget, resolveCiaPreviewTarget, revealCiaPreviewElement, scrollCiaPreviewElement } from './cia-content-preview';

import {
  CIA_GALLERY_CATEGORIES,
  CIA_GALLERY_ALBUM_CATEGORIES,
  CIA_GALLERY_IMAGES,
  CIA_BASIC_INFO,
  CIA_SUITABLE_FOR,
  CIA_NOT_SUITABLE_FOR,
  CIA_CAMPUS_BUILDINGS,
  CIA_WEEKDAY_SCHEDULE,
  CIA_FRIDAY_SCHEDULE,
  CIA_HOLIDAY_CALENDARS,
  CIA_IELTS_COMPUTER_EXAM_DATES_2027,
  CIA_IELTS_EXAM_DATES_2026,
  CIA_COURSE_DETAIL_GUIDES,
  CIA_FAQS,
  CIA_MOBILE_ANCHORS,
  CIA_SNAPSHOT_CARDS,
  CIA_VIDEO_CARDS,
  CIA_COURSE_CHOICE_CARDS,
  CIA_STUDENT_CARE_SERVICES,
  CIA_CAMPUS_PRACTICAL_GUIDES,
  CIA_ROOM_COMPARISON_PROFILES,
  CIA_STUDENT_TRACKS,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  CIA_CTA_BADGES,
  CIA_CTA_CONSULTANTS,
  CIA_GALLERY_ALBUM_DESCRIPTIONS,
  CIA_HERO_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  type GalleryCategory,
  type QuickInfo,
  type GalleryImage,
  type CiaVideoCard,
  type Highlight,
  type CourseItem,
  type CourseFee,
  type ScheduleItem,
  type RoomFee,
  type RoomRateOption,
  type RoomRateGroup,
  type RoomComparisonProfile,
  type CampusMonthlyEvent,
  type LocalFee,
  type LocalFeeEstimate,
  type ProcessStep,
  type SideNavItem,
} from './cia-page-content';

@Component({
  selector: 'app-cia-school',
  standalone: true,
  imports: [SchoolQuotePlanComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    ExpandableImageComponent,
    QuoteImageDownloadButtonComponent,
  ],
  templateUrl: './cia-school.component.html',
  styleUrls: ['./cia-school.component.css', '../school-quote-rollout.css', '../../../components/school-group-quote.css'],
})
export class CiaSchoolComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly previewHost: ElementRef<HTMLElement> = inject(ElementRef);
  private previewTarget?: CiaPreviewTarget;
  private previewHighlightTarget?: CiaPreviewTarget;
  private previewFocusTimer?: ReturnType<typeof setTimeout>;
  private previewContent?: CiaContentConfig;
  quoteImageSettings: CiaQuoteImageSettings = createDefaultCiaContentConfig().quoteImageSettings;

  get isEditorPreview(): boolean {
    return typeof window !== 'undefined' && window.parent !== window
      && this.route.snapshot.queryParamMap.get('contentPreview') === '1';
  }
  private readonly schoolService = inject(SchoolService);
  private readonly schoolContentService = inject(SchoolContentService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly route = inject(ActivatedRoute);
  private readonly ciaPricingSchoolName = 'CIA Cebu International Academy';
  private readonly defaultContentConfig = createDefaultCiaContentConfig();
  private readonly courseFeeOrder = [
    'regular-esl',
    'intensive-esl',
    'power-intensive',
    'pre-toeic',
    'toeic-regular',
    'toeic-guarantee',
    'pre-ielts',
    'ielts-regular',
    'ielts-guarantee',
    'business',
    'working-holiday',
    'callan-esl',
    'college-immersion',
  ];
  private readonly roomFeeOrder = [
    'p1',
    's1',
    'pn1',
    'd2',
    'd3',
    'd4',
    'sr1',
    'sr2',
    'sr3',
    'sr4',
  ];
  /** Page text shared with the WeChat mini program; see cia-page-content.ts. */
  readonly copy = CIA_PAGE_COPY;
  private readonly featuredGalleryCategories = CIA_HERO_GALLERY_CATEGORIES;
  private readonly uploadedPhotoCategoryIndexes: Record<string, number> = {
    campus: 1,
    classroom: 2,
    accommodation: 3,
    dining: 4,
    facility: 5,
  };
  private readonly courseFeeDetails: Record<
    string,
    Pick<CourseFee, 'schedule' | 'note' | 'suitable' | 'highlightNote'>
  > = {
    'regular-esl': {
      suitable: '基础综合提升 / 可申请 Light ESL',
      schedule:
        '一对一4节 + 小组1节 + 中组1节 + 大组1节 + 选修1节 + 写作1节 + 自习1节',
      note: 'Regular ESL 均衡提升听说读写；Light ESL 需在出发前申请，可按学校规则减少部分课程。',
    },
    'intensive-esl': {
      suitable: '想增加一对一课时',
      schedule:
        '一对一5节 + 小组1节 + 中组1节 + 选修1节 + 写作1节 + 自习1节',
      note: '比 Regular ESL 多1节一对一，适合短期加强口语输出和老师纠音。',
    },
    'power-intensive': {
      suitable: '短期高强度口语突破',
      schedule:
        '一对一6节 + 小组1节 + 选修1节 + 写作1节 + 自习1节',
      note: '一对一比例最高，适合时间有限、希望集中补弱项的学生。',
    },
    'pre-toeic': {
      suitable: '托业预备 / 无入学分数要求',
      schedule:
        '托业一对一4节 + ESL小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
      note: '4周为一个学习单元，每2周安排一次模拟考试，适合先建立托业基础。',
    },
    'toeic-regular': {
      suitable: '托业常规备考',
      schedule:
        '托业一对一4节 + 托业小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
      note: '4周为一个学习单元，每2周安排一次模拟考试。',
    },
    'toeic-guarantee': {
      suitable: '托业600 / 700 / 800 / 900分保证班',
      schedule:
        '托业一对一4节 + 托业小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
      note: '12周课程；入学参考分数为400 / 500 / 650 / 790分，并有出勤、每周模考和官方考试要求。',
    },
    'pre-ielts': {
      suitable: '雅思预备 / 无入学分数要求',
      schedule:
        '雅思一对一4节 + ESL小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
      note: '4周为一个学习单元，每2周安排一次模拟考试，适合先补齐雅思基础。',
    },
    'ielts-regular': {
      suitable: '雅思常规备考',
      schedule:
        '雅思一对一4节 + 雅思小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
      note: '建议雅思3.5分以上，4周为一个学习单元，每2周安排一次模拟考试。',
    },
    'ielts-guarantee': {
      suitable: '雅思5.5 / 6.0 / 6.5 / 7.0分保证班',
      schedule:
        '雅思一对一4节 + 雅思小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节；周一至周三另有强化晚课',
      note: '12周课程；入学参考分数为3.5–4.5 / 5.0–5.5 / 6.0 / 6.5分，并有出勤、每周四模考和官方考试要求。',
    },
    business: {
      suitable: '商务沟通、演示与职场写作',
      schedule:
        '商务一对一5节 + 商务小组1节 + 综合中组1节 + 选修1节 + 写作1节 + 自习2节',
      note: '入学参考为 CIA Level 4 或 TOEIC 400分；4或8周为一个单元，4周以上学生需完成商务PPT发表。',
    },
    'working-holiday': {
      suitable: '海外生活与面试沟通',
      schedule:
        'ESL一对一4节 + ESL小组1节 + 综合中组1节 + 外教/CNN大组1节 + 选修1节 + 写作1节 + 自习2节',
      note: '4周为一个学习单元，内容覆盖生存英语、求职准备和海外生活沟通。',
    },
    'callan-esl': {
      suitable: '高频问答与快速口语反应',
      schedule:
        'Callan一对一3节 + ESL一对一2节 + ESL小组1节 + 综合中组1节 + 选修1节 + 写作1节 + 自习2节',
      note: '4周为一个学习单元，通过快速问答、即时纠错和系统复习训练英语反应速度。',
    },
    'college-immersion': {
      suitable: '想参加IAU航空大学体验，报名时应选择此课程',
      schedule:
        'ESL一对一4节 + ESL小组1节 + 综合中组1节 + 外教/CNN大组1节 + 选修1节 + 写作1节 + 自习2节',
      note: '不是Regular ESL的临时加选课；4周为一个学习单元，另收IAU一次性注册费50美元，详细旁听与证书说明见下方课程细节。',
    },
  };

  readonly galleryCategories = CIA_GALLERY_CATEGORIES;
  readonly galleryAlbumCategories = CIA_GALLERY_ALBUM_CATEGORIES;
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedGalleryImageIndex = 0;
  selectedHeroImageIndex = 0;
  usingUploadedGallery = false;
  uploadedVideoCards: CiaVideoCard[] = [];

  registrationFee = this.defaultContentConfig.quoteSettings.registrationFee;
  futurePriceRegistrationStart = this.defaultContentConfig.quoteSettings.futurePriceRegistrationStart;
  futurePriceArrivalStart = this.defaultContentConfig.quoteSettings.futurePriceArrivalStart;
  shortTermPriceRatios: Record<string, number> = {
    ...this.defaultContentConfig.quoteSettings.shortStayRatios,
  };
  seasonalFeePerWeek = this.defaultContentConfig.quoteSettings.peakSeasonFeePerWeek;
  peakSeasonRanges = cloneCiaContentConfig(this.defaultContentConfig).quoteSettings.peakSeasonRanges;
  promotions: CiaPromotionRule[] = cloneCiaContentConfig(this.defaultContentConfig).quoteSettings.promotions;
  localFeeRules: CiaLocalFeeRule[] = cloneCiaContentConfig(this.defaultContentConfig).localFees;
  localFeeIntro = this.defaultContentConfig.quoteSettings.localFeeIntro;
  courseTableTitle = this.defaultContentConfig.quoteSettings.courseTableTitle;
  courseTableNote = this.defaultContentConfig.quoteSettings.courseTableNote;
  groupClassNote = this.defaultContentConfig.quoteSettings.groupClassNote;
  roomTableTitle = this.defaultContentConfig.quoteSettings.roomTableTitle;
  roomTableNote = this.defaultContentConfig.quoteSettings.roomTableNote;
  stayPolicyTitle = this.defaultContentConfig.quoteSettings.stayPolicyTitle;
  stayPolicies: CiaStayPolicyCard[] = cloneCiaContentConfig(this.defaultContentConfig).quoteSettings.stayPolicies;
  extraNightRates: CiaExtraNightRate[] = cloneCiaContentConfig(this.defaultContentConfig).quoteSettings.extraNightRates;
  usdToCny = Number.NaN;
  phpPerCny = Number.NaN;
  exchangeRateDate = '';
  usingLiveExchangeRates = false;
  readonly weekOptions = [1, 2, 3, 4, 6, 8, 12, 16, 20, 24];

  /** The calculator itself lives in cia-quote-engine.ts, shared with the WeChat mini program. */
  readonly quote = new CiaQuote(this);
  get students() { return this.quote.students; }
  get quoteMode() { return this.quote.quoteMode; }
  set quoteMode(value: 'single' | 'group') { this.quote.quoteMode = value; }
  get studentCount() { return this.quote.studentCount; }
  set studentCount(value: number) { this.quote.studentCount = value; }
  setQuoteMode(value: 'single' | 'group') { this.quote.setQuoteMode(value); }
  get activeStudents() { return this.quote.activeStudents; }
  get quotePlan() { return this.quote.quotePlan; }
  get quoteHeading() { return this.quote.quoteHeading; }
  get quoteError() { return this.quote.quoteError; }
  get registrationNote() { return this.quote.registrationNote; }
  get schoolPaymentItems() { return this.quote.schoolPaymentItems; }
  get optionalFeeItems() { return this.quote.optionalFeeItems; }
  get selectedCourseId() { return this.quotePlan.courses[0].optionId; }
  set selectedCourseId(value: string) { this.quotePlan.courses[0].optionId = value; }
  get selectedRoomId() { return this.quotePlan.rooms[0].optionId; }
  set selectedRoomId(value: string) { this.quotePlan.rooms[0].optionId = value; }
  get selectedWeeks() { return this.quotePlan.courseWeeks; }
  set selectedWeeks(value: number) { this.quotePlan.updateWeeks('course', this.quotePlan.courses[0].id, value); }
  get selectedStartDate() { return this.quotePlan.startDate; }
  set selectedStartDate(value: string) { this.quotePlan.updateStartDate('course', this.quotePlan.courses[0].id, value); }
  selectedRoomProfileId = 'premium-single';
  get selectedRegistrationDate() { return this.students[0].selectedRegistrationDate; }
  set selectedRegistrationDate(value: string) { this.students[0].selectedRegistrationDate = value; }
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'apartment',
      label: '学校类型',
      value: '宿务麦克坦度假型校区',
      note: '半斯巴达管理',
    },
    {
      icon: 'groups',
      label: '适合人群',
      value: '15岁以上学生',
      note: '短期游学、备考、亲子和成人',
    },
    {
      icon: 'verified_user',
      label: '管理模式',
      value: '半斯巴达',
      note: '每日测试、门禁、出勤管理',
    },
    {
      icon: 'school',
      label: '课程选项',
      value: 'ESL / 考试 / 职场英语',
      note: '另有 Cambridge、Callan、大学沉浸与假期项目',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: '单人到四人间',
      note: '校内住宿，热门房型需早确认',
    },
    {
      icon: 'event_available',
      label: '年龄要求',
      value: '15岁以上',
      note: '未成年学生建议提前确认监护安排',
    },
  ];

  galleryImages: GalleryImage[] = [...CIA_GALLERY_IMAGES];

  readonly basicInfo = CIA_BASIC_INFO;

  readonly highlights: Highlight[] = [
    {
      image: 'assets/cia/quad-room.webp',
      title: '预算房型清楚',
      text: '四人间 D-4 是默认预算参考，适合先估算总费用。',
    },
    {
      image: 'assets/cia/campus-building.webp',
      title: '校内生活集中',
      text: '上课、住宿、餐厅和设施都在同一校区，适合第一次游学。',
    },
    {
      image: 'assets/cia/one-to-one-class.webp',
      title: '一对一比例高',
      text: 'ESL、考试和商务方向都能搭配一对一课程。',
    },
    {
      image: 'assets/cia/dining-hall.webp',
      title: '生活配套成熟',
      text: '餐厅、健身房、泳池、医务和学生服务都比较完整。',
    },
  ];

  readonly suitableFor = CIA_SUITABLE_FOR;

  readonly notSuitableFor = CIA_NOT_SUITABLE_FOR;

  readonly courses: CourseItem[] = [
    {
      name: 'Regular ESL / Light ESL',
      type: '综合英语 / 可申请轻量课表',
      lessons: '4节一对一 + 小组、中组、大组、选修、写作与自习',
      suitable: '适合第一次游学、希望稳步提升听说读写，或需要较灵活课表的学生。',
      icon: 'school',
    },
    {
      name: 'Intensive ESL',
      type: '强化英语',
      lessons: '5节一对一 + 小组、中组、选修、写作与自习',
      suitable: '适合短期想加强口语表达和老师纠音的学生。',
      icon: 'menu_book',
    },
    {
      name: 'Power Intensive',
      type: '高强度一对一',
      lessons: '6节一对一 + 小组、选修、写作与自习',
      suitable: '适合4周左右集中突破口语、听力和表达的学生。',
      icon: 'psychology',
    },
    {
      name: 'Pre / Regular IELTS',
      type: '雅思预备与常规备考',
      lessons: '雅思一对一4节 + Clinic中组2节 + 小组、选修、写作与自习',
      suitable: 'Pre 无入学分数要求；Regular 建议雅思3.5分以上。',
      icon: 'edit_note',
    },
    {
      name: 'IELTS Guarantee',
      type: '雅思保证班',
      lessons: '12周课程 + 周一至周三强化晚课 + 每周四模考',
      suitable: '适合目标明确、能接受严格出勤和模考要求的学生。',
      icon: 'workspace_premium',
    },
    {
      name: 'Pre / Regular / Guarantee TOEIC',
      type: '托业预备、常规与保证班',
      lessons: '托业一对一4节 + Clinic中组2节 + 小组、选修、写作与自习',
      suitable: '适合求职、升学或有600–900分目标的学生。',
      icon: 'verified',
    },
    {
      name: 'Business',
      type: '商务英语',
      lessons: '商务一对一5节 + 商务小组、综合中组、选修、写作与自习',
      suitable: '适合职场人士或准备英文工作场景的学生。',
      icon: 'business_center',
    },
    {
      name: 'Working Holiday',
      type: '打工度假英语',
      lessons: '生存英语、求职准备、面试表达和海外生活沟通',
      suitable: '适合准备海外生活、打工度假或长线旅行的人群。',
      icon: 'travel_explore',
    },
    {
      name: 'Callan ESL',
      type: '快速口语反应训练',
      lessons: '3节Callan一对一 + 2节ESL一对一 + 小组、选修、写作与自习',
      suitable: '适合想通过高频问答、即时纠错和重复训练加快英语反应的学生。',
      icon: 'record_voice_over',
    },
    {
      name: 'College Immersion（IAU）',
      type: 'IAU航空大学沉浸课程',
      lessons: 'ESL一对一4节 + 小组、中组、大组、选修、写作与自习',
      suitable: '想旁听IAU航空大学课程的学生应选择这一项；不是在Regular ESL上另加一节选修课。',
      icon: 'account_balance',
    },
  ];

  readonly campusBuildings = CIA_CAMPUS_BUILDINGS;

  readonly weekdaySchedule = CIA_WEEKDAY_SCHEDULE;

  readonly fridaySchedule = CIA_FRIDAY_SCHEDULE;

  readonly holidayCalendars = CIA_HOLIDAY_CALENDARS;

  // Transcribed from CIA's user-supplied 2027 IOC official test-date poster.
  // Keep separate from the 2026 exam types, fees and registration conditions.
  readonly ieltsComputerExamDates2027 = CIA_IELTS_COMPUTER_EXAM_DATES_2027;

  readonly ieltsExamDates2026 = CIA_IELTS_EXAM_DATES_2026;

  readonly campusMonthlyEvents2026: CampusMonthlyEvent[] = [
    { month: 1, icon: 'festival', title: '菲律宾文化节', text: '通过节庆主题活动认识菲律宾文化。', image: 'assets/cia/events-2026/01-cultural-festival.webp', imageAlt: 'CIA菲律宾文化节传统服饰表演', imagePosition: 'center 24%' },
    { month: 2, icon: 'favorite', title: '情人节特别活动', text: '校园主题互动与水果派对。', image: 'assets/cia/events-2026/02-valentine-fruit-party.webp', imageAlt: 'CIA情人节特别活动现场互动', imagePosition: 'center 30%' },
    { month: 3, icon: 'notifications_active', title: '金铃挑战赛', text: '结合各国文化服饰的趣味竞赛。', image: 'assets/cia/events-2026/03-golden-bell.webp', imageAlt: 'CIA金铃挑战赛参赛学生', imagePosition: 'center 28%' },
    { month: 4, icon: 'water', title: '夏日泡沫派对', text: '融入宋干节元素的夏日水上活动。', image: 'assets/cia/events-2026/04-summer-splash.webp', imageAlt: 'CIA夏日泡沫派对合影', imagePosition: 'center 34%' },
    { month: 5, icon: 'sports_basketball', title: 'CIA篮球赛', text: '在真实篮球比赛中以团队协作增进交流。', image: 'assets/cia/activity-sportsfest-official.webp', imageAlt: 'CIA校园篮球比赛实景', imagePosition: 'center 34%' },
    { month: 6, icon: 'mic', title: '开放麦克风与校庆', text: '开放舞台，并庆祝CIA创校周年。', image: 'assets/cia/events-2026/06-open-mic.webp', imageAlt: 'CIA开放麦克风比赛现场' },
    { month: 7, icon: 'music_note', title: 'CIA达人秀', text: '学生展示音乐、舞蹈与个人才艺。', image: 'assets/cia/events-2026/07-got-talent.webp', imageAlt: 'CIA达人秀学生舞台表演' },
    { month: 8, icon: 'styler', title: 'CIA校园风采活动', text: 'Mr. & Ms. CIA主题校园活动。', image: 'assets/cia/events-2026/08-mr-ms-cia.webp', imageAlt: 'Mr. and Ms. CIA校园风采活动合影' },
    { month: 9, icon: 'diversity_3', title: '世界文化舞蹈', text: '用舞蹈认识不同国家与文化。', image: 'assets/cia/events-2026/09-dances-around-world.webp', imageAlt: 'CIA世界文化舞蹈表演' },
    { month: 10, icon: 'celebration', title: '万圣节派对与员工日', text: '节日装扮、互动游戏与校园庆祝。', image: 'assets/cia/events-2026/10-halloween.webp', imageAlt: 'CIA万圣节服装活动舞台现场' },
    { month: 11, icon: 'public', title: 'CIA国际文化日', text: '各国学生参与文化展示与美食节。', image: 'assets/cia/events-2026/11-national-day.webp', imageAlt: 'CIA国际文化日学生展示现场' },
    { month: 12, icon: 'card_giftcard', title: 'CIA圣诞派对', text: '以圣诞主题活动为全年校园生活收尾。', image: 'assets/cia/events-2026/12-white-christmas.webp', imageAlt: 'CIA白色圣诞主题舞台活动' },
  ];

  readonly courseDetailGuides = CIA_COURSE_DETAIL_GUIDES;

  courseFees: CourseFee[] = [
    {
      id: 'regular-esl',
      name: 'Regular ESL',
      tuition: 900,
      tuition2027: 1000,
      ...this.courseFeeDetails['regular-esl'],
    },
    {
      id: 'intensive-esl',
      name: 'Intensive ESL',
      tuition: 1000,
      tuition2027: 1100,
      ...this.courseFeeDetails['intensive-esl'],
    },
    {
      id: 'power-intensive',
      name: 'Power Intensive',
      tuition: 1100,
      tuition2027: 1200,
      ...this.courseFeeDetails['power-intensive'],
    },
    {
      id: 'pre-toeic',
      name: 'Pre-TOEIC',
      tuition: 1000,
      tuition2027: 1100,
      ...this.courseFeeDetails['pre-toeic'],
    },
    {
      id: 'toeic-regular',
      name: 'TOEIC Regular',
      tuition: 1000,
      tuition2027: 1100,
      ...this.courseFeeDetails['toeic-regular'],
    },
    {
      id: 'toeic-guarantee',
      name: 'TOEIC Guarantee',
      tuition: 1000,
      tuition2027: 1100,
      ...this.courseFeeDetails['toeic-guarantee'],
    },
    {
      id: 'pre-ielts',
      name: 'Pre-IELTS',
      tuition: 1050,
      tuition2027: 1150,
      ...this.courseFeeDetails['pre-ielts'],
    },
    {
      id: 'ielts-regular',
      name: 'IELTS Regular',
      tuition: 1050,
      tuition2027: 1150,
      ...this.courseFeeDetails['ielts-regular'],
    },
    {
      id: 'ielts-guarantee',
      name: 'IELTS Guarantee',
      tuition: 1050,
      tuition2027: 1150,
      ...this.courseFeeDetails['ielts-guarantee'],
    },
    {
      id: 'business',
      name: 'Business',
      tuition: 1050,
      tuition2027: 1150,
      ...this.courseFeeDetails['business'],
    },
    {
      id: 'working-holiday',
      name: 'Working Holiday',
      tuition: 950,
      tuition2027: 1050,
      ...this.courseFeeDetails['working-holiday'],
    },
    {
      id: 'callan-esl',
      name: 'Callan ESL',
      tuition: 1050,
      tuition2027: 1050,
      ...this.courseFeeDetails['callan-esl'],
    },
    {
      id: 'college-immersion',
      name: 'College Immersion（IAU大学沉浸）',
      tuition: 1000,
      tuition2027: 1100,
      ...this.courseFeeDetails['college-immersion'],
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '06:40 - 08:00',
      title: '早餐与晨间测试',
      text: '早餐时段为06:40–08:00；周一至周四07:20–08:00进行单词或课程测试。',
    },
    {
      time: '08:00 - 12:05',
      title: '上午课程',
      text: '一对一、小组课或考试专项课，按课程表安排。',
    },
    {
      time: '12:05 - 13:05',
      title: '午餐与休息',
      text: '校内餐厅用餐，下午课程前整理学习资料。',
    },
    {
      time: '13:05 - 15:30',
      title: '下午课程',
      text: '小组课、专项训练、口语或语法词汇课程。',
    },
    {
      time: '15:35 - 18:00',
      title: '下午课程、写作与自习',
      text: '继续一对一、团体或选修课程，并按所选课程完成写作和自习。',
    },
    {
      time: '18:00 - 22:00',
      title: '晚餐与自由时间',
      text: '18:00–19:00晚餐，19:00–22:00自由活动；保证班另有指定晚间学习安排。',
    },
    {
      time: '周五 17:10 - 18:00',
      title: '演讲、朗读或月度活动',
      text: '周五采用40分钟课节，下午安排演讲/朗读比赛或每月大型活动。',
    },
  ];

  roomFees: RoomFee[] = [
    {
      id: 'p1',
      name: '豪华单人间 P-1',
      fee: 1700,
      note: '豪华单人间多了一个电磁炉，可以简单加热食物',
    },
    {
      id: 's1',
      name: '标准单人间 S-1',
      fee: 1500,
      note: '标准单人间，适合重视独立空间的学生',
    },
    {
      id: 'pn1',
      name: '校外单人间 PN-1',
      fee: 1700,
      note: '在学校对面的4号楼',
    },
    {
      id: 'd2',
      name: '双人间 D-2',
      fee: 1100,
      note: '双人间，适合朋友同行或希望平衡预算',
    },
    { id: 'd3', name: '三人间 D-3', fee: 850, note: '预算比双人间更低' },
    {
      id: 'd4',
      name: '四人间 D-4',
      fee: 750,
      note: '默认报价参考，预算压力较低',
    },
    {
      id: 'sr1',
      name: '单人套房 SR-1',
      fee: 2500,
      note: '套房房型，空间更完整',
    },
    {
      id: 'sr2',
      name: '双人套房 SR-2',
      fee: 1400,
      note: '套房房型，适合两人入住',
    },
    {
      id: 'sr3',
      name: '三人套房 SR-3',
      fee: 1200,
      note: '套房房型，适合小组同行',
    },
    {
      id: 'sr4',
      name: '四人套房 SR-4',
      fee: 1100,
      note: '套房房型，预算和空间较平衡',
    },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: '8,000比索', note: '无菲律宾长期签证者需办理' },
    { item: 'SSP E-card', amount: '4,500比索', note: '办理SSP时同时办理' },
    { item: '综合管理费', amount: '4,000比索', note: '每4周 / 人' },
    { item: '水费', amount: '1,000比索', note: '每4周参考' },
    { item: '电费', amount: '2,000比索', note: '每4周基础额度，超额按当地电价另计' },
    { item: '教材费', amount: '2,000比索', note: '每套约使用8周，按课程及进度调整' },
    { item: '照片费', amount: '200比索', note: '一次性费用' },
    { item: '房间押金', amount: '2,500比索', note: '退房检查后按学校规定退还' },
    { item: '周末接机', amount: '1,000比索', note: '宿务机场接机' },
    { item: '工作日接机', amount: '1,500比索', note: '宿务机场接机' },
    {
      item: 'ACR I-card',
      amount: '4,500比索',
      note: '长期学习或延签时可能需要',
    },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '确认是否适合',
      text: '先了解学习目标、预算、房型偏好、年龄和入学时间，判断 CIA 是否匹配。',
    },
    {
      icon: 'fact_check',
      title: '确认课程、空房和优惠',
      text: '免费协助确认课程、房型、空房、优惠和正式报价，避免只按网页价格做决定。',
    },
    {
      icon: 'assignment_turned_in',
      title: '协助入境和签证手续',
      text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。',
    },
    {
      icon: 'inventory',
      title: '发送学习资料和行前清单',
      text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。',
    },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学说明',
    '分级测试',
    '课程咨询',
    '学生经理',
    '宿舍清洁',
    '洗衣服务',
    '医务室',
    '24小时保安',
    '证件协助',
  ];

  readonly campusActivities = [
    '新生说明会',
    '文化交流',
    '体育活动',
    '节日活动',
    '校内比赛与趣味活动',
  ];

  readonly weekendActivities = [
    '跳岛游',
    '海边活动',
    '商场购物',
    '城市观光',
    '学生自发聚会',
  ];

  readonly notes = [
    '热门房型、暑假和寒假档期建议尽早确认空房。',
    '菲律宾公共假期可能影响课程安排，通常不补课。',
    '到校支付费用会随学校政策、汇率和个人情况变化。',
    '未成年学生、亲子学生和长期学习学生，需要提前确认额外规则。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];

  readonly faqs = CIA_FAQS;

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '报名流程', target: 'service-process', icon: 'task_alt' },
    { label: '常见问题', target: 'faq', icon: 'help' },
  ];

  readonly mobileAnchors = CIA_MOBILE_ANCHORS;

  readonly snapshotCards = CIA_SNAPSHOT_CARDS;

  readonly videoCards = CIA_VIDEO_CARDS;

  get displayedVideoCards(): CiaVideoCard[] {
    return [...this.videoCards, ...this.uploadedVideoCards];
  }

  readonly courseChoiceCards = CIA_COURSE_CHOICE_CARDS;

  readonly studentCareServices = CIA_STUDENT_CARE_SERVICES;

  readonly campusPracticalGuides = CIA_CAMPUS_PRACTICAL_GUIDES;

  roomRateGroups: RoomRateGroup[] = [
    {
      title: '单人间',
      rooms: [
        { id: 'p1', label: '豪华单人间', code: 'P-1', location: '校内' },
        { id: 'pn1', label: '校外单人间', code: 'PN-1', location: '校外' },
        { id: 's1', label: '标准单人间', code: 'S-1', location: '校内' },
      ],
    },
    {
      title: '普通多人间',
      rooms: [
        { id: 'd2', label: '双人间', code: 'D-2', location: '校内' },
        { id: 'd3', label: '三人间', code: 'D-3', location: '校内' },
        { id: 'd4', label: '四人间', code: 'D-4', location: '校内' },
      ],
    },
    {
      title: '家庭精致套房',
      rooms: [
        { id: 'sr1', label: '单人套房', code: 'SR-1', location: '校内' },
        { id: 'sr2', label: '双人套房', code: 'SR-2', location: '校内' },
        { id: 'sr3', label: '三人套房', code: 'SR-3', location: '校内' },
        { id: 'sr4', label: '四人套房', code: 'SR-4', location: '校内' },
      ],
    },
  ];

  readonly roomComparisonProfiles = CIA_ROOM_COMPARISON_PROFILES;

  readonly studentTracks = CIA_STUDENT_TRACKS;

  readonly officialStudentReviews = CIA_STUDENT_REVIEWS;

  readonly sidaCiaReasons = CIA_SIDA_REASONS;

  readonly sidaCiaTrustBadges = CIA_SIDA_TRUST_BADGES;

  readonly ctaBadges = CIA_CTA_BADGES;

  readonly ctaConsultants = CIA_CTA_CONSULTANTS;

  ngOnInit(): void {
    this.loadExtendedPageStyles();
    this.loadExchangeRates();
    this.applySessionPreview();
    this.loadPricingFromDatabase();
    this.loadGalleryFromDatabase();
  }

  ngAfterViewInit(): void {
    if (this.isEditorPreview) {
      this.previewHost.nativeElement.classList.add('cia-editor-preview');
      window.parent.postMessage({ type: 'cia-content-ready' }, window.location.origin);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.previewFocusTimer);
  }

  @HostListener('window:message', ['$event'])
  applyEditorPreview(event: MessageEvent): void {
    if (!this.isEditorPreview || event.origin !== window.location.origin || event.source !== window.parent) {
      return;
    }
    const message = event.data as { type?: string; content?: CiaContentConfig; target?: CiaPreviewTarget; scroll?: boolean };
    if (message?.type === 'cia-content-preview' && message.content) {
      this.applyContentConfig(message.content);
      if (isCiaPreviewTarget(message.target)) this.previewTarget = message.target;
      this.queuePreviewFocus(message.scroll === true);
    }
  }

  private queuePreviewFocus(scroll: boolean): void {
    if (!this.isEditorPreview || !this.previewTarget) return;
    clearTimeout(this.previewFocusTimer);
    // Wait for Angular to render the edited rows before measuring their position.
    this.previewFocusTimer = setTimeout(() => {
      const target = this.previewTarget!;
      const root = this.previewHost.nativeElement;
      const result = resolveCiaPreviewTarget(root, target);
      const fallback = result.elements[0]?.dataset;
      this.previewHighlightTarget = result.exact ? target : fallback
        ? { kind: 'section', id: fallback['ciaPreviewId'] ?? '' } : undefined;
      for (const element of result.elements) {
        if (scroll) revealCiaPreviewElement(element);
      }
      if (scroll && result.elements[0]) scrollCiaPreviewElement(result.elements[0]);
      const item = target.kind === 'course' ? this.previewContent?.courses.find(item => item.id === target.id)
        : target.kind === 'room' ? this.previewContent?.rooms.find(item => item.id === target.id)
          : target.kind === 'fee' ? this.previewContent?.localFees.find(item => item.id === target.id)
            : target.kind === 'promotion' ? this.previewContent?.quoteSettings.promotions.find(item => item.id === target.id) : undefined;
      const status = item?.enabled === false ? '此项已隐藏或停用，官网不会显示；已定位到所属板块。'
        : !result.exact && target.kind === 'promotion' ? '当前试算未产生此优惠明细（请核对日期、方案及叠加条件）；已定位到优惠显示区域。'
          : !result.exact && target.id === 'quote-season' ? '当前试算未产生旺季附加费；已定位到费用明细区域。'
            : result.exact ? '橙色框内就是对应的官网内容。修改会在这里即时显示。'
              : '当前试算未显示此项，已定位到所属板块。';
      window.parent.postMessage({ type: 'cia-content-located', target, status }, window.location.origin);
    });
  }

  isPreviewHighlighted(kind: string, id: string): boolean {
    return this.isEditorPreview && this.previewHighlightTarget?.kind === kind && this.previewHighlightTarget?.id === id;
  }

  trackPreviewRow(index: number): number {
    // Calculated getters return new objects; retain row DOM through focus/click/change detection.
    return index;
  }

  @HostListener('click', ['$event'])
  selectPreviewEditorItem(event: MouseEvent): void {
    if (!this.isEditorPreview || !(event.target instanceof Element)) return;
    const element = event.target.closest<HTMLElement>('[data-cia-preview-kind]');
    const target = { kind: element?.dataset['ciaPreviewKind'], id: element?.dataset['ciaPreviewId'] };
    if (!isCiaPreviewTarget(target)) return;
    this.previewTarget = target;
    this.queuePreviewFocus(false);
    window.parent.postMessage({ type: 'cia-content-select', ...target }, window.location.origin);
  }

  private loadExtendedPageStyles(): void {
    if (typeof document === 'undefined' || document.getElementById('cia-page-extended-styles')) {
      return;
    }

    const stylesheet = document.createElement('link');
    stylesheet.id = 'cia-page-extended-styles';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'assets/cia/cia-page-extended.css';
    document.head.appendChild(stylesheet);
  }

  private loadExchangeRates(): void {

  }

  private loadPricingFromDatabase(): void {
    this.schoolService
      .getSchools({ name: this.ciaPricingSchoolName })
      .pipe(
        switchMap((schools) => {
          const ciaSchool =
            schools.find(
              (school) => school.name === this.ciaPricingSchoolName,
            ) ??
            schools.find((school) =>
              school.name.toLowerCase().includes('cia'),
            ) ??
            schools[0];

          if (!ciaSchool?.id) {
            return EMPTY;
          }

          return forkJoin({
            lessons: this.schoolService.getSchoolLessons({
              schoolId: ciaSchool.id,
              week: 4,
            }),
            rooms: this.schoolService.getSchoolRooms({
              schoolId: ciaSchool.id,
              week: 4,
            }),
            fees: this.schoolService.getSchoolFees({ schoolId: ciaSchool.id }),
            published: this.schoolContentService
              .getPublished<CiaContentConfig>(ciaSchool.id)
              .pipe(catchError(() => of(null))),
          });
        }),
        catchError(() => EMPTY),
      )
      .subscribe(({ lessons, rooms, fees, published }) => {
        this.applyPricingData(lessons, rooms, fees);
        const preview = this.readSessionPreview();
        if (preview) {
          this.applyContentConfig(preview);
        } else if (published?.content) {
          this.applyContentConfig(published.content);
        }
      });
  }

  private applySessionPreview(): void {
    const preview = this.readSessionPreview();
    if (preview) {
      this.applyContentConfig(preview);
    }
  }

  private readSessionPreview(): CiaContentConfig | null {
    if (
      typeof sessionStorage === 'undefined' ||
      this.route.snapshot.queryParamMap.get('contentPreview') !== '1'
    ) {
      return null;
    }
    try {
      const raw = sessionStorage.getItem('cia-content-preview');
      if (!raw) return null;
      const value = JSON.parse(raw) as CiaContentConfig;
      return value?.schemaVersion === 1 && value.schoolCode === 'CIA' ? value : null;
    } catch {
      return null;
    }
  }

  private applyContentConfig(value: CiaContentConfig): void {
    if (value?.schemaVersion !== 1 || value.schoolCode !== 'CIA') {
      return;
    }
    const content = cloneCiaContentConfig(value);
    this.previewContent = content;
    // Prices and rules for the calculator; the mini program applies the same function.
    applyCiaQuoteContent(this, content);
    const rooms = content.rooms
      .filter(item => item.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    if (rooms.length > 0) {
      const groupNames = [...new Set(rooms.map(item => item.group))];
      this.roomRateGroups = groupNames.map(title => ({
        title,
        rooms: rooms
          .filter(item => item.group === title)
          .map(item => ({
            id: item.id,
            label: item.label,
            code: item.code,
            location: item.location,
          })),
      }));
    }

    this.localFees = content.localFees
      .filter(item => item.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(item => ({
        item: item.name,
        amount: this.formatPhp(item.amount),
        note: item.note,
      }));
    const settings = content.quoteSettings;
    this.localFeeIntro = settings.localFeeIntro;
    this.courseTableTitle = settings.courseTableTitle;
    this.courseTableNote = settings.courseTableNote;
    this.groupClassNote = settings.groupClassNote;
    this.roomTableTitle = settings.roomTableTitle;
    this.roomTableNote = settings.roomTableNote;
    this.stayPolicyTitle = settings.stayPolicyTitle;
    this.stayPolicies = settings.stayPolicies;
    this.extraNightRates = settings.extraNightRates;

    this.quote.retainValidSelections();
    this.queuePreviewFocus(false);
  }

  private loadGalleryFromDatabase(): void {
    this.schoolService
      .getSchools({ name: this.ciaPricingSchoolName })
      .pipe(
        switchMap((schools) => {
          const ciaSchool =
            schools.find(
              (school) => school.name === this.ciaPricingSchoolName,
            ) ??
            schools.find((school) =>
              school.name.toLowerCase().includes('cia'),
            ) ??
            schools[0];

          if (!ciaSchool?.id) {
            return EMPTY;
          }

          return this.schoolService.getSchoolPhotos({
            schoolId: ciaSchool.id,
            isActive: true,
          });
        }),
        catchError(() => EMPTY),
      )
      .subscribe((photos) => this.applyGalleryPhotos(photos));
  }

  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    const uploadedMedia = (photos ?? [])
      .filter((photo) => Boolean(photo.url))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    if (uploadedMedia.length === 0) {
      return;
    }

    const uploadedPhotos = uploadedMedia.filter(photo =>
      !photo.contentType || photo.contentType.toLowerCase().startsWith('image/'));
    const uploadedVideos = uploadedMedia.filter(photo =>
      photo.contentType?.toLowerCase().startsWith('video/'));

    const existingSources = new Set(
      this.galleryImages.map((image) => image.src),
    );
    const uploadedGalleryImages = uploadedPhotos
      .map((photo) => ({
        category: this.resolveUploadedPhotoCategory(photo.category),
        title:
          photo.caption ||
          photo.altText ||
          photo.originalFileName ||
          'CIA Cebu photo',
        description: photo.altText || photo.caption || 'CIA Cebu school photo',
        src: photo.url ?? '',
      }))
      .filter((image) => !existingSources.has(image.src));

    if (uploadedGalleryImages.length > 0) {
      this.usingUploadedGallery = true;
      this.galleryImages = [...this.galleryImages, ...uploadedGalleryImages];
    }

    const existingVideos = new Set(this.videoCards.map(item => item.videoSrc));
    this.uploadedVideoCards = uploadedVideos
      .filter(photo => !!photo.url && !existingVideos.has(photo.url))
      .map(photo => ({
        code: 'SCHOOL',
        title: photo.caption || photo.originalFileName || 'CIA 学校视频',
        text: photo.altText || `${this.resolveUploadedPhotoCategory(photo.category)}实景视频`,
        videoSrc: photo.url ?? '',
        contentType: photo.contentType ?? 'video/mp4',
        details: [`官网分类：${this.resolveUploadedPhotoCategory(photo.category)}`],
      }));
  }

  private applyPricingData(
    lessons: SchoolLessonDTO[],
    rooms: SchoolRoomDTO[],
    fees: SchoolFeeDTO[],
  ): void {
    const databaseCourseFees = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => {
        const id = this.slugifyPriceKey(lesson.name);
        const details = this.courseFeeDetails[id];

        return {
          id,
          name: lesson.name,
          tuition: lesson.price,
          tuition2027:
            this.courseFees.find((course) => course.id === id)?.tuition2027 ??
            lesson.price,
          suitable:
            lesson.description ||
            details?.suitable ||
            lesson.note ||
            '请联系顾问确认适合人群',
          schedule:
            details?.schedule || lesson.note || '请联系顾问确认课表安排',
          note: details?.note || '最终以学校当期报价和课程安排为准。',
          highlightNote: details?.highlightNote,
        };
      })
      .sort(
        (a, b) =>
          this.orderIndex(this.courseFeeOrder, a.id) -
          this.orderIndex(this.courseFeeOrder, b.id),
      );

    if (databaseCourseFees.length > 0) {
      const mergedCourseFees = this.courseFees.map((course) => {
        const databaseCourse = databaseCourseFees.find(
          (item) => item.id === course.id,
        );

        return databaseCourse
          ? {
              ...course,
              name: databaseCourse.name,
              tuition: databaseCourse.tuition,
              suitable: databaseCourse.suitable || course.suitable,
            }
          : course;
      });
      const extraDatabaseCourseFees = databaseCourseFees.filter(
        (course) => !this.courseFees.some((item) => item.id === course.id),
      );

      this.courseFees = [...mergedCourseFees, ...extraDatabaseCourseFees].sort(
        (a, b) =>
          this.orderIndex(this.courseFeeOrder, a.id) -
          this.orderIndex(this.courseFeeOrder, b.id),
      );
      if (
        !this.courseFees.some((course) => course.id === this.selectedCourseId)
      ) {
        this.selectedCourseId = this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({
        id: this.createRoomId(room.name),
        name: room.name,
        fee: room.price,
        note: room.description || '请联系顾问确认空房',
      }))
      .sort(
        (a, b) =>
          this.orderIndex(this.roomFeeOrder, a.id) -
          this.orderIndex(this.roomFeeOrder, b.id),
      );

    if (databaseRoomFees.length > 0) {
      const hasCompleteDatabaseRoomFees = this.roomFeeOrder.every((roomId) =>
        databaseRoomFees.some((room) => room.id === roomId),
      );
      const mergedRoomFees = this.roomFees.map((room) => {
        const databaseRoom = hasCompleteDatabaseRoomFees
          ? (databaseRoomFees.find(
              (item) => item.id === room.id && item.name === room.name,
            ) ?? databaseRoomFees.find((item) => item.id === room.id))
          : undefined;

        return databaseRoom
          ? {
              ...room,
              name: databaseRoom.name,
              fee: databaseRoom.fee,
              note: databaseRoom.note || room.note,
            }
          : room;
      });
      const extraDatabaseRoomFees = databaseRoomFees.filter(
        (room) => !this.roomFees.some((item) => item.id === room.id),
      );

      this.roomFees = [...mergedRoomFees, ...extraDatabaseRoomFees].sort(
        (a, b) =>
          this.orderIndex(this.roomFeeOrder, a.id) -
          this.orderIndex(this.roomFeeOrder, b.id),
      );
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId = this.roomFees[this.roomFees.length - 1].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
    }

    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费');
    if (peakSeasonFee) {
      this.seasonalFeePerWeek = peakSeasonFee.fee;
    }

    const databaseLocalFees = fees
      .filter((fee) => this.currencyCodeForDisplay(fee.currencyCode) === '比索')
      .map((fee) => ({
        item: fee.name,
        amount: this.formatCurrencyAmount(fee),
        note: this.cleanFeeDescription(fee.description),
      }));

    if (databaseLocalFees.length > 0) {
      this.localFees = databaseLocalFees;
    }
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
    this.selectedGalleryImageIndex = 0;
  }

  selectGalleryImage(index: number): void {
    const lastIndex = Math.max(this.displayedGalleryImages.length - 1, 0);
    this.selectedGalleryImageIndex = Math.min(Math.max(index, 0), lastIndex);
  }

  previousGalleryImage(): void {
    const length = this.displayedGalleryImages.length;
    if (length > 0) {
      this.selectedGalleryImageIndex =
        (this.selectedGalleryImageIndex - 1 + length) % length;
    }
  }

  nextGalleryImage(): void {
    const length = this.displayedGalleryImages.length;
    if (length > 0) {
      this.selectedGalleryImageIndex =
        (this.selectedGalleryImageIndex + 1) % length;
    }
  }

  openGalleryFromPreview(event?: Event): void {
    this.setGalleryCategory(this.galleryCategories[0]);
    this.scrollToSection('gallery', event);
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();

    const targetElement = document.getElementById(target);

    if (!targetElement) {
      return;
    }

    const headerOffset =
      window.innerWidth <= 760 ? 136 : window.innerWidth <= 1099 ? 208 : 136;
    const targetTop =
      targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    });

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${target}`,
    );
  }

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === this.galleryCategories[0]) {
      return this.galleryImages;
    }

    return this.galleryImages.filter(
      (image) => image.category === this.selectedGalleryCategory,
    );
  }

  selectHeroGalleryImage(index: number): void {
    const lastIndex = Math.max(this.heroGalleryPreviewImages.length - 1, 0);
    this.selectedHeroImageIndex = Math.min(Math.max(index, 0), lastIndex);
  }

  get displayedGalleryImages(): GalleryImage[] {
    return this.filteredGalleryImages;
  }

  get selectedGalleryImage(): GalleryImage {
    return (
      this.displayedGalleryImages[this.selectedGalleryImageIndex] ??
      this.displayedGalleryImages[0] ??
      this.galleryImages[0]
    );
  }

  get displayedGalleryImageSources(): string[] {
    return this.displayedGalleryImages.map((image) => image.src);
  }

  get displayedGalleryImageTitles(): string[] {
    return this.displayedGalleryImages.map((image) => image.title);
  }

  get displayedGalleryImageCaptions(): string[] {
    return this.displayedGalleryImages.map((image) => image.description);
  }

  get displayedGalleryImageAlts(): string[] {
    return this.displayedGalleryImages.map(
      (image) => `${image.category}实景：${image.title}`,
    );
  }

  get selectedRoomGalleryTitles(): string[] {
    return this.selectedRoomProfile.gallery.map(
      (_, index) =>
        `${this.selectedRoomProfile.label} · ${index === 0 ? '主要空间' : `细节实景 ${index + 1}`}`,
    );
  }

  get selectedRoomGalleryCaptions(): string[] {
    return this.selectedRoomProfile.gallery.map(
      (_, index) =>
        `${this.selectedRoomProfile.bookingCode} ${this.selectedRoomProfile.location}房型 · 第${index + 1}张实景`,
    );
  }

  get selectedRoomGalleryAlts(): string[] {
    return this.selectedRoomGalleryTitles.map((title) => `${title}照片`);
  }

  galleryImagesForCategory(
    category: Exclude<GalleryCategory, '全部'>,
  ): GalleryImage[] {
    return this.galleryImages.filter((image) => image.category === category);
  }

  galleryAlbumDescription(
    category: Exclude<GalleryCategory, '全部'>,
  ): string {
    return CIA_GALLERY_ALBUM_DESCRIPTIONS[category];
  }

  get heroGalleryPreviewImages(): GalleryImage[] {
    if (this.usingUploadedGallery) {
      return this.galleryImages.slice(0, 4);
    }

    return this.galleryImages
      .filter((image) =>
        this.featuredGalleryCategories.includes(image.category),
      )
      .slice(0, 4);
  }

  get selectedHeroGalleryImage(): GalleryImage {
    return (
      this.heroGalleryPreviewImages[this.selectedHeroImageIndex] ??
      this.heroGalleryPreviewImages[0] ??
      this.galleryImages[0]
    );
  }

  get selectedHeroGalleryImages(): GalleryImage[] {
    const images = this.heroGalleryPreviewImages;
    const selected = images[this.selectedHeroImageIndex] ?? images[0];

    if (!selected) {
      return [];
    }

    return [selected, ...images.filter((image) => image !== selected)];
  }

  get selectedHeroGallerySources(): string[] {
    return this.selectedHeroGalleryImages.map((image) => image.src);
  }

  get selectedHeroGalleryTitles(): string[] {
    return this.selectedHeroGalleryImages.map((image) => image.title);
  }

  get selectedHeroGalleryCaptions(): string[] {
    return this.selectedHeroGalleryImages.map((image) => image.description);
  }

  get selectedHeroGalleryAlts(): string[] {
    return this.selectedHeroGalleryImages.map(
      (image) => `${image.category}实景：${image.title}`,
    );
  }

  get selectedCourse(): CourseFee {
    return (
      this.courseFees.find((course) => course.id === this.selectedCourseId) ??
      this.courseFees[0]
    );
  }

  get iauRegistrationFeeNote(): string { return this.quote.iauRegistrationFeeNote; }

  get selectedRoom(): RoomFee {
    return (
      this.roomFees.find((room) => room.id === this.selectedRoomId) ??
      this.roomFees[this.roomFees.length - 1]
    );
  }

  get tuitionForSelectedWeeks(): number { return this.quote.tuitionForSelectedWeeks; }

  get uses2027Tuition(): boolean {
    return (
      this.parseDate(this.selectedRegistrationDate) >=
        this.parseDate(this.futurePriceRegistrationStart) &&
      this.parseDate(this.selectedStartDate) >= this.parseDate(this.futurePriceArrivalStart)
    );
  }

  get selectedCourseBaseTuition(): number {
    return this.uses2027Tuition
      ? this.selectedCourse.tuition2027
      : this.selectedCourse.tuition;
  }

  get appliedTuitionLabel(): string {
    return this.uses2027Tuition ? '2027新价格' : '2026原价格';
  }

  get tuitionRuleSummary(): string {
    return this.uses2027Tuition
      ? '按当前报价日期与预计入学日期估算为2027新课程费；最终以学校实际收到报名及确认入学日期为准。'
      : '按当前报价日期与预计入学日期估算为2026原价格；最终以学校实际收到报名及确认入学日期为准。';
  }

  get roomFeeForSelectedWeeks(): number { return this.quote.roomFeeForSelectedWeeks; }

  private get priceRatioForSelectedWeeks(): number {
    return (
      this.shortTermPriceRatios[this.selectedWeeks] ?? this.selectedWeeks / 4
    );
  }

  get peakSeasonWeeks(): number { return this.quote.peakSeasonWeeks; }
  get isPeakSeason(): boolean { return this.quote.isPeakSeason; }
  get seasonalSurcharge(): number { return this.quote.seasonalSurcharge; }
  get coveredPeakSeasonLabels(): string { return this.quote.coveredPeakSeasonLabels; }
  get peakSeasonStatusText(): string { return this.quote.peakSeasonStatusText; }

  get peakSeasonRangeText(): string {
    return this.peakSeasonRanges
      .filter(({ enabled }) => enabled)
      .map(({ label, start, end }) =>
        `${label} ${start.replace(/-/g, '/')}–${end.replace(/-/g, '/')}`,
      )
      .join('；');
  }

  get peakSeasonCalendarRanges(): CiaPeakSeasonRange[] { return this.quote.peakSeasonCalendarRanges; }
  get peakSeason2027RangeText(): string { return this.quote.peakSeason2027RangeText; }

  peakSeasonWeekCount(range: CiaPeakSeasonRange): number {
    const start = this.parseDate(range.start).getTime();
    const end = this.parseDate(range.end).getTime();
    return Math.max(0, Math.round((end - start + 86400000) / (7 * 86400000)));
  }

  formatPeakSeasonRange(range: CiaPeakSeasonRange): string { return this.quote.formatPeakSeasonRange(range); }

  get isChristmasPromotionEligible(): boolean { return this.quote.isChristmasPromotionEligible; }
  get payableRegistrationFee(): number { return this.quote.payableRegistrationFee; }
  get sidaDiscountAmount(): number { return this.quote.sidaDiscountAmount; }
  get christmasDiscountAmount(): number { return this.quote.christmasDiscountAmount; }
  get totalDiscountAmount(): number { return this.quote.totalDiscountAmount; }
  get quoteUsd(): number { return this.quote.quoteUsd; }
  get quoteUsdText(): string { return this.quote.quoteUsdText; }
  get quoteCnyText(): string { return this.quote.quoteCnyText; }
  get exchangeRateDateText(): string { return this.quote.exchangeRateDateText; }
  get exchangeRateSummary(): string { return this.quote.exchangeRateSummary; }
  get estimatedLocalFees(): LocalFeeEstimate[] { return this.quote.estimatedLocalFees; }
  get estimatedLocalFeeTotal(): number { return this.quote.estimatedLocalFeeTotal; }
  get estimatedLocalFeeCny(): number { return this.quote.estimatedLocalFeeCny; }
  formatPhp(value: number): string { return this.quote.formatPhp(value); }

  formatPesoText(value: string): string {
    return value.replace(/₱\s*([0-9][0-9,]*)/g, '$1比索');
  }

  formatFeeQuantity(value: number): string { return this.quote.formatFeeQuantity(value); }

  shortStayPercent(weeks: number): string {
    return `${Math.round((this.shortTermPriceRatios[String(weeks)] ?? weeks / 4) * 100)}%`;
  }

  previewFeeId(name: string): string {
    return this.localFeeRules.find(rule => rule.name === name.replace(/^学生[\d、]+ · /, ''))?.id ?? '';
  }

  get discountText(): string {
    const rule = this.promotions.find(item =>
      item.enabled && item.discountType === 'percentage' &&
      item.appliesTo === 'tuition-and-accommodation');
    return rule ? `${100 - rule.discountValue}折` : '无固定折扣';
  }

  formatUsd(value: number): string { return this.quote.formatUsd(value); }

  get quoteImageData() { return this.quote.quoteImageData; }

  private resolveUploadedPhotoCategory(
    category?: string,
  ): Exclude<GalleryCategory, '全部'> {
    const normalizedCategory = (category ?? '').trim().toLowerCase();
    const categoryIndex =
      this.uploadedPhotoCategoryIndexes[normalizedCategory] ?? 1;

    return this.galleryCategories[categoryIndex] as Exclude<
      GalleryCategory,
      '全部'
    >;
  }

  private slugifyPriceKey(value: string): string {
    return value
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);

    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  private createRoomId(name: string): string {
    const roomCode = name.match(/\b((?:pn|sr)|[psd])\s*-?\s*(\d)\b/i);

    if (roomCode) {
      return `${roomCode[1].toLowerCase()}${roomCode[2]}`;
    }

    return this.slugifyPriceKey(name);
  }

  private currencyCodeForDisplay(code?: string): string {
    if (!code) {
      return '美元';
    }

    const normalizedCode = code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();

    if (normalizedCode === 'USD') {
      return '美元';
    }

    return normalizedCode === 'PHP' ? '比索' : normalizedCode;
  }

  private formatCurrencyAmount(fee: SchoolFeeDTO): string {
    const currencyCode = this.currencyCodeForDisplay(fee.currencyCode);

    return `${currencyCode} ${fee.fee.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1,
      maximumFractionDigits: 1,
    })}`;
  }

  private cleanFeeDescription(description?: string): string {
    if (!description) {
      return '以学校现场收费为准';
    }

    return description
      .replace(/^到校支付费用；/, '')
      .replace(/^前期支付费用；/, '');
  }

  roomFeeFor(id: string): number {
    return this.roomFees.find((room) => room.id === id)?.fee ?? 0;
  }

  roomsForRateGroup(group: RoomRateGroup): RoomRateOption[] {
    return group.rooms;
  }

  setRoomProfile(profileId: string): void {
    this.selectedRoomProfileId = profileId;
  }

  get selectedRoomProfile(): RoomComparisonProfile {
    return (
      this.roomComparisonProfiles.find((profile) => profile.id === this.selectedRoomProfileId) ??
      this.roomComparisonProfiles[0]
    );
  }

  private nextSundayDate(): string {
    const date = new Date();
    const daysUntilSunday = (7 - date.getDay()) % 7;
    date.setDate(date.getDate() + daysUntilSunday);
    return this.formatLocalDate(date);
  }

  private formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseDate(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }

  private readonly quoteRateSync = connectQuoteRates(this, inject(ExchangeRateService));
  readonly quoteCurrencyText = quoteCurrencyText;
}
