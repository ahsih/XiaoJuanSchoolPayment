import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter } from 'rxjs';
import { AuthService } from './auth.service';

/** Query parameter of a consultant's personal link (made in /admin/browse-alerts). */
export const BROWSE_LINK_PARAM = 'vt';
const STORAGE_KEY = 'sida:browse-link';
const OPT_OUT_KEY = 'sida:browse-link-optout';
/** Set by the WeCom chat sidebar, so a consultant who opens a card they sent is not counted as the student. */
const STAFF_KEY = 'sida:browse-staff';
const STAFF_DAYS = 365;
const KEEP_DAYS = 180;
const DAY_MS = 24 * 60 * 60 * 1000;
const CODE_PATTERN = /^[a-z0-9]{8,16}$/;
const EMPLOYEE_ROLES = ['admin', 'manager', 'staff'];

interface StoredBrowseLink {
  code: string;
  savedAt: number;
  noticeShown?: boolean;
}

interface BrowseViewResponse {
  active: boolean;
  consultantName?: string | null;
}

/**
 * Student browse reminders, website side. A consultant sends a student a personal link (?vt=<code>);
 * this remembers the code in the student's browser, removes it from the address bar (so a forwarded
 * page does not carry it) and reports every page the student opens to /browse-alerts/view. The server
 * keeps only school pages and sends the consultant a WeCom reminder. The first time, the student sees a
 * notice saying so and can turn it off. Employees signed in to the back office, and browsers that opened
 * the WeCom chat sidebar (see markStaffBrowser), are never tracked.
 */
@Injectable({ providedIn: 'root' })
export class BrowseAlertTracker {
  /** Emits the consultant's name when the one-time notice should be shown. */
  readonly noticeRequested = new Subject<string>();

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private started = false;
  private lastPath = '';
  private lastReportedAt = 0;

  start(): void {
    if (!this.isBrowser || this.started) {
      return;
    }
    this.started = true;
    this.captureLinkCode();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.report(event.urlAfterRedirects));
    if (this.router.navigated) {
      this.report(this.router.url);
    }
  }

  /** "知道了" on the notice. */
  acknowledge(): void {
    const stored = this.read();
    if (stored) {
      this.write({ ...stored, noticeShown: true });
    }
  }

  /** "不用提醒顾问" on the notice: forget the link and never track this browser again. */
  optOut(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(OPT_OUT_KEY, String(Date.now()));
    } catch {
      // Storage may be blocked; nothing is tracked then anyway.
    }
  }

  private captureLinkCode(): void {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get(BROWSE_LINK_PARAM);
    if (raw === null) {
      return;
    }

    url.searchParams.delete(BROWSE_LINK_PARAM);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);

    const code = raw.trim().toLowerCase();
    if (!CODE_PATTERN.test(code) || this.isEmployee() || this.optedOut()) {
      return;
    }
    const stored = this.read();
    if (stored?.code !== code) {
      this.write({ code, savedAt: Date.now() });
    }
  }

  private report(url: string): void {
    const stored = this.read();
    if (!stored || this.isEmployee()) {
      return;
    }

    const path = normalizePath(url);
    const now = Date.now();
    if (path === this.lastPath && now - this.lastReportedAt < 5000) {
      return;
    }
    this.lastPath = path;
    this.lastReportedAt = now;

    this.http.post<BrowseViewResponse>('/browse-alerts/view', { code: stored.code, path }).subscribe({
      next: (response) => {
        if (!response?.active) {
          this.forget(stored.code);
          return;
        }
        const current = this.read();
        if (current?.code === stored.code && !current.noticeShown && response.consultantName) {
          this.write({ ...current, noticeShown: true });
          this.noticeRequested.next(response.consultantName);
        }
      },
      error: () => undefined,
    });
  }

  private read(): StoredBrowseLink | null {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as StoredBrowseLink | null;
      if (!value || typeof value.code !== 'string' || !CODE_PATTERN.test(value.code)) {
        return null;
      }
      if (!Number.isFinite(value.savedAt) || Date.now() - value.savedAt > KEEP_DAYS * DAY_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return value;
    } catch {
      return null;
    }
  }

  private write(value: StoredBrowseLink): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Private mode or blocked storage: the link then works only for this page view.
    }
  }

  private forget(code: string): void {
    if (this.read()?.code === code) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }

  private optedOut(): boolean {
    try {
      const at = Number(localStorage.getItem(OPT_OUT_KEY));
      return Number.isFinite(at) && at > 0 && Date.now() - at < KEEP_DAYS * DAY_MS;
    } catch {
      return false;
    }
  }

  private isEmployee(): boolean {
    try {
      const staffAt = Number(localStorage.getItem(STAFF_KEY));
      if (Number.isFinite(staffAt) && staffAt > 0 && Date.now() - staffAt < STAFF_DAYS * DAY_MS) {
        return true;
      }
      return this.auth.getRoles().some((role) => EMPLOYEE_ROLES.includes(role.toLowerCase()));
    } catch {
      return false;
    }
  }
}

/**
 * Marks this browser as a consultant's (the WeCom chat sidebar calls it): links opened here, such as a
 * card the consultant just sent, are never counted as the student's views.
 */
export function markStaffBrowser(): void {
  try {
    localStorage.setItem(STAFF_KEY, String(Date.now()));
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Blocked storage: nothing can be tracked in this browser anyway.
  }
}

function normalizePath(url: string): string {
  const path = url.split(/[?#]/)[0] || '/';
  return path.length > 1 ? path.replace(/\/+$/, '') : '/';
}
