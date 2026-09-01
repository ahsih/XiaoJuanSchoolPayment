import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿';
type WeekOption = 4 | 8 | 12 | 16 | 20 | 24;
type RoomId =
  | 'deluxe-triple'
  | 'deluxe-twin'
  | 'deluxe-single'
  | 'premium-twin'
  | 'premium-single'
  | 'premium-suite'
  | 'premium-studio-twin'
  | 'premium-studio-single'
  | 'premium-studio-triple-use'
  | 'premium-studio-quad-use'
  | 'eco-villa-single'
  | 'eco-villa-exclusive-twin'
  | 'eco-villa-exclusive-triple';
type CourseId =
  | 'eco-relax-lite'
  | 'eco-relax-plus'
  | 'eco-hub'
  | 'eco-sparta'
  | 'test-course'
  | 'junior-lite'
  | 'junior-esl'
  | 'junior-test'
  | 'toeic-guarantee'
  | 'ielts-guarantee';

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

interface CourseOption {
  id: CourseId;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  tuition4w?: number;
  tuitionByWeeks?: Partial<Record<WeekOption, number>>;
  allowedWeeks?: WeekOption[];
}

interface RoomOption {
  id: RoomId;
  name: string;
  note: string;
  fee4w: number;
  isTotalPrice?: boolean;
}

interface LocalFee {
  item: string;
  amount: string;
  note: string;
  quantity: number;
  total: number;
  optional?: boolean;
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
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SidaWhySectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './anj-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './anj-school.component.css',
  ],
})
export class AnjSchoolComponent implements OnInit {
  private readonly exchangeRateService = inject(ExchangeRateService);
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly weekOptions: WeekOption[] = [4, 8, 12, 16, 20, 24];
  selectedCourseId: CourseId = 'eco-relax-lite';
  selectedRoomId: RoomId = 'deluxe-triple';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  selectedPickupAirport: 'clark' | 'manila' = 'clark';
  quoteCalculated = false;

  readonly registrationFeeUsd = 100;
  readonly registrationDiscountUsd = 100;
  readonly sidaDiscountRate = 0.95;
  readonly peakSurchargePerWeekUsd = 40;
  usdToCny = 7.2;
  phpPerCny = 7.75;
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
      value: '2026年USD费用',
      note: '本页按公开2026费用表估算，报名仍需以学校正式invoice和空房回复为准。',
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
    { label: '4周起价', value: 'USD 1,550起：Eco Relax Lite + Deluxe Triple + 入学金USD 100。当地PHP费用另计。' },
  ];

  readonly highlights: TextCard[] = [
    {
      title: 'ECO Campus，一体式生活学习环境',
      text: '官网强调classes、dorms、dining和study spaces都在步行范围内，适合想把通勤和日常杂事压低的人。',
    },
    {
      title: '课程强度跨度大',
      text: 'Eco Relax Lite适合轻量口语，Eco Relax Plus加入团体课，Eco Hub可按Speaking、Business或Navigator方向聚焦，Eco Sparta则偏高强度。',
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

  readonly courses: CourseOption[] = [
    {
      id: 'eco-relax-lite',
      name: 'Eco Relax Lite',
      type: 'ESL / 轻量口语',
      lessons: '3节一对一 + 1次可选词汇测试 + 1节可选夜间课',
      suitable: '适合陪读家长、成人轻量学习、第一次游学或想保留更多自习和生活空间的人。',
      tuition4w: 650,
    },
    {
      id: 'eco-relax-plus',
      name: 'Eco Relax Plus',
      type: 'ESL / 标准平衡',
      lessons: '3节一对一 + 2节团体课 + 前4周强制词汇测试 + 1节可选夜间课',
      suitable: '适合想兼顾一对一纠正和团体输出，强度不要太高但要有稳定学习节奏的人。',
      tuition4w: 750,
    },
    {
      id: 'eco-hub',
      name: 'Eco Hub ESL',
      type: 'ESL / 目标轨道',
      lessons: '4节一对一 + 2节团体课 + 前4周强制词汇测试 + 1节可选夜间课',
      suitable: '可按Speaking Accelerator、Business Booster、Navigator方向选课，适合有明确使用场景的人。',
      tuition4w: 850,
    },
    {
      id: 'eco-sparta',
      name: 'Eco Sparta',
      type: 'ESL / 高强度',
      lessons: '6节一对一 + 强制词汇测试 + 强制夜间课 + 20:00—23:00强制自习',
      suitable: '适合自律弱、想短期把开口和基础强行推上去，并能接受更密集日程的人。',
      tuition4w: 1150,
    },
    {
      id: 'test-course',
      name: 'Test Course',
      type: 'IELTS / TOEIC / TOEFL / PTE',
      lessons: '4节一对一 + 2节团体课 + 前4周强制词汇测试 + 1节可选夜间课 + 每月模考',
      suitable: '适合已有分数目标，想在碧瑶做阶段性备考、模考和弱项训练的人。',
      tuition4w: 950,
    },
    {
      id: 'junior-lite',
      name: 'Junior Lite（4—6岁）',
      type: 'Junior / 轻量',
      lessons: '3节一对一 + 1节可选夜间课 + 每月模考',
      suitable: '适合低龄学生先适应英文环境，课程强度相对轻。',
      tuition4w: 900,
    },
    {
      id: 'junior-esl',
      name: 'Junior ESL（价表7—15岁）',
      type: 'Junior / 标准',
      lessons: '4节一对一 + 2节团体课 + 强制词汇测试 + 1节可选夜间课 + 每月模考',
      suitable: '本次2026价表标7—15岁，学校当前官网标8—16岁；报名需按实际年龄向学校书面确认。',
      tuition4w: 1300,
    },
    {
      id: 'junior-test',
      name: 'Junior Test（12—16岁）',
      type: 'Junior / 考试',
      lessons: '4节一对一 + 2节团体课 + 强制词汇测试 + 1节可选夜间课 + 每月模考',
      suitable: '适合准备IELTS、TOEIC、TOEFL或PTE的12—16岁学生；12岁以下仅可选择TOEFL Junior方向。',
      tuition4w: 1350,
    },
    {
      id: 'toeic-guarantee',
      name: 'TOEIC保分班',
      type: '保证班 / TOEIC',
      lessons: '4节一对一 + 2节团体课 + 强制词汇测试 + 强制夜间课 + 每天模考',
      suitable: '12周按入学分数保证提升100—300分；16周无需初始分数，目标保证800分。',
      tuitionByWeeks: { 12: 2850, 16: 3800 },
      allowedWeeks: [12, 16],
    },
    {
      id: 'ielts-guarantee',
      name: 'IELTS Double Guarantee保分班',
      type: '保证班 / IELTS',
      lessons: '5节一对一 + 2节团体课 + 强制词汇测试 + 强制夜间课 + 每周模考',
      suitable: '入学需达到IELTS 4.0；12/20/24周分别以5.5/6.0/6.5总分为保证目标。',
      tuitionByWeeks: { 12: 3150, 20: 5250, 24: 6300 },
      allowedWeeks: [12, 20, 24],
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'deluxe-triple', name: 'Deluxe Triple', note: '预算最低，适合能接受三人房、想把费用压稳的人。', fee4w: 800 },
    { id: 'deluxe-twin', name: 'Deluxe Twin', note: '预算和舒适度较平衡，适合朋友同行或希望室友少一点的学生。', fee4w: 950 },
    { id: 'deluxe-single', name: 'Deluxe Single', note: 'Deluxe系统中的单人房，隐私更高但费用明显上升。', fee4w: 1450 },
    { id: 'premium-twin', name: 'Premium Twin', note: 'Premium住宿线，适合对房间质感和舒适度要求更高的人。', fee4w: 1150 },
    { id: 'premium-single', name: 'Premium Single', note: '适合长期成人学生或需要安静恢复空间的人，旺季要早查空房。', fee4w: 1650 },
    { id: 'premium-suite', name: 'Premium Suite', note: '可住1-2人，限同性居住；公开资料列有空调、浴缸和吹风机等设施。', fee4w: 2100 },
    { id: 'premium-studio-twin', name: 'Premium Studio Twin', note: 'Premium Studio双人房，适合同行或希望平衡预算与舒适度的人。', fee4w: 1150 },
    { id: 'premium-studio-single', name: 'Premium Studio Single', note: 'Premium Studio单人房，适合重视隐私和独立空间的人。', fee4w: 1650 },
    { id: 'premium-studio-triple-use', name: 'Premium Studio（三人入住）', note: '三人共同入住的4周房间总价；报价需按实际入住人数另行核算课程费。', fee4w: 3700, isTotalPrice: true },
    { id: 'premium-studio-quad-use', name: 'Premium Studio（四人入住）', note: '四人共同入住的4周房间总价；报价需按实际入住人数另行核算课程费。', fee4w: 4600, isTotalPrice: true },
    { id: 'eco-villa-single', name: 'Eco Villa Single', note: '独栋别墅单人房，适合重视独立性和自然住宿体验的人。', fee4w: 2300 },
    { id: 'eco-villa-exclusive-twin', name: 'Eco Villa整栋（双人入住）', note: '双人独享整栋别墅的4周总价。', fee4w: 2700, isTotalPrice: true },
    { id: 'eco-villa-exclusive-triple', name: 'Eco Villa整栋（三人入住）', note: '三人独享整栋别墅的4周总价。', fee4w: 3700, isTotalPrice: true },
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
      text: '不包含全部当地费用。USD报价已自动计入思达免注册费、95折和按入学日判定的旺季附加费；SSP、签证、教材、水电、接机等PHP费用在下方单独估算，押金和洗衣不计入学杂费合计。',
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
      if (rates.usdToCny <= 0 || rates.phpPerCny <= 0) return;
      this.usdToCny = rates.usdToCny;
      this.phpPerCny = rates.phpPerCny;
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

  get selectedCourse(): CourseOption {
    return this.courses.find((course) => course.id === this.selectedCourseId) ?? this.courses[0];
  }

  get selectedRoom(): RoomOption {
    return this.quoteRoomOptions.find((room) => room.id === this.selectedRoomId) ?? this.quoteRoomOptions[0];
  }

  get quoteRoomOptions(): RoomOption[] {
    return this.roomOptions.filter((room) => !room.isTotalPrice);
  }

  get availableWeekOptions(): WeekOption[] {
    return this.selectedCourse.allowedWeeks ?? this.weekOptions;
  }

  onCourseChange(): void {
    if (!this.availableWeekOptions.includes(this.selectedWeeks)) {
      this.selectedWeeks = this.availableWeekOptions[0];
    }
  }

  get courseTuitionUsd(): number {
    if (this.selectedCourse.tuitionByWeeks) {
      return this.selectedCourse.tuitionByWeeks[this.selectedWeeks] ?? 0;
    }
    return (this.selectedCourse.tuition4w ?? 0) * (this.selectedWeeks / 4);
  }

  get roomFeeUsd(): number {
    return this.selectedRoom.fee4w * (this.selectedWeeks / 4);
  }

  get packageUsd(): number {
    return this.courseTuitionUsd + this.roomFeeUsd;
  }

  get registrationDiscountAmount(): number {
    return Math.min(this.registrationFeeUsd, this.registrationDiscountUsd);
  }

  get sidaDiscountAmount(): number {
    return this.packageUsd * (1 - this.sidaDiscountRate);
  }

  get peakSeasonWeeks(): number {
    const start = this.parseDate(this.selectedStartDate);
    if (!start) return 0;
    const peakRanges = [
      ['2026-06-28', '2026-08-22'],
      ['2027-06-27', '2027-08-22'],
    ] as const;
    let weeks = 0;
    for (let week = 0; week < this.selectedWeeks; week += 1) {
      const weekStart = new Date(start);
      weekStart.setDate(weekStart.getDate() + week * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const overlapsPeak = peakRanges.some(([fromValue, toValue]) => {
        const from = this.parseDate(fromValue);
        const to = this.parseDate(toValue);
        return !!from && !!to && weekStart <= to && weekEnd >= from;
      });
      if (overlapsPeak) weeks += 1;
    }
    return weeks;
  }

  get peakSurchargeUsd(): number {
    return this.peakSeasonWeeks * this.peakSurchargePerWeekUsd;
  }

  get quoteUsd(): number {
    return Math.max(0, this.registrationFeeUsd + this.packageUsd - this.registrationDiscountAmount - this.sidaDiscountAmount + this.peakSurchargeUsd);
  }

  get packageUsdText(): string {
    return this.formatUsd(this.packageUsd);
  }

  get peakSurchargeText(): string {
    return this.peakSurchargeUsd > 0 ? this.formatUsd(this.peakSurchargeUsd) : '不适用';
  }

  get quoteUsdText(): string {
    return this.formatUsd(this.quoteUsd);
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    return `人民币预计金额：约 ${rounded.toLocaleString('zh-CN')} 元`;
  }

  get exchangeRateSummary(): string {
    if (!this.usingLiveExchangeRate) return '人民币金额正在按最新参考汇率更新';
    return `人民币金额按最新参考汇率预估（${this.exchangeRateDate.replace(/-/g, '/')}），最终以支付当日汇率为准`;
  }

  get fourWeekStartingText(): string {
    return this.formatUsd(((this.courses[0].tuition4w ?? 0) + this.roomOptions[0].fee4w) * this.sidaDiscountRate);
  }

  get ecoHubPremiumTwinText(): string {
    const ecoHub = this.courses.find((course) => course.id === 'eco-hub') ?? this.courses[2];
    const premiumTwin = this.roomOptions.find((room) => room.id === 'premium-twin') ?? this.roomOptions[3];
    return this.formatUsd(((ecoHub.tuition4w ?? 0) + premiumTwin.fee4w) * this.sidaDiscountRate);
  }

  get weeklyAverageText(): string {
    return this.formatUsd(Math.round(this.quoteUsd / this.selectedWeeks));
  }

  get courseFeeRows() {
    const featuredRoomIds: RoomId[] = ['deluxe-triple', 'deluxe-twin', 'deluxe-single', 'premium-twin'];

    return this.courses.filter((course) => course.tuition4w !== undefined).map((course) => {
      const totals = featuredRoomIds.reduce(
        (acc, roomId) => {
          const room = this.roomOptions.find((option) => option.id === roomId) ?? this.roomOptions[0];
          return { ...acc, [roomId]: this.formatUsd((course.tuition4w ?? 0) + room.fee4w) };
        },
        {} as Record<RoomId, string>,
      );

      return {
        course: course.name,
        tuition: this.formatUsd(course.tuition4w ?? 0),
        deluxeTriple: totals['deluxe-triple'],
        deluxeTwin: totals['deluxe-twin'],
        deluxeSingle: totals['deluxe-single'],
        premiumTwin: totals['premium-twin'],
        lessons: course.lessons,
      };
    });
  }

  get guaranteeFeeRows() {
    return this.courses
      .filter((course) => course.tuitionByWeeks)
      .flatMap((course) => Object.entries(course.tuitionByWeeks ?? {}).map(([weeks, tuition]) => ({
        course: course.name,
        weeks: `${weeks}周`,
        tuition: this.formatUsd(tuition),
        lessons: course.lessons,
      })));
  }

  get localFeePeriods(): number { return Math.max(1, Math.ceil(this.selectedWeeks / 4)); }
  get visaExtensionCount(): number { return Math.max(0, Math.ceil((this.selectedWeeks - 8) / 4)); }
  get roomWaterUnit(): number {
    if (this.selectedRoomId === 'premium-suite') return 4000;
    return this.selectedRoomId.startsWith('deluxe') ? 2500 : 3500;
  }
  get roomDeposit(): number { return this.selectedRoomId.startsWith('deluxe') ? 3000 : 5000; }
  get localFees(): LocalFee[] {
    const acrQuantity = this.selectedWeeks > 8 ? 1 : 0;
    const visaTotal = this.visaExtensionCount * 4940;
    const clarkQuantity = this.selectedPickupAirport === 'clark' ? 1 : 0;
    const manilaQuantity = this.selectedPickupAirport === 'manila' ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', amount: 'PHP 7,800', quantity: 1, total: 7800, note: '移民局收取，有效期6个月；换校通常需重新办理' },
      { item: 'SSP E-Card', amount: 'PHP 4,500', quantity: 1, total: 4500, note: '入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I Card 外国人身份证', amount: this.localFeeAmount(4000, acrQuantity), quantity: acrQuantity, total: 4000 * acrQuantity, note: '学习超过8周、首次续签时预计办理' },
      { item: '水电费', amount: this.localFeeAmount(this.roomWaterUnit, this.localFeePeriods), quantity: this.localFeePeriods, total: this.roomWaterUnit * this.localFeePeriods, note: `${this.selectedRoomId.startsWith('deluxe') ? 'Deluxe' : this.selectedRoomId === 'premium-suite' ? 'Suite' : 'Premium / Villa'} PHP ${this.roomWaterUnit.toLocaleString('en-US')}/4周 × ${this.localFeePeriods}；超出用电另收PHP 25/kW` },
      { item: '签证续签', amount: `PHP ${visaTotal.toLocaleString('en-US')}`, quantity: this.visaExtensionCount, total: visaTotal, note: this.visaExtensionCount > 0 ? `按首次续签PHP 4,940/次估算，共${this.visaExtensionCount}次；最终以移民局实收为准` : '8周内暂不计；超过8周后按续签次数估算' },
      { item: '教材费', amount: this.localFeeAmount(1500, this.localFeePeriods), quantity: this.localFeePeriods, total: 1500 * this.localFeePeriods, note: `PHP 1,500/4周 × ${this.localFeePeriods}；实际以课程与学校发放教材为准` },
      { item: '学生证', amount: 'PHP 200', quantity: 1, total: 200, note: '一次性费用' },
      { item: '马尼拉机场接机', amount: this.localFeeAmount(3000, manilaQuantity), quantity: manilaQuantity, total: 3000 * manilaQuantity, optional: manilaQuantity === 0, note: '与克拉克接机二选一；周日固定时间团体接机' },
      { item: '克拉克机场接机', amount: this.localFeeAmount(3000, clarkQuantity), quantity: clarkQuantity, total: 3000 * clarkQuantity, optional: clarkQuantity === 0, note: '与马尼拉接机二选一；周日固定时间团体接机' },
      { item: '住宿押金', amount: `PHP ${this.roomDeposit.toLocaleString('en-US')}`, quantity: 1, total: this.roomDeposit, optional: true, note: '不计入学杂费合计；无损坏及欠费，毕业时退还' },
      { item: '洗衣服务', amount: 'PHP 0', quantity: 0, total: 0, optional: true, note: '洗+烘PHP 150/7kg/次，只洗或只烘PHP 100/7kg/次；按需付费，不计入合计' },
    ];
  }

  get localFeeTotal(): number { return this.localFees.filter((fee) => !fee.optional).reduce((sum, fee) => sum + fee.total, 0); }
  get localFeeCnyText(): string {
    if (this.phpPerCny <= 0) return '人民币金额正在按最新参考汇率更新';
    return `人民币预计金额：约 ${Math.round(this.localFeeTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`;
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
    return `USD ${value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 1 })}`;
  }

  formatRoomFee(room: RoomOption): string {
    return `${this.formatUsd(room.fee4w)}${room.isTotalPrice ? '（总价）' : ''}`;
  }

  private localFeeAmount(unit: number, quantity: number): string { return `PHP ${(unit * quantity).toLocaleString('en-US')}`; }
  private parseDate(value: string): Date | null {
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
