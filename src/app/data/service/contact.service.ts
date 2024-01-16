import { Contact } from "../schema/contact";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ContactQueryFilter } from "../schema/contact/ContactQueryFilter";
import { Result } from "../schema/result";

@Injectable({ providedIn: "root" })
export class ContactService {
  private apiController = "/Contact";
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Contact[]> {
    return this.httpClient.get<Contact[]>(
      `${environment.apiURL}${this.apiController}/get`
    );
  }
  getAllActive(): Observable<Contact[]> {
    return this.httpClient.get<Contact[]>(
      `${environment.apiURL}${this.apiController}/getAllActive`
    );
  }

  getById(id: number): Observable<Contact> {
    return this.httpClient.get<Contact>(`${this.apiController}/getById/${id}`);
  }

  add(item: Contact): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${environment.apiURL}${this.apiController}/add`,
      item
    );
  }

  update(item: Contact): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${environment.apiURL}${this.apiController}/edit`,
      item
    );
  }

  // delete(id: number): Observable<Contact> {
  //   return this.httpClient.post<Contact>(
  //     `${environment.apiURL}${this.apiController}/delete/${id}`,
  //     id
  //   );
  // }

  delete(id: number): Observable<Result>{
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/delete/${id}`, id);
  }


  upload(formdata): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.apiURL}${this.apiController}/UploadFile`,
      formdata,
      {
        reportProgress: true,
      }
    );
  }
  getListPagination(item: ContactQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getlistpagination`,
      item
    );
  }
}
