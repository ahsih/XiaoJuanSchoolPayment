import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12;

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
  note: string;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  fourWeekFees: Record<string, number>;
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
  selector: 'app-curious-world-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './curious-world-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './curious-world-school.component.css',
  ],
})
export class CuriousWorldSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFee = 150;
  readonly usdToCny = 7.2;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12];

  selectedCourseId = 'esl-standard';
  selectedRoomId = 'quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_city',
      label: '学校类型',
      value: '日系运营 / 宿务市区半斯巴达',
      note: '官方定位为Cebu高性价比学校，强调出发前评估、个别化课程和持续学习支持',
    },
    {
      icon: 'record_voice_over',
      label: '课程重点',
      value: 'ESL / TEST / Business / Working Holiday',
      note: '公开课程覆盖ESL标准、密集、超密集，以及IELTS/TOEFL/TOEIC/英检/商务方向',
    },
    {
      icon: 'hotel',
      label: '校园住宿',
      value: '原酒店改造，同楼学习生活',
      note: '官方说明教室和住宿在同一设施内，SM City Cebu步行约7分钟',
    },
    {
      icon: 'groups',
      label: '规模参考',
      value: '约200名学生',
      note: '公开资料列定员约200名，适合想要小中型但设施完整的学生',
    },
    {
      icon: 'restaurant',
      label: '餐食',
      value: '平日3餐 / 周末节假日早餐为主',
      note: '2026费用表说明套餐含学费、宿舍与餐食，餐食口径需按当期确认',
    },
    {
      icon: 'self_improvement',
      label: '课外活动',
      value: 'Zumba / Island Hopping / SDGs Fieldwork',
      note: '官方列Zumba、海岛活动和社会课题体验活动，是否成团以现场安排为准',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'CWA校区建筑',
      description:
        '公开资料显示CWA位于宿务市区Mabolo生活圈，校舍由原酒店物业改造。',
      src: 'https://philippines-study.tw/wp-content/uploads/2023/12/C19183B1-5E81-496F-BA23-800D336A0C1A-1.jpg',
    },
    {
      category: '校园',
      title: 'CWA接待大厅',
      description:
        '现代化大厅与接待区，适合第一次到校办理报到、说明会和日常咨询。',
      src: 'https://storage.googleapis.com/world-study-prod/media/school_photo/3360/2037d869-508e-4e47-afda-a85290b51abe.jpg',
    },
    {
      category: '教室',
      title: 'CWA教师与教材',
      description:
        '官方资料强调出发前程度评估、教材安排和教师匹配，让短期学习减少适应损耗。',
      src: 'https://curious-world-academy.com/wp-content/uploads/2026/03/20221223132707_IMG_56822-768x512-1.jpg',
    },
    {
      category: '设施',
      title: 'CWA泳池区域',
      description:
        '校园设施包含泳池、健身房、学生休息区和餐厅，学习之外也有放松空间。',
      src: 'https://d2sj6gv6213dvd.cloudfront.net/files/School/70916/x1080/1-4.jpg',
    },
    {
      category: '住宿',
      title: 'CWA宿舍参考',
      description:
        '公开资料显示部分多人房带独立学习位和收纳空间，具体房型需按当期空房确认。',
      src: 'https://stat.ameba.jp/user_images/20250626/19/japan-australia-com/46/2b/j/o1477110915623827818.jpg',
    },
    {
      category: '教室',
      title: '一对一与小组学习空间',
      description:
        'CWA课程以一对一为核心，按标准、密集、超密集课程调整每日输出量。',
      src: 'https://studyabroad.veraacademy.edu.vn/wp-content/uploads/2025/04/CWA-Giao-vien-hoc-sinh-3.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务Curious World Academy' },
    { label: '英文名称', value: 'Curious World Academy（CWA）' },
    { label: '位置', value: 'Limbong Street, corner C. Mina St, Cebu City / Mabolo Area' },
    { label: '机场交通', value: '公开资料约30分钟车程，实际视交通状况而定' },
    { label: '周边', value: 'SM City Cebu步行约7-9分钟，市区生活便利' },
    { label: '学校定位', value: '日系运营、宿务市区半斯巴达、高性价比、出发前学习规划' },
    { label: '主要课程', value: 'ESL、TEST、Business English、Working Holiday准备、Workcation Light' },
    { label: '房型', value: '公开2026费用表按1人房、2人房、3人房、4人房计算' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://storage.googleapis.com/world-study-prod/media/school_photo/3360/2037d869-508e-4e47-afda-a85290b51abe.jpg',
      title: '出发前先做学习规划',
      text: '官方说明可在出发前进行程度测试和学习咨询，到校后更快进入合适教材与课程。',
    },
    {
      image: 'https://curious-world-academy.com/wp-content/uploads/2026/03/20221223132707_IMG_56822-768x512-1.jpg',
      title: '一对一课量选择弹性大',
      text: 'ESL和TEST路线都可按4节、6节、7节一对一强度规划，适合短期或目标明确的学生。',
    },
    {
      image: 'https://d2sj6gv6213dvd.cloudfront.net/files/School/70916/x1080/1-4.jpg',
      title: '市区便利与设施兼顾',
      text: '同楼住宿、餐厅、泳池、健身房和Mabolo/SM City周边生活圈，适合第一次宿务游学。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '英语初学者或基础重建',
      text: 'ESL Standard从4节一对一+2节小组开始，适合想系统补听说读写基础的人。',
    },
    {
      title: '短期想提高一对一密度',
      text: 'Intensive和Super Intensive可把每日一对一提高到6-7节，适合假期有限的学生。',
    },
    {
      title: '考试/商务/打工度假准备',
      text: 'TEST课程覆盖IELTS、TOEFL、TOEIC、英检和Business方向，可作为下一阶段出国前衔接。',
    },
    {
      title: '想住市区且预算可控',
      text: 'Mabolo位置和公开2026费用表让它适合和3D、CELLA、I.BREEZE等市区学校一起比较。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想海边度假校区',
      text: 'CWA更偏Cebu City市区便利，如果想海景/度假感，可以同步看CIA、Genius或Cebu Blue Ocean。',
    },
    {
      title: '需要超严格斯巴达管理',
      text: '公开资料更像半斯巴达和自习支持，强制管理需求可比较CG Sparta、EV、SMEAG。',
    },
    {
      title: '周末餐食/活动必须固定',
      text: '不同公开资料对餐食和活动安排口径有差异，正式报名要逐项确认。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'quad', name: '4人房', note: '公开2026主表最低常规房型，适合控制预算。' },
    { id: 'triple', name: '3人房', note: '预算和居住舒适度折中，需按性别查空房。' },
    { id: 'twin', name: '2人房', note: '适合想要更安静、但不一定住单人房的学生。' },
    { id: 'single', name: '1人房', note: '隐私更好，热门档期通常最需要提前确认。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'esl-standard',
      name: 'ESL Standard',
      type: '一般英语',
      lessons: '1:1四节 + 小组两节',
      suitable: '适合第一次游学、基础重建和想平衡学习与复习时间的学生。',
      fourWeekFees: { single: 2000, twin: 1600, triple: 1500, quad: 1400 },
    },
    {
      id: 'esl-intensive',
      name: 'ESL Intensive',
      type: '口语强化',
      lessons: '1:1六节 + 小组一节',
      suitable: '适合想提高一对一比例、集中补弱项和短期进步更明显的学生。',
      fourWeekFees: { single: 2200, twin: 1800, triple: 1700, quad: 1600 },
    },
    {
      id: 'esl-super-intensive',
      name: 'ESL Super Intensive',
      type: '高密度一对一',
      lessons: '1:1七节',
      suitable: '适合需要大量输出、希望课程都以个人弱点为核心安排的学生。',
      fourWeekFees: { single: 2300, twin: 1900, triple: 1800, quad: 1700 },
    },
    {
      id: 'test-standard',
      name: 'TEST Standard',
      type: '考试 / 商务',
      lessons: '1:1四节 + 小组两节',
      suitable: '适合IELTS、TOEFL、TOEIC、英检、商务或工作假期基础准备。',
      fourWeekFees: { single: 2100, twin: 1700, triple: 1600, quad: 1500 },
    },
    {
      id: 'test-intensive',
      name: 'TEST Intensive',
      type: '考试强化',
      lessons: '1:1六节 + 小组一节',
      suitable: '适合有明确分数目标，需要更高练习量和个人反馈的学生。',
      fourWeekFees: { single: 2300, twin: 1900, triple: 1800, quad: 1700 },
    },
    {
      id: 'test-super-intensive',
      name: 'TEST Super Intensive',
      type: '考试高密度',
      lessons: '1:1七节',
      suitable: '适合短期冲刺或希望全部课程围绕考试/商务目标定制的学生。',
      fourWeekFees: { single: 2400, twin: 2000, triple: 1900, quad: 1800 },
    },
    {
      id: 'workcation',
      name: 'Workcation Light',
      type: '淡季轻量',
      lessons: '1:1三节',
      suitable: '公开资料列4-6月、9-1月淡季限定，适合边远程工作边学习。',
      fourWeekFees: { single: 900, twin: 800, triple: 700, quad: 600 },
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    {
      label: '周末加课',
      lessons: '1日5节 x 2日',
      four: 'JPY 12,000 / 周参考',
      note: '公开资料列可选，是否开放需按当期确认。',
    },
    {
      label: '追加一对一',
      lessons: '1日1节 x 1周',
      four: 'JPY 6,000 / 周参考',
      note: '公开资料列可追加，老师空位和课程安排需确认。',
    },
    {
      label: 'Workcation Light',
      lessons: '1:1三节',
      four: 'USD 600 / 4周起',
      note: '淡季限定路线，不适合所有入学日期。',
    },
    {
      label: 'TEST方向',
      lessons: 'IELTS / TOEFL / TOEIC / 英检 / Business',
      four: 'USD 1,500 / 4周起',
      note: '按Standard、Intensive、Super Intensive和房型变化。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '06:30 - 08:00',
      title: '早餐 / 课前准备',
      text: '公开资料列早餐时段约6:30-8:00，实际以到校说明为准。',
    },
    {
      time: '08:00 - 11:50',
      title: '上午1:1课程',
      text: '按课程安排一对一或空堂复习，Super Intensive一对一密度最高。',
    },
    {
      time: '11:30 - 13:00',
      title: '午餐',
      text: '公开资料列校内餐厅/自助餐形式，繁忙期餐食时段可能调整。',
    },
    {
      time: '13:00 - 17:50',
      title: '下午课程 / 自习',
      text: 'ESL、TEST、商务或工作假期方向按学习目标进入不同教材与课堂。',
    },
    {
      time: '19:00 - 19:50',
      title: 'Special Lesson / Zumba',
      text: '公开资料列周四晚特别课、周二至周四Zumba等自由参加活动参考。',
    },
    {
      time: '20:00以后',
      title: '自习 / 门禁管理',
      text: '公开资料列有门禁和自习室时间，未成年学生规则更严格。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 100-150', note: '不同公开来源存在USD100/150口径，本页报价器暂按USD150保守估算' },
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，通常首次办理' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '公开资料列与SSP同办' },
    { item: 'ACR I-Card', amount: 'PHP 4,500', note: '通常9周以上需确认' },
    { item: 'ID Card', amount: 'PHP 500', note: '学生证参考费用' },
    { item: '电费', amount: 'PHP 800 / 4周', note: '公开2026表列参考，实际按学校政策计算' },
    { item: '水费', amount: 'PHP 300 / 4周', note: '公开2026表列参考' },
    { item: '设施管理费', amount: 'PHP 600 / 4周', note: '清扫/床品等管理费用参考' },
    { item: '机场接机', amount: 'PHP 1,500', note: '抵达时接机参考，家庭或特殊时段需确认' },
    { item: '押金', amount: 'PHP 1,500', note: '退房时扣除实际费用后结算' },
    { item: '签证延长', amount: 'PHP 5,130起', note: '5-8周起通常产生，周数越长费用越高' },
    { item: '延泊/前泊', amount: 'PHP 2,000 / 晚', note: '是否可安排需看房型空位' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断CWA是否适合',
      text: '根据市区便利、预算、一对一课量、考试目标和是否淡季Workcation做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程和房型',
      text: '核对ESL/TEST强度、1-4人房、性别空位、入学日和当前餐食口径。',
    },
    {
      icon: 'payments',
      title: '拆清套餐和当地费用',
      text: '把学费住宿、注册费、SSP、签证、押金、水电、教材、接机逐项列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备入学文件',
      text: '协助整理护照、保险、eTravel、接机资料、现金清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '课程、老师、宿舍、账单或校规沟通问题，都可以继续联系顾问协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可按情况提供当地沟通支持。',
    },
  ];

  readonly trustBadges = [
    { icon: 'description', label: '2026费用逐项核验' },
    { icon: 'verified_user', label: '课程与房型提前确认' },
    { icon: 'payments', label: '套餐与当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '出发前程度测试',
    '学习咨询',
    '教材匹配',
    '一对一课程',
    '小组课',
    'Special Lesson',
    '校内宿舍',
    '食堂',
    '泳池',
    '健身房',
    'Wi-Fi',
    '自习室',
  ];
  readonly campusActivities = [
    'Zumba',
    'Thursday Special Lesson',
    'Island Hopping',
    'Oslob Whale Shark Tour',
    'SDGs Fieldwork',
    '校内交流活动',
  ];
  readonly weekendActivities = [
    'SM City Cebu',
    'Mabolo餐厅',
    'IT Park',
    'Ayala Center Cebu',
    '咖啡厅和按摩',
    'Mactan周末活动',
  ];
  readonly notes = [
    '本页费用使用公开2026 USD套餐表；正式报价会按学校当期价格、入学日期、房型和优惠调整。',
    '公开来源对注册费和餐食口径存在差异，报名时需以学校最新报价单和入学说明为准。',
    'Workcation Light为淡季限定，不能直接当作全年最低价。',
    '周末加课、追加一对一、活动和前后泊安排都需要提前确认是否开放。',
    '如果目标是强制管理或海边度假，应同步比较CG Sparta/EV/SMEAG或CIA/Genius/CBOA。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'Curious World Academy和CIA最大的区别是什么？',
      answer:
        'CIA更偏Mactan大型半斯巴达综合型新校区；CWA更偏Cebu City/Mabolo市区便利、日系运营、出发前学习规划和高性价比一对一课程。',
    },
    {
      question: '页面上的费用包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算课程住宿套餐和注册费；SSP、SSP E-Card、签证、押金、水电、教材、接机、ID和个人生活费需另行确认。',
    },
    {
      question: 'CWA适合英语初学者吗？',
      answer:
        '适合列入候选。官方强调出发前程度评估和学习咨询，ESL Standard也适合想从基础听说读写开始补的学生。',
    },
    {
      question: 'CWA适合考试或商务英语吗？',
      answer:
        '可以比较。公开课程列TEST Standard/Intensive/Super Intensive，覆盖IELTS、TOEFL、TOEIC、英检和Business方向。',
    },
    {
      question: 'CWA的住宿有什么要确认？',
      answer:
        '需确认实际房型、性别空位、同楼住宿规则、餐食、清扫洗衣、门禁、自习室时段和周末外出/外泊规则。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '特殊课程', target: 'special-fees', icon: 'bolt' },
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
    { label: 'CWA官方英文网站', url: 'https://curious-world-academy.com/en/' },
    { label: 'Cebu English CWA 2026费用与课程', url: 'https://cebu-english.com/school/curiousworld-academy/' },
    { label: '菲律宾留学中心 CWA Main Campus', url: 'https://www.ph-ryugaku.com/school/curious-world-main/' },
    { label: 'Cebu留学Academy CWA Mabolo费用', url: 'https://www.cebu-55.com/school/cebu/curious-world-academy-mabolo/' },
    { label: 'DEOW台湾 CWA费用参考', url: 'https://philippines-study.tw/school/curious-world-academy/' },
  ];

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
    const fourWeekFee = course?.fourWeekFees[roomId] ?? 0;

    return Math.round(fourWeekFee * this.durationMultiplier(weeks));
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
      return '入学日期需要和学校确认，旺季加价、假期和空房会影响最终报价。';
    }

    const isPeakSeason = this.isBetween(start, '2026-06-29', '2026-08-30');

    return isPeakSeason
      ? '当前日期可能落在公开资料列出的夏季旺季区间，可能另有约JPY 5,000/周旺季加价。'
      : '当前日期暂未落在公开资料示例旺季区间，但仍需按学校当期日历确认。';
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }

  private durationMultiplier(weeks: WeekOption): number {
    const multipliers: Record<WeekOption, number> = {
      1: 0.4,
      2: 0.6,
      3: 0.8,
      4: 1,
      8: 2,
      12: 3,
    };

    return multipliers[weeks];
  }

  private isBetween(date: Date, from: string, to: string): boolean {
    const start = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T23:59:59`);

    return date >= start && date <= end;
  }
}
