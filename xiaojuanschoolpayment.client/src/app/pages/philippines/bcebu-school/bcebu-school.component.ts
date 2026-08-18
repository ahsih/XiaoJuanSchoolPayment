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

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface CourseFee { id: string; name: string; tuition: number; suitable: string; }
interface RoomFee { id: string; name: string; fee: number; note: string; }
interface SideNavItem { label: string; target: string; icon: string; }

@Component({
  selector: 'app-bcebu-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bcebu-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './bcebu-school.component.css',
  ],
})
export class BCebuSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolNames = ["菲律宾宿务B'Cebu语言学校", "BECI B'Cebu", "B'Cebu"];
  private readonly shortTermRatios: Record<number, number> = { 1: 0.4, 2: 0.6, 3: 0.8 };
  private readonly courseFeeOrder = [
    'speed-esl', 'intensive-esl', 'ielts', 'ielts-sparta', 'ielts-guarantee', 'b-sparta',
    'business-english', 'junior-esl', 'lite-esl4', 'lite-esl2-40-plus', 'kindergarten',
  ];
  private readonly roomFeeOrder = [
    'single-newtown-view', 'single-garden-view', 'double', 'double-living-room',
    'family-triple-extra-bed', 'two-plus-one', 'triple-bunk',
  ];

  registrationFee = 100;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12];
  selectedWeeks = 4;
  selectedCourseId = 'speed-esl';
  selectedRoomId = 'triple-bunk';
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '地区', value: '宿务 / 麦克坦', note: '房型资料包含马克坦新城与校内花园方向' },
    { icon: 'school', label: '课程', value: 'ESL / IELTS / Business', note: '另有Junior、40岁以上轻量课与幼儿园' },
    { icon: 'rule', label: '学习强度', value: '弹性到斯巴达', note: "Speed ESL、Intensive、IELTS Sparta与B'SPARTA可选" },
    { icon: 'family_restroom', label: '年龄方向', value: '3岁起 / 成人 / 亲子', note: '课程与房型均需按年龄和同行关系确认' },
    { icon: 'bed', label: '住宿', value: '单人至三人房', note: '另有客厅套房、亲子加床和2+1房型' },
    { icon: 'percent', label: '短期比例', value: '40% / 60% / 80%', note: '对应1周 / 2周 / 3周' },
  ];

  courseFees: CourseFee[] = [
    { id: 'speed-esl', name: 'Speed ESL', tuition: 900, suitable: '4节一对一 + 2节小组课 + 2节晚课（选修）' },
    { id: 'intensive-esl', name: 'Intensive ESL', tuition: 1050, suitable: '6节一对一 + 2节晚课（选修）' },
    { id: 'ielts', name: 'IELTS', tuition: 1000, suitable: '雅思系统学习与模拟测试方向' },
    { id: 'ielts-sparta', name: 'IELTS Sparta', tuition: 1050, suitable: '强制早课、模拟测试与自习；22:00结束' },
    { id: 'ielts-guarantee', name: 'IELTS GUARANTEE', tuition: 1150, suitable: '需提交雅思成绩，12周起报' },
    { id: 'b-sparta', name: "B'SPARTA", tuition: 1050, suitable: '5节一对一 + 强制晚课与自习' },
    { id: 'business-english', name: '商务英语', tuition: 1050, suitable: '4节一对一 + 2节小组课 + 2节必修课' },
    { id: 'junior-esl', name: 'Junior ESL', tuition: 1250, suitable: '6节一对一；适合6-16岁' },
    { id: 'lite-esl4', name: 'Lite ESL4', tuition: 750, suitable: '4节一对一；适合慢节奏学习' },
    { id: 'lite-esl2-40-plus', name: 'Lite ESL2（40岁以上）', tuition: 400, suitable: '2节一对一；仅适用于40岁以上学生' },
    { id: 'kindergarten', name: '幼儿园', tuition: 950, suitable: '08:30-12:20 / 13:30-17:00；适合3-6岁' },
  ];

  roomFees: RoomFee[] = [
    { id: 'single-newtown-view', name: '单人间外景（马克坦新城）', fee: 1400, note: '50岁以上学生只能选择单人间' },
    { id: 'single-garden-view', name: '单人间内景（校内花园）', fee: 1350, note: '50岁以上学生只能选择单人间' },
    { id: 'double', name: '双人间', fee: 950, note: '标准双人房' },
    { id: 'double-living-room', name: '双人间+客厅', fee: 1250, note: '仅限夫妻、兄弟姐妹或同行朋友共同报名，不接受个人入住' },
    { id: 'family-triple-extra-bed', name: '双人间+客厅（加床亲子3人）', fee: 1000, note: '亲子三人入住参考房型' },
    { id: 'two-plus-one', name: '2+1宿舍（上下铺）', fee: 900, note: '只限女生，仅在淡季开放' },
    { id: 'triple-bunk', name: '三人间（上下铺）', fee: 750, note: '周六下午4点后可免费入住' },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '2026课程费', target: 'course-fees', icon: 'menu_book' },
    { label: '2026住宿费', target: 'room-fees', icon: 'bed' },
    { label: '费用计算器', target: 'quote', icon: 'calculate' },
    { label: '价格说明', target: 'price-note', icon: 'info' },
  ];

  ngOnInit(): void { this.loadPricingFromDatabase(); }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: "B'Cebu" }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toUpperCase().includes('CEBU')) ??
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
    const databaseCourses = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => ({
        id: this.createCourseId(lesson.name), name: lesson.name, tuition: lesson.price,
        suitable: lesson.description || lesson.note || '请联系顾问确认课程安排',
      }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourses.length > 0) {
      this.courseFees = databaseCourses;
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees[0].id;
    }

    const databaseRooms = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRooms.length > 0) {
      this.roomFees = databaseRooms;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'triple-bunk')?.id ?? this.roomFees[0].id;
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
  }

  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[0]; }
  get billingMultiplier(): number { return this.shortTermRatios[this.selectedWeeks] ?? (this.selectedWeeks / 4); }
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * this.billingMultiplier; }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * this.billingMultiplier; }
  get quoteUsd(): number { return this.registrationFee + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get quoteUsdText(): string { return `USD ${this.formatUsd(this.quoteUsd)} 起`; }
  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }
  get billingRuleText(): string {
    const percentage = this.shortTermRatios[this.selectedWeeks];
    return percentage
      ? `${this.selectedWeeks}周按4周课程费和住宿费的${percentage * 100}%计算`
      : `${this.selectedWeeks}周按4周价格的${this.billingMultiplier}倍计算`;
  }

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

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private createCourseId(name: string): string {
    if (name === '商务英语') return 'business-english';
    if (name === '幼儿园') return 'kindergarten';
    if (name.includes('Lite ESL2')) return 'lite-esl2-40-plus';
    if (name === "B'SPARTA") return 'b-sparta';
    return this.slugifyPriceKey(name);
  }
  private createRoomId(name: string): string {
    if (name.includes('单人间外景')) return 'single-newtown-view';
    if (name.includes('单人间内景')) return 'single-garden-view';
    if (name === '双人间') return 'double';
    if (name.includes('加床亲子')) return 'family-triple-extra-bed';
    if (name.includes('双人间+客厅')) return 'double-living-room';
    if (name.includes('2+1')) return 'two-plus-one';
    if (name.includes('三人间')) return 'triple-bunk';
    return this.slugifyPriceKey(name);
  }
}
