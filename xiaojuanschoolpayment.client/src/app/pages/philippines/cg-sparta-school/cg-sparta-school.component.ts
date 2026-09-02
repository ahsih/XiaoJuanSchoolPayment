import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 3 | 4 | 8 | 12 | 16 | 20 | 24;

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
  feeUsd: number;
  note: string;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  tuitionUsd: number;
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

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-cg-sparta-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cg-sparta-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../cia-school/cia-school.component.css',
    './cg-sparta-school.component.css',
  ],
})
export class CgSpartaSchoolComponent implements OnInit {
  private readonly exchangeRateService = inject(ExchangeRateService);
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
  readonly sidaDiscountRate = 0.9;
  readonly offSeasonDiscountPerFourWeeks = 150;
  readonly summerFeePerWeek = 40;
  readonly summerDateRange = '2026/07/05–2026/08/30';
  readonly offSeasonRuleText = '2026/08/30–2026/12/27入学，每满4周优惠150美元';
  readonly longStayRuleText = '12周优惠50美元；16周100美元；20周150美元；24周200美元';
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions: WeekOption[] = [3, 4, 8, 12, 16, 20, 24];

  selectedCourseId = 'sparta';
  selectedRoomId = 'quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'lock_clock',
      label: '学校类型',
      value: '宿务Talisay斯巴达校区',
      note: '平日外出限制、EOP、单词测试、作文和晚自习，适合想被制度推着学的学生',
    },
    {
      icon: 'history_edu',
      label: '学校背景',
      value: '2004年创立，韩资老牌学校',
      note: 'CG Academy有Sparta和Banilad两个校区，本页为Sparta Campus',
    },
    {
      icon: 'schedule',
      label: '学习强度',
      value: '每日最多约12小时学习安排',
      note: '正课、夜间课、词汇/作文和强制自习组成完整学习节奏',
    },
    {
      icon: 'menu_book',
      label: '课程方向',
      value: 'ESL / TOEIC / IELTS / Business / Short-Term',
      note: '普通口语强化、考试备考和1-2周Short-Term ESL都可比较',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: '校内1/2/3/4人房 + 外部寮1人房',
      note: '4人房预算最低，外部寮更自由但校规和通勤需单独确认',
    },
    {
      icon: 'pool',
      label: '校区设施',
      value: '泳池 / 健身房 / 篮球场 / 自习室',
      note: '虽然是高强度管理型学校，校内生活设施仍比较完整',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'CG Sparta校区与泳池',
      description:
        '紫色低层校舍围绕泳池展开，是CG Sparta Campus最有辨识度的校区画面。',
      src: '/assets/philippines/cg-sparta-campus-hero.jpg',
    },
    {
      category: '设施',
      title: '夜间泳池与CG Sparta标识',
      description:
        '平日学习强度高，校内泳池、篮球场、健身房和休息空间成为学生课后放松重点。',
      src: 'https://cebu21.jp/include/schoolno5/cgcebu/Swimming%20pool/008.jpg',
    },
    {
      category: '教室',
      title: '小组教室参考',
      description:
        'Sparta课程包含1:1与1:4小组课，EOP时段帮助学生增加英语输出机会。',
      src: 'https://www.worldplus.com.tw/upload/school/photo/20250626222819175.jpg',
    },
    {
      category: '住宿',
      title: '校内3人房参考',
      description:
        '校内宿舍以学习和生活一体化为主，房内配置床、书桌、收纳和空调。',
      src: 'https://cebu-navi.com/photo/school/132/3cb0d67b0327b4d573d332f7d99ba5a5.jpg',
    },
    {
      category: '住宿',
      title: '校内4人房参考',
      description:
        '4人房是预算型选择，适合希望把费用压低、并接受集体宿舍生活的学生。',
      src: 'https://www.fujiyama-international.com/archives/004/202408/29706f438a34bbf9cff51d7dcd1660c2.jpg',
    },
    {
      category: '餐厅',
      title: 'CG Academy自助餐食',
      description:
        '公开资料列三餐提供，餐食以自助形式为主，最终菜单以学校现场安排为准。',
      src: 'https://cebu21.jp/include/schoolno2/cgcebu/Dining%20room/Dining%20room_4.jpg',
    },
    {
      category: '校园',
      title: 'CG Sparta日间校区',
      description:
        'Talisay校区比市中心更安静，适合想减少外界干扰、集中学习的学生。',
      src: 'https://www.academicworld.co.th/images/2024/12/12/1.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务CG Academy（Sparta Campus）' },
    { label: '英文名称', value: 'CG Academy Sparta Campus / Cebu Globalization Academy' },
    {
      label: '地址',
      value: '1951-A-1 Uldog, Cansojong, Talisay City, Cebu, Philippines',
    },
    { label: '学校定位', value: '宿务斯巴达型英语学校，主打高强度ESL、TOEIC、IELTS和商务英语' },
    { label: '学生规模', value: '公开资料显示约150-152名学生容量，国籍比例按月份变化' },
    { label: '课程方向', value: 'Sparta、Premier Sparta、TOEIC、IELTS Basic / Intensive / Guarantee、Business、Short-Term ESL' },
    { label: '住宿房型', value: '校内1人房、2人房、3人房、4人房；另有M&J Pension外部寮1人房参考' },
    { label: '4周起价', value: '原价USD 1,550：Sparta Course + 4人房 + 注册费；思达9折后USD 1,405，符合淡季活动再减USD 150' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: '/assets/philippines/cg-sparta-campus-hero.jpg',
      title: '宿务少见的斯巴达专门校',
      text: '平日外出限制、EOP、单词测试、作文和强制自习，适合目标明确、需要环境约束的人。',
    },
    {
      image:
        'https://www.worldplus.com.tw/upload/school/photo/20250626222819175.jpg',
      title: '1:1与1:4小班结合',
      text: '标准Sparta为1:1四节加1:4四节，Premier Sparta则把一节小组课换成一对一。',
    },
    {
      image:
        'https://cebu21.jp/include/schoolno5/cgcebu/Swimming%20pool/008.jpg',
      title: '学习之外有校内设施',
      text: '泳池、健身房、篮球场、桌球室、卖店、自习室等设施，补足平日不能外出的生活需求。',
    },
    {
      image:
        'https://cebu21.jp/include/schoolno2/cgcebu/Dining%20room/Dining%20room_4.jpg',
      title: '三餐与宿舍一体',
      text: '课程、住宿、三餐都在校区内完成，减少通勤和生活分心，更适合集中式学习。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '自律不足但目标明确',
      text: '如果你知道自己想提高英语，却担心在宿务容易玩散，CG Sparta的制度会更有推动力。',
    },
    {
      title: '想做TOEIC或IELTS备考',
      text: 'TOEIC、IELTS Basic、IELTS Intensive和IELTS Guarantee都有明确课表和模考安排。',
    },
    {
      title: '中长期3-6个月学习',
      text: '公开资料中CG Sparta常被定位为适合认真长期学习的校区，长周期也有公开长期折扣。',
    },
    {
      title: '想要校内设施完整的管理型学校',
      text: '虽然管理严格，但泳池、健身房、篮球场、卖店、自习室和三餐配置完整。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '想平日自由外出',
      text: 'Sparta Campus平日外出限制严格；如果想更多自由，可比较CG Banilad、CELLA Premium或I.BREEZE。',
    },
    {
      title: '只想度假式轻松学习',
      text: 'CG Sparta主轴是高强度学习，不适合只想轻量课程、海边环境或每天外出体验的人。',
    },
    {
      title: '无法接受晚间测试和自习',
      text: '单词测试、作文和强制自习是学校学习节奏的重要部分，报名之前要先确认自己能配合。',
    },
    {
      title: '未成年学生单独行动需求高',
      text: '未成年学生外出和门禁限制更严格，家庭需要提前确认校规、监护安排和活动范围。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'quad', name: 'Sparta 4人房', feeUsd: 650, note: '校内预算最低房型。' },
    { id: 'triple', name: 'Sparta 3人房', feeUsd: 700, note: '比4人房更舒适，费用仍相对可控。' },
    { id: 'twin', name: 'Sparta 2人房', feeUsd: 750, note: '隐私和预算较平衡。' },
    { id: 'single', name: 'Sparta 1人房', feeUsd: 900, note: '最安静，但热门档期需尽早确认。' },
    { id: 'external-single', name: '校外1人房', feeUsd: 1200, note: '校外住宿参考，通勤、空房和校规需单独确认。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'sparta',
      name: 'Sparta Course',
      type: '标准斯巴达ESL',
      lessons: '一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合想用高强度课表提升口语、听力、阅读和写作基础的学生。',
      tuitionUsd: 800,
      fourWeekFees: { quad: 1450, triple: 1500, twin: 1550, single: 1700, 'external-single': 2000 },
    },
    {
      id: 'premier-sparta',
      name: 'Premier Sparta',
      type: '一对一加量ESL',
      lessons: '一对一5课时 + 小组3课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合想比标准Sparta多一节一对一反馈的人。',
      tuitionUsd: 850,
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
    {
      id: 'toeic-sparta',
      name: '斯巴达TOEIC',
      type: 'TOEIC备考',
      lessons: 'TOEIC一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合想兼顾TOEIC分数和一般英语基础的学生。',
      tuitionUsd: 850,
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
    {
      id: 'toeic-premier',
      name: 'TOEIC Premier',
      type: 'TOEIC强化',
      lessons: '一对一5课时 + 小组3课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合TOEIC目标更明确、希望增加一对一备考比例的人。',
      tuitionUsd: 900,
      fourWeekFees: { quad: 1550, triple: 1600, twin: 1650, single: 1800, 'external-single': 2100 },
    },
    {
      id: 'ielts-basic',
      name: '斯巴达IELTS Basic',
      type: 'IELTS入门',
      lessons: '一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合未达到保证班门槛、想先熟悉IELTS题型的人。',
      tuitionUsd: 850,
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
    {
      id: 'ielts-guarantee',
      name: 'IELTS Guarantee',
      type: 'IELTS保证班',
      lessons: '一对一4课时 + 小组4课时 + 晚课雅思 + 雅思词汇 + 自习2节课',
      suitable: '适合达到入学门槛、需要保证班学习规则推动的学生。',
      tuitionUsd: 1100,
      fourWeekFees: { quad: 1750, triple: 1800, twin: 1850, single: 2000, 'external-single': 2300 },
    },
    {
      id: 'ielts-intensive',
      name: 'IELTS Intensive',
      type: 'IELTS密集',
      lessons: '一对一4课时 + 小组4课时 + 雅思晚课 + 雅思词汇 + 自习2节课',
      suitable: '适合有明确IELTS分数需求、想集中冲刺听说读写的人。',
      tuitionUsd: 950,
      fourWeekFees: { quad: 1600, triple: 1650, twin: 1700, single: 1850, 'external-single': 2150 },
    },
    {
      id: 'business-english',
      name: 'Business English',
      type: '商务英语',
      lessons: '一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合需要会议、简报、面试和职场沟通英语的学生，4周起报。',
      tuitionUsd: 850,
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 08:00',
      title: '早餐 / 课前准备',
      text: '住校学生在校内用餐，周末和假日早餐时间可能调整。',
    },
    {
      time: '08:00 - 16:55',
      title: '正课时段 + EOP',
      text: '一对一、小组课或空堂穿插进行，公开资料列8:00-17:00适用英语限定政策。',
    },
    {
      time: '17:05 - 17:50',
      title: 'Evening Class',
      text: '可安排Grammar、TOEIC Listening、IELTS Listening或Self Study等内容。',
    },
    {
      time: '17:50 - 19:00',
      title: '晚餐 / 短暂休息',
      text: '平日通常不能自由外出，校内设施和卖店会成为主要生活补给。',
    },
    {
      time: '19:00 - 20:00',
      title: 'Vocabulary Test & Essay',
      text: '词汇测试与作文训练帮助学生形成每日复习和输出习惯。',
    },
    {
      time: '20:10 - 22:00',
      title: 'Mandatory Self Study',
      text: '在指定座位自习，复习当天课程并准备次日内容。',
    },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断能否接受斯巴达',
      text: '确认平日外出限制、晚间测试、自习、EOP和门禁是否符合你的学习状态。',
    },
    {
      icon: 'school',
      title: '匹配课程和周期',
      text: '根据ESL、TOEIC、IELTS、Business或Short-Term目标，确认适合的课程和最短周期。',
    },
    {
      icon: 'bed',
      title: '确认房型和空位',
      text: '按性别、入学日、房型和预算核对校内1/2/3/4人房或外部寮。',
    },
    {
      icon: 'payments',
      title: '拆清前期与当地费用',
      text: '把课程住宿、注册费、旺季费、SSP、签证、押金、水电和教材逐项列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '整理出发前资料',
      text: '协助准备护照、保险、eTravel、接机、现金和到校费用清单。',
    },
    {
      icon: 'support_agent',
      title: '到校后持续跟进',
      text: '如遇课程、宿舍、校规或账单疑问，可继续联系顾问协助沟通。',
    },
  ];

  readonly sidaReasons: SidaReason[] = [
    {
      number: '01',
      title: '先确认你是否适合高强度',
      text: 'CG Sparta不是轻松度假型学校，顾问会先帮你判断学习目标和可承受度。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择菲律宾宿务语言学校',
    },
    {
      number: '02',
      title: '课程差异逐项讲清',
      text: 'Sparta、Premier、TOEIC、IELTS、Business和Short-Term ESL的课表不同，不能只看价格。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问核算菲律宾语言学校费用',
    },
    {
      number: '03',
      title: '当地费用提前算清',
      text: 'SSP、签证、押金、水电、教材、接机和冷气电费需要提前准备现金。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航顾问核验菲律宾游学课程和合同文件',
    },
    {
      number: '04',
      title: '校规与行前提醒',
      text: '平日外出、门禁、EOP、旅行保险、周末外宿规则会在出发前提醒学生。',
      image: 'assets/cia/sida-why-action-departure.jpg',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '学习中仍可沟通',
      text: '如果课程强度、老师、宿舍或费用结算有疑问，可让顾问协助梳理重点。',
      image: 'assets/cia/sida-why-action-followup.jpg',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '国内顾问 + 宿务驻点',
      text: '国内咨询和宿务当地支持配合，适合第一次去菲律宾游学的学生。',
      image: 'assets/cia/sida-why-action-team.jpg',
      alt: '思达启航宿务和深圳服务团队',
    },
  ];

  readonly sidaTrustBadges: SidaTrustBadge[] = [
    { icon: 'rule', label: '斯巴达校规先确认' },
    { icon: 'description', label: '正式报价逐项核验' },
    { icon: 'payments', label: '当地费用分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学测试',
    '一对一课程',
    '1:4小组课',
    'Evening Class',
    '单词测试',
    '作文训练',
    '强制自习',
    '三餐',
    '校内宿舍',
    '泳池',
    '健身房',
    '篮球场',
    '自习室',
    '卖店',
    'Wi-Fi',
  ];
  readonly campusActivities = [
    '月度水平测试',
    'TOEIC / IELTS模拟考',
    'Vocabulary Test',
    'Essay Correction',
    'EOP训练',
    '毕业式与校内活动',
  ];
  readonly weekendActivities = [
    'SM Seaside',
    'Ayala Mall',
    'Bohol',
    'Moalboal',
    'Kawasan Falls',
    'Island Hopping',
  ];
  readonly notes = [
    '本页费用使用2026公开参考价；正式报价会按学校当期价格、入学日期、房型和优惠调整。',
    '课程住宿套餐通常不含注册费、旺季费、SSP、签证、押金、教材、水电、接机和个人生活费。',
    'Sparta Campus平日外出限制严格，报名之前一定要确认自己是否能接受校规。',
    'IELTS Guarantee、Business和Short-Term ESL有周期、入学门槛或开课规则限制，需要单独确认。',
    '如果想要市区自由生活，可同步比较CG Banilad、CELLA Premium、I.BREEZE或其他半斯巴达学校。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'CG Sparta和CIA最大的区别是什么？',
      answer:
        'CIA更偏Mactan综合型半斯巴达新校区；CG Sparta在Talisay，重点是严格管理、平日外出限制、EOP、单词作文和强制自习，更适合想集中学习的人。',
    },
    {
      question: '页面上的报价包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算课程住宿套餐和注册费；SSP、签证、押金、公共电费、冷气电费、教材、接机、旺季加价和个人生活费仍需另行确认。',
    },
    {
      question: 'CG Sparta适合短期一两周吗？',
      answer:
        '可以考虑Short-Term ESL：1周学费USD 370，2周学费USD 640；注册费、住宿、开课规则和假日安排要报名前确认。',
    },
    {
      question: 'CG Sparta适合IELTS吗？',
      answer:
        '适合列入候选。IELTS Basic适合入门，IELTS Intensive适合密集备考且12周起报，IELTS Guarantee另有入学分数门槛。',
    },
    {
      question: '平日真的不能外出吗？',
      answer:
        '公开资料列Sparta Campus平日外出限制严格，通常周五课后和周末才可外出，门禁和外宿规则以学校当期说明为准。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '常见问题', target: 'faq', icon: 'help' },
  ];
  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'course-fees', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '服务', target: 'service-process', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'CG Academy官网', url: 'https://www.cebucg.com/en/' },
    { label: 'CG Academy 2026英文宣传册', url: 'https://www.cebucg.com/en/pdf/01.pdf' },
    { label: 'CG Sparta 2026官方价格表', url: 'https://cebucg.com/kr/pdf/07.pdf' },
    { label: 'CG Academy官方当地费用表', url: 'https://cebucg.com/kr/pdf/06.pdf' },
    { label: 'Fujiyama CG Sparta 2026费用', url: 'https://www.fujiyama-international.com/philippines/cg-esl-center.html' },
    { label: '澳贝客CG Sparta中文费用', url: 'https://www.ioutback.com/study-abroad/philippines/SCHOOL/cg_detail' },
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

    const headerOffset = window.innerWidth <= 680 ? 132 : 156;
    const targetTop =
      targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${target}`,
    );
  }

  ngOnInit(): void {
    this.exchangeRateService.getLatestCnyRates().pipe(
      catchError(() => EMPTY),
    ).subscribe((snapshot) => {
      this.usdToCny = snapshot.usdToCny;
      this.phpPerCny = snapshot.phpPerCny;
      this.exchangeRateDate = snapshot.date;
      this.exchangeRateLive = true;
    });
  }

  feeFor(courseId: string, roomId: string, weeks: WeekOption = 4): number {
    const course = this.courseOptions.find((item) => item.id === courseId);
    const room = this.roomOptions.find((item) => item.id === roomId);
    return ((course?.tuitionUsd ?? 0) + (room?.feeUsd ?? 0)) * this.durationMultiplier(weeks);
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
    return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks;
  }

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourse.tuitionUsd * this.durationMultiplier(this.selectedWeeks);
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.feeUsd * this.durationMultiplier(this.selectedWeeks);
  }

  get sidaDiscountAmount(): number {
    return this.selectedPackageFee * (1 - this.sidaDiscountRate);
  }

  get isOffSeasonEntry(): boolean {
    return this.selectedStartDate >= '2026-08-30' && this.selectedStartDate <= '2026-12-27';
  }

  get offSeasonDiscount(): number {
    return this.isOffSeasonEntry
      ? Math.floor(this.selectedWeeks / 4) * this.offSeasonDiscountPerFourWeeks
      : 0;
  }

  get longStayDiscount(): number {
    const discounts: Partial<Record<WeekOption, number>> = {
      12: 50,
      16: 100,
      20: 150,
      24: 200,
    };
    return discounts[this.selectedWeeks] ?? 0;
  }

  get summerWeeks(): number {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.selectedStartDate)) return 0;
    const start = Date.parse(`${this.selectedStartDate}T00:00:00Z`);
    if (!Number.isFinite(start) || new Date(start).toISOString().slice(0, 10) !== this.selectedStartDate) return 0;

    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const summerStart = Date.UTC(2026, 6, 5);
    // The supplied final date (August 30) is inclusive, matching the displayed rule.
    const summerEndExclusive = Date.UTC(2026, 7, 31);
    let count = 0;
    for (let week = 0; week < this.selectedWeeks; week += 1) {
      const weekStart = start + week * weekMs;
      if (weekStart < summerEndExclusive && weekStart + weekMs > summerStart) count += 1;
    }
    return count;
  }

  get summerSurcharge(): number {
    return this.summerWeeks * this.summerFeePerWeek;
  }

  get quoteUsd(): number {
    return Math.max(
      0,
      this.registrationFee +
        this.selectedPackageFee * this.sidaDiscountRate +
        this.summerSurcharge -
        this.offSeasonDiscount -
        this.longStayDiscount,
    );
  }

  get quoteUsdText(): string {
    return `${this.formatUsd(this.quoteUsd)} 美元`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元`;
  }

  get exchangeRateText(): string {
    return this.exchangeRateLive && this.exchangeRateDate
      ? `汇率日期 ${this.exchangeRateDate}`
      : '暂按备用汇率估算';
  }

  get seasonalNote(): string {
    return `${this.offSeasonRuleText}；可与思达9折及长期优惠叠加。`;
  }

  get localFeePeriods(): number {
    return Math.max(2, Math.ceil(this.selectedWeeks / 4));
  }

  get visaExtensionCount(): number {
    return Math.max(0, Math.ceil((this.selectedWeeks - 8) / 4));
  }

  get localFees(): LocalFee[] {
    const periods = this.localFeePeriods;
    const acrQuantity = this.selectedWeeks > 8 ? 1 : 0;
    const textbookQuantity = Math.max(1, Math.ceil(this.selectedWeeks / 8));
    return [
      { item: 'SSP特殊学习许可证', amount: '7,800比索 / 次', quantity: 1, total: 7800, note: '移民局收取，按报名学习时长办理；续费及换校需重新办理' },
      { item: 'SSP-E CARD', amount: '4,500比索 / 次', quantity: 1, total: 4500, note: '移民局收取，入学和SSP同时办理，只收一次' },
      { item: 'ACR-I CARD 外国人身份证', amount: '4,500比索 / 次', quantity: acrQuantity, total: 4500 * acrQuantity, note: '移民局收取，第一次续签时按实际情况办理' },
      { item: '维护管理费', amount: '2,000比索 / 期', quantity: periods, total: 2000 * periods, note: '按学校费用表和学习周期自动估算' },
      { item: '电费', amount: '2,000比索 / 期', quantity: periods, total: 2000 * periods, note: '预估费用，超出额度部分另收25比索/kW' },
      { item: '水费', amount: '500比索 / 期', quantity: periods, total: 500 * periods, note: '按学校费用表和学习周期自动估算' },
      { item: '旅游签证续签', amount: '5,160比索 / 次', quantity: this.visaExtensionCount, total: 5160 * this.visaExtensionCount, note: '移民局收取，根据实际情况收费；续签一次有效期30天，此处为一次续签费用预估' },
      { item: '书本教材费', amount: '2,000比索 / 套', quantity: textbookQuantity, total: 2000 * textbookQuantity, note: '因课程使用教材不同，按实际购买结算；学完后需重新购买新教材' },
      { item: '宿务马克坦机场接机', amount: '1,200比索 / 次', quantity: 0, total: 0, note: '可自由选择是否需要，也可自行打车；不计入学杂费合计', excluded: true },
      { item: '押金', amount: '1,000比索 / 次', quantity: 1, total: 1000, note: '无损坏及没有额外扣费时，毕业后退还；不计入学杂费合计', excluded: true },
    ];
  }

  get localFeesTotal(): number {
    return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0);
  }

  get includedLocalFees(): LocalFee[] {
    return this.localFees.filter((fee) => !fee.excluded);
  }

  get excludedLocalFees(): LocalFee[] {
    return this.localFees.filter((fee) => fee.excluded);
  }

  get localFeesCnyText(): string {
    return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`;
  }

  get quoteImageData() {
    const includedFees = this.localFees.filter((fee) => !fee.excluded);
    const optionalFees = this.localFees.filter((fee) => fee.excluded);
    const paymentItems = [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationFee)} 美元`, note: '一次性学校注册费，不参与折扣' },
      { icon: '课', label: '课程费', amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`, note: `${this.selectedCourse.name}；${this.selectedCourse.lessons}` },
      { icon: '宿', label: '住宿费', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`, note: this.selectedRoom.name },
      { icon: '折', label: '思达折扣', amount: '9折', note: `优惠${this.formatUsd(this.sidaDiscountAmount)}美元`, accent: true },
      ...(this.offSeasonDiscount > 0 ? [{ icon: '淡', label: '淡季优惠', amount: `- ${this.formatUsd(this.offSeasonDiscount)} 美元`, note: this.offSeasonRuleText, accent: true }] : []),
      ...(this.longStayDiscount > 0 ? [{ icon: '长', label: '长期优惠', amount: `- ${this.formatUsd(this.longStayDiscount)} 美元`, note: this.longStayRuleText, accent: true }] : []),
      ...(this.summerSurcharge > 0 ? [{ icon: '暑', label: '暑假附加费', amount: `${this.formatUsd(this.summerSurcharge)} 美元`, note: `${this.summerFeePerWeek}美元/周/人；${this.summerDateRange}就读；本次计费${this.summerWeeks}周，不参与9折` }] : []),
    ];
    return buildPhilippinesDetailedQuote({
      schoolCode: 'CG SPARTA',
      schoolName: '菲律宾宿务CG Academy Sparta校区',
      filePrefix: 'CG-Sparta',
      heroSrc: '/assets/philippines/cg-sparta-campus-hero.jpg',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems,
      localFeeItems: includedFees.map((fee) => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal,
      localCurrencyName: '比索',
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: '接机和可退押金单独列示；学杂费与思达游学无关，仅供参考，实际以到校缴费为准。',
      optionalFeeItems: optionalFees.map((fee) => ({ label: fee.item, amount: this.formatPhp(fee.total), note: fee.note })),
      ruleNotes: [
        '课程费和食宿费按思达9折计算；注册费和暑假附加费不参与折扣。',
        '按单人报价，已计入适用优惠与附加费；暑假期间有重叠的学习周按整周计费，最终以学校账单为准。',
      ],
    });
  }

  formatUsd(value: number): string {
    const rounded = Math.round((value + Number.EPSILON) * 10) / 10;
    return rounded.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  formatPhp(value: number): string {
    return `${value.toLocaleString('en-US')} 比索`;
  }

  formatFeeQuantity(value: number): string {
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  }

  private durationMultiplier(weeks: WeekOption): number {
    const multiplier: Record<WeekOption, number> = {
      3: 0.85,
      4: 1,
      8: 2,
      12: 3,
      16: 4,
      20: 5,
      24: 6,
    };

    return multiplier[weeks];
  }
}
