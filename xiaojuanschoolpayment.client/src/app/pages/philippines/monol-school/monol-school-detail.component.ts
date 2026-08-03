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

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '餐厅' | '设施';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface CourseFee { id: string; name: string; tuition: number; suitable: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface RoomFee { id: string; name: string; fee: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SidaMonolReason { number: string; title: string; text: string; image: string; alt: string; }
interface SidaMonolTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-monol-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './monol-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './monol-school-detail.component.css',
  ],
})
export class MonolSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'MONOL';
  private readonly pricingSchoolNames = ['菲律宾碧瑶MONOL语言学校', 'MONOL', 'Models of Nonpareil and Outstanding Learning'];
  private readonly courseFeeOrder = ['general-esl', 'ielts', 'leap-english'];
  private readonly roomFeeOrder = ['premium-single-room', 'single-room', 'deluxe-room', 'semi-single-room', 'triple-room', 'capsule-six-room'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly discount = 1;
  seasonalFeePerWeek = 0;
  readonly usdToCny = 7.2;
  readonly weekOptions = [2, 3, 4, 8, 12, 16, 20, 24];
  selectedCourseId = 'general-esl';
  selectedRoomId = 'capsule-six-room';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-06';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'terrain', label: '城市', value: '碧瑶 Baguio', note: 'Pinsao Proper山城环境，适合稳定学习和长期生活。' },
    { icon: 'apartment', label: '学校定位', value: '半斯巴达 / 舒适住宿', note: '比传统高压斯巴达更弹性，住宿生活配套是重要卖点。' },
    { icon: 'school', label: '课程方向', value: 'General ESL / IELTS / LEAP', note: '三条主线清楚，LEAP可按目标客制General ESL、IELTS、TOEIC或Business方向。' },
    { icon: 'bed', label: '住宿', value: 'Hotel-style dormitory', note: '与Misty Hills Hotel合作管理，房型从Capsule Six到Premium Single。' },
    { icon: 'restaurant', label: '餐食', value: '餐费另计', note: 'Meal allowance separate，适合需要饮食弹性或长期控制预算的学生。' },
    { icon: 'payments', label: '费用表', value: '官方Admission页公开', note: '注册费、课程费、住宿费和当地费用均有公开参考。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校区', title: '菲律宾碧瑶MONOL语言学校', description: 'MONOL是碧瑶老牌语言学校，适合稳定学习、住宿舒适度和长期规划。', src: 'assets/philippines/home-school-monol.png' },
    { category: '校区', title: '碧瑶山城学习环境', description: '碧瑶凉爽安静，适合长期学习和生活节奏稳定的学生。', src: 'assets/philippines/baguio-study-hero.jpg' },
    { category: '教室', title: '一对一课堂参考', description: 'General ESL、IELTS和LEAP都重视一对一课与个别化反馈。', src: 'assets/cia/one-to-one-class.png' },
    { category: '教室', title: '团体互动课堂参考', description: '团体课用于沟通、讨论、听力和输出训练。', src: 'assets/cia/small-group-class.jpg' },
    { category: '住宿', title: 'Hotel-style住宿参考', description: '房型、房务、设备和生活稳定度是MONOL选校时必须重点比较的部分。', src: 'assets/cia/dormitory-overview.jpg' },
    { category: '住宿', title: '单人房参考', description: 'Single和Premium Single适合重视隐私、长期学习和成人生活节奏的人。', src: 'assets/cia/single-room.jpg' },
    { category: '餐厅', title: '餐食与咖啡空间参考', description: 'MONOL餐食另计，学生可按生活习惯规划餐盒、咖啡厅、外送或自炊预算。', src: 'assets/cia/dining-hall.jpg' },
    { category: '设施', title: '自习空间参考', description: '半斯巴达节奏更依赖学生自律，适合能主动安排复习的人。', src: 'assets/cia/library.jpg' },
    { category: '设施', title: '健身休闲设施参考', description: '官方资料强调屋顶健身房、桑拿、高尔夫练习区、Lounge和Aqua Garden Cafe。', src: 'assets/cia/fitness-center.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾碧瑶MONOL语言学校' },
    { label: '英文名称', value: 'MONOL / Models of Nonpareil and Outstanding Learning' },
    { label: '创校时间', value: '2003年' },
    { label: '地址', value: '20-B Purok 9, Tacay Road, Pinsao Proper, Baguio City, Benguet' },
    { label: '课程方向', value: 'General ESL、IELTS、LEAP English；LEAP可延伸TOEIC、Business English和其他客制科目' },
    { label: '房型方向', value: 'Premium Single、Single、Semi-Single、Deluxe、Triple、Capsule Six' },
    { label: '住宿服务', value: '与Misty Hills Hotel合作，提供24小时接待、每日房务、毛巾床品和房间清洁' },
    { label: '报价说明', value: '官方说明除注册费外，课程费和住宿费以4周为单位；餐费另计，到校费用多以PHP支付' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/home-school-monol.png', title: '稳定学习，不是过度高压', text: 'MONOL适合认真学、但不想被全斯巴达制度压满日程的学生。学习效率更多来自课程结构、复习和学生自律。' },
    { image: 'assets/cia/dormitory-overview.jpg', title: 'Hotel-style宿舍管理', text: '官方资料强调Misty Hills Hotel合作、24小时接待、每日房务、床品毛巾和房间清洁，适合长期住得稳定的人。' },
    { image: 'assets/cia/one-to-one-class.png', title: '课程线清楚', text: 'General ESL补基础，IELTS面向升学就业目标，LEAP用学习者画像和客制课程做更精细的目标匹配。' },
    { image: 'assets/cia/fitness-center.jpg', title: '生活设施更完整', text: '屋顶健身房、桑拿、高尔夫练习区、Lounge、咖啡厅和厨房让MONOL更像“学习生活型”学校。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '计划8周以上稳定学习', text: 'MONOL的住宿、设施和半斯巴达节奏更适合中长期学习者，而不是只追求短期高压冲刺。' },
    { title: '重视住宿舒适度和生活配套', text: 'Single、Premium Single、Deluxe和Semi-Single适合成人、家庭或希望住得稳定的人。' },
    { title: '想学ESL或IELTS但不想过度高压', text: 'General ESL和IELTS都有9节日课结构，但晚间生活更需要学生自己安排复习。' },
    { title: '需要课程客制化', text: 'LEAP适合有职业、TOEIC、Business、IELTS或其他具体目标，需要先做学习者画像的人。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '需要强制自习和严格门禁推动', text: '如果学生自律弱，只靠制度推进，建议同步比较PINES、JIC Challenger或BECI Sparta。' },
    { title: '只看最低价格', text: 'MONOL餐费另计，房型差距明显，必须把注册费、房费、当地费、餐食和接机一起核算。' },
    { title: '想住市中心最便利区域', text: 'MONOL位于Pinsao Proper，外出和市区交通要提前确认接受度。' },
    { title: '目标是极短期轻松体验', text: 'MONOL可以2周起报，但真正优势更适合有稳定学习和住宿需求的学生。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'General ESL', type: '基础与综合英文', lessons: '5节一对一 + 4节团体课 / 天', suitable: '使用螺旋式复习和沟通法，覆盖听说读写、语法和发音，适合打基础和系统提升。' },
    { name: 'IELTS', type: '雅思备考', lessons: '5节一对一 + 4节团体课 / 天', suitable: '面向升学、海外就业或移民方向，官方建议General ESL中级以上基础，并安排每期模拟考试。' },
    { name: 'LEAP English', type: '客制化英文', lessons: '5节一对一 + 4节团体课 + Fitness Classes', suitable: '先做学习者画像和目标分析，再按General ESL、IELTS、TOEIC、Business或其他科目组合课程。' },
    { name: 'Additional One-on-One', type: '追加一对一', lessons: '按ESL / IELTS / LEAP不同价格追加', suitable: '适合到校后发现某一科目需要更多纠错或强化时再单独确认。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'general-esl', name: 'General ESL', tuition: 900, suitable: '官方4周课程费，适合基础和综合英文提升' },
    { id: 'ielts', name: 'IELTS', tuition: 1000, suitable: '官方4周课程费USD900 + Academic Admin Fee USD100' },
    { id: 'leap-english', name: 'LEAP English', tuition: 1150, suitable: '官方4周课程费USD900 + Academic Admin Fee USD250' },
  ];

  roomFees: RoomFee[] = [
    { id: 'premium-single-room', name: 'Premium Single Room', fee: 1100, note: '最高规格单人房，适合长期学习和重视隐私的人' },
    { id: 'single-room', name: 'Single Room', fee: 750, note: '标准单人房，隐私与价格较平衡' },
    { id: 'deluxe-room', name: 'Deluxe Room', fee: 700, note: '带厨房，适合家庭或想自理餐食的人' },
    { id: 'semi-single-room', name: 'Semi-Single Room', fee: 650, note: '独立房间、共用浴室，兼顾隐私与预算' },
    { id: 'triple-room', name: 'Triple Room', fee: 500, note: '多人房型，适合控制总预算' },
    { id: 'capsule-six-room', name: 'Capsule Six Room', fee: 300, note: '默认预算参考，适合先做最低总价估算' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐 / 个人准备', text: '餐食不强制打包，学生可按自己的饮食习惯和预算安排。' },
    { time: '08:00 - 12:00', title: '上午一对一与团体课', text: 'General ESL、IELTS和LEAP都以5节一对一加4节团体课作为核心结构。' },
    { time: '12:00 - 13:00', title: '午餐与短休', text: '可结合餐盒、咖啡厅、外送或共享厨房安排午餐。' },
    { time: '13:00 - 17:00', title: '下午课程与反馈', text: 'IELTS关注考试科目训练，LEAP更强调学习监测、目标调整和客制化。' },
    { time: '17:00 - 22:00', title: 'Fitness / 复习 / 生活安排', text: '官方课程页提到Fitness Classes为平日可选，晚间更适合自律复习和运动休息。' },
    { time: '周末', title: '碧瑶生活与休息', text: '适合安排市区采购、咖啡厅、Burnham Park、Camp John Hay或自然景点。' },
  ];

  localFees: LocalFee[] = [
    { item: 'Security Deposit', amount: 'PHP 4,000', note: '或USD 100，完成学习后按学校规则退还' },
    { item: 'SSP Application', amount: 'PHP 7,800', note: '特别学习许可，有效期6个月' },
    { item: 'SSP ACR I-Card', amount: 'PHP 4,500', note: '申请SSP时支付' },
    { item: 'TVV ACR I-Card', amount: 'PHP 3,500', note: '首次签证延签时支付' },
    { item: '签证延签8周', amount: 'PHP 2,500', note: 'Waiver参考' },
    { item: '签证延签12周', amount: 'PHP 9,700', note: 'Waiver + 第一次延签含TVV ACR I-Card参考' },
    { item: '签证延签16周', amount: 'PHP 10,500', note: 'Waiver + 第一次延签含TVV ACR I-Card参考' },
    { item: '签证延签20周', amount: 'PHP 12,300', note: 'Waiver + 第一次 + 第二次延签参考' },
    { item: '签证延签24周', amount: 'PHP 13,000', note: 'Waiver + 第一次 + 第二次延签参考' },
    { item: '马尼拉团体接机', amount: 'PHP 3,000', note: 'Group pickup from Manila Airport' },
    { item: '克拉克团体接机', amount: 'PHP 2,500', note: 'Group pickup from Clark Airport' },
    { item: '餐费', amount: 'Separate', note: '官方Admission页标注Meal Allowance Separate' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先判断是否适合MONOL', text: '确认学生是否需要舒适住宿、长期稳定学习、饮食弹性和半斯巴达节奏。' },
    { icon: 'fact_check', title: '确认课程和房型', text: '免费协助确认General ESL、IELTS或LEAP，房型、空房、餐食预算和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证', text: '思达免费协助菲律宾入境及签证相关手续，学生按顾问指引准备资料。' },
    { icon: 'inventory', title: '发送行前清单', text: '出发前提供学习资料、费用清单、行李清单、接机和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '如遇到调课、住宿、费用、生活适应或学校沟通问题，可继续联系思达协助。' },
    { icon: 'location_on', title: '国内顾问与当地协作', text: '国内顾问与菲律宾当地工作人员协作，重要节点持续跟进。' },
  ];

  readonly sidaMonolReasons: SidaMonolReason[] = [
    { number: '01', title: '先判断MONOL是否真的适合', text: '会把学习强度、住宿期待、餐食弹性、交通位置和学生自律程度一起评估。', image: 'assets/cia/sida-why-action-selection.jpg', alt: '思达启航顾问帮助学生判断MONOL是否适合' },
    { number: '02', title: '课程、房型、餐费和当地费用提前算清', text: '0中介服务费，课程费、住宿费、餐食另计、签证和到校PHP费用逐项说明。', image: 'assets/cia/sida-why-action-fees.jpg', alt: '思达启航顾问核算菲律宾碧瑶MONOL语言学校费用' },
    { number: '03', title: '正式文件与收费可核对', text: '国内公司签约，报价、录取、付款节点和学校文件都可逐项核验。', image: 'assets/cia/sida-why-action-contract.jpg', alt: '思达启航正式合同与学校文件核验' },
    { number: '04', title: '出发前每一步有人提醒', text: '签证、eTravel、入学文件、付款、接机、换汇和当地费用准备都会提前提醒。', image: 'assets/cia/sida-why-action-departure.jpg', alt: '菲律宾游学出发前文件和行李准备' },
    { number: '05', title: '服务持续到完成学习回国', text: '换老师、调课、住宿、账单、续读或转校问题都可以继续协助。', image: 'assets/cia/sida-why-action-followup.jpg', alt: '思达启航顾问持续跟进学生学习情况' },
    { number: '06', title: '深圳总部 + 菲律宾当地支持', text: '国内顾问与菲律宾当地工作人员协作，遇到重要节点有人跟进。', image: 'assets/cia/sida-why-action-team.jpg', alt: '思达启航菲律宾和深圳服务团队' },
  ];

  readonly sidaMonolTrustBadges: SidaMonolTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', '学习监测', '房务清洁', '自助洗衣', '共享厨房', '健身房', '证件协助'];
  readonly campusActivities = ['新生说明会', 'Fitness Classes', '英语口语活动', 'IELTS模拟考试', '学生交流活动'];
  readonly weekendActivities = ['SM Baguio', 'Burnham Park', 'Baguio夜市', 'Camp John Hay', 'Mines View Park'];
  readonly notes = [
    'MONOL官方说明除注册费外，所有费用以4周为单位列示。',
    '餐费在官方Admission页标注为Separate，报价时要单独估算餐食和个人生活费。',
    'IELTS和LEAP的Academic Admin Fee已计入本页课程费，用于避免低估前期支付金额。',
    'Security Deposit官方列为USD 100或PHP 4,000，本页到校费用按PHP 4,000展示。',
    'MONOL官方Admission页没有列出旺季附加费，本计算器按USD 0处理；最终以学校正式账单为准。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: '菲律宾碧瑶MONOL语言学校是斯巴达学校吗？', answer: '更适合归类为半斯巴达或自律弹性型。它有高课时日课和学习支持，但不像典型高压斯巴达学校主要靠强制自习和门禁推动。' },
    { question: 'MONOL适合零基础学生吗？', answer: '可以优先看General ESL。若目标是IELTS，建议先确认入学测验、英语基础和是否需要先读ESL过渡。' },
    { question: '页面报价包含餐费吗？', answer: '不包含。MONOL官方Admission页把Meal Allowance标注为Separate，所以本页前期支付参考只计算注册费、课程费、住宿费和额外附加费。' },
    { question: 'IELTS和LEAP为什么比官方课程费USD900高？', answer: '因为官方费用表写明IELTS有USD100 Academic Admin Fee，LEAP有USD250 Academic Admin Fee。本页课程费已把这些费用并入计算。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名MONOL，思达顾问会免费协助菲律宾入境及签证相关手续，并在出发前发送行前清单和费用提醒。' },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '报名流程', target: 'service-process', icon: 'task_alt' },
    { label: '常见问题', target: 'faq', icon: 'help' },
  ];
  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '服务', target: 'service-process', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  ngOnInit(): void { this.loadPricingFromDatabase(); }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toUpperCase().includes('MONOL')) ??
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
        id: this.slugifyPriceKey(lesson.name),
        name: lesson.name,
        tuition: lesson.price,
        suitable: lesson.description || lesson.note || '请联系顾问确认适合人群',
      }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourseFees.length > 0) {
      this.courseFees = databaseCourseFees;
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) {
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'general-esl')?.id ?? this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({
        id: this.createRoomId(room.name),
        name: room.name,
        fee: room.price,
        note: room.description || '请联系顾问确认空房',
      }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId = this.roomFees.find((room) => room.id === 'capsule-six-room')?.id ?? this.roomFees[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费');
    if (peakSeasonFee) this.seasonalFeePerWeek = peakSeasonFee.fee;
    const databaseLocalFees = fees
      .filter((fee) => this.currencyCodeForDisplay(fee.currencyCode) === 'PHP')
      .map((fee) => ({ item: fee.name, amount: this.formatCurrencyAmount(fee), note: this.cleanFeeDescription(fee.description) }));
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
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * (this.selectedWeeks / 4); }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * (this.selectedWeeks / 4); }
  get isPeakSeason(): boolean { return false; }
  get seasonalSurcharge(): number { return this.isPeakSeason ? this.selectedWeeks * this.seasonalFeePerWeek : 0; }
  get quoteUsd(): number { return this.registrationFee + (this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks) * this.discount + this.seasonalSurcharge; }
  get quoteUsdText(): string { return `USD ${this.formatUsd(this.quoteUsd)} 起`; }
  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }
  get discountText(): string {
    return this.discount === 1 ? '优惠需顾问确认，参考范围' : `${Math.round(this.discount * 100)} 折扣范围`;
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 1 });
  }
  private slugifyPriceKey(value: string): string {
    return value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' plus ').replace(/\//g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }
  private createRoomId(name: string): string {
    if (name.includes('Premium Single')) return 'premium-single-room';
    if (name.includes('Semi-Single')) return 'semi-single-room';
    if (name.includes('Single')) return 'single-room';
    if (name.includes('Deluxe')) return 'deluxe-room';
    if (name.includes('Triple')) return 'triple-room';
    if (name.includes('Capsule')) return 'capsule-six-room';
    return this.slugifyPriceKey(name);
  }
  private currencyCodeForDisplay(code?: string): string {
    return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();
  }
  private formatCurrencyAmount(fee: SchoolFeeDTO): string {
    return `${this.currencyCodeForDisplay(fee.currencyCode)} ${fee.fee.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1, maximumFractionDigits: 1 })}`;
  }
  private cleanFeeDescription(description?: string): string {
    return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准';
  }
}
