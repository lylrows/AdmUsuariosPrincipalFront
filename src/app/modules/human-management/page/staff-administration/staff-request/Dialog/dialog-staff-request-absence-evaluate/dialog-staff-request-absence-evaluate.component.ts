import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OthersModule } from "@app/views/others/others.module";
import { StaffRequestVacationService } from "@app/data/service/staff-request-vacation.service";
import { StaffRequestApproverService } from "@app/data/service/staff-request-approver.service";
import { StaffRequestAbsenceService } from "@app/data/service/staff-request-absence.service";
import { StaffRequestJustificationTardinessService } from "@app/data/service/staff-request-justification-tardiness.service";
import * as _moment from "moment";
import { EmployeeService } from "@app/data/service/employee.service";
@Component({
  selector: "app-dialog-staff-request-absence-evaluate",
  templateUrl: "dialog-staff-request-absence-evaluate.component.html",
  styleUrls: ["./dialog-staff-request-absence-evaluate.component.scss"],
})
export class DialogStaffRequestAbsenceEvaluateComponent implements OnInit {
  public itemForm: FormGroup;
  @ViewChild(MatTable) tableApprover: MatTable<any>;
  listApprover: any[] = [];
  idTypeStaffRequest: number;
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

  listHistoAprobaciones:any[]=[];
  id_employee:number=0;
  id_profile:number=0;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestAbsenceEvaluateComponent>,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private staffRequestAbsenceService: StaffRequestAbsenceService,
    private staffRequestJustificationtardinessService: StaffRequestJustificationTardinessService,
    private staffRequestApproverService: StaffRequestApproverService,
    private _serviceEmployee: EmployeeService,
  ) {
    const user = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.id_employee=user.id;
    this.id_profile=user.nid_profile;
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
    this.idTypeStaffRequest = item.staffRequest.idTypeStaffRequest;
    this.isAceeptOrRejected = item.staffRequest.isAceeptOrRejected;

    this.getListAprobaciones();

    let startTIME;
    if (item.startTime != null) 
      startTIME = _moment(new Date(item.startTime)).format('LT')
    
    let endTIME;
    if (item.endTime != null) 
      endTIME = _moment(new Date(item.endTime)).format('LT')
    
    this.codeEmployee = item.staffRequest.staffRequestEmployee.code
    this.dateAdmission = item.staffRequest.staffRequestEmployee.dateAdmission
    this.fullname = item.staffRequest.staffRequestEmployee.lastName + ' ' + item.staffRequest.staffRequestEmployee.motherLastName + ' ' + item.staffRequest.staffRequestEmployee.names
    this.dni = item.staffRequest.staffRequestEmployee.dni
    this.area = item.staffRequest.staffRequestEmployee.area
    this.charge = item.staffRequest.staffRequestEmployee.charge

    let employee = item.staffRequest.staffRequestEmployee;
    this.itemForm = this.fb.group({
        title: [item.title || null],
        idTypeStaffRequest: item.staffRequest.idTypeStaffRequest,
        staffRequest: [null],
        idEmployee: [item.staffRequest.idEmployee || null],
        lastName: [employee.lastName || null],
        motherLastName: [employee.motherLastName || null],
        names: [employee.names || null],
        charge: [employee.charge || null],
        dateAdmission: [employee.dateAdmission],
        area: [employee.area || null],
        idTypeAbsence: [item.idTypeAbsence],
        typeAbsence:[item.typeAbsenceName],
        support: [item.support || null, Validators.required],
        dateAbsence: [item.dateAbsence || null, Validators.required],
        tardinessDate: [item.tardinessDate || null, Validators.required],
        startTime: [startTIME || null],
        endTime: [endTIME || 0],
        id: [item.idStaffRequest || 0],
        commentEvaluation: [item.staffRequest.comment || null]
      });
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
        duration: 4000, panelClass: 'center-alert' 
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

  load() {
    this.readOnlyView = this.data.payload.readOnlyView;
    if (this.data.payload.idTypeStaffRequest == 6){
      

      this.staffRequestAbsenceService.getbyid(this.data.payload.id).subscribe(res=>{
        this.fileurl = res.data.pathFileDocument;
        
        this.buildItemForm(res.data);
        const payload = {
          FileName: '',
          FileUrl: this.fileurl,
          ContentType: '',
          File: ''
        }
  
        this._serviceEmployee.GetByFile(payload).subscribe(resp => {
          this.nameFile = resp.data.fileName;
        })
      });
    }
    else{
      
      this.staffRequestJustificationtardinessService.getbyid(this.data.payload.id).subscribe(res=>{
        this.fileurl = res.data.pathFileDocument;
       
        this.buildItemForm(res.data);
        const payload = {
          FileName: '',
          FileUrl: this.fileurl,
          ContentType: '',
          File: ''
        }
  
        this._serviceEmployee.GetByFile(payload).subscribe(resp => {
          this.nameFile = resp.data.fileName;
        })
    });
    }
    this.staffRequestApproverService.getlistbyid(this.data.payload.id).subscribe(res=>{
        this.listApprover = res.data;

    });

    this.staffRequestApproverService.getAccsesstApprover(this.data.payload.id).subscribe(res =>{ 
      this.hasAccessToApprover = res.data;
    });
  }

  approveRequest(){
    
    let staffRequestApprover: any = {
      idStaffRequest: this.itemForm.value.id,
      idTypeStaffRequest: this.itemForm.value.idTypeStaffRequest,
      level: this.getLevel(),
      comment: this.itemForm.value.commentEvaluation
    };
    this.staffRequestApproverService.approve(staffRequestApprover).subscribe(res=>{
      if (res.stateCode == 200) {
        this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
        this.dialogRef.close(false);
      } else if (res.stateCode == 400) {
        this.snack.open(res.messageError[0], "OK", { duration: 4000,  panelClass: 'center-alert'  });
      } else {
        this.snack.open("Ocurrio un error en el servidor", "Error", {
          duration: 4000,  panelClass: 'center-alert' })
        }
    });
  }

  rejectRequest(){
    //Validar si ingreso comentario
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
        this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
        this.dialogRef.close(false);
      } else if (res.stateCode == 400) {
        this.snack.open(res.messageError[0], "OK", { duration: 4000,  panelClass: 'center-alert'  });
      } else {
        this.snack.open("Ocurrio un error en el servidor", "Error", {
          duration: 4000,  panelClass: 'center-alert' })
        }
    });
  }

  getLevel(){
    let level = this.listApprover.reduce((op, item) => op = op > item.level ? op : item.level, 0);

    return level + 1;
  }
}
