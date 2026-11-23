import { DOCUMENT } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { ErrorHandler, Injectable, NgModule, inject } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { Observable, catchError, throwError, timeout } from 'rxjs';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

/** Marker scripts/export-seo-pages.cjs looks for: a prerendered page with it fails the build. */
export const PRERENDER_ERROR_META = 'sida-prerender-error';
/** Marker for a page whose live data could not be loaded; scripts/prerender-school-pages.cjs drops it. */
export const PRERENDER_DATA_MISSING_META = 'sida-prerender-data-missing';
/** One per school whose data a page loaded, so the server can tell when the snapshot is out of date. */
export const PRERENDER_SCHOOL_META = 'sida-prerender-school';

/**
 * Where the school-page prerender (scripts/prerender-school-pages.cjs) loads the latest published school
 * data from, for example https://sidaqihang.com. Unset while `ng build` prerenders the other pages.
 */
const API_ORIGIN_VARIABLE = 'SIDA_PRERENDER_API_ORIGIN';
const API_TIMEOUT_MS = 20_000;
const GUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

function apiOrigin(): string | null {
  const value = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[API_ORIGIN_VARIABLE];
  return value && /^https?:\/\/[^/?#]+$/.test(value) ? value : null;
}

/** The path and query of a request for this site's own API, or null for another site. */
function sitePath(url: string): string | null {
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' ? parsed.pathname + parsed.search : null;
  } catch {
    return null;
  }
}

/**
 * While `ng build` prerenders the content pages there is no API, so every request fails at once and pages
 * show the same fallback text as when the API is unreachable. The school-page prerender sets
 * SIDA_PRERENDER_API_ORIGIN: then the site's own read requests go to the live site, so a school page is
 * rendered with its latest published prices. Each page records the schools whose data it loaded, and a
 * failed request marks the page so it is not used; other sites (exchange rates) are never called.
 */
@Injectable()
class PrerenderApiInterceptor implements HttpInterceptor {
  private readonly document = inject(DOCUMENT);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const origin = apiOrigin();
    const path = sitePath(request.urlWithParams);
    if (!origin || !path || request.method !== 'GET') {
      return throwError(() => new HttpErrorResponse({
        status: 0,
        statusText: 'Not available while prerendering',
        url: request.url,
      }));
    }

    // Data read on behalf of a school page, for example ?schoolId=… or /school-content/<id>/published.
    this.recordSchools(path);
    return next.handle(request.clone({ url: origin + path, params: new HttpParams() })).pipe(
      timeout({ first: API_TIMEOUT_MS }),
      catchError((error: unknown) => {
        // 404: the school has nothing published yet, which is the page's real state.
        if (!(error instanceof HttpErrorResponse && error.status === 404)) {
          this.addMeta(PRERENDER_DATA_MISSING_META, path);
        }
        return throwError(() => error);
      }),
    );
  }

  private recordSchools(text: string): void {
    for (const id of text.match(GUID_PATTERN) ?? []) {
      const value = id.toLowerCase();
      if (!this.document.head.querySelector(`meta[name="${PRERENDER_SCHOOL_META}"][content="${value}"]`)) {
        this.addMeta(PRERENDER_SCHOOL_META, value);
      }
    }
  }

  private addMeta(name: string, content: string): void {
    const meta = this.document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    this.document.head.appendChild(meta);
  }
}

/**
 * A page that throws while it is prerendered would ship half-rendered (an error stops the rest of its
 * view), so record the error in the page and let the export script fail the build with its message.
 * Failed API requests are expected here and ignored.
 */
@Injectable()
class PrerenderErrorHandler implements ErrorHandler {
  private readonly document = inject(DOCUMENT);

  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      return;
    }

    console.error('Prerender error:', error);
    const meta = this.document.createElement('meta');
    meta.setAttribute('name', PRERENDER_ERROR_META);
    meta.setAttribute('content', error instanceof Error ? `${error.name}: ${error.message}` : String(error));
    this.document.head.appendChild(meta);
  }
}

/** Build-time prerendering only (src/main.server.ts). */
@NgModule({
  imports: [AppModule, ServerModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: PrerenderApiInterceptor, multi: true },
    { provide: ErrorHandler, useClass: PrerenderErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
