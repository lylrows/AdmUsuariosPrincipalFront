import { environment } from 'environments/environment';
import { Empresa } from './../schema/empresa';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class EmpresaService {

    private apiController = '/Empresa';

    constructor(private httpClient: HttpClient) { }

    getAll(): Observable<Empresa[]>{
        return this.httpClient.get<Empresa[]>(`${environment.apiURL}${this.apiController}/getempresas`);
    }
    getCompanybyUser(): Observable<Empresa[]>{
        return this.httpClient.get<Empresa[]>(`${environment.apiURL}${this.apiController}/getcompanybyuser`);
    }

    
}