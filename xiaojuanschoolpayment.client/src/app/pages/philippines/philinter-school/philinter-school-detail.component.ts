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
  selector: 'app-philinter-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './philinter-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
  ],
})
export class PhilinterSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolName = 'Philinter Academy';
  private readonly courseFeeOrder = ['light-esl', 'general-esl', 'intensive-esl', 'intensive-power-speaking', 'ielts-intensive', 'toefl', 'toeic-regular', 'advanced-business', 'basic-business', 'focused-industry', 'primary-english', 'junior-esl', 'junior-ielts', 'ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks'];
  private readonly roomFeeOrder = ['in-campus-triple', 'in-campus-twin', 'in-campus-single', 'azon-single', 'azon-twin'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly discount = 1;
  seasonalFeePerWeek = 0;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12];
  selectedCourseId = 'light-esl';
  selectedRoomId = 'in-campus-triple';
  selectedWeeks = 4;
  selectedStartDate = '2026-05-18';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'school', label: '学校类型', value: '宿务老牌半斯巴达学校', note: '2003年成立，官方定位为Cebu领先的Semi-Sparta ESL学校' },
    { icon: 'groups', label: '适合人群', value: '成人 / 口语 / IELTS / 青少年', note: '适合重视师资、学习风气和麦克坦位置的学生' },
    { icon: 'verified_user', label: '管理模式', value: '半斯巴达 / 斯巴达课程可选', note: 'General偏半斯巴达，Intensive/IELTS方向学习强度更高' },
    { icon: 'record_voice_over', label: '核心课程', value: 'ESL / IPS / IELTS / Business', note: '另有TOEIC、TOEFL、Primary、Junior和行业英文' },
    { icon: 'bed', label: '住宿类型', value: '校内宿舍 / 校外公寓', note: '校内单人、双人、三人；校外Azon Condo需确认接送和门禁' },
    { icon: 'flight_land', label: '位置特点', value: 'Lapu-Lapu / 近宿务机场', note: '适合重视抵达便利和麦克坦生活资源的学生' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'Philinter校园楼体', description: '官方设施图片展示Philinter校内住宿与教学楼体。', src: 'assets/philinter/campus-main.jpeg' },
    { category: '校园', title: '校园泳池', description: '官方设施页介绍泳池位于宿舍与咖啡厅之间，可供学生课后放松。', src: 'assets/philinter/campus-pool.jpg' },
    { category: '校园', title: '学校大厅', description: '学校大厅是学生报到、公告和日常沟通的中心区域。', src: 'assets/philinter/lobby.png' },
    { category: '教室', title: '一对一/小班学习场景', description: 'Philinter课程强调个别化支持和进度追踪。', src: 'assets/philinter/one-on-one-room.jpg' },
    { category: '教室', title: '团体教室', description: '用于讨论、表达、演示和综合训练。', src: 'assets/philinter/study-hall.jpg' },
    { category: '教室', title: '讲座教室', description: '大型团体课、说明会和活动会用到的教学空间。', src: 'assets/philinter/group-classroom.png' },
    { category: '住宿', title: '校内单人房', description: '适合重视隐私和安静学习环境的学生。', src: 'assets/philinter/single-room.jpg' },
    { category: '住宿', title: '校内双人房', description: '预算与舒适度相对平衡，适合同伴同行。', src: 'assets/philinter/double-room.jpg' },
    { category: '住宿', title: '校内三人房', description: '默认报价参考房型，预算压力较低。', src: 'assets/philinter/triple-room.jpg' },
    { category: '住宿', title: '校外公寓参考', description: 'Azon Condo方向更偏生活品质，需确认接送、门禁和空房。', src: 'assets/philinter/condo-room.png' },
    { category: '餐厅', title: '学生咖啡厅', description: '官方设施页展示咖啡厅与泳池相连的休息空间。', src: 'assets/philinter/cafeteria-1.jpg' },
    { category: '餐厅', title: '餐厅与用餐空间', description: '三餐和学生交流的重要生活区域。', src: 'assets/philinter/cafeteria-2.jpg' },
    { category: '设施', title: '洗衣服务', description: '日常生活服务之一，具体规则以学校现场安排为准。', src: 'assets/philinter/laundry.jpg' },
    { category: '设施', title: '学习大厅', description: '适合晚间自习、模考准备和课后复习。', src: 'assets/philinter/study-hall.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: 'Philinter Academy / Philinter Center for English Language' },
    { label: '所在地区', value: 'Lapu-Lapu City, Mactan Island, Cebu，距离宿务机场较近' },
    { label: '创立时间', value: '2003年' },
    { label: '学校定位', value: '老牌半斯巴达语言学校，重视师资、学习系统和多国籍环境' },
    { label: '官方特色', value: 'Guaranteed Progress、Buddy Teacher System、IELTS 8.0 Teachers' },
    { label: '考试资源', value: '官方资料显示Philinter是British Council IELTS官方考点' },
    { label: '课程范围', value: 'Light ESL、General ESL、Intensive ESL、IPS、IELTS、TOEIC、TOEFL、Business、Junior、Primary' },
    { label: '住宿选择', value: '校内单人、双人、三人房；校外Azon Condo方向需顾问确认' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philinter/one-on-one-room.jpg', title: 'Buddy Teacher和进度管理', text: '官方介绍Buddy Teacher System，适合希望学习过程有人跟进的学生。' },
    { image: 'assets/philinter/group-classroom.png', title: '口语与考试课程都强', text: 'ESL、Intensive Power Speaking、IELTS、TOEIC和商务方向都可比较。' },
    { image: 'assets/philinter/campus-pool.jpg', title: '麦克坦位置与校内生活', text: '距离机场较近，校内有泳池、咖啡厅、宿舍和学习空间。' },
    { image: 'assets/philinter/single-room.jpg', title: '校内与校外住宿可选', text: '校内方便学习管理，校外公寓更适合重视生活品质的成人或家庭。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在老牌学校里稳步提升英文', text: 'Philinter适合重视课程体系、师资和学习风气的成人学生。' },
    { title: '想重点提升口说', text: 'Intensive Power Speaking适合想加强流利度、准确度和实际表达的学生。' },
    { title: 'IELTS、TOEIC或商务目标明确', text: '考试与商务方向较完整，适合需要按目标倒推课程的人。' },
    { title: '想住麦克坦、靠近机场', text: '适合短期入学、抵达时间不稳定或想兼顾麦克坦生活资源的学生。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想住最新型度假村校园', text: 'Philinter是成熟老牌学校，住宿和设施要和CIA、CPI、EV等新型校区一起比较。' },
    { title: '完全不想被学习节奏约束', text: 'Intensive和考试方向会有更明确的学习、测试和出勤要求。' },
    { title: '只看低价，不准备当地费用', text: '到校后仍需支付SSP、SSP E-card、水电、教材、押金、接机、延签等费用。' },
    { title: '不想提前确认住宿规则', text: '校内和校外住宿在预算、门禁、接送、生活便利度上差异明显。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'Light ESL / General ESL', type: '综合英语', lessons: '一对一 + 小团体 + 大团体 + 自习/选修', suitable: '适合第一次菲律宾游学、基础提升和短期体验。' },
    { name: 'Intensive ESL', type: '斯巴达综合英语', lessons: '更高密度日课 + 晚间学习安排', suitable: '适合想被学习节奏推动、短期快速提升的学生。' },
    { name: 'Intensive Power Speaking', type: '强化口说', lessons: '口说流利度、准确度、互动表达和情境沟通', suitable: '适合想集中提高开口量、自信和表达反应的人。' },
    { name: 'IELTS Intensive / Guarantee', type: '雅思备考', lessons: '雅思听说读写 + 策略训练 + 模考与进度管理', suitable: '适合目标分数明确、需要系统备考和监督的学生。' },
    { name: 'TOEIC / TOEFL', type: '考试英文', lessons: '考试专项 + ESL基础 + 模拟练习', suitable: '适合升学、求职、企业需求或北美考试目标。' },
    { name: 'Business / Focused Industry', type: '商务与行业英文', lessons: '会议、演示、邮件、面试、行业主题', suitable: '适合职场人士、转职或有行业英文需求的成人。' },
    { name: 'Primary / Junior', type: '儿童与青少年', lessons: '儿童英文、青少年ESL、青少年雅思方向', suitable: '适合7-17岁学生，但年龄、陪同和监护规则需提前确认。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'light-esl', name: 'Light ESL', tuition: 1060, suitable: '轻量综合英语，适合短期体验或希望保留生活弹性的学生' },
    { id: 'general-esl', name: 'General ESL', tuition: 1160, suitable: '半斯巴达综合英语，适合第一次游学和稳步提升' },
    { id: 'intensive-esl', name: 'Intensive ESL', tuition: 1280, suitable: '斯巴达强度更高，适合想加快综合英文提升的学生' },
    { id: 'intensive-power-speaking', name: 'Intensive Power Speaking', tuition: 1410, suitable: '强化口说与表达流利度，适合短期口语突破' },
    { id: 'ielts-intensive', name: 'IELTS Intensive', tuition: 1370, suitable: '雅思专项备考，适合目标分数学生' },
    { id: 'toeic-regular', name: 'TOEIC Regular', tuition: 1280, suitable: '托业备考，适合升学、求职或企业英语需求' },
    { id: 'advanced-business', name: 'Advanced Business', tuition: 1410, suitable: '商务沟通、演示、会议和职场表达' },
    { id: 'junior-esl', name: 'Junior ESL', tuition: 1610, suitable: '12-17岁青少年综合英文，年龄和监护规则需确认' },
  ];

  roomFees: RoomFee[] = [
    { id: 'in-campus-triple', name: '校内三人房', fee: 520, note: '默认报价参考，预算压力较低' },
    { id: 'in-campus-twin', name: '校内双人房', fee: 630, note: '适合朋友同行或希望兼顾预算与舒适度' },
    { id: 'in-campus-single', name: '校内单人房', fee: 960, note: '隐私最好，预算较高，热门档期需早确认' },
    { id: 'azon-single', name: '校外公寓单人房', fee: 1160, note: 'Azon Condo方向，接送、门禁和空房需顾问确认' },
    { id: 'azon-twin', name: '校外公寓双人房', fee: 780, note: '校外公寓方向，适合重视生活品质的成人或家庭' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与晨间准备', text: '校内用餐后准备当天课程，考试或斯巴达方向需按规则执行。' },
    { time: '08:00 - 12:00', title: '上午课程', text: '一对一、小团体、大团体、考试或商务专项，按课程类型安排。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '餐厅用餐，下午课程前整理笔记和作业。' },
    { time: '13:00 - 17:00', title: '下午课程', text: '继续口说、听力、阅读、写作、考试策略或商务主题训练。' },
    { time: '17:00 - 19:00', title: '晚餐与自由时间', text: '可使用校内设施；外出、门禁和校外住宿接送规则需提前确认。' },
    { time: '19:00 - 21:00', title: '自习 / 晚间学习 / 模考', text: 'Intensive、IELTS和保证班方向可能有更明确的晚间安排。' },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 6,800', note: '特别学习许可，最终以学校现场收费为准' },
    { item: 'SSP E-card', amount: 'PHP 4,000', note: '以学校现场收费为准' },
    { item: '接机费', amount: 'PHP 1,200', note: '周末接机参考，平日抵达通常需另行确认' },
    { item: '平日接机费', amount: 'PHP 1,500', note: '平日抵达参考，以学校安排为准' },
    { item: '水电费', amount: 'PHP 2,500', note: '4周参考，按实际或学校规则调整' },
    { item: '教材费', amount: 'PHP 2,000', note: '按课程和实际购买教材调整' },
    { item: '管理费', amount: 'PHP 1,000', note: '4周参考，最终以学校现场收费为准' },
    { item: '宿舍押金', amount: 'PHP 3,000', note: '退房检查后按学校规则退还' },
    { item: '学生证', amount: 'PHP 300', note: '一次性费用参考' },
    { item: 'ACR I-card', amount: '按周期确认', note: '长期学习或延签时通常需要' },
    { item: '签证延签', amount: '按周数确认', note: '按学习周数和菲律宾签证规则调整' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断Philinter是否适合', text: '先了解学习目标、年龄、住宿偏好、是否接受半斯巴达管理和预算。' },
    { icon: 'fact_check', title: '确认课程、房型和空房', text: '免费协助确认课程、校内/校外住宿、空房、优惠和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '如遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可为学生提供当地支持，直到完成学习并顺利回国。' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', 'Buddy Teacher', '学习进度跟进', 'IELTS模考', '学生餐厅', '洗衣服务', '宿舍清洁', '学习大厅', '医护协助', '校内保安'];
  readonly campusActivities = ['新生说明会', '毕业典礼', '商务发表', '校内交流', '泳池与运动', '学习成果展示'];
  readonly weekendActivities = ['麦克坦海岛活动', '宿务市区生活', '商场与餐厅', '度假村周末体验', '同学自发聚会', '顾问可协助确认安全建议'];
  readonly notes = [
    'Philinter报名前建议先确认General、Intensive、IPS、IELTS或Business方向，课程强度差异明显。',
    '校内宿舍和校外公寓在门禁、接送、生活便利度和预算上不同，报名时要一起确认。',
    '儿童和青少年课程需先确认年龄、陪同家长、监护规则、开课档期和房型。',
    '本页课程费与住宿费为4周拆分参考，正式报价仍需按学校费用表、优惠和房型空位确认。',
    '到校支付费用会随学校政策、汇率和个人情况变化，最终以学校现场收费为准。',
  ];

  readonly faqs: FaqItem[] = [
    { question: 'Philinter适合第一次菲律宾游学吗？', answer: '适合。Philinter是宿务老牌学校，课程体系完整，适合想在稳定学习风气里提升英文的学生。' },
    { question: 'Philinter是斯巴达学校吗？', answer: 'Philinter整体更常被理解为半斯巴达学校，但Intensive、IELTS和保证班方向会有更强的学习安排和规则。' },
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费和住宿费；到校后通常还需支付SSP、SSP E-card、水电、教材、押金、接机、延签等当地费用。' },
    { question: 'Philinter适合口说强化吗？', answer: '适合。Intensive Power Speaking是Philinter常被关注的口说方向，适合想提升流利度、准确度和表达自信的学生。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名Philinter，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
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
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees.find((course) => course.id === 'light-esl')?.id ?? this.courseFees[0].id;
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'in-campus-triple')?.id ?? this.roomFees[0].id;
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
  get seasonalSurcharge(): number { return this.seasonalFeePerWeek > 0 ? this.selectedWeeks * this.seasonalFeePerWeek : 0; }
  get quoteUsd(): number { return this.registrationFee + (this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks) * this.discount + this.seasonalSurcharge; }
  get quoteUsdText(): string { return `USD ${this.formatUsd(this.quoteUsd)} 起`; }
  get quoteCnyText(): string { const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100; return `约 ${rounded.toLocaleString('zh-CN')} 元起`; }
  get discountText(): string { return this.discount === 1 ? '优惠需顾问确认，参考范围' : `${Math.round(this.discount * 100)} 折扣范围`; }

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 1 }); }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private createRoomId(name: string): string {
    if (name.includes('校外') && name.includes('单人')) return 'azon-single';
    if (name.includes('校外') && name.includes('双人')) return 'azon-twin';
    if (name.includes('三人')) return 'in-campus-triple';
    if (name.includes('双人')) return 'in-campus-twin';
    if (name.includes('单人')) return 'in-campus-single';
    return this.slugifyPriceKey(name);
  }
  private currencyCodeForDisplay(code?: string): string { return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase(); }
  private formatCurrencyAmount(fee: SchoolFeeDTO): string {
    if (fee.fee === 0) return '需顾问确认';
    return `${this.currencyCodeForDisplay(fee.currencyCode)} ${fee.fee.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1, maximumFractionDigits: 1 })}`;
  }
  private cleanFeeDescription(description?: string): string { return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准'; }
}
