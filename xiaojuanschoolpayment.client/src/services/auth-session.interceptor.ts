import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Signs the browser out when the server rejects a sent bearer token, e.g. after it expired,
 * the password changed, or the employee type changed. Requests without a token (such as a
 * failed login) are left alone so their own error messages still show.
 */
@Injectable()
export class AuthSessionInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: unknown) => {
        if (
          error instanceof HttpErrorResponse
          && error.status === 401
          && request.headers.has('Authorization')
        ) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (!this.router.url.startsWith('/login')) {
            void this.router.navigate(['/login']);
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
