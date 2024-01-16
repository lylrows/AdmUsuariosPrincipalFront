import { environment } from "./../../../environments/environment";
import { Result } from "./../schema/result";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Job } from "../schema/postjoboffer/job";

@Injectable({ providedIn: "root" })
export class PostJobOfferService {
  private apiController = "/PostJobOffer";

  constructor(private httpClient: HttpClient) {}

  getbyid(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getbyid/${id}`
    );
  }

  getbyidintern(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getbyidintern/${id}`
    );
  }

  add(item: Job): Observable<Result> {
    
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/add`,
      item
    );
  }

  addInternal(item: Job): Observable<Result> {
    
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/addinternal`,
      item
    );
  }

  update(item: Job): Observable<Result> {
    return this.httpClient.put<Result>(
      `${environment.apiURL}${this.apiController}/edit`,
      item
    );
  }
}
