import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import { CellaQuoteCalculatorComponent } from '../cella-quote/cella-quote-calculator.component';
import { cellaCourses, cellaRooms } from '../cella-quote/cella-pricing';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';

interface SnapshotCard { icon: string; title: string; text: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; text: string; src: string; }
interface CourseItem { icon: string; name: string; lessons: string; suitable: string; }
interface FitItem { title: string; text: string; }
interface SourceLink { label: string; url: string; }
interface SideNavItem { label: string; target: string; icon: string; }

@Component({
  selector: 'app-cella-uni-sparta-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, SidaWhySectionComponent, CellaQuoteCalculatorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cella-uni-sparta-school.component.html',
  styleUrl: './cella-uni-sparta-school.component.css',
})
export class CellaUniSpartaSchoolComponent {
  readonly pricingCourses = cellaCourses('uni');
  readonly pricingRooms = cellaRooms('uni');
  selectedGalleryCategory: GalleryCategory = '全部';

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

  readonly suitableFor: FitItem[] = [
    { title: '想要强学习节奏', text: '晨间课、日间课程、晚间课和词汇测试构成固定节奏，适合需要外部纪律推动的人。' },
    { title: '目标是口语或考试', text: 'Power Speaking适合开口训练；IELTS、TOEIC和Guarantee路线适合明确分数目标。' },
    { title: '希望中小型校区', text: 'Uni Campus规模较紧凑，学生、老师和办公室距离近，适合想要比较集中管理的人。' },
    { title: '想读TESOL或短期密集', text: 'TESOL和Expresser是CELLA Uni比较有辨识度的课程，可按入学日和假期长短确认。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想要自由型学校', text: 'Uni Sparta学习管理更强，若希望课后自由度高，可以比较CIA、I.BREEZE或3D等半斯巴达/自由型学校。' },
    { title: '只想住海边度假区', text: 'CELLA Uni在宿务市Talamban区域，不是Mactan海边校区；若看重海边，可比较Cebu Blue Ocean或Genius。' },
    { title: '不想承担当地费用', text: '课程食宿费之外，SSP、签证、水电管理、教材、押金和接机等比索费用需要单独预算。' },
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

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
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
