import { Result } from './../schema/result';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class UtilService {
    
    private apiController = '/Util';
    constructor(
        private _http: HttpClient
    ){}

    getDepartament(): Observable<any[]>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/departament`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getProvince(Id : number): Observable<any[]> {
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/province/${Id}`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getDistrit(Id : number): Observable<any[]> {
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/district/${Id}`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getSex(): Observable<any[]>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/sex`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }
   
    getTypeDocument(): Observable<any[]>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/gettypedocument`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getNationality(): Observable<any[]>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/nacionality`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getCivil(): Observable<any[]>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/civil`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getActive(): Observable<any[]>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/active`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getCostCenter(idCompany): Observable<any[]>{
        
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/constcenter/${idCompany}`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getArea(): Observable<any[]>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/area`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getStateEmployee(): Observable<any[]>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/state`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getPayroll(): Observable<any[]>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/payroll`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getCharger(): Observable<any[]>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/charger`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getInfoPruebaMultitest(item): Observable<Result>{
        return this._http.post<Result>(`${environment.apiURL}${this.apiController}/getInfoMultitest`, item);
      }

    getCategoryEmployment(): Observable<any>{
        return this._http.get<any[]>(`${environment.apiURL}${this.apiController}/getCategoryEmployment`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getexactusabsencetype(): Observable<Result> {
        return this._http.get<Result>(`${environment.apiURL}${this.apiController}/getexactusabsencetype`);
    }
    getexactusactiontype(): Observable<Result> {
        return this._http.get<Result>(`${environment.apiURL}${this.apiController}/getexactusactiontype`);
    }
    getexactusfamilytype(): Observable<Result> {
        return this._http.get<Result>(`${environment.apiURL}${this.apiController}/getexactusfamilytype`);
    }
    
    getLanguages(idPerson): Observable<Result> {
        return this._http.get<Result>(`${environment.apiURL}${this.apiController}/getlanguagepostulant/${idPerson}`);
    }

    getexactusemptable(dtofilter): Observable<Result> {
        return this._http.post<Result>(`${environment.apiURL}${this.apiController}/getexactusemptable`, dtofilter);
    }

    downloadDocumentByPath(item): Observable<Result>{
        return this._http.post<Result>(`${environment.apiURL}${this.apiController}/downloadbypath`, item);
      }
}