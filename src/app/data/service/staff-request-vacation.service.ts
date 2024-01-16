import { environment } from "./../../../environments/environment";
import { Result } from "./../schema/result";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StaffRequestVacation } from "../schema/StaffRequest/StaffRequestVacation";

@Injectable({ providedIn: "root" })
export class StaffRequestVacationService {
  private apiController = "/StaffRequestVacation";

  constructor(private httpClient: HttpClient) {}

  getbyid(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getbyid/${id}`
    );
  }

  add(item: StaffRequestVacation): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/add`,
      item
    );
  }

  update(item: StaffRequestVacation): Observable<Result> {
    return this.httpClient.put<Result>(
      `${environment.apiURL}${this.apiController}/edit`,
      item
    );
  }

  registerAdvacement(item): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/insertrequestadvament`,
      item
    );
  }

  registerTrainingNew(item): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/registerrequestrainingnew`,
      item
    );
  }

  registerTrainingExtra(item): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/registerrequestrainingextra`,
      item
    );
  }

  updateTrainingExtra(item): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/updaterequestrainingextra`,
      item
    );
  }

  registerBurial(item): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/registerrequestburial`,
      item
    );
  }

  registerMedical(item): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/registerrequestmedical`,
      item
    );
  }

  registerSalary(item): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/registerrequestsalary`,
      item
    );
  }

  getbyidAdvacement(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getrequestAdvacement/${id}`
    );
  }

  getbyidSure(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getrequestsureById/${id}`
    );
  }

  getbyidAdvacementDetail(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getrequestAdvacementdetail/${id}`
    );
  }

  listbank(): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getlistbank`
    );
  }

  getbyidSalary(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getrequestsalaryById/${id}`
    );
  }

  getbyidBurial(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getrequestburialById/${id}`
    );
  }

  getbyidMedical(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getrequestmedicoById/${id}`
    );
  }

  registerSure(item): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/registerrequessure`,
      item
    );
  }

  getFile(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}${this.apiController}/getpdf/${id}`
    );
  }

  getVacationDayCalculate(item: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.apiURL}${this.apiController}/getvacationday`,item
    );
  }

  getbyidTypeSureDetail(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getrequesttypesureById/${id}`
    );
  }

  getbyidHourExtraDetail(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getrequesthourextraById/${id}`
    );
  }

  registerHourExtra(item): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/registerrequeshourextra`,
      item
    );
  }

  getbyidCampañaNueva(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getrequestcapacitacionnuevaById/${id}`
    );
  }

  getbyidCampañaExtra(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}/StaffRequest/getrequestcapacitacionextraById/${id}`
    );
  }

  GetVacationDays(item): Observable<any> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getvacationsdays`,
      item
    );
  }
}
