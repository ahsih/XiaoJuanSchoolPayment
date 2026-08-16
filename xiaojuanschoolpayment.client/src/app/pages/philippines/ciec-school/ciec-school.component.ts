import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';
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

interface BasicInfoRow {
  label: string;
  value: string;
}

interface TextCard {
  title: string;
  text: string;
}

interface LocalFee {
  item: string;
  amount: string;
  note: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
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
  selector: 'app-ciec-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ciec-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './ciec-school.component.css',
  ],
})
export class CiecSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFeeUsd = 100;
  readonly pickupUsd = 20;
  readonly guardianCareUsd = 300;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  readonly shortTermRatios: Partial<Record<WeekOption, number>> = {
    1: 0.35,
    2: 0.5,
    3: 0.75,
  };
  readonly peakShortTermRatios: Partial<Record<WeekOption, number>> = {
    1: 0.4,
    2: 0.6,
    3: 0.75,
  };

  selectedCourseId = 'junior-academic';
  selectedRoomId = 'triple';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  isPeakSeason = false;
  includeGuardianCare = false;
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'family_restroom',
      label: '学校定位',
      value: '宿务亲子与青少年专门校',
      note: '主轴是Kindergarten、Junior Academic、Junior Sparta、国际学校准备和陪读家长课程。',
    },
    {
      icon: 'location_city',
      label: '所在区域',
      value: 'Talamban / Cebu City',
      note: '官方资料列出Cebu Center位于Minoza Street, Barangay Tigbao, Talamban。',
    },
    {
      icon: 'groups',
      label: '适合年龄',
      value: '亲子4岁起，单独留学9岁起',
      note: '公开资料显示Kindergarten主要面向48个月至6岁儿童。',
    },
    {
      icon: 'menu_book',
      label: '课程结构',
      value: '45分钟课节，一对一+小班',
      note: 'Junior Academic为1:1四节+小班三节，Sparta增加小班和自习。',
    },
    {
      icon: 'bed',
      label: '住宿',
      value: '2人房 / 3人房',
      note: '2026公开价目表列出4周住宿费：2人房USD 930，3人房USD 850。',
    },
    {
      icon: 'pool',
      label: '设施',
      value: '泳池 / 自习室 / 食堂 / 宿舍',
      note: '公开资料显示有泳池、自习室、校园宿舍、食堂和生活支持。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校区',
      title: 'CIEC校园入口与校舍',
      description: 'CIEC位于宿务Talamban教育区，主打青少年与亲子游学管理。',
      src: 'https://file.hstatic.net/200000456083/file/tham-quan-truong-anh-ngu-ciec-tai-cebu_88fb4e8e067c49e28c36a7212cee13f5_1024x1024.png',
    },
    {
      category: '校区',
      title: '校园中庭与黄色连廊',
      description: '低层校舍围绕中庭展开，适合青少年住宿学习的集中式校园。',
      src: 'https://www.fujiyama-international.com/archives/001/202407/c846e30d107cdc792ee2464f2b36e864.jpg',
    },
    {
      category: '住宿',
      title: '校内三人房参考',
      description: '公开资料显示宿舍配备床、桌椅、空调、淋浴、厕所和储物空间。',
      src: 'https://www.fujiyama-international.com/archives/004/202407/4a8392a52bff622fcc97a5c89277a35d.jpg',
    },
    {
      category: '住宿',
      title: '校内双人房参考',
      description: 'CIEC住宿以2人房和3人房为主，亲子家庭可按人数和预算选择。',
      src: 'https://www.fujiyama-international.com/archives/004/202405/c686ba5bedbbc8122113e4df122bcd67.jpg',
    },
    {
      category: '教室',
      title: 'CIEC授课场景',
      description: '青少年课程强调一对一、小班、英文日记、词汇、自习与学术基础。',
      src: 'https://storage.googleapis.com/world-study-prod/media/school_photo/1932/c6eb81f0-45ee-4373-aad7-ed947262e322.JPG',
    },
    {
      category: '生活',
      title: '亲子与青少年学习生活',
      description: 'CIEC适合需要安全管理、学习监督、餐食住宿和周末活动安排的家庭。',
      src: 'https://www.philja.com/school/sch_img/ciec/main4.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务CIEC' },
    { label: '英文名称', value: 'CIEC Global Education Center / Cebu Ivy Education Center' },
    { label: '地址', value: 'Minoza Street, Barangay Tigbao, Talamban, Cebu City, Philippines' },
    { label: '学校定位', value: '青少年、亲子、国际学校准备、Junior Sparta与陪读家长英文课程。' },
    { label: '公开规模', value: '公开资料显示学生定员约140名，韩资运营。' },
    { label: '课节长度', value: '1节45分钟；课程组合按年龄、目标和是否陪读调整。' },
    { label: '4周起价', value: 'USD 1,650起：Guardian ESL + 3人房 + 注册费；儿童课程通常USD 2,000起。' },
  ];

  readonly highlights: TextCard[] = [
    {
      title: '亲子与青少年路线更清楚',
      text: 'CIEC不是普通成人ESL学校，课程设计更偏孩子英语基础、学习习惯、学术英文和升学准备。',
    },
    {
      title: '可以做国际学校前置准备',
      text: 'School Preparation、Overseas School和CIDEC路线适合准备进入英文授课学校或补学术科目的家庭。',
    },
    {
      title: '家长课程也能一起安排',
      text: '陪读家长可选Guardian ESL、Business或IELTS课程，也可以按季节和孩子年龄确认是否只住宿陪读。',
    },
  ];

  readonly suitableFor: TextCard[] = [
    {
      title: '孩子年龄较小，需要强照顾',
      text: '幼儿园和小学生更需要生活管理、餐食、住宿、安全与学习节奏，CIEC的定位更贴近这一需求。',
    },
    {
      title: '想把英文学习和学术准备结合',
      text: '除了口语，还有数学、科学、演讲、面试、写作和国际学校入学准备方向。',
    },
    {
      title: '计划中长期亲子游学',
      text: '12周以上、国际学校衔接、陪读家长课程和菲律宾正规课程路线都适合提前规划。',
    },
  ];

  readonly lessSuitableFor: TextCard[] = [
    {
      title: '成人只想短期练口语',
      text: 'CIEC不是成人社交型或商务型主轴学校，成人单独游学可优先比较CIA、I.BREEZE、3D或GLANT。',
    },
    {
      title: '想要海边度假氛围',
      text: 'CIEC位于Talamban教育区，优势是学习管理和亲子照顾，不是海景度假校区。',
    },
    {
      title: '需要非常自由的作息',
      text: '未成年人管理、门禁和外出规则会比一般成人学校严格，报名前要确认孩子和家长是否接受。',
    },
  ];

  readonly courses: CourseOption[] = [
    {
      id: 'kindergarten',
      name: 'Kindergarten',
      type: '幼儿英文',
      lessons: '小班3节 + 1:1 2节 + 午休',
      suitable: '48个月至6岁，适合亲子家庭低龄孩子。',
      tuitionUsd: 1050,
    },
    {
      id: 'junior-academic',
      name: 'Junior Academic',
      type: '青少年学术英文',
      lessons: '1:1 4节 + 小班3节',
      suitable: '想打英文基础、阅读写作和学术科目准备的学生。',
      tuitionUsd: 1100,
    },
    {
      id: 'junior-sparta',
      name: 'Junior Sparta',
      type: '青少年斯巴达',
      lessons: '1:1 4节 + 小班4节 + 自习1节',
      suitable: '单独留学或想要更强学习管理的青少年。',
      tuitionUsd: 1400,
    },
    {
      id: 'junior-ielts-toefl',
      name: 'Junior IELTS / TOEFL',
      type: '考试准备',
      lessons: '1:1 4节 + 小班3节',
      suitable: '准备雅思、托福或未来英语升学考试的青少年。',
      tuitionUsd: 1400,
    },
    {
      id: 'school-preparation',
      name: 'School Preparation',
      type: '国际学校入学准备',
      lessons: '1:1 6节 + 自习',
      suitable: '准备进入宿务国际学校或私立学校的学生。',
      tuitionUsd: 1400,
    },
    {
      id: 'overseas-school',
      name: 'Overseas School',
      type: '本地学校通学',
      lessons: '当地学校 + 晚间1:1 3节',
      suitable: '想体验英文授课学校并由CIEC做课后辅导的家庭。',
      tuitionUsd: 1100,
    },
    {
      id: 'guardian-esl',
      name: 'Guardian ESL',
      type: '陪读家长英文',
      lessons: '1:1 3节',
      suitable: '陪读家长想轻量学习日常英文。',
      tuitionUsd: 700,
    },
    {
      id: 'guardian-business-ielts',
      name: 'Guardian Business / IELTS',
      type: '陪读家长进阶',
      lessons: '1:1 3节',
      suitable: '陪读家长想学商务英文或雅思。',
      tuitionUsd: 800,
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'triple', name: '3人房', feeUsd: 850, note: '4周住宿费较低，适合亲子家庭或预算优先。' },
    { id: 'twin', name: '2人房', feeUsd: 930, note: '空间与安静度更好，4周比3人房高USD 80。' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 100', note: '注册时一次性支付。' },
    { item: '机场接机', amount: 'USD 20 / 单程', note: '往返接送公开参考为USD 40。' },
    { item: 'Guardian Care', amount: 'USD 300 / 4周', note: '需要密切管理时按学校规则确认是否适用。' },
    { item: '宿舍押金', amount: 'PHP 5,000 或 USD 100', note: '退房时按学校规则结算。' },
    { item: 'SSP', amount: 'PHP 8,000', note: 'Special Student Permit，菲律宾合法学习许可。' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: 'SSP相关卡证费用。' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '公开资料列示59日以上停留适用。' },
    { item: '教材费', amount: 'PHP 600-1,500 / 4周起', note: '一对一教材按实际购买教材不同。' },
    { item: '水电管理', amount: 'PHP 23/kw + 3,600/4周', note: '电费按用量，光热费PHP 2,400/4周，水费PHP 1,200/4周。' },
    { item: '签证延长', amount: 'PHP 4,800起', note: '8周起按停留长度递增。' },
  ];

  readonly scheduleItems: ScheduleItem[] = [
    {
      time: 'Daytime',
      title: '上午至下午：一对一、小班与学术课',
      text: '课程按孩子年龄与目标组合，常见安排包括Speaking、Reading、Writing、Vocabulary、Grammar、Math和Science。',
    },
    {
      time: 'Evening',
      title: '傍晚以后：自习、作业和辅导',
      text: 'Junior Sparta、School Preparation和Overseas School更强调晚间复习、作业指导和学习习惯建立。',
    },
    {
      time: 'Weekend',
      title: '周末：活动与生活适应',
      text: '公开资料提到周末旅行、志愿活动和各类活动，实际安排以学校当期日程为准。',
    },
  ];

  readonly faqs: TextCard[] = [
    {
      title: 'CIEC适合成人单独游学吗？',
      text: '不太是主力方向。CIEC最适合亲子、青少年、国际学校准备和陪读家庭；成人单独短期ESL建议同步比较其他成人学校。',
    },
    {
      title: '页面报价是否包含所有费用？',
      text: '不是。报价器只估算学费、住宿费、注册费和可选Guardian Care；SSP、签证、押金、水电、教材、接送、活动、机票和保险另计。',
    },
    {
      title: '1-3周短期怎么计算？',
      text: '公开价目表显示淡季按4周费用的35%/50%/75%计算1/2/3周，旺季1月、2月、7月、8月按40%/60%/75%计算。',
    },
    {
      title: 'CIEC和CIA怎么选？',
      text: 'CIA更像大型综合半斯巴达校区；CIEC更偏孩子和家庭，适合需要生活管理、学术英文和国际学校准备的家庭。',
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
    { label: 'CIEC官方首页', url: 'https://ciecglobal.com/' },
    { label: 'CIEC官方FAQ', url: 'https://ciecglobal.com/community/faq/' },
    { label: 'CIEC官方Junior Camp介绍', url: 'https://ciecglobal.com/managed-program/ciec-junior-camp/' },
    { label: 'Fujiyama CIEC 2026费用与基本数据', url: 'https://www.fujiyama-international.com/philippines/ciec.html' },
    { label: '菲律宾留学中心CIEC课程与宿舍资料', url: 'https://www.ph-ryugaku.com/school/ciec/' },
    { label: 'Philippines留学PRO CIEC课程费用', url: 'https://www.pro-japan.jp/school/140/course/' },
  ];

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
      const ratios = this.isPeakSeason ? this.peakShortTermRatios : this.shortTermRatios;
      return Math.round(this.fourWeekStudyStayUsd * (ratios[this.selectedWeeks] ?? 1));
    }

    return this.fourWeekStudyStayUsd * (this.selectedWeeks / 4);
  }

  get quoteUsd(): number {
    return (
      this.registrationFeeUsd +
      this.pickupUsd +
      this.studyStayUsd +
      (this.includeGuardianCare ? this.guardianCareUsd * (this.selectedWeeks / 4) : 0)
    );
  }

  get quoteUsdText(): string {
    return this.formatUsd(this.quoteUsd);
  }

  get fourWeekGuardianTripleText(): string {
    return this.formatUsd(this.registrationFeeUsd + 700 + 850);
  }

  get fourWeekJuniorTripleText(): string {
    return this.formatUsd(this.registrationFeeUsd + 1050 + 850);
  }

  get weeklyAverageText(): string {
    return this.formatUsd(Math.round(this.quoteUsd / this.selectedWeeks));
  }

  get quoteNote(): string {
    if (this.selectedWeeks < 4) {
      return this.isPeakSeason
        ? '已按旺季短期比例估算；旺季为1月、2月、7月、8月。'
        : '已按淡季短期比例估算；当地PHP费用仍需另计。';
    }

    return '4周以上按4周学费住宿倍数估算；当地PHP费用、活动、保险、机票和个人消费另计。';
  }

  get courseFeeRows() {
    return this.courses.map((course) => ({
      course: course.name,
      lessons: course.lessons,
      triple: this.formatUsd(this.registrationFeeUsd + course.tuitionUsd + this.roomOptions[0].feeUsd),
      twin: this.formatUsd(this.registrationFeeUsd + course.tuitionUsd + this.roomOptions[1].feeUsd),
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
    return `USD ${value.toLocaleString('en-US')}`;
  }
}
