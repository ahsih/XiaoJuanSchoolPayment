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
  /** Optional school pages with their own course, price and quote details. */
  schools?: StudyTourSchool[];
}

interface StudyTourSchool {
  name: string;
  route: string;
  /** Optional anchor on the school page, for summer-only centres listed on an overview page. */
  fragment?: string;
  image?: string;
  text: string;
  tags: string[];
  /** Cities group the list and add a city filter once there is more than one. */
  city?: string;
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
  selectedCity = '';

  /** Cities in list order with their school counts. */
  get cities(): Array<{ name: string; count: number }> {
    const counts = new Map<string, number>();
    (this.page.schools ?? []).forEach(school => {
      if (school.city) counts.set(school.city, (counts.get(school.city) ?? 0) + 1);
    });
    return [...counts].map(([name, count]) => ({ name, count }));
  }

  /** Schools grouped by city (one unnamed group when no city is set), filtered by the chosen city. */
  get schoolGroups(): Array<{ city: string; schools: StudyTourSchool[] }> {
    const schools = this.page.schools ?? [];
    if (this.cities.length < 2) return [{ city: '', schools }];
    return this.cities
      .filter(city => !this.selectedCity || city.name === this.selectedCity)
      .map(city => ({ city: city.name, schools: schools.filter(school => school.city === city.name) }));
  }
}
