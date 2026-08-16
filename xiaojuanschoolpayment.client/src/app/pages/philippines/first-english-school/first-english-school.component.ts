import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '教室' | '住宿' | '亲子' | '生活';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12 | 16 | 20 | 24;

interface SnapshotCard { icon: string; title: string; text: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; text: string; src: string; }
interface CourseItem { icon: string; name: string; lessons: string; suitable: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface FitItem { title: string; text: string; }
interface SourceLink { label: string; url: string; }
interface SideNavItem { label: string; target: string; icon: string; }

interface FeePackage {
  id: string;
  category: string;
  course: string;
  room: string;
  lessons: string;
  prices: Record<WeekOption, number>;
  note: string;
}

interface FeeSummaryRow {
  course: string;
  lessons: string;
  room: string;
  price4Weeks: number;
  note: string;
}

@Component({
  selector: 'app-first-english-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './first-english-school.component.html',
  styleUrl: './first-english-school.component.css',
})
export class FirstEnglishSchoolComponent {
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  readonly entranceFeeJpy = 18000;
  readonly jpyToUsd = 0.0061;
  readonly exchangeRateNote = '价格已按参考汇率换算为美元；正式报价以付款日汇率为准。';
  selectedWeeks: WeekOption = 4;
  selectedPackageId = 'general-share-6';
  selectedStartDate = '2026-08-31';
  selectedGalleryCategory: GalleryCategory = '全部';
  quoteCalculated = false;

  readonly galleryCategories: GalleryCategory[] = ['全部', '教室', '住宿', '亲子', '生活'];

  readonly snapshotCards: SnapshotCard[] = [
    { icon: 'location_on', title: '麦克坦新城校区', text: '教室位于Mactan Newtown，距离宿务机场车程约15分钟，生活配套集中。' },
    { icon: 'record_voice_over', title: '高比例一对一', text: 'GENERAL为6节一对一+2节小组，另有6/7/8节一对一和半天课程可选。' },
    { icon: 'family_restroom', title: '亲子游学友好', text: '4-12岁儿童可选Kids ESL / Eiken，家长与孩子分别上课，也有陪读住宿方案。' },
    { icon: 'crib', title: '婴幼儿看护', text: '学校公布工作日7:30-17:30看护服务，方便带低龄儿童同行的家长上课。' },
    { icon: 'apartment', title: '公寓或Share House', text: '亲子家庭使用Mactan Newtown公寓，成人可选车程约5分钟的Share House。' },
    { icon: 'verified_user', title: '日式运营支持', text: '学校由日本团队运营，官方介绍强调全员TESOL资质教师与学习支持。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '教室',
      title: '一对一开放式教室',
      text: '每位学生有固定学习座位，适合大量口语输出。',
      src: 'https://www.firstcebu.com/wp2/wp-content/uploads/2024/03/%E6%95%99%E5%AE%A4%E4%BF%AF%E7%9E%B0-1-1-1024x768.jpg',
    },
    {
      category: '教室',
      title: '小组课教室',
      text: '小组课通常按水平安排，训练发表、辩论、听说等场景。',
      src: 'https://www.firstcebu.com/wp2/wp-content/uploads/2024/03/%E6%95%99%E5%AE%A4%E5%86%85%E8%A6%B3-1024x768.jpg',
    },
    {
      category: '亲子',
      title: '儿童学习空间',
      text: '低龄儿童课程与看护服务是First English的主要特色之一。',
      src: 'https://www.firstcebu.com/wp2/wp-content/uploads/2024/03/%E3%82%AD%E3%83%83%E3%82%BA%E3%83%AB%E3%83%BC%E3%83%A0-1-1-1024x771.jpg',
    },
    {
      category: '教室',
      title: '教师与学生互动',
      text: '一对一课程便于按个人目标调整发音、表达和考试训练。',
      src: 'https://www.firstcebu.com/wp2/wp-content/uploads/2024/05/DSC01197-1-1024x683.jpg',
    },
    {
      category: '住宿',
      title: 'Share House房间',
      text: '成人可选择Share House，校方说明车程约5分钟到教室。',
      src: 'https://www.firstcebu.com/wp2/wp-content/uploads/2023/01/LINE_ALBUM_2022.7%E6%9C%88%E3%83%8A%E3%83%AB%E3%82%B9%E3%82%A2%E3%83%B3Room-No.-3_230118_26-1024x768.jpg',
    },
    {
      category: '住宿',
      title: 'Share House多人房',
      text: '4人间、6人间预算更低，适合想控制费用的成人学生。',
      src: 'https://www.firstcebu.com/wp2/wp-content/uploads/2023/01/LINE_ALBUM_20221227-Bigoot-BuildingA-Room1_230117_9-1024x768.jpg',
    },
    {
      category: '住宿',
      title: 'Mactan Newtown公寓',
      text: '亲子家庭和重视便利的学生可优先看校区周边公寓方案。',
      src: 'https://www.firstcebu.com/wp2/wp-content/uploads/2023/01/1LDK%E2%91%A1-1024x768.jpg',
    },
    {
      category: '生活',
      title: '公寓客厅与生活区',
      text: '公寓方案可使用厨房，周边有餐厅、咖啡厅和便利店。',
      src: 'https://www.firstcebu.com/wp2/wp-content/uploads/2023/01/%E3%83%AA%E3%83%93%E3%83%B3%E3%82%B0%E2%91%A1-1024x768.jpg',
    },
  ];

  readonly courses: CourseItem[] = [
    { icon: 'forum', name: 'GENERAL Course', lessons: '每天6节一对一 + 2节小组课', suitable: '适合第一次菲律宾游学、想大量开口但仍保留小组互动的学生。' },
    { icon: 'person', name: '6 Man-to-Man Course', lessons: '每天6节一对一', suitable: '适合初中以上、想把学习时间集中在个人弱项和口语输出的人。' },
    { icon: 'bolt', name: '7 Man-to-Man / Perfect Man to Man', lessons: '每天7-8节一对一', suitable: '适合短期冲刺、考试或商务英语目标明确且能承受高强度的人。' },
    { icon: 'child_care', name: 'Kids ESL / Kids Eiken', lessons: '4-12岁儿童每天6节一对一', suitable: '适合亲子游学、儿童英语启蒙、英检方向学习和寒暑假短期学习。' },
    { icon: 'school', name: 'GENERAL Short / Half', lessons: '4节一对一+2节小组，或4节一对一', suitable: '适合同行家长、半天上课、预算控制或想留出亲子活动时间的人。' },
    { icon: 'directions_walk', name: 'Commuter Course', lessons: '不含住宿，可选4-8节一对一', suitable: '适合已在宿务有住宿安排、长期家庭停留或想自由安排生活的人。' },
  ];

  readonly feePackages: FeePackage[] = [
    {
      id: 'general-share-6',
      category: '最低预算参考',
      course: 'GENERAL Course',
      room: '6人部屋（Share House）',
      lessons: '一对一6 + 小组2',
      prices: { 1: 80000, 2: 123000, 3: 160000, 4: 198000, 8: 396000, 12: 594000, 16: 792000, 20: 990000, 24: 1188000 },
      note: '成人低预算常用参考，需另计入学金和当地费用。',
    },
    {
      id: 'general-share-4',
      category: '预算平衡',
      course: 'GENERAL Course',
      room: '4人部屋（Share House）',
      lessons: '一对一6 + 小组2',
      prices: { 1: 99000, 2: 151000, 3: 198000, 4: 245000, 8: 490000, 12: 735000, 16: 980000, 20: 1225000, 24: 1470000 },
      note: '比6人间更安静，仍属于Share House经济房型。',
    },
    {
      id: 'general-share-2',
      category: '双人同行',
      course: 'GENERAL Course',
      room: '2人部屋（Share House）',
      lessons: '一对一6 + 小组2',
      prices: { 1: 113000, 2: 172000, 3: 226000, 4: 280000, 8: 560000, 12: 840000, 16: 1120000, 20: 1400000, 24: 1680000 },
      note: '适合同学或朋友同行，兼顾预算与私人空间。',
    },
    {
      id: 'general-share-1',
      category: '成人单人房',
      course: 'GENERAL Course',
      room: '1人部屋（Share House）',
      lessons: '一对一6 + 小组2',
      prices: { 1: 121000, 2: 184000, 3: 242000, 4: 300000, 8: 600000, 12: 900000, 16: 1200000, 20: 1500000, 24: 1800000 },
      note: '适合重视个人空间，但仍可参与Share House交流的学生。',
    },
    {
      id: 'general-condo-1',
      category: '公寓单人',
      course: 'GENERAL Course',
      room: '1人部屋（Condominium）',
      lessons: '一对一6 + 小组2',
      prices: { 1: 145000, 2: 220000, 3: 290000, 4: 360000, 8: 720000, 12: 1080000, 16: 1440000, 20: 1800000, 24: 2160000 },
      note: '适合更重视居住便利和舒适度的成人学生。',
    },
    {
      id: 'kids-family-2',
      category: '亲子常用',
      course: 'Kids ESL / Kids Eiken',
      room: '亲子2名（Condominium）',
      lessons: '儿童每天6节一对一',
      prices: { 1: 121000, 2: 184000, 3: 242000, 4: 300000, 8: 600000, 12: 900000, 16: 1200000, 20: 1500000, 24: 1800000 },
      note: '亲子方案仅限公寓住宿，家长课程和陪读方式需按家庭人数确认。',
    },
    {
      id: 'general-short-share-6',
      category: '轻量课程',
      course: 'GENERAL Short',
      room: '6人部屋（Share House）',
      lessons: '一对一4 + 小组2',
      prices: { 1: 74000, 2: 114000, 3: 148000, 4: 183000, 8: 366000, 12: 549000, 16: 732000, 20: 915000, 24: 1098000 },
      note: '适合想减少课程强度或保留更多自习和生活时间的人。',
    },
    {
      id: 'half-share-6',
      category: '半天上课',
      course: 'Half Course',
      room: '6人部屋（Share House）',
      lessons: '一对一4',
      prices: { 1: 70000, 2: 108000, 3: 140000, 4: 173000, 8: 346000, 12: 519000, 16: 692000, 20: 865000, 24: 1038000 },
      note: '适合陪读家长、工作兼顾或课程压力希望更低的学生。',
    },
    {
      id: 'commuter-mtm8',
      category: '不住宿',
      course: 'Commuter MTM 8',
      room: '不含住宿',
      lessons: '一对一8',
      prices: { 1: 81000, 2: 125000, 3: 163000, 4: 201000, 8: 402000, 12: 603000, 16: 804000, 20: 1005000, 24: 1206000 },
      note: '适合已自行安排宿务住宿的人，餐食和接送需另行确认。',
    },
    {
      id: 'stay-only-condo',
      category: '陪读不课',
      course: 'Stay Only',
      room: '亲子同行公寓',
      lessons: '住宿陪同，不含课程',
      prices: { 1: 65000, 2: 100000, 3: 130000, 4: 160000, 8: 320000, 12: 480000, 16: 640000, 20: 800000, 24: 960000 },
      note: '适合只陪同孩子、不参加课程的家长。',
    },
  ];

  readonly feeSummaryRows: FeeSummaryRow[] = [
    { course: 'GENERAL', lessons: '6一对一 + 2小组', room: '6人Share House', price4Weeks: 198000, note: '成人低预算参考' },
    { course: 'GENERAL', lessons: '6一对一 + 2小组', room: '4人Share House', price4Weeks: 245000, note: '预算与安静度平衡' },
    { course: 'GENERAL', lessons: '6一对一 + 2小组', room: '1人Share House', price4Weeks: 300000, note: '成人单人房' },
    { course: 'GENERAL', lessons: '6一对一 + 2小组', room: '1人Condominium', price4Weeks: 360000, note: '公寓单人房' },
    { course: '6 Man-to-Man', lessons: '6一对一', room: '6人Share House', price4Weeks: 193000, note: '初中以上可选' },
    { course: 'Kids ESL / Eiken', lessons: '儿童6一对一', room: '亲子2名Condominium', price4Weeks: 300000, note: '4-12岁儿童方向' },
    { course: 'GENERAL Short', lessons: '4一对一 + 2小组', room: '6人Share House', price4Weeks: 183000, note: '轻量课程' },
    { course: 'Half Course', lessons: '4一对一', room: '6人Share House', price4Weeks: 173000, note: '半天上课' },
    { course: 'Commuter MTM 8', lessons: '8一对一', room: '不含住宿', price4Weeks: 201000, note: '通学课程' },
    { course: 'Stay Only', lessons: '不含课程', room: '亲子同行公寓', price4Weeks: 160000, note: '家长陪读参考' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'JPY 18,000', note: '官方费用页列基础费用之外另付，本页报价器已按参考汇率折算加入。' },
    { item: 'SSP', amount: 'PHP 7,800', note: '官方费用页列2025年7月后SSP费用，实际以学校请款为准。' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '官方费用页列2025年7月后SSP I-Card申请费用。' },
    { item: '教材费', amount: 'PHP 2,000起', note: '按课程、级别和学习周数变化。' },
    { item: '电费', amount: 'PHP 1,000起', note: '按住宿、周数和实际用电规则确认。' },
    { item: '宿舍押金', amount: 'PHP 2,000', note: '退房结算损坏、超额费用或杂费后处理。' },
    { item: '洗衣费', amount: 'PHP 35-65 / kg', note: '按实际使用量计算。' },
    { item: '午餐 / 晚餐', amount: '各PHP 2,500 / 周', note: '官方说明为周一至周五餐食追加参考，需按当期餐食政策确认。' },
    { item: '设施管理费', amount: 'PHP 1,000 / 周', note: '官方费用页列每周设施管理费参考。' },
    { item: '签证延长', amount: '按周数确认', note: '5周以上通常需要确认延签费用；长周期还需核对ACR I-Card。' },
    { item: '机票与保险', amount: '另行准备', note: '官方费用页说明机票、海外旅行保险不包含在基础费用中。' },
    { item: '接送机', amount: '需确认', note: '家庭、未成年和夜间抵达建议提前安排并确认费用。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '亲子游学或带低龄儿童同行', text: '课程、住宿和看护服务都围绕亲子场景设计，家长更容易安排上课与陪同。' },
    { title: '想住在麦克坦、靠近机场和海岛生活', text: 'Mactan Newtown周边生活配套集中，周末活动和机场往返都相对方便。' },
    { title: '希望一对一课比例高', text: 'GENERAL已经有6节一对一，短期学生可以把时间集中在口语、发音和表达修正。' },
    { title: '偏好日本式学校管理与支持', text: 'First English由日本团队运营，官方信息强调日式服务和TESOL资质教师。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想要大型校园和度假村式设施', text: 'First English更像城市型学习点和住宿组合，不是CIA、CPI那类大型校内校园。' },
    { title: '目标是严格斯巴达考试冲刺', text: '它更适合亲子、一对一口语和灵活学习，强制自习型雅思冲刺可比较EV、CPI、Baguio学校。' },
    { title: '只按网页价格做最终预算', text: '官网原始费用已在本页换算为美元展示，仍需要把入学金、当地PHP费用、餐食、机票保险和汇率一起确认。' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'First English Global College官网', url: 'https://www.firstcebu.com/' },
    { label: 'First English官方费用表', url: 'https://www.firstcebu.com/price/' },
    { label: 'First English教室介绍', url: 'https://www.firstcebu.com/classroom/' },
    { label: 'First English住宿介绍', url: 'https://www.firstcebu.com/room/' },
    { label: 'First English亲子游学说明', url: 'https://www.firstcebu.com/cebu-con/' },
    { label: 'First English 2026公开学校信息', url: 'https://matchingenglish.com/ph/first-english' },
    { label: 'Study Philippines费用参考', url: 'https://www.study-philippines.com/school/13.html' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '环境', target: 'environment', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '住宿', target: 'life', icon: 'apartment' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') return this.galleryImages;
    return this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedPackage(): FeePackage {
    return this.feePackages.find((item) => item.id === this.selectedPackageId) ?? this.feePackages[0];
  }

  get baseFeeJpy(): number {
    return this.selectedPackage.prices[this.selectedWeeks];
  }

  get estimatedTotalJpy(): number {
    return this.baseFeeJpy + this.entranceFeeJpy;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsdFromJpy(this.estimatedTotalJpy)} 起`;
  }

  get baseFeeText(): string {
    return `USD ${this.formatUsdFromJpy(this.baseFeeJpy)}`;
  }

  get entranceFeeText(): string {
    return `USD ${this.formatUsdFromJpy(this.entranceFeeJpy)}`;
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

  formatUsdFromJpy(value: number): string {
    return this.formatUsd(value * this.jpyToUsd);
  }

  formatUsd(value: number): string {
    return Math.round(value).toLocaleString('en-US');
  }
}
