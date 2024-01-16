import { environment } from 'environments/environment';
import { Documento } from './../schema/documentos';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentQueryFilter } from "../schema/home/DocumentQueryFilter";
import { Result } from "../schema/result";

@Injectable({
  providedIn: 'root'
})
export class HomeDocumentosService {
  private apiController = '/Document';
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Documento[]>{
    return this.httpClient.get<Documento[]>(`${environment.apiURL}${this.apiController}/get`);
  }

  getById(id: number): Observable<Documento>{
      return this.httpClient.get<Documento>(`${this.apiController}/getById/${id}`);
  }

  add(item: Documento): Observable<boolean> {
      return this.httpClient.post<boolean>(`${environment.apiURL}${this.apiController}/add`, item);
  }

  update(item: Documento): Observable<boolean> {
      return this.httpClient.post<boolean>(`${environment.apiURL}${this.apiController}/edit`, item);
  }

  delete(id: number): Observable<Documento>{
      return this.httpClient.get<Documento>(`${environment.apiURL}${this.apiController}/delete/${id}`);
  }
  getListPagination(item: DocumentQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getlistpagination`,
      item
    );
  }

}
