import { environment } from './../../../environments/environment';
import { Result } from './../schema/result';
import { Observable } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filterPostulant } from '../schema/Postulant/filterPostulant';

@Injectable({providedIn: 'root'})
export class EvaluationPostulantInternalService {
    public eventServiceReportIndividual = new EventEmitter();
    private apiController = '/EvaluationPostulantInternal';
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
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getidevaluation/${id}`);
    }

    getEvaluationList(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getevaluationlist`, item);
    }

    updateEvaluation(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updatevaluation`, item);
    }

    updateEvaluationProcess(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updatevaluationprocess`, item);
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

    getEvaluationPosition(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getevaluationposition/${id}`);
    }

    getEvaluationCurriculum(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getevaluationcurriculum/${id}`);
    }

    updateEvaluationPositions(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updatevaluationposition`, item);
    }

    updateEvaluationCurriculum(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updatevaluationcurriculum`, item);
    }

    getEvaluationProficiencyIntern(id, idpostulant, flag): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getevaluationproficiencyintern/${id}/${idpostulant}/${flag}`);
    }

    getEvaluationFortalezasIntern(id, idpostulant): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getevaluationfortalezas/${id}/${idpostulant}`);
    }

    updateEvaluationProficiencyIntern(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updateevaluationproficiencyintern`, item);
    }

    updateEvaluationfortalezasIntern(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updateevaluationrating`, item);
    }

    updateEvaluationLogros(item): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/updatevaluationlogros`, item);
    }

    getEvaluationLogros(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/getevaluationlogros/${id}`);
    }

    generateInforme(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/generateinforme/${id}`);
    }

    generateReportPostulant(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/generatereportpostulant/${id}`);
    }

    GetEvaluationPostulantsAll(filter:filterPostulant): Observable<Result> {
        return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getpostulantsinformation`,filter);
    }
    
    InformationFilesDelete(id): Observable<Result> {
        return this.httpClient.get<Result>(`${environment.apiURL}${this.apiController}/informationfilesdelete/${id}`);
    }
} 