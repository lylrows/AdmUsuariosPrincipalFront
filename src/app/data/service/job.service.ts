import { JobQueryFilter } from './../schema/Job/JobQueryFilter';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Result } from './../schema/result';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class JobService {
    private apiController = '/Jobs';
    constructor(private httpClient: HttpClient) { }

    getJobsUser(filter: JobQueryFilter): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getlist`, filter);
    }

    getkeyWord(nidJob): Observable<any> {
      return this.httpClient.get<any>(`${environment.apiURL}${this.apiController}/getkeyword/${nidJob}`);
    }

    createKeyWord(keyword: any): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/addkeyword`, keyword);
    }

    deleteKeyWord(keyword: any): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/deletekeyword`, keyword);
    }
}