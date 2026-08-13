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

type GalleryCategory = '全部' | '校园' | '课程' | '费用';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface CourseFee { id: string; name: string; tuition: number; currencyCode: string; suitable: string; }
interface RoomFee { id: string; name: string; fee: number; currencyCode: string; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SourceLink { label: string; url: string; }

@Component({
  selector: 'app-help-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './help-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './help-school-detail.component.css',
  ],
})
export class HelpSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'HELP';
  private readonly pricingSchoolNames = ['菲律宾克拉克HELP English语言学校', 'HELP English Clark', 'HELP Clark Campus', 'HELP Clark'];
  private readonly courseFeeOrder = [
    'esl',
    'esl-intensive',
    'business-english',
    'family-program',
    'ielts-toeic-basic',
    'ielts-toeic-intermediate',
    'ielts-toeic-advanced',
  ];
  private readonly roomFeeOrder = ['quadra-room', 'triple-room', 'double-room', 'single-room'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '课程', '费用'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId = 'esl';
  selectedRoomId = 'quadra-room';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;
  registrationFee = 0;
  registrationCurrencyCode = 'USD';
  readonly weekOptions = [4, 6, 8, 10, 12, 16, 20, 24];

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '城市', value: 'Clark Freeport Zone', note: '官方地址为Building 5272 CM Recto Highway, Clark, Pampanga。' },
    { icon: 'shield', label: '校区环境', value: '前美军基地 / 管制区', note: '官方强调24小时安全检查点与克拉克园区生活便利。' },
    { icon: 'flight_takeoff', label: '机场距离', value: 'Clark约15分钟', note: '从马尼拉机场约1.5-2小时，适合重视抵达效率的学生。' },
    { icon: 'school', label: '课程', value: 'ESL / IELTS / TOEIC / Business', note: '另有Family、Junior和线上一对一课程方向。' },
    { icon: 'history_edu', label: '学习制度', value: 'Sparta + EOP', note: 'EOP时间为07:00-18:00，平日外出受限，晚自习和词汇测试更严格。' },
    { icon: 'payments', label: '4周起价', value: 'USD 1,500 起', note: 'ESL USD900 + 四人房USD600；当地PHP费用另算。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'HELP Clark主楼', description: 'HELP官网Clark Campus页面公开的校区主楼图片。', src: 'assets/philippines/help-clark-main-building.jpg' },
    { category: '校园', title: 'Clark校区入口环境', description: '同一官方主楼图片可用于核对校舍外观、道路和园区绿化。', src: 'assets/philippines/help-clark-main-building.jpg' },
    { category: '课程', title: 'Sparta学习制度', description: 'HELP Clark采用HELP体系的斯巴达管理，EOP、晚自习和词汇测试需要重点确认。', src: 'assets/philippines/help-clark-main-building.jpg' },
    { category: '费用', title: 'HELP Clark当地费用表', description: 'HELP官方Tuition/Local Fee页面公开的Clark当地PHP费用图表。', src: 'assets/philippines/help-clark-local-fee.jpeg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾克拉克HELP English语言学校' },
    { label: '英文名称', value: 'HELP Clark Campus / HELP English Academy' },
    { label: '品牌创立', value: 'HELP English创立于1996年；Clark校区2011年开放' },
    { label: '地址', value: 'Building 5272 CM Recto Highway, Clark, Pampanga, Philippines' },
    { label: '校区规模', value: '官方新页面写明Clark校区约10,000平方米' },
    { label: '教室配置', value: '官方页面列出80间1:1教室、20间1:5小组教室、6间大讲堂' },
    { label: '宿舍房型', value: 'Semi-Single、Double、Triple、Quad；费用表按Single/Double/Triple/Quadra计价' },
    { label: '官方联系', value: 'baguiohelp@gmail.com / www.helpenglish.org' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/help-clark-main-building.jpg', title: '老牌HELP体系', text: 'HELP从1996年开始运营，适合想比较老牌Sparta体系、学习管理和考试路线的学生。' },
    { image: 'assets/philippines/help-clark-main-building.jpg', title: 'Clark安全园区', text: 'Clark Freeport Zone交通和安全优势明显，离Clark机场近，也便于周末生活安排。' },
    { image: 'assets/philippines/help-clark-local-fee.jpeg', title: '费用拆分清楚', text: '课程住宿以USD计算，到校当地费用以PHP另列，报价时必须分开核对。' },
    { image: 'assets/philippines/help-clark-main-building.jpg', title: '考试课程选择', text: 'IELTS、TOEIC和Business English都在官方课程体系里，适合升学、求职和职场英语目标。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想要强管理学习节奏', text: 'HELP Clark有Sparta、EOP、晚自习和词汇测试，更适合需要外部纪律的人。' },
    { title: '目标是ESL打底后转考试', text: 'ESL可衔接IELTS、TOEIC或Business，适合8-12周以上逐步规划。' },
    { title: '重视Clark机场和园区安全', text: 'Clark校区离机场近，周边医院、商场和生活资源更好安排。' },
    { title: '需要官方USD价目表', text: 'HELP公开了4周课程和宿舍USD表，便于先做基础预算。' },
    { title: '想比较碧瑶与克拉克HELP体系', text: '同一HELP品牌下，Clark偏交通便利和现代设施，碧瑶偏安静山城学习环境。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想自由度很高的游学', text: 'HELP Clark平日外出和晚自习管理更严格，不适合只想轻松度假式安排的人。' },
    { title: '只看课程住宿总价', text: 'USD课程住宿之外，还要加PHP当地费用、签证、材料、接机和长期停留项目。' },
    { title: '不能接受Sparta日程', text: '如果学生抗拒EOP、晚自习和词汇测试，建议同步比较WE或更自由的Clark学校。' },
    { title: '需要低龄托管型亲子体验', text: 'Family方向可以看，但低龄儿童照护、家长责任和Junior活动名额必须提前单独确认。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'ESL / ESL Intensive', type: '一般英语', lessons: 'Regular ESL 4节1:1；Intensive ESL增加1节个人听力课', suitable: '适合基础打底、口语自信和第一次菲律宾游学。' },
    { name: 'IELTS Basic / Intermediate / Advanced', type: '雅思备考', lessons: 'IELTS Speaking/Writing一对一 + Reading/Listening小组 + 模考', suitable: '适合升学、移民或工作目标，需按入学分数选择级别。' },
    { name: 'TOEIC Basic / Intermediate / Advanced', type: '多益备考', lessons: '每日4节1:1搭配听读训练、词汇测试和定期模考', suitable: '适合求职、毕业门槛和职场英语证书目标。' },
    { name: 'Business English', type: '商务英语', lessons: '会议、邮件、演讲、谈判和商务沟通场景训练', suitable: '适合已有中级基础的职场人士或转商务路线学生。' },
    { name: 'Family Program', type: '亲子课程', lessons: '父母与孩子同住，孩子课程可按能力和年龄调整', suitable: '适合亲子同行，但监护、房型、活动名额需提前确认。' },
    { name: 'Junior / Online 1:1', type: '青少年与线上', lessons: 'Junior Camp与线上课程按当期开放和年龄规则确认', suitable: '适合假期或无法长期到校的学生作为补充方案。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'esl', name: 'ESL', tuition: 900, currencyCode: 'USD', suitable: '4周基础沟通英语，适合初次游学和口语打底' },
    { id: 'esl-intensive', name: 'ESL Intensive', tuition: 1040, currencyCode: 'USD', suitable: '4周强化沟通英语，适合想增加一对一课时' },
    { id: 'business-english', name: 'Business English', tuition: 1050, currencyCode: 'USD', suitable: '4周商务沟通、演示和邮件写作方向' },
    { id: 'family-program', name: 'Family Program', tuition: 1000, currencyCode: 'USD', suitable: '4周亲子课程，需确认儿童年龄和家长责任' },
    { id: 'ielts-toeic-basic', name: 'IELTS / TOEIC Basic', tuition: 1050, currencyCode: 'USD', suitable: '4周考试基础，官方级别参考IELTS 3.0-4.5' },
    { id: 'ielts-toeic-intermediate', name: 'IELTS / TOEIC Intermediate', tuition: 1050, currencyCode: 'USD', suitable: '4周考试中级，官方级别参考IELTS 4.5-5.5' },
    { id: 'ielts-toeic-advanced', name: 'IELTS / TOEIC Advanced', tuition: 1150, currencyCode: 'USD', suitable: '4周考试进阶，官方级别参考IELTS 5.5以上' },
  ];

  roomFees: RoomFee[] = [
    { id: 'quadra-room', name: 'Quadra Room / 四人房', fee: 600, currencyCode: 'USD', note: '4周住宿费，含校内餐食和饮用水' },
    { id: 'triple-room', name: 'Triple Room / 三人房', fee: 680, currencyCode: 'USD', note: '4周住宿费，预算与舒适度较平衡' },
    { id: 'double-room', name: 'Double Room / 双人房', fee: 780, currencyCode: 'USD', note: '4周住宿费，适合朋友同行或重视空间' },
    { id: 'single-room', name: 'Single Room / 单人房', fee: 1030, currencyCode: 'USD', note: '4周住宿费，隐私最高，需提前确认空房' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐', text: '校内餐厅用餐；随后进入Morning Reading或正式课。' },
    { time: '08:30 - 11:40', title: '上午课程', text: '一对一课程为主，ESL偏Reading/Speaking/Writing，考试课按科目专项训练。' },
    { time: '11:40 - 12:15', title: '午餐', text: '校内餐厅用餐，下午继续小组课和个人课程。' },
    { time: '12:25 - 17:05', title: '下午课程', text: '1:5小组、个人课、自习和Special Class穿插安排。' },
    { time: '17:15 - 18:00', title: '晚餐', text: '晚餐后进入Sparta晚间管理节奏。' },
    { time: '19:00 - 22:00', title: '晚自习与词汇测试', text: '19:00自习、20:00词汇测试、21:00团体自习，平日更适合专注学习。' },
  ];

  localFees: LocalFee[] = [
    { item: 'Deposit', amount: 'PHP 3,000', note: '退房检查后按罚款、损坏、电费或超额洗衣扣除后退还' },
    { item: 'Visa Extension / 4周', amount: 'PHP 0', note: '4周参考；6周及以上按官方当地费用表递增' },
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，到校支付' },
    { item: 'Water', amount: 'PHP 600', note: '4周基础水费参考' },
    { item: 'Electricity Deposit', amount: 'PHP 1,000', note: '4周空调用电押金/预存，按实际规则扣除' },
    { item: 'Maintenance', amount: 'PHP 1,000', note: '4周设施维护费参考' },
    { item: 'Laundry', amount: 'PHP 1,000', note: '4周洗衣参考；超过16kg另收PHP35/kg' },
    { item: 'E I Card / SSP E-Card', amount: 'PHP 4,500', note: '官方Clark当地费用表列示项目' },
    { item: 'Learning Materials', amount: 'PHP 1,700', note: '4周教材/学习材料参考' },
    { item: 'ID', amount: 'PHP 200', note: '学生证办理参考' },
    { item: 'Local Fee Total / 4周', amount: 'PHP 20,800', note: 'HELP Clark官方当地费用表4周总额' },
    { item: 'Airport Pickup', amount: '需当期确认', note: '按Clark或Manila机场、指定接机日和学校LOA确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'flag', title: '确认学习目标', text: '先判断是ESL打底、雅思、多益、商务、亲子还是Junior路线。' },
    { icon: 'fact_check', title: '核对课程与房型', text: '按入学日期确认课程级别、房型空位、EOP和Sparta规则。' },
    { icon: 'payments', title: '拆分USD与PHP费用', text: '课程住宿用USD公式估算，当地费用按PHP表和周数另列。' },
    { icon: 'flight_takeoff', title: '确认接机与抵达', text: 'Clark和Manila机场交通时间不同，航班要和指定接机安排一起确认。' },
    { icon: 'support_agent', title: '报名后持续跟进', text: '到校后如遇调课、宿舍、费用或考试报名问题，顾问继续协助沟通。' },
  ];

  readonly notes = [
    'HELP官方费用公式为（课程费 + 宿舍费）x 学习周数 / 4；当地费用、签证、材料和接机不包含在USD课程住宿费中。',
    'Dormitory fee按4周计算，官方说明包含校内餐食和饮用水。',
    'Clark当地费用4周总额为PHP20,800；6周、8周及以上会随签证、水电、维护、洗衣和教材递增。',
    'EOP时间为07:00-18:00，平日外出限制、晚自习和词汇测试对学生自律要求更高。',
    '官方页面写明Clark校区可协助IELTS等考试相关安排，但具体考试日期、名额和报名费需按当期确认。',
  ];

  readonly faqs: FaqItem[] = [
    { question: '菲律宾克拉克HELP English语言学校4周最低多少钱？', answer: '按官方USD表，ESL课程USD900 + Quadra四人房USD600，4周课程住宿合计USD1,500起。PHP当地费用另算，4周Clark当地费用表总额为PHP20,800。' },
    { question: 'HELP Clark适合雅思或多益吗？', answer: '适合放进候选。官方IELTS和TOEIC页面列出Basic、Intermediate、Advanced结构、1:1课程、模考和Sparta日程；最终仍需按入学成绩和开课档期确认。' },
    { question: 'HELP Clark管理严格吗？', answer: '相对严格。官方Clark页面列出Sparta系统、EOP 07:00-18:00、平日外出限制、晚自习和词汇测试，更适合需要集中学习的人。' },
    { question: 'HELP Clark和WE Academy怎么选？', answer: 'HELP更偏老牌Sparta和考试路线，WE更偏亲子、Native Mix和度假式校园。若学生需要纪律和考试目标，HELP更值得看；若想自由舒适和低龄亲子，WE也应比较。' },
    { question: '费用表会变化吗？', answer: '会。HELP官方Local Fee页面说明当地费用可能因菲律宾政府规则调整而变动，所以正式报价仍需以学校回函和顾问确认价目为准。' },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用计算', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'payments' },
    { label: '服务流程', target: 'service-process', icon: 'task_alt' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '服务', target: 'service-process', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'HELP Clark Campus官方页面', url: 'https://www.helpenglish.org/p/clark-campus.html' },
    { label: 'HELP Tuition and Fees官方页面', url: 'https://www.helpenglish.org/p/tuition-and-fees.html' },
    { label: 'HELP Local Fee官方页面', url: 'https://www.helpenglish.org/p/help-english-local-fee.html' },
    { label: 'HELP ESL Program官方页面', url: 'https://www.helpenglish.org/p/esl-program.html' },
    { label: 'HELP IELTS Program官方页面', url: 'https://www.helpenglish.org/p/ielts-program.html' },
    { label: 'HELP TOEIC Program官方页面', url: 'https://www.helpenglish.org/p/toeic-program.html' },
    { label: 'HELP Business English官方页面', url: 'https://www.helpenglish.org/p/business-english-program.html' },
    { label: 'HELP About官方页面', url: 'https://www.helpenglish.org/p/about-us.html' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toUpperCase().includes('HELP')) ??
          schools[0];
        if (!school?.id) return EMPTY;
        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees }) => this.applyPricingData(lessons, rooms, fees));
  }

  private applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    const databaseCourseFees = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => ({
        id: this.priceKey(lesson.name),
        name: lesson.name,
        tuition: lesson.price,
        currencyCode: this.currencyCodeForDisplay(lesson.currencyCode),
        suitable: lesson.description || lesson.note || '请联系顾问确认适合人群',
      }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourseFees.length > 0) {
      this.courseFees = databaseCourseFees;
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) {
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'esl')?.id ?? this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({
        id: this.priceKey(room.name),
        name: room.name,
        fee: room.price,
        currencyCode: this.currencyCodeForDisplay(room.currencyCode),
        note: room.description || '请联系顾问确认空房',
      }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId = this.roomFees.find((room) => room.id === 'quadra-room')?.id ?? this.roomFees[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === 'Registration Fee' || fee.name === '注册费');
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
      this.registrationCurrencyCode = this.currencyCodeForDisplay(registrationFee.currencyCode);
    }

    const databaseLocalFees = fees
      .filter((fee) => fee.name !== 'Registration Fee' && fee.name !== '注册费')
      .map((fee) => ({
        item: fee.name,
        amount: fee.fee <= 0 && /确认|接机|Pickup|未单独列出/.test(fee.description || fee.name)
          ? '需当期确认'
          : this.formatMoney(fee.fee, this.currencyCodeForDisplay(fee.currencyCode)),
        note: this.cleanFeeDescription(fee.description),
      }));
    if (databaseLocalFees.length > 0) this.localFees = databaseLocalFees;
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

  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[0]; }
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * this.selectedWeeks / 4; }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * this.selectedWeeks / 4; }
  get quoteCurrencyCode(): string { return this.selectedCourse.currencyCode || this.selectedRoom.currencyCode || 'USD'; }
  get registrationForQuote(): number { return this.registrationCurrencyCode === this.quoteCurrencyCode ? this.registrationFee : 0; }
  get quoteAmount(): number { return this.registrationForQuote + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get quoteText(): string { return `${this.formatMoney(this.quoteAmount, this.quoteCurrencyCode)} 起`; }
  get registrationFeeText(): string { return this.registrationFee > 0 ? this.formatMoney(this.registrationFee, this.registrationCurrencyCode) : '未列入公开USD表'; }
  get formulaText(): string { return `(${this.selectedCourse.name} + ${this.selectedRoom.name}) x ${this.selectedWeeks}周 / 4`; }

  formatMoney(value: number, currencyCode = 'USD'): string {
    if (value < 0) return '需当期确认';
    const decimals = ['USD', 'PHP', 'KRW'].includes(currencyCode) ? 0 : 1;
    return `${currencyCode} ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals })}`;
  }

  private priceKey(value: string): string {
    const knownKeys: Record<string, string> = {
      ESL: 'esl',
      'ESL Intensive': 'esl-intensive',
      'Business English': 'business-english',
      'Family Program': 'family-program',
      'IELTS / TOEIC Basic': 'ielts-toeic-basic',
      'IELTS / TOEIC Intermediate': 'ielts-toeic-intermediate',
      'IELTS / TOEIC Advanced': 'ielts-toeic-advanced',
      'Quadra Room / 四人房': 'quadra-room',
      'Triple Room / 三人房': 'triple-room',
      'Double Room / 双人房': 'double-room',
      'Single Room / 单人房': 'single-room',
    };
    if (knownKeys[value]) return knownKeys[value];
    const slug = value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return slug || value;
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  private currencyCodeForDisplay(code?: string): string {
    return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();
  }

  private cleanFeeDescription(description?: string): string {
    return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准';
  }
}
