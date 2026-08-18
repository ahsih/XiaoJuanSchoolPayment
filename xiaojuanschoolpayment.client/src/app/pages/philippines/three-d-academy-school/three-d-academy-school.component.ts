import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';
type WeekOption = 4 | 8 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

interface SnapshotCard { icon: string; title: string; text: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; text: string; src: string; }
interface CourseItem { icon: string; name: string; lessons: string; suitable: string; }
interface TuitionOption { id: string; name: string; lessons: string; price4Weeks: number; note: string; }
interface AccommodationOption { id: string; name: string; price4Weeks: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface FitItem { title: string; text: string; }
interface SourceLink { label: string; url: string; }
interface SideNavItem { label: string; target: string; icon: string; }

@Component({
  selector: 'app-three-d-academy-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SidaWhySectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './three-d-academy-school.component.html',
  styleUrl: './three-d-academy-school.component.css',
})
export class ThreeDAcademySchoolComponent {
  readonly weekOptions: WeekOption[] = [4, 8, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  readonly registrationFeeUsd = 100;
  selectedWeeks: WeekOption = 4;
  selectedCourseId = 'general-esl';
  selectedAccommodationId = 'campus-six';
  selectedStartDate = '2026-09-07';
  selectedGalleryCategory: GalleryCategory = '全部';
  quoteCalculated = false;

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '生活'];

  readonly snapshotCards: SnapshotCard[] = [
    { icon: 'location_on', title: 'JY Square市中心位置', text: '学校位于Lahug的JY Square商业区，教室、宿舍、餐厅和日常生活设施集中，通勤成本低。' },
    { icon: 'payments', title: '宿务高性价比', text: '当前费用表中，General ESL加校内六人房的4周课程住宿费为USD 1,189。' },
    { icon: 'record_voice_over', title: '一对一课时充足', text: 'General ESL每天安排4节一对一和3节团体课；Intensive ESL与Power MTM可进一步增加一对一课时。' },
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
      text: 'General ESL、考试、商务和讨论课程会结合一对一与团体课，重视真实沟通。',
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
    { icon: 'menu_book', name: 'General ESL', lessons: '一对一4 + 团体课3', suitable: '标准综合英语课程，适合第一次宿务游学和日常沟通能力提升。' },
    { icon: 'bolt', name: 'Intensive ESL', lessons: '一对一5 + 团体课3', suitable: '想增加一对一练习，同时保留团体互动的学生。' },
    { icon: 'workspace_premium', name: 'Power MTM', lessons: '一对一6', suitable: '希望集中进行高强度一对一口语输出的学生。' },
    { icon: 'task_alt', name: 'TOEFL / TOEIC / IELTS', lessons: '一对一6，或预备课程一对一4 + 团体课3', suitable: '需要考试专项训练，或希望先用预备课程打基础的学生。' },
    { icon: 'business_center', name: 'Business English', lessons: '一对一4 + 团体课3', suitable: '适合会议、谈判、简报、求职或其他职场英语目标。' },
    { icon: 'family_restroom', name: 'Junior ESL / Guardian', lessons: '青少年一对一6；监护人不上课', suitable: 'Junior ESL适合12-17岁学生；陪同监护人可只选择住宿。' },
  ];

  readonly tuitionOptions: TuitionOption[] = [
    { id: 'general-esl', name: 'General ESL', lessons: '一对一4 + 团体课3', price4Weeks: 828, note: '标准综合英语课程' },
    { id: 'intensive-esl', name: 'Intensive ESL', lessons: '一对一5 + 团体课3', price4Weeks: 1018, note: '增加一对一练习' },
    { id: 'power-mtm', name: 'Power MTM', lessons: '一对一6', price4Weeks: 1198, note: '全一对一强化课程' },
    { id: 'junior-esl', name: '青少年ESL', lessons: '一对一6', price4Weeks: 1068, note: '适合12-17岁' },
    { id: 'exam', name: 'TOEFL / TOEIC / IELTS', lessons: '一对一6', price4Weeks: 898, note: '考试专项课程' },
    { id: 'exam-preparation', name: 'TOEFL / TOEIC / IELTS 预备课程', lessons: '一对一4 + 团体课3', price4Weeks: 898, note: '考试预备课程' },
    { id: 'business-english', name: '商务英语', lessons: '一对一4 + 团体课3', price4Weeks: 1018, note: '职场英语方向' },
    { id: 'sparta-management', name: '斯巴达管理', lessons: '早上词汇测试 + 晚自习', price4Weeks: 100, note: '课程管理附加项目' },
    { id: 'guardian', name: '监护人', lessons: '不上课', price4Weeks: 0, note: '陪同监护人课程费为USD 0' },
  ];

  readonly accommodationOptions: AccommodationOption[] = [
    { id: 'campus-single', name: '校内单人房', price4Weeks: 999, note: '校内宿舍' },
    { id: 'campus-twin', name: '校内双人房', price4Weeks: 823, note: '校内宿舍' },
    { id: 'campus-triple', name: '校内三人房', price4Weeks: 592, note: '校内宿舍' },
    { id: 'campus-quad', name: '校内四人房', price4Weeks: 482, note: '校内宿舍' },
    { id: 'campus-six', name: '校内六人房', price4Weeks: 361, note: '校内宿舍最低价房型' },
    { id: 'hotel-single', name: '校外酒店单人房', price4Weeks: 1182, note: 'MIT / Yello Hotel' },
    { id: 'hotel-twin', name: '校外酒店双人房', price4Weeks: 898, note: 'MIT / Yello Hotel' },
    { id: 'hotel-family-triple', name: '校外酒店三人房（亲子）', price4Weeks: 711, note: 'MIT / Yello Hotel' },
    { id: 'prestigio-single', name: 'Prestigio单人房', price4Weeks: 1320, note: '校外酒店Prestigio' },
    { id: 'prestigio-twin', name: 'Prestigio双人房', price4Weeks: 977, note: '校外酒店Prestigio' },
    { id: 'prestigio-family', name: 'Prestigio亲子房', price4Weeks: 906, note: '校外酒店Prestigio' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 100', note: '一次性费用，本页报价器已加入。' },
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
    { title: '想提高一对一口语', text: '从General、Intensive到Power MTM，可以按预算逐步增加一对一课时。' },
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

  get selectedCourse(): TuitionOption {
    return this.tuitionOptions.find((item) => item.id === this.selectedCourseId) ?? this.tuitionOptions[0];
  }

  get selectedAccommodation(): AccommodationOption {
    return this.accommodationOptions.find((item) => item.id === this.selectedAccommodationId) ?? this.accommodationOptions[0];
  }

  get tuitionFeeUsd(): number {
    return this.selectedCourse.price4Weeks * (this.selectedWeeks / 4);
  }

  get accommodationFeeUsd(): number {
    return this.selectedAccommodation.price4Weeks * (this.selectedWeeks / 4);
  }

  get longTermDiscountUsd(): number {
    if (this.selectedWeeks >= 20) return 200;
    if (this.selectedWeeks >= 16) return 150;
    if (this.selectedWeeks >= 12) return 100;
    return 0;
  }

  get estimatedTotalUsd(): number {
    return this.tuitionFeeUsd + this.accommodationFeeUsd - this.longTermDiscountUsd + this.registrationFeeUsd;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.estimatedTotalUsd)} 起`;
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
