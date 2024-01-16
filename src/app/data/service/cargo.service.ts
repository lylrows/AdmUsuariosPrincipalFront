import { Result } from './../schema/result';
import { Cargo, FilterCargo } from './../schema/cargo';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CargoQueryFilter } from '../schema/Cargo/CargoQueryFilter';
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})

export class CargoService {
    private apiController = '/Cargo';
    constructor(private httpClient: HttpClient) { }

    getPagination(filter: CargoQueryFilter): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/get`, filter);
    }

    getAll(): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getAll`);
    }

    getById(id: number): Observable<Result>{
        return this.httpClient.get<Result>(`${this.apiController}/getById/${id}`);
    }

    getByEmpresa(dto: FilterCargo): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getbyempresa`, dto);
    }

    add(item: any): Observable<any> {
        return this.httpClient.post<any>(`${environment.apiURL}${this.apiController}/add`, item);
    }

    update(item: Cargo): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/edit`, item);
    }

    delete(id: number): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/delete/${id}`, id);
    }

    getJefeByCargo(id: number): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getjefe/${id}`);
    }
    getCompetenciaByCargo(idRequest: number, idCargo: number, primerCarga: number): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getcompetencia/${idRequest}/${idCargo}/${primerCarga}`);
    }

    saveCompetenciaConfig(item: any): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/addconfig`, item);
    }
    getComboCargo(dto: any): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getcombocargo`, dto);
    }

    GetChargesByCompanyArea(payload): Observable<any> {
      return this.httpClient.post<any>(`${environment.apiURL}/Cargo/getchargesbycompanyarea`,payload).pipe(
          map((resp) => {return resp.data;}));
    }
    GetChargesByCompanyAreav2(payload): Observable<any> {
      return this.httpClient.post<any>(`${environment.apiURL}/Cargo/getchargesbycompanyareav2`,payload).pipe(
          map((resp) => {return resp.data;}));
    }
    
    
}