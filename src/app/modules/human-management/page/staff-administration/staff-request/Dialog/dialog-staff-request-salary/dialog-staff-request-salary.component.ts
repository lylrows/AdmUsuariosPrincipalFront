import { environment } from 'environments/environment';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '@app/data/service/employee.service';
import { PostulantFileService } from '@app/data/service/PostulantFileService';
import { StaffRequestApproverService } from '@app/data/service/staff-request-approver.service';
import { StaffRequestVacationService } from '@app/data/service/staff-request-vacation.service';
import * as _moment from "moment";

@Component({
  selector: 'app-dialog-staff-request-salary',
  templateUrl: './dialog-staff-request-salary.component.html',
  styleUrls: ['./dialog-staff-request-salary.component.scss']
})
export class DialogStaffRequestSalaryComponent implements OnInit {

  title;
  payload;
  form: FormGroup;
  isEdit: boolean = false;
  listApprover: any[] = [];

  level: number = 0;
  isAceept: boolean = false;

  storage = null;
  nid_positionUserActual: number = 0;
  nid_personActual: number = 0;

  detail = null;
  StatusRejectedAccepted = false; 

  codeEmployee: string = '';
  dateAdmission: string = '';
  fullname: string = '';
  dni: string = '';
  area: string = '';
  charge: string = '';

  fileName: string = '';
  file: File = null;

  fileNameFicha: string = '';
  fileFicha: File = null;

  listbank: any[] = [];
  listbankDestin: any[] = [];

  nameFile: string = null;
  nameFileFicha: string = null;

  idTypeStaffRequest: number = 0;
  listCurrency: any[];
  listDestinCurrency: any[];
  showMessageCaja = false;

  initForm() {
    this.form = this._fs.group({
      title: [''],
      idTypeStaffRequest: [''],
      staffRequest: [''],
      idEmployee: [''],
      nid_collaborator: [''],
      nid_person: [''],
      idCharge: [''],
      lastName: [''],
      motherLastName: [''],
      names: [''],
      charge: [''],
      dateAdmission: [''],
      area: [''],
      ddatechange: ['', [Validators.required]],
      sbank: ['', [Validators.required]],
      saccountnumber: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(25)]],
      id: [''],
      dni: [''],
      saccountccinumber:[''], 
      scurrency: ['1', [Validators.required]],
      commentEvaluation: ['']  ,
      sdestincurrency: ['1', [Validators.required]],
      sbankdestin: ['', [Validators.required]],
    })
  }
  allowed_banks=["BBVA","BCP","SBK","IBK"];

  listHistoAprobaciones:any[]=[];
  id_employee:number=0;
  id_profile:number=0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestSalaryComponent>,
    private _fs: FormBuilder,
    private staffRequestVacationService: StaffRequestVacationService,
    private staffRequestApproverService: StaffRequestApproverService,
    private snack: MatSnackBar,
    private _serviceEmployee: EmployeeService,
    private postulantFileService: PostulantFileService
  ) {
    this.payload = this.data.payload.staffRequest;

    this.isEdit = this.data.isEdit;
    this.storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_positionUserActual = this.storage.nid_position;
    this.nid_personActual = this.storage.nid_person;
    this.isAceept = this.data.payload.evaluate;

    this.ListCurrency();
    this.ListDestinCurrency();
    this.initForm();
    
  }

  ngOnInit(): void {
    this.listBank();
    this.listBankDestin();
    if (this.isEdit) {
      this.idTypeStaffRequest = this.data.payload.idTypeStaffRequest;
      this.getDatabyId();
      this.title = this.data.payload.typeStaffRequest;
      
      // Verifica si el usuario ya aprobò 
      this.getListAprobaciones();
    } else {
      this.title = this.data.title;
      this.form.reset({
        title: this.data.payload.title,
        idTypeStaffRequest: this.data.payload.idTypeStaffRequest,
        staffRequest: '',
        idEmployee: this.data.payload.staffRequest.idEmployee,
        nid_collaborator: this.data.payload.staffRequest.idEmployee,
        idCharge: this.data.payload.staffRequest.idCharge,
        lastName: this.data.payload.staffRequest.lastName,
        motherLastName: this.data.payload.staffRequest.motherLastName,
        names: this.data.payload.staffRequest.names,
        charge: this.data.payload.staffRequest.charge,
        dateAdmission: this.data.payload.staffRequest.dateAdmission,
        area: this.data.payload.staffRequest.area,
        dni: this.data.payload.staffRequest.dni,
        id: this.data.payload.idStaffRequest
      })

      this.codeEmployee = this.data.payload.staffRequest.codeEmployee
      this.dateAdmission = this.data.payload.staffRequest.dateAdmission
      this.fullname = this.data.payload.staffRequest.lastName + ' ' + this.data.payload.staffRequest.motherLastName + ' ' + this.data.payload.staffRequest.names
      this.dni = this.data.payload.staffRequest.dni
      this.area = this.data.payload.staffRequest.area
      this.charge = this.data.payload.staffRequest.charge
      
      this.form.get('sbank').setValue(this.payload.codeBank);
      this.form.get('saccountnumber').setValue(this.payload.accountBank);
      
      this.form.get('saccountccinumber').setValue('');
      if(this.payload.currencyAccountBank==="0"){
        this.form.get('scurrency').setValue("1");

      }else{
        this.form.get('scurrency').setValue("2");

      }

    }

  }

  getListAprobaciones()
  {
    this.staffRequestApproverService.getlistbyid(this.data.payload.id).subscribe(res => {
      this.listHistoAprobaciones=res.data;
      this.listHistoAprobaciones.map((e) => {
        if(e.idEmployee===this.id_employee || e.idProfile===this.id_profile){
          this.isAceept = false;
        }
      });

    });
  }


  cancel(): void {
    this.dialogRef.close()
  }

  validDate(): void {
    
    var today = new Date();
    const valueStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const valueEnd = this.form.get('ddatechange').value;

    const valueEndDate = new Date(valueEnd);
    

    const valid = valueEndDate >= valueStart;

    if (!valid) {
      this.snack.open("¡Es necesario que la fecha sea mayor a la fecha actual!", "OK", { duration: 4000 });
      this.form.get('ddatechange').setValue(null);
    }
  }

  getDatabyId(): void {
    this.staffRequestVacationService.getbyidSalary(this.data.payload.id).subscribe(resp => {
      
      
      this.detail = resp.data;
      this.form.reset({
        title: '',
        idTypeStaffRequest: '',
        staffRequest: '',
        idEmployee: resp.data.nid_collaborator,
        nid_collaborator: resp.data.nid_collaborator,
        idCharge: 0,
        lastName: '',
        motherLastName: '',
        names: '',
        charge: resp.data.snamecharge,
        dateAdmission: resp.data.dadmissiondate,
        area: resp.data.snamearea,
        ddatechange: resp.data.ddatechange ,
        sbank: resp.data.sbank ,
        saccountnumber:resp.data.saccountnumber,
        id: this.data.payload.id,
        dni: this.data.sidentification,
        saccountccinumber: resp.data.saccountccinumber,
        scurrency: resp.data.scurrency,
        commentEvaluation: resp.data.scomment,
        sdestincurrency: resp.data.sdestincurrency,
        sbankdestin: resp.data.sbankdestin
      })

      this.codeEmployee = resp.data.scodemployee
      this.dateAdmission = _moment(resp.data.dadmissiondate).format('DD/MM/YYYY')
      this.fullname = resp.data.sfullname
      this.dni = resp.data.sidentification
      this.area = resp.data.snamearea
      this.charge = resp.data.snamecharge

      const payload = {
        FileName: '',
        FileUrl: this.detail.sdniurl,
        ContentType: '',
        File: ''
      }

      this._serviceEmployee.GetByFile(payload).subscribe(resp => {
        this.nameFile = resp.data.fileName;
      })

      const payloadFile = {
        FileName: '',
        FileUrl: this.detail.sfile,
        ContentType: '',
        File: ''
      }

      this._serviceEmployee.GetByFile(payloadFile).subscribe(resp => {
        this.nameFileFicha = resp.data.fileName;
      })
      this.StatusRejectedAccepted = this.detail.nstate == 3 || this.detail.nstate == 4;
    });
  }



  listBank(): void {
    
    this.postulantFileService.getexactusbank().subscribe(resp => {
      this.listbank = resp.data;
     
    });
  }

  listBankDestin(): void {
    
    this.postulantFileService.getexactusbank().subscribe(resp => {
      this.listbankDestin = resp.data;
     
    });
  }
  onFileSelected(event: any) {

    const pddf = event.target.files[0] as File;
    if (['image/jpeg', 'image/jpg', 'image/png','application/pdf'].includes(pddf.type)) {
      
      this.file = pddf;
      this.fileName = this.file.name;
    } else {
      this.snack.open('Solo es permitido imagenes y pdfs', "OK", {
        duration: 4000,
      });

    }
  }

  onFileSelectedFicha(event: any) {

    const pddf = event.target.files[0] as File;
    
    if (['application/pdf'].includes(pddf.type)) {
      
      this.fileFicha = pddf;
      this.fileNameFicha = this.fileFicha.name;
    } else {
      this.snack.open('Solo es permitido pdf', "OK", {
        duration: 4000,
      });

    }
  }

  ViewAdjunto(): void {
    const urlFile = this.detail.sdniurl;

    if ( urlFile != null ) {

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

  ViewAdjuntoFicha(): void {
    const urlFile = this.detail.sfile;

    if ( urlFile != null ) {

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

  public base64ToBlob(b64Data, contentType='', sliceSize=512) {
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
    return new Blob(byteArrays, {type: contentType});
  }

  
  save() {

    if ( this.file == null ) {
      this.snack.open("¡Es necesario adjuntar foto o pdf de dni!", "OK", { duration: 4000 });
      return;
    }

    if ( this.fileFicha == null ) {
      this.snack.open("¡Es necesario adjuntar pdf de ficha de autorizacion!", "OK", { duration: 4000 });
      return;
    }

    if (this.form.invalid || this.showMessageCaja) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    let staffRequest = {
      idTypeStaffRequest: this.form.value.idTypeStaffRequest,
      staffRequestEmployee: {
        idEmployee: this.form.value.idEmployee,
        idCharge: this.form.value.idCharge,
        dateAdmission: this.form.value.dateAdmission
      }
    };

    this.form.controls["staffRequest"].setValue(staffRequest);
    this.form.get('nid_person').setValue(this.nid_personActual);

    const formData = new FormData();
    formData.append('files', this.file);
    formData.append('filesFile', this.fileFicha);
    formData.append('request', JSON.stringify(this.form.value));

    this.staffRequestVacationService.registerSalary(formData).subscribe(resp => {
      this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  accept(): void {
    this.level = this.getLevel();
    const payload = {
      nid_request: this.data.payload.id,
      nid_charger: this.nid_positionUserActual,
      nid_employee: this.storage.nid_employee,
      nlevel: this.level,
      nid_person: this.nid_personActual,
      nid_area: this.detail.nid_area,
      nid_receptor: this.detail.nid_person,
      names: this.detail.sfullname,
      charge: this.detail.snamecharge,
      dni: this.detail.sidentification,
      idTypeStaffRequest: this.idTypeStaffRequest,
      comment: this.form.value.commentEvaluation
    }

    this.staffRequestApproverService.acceptSalary(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })
  }

  reject(): void {
    if(this.form.value.commentEvaluation == null || this.form.value.commentEvaluation == '' ||
    typeof this.form.value.commentEvaluation == 'undefined'){
      this.snack.open("¡El comentario es obligatorio al rechazar una solicitud!", "OK", { duration: 4000 });
      return;
    }
    this.level = this.getLevel();
    const payload = {
      nid_request: this.data.payload.id,
      nid_person: this.nid_personActual,
      nid_area: this.detail.nid_area, 
      nid_receptor: this.detail.nid_person,
      idTypeStaffRequest: this.idTypeStaffRequest,
      nid_charger: this.nid_positionUserActual,
      nid_employee: this.storage.nid_employee,
      nlevel: this.level,
      comment: this.form.value.commentEvaluation
    }

    this.staffRequestApproverService.rejectSalary(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  getLevel(){
    let level = this.listApprover.reduce((op, item) => op = op > item.nlevel ? op : item.nlevel, 0);
    return level + 1;
  }

  ListCurrency(): void {
    this._serviceEmployee.ListGenericByKey(environment.keyCurrency).subscribe(resp => {
      this.listCurrency = resp;
    })
  }

  ListDestinCurrency(): void {
    this._serviceEmployee.ListGenericByKey(environment.keyCurrency).subscribe(resp => {
      this.listDestinCurrency = resp;
    })
  }
  downloadFormato(type): void {
    this.staffRequestApproverService.getdocumentURL(type).subscribe(resp => {
      this.ViewAdjuntoURL(resp)
    } )
  }

  ViewAdjuntoURL(url): void {
    const urlFile = url;

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
      this.snack.open('No se pudo descargar el archivo', "OK", {
        duration: 4000,
      });
    }
  }

  changeBanco() {   
    // this.showMessageCaja =  this.form.controls["sbankdestin"].value == 'CAJA';
    if(this.allowed_banks.includes(this.form.controls["sbankdestin"].value))
    {
      this.showMessageCaja = false;
    }else {
      this.showMessageCaja = true;
    }
  }
}
