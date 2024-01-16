import { environment } from "./../../../environments/environment";
import { Result } from "./../schema/result";
import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StaffRequestVacation } from "../schema/StaffRequest/StaffRequestVacation";
import { StaffRequestQueryFilter } from "../schema/StaffRequest/StaffRequestFQueryFilter";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from "@angular/common";
import { map } from "rxjs/operators";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

@Injectable({ providedIn: "root" })
export class StaffRequestService {
  private apiController = "/StaffRequest";


  public refresh = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  getemployee(): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getemployee/`
    );
  }

  getAll(filter: StaffRequestQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getlistpagination`, filter);
  }

  getPrint(filter: StaffRequestQueryFilter): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiURL}${this.apiController}/exportrequest`, filter);
  }

  getPdfMedicalRest(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}${this.apiController}/getpdfmedicalrest/${id}`
    );
  }

  getPdfSalaryAdvance(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}${this.apiController}/getpdfsalaryadvance/${id}`
    );
  }

  updatestate(id: number): Observable<any>{
    const formdata = new FormData();
    formdata.append('id', id.toString());
    return this.httpClient.post<any>(`${environment.apiURL}/RequestMedical/updatestaterequest`, formdata);
  }

  getPdfBurial(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}${this.apiController}/getpdfburial/${id}`
    );
  }

  getPdfSalaryAccount(id): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiURL}${this.apiController}/getpdfsalaryaccount/${id}`
    );
  }

  getemployeeChildrenById(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}${this.apiController}/getemployeeChildrenById/${id}`
    );
  }

  registerMedical(payload): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiURL}/RequestMedical/`, payload);
  }

  registerDocument(payload): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiURL}/RequestMedical/registerdocument`, payload);
  }
  registerdocumentdraft(payload): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiURL}/RequestMedical/registerdocumentdraft`, payload);
  }
  

  registerDocumentMasive(payload): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiURL}/RequestMedical/registerdocumentmasive`, payload);
  }

  getmedicallist(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/getlistmedical`, payload
    );
  }

  getmedicallistPrint(payload): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiURL}/RequestMedical/getlistmedicalprint`, payload).pipe(
        map((resp: any) => {
            return resp;
        })
    )
}

  getmedicalbyId(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/RequestMedical/${id}`
    );
  }
  getApprovalDate(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/RequestMedical/getApprovalDate/${id}`
    );
  }

  getlistdocument(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/RequestMedical/listdocument/${id}`
    );
  }

  requestdocumentobserver(id): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/RequestMedical/requestdocumentobserver/${id}`
    );
  }

  



  getlistapproved(): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/RequestMedical/listusernotification`
    );
  }

  validDocument(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/validdocument`, payload
    );
  }

  updateDocument(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/updatefilemedical`, payload
    );
  }

  updateVIVA(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/updateviva`, payload
    );
  }

  updateVIVAFile(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/updatevivaFile`, payload
    );
  }

  getDays(id: number): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/RequestMedical/getdays/${id}`
    );
  }


  updateCITT(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/updatecitt`, payload
    );
  }

  updateCITTFile(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/updatecittFile`, payload
    );
  }

  updateAmount(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/updateamount`, payload
    );
  }

  reject(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/reject`, payload
    );
  }

  getBoss(id: number): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/RequestMedical/getboss/${id}`
    );
  }

  reportAmount(): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/RequestMedical/reportamount`
    );
  }

  Listcategory(): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/StaffRequest/getlistcategory`
    );
  }

  ListrequestbyCategory(id: number): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/StaffRequest/getlistrequestbycategory/${id}`
    );
  }

  reportGraficStatus(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/reportgraficstatus`, payload
    );
  }

  reportGraficEtapa(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/reportgraficetapa`, payload
    );
  }


  ListDatesByEmployee(id: number): Observable<Result> {
    return this.httpClient.get<Result>(
      `${environment.apiURL}/StaffRequest/getdatesbyemployee/${id}`
    );
  }


  exportData(json:any[], header:any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, { skipHeader: false });
    const worksheet2 = XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    const workbook: XLSX.WorkBook = { Sheets: {'data': worksheet}, SheetNames:['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    for(const key in worksheet2) {
     

      if (key.replace(/[^0-9]/ig, '') === '1') {
        worksheet[key].s = {
          fill: {
            patternType: "none", // none / solid
            fgColor: {rgb: "FF000000"},
            bgColor: {rgb: "FFFFFFFF"}
              },
              font: {
            name: 'Times New Roman',
            sz: 16,
            color: {rgb: "#FF000000"},
            bold: true,
            italic: false,
            underline: false
              },
              border: {
            top: {style: "thin", color: {auto: 1}},
            right: {style: "thin", color: {auto: 1}},
            bottom: {style: "thin", color: {auto: 1}},
            left: {style: "thin", color: {auto: 1}}
              }
        }
      }
    }
    this.saveAsExcel(excelBuffer, excelFileName);
  }

  private saveAsExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXT)
  }


  downloadFile(id: number): Observable<Result> {
    //return this.httpClient.post<Result>(`${environment.apiURL}/Download/descargarPDF/${id}`, id);
    return this.httpClient.get<any>(`${environment.apiURL}/Download/getpdf/${id}`);
  }

  getAllByUser(filter: StaffRequestQueryFilter): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getlistpaginationbyuser`, filter);
  }

  sendMedicalCertificateExactus(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/sendmedicalcertificateexactus`, payload
    );
  }

  medicalDocumentApproved(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/medicaldocumentapproved`, payload
    );
  }
  observedocumentmasive(payload): Observable<Result> {
    return this.httpClient.post<Result>(
      `${environment.apiURL}/RequestMedical/observedocumentmasive`, payload
    );
  }
  deleteSolicitud(filter: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiURL}${this.apiController}/deleteRequest`, filter);
  }

  getStaffRequestFromNotificacionById(payload): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getStaffRequestFromNotificacionById`, payload);
  }
  getStaffRequestValidateDaysAdelantoSueldo(payload): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.apiURL}${this.apiController}/getStaffRequestValidateDaysAdelantoSueldo`, payload);
  }
}
