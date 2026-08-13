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

type GalleryCategory = '全部' | '品牌' | '课堂' | '课程' | '企业';

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
  selector: 'app-american-english-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './american-english-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './american-english-school-detail.component.css',
  ],
})
export class AmericanEnglishSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'American';
  private readonly pricingSchoolNames = [
    '菲律宾马尼拉American-English-Skill语言学校',
    'American English Skills Development Center',
  ];
  private readonly programOrder = [
    'online-business-conversation-40',
    'basic-conversational-low',
    'basic-conversational-high',
    'business-conversational-low',
    'business-conversational-high',
    'assertive-communication-low',
    'assertive-communication-high',
    'eec-one-on-one-low',
    'eec-one-on-one-high',
    'business-writing-low',
    'business-writing-high',
    'private-business-english-40',
    'private-business-english-120',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '品牌', '课堂', '课程', '企业'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedProgramId = 'online-business-conversation-40';
  selectedStartDate = '2026-09-14';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '城市', value: 'Makati / Metro Manila', note: '官网列出地址为901B Vicente Madrigal Building, 6793 Ayala Avenue, Makati City。' },
    { icon: 'business_center', label: '定位', value: '商务英语与沟通训练中心', note: '更偏成人、职场、一对一、团体课和企业培训，不是传统寄宿制ESL学校。' },
    { icon: 'school', label: '成立', value: 'Since 2006', note: '官网说明American English Skills Development Center Inc.于2006年3月在Makati成立。' },
    { icon: 'groups', label: '形式', value: 'Online / Face-to-Face / On-site', note: '个人课程可线上或Makati面授，企业课程可线上、到公司现场或混合交付。' },
    { icon: 'menu_book', label: '课程', value: 'Group / One-on-One / Corporate', note: '覆盖商务口语、基础会话、商务写作、发音、演讲、IELTS和企业定制。' },
    { icon: 'hotel', label: '住宿', value: '住宿自理', note: '酒店、公寓、亲友住宿、餐食、通勤和保险都需要单独规划。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '品牌', title: 'American English品牌图', description: '官网公开品牌图，突出“Empowering People”的沟通训练定位。', src: 'assets/philippines/american-english-brand.png' },
    { category: '课堂', title: 'American English培训现场', description: '官网课程页公开的培训/学员照片，适合展示Makati城市培训中心属性。', src: 'assets/philippines/american-english-training-room.jpg' },
    { category: '课程', title: 'Accent Neutralization', description: '官网课程图，用于发音、口音中和和清晰表达方向。', src: 'assets/philippines/american-english-accent-neutralization.jpg' },
    { category: '课程', title: 'Business Writing', description: '官网课程图，适合商务邮件、报告、技术写作和职场文本训练。', src: 'assets/philippines/american-english-business-writing.jpg' },
    { category: '企业', title: 'Presentation Skills', description: '官网课程图，适合会议、演讲、汇报和领导力表达训练。', src: 'assets/philippines/american-english-presentation-skills.jpg' },
    { category: '课程', title: 'Speech Enhancement', description: '官网课程图，适合口语流利度、听说和自然表达补强。', src: 'assets/philippines/american-english-speech-enhancement.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '中文名称', value: '菲律宾马尼拉American-English-Skill语言学校' },
    { label: '英文名称', value: 'American English Skills Development Center Inc.' },
    { label: '地址', value: 'Room 901B, Vicente Madrigal Building, 6793 Ayala Avenue, Makati City, Philippines' },
    { label: '官网定位', value: 'Business English and Communication Skills training center' },
    { label: '课程形式', value: 'Group Classes、One-on-One Private Training、Corporate Training、Kids & Teens、Online / Face-to-Face' },
    { label: '课表说明', value: '团体课通常每周2-3次、6-10周；一对一可按个人时间弹性安排' },
    { label: '联系方式', value: 'info@americanenglish.ph / WhatsApp +63 933 825 7992' },
    { label: '住宿说明', value: '非寄宿制，住宿、餐食、交通、保险与签证停留需另行安排' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/american-english-training-room.jpg', title: 'Makati城市培训中心', text: '适合已经在马尼拉、短住马尼拉、商务出差或希望把英语课插入城市行程的人。' },
    { image: 'assets/philippines/american-english-business-writing.jpg', title: '商务写作和职场沟通清晰', text: '官网课程覆盖商务邮件、报告、表达、会议、客户服务和领导力沟通。' },
    { image: 'assets/philippines/american-english-accent-neutralization.jpg', title: '一对一目标更聚焦', text: '一对一可围绕发音、口语、IELTS、商务写作、面试或演讲进行定制。' },
    { image: 'assets/philippines/american-english-presentation-skills.jpg', title: '企业培训流程成熟', text: '企业课程从Training Needs Analysis开始，再设计课程、交付训练并做课后评估。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '成人和职场人士', text: '想强化会议、演讲、邮件、客户沟通、发音、面试或跨文化商务表达。' },
    { title: '在马尼拉短住或出差的人', text: '住宿和通勤已经有安排，希望在Makati或线上补强英语沟通。' },
    { title: '需要灵活排课的一对一学生', text: '想按自己的时间安排线上或面授，围绕个人弱点快速训练。' },
    { title: '企业HR或团队负责人', text: '需要按照员工岗位、行业、沟通痛点和KPI定制企业内训。' },
    { title: '不需要寄宿制管理的人', text: '能自行安排住宿、餐食、城市交通和停留文件。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想要宿舍+三餐+门禁套餐', text: 'American English不是宿务、碧瑶或Clark那类校内住宿制语言学校。' },
    { title: '需要全天高强度沉浸ESL', text: '如果目标是每天多堂一对一、强制自习和密集校内管理，应优先比较传统ESL学校。' },
    { title: '只看最低价格的人', text: '官网价格会按团体/一对一、线上/面授、小时数和优惠变化，需要按当期购物车或学校回函确认。' },
    { title: '无法处理城市通勤的人', text: 'Makati上课点、住处距离、交通时间和安全感会直接影响体验。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'Online Business Conversational English', type: '团体课 / 线上', lessons: '40小时，最大10人，官网列出周一/周三/周五频率', suitable: '适合想用较清晰预算训练商务口语、会议、表达和工作场景沟通的人。' },
    { name: 'Basic Conversational English', type: '团体课 / 基础口语', lessons: '线上或Makati面授，官网公开价格区间PHP19,700-29,500', suitable: '适合基础英语、国际学生、生活旅行和日常社交表达。' },
    { name: 'Business Conversational English', type: '团体课 / 商务口语', lessons: '线上或面授，官网公开价格区间PHP19,700-48,000', suitable: '适合会议、展示、面试、networking和日常职场表达。' },
    { name: 'Excellence in English Communication', type: '一对一 / 私教', lessons: '按水平、目标和场景定制，官网公开价格区间PHP12,800-98,800', suitable: '适合想把工作和生活英语系统补强的人。' },
    { name: 'Excellence in Business Writing', type: '一对一 / 商务写作', lessons: '商务邮件、备忘录、报告、线上内容和营销文本可定制', suitable: '适合职场写作、英文邮件、报告和专业表达。' },
    { name: 'Corporate Training', type: '企业内训', lessons: 'TNA需求分析、课程设计、线上/现场/混合交付、课后评估', suitable: '适合公司团队、政府组织、跨国企业和HR培训项目。' },
  ];

  programFees: ProgramFee[] = [
    { id: 'online-business-conversation-40', name: 'Online Business Conversational English 40 Hours', tuition: 14800, currencyCode: 'PHP', unit: '40小时项目', suitable: '官网公开线上商务会话团体课，最大10人，需确认当期开班' },
    { id: 'basic-conversational-low', name: 'Basic Conversational English Low', tuition: 19700, currencyCode: 'PHP', unit: '每人起', suitable: '官网公开团体课价格区间低值' },
    { id: 'basic-conversational-high', name: 'Basic Conversational English High', tuition: 29500, currencyCode: 'PHP', unit: '每人高值', suitable: '官网公开团体课价格区间高值' },
    { id: 'business-conversational-low', name: 'Business Conversational English Low', tuition: 19700, currencyCode: 'PHP', unit: '每人起', suitable: '官网公开商务会话团体课价格区间低值' },
    { id: 'business-conversational-high', name: 'Business Conversational English High', tuition: 48000, currencyCode: 'PHP', unit: '每人高值', suitable: '官网公开商务会话团体课价格区间高值' },
    { id: 'assertive-communication-low', name: 'Assertive Communication Low', tuition: 19700, currencyCode: 'PHP', unit: '每人起', suitable: '官网公开团体课价格区间低值' },
    { id: 'assertive-communication-high', name: 'Assertive Communication High', tuition: 48000, currencyCode: 'PHP', unit: '每人高值', suitable: '官网公开团体课价格区间高值' },
    { id: 'eec-one-on-one-low', name: 'Excellence in English Communication Low', tuition: 12800, currencyCode: 'PHP', unit: '每人起', suitable: '官网公开一对一课程价格区间低值' },
    { id: 'eec-one-on-one-high', name: 'Excellence in English Communication High', tuition: 98800, currencyCode: 'PHP', unit: '每人高值', suitable: '官网公开一对一课程价格区间高值' },
    { id: 'business-writing-low', name: 'Excellence in Business Writing Low', tuition: 12800, currencyCode: 'PHP', unit: '每人起', suitable: '官网公开商务写作一对一价格区间低值' },
    { id: 'business-writing-high', name: 'Excellence in Business Writing High', tuition: 98800, currencyCode: 'PHP', unit: '每人高值', suitable: '官网公开商务写作一对一价格区间高值' },
    { id: 'private-business-english-40', name: 'Business English One-on-One 40 Hours', tuition: 48000, currencyCode: 'PHP', unit: '40小时参考', suitable: '官网Business English产品页公开40小时起价参考' },
    { id: 'private-business-english-120', name: 'Business English One-on-One 120 Hours', tuition: 155904, currencyCode: 'PHP', unit: '120小时参考', suitable: '官网Business English产品页公开高值参考' },
  ];

  roomFees: RoomFee[] = [
    { id: 'self-arranged', name: '住宿自理', fee: 0, currencyCode: 'PHP', note: '非寄宿制；酒店、公寓、亲友住宿或公司住宿需另行安排' },
  ];

  localFees: LocalFee[] = [
    { item: 'Pre-assessment / Needs Assessment', amount: '需确认', note: '官网FAQ说明入学前会先做简短需求或英语水平评估' },
    { item: '教材 / 课程资料', amount: '需确认', note: '按实际课程、小时数和定制内容确认' },
    { item: 'Corporate Training', amount: '按方案报价', note: '企业课程先做Training Needs Analysis，再按人数、模块和交付方式报价' },
    { item: '住宿 / 餐食 / 通勤', amount: '自理', note: '城市课程不含宿舍和三餐，Makati通勤需单独规划' },
    { item: '签证 / 保险 / 停留', amount: '自理', note: '国际学生按停留时间、护照和行程另行确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先判断学习场景', text: '确认是口语、商务写作、发音、演讲、IELTS、一对一还是企业内训。' },
    { icon: 'calendar_month', title: '核对上课形式', text: '确认线上、Makati面授、到公司现场或混合交付，以及可选课表和开课日期。' },
    { icon: 'payments', title: '拆分PHP费用', text: '把课程费、测评、资料、企业定制、住宿、通勤和个人停留费用分开估算。' },
    { icon: 'hotel', title: '安排城市住宿通勤', text: '按Makati上课点、住处、交通时间和预算筛选酒店、公寓或亲友住宿。' },
    { icon: 'support_agent', title: '顾问确认回函', text: '协助确认课程名额、当期价格、优惠、付款节点和正式报名材料。' },
  ];

  readonly notes = [
    'American English不是传统寄宿制ESL学校，本页不把住宿、餐食和通勤并入课程报价。',
    '官网课程价格会因团体课/一对一、线上/面授、小时数、班级人数和当期优惠不同而变化。',
    '线上商务会话团体课官网公开为40小时、最大10人、PHP14,800，但开班日期需当期确认。',
    '官网Programs页面公开多项团体课价格区间为PHP19,700-48,000，基础会话课为PHP19,700-29,500。',
    '一对一课程如Excellence in English Communication和Excellence in Business Writing公开区间为PHP12,800-98,800。',
    '企业培训需先做Training Needs Analysis，再按公司需求、人数、模块和交付方式报价。',
  ];

  readonly faqs: FaqItem[] = [
    { question: '菲律宾马尼拉American-English-Skill语言学校是寄宿制语言学校吗？', answer: '不是。它更适合归类为Makati城市型商务英语、成人沟通训练、一对一和企业培训中心，住宿、餐食和通勤需要另行安排。' },
    { question: '公开价格可以直接作为最终报价吗？', answer: '不建议。官网公开价格适合做预算初筛，正式报名仍需确认课程类型、小时数、线上或面授、开班日期、优惠和学校回函。' },
    { question: '它适合国际学生短期学英语吗？', answer: '适合已经能自行安排马尼拉住宿和通勤，并且目标是口语、职场沟通、发音、商务写作或一对一补强的学生。' },
    { question: '和宿务、碧瑶语言学校怎么选？', answer: '想要城市商务课程和弹性排课可看American English；想要宿舍、三餐、全天课表和校内管理，应优先比较宿务、碧瑶或Clark。' },
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
    { label: 'American English官方主页', url: 'https://americanenglish.ph/' },
    { label: 'Programs官方课程页', url: 'https://americanenglish.ph/programs/' },
    { label: 'Business English专题页', url: 'https://americanenglish.ph/business-english-philippines/' },
    { label: 'Online Business Conversational English', url: 'https://americanenglish.ph/program/open-for-enrollment/online-business-conversational-english/' },
    { label: 'Corporate Training官方页', url: 'https://americanenglish.ph/corporate-training/' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toLowerCase().includes('american english')) ??
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

  get quoteAmount(): number {
    return this.selectedProgram.tuition;
  }

  get quoteText(): string {
    return `${this.formatMoney(this.quoteAmount, this.selectedProgram.currencyCode)} 起`;
  }

  get quoteNote(): string {
    return `${this.selectedProgram.name}（${this.selectedProgram.unit}）；住宿、通勤、签证、保险和个人费用另计`;
  }

  formatMoney(value: number, currencyCode = 'PHP'): string {
    return `${currencyCode} ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  private priceKey(value: string): string {
    const knownKeys: Record<string, string> = {
      'Online Business Conversational English 40 Hours': 'online-business-conversation-40',
      'Basic Conversational English Low': 'basic-conversational-low',
      'Basic Conversational English High': 'basic-conversational-high',
      'Business Conversational English Low': 'business-conversational-low',
      'Business Conversational English High': 'business-conversational-high',
      'Assertive Communication Low': 'assertive-communication-low',
      'Assertive Communication High': 'assertive-communication-high',
      'Excellence in English Communication Low': 'eec-one-on-one-low',
      'Excellence in English Communication High': 'eec-one-on-one-high',
      'Excellence in Business Writing Low': 'business-writing-low',
      'Excellence in Business Writing High': 'business-writing-high',
      'Business English One-on-One 40 Hours': 'private-business-english-40',
      'Business English One-on-One 120 Hours': 'private-business-english-120',
      '住宿自理': 'self-arranged',
    };
    if (knownKeys[value]) return knownKeys[value];
    const slug = value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return slug || value;
  }

  private unitForLesson(lesson: SchoolLessonDTO): string {
    if (lesson.name.includes('40 Hours')) return '40小时项目';
    if (lesson.name.includes('120 Hours')) return '120小时项目';
    if (lesson.name.includes('High')) return '每人高值';
    return '每人起';
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
