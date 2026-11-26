import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

/**
 * The app router does not scroll to #fragments, so links such as /st-giles#junior (from the UK list and
 * the campus pages) scroll here. Call it from a component constructor.
 */
export function scrollToRouteFragment(): void {
  inject(ActivatedRoute).fragment.pipe(takeUntilDestroyed()).subscribe(fragment => {
    if (!fragment) return;
    const scroll = () => document.getElementById(fragment)?.scrollIntoView({ block: 'start' });
    setTimeout(() => {
      scroll();
      // Images above the target can still change its position; follow it unless the reader has scrolled.
      const position = window.scrollY;
      setTimeout(() => { if (window.scrollY === position) scroll(); }, 700);
    }, 80);
  });
}
