import { Result } from './../schema/result';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NineBoxQueryFilter } from '../schema/NineBox/NineBoxQueryFilter';

@Injectable({providedIn: 'root'})
export class NineBoxService {
    private apiController = '/NineBox';
    constructor(private httpClient: HttpClient) { }

    getAll(filter:NineBoxQueryFilter): Observable<Result>{
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getAll`, filter);
    }

    // update(item: Cargo): Observable<Result> {
        update(payload): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/edit`, payload);
    }

}



