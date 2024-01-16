import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '@app/data/service/employee.service';
import { NotificationService } from '@app/data/service/notification.service';
import { PerformanceService } from '@app/data/service/performance.service';
import { User } from '@app/shared/models/user.model';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-request-document',
  templateUrl: './modal-request-document.component.html',
  styleUrls: ['./modal-request-document.component.scss']
})

// formatDatetext(pDate :string){
//   let fecha = new Date(pDate)
//   fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
  
//   return fecha;
// }
export class ModalRequestDocumentComponent implements OnInit {
  currentYear = this.getCurrentYear();
  maxYear = this.getCurrentYear();
  idEmployee: number = 0;
  idPerson: number = 0;

  seccions: any[] = [];
  listmonth: any[] = [];
  showMonth: boolean = false;

  year = new FormControl(this.currentYear, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.min(2021), Validators.max(this.currentYear)]);
  month = new FormControl('', [Validators.required]);
  
  showFilter: boolean = false;
  showSave: boolean = false;
  ntypeseccion: number = 0;
  documentoSolicitado:string = "";

  user: User;
  
  constructor(
    private dialogRef: MatDialogRef<ModalRequestDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _serviceEmployee: EmployeeService,
    private _service: PerformanceService,
    private snack: MatSnackBar,
    private _notificationService: NotificationService,
  ) {
    this.idEmployee = this.data.employee;
    this.idPerson = this.data.person;
    this.user = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
  }

  ngOnInit(): void {
    this.seccions = this._serviceEmployee.getListSeccionDocument();
    // this.getMonth(this.currentYear);
  }

  getCurrentYear(){
    let fecha = new Date()
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
    
    return fecha.getFullYear();
  }

  getMonth(year:number): void {
    this.listmonth = [];
    if(this.ntypeseccion!==9 ){
      this.month.setValue('');
    }
    console.log("🚀 ~ ModalRequestDocumentComponent ~ getMonth ~ this.ntypeseccion:", this.ntypeseccion)
    // this.listmonth = this._service.getListMonth(year);
    this._serviceEmployee.getListMonth(this.ntypeseccion,year).subscribe((resp: any) => {
      console.log("🚀 ~ ModalRequestDocumentComponent ~ this._serviceEmployee.getListMonth ~ resp: NNEW", resp)
      this.listmonth = resp;
    })

  }

  validateYear(year): void {
    
    
    if(year > this.maxYear)
      this.year.setValue(this.maxYear);
  }
   public nCertificateType =0;
  
  changeSeccion(event): void {
    const value = Number(event.value)
    for(let i=0;i<this.seccions.length;i++)
    {
      if(this.seccions[i].code==value)
        this.documentoSolicitado=this.seccions[i].name;
    }


    if ( value === 1 ) {  // Boleta de Pago
      this.showFilter = true;
      this.showSave = true;
      this.showMonth = true;
      this.maxYear = this.currentYear;
      this.ntypeseccion = 8
      
      // this.month.setValue('');
    } else if ( value === 2 ) { // Certificado de 5ta categoria
      this.showFilter = true;
      this.showSave = true;
      this.maxYear = this.currentYear - 1;
      this.year.setValue(this.currentYear - 1);
      this.month.setValue(12);
      this.showMonth = false;
      this.ntypeseccion = 9
    } else if ( value === 3 ) { // Certificado de Trabajo
      this.showSave = true;
      this.showFilter = false;
      this.showMonth = true;
      this.maxYear = this.currentYear;
      this.ntypeseccion = 10;
      
      // this.month.setValue('');
    } else if ( value === 4 ) { // Certificado CTS
      this.showFilter = true;
      this.showSave = true;
      this.showMonth = true;
      this.maxYear = this.currentYear;
      this.ntypeseccion = 11;
      // this.getMonth(this.currentYear);
      
      // this.month.setValue('');
    } else if ( value === 5 ) { // Certificado de Utilidades
      this.showFilter = true;
      this.showSave = true;
      // this.maxYear = this.currentYear - 1;
      // this.year.setValue(this.currentYear - 1);
      this.month.setValue(1);
      this.showMonth = true;
      this.ntypeseccion = 12
    }
    
    this.getMonth(this.currentYear);
    this.nCertificateType = value;
     
  }

  cancel(): void {
    if (this.ntypeseccion == 0) {
      this.dialogRef.close();
    }
    else {
      this.ntypeseccion = 0;
      this.showFilter = false;
      this.showSave = false;
    }
  }

  saveRequestDocument(): void {
    let requestId = 0;
    if ( this.showFilter ) {

      if ( this.year.invalid ) {
        return this.year.markAllAsTouched();
      }

      if ( this.month.invalid ) {
        return this.month.markAllAsTouched();
      }
      
      const payload = {
        nid_collaborador: Number(this.idEmployee),
        nyear: Number(this.year.value),
        nmonth: Number(this.month.value),
        nid_person: Number(this.idPerson),
        ntypeseccion: Number(this.ntypeseccion)
      }


      if (this.nCertificateType ===5) // UTILIDADES
      {
        payload.nyear = Number(this.year.value)+1;
      }



      this._serviceEmployee.InsertRequestDocument(payload).subscribe((resp: any) => {
        requestId = resp.data.nid_request;
        this.aprobar(requestId);
        // this.snack.open(resp.data.messaje, "OK", {
        //   duration: 4000,
        // });
        // this.dialogRef.close()
      })

    } else {

      const payload = {
        nid_collaborador: Number(this.idEmployee),
        nyear: null,
        nmonth: null,
        nid_person: Number(this.idPerson),
        ntypeseccion: Number(this.ntypeseccion)
      }

      this._serviceEmployee.InsertRequestDocument(payload).subscribe((resp: any) => {
        requestId = resp.data.nid_request;
        this.aprobar(requestId);
        // this.snack.open(resp.data.messaje, "OK", {
        //   duration: 4000,
        // });
        // this.dialogRef.close()
      })

    }



  }


  aprobar(requestId: number) {
    let employeeData;
    let personData;
    let collaborator;

    this._serviceEmployee.RequestDetail(requestId).subscribe(resp => {
      collaborator = resp.scollaborator;

      this._serviceEmployee.getDetailtEmployee(Number(this.idEmployee)).subscribe(resp => {
        employeeData = resp;

        this._serviceEmployee.getPerson(Number(this.idPerson)).subscribe(resp => {
          personData = resp;

          const payloadAccept = {
            nid_request: requestId,
            nid_emisor: Number(this.idPerson),
            nid_reseptor: Number(this.idPerson),
            nid_area: employeeData.nid_area,
            type: 13,
            name: collaborator,
            dni: personData.sidentification,
            charger: employeeData.snamecharge,
            date: employeeData.dregister,
            ntypeseccion: this.ntypeseccion
          }

          this._serviceEmployee.AcceptRequest(payloadAccept).subscribe((resp: any )=> {
            // Actualiza la campana de notificación
            this. loadCampanaNotificacion();
            this.dialogRef.close();
            this.snack.open(resp.data, "OK", {
              duration: 4000,
            });
          })
        })
      })
    })
  }

  loadCampanaNotificacion() {
    this._notificationService.getBandeja(this.user.id).subscribe((res) => {
      if (res.data.length>0) {
        let countNotification = res.data.filter(i => i.viewed== false).length;
        this._notificationService.setUnviewedCountGlobal(countNotification.toString());
      }
    });
  }

}
