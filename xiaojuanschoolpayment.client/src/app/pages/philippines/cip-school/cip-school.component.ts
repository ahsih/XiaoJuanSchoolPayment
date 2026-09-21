import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import { CIP_COURSES, CIP_ROOMS, CIP_WEEKS, CipCourse, CipCourseGroup, cipDate } from './cip-pricing';
import { CIP_FAQS, CIP_GALLERY, CIP_HOLIDAYS, CIP_ROOM_PHOTOS } from './cip-content';
import { CipStudentQuote } from './cip-student-quote';
import { CipQuoteCalculatorComponent } from './cip-quote-calculator.component';

@Component({
  selector: 'app-cip-school', standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ExpandableImageComponent, CipQuoteCalculatorComponent],
  templateUrl: './cip-school.component.html', styleUrls: ['./cip-school.component.css'],
})
export class CipSchoolComponent {
  readonly courses = CIP_COURSES;
  readonly rooms = CIP_ROOMS;
  readonly courseGroups: CipCourseGroup[] = ['日常英语', '考试与商务', '亲子与青少年'];
  readonly gallery = CIP_GALLERY;
  readonly roomPhotos = CIP_ROOM_PHOTOS;
  readonly faqs = CIP_FAQS;
  readonly localReferences = CIP_WEEKS.map(weeks => {
    const student = new CipStudentQuote();
    student.plan.updateWeeks('course', student.plan.courses[0].id, weeks);
    const dorm = student.local;
    // The school also supplies 1–3-week hotel local-fee rows even though short
    // hotel course/accommodation prices require confirmation.
    return { weeks, deposit: dorm.deposit!, dorm: dorm.subtotal! + dorm.deposit!, hotel: dorm.subtotal! - weeks * 600 };
  });
  readonly anchors = [
    { id: 'overview', label: '概览与校园' }, { id: 'courses', label: '课程' },
    { id: 'rooms', label: '住宿' }, { id: 'quote', label: '费用与报价' },
    { id: 'admission', label: '入学与学习' }, { id: 'life', label: '校园生活' },
    { id: 'faq', label: '常见问题' },
  ];
  selectedGroup: CipCourseGroup = '日常英语';
  showHotelRooms = false;
  showAllHolidays = false;
  videoPlaying = false;
  get filteredCourses() { return this.courses.filter(course => course.group === this.selectedGroup); }
  get displayedRooms() { return this.rooms.filter(room => room.hotel === this.showHotelRooms); }
  get displayedRoomPhotos() { return this.roomPhotos.filter(room => room.title.startsWith('酒店') === this.showHotelRooms); }
  get holidays() {
    const now = new Date(), today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return CIP_HOLIDAYS.filter(day => this.showAllHolidays || day.date >= today);
  }
  scrollToSection(event: Event, id: string): void {
    event.preventDefault();
    const document = (event.currentTarget as HTMLAnchorElement).ownerDocument;
    document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  coursePrice(course: CipCourse): string {
    if (course.confirmation || course.tuition === null) return '费用待确认';
    if (course.id === 'speak-up') return '1周3,048元／2周4,953元';
    if (course.fixedWeeks) return `${this.money(course.tuition * course.fixedWeeks / 4)}元／${course.fixedWeeks}周`;
    return `${this.money(course.tuition)}元／4周`;
  }
  duration(course: CipCourse): string { return course.fixedWeeks ? `${course.fixedWeeks}周` : `1—${course.maxWeeks}周`; }
  money(value: number): string { return value.toLocaleString('zh-CN', { maximumFractionDigits: 0 }); }
  weekday(value: string): string { return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][cipDate(value)!.getUTCDay()]; }
}
