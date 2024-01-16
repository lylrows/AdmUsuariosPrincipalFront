import { UserRequest } from "./../schema/user/UserRequest";
import { UserQueryFilter } from "./../schema/user/UserQueryFIlter";
import { environment } from "./../../../environments/environment";
import { Result } from "./../schema/result";
import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { NotificationQueryFilter } from "../schema/notification/notificationqueryfilter";
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

@Injectable({ providedIn: "root" })
export class NotificationService {
  private apiController = "/Notification";
  public globalUnviewedCount$ = new BehaviorSubject<string>("0");
  public hubConnection: HubConnection;
  emNotifica: EventEmitter<any> = new EventEmitter<any>();

  constructor(private httpClient: HttpClient) { 
    let builder = new HubConnectionBuilder();
    // .withUrl("/chat")
    // .build();
    // Paulo Hub
    this.hubConnection = builder.withUrl(`${environment.apiURL}/cnn`).build();
    this.hubConnection.on("enviar-todos", (mensaje) => {
      
      let art = JSON.parse(mensaje);
      this.emNotifica.emit(art)
    })
    this.hubConnection.start();
  }


  archive(item: any): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/archive`,
      item
    );
  }

  archiveList(item: any[]): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/archivelist`,
      item
    );
  }

  unarchiveList(item: any[]): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/unarchivelist`,
      item
    );
  }

  getArchived(idUser): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getArchived/${idUser}`
    );
  }

  getRecognition(idUser): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getRecognition/${idUser}`
    );
  }

  getBandeja(idUser): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getBandeja/${idUser}`
    );
  }

  getQuantityNotifications(idUser): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getQuantityNotifications/${idUser}`
    );
  }
  

  getBandejaFilter(item: any): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getbandejafilter`,item);
  }

  getBandejaFavorite(idUser): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getBandejaFavorite/${idUser}`
    );
  }

  getAll(filter: NotificationQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getlistpagination`,
      filter
    );
  }

  getById(id: number): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getbyid/${id}`
    );
  }

  add(item: Notification): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/add`,
      item
    );
  }

  update(item: Notification): Observable<Result> {
    return this.httpClient.put<Result>(
      `${environment.apiURL}${this.apiController}/edit`,
      item
    );
  }

  disabled(id: number): Observable<Result> {
    return this.httpClient.put<Result>(
      `${environment.apiURL}${this.apiController}/disabled`,
      id
    );
  }
  addviewed(item: any): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/addviewed`,item);
  }

  

  setUnviewedCountGlobal(val : string){
    this.globalUnviewedCount$.next(val);
  }

  getUnviewedCountGlobal(){
    return this.globalUnviewedCount$.asObservable();
  }

  addNotificationApproved(item: any): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/addnotificationapproved`,
      item
    );
  }
   
  getdocumentbypath(path: string): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getdocumentbypath/${path}`
    );
  }

  AddNotificationNotSselected(item: any): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/addnotificationnoteselected`,
      item
    );
  }

  AddNotificationFichaPersonal(item: any): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/addnotificationfichapersonal`,
      item
    );
  }
}
