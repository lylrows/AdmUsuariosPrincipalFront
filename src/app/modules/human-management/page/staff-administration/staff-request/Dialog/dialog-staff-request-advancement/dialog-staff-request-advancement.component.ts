import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StaffRequestApproverService } from '@app/data/service/staff-request-approver.service';
import { StaffRequestVacationService } from '@app/data/service/staff-request-vacation.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _moment from "moment";
import { MatCheckboxChange } from '@angular/material/checkbox';
import { StaffRequestService } from '@app/data/service/staff-request.service';
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
import { AppDialogMessageService } from '@app/shared/services/AppDialogMessage/app-dialog-message.service';
@Component({
  selector: 'app-dialog-staff-request-advancement',
  templateUrl: './dialog-staff-request-advancement.component.html',
  styleUrls: ['./dialog-staff-request-advancement.component.scss']
})
export class DialogStaffRequestAdvancementComponent implements OnInit {

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
  StatusRejected = false; 
  idTypeStaffRequest: number = 0;
  selectedTerms: boolean = false;


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
      namount: ['', [Validators.required]],
      nreason: ['', [Validators.required]],
      sdetailreason: ['', [Validators.required]],
      id: [''],
      dni: [''],
      commentEvaluation: ['']   
    })
  }

  listHistoAprobaciones:any[]=[];
  id_employee:number=0;
  id_profile:number=0;
  allowRegister=true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestAdvancementComponent>,
    private _fs: FormBuilder,
    private staffRequestVacationService: StaffRequestVacationService,
    private staffRequestApproverService: StaffRequestApproverService,
    private staffRequestService: StaffRequestService,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private appDialogMessageService: AppDialogMessageService
  ) {
    this.payload = this.data.payload.staffRequest;
    console.log("🚀 ~ DialogStaffRequestAdvancementComponent ~ this.data:", this.data)
    this.isEdit = this.data.isEdit;
    this.isAceept = this.data.payload.evaluate;

    this.storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_positionUserActual = this.storage.nid_position;
    this.nid_personActual = this.storage.nid_person;

    this.id_employee=this.storage.id;
    this.id_profile=this.storage.nid_profile;

    this.initForm();


  }

  ngOnInit(): void {
    if (this.isEdit) {
      this.idTypeStaffRequest = this.data.payload.idTypeStaffRequest;
      this.getDatabyId();
      this.title = this.data.payload.typeStaffRequest;
      
      // Verificamos el usuario ya aprobò
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
        namount: '',
        nreason: '',
        sdetailreason: '',
        id: this.data.payload.idStaffRequest,
        dni: this.data.payload.staffRequest.dni
      });

      this.codeEmployee = this.data.payload.staffRequest.codeEmployee;
      this.dateAdmission = this.data.payload.staffRequest.dateAdmission;
      this.fullname = this.data.payload.staffRequest.lastName + ' ' + this.data.payload.staffRequest.motherLastName + ' ' + this.data.payload.staffRequest.names;
      this.dni = this.data.payload.staffRequest.dni;
      this.area = this.data.payload.staffRequest.area;
      this.charge = this.data.payload.staffRequest.charge;

      //Verifica si puede registrar adelanto sueldo
      this.getValidateDaysAdelantoSueldo();

    }

  }

  getValidateDaysAdelantoSueldo()
  {
    const payload={
      nidemployee:this.id_employee
    }
    debugger;
    this.allowRegister=true;
    this.staffRequestService.getStaffRequestValidateDaysAdelantoSueldo(payload).subscribe(res => {
      console.log("🚀 ~ SUELDO: DialogStaffRequestAdvancementComponent ~ res:", res)
      if(res.data.bexistsregister){
        if(res.data.ntotal_dias<90){
          this.allowRegister=false;
          let days=res.data.ntotal_dias;
          // this.isEdit=true;
          this.appDialogMessageService
          .confirm({
            title: "¡Aviso!",
            message: "Debe transcurrir un periodo de 90 días desde la última vez que registró una solicitud antes de que pueda presentar otra solicitud.",
            body: "Tiempo que ha pasado desde la última solicitud presentada: " +days.toString() + " días",
          })
          .subscribe((result) => {
            if (result) {
            console.log("🚀 ~ CONFIRM-DialogStaffRequestAdvancementComponent ~ .subscribe ~ result:", result)
              this.cancel();

            }
          });
        }
      }
      

    });
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
    this.staffRequestVacationService.getbyidAdvacement(this.data.payload.id).subscribe(resp => {
      
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
        namount: resp.data.namount,
        nreason: resp.data.nreason.toString(),
        sdetailreason: resp.data.sdetailreason,
        id: this.data.payload.id,
        dni: this.data.sidentification,
        commentEvaluation: resp.data.scomment   
      })

      this.selectedTerms = true;
      this.codeEmployee = resp.data.scodemployee
      this.dateAdmission = _moment(resp.data.dadmissiondate).format('DD/MM/YYYY')
      this.fullname = resp.data.sfullname
      this.dni = resp.data.sidentification
      this.area = resp.data.snamearea
      this.charge = resp.data.snamecharge  

      this.staffRequestVacationService.getbyidAdvacementDetail(this.data.payload.id).subscribe(resp => {
        
        this.listApprover = resp.data;
        this.StatusRejected = this.detail.nstate === 3 || this.detail.nstate == 4;
      })
    })
  }

  


  save() {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
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
      idTypeStaffRequest: this.form.value.idTypeStaffRequest,
      terminosYCond: this.selectedTerms ? 1 : 0,
      staffRequestEmployee: {
        idEmployee: this.form.value.idEmployee,
        idCharge: this.form.value.idCharge,
        dateAdmission: this.form.value.dateAdmission
      }
    };

    this.form.controls["staffRequest"].setValue(staffRequest);
    this.form.get('nreason').setValue(Number(this.form.get('nreason').value))
    this.form.get('nid_person').setValue(this.nid_personActual);
    this.staffRequestVacationService.registerAdvacement(this.form.value).subscribe(resp => {
      this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  cancel(): void {
    this.dialogRef.close()
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

    this.staffRequestApproverService.acceptAdvacement(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })
  }

  reject(): void {//Validar si ingreso comentario
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

    this.staffRequestApproverService.rejectAdvacement(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  getLevel(){
    let level = this.listApprover.reduce((op, item) => op = op > item.nlevel ? op : item.nlevel, 0);
    return level + 1;
  }

  OnChange($event){ 
    this.selectedTerms = !this.selectedTerms;
   }

   showOptions(event:MatCheckboxChange): void {
    
    this.selectedTerms = event.checked;
  }
}
