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
import { GlcQuoteCalculator } from './glc-quote';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { GLC_COURSES, GLC_ROOMS, GLC_REGISTRATION_NOTE, GLC_LOCAL_FEE_INTRO, glcCourseName } from './glc-pricing';
import { QuotePlanRow, applySchoolQuoteImageLayout, quoteMoney } from '../../../components/school-quote-plan';
import { SCHOOL_VISA_OPTIONS, SchoolVisaType, groupLocalFees } from '../../../components/school-group-quote';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12 | 16 | 20 | 24;

interface QuickInfo {
  icon: string;
  label: string;
  value: string;
  note: string;
}

interface GalleryImage {
  category: Exclude<GalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
}

interface BasicInfoRow {
  label: string;
  value: string;
}

interface Highlight {
  image: string;
  title: string;
  text: string;
}

interface FitItem {
  title: string;
  text: string;
}

interface RoomOption {
  id: string;
  name: string;
  note: string;
  weeklyAccommodation: number;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  weeklyTuition: number;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
}

interface ProcessStep {
  icon: string;
  title: string;
  text: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SideNavItem {
  label: string;
  target: string;
  icon: string;
}

interface SourceLink {
  label: string;
  url: string;
}

interface SpecialCourseFee {
  label: string;
  lessons: string;
  weeklyTuition: number;
  note: string;
}

interface GlcStudentQuote {
  calculator: GlcQuoteCalculator;
  ageGroup: 'adult' | 'minor';
  sharedCourseOwner: number | null;
  ownCourses: QuotePlanRow[];
}

@Component({
  selector: 'app-glc-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './glc-school.component.html',
  styleUrls: [
    '../school-quote-rollout.css',
    '../philippines-local-fee-table.css',
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../../../components/school-group-quote.css',
    './glc-school.component.css',
  ],
})
export class GlcSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolName = '菲律宾宿务Global Language Cebu';
  private readonly specialFeeOrder = [
    'Light Power Speaking',
    'Ultra Sparta ESL',
    'Family Package 2',
    'Family Package 3',
    'Family Package 4',
    'Kids English 6',
    'Kids English 7',
    'Kids English 8',
    'Junior Power Speaking 6',
    'Junior Power Speaking 7',
    'Junior Power Speaking 8',
    'General IELTS',
    'Intensive IELTS',
    'Ultra8 IELTS',
    'Ultra IELTS斯巴达',
    'Business course',
    'Ultra7 Business',
  ];
  private readonly roomOrder = [
    '主楼豪华单人间',
    '主楼单人间',
    '主楼双人间',
    '主楼三人间',
    '副楼双人间',
    '副楼单人间',
  ];
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  registrationFee = 120;
  usdToCny = 7.2;
  phpPerCny = 9;
  exchangeRateDate = '';

  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly students: GlcStudentQuote[] = [this.createStudent()];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) while (this.students.length < value) this.students.push(this.createStudent());
  }
  setQuoteMode(value: 'single' | 'group') { this.quoteMode = value; if (value === 'group') this.studentCount = this.requestedStudentCount; }
  get activeStudents(): GlcStudentQuote[] {
    const active = this.quoteMode === 'single' ? this.students.slice(0, 1) : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2)));
    active.forEach((student, index) => {
      const owner = student.sharedCourseOwner ? active[student.sharedCourseOwner - 1] : undefined;
      const valid = !!owner && student.sharedCourseOwner! <= index && owner.sharedCourseOwner === null && owner.calculator.family;
      if (!valid) student.sharedCourseOwner = null;
      student.calculator.plan.courses = valid ? owner!.calculator.plan.courses : student.ownCourses;
      student.calculator.returningStudents = student.calculator.returningStudents ? 1 : 0;
      student.calculator.peopleOverride = 1;
    });
    return active;
  }
  private createStudent(): GlcStudentQuote {
    const calculator = new GlcQuoteCalculator(() => this.quoteCourses, () => this.roomOptions, () => this.registrationFee);
    calculator.peopleOverride = 1;
    const ownCourses = calculator.plan.courses;
    return { calculator, ageGroup: 'adult', sharedCourseOwner: null, ownCourses };
  }
  get calculator() { return this.students[0].calculator; }
  get quotePlan() { return this.calculator.plan; }
  get selectedCourseId() { return this.quotePlan.courses[0].optionId; }
  get selectedRoomId() { return this.quotePlan.rooms[0].optionId; }
  get selectedWeeks() { return this.totalCourseWeeks; }
  get selectedStartDate() { return this.activeStudents.map(student => student.calculator.plan.startDate).filter(Boolean).sort()[0] ?? ''; }
  get quoteCourses() {
    return GLC_COURSES.map(course => {
      const current = this.courseOptions.find(item => item.name === course.name)
        ?? this.specialFees.find(item => item.label === course.name);
      return { ...course, weeklyTuition: current?.weeklyTuition ?? course.weeklyTuition };
    });
  }
  get courseFeeGroups() {
    const courses = this.quoteCourses;
    return ['一般英语', '雅思', '商务', '亲子', '儿童英语', '青少年英语']
      .map(type => ({ type, courses: courses.filter(course => course.type === type) }));
  }

  courseDisplayName(id: string): string {
    const course = GLC_COURSES.find(item => item.id === id);
    return course ? glcCourseName(course) : '';
  }

  shareCandidates(index: number) { return this.activeStudents.slice(0, index).map((student, owner) => ({ owner: owner + 1, student })).filter(item => item.student.sharedCourseOwner === null && item.student.calculator.family); }
  isCourseShared(student: GlcStudentQuote) { return student.sharedCourseOwner !== null; }
  sharedStudentNumbers(ownerIndex: number) { return this.activeStudents.map((student, index) => student.sharedCourseOwner === ownerIndex + 1 ? index + 1 : 0).filter(Boolean); }

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_city',
      label: '学校类型',
      value: '日系运营 / 宿务Mabolo大型综合校',
      note: 'GLC前身为IDEA CEBU，2022年迁入现校区并更名，公开资料列定员约400人。',
    },
    {
      icon: 'record_voice_over',
      label: '课程重点',
      value: 'Power Speaking / IELTS / TOEIC / Family',
      note: '一般英语以Power Speaking为核心，也有亲子、儿童青少年、商务和实习英语方向。',
    },
    {
      icon: 'hotel',
      label: '住宿选择',
      value: '主楼 / 副楼校内宿舍',
      note: '2026年价目表列主楼豪华单人、单人、双人、三人房及副楼单人、双人房。',
    },
    {
      icon: 'groups',
      label: '学生组成',
      value: '日本学生比例较高，多国籍环境',
      note: '官方资料列日本、台湾、韩国、泰国、俄罗斯等学生来源，适合想要日系支持的人群。',
    },
    {
      icon: 'restaurant',
      label: '费用包含',
      value: '学费 + 住宿 + 每日三餐',
      note: '官方课程页说明套餐价包含授课、住宿和每日三餐；当地费用需另行准备。',
    },
    {
      icon: 'pool',
      label: '校园设施',
      value: '泳池 / 健身房 / 自习区 / 活动',
      note: '公开资料列泳池、健身房、游戏室、桌球/乒乓、自习区、餐厅和高速Wi-Fi。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'GLC Mabolo校区',
      description:
        'GLC位于Cebu City Mabolo生活圈，周边有商场、餐厅、超市和医疗资源。',
      src: '/assets/glc/campus-main.jpg',
    },
    {
      category: '教室',
      title: '一对一学习空间',
      description:
        'Power Speaking以一对一输出训练为核心，按课程强度增加每日一对一节数。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b7f6af1e5a6d0af8e8dd__D430813.webp',
    },
    {
      category: '教室',
      title: '小组课教室',
      description:
        '一般英语、考试、商务和亲子路线可搭配小组课，增加讨论和表达练习。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b7ecbc33712e35c95969__D430782.webp',
    },
    {
      category: '设施',
      title: '泳池与公共区域',
      description:
        '校内有泳池、休息区和活动空间，适合想兼顾学习与生活体验的学生。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b7e35ca95fda3290edfb__D430518.webp',
    },
    {
      category: '餐厅',
      title: '校内餐食',
      description:
        '公开课程页说明套餐价含每日三餐，特殊餐食或过敏需求需提前确认。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b823f1f8e88374dd30d2__D430834.webp',
    },
    {
      category: '住宿',
      title: '主楼 / 副楼宿舍参考',
      description:
        '校内宿舍按房型列每周住宿费，斯巴达管理学生只能选择副楼住宿。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b8b2c9416ac1b74d3789_DSC03460.webp',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务Global Language Cebu' },
    { label: '英文名称', value: 'Global Language Cebu（GLC）' },
    { label: '前身', value: 'IDEA CEBU，2022年11月迁入现校区并更名GLC' },
    { label: '位置', value: '2815 New Frontier St, Mabolo, Cebu City, Cebu 6000' },
    { label: '学校规模', value: '公开资料列定员约400人' },
    { label: '学校定位', value: '日系运营、Mabolo市区大型综合型、半斯巴达/自律平衡' },
    { label: '主要课程', value: 'Power Speaking、IELTS、TOEIC、Business、Family、Kids / Junior、English + Internship' },
    { label: '房型', value: '主楼豪华单人、单人、双人、三人房；副楼单人、双人房' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b82f95b2c14f958198a6__D431020.webp',
      title: 'Mabolo市区生活圈',
      text: '校区在Cebu City Mabolo，官方资料提到Ayala、SM Cebu、超市、餐厅和医院等周边资源。',
    },
    {
      image: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b7f6af1e5a6d0af8e8dd__D430813.webp',
      title: 'Power Speaking课量清楚',
      text: '一般英语从4节一对一+2节小组开始，也可选5节一对一或7节一对一的高输出路线。',
    },
    {
      image: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b7e35ca95fda3290edfb__D430518.webp',
      title: '课程类型覆盖面广',
      text: '除了成人ESL，也能比较亲子、儿童青少年、TOEIC、IELTS、商务和English + Internship方向。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '第一次宿务游学',
      text: 'Mabolo生活圈、校内住宿和清楚的课程套餐，适合希望流程好理解的学生。',
    },
    {
      title: '想提高口语输出',
      text: 'Power Speaking、Intensive和Ultra7能按一对一课量调强度，短期学习也容易安排。',
    },
    {
      title: '亲子或青少年英语',
      text: '官方课程覆盖Family Package、Kids和Junior English，适合把GLC放进亲子候选名单。',
    },
    {
      title: '想住市区且要设施完整',
      text: '泳池、健身房、自习区、游戏室和周边商场资源，让学习和生活比较平衡。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想海边度假校区',
      text: 'GLC在Cebu City Mabolo，不是Mactan海边校区；海边感可比较Genius或Cebu Blue Ocean。',
    },
    {
      title: '需要超严格斯巴达管理',
      text: 'GLC更适合半斯巴达/自律平衡型；强制学习管理可同步比较CG斯巴达校区、EV或SMEAG。',
    },
    {
      title: '只看最低总价',
      text: '注册费、SSP、签证、管理费、教材、水电和接送都会影响最终预算。',
    },
  ];

  roomOptions: RoomOption[] = GLC_ROOMS.map(room => ({ ...room }));

  courseOptions: CourseOption[] = GLC_COURSES
    .filter(course => ['power-speaking', 'intensive-power-speaking', 'ultra7-power-speaking'].includes(course.id))
    .map(course => ({ ...course }));

  specialFees: SpecialCourseFee[] = GLC_COURSES
    .filter(course => !['power-speaking', 'intensive-power-speaking', 'ultra7-power-speaking'].includes(course.id))
    .map(course => ({ label: course.name, lessons: course.lessons, weeklyTuition: course.weeklyTuition, note: course.suitable || '住宿费与学杂费另计。' }));

  readonly registrationNote = GLC_REGISTRATION_NOTE;

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 08:00',
      title: '早餐 / 课前准备',
      text: '公开资料列套餐含每日三餐，实际时段以到校说明为准。',
    },
    {
      time: '08:00 - 11:50',
      title: '上午一对一 / 小组课',
      text: 'Power Speaking一般从一对一和小组课组合开始，按课程强度调整节数。',
    },
    {
      time: '12:00 - 13:00',
      title: '午餐',
      text: '校内餐厅用餐，特殊餐食、过敏或宗教饮食需提前申请并确认费用。',
    },
    {
      time: '13:00 - 17:00',
      title: '下午课程 / 复习',
      text: 'ESL、TOEIC、IELTS、Business、Family或Kids路线按等级与目标安排。',
    },
    {
      time: '17:00 - 19:00',
      title: '晚餐 / 运动 / 休息',
      text: '可使用泳池、健身房、自习区或参加校内活动，以现场开放规则为准。',
    },
    {
      time: '19:00以后',
      title: '自习 / 外出管理',
      text: '18岁以上官方FAQ口径较自由，但建议23:00前返校；未成年规则更严格。',
    },
  ];

  readonly localFeeIntro = GLC_LOCAL_FEE_INTRO;
  get localFees() {
    return groupLocalFees(this.activeStudents.map(student => ({ localFees: student.calculator.localFees.map(fee => ({ item: fee.item, unitLabel: fee.unit, quantity: fee.quantity, total: fee.total, note: fee.note })) })))
      .map(fee => ({ item: fee.item, unit: fee.unitLabel, quantity: fee.quantity, total: fee.total, note: fee.note }));
  }
  get localTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get pickupCount() { return this.activeStudents.filter(student => student.calculator.pickup !== 'none').length; }
  get optionalFees() {
    const pickup = this.activeStudents.reduce((sum, student) => sum + student.calculator.pickupAmount, 0);
    const selected = this.pickupCount;
    const free = this.activeStudents.filter(student => student.calculator.pickup !== 'none' && student.calculator.freePickup).length;
    return [
      { item: '宿务马克坦机场团体接机', total: pickup, note: `${selected ? `本次${selected}人选择接机${free ? `，其中${free}人符合周日免费接机` : ''}` : '本次无人选择接机'}；非免费接机1,750比索／人。学校团体接机，按实际选择接机的人数计费；可能需在机场等候同批其他学生。` },
      { item: '房间押金', total: 3000 * this.activeStudents.length, note: `3,000比索／人 × ${this.activeStudents.length}人；可抵扣电费，离校按学校实际结算；不计入学杂费合计。` },
    ];
  }

  pesoCnyText(amount: number): string {
    return `人民币约 ${Math.round(amount / this.phpPerCny).toLocaleString('zh-CN')} 元`;
  }

  get exchangeRateNote(): string {
    return this.exchangeRateDate
      ? `参考汇率日期：${this.exchangeRateDate}；人民币预估仅供参考，最终以支付时汇率为准。`
      : '人民币暂按备用汇率预估，最终以支付时汇率为准。';
  }

  studentSubtotal(student: GlcStudentQuote): number {
    const calculator = student.calculator;
    return calculator.registration + calculator.accommodation + (student.sharedCourseOwner ? 0 : calculator.tuition - calculator.schoolDiscount - calculator.sidaDiscount);
  }
  get registrationTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.registration, 0); }
  get tuitionTotal() { return this.activeStudents.reduce((sum, student) => sum + (student.sharedCourseOwner ? 0 : student.calculator.tuition), 0); }
  get accommodationTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.accommodation, 0); }
  get schoolDiscountTotal() { return this.activeStudents.reduce((sum, student) => sum + (student.sharedCourseOwner ? 0 : student.calculator.schoolDiscount), 0); }
  get sidaDiscountTotal() { return this.activeStudents.reduce((sum, student) => sum + (student.sharedCourseOwner ? 0 : student.calculator.sidaDiscount), 0); }
  get totalCourseWeeks() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.plan.courseWeeks, 0); }
  get quoteHeading() { return `GLC${this.totalCourseWeeks}周报价`; }
  get quoteError() {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex(student => !!student.calculator.error);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].calculator.error}`;
  }
  get schoolPaymentItems() {
    const newStudents = this.activeStudents.filter(student => student.calculator.registration > 0).length;
    return [
      { label: '注册费', amount: `${this.formatUsd(this.registrationTotal)} 美元`, note: `一次性费用，老学员返校免费；本次计收${newStudents}人${newStudents < this.activeStudents.length ? `，${this.activeStudents.length - newStudents}人免收` : ''}` },
      { label: '课程费合计', amount: `${this.formatUsd(this.tuitionTotal)} 美元`, note: '家庭共享套餐由关联的两名学生共用一份课程，只收一次课程费。' },
      { label: '住宿费合计', amount: `${this.formatUsd(this.accommodationTotal)} 美元`, note: '按每位学生实际选择的房型和日期计算。' },
      ...(this.schoolDiscountTotal ? [{ label: '学校优惠', amount: `− ${this.formatUsd(this.schoolDiscountTotal)} 美元`, note: this.calculator.promotionNote }] : []),
      ...(this.sidaDiscountTotal ? [{ label: '思达启航专属优惠', amount: `− ${this.formatUsd(this.sidaDiscountTotal)} 美元`, note: this.calculator.sidaNote }] : []),
    ];
  }

  get quoteImageData() {
    const courseItems: QuoteImagePaymentItem[] = [];
    const roomItems: QuoteImagePaymentItem[] = [];
    this.activeStudents.forEach((student, index) => {
      const items = student.calculator.plan.paymentItems();
      if (!student.sharedCourseOwner) {
        const linked = this.sharedStudentNumbers(index);
        const people = [index + 1, ...linked].join('、');
        courseItems.push(...items.filter(item => item.icon === '课').map(item => ({ ...item, label: `${this.quoteMode === 'group' ? `学生${people}${linked.length ? '共享' : ''} · ` : ''}${item.label.replace(/^课程费/, '课程')}` })));
      }
      roomItems.push(...items.filter(item => item.icon === '宿').map(item => ({ ...item, label: `${this.quoteMode === 'group' ? `学生${index + 1} · ` : ''}${item.label.replace(/^住宿费/, '住宿')}` })));
    });
    const paymentItems: QuoteImagePaymentItem[] = [
      { icon: '注', label: '注册费', amount: `${quoteMoney(this.registrationTotal)} 美元`, note: this.schoolPaymentItems[0].note },
      ...courseItems,
      ...roomItems,
      ...(this.schoolDiscountTotal ? [{ icon: '惠', label: '学校优惠', amount: `− ${quoteMoney(this.schoolDiscountTotal)} 美元`, note: this.calculator.promotionNote, accent: true }] : []),
      ...(this.sidaDiscountTotal ? [{ icon: '惠', label: '思达启航专属优惠', amount: `− ${quoteMoney(this.sidaDiscountTotal)} 美元`, note: this.calculator.sidaNote, accent: true }] : []),
    ];
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'GLC', schoolName: 'GLC', filePrefix: 'GLC', heroSrc: '/assets/glc/campus-main.jpg',
      weeks: this.totalCourseWeeks, startDate: this.selectedStartDate, usdToCny: this.usdToCny, totalUsd: this.quoteUsd,
      fullFeeDetails: true, localFeeTableLayout: 'web', paymentItems,
      localFeeItems: this.localFees.map(fee => ({ label: fee.item, unit: fee.unit, quantity: String(fee.quantity), amount: `${quoteMoney(fee.total)} 比索`, note: fee.note })),
      localFeeTotal: this.localTotal, localCurrencyName: '比索', localFeeCny: Math.round(this.localTotal / this.phpPerCny), localFeeNote: this.localFeeIntro,
      optionalFeeItems: this.optionalFees.map(fee => ({ label: fee.item, amount: `${quoteMoney(fee.total)} 比索`, cnyAmount: `人民币约 ${Math.round(fee.total / this.phpPerCny).toLocaleString('zh-CN')} 元`, note: fee.note })),
      ruleNotes: [],
    });
    const warnings = this.activeStudents.flatMap((student, index) => student.calculator.plan.warning ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.calculator.plan.warning}`] : []);
    const shared = this.activeStudents.flatMap((student, index) => student.sharedCourseOwner ? [`学生${student.sharedCourseOwner}与学生${index + 1}共享一份家庭课程套餐；住宿、注册费和学杂费分别按人计算。`] : []);
    const result = applySchoolQuoteImageLayout({ ...quote, importantNotes: [...warnings, ...shared, '所有学生不收取寒暑假附加费。', '最终以学校价格、空房及优惠确认为准。'] }, 'GLC', this.totalCourseWeeks, this.selectedStartDate, this.quoteUsd, this.usdToCny);
    return { ...result, headingText: this.quoteHeading, fileName: `${this.quoteHeading}-${this.selectedStartDate.replace(/-/g, '')}.png`, conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateDate || undefined } };
  }

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断GLC是否适合',
      text: '根据市区位置、课程强度、亲子需求、考试目标和预算做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程与房型',
      text: '核对Power Speaking、考试、Family/Kids路线、主楼/副楼空房和入学日。',
    },
    {
      icon: 'payments',
      title: '拆清前期和当地费用',
      text: '把套餐价、注册费、SSP、签证、管理费、水电、教材、接机和押金分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备入学文件',
      text: '协助整理护照、保险、eTravel、接机表、现金清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '课程、老师、宿舍、账单或校规沟通问题，都可以继续联系顾问协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可按情况提供当地沟通支持。',
    },
  ];

  readonly trustBadges = [
    { icon: 'description', label: '公开费用逐项核验' },
    { icon: 'verified_user', label: '课程与房型提前确认' },
    { icon: 'payments', label: '套餐与当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '一对一课程',
    '小组课',
    'Power Speaking',
    'TOEIC / IELTS',
    'Business English',
    'Family Package',
    'Kids / Junior',
    '校内宿舍',
    '三餐',
    '泳池',
    '健身房',
    '高速Wi-Fi',
    '自习区',
    '商店',
  ];
  readonly campusActivities = [
    '校内交流活动',
    'Every other week活动',
    '周末Oslob等活动参考',
    '志愿者活动参考',
    '泳池和健身房',
    '桌球 / 乒乓',
  ];
  readonly weekendActivities = [
    'SM City Cebu',
    'Ayala Center Cebu',
    'Mabolo餐厅',
    'IT Park',
    '超市和咖啡厅',
    'Mactan周末行程',
  ];
  readonly notes = [
    '本页2026年课程和住宿价格按GLC美元周价表整理，报价器按“每周学费 + 每周住宿费”乘以周数计算。',
    '学校年度优惠按就读期间及课程条件计算；思达启航专属优惠每满4周50美元，所有学生免寒暑假附加费。',
    '亲子、Kids/Junior、IELTS、Business和斯巴达路线的年龄、入学条件、宿舍限制与开课安排需另行确认。',
    'SSP、SSP I-Card、签证、ACR、管理费、电费、教材、接机和押金通常不包含在课程住宿套餐内。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'GLC和CIA最大的区别是什么？',
      answer:
        'CIA更偏Mactan大型半斯巴达度假型校区；GLC更偏Cebu City Mabolo市区生活圈、日系运营、Power Speaking和亲子/考试多路线综合型。',
    },
    {
      question: '页面上的费用包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算课程住宿套餐和入学金；SSP、SSP I-Card、签证、ACR、管理费、电费、教材、接机、押金和个人生活费需另行准备。',
    },
    {
      question: 'GLC适合英语初学者吗？',
      answer:
        '适合列入候选。Power Speaking是一般英语路线，可按4节、5节或7节一对一强度选择，适合基础重建和口语输出。',
    },
    {
      question: 'GLC适合亲子或孩子游学吗？',
      answer:
        '可以比较。官方公开课程包含Family Package、Kids English和Junior English，但需确认孩子年龄、课程、住宿、监护和当地费用。',
    },
    {
      question: 'GLC住宿有什么要确认？',
      answer:
        '需确认主楼/副楼房型、性别空位、同住规则、清扫洗衣、Wi-Fi、门禁、餐食和前后泊安排；斯巴达管理学生只能选择副楼住宿。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程费用与安排', target: 'course-fees', icon: 'menu_book' },
    { label: '住宿费用与房型', target: 'room-fees', icon: 'hotel' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
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

  readonly sources: SourceLink[] = [
    { label: 'Global Language Cebu官方英文网站', url: 'https://www.glcenglish.com/' },
    { label: 'GLC官方学校资料', url: 'https://www.glcenglish.com/about/school' },
    { label: 'GLC Power Speaking官方课程资料', url: 'https://www.glcenglish.com/program/power-speaking' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe(rates => {
      if (Number.isFinite(rates.usdToCny) && Number.isFinite(rates.phpPerCny) && rates.usdToCny > 0 && rates.phpPerCny > 0) {
        this.usdToCny = rates.usdToCny;
        this.phpPerCny = rates.phpPerCny;
        this.exchangeRateDate = rates.date;
      }
    });
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: 'Global Language Cebu' }).pipe(
      switchMap((schools) => {
        const school =
          schools.find((item) => item.name === this.pricingSchoolName) ??
          schools.find((item) => item.name.includes('Global Language Cebu')) ??
          schools[0];

        if (!school?.id) {
          return EMPTY;
        }

        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 1 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 1 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees }) => {
      this.applyPricingData(lessons, rooms, fees);
    });
  }

  private applyPricingData(
    lessons: SchoolLessonDTO[],
    rooms: SchoolRoomDTO[],
    fees: SchoolFeeDTO[],
  ): void {
    const weeklyLessons = lessons.filter((lesson) => lesson.week === 1);
    const primaryCourseNames = new Set(this.courseOptions.map((course) => course.name));

    this.courseOptions = this.courseOptions.map((course) => {
      const databaseLesson = weeklyLessons.find((lesson) => lesson.name === course.name);

      return databaseLesson
        ? {
            ...course,
            lessons: GLC_COURSES.find(item => item.name === course.name)?.lessons || databaseLesson.description || course.lessons,
            suitable: databaseLesson.note || course.suitable,
            weeklyTuition: databaseLesson.price,
          }
        : course;
    });

    const databaseSpecialFees = weeklyLessons
      .filter((lesson) => !primaryCourseNames.has(lesson.name))
      .map((lesson) => ({
        label: lesson.name,
        lessons: GLC_COURSES.find(item => item.name === lesson.name)?.lessons || lesson.description || '课程安排请向学校确认',
        weeklyTuition: lesson.price,
        note: lesson.note || '住宿费与当地费用另加。',
      }))
      .sort(
        (left, right) =>
          this.orderIndex(this.specialFeeOrder, left.label) -
          this.orderIndex(this.specialFeeOrder, right.label),
      );

    if (databaseSpecialFees.length > 0) {
      this.specialFees = databaseSpecialFees;
    }

    const databaseRooms = rooms
      .filter((room) => room.week === 1)
      .map((room) => ({
        id: this.createRoomId(room),
        name: room.name,
        note: room.description || '请联系顾问确认空房和住宿规则。',
        weeklyAccommodation: room.price,
      }))
      .sort(
        (left, right) =>
          this.orderIndex(this.roomOrder, left.name) -
          this.orderIndex(this.roomOrder, right.name),
      );

    if (databaseRooms.length > 0) {
      this.roomOptions = databaseRooms;
      if (!this.roomOptions.some((room) => room.id === this.selectedRoomId)) {
        this.quotePlan.rooms[0].optionId =
          this.roomOptions.find((room) => room.id === 'annex-double')?.id ??
          this.roomOptions[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
    }
  }

  private createRoomId(room: SchoolRoomDTO): string {
    if (room.name === '主楼豪华单人间') return 'main-deluxe-single';
    if (room.name === '主楼单人间') return 'main-single';
    if (room.name === '主楼双人间') return 'main-double';
    if (room.name === '主楼三人间') return 'main-triple';
    if (room.name === '副楼双人间') return 'annex-double';
    if (room.name === '副楼单人间') return 'annex-single';
    return `database-${room.id}`;
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();
    const targetElement = document.getElementById(target);

    if (!targetElement) {
      return;
    }

    const headerOffset = window.innerWidth <= 680 ? 132 : 92;
    const targetTop =
      targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${target}`,
    );
  }

  feeFor(courseId: string, roomId: string, weeks: WeekOption = 4): number {
    const course = this.courseOptions.find((item) => item.id === courseId);
    const room = this.roomOptions.find((item) => item.id === roomId);

    return course && room
      ? (course.weeklyTuition + room.weeklyAccommodation) * weeks
      : 0;
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter(
          (image) => image.category === this.selectedGalleryCategory,
        );
  }

  get selectedCourse(): CourseOption {
    return (
      this.quoteCourses.find((course) => course.id === this.selectedCourseId) ??
      this.quoteCourses[0]
    );
  }

  get selectedRoom(): RoomOption {
    return (
      this.roomOptions.find((room) => room.id === this.selectedRoomId) ??
      this.roomOptions[0]
    );
  }

  get selectedPackageFee(): number {
    return this.tuitionTotal + this.accommodationTotal;
  }

  get quoteUsd(): number {
    return this.activeStudents.reduce((sum, student) => sum + this.studentSubtotal(student), 0);
  }

  get packageFeeText(): string {
    return `${this.formatUsd(this.feeFor('power-speaking', 'annex-double', 4))} 美元`;
  }

  get quoteUsdText(): string {
    return `${this.formatUsd(this.quoteUsd)} 美元`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round(this.quoteUsd * this.usdToCny);

    return `约 ${rounded.toLocaleString('zh-CN')} 元`;
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}
