import { environment } from 'environments/environment';
import { Result } from './../schema/result';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class PostulantFileService {
    private apiController = '/PostulantFile';
    constructor(private httpClient: HttpClient) { }

    getexactuspayroll(): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getexactuspayroll`);
    }
    getexactuslocation(): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getexactuslocation`);
    }

    getexactusafp(): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getexactusafp`);
    }
    getexactusbank(): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getexactusbank`);
    }
    

    getinfopersonexactus(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getinfopersonexactus/${id}`);
    }
    saveinformationexactus(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/save`, item);
    }
    sendinfoexactus(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/sendinfoexactus`, item);
    }

}
