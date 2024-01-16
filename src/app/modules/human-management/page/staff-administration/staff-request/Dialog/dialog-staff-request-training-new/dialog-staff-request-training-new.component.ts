import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StaffRequestApproverService } from '@app/data/service/staff-request-approver.service';
import { StaffRequestVacationService } from '@app/data/service/staff-request-vacation.service';
import * as _moment from "moment";
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dialog-staff-request-training-new',
  templateUrl: './dialog-staff-request-training-new.component.html',
  styleUrls: ['./dialog-staff-request-training-new.component.scss']
})
export class DialogStaffRequestTrainingNewComponent implements OnInit {

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

  ntype: any[] = [];
  perfilesGerenteLiderRRHH: number[];
  nid_profile: number = 0;
  permiteEditarRRHH: boolean = false;
  StatusRejected = false; 

  initForm() {
    this.form = this._fs.group({
      nid_request: [''],
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
      ntypetraining: ['', [Validators.required]],
      ntypemodality: ['', [Validators.required]],
      sname: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      ddateinit: ['', [Validators.required]],
      ddateend: ['', [Validators.required]],
      splace: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      starget: ['', [Validators.required]],
      ncost: ['', [Validators.required]],
      spercentage: ['', [Validators.required]],
      sagreement: ['', [Validators.required]],
      nperiod: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      ntype:  ['', [Validators.required]],
      id: [''],
      dni: [''],
      commentEvaluation: ['']   
    })
  }
  listHistoAprobaciones:any[]=[];
  id_employee:number=0;
  id_profile:number=0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestTrainingNewComponent>,
    private _fs: FormBuilder,
    private staffRequestVacationService: StaffRequestVacationService,
    private staffRequestApproverService: StaffRequestApproverService,
    private snack: MatSnackBar,
  ) {
    this.payload = this.data.payload.staffRequest
    console.log("🚀 ~  SEGUIMEINTO-DialogStaffRequestTrainingNewComponent ~ this.payload:", this.payload)
    this.isEdit = this.data.isEdit;
    this.storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_positionUserActual = this.storage.nid_position;
    this.nid_personActual = this.storage.nid_person;
    this.nid_profile = this.storage.nid_profile;
    this.isAceept = this.data.payload.evaluate;
    this.perfilesGerenteLiderRRHH = environment.perfilGerenteLiderRRHH;
    if(this.perfilesGerenteLiderRRHH.indexOf(this.nid_profile) > -1) {
      this.permiteEditarRRHH = true;
    }
    this.id_employee=this.storage.id;
    this.id_profile=this.storage.nid_profile;


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
        ntypetraining: 979,
        ntypemodality: '',
        sname: '',
        ddateinit: '',
        ddateend:'',
        splace:'',
        starget:'',
        ncost: '',
        spercentage: '',
        sagreement: '',
        nperiod: '',
        ntype: '',
        id: this.data.payload.idStaffRequest,
        dni: this.data.payload.staffRequest.dni,
      })

      this.codeEmployee = this.data.payload.staffRequest.codeEmployee
      this.dateAdmission = this.data.payload.staffRequest.dateAdmission
      this.fullname = this.data.payload.staffRequest.lastName + ' ' + this.data.payload.staffRequest.motherLastName + ' ' + this.data.payload.staffRequest.names
      this.dni = this.data.payload.staffRequest.dni
      this.area = this.data.payload.staffRequest.area
      this.charge = this.data.payload.staffRequest.charge
    }

    //Verifica si el usuario ya aprobò
    this.getListAprobaciones();
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
  getDatabyId(): void {
    this.staffRequestVacationService.getbyidCampañaNueva(this.data.payload.id).subscribe(resp => {
      
      this.detail = resp.data;
      this.form.reset({
        nid_request: resp.data.nid_request,
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
        
        ntypetraining: resp.data.ntypetraining,
        ntypemodality: resp.data.ntypemodality.toString(),
        sname: resp.data.sname,
        ddateinit: resp.data.ddateinit,
        ddateend: resp.data.ddateend,
        splace: resp.data.splace,
        starget: resp.data.starget,
        ncost: resp.data.ncost,
        spercentage: resp.data.spercentage,
        sagreement: resp.data.sagreement,
        nperiod: resp.data.nperiod,
        ntype: resp.data.ntype.toString(),
        id: this.data.payload.id,
        dni: this.data.sidentification,
        commentEvaluation: [resp.data.scomment || null],   
      })

      this.StatusRejected = resp.data.nstate === 3;
      this.codeEmployee = resp.data.scodemployee
      this.dateAdmission = _moment(resp.data.dadmissiondate).format('DD/MM/YYYY')
      this.fullname = resp.data.sfullname
      this.dni = resp.data.sidentification
      this.area = resp.data.snamearea
      this.charge = resp.data.snamecharge

      this.staffRequestVacationService.getbyidAdvacementDetail(this.data.payload.id).subscribe(resp => {
        this.listApprover = resp.data;
      })
    })
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


  save() {
    
    if (this.form.invalid) {
      this.snack.open('Es necesario completar todos los campos para poder realizar el registro', 'OK', {
        duration: 3000
      })
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    let staffRequest = {
      idTypeStaffRequest: Number(this.form.value.idTypeStaffRequest),
      staffRequestEmployee: {
        idEmployee: this.form.value.idEmployee,
        idCharge: this.form.value.idCharge,
        dateAdmission: this.form.value.dateAdmission
      }
    };

    this.form.controls["staffRequest"].setValue(staffRequest);
    this.form.get('nid_person').setValue(this.nid_personActual);
    this.form.get('ntypemodality').setValue(Number(this.form.get('ntypemodality').value))
    this.form.get('ntype').setValue(Number(this.form.get('ntype').value))
    this.form.get('nperiod').setValue(Number(this.form.get('nperiod').value))
    if (this.form.get('nid_request').value == '') this.form.get('nid_request').setValue(0);
    else this.form.get('nid_request').setValue(Number(this.form.get('nid_request').value));

    this.staffRequestVacationService.registerTrainingNew(this.form.value).subscribe(resp => {
      if (this.form.get('nid_request').value == '') this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
      else this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  cancel(): void {
    this.dialogRef.close()
  }

  accept(): void {
    let comentario = '';
      if(this.form.value.commentEvaluation == null || this.form.value.commentEvaluation == '' ||
      typeof this.form.value.commentEvaluation == 'undefined'){
        comentario = '';
      } else comentario = this.form.value.commentEvaluation;
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
      comment: comentario
    }

    this.staffRequestApproverService.acceptTrainingNew(payload).subscribe(resp => {
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

    this.staffRequestApproverService.rejectTrainingNew(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  getLevel(){
    let level = this.listApprover.reduce((op, item) => op = op > item.nlevel ? op : item.nlevel, 0);
    return level + 1;
  }

}
