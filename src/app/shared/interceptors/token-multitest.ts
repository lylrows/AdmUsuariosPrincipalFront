import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";
import { JwtAuthService } from "../services/auth/jwt-auth.service";

@Injectable()
export class TokenMultitestInterceptor implements HttpInterceptor {

  constructor(private jwtAuth: JwtAuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    var token = localStorage.getItem('tokenmultitest');

    var changedReq;

    if (token) {

      changedReq = req.clone({ setHeaders: {Authorization: `Bearer ${token}`},});

    } else {

      changedReq = req;
      
    }

    if (req.body instanceof FormData) {
      //request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data') });            
    }
    else {
      changedReq = changedReq.clone({ setHeaders: {'Content-Type': 'application/x-www-form-urlencoded'},});
    }
    
    changedReq = changedReq.clone({ setHeaders: {'Accept': 'application/x-www-form-urlencoded'},});


    return next.handle(changedReq);
  }
}
