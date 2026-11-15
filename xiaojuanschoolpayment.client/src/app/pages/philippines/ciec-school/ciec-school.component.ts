import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CiecQuoteCalculatorComponent } from './ciec-quote-calculator.component';
import { CIEC_COURSES, CIEC_ROOMS, CIEC_LOCAL_REFERENCE } from './ciec-quote';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';

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
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SidaWhySectionComponent, CiecQuoteCalculatorComponent],
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
      note: '学校确认四周住宿费：双人间930美元，三人间850美元。',
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
    { label: '4周起价', value: '幼儿园＋三人房＋新生注册费：1905美元／4周；淡季家庭优惠按条件另算。' },
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

  readonly courses: CourseOption[] = CIEC_COURSES.map(course => ({
    id: course.id, name: course.name, type: course.id.startsWith('guardian') || course.id === 'none' ? '家长／监护人' : '儿童与青少年',
    lessons: course.details, suitable: '', tuitionUsd: course.price,
  }));
  readonly roomOptions: RoomOption[] = CIEC_ROOMS.map(room => ({ id: room.id, name: room.name, feeUsd: room.price, note: room.details }));
  readonly localFees: LocalFee[] = CIEC_LOCAL_REFERENCE;

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
      text: '报价分别列示美元费用及比索本地费用；电费按实际用量、教材按实际购买结算，可退押金和个人消费另计。',
    },
    {
      title: '短期报价可以直接导出吗？',
      text: '一周价格尚未确认；短期本地费用须学校确认后才可导出完整报价。新生注册费每人100美元，老学员免费。',
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

  get fourWeekGuardianTripleText(): string { return this.formatUsd(100 + (700 + 850) * .95); }
  get fourWeekJuniorTripleText(): string { return this.formatUsd(100 + (1050 + 850) * .95); }

  get courseFeeRows() {
    return this.courses.filter(course => course.id !== 'none').map((course) => ({
      course: course.name,
      lessons: course.lessons,
      triple: this.formatUsd(this.registrationFeeUsd + (course.tuitionUsd + 850) * .95 + (course.id === 'cidec' ? 2850 : 0)),
      twin: this.formatUsd(this.registrationFeeUsd + (course.tuitionUsd + 930) * .95 + (course.id === 'cidec' ? 2850 : 0)),
    }));
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  formatUsd(value: number): string {
    return `${value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}美元`;
  }
}
