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
  readonly usdToCny = 7.2;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];

  selectedCourseId = 'speed-esl';
  selectedRoomId = 'studio-double';
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
      value: 'Lite / Speed / ESP / IELTS',
      note: '官方City Campus页面列LITE ESL、SPEED ESL、ESP和IELTS；公开费用表另列Native ESL、BizSpeak和Flexi课程。',
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
        'Speed ESL、Native ESL、BizSpeak、IELTS等课程都以一对一训练为重要组成。',
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
    { label: '主要课程', value: 'Light ESL、Speed ESL、Native ESL、BizSpeak、Flexi-Light ESL、Flexi-Speed ESL、IELTS' },
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
      title: 'Flexi夜间一对一',
      text: 'Flexi-Light和Flexi-Speed适合白天处理工作、傍晚上课的Workcation学生。',
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
      text: '有Coworking、线上会议室和Flexi夜间课程，比传统全日制校区更适合边工作边学习。',
    },
    {
      title: '想在碧瑶学校里比较BECI校系',
      text: '如果你正在比较碧瑶学校，City Campus可以和BECI EOP、BECI Sparta、PINES、JIC、MONOL一起初筛。',
    },
    {
      title: '需要商务或特定目的英语',
      text: 'ESP和BizSpeak可按商务、旅行、演讲、时事和职场表达等目标做课程匹配。',
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
      text: 'City Campus是Non-Sparta和无门禁路线，需要强制晚自习与高压管理可看BECI Sparta、CG Sparta或EV。',
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
    { id: 'studio-quad', name: 'Studio Quad 4人房', fee: 600, note: '预算最低房型，适合可接受多人房的成人学生。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'light-esl',
      name: 'Light ESL',
      type: '轻量ESL',
      courseFee: 670,
      lessons: '1:1两节 + 小组两节 + Optional Night两节',
      suitable: '适合想保留自由时间、远程工作或先用轻量节奏适应英语环境的学生。',
      pricesByRoom: this.makeCoursePrices(670),
    },
    {
      id: 'speed-esl',
      name: 'Speed ESL',
      type: '标准ESL',
      courseFee: 870,
      lessons: '1:1四节 + 小组两节 + Optional Night两节',
      suitable: '适合大多数成人学生，兼顾一对一输出、小组互动和四技能训练。',
      pricesByRoom: this.makeCoursePrices(870),
    },
    {
      id: 'native-esl',
      name: 'Native ESL',
      type: 'Native强化',
      courseFee: 950,
      lessons: '1:1四节 + 小组两节 + Optional Night两节',
      suitable: '适合想加入Native老师训练、修正自然表达和口语输出的学生。',
      pricesByRoom: this.makeCoursePrices(950),
    },
    {
      id: 'bizspeak',
      name: 'BizSpeak',
      type: '商务英语',
      courseFee: 800,
      lessons: '1:1四节 + Optional Night两节',
      suitable: '适合职场英语、会议、报告、演讲、邮件和商务沟通训练。',
      pricesByRoom: this.makeCoursePrices(800),
    },
    {
      id: 'flexi-light-esl',
      name: 'Flexi-Light ESL',
      type: 'Workcation轻量',
      courseFee: 670,
      lessons: '小组两节 + 夜间1:1一节 + Optional Night两节',
      suitable: '适合白天工作、晚上安排少量一对一课程的远程办公学生。',
      pricesByRoom: this.makeCoursePrices(670),
    },
    {
      id: 'flexi-speed-esl',
      name: 'Flexi-Speed ESL',
      type: 'Workcation强化',
      courseFee: 870,
      lessons: '小组两节 + 夜间1:1三节 + Optional Night两节',
      suitable: '适合白天保留工作时间，晚上集中上一对一课程的学生。',
      pricesByRoom: this.makeCoursePrices(870),
    },
    {
      id: 'ielts',
      name: 'IELTS',
      type: '考试备考',
      courseFee: 900,
      lessons: '1:1六节',
      suitable: '适合想在成人弹性校区准备IELTS基础、题型和考试策略的学生。',
      pricesByRoom: this.makeCoursePrices(900),
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    {
      label: 'Unlimited ESL',
      lessons: '每周可调整课表，公开促销常见为Studio Single组合',
      four: 'USD 2,150 / 4周参考促销',
      note: '适合工作时间每周变化的学生；正式价格和促销期需向学校确认。',
    },
    {
      label: '额外1:1课程',
      lessons: '日间或夜间一对一',
      four: 'PHP 7,000 / 4周参考',
      note: '公开资料提到可追加一对一课程，适用时间和名额需确认。',
    },
    {
      label: 'Peak Season Surcharge',
      lessons: '暑期旺季',
      four: 'USD 40 / 周',
      note: '公开表列旺季期间需额外加收；本页报价器未自动计入。',
    },
    {
      label: 'Studio Double限制',
      lessons: '2人房使用规则',
      four: '非费用项目',
      note: '公开说明通常限同性朋友、家人或夫妻；个人合住需提前确认。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '08:00 - 11:50',
      title: '上午课程 / 工作时段',
      text: 'Light、Speed、IELTS等日间课程可安排一对一或小组课；Flexi学生可保留工作时间。',
    },
    {
      time: '12:00 - 12:50',
      title: '午餐',
      text: '公开资料列每日三餐，餐食规则以学校当期说明为准。',
    },
    {
      time: '13:00 - 16:50',
      title: '下午课程 / Coworking',
      text: 'ESP、BizSpeak、Native和IELTS按课程目标安排；Workcation学生可使用工作区。',
    },
    {
      time: '17:00 - 20:50',
      title: 'Flexi夜间一对一',
      text: 'Flexi-Light和Flexi-Speed面向白天工作、晚上学习的学生。',
    },
    {
      time: '晚间',
      title: 'Optional Night / 自习',
      text: '可按课程与当期安排参加选修、复习或使用学习空间；City Campus公开资料列无门禁。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 100', note: '本页报价器已计入；公开费用表列入学金USD 100' },
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
      text: '核对Light、Speed、Flexi、BizSpeak、IELTS，以及Studio或Semi房型空位。',
    },
    {
      icon: 'payments',
      title: '拆清主费和当地费',
      text: '把课程住宿餐食、入学金、SSP、签证、押金、水电、教材、维护费、洗衣和接机分开列清。',
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
    'Light ESL',
    'Speed ESL',
    'Native ESL',
    'BizSpeak',
    'Flexi-Light ESL',
    'Flexi-Speed ESL',
    'IELTS',
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
    '本页费用按公开City Campus美元表整理，主费通常为课程、住宿和每日三餐，入学金和当地费用另计。',
    '12周以上价格使用公开费用表的长期优惠口径做估算，正式报价需按学校当期报价单确认。',
    'Studio Double通常不按普通陌生合住房处理，需确认同行关系、性别和学校空房规则。',
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
        '不包含全部。报价器主要估算课程、住宿、餐食主费和入学金；SSP、签证、ACR、押金、水电、教材、维护费、洗衣、接机和旺季费需另行准备。',
    },
    {
      question: 'City Campus适合边工作边学习吗？',
      answer:
        '适合列入候选。City Campus公开定位为成人、专业人士和工作者，Flexi课程、Coworking和线上会议空间对Workcation更友好。',
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
      this.roomOptions.map((room) => [room.id, this.makePackagePrices(courseFee + room.fee)]),
    );
  }

  private makePackagePrices(baseFourWeeks: number): Record<WeekOption, number> {
    return {
      1: Math.round(baseFourWeeks * 0.4),
      2: Math.round(baseFourWeeks * 0.6),
      3: Math.round(baseFourWeeks * 0.8),
      4: baseFourWeeks,
      8: baseFourWeeks * 2,
      12: baseFourWeeks * 3 - 100,
      16: baseFourWeeks * 4 - 150,
      20: baseFourWeeks * 5 - 200,
      24: baseFourWeeks * 6 - 250,
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

  get quoteUsd(): number {
    return this.registrationFee + this.selectedPackageFee;
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
      return '当前入学日期落在公开2026暑期旺季区间，旺季附加费参考USD 40/周，本页报价器未自动加总。';
    }

    return this.selectedWeeks >= 12
      ? '当前选择为12周以上，需确认长期优惠、签证延长、ACR I-Card、入学日和房型空位。'
      : '当前选择为短中期课程，需确认City Campus当期价格、房型空位、接机和当地费用。';
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}
