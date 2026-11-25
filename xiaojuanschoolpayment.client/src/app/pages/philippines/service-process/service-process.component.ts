import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BRAND_SITE_ORIGIN } from '../../about-sida/about/brand-facts';
import { SERVICE_PROCESS, buildServiceProcessHowTo } from './service-process-content';

const HOW_TO_SCRIPT_ID = 'service-process-howto';

@Component({
  selector: 'app-philippines-service-process',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './service-process.component.html',
  styleUrl: './service-process.component.css',
})
export class PhilippinesServiceProcessComponent implements OnInit, OnDestroy {
  /** Page text; edit it in service-process-content.ts. */
  readonly c = SERVICE_PROCESS;

  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    // SeoService owns the shared #seo-json-ld graph; the HowTo lives in its own script so it
    // disappears again when the visitor leaves this page.
    let script = this.document.getElementById(HOW_TO_SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = HOW_TO_SCRIPT_ID;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    // Always the canonical origin, so the prerendered page source carries the real site address.
    script.textContent = JSON.stringify(buildServiceProcessHowTo(BRAND_SITE_ORIGIN));
  }

  ngOnDestroy(): void {
    this.document.getElementById(HOW_TO_SCRIPT_ID)?.remove();
  }
}
