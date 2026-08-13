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

type GalleryCategory = '全部' | '校徽' | '校园' | '课程' | '设施';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface ProgramFee { id: string; name: string; tuition: number; currencyCode: string; unit: string; suitable: string; quoteOnly?: boolean; }
interface RoomFee { id: string; name: string; fee: number; currencyCode: string; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SourceLink { label: string; url: string; }

@Component({
  selector: 'app-mbc-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mbc-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './mbc-school-detail.component.css',
  ],
})
export class MbcSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'Business College';
  private readonly pricingSchoolNames = ['菲律宾马尼拉Business College学校', 'Manila Business College'];
  private readonly programOrder = [
    'senior-high-abm',
    'bsba-marketing',
    'bsba-management',
    'bs-accountancy',
    'bs-hospitality-management',
    'bs-information-systems',
    'night-class-bsba-management',
    'weekend-class-hospitality',
    'tesda-courses',
    'scholarship-programs',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校徽', '校园', '课程', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedProgramId = 'bsba-management';
  selectedStartDate = '2026-09-01';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '城市', value: 'Sta. Cruz, Manila', note: '官网列出地址为 MBC Building, 1671 Alvarez Street, Sta. Cruz, Manila 1003。' },
    { icon: 'business_center', label: '定位', value: '商科学院 / 国际学生衔接', note: '更适合评估商科、会计、酒店管理、信息系统和学历路线，不是传统寄宿制ESL学校。' },
    { icon: 'verified', label: '官方认证', value: 'CHED / DepEd / TESDA', note: '官网说明学校获得 CHED、DepEd、TESDA 相关认可，并面向本地和外国学生。' },
    { icon: 'event_available', label: '招生状态', value: 'SY 2026-2027 招生中', note: '官网首页显示 Enrollment On-Going SY 2026 - 2027，最终入学批次仍需向学校确认。' },
    { icon: 'school', label: '课程方向', value: 'ABM / BSBA / Accountancy / HM / IS', note: '官网列出高中ABM、本科商科、会计、酒店管理、信息系统、夜间班、周末班和TESDA课程入口。' },
    { icon: 'hotel', label: '住宿', value: 'Dormitory 需确认', note: '官网介绍提到 dormitories，但没有公开房型、费用、性别安排、押金和空位表。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校徽', title: 'MBC 官方校徽', description: '来自 Manila Business College 官网的官方校徽资源。', src: 'assets/philippines/mbc-logo.png' },
    { category: '校园', title: 'MBC 校舍外观', description: '官网 About 区块使用的 Manila Business College building 图片。', src: 'assets/philippines/mbc-about.jpg' },
    { category: '校园', title: 'MBC 品牌场景', description: '官网首页轮播图，展示 MBC 标识和校内活动空间。', src: 'assets/philippines/mbc-slider-1.jpg' },
    { category: '校园', title: 'MBC 毕业典礼场景', description: '官网首页轮播图，用于呈现学院型学习和毕业路线。', src: 'assets/philippines/mbc-slider-2.jpg' },
    { category: '课程', title: 'Bachelor Degree 课程入口', description: '官网 Programs offered 区块中的本科课程图片。', src: 'assets/philippines/mbc-program-degree.png' },
    { category: '课程', title: 'Senior High School ABM', description: '官网 Programs offered 区块中的高中ABM方向图片。', src: 'assets/philippines/mbc-program-shs.png' },
    { category: '设施', title: 'Classroom', description: '官网 Facilities 区块的教室图片。', src: 'assets/philippines/mbc-classroom.jpg' },
    { category: '设施', title: 'Library', description: '官网 Facilities 区块的图书馆图片。', src: 'assets/philippines/mbc-library.jpg' },
    { category: '设施', title: 'Mock Hotel', description: '官网 Facilities 区块的酒店管理模拟空间图片。', src: 'assets/philippines/mbc-mock-hotel.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '中文名称', value: '菲律宾马尼拉Business College学校' },
    { label: '英文名称', value: 'Manila Business College' },
    { label: '成立时间', value: '官网说明学校成立于 2000 年' },
    { label: '学校地址', value: 'MBC Building, 1671 Alvarez Street, Sta. Cruz, Manila 1003' },
    { label: '联系电话', value: '(02) 741-3489 / (02) 313-8253' },
    { label: '邮箱', value: 'admin@mbc.edu.ph' },
    { label: '工作时间', value: 'Monday-Saturday 9am-6pm' },
    { label: '国际学生', value: '官网 Admission 页列出 International / Foreign Students 材料清单，并说明护照/签证可由 MBC 协助处理' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/mbc-about.jpg', title: '马尼拉学院型学习路线', text: 'MBC 适合放入 Manila academic / business pathway 候选清单，重点是商科、管理、会计、酒店和信息系统。' },
    { image: 'assets/philippines/mbc-classroom.jpg', title: '课堂与学院设施', text: '官网展示 classroom、laboratories、canteens、dormitories 等学习设施，页面会把住宿信息单独标记为需确认。' },
    { image: 'assets/philippines/mbc-mock-hotel.jpg', title: '酒店管理实践空间', text: 'Hospitality Management 是官网列出的本科方向之一，Mock Hotel 图片适合说明实践型设施。' },
    { image: 'assets/philippines/mbc-slider-2.jpg', title: '学历和毕业路线', text: '页面不会把它包装成短期口语学校，而是按学院、国际学生申请和城市学习路线来呈现。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想了解马尼拉商科学院环境', text: '适合希望比较 Manila 学院型课程、商科方向和国际学生衔接的人。' },
    { title: '考虑 Business / Accountancy / Hospitality / IT', text: '官网本科方向覆盖 BSBA Marketing、BSBA Management、Accountancy、Hospitality Management 和 Information Systems。' },
    { title: '需要国际学生申请材料清单', text: '官网 Admission 页列出认证学历、无犯罪证明、个人历史陈述、护照/签证、资金证明等材料。' },
    { title: '想比较 Enderun / MBC / Manila 城市课程', text: 'MBC 可作为马尼拉学院型路线候选，与语言培训中心和短期商务英语课程分开比较。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想读短期ESL口语强化', text: 'MBC 不是典型的一对一密集ESL学校；如果目标是短期口语和寄宿管理，应优先比较宿务、碧瑶或Clark语言学校。' },
    { title: '需要明确公开国际学生学费表', text: '官网没有公开完整国际学生学费、杂费、住宿费和付款节点，预算必须以学校当期书面回复为准。' },
    { title: '需要宿舍三餐一体报价', text: '官网虽提到 dormitories，但没有公开房型、餐食、门禁、押金、空位和价格。' },
    { title: '想自动套用奖学金金额', text: '官网奖学金页列出的 USP 条件包含菲律宾公民等要求，不应直接套用于国际学生。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'Senior High School ABM Track', type: 'Senior High School', lessons: 'Accountancy, Business and Management 方向', suitable: '适合高中阶段希望走会计、商业、管理和企业运营基础路线的学生；国际学生需先确认年级、年龄和材料。' },
    { name: 'B.S. Business Administration - Marketing', type: 'Bachelor Degree', lessons: 'Product development、brand management、sales、marketing planning、public relations', suitable: '适合想走市场、销售、品牌、公关和商务管理路线的学生。' },
    { name: 'B.S. Business Administration - Management', type: 'Bachelor Degree / Night Class', lessons: 'Accounting、finance、management、marketing 等传统商业领域组合', suitable: '官网也列出 BSBA Management 夜间班，适合需要灵活时段的人进一步核对。' },
    { name: 'B.S. Accountancy', type: 'Bachelor Degree', lessons: 'Accounting、auditing、industry and government finance', suitable: '适合会计、审计、企业财务和相关专业资格路线；需确认国际学生入学门槛。' },
    { name: 'B.S. Hospitality Management', type: 'Bachelor Degree / Weekend Class', lessons: 'Hotel operations、tourism、restaurant business、service industry', suitable: '适合酒店、旅游、餐饮和服务业管理方向；官网列出周末班入口。' },
    { name: 'B.S. Information Systems', type: 'Bachelor Degree', lessons: 'ICT application design、development、testing、implementation、maintenance', suitable: '适合商业信息系统、应用技术和行业数字化方向。' },
    { name: 'TESDA Courses', type: 'Skills / Vocational', lessons: '官网列出 TESDA Courses 入口', suitable: '具体开放项目、证书、名额、实习和费用需按当期招生确认。' },
    { name: 'Scholarship Programs', type: 'Scholarship', lessons: 'USP / KEI / YEP', suitable: '官网公开部分本地奖学金说明；国际学生资格需逐项确认，不自动适用。' },
  ];

  programFees: ProgramFee[] = [
    { id: 'senior-high-abm', name: 'Senior High School ABM Track', tuition: 0, currencyCode: 'PHP', unit: '按学年核价', suitable: '官网列出 Grade 11 ABM Track，学费和杂费需当期确认', quoteOnly: true },
    { id: 'bsba-marketing', name: 'BSBA Major in Marketing', tuition: 0, currencyCode: 'PHP', unit: '按学期/学年核价', suitable: 'Marketing 本科方向，国际学生学费、杂费和材料审核需确认', quoteOnly: true },
    { id: 'bsba-management', name: 'BSBA Major in Management', tuition: 0, currencyCode: 'PHP', unit: '按学期/学年核价', suitable: 'Management 本科方向，官网也列出夜间班信息', quoteOnly: true },
    { id: 'bs-accountancy', name: 'B.S. Accountancy', tuition: 0, currencyCode: 'PHP', unit: '按学期/学年核价', suitable: '会计本科方向，入学门槛和专业要求需确认', quoteOnly: true },
    { id: 'bs-hospitality-management', name: 'B.S. Hospitality Management', tuition: 0, currencyCode: 'PHP', unit: '按学期/学年核价', suitable: '酒店管理本科方向，官网也列出周末班信息', quoteOnly: true },
    { id: 'bs-information-systems', name: 'B.S. Information Systems', tuition: 0, currencyCode: 'PHP', unit: '按学期/学年核价', suitable: '信息系统本科方向，课程开放和费用需确认', quoteOnly: true },
    { id: 'night-class-bsba-management', name: 'Night Class - BSBA Management', tuition: 0, currencyCode: 'PHP', unit: '按课程核价', suitable: '官网列出 Tuesday-Friday 6-9pm，是否仍开放需当期确认', quoteOnly: true },
    { id: 'weekend-class-hospitality', name: 'Weekend Class - BS Hospitality Management', tuition: 0, currencyCode: 'PHP', unit: '按课程核价', suitable: '官网列出 Saturday-Sunday，是否仍开放需当期确认', quoteOnly: true },
    { id: 'tesda-courses', name: 'TESDA Courses', tuition: 0, currencyCode: 'PHP', unit: '按项目核价', suitable: '具体TESDA课程、证书、名额和费用需当期确认', quoteOnly: true },
    { id: 'scholarship-programs', name: 'Scholarship Programs', tuition: 0, currencyCode: 'PHP', unit: '资格制', suitable: '官网列出 USP、KEI、YEP；多为本地学生条件，国际学生需单独确认', quoteOnly: true },
  ];

  roomFees: RoomFee[] = [
    { id: 'dormitory-confirmation', name: 'Dormitory / 住宿需确认', fee: 0, currencyCode: 'PHP', note: '官网介绍提到 dormitories，但没有公开房型、费用、押金、餐食、门禁和空位；申请前需单独核对' },
  ];

  localFees: LocalFee[] = [
    { item: 'Tuition and Miscellaneous Fees', amount: '需当期确认', note: '官网未公开完整国际学生价目表，需按学年、课程、学生身份和付款节点核价。' },
    { item: 'International Student Documents', amount: '按材料确认', note: '认证学历、无犯罪证明、个人历史陈述、护照/签证、资金证明、良民证明和照片等。' },
    { item: 'Passport / Visa Assistance', amount: '需确认', note: 'Admission 页说明 Passport/Visa 可由 MBC 协助处理，费用和责任范围需书面确认。' },
    { item: 'Dormitory / Meals / Commute', amount: '需确认', note: '住宿、餐食、通勤和押金不能只凭官网一句 dormitories 估算。' },
    { item: 'USP Chairman Scholarship Reference', amount: 'PHP 500 注册费参考', note: '官网奖学金页写明 Free Tuition & Fees = PHP 0/term，To Pay PHP 500 Registration Fee；含本地资格条件。' },
    { item: 'USP Freshmen Scholarship Reference', amount: 'PHP 12,000/term；DP PHP 3,000 + PHP 500 注册费', note: '官网公开的奖学金参考金额，不能自动套用于国际学生。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'fact_check', title: '确认路线类型', text: '先判断学生要的是学院型商科/学历路线，还是短期ESL语言学校路线。' },
    { icon: 'assignment', title: '核对国际学生材料', text: '按官网 Admission 清单准备学历认证、无犯罪、个人历史陈述、护照/签证、资金证明等。' },
    { icon: 'payments', title: '拆分费用', text: '把学费、杂费、注册、签证、住宿、餐食、通勤、教材、制服和押金分开核价。' },
    { icon: 'hotel', title: '确认住宿', text: '单独确认 dormitory 是否开放给国际学生、房型、性别安排、费用、押金和空位。' },
    { icon: 'support_agent', title: '取得学校回复', text: '最终以 MBC 当期招生和财务部门书面回复为准，再决定是否进入申请。' },
  ];

  readonly notes = [
    '菲律宾马尼拉Business College学校不应写成传统寄宿制ESL语言学校；页面定位为马尼拉学院型商科和国际学生衔接候选。',
    '官网首页显示 SY 2026-2027 招生中，但具体课程、入学批次、名额、学费和材料要求仍需当期确认。',
    '官网未公开完整国际学生学费表；数据库中常规课程保留为 0 PHP / 需当期确认，避免误导预算。',
    '官网奖学金页公开 USP Chairman 和 USP Freshmen 的金额参考，但包含菲律宾公民等资格要求，不自动适用于国际学生。',
    '官网介绍提到 dormitories，但房型、费用、餐食、门禁、押金和空位没有完整公开。',
    '如果学生目标是短期英语口语强化、宿舍三餐和每日学习管理，应优先比较菲律宾传统语言学校。'
  ];

  readonly faqs: FaqItem[] = [
    { question: '菲律宾马尼拉Business College学校是语言学校吗？', answer: '不是典型ESL语言学校。它更适合看作马尼拉学院型商科、会计、酒店管理、信息系统和国际学生衔接候选。' },
    { question: '官网有公开国际学生学费表吗？', answer: '目前官网没有公开完整国际学生价目表。本页把常规课程设置为“需当期确认”，正式预算要以学校书面回复为准。' },
    { question: 'MBC 有住宿吗？', answer: '官网介绍中提到 dormitories，但没有公开房型、价格、餐食、押金、门禁、性别安排和空位，所以住宿必须单独核对。' },
    { question: '奖学金金额可以直接用于国际学生吗？', answer: '不建议直接套用。官网 USP 奖学金说明包含菲律宾公民等资格条件，国际学生资格需要由学校确认。' },
    { question: '什么学生更适合看 MBC？', answer: '适合想比较马尼拉商科学院、学历衔接、酒店管理、会计、信息系统或城市学院环境的学生；如果目标是短期口语强化，应优先看语言学校。' },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '官方图片', target: 'gallery', icon: 'image' },
    { label: '课程费用', target: 'course-fees', icon: 'payments' },
    { label: '费用确认', target: 'quote', icon: 'calculate' },
    { label: '住宿说明', target: 'room-fees', icon: 'hotel' },
    { label: '服务流程', target: 'service-process', icon: 'task_alt' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '图片', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '住宿', target: 'room-fees', icon: 'hotel' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'Manila Business College 官方网站', url: 'https://www.mbc.edu.ph/' },
    { label: 'MBC Admission Requirements', url: 'https://www.mbc.edu.ph/admission.php' },
    { label: 'MBC Programs offered section', url: 'https://www.mbc.edu.ph/#Academic' },
    { label: 'MBC Facilities section', url: 'https://www.mbc.edu.ph/#Facilities' },
    { label: 'MBC Contact section', url: 'https://www.mbc.edu.ph/#Contact' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toLowerCase().includes('business college')) ??
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
        unit: this.unitForLesson(lesson),
        suitable: lesson.description || lesson.note || '请联系顾问确认课程适配',
        quoteOnly: lesson.price <= 0,
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
    if (databaseFees.length > 0) this.localFees = databaseFees;
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

  get quoteText(): string {
    return this.selectedProgram.quoteOnly || this.selectedProgram.tuition <= 0
      ? '需当期确认'
      : `${this.formatMoney(this.selectedProgram.tuition, this.selectedProgram.currencyCode)} 起`;
  }

  get quoteNote(): string {
    if (this.selectedProgram.quoteOnly || this.selectedProgram.tuition <= 0) {
      return `${this.selectedProgram.name}（${this.selectedProgram.unit}）需要按学年、学生身份、课程开放、杂费、住宿和签证材料由学校当期确认。`;
    }
    return `${this.selectedProgram.name}（${this.selectedProgram.unit}）；其他杂费、住宿、签证、保险和个人费用另计。`;
  }

  displayProgramFee(program: ProgramFee): string {
    return program.quoteOnly || program.tuition <= 0
      ? '需当期确认'
      : this.formatMoney(program.tuition, program.currencyCode);
  }

  formatMoney(value: number, currencyCode = 'PHP'): string {
    return `${currencyCode} ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  private priceKey(value: string): string {
    const knownKeys: Record<string, string> = {
      'Senior High School ABM Track': 'senior-high-abm',
      'BSBA Major in Marketing': 'bsba-marketing',
      'BSBA Major in Management': 'bsba-management',
      'B.S. Accountancy': 'bs-accountancy',
      'B.S. Hospitality Management': 'bs-hospitality-management',
      'B.S. Information Systems': 'bs-information-systems',
      'Night Class - BSBA Management': 'night-class-bsba-management',
      'Weekend Class - BS Hospitality Management': 'weekend-class-hospitality',
      'TESDA Courses': 'tesda-courses',
      'Scholarship Programs': 'scholarship-programs',
      'Dormitory / 住宿需确认': 'dormitory-confirmation',
    };
    if (knownKeys[value]) return knownKeys[value];
    const slug = value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return slug || value;
  }

  private unitForLesson(lesson: SchoolLessonDTO): string {
    if (lesson.name.includes('Night')) return '夜间班核价';
    if (lesson.name.includes('Weekend')) return '周末班核价';
    if (lesson.name.includes('TESDA')) return '按项目核价';
    if (lesson.name.includes('Scholarship')) return '资格制';
    return '按学期/学年核价';
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
