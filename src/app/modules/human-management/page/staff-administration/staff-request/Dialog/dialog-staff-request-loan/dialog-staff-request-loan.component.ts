
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject, ElementRef, ViewEncapsulation } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { environment } from "environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { StaffRequestLoanService } from "@app/data/service/staff-request-loan.service";
import { StaffRequestJustificationTardinessService } from "@app/data/service/staff-request-justification-tardiness.service";
import {listMonths, listYears} from '../../../../../../../data/schema/constants';

import { EmployeeService } from "@app/data/service/employee.service";



@Component({
  selector: "app-dialog-staff-request-loan",
  templateUrl: "dialog-staff-request-loan.component.html",
  styleUrls: ["./dialog-staff-request-loan.component.scss"],
})
export class DialogStaffRequestLoanComponent implements OnInit {
  public itemForm: FormGroup;
  @ViewChild(MatTable) tableApprover: MatTable<any>;
  @ViewChild('fileInput')
  fileInput: ElementRef;
  public progress: number;
  public message: string;
  lstTypeLoan: any[];
  idTypeStaffRequest: number;
  minAmount: number = 0;
  maxAmount: number = 0;
  imageURL = '';
  archivoCapturado: any;
  selectedFile: any;
  displayFileName = '';

  codeEmployee: string = '';
  dateAdmission: string = '';
  fullname: string = '';
  dni: string = '';
  area: string = '';
  charge: string = '';
  fileName = ''
  hideCuota: boolean = false;
  hideCuotaDoble: boolean = true;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  listCuotas: any[];
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
  minimoCantidadCuotas: number = 1;
  habilitarCuotaDoble: boolean = true;
  selectedTerms: boolean = false;
  maximoMonto: number = 0;
  sumaMonto: number = 0;
  sumaInteres: number = 0;
  sumaAmortizacion: number = 0;
  sumaInteresIGV: number = 0;
  sumaCuotaFijaSinIGV: number = 0;
  sumaCuotaTotal: number = 0;
  bshowOtroGrati=false;
  bshowOtroUtil=false;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestLoanComponent>,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private staffRequestLoanService: StaffRequestLoanService,
    private _serviceEmployee: EmployeeService,
    private staffRequestJustificationTradiness: StaffRequestJustificationTardinessService
  ) {
      this.listMonths = listMonths;
      this.listYears = listYears;      
  }

  ngOnInit() {
    this.idTypeStaffRequest = this.data.payload.idTypeStaffRequest;
    this.GetMaxAmount();
    this.GetMaximaCantidadCuotas();
    
  }

  initAmount() {
    if (this.idTypeStaffRequest == 3) {
      this.minAmount = 1;
      this.maxAmount = 4000;
    }
    else {
      this.minAmount = 4001;
      this.maxAmount = this.maximoMonto;
    }
  }

  stopProp(e) {
    e.stopPropagation();
  }

  update(item) {
    item.favorite = true;
  }

  buildItemForm(item) {
    let nextMonth = (new Date()).getMonth() + 2;
    let currentYear = (new Date()).getFullYear();

    if(nextMonth == 13){
      nextMonth = 1;
      currentYear += 1;
    }

    let amountLoan;
    amountLoan = new FormControl(item.amount, [
      Validators.max(this.maxAmount),
      Validators.min(this.minAmount),
      Validators.required
    ]);

    let numberFeeLoan;
    numberFeeLoan = new FormControl('', [
      Validators.max(this.maximaCantidadCuotas),
      Validators.min(1),
      Validators.required
    ]);

    this.codeEmployee = this.data.payload.staffRequest.codeEmployee
    this.dateAdmission = this.data.payload.staffRequest.dateAdmission
    this.fullname = this.data.payload.staffRequest.lastName + ' ' + this.data.payload.staffRequest.motherLastName + ' ' + this.data.payload.staffRequest.names
    this.dni = this.data.payload.staffRequest.dni
    this.area = this.data.payload.staffRequest.area
    this.charge = this.data.payload.staffRequest.charge

    this.itemForm = this.fb.group({
      title: [item.title || null],
      idTypeStaffRequest: item.idTypeStaffRequest,
      staffRequest: [null],
      idEmployee: [item.staffRequest.idEmployee || null],
      idPerson: [item.staffRequest.idPerson || null],
      idCharge: [item.staffRequest.idCharge || null],
      idArea: [item.staffRequest.idArea || null],
      lastName: [item.staffRequest.lastName || null],
      motherLastName: [item.staffRequest.motherLastName || null],
      names: [item.staffRequest.names || null],
      dateAdmission: [item.staffRequest.dateAdmission],
      charge: [item.staffRequest.charge || null],
      dni: [item.staffRequest.dni || null],
      idTypeLoan: [item.idTypeLoan || 0, Validators.required],
      area: [item.staffRequest.area || null],
      detailReasonLoan: [item.staffRequest.detailReasonLoan || null, [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      amount: amountLoan,
      amountMonthlyFee: [item.amountMonthlyFee || 0, Validators.required],
      numberFee: numberFeeLoan,
      id: [item.id || 0],
      ntypecase: ['', [Validators.required]],
      ncoutaselect: [''],
      monthPay: [ item.monthPay || nextMonth.toString().padStart(2, '0'), Validators.required],
      yearPay: [ item.yearPay || currentYear.toString() , Validators.required],
      cobroGratificacion: [ Number(item.cobroGratificacion || '0').toString()],
      cobroUtilidad: [ Number(item.cobroUtilidad || '0').toString()],
      balance: [ item.balance || '0'],
      bGrati:[item.bGrati || false],
      nAddGrati:[ item.nAddGrati || '0'],
      bUtil:[item.bUtil || false],
      nAddUtilidad:[ item.nAddUtilidad || '0'],

      


    });
  }

  changetipo(): void {
    const value = Number(this.itemForm.get('ntypecase').value);

    if ( value === 2) {
      this.hideCuotaDoble = true;
    } else if (value == 1) {
      this.hideCuotaDoble = true;
      this.itemForm.get('ncoutaselect').clearValidators();
      this.itemForm.get('ncoutaselect').updateValueAndValidity();
    } else {
      this.itemForm.controls["numberFee"].setValue(1);
      this.hideCuotaDoble = false;
      this.CalculateAmount();
    }
    this.CalculateTimeLine();
  }

  submit(files) {
    
    if (this.itemForm.invalid) {
      this.snack.open("¡Verifique que los datos ingresados sean correctos!", "OK", { duration: 4000, panelClass: 'center-alert' });
      return Object.values(this.itemForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if (files.length === 0) {
      this.snack.open("¡Es requerido adjuntar el documento!", "OK",
        {
          duration: 4000,
          panelClass: 'center-alert'
        });
      return;
    }

    if(!this.selectedTerms) {
      this.snack.open("¡Debe seleccionar los Términos y Condiciones!", "OK",
        {
          duration: 4000,
          panelClass: 'center-alert'
        });
        return;
    }

    let staffRequest = {
      idTypeStaffRequest: this.itemForm.value.idTypeStaffRequest,
      TypeStaffRequest: this.data.payload.TypeStaffRequest,
      monthPay: this.itemForm.value.monthPay,
      yearPay: this.itemForm.value.yearPay,
      terminosYCond: this.selectedTerms ? 1 : 0,
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
    for (let file of files) {
      formData.append(file.name, file);
    }
    
    formData.append('data', JSON.stringify(this.itemForm.value));

    if (this.itemForm.value.id == 0) {
      this.staffRequestLoanService.add(formData).subscribe(
        (res) => {
          if (res.stateCode == 200) {
            this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
            this.dialogRef.close(false);
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
  }

  load() {
    this.ListCobroGratificacion();
    this.ListCobroUtilidades();
    this.loadTypeLoan();
    this.buildItemForm(this.data.payload);
  }

  loadTypeLoan() {
    this.staffRequestLoanService.getForSelect().subscribe((res) => {
      this.lstTypeLoan = res.data;
    });
  }

  deletefile() {
    this.selectedFile = "";
    this.displayFileName = "";
    this.fileInput.nativeElement.value = "";
    return false;
  }

  onFileChanged(event) {
    if (event.target.files.length === 0) {
      return;
    }

    this.selectedFile = event.target.files[0];
    const nombreArchivo = this.selectedFile.name;
    this.fileName = nombreArchivo;
    this.displayFileName = "<span>" + nombreArchivo + "</span>";

    if (parseInt((event.target.files[0].size / 1024 / 1024).toFixed(1)) > environment.MaxFileSizeMB) {
      this.selectedFile = "";
      this.displayFileName = "";
      this.snack.open('El tamaño máximo permitido es: ' + environment.MaxFileSizeMB + "MB", 'OK', { duration: 4000 });

      return;
    }
    this.archivoCapturado = event.target.files[0];
    this.blobFile(this.archivoCapturado).then((res: any) => {
      this.imageURL = res.base;

    });
  }

  blobFile = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          blob: $event,
          image,
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  CalculateAmount(): void {
    let montoGratificacion = Number(this.itemForm.value.cobroGratificacion);
    let montoUtilidad = Number(this.itemForm.value.cobroUtilidad);

  
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
    this.dataSource = new MatTableDataSource([]);
    this.listCuotas = [];
    
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

    if (this.itemForm.value.id == 0) {
      this.staffRequestLoanService.calculatetimeline(formData).subscribe(
        (res) => {
          
          
          let _montoRestarTotal = 0;
          if (res.stateCode == 200) {
                this.dataSource = res.data.detail;
                this.listCuotas = res.data.detail;
                
              let utilidades = Number(this.itemForm.get('cobroUtilidad').value);

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
           
              let gratificacion = Number(this.itemForm.get('cobroGratificacion').value);
              
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
          } else {
            console.log("Ocurrio un error");
          }
        },
        (err) => { console.log("Ocurrio un error calculatetimeline", err); },
        () => {
        }
      );
    }
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

  GetMaxAmount(): void {
    this._serviceEmployee.ListGenericByKey(environment.keyMaximoMontoPrestamo).subscribe(resp => {
      this.maximoMonto = resp[0].sshort_value;
      this.initAmount();
    },
    (err) => { console.log("Ocurrio un error calculatetimeline", err); },
    () => {
      this.load();
      } 
    )
  }

  onChangeCheck($event) {
    var x = $event.checked;
    
  }

  OnChange($event){ 
    this.selectedTerms = !this.selectedTerms;
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
        nbalance: this.sumaCuotaFijaSinIGV,
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
