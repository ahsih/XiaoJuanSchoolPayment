import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ExchangeRateService, isUsableExchangeRates } from '../../../../../services/exchange-rate.service';
import { chinaToday } from '../../../../../services/exchange-rate-rules';
import { SIDA_PHILIPPINES_CONSULTANTS, consultantsInTodaysOrder } from '../../../../components/sida-consultants';
import {
  CEC_CERTIFICATE,
  CEC_GALLERY,
  CEC_HERO_PHOTO,
  CEC_HERO_STRIP,
  CEC_IELTS,
  CEC_MOBILE_ANCHORS,
  CEC_OTHER_COURSES,
  CEC_PAGE_COPY,
  CEC_REFERENCE_NOTE,
  CEC_SERVICE,
  CEC_VIDEOS,
  CEC_WINTER_CAMP,
  CecPhoto,
  cecCurrentTerms,
} from './canadian-education-page-content';

/** Consultants for Southeast Asia study tours (Perrin, Iris, Lisa), in today's rotation order. */
const SOUTHEAST_ASIA_CONSULTANTS = SIDA_PHILIPPINES_CONSULTANTS.filter(item => item.title === '菲律宾与东南亚游学');

@Component({
  selector: 'app-canadian-education-college',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  // <app-cia-school> is a styling wrapper targeted by the shared school-detail rules in styles.css.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './canadian-education-college.component.html',
  styleUrls: [
    '../../../philippines/cebu-school-detail-layout.css',
    '../../../philippines/cebu-school-detail-content.css',
    '../../../philippines/cebu-school-detail-responsive.css',
    '../../../philippines/ev-school/ev-school-detail.component.css',
    './canadian-education-college.component.css',
  ],
})
export class CanadianEducationCollegeComponent {
  readonly copy = CEC_PAGE_COPY;
  readonly gallery = CEC_GALLERY;
  readonly featuredVideos = CEC_VIDEOS.filter(item => !item.vertical);
  readonly shortVideos = CEC_VIDEOS.filter(item => item.vertical);
  readonly certificate = CEC_CERTIFICATE;
  readonly terms = cecCurrentTerms(chinaToday());
  readonly ielts = CEC_IELTS;
  readonly camp = CEC_WINTER_CAMP;
  readonly otherCourses = CEC_OTHER_COURSES;
  readonly service = CEC_SERVICE;
  readonly referenceNote = CEC_REFERENCE_NOTE;
  readonly mobileAnchors = CEC_MOBILE_ANCHORS;
  readonly consultants = consultantsInTodaysOrder(SOUTHEAST_ASIA_CONSULTANTS, item => item.name);
  readonly heroImage = this.photo(CEC_HERO_PHOTO);
  readonly heroStrip = CEC_HERO_STRIP.map(name => this.photo(name));

  /** Renminbi per Singapore dollar from the latest daily reference rate; null until a usable rate arrives. */
  sgdToCny: number | null = null;
  rateDate = '';
  private readonly rates = inject(ExchangeRateService).getLatestCnyRates().pipe(takeUntilDestroyed()).subscribe(snapshot => {
    const rate = snapshot.rates?.['SGD']?.rate;
    const usable = isUsableExchangeRates(snapshot) && typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
    this.sgdToCny = usable ? 1 / rate : null;
    this.rateDate = usable ? snapshot.date : '';
  });

  get rateDateText(): string {
    const [year, month, day] = this.rateDate.split('-').map(Number);
    return year ? `${year}年${month}月${day}日` : '';
  }

  cny(amount: number): string {
    if (this.sgdToCny === null) return '';
    return `约${Math.round(amount * this.sgdToCny).toLocaleString('zh-CN')}元人民币`;
  }

  photo(name: string): CecPhoto {
    return this.gallery.find(image => image.src.endsWith(`/${name}.webp`)) ?? this.gallery[0];
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
