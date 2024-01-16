import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '@app/data/service/employee.service';
import { ModalPersonComponent } from '../request-edit-data/modal-person/modal-person.component';
import { ModalSocialComponent } from '../request-edit-data/modal-social/modal-social.component';
import { ModalStudyComponent } from '../request-edit-data/modal-study/modal-study.component';

@Component({
  selector: 'app-modal-request',
  templateUrl: './modal-request.component.html',
  styleUrls: ['./modal-request.component.scss']
})
export class ModalRequestComponent implements OnInit {

  idEmployee: number = 0;
  idPerson: number = 0;

  seccions: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<ModalRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _serviceEmployee: EmployeeService,
    public _dialog: MatDialog,
  ) {
    this.idEmployee = this.data.employee;
    this.idPerson = this.data.person;
  }

  ngOnInit(): void {
    this.seccions = this._serviceEmployee.getListSeccion();
  }

  changeSeccion(event): void {
    const value = Number(event.value)
    console.log("🚀 ~ ModalRequestComponent ~ changeSeccion ~ value:", value)

    const config = new MatDialogConfig();
      config.disableClose = true,
      config.width = '850px'
      config.data = { employee: this.idEmployee, person: this.idPerson }
    
    if ( value === 1 ) {
      this._dialog.open(ModalPersonComponent, config);
      this.cancel();
    } else if ( value === 2 ) {
      this._dialog.open(ModalStudyComponent, config);
      this.cancel();
    } else {
      this._dialog.open(ModalSocialComponent, config);
      this.cancel();
    }
     
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
