import { DOCUMENT } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { ErrorHandler, Injectable, NgModule, inject } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { Observable, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

/** Marker scripts/export-seo-pages.cjs looks for: a prerendered page with it fails the build. */
export const PRERENDER_ERROR_META = 'sida-prerender-error';

/**
 * There is no API while the build prerenders pages, so every request fails at once instead of waiting
 * for the network; pages then show the same fallback text as when the API is unreachable.
 */
@Injectable()
class NoApiWhilePrerenderingInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, _next: HttpHandler): Observable<HttpEvent<unknown>> {
    return throwError(() => new HttpErrorResponse({
      status: 0,
      statusText: 'Not available while prerendering',
      url: request.url,
    }));
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
    { provide: HTTP_INTERCEPTORS, useClass: NoApiWhilePrerenderingInterceptor, multi: true },
    { provide: ErrorHandler, useClass: PrerenderErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
