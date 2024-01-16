import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StaffRequestApproverService } from '@app/data/service/staff-request-approver.service';
import { StaffRequestVacationService } from '@app/data/service/staff-request-vacation.service';
import * as _moment from "moment";

@Component({
  selector: 'app-dialog-staff-request-sepelio',
  templateUrl: './dialog-staff-request-sepelio.component.html',
  styleUrls: ['./dialog-staff-request-sepelio.component.scss']
}) 
export class DialogStaffRequestSepelioComponent implements OnInit {

  Sepultura_25 = false;
  Sepultura_50 = false;
  Funerario_25 = false;
  Funerario_35 = false;
  Funerario_45 = false;
  Funerario_50 = false;
  Inhumacion_50 = true;
  Otros_50 = false;
  Otros_75 = false;

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
  

  idTypeStaffRequest: number = 0;
  selectedServiciosepultura: boolean = false;
  selectedServiciofunerario: boolean = false;
  selectedCeremoniainhumacion: boolean = false;
  selectedOtros: boolean = false;
  StatusRejected = false; 
  nidemployeeactual=0;
  bUsuarioActualEsSolicitante=false;
  bMostrarServicioFunerario=true;
  readOnlyView=false;

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
      ntypeservice: [''],
      observations: ['', [Validators.required]],
      bmeetrequirements: [''],
      id: [''],
      dni: [''],
      serviciosepultura: [''],
      serviciofunerario: [''],
      ceremoniainhumacion: [''],
      otros: [''],
      commentEvaluation: ['']
    })
  }

  listHistoAprobaciones:any[]=[];
  id_employee:number=0;
  id_profile:number=0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestSepelioComponent>,
    private _fs: FormBuilder,
    private staffRequestVacationService: StaffRequestVacationService,
    private staffRequestApproverService: StaffRequestApproverService,
    private snack: MatSnackBar,
  ) {
    this.payload = this.data.payload.staffRequest
    this.isEdit = this.data.isEdit;
    this.storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.isAceept = this.data.payload.evaluate;
    this.nid_positionUserActual = this.storage.nid_position;
    this.nid_personActual = this.storage.nid_person;
    this.nidemployeeactual = this.storage.nid_employee;
    this.readOnlyView= this.data.payload.readOnlyView;

    this.id_employee=this.storage.id;
    this.id_profile=this.storage.nid_profile;
   
    this.initForm();
  }

  ngOnInit(): void {
    
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
    }

    if (Number(this.form.get('nid_collaborator').value)  === this.nidemployeeactual){
      this.bUsuarioActualEsSolicitante=true;

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

  getDatabyId(): void {
    
    this.staffRequestVacationService.getbyidBurial(this.data.payload.id).subscribe(resp => {
      
      this.detail = resp.data;
      const typeservice = resp.data.ntypeservice;
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
        ntypeservice: typeservice.toString(),
        observations: resp.data.sobservations,
        // bmeetrequirements: resp.data.bmeetrequirements === true ? '1' : '0',
        bmeetrequirements: '1',
        id: this.data.payload.id,
        dni: this.data.sidentification,
        serviciosepultura: this.data.serviciosepultura,
        serviciofunerario: this.data.serviciofunerario,
        ceremoniainhumacion: this.data.ceremoniainhumacion,
        otros: this.data.otros,
        commentEvaluation: resp.data.scomment
      })
      switch(resp.data.serviciofunerarioporc){
        case 25:
          this.Funerario_25 = true;
          break;
        case 35:
          this.Funerario_35 = true;
          break;
        case 45:
          this.Funerario_45 = true;
          break;
        case 50:
          this.Funerario_50 = true;
          break;
      }

      switch(resp.data.serviciosepulturaporc){
        case 25:
          this.Sepultura_25 = true;
          break;
        case 50:
          this.Sepultura_50 = true;
          break;
      }

      switch(resp.data.otrosporc){
        case 50:
          this.Otros_50 = true;
          break;
        case 75:
          this.Otros_75 = true;
          break;
      }

      
      this.StatusRejected = resp.data.nstate === 3;

      
    if (Number(this.form.get('nid_collaborator').value)  === this.nidemployeeactual){
      
      this.bUsuarioActualEsSolicitante=true;
      
      
      if (this.isEdit){
        this.bMostrarServicioFunerario= false;
        
      }
      

    }
   
      this.selectedServiciosepultura = this.detail.serviciosepultura;
 
  
      this.selectedServiciofunerario = this.detail.serviciofunerario;

      

      this.selectedCeremoniainhumacion = this.detail.ceremoniainhumacion;
      this.selectedOtros = this.detail.otros;

      this.codeEmployee = resp.data.scodemployee
      this.dateAdmission = _moment(resp.data.dadmissiondate).format('DD/MM/YYYY')
      this.fullname = resp.data.sfullname
      this.dni = resp.data.sidentification
      this.area = resp.data.snamearea
      this.charge = resp.data.snamecharge

      this.staffRequestVacationService.getbyidAdvacementDetail(this.data.payload.id).subscribe(resp => {
        
        this.listApprover = resp.data;

        if (this.listApprover.length>0){
          this.bMostrarServicioFunerario= true;
        }
      })
    });
  }

  checkedServicioFunerario($event) {
    this.selectedServiciofunerario = $event.checked;
  }

  save() {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }


    let checkedcount = false;

    if (this.form.get('serviciosepultura').value === true ||
      this.form.get('serviciofunerario').value === true ||
      this.form.get('ceremoniainhumacion').value === true ||
      this.form.get('otros').value ) {
        checkedcount = true;
    }     

    if (checkedcount === false){
      this.snack.open("Debe seleccionar al menos un tipo de servicio", "OK", { duration: 2500 });
      return;
    }

    let bIsValid = false;

    if (this.form.get('serviciofunerario').value === true){
      
      if (this.Funerario_25  ===true ||
          this.Funerario_35  ===true ||
          this.Funerario_45  ===true ||
          this.Funerario_50  ===true ){
            bIsValid= true;
      }
      if (!bIsValid){
        this.snack.open("Debe seleccionar al menos un Producto de servicio funerario", "OK", { duration: 2500 });
        return;
      }
      
    }


    if (this.selectedServiciofunerario && !this.Funerario_25 && !this.Funerario_35 && !this.Funerario_45 && !this.Funerario_50)
    {
      this.snack.open("Debe seleccionar todos los servicios solicitados", "OK", { duration: 2500 });
      return;
    }

    let serviciofunerarioporc = (this.selectedServiciofunerario ? (this.Funerario_25 ? 25 : (this.Funerario_35 ? 35 : (this.Funerario_45 ? 45 : 50))) : 0);
    let staffRequest = {
      idTypeStaffRequest: this.form.value.idTypeStaffRequest,
      serviciofunerarioporc: serviciofunerarioporc,
      staffRequestEmployee: {
        idEmployee: this.form.value.idEmployee,
        idCharge: this.form.value.idCharge,
        dateAdmission: this.form.value.dateAdmission
      }
    };

    this.form.controls["staffRequest"].setValue(staffRequest);
    this.form.get('ntypeservice').setValue(Number(this.form.get('ntypeservice').value))
    // this.form.get('bmeetrequirements').setValue(Number(this.form.get('bmeetrequirements').value) === 1 ? true : false)
    this.form.get('bmeetrequirements').setValue(true);

    this.form.get('nid_person').setValue(this.nid_personActual);
    //setear si no se selecciona
    if (this.form.value.serviciosepultura == null) this.form.get('serviciosepultura').setValue(false);
    if (this.form.value.serviciofunerario == null) this.form.get('serviciofunerario').setValue(false);
    if (this.form.value.ceremoniainhumacion == null) this.form.get('ceremoniainhumacion').setValue(false);
    if (this.form.value.otros == null) this.form.get('otros').setValue(false);

    this.staffRequestVacationService.registerBurial(this.form.value).subscribe(resp => {
      this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  
  check(type: string, value: string)
  {
   

    
    if (!this.readOnlyView){
      switch (type) {
        case 'Sepultura':
          this.Sepultura_25 = (value == 'Sepultura_25');
          this.Sepultura_50 = (value == 'Sepultura_50');
          break;
      
        case 'Funerario':
          this.Funerario_25 = (value == 'Funerario_25');
          this.Funerario_35 = (value == 'Funerario_35');
          this.Funerario_45 = (value == 'Funerario_45');
          this.Funerario_50 = (value == 'Funerario_50');
          break;
    
        case 'Inhumacion':
          this.Inhumacion_50 = (value == 'Inhumacion_50');
          break;
    
        case 'Otros':
          this.Otros_50 = (value == 'Otros_50');
          this.Otros_75 = (value == 'Otros_75');
          break;
      }
    }

    
  }



  accept(): void {
    let validaSepultura = true;
    let validaFunerario = true;
    let validaInhumacion = true;
    let validaOtros = true;

    if (this.selectedServiciosepultura && !this.Sepultura_25 && !this.Sepultura_50)
      validaSepultura = false;

    if (this.selectedServiciofunerario && !this.Funerario_25 && !this.Funerario_35 && !this.Funerario_45 && !this.Funerario_50)
      validaFunerario = false;

    if (this.selectedCeremoniainhumacion && !this.Inhumacion_50)
      validaInhumacion = false;

    if (this.selectedOtros && !this.Otros_50 && !this.Otros_75)
      validaOtros = false;    
    
    if ( validaSepultura && validaFunerario && validaInhumacion && validaOtros )
    {
      let serviciosepulturaporc = (this.selectedServiciosepultura ? (this.Sepultura_25 ? 25 : 50) : 0);
      let serviciofunerarioporc = (this.selectedServiciofunerario ? (this.Funerario_25 ? 25 : (this.Funerario_35 ? 35 : (this.Funerario_45 ? 45 : 50))) : 0);
      let ceremoniainhumacionporc = (this.selectedCeremoniainhumacion ? 50 : 0);
      let otrosporc = (this.selectedOtros ? (this.Otros_50 ? 50 : 75) : 0);

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
        serviciosepulturaporc: serviciosepulturaporc,
        serviciofunerarioporc: serviciofunerarioporc, 
        ceremoniainhumacionporc: ceremoniainhumacionporc,
        otrosporc: otrosporc,
        comment: comentario
      }
  
      this.staffRequestApproverService.acceptBurial(payload).subscribe(resp => {
        this.snack.open("¡Accion realizada con exito!", "OK", { duration: 3000 });
        this.dialogRef.close(false);
      })
    }
    else{
      this.snack.open("Debe seleccionar todos los servicios solicitados", "OK", { duration: 2500 });
    }

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

    this.staffRequestApproverService.rejectBurial(payload).subscribe(resp => {
      this.snack.open("¡Accion realizada con exito!", "OK", { duration: 4000 });
      this.dialogRef.close(false);
    })

  }

  getLevel(){
    let level = this.listApprover.reduce((op, item) => op = op > item.nlevel ? op : item.nlevel, 0);
    return level + 1;
  }

}
