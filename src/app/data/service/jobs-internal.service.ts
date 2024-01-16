import { JobQueryFilter } from './../schema/Job/JobQueryFilter';
import { JobInternalQueryFilter } from './../schema/Job/JobInternalQueryFilter';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Result } from './../schema/result';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})

export class JobInternalService {
    private apiController = '/JobInternal';
    constructor(private httpClient: HttpClient) { }
    
    getPagination(filter: JobInternalQueryFilter): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/get`, filter);
    }

    getAreas(): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getareas`);
    }

    getJobById(idjob): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getjobbyid/${idjob}`);
    }


    addJobPostulant(item): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/addJobPostulant`, item);
    }

    validateJobPostulant(iduser, idjob): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/validatejobpostulant/${iduser}/${idjob}`);
    }

    loadCv(item): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/loadcv`, item);
    }

    getCv(): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getcv`);
    }

    deleteCv(): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/deletecv`, {});
    }

    getjobsByUser(filter: JobQueryFilter): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getjobsbyuser`, filter);
    }
}