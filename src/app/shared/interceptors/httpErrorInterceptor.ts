import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(public _router: Router, public _injector: Injector, private snack: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        // Operation failed; error is an HttpErrorResponse
        (error: HttpErrorResponse) => {
          
          if (error.status === 401) {
            this.snack.open('Se cerraron todas las sesiones activas o su sesión expiró, por favor, volver a ingresar', "Error", { duration: 4000 });

            this._router.navigate(['/sessions/signin']);
          } else {
            this.snack.open('Ocurrió un error durante el proceso, intente nuevamente.', "Error", { duration: 4000 });
          }
        }
      )
    );
  }
}
