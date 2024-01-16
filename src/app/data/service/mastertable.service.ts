import { environment } from 'environments/environment';
import { Mastertable } from './../schema/mastertable';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from './../schema/result';

@Injectable({
  providedIn: 'root'
})
export class MastertableService {
  private apiController = '/MasterTable';
  constructor(private httpClient: HttpClient) { }
  getByIdFather(id: number, idType: number = 0): Observable<Mastertable[]>{
    return this.httpClient.get<Mastertable[]>(`${environment.apiURL}${this.apiController}/getByIdFather/${id}/${idType}`);
  }
  add(item: Mastertable): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/add`, item);
  }
  delete(id: number): Observable<Result>{
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/delete/${id}`, id);
  }
}
