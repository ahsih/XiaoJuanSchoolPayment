import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ScrollToDirective } from '../../../directives/scroll-to.directive';

interface IrelandPageContent {
  title: string;
  englishTitle: string;
  summary: string;
  audience: string;
  keywords: string;
  heroImage: string;
  metrics: { value: string; label: string }[];
  cardsTitle: string;
  cards: { icon: string; title: string; text: string }[];
  guideTitle: string;
  guideText: string;
  checklist: string[];
  sources: { label: string; url: string }[];
}

@Component({
  selector: 'app-ireland-page-content',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ScrollToDirective],
  templateUrl: './ireland-page-content.component.html',
  styleUrl: '../info-page/ireland-info-page.component.css',
})
export class IrelandPageContentComponent {
  @Input({ required: true }) page!: IrelandPageContent;
}
