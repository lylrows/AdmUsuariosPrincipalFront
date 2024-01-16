import { environment } from './../../../../../../../environments/environment';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterPostulantRequest, PostulantRequest } from '@app/data/schema/Postulant/postulant';
import { InformationPostulantService } from '@app/data/service/information-postulant.service';
import { PostulantFileService } from '@app/data/service/PostulantFileService';
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
import { EmployeeService } from '@app/data/service/employee.service';
import * as _moment from "moment";
import { NotificationService } from '@app/data/service/notification.service';

@Component({
  selector: 'app-dialog-postulant-internal',
  templateUrl: './dialog-postulant-internal.component.html',
  styleUrls: ['./dialog-postulant-internal.component.scss']
})
export class DialogPostulantInternalComponent implements OnInit {
  filterPostulantRequest: FilterPostulantRequest = {
    idEvaluation: 0, 
    idPostulant: 0,
    type: 'INTERNA'
  }
  postulantRequest: PostulantRequest = {
    idPostulantRequest: 0,
    idEvaluation: 0,
    idPostulant: 0,
    type: 'EXTERNA',
    firstName: '',
    secondName: '',
    lastName: '',
    motherLastName: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    idCompany: 0,
    idManagement: 0,
    idArea: 0,
    idSubArea: 0,
    idCostCenter: 0,
    position: '',
    incomeDate: '',
    endDate: '',
    contractType: 0,
    vacantType: 0,
    schedule: '',
    boss: '',
    idBoss: 0,
    idSalaryCategory: 0,
    idCampus: 0,
    user: 0,
    confirmed: false
  };
  isAdministration = false;
  permitConfirmar = false;
  permitSendExactus = false;
  public itemForm: FormGroup;
  exactuspayroll: any = [];
  exactuslocation: any = [];
  exactusafp: any = [];
  listHorarios: any[];
  listHorariosSelected: any[];
  showSendExatus: boolean = false;
  mesesDiferenciaPositionExactus: number = 0.00;
  fechaStartExactus: Date;
  fechaEndExactus: Date;
  informationPostunaltExactus: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogPostulantInternalComponent>,
    private personService: InformationPostulantService,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private postulantFileService: PostulantFileService,
    private _employeeService: EmployeeService,
    private notificationService: NotificationService
  ) { 
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.showSendExatus = environment.perfilReclutamientoRRHH.indexOf(storage.nid_profile) > -1;
    this.getExactusPayroll();
    this.getexactuslocation();
    this.GetListHorarios();
    this.getexactusafp();
  }

  ngOnInit(): void {
    
    this.filterPostulantRequest.idEvaluation = this.data.payload.data.idEvaluation;
    this.filterPostulantRequest.idPostulant = this.data.payload.data.idPostulant;
    this.isAdministration = this.data.payload.data.isAdministration;
    this.permitConfirmar = this.data.payload.data.permitConfirmar;
    this.permitSendExactus = this.data.payload.data.permitSendExactus;
    this.initFormClean();
    this.GetInformationInternalExactus();
  }

  initFormClean() {
    this.itemForm = this.fb.group({
      nid_person: [ 0],
      scodepayroll: ["E001"],
      scodelocation: ["SEDEC"],
      salaryref: [0, [Validators.maxLength(6)]],
      schedule: [""],
      scodeafp: ["99"],
      bintegralremuneration: [false],
      bfifthdiscount: [false],
      bafpmixed: [false],
      
      scuspp: [""],
      dendposition: [ ""],
      dstartposition: [""],
    });
  }
  
  updateModelPostulantRequest($event) {
    this.postulantRequest = $event;
    
  }

  submitFichaPersonal(confirmar: boolean) {
    
    if (confirmar){
      this.confirmService
          .confirm({
            title: "Confirmación",
            message: "¿Esta seguro que desea confirmar los cambios?",
          })
          .subscribe((result) => {
            if (result) {
              this.guardarInformacion(confirmar);
              this.SendNotification();
            }
          });
    } else this.guardarInformacion(confirmar);
  }

  guardarInformacion(confirmar: boolean) {
    
    if (this.showSendExatus) this.SaveInformationInternalExactus();
    this.SaveInformationPostulantRequest(confirmar);   
  }

  SaveInformationPostulantRequest(confirmar: boolean) { 
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const idUser: number = storage.id;
    if(!this.postulantRequest.confirmed) this.postulantRequest.confirmed = confirmar;
    this.postulantRequest.contractType = Number(this.postulantRequest.contractType);
    this.postulantRequest.vacantType = Number(this.postulantRequest.vacantType);
    this.postulantRequest.user = Number(idUser);
      this.personService.SavePostulantRequest(this.postulantRequest).subscribe(res => {
        
        this.postulantRequest.idPostulantRequest = res.data;
        if (res.stateCode == 200) {
          this.snack.open("Se guardo la información correctamente", "OK", { duration: 4000 });
        } else {
          this.snack.open(res.messageError[0], "Error", { duration: 4000 });
        }
      });
  }
  
  GetInformationInternalExactus() { 
    const _filter = {
      idEvaluation: this.filterPostulantRequest.idEvaluation,
      idPostulant: this.filterPostulantRequest.idPostulant,
    };
    this.personService.GetInformationInternalExactus(_filter).subscribe(res => {
      this.informationPostunaltExactus = res.data;
      this.buildItemForm(this.informationPostunaltExactus);
    });
  }

  SaveInformationInternalExactus() { 
    const payload = this.createRequestExactus();
    this.personService.SaveInformationInternalExactus(payload).subscribe(res => {
      
    });
  }

  buildItemForm(item) {
    
    this.itemForm = this.fb.group({
      nid_person: [item.idPostulant || 0],
      scodepayroll: [item.idNomina || "E001"],
      scodelocation: [item.idUbicacion || "SEDEC"],
      salaryref: [item.salary || 0, [Validators.maxLength(6)]],
      schedule: [item.schedule || ""],
      scodeafp: [item.idAfp || "99"],
      bintegralremuneration: [item.remuneracionIntegral || false],
      bfifthdiscount: [item.descontarQuinta || false],
      bafpmixed: [item.afpMixta || false],
      
      scuspp: [item.cuspp || ""],
      dendposition: [item.fechaFinCambio || ""],
      dstartposition: [item.fechaInicioCambio || ""],
    });

    if (this.itemForm.get("dendposition").value != "") {
      const valueDateEnd = this.itemForm.get('dendposition').value;
      const fechaEnd = valueDateEnd.split("/");
      const dayEnd = Number(fechaEnd[0]);
      const monthEnd = Number(fechaEnd[1]);
      const yearEnd = Number(fechaEnd[2]);
      const fechaEndDate = new Date(yearEnd, monthEnd - 1, dayEnd);
      this.fechaEndExactus = fechaEndDate;
      this.itemForm.get('dendposition').setValue(fechaEndDate);
    }

    if (this.itemForm.get("dstartposition").value != "") {
      const valueDateStart = this.itemForm.get('dstartposition').value;
      const fechaStart = valueDateStart.split("/");
      const dayStart = Number(fechaStart[0]);
      const monthStart = Number(fechaStart[1]);
      const yearStart = Number(fechaStart[2]);
      const fechaStartDate = new Date(yearStart, monthStart - 1, dayStart);
      this.fechaStartExactus = fechaStartDate;
      this.itemForm.get('dstartposition').setValue(fechaStartDate);
    }

    const fechaStart = _moment(this.fechaStartExactus);
    const fechaEnd = _moment(this.fechaEndExactus).add(1, 'days');
    this.mesesDiferenciaPositionExactus = fechaEnd.diff(fechaStart, 'months', true);
  }

  createRequestExactus() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const payload = {
      idevaluation: this.filterPostulantRequest.idEvaluation,
      idPostulant: this.filterPostulantRequest.idPostulant,
      idNomina: this.itemForm.get("scodepayroll").value,
      idUbicacion: this.itemForm.get("scodelocation").value,
      descontarQuinta: this.itemForm.get("bfifthdiscount").value,
      remuneracionIntegral: this.itemForm.get("bintegralremuneration").value,
      salary: this.itemForm.get("salaryref").value,
      schedule: this.itemForm.get("schedule").value,
      afpMixta: this.itemForm.get("bafpmixed").value,
      idAfp: this.itemForm.get("scodeafp").value,
      cuspp: this.itemForm.get("scuspp").value,
      fechaInicioCambio: this.itemForm.get("dstartposition").value != "" ? _moment(this.itemForm.get("dstartposition").value).format(
        "DD/MM/YYYY"
      ) : "",
      fechaFinCambio: this.itemForm.get("dendposition").value != "" ? _moment(this.itemForm.get("dendposition").value).format(
        "DD/MM/YYYY"
      ) : "",
      confirmed: false,
      user: storage.id
    };
    return payload;
  }

  getExactusPayroll(): void {
    this.postulantFileService.getexactuspayroll().subscribe((resp) => {
      this.exactuspayroll = resp.data;
    });
  }

  getexactuslocation(): void {
    this.postulantFileService.getexactuslocation().subscribe((resp) => {
      this.exactuslocation = resp.data;
    });
  }

  GetListHorarios() {
    this._employeeService.ListGenericByKey(environment.keyHorarioExactus).subscribe(resp => {
      this.listHorarios = resp;
      this.listHorariosSelected = this.listHorarios;
      
    })
  }

  getexactusafp(): void {
    this.postulantFileService.getexactusafp().subscribe((resp) => {
      this.exactusafp = resp.data;
    });
  }

  onKeyHorario(value) { 
    this.listHorariosSelected = this.searchHorario(value);
  }

  searchHorario(value: string) { 
    let filter = value.toLowerCase();
    return this.listHorarios.filter(option => (option.sshort_value + ' - '+ option.sdescription_value).toLowerCase().includes(filter));
  }

  changeDateExactus() {
    
    if (this.itemForm.get("dendposition").value != "") {
      this.fechaEndExactus = this.itemForm.get('dendposition').value;
    } else  {
      this.mesesDiferenciaPositionExactus = 0;
      return;
    }

    if (this.itemForm.get("dstartposition").value != "") {
      this.fechaStartExactus = this.itemForm.get('dstartposition').value;
    } else  {
      this.mesesDiferenciaPositionExactus = 0;
      return;
    }

    const fechaStart = _moment(this.fechaStartExactus);
    const fechaEnd = _moment(this.fechaEndExactus).add(1, 'days');
    this.mesesDiferenciaPositionExactus = fechaEnd.diff(fechaStart, 'months', true);
  }

  SendNotification() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const idUser: number = storage.id;
    var _notification = {
      idEvaluation: this.filterPostulantRequest.idEvaluation,
      idPostulant: idUser,
      postulantType: 'INTERNA',
      level: 2,
      completeName: this.postulantRequest.firstName + ' ' + this.postulantRequest.lastName + ' ' + this.postulantRequest.motherLastName
    };
    this.notificationService.AddNotificationFichaPersonal(_notification).subscribe(res => {
      
    });
  }
}
