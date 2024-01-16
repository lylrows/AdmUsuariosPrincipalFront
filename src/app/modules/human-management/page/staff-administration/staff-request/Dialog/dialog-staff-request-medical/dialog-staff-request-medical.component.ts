import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '@app/data/service/employee.service';
import { StaffRequestApproverService } from '@app/data/service/staff-request-approver.service';
import { StaffRequestVacationService } from '@app/data/service/staff-request-vacation.service';
import * as _moment from "moment";

@Component({
  selector: 'app-dialog-staff-request-medical',
  templateUrl: './dialog-staff-request-medical.component.html',
  styleUrls: ['./dialog-staff-request-medical.component.scss']
})
export class DialogStaffRequestMedicalComponent implements OnInit {

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

  codeEmployee: string = '';
  dateAdmission: string = '';
  fullname: string = '';
  dni: string = '';
  area: string = '';
  charge: string = '';

  fileName: string = '';
  file: File = null;

  listbank: any[] = [];
  nameFile: string = null;

  idTypeStaffRequest: number = 0;

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
      dbroadcastdate: ['', [Validators.required]],
      ddateinit: ['', [Validators.required]],
      ddateend: ['', [Validators.required]],
      sdiagnosis: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      sclinicruc: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(11), Validators.maxLength(11)]],
      tutiondoctor: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      originmedical: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      typemedical: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      sdeliverycommitment: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      semailsocialwelfare: ['', [Validators.required, Validators.email]],
      id: [''],
      dni: ['']
    })
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestMedicalComponent>,
    private _fs: FormBuilder,
    private staffRequestVacationService: StaffRequestVacationService,
    private staffRequestApproverService: StaffRequestApproverService,
    private snack: MatSnackBar,
    private _serviceEmployee: EmployeeService,
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

  cancel(): void {
    this.dialogRef.close()
  }

  onFileSelected(event: any) {

    const pddf = event.target.files[0] as File;
    if (['image/jpeg', 'image/jpg', 'image/png'].includes(pddf.type)) {
      
      this.file = pddf;
      this.fileName = this.file.name;
    } else {
      this.snack.open('Solo es permitido imagenes', "OK", {
        duration: 4000,
      });

    }
  }

  validDateActual(): void {
    const valueStart = new Date();
    const valueEnd = this.form.get('dbroadcastdate').value;

    const valueEndDate = new Date(valueEnd);

    const valid = valueEndDate > valueStart;

    if (!valid) {
      this.snack.open("¡Es necesario que la fecha sea mayor a la fecha actual!", "OK", { duration: 4000 });
      this.form.get('dbroadcastdate').setValue(null)
    }
  }

  validDateStart(): void {
    const valueStart = new Date();
    const valueEnd = this.form.get('ddateinit').value;

    const valueEndDate = new Date(valueEnd);

    const valid = valueEndDate > valueStart;

    if (!valid) {
      this.snack.open("¡Es necesario que la fecha sea mayor a la fecha actual!", "OK", { duration: 4000 });
      this.form.get('ddateinit').setValue(null)
    }
  }

  validDateEnd(): void {
    const valueStart = this.form.get('ddateinit').value;
    const valueEnd = this.form.get('ddateend').value;

    if (valueStart != null) {

      const valueStartDate = new Date(valueStart);
      const valueEndDate = new Date(valueEnd);

      const valid = valueEndDate > valueStartDate;

      if (!valid) {
        this.snack.open("¡Es necesario que la fecha fin sea mayor a la fecha inicio!", "OK", { duration: 4000 });
        this.form.get('ddateend').setValue(null)
      }

    } else {
      this.snack.open("¡Es necesario primero seleccionar una fecha inicio!", "OK", { duration: 4000 });
      this.form.get('ddateend').setValue(null)
    }
  }

  getDatabyId(): void {
    this.staffRequestVacationService.getbyidMedical(this.data.payload.id).subscribe(resp => {
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
        dbroadcastdate: resp.data.dbroadcastdate,
        ddateinit: resp.data.ddateinit,
        ddateend: resp.data.ddateend,
        sdiagnosis: resp.data.sdiagnosis,
        sclinicruc: resp.data.sclinicruc,
        tutiondoctor: resp.data.tuitiondoctor,
        originmedical: resp.data.originmedical,
        typemedical: resp.data.typemedical,
        sdeliverycommitment: resp.data.sdeliverycommitment,
        semailsocialwelfare: resp.data.semaisocialwelfare,
        id: this.data.payload.id,
        dni: this.data.sidentification
      })

      this.codeEmployee = resp.data.scodemployee
      this.dateAdmission = _moment(resp.data.dadmissiondate).format('DD/MM/YYYY')
      this.fullname = resp.data.sfullname
      this.dni = resp.data.sidentification
      this.area = resp.data.snamearea
      this.charge = resp.data.snamecharge

      const payload = {
        FileName: '',
        FileUrl: this.detail.listmedical,
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

  ViewAdjunto(): void {
    const urlFile = this.detail.listmedical;

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
      idTypeStaffRequest: this.idTypeStaffRequest
    }

    this.staffRequestApproverService.acceptMedico(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })
  }

  reject(): void {
    this.level = this.getLevel();
    const payload = {
      nid_request: this.data.payload.id,
      nid_person: this.nid_personActual,
      nid_area: this.detail.nid_area,
      nid_receptor: this.detail.nid_person,
      idTypeStaffRequest: this.idTypeStaffRequest,
      nid_charger: this.nid_positionUserActual,
      nid_employee: this.storage.nid_employee,
      nlevel: this.level
    }

    this.staffRequestApproverService.rejectMedico(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  save() {

    if (this.file == null) {
      this.snack.open("¡Es necesario adjuntar foto!", "OK", { duration: 4000 });
      return;
    }

    if (this.form.invalid) {
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
    formData.append('request', JSON.stringify(this.form.value));

    this.staffRequestVacationService.registerMedical(formData).subscribe(resp => {
      this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  getLevel(){
    let level = this.listApprover.reduce((op, item) => op = op > item.nlevel ? op : item.nlevel, 0);
    return level + 1;
  }

}
