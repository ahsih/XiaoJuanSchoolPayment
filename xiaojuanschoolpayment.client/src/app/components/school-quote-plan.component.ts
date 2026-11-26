import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuotePlanKind, QuotePlanOption, QuotePlanRow, SchoolQuotePlan, quoteMoney } from './school-quote-plan';

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
  @Input() currencyLabel = '美元';
  @Input() amountLabel: ((kind: QuotePlanKind, row: QuotePlanRow) => string) | null = null;
  @Input() allowedRowWeeks: ((kind: QuotePlanKind, row: QuotePlanRow) => readonly number[]) | null = null;
  /**
   * One stay for course and room (user decision 2026-11-21; the shared Philippine school template sets it): the
   * arrival Sunday and the end Saturday are picked once above the lists, and a second course or room type splits
   * that stay instead of adding weeks. Other schools keep a start date on every period.
   */
  @Input() singleStay = false;
  @Output() optionChange = new EventEmitter<{ kind: QuotePlanKind; row: QuotePlanRow }>();
  readonly sundayDateMinimum = '2020-01-05';
  get travellers() { return Array.from({ length: this.travellerCount }, (_, index) => index + 1); }
  readonly lists = [{ kind: 'course' as const, title: '课程' }, { kind: 'room' as const, title: '住宿' }];
  readonly money = quoteMoney;
  trackRow(_: number, row: { id: number }) { return row.id; }
  /**
   * optionGroups() builds new group objects on every check. Without these keys Angular rebuilt every <option> on each
   * click, and the desktop WeChat browser closed an open course or room list at once (colleague report 2026-11-25).
   */
  trackGroup(_: number, group: { label: string }) { return group.label; }
  trackOption(_: number, option: QuotePlanOption) { return option.id; }
  details(kind: 'course' | 'room', id: string) { return this.plan.options(kind).find(option => option.id === id)?.details ?? ''; }
  isRoomScheduleLocked(_kind: QuotePlanKind) { return false; }
  isStartDateLocked(kind: QuotePlanKind, index: number) {
    return this.plan.syncSchedules && !this.plan.isFirstRow(kind, this.plan.rows(kind)[index].id);
  }
  weekOptions(kind: QuotePlanKind, currentWeeks: number, id = this.plan.rows(kind)[0].id) {
    const otherWeeks = this.plan.scheduleRows(kind, id).reduce((sum, row) => sum + row.weeks, 0) - currentWeeks;
    const row = this.plan.rows(kind).find(item => item.id === id)!;
    return (this.allowedRowWeeks?.(kind, row) ?? this.plan.segmentWeeks).filter(weeks => otherWeeks + weeks <= this.plan.maxWeeks);
  }
  selectOption(kind: QuotePlanKind, row: QuotePlanRow, optionId: string): void {
    row.optionId = optionId;
    this.optionChange.emit({ kind, row });
  }
  canAdd(kind: QuotePlanKind) {
    return this.singleStay ? this.plan.canSplitStay(kind) : this.plan.canAdd(kind);
  }
  add(kind: QuotePlanKind): void {
    if (!this.canAdd(kind)) return;
    if (this.singleStay) this.plan.splitStay(kind);
    else this.plan.add(kind);
  }
  remove(kind: QuotePlanKind, index: number): void {
    if (this.isRoomScheduleLocked(kind)) return;
    const row = this.plan.rows(kind)[index];
    if (!row) return;
    if (this.singleStay) this.plan.removeStayPeriod(kind, row.id);
    else this.plan.remove(kind, row.id);
  }
  /** Stay lengths for the end-date list: every whole week, and under four weeks only where the school prices it. */
  get stayWeekOptions(): number[] {
    return this.plan.segmentWeeks.filter(weeks => weeks >= 4 || this.plan.allowedWeeks.includes(weeks));
  }
  /** The stay's arrival Sunday (the first course period starts the stay). */
  get stayStart(): string {
    return this.plan.courses[0]?.startDate ?? '';
  }
  stayEndLabel(weeks: number): string {
    const start = this.plan.date(this.stayStart);
    if (start === null) return `${weeks}周`;
    return `${new Date(start + (weeks * 7 - 1) * 86400000).toISOString().slice(0, 10).replace(/-/g, '/')}（${weeks}周）`;
  }
  updateStayStart(value: string, input: HTMLInputElement): void {
    const timestamp = this.plan.date(value);
    if (timestamp === null || new Date(timestamp).getUTCDay() !== 0) {
      input.value = this.stayStart;
      return;
    }
    this.plan.setStayStart(value);
  }
  setStayWeeks(weeks: number): void {
    this.plan.setStayWeeks(Number(weeks));
  }
  setPeriodWeeks(kind: QuotePlanKind, row: QuotePlanRow, weeks: number): void {
    this.plan.setStayPeriodWeeks(kind, row.id, Number(weeks));
  }
  /** A split period's own dates, e.g. 2026/11/22–12/19 (the year again only when it changes). */
  periodLabel(row: QuotePlanRow): string {
    const start = row.startDate, end = this.plan.end(row);
    if (!start || !end) return '—';
    const tail = end.slice(0, 4) === start.slice(0, 4) ? end.slice(5) : end;
    return `${start.replace(/-/g, '/')}–${tail.replace(/-/g, '/')}`;
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
