import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UkQuoteAmount, UkQuoteSheet, ukAmountText, ukEmphasisRuns, ukMoney } from './uk-quote-sheet';

/** Web version of the UK quote image: the same sheet rows, laid out as responsive tables. */
@Component({
  selector: 'app-uk-quote-sheet',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './uk-quote-sheet.component.html',
  styleUrl: './uk-quote-sheet.component.css',
})
export class UkQuoteSheetComponent {
  @Input({ required: true }) sheet!: UkQuoteSheet;

  readonly money = ukMoney;

  amountText(amount: UkQuoteAmount): string {
    return ukAmountText(amount);
  }

  amountClass(amount: UkQuoteAmount): string {
    return typeof amount === 'number' ? 'amount' : amount === 'included' ? 'amount included' : 'amount na';
  }

  lines(text: string) {
    return text.split('\n').map(line => ukEmphasisRuns(line));
  }

  get sectionOptionalNumber(): string {
    return '02';
  }

  get sectionNotesNumber(): string {
    return this.sheet.optionalRows.length ? '03' : '02';
  }
}
