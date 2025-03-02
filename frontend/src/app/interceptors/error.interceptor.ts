import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error || 'Bad request';
              break;
            case 404:
              errorMessage = error.error || 'Resource not found';
              break;
            case 500:
              errorMessage = 'Internal server error. Please try again later';
              break;
            default:
              errorMessage = 'Something went wrong. Please try again later';
          }
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}