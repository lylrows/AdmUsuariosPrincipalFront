import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { environment } from "@env";
import { Observable, ReplaySubject } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class RecruitMentAreaService {
  private apiController = "/RecruitmentArea";

  constructor(private _http: HttpClient) {}

  GetArea(): Observable<any> {
    return this._http.get<any>(
      `${environment.apiURL}${this.apiController}/getlistforselect/`
    );
  }
}
