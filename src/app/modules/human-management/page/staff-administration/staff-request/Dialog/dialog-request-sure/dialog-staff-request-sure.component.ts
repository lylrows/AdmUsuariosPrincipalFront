import { environment } from './../../../../../../../../environments/environment.prod';
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { EmployeeService } from "@app/data/service/employee.service";
import { StaffRequestApproverService } from "@app/data/service/staff-request-approver.service";
import { StaffRequestVacationService } from "@app/data/service/staff-request-vacation.service";
import * as _moment from "moment";

@Component({
  selector: 'app-dialog-staff-request-sure',
  templateUrl: './dialog-staff-request-sure.html',
  styleUrls: ['./dialog-staff-request-sure.scss']
})
export class DialogStaffRequestSureComponent implements OnInit {

  listtypeAction = [
    { code: 0, name: 'Desafiliacion' },
    { code: 1, name: 'Afiliacion' }
  ];

  listType: any[] = [];

  title;
  payload;
  form: FormGroup;
  isEdit: boolean = false;
  listApprover: any[] = [];

  codeEmployee: string = '';
  dateAdmission: string = '';
  fullname: string = '';
  dni: string = '';
  area: string = '';
  charge: string = '';

  level: number = 0;
  isAceept: boolean = false;

  storage = null;
  nid_positionUserActual: number = 0;
  nid_personActual: number = 0;

  detail = null;

  idTypeStaffRequest: number = 0;
  nameFile: string = null;

  
  fileName: string = '';
  file: File = null;
  listBeneficiarys: any[];
  StatusRejected = false; 

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
      Isaffiliate: ['', [Validators.required]],
      ntypesure: ['', [Validators.required]],
      id: [''],
      dni: [''],
      nbeneficiary: ['', [Validators.required]],
      commentEvaluation: ['']  
    })
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestSureComponent>,
    private _fs: FormBuilder,
    private staffRequestVacationService: StaffRequestVacationService,
    private staffRequestApproverService: StaffRequestApproverService,
    private _serviceEmployee: EmployeeService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.payload = this.data.payload.staffRequest
    this.isEdit = this.data.isEdit;
    this.isAceept = this.data.payload.evaluate;
    this.storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_positionUserActual = this.storage.nid_position;
    this.nid_personActual = this.storage.nid_person;
    this.initForm();

  }

  ngOnInit(): void {
    this.ListBeneficiarys();
    this.getType();
    if (this.isEdit) {
      this.idTypeStaffRequest = this.data.payload.idTypeStaffRequest;
      this.getDatabyId();
      this.title = this.data.payload.typeStaffRequest;
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
    }
  }

  getType(): void {
    this._serviceEmployee.ListGeneric(966).subscribe(resp => {
      this.listType = resp;
      
    })
  }

  getDatabyId(): void {
    this.staffRequestVacationService.getbyidSure(this.data.payload.id).subscribe(resp => {
      
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
        Isaffiliate: resp.data.isaffiliate === true ? 1 : 0,
        ntypesure: resp.data.ntypesure,
        id: this.data.payload.id,
        dni: this.data.sidentification,
        nbeneficiary: Number(resp.data.nbeneficiary).toString(),
        commentEvaluation: [resp.data.scomment || null],  
      })

      this.StatusRejected = resp.data.nstate === 3;
      this.codeEmployee = resp.data.scodemployee
      this.dateAdmission = _moment(resp.data.dadmissiondate).format('DD/MM/YYYY')
      this.fullname = resp.data.sfullname
      this.dni = resp.data.sidentification
      this.area = resp.data.snamearea
      this.charge = resp.data.snamecharge

      const payload = {
        FileName: '',
        FileUrl: this.detail.sfile,
        ContentType: '',
        File: ''  
      }

      this._serviceEmployee.GetByFile(payload).subscribe(resp => {
        this.nameFile = resp.data.fileName;
      })

      this.staffRequestVacationService.getbyidAdvacementDetail(this.data.payload.id).subscribe(resp => {
        
        this.listApprover = resp.data;
      })
    })
  }

  onFileSelected(event: any) {

    const pddf = event.target.files[0] as File;
    if (['application/pdf'].includes(pddf.type)) {
      
      this.file = pddf;
      this.fileName = this.file.name;
    } else {
      this.snack.open('Solo es permitido pdf', "OK", {
        duration: 4000,
      });

    }
  }


  save() {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if (this.file == null) {
      this.snack.open("¡Es necesario adjuntar pdf!", "OK", { duration: 4000 });
      return;
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
    this.form.get('ntypesure').setValue(Number(this.form.get('ntypesure').value))
    this.form.get('Isaffiliate').setValue(this.form.get('Isaffiliate').value === 0 ? false : true)
    this.form.get('nid_person').setValue(this.nid_personActual);

    const formData = new FormData();
    formData.append('files', this.file);
    formData.append('request', JSON.stringify(this.form.value));

    this.staffRequestVacationService.registerSure(formData).subscribe(resp => {
      
      this.router.navigate(['/humanmanagement/staff-request'], {
        skipLocationChange: true
      })
      this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  ViewAdjuntoDownload(): void {
    const urlFile = this.detail.sfile;

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

  cancel(): void {
    this.dialogRef.close()
  }

  accept(): void {
    this.level = this.getLevel();
    let comentario = '';
    if(this.form.value.commentEvaluation == null || this.form.value.commentEvaluation == '' ||
    typeof this.form.value.commentEvaluation == 'undefined'){
      comentario = '';
    } else comentario = this.form.value.commentEvaluation;

    const payload = {
      nid_request: this.data.payload.id,
      nid_charger: this.nid_positionUserActual,
      nid_employee: this.storage.nid_employee,
      nlevel: this.level,
      nid_person: this.nid_personActual,
      nid_area: this.detail.nid_area,
      nid_receptor: this.detail.nid_person,
      IsAfiliate: this.detail.isaffiliate,
      names: this.detail.sfullname,
      charge: this.detail.snamecharge,
      dni: this.detail.sidentification,
      idTypeStaffRequest: this.idTypeStaffRequest,
      comment: comentario
    }

    this.staffRequestApproverService.acceptSure(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })
  }

  reject(): void {
    //Validar si ingreso comentario
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

    this.staffRequestApproverService.rejectSure(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  downloadFormato(type): void {
    let title;
    let url;
    
    this.staffRequestApproverService.getdocumentURL(type).subscribe(resp => {
      this.ViewAdjunto(resp)
    } )


  }

  ViewAdjunto(url): void {
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

  public base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
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


  getLevel(){
    let level = this.listApprover.reduce((op, item) => op = op > item.nlevel ? op : item.nlevel, 0);
    return level + 1;
  }

  ListBeneficiarys(): void {
    this._serviceEmployee.ListGenericByKey(environment.keyBeneficiarios).subscribe(resp => {
      this.listBeneficiarys = resp;
    })
  }
}