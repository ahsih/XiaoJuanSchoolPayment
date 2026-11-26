import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StGilesQuoteCalculatorComponent } from './st-giles-quote-calculator.component';
import { scrollToRouteFragment } from './st-giles-fragment';
import {
  ST_GILES_CAMPUS_PROFILES,
  ST_GILES_COMMON_FAQ,
  ST_GILES_COMPARE_ROWS,
  ST_GILES_CONSULTANTS,
  ST_GILES_CONTACT,
  ST_GILES_FAMILY_ROWS,
  ST_GILES_HUB,
  ST_GILES_HUB_NAV,
  ST_GILES_HUB_VIDEOS,
  ST_GILES_JUNIOR_FAQ,
  ST_GILES_JUNIOR_GALLERY,
  ST_GILES_JUNIOR_NOTES,
  ST_GILES_SECTIONS,
  ST_GILES_SERVICE,
  ST_GILES_TRUST,
  stGilesCardPrice,
  stGilesJuniorCards,
} from './st-giles-page-content';
import { ST_GILES_CAMPUSES, ST_GILES_CAMPUS_ORDER, ST_GILES_JUNIOR_CENTRES } from './st-giles-pricing';

/** St Giles overview: the five UK campuses (each with its own page), junior summer centres and family courses. */
@Component({
  selector: 'app-st-giles-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, StGilesQuoteCalculatorComponent],
  // <app-cia-school> is a styling wrapper targeted by the shared school-detail rules in styles.css.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './st-giles-hub.component.html',
  styleUrls: [
    '../../../philippines/cebu-school-detail-layout.css',
    '../../../philippines/cebu-school-detail-content.css',
    '../../../philippines/cebu-school-detail-responsive.css',
    '../../../philippines/ev-school/ev-school-detail.component.css',
    './st-giles-page.css',
  ],
})
export class StGilesHubComponent {
  readonly hub = ST_GILES_HUB;
  readonly sections = ST_GILES_SECTIONS;
  readonly trust = ST_GILES_TRUST;
  readonly nav = ST_GILES_HUB_NAV;
  readonly videos = ST_GILES_HUB_VIDEOS;
  readonly compareRows = ST_GILES_COMPARE_ROWS;
  readonly familyRows = ST_GILES_FAMILY_ROWS;
  readonly juniorCards = stGilesJuniorCards(ST_GILES_JUNIOR_CENTRES);
  readonly juniorNotes = ST_GILES_JUNIOR_NOTES;
  readonly juniorGallery = [
    ...ST_GILES_CAMPUS_PROFILES.cambridge.gallery.filter(image => image.category === '青少年夏校').slice(0, 3),
    ...ST_GILES_JUNIOR_GALLERY.slice(0, 3),
  ];
  readonly faqs = [...ST_GILES_JUNIOR_FAQ, ...ST_GILES_COMMON_FAQ];
  readonly service = ST_GILES_SERVICE;
  readonly contact = ST_GILES_CONTACT;
  readonly consultants = ST_GILES_CONSULTANTS;
  readonly campuses = ST_GILES_CAMPUS_ORDER.map(id => {
    const profile = ST_GILES_CAMPUS_PROFILES[id];
    const hero = profile.gallery.find(image => image.src.endsWith(`/${profile.heroPhoto}.jpg`)) ?? profile.gallery[0];
    return {
      id,
      name: profile.name,
      nameEn: profile.nameEn,
      text: profile.cardText,
      image: hero,
      tags: [`${ST_GILES_CAMPUSES[id].minAge}岁以上`, ...profile.tags.slice(1, 3).map(tag => tag.text)],
      price: stGilesCardPrice(id),
      link: `/overseas-study-tour/uk/st-giles/${id}`,
    };
  });

  constructor() {
    scrollToRouteFragment();
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
