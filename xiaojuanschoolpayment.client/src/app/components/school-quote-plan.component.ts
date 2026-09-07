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
  get travellers() { return Array.from({ length: this.travellerCount }, (_, index) => index + 1); }
  readonly lists = [{ kind: 'course' as const, title: '课程' }, { kind: 'room' as const, title: '住宿' }];
  readonly money = quoteMoney;
  trackRow(_: number, row: { id: number }) { return row.id; }
  details(kind: 'course' | 'room', id: string) { return this.plan.options(kind).find(option => option.id === id)?.details ?? ''; }
  optionGroups(kind: QuotePlanKind): { label: string; options: QuotePlanOption[] }[] {
    const options = this.plan.options(kind);
    const labels = [...new Set(options.map((option) => option.group).filter((label): label is string => !!label))];
    if (!labels.length) return [{ label: '', options }];
    const grouped = labels.map((label) => ({ label, options: options.filter((option) => option.group === label) }));
    const ungrouped = options.filter((option) => !option.group);
    return ungrouped.length ? [...grouped, { label: '其他', options: ungrouped }] : grouped;
  }
}
