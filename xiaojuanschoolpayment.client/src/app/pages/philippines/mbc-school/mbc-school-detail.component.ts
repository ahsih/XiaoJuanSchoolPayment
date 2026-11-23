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
    { icon: 'location_on', label: '城市', value: 'Sta. Cruz, Manila', note: '学校位于马尼拉市 Sta. Cruz 区，属于城市学院环境。' },
    { icon: 'business_center', label: '定位', value: '商科学院 / 国际学生衔接', note: '更适合评估商科、会计、酒店管理、信息系统和学历路线，不是传统寄宿制ESL学校。' },
    { icon: 'verified', label: '办学认可', value: 'CHED / DepEd / TESDA', note: '学校获得 CHED、DepEd、TESDA 相关认可，招收本地和外国学生。' },
    { icon: 'event_available', label: '招生状态', value: 'SY 2026-2027 招生中', note: 'SY 2026-2027 正在招生，具体入学批次需向学校确认。' },
    { icon: 'school', label: '课程方向', value: 'ABM / BSBA / Accountancy / HM / IS', note: '开设高中ABM、本科商科、会计、酒店管理、信息系统、夜间班、周末班和TESDA课程。' },
    { icon: 'hotel', label: '住宿', value: 'Dormitory 需确认', note: '学校设有宿舍（dormitories），房型、费用、性别安排、押金和空位需向学校确认。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校徽', title: 'MBC 校徽', description: 'Manila Business College 校徽。', src: 'assets/philippines/mbc-logo.webp' },
    { category: '校园', title: 'MBC 校舍外观', description: 'Manila Business College 校舍外观。', src: 'assets/philippines/mbc-about.webp' },
    { category: '校园', title: 'MBC 品牌场景', description: '展示 MBC 标识和校内活动空间。', src: 'assets/philippines/mbc-slider-1.webp' },
    { category: '校园', title: 'MBC 毕业典礼场景', description: 'MBC 毕业典礼，体现学院型学习和学历路线。', src: 'assets/philippines/mbc-slider-2.webp' },
    { category: '课程', title: 'Bachelor Degree 课程入口', description: 'MBC 本科（Bachelor Degree）课程方向。', src: 'assets/philippines/mbc-program-degree.webp' },
    { category: '课程', title: 'Senior High School ABM', description: '高中阶段 ABM（会计、商业与管理）方向。', src: 'assets/philippines/mbc-program-shs.webp' },
    { category: '设施', title: 'Classroom', description: 'MBC 教室。', src: 'assets/philippines/mbc-classroom.webp' },
    { category: '设施', title: 'Library', description: 'MBC 图书馆。', src: 'assets/philippines/mbc-library.webp' },
    { category: '设施', title: 'Mock Hotel', description: '酒店管理专业的模拟酒店实训空间。', src: 'assets/philippines/mbc-mock-hotel.webp' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '中文名称', value: '菲律宾马尼拉Business College学校' },
    { label: '英文名称', value: 'Manila Business College' },
    { label: '成立时间', value: '2000 年' },
    { label: '学校地址', value: 'MBC Building, 1671 Alvarez Street, Sta. Cruz, Manila 1003' },
    { label: '联系电话', value: '(02) 741-3489 / (02) 313-8253' },
    { label: '邮箱', value: 'admin@mbc.edu.ph' },
    { label: '工作时间', value: 'Monday-Saturday 9am-6pm' },
    { label: '国际学生', value: '招收外国学生，需按学校清单准备入学材料；护照/签证手续可由 MBC 协助办理' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/mbc-about.webp', title: '马尼拉学院型学习路线', text: 'MBC 适合放入 Manila academic / business pathway 候选清单，重点是商科、管理、会计、酒店和信息系统。' },
    { image: 'assets/philippines/mbc-classroom.webp', title: '课堂与学院设施', text: '校内设有教室、实验室、食堂和宿舍等设施；住宿安排需单独向学校确认。' },
    { image: 'assets/philippines/mbc-mock-hotel.webp', title: '酒店管理实践空间', text: 'Hospitality Management 是 MBC 的本科方向之一，校内设有模拟酒店（Mock Hotel）实训空间。' },
    { image: 'assets/philippines/mbc-slider-2.webp', title: '学历和毕业路线', text: 'MBC 是学院型学校，不是短期口语学校，更适合按学院课程、国际学生申请和城市学习路线来考虑。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想了解马尼拉商科学院环境', text: '适合希望比较 Manila 学院型课程、商科方向和国际学生衔接的人。' },
    { title: '考虑 Business / Accountancy / Hospitality / IT', text: '本科方向覆盖 BSBA Marketing、BSBA Management、Accountancy、Hospitality Management 和 Information Systems。' },
    { title: '需要国际学生申请材料清单', text: '国际学生需准备认证学历、无犯罪证明、个人历史陈述、护照/签证、资金证明等材料。' },
    { title: '想比较 Enderun / MBC / Manila 城市课程', text: 'MBC 可作为马尼拉学院型路线候选，与语言培训中心和短期商务英语课程分开比较。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想读短期ESL口语强化', text: 'MBC 不是典型的一对一密集ESL学校；如果目标是短期口语和寄宿管理，应优先比较宿务、碧瑶或Clark语言学校。' },
    { title: '需要现成的国际学生学费表', text: '国际学生学费、杂费、住宿费和付款节点需向学校逐项确认，预算以学校当期书面回复为准。' },
    { title: '需要宿舍三餐一体报价', text: '学校虽设有宿舍，但房型、餐食、门禁、押金、空位和价格都需单独确认。' },
    { title: '想自动套用奖学金金额', text: 'USP 奖学金条件包含菲律宾公民等要求，国际学生不能直接套用。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'Senior High School ABM Track', type: 'Senior High School', lessons: 'Accountancy, Business and Management 方向', suitable: '适合高中阶段希望走会计、商业、管理和企业运营基础路线的学生；国际学生需先确认年级、年龄和材料。' },
    { name: 'B.S. Business Administration - Marketing', type: 'Bachelor Degree', lessons: 'Product development、brand management、sales、marketing planning、public relations', suitable: '适合想走市场、销售、品牌、公关和商务管理路线的学生。' },
    { name: 'B.S. Business Administration - Management', type: 'Bachelor Degree / Night Class', lessons: 'Accounting、finance、management、marketing 等传统商业领域组合', suitable: '另设 BSBA Management 夜间班，适合需要灵活时段的人进一步了解。' },
    { name: 'B.S. Accountancy', type: 'Bachelor Degree', lessons: 'Accounting、auditing、industry and government finance', suitable: '适合会计、审计、企业财务和相关专业资格路线；需确认国际学生入学门槛。' },
    { name: 'B.S. Hospitality Management', type: 'Bachelor Degree / Weekend Class', lessons: 'Hotel operations、tourism、restaurant business、service industry', suitable: '适合酒店、旅游、餐饮和服务业管理方向；另设周末班。' },
    { name: 'B.S. Information Systems', type: 'Bachelor Degree', lessons: 'ICT application design、development、testing、implementation、maintenance', suitable: '适合商业信息系统、应用技术和行业数字化方向。' },
    { name: 'TESDA Courses', type: 'Skills / Vocational', lessons: '技能与职业类 TESDA 课程', suitable: '具体开放项目、证书、名额、实习和费用需按当期招生确认。' },
    { name: 'Scholarship Programs', type: 'Scholarship', lessons: 'USP / KEI / YEP', suitable: '奖学金多面向本地学生；国际学生资格需逐项确认，不自动适用。' },
  ];

  programFees: ProgramFee[] = [
    { id: 'senior-high-abm', name: 'Senior High School ABM Track', tuition: 0, currencyCode: 'PHP', unit: '按学年核价', suitable: '开设 Grade 11 ABM Track，学费和杂费需当期确认', quoteOnly: true },
    { id: 'bsba-marketing', name: 'BSBA Major in Marketing', tuition: 0, currencyCode: 'PHP', unit: '按学期/学年核价', suitable: 'Marketing 本科方向，国际学生学费、杂费和材料审核需确认', quoteOnly: true },
    { id: 'bsba-management', name: 'BSBA Major in Management', tuition: 0, currencyCode: 'PHP', unit: '按学期/学年核价', suitable: 'Management 本科方向，另设夜间班', quoteOnly: true },
    { id: 'bs-accountancy', name: 'B.S. Accountancy', tuition: 0, currencyCode: 'PHP', unit: '按学期/学年核价', suitable: '会计本科方向，入学门槛和专业要求需确认', quoteOnly: true },
    { id: 'bs-hospitality-management', name: 'B.S. Hospitality Management', tuition: 0, currencyCode: 'PHP', unit: '按学期/学年核价', suitable: '酒店管理本科方向，另设周末班', quoteOnly: true },
    { id: 'bs-information-systems', name: 'B.S. Information Systems', tuition: 0, currencyCode: 'PHP', unit: '按学期/学年核价', suitable: '信息系统本科方向，课程开放和费用需确认', quoteOnly: true },
    { id: 'night-class-bsba-management', name: 'Night Class - BSBA Management', tuition: 0, currencyCode: 'PHP', unit: '按课程核价', suitable: '上课时间 Tuesday-Friday 6-9pm，是否仍开放需当期确认', quoteOnly: true },
    { id: 'weekend-class-hospitality', name: 'Weekend Class - BS Hospitality Management', tuition: 0, currencyCode: 'PHP', unit: '按课程核价', suitable: '上课时间 Saturday-Sunday，是否仍开放需当期确认', quoteOnly: true },
    { id: 'tesda-courses', name: 'TESDA Courses', tuition: 0, currencyCode: 'PHP', unit: '按项目核价', suitable: '具体TESDA课程、证书、名额和费用需当期确认', quoteOnly: true },
    { id: 'scholarship-programs', name: 'Scholarship Programs', tuition: 0, currencyCode: 'PHP', unit: '资格制', suitable: '包括 USP、KEI、YEP；多为本地学生条件，国际学生需单独确认', quoteOnly: true },
  ];

  roomFees: RoomFee[] = [
    { id: 'dormitory-confirmation', name: 'Dormitory / 住宿需确认', fee: 0, currencyCode: 'PHP', note: '学校设有宿舍，房型、费用、押金、餐食、门禁和空位需在申请前单独确认' },
  ];

  localFees: LocalFee[] = [
    { item: 'Tuition and Miscellaneous Fees', amount: '需当期确认', note: '国际学生费用需按学年、课程、学生身份和付款节点向学校核价。' },
    { item: 'International Student Documents', amount: '按材料确认', note: '认证学历、无犯罪证明、个人历史陈述、护照/签证、资金证明、良民证明和照片等。' },
    { item: 'Passport / Visa Assistance', amount: '需确认', note: 'Passport/Visa 可由 MBC 协助办理，费用和责任范围需书面确认。' },
    { item: 'Dormitory / Meals / Commute', amount: '需确认', note: '住宿、餐食、通勤和押金需分别向学校确认后再估算。' },
    { item: 'USP Chairman Scholarship Reference', amount: 'PHP 500 注册费参考', note: '学费和杂费全免（每学期0比索），只需缴纳500比索注册费；含本地资格条件。' },
    { item: 'USP Freshmen Scholarship Reference', amount: 'PHP 12,000/term；DP PHP 3,000 + PHP 500 注册费', note: '奖学金参考金额，不能自动套用于国际学生。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'fact_check', title: '确认路线类型', text: '先判断学生要的是学院型商科/学历路线，还是短期ESL语言学校路线。' },
    { icon: 'assignment', title: '核对国际学生材料', text: '按学校入学材料清单准备学历认证、无犯罪、个人历史陈述、护照/签证、资金证明等。' },
    { icon: 'payments', title: '拆分费用', text: '把学费、杂费、注册、签证、住宿、餐食、通勤、教材、制服和押金分开核价。' },
    { icon: 'hotel', title: '确认住宿', text: '单独确认 dormitory 是否开放给国际学生、房型、性别安排、费用、押金和空位。' },
    { icon: 'support_agent', title: '取得学校回复', text: '最终以 MBC 当期招生和财务部门书面回复为准，再决定是否进入申请。' },
  ];

  readonly notes = [
    'Manila Business College是马尼拉的学院型商科学校，不是传统寄宿制ESL语言学校，适合把它作为国际学生升学衔接的选择之一。',
    'SY 2026-2027 正在招生，具体课程、入学批次、名额、学费和材料要求需当期确认。',
    '国际学生学费需当期向学校确认。',
    'USP Chairman 和 USP Freshmen 奖学金有菲律宾公民等资格要求，不自动适用于国际学生。',
    '学校设有宿舍，房型、费用、餐食、门禁、押金和空位需报名前确认。',
    '如果学生目标是短期英语口语强化、宿舍三餐和每日学习管理，应优先比较菲律宾传统语言学校。'
  ];

  readonly faqs: FaqItem[] = [
    { question: '菲律宾马尼拉Business College学校是语言学校吗？', answer: '不是典型ESL语言学校。它更适合看作马尼拉学院型商科、会计、酒店管理、信息系统和国际学生衔接候选。' },
    { question: '国际学生学费是多少？', answer: '国际学生学费需按学年、课程和学生身份向学校当期确认，所以常规课程显示为“需当期确认”，正式预算以学校书面回复为准。' },
    { question: 'MBC 有住宿吗？', answer: '学校设有宿舍（dormitories），但房型、价格、餐食、押金、门禁、性别安排和空位需单独向学校确认。' },
    { question: '奖学金金额可以直接用于国际学生吗？', answer: '不建议直接套用。USP 奖学金包含菲律宾公民等资格条件，国际学生资格需要由学校确认。' },
    { question: '什么学生更适合看 MBC？', answer: '适合想比较马尼拉商科学院、学历衔接、酒店管理、会计、信息系统或城市学院环境的学生；如果目标是短期口语强化，应优先看语言学校。' },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校图片', target: 'gallery', icon: 'image' },
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
