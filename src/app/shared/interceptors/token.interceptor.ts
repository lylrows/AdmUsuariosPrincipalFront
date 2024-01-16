import { environment } from "environments/environment";
import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { JwtAuthService } from "../services/auth/jwt-auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private jwtAuth: JwtAuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    var token = this.jwtAuth.token || this.jwtAuth.getJwtToken();
    var tokenMulti = localStorage.getItem("tokenmultitest");

    var changedReq;

    if (req.url.includes(environment.apiMultitest)) {
      if (tokenMulti) {
        changedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${tokenMulti}` },
        });
      } else {
        changedReq = req;
      }
    } else {
      if (token) {
        changedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      } else {
        changedReq = req;
      }
    }

    if (req.body instanceof URLSearchParams) {
     /* changedReq = changedReq.clone({
        setHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
      });*/
      //request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data') });
    } else if (req.body instanceof FormData) {
    } else {
      changedReq = changedReq.clone({
        setHeaders: { "Content-Type": "application/json" },
      });
    }

    changedReq = changedReq.clone({
      setHeaders: { Accept: "application/json" },
    });

    return next.handle(changedReq);
  }
}
