import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12 | 16 | 20 | 24;

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
  selector: 'app-glant-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './glant-school.component.html',
  styleUrl: './glant-school.component.css',
})
export class GlantSchoolComponent {
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  readonly registrationFeeUsd = 100;
  readonly airportPickupUsd = 20;
  selectedWeeks: WeekOption = 4;
  selectedPackageId = 'regular-triple';
  selectedStartDate = '2026-08-31';
  selectedGalleryCategory: GalleryCategory = '全部';
  quoteCalculated = false;

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '生活'];

  readonly snapshotCards: SnapshotCard[] = [
    { icon: 'home_work', title: '小规模家庭式学校', text: '官方介绍强调小规模、低成本、自由度高，老师和学生距离近。' },
    { icon: 'location_on', title: 'Kasambagan / Banilad生活圈', text: '位于宿务市区，步行或短车程可到商场、餐厅、咖啡厅和生活设施。' },
    { icon: 'public', title: '欧美外教课程', text: 'GLANT特色之一是可安排Native Speaker课程，适合练发音、表达和真实沟通。' },
    { icon: 'nightlife', title: '无门禁管理', text: '官方页面强调No curfew and Rules，更适合自律、想保留自由度的成人学生。' },
    { icon: 'bed', title: '1/2/3人房可选', text: '费用表按单人、双人、三人房区分，课程食宿费用以美元公布。' },
    { icon: 'restaurant', title: '含餐食与住宿', text: '公开费用表为课程、住宿、餐食打包价，入学金、接机和到校费用另计。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校区',
      title: 'GLANT学校外观',
      text: '小规模城市型校区，适合偏好安静、紧凑学习环境的人。',
      src: 'https://static.wixstatic.com/media/29a68c_692a8dcd34804195a436dfadd214fde9~mv2.jpg/v1/fill/w_1800%2Ch_1198%2Cal_c/29a68c_692a8dcd34804195a436dfadd214fde9~mv2.jpg',
    },
    {
      category: '教室',
      title: '一对一教室',
      text: 'Regular、Intensive、Premium按一对一课时数拉开强度。',
      src: 'https://www.ph-ryugaku.com/wp-content/uploads/2026/01/GLANT-English-Academy-41_%E3%83%9E%E3%83%B3%E3%83%84%E3%83%BC%E3%83%9E%E3%83%B3%E6%95%99%E5%AE%A4-1.jpg',
    },
    {
      category: '教室',
      title: '学生学习场景',
      text: '小规模学校更容易按学生状态做课程调整。',
      src: 'https://www.ph-ryugaku.com/wp-content/uploads/2026/01/GLANT-English-Academy-43_%E7%94%9F%E5%BE%92%E3%81%95%E3%82%93-1.jpg',
    },
    {
      category: '教室',
      title: '办公室与学习支持',
      text: '课程、老师和生活问题可以更直接地与学校沟通。',
      src: 'https://www.ph-ryugaku.com/wp-content/uploads/2026/01/GLANT-English-Academy-44_%E3%82%AA%E3%83%95%E3%82%A3%E3%82%B9-1.jpg',
    },
    {
      category: '住宿',
      title: '宿舍房间',
      text: '费用表按单人、双人、三人房区分，三人房预算最低。',
      src: 'https://www.ph-ryugaku.com/wp-content/uploads/2026/01/GLANT-English-Academy-48_1%E4%BA%BA%E9%83%A8%E5%B1%8B-1.jpg',
    },
    {
      category: '住宿',
      title: '多人房',
      text: '预算优先的学生可优先比较三人房与Mini ESL。',
      src: 'https://www.ph-ryugaku.com/wp-content/uploads/2026/01/GLANT-English-Academy-56_%E3%81%8A%E9%83%A8%E5%B1%8B-1.jpg',
    },
    {
      category: '生活',
      title: '餐厅',
      text: '课程、住宿、餐食打包报价，实际菜单与服务以学校当期安排为准。',
      src: 'https://www.ph-ryugaku.com/wp-content/uploads/2026/01/GLANT-English-Academy-45_%E9%A3%9F%E5%A0%82-1.jpg',
    },
    {
      category: '生活',
      title: '公共休息区',
      text: '小规模学校的生活区更像家一样，适合重视熟悉感的人。',
      src: 'https://www.ph-ryugaku.com/wp-content/uploads/2026/01/GLANT-English-Academy-46_%E5%85%B1%E6%9C%89%E3%82%B9%E3%83%9A%E3%83%BC%E3%82%B9-1.jpg',
    },
  ];

  readonly courses: CourseItem[] = [
    { icon: 'menu_book', name: 'Regular ESL', lessons: '一对一4 + 团体2 + Native Speaker 1', suitable: '适合第一次菲律宾游学、想平衡强度和费用的成人学生。' },
    { icon: 'bolt', name: 'Intensive ESL', lessons: '一对一5 + 团体2 + Native Speaker 1', suitable: '适合想增加一对一课时，但仍保留团体互动的人。' },
    { icon: 'rocket_launch', name: 'Premium ESL', lessons: '一对一7', suitable: '适合短期集中提升口语、发音、表达反应和个人弱项。' },
    { icon: 'self_improvement', name: 'Mini ESL', lessons: '一对一3 + Native Speaker 1', suitable: '适合预算优先、半天学习、自由度和生活体验优先的人。' },
    { icon: 'task_alt', name: 'IELTS', lessons: '一对一4 + 团体2 + Native Speaker 1', suitable: '适合雅思入门或基础备考，若目标高分冲刺需确认师资和模考制度。' },
    { icon: 'groups', name: '自由型成人游学', lessons: '无门禁，小规模支持', suitable: '适合自律、有明确生活安排、不想被斯巴达规则限制的学生。' },
  ];

  readonly feePackages: FeePackage[] = [
    { id: 'mini-triple', category: '最低预算', course: 'Mini ESL', room: '3人房', lessons: '一对一3 + Native Speaker 1', prices: { 1: 303, 2: 605, 3: 908, 4: 1130, 8: 2260, 12: 3390, 16: 4520, 20: 5650, 24: 6780 }, note: '课程强度较轻，适合预算优先或想保留自由时间。' },
    { id: 'regular-triple', category: '标准推荐', course: 'Regular ESL', room: '3人房', lessons: '一对一4 + 团体2 + Native Speaker 1', prices: { 1: 348, 2: 695, 3: 1043, 4: 1310, 8: 2620, 12: 3930, 16: 5240, 20: 6550, 24: 7860 }, note: '课程、费用、自由度较平衡，适合多数成人学生。' },
    { id: 'regular-double', category: '双人房', course: 'Regular ESL', room: '2人房', lessons: '一对一4 + 团体2 + Native Speaker 1', prices: { 1: 378, 2: 755, 3: 1133, 4: 1410, 8: 2820, 12: 4230, 16: 5640, 20: 7050, 24: 8460 }, note: '适合同伴同行或想减少住宿人数的人。' },
    { id: 'regular-single', category: '单人房', course: 'Regular ESL', room: '1人房', lessons: '一对一4 + 团体2 + Native Speaker 1', prices: { 1: 418, 2: 835, 3: 1253, 4: 1560, 8: 3120, 12: 4680, 16: 6240, 20: 7800, 24: 9360 }, note: '适合重视隐私、睡眠和独立生活空间的人。' },
    { id: 'intensive-triple', category: '强化口语', course: 'Intensive ESL', room: '3人房', lessons: '一对一5 + 团体2 + Native Speaker 1', prices: { 1: 383, 2: 765, 3: 1148, 4: 1450, 8: 2900, 12: 4350, 16: 5800, 20: 7250, 24: 8700 }, note: '比Regular多一节一对一，适合短中期口语提升。' },
    { id: 'premium-triple', category: '最高一对一', course: 'Premium ESL', room: '3人房', lessons: '一对一7', prices: { 1: 433, 2: 865, 3: 1298, 4: 1650, 8: 3300, 12: 4950, 16: 6600, 20: 8250, 24: 9900 }, note: '高一对一强度，适合目标明确并能承受密集课程的人。' },
    { id: 'ielts-triple', category: '雅思方向', course: 'IELTS', room: '3人房', lessons: '一对一4 + 团体2 + Native Speaker 1', prices: { 1: 363, 2: 725, 3: 1088, 4: 1370, 8: 2740, 12: 4110, 16: 5480, 20: 6850, 24: 8220 }, note: '适合雅思基础备考，正式目标分需先确认班级与师资。' },
  ];

  readonly feeSummaryRows: FeeSummaryRow[] = [
    { course: 'Mini ESL', lessons: '一对一3 + Native 1', room: '3人房', price4Weeks: 1130, note: '最低预算课程食宿' },
    { course: 'Regular ESL', lessons: '一对一4 + 团体2 + Native 1', room: '3人房', price4Weeks: 1310, note: '标准推荐' },
    { course: 'Regular ESL', lessons: '一对一4 + 团体2 + Native 1', room: '2人房', price4Weeks: 1410, note: '双人房' },
    { course: 'Regular ESL', lessons: '一对一4 + 团体2 + Native 1', room: '1人房', price4Weeks: 1560, note: '单人房' },
    { course: 'Intensive ESL', lessons: '一对一5 + 团体2 + Native 1', room: '3人房', price4Weeks: 1450, note: '强化型' },
    { course: 'Premium ESL', lessons: '一对一7', room: '3人房', price4Weeks: 1650, note: '高一对一' },
    { course: 'IELTS', lessons: '一对一4 + 团体2 + Native 1', room: '3人房', price4Weeks: 1370, note: '雅思方向' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 100', note: '一次性费用，本页报价器已加入。' },
    { item: '接机费', amount: 'USD 20', note: '公开费用表列为出发前费用，本页报价器已加入。' },
    { item: 'SSP + E-Card', amount: '约PHP 10,500-12,000', note: '不同公开表有差异，正式报名前需按学校当期规则确认。' },
    { item: '签证延长', amount: '按周数确认', note: '1-4周通常无需延签，8周以上需按停留周期计算。' },
    { item: '教材费', amount: 'PHP 200-500 / 本', note: '按实际使用教材数量收费。' },
    { item: '水电费', amount: 'PHP 20 / kWh', note: '按实际用量或学校规则结算。' },
    { item: '宿舍押金', amount: 'PHP 2,000', note: '退房检查后按学校规则退还或抵扣。' },
    { item: '洗衣费', amount: '约PHP 29-33 / kg', note: '按实际使用量计算。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '喜欢自由度高的成人学生', text: '无门禁和少规则是GLANT的核心卖点，适合自律、能安排自己课后时间的人。' },
    { title: '想控制预算但仍要市区便利', text: 'Mini ESL和三人房价格低，Kasambagan / Banilad生活圈也比较方便。' },
    { title: '重视Native Speaker沟通', text: 'Regular、Intensive、IELTS和Mini都包含Native Speaker课时，适合练自然表达。' },
    { title: '喜欢小规模熟悉感', text: '小学校更容易获得直接沟通，但也意味着设施和班级规模不如大型学校。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '需要严格斯巴达管理', text: 'GLANT自由度高，不适合希望学校强制自习、门禁和考试纪律推动的人。' },
    { title: '想要大型度假村式校园', text: '它更像城市小型学校，设施丰富度不能和CIA、CPI这类大型校园相比。' },
    { title: '低龄亲子或未成年独立游学', text: '该页面更适合成人自由型学生，未成年或亲子应先确认年龄、监护和管理规则。' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'GLANT English Academy官方Wix页面', url: 'https://eduglantcebu.wixsite.com/language-school' },
    { label: 'GLANT官方课程页面', url: 'https://eduglantcebu.wixsite.com/language-school/course' },
    { label: '菲律宾留学中心GLANT费用表', url: 'https://www.ph-ryugaku.com/school/glant-english-academy/' },
    { label: '菲律宾留学Hub GLANT学校与费用信息', url: 'https://philippine-ryugaku-hub.com/school/glant/' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '环境', target: 'environment', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '生活', target: 'life', icon: 'home_work' },
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
    return this.baseFeeUsd + this.registrationFeeUsd + this.airportPickupUsd;
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
