import { environment } from "./../../../environments/environment";
import { Result } from "./../schema/result";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class StaffRequestAbsenceService {
  private apiController = "/StaffRequestAbsence";

  constructor(private httpClient: HttpClient) {}

  getbyid(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getbyid/${id}`
    );
  }

  add(formdata): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/add`, formdata);
}

  getForSelect(): Observable<Result>{
      return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getforselect`);
  }

  getFile(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}${this.apiController}/getpdf/${id}`
    );
  }
}
