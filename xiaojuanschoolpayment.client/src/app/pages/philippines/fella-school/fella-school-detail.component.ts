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

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

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

@Component({
  selector: 'app-fella-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './fella-school-detail.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class FellaSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolName = 'English Fella';
  private readonly courseFeeOrder = ['guardian-gec', 'pic-4', 'pic-5', 'pic-6', 'ielts-pirc', 'toeic-esl-toeic', 'toefl', 'business-english', 'junior-jec', 'silver-speaking-course'];
  private readonly roomFeeOrder = ['triple', 'twin', 'standard-single', 'deluxe-single'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly discount = 1;
  seasonalFeePerWeek = 0;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12];
  selectedCourseId = 'pic-4';
  selectedRoomId = 'triple';
  selectedWeeks = 4;
  selectedStartDate = '2026-05-18';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'park', label: '学校类型', value: '宿务老牌大校园', note: '2006年创立，官方称建有专属校园' },
    { icon: 'groups', label: '适合人群', value: '成人 / 考试 / 亲子 / 长期', note: '从5岁儿童到成人和银发课程都有方向' },
    { icon: 'verified_user', label: '管理模式', value: '斯巴达 / 半斯巴达 / 自律', note: '校区和课程不同，规则要先确认' },
    { icon: 'school', label: '课程选项', value: 'PIC / IELTS / TOEIC / TOEFL', note: '另有商务、Junior、Guardian和Silver Speaking' },
    { icon: 'bed', label: '住宿房型', value: '三人 / 双人 / 单人', note: '标准单人和豪华单人需核校区与空房' },
    { icon: 'local_activity', label: '校园资源', value: '泳池 / 运动 / CAFELLA', note: '官方设施页展示校园、餐厅、运动和休闲空间' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'English Fella校园', description: '大校园和绿化空间，是Fella区别于市区型学校的重要特点。', src: 'assets/fella/campus-main.jpg' },
    { category: '校园', title: '校园泳池区域', description: '官方设施页展示泳池和户外活动空间。', src: 'assets/fella/campus-pool.jpg' },
    { category: '校园', title: '校区环境', description: '适合希望学习、住宿、运动和休息集中在校园内的学生。', src: 'assets/fella/campus-view.jpg' },
    { category: '教室', title: '一对一教室', description: 'PIC、考试、商务和口语课程都会使用一对一训练。', src: 'assets/fella/classroom-1.jpg' },
    { category: '教室', title: '团体教室', description: '小团体、大团体和选修课程用于讨论、表达和综合训练。', src: 'assets/fella/classroom-2.jpg' },
    { category: '住宿', title: '宿舍房间', description: '房间通常配有床、桌椅、收纳和空调，具体以校区房型为准。', src: 'assets/fella/dorm-1.jpg' },
    { category: '住宿', title: '住宿空间参考', description: '三人房、双人房和单人房会明显影响总预算。', src: 'assets/fella/dorm-2.jpg' },
    { category: '餐厅', title: '学生餐厅', description: '校内餐厅适合希望学习生活集中管理的学生。', src: 'assets/fella/cafeteria-2.jpg' },
    { category: '设施', title: '运动设施', description: '官方设施页展示运动空间，适合课后活动和校园交流。', src: 'assets/fella/sports-1.jpg' },
    { category: '设施', title: '篮球与运动区', description: '课后运动和月度校园活动会用到这些公共空间。', src: 'assets/fella/sports-2.jpg' },
    { category: '设施', title: '校内公共设施', description: 'CAFELLA、办公室、休闲和其他校内支持资源需按校区确认。', src: 'assets/fella/facility-1.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: 'English Fella' },
    { label: '所在地区', value: 'Talamban, Cebu City；第一校区与第二校区' },
    { label: '创立时间', value: '2006年，官方资料称为菲律宾第一批建有专属校园的学校之一' },
    { label: '学校定位', value: '大校园、课程选择多、校区管理模式可选的老牌学校' },
    { label: '课程资源', value: 'PIC、IELTS、TOEIC、TOEFL、Business、Junior、Guardian、Silver Speaking' },
    { label: '年龄要求', value: 'Junior课程5岁起；15岁以上课程需按项目和校区规则确认' },
    { label: '管理模式', value: '1st Campus偏斯巴达；2nd Campus可按普通/半斯巴达方向确认' },
    { label: '设施资源', value: '校园、宿舍、教室、餐厅、办公室、运动设施、其他公共空间' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/fella/campus-main.jpg', title: '大校园与生活支持感', text: 'Fella适合希望学校空间更完整、学习和生活都在校内解决的学生。' },
    { image: 'assets/fella/classroom-1.jpg', title: '课程方向很完整', text: '从PIC综合英语到IELTS、TOEIC、TOEFL、商务、Junior和Guardian都可比较。' },
    { image: 'assets/fella/dorm-1.jpg', title: '房型和校区要先确认', text: '三人房起预算较低，单人和豪华单人需提前确认校区和空房。' },
    { image: 'assets/fella/sports-1.jpg', title: '活动和运动资源多', text: '官方资料列出体育竞赛、Fun Friday、Fella Day、跳岛和城市游等活动。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在宿务找老牌大校园学校', text: 'Fella比很多市区型学校更有校园空间和生活支持感。' },
    { title: '想按管理强度选择校区', text: '如果你想比较斯巴达、半斯巴达或自律型管理，Fella很适合先让顾问核校区。' },
    { title: 'ESL、考试、商务、亲子都想比较', text: '课程覆盖面广，适合目标还在细分阶段的学生。' },
    { title: '亲子、青少年或长期学习', text: 'Junior和Guardian方向可考虑，但年龄、监护费、校区和房型必须提前确认。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想住最新型豪华校区', text: 'Fella是成熟老牌校园，住宿质感需和CIA、CPI、EV等新型校区比较。' },
    { title: '不想被校规约束', text: '斯巴达校区和考试课程会有更明确的自习、测试、外出和出勤要求。' },
    { title: '只看低价，不准备当地费用', text: 'Fella到校后仍有SSP、SSP E-card、水电、空调、教材、押金等当地费用。' },
    { title: '不想提前确认校区和房型', text: 'Fella的关键就是校区、管理模式和房型，临近入学更容易被空房限制。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'PIC-4 / PIC-5 / PIC-6', type: '综合英语', lessons: '4-6节一对一 + 团体课 + 选修课', suitable: '适合口语、听力、阅读、文法和综合英语基础提升。' },
    { name: 'IELTS / PIRC / PIFT / PIGI', type: '雅思备考', lessons: '听说读写 + 文法词汇 + 模考与自习', suitable: '适合英联邦升学、移民或明确雅思分数目标学生。' },
    { name: 'TOEIC / ESL+TOEIC', type: '托业备考', lessons: 'TOEIC专项 + ESL基础 + 模考', suitable: '适合求职、毕业门槛或企业英语目标。' },
    { name: 'TOEFL', type: '托福备考', lessons: 'TOEFL听说读写 + ESL团体课', suitable: '适合北美升学、交换项目或考试目标学生。' },
    { name: 'Business English', type: '商务英语', lessons: '会议、简报、面试、备忘录和商务沟通', suitable: '适合职场人士和准备英文工作场景的人。' },
    { name: 'Junior / Guardian', type: '亲子与青少年', lessons: '儿童一对一、团体课和监护人课程', suitable: '适合亲子同行，年龄、监护和房型需提前确认。' },
    { name: 'Silver Speaking Course', type: '银发口语', lessons: '50岁以上口语强化课程', suitable: '适合银发成人提升口语信心和交流能力。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'guardian-gec', name: 'Guardian / GEC', tuition: 1000, suitable: '监护人课程，适合亲子同行家长或监护人' },
    { id: 'pic-4', name: 'PIC-4', tuition: 1150, suitable: '基础综合英语，适合第一次游学和稳步提升' },
    { id: 'pic-5', name: 'PIC-5', tuition: 1250, suitable: '一对一课时更多，适合想增加输出训练的学生' },
    { id: 'pic-6', name: 'PIC-6', tuition: 1350, suitable: '更高一对一比例，适合短期口语强化' },
    { id: 'ielts-pirc', name: 'IELTS / PIRC', tuition: 1350, suitable: '雅思备考与目标分数训练' },
    { id: 'toeic-esl-toeic', name: 'TOEIC / ESL+TOEIC', tuition: 1250, suitable: '托业备考或ESL+TOEIC混合课程' },
    { id: 'toefl', name: 'TOEFL', tuition: 1250, suitable: '托福备考，适合北美升学或考试目标学生' },
    { id: 'business-english', name: 'Business English', tuition: 1350, suitable: '商务沟通与职场表达' },
    { id: 'junior-jec', name: 'Junior / JEC', tuition: 1250, suitable: '儿童和青少年课程，年龄、监护和校区需确认' },
    { id: 'silver-speaking-course', name: 'Silver Speaking Course', tuition: 1250, suitable: '50岁以上口语强化课程，适合银发成人学习者' },
  ];

  roomFees: RoomFee[] = [
    { id: 'triple', name: '三人房', fee: 550, note: '默认报价参考，预算压力较低' },
    { id: 'twin', name: '双人房', fee: 650, note: '适合朋友同行或希望兼顾预算与舒适度' },
    { id: 'standard-single', name: '标准单人房', fee: 850, note: '隐私较好，预算较高，热门档期需早确认' },
    { id: 'deluxe-single', name: '豪华单人房', fee: 950, note: '更高住宿规格，空房和校区需单独确认' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与晨间准备', text: '校内餐厅用餐后准备课程，斯巴达校区可能有更明确早晚安排。' },
    { time: '08:00 - 12:00', title: '上午课程', text: '一对一、团体课、考试专项或商务课程，按课程类型安排。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '校内餐厅用餐，下午课程前整理笔记。' },
    { time: '13:00 - 17:00', title: '下午课程', text: '继续口语、文法、听力、阅读、写作、考试或商务主题训练。' },
    { time: '17:00 - 19:00', title: '晚餐与自由时间', text: '可使用校园设施，外出和门禁以校区规则为准。' },
    { time: '19:00 - 21:00', title: '自习 / 测试 / 校内活动', text: '斯巴达、J-Sparta和考试课程的晚间规则需按项目确认。' },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 6,800', note: '官方费用页显示截至2023年3月为 PHP 6,800' },
    { item: 'SSP E-card', amount: 'PHP 3,600', note: '官方费用页显示截至2024年7月为 PHP 3,600' },
    { item: '水电费', amount: 'PHP 2,500', note: '官方计算器说明4周每人 PHP 2,500' },
    { item: '空调费', amount: 'PHP 20 / KW', note: '官方计算器说明按 PHP 20 / 1KW 计算' },
    { item: '教材费', amount: 'PHP 2,000', note: '按课程和实际购买教材调整' },
    { item: '宿舍押金', amount: 'PHP 3,000', note: '退房检查后按学校规则退还' },
    { item: '接机费', amount: 'PHP 1,000', note: '官方费用页显示接机费 PHP 1,000' },
    { item: 'ACR I-card', amount: '按周期确认', note: '金额会按停留周期和汇率调整' },
    { item: '签证延签', amount: '按周数确认', note: '按学习周数和菲律宾签证规则调整' },
    { item: '监管费', amount: '需顾问确认', note: '15-17岁独自就读或亲子规则需由顾问确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断Fella是否适合', text: '先了解学习目标、年龄、同行人、校区偏好、管理强度和住宿预算。' },
    { icon: 'fact_check', title: '确认课程、校区和房型', text: '免费协助确认课程、校区、房型、空房、优惠和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', '校内餐厅', 'CAFELLA', '宿舍清洁', '洗衣服务', '医护与转诊', '校内保安', '运动设施', '华语顾问沟通'];
  readonly campusActivities = ['Sports Competition', 'Fun Friday', 'Fella Day', '英语展示', '校内运动', '校园交流'];
  readonly weekendActivities = ['跳岛活动', 'Cebu City Tour', 'Safari Park Tour', '志愿活动', '商场与餐厅', '学生自发聚会'];
  readonly notes = [
    'English Fella报名前必须确认第一校区或第二校区，以及对应管理模式。',
    '亲子、青少年、Silver Speaking和考试课程要先核对年龄、校区、周数和入学规则。',
    '本页课程费与住宿费拆分用于报价逻辑，正式报价仍需按学校费用表、优惠和房型确认。',
    '到校支付费用会随学校政策、汇率和个人情况变化。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: 'English Fella适合第一次菲律宾游学吗？', answer: '适合，但要先确认校区和管理强度。若你希望有校园空间、生活支持和比较完整的课程选择，Fella值得放入候选。' },
    { question: 'English Fella是斯巴达学校吗？', answer: 'Fella有不同校区和管理模式。一般会按第一校区偏斯巴达、第二校区较弹性来理解，实际规则需按课程和空房确认。' },
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费、住宿费和可能的旺季附加费；到校后仍需支付SSP、SSP E-card、水电费、空调费、教材费、押金等当地费用。' },
    { question: 'English Fella适合亲子吗？', answer: '可以考虑。官方课程包含Junior和Guardian方向，但要先确认孩子年龄、陪同家长、监护规则、房型和校区。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名English Fella，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
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
    this.schoolService.getSchools({ name: this.pricingSchoolName }).pipe(
      switchMap((schools) => {
        const school = schools.find((item) => item.name === this.pricingSchoolName) ?? schools[0];
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
      .map((lesson) => ({ id: this.slugifyPriceKey(lesson.name), name: lesson.name, tuition: lesson.price, suitable: lesson.description || lesson.note || '请联系顾问确认适合人群' }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourseFees.length > 0) {
      this.courseFees = databaseCourseFees;
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees.find((course) => course.id === 'pic-4')?.id ?? this.courseFees[0].id;
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'triple')?.id ?? this.roomFees[0].id;
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

  get filteredGalleryImages(): GalleryImage[] { return this.selectedGalleryCategory === '全部' ? this.galleryImages : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory); }
  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[0]; }
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * (this.selectedWeeks / 4); }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * (this.selectedWeeks / 4); }
  get isPeakSeason(): boolean { return false; }
  get seasonalSurcharge(): number { return this.isPeakSeason ? this.selectedWeeks * this.seasonalFeePerWeek : 0; }
  get quoteUsd(): number { return this.registrationFee + (this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks) * this.discount + this.seasonalSurcharge; }
  get quoteUsdText(): string { return `USD ${this.formatUsd(this.quoteUsd)} 起`; }
  get quoteCnyText(): string { const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100; return `约 ${rounded.toLocaleString('zh-CN')} 元起`; }
  get discountText(): string { return this.discount === 1 ? '优惠需顾问确认，参考范围' : `${Math.round(this.discount * 100)} 折扣范围`; }

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 1 }); }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private createRoomId(name: string): string {
    if (name.includes('三人')) return 'triple';
    if (name.includes('双人')) return 'twin';
    if (name.includes('豪华')) return 'deluxe-single';
    if (name.includes('标准单人')) return 'standard-single';
    if (name.includes('单人')) return 'standard-single';
    return this.slugifyPriceKey(name);
  }
  private currencyCodeForDisplay(code?: string): string { return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase(); }
  private formatCurrencyAmount(fee: SchoolFeeDTO): string {
    if (fee.fee === 0) return '需顾问确认';
    if (fee.name === '空调费') return `${this.currencyCodeForDisplay(fee.currencyCode)} ${this.formatUsd(fee.fee)} / KW`;
    return `${this.currencyCodeForDisplay(fee.currencyCode)} ${fee.fee.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1, maximumFractionDigits: 1 })}`;
  }
  private cleanFeeDescription(description?: string): string { return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准'; }
}
