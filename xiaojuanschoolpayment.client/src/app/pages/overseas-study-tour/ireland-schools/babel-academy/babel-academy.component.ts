import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SIDA_CALLABLE_CONSULTANTS } from '../../../../components/sida-consultants';
import { BabelQuoteCalculatorComponent } from './babel-quote-calculator.component';
import { babelIsBlackFriday } from './babel-pricing';
import {
  BABEL_ACCOMMODATION_NOTES,
  BABEL_ACCOMMODATION_ROWS,
  BABEL_ADVISOR,
  BABEL_BASIC_INFO,
  BABEL_CALENDAR,
  BABEL_COURSE_DETAILS,
  BABEL_DIET_ROWS,
  BABEL_FAQ,
  BABEL_FEE_ROWS,
  BABEL_FIT,
  BABEL_GALLERY,
  BABEL_HIGHLIGHTS,
  BABEL_MOBILE_ANCHORS,
  BABEL_PAGE_COPY,
  BABEL_QUICK_INFO,
  BABEL_REFERENCE_NOTE,
  BABEL_REFUND,
  BABEL_REVIEWS,
  BABEL_SERVICE,
  BABEL_SHORT_COURSE_ROWS,
  BABEL_SIDA_DEPOSIT,
  BABEL_SIDE_NAV,
  BABEL_SUPPORT,
  BABEL_WORK_STUDY_FACTS,
  BABEL_WORK_STUDY_FEE_ROWS,
  BABEL_WORK_STUDY_ROWS,
  BabelGalleryImage,
} from './babel-page-content';

function localToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

@Component({
  selector: 'app-babel-academy',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, BabelQuoteCalculatorComponent],
  // <app-cia-school> is a styling wrapper targeted by the shared school-detail rules in styles.css.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './babel-academy.component.html',
  styleUrls: [
    '../../../philippines/cebu-school-detail-layout.css',
    '../../../philippines/cebu-school-detail-content.css',
    '../../../philippines/cebu-school-detail-responsive.css',
    '../../../philippines/ev-school/ev-school-detail.component.css',
    // The UK/Ireland school pages share Burlington's bt-* rules (scoped by .burlington-page).
    '../../uk-schools/burlington-school/burlington-school.component.css',
    './babel-academy.component.css',
  ],
})
export class BabelAcademyComponent {
  readonly blackFriday = babelIsBlackFriday(localToday());
  readonly copy = BABEL_PAGE_COPY;
  readonly priceCard = this.blackFriday ? BABEL_PAGE_COPY.offerCard : BABEL_PAGE_COPY.priceCard;
  readonly quickInfo = BABEL_QUICK_INFO;
  readonly gallery = BABEL_GALLERY;
  readonly basicInfo = BABEL_BASIC_INFO;
  readonly advisor = BABEL_ADVISOR;
  readonly highlights = BABEL_HIGHLIGHTS;
  readonly fit = BABEL_FIT;
  readonly shortCourses = BABEL_SHORT_COURSE_ROWS;
  readonly courseDetails = BABEL_COURSE_DETAILS;
  readonly workStudyRows = BABEL_WORK_STUDY_ROWS;
  readonly workStudyFacts = BABEL_WORK_STUDY_FACTS;
  readonly workStudyFees = BABEL_WORK_STUDY_FEE_ROWS;
  readonly accommodationRows = BABEL_ACCOMMODATION_ROWS;
  readonly dietRows = BABEL_DIET_ROWS;
  readonly accommodationNotes = BABEL_ACCOMMODATION_NOTES;
  readonly support = BABEL_SUPPORT;
  readonly fees = BABEL_FEE_ROWS;
  readonly calendar = BABEL_CALENDAR;
  readonly refund = BABEL_REFUND;
  readonly sidaDeposit = BABEL_SIDA_DEPOSIT;
  readonly reviews = BABEL_REVIEWS;
  readonly service = BABEL_SERVICE;
  readonly faqs = BABEL_FAQ;
  readonly sideNav = BABEL_SIDE_NAV;
  readonly mobileAnchors = BABEL_MOBILE_ANCHORS;
  readonly referenceNote = BABEL_REFERENCE_NOTE;
  readonly consultant = SIDA_CALLABLE_CONSULTANTS.find(item => item.name === this.advisor.name) ?? SIDA_CALLABLE_CONSULTANTS[0];
  readonly heroImage = this.photo('school-entrance');
  readonly heroStrip = [this.photo('adult-class-teacher'), this.photo('capel-street-class'), this.photo('halloween-party')];

  photo(name: string): BabelGalleryImage {
    return this.gallery.find(image => image.name === name) ?? this.gallery[0];
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
