import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12;

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
  pricesByPlan: Record<string, Record<WeekOption, number>>;
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
  selector: 'app-qqenglish-beachfront-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './qqenglish-beachfront-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './qqenglish-beachfront-school.component.css',
  ],
})
export class QqenglishBeachfrontSchoolComponent {
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
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 5, 6, 7, 8, 12];

  selectedCourseId = 'four-mtm-two-group';
  selectedRoomId = 'capsule-meal';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'beach_access',
      label: '学校类型',
      value: 'Mactan Newtown海滨新校区',
      note: '官方说明Beach Front Campus在2024年4月开放，位于麦克坦岛Mactan Newtown。',
    },
    {
      icon: 'record_voice_over',
      label: '课程重点',
      value: '1:1菲律宾外教 / Group / R.E.M.S.',
      note: '课程按每日一对一与小组课数量选择，可搭配Callan、R.E.M.S.、Business和TOEIC等教材。',
    },
    {
      icon: 'hotel',
      label: '住宿选择',
      value: '校内胶囊学生寮 / 自理住宿',
      note: '官方公开表同时列出只上课价格，以及含胶囊宿舍和餐食的留学套餐。',
    },
    {
      icon: 'restaurant',
      label: '餐食',
      value: '校内餐厅 / 三餐可选',
      note: '含住宿套餐通常含餐食；只上课方案可按官方餐食费口径另加。',
    },
    {
      icon: 'schedule',
      label: '入学弹性',
      value: '短期1周到12周参考',
      note: '官方价格表从短期到12周列示，长期或特殊日期需按学校当期确认。',
    },
    {
      icon: 'waves',
      label: '校园设施',
      value: '海滩 / 健身房 / 自习区 / 游戏区',
      note: '公开资料列Beach、Rooftop、Gym、Recreational Area、Capsule Dorm和Cafeteria。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'Mactan Newtown校区',
      description:
        'Beach Front Campus位于麦克坦岛Mactan Newtown，适合想住海边生活圈的学生。',
      src: 'https://qqeng.net/wp-content/uploads/2024/04/newtown.png',
    },
    {
      category: '校园',
      title: 'Beach Front Campus海边环境',
      description:
        '官方资料强调从校园走向海边的学习生活体验，适合短期体验和成人口语。',
      src: 'https://qqenglish.jp/assets/images/school/beachfront/beachfront-new1.jpg',
    },
    {
      category: '教室',
      title: 'Lesson Area',
      description:
        'QQEnglish以一对一菲律宾外教课程为核心，按每日4、6、8节一对一规划强度。',
      src: 'https://qqenglish.jp/assets/images/school/beachfront/bfc-campus-01.jpg',
    },
    {
      category: '餐厅',
      title: 'Cafeteria',
      description:
        '校内餐厅支持含餐套餐，餐食是否包含取决于选择只上课还是宿舍餐食套餐。',
      src: 'https://qqenglish.jp/assets/images/school/beachfront/bfc-campus-03.jpg',
    },
    {
      category: '住宿',
      title: 'Campus Reception and Lounge',
      description:
        '公开住宿资料显示内部寮在校内，适合把学习、休息和自习集中安排。',
      src: 'https://qqenglish.jp/assets/images/school/beachfront/bfc-campus-00-2.jpg',
    },
    {
      category: '设施',
      title: 'Gym and Recreational Area',
      description:
        '公开设施包含健身房、娱乐区、自习空间和屋顶区域，学习之外也有放松空间。',
      src: 'https://qqenglish.jp/assets/images/school/beachfront/beachfront-new4.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务QQEnglish（Beachfront Campus）' },
    { label: '英文名称', value: 'QQEnglish Beach Front Campus' },
    { label: '位置', value: 'Mactan Newtown, Lapu-Lapu City, Cebu' },
    { label: '开放时间', value: '官方资料列2024年4月开放的新校区' },
    { label: '学校定位', value: '海滨新校区、菲律宾外教一对一、成人/亲子短期友好' },
    { label: '主要课程', value: '4/6/8节一对一、Group Class、Callan、R.E.M.S.、Business、TOEIC、IELTS、Kids' },
    { label: '住宿', value: '胶囊学生寮；也可选择只上课并自行安排酒店、公寓或外部住宿' },
    { label: '费用口径', value: '官方英文表列只上课价格；官方日文表列含学生寮与餐食的套餐价格' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://qqeng.net/wp-content/uploads/2024/04/newtown.png',
      title: 'Mactan Newtown生活圈',
      text: '校区在麦克坦岛成熟生活区，适合想靠近机场、海边、商场和餐厅资源的学生。',
    },
    {
      image: 'https://qqenglish.jp/assets/images/school/beachfront/bfc-campus-01.jpg',
      title: '课量选择很直观',
      text: '每天4、6、8节一对一，再决定是否加2节小组课，适合按预算和强度快速比较。',
    },
    {
      image: 'https://qqenglish.jp/assets/images/school/beachfront/beachfront-new1.jpg',
      title: '短期体验友好',
      text: '公开价格支持短周数查询，也可用只上课方案搭配自订酒店或公寓，适合短假期学生。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想要海边新校区',
      text: 'Beachfront Campus在Mactan Newtown，适合想兼顾学习、海边环境和机场便利的人。',
    },
    {
      title: '想大量上一对一',
      text: 'QQEnglish课程选择以4、6、8节一对一为核心，适合想提升开口量和老师反馈的人。',
    },
    {
      title: '短期或弹性游学',
      text: '公开价格表从短期到12周都有参考，适合1-4周短假期，也适合8-12周系统学习。',
    },
    {
      title: '愿意住胶囊宿舍或自理住宿',
      text: '如果能接受胶囊学生寮，学校内学习住宿方便；也可用只上课方案自订住宿。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '需要传统单人房/双人房校园宿舍',
      text: 'Beachfront公开住宿主打胶囊学生寮；若想要普通宿舍房型，可同步比较CIA、CBOA或CELLA。',
    },
    {
      title: '想要强制斯巴达管理',
      text: 'QQEnglish更偏弹性一对一和自律学习；强制晚自习、门禁和考试冲刺可看CG Sparta、EV或SMEAG。',
    },
    {
      title: '不想拆分费用口径',
      text: 'QQEnglish有只上课、住宿、餐食、接机和当地费用等口径，正式报名需要逐项核价。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    {
      id: 'capsule-meal',
      name: '胶囊学生寮 + 餐食套餐',
      note: '采用官方公开“学生寮・食事付き”美元套餐表，适合想一站式安排的学生。',
    },
    {
      id: 'lesson-only',
      name: '只上课，自理住宿/餐食',
      note: '采用官方英文Lesson Plan价格，不含住宿、餐食、接机和当地费用。',
    },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'four-mtm',
      name: '4节一对一',
      type: '轻量口语',
      lessons: '每日4节1:1',
      suitable: '适合第一次游学、想保留较多自由时间或预算较敏感的学生。',
      pricesByPlan: {
        'lesson-only': { 1: 276, 2: 490, 3: 588, 4: 784, 5: 980, 6: 1176, 7: 1372, 8: 1520, 12: 2280 },
        'capsule-meal': { 1: 484, 2: 833, 3: 1121, 4: 1395, 5: 1752, 6: 2109, 7: 2466, 8: 2775, 12: 4179 },
      },
    },
    {
      id: 'four-mtm-two-group',
      name: '4节一对一 + 2节小组',
      type: '标准平衡',
      lessons: '每日4节1:1 + 2节Group',
      suitable: '适合想兼顾个人反馈和同学互动的成人口语学生。',
      pricesByPlan: {
        'lesson-only': { 1: 315, 2: 554, 3: 663, 4: 884, 5: 1105, 6: 1326, 7: 1547, 8: 1713, 12: 2569 },
        'capsule-meal': { 1: 523, 2: 897, 3: 1196, 4: 1495, 5: 1877, 6: 2259, 7: 2641, 8: 2968, 12: 4468 },
      },
    },
    {
      id: 'six-mtm',
      name: '6节一对一',
      type: '口语强化',
      lessons: '每日6节1:1',
      suitable: '适合短期想集中输出、希望多数课程围绕个人弱点安排的学生。',
      pricesByPlan: {
        'lesson-only': { 1: 435, 2: 690, 3: 831, 4: 1078, 5: 1347, 6: 1616, 7: 1886, 8: 2155, 12: 3233 },
        'capsule-meal': { 1: 643, 2: 1033, 3: 1364, 4: 1689, 5: 2119, 6: 2549, 7: 2980, 8: 3410, 12: 5132 },
      },
    },
    {
      id: 'six-mtm-two-group',
      name: '6节一对一 + 2节小组',
      type: '高强度平衡',
      lessons: '每日6节1:1 + 2节Group',
      suitable: '适合想保留小组互动，同时把一对一课量拉高的学生。',
      pricesByPlan: {
        'lesson-only': { 1: 474, 2: 754, 3: 906, 4: 1178, 5: 1472, 6: 1766, 7: 2061, 8: 2348, 12: 3522 },
        'capsule-meal': { 1: 682, 2: 1097, 3: 1439, 4: 1789, 5: 2244, 6: 2699, 7: 3155, 8: 3603, 12: 5421 },
      },
    },
    {
      id: 'eight-mtm',
      name: '8节一对一',
      type: '密集一对一',
      lessons: '每日8节1:1',
      suitable: '适合时间短、目标明确、想把每天几乎全部课程用于个人训练的学生。',
      pricesByPlan: {
        'lesson-only': { 1: 580, 2: 920, 3: 1108, 4: 1437, 5: 1796, 6: 2155, 7: 2514, 8: 2874, 12: 4310 },
        'capsule-meal': { 1: 788, 2: 1263, 3: 1641, 4: 2048, 5: 2568, 6: 3088, 7: 3608, 8: 4129, 12: 6209 },
      },
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    {
      label: '校内胶囊学生寮',
      lessons: '住宿单独加购口径',
      four: 'USD 13 x 住宿晚数参考',
      note: '报价器默认使用官方含学生寮与餐食套餐表，单独加购需学校确认。',
    },
    {
      label: '餐食',
      lessons: '3餐 / 天参考',
      four: 'USD 10 x 天数参考',
      note: '只上课方案若要加餐，需按学校当期餐食规则确认。',
    },
    {
      label: '机场接机',
      lessons: 'Mactan-Cebu机场',
      four: 'USD 30参考',
      note: '是否需要接机、抵达日和航班时间需提前确认。',
    },
    {
      label: '假日开课费',
      lessons: '菲律宾假日上课',
      four: 'USD 35 / 天参考',
      note: '官方英文费用页列为Holiday fee，假日是否上课需按校历确认。',
    },
    {
      label: '周末加课',
      lessons: '周六/周日课程',
      four: 'USD 35 / 天 + 课程费参考',
      note: '官方日文资料列可选Weekend Lesson，老师与教室空位需确认。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 08:30',
      title: '早餐 / 海边散步',
      text: '选择含餐套餐时可在校内用餐，Beachfront校区也适合早上轻量活动。',
    },
    {
      time: '09:00 - 12:00',
      title: '上午一对一课程',
      text: '按4、6或8节一对一强度进入不同课表，可搭配Callan、R.E.M.S.或日常口语。',
    },
    {
      time: '12:00 - 13:00',
      title: '午餐 / 休息',
      text: '含餐、加餐或自理餐食的安排不同，报名时要先确认费用口径。',
    },
    {
      time: '13:00 - 18:00',
      title: '下午课程 / Group Class',
      text: '标准和平衡路线可加入Group Class，增加讨论、表达和同学互动。',
    },
    {
      time: '18:00 - 20:00',
      title: '晚餐 / 健身 / 海边活动',
      text: '公开资料列Gym、Recreational Area和Beach开放时段，实际以校内规则为准。',
    },
    {
      time: '20:00以后',
      title: '复习 / 自由时间',
      text: 'QQEnglish更偏弹性学习，适合能自主安排复习和生活节奏的学生。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 150', note: '官方英文费用页列示，报价器已计入' },
    { item: '海外送金手续费', amount: 'USD 30', note: '官方日文费用页列示，是否适用需按报名渠道确认' },
    { item: '机场接机', amount: 'USD 30', note: '官方英文费用页列示，按航班和抵达安排确认' },
    { item: '假日开课费', amount: 'USD 35 / 天', note: '菲律宾假日上课时可能产生' },
    { item: 'SSP', amount: 'PHP 10,440', note: '6个月有效，菲律宾学习许可' },
    { item: '签证延长', amount: 'PHP 4,460起', note: '31天以上常见；60天以上费用更高' },
    { item: 'ACR I-Card', amount: 'PHP 3,200', note: '60天以上公开费用参考' },
    { item: '学生证', amount: 'PHP 300', note: '公开当地费用参考' },
    { item: '教材费', amount: 'PHP 1,000-2,000', note: '按课程与教材实际使用计算' },
    { item: '宿舍电费', amount: 'PHP 100 / 天', note: '校内宿舍学生公开参考口径' },
    { item: '个人生活费', amount: 'USD 200-400 / 月', note: '餐饮、交通、通信、活动和购物因人而异' },
    { item: '机票 / 保险', amount: '自行安排', note: '报名报价通常不含国际机票和海外保险' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断QQEnglish是否适合',
      text: '根据海边校区、胶囊宿舍、一对一课量、预算和是否自理住宿做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程与方案',
      text: '核对4/6/8节一对一、是否加Group、选择含宿舍餐食还是只上课。',
    },
    {
      icon: 'payments',
      title: '拆清主费和当地费',
      text: '把课程套餐、注册费、SSP、签证、宿舍电费、教材、接机和假日费分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备入学文件',
      text: '协助整理护照、保险、eTravel、接机资料、现金清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '课程、宿舍、餐食、费用或校规沟通问题，都可以继续联系顾问协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可按情况提供当地沟通支持。',
    },
  ];

  readonly trustBadges = [
    { icon: 'description', label: '官方费用逐项整理' },
    { icon: 'verified_user', label: '课程与住宿提前确认' },
    { icon: 'payments', label: '主费与当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '一对一课程',
    'Group Class',
    'Callan Method',
    'R.E.M.S.',
    'Business English',
    'TOEIC / IELTS',
    'Kids English',
    '胶囊学生寮',
    '校内餐厅',
    'Beach',
    'Rooftop',
    'Gym',
    'Recreational Area',
    '自习区',
  ];
  readonly campusActivities = [
    '海边散步',
    '健身房',
    '娱乐区',
    '自习复习',
    'Mactan Newtown生活圈',
    '周末选修课',
  ];
  readonly weekendActivities = [
    'Mactan Newtown',
    'Lapu-Lapu餐厅',
    'Mactan海岛活动',
    '机场周边商场',
    'Cebu City一日行程',
    '咖啡厅和按摩',
  ];
  readonly notes = [
    '本页课程费用按QQEnglish官方公开美元价格整理；正式报价需按学校当期价格、入学日和方案确认。',
    '“胶囊学生寮 + 餐食套餐”使用官方公开含学生寮与餐食的套餐表；“只上课”不含住宿、餐食、接机和当地费用。',
    'SSP、签证延长、ACR I-Card、教材、学生证、宿舍电费、假日开课和个人生活费通常另计。',
    'Beachfront公开住宿主打胶囊学生寮；如需酒店、公寓或更私密房型，建议用只上课方案另行安排。',
    '节假日、周末加课、课程教材、老师空位和校区容量都会影响最终安排。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'QQEnglish Beachfront和CIA最大的区别是什么？',
      answer:
        'CIA是大型半斯巴达综合校区，住宿房型更传统；QQEnglish Beachfront更偏Mactan Newtown海边新校区、弹性一对一课程和胶囊学生寮/自理住宿选择。',
    },
    {
      question: '页面上的费用包含全部费用吗？',
      answer:
        '不包含全部。报价器估算课程主费和注册费；SSP、签证、ACR、教材、学生证、宿舍电费、接机、假日费、机票保险和个人生活费需另行确认。',
    },
    {
      question: 'QQEnglish适合英语初学者吗？',
      answer:
        '适合列入候选。一对一课程比例高，初学者可以从4节一对一或4节一对一+2节小组开始，再按体力和目标加课。',
    },
    {
      question: '如果我不想住胶囊宿舍怎么办？',
      answer:
        '可以选择只上课方案，自行安排酒店、公寓或其他住宿；报名时需要确认通勤、餐食、接机和安全便利度。',
    },
    {
      question: 'QQEnglish适合亲子或孩子吗？',
      answer:
        '可以比较。官方课程包含Kids English和青少年相关教材，但需确认孩子年龄、家长是否同行、住宿方案和校区接收规则。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '可选费用', target: 'special-fees', icon: 'bolt' },
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
    { label: 'QQEnglish官方英文网站', url: 'https://qqeng.net/' },
    { label: 'QQEnglish Beach Front Campus官方介绍', url: 'https://qqeng.net/study-english-abroad/beach-front-campus/' },
    { label: 'QQEnglish官方课程与价格', url: 'https://qqeng.net/study-english-abroad/plan-price/' },
    { label: 'QQEnglish官方成人课程说明', url: 'https://qqeng.net/study-english-abroad/curriculum/adults/' },
    { label: 'QQEnglish日文Beachfront费用表', url: 'https://qqenglish.jp/school/beachfront/' },
    { label: 'QQEnglish Beachfront宿泊设施说明', url: 'https://qqenglish.jp/school/beachfront/stay.html' },
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

  feeFor(courseId: string, planId: string, weeks: WeekOption = 4): number {
    const course = this.courseOptions.find((item) => item.id === courseId);

    return course?.pricesByPlan[planId]?.[weeks] ?? 0;
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
      return '入学日期需要和学校确认，节假日、校区空位、住宿餐食和当地费用会影响最终报价。';
    }

    return this.selectedRoomId === 'lesson-only'
      ? '当前选择为只上课方案，住宿、餐食、通勤和接机需要另外安排并确认费用。'
      : '当前选择为含胶囊学生寮与餐食的套餐，仍需确认宿舍空位、节假日、SSP、签证和当地费用。';
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}
