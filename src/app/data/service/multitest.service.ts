import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class MultitestService {
    constructor(private httpClient: HttpClient) { }

    options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    authenticate(item): Observable<any> {
       return this.httpClient.post<any>(`${environment.apiMultitest}auth/login`, item, this.options);
    }

    getCandidate(dni, processId): Observable<any> {
        return this.httpClient.get<any>(`${environment.apiMultitest}main/resultadoPerfil/proceso/${processId}/dni/${dni}`);
     }
 
     getInforme(ruc, processId, dni, tipoarchivo): Observable<any> {
        return this.httpClient.get<any>(`${environment.apiMultitestPdf}${ruc}/${processId}/0/${dni}/${tipoarchivo}/null/1/1`);
     }
    
}