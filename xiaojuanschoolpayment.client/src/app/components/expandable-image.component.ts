import { DOCUMENT, CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnDestroy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expandable-image',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './expandable-image.component.html',
  styleUrl: './expandable-image.component.css',
})
export class ExpandableImageComponent implements OnDestroy {
  @Input({ required: true }) src = '';
  @Input() images: readonly string[] = [];
  @Input() alt = '';
  @Input() title = '';
  @Input() caption = '';
  @Input() imageAlts: readonly string[] = [];
  @Input() imageTitles: readonly string[] = [];
  @Input() imageCaptions: readonly string[] = [];
  @Input() disabled = false;
  @Input() loading: 'eager' | 'lazy' = 'lazy';
  @Input() previewHeight = '';
  @Input() previewMinHeight = '';
  @Input() previewFit = '';

  protected isOpen = false;
  protected activeIndex = 0;

  private readonly document = inject(DOCUMENT);
  private previousBodyOverflow = '';
  private touchStartX: number | null = null;

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    }
  }

  ngOnDestroy(): void {
    this.restoreBodyScroll();
  }

  open(): void {
    if (this.disabled || this.imageSources.length === 0) {
      return;
    }

    this.activeIndex = Math.max(this.imageSources.indexOf(this.src), 0);
    this.previousBodyOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    this.isOpen = true;
  }

  close(event?: Event): void {
    event?.stopPropagation();
    this.isOpen = false;
    this.restoreBodyScroll();
  }

  protected stopClose(event: Event): void {
    event.stopPropagation();
  }

  protected previous(event?: Event): void {
    event?.stopPropagation();

    if (!this.hasMultipleImages) {
      return;
    }

    this.activeIndex =
      (this.activeIndex - 1 + this.imageSources.length) %
      this.imageSources.length;
  }

  protected next(event?: Event): void {
    event?.stopPropagation();

    if (!this.hasMultipleImages) {
      return;
    }

    this.activeIndex = (this.activeIndex + 1) % this.imageSources.length;
  }

  protected startTouch(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  protected endTouch(event: TouchEvent): void {
    if (this.touchStartX === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? this.touchStartX;
    const distance = endX - this.touchStartX;
    this.touchStartX = null;

    if (Math.abs(distance) < 44) {
      return;
    }

    if (distance > 0) {
      this.previous();
    } else {
      this.next();
    }
  }

  protected get imageSources(): readonly string[] {
    const gallery = this.images.filter(Boolean);
    return gallery.length > 0 ? gallery : this.src ? [this.src] : [];
  }

  protected get activeSrc(): string {
    return this.imageSources[this.activeIndex] ?? this.src;
  }

  protected get activeAlt(): string {
    return this.imageAlts[this.activeIndex] ?? this.alt ?? this.activeTitle;
  }

  protected get activeTitle(): string {
    return this.imageTitles[this.activeIndex] ?? this.title;
  }

  protected get activeCaption(): string {
    return this.imageCaptions[this.activeIndex] ?? this.caption;
  }

  protected get hasMultipleImages(): boolean {
    return this.imageSources.length > 1;
  }

  private restoreBodyScroll(): void {
    this.document.body.style.overflow = this.previousBodyOverflow;
  }
}
