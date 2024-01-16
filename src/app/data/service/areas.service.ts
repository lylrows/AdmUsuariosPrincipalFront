import { AreaQueryFilter } from './../schema/Areas/AreaQueryFilter';
import { Result } from './../schema/result';
import { environment } from 'environments/environment';
import { Areas, FilterArea,FilterAreaGerencias } from './../schema/areas';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})

export class AreaService {
    private apiController = '/Areas';
    constructor(private httpClient: HttpClient) { }

    getPagination(filter: AreaQueryFilter): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/get`, filter);
    }

    getAll(): Observable<Result>{ 
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getAll`);
    }

    getById(id: number): Observable<Result>{
        return this.httpClient.get<Result>(`${this.apiController}/getById/${id}`);
    }

    getByEmpresa(dto: FilterArea): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getbyempresa`, dto);
    }

    add(item: Areas): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/add`, item);
    }

    update(item: Areas): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/edit`, item);
    }

    delete(id: number): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/delete/${id}`, id);
    }

    validar(id: number, active: boolean): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/validar/${id}/${active}`, id);
    }
    getByCompany(idCompany:number): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getareabycompany/${idCompany}`);
    }
    
    getManagementByCompany(idCompany:number): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getmanagementbycompany/${idCompany}`);
    }

    getByManagement(idCompany:number): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getareabymanagement/${idCompany}`);
    }

    getSubareaByIdArea(idArea:number): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getsubareabyidarea/${idArea}`);
    }

    getAreaByIdUser(idUser:number): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getareabyiduser/${idUser}`);
    }

    getGerenciasByUser(payload): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getgerenciasbyuser`, payload);
    }

    getSubAreasByArea(payload): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getsubareasbyarea`, payload);
    }

    getSubAreasByAreaMultiple(payload): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getsubareasbyareamultiple`, payload);
    }
    
    getCompanyByUser(payload): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getcompanybyuser`, payload);
    }

    getGerenciasByUserEvaluation(payload): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getgerenciasbyuserevaluation`, payload);
    }

    getAreasbyGerenciaEvaluation(payload): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getareasbygerenciaevaluation`, payload);
    }

    getSubAreasbyAreaEvaluation(payload): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getsubareasbyareaevaluation`, payload);
    }

    getGerenciasByCompany(payload): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getgerenciasbycompany`, payload);
    }

    getJefesByArea(payload): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getjefesbyarea`, payload);
    }

}