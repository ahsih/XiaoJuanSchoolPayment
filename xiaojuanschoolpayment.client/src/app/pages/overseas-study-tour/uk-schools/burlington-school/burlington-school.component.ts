import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SIDA_PHILIPPINES_CONSULTANTS } from '../../../../components/sida-consultants';
import { BurlingtonQuoteCalculatorComponent } from './burlington-quote-calculator.component';
import {
  BURLINGTON_ACCOMMODATION_NOTES,
  BURLINGTON_ADULT_EXTRAS,
  BURLINGTON_ADULT_TIER_ROWS,
  BURLINGTON_ADULT_TIMETABLE,
  BURLINGTON_ADVISOR,
  BURLINGTON_APARTMENT_ROWS,
  BURLINGTON_BASIC_INFO,
  BURLINGTON_CALENDAR,
  BURLINGTON_CASTLE,
  BURLINGTON_FAQ,
  BURLINGTON_FEE_ROWS,
  BURLINGTON_FIT,
  BURLINGTON_GALLERY,
  BURLINGTON_GALLERY_CATEGORIES,
  BURLINGTON_GALLERY_FEATURED,
  BURLINGTON_HIGHLIGHTS,
  BURLINGTON_HOMESTAY_ROWS,
  BURLINGTON_HOMESTAY_SUPPLEMENT_ROWS,
  BURLINGTON_HOMESTAY_VETTING,
  BURLINGTON_JUNIOR_DAY,
  BURLINGTON_JUNIOR_DAY_NOTE,
  BURLINGTON_JUNIOR_PROJECTS,
  BURLINGTON_JUNIOR_SAFETY,
  BURLINGTON_JUNIOR_INCLUDES,
  BURLINGTON_JUNIOR_SEASON_ROWS,
  BURLINGTON_MOBILE_ANCHORS,
  BURLINGTON_ONSITE_ROWS,
  BURLINGTON_PAGE_COPY,
  BURLINGTON_PROGRAMME_CARDS,
  BURLINGTON_QUICK_INFO,
  BURLINGTON_REFERENCE_NOTE,
  BURLINGTON_SERVICE,
  BURLINGTON_SIDE_NAV,
  BURLINGTON_SUMMER_RESIDENCE_INCLUDES,
  BURLINGTON_SUMMER_RESIDENCE_ROOM_ONLY,
  BURLINGTON_VIDEOS,
  BurlingtonGalleryCategory,
  BurlingtonGalleryImage,
} from './burlington-page-content';

@Component({
  selector: 'app-burlington-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, BurlingtonQuoteCalculatorComponent],
  // <app-cia-school> is a styling wrapper targeted by the shared school-detail rules in styles.css.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './burlington-school.component.html',
  styleUrls: [
    '../../../philippines/cebu-school-detail-layout.css',
    '../../../philippines/cebu-school-detail-content.css',
    '../../../philippines/cebu-school-detail-responsive.css',
    '../../../philippines/ev-school/ev-school-detail.component.css',
    './burlington-school.component.css',
  ],
})
export class BurlingtonSchoolComponent {
  readonly copy = BURLINGTON_PAGE_COPY;
  readonly quickInfo = BURLINGTON_QUICK_INFO;
  readonly galleryCategories = BURLINGTON_GALLERY_CATEGORIES;
  readonly gallery = BURLINGTON_GALLERY;
  readonly basicInfo = BURLINGTON_BASIC_INFO;
  readonly advisor = BURLINGTON_ADVISOR;
  readonly highlights = BURLINGTON_HIGHLIGHTS;
  readonly fit = BURLINGTON_FIT;
  readonly programmes = BURLINGTON_PROGRAMME_CARDS;
  readonly juniorIncludes = BURLINGTON_JUNIOR_INCLUDES;
  readonly juniorSeasons = BURLINGTON_JUNIOR_SEASON_ROWS;
  readonly juniorDay = BURLINGTON_JUNIOR_DAY;
  readonly juniorDayNote = BURLINGTON_JUNIOR_DAY_NOTE;
  readonly juniorProjects = BURLINGTON_JUNIOR_PROJECTS;
  readonly juniorSafety = BURLINGTON_JUNIOR_SAFETY;
  readonly referenceNote = BURLINGTON_REFERENCE_NOTE;
  readonly homestayVetting = BURLINGTON_HOMESTAY_VETTING;
  readonly featuredVideos = BURLINGTON_VIDEOS.filter(video => !video.vertical);
  readonly shortVideos = BURLINGTON_VIDEOS.filter(video => video.vertical);
  readonly adultTiers = BURLINGTON_ADULT_TIER_ROWS;
  readonly adultTimetable = BURLINGTON_ADULT_TIMETABLE;
  readonly adultExtras = BURLINGTON_ADULT_EXTRAS;
  readonly onsiteRows = BURLINGTON_ONSITE_ROWS;
  readonly apartmentRows = BURLINGTON_APARTMENT_ROWS;
  readonly homestayRows = BURLINGTON_HOMESTAY_ROWS;
  readonly homestaySupplements = BURLINGTON_HOMESTAY_SUPPLEMENT_ROWS;
  readonly accommodationNotes = BURLINGTON_ACCOMMODATION_NOTES;
  readonly residenceIncludes = BURLINGTON_SUMMER_RESIDENCE_INCLUDES;
  readonly residenceRoomOnly = BURLINGTON_SUMMER_RESIDENCE_ROOM_ONLY;
  readonly castle = BURLINGTON_CASTLE;
  readonly fees = BURLINGTON_FEE_ROWS;
  readonly calendar = BURLINGTON_CALENDAR;
  readonly service = BURLINGTON_SERVICE;
  readonly faqs = BURLINGTON_FAQ;
  readonly sideNav = BURLINGTON_SIDE_NAV;
  readonly mobileAnchors = BURLINGTON_MOBILE_ANCHORS;
  readonly consultant = SIDA_PHILIPPINES_CONSULTANTS.find(item => item.name === this.advisor.name) ?? SIDA_PHILIPPINES_CONSULTANTS[0];
  readonly heroImage = this.photo('campus-courtyard');
  readonly heroStrip = [this.photo('residence-dorm-hero'), this.photo('dining-coffee-bar'), this.photo('castle-exterior')];
  readonly castleImage = this.photo('castle-exterior');

  selectedCategory: BurlingtonGalleryCategory = '全部';

  get filteredGallery(): BurlingtonGalleryImage[] {
    if (this.selectedCategory === '全部') {
      return this.gallery.filter(image => BURLINGTON_GALLERY_FEATURED.some(name => image.src.endsWith(`/${name}.jpg`)));
    }
    return this.gallery.filter(image => image.category === this.selectedCategory);
  }

  photo(name: string): BurlingtonGalleryImage {
    return this.gallery.find(image => image.src.endsWith(`/${name}.jpg`)) ?? this.gallery[0];
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
