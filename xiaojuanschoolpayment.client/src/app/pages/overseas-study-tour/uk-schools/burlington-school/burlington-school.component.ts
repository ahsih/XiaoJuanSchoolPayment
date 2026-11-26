import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BurlingtonQuoteCalculatorComponent } from './burlington-quote-calculator.component';
import {
  BURLINGTON_ACCOMMODATION_NOTES,
  BURLINGTON_ADULT_COURSE_TYPES,
  BURLINGTON_ADULT_NOTES,
  BURLINGTON_ADULT_TIER_ROWS,
  BURLINGTON_ADULT_TIMETABLE,
  BURLINGTON_ADVISOR,
  BURLINGTON_AGE_STAY,
  BURLINGTON_APARTMENT_ROWS,
  BURLINGTON_BASIC_INFO,
  BURLINGTON_CASTLE,
  BURLINGTON_CONSULTANTS,
  BURLINGTON_DINING,
  BURLINGTON_DINING_STRIP,
  BURLINGTON_FAQ,
  BURLINGTON_FEE_ROWS,
  BURLINGTON_FIT,
  BURLINGTON_GALLERY,
  BURLINGTON_GALLERY_CATEGORIES,
  BURLINGTON_GALLERY_FEATURED,
  BURLINGTON_HIGHLIGHTS,
  BURLINGTON_HOMESTAY_ROWS,
  BURLINGTON_HOMESTAY_SUPPLEMENT_ROWS,
  BURLINGTON_HOMESTAY_TYPES,
  BURLINGTON_HOMESTAY_VETTING,
  BURLINGTON_JUNIOR_DAY,
  BURLINGTON_JUNIOR_DAY_NOTE,
  BURLINGTON_JUNIOR_INCLUDES,
  BURLINGTON_JUNIOR_NOTE,
  BURLINGTON_JUNIOR_PROJECT_NOTE,
  BURLINGTON_JUNIOR_PROJECTS,
  BURLINGTON_JUNIOR_SAFETY,
  BURLINGTON_JUNIOR_SEASON_ROWS,
  BURLINGTON_LABELS,
  BURLINGTON_MOBILE_ANCHORS,
  BURLINGTON_ONSITE_ROWS,
  BURLINGTON_PAGE_COPY,
  BURLINGTON_PROGRAMME_CARDS,
  BURLINGTON_REFERENCE_NOTES,
  BURLINGTON_SECTIONS,
  BURLINGTON_SERVICE,
  BURLINGTON_SIDE_NAV,
  BURLINGTON_SUMMER_RESIDENCE_EXTRAS,
  BURLINGTON_SUMMER_RESIDENCE_INCLUDES,
  BURLINGTON_SUMMER_RESIDENCE_TIER_ROWS,
  BURLINGTON_VIDEOS,
  BURLINGTON_ZONES,
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
  readonly sections = BURLINGTON_SECTIONS;
  readonly labels = BURLINGTON_LABELS;
  readonly referenceNotes = BURLINGTON_REFERENCE_NOTES;
  readonly programmes = BURLINGTON_PROGRAMME_CARDS;
  readonly highlights = BURLINGTON_HIGHLIGHTS;
  readonly fit = BURLINGTON_FIT;
  readonly galleryCategories = BURLINGTON_GALLERY_CATEGORIES;
  readonly gallery = BURLINGTON_GALLERY;
  readonly zones = BURLINGTON_ZONES;
  readonly featuredVideos = BURLINGTON_VIDEOS.filter(video => !video.vertical);
  readonly shortVideos = BURLINGTON_VIDEOS.filter(video => video.vertical);
  readonly adultCourseTypes = BURLINGTON_ADULT_COURSE_TYPES;
  readonly adultTiers = BURLINGTON_ADULT_TIER_ROWS;
  readonly adultNotes = BURLINGTON_ADULT_NOTES;
  readonly adultTimetable = BURLINGTON_ADULT_TIMETABLE;
  readonly ageStay = BURLINGTON_AGE_STAY;
  readonly onsiteRows = BURLINGTON_ONSITE_ROWS;
  readonly apartmentRows = BURLINGTON_APARTMENT_ROWS;
  readonly dining = BURLINGTON_DINING;
  readonly homestayTypes = BURLINGTON_HOMESTAY_TYPES;
  readonly homestayRows = BURLINGTON_HOMESTAY_ROWS;
  readonly homestaySupplements = BURLINGTON_HOMESTAY_SUPPLEMENT_ROWS;
  readonly homestayVetting = BURLINGTON_HOMESTAY_VETTING;
  readonly accommodationNotes = BURLINGTON_ACCOMMODATION_NOTES;
  readonly residenceTiers = BURLINGTON_SUMMER_RESIDENCE_TIER_ROWS;
  readonly residenceIncludes = BURLINGTON_SUMMER_RESIDENCE_INCLUDES;
  readonly residenceExtras = BURLINGTON_SUMMER_RESIDENCE_EXTRAS;
  readonly juniorSeasons = BURLINGTON_JUNIOR_SEASON_ROWS;
  readonly juniorNote = BURLINGTON_JUNIOR_NOTE;
  readonly juniorIncludes = BURLINGTON_JUNIOR_INCLUDES;
  readonly juniorDay = BURLINGTON_JUNIOR_DAY;
  readonly juniorDayNote = BURLINGTON_JUNIOR_DAY_NOTE;
  readonly juniorProjectNote = BURLINGTON_JUNIOR_PROJECT_NOTE;
  readonly juniorProjects = BURLINGTON_JUNIOR_PROJECTS;
  readonly juniorSafety = BURLINGTON_JUNIOR_SAFETY;
  readonly castle = BURLINGTON_CASTLE;
  readonly fees = BURLINGTON_FEE_ROWS;
  readonly basicInfo = BURLINGTON_BASIC_INFO;
  readonly faqs = BURLINGTON_FAQ;
  readonly service = BURLINGTON_SERVICE;
  readonly advisor = BURLINGTON_ADVISOR;
  readonly consultants = BURLINGTON_CONSULTANTS;
  readonly sideNav = BURLINGTON_SIDE_NAV;
  readonly mobileAnchors = BURLINGTON_MOBILE_ANCHORS;
  readonly heroImage = this.photo('campus-courtyard');
  readonly heroStrip = [this.photo('residence-dorm-hero'), this.photo('dining-collage'), this.photo('castle-exterior')];
  readonly diningStrip = BURLINGTON_DINING_STRIP;
  /** Phones show the canteen card at full width, so they get the larger 2 x 2 collage. */
  readonly diningCollage = this.photo('dining-collage');
  readonly castleImage = this.photo('castle-exterior');

  selectedCategory: BurlingtonGalleryCategory = '全部';

  get filteredGallery(): BurlingtonGalleryImage[] {
    if (this.selectedCategory === '全部') {
      return this.gallery.filter(image => BURLINGTON_GALLERY_FEATURED.some(name => image.src.endsWith(`/${name}.jpg`)));
    }
    return this.gallery.filter(image => image.category === this.selectedCategory && !image.coverOnly);
  }

  photo(name: string): BurlingtonGalleryImage {
    return this.gallery.find(image => image.src.endsWith(`/${name}.jpg`)) ?? this.gallery[0];
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
