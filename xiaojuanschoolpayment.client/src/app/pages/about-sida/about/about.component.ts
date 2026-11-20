import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BRAND_ABOUT_PATH, renderBrandFactsHtml } from './brand-facts';

/**
 * 关于思达启航. Renders the same HTML the server already puts in the page source for this route
 * (see brand-facts.ts), so visitors, crawlers and AI tools read identical text.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
})
export class AboutComponent {
  private readonly router = inject(Router);

  // Trusted: built in this repository from constant data, every value HTML-escaped.
  readonly html = inject(DomSanitizer).bypassSecurityTrustHtml(renderBrandFactsHtml());

  /** Same-site links in the static HTML go through the router instead of reloading the app. */
  onClick(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }

    const link = (event.target as HTMLElement | null)?.closest('a');
    const href = link?.getAttribute('href');
    if (!link || !href || link.target || !href.startsWith('/') || href.startsWith('//')) {
      return;
    }

    const [path, hash] = href.split('#');
    if (path === BRAND_ABOUT_PATH && hash) {
      event.preventDefault();
      history.replaceState(null, '', href);
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // /study60/ and other folders under wwwroot are separate static sites outside the Angular router.
    if (path.endsWith('/')) {
      return;
    }

    event.preventDefault();
    void this.router.navigateByUrl(href);
  }
}
