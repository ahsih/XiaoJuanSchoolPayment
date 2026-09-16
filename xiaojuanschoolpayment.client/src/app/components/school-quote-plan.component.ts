import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuotePlanKind, QuotePlanOption, SchoolQuotePlan, quoteMoney } from './school-quote-plan';

@Component({
  selector: 'app-school-quote-plan', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './school-quote-plan.component.html', styleUrl: './school-quote-plan.component.css',
})
export class SchoolQuotePlanComponent {
  @Input({ required: true }) plan!: SchoolQuotePlan;
  @Input() examCourseIds: string[] = [];
  @Input() travellerCount = 1;
  @Input() syncCourseDatesToRooms = false;
  @Input() lockRoomScheduleToCourses = false;
  readonly sundayDateMinimum = '2020-01-05';
  get travellers() { return Array.from({ length: this.travellerCount }, (_, index) => index + 1); }
  readonly lists = [{ kind: 'course' as const, title: '课程' }, { kind: 'room' as const, title: '住宿' }];
  readonly money = quoteMoney;
  trackRow(_: number, row: { id: number }) { return row.id; }
  details(kind: 'course' | 'room', id: string) { return this.plan.options(kind).find(option => option.id === id)?.details ?? ''; }
  isRoomScheduleLocked(kind: QuotePlanKind) { return this.lockRoomScheduleToCourses && kind === 'room'; }
  canAdd(kind: QuotePlanKind) {
    if (this.isRoomScheduleLocked(kind)) return false;
    return this.plan.canAdd(kind) && (!this.lockRoomScheduleToCourses || kind !== 'course' || this.plan.canAdd('room'));
  }
  add(kind: QuotePlanKind): void {
    if (!this.canAdd(kind)) return;
    const before = this.plan.rows(kind).length;
    this.plan.add(kind);
    if (this.lockRoomScheduleToCourses && kind === 'course' && this.plan.courses.length > before) {
      this.plan.add('room');
      this.syncRoomSchedule(before);
    }
  }
  remove(kind: QuotePlanKind, index: number): void {
    if (this.isRoomScheduleLocked(kind)) return;
    const row = this.plan.rows(kind)[index];
    if (!row) return;
    this.plan.remove(kind, row.id);
    if (this.lockRoomScheduleToCourses && kind === 'course') {
      const room = this.plan.rooms[index];
      if (room) this.plan.remove('room', room.id);
    }
  }
  updateWeeks(kind: QuotePlanKind, index: number, weeks: number): void {
    if (this.isRoomScheduleLocked(kind)) return;
    const row = this.plan.rows(kind)[index];
    if (!row) return;
    row.weeks = weeks;
    if (this.lockRoomScheduleToCourses && kind === 'course') this.syncRoomSchedule(index);
  }
  updateStartDate(kind: QuotePlanKind, index: number, value: string, input: HTMLInputElement): void {
    const row = this.plan.rows(kind)[index];
    if (this.isRoomScheduleLocked(kind)) {
      input.value = row?.startDate ?? '';
      return;
    }
    const timestamp = this.plan.date(value);
    if (!row || timestamp === null || new Date(timestamp).getUTCDay() !== 0) {
      input.value = row?.startDate ?? '';
      return;
    }
    row.startDate = value;
    if (this.lockRoomScheduleToCourses && kind === 'course') {
      this.syncRoomSchedule(index);
    } else if (this.syncCourseDatesToRooms) {
      const matchingRow = this.plan.rows(kind === 'course' ? 'room' : 'course')[index];
      if (matchingRow) matchingRow.startDate = value;
    }
  }
  private syncRoomSchedule(index: number): void {
    const course = this.plan.courses[index], room = this.plan.rooms[index];
    if (!course || !room) return;
    room.weeks = course.weeks;
    room.startDate = course.startDate;
  }
  optionGroups(kind: QuotePlanKind): { label: string; options: QuotePlanOption[] }[] {
    const options = this.plan.options(kind);
    const labels = [...new Set(options.map((option) => option.group).filter((label): label is string => !!label))];
    if (!labels.length) return [{ label: '', options }];
    const grouped = labels.map((label) => ({ label, options: options.filter((option) => option.group === label) }));
    const ungrouped = options.filter((option) => !option.group);
    return ungrouped.length ? [...grouped, { label: '其他', options: ungrouped }] : grouped;
  }
}
