import { Organigram } from './../schema/organigram';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../schema/result';

@Injectable({providedIn: 'root'})

export class OrganigramService {

    private apiController = '/Organigram';

    constructor(private httpClient: HttpClient) { }
    
    getOrganigram(idempresa): Observable<Organigram[]>{
        return this.httpClient.get<Organigram[]>(`${environment.apiURL}${this.apiController}/getorganigram/${idempresa}`);
    }

    getOrganigramCargo(idArea: number, idEmpresa: number, idCargo: number): Observable<Organigram[]>{
        return this.httpClient.get<Organigram[]>(`${environment.apiURL}${this.apiController}/getorganigramcargo/${idArea}/${idEmpresa}/${idCargo}`);
    }
    getOrganigramV2(idempresa): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getorganigramv2/${idempresa}`);
    }
}