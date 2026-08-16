import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校区' | '课程' | '住宿' | '生活';
type WeekOption = 4 | 14 | 18;

interface SnapshotCard { icon: string; title: string; text: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; text: string; src: string; }
interface CourseItem { icon: string; name: string; lessons: string; suitable: string; }
interface FeePackage { id: string; name: string; duration: string; weeks: WeekOption; tuition: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface FitItem { title: string; text: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface SourceLink { label: string; url: string; }
interface SideNavItem { label: string; target: string; icon: string; }

@Component({
  selector: 'app-lapulapu-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lapulapu-school.component.html',
  styleUrl: './lapulapu-school.component.css',
})
export class LapulapuSchoolComponent {
  readonly weekOptions: WeekOption[] = [4, 14, 18];
  readonly admissionFeeUsd = 200;
  readonly oneOnOneFeePhp = 200;
  selectedWeeks: WeekOption = 4;
  selectedProgramId = 'short-4';
  selectedStartDate = '2026-09-07';
  selectedGalleryCategory: GalleryCategory = '全部';
  quoteCalculated = false;

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '课程', '住宿', '生活'];

  readonly snapshotCards: SnapshotCard[] = [
    { icon: 'account_balance', title: '大学型英语项目', text: 'LCIC不是传统语言学校，而是菲律宾政府认可的College体系下的CELS英语项目。' },
    { icon: 'location_on', title: 'Lapu-Lapu City校区', text: '地址在Ticgahon 1 Road, Bankal，靠近Mactan-Cebu机场和麦克坦生活圈。' },
    { icon: 'calendar_month', title: '固定档期制', text: '2026公开档期以4周短期、14周和18周中期项目为主，不是每周任意入学。' },
    { icon: 'bedroom_parent', title: '国际生私人房', text: '国际学生住校内share-house式宿舍，通常拥有私人房间并共享公共生活区。' },
    { icon: 'groups', title: 'Buddy System', text: '国际学生可与菲律宾本地学生配对，课后用英语交流、复习和参与校园生活。' },
    { icon: 'workspace_premium', title: '学分与校园体验', text: '课程可按大学规则申请学分认可，适合大学生、长期规划和重视校园体验的人。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校区',
      title: 'LCIC麦克坦校区鸟瞰',
      text: '白色教学楼与开放草坪构成大学型校园，不是普通城市楼宇语言学校。',
      src: 'https://lcic.jp/assets/images/index/index-main-1-2022.jpg',
    },
    {
      category: '校区',
      title: 'Lapulapu-Cebu International College',
      text: '学校官网介绍LCIC位于Lapu-Lapu City，提供国际化教育与多语言人才培养。',
      src: 'https://lcic.edu.ph/assets/img/historical-lcic-img.webp',
    },
    {
      category: '生活',
      title: '校园与Buddy交流环境',
      text: 'LCIC强调国际学生和菲律宾本地学生共同学习生活，Buddy System是页面核心亮点之一。',
      src: 'https://media.assettype.com/sunstar/2023-12/0be6e8c6-44b2-488e-beec-13281aa2362f/buddy.jpg?auto=format%2Ccompress&fit=max&w=1200',
    },
    {
      category: '住宿',
      title: '国际学生私人房',
      text: '宿舍提供私人学习和休息空间，适合重视睡眠、隐私和长期稳定生活的学生。',
      src: 'https://lcic.jp/x9dswmg8/wp-content/themes/lcic/images/domitory/img-domitory-2022-2.jpg',
    },
    {
      category: '住宿',
      title: 'Share-house式宿舍房间',
      text: '公开资料显示每个宿舍单元有私人房和共享房，公共空间便于跨文化交流。',
      src: 'https://storage.googleapis.com/world-study-prod/media/school_photo/3069/5fd67dc3-68ba-4569-8e13-a54b26e729fc.jpg',
    },
    {
      category: '生活',
      title: '宿舍交流空间参考',
      text: 'LCIC住宿更接近大学宿舍生活，适合想要校园社群而非酒店式住宿的人。',
      src: 'https://www.ryugaku-onebridge.com/api/pict/7123?s=750x500',
    },
  ];

  readonly courses: CourseItem[] = [
    { icon: 'calendar_view_month', name: 'Short-Term Study Abroad', lessons: '4周固定档期', suitable: '适合大学寒暑假、第一次体验LCIC校园和希望费用一次打包的人。' },
    { icon: 'event_repeat', name: 'Mid-Term Study Abroad 14 weeks', lessons: '14周中期项目', suitable: '适合想把英语、跨文化课程和校园生活做成一段完整经历的学生。' },
    { icon: 'school', name: 'Mid-Term Study Abroad 18 weeks', lessons: '18周中期项目', suitable: '适合希望更深度融入校园、远程修读大学课程或规划学分认可的人。' },
    { icon: 'record_voice_over', name: 'English Skills Courses', lessons: '阅读 / 写作 / 听说 / 发表', suitable: '课程按英语能力分级，覆盖Presentation、Communication、TOEIC S&W等主题。' },
    { icon: 'public', name: 'Culture & General Education', lessons: 'SDGs / 菲律宾文化 / 多语言', suitable: '适合希望英语之外接触菲律宾文化、韩语、中文、Tagalog等选修方向的人。' },
    { icon: 'groups_2', name: 'Buddy System / One-on-One', lessons: 'Buddy免费；教师1:1另付PHP 200/节', suitable: '适合想课后继续开口、和菲律宾本地学生自然交流的学生。' },
  ];

  readonly feePackages: FeePackage[] = [
    { id: 'short-4', name: 'Short-Term Study Abroad', duration: '2026年4周短期项目', weeks: 4, tuition: 2080, note: '费用含课程、宿舍、三餐和水电；教材、机票、保险等另计。' },
    { id: 'mid-14', name: 'Mid-Term Study Abroad', duration: '2026年14周中期项目', weeks: 14, tuition: 7280, note: '适合需要更长校园体验和课程累计的人。' },
    { id: 'mid-18', name: 'Mid-Term Study Abroad', duration: '2026年18周中期项目', weeks: 18, tuition: 9360, note: '2026春季和秋季均有公开档期，需按具体入学日确认。' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '08:00', title: '早餐', text: '公开课程生活页列出早上先在校内用餐，再进入当天课程。' },
    { time: '08:30 - 11:40', title: '上午课程', text: '示例课表包含Hospitality English、Presentation Skills、Listening & Speaking等。' },
    { time: '11:40 - 12:50', title: '午餐', text: '校内餐食包含在主费用中，午餐公开说明可从数种形式中选择。' },
    { time: '12:50 - 16:00', title: '下午课程', text: '下午可能安排English Communication Skills、SDGs、菲律宾文化或多语言课程。' },
    { time: '16:00 - 18:00', title: 'Buddy / 1:1', text: '5、6节课可安排Student Buddy System或额外教师一对一课程。' },
    { time: '19:00', title: '晚餐与宿舍生活', text: '宿舍设学习室、活动室、浴场、桑拿、洗衣区和24小时管理支持。' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 200', note: '每次游学期间一次性支付；公开说明包含机场校车、学生签证、ACR I-Card和SSP。' },
    { item: '主费用包含', amount: '课程 + 宿舍 + 三餐 + 水电', note: 'LCIC公开费用以打包价呈现，和普通语言学校分开列课程/房型不同。' },
    { item: '教材费', amount: '到校另付', note: '官方说明额外课程教材需现场另付，第三方资料列短期约PHP 1,700-8,000参考。' },
    { item: '教师一对一', amount: 'PHP 200 / 50分钟', note: '可选5、6节课，每天最多2节，现场以菲律宾比索支付。' },
    { item: '额外住宿', amount: 'PHP 1,200 / 晚', note: '提前周六入住或周日延后退房时可能收取，需提前确认。' },
    { item: '外部洗衣', amount: 'PHP 30 / kg', note: '宿舍有免费洗衣机，也可使用外部洗衣服务。' },
    { item: '床品更换', amount: 'PHP 200 / 次', note: '常规更换外如主动要求更换，公开Q&A列此参考费用。' },
    { item: '机票与保险', amount: '按实际', note: '往返Mactan-Cebu机场交通、保险和个人生活费不含在学校主费用中。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '大学生或刚毕业学生', text: 'LCIC公开说明目标人群包括大学、短大、研究生等学生，也适合部分准大学生和应届毕业生。' },
    { title: '想要校园型学习体验', text: '它更像大学短中期交换体验，包含校园、学分、Buddy、宿舍和跨文化课程。' },
    { title: '重视住宿安全和私人房', text: '宿舍有24小时管理、安保、门禁、医护支持，国际学生以私人房为卖点。' },
    { title: '希望费用结构简单', text: '公开主费用包含课程、宿舍、三餐和水电，再加一次性入学金，比普通语言学校费用项更集中。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想每周灵活入学', text: 'LCIC以固定档期为主，不能像多数宿务语言学校一样随时每周入学。' },
    { title: '只想要高强度一对一ESL', text: '主课程是大学型小班和选修组合，教师一对一是额外付费选项，不是全天一对一学校。' },
    { title: '想住酒店或度假村', text: '住宿是校内share-house式宿舍，优势是校园生活和安全管理，不是酒店式舒适路线。' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'LCIC官方首页', url: 'https://www.lcic.edu.ph/' },
    { label: 'LCIC官方宿舍页', url: 'https://lcic.edu.ph/dormitory.html' },
    { label: 'LCIC-CELS费用与奖学金页', url: 'https://cels.lcic.edu.ph/fees-scholarships/' },
    { label: 'LCIC 2026课程档期与费用', url: 'https://lcic.jp/en/course/' },
    { label: 'LCIC六大特色', url: 'https://lcic.jp/en/point/' },
    { label: 'LCIC Q&A', url: 'https://lcic.jp/en-faq/' },
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

  get selectedProgram(): FeePackage {
    return this.feePackages.find((item) => item.id === this.selectedProgramId) ?? this.feePackages[0];
  }

  get selectedProgramWeeks(): WeekOption {
    return this.selectedProgram.weeks;
  }

  get baseFeeUsd(): number {
    return this.selectedProgram.tuition;
  }

  get estimatedTotalUsd(): number {
    return this.baseFeeUsd + this.admissionFeeUsd;
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

  selectProgram(programId: string): void {
    this.selectedProgramId = programId;
    this.selectedWeeks = this.selectedProgramWeeks;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
    this.selectedWeeks = this.selectedProgramWeeks;
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
