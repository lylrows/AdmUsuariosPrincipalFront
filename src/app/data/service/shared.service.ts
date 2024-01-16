import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { Result } from './../schema/result';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class SharedService {
    private apiController = '/Proficiency';
    constructor(private httpClient: HttpClient) { }

    getAll(): Observable<Result>{
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getdropdownlist`);
      }
    
}