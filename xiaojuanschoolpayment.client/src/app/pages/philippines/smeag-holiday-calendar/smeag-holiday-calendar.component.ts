import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  SMEAG_HOLIDAYS_2027,
  SMEAG_MONTH_LABELS,
  SmeagCampus,
  SmeagHoliday2027,
  getSmeagHolidaySchedule,
} from '../smeag-holidays-2027';

interface HolidayMonthGroup {
  month: number;
  label: string;
  holidays: SmeagHoliday2027[];
}

@Component({
  selector: 'app-smeag-holiday-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './smeag-holiday-calendar.component.html',
  styleUrl: './smeag-holiday-calendar.component.css',
})
export class SmeagHolidayCalendarComponent {
  @Input({ required: true }) campus: SmeagCampus = 'capital';

  readonly holidays = SMEAG_HOLIDAYS_2027;
  readonly scheduleFor = getSmeagHolidaySchedule;

  get campusName(): string {
    return this.campus === 'capital' ? 'SMEAG Capital 校区' : 'SMEAG Encanto 海滨校区';
  }

  get closedCount(): number {
    return this.holidays.filter(item => this.scheduleFor(item, this.campus).status === 'closed').length;
  }

  get specialCount(): number {
    return this.holidays.length - this.closedCount;
  }

  get monthGroups(): HolidayMonthGroup[] {
    return Object.entries(
      this.holidays.reduce<Record<number, SmeagHoliday2027[]>>((groups, holiday) => {
        (groups[holiday.month] ??= []).push(holiday);
        return groups;
      }, {}),
    ).map(([month, holidays]) => ({
      month: Number(month),
      label: SMEAG_MONTH_LABELS[Number(month)],
      holidays,
    }));
  }
}
