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
  selector: 'app-cpils-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cpils-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
  ],
})
export class CpilsSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolName = 'CPILS';
  private readonly courseFeeOrder = ['general-esl', 'general-esl-plus', 'general-esl-light', 'premier-sparta', 'ielts-course', 'toeic-course', 'toefl-course', 'business-english', 'power-speaking-and-modern-communication', 'parent-child-program'];
  private readonly roomFeeOrder = ['quad', 'triple', 'twin', 'single'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 125;
  readonly discount = 1;
  seasonalFeePerWeek = 0;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12];
  selectedCourseId = 'general-esl';
  selectedRoomId = 'quad';
  selectedWeeks = 4;
  selectedStartDate = '2026-05-18';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'apartment', label: '学校类型', value: '宿务老牌考试强化型', note: '2001年创立，宿务较早ESL学校之一' },
    { icon: 'groups', label: '适合人群', value: '成人 / 考试 / 亲子', note: '目标导向、可接受管理节奏的学生' },
    { icon: 'verified_user', label: '管理模式', value: '半斯巴达 / 斯巴达选择', note: '课程强度和校规需按项目确认' },
    { icon: 'school', label: '课程选项', value: 'ESL / IELTS / TOEIC / TOEFL', note: '另有商务、口语和亲子课程' },
    { icon: 'bed', label: '住宿房型', value: '单人 / 双人 / 三人 / 四人', note: '校内宿舍，Premium房型需另核' },
    { icon: 'workspace_premium', label: '考试资源', value: 'IELTS / TOEIC', note: '官方历史资料显示考试资源突出' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'CPILS主楼外观', description: '宿务市区型校园，学习、住宿和服务集中在校内。', src: 'assets/cpils/campus-main.jpg' },
    { category: '校园', title: 'CPILS校园入口', description: '老牌市区学校，适合重视学习管理和生活机能的学生。', src: 'assets/cpils/campus-front.jpg' },
    { category: '教室', title: '课程体系展示', description: '官方课程页列出ESL、Premier Sparta、IELTS、TOEIC、TOEFL等方向。', src: 'assets/cpils/classroom-header.jpg' },
    { category: '教室', title: '课程负责人展示', description: '官方课程页展示不同课程负责人，适合按目标选择课程。', src: 'assets/cpils/classroom-teacher.jpg' },
    { category: '住宿', title: '宿舍楼与住宿区', description: '官方资料显示CPILS有180间以上宿舍房间。', src: 'assets/cpils/dormitory-building.jpg' },
    { category: '住宿', title: '校内双人房参考', description: '房内通常配备床具、桌椅、冰箱、独立卫浴和Wi-Fi。', src: 'assets/cpils/regular-room-3.jpg' },
    { category: '住宿', title: 'Premium房型参考', description: 'Premium房型费用更高，亲子、青少年和高楼层房型需提前确认。', src: 'assets/cpils/premium-room-2.jpg' },
    { category: '餐厅', title: 'Dining Area餐饮区', description: '官方服务设施列出Dining Area和Snack Bar。', src: 'assets/cpils/service-12.png' },
    { category: '设施', title: 'Fitness Gym健身房', description: '官方休闲设施页列出健身房，适合课后运动。', src: 'assets/cpils/gym.jpg' },
    { category: '设施', title: 'Outdoor Swimming Pool', description: '泳池是CPILS官方介绍中的主要休闲设施之一。', src: 'assets/cpils/leisure-pool.jpg' },
    { category: '设施', title: '学生服务柜台', description: '到校后费用、证件、宿舍和日常问题可通过学校窗口处理。', src: 'assets/cpils/service-2.png' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: 'Center for Premier International Language Studies (CPILS)' },
    { label: '所在地区', value: 'Benedicto Bldg., M.J. Cuenco Ave., Cebu City' },
    { label: '创立时间', value: '2001年，官方资料称为宿务第一所ESL Center' },
    { label: '学校定位', value: '老牌ESL、考试英语、斯巴达/半斯巴达管理型学校' },
    { label: '课程资源', value: 'General ESL、Premier Sparta、IELTS、TOEIC、TOEFL、Business、Power Speaking、Parent-Child' },
    { label: '住宿资源', value: '180间以上宿舍房间，单人、双人、三人和四人房' },
    { label: '考试资源', value: '官方历史资料列出TOEIC官方考点、IELTS相关资源和考场历史' },
    { label: '服务设施', value: 'Dining Area、Snack Bar、Clinic、Laundry、Security、Gym、Pool、Cafe、Lounge' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/cpils/campus-main.jpg', title: '宿务老牌语言学校', text: '2001年创立，适合看重学校经验、管理体系和考试资源的学生。' },
    { image: 'assets/cpils/classroom-header.jpg', title: '课程覆盖完整', text: 'ESL、斯巴达、IELTS、TOEIC、TOEFL、商务、口语和亲子课程都可比较。' },
    { image: 'assets/cpils/regular-room-3.jpg', title: '校内住宿集中管理', text: '宿舍、课程、餐饮和服务都在校内，适合想降低通勤和适应压力的人。' },
    { image: 'assets/cpils/gym.jpg', title: '学习之外也有设施', text: '泳池、健身房、咖啡娱乐区和休息区能支持课后放松。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '目标很清楚，想要被学习节奏推动', text: 'CPILS更适合想通过课程安排、校规和模考推进英语或考试目标的学生。' },
    { title: '准备IELTS、TOEIC或TOEFL', text: '官方资料显示CPILS长期发展考试课程，并有TOEIC与IELTS相关资源。' },
    { title: '希望住校内、学习生活集中管理', text: '宿舍、餐厅、服务窗口、洗衣、诊所和保安都在学校系统内。' },
    { title: '成人、职场或亲子学生需要课程比较', text: '商务、Power Speaking和Parent-Child Program都适合让顾问按目标细分。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想要度假村感和新校区环境', text: 'CPILS是市区老牌学校，环境重点不在度假风格，若重视校园质感可比较CPI、CIA、EV。' },
    { title: '完全不想接受校规或学习管理', text: '考试、斯巴达和保证班方向会有更明确的出勤、测试和纪律要求。' },
    { title: '只看网页价格，不准备当地费用', text: '除前期费用外，到校还会有SSP、SSP E-card、水电、教材、押金等当地费用。' },
    { title: '热门档期才临时确认单人房', text: '考试课程、亲子档期、Premium或单人房都建议提前确认空房。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'General ESL / Plus / Light', type: '综合英语', lessons: '一对一 + 1:2 / 1:4 / 1:12等团体课组合', suitable: '适合第一次游学、基础提升和希望按强度微调的学生。' },
    { name: 'Premier Sparta', type: '斯巴达强化', lessons: '更高强度学习管理 + 沟通能力训练', suitable: '适合自律不足、需要明确学习节奏推动的人。' },
    { name: 'IELTS Course', type: '雅思备考', lessons: '听说读写、词汇文法、目标分数和模考训练', suitable: '适合英联邦升学、移民或明确分数目标学生。' },
    { name: 'TOEIC / TOEFL Course', type: '考试英语', lessons: '考试专项、技巧训练和定期测试', suitable: '适合求职、毕业门槛、升学和企业英语需求。' },
    { name: 'Business English', type: '商务英语', lessons: '会议、简报、面试、谈判与职场书信', suitable: '适合职场人士和准备英文工作场景的学生。' },
    { name: 'Power Speaking and Modern Communication', type: '口语沟通', lessons: '口语流利度、表达自信和现代沟通训练', suitable: '适合想增加开口量、提升沟通反应的学生。' },
    { name: 'Parent-Child Program', type: '亲子课程', lessons: '家长与孩子同行学习安排', suitable: '适合亲子游学，但年龄、监护、房型和校规需提前确认。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'general-esl', name: 'General ESL', tuition: 1060, suitable: '基础综合英语，适合第一次游学和稳步提升' },
    { id: 'general-esl-plus', name: 'General ESL Plus', tuition: 1060, suitable: '综合英语加强方向，适合想增加输出训练的学生' },
    { id: 'general-esl-light', name: 'General ESL Light', tuition: 980, suitable: '较轻量综合英语，适合想保留生活弹性的学生' },
    { id: 'premier-sparta', name: 'Premier Sparta', tuition: 1160, suitable: '斯巴达学习强度，适合需要纪律推动的学生' },
    { id: 'ielts-course', name: 'IELTS Course', tuition: 1215, suitable: '雅思备考与目标分数训练' },
    { id: 'toeic-course', name: 'TOEIC Course', tuition: 1160, suitable: '托业备考，适合求职、升学或企业英语需求' },
    { id: 'toefl-course', name: 'TOEFL Course', tuition: 1160, suitable: '托福备考，适合北美升学或考试目标学生' },
    { id: 'business-english', name: 'Business English', tuition: 1160, suitable: '商务沟通与职场表达' },
    { id: 'power-speaking-and-modern-communication', name: 'Power Speaking and Modern Communication', tuition: 1160, suitable: '口语表达、沟通自信和现代沟通训练' },
    { id: 'parent-child-program', name: 'Parent-Child Program', tuition: 1160, suitable: '亲子课程方向，需按年龄、监护和房型确认' },
  ];

  roomFees: RoomFee[] = [
    { id: 'quad', name: '四人房', fee: 530, note: '默认报价参考，预算压力较低' },
    { id: 'triple', name: '三人房', fee: 605, note: '多人房中预算较平衡' },
    { id: 'twin', name: '双人房', fee: 670, note: '适合朋友同行或希望兼顾预算与舒适度' },
    { id: 'single', name: '单人房', fee: 825, note: '隐私最好，预算较高，热门档期需早确认' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与晨间准备', text: '校内用餐后准备当天课程，具体时间以学校课表为准。' },
    { time: '08:00 - 12:00', title: '上午课程', text: '一对一、小团体、大团体或考试专项课程，按课程强度安排。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '校内餐饮区用餐，可整理笔记或短暂休息。' },
    { time: '13:00 - 17:00', title: '下午课程', text: '继续口语、听力、阅读、写作、考试技巧或商务表达训练。' },
    { time: '17:00 - 19:00', title: '晚餐与自由时间', text: '可使用学校服务窗口、宿舍、洗衣或休闲设施。' },
    { time: '19:00 - 21:00', title: '自习 / 选修 / 校内安排', text: '斯巴达、考试和亲子课程的晚间规则需按项目确认。' },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 6,800', note: '特别学习许可，通常到校支付' },
    { item: 'SSP E-card', amount: 'PHP 4,000', note: '以学校现场收费为准' },
    { item: '水电费', amount: 'PHP 2,000', note: '公开资料示例为每周预收 PHP 500，4周 PHP 2,000，多退少补' },
    { item: '教材费', amount: 'PHP 2,000', note: '按课程和实际购买教材调整' },
    { item: '管理费', amount: 'PHP 1,000', note: '4周参考，最终以学校现场收费为准' },
    { item: '学生证', amount: 'PHP 300', note: '一次性费用参考' },
    { item: '宿舍押金', amount: 'PHP 3,000', note: '退房检查后按学校规则退还' },
    { item: '接机费', amount: 'PHP 1,200', note: '宿务机场接机参考' },
    { item: 'ACR I-card', amount: 'PHP 4,000', note: '长期学习或延签时通常需要' },
    { item: '洗衣费', amount: 'PHP 500', note: '按实际使用和衣物重量调整' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断CPILS是否适合', text: '先了解学习目标、当前程度、考试分数、预算、房型和可接受管理强度。' },
    { icon: 'fact_check', title: '确认课程、房型和优惠', text: '免费协助确认课程、房型、空房、优惠和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', 'Dining Area', 'Snack Bar', '洗衣服务', 'Housekeeping', 'School Clinic', 'Security', '学习室', '学生服务窗口'];
  readonly campusActivities = ['新生说明会', '英语交流', '泳池休闲', '健身房运动', '咖啡娱乐区', 'Mezzanine Lounge休息'];
  readonly weekendActivities = ['宿务市区生活', '商场与餐厅', '咖啡厅', '跳岛游', '海边活动', '学生自发聚会'];
  readonly notes = [
    'CPILS课程选择较多，建议先确认你是要综合英语、考试分数、斯巴达管理、商务还是亲子方向。',
    '考试课程、亲子档期、单人房和Premium房型建议尽早确认空房。',
    '本页课程费与住宿费拆分用于报价逻辑，正式报价仍需按学校费用表、优惠和房型确认。',
    '到校支付费用会随学校政策、汇率和个人情况变化。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: 'CPILS适合第一次菲律宾游学吗？', answer: '适合目标清楚、可以接受一定学习管理的学生。若第一次游学但希望有人督促学习，CPILS会比自由型学校更有节奏。' },
    { question: 'CPILS更适合考试还是口语？', answer: '两者都有，但CPILS的老牌考试资源和管理体系更突出。若目标是IELTS、TOEIC或TOEFL，建议优先核对当前分数、目标分数和可读周数。' },
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费、住宿费和可能的旺季附加费；到校后仍需支付SSP、SSP E-card、水电费、教材费、押金等当地费用。' },
    { question: 'CPILS住宿有哪些房型？', answer: '官方资料列出单人、双人、三人和四人房，也有Main Building Regular、Premium和Extension等住宿方向。具体空房需按入学日期确认。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名CPILS，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
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
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees[0].id;
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'quad')?.id ?? this.roomFees[0].id;
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
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private createRoomId(name: string): string {
    if (name.includes('四人')) return 'quad';
    if (name.includes('三人')) return 'triple';
    if (name.includes('双人')) return 'twin';
    if (name.includes('单人')) return 'single';
    return this.slugifyPriceKey(name);
  }
  private currencyCodeForDisplay(code?: string): string { return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase(); }
  private formatCurrencyAmount(fee: SchoolFeeDTO): string { return `${this.currencyCodeForDisplay(fee.currencyCode)} ${fee.fee.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1, maximumFractionDigits: 1 })}`; }
  private cleanFeeDescription(description?: string): string { return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准'; }
}
