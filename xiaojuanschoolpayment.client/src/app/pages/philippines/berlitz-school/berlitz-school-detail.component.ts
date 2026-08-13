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

type GalleryCategory = '全部' | '品牌' | '课堂' | '课程' | '企业' | '测评';

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
  selector: 'app-berlitz-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './berlitz-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './berlitz-school-detail.component.css',
  ],
})
export class BerlitzSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'Berlitz';
  private readonly pricingSchoolNames = ['菲律宾马尼拉Berlitz语言学校', 'Berlitz Philippines'];
  private readonly programOrder = [
    'starter-course',
    'public-english-group',
    'private-language-classes',
    'group-language-classes',
    'business-english-short-courses',
    'corporate-language-training',
    'berlitz-connect-6-months',
    'berlitz-connect-12-months',
    'language-testing-assessment',
    'telc-exam-preparation-testing',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '品牌', '课堂', '课程', '企业', '测评'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedProgramId = 'starter-course';
  selectedStartDate = '2026-09-14';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '城市', value: 'Makati / Metro Manila', note: '官网联系页列出Berlitz Makati位于The World Center 24th Floor, 330 Senator Gil Puyat Avenue, Makati。' },
    { icon: 'language', label: '定位', value: '国际语言培训品牌', note: '适合成人、少儿、企业语言培训、商务沟通、测评、TELC和线上/面授课程。' },
    { icon: 'school', label: '方法', value: 'Berlitz Method', note: '官网说明其方法强调沉浸式、目标导向、Present-Practice-Perform，并从第一堂课开始使用目标语言。' },
    { icon: 'groups', label: '形式', value: 'Private / Group / Self-paced', note: '成人课程包含一对一、小组和自学平台；企业课程可在线、面授或混合交付。' },
    { icon: 'event', label: '公开课', value: '英语线上/面授排课', note: '官网Class Schedules列出English Onsite与Online公开课时段，开班需满足最低人数。' },
    { icon: 'hotel', label: '住宿', value: '住宿自理', note: '它不是传统寄宿制ESL学校，住宿、餐食、通勤、保险和停留文件都要另行安排。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '品牌', title: 'Berlitz官方Logo', description: '来自Berlitz Philippines官网主题资源，用于识别官方品牌。', src: 'assets/philippines/berlitz-logo.png' },
    { category: '课堂', title: 'Berlitz语言学习场景', description: '官网首页主视觉图片，适合呈现小组互动和商务沟通学习氛围。', src: 'assets/philippines/berlitz-hero.webp' },
    { category: '课堂', title: 'Berlitz Method课堂', description: '官网Why Learn with Berlitz区块图片，展示沉浸式课堂和教师引导练习。', src: 'assets/philippines/berlitz-method.webp' },
    { category: '课程', title: 'Berlitz Student Portal', description: '官网在线学习门户图片，适合说明课程安排、进度追踪和线上学习入口。', src: 'assets/philippines/berlitz-student-portal.webp' },
    { category: '课程', title: 'Adult Language Learning', description: '官网成人课程卡片图片，用于成人、私教、小组课方向。', src: 'assets/philippines/berlitz-adults.webp' },
    { category: '课程', title: 'Kids & Teens', description: '官网少儿青少年课程卡片图片，适合家庭和青少年语言学习方向。', src: 'assets/philippines/berlitz-kids-teens.webp' },
    { category: '企业', title: 'Cultural Training for Business', description: '官网企业文化培训图片，用于跨文化沟通和企业培训方向。', src: 'assets/philippines/berlitz-cultural-training.webp' },
    { category: '测评', title: 'Language Testing', description: '官网语言测评服务图片，适合测评、招聘筛选和企业评估方向。', src: 'assets/philippines/berlitz-testing.jpeg' },
    { category: '测评', title: 'TELC Preparation and Testing', description: '官网TELC相关图片，适合TELC考试准备和考试安排方向。', src: 'assets/philippines/berlitz-telc.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '中文名称', value: '菲律宾马尼拉Berlitz语言学校' },
    { label: '英文名称', value: 'Berlitz Philippines' },
    { label: '地址', value: 'The World Center 24th Floor, 330 Senator Gil Puyat Avenue, Makati' },
    { label: '电话', value: '(+632) 8721.63.13 / 8817-93-19 / 8635-77-14' },
    { label: '手机', value: '(+63917) 630.54.89' },
    { label: '邮箱', value: 'cco1manila@berlitzph.com' },
    { label: '课程形式', value: 'Private、Groups、Self-paced、Kids & Teens、Business Services、Testing、TELC' },
    { label: '住宿说明', value: '非寄宿制城市语言培训中心，住宿、餐食、接送和通勤需另行安排' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/berlitz-method.webp', title: '沉浸式Berlitz Method', text: '官网强调课堂从第一天开始使用目标语言，围绕真实场景、目标任务和练习表现推进。' },
    { image: 'assets/philippines/berlitz-adults.webp', title: '成人私教与小组课', text: 'Private适合快速达成个人目标，Group适合固定课表、互动学习和更可控预算。' },
    { image: 'assets/philippines/berlitz-cultural-training.webp', title: '企业语言与文化培训', text: '企业方案可按行业、岗位、预算和线上/面授/混合交付方式定制。' },
    { image: 'assets/philippines/berlitz-testing.jpeg', title: '语言测评和TELC资源', text: '适合需要招聘筛选、员工语言能力评估、TELC备考或考试安排的人群。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '成人和职场人士', text: '需要私教、小组课、商务沟通、旅行语言、面试表达或多语言学习的人。' },
    { title: '在马尼拉短住或工作的学生', text: '住宿和通勤已有安排，只需要把Makati面授或线上课程插入日程。' },
    { title: '企业HR和培训负责人', text: '需要员工语言培训、商务沟通、跨文化培训、测评或企业定制方案。' },
    { title: '家庭和青少年学习需求', text: '希望选择国际品牌少儿/青少年课程，并能配合线上或Makati上课安排。' },
    { title: '需要测评或TELC的人', text: '需要语言测试、欧洲语言证书相关备考、考试时间和报名协助。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想要宿舍、三餐和门禁管理', text: 'Berlitz不是宿务、碧瑶或Clark那类寄宿制ESL学校。' },
    { title: '需要公开固定完整价目表', text: '官网多数常规课程为询价制，只有部分短期公告会公开单项费用。' },
    { title: '追求全天多堂一对一ESL强化', text: '如果目标是每天密集ESL课表和校内学习管理，应优先比较传统菲律宾语言学校。' },
    { title: '无法接受小组课开班不确定', text: '公开小组课通常受最低人数、级别匹配和当期排课影响。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'Private Language Classes', type: '一对一 / 线上或面授', lessons: '可按学习目标和时间定制，适合需要快速进步或明确技能训练的人', suitable: '商务沟通、旅行、面试、特定语言技能和高灵活度安排。' },
    { name: 'Group Language Classes', type: '小组课 / 固定课表', lessons: '小组互动、教师带领、按固定节奏推进；官网说明适合希望成本更可控的人', suitable: '需要同伴互动、固定时间和口语练习氛围的成人学习者。' },
    { name: 'Self-paced Berlitz Connect', type: '线上自学 / 6或12个月', lessons: '官网列出英语、西语、法语、德语；6个月含10次实时口语练习，12个月含25次', suitable: '时间不固定、希望自学搭配实时口语练习的人。' },
    { name: 'Kids & Teens', type: '少儿青少年', lessons: '适合家庭按年龄、语言、线上/面授、私教/小组和课后时间确认', suitable: '在马尼拉生活、短住或希望安排国际品牌语言课的家庭。' },
    { name: 'Corporate Language Training', type: '企业培训', lessons: '官网说明可面授、线上或混合，按行业、岗位、预算和团队目标定制', suitable: 'HR、企业员工培训、外派、跨文化沟通和岗位语言能力提升。' },
    { name: 'Business Communication Training', type: '商务沟通', lessons: '包含组织沟通审计、商务沟通工作坊、目标设定和全球领导力沟通训练', suitable: '需要提升团队沟通效率、跨部门协作和国际商务表达的企业。' },
    { name: 'Language Testing / TELC', type: '测评 / 考试', lessons: '语言测评、听读、口语、写作、SOPI、TELC考试准备和考试安排', suitable: '招聘筛选、员工评估、证书考试和语言能力证明。' },
    { name: 'Berlitz Starter Course', type: '短期入门公告课', lessons: '官网2025公告公开Php 3,200，含学习材料，面向A1绝对初学者', suitable: '适合体验Berlitz Method；当前是否开放需重新确认。' },
  ];

  programFees: ProgramFee[] = [
    { id: 'starter-course', name: 'Berlitz Starter Course', tuition: 3200, currencyCode: 'PHP', unit: '公告入门课参考', suitable: '官网2025 Starter Course公告公开费用，含学习材料；当前开班需当期确认' },
    { id: 'public-english-group', name: 'Public English Group Class', tuition: 0, currencyCode: 'PHP', unit: '公开课排课', suitable: '官网Class Schedules列出English线上/面授公开课时段，需最低人数开班', quoteOnly: true },
    { id: 'private-language-classes', name: 'Private Language Classes', tuition: 0, currencyCode: 'PHP', unit: '按课时包报价', suitable: '一对一课程按语言、级别、目标、线上/面授和课时包报价', quoteOnly: true },
    { id: 'group-language-classes', name: 'Group Language Classes', tuition: 0, currencyCode: 'PHP', unit: '按班级报价', suitable: '小组课按语言、级别、人数、排课和学习中心安排报价', quoteOnly: true },
    { id: 'business-english-short-courses', name: 'Business English Short Courses', tuition: 0, currencyCode: 'PHP', unit: '按模块报价', suitable: '官网公告列出Negotiations、Email and Business Writing、Presentation、Customer Service等模块', quoteOnly: true },
    { id: 'corporate-language-training', name: 'Corporate Language Training', tuition: 0, currencyCode: 'PHP', unit: '企业方案报价', suitable: '按员工人数、行业词汇、岗位目标、交付方式和预算定制', quoteOnly: true },
    { id: 'berlitz-connect-6-months', name: 'Berlitz Connect 6 Months', tuition: 0, currencyCode: 'PHP', unit: '6个月订阅', suitable: '官网列出24/7材料、10次实时口语练习和30+练习主题', quoteOnly: true },
    { id: 'berlitz-connect-12-months', name: 'Berlitz Connect 12 Months', tuition: 0, currencyCode: 'PHP', unit: '12个月订阅', suitable: '官网列出24/7材料、25次实时口语练习和30+练习主题', quoteOnly: true },
    { id: 'language-testing-assessment', name: 'Language Testing and Assessment', tuition: 0, currencyCode: 'PHP', unit: '按项目报价', suitable: '口语、写作、听读、SOPI和企业测评需按项目确认', quoteOnly: true },
    { id: 'telc-exam-preparation-testing', name: 'TELC Exam Preparation and Testing', tuition: 0, currencyCode: 'PHP', unit: '按考试/备考报价', suitable: 'TELC考试日期、报名费、备考课和名额需当期确认', quoteOnly: true },
  ];

  roomFees: RoomFee[] = [
    { id: 'self-arranged', name: '住宿自理', fee: 0, currencyCode: 'PHP', note: 'Berlitz Philippines不是寄宿制ESL学校；酒店、公寓、亲友住宿或公司住宿需另行安排' },
  ];

  localFees: LocalFee[] = [
    { item: 'Placement / Proficiency Check', amount: '需确认', note: '官网Learning Cycle说明会了解目标、水平和学习需求；正式费用以学校回函为准' },
    { item: '教材 / Student Portal', amount: '需确认', note: '私教、小组、线上门户或自学平台的材料和访问规则需按课程确认' },
    { item: 'Corporate Customization', amount: '按方案报价', note: '企业课程按员工人数、岗位、行业词汇、交付方式和预算定制' },
    { item: 'Testing / TELC', amount: '按项目确认', note: '测评、TELC报名、证书和备考费用需按考试月份和项目确认' },
    { item: '住宿 / 餐食 / 通勤', amount: '自理', note: 'Makati城市课程不含宿舍、三餐和接送' },
    { item: '签证 / 保险 / 停留', amount: '自理', note: '短期或长期停留需按个人护照、行程和菲律宾入境规则确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '确认学习目标', text: '先判断是成人英语、商务沟通、少儿课程、企业培训、测评还是TELC。' },
    { icon: 'event', title: '核对排课和形式', text: '确认Private、Group、Self-paced、Online、Makati面授或企业上门/混合交付。' },
    { icon: 'payments', title: '拆分报价项目', text: '把课程费、材料、测评、考试、住宿、通勤和个人停留成本分开列出。' },
    { icon: 'hotel', title: '规划Makati通勤', text: '如果选面授，核对The World Center位置、住宿点、交通时间和上课时段。' },
    { icon: 'support_agent', title: '确认学校回函', text: '协助确认当期开班、最低人数、优惠、企业方案和正式缴费金额。' },
  ];

  readonly notes = [
    'Berlitz Philippines不是传统寄宿制ESL学校，本页不把住宿、餐食和通勤并入课程报价。',
    '官网多数常规课程没有公开完整固定价目表，因此数据库保留询价项目，避免编造课程费用。',
    '官网2025 Berlitz Starter Course公告公开费用为Php 3,200并含学习材料；是否仍开放需当期确认。',
    '官网Class Schedules列出English Onsite和Online公开课时段，并注明开班需要最低学生人数。',
    '私教和小组课费用会受语言、级别、课时包、线上或面授、老师和排课影响。',
    '企业培训、商务沟通和测评需根据员工人数、岗位目标、行业词汇、交付方式和预算报价。',
  ];

  readonly faqs: FaqItem[] = [
    { question: '菲律宾马尼拉Berlitz语言学校是寄宿制语言学校吗？', answer: '不是。它更适合归类为Makati城市语言培训中心，适合成人、少儿、企业培训、商务沟通、测评和TELC方向；住宿、餐食和通勤需要另行安排。' },
    { question: '为什么费用表里很多项目是“需当期确认”？', answer: '因为Berlitz Philippines官网没有公开完整固定价目表。不同语言、级别、课时、私教/小组、线上/面授和企业定制都会影响费用，所以必须以学校回函为准。' },
    { question: 'Berlitz适合短期马尼拉学生吗？', answer: '适合已经能自行安排马尼拉住宿和通勤，并且目标是语言课、商务沟通、面试、测评或短期学习体验的人。' },
    { question: 'Berlitz和American English怎么选？', answer: 'Berlitz更偏国际品牌、体系、多语言、测评和企业方案；American English更偏成人英语沟通、商务英语和一对一定制训练。最终看目标、预算、位置和排课。' },
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
    { label: 'Berlitz Philippines官方主页', url: 'https://www.berlitzph.com/' },
    { label: 'Adults成人课程页', url: 'https://www.berlitzph.com/adults/' },
    { label: 'Private一对一课程页', url: 'https://www.berlitzph.com/adults/private/' },
    { label: 'Group小组课程页', url: 'https://www.berlitzph.com/adults/groups/' },
    { label: 'Self-paced线上自学页', url: 'https://www.berlitzph.com/adults/self-paced/' },
    { label: 'Class Schedules公开课排期', url: 'https://www.berlitzph.com/class-schedules/' },
    { label: 'Berlitz Starter Course公告', url: 'https://www.berlitzph.com/berlitz-starter-course/' },
    { label: 'Berlitz Business English公告', url: 'https://www.berlitzph.com/berlitz-business-english/' },
    { label: 'Corporate Language Training', url: 'https://www.berlitzph.com/business-services/language-training/' },
    { label: 'Language Testing and Assessment', url: 'https://www.berlitzph.com/business-services/testing-and-assessment/' },
    { label: 'Business Communication Training', url: 'https://www.berlitzph.com/business-services/business-communication/' },
    { label: 'Contact / Makati', url: 'https://www.berlitzph.com/contact/' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toLowerCase().includes('berlitz')) ??
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
      return `${this.selectedProgram.name}（${this.selectedProgram.unit}）需按语言、级别、课时、排课和学校回函确认；住宿、通勤、签证、保险和个人费用另计`;
    }
    return `${this.selectedProgram.name}（${this.selectedProgram.unit}）；住宿、通勤、签证、保险和个人费用另计`;
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
      'Berlitz Starter Course': 'starter-course',
      'Public English Group Class': 'public-english-group',
      'Private Language Classes': 'private-language-classes',
      'Group Language Classes': 'group-language-classes',
      'Business English Short Courses': 'business-english-short-courses',
      'Corporate Language Training': 'corporate-language-training',
      'Berlitz Connect 6 Months': 'berlitz-connect-6-months',
      'Berlitz Connect 12 Months': 'berlitz-connect-12-months',
      'Language Testing and Assessment': 'language-testing-assessment',
      'TELC Exam Preparation and Testing': 'telc-exam-preparation-testing',
      '住宿自理': 'self-arranged',
    };
    if (knownKeys[value]) return knownKeys[value];
    const slug = value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return slug || value;
  }

  private unitForLesson(lesson: SchoolLessonDTO): string {
    if (lesson.name.includes('Starter')) return '公告入门课参考';
    if (lesson.name.includes('6 Months')) return '6个月订阅';
    if (lesson.name.includes('12 Months')) return '12个月订阅';
    if (lesson.name.includes('Corporate')) return '企业方案报价';
    if (lesson.name.includes('Testing') || lesson.name.includes('TELC')) return '按项目报价';
    if (lesson.name.includes('Group')) return '按班级报价';
    if (lesson.name.includes('Private')) return '按课时包报价';
    return '需核价';
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  private currencyCodeForDisplay(code?: string): string {
    return !code ? 'PHP' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();
  }

  private cleanFeeDescription(description?: string): string {
    return description ? description.replace(/^到校支付费用：/, '').replace(/^前期支付费用：/, '') : '以学校正式报价为准';
  }
}
