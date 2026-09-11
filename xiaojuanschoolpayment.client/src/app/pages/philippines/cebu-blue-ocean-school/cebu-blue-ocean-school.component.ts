import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import {
  groupLocalFees,
  groupPaymentLines,
} from '../../../components/school-group-quote';
import { applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import {
  QuoteImageDownloadButtonComponent,
  QuoteImagePaymentItem,
} from '../../../components/quote-image-download-button.component';
import {
  BlueOceanCoursePrice,
  BlueOceanLocalFeePrices,
  BlueOceanQuotePrices,
  BlueOceanRoomPrice,
  BlueOceanStudentQuote,
  blueOceanPriceMultiplier,
} from './blue-ocean-student-quote';

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

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
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
  selector: 'app-cebu-blue-ocean-school',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    SchoolQuotePlanComponent,
    QuoteImageDownloadButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cebu-blue-ocean-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../philippines-local-fee-table.css',
    '../../../components/school-group-quote.css',
    './cebu-blue-ocean-school.component.css',
  ],
})
export class CebuBlueOceanSchoolComponent
  implements OnInit, BlueOceanQuotePrices
{
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolSearchName = 'Cebu Blue Ocean Academy';

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
  sidaDiscountRate = 0.95;
  offSeasonDiscountPerFourWeeks = 150;
  twelveWeekMinimumWeeks = 12;
  twelveWeekDiscount = 100;
  longStayMinimumWeeks = 16;
  longStayBaseDiscount = 100;
  longStayIncrementWeeks = 2;
  longStayIncrementDiscount = 25;
  seasonalFeePerWeek = 40;
  peakSeasonRanges = [
    { label: '2026旺季', start: '2026-06-28', end: '2026-08-22' },
    { label: '2027旺季', start: '2027-06-27', end: '2027-08-21' },
  ];
  shortStayRatios: Record<string, number> = {
    '1': 0.4,
    '2': 0.65,
    '3': 0.85,
  };
  localFeePrices: BlueOceanLocalFeePrices = {
    ssp: 7800,
    sspECard: 4500,
    acrICard: 4000,
    visaFirstCumulative: 5140,
    visaSecondCumulative: 11550,
    visaThirdCumulative: 15990,
    visaAdditional: 5140,
    accommodationDepositPerWeek: 1000,
    offCampusUtilitiesPerWeek: 1000,
    electiveMinimum: 300,
    electiveMaximum: 800,
    textbookMinimum: 1100,
    textbookMaximum: 1500,
    ieltsTextbook: 2500,
    laundryPerLoad: 200,
    pickup: 1200,
    studentId: 300,
    managementPerWeek: 500,
  };
  usdToCny = 7.2;
  phpPerCny = 9;
  exchangeRateDate = '';
  usingLiveExchangeRates = false;
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'beach_access',
      label: '学校类型',
      value: 'Mactan海边度假型校区',
      note: '位于EGI Hotel & Resort，适合想兼顾学习和海边环境的学生',
    },
    {
      icon: 'history_edu',
      label: '学校背景',
      value: 'PINES姊妹校，2015年开校',
      note: '公开资料强调沿用PINES教学体系、教材和师资管理经验',
    },
    {
      icon: 'record_voice_over',
      label: '课程特色',
      value: '1:1口语 + 小组课 + Option',
      note: 'Light ESL、Intensive ESL、Power ESL、IELTS、TOEIC、Business和Family均可比较',
    },
    {
      icon: 'hotel',
      label: '住宿房型',
      value: 'EGI双人/三人 + Ocean Suites单人',
      note: '2人房可分海景/市景，Ocean Suites单人房适合18岁以上或60岁以上学生',
    },
    {
      icon: 'restaurant',
      label: '餐食安排',
      value: '公开资料列三餐包含',
      note: '平日、周末和节假日均按学校规则提供餐食，最终以当期说明为准',
    },
    {
      icon: 'pool',
      label: '校区设施',
      value: '泳池 / 健身房 / 自习室 / 商务休息室',
      note: '海边度假环境、学校设施和住宿集中，是它和市区学校的主要差异',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'CBOA EGI海边度假校区',
      description:
        'Cebu Blue Ocean Academy位于Mactan岛EGI Hotel & Resort，校区环境是它最鲜明的卖点。',
      src: 'https://www.firstenglish.jp/wp-content/uploads/2019/03/0d7cfbb129cc04c095aefddee46d8a3d.jpg',
    },
    {
      category: '设施',
      title: 'CBOA学习休息区',
      description:
        '明亮的学习休息区适合课后自习、线上沟通和同学交流。',
      src: 'https://storage.googleapis.com/studio-cms-assets/projects/JgqeXQQ9Ok/s-1200x800_v-fms_webp_b05503a5-81cb-4119-afec-e61f287a5ffe_middle.webp',
    },
    {
      category: '教室',
      title: 'CBOA小组课堂',
      description:
        '公开课程结构以一对一课为核心，并搭配小组课和选修/大团体课。',
      src: 'https://oecglobal.com/images/stories/PDF/CEBU_Blue_Ocean_Academy_2.jpg',
    },
    {
      category: '住宿',
      title: 'EGI Hotel三人房参考',
      description:
        'EGI校内住宿公开房型包含海景双人房、市景双人房和海景三人房。',
      src: 'https://ryugaku-hikaku-style.com/wp-content/uploads/pic_3-beds-EGI.jpg',
    },
    {
      category: '餐厅',
      title: 'CBOA餐厅参考',
      description:
        '公开费用说明列课程住宿包含餐食，餐厅也是学生日常交流空间。',
      src: 'https://eas-ryugaku.com/wp/wp-content/uploads/2023/09/cafeteria-2.jpg',
    },
    {
      category: '设施',
      title: 'EGI泳池与海景',
      description:
        '泳池、海边和度假设施让CBOA更适合想要Mactan生活体验的学生。',
      src: 'https://philenglish.net/upload/userfiles/images/Review-du-hoc/review-truong-cebu-blue-ocean-thien-duong-hoc-tap-tai-cebu-10.jpg',
    },
    {
      category: '校园',
      title: 'CBOA前台与办公室',
      description:
        '学校公开资料列有多国籍经理、Pines Portal和学生支持服务。',
      src: 'https://michi-sensei.com/home/wp-content/uploads/2024/03/429667981_18388092922073318_6138110158565193426_n-1024x768.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务Cebu Blue Ocean Academy' },
    { label: '英文简称', value: 'CBOA / Cebu Blue Ocean Academy' },
    {
      label: '地址',
      value: 'EGI Hotel Bldg 5, Looc Maribago, Lapu-Lapu City, Cebu 6015, Philippines',
    },
    { label: '学校定位', value: 'Mactan岛海边度假型英语学校，PINES姊妹校，强调教学稳定和度假设施' },
    { label: '课程方向', value: 'Light ESL、Intensive ESL、Survival ESL、Power ESL 5/7、Business、TOEIC、IELTS、Junior、Parents 3H、Senior Course' },
    { label: '住宿房型', value: 'Ocean Suites单人房；EGI Hotel海景/市景双人房、海景三人房' },
    { label: '4周基础价', value: 'USD 1,820：Light ESL 870 + 校内三人海景房850 + 注册费100；报价时再计算免注册费、95折及适用学校优惠' },
    { label: '当地费用', value: 'SSP、SSP I-Card、ACR、签证延长、押金、教材、水电、管理费、洗衣和接机另算' },
  ];

  readonly highlights: Highlight[] = [
    {
      image:
        'https://www.firstenglish.jp/wp-content/uploads/2019/03/0d7cfbb129cc04c095aefddee46d8a3d.jpg',
      title: 'Mactan海边度假环境',
      text: '比市区学校更有度假感，适合想要泳池、海景和周末跳岛便利度的学生。',
    },
    {
      image:
        'https://storage.googleapis.com/studio-cms-assets/projects/JgqeXQQ9Ok/s-1200x800_v-fms_webp_b05503a5-81cb-4119-afec-e61f287a5ffe_middle.webp',
      title: 'PINES系统和学生Portal',
      text: '官方页面强调Pines Portal、English Only Policy和国际经理协助管理校园生活。',
    },
    {
      image:
        'https://oecglobal.com/images/stories/PDF/CEBU_Blue_Ocean_Academy_2.jpg',
      title: '一对一课比例高',
      text: 'Light ESL、Power ESL、IELTS、TOEIC和Business都以一对一课程为核心，适合口语和目标型学习。',
    },
    {
      image:
        'https://ryugaku-hikaku-style.com/wp-content/uploads/pic_3-beds-EGI.jpg',
      title: '房型直接影响预算',
      text: 'EGI三人房最省预算，双人海景更舒适，Ocean Suites单人房价格和规则要单独确认。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想住在Mactan海边环境',
      text: 'CBOA适合想把学习和海边度假氛围结合的人，不是纯市区通勤型学校。',
    },
    {
      title: '重视PINES体系和师资稳定度',
      text: '公开资料强调PINES姊妹校背景、教材体系和教师训练管理。',
    },
    {
      title: '想要高比例一对一课程',
      text: 'Light ESL、Power ESL 5/7、TOEIC、IELTS和Business都有清晰的一对一课结构。',
    },
    {
      title: '亲子或青少年想看海边校区',
      text: 'Family Course和Junior Course可列入候选，暑假旺季和年龄/住宿规则需提前确认。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想住在Cebu City市中心',
      text: 'CBOA在Lapu-Lapu / Mactan，去Ayala、IT Park等市区商圈需要交通时间。',
    },
    {
      title: '追求最强高压斯巴达备考',
      text: 'CBOA偏度假设施和学习平衡；若想封闭高压备考，可同时比较SMEAG、EV、CPILS或碧瑶学校。',
    },
    {
      title: '预算只看学费',
      text: 'CBOA公开价格把学费和住宿分开列，注册费和到校费用也要另外算清。',
    },
    {
      title: '旺季才临时指定海景房',
      text: 'Mactan热门季节和亲子档期容易紧张，海景/单人/家庭安排都需要提前确认空房。',
    },
  ];

  courseOptions: BlueOceanCoursePrice[] = [
    {
      id: 'light-esl',
      name: 'Light ESL',
      type: '轻量口语综合',
      lessons: '一对一4节',
      suitable: '适合希望平衡上课、休息、工作和Mactan生活体验的学生。',
      baseFourWeek: 870,
    },
    {
      id: 'survival-esl',
      name: 'Survival ESL',
      type: '初学者生活英语',
      lessons: '一对一4节 + 小组课2节',
      suitable: '适合零基础或初级学生；每段最多选择4周。',
      baseFourWeek: 1050,
      maxWeeks: 4,
    },
    {
      id: 'intensive-esl',
      name: 'Intensive ESL',
      type: '标准综合英语',
      lessons: '一对一5节 + 小组课2节',
      suitable: '适合想要一对一和小组课都具备的标准强度学生。',
      baseFourWeek: 970,
    },
    {
      id: 'power-esl-5',
      name: 'Power ESL 5',
      type: '一对一强化',
      lessons: '一对一5节',
      suitable: '适合想增加一对一开口、反馈和教材定制空间的学生。',
      baseFourWeek: 930,
    },
    {
      id: 'power-esl-7',
      name: 'Power ESL 7',
      type: '高密度一对一',
      lessons: '一对一7节',
      suitable: '适合短期集中练口语、听力、词汇、阅读和基础写作的学生。',
      baseFourWeek: 1170,
    },
    {
      id: 'business',
      name: 'Business English',
      type: '商务英语',
      lessons: '一对一5节 + 小组课2节',
      suitable: '适合准备英文面试、简历、会议、演示和国际职场沟通的人。',
      baseFourWeek: 1200,
    },
    {
      id: 'toeic',
      name: 'TOEIC',
      type: '多益备考',
      lessons: '一对一5节 + 小组课2节',
      suitable: '适合有求职、毕业门槛或职业英语成绩需求的学生。',
      baseFourWeek: 1050,
    },
    {
      id: 'ielts',
      name: 'IELTS',
      type: '雅思备考',
      lessons: '一对一5节 + 小组课2节',
      suitable: '适合有留学、移民或就业目标分数，需要系统备考的学生。',
      baseFourWeek: 1130,
    },
    {
      id: 'junior',
      name: '青少年课程（未满15岁）',
      type: '青少年英语',
      lessons: '一对一5节 + 小组课2节',
      suitable: '适合青少年/亲子方向，旺季Family Camp规则需单独确认。',
      baseFourWeek: 1500,
    },
    {
      id: 'parents',
      name: '监护人课程',
      type: '家长课程',
      lessons: '一对一3节（可转让一节课给小朋友）',
      suitable: '适合亲子同行家长保留较多陪伴和休息时间。',
      baseFourWeek: 750,
    },
    {
      id: 'senior',
      name: 'Senior Course',
      type: '40岁以上特色课程',
      lessons: '一对一4节 + 特色小组课',
      suitable: '适合40岁以上、希望兼顾一对一学习与特色小组互动的学生。',
      baseFourWeek: 1050,
    },
  ];

  dormOptions: BlueOceanRoomPrice[] = [
    {
      id: 'egi-triple-ocean',
      name: '校内三人间（海景）',
      baseFourWeek: 850,
      note: '4周住宿费最低，适合控制预算。',
      offCampus: false,
    },
    {
      id: 'egi-twin-city',
      name: '校内双人间（城景）',
      baseFourWeek: 900,
      note: '预算和空间平衡，市景房通常比海景房低。',
      offCampus: false,
    },
    {
      id: 'egi-twin-ocean',
      name: '校内双人间（海景）',
      baseFourWeek: 1120,
      note: '更有Mactan度假感，热门季节需提前确认。',
      offCampus: false,
    },
    {
      id: 'ocean-suite-superior',
      name: '校外高级房型',
      baseFourWeek: 1250,
      note: '外部单人住宿，公开资料提示18岁以上、60岁以上学生需选Ocean Suites。',
      offCampus: true,
    },
    {
      id: 'ocean-suite-deluxe',
      name: '校外豪华房型',
      baseFourWeek: 1400,
      note: '单人房舒适度更高，往返校区需按学校安排。',
      offCampus: true,
    },
    {
      id: 'ocean-suite-ocean',
      name: '校外单人间（海景）',
      baseFourWeek: 1600,
      note: '单人海景房预算最高，适合重视隐私和住宿品质的人。',
      offCampus: true,
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 07:50',
      title: '早餐 / 早间Option',
      text: '公开资料列有Morning Listening、Vocabulary等选修课，实际开课按学校安排。',
    },
    {
      time: '08:00 - 12:00',
      title: '上午一对一 / 小组课',
      text: 'Light、Power、IELTS、TOEIC等课程会按学习目标分配一对一和小组课。',
    },
    {
      time: '12:00 - 13:00',
      title: '午餐',
      text: '公开费用说明列三餐包含，餐食安排以当期校规为准。',
    },
    {
      time: '13:00 - 17:00',
      title: '下午课程 / 自习',
      text: 'Intensive、Business和考试课程下午会继续安排一对一、小组或选修课。',
    },
    {
      time: '17:30 - 18:30',
      title: '晚餐 / 课后休息',
      text: 'Mactan海边环境适合课后放松，也要遵守学校门禁与校规。',
    },
    {
      time: '19:00 - 19:50',
      title: '夜间Option / 自习',
      text: '公开资料列有发音、语法、就业准备、吉他、Zumba等选项，是否开课需到校确认。',
    },
  ];

  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  readonly students: BlueOceanStudentQuote[] = [
    new BlueOceanStudentQuote(this),
  ];

  readonly localFeeBottomNote =
    '学杂费是到菲律宾当地需要交纳的费用，是学校直接收取的，我们的报价只作为参考，因菲律宾政策变动当地费用可能会有浮动，具体以到校后收取的为准。';
  readonly schoolFeeImageNote =
    '1、学费部分由游学机构代收或直接到校支付给学校，我们的报价单上就是最终价格，支付时按照建设银行实时汇率，把美元换算为人民币结算。';
  readonly localFeeImageNote = `2、${this.localFeeBottomNote}`;

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断CBOA是否适合',
      text: '根据你想要海边环境、学习强度、是否亲子、预算和房型偏好做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程和住宿',
      text: '逐项核对Light ESL、Power ESL、IELTS、TOEIC、Business、Junior和EGI/Ocean Suites空房。',
    },
    {
      icon: 'payments',
      title: '拆清美元和披索费用',
      text: '把学费、住宿、注册费、接机、SSP、签证、押金、教材和水电分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备入学与行前资料',
      text: '协助整理护照、保险、eTravel、接机信息、现金清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '学习期间继续协助',
      text: '如有课程、老师、住宿、账单或校规沟通问题，可继续联系顾问协助。',
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
      title: '先判断海边校区是否合适',
      text: 'CBOA强项是Mactan海边环境；如果你更想住市区，顾问会同步比较CIA、I.BREEZE、IU等学校。',
      image: 'assets/cia/sida-why-action-selection.webp',
      alt: '思达启航顾问帮助学生选择菲律宾宿务语言学校',
    },
    {
      number: '02',
      title: '学费和住宿分开核算',
      text: 'CBOA公开价格不是单一套餐价，顾问会按课程、周数、EGI或Ocean Suites房型逐项算清。',
      image: 'assets/cia/sida-why-action-fees.webp',
      alt: '思达启航顾问核算菲律宾语言学校费用',
    },
    {
      number: '03',
      title: '旺季和亲子规则提前确认',
      text: '暑假、寒假、Family Camp和海景房需求容易变化，报名之前需要确认空房和当期规则。',
      image: 'assets/cia/sida-why-action-contract.webp',
      alt: '思达启航顾问核验菲律宾游学课程和合同文件',
    },
    {
      number: '04',
      title: '行前清单更完整',
      text: '接机时间、现金准备、保险、eTravel、宿舍用品和到校费用会提前整理给学生。',
      image: 'assets/cia/sida-why-action-departure.webp',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '到校后仍可沟通',
      text: '遇到课程、老师、住宿、账单或校规疑问时，可让顾问帮忙梳理沟通重点。',
      image: 'assets/cia/sida-why-action-followup.webp',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '国内顾问 + 宿务驻点',
      text: '国内咨询和宿务当地支持配合，适合第一次去菲律宾游学的学生和家庭。',
      image: 'assets/cia/sida-why-action-team.webp',
      alt: '思达启航宿务和深圳服务团队',
    },
  ];

  readonly sidaTrustBadges: SidaTrustBadge[] = [
    { icon: 'description', label: '正式报价逐项核验' },
    { icon: 'verified_user', label: '房型与旺季规则确认' },
    { icon: 'payments', label: '学费住宿当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学测试',
    '一对一课程',
    '小组课',
    'Option Class',
    'Pines Portal',
    '餐厅三餐',
    'EGI宿舍',
    'Ocean Suites',
    '泳池',
    '健身房',
    '自习室',
  ];
  readonly campusActivities = [
    'English Only Policy',
    'Morning Listening',
    'Vocabulary',
    'Basic Pronunciation',
    'Zumba',
    'Guitar Class',
  ];
  readonly weekendActivities = [
    'Mactan海边',
    '跳岛游',
    '潜水体验',
    'Maribago周边餐厅',
    'Cebu City商场',
    '按摩和咖啡厅',
  ];
  readonly notes = [
    '4周课程与住宿基准使用学校2025美元价目表；实际金额会按学校当期报价、汇率和政策调整。',
    'CBOA公开价格中，学费和住宿费分开列出；报价器先按95折计算课程与住宿，再扣学校固定优惠，并免除思达学生注册费。',
    '课程与住宿的1周、2周、3周费用分别按4周价格的40%、65%、85%计算。',
    '暑假旺季、Family Camp、海景房和Ocean Suites单人房需要提前确认空房和规则。',
    '到校后SSP、签证、押金、教材、水电、管理费和洗衣等费用需以学校Orientation说明为准。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'Cebu Blue Ocean Academy和CIA最大的区别是什么？',
      answer:
        'CIA是Mactan半斯巴达综合型新校区，校区设施和考试资源都强；CBOA更偏EGI海边度假环境和PINES教学体系，适合想要海边、泳池、三餐和一对一课平衡的人。',
    },
    {
      question: '页面上的CBOA报价包含全部费用吗？',
      answer:
        '学校费用和优惠会自动计算；到校学杂费按签证和停留跨度估算，押金、教材、水电、选修、洗衣和接机另列为4周参考项目。',
    },
    {
      question: 'CBOA适合亲子游学吗？',
      answer:
        '可以列入候选。CBOA有未满15岁的青少年课程和监护人课程，但暑假亲子旺季、Family Camp、年龄、房型和名额规则需要按当期安排确认。',
    },
    {
      question: 'CBOA适合雅思或多益备考吗？',
      answer:
        'CBOA官方课程包含IELTS和TOEIC，适合想在海边环境中进行目标型备考的学生。如果目标是高压保证班或更强封闭式备考，也建议同步比较SMEAG、EV、CPILS或碧瑶学校。',
    },
    {
      question: 'Ocean Suites和EGI住宿怎么选？',
      answer:
        'EGI更靠校区，双人/三人房预算较低；Ocean Suites是外部单人住宿，舒适度和隐私更高，公开资料提示18岁以上可选，60岁以上需选Ocean Suites，正式仍要按学校规则确认。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与学费', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '住宿费用', target: 'room-fees', icon: 'hotel' },
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
    { label: 'CBOA官网首页', url: 'https://www.cebublueocean.com/eng/index' },
    { label: 'CBOA官方Light ESL课程', url: 'https://www.cebublueocean.com/eng/program_light_esl' },
    { label: 'CBOA官方Intensive ESL课程', url: 'https://www.cebublueocean.com/eng/program_intensive_esl' },
    { label: 'CBOA官方IELTS课程', url: 'https://www.cebublueocean.com/eng/program_ielts' },
    { label: 'CBOA官方宿舍说明', url: 'https://www.cebublueocean.com/eng/campus_dorms' },
    { label: 'CBOA官方设施图库', url: 'https://www.cebublueocean.com/eng/campus_facilities?nav=all' },
    { label: '留学Thank You 2026费用表', url: 'https://world-study.com/school/804/charge/' },
    { label: 'Fujiyama CBOA费用与当地费用', url: 'https://www.fujiyama-international.com/philippines/cebu-blue-ocean-academy.html' },
  ];

  ngOnInit(): void {
    this.exchangeRateService.getLatestCnyRates().subscribe({
      next: (rates) => {
        this.usdToCny = rates.usdToCny;
        this.phpPerCny = rates.phpPerCny;
        this.exchangeRateDate = rates.date;
        this.usingLiveExchangeRates = true;
      },
    });

    this.schoolService
      .getSchools({ name: this.pricingSchoolSearchName })
      .pipe(
        switchMap((schools) => {
          const school = schools.find((item) =>
            /Cebu Blue Ocean|CBOA|宿务蓝海/iu.test(item.name),
          );
          if (!school) return of(null);
          return forkJoin({
            lessons: this.schoolService.getSchoolLessons({
              schoolId: school.id,
            }),
            rooms: this.schoolService.getSchoolRooms({ schoolId: school.id }),
            fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
          });
        }),
        catchError(() => of(null)),
      )
      .subscribe((data) => {
        if (data) this.applyPricingData(data.lessons, data.rooms, data.fees);
      });
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

  tuitionFor(courseId: string, weeks = this.selectedWeeks): number {
    const course = this.courseOptions.find((item) => item.id === courseId);
    if (!course || (course.maxWeeks !== undefined && weeks > course.maxWeeks)) {
      return 0;
    }
    return this.roundMoney(
      course.baseFourWeek *
        blueOceanPriceMultiplier(weeks, this.shortStayRatios),
    );
  }

  coursePriceText(course: BlueOceanCoursePrice, weeks: number): string {
    if (course.maxWeeks !== undefined && weeks > course.maxWeeks) {
      return `最多${course.maxWeeks}周`;
    }
    return `USD ${this.formatUsd(this.tuitionFor(course.id, weeks))}`;
  }

  dormFeeFor(roomId: string, weeks = this.selectedWeeks): number {
    const room = this.dormOptions.find((item) => item.id === roomId);
    return room
      ? this.roundMoney(
          room.baseFourWeek *
            blueOceanPriceMultiplier(weeks, this.shortStayRatios),
        )
      : 0;
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter(
          (image) => image.category === this.selectedGalleryCategory,
        );
  }

  get studentCount(): number {
    return this.requestedStudentCount;
  }

  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) {
        this.students.push(new BlueOceanStudentQuote(this));
      }
    }
  }

  setQuoteMode(value: 'single' | 'group'): void {
    this.quoteMode = value;
    if (value === 'group') this.studentCount = this.requestedStudentCount;
  }

  get activeStudents(): BlueOceanStudentQuote[] {
    return this.quoteMode === 'single'
      ? this.students.slice(0, 1)
      : this.students.slice(
          0,
          Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2)),
        );
  }

  get quotePlan() {
    return this.students[0].quotePlan;
  }

  get selectedCourseId(): string {
    return this.quotePlan.courses[0].optionId;
  }

  set selectedCourseId(value: string) {
    this.quotePlan.courses[0].optionId = value;
  }

  get selectedRoomId(): string {
    return this.quotePlan.rooms[0].optionId;
  }

  set selectedRoomId(value: string) {
    this.quotePlan.rooms[0].optionId = value;
  }

  get selectedWeeks(): number {
    return this.quotePlan.courseWeeks;
  }

  set selectedWeeks(value: number) {
    this.quotePlan.courses[0].weeks = value;
    this.quotePlan.rooms[0].weeks = value;
  }

  get selectedStartDate(): string {
    return this.quotePlan.startDate;
  }

  set selectedStartDate(value: string) {
    this.quotePlan.courses[0].startDate = value;
    this.quotePlan.rooms[0].startDate = value;
  }

  get selectedCourse(): BlueOceanCoursePrice {
    return (
      this.courseOptions.find((course) => course.id === this.selectedCourseId) ??
      this.courseOptions[0]
    );
  }

  get selectedRoom(): BlueOceanRoomPrice {
    return (
      this.dormOptions.find((room) => room.id === this.selectedRoomId) ??
      this.dormOptions[0]
    );
  }

  get selectedTuitionFee(): number {
    return this.students[0].tuition;
  }

  get selectedDormFee(): number {
    return this.students[0].accommodation;
  }

  get planPaymentItems(): QuoteImagePaymentItem[] {
    return this.activeStudents.flatMap((student, studentIndex) =>
      student.quotePlan.paymentItems().map((item) => ({
        ...item,
        label: `${
          this.quoteMode === 'group' ? `学生${studentIndex + 1} · ` : ''
        }${item.label.replace(/^课程费/u, '课程名称').replace(/^住宿费/u, '住宿名称')}`,
      })),
    );
  }

  get schoolPaymentItems(): QuoteImagePaymentItem[] {
    return [
      {
        icon: '注',
        label: '注册费',
        amount: `${this.formatUsd(
          this.activeStudents.length * this.registrationFee,
        )} 美元`,
        note: `100美元／人；下方按思达启航长期优惠全额减免。`,
      },
      ...this.planPaymentItems,
      ...groupPaymentLines(this.activeStudents, false),
    ];
  }

  get quoteError(): string {
    if (
      this.quoteMode === 'group' &&
      (!Number.isInteger(this.studentCount) ||
        this.studentCount < 2 ||
        this.studentCount > 20)
    ) {
      return '多人报价人数请选择2–20人的整数。';
    }
    const index = this.activeStudents.findIndex(
      (student) => !!student.quoteError,
    );
    return index < 0
      ? ''
      : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${
          this.activeStudents[index].quoteError
        }`;
  }

  get quoteHeading(): string {
    return this.quoteMode === 'single'
      ? `Cebu Blue Ocean ${this.students[0].quotePlan.courseWeeks}周报价`
      : `Cebu Blue Ocean ${this.activeStudents.length}人报价`;
  }

  get quoteStartDate(): string {
    return (
      this.activeStudents
        .map((student) => student.quotePlan.startDate)
        .filter(Boolean)
        .sort()[0] ?? this.selectedStartDate
    );
  }

  get quoteUsd(): number {
    return this.activeStudents.reduce(
      (sum, student) => sum + student.quoteUsd,
      0,
    );
  }

  get quoteUsdText(): string {
    return `${this.formatUsd(this.quoteUsd)} 美元`;
  }

  get quoteCnyText(): string {
    return `人民币预计金额：约 ${Math.round(
      this.quoteUsd * this.usdToCny,
    ).toLocaleString('zh-CN')} 元`;
  }

  get exchangeRateSummary(): string {
    return `参考汇率：1美元 ≈ ${this.usdToCny.toLocaleString('zh-CN', {
      maximumFractionDigits: 6,
    })}元人民币；1元人民币 ≈ ${this.phpPerCny.toLocaleString('zh-CN', {
      maximumFractionDigits: 6,
    })}比索（${
      this.usingLiveExchangeRates && this.exchangeRateDate
        ? this.exchangeRateDate.replace(/-/g, '/')
        : '备用参考值'
    }）`;
  }

  get estimatedLocalFees() {
    return groupLocalFees(this.activeStudents);
  }

  get estimatedLocalFeeTotal(): number {
    return this.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0);
  }

  get estimatedLocalFeeCny(): number {
    return this.phpPerCny > 0
      ? Math.round(this.estimatedLocalFeeTotal / this.phpPerCny)
      : 0;
  }

  get optionalFeeItems() {
    const fees = this.localFeePrices;
    const totalRoomWeeks = this.activeStudents.reduce(
      (sum, student) => sum + student.accommodationWeeks,
      0,
    );
    const totalOffCampusWeeks = this.activeStudents.reduce(
      (sum, student) => sum + student.offCampusAccommodationWeeks,
      0,
    );
    const hasCampusAccommodation = this.activeStudents.some(
      (student) => student.hasCampusAccommodation,
    );
    const pickupStudents = this.activeStudents.filter(
      (student) => student.pickupRequested,
    ).length;
    const hasIelts = this.activeStudents.some(
      (student) => student.usesIeltsCourse,
    );
    const depositTotal = fees.accommodationDepositPerWeek * totalRoomWeeks;
    const offCampusUtilitiesTotal =
      fees.offCampusUtilitiesPerWeek * totalOffCampusWeeks;
    const cny = (value: number) =>
      `约人民币 ${Math.round(value / this.phpPerCny).toLocaleString(
        'zh-CN',
      )} 元`;

    return [
      {
        label: '住宿费押金',
        amount: this.formatPhp(depositTotal),
        cnyAmount: cny(depositTotal),
        note: `${fees.accommodationDepositPerWeek.toLocaleString(
          'en-US',
        )}比索／住宿周 × ${totalRoomWeeks}周；水电费在押金中扣除；不计入学杂费合计。`,
      },
      {
        label: '水电费',
        amount:
          totalOffCampusWeeks > 0
            ? `${this.formatPhp(offCampusUtilitiesTotal)}参考`
            : '校内按实际使用结算',
        cnyAmount:
          totalOffCampusWeeks > 0 ? cny(offCampusUtilitiesTotal) : undefined,
        note: `${
          hasCampusAccommodation ? '校内住宿按实际使用情况结算；' : ''
        }校外住宿${fees.offCampusUtilitiesPerWeek.toLocaleString(
          'en-US',
        )}比索／周。`,
      },
      {
        label: '选修课',
        amount: `${fees.electiveMinimum.toLocaleString(
          'en-US',
        )}–${fees.electiveMaximum.toLocaleString('en-US')} 比索／2周`,
        note: '4周学杂费参考项目，按学生实际选择结算。',
      },
      {
        label: '书本费',
        amount: hasIelts
          ? `${fees.ieltsTextbook.toLocaleString('en-US')} 比索／4周`
          : `${fees.textbookMinimum.toLocaleString(
              'en-US',
            )}–${fees.textbookMaximum.toLocaleString('en-US')} 比索／4周`,
        note: hasIelts
          ? `本次含IELTS课程，按IELTS教材${fees.ieltsTextbook.toLocaleString(
              'en-US',
            )}比索／4周参考。`
          : '普通课程约1,100–1,500比索／4周。',
      },
      {
        label: '洗衣费',
        amount: `${fees.laundryPerLoad.toLocaleString(
          'en-US',
        )} 比索／7kg／次`,
        note: '4周学杂费参考项目，按实际洗衣次数结算。',
      },
      {
        label: '宿务马克坦机场接机',
        amount: pickupStudents
          ? this.formatPhp(fees.pickup * pickupStudents)
          : `${this.formatPhp(fees.pickup)}／人参考`,
        cnyAmount: pickupStudents
          ? cny(fees.pickup * pickupStudents)
          : cny(fees.pickup),
        note: `常规接机1,200比索／人（周六10:00至周日凌晨2:00）；本次${
          pickupStudents ? `${pickupStudents}人选择` : '未选择'
        }；不计入学杂费合计。`,
      },
    ];
  }

  get quoteImageData() {
    const paymentItems = [
      this.schoolPaymentItems[0],
      ...this.planPaymentItems,
      ...groupPaymentLines(this.activeStudents, true),
    ];
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'CBOA',
      schoolName: 'Cebu Blue Ocean Academy',
      filePrefix: 'Cebu-Blue-Ocean',
      heroSrc:
        'https://storage.googleapis.com/studio-cms-assets/projects/JgqeXQQ9Ok/s-1200x800_v-fms_webp_b05503a5-81cb-4119-afec-e61f287a5ffe_middle.webp',
      weeks: this.selectedWeeks,
      startDate: this.quoteStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
      paymentItems,
      localFeeItems: this.estimatedLocalFees.map((fee) => ({
        label: fee.item,
        unit: fee.unitLabel,
        quantity: this.formatFeeQuantity(fee.quantity),
        amount: this.formatPhp(fee.total),
        note: fee.note,
      })),
      localFeeTotal: this.estimatedLocalFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.estimatedLocalFeeCny,
      localFeeNote: '',
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: [],
    });
    const result = applySchoolQuoteImageLayout(
      {
        ...quote,
        noteTitle: '报价说明',
        importantNotes: [this.schoolFeeImageNote, this.localFeeImageNote],
      },
      'Cebu Blue Ocean',
      this.selectedWeeks,
      this.quoteStartDate,
      this.quoteUsd,
      this.usdToCny,
    );

    return {
      ...result,
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${this.quoteStartDate.replace(
        /-/g,
        '',
      )}.png`,
      localFeeTitle: '到校后学杂费明细参考（学校及政府相关部门收取）',
      importantNotes: [this.schoolFeeImageNote, this.localFeeImageNote],
      footerNotesVerbatim: true,
      appendFinalConfirmationNote: false,
      appendExchangeRateNote: true,
      conversionRates: {
        usdToCny: this.usdToCny,
        phpPerCny: this.phpPerCny,
        date: this.usingLiveExchangeRates
          ? this.exchangeRateDate
          : undefined,
      },
    };
  }

  formatPhp(value: number): string {
    return `${Math.round(value).toLocaleString('en-US')} 比索`;
  }

  formatFeeQuantity(value: number): string {
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 2,
    });
  }

  private applyPricingData(
    lessons: SchoolLessonDTO[],
    rooms: SchoolRoomDTO[],
    fees: SchoolFeeDTO[],
  ): void {
    const databaseCourses = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => ({ lesson, id: this.courseIdFromName(lesson.name) }))
      .filter(
        (entry): entry is { lesson: SchoolLessonDTO; id: string } => !!entry.id,
      );
    if (
      this.courseOptions.every((course) =>
        databaseCourses.some((entry) => entry.id === course.id),
      )
    ) {
      this.courseOptions.forEach((course) => {
        const database = databaseCourses.find((entry) => entry.id === course.id);
        if (!database) return;
        course.baseFourWeek = database.lesson.price;
        if (database.lesson.description) course.lessons = database.lesson.description;
      });
    }

    const databaseRooms = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ room, id: this.roomIdFromName(room.name) }))
      .filter(
        (entry): entry is { room: SchoolRoomDTO; id: string } => !!entry.id,
      );
    if (
      this.dormOptions.every((room) =>
        databaseRooms.some((entry) => entry.id === room.id),
      )
    ) {
      this.dormOptions.forEach((room) => {
        const database = databaseRooms.find((entry) => entry.id === room.id);
        if (!database) return;
        room.baseFourWeek = database.room.price;
        if (database.room.description) room.note = database.room.description;
      });
    }

    const fee = (name: RegExp) => fees.find((item) => name.test(item.name))?.fee;
    this.registrationFee = fee(/^注册费$/u) ?? this.registrationFee;
    this.seasonalFeePerWeek = fee(/旺季附加费/u) ?? this.seasonalFeePerWeek;
    this.localFeePrices.ssp = fee(/^SSP特殊学习许可证$/iu) ?? this.localFeePrices.ssp;
    this.localFeePrices.sspECard = fee(/^SSP-E CARD$/iu) ?? this.localFeePrices.sspECard;
    this.localFeePrices.acrICard = fee(/^ACR-I CARD$/iu) ?? this.localFeePrices.acrICard;
    this.localFeePrices.visaFirstCumulative = fee(/第1次签证续签累计/u) ?? this.localFeePrices.visaFirstCumulative;
    this.localFeePrices.visaSecondCumulative = fee(/第2次签证续签累计/u) ?? this.localFeePrices.visaSecondCumulative;
    this.localFeePrices.visaThirdCumulative = fee(/第3次签证续签累计/u) ?? this.localFeePrices.visaThirdCumulative;
    this.localFeePrices.visaAdditional = fee(/第4次起每次签证续签预估/u) ?? this.localFeePrices.visaAdditional;
    this.localFeePrices.accommodationDepositPerWeek = fee(/住宿费押金/u) ?? this.localFeePrices.accommodationDepositPerWeek;
    this.localFeePrices.offCampusUtilitiesPerWeek = fee(/校外水电费/u) ?? this.localFeePrices.offCampusUtilitiesPerWeek;
    this.localFeePrices.electiveMinimum = fee(/选修课最低/u) ?? this.localFeePrices.electiveMinimum;
    this.localFeePrices.electiveMaximum = fee(/选修课最高/u) ?? this.localFeePrices.electiveMaximum;
    this.localFeePrices.textbookMinimum = fee(/普通教材费最低/u) ?? this.localFeePrices.textbookMinimum;
    this.localFeePrices.textbookMaximum = fee(/普通教材费最高/u) ?? this.localFeePrices.textbookMaximum;
    this.localFeePrices.ieltsTextbook = fee(/IELTS教材费/u) ?? this.localFeePrices.ieltsTextbook;
    this.localFeePrices.laundryPerLoad = fee(/洗衣费/u) ?? this.localFeePrices.laundryPerLoad;
    this.localFeePrices.pickup = fee(/机场接机/u) ?? this.localFeePrices.pickup;
    this.localFeePrices.studentId = fee(/学生证/u) ?? this.localFeePrices.studentId;
    this.localFeePrices.managementPerWeek = fee(/管理费/u) ?? this.localFeePrices.managementPerWeek;
  }

  private courseIdFromName(name: string): string {
    if (/Survival ESL/iu.test(name)) return 'survival-esl';
    if (/Intensive ESL/iu.test(name)) return 'intensive-esl';
    if (/Light ESL/iu.test(name)) return 'light-esl';
    if (/Power ESL\s*5/iu.test(name)) return 'power-esl-5';
    if (/Power ESL\s*7/iu.test(name)) return 'power-esl-7';
    if (/Business/iu.test(name)) return 'business';
    if (/TOEIC/iu.test(name)) return 'toeic';
    if (/IELTS/iu.test(name)) return 'ielts';
    if (/监护人|Parents|Guardian/iu.test(name)) return 'parents';
    if (/青少年|Junior/iu.test(name)) return 'junior';
    if (/Senior/iu.test(name)) return 'senior';
    return '';
  }

  private roomIdFromName(name: string): string {
    if (/校内.*三人.*海景|EGI.*Triple.*Ocean/iu.test(name)) return 'egi-triple-ocean';
    if (/校内.*双人.*城景|EGI.*Twin.*City/iu.test(name)) return 'egi-twin-city';
    if (/校内.*双人.*海景|EGI.*Twin.*Ocean/iu.test(name)) return 'egi-twin-ocean';
    if (/校外.*高级|Ocean Suites.*Superior/iu.test(name)) return 'ocean-suite-superior';
    if (/校外.*豪华|Ocean Suites.*Deluxe/iu.test(name)) return 'ocean-suite-deluxe';
    if (/校外.*单人.*海景|Ocean Suites.*Ocean/iu.test(name)) return 'ocean-suite-ocean';
    return '';
  }

  private roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
