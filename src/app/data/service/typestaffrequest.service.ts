import { environment } from "./../../../environments/environment";
import { Result } from "./../schema/result";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TypeStaffRequest } from "../schema/StaffRequest/TypeStaffRequest";
import { TypeStaffRequestQueryFilter } from "../schema/StaffRequest/TypeStaffRequestQueryFilter";

@Injectable({ providedIn: "root" })
export class TypeStaffRequestService {
  private apiController = "/TypeStaffRequest";

  constructor(private httpClient: HttpClient) {}

  getbyid(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getbyid/${id}`
    );
  }

  add(item: TypeStaffRequest): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/add`,
      item
    );
  }

  update(item: TypeStaffRequest): Observable<Result> {
    return this.httpClient.put<Result>(
      `${environment.apiURL}${this.apiController}/edit`,
      item
    );
  }

  getAll(filter: TypeStaffRequestQueryFilter): Observable<Result>{
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getlistpagination`, filter);
  }

  getForSelect(): Observable<Result>{
    return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getforselect`);
  }

  getonlyenabled(): Observable<Result>{
    return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getonlyenabled`);
  }

  getCampañaNuevabyid(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/StaffRequest/getrequestcapacitacionnuevaById/${id}`
    );
  }
}
