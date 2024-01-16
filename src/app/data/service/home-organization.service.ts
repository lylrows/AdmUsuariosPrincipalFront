import { environment } from 'environments/environment';
import { Organization } from './../schema/organization';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationQueryFilter } from "../schema/home/OrganizationQueryFilter";
import { Result } from "../schema/result";

@Injectable({
  providedIn: 'root'
})
export class HomeOrganizationService {
  private apiController = '/Organization';
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Organization[]>{
    return this.httpClient.get<Organization[]>(`${environment.apiURL}${this.apiController}/get`);
  }

  getById(id: number): Observable<Organization>{
      return this.httpClient.get<Organization>(`${this.apiController}/getById/${id}`);
  }

  getCampaingBorrador(id: number): Observable<any>{
    return this.httpClient.get<any>(`${environment.apiURL}/Campaign/getcampaingborrador/${id}`);
}

  add(item: Organization): Observable<boolean> {
      return this.httpClient.post<boolean>(`${environment.apiURL}${this.apiController}/add`, item);
  }

  update(item: Organization): Observable<boolean> {
      return this.httpClient.post<boolean>(`${environment.apiURL}${this.apiController}/edit`, item);
  }

  delete(id: number): Observable<Organization>{
      return this.httpClient.get<Organization>(`${environment.apiURL}${this.apiController}/delete/${id}`);
  }
  getListPagination(item: OrganizationQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getlistpagination`,
      item
    );
  }

  GetCampaingEvaluationAlert(id: number): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiURL}/Campaign/getcampaingevaluationalert/${id}`);
  }


}
