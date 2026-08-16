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
interface FeeSummaryRow { course: string; lessons: string; room: string; price: string; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface FitItem { title: string; text: string; }
interface SourceLink { label: string; url: string; }
interface SideNavItem { label: string; target: string; icon: string; }

@Component({
  selector: 'app-cella-uni-sparta-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cella-uni-sparta-school.component.html',
  styleUrl: './cella-uni-sparta-school.component.css',
})
export class CellaUniSpartaSchoolComponent {
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  readonly registrationFeeUsd = 150;
  readonly peakSeasonWeeklyUsd = 40;
  selectedWeeks: WeekOption = 4;
  selectedPackageId = 'ps1-quad';
  selectedStartDate = '2026-09-07';
  selectedGalleryCategory: GalleryCategory = '全部';
  quoteCalculated = false;

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '生活'];

  readonly snapshotCards: SnapshotCard[] = [
    { icon: 'history_edu', title: '2006年创校老牌CELLA', text: 'CELLA是宿务运营多年的语言学校，Uni校区于Talamban区域发展为成人与考试路线更集中的校区。' },
    { icon: 'verified', title: '2026转为Uni Sparta', text: '公开资料显示Uni Campus自2026年进入全斯巴达管理，包含晨间、日间、晚间学习节奏。' },
    { icon: 'record_voice_over', title: 'Power Speaking主线', text: 'Power Speaking 1/2按一对一课时分层，适合想用密集日程提高开口量的学生。' },
    { icon: 'task_alt', title: 'IELTS / TOEIC / TESOL', text: 'Uni校区覆盖TOEIC、IELTS、IELTS Guarantee和TESOL，适合考试或教师资格方向。' },
    { icon: 'pool', title: '泳池、健身房与咖啡区', text: '公开Facebook内容提到Uni新增Gym & Cafe，公开学校资料也展示泳池、食堂、诊所和自习空间。' },
    { icon: 'bed', title: '校内与JDN外部寮', text: '4周费用按课程学费加宿舍费计算，校内1/2/3/4人房与JDN外部1/2/3人房可比较。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校区',
      title: 'CELLA Uni泳池区',
      text: 'Uni校区公开图片展示泳池与休息区，适合课后放松，也让斯巴达校区不至于只有学习压力。',
      src: 'https://cebu21.jp/include/schoolno5/cellaunicenter/Pool/photocuc_29.jpg',
    },
    {
      category: '校区',
      title: 'CELLA Uni入口大厅',
      text: 'Talamban校区是中小型规模，入口、办公室和学生支持空间集中在同一学习生活动线。',
      src: 'https://cebu-english.com/wp2017/wp-content/uploads/2023/03/1012.jpg',
    },
    {
      category: '教室',
      title: 'Study Room与小组空间',
      text: 'Power Speaking、考试课程和晚间学习需要稳定教室与自习空间支撑。',
      src: 'https://cebu21.jp/include/schoolno5/cellaunicenter/Study%20rooms/photocuc_33.jpg',
    },
    {
      category: '住宿',
      title: 'Uni校内三人房',
      text: '公开资料列出1/2/3/4人房，房间通常含床、桌椅、空调、柜子和基础生活设备。',
      src: 'https://www.fujiyama-international.com/archives/004/202204/f0d99cabec9b90869774bda5166703b6.jpg',
    },
    {
      category: '生活',
      title: '明亮食堂空间',
      text: '公开资料显示CELLA提供平日三餐、周末两餐，食堂以多国籍学生都能接受的餐食为目标。',
      src: 'https://www.easy-go.mn/uploads/school-photo/middle/easy-go-school-photo-16656460001.jpg',
    },
    {
      category: '住宿',
      title: 'Uni校内四人房',
      text: '四人房是CELLA Uni Sparta较常用的预算入口，适合能接受多人住宿并优先控制费用的人。',
      src: 'https://cebu21.jp/include/schoolno2/cellaunicenter/Room/%20Quad%20%281%29.jpg',
    },
  ];

  readonly courses: CourseItem[] = [
    { icon: 'record_voice_over', name: 'Power Speaking 1', lessons: '一对一4 + Native Group1 + Group3', suitable: 'CELLA Uni标准ESL路线，适合第一次宿务游学、想提升口语与综合能力的成人学生。' },
    { icon: 'bolt', name: 'Power Speaking 2', lessons: '一对一6 + Native Group1 + Group1', suitable: '想明显提高一对一比例、短期强化开口和弱项修正的学生。' },
    { icon: 'fact_check', name: 'TOEIC Preparation / Intensive', lessons: '一对一4 + 小组4', suitable: '需要多益听读训练、职场证照或就业准备的人，可按基础选择Preparation或Intensive。' },
    { icon: 'task_alt', name: 'IELTS Preparation / Intensive / Guarantee', lessons: '一对一4-6 + 小组2-4 + 自习', suitable: '有雅思目标分数、需要写作口语反馈、模考和规律学习管理的学生。' },
    { icon: 'workspace_premium', name: 'TESOL', lessons: '2:8课程6 + e-learning2', suitable: '想取得英语教学方向资格、未来做教师或教育工作的学生；通常有指定入学日。' },
    { icon: 'speed', name: 'Expresser 1 / 2', lessons: '短期密集一对一9 + 小组1', suitable: '只有1-2周假期、希望最大化一对一课时和短期输出量的学生。' },
  ];

  readonly feePackages: FeePackage[] = [
    { id: 'ps1-quad', category: '最低预算', course: 'Power Speaking 1', room: '4人房', lessons: '一对一4 + Native Group1 + Group3', prices: this.buildPrices(1630), note: '2026公开4周学费USD 930 + 4人房USD 700，适合预算优先。' },
    { id: 'ps1-triple', category: '舒适预算', course: 'Power Speaking 1', room: '3人房', lessons: '一对一4 + Native Group1 + Group3', prices: this.buildPrices(1730), note: '室友更少，仍保留标准课程与较好性价比。' },
    { id: 'ps1-double', category: '双人房', course: 'Power Speaking 1', room: '2人房', lessons: '一对一4 + Native Group1 + Group3', prices: this.buildPrices(1830), note: '住宿舒适度和预算较平衡，适合多数成人学生。' },
    { id: 'ps1-single', category: '单人房', course: 'Power Speaking 1', room: '1人房', lessons: '一对一4 + Native Group1 + Group3', prices: this.buildPrices(2230), note: '适合重视睡眠、隐私和独立学习空间的人。' },
    { id: 'ps2-quad', category: '高一对一', course: 'Power Speaking 2', room: '4人房', lessons: '一对一6 + Native Group1 + Group1', prices: this.buildPrices(1780), note: '比PS1多两节一对一，适合短期想加速口语输出。' },
    { id: 'toeic-prep-quad', category: '多益基础', course: 'TOEIC Preparation', room: '4人房', lessons: 'TOEIC一对一4 + ESL小组4', prices: this.buildPrices(1780), note: '适合多益基础备考，同时保留一般英语小组课。' },
    { id: 'toeic-intensive-quad', category: '多益强化', course: 'TOEIC Intensive', room: '4人房', lessons: 'TOEIC一对一4 + TOEIC小组4', prices: this.buildPrices(1880), note: '小组课也转为多益方向，适合目标更明确的学生。' },
    { id: 'ielts-prep-quad', category: '雅思基础', course: 'IELTS Preparation', room: '4人房', lessons: 'IELTS一对一4 + ESL小组4', prices: this.buildPrices(1780), note: '适合雅思入门、基础补强和逐步进入考试节奏。' },
    { id: 'ielts-intensive-quad', category: '雅思强化', course: 'IELTS Intensive', room: '4人房', lessons: 'IELTS一对一4 + IELTS小组4', prices: this.buildPrices(1880), note: '适合听说读写都希望进入考试型训练的人。' },
    { id: 'ps1-jdn-double', category: 'JDN外部寮', course: 'Power Speaking 1', room: 'JDN 2人房', lessons: '一对一4 + Native Group1 + Group3', prices: this.buildPrices(1830), note: '公开资料显示JDN外部寮2人房与校内2人房同价，需确认空房与接驳。' },
  ];

  readonly feeSummaryRows: FeeSummaryRow[] = [
    { course: 'Power Speaking 1', lessons: '一对一4 + Native Group1 + Group3', room: '4人房', price: 'USD 1,630 / 4周', note: '标准最低预算，不含入学金' },
    { course: 'Power Speaking 1', lessons: '一对一4 + Native Group1 + Group3', room: '3人房', price: 'USD 1,730 / 4周', note: '减少室友人数' },
    { course: 'Power Speaking 1', lessons: '一对一4 + Native Group1 + Group3', room: '2人房', price: 'USD 1,830 / 4周', note: '双人房常用方案' },
    { course: 'Power Speaking 1', lessons: '一对一4 + Native Group1 + Group3', room: '1人房', price: 'USD 2,230 / 4周', note: '单人房预算' },
    { course: 'Power Speaking 2', lessons: '一对一6 + Native Group1 + Group1', room: '4人房', price: 'USD 1,780 / 4周', note: '高一对一ESL' },
    { course: 'TOEIC / IELTS Preparation', lessons: '一对一4 + 小组4', room: '4人房', price: 'USD 1,780 / 4周', note: '考试基础路线' },
    { course: 'TOEIC / IELTS Intensive', lessons: '一对一4 + 考试小组4', room: '4人房', price: 'USD 1,880 / 4周', note: '考试强化路线' },
    { course: 'IELTS Guarantee', lessons: '一对一6 + IELTS小组2 + 特别课', room: '4人房', price: 'USD 6,240 / 12周', note: '保证班通常按12周确认' },
    { course: 'TESOL', lessons: '2:8课程6 + e-learning2', room: '4人房', price: 'USD 2,430 / 4周', note: '指定入学日课程' },
    { course: 'Expresser 1 / 2', lessons: '短期密集一对一9 + 小组1', room: '4人房', price: 'USD 850 / 1周；USD 1,280 / 2周', note: '短期保证班' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 150', note: '一次性费用，本页报价器已加入。' },
    { item: '旺季加价', amount: 'USD 40 / 周', note: '公开资料列2026/7/5-8/29、2027/7/4-8/28为旺季；本页按入学日落在旺季时估算。' },
    { item: '未成年管理费', amount: 'USD 25 / 周', note: '15-18岁未成年学生可能适用，报名时需按年龄确认。' },
    { item: 'SSP + E-Card', amount: 'PHP 12,300', note: 'SSP 7,800 + SSP E-Card 4,500。' },
    { item: '签证延长', amount: 'PHP 5,140起', note: '超过30天通常需办理，12周、16周、20周、24周对应不同阶段。' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '通常9周以上需要办理。' },
    { item: '宿舍押金', amount: 'PHP 2,000-10,000', note: '按学习周数分段，退房检查后依学校规则退还。' },
    { item: '水电与管理费', amount: 'PHP 1,800 / 周', note: '电费500/周、水费300/周、管理费1,000/周；超额用电另计。' },
    { item: '教材 / ID / 接机', amount: 'PHP 200-600 / 册起', note: 'ID 200；个人接机1,200，家庭接机2,500，教材按实际课程购买。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想要强学习节奏', text: '晨间课、日间课程、晚间课和词汇测试构成固定节奏，适合需要外部纪律推动的人。' },
    { title: '目标是口语或考试', text: 'Power Speaking适合开口训练；IELTS、TOEIC和Guarantee路线适合明确分数目标。' },
    { title: '希望中小型校区', text: 'Uni Campus规模较紧凑，学生、老师和办公室距离近，适合想要比较集中管理的人。' },
    { title: '想读TESOL或短期密集', text: 'TESOL和Expresser是CELLA Uni比较有辨识度的课程，可按入学日和假期长短确认。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想要自由型学校', text: 'Uni Sparta学习管理更强，若希望课后自由度高，可以比较CIA、I.BREEZE或3D等半斯巴达/自由型学校。' },
    { title: '只想住海边度假区', text: 'CELLA Uni在宿务市Talamban区域，不是Mactan海边校区；若看重海边，可比较Cebu Blue Ocean或Genius。' },
    { title: '不想承担当地费用', text: '课程食宿费之外，SSP、签证、水电管理、教材、押金和接机等PHP费用需要单独预算。' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'CELLA官方Facebook', url: 'https://www.facebook.com/bestcella' },
    { label: 'CELLA Facebook公开内容镜像', url: 'https://www.schoolandcollegelistings.com/PH/Cebu-City/1475388386039731/CELLA---CELLA-English-Academy' },
    { label: 'CELLA Uni 2026费用与学校资料', url: 'https://www.fujiyama-international.com/philippines/cella.html' },
    { label: 'CEBU English CELLA Uni费用表', url: 'https://cebu-english.com/school/cella-uni/' },
    { label: 'CELLA学校网站', url: 'https://www.cellaenglish.com/' },
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

  get peakSeasonChargeUsd(): number {
    return this.isPeakSeasonStart ? this.selectedWeeks * this.peakSeasonWeeklyUsd : 0;
  }

  get estimatedTotalUsd(): number {
    return this.baseFeeUsd + this.registrationFeeUsd + this.peakSeasonChargeUsd;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.estimatedTotalUsd)} 起`;
  }

  get baseFeeText(): string {
    return `USD ${this.formatUsd(this.baseFeeUsd)}`;
  }

  get peakSeasonChargeText(): string {
    return this.peakSeasonChargeUsd > 0 ? `USD ${this.formatUsd(this.peakSeasonChargeUsd)}` : 'USD 0';
  }

  get peakSeasonStatusText(): string {
    return this.isPeakSeasonStart ? '当前入学日落在公开旺季期间，已按USD 40/周估算。' : '当前入学日未落在公开旺季期间。';
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

  private buildPrices(fourWeekPrice: number): Record<WeekOption, number> {
    return {
      1: Math.round(fourWeekPrice * 0.4),
      2: Math.round(fourWeekPrice * 0.65),
      3: Math.round(fourWeekPrice * 0.85),
      4: fourWeekPrice,
      8: fourWeekPrice * 2,
      12: fourWeekPrice * 3,
      16: fourWeekPrice * 4,
      20: fourWeekPrice * 5,
      24: fourWeekPrice * 6,
    };
  }

  private get isPeakSeasonStart(): boolean {
    const start = new Date(`${this.selectedStartDate}T00:00:00`);
    if (Number.isNaN(start.getTime())) return false;
    return this.isBetween(start, '2026-07-05', '2026-08-29') || this.isBetween(start, '2027-07-04', '2027-08-28');
  }

  private isBetween(date: Date, from: string, to: string): boolean {
    return date >= new Date(`${from}T00:00:00`) && date <= new Date(`${to}T23:59:59`);
  }
}
