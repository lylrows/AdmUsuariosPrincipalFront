import { environment } from './../../../environments/environment';
import { Result } from './../schema/result';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class EvaluationPostulantService {
    private apiController = '/EvaluationPostulant';
    constructor(private httpClient: HttpClient) { }

    createEvaluation(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/createevaluation`, item);
    }

    getEvaluation(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getevaluation/${id}`);
    }
    getEvaluationExport(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getevaluationexport/${id}`);
    }

    getIdEvaluation(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getIdEvaluation/${id}`);
    }

    getEvaluationList(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getevaluationlist`, item);
    }

    getInfoPostulant(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getinfopostulant/${id}`);
    }

    createNotes(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/createnotes`, item);
    }

    getNotes(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getnotes/${id}`);
    }
    
    updateEvaluation(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updatevaluation`, item);
    }

    updateEvaluationProcess(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updateevaluationprocess`, item);
    }

    getEvaluationProficiency(id, idpostulant): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getevaluationproficiency/${id}/${idpostulant}`);
    }

    getEvaluationRating(id, idpostulant): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getevaluationrating/${id}/${idpostulant}`);
    }

    updateEvaluationProficiency(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updateevaluationproficiency`, item);
    }

    updateEvaluationRating(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updateevaluationrating`, item);
    }

    loadFiles(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/loaddocuments`, item);
    }

    getDocuments(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getdocuments/${id}`);
    }

    deleteFile(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/deletefile`, item);
    }

    getEvaluationTest(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getevaluationtest/${id}`);
    }

    createEvaluationTest(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/createevaluationtest`, item);
    }

    deleteEvaluationTest(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/deleteevaluationtest`, item);
    }

    generateInforme(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/generateinforme/${id}`);
    }

    generateReportPostulant(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/generatereportpostulant/${id}`);
    }

    getPostulantsLoaded(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getpostulantsloader/${id}`);
    }

    loadMasive(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/loadmasive`, item);
    }

    getJson(): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getjson`);
    }

    deleteEvaluationProficiency(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/deleteevaluationproficiency`, item);
    }
    sendEmailPostulantSelected(item,id): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/sendnotificationsselected/${id}`, item);
    }
    
}