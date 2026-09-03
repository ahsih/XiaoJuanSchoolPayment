import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12 | 16 | 20 | 24;

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

interface Highlight {
  image: string;
  title: string;
  text: string;
}

interface FitItem {
  title: string;
  text: string;
}

interface RoomOption {
  id: string;
  name: string;
  fee: number;
  note: string;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  courseFee: number;
  lessons: string;
  suitable: string;
  pricesByRoom: Record<string, Record<WeekOption, number>>;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
}

interface LocalFee {
  item: string;
  amount: string;
  note: string;
}

interface ProcessStep {
  icon: string;
  title: string;
  text: string;
}

interface FaqItem {
  question: string;
  answer: string;
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

interface SpecialCourseFee {
  label: string;
  lessons: string;
  four: string;
  note: string;
}

@Component({
  selector: 'app-api-beci-city-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './api-beci-city-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './api-beci-city-school.component.css',
  ],
})
export class ApiBeciCitySchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFee = 100;
  readonly seasonalFeePerWeek = 40;
  readonly usdToCny = 7.2;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];

  selectedCourseId = 'light-esl';
  selectedRoomId = 'studio-quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_city',
      label: '官方地区',
      value: 'Baguio City / City Campus',
      note: '官方与公开费用资料均将API BECI City Campus列为碧瑶校区，适合成人、工作者和弹性学习学生。',
    },
    {
      icon: 'work',
      label: '学校类型',
      value: '成人 / Workcation / Non-Sparta',
      note: 'City Campus定位为成人、专业人士和工作者的弹性学习校区，无传统斯巴达门禁。',
    },
    {
      icon: 'record_voice_over',
      label: '课程重点',
      value: 'Lite / Native / Unlimited / Junior',
      note: '所附BECI 2026费用表列LITE ESL、Native ESL、Unlimited ESL和Junior ESL。',
    },
    {
      icon: 'hotel',
      label: '住宿',
      value: 'Studio / Semi Single / Quad',
      note: '公开表按Studio Single、Studio Double、Studio Quad、Semi Master Single和Semi Single核价。',
    },
    {
      icon: 'restaurant',
      label: '餐食',
      value: '每日3餐',
      note: '公开学校资料列每日三餐，课程住宿餐食主费以美元报价。',
    },
    {
      icon: 'laptop_mac',
      label: '设施',
      value: 'Coworking / Library / Online meeting room',
      note: '公开资料列卖店、共用工作空间、线上会议室、图书馆、自习室和免费外部健身房。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'API BECI City Campus外观',
      description:
        'City Campus位于Baguio市区生活圈，适合成人、工作者和偏弹性学习节奏的学生。',
      src: 'assets/philippines/beci-campus-blue-roof.png',
    },
    {
      category: '设施',
      title: 'City Campus学习休息区',
      description:
        '公共学习与休息空间更像成人学习社区，适合边工作边学习或课后自习。',
      src: 'assets/philippines/beci-city-study-lounge.png',
    },
    {
      category: '设施',
      title: 'City Campus自习工作区',
      description:
        '公开资料强调coworking、online meeting room和library，适合Workcation学生。',
      src: 'assets/philippines/beci-city-workspace.png',
    },
    {
      category: '教室',
      title: 'BECI一对一课堂参考',
      description:
        'Lite ESL、Native ESL、Unlimited ESL和Junior ESL都以一对一训练为重要组成。',
      src: 'assets/philippines/beci-one-to-one-class.jpg',
    },
    {
      category: '教室',
      title: 'Speaking Prescription反馈',
      description:
        'BECI校系特色之一是用录影和维度诊断追踪学生口语弱点。',
      src: 'assets/philippines/beci-speaking-prescription.jpg',
    },
    {
      category: '校园',
      title: 'BECI校区建筑参考',
      description:
        'API BECI在Baguio有不同校区，City Campus需和EOP、Sparta分开比较。',
      src: 'assets/philippines/beci-campus-building.png',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '页面名称', value: '菲律宾碧瑶API BECI（City Campus）' },
    { label: '官方英文名称', value: 'API BECI City Campus' },
    { label: '官方地区', value: 'Baguio City / 碧瑶' },
    { label: '设立 / 定位', value: '公开资料列2022年设立，成人、专业人士、Workcation和弹性ESL校区' },
    { label: '学校规模', value: '公开资料列约45名学生容量，1节课50分钟' },
    { label: '2026费用表课程', value: 'Lite ESL、Native ESL、Unlimited ESL、Junior ESL' },
    { label: '住宿房型', value: 'Studio Single、Studio Double、Studio Quad、Semi Master Single、Semi Single' },
    { label: '主要规则', value: 'Non-Sparta、无门禁、每日三餐、周日入寮、周六退寮；未成年规则需单独确认' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'assets/philippines/beci-city-study-lounge.png',
      title: '成人和工作者友好',
      text: 'City Campus公开定位为成人英语教育中心，有弹性课程、工作空间和线上会议环境。',
    },
    {
      image: 'assets/philippines/beci-city-workspace.png',
      title: '轻量到高课量可选',
      text: 'Lite适合保留工作和复习时间，Unlimited适合希望提高每日一对一课量的学生。',
    },
    {
      image: 'assets/philippines/beci-speaking-prescription.jpg',
      title: 'BECI校系口语反馈',
      text: 'BECI强调Speaking Prescription和学习管理系统，适合想用反馈机制修正口语弱点的学生。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '成人、上班族和Workcation学生',
      text: '有Coworking和线上会议室，Lite ESL课量较轻，比传统高强度校区更容易兼顾工作。',
    },
    {
      title: '想在碧瑶学校里比较BECI校系',
      text: '如果你正在比较碧瑶学校，City Campus可以和BECI EOP、BECI Sparta、PINES、JIC、MONOL一起初筛。',
    },
    {
      title: '想按一对一课量选择',
      text: '从Lite、Native到Unlimited可按口语目标和每日课量匹配，青少年则可看Junior ESL。',
    },
    {
      title: '想要碧瑶凉爽市区环境',
      text: '官方资料强调Baguio城市、安全和学习氛围，适合不追求海岛度假感的人。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想去宿务或海边校区',
      text: 'API BECI City Campus官方地区是Baguio，不是Cebu；若只要宿务，可比较B Cebu、CIA、CBOA或QQEnglish。',
    },
    {
      title: '需要强斯巴达管理',
      text: 'City Campus是Non-Sparta和无门禁路线，需要强制晚自习与高压管理可看BECI Sparta、CG斯巴达校区或EV。',
    },
    {
      title: '亲子低龄同行',
      text: '公开资料显示City Campus更偏成人和专业人士，亲子或低龄学生需优先核对年龄与监护规则。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'studio-single', name: 'Studio Single 1人房', fee: 1250, note: '隐私度最高，适合远程工作、会议和长期住宿。' },
    { id: 'semi-master-single', name: 'Semi Master Single 1人房', fee: 1050, note: '单人房预算折中，适合成人独立学习。' },
    { id: 'semi-single', name: 'Semi Single 1人房', fee: 900, note: '相对经济的单人房，正式报名需确认空房。' },
    { id: 'studio-double', name: 'Studio Double 2人房', fee: 800, note: '公开说明通常限家人、夫妻、同性朋友等组合使用。' },
    { id: 'studio-double-couple', name: 'Studio Double 夫妻同行（每人）', fee: 750, note: '一对夫妇共同使用Studio Double时的每人价格。' },
    { id: 'studio-quad', name: 'Studio Quad 4人房', fee: 600, note: '预算最低房型，适合可接受多人房的成人学生。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'light-esl',
      name: 'Lite ESL',
      type: '轻量ESL',
      courseFee: 670,
      lessons: '1:1两节 + 小组两节 + Optional Night两节',
      suitable: '适合想保留自由时间、远程工作或先用轻量节奏适应英语环境的学生。',
      pricesByRoom: this.makeCoursePrices(670),
    },
    {
      id: 'native-esl',
      name: 'Native ESL',
      type: 'Native强化',
      courseFee: 900,
      lessons: '1:1四节 + 小组两节 + Optional Night两节',
      suitable: '适合想加入Native老师训练、修正自然表达和口语输出的学生。',
      pricesByRoom: this.makeCoursePrices(900),
    },
    {
      id: 'unlimited-esl',
      name: 'Unlimited ESL',
      type: '高课量ESL',
      courseFee: 900,
      lessons: '最多1:1八节 + Optional两节',
      suitable: '适合希望把每日一对一课量拉高，并按基础调整科目组合的学生。',
      pricesByRoom: this.makeCoursePrices(900),
    },
    {
      id: 'junior-esl',
      name: 'Junior ESL',
      type: '青少年ESL',
      courseFee: 1300,
      lessons: '1:1五节 + SP口语一节 + Optional两节',
      suitable: '适合需要较高一对一课量、SP口语反馈和明确课表的青少年学生。',
      pricesByRoom: this.makeCoursePrices(1300),
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    {
      label: '中介优惠',
      lessons: '免注册费；1/2/3周课程费按40%/60%/80%',
      four: '注册费原价USD 100，优惠后USD 0',
      note: '短期比例以4周课程费为基准，住宿费按实际周数折算。',
    },
    {
      label: '额外1:1课程',
      lessons: '日间或夜间一对一',
      four: 'PHP 7,000 / 4周参考',
      note: '公开资料提到可追加一对一课程，适用时间和名额需确认。',
    },
    {
      label: '长期折扣',
      lessons: '可与常规优惠叠加',
      four: '8/12/16/20/24周减USD 50/100/200/300/400',
      note: '报价器已按所选周数自动扣减。',
    },
    {
      label: 'Peak Season Surcharge',
      lessons: '暑期旺季',
      four: 'USD 40 / 周',
      note: '公开表列旺季期间需额外加收；本页报价器会按入学日自动计入。',
    },
    {
      label: 'Studio Double限制',
      lessons: '2人房使用规则',
      four: '夫妻同行每人USD 750 / 4周',
      note: '标准价每人USD 800；一对夫妇共同使用时每人USD 750，其他同行关系和个人合住需提前确认。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '08:00 - 11:50',
      title: '上午课程 / 工作时段',
      text: 'Lite、Native、Unlimited和Junior ESL按课程安排一对一、小组课或SP口语课。',
    },
    {
      time: '12:00 - 12:50',
      title: '午餐',
      text: '公开资料列每日三餐，餐食规则以学校当期说明为准。',
    },
    {
      time: '13:00 - 16:50',
      title: '下午课程 / Coworking',
      text: 'Native、Unlimited和Junior ESL按课表继续一对一与选修；Workcation学生可使用工作区。',
    },
    {
      time: '17:00 - 20:50',
      title: '选修课 / 工作时段',
      text: '按当前课表参加选修或使用工作区；需要夜间课程时应先确认当期安排。',
    },
    {
      time: '晚间',
      title: 'Optional Night / 自习',
      text: '可按课程与当期安排参加选修、复习或使用学习空间；City Campus公开资料列无门禁。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 0（原价USD 100）', note: '当前中介优惠免注册费，本页报价器按USD 0计算' },
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，到校后办理' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '与SSP相关的电子卡申请费用' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '长期学习或延签时通常需要' },
    { item: '签证延签', amount: 'PHP 4,940起', note: '8周以上常见，周数越长费用越高' },
    { item: '教材费', amount: 'PHP 1,000-2,000', note: '按课程和教材使用计算，考试课程可能更高' },
    { item: '宿舍保证金', amount: 'PHP 3,000', note: '退房检查后按学校规则退还' },
    { item: '水电费', amount: 'PHP 3,000 / 4周参考', note: '公开资料口径；实际以学校账单为准' },
    { item: '维护费', amount: 'PHP 1,000 / 4周参考', note: '学校设施维护相关费用' },
    { item: '洗衣费', amount: 'PHP 1,500-1,600 / 4周', note: 'City Campus公开资料提到洗衣按月收费，最低重量规则需确认' },
    { item: '指定接机', amount: 'PHP 3,000参考', note: '马尼拉或克拉克指定接机日参考' },
    { item: '前泊 / 延泊', amount: 'PHP 1,000 / 晚', note: '公开资料列前后1晚需按规则确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先确认是否真要City Campus',
      text: '先确认你要的是API BECI City Campus还是宿务B Cebu，避免把碧瑶和宿务校区混淆。',
    },
    {
      icon: 'fact_check',
      title: '确认课程和房型',
      text: '核对Lite、Native、Unlimited、Junior ESL，以及Studio或Semi房型空位。',
    },
    {
      icon: 'payments',
      title: '拆清主费和当地费',
      text: '把优惠后课程费、住宿餐食、免注册费优惠、SSP、签证、押金、水电、教材、维护费、洗衣和接机分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备报名资料',
      text: '协助整理护照、保险、eTravel、接机资料、现金清单和Workcation需求。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '课程、老师、宿舍、账单或校规沟通问题，都可以继续联系顾问协助。',
    },
    {
      icon: 'location_on',
      title: '菲律宾当地支持',
      text: '思达会按学生所在城市和校区安排后续沟通支持。',
    },
  ];

  readonly trustBadges = [
    { icon: 'description', label: '2026 City费用整理' },
    { icon: 'verified_user', label: '校区位置先确认' },
    { icon: 'payments', label: '主费与当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = [
    '一对一课程',
    '小组课',
    'Optional Night',
    'Lite ESL',
    'Native ESL',
    'Unlimited ESL',
    'Junior ESL',
    'Coworking',
    'Online Meeting Room',
    'Library',
    '每日三餐',
    '无门禁',
  ];
  readonly campusActivities = [
    '自习',
    'Coworking',
    'Online Meeting',
    'Presentation',
    'EOP Challenge',
    '校内交流',
  ];
  readonly weekendActivities = [
    'Baguio市区咖啡厅',
    'SM Baguio',
    'Burnham Park',
    'Session Road',
    '周边短途旅行',
    '外部健身房',
  ];
  readonly notes = [
    'API BECI City Campus官方地区为Baguio，本页已归入碧瑶游学，页面内容按碧瑶校区定位整理。',
    '本页费用按所附BECI 2026美元表整理，主费为课程和住宿；当前中介优惠免USD 100注册费。',
    '1/2/3周课程费按4周价的40%/60%/80%计算，住宿费按实际周数折算。',
    '8/12/16/20/24周长期折扣为USD 50/100/200/300/400，可与常规优惠叠加。',
    'Studio Double标准价每人USD 800；夫妻同行共同使用时每人USD 750，其他情况需确认同行关系、性别和学校空房规则。',
    'SSP、SSP E-Card、签证、ACR、押金、水电、教材、维护费、洗衣、接机和旺季费通常另计。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'API BECI City Campus是在宿务吗？',
      answer:
        '不是。官方资料和公开学校资料均显示API BECI City Campus在Baguio City；本页已归入碧瑶游学。',
    },
    {
      question: '如果我想找API BECI的宿务校区，应该看哪一所？',
      answer:
        '通常应看B Cebu或B\'Cebu相关资料，而不是API BECI City Campus。顾问可以帮你确认你想要的是碧瑶City Campus还是宿务B Cebu。',
    },
    {
      question: '页面上的费用包含全部费用吗？',
      answer:
        '不包含全部。报价器估算优惠后的课程、住宿主费，并按当前中介优惠免注册费；SSP、签证、ACR、押金、水电、教材、维护费、洗衣和接机需另行准备，旺季费会按所选日期自动计入。',
    },
    {
      question: 'City Campus适合边工作边学习吗？',
      answer:
        '适合列入候选。City Campus公开定位为成人、专业人士和工作者；当前2026费用表可从Lite、Native或Unlimited ESL中按课量选择，并使用Coworking和线上会议空间。',
    },
    {
      question: 'City Campus和BECI Sparta怎么选？',
      answer:
        '需要弹性、无门禁、成人社群和远程工作空间看City；需要强制学习管理、晚间测试和高压推动则优先比较Sparta。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '特殊项目', target: 'special-fees', icon: 'bolt' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '常见问题', target: 'faq', icon: 'help' },
  ];
  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '服务', target: 'service-process', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'APIBECI官方网站', url: 'https://beciedu.com/' },
    { label: 'APIBECI City Campus官方介绍', url: 'https://beciedu.com/city-campus/' },
    { label: 'APIBECI About官方说明', url: 'https://beciedu.com/about/' },
    { label: 'API BECI City Campus公开费用与学校资料', url: 'https://global-click.jp/contents/school/api-beci-city-campus/' },
    { label: 'API BECI City Campus 2026学校资料', url: 'https://www.fujiyama-international.com/philippines/beci-city.html' },
    { label: 'API BECI课程调整与City Campus费用更新参考', url: 'https://philippines-university.jp/%E3%80%90api-beci%E3%80%912025%E5%B9%B45%E6%9C%88%E4%BB%A5%E9%99%8D%E3%81%AE%E3%82%B3%E3%83%BC%E3%82%B9%E5%90%8D%E5%A4%89%E6%9B%B4%EF%BC%86%E6%96%99%E9%87%91%E6%94%B9%E5%AE%9A%E3%81%AE%E3%81%8A/' },
  ];

  private makeCoursePrices(courseFee: number): Record<string, Record<WeekOption, number>> {
    return Object.fromEntries(
      this.roomOptions.map((room) => [room.id, this.makePackagePrices(courseFee, room.fee)]),
    );
  }

  private makePackagePrices(courseFee: number, roomFee: number): Record<WeekOption, number> {
    const totalFor = (weeks: WeekOption, tuitionMultiplier: number, longStayDiscount = 0) =>
      courseFee * tuitionMultiplier + roomFee * (weeks / 4) - longStayDiscount;

    return {
      1: totalFor(1, 0.4),
      2: totalFor(2, 0.6),
      3: totalFor(3, 0.8),
      4: totalFor(4, 1),
      8: totalFor(8, 2, 50),
      12: totalFor(12, 3, 100),
      16: totalFor(16, 4, 200),
      20: totalFor(20, 5, 300),
      24: totalFor(24, 6, 400),
    };
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
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

    const headerOffset = window.innerWidth <= 680 ? 132 : 92;
    const targetTop =
      targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${target}`,
    );
  }

  feeFor(courseId: string, roomId: string, weeks: WeekOption = 4): number {
    const course = this.courseOptions.find((item) => item.id === courseId);

    return course?.pricesByRoom[roomId]?.[weeks] ?? 0;
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter(
          (image) => image.category === this.selectedGalleryCategory,
        );
  }

  get selectedCourse(): CourseOption {
    return (
      this.courseOptions.find((course) => course.id === this.selectedCourseId) ??
      this.courseOptions[0]
    );
  }

  get selectedRoom(): RoomOption {
    return (
      this.roomOptions.find((room) => room.id === this.selectedRoomId) ??
      this.roomOptions[0]
    );
  }

  get selectedPackageFee(): number {
    return this.feeFor(this.selectedCourseId, this.selectedRoomId, this.selectedWeeks);
  }

  get payableRegistrationFee(): number {
    return 0;
  }

  get longStayDiscount(): number {
    const discounts: Partial<Record<WeekOption, number>> = { 8: 50, 12: 100, 16: 200, 20: 300, 24: 400 };
    return discounts[this.selectedWeeks] ?? 0;
  }

  get seasonalSurcharge(): number {
    const start = new Date(`${this.selectedStartDate}T00:00:00`);
    const ranges = [
      [new Date('2026-06-28T00:00:00'), new Date('2026-08-22T23:59:59')],
      [new Date('2027-06-27T00:00:00'), new Date('2027-08-22T23:59:59')],
    ];

    return ranges.some(([from, to]) => start >= from && start <= to)
      ? this.selectedWeeks * this.seasonalFeePerWeek
      : 0;
  }

  get quoteUsd(): number {
    return this.payableRegistrationFee + this.selectedPackageFee + this.seasonalSurcharge;
  }

  get packageFeeText(): string {
    return `USD ${this.formatUsd(this.selectedPackageFee)} 起`;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)} 起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  get seasonalNote(): string {
    const start = new Date(`${this.selectedStartDate}T00:00:00`);

    if (Number.isNaN(start.getTime())) {
      return '入学日期需要和学校确认，适用价格、促销、房型空位、旺季费和当地费用会影响最终报价。';
    }

    const peakStart = new Date('2026-06-28T00:00:00');
    const peakEnd = new Date('2026-08-22T23:59:59');

    if (start >= peakStart && start <= peakEnd) {
      return '当前入学日期落在公开2026暑期旺季区间，报价器已按USD 40/周计入旺季附加费。';
    }

    return this.selectedWeeks >= 12
      ? `当前已按${this.selectedWeeks}周长期折扣减免USD ${this.longStayDiscount}，仍需确认签证延长、ACR I-Card、入学日和房型空位。`
      : '当前选择为短中期课程，需确认City Campus当期价格、房型空位、接机和当地费用。';
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}
