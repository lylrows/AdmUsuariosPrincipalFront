import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { ProfileCode } from "@app/modules/human-management/page/recruitment/enums/cargo.enum";
import { ConfigurationRecruitment } from "@app/modules/human-management/page/recruitment/models/configuration";
import { environment } from "@env";
import { Observable, ReplaySubject } from "rxjs";
import { map } from "rxjs/operators";
import { Result } from "./../schema/result";

export interface Acciones {
  boolNew: boolean;
  boolView: boolean;
  boolClone: boolean;
  boolSAcceptorDecline: boolean;
}

@Injectable({
  providedIn: "root",
})
export class RecruitMentPersonnelService {
  private apiController = "/Request";
  private mensajero = new ReplaySubject<number>(1);

  @Output() disparador: EventEmitter<any> = new EventEmitter();

  constructor(private _http: HttpClient) {}

  getPermissByRol(configuration: ConfigurationRecruitment): Acciones {
    
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const idprofile: number = storage.nid_profile;
    let accions: Acciones = null;
    switch (idprofile) {
      case ProfileCode.APPLICANT: // SOLICITANTE
        accions = {
          boolNew: true,
          boolView: true,
          boolClone: true,
          boolSAcceptorDecline: false,
        };
        break;
      case ProfileCode.AREA: // AREA
        
        if ( idprofile === configuration.nid_originposition ) {
          accions = {
            boolNew: true,
            boolView: true,
            boolClone: true,
            boolSAcceptorDecline: true,
          };
        } else if ( idprofile === configuration.nid_destinationposition )
        {
          accions = {
            boolNew: true,
            boolView: true,
            boolClone: true,
            boolSAcceptorDecline: true,
          };
        }
        break;
      case ProfileCode.CONTROLLER: // CONTROLLER
        
        if ( idprofile === configuration.nid_originposition ) {
          accions = {
            boolNew: true,
            boolView: true,
            boolClone: false,
            boolSAcceptorDecline: true,
          };
        } else if ( idprofile === configuration.nid_destinationposition ) {
          accions = {
            boolNew: true,
            boolView: true,
            boolClone: true,
            boolSAcceptorDecline: true,
          };
        }
      
        break;
      case ProfileCode.RRHH:  // RRHH
        
        if ( idprofile === configuration.nid_originposition ) {
          accions = {
            boolNew: true,
            boolView: true,
            boolClone: true,
            boolSAcceptorDecline: true,
          };
        } else if ( idprofile === configuration.nid_destinationposition ) {
          accions = {
            boolNew: true,
            boolView: true,
            boolClone: true,
            boolSAcceptorDecline: true,
          };
        }
        break;
      default:
        accions = {
          boolNew: true,
          boolView: true,
          boolClone: false,
          boolSAcceptorDecline: true,
        };
        break;
    }
    return accions;
  }

  getRecruitMentPersonnel(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/getlistpagination`,
        payload
      )
      .pipe(
        map((resp: any) => {
          return resp.data;
        })
      );
  }

  GetEmployeeChargeByUser(): Observable<any> {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const idUser: number = storage.id;
    return this._http.get<any>(
      `${environment.apiURL}${this.apiController}/getemployeechargebyuser/${idUser}`
    );
  }

  GetRequestFlow(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.apiURL}${this.apiController}/getrequestflow/${id}`
    );
  }

  GetRequestFlowConfiguration(
    IdOrigin: number,
    IdNivel: number
  ): Observable<any> {
    return this._http
      .get<any>(
        `${environment.apiURL}${this.apiController}/gestconfiguration/${IdOrigin}/${IdNivel}`
      )
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  getrequestById(id: number): Observable<any> {
    return this._http
      .get<any>(
        `${environment.apiURL}${this.apiController}/getrequestById/${id}`
      )
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  Create(payload): Observable<any> {
    
    return this._http.post<any>(
      `${environment.apiURL}${this.apiController}/add`,
      payload
    );
  }

  CreateFlow(payload): Observable<any> {
    return this._http.post<any>(
      `${environment.apiURL}${this.apiController}/addrequestflow`,
      payload
    );
  }

  Update(payload): Observable<any> {
    return this._http.post<any>(
      `${environment.apiURL}${this.apiController}/update`,
      payload
    );
  }

  GetEmployeeChargeByUserId(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.apiURL}${this.apiController}/getemployeechargebyuser/${id}`
    );
  }

  addNotificationApproved(item: any): Observable<Result> {
    
    return this._http.post<Result>(
      `${environment.apiURL}/Notification/addnotificationapproved`,
      item
    );
  }

  UpdatePregrado(payload): Observable<any> {
    
    return this._http.post<any>(
      `${environment.apiURL}${this.apiController}/updatePregrado`,
      payload
    );
  }

}
