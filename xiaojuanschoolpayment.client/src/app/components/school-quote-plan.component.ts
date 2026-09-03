import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolQuotePlan, quoteMoney } from './school-quote-plan';

@Component({
  selector: 'app-school-quote-plan', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './school-quote-plan.component.html', styleUrl: './school-quote-plan.component.css',
})
export class SchoolQuotePlanComponent {
  @Input({ required: true }) plan!: SchoolQuotePlan;
  @Input() examCourseIds: string[] = [];
  readonly lists = [{ kind: 'course' as const, title: '课程' }, { kind: 'room' as const, title: '住宿' }];
  readonly money = quoteMoney;
  trackRow(_: number, row: { id: number }) { return row.id; }
  details(kind: 'course' | 'room', id: string) { return this.plan.options(kind).find(option => option.id === id)?.details ?? ''; }
}
