import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { CgSpartaStudentQuote } from './cg-sparta-student-quote';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { CgLocalFee as LocalFee, estimateCgLocalFees } from '../cg-local-fees';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = number;

type QuoteListKind = 'course' | 'room';
interface QuoteSelection {
  id: number;
  weeks: WeekOption;
  optionId: string;
  startDate: string;
}

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
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatDatepickerModule, QuoteImageDownloadButtonComponent, SchoolQuotePlanComponent],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    { provide: MatDatepickerIntl, useFactory: () => Object.assign(new MatDatepickerIntl(), {
      calendarLabel: '选择周日开始日期', openCalendarLabel: '打开日历', closeCalendarLabel: '关闭日历',
      prevMonthLabel: '上个月', nextMonthLabel: '下个月', prevYearLabel: '上一年', nextYearLabel: '下一年',
      prevMultiYearLabel: '前24年', nextMultiYearLabel: '后24年', switchToMonthViewLabel: '选择日期', switchToMultiYearViewLabel: '选择月份和年份',
    }) },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cg-sparta-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../cia-school/cia-school.component.css',
    './cg-sparta-school.component.css',
    './cg-quote-plan.css',
    '../../../components/school-group-quote.css',
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
  readonly maxQuoteWeeks = 52;
  readonly weekOptions: WeekOption[] = Array.from({ length: this.maxQuoteWeeks }, (_, index) => index + 1);
  readonly students:CgSpartaStudentQuote[]=[new CgSpartaStudentQuote(this)];
  quoteMode:'single'|'group'='single';
  private requestedStudentCount=2;
  get studentCount(){return this.requestedStudentCount;}
  set studentCount(value:number){this.requestedStudentCount=value;if(Number.isInteger(value)&&value>=2&&value<=20)while(this.students.length<value)this.students.push(new CgSpartaStudentQuote(this));}
  setQuoteMode(value:'single'|'group'){this.quoteMode=value;if(value==='group')this.studentCount=this.requestedStudentCount;}
  get activeStudents(){return this.quoteMode==='single'?this.students.slice(0,1):this.students.slice(0,Math.max(2,Math.min(20,Math.floor(this.studentCount)||2)));}
  get quotePlan(){return this.students[0].quotePlan;}
  get quoteError(){if(this.quoteMode==='group'&&(!Number.isInteger(this.studentCount)||this.studentCount<2||this.studentCount>20))return '多人报价人数请选择2–20人的整数。';const i=this.activeStudents.findIndex(s=>!!s.error);return i<0?'':`${this.quoteMode==='group'?'学生'+(i+1)+'：':''}${this.activeStudents[i].error}`;}
  get courseSelections():QuoteSelection[]{return this.quotePlan.courses;}
  set courseSelections(value:QuoteSelection[]){this.quotePlan.courses=value;}
  get roomSelections():QuoteSelection[]{return this.quotePlan.rooms;}
  set roomSelections(value:QuoteSelection[]){this.quotePlan.rooms=value;}
  private nextSelectionId = 3;
  readonly combinedPlanNote = '注册费只计一次；每行按自己的周数和日期估算。连续课程合并初筛优惠，有间隔则分段判断。签证按最早开始至最晚结束的停留时间（含间隔）预估，管理费与水电按住宿周数预估；换课、换房及额外教材或差价以学校确认为准。';
  readonly durationPriceNote = '每行1/2/3周分别按4周价的40%/60%/85%预估；4周及以上按4周单价按周折算。换课、换房和非标准周期的实际收费以学校确认为准。';
  get longPlanNote() { return this.longPlanNoteFor(this.students[0]); }

  longPlanNoteFor(student: CgSpartaStudentQuote) {
    const visaCount = student.localFees.find(fee => fee.item === '旅游签证续签')?.quantity ?? 0;
    return [
      '超过24周的方案按现有单价延伸预估；长期优惠暂按已公布的最高200美元档位。',
      visaCount > 5 ? '第6次起续签每次暂按4,460比索。' : '',
      '长期在读涉及的许可续办、教材及其他实际费用需学校确认。',
    ].filter(Boolean).join('');
  }
  readonly dateErrors = new Map<number, string>();
  private readonly rowDateCache = new Map<number, { key: string; date: Date | null }>();
  readonly sundayFilter = (date: Date | null): boolean => !!date && Number.isFinite(date.getTime()) && date.getDay() === 0;
  includeAirportPickup = false;
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
      note: 'CG Academy有斯巴达和Banilad两个校区，本页为斯巴达校区',
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
      title: 'CG斯巴达校区与泳池',
      description:
        '紫色低层校舍围绕泳池展开，是CG斯巴达校区最有辨识度的校区画面。',
      src: '/assets/philippines/cg-sparta-campus-hero.jpg',
    },
    {
      category: '设施',
      title: '夜间泳池与CG斯巴达校区标识',
      description:
        '平日学习强度高，校内泳池、篮球场、健身房和休息空间成为学生课后放松重点。',
      src: 'https://cebu21.jp/include/schoolno5/cgcebu/Swimming%20pool/008.jpg',
    },
    {
      category: '教室',
      title: '小组教室参考',
      description:
        '斯巴达课程包含1:1与1:4小组课，EOP时段帮助学生增加英语输出机会。',
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
      title: 'CG斯巴达校区日景',
      description:
        'Talisay校区比市中心更安静，适合想减少外界干扰、集中学习的学生。',
      src: 'https://www.academicworld.co.th/images/2024/12/12/1.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: 'CG斯巴达校区' },
    { label: '学校别称', value: 'CG Academy / Cebu Globalization Academy' },
    {
      label: '地址',
      value: '1951-A-1 Uldog, Cansojong, Talisay City, Cebu, Philippines',
    },
    { label: '学校定位', value: '宿务斯巴达型英语学校，主打高强度ESL、TOEIC、IELTS和商务英语' },
    { label: '学生规模', value: '公开资料显示约150-152名学生容量，国籍比例按月份变化' },
    { label: '课程方向', value: '斯巴达、高阶斯巴达、TOEIC、IELTS Basic / Intensive / Guarantee、Business、Short-Term ESL' },
    { label: '住宿房型', value: '校内1人房、2人房、3人房、4人房；另有M&J Pension外部寮1人房参考' },
    { label: '4周起价', value: '原价1,550美元：斯巴达课程 + 4人房 + 注册费；思达9折后1,405美元，符合淡季活动再减150美元' },
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
      text: '标准斯巴达为1:1四节加1:4四节，高阶斯巴达则把一节小组课换成一对一。',
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
      text: '如果你知道自己想提高英语，却担心在宿务容易玩散，CG斯巴达校区的制度会更有推动力。',
    },
    {
      title: '想做TOEIC或IELTS备考',
      text: 'TOEIC、IELTS Basic、IELTS Intensive和IELTS Guarantee都有明确课表和模考安排。',
    },
    {
      title: '中长期3-6个月学习',
      text: '公开资料中CG斯巴达校区常被定位为适合认真长期学习的校区，长周期也有公开长期折扣。',
    },
    {
      title: '想要校内设施完整的管理型学校',
      text: '虽然管理严格，但泳池、健身房、篮球场、卖店、自习室和三餐配置完整。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '想平日自由外出',
      text: '斯巴达校区平日外出限制严格；如果想更多自由，可比较CG Banilad、CELLA Premium或I.BREEZE。',
    },
    {
      title: '只想度假式轻松学习',
      text: 'CG斯巴达校区主轴是高强度学习，不适合只想轻量课程、海边环境或每天外出体验的人。',
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
    { id: 'quad', name: '斯巴达 4人房', feeUsd: 650, note: '校内预算最低房型。' },
    { id: 'triple', name: '斯巴达 3人房', feeUsd: 700, note: '比4人房更舒适，费用仍相对可控。' },
    { id: 'twin', name: '斯巴达 2人房', feeUsd: 750, note: '隐私和预算较平衡。' },
    { id: 'single', name: '斯巴达 1人房', feeUsd: 900, note: '最安静，但热门档期需尽早确认。' },
    { id: 'external-single', name: '校外1人房', feeUsd: 1200, note: '校外住宿参考，通勤、空房和校规需单独确认。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'sparta',
      name: '斯巴达课程（Sparta Course）',
      type: '标准斯巴达ESL',
      lessons: '一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合想用高强度课表提升口语、听力、阅读和写作基础的学生。',
      tuitionUsd: 800,
      fourWeekFees: { quad: 1450, triple: 1500, twin: 1550, single: 1700, 'external-single': 2000 },
    },
    {
      id: 'premier-sparta',
      name: '高阶斯巴达（Premier Sparta）',
      type: '一对一加量ESL',
      lessons: '一对一5课时 + 小组3课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合想比标准斯巴达多一节一对一反馈的人。',
      tuitionUsd: 850,
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
    {
      id: 'toeic-sparta',
      name: '托业斯巴达（TOEIC Sparta）',
      type: 'TOEIC备考',
      lessons: '托业一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合想兼顾TOEIC分数和一般英语基础的学生。',
      tuitionUsd: 850,
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
    {
      id: 'toeic-premier',
      name: '托业强化（TOEIC Premier）',
      type: 'TOEIC强化',
      lessons: '一对一5课时 + 小组3课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合TOEIC目标更明确、希望增加一对一备考比例的人。',
      tuitionUsd: 900,
      fourWeekFees: { quad: 1550, triple: 1600, twin: 1650, single: 1800, 'external-single': 2100 },
    },
    {
      id: 'ielts-basic',
      name: '雅思基础（IELTS Basic）',
      type: 'IELTS入门',
      lessons: '一对一4课时 + 小组4课时 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '适合未达到保证班门槛、想先熟悉IELTS题型的人。',
      tuitionUsd: 850,
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
    {
      id: 'ielts-guarantee',
      name: '雅思保证班（IELTS Guarantee）',
      type: 'IELTS保证班',
      lessons: '一对一4课时 + 小组4课时 + 晚课雅思 + 雅思词汇 + 自习2节课',
      suitable: '适合达到入学门槛、需要保证班学习规则推动的学生。',
      tuitionUsd: 1100,
      fourWeekFees: { quad: 1750, triple: 1800, twin: 1850, single: 2000, 'external-single': 2300 },
    },
    {
      id: 'ielts-intensive',
      name: '雅思密集（IELTS Intensive）',
      type: 'IELTS密集',
      lessons: '一对一4课时 + 小组4课时 + 雅思晚课 + 雅思词汇 + 自习2节课',
      suitable: '适合有明确IELTS分数需求、想集中冲刺听说读写的人。',
      tuitionUsd: 950,
      fourWeekFees: { quad: 1600, triple: 1650, twin: 1700, single: 1850, 'external-single': 2150 },
    },
    {
      id: 'business-english',
      name: '商务英语（Business English）',
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
      text: 'CG斯巴达校区不是轻松度假型学校，顾问会先帮你判断学习目标和可承受度。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择菲律宾宿务语言学校',
    },
    {
      number: '02',
      title: '课程差异逐项讲清',
      text: '斯巴达、Premier、TOEIC、IELTS、Business和Short-Term ESL的课表不同，不能只看价格。',
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
    '斯巴达校区平日外出限制严格，报名之前一定要确认自己是否能接受校规。',
    'IELTS Guarantee、Business和Short-Term ESL有周期、入学门槛或开课规则限制，需要单独确认。',
    '如果想要市区自由生活，可同步比较CG Banilad、CELLA Premium、I.BREEZE或其他半斯巴达学校。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'CG斯巴达校区和CIA最大的区别是什么？',
      answer:
        'CIA更偏Mactan综合型半斯巴达新校区；CG斯巴达校区在Talisay，重点是严格管理、平日外出限制、EOP、单词作文和强制自习，更适合想集中学习的人。',
    },
    {
      question: '页面上的报价包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算课程住宿套餐和注册费；SSP、签证、押金、公共电费、冷气电费、教材、接机、旺季加价和个人生活费仍需另行确认。',
    },
    {
      question: 'CG斯巴达校区适合短期一两周吗？',
      answer:
        '可以考虑Short-Term ESL：1周学费370美元，2周学费640美元；注册费、住宿、开课规则和假日安排要报名前确认。',
    },
    {
      question: 'CG斯巴达校区适合IELTS吗？',
      answer:
        '适合列入候选。IELTS Basic适合入门，IELTS Intensive适合密集备考且12周起报，IELTS Guarantee另有入学分数门槛。',
    },
    {
      question: '平日真的不能外出吗？',
      answer:
        '公开资料列斯巴达校区平日外出限制严格，通常周五课后和周末才可外出，门禁和外宿规则以学校当期说明为准。',
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
    { label: 'CG斯巴达校区 2026官方价格表', url: 'https://cebucg.com/kr/pdf/07.pdf' },
    { label: 'CG Academy官方当地费用表', url: 'https://cebucg.com/kr/pdf/06.pdf' },
    { label: 'Fujiyama CG斯巴达校区 2026费用', url: 'https://www.fujiyama-international.com/philippines/cg-esl-center.html' },
    { label: '澳贝客CG斯巴达校区中文费用', url: 'https://www.ioutback.com/study-abroad/philippines/SCHOOL/cg_detail' },
  ];

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  // Preserve single-selection callers while courses and accommodation are edited independently.
  get selectedCourseId(): string { return this.courseSelections[0].optionId; }
  set selectedCourseId(value: string) { this.updateSelection('course', this.courseSelections[0].id, { optionId: value }); }
  get selectedRoomId(): string { return this.roomSelections[0].optionId; }
  set selectedRoomId(value: string) { this.updateSelection('room', this.roomSelections[0].id, { optionId: value }); }
  get selectedWeeks(): WeekOption { return this.courseSelections[0].weeks; }
  set selectedWeeks(value: WeekOption) {
    this.updateSelection('course', this.courseSelections[0].id, { weeks: value });
    this.updateSelection('room', this.roomSelections[0].id, { weeks: value });
  }

  get totalWeeks(): number { return this.courseSelections.reduce((sum, row) => sum + row.weeks, 0); }
  get roomTotalWeeks(): number { return this.roomSelections.reduce((sum, row) => sum + row.weeks, 0); }
  get isCombinedPlan(): boolean { return this.courseSelections.length > 1 || this.roomSelections.length > 1 || this.dateCoverageMismatch; }
  get quoteHeading(): string { return this.quoteMode==='single'?`CG斯巴达校区${this.totalWeeks}周报价`:`CG斯巴达校区 ${this.activeStudents.length}人报价`; }
  get durationMismatch(): boolean { return this.totalWeeks !== this.roomTotalWeeks; }
  get canExportQuote(): boolean { return !this.quoteError; }
  get selectedStartDate(): string { return [...this.courseSelections].sort((a, b) => a.startDate.localeCompare(b.startDate))[0].startDate; }
  // Legacy single-plan callers; the page edits each row through setRowStartDate instead.
  set selectedStartDate(value: string) {
    this.courseSelections = this.courseSelections.map((row, index) => index === 0 ? { ...row, startDate: value } : row);
    this.roomSelections = this.roomSelections.map((row, index) => index === 0 ? { ...row, startDate: value } : row);
  }

  private validDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const timestamp = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
  }
  private dateAt(value: string, days: number): string {
    return this.validDate(value) ? new Date(Date.parse(`${value}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10) : '';
  }
  private weekDates(rows: QuoteSelection[]): Set<string> {
    return new Set(rows.filter(row => this.validDate(row.startDate)).flatMap(row =>
      Array.from({ length: row.weeks }, (_, index) => this.dateAt(row.startDate, index * 7))));
  }
  get dateCoverageMismatch(): boolean {
    const courses = this.weekDates(this.courseSelections);
    const rooms = this.weekDates(this.roomSelections);
    return courses.size !== rooms.size || [...courses].some(date => !rooms.has(date));
  }
  get hasOverlappingRows(): boolean {
    return this.weekDates(this.courseSelections).size < this.totalWeeks || this.weekDates(this.roomSelections).size < this.roomTotalWeeks;
  }
  get stayWeeks(): number {
    const dates = [...this.weekDates([...this.courseSelections, ...this.roomSelections])].sort();
    return dates.length ? Math.round((Date.parse(dates[dates.length - 1]) - Date.parse(dates[0])) / 604800000) + 1 : 0;
  }
  get hasLongPlan(): boolean { return this.stayWeeks > 24; }
  get planError(): string {
    if (!this.validSundayStart) return '每条课程和住宿都需要选择有效的周日开始日期。';
    if (this.hasOverlappingRows) return '课程清单或住宿清单中有日期重叠，请调整后再保存报价单，避免重复计费。';
    if (this.stayWeeks > this.maxQuoteWeeks) return '从最早开始至最晚结束不能超过52周（约一年），请调整日期或周数。';
    return '';
  }

  private selections(kind: QuoteListKind): QuoteSelection[] { return kind === 'course' ? this.courseSelections : this.roomSelections; }
  canAddSelection(kind: QuoteListKind): boolean { return this.selections(kind).reduce((sum, row) => sum + row.weeks, 0) < this.maxQuoteWeeks; }

  addSelection(kind: QuoteListKind): void {
    if (!this.canAddSelection(kind)) return;
    const rows = this.selections(kind);
    const weeks = Math.min(4, this.maxQuoteWeeks - rows.reduce((sum, row) => sum + row.weeks, 0));
    const last = [...rows].sort((a, b) => this.dateAt(a.startDate, a.weeks * 7).localeCompare(this.dateAt(b.startDate, b.weeks * 7))).at(-1)!;
    const next = [...rows, { ...last, id: this.nextSelectionId++, weeks, startDate: this.dateAt(last.startDate, last.weeks * 7) }];
    if (kind === 'course') this.courseSelections = next; else this.roomSelections = next;
  }

  removeSelection(kind: QuoteListKind, id: number): void {
    const rows = this.selections(kind);
    if (rows.length <= 1) return;
    if (kind === 'course') this.courseSelections = rows.filter(row => row.id !== id);
    else this.roomSelections = rows.filter(row => row.id !== id);
    this.rowDateCache.delete(id);
    this.dateErrors.delete(id);
  }

  updateSelection(kind: QuoteListKind, id: number, changes: Partial<Pick<QuoteSelection, 'weeks' | 'optionId'>>): void {
    const next = this.selections(kind).map(row => row.id === id ? { ...row, ...changes } : row);
    const options = kind === 'course' ? this.courseOptions : this.roomOptions;
    if (next.reduce((sum, row) => sum + row.weeks, 0) > this.maxQuoteWeeks ||
      next.some(row => !this.weekOptions.includes(row.weeks) || !options.some(option => option.id === row.optionId))) return;
    if (kind === 'course') this.courseSelections = next; else this.roomSelections = next;
  }

  selectionWeekOptions(kind: QuoteListKind, row: QuoteSelection): WeekOption[] {
    const total = this.selections(kind).reduce((sum, item) => sum + item.weeks, 0);
    return this.weekOptions.filter(weeks => total - row.weeks + weeks <= this.maxQuoteWeeks);
  }
  trackSelection(_index: number, row: QuoteSelection): number { return row.id; }

  get validStartDate(): boolean {
    return this.validDate(this.selectedStartDate);
  }
  get validSundayStart(): boolean {
    return [...this.courseSelections, ...this.roomSelections].every(row => this.validDate(row.startDate) && new Date(`${row.startDate}T00:00:00Z`).getUTCDay() === 0);
  }
  rowStartDate(row: QuoteSelection): Date | null {
    const cached = this.rowDateCache.get(row.id);
    if (cached?.key === row.startDate) return cached.date;
    const [year, month, day] = row.startDate.split('-').map(Number);
    const date = this.validDate(row.startDate) ? new Date(year, month - 1, day) : null;
    this.rowDateCache.set(row.id, { key: row.startDate, date });
    return date;
  }
  setRowStartDate(kind: QuoteListKind, id: number, date: Date | null): void {
    if (!this.sundayFilter(date)) {
      this.dateErrors.set(id, '开始日期只能选择周日。');
      return;
    }
    const startDate = `${date!.getFullYear()}-${String(date!.getMonth() + 1).padStart(2, '0')}-${String(date!.getDate()).padStart(2, '0')}`;
    const next = this.selections(kind).map(row => row.id === id ? { ...row, startDate } : row);
    if (kind === 'course') this.courseSelections = next; else this.roomSelections = next;
    this.dateErrors.delete(id);
  }

  private quoteRows(kind: QuoteListKind) {
    return this.selections(kind).map((row, index) => {
      const course = kind === 'course' ? this.courseOptions.find(option => option.id === row.optionId)! : null;
      const room = kind === 'room' ? this.roomOptions.find(option => option.id === row.optionId)! : null;
      const startDateText = this.validDate(row.startDate) ? row.startDate.replace(/-/g, '/') : '待确认';
      const endDate = this.dateAt(row.startDate, row.weeks * 7 - 1).replace(/-/g, '/') || '待确认';
      const warning = course?.id === 'ielts-intensive' && row.weeks < 12 ? '雅思密集课程12周起报，当前安排需学校确认。'
        : course?.id === 'business-english' && row.weeks < 4 ? '商务英语4周起报，当前安排需学校确认。'
        : course?.id === 'ielts-guarantee' ? '保证班入学分数、周期及转课规则需学校确认。' : '';
      const lessonParts = (course?.lessons ?? '').split(' + ').map(part => part.replace(/课时|节课/g, '节'));
      return { ...row, index: index + 1, name: course?.name ?? room!.name, englishName: course?.name.split('（')[1]?.replace('）', '') ?? '', lessons: course?.lessons ?? '',
        lessonMain: lessonParts.slice(0, 2).join(' · '), lessonExtra: lessonParts.slice(2).join(' · '),
        startDateText, endDate, dateRange: `${startDateText}–${endDate}`, warning,
        amount: (course?.tuitionUsd ?? room!.feeUsd) * this.durationMultiplier(row.weeks) };
    });
  }
  get courseQuoteRows() { return this.quoteRows('course'); }
  get roomQuoteRows() { return this.quoteRows('room'); }
  get quoteLists() {
    return [
      { kind: 'course' as const, title: '课程', rows: this.courseQuoteRows, options: this.courseOptions as Array<{ id: string; name: string }>, weeks: this.totalWeeks },
      { kind: 'room' as const, title: '住宿', rows: this.roomQuoteRows, options: this.roomOptions as Array<{ id: string; name: string }>, weeks: this.roomTotalWeeks },
    ];
  }
  trackQuoteList(_index: number, list: { kind: QuoteListKind }): string { return list.kind; }

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

  get tuitionForSelectedWeeks(): number { return this.activeStudents.reduce((sum,s)=>sum+s.tuition,0); }

  get roomFeeForSelectedWeeks(): number { return this.activeStudents.reduce((sum,s)=>sum+s.accommodation,0); }

  get sidaDiscountAmount(): number {
    return this.activeStudents.reduce((sum,s)=>sum+s.sidaDiscount,0);
  }

  get isOffSeasonEntry(): boolean {
    return this.validStartDate && this.selectedStartDate >= '2026-08-30' && this.selectedStartDate <= '2026-12-27';
  }

  get offSeasonDiscount(): number {
    return this.activeStudents.reduce((sum,s)=>sum+s.offSeasonDiscount,0);
  }

  get longStayDiscount(): number {
    return this.activeStudents.reduce((sum,s)=>sum+s.longStayDiscount,0);
  }

  private get coursePeriods(): Array<{ startDate: string; weeks: number }> {
    const periods: Array<{ startDate: string; weeks: number }> = [];
    for (const date of [...this.weekDates(this.courseSelections)].sort()) {
      const last = periods[periods.length - 1];
      if (last && this.dateAt(last.startDate, last.weeks * 7) === date) last.weeks++;
      else periods.push({ startDate: date, weeks: 1 });
    }
    return periods;
  }

  get summerWeeks(): number { return this.activeStudents.reduce((sum,s)=>sum+s.summerWeeks,0); }

  get summerSurcharge(): number {
    return this.summerWeeks * this.summerFeePerWeek;
  }

  get quoteUsd(): number { return this.activeStudents.reduce((sum,s)=>sum+s.quoteUsd,0); }

  get quoteUsdText(): string {
    return `${this.formatUsd(this.quoteUsd)} 美元`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round(this.quoteUsd * this.usdToCny);

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
    return this.localFeeEstimate.periods;
  }

  get localFeeEstimateNote(): string {
    return this.localFeeEstimate.note;
  }

  get visaExtensionCount(): number {
    return this.localFeeEstimate.visaExtensionCount;
  }

  get visaExtensionFee(): number {
    return this.localFeeEstimate.visaExtensionFee;
  }

  get localFees(): LocalFee[] {
    const included=groupLocalFees(this.activeStudents.map(student=>({localFees:student.localFees.filter(f=>!f.excluded).map(f=>({item:f.item,unitLabel:f.amount,quantity:f.quantity,total:f.total,note:f.note}))})))
      .map(f=>({item:f.item,amount:f.unitLabel,quantity:f.quantity,total:f.total,note:f.note}));
    const optional=estimateCgLocalFees(this.stayWeeks,this.includeAirportPickup,this.roomTotalWeeks,this.students[0].visaType).fees.filter(f=>f.excluded);
    return [...included,...optional];
  }

  private get localFeeEstimate() {
    return estimateCgLocalFees(this.stayWeeks, this.includeAirportPickup, this.roomTotalWeeks,this.students[0].visaType);
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

  get payableRegistrationFee(){return this.activeStudents.reduce((sum,s)=>sum+s.registration,0);}
  get schoolPaymentItems(){const paid=this.activeStudents.filter(s=>s.registration>0).length;return [{icon:'注',label:'注册费',amount:`${this.formatUsd(this.payableRegistrationFee)} 美元`,note:`一次性费用，老学员返校免费；本次计收${paid}人 × ${this.registrationFee}美元${paid<this.activeStudents.length?'，其余已免':''}`},...groupPaymentLines(this.activeStudents,false)];}
  get optionalFeeItems(){return this.excludedLocalFees.map(f=>({label:f.item,amount:f.item.includes('接机')?'1,200 比索':this.formatPhp(f.total),cnyAmount:`约人民币 ${Math.round((f.item.includes('接机')?1200:f.total)/this.phpPerCny).toLocaleString('zh-CN')} 元`,note:f.item.includes('接机')?(this.activeStudents.length>1?'可选，也可自行前往；多人费用须按实际接机安排确认。':'可选，也可自行前往。'):'预估1,000比索，具体以学校为准；无损坏及无欠费时可退。'}));}
  get quoteImageData() {
    const planRows=(['课','宿'] as const).flatMap(icon=>this.activeStudents.flatMap((student,index)=>{
      const rows=[...(icon==='课'?student.quotePlan.courses:student.quotePlan.rooms)].sort((a,b)=>a.startDate.localeCompare(b.startDate));
      return student.quotePlan.paymentItems().filter(x=>x.icon===icon).map((x,rowIndex)=>{
        const warning=icon==='课'?student.warning(rows[rowIndex]):'';
        return {...x,label:`${this.quoteMode==='group'?'学生'+(index+1)+' · ':''}${x.label.replace(/^课程费/,'课程名称').replace(/^住宿费/,'住宿名称')}`,note:[x.note,warning].filter(Boolean).join('；')};
      });
    }));
    const paymentItems=[this.schoolPaymentItems[0],...planRows,...groupPaymentLines(this.activeStudents,true)];
    const warnings=this.activeStudents.flatMap((s,i)=>s.quotePlan.warning?[`${this.quoteMode==='group'?'学生'+(i+1)+'：':''}${s.quotePlan.warning}`]:[]);
    const short=[...new Set(this.activeStudents.flatMap(s=>s.quotePlan.shortStayNotes(w=>s.multiplier(w))))];
    const prorated=this.activeStudents.some(s=>[...s.quotePlan.courses,...s.quotePlan.rooms].some(row=>row.weeks>4&&row.weeks%4!==0))?['非4周整期的费用按周折算，均为预估。']:[];
    const long=[...new Set(this.activeStudents.filter(s=>s.quotePlan.stayWeeks>24).map(s=>this.longPlanNoteFor(s)))];
    const quote=buildPhilippinesDetailedQuote({fullFeeDetails:true,localFeeTableLayout:'web',schoolCode:'CG斯巴达校区',schoolName:'CG斯巴达校区',filePrefix:'CG斯巴达校区',heroSrc:'/assets/philippines/cg-sparta-campus-hero.jpg',weeks:this.totalWeeks,startDate:this.selectedStartDate,usdToCny:this.usdToCny,totalUsd:this.quoteUsd,paymentItems,
      localFeeItems:this.includedLocalFees.map(f=>({label:f.item,unit:f.amount,quantity:this.formatFeeQuantity(f.quantity),amount:this.formatPhp(f.total),note:f.note})),localFeeTotal:this.localFeesTotal,localCurrencyName:'比索',localFeeCny:Math.round(this.localFeesTotal/this.phpPerCny),localFeeNote:this.localFeeEstimateNote,optionalFeeItems:this.optionalFeeItems,ruleNotes:[]});
    const result=applySchoolQuoteImageLayout({...quote,importantNotes:[...warnings,...short,...prorated,...long,'最终以学校价格、空房及优惠确认为准。']},'CG斯巴达校区',this.totalWeeks,this.selectedStartDate,this.quoteUsd,this.usdToCny);
    return {...result,headingText:this.quoteHeading,fileName:`${this.quoteHeading}-${this.selectedStartDate.replace(/-/g,'')}.png`,conversionRates:{usdToCny:this.usdToCny,phpPerCny:this.phpPerCny,date:this.exchangeRateLive?this.exchangeRateDate:undefined}};
  }

  get applicablePriceNote(): string {
    const rows = [...this.courseSelections, ...this.roomSelections];
    const shortWeeks = [...new Set(rows.map(row => row.weeks).filter(weeks => weeks < 4))].sort((a, b) => a - b);
    const short = shortWeeks.map(weeks => `${weeks}周按4周价的${this.durationMultiplier(weeks) * 100}%`).join('，');
    const prorated = rows.some(row => row.weeks > 4 && row.weeks % 4 !== 0) ? '非4周整期的费用按周折算' : '';
    const note = [short, prorated].filter(Boolean).join('；');
    return note ? `${note}，均为预估。` : '';
  }

  formatUsd(value: number): string {
    const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
    return rounded.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
      maximumFractionDigits: 2,
    });
  }

  formatPhp(value: number): string {
    return `${value.toLocaleString('en-US')} 比索`;
  }

  formatFeeQuantity(value: number): string {
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  }

  private durationMultiplier(weeks: WeekOption): number {
    // CG's published short-stay percentages; longer/non-standard periods are proportional estimates.
    return weeks === 1 ? 0.4 : weeks === 2 ? 0.6 : weeks === 3 ? 0.85 : weeks / 4;
  }
}
