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
  selector: 'app-icl-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './icl-school.component.html',
  styleUrl: './icl-school.component.css',
})
export class IclSchoolComponent {
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  readonly registrationFeeUsd = 100;
  selectedWeeks: WeekOption = 4;
  selectedPackageId = 'power4-quad';
  selectedStartDate = '2026-09-07';
  selectedGalleryCategory: GalleryCategory = '全部';
  quoteCalculated = false;

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '生活'];

  readonly snapshotCards: SnapshotCard[] = [
    { icon: 'location_on', title: '宿务市中心位置', text: '学校位于110 Gorordo Avenue，Ayala Center Cebu生活圈附近，适合想兼顾学习和城市便利的学生。' },
    { icon: 'school', title: '2025年改名为ICL', text: '公开资料显示学校由iCrazy更名为ICL English Academy，延续10级分班和口语强化路线。' },
    { icon: 'nightlife', title: '半斯巴达管理', text: '平日有门禁和夜间选修课，自律度比自由型学校更高，但比全斯巴达更保留生活弹性。' },
    { icon: 'record_voice_over', title: 'Power Speaking主打', text: 'Power Speaking 4/6/8按一对一课时数分级，适合想把预算花在开口练习上的学生。' },
    { icon: 'task_alt', title: 'IELTS / TOEIC方向', text: '公开课程资料列有雅思、多益和保证班，适合需要考试目标与模拟测验节奏的人。' },
    { icon: 'family_restroom', title: '亲子与Junior课程', text: '学校提供Junior、Parents和短期亲子方案，搭配儿童活动区和学生发表活动。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校区',
      title: 'ICL学校外观',
      text: '城市型校舍，公开资料标注为2023年搬迁更新后的校区。',
      src: 'https://www.fujiyama-international.com/archives/004/202510/42e04b981aa040a4f845892a42da3625d94846d3614157b187c8f15b8a466688.jpg',
    },
    {
      category: '校区',
      title: '学校入口',
      text: '位于Gorordo Avenue生活圈，适合希望住在宿务市区的学生。',
      src: 'https://www.rightherestudy.com/archive/image/article4/images/1764321894052_1200_630.jpeg',
    },
    {
      category: '生活',
      title: '接待与公共空间',
      text: '校内设有大厅、办公室、食堂、饮水机、公告区和学生支持窗口。',
      src: 'https://storage.googleapis.com/phl-2025b-wp/2026/01/entrance.jpg',
    },
    {
      category: '教室',
      title: '一对一与小组课堂',
      text: 'Power Speaking、IELTS、TOEIC等课程都以一对一搭配小组课为核心。',
      src: 'https://storage.googleapis.com/world-study-prod/media/school_photo/3700/5b021439-7a02-4888-af4e-593bdbd4f6b2.jpg',
    },
    {
      category: '教室',
      title: '小组互动课',
      text: '官方课程资料强调主题讨论、职场英文、时事英文、考试英文等教材。',
      src: 'https://www.fujiyama-international.com/archives/004/202510/mode3_w640_h640-b88eb962f9d8c755aa5e23ed3f337ea3d365112839aafadd7d45b69c34315242.jpg',
    },
    {
      category: '住宿',
      title: '校内宿舍',
      text: '校内宿舍有1/2/3/4人房，费用表按课程和房型分开公布。',
      src: 'https://storage.googleapis.com/phl-2025b-wp/2026/01/bed-room.jpg',
    },
    {
      category: '生活',
      title: '学生休息区',
      text: '公开资料列有桌球、台球、健身、儿童活动区和Wi-Fi等校内设施。',
      src: 'https://storage.googleapis.com/phl-2025b-wp/2026/01/lounge2.jpg',
    },
  ];

  readonly courses: CourseItem[] = [
    { icon: 'light_mode', name: 'Light Speaking', lessons: '一对一4', suitable: '预算优先、想保留较多课后时间，或短期先体验宿务游学的学生。' },
    { icon: 'record_voice_over', name: 'Power Speaking 4', lessons: '一对一4 + 团体4 + 选修2', suitable: 'ICL标准口语路线，适合多数成人学生和第一次宿务游学。' },
    { icon: 'bolt', name: 'Power Speaking 6 / 8', lessons: '一对一6或8 + 团体/选修', suitable: '想明显增加一对一练习量、短期集中开口的学生。' },
    { icon: 'task_alt', name: 'IELTS / IELTS保证班', lessons: '雅思一对一 + 小组 + 自习/模拟', suitable: '有目标分数、需要听说读写拆分训练与规律模拟测验的学生。' },
    { icon: 'fact_check', name: 'TOEIC', lessons: '一对一4 + 团体4 + 自习', suitable: '需要多益听读提分、职场英文证照或就业准备的学生。' },
    { icon: 'family_restroom', name: 'Junior / Parents', lessons: 'Junior一对一4 + 团体2 + 运动2；家长一对一4', suitable: '7-15岁青少年、亲子短期方案，以及希望孩子边学边适应海外环境的家庭。' },
  ];

  readonly feePackages: FeePackage[] = [
    { id: 'light-quad', category: '最低预算', course: 'Light Speaking', room: '4人房', lessons: '一对一4', prices: { 1: 540, 2: 810, 3: 1148, 4: 1350, 8: 2700, 12: 4050, 16: 5400, 20: 6750, 24: 8100 }, note: '课程强度较轻，适合预算优先或想保留较多自由时间。' },
    { id: 'power4-quad', category: '标准推荐', course: 'Power Speaking 4', room: '4人房', lessons: '一对一4 + 团体4 + 选修2', prices: { 1: 580, 2: 870, 3: 1233, 4: 1450, 8: 2900, 12: 4350, 16: 5800, 20: 7250, 24: 8700 }, note: '口语课时、费用和半斯巴达节奏较平衡，适合多数成人学生。' },
    { id: 'power4-triple', category: '舒适预算', course: 'Power Speaking 4', room: '3人房', lessons: '一对一4 + 团体4 + 选修2', prices: { 1: 620, 2: 930, 3: 1318, 4: 1550, 8: 3100, 12: 4650, 16: 6200, 20: 7750, 24: 9300 }, note: '比4人房更少室友，仍能控制预算。' },
    { id: 'power4-single', category: '单人房', course: 'Power Speaking 4', room: '1人房', lessons: '一对一4 + 团体4 + 选修2', prices: { 1: 680, 2: 1020, 3: 1445, 4: 1700, 8: 3400, 12: 5100, 16: 6800, 20: 8500, 24: 10200 }, note: '适合重视隐私、睡眠质量和独立学习空间的学生。' },
    { id: 'power8-quad', category: '高一对一', course: 'Power Speaking 8', room: '4人房', lessons: '一对一8 + 选修2', prices: { 1: 700, 2: 1050, 3: 1488, 4: 1750, 8: 3500, 12: 5250, 16: 7000, 20: 8750, 24: 10500 }, note: '一对一比例高，适合短期冲刺口语输出。' },
    { id: 'ielts-quad', category: '雅思方向', course: 'IELTS', room: '4人房', lessons: '一对一4 + 团体4 + 自习1', prices: { 1: 640, 2: 960, 3: 1360, 4: 1600, 8: 3200, 12: 4800, 16: 6400, 20: 8000, 24: 9600 }, note: '适合雅思基础备考；保证班有独立8/12周价格。' },
    { id: 'toeic-quad', category: '多益方向', course: 'TOEIC', room: '4人房', lessons: '一对一4 + 团体4 + 自习1', prices: { 1: 620, 2: 930, 3: 1318, 4: 1550, 8: 3100, 12: 4650, 16: 6200, 20: 7750, 24: 9300 }, note: '适合多益听读、职场英文和证照准备。' },
    { id: 'junior-quad', category: '青少年', course: 'Junior', room: '4人房', lessons: '一对一4 + 团体2 + 运动2', prices: { 1: 600, 2: 900, 3: 1275, 4: 1500, 8: 3000, 12: 4500, 16: 6000, 20: 7500, 24: 9000 }, note: '适合7-15岁青少年；亲子出行需按年龄和监护安排确认。' },
    { id: 'power4-external-double', category: '外部酒店', course: 'Power Speaking 4', room: '外部寮2人房', lessons: '一对一4 + 团体4 + 选修2', prices: { 1: 760, 2: 1140, 3: 1615, 4: 1900, 8: 3800, 12: 5700, 16: 7600, 20: 9500, 24: 11400 }, note: '使用步行约2分钟的Goldberry Suites外部宿舍，预算会更高。' },
  ];

  readonly feeSummaryRows: FeeSummaryRow[] = [
    { course: 'Light Speaking', lessons: '一对一4', room: '4人房', price4Weeks: 1350, note: '最低预算课程食宿费' },
    { course: 'Power Speaking 4', lessons: '一对一4 + 团体4 + 选修2', room: '4人房', price4Weeks: 1450, note: '标准推荐' },
    { course: 'Power Speaking 4', lessons: '一对一4 + 团体4 + 选修2', room: '3人房', price4Weeks: 1550, note: '减少室友人数' },
    { course: 'Power Speaking 4', lessons: '一对一4 + 团体4 + 选修2', room: '1人房', price4Weeks: 1700, note: '单人房' },
    { course: 'Power Speaking 8', lessons: '一对一8 + 选修2', room: '4人房', price4Weeks: 1750, note: '高一对一强度' },
    { course: 'IELTS', lessons: '一对一4 + 团体4 + 自习1', room: '4人房', price4Weeks: 1600, note: '雅思方向' },
    { course: 'TOEIC', lessons: '一对一4 + 团体4 + 自习1', room: '4人房', price4Weeks: 1550, note: '多益方向' },
    { course: 'Junior', lessons: '一对一4 + 团体2 + 运动2', room: '4人房', price4Weeks: 1500, note: '7-15岁青少年' },
    { course: 'Power Speaking 4', lessons: '一对一4 + 团体4 + 选修2', room: '外部寮2人房', price4Weeks: 1900, note: 'Goldberry Suites参考' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 100', note: '一次性费用，本页报价器已加入。' },
    { item: 'SSP + SSP E-Card', amount: 'PHP 12,300', note: 'SSP 7,800 + SSP E-Card 4,500，按移民局与学校当期规则确认。' },
    { item: '签证延长', amount: 'PHP 0 / 5,500 / 12,000起', note: '30天内通常0；5-8周5,500；9-12周12,000，之后按周数增加。' },
    { item: 'ACR I-Card', amount: 'PHP 4,500', note: '通常9周以上需要办理。' },
    { item: '接机', amount: 'PHP 800', note: '宿务麦克坦机场接机，公开资料显示可按到达时间安排。' },
    { item: '教材费', amount: '约PHP 2,000 / 4周', note: '按课程和实际教材数量可能增减。' },
    { item: '宿舍押金', amount: 'PHP 3,000', note: '退房检查无损坏后按学校规则退还。' },
    { item: '水电与维护', amount: 'PHP 900 / 周', note: '公开资料列水电500/周、维护400/周，超额可能另计。' },
    { item: '洗衣费', amount: 'PHP 300 / 周', note: '公开资料列为每周2次洗衣服务参考。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在宿务市区读半斯巴达', text: 'ICL的位置和管理强度介于自由型小校与高压斯巴达之间，适合想要节奏但不想完全封闭的人。' },
    { title: '重视一对一口语课时', text: 'Power Speaking 4/6/8可以按预算和强度增加一对一比例，短期学习目标比较清晰。' },
    { title: '雅思、多益或亲子路线', text: '课程覆盖IELTS、TOEIC、Junior和Parents，适合多种游学目的放在同一所学校比较。' },
    { title: '希望日本学生比例低一些', text: '公开代理资料提到日本学生比例较低，适合想提高英文环境浓度的学生，但实际国籍比例会随季节变化。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '追求大型度假村校区', text: 'ICL更像市区教学楼和宿舍结合的学校，不是CIA Mactan或CPI那类度假村式大校区。' },
    { title: '必须要全斯巴达强制管理', text: 'ICL是半斯巴达，适合需要一定纪律但仍想保留课后弹性的学生。' },
    { title: '只看最低总价的人', text: '课程食宿费以美元公布，但SSP、签证、教材、水电维护、押金和生活费要另行预留。' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'ICL / iCrazy官方首页', url: 'https://icrazy-english.com.tw/en/' },
    { label: 'ICL / iCrazy官方课程教材页', url: 'https://icrazy-english.com.tw/en/course' },
    { label: 'ICL English Academy官方Facebook', url: 'https://www.facebook.com/icrazyenglishacademy/' },
    { label: 'ICL Facebook公开内容镜像', url: 'https://www.schoolandcollegelistings.com/PH/Cebu-City/105817508785603/ICL-English-Academy' },
    { label: 'CEBU English ICL学校与费用表', url: 'https://cebu-english.com/school/icrazy/' },
    { label: 'DEOW ICL 2025-2026费用参考', url: 'https://deow.jp/philippines/school/icl/' },
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
