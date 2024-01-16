import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { InsertRecognition } from "../schema/recognition/insertrecognition";
import { Result } from "../schema/result";

@Injectable({
  providedIn: "root",
})
export class RecognitionService {

    private apiController = '/Recognition';
    constructor(
        private _http: HttpClient
    ){}

    getListRecognition(Id: number, IdUser: number): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}${this.apiController}/${Id}/${IdUser}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }
    
    add(item: InsertRecognition): Observable<Result> {
        return this._http.post<Result>(`${environment.apiURL}${this.apiController}/add`,item);
    }

    changeState(Id: number): Observable<any> {
        return this._http.put<any>(`${environment.apiURL}${this.apiController}/${Id}`, {}).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    delete(Id: number): Observable<any> {
        return this._http.put<any>(`${environment.apiURL}${this.apiController}/delete/${Id}`, {}).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

}
