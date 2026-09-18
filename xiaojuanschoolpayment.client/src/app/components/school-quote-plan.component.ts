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
  isRoomScheduleLocked(_kind: QuotePlanKind) { return false; }
  isStartDateLocked(kind: QuotePlanKind, index: number) {
    return this.plan.syncSchedules && !this.plan.isFirstRow(kind, this.plan.rows(kind)[index].id);
  }
  weekOptions(kind: QuotePlanKind, currentWeeks: number, id = this.plan.rows(kind)[0].id) {
    const otherWeeks = this.plan.scheduleRows(kind, id).reduce((sum, row) => sum + row.weeks, 0) - currentWeeks;
    return this.plan.segmentWeeks.filter(weeks => otherWeeks + weeks <= this.plan.maxWeeks);
  }
  canAdd(kind: QuotePlanKind) {
    return this.plan.canAdd(kind);
  }
  add(kind: QuotePlanKind): void {
    if (!this.canAdd(kind)) return;
    this.plan.add(kind);
  }
  remove(kind: QuotePlanKind, index: number): void {
    if (this.isRoomScheduleLocked(kind)) return;
    const row = this.plan.rows(kind)[index];
    if (!row) return;
    this.plan.remove(kind, row.id);
  }
  updateWeeks(kind: QuotePlanKind, index: number, weeks: number): void {
    if (this.isRoomScheduleLocked(kind)) return;
    const row = this.plan.rows(kind)[index];
    if (!row) return;
    this.plan.updateWeeks(kind, row.id, weeks);
  }
  updateStartDate(kind: QuotePlanKind, index: number, value: string, input: HTMLInputElement): void {
    const row = this.plan.rows(kind)[index];
    if (this.isStartDateLocked(kind, index)) {
      input.value = row?.startDate ?? '';
      return;
    }
    const timestamp = this.plan.date(value);
    if (!row || timestamp === null || new Date(timestamp).getUTCDay() !== 0) {
      input.value = row?.startDate ?? '';
      return;
    }
    this.plan.updateStartDate(kind, row.id, value);
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
