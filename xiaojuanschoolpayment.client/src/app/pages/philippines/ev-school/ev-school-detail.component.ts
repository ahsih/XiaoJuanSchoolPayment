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
  selector: 'app-ev-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ev-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
  ],
})
export class EvSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolName = 'EV Academy';
  private readonly courseFeeOrder = ['esl-classic', 'intensive-esl', 'power-speaking-6', 'power-speaking-8', 'ielts', 'toeic', 'business'];
  private readonly roomFeeOrder = ['single', 'double', 'triple', 'quad'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly discount = 1;
  seasonalFeePerWeek = 0;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12];
  selectedCourseId = 'esl-classic';
  selectedRoomId = 'quad';
  selectedWeeks = 4;
  selectedStartDate = '2026-05-18';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'apartment', label: '学校类型', value: '宿务斯巴达 / 半斯巴达', note: 'SP1 / SP2 双模式' },
    { icon: 'groups', label: '适合人群', value: '7岁以上学生', note: '15岁以下通常需父母陪同' },
    { icon: 'verified_user', label: '管理模式', value: '斯巴达或半斯巴达', note: '按学习目标选择强度' },
    { icon: 'school', label: '课程选项', value: 'ESL / IELTS / TOEIC', note: '另有Power Speaking与商务英语' },
    { icon: 'bed', label: '住宿房型', value: '单人到四人房', note: '校内住宿，热门房型需早确认' },
    { icon: 'event_available', label: '校区位置', value: 'Nasipit, Cebu City', note: '宿务市区校园型学校' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'EV校园外观', description: '2017年迁入的新校区，主打school & resort校园体验。', src: 'assets/ev/campus-exterior.jpg' },
    { category: '校园', title: '校园草坪', description: '开放式校园空间，适合课后活动和学生交流。', src: 'assets/ev/campus-lawn.jpg' },
    { category: '教室', title: '一对一教室', description: '用于口语、写作、考试专项和Power Speaking课程。', src: 'assets/ev/mtm-classroom.jpg' },
    { category: '住宿', title: '单人房', description: '适合重视隐私和安静学习环境的学生。', src: 'assets/ev/single-room.jpg' },
    { category: '住宿', title: '双人房', description: '适合朋友同行或希望兼顾预算与舒适度。', src: 'assets/ev/double-room.jpg' },
    { category: '住宿', title: '四人房', description: '默认报价参考房型，预算压力相对低。', src: 'assets/ev/quad-room.jpg' },
    { category: '设施', title: '健身房', description: '课后运动和体能恢复使用。', src: 'assets/ev/gym.jpg' },
    { category: '设施', title: '游泳池', description: 'EV度假型校园的重要生活设施。', src: 'assets/ev/swimming-pool.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: 'EV Academy' },
    { label: '所在地区', value: 'Nasipit, Cebu City, Cebu' },
    { label: '创校时间', value: '2002年创校，2017年迁入新校区' },
    { label: '学生容量', value: '约300名学生' },
    { label: '管理模式', value: 'SP1斯巴达 / SP2半斯巴达，可按学习目标选择' },
    { label: '年龄要求', value: '7岁以上；15岁以下通常需要父母陪同' },
    { label: '住宿房型', value: '校内单人房、双人房、三人房、四人房' },
    { label: '核心资源', value: 'IDP IELTS官方考试教室、24小时自习室、校内泳池与运动设施' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/ev/campus-exterior.jpg', title: '宿务代表性现代校园', text: '教学、住宿、自习和运动设施集中在同一校园。' },
    { image: 'assets/ev/mtm-classroom.jpg', title: 'SP1 / SP2 强度可选', text: '想冲刺可选斯巴达，想保留生活弹性可选半斯巴达。' },
    { image: 'assets/ev/swimming-pool.jpg', title: '学习与生活平衡', text: '校园环境比传统市区学校更完整，适合重视舒适度的学生。' },
    { image: 'assets/ev/quad-room.jpg', title: '房型预算清楚', text: '默认四人房适合先估算总预算，单人房需尽早确认。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '目标清楚、想被学习节奏推动', text: 'SP1斯巴达适合想提高自律、冲刺考试或短期高强度学习的学生。' },
    { title: '想留在宿务市区校园', text: 'EV在Cebu City，适合希望兼顾校园环境和市区便利度的人。' },
    { title: '重视一对一口语训练', text: 'Power Speaking 6 / 8 适合口语目标明确、想提高开口量的学生。' },
    { title: '准备IELTS、TOEIC或商务英语', text: '课程覆盖综合英语、考试英语和特定目的英语，方便按目标选择。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想轻松度假式游学', text: 'EV仍有清晰管理制度，尤其SP1不适合只想自由体验宿务生活的学生。' },
    { title: '预算非常紧', text: '现代校园、设施和热门房型会拉高预算，到校费用也需要单独准备。' },
    { title: '临近旺季才决定', text: 'EV热门房型和课程容易满位，暑假、寒假建议提前确认空房。' },
    { title: '未成年学生未确认陪同规则', text: '15岁以下、亲子或未成年学生要先确认年龄、陪同、门禁和管理费。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'ESL Classic', type: '半斯巴达综合英语', lessons: '4节一对一 + 4节团体 + 2节选修/天', suitable: '适合希望学习与宿务生活保持平衡的学生。' },
    { name: 'Intensive ESL', type: '斯巴达强化英语', lessons: '4节一对一 + 4节团体 + 2节选修/天', suitable: '适合想用更强纪律快速进入学习状态的学生。' },
    { name: 'Power Speaking 6', type: '口语强化', lessons: '每天6节一对一口语训练', suitable: '适合短期集中提升开口量、纠音和表达反应。' },
    { name: 'Power Speaking 8', type: '高强度口语', lessons: '每天8节一对一口语训练', suitable: '适合目标非常明确、能承受高一对一强度的学生。' },
    { name: 'IELTS', type: '雅思备考', lessons: '考试专项、模考和学习管理', suitable: '适合有目标分数、希望被制度推动的学生。' },
    { name: 'TOEIC', type: '托业备考', lessons: '听力、阅读、语法和考试技巧', suitable: '适合求职、升学或企业英语能力证明需求。' },
    { name: 'Business', type: '商务英语', lessons: '会议、演示、邮件、面试与商务表达', suitable: '适合职场人士或准备英文工作场景的学生。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'esl-classic', name: 'ESL Classic', tuition: 780, suitable: '半斯巴达综合英语，适合学习与生活平衡' },
    { id: 'intensive-esl', name: 'Intensive ESL', tuition: 900, suitable: '斯巴达强度更高，适合学习冲刺' },
    { id: 'power-speaking-6', name: 'Power Speaking 6', tuition: 980, suitable: '每天更多一对一口语训练' },
    { id: 'power-speaking-8', name: 'Power Speaking 8', tuition: 1080, suitable: '高一对一比例，适合口语冲刺' },
    { id: 'ielts', name: 'IELTS', tuition: 1000, suitable: '雅思专项备考' },
    { id: 'toeic', name: 'TOEIC', tuition: 950, suitable: '托业专项备考' },
    { id: 'business', name: 'Business', tuition: 950, suitable: '商务沟通与职场表达' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与晨间准备', text: '按课程强度准备当天学习，SP1学生通常更强调准时和纪律。' },
    { time: '08:00 - 12:00', title: '上午课程', text: '一对一、小组课、考试专项或口语训练，按课程类型安排。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '校内餐厅用餐，下午课程前整理学习资料。' },
    { time: '13:00 - 17:00', title: '下午课程', text: '继续一对一、小组课、选修课或考试训练。' },
    { time: '17:00 - 19:00', title: '晚餐与休息', text: 'SP2学生生活弹性较高，SP1学生按学校规定执行。' },
    { time: '19:00 - 21:00', title: '自习 / 作业 / 晚间安排', text: '具体强度以SP1/SP2制度和到校课表为准。' },
  ];

  roomFees: RoomFee[] = [
    { id: 'single', name: '单人房', fee: 1600, note: '隐私最好，预算较高，热门档期需早确认' },
    { id: 'double', name: '双人房', fee: 1230, note: '适合朋友同行或兼顾预算与舒适度' },
    { id: 'triple', name: '三人房', fee: 1150, note: '多人房中预算较平衡' },
    { id: 'quad', name: '四人房', fee: 1100, note: '默认报价参考，预算压力较低' },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，通常到校支付' },
    { item: 'SSP E-card', amount: 'PHP 4,500', note: '以学校现场收费为准' },
    { item: '教材费', amount: 'PHP 2,000', note: '按实际购买教材调整' },
    { item: '水电费', amount: 'PHP 3,200', note: '4周参考，按实际或学校规则调整' },
    { item: 'ACR I-card', amount: 'PHP 4,000', note: '长期学习或延签时通常需要' },
    { item: '学生证', amount: 'PHP 500', note: '一次性费用参考' },
    { item: '设施维护费', amount: 'PHP 2,000', note: '4周参考' },
    { item: '接机费', amount: 'PHP 1,200', note: '宿务机场接机参考' },
    { item: '保证金', amount: 'PHP 3,000', note: '退房检查后按学校规则退还' },
    { item: '洗衣费', amount: 'PHP 600', note: '约 PHP 150 / 5kg / 次，按实际使用调整' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断SP1 / SP2是否适合', text: '先了解学习目标、自律程度、预算、年龄和入学时间，判断EV制度是否匹配。' },
    { icon: 'fact_check', title: '确认课程、空房和优惠', text: '免费协助确认课程、房型、空房、优惠和正式报价，避免只按网页价格做决定。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', '24小时自习室', '宿舍清洁', '洗衣服务', '医护室', '校内保安', '证件协助'];
  readonly campusActivities = ['新生说明会', '文化交流', '体育活动', '校内比赛', '校园休闲活动'];
  readonly weekendActivities = ['市区商场', '咖啡厅与餐厅', '跳岛游', '海边活动', '学生自发聚会'];
  readonly notes = ['SP1和SP2管理强度不同，报名之前要先确认自己能接受的学习纪律。', '热门房型、暑假和寒假档期建议尽早确认空房。', '未成年学生、亲子学生和长期学习学生，需要提前确认额外管理规则。', '到校支付费用会随学校政策、汇率和个人情况变化。', '最终报名以学校正式录取、付款节点和顾问确认报价为准。'];
  readonly faqs: FaqItem[] = [
    { question: 'EV Academy适合第一次菲律宾游学吗？', answer: '适合目标明确、能接受一定管理的学生。如果更想轻松体验宿务生活，可优先考虑SP2半斯巴达或ESL Classic。' },
    { question: 'EV的SP1和SP2怎么选？', answer: 'SP1更适合冲刺型学生，日程和自习要求更强；SP2适合想学习但也希望保留一定外出和生活弹性的学生。' },
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费和住宿费；到校后仍需支付SSP、SSP E-card、教材、水电、设施费、接机、保证金等当地费用。' },
    { question: 'EV适合亲子或未成年学生吗？', answer: '可以考虑，但15岁以下通常需父母陪同，未满18岁可能有额外管理费和更严格门禁，报名之前要按年龄和课程逐项确认。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名EV，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
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
    const databaseCourseFees = lessons.filter((lesson) => lesson.week === 4).map((lesson) => ({ id: this.slugifyPriceKey(lesson.name), name: lesson.name, tuition: lesson.price, suitable: lesson.description || lesson.note || '请联系顾问确认适合人群' })).sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourseFees.length > 0) { this.courseFees = databaseCourseFees; if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees[0].id; }
    const databaseRoomFees = rooms.filter((room) => room.week === 4).map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' })).sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) { this.roomFees = databaseRoomFees; if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees[this.roomFees.length - 1].id; }
    const registrationFee = fees.find((fee) => fee.name === '注册费'); if (registrationFee) this.registrationFee = registrationFee.fee;
    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费'); if (peakSeasonFee) this.seasonalFeePerWeek = peakSeasonFee.fee;
    const databaseLocalFees = fees.filter((fee) => this.currencyCodeForDisplay(fee.currencyCode) === 'PHP').map((fee) => ({ item: fee.name, amount: this.formatCurrencyAmount(fee), note: this.cleanFeeDescription(fee.description) }));
    if (databaseLocalFees.length > 0) this.localFees = databaseLocalFees;
  }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  calculateQuote(): void { this.quoteCalculated = true; }
  scrollToSection(target: string, event?: Event): void { event?.preventDefault(); const targetElement = document.getElementById(target); if (!targetElement) return; const headerOffset = window.innerWidth <= 680 ? 132 : 92; const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset; window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' }); window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`); }
  get filteredGalleryImages(): GalleryImage[] { return this.selectedGalleryCategory === '全部' ? this.galleryImages : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory); }
  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[this.roomFees.length - 1]; }
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
  private createRoomId(name: string): string { if (name.includes('单人')) return 'single'; if (name.includes('双人')) return 'double'; if (name.includes('三人')) return 'triple'; if (name.includes('四人')) return 'quad'; return this.slugifyPriceKey(name); }
  private currencyCodeForDisplay(code?: string): string { return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase(); }
  private formatCurrencyAmount(fee: SchoolFeeDTO): string { return `${this.currencyCodeForDisplay(fee.currencyCode)} ${fee.fee.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1, maximumFractionDigits: 1 })}`; }
  private cleanFeeDescription(description?: string): string { return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准'; }
}
