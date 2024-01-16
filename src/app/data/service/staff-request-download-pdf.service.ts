import { environment } from "./../../../environments/environment";
import { Result } from "./../schema/result";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class StaffRequestDownloadPdfService {
  constructor(private httpClient: HttpClient) { }

  getPdf(id, type, isnew?): Observable<any> {
    
    switch (type) {
      case 1:
      case 2: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequestVacation/getpdf/${id}`
        );
        break;
      }
      case 3:
      case 4: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequestLoan/getpdf/${id}`
        );
        break;
      }
      case 5: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequestPermit/getpdf/${id}`
        );
        break;
      }
      case 6: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequestAbsence/getpdf/${id}`
        );
        break;
      }
      case 7: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequestJustificationTardiness/getpdf/${id}`
        );
        break;
      }
      case 8: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequest/getpdfmedicalrest/${id}`
        );
        break;
      }
      case 9: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequest/getpdfsalaryadvance/${id}`
        );
        break;
      }
      case 10: {

        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequest/getpdfsure/${id}`
        );
        break; break;
      }
      case 11: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequest/getpdfsepelio/${id}`
        );
        break;
      }
      case 12: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequest/getpdfsalaryaccount/${id}`
        );
        break;
      }
      case 13: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequestAccountChangeCts/getpdf/${id}`
        );
        break;
      }
      case 14: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequest/getpdfchangeeps/${id}`
        );
        break;
      }
      case 17: {
        
        if (isnew) {
          return this.httpClient.get<any>(
            `${environment.apiURL}/StaffRequest/getpdftrainingnew/${id}`
          );
          break;
        } else {
          return this.httpClient.get<any>(
            `${environment.apiURL}/StaffRequest/getpdftrainingextra/${id}`
          );
          break;
        }

        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequest/getpdfhoraextra/${id}`
        );
        break;
      }
      case 18: {
        return this.httpClient.get<any>(
          `${environment.apiURL}/StaffRequest/getpdfhoraextra/${id}`
        );
        break;
      }
    }
  }

}
