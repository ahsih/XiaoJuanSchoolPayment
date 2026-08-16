import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿';
type WeekOption = 4 | 8 | 12 | 16 | 20 | 24;
type RoomId =
  | 'deluxe-triple'
  | 'deluxe-twin'
  | 'deluxe-single'
  | 'premium-twin'
  | 'premium-single'
  | 'premium-suite';
type CourseId =
  | 'eco-relax-lite'
  | 'eco-relax-plus'
  | 'eco-hub'
  | 'eco-sparta'
  | 'test-course'
  | 'working-holiday'
  | 'junior-lite'
  | 'junior-esl'
  | 'junior-test';

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
  tuition4w: number;
}

interface RoomOption {
  id: RoomId;
  name: string;
  note: string;
  fee4w: number;
}

interface FeeRow {
  item: string;
  amount: string;
  note: string;
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
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
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
export class AnjSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly weekOptions: WeekOption[] = [4, 8, 12, 16, 20, 24];
  selectedCourseId: CourseId = 'eco-relax-lite';
  selectedRoomId: RoomId = 'deluxe-triple';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  includePeakSurcharge = false;
  quoteCalculated = false;

  readonly registrationFeeUsd = 100;
  readonly peakSurchargePerWeekUsd = 40;

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
      lessons: '1:1 x 3 + Optional Night Class + Optional Vocabulary Test',
      suitable: '适合陪读家长、成人轻量学习、第一次游学或想保留更多自习和生活空间的人。',
      tuition4w: 650,
    },
    {
      id: 'eco-relax-plus',
      name: 'Eco Relax Plus',
      type: 'ESL / 标准平衡',
      lessons: '1:1 x 3 + Group x 2 + Optional Night Class',
      suitable: '适合想兼顾一对一纠正和团体输出，强度不要太高但要有稳定学习节奏的人。',
      tuition4w: 750,
    },
    {
      id: 'eco-hub',
      name: 'Eco Hub ESL',
      type: 'ESL / 目标轨道',
      lessons: '1:1 x 4 + Group x 2',
      suitable: '可按Speaking Accelerator、Business Booster、Navigator方向选课，适合有明确使用场景的人。',
      tuition4w: 850,
    },
    {
      id: 'eco-sparta',
      name: 'Eco Sparta',
      type: 'ESL / 高强度',
      lessons: '1:1 x 6 + Mandatory Night Class + Mandatory Vocabulary Test',
      suitable: '适合自律弱、想短期把开口和基础强行推上去，并能接受更密集日程的人。',
      tuition4w: 1150,
    },
    {
      id: 'test-course',
      name: 'Test Course',
      type: 'IELTS / TOEIC / TOEFL / PTE',
      lessons: '考试科目一对一与团体训练，按目标测试安排',
      suitable: '适合已有分数目标，想在碧瑶做阶段性备考、模考和弱项训练的人。',
      tuition4w: 950,
    },
    {
      id: 'working-holiday',
      name: 'Working Holiday',
      type: '求职 / 生活英语',
      lessons: '实用英语、面试、履历和海外生活场景训练',
      suitable: '适合准备澳洲、加拿大等英语圈打工度假，想补面试和职场表达的人。',
      tuition4w: 900,
    },
    {
      id: 'junior-lite',
      name: 'Junior Lite',
      type: 'Junior / 轻量',
      lessons: '青少年基础英语与活动型学习',
      suitable: '适合低龄学生先适应英文环境，课程强度相对轻。',
      tuition4w: 900,
    },
    {
      id: 'junior-esl',
      name: 'Junior ESL',
      type: 'Junior / 标准',
      lessons: '青少年ESL强化课程',
      suitable: '适合寒暑假或中长期青少年英语强化，需同步确认监护、房型和活动安排。',
      tuition4w: 1300,
    },
    {
      id: 'junior-test',
      name: 'Junior Test',
      type: 'Junior / 考试',
      lessons: '青少年考试方向课程',
      suitable: '适合有考试基础目标的青少年学生，报名时需确认当前开班与年龄要求。',
      tuition4w: 1350,
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'deluxe-triple', name: 'Deluxe Triple', note: '预算最低，适合能接受三人房、想把费用压稳的人。', fee4w: 800 },
    { id: 'deluxe-twin', name: 'Deluxe Twin', note: '预算和舒适度较平衡，适合朋友同行或希望室友少一点的学生。', fee4w: 950 },
    { id: 'deluxe-single', name: 'Deluxe Single', note: 'Deluxe系统中的单人房，隐私更高但费用明显上升。', fee4w: 1450 },
    { id: 'premium-twin', name: 'Premium Twin', note: 'Premium住宿线，适合对房间质感和舒适度要求更高的人。', fee4w: 1150 },
    { id: 'premium-single', name: 'Premium Single', note: '适合长期成人学生或需要安静恢复空间的人，旺季要早查空房。', fee4w: 1650 },
    { id: 'premium-suite', name: 'Premium Suite', note: '预算最高的舒适型选择之一，适合重视住宿体验的学生或家庭。', fee4w: 2100 },
  ];

  readonly localFees: FeeRow[] = [
    { item: '入学金', amount: 'USD 100', note: '报名固定费用；本页报价器已加入。' },
    { item: '旺季附加费', amount: 'USD 40 / 周', note: '公开资料列2026/6/28-8/22与2027/6/27-8/22；本页可手动加入估算。' },
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，到校当地支付。' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '与SSP相关的电子卡费用。' },
    { item: '签证延长', amount: 'PHP 0-23,870', note: '4周内通常免延签；8周PHP 4,940；24周累计PHP 23,870。' },
    { item: '水电费', amount: 'PHP 2,500-4,000 / 4周', note: 'Deluxe PHP 2,500；Premium/Eco Villa PHP 3,500；Suite PHP 4,000。' },
    { item: '维护费', amount: 'PHP 1,000-1,500 / 4周', note: 'Deluxe PHP 1,000；Premium/Eco Villa/Studio/Suite PHP 1,500。' },
    { item: '住宿押金', amount: 'PHP 3,000-5,000', note: 'Deluxe PHP 3,000；Premium、Eco Villa、Premium Studio为PHP 5,000。' },
    { item: '团体接机', amount: 'PHP 3,000', note: '公开资料列马尼拉或克拉克机场团体接机参考。' },
    { item: '学生证', amount: 'PHP 200', note: '到校当地支付。' },
    { item: '教材费', amount: 'PHP 1,000-1,500 / 4周', note: 'ESL与Junior参考PHP 1,000；Test Course参考PHP 1,500。' },
    { item: '延住费', amount: 'PHP 1,500-2,000 / 天', note: '学校规则列Deluxe PHP 1,500/天，Premium与Villa PHP 2,000/天。' },
  ];

  readonly scheduleItems: ScheduleItem[] = [
    {
      time: 'Morning',
      title: '一对一核心课',
      text: '按Eco Relax、Eco Hub或考试方向安排口说、听力、发音、语法、写作或弱项训练。',
    },
    {
      time: 'Daytime',
      title: '团体课与目标主题',
      text: 'Eco Relax Plus和Eco Hub加入团体课，帮助学生练习互动表达、商务或生活场景英语。',
    },
    {
      time: 'Evening',
      title: 'Night Class / 单词测试',
      text: '部分课程可选，Eco Sparta和保证班方向会更严格；报名时要确认当前课程规则。',
    },
    {
      time: 'Weekend',
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
      text: '不包含。报价器只估算USD课程费、住宿费、入学金和可选旺季附加费；SSP、签证、教材、水电、维护费、押金、接机、机票和保险另计。',
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
    { label: 'A&J官方校园规则页', url: 'https://www.anjedudc.com/school-regulation/' },
    { label: 'A&J官方学生宿舍页', url: 'https://www.anjedudc.com/dormitory-room/' },
    { label: 'Fujiyama A&J ECO Campus 2026费用参考', url: 'https://www.fujiyama-international.com/philippines/anj-eco.html' },
    { label: 'Cebu Buddy A&J ECO Campus费用参考', url: 'https://cebu-buddy.com/school/aj-eco/' },
  ];

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
    return this.roomOptions.find((room) => room.id === this.selectedRoomId) ?? this.roomOptions[0];
  }

  get packageUsd(): number {
    return Math.round((this.selectedCourse.tuition4w + this.selectedRoom.fee4w) * (this.selectedWeeks / 4));
  }

  get peakSurchargeUsd(): number {
    return this.includePeakSurcharge ? this.selectedWeeks * this.peakSurchargePerWeekUsd : 0;
  }

  get quoteUsd(): number {
    return this.registrationFeeUsd + this.packageUsd + this.peakSurchargeUsd;
  }

  get packageUsdText(): string {
    return this.formatUsd(this.packageUsd);
  }

  get peakSurchargeText(): string {
    return this.includePeakSurcharge ? this.formatUsd(this.peakSurchargeUsd) : '未加入';
  }

  get quoteUsdText(): string {
    return this.formatUsd(this.quoteUsd);
  }

  get fourWeekStartingText(): string {
    return this.formatUsd(this.registrationFeeUsd + this.courses[0].tuition4w + this.roomOptions[0].fee4w);
  }

  get ecoHubPremiumTwinText(): string {
    const ecoHub = this.courses.find((course) => course.id === 'eco-hub') ?? this.courses[2];
    const premiumTwin = this.roomOptions.find((room) => room.id === 'premium-twin') ?? this.roomOptions[3];
    return this.formatUsd(this.registrationFeeUsd + ecoHub.tuition4w + premiumTwin.fee4w);
  }

  get weeklyAverageText(): string {
    return this.formatUsd(Math.round(this.quoteUsd / this.selectedWeeks));
  }

  get courseFeeRows() {
    const featuredRoomIds: RoomId[] = ['deluxe-triple', 'deluxe-twin', 'deluxe-single', 'premium-twin'];

    return this.courses.map((course) => {
      const totals = featuredRoomIds.reduce(
        (acc, roomId) => {
          const room = this.roomOptions.find((option) => option.id === roomId) ?? this.roomOptions[0];
          return { ...acc, [roomId]: this.formatUsd(course.tuition4w + room.fee4w) };
        },
        {} as Record<RoomId, string>,
      );

      return {
        course: course.name,
        tuition: this.formatUsd(course.tuition4w),
        deluxeTriple: totals['deluxe-triple'],
        deluxeTwin: totals['deluxe-twin'],
        deluxeSingle: totals['deluxe-single'],
        premiumTwin: totals['premium-twin'],
        lessons: course.lessons,
      };
    });
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
    return `USD ${value.toLocaleString('en-US')}`;
  }
}
