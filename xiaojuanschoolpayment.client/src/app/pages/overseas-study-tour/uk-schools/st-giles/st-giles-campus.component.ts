import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StGilesQuoteCalculatorComponent } from './st-giles-quote-calculator.component';
import { scrollToRouteFragment } from './st-giles-fragment';
import {
  ST_GILES_CAMPUS_NAV,
  ST_GILES_CAMPUS_VIDEOS,
  ST_GILES_CAMPUS_PROFILES,
  ST_GILES_COMMON_FAQ,
  ST_GILES_CONSULTANTS,
  ST_GILES_CONTACT,
  ST_GILES_HUB,
  ST_GILES_JUNIOR_NOTES,
  ST_GILES_REFERENCE_NOTE,
  ST_GILES_SECTIONS,
  ST_GILES_SERVICE,
  ST_GILES_TRUST,
  StGilesCampusProfile,
  StGilesPhoto,
  StGilesVideo,
  stGilesCardPrice,
  stGilesCourseCards,
  stGilesFamilyCard,
  stGilesFeeRows,
  stGilesHomestayRows,
  stGilesHomestayRules,
  stGilesJuniorCards,
  stGilesOneToOneNote,
  stGilesOneToOneRows,
  stGilesResidenceCards,
  stGilesTierRows,
} from './st-giles-page-content';
import { ST_GILES_CAMPUSES, ST_GILES_CAMPUS_ORDER, ST_GILES_FEES, ST_GILES_ONE_TO_ONE_TIER_LABELS, ST_GILES_TIER_LABELS, StGilesCampusId } from './st-giles-pricing';
import { juniorCentresFor } from './st-giles-quote';

/** One St Giles year-round UK campus; the route's data names the campus. */
@Component({
  selector: 'app-st-giles-campus',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, StGilesQuoteCalculatorComponent],
  // <app-cia-school> is a styling wrapper targeted by the shared school-detail rules in styles.css.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './st-giles-campus.component.html',
  styleUrls: [
    '../../../philippines/cebu-school-detail-layout.css',
    '../../../philippines/cebu-school-detail-content.css',
    '../../../philippines/cebu-school-detail-responsive.css',
    '../../../philippines/ev-school/ev-school-detail.component.css',
    './st-giles-page.css',
  ],
})
export class StGilesCampusComponent {
  readonly sections = ST_GILES_SECTIONS;
  readonly trust = ST_GILES_TRUST;
  readonly referenceNote = ST_GILES_REFERENCE_NOTE;
  readonly juniorNotes = ST_GILES_JUNIOR_NOTES;
  readonly service = ST_GILES_SERVICE;
  readonly contact = ST_GILES_CONTACT;
  readonly consultants = ST_GILES_CONSULTANTS;
  readonly nav = ST_GILES_CAMPUS_NAV;
  readonly tierLabels = ST_GILES_TIER_LABELS;
  readonly oneToOneLabels = ST_GILES_ONE_TO_ONE_TIER_LABELS;
  readonly fees = ST_GILES_FEES;
  readonly campusLinks = ST_GILES_CAMPUS_ORDER.map(id => ({ id, name: ST_GILES_CAMPUS_PROFILES[id].name }));

  campusId: StGilesCampusId = 'london-central';
  profile!: StGilesCampusProfile;
  minAge = 16;
  cardPrice = '';
  courseCards = stGilesCourseCards('london-central');
  tierRows = stGilesTierRows('london-central');
  oneToOneRows = stGilesOneToOneRows('london-central');
  oneToOneNote = '';
  homestayRows = stGilesHomestayRows('london-central');
  homestayRules: string[] = [];
  residenceCards = stGilesResidenceCards('london-central');
  juniorCards = stGilesJuniorCards([]);
  juniorIncludes: string[] = [];
  family = stGilesFamilyCard('london-central');
  feeRows = stGilesFeeRows('london-central');
  faqs: Array<{ title: string; text: string }> = [];
  galleryCategories: string[] = [];
  heroImage!: StGilesPhoto;
  heroStrip: StGilesPhoto[] = [];
  selectedCategory = '全部';
  videos: StGilesVideo[] = [];

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed()).subscribe(data => this.load((data['campus'] as StGilesCampusId) ?? 'london-central'));
    scrollToRouteFragment();
  }

  private load(id: StGilesCampusId): void {
    const profile = ST_GILES_CAMPUS_PROFILES[id] ?? ST_GILES_CAMPUS_PROFILES['london-central'];
    this.campusId = profile.id;
    this.profile = profile;
    this.videos = ST_GILES_CAMPUS_VIDEOS[profile.id] ?? [];
    this.minAge = ST_GILES_CAMPUSES[profile.id].minAge;
    this.cardPrice = stGilesCardPrice(profile.id);
    this.courseCards = stGilesCourseCards(profile.id);
    this.tierRows = stGilesTierRows(profile.id);
    this.oneToOneRows = stGilesOneToOneRows(profile.id);
    this.oneToOneNote = stGilesOneToOneNote(profile.id);
    this.homestayRows = stGilesHomestayRows(profile.id);
    this.homestayRules = stGilesHomestayRules(profile.id);
    this.residenceCards = stGilesResidenceCards(profile.id);
    this.juniorCards = stGilesJuniorCards(juniorCentresFor(profile.id));
    // The hub list mentions Brighton's homestay; on a campus page say only what applies there.
    this.juniorIncludes = ST_GILES_HUB.juniorIncludes.map(item => item.startsWith('住宿和一日三餐')
      ? (profile.id === 'brighton' ? '寄宿家庭和一日三餐' : '住宿和一日三餐') : item);
    this.family = stGilesFamilyCard(profile.id);
    this.feeRows = stGilesFeeRows(profile.id);
    this.faqs = [...profile.faq, ...ST_GILES_COMMON_FAQ];
    this.galleryCategories = ['全部', ...new Set(profile.gallery.map(image => image.category))];
    this.heroImage = this.photo(profile.heroPhoto);
    this.heroStrip = profile.stripPhotos.map(name => this.photo(name));
    this.selectedCategory = '全部';
  }

  /** 全部 shows the first two photos of every category; a category shows all its photos. */
  get filteredGallery(): StGilesPhoto[] {
    const gallery = this.profile.gallery;
    if (this.selectedCategory !== '全部') return gallery.filter(image => image.category === this.selectedCategory);
    return this.galleryCategories.slice(1).flatMap(category => gallery.filter(image => image.category === category).slice(0, 2));
  }

  trackVideo(_index: number, item: StGilesVideo): string {
    return item.id;
  }

  photo(name: string): StGilesPhoto {
    return this.profile.gallery.find(image => image.src.endsWith(`/${name}.jpg`)) ?? this.profile.gallery[0];
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
