import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12 | 24;

interface SnapshotCard { icon: string; title: string; text: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; text: string; src: string; }
interface CourseItem { icon: string; name: string; lessons: string; suitable: string; }
interface FeePackage { id: string; category: string; course: string; room: string; lessons: string; prices: Record<WeekOption, number>; note: string; }
interface FeeSummaryRow { course: string; lessons: string; room: string; price4Weeks: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface FitItem { title: string; text: string; }
interface SourceLink { label: string; url: string; }
interface SideNavItem { label: string; target: string; icon: string; }

@Component({
  selector: 'app-three-d-academy-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './three-d-academy-school.component.html',
  styleUrl: './three-d-academy-school.component.css',
})
export class ThreeDAcademySchoolComponent {
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 24];
  readonly registrationFeeUsd = 100;
  selectedWeeks: WeekOption = 4;
  selectedPackageId = 'practical-sextuple';
  selectedStartDate = '2026-09-07';
  selectedGalleryCategory: GalleryCategory = '全部';
  quoteCalculated = false;

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '生活'];

  readonly snapshotCards: SnapshotCard[] = [
    { icon: 'location_on', title: 'JY Square市中心位置', text: '学校位于Lahug的JY Square商业区，教室、宿舍、餐厅和日常生活设施集中，通勤成本低。' },
    { icon: 'payments', title: '宿务高性价比', text: '官方2026说明仍把3D定位为宿务性价比突出的学校，4周食宿主价可从USD 1,156起。' },
    { icon: 'record_voice_over', title: '一对一课时充足', text: 'Practical ESL每周35节课，其中20节为一对一；也可选择更高一对一比例的Intensive、Platinum或Power MTM。' },
    { icon: 'groups', title: '多国籍环境', text: '官方资料列出日本、韩国、台湾、中国、俄罗斯、中东、欧洲等来源学生，适合想提高英文使用频率的人。' },
    { icon: 'restaurant', title: '三餐与洗衣打包', text: '多数食宿方案包含课程、住宿、每日三餐、洗衣、清洁、Wi-Fi和健身房使用。' },
    { icon: 'directions_walk', title: 'Walk-in通学方案', text: '如果学生自己安排住宿，可以选择Walk-in课程，保留上课和学校设施，预算更灵活。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校区',
      title: 'JY Square校区外观',
      text: '3D Academy位于JY Square商业区内，周边超市、餐饮、咖啡、按摩和交通资源集中。',
      src: 'https://ryugakujp.com/wp-content/uploads/2025/04/IMG_7810.jpeg',
    },
    {
      category: '教室',
      title: '小组课堂空间',
      text: 'Practical ESL、考试、商务和讨论课程会结合一对一与小组课，重视真实沟通。',
      src: 'https://cebu21.jp/2017/assets/img/school/3d/5-03.jpg',
    },
    {
      category: '住宿',
      title: '新型多人宿舍',
      text: '官方住宿页列有单人、双人、三人、新三人、四人和六人房等不同预算选择。',
      src: 'https://3d-universal.com/en/wp-content/uploads/2025/05/IMG_20240531_165228-1-1024x768-1.jpg',
    },
    {
      category: '生活',
      title: '餐厅与自习氛围',
      text: '食宿方案包含三餐，官方2026说明提到餐食已升级为自助餐形式。',
      src: 'https://cdn.amebaowndme.com/madrid-prd/madrid-web/images/sites/381181/723cd9f0808ab12ed8414b9978210b23_86362d849a01e249620b5242db4a7f60.png?width=960',
    },
    {
      category: '住宿',
      title: '双人住宿参考',
      text: '房间通常配有床、桌椅、冰箱、空调、冷热水淋浴、Wi-Fi和基本家具。',
      src: 'https://estatic.languagecourse.net/images/schools/thumbs_school_page_slider/3d-universal-english-institute-cebu-city_15917926401417.jpg',
    },
    {
      category: '校区',
      title: '市中心商业楼校区',
      text: '校区在商业楼内，安全、生活便利是3D Academy长期被选择的重要原因。',
      src: 'https://schoolaplus.com/img/school_photo/3D/3d%20academy.jpg',
    },
  ];

  readonly courses: CourseItem[] = [
    { icon: 'menu_book', name: 'Practical ESL', lessons: '一对一4 + 小组3 + 选修2', suitable: '3D标准课程，费用最低、课时均衡，适合第一次宿务游学和综合口语提升。' },
    { icon: 'bolt', name: 'Intensive ESL', lessons: '一对一5 + 小组3 + 选修2', suitable: '想提高一对一课时，但仍保留小组互动和同学交流的学生。' },
    { icon: 'workspace_premium', name: 'Platinum ESL / Power MTM', lessons: '一对一6-7 + 小组/选修', suitable: '短期想最大化一对一练习、准备面试、发表或高强度口语输出的人。' },
    { icon: 'task_alt', name: 'TOEIC / IELTS / TOEFL', lessons: '考试一对一2 + 考试小组2 + ESL3 + 选修', suitable: '需要考试方向、分数目标、模拟训练和解题策略的学生。' },
    { icon: 'business_center', name: 'Business English', lessons: '商务一对一4或5 + 小组/选修', suitable: '适合会议、谈判、简报、求职、MBA或职场英语目标。' },
    { icon: 'family_restroom', name: 'Kids & Parents', lessons: '孩子一对一6；家长4或6节', suitable: '6-15岁孩子和家长同行，亲子同校但分开上课，帮助孩子建立独立沟通。' },
  ];

  readonly feePackages: FeePackage[] = [
    { id: 'practical-sextuple', category: '最低预算', course: 'Practical ESL', room: '6人房', lessons: '一对一4 + 小组3 + 选修2', prices: { 1: 361, 2: 694, 3: 997, 4: 1156, 8: 2312, 12: 3468, 24: 6936 }, note: '4周食宿主价最低；适合预算优先、能接受多人房的学生。' },
    { id: 'practical-quad', category: '高性价比', course: 'Practical ESL', room: '4人房', lessons: '一对一4 + 小组3 + 选修2', prices: { 1: 396, 2: 760, 3: 1092, 4: 1266, 8: 2532, 12: 3798, 24: 7596 }, note: '预算和住宿人数更平衡，适合多数想控制成本的学生。' },
    { id: 'practical-triple', category: '舒适预算', course: 'Practical ESL', room: '3人房', lessons: '一对一4 + 小组3 + 选修2', prices: { 1: 427, 2: 820, 3: 1178, 4: 1366, 8: 2732, 12: 4098, 24: 8196 }, note: '室友更少，仍保留3D的低预算优势。' },
    { id: 'practical-single', category: '单人房', course: 'Practical ESL', room: '1人房', lessons: '一对一4 + 小组3 + 选修2', prices: { 1: 543, 2: 1042, 3: 1497, 4: 1736, 8: 3472, 12: 5208, 24: 10416 }, note: '适合重视隐私、睡眠和工作空间的学生。' },
    { id: 'intensive-quad', category: '口语加强', course: 'Intensive ESL', room: '4人房', lessons: '一对一5 + 小组3 + 选修2', prices: { 1: 455, 2: 874, 3: 1256, 4: 1456, 8: 2912, 12: 4368, 24: 8736 }, note: '比Practical多一节一对一，适合想加快开口速度的人。' },
    { id: 'platinum-sextuple', category: '高一对一低预算', course: 'Platinum ESL', room: '6人房', lessons: '一对一6 + 小组3', prices: { 1: 477, 2: 916, 3: 1316, 4: 1526, 8: 3052, 12: 4578, 24: 9156 }, note: '想提高课时但仍控制住宿预算的人可以比较。' },
    { id: 'exam-quad', category: '考试方向', course: 'TOEIC / IELTS / TOEFL', room: '4人房', lessons: '考试课4 + ESL3 + 选修', prices: { 1: 418, 2: 802, 3: 1152, 4: 1336, 8: 2672, 12: 4008, 24: 8016 }, note: '适合TOEIC、IELTS或TOEFL基础备考。' },
    { id: 'business-quad', category: '商务方向', course: 'Business English', room: '4人房', lessons: '商务一对一4 + 小组3 + 选修2', prices: { 1: 455, 2: 874, 3: 1256, 4: 1456, 8: 2912, 12: 4368, 24: 8736 }, note: '商务沟通、会议、谈判和简报训练方向。' },
    { id: 'walkin-practical', category: '通学自理住宿', course: 'Walk-in Practical ESL', room: '自理住宿', lessons: '一对一/小组课 + 平日午餐', prices: { 1: 259, 2: 497, 3: 714, 4: 828, 8: 1656, 12: 2484, 24: 4968 }, note: '不含住宿，适合已在宿务或想自己订酒店/公寓的人。' },
    { id: 'walkin-business', category: '通学商务', course: 'Walk-in Business English', room: '自理住宿', lessons: '商务英语 + 平日午餐', prices: { 1: 318, 2: 611, 3: 878, 4: 1018, 8: 2036, 12: 3054, 24: 6108 }, note: '不含住宿，适合短期商务英语和数字游民。' },
  ];

  readonly feeSummaryRows: FeeSummaryRow[] = [
    { course: 'Practical ESL', lessons: '一对一4 + 小组3 + 选修2', room: '6人房', price4Weeks: 1156, note: '最低食宿主价' },
    { course: 'Practical ESL', lessons: '一对一4 + 小组3 + 选修2', room: '4人房', price4Weeks: 1266, note: '高性价比' },
    { course: 'Practical ESL', lessons: '一对一4 + 小组3 + 选修2', room: '3人房', price4Weeks: 1366, note: '减少室友人数' },
    { course: 'Practical ESL', lessons: '一对一4 + 小组3 + 选修2', room: '1人房', price4Weeks: 1736, note: '单人房' },
    { course: 'Intensive ESL', lessons: '一对一5 + 小组3 + 选修2', room: '4人房', price4Weeks: 1456, note: '口语加强' },
    { course: 'Platinum ESL', lessons: '一对一6 + 小组3', room: '6人房', price4Weeks: 1526, note: '高一对一低预算' },
    { course: 'TOEIC / IELTS / TOEFL', lessons: '考试课4 + ESL3 + 选修', room: '4人房', price4Weeks: 1336, note: '考试方向' },
    { course: 'Business English', lessons: '商务一对一4 + 小组3 + 选修2', room: '4人房', price4Weeks: 1456, note: '商务方向' },
    { course: 'Walk-in Practical ESL', lessons: '自理住宿 + 平日午餐', room: '通学', price4Weeks: 828, note: '不含住宿' },
    { course: 'Kids Program', lessons: '孩子一对一6', room: '4人房', price4Weeks: 1506, note: '6-15岁，入学金另计' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 100', note: '一次性费用，本页报价器已加入。Kids & Parents按每人计算。' },
    { item: '机场接机', amount: 'USD 30', note: '麦克坦宿务机场到学校单程接机参考。' },
    { item: 'SSP', amount: 'PHP 12,040', note: '官方列为3个月有效的Special Study Permit费用。' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '通常停留超过59天需要办理。' },
    { item: '教材费', amount: '约PHP 1,000 / 4周', note: '按课程和实际教材数量可能增减。' },
    { item: '电费', amount: 'PHP 1,000-1,500 / 4周', note: '官方列为按用量参考。' },
    { item: '维护费', amount: 'PHP 500 / 周', note: '到校一次性支付，按学习周数计算。' },
    { item: '宿舍押金', amount: 'PHP 4,500 / 9,000', note: '1-19周为PHP 4,500；20-47周为PHP 9,000。' },
    { item: '签证延长', amount: 'PHP 4,440起', note: '超过30天需要延签；官方列出1-5次延签阶梯。' },
    { item: '额外选修课', amount: 'PHP 1,500-2,500 / 周', note: '小组ESL约PHP 1,500/周；一对一ESL约PHP 2,500/周。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '预算敏感但想住校', text: '3D的6人房、4人房价格在宿务市区很有竞争力，且三餐、洗衣和清洁打包。' },
    { title: '第一次宿务游学', text: 'JY Square商业区生活便利，学校有多语种支持、宿舍、餐厅和常见到校流程。' },
    { title: '想提高一对一口语', text: '从Practical到Intensive、Platinum和Power MTM，可以按预算逐步增加一对一课时。' },
    { title: '想自理住宿或远程工作', text: 'Walk-in课程适合住公寓、酒店、亲友家，或想把课程和自己的生活节奏分开的学生。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '追求全新豪华校区', text: '官方2026文章也承认当前校舍较旧，并提到2026年10月计划搬迁至MIT Building，报名时要确认校区状态。' },
    { title: '必须要度假村环境', text: '3D是市中心商业楼校区，不是CIA Mactan或CPI那类泳池度假村式校园。' },
    { title: '需要严格斯巴达管理', text: '3D更偏实用、便利和高性价比，若目标是强制自习、每日测试和严格门禁，应同时比较SMEAG、EV等学校。' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: '3D Academy官方英文首页', url: 'https://3d-universal.com/en/' },
    { label: '3D Academy官方About与学校资料', url: 'https://3d-universal.com/en/about/' },
    { label: '3D Academy ESL课程与费用表', url: 'https://3d-universal.com/en/generalenglish.com' },
    { label: '3D Academy Walk-in通学费用表', url: 'https://3d-universal.com/en/course/walk-in-course' },
    { label: '3D Academy住宿介绍', url: 'https://3d-universal.com/en/accommodations' },
    { label: '3D Academy官方Facebook', url: 'https://www.facebook.com/3dUniversalEnglish/' },
    { label: '3D Academy Facebook公开内容镜像', url: 'https://www.schoolandcollegelistings.com/PH/Cebu-City/150273788437025/3D-ACADEMY' },
    { label: '3D Academy 2026官方代表说明', url: 'https://3d-universal.com/en/blogs/5-reasons-to-choose-3d-academy.html' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '环境', target: 'environment', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '生活', target: 'life', icon: 'apartment' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') return this.galleryImages;
    return this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedPackage(): FeePackage {
    return this.feePackages.find((item) => item.id === this.selectedPackageId) ?? this.feePackages[0];
  }

  get baseFeeUsd(): number {
    return this.selectedPackage.prices[this.selectedWeeks];
  }

  get estimatedTotalUsd(): number {
    return this.baseFeeUsd + this.registrationFeeUsd;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.estimatedTotalUsd)} 起`;
  }

  get baseFeeText(): string {
    return `USD ${this.formatUsd(this.baseFeeUsd)}`;
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
    if (!targetElement) return;
    const headerOffset = window.innerWidth <= 680 ? 130 : 90;
    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`);
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
}
