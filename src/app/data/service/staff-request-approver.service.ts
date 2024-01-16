import { environment } from "./../../../environments/environment";
import { Result } from "./../schema/result";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StaffRequestApprover } from "../schema/StaffRequest/StaffRequestApprover";

@Injectable({ providedIn: "root" })
export class StaffRequestApproverService {
  private apiController = "/StaffRequestApprover";

  constructor(private httpClient: HttpClient) {}

  approve(item: StaffRequestApprover): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/approve`,
      item
    );
  }

  reject(item: StaffRequestApprover): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/reject`,
      item
    );
  }

  getAccsesstApprover(id): Observable<Result>{
    return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getaccsess/${id}`);
  }

  getlistbyid(id): Observable<Result>{
    return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getlistbyid/${id}`);
  }

  acceptAdvacement(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/acceptrequestadvament`,
      payload
    );
  }

  rejectAdvacement(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/rejectrequestadvament`,
      payload
    );
  }

  acceptSalary(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/acceptrequestsalary`,
      payload
    );
  }

  rejectSalary(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/rejectrequestsalary`,
      payload
    );
  }

  acceptBurial(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/acceptrequestburial`,
      payload
    );
  }

  rejectBurial(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/rejectrequestburial`,
      payload
    );
  }

  acceptMedico(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/acceptrequestmedical`,
      payload
    );
  }

  rejectMedico(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/rejectrequestmedical`,
      payload
    );
  }

  acceptSure(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/acceptrequestsure`,
      payload
    );
  }

  rejectSure(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/rejectrequestsure`,
      payload
    );
  }

  getdocumentURL(option): Observable<any> {
    return this.httpClient.get(
      `${environment.apiURL}/StaffRequest/getdocumentword/${option}`, )
  }

  registerTypeSure(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/registerrequeschangesure`,
      payload
    );
  }

  acceptTypeSure(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/acceptrequesttypesure`,
      payload
    );
  }

  rejectTypeSure(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/rejectrequesttypesure`,
      payload
    );
  }

  acceptHourExtra(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/acceptrequesthourextra`,
      payload
    );
  }

  rejectHourExtra(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/rejectrequesthourextra`,
      payload
    );
  }

  acceptTrainingNew(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/acceptrequesttrainingnew`,
      payload
    );
  }

  rejectTrainingNew(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/rejectrequesttrainingnew`,
      payload
    );
  }


  acceptTrainingExtra(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/acceptrequesttrainingextra`,
      payload
    );
  }

  rejectTrainingExtra(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/StaffRequest/rejectrequesttrainingextra`,
      payload
    );
  }
  
}
