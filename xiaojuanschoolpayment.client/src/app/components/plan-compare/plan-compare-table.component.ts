import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { PlanCompareSheet } from './plan-compare-sheet';

/** The web version of a plan comparison; the quote image draws the same sheet. */
@Component({
  selector: 'app-plan-compare-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pc-wrap">
      <table class="pc-table" [style.--pc-count]="sheet.plans.length">
        <thead>
          <tr>
            <th scope="col" class="pc-label">对比项目</th>
            <th scope="col" *ngFor="let plan of sheet.plans">
              <span class="pc-tag">{{ plan.tag }}</span>
              <strong>{{ plan.title }}</strong>
              <small class="pc-error" *ngIf="plan.error">{{ plan.error }}</small>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of sheet.rows" [ngClass]="'pc-' + row.style">
            <th scope="row">{{ row.label }}</th>
            <td *ngFor="let value of row.values; let index = index">
              <ng-container *ngIf="!sheet.plans[index]?.error; else missing">
                <span>{{ value }}</span>
                <small *ngIf="row.subValues?.[index]">{{ row.subValues?.[index] }}</small>
              </ng-container>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ul class="pc-notes" *ngIf="sheet.notes.length">
      <li *ngFor="let note of sheet.notes">{{ note }}</li>
    </ul>
    <ng-template #missing><span class="pc-missing">—</span></ng-template>
  `,
  styles: [`
    :host { display: block; }
    .pc-wrap { overflow-x: auto; border: 1px solid #dce7e1; border-radius: 12px; background: #fff; }
    .pc-table { width: 100%; min-width: 320px; border-collapse: collapse; table-layout: fixed; font-size: 14px; color: #14233e; }
    .pc-table th, .pc-table td { padding: 10px 8px; border-top: 1px solid #e6ece9; text-align: center; vertical-align: middle; overflow-wrap: anywhere; white-space: pre-line; }
    .pc-table thead th { border-top: 0; background: #f3f6f4; vertical-align: top; }
    .pc-table .pc-label, .pc-table tbody th { width: 120px; text-align: left; color: #06422e; font-weight: 800; font-size: 13px; }
    .pc-table thead th + th, .pc-table td { border-left: 1px solid #e6ece9; }
    .pc-tag { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #f25518; color: #fff; font-size: 12px; font-weight: 800; }
    .pc-table thead strong { display: block; margin-top: 6px; color: #06422e; font-size: 15px; line-height: 1.35; }
    .pc-error { display: block; margin-top: 4px; color: #b42318; font-size: 12px; font-weight: 600; line-height: 1.4; text-align: left; }
    .pc-table td span { display: block; font-weight: 700; line-height: 1.4; }
    .pc-table td small { display: block; margin-top: 2px; color: #64748b; font-size: 12px; line-height: 1.4; }
    .pc-detail td span { font-weight: 400; color: #64748b; font-size: 12px; }
    .pc-money td span { font-weight: 800; }
    .pc-subtotal td span { font-weight: 900; font-size: 15px; }
    .pc-total th, .pc-total td { background: #fff6f0; }
    .pc-total td span { color: #f25518; font-weight: 900; font-size: 19px; word-break: keep-all; overflow-wrap: normal; }
    .pc-diff td span { color: #c2410c; font-weight: 800; }
    .pc-missing { color: #94a3b8; }
    .pc-notes { margin: 10px 0 0; padding-left: 18px; color: #64748b; font-size: 12.5px; line-height: 1.6; }
    /* Phones: each row label sits on its own line above the plans' values, so all plans stay side by side. */
    @media (max-width: 640px) {
      .pc-wrap { overflow: visible; }
      .pc-table { display: block; min-width: 0; font-size: 13px; }
      .pc-table thead, .pc-table tbody { display: block; }
      .pc-table tr { display: grid; grid-template-columns: repeat(var(--pc-count, 3), minmax(0, 1fr)); }
      .pc-table th, .pc-table td { padding: 7px 4px; }
      .pc-table thead .pc-label { display: none; }
      .pc-table thead th { border-top: 0; }
      .pc-table thead th:nth-child(2) { border-left: 0; }
      .pc-table tbody th { grid-column: 1 / -1; width: auto; padding: 6px 10px; background: #f7faf8; font-size: 12px; text-align: left; }
      .pc-table tbody td { border-top: 0; }
      .pc-table tbody th + td { border-left: 0; }
      .pc-table thead strong { font-size: 13px; }
      .pc-total td span { font-size: 15px; }
      .pc-table td small { font-size: 11px; }
    }
  `],
})
export class PlanCompareTableComponent {
  @Input({ required: true }) sheet!: PlanCompareSheet;
}
