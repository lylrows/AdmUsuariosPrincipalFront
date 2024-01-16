import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IPositionList } from "../schema/cargo";
import { IDetailEmployee, IEmployeeFile } from "../schema/employee";
import { IUpdateEmploye } from "../schema/employee/employe-query";
import { ICompanyList } from "../schema/empresa";
import { IListPhone, IPerson } from "../schema/person";
import { RequestQueryFilter } from "../schema/Request/RequestQueryFilter";
import { Result } from "../schema/result";

@Injectable({providedIn: 'root'})
export class EmployeeService {
    
    private apiController = '/Employee';
    constructor(
        private _http: HttpClient
    ){}

    getAll(filter): Observable<any>{
        return this._http.get<any>(`${environment.apiURL}${this.apiController}`, {params: filter});
    }

    
    getAllNoPagination(): Observable<any>{
        return this._http.get<any>(`${environment.apiURL}${this.apiController}/getAllNoPagination`, {});
    }

    getListCompany(): Observable<ICompanyList[]> {
        return this._http.get<ICompanyList[]>(`${environment.apiURL}${this.apiController}/listCompany`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getListPosition(nid_company: number): Observable<IPositionList[]> {
        return this._http.get<IPositionList[]>(`${environment.apiURL}${this.apiController}/listPosition/${nid_company}`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getListPhone(Id: number): Observable<IListPhone[]> {
        return this._http.get<IListPhone[]>(`${environment.apiURL}/Person/Phone/${Id}`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    getPerson(Id: number): Observable<IPerson> {
        return this._http.get<IPerson>(`${environment.apiURL}/Person/${Id}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    getDetailtEmployee(Id: number): Observable<IDetailEmployee> {
        return this._http.get<IDetailEmployee>(`${environment.apiURL}${this.apiController}/detailt/${Id}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    getEmployeeFile(nid_employee: number): Observable<IEmployeeFile> {
        return this._http.get<IEmployeeFile>(`${environment.apiURL}${this.apiController}/file/${nid_employee}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    updateEmploye(id: number, payload: IUpdateEmploye): Observable<any> {
        return this._http.put<any>(`${environment.apiURL}${this.apiController}/${id}`, payload);
    }

    managementPhone(payload): Observable<any> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/phoneMangement`, payload);
    }

    getListAddress(Id: number): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}${this.apiController}/listadress/${Id}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    getListStuden(Id: number): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}${this.apiController}/studenlist/${Id}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    getListInstruccion(): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}${this.apiController}/listinstruccion`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    managementAddress(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/management`,payload);
    }

    deleteStuden(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/studenDelete`,payload);
    }

    InsertStuden(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/studeninsert`,payload);
    }

    UpdateStuden(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/studenUpd`,payload);
    }

    getListSeccion(): any[] {
        return [
            { code: 1, name: 'Datos Personales' },
            { code: 2, name: 'Datos de Estudios' },
            { code: 3, name: 'Datos de Bienestar Social' }
        ]
    }

    getListSeccionDocument(): any[] {
        return [
            { code: 1, name: 'Boleta de Pago' },
            { code: 2, name: 'Certificado de 5ta categoria' },
            { code: 3, name: 'Certificado de Trabajo' },
            { code: 4, name: 'Certificado CTS' },
            { code: 5, name: 'Certificado de Utilidades' }
        ]
    }

    ListSon(id: number): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}${this.apiController}/listson/${id}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    downloadCV(payload:any): Observable<any> {
        return this._http.post<any>(`${environment.apiURL}/Request/dowloadcv`, payload).pipe(
            map((resp: any) => {
                return resp;
            })
        )
    }



    InsertSon(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/insertson`,payload);
    }

    UpdateSon(payload): Observable<void> {
        
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/updateson`,payload);
    }

    ListRequest(payload): Observable<any> {
        return this._http.post<any>(`${environment.apiURL}/Request/listrquest`, payload).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    // ListrRequestpagination(filter: RequestQueryFilter): Observable<Result>{
    //     return this._http.post<Result>(`${environment.apiURL}/Request/listrquestpagination`, filter)
       
    // }
    ListrRequestpagination(filter: RequestQueryFilter): Observable<any>{
        return this._http.post<Result>(`${environment.apiURL}/Request/listrquestpagination`, filter).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }
    
    ListRequestByUserpagination(filter: RequestQueryFilter): Observable<any>{
        return this._http.post<Result>(`${environment.apiURL}/Request/listrequestbyuser`, filter)
        .pipe(
            map((resp) => {
              return resp.data;
            })
          );
    }
    

    ListRequestPrint(payload): Observable<any> {
        return this._http.post<any>(`${environment.apiURL}/Request/listrquestprint`, payload).pipe(
            map((resp: any) => {
                return resp;
            })
        )
    }
    

    InsertRequestEmployee(payload): Observable<void> {
        
        return this._http.post<any>(`${environment.apiURL}/Request/requestIns`,payload);
    }

    RequestDetail(id: number): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}/Request/${id}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    AcceptRequest(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}/Request/accept`,payload);
    }

    RejectRequest(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}/Request/reject`,payload);
    }

    ListJobs(id: number): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}${this.apiController}/listjob/${id}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    InsertJob(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/insertjob`,payload);
    }

    UpdateJob(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/updatejob`,payload);
    }

    DeleteJob(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/deletejob`,payload);
    }

    ListGeneric(id: number): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}${this.apiController}/listmastertable/${id}`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    ListGenericByKey(key: string): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}${this.apiController}/listmastertablebykey/${key}`).pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        )
    }

    GetByFile(payload): Observable<any> {
        return this._http.post<any>(`${environment.apiURL}/Postulant/getfile`,payload);
    }
    
    UpdateCovidCard(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/updatecovidcard`,payload);
    }

    UpdateFirma(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}${this.apiController}/updatefirma`,payload);
    }

    InsertRequestDocument(payload): Observable<void> {
        return this._http.post<any>(`${environment.apiURL}/Request/insertdocument`, payload );
    }

    ListEmployeeFree(id: number, idEmployee: number): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}/StaffRequest/getemployeeChildren/${id}/${idEmployee}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    ListEmployeeReplacement(id: number): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}/StaffRequest/getEmployeeReplacement/${id}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    // getListBoss(id: number): Observable<any> {
    //     return this._http.get<any>(`${environment.apiURL}${this.apiController}/getbossdropdown/${id}`).pipe(
    //         map((resp: any) => {return resp.data.data;})
    //     )
    // }
    getListBoss(id:number): Observable<Result> {
        return this._http.get<Result>(`${environment.apiURL}${this.apiController}/getbossdropdown/${id}`);
    }
    
    getListMonth(id_tipo_documento: number,nyear:number): Observable<any> {
        return this._http.get<any>(`${environment.apiURL}${this.apiController}/GetMonths/${id_tipo_documento}/${nyear}`).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }

    getRequestById(payload): Observable<any>{
        return this._http.post<Result>(`${environment.apiURL}/Request/RequestSolicitudById`, payload).pipe(
            map((resp: any) => {
                return resp.data;
            })
        )
    }
}