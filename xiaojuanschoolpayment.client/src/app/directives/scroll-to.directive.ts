import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appScrollTo]',
  standalone: true,
})
export class ScrollToDirective {
  @Input() appScrollTo = '';

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();

    const target = document.getElementById(this.appScrollTo);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
