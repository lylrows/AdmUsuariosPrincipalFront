import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OthersModule } from "@app/views/others/others.module";
import { StaffRequestVacationService } from "@app/data/service/staff-request-vacation.service";
import { StaffRequestApproverService } from "@app/data/service/staff-request-approver.service";

@Component({
  selector: "app-dialog-staff-request-vacation-approver",
  templateUrl: "dialog-staff-request-vacation-approver.component.html",
  styleUrls: ["./dialog-staff-request-vacation-approver.component.scss"],
})
export class DialogStaffRequestVacationApproverComponent implements OnInit {
  public itemForm: FormGroup;
  @ViewChild(MatTable) tableApprover: MatTable<any>;

  codeEmployee: string = '';
  dateAdmission: string = '';
  fullname: string = '';
  dni: string = '';
  area: string = '';
  charge: string = '';

  listApprover: any[] = [];
  readOnlyView: boolean;
  isAceeptOrRejected: boolean;
  hasAccessToApprover: boolean;
  diasVacaciones: number = 0;

  exactusVacaciones:any;
  id_employee:number=0;
  id_profile:number=0;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestVacationApproverComponent>,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private staffRequestVacationService: StaffRequestVacationService,
    private staffRequestApproverService: StaffRequestApproverService
  ) {
    const user = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.id_employee=user.id;
    this.id_profile=user.nid_profile;
    this.load();
  }

  ngOnInit() {
    this.getVacationsDays()
  }

  stopProp(e) {
    e.stopPropagation();
  }

  buildItemForm(item) {
    
    this.codeEmployee = item.staffRequest.staffRequestEmployee.code
    this.dateAdmission = item.staffRequest.staffRequestEmployee.dateAdmission
    this.fullname = item.staffRequest.staffRequestEmployee.lastName + ' ' + item.staffRequest.staffRequestEmployee.motherLastName + ' ' + item.staffRequest.staffRequestEmployee.names
    this.dni = item.staffRequest.staffRequestEmployee.dni
    this.area = item.staffRequest.staffRequestEmployee.area
    this.charge = item.staffRequest.staffRequestEmployee.charge

    let employye = item.staffRequest.staffRequestEmployee;
    this.isAceeptOrRejected = item.staffRequest.isAceeptOrRejected;
    this.itemForm = this.fb.group({
      title: [item.staffRequest.typeStaffRequest || null],
      lastName: [employye.lastName || null],
      motherLastName: [employye.motherLastName || null],
      names: [employye.names || null],
      charge: [employye.charge || null],
      dateAdmission: [employye.dateAdmission || null],
      area: [employye.area || null],
      startVacation: [item.startVacation || null],
      endVacation: [item.endVacation || null],
      numberCalendarDays: [item.numberCalendarDays || 0],
      numberBusinessDays: [item.numberBusinessDays || 0],
      vacationPeriod: [item.vacationPeriod || null],
      idTypeStaffRequest: [item.staffRequest.idTypeStaffRequest],
      id: [item.idStaffRequest || 0],
      commentEvaluation: [item.staffRequest.comment || null]
    });
  }

  load() {
    this.readOnlyView = this.data.payload.readOnlyView;
    this.hasAccessToApprover = this.data.payload.evaluate;
    
    this.staffRequestVacationService.getbyid(this.data.payload.id).subscribe(res=>{
      
        this.buildItemForm(res.data);
    });
    this.staffRequestApproverService.getlistbyid(this.data.payload.id).subscribe(res=>{
        this.listApprover = res.data;
        console.log("🚀 ~ DialogStaffRequestVacationApproverComponent ~ this.staffRequestApproverService.getlistbyid ~ this.listApprover:", this.listApprover)

        // Verifica si ya aprobò
        this.listApprover.map((e) => {
          if(e.idEmployee===this.id_employee || e.idProfile===this.id_profile){
            // this.isAceeptOrRejected = true;
            this.hasAccessToApprover = false;
          }
        });
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
        this.snack.open(res.messageError[0], "OK", { duration: 4000,panelClass: 'center-alert' });
        this.dialogRef.close(false);
      } else {
        this.dialogRef.close(false);
        this.snack.open("Ocurrio un error en el servidor", "Error", {
          duration: 4000,panelClass: 'center-alert'})
        }
    });
  }

  rejectRequest(){
    
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
        this.snack.open(res.messageError[0], "OK", { duration: 4000,panelClass: 'center-alert' });
      } else {
        this.snack.open("Ocurrio un error en el servidor", "Error", {
          duration: 4000, panelClass: 'center-alert'})
        }
    });
  }

  getLevel(){
    let level = this.listApprover.reduce((op, item) => op = op > item.level ? op : item.level, 0);

    return level + 1;
  }

  getVacationsDays() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.staffRequestVacationService.GetVacationDays({
      scode_employee: storage.userName,
      idcompany: storage.nid_company
    }).subscribe((res) => {
      // this.diasVacaciones = res.data;
      this.exactusVacaciones = res.data;
      this.diasVacaciones = this.exactusVacaciones.vencido;
      // this.itemForm.get('nnumberoutstandingbalance').setValue(this.exactusVacaciones.vencido);
      // this.itemForm.get('nnumbertruncatedbalance').setValue(this.exactusVacaciones.trunco);
    }, (err) => {
      console.log('Error getVacationsDays', err);
    });
  }
}
