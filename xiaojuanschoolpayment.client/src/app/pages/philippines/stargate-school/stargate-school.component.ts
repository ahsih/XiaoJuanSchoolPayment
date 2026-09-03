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
  note: string;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
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
  selector: 'app-stargate-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './stargate-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './stargate-school.component.css',
  ],
})
export class StargateSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFee = 120;
  readonly usdToCny = 7.2;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];

  selectedCourseId = 'standard';
  selectedRoomId = 'study-quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_city',
      label: '学校类型',
      value: '日本资本 / Cebu City小规模全寮制',
      note: '官方资料列学校和宿舍在Tancor 5同一栋建筑内，适合第一次海外游学和英语初学者。',
    },
    {
      icon: 'record_voice_over',
      label: '课程重点',
      value: 'Man-to-Man / Grammar / TOEIC / Business',
      note: '课程以菲律宾老师一对一为核心，并搭配日语文法视频课、小组课或考试/商务方向。',
    },
    {
      icon: 'support_agent',
      label: '日语支持',
      value: '多名日本职员常驻',
      note: '公开资料强调日本人职员常驻、初学者友好，以及文法可用日语视频重新打底。',
    },
    {
      icon: 'hotel',
      label: '住宿',
      value: 'Premium / Study Focus房型',
      note: '公开2026费用按Premium 1/2人房、Study Focus 1/2/4人房等计算，费用含平日三餐和清扫。',
    },
    {
      icon: 'restaurant',
      label: '餐食',
      value: '平日3餐 / 周末节假日Brunch',
      note: '官方说明平日提供早午晚餐，周末和节假日提供Brunch，并强调营养和长期菜单轮换。',
    },
    {
      icon: 'pool',
      label: '设施',
      value: 'Tancor 5 / 屋顶泳池 / 健身房',
      note: '公开设施页列24小时安保、屋顶泳池、健身房、学生休息区、食堂和稳定Wi-Fi。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '教室',
      title: 'STARGATE教室与Logo墙',
      description:
        '小规模学校环境，适合想要老师和职员更容易照看到的初学者。',
      src: 'https://www.ryugaku-onebridge.com/api/pict/5350?s=750x500',
    },
    {
      category: '教室',
      title: '小组课教室',
      description:
        '公开课程以一对一为核心，也有小组课、TOEIC、Business和Junior课程方向。',
      src: 'https://schoolaplus.com/img/school_photo/Stargate/125-1-10.jpg',
    },
    {
      category: '校园',
      title: 'Tancor 5 Residential Suites',
      description:
        '学校位于Cebu City的Tancor 5，学校和宿舍同楼，减少通勤和安全压力。',
      src: 'https://nativecamp-public-web-production.s3.ap-northeast-1.amazonaws.com/ryugaku_690ac4b54ff0b.webp?v=04cfcdcd150',
    },
    {
      category: '住宿',
      title: 'Study Focus 4人房参考',
      description:
        'Study Focus房型适合预算控制和学习集中，具体房间以当期空房安排为准。',
      src: 'https://cebu21.jp/include/schoolno2/stargatecebu/Dormitory/Dormitory_1.jpg',
    },
    {
      category: '住宿',
      title: '大房型住宿参考',
      description:
        '公开资料说明大房型主要按需求开放，正式报名需确认是否接收个人或团体学生。',
      src: 'https://cebu21.jp/include/schoolno2/stargatecebu/Dormitory/Dormitory_88.jpg',
    },
    {
      category: '设施',
      title: '住宿与生活设施参考',
      description:
        'Tancor 5公寓式生活环境，官方设施页强调24小时安保、Wi-Fi、热水和生活便利。',
      src: 'https://pix10.agoda.net/hotelImages/agoda-homes/10603009/add7ea82b525a53df9fe8ecc75cff2a7.jpg?ca=9&ce=1&s=1024x768',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务STARGATE Global Education' },
    { label: '英文名称', value: 'Star Gate Global Education, Inc. / Stargate' },
    { label: '位置', value: '3F, Tancor 5 Residential Suites, Kasambagan, Cebu City' },
    { label: '设立 / 开校', value: '公司设立2016年12月；公开资料列2017年7月开校' },
    { label: '学校规模', value: '小规模，公开资料列约50名；统计页也出现约65名口径' },
    { label: '学校定位', value: '日本资本、初学者友好、学校宿舍同楼、低中价位、全寮制' },
    { label: '主要课程', value: 'Standard、Power Speaking、Man-to-Man、Enjoy、TOEIC、TOEIC Mix、Business、Junior' },
    { label: '主要规则', value: '官方资料列平日23:00、休前日25:00门禁，馆内禁酒' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://www.ryugaku-onebridge.com/api/pict/5350?s=750x500',
      title: '初学者和第一次海外友好',
      text: '官方资料强调日本资本、多名日本职员、日语文法视频和小规模支持，降低第一次游学压力。',
    },
    {
      image: 'https://schoolaplus.com/img/school_photo/Stargate/125-1-10.jpg',
      title: '一对一课程清楚好选',
      text: 'Standard、Power Speaking、Man-to-Man、Enjoy按每日一对一和小组课数量区分，预算和强度容易比较。',
    },
    {
      image: 'https://nativecamp-public-web-production.s3.ap-northeast-1.amazonaws.com/ryugaku_690ac4b54ff0b.webp?v=04cfcdcd150',
      title: '学校和宿舍同栋楼',
      text: 'Tancor 5同楼学习生活，减少通勤成本，也适合重视安全和生活稳定的成人学生。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '英语初学者和第一次游学',
      text: '一对一为主、日语文法视频和日本职员支持，适合担心听不懂说明或基础薄弱的人。',
    },
    {
      title: '想住宿务市区但不要大型学校',
      text: '小规模学校更容易获得照顾，Kasambagan周边生活便利，也适合成人短中期游学。',
    },
    {
      title: '想控制预算',
      text: 'Study Focus 4人房和Enjoy/Standard课程的公开价相对亲民，适合和3D、GLANT、CWA一起比较。',
    },
    {
      title: '想要住宿环境稳定',
      text: 'Tancor 5公寓式设施、热水、Wi-Fi、泳池和健身房，对重视生活舒适度的人有吸引力。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想海边度假校区',
      text: 'STARGATE在Cebu City，不是Mactan海边校区；海边感可比较CIA、QQEnglish Beachfront、CBOA或Genius。',
    },
    {
      title: '需要大型多国籍校园',
      text: 'STARGATE是小规模学校，日本和台湾学生较多；想要更大规模可比较CIA、EV、CPI或GLC。',
    },
    {
      title: '需要强制斯巴达管理',
      text: 'STARGATE偏初学者支持和半自律学习；强管理或考试冲刺可看CG斯巴达校区、EV或SMEAG。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'premium-single', name: 'Premium 1人房', note: '公寓式独立空间，成人和中长期学生热门。' },
    { id: 'premium-twin', name: 'Premium 2人房', note: '舒适度较高，适合同伴同行或希望住得更安静的学生。' },
    { id: 'study-single', name: 'Study Focus 1人房', note: '比Premium更偏学习集中，兼顾隐私和预算。' },
    { id: 'study-twin', name: 'Study Focus 2人房', note: '预算和舒适度折中，需按性别确认空位。' },
    { id: 'study-quad', name: 'Study Focus 4人房', note: '本页默认最低常规房型，适合预算控制。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'standard',
      name: 'Standard Course',
      type: '一般英语',
      lessons: '1:1四节 + 日语文法视频一节 + 小组两节',
      suitable: '适合第一次游学、英语基础重建和想平衡一对一与小组课的学生。',
      pricesByRoom: {
        'premium-single': { 1: 880, 2: 1540, 3: 1980, 4: 2200, 8: 4400, 12: 6550, 16: 8700, 20: 10850, 24: 13000 },
        'premium-twin': { 1: 720, 2: 1260, 3: 1620, 4: 1800, 8: 3600, 12: 5350, 16: 7100, 20: 8850, 24: 10600 },
        'study-single': { 1: 800, 2: 1400, 3: 1800, 4: 2000, 8: 4000, 12: 5950, 16: 7900, 20: 9850, 24: 11800 },
        'study-twin': { 1: 680, 2: 1190, 3: 1530, 4: 1700, 8: 3400, 12: 5050, 16: 6700, 20: 8350, 24: 10000 },
        'study-quad': { 1: 540, 2: 940, 3: 1210, 4: 1350, 8: 2700, 12: 4000, 16: 5300, 20: 6600, 24: 7900 },
      },
    },
    {
      id: 'power-speaking',
      name: 'Power Speaking Course',
      type: '口语强化',
      lessons: '1:1五节 + 日语文法视频一节 + 小组两节',
      suitable: '适合希望比Standard多一节一对一、提高口语输出频率的学生。',
      pricesByRoom: {
        'premium-single': { 1: 910, 2: 1590, 3: 2050, 4: 2280, 8: 4560, 12: 6790, 16: 9020, 20: 11250, 24: 13480 },
        'premium-twin': { 1: 750, 2: 1310, 3: 1690, 4: 1880, 8: 3760, 12: 5590, 16: 7420, 20: 9250, 24: 11080 },
        'study-single': { 1: 830, 2: 1450, 3: 1870, 4: 2080, 8: 4160, 12: 6190, 16: 8220, 20: 10250, 24: 12280 },
        'study-twin': { 1: 710, 2: 1240, 3: 1600, 4: 1780, 8: 3560, 12: 5290, 16: 7020, 20: 8750, 24: 10480 },
        'study-quad': { 1: 570, 2: 1000, 3: 1280, 4: 1430, 8: 2860, 12: 4240, 16: 5620, 20: 7000, 24: 8380 },
      },
    },
    {
      id: 'man-to-man',
      name: 'Man-to-Man Course',
      type: '高比例一对一',
      lessons: '1:1六节 + 日语文法视频一节',
      suitable: '适合想减少小组课、让课程更多围绕个人弱点安排的学生。',
      pricesByRoom: {
        'premium-single': { 1: 940, 2: 1640, 3: 2110, 4: 2350, 8: 4700, 12: 7000, 16: 9300, 20: 11600, 24: 13900 },
        'premium-twin': { 1: 780, 2: 1360, 3: 1750, 4: 1950, 8: 3900, 12: 5800, 16: 7700, 20: 9600, 24: 11500 },
        'study-single': { 1: 860, 2: 1500, 3: 1930, 4: 2150, 8: 4300, 12: 6400, 16: 8500, 20: 10600, 24: 12700 },
        'study-twin': { 1: 740, 2: 1290, 3: 1660, 4: 1850, 8: 3700, 12: 5500, 16: 7300, 20: 9100, 24: 10900 },
        'study-quad': { 1: 600, 2: 1050, 3: 1350, 4: 1500, 8: 3000, 12: 4450, 16: 5900, 20: 7350, 24: 8800 },
      },
    },
    {
      id: 'enjoy',
      name: 'Enjoy Course',
      type: '轻量学习',
      lessons: '1:1三节 + 日语文法视频一节',
      suitable: '适合想兼顾学习、远程工作、生活体验或体力负担较小的学生。',
      pricesByRoom: {
        'premium-single': { 1: 840, 2: 1480, 3: 1900, 4: 2120, 8: 4240, 12: 6310, 16: 8380, 20: 10450, 24: 12520 },
        'premium-twin': { 1: 680, 2: 1200, 3: 1540, 4: 1720, 8: 3440, 12: 5110, 16: 6780, 20: 8450, 24: 10120 },
        'study-single': { 1: 760, 2: 1340, 3: 1720, 4: 1920, 8: 3840, 12: 5710, 16: 7580, 20: 9450, 24: 11320 },
        'study-twin': { 1: 640, 2: 1130, 3: 1450, 4: 1620, 8: 3240, 12: 4810, 16: 6380, 20: 7950, 24: 9520 },
        'study-quad': { 1: 500, 2: 880, 3: 1140, 4: 1270, 8: 2540, 12: 3760, 16: 4980, 20: 6200, 24: 7420 },
      },
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    {
      label: 'TOEIC Course',
      lessons: '1:1六节 + 文法视频一节',
      four: 'USD 1,500 / 4周起',
      note: '公开价格与Man-to-Man Course同额，适合TOEIC集中准备。',
    },
    {
      label: 'TOEIC Mix Course',
      lessons: '1:1五节 + 文法视频一节 + 小组两节',
      four: 'USD 1,430 / 4周起',
      note: '公开价格与Power Speaking Course同额，适合口语和TOEIC兼顾。',
    },
    {
      label: 'Business Course',
      lessons: '商务英语中心',
      four: 'USD 1,500 / 4周起',
      note: '公开价格与Man-to-Man Course同额，适合中级以上商务场景。',
    },
    {
      label: 'Junior 4 / 5 / 6',
      lessons: '小中学生亲子方向',
      four: '对应Standard / Power / Man-to-Man价格',
      note: '小学生6岁以上亲子可咨询，高中生15岁以上可按条件单独留学。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '周日',
      title: '抵达宿务 / 入寮',
      text: '官方4周示例行程列周日抵达入寮；周六到达或前泊需提前确认。',
    },
    {
      time: '周一',
      title: 'Level Test / Orientation',
      text: '第一天通常安排分级测试、学校说明、换汇和生活用品采购。',
    },
    {
      time: '周二 - 周四',
      title: '正式课程',
      text: '平日课程一节通常50分钟，按所选课程安排一对一、文法视频和小组课。',
    },
    {
      time: '周五',
      title: '短缩课程 / 毕业式',
      text: '官方示例列周五为40分钟短缩课程，最后一周周五举行毕业式。',
    },
    {
      time: '周末',
      title: '休息 / 外出 / Brunch',
      text: '周末节假日提供Brunch，外食、活动和回程交通需按个人安排。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 120', note: '本页报价器已计入' },
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，通常所有学生需办理' },
    { item: 'SSP E-Card', amount: 'PHP 4,000', note: '官方费用表列SSP申请时需取得' },
    { item: '签证延长', amount: 'PHP 4,640起', note: '30天以上常见；9-12周参考PHP 11,060' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '官方表列9周以上学生需确认' },
    { item: '宿舍押金', amount: 'PHP 2,500', note: '退房时无损坏通常退还' },
    { item: '电费水费', amount: 'PHP 1,000 / 周起', note: '超出基本额度按表计分摊精算' },
    { item: '机场接机', amount: 'PHP 1,500', note: '21:00-09:00深夜早朝可能加PHP 1,000' },
    { item: '教材费', amount: 'PHP 1,000-2,500 / 4周', note: '按实际教材使用计算' },
    { item: '学生证', amount: 'PHP 270-300', note: '2026新费用说明提到ID费用调整为PHP 300' },
    { item: '管理费', amount: 'PHP 500 / 周', note: '2026新费用说明列学校设备维护管理费' },
    { item: '延泊费', amount: 'PHP 1,500-2,000 / 晚', note: '按房型和空房确认，需提前预约' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断STARGATE是否适合',
      text: '根据英语基础、是否第一次游学、预算、房型和是否需要日语支持做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程和房型',
      text: '核对Standard、Power、Man-to-Man、Enjoy、TOEIC或Business，以及性别空房。',
    },
    {
      icon: 'payments',
      title: '拆清主费和当地费',
      text: '把授课寮费、入学金、SSP、签证、押金、水电、教材、管理费和接机分开列清。',
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
    { icon: 'description', label: '2026费用逐项整理' },
    { icon: 'verified_user', label: '课程与房型提前确认' },
    { icon: 'payments', label: '主费与当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '一对一课程',
    '小组课',
    '日语文法视频',
    'TOEIC',
    'Business English',
    'Junior课程',
    '同楼宿舍',
    '平日三餐',
    '周末Brunch',
    '屋顶泳池',
    '健身房',
    'Wi-Fi',
    '日本职员',
    '医师往诊参考',
  ];
  readonly campusActivities = [
    '学生休息区',
    '屋顶泳池',
    '健身房',
    '自习',
    '周末外出',
    '校内交流',
  ];
  readonly weekendActivities = [
    'Ayala Center Cebu',
    'IT Park',
    'Kasambagan餐厅',
    '咖啡厅和面包店',
    '按摩和Spa',
    'Mactan周末活动',
  ];
  readonly notes = [
    '本页课程费用按STARGATE官方2026公开美元表整理，通常为授课费+宿舍费，并含平日三餐、周末节假日Brunch和清扫。',
    '12周以上公开表已显示长期优惠后的价格；最终仍需按学校当期报价单确认。',
    '大部屋主要面向团体或按需求开放，本页报价器暂不纳入大部屋，避免把非常规房型当作默认选择。',
    'SSP、SSP E-Card、签证、ACR、押金、水电、教材、管理费、接机和延泊通常另计。',
    '2026费用说明提到部分房型、管理费和ID费用调整，报名时需确认适用日期和是否仍有促销。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'STARGATE和CIA最大的区别是什么？',
      answer:
        'CIA是Mactan大型半斯巴达综合校区；STARGATE是Cebu City小规模日本资本学校，学校宿舍同楼，更偏初学者支持、日语说明和生活稳定。',
    },
    {
      question: '页面上的费用包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算授课寮费和入学金；SSP、签证、ACR、押金、水电、教材、管理费、接机、机票保险和个人生活费需另行准备。',
    },
    {
      question: 'STARGATE适合英语零基础吗？',
      answer:
        '适合列入候选。官方资料显示初级学生比例高，一对一为主，并有日语文法视频和日本职员支持。',
    },
    {
      question: 'STARGATE适合亲子或未成年吗？',
      answer:
        '可以比较。官方资料提到亲子小学生6岁以上可咨询，高中生15岁以上在有监护同意等条件下可单独留学；具体名额和规则需确认。',
    },
    {
      question: '住宿有什么要特别确认？',
      answer:
        '需确认Premium或Study Focus房型、性别空位、是否同住、热水、Wi-Fi、水电分摊、清扫、门禁和延泊规则。',
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
    { label: 'STARGATE官方网站', url: 'https://stargate-cebu.com/' },
    { label: 'STARGATE官方料金一覧', url: 'https://stargate-cebu.com/course/table/' },
    { label: 'STARGATE官方料金シミュレーション', url: 'https://stargate-cebu.com/course/simulation/' },
    { label: 'STARGATE官方设施与周边', url: 'https://stargate-cebu.com/facilities/' },
    { label: 'STARGATE 2026新料金说明', url: 'https://stargate-cebu.com/news/pricetable2026/' },
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
      return '入学日期需要和学校确认，适用价格、促销、房型空位和当地费用会影响最终报价。';
    }

    return this.selectedWeeks >= 12
      ? '当前选择为12周以上，官方公开价格表已显示长期优惠后的金额，但正式报价仍需学校确认。'
      : '当前选择为短中期课程，需确认2026新价、促销、房型空位、接机和当地费用。';
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}
