import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OthersModule } from "@app/views/others/others.module";
import { StaffRequestVacationService } from "@app/data/service/staff-request-vacation.service";
import { StaffRequestApproverService } from "@app/data/service/staff-request-approver.service";
import { StaffRequestLoanService } from "@app/data/service/staff-request-loan.service";
import { StaffRequestPermitService } from "@app/data/service/staff-request-permit.service";
import * as _moment from "moment";
import { EmployeeService } from "@app/data/service/employee.service";
@Component({
  selector: "app-dialog-staff-request-permit-evaluate",
  templateUrl: "dialog-staff-request-permit-evaluate.component.html",
  styleUrls: ["./dialog-staff-request-permit-evaluate.component.scss"],
})
export class DialogStaffRequestPermitEvaluateComponent implements OnInit {
  public itemForm: FormGroup;
  @ViewChild(MatTable) tableApprover: MatTable<any>;
  listApprover: any[] = [];
  readOnlyView: boolean = false;
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
    public dialogRef: MatDialogRef<DialogStaffRequestPermitEvaluateComponent>,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private staffRequestPermitService: StaffRequestPermitService,
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

    
    let startTIME;
    if (item.startTime != null) 
      startTIME = _moment(new Date(item.startTime)).format('LT')
    
    let endTIME;
    if (item.endTime != null) 
      endTIME = _moment(new Date(item.endTime)).format('LT')
    

    let employye = item.staffRequest.staffRequestEmployee;
    this.isAceeptOrRejected = item.staffRequest.isAceeptOrRejected;

    this.getListAprobaciones();
    this.codeEmployee = item.staffRequest.staffRequestEmployee.code
    this.dateAdmission = item.staffRequest.staffRequestEmployee.dateAdmission
    this.fullname = item.staffRequest.staffRequestEmployee.lastName + ' ' + item.staffRequest.staffRequestEmployee.motherLastName + ' ' + item.staffRequest.staffRequestEmployee.names
    this.dni = item.staffRequest.staffRequestEmployee.dni
    this.area = item.staffRequest.staffRequestEmployee.area
    this.charge = item.staffRequest.staffRequestEmployee.charge

    this.itemForm = this.fb.group({
      title: [item.title || null],
      idTypeStaffRequest: item.staffRequest.idTypeStaffRequest,
      staffRequest: [null],
      lastName: [employye.lastName || null],
      motherLastName: [employye.motherLastName || null],
      names: [employye.names || null],
      dateAdmission: [employye.dateAdmission],
      charge: [employye.charge || null],
      area: [employye.area || null],
      typePermitName: [item.permitTypeName || null],
      support: [item.support || null],
      permitDate: [item.permitDate || null],
      startTime: [startTIME],
      endTime: [endTIME],
      id: [item.idStaffRequest || 0],
      commentEvaluation: [item.staffRequest.comment || null]   
    });
  }

  load() {
    this.readOnlyView = this.data.payload.readOnlyView;
    this.staffRequestPermitService.getbyid(this.data.payload.id).subscribe(res => {
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
    this.staffRequestApproverService.getlistbyid(this.data.payload.id).subscribe(res => {
      this.listApprover = res.data;
    });
    this.staffRequestApproverService.getAccsesstApprover(this.data.payload.id).subscribe(res => {
      this.hasAccessToApprover = res.data;
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
        duration: 4000,
      });
    }


  }

  public base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
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
    return new Blob(byteArrays, { type: contentType });
  }

  approveRequest() {
    
    let staffRequestApprover: any = {
      idStaffRequest: this.itemForm.value.id,
      idTypeStaffRequest: this.itemForm.value.idTypeStaffRequest,
      level: this.getLevel(),
      comment: this.itemForm.value.commentEvaluation
    };
    this.staffRequestApproverService.approve(staffRequestApprover).subscribe(res => {
      if (res.stateCode == 200) {
        this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
        this.dialogRef.close(false);
      } else if (res.stateCode == 400) {
        this.snack.open(res.messageError[0], "OK", { duration: 4000 });
      } else {
        this.snack.open("Ocurrio un error en el servidor", "Error", {
          duration: 4000
        })
      }
    });
  }

  rejectRequest() {
    
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
    this.staffRequestApproverService.reject(staffRequestApprover).subscribe(res => {
      if (res.stateCode == 200) {
        this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
        this.dialogRef.close(false);
      } else if (res.stateCode == 400) {
        this.snack.open(res.messageError[0], "OK", { duration: 4000 });
      } else {
        this.snack.open("Ocurrio un error en el servidor", "Error", {
          duration: 4000
        })
      }
    });
  }

  getLevel() {
    let level = this.listApprover.reduce((op, item) => op = op > item.level ? op : item.level, 0);

    return level + 1;
  }
}
