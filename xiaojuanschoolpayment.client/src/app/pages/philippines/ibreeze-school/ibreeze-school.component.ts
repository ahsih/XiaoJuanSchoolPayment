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
import { IbreezeStudentQuote } from './ibreeze-student-quote';
import { IBREEZE_COURSES, IBREEZE_ROOMS, IBREEZE_MINOR_POLICY, IBREEZE_OFF_CAMPUS_INFO } from './ibreeze-catalog';
import { applySchoolQuoteImageLayout, quoteMoney } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';

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
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent, SchoolQuotePlanComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ibreeze-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../philippines-local-fee-table.css',
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

  get selectedCourseId() { return this.quotePlan.courses[0].optionId; }
  get selectedRoomId() { return this.quotePlan.rooms[0].optionId; }
  get selectedWeeks() { return this.quotePlan.courseWeeks; }
  get selectedStartDate() { return this.quotePlan.startDate; }
  get selectedRegistrationDate() { return this.students[0].selectedRegistrationDate; }
  set selectedRegistrationDate(value: string) { this.students[0].selectedRegistrationDate = value; }
  get selectedAgeGroup() { return this.students[0].selectedAgeGroup; }
  set selectedAgeGroup(value: 'adult' | '16-17' | 'under-16') { this.students[0].selectedAgeGroup = value; }
  get minorWithoutParent() { return this.students[0].minorWithoutParent; }
  set minorWithoutParent(value: boolean) { this.students[0].minorWithoutParent = value; }
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
      value: '密集口语课程及IB1四人间1,490美元／4周，注册费150美元',
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
      text: '5–14岁学生可与家长参加亲子课程；未满18岁无父母陪同，监护费100美元／4周。',
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

  courseOptions: CourseOption[] = IBREEZE_COURSES.map(course => ({ ...course }));
  roomOptions: RoomOption[] = IBREEZE_ROOMS.map(room => ({ ...room }));
  readonly minorPolicy = IBREEZE_MINOR_POLICY;
  readonly minorPolicyNotes = IBREEZE_MINOR_POLICY.split('。').filter(Boolean);
  readonly offCampusInfo = IBREEZE_OFF_CAMPUS_INFO;
  readonly students: IbreezeStudentQuote[] = [new IbreezeStudentQuote(this)];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new IbreezeStudentQuote(this));
    }
  }
  setQuoteMode(value: 'single' | 'group') {
    this.quoteMode = value;
    if (value === 'group') this.studentCount = this.requestedStudentCount;
  }
  get activeStudents() {
    return this.quoteMode === 'single' ? this.students.slice(0, 1)
      : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2)));
  }
  get quotePlan() { return this.students[0].quotePlan; }
  get quoteHeading() {
    return this.quoteMode === 'single' ? `I.BREEZE${this.selectedWeeks}周报价` : `I.BREEZE ${this.activeStudents.length}人报价`;
  }
  readonly localFeeIntro = '以下费用以比索计价，由学校及相关部门收取，最终以到校实收为准。校外住宿已含水电；接机与可退押金另列。';
  get returningStudent() { return this.students[0].returningStudent; }
  set returningStudent(value: boolean) { this.students[0].returningStudent = value; }

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
    '16–17岁可选择其他课程，但按青少年英语学费收取；无父母陪同的监护费为100美元／4周，包含接机及每4周一次的跳岛费用。',
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
        '适合。5–14岁学生可与家长同行，家长选择成人常规课程。未满18岁按抵达日国际年龄判断，按亲子课程报名；16–17岁可选择其他课程但仍按青少年英语学费收取。无父母陪同时，监护费100美元／4周，包含接机及每4周一次的跳岛费用。',
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
    // Keep the confirmed schedules and room descriptions; the API remains the price source.
    this.courseOptions = IBREEZE_COURSES.map(course => ({
      ...course, tuition: lessons.find(lesson => lesson.week === 4 && this.slugifyPriceKey(lesson.name) === course.id)?.price ?? course.tuition,
    }));
    this.roomOptions = IBREEZE_ROOMS.map(room => ({
      ...room, fee: rooms.find(item => item.week === 4 && this.createRoomId(item.name) === room.id)?.price ?? room.fee,
    }));

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
    const seasonalFee = fees.find((fee) => fee.name === '暑期附加费');
    if (seasonalFee) this.seasonalFeePerWeek = seasonalFee.fee;
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = !this.quoteError;
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

  get tuitionForSelectedWeeks() { return this.students[0].tuitionForSelectedWeeks; }
  get roomFeeForSelectedWeeks() { return this.students[0].roomFeeForSelectedWeeks; }
  get isMinor() { return this.students[0].isMinor; }
  get juniorTuitionPerFourWeeks() { return this.students[0].juniorTuitionPerFourWeeks; }
  get courseAndRoomBase() { return this.students[0].courseAndRoomBase; }
  get sidaDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.sidaDiscountAmount, 0); }
  get afterSidaDiscount() { return this.students[0].afterSidaDiscount; }
  get registrationAmount() { return this.activeStudents.reduce((sum, student) => sum + student.registrationAmount, 0); }
  get septemberPromotionEligible() { return this.students[0].septemberPromotionEligible; }
  get septemberPromotionDiscount() { return this.students[0].septemberPromotionDiscount; }
  get septemberPromotionText() { return this.students[0].septemberPromotionText; }
  get christmasPromotionDiscount() { return this.students[0].christmasPromotionDiscount; }
  get christmasPromotionText() { return this.students[0].christmasPromotionText; }
  get peakSeasonWeeks() { return this.students[0].peakSeasonWeeks; }
  get seasonalSurcharge() { return this.students[0].seasonalSurcharge; }
  get guardianRequired() { return this.students[0].guardianRequired; }
  get minorManagementFee() { return this.activeStudents.reduce((sum, student) => sum + student.minorManagementFee, 0); }
  get guardianNote() { return this.students[0].guardianNote; }
  get courseEligibilityText() { return this.students[0].courseEligibilityText; }
  get quoteUsd() { return this.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0); }
  get exchangeRateText() { return this.students[0].exchangeRateText; }
  get campusWeeks() { return this.students[0].campusWeeks; }
  get visaExtensionCount() { return this.students[0].visaExtensionCount; }
  get visaExtensionTotal() { return this.students[0].visaExtensionTotal; }
  get localFeesTotal() { return this.activeStudents.reduce((sum, student) => sum + student.localFeesTotal, 0); }
  get depositAmount() { return this.students[0].depositAmount; }
  roomPromotionRate(id: string) { return this.students[0].roomPromotionRate(id); }
  get quoteError() {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex(student => !!student.quoteError);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? '学生' + (index + 1) + '：' : ''}${this.activeStudents[index].quoteError}`;
  }
  get quoteUsdText() { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText() { return `约 ${Math.round(this.quoteUsd * this.usdToCny).toLocaleString('zh-CN')} 元`; }
  get localFeesCnyText() { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }
  get schoolPaymentItems() {
    if (this.quoteMode === 'single') return this.students[0].schoolPaymentItems;
    const newStudents = this.activeStudents.filter(student => !student.returningStudent).length;
    return [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationAmount)} 美元`,
        note: `新生${newStudents}人 × ${this.registrationFee}美元；一次性费用，老学员返校免费` },
      ...this.activeStudents.flatMap((student, index) => student.schoolPaymentItems.slice(1).map(item => ({
        ...item, label: `学生${index + 1} · ${item.label}`,
      }))),
    ];
  }
  get localFees(): LocalFee[] {
    if (this.quoteMode === 'single') return this.students[0].localFees;
    const groups = new Map<string, { fee: LocalFee; students: number[]; order: number }>();
    this.activeStudents.forEach((student, index) => student.localFees.forEach((fee, order) => {
      const key = JSON.stringify([fee.item, fee.amount, fee.note]);
      const group = groups.get(key);
      if (group) { group.fee.quantity += fee.quantity; group.fee.total += fee.total; group.students.push(index + 1); }
      else groups.set(key, { fee: { ...fee }, students: [index + 1], order });
    }));
    return [...groups.values()].sort((a, b) => a.order - b.order).map(({fee, students}) => ({
      ...fee, item: students.length === this.activeStudents.length ? fee.item : `学生${students.join('、')} · ${fee.item}`,
    }));
  }
  get optionalFeeItems() {
    if (this.quoteMode === 'single') return this.students[0].optionalFeeItems;
    const pickupIncluded = this.activeStudents.every(student => student.guardianRequired);
    const deposits = [...new Set(this.activeStudents.map(student => student.depositAmount))].sort((a, b) => a - b);
    return [
      { label: '接机（价格参考）', amount: pickupIncluded ? '已含' : '周日30美元／周六50美元',
        cnyAmount: pickupIncluded ? '' : `约人民币 ${Math.round(30 * this.usdToCny)}／${Math.round(50 * this.usdToCny)} 元`,
        note: `多人接机按实际安排确认，不按人数累加。${this.activeStudents.some(s => s.guardianRequired) ? '已选未成年管理费的学生含接机，不重复收费。' : ''}` },
      { label: '房间押金（价格参考）', amount: `${deposits.map(amount => quoteMoney(amount)).join('／')} 比索`,
        cnyAmount: `约人民币 ${deposits.map(amount => Math.round(amount / this.phpPerCny).toLocaleString('zh-CN')).join('／')} 元`,
        note: '不足8周3,000比索，8周及以上5,000比索；共住房间按学校确认，不按人数累加。无损坏及无欠费时可退' },
    ];
  }

  private get imageSchoolPaymentItems(): QuoteImagePaymentItem[] {
    if (this.quoteMode === 'single') return this.schoolPaymentItems;
    const items: QuoteImagePaymentItem[] = [this.schoolPaymentItems[0]];
    const groups = new Map<string, { item: QuoteImagePaymentItem; total: number; students: number[]; notes: Map<string, number[]> }>();
    this.activeStudents.forEach((student, index) => {
      const discounts: Record<string, number> = {
        '思达折扣': student.sidaDiscountAmount,
        '9月住宿优惠': student.septemberPromotionDiscount,
        '圣诞特别优惠': student.christmasPromotionDiscount,
      };
      student.schoolPaymentItems.slice(1).forEach(item => {
        if (!(item.label in discounts)) {
          items.push({ ...item, label: `学生${index + 1} · ${item.label}` });
          return;
        }
        let group = groups.get(item.label);
        if (!group) {
          group = { item: { ...item }, total: 0, students: [], notes: new Map() };
          groups.set(item.label, group);
          items.push(group.item);
        }
        group.total += discounts[item.label];
        group.students.push(index + 1);
        group.notes.set(item.note, [...(group.notes.get(item.note) ?? []), index + 1]);
      });
    });
    groups.forEach(group => {
      group.item.amount = `− ${this.formatUsd(group.total)} 美元`;
      if (group.students.length === 1) {
        group.item.label = `学生${group.students[0]} · ${group.item.label}`;
      } else if (group.notes.size === 1) {
        const scope = group.students.length === this.activeStudents.length ? `${group.students.length}人适用` : `学生${group.students.join('、')}适用`;
        group.item.note = `${scope}；${group.item.note}`;
      } else {
        group.item.note = [...group.notes].map(([note, students]) => `学生${students.join('、')}：${note}`).join('\n');
      }
    });
    return items;
  }

  get quoteImageData() {
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'I.BREEZE', schoolName: '菲律宾宿务I.BREEZE语言学校', filePrefix: 'I-BREEZE',
      heroSrc: '/assets/ibreeze/campus-main.jpg', weeks: this.selectedWeeks, startDate: this.selectedStartDate,
      usdToCny: this.usdToCny, totalUsd: this.quoteUsd, fullFeeDetails: true, localFeeTableLayout: 'web',
      paymentItems: this.schoolPaymentItems,
      localFeeItems: this.localFees.map(fee => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal, localCurrencyName: '比索', localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: this.localFeeIntro, optionalFeeItems: this.optionalFeeItems,
      ruleNotes: this.activeStudents.flatMap((student, index) => student.isMinor
        ? [`${this.quoteMode === 'group' ? '学生' + (index + 1) + '：' : ''}${student.courseEligibilityText}`] : []),
    });
    const paymentItems: QuoteImagePaymentItem[] = [...this.imageSchoolPaymentItems];
    paymentItems.splice(1, 0, ...(['课', '宿'] as const).flatMap(icon => this.activeStudents.flatMap((student, index) => student.quotePlan.paymentItems().filter(item => item.icon === icon).map(item => ({
      ...item, label: `${this.quoteMode === 'group' ? '学生' + (index + 1) + ' · ' : ''}${item.label.replace(/^课程费/, '课程名称').replace(/^住宿费/, '住宿名称')}`,
    })))));
    const warnings = this.activeStudents.flatMap((student, index) => student.quotePlan.warning
      ? [`${this.quoteMode === 'group' ? '学生' + (index + 1) + '：' : ''}${student.quotePlan.warning}`] : []);
    const result = applySchoolQuoteImageLayout({ ...quote, paymentItems,
      importantNotes: [...warnings, ...(quote.importantNotes ?? [])] }, 'I.BREEZE', this.selectedWeeks, this.selectedStartDate, this.quoteUsd, this.usdToCny);
    return { ...result, headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${this.selectedStartDate.replace(/-/g, '')}.png`,
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateLive ? this.exchangeRateDate : undefined } };
  }

  formatUsd(value: number): string {
    return quoteMoney(value);
  }
  formatPhp(value: number): string { return `${quoteMoney(value)} 比索`; }
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
