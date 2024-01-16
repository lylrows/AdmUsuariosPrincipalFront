import { environment } from "./../../../environments/environment";
import { Result } from "./../schema/result";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StaffRequestLoan } from "../schema/StaffRequest/StaffRequestLoan";

@Injectable({ providedIn: "root" })
export class StaffRequestLoanService {
  private apiController = "/StaffRequestLoan";

  constructor(private httpClient: HttpClient) {}

  getbyid(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getbyid/${id}`
    );
  }

  add(formData): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/add`, formData);
  }

  update(formData): Observable<Result> {
    
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/update`, formData);
  }

  getForSelect(): Observable<Result>{
      return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getforselect`);
  }

  getFile(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}${this.apiController}/getpdf/${id}`
    );
  }

  calculatetimeline(formData): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiURL}${this.apiController}/calculatetimeline`, formData);
  }
}
