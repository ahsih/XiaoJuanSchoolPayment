import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';
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

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  tuitionUsd: number;
}

interface RoomOption {
  id: string;
  name: string;
  feeUsd: number;
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

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-cg-banilad-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SidaWhySectionComponent, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cg-banilad-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../philippines-local-fee-table.css',
    './cg-banilad-school.component.css',
  ],
})
export class CgBaniladSchoolComponent implements OnInit {
  private readonly exchangeRateService = inject(ExchangeRateService);
  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFeeUsd = 100;
  readonly sidaDiscountRate = 0.9;
  readonly offSeasonDiscountPerFourWeeks = 150;
  readonly summerFeePerWeek = 40;
  readonly summerDateRange = '2026/07/05—2026/08/30';
  readonly offSeasonRuleText = '2026/08/30—2026/12/27入学，每满4周优惠150美元';
  readonly longStayRuleText = '12/16/20/24周分别优惠50/100/150/200美元';
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions: WeekOption[] = [3, 4, 8, 12, 16, 20, 24];
  readonly shortTermRatios: Partial<Record<WeekOption, number>> = {
    3: 0.85,
  };

  selectedCourseId = 'general-esl';
  selectedRoomId = 'quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;
  includeAirportPickup = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_city',
      label: '校区定位',
      value: '宿务市区 Banilad 半斯巴达',
      note: '适合想兼顾学习强度、生活便利和市区安全感的学生。',
    },
    {
      icon: 'groups',
      label: '学生规模',
      value: '官方公开容量约275名',
      note: 'Banilad Campus主打多国籍ESL、考试、商务与亲子课程。',
    },
    {
      icon: 'menu_book',
      label: '课程强度',
      value: 'Light ESL 至 Semi-Sparta',
      note: '从每天4节一对一，到Semi-Sparta的1:1+1:4+单词/作文安排。',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: '校内 / Alicia / 88th Avenue',
      note: '三类住宿均提供单人、双人、三人和四人房，按4周美元价格估算。',
    },
    {
      icon: 'pool',
      label: '校内设施',
      value: '泳池 / 自习室 / Cafe / Gym',
      note: '自习室开放至24:00，Cafe和Gym按官方时段开放。',
    },
    {
      icon: 'shopping_bag',
      label: '周边生活',
      value: 'IT Park / Ayala等市区资源便利',
      note: '官方资料提到餐厅、按摩、超市等生活资源步行或短车程可达。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校区',
      title: 'CG Banilad低层校园与中庭',
      description:
        'Banilad校区位于Cebu City生活圈内，校园空间比海边度假型学校更紧凑，优势是市区便利。',
      src: '/assets/philippines/cg-banilad-campus-hero.jpg',
    },
    {
      category: '教室',
      title: '官方Banilad一对一教室',
      description:
        'CG官方Banilad页面展示一对一教室，课程覆盖Light ESL、General ESL、Intensive、Power与考试方向。',
      src: 'https://www.cebucg.com/en/img/school_08_b.jpg',
    },
    {
      category: '生活',
      title: 'Banilad Campus餐厅',
      description:
        '官方资料列出可容纳约150人的Dining Area，适合想把学习、住宿和三餐集中在校区内完成的学生。',
      src: 'https://images.wegoedu.com.tw/2026/01/CG2-Banilad%E8%8F%B2%E5%BE%8B%E8%B3%93%E8%AA%9E%E8%A8%80%E5%AD%B8%E6%A0%A1-Cafeteria-2.jpg',
    },
    {
      category: '校区',
      title: '泳池与公共休息区',
      description:
        'Banilad Campus保留CG系统化学习管理，也比Sparta校区更适合想保留一点城市生活弹性的学生。',
      src: 'https://www.ryugaku-onebridge.com/api/pict/5104',
    },
    {
      category: '住宿',
      title: '宿舍房间参考',
      description:
        '官方说明宿舍有单人、双人、三人、四人房，房内配备浴室、淋浴、热水和免费Wi-Fi。',
      src: 'https://www.fujiyama-international.com/archives/004/202210/245545c4d64a30eba2906397ff111a0a.jpg',
    },
    {
      category: '生活',
      title: 'CG Banilad学习生活场景',
      description:
        '适合想在市区半斯巴达学校里稳定学习，同时需要餐饮、超市、商场和按摩等生活资源的人。',
      src: 'https://cdn.imweb.me/upload/S202206094a7690a695e75/00381e1d566c6.png',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务CG Academy（Banilad Campus）' },
    { label: '英文名称', value: 'CG Academy Banilad Campus / Cebu Globalization Academy' },
    {
      label: '地址',
      value: 'Base Camp, Maria Luisa Road, Banilad, Cebu City 6000, Philippines',
    },
    {
      label: '学校定位',
      value: '宿务市区半斯巴达型语言学校，覆盖ESL、IELTS、TOEIC、Business与Family课程。',
    },
    { label: '公开容量', value: '官方Banilad页面列示学生容量约275名。' },
    {
      label: '住宿房型',
      value: '校内、Alicia校外、88th Avenue三类住宿，各有单人、双人、三人、四人房。',
    },
    {
      label: '4周起价',
      value: '原价1,400美元：Light ESL + 4人房 + 注册费；思达9折后1,270美元，符合淡季活动再减150美元。',
    },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://www.cebucg.com/en/img/school_08_b.jpg',
      title: '比Sparta更有城市生活弹性',
      text: 'Banilad Campus保留单词、作文、选修和小班课等学习推动，但整体更适合想住市区、周边生活便利的学生。',
    },
    {
      image: '/assets/philippines/cg-banilad-campus-hero.jpg',
      title: '课程选择很完整',
      text: 'Light、General、Intensive、Power、Semi-Sparta、IELTS、TOEIC、Business、Family都能在同一校区比较。',
    },
    {
      image: 'https://images.wegoedu.com.tw/2026/01/CG2-Banilad%E8%8F%B2%E5%BE%8B%E8%B3%93%E8%AA%9E%E8%A8%80%E5%AD%B8%E6%A0%A1-Cafeteria-2.jpg',
      title: '美元费用结构清楚',
      text: '2026价目表将注册费、4周学费、住宿费和3周短期比例分开列示，适合提前做预算。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想住在宿务市区生活圈',
      text: '比Mactan海边学校更偏城市生活，适合需要商场、餐厅、超市、按摩等周边资源的学生。',
    },
    {
      title: '想要半斯巴达，但不想太硬',
      text: '如果CG Sparta太严格，Banilad Campus可以作为更平衡的CG系选择。',
    },
    {
      title: '正在比较亲子、商务或考试课程',
      text: 'Family Junior、Guardian、IELTS Basic、TOEIC和Business都在公开价目表内，方便一次比较。',
    },
  ];

  readonly lessSuitableFor: FitItem[] = [
    {
      title: '想要海边度假感',
      text: 'Banilad是市区校区，不是海景或度假村路线；可同步比较Cebu Blue Ocean、Genius或CIA。',
    },
    {
      title: '完全不想被学习制度推动',
      text: 'Semi-Sparta课程有单词测试、作文和选修课节奏；若想纯自由，可比较GLANT或3D Academy。',
    },
    {
      title: '预算只看课程住宿主费',
      text: '课程、住宿与注册费以美元计算，当地费用以菲律宾比索支付，需要把两部分一起纳入预算。',
    },
  ];

  readonly courses: CourseOption[] = [
    {
      id: 'light-esl',
      name: 'Light ESL',
      type: '轻量口语',
      lessons: '一对一4节 + 选修2节',
      suitable: '想保留自习、工作或陪读时间的成人学生。',
      tuitionUsd: 650,
    },
    {
      id: 'general-esl',
      name: 'General ESL',
      type: '标准ESL',
      lessons: '一对一4节 + 小组课2节 + 选修2节',
      suitable: '第一次菲律宾游学、想平衡口语和小班互动的学生。',
      tuitionUsd: 700,
    },
    {
      id: 'intensive-esl',
      name: 'Intensive ESL',
      type: '强化ESL',
      lessons: '一对一5节 + 小组课1节 + 选修2节',
      suitable: '想提高一对一比例、短期冲刺口语输出的学生。',
      tuitionUsd: 750,
    },
    {
      id: 'power-esl',
      name: 'Power ESL',
      type: '高一对一',
      lessons: '一对一6节 + 选修2节',
      suitable: '想把每天主要时间都放在一对一纠错和输出的人。',
      tuitionUsd: 800,
    },
    {
      id: 'semi-sparta',
      name: 'Semi-Sparta',
      type: '半斯巴达',
      lessons: '一对一4节 + 小组课4节 + 单词测试（强制）+ 选修1节（强制）+ 选修2节',
      suitable: '希望学习节奏更紧、但仍保留市区生活弹性的学生。',
      tuitionUsd: 800,
    },
    {
      id: 'premier-semi-sparta',
      name: 'Premier Semi-Sparta',
      type: '高阶半斯巴达',
      lessons: '一对一5节 + 小组课3节 + 单词测试（强制）+ 选修1节（强制）+ 选修2节',
      suitable: '想提高一对一比例，同时保留半斯巴达管理的人。',
      tuitionUsd: 850,
    },
    {
      id: 'ielts-basic',
      name: '雅思基础',
      type: '雅思备考',
      lessons: '一对一4节（雅思、ESL）+ 团体课4节（雅思、ESL）+ 单词测试（强制）+ 选修1节（强制）+ 选修2节',
      suitable: '准备进入雅思学习，但还需要基础英文支撑的学生。',
      tuitionUsd: 850,
    },
    {
      id: 'toeic',
      name: '托业基础',
      type: '托业备考',
      lessons: '一对一4节（托业 3节 + ESL 1节）+ 团体课4节（托业 2节 + ESL 2节）+ 单词测试（强制）+ 选修1节（强制）+ 选修2节',
      suitable: '以托业分数、求职或升学要求为目标的学生。',
      tuitionUsd: 850,
    },
    {
      id: 'business',
      name: 'Business English',
      type: '商务英文',
      lessons: '一对一4节 + 小组课4节 + 晚课或自习1节 + 词汇测试1节 + 自习2节',
      suitable: '需要会议、简报、邮件和职场沟通英文的成人学生。',
      tuitionUsd: 850,
    },
    {
      id: 'guardian',
      name: 'Family ESL（监护人）',
      type: '亲子陪读',
      lessons: '一对一4节',
      suitable: '陪同孩子游学，同时想安排轻量英文学习的家长。',
      tuitionUsd: 750,
    },
    {
      id: 'junior',
      name: 'Family ESL（青少年）',
      type: '青少年亲子',
      lessons: '一对一4节 + 小组课2节',
      suitable: '小学、初中、高中学生配合监护人同行。',
      tuitionUsd: 1150,
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'quad', name: 'Banilad 4人房', feeUsd: 650, note: '校内预算最低房型。' },
    { id: 'triple', name: 'Banilad 3人房', feeUsd: 700, note: '校内多人房，兼顾预算与舒适度。' },
    { id: 'twin', name: 'Banilad 2人房', feeUsd: 750, note: '校内双人房，适合朋友同行。' },
    { id: 'single', name: 'Banilad 1人房', feeUsd: 1000, note: '校内隐私最高，旺季建议提前确认。' },
    { id: 'alicia-quad', name: 'Alicia校外4人房', feeUsd: 850, note: '校外住宿，距离校区步行约3分钟。' },
    { id: 'alicia-triple', name: 'Alicia校外3人房', feeUsd: 900, note: '校外住宿，距离校区步行约3分钟。' },
    { id: 'alicia-twin', name: 'Alicia校外2人房', feeUsd: 1000, note: '校外住宿，距离校区步行约3分钟。' },
    { id: 'alicia-single', name: 'Alicia校外1人房', feeUsd: 1500, note: '校外单人房，距离校区步行约3分钟。' },
    { id: '88th-quad', name: '88th Avenue 4人房', feeUsd: 1000, note: '邻近原Noble、靠近IT Park，生活便利，提供接送服务。' },
    { id: '88th-triple', name: '88th Avenue 3人房', feeUsd: 1100, note: '邻近原Noble、靠近IT Park，生活便利，提供接送服务。' },
    { id: '88th-twin', name: '88th Avenue 2人房', feeUsd: 1200, note: '邻近原Noble、靠近IT Park，生活便利，提供接送服务。' },
    { id: '88th-single', name: '88th Avenue 1人房', feeUsd: 1700, note: '邻近原Noble、靠近IT Park，生活便利，提供接送服务。' },
  ];

  readonly scheduleItems: ScheduleItem[] = [
    {
      time: 'Morning',
      title: '一对一与小班核心课',
      text: '按课程组合安排Speaking、Listening、Reading、Writing、Grammar、Vocabulary等技能。',
    },
    {
      time: 'Afternoon',
      title: 'ESL / IELTS / TOEIC / Business主题课',
      text: 'General、Intensive、Power、考试和商务课程的课节比例不同，报名前建议按目标筛选。',
    },
    {
      time: 'Evening',
      title: '单词、作文、选修或自习',
      text: 'Semi-Sparta路线会更强调学习推动；Light ESL则留出更多自主安排时间。',
    },
  ];

  readonly processSteps: ProcessStep[] = [
    {
      icon: 'fact_check',
      title: '先确认课程和周数',
      text: '根据口语、雅思、多益、商务或亲子目标，先确定Light、General、Intensive、Power或Semi-Sparta。',
    },
    {
      icon: 'hotel',
      title: '再确认房型空位',
      text: '1人房和2人房更容易紧张，旺季和亲子档期建议尽早锁定。',
    },
    {
      icon: 'receipt_long',
      title: '拆分海外主费与当地费用',
      text: '课程、住宿与注册费用美元计价，当地费用用比索计价，思达会帮你做成一张更直观的总预算。',
    },
    {
      icon: 'flight_land',
      title: '入学前核对接机和材料',
      text: '确认入学日、抵达航班、护照、保险、未成年人材料和学校最新规定。',
    },
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'CG Banilad和CG Sparta怎么选？',
      answer:
        '如果你想要更严格的全日制斯巴达管理，优先看CG Sparta；如果想留在宿务市区，兼顾课程强度和生活便利，Banilad Campus更适合。',
    },
    {
      question: '页面上的费用是否已经包含所有支出？',
      answer:
        '不是。学校费用包含注册费、课程费、住宿费及符合条件的优惠和暑假附加费；SSP、签证、水电、教材等到校学杂费另列预估明细，接机和可退押金不计入学杂费合计。最终以学校确认为准。',
    },
    {
      question: '亲子家庭可以选择Banilad Campus吗？',
      answer:
        '可以。官方资料列出Family Junior和Guardian课程，适合小学、初中、高中学生与监护人同行；具体年龄、房型和开课日需要报名前确认。',
    },
    {
      question: '短期1-3周怎么计算？',
      answer:
        '普通课程3周按4周课程费与住宿费合计的85%计算，另加注册费。1周Short-Term ESL学费370美元，2周学费640美元，住宿与注册费另计。',
    },
  ];

  readonly sideNavItems: SideNavItem[] = [
    { label: '校区亮点', target: 'highlights', icon: 'stars' },
    { label: '课程费用', target: 'courses', icon: 'payments' },
    { label: '快速报价', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'receipt' },
    { label: '资料来源', target: 'sources', icon: 'link' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '图片', target: 'gallery', icon: 'photo_library' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'local-fees', icon: 'receipt_long' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'CG Academy Banilad官方校区页', url: 'https://www.cebucg.com/en/school_b.html' },
    { label: 'CG Academy Banilad官方课程页', url: 'https://cebucg.com/en/course_b.html' },
    { label: 'CG Academy 2026英文电子手册', url: 'https://www.cebucg.com/en/pdf/01.pdf' },
    { label: 'CG Academy 2025当地费用表', url: 'https://www.cebucg.com/kr/pdf/06.pdf' },
    { label: 'CG Banilad 2026韩元版价目表（非本页美元定价依据）', url: 'https://www.cebucg.com/kr/pdf/08.pdf' },
    { label: 'CG Academy官方学校介绍', url: 'https://www.cebucg.com/en/about.html' },
  ];

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

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') {
      return this.galleryImages;
    }

    return this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedCourse(): CourseOption {
    return this.courses.find((course) => course.id === this.selectedCourseId) ?? this.courses[0];
  }

  get selectedRoom(): RoomOption {
    return this.roomOptions.find((room) => room.id === this.selectedRoomId) ?? this.roomOptions[0];
  }

  get fourWeekStudyStayUsd(): number {
    return this.selectedCourse.tuitionUsd + this.selectedRoom.feeUsd;
  }

  get studyStayUsd(): number {
    if (this.selectedWeeks < 4) {
      return this.fourWeekStudyStayUsd * (this.shortTermRatios[this.selectedWeeks] ?? 1);
    }

    const cycles = this.selectedWeeks / 4;
    return this.fourWeekStudyStayUsd * cycles;
  }

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourse.tuitionUsd * this.durationMultiplier;
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.feeUsd * this.durationMultiplier;
  }

  get durationMultiplier(): number {
    return this.selectedWeeks < 4
      ? this.shortTermRatios[this.selectedWeeks] ?? 1
      : this.selectedWeeks / 4;
  }

  get sidaDiscountAmount(): number {
    return this.studyStayUsd * (1 - this.sidaDiscountRate);
  }

  get isOffSeasonEntry(): boolean {
    return this.startDateUtc !== null && this.selectedStartDate >= '2026-08-30' && this.selectedStartDate <= '2026-12-27';
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

  get quoteUsd(): number {
    return Math.max(
      0,
      this.registrationFeeUsd +
        this.studyStayUsd * this.sidaDiscountRate -
        this.offSeasonDiscount -
        this.longStayDiscount +
        this.summerSurcharge,
    );
  }

  get quoteUsdText(): string {
    return this.formatUsd(this.quoteUsd);
  }

  private get startDateUtc(): number | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.selectedStartDate)) return null;
    const value = Date.parse(`${this.selectedStartDate}T00:00:00Z`);
    return Number.isFinite(value) && new Date(value).toISOString().slice(0, 10) === this.selectedStartDate
      ? value : null;
  }

  get summerWeeks(): number {
    const start = this.startDateUtc;
    if (start === null) return 0;
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const summerStart = Date.UTC(2026, 6, 5);
    // Both dates in the supplied school notice are inclusive.
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

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    return `约 ${rounded.toLocaleString('zh-CN')} 元`;
  }

  get exchangeRateText(): string {
    return this.exchangeRateLive && this.exchangeRateDate
      ? `汇率日期 ${this.exchangeRateDate}`
      : '暂按备用汇率估算';
  }

  get fourWeekLightQuadText(): string {
    return this.formatUsd(this.registrationFeeUsd + 650 + 650);
  }

  get weeklyAverageText(): string {
    return this.formatUsd(this.quoteUsd / this.selectedWeeks);
  }

  get selectedWeeksText(): string {
    return `${this.selectedWeeks}周`;
  }

  get quoteNote(): string {
    if (this.selectedWeeks < 4) {
      return '普通课程3周按4周课程费与住宿费合计的85%计算，另加注册费；实际开课日和空房需再确认。';
    }

    return '4周以上按4周单价倍数估算；课程住宿9折，符合条件的淡季与长周期优惠会自动叠加。';
  }

  get localFeePeriods(): number {
    return Math.max(1, Math.ceil(this.selectedWeeks / 4));
  }

  get localFeeEstimateNote(): string {
    return '学杂费均为预估金额，仅供准备比索现金参考，具体以学校及相关部门到校实收为准。' +
      (this.selectedWeeks === 3 ? '3周管理费、电费和水费按4周预估。' : '');
  }

  get visaExtensionCount(): number {
    // Default estimate: the initial visa covers 59 days; each extension covers 30 days.
    const uncoveredStudyDays = Math.max(0, this.selectedWeeks * 7 - 59);
    return Math.ceil(uncoveredStudyDays / 30);
  }

  get visaExtensionFee(): number {
    // CG public table's cumulative fee tiers, indexed by required extensions, not study weeks.
    return [0, 5160, 11550, 16010, 20470, 24930][this.visaExtensionCount] ?? 0;
  }

  get includedLocalFees(): LocalFee[] {
    return this.localFees.filter(fee => !fee.excluded);
  }

  get excludedLocalFees(): LocalFee[] {
    return this.localFees.filter(fee => fee.excluded);
  }

  get localFees(): LocalFee[] {
    const periods = this.localFeePeriods;
    // Default estimate assumes a 59-day visa: charge once only after eight weeks.
    // Earlier processing with a 30-day visa remains a conditional note, not an automatic fee.
    const acrQuantity = this.selectedWeeks > 8 ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', amount: '7,800 比索 / 次', quantity: 1, total: 7800, note: '移民局收取，按报名学习时长办理；续费或换校需重新办理' },
      { item: 'SSP E-CARD', amount: '4,500 比索 / 次', quantity: 1, total: 4500, note: '入学时与SSP同时办理，本次按一次预估；换学校需要携带证明，否则需要重新办理' },
      { item: 'ACR-I CARD 外国人身份证', amount: '4,500 比索 / 次', quantity: acrQuantity, total: 4500 * acrQuantity, note: '按持59天签证预估，学习超过8周计入一次；若持30天签证，约第4周首次续签时可能提前产生，以实际办理为准' },
      { item: '维护管理费', amount: '2,000 比索 / 4周', quantity: periods, total: 2000 * periods, note: '每4周预估1份，具体以学校实收为准' },
      { item: '电费', amount: '2,000 比索 / 4周', quantity: periods, total: 2000 * periods, note: '预估金额；空调或超额用电按学校计量另收，参考25比索/度' },
      { item: '水费', amount: '500 比索 / 4周', quantity: periods, total: 500 * periods, note: '每4周预估1份，具体以学校实收为准' },
      { item: '旅游签证续签', amount: '首次5,160比索；第2次6,390比索；第3–5次4,460比索/次', quantity: this.visaExtensionCount, total: this.visaExtensionFee, note: '按持59天签证预估，学习超过8周才需续签；超出59天的学习天数按每次30天向上取整。若持30天签证，学习超过4周需续签。12/16/20/24周续签费累计预估5,160/11,550/16,010/20,470比索，具体以学校及相关部门实收为准' },
      { item: '书本教材费', amount: '2,000 比索 / 次预估', quantity: 1, total: 2000, note: '先预估2,000比索；不同课程教材不同，按实际购买结算，学完后另购新教材' },
      { item: '宿务马克坦机场接机（可选）', amount: '1,200 比索 / 次', quantity: this.includeAirportPickup ? 1 : 0, total: this.includeAirportPickup ? 1200 : 0, note: '可选择接机，也可自行打车；不计入学杂费合计', excluded: true },
      { item: '押金（可退）', amount: '1,000 比索 / 次预估', quantity: 1, total: 1000, note: '预估1,000比索，具体以学校为准；无损坏或额外扣费时按规定退还，不计入学杂费合计', excluded: true },
    ];
  }

  get localFeesTotal(): number {
    return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0);
  }

  get localFeesCnyText(): string {
    return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`;
  }

  get quoteImageData() {
    const paymentItems: QuoteImagePaymentItem[] = [
      { icon: '注', label: '注册费', amount: this.formatUsd(this.registrationFeeUsd), note: '一次性学校注册费，不参与折扣' },
      { icon: '课', label: '课程费', amount: this.formatUsd(this.tuitionForSelectedWeeks), note: `${this.selectedCourse.name}；${this.selectedCourse.lessons}` },
      { icon: '宿', label: '住宿费', amount: this.formatUsd(this.roomFeeForSelectedWeeks), note: this.selectedRoom.name },
    ];
    const ruleNotes = [
      '仅课程费和住宿费享思达9折，注册费不参与折扣。',
      this.localFeeEstimateNote,
    ];
    if (this.sidaDiscountAmount > 0) paymentItems.push({ icon: '折', label: '思达折扣', amount: '9折', note: `优惠金额：${this.formatUsd(this.sidaDiscountAmount)}`, accent: true });
    if (this.offSeasonDiscount > 0) paymentItems.push({ icon: '淡', label: '淡季优惠', amount: `− ${this.formatUsd(this.offSeasonDiscount)}`, note: this.offSeasonRuleText, accent: true });
    if (this.longStayDiscount > 0) paymentItems.push({ icon: '长', label: '长期优惠', amount: `− ${this.formatUsd(this.longStayDiscount)}`, note: `${this.selectedWeeks}周适用；${this.longStayRuleText}`, accent: true });
    if (this.summerSurcharge > 0) {
      paymentItems.push({ icon: '暑', label: '暑假附加费', amount: this.formatUsd(this.summerSurcharge), note: `${this.summerDateRange}就读；40美元/周/人 × ${this.summerWeeks}周` });
      ruleNotes.push('暑假附加费不打折；按有重叠的学习周计费，不足一周按一周预估，具体以学校为准。');
    }
    if (this.selectedWeeks === 3) ruleNotes.push('3周课程费与住宿费按4周价格的85%折算，再计思达9折。');
    const quote = buildPhilippinesDetailedQuote({
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
      schoolCode: 'CG BANILAD',
      schoolName: '菲律宾宿务CG Academy Banilad校区',
      filePrefix: 'CG-Banilad',
      heroSrc: '/assets/philippines/cg-banilad-campus-hero.jpg',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems,
      localFeeItems: this.includedLocalFees.map((fee) => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal,
      localCurrencyName: '比索',
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: this.localFeeEstimateNote,
      optionalFeeItems: this.excludedLocalFees.map((fee) => ({ label: fee.item, amount: this.formatPhp(fee.total), note: `${fee.amount} × ${fee.quantity}；${fee.note}` })),
      ruleNotes,
    });
    return { ...quote, totalUsd: this.formatUsd(this.quoteUsd) };
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  openDatePicker(input: HTMLInputElement): void {
    try { input.showPicker?.(); } catch { /* Keyboard/manual entry remains available. */ }
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  formatUsd(value: number): string {
    return `${value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })} 美元`;
  }

  formatPhp(value: number): string {
    return `${value.toLocaleString('en-US')} 比索`;
  }
}
