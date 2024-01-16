import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '@app/data/service/employee.service';
import { StaffRequestService } from '@app/data/service/staff-request.service';
import { TypeStaffRequestService } from '@app/data/service/typestaffrequest.service';
import { DialogStaffRequestTrainingExtraComponent } from '../dialog-staff-request-training-extra/dialog-staff-request-training-extra.component';
import { DialogStaffRequestTrainingNewComponent } from '../dialog-staff-request-training-new/dialog-staff-request-training-new.component';

@Component({
  selector: 'app-dialog-staff-request-select-employee',
  templateUrl: './dialog-staff-request-select-employee.component.html',
  styleUrls: ['./dialog-staff-request-select-employee.component.scss']
})
export class DialogStaffRequestSelectEmployeeComponent implements OnInit {

  employeeF = new FormControl('', [Validators.required])
  typecapF = new FormControl('', [Validators.required])
  listtype: any[] = [];
  listEmployee: any[] = [];
  listEmployeeSelected: any[] = [];
  storage
  nid_position: number = 0;
  dataemployee: any = {};

  constructor(
    private _employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestSelectEmployeeComponent>,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private typestaffRequestService: TypeStaffRequestService,
    private staffRequestService: StaffRequestService,
  ) {
    this.storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_position = this.storage.nid_position;
  }

  ngOnInit(): void {
    this.ListEmployee();
    this.ListTypeSolicitud();
  }

  onKey(value) { 
    this.listEmployeeSelected = this.search(value);
  }

  search(value: string) { 
    let filter = value.toLowerCase();
    return this.listEmployee.filter(option => option.sfullname.toLowerCase().startsWith(filter));
  }

  ListEmployee(): void {
    this._employeeService.ListEmployeeFree(this.nid_position, this.storage.nid_employee).subscribe(resp => {
      this.listEmployee = resp;
      this.listEmployeeSelected = this.listEmployee;
      
      if (this.listEmployee.length <= 0) {
        this.dialogRef.close();
        this.snack.open('No Eres Jefe de ninguna area', 'OK', {
          duration: 3000
        })
      }
    })
  }

  ListTypeSolicitud(): void {
    this._employeeService.ListGeneric(977).subscribe(resp => {
      this.listtype = resp;
    })
  }

  cancel(): void {
    this.dialogRef.close()
  }

  select(): void {
    if (this.employeeF.invalid) {
      this.employeeF.markAllAsTouched();
      this.typecapF.markAllAsTouched();
      return;
    }

    if (this.typecapF.invalid) {
      this.typecapF.markAllAsTouched();
      return;
    }

    let dialogRef: MatDialogRef<any>;

    this.typestaffRequestService.getonlyenabled().subscribe(resp => {

      const select = resp.data.find(e => e.id === 17);
      this.staffRequestService.getemployeeChildrenById(this.employeeF.value).subscribe((res) => {
        this.dataemployee.idTypeStaffRequest = select.id,
          this.dataemployee.TypeStaffRequest = select.name,
          
        this.dataemployee.staffRequest = {
          idEmployee: res.data.idEmployee,
          idPerson: res.data.idPerson,
          dateIssue: res.data.dateissue,
          idCharge: res.data.idCharge,
          dateAdmission: res.data.dateAdmission,
          charge: res.data.charge,
          area: res.data.area,
          codeEmployee: res.data.code,
          company: res.data.company,
          names: res.data.names,
          lastName: res.data.lastName,
          motherLastName: res.data.motherLastName,
          dni: res.data.dni
        };
 
        if (this.typecapF.value === 979 || this.typecapF.value === 3666) {
          this.dialogRef.close();
          dialogRef = this.dialog.open(DialogStaffRequestTrainingNewComponent, {
            width: "720px",
            maxHeight: '650px',
            disableClose: true,
            data: { title: this.dataemployee.TypeStaffRequest, payload: this.dataemployee },
          });
        } else {
          this.dialogRef.close();
          dialogRef = this.dialog.open(DialogStaffRequestTrainingExtraComponent, {
            width: "720px",
            maxHeight: '650px',
            disableClose: true,
            data: { title: this.dataemployee.TypeStaffRequest, payload: this.dataemployee },
          });
        }

      });
    });
  }

}
