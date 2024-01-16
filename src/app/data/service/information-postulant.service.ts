import { environment } from 'environments/environment';
import { Result } from './../schema/result';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class InformationPostulantService {
    private apiController = '/InformationPostulant';
    constructor(private httpClient: HttpClient) { }

    getInfoPerson(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getinfoperson/${id}`);
    }

    getInfoAll(id, idEvaluation): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getinfoall/${id}/${idEvaluation}`);
    }

    getInfoAllByPerson(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getinfoallbyperson/${id}`);
    }

    saveinformation(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/save`, item);
    }

    saveAditionalDocuments(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/saveaditionaldocuments`, item);
    }

    saveinformationEducation(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/saveinformationeducation`, item);
    }
    saveinformationwork(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/saveinformationwork`, item);
    }
    
    saveinformationlang(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/saveinformationlang`, item);
    }

    
    saveinformationfamily(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/saveinformationfamily`, item);
    }
   
    saveinformationSkills(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/saveinformationskills`, item);
    }
    
    getInfoEducation(id, idEvaluation): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getinfoeducation/${id}/${idEvaluation}`);
    }
    getInfoWork(id, idEvaluation): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getinfowork/${id}/${idEvaluation}`);
    }
    

    getInfoLang(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getinfolang/${id}`);
    }

    getInfoFamily(id, idEvaluation): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getinfofamily/${id}/${idEvaluation}`);
    }

    getInfoSkills(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getinfoskills/${id}`);
    }

    saveinformationfiles(param): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/saveinformationfiles`, param);
    }
    
    SavePostulantRequest(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/savepostulantrequest`, item);
    }
    
    GetPostulantRequest(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getpostulantrequest`, item);
    }
    
    SaveInformationInternalExactus(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/saveinformationinternalexactus`, item);
    }
    
    GetInformationInternalExactus(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getinformationinternalexactus`, item);
    }
}