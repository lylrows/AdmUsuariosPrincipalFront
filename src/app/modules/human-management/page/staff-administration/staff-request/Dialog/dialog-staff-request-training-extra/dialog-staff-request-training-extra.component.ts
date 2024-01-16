import { environment } from 'environments/environment';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StaffRequestApproverService } from '@app/data/service/staff-request-approver.service';
import { StaffRequestVacationService } from '@app/data/service/staff-request-vacation.service';
import * as _moment from "moment";
import { EmployeeService } from '@app/data/service/employee.service';

@Component({
  selector: 'app-dialog-staff-request-training-extra',
  templateUrl: './dialog-staff-request-training-extra.component.html',
  styleUrls: ['./dialog-staff-request-training-extra.component.scss']
})
export class DialogStaffRequestTrainingExtraComponent implements OnInit {

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
  permitEdit: boolean = false;
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

      ntypetraining: ['', [Validators.required]],
      ntypemodality: ['', [Validators.required]],
      sname: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      sorganizer: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      ddateinit: ['', [Validators.required]],
      ddateend: ['', [Validators.required]],
      splace: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      schedule: ['', [Validators.required]],
      starget: ['', [Validators.required]],

      ncostevent: ['', [Validators.required]],
      ncostpassage: ['', [Validators.required]],
      ncostaccommodation: ['', [Validators.required]],
      ncostfeeding: ['', [Validators.required]],
      sothercost: [null],
      nothercost: [null],

      sbenefits: ['', [Validators.required]],
      nannualbudget: ['', [Validators.required]],
      nbudget: ['', [Validators.required]],
      nsteppedout: ['', [Validators.required]],
      ninvestment: ['', [Validators.required]],
      nnewbalance: ['', [Validators.required]],
      id: [''],
      dni: [''],
      commentEvaluation: ['']
    });
    
    if(!this.isEdit) {
      this.form.get('ncostevent').clearValidators();  
      this.form.get('ncostpassage').clearValidators();  
      this.form.get('ncostaccommodation').clearValidators();  
      this.form.get('ncostfeeding').clearValidators();  
      this.form.get('nothercost').clearValidators();  
      this.form.get('starget').clearValidators();  
      this.form.get('sbenefits').clearValidators();  
      this.form.get('nannualbudget').clearValidators();  
      this.form.get('nbudget').clearValidators();  
      this.form.get('nsteppedout').clearValidators();  
      this.form.get('ninvestment').clearValidators();  
      this.form.get('nnewbalance').clearValidators();  
    }
  }

  listHistoAprobaciones:any[]=[];
  id_employee:number=0;
  id_profile:number=0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestTrainingExtraComponent>,
    private _fs: FormBuilder,
    private staffRequestVacationService: StaffRequestVacationService,
    private staffRequestApproverService: StaffRequestApproverService,
    private snack: MatSnackBar,
    private _serviceEmployee: EmployeeService
  ) {
    
    this.payload = this.data.payload.staffRequest
    this.isEdit = this.data.isEdit;
    this.isAceept = this.data.payload.evaluate;
    this.storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_positionUserActual = this.storage.nid_position;
    this.nid_personActual = this.storage.nid_person;

    this.id_employee=this.storage.id;
    this.id_profile=this.storage.nid_profile;

    this.GetRequestIsEdit();
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
        ntypemodality: 982,

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
    this.staffRequestVacationService.getbyidCampañaExtra(this.data.payload.id).subscribe(resp => {
      
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

        ntypetraining: resp.data.ntypetraining,
        ntypemodality: resp.data.ntypemodality,

        sname: resp.data.sname,
        sorganizer: resp.data.sorganizer,
        ddateinit: resp.data.ddateinit,
        ddateend: resp.data.ddateend,
        splace: resp.data.splace,
        schedule: resp.data.schedule,
        starget: resp.data.starget,

        ncostevent: resp.data.ncostevent,
        ncostpassage: resp.data.ncostpassage,
        ncostaccommodation: resp.data.ncostaccommodation,
        ncostfeeding: resp.data.ncostfeeding,
        sothercost: resp.data.sothercost,
        nothercost: resp.data.nothercost,

        sbenefits: resp.data.sbenefits,
        nannualbudget: resp.data.nannualbudget,
        nbudget: resp.data.nbudget,
        nsteppedout: resp.data.nsteppedout,
        ninvestment: resp.data.ninvestment,
        nnewbalance: resp.data.nnewbalance,

        id: this.data.payload.id,
        dni: this.data.sidentification,
        commentEvaluation: [resp.data.scomment || null]   
      });

      if(this.permitEdit) {
        if (this.form.get('ncostevent').value == 0) this.form.get('ncostevent').setValue('');
        if (this.form.get('ncostpassage').value == 0) this.form.get('ncostpassage').setValue('');
        if (this.form.get('ncostaccommodation').value == 0) this.form.get('ncostaccommodation').setValue('');
        if (this.form.get('ncostfeeding').value == 0) this.form.get('ncostfeeding').setValue('');
        if (this.form.get('nothercost').value == 0) this.form.get('nothercost').setValue('');
        if (this.form.get('starget').value == 0) this.form.get('starget').setValue('');
        if (this.form.get('sbenefits').value == 0) this.form.get('sbenefits').setValue('');
        if (this.form.get('nannualbudget').value == 0) this.form.get('nannualbudget').setValue('');
        if (this.form.get('nbudget').value == 0) this.form.get('nbudget').setValue('');
        if (this.form.get('nsteppedout').value == 0) this.form.get('nsteppedout').setValue('');
        if (this.form.get('ninvestment').value == 0) this.form.get('ninvestment').setValue('');
        if (this.form.get('nnewbalance').value == 0) this.form.get('nnewbalance').setValue('');
      }

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

    
    if(!this.isEdit) {
      this.form.get('ncostevent').setValue(0);
      this.form.get('ncostpassage').setValue(0);
      this.form.get('ncostaccommodation').setValue(0);
      this.form.get('ncostfeeding').setValue(0);
      this.form.get('nothercost').setValue(0);
      this.form.get('starget').setValue('0');
      this.form.get('sbenefits').setValue('0');
      this.form.get('nannualbudget').setValue(0);
      this.form.get('nbudget').setValue(0);
      this.form.get('nsteppedout').setValue(0);
      this.form.get('ninvestment').setValue(0);
      this.form.get('nnewbalance').setValue(0);
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
    this.staffRequestVacationService.registerTrainingExtra(this.form.value).subscribe(resp => {
      this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
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

    this.staffRequestApproverService.acceptTrainingExtra(payload).subscribe(resp => {
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

    this.staffRequestApproverService.rejectTrainingExtra(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  getLevel() {
    let level = this.listApprover.reduce((op, item) => op = op > item.nlevel ? op : item.nlevel, 0);
    return level + 1;
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

  edit(): void {
    
    if (this.form.invalid) {
      this.snack.open('Es necesario completar todos los campos para poder realizar el registro', 'OK', {
        duration: 3000
      })
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    let staffRequest = {
      idTypeStaffRequest: 0,
      Id: this.data.payload.id,
      staffRequestEmployee: {
        idEmployee: this.form.value.idEmployee,
        idCharge: this.form.value.idCharge,
        dateAdmission: this.form.value.dateAdmission
      }
    };

    
    this.form.controls["staffRequest"].setValue(staffRequest);
    this.form.get('nid_person').setValue(this.nid_personActual);
    this.staffRequestVacationService.updateTrainingExtra(this.form.value).subscribe(resp => {
      this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })
  }
}
