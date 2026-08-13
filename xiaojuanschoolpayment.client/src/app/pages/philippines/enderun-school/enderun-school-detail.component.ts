import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { SchoolService } from '../../../../services/school.service';

type GalleryCategory = '全部' | '品牌' | '课程' | '商务' | '学术';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface ProgramFee { id: string; name: string; tuition: number; currencyCode: string; unit: string; suitable: string; }
interface RoomFee { id: string; name: string; fee: number; currencyCode: string; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SourceLink { label: string; url: string; }

@Component({
  selector: 'app-enderun-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './enderun-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './enderun-school-detail.component.css',
  ],
})
export class EnderunSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'Enderun';
  private readonly pricingSchoolNames = ['菲律宾马尼拉Enderun语言学校', 'Enderun Extension'];
  private readonly programOrder = [
    'general-1-2', 'general-3-5', 'general-6-8', 'general-9-12',
    'business-1-2', 'business-3-5', 'business-6-8', 'business-9-12',
    'academic-4-month', 'ielts-30-hours',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '品牌', '课程', '商务', '学术'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedProgramId = 'general-1-2';
  selectedStartDate = '2026-09-14';
  includeBookFee = true;
  quoteCalculated = false;
  bookFeeLow = 6000;
  bookFeeHigh = 8700;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '城市', value: 'Taguig / Metro Manila', note: '官方页列出地址为1100 Campus Avenue, McKinley Hill, City of Taguig。' },
    { icon: 'school', label: '体系', value: 'Enderun Colleges继续教育', note: '更接近城市学院短课和继续教育，不是传统宿舍制ESL学校。' },
    { icon: 'groups', label: '模式', value: 'Blended Learning Program', note: '官方说明结合社交团体课、每周一对一和线上课程。' },
    { icon: 'menu_book', label: '课程', value: 'General / Business / Academic / IELTS', note: '适合成人、职场、学术衔接和短期考试准备。' },
    { icon: 'hotel', label: '住宿', value: '住宿自理', note: '酒店、公寓或亲友住宿需与通勤一起单独规划。' },
    { icon: 'payments', label: '费用', value: 'PHP价目', note: '本页保留官方PHP价格，并把Book Fee和一对一追加课另列。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '品牌', title: 'Enderun Extension品牌图', description: '官方Enderun Extension社交图，呈现城市继续教育和商务学习氛围。', src: 'assets/philippines/enderun-extension-socials.jpg' },
    { category: '课程', title: 'General English', description: '官方General English课程图，适合日常沟通、社交表达和综合英语训练。', src: 'assets/philippines/enderun-general-english.jpg' },
    { category: '商务', title: 'Business English', description: '官方Business English课程图，强调商务情境、会议表达和跨文化沟通。', src: 'assets/philippines/enderun-business-english.jpg' },
    { category: '学术', title: 'Academic English', description: '官方Academic English课程图，适合大学或研究生阶段的学术英语准备。', src: 'assets/philippines/enderun-academic-english.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '中文名称', value: '菲律宾马尼拉Enderun语言学校' },
    { label: '英文名称', value: 'Enderun Extension / Languages & Academics' },
    { label: '地址', value: '1100 Campus Avenue, McKinley Hill, City of Taguig 1634 Philippines' },
    { label: '课程模式', value: 'Hybrid：线下团体课、一对一Validation课与线上coursework结合' },
    { label: '核心课程', value: 'General English、Business English、Academic English、IELTS Test Preparation、One-on-One Top-Up' },
    { label: '住宿说明', value: '非寄宿制，住宿、餐食、通勤和保险需另行安排' },
    { label: '签证说明', value: '官方FAQ说明由Visa Team按护照和签证状态判断是否需要SSP' },
    { label: '联系邮箱', value: 'extension@enderuncolleges.com' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/enderun-extension-socials.jpg', title: '马尼拉城市型学习', text: 'Enderun适合希望把英语课、城市生活、商务场景和学院资源结合起来的人。' },
    { image: 'assets/philippines/enderun-general-english.jpg', title: 'BLP弹性学习', text: '官方说明BLP像会员制学习，可参加社交团体课，并配合每周一对一指导。' },
    { image: 'assets/philippines/enderun-business-english.jpg', title: '商务英语辨识度高', text: 'Business English聚焦听说、邮件、跨文化、演示和财务等职场主题。' },
    { image: 'assets/philippines/enderun-academic-english.jpg', title: '学术衔接方向清晰', text: 'Academic English面向大学或研究生准备，强调阅读、写作、听力与口语系统训练。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '成人和职场人士', text: '希望在马尼拉用更灵活的方式提升英语、商务表达或跨文化沟通。' },
    { title: '已在马尼拉生活或短住的人', text: '住宿和通勤已经有安排，想增加英语学习或考试准备。' },
    { title: '需要学术英语衔接', text: '考虑大学、研究生或国际课堂，需要阅读、写作、表达和课堂参与能力。' },
    { title: '不需要寄宿制管理', text: '能自行安排酒店、公寓、餐食、保险和城市交通。' },
    { title: '想要短期IELTS训练', text: '官方IELTS Test Preparation为30小时线上密集课程，适合已有英文基础的人。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想要宿舍+三餐+门禁套餐', text: 'Enderun不是典型宿舍制菲律宾语言学校，这类需求优先看宿务、碧瑶或Clark。' },
    { title: '需要全天高压斯巴达', text: '如果目标是高强度雅思冲刺和强制自习，碧瑶考试型学校通常更适合优先比较。' },
    { title: '只看最低总价', text: 'Enderun需要把课程费、Book Fee、住宿、通勤和签证停留拆开算。' },
    { title: '无法自行处理城市通勤', text: '上课点和住宿距离会明显影响体验，需要提前确认交通时间和安全感。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'General English', type: '日常英语 / BLP', lessons: '社交团体课 + 每周一对一Validation课 + 线上coursework', suitable: '适合社交表达、日常沟通、综合听说读写和马尼拉城市生活英语。' },
    { name: 'Business English', type: '商务职场', lessons: '听说训练、邮件、商务媒体、跨文化、演示、财务主题', suitable: '适合职场人士、企业派训、会议表达和跨文化沟通目标。' },
    { name: 'Academic English', type: '学术衔接', lessons: '4个月项目，官方列有三段年度入学期', suitable: '适合进入本科、研究生或国际课堂前的学术英语准备。' },
    { name: 'IELTS Test Preparation', type: '考试短课', lessons: '30小时线上密集课程，10次课，每次3小时', suitable: '适合已有英文基础、希望短期梳理雅思策略和模考反馈的人。' },
    { name: 'One-on-One Top-Up', type: '追加一对一', lessons: '按小时加购，按报名周期不同每小时PHP 1,400至850', suitable: '适合需要额外练口语、发音、语法、词汇或写作反馈的人。' },
    { name: 'Corporate / Short Courses', type: '企业与短课', lessons: '按公司、人数、目标和项目定制', suitable: '适合企业培训、商务出差或短期马尼拉行程。' },
  ];

  programFees: ProgramFee[] = [
    { id: 'general-1-2', name: 'General English 1-2 Months', tuition: 40000, currencyCode: 'PHP', unit: '每月', suitable: '短期BLP月费参考' },
    { id: 'general-3-5', name: 'General English 3-5 Months', tuition: 30000, currencyCode: 'PHP', unit: '每月', suitable: '中期报名月费降低' },
    { id: 'general-6-8', name: 'General English 6-8 Months', tuition: 25000, currencyCode: 'PHP', unit: '每月', suitable: '中长期城市英语补强' },
    { id: 'general-9-12', name: 'General English 9-12 Months', tuition: 20000, currencyCode: 'PHP', unit: '每月', suitable: '长期报名月费参考' },
    { id: 'business-1-2', name: 'Business English 1-2 Months', tuition: 40000, currencyCode: 'PHP', unit: '每月', suitable: '短期商务英语月费参考' },
    { id: 'business-3-5', name: 'Business English 3-5 Months', tuition: 30000, currencyCode: 'PHP', unit: '每月', suitable: '职场英语持续训练' },
    { id: 'business-6-8', name: 'Business English 6-8 Months', tuition: 25000, currencyCode: 'PHP', unit: '每月', suitable: '企业或成人中长期目标' },
    { id: 'business-9-12', name: 'Business English 9-12 Months', tuition: 20000, currencyCode: 'PHP', unit: '每月', suitable: '长期商务英语月费参考' },
    { id: 'academic-4-month', name: 'Academic English 4-Month Program', tuition: 120000, currencyCode: 'PHP', unit: '4个月项目', suitable: '大学或研究生学术英语准备' },
    { id: 'ielts-30-hours', name: 'IELTS Test Preparation 30 Hours', tuition: 6499, currencyCode: 'PHP', unit: '30小时项目', suitable: '线上雅思密集备考，按当期开课确认' },
  ];

  roomFees: RoomFee[] = [
    { id: 'self-arranged', name: '住宿自理', fee: 0, currencyCode: 'PHP', note: '非寄宿制，酒店、公寓、亲友住宿或公司住宿另行安排' },
  ];

  localFees: LocalFee[] = [
    { item: 'Book Fee参考低值', amount: 'PHP 6,000', note: '官网说明Book fee通常不含在课程费内，按课程确认' },
    { item: 'Book Fee参考高值', amount: 'PHP 8,700', note: '官网说明Book fee视课程不同约PHP6,000-8,700' },
    { item: 'One-on-One Top-Up 1-2 Months', amount: 'PHP 1,400 / 小时', note: '额外一对一课每小时参考' },
    { item: 'One-on-One Top-Up 3-5 Months', amount: 'PHP 1,200 / 小时', note: '额外一对一课每小时参考' },
    { item: 'One-on-One Top-Up 6-8 Months', amount: 'PHP 1,000 / 小时', note: '额外一对一课每小时参考' },
    { item: 'One-on-One Top-Up 9-12 Months', amount: 'PHP 850 / 小时', note: '额外一对一课每小时参考' },
    { item: 'SSP / Visa Review', amount: '需确认', note: '官方FAQ说明由Visa Team按护照和签证状态判断是否需要SSP' },
    { item: '住宿 / 通勤 / 餐食', amount: '自理', note: '按酒店、公寓、交通和个人生活方式估算' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先判断是否适合Enderun', text: '确认学生是否接受马尼拉非寄宿制，以及课程目标是General、Business、Academic还是IELTS。' },
    { icon: 'calendar_month', title: '核对开课与学习方式', text: '按官方当期Open House、课程日程、线上/线下方式和名额确认。' },
    { icon: 'payments', title: '拆分PHP费用', text: '课程费、Book Fee、一对一Top-Up、SSP可能性、住宿和通勤分开列预算。' },
    { icon: 'hotel', title: '安排城市住宿通勤', text: '根据上课点、预算、安全感和交通时间筛选酒店、公寓或亲友住宿。' },
    { icon: 'support_agent', title: '报名后持续跟进', text: '协助确认付款、课程材料、到校路线、签证停留和临时调整。' },
  ];

  readonly notes = [
    'Enderun Extension不是传统宿舍制ESL学校，本页不把住宿、餐食和通勤并入课程报价。',
    'General English和Business English以官方公开月费为参考，不同报名周期对应不同月费。',
    'Academic English官方列为4个月项目，年度入学期和名额需按学校当期确认。',
    'IELTS Test Preparation官方公开为30小时线上密集课程，开课日期会随期数变化。',
    'Book Fee通常不包含在课程费内，官方公开范围为PHP6,000-8,700，需按课程确认。',
    '国际学生是否需要SSP由学校Visa Team按护照和签证状态判断。',
  ];

  readonly faqs: FaqItem[] = [
    { question: '菲律宾马尼拉Enderun语言学校是寄宿制语言学校吗？', answer: '不是。它更适合归类为Enderun Colleges体系下的城市型英语课程和继续教育项目，住宿、餐食和通勤需要另行安排。' },
    { question: 'General English和Business English多少钱？', answer: '官方公开月费按报名周期递减：1-2个月PHP40,000/月，3-5个月PHP30,000/月，6-8个月PHP25,000/月，9-12个月PHP20,000/月。' },
    { question: 'Academic English为什么显示PHP120,000？', answer: '官方Program页把Academic English列为4个月项目，每个年度入学期均为PHP120,000，本页按原始PHP展示。' },
    { question: '页面报价包含住宿吗？', answer: '不包含。Enderun不是住宿套餐型学校，住宿、交通、餐食、保险和个人生活费需要单独估算。' },
    { question: 'Enderun和宿务、碧瑶学校怎么选？', answer: '如果想要城市短课、商务或学术衔接，可以看Enderun；如果想要校内宿舍、三餐、全天课程和强管理，优先比较宿务、碧瑶或Clark。' },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '官方图片', target: 'gallery', icon: 'image' },
    { label: '课程费用', target: 'course-fees', icon: 'payments' },
    { label: '费用估算', target: 'quote', icon: 'calculate' },
    { label: '额外费用', target: 'local-fees', icon: 'receipt_long' },
    { label: '服务流程', target: 'service-process', icon: 'task_alt' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '图片', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '服务', target: 'service-process', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'Enderun Extension官方主页', url: 'https://enderunextension.com/' },
    { label: 'Learn English at Enderun', url: 'https://enderunextension.com/certificate-courses/blended-learning-program/' },
    { label: 'General English官方课程页', url: 'https://enderunextension.com/program/general-english/' },
    { label: 'Business English官方课程页', url: 'https://enderunextension.com/program/business-english/' },
    { label: 'Academic English官方课程页', url: 'https://enderunextension.com/program/academic-english/' },
    { label: 'IELTS Test Preparation官方课程页', url: 'https://enderunextension.com/program/ielts-test-preparation-program/' },
    { label: 'One-on-One Top-Up官方课程页', url: 'https://enderunextension.com/program/one-on-one-top-up-packages/' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toLowerCase().includes('enderun')) ??
          schools[0];
        if (!school?.id) return EMPTY;
        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees }) => this.applyPricingData(lessons, rooms, fees));
  }

  private applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    const databasePrograms = lessons
      .map((lesson) => ({
        id: this.priceKey(lesson.name),
        name: lesson.name,
        tuition: lesson.price,
        currencyCode: this.currencyCodeForDisplay(lesson.currencyCode),
        unit: lesson.week === 16 ? '4个月项目' : lesson.name.includes('IELTS') ? '30小时项目' : '每月',
        suitable: lesson.description || lesson.note || '请联系顾问确认课程适配',
      }))
      .sort((a, b) => this.orderIndex(this.programOrder, a.id) - this.orderIndex(this.programOrder, b.id));
    if (databasePrograms.length > 0) {
      this.programFees = databasePrograms;
      if (!this.programFees.some((program) => program.id === this.selectedProgramId)) {
        this.selectedProgramId = this.programFees[0].id;
      }
    }

    const databaseRooms = rooms.map((room) => ({
      id: this.priceKey(room.name),
      name: room.name,
      fee: room.price,
      currencyCode: this.currencyCodeForDisplay(room.currencyCode),
      note: room.description || '住宿需单独确认',
    }));
    if (databaseRooms.length > 0) this.roomFees = databaseRooms;

    const databaseFees = fees.map((fee) => ({
      item: fee.name,
      amount: fee.fee > 0 ? this.formatMoney(fee.fee, this.currencyCodeForDisplay(fee.currencyCode)) : '需确认',
      note: this.cleanFeeDescription(fee.description),
    }));
    if (databaseFees.length > 0) {
      this.localFees = databaseFees;
      const low = fees.find((fee) => fee.name === 'Book Fee参考低值');
      const high = fees.find((fee) => fee.name === 'Book Fee参考高值');
      if (low?.fee) this.bookFeeLow = low.fee;
      if (high?.fee) this.bookFeeHigh = high.fee;
    }
  }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  calculateQuote(): void { this.quoteCalculated = true; }

  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();
    const targetElement = document.getElementById(target);
    if (!targetElement) return;
    const headerOffset = window.innerWidth <= 680 ? 132 : 92;
    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`);
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedProgram(): ProgramFee {
    return this.programFees.find((program) => program.id === this.selectedProgramId) ?? this.programFees[0];
  }

  get quoteAmount(): number {
    return this.selectedProgram.tuition + (this.includeBookFee ? this.bookFeeLow : 0);
  }

  get quoteText(): string {
    return `${this.formatMoney(this.quoteAmount, this.selectedProgram.currencyCode)} 起`;
  }

  get quoteNote(): string {
    const bookText = this.includeBookFee ? `，含Book Fee低值${this.formatMoney(this.bookFeeLow, 'PHP')}` : '，未含Book Fee';
    return `${this.selectedProgram.name}（${this.selectedProgram.unit}）${bookText}；住宿、通勤、签证和个人费用另计`;
  }

  formatMoney(value: number, currencyCode = 'PHP'): string {
    return `${currencyCode} ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  private priceKey(value: string): string {
    const knownKeys: Record<string, string> = {
      'General English 1-2 Months': 'general-1-2',
      'General English 3-5 Months': 'general-3-5',
      'General English 6-8 Months': 'general-6-8',
      'General English 9-12 Months': 'general-9-12',
      'Business English 1-2 Months': 'business-1-2',
      'Business English 3-5 Months': 'business-3-5',
      'Business English 6-8 Months': 'business-6-8',
      'Business English 9-12 Months': 'business-9-12',
      'Academic English 4-Month Program': 'academic-4-month',
      'IELTS Test Preparation 30 Hours': 'ielts-30-hours',
      '住宿自理': 'self-arranged',
    };
    if (knownKeys[value]) return knownKeys[value];
    const slug = value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return slug || value;
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  private currencyCodeForDisplay(code?: string): string {
    return !code ? 'PHP' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();
  }

  private cleanFeeDescription(description?: string): string {
    return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校正式报价为准';
  }
}
