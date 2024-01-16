import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from "rxjs/operators";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private countRequest = 0;
  private idMessage: string;
  constructor(public spinner: NgxSpinnerService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.countRequest) {
        this.spinner.show();
      }
      this.countRequest++;
      return next.handle(req)
        .pipe(
          finalize(() => {
            this.countRequest--;
            if (!this.countRequest) {
              this.spinner.hide();
            }
          })
        );
  }
}
