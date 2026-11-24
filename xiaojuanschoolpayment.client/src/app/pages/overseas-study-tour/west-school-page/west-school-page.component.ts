import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Input, PLATFORM_ID, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {
  SIDA_PHILIPPINES_CONSULTANTS,
  SidaConsultant,
  consultantsInTodaysOrder,
} from '../../../components/sida-consultants';
import { WestImage, WestPromo, WestSchoolProfile } from './west-school-profile';

function chinaToday(timestamp = Date.now()): string {
  return new Date(timestamp + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/**
 * Shared page layout for schools outside the Philippines. The school passes its profile and projects its own
 * quote calculator into the quote section (`<div quote>`).
 */
@Component({
  selector: 'app-west-school-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './west-school-page.component.html',
  styleUrls: ['./west-school-page.component.css', './west-school-page-sections.css'],
})
export class WestSchoolPageComponent {
  @Input({ required: true }) profile!: WestSchoolProfile;

  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly today = chinaToday();

  priceTab = 0;
  lightbox: { photos: WestImage[]; index: number } | null = null;

  get p(): WestSchoolProfile {
    return this.profile;
  }

  get activePromos(): WestPromo[] {
    return this.profile.promos.filter(promo => promo.until >= this.today);
  }

  get consultants(): SidaConsultant[] {
    const names: string[] = this.profile.consultants.names;
    return consultantsInTodaysOrder(SIDA_PHILIPPINES_CONSULTANTS.filter(item => names.includes(item.name)), item => item.name);
  }

  get callConsultant(): SidaConsultant | undefined {
    return this.consultants.find(item => !!item.phoneHref);
  }

  get heroPhotos(): WestImage[] {
    return [this.profile.hero.image, ...this.profile.hero.photos];
  }

  daysLeft(promo: WestPromo): number {
    const end = Date.parse(`${promo.until}T00:00:00Z`);
    const now = Date.parse(`${this.today}T00:00:00Z`);
    return Math.max(0, Math.round((end - now) / 86400000));
  }

  go(id: string, event?: Event): void {
    event?.preventDefault();
    if (!this.browser) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openPhotos(photos: WestImage[], index = 0): void {
    if (!photos.length) return;
    this.lightbox = { photos, index: Math.min(Math.max(index, 0), photos.length - 1) };
  }

  closePhotos(): void {
    this.lightbox = null;
  }

  stepPhoto(step: number, event?: Event): void {
    event?.stopPropagation();
    if (!this.lightbox) return;
    const count = this.lightbox.photos.length;
    this.lightbox = { ...this.lightbox, index: (this.lightbox.index + step + count) % count };
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (!this.lightbox) return;
    if (event.key === 'Escape') this.closePhotos();
    if (event.key === 'ArrowRight') this.stepPhoto(1);
    if (event.key === 'ArrowLeft') this.stepPhoto(-1);
  }

  private touchX: number | null = null;

  touchStart(event: TouchEvent): void {
    this.touchX = event.touches[0]?.clientX ?? null;
  }

  touchEnd(event: TouchEvent): void {
    if (this.touchX === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? this.touchX) - this.touchX;
    this.touchX = null;
    if (Math.abs(delta) > 40) this.stepPhoto(delta < 0 ? 1 : -1);
  }
}
