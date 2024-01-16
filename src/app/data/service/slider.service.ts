import { environment } from 'environments/environment';
import { Slider } from './../schema/slider';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SliderQueryFilter } from "../schema/home/SliderQueryFilter";
import { Result } from "../schema/result";

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private apiController = '/Slider';
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Slider[]>{
    return this.httpClient.get<Slider[]>(`${environment.apiURL}${this.apiController}/get`);
  }

  getById(id: number): Observable<Slider>{
      return this.httpClient.get<Slider>(`${this.apiController}/getById/${id}`);
  }

  add(item: Slider): Observable<boolean> {
      return this.httpClient.post<boolean>(`${environment.apiURL}${this.apiController}/add`, item);
  }

  update(item: Slider): Observable<boolean> {
      return this.httpClient.post<boolean>(`${environment.apiURL}${this.apiController}/edit`, item);
  }

  delete(id: number): Observable<Slider>{
      return this.httpClient.get<Slider>(`${environment.apiURL}${this.apiController}/delete/${id}`);
  }
  getListPagination(item: SliderQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getlistpagination`,
      item
    );
  }

}
