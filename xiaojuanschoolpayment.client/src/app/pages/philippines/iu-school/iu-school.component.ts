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
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { IuIclQuote } from './iu-icl-quote';

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

interface CourseFee {
  id: string;
  name: string;
  tuition: number;
  schedule: string;
}

interface RoomFee {
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

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-iu-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './iu-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
  ],
})
export class IuSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolName = '菲律宾宿务IU English Academy';
  private readonly courseFeeOrder = [
    'Light ESL',
    'Power Speaking 4',
    'Power Speaking 6',
    'Power Speaking 8',
    'TOEIC',
    'IELTS',
    '8周 IELTS保证班',
    '12周 IELTS保证班',
    '商务英语4',
    '商务英语6',
    '儿童（7~12岁）',
    '青少年（13~15岁）',
    'Beginner 4',
    'Beginner 6',
    '健身英文',
  ];
  private readonly roomFeeOrder = [
    '校内单人房',
    '校内双人房',
    '校内三人房',
    '校内四人房',
    '校外单人房',
    '校外双人房',
  ];

  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  registrationFee = 100;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = Array.from({ length: 24 }, (_, index) => index + 1);
  readonly quoteCalculator = new IuIclQuote('IU', 'power-speaking-4', 'campus-triple', '2026-09-13');
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_city',
      label: '学校类型',
      value: 'Cebu City市区独立校区',
      note: '位于General Maxilom Ave，靠近Ayala、SM等城市生活配套',
    },
    {
      icon: 'apartment',
      label: '校区规模',
      value: '独立校园 / 140人容量',
      note: '官方资料列出48间宿舍、70间一对一教室、15间小组教室',
    },
    {
      icon: 'school',
      label: '课程方向',
      value: 'ESL / IELTS / TOEIC / Business / Family',
      note: '也有Fitness English、Kids、Teenagers和Parents课程',
    },
    {
      icon: 'sports_gymnastics',
      label: '特色设施',
      value: '健身 / 泳池 / 球场 / 儿童区',
      note: '地下健身空间、台球、乒乓、屋顶泳池和运动场地',
    },
    {
      icon: 'public',
      label: '学生支持',
      value: '20+语言国际支持',
      note: '官方说明可用学生偏好语言沟通咨询和入学支持',
    },
    {
      icon: 'workspace_premium',
      label: '认证资源',
      value: 'TESDA / IDP IELTS / TOEIC',
      note: '官网首页展示TESDA、IDP IELTS、Cambridge和TOEIC标识',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'IU English Academy校区外观',
      description:
        '黄色独立楼宇位于宿务市区，适合想要城市便利和独立校园环境的学生。',
      src: 'https://storage.googleapis.com/outto-strapi-cms-gcp/cms/85287_c84cef02eb/85287_c84cef02eb.jpg',
    },
    {
      category: '设施',
      title: '屋顶泳池',
      description:
        '官方资料列出Rooftop outdoor swimming pool，适合课后放松和城市景观体验。',
      src: 'https://storage.googleapis.com/outto-strapi-cms-gcp/cms/LINE_ALBUM_2026415_260415_5_4ae1b58f48/LINE_ALBUM_2026415_260415_5_4ae1b58f48.jpg',
    },
    {
      category: '住宿',
      title: '宿舍双人房参考',
      description:
        '宿舍公开配置包含空调、浴室、Wi-Fi、冰箱、桌子和感应门锁。',
      src: 'https://cebu21.jp/include/schoolno2/iu/Room/850157_0.jpg',
    },
    {
      category: '住宿',
      title: '校内宿舍参考',
      description:
        '官方资料列出单人、双人、三人和家庭房，适合不同预算和隐私需求。',
      src: 'https://iuenglishacademy.org/wp-content/uploads/2024/11/Dormitory_01.webp',
    },
    {
      category: '教室',
      title: '一对一教室',
      description:
        'IU公开资料列出70间一对一教室，适合Power Speaking和考试课程细分训练。',
      src: 'https://iuenglishacademy.org/wp-content/uploads/2024/11/Classroom_07.webp',
    },
    {
      category: '教室',
      title: '小组教室',
      description:
        '官方资料列出15间小组教室，课程可搭配演讲、新闻、词汇语法和测试解析。',
      src: 'https://iuenglishacademy.org/wp-content/uploads/2024/11/Classroom_22.webp',
    },
    {
      category: '餐厅',
      title: '学校餐厅',
      description:
        '官方资料说明餐厅每日提供三餐，并设有咖啡区和轻食饮品。',
      src: 'https://iuenglishacademy.org/wp-content/uploads/2024/11/Caferteria_02.jpg',
    },
    {
      category: '设施',
      title: '健身和运动空间',
      description:
        '健身、有氧、拳击、台球、乒乓、瑜伽和儿童游戏区是IU的重要差异点。',
      src: 'https://iuenglishacademy.org/wp-content/uploads/2024/11/Gym_08.webp',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务IU English Academy' },
    { label: '英文名称', value: 'IU English Academy' },
    { label: '地址', value: 'IU English Academy, General Maxilom Ave, Cebu' },
    { label: '校区规模', value: '4000m2；48间宿舍；可容纳约140名学生' },
    { label: '教学空间', value: '70间一对一教室，15间小组教室，另有自习室和阅览室' },
    {
      label: '课程定位',
      value: 'Light ESL、Power Speaking、IELTS、TOEIC、Business、Fitness、Kids/Teenagers/Parents',
    },
    {
      label: '住宿房型',
      value: '校内单人、双人、三人、四人房；另有校外单人和双人房',
    },
    {
      label: '费用参考',
      value: '校方2026价：Power Speaking 4学费850美元/4周，校内三人房700美元/4周',
    },
  ];

  readonly highlights: Highlight[] = [
    {
      image:
        'https://storage.googleapis.com/outto-strapi-cms-gcp/cms/85287_c84cef02eb/85287_c84cef02eb.jpg',
      title: '宿务市区独立校区',
      text: '学校靠近Cebu City核心生活圈，比纯郊区学校更方便安排商场、餐厅、医院和周末城市生活。',
    },
    {
      image:
        'https://iuenglishacademy.org/wp-content/uploads/2024/11/Classroom_07.webp',
      title: '一对一教室数量充足',
      text: '70间一对一教室和多种课程强度，适合想把开口练习、考试和商务目标拆细的学生。',
    },
    {
      image:
        'https://iuenglishacademy.org/wp-content/uploads/2024/11/Gym_08.webp',
      title: 'Fitness English差异明显',
      text: 'IU把英语与健身、拳击、有氧、瑜伽等运动设施结合，适合想兼顾学习和体能的人。',
    },
    {
      image:
        'https://iuenglishacademy.org/wp-content/uploads/2024/11/Caferteria_02.jpg',
      title: '三餐和住宿在校内完成',
      text: '公开资料说明餐厅提供三餐，宿舍位于2-5楼，适合希望学习、住宿和生活集中管理的学生。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想住在宿务市区，又要独立校园',
      text: 'IU在General Maxilom Ave，适合想要城市便利但又不想住纯外部公寓的人。',
    },
    {
      title: '想要口语、考试、商务或Fitness多路线比较',
      text: 'Power Speaking、IELTS、TOEIC、Business和Fitness课程覆盖比较完整。',
    },
    {
      title: '亲子、青少年或家长同行',
      text: '官方列出Kids、Teenagers和Parents课程，适合家庭按年龄段核对方案。',
    },
    {
      title: '重视运动和课后设施',
      text: '健身、有氧、拳击、瑜伽、台球、乒乓、屋顶泳池和球场是IU的重要亮点。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想找海边度假型学校',
      text: 'IU在Cebu City，不是Mactan海边路线；如果想要海边环境，可比较Genius、CIA或Cebu Blue Ocean。',
    },
    {
      title: '只想要老牌强斯巴达备考',
      text: 'IU有IELTS/TOEIC和保证班规则，但若目标是高压备考，可同时比较SMEAG、EV、CPILS。',
    },
    {
      title: '预算只看课程学费',
      text: '住宿、注册费、SSP、E-Card、押金、水电、维护费、洗衣和签证延长都要一起预算。',
    },
    {
      title: '低龄学生没有监护安排',
      text: 'Kids和Teenagers课程需要按年龄、监护、房型和外出规则提前确认。',
    },
  ];

  readonly courses: CourseItem[] = [
    {
      name: 'Light ESL',
      type: '轻量口语',
      lessons: '4节一对一',
      suitable: '适合想保留更多自习和生活体验，同时提升基础口语的学生。',
    },
    {
      name: 'Power Speaking 4 / 6 / 8',
      type: '口语强化',
      lessons: '4-8节1:1，搭配小组课或运动课',
      suitable: '适合短期想增加开口量、演讲表达、词汇语法和沟通反应速度的人。',
    },
    {
      name: 'IELTS / IELTS Guarantee',
      type: '雅思备考',
      lessons: '常规4节1:1 + 4节小组；保证班6节1:1 + 2节小组',
      suitable: '适合目标分数学生，保证班需确认入学分数、出勤和Mock test规则。',
    },
    {
      name: 'TOEIC',
      type: '多益备考',
      lessons: '4节1:1 + 4节小组 + 晚间运动课',
      suitable: '适合求职、毕业门槛、企业需求或需要阅读听力分数证明的人。',
    },
    {
      name: 'Business 4 / 6',
      type: '商务英语',
      lessons: '4或6节1:1 + 商务情景与表达小组课',
      suitable: '适合职场沟通、会议、演讲、谈判、提案和商务表达训练。',
    },
    {
      name: 'Fitness English',
      type: '英语 + 运动',
      lessons: '4节1:1 + 2节小组 + 1节健身 + 2节晚间运动课',
      suitable: '适合想把英语学习和健身管理结合的学生。',
    },
    {
      name: 'Kids / Teenagers / Parents',
      type: '亲子家庭',
      lessons: '儿童/青少年8节课；家长4节1:1',
      suitable: '适合7-15岁学生和家长同行，需按年龄和监护规则确认。',
    },
  ];

  courseFees: CourseFee[] = this.quoteCalculator.courses;

  roomFees: RoomFee[] = this.quoteCalculator.rooms;

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐', text: '校内餐厅提供三餐，具体时间以到校说明为准。' },
    { time: '08:00 - 12:00', title: '上午一对一 / 小组课', text: '按课程进入口语、阅读、写作、听力、词汇语法或考试专项。' },
    { time: '12:00 - 13:00', title: '午餐', text: '餐厅和咖啡区让学生在校内完成用餐和休息。' },
    { time: '13:00 - 17:00', title: '下午课程 / 自习', text: 'Power Speaking、IELTS、TOEIC和Business会按目标分配不同课型。' },
    { time: '17:30 - 18:30', title: '晚餐', text: '长期学习时，三餐稳定度会明显影响状态。' },
    { time: '19:00 - 21:00', title: '晚间运动 / Mock / 自习', text: '公开资料提到晚间运动课、IELTS/TOEIC Mock和自习安排。' },
  ];

  get localFees() { return this.quoteCalculator.localFees; }

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先判断IU是否适合', text: '根据目标、预算、房型、是否亲子、是否需要Fitness或考试课程做初筛。' },
    { icon: 'fact_check', title: '确认课程和房型', text: '核对Power Speaking、IELTS、TOEIC、Business、Fitness、Kids/Parents与校内/外部宿舍空房。' },
    { icon: 'payments', title: '拆清前期和到校费用', text: '把课程、住宿、注册费、SSP、押金、水电、洗衣、签证和接机分开列清。' },
    { icon: 'assignment_turned_in', title: '准备入学文件', text: '协助整理护照、入学文件、eTravel、保险、接机和到校现金清单。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '如需沟通课程、老师、宿舍、账单或校规问题，可继续联系顾问协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可按情况提供当地沟通支持。' },
  ];

  readonly sidaReasons: SidaReason[] = [
    { number: '01', title: '先看课程路线是否匹配', text: 'IU课程线多，先确定口语、考试、商务、Fitness或亲子，再决定是否合适。', image: 'assets/cia/sida-why-action-selection.jpg', alt: '思达启航顾问帮助学生选择适合的菲律宾宿务语言学校' },
    { number: '02', title: '课程和宿舍分开核价', text: '课程费、校内住宿、外部宿舍和当地费用口径不同，需逐项核对。', image: 'assets/cia/sida-why-action-fees.jpg', alt: '思达启航顾问为学生核算菲律宾语言学校费用' },
    { number: '03', title: '考试和亲子规则提前确认', text: 'IELTS保证班、Kids、Teenagers和Parents课程都有规则，报名之前要说清楚。', image: 'assets/cia/sida-why-action-contract.jpg', alt: '思达启航顾问核验菲律宾游学课程和合同文件' },
    { number: '04', title: '行前清单更完整', text: '接机、现金、保险、入境文件、住宿用品和到校费用会提前整理给学生。', image: 'assets/cia/sida-why-action-departure.jpg', alt: '菲律宾游学出发前文件和行李准备' },
    { number: '05', title: '学习中仍可继续沟通', text: '遇到课程、老师、住宿或账单疑问时，可让顾问帮忙梳理沟通重点。', image: 'assets/cia/sida-why-action-followup.jpg', alt: '思达启航顾问持续跟进学生学习情况' },
    { number: '06', title: '国内顾问 + 宿务驻点', text: '国内咨询和宿务当地支持配合，适合第一次去菲律宾游学的学生和家庭。', image: 'assets/cia/sida-why-action-team.jpg', alt: '思达启航宿务和深圳服务团队' },
  ];

  readonly sidaTrustBadges: SidaTrustBadge[] = [
    { icon: 'description', label: '正式报价逐项核验' },
    { icon: 'verified_user', label: '课程规则提前确认' },
    { icon: 'payments', label: '费用透明无隐藏项' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'IU English Academy官方首页', url: 'https://iuenglishacademy.org/' },
    { label: 'IU官方About / 校区信息', url: 'https://iuenglishacademy.org/about/' },
    { label: 'IU官方Campus设施页', url: 'https://iuenglishacademy.org/campus/' },
    { label: 'IU官方Accommodation住宿页', url: 'https://iuenglishacademy.org/campus/accommodation/' },
    { label: 'IU官方General / Power Speaking课程', url: 'https://iuenglishacademy.org/course/power-speaking/' },
    { label: 'IU官方Academic / IELTS / TOEIC课程', url: 'https://iuenglishacademy.org/course/academy-courses/' },
    { label: 'IU官方Kids / Teenagers / Parents课程', url: 'https://iuenglishacademy.org/course/kids-teenagers-parents-courses/' },
    { label: 'IU官方报名与当地费用页', url: 'https://iuenglishacademy.org/enroll/' },
    { label: 'IU 2026公开价格参考', url: 'https://asiabysaudi.com/en/packages/iu' },
    { label: 'CEBU English IU公开费用资料', url: 'https://cebu-english.com/school/iu/' },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学测试',
    '一对一课程',
    '小组课',
    '晚间运动课',
    '三餐',
    '宿舍',
    '自习室',
    '屋顶泳池',
    '健身房',
    '儿童游戏区',
    '球场',
  ];
  readonly campusActivities = [
    '新生说明会',
    'IELTS / TOEIC Mock',
    '演讲训练',
    '英语桌游',
    'Fitness / Zumba / Yoga',
    '自习与阅读',
  ];
  readonly weekendActivities = [
    'Ayala Center Cebu',
    'SM City Cebu',
    '咖啡厅和餐厅',
    '宿务城市短途',
    '跳岛游',
    '健身和泳池放松',
  ];
  readonly notes = [
    '本页费用使用学校2026价目表；1/2/3周按4周价格的40%/60%/80%计算，4周以上按比例计算。',
    '淡季校方组合价海报有效期为2026/08/23–2027/01/09，学生须在2027/01/16前结业；按周日入住、周六退房规则，最后可计优惠的退房日为2027/01/09。',
    '淡季组合价不可叠加思达启航或其它中介优惠；走读、1–3周、校外住宿及价表未列课程按常规价。',
    'IELTS保证班有入学门槛、出勤、作业和Mock test规则，低龄课程需确认年龄和监护要求。',
    '当地费用通常包含SSP、E-Card、押金、电费、维护费、洗衣、教材和签证延长，不应只看课程住宿价。',
    '如果想要海边度假型，可同时比较CIA或Genius；如果想市区、运动设施和多课程路线，IU值得看。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'IU和CIA最大的区别是什么？',
      answer:
        'CIA更偏Mactan半斯巴达综合新校区和考试资源；IU位于Cebu City，强调独立市区校区、运动设施、Fitness English、多语言支持和多课程路线。两者都可学习生活平衡，但位置和特色不同。',
    },
    {
      question: '页面上的报价包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算所选周数的课程费、住宿费和注册费；到校后还要准备SSP、SSP E-Card、ACR I-Card、教材、押金、电费、维护费、洗衣、接机和签证延长等费用。',
    },
    {
      question: 'IU适合雅思学生吗？',
      answer:
        '可以列入候选。官方列出IELTS和IELTS Guarantee课程、每周二/周四Mock test和保证班规则。若目标是高压备考，也建议同时比较SMEAG、EV、CPILS。',
    },
    {
      question: 'IU适合亲子或青少年吗？',
      answer:
        '适合比较。官网列出Kids、Teenagers和Parents课程，儿童课程适合7-12岁，青少年课程适合13-15岁。报名时需确认监护、房型、年龄和外出规则。',
    },
    {
      question: '为什么不同网站价格不同？',
      answer:
        '不同资料会因更新时间、适用日期、房型和包含项目不同而出现差异。本页把常规价、校方淡季组合价和当地费分开展示，思达不再叠加其它价格优惠。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '资料来源', target: 'sources', icon: 'link' },
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
      if (!Number.isFinite(snapshot.usdToCny) || snapshot.usdToCny <= 0 || !Number.isFinite(snapshot.phpPerCny) || snapshot.phpPerCny <= 0) return;
      this.usdToCny = snapshot.usdToCny;
      this.phpPerCny = snapshot.phpPerCny;
      this.exchangeRateDate = snapshot.date;
      this.exchangeRateLive = true;
    });
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolName }).pipe(
      switchMap((schools) => {
        const school =
          schools.find((item) => item.name === this.pricingSchoolName) ??
          schools.find((item) => item.name.includes('IU English Academy')) ??
          schools[0];

        if (!school?.id) {
          return EMPTY;
        }

        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees }) => {
      this.applyPricingData(lessons, rooms, fees);
    });
  }

  private applyPricingData(
    lessons: SchoolLessonDTO[],
    rooms: SchoolRoomDTO[],
    fees: SchoolFeeDTO[],
  ): void {
    this.quoteCalculator.updatePrices(
      new Map(lessons.filter(lesson => lesson.week === 4).map(lesson => [lesson.name, lesson.price])),
      new Map(rooms.filter(room => room.week === 4).map(room => [room.name, room.price])),
    );

    const databaseRegistrationFee = fees.find((fee) => fee.name === '注册费');
    if (databaseRegistrationFee) {
      this.registrationFee = databaseRegistrationFee.fee;
    }
  }

  private createCourseId(lesson: SchoolLessonDTO): string {
    const idsByName: Record<string, string> = {
      'Light ESL': 'light-esl',
      'Power Speaking 4': 'power-speaking-4',
      'Power Speaking 6': 'power-speaking-6',
      'Power Speaking 8': 'power-speaking-8',
      TOEIC: 'toeic',
      IELTS: 'ielts',
      '6周 IELTS保证班': 'ielts-guarantee-6',
      '8周 IELTS保证班': 'ielts-guarantee-8',
      '12周 IELTS保证班': 'ielts-guarantee-12',
      '商务英语4': 'business-4',
      '商务英语6': 'business-6',
      '儿童（7~12岁）': 'children',
      '青少年（13~15岁）': 'teenagers',
      '健身英文': 'fitness',
      '监护人': 'guardian',
    };

    return idsByName[lesson.name] ?? `database-${lesson.id}`;
  }

  private createRoomId(room: SchoolRoomDTO): string {
    const idsByName: Record<string, string> = {
      '校内单人房': 'single-campus',
      '校内双人房': 'twin-campus',
      '校内三人房': 'triple-campus',
      '校内四人房': 'quad-campus',
      '校外单人房': 'single-offcampus',
      '校外双人房': 'twin-offcampus',
    };

    return idsByName[room.name] ?? `database-${room.id}`;
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
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

  get selectedCourse(): CourseFee {
    return (
      this.courseFees.find((course) => course.id === this.selectedCourseId) ??
      this.courseFees[0]
    );
  }

  get selectedRoom(): RoomFee {
    return (
      this.roomFees.find((room) => room.id === this.selectedRoomId) ??
      this.roomFees[0]
    );
  }

  get tuitionForSelectedWeeks(): number {
    return this.quoteCalculator.regularCourseTotal;
  }

  get roomFeeForSelectedWeeks(): number {
    return this.quoteCalculator.regularRoomTotal;
  }

  get durationMultiplier(): number {
    return this.selectedWeeks === 1 ? 0.4 : this.selectedWeeks === 2 ? 0.6 : this.selectedWeeks === 3 ? 0.8 : this.selectedWeeks / 4;
  }

  get quoteUsd(): number {
    return this.quoteCalculator.total;
  }

  get quoteUsdText(): string {
    return `${this.formatUsd(this.quoteUsd)} 美元`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `人民币预计约 ${rounded.toLocaleString('zh-CN')} 元`;
  }

  get selectedCourseId(): string { return this.quoteCalculator.plan.courses[0].optionId; }
  set selectedCourseId(value: string) { this.quoteCalculator.plan.courses[0].optionId = value; }
  get selectedRoomId(): string { return this.quoteCalculator.plan.rooms[0].optionId; }
  set selectedRoomId(value: string) { this.quoteCalculator.plan.rooms[0].optionId = value; }
  get selectedWeeks(): number { return this.quoteCalculator.plan.courseWeeks; }
  set selectedWeeks(value: number) {
    this.quoteCalculator.plan.courses[0].weeks = value;
    this.quoteCalculator.plan.rooms[0].weeks = value;
  }
  get selectedStartDate(): string { return this.quoteCalculator.plan.startDate; }
  set selectedStartDate(value: string) {
    this.quoteCalculator.plan.courses[0].startDate = value;
    this.quoteCalculator.plan.rooms[0].startDate = value;
  }
  get quoteHeading(): string { return `IU${this.quoteCalculator.courseWeeks}周报价`; }
  get schoolPaymentItems() { return this.quoteCalculator.schoolPaymentItems; }
  get quoteError(): string { return this.quoteCalculator.error; }
  get quoteWarning(): string { return this.quoteCalculator.warning; }
  get localFeesTotal(): number { return this.quoteCalculator.localFeeTotal; }
  get localFeesCnyText(): string { return `人民币预计约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }
  get exchangeRateText(): string { return `${this.exchangeRateLive ? `参考汇率日期${this.exchangeRateDate}` : '备用汇率估算'}：1美元≈${this.formatUsd(this.usdToCny)}人民币，1人民币≈${this.formatUsd(this.phpPerCny)}比索`; }
  get quoteImageData() { return this.quoteCalculator.imageData(this.usdToCny, this.phpPerCny, this.exchangeRateLive ? this.exchangeRateDate : undefined, '/assets/iu/iu-icl-low-season-promo-2026.jpg'); }
  formatPhp(value: number): string { return `${this.formatUsd(value)} 比索`; }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }
}
