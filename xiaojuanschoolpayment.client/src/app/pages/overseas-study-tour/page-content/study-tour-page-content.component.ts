import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ScrollToDirective } from '../../../directives/scroll-to.directive';

interface StudyTourPageContent {
  title: string;
  englishTitle: string;
  intro: string;
  positioning: string;
  keywords: string;
  heroImage: string;
  highlights: { value: string; label: string }[];
  cardsTitle: string;
  cards: { icon: string; title: string; text: string }[];
  checklistTitle: string;
  checklist: string[];
  sources: { label: string; url: string }[];
}

@Component({
  selector: 'app-study-tour-page-content',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ScrollToDirective],
  templateUrl: './study-tour-page-content.component.html',
  styleUrl: './study-tour-page-content.component.css',
})
export class StudyTourPageContentComponent {
  @Input({ required: true }) page!: StudyTourPageContent;
}
