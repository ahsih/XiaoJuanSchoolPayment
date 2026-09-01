import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
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
      value: '校内1/2/3/4人房',
      note: '2026价目表按房型公布4周美元住宿费用。',
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
      value: '校内单人、双人、三人、四人房；房内浴室、淋浴、热水与Wi-Fi。',
    },
    {
      label: '4周起价',
      value: '原价USD 1,400：Light ESL + 4人房 + 注册费；思达9折后USD 1,270，符合淡季活动再减USD 150。',
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
      lessons: '1:1 4节',
      suitable: '想保留自习、工作或陪读时间的成人学生。',
      tuitionUsd: 650,
    },
    {
      id: 'general-esl',
      name: 'General ESL',
      type: '标准ESL',
      lessons: '1:1 4节 + 1:4 2节',
      suitable: '第一次菲律宾游学、想平衡口语和小班互动的学生。',
      tuitionUsd: 700,
    },
    {
      id: 'intensive-esl',
      name: 'Intensive ESL',
      type: '强化ESL',
      lessons: '1:1 5节 + 1:4 1节',
      suitable: '想提高一对一比例、短期冲刺口语输出的学生。',
      tuitionUsd: 750,
    },
    {
      id: 'power-esl',
      name: 'Power ESL',
      type: '高一对一',
      lessons: '1:1 6节',
      suitable: '想把每天主要时间都放在一对一纠错和输出的人。',
      tuitionUsd: 800,
    },
    {
      id: 'semi-sparta',
      name: 'Semi-Sparta',
      type: '半斯巴达',
      lessons: '1:1 4节 + 1:4 4节 + 单词/作文/选修',
      suitable: '希望学习节奏更紧、但仍保留市区生活弹性的学生。',
      tuitionUsd: 800,
    },
    {
      id: 'premier-semi-sparta',
      name: 'Premier Semi-Sparta',
      type: '高阶半斯巴达',
      lessons: '1:1 5节 + 1:4 3节 + 单词/作文/选修',
      suitable: '想提高一对一比例，同时保留半斯巴达管理的人。',
      tuitionUsd: 850,
    },
    {
      id: 'ielts-basic',
      name: 'IELTS Basic',
      type: '雅思基础',
      lessons: '1:1 4节（IELTS 2 + ESL 2）+ 1:4 4节（IELTS 2 + ESL 2）+ 单词测试 + 选修',
      suitable: '准备进入雅思学习，但还需要基础英文支撑的学生。',
      tuitionUsd: 850,
    },
    {
      id: 'toeic',
      name: 'TOEIC Basic',
      type: '多益备考',
      lessons: '1:1 4节（TOEIC 2 + ESL 2）+ 1:4 4节（TOEIC 2 + ESL 2）+ 单词测试 + 选修',
      suitable: '以多益分数、求职或升学要求为目标的学生。',
      tuitionUsd: 850,
    },
    {
      id: 'business',
      name: 'Business English',
      type: '商务英文',
      lessons: '1:1 4节（Business 2 + ESL 2）+ 1:4 4节（外教2 + ESL 2）+ 选修',
      suitable: '需要会议、简报、邮件和职场沟通英文的成人学生。',
      tuitionUsd: 850,
    },
    {
      id: 'guardian',
      name: 'Family ESL (Guardian)',
      type: '亲子陪读',
      lessons: '1:1 4节',
      suitable: '陪同孩子游学，同时想安排轻量英文学习的家长。',
      tuitionUsd: 750,
    },
    {
      id: 'junior',
      name: 'Family ESL (Junior)',
      type: '青少年亲子',
      lessons: '1:1 4节 + 1:4 2节',
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
    { id: '88th-quad', name: '88th Avenue 4人房', feeUsd: 1000, note: '邻近88th Avenue，生活便利并提供接送服务。' },
    { id: '88th-triple', name: '88th Avenue 3人房', feeUsd: 1100, note: '邻近88th Avenue，生活便利并提供接送服务。' },
    { id: '88th-twin', name: '88th Avenue 2人房', feeUsd: 1200, note: '邻近88th Avenue，生活便利并提供接送服务。' },
    { id: '88th-single', name: '88th Avenue 1人房', feeUsd: 1700, note: '邻近88th Avenue，生活便利并提供接送服务。' },
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
      text: '课程、住宿与注册费用USD，当地费用用PHP，思达会帮你做成一张更直观的总预算。',
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
        '不是。页面报价器只计算2026美元价目表里的注册费、学费和住宿费；SSP、签证、水电、押金、教材、接机和个人消费等菲律宾当地费用另计。',
    },
    {
      question: '亲子家庭可以选择Banilad Campus吗？',
      answer:
        '可以。官方资料列出Family Junior和Guardian课程，适合小学、初中、高中学生与监护人同行；具体年龄、房型和开课日需要报名前确认。',
    },
    {
      question: '短期1-3周怎么计算？',
      answer:
        '普通课程3周按4周课程费与住宿费合计的85%计算，另加注册费。1周Short-Term ESL学费USD 370，2周学费USD 640，住宿与注册费另计。',
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
    { label: 'CG Banilad 2026官方价目表', url: 'https://www.cebucg.com/kr/pdf/08.pdf' },
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

  get quoteUsd(): number {
    return Math.max(
      0,
      this.registrationFeeUsd +
        this.studyStayUsd * this.sidaDiscountRate -
        this.offSeasonDiscount -
        this.longStayDiscount,
    );
  }

  get quoteUsdText(): string {
    return this.formatUsd(this.quoteUsd);
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

  get visaExtensionCount(): number {
    return Math.max(0, Math.ceil((this.selectedWeeks - 4) / 4));
  }

  get localFees(): LocalFee[] {
    const periods = this.localFeePeriods;
    const acrQuantity = this.selectedWeeks > 8 ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', amount: 'PHP 7,800 / 次', quantity: 1, total: 7800, note: '移民局收取，按报名学习时长办理；续费或换校需重新办理' },
      { item: 'SSP E-CARD', amount: 'PHP 4,500 / 次', quantity: 1, total: 4500, note: '入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I CARD 外国人身份证', amount: 'PHP 4,500 / 次', quantity: acrQuantity, total: 4500 * acrQuantity, note: '长周期学习或首次续签时通常需要办理' },
      { item: '维护管理费', amount: 'PHP 2,000 / 4周', quantity: periods, total: 2000 * periods, note: '校内设施维护费用，按每4周计算' },
      { item: '电费', amount: 'PHP 2,000 / 4周', quantity: periods, total: 2000 * periods, note: '预估费用，超出部分按PHP 25/kW另收' },
      { item: '水费', amount: 'PHP 500 / 4周', quantity: periods, total: 500 * periods, note: '按每4周计算' },
      { item: '签证续签', amount: 'PHP 5,160 / 次', quantity: this.visaExtensionCount, total: 5160 * this.visaExtensionCount, note: '首次续签费用预估；实际按移民局及停留时长收取' },
      { item: '书本教材费', amount: 'PHP 2,000 / 4周', quantity: periods, total: 2000 * periods, note: '按课程和实际购买教材调整' },
      { item: '宿务马克坦机场接机', amount: 'PHP 1,200 / 次', quantity: 0, total: 1200, note: '可选，也可自行打车；不计入学杂费合计', excluded: true },
      { item: '房间押金', amount: 'PHP 250 / 周', quantity: this.selectedWeeks, total: 250 * this.selectedWeeks, note: '无损坏及欠费时按学校规则退还；不计入学杂费合计', excluded: true },
    ];
  }

  get localFeesTotal(): number {
    return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0);
  }

  get localFeesCnyText(): string {
    return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`;
  }

  get quoteImageData() {
    const includedFees = this.localFees.filter((fee) => !fee.excluded);
    const optionalFees = this.localFees.filter((fee) => fee.excluded);
    return buildPhilippinesDetailedQuote({
      schoolCode: 'CG BANILAD',
      schoolName: '菲律宾宿务CG Academy Banilad校区',
      filePrefix: 'CG-Banilad',
      heroSrc: '/assets/philippines/cg-banilad-campus-hero.jpg',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems: [
        { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationFeeUsd).replace('USD ', '')} 美元`, note: '一次性学校注册费；保留且不参与9折' },
        { icon: '课', label: '课程费', amount: `${this.formatUsd(this.tuitionForSelectedWeeks).replace('USD ', '')} 美元`, note: `${this.selectedCourse.name}；以上单价以4周为基准` },
        { icon: '宿', label: '住宿费', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks).replace('USD ', '')} 美元`, note: this.selectedRoom.name },
        { icon: '折', label: '思达折扣', amount: '9折', note: `仅课程费和住宿费，优惠${this.formatUsd(this.sidaDiscountAmount).replace('USD ', '')}美元`, accent: true },
        { icon: '淡', label: '淡季优惠', amount: `- ${this.formatUsd(this.offSeasonDiscount).replace('USD ', '')} 美元`, note: '2026/8/30-12/27入学，每满4周优惠USD 150' },
        { icon: '长', label: '长周期优惠', amount: `- ${this.formatUsd(this.longStayDiscount).replace('USD ', '')} 美元`, note: '12/16/20/24周分别优惠USD 50/100/150/200' },
      ],
      localFeeItems: includedFees.map((fee) => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal,
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: '接机和可退房间押金单独列示，实际以到校缴费为准。',
      optionalFeeItems: optionalFees.map((fee) => ({ label: fee.item, amount: this.formatPhp(fee.total), note: fee.note })),
      ruleNotes: [
        '课程费和住宿费按思达9折计算；注册费USD 100保留且不参与折扣。',
        '淡季优惠按每满4周计算；12周以上长周期优惠自动叠加。',
      ],
    });
  }

  get courseFeeRows() {
    return this.courses.map((course) => ({
      course: course.name,
      lessons: course.lessons,
      quad: this.formatUsd(this.registrationFeeUsd + course.tuitionUsd + this.roomOptions[0].feeUsd),
      triple: this.formatUsd(this.registrationFeeUsd + course.tuitionUsd + this.roomOptions[1].feeUsd),
      twin: this.formatUsd(this.registrationFeeUsd + course.tuitionUsd + this.roomOptions[2].feeUsd),
      single: this.formatUsd(this.registrationFeeUsd + course.tuitionUsd + this.roomOptions[3].feeUsd),
    }));
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  formatUsd(value: number): string {
    return `USD ${value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    })}`;
  }

  formatPhp(value: number): string {
    return `PHP ${value.toLocaleString('en-US')}`;
  }
}
