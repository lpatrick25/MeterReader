import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private storage: Storage,
    private router: Router
  ) {
    this.storage.create();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.storage.get('auth-token')).pipe(
      switchMap(token => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // Token expired or invalid
              this.handleAuthError();
            }
            return throwError(() => error);
          })
        );
      })
    );
  }

  private async handleAuthError() {
    await this.storage.remove('auth-token');
    this.router.navigate(['/login']);
    // If you have a toast or alert service, you could also show a message:
    // this.toastService.show('Session expired. Please log in again.', 'warning');
  }
}
