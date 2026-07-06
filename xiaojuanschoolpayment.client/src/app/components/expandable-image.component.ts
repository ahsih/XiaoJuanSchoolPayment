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
  @Input() alt = '';
  @Input() title = '';
  @Input() caption = '';
  @Input() disabled = false;
  @Input() previewHeight = '';
  @Input() previewMinHeight = '';
  @Input() previewFit = '';

  protected isOpen = false;

  private readonly document = inject(DOCUMENT);
  private previousBodyOverflow = '';

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  ngOnDestroy(): void {
    this.restoreBodyScroll();
  }

  open(): void {
    if (this.disabled || !this.src) {
      return;
    }

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

  private restoreBodyScroll(): void {
    this.document.body.style.overflow = this.previousBodyOverflow;
  }
}
