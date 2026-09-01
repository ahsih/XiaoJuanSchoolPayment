import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

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

interface CourseItem {
  name: string;
  type: string;
  lessons: string;
  suitable: string;
}

interface CourseOption {
  id: string;
  name: string;
  tuition: number;
  lessons: string;
  suitable: string;
}

interface RoomOption {
  id: string;
  name: string;
  fee: number;
  note: string;
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
  quantity: number;
  total: number;
  excluded?: boolean;
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

interface SidaReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}

interface SidaTrustBadge {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-ibreeze-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ibreeze-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './ibreeze-school.component.css',
  ],
})
export class IbreezeSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolSearchName = 'I.BREEZE';
  private readonly pricingSchoolNames = ['菲律宾宿务I.BREEZE语言学校', 'I.BREEZE International Language Center', 'IBREEZE'];
  private readonly courseFeeOrder = ['intensive-speaking', 'light-esl', 'general-business-and-bec', 'power-esl', 'intensive-beginner', 'ielts-starter', 'ielts-target', 'toeic-target', 'junior-english'];
  private readonly roomFeeOrder = ['quad-main', 'triple-main', 'twin-main', 'single-main', 'quad-ib2', 'twin-ib2', 'single-ib2', 'off-campus-superior-single', 'off-campus-standard-single', 'off-campus-standard-twin', 'off-campus-superior-twin', 'off-campus-family'];
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  registrationFee = 150;
  readonly sidaDiscountRate = 0.9;
  seasonalFeePerWeek = 40;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = [4, 8, 12, 16, 20, 24];

  selectedCourseId = 'intensive-speaking';
  selectedRoomId = 'quad-main';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  selectedRegistrationDate = '2026-09-01';
  selectedStudentAge = 18;
  minorWithoutParent = false;
  includeAirportPickup = false;
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'apartment',
      label: '学校类型',
      value: '宿务市区度假式综合校区',
      note: '位于Mabolo / Tres Borces一带，学习、住宿和生活配套集中',
    },
    {
      icon: 'record_voice_over',
      label: '课程特色',
      value: '口语强化 + Native Teacher',
      note: '官方重点包括Focus on Speaking、Native Teacher、Best Location和Management',
    },
    {
      icon: 'groups',
      label: '学生比例',
      value: '多国籍混合',
      note: '官方公开比例含日本、台湾、韩国、越南、中国和其他国籍',
    },
    {
      icon: 'school',
      label: '课程方向',
      value: 'ESL / IELTS / TOEIC / Business / Junior',
      note: '成人、考试、商务和亲子/青少年课程都可比较',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: 'IB1 / IB2宿舍 + 校外公寓',
      note: '校内单人至四人房，另有校外单人、双人和3-5人家庭房',
    },
    {
      icon: 'pool',
      label: '校区设施',
      value: '泳池 / 餐厅 / 自习 / 宿舍',
      note: '公开资料强调干净现代、位置便利、安全和舒适宿舍',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'I.BREEZE泳池与校区',
      description:
        '宿务市区少见的度假式校区，泳池、餐厅、教室和宿舍形成集中的学习生活空间。',
      src: 'assets/ibreeze/campus-main.jpg',
    },
    {
      category: '餐厅',
      title: 'I.BREEZE餐厅',
      description:
        '宽敞明亮的餐厅是I.BREEZE公开图片中最有辨识度的生活空间之一。',
      src: 'https://cebu-navi.com/photo/school/120/2019bc435df89fc9beb8ad8fe651b30f.jpg',
    },
    {
      category: '住宿',
      title: 'I.BREEZE三人房参考',
      description:
        '房间配置通常包含床位、书桌、衣柜、空调和基础储物空间，房型影响预算明显。',
      src: 'https://cebu-navi.com/photo/school/120/bd1d469c7d8ac0071df7bfb491420f43.jpg',
    },
    {
      category: '住宿',
      title: 'I.BREEZE Prime宿舍参考',
      description:
        'Prime / IB2房型更偏新式住宿，价格通常比IB1主校区略高。',
      src: 'https://cebu-navi.com/photo/school/139/545de27b3e5443a49fbc4c5256f4aa8f.jpg',
    },
    {
      category: '住宿',
      title: 'Prime四人房参考',
      description:
        '四人房适合控制预算，需按性别、校区和入学日确认空房。',
      src: 'https://cebu21.jp/include/schoolno2/ibreeze2/room/quad6.jpg',
    },
    {
      category: '设施',
      title: '夜间泳池与公共空间',
      description:
        '校内公共空间兼顾学习、社交和课后放松，适合想要学习生活平衡的学生。',
      src: 'https://www.hub1234.com/wp-content/uploads/2020/05/GOPR1063-scaled.jpg',
    },
    {
      category: '餐厅',
      title: '餐厅用餐氛围',
      description:
        '公开资料显示I.BREEZE餐厅可同时容纳大量学生，适合多国籍学生交流。',
      src: 'https://cebu21.jp/include/schoolno2/ibreeze/Meal/Meal%20%2836%29.jpg',
    },
    {
      category: '教室',
      title: '宿舍学习区参考',
      description:
        '房间内学习桌和校内自习安排，方便学生在课后复习和完成作业。',
      src: 'https://www.ceburyugaku-master.com/school/img/ibreeze_prime/dormitory_06.webp',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务I.BREEZE语言学校' },
    { label: '英文名称', value: 'I.BREEZE International Language Center' },
    {
      label: '地址',
      value: 'Tres Borces Street, Mabolo, Cebu City',
    },
    { label: '学校定位', value: '宿务市区度假式综合英语学校，强调口语、外教、多国籍和生活便利度' },
    { label: '学生比例', value: '官方公开比例：日本35%、台湾26%、韩国20%、越南9%、中国2%、其他8%' },
    {
      label: '课程方向',
      value: 'Power ESL、Intensive Beginner、Light ESL、Intensive Speaking、IELTS、TOEIC、Business、Junior ESL & YLE',
    },
    {
      label: '住宿房型',
      value: 'IB1 / IB2单人、双人、三人、四人房；另有校外公寓单人、双人及3-5人家庭房',
    },
    {
      label: '费用参考',
      value: '2026公开参考：Intensive Speaking四人房IB1 USD 1,490/4周，注册费USD 150',
    },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'assets/ibreeze/campus-main.jpg',
      title: '市区里有度假式校区',
      text: 'I.BREEZE在Mabolo，兼顾市区生活便利和泳池、餐厅、宿舍一体化的学习环境。',
    },
    {
      image:
        'https://cebu-navi.com/photo/school/120/2019bc435df89fc9beb8ad8fe651b30f.jpg',
      title: '课程选择覆盖完整',
      text: '从Light ESL到Power ESL、IELTS、TOEIC、Business和Junior，适合不同目标做横向比较。',
    },
    {
      image:
        'https://cebu-navi.com/photo/school/120/bd1d469c7d8ac0071df7bfb491420f43.jpg',
      title: '预算可按房型拉开',
      text: '四人房适合控制预算，单人房、IB2和校外公寓选择更丰富，报名前要确认性别和空房。',
    },
    {
      image:
        'https://cebu21.jp/include/schoolno2/ibreeze/Meal/Meal%20%2836%29.jpg',
      title: '多国籍餐厅和校园生活',
      text: '官方公开国籍比例较分散，适合希望在宿务接触不同学生群体的人。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想在宿务市区读口语强化',
      text: 'Power ESL和Intensive Speaking都强调开口和一对一课，适合短期提升口语。',
    },
    {
      title: '想要学校设施比普通宿舍更舒服',
      text: '泳池、餐厅、公共空间和校内宿舍让I.BREEZE更接近学习生活平衡型学校。',
    },
    {
      title: '希望保留考试、商务或Junior选择',
      text: 'IELTS、TOEIC、Business和Junior课程可作为不同年龄和目标的备选路线。',
    },
    {
      title: '想接触多国籍学生',
      text: '官方国籍比例显示日本、台湾、韩国、越南等学生都有一定占比。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想要最严格斯巴达环境',
      text: 'I.BREEZE更偏平衡型和半管理氛围，如果目标是高压备考，可同时比较SMEAG、EV、CPILS。',
    },
    {
      title: '临近入学才指定单人房或Prime房型',
      text: '官方空房表按性别、房型、校区和日期列出，热门房型需要提前确认。',
    },
    {
      title: '预算只看学费住宿套餐',
      text: 'SSP、SSP E-Card、ACR、签证延长、押金、水电、教材、洗衣和接机都要另算。',
    },
    {
      title: '亲子低龄学生没有监护人同行',
      text: '5-14岁学生需与家长参加亲子课程；未满18岁独自就读会产生USD100/4周监护费。',
    },
  ];

  readonly courses: CourseItem[] = [
    {
      name: 'Power ESL',
      type: '口语综合强化',
      lessons: '5节1:1 + 2节小组 + 1节Special + 1节Activity',
      suitable: '适合短期集中提升听说读写和开口表达的成人学生。',
    },
    {
      name: 'Intensive Beginner',
      type: '初学者强化',
      lessons: '5节1:1 + 3节小组 + 1节Activity',
      suitable: '适合基础较弱、需要课程监测和循序渐进学习的学生。',
    },
    {
      name: 'Light ESL',
      type: '轻量综合英语',
      lessons: '4节1:1 + 2节小组 + 1节Activity',
      suitable: '适合希望保留更多自习、休息和宿务生活体验的学生。',
    },
    {
      name: 'Intensive Speaking',
      type: '口语输出',
      lessons: '4节1:1 + 1节Activity',
      suitable: '适合压力较低地提高表达、发音、反应速度和口语自信。',
    },
    {
      name: 'IELTS Target / Starter',
      type: '雅思备考',
      lessons: '5节1:1 + 3节小组 + 1节Activity',
      suitable: '适合有目标分数或需要先进入雅思学习节奏的学生。',
    },
    {
      name: 'TOEIC Target',
      type: '多益备考',
      lessons: '5节1:1 + 2节小组 + 1节Activity',
      suitable: '适合求职、毕业门槛或职业英语成绩需求。',
    },
    {
      name: 'General Business & BEC',
      type: '商务英语',
      lessons: '4节1:1 + 2节小组 + 1节Activity',
      suitable: '适合商务邮件、演示、会议、职场沟通和BEC方向学习。',
    },
    {
      name: 'Junior ESL & YLE',
      type: '青少年英语',
      lessons: '4节1:1 + 2节小组 + 1节Activity',
      suitable: '适合5-14岁并与家长同行的亲子/青少年学生。',
    },
  ];

  courseOptions: CourseOption[] = [
    {
      id: 'intensive-speaking',
      name: 'Intensive Speaking',
      tuition: 770,
      lessons: '4节1:1 + 1节Activity',
      suitable: '费用较低，适合口语输出和轻量学习。',
    },
    {
      id: 'light-esl',
      name: 'Light ESL',
      tuition: 840,
      lessons: '4节1:1 + 2节小组 + 1节Activity',
      suitable: '适合综合提升，同时保留较多自习和生活时间。',
    },
    {
      id: 'general-business-and-bec',
      name: 'General Business & BEC',
      tuition: 890,
      lessons: '4节1:1 + 2节小组 + 1节Activity',
      suitable: '适合职场英语和商务沟通。',
    },
    {
      id: 'power-esl',
      name: 'Power ESL',
      tuition: 990,
      lessons: '5节1:1 + 2节小组 + Special + Activity',
      suitable: '课程量更满，适合短期集中强化。',
    },
    {
      id: 'intensive-beginner',
      name: 'Intensive Beginner',
      tuition: 990,
      lessons: '5节1:1 + 3节小组 + 1节Activity',
      suitable: '适合英语基础较弱、需要强化入门的学生。',
    },
    {
      id: 'ielts-starter',
      name: 'IELTS Starter',
      tuition: 990,
      lessons: '合作方2026表：4节1:1 + 3节小组 + 1节Activity + 每4周2次模考；学校官网当前页显示5节1:1，需书面确认',
      suitable: '雅思初学者路线，入学条件与模拟测试安排需确认。',
    },
    {
      id: 'ielts-target',
      name: 'IELTS Target',
      tuition: 1190,
      lessons: '5节1:1 + 3节小组 + 2节晚课',
      suitable: '适合有明确目标分数并能配合晚课和模考的学生。',
    },
    {
      id: 'toeic-target',
      name: 'TOEIC Target',
      tuition: 1020,
      lessons: '5节1:1 + 2节小组 + 1节Activity + 每周五模考',
      suitable: '适合求职、毕业门槛或职业英语成绩需求。',
    },
    {
      id: 'junior-english',
      name: 'Junior English',
      tuition: 1290,
      lessons: '4节1:1 + 2节词汇/写作小组 + 1节Activity',
      suitable: '适合5-14岁且与家长同行的青少年学生。',
    },
  ];

  roomOptions: RoomOption[] = [
    {
      id: 'quad-main',
      name: '四人房 IB1',
      fee: 720,
      note: '预算最低，适合控制费用。',
    },
    {
      id: 'triple-main',
      name: '三人房 IB1',
      fee: 790,
      note: '生活空间比四人房更好，IB2无三人房公开报价。',
    },
    {
      id: 'twin-main',
      name: '双人房 IB1',
      fee: 900,
      note: '预算和生活空间比较平衡。',
    },
    {
      id: 'single-main',
      name: '单人房 IB1',
      fee: 1270,
      note: '隐私最好，热门档期需尽早确认。',
    },
    {
      id: 'quad-ib2',
      name: '四人房 IB2',
      fee: 750,
      note: 'IB2四人房，适合兼顾住宿环境与预算。',
    },
    {
      id: 'twin-ib2',
      name: '双人房 IB2',
      fee: 950,
      note: 'IB2双人房，房型和性别需按入学日确认。',
    },
    {
      id: 'single-ib2',
      name: '单人房 IB2',
      fee: 1320,
      note: 'IB2单人房，热门档期需尽早确认。',
    },
    {
      id: 'off-campus-superior-single',
      name: '校外公寓超级单人间',
      fee: 1420,
      note: '一张大床，含卧室及客厅；含水电、Wi-Fi、厨房和平日接送。',
    },
    {
      id: 'off-campus-standard-single',
      name: '校外公寓标准单人间',
      fee: 1390,
      note: '配有2张单人床；含水电、Wi-Fi、厨房和平日接送。',
    },
    {
      id: 'off-campus-standard-twin',
      name: '校外公寓标准双人间',
      fee: 1050,
      note: '校外双人房；含水电、Wi-Fi、厨房和平日接送。',
    },
    {
      id: 'off-campus-superior-twin',
      name: '校外公寓超级双人间',
      fee: 1070,
      note: '校外升级双人房；含水电、Wi-Fi、厨房和平日接送。',
    },
    {
      id: 'off-campus-family',
      name: '校外公寓家庭房（3-5人）',
      fee: 890,
      note: '3-5人同行参考价；含水电、Wi-Fi、厨房和平日接送。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 07:50',
      title: '早餐 / Daily Test',
      text: '官方样例日程列出早间早餐和每日测试，具体按课程和级别调整。',
    },
    {
      time: '08:00 - 12:05',
      title: '上午1:1 / 自习',
      text: '根据课程安排进入一对一课、小组课或自习时段。',
    },
    {
      time: '12:05 - 13:05',
      title: '午餐',
      text: '校内餐厅用餐，适合多国籍学生交流。',
    },
    {
      time: '13:05 - 17:10',
      title: '下午小组课 / 1:1 / 自习',
      text: 'Power ESL、Business和考试课程会按目标拆分不同课型。',
    },
    {
      time: '17:30 - 18:20',
      title: '晚餐',
      text: '官方日程样例列出晚餐时段，实际安排以到校说明为准。',
    },
    {
      time: '18:30 - 19:15',
      title: 'Activity Class',
      text: '选修或活动课可包含语法、词汇、唱歌、舞蹈等方向。',
    },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断I.BREEZE是否适合',
      text: '根据目标、预算、房型、是否亲子、是否想要多国籍和泳池型校区做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程和房型',
      text: '核对Power ESL、Light ESL、Intensive Speaking、IELTS、TOEIC、Business或Junior与IB1/IB2空房。',
    },
    {
      icon: 'payments',
      title: '拆清前期和到校费用',
      text: '把课程住宿套餐、注册费、接机、SSP、押金、教材、水电和签证延长分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备入学文件',
      text: '协助整理护照、入学文件、eTravel、保险、接机和到校现金清单。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '如需沟通课程、老师、宿舍、账单或校规问题，可继续联系顾问协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可按情况提供当地沟通支持。',
    },
  ];

  readonly sidaReasons: SidaReason[] = [
    {
      number: '01',
      title: '先看课程强度是否匹配',
      text: 'I.BREEZE课程多，先确定口语、轻量ESL、商务、考试还是Junior，再报价。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择适合的菲律宾宿务语言学校',
    },
    {
      number: '02',
      title: 'IB1/IB2和房型逐项核价',
      text: '单人、双人、三人、四人和Prime房型口径不同，需按性别与日期确认空房。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问为学生核算菲律宾语言学校费用',
    },
    {
      number: '03',
      title: '当地费用提前说清楚',
      text: 'SSP、E-Card、押金、教材、水电、签证和洗衣都要和套餐价分开看。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航顾问核验菲律宾游学课程和合同文件',
    },
    {
      number: '04',
      title: '行前清单更完整',
      text: '接机、现金、保险、入境文件、住宿用品和到校费用会提前整理给学生。',
      image: 'assets/cia/sida-why-action-departure.jpg',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '学习中仍可继续沟通',
      text: '遇到课程、老师、住宿或账单疑问时，可让顾问帮忙梳理沟通重点。',
      image: 'assets/cia/sida-why-action-followup.jpg',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '国内顾问 + 宿务驻点',
      text: '国内咨询和宿务当地支持配合，适合第一次去菲律宾游学的学生和家庭。',
      image: 'assets/cia/sida-why-action-team.jpg',
      alt: '思达启航宿务和深圳服务团队',
    },
  ];

  readonly sidaTrustBadges: SidaTrustBadge[] = [
    { icon: 'description', label: '正式报价逐项核验' },
    { icon: 'verified_user', label: '房型与空房提前确认' },
    { icon: 'payments', label: '费用透明无隐藏项' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学测试',
    '一对一课程',
    '小组课',
    '选修课',
    '餐厅',
    '宿舍',
    '泳池',
    '自习空间',
    '洗衣',
    '水电管理',
    '学生管理',
  ];
  readonly campusActivities = [
    '新生说明会',
    'Daily Test',
    'Activity Class',
    '小组讨论',
    '泳池休息',
    '多国籍交流',
  ];
  readonly weekendActivities = [
    'Ayala / IT Park',
    'SM City Cebu',
    'Mabolo周边餐厅',
    '咖啡厅和按摩',
    '跳岛游',
    '宿务城市短途活动',
  ];
  readonly notes = [
    '本页费用使用I.BREEZE官方2026公开参考价，正式报价仍需按入学日期、性别、房型和校区确认。',
    'IB2房型包含单人、双人和四人房；校外公寓另有单人、双人和3-5人家庭房。',
    '学校接受5-14岁青少年与家长参加；家长需选择成人常规课程。未满18岁按抵达日国际年龄判断，原则上按亲子/Junior课程规则报名。',
    '16-17岁可选择其他课程，但课程费按Junior English标准计算；未成年学生无父母陪同独自就读时，监护费为USD100/4周。',
    '8月优惠海报的报名截止日印刷为异常日期，报价器按所附明细规则表采用2026/08/30；圣诞优惠按明细规则表采用2027/01/02截止。',
    '当地费用通常在第一天Orientation后一次性支付，官方也提示金额可能按情况调整。',
    '如果目标是极强斯巴达备考，可同时比较SMEAG、EV、CPILS；如果想平衡环境和口语，I.BREEZE值得看。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'I.BREEZE和CIA最大的区别是什么？',
      answer:
        'CIA更偏Mactan半斯巴达综合型新校区，考试资源和校区规模更突出；I.BREEZE在宿务市区Mabolo，强调口语、外教、多国籍和泳池型校区生活。两者都适合学习生活平衡型学生，但定位和城市生活感不同。',
    },
    {
      question: '页面上的报价包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算课程住宿套餐和注册费；到校后还要准备SSP、SSP E-Card、ACR、签证延长、押金、教材、水电、ID、洗衣和接机等费用。',
    },
    {
      question: 'I.BREEZE适合雅思学生吗？',
      answer:
        '可以列入候选。官方列出IELTS Starter和IELTS Target课程，但如果目标是更强备考压力、模考和保证班，也建议同时比较CIA、SMEAG、EV、CPILS。',
    },
    {
      question: 'I.BREEZE适合亲子或青少年吗？',
      answer:
        '适合。学校接受5-14岁学生与家长一起参加，家长从成人常规课程中选择。未满18岁按抵达日国际年龄判断；16-17岁可选其他课程但按Junior学费收取。未成年学生无父母陪同独自就读时，另收USD100/4周监护费。',
    },
    {
      question: '为什么IB1和IB2价格不同？',
      answer:
        '2026价目表分别列出IB1和IB2房价：IB1有单人、双人、三人和四人房，IB2有单人、双人和四人房。两者住宿楼和房型不同，最终要按空房和校区确认。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '报名流程', target: 'service-process', icon: 'task_alt' },
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

  ngOnInit(): void {
    this.loadPricingFromDatabase();
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((snapshot) => {
      this.usdToCny = snapshot.usdToCny;
      this.phpPerCny = snapshot.phpPerCny;
      this.exchangeRateDate = snapshot.date;
      this.exchangeRateLive = true;
    });
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toUpperCase().includes('I.BREEZE')) ??
          schools[0];
        if (!school?.id) return EMPTY;
        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees }) => this.applyPricingData(lessons, rooms, fees));
  }

  private applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    const databaseCourses = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => ({
        id: this.slugifyPriceKey(lesson.name),
        name: lesson.name,
        tuition: lesson.price,
        lessons: lesson.description || '课程安排以学校最终课表为准',
        suitable: lesson.note || '请联系顾问确认入学条件',
      }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourses.length > 0) {
      this.courseOptions = databaseCourses;
      if (!this.courseOptions.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseOptions[0].id;
    }

    const databaseRooms = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRooms.length > 0) {
      this.roomOptions = databaseRooms;
      if (!this.roomOptions.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomOptions.find((room) => room.id === 'quad-main')?.id ?? this.roomOptions[0].id;
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
    const seasonalFee = fees.find((fee) => fee.name === '暑期附加费');
    if (seasonalFee) this.seasonalFeePerWeek = seasonalFee.fee;
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

  get tuitionForSelectedWeeks(): number {
    return this.billedTuitionPerFourWeeks * (this.selectedWeeks / 4);
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee * (this.selectedWeeks / 4);
  }

  get isMinor(): boolean { return this.selectedStudentAge < 18; }
  get isOffCampusRoom(): boolean { return this.selectedRoomId.startsWith('off-campus-'); }
  get juniorTuitionPerFourWeeks(): number { return this.courseOptions.find((course) => course.id === 'junior-english')?.tuition ?? 1290; }
  get billedTuitionPerFourWeeks(): number { return this.isMinor ? this.juniorTuitionPerFourWeeks : this.selectedCourse.tuition; }
  get courseAndRoomBase(): number { return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get sidaDiscountAmount(): number { return this.roundMoney(this.courseAndRoomBase * (1 - this.sidaDiscountRate)); }
  get afterSidaDiscount(): number { return this.roundMoney(this.courseAndRoomBase * this.sidaDiscountRate); }

  get augustRoomDiscountRate(): number {
    if (['twin-main', 'twin-ib2'].includes(this.selectedRoomId)) return 120;
    if (['triple-main', 'quad-main', 'quad-ib2'].includes(this.selectedRoomId)) return 200;
    return 0;
  }
  get augustPromotionEligible(): boolean {
    return this.isDateBetween(this.selectedRegistrationDate, '2026-08-01', '2026-08-30') &&
      this.selectedStartDate <= '2026-12-27' && this.augustRoomDiscountRate > 0;
  }
  get augustPromotionDiscount(): number {
    return this.augustPromotionEligible ? Math.floor(this.selectedWeeks / 4) * this.augustRoomDiscountRate : 0;
  }
  get augustPromotionText(): string {
    if (!this.isDateBetween(this.selectedRegistrationDate, '2026-08-01', '2026-08-30')) return '报名日需在2026/08/01–08/30';
    if (this.selectedStartDate > '2026-12-27') return '最晚须在2026/12/27前抵达';
    if (this.augustRoomDiscountRate === 0) return '当前房型不参加住宿优惠';
    return `${this.selectedRoom.name}每4周减USD ${this.augustRoomDiscountRate}`;
  }

  get christmasPromotionDiscount(): number {
    return this.isDateBetween(this.selectedStartDate, '2026-12-27', '2027-01-02') ? 100 : 0;
  }
  get christmasPromotionText(): string {
    return this.christmasPromotionDiscount > 0 ? '2026/12/27–2027/01/02入学，减USD 100' : '仅2026/12/27–2027/01/02入学适用';
  }

  get peakSeasonWeeks(): number {
    const start = this.parseDate(this.selectedStartDate);
    const peakStart = this.parseDate('2026-06-28');
    const peakEnd = this.parseDate('2026-08-15');
    if (!start || !peakStart || !peakEnd) return 0;
    let count = 0;
    for (let index = 0; index < this.selectedWeeks; index += 1) {
      const weekStart = new Date(start.getTime());
      weekStart.setUTCDate(weekStart.getUTCDate() + index * 7);
      const weekEnd = new Date(weekStart.getTime());
      weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
      if (weekStart <= peakEnd && weekEnd >= peakStart) count += 1;
    }
    return count;
  }
  get seasonalSurcharge(): number { return this.peakSeasonWeeks * this.seasonalFeePerWeek; }
  get minorManagementFee(): number { return this.isMinor && this.minorWithoutParent ? Math.floor(this.selectedWeeks / 4) * 100 : 0; }
  get courseEligibilityText(): string {
    if (this.selectedStudentAge < 5) return '学校亲子/青少年课程最低接受5岁，需另选方案';
    if (this.isMinor && this.selectedStudentAge < 16 && this.selectedCourseId !== 'junior-english') return '未满16岁须选择Junior English；当前仍按Junior学费预估';
    if (this.isMinor && this.selectedStudentAge >= 16 && this.selectedCourseId !== 'junior-english') return '16–17岁可选其他课程，但按Junior English学费收取';
    if (this.selectedCourseId === 'ielts-target' && this.selectedWeeks < 12) return 'IELTS Target最低12周，请调整学习周数';
    if (this.selectedCourseId === 'ielts-starter' && ![4, 8].includes(this.selectedWeeks)) return 'IELTS Starter公开价仅列3–8周，长周期需学校确认';
    return this.isMinor ? '未成年学生已按Junior English学费计算' : '当前周数符合页面已知起报规则';
  }
  get billingRuleText(): string { return '注册费 +（课程费 + 住宿费）× 思达9折 + 暑期附加费 + 未成年监护费 − 住宿优惠 − 圣诞优惠'; }

  get quoteUsd(): number {
    return Math.max(0, this.roundMoney(this.registrationFee + this.afterSidaDiscount + this.seasonalSurcharge + this.minorManagementFee - this.augustPromotionDiscount - this.christmasPromotionDiscount));
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)}`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元`;
  }

  get discountText(): string {
    return '课程费和住宿费享思达9折；注册费及附加费用不打折';
  }

  get exchangeRateText(): string { return this.exchangeRateLive && this.exchangeRateDate ? `汇率日期 ${this.exchangeRateDate}` : '暂按备用汇率估算'; }
  get fourWeekPeriods(): number { return Math.max(1, Math.ceil(this.selectedWeeks / 4)); }
  get visaExtensionCount(): number { return Math.max(0, Math.min(5, Math.ceil(this.selectedWeeks / 4) - 1)); }
  get visaExtensionTotal(): number {
    const fees = [5140, 6410, 4440, 5040, 4440];
    return fees.slice(0, this.visaExtensionCount).reduce((sum, fee) => sum + fee, 0);
  }
  get localFees(): LocalFee[] {
    const periods = this.fourWeekPeriods;
    const acrQuantity = this.selectedWeeks > 4 ? 1 : 0;
    const campusUtilityFees: LocalFee[] = this.isOffCampusRoom
      ? [{ item: '校外公寓水电费', amount: 'PHP 1,000 / 周 / 人', quantity: this.selectedWeeks, total: 1000 * this.selectedWeeks, note: '2026学杂费备注口径；与住宿表“含水电”表述存在差异，正式账单需学校确认' }]
      : [
          { item: '校内电费', amount: 'PHP 2,000 / 4周', quantity: periods, total: 2000 * periods, note: '每周含20kW基础用电，超出部分PHP23/kW' },
          { item: '水费', amount: 'PHP 1,000 / 4周', quantity: periods, total: 1000 * periods, note: '按PHP250/周计算' },
        ];
    return [
      { item: 'SSP特殊学习许可证', amount: 'PHP 7,800 / 次', quantity: 1, total: 7800, note: '移民局收取；按报名学习时长办理，续费及换校需重新办理' },
      { item: 'SSP E-CARD', amount: 'PHP 4,500 / 次', quantity: 1, total: 4500, note: '入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I CARD 外国人身份证', amount: 'PHP 4,000 / 次', quantity: acrQuantity, total: 4000 * acrQuantity, note: '首次续签时办理' },
      { item: '维护管理费', amount: 'PHP 4,000 / 4周', quantity: periods, total: 4000 * periods, note: '校内教学楼及其他设施维护费' },
      ...campusUtilityFees,
      { item: '签证续签', amount: '按学习周数阶梯计算', quantity: this.visaExtensionCount, total: this.visaExtensionTotal, note: '第1–5次分别参考PHP5,140 / 6,410 / 4,440 / 5,040 / 4,440' },
      { item: '教材费', amount: 'PHP 2,000 / 4周', quantity: periods, total: 2000 * periods, note: '预估；实际按课程和购买教材结算' },
      { item: '学生证', amount: 'PHP 400 / 次', quantity: 1, total: 400, note: '学校公开费用表列2张ID Card' },
      { item: '宿舍押金', amount: this.selectedWeeks >= 8 ? 'PHP 5,000 / 次' : 'PHP 3,000 / 次', quantity: 1, total: this.selectedWeeks >= 8 ? 5000 : 3000, note: '可退；无损坏及无额外扣费时毕业退还', excluded: true },
      { item: '宿务麦克坦机场接机', amount: 'USD 30周日 / USD 50周六', quantity: this.includeAirportPickup ? 1 : 0, total: 0, note: '可选，美元计价，不计入比索学杂费合计', excluded: true },
      { item: '洗衣服务', amount: 'PHP 130 / 5kg', quantity: 0, total: 0, note: '按实际使用计费，默认不计入合计', excluded: true },
    ];
  }
  get localFeesTotal(): number { return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0); }
  get localFeesCnyText(): string { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }

  get quoteImageData() {
    const includedFees = this.localFees.filter((fee) => !fee.excluded);
    const optionalFees = this.localFees.filter((fee) => fee.excluded);
    return buildPhilippinesDetailedQuote({
      schoolCode: 'I.BREEZE',
      schoolName: '菲律宾宿务I.BREEZE语言学校',
      filePrefix: 'I-BREEZE',
      heroSrc: '/assets/ibreeze/campus-main.jpg',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems: [
        { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationFee)} 美元`, note: '一次性学校注册费，不参与折扣' },
        { icon: '课', label: '课程费', amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`, note: `${this.selectedCourse.name}；${this.courseEligibilityText}` },
        { icon: '宿', label: '住宿费', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`, note: `${this.selectedRoom.name}；4周单价×${this.selectedWeeks / 4}` },
        { icon: '折', label: '思达折扣', amount: `- ${this.formatUsd(this.sidaDiscountAmount)} 美元`, note: '仅课程费和住宿费9折；注册费、附加费不减', accent: true },
        { icon: '惠', label: '学校活动优惠', amount: `- ${this.formatUsd(this.augustPromotionDiscount + this.christmasPromotionDiscount)} 美元`, note: `8月住宿优惠USD ${this.formatUsd(this.augustPromotionDiscount)}；圣诞优惠USD ${this.formatUsd(this.christmasPromotionDiscount)}` },
        { icon: '附', label: '适用附加费', amount: `${this.formatUsd(this.seasonalSurcharge + this.minorManagementFee)} 美元`, note: `暑期USD ${this.formatUsd(this.seasonalSurcharge)}；未成年监护USD ${this.formatUsd(this.minorManagementFee)}` },
      ],
      localFeeItems: includedFees.map((fee) => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal,
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: '可退宿舍押金、美元接机费和按次洗衣单独列示，不计入比索学杂费合计。',
      optionalFeeItems: optionalFees.map((fee) => ({ label: fee.item, amount: fee.item.includes('机场') ? fee.amount : this.formatPhp(fee.total), note: fee.note })),
      ruleNotes: [
        this.billingRuleText,
        '未满18岁按抵达日国际年龄判断；16–17岁可选其他课程，但课程费按Junior English计算。',
        '8月住宿优惠按报名日、抵达日、房型和每满4周自动计算；圣诞优惠按入学日自动计算。',
      ],
    });
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }
  formatPhp(value: number): string { return `PHP ${value.toLocaleString('en-US')}`; }
  private roundMoney(value: number): number { return Math.round(value * 10) / 10; }
  private isDateBetween(value: string, start: string, end: string): boolean { return value >= start && value <= end; }
  private parseDate(value: string): Date | null {
    const parsed = new Date(`${value}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private createRoomId(name: string): string {
    if (name.includes('IB1四人')) return 'quad-main';
    if (name.includes('IB1三人')) return 'triple-main';
    if (name.includes('IB1双人')) return 'twin-main';
    if (name.includes('IB1单人')) return 'single-main';
    if (name.includes('IB2四人')) return 'quad-ib2';
    if (name.includes('IB2双人')) return 'twin-ib2';
    if (name.includes('IB2单人')) return 'single-ib2';
    if (name.includes('超级单人')) return 'off-campus-superior-single';
    if (name.includes('标准单人')) return 'off-campus-standard-single';
    if (name.includes('标准双人')) return 'off-campus-standard-twin';
    if (name.includes('超级双人')) return 'off-campus-superior-twin';
    if (name.includes('家庭')) return 'off-campus-family';
    return this.slugifyPriceKey(name);
  }
}
