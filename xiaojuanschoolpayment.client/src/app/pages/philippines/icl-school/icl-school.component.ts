import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import { IuIclQuote } from '../iu-school/iu-icl-quote';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';

interface SnapshotCard { icon: string; title: string; text: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; text: string; src: string; }
interface CourseItem { icon: string; name: string; lessons: string; suitable: string; }
interface CourseFee { id: string; category: string; name: string; tuition4Weeks: number; lessons: string; note: string; minimumWeeks?: 8 | 12; }
interface RoomFee { id: string; name: string; fee4Weeks: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface FitItem { title: string; text: string; }
interface SourceLink { label: string; url: string; }
interface SideNavItem { label: string; target: string; icon: string; }

@Component({
  selector: 'app-icl-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SidaWhySectionComponent, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './icl-school.component.html',
  styleUrl: './icl-school.component.css',
})
export class IclSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolName = '菲律宾宿务ICL English Academy';
  readonly weekOptions = Array.from({ length: 24 }, (_, index) => index + 1);
  readonly registrationFeeUsd = 100;
  readonly quoteCalculator = new IuIclQuote('ICL', 'power-speaking-4', 'campus-quad', '2026-10-04');
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
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
    { icon: 'light_mode', name: 'Light Speaking', lessons: '一对一4 + 选修课或自习', suitable: '预算优先、想保留较多课后时间，或短期先体验宿务游学的学生。' },
    { icon: 'record_voice_over', name: 'Power Speaking 4', lessons: '一对一4 + 团体4 + 选修课或自习', suitable: 'ICL标准口语路线，适合多数成人学生和第一次宿务游学。' },
    { icon: 'bolt', name: 'Power Speaking 6 / 8', lessons: '一对一6 + 团体2，或一对一8 + 选修课/自习', suitable: '想明显增加一对一练习量、短期集中开口的学生。' },
    { icon: 'task_alt', name: 'IELTS / IELTS保证班', lessons: '一对一4或6 + 团体4或2 + 选修/自习/模考', suitable: '有目标分数、需要听说读写拆分训练与规律模拟测验的学生。' },
    { icon: 'fact_check', name: 'TOEIC', lessons: '一对一4 + 团体4', suitable: '需要多益听读提分、职场英文证照或就业准备的学生。' },
    { icon: 'business_center', name: '商务英语 4 / 6', lessons: '一对一4 + 团体4，或一对一6 + 团体2', suitable: '需要职场沟通、商务会议和专业表达训练的学生。' },
    { icon: 'family_restroom', name: '青少年 7–15岁', lessons: '一对一4 + 团体2或4 + 科学数学/体育活动', suitable: '7-15岁青少年和亲子短期方案，年龄不同时课程组合不同。' },
  ];

  readonly courseFees = this.quoteCalculator.courses;
  readonly roomFees = this.quoteCalculator.rooms;
  get localFees() { return this.quoteCalculator.localFees; }

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

  ngOnInit(): void {
    this.loadPricingFromDatabase();
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe(snapshot => {
      if (!Number.isFinite(snapshot.usdToCny) || snapshot.usdToCny <= 0 || !Number.isFinite(snapshot.phpPerCny) || snapshot.phpPerCny <= 0) return;
      this.usdToCny = snapshot.usdToCny;
      this.phpPerCny = snapshot.phpPerCny;
      this.exchangeRateDate = snapshot.date;
      this.exchangeRateLive = true;
    });
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolName }).pipe(
      switchMap(schools => {
        const school = schools.find(item => item.name === this.pricingSchoolName) ?? schools.find(item => item.name.includes('ICL English Academy')) ?? schools[0];
        if (!school?.id) return EMPTY;
        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms }) => this.applyPricingData(lessons, rooms));
  }

  private applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[]): void {
    this.quoteCalculator.updatePrices(
      new Map(lessons.filter(item => item.week === 4).map(item => [item.name, item.price])),
      new Map(rooms.filter(item => item.week === 4).map(item => [item.name, item.price])),
    );
  }

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') return this.galleryImages;
    return this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedCourse() {
    return this.courseFees.find((item) => item.id === this.selectedCourseId) ?? this.courseFees[0];
  }

  get selectedRoom() {
    return this.roomFees.find((item) => item.id === this.selectedRoomId) ?? this.roomFees[0];
  }

  get availableWeekOptions(): number[] { return this.weekOptions; }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteCalculator.total)} 美元`; }
  get courseFeeText(): string { return `${this.formatUsd(this.quoteCalculator.regularCourseTotal)} 美元`; }
  get roomFeeText(): string { return `${this.formatUsd(this.quoteCalculator.regularRoomTotal)} 美元`; }
  get baseFeeText(): string { return `${this.formatUsd(this.quoteCalculator.regularCourseTotal + this.quoteCalculator.regularRoomTotal)} 美元`; }
  get selectedCourseId(): string { return this.quoteCalculator.plan.courses[0].optionId; }
  set selectedCourseId(value: string) { this.quoteCalculator.plan.courses[0].optionId = value; }
  get selectedRoomId(): string { return this.quoteCalculator.plan.rooms[0].optionId; }
  set selectedRoomId(value: string) { this.quoteCalculator.plan.rooms[0].optionId = value; }
  get selectedWeeks(): number { return this.quoteCalculator.plan.courseWeeks; }
  set selectedWeeks(value: number) { this.quoteCalculator.plan.courses[0].weeks = value; this.quoteCalculator.plan.rooms[0].weeks = value; }
  get selectedStartDate(): string { return this.quoteCalculator.plan.startDate; }
  set selectedStartDate(value: string) { this.quoteCalculator.plan.courses[0].startDate = value; this.quoteCalculator.plan.rooms[0].startDate = value; }
  ensureValidStudyLength(): void {
    const fixedWeeks = this.selectedCourse.fixedWeeks;
    if (fixedWeeks) this.selectedWeeks = fixedWeeks;
  }
  get quoteHeading(): string { return `ICL${this.quoteCalculator.courseWeeks}周报价`; }
  get schoolPaymentItems() { return this.quoteCalculator.schoolPaymentItems; }
  get quoteError(): string { return this.quoteCalculator.error; }
  get quoteWarning(): string { return this.quoteCalculator.warning; }
  get localFeesTotal(): number { return this.quoteCalculator.localFeeTotal; }
  get quoteCnyText(): string { return `人民币预计约 ${Math.round(this.quoteCalculator.total * this.usdToCny).toLocaleString('zh-CN')} 元`; }
  get localFeesCnyText(): string { return `人民币预计约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }
  get exchangeRateText(): string { return `${this.exchangeRateLive ? `参考汇率日期${this.exchangeRateDate}` : '备用汇率估算'}：1美元≈${this.formatUsd(this.usdToCny)}人民币，1人民币≈${this.formatUsd(this.phpPerCny)}比索`; }
  get quoteImageData() { return this.quoteCalculator.imageData(this.usdToCny, this.phpPerCny, this.exchangeRateLive ? this.exchangeRateDate : undefined, '/assets/iu/iu-icl-low-season-promo-2026.jpg'); }
  formatPhp(value: number): string { return `${this.formatUsd(value)} 比索`; }

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
