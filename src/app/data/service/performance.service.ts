import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CampaignQueryFilterDto } from "../schema/Campaign/CampaignQueryFilterDto";
import { CampaignEvaluationQueryFilterDto } from "../schema/Campaign/CampaignEvaluationQueryFilterDto";
import { Result } from "../schema/result";

@Injectable({
  providedIn: "root",
})
export class PerformanceService {
  private apiController = "/Campaign";

  constructor(private _http: HttpClient) {}

  getListMonth(year?: number): any {
    let currentYear = new Date().getFullYear();
    let currentMonth = (new Date().getMonth()) + 1;
    
    if (year > currentYear) {
      return [];
    }
    else if (year == currentYear) {
      let monthsAll = [
        { code: 1, name: "Enero" },
        { code: 2, name: "Febrero" },
        { code: 3, name: "Marzo" },
        { code: 4, name: "Abril" },
        { code: 5, name: "Mayo" },
        { code: 6, name: "Junio" },
        { code: 7, name: "Julio" },
        { code: 8, name: "Agosto" },
        { code: 9, name: "Setiembre" },
        { code: 10, name: "Octubre" },
        { code: 11, name: "Noviembre" },
        { code: 12, name: "Diciembre" },
      ]
      let months = [];

      monthsAll.forEach(element => {
        if ( element.code < currentMonth )
          months.push(element)
      });

      return months;
    }
    else {
      return [
        { code: 1, name: "Enero" },
        { code: 2, name: "Febrero" },
        { code: 3, name: "Marzo" },
        { code: 4, name: "Abril" },
        { code: 5, name: "Mayo" },
        { code: 6, name: "Junio" },
        { code: 7, name: "Julio" },
        { code: 8, name: "Agosto" },
        { code: 9, name: "Setiembre" },
        { code: 10, name: "Octubre" },
        { code: 11, name: "Noviembre" },
        { code: 12, name: "Diciembre" },
      ];
    }
  }

  getListStatus(): any[] {
    return [
      { code: 1, name: "Creado" },
      { code: 2, name: "Lanzado" },
      { code: 3, name: "Reiniciado" },
    ];
  }

  getListNumberAction(): any[] {


    return [
      { code: 1, name: "Inicio - Auto Evaluación" ,bisapproved:false},
      { code: 2, name: 'Inicio - Valida Evaluador',bisapproved:false },
      //{ code: 3, name: "Inicio - Concesua",bisapproved:false },
      { code: 4, name: 'Inicio - Acepta o Acepta con Observación',bisapproved:false},
      { code: 4, name: 'Inicio - Terminado',bisapproved:true},
      { code: 5, name: "Verificación - Valida Evaluador" ,bisapproved:false},
      //{ code: 6, name: "Verificación - Concesua",bisapproved:false },
      { code: 7, name: "Verificación - Acepta o Acepta con Observación" ,bisapproved:false},
      { code: 7, name: 'Verificación - Terminado' ,bisapproved:true},
      // { code: 8, name: "Evaluación - Auto Evalua" ,bisapproved:false},
      //{ code: 9, name: "Evaluación - Valida Evaluador",bisapproved:false },
      { code: 10, name: "Evaluación - Valida Evaluador",bisapproved:false },
      { code: 11, name: 'Evaluación - Acepta o Acepta con Observación',bisapproved:false },
      { code: 11, name: 'Evaluación - Terminado',bisapproved:true },
    ]

  }

  getListRecognition(filters): Observable<any> {
    
    let objCampaign:CampaignQueryFilterDto;
    objCampaign={
      nidCampana:filters.nidCampana,
      snamecampaign: filters.snamecampaign,
      nstatus: filters.nstatus,
      nyear: filters.nyear,
      nmonth:  filters.nmonth,
      CurrentPage: filters.pagination.currentPage,
      ItemsPerPage: filters.pagination.itemsPerPage,
      TotalItems: filters.pagination.totalItems,
      TotalPages: filters.pagination.totalPages,
      TotalRows:filters.pagination.totalRows,
    };
   
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/getlistpagination`,
        objCampaign //filters
      )
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  getListCampaign(): Observable<any> {
    return this._http
      .get<any>(`${environment.apiURL}${this.apiController}/getdropdownlist`)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  getCampaign(id: number): Observable<any> {
    return this._http
      .get<any>(
        `${environment.apiURL}${this.apiController}/getcampaignbyid/${id}`
      )
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  getListAsignEmployee(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/getemployeebycampaign/`,
        payload
      )
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  AsignEmployee(payload): Observable<any> {
    return this._http.post<any>(
      `${environment.apiURL}${this.apiController}/assignemployees/`,
      payload
    );
  }

  getListProficiency(): Observable<any> {
    return this._http
      .get<any>(`${environment.apiURL}/Proficiency/getdropdownlist`)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }
  // Agregado 19/06/2022
  getListCompentences(): Observable<any> {
    return this._http
      .get<any>(`${environment.apiURL}/Proficiency/getlistcompetences`)
      .pipe(
        map((resp) => {
          // return resp.data;
          return resp;
        })
      );
  }

  getListMof(filter): Observable<any> {
    return this._http
      .post<any>(`${environment.apiURL}/Mof/getmofdetailprof`, filter)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  saveCampaign(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/savecampaign`,
        payload
      );
  }

  GetEmployeeByCampaign(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/getproficiencybycharge`,
        payload
      )
  }

  GenerateEvaluations(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/generateevaluations`,
        payload
      )
  }

  ReInit(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/resetT0campaign`,
        payload
      )
  }

  ResetT1(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/resetT1campaign`,
        payload
      )
  }

  GetListEvaluations(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/getevaluationpaginationlist`,
        payload
      )
  }

  GetMyEvaluations(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/myevaluationslist`,payload)
    .pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }
  GetMyTeamEvaluations(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/myteamevaluationslist`,payload)
  }
  GetMyTeamResumeComp(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/myteamresumecomp`,payload)
  }
  GetMyTeamResumeCompV2(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/myteamresumecomp-v2`,payload)
  }

  UpdateEvaluatioons(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}/Evaluation/updateevaluationdetail`,
        payload
      )
  }

  getEvaluationDetail(id: number): Observable<any> {
    return this._http
      .get<any>(`${environment.apiURL}/Evaluation/getfullevaluation/${id}`)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  getLastCampaignByEmployee(id: number): Observable<any> {
    return this._http
      .get<any>(`${environment.apiURL}/Evaluation/lastcampaign/${id}`)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  DeleteEmployee(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}/Evaluation/deleteemployee`,
        payload
      )
  }

  GetNineBox(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/getninebox`,
        payload
      )
  }
  GetCampaingListEvaluations(payload): Observable<any> {
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/getcampaingevaluationlist`,
        payload
      )
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }
  GetCampaingListEvaluationsDeleted(payload): Observable<any> {
    let objCampaign:CampaignEvaluationQueryFilterDto;
    objCampaign={
      nidCampana: payload.nidCampana,
      numberAction: payload.numberAction,
      CompanyId: payload.CompanyId,
      GerenciaId: payload.GerenciaId,
      AreaId: payload.AreaId,
      SubAreaId: payload.SubAreaId,
      CurrentPage: payload.pagination.currentPage,
      ItemsPerPage: payload.pagination.itemsPerPage,
      TotalItems: payload.pagination.totalItems,
      TotalPages: payload.pagination.totalPages,
      TotalRows:payload.pagination.totalRows,
    };
    
    return this._http
      .post<any>(
        `${environment.apiURL}${this.apiController}/getcampaingevaluationlistdeleted`,
        objCampaign //payload
      )
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }



  GetCampaingByUserMyEvaluations(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/getcampaingbyusermyevaluations`,payload)
  }

  GetCompanyByCampaingUserMyEvaluations(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/getcompanybycampaingusermyevaluations`,payload)
  }

  GetGerenciasByCampaingUserMyEvaluations(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/getgerenciasbycampaingusermyevaluations`,payload)
  }

  GetAreasByCampaingUserMyEvaluations(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/getareasbycampaingusermyevaluations`,payload)
  }

  GetSubAreasByCampaingUserMyEvaluations(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/getsubareasbycampaingusermyevaluations`,payload)
  }

  GetCollaboratorsByCampaingUserMyEvaluations(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/getcollaboratorsbycampaingusermyevaluations`,payload)
  }

  GetChargesByCompanyArea(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}/Cargo/getchargesbycompanyarea`,payload)
    .pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }
  GetChargesByCompanyAreaMulti(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}/Cargo/getchargesbycompanyareamulti`,payload)
    .pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }

  GetCampaingByEvaluation(): Observable<any> {
    return this._http
    .post<any>(`${environment.apiURL}${this.apiController}/getcampaingbyevaluation`,null);
    //.get<any>(`${environment.apiURL}${this.apiController}/getdropdownlist`)
  }

  getPrintEvaluationDetail(id: number): Observable<any> {
    return this._http
      .get<any>(`${environment.apiURL}/Evaluation/getprintevaluationdetail/${id}`)
      // .pipe(
      //   map((resp) => {
      //     return resp.data;
      //   })
      // );
  }

  GetConfigLevelNineBox(): Observable<any> {
    return this._http
    .post<any>(`${environment.apiURL}${this.apiController}/getconfiglevelninebox`,null);
    
  }

  GetConfigDetailLevelNineBoxByCampaign(payload): Observable<any> {
    return this._http
    .post<any>(`${environment.apiURL}${this.apiController}/getconfiglevelnineboxbycampaign`,payload);
    
  }

  getcampaignprogressxls(payload): Observable<Result> {
    return this._http.post<Result>(`${environment.apiURL}${this.apiController}/getcampaignprogressxls`,payload);
  }

  getCampaingByUser(payload): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}${this.apiController}/getcampaingbyuser`,payload);
  }

}
