import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '生活';
type WeekOption = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 20 | 24;
type RoomId = 'six' | 'quad' | 'triple' | 'twin' | 'single';
type CourseId = 'lite4' | 'target4' | 'target5' | 'target6' | 'ultimate8' | 'ielts' | 'working-holiday';

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
  prices: Record<RoomId, Record<WeekOption, number>>;
}

interface RoomOption {
  id: RoomId;
  name: string;
  note: string;
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
  selector: 'app-target-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SidaWhySectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './target-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './target-school.component.css',
  ],
})
export class TargetSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 6, 8, 12, 16, 20, 24];
  selectedCourseId: CourseId = 'target4';
  selectedRoomId: RoomId = 'six';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  includeCampaignDiscount = false;
  quoteCalculated = false;

  readonly registrationFeeUsd = 150;
  readonly campaignDiscounts: Record<WeekOption, number> = {
    1: 0,
    2: 0,
    3: 60,
    4: 120,
    6: 180,
    8: 0,
    12: 420,
    16: 0,
    20: 0,
    24: 0,
  };

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
      value: '2026年7月后USD价格',
      note: '官方页面说明2026年7月10日后使用新价格；本页报价器按该公开表估算。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'TARGET泳池与休息区',
      description: 'Talamban校区带泳池和户外休息区，学习之外也保留轻松交流空间。',
      src: 'https://target-english.org/wp-content/uploads/Basketball.jpg',
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
    { label: '4周起价', value: 'USD 1,430起：Lite 4 + 6人房 + 入学金USD 150。' },
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
      text: 'TARGET有门禁和学习规则，但整体更偏成人友好和半自律学习；高压备考可比较EV、CG Sparta或SMEAG。',
    },
    {
      title: '只看促销价做决定',
      text: '官方页面说明活动折扣有申请时机和旺季限制，正式预算一定要按开课日、周数和房型确认。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'six', name: '6人房（上下铺）', note: '预算最低，适合重视性价比和能接受多人房的人。' },
    { id: 'quad', name: '4人房（上下铺）', note: '多人房但比6人房更宽松，价格仍较低。' },
    { id: 'triple', name: '3人房', note: '预算和舒适度较平衡，适合中长期学习。' },
    { id: 'twin', name: '2人房', note: '适合同行朋友或想降低室友人数的人。' },
    { id: 'single', name: '1人房', note: '隐私最高，旺季和长期房位要尽早确认。' },
  ];

  readonly courses: CourseOption[] = [
    {
      id: 'lite4',
      name: 'Lite 4',
      type: 'ESL / 亲子监护人',
      lessons: '1:1 x 4',
      suitable: '适合想控制预算、以一对一课为主，或参加亲子游学的监护人。',
      prices: this.makePrices(
        [512, 768, 1024, 1280, 1920, 2560, 3840, 5120, 6400, 7680],
        [544, 816, 1088, 1360, 2040, 2720, 4080, 5440, 6800, 8160],
        [568, 852, 1136, 1420, 2130, 2840, 4260, 5680, 7100, 8520],
        [608, 912, 1216, 1520, 2280, 3040, 4560, 6080, 7600, 9120],
        [712, 1068, 1424, 1780, 2670, 3560, 5340, 7120, 8900, 10680],
      ),
    },
    {
      id: 'target4',
      name: 'TARGET 4',
      type: 'ESL / 平衡预算',
      lessons: '1:1 x 4 + Group x 3 + 自习 x 1 + Night Class x 2',
      suitable: '适合1个月以上、想保留自习时间、预算也要稳的人。',
      prices: this.makePrices(
        [536, 804, 1072, 1340, 2010, 2680, 4020, 5360, 6700, 8040],
        [568, 852, 1136, 1420, 2130, 2840, 4260, 5680, 7100, 8520],
        [592, 888, 1184, 1480, 2220, 2960, 4440, 5920, 7400, 8880],
        [632, 948, 1264, 1580, 2370, 3160, 4740, 6320, 7900, 9480],
        [736, 1104, 1472, 1840, 2760, 3680, 5520, 7360, 9200, 11040],
      ),
    },
    {
      id: 'target5',
      name: 'TARGET 5',
      type: 'ESL / 热门标准',
      lessons: '1:1 x 5 + Group x 2 + 自习 x 1 + Night Class x 2',
      suitable: '适合想增加一对一课量，同时保留小组输出的人。',
      prices: this.makePrices(
        [560, 840, 1120, 1400, 2100, 2800, 4200, 5600, 7000, 8400],
        [592, 888, 1184, 1480, 2220, 2960, 4440, 5920, 7400, 8880],
        [616, 924, 1232, 1540, 2310, 3080, 4620, 6160, 7700, 9240],
        [656, 984, 1312, 1640, 2460, 3280, 4920, 6560, 8200, 9840],
        [760, 1140, 1520, 1900, 2850, 3800, 5700, 7600, 9500, 11400],
      ),
    },
    {
      id: 'target6',
      name: 'TARGET 6',
      type: 'ESL / 短期强化',
      lessons: '1:1 x 6 + Group x 2 + Night Class x 2',
      suitable: '适合短期、体力较好、想提高一对一密度的人。',
      prices: this.makePrices(
        [608, 912, 1216, 1520, 2280, 3040, 4560, 6080, 7600, 9120],
        [640, 960, 1280, 1600, 2400, 3200, 4800, 6400, 8000, 9600],
        [664, 996, 1328, 1660, 2490, 3320, 4980, 6640, 8300, 9960],
        [704, 1056, 1408, 1760, 2640, 3520, 5280, 7040, 8800, 10560],
        [808, 1212, 1616, 2020, 3030, 4040, 6060, 8080, 10100, 12120],
      ),
    },
    {
      id: 'ultimate8',
      name: 'TARGET ULTIMATE 8',
      type: '全一对一',
      lessons: '1:1 x 8 + Night Class x 2',
      suitable: '适合2周以内短期冲刺、基础较好、想最大化一对一的人。',
      prices: this.makePrices(
        [672, 1008, 1344, 1680, 2520, 3360, 5040, 6720, 8400, 10080],
        [704, 1056, 1408, 1760, 2640, 3520, 5280, 7040, 8800, 10560],
        [728, 1092, 1456, 1820, 2730, 3640, 5460, 7280, 9100, 10920],
        [768, 1152, 1536, 1920, 2880, 3840, 5760, 7680, 9600, 11520],
        [872, 1308, 1744, 2180, 3270, 4360, 6540, 8720, 10900, 13080],
      ),
    },
    {
      id: 'ielts',
      name: 'IELTS',
      type: '雅思备考',
      lessons: '1:1 x 5 + Group x 2 + 自习 x 1 + Night Class x 2',
      suitable: '适合需要雅思提分或12周保证班方向的人。',
      prices: this.makePrices(
        [672, 1008, 1344, 1680, 2520, 3360, 5040, 6720, 8400, 10080],
        [704, 1056, 1408, 1760, 2640, 3520, 5280, 7040, 8800, 10560],
        [728, 1092, 1456, 1820, 2730, 3640, 5460, 7280, 9100, 10920],
        [768, 1152, 1536, 1920, 2880, 3840, 5760, 7680, 9600, 11520],
        [872, 1308, 1744, 2180, 3270, 4360, 6540, 8720, 10900, 13080],
      ),
    },
    {
      id: 'working-holiday',
      name: 'Working Holiday',
      type: '打工度假准备',
      lessons: '1:1 x 5 + Group x 2 + 自习 x 1 + Night Class x 2',
      suitable: '适合准备澳洲等英语圈打工度假、面试和履历英文的人。',
      prices: this.makePrices(
        [560, 840, 1120, 1400, 2100, 2800, 4200, 5600, 7000, 8400],
        [592, 888, 1184, 1480, 2220, 2960, 4440, 5920, 7400, 8880],
        [616, 924, 1232, 1540, 2310, 3080, 4620, 6160, 7700, 9240],
        [656, 984, 1312, 1640, 2460, 3280, 4920, 6560, 8200, 9840],
        [760, 1140, 1520, 1900, 2850, 3800, 5700, 7600, 9500, 11400],
      ),
    },
  ];

  readonly localFees: FeeRow[] = [
    { item: '入学金', amount: 'USD 150', note: '报名固定费用；本页报价器已加入。' },
    { item: '宿舍保证金', amount: 'PHP 2,500', note: '退宿检查无损坏或遗失后退还。' },
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，期间不论长短均需办理。' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '与SSP同时申请。' },
    { item: 'ACR I-Card', amount: 'PHP 4,300', note: '9周以上通常需要。' },
    { item: '签证延长', amount: 'PHP 0-24,870', note: '1-4周PHP 0；5-8周PHP 5,140；21-24周合计PHP 24,870。' },
    { item: '教材费', amount: 'PHP 500起', note: '1周PHP 500；3-4周PHP 2,000；5-8周PHP 3,000。' },
    { item: '电费', amount: 'PHP 600 / 周', note: '基本费用；超过规定用量会追加。' },
    { item: '水费', amount: 'PHP 200 / 周', note: '官方日文价格页列示。' },
    { item: '共益费', amount: 'PHP 500 / 周', note: '校园公共维护费用。' },
    { item: '机场接机', amount: 'PHP 1,200起', note: '特定时间外或临近报名安排可能另加PHP 1,000。' },
    { item: '洗衣', amount: 'PHP 150 / 次', note: '每次最多6kg，通常每周最多3天可使用。' },
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
      title: 'Night Class / 活动',
      text: '可利用晚间课程和校内设施延长英文接触时间，同时保留成人可持续的节奏。',
    },
  ];

  readonly faqs: TextCard[] = [
    {
      title: 'TARGET和CIA怎么选？',
      text: 'CIA偏大型综合半斯巴达和Mactan新校区；TARGET偏日系成人友好、Talamban安静校区、预算控制和一对一课量。预算和基础口语优先可看TARGET，设施和考试资源综合度优先可看CIA。',
    },
    {
      title: '页面报价包含所有费用吗？',
      text: '不包含。报价器按官方公开USD课程+住宿费和入学金估算；SSP、签证、教材、水电、共益费、押金、接机、洗衣、机票和保险另计。',
    },
    {
      title: '促销折扣可以直接使用吗？',
      text: '不一定。官方说明促销取决于申请时间和入学时间，繁忙期重叠周可能不适用。本页提供开关方便预算，但最终要按学校确认。',
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

  get selectedCourse(): CourseOption {
    return this.courses.find((course) => course.id === this.selectedCourseId) ?? this.courses[0];
  }

  get selectedRoom(): RoomOption {
    return this.roomOptions.find((room) => room.id === this.selectedRoomId) ?? this.roomOptions[0];
  }

  get packageUsd(): number {
    return this.selectedCourse.prices[this.selectedRoomId][this.selectedWeeks];
  }

  get campaignDiscountUsd(): number {
    return this.includeCampaignDiscount ? this.campaignDiscounts[this.selectedWeeks] : 0;
  }

  get quoteUsd(): number {
    return this.registrationFeeUsd + this.packageUsd - this.campaignDiscountUsd;
  }

  get packageUsdText(): string {
    return this.formatUsd(this.packageUsd);
  }

  get campaignDiscountText(): string {
    if (!this.includeCampaignDiscount) {
      return '未加入';
    }

    return this.campaignDiscountUsd > 0
      ? `-${this.formatUsd(this.campaignDiscountUsd)}`
      : '当前周数无列明折扣';
  }

  get quoteUsdText(): string {
    return this.formatUsd(this.quoteUsd);
  }

  get fourWeekStartingText(): string {
    const lowestPackageUsd = Math.min(...this.courses.map((course) => course.prices.six[4]));
    return this.formatUsd(this.registrationFeeUsd + lowestPackageUsd);
  }

  get targetFiveFourWeekText(): string {
    const targetFive = this.courses.find((course) => course.id === 'target5') ?? this.courses[0];
    return this.formatUsd(this.registrationFeeUsd + targetFive.prices.six[4]);
  }

  get weeklyAverageText(): string {
    return this.formatUsd(Math.round(this.quoteUsd / this.selectedWeeks));
  }

  get courseFeeRows() {
    return this.courses.map((course) => ({
      course: course.name,
      lessons: course.lessons,
      six: this.formatUsd(course.prices.six[4]),
      quad: this.formatUsd(course.prices.quad[4]),
      triple: this.formatUsd(course.prices.triple[4]),
      twin: this.formatUsd(course.prices.twin[4]),
      single: this.formatUsd(course.prices.single[4]),
    }));
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

  private makePrices(
    six: number[],
    quad: number[],
    triple: number[],
    twin: number[],
    single: number[],
  ): Record<RoomId, Record<WeekOption, number>> {
    return {
      six: this.mapWeekPrices(six),
      quad: this.mapWeekPrices(quad),
      triple: this.mapWeekPrices(triple),
      twin: this.mapWeekPrices(twin),
      single: this.mapWeekPrices(single),
    };
  }

  private mapWeekPrices(values: number[]): Record<WeekOption, number> {
    return this.weekOptions.reduce(
      (prices, week, index) => ({ ...prices, [week]: values[index] }),
      {} as Record<WeekOption, number>,
    );
  }
}
