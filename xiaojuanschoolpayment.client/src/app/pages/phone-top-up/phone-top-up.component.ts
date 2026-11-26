import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PHONE_TOP_UP_COUNTRIES, PHONE_TOP_UP_PAGE, PhoneTopUpCountry } from './phone-top-up-content';

@Component({
  selector: 'app-phone-top-up',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './phone-top-up.component.html',
  styleUrl: './phone-top-up.component.css',
})
export class PhoneTopUpComponent {
  /** Page text; edit it in phone-top-up-content.ts. */
  readonly c = PHONE_TOP_UP_PAGE;
  readonly countries = PHONE_TOP_UP_COUNTRIES;
  readonly copiedId = signal<string | null>(null);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private copiedTimer: ReturnType<typeof setTimeout> | undefined;

  async copyLink(country: PhoneTopUpCountry): Promise<void> {
    if (!this.isBrowser) return;
    let copied = false;
    try {
      await navigator.clipboard.writeText(country.url);
      copied = true;
    } catch {
      // Older WeChat and some in-app browsers block the clipboard API.
      const field = document.createElement('textarea');
      field.value = country.url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      field.remove();
    }
    if (!copied) {
      window.prompt('请长按或手动复制这个链接：', country.url);
      return;
    }
    this.copiedId.set(country.id);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copiedId.set(null), 2000);
  }
}
