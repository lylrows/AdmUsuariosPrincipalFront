import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OthersModule } from "@app/views/others/others.module";
import { StaffRequestVacationService } from "@app/data/service/staff-request-vacation.service";
import { StaffRequestApproverService } from "@app/data/service/staff-request-approver.service";
import { StaffRequestLoanService } from "@app/data/service/staff-request-loan.service";
import { EmployeeService } from "@app/data/service/employee.service";
import { MatSort } from "@angular/material/sort";
import {listMonths, listYears} from '../../../../../../../data/schema/constants';
import { environment } from "environments/environment";

@Component({
  selector: "app-dialog-staff-request-loan-evaluate",
  templateUrl: "dialog-staff-request-loan-evaluate.component.html",
  styleUrls: ["./dialog-staff-request-loan-evaluate.component.scss"],
})
export class DialogStaffRequestLoanEvaluateComponent implements OnInit {
  public itemForm: FormGroup;
  @ViewChild(MatTable) tableApprover: MatTable<any>;
  listApprover: any[] = [];
  readOnlyView: boolean;
  isAceeptOrRejected: boolean;
  hasAccessToApprover: boolean;
  nameFile: string = null;
  fileurl: string = null;

  codeEmployee: string = '';
  dateAdmission: string = '';
  fullname: string = '';
  dni: string = '';
  area: string = '';
  charge: string = '';
  showComment: boolean = false;
  permitEdit: boolean = false;
  selectedTerms: boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  listCuotas: any[]

  displayedColumns: string[] = [
    'ncoutacount',
    'ncuotafijasinigv',
    'ninterest',
    'nintmoreigv',
    'ncuotatotal',
    'speriod',
    'sgratificacion',
    'sutilidad'
  ];
  listMonths: any[];
  listYears: any[];
  listCobroUtilidades: any[];
  listCobroGratificacion: any[];
  maximaCantidadCuotas: number = 0;
  habilitarCuotaDoble: boolean = true;
  lstTypeLoan: any[];sumaMonto: number = 0;
  sumaInteres: number = 0;
  sumaAmortizacion: number = 0;
  sumaInteresIGV: number = 0;
  sumaCuotaFijaSinIGV: number = 0;
  sumaCuotaTotal: number = 0;
  bshowOtroGrati=false;
  bshowOtroUtil=false;

  listHistoAprobaciones:any[]=[];
  id_employee:number=0;
  id_profile:number=0;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestLoanEvaluateComponent>,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private staffRequestLoanService: StaffRequestLoanService,
    private staffRequestApproverService: StaffRequestApproverService,
    private _serviceEmployee: EmployeeService,
  ) {
    const user = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.id_employee=user.id;
    this.id_profile=user.nid_profile;
    this.listMonths = listMonths;
    this.listYears = listYears;
    this.GetRequestIsEdit();
  }

  ngOnInit() {
    this.load();
  }

  stopProp(e) {
    e.stopPropagation();
  }

  getListAprobaciones()
  {
    this.staffRequestApproverService.getlistbyid(this.data.payload.id).subscribe(res => {
      this.listHistoAprobaciones=res.data;
      this.listHistoAprobaciones.map((e) => {
        if(e.idEmployee===this.id_employee || e.idProfile===this.id_profile){
          this.isAceeptOrRejected = true;
          
        }
      });

    });
  }

  buildItemForm(item) {
    
    let employye = item.staffRequest.staffRequestEmployee;
    this.isAceeptOrRejected = item.staffRequest.isAceeptOrRejected;

    this.getListAprobaciones();
    this.codeEmployee = item.staffRequest.staffRequestEmployee.code
    this.dateAdmission = item.staffRequest.staffRequestEmployee.dateAdmission
    this.fullname = item.staffRequest.staffRequestEmployee.lastName + ' ' + item.staffRequest.staffRequestEmployee.motherLastName + ' ' + item.staffRequest.staffRequestEmployee.names
    this.dni = item.staffRequest.staffRequestEmployee.dni
    this.area = item.staffRequest.staffRequestEmployee.area
    this.charge = item.staffRequest.staffRequestEmployee.charge
    this.selectedTerms = item.terminosYCond == 1;

    
    let _dateLoan = new Date(item.dateLoan);

    this.itemForm = this.fb.group({
        title: [item.title || null],
        idTypeStaffRequest: item.staffRequest.idTypeStaffRequest,
        staffRequest: [null],
        lastName: [employye.lastName || null],
        motherLastName: [employye.motherLastName || null],
        names: [employye.names || null],
        dateAdmission: [employye.dateAdmission],
        charge: [employye.charge || null],
        area: [employye.area || null],            
        
        idTypeLoan: [item.idTypeLoan || 0, Validators.required],
        detailReasonLoan: [item.detailReasonLoan || null],   
        amount: [item.amount || null],  
        amountMonthlyFee: [item.amountMonthlyFee || null],  
        numberFee: [item.numberFee || null],  
        id: [item.idStaffRequest || 0],
        ntypecase: [item.ntypecase.toString(), [Validators.required]],
        ncoutaselect: [item.ncoutaselect],
        monthPay: [ item.monthPay || null, Validators.required],
        yearPay: [ item.yearPay || null , Validators.required],
        cobroGratificacion: [ Number(item.cobroGratificacion || '0').toString()],
        cobroUtilidad: [ Number(item.cobroUtilidad || '0').toString()],
        balance: [ item.balance || '0'],
        commentEvaluation: [item.comment || null],   
        idStaffRequest: item.idStaffRequest,
        dateLoan: [_dateLoan, Validators.required],
        bGrati:[item.bGrati || false],
        nAddGrati:[ item.nAddGrati || '0'],
        bUtil:[item.bUtil || false],
        nAddUtilidad:[ item.nAddUtilidad || '0'],
      });
      if (item.bGrati=== true){
        this.bshowOtroGrati =true;
      }
      if (item.bUtil=== true){
        this.bshowOtroUtil =true;
      }
      this.CalculateTimeLine();
  }

  load() {
    debugger;
    this.loadTypeLoan();
    this.ListCobroGratificacion();
    this.ListCobroUtilidades();
    this.readOnlyView = this.data.payload.readOnlyView;
    
    this.staffRequestLoanService.getbyid(this.data.payload.id).subscribe(res=>{
      console.log("🚀 ~ this.staffRequestLoanService.getbyid ~ res:", res)

      this.fileurl = res.data.staffRequestLoan.pathFileDocument;
      
      this.dataSource.data = res.data.detailt;
      this.listCuotas = res.data.detailt;
      this.buildItemForm(res.data.staffRequestLoan);
        const payload = {
          FileName: '',
          FileUrl: this.fileurl,
          ContentType: '',
          File: ''
        }
        
      this.AgregarFilaTotales();  
        this._serviceEmployee.GetByFile(payload).subscribe(resp => {
          this.nameFile = resp.data.fileName;
        });

        if(res.data.staffRequestLoan.state == '4' || res.data.staffRequestLoan.state == '3'){
          this.showComment = true;
        }
    }, (err) => {
      () => {
        
      }
    });
    this.staffRequestApproverService.getlistbyid(this.data.payload.id).subscribe(res=>{
        this.listApprover = res.data;
    });
    this.staffRequestApproverService.getAccsesstApprover(this.data.payload.id).subscribe(res =>{ 
      this.hasAccessToApprover = res.data;
    });

    
  }

  loadTypeLoan() {
    this.staffRequestLoanService.getForSelect().subscribe((res) => {
      this.lstTypeLoan = res.data;
    });
  }

  changetipo(): void {
    const value = Number(this.itemForm.get('ntypecase').value);

    if ( value === 2) {
      this.itemForm.controls["cobroGratificacion"].setValue('0');
    } else if (value == 1) {
      this.itemForm.get('ncoutaselect').clearValidators();
      this.itemForm.get('ncoutaselect').updateValueAndValidity();
    } else {
      this.itemForm.controls["numberFee"].setValue(1);
      this.CalculateAmount();
    }
    this.CalculateTimeLine();
  }

  ViewAdjunto(): void {
    const urlFile = this.fileurl;

    if (urlFile != null) {

      const payload = {
        FileName: '',
        FileUrl: urlFile,
        ContentType: '',
        File: ''
      }

      this._serviceEmployee.GetByFile(payload).subscribe(resp => {
        let link = document.createElement('a');
        let blobArchivo = this.base64ToBlob(resp.data.file, resp.data.contentType);
        let blob = new Blob([blobArchivo], { type: resp.data.contentType })
        link.href = URL.createObjectURL(blob);
        link.download = resp.data.fileName;
        link.click();

      })

    } else {
      this.snack.open('No tiene archivo adjunto', "OK", {
        duration: 4000,
      });
    }


  }

  public base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ''); 
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  approveRequest(){
    
    let staffRequestApprover: any = {
      idStaffRequest: this.itemForm.value.id,
      idTypeStaffRequest: this.itemForm.value.idTypeStaffRequest,
      level: this.getLevel(),
      Comment: this.itemForm.value.commentEvaluation
    };
    this.staffRequestApproverService.approve(staffRequestApprover).subscribe(res=>{
      if (res.stateCode == 200) {
        this.snack.open("¡Solicitud Aprobada!", "OK", { duration: 4000 });
        this.dialogRef.close(false);
      } else if (res.stateCode == 400) {
        this.snack.open(res.messageError[0], "OK", { duration: 4000 });
      } else {
        this.snack.open("Ocurrio un error en el servidor", "Error", {
          duration: 4000})
        }
    });
  }

  rejectRequest(){
    
    if(this.itemForm.value.commentEvaluation == null || this.itemForm.value.commentEvaluation == '' ||
    typeof this.itemForm.value.commentEvaluation == 'undefined'){
      this.snack.open("¡El comentario es obligatorio al rechazar una solicitud!", "OK", { duration: 4000 });
      return;
    }
    let staffRequestApprover: any = {
      idStaffRequest: this.itemForm.value.id,
      idTypeStaffRequest: this.itemForm.value.idTypeStaffRequest,
      level: this.getLevel(),
      comment: this.itemForm.value.commentEvaluation
    };
    this.staffRequestApproverService.reject(staffRequestApprover).subscribe(res=>{
      if (res.stateCode == 200) {
        this.snack.open("¡Solicitud Rechazada!", "OK", { duration: 4000 });
        this.dialogRef.close(false);
      } else if (res.stateCode == 400) {
        this.snack.open(res.messageError[0], "OK", { duration: 4000 });
      } else {
        this.snack.open("Ocurrio un error en el servidor", "Error", {
          duration: 4000})
        }
    });
  }

  getLevel(){
    let level = this.listApprover.reduce((op, item) => op = op > item.level ? op : item.level, 0);

    return level + 1;
  }

  ListCobroGratificacion(): void {
    this._serviceEmployee.ListGenericByKey(environment.keyCobroListaGratificacion).subscribe(resp => {
      this.listCobroGratificacion = resp;
    })
  }

  ListCobroUtilidades(): void {
    this._serviceEmployee.ListGenericByKey(environment.keyCobroListaUtilidades).subscribe(resp => {
      this.listCobroUtilidades = resp;
    })
  }

  GetMaximaCantidadCuotas(): void {
    this._serviceEmployee.ListGenericByKey(environment.keyMaximaCuotaPrestamo).subscribe(resp => {
      this.maximaCantidadCuotas = resp[0].sshort_value;
    },
    (err) => { console.log("Ocurrio un error calculatetimeline", err); },
    () => {
      this.load();
      } 
    )
  }

  GetRequestIsEdit(): void {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const idprofile: number = storage.nid_profile;

    
    this._serviceEmployee.ListGenericByKey(environment.keyPerfilesEditarSolicitud).subscribe((res: any) => {
      let _filtro = res.filter(x => x.sshort_value == idprofile);
      if(_filtro.length > 0) this.permitEdit = true;
      else this.permitEdit = false;
    })
  }

  guardarSolicitud(): void {
    if (this.itemForm.invalid) {
      this.snack.open("¡Es necesario ingresar todos los datos!", "OK", { duration: 4000, panelClass: 'center-alert' });
      return Object.values(this.itemForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    let staffRequest = {
      id: this.itemForm.value.id,
      idTypeStaffRequest: this.itemForm.value.idTypeStaffRequest,
      TypeStaffRequest: this.data.payload.TypeStaffRequest,
      monthPay: this.itemForm.value.monthPay,
      yearPay: this.itemForm.value.yearPay,
      idStaffRequest: this.itemForm.value.id,
      dateLoan: this.itemForm.value.dateLoan,
      staffRequestEmployee: {
        idEmployee: this.itemForm.value.idEmployee,
        idPerson: this.itemForm.value.idPerson,
        idCharge: this.itemForm.value.idCharge,
        dateAdmission: this.itemForm.value.dateAdmission,
        names: this.itemForm.value.names,
        lastName: this.itemForm.value.lastName,
        motherLastName: this.itemForm.value.motherLastName,
        charge: this.itemForm.value.charge,
        dni: this.itemForm.value.dni
      }
    };
    this.itemForm.controls["staffRequest"].setValue(staffRequest);
    this.itemForm.get('ntypecase').setValue(Number(this.itemForm.get('ntypecase').value));

    const formData = new FormData();

    
    formData.append('data', JSON.stringify(this.itemForm.value));
    
    this.staffRequestLoanService.update(formData).subscribe(
      (res) => {
        if (res.stateCode == 200) {
          this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
          
        } else if (res.stateCode == 2) {
          this.snack.open(res.messageError[0], "OK", { duration: 4000 });
        } else {
          this.snack.open("Ocurrio un error en el servidor", "Error", {
            duration: 4000,
          });
        }
      },
      (err) => { },
      () => {
        this.load();
      }
    );
  }

  CalculateAmount(): void {
    
    let montoGratificacion = Number(this.itemForm.value.cobroGratificacion);
    let montoUtilidad = Number(this.itemForm.value.cobroUtilidad);

    if (montoGratificacion>0){
      
      this.itemForm.controls["bGrati"].setValue(false); 
      this.itemForm.controls["nAddGrati"].setValue(0); 
      this.bshowOtroGrati= false;
    }
    if (montoUtilidad>0){
      
      this.itemForm.controls["bUtil"].setValue(false); 
      this.itemForm.controls["nAddUtilidad"].setValue(0); 
      this.bshowOtroUtil= false;
    }


    if (this.itemForm.value.bGrati === true){
      montoGratificacion = this.itemForm.value.nAddGrati;
     }
  
     if (this.itemForm.value.bUtil === true){
      montoUtilidad = this.itemForm.value.nAddUtilidad;
     }
  

    if(montoGratificacion > 0) {
      this.habilitarCuotaDoble = false;
      this.itemForm.controls["ntypecase"].setValue('1');
    } else {
      this.habilitarCuotaDoble = true;
    }

    let saldo = this.itemForm.value.amount - ( montoGratificacion + montoUtilidad );
    

    let numberFee = this.itemForm.value.numberFee;
    let amountLoan = saldo;
    let amountMonthlyFee = 0;
    if (numberFee > 0) {
      amountMonthlyFee = Math.round((amountLoan / numberFee) * 100) / 100;
    }
    
    this.CalculateTimeLine();
  }
  
  CalculateTimeLine(): void {
    this.dataSource = new MatTableDataSource([]);;
    
    const valueType = Number(this.itemForm.get('ntypecase').value);
    if ( valueType === 2 ) {
      const month = this.itemForm.get('monthPay').value;
      const year = this.itemForm.get('yearPay').value;
      if(month == null || month == '' || typeof month == 'undefined' ||
        year == null || year == '' || typeof year == 'undefined') {
          return;
        }
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.itemForm.value));

    this.staffRequestLoanService.calculatetimeline(formData).subscribe(
      (res) => { 
        
        let _montoRestarTotal = 0;
        if (res.stateCode == 200) {
              this.dataSource = res.data.detail;
              this.listCuotas = res.data.detail;
              
              let utilidades =  Number(this.itemForm.get('cobroUtilidad').value);
              if (this.itemForm.value.bUtil === true){
                utilidades =   Number(this.itemForm.get('nAddUtilidad').value);
               }
              if(utilidades > 0) {
                const itemUtilidad = this.listCuotas.find(x => x.nmonth == 3);
                if (typeof itemUtilidad == 'undefined' || itemUtilidad == null) {
                  this.itemForm.controls["cobroUtilidad"].setValue('0');
                  this.dataSource = new MatTableDataSource([]);
                  this.snack.open('No puede seleccionar Cobro Utilidades debido a que no tiene cuota en Marzo', 'OK', { duration: 4000 });
                  return;
                } 
                else {
                  _montoRestarTotal += utilidades;
                }
              }
              
              let gratificacion =  Number(this.itemForm.get('cobroGratificacion').value);

              if (this.itemForm.value.bGrati === true){
                gratificacion =   Number(this.itemForm.get('nAddGrati').value);
               }
              if(gratificacion > 0) {
                const itemGratificacion = this.listCuotas.find(x => x.nmonth == 7 || x.nmonth == 12);
                if (typeof itemGratificacion == 'undefined' || itemGratificacion == null) {
                  this.itemForm.controls["cobroGratificacion"].setValue('0');
                  this.dataSource = new MatTableDataSource([]);
                  this.snack.open('No puede seleccionar Cobro Gratifiación debido a que no tiene cuotas en Julio y/o Diciembre', 'OK', { duration: 4000 });
                  return;
                }    
                else {
                  
                  const _index1 = this.listCuotas.findIndex(x => x.nmonth == 7);
                  const _index2 = this.listCuotas.findIndex(x => x.nmonth == 12);
                  _montoRestarTotal += _index1 > -1 ? gratificacion : 0;
                  _montoRestarTotal += _index2 > -1 ? gratificacion : 0;
                }         
              }
              this.itemForm.controls["balance"].setValue(Number(this.itemForm.get('amount').value - _montoRestarTotal));
              const _valueForm = this.listCuotas.filter(x => x.ncuotafijasinigv != utilidades && x.ncuotafijasinigv != gratificacion);
              this.itemForm.controls["amountMonthlyFee"].setValue(_valueForm[0].ncuotafijasinigv);
              this.AgregarFilaTotales();  
        }
      },
      (err) => { console.log("Ocurrio un error calculatetimeline", err); },
      () => {
      }
    );
  }

  AgregarFilaTotales(): void {
    
    this.sumaMonto = 0;
    this.sumaInteres = 0;
    this.sumaAmortizacion = 0;
    this.sumaInteresIGV = 0;
    this.sumaCuotaFijaSinIGV = Number(this.itemForm.get('amount').value);
    this.sumaCuotaTotal = 0;
    this.listCuotas.forEach(x => {
      this.sumaMonto += x.nbalance;
      this.sumaInteres += x.ninterest;
      this.sumaAmortizacion += x.namortization;
      this.sumaInteresIGV += x.nintmoreigv;
      
      this.sumaCuotaTotal += x.ncuotatatotal;
    })
    this.listCuotas.push({
      namortization: this.sumaAmortizacion,
      nbalance: this.sumaMonto,
      ncoutacount: "Total",
      ncuotafijasinigv: this.sumaCuotaFijaSinIGV,
      ncuotatatotal: this.sumaCuotaTotal,
      nid_loan_detail: 1000,
      nid_staff_request: 0,
      ninterest: this.sumaInteres,
      nintmoreigv: this.sumaInteresIGV,
      nmonth: 0,
      ntasamensual: 0,
      nyear: "",
      smonth: ""
    });   
 }

 AgregarFilaUtilidadesGrati(monto: number, nmonth: number): void {
    this.listCuotas.forEach(res => {
        if(res.nmonth == nmonth) {
          
          this.listCuotas.push({
            namortization: 0,
            nbalance: 0,
            ncoutacount: res.ncoutacount,
            ncuotafijasinigv: monto,
            ncuotatatotal: monto,
            nid_loan_detail: res.nid_loan_detail,
            nid_staff_request: res.nid_staff_request,
            ninterest: 0,
            nintmoreigv: 0,
            nmonth: res.nmonth,
            ntasamensual: res.ntasamensual,
            nyear: res.nyear,
            smonth: res.smonth,
            sgratificacion: nmonth == 3 ? 'No' : 'Si',
            sutilidad: nmonth != 3 ? 'No' : 'Si'
          });
        }
    });
    this.listCuotas.sort((a, b) => (a.ncoutacount > b.ncoutacount) ? 1 : -1);
 }


 valideKey(evt) {
  
  var code = evt.which ? evt.which : evt.keyCode;

  if (code == 8) {
    
    return true;
  } else if (code >= 48 && code <= 57) {
    
    return true;
  } else {
    
    return false;
  }
}
fnValidAmountAditional(evt){

  
  if (evt !== ""){
    this.CalculateTimeLine();

  }
}
onChangeGrati($event) {
  
  if ($event.checked === true ){
    this.itemForm.controls["cobroGratificacion"].setValue('0');      
    this.bshowOtroGrati=true;
  }else{
    this.bshowOtroGrati=false;
  }
}
onChangeUtil($event) {
  
  if ($event.checked === true ){
    this.itemForm.controls["cobroUtilidad"].setValue('0');      
    this.bshowOtroUtil=true;
  }else{
    this.bshowOtroUtil=false;
  }
}


}
