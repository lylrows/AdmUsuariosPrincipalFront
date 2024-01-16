import { Contact } from "../schema/contact";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ContactQueryFilter } from "../schema/contact/ContactQueryFilter";
import { Result } from "../schema/result";
import { BandBoxQueryFilter } from "../schema/salaryband/BandBoxQueryFilter";
import { EcoConditionQueryFilter } from "../schema/salaryband/EcoConditionQueryFilter";
import { BudgetResumeFilter } from "../schema/salaryband/BudgetResumeFilter";
import { SalaryStructureFilter } from "../schema/salaryband/SalaryStructureFilter";

@Injectable({ providedIn: "root" })
export class SalaryBandService {
  private apiController = "/SalaryBand";
  constructor(private httpClient: HttpClient) {}

  
  getListPaginationBandBox(item: BandBoxQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}${this.apiController}/getlistpaginationbandbox`,
      item
    );
  }
  getGroupCombo(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiURL}${this.apiController}/getsalarygroupcombo`);
  }
  getListGroupSalary(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiURL}${this.apiController}/getlistgroupsalary`);
  }
  //savesalaryband 
  savesalaryband(payload): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiURL}${this.apiController}/savesalaryband`,payload);
  }
  delete(id: number): Observable<Result>{
    return this.httpClient.delete<Result>(`${environment.apiURL}${this.apiController}/delete/${id}`);
  }

  getEcoConditionList(item: EcoConditionQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getecoconditionlist`,item);
  }
  getEcoConditionListXls(item: EcoConditionQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getecoconditionlistxls`,item);
  }

  validExistByGroup(id: number): Observable<Result>{
    return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/validexistbygroup/${id}`);
  }

  getResumeBudget(item: BudgetResumeFilter): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getresumebudget`,item);
  }
  
  getResumeBudgetXls(item: BudgetResumeFilter): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getresumebudgetxls`,item);
  }

  saveEconomicCondition(payload): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiURL}${this.apiController}/saveeconomiccondition`,payload);
  }

  getSalaryStructure(item: SalaryStructureFilter): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getsalarystructure`,item);
  }
  getSalaryStructureXls(item: SalaryStructureFilter): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getsalarystructurexls`,item);
  }

  
  getAreaGroupCombo(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiURL}${this.apiController}/getareagroup`);
  }

  getareacentercost(id: number): Observable<Result>{
    return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getareacentercost/${id}`);
  }
  getareaccbygerencia(id: number): Observable<Result>{
    return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getareaccbygerencia/${id}`);
  }
  
  getSalaryStructureExportXls(item: SalaryStructureFilter): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getsalarystructureexportxls`,item);
  }

  getEcoConditionExportXls(item: EcoConditionQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getecoconditionexportxls`,item);
  }

}
