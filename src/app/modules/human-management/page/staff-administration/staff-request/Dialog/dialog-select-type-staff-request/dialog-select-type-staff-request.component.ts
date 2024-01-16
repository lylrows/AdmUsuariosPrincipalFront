import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TypeStaffRequestQueryFilter } from "@app/data/schema/StaffRequest/TypeStaffRequestQueryFilter";
import { AppConfirmService } from "@app/shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "@app/shared/services/app-loader/app-loader.service";
import { StaffRequestService } from "@app/data/service/staff-request.service";
import { reduce } from "rxjs/operators";
import { StaffRequestQueryFilter } from "@app/data/schema/StaffRequest/StaffRequestFQueryFilter";
import { TypeStaffRequestService } from "@app/data/service/typestaffrequest.service";
import { DialogTypeStaffRequestComponent } from "@app/modules/support/page/crud-type-staff-request/dialog-type-staff-request/dialog-type-staff-request.component";
import { DialogStaffRequestVacationComponent } from "../dialog-staff-request-vacation/dialog-staff-request-vacation.component";
import { DialogStaffRequestAdvancementComponent } from "../dialog-staff-request-advancement/dialog-staff-request-advancement.component";
import { DialogStaffRequestAccountChangeCtsComponent } from "../dialog-staff-request-account-change-cts/dialog-staff-request-account-change-cts.component";
import { DialogStaffRequestSalaryComponent } from "../dialog-staff-request-salary/dialog-staff-request-salary.component";
import { DialogStaffRequestSepelioComponent } from "../dialog-staff-request-sepelio/dialog-staff-request-sepelio.component";
import { DialogStaffRequestSureComponent } from "../dialog-request-sure/dialog-staff-request-sure.component";
import { DialogStaffRequestMedicalComponent } from "../dialog-staff-request-medical/dialog-staff-request-medical.component";
import { DialogStaffRequestAbsenceComponent } from "../dialog-staff-request-absence/dialog-staff-request-absence.component";
import { DialogStaffRequestPermitComponent } from "../dialog-staff-request-permit/dialog-staff-request-permit.component";
import { DialogStaffRequestLoanComponent } from "../dialog-staff-request-loan/dialog-staff-request-loan.component";

import {MatDialogModule} from '@angular/material/dialog';
import { DialogStaffRequestPlanComponent } from "../dialog-staff-request-plan/dialog-staff-request-plan.component";
import { DialogStaffRequestHourExtraComponent } from "../dialog-staff-request-hour-extra/dialog-staff-request-hour-extra.component";
import { DialogStaffRequestSelectEmployeeComponent } from "../dialog-staff-request-select-employee/dialog-staff-request-select-employee.component";

@Component({
  selector: "app-dialog-select-type-staff-request",
  templateUrl: "dialog-select-type-staff-request.component.html",
  styleUrls: ['./dialog-select-type-staff-request.component.scss']
})
export class DialogSelectTypeStaffRequestComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  lstTypeStaffRequest: any[];

  displayedColumns: string[] = [
    'option',
    'name'
  ];

  id: number = 0;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<DialogSelectTypeStaffRequestComponent>,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private staffRequestService: StaffRequestService,
    private typestaffRequestService: TypeStaffRequestService
  ) {
    this.id = this.data.id;
  }

  ngOnInit() {
    this.load();
  }

  openPopUp(typeStaff: any = {}) {
    let data: any = {};
      this.staffRequestService.getemployee().subscribe((res) =>{
        
        data.idTypeStaffRequest = typeStaff.id,
        data.TypeStaffRequest = typeStaff.name,
        data.staffRequest = {
          idEmployee: res.data.idEmployee,
          idPerson: res.data.idPerson,
          dateIssue: res.data.dateissue,
          idCharge: res.data.idCharge,
          idArea: res.data.idArea,
          dateAdmission: res.data.dateAdmission,
          charge: res.data.charge,
          area: res.data.area,
          codeEmployee: res.data.code,
          company: res.data.company,
          names: res.data.names,
          lastName: res.data.lastName,
          motherLastName: res.data.motherLastName,
          dni: res.data.dni,
          codeBank:res.data.codeBank,
          accountBank:res.data.accountBank,
          cciaccount_bank:res.data.cciaccount_bank,
          currencyAccountBank:res.data.currencyAccountBank,
          codeBankCts:res.data.codeBankCts,
          accountCts:res.data.accountCts,
          currencyCts:res.data.currencyCts,
          afpCode:res.data.afpCode
        };
        this.loadStaffRequest(data);
    });
  }

  loadStaffRequest(data: any = {}){
    console.log("🚀 ~ DialogSelectTypeStaffRequestComponent ~ loadStaffRequest ~ data:", data)
    let dialogRef: MatDialogRef<any>;
    
    switch(data.idTypeStaffRequest){
      case 1:   // SOLICITUD DE VACACIONES SIN EXCEPCIÓN
      case 2:{  // SOLICITUD DE VACACIONES ADELANTADAS
       
        dialogRef = this.dialog.open(DialogStaffRequestVacationComponent, {
          width: "720px",
          maxHeight: '650px',
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data },
        });

        
        break;
      }
      case 3: {
       
        dialogRef = this.dialog.open(DialogStaffRequestLoanComponent, {
          width: "820px",
          maxHeight: '650px',
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data },
        });
        break;
      }
      case 4:{
        
        dialogRef = this.dialog.open(DialogStaffRequestLoanComponent, {
          width: "820px",
          maxHeight: '650px',
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data },
        });
        break;
      }
      case 5:{  // SOLICITUD DE PERMISOS
        dialogRef = this.dialog.open(DialogStaffRequestPermitComponent, {
          width: "720px",
          maxHeight: '650px',
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data },
        });
        break;
      }
      case 6:   // JUSTIFICACIÓN DE AUSENCIAS
      case 7:   // JUSTIFICACIÓN DE TARDANZA
      {
        dialogRef = this.dialog.open(DialogStaffRequestAbsenceComponent, {
          width: "720px",
          maxHeight: '650px',
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data },
        });
        break;
      }
      case 8:{
        dialogRef = this.dialog.open(DialogStaffRequestMedicalComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data, isEdit: false },
        });
        break;
      }
      case 9:{
        
        dialogRef = this.dialog.open(DialogStaffRequestAdvancementComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data, isEdit: false },
        });
        break;
      }
      case 10:{ // Solicitud de Afiliación y desafiliación de Seguros
        
        dialogRef = this.dialog.open(DialogStaffRequestSureComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data, isEdit: false },
        });
        break;
      }
      case 11:{
         
        dialogRef = this.dialog.open(DialogStaffRequestSepelioComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data, isEdit: false },
        });
        break;
      }
      case 12:{
        
        dialogRef = this.dialog.open(DialogStaffRequestSalaryComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data, isEdit: false },
        });
        break;
      }
      case 13:{
         
        dialogRef = this.dialog.open(DialogStaffRequestAccountChangeCtsComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data },
        });
        break;
      }
      case 14:{ // Solicitud de Cambio de EPS
         
        dialogRef = this.dialog.open(DialogStaffRequestPlanComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data, isEdit: false },
        });
        break;
      }
      case 17:{
         
        dialogRef = this.dialog.open(DialogStaffRequestSelectEmployeeComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data, isEdit: false },
        });
        break;
      }
      case 18:{
         
        dialogRef = this.dialog.open(DialogStaffRequestHourExtraComponent, {
          width: "720px",
          height: "650px",
          disableClose: true,
          data: { title: data.TypeStaffRequest, payload: data, isEdit: false },
        });
        break;
      }
    }
 
  }

  load() {
    this.Filtrar();
  }

  Filtrar() {
    this.staffRequestService.ListrequestbyCategory(this.id).subscribe(resp => {
      this.dataSource.data = resp.data
    })

  }

  close(): void {
    this.staffRequestService.refresh.emit(true);
    this.dialogRef.close(false)
  }

}